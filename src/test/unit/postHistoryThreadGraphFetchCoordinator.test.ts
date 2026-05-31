import { describe, expect, it, vi } from "vitest";
import {
    coordinateThreadGraphCachedRevalidateFlow,
    coordinateThreadGraphRevalidateExecution,
    handleThreadGraphInFlightLoad,
    shouldRunThreadGraphBackgroundRevalidate,
} from "../../lib/postHistoryThreadGraphFetchCoordinator";

describe("postHistoryThreadGraphFetchCoordinator", () => {
    it("in-flight でなければ false を返す", () => {
        const onInFlight = vi.fn();
        const onLoadingInFlight = vi.fn();

        const handled = handleThreadGraphInFlightLoad({
            loading: false,
            revalidating: false,
            onInFlight,
            onLoadingInFlight,
        });

        expect(handled).toBe(false);
        expect(onInFlight).not.toHaveBeenCalled();
        expect(onLoadingInFlight).not.toHaveBeenCalled();
    });

    it("loading 中なら in-flight 前処理を実行し true を返す", () => {
        const onInFlight = vi.fn();
        const onLoadingInFlight = vi.fn();

        const handled = handleThreadGraphInFlightLoad({
            loading: true,
            revalidating: false,
            onInFlight,
            onLoadingInFlight,
        });

        expect(handled).toBe(true);
        expect(onInFlight).toHaveBeenCalledTimes(1);
        expect(onLoadingInFlight).toHaveBeenCalledTimes(1);
    });

    it("revalidating 中は loading 専用フックなしで true を返す", () => {
        const onInFlight = vi.fn();
        const onLoadingInFlight = vi.fn();

        const handled = handleThreadGraphInFlightLoad({
            loading: false,
            revalidating: true,
            onInFlight,
            onLoadingInFlight,
        });

        expect(handled).toBe(true);
        expect(onInFlight).toHaveBeenCalledTimes(1);
        expect(onLoadingInFlight).not.toHaveBeenCalled();
    });

    it("visible data がなければ stale でも再検証しない", () => {
        expect(shouldRunThreadGraphBackgroundRevalidate({
            hasVisibleData: false,
            lastFetchedAt: 0,
            ttlMs: 1,
            now: 10,
        })).toBe(false);
    });

    it("visible data があり stale なら再検証する", () => {
        expect(shouldRunThreadGraphBackgroundRevalidate({
            hasVisibleData: true,
            lastFetchedAt: 0,
            ttlMs: 1,
            now: 10,
        })).toBe(true);
    });

    it("skipRevalidate のとき revalidate を起動しない", async () => {
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => undefined,
        );

        await coordinateThreadGraphRevalidateExecution({
            skipRevalidate: true,
            shouldShowInitialLoading: false,
            awaitWhenInitialLoading: true,
            runRevalidate,
        });

        expect(runRevalidate).not.toHaveBeenCalled();
    });

    it("初回ロード表示時は awaitWhenInitialLoading=true なら await する", async () => {
        let resolved = false;
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => {
                await Promise.resolve();
                resolved = true;
            },
        );

        await coordinateThreadGraphRevalidateExecution({
            skipRevalidate: false,
            shouldShowInitialLoading: true,
            awaitWhenInitialLoading: true,
            runRevalidate,
        });

        expect(runRevalidate).toHaveBeenCalledWith({ showInitialLoading: true });
        expect(resolved).toBe(true);
    });

    it("awaitWhenInitialLoading=false なら Promise を待たずに返る", async () => {
        let resolved = false;
        let resolveRevalidate: () => void = () => undefined;
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            () => new Promise<void>((resolve) => {
                resolveRevalidate = () => {
                    resolved = true;
                    resolve();
                };
            }),
        );

        await coordinateThreadGraphRevalidateExecution({
            skipRevalidate: false,
            shouldShowInitialLoading: true,
            awaitWhenInitialLoading: false,
            runRevalidate,
        });
        expect(runRevalidate).toHaveBeenCalledWith({ showInitialLoading: true });
        expect(resolved).toBe(false);
        resolveRevalidate();
        await Promise.resolve();
        expect(resolved).toBe(true);
    });

    it("cached が fresh なら skip し prefetch callback を呼ぶ", async () => {
        const onSkipPrefetchReplyCounts = vi.fn();
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => undefined,
        );

        const decision = await coordinateThreadGraphCachedRevalidateFlow({
            displayedCached: true,
            force: false,
            lastFetchedAt: 9_500,
            ttlMs: 1_000,
            prefetchOnly: false,
            now: 10_000,
            awaitWhenInitialLoading: false,
            onSkipPrefetchReplyCounts,
            runRevalidate,
        });

        expect(decision).toEqual({
            skipRevalidate: true,
            shouldShowInitialLoading: false,
            shouldPrefetchReplyCountsOnSkip: true,
        });
        expect(onSkipPrefetchReplyCounts).toHaveBeenCalledTimes(1);
        expect(runRevalidate).not.toHaveBeenCalled();
    });

    it("cached が無いときは showInitialLoading=true で再検証を起動する", async () => {
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => undefined,
        );

        const decision = await coordinateThreadGraphCachedRevalidateFlow({
            displayedCached: false,
            force: false,
            lastFetchedAt: null,
            ttlMs: 1_000,
            awaitWhenInitialLoading: false,
            runRevalidate,
        });

        expect(decision).toEqual({
            skipRevalidate: false,
            shouldShowInitialLoading: true,
            shouldPrefetchReplyCountsOnSkip: false,
        });
        expect(runRevalidate).toHaveBeenCalledWith({ showInitialLoading: true });
    });
});
