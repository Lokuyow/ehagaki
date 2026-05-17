import { describe, expect, it } from 'vitest';
import { resolveOlderBackfillAutoRetryDecision } from '../../lib/hooks/usePostHistoryListing.svelte';

describe('resolveOlderBackfillAutoRetryDecision', () => {
    it('最大探索期間に到達したら停止する', () => {
        const decision = resolveOlderBackfillAutoRetryDecision({
            status: 'success',
            changed: false,
            didCursorAdvanceOlder: true,
            hitLimit: false,
            continuedWithinWindow: false,
            attemptIndex: 3,
            maxAttempts: 4,
            totalVisibleAdded: 10,
            targetVisibleAdded: 50,
            exploredSeconds: 7 * 24 * 60 * 60,
            maxExploreSeconds: 7 * 24 * 60 * 60,
        });

        expect(decision.shouldContinue).toBe(false);
        expect(decision.reason).toBe('max-explore-seconds-reached');
    });

    it('cursor が進んでいない場合は停止する', () => {
        const decision = resolveOlderBackfillAutoRetryDecision({
            status: 'success',
            changed: true,
            didCursorAdvanceOlder: false,
            hitLimit: false,
            continuedWithinWindow: false,
            attemptIndex: 2,
            maxAttempts: 4,
            totalVisibleAdded: 10,
            targetVisibleAdded: 50,
            exploredSeconds: 100,
            maxExploreSeconds: 7 * 24 * 60 * 60,
        });

        expect(decision.shouldContinue).toBe(false);
        expect(decision.reason).toBe('cursor-not-advanced');
    });

    it('target に到達していなければ changed=true でも継続する', () => {
        const decision = resolveOlderBackfillAutoRetryDecision({
            status: 'success',
            changed: true,
            didCursorAdvanceOlder: true,
            hitLimit: false,
            continuedWithinWindow: false,
            attemptIndex: 2,
            maxAttempts: 4,
            totalVisibleAdded: 8,
            targetVisibleAdded: 50,
            exploredSeconds: 20,
            maxExploreSeconds: 7 * 24 * 60 * 60,
        });

        expect(decision.shouldContinue).toBe(true);
        expect(decision.reason).toBe('small-batch-continue');
    });
});
