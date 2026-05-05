import { describe, expect, it } from "vitest";
import {
    getNip46SessionStorageKey,
    getNsecStorageKey,
    getParentClientSessionStorageKey,
} from "../../lib/authStorageKeys";
import { STORAGE_KEYS } from "../../lib/constants";

describe("authStorageKeys", () => {
    it("builds legacy and scoped nsec keys", () => {
        expect(getNsecStorageKey()).toBe(STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY);
        expect(getNsecStorageKey("pubkey")).toBe(
            `${STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX}pubkey`,
        );
    });

    it("builds legacy and scoped NIP-46 session keys", () => {
        expect(getNip46SessionStorageKey()).toBe(STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY);
        expect(getNip46SessionStorageKey("pubkey")).toBe(
            `${STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX}pubkey`,
        );
    });

    it("builds parent-client session keys", () => {
        expect(getParentClientSessionStorageKey("pubkey")).toBe(
            `${STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX}pubkey`,
        );
    });
});
