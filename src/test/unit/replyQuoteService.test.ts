import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReplyQuoteService } from "../../lib/replyQuoteService";
import type { NostrEvent, ReplyQuoteState } from "../../lib/types";
import { createMockRxNostr, createMockObservable } from "../helpers";
import type { RxNostr } from "rx-nostr";
import { nip19 } from "nostr-tools";
import { FALLBACK_RELAYS } from "../../lib/constants";

describe("ReplyQuoteService", () => {
    let service: ReplyQuoteService;
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as any;
        service = new ReplyQuoteService({ console: mockConsole });
    });

    describe("extractThreadInfo", () => {
        it("markedのroot eタグからrootEventIdを返す", () => {
            const event: NostrEvent = {
                id: "event1",
                pubkey: "pubkey1",
                created_at: 1000,
                kind: 1,
                tags: [
                    ["e", "root-id", "wss://relay.example.com", "root"],
                    ["e", "parent-id", "wss://relay2.example.com", "reply"],
                ],
                content: "test",
                sig: "sig1",
            };

            const result = service.extractThreadInfo(event);
            expect(result.rootEventId).toBe("root-id");
            expect(result.rootRelayHint).toBe("wss://relay.example.com");
            expect(result.rootPubkey).toBeNull();
        });

        it("root eタグにpubkeyが含まれている場合に返す", () => {
            const event: NostrEvent = {
                id: "event1",
                pubkey: "pubkey1",
                created_at: 1000,
                kind: 1,
                tags: [
                    ["e", "root-id", "wss://relay.example.com", "root", "root-pubkey"],
                ],
                content: "test",
                sig: "sig1",
            };

            const result = service.extractThreadInfo(event);
            expect(result.rootEventId).toBe("root-id");
            expect(result.rootPubkey).toBe("root-pubkey");
        });

        it("マーカーなしのeタグの場合、最初のeタグをrootとする", () => {
            const event: NostrEvent = {
                id: "event1",
                pubkey: "pubkey1",
                created_at: 1000,
                kind: 1,
                tags: [
                    ["e", "first-id", "wss://relay.example.com"],
                    ["e", "second-id", "wss://relay2.example.com"],
                ],
                content: "test",
                sig: "sig1",
            };

            const result = service.extractThreadInfo(event);
            expect(result.rootEventId).toBe("first-id");
            expect(result.rootRelayHint).toBe("wss://relay.example.com");
        });

        it("eタグがない場合はすべてnullを返す", () => {
            const event: NostrEvent = {
                id: "event1",
                pubkey: "pubkey1",
                created_at: 1000,
                kind: 1,
                tags: [["p", "some-pubkey"]],
                content: "test",
                sig: "sig1",
            };

            const result = service.extractThreadInfo(event);
            expect(result.rootEventId).toBeNull();
            expect(result.rootRelayHint).toBeNull();
            expect(result.rootPubkey).toBeNull();
        });
    });

    describe("buildReplyTags", () => {
        it("単独ノートへのリプライ: rootタグのみ生成", () => {
            const state: ReplyQuoteState = {
                mode: "reply",
                eventId: "target-id",
                relayHints: ["wss://relay.example.com"],
                authorPubkey: "author-pk",
                quoteNotificationEnabled: false,
                authorDisplayName: null,
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
                loading: false,
                error: null,
            };

            const tags = service.buildReplyTags(state);
            // rootタグ
            expect(tags[0]).toEqual([
                "e",
                "target-id",
                "wss://relay.example.com",
                "root",
                "author-pk",
            ]);
            // pタグ
            expect(tags).toContainEqual(["p", "author-pk"]);
        });

        it("スレッド内のリプライ: root + replyタグを生成", () => {
            const state: ReplyQuoteState = {
                mode: "reply",
                eventId: "reply-target-id",
                relayHints: ["wss://relay.example.com"],
                authorPubkey: "reply-author-pk",
                quoteNotificationEnabled: false,
                authorDisplayName: null,
                referencedEvent: {
                    id: "reply-target-id",
                    pubkey: "reply-author-pk",
                    created_at: 1000,
                    kind: 1,
                    tags: [["p", "existing-pk"]],
                    content: "reply content",
                    sig: "sig",
                },
                rootEventId: "original-root-id",
                rootRelayHint: "wss://root-relay.example.com",
                rootPubkey: "root-author-pk",
                loading: false,
                error: null,
            };

            const tags = service.buildReplyTags(state);

            // rootタグ（元のrootを引き継ぎ）
            expect(tags[0]).toEqual([
                "e",
                "original-root-id",
                "wss://root-relay.example.com",
                "root",
                "root-author-pk",
            ]);
            // replyタグ
            expect(tags[1]).toEqual([
                "e",
                "reply-target-id",
                "wss://relay.example.com",
                "reply",
                "reply-author-pk",
            ]);
            // pタグ (重複排除)
            const pTags = tags.filter((t) => t[0] === "p");
            expect(pTags).toContainEqual(["p", "reply-author-pk"]);
            expect(pTags).toContainEqual(["p", "existing-pk"]);
        });

        it("authorPubkeyがnullの場合、pタグなし・eタグにpubkeyなし", () => {
            const state: ReplyQuoteState = {
                mode: "reply",
                eventId: "target-id",
                relayHints: [],
                authorPubkey: null,
                quoteNotificationEnabled: false,
                authorDisplayName: null,
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
                loading: false,
                error: null,
            };

            const tags = service.buildReplyTags(state);
            expect(tags[0]).toEqual(["e", "target-id", "", "root"]);
            const pTags = tags.filter((t) => t[0] === "p");
            expect(pTags).toHaveLength(0);
        });
    });

    describe("buildQuoteTags", () => {
        it("デフォルトではqタグのみ生成する", () => {
            const state: ReplyQuoteState = {
                mode: "quote",
                eventId: "quoted-id",
                relayHints: ["wss://relay.example.com"],
                authorPubkey: "quoted-author-pk",
                quoteNotificationEnabled: false,
                authorDisplayName: null,
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
                loading: false,
                error: null,
            };

            const tags = service.buildQuoteTags(state);
            expect(tags[0]).toEqual([
                "q",
                "quoted-id",
                "wss://relay.example.com",
                "quoted-author-pk",
            ]);
            expect(tags).toHaveLength(1);
        });

        it("includePTagsがtrueの場合はpタグも生成する", () => {
            const state: ReplyQuoteState = {
                mode: "quote",
                eventId: "quoted-id",
                relayHints: ["wss://relay.example.com"],
                authorPubkey: "quoted-author-pk",
                quoteNotificationEnabled: true,
                authorDisplayName: null,
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
                loading: false,
                error: null,
            };

            const tags = service.buildQuoteTags(state, true);
            expect(tags[0]).toEqual([
                "q",
                "quoted-id",
                "wss://relay.example.com",
                "quoted-author-pk",
            ]);
            expect(tags[1]).toEqual(["p", "quoted-author-pk"]);
        });

        it("authorPubkeyがnullの場合、pタグなし", () => {
            const state: ReplyQuoteState = {
                mode: "quote",
                eventId: "quoted-id",
                relayHints: ["wss://relay.example.com"],
                authorPubkey: null,
                quoteNotificationEnabled: false,
                authorDisplayName: null,
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
                loading: false,
                error: null,
            };

            const tags = service.buildQuoteTags(state);
            expect(tags[0]).toEqual(["q", "quoted-id", "wss://relay.example.com"]);
            expect(tags).toHaveLength(1);
        });
    });

    describe("generateNostrUri", () => {
        it("nostr:nevent1... URIを生成する", () => {
            const uri = service.generateNostrUri(
                "a".repeat(64),
                ["wss://relay.example.com"],
                "b".repeat(64),
            );
            expect(uri).toMatch(/^nostr:nevent1/);
        });

        it("relayHintsが空の場合でもURIを生成する", () => {
            const uri = service.generateNostrUri(
                "a".repeat(64),
                [],
            );
            expect(uri).toMatch(/^nostr:nevent1/);
        });

        it("relayHintsが3つを超える場合は最初の3つのみ使用", () => {
            const uri = service.generateNostrUri(
                "a".repeat(64),
                [
                    "wss://r1.example.com",
                    "wss://r2.example.com",
                    "wss://r3.example.com",
                    "wss://r4.example.com",
                ],
            );
            expect(uri).toMatch(/^nostr:nevent1/);
        });
    });

    describe("fetchReferencedEvent", () => {
        it("イベントを正常に取得した場合にイベントを返す", async () => {
            const targetEvent: NostrEvent = {
                id: "target-event-id",
                pubkey: "event-author",
                created_at: 1000,
                kind: 1,
                tags: [],
                content: "Hello world",
                sig: "sig1",
            };

            const mockRxNostr: RxNostr = {
                use: vi.fn().mockReturnValue(
                    createMockObservable({ event: targetEvent }),
                ),
            } as any;

            const result = await service.fetchReferencedEvent(
                "target-event-id",
                ["wss://relay.example.com"],
                mockRxNostr,
            );

            expect(result).toEqual(targetEvent);
        });

        it("イベントが見つからない場合にnullを返す", async () => {
            const mockRxNostr: RxNostr = {
                use: vi.fn().mockReturnValue({
                    subscribe: vi.fn((observer: any) => {
                        // イベントなしでcomplete
                        observer.complete?.();
                        return { unsubscribe: vi.fn() };
                    }),
                }),
            } as any;

            const result = await service.fetchReferencedEvent(
                "nonexistent-id",
                [],
                mockRxNostr,
            );

            expect(result).toBeNull();
        });

        it("タイムアウトした場合にnullを返す", async () => {
            let setTimeoutCallback: (() => void) | undefined;
            const mockSetTimeout = vi.fn((fn: () => void) => {
                setTimeoutCallback = fn;
                return 1 as any;
            });
            const mockClearTimeout = vi.fn();

            const timeoutService = new ReplyQuoteService({
                console: mockConsole,
                setTimeoutFn: mockSetTimeout,
                clearTimeoutFn: mockClearTimeout,
            });

            const mockRxNostr: RxNostr = {
                use: vi.fn().mockReturnValue({
                    subscribe: vi.fn(() => {
                        // イベントもcompleteも発火しない（タイムアウト待ち）
                        return { unsubscribe: vi.fn() };
                    }),
                }),
            } as any;

            const promise = timeoutService.fetchReferencedEvent(
                "target-id",
                [],
                mockRxNostr,
                null,
                3000,
            );

            // タイムアウトコールバックを手動で発火
            expect(setTimeoutCallback).toBeDefined();
            setTimeoutCallback!();

            const result = await promise;
            expect(result).toBeNull();
        });

        it("エラーが発生した場合にnullを返す", async () => {
            const mockRxNostr: RxNostr = {
                use: vi.fn().mockReturnValue({
                    subscribe: vi.fn((observer: any) => {
                        observer.error?.(new Error("connection failed"));
                        return { unsubscribe: vi.fn() };
                    }),
                }),
            } as any;

            const result = await service.fetchReferencedEvent(
                "target-id",
                ["wss://relay.example.com"],
                mockRxNostr,
            );

            expect(result).toBeNull();
        });

        it("readリレーがある場合はdefaultReadRelaysを使用し、リレーヒントを追加する", async () => {
            let capturedOnParams: any = {};
            const mockRxNostr: RxNostr = {
                use: vi.fn().mockImplementation((_req: any, opts: any) => {
                    capturedOnParams = opts?.on || {};
                    return {
                        subscribe: vi.fn((observer: any) => {
                            observer.complete?.();
                            return { unsubscribe: vi.fn() };
                        }),
                    };
                }),
            } as any;

            await service.fetchReferencedEvent(
                "target-id",
                ["wss://hint-relay.example.com"],
                mockRxNostr,
                { "wss://user-relay.example.com/": { read: true, write: true } },
            );

            // defaultReadRelaysが有効
            expect(capturedOnParams.defaultReadRelays).toBe(true);
            // hintリレーがテンポラリリレーとして含まれている
            expect(capturedOnParams.relays).toContain("wss://hint-relay.example.com/");
        });

        it("無効なリレーヒントはテンポラリリレーへ追加しない", async () => {
            let capturedOnParams: any = {};
            const mockRxNostr: RxNostr = {
                use: vi.fn().mockImplementation((_req: any, opts: any) => {
                    capturedOnParams = opts?.on || {};
                    return {
                        subscribe: vi.fn((observer: any) => {
                            observer.complete?.();
                            return { unsubscribe: vi.fn() };
                        }),
                    };
                }),
            } as any;

            await service.fetchReferencedEvent(
                "target-id",
                [
                    "https://invalid.example.com",
                    "wss://hint-relay.example.com",
                    "wss://hint-relay.example.com/",
                    "wss://user:pass@secret.example.com",
                ],
                mockRxNostr,
                { "wss://user-relay.example.com/": { read: true, write: true } },
            );

            expect(capturedOnParams.defaultReadRelays).toBe(true);
            expect(capturedOnParams.relays).toEqual(["wss://hint-relay.example.com/"]);
        });

        it("リレーヒントが空かつreadリレーがある場合はdefaultReadRelaysのみ使用する", async () => {
            let capturedOnParams: any = {};
            const mockRxNostr: RxNostr = {
                use: vi.fn().mockImplementation((_req: any, opts: any) => {
                    capturedOnParams = opts?.on || {};
                    return {
                        subscribe: vi.fn((observer: any) => {
                            observer.complete?.();
                            return { unsubscribe: vi.fn() };
                        }),
                    };
                }),
            } as any;

            await service.fetchReferencedEvent(
                "target-id",
                [],
                mockRxNostr,
                { "wss://user-relay.example.com/": { read: true, write: true } },
            );

            // defaultReadRelaysが有効
            expect(capturedOnParams.defaultReadRelays).toBe(true);
            // relaysは未設定
            expect(capturedOnParams.relays).toBeUndefined();
        });

        it("readリレーが0件の場合はFALLBACK_RELAYSを使用する", async () => {
            let capturedOnParams: any = {};
            const mockRxNostr: RxNostr = {
                use: vi.fn().mockImplementation((_req: any, opts: any) => {
                    capturedOnParams = opts?.on || {};
                    return {
                        subscribe: vi.fn((observer: any) => {
                            observer.complete?.();
                            return { unsubscribe: vi.fn() };
                        }),
                    };
                }),
            } as any;

            await service.fetchReferencedEvent(
                "target-id",
                ["wss://hint-relay.example.com"],
                mockRxNostr,
                { "wss://write-only.example.com/": { read: false, write: true } },
            );

            expect(capturedOnParams.defaultReadRelays).toBe(false);
            expect(capturedOnParams.relays).toContain("wss://hint-relay.example.com/");
            for (const fallbackRelay of FALLBACK_RELAYS) {
                expect(capturedOnParams.relays).toContain(fallbackRelay);
            }
        });
    });

    describe("extractInlineQuoteTags", () => {
        const eventId1 = "a".repeat(64);
        const eventId2 = "b".repeat(64);
        const authorPubkey1 = "c".repeat(64);
        const authorPubkey2 = "d".repeat(64);

        it("nostr:nevent1... URIからデフォルトではqタグのみ抽出する", () => {
            const nevent = nip19.neventEncode({
                id: eventId1,
                relays: ["wss://relay.example.com"],
                author: authorPubkey1,
            });
            const content = `テキスト\nnostr:${nevent}\nテキスト`;

            const tags = service.extractInlineQuoteTags(content);
            expect(tags).toHaveLength(1);
            expect(tags[0][0]).toBe("q");
            expect(tags[0][1]).toBe(eventId1);
            expect(tags[0][2]).toBe("wss://relay.example.com");
            expect(tags[0][3]).toBe(authorPubkey1);
        });

        it("includePTagsがtrueの場合はnostr:nevent1... URIからq/pタグを抽出する", () => {
            const nevent = nip19.neventEncode({
                id: eventId1,
                relays: ["wss://relay.example.com"],
                author: authorPubkey1,
            });
            const content = `テキスト\nnostr:${nevent}\nテキスト`;

            const tags = service.extractInlineQuoteTags(content, true);
            expect(tags).toHaveLength(2);
            expect(tags[0][0]).toBe("q");
            expect(tags[0][1]).toBe(eventId1);
            expect(tags[0][2]).toBe("wss://relay.example.com");
            expect(tags[0][3]).toBe(authorPubkey1);
            expect(tags[1]).toEqual(["p", authorPubkey1]);
        });

        it("nostr:note1... URIからqタグを抽出する（pタグなし）", () => {
            const note = nip19.noteEncode(eventId1);
            const content = `テキスト\nnostr:${note}\nテキスト`;

            const tags = service.extractInlineQuoteTags(content);
            expect(tags).toHaveLength(1);
            expect(tags[0][0]).toBe("q");
            expect(tags[0][1]).toBe(eventId1);
            expect(tags[0][2]).toBe("");
        });

        it("複数のnostr: URIを出現順に処理する", () => {
            const nevent1 = nip19.neventEncode({
                id: eventId1,
                relays: ["wss://relay1.example.com"],
                author: authorPubkey1,
            });
            const nevent2 = nip19.neventEncode({
                id: eventId2,
                relays: ["wss://relay2.example.com"],
                author: authorPubkey2,
            });
            const content = `テキスト\nnostr:${nevent1}\nテキスト\nnostr:${nevent2}`;

            const tags = service.extractInlineQuoteTags(content, true);
            // qタグ2つ + pタグ2つ
            const qTags = tags.filter(t => t[0] === "q");
            const pTags = tags.filter(t => t[0] === "p");
            expect(qTags).toHaveLength(2);
            expect(pTags).toHaveLength(2);
            // 順番通り
            expect(qTags[0][1]).toBe(eventId1);
            expect(qTags[1][1]).toBe(eventId2);
        });

        it("neventとnoteが混在する場合も処理する", () => {
            const nevent = nip19.neventEncode({
                id: eventId1,
                relays: ["wss://relay.example.com"],
                author: authorPubkey1,
            });
            const note = nip19.noteEncode(eventId2);
            const content = `nostr:${nevent}\nnostr:${note}`;

            const tags = service.extractInlineQuoteTags(content, true);
            const qTags = tags.filter(t => t[0] === "q");
            const pTags = tags.filter(t => t[0] === "p");
            expect(qTags).toHaveLength(2);
            expect(qTags[0][1]).toBe(eventId1);
            expect(qTags[1][1]).toBe(eventId2);
            expect(pTags).toHaveLength(1);
            expect(pTags[0][1]).toBe(authorPubkey1);
        });

        it("同一イベントIDの重複URIはqタグを1つだけ生成する", () => {
            const nevent = nip19.neventEncode({
                id: eventId1,
                relays: ["wss://relay.example.com"],
                author: authorPubkey1,
            });
            const content = `nostr:${nevent}\nnostr:${nevent}`;

            const tags = service.extractInlineQuoteTags(content, true);
            const qTags = tags.filter(t => t[0] === "q");
            expect(qTags).toHaveLength(1);
        });

        it("includePTagsがtrueの場合は同一著者の重複pタグを1つだけ生成する", () => {
            const nevent1 = nip19.neventEncode({
                id: eventId1,
                relays: ["wss://relay.example.com"],
                author: authorPubkey1,
            });
            const nevent2 = nip19.neventEncode({
                id: eventId2,
                relays: ["wss://relay2.example.com"],
                author: authorPubkey1,
            });
            const content = `nostr:${nevent1}\nnostr:${nevent2}`;

            const tags = service.extractInlineQuoteTags(content, true);
            const pTags = tags.filter(t => t[0] === "p");
            expect(pTags).toHaveLength(1);
            expect(pTags[0][1]).toBe(authorPubkey1);
        });

        it("nostr: URIがない場合は空配列を返す", () => {
            const content = "普通のテキスト https://example.com";
            const tags = service.extractInlineQuoteTags(content);
            expect(tags).toHaveLength(0);
        });

        it("不正なbech32文字列は無視する", () => {
            const content = "nostr:nevent1invalid nostr:note1invalid";
            const tags = service.extractInlineQuoteTags(content);
            expect(tags).toHaveLength(0);
        });

        it("authorなしのneventからはpタグを生成しない", () => {
            const nevent = nip19.neventEncode({
                id: eventId1,
                relays: ["wss://relay.example.com"],
            });
            const content = `nostr:${nevent}`;

            const tags = service.extractInlineQuoteTags(content);
            expect(tags).toHaveLength(1);
            expect(tags[0][0]).toBe("q");
            expect(tags[0][1]).toBe(eventId1);
            const pTags = tags.filter(t => t[0] === "p");
            expect(pTags).toHaveLength(0);
        });
    });
});
