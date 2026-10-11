import { describe, expect, it, vi } from "vitest";
import { Nip96UploadAdapter } from "../../lib/upload/Nip96UploadAdapter";
import { BlossomUploadAdapter } from "../../lib/upload/BlossomUploadAdapter";
import { normalizeListedMedia } from "../../lib/upload/mediaManagementUtils";
import { mediaAuth, mediaContext, mediaDestination, mediaHash, mediaItem, mediaPubkey, jsonMedia } from "../uploadMediaManagementTestUtils";

function params(protocol: "nip96" | "blossom") {
    return { destination: mediaDestination(protocol), expectedPubkey: mediaPubkey, authService: mediaAuth(),
        assertSession: vi.fn(), fetch: vi.fn() as unknown as typeof fetch };
}
const nipRecord = (tags: string[][]) => ({ created_at: 123, tags });
describe("uploaded-media adapters", () => {
    it("discovers the NIP-96 API, signs the exact query, carries the returned count, and deletes ox instead of x", async () => {
        const p = params("nip96");
        p.destination.resolvedUploadUrl = "https://media.example/old-upload";
        const get = vi.fn()
            .mockResolvedValueOnce(jsonMedia({ api_url: "https://media.example/api?existing=1" }))
            .mockResolvedValueOnce(jsonMedia({ page: 0, count: 2, total: 3, files: [
                nipRecord([["m", " IMAGE/PNG ; charset=binary"], ["url", "https://media.example/p.png?q=1"], ["ox", mediaHash], ["x", "c".repeat(64)], ["size", "12"]]),
                nipRecord([["m", "audio/ogg"], ["url", "https://media.example/a.png"]]),
            ] }))
            .mockResolvedValueOnce(jsonMedia({ page: 1, count: 2, total: 3, files: [nipRecord([["m", "video/mp4"], ["ox", mediaHash]])] }))
            .mockResolvedValueOnce(jsonMedia({ status: "success" }));
        p.fetch = get as typeof fetch;
        const adapter = new Nip96UploadAdapter();
        const first = await adapter.listMediaPage(p);
        expect(first.items).toMatchObject([{ kind: "image", size: 12, uploadedAt: 123, deleteId: { sha256: mediaHash } }]);
        expect(first.excludedCount).toBe(1);
        expect(first.nextPage).toEqual({ protocol: "nip96", page: 1, count: 2 });
        const second = await adapter.listMediaPage({ ...p, context: first.context, page: first.nextPage });
        expect(second.items[0]).toMatchObject({ kind: "video", url: null });
        expect(second.nextPage).toBeNull();
        await adapter.deleteMedia({ ...p, item: first.items[0], context: first.context });
        const signed = vi.mocked(p.authService.buildAuthHeader).mock.calls;
        expect(signed).toEqual([
            ["https://media.example/api?existing=1&page=0&count=24", "GET"],
            ["https://media.example/api?existing=1&page=1&count=2", "GET"],
            ["https://media.example/api/" + mediaHash + "?existing=1", "DELETE"],
        ]);
        expect(get.mock.calls.slice(1).map(([url]) => url)).toEqual(signed.map(([url]) => url));
        expect(get.mock.calls[1][1]).toMatchObject({ redirect: "error", credentials: "omit", referrerPolicy: "no-referrer", method: "GET" });
    });
    it.each([
        { page: 2, count: 24, total: 48, files: [] },
        { page: 1, count: 12, total: 48, files: [] },
        { page: 1, count: 24, total: 0, files: [nipRecord([["m", "image/png"]])] },
    ])("rejects contradictory NIP-96 pagination", async (data) => {
        const p = params("nip96"); p.fetch = vi.fn(async () => jsonMedia(data)) as typeof fetch;
        await expect(new Nip96UploadAdapter().listMediaPage({ ...p, context: mediaContext(p.destination), page: { protocol: "nip96", page: 1, count: 24 } }))
            .rejects.toMatchObject({ code: "invalidResponse" });
    });
    it("does not substitute a transformed hash or URL hash for a missing/conflicting ox", async () => {
        const p = params("nip96");
        p.fetch = vi.fn(async () => jsonMedia({ page: 0, count: 24, total: 2, files: [
            nipRecord([["m", "image/png"], ["url", "https://media.example/" + mediaHash + ".png"], ["x", mediaHash]]),
            nipRecord([["m", "image/png"], ["ox", mediaHash], ["ox", "c".repeat(64)]]),
        ] })) as typeof fetch;
        const page = await new Nip96UploadAdapter().listMediaPage({ ...p, context: mediaContext(p.destination) });
        expect(page.items.every((item) => item.deleteId === null)).toBe(true);
        await expect(new Nip96UploadAdapter().deleteMedia({ ...p, context: page.context, item: page.items[0] }))
            .rejects.toMatchObject({ code: "invalidResponse" });
    });
    it("uses the final raw Blossom descriptor as cursor even on a short audio-only page", async () => {
        const p = params("blossom");
        const get = vi.fn().mockResolvedValueOnce(jsonMedia([{ sha256: mediaHash, type: "audio/ogg", url: "https://media.example/a.png" }]))
            .mockResolvedValueOnce(jsonMedia([]));
        p.fetch = get as typeof fetch;
        const adapter = new BlossomUploadAdapter(), page = await adapter.listMediaPage(p);
        expect(page.items).toEqual([]);
        expect(page.nextPage).toEqual({ protocol: "blossom", cursor: mediaHash, limit: 24 });
        const end = await adapter.listMediaPage({ ...p, context: page.context, page: page.nextPage });
        expect(end.nextPage).toBeNull();
        expect(get.mock.calls[1][0]).toBe("https://media.example/list/" + mediaPubkey + "?limit=24&cursor=" + mediaHash);
        expect(p.authService.createBlossomManagementAuthorization).toHaveBeenCalledWith({ serverUrl: "https://media.example", action: "list", expectedPubkey: mediaPubkey, sha256: undefined, kind: undefined });
    });
    it.each([{ sha256: "bad" }, { sha256: mediaHash }])("rejects invalid/repeated Blossom raw cursors", async (last) => {
        const p = params("blossom"); p.fetch = vi.fn(async () => jsonMedia([last])) as typeof fetch;
        await expect(new BlossomUploadAdapter().listMediaPage({ ...p, page: { protocol: "blossom", cursor: mediaHash, limit: 24 } }))
            .rejects.toMatchObject({ code: "invalidResponse" });
    });
    it.each(["https://media.example/path", "https://media.example/?a=1", "https://user@media.example/"])("rejects non-root or credential-bearing Blossom settings before signing", async (serverUrl) => {
        const p = params("blossom"); p.destination.serverUrl = serverUrl;
        await expect(new BlossomUploadAdapter().listMediaPage(p)).rejects.toMatchObject({ code: "invalidDestination" });
        expect(p.authService.createBlossomManagementAuthorization).not.toHaveBeenCalled();
        expect(p.fetch).not.toHaveBeenCalled();
    });
    it.each([[404, "unavailable"], [405, "unavailable"], [501, "unavailable"], [401, "authentication"], [402, "payment"], [403, "forbidden"], [429, "rateLimited"], [503, "serverError"]])("classifies list HTTP %s without treating it as an empty list", async (status, code) => {
        const p = params("blossom");
        p.fetch = vi.fn(async () => new Response(null, { status: Number(status), headers: { "Retry-After": "10", "X-Reason": "policy reason" } })) as typeof fetch;
        await expect(new BlossomUploadAdapter().listMediaPage(p)).rejects.toMatchObject({ code });
    });
    it("does not send a request after signing is refused", async () => {
        const p = params("blossom");
        vi.mocked(p.authService.createBlossomManagementAuthorization!).mockRejectedValue(new Error("refused"));
        await expect(new BlossomUploadAdapter().listMediaPage(p)).rejects.toMatchObject({ code: "authentication" });
        expect(p.fetch).not.toHaveBeenCalled();
    });
    it("rechecks an authorization deadline immediately before HTTP dispatch", async () => {
        const p = params("blossom"), valid = vi.fn().mockImplementationOnce(() => undefined)
            .mockImplementation(() => { throw new Error("expired"); });
        vi.mocked(p.authService.createBlossomManagementAuthorization!).mockResolvedValue({ authorization: "Nostr synthetic", assertSession: valid });
        await expect(new BlossomUploadAdapter().listMediaPage(p)).rejects.toMatchObject({ code: "authentication" });
        expect(p.fetch).not.toHaveBeenCalled();
    });
    it.each([200, 204])("deletes a Blossom blob with scoped auth and accepts HTTP %s", async (status) => {
        const p = params("blossom"); p.fetch = vi.fn(async () => new Response(null, { status })) as typeof fetch;
        await new BlossomUploadAdapter().deleteMedia({ ...p, item: mediaItem(), context: mediaContext() });
        expect(p.fetch).toHaveBeenCalledWith("https://media.example/" + mediaHash, expect.objectContaining({ method: "DELETE", redirect: "error" }));
        expect(p.authService.createBlossomManagementAuthorization).toHaveBeenCalledWith(expect.objectContaining({ action: "delete", sha256: mediaHash, kind: "image" }));
    });
    it.each([["image/png; Charset=UTF-8", "image"], ["VIDEO/MP4", "video"], ["audio/ogg", null], ["application/pdf", null], ["invalid", null], [123, null], [undefined, "image"]])("honors authoritative MIME %s", (mime, expected) => {
        const item = normalizeListedMedia({ url: "https://media.example/a.png", mime, hash: mediaHash }, mediaContext(mediaDestination("nip96")), "one");
        expect(item?.kind ?? null).toBe(expected);
    });
});
