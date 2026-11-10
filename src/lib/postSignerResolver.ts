import type { EventTemplate } from "nostr-tools";
import type { WindowNostr } from "nostr-tools/nip07";
import type { AuthState } from "./types";

/**
 * Picks how a post or a deletion request is signed for the current login.
 * Shared by postManager and postDeletionService so both follow one rule.
 *
 * - NIP-07 signs with window.nostr; without a usable extension it fails
 *   instead of falling back to a stored secret key.
 * - NIP-46 uses the signer the caller already fetched and re-checked.
 * - Parent-client and stored-key logins use their signer objects.
 *
 * The caller still validates the signed event against the session pubkey.
 */
export interface PostSignerLike {
    signEvent?: (event: EventTemplate) => Promise<unknown>;
}

export type PostSignerSource = "nip07" | "nip46" | "parentClient" | "secretKey";

export type PostSignerError =
    | "nostr_sign_event_not_supported"
    | "nip46_signer_not_available"
    | "parent_client_signer_not_available"
    | "key_not_found";

export type PostSignerResolution =
    | {
        ok: true;
        source: PostSignerSource;
        signEvent: (event: EventTemplate) => Promise<unknown>;
    }
    | { ok: false; error: PostSignerError };

export interface ResolvePostSignerParams {
    authType: AuthState["type"];
    pubkey: string;
    window?: { nostr?: Partial<Pick<WindowNostr, "signEvent">> } | null;
    /** Already fetched for NIP-46 sessions (null/undefined when unavailable). */
    nip46Signer?: PostSignerLike | null;
    getParentClientSigner: () => PostSignerLike | null | undefined;
    getStoredSecretKey: (pubkey: string) => string | null | undefined;
    createSecretKeySigner: (secretKey: string) => PostSignerLike;
}

function bindSigner(
    signer: PostSignerLike | null | undefined,
    source: PostSignerSource,
    missingSignerError: PostSignerError,
): PostSignerResolution {
    if (!signer) return { ok: false, error: missingSignerError };
    const signEvent = signer.signEvent;
    return typeof signEvent === "function"
        ? { ok: true, source, signEvent: signEvent.bind(signer) }
        : { ok: false, error: "nostr_sign_event_not_supported" };
}

export function resolvePostSigner(params: ResolvePostSignerParams): PostSignerResolution {
    if (params.authType === "nip07") {
        const nostr = params.window?.nostr;
        const signEvent = nostr?.signEvent;
        return typeof signEvent === "function"
            ? { ok: true, source: "nip07", signEvent: signEvent.bind(nostr) }
            : { ok: false, error: "nostr_sign_event_not_supported" };
    }

    if (params.authType === "nip46") {
        return bindSigner(params.nip46Signer, "nip46", "nip46_signer_not_available");
    }

    if (params.authType === "parentClient") {
        return bindSigner(
            params.getParentClientSigner(),
            "parentClient",
            "parent_client_signer_not_available",
        );
    }

    const secretKey = params.getStoredSecretKey(params.pubkey);
    if (!secretKey) return { ok: false, error: "key_not_found" };
    return bindSigner(
        params.createSecretKeySigner(secretKey),
        "secretKey",
        "nostr_sign_event_not_supported",
    );
}
