import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RxNostr } from "rx-nostr";
import { ChannelContextService } from "../../lib/channelContextService";
import type { NostrEvent } from "../../lib/types";

const channelId = "a".repeat(64);
const authorPubkey = "b".repeat(64);

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: channelId,
        pubkey: authorPubkey,
        created_at: 100,
        kind: 40,
        tags: [],
        content: JSON.stringify({ name: "General", about: "Root about" }),
        sig: "sig",
        ...overrides,
    };
}

function createRxNostr(
    ...runs: Array<(observer: any) => void>
): RxNostr {
    const use = vi.fn();
    runs.forEach((run) => {
        use.mockReturnValueOnce({
            subscribe: vi.fn((observer: any) => {
                run(observer);
                return { unsubscribe: vi.fn() };
            }),
        });
    });
    return { use } as any;
}

describe("ChannelContextService", () => {
    let service: ChannelContextService;
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as any;
        service = new ChannelContextService({ console: mockConsole });
    });

    it("kind 40 と最新 kind 41 から検証済み metadata を解決する", async () => {
        const rootEvent = createEvent({
            content: JSON.stringify({
                name: "General",
                about: "Root about",
                picture: "https://example.com/root.png",
                relays: ["wss://root-relay.example.com"],
            }),
        });
        const updatedEvent = createEvent({
            id: "c".repeat(64),
            created_at: 200,
            kind: 41,
            tags: [["e", channelId]],
            content: JSON.stringify({
                about: "Updated about",
                picture: "https://example.com/updated.png",
                relays: ["wss://channel-write.example.com"],
            }),
        });
        const rxNostr = createRxNostr(
            (observer) => {
                observer.next({ event: rootEvent, from: "wss://root-source.example.com" });
                observer.complete();
            },
            (observer) => {
                observer.next({ event: updatedEvent, from: "wss://meta-source.example.com" });
                observer.complete();
            },
        );

        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: ["wss://hint-relay.example.com"],
        }, rxNostr, null)).resolves.toEqual({
            status: "resolved",
            quality: "verified-metadata",
            metadataLookup: "complete",
            metadata: {
                channelEventId: channelId,
                relayHints: [
                    "wss://hint-relay.example.com/",
                    "wss://root-source.example.com/",
                    "wss://meta-source.example.com/",
                ],
                channelRelays: [
                    "wss://channel-write.example.com/",
                    "wss://root-relay.example.com/",
                ],
                name: "General",
                about: "Updated about",
                picture: "https://example.com/updated.png",
                creatorPubkey: authorPubkey,
                createEventCreatedAt: 100,
                metadataEventId: "c".repeat(64),
                metadataCreatedAt: 200,
                verifiedSourceRelays: [
                    "wss://root-source.example.com/",
                    "wss://meta-source.example.com/",
                ],
            },
        });
    });

    it("kind 40 content が不正でも同作者の有効な kind 41 を利用する", async () => {
        const rootEvent = createEvent({ content: "{invalid-json" });
        const metadataEvent = createEvent({
            id: "c".repeat(64),
            kind: 41,
            created_at: 200,
            tags: [["e", channelId]],
            content: JSON.stringify({ name: "Recovered" }),
        });
        const rxNostr = createRxNostr(
            (observer) => {
                observer.next({ event: rootEvent });
                observer.complete();
            },
            (observer) => {
                observer.next({ event: metadataEvent });
                observer.complete();
            },
        );

        const result = await service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null);

        expect(result).toMatchObject({
            status: "resolved",
            metadataLookup: "complete",
            metadata: {
                name: "Recovered",
                verifiedSourceRelays: [],
            },
        });
    });

    it("不正な kind 40 content だけなら verified-root-only を返す", async () => {
        const rxNostr = createRxNostr(
            (observer) => {
                observer.next({
                    event: createEvent({ content: "{invalid-json" }),
                    from: "wss://root-source.example.com",
                });
                observer.complete();
            },
            (observer) => observer.complete(),
        );

        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null)).resolves.toEqual({
            status: "root-only",
            quality: "verified-root-only",
            reason: "invalid-root-content",
            metadataLookup: "complete",
            channelEventId: channelId,
            creatorPubkey: authorPubkey,
            createEventCreatedAt: 100,
            verifiedSourceRelays: ["wss://root-source.example.com/"],
        });
    });

    it("空フィールドの有効JSONを verified metadata として扱う", async () => {
        const rxNostr = createRxNostr(
            (observer) => {
                observer.next({ event: createEvent({ content: "{}" }) });
                observer.complete();
            },
            (observer) => observer.complete(),
        );
        const result = await service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null);
        expect(result).toMatchObject({
            status: "resolved",
            quality: "verified-metadata",
            metadata: { name: null, about: null, picture: null },
        });
    });

    it("同じ created_at の kind 41 は取得順によらず辞書順で小さいIDを選ぶ", async () => {
        const larger = createEvent({
            id: "f".repeat(64),
            kind: 41,
            created_at: 200,
            tags: [["e", channelId]],
            content: JSON.stringify({ name: "Larger" }),
        });
        const smaller = createEvent({
            id: "c".repeat(64),
            kind: 41,
            created_at: 200,
            tags: [["e", channelId]],
            content: JSON.stringify({ name: "Smaller" }),
        });
        const rxNostr = createRxNostr(
            (observer) => {
                observer.next({ event: createEvent() });
                observer.complete();
            },
            (observer) => {
                observer.next({ event: larger });
                observer.next({ event: smaller });
                observer.complete();
            },
        );

        const result = await service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null);
        expect(result).toMatchObject({
            status: "resolved",
            metadata: { metadataEventId: smaller.id, name: "Smaller" },
        });
    });

    it("author または channel reference が異なる kind 41 は無視する", async () => {
        const invalidAuthor = createEvent({
            id: "c".repeat(64),
            pubkey: "d".repeat(64),
            kind: 41,
            tags: [["e", channelId]],
            content: JSON.stringify({ name: "Wrong" }),
        });
        const invalidReference = createEvent({
            id: "e".repeat(64),
            kind: 41,
            tags: [["e", "f".repeat(64)]],
            content: JSON.stringify({ name: "Wrong ref" }),
        });
        const rxNostr = createRxNostr(
            (observer) => {
                observer.next({ event: createEvent() });
                observer.complete();
            },
            (observer) => {
                observer.next({ event: invalidAuthor });
                observer.next({ event: invalidReference });
                observer.complete();
            },
        );

        const result = await service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null);
        expect(result).toMatchObject({
            status: "resolved",
            metadata: { name: "General", metadataEventId: null },
        });
    });

    it("kind 41 request errorでもroot metadataを維持してincompleteを返す", async () => {
        const metadataError = new Error("metadata stream failed");
        const rxNostr = createRxNostr(
            (observer) => {
                observer.next({ event: createEvent(), from: "wss://root.example.com" });
                observer.complete();
            },
            (observer) => observer.error(metadataError),
        );

        const result = await service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null);

        expect(result).toMatchObject({
            status: "resolved",
            metadataLookup: "incomplete",
            metadata: {
                name: "General",
                verifiedSourceRelays: ["wss://root.example.com/"],
            },
        });
    });
    it("complete without root event を root-not-found に分類する", async () => {
        const rxNostr = createRxNostr((observer) => observer.complete());
        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null)).resolves.toEqual({
            status: "failed",
            reason: "root-not-found",
        });
    });

    it("wrong kind を失敗に分類する", async () => {
        const rxNostr = createRxNostr((observer) => {
            observer.next({ event: createEvent({ kind: 1 }) });
            observer.complete();
        });
        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null)).resolves.toEqual({ status: "failed", reason: "wrong-kind" });
    });

    it("Observable error と use 例外を request-error に分類する", async () => {
        const observableError = new Error("observable failed");
        const errorRxNostr = createRxNostr((observer) => observer.error(observableError));
        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, errorRxNostr, null)).resolves.toMatchObject({
            status: "failed",
            reason: "request-error",
            cause: observableError,
        });

        const useError = new Error("use failed");
        const throwingRxNostr = { use: vi.fn(() => { throw useError; }) } as any;
        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, throwingRxNostr, null)).resolves.toMatchObject({
            status: "failed",
            reason: "request-error",
            cause: useError,
        });
    });

    it("emit 例外を request-error に分類する", async () => {
        const emitError = new Error("emit failed");
        service = new ChannelContextService({
            console: mockConsole,
            createRxBackwardReqFn: (() => ({
                emit: () => { throw emitError; },
                over: vi.fn(),
            })) as any,
        });
        const rxNostr = {
            use: vi.fn(() => ({
                subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
            })),
        } as any;
        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, rxNostr, null)).resolves.toMatchObject({
            status: "failed",
            reason: "request-error",
            cause: emitError,
        });
    });

    it("timeout と abort を区別する", async () => {
        let timeoutCallback: (() => void) | undefined;
        service = new ChannelContextService({
            console: mockConsole,
            setTimeoutFn: ((callback: () => void) => {
                timeoutCallback = callback;
                return 1 as any;
            }) as any,
            clearTimeoutFn: vi.fn(),
        });
        const pendingRxNostr = createRxNostr(() => undefined);
        const timeoutPromise = service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, pendingRxNostr, null);
        timeoutCallback?.();
        await expect(timeoutPromise).resolves.toEqual({ status: "failed", reason: "timeout" });

        const controller = new AbortController();
        controller.abort();
        await expect(service.resolveChannelMetadata({
            eventId: channelId,
            relayHints: [],
        }, pendingRxNostr, null, { signal: controller.signal })).resolves.toEqual({ status: "aborted" });
    });
});
