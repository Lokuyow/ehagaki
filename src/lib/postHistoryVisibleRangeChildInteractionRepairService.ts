import {
    createRxBackwardReq,
    type ConnectionStatePacket,
    type ErrorPacket,
    type MessagePacket,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./relayLists";
import {
    getHostReadRelayDefaults,
    mergeHostReadDefaultsWithHints,
} from "./hostRelayRuntime";
import {
    postHistoryDirectReplyRepairSaveService,
    type PostHistoryDirectReplyRepairItem,
    type PostHistoryDirectReplyRepairSaveService,
    type PostHistoryDirectReplyRepairSaveTask,
} from "./postHistoryDirectReplyRepairSaveService";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import {
    parsePostHistoryThreadReferences,
    resolveKind7ReactionTargetEventId,
} from "./postHistoryNip10Utils";
import {
    buildPostHistoryDirectReplyParentContext,
    validatePostHistoryDirectReplyRelation,
} from "./postHistoryDirectReplyRelationUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionItem,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";
import type { NostrEvent, RelayConfig } from "./types";
import { usePostHistoryRelayEvents } from "./postHistoryRawEventVerification";
import type { PostHistoryRelationKind } from "./postHistoryRelationLifecycleTypes";
import {
    POST_HISTORY_RELATION_REPAIR_KINDS,
    normalizePostHistoryRelationKinds,
} from "./postHistoryRelationRefreshContracts";

export const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_PARENT_LIMIT = 150;
export const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_CHUNK_SIZE = 30;
export const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FALLBACK_CHUNK_SIZE = 10;
export const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_CONCURRENCY = 2;
export const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_LIMIT = 250;
export const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_TIMEOUT_MS = 6_000;
const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_RELAY_LIMIT = 8;
const POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_TIMEOUT_WARN_INTERVAL_MS = 60_000;
const DEFAULT_VISIBLE_RANGE_RELATION_KINDS: PostHistoryRelationKind[] =
    POST_HISTORY_RELATION_REPAIR_KINDS;

export interface PostHistoryVisibleRangeChildInteractionRepairRequest {
    ownerPubkeyHex: string;
    visiblePosts: PostHistoryRecord[];
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryVisibleRangeRelationRepairRequest
    extends PostHistoryVisibleRangeChildInteractionRepairRequest {
    relationKinds?: PostHistoryRelationKind[];
    quoteVisibleRangeRepairExecutor?: (
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeRelationRepairRequest,
    ) => Promise<void>;
}

export interface PostHistoryVisibleRangeChildInteractionRepairResult {
    status: "success" | "partial" | "cancelled";
    targetParentEventIds: string[];
    checkedParentEventIds: string[];
    savedParentEventIds: string[];
    savedDirectReplyCount: number;
    attemptedChunkCount: number;
    saturatedChunkCount: number;
    incompleteParentEventIds: string[];
    deletionConfirmationIncomplete: boolean;
}

export interface PostHistoryVisibleRangeChildInteractionRepairTask {
    promise: Promise<PostHistoryVisibleRangeChildInteractionRepairResult>;
    cancel: () => void;
}

export interface PostHistoryVisibleRangeRelationRepairResult
    extends PostHistoryVisibleRangeChildInteractionRepairResult {
    relationKinds: PostHistoryRelationKind[];
    quoteRepairApplied: boolean;
}

export interface PostHistoryVisibleRangeRelationRepairTask {
    promise: Promise<PostHistoryVisibleRangeRelationRepairResult>;
    cancel: () => void;
}

export interface PostHistoryVisibleRangeChildInteractionRepairServiceDeps {
    directReplySaveService?: Pick<PostHistoryDirectReplyRepairSaveService, "saveRepairDirectReplies">;
    childInteractionsRepository?: Pick<PostHistoryChildInteractionsRepository, "upsertChildInteractions">;
    quoteVisibleRangeRepairExecutor?: (
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeRelationRepairRequest,
    ) => Promise<void>;
    console?: Pick<Console, "warn" | "error">;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
    now?: () => number;
}

type CandidateFetchStatus = "success" | "partial" | "error" | "cancelled";

type CandidateRelayPlan = {
    destinationRelayUrls: string[];
    coverageRelayUrls: string[];
};

type CandidateFetchResult = {
    status: CandidateFetchStatus;
    items: Array<{ event: NostrEvent; relayUrls: string[] }>;
    rawCount: number;
    requiresFallback: boolean;
    coverageSaturated: boolean;
    fetchedAt: number;
    relayUrls: string[];
    eoseRelayUrls: string[];
    closedRelayUrls: string[];
    errorRelayUrls: string[];
    downRelayUrls: string[];
    perRelayRawCounts: Array<{ relayUrl: string; rawCount: number }>;
};

type CandidateFetchTask = {
    promise: Promise<CandidateFetchResult>;
    cancel: () => void;
};

type EventAccumulator = {
    event: NostrEvent;
    relayUrls: Set<string>;
};

type SubscriptionLike = {
    unsubscribe?: () => void;
};

type ParentChunk = {
    posts: PostHistoryRecord[];
    depth: 0 | 1;
};

type PostHistoryVisibleRangeChildInteractionItem = {
    parentEventId: string;
    event: NostrEvent;
    relayUrls: string[];
};

type VisibleRangeRepairInclusionOptions = {
    includeDirectReplies: boolean;
    includeReactions: boolean;
};

const EMPTY_RESULT: PostHistoryVisibleRangeChildInteractionRepairResult = {
    status: "success",
    targetParentEventIds: [],
    checkedParentEventIds: [],
    savedParentEventIds: [],
    savedDirectReplyCount: 0,
    attemptedChunkCount: 0,
    saturatedChunkCount: 0,
    incompleteParentEventIds: [],
    deletionConfirmationIncomplete: false,
};

function buildVisibleRangeRelationRepairRxReqId(): string {
    const randomValue = Math.random().toString(36).slice(2, 10);
    return `post-history-visible-relation-repair-${Date.now().toString(36)}-${randomValue}`;
}

function toUniqueDirectReplyOwnerPosts(
    ownerPubkeyHex: string,
    posts: PostHistoryRecord[],
): PostHistoryRecord[] {
    const postsByEventId = new Map<string, PostHistoryRecord>();
    for (const post of posts) {
        if (
            (post.kind !== 1 && post.kind !== 42)
            || post.pubkeyHex !== ownerPubkeyHex
            || !post.eventId
            || postsByEventId.has(post.eventId)
        ) {
            continue;
        }

        postsByEventId.set(post.eventId, post);
        if (postsByEventId.size >= POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_PARENT_LIMIT) {
            break;
        }
    }

    return Array.from(postsByEventId.values());
}

function chunkPosts(posts: PostHistoryRecord[], chunkSize: number): PostHistoryRecord[][] {
    const chunks: PostHistoryRecord[][] = [];
    for (let index = 0; index < posts.length; index += chunkSize) {
        chunks.push(posts.slice(index, index + chunkSize));
    }
    return chunks;
}

function buildInitialParentChunks(
    posts: PostHistoryRecord[],
    options: VisibleRangeRepairInclusionOptions,
): ParentChunk[] {
    if (!options.includeDirectReplies) {
        return chunkPosts(
            posts,
            POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_CHUNK_SIZE,
        ).map((chunk) => ({ posts: chunk, depth: 0 }));
    }

    return ([1, 42] as const).flatMap((kind) =>
        chunkPosts(
            posts.filter((post) => post.kind === kind),
            POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_CHUNK_SIZE,
        ).map((chunk) => ({ posts: chunk, depth: 0 as const }))
    );
}

function toResultItems(eventsById: Map<string, EventAccumulator>) {
    return Array.from(eventsById.values())
        .map((item) => ({
            event: item.event,
            relayUrls: Array.from(item.relayUrls).sort((left, right) => left.localeCompare(right)),
        }))
        .sort((left, right) => {
            if (left.event.created_at !== right.event.created_at) {
                return right.event.created_at - left.event.created_at;
            }

            return left.event.id.localeCompare(right.event.id);
        });
}

export class PostHistoryVisibleRangeChildInteractionRepairService {
    private directReplySaveService: Pick<PostHistoryDirectReplyRepairSaveService, "saveRepairDirectReplies">;
    private childInteractionsRepository: Pick<PostHistoryChildInteractionsRepository, "upsertChildInteractions">;
    private quoteVisibleRangeRepairExecutor:
        | ((rxNostr: RxNostr, params: PostHistoryVisibleRangeRelationRepairRequest) => Promise<void>)
        | undefined;
    private console: Pick<Console, "warn" | "error">;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private now: () => number;
    private lastFetchTimeoutWarnAt = 0;

    constructor(deps: PostHistoryVisibleRangeChildInteractionRepairServiceDeps = {}) {
        this.directReplySaveService =
            deps.directReplySaveService ?? postHistoryDirectReplyRepairSaveService;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
        this.quoteVisibleRangeRepairExecutor = deps.quoteVisibleRangeRepairExecutor;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { warn: () => undefined, error: () => undefined });
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
        this.now = deps.now ?? Date.now;
    }

    repairVisibleRangeChildInteractions(
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeChildInteractionRepairRequest,
    ): PostHistoryVisibleRangeChildInteractionRepairTask {
        return this.repairVisibleRangeChildInteractionsInternal(
            rxNostr,
            params,
            {
                includeDirectReplies: true,
                includeReactions: true,
            },
        );
    }

    repairVisibleRangeRelations(
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeRelationRepairRequest,
    ): PostHistoryVisibleRangeRelationRepairTask {
        const relationKinds = normalizePostHistoryRelationKinds(
            params.relationKinds ?? DEFAULT_VISIBLE_RANGE_RELATION_KINDS,
        );
        const childRepairTask = this.repairVisibleRangeChildInteractionsInternal(
            rxNostr,
            params,
            {
                includeDirectReplies: relationKinds.includes("reply"),
                includeReactions: relationKinds.includes("reaction"),
            },
        );

        const promise = (async (): Promise<PostHistoryVisibleRangeRelationRepairResult> => {
            const childResult = await childRepairTask.promise;
            let quoteRepairApplied = false;
            const quoteExecutor =
                params.quoteVisibleRangeRepairExecutor
                ?? this.quoteVisibleRangeRepairExecutor;
            if (
                relationKinds.includes("quote")
                && childResult.status !== "cancelled"
                && params.isActive?.() !== false
                && quoteExecutor
            ) {
                await quoteExecutor(rxNostr, params);
                quoteRepairApplied = true;
            }

            return {
                ...childResult,
                relationKinds,
                quoteRepairApplied,
            };
        })();

        return {
            promise,
            cancel: () => childRepairTask.cancel(),
        };
    }

    private repairVisibleRangeChildInteractionsInternal(
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeChildInteractionRepairRequest,
        options: VisibleRangeRepairInclusionOptions,
    ): PostHistoryVisibleRangeChildInteractionRepairTask {
        let active = true;
        const candidateFetches = new Set<CandidateFetchTask>();
        const saveTasks = new Set<PostHistoryDirectReplyRepairSaveTask>();
        const isActive = () => active && params.isActive?.() !== false;
        const targetPosts = toUniqueDirectReplyOwnerPosts(params.ownerPubkeyHex, params.visiblePosts);
        const targetParentEventIds = targetPosts.map((post) => post.eventId);

        const promise = (async (): Promise<PostHistoryVisibleRangeChildInteractionRepairResult> => {
            if (targetPosts.length === 0) {
                return {
                    ...EMPTY_RESULT,
                    targetParentEventIds,
                };
            }

            const savedParentEventIds = new Set<string>();
            const checkedParentEventIds = new Set<string>();
            let savedDirectReplyCount = 0;
            let attemptedChunkCount = 0;
            let saturatedChunkCount = 0;
            let deletionConfirmationIncomplete = false;
            let partial = false;

            const processChunks = async (chunks: ParentChunk[]): Promise<ParentChunk[]> => {
                const fallbackChunks: ParentChunk[] = [];
                let nextIndex = 0;
                const workerCount = Math.min(
                    POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_CONCURRENCY,
                    chunks.length,
                );
                const runWorker = async () => {
                    while (isActive()) {
                        const chunk = chunks[nextIndex++];
                        if (!chunk) {
                            return;
                        }

                        attemptedChunkCount += 1;
                        const candidateTask = this.fetchCandidates(
                            rxNostr,
                            chunk.posts,
                            params.relayConfig,
                            options,
                        );
                        candidateFetches.add(candidateTask);
                        const candidateResult = await candidateTask.promise;
                        candidateFetches.delete(candidateTask);
                        if (!isActive() || candidateResult.status === "cancelled") {
                            return;
                        }

                        const defersCompletenessToFallback =
                            chunk.depth === 0 && candidateResult.requiresFallback;
                        if (
                            candidateResult.status !== "success"
                            && !defersCompletenessToFallback
                        ) {
                            partial = true;
                        }
                        if (candidateResult.requiresFallback) {
                            saturatedChunkCount += 1;
                            if (chunk.depth === 0) {
                                fallbackChunks.push(
                                    ...chunkPosts(
                                        chunk.posts,
                                        POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FALLBACK_CHUNK_SIZE,
                                    ).map((posts) => ({ posts, depth: 1 as const })),
                                );
                            } else if (candidateResult.coverageSaturated) {
                                partial = true;
                            }
                        }

                        const repairItems = options.includeDirectReplies
                            ? this.toDirectReplyItems(
                                chunk.posts,
                                candidateResult.items,
                            )
                            : [];
                        const reactionItems = options.includeReactions
                            ? this.toReactionItems(
                                chunk.posts,
                                candidateResult.items,
                            )
                            : [];
                        const canMarkChunkChecked =
                            candidateResult.status === "success"
                            && !candidateResult.coverageSaturated
                            && !(chunk.depth === 0 && candidateResult.requiresFallback);
                        if (repairItems.length === 0 && reactionItems.length === 0) {
                            if (canMarkChunkChecked) {
                                chunk.posts.forEach((post) => checkedParentEventIds.add(post.eventId));
                            }
                            continue;
                        }

                        if (repairItems.length > 0) {
                            const saveTask = this.directReplySaveService.saveRepairDirectReplies(rxNostr, {
                                items: repairItems,
                                relayHints: [
                                    ...this.collectParentRelayHints(chunk.posts),
                                    ...candidateResult.relayUrls,
                                ],
                                relayConfig: params.relayConfig,
                                fetchedAt: candidateResult.fetchedAt,
                                isActive,
                            });
                            saveTasks.add(saveTask);
                            const saveResult = await saveTask.promise;
                            saveTasks.delete(saveTask);
                            if (!isActive() || saveResult.status === "cancelled") {
                                return;
                            }

                            saveResult.savedParentEventIds.forEach((eventId) =>
                                savedParentEventIds.add(eventId)
                            );
                            savedDirectReplyCount += saveResult.savedDirectReplyCount;
                            deletionConfirmationIncomplete =
                                deletionConfirmationIncomplete || saveResult.deletionConfirmationIncomplete;
                        }

                        if (reactionItems.length > 0) {
                            const reactionSaveResult = await this.saveReactionInteractions(
                                reactionItems,
                                candidateResult.fetchedAt,
                                isActive,
                            );
                            if (!isActive()) {
                                return;
                            }

                            reactionSaveResult.savedParentEventIds.forEach((eventId) =>
                                savedParentEventIds.add(eventId)
                            );
                        }
                        if (canMarkChunkChecked) {
                            chunk.posts.forEach((post) => checkedParentEventIds.add(post.eventId));
                        }
                    }
                };

                await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
                return fallbackChunks;
            };

            const fallbackChunks = await processChunks(buildInitialParentChunks(targetPosts, options));
            if (isActive() && fallbackChunks.length > 0) {
                await processChunks(fallbackChunks);
            }
            if (!isActive()) {
                return {
                    ...EMPTY_RESULT,
                    status: "cancelled",
                    targetParentEventIds,
                    attemptedChunkCount,
                    saturatedChunkCount,
                    deletionConfirmationIncomplete,
                };
            }

            const incompleteParentEventIds = targetParentEventIds.filter(
                (eventId) => !checkedParentEventIds.has(eventId),
            );

            return {
                status: partial || incompleteParentEventIds.length > 0 ? "partial" : "success",
                targetParentEventIds,
                checkedParentEventIds: Array.from(checkedParentEventIds),
                savedParentEventIds: Array.from(savedParentEventIds),
                savedDirectReplyCount,
                attemptedChunkCount,
                saturatedChunkCount,
                incompleteParentEventIds,
                deletionConfirmationIncomplete,
            };
        })();

        return {
            promise,
            cancel: () => {
                active = false;
                candidateFetches.forEach((task) => task.cancel());
                saveTasks.forEach((task) => task.cancel());
            },
        };
    }

    private toDirectReplyItems(
        posts: PostHistoryRecord[],
        items: Array<{ event: NostrEvent; relayUrls: string[] }>,
    ): PostHistoryDirectReplyRepairItem[] {
        const parentContextsById = new Map(posts.flatMap((post) => {
            const context = buildPostHistoryDirectReplyParentContext({
                event: {
                    id: post.eventId,
                    kind: post.kind,
                    tags: post.tags,
                    created_at: post.createdAt,
                },
                relayHints: [
                    ...post.relayHints,
                    ...post.acceptedRelays,
                    ...(post.fetchedRelays ?? []),
                ],
            });
            return context ? [[post.eventId, context] as const] : [];
        }));
        return items.flatMap((item) => {
            const parentEventId = parsePostHistoryThreadReferences(item.event).parentId;
            const parent = parentEventId ? parentContextsById.get(parentEventId) : null;
            if (
                !parentEventId
                || !parent
                || !validatePostHistoryDirectReplyRelation({ child: item.event, parent }).valid
            ) {
                return [];
            }

            return [{
                parentEventId,
                event: item.event,
                relayUrls: item.relayUrls,
            }];
        });
    }

    private toReactionItems(
        posts: PostHistoryRecord[],
        items: Array<{ event: NostrEvent; relayUrls: string[] }>,
    ): PostHistoryVisibleRangeChildInteractionItem[] {
        const parentEventIds = new Set(posts.map((post) => post.eventId));
        return items.flatMap((item) => {
            if (item.event.kind !== 7) {
                return [];
            }

            const parentEventId = resolveKind7ReactionTargetEventId(item.event);
            if (!parentEventId || !parentEventIds.has(parentEventId) || item.event.id === parentEventId) {
                return [];
            }

            return [{
                parentEventId,
                event: item.event,
                relayUrls: item.relayUrls,
            }];
        });
    }

    private async saveReactionInteractions(
        items: PostHistoryVisibleRangeChildInteractionItem[],
        fetchedAt: number,
        isActive: () => boolean,
    ): Promise<{ savedParentEventIds: string[] }> {
        const itemsByParentId = new Map<string, PostHistoryChildInteractionItem[]>();
        for (const item of items) {
            const parentItems = itemsByParentId.get(item.parentEventId) ?? [];
            parentItems.push({
                event: item.event,
                relayUrls: item.relayUrls,
            });
            itemsByParentId.set(item.parentEventId, parentItems);
        }

        const savedParentEventIds: string[] = [];
        for (const [parentEventId, events] of itemsByParentId.entries()) {
            if (!isActive()) {
                break;
            }

            const result = await this.childInteractionsRepository.upsertChildInteractions({
                parentEventId,
                events,
                fetchedAt,
            });
            const savedCount = result.insertedCount + result.updatedCount;
            if (savedCount > 0) {
                savedParentEventIds.push(parentEventId);
            }
        }

        return {
            savedParentEventIds,
        };
    }

    private fetchCandidates(
        rxNostr: RxNostr,
        posts: PostHistoryRecord[],
        relayConfig: RelayConfig | null | undefined,
        options: VisibleRangeRepairInclusionOptions,
    ): CandidateFetchTask {
        const relayPlan = this.resolveRelayPlan(posts, relayConfig);
        const { destinationRelayUrls, coverageRelayUrls } = relayPlan;
        const parentEventIds = posts.map((post) => post.eventId);
        const rxReqId = buildVisibleRangeRelationRepairRxReqId();
        const targetSubId = `${rxReqId}:0`;
        const rxReq = createRxBackwardReq(rxReqId);
        const eventsById = new Map<string, EventAccumulator>();
        const perRelayRawCounts = new Map<string, number>();
        const eoseRelayUrls = new Set<string>();
        const closedRelayUrls = new Set<string>();
        const errorRelayUrls = new Set<string>();
        const downRelayUrls = new Set<string>();
        let rawCount = 0;
        let resolved = false;
        let subscription: SubscriptionLike | undefined;
        let messageSubscription: SubscriptionLike | undefined;
        let errorSubscription: SubscriptionLike | undefined;
        let connectionStateSubscription: SubscriptionLike | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((terminal: "complete" | "timeout" | "error" | "cancelled") => void) | undefined;

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
        const buildResult = (
            terminal: "complete" | "timeout" | "error" | "cancelled",
        ): CandidateFetchResult => {
            const items = toResultItems(eventsById);
            const saturatedRelayUrls = new Set(
                Array.from(perRelayRawCounts.entries())
                    .filter(([, count]) => (
                        count >= POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_LIMIT
                    ))
                    .map(([relayUrl]) => relayUrl),
            );
            const coverageSaturated = coverageRelayUrls.some((relayUrl) =>
                saturatedRelayUrls.has(relayUrl)
            );
            const coverageComplete = coverageRelayUrls.length > 0
                && coverageRelayUrls.every((relayUrl) => eoseRelayUrls.has(relayUrl));
            const status: CandidateFetchStatus = terminal === "cancelled"
                ? "cancelled"
                : terminal === "error"
                    ? "error"
                    : coverageComplete
                        ? "success"
                        : "partial";
            return {
                status,
                items,
                rawCount,
                requiresFallback: saturatedRelayUrls.size > 0,
                coverageSaturated,
                fetchedAt: this.now(),
                relayUrls: destinationRelayUrls,
                eoseRelayUrls: Array.from(eoseRelayUrls).sort(),
                closedRelayUrls: Array.from(closedRelayUrls).sort(),
                errorRelayUrls: Array.from(errorRelayUrls).sort(),
                downRelayUrls: Array.from(downRelayUrls).sort(),
                perRelayRawCounts: Array.from(perRelayRawCounts.entries())
                    .map(([relayUrl, relayRawCount]) => ({ relayUrl, rawCount: relayRawCount }))
                    .sort((left, right) => left.relayUrl.localeCompare(right.relayUrl)),
            };
        };

        const promise = new Promise<CandidateFetchResult>((resolve) => {
            const safeResolve = (terminal: "complete" | "timeout" | "error" | "cancelled") => {
                if (resolved) {
                    return;
                }

                resolved = true;
                cleanup();
                resolve(buildResult(terminal));
            };
            resolveTask = safeResolve;

            try {
                if (parentEventIds.length === 0) {
                    safeResolve("complete");
                    return;
                }

                messageSubscription = rxNostr.createAllMessageObservable?.().subscribe({
                    next: (packet: MessagePacket) => {
                        this.handleCandidateMessagePacket({
                            packet,
                            targetSubId,
                            destinationRelayUrls,
                            eoseRelayUrls,
                            closedRelayUrls,
                        });
                    },
                });
                errorSubscription = rxNostr.createAllErrorObservable?.().subscribe({
                    next: (packet: ErrorPacket) => {
                        const relayUrl = this.sanitizeCandidateRelayUrl(packet.from, destinationRelayUrls);
                        if (relayUrl) {
                            errorRelayUrls.add(relayUrl);
                        }
                    },
                });
                connectionStateSubscription = rxNostr.createConnectionStateObservable?.().subscribe({
                    next: (packet: ConnectionStatePacket) => {
                        const relayUrl = this.sanitizeCandidateRelayUrl(packet.from, destinationRelayUrls);
                        if (
                            relayUrl
                            && (packet.state === "error"
                                || packet.state === "rejected"
                                || packet.state === "terminated")
                        ) {
                            downRelayUrls.add(relayUrl);
                        }
                    },
                });

                subscription = usePostHistoryRelayEvents(rxNostr, rxReq, {
                    on: destinationRelayUrls.length > 0
                        ? { relays: destinationRelayUrls }
                        : { defaultReadRelays: true },
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        rawCount += 1;
                        const relayUrl = this.sanitizeCandidateRelayUrl(
                            packet.from,
                            destinationRelayUrls,
                        );
                        if (relayUrl) {
                            perRelayRawCounts.set(
                                relayUrl,
                                (perRelayRawCounts.get(relayUrl) ?? 0) + 1,
                            );
                        }
                        this.handleCandidatePacket(eventsById, packet, relayUrl);
                    },
                    complete: () => safeResolve("complete"),
                    error: (error: unknown) => {
                        this.console.error("post_history_visible_child_interaction_repair_fetch_error", error);
                        safeResolve("error");
                    },
                });

                const kinds = Array.from(new Set([
                    ...(options.includeDirectReplies ? posts.map((post) => post.kind) : []),
                    ...(options.includeReactions ? [7] : []),
                ])).filter((kind) => kind === 1 || kind === 7 || kind === 42);
                rxReq.emit({
                    kinds,
                    "#e": parentEventIds,
                    limit: POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_LIMIT,
                } as never);
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    const coverageComplete = coverageRelayUrls.length > 0
                        && coverageRelayUrls.every((relayUrl) => eoseRelayUrls.has(relayUrl));
                    if (!coverageComplete) {
                        this.warnCandidateFetchTimeout();
                    }
                    safeResolve("timeout");
                }, POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_FETCH_TIMEOUT_MS);
            } catch (error) {
                this.console.error("post_history_visible_child_interaction_repair_request_error", error);
                safeResolve("error");
            }
        });

        return {
            promise,
            cancel: () => resolveTask?.("cancelled"),
        };
    }

    private warnCandidateFetchTimeout(): void {
        const now = this.now();
        if (now - this.lastFetchTimeoutWarnAt
            < POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_TIMEOUT_WARN_INTERVAL_MS
        ) {
            return;
        }

        this.lastFetchTimeoutWarnAt = now;
        this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout");
    }

    private handleCandidatePacket(
        eventsById: Map<string, EventAccumulator>,
        packet: { event?: NostrEvent; from?: string },
        relayUrl: string | null,
    ): void {
        const event = packet.event;
        if (!event?.id || (event.kind !== 1 && event.kind !== 7 && event.kind !== 42)) {
            return;
        }

        const existing = eventsById.get(event.id);
        if (!existing) {
            eventsById.set(event.id, {
                event,
                relayUrls: new Set(relayUrl ? [relayUrl] : []),
            });
            return;
        }

        if (!isSameSignedNostrEvent(existing.event, event)) {
            this.console.warn("post_history_visible_child_interaction_repair_packet_conflict");
            return;
        }

        if (relayUrl) {
            existing.relayUrls.add(relayUrl);
        }
    }

    private collectParentRelayHints(posts: PostHistoryRecord[]): string[] {
        return posts.flatMap((post) => [
            ...(post.relayHints ?? []),
            ...(post.acceptedRelays ?? []),
            ...(post.fetchedRelays ?? []),
        ]);
    }

    private handleCandidateMessagePacket(params: {
        packet: MessagePacket;
        targetSubId: string;
        destinationRelayUrls: string[];
        eoseRelayUrls: Set<string>;
        closedRelayUrls: Set<string>;
    }): void {
        const relayUrl = this.sanitizeCandidateRelayUrl(
            params.packet.from,
            params.destinationRelayUrls,
        );
        if (!relayUrl) {
            return;
        }

        if (
            params.packet.type === "EOSE"
            && params.packet.subId === params.targetSubId
        ) {
            params.eoseRelayUrls.add(relayUrl);
            return;
        }

        if (
            params.packet.type === "CLOSED"
            && params.packet.subId === params.targetSubId
        ) {
            params.closedRelayUrls.add(relayUrl);
        }
    }

    private sanitizeCandidateRelayUrl(
        relayUrl: string | undefined,
        destinationRelayUrls: string[],
    ): string | null {
        const sanitizedRelayUrl = RelayConfigUtils.sanitizeExternalRelayUrls(
            typeof relayUrl === "string" ? [relayUrl] : [],
            { limit: 1 },
        )[0] ?? null;
        return sanitizedRelayUrl && destinationRelayUrls.includes(sanitizedRelayUrl)
            ? sanitizedRelayUrl
            : null;
    }

    private resolveRelayPlan(
        posts: PostHistoryRecord[],
        relayConfig: RelayConfig | null | undefined,
    ): CandidateRelayPlan {
        const contextualHints = this.collectParentRelayHints(posts);
        const hostRelays = mergeHostReadDefaultsWithHints(
            contextualHints,
            POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_RELAY_LIMIT,
        );
        if (hostRelays !== null) {
            return {
                destinationRelayUrls: hostRelays,
                coverageRelayUrls: getHostReadRelayDefaults(),
            };
        }
        const configuredReadRelayUrls = relayConfig
            ? RelayConfigUtils.sanitizeExternalRelayUrls(
                RelayConfigUtils.extractReadRelays(relayConfig),
            )
            : [];
        const configuredWriteRelayUrls = relayConfig
            ? RelayConfigUtils.sanitizeExternalRelayUrls(
                RelayConfigUtils.extractWriteRelays(relayConfig),
            )
            : [];
        const fallbackRelayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS);
        const coverageRelayUrls = configuredReadRelayUrls.length > 0
            ? configuredReadRelayUrls
            : configuredWriteRelayUrls.length > 0
                ? configuredWriteRelayUrls
                : fallbackRelayUrls;
        const writeOnlyRelayUrls = configuredReadRelayUrls.length > 0
            ? configuredWriteRelayUrls.filter((relayUrl) => !coverageRelayUrls.includes(relayUrl))
            : [];
        const limitedContextualHints = RelayConfigUtils.sanitizeExternalRelayUrls(
            contextualHints,
            { limit: POST_HISTORY_VISIBLE_RANGE_CHILD_INTERACTION_REPAIR_RELAY_LIMIT },
        );

        return {
            coverageRelayUrls,
            destinationRelayUrls: RelayConfigUtils.sanitizeExternalRelayUrls([
                ...coverageRelayUrls,
                ...writeOnlyRelayUrls,
                ...limitedContextualHints,
            ]),
        };
    }
}

export const postHistoryVisibleRangeChildInteractionRepairService =
    new PostHistoryVisibleRangeChildInteractionRepairService();
