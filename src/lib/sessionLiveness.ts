import type { AuthState } from "./types";

export type AuthStateSource = {
    value: Pick<AuthState, "isAuthenticated" | "pubkey">;
};

export function assertActiveSession(
    authStateStore: AuthStateSource,
    sessionPubkey: string,
): void {
    const current = authStateStore.value;
    if (!current.isAuthenticated || current.pubkey !== sessionPubkey) {
        throw new Error("Authentication required");
    }
}

export function captureActiveSessionPubkey(authStateStore: AuthStateSource): string {
    const sessionPubkey = authStateStore.value.pubkey;
    if (!sessionPubkey) {
        throw new Error("Authentication required");
    }
    assertActiveSession(authStateStore, sessionPubkey);
    return sessionPubkey;
}
