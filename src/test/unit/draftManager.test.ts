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
} from "../../lib/draftManager";
import type { Draft, DraftChannelData, DraftReplyQuoteData, MediaGalleryItem } from "../../lib/types";
import { MAX_DRAFTS, STORAGE_KEYS } from "../../lib/constants";
import { ehagakiDb } from "../../lib/storage/ehagakiDb";
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
        vi.clearAllMocks();
    });

    afterEach(async () => {
        vi.useRealTimers();
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

            expect(result.success).toBe(true);
            expect(result.needsConfirmation).toBe(false);
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

        it("上限に達した場合は needsConfirmation=true を返す", async () => {
            for (let index = 0; index < MAX_DRAFTS; index += 1) {
                await saveDraft(`<p>Content ${index}</p>`, undefined, undefined, undefined, {
                    pubkeyHex: "pubkey-a",
                });
            }

            const result = await saveDraft("<p>New draft</p>", undefined, undefined, undefined, {
                pubkeyHex: "pubkey-a",
            });

            expect(result.success).toBe(false);
            expect(result.needsConfirmation).toBe(true);
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

            expect(result).toHaveLength(MAX_DRAFTS);
            expect(result[0].preview).toBe("Newest");
            expect(result.some((draft) => draft.id === oldestId)).toBe(false);
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
    });

    describe("deleteAllDrafts", () => {
        it("現在表示対象の下書きだけを削除する", async () => {
            await saveDraft("<p>Account A</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-a" });
            await saveDraft("<p>Account B</p>", undefined, undefined, undefined, { pubkeyHex: "pubkey-b" });

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
