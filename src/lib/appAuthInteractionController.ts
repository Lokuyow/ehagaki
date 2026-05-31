import { runNip07Login, runNip46Login } from './appAuthUtils';

type Nip46ConnectionCheckStatus = 'idle' | 'success' | 'failure';

interface Nip46RuntimeController {
    runManualConnectionCheck: () => Promise<{ success: boolean; skipped?: boolean }>;
}

interface Nip46DisconnectController {
    disconnect: () => Promise<void>;
}

export interface AppAuthInteractionControllerDependencies {
    getCurrentAuthType(): string | undefined;
    getCurrentPubkeyHex(): string | undefined;
    authenticateWithNip07(): Promise<{ success: boolean; pubkeyHex?: string; error?: string }>;
    authenticateWithNip46(
        bunkerUrl: string,
    ): Promise<{ success: boolean; pubkeyHex?: string; error?: string }>;
    cancelPendingNip46Auth(): Promise<void>;
    clearNip46RuntimeForAuthChange(params: {
        currentAuthType?: string;
        currentPubkeyHex?: string | null;
        nextAuthType: 'nsec' | 'nip07' | 'nip46' | 'parentClient';
        nextPubkeyHex?: string | null;
        nip46Service: Nip46DisconnectController;
    }): Promise<void>;
    handlePostAuth(pubkeyHex: string): Promise<void>;
    setNip07Loading(next: boolean): void;
    setNip46Loading(next: boolean): void;
    setNip46ConnectionCheckStatus(next: Nip46ConnectionCheckStatus): void;
    nip46Service: Nip46RuntimeController & Nip46DisconnectController;
    logger: Pick<Console, 'error'>;
}

export interface AppAuthInteractionController {
    handleNip07Login(): Promise<string | undefined>;
    handleNip46Login(bunkerUrl: string): Promise<string | undefined>;
    handleNip46ConnectionCheck(pubkeyHex: string): Promise<void>;
}

export function createAppAuthInteractionController(
    deps: AppAuthInteractionControllerDependencies,
): AppAuthInteractionController {
    async function handleNip07Login(): Promise<string | undefined> {
        return runNip07Login({
            currentAuthType: deps.getCurrentAuthType(),
            currentPubkeyHex: deps.getCurrentPubkeyHex(),
            authenticateWithNip07: deps.authenticateWithNip07,
            cancelPendingNip46Auth: deps.cancelPendingNip46Auth,
            clearNip46RuntimeForAuthChange: deps.clearNip46RuntimeForAuthChange,
            handlePostAuth: deps.handlePostAuth,
            setLoading: deps.setNip07Loading,
            nip46Service: deps.nip46Service,
            console: deps.logger,
        });
    }

    async function handleNip46Login(
        bunkerUrl: string,
    ): Promise<string | undefined> {
        return runNip46Login(
            {
                authenticateWithNip46: deps.authenticateWithNip46,
                handlePostAuth: deps.handlePostAuth,
                setLoading: deps.setNip46Loading,
                console: deps.logger,
            },
            bunkerUrl,
        );
    }

    async function handleNip46ConnectionCheck(pubkeyHex: string): Promise<void> {
        if (
            deps.getCurrentAuthType() !== 'nip46'
            || deps.getCurrentPubkeyHex() !== pubkeyHex
        ) {
            return;
        }

        deps.setNip46ConnectionCheckStatus('idle');
        const result = await deps.nip46Service.runManualConnectionCheck();

        if (result.skipped) {
            return;
        }

        deps.setNip46ConnectionCheckStatus(result.success ? 'success' : 'failure');
    }

    return {
        handleNip07Login,
        handleNip46Login,
        handleNip46ConnectionCheck,
    };
}
