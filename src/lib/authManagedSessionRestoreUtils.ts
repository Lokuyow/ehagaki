import type {
    ManagedRestoreFailureReason,
    ManagedRestoreResult,
} from './authRestoreUtils';

export async function restoreManagedSessionAccount<TSession>({
    pubkeyHex,
    loadSession,
    validateStoredIdentity,
    reconnect,
    isExpectedAccount,
    finalize,
    cleanupRuntime,
    onError,
}: {
    pubkeyHex: string;
    loadSession: (pubkeyHex: string) => TSession | null;
    validateStoredIdentity: (session: TSession, pubkeyHex: string) => boolean;
    reconnect: (session: TSession) => Promise<string>;
    isExpectedAccount: () => boolean;
    finalize: (pubkeyHex: string) => Promise<ManagedRestoreResult> | ManagedRestoreResult;
    cleanupRuntime: () => Promise<void> | void;
    onError: (reason: ManagedRestoreFailureReason) => void;
}): Promise<ManagedRestoreResult> {
    const session = loadSession(pubkeyHex);
    if (!session) {
        return { hasAuth: false, reason: 'session-unavailable' };
    }

    if (!validateStoredIdentity(session, pubkeyHex)) {
        return { hasAuth: false, reason: 'identity-mismatch' };
    }

    let cleanupStarted = false;
    const cleanupOnce = async (): Promise<void> => {
        if (cleanupStarted) return;
        cleanupStarted = true;
        try {
            await cleanupRuntime();
        } catch {
            // The caller's transaction cleanup remains the final safety net.
        }
    };

    try {
        const reconnectedPubkey = await reconnect(session);
        if (reconnectedPubkey !== pubkeyHex) {
            await cleanupOnce();
            return { hasAuth: false, reason: 'identity-mismatch' };
        }

        if (!isExpectedAccount()) {
            await cleanupOnce();
            return { hasAuth: false, reason: 'account-record-mismatch' };
        }

        const result = await finalize(reconnectedPubkey);
        if (!result.hasAuth) {
            await cleanupOnce();
            return result;
        }

        return { hasAuth: true, pubkeyHex };
    } catch {
        const reason: ManagedRestoreFailureReason = 'reconnect-failed';
        onError(reason);
        await cleanupOnce();
        return { hasAuth: false, reason };
    }
}
