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
    receivedAt: number;
    expiresAt: number;
    searchedSources: Set<string>;
}

interface InFlightLookup {
    promise: Promise<Nip65RelayDirectoryEntry>;
    pendingSources: Set<string>;
    coveredSources: Set<string>;
    searchedSources: Set<string>;
    candidates: Map<string, { entry: Nip65RelayDirectoryEntry; receivedAt: number }>;
    candidateListeners: Set<() => void>;
    previous: { entry: Nip65RelayDirectoryEntry; receivedAt: number } | undefined;
    started: boolean;
    activeBatches: number;
    hadNetworkError: boolean;
    completedAt: number | undefined;
    finish: () => void;
    done: boolean;
}

export interface Nip65RelayLookupOptions {
    discoveryRelays?: string[];
    /** Absolute consumer deadline, including time spent waiting for a lookup slot. */
    deadlineAt?: number;
    /** Publishing can use the latest known Read route while discovery continues. */
    resolveOnReadRoute?: boolean;
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

function copyEntry(entry: Nip65RelayDirectoryEntry): Nip65RelayDirectoryEntry {
    return { ...entry, readRelays: [...entry.readRelays], writeRelays: [...entry.writeRelays] };
}

function parseRelayList(event: Kind10002Event): Nip65RelayDirectoryEntry {
    const relayConfig: RelayConfig = RelayConfigParser.parseKind10002Tags(event.tags);
    const readRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
        RelayConfigUtils.extractReadRelays(relayConfig),
    );
    const writeRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
        RelayConfigUtils.extractWriteRelays(relayConfig),
    );
    return {
        pubkey: event.pubkey,
        status: readRelays.length || writeRelays.length ? "found" : "empty",
        readRelays,
        writeRelays,
        createdAt: event.created_at,
        eventId: event.id,
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
        private readonly setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>
            = (fn, ms) => setTimeout(fn, ms),
        private readonly clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void
            = (id) => clearTimeout(id),
    ) {}

    lookup(
        pubkey: string,
        options: Nip65RelayLookupOptions = {},
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
            this.launchPendingSources(pubkey, active);
            return this.forConsumer(pubkey, active, options);
        }
        if (cacheIsFresh) {
            const unseenSources = requestedSources.filter(
                (relay) => !cached!.searchedSources.has(relay),
            );
            if (unseenSources.length === 0) {
                return Promise.resolve(options.deadlineAt !== undefined && cached!.receivedAt >= options.deadlineAt
                    ? createEmptyEntry(pubkey, "network-error")
                    : copyEntry(cached!.entry));
            }
            const flight = this.startLookup(pubkey, unseenSources, cached);
            return this.forConsumer(pubkey, flight, options);
        }

        const sourcesToRefresh = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...requestedSources,
            ...(cached ? [...cached.searchedSources] : []),
        ]);
        const flight = this.startLookup(pubkey, sourcesToRefresh, cached);
        return this.forConsumer(pubkey, flight, options);
    }

    private startLookup(
        pubkey: string,
        sources: string[],
        previous: CachedEntry | undefined,
    ): InFlightLookup {
        let resolveCompletion!: (entry: Nip65RelayDirectoryEntry) => void;
        const completion = new Promise<Nip65RelayDirectoryEntry>((resolve) => {
            resolveCompletion = resolve;
        });
        const flight: InFlightLookup = {
            promise: completion,
            pendingSources: new Set(sources),
            coveredSources: new Set(),
            searchedSources: new Set(previous?.searchedSources ?? []),
            candidates: new Map(),
            candidateListeners: new Set(),
            previous: previous?.entry.createdAt != null
                ? { entry: copyEntry(previous.entry), receivedAt: previous.receivedAt }
                : undefined,
            started: false,
            activeBatches: 0,
            hadNetworkError: sources.length === 0,
            completedAt: undefined,
            finish: () => {
                if (flight.done) return;
                flight.done = true;
                flight.completedAt = this.now();
                const entry = this.snapshot(pubkey, flight);
                this.cache.set(pubkey, {
                    entry: copyEntry(entry),
                    receivedAt: entry.eventId === flight.previous?.entry.eventId
                        ? flight.previous.receivedAt
                        : flight.candidates.get(entry.eventId!)?.receivedAt ?? this.now(),
                    expiresAt: this.now() + (entry.status === "found" ? SUCCESS_TTL_MS : NEGATIVE_TTL_MS),
                    searchedSources: new Set(flight.searchedSources),
                });
                resolveCompletion(entry);
            },
            done: false,
        };
        this.inFlight.set(pubkey, flight);
        flight.promise = this.withConcurrencySlot(async () => {
            flight.started = true;
            this.launchPendingSources(pubkey, flight);
            return completion;
        }).finally(() => {
            if (this.inFlight.get(pubkey) === flight) this.inFlight.delete(pubkey);
        });
        return flight;
    }

    private launchPendingSources(pubkey: string, flight: InFlightLookup): void {
        if (!flight.started || flight.done) return;
        const sources = [...flight.pendingSources];
        flight.pendingSources.clear();
        if (sources.length === 0) {
            if (flight.activeBatches === 0) flight.finish();
            return;
        }
        sources.forEach((relay) => {
            flight.coveredSources.add(relay);
            flight.searchedSources.add(relay);
        });
        flight.activeBatches += 1;
        void this.fetchLatest(pubkey, sources, (entry, receivedAt) => {
            if (!flight.candidates.has(entry.eventId!)) {
                flight.candidates.set(entry.eventId!, { entry, receivedAt });
                flight.candidateListeners.forEach((listener) => listener());
            }
        }).then((entry) => {
            flight.hadNetworkError ||= entry.status === "network-error";
            flight.activeBatches -= 1;
            this.launchPendingSources(pubkey, flight);
        });
    }

    private snapshot(pubkey: string, flight: InFlightLookup, deadlineAt = Infinity): Nip65RelayDirectoryEntry {
        let best = flight.previous && flight.previous.receivedAt < deadlineAt
            ? flight.previous.entry
            : undefined;
        for (const { entry, receivedAt } of flight.candidates.values()) {
            if (receivedAt < deadlineAt && this.isNewer(entry, best)) best = entry;
        }
        if (best) return copyEntry(best);
        const completedInTime = flight.completedAt !== undefined && flight.completedAt < deadlineAt;
        return createEmptyEntry(pubkey, flight.hadNetworkError || !completedInTime ? "network-error" : "not-found");
    }

    private forConsumer(
        pubkey: string,
        flight: InFlightLookup,
        options: Nip65RelayLookupOptions,
    ): Promise<Nip65RelayDirectoryEntry> {
        const deadlineAt = options.deadlineAt ?? Infinity;
        if (options.deadlineAt === undefined && !options.resolveOnReadRoute) return flight.promise;
        if (deadlineAt <= this.now()) return Promise.resolve(this.snapshot(pubkey, flight, deadlineAt));
        return new Promise((resolve) => {
            let settled = false;
            let timer: ReturnType<typeof setTimeout> | undefined;
            const finish = () => {
                if (settled) return;
                settled = true;
                if (timer !== undefined) this.clearTimeoutFn(timer);
                flight.candidateListeners.delete(checkRoute);
                resolve(this.snapshot(pubkey, flight, deadlineAt));
            };
            const checkRoute = () => {
                if (this.snapshot(pubkey, flight, deadlineAt).readRelays.length > 0) finish();
            };
            if (options.resolveOnReadRoute) {
                flight.candidateListeners.add(checkRoute);
                checkRoute();
            }
            if (!settled && Number.isFinite(deadlineAt)) {
                timer = this.setTimeoutFn(finish, deadlineAt - this.now());
            }
            // A consumer deadline never completes or cancels another consumer's shared discovery.
            void flight.promise.then(finish);
        });
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
        } else {
            this.activeLookups += 1;
        }
        try {
            return await run();
        } finally {
            const next = this.queue.shift();
            if (next) next();
            else this.activeLookups -= 1;
        }
    }

    private fetchLatest(
        pubkey: string,
        discoveryRelays: string[],
        onCandidate: (entry: Nip65RelayDirectoryEntry, receivedAt: number) => void,
    ): Promise<Nip65RelayDirectoryEntry> {
        if (discoveryRelays.length === 0) {
            return Promise.resolve(createEmptyEntry(pubkey, "network-error"));
        }

        return new Promise((resolve) => {
            const request = createRxBackwardReq();
            let latest: Nip65RelayDirectoryEntry | undefined;
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
                if (!latest) {
                    resolve(createEmptyEntry(pubkey, networkError ? "network-error" : "not-found"));
                    return;
                }

                resolve(latest);
            };

            try {
                timer = this.setTimeoutFn(() => finish(!latest), LOOKUP_TIMEOUT_MS);
                const activeSubscription = this.rxNostr.use(request, {
                    on: { relays: discoveryRelays },
                }).subscribe({
                    next: (packet: { event?: unknown }) => {
                        if (settled || !isKind10002Event(packet.event, pubkey)) return;
                        const receivedAt = this.now();
                        const candidate = parseRelayList(packet.event);
                        onCandidate(candidate, receivedAt);
                        if (this.isNewer(candidate, latest)) latest = candidate;
                    },
                    complete: () => finish(),
                    error: () => finish(true),
                });
                if (settled) {
                    activeSubscription.unsubscribe?.();
                    return;
                }
                subscription = activeSubscription;
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
