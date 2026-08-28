import { describe, expect, it, vi } from "vitest";
import type { RxNostr } from "rx-nostr";
import {
    createPostHistoryVisibleRangeRelationRepairCoordinator,
    POST_HISTORY_OLDER_REVEAL_RELATION_REPAIR_FRESHNESS_TTL_MS,
    resolveOlderRevealChildInteractionRepairNetworkParentIds,
    resolveVisibleOlderRevealChildInteractionRepairParentPosts,
} from "../../lib/postHistoryVisibleRangeRelationRepairCoordinator";
import type {
    PostHistoryChildInteractionDeletionLifecycleTriggerRequest,
    PostHistoryChildInteractionDeletionLifecycleTriggerResult,
} from "../../lib/postHistoryChildInteractionDeletionLifecycleTrigger";
import type {
    PostHistoryVisibleRangeRelationRepairResult,
    PostHistoryVisibleRangeRelationRepairTask,
} from "../../lib/postHistoryVisibleRangeChildInteractionRepairService";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";

const OWNER_PUBKEY = "a".repeat(64);
const RX_NOSTR = {} as RxNostr;

function createPost(eventId: string): PostHistoryRecord {
    return {
        id: eventId,
        eventId,
        pubkeyHex: OWNER_PUBKEY,
        kind: 1,
        content: eventId,
        tags: [],
        createdAt: 1_700_000_000,
        postedAt: 1_700_000_000,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: {},
        updatedAt: 1_700_000_000,
        schemaVersion: 2,
    };
}

function createRelationRepairResult(
    overrides: Partial<PostHistoryVisibleRangeRelationRepairResult> = {},
): PostHistoryVisibleRangeRelationRepairResult {
    return {
        status: "success",
        targetParentEventIds: [],
        checkedParentEventIds: [],
        savedParentEventIds: [],
        savedDirectReplyCount: 0,
        attemptedChunkCount: 0,
        saturatedChunkCount: 0,
        incompleteParentEventIds: [],
        deletionConfirmationIncomplete: false,
        relationKinds: ["reply", "reaction", "quote"],
        quoteRepairApplied: false,
        ...overrides,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((nextResolve, nextReject) => {
        resolve = nextResolve;
        reject = nextReject;
    });

    return { promise, resolve, reject };
}

function createRepairTask(
    promise: Promise<PostHistoryVisibleRangeRelationRepairResult>,
): PostHistoryVisibleRangeRelationRepairTask {
    return {
        promise,
        cancel: vi.fn(),
    };
}

function createCoordinator(options: {
    loadedPosts?: PostHistoryRecord[];
    repairTask: PostHistoryVisibleRangeRelationRepairTask;
    triggerDeletionLifecycle?: (
        request: PostHistoryChildInteractionDeletionLifecycleTriggerRequest,
    ) => Promise<PostHistoryChildInteractionDeletionLifecycleTriggerResult>;
}) {
    let loadedPosts = options.loadedPosts ?? [createPost("initial")];
    const onChildInteractionBadgeRefreshRequested = vi.fn();
    const onQuoteVisibleRangeRefreshRequested = vi.fn();
    const relationRepairService = {
        repairVisibleRangeRelations: vi.fn(() => options.repairTask),
    };
    const triggerDeletionLifecycle = options.triggerDeletionLifecycle
        ?? vi.fn(async (): Promise<PostHistoryChildInteractionDeletionLifecycleTriggerResult> => ({
            source: "listing-current-view",
            status: "completed",
            checkedParentEventIds: [],
            deletedReactionEventIds: [],
            deletedReplyEventIds: [],
            deletionConfirmationIncomplete: false,
        }));
    const coordinator = createPostHistoryVisibleRangeRelationRepairCoordinator({
        getShow: () => true,
        getPubkeyHex: () => OWNER_PUBKEY,
        getRxNostr: () => RX_NOSTR,
        getRelayConfig: () => null,
        getLoadedPosts: () => loadedPosts,
        onChildInteractionBadgeRefreshRequested,
        onQuoteVisibleRangeRefreshRequested,
        relationRepairService,
        triggerDeletionLifecycle,
        now: () => 100_000,
    });

    return {
        coordinator,
        relationRepairService,
        triggerDeletionLifecycle,
        onChildInteractionBadgeRefreshRequested,
        onQuoteVisibleRangeRefreshRequested,
        setLoadedPosts: (nextPosts: PostHistoryRecord[]) => {
            loadedPosts = nextPosts;
        },
    };
}

function currentViewRequest(post = createPost("parent")) {
    return {
        ownerPubkeyHex: OWNER_PUBKEY,
        rxNostr: RX_NOSTR,
        visiblePosts: [post],
        isActive: () => true,
    };
}

describe("postHistoryVisibleRangeRelationRepairCoordinator", () => {
    it("keeps only currently visible owner kind:1/kind:42 parents for older reveal", () => {
        const visibleSelf = createPost("visible-self");
        const hiddenSelf = createPost("hidden-self");
        const visibleKind42 = {
            ...createPost("visible-kind-42"),
            kind: 42,
        };
        const visibleOther = {
            ...createPost("visible-other"),
            pubkeyHex: "b".repeat(64),
        };

        expect(
            resolveVisibleOlderRevealChildInteractionRepairParentPosts(
                OWNER_PUBKEY,
                [visibleSelf, hiddenSelf, visibleKind42, visibleOther],
                [visibleSelf, visibleKind42, visibleOther],
            ),
        ).toEqual([visibleSelf, visibleKind42]);
    });

    it("excludes fresh and in-flight parents from older reveal network repair", () => {
        const nowMs = 100_000;
        const freshCheckedAt = nowMs - (
            POST_HISTORY_OLDER_REVEAL_RELATION_REPAIR_FRESHNESS_TTL_MS - 1_000
        );
        const staleCheckedAt = nowMs - (
            POST_HISTORY_OLDER_REVEAL_RELATION_REPAIR_FRESHNESS_TTL_MS + 1_000
        );

        expect(resolveOlderRevealChildInteractionRepairNetworkParentIds(
            ["fresh-parent", "stale-parent", "unchecked-parent", "inflight-parent"],
            new Map([
                ["fresh-parent", freshCheckedAt],
                ["stale-parent", staleCheckedAt],
            ]),
            new Set(["inflight-parent"]),
            nowMs,
        )).toEqual(["stale-parent", "unchecked-parent"]);
    });

    it("does not refresh badges before an older reveal repair or deletion changes cached data", async () => {
        const deferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const task = createRepairTask(deferred.promise);
        const {
            coordinator,
            onChildInteractionBadgeRefreshRequested,
        } = createCoordinator({
            loadedPosts: [createPost("parent")],
            repairTask: task,
        });

        coordinator.scheduleOlderRevealRepair([createPost("parent")]);
        await Promise.resolve();
        expect(onChildInteractionBadgeRefreshRequested).not.toHaveBeenCalled();

        deferred.resolve(createRelationRepairResult({
            checkedParentEventIds: ["parent"],
            savedParentEventIds: ["parent"],
        }));
        await vi.waitFor(() => {
            expect(onChildInteractionBadgeRefreshRequested).toHaveBeenCalledWith(
                [expect.objectContaining({ eventId: "parent" })],
                ["parent"],
            );
        });
    });

    it("cancels the tracked current-view relation repair and rejects its late callback", async () => {
        const deferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const task = createRepairTask(deferred.promise);
        const {
            coordinator,
            onChildInteractionBadgeRefreshRequested,
        } = createCoordinator({ repairTask: task });

        const repair = coordinator.repairCurrentView(currentViewRequest());
        coordinator.cancelCurrentViewRepair();

        expect(task.cancel).toHaveBeenCalledTimes(1);
        deferred.resolve(createRelationRepairResult({
            savedParentEventIds: ["parent"],
            savedDirectReplyCount: 2,
        }));

        await expect(repair).resolves.toEqual({
            status: "cancelled",
            savedDirectReplyCount: 2,
        });
        expect(onChildInteractionBadgeRefreshRequested).not.toHaveBeenCalled();
    });

    it("uses the current loaded posts for a manual repair completion badge refresh", async () => {
        const deferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const task = createRepairTask(deferred.promise);
        const {
            coordinator,
            onChildInteractionBadgeRefreshRequested,
            setLoadedPosts,
        } = createCoordinator({
            loadedPosts: [createPost("before")],
            repairTask: task,
        });

        const repair = coordinator.repairCurrentView(currentViewRequest());
        const currentPosts = [createPost("after")];
        setLoadedPosts(currentPosts);
        deferred.resolve(createRelationRepairResult({
            savedParentEventIds: ["parent"],
            savedDirectReplyCount: 1,
        }));

        await expect(repair).resolves.toEqual({
            status: "success",
            savedDirectReplyCount: 1,
        });
        expect(onChildInteractionBadgeRefreshRequested).toHaveBeenCalledWith(
            currentPosts,
            ["parent"],
        );
    });

    it("uses the current loaded posts when a deletion lifecycle completion requests a badge refresh", async () => {
        const repairDeferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const deletionDeferred = createDeferred<PostHistoryChildInteractionDeletionLifecycleTriggerResult>();
        const task = createRepairTask(repairDeferred.promise);
        const {
            coordinator,
            onChildInteractionBadgeRefreshRequested,
            setLoadedPosts,
        } = createCoordinator({
            loadedPosts: [createPost("before-deletion")],
            repairTask: task,
            triggerDeletionLifecycle: vi.fn(() => deletionDeferred.promise),
        });

        const repair = coordinator.repairCurrentView(currentViewRequest());
        const currentPosts = [createPost("after-deletion")];
        setLoadedPosts(currentPosts);
        deletionDeferred.resolve({
            source: "listing-current-view",
            status: "completed",
            checkedParentEventIds: ["parent"],
            deletedReactionEventIds: ["reaction"],
            deletedReplyEventIds: [],
            deletionConfirmationIncomplete: false,
        });
        await Promise.resolve();

        expect(onChildInteractionBadgeRefreshRequested).toHaveBeenCalledWith(
            currentPosts,
            ["parent"],
        );

        repairDeferred.resolve(createRelationRepairResult());
        await repair;
    });

    it("resets older reveal tasks, scope, freshness, and in-flight state together", async () => {
        const firstDeferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const secondDeferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const firstTask = createRepairTask(firstDeferred.promise);
        const secondTask = createRepairTask(secondDeferred.promise);
        const {
            coordinator,
            relationRepairService,
        } = createCoordinator({
            loadedPosts: [createPost("parent")],
            repairTask: firstTask,
        });
        relationRepairService.repairVisibleRangeRelations
            .mockReturnValueOnce(firstTask)
            .mockReturnValueOnce(secondTask);

        coordinator.scheduleOlderRevealRepair([createPost("parent")]);
        coordinator.resetOlderRevealRepairContext();
        expect(firstTask.cancel).toHaveBeenCalledTimes(1);

        coordinator.scheduleOlderRevealRepair([createPost("parent")]);
        expect(relationRepairService.repairVisibleRangeRelations).toHaveBeenCalledTimes(2);

        firstDeferred.resolve(createRelationRepairResult({
            savedParentEventIds: ["parent"],
            checkedParentEventIds: ["parent"],
        }));
        await Promise.resolve();

        coordinator.scheduleOlderRevealRepair([createPost("parent")]);
        expect(relationRepairService.repairVisibleRangeRelations).toHaveBeenCalledTimes(2);

        secondDeferred.resolve(createRelationRepairResult());
    });

    it("keeps the manual current-view task when only the older reveal context resets", async () => {
        const manualDeferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const manualTask = createRepairTask(manualDeferred.promise);
        const { coordinator } = createCoordinator({ repairTask: manualTask });

        const repair = coordinator.repairCurrentView(currentViewRequest());
        coordinator.resetOlderRevealRepairContext();

        expect(manualTask.cancel).not.toHaveBeenCalled();
        manualDeferred.resolve(createRelationRepairResult());
        await expect(repair).resolves.toEqual({
            status: "success",
            savedDirectReplyCount: 0,
        });
    });

    it("disposes both retained current-view and older reveal repair tasks", () => {
        const currentTask = createRepairTask(new Promise(() => undefined));
        const olderTask = createRepairTask(new Promise(() => undefined));
        const {
            coordinator,
            relationRepairService,
        } = createCoordinator({
            loadedPosts: [createPost("parent")],
            repairTask: currentTask,
        });
        relationRepairService.repairVisibleRangeRelations
            .mockReturnValueOnce(currentTask)
            .mockReturnValueOnce(olderTask);

        void coordinator.repairCurrentView(currentViewRequest());
        coordinator.scheduleOlderRevealRepair([createPost("parent")]);
        coordinator.dispose();

        expect(currentTask.cancel).toHaveBeenCalledTimes(1);
        expect(olderTask.cancel).toHaveBeenCalledTimes(1);
    });

    it("runs jump repair without blocking the caller and preserves the awaited badge refresh", async () => {
        const deferred = createDeferred<PostHistoryVisibleRangeRelationRepairResult>();
        const task = createRepairTask(deferred.promise);
        const badgeRefresh = vi.fn(async () => undefined);
        const relationRepairService = {
            repairVisibleRangeRelations: vi.fn(() => task),
        };
        const coordinator = createPostHistoryVisibleRangeRelationRepairCoordinator({
            getShow: () => true,
            getPubkeyHex: () => OWNER_PUBKEY,
            getRxNostr: () => RX_NOSTR,
            getRelayConfig: () => null,
            getLoadedPosts: () => [createPost("current")],
            onChildInteractionBadgeRefreshRequested: badgeRefresh,
            onQuoteVisibleRangeRefreshRequested: vi.fn(),
            relationRepairService,
            triggerDeletionLifecycle: vi.fn().mockResolvedValue({
                source: "listing-current-view",
                status: "completed",
                checkedParentEventIds: [],
                deletedReactionEventIds: [],
                deletedReplyEventIds: [],
                deletionConfirmationIncomplete: false,
            }),
        });

        const repair = coordinator.repairJump(currentViewRequest());
        expect(relationRepairService.repairVisibleRangeRelations).toHaveBeenCalledTimes(1);
        expect(badgeRefresh).not.toHaveBeenCalled();

        deferred.resolve(createRelationRepairResult({
            savedParentEventIds: ["parent"],
        }));
        await repair;

        expect(badgeRefresh).toHaveBeenCalledWith(
            [expect.objectContaining({ eventId: "current" })],
            ["parent"],
        );
    });

    it("swallows a jump relation repair rejection without running refresh callbacks", async () => {
        const rejection = new Error("jump relation repair failed");
        const task = createRepairTask(Promise.reject(rejection));
        const {
            coordinator,
            onChildInteractionBadgeRefreshRequested,
            onQuoteVisibleRangeRefreshRequested,
        } = createCoordinator({ repairTask: task });

        await expect(coordinator.repairJump(currentViewRequest())).resolves.toBeUndefined();
        expect(onChildInteractionBadgeRefreshRequested).not.toHaveBeenCalled();
        expect(onQuoteVisibleRangeRefreshRequested).not.toHaveBeenCalled();
    });

    it("swallows a jump badge refresh rejection after one awaited callback", async () => {
        const task = createRepairTask(Promise.resolve(createRelationRepairResult({
            savedParentEventIds: ["parent"],
        })));
        const {
            coordinator,
            onChildInteractionBadgeRefreshRequested,
        } = createCoordinator({ repairTask: task });
        onChildInteractionBadgeRefreshRequested.mockRejectedValueOnce(
            new Error("badge refresh failed"),
        );

        await expect(coordinator.repairJump(currentViewRequest())).resolves.toBeUndefined();
        expect(onChildInteractionBadgeRefreshRequested).toHaveBeenCalledTimes(1);
    });

    it("continues to propagate manual current-view repair rejection", async () => {
        const rejection = new Error("manual relation repair failed");
        const task = createRepairTask(Promise.reject(rejection));
        const { coordinator } = createCoordinator({ repairTask: task });

        await expect(coordinator.repairCurrentView(currentViewRequest()))
            .rejects.toBe(rejection);
    });
});
