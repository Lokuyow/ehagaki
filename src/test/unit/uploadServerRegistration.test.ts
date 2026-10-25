import { describe, expect, it, vi } from "vitest";
import { getUploadRegistrationTarget, isUploadRegistrationUsernameValid, loadUploadRegistrationPolicy,
    registerUploadServer } from "../../lib/upload/uploadServerRegistration";
import { mediaAuth, mediaDestination, mediaPubkey } from "../uploadMediaManagementTestUtils";
import { createDeferred } from "../deferredTestUtils";

const policy = { minLength: 3, maxLength: 20 };
const destination = () => ({ ...mediaDestination("nip96"), serverUrl: "https://share.yabu.me/api/v2/media" });
const success = { status: "success", otc: false, payment_request: "", satoshi: 0 };
function setup(data: unknown = success, status = 200) {
    return { destination: destination(), expectedPubkey: mediaPubkey, assertSession: vi.fn(), authService: mediaAuth(),
        fetch: vi.fn<typeof globalThis.fetch>().mockImplementation(async () => Response.json(data, { status })), signal: new AbortController().signal };
}

describe("upload server registration service", () => {
    it.each([
        ["https://share.yabu.me/api/v2/media", "yabu.me"], ["https://yabu.me/api/v2/media", "yabu.me"],
        ["https://nostrcheck.me/api/v2/media", "nostrcheck.me"], ["https://cdn.nostrcheck.me/", "nostrcheck.me"],
    ])("recognizes an exact NIP-96 endpoint: %s", (serverUrl, domain) => {
        expect(getUploadRegistrationTarget({ ...destination(), serverUrl })?.domain).toBe(domain);
    });
    it.each([
        { protocol: "blossom" }, { protocol: "custom-http" },
        { serverUrl: "https://evil.example/api/v2/media", presetId: "share-yabu-me" },
        { serverUrl: "https://share.yabu.me.evil.example/api/v2/media" },
        { serverUrl: "http://share.yabu.me/api/v2/media" }, { serverUrl: "https://user@share.yabu.me/api/v2/media" },
        { resolvedUploadUrl: "https://evil.example" }, { nip96ServerUrl: "https://evil.example" },
        { serverUrl: "https://share.yabu.me/api/v2/media?custom=1" },
    ])("rejects a different protocol or edited URL (%j)", overrides => {
        expect(getUploadRegistrationTarget({ ...destination(), ...overrides } as ReturnType<typeof destination>)).toBeNull();
    });
    it("reads only the target domain's free policy without signing", async () => {
        const s = setup({ availableDomains: { "yabu.me": { requireinvite: false, requirepayment: false, maxsatoshi: 0,
            minUsernameLength: 3, maxUsernameLength: 20 } } });
        expect(await loadUploadRegistrationPolicy(s)).toEqual(policy);
        expect(s.fetch.mock.calls[0][0]).toBe("https://share.yabu.me/api/v2/domains");
        expect(s.authService.buildAuthHeader).not.toHaveBeenCalled();
    });
    it.each([{}, { requireinvite: true }, { requirepayment: true }, { maxsatoshi: 1 },
        { minUsernameLength: 0 }, { maxUsernameLength: 2 }, { minUsernameLength: "3" },
    ])("requires external registration for unavailable or restricted conditions (%j)", async overrides => {
        const domain = Object.keys(overrides).length ? { requireinvite: false, requirepayment: false, maxsatoshi: 0,
            minUsernameLength: 3, maxUsernameLength: 20, ...overrides } : {};
        expect(await loadUploadRegistrationPolicy(setup({ availableDomains: { "yabu.me": domain } }))).toBeNull();
    });
    it.each(["", "ab", "a".repeat(21), "やぶみ", "name🎨", "some name"])("rejects invalid usernames: %s", async username => {
        const s = setup();
        expect(isUploadRegistrationUsernameValid(username, policy)).toBe(false);
        await expect(registerUploadServer(s, username, policy, vi.fn())).rejects.toMatchObject({ code: "invalidUsername" });
        expect(s.fetch).not.toHaveBeenCalled(); expect(s.authService.buildAuthHeader).not.toHaveBeenCalled();
    });
    it("signs and sends the same JSON without a password to a fixed endpoint", async () => {
        const s = setup(), dispatched = vi.fn();
        expect(await registerUploadServer(s, "eHagaki_123", policy, dispatched)).toBe("registered");
        expect(dispatched).toHaveBeenCalledOnce();
        const call = vi.mocked(s.authService.buildAuthHeader).mock.calls[0];
        const [url, init] = s.fetch.mock.calls[0];
        expect(url).toBe("https://share.yabu.me/api/v2/register");
        expect(url === call[0] && call[1] === "POST").toBe(true);
        const body = JSON.parse(init!.body as string);
        expect(body).toEqual(call[2]);
        expect(Object.keys(body).sort()).toEqual(["domain", "pubkey", "username"]);
        expect(body.pubkey === mediaPubkey && body.domain === "yabu.me" && body.username === "eHagaki_123").toBe(true);
        expect(init!.credentials).toBe("omit"); expect(init!.redirect).toBe("error");
    });
    it.each([
        [{ ...success, otc: true }, "external", 200], [{ ...success, payment_request: "invoice", satoshi: 12 }, "external", 200],
        [{ status: "error", message: "Pubkey already registered" }, "alreadyRegistered", 406],
        [{ status: "error" }, "external", 403],
    ] as const)("handles additional steps and existing accounts", async (data, result, status) => {
        expect(await registerUploadServer(setup(data, status ?? 200), "valid", policy, vi.fn())).toBe(result);
    });
    it.each([
        [{ status: "error", message: "Username already registered" }, 406, "usernameTaken"],
        [{ status: "error", message: "Invalid username format" }, 401, "invalidUsername"],
        [{ status: "error" }, 429, "rateLimited"], [{ status: "success" }, 200, "unknownRegistration"],
        [{ ...success, satoshi: "0" }, 200, "unknownRegistration"], [{ status: "error" }, 500, "unknownRegistration"],
    ] as const)("keeps safe error codes for ambiguous or rejected responses", async (data, status, code) => {
        await expect(registerUploadServer(setup(data, status), "valid", policy, vi.fn())).rejects.toMatchObject({ code });
    });
    it("does not POST if the signer rejects", async () => {
        const s = setup(); vi.mocked(s.authService.buildAuthHeader).mockRejectedValue(new Error("rejected"));
        await expect(registerUploadServer(s, "valid", policy, vi.fn())).rejects.toMatchObject({ code: "authentication" });
        expect(s.fetch).not.toHaveBeenCalled();
    });
    it("does not POST after cancelling a pending signer", async () => {
        const s = setup(), abort = new AbortController(), signature = createDeferred<string>();
        vi.mocked(s.authService.buildAuthHeader).mockReturnValue(signature.promise);
        const pending = registerUploadServer({ ...s, signal: abort.signal }, "valid", policy, vi.fn());
        abort.abort(); await expect(pending).rejects.toMatchObject({ name: "AbortError" });
        signature.resolve("Nostr synthetic"); expect(s.fetch).not.toHaveBeenCalled();
    });
    it("does not automatically retry an interrupted POST", async () => {
        const s = setup(); s.fetch.mockRejectedValue(new TypeError("network"));
        await expect(registerUploadServer(s, "valid", policy, vi.fn())).rejects.toMatchObject({ code: "unknownRegistration" });
        expect(s.fetch).toHaveBeenCalledOnce();
    });
    it("bounds HTTP body reads", async () => {
        vi.useFakeTimers();
        try {
            const s = setup(); s.fetch.mockImplementation(async () => new Response(new ReadableStream({ start() {} })));
            const assertion = expect(registerUploadServer(s, "valid", policy, vi.fn())).rejects.toMatchObject({ code: "unknownRegistration" });
            await vi.advanceTimersByTimeAsync(20_001); await assertion;
            expect(s.fetch).toHaveBeenCalledOnce();
        } finally { vi.useRealTimers(); }
    });
});
