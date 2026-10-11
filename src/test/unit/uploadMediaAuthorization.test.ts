import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey, type EventTemplate } from "nostr-tools";
import { NostrAuthService } from "../../lib/nostrAuthService";
import { mockAuthStoreModule } from "../mocks/storeModules";
import { mediaHash } from "../uploadMediaManagementTestUtils";
import { createDeferred } from "../deferredTestUtils";

const key = generateSecretKey(), pubkey = getPublicKey(key);
beforeEach(() => {
    mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, isAuthenticated: true, pubkey, type: "nip07" };
    Reflect.set(window, "nostr", { getPublicKey: async () => pubkey, signEvent: async (event: EventTemplate) => finalizeEvent(event, key) });
});
afterEach(() => { delete window.nostr; vi.useRealTimers(); });
describe("management authorization", () => {
    it.each(["list", "delete"] as const)("signs validated BUD-11 %s with hostname scope, expiration and unpadded UTF-8 Base64url", async (action) => {
        vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-12T00:00:00Z"));
        const result = await new NostrAuthService({ expectedPubkey: pubkey }).createBlossomManagementAuthorization({
            action, serverUrl: "https://MEDIA.EXAMPLE:8443/", expectedPubkey: pubkey, sha256: mediaHash.toUpperCase(), kind: "video",
        });
        const encoded = result.authorization.slice("Nostr ".length);
        expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
        const event = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
        expect(event).toMatchObject({ kind: 24242, pubkey });
        expect(event.tags).toContainEqual(["server", "media.example"]);
        expect(event.tags).toContainEqual(["t", action]);
        expect(event.tags).toContainEqual(["expiration", String(event.created_at + 60)]);
        expect(event.tags.filter((tag: string[]) => tag[0] === "x")).toEqual(action === "delete" ? [["x", mediaHash]] : []);
        expect(event.content).toContain("https://media.example:8443");
        result.assertSession();
        vi.advanceTimersByTime(60000);
        expect(result.assertSession).toThrow("expired");
    });
    it("prevents an NIP-98 operation from acquiring a different account's signer", async () => {
        await expect(new NostrAuthService({ expectedPubkey: "f".repeat(64) }).buildAuthHeader("https://media.example/list", "GET")).rejects.toThrow();
    });
    it("rejects a valid signature whose action was changed by the signer", async () => {
        Reflect.set(window.nostr!, "signEvent", async (event: EventTemplate) => finalizeEvent({ ...event, tags: [["t", "upload"]] }, key));
        await expect(new NostrAuthService().createBlossomManagementAuthorization({ action: "list", serverUrl: "https://media.example", expectedPubkey: pubkey })).rejects.toThrow();
    });
    it("rejects a pending signature after session change", async () => {
        const deferred = createDeferred<ReturnType<typeof finalizeEvent>>();
        const started = createDeferred<EventTemplate>();
        Reflect.set(window.nostr!, "signEvent", (event: EventTemplate) => { started.resolve(event); return deferred.promise; });
        const operation = new NostrAuthService().createBlossomManagementAuthorization({ action: "list", serverUrl: "https://media.example", expectedPubkey: pubkey });
        const template = await started.promise;
        mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, pubkey: "c".repeat(64) };
        deferred.resolve(finalizeEvent(template, key));
        await expect(operation).rejects.toThrow("Authentication required");
    });
});
