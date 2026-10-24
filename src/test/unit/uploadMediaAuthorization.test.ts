import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey, type EventTemplate } from "nostr-tools";
import { NostrAuthService } from "../../lib/nostrAuthService";
import { mockAuthStoreModule } from "../mocks/storeModules";
import { mediaHash } from "../uploadMediaManagementTestUtils";
import { createDeferred } from "../deferredTestUtils";
import { BlossomUploadAdapter } from "../../lib/upload/BlossomUploadAdapter";
import { mediaDestination, jsonMedia } from "../uploadMediaManagementTestUtils";

const key = generateSecretKey(), pubkey = getPublicKey(key);
beforeEach(() => {
    mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, isAuthenticated: true, pubkey, type: "nip07" };
    Reflect.set(window, "nostr", { getPublicKey: async () => pubkey, signEvent: async (event: EventTemplate) => finalizeEvent(event, key) });
});
afterEach(() => { delete window.nostr; vi.useRealTimers(); });
describe.each(["https://MEDIA.EXAMPLE:8443/", "https://blossom.primal.net"])("management authorization on %s", (serverUrl) => {
    it.each(["list", "delete"] as const)("signs validated %s with hostname scope, expiration and origin-specific encoding", async (action) => {
        vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-12T00:00:00Z"));
        const result = await new NostrAuthService({ expectedPubkey: pubkey }).createBlossomManagementAuthorization({
            action, serverUrl, expectedPubkey: pubkey, sha256: mediaHash.toUpperCase(), kind: "video",
        });
        const encoded = result.authorization.slice("Nostr ".length);
        const bytes = Buffer.from(encoded, "base64url");
        expect(encoded).toBe(bytes.toString(serverUrl.includes("primal.net") ? "base64" : "base64url"));
        const event = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
        expect(event).toMatchObject({ kind: 24242, pubkey });
        expect(event.tags).toContainEqual(["server", new URL(serverUrl).hostname.toLowerCase()]);
        expect(event.tags).toContainEqual(["t", action]);
        expect(event.tags).toContainEqual(["expiration", String(event.created_at + 60)]);
        expect(event.tags.filter((tag: string[]) => tag[0] === "x")).toEqual(action === "delete" ? [["x", mediaHash]] : []);
        expect(event.content).toContain(new URL(serverUrl).origin);
        result.assertSession();
        vi.advanceTimersByTime(60000);
        expect(result.assertSession).toThrow("expired");
    });
    it("prevents an NIP-98 operation from acquiring a different account's signer", async () => {
        await expect(new NostrAuthService({ expectedPubkey: "f".repeat(64) }).buildAuthHeader("https://media.example/list", "GET")).rejects.toThrow();
    });
    it("rejects a valid signature whose action was changed by the signer", async () => {
        Reflect.set(window.nostr!, "signEvent", async (event: EventTemplate) => finalizeEvent({ ...event, tags: [["t", "upload"]] }, key));
        await expect(new NostrAuthService().createBlossomManagementAuthorization({ action: "list", serverUrl, expectedPubkey: pubkey })).rejects.toThrow();
    });
    it("rejects a pending signature after session change", async () => {
        const deferred = createDeferred<ReturnType<typeof finalizeEvent>>();
        const started = createDeferred<EventTemplate>();
        Reflect.set(window.nostr!, "signEvent", (event: EventTemplate) => { started.resolve(event); return deferred.promise; });
        const operation = new NostrAuthService().createBlossomManagementAuthorization({ action: "list", serverUrl, expectedPubkey: pubkey });
        const template = await started.promise;
        mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, pubkey: "c".repeat(64) };
        deferred.resolve(finalizeEvent(template, key));
        await expect(operation).rejects.toThrow("Authentication required");
    });
});

describe("Primal management HTTP dispatch", () => {
    function params() {
        return { destination: { ...mediaDestination(), serverUrl: "https://blossom.primal.net" },
            expectedPubkey: pubkey, authService: new NostrAuthService({ expectedPubkey: pubkey }), assertSession: vi.fn() };
    }
    it("sends the same signed bytes for listing and deletion of custom Primal destinations", async () => {
        const signed: string[] = [];
        const p = params();
        const getSigner = p.authService.getEventSigner.bind(p.authService);
        vi.spyOn(p.authService, "getEventSigner").mockImplementation(async (expected) => {
            const signer = await getSigner(expected);
            return { ...signer, signEvent: async (event) => {
                const result = await signer.signEvent(event);
                signed.push(JSON.stringify(result)); return result;
            } };
        });
        const fetchMock = vi.fn().mockResolvedValueOnce(jsonMedia([{
            sha256: mediaHash, type: "image/png", url: `https://blossom.primal.net/${mediaHash}.png`,
        }])).mockResolvedValueOnce(new Response(null, { status: 204 }));
        const operation = { ...p, fetch: fetchMock as typeof fetch }, adapter = new BlossomUploadAdapter();
        const page = await adapter.listMediaPage(operation);
        expect(page.items).toHaveLength(1);
        await adapter.deleteMedia({ ...operation, item: page.items[0], context: page.context });
        expect(fetchMock.mock.calls.map(([url, init]) => [url, init.method])).toEqual([
            [`https://blossom.primal.net/list/${pubkey}?limit=24`, "GET"],
            [`https://blossom.primal.net/${mediaHash}`, "DELETE"],
        ]);
        expect(signed).toHaveLength(2);
        fetchMock.mock.calls.forEach(([, init], index) => {
            expect(init.headers.Authorization === `Nostr ${Buffer.from(signed[index]).toString("base64")}`).toBe(true);
        });
    });
    it.each([401, 403, "cors"] as const)("does not retry or treat %s as an empty list", async (failure) => {
        const fetchMock = vi.fn(async () => {
            if (failure === "cors") throw new TypeError("Failed to fetch");
            return new Response(null, { status: failure });
        });
        await expect(new BlossomUploadAdapter().listMediaPage({ ...params(), fetch: fetchMock as typeof fetch }))
            .rejects.toMatchObject({ code: failure === "cors" ? "network" : failure === 401 ? "authentication" : "forbidden" });
        expect(fetchMock).toHaveBeenCalledOnce();
    });
});
