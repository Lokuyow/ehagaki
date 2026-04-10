import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReplyQuoteService } from "../../lib/replyQuoteService";
import type { NostrEvent, ReplyQuoteState } from "../../lib/types";
import { createMockRxNostr, createMockObservable } from "../helpers";
import type { RxNostr } from "rx-nostr";

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
        it("qタグとpタグを生成する", () => {
            const state: ReplyQuoteState = {
                mode: "quote",
                eventId: "quoted-id",
                relayHints: ["wss://relay.example.com"],
                authorPubkey: "quoted-author-pk",
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
            expect(tags[1]).toEqual(["p", "quoted-author-pk"]);
        });

        it("authorPubkeyがnullの場合、pタグなし", () => {
            const state: ReplyQuoteState = {
                mode: "quote",
                eventId: "quoted-id",
                relayHints: ["wss://relay.example.com"],
                authorPubkey: null,
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

        it("relayConfigが指定された場合にreadリレーを含める", async () => {
            let capturedRelays: string[] = [];
            const mockRxNostr: RxNostr = {
                use: vi.fn().mockImplementation((_req: any, opts: any) => {
                    capturedRelays = opts?.on?.relays || [];
                    return {
                        subscribe: vi.fn((observer: any) => {
                            observer.complete?.();
                            return { unsubscribe: vi.fn() };
                        }),
                    };
                }),
            } as any;

            const relayConfig = {
                "wss://read-relay.example.com/": { read: true, write: false },
                "wss://write-relay.example.com/": { read: false, write: true },
            };

            await service.fetchReferencedEvent(
                "target-id",
                ["wss://hint-relay.example.com"],
                mockRxNostr,
                relayConfig,
            );

            // readリレーが含まれている
            expect(capturedRelays).toContain("wss://read-relay.example.com/");
            // writeのみリレーは含まれない
            expect(capturedRelays).not.toContain("wss://write-relay.example.com/");
            // hintリレーも含まれている
            expect(
                capturedRelays.some((r) => r.includes("hint-relay")),
            ).toBe(true);
        });
    });
});
