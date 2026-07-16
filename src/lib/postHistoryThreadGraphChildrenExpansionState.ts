import type { PostHistoryThreadGraphExpansionState } from "./postHistoryThreadGraphUtils";

export function buildChildrenLoadingExpansionState(
    state: PostHistoryThreadGraphExpansionState,
    options: {
        showInitialLoading: boolean;
        prefetchOnly: boolean;
    },
): PostHistoryThreadGraphExpansionState {
    return {
        ...state,
        loadingChildren: options.showInitialLoading,
        revalidatingChildren: !options.showInitialLoading,
        visibleChildren: options.prefetchOnly
            ? state.visibleChildren
            : state.visibleChildren || options.showInitialLoading,
        childrenError: null,
    };
}

export function buildChildrenLoadedExpansionState(
    state: PostHistoryThreadGraphExpansionState,
    options: {
        visibleChildren?: boolean;
        revalidatingChildren?: boolean;
        loadedChildren?: boolean;
        lastFetchedChildrenAt?: number | null;
    } = {},
): PostHistoryThreadGraphExpansionState {
    return {
        ...state,
        loadedChildren: options.loadedChildren ?? true,
        visibleChildren: options.visibleChildren ?? state.visibleChildren,
        loadingChildren: false,
        revalidatingChildren:
            options.revalidatingChildren ?? state.revalidatingChildren,
        childrenError: null,
        lastFetchedChildrenAt:
            options.lastFetchedChildrenAt !== undefined
                ? options.lastFetchedChildrenAt
                : state.lastFetchedChildrenAt,
    };
}

export function buildChildrenFailedExpansionState(
    state: PostHistoryThreadGraphExpansionState,
    options: {
        nextError: string | null;
    },
): PostHistoryThreadGraphExpansionState {
    return {
        ...state,
        loadingChildren: false,
        revalidatingChildren: false,
        visibleChildren: state.visibleChildren,
        childrenError: options.nextError,
    };
}
