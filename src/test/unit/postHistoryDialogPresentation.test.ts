import { describe, expect, it } from "vitest";
import {
    hasRenderablePostHistoryPreviewContent,
    isPostHistoryFavoriteReactionContent,
    resolvePostHistoryCountSummaryState,
    resolvePostHistoryNavigationLabelKey,
    resolvePostHistoryReactionsActionLabelState,
    resolvePostHistoryRepliesActionLabelState,
} from "../../lib/postHistoryDialogPresentation";

describe("postHistoryDialogPresentation", () => {
    it("件数 summary は0件以下では非表示にし、通常/検索で key を切り替える", () => {
        expect(resolvePostHistoryCountSummaryState({
            totalCount: 0,
            isSearchMode: false,
        })).toBeNull();
        expect(resolvePostHistoryCountSummaryState({
            totalCount: 3,
            isSearchMode: false,
        })).toEqual({
            key: "postHistory.visibleCountSummary",
            values: { total: 3 },
        });
        expect(resolvePostHistoryCountSummaryState({
            totalCount: 3,
            isSearchMode: true,
        })).toEqual({
            key: "postHistory.searchCountSummary",
            values: { total: 3 },
        });
    });

    it("older/newer の nav label key は検索モードだけ検索結果用に切り替える", () => {
        expect(resolvePostHistoryNavigationLabelKey({
            direction: "older",
            isSearchMode: false,
        })).toBe("postHistory.loadOlder");
        expect(resolvePostHistoryNavigationLabelKey({
            direction: "older",
            isSearchMode: true,
        })).toBe("postHistory.loadOlderSearchResults");
        expect(resolvePostHistoryNavigationLabelKey({
            direction: "newer",
            isSearchMode: false,
        })).toBe("postHistory.loadNewer");
        expect(resolvePostHistoryNavigationLabelKey({
            direction: "newer",
            isSearchMode: true,
        })).toBe("postHistory.loadNewerSearchResults");
    });

    it("preview content は空白 text と media だけでは本文枠を表示対象にしない", () => {
        expect(hasRenderablePostHistoryPreviewContent({
            segments: [
                { type: "text", text: "   " },
                {
                    type: "media",
                    url: "https://example.com/image.jpg",
                    normalizedUrl: "https://example.com/image.jpg",
                    media: { url: "https://example.com/image.jpg" },
                },
            ],
            emojiUrls: [],
        })).toBe(false);

        expect(hasRenderablePostHistoryPreviewContent({
            segments: [{ type: "text", text: "本文" }],
            emojiUrls: [],
        })).toBe(true);
        expect(hasRenderablePostHistoryPreviewContent({
            segments: [{
                type: "emoji",
                shortcode: "blobcat",
                shortcodeLower: "blobcat",
                rawShortcodeText: ":blobcat:",
                url: "https://example.com/blobcat.png",
            }],
            emojiUrls: ["https://example.com/blobcat.png"],
        })).toBe(true);
    });

    it("返信 action label state は loading/failed/loaded/count/visible を key と values に畳み込む", () => {
        expect(resolvePostHistoryRepliesActionLabelState({
            status: "unloaded",
            visible: false,
            replyCount: 0,
        })).toEqual({ key: "postHistory.checkReplies" });
        expect(resolvePostHistoryRepliesActionLabelState({
            status: "loading",
            visible: false,
            replyCount: 0,
        })).toEqual({ key: "postHistory.checkingReplies" });
        expect(resolvePostHistoryRepliesActionLabelState({
            status: "failed",
            visible: false,
            replyCount: 0,
        })).toEqual({ key: "postHistory.recheckReplies" });
        expect(resolvePostHistoryRepliesActionLabelState({
            status: "loaded",
            visible: false,
            replyCount: 0,
        })).toEqual({ key: "postHistory.recheckReplies" });
        expect(resolvePostHistoryRepliesActionLabelState({
            status: "loaded",
            visible: false,
            replyCount: 2,
        })).toEqual({
            key: "postHistory.showRepliesWithCount",
            values: { count: 2 },
        });
        expect(resolvePostHistoryRepliesActionLabelState({
            status: "loaded",
            visible: true,
            replyCount: 2,
        })).toEqual({ key: "postHistory.hideReplies" });
    });

    it("reaction action label state は件数付き表示と折りたたみ文言を返す", () => {
        expect(resolvePostHistoryReactionsActionLabelState({
            visible: false,
            reactionCount: 3,
        })).toEqual({
            key: "postHistory.showReactionsWithCount",
            values: { count: 3 },
        });
        expect(resolvePostHistoryReactionsActionLabelState({
            visible: true,
            reactionCount: 3,
        })).toEqual({ key: "postHistory.hideReactions" });
    });

    it("favorite iconへ置換する内部値は+だけに限定する", () => {
        expect(isPostHistoryFavoriteReactionContent("+")).toBe(true);
        expect(isPostHistoryFavoriteReactionContent("👍")).toBe(false);
    });
});
