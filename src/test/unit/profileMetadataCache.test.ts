import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    profileMetadataCache,
    profileMetadataCacheInternals,
} from "../../lib/profileMetadataCache.svelte";
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
            on: { relays: ["wss://profile-relay.example.com/"] },
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
        expect(profilesRepository.upsertCandidate).toHaveBeenCalledOnce();
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
