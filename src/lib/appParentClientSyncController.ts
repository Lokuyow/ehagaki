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
    flushPendingRemoteParentClientAndEmbedActions(): Promise<void>;
    handleRemoteParentClientLogin(pubkeyHex: string | null): Promise<void>;
}

const DEFAULT_REMOTE_SYNC_TIMEOUT_MS = 5000;

export function createAppParentClientSyncController(
    deps: AppParentClientSyncControllerDependencies,
): AppParentClientSyncController {
    let pendingRemoteParentLoginPubkey: string | null | undefined = undefined;

    async function flushPendingRemoteParentClientAndEmbedActions(): Promise<void> {
        if (deps.isBootstrappingApp() || deps.hasPendingParentAuth()) {
            return;
        }

        if (pendingRemoteParentLoginPubkey !== undefined) {
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

        if (deps.isCurrentParentClientRuntime(pubkeyHex)) {
            return;
        }

        const error = await deps.activateParentClientAuth({
            silent: true,
            timeoutMs: deps.remoteSyncTimeoutMs ?? DEFAULT_REMOTE_SYNC_TIMEOUT_MS,
        });

        if (error) {
            deps.logger.error('親クライアント連携の自動同期に失敗:', error);
        }

        await flushPendingRemoteParentClientAndEmbedActions();
    }

    return {
        flushPendingRemoteParentClientAndEmbedActions,
        handleRemoteParentClientLogin,
    };
}
