import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { BOOTSTRAP_RELAYS } from "./relayLists";
import { RelayConfigParser, RelayConfigUtils } from "./relayConfigUtils";
import { getHostReadRelayDefaults, isHostRelayConfigActive } from "./hostRelayRuntime";
import type { RelayConfig } from "./types";

const LOOKUP_TIMEOUT_MS = 3_000;
const SUCCESS_TTL_MS = 5 * 60_000;
const NEGATIVE_TTL_MS = 15_000;
const MAX_CONCURRENT_LOOKUPS = 4;

export type Nip65RelayLookupStatus = "found" | "empty" | "not-found" | "network-error";

export interface Nip65RelayDirectoryEntry {
    pubkey: string;
    status: Nip65RelayLookupStatus;
    readRelays: string[];
    writeRelays: string[];
    createdAt: number | null;
    eventId: string | null;
}

interface CachedEntry {
    entry: Nip65RelayDirectoryEntry;
    expiresAt: number;
}

interface Kind10002Event {
    id: string;
    pubkey: string;
    kind: 10002;
    created_at: number;
    tags: unknown[][];
}

function isKind10002Event(value: unknown, pubkey: string): value is Kind10002Event {
    if (!value || typeof value !== "object") return false;
    const event = value as Partial<Kind10002Event>;
    return event.kind === 10002
        && event.pubkey === pubkey
        && typeof event.id === "string"
        && /^[0-9a-f]{64}$/i.test(event.id)
        && typeof event.created_at === "number"
        && Number.isSafeInteger(event.created_at)
        && event.created_at >= 0
        && Array.isArray(event.tags);
}

function compareLatest(left: Kind10002Event, right: Kind10002Event): number {
    if (left.created_at !== right.created_at) {
        return right.created_at - left.created_at;
    }
    return left.id.localeCompare(right.id);
}

function createEmptyEntry(pubkey: string, status: Nip65RelayLookupStatus): Nip65RelayDirectoryEntry {
    return {
        pubkey,
        status,
        readRelays: [],
        writeRelays: [],
        createdAt: null,
        eventId: null,
    };
}

export class Nip65RelayDirectory {
    private readonly cache = new Map<string, CachedEntry>();
    private readonly inFlight = new Map<string, Promise<Nip65RelayDirectoryEntry>>();
    private readonly queue: Array<() => void> = [];
    private activeLookups = 0;

    constructor(
        private readonly rxNostr: RxNostr,
        private readonly now: () => number = Date.now,
        private readonly setTimeoutFn: typeof setTimeout = setTimeout,
        private readonly clearTimeoutFn: typeof clearTimeout = clearTimeout,
    ) {}

    lookup(pubkey: string): Promise<Nip65RelayDirectoryEntry> {
        const cached = this.cache.get(pubkey);
        if (cached && cached.expiresAt > this.now()) {
            return Promise.resolve(cached.entry);
        }
        if (cached) this.cache.delete(pubkey);

        const active = this.inFlight.get(pubkey);
        if (active) return active;

        const promise = this.withConcurrencySlot(() => this.fetchLatest(pubkey))
            .then((entry) => {
                this.cache.set(pubkey, {
                    entry,
                    expiresAt: this.now() + (
                        entry.status === "found" ? SUCCESS_TTL_MS : NEGATIVE_TTL_MS
                    ),
                });
                return entry;
            })
            .finally(() => this.inFlight.delete(pubkey));
        this.inFlight.set(pubkey, promise);
        return promise;
    }

    private async withConcurrencySlot<T>(run: () => Promise<T>): Promise<T> {
        if (this.activeLookups >= MAX_CONCURRENT_LOOKUPS) {
            await new Promise<void>((resolve) => this.queue.push(resolve));
        }
        this.activeLookups += 1;
        try {
            return await run();
        } finally {
            this.activeLookups -= 1;
            this.queue.shift()?.();
        }
    }

    private fetchLatest(pubkey: string): Promise<Nip65RelayDirectoryEntry> {
        const discoveryRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            isHostRelayConfigActive()
                ? getHostReadRelayDefaults()
                : BOOTSTRAP_RELAYS,
        );
        if (discoveryRelays.length === 0) {
            return Promise.resolve(createEmptyEntry(pubkey, "network-error"));
        }

        return new Promise((resolve) => {
            const request = createRxBackwardReq();
            const events = new Map<string, Kind10002Event>();
            let subscription: { unsubscribe?: () => void } | undefined;
            let timer: ReturnType<typeof setTimeout> | undefined;
            let settled = false;

            const cleanup = () => {
                if (timer !== undefined) {
                    this.clearTimeoutFn(timer);
                    timer = undefined;
                }
                subscription?.unsubscribe?.();
                subscription = undefined;
            };

            const finish = (networkError = false) => {
                if (settled) return;
                settled = true;
                cleanup();
                const latest = [...events.values()].sort(compareLatest)[0];
                if (!latest) {
                    resolve(createEmptyEntry(pubkey, networkError ? "network-error" : "not-found"));
                    return;
                }

                const relayConfig: RelayConfig = RelayConfigParser.parseKind10002Tags(latest.tags);
                const readRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
                    RelayConfigUtils.extractReadRelays(relayConfig),
                );
                const writeRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
                    RelayConfigUtils.extractWriteRelays(relayConfig),
                );
                resolve({
                    pubkey,
                    status: readRelays.length || writeRelays.length ? "found" : "empty",
                    readRelays,
                    writeRelays,
                    createdAt: latest.created_at,
                    eventId: latest.id,
                });
            };

            try {
                subscription = this.rxNostr.use(request, {
                    on: { relays: discoveryRelays },
                }).subscribe({
                    next: (packet: { event?: unknown }) => {
                        if (settled || !isKind10002Event(packet.event, pubkey)) return;
                        events.set(packet.event.id, packet.event);
                    },
                    complete: () => finish(),
                    error: () => finish(true),
                });

                timer = this.setTimeoutFn(() => finish(events.size === 0), LOOKUP_TIMEOUT_MS);
                request.emit({
                    authors: [pubkey],
                    kinds: [10002],
                    until: Math.floor(this.now() / 1_000),
                    limit: 1,
                });
                request.over();
            } catch {
                finish(true);
            }
        });
    }
}

const directoriesByRxNostr = new WeakMap<RxNostr, Nip65RelayDirectory>();

export function getNip65RelayDirectory(rxNostr: RxNostr): Nip65RelayDirectory {
    let directory = directoriesByRxNostr.get(rxNostr);
    if (!directory) {
        directory = new Nip65RelayDirectory(rxNostr);
        directoriesByRxNostr.set(rxNostr, directory);
    }
    return directory;
}
