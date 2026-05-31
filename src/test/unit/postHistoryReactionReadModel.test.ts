import { describe, expect, it, vi } from "vitest";
import type { PostHistoryChildInteractionRecord } from "../../lib/storage/ehagakiDb";
import {
    buildPostHistoryReactionReadModel,
    selectPostHistoryReactionRecords,
} from "../../lib/postHistoryReactionReadModel";

function createReactionRecord(
    overrides: Partial<PostHistoryChildInteractionRecord> & {
        eventId: string;
        authorPubkey: string;
        content: string;
        createdAt: number;
    },
): PostHistoryChildInteractionRecord {
    return {
        id: overrides.eventId,
        eventId: overrides.eventId,
        parentEventId: "parent-event",
        rootEventId: undefined,
        authorPubkey: overrides.authorPubkey,
        kind: overrides.kind ?? 7,
        content: overrides.content,
        tags: overrides.tags ?? [],
        createdAt: overrides.createdAt,
        relayUrls: overrides.relayUrls ?? [],
        discoveredAs: overrides.discoveredAs ?? ["reaction"],
        rawEvent: overrides.rawEvent ?? {
            id: overrides.eventId,
            pubkey: overrides.authorPubkey,
            kind: overrides.kind ?? 7,
            content: overrides.content,
            tags: overrides.tags ?? [],
            created_at: overrides.createdAt,
            sig: "sig",
        },
        fetchedAt: overrides.fetchedAt ?? 1000,
        updatedAt: overrides.updatedAt ?? 1000,
        schemaVersion: overrides.schemaVersion ?? 1,
    };
}

describe("postHistoryReactionReadModel", () => {
    it("groups reaction events by display content and attaches reactor profiles", () => {
        const records = [
            createReactionRecord({
                eventId: "reaction-1",
                authorPubkey: "a".repeat(64),
                content: "+",
                createdAt: 100,
            }),
            createReactionRecord({
                eventId: "reaction-2",
                authorPubkey: "b".repeat(64),
                content: "+",
                createdAt: 110,
            }),
            createReactionRecord({
                eventId: "reaction-3",
                authorPubkey: "c".repeat(64),
                content: ":blobcat:",
                tags: [["emoji", "blobcat", "https://example.com/blobcat.webp"]],
                createdAt: 120,
            }),
        ];

        expect(buildPostHistoryReactionReadModel(records, {
            ["a".repeat(64)]: {
                name: "alice",
                displayName: "Alice",
                picture: "https://example.com/alice.png",
                npub: "npub1alice",
                nprofile: "nprofile1alice",
            },
        })).toEqual({
            totalCount: 3,
            groups: [
                {
                    content: "+",
                    count: 2,
                    reactors: [
                        {
                            eventId: "reaction-1",
                            pubkey: "a".repeat(64),
                            profile: {
                                name: "alice",
                                displayName: "Alice",
                                picture: "https://example.com/alice.png",
                                npub: "npub1alice",
                                nprofile: "nprofile1alice",
                            },
                            createdAt: 100,
                        },
                        {
                            eventId: "reaction-2",
                            pubkey: "b".repeat(64),
                            profile: null,
                            createdAt: 110,
                        },
                    ],
                },
                {
                    content: ":blobcat:",
                    count: 1,
                    emojiUrl: "https://example.com/blobcat.webp",
                    reactors: [
                        {
                            eventId: "reaction-3",
                            pubkey: "c".repeat(64),
                            profile: null,
                            createdAt: 120,
                        },
                    ],
                },
            ],
        });
    });

    it("selector returns reaction records from the repository adapter", async () => {
        const records = [
            createReactionRecord({
                eventId: "reaction-1",
                authorPubkey: "a".repeat(64),
                content: "+",
                createdAt: 100,
            }),
        ];
        const adapter = {
            getReactionRecords: vi.fn(async () => records),
        };

        await expect(selectPostHistoryReactionRecords("parent-event", adapter)).resolves.toEqual(records);
        expect(adapter.getReactionRecords).toHaveBeenCalledWith("parent-event");
        await expect(selectPostHistoryReactionRecords("", adapter)).resolves.toEqual([]);
    });
});
