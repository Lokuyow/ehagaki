import type { RxNostr } from "rx-nostr";
import {
    classifyPostHistoryInboundInteraction,
    type PostHistoryInboundInteractionClassification,
} from "./postHistoryInboundInteractionClassifier";
import {
    postHistorySelfParentFetchService,
    type PostHistorySelfParentFetchService,
    type PostHistorySelfParentFetchTask,
} from "./postHistorySelfParentFetchService";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryReplyEventItem,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryReplyEventsRepository";
import type { RelayConfig } from "./types";

export interface PostHistoryInboundDirectReplyCandidate extends PostHistoryReplyEventItem {
    classification: PostHistoryInboundInteractionClassification;
}

export interface PostHistoryInboundReplyReconciliationResult {
    savedParentEventIds: string[];
    savedDirectReplyCount: number;
    unresolvedParentEventIds: string[];
}

export interface PostHistoryInboundReplyReconciliationSessionParams {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    onSavedDirectReplies?: (parentEventIds: string[]) => void | Promise<void>;
}

export interface PostHistoryInboundReplyReconciliationServiceDeps {
    postHistoryRepository?: Pick<
        PostHistoryRepository,
        "getExistingEventIdsForPubkey" | "upsertFetchedEvents"
    >;
    postHistoryReplyEventsRepository?: Pick<PostHistoryChildInteractionsRepository, "upsertChildInteractions">;
    selfParentFetchService?: Pick<PostHistorySelfParentFetchService, "fetchSelfParent">;
    console?: Pick<Console, "warn" | "error">;
    now?: () => number;
}

type PendingParent = {
    candidatesByEventId: Map<string, PostHistoryInboundDirectReplyCandidate>;
};

function emptyResult(): PostHistoryInboundReplyReconciliationResult {
    return {
        savedParentEventIds: [],
        savedDirectReplyCount: 0,
        unresolvedParentEventIds: [],
    };
}

function toParentCandidateMap(
    candidates: PostHistoryInboundDirectReplyCandidate[],
): Map<string, PostHistoryInboundDirectReplyCandidate[]> {
    const candidatesByParentId = new Map<string, PostHistoryInboundDirectReplyCandidate[]>();

    for (const candidate of candidates) {
        const parentEventId = candidate.classification.parentEventId;
        if (
            !parentEventId
            || (
                candidate.classification.type !== "direct-reply"
                && candidate.classification.type !== "direct-reply-candidate"
            )
        ) {
            continue;
        }

        const parentCandidates = candidatesByParentId.get(parentEventId) ?? [];
        parentCandidates.push(candidate);
        candidatesByParentId.set(parentEventId, parentCandidates);
    }

    return candidatesByParentId;
}

export class PostHistoryInboundReplyReconciliationSession {
    private active = true;
    private pendingByParentId = new Map<string, PendingParent>();
    private parentFetches = new Map<string, PostHistorySelfParentFetchTask>();

    constructor(
        private rxNostr: RxNostr,
        private params: PostHistoryInboundReplyReconciliationSessionParams,
        private deps: Required<PostHistoryInboundReplyReconciliationServiceDeps>,
    ) { }

    async reconcile(
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ): Promise<PostHistoryInboundReplyReconciliationResult> {
        if (!this.active || candidates.length === 0) {
            return emptyResult();
        }

        const candidatesByParentId = toParentCandidateMap(candidates);
        const parentEventIds = Array.from(candidatesByParentId.keys());
        if (parentEventIds.length === 0) {
            return emptyResult();
        }

        const existingParentIds = new Set(
            await this.deps.postHistoryRepository.getExistingEventIdsForPubkey({
                pubkeyHex: this.params.ownerPubkeyHex,
                eventIds: parentEventIds,
            }),
        );
        if (!this.active) {
            return emptyResult();
        }

        const directCandidates: PostHistoryInboundDirectReplyCandidate[] = [];
        const unresolvedParentEventIds: string[] = [];

        for (const [parentEventId, parentCandidates] of candidatesByParentId.entries()) {
            if (existingParentIds.has(parentEventId)) {
                directCandidates.push(...parentCandidates);
                continue;
            }

            unresolvedParentEventIds.push(parentEventId);
            this.addPending(parentEventId, parentCandidates);
            this.startParentFetch(parentEventId);
        }

        const result = await this.saveDirectReplies(directCandidates);
        return {
            ...result,
            unresolvedParentEventIds,
        };
    }

    async notifySelfPostsSaved(parentEventIds: string[]): Promise<PostHistoryInboundReplyReconciliationResult> {
        if (!this.active) {
            return emptyResult();
        }

        const candidates: PostHistoryInboundDirectReplyCandidate[] = [];
        for (const parentEventId of new Set(parentEventIds)) {
            const pending = this.pendingByParentId.get(parentEventId);
            if (!pending) {
                continue;
            }

            this.pendingByParentId.delete(parentEventId);
            candidates.push(...pending.candidatesByEventId.values());
        }

        return this.saveDirectReplies(candidates);
    }

    stop(): void {
        this.active = false;
        for (const task of this.parentFetches.values()) {
            task.cancel();
        }
        this.parentFetches.clear();
        this.pendingByParentId.clear();
    }

    private addPending(
        parentEventId: string,
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ): void {
        const pending = this.pendingByParentId.get(parentEventId) ?? {
            candidatesByEventId: new Map<string, PostHistoryInboundDirectReplyCandidate>(),
        };

        for (const candidate of candidates) {
            pending.candidatesByEventId.set(candidate.event.id, candidate);
        }

        this.pendingByParentId.set(parentEventId, pending);
    }

    private startParentFetch(parentEventId: string): void {
        if (!this.active || this.parentFetches.has(parentEventId)) {
            return;
        }

        const task = this.deps.selfParentFetchService.fetchSelfParent(this.rxNostr, {
            parentEventId,
            ownerPubkeyHex: this.params.ownerPubkeyHex,
            relayConfig: this.params.relayConfig,
        });
        this.parentFetches.set(parentEventId, task);

        void task.promise
            .then(async (result) => {
                if (!this.active || this.parentFetches.get(parentEventId) !== task || !result.event) {
                    return;
                }

                await this.deps.postHistoryRepository.upsertFetchedEvents({
                    events: [{
                        event: result.event,
                        ...(result.relayUrl ? { relayUrls: [result.relayUrl] } : {}),
                    }],
                    fetchedAt: this.deps.now(),
                });
                if (!this.active || this.parentFetches.get(parentEventId) !== task) {
                    return;
                }

                await this.notifySelfPostsSaved([parentEventId]);
            })
            .catch((error) => {
                this.deps.console.error("post_history_inbound_reply_parent_reconciliation_error", error);
            })
            .finally(() => {
                if (this.parentFetches.get(parentEventId) === task) {
                    this.parentFetches.delete(parentEventId);
                }
            });
    }

    private async saveDirectReplies(
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ): Promise<PostHistoryInboundReplyReconciliationResult> {
        if (!this.active || candidates.length === 0) {
            return emptyResult();
        }

        const directRepliesByParentId = new Map<string, PostHistoryReplyEventItem[]>();
        for (const candidate of candidates) {
            const parentEventId = candidate.classification.parentEventId;
            if (!parentEventId) {
                continue;
            }

            const confirmed = classifyPostHistoryInboundInteraction({
                event: candidate.event,
                ownerPubkeyHex: this.params.ownerPubkeyHex,
                ownerPostEventIds: new Set([parentEventId]),
            });
            if (confirmed.type !== "direct-reply") {
                continue;
            }

            const replies = directRepliesByParentId.get(parentEventId) ?? [];
            replies.push({
                event: candidate.event,
                ...(candidate.relayUrls ? { relayUrls: candidate.relayUrls } : {}),
            });
            directRepliesByParentId.set(parentEventId, replies);
        }

        let savedDirectReplyCount = 0;
        const savedParentEventIds: string[] = [];
        for (const [parentEventId, events] of directRepliesByParentId.entries()) {
            const result = await this.deps.postHistoryReplyEventsRepository.upsertChildInteractions({
                parentEventId,
                events,
                fetchedAt: this.deps.now(),
            });
            if (!this.active) {
                return emptyResult();
            }

            const savedCount = result.insertedCount + result.updatedCount + result.unchangedCount;
            if (savedCount > 0) {
                savedParentEventIds.push(parentEventId);
                savedDirectReplyCount += savedCount;
            }
        }

        if (savedParentEventIds.length > 0) {
            try {
                await this.params.onSavedDirectReplies?.(savedParentEventIds);
            } catch (error) {
                this.deps.console.warn("post_history_inbound_reply_saved_callback_error", error);
            }
        }

        return {
            savedParentEventIds,
            savedDirectReplyCount,
            unresolvedParentEventIds: [],
        };
    }
}

export class PostHistoryInboundReplyReconciliationService {
    private deps: Required<PostHistoryInboundReplyReconciliationServiceDeps>;

    constructor(deps: PostHistoryInboundReplyReconciliationServiceDeps = {}) {
        this.deps = {
            postHistoryRepository: deps.postHistoryRepository ?? postHistoryRepository,
            postHistoryReplyEventsRepository:
                deps.postHistoryReplyEventsRepository ?? postHistoryChildInteractionsRepository,
            selfParentFetchService: deps.selfParentFetchService ?? postHistorySelfParentFetchService,
            console: deps.console ?? (typeof globalThis.console !== "undefined"
                ? globalThis.console
                : { warn: () => undefined, error: () => undefined }),
            now: deps.now ?? Date.now,
        };
    }

    createSession(
        rxNostr: RxNostr,
        params: PostHistoryInboundReplyReconciliationSessionParams,
    ): PostHistoryInboundReplyReconciliationSession {
        return new PostHistoryInboundReplyReconciliationSession(rxNostr, params, this.deps);
    }
}

export const postHistoryInboundReplyReconciliationService =
    new PostHistoryInboundReplyReconciliationService();
