import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_FETCH_KINDS = [1, 42] as const;
export const POST_HISTORY_PAGE_SIZE = 50;
export const POST_HISTORY_RELAY_FETCH_LIMIT = 200;
export const POST_HISTORY_INITIAL_FETCH_LIMIT = POST_HISTORY_RELAY_FETCH_LIMIT;
export const POST_HISTORY_FETCH_TIMEOUT_MS = 60000;

export type PostHistoryRelayFetchStatus = "success" | "timeout" | "error" | "cancelled";

export interface PostHistoryRelayFetchRequest {
    pubkeyHex: string;
    relayConfig?: RelayConfig | null;
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
};

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
        const timeoutMs = params.timeoutMs ?? POST_HISTORY_FETCH_TIMEOUT_MS;
        const kinds = params.kinds ?? [...POST_HISTORY_FETCH_KINDS];
        const limit = Number.isFinite(params.limit)
            ? Math.max(1, Math.trunc(params.limit ?? POST_HISTORY_INITIAL_FETCH_LIMIT))
            : POST_HISTORY_INITIAL_FETCH_LIMIT;
        const relayUrls = this.resolveRelayUrls(params.relayConfig);

        const rxReq = createRxBackwardReq();
        const eventsById = new Map<string, EventAccumulator>();
        const relayPackets = new Map<string, RelayPacketAccumulator>();
        let rawCount = 0;
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((status: PostHistoryRelayFetchStatus) => void) | undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }

            subscription?.unsubscribe?.();
            subscription = undefined;
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

            return {
                status,
                events,
                fetchedAt: this.now(),
                nextUntil: oldestCreatedAt,
                hasMore: events.length >= limit,
                relayUrls,
                observedRelayUrls: perRelayCounts.map((item) => item.relayUrl),
                rawCount,
                uniqueCount: events.length,
                duplicateCount: Math.max(0, rawCount - events.length),
                perRelayCounts,
                oldestCreatedAt,
                newestCreatedAt,
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
                subscription = relayUrls.length > 0
                    ? rxNostr.use(rxReq, { on: { relays: relayUrls } }).subscribe({
                        next: (packet: { event?: NostrEvent; from?: string }) => {
                            rawCount = this.handlePacket(eventsById, relayPackets, rawCount, packet);
                        },
                        complete: () => safeResolve("success"),
                        error: (error: unknown) => {
                            this.console.error("post_history_fetch_error", error);
                            safeResolve("error");
                        },
                    })
                    : rxNostr.use(rxReq).subscribe({
                        next: (packet: { event?: NostrEvent; from?: string }) => {
                            rawCount = this.handlePacket(eventsById, relayPackets, rawCount, packet);
                        },
                        complete: () => safeResolve("success"),
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

    private resolveRelayUrls(relayConfig?: RelayConfig | null): string[] {
        const readRelays = relayConfig
            ? RelayConfigUtils.extractReadRelays(relayConfig)
            : [];

        if (readRelays.length > 0) {
            return RelayConfigUtils.sanitizeExternalRelayUrls(readRelays);
        }

        return RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS);
    }

    private handlePacket(
        eventsById: Map<string, EventAccumulator>,
        relayPackets: Map<string, RelayPacketAccumulator>,
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
            const relayAccumulator = relayPackets.get(relayUrl) ?? {
                rawCount: 0,
                eventIds: new Set<string>(),
            };
            relayAccumulator.rawCount += 1;
            relayAccumulator.eventIds.add(event.id);
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
}

export const postHistoryRelayFetchService = new PostHistoryRelayFetchService();
