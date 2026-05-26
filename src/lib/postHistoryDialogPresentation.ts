import { isCustomEmojiShortcodeText } from "./customEmoji";
import type {
    PostHistoryPreviewContent,
} from "./postHistoryDialogUtils";
import type { PostHistoryReactionAggregate } from "./postHistoryReactionSummary";

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

export interface PostHistoryDisplayedReactionGroup {
    content: string;
    count: number;
    emojiUrl?: string;
}

const reactionGraphemeSegmenter = new Intl.Segmenter(undefined, {
    granularity: "grapheme",
});

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

export function resolvePostHistoryReactionDisplayContent(content: string): string {
    const normalized = content.trim();
    if (!normalized) {
        return "";
    }

    if (isCustomEmojiShortcodeText(normalized)) {
        return normalized;
    }

    const grapheme = reactionGraphemeSegmenter.segment(normalized)[Symbol.iterator]().next();
    if (grapheme.done) {
        return "";
    }

    return grapheme.value.segment;
}

export function resolvePostHistoryDisplayedReactionGroups(
    groups: PostHistoryReactionAggregate[],
): PostHistoryDisplayedReactionGroup[] {
    const countByDisplayContent = new Map<string, number>();
    const emojiUrlByDisplayContent = new Map<string, string>();
    const orderedDisplayContents: string[] = [];

    for (const group of groups) {
        const displayContent = resolvePostHistoryReactionDisplayContent(group.content);
        if (!displayContent) {
            continue;
        }

        if (!countByDisplayContent.has(displayContent)) {
            orderedDisplayContents.push(displayContent);
        }

        if (group.emojiUrl && !emojiUrlByDisplayContent.has(displayContent)) {
            emojiUrlByDisplayContent.set(displayContent, group.emojiUrl);
        }

        countByDisplayContent.set(
            displayContent,
            (countByDisplayContent.get(displayContent) ?? 0) + group.count,
        );
    }

    return orderedDisplayContents.map((content) => {
        const emojiUrl = emojiUrlByDisplayContent.get(content);

        return emojiUrl
            ? {
                content,
                count: countByDisplayContent.get(content) ?? 0,
                emojiUrl,
            }
            : {
                content,
                count: countByDisplayContent.get(content) ?? 0,
            };
    });
}
