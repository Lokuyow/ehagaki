import { runExternalInputBootstrap, type RunExternalInputBootstrapParams } from "./externalInputBootstrap";

interface AuthInitializationResult {
    hasAuth: boolean;
    pubkeyHex?: string;
}

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
    isConnected(): boolean;
    ensureConnection(): Promise<unknown>;
}

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
    console: Pick<Console, "error">;
}

interface RegisterNip46VisibilityHandlerParams {
    document: DocumentLike;
    authState: AuthStateLike;
    nip46Service: Nip46VisibilityServiceLike;
    console: Pick<Console, "error">;
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
            } catch (error) {
                console.error('親クライアント連携自動認証中にエラー:', error);
            }
        }

        if (authResult.hasAuth && authResult.pubkeyHex) {
            await handleAuthenticated(authResult.pubkeyHex);
        } else {
            await initializeGuestSession();
            stopProfileLoading();
        }

        refreshAccountList();
    } catch (error) {
        console.error("認証初期化中にエラー:", error);
        await initializeGuestSession();
        stopProfileLoading();
    } finally {
        markAuthInitialized();
    }

    await runExternalInputBootstrap({
        ...getExternalInputBootstrapParams(),
        sharedError,
    });
}

export function registerNip46VisibilityHandler({
    document,
    authState,
    nip46Service,
    console,
}: RegisterNip46VisibilityHandlerParams): () => void {
    function handleVisibilityChange() {
        if (
            document.visibilityState === "visible" &&
            authState.value.type === "nip46" &&
            nip46Service.isConnected()
        ) {
            nip46Service.ensureConnection().catch((error) => {
                console.error("NIP-46 reconnection failed:", error);
            });
        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}