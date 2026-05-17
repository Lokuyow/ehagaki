import { describe, expect, it } from "vitest";
import { parseKind1ThreadReferences } from "../../lib/postHistoryNip10Utils";
import type { NostrEvent } from "../../lib/types";

const ROOT_ID = "1".repeat(64);
const REPLY_ID = "2".repeat(64);
const MENTION_ID = "3".repeat(64);
const UNKNOWN_ID = "4".repeat(64);
const LEGACY_ID = "5".repeat(64);
const AUTHOR_HINT = "a".repeat(64);

function createEvent(tags: string[][], kind = 1): NostrEvent {
    return {
        id: "f".repeat(64),
        pubkey: "b".repeat(64),
        kind,
        content: "content",
        tags,
        created_at: 100,
        sig: "sig",
    };
}

describe("parseKind1ThreadReferences", () => {
    it("root/reply marker を優先して parent を reply にする", () => {
        expect(parseKind1ThreadReferences(createEvent([
            ["e", ROOT_ID, "wss://root.example.com", "root", AUTHOR_HINT],
            ["e", REPLY_ID, "wss://reply.example.com", "reply"],
        ]))).toMatchObject({
            rootId: ROOT_ID,
            replyId: REPLY_ID,
            parentId: REPLY_ID,
            rootRelayHint: "wss://root.example.com/",
            replyRelayHint: "wss://reply.example.com/",
            rootAuthorHint: AUTHOR_HINT,
            isLegacy: false,
        });
    });

    it("mention と unknown marker は parent 判定から除外する", () => {
        const result = parseKind1ThreadReferences(createEvent([
            ["e", MENTION_ID, "wss://mention.example.com", "mention"],
            ["e", UNKNOWN_ID, "wss://unknown.example.com", "custom-marker"],
        ]));

        expect(result.parentId).toBeNull();
        expect(result.mentionEventIds).toEqual([MENTION_ID]);
        expect(result.ignoredEventIds).toEqual([UNKNOWN_ID]);
    });

    it("unknown marker 付き tag だけでは legacy fallback を止めない", () => {
        const result = parseKind1ThreadReferences(createEvent([
            ["e", UNKNOWN_ID, "", "custom-marker"],
            ["e", LEGACY_ID, "wss://legacy.example.com"],
        ]));

        expect(result).toMatchObject({
            rootId: LEGACY_ID,
            replyId: null,
            parentId: LEGACY_ID,
            rootRelayHint: "wss://legacy.example.com/",
            isLegacy: true,
        });
        expect(result.ignoredEventIds).toEqual([UNKNOWN_ID]);
    });

    it("root/reply marker がある場合は marker なし e tag を legacy parent 判定に使わない", () => {
        const result = parseKind1ThreadReferences(createEvent([
            ["e", LEGACY_ID, "wss://legacy.example.com"],
            ["e", ROOT_ID, "wss://root.example.com", "root"],
        ]));

        expect(result).toMatchObject({
            rootId: ROOT_ID,
            replyId: null,
            parentId: ROOT_ID,
            isLegacy: false,
        });
    });

    it("legacy e tag 複数では first を root、last を parent にする", () => {
        const result = parseKind1ThreadReferences(createEvent([
            ["e", ROOT_ID, "wss://root.example.com"],
            ["e", REPLY_ID, "wss://reply.example.com"],
        ]));

        expect(result).toMatchObject({
            rootId: ROOT_ID,
            replyId: REPLY_ID,
            parentId: REPLY_ID,
            rootRelayHint: "wss://root.example.com/",
            replyRelayHint: "wss://reply.example.com/",
            isLegacy: true,
        });
    });

    it("壊れた e tag と kind:1 以外は無視する", () => {
        expect(parseKind1ThreadReferences(createEvent([
            ["e"],
            ["e", "not-hex"],
        ])).parentId).toBeNull();
        expect(parseKind1ThreadReferences(createEvent([
            ["e", ROOT_ID, "", "root"],
        ], 42)).parentId).toBeNull();
    });
});
