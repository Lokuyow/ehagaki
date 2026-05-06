import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import type { Signer } from "nostr-tools/signer";
import type { PostResult } from "../types";
import { PostEventSender } from "../postEventBuilder";
import { normalizeServerUrl } from "./uploadDestinationPresets";

export const BUD03_KIND = 10063;

export interface Bud03ServerListEvent {
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

function getNewestBud03Event(events: Bud03ServerListEvent[]): Bud03ServerListEvent | null {
    return [...events]
        .filter((event) => event.kind === BUD03_KIND && Array.isArray(event.tags))
        .sort((left, right) => (right.created_at ?? 0) - (left.created_at ?? 0))[0] ?? null;
}

export function fetchBud03ServerList(params: {
    rxNostr: RxNostr;
    pubkeyHex: string;
    relays?: string[];
    timeoutMs?: number;
}): Promise<Bud03FetchResult> {
    const { rxNostr, pubkeyHex, relays, timeoutMs = 4000 } = params;

    return new Promise((resolve) => {
        const rxReq = createRxBackwardReq();
        const events: Bud03ServerListEvent[] = [];
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const safeResolve = (result: Bud03FetchResult) => {
            if (resolved) return;
            resolved = true;
            cleanup();
            resolve(result);
        };

        const finish = () => {
            const event = getNewestBud03Event(events);
            if (!event || !event.tags) {
                safeResolve({ success: false, servers: [], error: "not_found" });
                return;
            }

            safeResolve({
                success: true,
                servers: parseBud03ServerTags(event.tags),
                event,
            });
        };

        try {
            timeoutId = setTimeout(() =>
                safeResolve({ success: false, servers: [], error: "timeout" }), timeoutMs);
            subscription = rxNostr.use(rxReq, relays?.length ? { on: { relays } } : undefined).subscribe({
                next: (packet: any) => {
                    if (packet?.event?.kind === BUD03_KIND && packet.event.pubkey === pubkeyHex) {
                        events.push(packet.event as Bud03ServerListEvent);
                    }
                },
                complete: finish,
                error: () => safeResolve({ success: false, servers: [], error: "network_error" }),
            });

            rxReq.emit({
                authors: [pubkeyHex],
                kinds: [BUD03_KIND],
                until: Math.floor(Date.now() / 1000),
                limit: 1,
            });
            rxReq.over();
        } catch {
            safeResolve({ success: false, servers: [], error: "request_error" });
        }
    });
}

export async function publishBud03ServerList(params: {
    rxNostr: RxNostr;
    signer: Signer;
    servers: string[];
    relays?: string[];
    console?: Console;
}): Promise<PostResult> {
    const template = buildBud03EventTemplate(params.servers);
    const event = await params.signer.signEvent(template);
    const sender = new PostEventSender(params.rxNostr, params.console ?? console);
    return sender.sendEvent(event, {
        additionalWriteRelays: params.relays,
    });
}
