import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { describe, expect, it } from "vitest";
import type {
    PostHistoryDeletionRequestRecord,
    PostHistoryRecord,
} from "../../lib/storage/ehagakiDb";
import { PostHistoryJsonlExportService } from "../../lib/postHistoryJsonlExportService";
import { PostHistoryJsonlImportService } from "../../lib/postHistoryJsonlImportService";

function createEvent(
    secretKey: Uint8Array,
    input: { kind: number; content: string; created_at: number; tags?: string[][] },
) {
    return finalizeEvent({
        kind: input.kind,
        content: input.content,
        created_at: input.created_at,
        tags: input.tags ?? [],
    }, secretKey);
}

function createPostRecord(event: ReturnType<typeof finalizeEvent>): PostHistoryRecord {
    return {
        id: event.id,
        eventId: event.id,
        pubkeyHex: event.pubkey,
        kind: event.kind,
        content: event.content,
        tags: event.tags,
        createdAt: event.created_at,
        postedAt: event.created_at * 1000,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: event,
        updatedAt: 1,
        schemaVersion: 2,
    };
}

function createDeletionRecord(
    event: ReturnType<typeof finalizeEvent>,
    targetEventId: string,
    targetAuthorPubkey: string,
    rawEvent: unknown = event,
): PostHistoryDeletionRequestRecord {
    return {
        id: `${targetAuthorPubkey}:${targetEventId}:${event.id}`,
        targetAuthorPubkey,
        targetEventId,
        deletionEventId: event.id,
        deletionEventPubkey: event.pubkey,
        targetVerified: true,
        deletedAt: event.created_at,
        reason: null,
        rawEvent,
        relayUrls: [],
        fetchedAt: 1,
        updatedAt: 1,
        schemaVersion: 2,
    };
}

function createFile(content: string): Pick<File, "stream" | "size"> {
    const bytes = new TextEncoder().encode(content);
    return {
        size: bytes.byteLength,
        stream: () => new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(bytes);
                controller.close();
            },
        }),
    } as Pick<File, "stream" | "size">;
}

describe("PostHistoryJsonlExportService", () => {
    it("現在のアカウントのkind 1/42とkind 5を安定順で1行ずつ出力する", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const otherSecretKey = generateSecretKey();
        const post42 = createEvent(secretKey, {
            kind: 42,
            content: "channel post",
            created_at: 20,
        });
        const post1 = createEvent(secretKey, {
            kind: 1,
            content: "plain post",
            created_at: 10,
        });
        const otherPost = createEvent(otherSecretKey, {
            kind: 1,
            content: "other account",
            created_at: 1,
        });
        const deletion = createEvent(secretKey, {
            kind: 5,
            content: "",
            created_at: 5,
            tags: [["e", post1.id]],
        });
        const post1Record = createPostRecord(post1);
        post1Record.rawEvent = {
            ...post1,
            acceptedRelays: ["wss://local-only.example.com/"],
            schemaVersion: 2,
        };
        const duplicateRecord = createDeletionRecord(deletion, post42.id, pubkey);
        const service = new PostHistoryJsonlExportService({
            postHistoryRepository: {
                getAll: async () => [
                    createPostRecord(post42),
                    post1Record,
                    createPostRecord(otherPost),
                ],
            },
            deletionRequestsRepository: {
                getAllForTargetAuthorPubkey: async () => [
                    createDeletionRecord(deletion, post1.id, pubkey),
                    duplicateRecord,
                ],
            },
        });

        const result = await service.exportForPubkey(pubkey);
        const events = result.jsonl.trim().split("\n").map((line) => JSON.parse(line));

        expect(result).toMatchObject({
            exportedEventCount: 3,
            exportedPostEventCount: 2,
            exportedDeletionEventCount: 1,
            isPartial: false,
        });
        expect(events.map((event) => [event.kind, event.created_at])).toEqual([
            [1, 10],
            [42, 20],
            [5, 5],
        ]);
        expect(result.jsonl.endsWith("\n")).toBe(true);
        expect(result.jsonl).not.toContain("relayHints");
        expect(result.jsonl).not.toContain("schemaVersion");
        expect(result.jsonl).not.toContain("updatedAt");
    });

    it("raw欠落・不整合を出力せず部分結果として返す", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const post = createEvent(secretKey, {
            kind: 1,
            content: "post",
            created_at: 10,
        });
        const deletion = createEvent(secretKey, {
            kind: 5,
            content: "",
            created_at: 20,
            tags: [["e", post.id]],
        });
        const service = new PostHistoryJsonlExportService({
            postHistoryRepository: {
                getAll: async () => [
                    { ...createPostRecord(post), content: "tampered" },
                ],
            },
            deletionRequestsRepository: {
                getAllForTargetAuthorPubkey: async () => [
                    createDeletionRecord(deletion, post.id, pubkey, null),
                ],
            },
        });

        const result = await service.exportForPubkey(pubkey);

        expect(result.jsonl).toBe("");
        expect(result.skippedPostCount).toBe(1);
        expect(result.missingDeletionRawEventCount).toBe(1);
        expect(result.isPartial).toBe(true);
    });

    it("生成したJSONLを既存importへ渡すround-tripでkind 1/42/5を受理できる", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const post = createEvent(secretKey, {
            kind: 1,
            content: "round-trip post",
            created_at: 10,
        });
        const channelPost = createEvent(secretKey, {
            kind: 42,
            content: "round-trip channel",
            created_at: 20,
        });
        const deletion = createEvent(secretKey, {
            kind: 5,
            content: "",
            created_at: 30,
            tags: [["e", post.id]],
        });
        const exportService = new PostHistoryJsonlExportService({
            postHistoryRepository: {
                getAll: async () => [createPostRecord(post), createPostRecord(channelPost)],
            },
            deletionRequestsRepository: {
                getAllForTargetAuthorPubkey: async () => [
                    createDeletionRecord(deletion, post.id, pubkey),
                ],
            },
        });
        const exported = await exportService.exportForPubkey(pubkey);
        const importedPosts: string[] = [];
        const importedDeletions: string[] = [];
        const importService = new PostHistoryJsonlImportService({
            postHistoryRepository: {
                upsertFetchedEvents: async ({ events }) => {
                    importedPosts.push(...events.map((item) => item.event.id));
                    return {
                        insertedCount: events.length,
                        updatedCount: 0,
                        unchangedCount: 0,
                        appliedDeletionCount: 0,
                    };
                },
            },
            deletionRequestsRepository: {
                upsertImportedDeletionEvents: async ({ deletionEvents }) => {
                    importedDeletions.push(...deletionEvents.map((event) => event.id));
                    return {
                        insertedCount: deletionEvents.length,
                        updatedCount: 0,
                        unchangedCount: 0,
                        ignoredCount: 0,
                        appliedDeletionCount: 0,
                    };
                },
            },
        });

        const imported = await importService.importFile({
            file: createFile(exported.jsonl),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(imported.status).toBe("completed");
        expect(importedPosts).toEqual([post.id, channelPost.id]);
        expect(importedDeletions).toEqual([deletion.id]);
    });

    it("空履歴は空JSONLを正常結果として返す", async () => {
        const service = new PostHistoryJsonlExportService({
            postHistoryRepository: { getAll: async () => [] },
            deletionRequestsRepository: { getAllForTargetAuthorPubkey: async () => [] },
        });

        await expect(service.exportForPubkey("a".repeat(64))).resolves.toMatchObject({
            jsonl: "",
            exportedEventCount: 0,
            isPartial: false,
        });
    });
});
