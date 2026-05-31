import type { RestoreResult } from './authRestoreUtils';
import type { AuthResult } from './types';

type DisposableSession = {
    dispose: () => void;
};

type ManagedAccountType = 'nsec' | 'nip07' | 'nip46' | 'parentClient';

interface ManagedAccountController {
    setActiveAccount: (pubkeyHex: string) => void;
    getAccountType: (pubkeyHex: string) => ManagedAccountType | null;
}

interface Nip46RuntimeController {
    disconnect: () => Promise<void>;
}

export interface Nip07LoginDependencies {
    currentAuthType?: string;
    currentPubkeyHex?: string | null;
    authenticateWithNip07: () => Promise<AuthResult>;
    cancelPendingNip46Auth: () => Promise<void>;
    clearNip46RuntimeForAuthChange: (params: {
        currentAuthType?: string;
        currentPubkeyHex?: string | null;
        nextAuthType: ManagedAccountType;
        nextPubkeyHex?: string | null;
        nip46Service: Nip46RuntimeController;
    }) => Promise<void>;
    handlePostAuth: (pubkeyHex: string) => Promise<void>;
    setLoading: (isLoading: boolean) => void;
    nip46Service: Nip46RuntimeController;
    console: Pick<Console, 'error'>;
}

export interface Nip46LoginDependencies {
    authenticateWithNip46: (bunkerUrl: string) => Promise<AuthResult>;
    handlePostAuth: (pubkeyHex: string) => Promise<void>;
    setLoading: (isLoading: boolean) => void;
    console: Pick<Console, 'error'>;
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

export async function clearNip46RuntimeForAuthChange(params: {
    currentAuthType?: string;
    currentPubkeyHex?: string | null;
    nextAuthType: ManagedAccountType;
    nextPubkeyHex?: string | null;
    nip46Service: Nip46RuntimeController;
}): Promise<void> {
    if (params.currentAuthType !== 'nip46') {
        return;
    }

    if (
        params.nextAuthType === 'nip46'
        && params.currentPubkeyHex
        && params.currentPubkeyHex === params.nextPubkeyHex
    ) {
        return;
    }

    await params.nip46Service.disconnect();
}

export async function runNip07Login(
    deps: Nip07LoginDependencies,
): Promise<string | undefined> {
    try {
        await deps.cancelPendingNip46Auth();
        deps.setLoading(true);

        const result = await deps.authenticateWithNip07();
        if (!result.success) {
            deps.console.error('NIP-07認証失敗:', result.error);
            return result.error ?? 'nip07_auth_error';
        }

        await deps.clearNip46RuntimeForAuthChange({
            currentAuthType: deps.currentAuthType,
            currentPubkeyHex: deps.currentPubkeyHex,
            nextAuthType: 'nip07',
            nextPubkeyHex: result.pubkeyHex,
            nip46Service: deps.nip46Service,
        });
        await handleSuccessfulAuthResult(result, deps.handlePostAuth);
        return undefined;
    } catch (error) {
        deps.console.error('NIP-07ログインでエラー:', error);
        return error instanceof Error ? error.message : 'nip07_auth_error';
    } finally {
        deps.setLoading(false);
    }
}

export async function runNip46Login(
    deps: Nip46LoginDependencies,
    bunkerUrl: string,
): Promise<string | undefined> {
    deps.setLoading(true);

    try {
        const result = await deps.authenticateWithNip46(bunkerUrl);
        if (!result.success) {
            deps.console.error('NIP-46認証失敗:', result.error);
            return result.error ?? 'NIP-46 authentication failed';
        }

        await handleSuccessfulAuthResult(result, deps.handlePostAuth);
        return undefined;
    } catch (error) {
        deps.console.error('NIP-46ログインでエラー:', error);
        return error instanceof Error ? error.message : 'NIP-46 login failed';
    } finally {
        deps.setLoading(false);
    }
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