import type { RestoreResult } from './authRestoreUtils';

export async function restoreManagedSessionAccount<TSession>({
    pubkeyHex,
    loadSession,
    reconnect,
    applyAuth,
    onError,
}: {
    pubkeyHex: string;
    loadSession: (pubkeyHex: string) => TSession | null;
    reconnect: (session: TSession) => Promise<unknown>;
    applyAuth: (pubkeyHex: string) => RestoreResult;
    onError: (error: unknown) => void;
}): Promise<RestoreResult> {
    const session = loadSession(pubkeyHex);
    if (!session) {
        return { hasAuth: false };
    }

    try {
        await reconnect(session);
        return applyAuth(pubkeyHex);
    } catch (error) {
        onError(error);
        return { hasAuth: false };
    }
}