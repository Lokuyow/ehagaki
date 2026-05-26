import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import {
    classifyPostHistoryInboundInteraction,
    type PostHistoryInboundInteractionClassification,
} from "./postHistoryInboundInteractionClassifier";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "./postHistoryInboundReplyReconciliationService";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import {
    postHistoryReplyEventsRepository,
    type PostHistoryReplyEventsRepository,
    type PostHistoryReplyEventItem,
} from "./storage/postHistoryReplyEventsRepository";
import {
    postHistoryInboundInteractionsSyncStateRepository,
    type PostHistoryInboundInteractionsSyncStateRepository,
} from "./storage/postHistoryInboundInteractionsSyncStateRepository";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_LOOKBACK_SECONDS =
    7 * 24 * 60 * 60;
export const POST_HISTORY_INBOUND_INTERACTIONS_OVERLAP_SECONDS = 5 * 60;
export const POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_DIALOG_LIMIT = 150;
export const POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_LIMIT = 100;
export const POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_DIALOG_TIMEOUT_MS = 10_000;
export const POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_TIMEOUT_MS = 5_000;
export const POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_DIALOG_RELAY_LIMIT = 6;
export const POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_RELAY_LIMIT = 4;
export const POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_TTL_MS = 60_000;

export type PostHistoryInboundInteractionsSyncReason =
    | "initial-dialog-bootstrap"
    | "dialog-open-refresh"
    | "foreground-periodic"
    | "visibility-resume"
    | "manual-refresh"
    | "visible-range-repair"
    | "realtime";

export type PostHistoryInboundInteractionsSyncStatus =
    | "success"
    | "timeout"
    | "error"
    | "cancelled";

export interface PostHistoryInboundInteractionsSyncRequest {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    reason: PostHistoryInboundInteractionsSyncReason;
    since?: number;
    limit?: number;
    timeoutMs?: number;
    relayLimit?: number;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    isActive?: () => boolean;
}

export interface PostHistoryInboundInteractionsSyncResult {
    status: PostHistoryInboundInteractionsSyncStatus;
    fetchedAt: number;
    since: number;
    limit: number;
    relayUrls: string[];
    rawCount: number;
    uniqueCount: number;
    saturated: boolean;
    maybeIncomplete: boolean;
    newestSeenCreatedAt: number | null;
    savedParentEventIds: string[];
    savedDirectReplyCount: number;
    classifications: Record<PostHistoryInboundInteractionClassification["type"], number>;
}

export interface PostHistoryInboundInteractionsSyncTask {
    promise: Promise<PostHistoryInboundInteractionsSyncResult>;
    cancel: () => void;
}

export interface PostHistoryInboundInteractionsSyncServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "getExistingEventIdsForPubkey">;
    postHistoryReplyEventsRepository?: Pick<PostHistoryReplyEventsRepository, "upsertDirectReplies">;
    syncStateRepository?: Pick<PostHistoryInboundInteractionsSyncStateRepository, "get" | "save">;
    console?: Pick<Console, "warn" | "error">;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
    now?: () => number;
}

type SubscriptionLike = {
    unsubscribe?: () => void;
};

type EventAccumulator = {
    event: NostrEvent;
    relayUrls: Set<string>;
};

function resolveLimit(
    reason: PostHistoryInboundInteractionsSyncReason,
    limit: number | undefined,
): number {
    const fallback = reason === "dialog-open-refresh"
        || reason === "foreground-periodic"
        || reason === "visibility-resume"
        ? POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_LIMIT
        : POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_DIALOG_LIMIT;

    return Number.isFinite(limit)
        ? Math.max(1, Math.trunc(limit ?? fallback))
        : fallback;
}

function resolveTimeoutMs(
    reason: PostHistoryInboundInteractionsSyncReason,
    timeoutMs: number | undefined,
): number {
    if (Number.isFinite(timeoutMs)) {
        return Math.max(1, Math.trunc(timeoutMs ?? 1));
    }

    return reason === "dialog-open-refresh"
        || reason === "foreground-periodic"
        || reason === "visibility-resume"
        ? POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_TIMEOUT_MS
        : POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_DIALOG_TIMEOUT_MS;
}

function resolveRelayLimit(
    reason: PostHistoryInboundInteractionsSyncReason,
    relayLimit: number | undefined,
): number {
    const fallback = reason === "dialog-open-refresh"
        || reason === "foreground-periodic"
        || reason === "visibility-resume"
        ? POST_HISTORY_INBOUND_INTERACTIONS_DIALOG_REFRESH_RELAY_LIMIT
        : POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_DIALOG_RELAY_LIMIT;

    return Number.isFinite(relayLimit)
        ? Math.max(1, Math.trunc(relayLimit ?? fallback))
        : fallback;
}

function toResultEvents(eventsById: Map<string, EventAccumulator>): Array<{
    event: NostrEvent;
    relayUrls: string[];
}> {
    return Array.from(eventsById.values())
        .map((item) => ({
            event: item.event,
            relayUrls: Array.from(item.relayUrls).sort((left, right) => left.localeCompare(right)),
        }))
        .sort((left, right) => right.event.created_at - left.event.created_at);
}

export class PostHistoryInboundInteractionsSyncService {
    private postHistoryRepository: Pick<PostHistoryRepository, "getExistingEventIdsForPubkey">;
    private postHistoryReplyEventsRepository: Pick<PostHistoryReplyEventsRepository, "upsertDirectReplies">;
    private syncStateRepository: Pick<PostHistoryInboundInteractionsSyncStateRepository, "get" | "save">;
    private console: Pick<Console, "warn" | "error">;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private now: () => number;

    constructor(deps: PostHistoryInboundInteractionsSyncServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.postHistoryReplyEventsRepository =
            deps.postHistoryReplyEventsRepository ?? postHistoryReplyEventsRepository;
        this.syncStateRepository =
            deps.syncStateRepository ?? postHistoryInboundInteractionsSyncStateRepository;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { warn: () => undefined, error: () => undefined });
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
        this.now = deps.now ?? Date.now;
    }

    syncRecent(
        rxNostr: RxNostr,
        params: PostHistoryInboundInteractionsSyncRequest,
    ): PostHistoryInboundInteractionsSyncTask {
        let cancelled = false;
        let subscription: SubscriptionLike | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((status: PostHistoryInboundInteractionsSyncStatus) => void) | undefined;

        const promise = (async (): Promise<PostHistoryInboundInteractionsSyncResult> => {
            const state = await this.syncStateRepository.get(params.ownerPubkeyHex);
            const limit = resolveLimit(params.reason, params.limit);
            const timeoutMs = resolveTimeoutMs(params.reason, params.timeoutMs);
            const relayUrls = this.resolveRelayUrls(
                params.relayConfig,
                resolveRelayLimit(params.reason, params.relayLimit),
            );
            const since = Number.isFinite(params.since)
                ? Math.max(0, Math.trunc(params.since ?? 0))
                : this.resolveSince(state?.lastSeenCreatedAt ?? null);
            const eventsById = new Map<string, EventAccumulator>();
            let rawCount = 0;
            let resolved = false;

            const cleanup = () => {
                if (timeoutId !== undefined) {
                    this.clearTimeoutFn(timeoutId);
                    timeoutId = undefined;
                }
                subscription?.unsubscribe?.();
                subscription = undefined;
            };

            const fetchResult = await new Promise<PostHistoryInboundInteractionsSyncStatus>((resolve) => {
                const safeResolve = (status: PostHistoryInboundInteractionsSyncStatus) => {
                    if (resolved) {
                        return;
                    }

                    resolved = true;
                    cleanup();
                    resolve(status);
                };
                resolveTask = safeResolve;

                try {
                    if (typeof (rxNostr as { use?: unknown }).use !== "function") {
                        safeResolve("cancelled");
                        return;
                    }

                    const rxReq = createRxBackwardReq();
                    subscription = rxNostr.use(rxReq, {
                        on: relayUrls.length > 0
                            ? { relays: relayUrls }
                            : { defaultReadRelays: true },
                    }).subscribe({
                        next: (packet: { event?: NostrEvent; from?: string }) => {
                            rawCount = this.handlePacket(eventsById, rawCount, packet);
                        },
                        complete: () => safeResolve("success"),
                        error: (error: unknown) => {
                            this.console.error("post_history_inbound_interactions_sync_error", error);
                            safeResolve("error");
                        },
                    });

                    rxReq.emit({
                        kinds: [1, 7],
                        "#p": [params.ownerPubkeyHex],
                        since,
                        limit,
                    } as never);
                    rxReq.over();

                    timeoutId = this.setTimeoutFn(() => {
                        this.console.warn("post_history_inbound_interactions_sync_timeout", params.ownerPubkeyHex);
                        safeResolve("timeout");
                    }, timeoutMs);
                } catch (error) {
                    this.console.error("post_history_inbound_interactions_sync_request_error", error);
                    safeResolve("error");
                }
            });

            if (cancelled || fetchResult === "cancelled" || params.isActive?.() === false) {
                return this.buildCancelledResult({
                    since,
                    limit,
                    relayUrls,
                    rawCount,
                    uniqueCount: eventsById.size,
                });
            }

            return this.processFetchedEvents({
                ownerPubkeyHex: params.ownerPubkeyHex,
                reason: params.reason,
                status: fetchResult,
                fetchedAt: this.now(),
                since,
                limit,
                relayUrls,
                rawCount,
                events: toResultEvents(eventsById),
                reconcileDirectReplyCandidates: params.reconcileDirectReplyCandidates,
                isActive: () => !cancelled && params.isActive?.() !== false,
            });
        })();

        return {
            promise,
            cancel: () => {
                cancelled = true;
                resolveTask?.("cancelled");
            },
        };
    }

    private async processFetchedEvents(input: {
        ownerPubkeyHex: string;
        reason: PostHistoryInboundInteractionsSyncReason;
        status: PostHistoryInboundInteractionsSyncStatus;
        fetchedAt: number;
        since: number;
        limit: number;
        relayUrls: string[];
        rawCount: number;
        events: Array<{ event: NostrEvent; relayUrls: string[] }>;
        reconcileDirectReplyCandidates?: (
            candidates: PostHistoryInboundDirectReplyCandidate[],
        ) => Promise<PostHistoryInboundReplyReconciliationResult>;
        isActive: () => boolean;
    }): Promise<PostHistoryInboundInteractionsSyncResult> {
        if (!input.isActive()) {
            return this.buildCancelledResultFromFetchedEvents(input);
        }
        const classifications: Record<PostHistoryInboundInteractionClassification["type"], number> = {
            "direct-reply": 0,
            "direct-reply-candidate": 0,
            "mention-like": 0,
            reaction: 0,
            unsupported: 0,
        };
        const newestSeenCreatedAt = input.events.reduce<number | null>((newest, item) => (
            newest === null || item.event.created_at > newest
                ? item.event.created_at
                : newest
        ), null);
        const candidateParentIds = Array.from(new Set(
            input.events
                .map((item) => item.event)
                .map((event) =>
                    classifyPostHistoryInboundInteraction({
                        event,
                        ownerPubkeyHex: input.ownerPubkeyHex,
                        ownerPostEventIds: new Set(),
                    }))
                .map((classification) =>
                    classification.type === "direct-reply-candidate"
                        || classification.type === "reaction"
                        ? classification.targetEventId
                        : null,
                )
                .filter((eventId): eventId is string => !!eventId),
        ));
        const ownerPostEventIds = new Set(
            await this.postHistoryRepository.getExistingEventIdsForPubkey({
                pubkeyHex: input.ownerPubkeyHex,
                eventIds: candidateParentIds,
            }),
        );
        if (!input.isActive()) {
            return this.buildCancelledResultFromFetchedEvents(input);
        }
        const directRepliesByParentId = new Map<string, PostHistoryReplyEventItem[]>();
        const reactionsByParentId = new Map<string, PostHistoryReplyEventItem[]>();
        const directReplyCandidates: PostHistoryInboundDirectReplyCandidate[] = [];

        for (const item of input.events) {
            const classification = classifyPostHistoryInboundInteraction({
                event: item.event,
                ownerPubkeyHex: input.ownerPubkeyHex,
                ownerPostEventIds,
            });
            classifications[classification.type] += 1;

            if (
                (
                    classification.type === "direct-reply"
                    || classification.type === "direct-reply-candidate"
                )
                && classification.parentEventId
            ) {
                directReplyCandidates.push({
                    classification,
                    event: item.event,
                    relayUrls: item.relayUrls,
                });
            }

            if (classification.type !== "direct-reply" || !classification.parentEventId) {
                if (
                    classification.type !== "reaction"
                    || !classification.targetEventId
                    || !ownerPostEventIds.has(classification.targetEventId)
                ) {
                    continue;
                }

                const reactions = reactionsByParentId.get(classification.targetEventId) ?? [];
                reactions.push({
                    event: item.event,
                    relayUrls: item.relayUrls,
                });
                reactionsByParentId.set(classification.targetEventId, reactions);
                continue;
            }

            const replies = directRepliesByParentId.get(classification.parentEventId) ?? [];
            replies.push({
                event: item.event,
                relayUrls: item.relayUrls,
            });
            directRepliesByParentId.set(classification.parentEventId, replies);
        }

        let savedDirectReplyCount = 0;
        let savedParentEventIds: string[] = [];
        if (input.reconcileDirectReplyCandidates) {
            const reconciled = await input.reconcileDirectReplyCandidates(directReplyCandidates);
            if (!input.isActive()) {
                return this.buildCancelledResultFromFetchedEvents(input);
            }
            savedParentEventIds = reconciled.savedParentEventIds;
            savedDirectReplyCount = reconciled.savedDirectReplyCount;
        } else {
            for (const [parentEventId, events] of directRepliesByParentId.entries()) {
                const result = await this.postHistoryReplyEventsRepository.upsertDirectReplies({
                    parentEventId,
                    events,
                    fetchedAt: input.fetchedAt,
                });
                if (!input.isActive()) {
                    return this.buildCancelledResultFromFetchedEvents(input);
                }
                if (result.insertedCount + result.updatedCount + result.unchangedCount > 0) {
                    savedParentEventIds.push(parentEventId);
                }
                savedDirectReplyCount += result.insertedCount + result.updatedCount + result.unchangedCount;
            }
        }

        const savedParentEventIdSet = new Set(savedParentEventIds);
        for (const [parentEventId, events] of reactionsByParentId.entries()) {
            const result = await this.postHistoryReplyEventsRepository.upsertDirectReplies({
                parentEventId,
                events,
                fetchedAt: input.fetchedAt,
            });
            if (!input.isActive()) {
                return this.buildCancelledResultFromFetchedEvents(input);
            }
            if (result.insertedCount + result.updatedCount + result.unchangedCount > 0) {
                savedParentEventIdSet.add(parentEventId);
            }
        }
        savedParentEventIds = Array.from(savedParentEventIdSet);

        const saturated = input.events.length >= input.limit || input.rawCount >= input.limit;
        const maybeIncomplete = saturated;
        if (!input.isActive()) {
            return this.buildCancelledResultFromFetchedEvents(input);
        }

        await this.syncStateRepository.save(input.ownerPubkeyHex, {
            lastSyncedAt: input.fetchedAt,
            lastDialogRefreshAt: input.reason === "dialog-open-refresh"
                ? input.fetchedAt
                : undefined,
            lastSeenCreatedAt: saturated
                ? undefined
                : newestSeenCreatedAt,
            saturated,
            maybeIncomplete,
        });
        if (!input.isActive()) {
            return this.buildCancelledResultFromFetchedEvents(input);
        }

        return {
            status: input.status,
            fetchedAt: input.fetchedAt,
            since: input.since,
            limit: input.limit,
            relayUrls: input.relayUrls,
            rawCount: input.rawCount,
            uniqueCount: input.events.length,
            saturated,
            maybeIncomplete,
            newestSeenCreatedAt,
            savedParentEventIds,
            savedDirectReplyCount,
            classifications,
        };
    }

    private buildCancelledResult(input: {
        since: number;
        limit: number;
        relayUrls: string[];
        rawCount: number;
        uniqueCount: number;
    }): PostHistoryInboundInteractionsSyncResult {
        return {
            status: "cancelled",
            fetchedAt: this.now(),
            since: input.since,
            limit: input.limit,
            relayUrls: input.relayUrls,
            rawCount: input.rawCount,
            uniqueCount: input.uniqueCount,
            saturated: false,
            maybeIncomplete: false,
            newestSeenCreatedAt: null,
            savedParentEventIds: [],
            savedDirectReplyCount: 0,
            classifications: {
                "direct-reply": 0,
                "direct-reply-candidate": 0,
                "mention-like": 0,
                reaction: 0,
                unsupported: 0,
            },
        };
    }

    private buildCancelledResultFromFetchedEvents(input: {
        since: number;
        limit: number;
        relayUrls: string[];
        rawCount: number;
        events: Array<{ event: NostrEvent; relayUrls: string[] }>;
    }): PostHistoryInboundInteractionsSyncResult {
        return this.buildCancelledResult({
            since: input.since,
            limit: input.limit,
            relayUrls: input.relayUrls,
            rawCount: input.rawCount,
            uniqueCount: input.events.length,
        });
    }

    private resolveSince(lastSeenCreatedAt: number | null): number {
        if (typeof lastSeenCreatedAt === "number") {
            return Math.max(0, lastSeenCreatedAt - POST_HISTORY_INBOUND_INTERACTIONS_OVERLAP_SECONDS);
        }

        return Math.max(
            0,
            Math.floor(this.now() / 1000) - POST_HISTORY_INBOUND_INTERACTIONS_INITIAL_LOOKBACK_SECONDS,
        );
    }

    private resolveRelayUrls(relayConfig: RelayConfig | null | undefined, relayLimit: number): string[] {
        const configuredRelays = relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
            : [];
        const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(configuredRelays, {
            limit: relayLimit,
        });

        return relayUrls.length > 0
            ? relayUrls
            : RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS, { limit: relayLimit });
    }

    private handlePacket(
        eventsById: Map<string, EventAccumulator>,
        currentRawCount: number,
        packet: { event?: NostrEvent; from?: string },
    ): number {
        const event = packet.event;
        if (!event?.id) {
            return currentRawCount;
        }

        const relayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof packet.from === "string" ? [packet.from] : [],
            { limit: 1 },
        )[0];
        const existing = eventsById.get(event.id);
        const nextRawCount = currentRawCount + 1;

        if (!existing) {
            eventsById.set(event.id, {
                event,
                relayUrls: new Set(relayUrl ? [relayUrl] : []),
            });
            return nextRawCount;
        }

        if (!isSameSignedNostrEvent(existing.event, event)) {
            this.console.warn("post_history_inbound_interaction_conflict", event.id);
            return nextRawCount;
        }

        if (relayUrl) {
            existing.relayUrls.add(relayUrl);
        }

        return nextRawCount;
    }
}

export const postHistoryInboundInteractionsSyncService =
    new PostHistoryInboundInteractionsSyncService();
