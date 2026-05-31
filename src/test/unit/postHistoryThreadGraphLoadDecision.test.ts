import { describe, expect, it } from "vitest";
import {
    isThreadGraphRevalidateStale,
    shouldSkipRevalidateAfterDisplayingCache,
} from "../../lib/postHistoryThreadGraphLoadDecision";

describe("postHistoryThreadGraphLoadDecision", () => {
    it("lastFetchedAt が無ければ stale 扱い", () => {
        expect(isThreadGraphRevalidateStale({
            lastFetchedAt: null,
            ttlMs: 1_000,
            now: 10_000,
        })).toBe(true);
    });

    it("ttl 未満なら stale ではない", () => {
        expect(isThreadGraphRevalidateStale({
            lastFetchedAt: 9_500,
            ttlMs: 1_000,
            now: 10_000,
        })).toBe(false);
    });

    it("ttl 以上なら stale", () => {
        expect(isThreadGraphRevalidateStale({
            lastFetchedAt: 9_000,
            ttlMs: 1_000,
            now: 10_000,
        })).toBe(true);
    });

    it("cached 表示済み・force なし・fresh のとき再検証を skip する", () => {
        expect(shouldSkipRevalidateAfterDisplayingCache({
            displayedCached: true,
            force: false,
            lastFetchedAt: 9_500,
            ttlMs: 1_000,
            now: 10_000,
        })).toBe(true);
    });

    it("force あり、または stale のとき再検証 skip しない", () => {
        expect(shouldSkipRevalidateAfterDisplayingCache({
            displayedCached: true,
            force: true,
            lastFetchedAt: 9_500,
            ttlMs: 1_000,
            now: 10_000,
        })).toBe(false);

        expect(shouldSkipRevalidateAfterDisplayingCache({
            displayedCached: true,
            force: false,
            lastFetchedAt: 8_000,
            ttlMs: 1_000,
            now: 10_000,
        })).toBe(false);
    });
});
