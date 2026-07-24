import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    deleteAllDrafts,
    deleteDraft,
    formatDraftTimestamp,
    generatePreview,
    getDraft,
    hasDrafts,
    loadDrafts,
    saveDraft,
    saveDraftWithReplaceOldest,
    toggleDraftPinned,
} from "../../lib/draftManager";
import type { Draft, DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from "../../lib/types";
import { MAX_DRAFTS, STORAGE_KEYS } from "../../lib/constants";
import { ehagakiDb } from "../../lib/storage/ehagakiDb";
import { draftsRepository } from "../../lib/storage/draftsRepository";
import { MockStorage } from "../helpers";

const mockLocale = vi.hoisted(() => ({ subscribe: vi.fn(), set: vi.fn() }));
const mockT = vi.hoisted(() => vi.fn((key: string) => {
    if (key === "draft.time.now") return "今";
    if (key === "draft.media.image") return "[画像]";
    if (key === "draft.media.video") return "[動画]";
    if (key === "draft.media.reply") return "[リプライ]";
    if (key === "draft.media.quote") return "[引用]";
    if (key === "draft.no_content") return "(内容なし)";
    return key;
}));

vi.mock("svelte-i18n", () => ({
    locale: mockLocale,
    _: mockT,
}));

vi.mock("svelte/store", () => ({
    get: vi.fn((store) => {
        if (store === mockLocale) return "ja";
        if (store === mockT) return mockT;
        return null;
    }),
}));

function createGalleryItems(): MediaGalleryItem[] {
    return [
        {
            id: "g1",
            type: "image",
            src: "https://example.com/photo.jpg",
            isPlaceholder: false,
            blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
            alt: "photo",
            dim: "1920x1080",
            ox: "abc123",
            x: "def456",
        },
        {
            id: "g2",
            type: "video",
            src: "https://example.com/video.mp4",
            isPlaceholder: false,
        },
    ];
}

function createReplyQuoteData(): DraftReplyQuoteData {
    return {
        mode: "reply",
        eventId: "event-1",
        relayHints: ["wss://relay.example.com"],
        authorPubkey: "author-pubkey",
        quoteNotificationEnabled: false,
        authorDisplayName: "author-name",
        referencedEvent: null,
        rootEventId: "root-event-id",
        rootRelayHint: "wss://root-relay.example.com",
        rootPubkey: "root-pubkey",
    };
}

function createChannelData(): DraftChannelData {
    return {
        eventId: "channel-root-event",
        relayHints: ["wss://channel-relay.example.com"],
        name: "General",
        about: "General discussion",
        picture: "https://example.com/channel.png",
    };
}

describe("draftManager", () => {
    let storage: MockStorage;

    beforeEach(async () => {
        vi.useRealTimers();
        storage = new MockStorage();
        Object.defineProperty(globalThis, "localStorage", {
            value: storage,
            writable: true,
        });
        await ehagakiDb.open();
        await ehagakiDb.transaction("rw", ehagakiDb.drafts, ehagakiDb.meta, async () => {
            await ehagakiDb.drafts.clear();
            await ehagakiDb.meta.clear();
        });
        draftsRepository.resetBackendSelectionForTesting();
        vi.clearAllMocks();
    });

    afterEach(async () => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        await ehagakiDb.transaction("rw", ehagakiDb.drafts, ehagakiDb.meta, async () => {
            await ehagakiDb.drafts.clear();
            await ehagakiDb.meta.clear();
        });
        storage.clear();
    });

    describe("loadDrafts", () => {
        it("localStorage が空の場合は空配列を返す", async () => {
            await expect(loadDrafts()).resolves.toEqual([]);
        });

        it("既存 localStorage の下書きを IndexedDB に移行してタイムスタンプ降順で返す", async () => {
            const drafts: Draft[] = [
                { id: "draft_1", content: "<p>Old</p>", preview: "Old", timestamp: 1000 },
                { id: "draft_2", content: "<p>New</p>", preview: "New", timestamp: 3000 },
                { id: "draft_3", content: "<p>Mid</p>", preview: "Mid", timestamp: 2000 },
            ];
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

            const result = await loadDrafts();

            expect(result.map((draft) => draft.id)).toEqual(["draft_2", "draft_3", "draft_1"]);
            expect(storage.getItem(STORAGE_KEYS.DRAFTS)).toBeNull();

            const records = await ehagakiDb.drafts.toArray();
            expect(records).toHaveLength(3);
            expect(records.every((record) => record.pubkeyHex === null)).toBe(true);
        });

        it("不正なJSONの場合は空配列を返し、移行済みにしない", async () => {
            storage.setItem(STORAGE_KEYS.DRAFTS, "invalid json");

            await expect(loadDrafts()).resolves.toEqual([]);
            await expect(ehagakiDb.meta.get("migrated.localStorage.drafts.v1")).resolves.toBeUndefined();
        });

        it("ログイン中は現在アカウントと旧 unscoped 下書きだけを返す", async () => {
            await saveDraft("<p>Account A</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-a" });
            await saveDraft("<p>Account B</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-b" });
            await saveDraft("<p>Unscoped</p>");

            const result = await loadDrafts({ pubkeyHex: "pubkey-a" });

            expect(result.map((draft) => draft.preview)).toEqual(["Unscoped", "Account A"]);
        });

        it("ピン留めされた下書きをタイムスタンプより優先して先頭に並べる", async () => {
            const drafts: Draft[] = [
                { id: "draft_1", content: "<p>Pinned old</p>", preview: "Pinned old", timestamp: 1000, pinned: true },
                { id: "draft_2", content: "<p>New</p>", preview: "New", timestamp: 3000 },
                { id: "draft_3", content: "<p>Mid</p>", preview: "Mid", timestamp: 2000 },
            ];
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

            const result = await loadDrafts();

            expect(result.map((draft) => draft.id)).toEqual(["draft_1", "draft_2", "draft_3"]);
            expect(result[0].pinned).toBe(true);
        });
    });

    describe("generatePreview", () => {
        it("HTMLタグを除去してテキストのみを抽出", () => {
            expect(generatePreview("<p>Hello <strong>World</strong></p>")).toBe("Hello World");
        });

        it("指定文字数で切り詰める", () => {
            const longText = "a".repeat(100);
            expect(generatePreview(`<p>${longText}</p>`)).toBe(`${"a".repeat(50)}…`);
        });

        it("galleryItems と reply/channel 情報をプレビューに反映する", () => {
            const result = generatePreview(
                "<p>本文</p>",
                createGalleryItems(),
                createReplyQuoteData(),
                createChannelData(),
            );

            expect(result).toContain("本文");
            expect(result).toContain("[リプライ]");
            expect(result).toContain("#General");
            expect(result).toContain("[画像]");
            expect(result).toContain("[動画]");
        });

        it("エディタ本文内の画像と動画をプレビューに反映する", () => {
            const result = generatePreview(
                '<p>本文</p><img src="https://example.com/photo.jpg"><video src="https://example.com/video.mp4"></video>',
            );

            expect(result).toBe("本文 [画像][動画]");
        });

        it("カスタム絵文字をショートコードとしてプレビューに表示する", () => {
            expect(
                generatePreview(
                    '<p>Hello <img src="https://example.com/blobcat.webp" data-custom-emoji="true" data-shortcode="blobcat" alt=":blobcat:" class="custom-emoji-inline"></p>',
                ),
            ).toBe("Hello :blobcat:");
        });

        it("旧形式のカスタム絵文字も alt からショートコードとしてプレビューに表示する", () => {
            expect(
                generatePreview(
                    '<p><img src="https://example.com/kubi.webp" class="custom-emoji-inline" alt=":kubi:"></p>',
                ),
            ).toBe(":kubi:");
        });

        it("内容が空の場合は(内容なし)を返す", () => {
            expect(generatePreview("<p></p>")).toBe("(内容なし)");
        });
    });

    describe("saveDraft", () => {
        it("新しい下書きを IndexedDB に保存する", async () => {
            const result = await saveDraft("<p>Test content</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });

            expect(result.status).toBe("saved");
            expect(result.drafts).toHaveLength(1);
            expect(result.drafts[0].preview).toBe("Test content");

            const records = await ehagakiDb.drafts.toArray();
            expect(records[0]).toMatchObject({
                pubkeyHex: "pubkey-a",
                scopeKey: "pubkey-a",
                content: "<p>Test content</p>",
                schemaVersion: 1,
            });
        });

        it("IndexedDB 書き込み失敗後は localStorage に固定し、復旧した IndexedDB 読み込みへ戻らない", async () => {
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );

            const result = await saveDraft(
                "<p>Fallback draft</p>",
                undefined,
                undefined,
                undefined,
                { pubkeyHex: "pubkey-a" },
            );

            expect(result.status).toBe("saved");
            expect(
                (await loadDrafts({ pubkeyHex: "pubkey-a" })).map((draft) => draft.preview),
            ).toEqual(["Fallback draft"]);
            expect(storage.getItem(STORAGE_KEYS.DRAFTS_FALLBACK)).not.toBeNull();
        });

        it("フォールバック下書きをアカウント別に分離する", async () => {
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );

            await saveDraft("<p>Account A fallback</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });
            await saveDraft("<p>Account B fallback</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-b",
            });

            expect(
                (await loadDrafts({ pubkeyHex: "pubkey-a" })).map((draft) => draft.preview),
            ).toEqual(["Account A fallback"]);
            expect(
                (await loadDrafts({ pubkeyHex: "pubkey-b" })).map((draft) => draft.preview),
            ).toEqual(["Account B fallback"]);
        });

        it("次セッションでフォールバックを IndexedDB に復旧しても二重表示しない", async () => {
            await saveDraft("<p>Existing</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );
            await saveDraft("<p>Fallback</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });

            draftsRepository.resetBackendSelectionForTesting();
            const recovered = await loadDrafts({ pubkeyHex: "pubkey-a" });

            expect(recovered.map((draft) => draft.preview).sort()).toEqual([
                "Existing",
                "Fallback",
            ]);
            expect(new Set(recovered.map((draft) => draft.id)).size).toBe(2);
            expect(storage.getItem(STORAGE_KEYS.DRAFTS_FALLBACK)).toBeNull();
        });

        it("IndexedDB と localStorage の両方へ保存できない場合は失敗する", async () => {
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );
            vi.spyOn(storage, "setItem").mockImplementation(() => {
                throw new Error("fallback failed");
            });

            await expect(
                saveDraft("<p>Unsaved</p>", undefined, undefined, undefined, {
                    pubkeyHex: "pubkey-a",
                }),
            ).rejects.toThrow();
            expect(storage.getItem(STORAGE_KEYS.DRAFTS_FALLBACK)).toBeNull();
        });

        it("上限に達した場合は confirmation-required を返す", async () => {
            for (let index = 0; index < MAX_DRAFTS; index += 1) {
                await saveDraft(`<p>Content ${index}</p>`, undefined, undefined, undefined, {
                    pubkeyHex: "pubkey-a",
                });
            }

            const result = await saveDraft("<p>New draft</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });

            expect(result.status).toBe("confirmation-required");
            expect(result.drafts).toHaveLength(MAX_DRAFTS);
        });

        it("galleryItems、channelData、replyQuoteData を保存して復元できる", async () => {
            const galleryItems = createGalleryItems();
            const channelData = createChannelData();
            const replyQuoteData = createReplyQuoteData();

            const result = await saveDraft("<p>本文</p>", galleryItems, replyQuoteData, channelData);
            const fetched = await getDraft(result.drafts[0].id);

            expect(fetched?.galleryItems).toEqual(galleryItems);
            expect(fetched?.channelData).toEqual(channelData);
            expect(fetched?.replyQuoteData).toEqual(replyQuoteData);
        });

        it("ギャラリー画像とカスタム絵文字本文を同じ下書きに保存できる", async () => {
            const galleryItems: MediaGalleryItem[] = [
                { id: "image-1", type: "image", src: "https://example.com/photo.jpg", isPlaceholder: false },
            ];

            const result = await saveDraft(
                '<p><img src="https://example.com/blobcat.webp" data-custom-emoji="true" data-shortcode="blobcat" alt=":blobcat:" class="custom-emoji-inline"></p>',
                galleryItems,
            );
            const fetched = await getDraft(result.drafts[0].id);

            expect(result.status).toBe("saved");
            expect(fetched?.content).toContain('data-custom-emoji="true"');
            expect(fetched?.galleryItems).toEqual(galleryItems);
            expect(fetched?.preview).toContain(":blobcat:");
            expect(fetched?.preview).toContain("[画像]");
        });
    });

    describe("saveDraftWithReplaceOldest", () => {
        it("最も古い下書きを削除して新しい下書きを保存する", async () => {
            for (let index = 0; index < MAX_DRAFTS; index += 1) {
                await saveDraft(`<p>Content ${index}</p>`, undefined, undefined, undefined, {
                    pubkeyHex: "pubkey-a",
                });
            }

            const before = await loadDrafts({ pubkeyHex: "pubkey-a" });
            const oldestId = before[before.length - 1].id;
            const result = await saveDraftWithReplaceOldest("<p>Newest</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });

            expect(result.status).toBe("saved");
            expect(result.drafts).toHaveLength(MAX_DRAFTS);
            expect(result.drafts[0].preview).toBe("Newest");
            expect(result.drafts.some((draft) => draft.id === oldestId)).toBe(false);
        });

        it("IndexedDB の置換失敗後も localStorage で置換し、直後に取得できる", async () => {
            for (let index = 0; index < MAX_DRAFTS; index += 1) {
                await saveDraft(`<p>Content ${index}</p>`, undefined, undefined, undefined, {
                    pubkeyHex: "pubkey-a",
                });
            }
            const before = await loadDrafts({ pubkeyHex: "pubkey-a" });
            const oldestId = before[before.length - 1].id;
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );

            const result = await saveDraftWithReplaceOldest(
                "<p>Fallback replacement</p>",
                undefined,
                undefined,
                undefined,
                { pubkeyHex: "pubkey-a" },
            );
            const loaded = await loadDrafts({ pubkeyHex: "pubkey-a" });

            expect(result.status).toBe("saved");
            expect(loaded).toHaveLength(MAX_DRAFTS);
            expect(loaded[0].preview).toBe("Fallback replacement");
            expect(loaded.some((draft) => draft.id === oldestId)).toBe(false);
        });

        it("置換保存が失敗した場合は最古の下書きを削除しない", async () => {
            for (let index = 0; index < MAX_DRAFTS; index += 1) {
                await saveDraft(`<p>Content ${index}</p>`, undefined, undefined, undefined, {
                    pubkeyHex: "pubkey-a",
                });
            }
            const before = await loadDrafts({ pubkeyHex: "pubkey-a" });
            const oldestId = before[before.length - 1].id;
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );
            vi.spyOn(storage, "setItem").mockImplementation(() => {
                throw new Error("fallback failed");
            });

            await expect(
                saveDraftWithReplaceOldest(
                    "<p>Newest</p>",
                    undefined,
                    undefined,
                    undefined,
                    { pubkeyHex: "pubkey-a" },
                ),
            ).rejects.toThrow();

            const after = await loadDrafts({ pubkeyHex: "pubkey-a" });
            expect(after).toHaveLength(MAX_DRAFTS);
            expect(after.some((draft) => draft.id === oldestId)).toBe(true);
        });
    });

    describe("deleteDraft", () => {
        it("指定IDの下書きを削除する", async () => {
            await saveDraft("<p>First</p>");
            await saveDraft("<p>Second</p>");
            const drafts = await loadDrafts();

            const result = await deleteDraft(drafts[0].id);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(drafts[1].id);
        });

        it("フォールバック中の削除を IndexedDB 復旧後も維持する", async () => {
            const first = await saveDraft("<p>Delete me</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });
            if (first.status !== "saved") throw new Error("expected saved draft");
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );
            await saveDraft("<p>Keep me</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });
            await deleteDraft(first.draft.id, { pubkeyHex: "pubkey-a" });

            draftsRepository.resetBackendSelectionForTesting();
            const recovered = await loadDrafts({ pubkeyHex: "pubkey-a" });

            expect(recovered.map((draft) => draft.preview)).toEqual(["Keep me"]);
        });
    });

    describe("toggleDraftPinned", () => {
        it("下書きのピン留め状態を保存して、ピン留めした下書きを先頭に表示する", async () => {
            await saveDraft("<p>Old</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-a" });
            await saveDraft("<p>New</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-a" });
            const before = await loadDrafts({ pubkeyHex: "pubkey-a" });

            const result = await toggleDraftPinned(before[1].id, true, { pubkeyHex: "pubkey-a" });
            const fetched = await getDraft(before[1].id, { pubkeyHex: "pubkey-a" });

            expect(result.map((draft) => draft.preview)).toEqual(["Old", "New"]);
            expect(fetched?.pinned).toBe(true);
        });

        it("ピン留め解除後はタイムスタンプ降順に戻す", async () => {
            await saveDraft("<p>Old</p>");
            await saveDraft("<p>New</p>");
            const before = await loadDrafts();

            await toggleDraftPinned(before[1].id, true);
            const result = await toggleDraftPinned(before[1].id, false);

            expect(result.map((draft) => draft.preview)).toEqual(["New", "Old"]);
            expect(result.find((draft) => draft.preview === "Old")?.pinned).toBeUndefined();
        });
    });

    describe("deleteAllDrafts", () => {
        it("現在表示対象の下書きだけを削除する", async () => {
            await saveDraft("<p>Account A</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-a" });
            await saveDraft("<p>Account B</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-b" });

            await deleteAllDrafts({ pubkeyHex: "pubkey-a" });

            await expect(loadDrafts({ pubkeyHex: "pubkey-a" })).resolves.toEqual([]);
            expect((await loadDrafts({ pubkeyHex: "pubkey-b" }))[0].preview).toBe("Account B");
        });

        it("フォールバックbackendでもアカウント別のピン留め・削除・全削除を一貫して扱う", async () => {
            const accountA = await saveDraft("<p>Account A</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });
            if (accountA.status !== "saved") throw new Error("expected saved draft");
            await saveDraft("<p>Account B</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-b",
            });
            vi.spyOn(ehagakiDb.drafts, "put").mockRejectedValueOnce(
                new Error("put failed"),
            );
            const fallbackA = await saveDraft(
                "<p>Fallback A</p>",
                undefined,
                undefined,
                undefined,
                { pubkeyHex: "pubkey-a" },
            );
            if (fallbackA.status !== "saved") throw new Error("expected saved draft");

            await toggleDraftPinned(accountA.draft.id, true, { pubkeyHex: "pubkey-a" });
            expect((await getDraft(accountA.draft.id, { pubkeyHex: "pubkey-a" }))?.pinned).toBe(true);
            await deleteDraft(fallbackA.draft.id, { pubkeyHex: "pubkey-a" });
            expect(await getDraft(fallbackA.draft.id, { pubkeyHex: "pubkey-a" })).toBeUndefined();
            await deleteAllDrafts({ pubkeyHex: "pubkey-a" });

            await expect(loadDrafts({ pubkeyHex: "pubkey-a" })).resolves.toEqual([]);
            expect((await loadDrafts({ pubkeyHex: "pubkey-b" }))[0].preview).toBe("Account B");
        });
    });

    describe("hasDrafts", () => {
        it("下書きが存在する場合は true を返す", async () => {
            await expect(hasDrafts()).resolves.toBe(false);
            await saveDraft("<p>Test</p>");
            await expect(hasDrafts()).resolves.toBe(true);
        });
    });

    describe("formatDraftTimestamp", () => {
        const baseNow = new Date("2026-01-08T12:00:00Z").getTime();

        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(baseNow);
        });

        it("1分未満の場合は「今」を表示", () => {
            expect(formatDraftTimestamp(baseNow - 30 * 1000)).toBe("今");
        });

        it("数分前の場合は RelativeTimeFormat を使用", () => {
            expect(formatDraftTimestamp(baseNow - 5 * 60 * 1000)).toMatch(/5.*分/);
        });

        it("1年以上前の場合は年/月/日を表示", () => {
            const result = formatDraftTimestamp(baseNow - 400 * 24 * 60 * 60 * 1000);

            expect(result).toMatch(/2024/);
            expect(result).toMatch(/12/);
        });
    });
});
