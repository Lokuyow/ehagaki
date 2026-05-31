import { describe, expect, it } from "vitest";
import {
    buildParentLoadedExpansionState,
    buildParentLoadingExpansionState,
} from "../../lib/postHistoryThreadGraphParentExpansionState";
import { buildInitialExpansionState } from "../../lib/postHistoryThreadGraphUtils";

describe("postHistoryThreadGraphParentExpansionState", () => {
    it("loading transition は初回ローディング時に loadingParent を立てる", () => {
        const initial = buildInitialExpansionState();

        const next = buildParentLoadingExpansionState(initial, {
            showInitialLoading: true,
        });

        expect(next).toMatchObject({
            loadingParent: true,
            revalidatingParent: false,
            visibleParent: true,
            parentMissing: false,
            parentDeleted: false,
            showParentLoadingIndicator: false,
        });
    });

    it("loading transition は再検証時に revalidatingParent を立てる", () => {
        const initial = {
            ...buildInitialExpansionState(),
            visibleParent: true,
            parentMissing: true,
            parentDeleted: true,
        };

        const next = buildParentLoadingExpansionState(initial, {
            showInitialLoading: false,
        });

        expect(next).toMatchObject({
            loadingParent: false,
            revalidatingParent: true,
            visibleParent: true,
            parentMissing: false,
            parentDeleted: false,
        });
    });

    it("loaded transition は loadedParent を立て、デフォルトで error/missing/deleted を落とす", () => {
        const initial = {
            ...buildInitialExpansionState(),
            loadingParent: true,
            parentError: "fetch_failed",
            parentMissing: true,
            parentDeleted: true,
        };

        const next = buildParentLoadedExpansionState(initial);

        expect(next).toMatchObject({
            loadedParent: true,
            loadingParent: false,
            parentError: null,
            parentMissing: false,
            parentDeleted: false,
            showParentLoadingIndicator: false,
        });
    });

    it("loaded transition は options で visible/missing/deleted/timestamp を上書きできる", () => {
        const initial = {
            ...buildInitialExpansionState(),
            visibleParent: false,
            lastFetchedParentAt: null,
        };

        const next = buildParentLoadedExpansionState(initial, {
            visibleParent: true,
            parentMissing: true,
            parentDeleted: true,
            revalidatingParent: false,
            lastFetchedParentAt: 123,
        });

        expect(next).toMatchObject({
            loadedParent: true,
            visibleParent: true,
            parentMissing: true,
            parentDeleted: true,
            revalidatingParent: false,
            lastFetchedParentAt: 123,
        });
    });
});
