import type { AuthResult } from "../types";
import type { RestoreResult } from "../authRestoreUtils";

export interface Nip07AutoLoginDependencies {
    authenticateWithNip07: () => Promise<AuthResult>;
    console: Pick<Console, "error">;
}

/** Opted-in hosts only: reading the public key makes most NIP-07 extensions prompt. */
export async function resolveNip07AutoLoginSession(
    current: RestoreResult,
    deps: Nip07AutoLoginDependencies,
): Promise<RestoreResult> {
    if (current.hasAuth) return current;

    try {
        const result = await deps.authenticateWithNip07();
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
