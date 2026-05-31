import { describe, expect, it, vi } from "vitest";
import {
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
});
