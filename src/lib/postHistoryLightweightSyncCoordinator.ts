import { createPostHistoryAuthoredFetchScope, persistPostHistoryAuthoredFetch, EMPTY_POST_HISTORY_FETCH_SAVE } from "./postHistoryAuthoredFetchPersistence";
import { getPostHistoryAuthoredRelayScopeKey } from "./postHistoryRelayResolver";
import { POST_HISTORY_FETCH_KINDS } from "./postHistoryRelayFetchService";
import type { PostHistoryCoverageWrite } from "./storage/postHistoryRelayCoverageRepository";
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
    reason: PostHistoryLightweightSyncReason | "dialog-open-catchup";
    /** Keeps every page of an open-time catchup bound to the pre-delete history. */
    expectedLocalRevision?: number;
    kinds?: number[];
    since?: number;
    until?: number;
    limit?: number;
    timeoutMs?: number;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
    getRelayConfig?: () => RelayConfig | null | undefined;
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
    ownerPubkeyHex: string;
    consumers: Map<symbol, PostHistoryLightweightAuthoredSyncRequest>;
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
    appliedDeletionCount: 0,
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
    private inFlightAuthored = new Map<string, InFlightAuthored>();
    private runtimeIds = new WeakMap<object, number>();
    private nextRuntimeId = 0;
    private ownerCancellationRevisions = new Map<string, number>();
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
        const lease = Symbol("post-history-authored-lease");
        let active = true;
        let joinedExisting = false;
        let entry: InFlightAuthored | null = null;
        let key = "";
        const relayScopeKey = getPostHistoryAuthoredRelayScopeKey(params.relayConfig);
        const ownerRevision = this.ownerCancellationRevisions.get(params.ownerPubkeyHex) ?? 0;
        const consumerIsActive = () => active
            && ownerRevision === (this.ownerCancellationRevisions.get(params.ownerPubkeyHex) ?? 0)
            && params.isActive?.() !== false
            && getPostHistoryAuthoredRelayScopeKey(params.getRelayConfig ? params.getRelayConfig() : params.relayConfig) === relayScopeKey;
        const cancelled = (): PostHistoryLightweightAuthoredSyncResult => ({
            fetchResult: { status: "cancelled", events: [], fetchedAt: this.now(), nextUntil: null, hasMore: false,
                relayUrls: [], observedRelayUrls: [], rawCount: 0, uniqueCount: 0, duplicateCount: 0,
                perRelayCounts: [], oldestCreatedAt: null, newestCreatedAt: null, requestedRelayUrls: [],
                eventRelayUrls: [], eoseRelayUrls: [], closedRelayUrls: [], errorRelayUrls: [], downRelayUrls: [],
                completedByRxNostr: false, completedByLocalTimeout: false, hasAnyRelayResponse: false, allRelaysFailed: false },
            upsertSummary: EMPTY_POST_HISTORY_FETCH_SAVE, savedSelfPostEventIds: [],
        });
        const promise = (async () => {
            const initialScope = await createPostHistoryAuthoredFetchScope({ ownerPubkeyHex: params.ownerPubkeyHex,
                rxNostr, kinds: params.kinds ?? [...POST_HISTORY_FETCH_KINDS], relayConfig: params.relayConfig,
                getRelayConfig: params.getRelayConfig ?? (() => params.relayConfig), isActive: consumerIsActive });
            if (!initialScope.isActive() || (params.expectedLocalRevision !== undefined
                && initialScope.expectedRevision !== params.expectedLocalRevision)) return cancelled();
            let runtimeId = this.runtimeIds.get(rxNostr);
            if (runtimeId === undefined) { runtimeId = ++this.nextRuntimeId; this.runtimeIds.set(rxNostr, runtimeId); }
            key = JSON.stringify([params.ownerPubkeyHex, runtimeId, initialScope.expectedRevision, relayScopeKey,
                initialScope.kindsKey, params.reason, params.since ?? null, params.until ?? null,
                params.limit ?? null, params.timeoutMs ?? null]);
            const existing = this.inFlightAuthored.get(key);
            const consumer = { ...params, isActive: consumerIsActive };
            if (existing) {
                entry = existing;
                existing.leases.add(lease);
                existing.consumers.set(lease, consumer);
                joinedExisting = true;
            } else {
                let sourceActive = true;
                const consumers = new Map([[lease, consumer]]);
                const isActive = () => sourceActive && [...consumers.values()].some((value) => value.isActive?.() !== false);
                const sourceTask = this.postHistoryRelayFetchService.fetchLatest(rxNostr, {
                    pubkeyHex: params.ownerPubkeyHex, relayConfig: params.relayConfig, reason: params.reason,
                    ...(params.kinds ? { kinds: params.kinds } : {}),
                    ...(params.since === undefined ? {} : { since: params.since }),
                    ...(params.until === undefined ? {} : { until: params.until }),
                    ...(params.limit === undefined ? {} : { limit: params.limit }),
                    ...(params.timeoutMs === undefined ? {} : { timeoutMs: params.timeoutMs }),
                });
                const scope = { ...initialScope, isActive };
                const saveParams = { ...params, onSavedSelfPosts: (ids: string[]) =>
                    [...consumers.values()].find((value) => value.isActive?.() !== false)?.onSavedSelfPosts?.(ids) };
                const sharedPromise = this.saveAuthored(sourceTask, saveParams, isActive, scope).finally(() => {
                    if (this.inFlightAuthored.get(key)?.promise === sharedPromise) this.inFlightAuthored.delete(key);
                });
                entry = { ownerPubkeyHex: params.ownerPubkeyHex, sourceTask, promise: sharedPromise, consumers,
                    leases: new Set([lease]), cancelSource: () => { sourceActive = false; sourceTask.cancel(); } };
                this.inFlightAuthored.set(key, entry);
            }
            const result = await entry.promise;
            return consumerIsActive() ? result : cancelled();
        })();
        return { promise, get joinedExisting() { return joinedExisting; }, cancel: () => {
            active = false;
            if (entry) {
                entry.consumers.delete(lease);
                this.releaseAuthored(key, entry, lease);
            }
        } };
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
        // Also invalidate leases still awaiting their persistent deletion revision.
        this.ownerCancellationRevisions.set(ownerPubkeyHex, (this.ownerCancellationRevisions.get(ownerPubkeyHex) ?? 0) + 1);
        for (const [key, authored] of this.inFlightAuthored) {
            if (authored.ownerPubkeyHex === ownerPubkeyHex) {
                authored.cancelSource();
                this.inFlightAuthored.delete(key);
            }
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
        scope: Omit<PostHistoryCoverageWrite, "relays">,
    ): Promise<PostHistoryLightweightAuthoredSyncResult> {
        const fetchResult = await task.promise;
        if (!isActive() || fetchResult.status === "cancelled") {
            return { fetchResult: { ...fetchResult, status: "cancelled" }, upsertSummary: EMPTY_UPSERT_SUMMARY, savedSelfPostEventIds: [] };
        }

        const upsertSummary = await persistPostHistoryAuthoredFetch(fetchResult, scope, this.postHistoryRepository);
        if (upsertSummary.applied === false) return { fetchResult: { ...fetchResult, status: "cancelled" },
            upsertSummary, savedSelfPostEventIds: [] };
        if (!isActive()) {
            return { fetchResult: { ...fetchResult, status: "cancelled" }, upsertSummary, savedSelfPostEventIds: [] };
        }

        if (fetchResult.status === "success") {
            await this.authoredSyncStateRepository.saveLatestObservedCreatedAt(
                params.ownerPubkeyHex,
                fetchResult.newestCreatedAt,
            );
        }
        if (!isActive()) {
            return { fetchResult: { ...fetchResult, status: "cancelled" }, upsertSummary, savedSelfPostEventIds: [] };
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
        key: string,
        inFlight: InFlightAuthored,
        lease: symbol,
    ): void {
        inFlight.leases.delete(lease);
        if (inFlight.leases.size > 0) {
            return;
        }

        inFlight.cancelSource();
        if (this.inFlightAuthored.get(key) === inFlight) {
            this.inFlightAuthored.delete(key);
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
