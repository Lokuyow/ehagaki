interface ParentClientRemoteLoginOptions {
    silent?: boolean;
    timeoutMs?: number;
}

export interface AppParentClientSyncControllerDependencies {
    isBootstrappingApp(): boolean;
    hasPendingParentAuth(): boolean;
    isCurrentParentClientRuntime(pubkeyHex?: string | null): boolean;
    activateParentClientAuth(
        options: ParentClientRemoteLoginOptions,
    ): Promise<string | undefined>;
    flushPendingComposerAction(): Promise<void>;
    logger: Pick<Console, 'error'>;
    remoteSyncTimeoutMs?: number;
}

export interface AppParentClientSyncController {
    clearPendingRemoteLogin(): void;
    flushPendingRemoteParentClientAndEmbedActions(): Promise<void>;
    handleRemoteParentClientLogin(pubkeyHex: string | null): Promise<void>;
}

const DEFAULT_REMOTE_SYNC_TIMEOUT_MS = 5000;

export function createAppParentClientSyncController(
    deps: AppParentClientSyncControllerDependencies,
): AppParentClientSyncController {
    let pendingRemoteParentLoginPubkey: string | null | undefined = undefined;
    let activeLogin: { pubkeyHex: string | null; generation: number } | null = null;
    let generation = 0;

    async function flushPendingRemoteParentClientAndEmbedActions(): Promise<void> {
        if (deps.isBootstrappingApp() || deps.hasPendingParentAuth()) {
            return;
        }

        if (!activeLogin && pendingRemoteParentLoginPubkey !== undefined) {
            const queuedPubkey = pendingRemoteParentLoginPubkey;
            pendingRemoteParentLoginPubkey = undefined;
            await handleRemoteParentClientLogin(queuedPubkey);
        }

        await deps.flushPendingComposerAction();
    }

    async function handleRemoteParentClientLogin(
        pubkeyHex: string | null,
    ): Promise<void> {
        if (deps.isBootstrappingApp()) {
            pendingRemoteParentLoginPubkey = pubkeyHex;
            return;
        }

        if (activeLogin) {
            // ready may be announced again by connect(). Coalesce that echo;
            // only a different, explicit account needs another authentication.
            if (pubkeyHex) {
                activeLogin.pubkeyHex ??= pubkeyHex;
                pendingRemoteParentLoginPubkey = pubkeyHex === activeLogin.pubkeyHex
                    ? undefined : pubkeyHex;
            }
            return;
        }

        if (deps.isCurrentParentClientRuntime(pubkeyHex)) {
            return;
        }

        const login = { pubkeyHex, generation };
        activeLogin = login;
        try {
            const error = await deps.activateParentClientAuth({
                silent: true,
                timeoutMs: deps.remoteSyncTimeoutMs ?? DEFAULT_REMOTE_SYNC_TIMEOUT_MS,
            });
            if (generation !== login.generation) return;
            if (error) {
                if (pendingRemoteParentLoginPubkey === pubkeyHex) {
                    pendingRemoteParentLoginPubkey = undefined;
                }
                deps.logger.error('親クライアント連携の自動同期に失敗:', error);
            }
        } catch {
            if (generation === login.generation) {
                deps.logger.error('親クライアント連携の自動同期に失敗:', 'parent_client_auth_error');
            }
        } finally {
            if (activeLogin === login) activeLogin = null;
        }

        if (generation !== login.generation) return;
        await flushPendingRemoteParentClientAndEmbedActions();
    }

    return {
        clearPendingRemoteLogin: () => {
            generation += 1;
            pendingRemoteParentLoginPubkey = undefined;
            activeLogin = null;
        },
        flushPendingRemoteParentClientAndEmbedActions,
        handleRemoteParentClientLogin,
    };
}
