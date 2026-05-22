import type { RxNostr } from "rx-nostr";
import type {
    PostHistoryInboundDirectReplyCandidate,
    PostHistoryInboundReplyReconciliationResult,
} from "./postHistoryInboundReplyReconciliationService";
import type { PostHistoryInboundInteractionsSyncResult } from "./postHistoryInboundInteractionsSyncService";
import {
    postHistoryLightweightSyncCoordinator,
    type PostHistoryLightweightAuthoredSyncResult,
    type PostHistoryLightweightAuthoredSyncTask,
    type PostHistoryLightweightInboundSyncTask,
    type PostHistoryLightweightSyncCoordinator,
} from "./postHistoryLightweightSyncCoordinator";
import type { PostHistoryRelayFetchResult } from "./postHistoryRelayFetchService";
import {
    postHistoryAuthoredSyncStateRepository,
    type PostHistoryAuthoredPendingCatchup,
    type PostHistoryAuthoredSyncState,
    type PostHistoryAuthoredSyncStateRepository,
} from "./storage/postHistoryAuthoredSyncStateRepository";
import type { RelayConfig } from "./types";

export const POST_HISTORY_FOREGROUND_PERIODIC_SYNC_INTERVAL_MS = 6 * 60 * 1000;
export const POST_HISTORY_FOREGROUND_PERIODIC_AUTHORED_OVERLAP_SECONDS = 60;
export const POST_HISTORY_FOREGROUND_PERIODIC_AUTHORED_INITIAL_LOOKBACK_SECONDS =
    7 * 24 * 60 * 60;

export interface PostHistoryForegroundPeriodicSyncRequest {
    ownerPubkeyHex: string;
    relayConfig?: RelayConfig | null;
    reconcileDirectReplyCandidates?: (
        candidates: PostHistoryInboundDirectReplyCandidate[],
    ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    onSavedSelfPosts?: (eventIds: string[]) => void | Promise<void>;
    isActive?: () => boolean;
}

export interface PostHistoryForegroundPeriodicAuthoredSyncResult {
    status: "skipped-cooldown" | "cancelled" | "completed";
    freshHead?: PostHistoryLightweightAuthoredSyncResult;
    pendingCatchup?: PostHistoryLightweightAuthoredSyncResult;
}

export interface PostHistoryForegroundPeriodicInboundSyncResult {
    status: "skipped-cooldown" | "completed";
    result?: PostHistoryInboundInteractionsSyncResult;
}

export interface PostHistoryForegroundPeriodicSyncResult {
    authored: PostHistoryForegroundPeriodicAuthoredSyncResult;
    inbound: PostHistoryForegroundPeriodicInboundSyncResult;
}

export interface PostHistoryForegroundPeriodicSyncTask {
    promise: Promise<PostHistoryForegroundPeriodicSyncResult>;
    cancel: () => void;
}

export interface PostHistoryForegroundPeriodicSyncServiceDeps {
    lightweightSyncCoordinator?: Pick<
        PostHistoryLightweightSyncCoordinator,
        "runAuthored" | "runInbound" | "isForegroundPeriodicCooldownActive"
    >;
    authoredSyncStateRepository?: Pick<
        PostHistoryAuthoredSyncStateRepository,
        "get" | "save"
    >;
    now?: () => number;
}

type PendingProgress = {
    cursorUntil: number | null;
    boundaryMaybeIncomplete: boolean;
};

function isSuccess(result: PostHistoryRelayFetchResult): boolean {
    return result.status === "success";
}

function isSaturated(result: PostHistoryRelayFetchResult): boolean {
    return result.hasMore;
}

function resolvePendingProgress(
    result: PostHistoryRelayFetchResult,
    currentUntil: number,
): PendingProgress {
    const cursorCandidate = typeof result.nextUntil === "number"
        ? result.nextUntil
        : result.oldestCreatedAt;
    if (typeof cursorCandidate === "number" && cursorCandidate < currentUntil) {
        return {
            cursorUntil: cursorCandidate,
            boundaryMaybeIncomplete: false,
        };
    }

    return {
        cursorUntil: currentUntil,
        boundaryMaybeIncomplete: true,
    };
}

export class PostHistoryForegroundPeriodicSyncService {
    private lightweightSyncCoordinator: Pick<
        PostHistoryLightweightSyncCoordinator,
        "runAuthored" | "runInbound" | "isForegroundPeriodicCooldownActive"
    >;
    private authoredSyncStateRepository: Pick<
        PostHistoryAuthoredSyncStateRepository,
        "get" | "save"
    >;
    private now: () => number;

    constructor(deps: PostHistoryForegroundPeriodicSyncServiceDeps = {}) {
        this.lightweightSyncCoordinator =
            deps.lightweightSyncCoordinator ?? postHistoryLightweightSyncCoordinator;
        this.authoredSyncStateRepository =
            deps.authoredSyncStateRepository ?? postHistoryAuthoredSyncStateRepository;
        this.now = deps.now ?? Date.now;
    }

    sync(
        rxNostr: RxNostr,
        params: PostHistoryForegroundPeriodicSyncRequest,
    ): PostHistoryForegroundPeriodicSyncTask {
        let active = true;
        const authoredTasks = new Set<PostHistoryLightweightAuthoredSyncTask>();
        let inboundTask: PostHistoryLightweightInboundSyncTask | null = null;
        const isActive = () => active && params.isActive?.() !== false;

        const promise = Promise.all([
            this.runAuthored(rxNostr, params, authoredTasks, isActive),
            this.runInbound(rxNostr, params, (task) => {
                inboundTask = task;
            }, isActive),
        ]).then(([authored, inbound]) => ({ authored, inbound }));

        return {
            promise,
            cancel: () => {
                active = false;
                for (const task of authoredTasks) {
                    task.cancel();
                }
                inboundTask?.cancel();
            },
        };
    }

    private async runInbound(
        rxNostr: RxNostr,
        params: PostHistoryForegroundPeriodicSyncRequest,
        onTask: (task: PostHistoryLightweightInboundSyncTask) => void,
        isActive: () => boolean,
    ): Promise<PostHistoryForegroundPeriodicInboundSyncResult> {
        if (
            !isActive()
            || this.lightweightSyncCoordinator.isForegroundPeriodicCooldownActive(
                params.ownerPubkeyHex,
                "inbound",
                this.now(),
            )
        ) {
            return { status: "skipped-cooldown" };
        }

        const task = this.lightweightSyncCoordinator.runInbound(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: "foreground-periodic",
            reconcileDirectReplyCandidates: params.reconcileDirectReplyCandidates,
            isActive,
        });
        onTask(task);
        const result = await task.promise;
        return { status: "completed", result };
    }

    private async runAuthored(
        rxNostr: RxNostr,
        params: PostHistoryForegroundPeriodicSyncRequest,
        authoredTasks: Set<PostHistoryLightweightAuthoredSyncTask>,
        isActive: () => boolean,
    ): Promise<PostHistoryForegroundPeriodicAuthoredSyncResult> {
        if (
            !isActive()
            || this.lightweightSyncCoordinator.isForegroundPeriodicCooldownActive(
                params.ownerPubkeyHex,
                "authored",
                this.now(),
            )
        ) {
            return { status: "skipped-cooldown" };
        }

        const state = await this.authoredSyncStateRepository.get(params.ownerPubkeyHex);
        if (!isActive()) {
            return { status: "cancelled" };
        }

        const hadPendingCatchup = !!state?.pendingCatchup;
        const freshHead = await this.runFreshHead(
            rxNostr,
            params,
            state,
            authoredTasks,
            isActive,
        );
        if (!isActive()) {
            return { status: "cancelled", freshHead };
        }

        if (!hadPendingCatchup || !state?.pendingCatchup || state.pendingCatchup.boundaryMaybeIncomplete) {
            return { status: "completed", freshHead };
        }

        const pendingCatchup = await this.runPendingCatchup(
            rxNostr,
            params,
            state.pendingCatchup,
            freshHead,
            authoredTasks,
            isActive,
        );
        return { status: isActive() ? "completed" : "cancelled", freshHead, pendingCatchup };
    }

    private async runFreshHead(
        rxNostr: RxNostr,
        params: PostHistoryForegroundPeriodicSyncRequest,
        state: PostHistoryAuthoredSyncState | null,
        authoredTasks: Set<PostHistoryLightweightAuthoredSyncTask>,
        isActive: () => boolean,
    ): Promise<PostHistoryLightweightAuthoredSyncResult> {
        const requestUpperBoundTimestamp = Math.max(0, Math.floor(this.now() / 1000));
        const since = typeof state?.completedThroughTimestamp === "number"
            ? Math.max(
                0,
                state.completedThroughTimestamp -
                    POST_HISTORY_FOREGROUND_PERIODIC_AUTHORED_OVERLAP_SECONDS,
            )
            : Math.max(
                0,
                requestUpperBoundTimestamp -
                    POST_HISTORY_FOREGROUND_PERIODIC_AUTHORED_INITIAL_LOOKBACK_SECONDS,
            );
        const task = this.lightweightSyncCoordinator.runAuthored(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: "foreground-periodic",
            kinds: [1, 42],
            since,
            until: requestUpperBoundTimestamp,
            onSavedSelfPosts: params.onSavedSelfPosts,
            isActive,
        });
        authoredTasks.add(task);
        const result = await task.promise;
        authoredTasks.delete(task);

        if (!isActive() || task.joinedExisting || !isSuccess(result.fetchResult)) {
            return result;
        }

        if (state?.pendingCatchup) {
            await this.authoredSyncStateRepository.save(params.ownerPubkeyHex, {
                lastPeriodicSyncAt: result.fetchResult.fetchedAt,
                saturated: isSaturated(result.fetchResult) || state.saturated,
                maybeIncomplete: isSaturated(result.fetchResult) || state.maybeIncomplete,
            });
            return result;
        }

        if (isSaturated(result.fetchResult)) {
            const progress = resolvePendingProgress(result.fetchResult, requestUpperBoundTimestamp);
            await this.authoredSyncStateRepository.save(params.ownerPubkeyHex, {
                lastPeriodicSyncAt: result.fetchResult.fetchedAt,
                pendingCatchup: {
                    since,
                    until: requestUpperBoundTimestamp,
                    targetUpperBoundTimestamp: requestUpperBoundTimestamp,
                    cursorUntil: progress.cursorUntil,
                    boundaryMaybeIncomplete: progress.boundaryMaybeIncomplete,
                },
                saturated: true,
                maybeIncomplete: true,
            });
            return result;
        }

        await this.authoredSyncStateRepository.save(params.ownerPubkeyHex, {
            completedThroughTimestamp: requestUpperBoundTimestamp,
            lastPeriodicSyncAt: result.fetchResult.fetchedAt,
            pendingCatchup: null,
            saturated: false,
            maybeIncomplete: false,
        });
        return result;
    }

    private async runPendingCatchup(
        rxNostr: RxNostr,
        params: PostHistoryForegroundPeriodicSyncRequest,
        pending: PostHistoryAuthoredPendingCatchup,
        freshHead: PostHistoryLightweightAuthoredSyncResult,
        authoredTasks: Set<PostHistoryLightweightAuthoredSyncTask>,
        isActive: () => boolean,
    ): Promise<PostHistoryLightweightAuthoredSyncResult> {
        const pendingUntil = pending.cursorUntil ?? pending.until;
        const task = this.lightweightSyncCoordinator.runAuthored(rxNostr, {
            ownerPubkeyHex: params.ownerPubkeyHex,
            relayConfig: params.relayConfig,
            reason: "foreground-periodic",
            kinds: [1, 42],
            since: pending.since,
            until: pendingUntil,
            onSavedSelfPosts: params.onSavedSelfPosts,
            isActive,
        });
        authoredTasks.add(task);
        const result = await task.promise;
        authoredTasks.delete(task);
        if (!isActive() || task.joinedExisting || !isSuccess(result.fetchResult)) {
            return result;
        }

        if (isSaturated(result.fetchResult)) {
            const progress = resolvePendingProgress(result.fetchResult, pendingUntil);
            await this.authoredSyncStateRepository.save(params.ownerPubkeyHex, {
                lastPeriodicSyncAt: result.fetchResult.fetchedAt,
                pendingCatchup: {
                    ...pending,
                    cursorUntil: progress.cursorUntil,
                    boundaryMaybeIncomplete:
                        pending.boundaryMaybeIncomplete || progress.boundaryMaybeIncomplete,
                },
                saturated: true,
                maybeIncomplete: true,
            });
            return result;
        }

        const freshHeadLeftIncomplete = isSaturated(freshHead.fetchResult);
        await this.authoredSyncStateRepository.save(params.ownerPubkeyHex, {
            completedThroughTimestamp: pending.targetUpperBoundTimestamp,
            lastPeriodicSyncAt: result.fetchResult.fetchedAt,
            pendingCatchup: null,
            saturated: freshHeadLeftIncomplete,
            maybeIncomplete: freshHeadLeftIncomplete,
        });
        return result;
    }
}

export const postHistoryForegroundPeriodicSyncService =
    new PostHistoryForegroundPeriodicSyncService();
