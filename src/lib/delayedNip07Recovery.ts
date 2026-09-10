import type { PublicKeyData } from './types';

export interface DelayedNip07RecoveryDependencies {
    window: Window | undefined;
    document: Document | undefined;
    nip07Service: {
        isAvailable(): boolean;
        waitForExtension(
            timeoutMs: number,
            options?: { signal?: AbortSignal },
        ): Promise<boolean>;
    };
    readIdentity(): Promise<PublicKeyData | null>;
    restoreAccount(
        pubkeyHex: string,
        type: 'nip07',
        options: { nip07Identity: PublicKeyData },
    ): Promise<{ hasAuth: boolean; pubkeyHex?: string }>;
    handlePostAuth(pubkeyHex: string, options?: { generation: number }): Promise<void>;
    getActivePubkey(): string | null;
    getAccountType(pubkeyHex: string): string | null;
    isAuthenticated(): boolean;
    getGeneration(): number;
    console: Pick<Console, 'error'>;
}

export interface DelayedNip07RecoveryController {
    start(targetPubkey: string): void;
    markTransition(): void;
    dispose(): void;
}

export function createDelayedNip07RecoveryController(
    deps: DelayedNip07RecoveryDependencies,
): DelayedNip07RecoveryController {
    let disposed = false;
    let targetPubkey: string | null = null;
    let generation = 0;
    let attemptPromise: Promise<void> | null = null;
    let providerWaitPromise: Promise<void> | null = null;
    let abortController: AbortController | null = null;
    let listenersAttached = false;

    const isSelected = (attemptGeneration: number): boolean =>
        !disposed
        && targetPubkey !== null
        && deps.getGeneration() === attemptGeneration
        && deps.getActivePubkey() === targetPubkey
        && deps.getAccountType(targetPubkey) === 'nip07';

    const isCurrent = (attemptGeneration: number): boolean =>
        isSelected(attemptGeneration) && !deps.isAuthenticated();

    const cleanup = (): void => {
        if (listenersAttached) {
            deps.window?.removeEventListener('focus', trigger);
            deps.document?.removeEventListener('visibilitychange', onVisibilityChange);
            listenersAttached = false;
        }
        abortController?.abort();
        abortController = null;
        providerWaitPromise = null;
        targetPubkey = null;
    };

    const attempt = async (): Promise<void> => {
        if (disposed || attemptPromise || !targetPubkey) return;
        const attemptGeneration = generation;
        if (!isCurrent(attemptGeneration)) return;

        const identity = await deps.readIdentity();
        if (!identity || identity.hex !== targetPubkey || !isCurrent(attemptGeneration)) return;

        const result = await deps.restoreAccount(targetPubkey, 'nip07', {
            nip07Identity: identity,
        });
        if (!result.hasAuth || result.pubkeyHex !== targetPubkey || !isSelected(attemptGeneration)) return;

        const restoredPubkey = targetPubkey;
        cleanup();
        await deps.handlePostAuth(restoredPubkey, { generation: attemptGeneration });
    };

    const trigger = (): void => {
        if (disposed || !targetPubkey || attemptPromise) return;
        if (!isSelected(generation)) {
            cleanup();
            return;
        }
        if (!deps.nip07Service.isAvailable()) return;
        attemptPromise = attempt()
            .catch(() => {
                deps.console.error('遅延NIP-07復元に失敗しました', {
                    stage: 'delayed-restore',
                    reason: 'unexpected',
                });
            })
            .finally(() => {
                attemptPromise = null;
            });
    };

    const onVisibilityChange = (): void => {
        if (deps.document?.visibilityState === 'visible') trigger();
    };

    return {
        start(target: string): void {
            if (disposed || targetPubkey) return;
            targetPubkey = target;
            generation = deps.getGeneration();
            deps.window?.addEventListener('focus', trigger);
            deps.document?.addEventListener('visibilitychange', onVisibilityChange);
            listenersAttached = true;

            if (!deps.nip07Service.isAvailable()) {
                abortController = new AbortController();
                providerWaitPromise = deps.nip07Service
                    .waitForExtension(Number.POSITIVE_INFINITY, { signal: abortController.signal })
                    .then((available) => {
                        if (available) trigger();
                    })
                    .catch(() => undefined)
                    .finally(() => {
                        providerWaitPromise = null;
                    });
            }
        },
        markTransition(): void {
            generation = deps.getGeneration();
            if (targetPubkey) cleanup();
        },
        dispose(): void {
            if (disposed) return;
            disposed = true;
            cleanup();
        },
    };
}
