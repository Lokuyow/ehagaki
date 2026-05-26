import type {
    PostHistoryPreviewContent,
} from "./postHistoryDialogUtils";

export type PostHistoryDialogMessageState = {
    key: string;
    values?: Record<string, string | number | boolean | Date | null | undefined>;
};

export type PostHistoryRepliesActionPresentationInput = {
    status: "unloaded" | "loading" | "loaded" | "failed";
    visible: boolean;
    replyCount: number;
};

export type PostHistoryReactionsActionPresentationInput = {
    visible: boolean;
    reactionCount: number;
};

export function resolvePostHistoryCountSummaryState(input: {
    totalCount: number;
    isSearchMode: boolean;
}): PostHistoryDialogMessageState | null {
    if (input.totalCount <= 0) {
        return null;
    }

    return {
        key: input.isSearchMode
            ? "postHistory.searchCountSummary"
            : "postHistory.visibleCountSummary",
        values: {
            total: input.totalCount,
        },
    };
}

export function resolvePostHistoryNavigationLabelKey(input: {
    direction: "older" | "newer";
    isSearchMode: boolean;
}): string {
    if (input.direction === "older") {
        return input.isSearchMode
            ? "postHistory.loadOlderSearchResults"
            : "postHistory.loadOlder";
    }

    return input.isSearchMode
        ? "postHistory.loadNewerSearchResults"
        : "postHistory.loadNewer";
}

export function hasRenderablePostHistoryPreviewContent(
    previewContent: PostHistoryPreviewContent,
): boolean {
    return previewContent.segments.some(
        (segment) =>
            segment.type === "emoji" ||
            (segment.type === "text" && segment.text.trim().length > 0),
    );
}

export function resolvePostHistoryRepliesActionLabelState(
    state: PostHistoryRepliesActionPresentationInput,
): PostHistoryDialogMessageState {
    if (state.status === "loading") {
        return { key: "postHistory.checkingReplies" };
    }

    if (state.status === "failed") {
        return { key: "postHistory.recheckReplies" };
    }

    if (state.status === "loaded") {
        if (state.replyCount === 0) {
            return { key: "postHistory.recheckReplies" };
        }

        if (state.visible) {
            return { key: "postHistory.hideReplies" };
        }

        return {
            key: "postHistory.showRepliesWithCount",
            values: {
                count: state.replyCount,
            },
        };
    }

    return { key: "postHistory.checkReplies" };
}

export function resolvePostHistoryReactionsActionLabelState(
    state: PostHistoryReactionsActionPresentationInput,
): PostHistoryDialogMessageState {
    if (state.visible) {
        return { key: "postHistory.hideReactions" };
    }

    return {
        key: "postHistory.showReactionsWithCount",
        values: {
            count: state.reactionCount,
        },
    };
}

export function isPostHistoryFavoriteReactionContent(content: string): boolean {
    return content === "+";
}
