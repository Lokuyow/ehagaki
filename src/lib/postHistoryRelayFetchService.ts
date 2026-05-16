import {
    createRxBackwardReq,
    type ConnectionStatePacket,
    type ErrorPacket,
    type MessagePacket,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_FETCH_KINDS = [1, 42] as const;
export const POST_HISTORY_PAGE_SIZE = 50;
export const POST_HISTORY_BOOTSTRAP_FETCH_LIMIT = 150;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT = 30;
export const POST_HISTORY_OLDER_FETCH_LIMIT = 150;
export const POST_HISTORY_REPAIR_FETCH_LIMIT = 250;
export const POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS = 20_000;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS = 6_000;
export const POST_HISTORY_OLDER_FETCH_TIMEOUT_MS = 25_000;
export const POST_HISTORY_REPAIR_FETCH_TIMEOUT_MS = 20_000;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_TTL_MS = 60_000;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT = 4;
export const POST_HISTORY_RELAY_FETCH_LIMIT = POST_HISTORY_OLDER_FETCH_LIMIT;
export const POST_HISTORY_INITIAL_FETCH_LIMIT = POST_HISTORY_BOOTSTRAP_FETCH_LIMIT;
export const POST_HISTORY_FETCH_TIMEOUT_MS = POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS;

export type PostHistoryFetchReason =
    | "bootstrap"
    | "dialog-open-refresh"
    | "older-backfill"
    | "repair-visible-range";

export type PostHistoryRelayFetchStatus = "success" | "timeout" | "error" | "cancelled";

export interface PostHistoryRelayFetchRequest {
    pubkeyHex: string;
    relayConfig?: RelayConfig | null;
    reason?: PostHistoryFetchReason;
    kinds?: number[];
    limit?: number;
    since?: number;
    until?: number;
    timeoutMs?: number;
}

export interface PostHistoryRelayFetchedEvent {
    event: NostrEvent;
    relayUrls: string[];
}

export interface PostHistoryRelayPerRelayCount {
    relayUrl: string;
    rawCount: number;
    uniqueCount: number;
}

export interface PostHistoryRelayFetchResult {
    status: PostHistoryRelayFetchStatus;
    events: PostHistoryRelayFetchedEvent[];
    fetchedAt: number;
    nextUntil: number | null;
    hasMore: boolean;
    relayUrls: string[];
    observedRelayUrls: string[];
    rawCount: number;
    uniqueCount: number;
    duplicateCount: number;
    perRelayCounts: PostHistoryRelayPerRelayCount[];
    oldestCreatedAt: number | null;
    newestCreatedAt: number | null;
    requestedRelayUrls: string[];
    eventRelayUrls: string[];
    eoseRelayUrls: string[];
    closedRelayUrls: string[];
    errorRelayUrls: string[];
    downRelayUrls: string[];
    completedByRxNostr: boolean;
    completedByLocalTimeout: boolean;
    hasAnyRelayResponse: boolean;
    allRelaysFailed: boolean;
}

export interface PostHistoryRelayFetchTask {
    promise: Promise<PostHistoryRelayFetchResult>;
    cancel: () => void;
}

export interface PostHistoryRelayFetchServiceDeps {
    console?: Console;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
    now?: () => number;
}

type EventAccumulator = {
    event: NostrEvent;
    relayUrls: Set<string>;
};

type RelayPacketAccumulator = {
    rawCount: number;
    eventIds: Set<string>;
    oldestCreatedAt: number | null;
    newestCreatedAt: number | null;
};

type SubscriptionLike = {
    unsubscribe?: () => void;
};

function toSortedRelayUrls(relayUrls: Set<string>): string[] {
    return Array.from(relayUrls).sort((left, right) => left.localeCompare(right));
}

function buildRepairFetchRxReqId(): string {
    const randomValue = Math.random().toString(36).slice(2, 10);
    return `post-history-repair-${Date.now().toString(36)}-${randomValue}`;
}

function resolveFetchLimit(
    reason: PostHistoryFetchReason | undefined,
    limit: number | undefined,
): number {
    const fallback = (() => {
        switch (reason) {
            case "dialog-open-refresh":
                return POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT;
            case "older-backfill":
                return POST_HISTORY_OLDER_FETCH_LIMIT;
            case "repair-visible-range":
                return POST_HISTORY_REPAIR_FETCH_LIMIT;
            case "bootstrap":
            default:
                return POST_HISTORY_BOOTSTRAP_FETCH_LIMIT;
        }
    })();

    return Number.isFinite(limit)
        ? Math.max(1, Math.trunc(limit ?? fallback))
        : fallback;
}

function resolveFetchTimeoutMs(
    reason: PostHistoryFetchReason | undefined,
    timeoutMs: number | undefined,
): number {
    if (Number.isFinite(timeoutMs)) {
        return Math.max(1, Math.trunc(timeoutMs ?? 1));
    }

    switch (reason) {
        case "dialog-open-refresh":
            return POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS;
        case "older-backfill":
            return POST_HISTORY_OLDER_FETCH_TIMEOUT_MS;
        case "repair-visible-range":
            return POST_HISTORY_REPAIR_FETCH_TIMEOUT_MS;
        case "bootstrap":
        default:
            return POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS;
    }
}

function toResultEvents(eventsById: Map<string, EventAccumulator>): PostHistoryRelayFetchedEvent[] {
    return Array.from(eventsById.values())
        .map((item) => ({
            event: item.event,
            relayUrls: Array.from(item.relayUrls),
        }))
        .sort((left, right) => right.event.created_at - left.event.created_at);
}

export class PostHistoryRelayFetchService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private now: () => number;

    constructor(deps: PostHistoryRelayFetchServiceDeps = {}) {
        this.console = deps.console || (typeof console !== "undefined"
            ? console
            : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console);
        this.setTimeoutFn = deps.setTimeoutFn || ((fn: () => void, ms: number) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn || ((id: ReturnType<typeof setTimeout>) => clearTimeout(id));
        this.now = deps.now || Date.now;
    }

    fetchLatest(
        rxNostr: RxNostr,
        params: PostHistoryRelayFetchRequest,
    ): PostHistoryRelayFetchTask {
        const timeoutMs = resolveFetchTimeoutMs(params.reason, params.timeoutMs);
        const kinds = params.kinds ?? [...POST_HISTORY_FETCH_KINDS];
        const limit = resolveFetchLimit(params.reason, params.limit);
        const relayUrls = this.resolveRelayUrls(params.relayConfig, params.reason);

        const rxReqId = buildRepairFetchRxReqId();
        const rxReq = createRxBackwardReq(rxReqId);
        const targetSubId = `${rxReqId}:0`;
        const eventsById = new Map<string, EventAccumulator>();
        const relayPackets = new Map<string, RelayPacketAccumulator>();
        const eventRelayUrls = new Set<string>();
        const eoseRelayUrls = new Set<string>();
        const closedRelayUrls = new Set<string>();
        const noticeRelayUrls = new Set<string>();
        const errorRelayUrls = new Set<string>();
        const downRelayUrls = new Set<string>();
        let rawCount = 0;
        let resolved = false;
        let completedByRxNostr = false;
        let completedByLocalTimeout = false;
        let subscription: SubscriptionLike | undefined;
        let messageSubscription: SubscriptionLike | undefined;
        let errorSubscription: SubscriptionLike | undefined;
        let connectionStateSubscription: SubscriptionLike | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((status: PostHistoryRelayFetchStatus) => void) | undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }

            subscription?.unsubscribe?.();
            subscription = undefined;
            messageSubscription?.unsubscribe?.();
            messageSubscription = undefined;
            errorSubscription?.unsubscribe?.();
            errorSubscription = undefined;
            connectionStateSubscription?.unsubscribe?.();
            connectionStateSubscription = undefined;
        };

        const buildResult = (status: PostHistoryRelayFetchStatus): PostHistoryRelayFetchResult => {
            const events = toResultEvents(eventsById);
            const oldestCreatedAt = events.reduce<number | null>((oldest, item) => (
                oldest === null || item.event.created_at < oldest
                    ? item.event.created_at
                    : oldest
            ), null);
            const newestCreatedAt = events.reduce<number | null>((newest, item) => (
                newest === null || item.event.created_at > newest
                    ? item.event.created_at
                    : newest
            ), null);
            const perRelayCounts = Array.from(relayPackets.entries())
                .map(([relayUrl, accumulator]) => ({
                    relayUrl,
                    rawCount: accumulator.rawCount,
                    uniqueCount: accumulator.eventIds.size,
                }))
                .sort((left, right) => left.relayUrl.localeCompare(right.relayUrl));
            const nextUntilCandidates = Array.from(relayPackets.values())
                .map((accumulator) => accumulator.oldestCreatedAt)
                .filter((createdAt): createdAt is number => typeof createdAt === "number");
            const nextUntil = nextUntilCandidates.reduce<number | null>((cursor, createdAt) => (
                cursor === null || createdAt > cursor
                    ? createdAt
                    : cursor
            ), null);
            const hasMore = events.length >= limit
                || perRelayCounts.some((item) => item.rawCount >= limit);
            const requestedRelayUrls = [...relayUrls];
            const responseRelayUrls = new Set([
                ...eventRelayUrls,
                ...eoseRelayUrls,
                ...noticeRelayUrls,
            ]);
            const failedRelayUrls = new Set([
                ...closedRelayUrls,
                ...errorRelayUrls,
                ...downRelayUrls,
            ]);
            const hasAnyRelayResponse = responseRelayUrls.size > 0;
            const allRelaysFailed = requestedRelayUrls.length > 0
                && !hasAnyRelayResponse
                && requestedRelayUrls.every((relayUrl) => failedRelayUrls.has(relayUrl));

            return {
                status,
                events,
                fetchedAt: this.now(),
                nextUntil,
                hasMore,
                relayUrls,
                observedRelayUrls: perRelayCounts.map((item) => item.relayUrl),
                rawCount,
                uniqueCount: events.length,
                duplicateCount: Math.max(0, rawCount - events.length),
                perRelayCounts,
                oldestCreatedAt,
                newestCreatedAt,
                requestedRelayUrls,
                eventRelayUrls: toSortedRelayUrls(eventRelayUrls),
                eoseRelayUrls: toSortedRelayUrls(eoseRelayUrls),
                closedRelayUrls: toSortedRelayUrls(closedRelayUrls),
                errorRelayUrls: toSortedRelayUrls(errorRelayUrls),
                downRelayUrls: toSortedRelayUrls(downRelayUrls),
                completedByRxNostr,
                completedByLocalTimeout,
                hasAnyRelayResponse,
                allRelaysFailed,
            };
        };

        const safeResolveFactory = (
            resolve: (result: PostHistoryRelayFetchResult) => void,
        ) => (status: PostHistoryRelayFetchStatus) => {
            if (resolved) {
                return;
            }

            resolved = true;
            cleanup();
            resolve(buildResult(status));
        };

        const promise = new Promise<PostHistoryRelayFetchResult>((resolve) => {
            const safeResolve = safeResolveFactory(resolve);
            resolveTask = safeResolve;

            try {
                messageSubscription = rxNostr.createAllMessageObservable?.().subscribe({
                    next: (packet: MessagePacket) => {
                        this.handleMessagePacket({
                            packet,
                            targetSubId,
                            requestedRelayUrls: relayUrls,
                            eoseRelayUrls,
                            closedRelayUrls,
                            noticeRelayUrls,
                        });
                    },
                });
                errorSubscription = rxNostr.createAllErrorObservable?.().subscribe({
                    next: (packet: ErrorPacket) => {
                        const relayUrl = this.sanitizeRelayUrl(packet.from);
                        if (relayUrl && relayUrls.includes(relayUrl)) {
                            errorRelayUrls.add(relayUrl);
                        }
                    },
                });
                connectionStateSubscription = rxNostr.createConnectionStateObservable?.().subscribe({
                    next: (packet: ConnectionStatePacket) => {
                        const relayUrl = this.sanitizeRelayUrl(packet.from);
                        if (
                            relayUrl
                            && relayUrls.includes(relayUrl)
                            && (packet.state === "error" || packet.state === "rejected")
                        ) {
                            downRelayUrls.add(relayUrl);
                        }
                    },
                });

                subscription = relayUrls.length > 0
                    ? rxNostr.use(rxReq, { on: { relays: relayUrls } }).subscribe({
                        next: (packet: { event?: NostrEvent; from?: string }) => {
                            rawCount = this.handlePacket(eventsById, relayPackets, eventRelayUrls, rawCount, packet);
                        },
                        complete: () => {
                            completedByRxNostr = true;
                            safeResolve("success");
                        },
                        error: (error: unknown) => {
                            this.console.error("post_history_fetch_error", error);
                            safeResolve("error");
                        },
                    })
                    : rxNostr.use(rxReq).subscribe({
                        next: (packet: { event?: NostrEvent; from?: string }) => {
                            rawCount = this.handlePacket(eventsById, relayPackets, eventRelayUrls, rawCount, packet);
                        },
                        complete: () => {
                            completedByRxNostr = true;
                            safeResolve("success");
                        },
                        error: (error: unknown) => {
                            this.console.error("post_history_fetch_error", error);
                            safeResolve("error");
                        },
                    });

                rxReq.emit({
                    authors: [params.pubkeyHex],
                    kinds,
                    limit,
                    ...(typeof params.since === "number" ? { since: params.since } : {}),
                    ...(typeof params.until === "number" ? { until: params.until } : {}),
                });
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("post_history_fetch_timeout", params.pubkeyHex);
                    completedByLocalTimeout = true;
                    safeResolve("timeout");
                }, timeoutMs);
            } catch (error) {
                this.console.error("post_history_fetch_request_error", error);
                safeResolve("error");
            }
        });

        return {
            promise,
            cancel: () => {
                resolveTask?.("cancelled");
            },
        };
    }

    private resolveRelayUrls(
        relayConfig?: RelayConfig | null,
        reason?: PostHistoryFetchReason,
    ): string[] {
        const historyRelays = relayConfig
            ? RelayConfigUtils.sanitizeExternalRelayUrls([
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
                ...RelayConfigUtils.extractReadRelays(relayConfig),
            ])
            : [];

        const relayUrls = historyRelays.length > 0
            ? historyRelays
            : RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS);

        return reason === "dialog-open-refresh"
            ? relayUrls.slice(0, POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT)
            : relayUrls;
    }

    private handlePacket(
        eventsById: Map<string, EventAccumulator>,
        relayPackets: Map<string, RelayPacketAccumulator>,
        eventRelayUrls: Set<string>,
        currentRawCount: number,
        packet: { event?: NostrEvent; from?: string },
    ): number {
        const event = packet.event;
        if (!event?.id) {
            return currentRawCount;
        }

        const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof packet.from === "string" ? [packet.from] : [],
        )[0];
        if (relayUrl) {
            eventRelayUrls.add(relayUrl);
            const relayAccumulator = relayPackets.get(relayUrl) ?? {
                rawCount: 0,
                eventIds: new Set<string>(),
                oldestCreatedAt: null,
                newestCreatedAt: null,
            };
            relayAccumulator.rawCount += 1;
            relayAccumulator.eventIds.add(event.id);
            relayAccumulator.oldestCreatedAt = relayAccumulator.oldestCreatedAt === null
                ? event.created_at
                : Math.min(relayAccumulator.oldestCreatedAt, event.created_at);
            relayAccumulator.newestCreatedAt = relayAccumulator.newestCreatedAt === null
                ? event.created_at
                : Math.max(relayAccumulator.newestCreatedAt, event.created_at);
            relayPackets.set(relayUrl, relayAccumulator);
        }

        const nextRawCount = currentRawCount + 1;
        const existing = eventsById.get(event.id);

        if (!existing) {
            eventsById.set(event.id, {
                event,
                relayUrls: new Set(relayUrl ? [relayUrl] : []),
            });
            return nextRawCount;
        }

        if (!isSameSignedNostrEvent(existing.event, event)) {
            this.console.warn("post_history_fetch_packet_conflict", event.id);
            return nextRawCount;
        }

        if (relayUrl) {
            existing.relayUrls.add(relayUrl);
        }

        return nextRawCount;
    }

    private handleMessagePacket(params: {
        packet: MessagePacket;
        targetSubId: string;
        requestedRelayUrls: string[];
        eoseRelayUrls: Set<string>;
        closedRelayUrls: Set<string>;
        noticeRelayUrls: Set<string>;
    }): void {
        const relayUrl = this.sanitizeRelayUrl(params.packet.from);
        if (!relayUrl || !params.requestedRelayUrls.includes(relayUrl)) {
            return;
        }

        if (params.packet.type === "EOSE" && params.packet.subId === params.targetSubId) {
            params.eoseRelayUrls.add(relayUrl);
            return;
        }

        if (params.packet.type === "CLOSED" && params.packet.subId === params.targetSubId) {
            params.closedRelayUrls.add(relayUrl);
            return;
        }

        if (params.packet.type === "NOTICE") {
            params.noticeRelayUrls.add(relayUrl);
        }
    }

    private sanitizeRelayUrl(relayUrl: string | undefined): string | null {
        return RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof relayUrl === "string" ? [relayUrl] : [],
        )[0] ?? null;
    }
}

export const postHistoryRelayFetchService = new PostHistoryRelayFetchService();
