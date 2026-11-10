import { describe, expect, it, vi } from "vitest";
import { resolvePostSigner, type ResolvePostSignerParams } from "../../lib/postSignerResolver";

const PUBKEY = "a".repeat(64);

function params(overrides: Partial<ResolvePostSignerParams>): ResolvePostSignerParams {
    return {
        authType: "nsec",
        pubkey: PUBKEY,
        window: {},
        getParentClientSigner: () => null,
        getStoredSecretKey: () => null,
        createSecretKeySigner: () => ({}),
        ...overrides,
    };
}

describe("resolvePostSigner", () => {
    it("signs NIP-07 logins with window.nostr bound to the extension", async () => {
        const nostr = {
            marker: "extension",
            signEvent: vi.fn(async function (this: { marker: string }) { return this.marker; }),
        };
        const resolution = resolvePostSigner(params({ authType: "nip07", window: { nostr: nostr as never } }));

        expect(resolution).toMatchObject({ ok: true, source: "nip07" });
        if (!resolution.ok) return;
        await expect(resolution.signEvent({} as never)).resolves.toBe("extension");
    });

    it("does not fall back to a stored key when the NIP-07 extension is missing", () => {
        const getStoredSecretKey = vi.fn(() => "secret");
        const resolution = resolvePostSigner(params({ authType: "nip07", window: {}, getStoredSecretKey }));

        expect(resolution).toEqual({ ok: false, error: "nostr_sign_event_not_supported" });
        expect(getStoredSecretKey).not.toHaveBeenCalled();
    });

    it("uses the pre-fetched NIP-46 signer", () => {
        expect(resolvePostSigner(params({ authType: "nip46", nip46Signer: null })))
            .toEqual({ ok: false, error: "nip46_signer_not_available" });
        expect(resolvePostSigner(params({ authType: "nip46", nip46Signer: { signEvent: vi.fn() } })))
            .toMatchObject({ ok: true, source: "nip46" });
    });

    it("reports a missing parent-client signer", () => {
        expect(resolvePostSigner(params({ authType: "parentClient" })))
            .toEqual({ ok: false, error: "parent_client_signer_not_available" });
    });

    it("signs stored-key logins with the key for the session pubkey", () => {
        const getStoredSecretKey = vi.fn(() => "secret");
        const createSecretKeySigner = vi.fn(() => ({ signEvent: vi.fn() }));
        const resolution = resolvePostSigner(params({ getStoredSecretKey, createSecretKeySigner }));

        expect(resolution).toMatchObject({ ok: true, source: "secretKey" });
        expect(getStoredSecretKey).toHaveBeenCalledWith(PUBKEY);
        expect(createSecretKeySigner).toHaveBeenCalledWith("secret");
        expect(resolvePostSigner(params({})))
            .toEqual({ ok: false, error: "key_not_found" });
    });

    it("rejects signers without signEvent", () => {
        expect(resolvePostSigner(params({ authType: "parentClient", getParentClientSigner: () => ({}) })))
            .toEqual({ ok: false, error: "nostr_sign_event_not_supported" });
        expect(resolvePostSigner(params({ getStoredSecretKey: () => "secret" })))
            .toEqual({ ok: false, error: "nostr_sign_event_not_supported" });
    });
});
