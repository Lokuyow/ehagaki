import { describe, expect, it, vi } from "vitest";
import {
    coordinateThreadGraphRevalidateExecution,
    shouldRunThreadGraphBackgroundRevalidate,
} from "../../lib/postHistoryThreadGraphFetchCoordinator";

describe("postHistoryThreadGraphFetchCoordinator", () => {
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
});
