import type { AuthResult, PublicKeyData } from "../types";
import type { AuthInitializationResult } from "../authRestoreUtils";

export interface Nip07AutoLoginDependencies {
    authenticateWithNip07: (identity?: PublicKeyData) => Promise<AuthResult>;
    console: Pick<Console, "error">;
}

/** Opted-in hosts only: reading the public key makes most NIP-07 extensions prompt. */
export async function resolveNip07AutoLoginSession(
    current: AuthInitializationResult,
    deps: Nip07AutoLoginDependencies,
): Promise<AuthInitializationResult> {
    if (current.hasAuth) return current;
    if (current.restoreOutcome === 'infrastructure-failure') return current;

    try {
        const result = await deps.authenticateWithNip07(current.nip07Identity);
        if (!result.success || !result.pubkeyHex) return current;
        return { hasAuth: true, pubkeyHex: result.pubkeyHex };
    } catch {
        deps.console.error("NIP-07自動ログイン中にエラー", {
            stage: 'auto-login',
            reason: 'unexpected',
        });
        return current;
    }
}
