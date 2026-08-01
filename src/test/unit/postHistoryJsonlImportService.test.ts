import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { describe, expect, it, vi } from "vitest";
import {
    POST_HISTORY_JSONL_IMPORT_BATCH_SIZE,
    PostHistoryJsonlImportService,
} from "../../lib/postHistoryJsonlImportService";

function createSignedEvent(
    secretKey: Uint8Array,
    overrides: Partial<{
        kind: number;
        content: string;
        tags: string[][];
        created_at: number;
    }> = {},
) {
    return finalizeEvent({
        kind: overrides.kind ?? 1,
        content: overrides.content ?? "hello",
        tags: overrides.tags ?? [],
        created_at: overrides.created_at ?? 1_700_000_000,
    }, secretKey);
}

function createFile(content: string): Pick<File, "stream"> {
    const bytes = new TextEncoder().encode(content);
    return {
        stream: () => new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(bytes);
                controller.close();
            },
        }),
    } as Pick<File, "stream">;
}

function createRepositoryMocks() {
    const seenPostIds = new Set<string>();
    return {
        postHistoryRepository: {
            upsertFetchedEvents: vi.fn(async (input: { events: Array<{ event: { id: string } }> }) => {
                let insertedCount = 0;
                let unchangedCount = 0;
                for (const item of input.events) {
                    if (seenPostIds.has(item.event.id)) {
                        unchangedCount += 1;
                    } else {
                        seenPostIds.add(item.event.id);
                        insertedCount += 1;
                    }
                }
                return {
                    insertedCount,
                    updatedCount: 0,
                    unchangedCount,
                    appliedDeletionCount: 0,
                };
            }),
        },
        deletionRequestsRepository: {
            upsertImportedDeletionEvents: vi.fn(async (input: {
                deletionEvents: Array<{ tags: string[][] }>;
            }) => {
                const recordIds = new Set<string>();
                for (const event of input.deletionEvents) {
                    for (const tag of event.tags) {
                        if (tag[0] === "e" && /^[0-9a-f]{64}$/.test(tag[1] ?? "")) {
                            recordIds.add(tag[1]);
                        }
                    }
                }
                return {
                    insertedCount: recordIds.size,
                    updatedCount: 0,
                    unchangedCount: 0,
                    ignoredCount: 0,
                    appliedDeletionCount: Math.min(1, recordIds.size),
                };
            }),
        },
    };
}

describe("PostHistoryJsonlImportService", () => {
    it("同じ新規イベント2行をrepository結果とファイル内重複へ分離する", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const event = createSignedEvent(secretKey);
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(`${JSON.stringify(event)}\n${JSON.stringify(event)}`),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            status: "completed",
            nonEmptyLineCount: 2,
            uniquePostEventCount: 1,
            insertedPostCount: 1,
            unchangedPostCount: 0,
            fileDuplicateCount: 1,
        });
        expect(deps.postHistoryRepository.upsertFetchedEvents).toHaveBeenCalledTimes(1);
    });

    it("有効なkind 1と不正JSONが混在すると保存後もpartialになる", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const event = createSignedEvent(secretKey);
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(`${JSON.stringify(event)}\nnot-json`),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            status: "partial",
            insertedPostCount: 1,
            invalidJsonCount: 1,
        });
        expect(deps.postHistoryRepository.upsertFetchedEvents).toHaveBeenCalledTimes(1);
    });

    it.each([
        {
            name: "不正JSON",
            createLine: () => "not-json",
            field: "invalidJsonCount" as const,
        },
        {
            name: "不正構造",
            createLine: () => JSON.stringify({ kind: 1 }),
            field: "invalidStructureCount" as const,
        },
        {
            name: "不正IDまたは署名",
            createLine: (secretKey: Uint8Array) => JSON.stringify({
                ...createSignedEvent(secretKey),
                sig: "0".repeat(128),
            }),
            field: "invalidIdOrSignatureCount" as const,
        },
    ])("$nameだけのファイルはcompletedにならない", async ({ createLine, field }) => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const service = new PostHistoryJsonlImportService(createRepositoryMocks());

        const result = await service.importFile({
            file: createFile(createLine(secretKey)),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result.status).toBe("partial");
        expect(result[field]).toBe(1);
        expect(result.nonEmptyLineCount).toBe(1);
    });

    it("既存投稿と同じ1行はrepositoryのunchangedだけへ数える", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const event = createSignedEvent(secretKey);
        const deps = createRepositoryMocks();
        deps.postHistoryRepository.upsertFetchedEvents.mockResolvedValueOnce({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 1,
            appliedDeletionCount: 0,
        });
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(JSON.stringify(event)),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            insertedPostCount: 0,
            unchangedPostCount: 1,
            fileDuplicateCount: 0,
        });
    });

    it("同一イベントがバッチ境界を越えてもファイル内重複分類を維持する", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const first = createSignedEvent(secretKey, { content: "event-0" });
        const events = [first];
        for (let index = 1; index < POST_HISTORY_JSONL_IMPORT_BATCH_SIZE; index += 1) {
            events.push(createSignedEvent(secretKey, { content: `event-${index}` }));
        }
        events.push(first);
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(events.map((event) => JSON.stringify(event)).join("\n")),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result.uniquePostEventCount).toBe(POST_HISTORY_JSONL_IMPORT_BATCH_SIZE);
        expect(result.insertedPostCount).toBe(POST_HISTORY_JSONL_IMPORT_BATCH_SIZE);
        expect(result.fileDuplicateCount).toBe(1);
        expect(result.unchangedPostCount).toBe(0);
        expect(deps.postHistoryRepository.upsertFetchedEvents).toHaveBeenCalledTimes(1);
    });

    it("複数eタグのevent・タグ・要求record・削除反映件数を混在させない", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const firstTarget = "1".repeat(64);
        const secondTarget = "2".repeat(64);
        const deletionEvent = createSignedEvent(secretKey, {
            kind: 5,
            tags: [
                ["e", firstTarget],
                ["e", firstTarget],
                ["e", secondTarget],
            ],
        });
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(JSON.stringify(deletionEvent)),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            uniqueDeletionEventCount: 1,
            validDeletionETagCount: 3,
            insertedDeletionRequestCount: 2,
            appliedDeletionPostCount: 1,
            unsupportedDeletionEventCount: 0,
        });
    });

    it("保存対象外kindだけの削除要求を正常除外として数えcompletedを維持する", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const deletionEvent = createSignedEvent(secretKey, {
            kind: 5,
            tags: [["e", "1".repeat(64)], ["k", "31234"]],
        });
        const deps = createRepositoryMocks();
        deps.deletionRequestsRepository.upsertImportedDeletionEvents.mockResolvedValueOnce({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 1,
            appliedDeletionCount: 0,
        });
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(JSON.stringify(deletionEvent)),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            status: "completed",
            uniqueDeletionEventCount: 1,
            validDeletionETagCount: 1,
            insertedDeletionRequestCount: 0,
            updatedDeletionRequestCount: 0,
            unchangedDeletionRequestCount: 0,
            unsupportedDeletionEventCount: 1,
        });
    });

    it("不正行・別アカウント・対象外kindを分類し有効な最終行を保存する", async () => {
        const secretKey = generateSecretKey();
        const otherSecretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const validEvent = createSignedEvent(secretKey, { content: "valid" });
        const invalidSignature = {
            ...createSignedEvent(secretKey, { content: "invalid signature" }),
            sig: "0".repeat(128),
        };
        const otherEvent = createSignedEvent(otherSecretKey);
        const unsupportedEvent = createSignedEvent(secretKey, { kind: 7 });
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);
        const content = [
            "",
            "not-json",
            JSON.stringify({ kind: 1 }),
            JSON.stringify(invalidSignature),
            JSON.stringify(otherEvent),
            JSON.stringify(unsupportedEvent),
            JSON.stringify(validEvent),
        ].join("\n");

        const result = await service.importFile({
            file: createFile(content),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            status: "partial",
            nonEmptyLineCount: 6,
            invalidJsonCount: 1,
            invalidStructureCount: 1,
            invalidIdOrSignatureCount: 1,
            otherAccountCount: 1,
            unsupportedKindCount: 1,
            insertedPostCount: 1,
        });
    });

    it("別アカウントまたは対象外kindだけなら情報分類のcompletedを維持する", async () => {
        const secretKey = generateSecretKey();
        const otherSecretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const otherEvent = createSignedEvent(otherSecretKey);
        const unsupportedEvent = createSignedEvent(secretKey, { kind: 7 });
        const service = new PostHistoryJsonlImportService(createRepositoryMocks());

        const result = await service.importFile({
            file: createFile(`${JSON.stringify(otherEvent)}\n${JSON.stringify(unsupportedEvent)}`),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            status: "completed",
            otherAccountCount: 1,
            unsupportedKindCount: 1,
        });
    });

    it("別アカウントかつ署名不正のイベントは署名不正にせず保存しない", async () => {
        const ownerSecretKey = generateSecretKey();
        const otherSecretKey = generateSecretKey();
        const ownerPubkey = getPublicKey(ownerSecretKey);
        const otherEvent = {
            ...createSignedEvent(otherSecretKey),
            sig: "0".repeat(128),
        };
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(JSON.stringify(otherEvent)),
            ownerPubkeyHex: ownerPubkey,
            getCurrentPubkeyHex: () => ownerPubkey,
        });

        expect(result).toMatchObject({
            status: "completed",
            otherAccountCount: 1,
            invalidIdOrSignatureCount: 0,
        });
        expect(deps.postHistoryRepository.upsertFetchedEvents).not.toHaveBeenCalled();
        expect(deps.deletionRequestsRepository.upsertImportedDeletionEvents).not.toHaveBeenCalled();
    });

    it("対象外kindかつ署名不正のイベントは署名不正にせず保存しない", async () => {
        const secretKey = generateSecretKey();
        const ownerPubkey = getPublicKey(secretKey);
        const unsupportedEvent = {
            ...createSignedEvent(secretKey, { kind: 7 }),
            sig: "0".repeat(128),
        };
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(JSON.stringify(unsupportedEvent)),
            ownerPubkeyHex: ownerPubkey,
            getCurrentPubkeyHex: () => ownerPubkey,
        });

        expect(result).toMatchObject({
            status: "completed",
            unsupportedKindCount: 1,
            invalidIdOrSignatureCount: 0,
        });
        expect(deps.postHistoryRepository.upsertFetchedEvents).not.toHaveBeenCalled();
        expect(deps.deletionRequestsRepository.upsertImportedDeletionEvents).not.toHaveBeenCalled();
    });

    it("同一の別アカウントイベントを各行の除外理由へ数えファイル内重複にしない", async () => {
        const ownerSecretKey = generateSecretKey();
        const otherSecretKey = generateSecretKey();
        const ownerPubkey = getPublicKey(ownerSecretKey);
        const otherEvent = createSignedEvent(otherSecretKey);
        const service = new PostHistoryJsonlImportService(createRepositoryMocks());

        const result = await service.importFile({
            file: createFile(`${JSON.stringify(otherEvent)}\n${JSON.stringify(otherEvent)}`),
            ownerPubkeyHex: ownerPubkey,
            getCurrentPubkeyHex: () => ownerPubkey,
        });

        expect(result).toMatchObject({
            otherAccountCount: 2,
            fileDuplicateCount: 0,
        });
    });

    it("同一の対象外kindイベントを各行の除外理由へ数えファイル内重複にしない", async () => {
        const secretKey = generateSecretKey();
        const ownerPubkey = getPublicKey(secretKey);
        const unsupportedEvent = createSignedEvent(secretKey, { kind: 7 });
        const service = new PostHistoryJsonlImportService(createRepositoryMocks());

        const result = await service.importFile({
            file: createFile(`${JSON.stringify(unsupportedEvent)}\n${JSON.stringify(unsupportedEvent)}`),
            ownerPubkeyHex: ownerPubkey,
            getCurrentPubkeyHex: () => ownerPubkey,
        });

        expect(result).toMatchObject({
            unsupportedKindCount: 2,
            fileDuplicateCount: 0,
        });
    });

    it("対象アカウントかつ対象kindの署名不正は従来どおり署名不正に数える", async () => {
        const secretKey = generateSecretKey();
        const ownerPubkey = getPublicKey(secretKey);
        const invalidEvent = {
            ...createSignedEvent(secretKey),
            sig: "0".repeat(128),
        };
        const service = new PostHistoryJsonlImportService(createRepositoryMocks());

        const result = await service.importFile({
            file: createFile(JSON.stringify(invalidEvent)),
            ownerPubkeyHex: ownerPubkey,
            getCurrentPubkeyHex: () => ownerPubkey,
        });

        expect(result.invalidIdOrSignatureCount).toBe(1);
    });

    it("fatal UTF-8エラー時も正常に読めたprefixをflushして部分成功にする", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const event = createSignedEvent(secretKey);
        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
                controller.enqueue(new Uint8Array([0xff]));
                controller.close();
            },
        });
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: { stream: () => stream } as Pick<File, "stream">,
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result.status).toBe("partial");
        expect(result.insertedPostCount).toBe(1);
    });

    it("キャンセル済みなら未保存bufferをcommitしない", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const event = createSignedEvent(secretKey);
        const controller = new AbortController();
        controller.abort();
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(JSON.stringify(event)),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
            signal: controller.signal,
        });

        expect(result.status).toBe("cancelled");
        expect(deps.postHistoryRepository.upsertFetchedEvents).not.toHaveBeenCalled();
    });

    it("投稿区分のcommit後にアカウントが変わった場合は同じbufferのkind 5を保存しない", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const otherPubkey = getPublicKey(generateSecretKey());
        const events = Array.from(
            { length: POST_HISTORY_JSONL_IMPORT_BATCH_SIZE - 1 },
            (_, index) => createSignedEvent(secretKey, { content: `post-${index}` }),
        );
        events.push(createSignedEvent(secretKey, {
            kind: 5,
            tags: [["e", "1".repeat(64)]],
        }));
        const deps = createRepositoryMocks();
        let currentPubkey = pubkey;
        deps.postHistoryRepository.upsertFetchedEvents.mockImplementationOnce(async (input) => {
            currentPubkey = otherPubkey;
            return {
                insertedCount: input.events.length,
                updatedCount: 0,
                unchangedCount: 0,
                appliedDeletionCount: 0,
            };
        });
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(events.map((event) => JSON.stringify(event)).join("\n")),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => currentPubkey,
        });

        expect(result.status).toBe("account-changed");
        expect(result.insertedPostCount).toBe(POST_HISTORY_JSONL_IMPORT_BATCH_SIZE - 1);
        expect(deps.deletionRequestsRepository.upsertImportedDeletionEvents).not.toHaveBeenCalled();
    });

    it("投稿保存が失敗してもkind 5区分を継続し部分成功として返す", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const post = createSignedEvent(secretKey);
        const deletion = createSignedEvent(secretKey, {
            kind: 5,
            tags: [["e", post.id]],
        });
        const deps = createRepositoryMocks();
        deps.postHistoryRepository.upsertFetchedEvents.mockRejectedValueOnce(new Error("save failed"));
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: createFile(`${JSON.stringify(post)}\n${JSON.stringify(deletion)}`),
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result).toMatchObject({
            status: "partial",
            failedPostEventCount: 1,
            insertedDeletionRequestCount: 1,
        });
        expect(deps.deletionRequestsRepository.upsertImportedDeletionEvents).toHaveBeenCalledTimes(1);
    });

    it("stream取得自体が失敗した場合はfailedとして返す", async () => {
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const deps = createRepositoryMocks();
        const service = new PostHistoryJsonlImportService(deps);

        const result = await service.importFile({
            file: {
                stream: () => {
                    throw new Error("stream unavailable");
                },
            } as unknown as Pick<File, "stream">,
            ownerPubkeyHex: pubkey,
            getCurrentPubkeyHex: () => pubkey,
        });

        expect(result.status).toBe("failed");
        expect(result.nonEmptyLineCount).toBe(0);
    });
});
