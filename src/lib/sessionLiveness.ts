import type { AuthState } from "./types";

export type AuthStateSource = {
    value: Pick<AuthState, "isAuthenticated" | "pubkey">;
};

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
    if (!current.isAuthenticated || current.pubkey !== sessionPubkey) {
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
