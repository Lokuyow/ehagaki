import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    profileMetadataCache,
    profileMetadataCacheInternals,
} from "../../lib/profileMetadataCache.svelte";
import { BOOTSTRAP_RELAYS, FALLBACK_RELAYS } from "../../lib/constants";
import { profilesRepository } from "../../lib/storage/profilesRepository";
import type {
    ProfileEventCandidate,
    ProfileUpsertDecision,
    ProfileUpsertResult,
} from "../../lib/storage/profilesRepository";
import type { ProfileData } from "../../lib/types";

const repositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
    put: vi.fn(),
    upsertCandidate: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../lib/storage/profilesRepository", () => ({
    profilesRepository: repositoryMock,
}));

const pubkey = "a".repeat(64);
const otherPubkey = "b".repeat(64);
const eventId = "1".repeat(64);

function createProfile(overrides: Partial<ProfileData> = {}): ProfileData {
    return {
        name: "Cached",
        displayName: "Cached User",
        picture: "https://example.com/cached.png?profile=true",
        npub: "npub1cached",
        nprofile: "nprofile1cached",
        ...overrides,
    };
}

function createRxNostrReturningProfile(input: {
    content: Record<string, unknown>;
    createdAt: number;
    eventId?: string;
    relay?: string;
}) {
    const subscribe = vi.fn((observer: {
        next?: (packet: unknown) => void;
        complete?: () => void;
    }) => {
        observer.next?.({
            event: {
                id: input.eventId ?? eventId,
                kind: 0,
                pubkey,
                content: JSON.stringify(input.content),
                created_at: input.createdAt,
            },
            from: input.relay ?? "wss://relay.example.com/",
        });
        observer.complete?.();
        return {
            unsubscribe: vi.fn(),
        };
    });
    const use = vi.fn(() => ({ subscribe }));

    return {
        use,
        subscribe,
    };
}

function createRxNostrFromPackets(packets: Array<{
    content: Record<string, unknown>;
    createdAt: number;
    eventId?: string;
    relay?: string;
}>) {
    const subscribe = vi.fn((observer: {
        next?: (packet: unknown) => void;
        complete?: () => void;
    }) => {
        for (const packet of packets) {
            observer.next?.({
                event: {
                    id: packet.eventId ?? eventId,
                    kind: 0,
                    pubkey,
                    content: JSON.stringify(packet.content),
                    created_at: packet.createdAt,
                },
                from: packet.relay ?? "wss://relay.example.com/",
            });
        }
        observer.complete?.();
        return { unsubscribe: vi.fn() };
    });
    const use = vi.fn(() => ({ subscribe }));
    return { use, subscribe };
}

function createRxNostrWithoutProfile() {
    const subscribe = vi.fn((observer: { complete?: () => void }) => {
        observer.complete?.();
        return { unsubscribe: vi.fn() };
    });
    const use = vi.fn(() => ({ subscribe }));
    return { use, subscribe };
}

interface TierTestPacket {
    pubkey?: string;
    content: Record<string, unknown>;
    createdAt: number;
    eventId?: string;
    relay?: string;
}

function createTieredRxNostr(
    respond: (relays: string[], callIndex: number) => TierTestPacket[],
) {
    const calls: Array<{ relays: string[]; authors: string[] }> = [];
    const use = vi.fn((rxReq: { emit: (filter: { authors?: string[] }) => void }, options: {
        on: { relays: string[] };
    }) => {
        const call = {
            relays: [...options.on.relays],
            authors: [] as string[],
        };
        const callIndex = calls.push(call) - 1;
        const originalEmit = rxReq.emit.bind(rxReq);
        rxReq.emit = (filter) => {
            call.authors = [...(filter.authors ?? [])];
            originalEmit(filter);
        };

        return {
            subscribe: (observer: {
                next?: (packet: unknown) => void;
                complete?: () => void;
            }) => {
                queueMicrotask(() => {
                    for (const packet of respond(call.relays, callIndex)) {
                        observer.next?.({
                            event: {
                                id: packet.eventId ?? eventId,
                                kind: 0,
                                pubkey: packet.pubkey ?? pubkey,
                                content: JSON.stringify(packet.content),
                                created_at: packet.createdAt,
                            },
                            from: packet.relay ?? call.relays[0],
                        });
                    }
                    observer.complete?.();
                });
                return { unsubscribe: vi.fn() };
            },
        };
    });

    return { use, calls };
}

function createNonCompletingRxNostr() {
    const calls: Array<{ relays: string[]; authors: string[] }> = [];
    const use = vi.fn((rxReq: { emit: (filter: { authors?: string[] }) => void }, options: {
        on: { relays: string[] };
    }) => {
        const call = {
            relays: [...options.on.relays],
            authors: [] as string[],
        };
        calls.push(call);
        const originalEmit = rxReq.emit.bind(rxReq);
        rxReq.emit = (filter) => {
            call.authors = [...(filter.authors ?? [])];
            originalEmit(filter);
        };
        return {
            subscribe: () => ({ unsubscribe: vi.fn() }),
        };
    });
    return { use, calls };
}

function createErroringRxNostr() {
    const calls: Array<{ relays: string[]; authors: string[] }> = [];
    const use = vi.fn((rxReq: { emit: (filter: { authors?: string[] }) => void }, options: {
        on: { relays: string[] };
    }) => {
        const call = {
            relays: [...options.on.relays],
            authors: [] as string[],
        };
        calls.push(call);
        const originalEmit = rxReq.emit.bind(rxReq);
        rxReq.emit = (filter) => {
            call.authors = [...(filter.authors ?? [])];
            originalEmit(filter);
        };
        return {
            subscribe: (observer: { error?: (error: Error) => void }) => {
                queueMicrotask(() => observer.error?.(new Error("network failed")));
                return { unsubscribe: vi.fn() };
            },
        };
    });
    return { use, calls };
}

function createUpsertResult(
    candidate: ProfileEventCandidate,
    decision: ProfileUpsertDecision = "replaced",
    profile: ProfileData = candidate.profile,
): ProfileUpsertResult {
    const currentEventConfirmed = decision === "inserted"
        || decision === "replaced"
        || decision === "kept-existing"
        || decision === "merged-same-event";
    const acceptedProfile = {
        ...profile,
        fetchedAt: profile.fetchedAt ?? candidate.fetchedAt,
        updatedAtFromEvent: profile.updatedAtFromEvent ?? candidate.updatedAtFromEvent,
    };
    return {
        decision,
        acceptedRecord: {
            pubkeyHex: candidate.pubkeyHex,
            name: acceptedProfile.name,
            displayName: acceptedProfile.displayName,
            pictureUrl: acceptedProfile.picture,
            npub: acceptedProfile.npub,
            nprofile: acceptedProfile.nprofile,
            profileRelays: acceptedProfile.profileRelays,
            fetchedAt: acceptedProfile.fetchedAt!,
            updatedAtFromEvent: acceptedProfile.updatedAtFromEvent,
            sourceEventId: currentEventConfirmed ? candidate.sourceEventId : "0".repeat(64),
            updatedAt: Date.now(),
            schemaVersion: 2,
        },
        acceptedProfile,
        currentEventConfirmed,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
    });
    return { promise, resolve, reject };
}

async function flushProfileBatch(): Promise<void> {
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(31);
    await Promise.resolve();
}

async function createTemporaryEntry(input: {
    name?: string;
    createdAt?: number;
} = {}): Promise<ProfileData> {
    repositoryMock.get.mockRejectedValue(new Error("read failed"));
    repositoryMock.upsertCandidate.mockRejectedValueOnce(new Error("write failed"));
    const rxNostr = createRxNostrReturningProfile({
        content: { name: input.name ?? "Temporary" },
        createdAt: input.createdAt ?? 100,
        relay: "wss://temporary.example.com/",
    });

    const pending = profileMetadataCache.getProfile(pubkey, {
        rxNostr: rxNostr as never,
        forceRefresh: true,
    });
    await flushProfileBatch();
    const profile = await pending;
    if (!profile) {
        throw new Error("Temporary profile fixture was not created");
    }
    expect(profileMetadataCache.getReactiveEntry(pubkey)?.persistence).toBe("temporary");
    return profile;
}

describe("profileMetadataCache", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(1_000_000);
        profileMetadataCacheInternals.resetForTests();
        repositoryMock.get.mockReset();
        repositoryMock.put.mockReset();
        repositoryMock.upsertCandidate.mockReset();
        repositoryMock.delete.mockReset();
        repositoryMock.get.mockResolvedValue(null);
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => createUpsertResult(candidate),
        );
    });

    it("revalidates stale Dexie profiles after reload using the persisted fetchedAt", async () => {
        const staleFetchedAt = Date.now() - profileMetadataCacheInternals.PROFILE_CACHE_STALE_MS - 1;
        repositoryMock.get.mockResolvedValue(createProfile({
            fetchedAt: staleFetchedAt,
            updatedAtFromEvent: 10,
            profileRelays: ["wss://profile-relay.example.com/"],
        }));
        repositoryMock.put.mockResolvedValue(undefined);
        const rxNostr = createRxNostrReturningProfile({
            content: {
                name: "Fresh",
                display_name: "Fresh User",
                picture: "https://example.com/fresh.png",
            },
            createdAt: 20,
            relay: "wss://profile-relay.example.com/",
        });

        const seen: Array<ProfileData | null> = [];
        const unsubscribe = profileMetadataCache.subscribe(pubkey, (profile) => {
            seen.push(profile);
        });

        const initial = await profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            allowBackgroundRefresh: true,
        });
        await flushProfileBatch();

        expect(initial?.name).toBe("Cached");
        expect(rxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: { relays: BOOTSTRAP_RELAYS },
        });
        expect(profilesRepository.upsertCandidate).toHaveBeenCalledWith(
            pubkey,
            expect.objectContaining({
                pubkeyHex: pubkey,
                profile: expect.objectContaining({
                    name: "Fresh",
                    displayName: "Fresh User",
                }),
                sourceEventId: eventId,
                updatedAtFromEvent: 20,
                observedRelays: ["wss://profile-relay.example.com/"],
            }),
        );
        expect(seen.map((profile) => profile?.name)).toEqual(["Cached", "Cached", "Fresh"]);

        unsubscribe();
    });

    it("does not overwrite a newer cached profile with an older kind:0 event", async () => {
        repositoryMock.get.mockResolvedValue(createProfile({
            name: "Current",
            fetchedAt: Date.now() - profileMetadataCacheInternals.PROFILE_CACHE_STALE_MS - 1,
            updatedAtFromEvent: 30,
        }));
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => createUpsertResult(
                candidate,
                "rejected-older",
                createProfile({
                    name: "Current",
                    fetchedAt: Date.now() - profileMetadataCacheInternals.PROFILE_CACHE_STALE_MS - 1,
                    updatedAtFromEvent: 30,
                }),
            ),
        );
        const rxNostr = createRxNostrReturningProfile({
            content: {
                name: "Older",
                picture: "https://example.com/older.png",
            },
            createdAt: 20,
        });

        const result = await profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            allowBackgroundRefresh: true,
        });
        await flushProfileBatch();

        expect(result?.name).toBe("Current");
        expect(profilesRepository.upsertCandidate).toHaveBeenCalledTimes(2);
        expect((await profileMetadataCache.getProfile(pubkey))?.name).toBe("Current");
    });

    it("does not publish a network candidate before the repository accepts it", async () => {
        const deferred = createDeferred<ProfileUpsertResult>();
        let receivedCandidate: ProfileEventCandidate | null = null;
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => {
                receivedCandidate = candidate;
                return deferred.promise;
            },
        );
        const rxNostr = createRxNostrReturningProfile({
            content: { name: "Network" },
            createdAt: 20,
        });
        const seen: Array<ProfileData | null> = [];
        const unsubscribe = profileMetadataCache.subscribe(pubkey, (profile) => seen.push(profile));

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();

        expect(receivedCandidate).not.toBeNull();
        expect(seen).toEqual([]);
        deferred.resolve(createUpsertResult(receivedCandidate!));

        await expect(pending).resolves.toMatchObject({ name: "Network" });
        expect(seen.map((profile) => profile?.name)).toEqual(["Network"]);
        unsubscribe();
    });

    it("runs the legacy-compatible repository read before force-refresh network access", async () => {
        const deferredGet = createDeferred<ProfileData | null>();
        repositoryMock.get.mockReturnValue(deferredGet.promise);
        const rxNostr = createRxNostrReturningProfile({
            content: { name: "Network" },
            createdAt: 20,
        });

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await Promise.resolve();
        expect(profilesRepository.get).toHaveBeenCalledWith(pubkey);
        expect(rxNostr.use).not.toHaveBeenCalled();

        deferredGet.resolve(createProfile({ name: "Legacy" }));
        await flushProfileBatch();
        await expect(pending).resolves.toMatchObject({ name: "Network" });
        expect(repositoryMock.get.mock.invocationCallOrder[0]).toBeLessThan(
            rxNostr.use.mock.invocationCallOrder[0],
        );
    });

    it("keeps a persisted snapshot when force-refresh finds no network event", async () => {
        const snapshot = createProfile({
            name: "Persisted",
            fetchedAt: Date.now() - profileMetadataCacheInternals.PROFILE_CACHE_STALE_MS - 1,
            updatedAtFromEvent: 30,
        });
        repositoryMock.get.mockResolvedValue(snapshot);
        const rxNostr = createRxNostrWithoutProfile();

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({ name: "Persisted" });
        expect(profileMetadataCache.getReactiveEntry(pubkey)).toMatchObject({
            status: "hit",
            persistence: "persisted",
            profile: expect.objectContaining({ name: "Persisted" }),
        });
        expect(profilesRepository.upsertCandidate).not.toHaveBeenCalled();
    });

    it("keeps an existing snapshot when repository commit fails", async () => {
        repositoryMock.get.mockResolvedValue(createProfile({
            name: "Existing",
            updatedAtFromEvent: 30,
        }));
        repositoryMock.upsertCandidate.mockRejectedValue(new Error("write failed"));
        const rxNostr = createRxNostrReturningProfile({
            content: { name: "Uncommitted" },
            createdAt: 40,
        });
        const seen: Array<ProfileData | null> = [];
        const unsubscribe = profileMetadataCache.subscribe(pubkey, (profile) => seen.push(profile));

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({ name: "Existing" });
        expect(seen.map((profile) => profile?.name)).toEqual(["Existing"]);
        expect(profileMetadataCache.getReactiveEntry(pubkey)?.persistence).toBe("persisted");
        unsubscribe();
    });

    it("shows a temporary profile after DB failure without a snapshot and retries on the next fetch", async () => {
        repositoryMock.get.mockRejectedValue(new Error("read failed"));
        repositoryMock.upsertCandidate.mockRejectedValueOnce(new Error("write failed"));
        const rxNostr = createRxNostrReturningProfile({
            content: { name: "Temporary" },
            createdAt: 40,
            relay: "wss://temporary.example.com/",
        });

        const firstPending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(firstPending).resolves.toMatchObject({ name: "Temporary" });
        expect(profileMetadataCache.getReactiveEntry(pubkey)).toMatchObject({
            status: "hit",
            persistence: "temporary",
            profile: expect.objectContaining({
                name: "Temporary",
                profileRelays: ["wss://temporary.example.com/"],
            }),
        });

        const seen: string[] = [];
        const unsubscribe = profileMetadataCache.subscribe(pubkey, (profile) => {
            if (profile) seen.push(profile.name);
        });
        const second = await profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
        });
        expect(second?.name).toBe("Temporary");
        expect(seen).toEqual(["Temporary"]);
        await flushProfileBatch();

        expect(profilesRepository.upsertCandidate).toHaveBeenCalledTimes(3);
        expect(profileMetadataCache.getReactiveEntry(pubkey)?.persistence).toBe("persisted");
        expect(seen).toEqual(["Temporary"]);
        unsubscribe();
    });

    it("persists a temporary profile into an empty DB before a network miss", async () => {
        const temporaryProfile = await createTemporaryEntry({
            name: "Temporary to persist",
            createdAt: 100,
        });
        let storedProfile: ProfileData | null = null;
        repositoryMock.get.mockResolvedValue(null);
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => {
                storedProfile = candidate.profile;
                return createUpsertResult(candidate, "inserted");
            },
        );
        const rxNostr = createRxNostrWithoutProfile();

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toEqual(temporaryProfile);
        expect(storedProfile).toEqual(temporaryProfile);
        expect(profilesRepository.upsertCandidate).toHaveBeenLastCalledWith(
            pubkey,
            expect.objectContaining({
                pubkeyHex: pubkey,
                profile: temporaryProfile,
                sourceEventId: eventId,
                updatedAtFromEvent: 100,
                observedRelays: ["wss://temporary.example.com/"],
                fetchedAt: profileMetadataCache.getReactiveEntry(pubkey)?.fetchedAtMs,
            }),
        );
        expect(profileMetadataCache.getReactiveEntry(pubkey)).toMatchObject({
            status: "hit",
            persistence: "persisted",
            profile: expect.objectContaining({ name: "Temporary to persist" }),
        });
    });

    it("converges a temporary profile to a newer DB profile before a network miss", async () => {
        await createTemporaryEntry({ name: "Temporary 100", createdAt: 100 });
        const dbProfile = createProfile({
            name: "Database 200",
            fetchedAt: 900_000,
            updatedAtFromEvent: 200,
            profileRelays: ["wss://database.example.com/"],
        });
        repositoryMock.get.mockResolvedValue(dbProfile);
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => createUpsertResult(
                candidate,
                "rejected-older",
                dbProfile,
            ),
        );
        const rxNostr = createRxNostrWithoutProfile();

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toEqual(dbProfile);
        expect(profileMetadataCache.getReactiveEntry(pubkey)).toMatchObject({
            status: "hit",
            persistence: "persisted",
            profile: expect.objectContaining({
                name: "Database 200",
                updatedAtFromEvent: 200,
            }),
        });
        await expect(profileMetadataCache.getProfile(pubkey)).resolves.toMatchObject({
            name: "Database 200",
        });
    });

    it("keeps a temporary profile when DB recovery still fails and network misses", async () => {
        const temporaryProfile = await createTemporaryEntry({
            name: "Still temporary",
            createdAt: 100,
        });
        repositoryMock.get.mockRejectedValue(new Error("read still failed"));
        repositoryMock.upsertCandidate.mockRejectedValue(new Error("write still failed"));
        const rxNostr = createRxNostrWithoutProfile();

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toEqual(temporaryProfile);
        expect(profileMetadataCache.getReactiveEntry(pubkey)).toMatchObject({
            status: "hit",
            persistence: "temporary",
            profile: expect.objectContaining({ name: "Still temporary" }),
        });
    });

    it("does not notify a newer DB profile before temporary re-upsert commits", async () => {
        await createTemporaryEntry({ name: "Temporary 100", createdAt: 100 });
        const dbProfile = createProfile({
            name: "Database 200",
            fetchedAt: 900_000,
            updatedAtFromEvent: 200,
        });
        const deferred = createDeferred<ProfileUpsertResult>();
        let receivedCandidate: ProfileEventCandidate | null = null;
        repositoryMock.get.mockResolvedValue(dbProfile);
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => {
                receivedCandidate = candidate;
                return deferred.promise;
            },
        );
        const rxNostr = createRxNostrWithoutProfile();
        const seen: string[] = [];
        const unsubscribe = profileMetadataCache.subscribe(pubkey, (profile) => {
            if (profile) seen.push(profile.name);
        });

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(receivedCandidate).not.toBeNull();
        expect(seen).toEqual(["Temporary 100"]);
        expect(rxNostr.use).not.toHaveBeenCalled();

        deferred.resolve(createUpsertResult(
            receivedCandidate!,
            "rejected-older",
            dbProfile,
        ));
        await flushProfileBatch();

        await expect(pending).resolves.toEqual(dbProfile);
        expect(seen).toEqual(["Temporary 100", "Database 200"]);
        unsubscribe();
    });

    it("stops after the bootstrap tier when the repository confirms the event", async () => {
        const contextRelay = "wss://context.example.com/";
        const rxNostr = createTieredRxNostr((relays) => (
            relays.includes(BOOTSTRAP_RELAYS[0])
                ? [{ content: { name: "Bootstrap" }, createdAt: 100 }]
                : []
        ));

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({ name: "Bootstrap" });
        expect(rxNostr.calls).toEqual([{
            relays: BOOTSTRAP_RELAYS,
            authors: [pubkey],
        }]);
    });

    it("moves from bootstrap to contextual relays and stops before fallback", async () => {
        const contextRelay = "wss://context.example.com/";
        const rxNostr = createTieredRxNostr((relays) => (
            relays.includes(contextRelay)
                ? [{ content: { name: "Context" }, createdAt: 100 }]
                : []
        ));

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({ name: "Context" });
        expect(rxNostr.calls.map((call) => call.relays)).toEqual([
            BOOTSTRAP_RELAYS,
            [contextRelay],
        ]);
    });

    it("continues after an older bootstrap event and adopts a newer contextual event", async () => {
        const contextRelay = "wss://context.example.com/";
        const currentProfile = createProfile({
            name: "Database 200",
            fetchedAt: 900_000,
            updatedAtFromEvent: 200,
        });
        repositoryMock.get.mockResolvedValue(currentProfile);
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => (
                candidate.updatedAtFromEvent < 200
                    ? createUpsertResult(candidate, "rejected-older", currentProfile)
                    : createUpsertResult(candidate, "replaced")
            ),
        );
        const rxNostr = createTieredRxNostr((relays) => {
            if (relays.includes(BOOTSTRAP_RELAYS[0])) {
                return [{
                    content: { name: "Bootstrap 100" },
                    createdAt: 100,
                    eventId: "2".repeat(64),
                }];
            }
            if (relays.includes(contextRelay)) {
                return [{
                    content: { name: "Context 300" },
                    createdAt: 300,
                    eventId: "3".repeat(64),
                }];
            }
            return [];
        });

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({
            name: "Context 300",
            updatedAtFromEvent: 300,
        });
        expect(rxNostr.calls.map((call) => call.relays)).toEqual([
            BOOTSTRAP_RELAYS,
            [contextRelay],
        ]);
        expect(profilesRepository.upsertCandidate).toHaveBeenCalledTimes(2);
    });

    it("continues to fallback after a contextual event loses the tie-break", async () => {
        const contextRelay = "wss://context.example.com/";
        const currentProfile = createProfile({
            name: "Database 200",
            fetchedAt: 900_000,
            updatedAtFromEvent: 200,
        });
        repositoryMock.get.mockResolvedValue(currentProfile);
        repositoryMock.upsertCandidate.mockImplementation(
            async (_pubkey: string, candidate: ProfileEventCandidate) => (
                candidate.profile.name === "Context tie loser"
                    ? createUpsertResult(candidate, "rejected-tie-break", currentProfile)
                    : createUpsertResult(candidate, "replaced")
            ),
        );
        const rxNostr = createTieredRxNostr((relays) => {
            if (relays.includes(contextRelay)) {
                return [{
                    content: { name: "Context tie loser" },
                    createdAt: 200,
                    eventId: "f".repeat(64),
                }];
            }
            if (relays.includes(FALLBACK_RELAYS[0])) {
                return [{
                    content: { name: "Fallback 300" },
                    createdAt: 300,
                    eventId: "3".repeat(64),
                }];
            }
            return [];
        });

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({
            name: "Fallback 300",
            updatedAtFromEvent: 300,
        });
        expect(rxNostr.calls.map((call) => call.relays)).toEqual([
            BOOTSTRAP_RELAYS,
            [contextRelay],
            [...FALLBACK_RELAYS].sort(),
        ]);
        expect(profilesRepository.upsertCandidate).toHaveBeenCalledTimes(2);
    });

    it("queries only unresolved pubkeys in the next tier", async () => {
        const contextRelay = "wss://context.example.com/";
        const rxNostr = createTieredRxNostr((relays) => {
            if (relays.includes(BOOTSTRAP_RELAYS[0])) {
                return [{
                    pubkey,
                    content: { name: "Bootstrap A" },
                    createdAt: 100,
                }];
            }
            if (relays.includes(contextRelay)) {
                return [
                    {
                        pubkey,
                        content: { name: "Ignored A" },
                        createdAt: 200,
                        eventId: "2".repeat(64),
                    },
                    {
                        pubkey: otherPubkey,
                        content: { name: "Context B" },
                        createdAt: 100,
                        eventId: "3".repeat(64),
                    },
                ];
            }
            return [];
        });

        const pending = profileMetadataCache.getProfiles([pubkey, otherPubkey], {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({
            [pubkey]: { name: "Bootstrap A" },
            [otherPubkey]: { name: "Context B" },
        });
        expect(rxNostr.calls.map((call) => call.authors)).toEqual([
            [pubkey, otherPubkey],
            [otherPubkey],
        ]);
        expect(profilesRepository.upsertCandidate).toHaveBeenCalledTimes(2);
    });

    it("queries different contextual relay sets without leaking authors between them", async () => {
        const relayA = "wss://a-context.example.com/";
        const relayB = "wss://b-context.example.com/";
        const rxNostr = createTieredRxNostr((relays) => {
            if (relays.includes(relayA)) {
                return [{ pubkey, content: { name: "A" }, createdAt: 100 }];
            }
            if (relays.includes(relayB)) {
                return [{ pubkey: otherPubkey, content: { name: "B" }, createdAt: 100 }];
            }
            return [];
        });

        const pendingA = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [relayA],
            forceRefresh: true,
        });
        const pendingB = profileMetadataCache.getProfile(otherPubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [relayB],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(Promise.all([pendingA, pendingB])).resolves.toMatchObject([
            { name: "A" },
            { name: "B" },
        ]);
        expect(rxNostr.calls).toEqual([
            { relays: BOOTSTRAP_RELAYS, authors: [pubkey, otherPubkey] },
            { relays: [relayA], authors: [pubkey] },
            { relays: [relayB], authors: [otherPubkey] },
        ]);
    });

    it("batches pubkeys that have the same contextual relay set", async () => {
        const sharedRelay = "wss://shared-context.example.com/";
        const rxNostr = createTieredRxNostr((relays) => (
            relays.includes(sharedRelay)
                ? [
                    { pubkey, content: { name: "A" }, createdAt: 100 },
                    { pubkey: otherPubkey, content: { name: "B" }, createdAt: 100 },
                ]
                : []
        ));

        const pendingA = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [sharedRelay],
            forceRefresh: true,
        });
        const pendingB = profileMetadataCache.getProfile(otherPubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [sharedRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();
        await Promise.all([pendingA, pendingB]);

        expect(rxNostr.calls).toEqual([
            { relays: BOOTSTRAP_RELAYS, authors: [pubkey, otherPubkey] },
            { relays: [sharedRelay], authors: [pubkey, otherPubkey] },
        ]);
    });

    it("applies the contextual relay limit per pubkey instead of across the batch", async () => {
        const relaysA = Array.from({ length: 12 }, (_, index) => `wss://a${index}.example.com/`);
        const relaysB = Array.from({ length: 12 }, (_, index) => `wss://b${index}.example.com/`);
        const rxNostr = createTieredRxNostr((relays) => {
            if (relays.includes(relaysA[0])) {
                return [{ pubkey, content: { name: "A" }, createdAt: 100 }];
            }
            if (relays.includes(relaysB[0])) {
                return [{ pubkey: otherPubkey, content: { name: "B" }, createdAt: 100 }];
            }
            return [];
        });

        const pendingA = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: relaysA,
            forceRefresh: true,
        });
        const pendingB = profileMetadataCache.getProfile(otherPubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: relaysB,
            forceRefresh: true,
        });
        await flushProfileBatch();
        await Promise.all([pendingA, pendingB]);

        expect(rxNostr.calls[1]).toMatchObject({ authors: [pubkey] });
        expect(rxNostr.calls[1].relays).toHaveLength(12);
        expect(rxNostr.calls[2]).toMatchObject({ authors: [otherPubkey] });
        expect(rxNostr.calls[2].relays).toHaveLength(12);
    });

    it("stops after a persistence failure and preserves an existing snapshot", async () => {
        const contextRelay = "wss://context.example.com/";
        const snapshot = createProfile({ name: "Snapshot", updatedAtFromEvent: 90 });
        repositoryMock.get.mockResolvedValue(snapshot);
        repositoryMock.upsertCandidate.mockRejectedValue(new Error("db unavailable"));
        const rxNostr = createTieredRxNostr((relays) => (
            relays.includes(BOOTSTRAP_RELAYS[0])
                ? [{ content: { name: "Network" }, createdAt: 100 }]
                : []
        ));

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject(snapshot);
        expect(rxNostr.calls).toHaveLength(1);
        expect(profileMetadataCache.getReactiveEntry(pubkey)?.persistence).toBe("persisted");
    });

    it("stops after a persistence failure and exposes a temporary profile without a snapshot", async () => {
        const contextRelay = "wss://context.example.com/";
        repositoryMock.upsertCandidate.mockRejectedValue(new Error("db unavailable"));
        const rxNostr = createTieredRxNostr((relays) => (
            relays.includes(BOOTSTRAP_RELAYS[0])
                ? [{ content: { name: "Temporary" }, createdAt: 100 }]
                : []
        ));

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toMatchObject({ name: "Temporary" });
        expect(rxNostr.calls).toHaveLength(1);
        expect(profileMetadataCache.getReactiveEntry(pubkey)?.persistence).toBe("temporary");
    });

    it("returns persistence-unavailable as the explicit DB failure stop reason", async () => {
        repositoryMock.upsertCandidate.mockRejectedValue(new Error("db unavailable"));
        const profile = createProfile({ name: "Temporary" });

        const resolution = await profileMetadataCacheInternals.applyTierNetworkResult(pubkey, {
            profile,
            metadataRaw: JSON.stringify({ name: "Temporary" }),
            sourceEventCreatedAtSec: 100,
            sourceEventId: eventId,
            sourceRelay: BOOTSTRAP_RELAYS[0],
            observedRelays: [BOOTSTRAP_RELAYS[0]],
            rejectedFutureTimestamp: false,
            parseError: false,
            networkError: false,
        }, []);

        expect(resolution.stopReason).toBe("persistence-unavailable");
    });

    it("uses one four-second deadline for the whole tier search", async () => {
        const contextRelay = "wss://context.example.com/";
        const rxNostr = createNonCompletingRxNostr();
        const startedAt = Date.now();
        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();
        await vi.advanceTimersByTimeAsync(
            profileMetadataCacheInternals.PROFILE_CACHE_BATCH_TIMEOUT_MS,
        );

        await expect(pending).resolves.toBeNull();
        expect(Date.now() - startedAt).toBeLessThanOrEqual(
            profileMetadataCacheInternals.PROFILE_CACHE_BATCH_TIMEOUT_MS + 31,
        );
        expect(rxNostr.calls).toEqual([{
            relays: BOOTSTRAP_RELAYS,
            authors: [pubkey],
        }]);
    });

    it("fails soft after network errors in every tier", async () => {
        const contextRelay = "wss://context.example.com/";
        const rxNostr = createErroringRxNostr();
        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [contextRelay],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toBeNull();
        expect(rxNostr.calls.map((call) => call.relays)).toEqual([
            BOOTSTRAP_RELAYS,
            [contextRelay],
            [...FALLBACK_RELAYS].sort(),
        ]);
        expect(profileMetadataCache.getReactiveEntry(pubkey)).toMatchObject({
            status: "negative",
            profile: null,
        });
    });

    it("creates a negative entry only after all available tiers miss", async () => {
        const contextRelay = "wss://context.example.com/";
        const rxNostr = createTieredRxNostr(() => []);

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            additionalRelays: [
                BOOTSTRAP_RELAYS[0],
                FALLBACK_RELAYS[0],
                contextRelay,
            ],
            forceRefresh: true,
        });
        await flushProfileBatch();

        await expect(pending).resolves.toBeNull();
        expect(rxNostr.calls.map((call) => call.relays)).toEqual([
            BOOTSTRAP_RELAYS,
            [contextRelay, FALLBACK_RELAYS[0]].sort(),
            FALLBACK_RELAYS.slice(1).sort(),
        ]);
        expect(profileMetadataCache.getReactiveEntry(pubkey)).toMatchObject({
            status: "negative",
            profile: null,
        });
    });

    it("passes all relays that observed the selected event to the repository", async () => {
        const rxNostr = createRxNostrFromPackets([
            {
                content: { name: "Observed" },
                createdAt: 20,
                relay: "wss://one.example.com/",
            },
            {
                content: { name: "Observed" },
                createdAt: 20,
                relay: "wss://two.example.com/",
            },
        ]);

        const pending = profileMetadataCache.getProfile(pubkey, {
            rxNostr: rxNostr as never,
            forceRefresh: true,
        });
        await flushProfileBatch();
        await pending;

        expect(profilesRepository.upsertCandidate).toHaveBeenCalledWith(
            pubkey,
            expect.objectContaining({
                sourceEventId: eventId,
                observedRelays: [
                    "wss://one.example.com/",
                    "wss://two.example.com/",
                ],
            }),
        );
    });
});
