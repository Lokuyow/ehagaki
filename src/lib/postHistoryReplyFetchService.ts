import {
    createRxBackwardReq,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_DIRECT_REPLY_FETCH_LIMIT = 100;
export const POST_HISTORY_DIRECT_REPLY_FETCH_LOOKBACK_SECONDS = 86_400;
const POST_HISTORY_DIRECT_REPLY_FETCH_TIMEOUT_MS = 6_000;
const POST_HISTORY_DIRECT_REPLY_RELAY_LIMIT = 8;

export interface PostHistoryReplyFetchRequest {
    eventId: string;
    createdAt: number;
    relayHints?: string[];
    relayConfig?: RelayConfig | null;
    limit?: number;
    timeoutMs?: number;
}

export interface PostHistoryReplyFetchedEvent {
    event: NostrEvent;
    relayUrls: string[];
}

export interface PostHistoryReplyFetchResult {
    events: PostHistoryReplyFetchedEvent[];
    fetchedAt: number;
    relayUrls: string[];
}

export interface PostHistoryReplyFetchTask {
    promise: Promise<PostHistoryReplyFetchResult>;
    cancel: () => void;
}

export interface PostHistoryReplyFetchServiceDeps {
    console?: Console;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
    now?: () => number;
}

type EventAccumulator = {
    event: NostrEvent;
    relayUrls: Set<string>;
};

function resolveLimit(limit: number | undefined): number {
    return Number.isFinite(limit)
        ? Math.max(1, Math.trunc(limit ?? POST_HISTORY_DIRECT_REPLY_FETCH_LIMIT))
        : POST_HISTORY_DIRECT_REPLY_FETCH_LIMIT;
}

function toResultEvents(eventsById: Map<string, EventAccumulator>): PostHistoryReplyFetchedEvent[] {
    return Array.from(eventsById.values())
        .map((item) => ({
            event: item.event,
            relayUrls: Array.from(item.relayUrls).sort((left, right) => left.localeCompare(right)),
        }))
        .sort((left, right) => {
            if (left.event.created_at !== right.event.created_at) {
                return left.event.created_at - right.event.created_at;
            }

            return left.event.id.localeCompare(right.event.id);
        });
}

export class PostHistoryReplyFetchService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private now: () => number;

    constructor(deps: PostHistoryReplyFetchServiceDeps = {}) {
        this.console = deps.console ?? (
            typeof console !== "undefined"
                ? console
                : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console
        );
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
        this.now = deps.now ?? Date.now;
    }

    fetchDirectReplies(
        rxNostr: RxNostr,
        params: PostHistoryReplyFetchRequest,
    ): PostHistoryReplyFetchTask {
        const rxReq = createRxBackwardReq();
        const relayUrls = this.resolveRelayUrls(params.relayHints, params.relayConfig);
        const limit = resolveLimit(params.limit);
        const since = Math.max(
            0,
            Math.trunc(params.createdAt) - POST_HISTORY_DIRECT_REPLY_FETCH_LOOKBACK_SECONDS,
        );
        const eventsById = new Map<string, EventAccumulator>();
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((result: PostHistoryReplyFetchResult) => void) | undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const buildResult = (): PostHistoryReplyFetchResult => ({
            events: toResultEvents(eventsById),
            fetchedAt: this.now(),
            relayUrls,
        });

        const safeResolveFactory = (
            resolve: (result: PostHistoryReplyFetchResult) => void,
        ) => () => {
            if (resolved) {
                return;
            }

            resolved = true;
            cleanup();
            resolve(buildResult());
        };

        const promise = new Promise<PostHistoryReplyFetchResult>((resolve) => {
            const safeResolve = safeResolveFactory(resolve);
            resolveTask = safeResolve;

            try {
                subscription = rxNostr.use(rxReq, {
                    on: relayUrls.length > 0
                        ? { relays: relayUrls }
                        : { defaultReadRelays: true },
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        this.handlePacket(eventsById, packet);
                    },
                    complete: safeResolve,
                    error: (error: unknown) => {
                        this.console.error("post_history_reply_fetch_error", error);
                        safeResolve();
                    },
                });

                rxReq.emit({
                    kinds: [1],
                    "#e": [params.eventId],
                    since,
                    limit,
                } as never);
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("post_history_reply_fetch_timeout", params.eventId);
                    safeResolve();
                }, params.timeoutMs ?? POST_HISTORY_DIRECT_REPLY_FETCH_TIMEOUT_MS);
            } catch (error) {
                this.console.error("post_history_reply_fetch_request_error", error);
                safeResolve();
            }
        });

        return {
            promise,
            cancel: () => {
                resolveTask?.(buildResult());
            },
        };
    }

    private handlePacket(
        eventsById: Map<string, EventAccumulator>,
        packet: { event?: NostrEvent; from?: string },
    ): void {
        const event = packet.event;
        if (!event?.id || event.kind !== 1) {
            return;
        }

        const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof packet.from === "string" ? [packet.from] : [],
            { limit: 1 },
        )[0];
        const existing = eventsById.get(event.id);

        if (!existing) {
            eventsById.set(event.id, {
                event,
                relayUrls: new Set(relayUrl ? [relayUrl] : []),
            });
            return;
        }

        if (!isSameSignedNostrEvent(existing.event, event)) {
            this.console.warn("post_history_reply_fetch_packet_conflict", event.id);
            return;
        }

        if (relayUrl) {
            existing.relayUrls.add(relayUrl);
        }
    }

    private resolveRelayUrls(
        relayHints: string[] | undefined,
        relayConfig: RelayConfig | null | undefined,
    ): string[] {
        const configuredRelays = relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
            : [];
        const relays = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...(relayHints ?? []),
            ...configuredRelays,
        ], { limit: POST_HISTORY_DIRECT_REPLY_RELAY_LIMIT });

        return relays.length > 0
            ? relays
            : RelayConfigUtils.sanitizeExternalRelayUrls(
                FALLBACK_RELAYS,
                { limit: POST_HISTORY_DIRECT_REPLY_RELAY_LIMIT },
            );
    }
}

export const postHistoryReplyFetchService = new PostHistoryReplyFetchService();
