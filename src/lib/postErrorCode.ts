import { isRecord } from "./utils/typeGuards";

/** Default code for failures without a safe, specific code. */
export const DEFAULT_POST_ERROR_CODE = "post_error";

const SAFE_POST_ERROR_CODE = /^[a-z][a-z0-9_]{0,63}$/;

/**
 * Normalizes a post failure for an embed host (iframe `post.error` and the
 * Web Component `ehagaki-post-error`).
 *
 * Post failures are reported internally as identifiers such as
 * `no_write_relays`, or as UI message keys such as
 * `postComponent.error.reply_target_event_unavailable`. Hosts receive a short
 * stable identifier only; anything that is not one falls back to
 * `post_error` so free-form text never reaches the host as a code.
 */
export function normalizePostErrorCode(
    error: unknown,
    fallback: string = DEFAULT_POST_ERROR_CODE,
): string {
    const raw = typeof error === "string"
        ? error
        : isRecord(error) && typeof error.code === "string"
            ? error.code
            : undefined;
    if (!raw) return fallback;
    const code = raw
        .trim()
        .replace(/^postComponent\.(?:error\.)?/, "")
        .replace(/^nosskey\./, "nosskey_");
    return SAFE_POST_ERROR_CODE.test(code) ? code : fallback;
}
