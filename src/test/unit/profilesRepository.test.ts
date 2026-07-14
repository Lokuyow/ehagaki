import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "../../lib/constants";
import {
    EHAGAKI_DB_NAME,
    EHagakiDB,
    type ProfileRecord,
} from "../../lib/storage/ehagakiDb";
import {
    DexieProfilesRepository,
    type ProfileEventCandidate,
} from "../../lib/storage/profilesRepository";
import type { ProfileData } from "../../lib/types";

const PUBKEY = "1".repeat(64);
const OTHER_PUBKEY = "2".repeat(64);
const LOWER_EVENT_ID = "a".repeat(64);
const HIGHER_EVENT_ID = "b".repeat(64);
const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-profiles-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function createProfile(overrides: Partial<ProfileData> = {}): ProfileData {
    return {
        name: "alice",
        displayName: "Alice",
        picture: "https://example.com/alice.png",
        npub: "npub1alice",
        nprofile: "nprofile1alice",
        ...overrides,
    };
}

function createCandidate(
    overrides: Partial<Omit<ProfileEventCandidate, "profile">> & {
        profile?: Partial<ProfileData>;
    } = {},
): ProfileEventCandidate {
    return {
        pubkeyHex: overrides.pubkeyHex ?? PUBKEY,
        profile: createProfile(overrides.profile),
        sourceEventId: overrides.sourceEventId ?? LOWER_EVENT_ID,
        updatedAtFromEvent: overrides.updatedAtFromEvent ?? 100,
        observedRelays: overrides.observedRelays ?? [],
        fetchedAt: overrides.fetchedAt ?? 1_000,
    };
}

function createRecord(overrides: Partial<ProfileRecord> = {}): ProfileRecord {
    return {
        pubkeyHex: PUBKEY,
        name: "existing",
        displayName: "Existing",
        pictureUrl: "https://example.com/existing.png",
        npub: "npub1existing",
        nprofile: "nprofile1existing",
        fetchedAt: 900,
        updatedAt: 900,
        schemaVersion: 1,
        ...overrides,
    };
}

afterEach(async () => {
    vi.restoreAllMocks();
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexieProfilesRepository.upsertCandidate", () => {
    it("inserts a first candidate and merges normalized profile and observed relays", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db, () => 2_000);

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            profile: {
                profileRelays: [
                    "wss://Relay-One.example.com////",
                    "https://invalid.example.com/",
                ],
            },
            observedRelays: [
                "wss://relay-one.example.com/",
                "ws://relay-two.example.com/path",
                "bad relay",
            ],
        }));

        expect(result.decision).toBe("inserted");
        expect(result.currentEventConfirmed).toBe(true);
        expect(result.acceptedRecord).toMatchObject({
            pubkeyHex: PUBKEY,
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
            fetchedAt: 1_000,
            profileRelays: [
                "wss://relay-one.example.com/",
                "ws://relay-two.example.com/path",
            ],
            schemaVersion: 2,
        });
        expect(result.acceptedProfile?.profileRelays).toEqual(result.acceptedRecord?.profileRelays);
        await expect(repository.getRecord(PUBKEY)).resolves.toEqual(result.acceptedRecord);
    });

    it("replaces an older event and saves only the new candidate relay context", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db, () => 2_000);
        await db.profiles.put(createRecord({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
            profileRelays: ["wss://old.example.com/"],
        }));

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            sourceEventId: HIGHER_EVENT_ID,
            updatedAtFromEvent: 101,
            profile: {
                name: "new",
                nprofile: "nprofile1new",
                profileRelays: ["wss://profile.example.com"],
            },
            observedRelays: ["wss://observed.example.com"],
        }));

        expect(result.decision).toBe("replaced");
        expect(result.currentEventConfirmed).toBe(true);
        expect(result.acceptedRecord).toMatchObject({
            name: "new",
            nprofile: "nprofile1new",
            sourceEventId: HIGHER_EVENT_ID,
            profileRelays: [
                "wss://profile.example.com/",
                "wss://observed.example.com/",
            ],
        });
    });

    it("rejects an older event and returns the accepted existing profile", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db);
        const existing = createRecord({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 200,
        });
        await db.profiles.put(existing);

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            sourceEventId: HIGHER_EVENT_ID,
            updatedAtFromEvent: 100,
        }));

        expect(result.decision).toBe("rejected-older");
        expect(result.currentEventConfirmed).toBe(false);
        expect(result.acceptedRecord).toEqual(existing);
        expect(result.acceptedProfile?.name).toBe("existing");
    });

    it("uses the lower event id as the NIP-01 tie-break winner", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db, () => 2_000);
        await db.profiles.put(createRecord({
            sourceEventId: HIGHER_EVENT_ID,
            updatedAtFromEvent: 100,
        }));

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
        }));

        expect(result.decision).toBe("replaced");
        expect(result.currentEventConfirmed).toBe(true);
        expect(result.acceptedRecord?.sourceEventId).toBe(LOWER_EVENT_ID);
    });

    it("rejects the higher event id when timestamps are equal", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db);
        const existing = createRecord({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
        });
        await db.profiles.put(existing);

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            sourceEventId: HIGHER_EVENT_ID,
            updatedAtFromEvent: 100,
        }));

        expect(result.decision).toBe("rejected-tie-break");
        expect(result.currentEventConfirmed).toBe(false);
        expect(result.acceptedRecord).toEqual(existing);
    });

    it("keeps an unchanged copy of the same event", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db);
        const existing = createRecord({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
            fetchedAt: 1_000,
            profileRelays: ["wss://existing.example.com/"],
        });
        await db.profiles.put(existing);

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            fetchedAt: 1_000,
            observedRelays: ["wss://existing.example.com"],
        }));

        expect(result.decision).toBe("kept-existing");
        expect(result.currentEventConfirmed).toBe(true);
        expect(result.acceptedRecord).toEqual(existing);
    });

    it("merges relay information and a later fetchedAt for the same event", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db, () => 2_000);
        await db.profiles.put(createRecord({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
            fetchedAt: 1_000,
            profileRelays: ["wss://existing.example.com/"],
            nprofile: "nprofile1preserved",
        }));

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            fetchedAt: 1_100,
            profile: {
                nprofile: "nprofile1must-not-replace",
                profileRelays: ["wss://profile.example.com"],
            },
            observedRelays: ["wss://observed.example.com"],
        }));

        expect(result.decision).toBe("merged-same-event");
        expect(result.currentEventConfirmed).toBe(true);
        expect(result.acceptedRecord).toMatchObject({
            nprofile: "nprofile1preserved",
            fetchedAt: 1_100,
            updatedAt: 2_000,
            schemaVersion: 2,
            profileRelays: [
                "wss://existing.example.com/",
                "wss://profile.example.com/",
                "wss://observed.example.com/",
            ],
        });
        expect(result.acceptedProfile?.profileRelays).toEqual(result.acceptedRecord?.profileRelays);
    });

    it("rejects pubkey mismatches and malformed candidates", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db);

        const mismatch = await repository.upsertCandidate(PUBKEY, createCandidate({
            pubkeyHex: OTHER_PUBKEY,
        }));
        const invalidId = await repository.upsertCandidate(PUBKEY, createCandidate({
            sourceEventId: "invalid",
        }));
        const invalidTime = await repository.upsertCandidate(PUBKEY, createCandidate({
            updatedAtFromEvent: -1,
        }));

        for (const result of [mismatch, invalidId, invalidTime]) {
            expect(result.decision).toBe("rejected-invalid");
            expect(result.currentEventConfirmed).toBe(false);
            expect(result.acceptedRecord).toBeNull();
            expect(result.acceptedProfile).toBeNull();
        }
        await expect(repository.getRecord(PUBKEY)).resolves.toBeNull();
    });

    it.each([1, 2])("replaces a schemaVersion %s record without complete event identity", async (schemaVersion) => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db, () => 2_000);
        await db.profiles.put(createRecord({
            schemaVersion,
            updatedAtFromEvent: 500,
            sourceEventId: undefined,
        }));

        const result = await repository.upsertCandidate(PUBKEY, createCandidate({
            updatedAtFromEvent: 100,
        }));

        expect(result.decision).toBe("replaced");
        expect(result.currentEventConfirmed).toBe(true);
        expect(result.acceptedRecord).toMatchObject({
            sourceEventId: LOWER_EVENT_ID,
            updatedAtFromEvent: 100,
            schemaVersion: 2,
        });
    });

    it("does not roll back when candidates for one pubkey are upserted concurrently", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db, () => 2_000);

        await Promise.all([
            repository.upsertCandidate(PUBKEY, createCandidate({
                sourceEventId: LOWER_EVENT_ID,
                updatedAtFromEvent: 100,
                profile: { name: "older" },
            })),
            repository.upsertCandidate(PUBKEY, createCandidate({
                sourceEventId: HIGHER_EVENT_ID,
                updatedAtFromEvent: 200,
                profile: { name: "newer" },
            })),
        ]);

        await expect(repository.getRecord(PUBKEY)).resolves.toMatchObject({
            name: "newer",
            sourceEventId: HIGHER_EVENT_ID,
            updatedAtFromEvent: 200,
        });
    });
});

describe("DexieProfilesRepository compatibility APIs", () => {
    it("keeps put, get, and delete compatible while writing schemaVersion 2 without event identity", async () => {
        const db = createTestDb();
        const removeItem = vi.fn();
        const repository = new DexieProfilesRepository(db, () => 1_234, () => ({
            getItem: () => null,
            removeItem,
        }));
        const profile = createProfile({
            profileRelays: ["wss://relay.example.com/"],
            fetchedAt: 1_000,
            updatedAtFromEvent: 900,
        });

        await repository.put(PUBKEY, profile);

        await expect(repository.get(PUBKEY)).resolves.toEqual(profile);
        const storedRecord = await repository.getRecord(PUBKEY);
        expect(storedRecord).toMatchObject({
            schemaVersion: 2,
            updatedAtFromEvent: 900,
        });
        expect(storedRecord?.sourceEventId).toBeUndefined();

        await repository.delete(PUBKEY);
        await expect(repository.getRecord(PUBKEY)).resolves.toBeNull();
        expect(removeItem).toHaveBeenCalledWith(STORAGE_KEYS.NOSTR_PROFILE + PUBKEY);
    });

    it("keeps legacy localStorage fallback and promotion inside get", async () => {
        const db = createTestDb();
        const legacyProfile = createProfile({ fetchedAt: 1_000 });
        const getItem = vi.fn((key: string) => (
            key === STORAGE_KEYS.NOSTR_PROFILE + PUBKEY
                ? JSON.stringify(legacyProfile)
                : null
        ));
        const repository = new DexieProfilesRepository(db, () => 1_234, () => ({
            getItem,
            removeItem: vi.fn(),
        }));

        await expect(repository.get(PUBKEY)).resolves.toEqual(legacyProfile);
        expect(getItem).toHaveBeenCalledWith(STORAGE_KEYS.NOSTR_PROFILE + PUBKEY);
        const promotedRecord = await repository.getRecord(PUBKEY);
        expect(promotedRecord).toMatchObject({
            name: "alice",
            schemaVersion: 2,
        });
        expect(promotedRecord?.sourceEventId).toBeUndefined();
    });

    it("returns null from getRecord only when the IndexedDB record is absent", async () => {
        const db = createTestDb();
        const getItem = vi.fn(() => JSON.stringify(createProfile()));
        const repository = new DexieProfilesRepository(db, Date.now, () => ({
            getItem,
            removeItem: vi.fn(),
        }));

        await expect(repository.getRecord(PUBKEY)).resolves.toBeNull();
        expect(getItem).not.toHaveBeenCalled();
    });

    it("propagates IndexedDB access failures from getRecord without reading legacy storage", async () => {
        const db = createTestDb();
        const getItem = vi.fn(() => JSON.stringify(createProfile()));
        const repository = new DexieProfilesRepository(db, Date.now, () => ({
            getItem,
            removeItem: vi.fn(),
        }));
        const failure = new Error("IndexedDB unavailable");
        vi.spyOn(db.profiles, "get").mockRejectedValueOnce(failure);

        await expect(repository.getRecord(PUBKEY)).rejects.toBe(failure);
        expect(getItem).not.toHaveBeenCalled();
    });
});
