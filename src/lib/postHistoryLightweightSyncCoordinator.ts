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
import {
    postHistoryAuthoredSyncStateRepository,
    type PostHistoryAuthoredSyncStateRepository,
} from "./storage/postHistoryAuthoredSyncStateRepository";
import type { RelayConfig } from "./types";

export const POST_HISTORY_FOREGROUND_PERIODIC_SYNC_COOLDOWN_MS = 2 * 60 * 1000;

export type PostHistoryLightweightSyncReason =
    | "dialog-open-refresh"
    | "visibility-resume"
    | "foreground-periodic";

export interface PostHistoryLightweightAuthoredSyncRequest {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    reason: PostHistoryLightweightSyncReason;
    kinds?: number[];
    since?: number;
    until?: number;
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
    authoredSyncStateRepository?: Pick<
        PostHistoryAuthoredSyncStateRepository,
        "saveLatestObservedCreatedAt"
    >;
    now?: () => number;
}

type InFlightAuthored = {
    sourceTask: PostHistoryRelayFetchTask;
    promise: Promise<PostHistoryLightweightAuthoredSyncResult>;
    leases: Set<symbol>;
    cancelSource: () => void;
};

type InFlightInbound = {
    sourceTask: PostHistoryInboundInteractionsSyncTask;
    promise: Promise<PostHistoryInboundInteractionsSyncResult>;
    leases: Set<symbol>;
    cancelSource: () => void;
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
    private authoredSyncStateRepository: Pick<
        PostHistoryAuthoredSyncStateRepository,
        "saveLatestObservedCreatedAt"
    >;
    private now: () => number;
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
        this.authoredSyncStateRepository =
            deps.authoredSyncStateRepository ?? postHistoryAuthoredSyncStateRepository;
        this.now = deps.now ?? Date.now;
    }

    runAuthored(
        rxNostr: RxNostr,
        params: PostHistoryLightweightAuthoredSyncRequest,
    ): PostHistoryLightweightAuthoredSyncTask {
        const inFlight = this.inFlightAuthoredByOwner.get(params.ownerPubkeyHex);
        if (inFlight) {
            return this.joinAuthored(params.ownerPubkeyHex, inFlight);
        }

        const lease = Symbol("post-history-authored-lightweight-lease");
        let sourceActive = true;
        const sourceTask = this.postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: params.reason,
            ...(params.kinds ? { kinds: params.kinds } : {}),
            ...(typeof params.since === "number" ? { since: params.since } : {}),
            ...(typeof params.until === "number" ? { until: params.until } : {}),
            ...(typeof params.limit === "number" ? { limit: params.limit } : {}),
            ...(typeof params.timeoutMs === "number" ? { timeoutMs: params.timeoutMs } : {}),
        });
        const isActive = () => sourceActive && params.isActive?.() !== false;
        const promise = this.saveAuthored(sourceTask, params, isActive)
            .finally(() => {
                const current = this.inFlightAuthoredByOwner.get(params.ownerPubkeyHex);
                if (current?.promise === promise) {
                    this.inFlightAuthoredByOwner.delete(params.ownerPubkeyHex);
                }
            });
        const inFlightAuthored: InFlightAuthored = {
            sourceTask,
            promise,
            leases: new Set([lease]),
            cancelSource: () => {
                sourceActive = false;
                sourceTask.cancel();
            },
        };
        this.inFlightAuthoredByOwner.set(params.ownerPubkeyHex, inFlightAuthored);

        return {
            promise,
            cancel: () => this.releaseAuthored(params.ownerPubkeyHex, inFlightAuthored, lease),
            joinedExisting: false,
        };
    }

    runInbound(
        rxNostr: RxNostr,
        params: PostHistoryLightweightInboundSyncRequest,
    ): PostHistoryLightweightInboundSyncTask {
        const inFlight = this.inFlightInboundByOwner.get(params.ownerPubkeyHex);
        if (inFlight) {
            return this.joinInbound(params.ownerPubkeyHex, inFlight);
        }

        const lease = Symbol("post-history-inbound-lightweight-lease");
        let sourceActive = true;
        const isActive = () => sourceActive && params.isActive?.() !== false;
        const sourceTask = this.postHistoryInboundInteractionsSyncService.syncRecent(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: params.reason,
            reconcileDirectReplyCandidates: params.reconcileDirectReplyCandidates,
            isActive,
        });
        const promise = sourceTask.promise
            .then((result) => {
                if (result.status === "success" && isActive()) {
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
        const inFlightInbound: InFlightInbound = {
            sourceTask,
            promise,
            leases: new Set([lease]),
            cancelSource: () => {
                sourceActive = false;
                sourceTask.cancel();
            },
        };
        this.inFlightInboundByOwner.set(params.ownerPubkeyHex, inFlightInbound);

        return {
            promise,
            cancel: () => this.releaseInbound(params.ownerPubkeyHex, inFlightInbound, lease),
            joinedExisting: false,
        };
    }

    isForegroundPeriodicCooldownActive(
        ownerPubkeyHex: string,
        lane: "authored" | "inbound",
        now = this.now(),
    ): boolean {
        const latestSuccessfulAt = lane === "authored"
            ? this.latestSuccessfulAuthoredAtByOwner.get(ownerPubkeyHex)
            : this.latestSuccessfulInboundAtByOwner.get(ownerPubkeyHex);
        return typeof latestSuccessfulAt === "number"
            && now - latestSuccessfulAt < POST_HISTORY_FOREGROUND_PERIODIC_SYNC_COOLDOWN_MS;
    }

    cancelOwnerTasks(ownerPubkeyHex: string): void {
        const authored = this.inFlightAuthoredByOwner.get(ownerPubkeyHex);
        if (authored) {
            authored.cancelSource();
            this.inFlightAuthoredByOwner.delete(ownerPubkeyHex);
        }

        const inbound = this.inFlightInboundByOwner.get(ownerPubkeyHex);
        if (inbound) {
            inbound.cancelSource();
            this.inFlightInboundByOwner.delete(ownerPubkeyHex);
        }
    }

    private async saveAuthored(
        task: PostHistoryRelayFetchTask,
        params: PostHistoryLightweightAuthoredSyncRequest,
        isActive: () => boolean,
    ): Promise<PostHistoryLightweightAuthoredSyncResult> {
        const fetchResult = await task.promise;
        if (!isActive() || fetchResult.status === "cancelled") {
            return { fetchResult, upsertSummary: EMPTY_UPSERT_SUMMARY, savedSelfPostEventIds: [] };
        }

        const upsertSummary = fetchResult.events.length > 0
            ? await this.postHistoryRepository.upsertFetchedEvents({
                events: fetchResult.events,
                fetchedAt: fetchResult.fetchedAt,
            })
            : EMPTY_UPSERT_SUMMARY;
        if (!isActive()) {
            return { fetchResult, upsertSummary, savedSelfPostEventIds: [] };
        }

        if (fetchResult.status === "success") {
            await this.authoredSyncStateRepository.saveLatestObservedCreatedAt(
                params.ownerPubkeyHex,
                fetchResult.newestCreatedAt,
            );
        }
        if (!isActive()) {
            return { fetchResult, upsertSummary, savedSelfPostEventIds: [] };
        }

        const savedSelfPostEventIds = fetchedEventIds(fetchResult);
        if (savedSelfPostEventIds.length > 0) {
            await params.onSavedSelfPosts?.(savedSelfPostEventIds);
        }
        if (fetchResult.status === "success" && isActive()) {
            this.latestSuccessfulAuthoredAtByOwner.set(params.ownerPubkeyHex, fetchResult.fetchedAt);
        }

        return { fetchResult, upsertSummary, savedSelfPostEventIds };
    }

    private joinAuthored(
        ownerPubkeyHex: string,
        inFlight: InFlightAuthored,
    ): PostHistoryLightweightAuthoredSyncTask {
        const lease = Symbol("post-history-authored-lightweight-join");
        inFlight.leases.add(lease);
        return {
            promise: inFlight.promise,
            cancel: () => this.releaseAuthored(ownerPubkeyHex, inFlight, lease),
            joinedExisting: true,
        };
    }

    private joinInbound(
        ownerPubkeyHex: string,
        inFlight: InFlightInbound,
    ): PostHistoryLightweightInboundSyncTask {
        const lease = Symbol("post-history-inbound-lightweight-join");
        inFlight.leases.add(lease);
        return {
            promise: inFlight.promise,
            cancel: () => this.releaseInbound(ownerPubkeyHex, inFlight, lease),
            joinedExisting: true,
        };
    }

    private releaseAuthored(
        ownerPubkeyHex: string,
        inFlight: InFlightAuthored,
        lease: symbol,
    ): void {
        inFlight.leases.delete(lease);
        if (inFlight.leases.size > 0) {
            return;
        }

        inFlight.cancelSource();
        if (this.inFlightAuthoredByOwner.get(ownerPubkeyHex) === inFlight) {
            this.inFlightAuthoredByOwner.delete(ownerPubkeyHex);
        }
    }

    private releaseInbound(
        ownerPubkeyHex: string,
        inFlight: InFlightInbound,
        lease: symbol,
    ): void {
        inFlight.leases.delete(lease);
        if (inFlight.leases.size > 0) {
            return;
        }

        inFlight.cancelSource();
        if (this.inFlightInboundByOwner.get(ownerPubkeyHex) === inFlight) {
            this.inFlightInboundByOwner.delete(ownerPubkeyHex);
        }
    }
}

export const postHistoryLightweightSyncCoordinator =
    new PostHistoryLightweightSyncCoordinator();
