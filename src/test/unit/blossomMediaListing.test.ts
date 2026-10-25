import { describe, expect, it, vi } from "vitest";
import { listBlossomMediaPage, BLOSSOM_LIST_MAX_BYTES, BLOSSOM_LIST_MAX_DESCRIPTORS } from "../../lib/upload/blossomMediaManagement";
import { mediaAuth, mediaDestination, mediaHash, mediaPubkey, jsonMedia } from "../uploadMediaManagementTestUtils";

function params(response: Response) {
    return { destination: mediaDestination(), expectedPubkey: mediaPubkey, authService: mediaAuth(),
        assertSession: vi.fn(), fetch: vi.fn(async () => response) as typeof fetch };
}
function descriptor(index: number) {
    const sha256 = index.toString(16).padStart(64, "0");
    return { sha256, type: "image/png", url: `https://media.example/${sha256}.png`, size: 12, uploaded: 300 - index };
}
function streamed(chunks: Uint8Array[], headers: Record<string, string> = {}) {
    let index = 0;
    const cancel = vi.fn();
    const pull = vi.fn((controller: ReadableStreamDefaultController<Uint8Array>) => {
        if (index < chunks.length) controller.enqueue(chunks[index++]);
        else controller.close();
    });
    return { cancel, pull, response: new Response(new ReadableStream({ pull, cancel }, { highWaterMark: 0 }), { headers }) };
}

describe("bounded Blossom media listing", () => {
    it.each([1, 24])("treats %s repeated descriptors ending at the requested cursor as a local snapshot", async (count) => {
        const data = Array.from({ length: count }, (_, i) => descriptor(i));
        const result = await listBlossomMediaPage({ ...params(jsonMedia(data)),
            page: { protocol: "blossom", cursor: data.at(-1)!.sha256, limit: 24 },
        });
        expect(result).toMatchObject({ localSnapshot: true, nextPage: null, rawCount: count, invalidCount: 0 });
        expect(result.items).toHaveLength(count);
    });
    it("rejects a previous cursor inside a normal page even when the final hash advances", async () => {
        const data = [descriptor(1), descriptor(2)];
        await expect(listBlossomMediaPage({ ...params(jsonMedia(data)),
            page: { protocol: "blossom", cursor: data[0].sha256, limit: 24 },
        })).rejects.toMatchObject({ code: "invalidResponse" });
    });
    it("accepts 231 descriptors without a remote continuation, including when the previous cursor is returned", async () => {
        const data = Array.from({ length: 231 }, (_, i) => descriptor(i));
        const p = params(jsonMedia(data));
        const result = await listBlossomMediaPage({ ...p, page: { protocol: "blossom", cursor: data[0].sha256, limit: 24 } });
        expect(result).toMatchObject({ localSnapshot: true, nextPage: null, rawCount: 231, invalidCount: 0, excludedCount: 0 });
        expect(result.items).toHaveLength(231);
        expect(result.items[0]).toMatchObject({ url: data[0].url, deleteId: { sha256: data[0].sha256 } });
        expect(p.fetch).toHaveBeenCalledOnce();
        expect(p.authService.createBlossomManagementAuthorization).toHaveBeenCalledOnce();
    });
    it("keeps descriptor, MIME and URL validation in oversized lists", async () => {
        const data: unknown[] = Array.from({ length: 24 }, (_, i) => descriptor(i));
        data.push(null, { ...descriptor(25), type: "audio/ogg" }, { ...descriptor(26), url: "https://127.0.0.1/bad.png" },
            { ...descriptor(27), sha256: "bad" });
        const result = await listBlossomMediaPage(params(jsonMedia(data)));
        expect(result).toMatchObject({ localSnapshot: true, rawCount: 28, invalidCount: 3, excludedCount: 1 });
        expect(result.items).toHaveLength(26);
        expect(result.items.at(-2)).toMatchObject({ url: null, deleteId: { sha256: descriptor(26).sha256 } });
        expect(result.items.at(-1)).toMatchObject({ url: null, deleteId: null });
    });
    it.each([BLOSSOM_LIST_MAX_DESCRIPTORS, BLOSSOM_LIST_MAX_DESCRIPTORS + 1])("bounds raw descriptor count at %s", async (count) => {
        const p = params(jsonMedia(Array.from({ length: count }, () => ({ sha256: mediaHash, type: "audio/ogg" }))));
        if (count === BLOSSOM_LIST_MAX_DESCRIPTORS) {
            expect(await listBlossomMediaPage(p)).toMatchObject({ rawCount: count, localSnapshot: true, items: [] });
        } else await expect(listBlossomMediaPage(p)).rejects.toMatchObject({ code: "invalidResponse" });
    });
    it.each([undefined, { "Content-Length": "2" }])("measures streamed bytes even with missing/incorrect length %j", async (headers) => {
        const f = streamed([new TextEncoder().encode("[]" + " ".repeat(BLOSSOM_LIST_MAX_BYTES - 2)), new Uint8Array([32]), new Uint8Array([32])], headers);
        await expect(listBlossomMediaPage(params(f.response))).rejects.toMatchObject({ code: "invalidResponse" });
        expect(f.cancel).toHaveBeenCalledOnce();
        expect(f.pull).toHaveBeenCalledTimes(2);
    });
    it("accepts the exact byte boundary and decodes multi-byte characters across chunks", async () => {
        const boundary = params(new Response("[]" + " ".repeat(BLOSSOM_LIST_MAX_BYTES - 2)));
        expect(await listBlossomMediaPage(boundary)).toMatchObject({ items: [], nextPage: null });
        const bytes = new TextEncoder().encode(JSON.stringify([{ ...descriptor(1), ignored: "日本語" }]));
        const f = streamed(Array.from(bytes, (byte) => new Uint8Array([byte])));
        expect((await listBlossomMediaPage(params(f.response))).items).toHaveLength(1);
    });
    it("cancels a declared oversized body before reading", async () => {
        const f = streamed([new Uint8Array([91, 93])], { "Content-Length": String(BLOSSOM_LIST_MAX_BYTES + 1) });
        await expect(listBlossomMediaPage(params(f.response))).rejects.toMatchObject({ code: "invalidResponse" });
        expect(f.cancel).toHaveBeenCalledOnce();
        expect(f.pull).not.toHaveBeenCalled();
    });
    it.each(["{", "{}", "null", "", "[1]"])("rejects malformed/abnormal JSON %j", async (body) => {
        await expect(listBlossomMediaPage(params(new Response(body)))).rejects.toMatchObject({ code: "invalidResponse" });
    });
    it.each(["abort", "session"])("rechecks %s while a body read is pending and cancels it", async (reason) => {
        let control!: ReadableStreamDefaultController<Uint8Array>;
        const cancel = vi.fn(), abort = new AbortController();
        const p = params(new Response(new ReadableStream({ start(controller) { control = controller; }, cancel })));
        const pending = listBlossomMediaPage({ ...p, signal: abort.signal });
        await vi.waitFor(() => expect(p.fetch).toHaveBeenCalledOnce());
        if (reason === "abort") abort.abort();
        else p.assertSession.mockImplementation(() => { throw new Error("session invalid"); });
        const rejected = expect(pending).rejects.toBeDefined();
        control.enqueue(new TextEncoder().encode("[]"));
        await rejected;
        expect(cancel).toHaveBeenCalledOnce();
    });
    it("classifies a body stream failure as invalidResponse", async () => {
        const response = new Response(new ReadableStream({ start(controller) { controller.error(new Error("broken body")); } }));
        await expect(listBlossomMediaPage(params(response))).rejects.toMatchObject({ code: "invalidResponse" });
    });
});
