import { isPublicKeyLoginInput } from './utils/nostrUtils';
import { NosskeyError } from './nosskeyErrors';
import type { AccountAuthType, AuthResult } from './types';

export type NosskeyLoginStatus = 'idle' | 'confirming' | 'committing';

type ParentClientAuthOptions = {
    silent?: boolean;
    timeoutMs?: number;
};

interface ParentClientAuthSyncResult {
    success: boolean;
    pubkeyHex?: string;
    error?: string;
}

interface Nip46RuntimeController {
    disconnect: () => Promise<void>;
}

interface ParentClientAuthCoordinatorLike {
    synchronizeParentClientAuth(
        options?: ParentClientAuthOptions,
        isCurrent?: () => boolean,
    ): Promise<ParentClientAuthSyncResult>;
}

export interface AppAuthLoginControllerDependencies {
    parentClientAuthCoordinator: ParentClientAuthCoordinatorLike;
    beginParentClientTransition(): number;
    isAuthTransitionCurrent(generation: number): boolean;
    finishParentClientTransition(generation: number): void;
    getCurrentAuthType(): string | undefined;
    getCurrentPubkeyHex(): string | null | undefined;
    getCurrentRxNostr(): unknown;
    setCurrentRxNostr(next: undefined): void;
    clearNip46RuntimeForAuthChange(params: {
        currentAuthType?: string;
        currentPubkeyHex?: string | null;
        nextAuthType: AccountAuthType;
        nextPubkeyHex?: string | null;
        nip46Service: Nip46RuntimeController;
    }): Promise<void>;
    nip46Service: Nip46RuntimeController;
    disposeNostrSession(session: unknown): undefined;
    handlePostAuth(pubkeyHex: string, options?: { generation?: number; profileRelayHints?: string[] }): Promise<void>;
    cancelPendingNip46Auth(): Promise<void>;
    authenticateWithPublicKey(input: string): AuthResult & { profileRelayHints?: string[] };
    disconnectParentClient(): void;
    authenticateWithNsec(secretKey: string): Promise<AuthResult>;
    nosskey?: {
        beginTransition(): number;
        readPublicKey(isCurrent: () => boolean): Promise<string>;
        authenticate(pubkeyHex: string): AuthResult;
        reportError(error: unknown): void;
        setStatus(status: NosskeyLoginStatus): void;
    };
    handleSuccessfulAuthResult(
        result: AuthResult,
        onAuthenticated: (pubkeyHex: string) => Promise<void>,
    ): Promise<boolean>;
    /** Drops the typed secret key once it is no longer needed. */
    clearSecretKeyInput(): void;
    setProfileLoading(next: boolean): void;
    logger: Pick<Console, 'error'>;
}

export interface AppAuthLoginController {
    activateParentClientAuth(options?: ParentClientAuthOptions): Promise<string | undefined>;
    hasPendingParentClientTransition(): boolean;
    /** Resolves with an error code, or undefined when the login succeeded or was ignored. */
    saveSecretKey(secretKey: string, generation?: number): Promise<string | undefined>;
    handleParentClientLogin(): Promise<string | undefined>;
    handleNosskeyLogin(): Promise<void>;
    cancelNosskeyLogin(): void;
}

export function createAppAuthLoginController(
    deps: AppAuthLoginControllerDependencies,
): AppAuthLoginController {
    let parentTransition: { generation: number; task: Promise<string | undefined> } | null = null;

    function activateParentClientAuth(
        options: ParentClientAuthOptions = {},
    ): Promise<string | undefined> {
        if (parentTransition && deps.isAuthTransitionCurrent(parentTransition.generation)) {
            return parentTransition.task;
        }

        const generation = deps.beginParentClientTransition();
        const isCurrent = () => deps.isAuthTransitionCurrent(generation);
        const task = Promise.resolve().then(async () => {
            await deps.cancelPendingNip46Auth();
            if (!isCurrent()) return;
            return runParentClientAuth(options, generation, isCurrent);
        }).finally(() => {
            if (parentTransition?.task === task) parentTransition = null;
            deps.finishParentClientTransition(generation);
        });
        parentTransition = { generation, task };
        return task;
    }

    async function runParentClientAuth(
        options: ParentClientAuthOptions,
        generation: number,
        isCurrent: () => boolean,
    ): Promise<string | undefined> {
        // Authentication replaces the auth state, so read the outgoing session first.
        const previousAuthType = deps.getCurrentAuthType();
        const previousPubkeyHex = deps.getCurrentPubkeyHex();
        const result = await deps.parentClientAuthCoordinator
            .synchronizeParentClientAuth(options, isCurrent);
        if (!isCurrent()) return;

        if (!result.success || !result.pubkeyHex) {
            return result.error ?? 'parent_client_auth_error';
        }

        await deps.clearNip46RuntimeForAuthChange({
            currentAuthType: previousAuthType,
            currentPubkeyHex: previousPubkeyHex,
            nextAuthType: 'parentClient',
            nextPubkeyHex: result.pubkeyHex,
            nip46Service: deps.nip46Service,
        });
        if (!isCurrent()) return;

        deps.setCurrentRxNostr(deps.disposeNostrSession(deps.getCurrentRxNostr()));
        await deps.handlePostAuth(result.pubkeyHex, { generation });
        return undefined;
    }

    let pendingNosskeyLogin: { committing: boolean } | null = null;

    function cancelNosskeyLogin(): void {
        if (!pendingNosskeyLogin || pendingNosskeyLogin.committing) return;
        pendingNosskeyLogin = null;
        deps.nosskey?.setStatus('idle');
    }

    async function handleNosskeyLogin(): Promise<void> {
        const { nosskey } = deps;
        if (!nosskey || pendingNosskeyLogin) return;

        const generation = nosskey.beginTransition();
        const request = { committing: false };
        const isCurrent = () => pendingNosskeyLogin === request && deps.isAuthTransitionCurrent(generation);
        const previousAuthType = deps.getCurrentAuthType();
        const previousPubkeyHex = deps.getCurrentPubkeyHex();
        pendingNosskeyLogin = request;
        nosskey.setStatus('confirming');
        try {
            await deps.cancelPendingNip46Auth();
            if (!isCurrent()) return;

            const pubkeyHex = await nosskey.readPublicKey(isCurrent);
            if (!isCurrent()) return;

            const result = nosskey.authenticate(pubkeyHex);
            if (!result.success) {
                const code = result.error === 'nosskey.account_conflict' ? 'account_conflict' : 'storage';
                nosskey.reportError(new NosskeyError(code));
                return;
            }

            request.committing = true;
            nosskey.setStatus('committing');
            await deps.clearNip46RuntimeForAuthChange({
                currentAuthType: previousAuthType,
                currentPubkeyHex: previousPubkeyHex,
                nextAuthType: 'nosskey',
                nextPubkeyHex: pubkeyHex,
                nip46Service: deps.nip46Service,
            });
            if (isCurrent()) await deps.handlePostAuth(pubkeyHex, { generation });
        } catch (error) {
            if (isCurrent()) nosskey.reportError(error);
        } finally {
            if (pendingNosskeyLogin === request) {
                pendingNosskeyLogin = null;
                nosskey.setStatus('idle');
            }
        }
    }

    let isSavingSecretKey = false;

    async function saveSecretKey(secretKey: string, generation?: number): Promise<string | undefined> {
        // A second submit while the first is still running would authenticate twice.
        if (isSavingSecretKey) return undefined;
        isSavingSecretKey = true;
        const publicKeyLogin = isPublicKeyLoginInput(secretKey);
        const isCurrent = () => !publicKeyLogin || generation === undefined || deps.isAuthTransitionCurrent(generation);

        try {
            await deps.cancelPendingNip46Auth();

            if (!isCurrent()) return;

            // Authentication replaces the auth state, so read the outgoing session first.
            const previousAuthType = deps.getCurrentAuthType();
            const previousPubkeyHex = deps.getCurrentPubkeyHex();
            const result: AuthResult & { profileRelayHints?: string[] } = publicKeyLogin
                ? deps.authenticateWithPublicKey(secretKey)
                : await deps.authenticateWithNsec(secretKey);
            if (!isCurrent()) return;
            if (!result.success) {
                return result.error || 'authentication_error';
            }

            deps.clearSecretKeyInput();

            try {
                await deps.clearNip46RuntimeForAuthChange({
                    currentAuthType: previousAuthType,
                    currentPubkeyHex: previousPubkeyHex,
                    nextAuthType: publicKeyLogin ? 'npub' : 'nsec',
                    nextPubkeyHex: result.pubkeyHex,
                    nip46Service: deps.nip46Service,
                });
                if (!isCurrent()) return;
                if (publicKeyLogin) {
                    if (previousAuthType === 'parentClient') deps.disconnectParentClient();
                    await deps.handleSuccessfulAuthResult(result, pubkey => deps.handlePostAuth(pubkey, {
                        generation,
                        profileRelayHints: result.profileRelayHints,
                    }));
                } else {
                    await deps.handleSuccessfulAuthResult(result, deps.handlePostAuth);
                }
            } catch {
                deps.setProfileLoading(false);
            }
            return undefined;
        } finally {
            isSavingSecretKey = false;
        }
    }

    async function handleParentClientLogin(): Promise<string | undefined> {
        try {
            return await activateParentClientAuth();
        } catch (error) {
            deps.logger.error('親クライアント連携ログインでエラー:', error);
            return error instanceof Error
                ? error.message
                : 'parent_client_auth_error';
        }
    }

    return {
        activateParentClientAuth,
        hasPendingParentClientTransition: () => parentTransition !== null
            && deps.isAuthTransitionCurrent(parentTransition.generation),
        saveSecretKey,
        handleParentClientLogin,
        handleNosskeyLogin,
        cancelNosskeyLogin,
    };
}
