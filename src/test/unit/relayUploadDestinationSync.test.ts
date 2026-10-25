import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUploadDestinationFromPreset, UPLOAD_DESTINATION_PRESETS } from "../../lib/upload/uploadDestinationPresets";
import { createDeferred } from "../deferredTestUtils";
import { fetchUploadRelayLists, publishUploadRelayLists, summarizeRelaySync } from "../../lib/upload/relayUploadDestinationSync";

const transport = vi.hoisted(() => ({ fetchRelayServerList: vi.fn(), publishRelayServerList: vi.fn(), BUD03_KIND: 10063, NIP96_KIND: 10096 }));
vi.mock("../../lib/upload/bud03ServerList", () => transport);
function context() {
    const controller = new AbortController();
    return { controller, rxNostr: {} as never, pubkeyHex: "a".repeat(64), signal: controller.signal,
        assertCurrent: vi.fn(() => { if (controller.signal.aborted) throw new DOMException("Aborted", "AbortError"); }),
        fetch: vi.fn(async () => Response.json({ api_url: "https://api.example/upload" })) as unknown as typeof fetch };
}
const list = (servers: string[]) => ({ success: true, servers });
beforeEach(() => {
    vi.resetAllMocks();
    transport.fetchRelayServerList.mockImplementation(async ({ kind }) => list(kind === 10063 ? ["https://blossom.example"] : ["https://media.example"]));
    transport.publishRelayServerList.mockResolvedValue({ success: true });
});
afterEach(() => vi.useRealTimers());

describe("integrated upload relay synchronization", () => {
    it("applies both lists with the normal success summary when some read relays did not finish", async () => {
        transport.fetchRelayServerList.mockImplementation(async ({ kind }) => ({
            ...list(kind === 10063 ? ["https://blossom.example"] : ["https://media.example"]), incomplete: true,
        }));
        const result = await fetchUploadRelayLists(context());
        expect(result.updates).toEqual({ blossom: ["https://blossom.example"], nip96: [{ serverUrl: "https://media.example", apiUrl: "https://api.example/upload" }] });
        expect(result.results).toEqual({ blossom: { status: "success", count: 1, incomplete: true }, nip96: { status: "success", count: 1, incomplete: true } });
        expect(summarizeRelaySync(result.results)).toBe("success");
    });
    it("preserves settings for an empty latest list and retains internal incomplete-relay metadata", async () => {
        transport.fetchRelayServerList.mockResolvedValue({ ...list([]), incomplete: true });
        const result = await fetchUploadRelayLists(context());
        expect(result.updates).toEqual({});
        expect(result.results.blossom).toEqual({ status: "skipped", reason: "empty_list", incomplete: true });
        expect(result.results.nip96).toEqual({ status: "skipped", reason: "empty_list", incomplete: true });
        expect(summarizeRelaySync(result.results)).toBe("skipped");
        expect(summarizeRelaySync({ ...result.results, nip96: { status: "failed", reason: "request_error" } })).toBe("failed");
    });
    it("fetches both kinds and stages both lists without persisting early", async () => {
        const c = context();
        const result = await fetchUploadRelayLists(c);
        expect(transport.fetchRelayServerList.mock.calls.map(([params]) => params.kind)).toEqual([10063, 10096]);
        expect(result.updates).toEqual({ blossom: ["https://blossom.example"], nip96: [{ serverUrl: "https://media.example", apiUrl: "https://api.example/upload" }] });
        expect(summarizeRelaySync(result.results)).toBe("success");
    });
    it.each(["not_found", "network_error", "timeout"])("preserves the successful protocol when the other returns %s", async error => {
        const c = context();
        transport.fetchRelayServerList.mockImplementation(async ({ kind }) => kind === 10063 ? list(["https://blossom.example"]) : { success: false, error });
        const result = await fetchUploadRelayLists(c);
        expect(result.updates).toEqual({ blossom: ["https://blossom.example"] });
        expect(summarizeRelaySync(result.results)).toBe("partial");
        expect(result.results.nip96.status).toBe(error === "not_found" ? "skipped" : "failed");
    });
    it("does not apply part of the NIP-96 list after one discovery fails", async () => {
        const c = context();
        transport.fetchRelayServerList.mockImplementation(async ({ kind }) => list(kind === 10063 ? ["https://blossom.example"] : ["https://one.example", "https://two.example"]));
        c.fetch = vi.fn(async url => {
            if (String(url).includes("two.example")) throw new TypeError("CORS blocked");
            return Response.json({ api_url: "https://one.example/api" });
        });
        const result = await fetchUploadRelayLists(c);
        expect(result.results.blossom.status).toBe("success");
        expect(result.results.nip96.status).toBe("failed");
        expect(result.updates.nip96).toBeUndefined();
    });
    it.each(["headers", "body", "delegation", "one-of-many"])("times out the whole discovery phase while waiting for %s and discards late results", async phase => {
        vi.useFakeTimers();
        const c = context();
        const pending = createDeferred<Response>();
        const body = createDeferred<unknown>();
        const signals: AbortSignal[] = [];
        let count = 0;
        if (phase === "one-of-many") transport.fetchRelayServerList.mockImplementation(async ({ kind }) => list(kind === 10063 ? ["https://blossom.example"] : ["https://one.example", "https://two.example"]));
        c.fetch = vi.fn(async (_url, init) => {
            signals.push(init!.signal as AbortSignal);
            if (phase === "body") return { ok: true, status: 200, json: () => body.promise } as Response;
            if (phase === "delegation" && count++ === 0) return Response.json({ delegated_to_url: "https://delegated.example" });
            if (phase === "one-of-many" && count++ === 0) return Response.json({ api_url: "https://one.example/api" });
            return pending.promise;
        });
        const operation = fetchUploadRelayLists(c);
        await vi.advanceTimersByTimeAsync(10_000);
        const result = await operation;
        expect(result.results.nip96).toEqual({ status: "failed", reason: "discovery_timeout" });
        expect(result.results.blossom.status).toBe("success");
        expect(result.updates.nip96).toBeUndefined();
        expect(signals.every(signal => signal.aborted)).toBe(true);
        expect(c.signal.aborted).toBe(false);
        expect(vi.getTimerCount()).toBe(0);
        pending.resolve(Response.json({ api_url: "https://api.example/upload" }));
        body.resolve({ api_url: "https://api.example/upload" });
        await Promise.resolve();
        expect(result.updates.nip96).toBeUndefined();
    });
    it("cancels discovery promptly on account invalidation and removes its deadline", async () => {
        vi.useFakeTimers();
        const c = context();
        c.fetch = vi.fn(() => new Promise<Response>(() => {}));
        const operation = fetchUploadRelayLists(c);
        const rejection = expect(operation).rejects.toThrow();
        await vi.advanceTimersByTimeAsync(0);
        c.controller.abort();
        await rejection;
        expect(vi.getTimerCount()).toBe(0);
    });
    it("skips empty NIP-96 lists without discovery", async () => {
        const c = context();
        transport.fetchRelayServerList.mockResolvedValue(list([]));
        const result = await fetchUploadRelayLists(c);
        expect(result.updates).toEqual({});
        expect(result.results.nip96).toEqual({ status: "skipped", reason: "empty_list" });
        expect(c.fetch).not.toHaveBeenCalled();
    });
    it("retains the Blossom publication when NIP-96 discovery times out", async () => {
        vi.useFakeTimers();
        const c = context();
        const blossom = createUploadDestinationFromPreset({ preset: UPLOAD_DESTINATION_PRESETS.find(preset => preset.protocol === "blossom")! });
        const nip96 = createUploadDestinationFromPreset({ preset: UPLOAD_DESTINATION_PRESETS.find(preset => preset.protocol === "nip96")! });
        c.fetch = vi.fn(() => new Promise<Response>(() => {}));
        const operation = publishUploadRelayLists({ ...c, destinations: [blossom, nip96], getSigner: async () => ({} as never) });
        await vi.advanceTimersByTimeAsync(10_000);
        const result = await operation;
        expect(result.blossom.status).toBe("success");
        expect(result.nip96).toEqual({ status: "failed", reason: "discovery_timeout" });
        expect(transport.publishRelayServerList.mock.calls.map(([params]) => params.kind)).toEqual([10063]);
        expect(vi.getTimerCount()).toBe(0);
    });
    it.each(["share-yabu-me", "nostrcheck-me", "nostr-build", "nostpic-com"])("publishes the verified server rather than the %s direct API", async id => {
        const c = context();
        const preset = UPLOAD_DESTINATION_PRESETS.find(preset => preset.id === id)!;
        const destination = createUploadDestinationFromPreset({ preset });
        c.fetch = vi.fn(async () => Response.json({ api_url: preset.resolvedUploadUrl }));
        const getSigner = vi.fn(async () => ({} as never));
        const result = await publishUploadRelayLists({ ...c, destinations: [destination], getSigner });
        expect(result.nip96.status).toBe("success");
        expect(transport.publishRelayServerList).toHaveBeenCalledWith(expect.objectContaining({ kind: 10096, servers: [preset.nip96ServerUrl] }));
    });
    it("continues with NIP-96 after Blossom signature rejection and preserves list order", async () => {
        const c = context();
        const base = createUploadDestinationFromPreset({ preset: UPLOAD_DESTINATION_PRESETS.find(preset => preset.protocol === "blossom")! });
        const nip96 = { ...base, protocol: "nip96" as const, serverUrl: "https://media.example", nip96ServerUrl: "https://media.example", nip96UrlMode: "discovery" as const };
        const getSigner = vi.fn().mockRejectedValueOnce(new Error("denied")).mockResolvedValueOnce({});
        const result = await publishUploadRelayLists({ ...c, destinations: [base, nip96], getSigner });
        expect(result.blossom.status).toBe("failed");
        expect(result.nip96.status).toBe("success");
        expect(getSigner).toHaveBeenCalledTimes(2);
    });
    it.each([false, true])("publishes Sovbit only in the Blossom list (legacy NIP-96: %s)", async legacy => {
        const c = context();
        const preset = UPLOAD_DESTINATION_PRESETS.find(preset => preset.id === "files-sovbit-host")!;
        const destination = createUploadDestinationFromPreset({ preset });
        if (legacy) Object.assign(destination, { protocol: "nip96", serverUrl: "https://files.sovbit.host/api/v2/media",
            resolvedUploadUrl: "https://files.sovbit.host/upload", auth: { type: "nip98" } });
        const result = await publishUploadRelayLists({ ...c, destinations: [destination], getSigner: async () => ({} as never) });
        expect(result.blossom.status).toBe("success");
        expect(result.nip96.status).toBe("skipped");
        expect(c.fetch).not.toHaveBeenCalled();
        expect(transport.publishRelayServerList).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
            kind: 10063, servers: ["https://files.sovbit.host"],
        }));
    });
    it("does not publish an incomplete NIP-96 list when one API does not match discovery", async () => {
        const c = context();
        const base = createUploadDestinationFromPreset({ preset: UPLOAD_DESTINATION_PRESETS.find(preset => preset.protocol === "blossom")! });
        const direct = { ...base, protocol: "nip96" as const, presetId: "custom" as const, serverUrl: "https://media.example/wrong-api" };
        const result = await publishUploadRelayLists({ ...c, destinations: [base, direct], getSigner: async () => ({} as never) });
        expect(result.blossom.status).toBe("success");
        expect(result.nip96.status).toBe("failed");
        expect(transport.publishRelayServerList.mock.calls.map(([params]) => params.kind)).toEqual([10063]);
    });
    it("skips Custom HTTP and disabled destinations without asking a signer", async () => {
        const c = context();
        const base = createUploadDestinationFromPreset({ preset: UPLOAD_DESTINATION_PRESETS[0] });
        const getSigner = vi.fn();
        const result = await publishUploadRelayLists({ ...c, destinations: [{ ...base, enabled: false }, { ...base, protocol: "custom-http" }], getSigner });
        expect(summarizeRelaySync(result)).toBe("skipped");
        expect(getSigner).not.toHaveBeenCalled();
        expect(c.fetch).not.toHaveBeenCalled();
    });
});
