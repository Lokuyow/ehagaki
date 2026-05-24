import { describe, expect, it } from "vitest";
import {
    resolvePostHistoryDialogOpenRefreshDecision,
    type PostHistoryDialogOpenRefreshDecisionInput,
} from "../../lib/postHistoryDialogOpenRefreshDecision";

function createInput(
    overrides: Partial<PostHistoryDialogOpenRefreshDecisionInput> = {},
): PostHistoryDialogOpenRefreshDecisionInput {
    return {
        insertedCount: 0,
        updatedCount: 0,
        previousVisibleUntil: 100,
        nextVisibleUntil: 100,
        searchQuery: "",
        loadedPostsLength: 50,
        hasNewerLocal: true,
        ...overrides,
    };
}

describe("resolvePostHistoryDialogOpenRefreshDecision", () => {
    it("does not reload listing when dialog open refresh has no material display change", () => {
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(createInput()),
        ).toEqual({
            didVisibleMateriallyChange: false,
            didMateriallyChange: false,
            applyAction: "none",
        });
    });

    it("treats inserted, updated, or visibleUntil changes as material", () => {
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(
                createInput({ insertedCount: 1 }),
            ).didMateriallyChange,
        ).toBe(true);
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(
                createInput({ updatedCount: 1 }),
            ).didMateriallyChange,
        ).toBe(true);
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(
                createInput({ nextVisibleUntil: 90 }),
            ),
        ).toMatchObject({
            didVisibleMateriallyChange: true,
            didMateriallyChange: true,
        });
    });

    it("reloads the current search page while search mode is active", () => {
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(
                createInput({
                    insertedCount: 1,
                    searchQuery: "needle",
                    loadedPostsLength: 0,
                    hasNewerLocal: false,
                }),
            ).applyAction,
        ).toBe("reload-search-page");
    });

    it("loads latest visible posts for empty listing or when no newer local posts are pending", () => {
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(
                createInput({
                    insertedCount: 1,
                    loadedPostsLength: 0,
                    hasNewerLocal: true,
                }),
            ).applyAction,
        ).toBe("load-latest-visible-posts");
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(
                createInput({
                    insertedCount: 1,
                    loadedPostsLength: 50,
                    hasNewerLocal: false,
                }),
            ).applyAction,
        ).toBe("load-latest-visible-posts");
    });

    it("refreshes only count and availability when a visible window has newer local posts", () => {
        expect(
            resolvePostHistoryDialogOpenRefreshDecision(
                createInput({
                    insertedCount: 1,
                    loadedPostsLength: 50,
                    hasNewerLocal: true,
                }),
            ).applyAction,
        ).toBe("refresh-count-and-availability");
    });
});
