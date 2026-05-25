import { describe, expect, it, vi } from 'vitest';
import type { PendingNip46AuthSession } from '../../lib/authService';
import { PendingNip46OperationTracker } from '../../lib/nip46PendingOperationUtils';

function createPendingSession(
    connectionUri: string,
): PendingNip46AuthSession {
    const rawSession = {
        connectionUri,
        ready: Promise.resolve(),
        handshakeStarted: Promise.resolve(),
        completion: Promise.resolve({ success: true, pubkeyHex: 'ab'.repeat(32) }),
        cancel: vi.fn().mockResolvedValue(undefined),
    } satisfies PendingNip46AuthSession;

    return new Proxy(rawSession, {});
}

describe('PendingNip46OperationTracker', () => {
    it('current generation の pending handle は proxy identity に依存せず URI 公開条件を満たせる', () => {
        const tracker = new PendingNip46OperationTracker();
        const session = createPendingSession(
            'nostrconnect://client?relay=wss%3A%2F%2Frelay.ready.example.com%2F',
        );
        const { requestGeneration } = tracker.beginOperation();
        tracker.attachPendingSession(session);

        let publishedUri: string | null = null;
        if (tracker.isCurrentOperation(requestGeneration)) {
            publishedUri = session.connectionUri;
        }

        expect(tracker.hasPendingSession).toBe(true);
        expect(publishedUri).toBe(session.connectionUri);
    });

    it('generation が変わった古い ready は現在の URI を上書きしない', () => {
        const tracker = new PendingNip46OperationTracker();
        const firstSession = createPendingSession(
            'nostrconnect://client?relay=wss%3A%2F%2Fold.ready.example.com%2F',
        );
        const firstOperation = tracker.beginOperation();
        tracker.attachPendingSession(firstSession);

        const secondSession = createPendingSession(
            'nostrconnect://client?relay=wss%3A%2F%2Fcurrent.ready.example.com%2F',
        );
        const secondOperation = tracker.beginOperation();
        tracker.attachPendingSession(secondSession);

        let publishedUri: string | null = null;
        if (tracker.isCurrentOperation(secondOperation.requestGeneration)) {
            publishedUri = secondSession.connectionUri;
        }
        if (tracker.isCurrentOperation(firstOperation.requestGeneration)) {
            publishedUri = firstSession.connectionUri;
        }

        expect(publishedUri).toBe(secondSession.connectionUri);
    });

    it('generation が変わった古い failure は現在の error state を上書きしない', () => {
        const tracker = new PendingNip46OperationTracker();
        const firstOperation = tracker.beginOperation();
        tracker.attachPendingSession(createPendingSession('nostrconnect://first'));

        const secondOperation = tracker.beginOperation();
        tracker.attachPendingSession(createPendingSession('nostrconnect://second'));

        let errorMessage = '';
        if (tracker.isCurrentOperation(firstOperation.requestGeneration)) {
            errorMessage = 'stale failure';
        }
        if (tracker.isCurrentOperation(secondOperation.requestGeneration)) {
            errorMessage = '';
        }

        expect(errorMessage).toBe('');
    });

    it('cancel 後に古い ready を無視し、再試行の generation だけ current になる', () => {
        const tracker = new PendingNip46OperationTracker();
        const firstSession = createPendingSession('nostrconnect://first');
        const firstOperation = tracker.beginOperation();
        tracker.attachPendingSession(firstSession);

        expect(tracker.cancelPending()).toBe(firstSession);
        expect(tracker.hasPendingSession).toBe(false);
        expect(tracker.isCurrentOperation(firstOperation.requestGeneration)).toBe(false);

        const retrySession = createPendingSession('nostrconnect://retry');
        const retryOperation = tracker.beginOperation();
        tracker.attachPendingSession(retrySession);

        let publishedUri: string | null = null;
        if (tracker.isCurrentOperation(firstOperation.requestGeneration)) {
            publishedUri = firstSession.connectionUri;
        }
        if (tracker.isCurrentOperation(retryOperation.requestGeneration)) {
            publishedUri = retrySession.connectionUri;
        }

        expect(publishedUri).toBe('nostrconnect://retry');
    });

    it('beginOperation は previous session を返しつつ新しい generation を発行する', () => {
        const tracker = new PendingNip46OperationTracker();
        const firstSession = createPendingSession('nostrconnect://first');

        const firstOperation = tracker.beginOperation();
        tracker.attachPendingSession(firstSession);
        const secondOperation = tracker.beginOperation();

        expect(firstOperation.previousSession).toBeNull();
        expect(secondOperation.previousSession).toBe(firstSession);
        expect(tracker.hasPendingSession).toBe(false);
        expect(secondOperation.requestGeneration).toBeGreaterThan(
            firstOperation.requestGeneration,
        );
    });
});