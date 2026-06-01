import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    profileMetadataCache,
    profileMetadataCacheInternals,
} from "../../lib/profileMetadataCache.svelte";
import { profilesRepository } from "../../lib/storage/profilesRepository";
import type { ProfileData } from "../../lib/types";

const repositoryMock = vi.hoisted(() => ({
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../lib/storage/profilesRepository", () => ({
    profilesRepository: repositoryMock,
}));

const pubkey = "a".repeat(64);

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
    relay?: string;
}) {
    const subscribe = vi.fn((observer: {
        next?: (packet: unknown) => void;
        complete?: () => void;
    }) => {
        observer.next?.({
            event: {
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

async function flushProfileBatch(): Promise<void> {
    await vi.advanceTimersByTimeAsync(31);
    await Promise.resolve();
}

describe("profileMetadataCache", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(1_000_000);
        profileMetadataCacheInternals.resetForTests();
        repositoryMock.get.mockReset();
        repositoryMock.put.mockReset();
        repositoryMock.delete.mockReset();
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
        expect(profilesRepository.put).toHaveBeenCalledWith(
            pubkey,
            expect.objectContaining({
                name: "Fresh",
                displayName: "Fresh User",
                updatedAtFromEvent: 20,
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
        repositoryMock.put.mockResolvedValue(undefined);
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
        expect(profilesRepository.put).not.toHaveBeenCalled();
        expect((await profileMetadataCache.getProfile(pubkey))?.name).toBe("Current");
    });
});
