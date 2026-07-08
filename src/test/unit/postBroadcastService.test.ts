import { describe, expect, it, vi } from "vitest";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import {
    PostBroadcastService,
    resolveBroadcastEvent,
} from "../../lib/postBroadcastService";

function createRecord(
    overrides: Partial<PostHistoryRecord> = {},
): PostHistoryRecord {
    const rawEvent = {
        id: "e".repeat(64),
        pubkey: "b".repeat(64),
        created_at: 100,
        kind: 1,
        tags: [],
        content: "hello",
        sig: "s".repeat(128),
    };

    return {
        id: "event-1",
        eventId: rawEvent.id,
        pubkeyHex: rawEvent.pubkey,
        kind: rawEvent.kind,
        content: rawEvent.content,
        tags: rawEvent.tags,
        createdAt: rawEvent.created_at * 1000,
        postedAt: rawEvent.created_at * 1000,
        relayHints: ["wss://hint.example.com/"],
        acceptedRelays: ["wss://accepted.example.com/"],
        fetchedRelays: [],
        media: [],
        rawEvent,
        updatedAt: 300,
        schemaVersion: 2,
        ...overrides,
    };
}

function createObservable(packets: any[]) {
    return {
        subscribe(observer: any) {
            packets.forEach((packet) => observer.next(packet));
            observer.complete();
            return { unsubscribe: vi.fn() };
        },
    };
}

describe("postBroadcastService helpers", () => {
    it("保存済み rawEvent から署名済みイベントを取り出す", () => {
        const post = createRecord();

        expect(resolveBroadcastEvent(post)).toEqual(post.rawEvent);
    });

    it("署名済みイベントの必須フィールドがない場合は null を返す", () => {
        expect(
            resolveBroadcastEvent(
                createRecord({ rawEvent: { id: "e".repeat(64) } }),
            ),
        ).toBeNull();
    });
});

describe("PostBroadcastService", () => {
    it("投稿者に関係なく自身の write relay に raw event をブロードキャストする", async () => {
        const post = createRecord({ pubkeyHex: "b".repeat(64) });
        const send = vi.fn().mockReturnValue(
            createObservable([
                {
                    ok: true,
                    from: "wss://write.example.com/",
                    event: post.rawEvent,
                },
            ]),
        );
        const service = new PostBroadcastService({
            writeRelaysStore: {
                value: [
                    "wss://write.example.com/",
                    "wss://write.example.com/",
                    "wss://second.example.com/",
                ],
            },
            console: {
                log: vi.fn(),
                warn: vi.fn(),
                error: vi.fn(),
            } as unknown as Console,
        });

        const result = await service.broadcast({
            post,
            rxNostr: { send } as any,
        });

        expect(result).toEqual({
            success: true,
            eventId: "e".repeat(64),
            acceptedRelays: ["wss://write.example.com/"],
        });
        expect(send).toHaveBeenCalledWith(post.rawEvent, {
            completeOn: "all-ok",
            on: {
                relays: [
                    "wss://write.example.com/",
                    "wss://second.example.com/",
                ],
            },
        });
    });

    it("write relay がない場合は送信しない", async () => {
        const send = vi.fn();
        const service = new PostBroadcastService({
            writeRelaysStore: { value: [] },
        });

        const result = await service.broadcast({
            post: createRecord(),
            rxNostr: { send } as any,
        });

        expect(result).toEqual({
            success: false,
            error: "no_write_relays",
        });
        expect(send).not.toHaveBeenCalled();
    });

    it("rawEvent が署名済みイベントでない場合は送信しない", async () => {
        const send = vi.fn();
        const service = new PostBroadcastService({
            writeRelaysStore: { value: ["wss://write.example.com/"] },
        });

        const result = await service.broadcast({
            post: createRecord({ rawEvent: null }),
            rxNostr: { send } as any,
        });

        expect(result).toEqual({
            success: false,
            error: "invalid_event",
        });
        expect(send).not.toHaveBeenCalled();
    });
});
