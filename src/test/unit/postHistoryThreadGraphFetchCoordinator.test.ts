import { describe, expect, it, vi } from "vitest";
import {
    coordinateThreadGraphCachedRevalidateFlow,
    coordinateThreadGraphNodeLoadExecution,
    coordinateThreadGraphRevalidateExecution,
    coordinateThreadGraphRevalidateTemplate,
    coordinateThreadGraphStatusStrategy,
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

    it("template は inactive 時に onInactive を一度だけ呼び cleanup する", async () => {
        const onInactive = vi.fn();
        const cleanup = vi.fn();
        const run = vi.fn(async (context: { ensureActive: () => boolean }) => {
            context.ensureActive();
            context.ensureActive();
        });

        await coordinateThreadGraphRevalidateTemplate({
            isActive: () => false,
            onInactive,
            cleanup,
            run,
        });

        expect(run).toHaveBeenCalledTimes(1);
        expect(onInactive).toHaveBeenCalledTimes(1);
        expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it("template は active 状態で例外発生時に onError を呼ぶ", async () => {
        const onError = vi.fn();
        const cleanup = vi.fn();

        await coordinateThreadGraphRevalidateTemplate({
            isActive: () => true,
            onError,
            cleanup,
            run: async () => {
                throw new Error("boom");
            },
        });

        expect(onError).toHaveBeenCalledTimes(1);
        expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it("node load は in-flight のとき loaded/fresh 実行へ進まない", async () => {
        const onInFlight = vi.fn();
        const handleLoadedState = vi.fn(async () => true);
        const prepareFreshLoadState = vi.fn();
        const displayCachedForFreshLoad = vi.fn(async () => ({
            displayedCached: false,
            lastFetchedAt: null,
        }));
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => undefined,
        );

        await coordinateThreadGraphNodeLoadExecution({
            loading: true,
            revalidating: false,
            onInFlight,
            shouldHandleLoadedState: true,
            handleLoadedState,
            prepareFreshLoadState,
            displayCachedForFreshLoad,
            force: false,
            ttlMs: 1_000,
            awaitWhenInitialLoading: false,
            runRevalidate,
        });

        expect(onInFlight).toHaveBeenCalledTimes(1);
        expect(handleLoadedState).not.toHaveBeenCalled();
        expect(prepareFreshLoadState).not.toHaveBeenCalled();
        expect(displayCachedForFreshLoad).not.toHaveBeenCalled();
        expect(runRevalidate).not.toHaveBeenCalled();
    });

    it("node load は loaded state が handled なら fresh load へ進まない", async () => {
        const handleLoadedState = vi.fn(async () => true);
        const prepareFreshLoadState = vi.fn();
        const displayCachedForFreshLoad = vi.fn(async () => ({
            displayedCached: false,
            lastFetchedAt: null,
        }));
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => undefined,
        );

        await coordinateThreadGraphNodeLoadExecution({
            loading: false,
            revalidating: false,
            onInFlight: () => undefined,
            shouldHandleLoadedState: true,
            handleLoadedState,
            prepareFreshLoadState,
            displayCachedForFreshLoad,
            force: false,
            ttlMs: 1_000,
            awaitWhenInitialLoading: false,
            runRevalidate,
        });

        expect(handleLoadedState).toHaveBeenCalledTimes(1);
        expect(prepareFreshLoadState).not.toHaveBeenCalled();
        expect(displayCachedForFreshLoad).not.toHaveBeenCalled();
        expect(runRevalidate).not.toHaveBeenCalled();
    });

    it("node load は fresh cache skip 時に prefetch callback を呼ぶ", async () => {
        const onSkipPrefetchReplyCounts = vi.fn();
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => undefined,
        );

        await coordinateThreadGraphNodeLoadExecution({
            loading: false,
            revalidating: false,
            onInFlight: () => undefined,
            shouldHandleLoadedState: false,
            handleLoadedState: async () => false,
            prepareFreshLoadState: () => undefined,
            displayCachedForFreshLoad: async () => ({
                displayedCached: true,
                lastFetchedAt: 9_500,
            }),
            force: false,
            ttlMs: 1_000,
            prefetchOnly: false,
            now: 10_000,
            awaitWhenInitialLoading: false,
            onSkipPrefetchReplyCounts,
            runRevalidate,
        });

        expect(onSkipPrefetchReplyCounts).toHaveBeenCalledTimes(1);
        expect(runRevalidate).not.toHaveBeenCalled();
    });

    it("node load は fresh cache miss で initial loading 再検証を起動する", async () => {
        const runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void> = vi.fn(
            async () => undefined,
        );

        await coordinateThreadGraphNodeLoadExecution({
            loading: false,
            revalidating: false,
            onInFlight: () => undefined,
            shouldHandleLoadedState: false,
            handleLoadedState: async () => false,
            prepareFreshLoadState: () => undefined,
            displayCachedForFreshLoad: async () => ({
                displayedCached: false,
                lastFetchedAt: null,
            }),
            force: false,
            ttlMs: 1_000,
            awaitWhenInitialLoading: false,
            runRevalidate,
        });

        expect(runRevalidate).toHaveBeenCalledWith({ showInitialLoading: true });
    });

    it("status strategy は一致したハンドラを実行する", async () => {
        const onResolved = vi.fn(async () => undefined);
        const onFallback = vi.fn(async () => undefined);

        await coordinateThreadGraphStatusStrategy<"resolved" | "deleted" | "not-found">({
            status: "resolved",
            strategies: {
                resolved: onResolved,
                deleted: vi.fn(async () => undefined),
            },
            fallback: onFallback,
        });

        expect(onResolved).toHaveBeenCalledTimes(1);
        expect(onFallback).not.toHaveBeenCalled();
    });

    it("status strategy は一致しない場合に fallback を実行する", async () => {
        const onFallback = vi.fn(async () => undefined);

        await coordinateThreadGraphStatusStrategy<"resolved" | "deleted" | "not-found">({
            status: "not-found",
            strategies: {
                resolved: vi.fn(async () => undefined),
            },
            fallback: onFallback,
        });

        expect(onFallback).toHaveBeenCalledTimes(1);
    });

    it("status strategy は一致と fallback が無い場合は no-op", async () => {
        await coordinateThreadGraphStatusStrategy<"resolved" | "deleted" | "not-found">({
            status: "deleted",
            strategies: {
                resolved: vi.fn(async () => undefined),
            },
        });
    });
});
