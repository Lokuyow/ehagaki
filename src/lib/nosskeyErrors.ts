type NosskeyErrorCode = "unavailable" | "ready_timeout" | "timeout" | "no_key" | "declined"
    | "rate_limited" | "identity_mismatch" | "invalid_result" | "connection" | "cancelled"
    | "account_conflict" | "storage" | "signing_failed" | "passkey_failed" | "passkey_prf_unavailable";

export class NosskeyError extends Error {
    constructor(readonly code: NosskeyErrorCode) {
        super(`nosskey.${code}`);
    }
}

/** The Nosskey notice owns this feedback, including any recovery actions. */
export function isNosskeyErrorMessage(message?: string): boolean {
    return message?.startsWith("nosskey.") === true;
}
