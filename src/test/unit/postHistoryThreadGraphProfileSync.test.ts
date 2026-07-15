import { describe, expect, it, vi } from "vitest";

vi.mock("svelte", async (importOriginal) => ({
    ...await importOriginal<typeof import("svelte")>(),
    onDestroy: vi.fn(),
}));

import {
    createPostHistoryProfileSyncCoordinator,
    type PostHistoryProfileSyncCoordinator,
} from "../../lib/postHistoryProfileSync";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import type { ProfileData } from "../../lib/types";
import { createPostHistoryThreadGraphHookHarness } from "../helpers/postHistoryThreadGraphHookHarness.svelte";

const authorPubkey = "a".repeat(64);
const otherPubkey = "b".repeat(64);

function createPost(
    eventId: string,
    pubkeyHex: string,
    parentEventId?: string,
): PostHistoryRecord {
    return {
        id: eventId,
        eventId,
        pubkeyHex,
        kind: 1,
        content: "post",
        tags: parentEventId ? [["e", parentEventId, "", "reply"]] : [],
        createdAt: 100,
        postedAt: 100_000,
        relayHints: ["wss://hint.example.com"],
        acceptedRelays: ["wss://accepted.example.com"],
        fetchedRelays: ["wss://fetched.example.com"],
        media: [],
        rawEvent: null,
        updatedAt: 100_000,
        schemaVersion: 1,
    };
}

function createProfile(displayName: string): ProfileData {
    return {
        name: "name",
        displayName,
        picture: `https://example.com/${displayName}.png`,
        npub: "npub1profile",
        nprofile: "nprofile1profile",
    };
}

function createProfileSync(
    cachedProfiles: Record<string, ProfileData> = {},
): PostHistoryProfileSyncCoordinator & {
    ensureProfile: ReturnType<typeof vi.fn>;
    publish: (pubkey: string, profile: ProfileData) => void;
    subscribeSpy: ReturnType<typeof vi.fn>;
} {
    let listener: ((pubkey: string, profile: ProfileData) => void) | null = null;
    const ensureProfile = vi.fn((pubkey: string) => {
        const cachedProfile = cachedProfiles[pubkey];
        if (cachedProfile) {
            listener?.(pubkey, cachedProfile);
        }
        return cachedProfile ?? null;
    });
    const subscribeSpy = vi.fn((nextListener) => {
        listener = nextListener;
        return () => {
            listener = null;
        };
    });

    return {
        ensureProfile,
        subscribe: subscribeSpy,
        reset: vi.fn(),
        dispose: vi.fn(),
        publish(pubkey, profile) {
            listener?.(pubkey, profile);
        },
        subscribeSpy,
    };
}

function createGraph(profileSyncCoordinator: PostHistoryProfileSyncCoordinator) {
    return createPostHistoryThreadGraphHookHarness({
        getShow: () => true,
        getPubkeyHex: () => authorPubkey,
        getRxNostr: () => undefined,
        getRelayConfig: () => null,
        profileSyncCoordinator,
        directReplyRecordsAdapterImpl: {
            getDirectReplyRecords: vi.fn().mockResolvedValue([]),
        },
        reactionRecordsAdapterImpl: {
            getReactionRecords: vi.fn().mockResolvedValue([]),
        },
        deletionRequestsRepositoryImpl: {
            getDeletedTargets: vi.fn().mockResolvedValue(new Map()),
            upsertValidDeletionRequests: vi.fn().mockResolvedValue(undefined),
        },
        childInteractionsRepositoryImpl: {
            upsertChildInteractions: vi.fn().mockResolvedValue(undefined),
            deleteChildInteractionByEventId: vi.fn().mockResolvedValue(undefined),
        },
        postHistoryRepositoryImpl: {
            getByEventId: vi.fn().mockResolvedValue(null),
        },
        relatedTargetResolver: {
            getScopeRevision: vi.fn(() => 0),
            getTargetSnapshot: vi.fn(() => null),
            ensureTarget: vi.fn(),
            invalidateScope: vi.fn(),
            reset: vi.fn(),
        } as never,
    });
}

describe("post history thread graph anchor profile sync", () => {
    it("registers an anchor author with the coordinator using the node relay URLs", async () => {
        const profileSync = createProfileSync();
        const { graph, dispose } = createGraph(profileSync);
        const anchor = createPost("1".repeat(64), authorPubkey);

        await graph.loadCachedChildInteractionStateForPosts([anchor]);

        expect(profileSync.ensureProfile).toHaveBeenCalledWith(authorPubkey, [
            "wss://hint.example.com/",
            "wss://accepted.example.com/",
            "wss://fetched.example.com/",
        ]);
        expect(profileSync.subscribeSpy).toHaveBeenCalledTimes(1);
        dispose();
    });

    it("applies a profile cached before the anchor node exists without another fetch", async () => {
        const cachedProfile = createProfile("Cached profile");
        const getProfile = vi.fn().mockResolvedValue(cachedProfile);
        const profileSync = createPostHistoryProfileSyncCoordinator({
            getShow: () => true,
            getRxNostr: () => undefined,
            profileCache: {
                getProfile,
                subscribe: vi.fn((_pubkey, callback) => {
                    callback(cachedProfile);
                    return vi.fn();
                }),
            },
        });
        profileSync.ensureProfile(authorPubkey, [
            "wss://hint.example.com",
            "wss://accepted.example.com",
            "wss://fetched.example.com",
        ]);
        const { graph, dispose } = createGraph(profileSync);
        const anchor = createPost("2".repeat(64), authorPubkey);
        const observer = createPost("3".repeat(64), otherPubkey, anchor.eventId);

        await graph.loadCachedChildInteractionStateForPosts([anchor]);

        expect(graph.getAnchorState(observer).parentNode?.profile).toEqual(cachedProfile);
        expect(getProfile).toHaveBeenCalledOnce();
        dispose();
    });

    it("updates every matching anchor node after a later profile notification", async () => {
        const profileSync = createProfileSync();
        const { graph, dispose } = createGraph(profileSync);
        const firstAnchor = createPost("4".repeat(64), authorPubkey);
        const secondAnchor = createPost("5".repeat(64), authorPubkey);
        const otherAnchor = createPost("6".repeat(64), otherPubkey);

        await graph.loadCachedChildInteractionStateForPosts([
            firstAnchor,
            secondAnchor,
            otherAnchor,
        ]);

        const updatedProfile = createProfile("Updated profile");
        profileSync.publish(authorPubkey, updatedProfile);

        const firstObserver = createPost("7".repeat(64), otherPubkey, firstAnchor.eventId);
        const secondObserver = createPost("8".repeat(64), otherPubkey, secondAnchor.eventId);
        const otherObserver = createPost("9".repeat(64), authorPubkey, otherAnchor.eventId);
        expect(graph.getAnchorState(firstObserver).parentNode?.profile).toEqual(updatedProfile);
        expect(graph.getAnchorState(secondObserver).parentNode?.profile).toEqual(updatedProfile);
        expect(graph.getAnchorState(otherObserver).parentNode?.profile).toBeNull();
        dispose();
    });
});
