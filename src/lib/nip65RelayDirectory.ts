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
    searchedSources: Set<string>;
}

interface InFlightLookup {
    promise: Promise<Nip65RelayDirectoryEntry>;
    pendingSources: Set<string>;
    coveredSources: Set<string>;
    done: boolean;
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
    private readonly inFlight = new Map<string, InFlightLookup>();
    private readonly queue: Array<() => void> = [];
    private activeLookups = 0;

    constructor(
        private readonly rxNostr: RxNostr,
        private readonly now: () => number = Date.now,
        private readonly setTimeoutFn: typeof setTimeout = setTimeout,
        private readonly clearTimeoutFn: typeof clearTimeout = clearTimeout,
    ) {}

    lookup(
        pubkey: string,
        options: { discoveryRelays?: string[] } = {},
    ): Promise<Nip65RelayDirectoryEntry> {
        const baseSources = RelayConfigUtils.sanitizeExternalRelayUrls(
            isHostRelayConfigActive()
                ? getHostReadRelayDefaults()
                : BOOTSTRAP_RELAYS,
        );
        const requestedSources = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...baseSources,
            ...(options.discoveryRelays ?? []),
        ]);
        const cached = this.cache.get(pubkey);
        const cacheIsFresh = !!cached && cached.expiresAt > this.now();
        const active = this.inFlight.get(pubkey);
        if (active && !active.done) {
            const alreadyCovered = new Set([
                ...(cacheIsFresh ? cached!.searchedSources : []),
                ...active.coveredSources,
                ...active.pendingSources,
            ]);
            requestedSources
                .filter((relay) => !alreadyCovered.has(relay))
                .forEach((relay) => active.pendingSources.add(relay));
            return active.promise;
        }
        if (cacheIsFresh) {
            const unseenSources = requestedSources.filter(
                (relay) => !cached!.searchedSources.has(relay),
            );
            if (unseenSources.length === 0) return Promise.resolve(cached!.entry);
            return this.startLookup(pubkey, unseenSources, cached);
        }

        const sourcesToRefresh = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...requestedSources,
            ...(cached ? [...cached.searchedSources] : []),
        ]);
        return this.startLookup(pubkey, sourcesToRefresh, cached);
    }

    private startLookup(
        pubkey: string,
        sources: string[],
        previous: CachedEntry | undefined,
    ): Promise<Nip65RelayDirectoryEntry> {
        const flight: InFlightLookup = {
            promise: Promise.resolve(createEmptyEntry(pubkey, "not-found")),
            pendingSources: new Set(sources),
            coveredSources: new Set(),
            done: false,
        };
        flight.pendingSources.forEach((relay) => flight.coveredSources.add(relay));
        const searchedSources = new Set(previous?.searchedSources ?? []);
        let best = previous?.entry.createdAt !== null && previous?.entry.createdAt !== undefined
            ? previous.entry
            : undefined;
        let hadNetworkError = sources.length === 0;

        flight.promise = this.withConcurrencySlot(async () => {
            while (flight.pendingSources.size > 0) {
                const batch = [...flight.pendingSources];
                flight.pendingSources.clear();
                batch.forEach((relay) => {
                    searchedSources.add(relay);
                    flight.coveredSources.add(relay);
                });
                const candidate = await this.fetchLatest(pubkey, batch);
                hadNetworkError ||= candidate.status === "network-error";
                if (candidate.createdAt !== null && this.isNewer(candidate, best)) {
                    best = candidate;
                }
            }

            const entry = best ?? createEmptyEntry(
                pubkey,
                hadNetworkError ? "network-error" : "not-found",
            );
            const cacheEntry: CachedEntry = {
                entry,
                expiresAt: this.now() + (
                    entry.status === "found" ? SUCCESS_TTL_MS : NEGATIVE_TTL_MS
                ),
                searchedSources,
            };
            this.cache.set(pubkey, cacheEntry);
            flight.done = true;
            return entry;
        }).finally(() => {
            if (this.inFlight.get(pubkey) === flight) this.inFlight.delete(pubkey);
        });
        this.inFlight.set(pubkey, flight);
        return flight.promise;
    }

    private isNewer(
        candidate: Nip65RelayDirectoryEntry,
        current: Nip65RelayDirectoryEntry | undefined,
    ): boolean {
        if (!current || current.createdAt === null || current.eventId === null) return true;
        if (candidate.createdAt === null || candidate.eventId === null) return false;
        if (candidate.createdAt !== current.createdAt) return candidate.createdAt > current.createdAt;
        return candidate.eventId.localeCompare(current.eventId) < 0;
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

    private fetchLatest(pubkey: string, discoveryRelays: string[]): Promise<Nip65RelayDirectoryEntry> {
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
