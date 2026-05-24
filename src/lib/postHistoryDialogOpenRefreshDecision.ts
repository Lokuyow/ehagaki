export type PostHistoryDialogOpenRefreshApplyAction =
    | "none"
    | "reload-search-page"
    | "load-latest-visible-posts"
    | "refresh-count-and-availability";

export interface PostHistoryDialogOpenRefreshDecisionInput {
    insertedCount: number;
    updatedCount: number;
    previousVisibleUntil: number | null;
    nextVisibleUntil: number | null;
    searchQuery: string;
    loadedPostsLength: number;
    hasNewerLocal: boolean;
}

export interface PostHistoryDialogOpenRefreshDecision {
    didVisibleMateriallyChange: boolean;
    didMateriallyChange: boolean;
    applyAction: PostHistoryDialogOpenRefreshApplyAction;
}

export function resolvePostHistoryDialogOpenRefreshDecision(
    input: PostHistoryDialogOpenRefreshDecisionInput,
): PostHistoryDialogOpenRefreshDecision {
    const didVisibleMateriallyChange =
        input.nextVisibleUntil !== input.previousVisibleUntil;
    const didMateriallyChange =
        input.insertedCount + input.updatedCount > 0 ||
        didVisibleMateriallyChange;

    if (!didMateriallyChange) {
        return {
            didVisibleMateriallyChange,
            didMateriallyChange,
            applyAction: "none",
        };
    }

    if (input.searchQuery.length > 0) {
        return {
            didVisibleMateriallyChange,
            didMateriallyChange,
            applyAction: "reload-search-page",
        };
    }

    if (input.loadedPostsLength === 0 || !input.hasNewerLocal) {
        return {
            didVisibleMateriallyChange,
            didMateriallyChange,
            applyAction: "load-latest-visible-posts",
        };
    }

    return {
        didVisibleMateriallyChange,
        didMateriallyChange,
        applyAction: "refresh-count-and-availability",
    };
}
