import type { PostHistoryThreadGraphExpansionState } from "./postHistoryThreadGraphUtils";

export function buildParentLoadingExpansionState(
    state: PostHistoryThreadGraphExpansionState,
    options: {
        showInitialLoading: boolean;
    },
): PostHistoryThreadGraphExpansionState {
    return {
        ...state,
        loadingParent: options.showInitialLoading,
        revalidatingParent: !options.showInitialLoading,
        visibleParent: state.visibleParent || options.showInitialLoading,
        parentError: null,
        parentMissing: false,
        parentDeleted: false,
        showParentLoadingIndicator: false,
    };
}

export function buildParentLoadedExpansionState(
    state: PostHistoryThreadGraphExpansionState,
    options: {
        visibleParent?: boolean;
        revalidatingParent?: boolean;
        parentError?: string | null;
        parentMissing?: boolean;
        parentDeleted?: boolean;
        lastFetchedParentAt?: number | null;
    } = {},
): PostHistoryThreadGraphExpansionState {
    return {
        ...state,
        loadedParent: true,
        visibleParent: options.visibleParent ?? state.visibleParent,
        loadingParent: false,
        revalidatingParent:
            options.revalidatingParent ?? state.revalidatingParent,
        parentError: options.parentError ?? null,
        parentMissing: options.parentMissing ?? false,
        parentDeleted: options.parentDeleted ?? false,
        showParentLoadingIndicator: false,
        lastFetchedParentAt:
            options.lastFetchedParentAt ?? state.lastFetchedParentAt,
    };
}
