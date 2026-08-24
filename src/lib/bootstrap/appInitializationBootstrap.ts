import { runExternalInputBootstrap, type RunExternalInputBootstrapParams } from "./externalInputBootstrap";
import type { AuthInitializationResult } from "../authRestoreUtils";

export const NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS = 30000;

interface DocumentLike {
    visibilityState: Document["visibilityState"];
    addEventListener: Document["addEventListener"];
    removeEventListener: Document["removeEventListener"];
}

interface AuthStateLike {
    value: {
        type?: string;
    };
}

interface Nip46VisibilityServiceLike {
    hasRecoverableSession(): boolean;
    isManualCheckInProgress(): boolean;
    ensureConnection(): Promise<boolean>;
}

type Nip46RecoveryConsole = Pick<Console, "error">
    & Partial<Pick<Console, "debug" | "warn">>;

interface RunAppInitializationBootstrapParams {
    reloadSettings: () => void;
    locationSearch: string;
    clearSharedMediaError: () => void;
    waitForLocale: () => Promise<void>;
    markLocaleInitialized: () => void;
    initializeAuth: () => Promise<AuthInitializationResult>;
    resolveAuthenticatedSession?: (
        currentResult: AuthInitializationResult,
    ) => Promise<AuthInitializationResult>;
    handleAuthenticated: (pubkeyHex: string) => Promise<void>;
    initializeGuestSession: () => Promise<void>;
    stopProfileLoading: () => void;
    refreshAccountList: () => void;
    markAuthInitialized: () => void;
    getExternalInputBootstrapParams: () => Omit<RunExternalInputBootstrapParams, "sharedError">;
    /** Web Component runtime does not consume URL or share-target input. */
    externalInputEnabled?: boolean;
    console: Nip46RecoveryConsole;
}

interface RegisterNip46VisibilityHandlerParams {
    document: DocumentLike;
    authState: AuthStateLike;
    nip46Service: Nip46VisibilityServiceLike;
    console: Nip46RecoveryConsole;
    now?: () => number;
}

function getSharedErrorFromLocationSearch(locationSearch: string): string | null {
    return new URLSearchParams(locationSearch).get("error");
}

export async function runAppInitializationBootstrap({
    reloadSettings,
    locationSearch,
    clearSharedMediaError,
    waitForLocale,
    markLocaleInitialized,
    initializeAuth,
    resolveAuthenticatedSession,
    handleAuthenticated,
    initializeGuestSession,
    stopProfileLoading,
    refreshAccountList,
    markAuthInitialized,
    getExternalInputBootstrapParams,
    externalInputEnabled = true,
    console,
}: RunAppInitializationBootstrapParams): Promise<void> {
    const sharedError = getSharedErrorFromLocationSearch(locationSearch);

    reloadSettings();
    clearSharedMediaError();
    await waitForLocale();
    markLocaleInitialized();

    try {
        let authResult = await initializeAuth();

        if (resolveAuthenticatedSession) {
            try {
                authResult = await resolveAuthenticatedSession(authResult);
            } catch {
                console.error('親クライアント連携自動認証中にエラー', {
                    stage: 'resolve-session',
                    reason: 'unexpected',
                });
            }
        }

        if (authResult.hasAuth && authResult.pubkeyHex) {
            await handleAuthenticated(authResult.pubkeyHex);
        } else {
            await initializeGuestSession();
            stopProfileLoading();
        }

        refreshAccountList();
    } catch {
        console.error("認証初期化中にエラー", {
            stage: 'initialize-auth',
            reason: 'unexpected',
        });
        await initializeGuestSession();
        stopProfileLoading();
    } finally {
        markAuthInitialized();
    }

    if (externalInputEnabled) {
        await runExternalInputBootstrap({
            ...getExternalInputBootstrapParams(),
            sharedError,
        });
    }
}

export function registerNip46VisibilityHandler({
    document,
    authState,
    nip46Service,
    console,
    now = () => Date.now(),
}: RegisterNip46VisibilityHandlerParams): () => void {
    let hiddenAt: number | null = null;

    function handleVisibilityChange() {
        if (document.visibilityState === "hidden") {
            hiddenAt = now();
            console.debug?.("NIP-46 visibility hidden");
            return;
        }

        if (document.visibilityState !== "visible") {
            return;
        }

        const hiddenDuration = hiddenAt === null ? null : now() - hiddenAt;
        hiddenAt = null;

        if (
            hiddenDuration !== null
            && hiddenDuration >= NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS
            && authState.value.type === "nip46"
            && nip46Service.hasRecoverableSession()
            && !nip46Service.isManualCheckInProgress()
        ) {
            console.debug?.("NIP-46 visibility auto recovery started");
            nip46Service.ensureConnection()
                .then((recovered) => {
                    if (recovered) {
                        console.debug?.("NIP-46 visibility auto recovery succeeded");
                    } else {
                        console.warn?.("NIP-46 visibility auto recovery failed");
                    }
                })
                .catch(() => {
                    console.error("NIP-46 visibility auto recovery threw unexpectedly", {
                        stage: 'visibility-recovery',
                        reason: 'unexpected',
                    });
                });
        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}
