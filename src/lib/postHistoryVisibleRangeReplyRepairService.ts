import {
    createRxBackwardReq,
    type RxNostr,
} from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import {
    postHistoryDirectReplyRepairSaveService,
    type PostHistoryDirectReplyRepairItem,
    type PostHistoryDirectReplyRepairSaveService,
    type PostHistoryDirectReplyRepairSaveTask,
} from "./postHistoryDirectReplyRepairSaveService";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { parseKind1ThreadReferences } from "./postHistoryNip10Utils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { NostrEvent, RelayConfig } from "./types";

export const POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_PARENT_LIMIT = 150;
export const POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_CHUNK_SIZE = 30;
export const POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FALLBACK_CHUNK_SIZE = 10;
export const POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_CONCURRENCY = 2;
export const POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FETCH_LIMIT = 250;
export const POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FETCH_TIMEOUT_MS = 6_000;
const POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_RELAY_LIMIT = 8;

export interface PostHistoryVisibleRangeReplyRepairRequest {
    ownerPubkeyHex: string;
    visiblePosts: PostHistoryRecord[];
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryVisibleRangeReplyRepairResult {
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

export interface PostHistoryVisibleRangeReplyRepairTask {
    promise: Promise<PostHistoryVisibleRangeReplyRepairResult>;
    cancel: () => void;
}

export interface PostHistoryVisibleRangeReplyRepairServiceDeps {
    directReplySaveService?: Pick<PostHistoryDirectReplyRepairSaveService, "saveRepairDirectReplies">;
    console?: Pick<Console, "warn" | "error">;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
    now?: () => number;
}

type CandidateFetchStatus = "success" | "timeout" | "error" | "cancelled";

type CandidateFetchResult = {
    status: CandidateFetchStatus;
    items: Array<{ event: NostrEvent; relayUrls: string[] }>;
    rawCount: number;
    saturated: boolean;
    fetchedAt: number;
    relayUrls: string[];
};

type CandidateFetchTask = {
    promise: Promise<CandidateFetchResult>;
    cancel: () => void;
};

type EventAccumulator = {
    event: NostrEvent;
    relayUrls: Set<string>;
};

type ParentChunk = {
    posts: PostHistoryRecord[];
    depth: 0 | 1;
};

const EMPTY_RESULT: PostHistoryVisibleRangeReplyRepairResult = {
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

function toUniqueKind1OwnerPosts(
    ownerPubkeyHex: string,
    posts: PostHistoryRecord[],
): PostHistoryRecord[] {
    const postsByEventId = new Map<string, PostHistoryRecord>();
    for (const post of posts) {
        if (
            post.kind !== 1
            || post.pubkeyHex !== ownerPubkeyHex
            || !post.eventId
            || postsByEventId.has(post.eventId)
        ) {
            continue;
        }

        postsByEventId.set(post.eventId, post);
        if (postsByEventId.size >= POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_PARENT_LIMIT) {
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

export class PostHistoryVisibleRangeReplyRepairService {
    private directReplySaveService: Pick<PostHistoryDirectReplyRepairSaveService, "saveRepairDirectReplies">;
    private console: Pick<Console, "warn" | "error">;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private now: () => number;

    constructor(deps: PostHistoryVisibleRangeReplyRepairServiceDeps = {}) {
        this.directReplySaveService =
            deps.directReplySaveService ?? postHistoryDirectReplyRepairSaveService;
        this.console = deps.console ?? (typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { warn: () => undefined, error: () => undefined });
        this.setTimeoutFn = deps.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn ?? ((id) => clearTimeout(id));
        this.now = deps.now ?? Date.now;
    }

    repairVisibleKind1DirectReplies(
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeReplyRepairRequest,
    ): PostHistoryVisibleRangeReplyRepairTask {
        let active = true;
        const candidateFetches = new Set<CandidateFetchTask>();
        const saveTasks = new Set<PostHistoryDirectReplyRepairSaveTask>();
        const isActive = () => active && params.isActive?.() !== false;
        const targetPosts = toUniqueKind1OwnerPosts(params.ownerPubkeyHex, params.visiblePosts);
        const targetParentEventIds = targetPosts.map((post) => post.eventId);

        const promise = (async (): Promise<PostHistoryVisibleRangeReplyRepairResult> => {
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
                    POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_CONCURRENCY,
                    chunks.length,
                );
                const runWorker = async () => {
                    while (isActive()) {
                        const chunk = chunks[nextIndex++];
                        if (!chunk) {
                            return;
                        }

                        attemptedChunkCount += 1;
                        const candidateTask = this.fetchCandidates(rxNostr, chunk.posts, params.relayConfig);
                        candidateFetches.add(candidateTask);
                        const candidateResult = await candidateTask.promise;
                        candidateFetches.delete(candidateTask);
                        if (!isActive() || candidateResult.status === "cancelled") {
                            return;
                        }

                        if (candidateResult.status !== "success") {
                            partial = true;
                        }
                        if (candidateResult.saturated) {
                            saturatedChunkCount += 1;
                            if (chunk.depth === 0) {
                                fallbackChunks.push(
                                    ...chunkPosts(
                                        chunk.posts,
                                        POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FALLBACK_CHUNK_SIZE,
                                    ).map((posts) => ({ posts, depth: 1 as const })),
                                );
                            } else {
                                partial = true;
                            }
                        }

                        const repairItems = this.toDirectReplyItems(
                            chunk.posts,
                            candidateResult.items,
                        );
                        const canMarkChunkChecked =
                            candidateResult.status === "success"
                            && !candidateResult.saturated;
                        if (repairItems.length === 0) {
                            if (canMarkChunkChecked) {
                                chunk.posts.forEach((post) => checkedParentEventIds.add(post.eventId));
                            }
                            continue;
                        }

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
                        if (canMarkChunkChecked) {
                            chunk.posts.forEach((post) => checkedParentEventIds.add(post.eventId));
                        }
                    }
                };

                await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
                return fallbackChunks;
            };

            const fallbackChunks = await processChunks(
                chunkPosts(targetPosts, POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_CHUNK_SIZE)
                    .map((posts) => ({ posts, depth: 0 as const })),
            );
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
        const parentEventIds = new Set(posts.map((post) => post.eventId));
        return items.flatMap((item) => {
            const parentEventId = parseKind1ThreadReferences(item.event).parentId;
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

    private fetchCandidates(
        rxNostr: RxNostr,
        posts: PostHistoryRecord[],
        relayConfig: RelayConfig | null | undefined,
    ): CandidateFetchTask {
        const relayUrls = this.resolveRelayUrls(posts, relayConfig);
        const parentEventIds = posts.map((post) => post.eventId);
        const rxReq = createRxBackwardReq();
        const eventsById = new Map<string, EventAccumulator>();
        let rawCount = 0;
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let resolveTask: ((status: CandidateFetchStatus) => void) | undefined;

        const cleanup = () => {
            if (timeoutId !== undefined) {
                this.clearTimeoutFn(timeoutId);
                timeoutId = undefined;
            }
            subscription?.unsubscribe?.();
            subscription = undefined;
        };
        const buildResult = (status: CandidateFetchStatus): CandidateFetchResult => {
            const items = toResultItems(eventsById);
            return {
                status,
                items,
                rawCount,
                saturated:
                    rawCount >= POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FETCH_LIMIT
                    || items.length >= POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FETCH_LIMIT,
                fetchedAt: this.now(),
                relayUrls,
            };
        };

        const promise = new Promise<CandidateFetchResult>((resolve) => {
            const safeResolve = (status: CandidateFetchStatus) => {
                if (resolved) {
                    return;
                }

                resolved = true;
                cleanup();
                resolve(buildResult(status));
            };
            resolveTask = safeResolve;

            try {
                if (parentEventIds.length === 0) {
                    safeResolve("success");
                    return;
                }

                subscription = rxNostr.use(rxReq, {
                    on: relayUrls.length > 0
                        ? { relays: relayUrls }
                        : { defaultReadRelays: true },
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        rawCount += 1;
                        this.handleCandidatePacket(eventsById, packet);
                    },
                    complete: () => safeResolve("success"),
                    error: (error: unknown) => {
                        this.console.error("post_history_visible_reply_repair_fetch_error", error);
                        safeResolve("error");
                    },
                });

                rxReq.emit({
                    kinds: [1],
                    "#e": parentEventIds,
                    limit: POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FETCH_LIMIT,
                } as never);
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("post_history_visible_reply_repair_fetch_timeout");
                    safeResolve("timeout");
                }, POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_FETCH_TIMEOUT_MS);
            } catch (error) {
                this.console.error("post_history_visible_reply_repair_request_error", error);
                safeResolve("error");
            }
        });

        return {
            promise,
            cancel: () => resolveTask?.("cancelled"),
        };
    }

    private handleCandidatePacket(
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
            this.console.warn("post_history_visible_reply_repair_packet_conflict");
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

    private resolveRelayUrls(
        posts: PostHistoryRecord[],
        relayConfig: RelayConfig | null | undefined,
    ): string[] {
        const configuredRelays = relayConfig
            ? [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
            : [];
        const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...this.collectParentRelayHints(posts),
            ...configuredRelays,
        ], { limit: POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_RELAY_LIMIT });

        return relayUrls.length > 0
            ? relayUrls
            : RelayConfigUtils.sanitizeExternalRelayUrls(
                FALLBACK_RELAYS,
                { limit: POST_HISTORY_VISIBLE_RANGE_REPLY_REPAIR_RELAY_LIMIT },
            );
    }
}

export const postHistoryVisibleRangeReplyRepairService =
    new PostHistoryVisibleRangeReplyRepairService();
