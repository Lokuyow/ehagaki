import type { PendingNip46AuthSession } from './authService';

export class PendingNip46OperationTracker {
    private requestGeneration = 0;
    private pendingSession: PendingNip46AuthSession | null = null;

    get hasPendingSession(): boolean {
        return this.pendingSession !== null;
    }

    get currentSession(): PendingNip46AuthSession | null {
        return this.pendingSession;
    }

    beginOperation(): {
        requestGeneration: number;
        previousSession: PendingNip46AuthSession | null;
    } {
        this.requestGeneration += 1;
        const previousSession = this.pendingSession;
        this.pendingSession = null;

        return {
            requestGeneration: this.requestGeneration,
            previousSession,
        };
    }

    cancelPending(
        session: PendingNip46AuthSession | null = this.pendingSession,
    ): PendingNip46AuthSession | null {
        this.requestGeneration += 1;
        this.pendingSession = null;
        return session;
    }

    attachPendingSession(session: PendingNip46AuthSession): void {
        this.pendingSession = session;
    }

    clearPendingSession(): void {
        this.pendingSession = null;
    }

    isCurrentOperation(requestGeneration: number): boolean {
        return this.requestGeneration === requestGeneration;
    }
}