import type { AuthState } from "./types";

export type AuthStateSource = {
    value: Pick<AuthState, "isAuthenticated" | "pubkey"> & Partial<Pick<AuthState, "type" | "nosskeySessionGeneration">>;
};

export function isSameAuthSession(current: AuthStateSource["value"], initial: AuthStateSource["value"]): boolean {
    // Nosskey sessions have a stable identity across metadata updates, but
    // receive a new generation when the user returns to the same account.
    if (initial.type === "nosskey" && initial.nosskeySessionGeneration !== undefined) {
        return current.isAuthenticated && current.pubkey === initial.pubkey && current.type === initial.type
            && current.nosskeySessionGeneration === initial.nosskeySessionGeneration;
    }
    return current === initial;
}

/** Internal typed marker for upload callers that expose a stable auth error. */
export class AuthenticationRequiredError extends Error {
    constructor() {
        super("Authentication required");
        this.name = "Error";
    }
}

export function assertActiveSession(
    authStateStore: AuthStateSource,
    sessionPubkey: string,
): void {
    const current = authStateStore.value;
    if (!current.isAuthenticated || current.type === "npub" || current.pubkey !== sessionPubkey) {
        throw new AuthenticationRequiredError();
    }
}

export function captureActiveSessionPubkey(authStateStore: AuthStateSource): string {
    const sessionPubkey = authStateStore.value.pubkey;
    if (!sessionPubkey) {
        throw new AuthenticationRequiredError();
    }
    assertActiveSession(authStateStore, sessionPubkey);
    return sessionPubkey;
}
