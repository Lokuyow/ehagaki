import { describe, expect, it } from "vitest";
import {
    buildChildrenFailedExpansionState,
    buildChildrenLoadedExpansionState,
    buildChildrenLoadingExpansionState,
} from "../../lib/postHistoryThreadGraphChildrenExpansionState";
import { buildInitialExpansionState } from "../../lib/postHistoryThreadGraphUtils";

describe("postHistoryThreadGraphChildrenExpansionState", () => {
    it("loading transition は初回ローディング時に loadingChildren を立てる", () => {
        const initial = buildInitialExpansionState();

        const next = buildChildrenLoadingExpansionState(initial, {
            showInitialLoading: true,
            prefetchOnly: false,
        });

        expect(next).toMatchObject({
            loadingChildren: true,
            revalidatingChildren: false,
            visibleChildren: true,
            childrenError: null,
        });
    });

    it("loading transition は prefetch で可視状態を維持する", () => {
        const initial = {
            ...buildInitialExpansionState(),
            visibleChildren: false,
            childrenError: "fetch_failed",
        };

        const next = buildChildrenLoadingExpansionState(initial, {
            showInitialLoading: false,
            prefetchOnly: true,
        });

        expect(next).toMatchObject({
            loadingChildren: false,
            revalidatingChildren: true,
            visibleChildren: false,
            childrenError: null,
        });
    });

    it("loaded transition は loadedChildren を立てて error を解消する", () => {
        const initial = {
            ...buildInitialExpansionState(),
            loadingChildren: true,
            childrenError: "fetch_failed",
        };

        const next = buildChildrenLoadedExpansionState(initial, {
            lastFetchedChildrenAt: 123,
        });

        expect(next).toMatchObject({
            loadedChildren: true,
            loadingChildren: false,
            childrenError: null,
            lastFetchedChildrenAt: 123,
        });
    });

    it("failed transition は loading/revalidating を落として error を設定する", () => {
        const initial = {
            ...buildInitialExpansionState(),
            loadingChildren: true,
            revalidatingChildren: true,
            visibleChildren: true,
        };

        const next = buildChildrenFailedExpansionState(initial, {
            nextError: "nostr_not_ready",
        });

        expect(next).toMatchObject({
            loadingChildren: false,
            revalidatingChildren: false,
            visibleChildren: true,
            childrenError: "nostr_not_ready",
        });
    });
});
