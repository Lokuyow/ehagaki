import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { describe, expect, it, vi } from "vitest";
import {
    runPostHistoryJsonlExportEngine,
    type PostHistoryVerificationStores,
} from "../../lib/postHistoryJsonlExportEngine";
import { RAW_EVENT_VERIFICATION_RULE_VERSION } from "../../lib/postHistoryRawEventVerification";
import type {
    PostHistoryDeletionRequestRecord,
    PostHistoryRecord,
} from "../../lib/storage/ehagakiDb";
import type { NostrEvent } from "../../lib/types";

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

function createPostRecord(event: NostrEvent): PostHistoryRecord {
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
    event: NostrEvent,
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

function plainEvent(
    event: NostrEvent,
    overrides: Partial<NostrEvent> = {},
): NostrEvent {
    return {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        kind: event.kind,
        tags: event.tags.map((tag) => [...tag]),
        content: event.content,
        sig: event.sig,
        ...overrides,
    };
}

function markValid<T extends PostHistoryRecord | PostHistoryDeletionRequestRecord>(record: T): T {
    record.rawEventVerification = {
        status: "valid",
        ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
    };
    return record;
}

function cloneRecord<T extends PostHistoryRecord | PostHistoryDeletionRequestRecord>(record: T): T {
    return {
        ...record,
        rawEvent: record.rawEvent && typeof record.rawEvent === "object"
            ? {
                ...(record.rawEvent as Record<string, unknown>),
                tags: Array.isArray((record.rawEvent as { tags?: unknown }).tags)
                    ? (record.rawEvent as { tags: string[][] }).tags.map((tag) => [...tag])
                    : undefined,
            }
            : record.rawEvent,
        ...(record.rawEventVerification
            ? { rawEventVerification: { ...record.rawEventVerification } }
            : {}),
    } as T;
}

function createStores(
    postRecords: PostHistoryRecord[],
    deletionRecords: PostHistoryDeletionRequestRecord[] = [],
    hooks: {
        onPostGet?: (record: PostHistoryRecord) => void;
        onPostTransaction?: (run: () => Promise<void>) => Promise<void>;
    } = {},
): PostHistoryVerificationStores {
    const post = {
        get: async (id: string) => {
            const record = postRecords.find((candidate) => candidate.id === id);
            if (record) hooks.onPostGet?.(record);
            return record;
        },
        update: async (id: string, changes: Pick<PostHistoryRecord, "rawEventVerification">) => {
            const record = postRecords.find((candidate) => candidate.id === id);
            if (record) Object.assign(record, changes);
        },
    };
    const deletion = {
        get: async (id: string) => deletionRecords.find((candidate) => candidate.id === id),
        update: async (
            id: string,
            changes: Pick<PostHistoryDeletionRequestRecord, "rawEventVerification">,
        ) => {
            const record = deletionRecords.find((candidate) => candidate.id === id);
            if (record) Object.assign(record, changes);
        },
    };
    return {
        post,
        deletion,
        transaction: {
            post: hooks.onPostTransaction ?? (async (run) => run()),
            deletion: async (run) => run(),
        },
    };
}

async function readJsonl(result: { blob: Blob; jsonl?: string }) {
    return result.jsonl ?? await new Response(result.blob).text();
}

describe("postHistoryJsonlExportEngine", () => {
    it("production Worker engine keeps kind order, stable ties, trailing newline, and local fields out", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const post42 = markValid(createPostRecord(createEvent(secretKey, {
            kind: 42,
            content: "channel",
            created_at: 20,
        })));
        const post1 = markValid(createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "plain",
            created_at: 10,
        })));
        const tieA = markValid(createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "tie-a",
            created_at: 15,
        })));
        const tieB = markValid(createPostRecord(createEvent(secretKey, {
            kind: 42,
            content: "tie-b",
            created_at: 15,
        })));
        const deletion = markValid(createDeletionRecord(createEvent(secretKey, {
            kind: 5,
            content: "",
            created_at: 30,
            tags: [["e", post1.eventId]],
        }), post1.eventId, pubkey));
        post1.deletedAt = 31_000;
        post1.deletionEventId = deletion.deletionEventId;
        post1.rawEvent = {
            ...post1.rawEvent as object,
            acceptedRelays: ["wss://local-only.example/"],
            schemaVersion: 2,
        };

        const exported = await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [post42, post1, tieB, tieA],
            deletionRecords: [deletion],
            includeJsonl: true,
        });
        const jsonl = await readJsonl(exported);
        const events = jsonl.trim().split("\n").map((line) => JSON.parse(line));

        expect(exported.result).toMatchObject({
            exportedEventCount: 5,
            exportedPostEventCount: 4,
            exportedDeletionEventCount: 1,
            isPartial: false,
        });
        const expectedTieKinds = [tieA, tieB]
            .sort((left, right) => left.eventId.localeCompare(right.eventId))
            .map((record) => record.kind);
        expect(events.map((event) => [event.kind, event.created_at])).toEqual([
            [1, 10],
            [expectedTieKinds[0], 15],
            [expectedTieKinds[1], 15],
            [42, 20],
            [5, 30],
        ]);
        expect(jsonl.endsWith("\n")).toBe(true);
        expect(jsonl).not.toContain("local-only");
        expect(jsonl).not.toContain("schemaVersion");
        expect(jsonl).not.toContain("updatedAt");
    });

    it("excludes inconsistent raw events and reports missing deletion raw once", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const post = markValid(createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "post",
            created_at: 10,
        })));
        post.content = "changed record";
        const deletedPost = markValid(createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "deleted",
            created_at: 11,
        })));
        deletedPost.deletedAt = 12_000;
        deletedPost.deletionEventId = "d".repeat(64);
        const missingDeletion = createDeletionRecord(
            createEvent(secretKey, {
                kind: 5,
                content: "",
                created_at: 20,
                tags: [["e", deletedPost.eventId]],
            }),
            deletedPost.eventId,
            pubkey,
            null,
        );

        const exported = await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [post, deletedPost],
            deletionRecords: [missingDeletion],
        });

        expect(exported.result).toMatchObject({
            exportedPostEventCount: 1,
            skippedPostCount: 1,
            missingDeletionRawEventCount: 1,
            invalidDeletionRawEventCount: 0,
            isPartial: true,
        });
    });

    it("outputs a legacy deleted post without kind 5 raw and marks partial", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const post = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "legacy deleted",
            created_at: 10,
        }));
        post.deletedAt = 12_000;
        post.deletionEventId = "d".repeat(64);

        const exported = await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [post],
            deletionRecords: [],
            includeJsonl: true,
        });
        const events = JSON.parse((await readJsonl(exported)).trim());

        expect(events).toMatchObject({ id: post.eventId, kind: 1 });
        expect(exported.result).toMatchObject({
            exportedPostEventCount: 1,
            exportedDeletionEventCount: 0,
            missingDeletionRawEventCount: 1,
            isPartial: true,
        });
    });

    it("persists valid and invalid legacy states and leaves current states out of migration", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const validLegacy = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "legacy valid",
            created_at: 1,
        }));
        const invalidLegacyEvent = createEvent(secretKey, {
            kind: 1,
            content: "legacy invalid",
            created_at: 2,
        });
        invalidLegacyEvent.sig = "0".repeat(128);
        const invalidLegacy = createPostRecord(invalidLegacyEvent);
        const currentValid = markValid(createPostRecord({
            ...plainEvent(createEvent(secretKey, {
                kind: 1,
                content: "current valid",
                created_at: 3,
            }), { sig: "0".repeat(128) }),
        }));
        const currentInvalid = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "current invalid",
            created_at: 4,
        }));
        currentInvalid.rawEventVerification = {
            status: "invalid",
            ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
        };
        const storedPosts = [
            cloneRecord(validLegacy),
            cloneRecord(invalidLegacy),
            cloneRecord(currentValid),
            cloneRecord(currentInvalid),
        ];
        const stores = createStores(storedPosts);

        const exported = await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [validLegacy, invalidLegacy, currentValid, currentInvalid],
            deletionRecords: [],
            verificationStores: stores,
            includeJsonl: true,
        });

        expect(storedPosts[0].rawEventVerification).toEqual({
            status: "valid",
            ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
        });
        expect(storedPosts[1].rawEventVerification).toEqual({
            status: "invalid",
            ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
        });
        expect(exported.result).toMatchObject({
            exportedPostEventCount: 2,
            skippedPostCount: 2,
            isPartial: true,
        });
        expect((await readJsonl(exported)).includes("current valid")).toBe(true);
    });

    it("re-migrates only missing or old rule versions", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const current = markValid(createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "current",
            created_at: 1,
        })));
        const old = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "old",
            created_at: 2,
        }));
        old.rawEventVerification = { status: "valid", ruleVersion: 0 };
        const missing = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "missing",
            created_at: 3,
        }));
        const stored = [cloneRecord(current), cloneRecord(old), cloneRecord(missing)];
        const update = vi.fn(async (id: string, changes: Pick<PostHistoryRecord, "rawEventVerification">) => {
            const record = stored.find((candidate) => candidate.id === id);
            if (record) Object.assign(record, changes);
        });
        const stores = createStores(stored);
        stores.post.update = update;

        await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [current, old, missing],
            deletionRecords: [],
            verificationStores: stores,
        });

        expect(update).toHaveBeenCalledTimes(2);
        expect(update.mock.calls.map(([id]) => id)).toEqual([old.id, missing.id]);
    });

    it("reports verification progress only for migration candidates", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const currentValid = markValid(createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "current valid",
            created_at: 1,
        })));
        const currentInvalid = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "current invalid",
            created_at: 2,
        }));
        currentInvalid.rawEventVerification = {
            status: "invalid",
            ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
        };
        const missing = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "missing",
            created_at: 3,
        }));
        const old = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "old",
            created_at: 4,
        }));
        old.rawEventVerification = { status: "valid", ruleVersion: 0 };
        const stored = [
            cloneRecord(currentValid),
            cloneRecord(currentInvalid),
            cloneRecord(missing),
            cloneRecord(old),
        ];
        const firstProgress: Array<{ phase: string; processed?: number; total?: number }> = [];

        await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [currentValid, currentInvalid, missing, old],
            deletionRecords: [],
            verificationStores: createStores(stored),
            onProgress: (progress) => firstProgress.push(progress),
        });

        const verifyingProgress = firstProgress.filter((progress) => progress.phase === "verifying");
        expect(verifyingProgress).toEqual([
            { phase: "verifying", processed: 0, total: 2 },
            { phase: "verifying", processed: 2, total: 2 },
        ]);

        const secondProgress: Array<{ phase: string; processed?: number; total?: number }> = [];
        await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [currentValid, currentInvalid, missing, old],
            deletionRecords: [],
            verificationStores: createStores(stored),
            onProgress: (progress) => secondProgress.push(progress),
        });
        expect(secondProgress.filter((progress) => progress.phase === "verifying")).toEqual([]);
    });

    it("scopes migration and export to the current account", async () => {
        const secretKey = generateSecretKey();
        const otherSecretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const own = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "own",
            created_at: 1,
        }));
        const other = createPostRecord(createEvent(otherSecretKey, {
            kind: 1,
            content: "other",
            created_at: 2,
        }));
        const stored = [cloneRecord(own), cloneRecord(other)];
        const stores = createStores(stored);

        const exported = await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [own, other],
            deletionRecords: [],
            verificationStores: stores,
        });

        expect(exported.result.exportedPostEventCount).toBe(1);
        expect(stored[0].rawEventVerification?.status).toBe("valid");
        expect(stored[1].rawEventVerification).toBeUndefined();
    });

    it("can resume after a persisted batch and rejects stale verification after raw replacement", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const records = Array.from({ length: 101 }, (_, index) =>
            createPostRecord(createEvent(secretKey, {
                kind: 1,
                content: `post-${index}`,
                created_at: index,
            })));
        const persisted = records.map(cloneRecord);
        let transactions = 0;
        const firstStores = createStores(persisted, [], {
            onPostTransaction: async (run) => {
                transactions += 1;
                await run();
                if (transactions === 1) {
                    throw new Error("simulated migration stop");
                }
            },
        });

        await expect(runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: records,
            deletionRecords: [],
            verificationStores: firstStores,
        })).rejects.toThrow("simulated migration stop");
        expect(persisted.slice(0, 100).every((record) => record.rawEventVerification?.status === "valid")).toBe(true);
        expect(persisted[100].rawEventVerification).toBeUndefined();

        const resumedRecords = persisted.map(cloneRecord);
        await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: resumedRecords,
            deletionRecords: [],
            verificationStores: createStores(persisted),
        });
        expect(persisted.every((record) => record.rawEventVerification?.status === "valid")).toBe(true);

        const raceRecord = createPostRecord(createEvent(secretKey, {
            kind: 1,
            content: "before race",
            created_at: 500,
        }));
        const raceStored = [cloneRecord(raceRecord)];
        const raceStores = createStores(raceStored, [], {
            onPostGet: (record) => {
                record.rawEvent = {
                    ...record.rawEvent as object,
                    content: "after race",
                };
            },
        });
        await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [raceRecord],
            deletionRecords: [],
            verificationStores: raceStores,
        });
        expect(raceStored[0].rawEventVerification).toBeUndefined();
    });

    it("does not reverify current-valid raw signatures during steady export", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const event = createEvent(secretKey, {
            kind: 1,
            content: "already verified",
            created_at: 10,
        });
        const record = markValid(createPostRecord(plainEvent(event, {
            sig: "0".repeat(128),
        })));
        const exported = await runPostHistoryJsonlExportEngine({
            pubkeyHex: pubkey,
            postRecords: [record],
            deletionRecords: [],
        });

        expect(exported.result.isPartial).toBe(false);
    });
});
