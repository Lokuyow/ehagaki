import {
    createRxBackwardReq,
    type ConnectionStatePacket,
    type ErrorPacket,
    type MessagePacket,
    type RxNostr,
} from "rx-nostr";
import { isHostRelayConfigActive } from "./hostRelayRuntime";
import { resolvePostHistoryAuthoredRelayUrls } from "./postHistoryRelayResolver";
import { derivePostHistoryRelayFetchCoverage, getPostHistoryQuorumCoverage, type PostHistoryRelayCoverage, type PostHistoryRelayOutcome } from "./postHistoryRelayCoverage";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";
import { usePostHistoryRelayEvents } from "./postHistoryRawEventVerification";

export { POST_HISTORY_AUTHORED_KINDS as POST_HISTORY_FETCH_KINDS } from "./postHistoryKinds";
import { POST_HISTORY_AUTHORED_KINDS as POST_HISTORY_FETCH_KINDS } from "./postHistoryKinds";
export const POST_HISTORY_PAGE_SIZE = 50;
export const POST_HISTORY_BOOTSTRAP_FETCH_LIMIT = 150;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT = 30;
export const POST_HISTORY_OLDER_FETCH_LIMIT = 150;
export const POST_HISTORY_REPAIR_FETCH_LIMIT = 250;
export const POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS = 20_000;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS = 6_000;
export const POST_HISTORY_OLDER_FETCH_TIMEOUT_MS = 25_000;
// rx-nostr allows 30 seconds for EOSE and AUTH. Manual repair must not cut
// that protocol-level retry path short.
export const POST_HISTORY_REPAIR_FETCH_TIMEOUT_MS = 35_000;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_TTL_MS = 60_000;
export const POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT = 4;
export const POST_HISTORY_RELAY_FETCH_LIMIT = POST_HISTORY_OLDER_FETCH_LIMIT;
export const POST_HISTORY_INITIAL_FETCH_LIMIT = POST_HISTORY_BOOTSTRAP_FETCH_LIMIT;
export const POST_HISTORY_FETCH_TIMEOUT_MS = POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS;

export type PostHistoryFetchReason =
    | "bootstrap"
    | "dialog-open-refresh"
    | "dialog-open-catchup"
    | "visibility-resume"
    | "foreground-periodic"
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
    /** Completed query evidence; independent of the task's timeout/error status. */
    relayFetchCoverage?: PostHistoryRelayCoverage[];
    relayOutcomes?: PostHistoryRelayOutcome[];
    canonicalRelayUrls?: string[];
    coverageRequestRange?: { since: number | null; until: number };
    /** Repair summaries retained internally while callers use the same quorum policy. */
    coverageRelayUrls?: string[];
    coverageEoseRelayUrls?: string[];
    bestEffortRelayUrls?: string[];
    coverageComplete?: boolean;
    coverageSaturated?: boolean;
    allCoverageRelaysFailed?: boolean;
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
            case "visibility-resume":
            case "foreground-periodic":
                return POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT;
            case "dialog-open-catchup":
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
        case "dialog-open-catchup":
        case "visibility-resume":
        case "foreground-periodic":
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

type RelayFetchState = RelayPacketAccumulator & {
    relayUrl: string;
    subId: string;
    request: ReturnType<typeof createRxBackwardReq>;
    subscription?: SubscriptionLike;
    eoseReceived: boolean;
    verificationDrained: boolean;
    finished: boolean;
    failed: boolean;
};

export class PostHistoryRelayFetchService {
    private setTimeoutFn: NonNullable<PostHistoryRelayFetchServiceDeps["setTimeoutFn"]>;
    private clearTimeoutFn: NonNullable<PostHistoryRelayFetchServiceDeps["clearTimeoutFn"]>;
    private now: () => number;

    constructor(deps: PostHistoryRelayFetchServiceDeps = {}) {
        this.setTimeoutFn = deps.setTimeoutFn ?? ((handler, timeout) => setTimeout(handler, timeout));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((timer) => clearTimeout(timer));
        this.now = deps.now ?? Date.now;
    }

    fetchLatest(rxNostr: RxNostr, params: PostHistoryRelayFetchRequest): PostHistoryRelayFetchTask {
        const startedAt = this.now();
        const kinds = params.kinds ?? [...POST_HISTORY_FETCH_KINDS];
        const limit = resolveFetchLimit(params.reason, params.limit);
        const timeoutMs = resolveFetchTimeoutMs(params.reason, params.timeoutMs);
        const canonicalRelayUrls = resolvePostHistoryAuthoredRelayUrls(params.relayConfig);
        const recent = ["dialog-open-refresh", "visibility-resume", "foreground-periodic"].includes(params.reason ?? "");
        const relayUrls = recent && !isHostRelayConfigActive()
            ? canonicalRelayUrls.slice(0, POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT) : canonicalRelayUrls;
        const coverageUntil = params.until ?? Math.max(0, Math.floor(startedAt / 1000));
        const eventsById = new Map<string, EventAccumulator>();
        const states = relayUrls.map((relayUrl): RelayFetchState => {
            const requestId = buildRepairFetchRxReqId();
            return { relayUrl, subId: `${requestId}:0`, request: createRxBackwardReq(requestId),
                rawCount: 0, eventIds: new Set(), oldestCreatedAt: null, newestCreatedAt: null,
                eoseReceived: false, verificationDrained: false, finished: false, failed: false };
        });
        const stateByRelay = new Map(states.map((state) => [state.relayUrl, state]));
        const eventRelayUrls = new Set<string>();
        const closedRelayUrls = new Set<string>();
        const noticeRelayUrls = new Set<string>();
        const errorRelayUrls = new Set<string>();
        const downRelayUrls = new Set<string>();
        const diagnostics: SubscriptionLike[] = [];
        let resolved = false;
        let launching = true;
        let completionScheduled = false;
        let completedByRxNostr = false;
        let completedByLocalTimeout = false;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let finish: (status: PostHistoryRelayFetchStatus) => void = () => undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) this.clearTimeoutFn(timeoutId);
            timeoutId = undefined;
            states.forEach((state) => state.subscription?.unsubscribe?.());
            diagnostics.forEach((subscription) => subscription.unsubscribe?.());
        };
        const buildResult = (status: PostHistoryRelayFetchStatus): PostHistoryRelayFetchResult => {
            const events = toResultEvents(eventsById);
            const timestamps = events.map(({ event }) => event.created_at);
            const oldestCreatedAt = timestamps.length ? Math.min(...timestamps) : null;
            const newestCreatedAt = timestamps.length ? Math.max(...timestamps) : null;
            const relayOutcomes = states.map((state): PostHistoryRelayOutcome => ({
                relayUrl: state.relayUrl, eoseReceived: state.eoseReceived,
                verificationDrained: state.verificationDrained,
                termination: status === "cancelled" ? "cancelled"
                    : state.eoseReceived && state.verificationDrained ? "eose"
                    : state.failed ? "error" : "timeout",
                rawCount: state.rawCount, oldestCreatedAt: state.oldestCreatedAt,
                saturated: state.rawCount >= limit,
            }));
            const relayFetchCoverage = derivePostHistoryRelayFetchCoverage({
                since: params.since, until: coverageUntil, oldestCreatedAt,
                outcomes: relayOutcomes, cancelled: status === "cancelled",
            });
            const eoseRelayUrls = states.filter((state) => state.eoseReceived).map((state) => state.relayUrl);
            const completedRelays = relayOutcomes.filter((outcome) => outcome.termination === "eose");
            const quorumReached = canonicalRelayUrls.length > 0
                && completedRelays.length >= Math.ceil(canonicalRelayUrls.length / 2);
            const fullRequestCovered = params.since !== undefined && getPostHistoryQuorumCoverage(relayFetchCoverage, canonicalRelayUrls)
                .some((range) => range.since <= params.since! && range.until >= coverageUntil);
            const perRelayCounts = states.filter((state) => state.rawCount || state.eventIds.size)
                .map((state) => ({ relayUrl: state.relayUrl, rawCount: state.rawCount, uniqueCount: state.eventIds.size }))
                .sort((a, b) => a.relayUrl.localeCompare(b.relayUrl));
            const cursors = states.flatMap((state) => state.oldestCreatedAt === null ? [] : [state.oldestCreatedAt]);
            const rawCount = states.reduce((count, state) => count + state.rawCount, 0);
            const hasMore = relayOutcomes.some((outcome) => outcome.saturated);
            const hasAnyRelayResponse = eventRelayUrls.size > 0 || eoseRelayUrls.length > 0 || noticeRelayUrls.size > 0;
            const allRelaysFailed = states.length > 0 && !hasAnyRelayResponse && states.every((state) => state.failed);
            return {
                status, events, fetchedAt: this.now(), nextUntil: cursors.length ? Math.max(...cursors) : null,
                hasMore, relayUrls, observedRelayUrls: perRelayCounts.map((item) => item.relayUrl),
                rawCount, uniqueCount: events.length, duplicateCount: Math.max(0, rawCount - events.length),
                perRelayCounts, oldestCreatedAt, newestCreatedAt, requestedRelayUrls: relayUrls,
                eventRelayUrls: toSortedRelayUrls(eventRelayUrls), eoseRelayUrls,
                closedRelayUrls: toSortedRelayUrls(closedRelayUrls), errorRelayUrls: toSortedRelayUrls(errorRelayUrls),
                downRelayUrls: toSortedRelayUrls(downRelayUrls), completedByRxNostr, completedByLocalTimeout,
                hasAnyRelayResponse, allRelaysFailed, canonicalRelayUrls, relayOutcomes, relayFetchCoverage,
                coverageRequestRange: { since: params.since ?? null, until: coverageUntil },
                ...(params.reason === "repair-visible-range" ? {
                    coverageRelayUrls: canonicalRelayUrls, coverageEoseRelayUrls: completedRelays.map((relay) => relay.relayUrl),
                    bestEffortRelayUrls: [], coverageComplete: quorumReached && fullRequestCovered,
                    coverageSaturated: hasMore && !fullRequestCovered, allCoverageRelaysFailed: allRelaysFailed,
                } : {}),
            };
        };
        const tryFinish = () => {
            if (resolved || completionScheduled) return;
            completionScheduled = true;
            // rx-nostr can complete use() before the same terminal packet reaches
            // all-message observers. Reconcile both signals after that dispatch.
            queueMicrotask(() => {
                completionScheduled = false;
                if (resolved || launching || !states.every((state) => state.finished)) return;
                completedByRxNostr = true;
                finish(states.length && states.every((state) => state.failed) ? "error" : "success");
            });
        };
        const readState = (from: string | undefined) => {
            const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(from ? [from] : [])[0];
            return relayUrl ? stateByRelay.get(relayUrl) : undefined;
        };
        const promise = new Promise<PostHistoryRelayFetchResult>((resolve) => {
            finish = (status) => {
                if (resolved) return;
                resolved = true;
                cleanup();
                resolve(buildResult(status));
            };
            if (!states.length) {
                launching = false;
                finish("error");
                return;
            }
            try {
                const subscribeDiagnostic = <TPacket>(
                    source: { subscribe: (observer: { next: (packet: TPacket) => void }) => SubscriptionLike } | undefined,
                    next: (packet: TPacket) => void,
                ) => {
                    if (source) diagnostics.push(source.subscribe({ next }));
                };
                subscribeDiagnostic(rxNostr.createAllMessageObservable?.(), (packet: MessagePacket) => {
                    const state = readState(packet.from);
                    if (!state || resolved) return;
                    if (packet.type === "NOTICE") { noticeRelayUrls.add(state.relayUrl); return; }
                    if ((packet as { subId?: string }).subId !== state.subId) return;
                    if (packet.type === "EVENT") { if (!state.finished) state.rawCount += 1; return; }
                    if (packet.type === "EOSE") { state.eoseReceived = true; return; }
                    if (packet.type === "CLOSED") {
                        closedRelayUrls.add(state.relayUrl);
                        const notice = (packet as { notice?: string }).notice;
                        if (!notice?.startsWith("auth-required:")) state.failed = true;
                    }
                });
                subscribeDiagnostic(rxNostr.createAllErrorObservable?.(), (packet: ErrorPacket) => {
                    const state = readState(packet.from);
                    if (state && !state.finished) { state.failed = true; errorRelayUrls.add(state.relayUrl); }
                });
                subscribeDiagnostic(rxNostr.createConnectionStateObservable?.(), (packet: ConnectionStatePacket) => {
                    const state = readState(packet.from);
                    if (state && !state.finished && ["error", "rejected", "terminated"].includes(packet.state)) {
                        state.failed = true; downRelayUrls.add(state.relayUrl);
                    }
                });
                timeoutId = this.setTimeoutFn(() => {
                    completedByLocalTimeout = true;
                    finish("timeout");
                }, timeoutMs);
                for (const state of states) {
                    state.subscription = usePostHistoryRelayEvents(rxNostr, state.request, { on: { relays: [state.relayUrl] } }).subscribe({
                        next: (packet) => {
                            if (resolved) return;
                            const event = packet.event;
                            if (event.pubkey !== params.pubkeyHex || !kinds.includes(event.kind)
                                || (params.since !== undefined && event.created_at < params.since)
                                || (params.until !== undefined && event.created_at > params.until)) return;
                            eventRelayUrls.add(state.relayUrl);
                            state.eventIds.add(event.id);
                            state.oldestCreatedAt = Math.min(state.oldestCreatedAt ?? event.created_at, event.created_at);
                            state.newestCreatedAt = Math.max(state.newestCreatedAt ?? event.created_at, event.created_at);
                            // Real transports report raw packets independently. Injected sources may only expose verified packets.
                            if (!rxNostr.createAllMessageObservable) state.rawCount += 1;
                            const existing = eventsById.get(event.id);
                            if (!existing) eventsById.set(event.id, { event, relayUrls: new Set([state.relayUrl]) });
                            else if (isSameSignedNostrEvent(existing.event, event)) existing.relayUrls.add(state.relayUrl);
                        },
                        complete: () => {
                            state.verificationDrained = true;
                            state.finished = true;
                            tryFinish();
                        },
                        error: () => {
                            state.finished = true; state.failed = true;
                            errorRelayUrls.add(state.relayUrl); tryFinish();
                        },
                    });
                    if (resolved) { state.subscription?.unsubscribe?.(); break; }
                    if (!state.finished) {
                        state.request.emit({ authors: [params.pubkeyHex], kinds, limit,
                            ...(params.since === undefined ? {} : { since: params.since }),
                            ...(params.until === undefined ? {} : { until: params.until }) });
                        state.request.over();
                    }
                }
                launching = false;
                tryFinish();
            } catch {
                finish("error");
            }
        });
        return { promise, cancel: () => finish("cancelled") };
    }
}

export const postHistoryRelayFetchService = new PostHistoryRelayFetchService();
