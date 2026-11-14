import { describe, expect, it, vi } from 'vitest';
import {
    POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS,
    POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE,
    resolveNextOlderBackfillWindowIndex,
    resolveOlderBackfillAttemptProgress,
    resolveOlderBackfillContinuation,
    resolveOlderBackfillCoverageProgress,
    resolveOlderBackfillEffectiveFetchUntil,
    resolveOlderBackfillWindowSeconds,
} from '../../lib/postHistoryListingOlderBackfill';
import type { PostHistoryRelayFetchResult } from '../../lib/postHistoryRelayFetchService';

const LIMIT = 100;

function createFetchResult(
    overrides: Partial<PostHistoryRelayFetchResult> = {},
): PostHistoryRelayFetchResult {
    return {
        status: 'success',
        events: [],
        hasMore: false,
        rawCount: 0,
        perRelayCounts: [],
        oldestCreatedAt: null,
        ...overrides,
    } as PostHistoryRelayFetchResult;
}

describe('resolveOlderBackfillEffectiveFetchUntil', () => {
    it('連続表示では確定済みの下限から取得する', () => {
        expect(resolveOlderBackfillEffectiveFetchUntil({
            previousVisibleUntil: 1_000,
            resolvedFetchUntil: 400,
            usingBatchCursor: false,
            isSparseListing: () => false,
        })).toBe(1_000);
    });

    it('疎表示では解決済みカーソルと下限の古い方を使う', () => {
        expect(resolveOlderBackfillEffectiveFetchUntil({
            previousVisibleUntil: 1_000,
            resolvedFetchUntil: 400,
            usingBatchCursor: false,
            isSparseListing: () => true,
        })).toBe(400);
        expect(resolveOlderBackfillEffectiveFetchUntil({
            previousVisibleUntil: 300,
            resolvedFetchUntil: 400,
            usingBatchCursor: false,
            isSparseListing: () => true,
        })).toBe(300);
    });

    it('疎表示でバッチカーソルを使っているときは下限で切り詰めない', () => {
        expect(resolveOlderBackfillEffectiveFetchUntil({
            previousVisibleUntil: 300,
            resolvedFetchUntil: 400,
            usingBatchCursor: true,
            isSparseListing: () => true,
        })).toBe(400);
    });

    it('下限が未確定なら疎表示判定を呼ばずに解決済みカーソルを使う', () => {
        const isSparseListing = vi.fn(() => true);

        expect(resolveOlderBackfillEffectiveFetchUntil({
            previousVisibleUntil: null,
            resolvedFetchUntil: 400,
            usingBatchCursor: false,
            isSparseListing,
        })).toBe(400);
        expect(isSparseListing).not.toHaveBeenCalled();
    });

    it('どちらも未確定なら null を返す', () => {
        expect(resolveOlderBackfillEffectiveFetchUntil({
            previousVisibleUntil: null,
            resolvedFetchUntil: null,
            usingBatchCursor: false,
            isSparseListing: () => false,
        })).toBeNull();
    });
});

describe('older backfill の探索窓', () => {
    it('窓の列を順に進み、末尾で止まる', () => {
        const lastIndex = POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE.length - 1;

        expect(resolveOlderBackfillWindowSeconds(0))
            .toBe(POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE[0]);
        expect(resolveOlderBackfillWindowSeconds(lastIndex + 5))
            .toBe(POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE[lastIndex]);
        expect(resolveNextOlderBackfillWindowIndex(0)).toBe(1);
        expect(resolveNextOlderBackfillWindowIndex(lastIndex)).toBe(lastIndex);
    });
});

describe('resolveOlderBackfillContinuation', () => {
    const since = 10_000;

    it('上限に達していなければ窓の下端へカーソルを進める', () => {
        expect(resolveOlderBackfillContinuation(
            createFetchResult({ oldestCreatedAt: since + 5_000 }),
            { since },
            LIMIT,
        )).toEqual({
            hitLimit: false,
            canContinueWithinWindow: false,
            nextUntilCursor: since,
            nextContinuationSince: null,
        });
    });

    it('上限に達して窓に十分な残りがあれば同じ窓の中で続ける', () => {
        const oldestCreatedAt =
            since + POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS;

        expect(resolveOlderBackfillContinuation(
            createFetchResult({ rawCount: LIMIT, oldestCreatedAt }),
            { since },
            LIMIT,
        )).toEqual({
            hitLimit: true,
            canContinueWithinWindow: true,
            nextUntilCursor: oldestCreatedAt,
            nextContinuationSince: since,
        });
    });

    it('上限に達しても残りが閾値未満なら窓の下端へ進める', () => {
        const continuation = resolveOlderBackfillContinuation(
            createFetchResult({
                hasMore: true,
                oldestCreatedAt:
                    since + POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS - 1,
            }),
            { since },
            LIMIT,
        );

        expect(continuation.hitLimit).toBe(true);
        expect(continuation.canContinueWithinWindow).toBe(false);
        expect(continuation.nextUntilCursor).toBe(since);
        expect(continuation.nextContinuationSince).toBeNull();
    });

    it('失敗した取得は同じ窓の中で続けない', () => {
        const continuation = resolveOlderBackfillContinuation(
            createFetchResult({
                status: 'timeout',
                rawCount: LIMIT,
                oldestCreatedAt:
                    since + POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS,
            }),
            { since },
            LIMIT,
        );

        expect(continuation.canContinueWithinWindow).toBe(false);
        expect(continuation.nextUntilCursor).toBe(since);
    });

    it('窓の下端が 0 ならカーソルを終端にする', () => {
        expect(resolveOlderBackfillContinuation(
            createFetchResult(),
            { since: 0 },
            LIMIT,
        ).nextUntilCursor).toBeNull();
    });
});

describe('resolveOlderBackfillAttemptProgress', () => {
    it('カーソルが古い側へ進んだ秒数を探索済みに加える', () => {
        expect(resolveOlderBackfillAttemptProgress({
            nextUntilCursor: 700,
            effectiveFetchUntil: 1_000,
            currentVisibleCount: 12,
            clickStartVisibleCount: 10,
            exploredSeconds: 50,
        })).toEqual({
            didCursorAdvanceOlder: true,
            totalVisibleAdded: 2,
            nextExploredSeconds: 350,
        });
    });

    it('カーソルが終端なら残り全体を探索済みとして扱う', () => {
        expect(resolveOlderBackfillAttemptProgress({
            nextUntilCursor: null,
            effectiveFetchUntil: 1_000,
            currentVisibleCount: 5,
            clickStartVisibleCount: null,
            exploredSeconds: 0,
        })).toEqual({
            didCursorAdvanceOlder: false,
            totalVisibleAdded: 0,
            nextExploredSeconds: 1_000,
        });
    });

    it('カーソルが進まず表示数が減っても負の値にしない', () => {
        expect(resolveOlderBackfillAttemptProgress({
            nextUntilCursor: 1_200,
            effectiveFetchUntil: 1_000,
            currentVisibleCount: 8,
            clickStartVisibleCount: 10,
            exploredSeconds: 30,
        })).toEqual({
            didCursorAdvanceOlder: false,
            totalVisibleAdded: 0,
            nextExploredSeconds: 30,
        });
    });
});

describe('resolveOlderBackfillCoverageProgress', () => {
    it('下限が古い側へ動いたら coverageAdvanced になる', () => {
        expect(resolveOlderBackfillCoverageProgress({
            nextExternalFloor: 800,
            previousVisibleUntil: 1_000,
            rangesBeforeFetch: [{ since: 1_000, until: 2_000 }],
        })).toEqual({ connectedSavedRange: false, coverageAdvanced: true });
    });

    it('下限が以前から保存済みの範囲に届いたら connectedSavedRange になる', () => {
        expect(resolveOlderBackfillCoverageProgress({
            nextExternalFloor: 400,
            previousVisibleUntil: 1_000,
            rangesBeforeFetch: [
                { since: 1_000, until: 2_000 },
                { since: 400, until: 700 },
            ],
        })).toEqual({ connectedSavedRange: true, coverageAdvanced: true });
    });

    it('下限が未確定ならどちらも false になる', () => {
        expect(resolveOlderBackfillCoverageProgress({
            nextExternalFloor: null,
            previousVisibleUntil: 1_000,
            rangesBeforeFetch: [{ since: 400, until: 700 }],
        })).toEqual({ connectedSavedRange: false, coverageAdvanced: false });
        expect(resolveOlderBackfillCoverageProgress({
            nextExternalFloor: 400,
            previousVisibleUntil: null,
            rangesBeforeFetch: [{ since: 400, until: 700 }],
        })).toEqual({ connectedSavedRange: false, coverageAdvanced: false });
    });
});
