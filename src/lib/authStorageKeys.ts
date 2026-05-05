import { STORAGE_KEYS } from "./constants";

export function getNsecStorageKey(pubkeyHex?: string): string {
    return pubkeyHex
        ? STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + pubkeyHex
        : STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY;
}

export function getNip46SessionStorageKey(pubkeyHex?: string): string {
    return pubkeyHex
        ? STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkeyHex
        : STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY;
}

export function getParentClientSessionStorageKey(pubkeyHex: string): string {
    return STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + pubkeyHex;
}
