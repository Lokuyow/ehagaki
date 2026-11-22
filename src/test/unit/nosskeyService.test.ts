import type { NostrEvent } from "nosskey-iframe";
import { describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { authState, clearAuthState, setAuthInitialized, setNosskeyAuth } from "../../stores/authStore.svelte";
import { isSameAuthSession } from "../../lib/sessionLiveness";
import { createNosskeyService } from "../../lib/nosskeyService.svelte";

vi.unmock("../../stores/authStore.svelte");

const ownerKey = generateSecretKey();
const otherKey = generateSecretKey();
const owner = getPublicKey(ownerKey);
const template = { kind: 1, content: "test", tags: [], created_at: 1 };

function setup() {
    const container = document.createElement("div");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    container.append(iframe);
    const client = {
        iframe,
        ready: vi.fn(async () => {}),
        getPublicKey: vi.fn(async () => owner),
        signEvent: vi.fn(async (_event: NostrEvent) => finalizeEvent({ ...template }, ownerKey)),
        destroy: vi.fn(),
    };
    const createClient = vi.fn(async () => client);
    const service = createNosskeyService(createClient);
    const dispose = service.attach(container);
    return { client, createClient, service, dispose };
}

describe("Nosskey requests", () => {
    it("constructs lazily and sends only the canonical unsigned fields", async () => {
        const { service, createClient, client, dispose } = setup();
        const signer = service.signer(owner, () => true);
        await expect(signer.getPublicKey()).resolves.toBe(owner);
        expect(createClient).not.toHaveBeenCalled();
        const event = { ...template, pubkey: "untrusted", id: "untrusted", sig: "untrusted" };
        await expect(signer.signEvent(event)).resolves.toMatchObject({ pubkey: owner });
        expect(Object.keys(client.signEvent.mock.calls[0]?.[0] ?? {}).sort()).toEqual(["content", "created_at", "kind", "tags"]);
        await expect(service.readPublicKey(() => true)).resolves.toBe(owner);
        expect(createClient).toHaveBeenCalledTimes(1);
        dispose();
        expect(client.destroy).toHaveBeenCalledTimes(1);
    });

    it("distinguishes a verified different account from a modified payload", async () => {
        const { service, client, dispose } = setup();
        const valid = finalizeEvent({ ...template }, otherKey);
        client.signEvent.mockResolvedValueOnce(valid).mockResolvedValueOnce({ ...valid, content: "modified" });
        const signer = service.signer(owner, () => true);
        await expect(signer.signEvent(template)).rejects.toMatchObject({ code: "identity_mismatch" });
        await expect(signer.signEvent(template)).rejects.toMatchObject({ code: "invalid_result" });
        dispose();
    });

    it("keeps an approval valid across metadata updates and invalidates same-account re-login", () => {
        try {
            setNosskeyAuth(owner, "npub", "nprofile");
            const session = authState.value;
            setAuthInitialized();
            expect(isSameAuthSession(authState.value, session)).toBe(true);
            clearAuthState();
            setNosskeyAuth(owner, "npub", "nprofile");
            expect(isSameAuthSession(authState.value, session)).toBe(false);
        } finally {
            clearAuthState(false);
        }
    });

    it("releases a stuck approval and cancels requests queued on that iframe", async () => {
        const { service, client, createClient, dispose } = setup();
        client.getPublicKey.mockImplementationOnce(() => {
            client.iframe.style.display = "block";
            return new Promise((_, reject) => {
                client.destroy.mockImplementationOnce(() => reject(new Error("destroyed")));
            });
        });
        const first = expect(service.readPublicKey(() => true)).rejects.toMatchObject({ code: "cancelled" });
        await vi.waitFor(() => expect(service.state.visible).toBe(true));
        const queued = expect(service.readPublicKey(() => true)).rejects.toMatchObject({ code: "cancelled" });

        service.dismissApproval();
        expect(service.state.visible).toBe(false);
        await Promise.all([first, queued]);
        expect(client.getPublicKey).toHaveBeenCalledOnce();
        expect(client.destroy).toHaveBeenCalledOnce();

        client.iframe.style.display = "none";
        await expect(service.readPublicKey(() => true)).resolves.toBe(owner);
        expect(createClient).toHaveBeenCalledTimes(2);
        dispose();
    });

    it("discards stale requests and waits for a timed-out approval to close", async () => {
        const { service, client, dispose } = setup();
        let expire!: (error: Error) => void;
        client.getPublicKey.mockImplementationOnce(() => {
            client.iframe.style.display = "block";
            return new Promise((_, reject) => { expire = reject; });
        });
        const first = service.readPublicKey(() => true);
        const timedOut = expect(first).rejects.toMatchObject({ code: "timeout" });
        await vi.waitFor(() => expect(client.getPublicKey).toHaveBeenCalledTimes(1));
        let current = true;
        const second = expect(service.readPublicKey(() => current)).rejects.toMatchObject({ code: "cancelled" });
        const third = service.readPublicKey(() => true);
        expire(new Error("Nosskey iframe request timed out after 60000ms."));
        await timedOut;
        expect(client.getPublicKey).toHaveBeenCalledTimes(1);
        current = false;
        client.iframe.style.display = "none";
        await second;
        await expect(third).resolves.toBe(owner);
        expect(client.getPublicKey).toHaveBeenCalledTimes(2);
        dispose();
    });
});
