import {
    createRxBackwardReq,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import {
    validatePostHistoryDirectReplyRelation,
    type PostHistoryDirectReplyParentContext,
} from "./postHistoryDirectReplyRelationUtils";
import { parsePostHistoryThreadReferences } from "./postHistoryNip10Utils";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_DIRECT_REPLY_FETCH_LIMIT = 100;
export const POST_HISTORY_DIRECT_REPLY_FETCH_LOOKBACK_SECONDS = 86_400;
const POST_HISTORY_DIRECT_REPLY_FETCH_TIMEOUT_MS = 6_000;
const POST_HISTORY_DIRECT_REPLY_RELAY_LIMIT = 8;

export interface PostHistoryReplyFetchRequest {
    eventId: string;
    eventIds?: string[];
    createdAt: number;
    relayHints?: string[];
    relayConfig?: RelayConfig | null;
    limit?: number;
    timeoutMs?: number;
    relayLimit?: number;
    parents?: PostHistoryDirectReplyParentContext[];
}

export interface PostHistoryReplyFetchedEvent {
    parentEventId: string;
    event: NostrEvent;
    relayUrls: string[];
}

export interface PostHistoryReplyFetchResult {
    status: "success" | "partial" | "failed" | "cancelled";
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
    parentEventId: string;
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
            parentEventId: item.parentEventId,
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

function resolveParentContexts(
    params: PostHistoryReplyFetchRequest,
): PostHistoryDirectReplyParentContext[] {
    if (params.parents) {
        const contextsById = new Map<string, PostHistoryDirectReplyParentContext>();
        const conflictedEventIds = new Set<string>();
        for (const context of params.parents) {
            if (!context.eventId || conflictedEventIds.has(context.eventId)) {
                continue;
            }

            const existing = contextsById.get(context.eventId);
            if (
                existing
                && (
                    existing.eventKind !== context.eventKind
                    || existing.createdAt !== context.createdAt
                    || (
                        !!existing.channelEventId
                        && !!context.channelEventId
                        && existing.channelEventId !== context.channelEventId
                    )
                )
            ) {
                contextsById.delete(context.eventId);
                conflictedEventIds.add(context.eventId);
                continue;
            }

            contextsById.set(context.eventId, {
                ...context,
                channelEventId: context.channelEventId ?? existing?.channelEventId ?? null,
                relayHints: Array.from(new Set([
                    ...(existing?.relayHints ?? []),
                    ...context.relayHints,
                ])),
            });
        }
        return Array.from(contextsById.values());
    }

    const eventIds = params.eventIds && params.eventIds.length > 0
        ? params.eventIds
        : [params.eventId];
    return Array.from(new Set(eventIds.filter((eventId) => !!eventId))).map((eventId) => ({
        eventId,
        eventKind: 1,
        channelEventId: null,
        createdAt: params.createdAt,
        relayHints: params.relayHints ?? [],
    }));
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
        const parentContexts = resolveParentContexts(params);
        const parentContextsById = new Map(parentContexts.map((context) => [context.eventId, context]));
        const eventIds = parentContexts.map((context) => context.eventId);
        const relayUrls = this.resolveRelayUrls(
            [
                ...(params.relayHints ?? []),
                ...parentContexts.flatMap((context) => context.relayHints),
            ],
            params.relayConfig,
            params.relayLimit,
        );
        const limit = resolveLimit(params.limit);
        const since = Math.max(
            0,
            Math.trunc(Math.min(...parentContexts.map((context) => context.createdAt)))
                - POST_HISTORY_DIRECT_REPLY_FETCH_LOOKBACK_SECONDS,
        );
        const eventsById = new Map<string, EventAccumulator>();
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((status: PostHistoryReplyFetchResult["status"]) => void) | undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const buildResult = (
            status: PostHistoryReplyFetchResult["status"],
        ): PostHistoryReplyFetchResult => ({
            status: status === "failed" && eventsById.size > 0 ? "partial" : status,
            events: toResultEvents(eventsById),
            fetchedAt: this.now(),
            relayUrls,
        });

        const safeResolveFactory = (
            resolve: (result: PostHistoryReplyFetchResult) => void,
        ) => (status: PostHistoryReplyFetchResult["status"]) => {
            if (resolved) {
                return;
            }

            resolved = true;
            cleanup();
            resolve(buildResult(status));
        };

        const promise = new Promise<PostHistoryReplyFetchResult>((resolve) => {
            const safeResolve = safeResolveFactory(resolve);
            resolveTask = safeResolve;

            try {
                if (eventIds.length === 0) {
                    safeResolve("success");
                    return;
                }

                subscription = rxNostr.use(rxReq, {
                    on: relayUrls.length > 0
                        ? { relays: relayUrls }
                        : { defaultReadRelays: true },
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        this.handlePacket(eventsById, parentContextsById, packet);
                    },
                    complete: () => safeResolve("success"),
                    error: (error: unknown) => {
                        this.console.error("post_history_reply_fetch_error", error);
                        safeResolve("failed");
                    },
                });

                rxReq.emit({
                    kinds: Array.from(new Set(parentContexts.map((context) => context.eventKind))).sort(),
                    "#e": eventIds,
                    since,
                    limit,
                } as never);
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("post_history_reply_fetch_timeout", eventIds.join(","));
                    safeResolve("failed");
                }, params.timeoutMs ?? POST_HISTORY_DIRECT_REPLY_FETCH_TIMEOUT_MS);
            } catch (error) {
                this.console.error("post_history_reply_fetch_request_error", error);
                safeResolve("failed");
            }
        });

        return {
            promise,
            cancel: () => {
                resolveTask?.("cancelled");
            },
        };
    }

    private handlePacket(
        eventsById: Map<string, EventAccumulator>,
        parentContextsById: Map<string, PostHistoryDirectReplyParentContext>,
        packet: { event?: NostrEvent; from?: string },
    ): void {
        const event = packet.event;
        if (!event?.id || (event.kind !== 1 && event.kind !== 42)) {
            return;
        }

        const parentEventId = parsePostHistoryThreadReferences(event).parentId;
        const parentContext = parentEventId ? parentContextsById.get(parentEventId) : null;
        if (
            !parentContext
            || !validatePostHistoryDirectReplyRelation({ child: event, parent: parentContext }).valid
        ) {
            return;
        }

        const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof packet.from === "string" ? [packet.from] : [],
            { limit: 1 },
        )[0];
        const existing = eventsById.get(event.id);

        if (!existing) {
            eventsById.set(event.id, {
                parentEventId: parentContext.eventId,
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
        relayLimit?: number,
    ): string[] {
        const limit = Number.isFinite(relayLimit)
            ? Math.max(1, Math.trunc(relayLimit ?? POST_HISTORY_DIRECT_REPLY_RELAY_LIMIT))
            : POST_HISTORY_DIRECT_REPLY_RELAY_LIMIT;
        const configuredRelays = relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
            : [];
        const relays = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...(relayHints ?? []),
            ...configuredRelays,
        ], { limit });

        return relays.length > 0
            ? relays
            : RelayConfigUtils.sanitizeExternalRelayUrls(
                FALLBACK_RELAYS,
                { limit },
            );
    }
}

export const postHistoryReplyFetchService = new PostHistoryReplyFetchService();
