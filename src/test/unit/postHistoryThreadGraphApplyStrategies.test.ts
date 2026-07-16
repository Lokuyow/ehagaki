import { describe, expect, it, vi } from "vitest";
import {
    applyChildrenRevalidateErrorState,
    applyParentRevalidateErrorState,
    createChildrenRevalidateStatusStrategies,
    createParentRevalidateStatusStrategies,
    resolveChildrenRevalidateStatus,
    resolveParentRevalidateStatus,
} from "../../lib/postHistoryThreadGraphApplyStrategies";
import { buildInitialExpansionState } from "../../lib/postHistoryThreadGraphUtils";

describe("postHistoryThreadGraphApplyStrategies", () => {
    it("parent status 判定を snapshot に応じて返す", () => {
        expect(resolveParentRevalidateStatus({ status: "deleted" } as any)).toBe("deleted");
        expect(resolveParentRevalidateStatus({ status: "not-found" } as any)).toBe("not-found");
        expect(resolveParentRevalidateStatus({ status: "resolved", event: { id: "e1" } } as any)).toBe("resolved");
        expect(resolveParentRevalidateStatus({ status: "error", event: null } as any)).toBe("failed");
    });

    it("children status 判定を records/events 件数に応じて返す", () => {
        expect(resolveChildrenRevalidateStatus({ nextRecordsLength: 1, resultEventsLength: 0 })).toBe("resolved");
        expect(resolveChildrenRevalidateStatus({ nextRecordsLength: 0, resultEventsLength: 1 })).toBe("deleted");
        expect(resolveChildrenRevalidateStatus({ nextRecordsLength: 0, resultEventsLength: 0 })).toBe("not-found");
    });

    it("parent deleted strategy は hide/mark/set を実行する", () => {
        let state = buildInitialExpansionState();
        const hideEvent = vi.fn();
        const markParentDeletedForEvent = vi.fn();
        const setParentDeleted = vi.fn();

        const snapshot = {
            status: "deleted",
            authorPubkey: "pubkey",
            updatedAt: 100,
        } as any;
        const strategies = createParentRevalidateStatusStrategies({
            snapshot,
            parentEventId: "parent",
            showInitialLoading: true,
            updateExpansion: (updater) => {
                state = updater(state);
            },
            hideEvent,
            markParentDeletedForEvent,
            setParentDeleted,
            isDeletedEvent: () => false,
            upsertNode: () => ({ eventId: "e", parentEventId: null } as any),
            upsertParentEdge: () => undefined,
        });

        strategies.deleted?.();
        expect(hideEvent).toHaveBeenCalledWith("pubkey", "parent");
        expect(markParentDeletedForEvent).toHaveBeenCalledWith("parent", "pubkey", { revealKnownParent: true });
        expect(setParentDeleted).toHaveBeenCalledTimes(1);
        expect(state.loadedParent).toBe(false);
    });

    it("parent not-found strategy は parentMissing を反映する", () => {
        let state = buildInitialExpansionState();
        state.parentMissing = false;

        const strategies = createParentRevalidateStatusStrategies({
            snapshot: {
                status: "not-found",
                updatedAt: 123,
            } as any,
            parentEventId: "parent",
            showInitialLoading: true,
            updateExpansion: (updater) => {
                state = updater(state);
            },
            hideEvent: () => undefined,
            markParentDeletedForEvent: () => undefined,
            setParentDeleted: () => undefined,
            isDeletedEvent: () => false,
            upsertNode: () => ({ eventId: "e", parentEventId: null } as any),
            upsertParentEdge: () => undefined,
        });

        strategies["not-found"]?.();
        expect(state.loadedParent).toBe(true);
        expect(state.parentMissing).toBe(true);
        expect(state.lastFetchedParentAt).toBe(123);
    });

    it("parent resolved strategy は node upsert と edge 更新を行う", () => {
        let state = buildInitialExpansionState();
        const upsertParentEdge = vi.fn();

        const strategies = createParentRevalidateStatusStrategies({
            snapshot: {
                status: "resolved",
                event: { id: "e1" },
                relayHints: ["wss://relay"],
                profile: null,
                authorPubkey: "pubkey",
                updatedAt: 222,
            } as any,
            parentEventId: "parent",
            showInitialLoading: false,
            updateExpansion: (updater) => {
                state = updater(state);
            },
            hideEvent: () => undefined,
            markParentDeletedForEvent: () => undefined,
            setParentDeleted: () => undefined,
            isDeletedEvent: () => false,
            upsertNode: () => ({ eventId: "e1", parentEventId: "p0" } as any),
            upsertParentEdge,
        });

        strategies.resolved?.();
        expect(upsertParentEdge).toHaveBeenCalledWith("e1", "p0");
        expect(state.loadedParent).toBe(true);
        expect(state.parentMissing).toBe(false);
        expect(state.parentDeleted).toBe(false);
        expect(state.lastFetchedParentAt).toBe(222);
    });

    it("parent resolved strategy は authorPubkey がなくても node upsert を続行する", () => {
        let state = buildInitialExpansionState();
        const upsertNode = vi.fn(() => ({ eventId: "e1", parentEventId: "p0" } as any));
        const upsertParentEdge = vi.fn();

        const strategies = createParentRevalidateStatusStrategies({
            snapshot: {
                status: "resolved",
                event: { id: "e1" },
                relayHints: [],
                profile: null,
                updatedAt: 333,
            } as any,
            parentEventId: "parent",
            showInitialLoading: false,
            updateExpansion: (updater) => {
                state = updater(state);
            },
            hideEvent: () => undefined,
            markParentDeletedForEvent: () => undefined,
            setParentDeleted: () => undefined,
            isDeletedEvent: () => false,
            upsertNode,
            upsertParentEdge,
        });

        strategies.resolved?.();
        expect(upsertNode).toHaveBeenCalledTimes(1);
        expect(upsertParentEdge).toHaveBeenCalledWith("e1", "p0");
        expect(state.loadedParent).toBe(true);
    });

    it("parent resolved strategy は event がなければ状態を変えない", () => {
        let state = buildInitialExpansionState();
        const upsertNode = vi.fn();
        const upsertParentEdge = vi.fn();

        const strategies = createParentRevalidateStatusStrategies({
            snapshot: {
                status: "resolved",
                authorPubkey: "pubkey",
                relayHints: [],
                profile: null,
                updatedAt: 444,
            } as any,
            parentEventId: "parent",
            showInitialLoading: true,
            updateExpansion: (updater) => {
                state = updater(state);
            },
            hideEvent: () => undefined,
            markParentDeletedForEvent: () => undefined,
            setParentDeleted: () => undefined,
            isDeletedEvent: () => false,
            upsertNode,
            upsertParentEdge,
        });

        strategies.resolved?.();
        expect(upsertNode).not.toHaveBeenCalled();
        expect(upsertParentEdge).not.toHaveBeenCalled();
        expect(state).toEqual(buildInitialExpansionState());
    });

    it("parent error state は errorCode あり/なしで初期読み込み時のエラーを固定する", () => {
        let state = buildInitialExpansionState();

        applyParentRevalidateErrorState({
            updateExpansion: (updater) => {
                state = updater(state);
            },
            showInitialLoading: true,
            errorCode: "network_down",
        });
        expect(state.parentError).toBe("network_down");

        applyParentRevalidateErrorState({
            updateExpansion: (updater) => {
                state = updater(state);
            },
            showInitialLoading: true,
        });
        expect(state.parentError).toBe("fetch_failed");
    });

    it("children error state は errorCode あり/なしと prefetchOnly を区別する", () => {
        let state = buildInitialExpansionState();

        applyChildrenRevalidateErrorState({
            updateExpansion: (updater) => {
                state = updater(state);
            },
            showInitialLoading: true,
            prefetchOnly: false,
            errorCode: "network_down",
        });
        expect(state.childrenError).toBe("network_down");

        applyChildrenRevalidateErrorState({
            updateExpansion: (updater) => {
                state = updater(state);
            },
            showInitialLoading: true,
            prefetchOnly: false,
        });
        expect(state.childrenError).toBe("fetch_failed");

        applyChildrenRevalidateErrorState({
            updateExpansion: (updater) => {
                state = updater(state);
            },
            showInitialLoading: true,
            prefetchOnly: true,
            errorCode: "ignored",
        });
        expect(state.childrenError).toBe("fetch_failed");
    });

    it("children loaded strategy は loaded 更新と prefetch 呼び出しを行う", () => {
        let state = buildInitialExpansionState();
        const prefetchChildReplyCounts = vi.fn();
        const strategies = createChildrenRevalidateStatusStrategies({
            fetchedAt: 444,
            prefetchOnly: false,
            updateExpansion: (updater) => {
                state = updater(state);
            },
            prefetchChildReplyCounts,
        });

        strategies.resolved?.();
        expect(state.loadedChildren).toBe(true);
        expect(state.lastFetchedChildrenAt).toBe(444);
        expect(prefetchChildReplyCounts).toHaveBeenCalledTimes(1);
    });

    it("partial相当では既存fresh timestampを更新しない", () => {
        let state: ReturnType<typeof buildInitialExpansionState> = {
            ...buildInitialExpansionState(),
            lastFetchedChildrenAt: 111,
        };
        const strategies = createChildrenRevalidateStatusStrategies({
            fetchedAt: null,
            prefetchOnly: false,
            updateExpansion: (updater) => {
                state = updater(state);
            },
            prefetchChildReplyCounts: vi.fn(),
        });

        strategies.resolved?.();
        expect(state.loadedChildren).toBe(true);
        expect(state.lastFetchedChildrenAt).toBeNull();
    });
});
