import { describe, expect, it, vi } from "vitest";
import { UploadMediaManagementController, emptyUploadMediaManagementView } from "../../lib/upload/uploadMediaManagementController";
import { UploadMediaError } from "../../lib/upload/mediaManagementTypes";
import type { UploadProtocolAdapter } from "../../lib/types/upload";
import { mediaAuth, mediaDestination, mediaItem, mediaPage, mediaPubkey } from "../uploadMediaManagementTestUtils";
import { createDeferred } from "../deferredTestUtils";

const policyResponse = { availableDomains: { "yabu.me": { requireinvite: false, requirepayment: false, maxsatoshi: 0,
    minUsernameLength: 3, maxUsernameLength: 20 } } };
const success = { status: "success", otc: false, payment_request: "", satoshi: 0 };
function setup() {
    let view = emptyUploadMediaManagementView();
    const destination = { ...mediaDestination("nip96"), serverUrl: "https://share.yabu.me/api/v2/media" };
    const auth = { value: { isAuthenticated: true, pubkey: mediaPubkey } };
    const signer = mediaAuth();
    const list = vi.fn(async () => { throw new UploadMediaError("authentication", 401); return mediaPage(destination); });
    const remove = vi.fn(async () => undefined);
    const fetch = vi.fn(async (_url: string, init?: RequestInit) => Response.json(init?.method === "POST" ? success : policyResponse));
    const controller = new UploadMediaManagementController({ auth, createAuth: () => signer, fetch: fetch as typeof globalThis.fetch,
        getAdapter: () => ({ listMediaPage: list, deleteMedia: remove }) as unknown as UploadProtocolAdapter,
        evictImages: async () => true, onChange: next => { view = next; } });
    return { controller, destination, auth, signer, list, remove, fetch, get view() { return view; } };
}
async function offered(s: ReturnType<typeof setup>) {
    s.controller.configure(mediaPubkey, [s.destination]);
    await vi.waitFor(() => expect(s.view.current?.registration?.phase).toBe("offer"));
}

describe("media registration ownership", () => {
    it.each([401, 403])("offers registration only after a real listing rejection (%s)", async status => {
        const s = setup(); s.list.mockRejectedValue(new UploadMediaError("forbidden", status));
        await offered(s);
        expect(s.fetch).not.toHaveBeenCalled();
    });
    it.each([undefined, 402, 429, 500])("does not turn signer failures or other statuses into registration offers (%s)", async status => {
        const s = setup(); s.list.mockRejectedValue(new UploadMediaError("authentication", status));
        s.controller.configure(mediaPubkey, [s.destination]);
        await vi.waitFor(() => expect(s.view.current?.error).not.toBeNull());
        expect(s.view.current?.registration).toBeNull();
    });
    it("does not offer registration for a different server or a rejected DELETE", async () => {
        const s = setup();
        s.controller.configure(mediaPubkey, [{ ...s.destination, serverUrl: "https://other.example/api" }]);
        await vi.waitFor(() => expect(s.view.current?.error).not.toBeNull());
        expect(s.view.current?.registration).toBeNull();
        s.list.mockResolvedValue({ ...mediaPage(s.destination), nextPage: null });
        s.controller.configure(mediaPubkey, [s.destination]);
        await vi.waitFor(() => expect(s.view.current?.loaded).toBe(true));
        s.remove.mockRejectedValue(new UploadMediaError("forbidden", 403));
        await s.controller.delete(mediaItem(s.destination).id);
        expect(s.view.current?.registration).toBeNull();
    });
    it("submits once and reloads the first page after registration", async () => {
        const s = setup(); await offered(s);
        await Promise.all([s.controller.openRegistration(), s.controller.openRegistration()]);
        expect(s.fetch).toHaveBeenCalledOnce();
        expect(s.view.current?.registration?.phase).toBe("ready");
        s.list.mockResolvedValue({ ...mediaPage(s.destination), nextPage: null });
        await Promise.all([s.controller.register("fixture"), s.controller.register("fixture")]);
        expect(s.fetch).toHaveBeenCalledTimes(2);
        expect(s.list).toHaveBeenCalledTimes(2);
        expect(s.view.current?.registration).toBeNull();
        expect(s.view.current?.loaded).toBe(true);
        expect(s.remove).not.toHaveBeenCalled();
        expect(s.controller.busy).toBe(false);
    });
    it("keeps an offer stable when saved destinations are reconfigured", async () => {
        const s = setup(); await offered(s);
        await s.controller.configureSaved(mediaPubkey);
        s.controller.configure(mediaPubkey, [s.destination]);
        expect(s.list).toHaveBeenCalledOnce();
    });
    it("sends name conflicts back to the form without reloading the list", async () => {
        const s = setup(); await offered(s); await s.controller.openRegistration();
        s.fetch.mockResolvedValue(Response.json({ status: "error", message: "Username already registered" }, { status: 406 }));
        await s.controller.register("fixture");
        expect(s.view.current?.registration).toMatchObject({ phase: "ready", error: "usernameTaken" });
        expect(s.list).toHaveBeenCalledOnce();
    });
    it.each(["registered", "alreadyRegistered"])("directs an account still rejected after %s to the official site", async result => {
        const s = setup(); await offered(s); await s.controller.openRegistration();
        if (result === "alreadyRegistered") s.fetch.mockResolvedValue(Response.json({ status: "error", message: "Pubkey already registered" }, { status: 406 }));
        await s.controller.register("fixture");
        expect(s.list).toHaveBeenCalledTimes(2);
        expect(s.view.current?.registration?.phase).toBe("external");
    });
    it("directs pending verification to the official site without claiming completion", async () => {
        const s = setup(); await offered(s); await s.controller.openRegistration();
        s.fetch.mockResolvedValue(Response.json({ ...success, otc: true }));
        await s.controller.register("fixture");
        expect(s.view.current?.registration?.phase).toBe("external");
        expect(s.list).toHaveBeenCalledOnce();
    });
    it("directs unavailable policies to the official site without signing", async () => {
        const s = setup(); await offered(s); s.fetch.mockRejectedValue(new TypeError("offline"));
        await s.controller.openRegistration(); await s.controller.register("fixture");
        expect(s.view.current?.registration?.phase).toBe("external");
        expect(s.signer.buildAuthHeader).not.toHaveBeenCalled();
    });
    it("ignores a policy response after cancelling the form", async () => {
        const s = setup(); await offered(s);
        const response = createDeferred<Response>(); s.fetch.mockReturnValue(response.promise);
        const pending = s.controller.openRegistration(); s.controller.cancelRegistration();
        response.resolve(Response.json(policyResponse)); await pending;
        expect(s.view.current?.registration?.phase).toBe("offer");
    });
    it("does not register the previous account after a signer returns late", async () => {
        const s = setup(); await offered(s); await s.controller.openRegistration();
        const signature = createDeferred<string>(); vi.mocked(s.signer.buildAuthHeader).mockReturnValue(signature.promise);
        const pending = s.controller.register("fixture");
        s.auth.value.pubkey = "c".repeat(64); s.controller.invalidate();
        signature.resolve("Nostr synthetic"); await pending;
        expect(s.fetch).toHaveBeenCalledOnce();
        expect(s.view.current).toBeNull();
    });
    it("does not resend after an uncertain POST or reconfiguration", async () => {
        const s = setup(); await offered(s); await s.controller.openRegistration();
        s.fetch.mockRejectedValue(new TypeError("offline"));
        await s.controller.register("fixture");
        s.controller.configure(mediaPubkey, [s.destination]);
        await s.controller.register("fixture");
        expect(s.view.current?.registration?.phase).toBe("unknown");
        expect(s.fetch).toHaveBeenCalledTimes(2);
    });
    it("cancels a pending registration when a saved endpoint is edited under the same destination ID", async () => {
        const s = setup(); await offered(s); await s.controller.openRegistration();
        const signature = createDeferred<string>(); vi.mocked(s.signer.buildAuthHeader).mockReturnValue(signature.promise);
        const pending = s.controller.register("fixture");
        s.controller.configure(mediaPubkey, [{ ...s.destination, resolvedUploadUrl: "https://different.example/upload" }]);
        signature.resolve("Nostr synthetic"); await pending;
        expect(s.fetch).toHaveBeenCalledOnce();
        expect(s.view.current?.registration).toBeNull();
    });
    it("retains an uncertain result when suspended after dispatch", async () => {
        const s = setup(); await offered(s); await s.controller.openRegistration();
        const response = createDeferred<Response>(); s.fetch.mockReturnValue(response.promise);
        const pending = s.controller.register("fixture");
        await vi.waitFor(() => expect(s.fetch).toHaveBeenCalledTimes(2));
        s.controller.suspend(); response.resolve(Response.json(success)); await pending;
        expect(s.view.current?.registration?.phase).toBe("unknown");
        expect(s.controller.busy).toBe(false);
    });
});
