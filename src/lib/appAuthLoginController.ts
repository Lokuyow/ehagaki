type ManagedAccountType = 'nsec' | 'nip07' | 'nip46' | 'parentClient';

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
    ): Promise<ParentClientAuthSyncResult>;
}

interface AuthResult {
    success: boolean;
    pubkeyHex?: string;
    error?: string;
}

export interface AppAuthLoginControllerDependencies {
    parentClientAuthCoordinator: ParentClientAuthCoordinatorLike;
    getCurrentAuthType(): string | undefined;
    getCurrentPubkeyHex(): string | null | undefined;
    getCurrentRxNostr(): unknown;
    setCurrentRxNostr(next: undefined): void;
    clearNip46RuntimeForAuthChange(params: {
        currentAuthType?: string;
        currentPubkeyHex?: string | null;
        nextAuthType: ManagedAccountType;
        nextPubkeyHex?: string | null;
        nip46Service: Nip46RuntimeController;
    }): Promise<void>;
    nip46Service: Nip46RuntimeController;
    disposeNostrSession(session: unknown): undefined;
    handlePostAuth(pubkeyHex: string): Promise<void>;
    cancelPendingNip46Auth(): Promise<void>;
    authenticateWithNsec(secretKey: string): Promise<AuthResult>;
    handleSuccessfulAuthResult(
        result: AuthResult,
        onAuthenticated: (pubkeyHex: string) => Promise<void>,
    ): Promise<boolean>;
    setErrorMessage(next: string): void;
    setProfileLoading(next: boolean): void;
    logger: Pick<Console, 'error'>;
}

export interface AppAuthLoginController {
    activateParentClientAuth(options?: ParentClientAuthOptions): Promise<string | undefined>;
    saveSecretKey(secretKey: string): Promise<void>;
    handleParentClientLogin(): Promise<string | undefined>;
}

export function createAppAuthLoginController(
    deps: AppAuthLoginControllerDependencies,
): AppAuthLoginController {
    async function activateParentClientAuth(
        options: ParentClientAuthOptions = {},
    ): Promise<string | undefined> {
        const result = await deps.parentClientAuthCoordinator
            .synchronizeParentClientAuth(options);

        if (!result.success || !result.pubkeyHex) {
            return result.error ?? 'parent_client_auth_error';
        }

        await deps.clearNip46RuntimeForAuthChange({
            currentAuthType: deps.getCurrentAuthType(),
            currentPubkeyHex: deps.getCurrentPubkeyHex(),
            nextAuthType: 'parentClient',
            nextPubkeyHex: result.pubkeyHex,
            nip46Service: deps.nip46Service,
        });

        deps.setCurrentRxNostr(deps.disposeNostrSession(deps.getCurrentRxNostr()));
        await deps.handlePostAuth(result.pubkeyHex);
        return undefined;
    }

    async function saveSecretKey(secretKey: string): Promise<void> {
        await deps.cancelPendingNip46Auth();

        const result = await deps.authenticateWithNsec(secretKey);
        if (!result.success) {
            deps.setErrorMessage(result.error || 'authentication_error');
            return;
        }

        deps.setErrorMessage('');

        try {
            await deps.clearNip46RuntimeForAuthChange({
                currentAuthType: deps.getCurrentAuthType(),
                currentPubkeyHex: deps.getCurrentPubkeyHex(),
                nextAuthType: 'nsec',
                nextPubkeyHex: result.pubkeyHex,
                nip46Service: deps.nip46Service,
            });
            await deps.handleSuccessfulAuthResult(result, deps.handlePostAuth);
        } catch {
            deps.setProfileLoading(false);
        }
    }

    async function handleParentClientLogin(): Promise<string | undefined> {
        try {
            await deps.cancelPendingNip46Auth();
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
        saveSecretKey,
        handleParentClientLogin,
    };
}
