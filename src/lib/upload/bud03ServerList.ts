import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import type { Signer } from "nostr-tools/signer";
import {
    prepareSignedEventTemplate,
    validateSignedEventResult,
} from "../signedEventResultValidator";
import type { PostResult } from "../types";
import { PostEventSender } from "../postEventBuilder";
import { RelayConfigUtils } from "../relayConfigUtils";
import { normalizeNip96ServerUrl } from "./nip96ServerIdentity";
import { normalizeServerUrl } from "./uploadDestinationPresets";
import { awaitUploadOperation, throwIfUploadAborted } from "./uploadOperation";

export const BUD03_KIND = 10063;
export const NIP96_KIND = 10096;

export interface Bud03ServerListEvent {
    id?: string;
    kind: number;
    pubkey?: string;
    created_at?: number;
    content?: string;
    tags?: string[][];
}

export interface Bud03FetchResult {
    success: boolean;
    servers: string[];
    event?: Bud03ServerListEvent;
    error?: "not_found" | "network_error" | "request_error" | "timeout";
}

export function normalizeBud03ServerUrl(value: string): string | null {
    const normalized = normalizeServerUrl(value);
    if (!normalized) return null;

    try {
        const parsed = new URL(normalized);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null;
        }
        return parsed.toString().replace(/\/$/, "");
    } catch {
        return null;
    }
}

export function parseBud03ServerTags(tags: string[][]): string[] {
    const servers: string[] = [];
    const seen = new Set<string>();

    for (const tag of tags) {
        if (tag[0] !== "server" || typeof tag[1] !== "string") continue;
        const normalized = normalizeBud03ServerUrl(tag[1]);
        if (!normalized || seen.has(normalized)) continue;
        seen.add(normalized);
        servers.push(normalized);
    }

    return servers;
}

export function buildBud03EventTemplate(servers: string[], now = Math.floor(Date.now() / 1000)): {
    kind: typeof BUD03_KIND;
    content: string;
    tags: string[][];
    created_at: number;
} {
    const normalizedServers = servers
        .map((server) => normalizeBud03ServerUrl(server))
        .filter((server): server is string => !!server);
    const uniqueServers = [...new Set(normalizedServers)];

    if (uniqueServers.length === 0) {
        throw new Error("BUD-03 server list requires at least one server");
    }

    return {
        kind: BUD03_KIND,
        content: "",
        tags: uniqueServers.map((server) => ["server", server]),
        created_at: now,
    };
}

function getNewestBud03Event(events: Bud03ServerListEvent[], kind: number): Bud03ServerListEvent | null {
    return [...events]
        .filter((event) =>
            event.kind === kind
            && Array.isArray(event.tags)
            && typeof event.id === "string"
            && event.id.length > 0
            && Number.isSafeInteger(event.created_at)
            && (event.created_at ?? -1) >= 0
            && (event.created_at ?? 0) <= Math.floor(Date.now() / 1000)
            && (kind !== BUD03_KIND || parseBud03ServerTags(event.tags!).length > 0),
        )
        .filter(event => {
            if (kind !== NIP96_KIND) return true;
            try { parseNip96ServerTags(event.tags!); return true; } catch { return false; }
        })
        .sort((left, right) => {
            const createdAtDifference = (right.created_at ?? 0) - (left.created_at ?? 0);
            if (createdAtDifference !== 0) return createdAtDifference;
            return left.id! < right.id! ? -1 : left.id! > right.id! ? 1 : 0;
        })[0] ?? null;
}

export function fetchRelayServerList(params: {
    rxNostr: RxNostr;
    pubkeyHex: string;
    relays?: string[];
    timeoutMs?: number;
    kind: number;
    signal?: AbortSignal;
}): Promise<Bud03FetchResult> {
    const { rxNostr, pubkeyHex, relays, kind, signal, timeoutMs = 4000 } = params;
    const hasExplicitRelays = relays !== undefined;
    const sanitizedRelays = RelayConfigUtils.sanitizeExternalRelayUrls(relays);

    if (hasExplicitRelays && sanitizedRelays.length === 0) {
        return Promise.resolve({ success: false, servers: [], error: "not_found" });
    }

    return new Promise((resolve) => {
        const rxReq = createRxBackwardReq();
        const events: Bud03ServerListEvent[] = [];
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            signal?.removeEventListener("abort", onAbort);
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const safeResolve = (result: Bud03FetchResult) => {
            if (resolved) return;
            resolved = true;
            cleanup();
            resolve(result);
        };

        const onAbort = () => safeResolve({ success: false, servers: [], error: "request_error" });
        signal?.addEventListener("abort", onAbort, { once: true });
        if (signal?.aborted) { onAbort(); return; }

        const finish = () => {
            const event = getNewestBud03Event(events, kind);
            if (!event || !event.tags) {
                safeResolve({ success: false, servers: [], error: "not_found" });
                return;
            }

            try { safeResolve({
                success: true,
                servers: kind === BUD03_KIND ? parseBud03ServerTags(event.tags) : parseNip96ServerTags(event.tags),
                event,
            }); } catch { safeResolve({ success: false, servers: [], error: "request_error" }); }
        };

        try {
            timeoutId = setTimeout(() =>
                safeResolve({ success: false, servers: [], error: "timeout" }), timeoutMs);
            subscription = rxNostr.use(
                rxReq,
                hasExplicitRelays ? { on: { relays: sanitizedRelays } } : undefined,
            ).subscribe({
                next: (packet) => {
                    if (packet?.event?.kind === kind && packet.event.pubkey === pubkeyHex) {
                        events.push(packet.event);
                    }
                },
                complete: finish,
                error: () => safeResolve({ success: false, servers: [], error: "network_error" }),
            });

            if (resolved) { subscription?.unsubscribe?.(); return; }
            rxReq.emit({
                authors: [pubkeyHex],
                kinds: [kind],
                until: Math.floor(Date.now() / 1000),
                limit: 1,
            });
            rxReq.over();
        } catch {
            safeResolve({ success: false, servers: [], error: "request_error" });
        }
    });
}

export async function publishRelayServerList(params: {
    rxNostr: RxNostr;
    signer: Signer;
    servers: string[];
    relays?: string[];
    console?: Console;
    expectedPubkey?: string;
    assertSession?: () => void;
    kind: number;
    signal?: AbortSignal;
}): Promise<PostResult> {
    const template = params.kind === BUD03_KIND ? buildBud03EventTemplate(params.servers) : {
        ...buildBud03EventTemplate(params.servers.map(normalizeNip96ServerUrl)), kind: NIP96_KIND,
    };
    params.assertSession?.();
    throwIfUploadAborted(params.signal);
    const prepared = prepareSignedEventTemplate(template);
    const signedEvent = await awaitUploadOperation(params.signer.signEvent(prepared.signerTemplate), params.signal);
    throwIfUploadAborted(params.signal);
    params.assertSession?.();
    const event = params.expectedPubkey
        ? validateSignedEventResult(prepared.expectedTemplate, signedEvent, params.expectedPubkey)
        : signedEvent;
    params.assertSession?.();
    const sender = new PostEventSender(params.rxNostr, params.console ?? console);
    params.assertSession?.();
    return sender.sendEvent(event, {
        settleSignal: params.signal,
        targetRelays: params.relays,
        includeDefaultWriteRelays: true,
    });
}

export function parseNip96ServerTags(tags: string[][]): string[] {
    return [...new Set(tags.filter(tag => tag[0] === "server").map(tag => {
        if (typeof tag[1] !== "string") throw new Error("invalid_server_url");
        return normalizeNip96ServerUrl(tag[1]);
    }))];
}

export function fetchBud03ServerList(params: Omit<Parameters<typeof fetchRelayServerList>[0], "kind">): Promise<Bud03FetchResult> {
    return fetchRelayServerList({ ...params, kind: BUD03_KIND });
}

export function publishBud03ServerList(params: Omit<Parameters<typeof publishRelayServerList>[0], "kind">): Promise<PostResult> {
    return publishRelayServerList({ ...params, kind: BUD03_KIND });
}
