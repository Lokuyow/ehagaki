import type { RxNostr } from "rx-nostr";
import type { Signer } from "nostr-tools/signer";
import type { UploadDestination } from "../types";
import { BUD03_KIND, NIP96_KIND, fetchRelayServerList, publishRelayServerList } from "./bud03ServerList";
import { fetchNip96DiscoveryConfig } from "./nip96Discovery";
import { canonicalizeNip96UploadUrl } from "./nip96UrlPolicy";
import { getNip96DiscoveryServer, normalizeNip96ServerUrl } from "./nip96ServerIdentity";
import { awaitUploadOperation, throwIfUploadAborted } from "./uploadOperation";
import { resolveUploadDestinationForUse } from "./uploadDestinationResolver";

export const NIP96_RELAY_SYNC_DISCOVERY_TIMEOUT_MS = 10_000;
export type RelaySyncProtocol = "blossom" | "nip96";
export interface RelaySyncOutcome {
    status: "success" | "failed" | "skipped";
    reason?: string;
    count?: number;
}
export type RelaySyncResults = Record<RelaySyncProtocol, RelaySyncOutcome>;
export interface ResolvedNip96Server { serverUrl: string; apiUrl: string }
export interface RelayServerListUpdates { blossom?: string[]; nip96?: ResolvedNip96Server[] }
export function summarizeRelaySync(results: RelaySyncResults): "success" | "partial" | "failed" | "skipped" {
    const values = Object.values(results);
    if (values.every(value => value.status === "success")) return "success";
    if (values.some(value => value.status === "success")) return "partial";
    return values.some(value => value.status === "failed") ? "failed" : "skipped";
}
interface SyncContext { rxNostr: RxNostr; pubkeyHex: string; signal: AbortSignal; assertCurrent: () => void; fetch: typeof fetch }

async function discoverServers(servers: string[], context: SyncContext): Promise<ResolvedNip96Server[]> {
    const controller = new AbortController();
    let timedOut = false;
    const abort = () => controller.abort();
    context.signal.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, NIP96_RELAY_SYNC_DISCOVERY_TIMEOUT_MS);
    try {
        throwIfUploadAborted(context.signal);
        return await awaitUploadOperation(Promise.all([...new Set(servers)].map(async raw => {
            const serverUrl = normalizeNip96ServerUrl(raw);
            const { apiUrl } = await fetchNip96DiscoveryConfig({
                trustedUploadUrl: canonicalizeNip96UploadUrl(serverUrl), fetch: context.fetch, signal: controller.signal,
            });
            throwIfUploadAborted(controller.signal);
            context.assertCurrent();
            return { serverUrl, apiUrl };
        })), controller.signal);
    } catch (error) {
        if (timedOut) throw new Error("discovery_timeout");
        throw error;
    } finally {
        clearTimeout(timer);
        context.signal.removeEventListener("abort", abort);
        controller.abort();
    }
}

const failure = (error: unknown): RelaySyncOutcome => ({ status: "failed", reason: error instanceof Error && error.message === "discovery_timeout" ? "discovery_timeout" : "request_failed" });

export async function fetchUploadRelayLists(context: SyncContext): Promise<{ results: RelaySyncResults; updates: RelayServerListUpdates }> {
    const updates: RelayServerListUpdates = {};
    const run = async (protocol: RelaySyncProtocol, kind: number): Promise<RelaySyncOutcome> => {
        try {
            const result = await fetchRelayServerList({ ...context, kind });
            context.assertCurrent();
            if (!result.success) return { status: result.error === "not_found" ? "skipped" : "failed", reason: result.error };
            if (!result.servers.length) return { status: "skipped", reason: "empty_list" };
            if (protocol === "blossom") updates.blossom = result.servers;
            else updates.nip96 = await discoverServers(result.servers, context);
            context.assertCurrent();
            return { status: "success", count: result.servers.length };
        } catch (error) { return failure(error); }
    };
    const [blossom, nip96] = await Promise.all([run("blossom", BUD03_KIND), run("nip96", NIP96_KIND)]);
    context.assertCurrent();
    return { results: { blossom, nip96 }, updates };
}

export async function publishUploadRelayLists(context: SyncContext & { destinations: UploadDestination[]; getSigner: () => Promise<Signer> }): Promise<RelaySyncResults> {
    const enabled = context.destinations.filter(destination => destination.enabled);
    const blossom = enabled.filter(destination => destination.protocol === "blossom");
    const nip96 = enabled.filter(destination => destination.protocol === "nip96").map(destination =>
        resolveUploadDestinationForUse(destination, { pubkeyHex: context.pubkeyHex }));
    // Resolve concurrently with Blossom, but serialize signing to avoid overlapping signer prompts.
    const nip96Servers = (async () => {
        if (!nip96.length) return [];
        const candidates = nip96.map(destination => normalizeNip96ServerUrl(
            new URL(getNip96DiscoveryServer(destination)).origin));
        const resolved = await discoverServers(candidates, context);
        for (let i = 0; i < nip96.length; i++) {
            const destination = nip96[i];
            if (destination.nip96UrlMode !== "discovery" && resolved.find(server => server.serverUrl === candidates[i])?.apiUrl
                !== canonicalizeNip96UploadUrl(destination.resolvedUploadUrl || destination.serverUrl).url) {
                throw new Error("unresolved_server_url");
            }
        }
        return resolved.map(server => server.serverUrl);
    })().then(servers => ({ servers, error: null as unknown }), error => ({ servers: [] as string[], error }));
    const publish = async (kind: number, servers: string[]): Promise<RelaySyncOutcome> => {
        if (!servers.length) return { status: "skipped", reason: "no_enabled_servers" };
        try {
            context.assertCurrent();
            const signer = await context.getSigner();
            context.assertCurrent();
            const result = await publishRelayServerList({ ...context, signer, servers, kind,
                expectedPubkey: context.pubkeyHex, assertSession: context.assertCurrent });
            context.assertCurrent();
            return result.success ? { status: "success", count: servers.length } : { status: "failed", reason: "publish_failed" };
        } catch (error) { return failure(error); }
    };
    const blossomResult = await publish(BUD03_KIND, blossom.map(destination => destination.serverUrl));
    context.assertCurrent();
    const resolved = await nip96Servers;
    const nip96Result = resolved.error ? failure(resolved.error) : await publish(NIP96_KIND, resolved.servers);
    context.assertCurrent();
    return { blossom: blossomResult, nip96: nip96Result };
}
