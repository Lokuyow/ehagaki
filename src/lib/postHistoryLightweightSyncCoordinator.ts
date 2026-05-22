import type { RxNostr } from "rx-nostr";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "./postHistoryInboundReplyReconciliationService";
import {
    postHistoryInboundInteractionsSyncService,
    type PostHistoryInboundInteractionsSyncResult,
    type PostHistoryInboundInteractionsSyncService,
    type PostHistoryInboundInteractionsSyncTask,
} from "./postHistoryInboundInteractionsSyncService";
import {
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchService,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import {
    postHistoryRepository,
    type PostHistoryRepository,
    type PostHistoryUpsertFetchedEventsResult,
} from "./storage/postHistoryRepository";
import type { RelayConfig } from "./types";

export type PostHistoryLightweightSyncReason =
    | "dialog-open-refresh"
    | "visibility-resume"
    | "foreground-periodic";

export interface PostHistoryLightweightAuthoredSyncRequest {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    reason: PostHistoryLightweightSyncReason;
    since?: number;
    limit?: number;
    timeoutMs?: number;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
    isActive?: () => boolean;
}

export interface PostHistoryLightweightAuthoredSyncResult {
    fetchResult: PostHistoryRelayFetchResult;
    upsertSummary: PostHistoryUpsertFetchedEventsResult;
    savedSelfPostEventIds: string[];
}

export interface PostHistoryLightweightAuthoredSyncTask {
    promise: Promise<PostHistoryLightweightAuthoredSyncResult>;
    cancel: () => void;
    joinedExisting: boolean;
}

export interface PostHistoryLightweightInboundSyncRequest {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    reason: PostHistoryLightweightSyncReason;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    isActive?: () => boolean;
}

export interface PostHistoryLightweightInboundSyncTask {
    promise: Promise<PostHistoryInboundInteractionsSyncResult>;
    cancel: () => void;
    joinedExisting: boolean;
}

export interface PostHistoryLightweightSyncCoordinatorDeps {
    postHistoryRelayFetchService?: Pick<PostHistoryRelayFetchService, "fetchLatest">;
    postHistoryInboundInteractionsSyncService?: Pick<
        PostHistoryInboundInteractionsSyncService,
        "syncRecent"
    >;
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
}

type InFlightAuthored = {
    sourceTask: PostHistoryRelayFetchTask;
    promise: Promise<PostHistoryLightweightAuthoredSyncResult>;
};

type InFlightInbound = {
    sourceTask: PostHistoryInboundInteractionsSyncTask;
    promise: Promise<PostHistoryInboundInteractionsSyncResult>;
};

const EMPTY_UPSERT_SUMMARY: PostHistoryUpsertFetchedEventsResult = {
    insertedCount: 0,
    updatedCount: 0,
    unchangedCount: 0,
};

function fetchedEventIds(result: PostHistoryRelayFetchResult): string[] {
    return result.events.map((item) => item.event.id).filter((eventId) => !!eventId);
}

export class PostHistoryLightweightSyncCoordinator {
    private postHistoryRelayFetchService: Pick<PostHistoryRelayFetchService, "fetchLatest">;
    private postHistoryInboundInteractionsSyncService: Pick<
        PostHistoryInboundInteractionsSyncService,
        "syncRecent"
    >;
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    private inFlightAuthoredByOwner = new Map<string, InFlightAuthored>();
    private inFlightInboundByOwner = new Map<string, InFlightInbound>();
    private latestSuccessfulAuthoredAtByOwner = new Map<string, number>();
    private latestSuccessfulInboundAtByOwner = new Map<string, number>();

    constructor(deps: PostHistoryLightweightSyncCoordinatorDeps = {}) {
        this.postHistoryRelayFetchService =
            deps.postHistoryRelayFetchService ?? postHistoryRelayFetchService;
        this.postHistoryInboundInteractionsSyncService =
            deps.postHistoryInboundInteractionsSyncService ?? postHistoryInboundInteractionsSyncService;
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
    }

    runAuthored(
        rxNostr: RxNostr,
        params: PostHistoryLightweightAuthoredSyncRequest,
    ): PostHistoryLightweightAuthoredSyncTask {
        const inFlight = this.inFlightAuthoredByOwner.get(params.ownerPubkeyHex);
        if (inFlight) {
            return {
                promise: inFlight.promise,
                cancel: () => undefined,
                joinedExisting: true,
            };
        }

        let active = true;
        const sourceTask = this.postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: params.reason,
            ...(typeof params.since === "number" ? { since: params.since } : {}),
            ...(typeof params.limit === "number" ? { limit: params.limit } : {}),
            ...(typeof params.timeoutMs === "number" ? { timeoutMs: params.timeoutMs } : {}),
        });
        const isActive = () => active && params.isActive?.() !== false;
        const promise = this.saveAuthored(sourceTask, params, isActive)
            .finally(() => {
                const current = this.inFlightAuthoredByOwner.get(params.ownerPubkeyHex);
                if (current?.promise === promise) {
                    this.inFlightAuthoredByOwner.delete(params.ownerPubkeyHex);
                }
            });
        this.inFlightAuthoredByOwner.set(params.ownerPubkeyHex, { sourceTask, promise });

        return {
            promise,
            cancel: () => {
                active = false;
                sourceTask.cancel();
                const current = this.inFlightAuthoredByOwner.get(params.ownerPubkeyHex);
                if (current?.sourceTask === sourceTask) {
                    this.inFlightAuthoredByOwner.delete(params.ownerPubkeyHex);
                }
            },
            joinedExisting: false,
        };
    }

    runInbound(
        rxNostr: RxNostr,
        params: PostHistoryLightweightInboundSyncRequest,
    ): PostHistoryLightweightInboundSyncTask {
        const inFlight = this.inFlightInboundByOwner.get(params.ownerPubkeyHex);
        if (inFlight) {
            return {
                promise: inFlight.promise,
                cancel: () => undefined,
                joinedExisting: true,
            };
        }

        let active = true;
        const isActive = () => active && params.isActive?.() !== false;
        const sourceTask = this.postHistoryInboundInteractionsSyncService.syncRecent(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: params.reason,
            reconcileDirectReplyCandidates: params.reconcileDirectReplyCandidates,
            isActive,
        });
        const promise = sourceTask.promise
            .then((result) => {
                if (result.status === "success" || result.status === "timeout") {
                    this.latestSuccessfulInboundAtByOwner.set(params.ownerPubkeyHex, result.fetchedAt);
                }
                return result;
            })
            .finally(() => {
                const current = this.inFlightInboundByOwner.get(params.ownerPubkeyHex);
                if (current?.promise === promise) {
                    this.inFlightInboundByOwner.delete(params.ownerPubkeyHex);
                }
            });
        this.inFlightInboundByOwner.set(params.ownerPubkeyHex, { sourceTask, promise });

        return {
            promise,
            cancel: () => {
                active = false;
                sourceTask.cancel();
                const current = this.inFlightInboundByOwner.get(params.ownerPubkeyHex);
                if (current?.sourceTask === sourceTask) {
                    this.inFlightInboundByOwner.delete(params.ownerPubkeyHex);
                }
            },
            joinedExisting: false,
        };
    }

    private async saveAuthored(
        task: PostHistoryRelayFetchTask,
        params: PostHistoryLightweightAuthoredSyncRequest,
        isActive: () => boolean,
    ): Promise<PostHistoryLightweightAuthoredSyncResult> {
        const fetchResult = await task.promise;
        if (!isActive() || fetchResult.status === "cancelled" || fetchResult.events.length === 0) {
            return { fetchResult, upsertSummary: EMPTY_UPSERT_SUMMARY, savedSelfPostEventIds: [] };
        }

        const upsertSummary = await this.postHistoryRepository.upsertFetchedEvents({
            events: fetchResult.events,
            fetchedAt: fetchResult.fetchedAt,
        });
        if (!isActive()) {
            return { fetchResult, upsertSummary, savedSelfPostEventIds: [] };
        }

        const savedSelfPostEventIds = fetchedEventIds(fetchResult);
        if (savedSelfPostEventIds.length > 0) {
            await params.onSavedSelfPosts?.(savedSelfPostEventIds);
        }
        if (fetchResult.status === "success" || fetchResult.status === "timeout") {
            this.latestSuccessfulAuthoredAtByOwner.set(params.ownerPubkeyHex, fetchResult.fetchedAt);
        }

        return { fetchResult, upsertSummary, savedSelfPostEventIds };
    }
}

export const postHistoryLightweightSyncCoordinator =
    new PostHistoryLightweightSyncCoordinator();
