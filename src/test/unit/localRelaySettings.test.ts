import { describe, expect, it } from "vitest";
import { normalizeLocalRelayUrl } from "../../lib/localRelayUrl";
import { getLocalRelayUrlPreference, setLocalRelayUrlPreference } from "../../lib/utils/settingsStorage";
import { STORAGE_KEYS } from "../../lib/constants";
import { EMBED_STORAGE_KEYS } from "../../lib/embedStorageKeys";
import { MockStorage } from "../helpers";

describe("device-local relay preference", () => {
    it("starts disabled, persists a normalized URL and clears without a schema or embed setting", () => {
        const storage = new MockStorage();
        expect(getLocalRelayUrlPreference(storage)).toBeNull();
        expect(setLocalRelayUrlPreference(storage, " ws://127.0.0.1:4869 ")).toBe("ws://127.0.0.1:4869/");
        expect(getLocalRelayUrlPreference(storage)).toBe("ws://127.0.0.1:4869/");
        expect([...EMBED_STORAGE_KEYS]).not.toContain(STORAGE_KEYS.LOCAL_RELAY_URL);
        expect(setLocalRelayUrlPreference(storage, " ")).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.LOCAL_RELAY_URL)).toBeNull();
    });
    it.each(["https://127.0.0.1:4869/", "127.0.0.1:4869", "ws://user:password@localhost/", "ws://localhost/#fragment", "bad"])(
        "rejects invalid input without replacing a saved URL: %s", (input) => {
            const storage = new MockStorage();
            setLocalRelayUrlPreference(storage, "ws://localhost:4869/");
            expect(normalizeLocalRelayUrl(input)).toBeNull();
            expect(() => setLocalRelayUrlPreference(storage, input)).toThrow("invalid_local_relay_url");
            expect(getLocalRelayUrlPreference(storage)).toBe("ws://localhost:4869/");
        });
    it("does not fail normal startup when local settings cannot be read", () => {
        expect(getLocalRelayUrlPreference({ getItem() { throw new Error("storage unavailable"); } })).toBeNull();
    });
});
