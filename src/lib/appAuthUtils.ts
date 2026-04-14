import type { RestoreResult } from './authRestoreUtils';
import type { AuthResult } from './types';

type DisposableSession = {
    dispose: () => void;
};

type ManagedAccountType = 'nsec' | 'nip07' | 'nip46';

interface ManagedAccountController {
    setActiveAccount: (pubkeyHex: string) => void;
    getAccountType: (pubkeyHex: string) => ManagedAccountType | null;
}

export function disposeNostrSession<T extends DisposableSession | undefined>(
    session: T,
): undefined {
    session?.dispose();
    return undefined;
}

export async function handleSuccessfulAuthResult(
    result: AuthResult,
    onAuthenticated: (pubkeyHex: string) => Promise<void>,
): Promise<boolean> {
    if (!result.success || !result.pubkeyHex) {
        return false;
    }

    await onAuthenticated(result.pubkeyHex);
    return true;
}

export function resolveLogoutAccountAction(nextPubkey: string | null | undefined):
    | { kind: 'switch'; pubkeyHex: string }
    | { kind: 'guest' }
    | { kind: 'keep-current' } {
    if (typeof nextPubkey === 'string') {
        return { kind: 'switch', pubkeyHex: nextPubkey };
    }

    if (nextPubkey === null) {
        return { kind: 'guest' };
    }

    return { kind: 'keep-current' };
}

export async function restoreManagedAccountSession(params: {
    pubkeyHex: string;
    accountManager: ManagedAccountController;
    restoreAccount: (
        pubkeyHex: string,
        type: ManagedAccountType,
    ) => Promise<RestoreResult>;
    handlePostAuth: (pubkeyHex: string) => Promise<void>;
    onMissingAccountType?: () => void;
    onRestoreFailure?: () => void;
}): Promise<boolean> {
    params.accountManager.setActiveAccount(params.pubkeyHex);
    const accountType = params.accountManager.getAccountType(params.pubkeyHex);

    if (!accountType) {
        params.onMissingAccountType?.();
        return false;
    }

    const result = await params.restoreAccount(params.pubkeyHex, accountType);
    if (result.hasAuth && result.pubkeyHex) {
        await params.handlePostAuth(result.pubkeyHex);
        return true;
    }

    params.onRestoreFailure?.();
    return false;
}