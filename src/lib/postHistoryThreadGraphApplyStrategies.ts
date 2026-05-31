import type { PostHistoryRelatedTargetSnapshot } from "./postHistoryRelatedTargetResolver.svelte";
import { buildChildrenLoadedExpansionState } from "./postHistoryThreadGraphChildrenExpansionState";
import { buildParentLoadedExpansionState } from "./postHistoryThreadGraphParentExpansionState";
import type {
    PostHistoryThreadGraphExpansionState,
    PostHistoryThreadGraphNode,
} from "./postHistoryThreadGraphUtils";

export type ParentRevalidateStatus = "deleted" | "not-found" | "resolved" | "failed";
export type ChildrenRevalidateStatus = "resolved" | "not-found" | "deleted";

export function resolveParentRevalidateStatus(
    snapshot: PostHistoryRelatedTargetSnapshot,
): ParentRevalidateStatus {
    if (snapshot.status === "deleted") {
        return "deleted";
    }
    if (snapshot.status === "not-found") {
        return "not-found";
    }
    if (snapshot.status === "resolved" && snapshot.event) {
        return "resolved";
    }
    return "failed";
}

export function resolveChildrenRevalidateStatus(options: {
    nextRecordsLength: number;
    resultEventsLength: number;
}): ChildrenRevalidateStatus {
    if (options.nextRecordsLength > 0) {
        return "resolved";
    }
    if (options.resultEventsLength > 0) {
        return "deleted";
    }
    return "not-found";
}

interface ParentRevalidateStrategyOptions {
    snapshot: PostHistoryRelatedTargetSnapshot;
    parentEventId: string;
    showInitialLoading: boolean;
    updateExpansion: (
        updater: (
            state: PostHistoryThreadGraphExpansionState,
        ) => PostHistoryThreadGraphExpansionState,
    ) => void;
    hideEvent: (authorPubkey: string, eventId: string) => void;
    markParentDeletedForEvent: (
        parentEventId: string,
        authorPubkey: string,
        options?: { revealKnownParent?: boolean },
    ) => void;
    setParentDeleted: () => void;
    isDeletedEvent: (authorPubkey: string, eventId: string) => boolean;
    upsertNode: () => PostHistoryThreadGraphNode;
    upsertParentEdge: (eventId: string, parentEventId: string | null) => void;
}

export function createParentRevalidateStatusStrategies(
    options: ParentRevalidateStrategyOptions,
): Partial<Record<ParentRevalidateStatus, () => void>> {
    return {
        deleted: () => {
            if (options.snapshot.authorPubkey) {
                options.hideEvent(options.snapshot.authorPubkey, options.parentEventId);
                options.markParentDeletedForEvent(
                    options.parentEventId,
                    options.snapshot.authorPubkey,
                    { revealKnownParent: true },
                );
            }
            options.setParentDeleted();
        },
        "not-found": () => {
            options.updateExpansion((state) => ({
                ...buildParentLoadedExpansionState(state, {
                    revalidatingParent: false,
                    parentMissing: options.showInitialLoading
                        ? true
                        : state.parentMissing,
                    parentDeleted: false,
                    lastFetchedParentAt: options.snapshot.updatedAt ?? Date.now(),
                }),
            }));
        },
        resolved: () => {
            if (!options.snapshot.event) {
                return;
            }

            if (
                options.snapshot.authorPubkey
                && options.isDeletedEvent(options.snapshot.authorPubkey, options.parentEventId)
            ) {
                options.setParentDeleted();
                return;
            }

            const node = options.upsertNode();
            options.upsertParentEdge(node.eventId, node.parentEventId);
            options.updateExpansion((state) => ({
                ...buildParentLoadedExpansionState(state, {
                    revalidatingParent: false,
                    parentMissing: false,
                    parentDeleted: false,
                    lastFetchedParentAt: options.snapshot.updatedAt ?? Date.now(),
                }),
            }));
        },
        failed: () => {
            options.updateExpansion((state) => ({
                ...state,
                loadingParent: false,
                revalidatingParent: false,
                visibleParent: state.visibleParent,
                parentError: options.showInitialLoading
                    ? options.snapshot.errorCode ?? "fetch_failed"
                    : state.parentError,
                showParentLoadingIndicator: false,
            }));
        },
    };
}

interface ChildrenRevalidateStrategyOptions {
    fetchedAt: number;
    prefetchOnly: boolean;
    updateExpansion: (
        updater: (
            state: PostHistoryThreadGraphExpansionState,
        ) => PostHistoryThreadGraphExpansionState,
    ) => void;
    prefetchChildReplyCounts: () => void;
}

export function createChildrenRevalidateStatusStrategies(
    options: ChildrenRevalidateStrategyOptions,
): Partial<Record<ChildrenRevalidateStatus, () => void>> {
    const applyLoaded = (): void => {
        options.updateExpansion((state) => ({
            ...buildChildrenLoadedExpansionState(state, {
                revalidatingChildren: false,
                lastFetchedChildrenAt: options.fetchedAt,
            }),
        }));
        if (!options.prefetchOnly) {
            options.prefetchChildReplyCounts();
        }
    };

    return {
        resolved: applyLoaded,
        "not-found": applyLoaded,
        deleted: applyLoaded,
    };
}
