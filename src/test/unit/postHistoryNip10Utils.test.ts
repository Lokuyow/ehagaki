import { describe, expect, it } from "vitest";
import {
    parseKind1ThreadReferences,
    parseKind42ThreadReferences,
    resolveKind7ReactionTargetEventId,
} from "../../lib/postHistoryNip10Utils";
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

describe("parseKind42ThreadReferences", () => {
    it("channel root と direct reply を分離する", () => {
        expect(parseKind42ThreadReferences(createEvent([
            ["e", ROOT_ID, "wss://channel.example.com", "root"],
            ["e", REPLY_ID, "wss://reply.example.com", "reply", AUTHOR_HINT],
        ], 42))).toMatchObject({
            rootId: null,
            channelEventId: ROOT_ID,
            parentId: REPLY_ID,
            replyId: REPLY_ID,
            channelRelayHints: ["wss://channel.example.com/"],
            replyRelayHint: "wss://reply.example.com/",
            replyAuthorHint: AUTHOR_HINT,
            issues: [],
        });
    });

    it("root のみを持つトップレベル投稿を返信として扱わない", () => {
        const result = parseKind42ThreadReferences(createEvent([
            ["e", ROOT_ID, "wss://channel.example.com", "root"],
        ], 42));

        expect(result.channelEventId).toBe(ROOT_ID);
        expect(result.parentId).toBeNull();
    });

    it("同値重複を正規化し、競合する reply は採用しない", () => {
        const duplicated = parseKind42ThreadReferences(createEvent([
            ["e", ROOT_ID, "wss://one.example.com", "root"],
            ["e", ROOT_ID, "wss://two.example.com", "root"],
            ["e", REPLY_ID, "", "reply"],
            ["e", REPLY_ID, "wss://reply.example.com", "reply"],
        ], 42));
        expect(duplicated.channelEventId).toBe(ROOT_ID);
        expect(duplicated.channelRelayHints).toEqual([
            "wss://one.example.com/",
            "wss://two.example.com/",
        ]);
        expect(duplicated.parentId).toBe(REPLY_ID);

        const conflicted = parseKind42ThreadReferences(createEvent([
            ["e", ROOT_ID, "", "root"],
            ["e", REPLY_ID, "", "reply"],
            ["e", MENTION_ID, "wss://mention.example.com", "reply"],
        ], 42));
        expect(conflicted.parentId).toBeNull();
        expect(conflicted.replyRelayHint).toBeNull();
        expect(conflicted.issues).toContain("conflicting-reply-targets");
    });

    it("missing と invalid marked tag を区別し、mentionへfallbackしない", () => {
        const missing = parseKind42ThreadReferences(createEvent([
            ["e", MENTION_ID, "wss://mention.example.com", "mention"],
        ], 42));
        expect(missing.channelEventId).toBeNull();
        expect(missing.issues).toContain("missing-channel-root");

        const invalid = parseKind42ThreadReferences(createEvent([
            ["e", "invalid", "wss://invalid.example.com", "root"],
            ["e", REPLY_ID, "", "reply"],
        ], 42));
        expect(invalid.channelEventId).toBeNull();
        expect(invalid.issues).toContain("invalid-channel-root");
    });

    it("channel ID を reply target にしたイベントを親edgeにしない", () => {
        const result = parseKind42ThreadReferences(createEvent([
            ["e", ROOT_ID, "", "root"],
            ["e", ROOT_ID, "", "reply"],
        ], 42));
        expect(result.parentId).toBeNull();
        expect(result.issues).toContain("reply-target-is-channel");
    });
});

describe("resolveKind7ReactionTargetEventId", () => {
    it("root付き reaction では末尾の legacy-like e tag を対象にする", () => {
        expect(resolveKind7ReactionTargetEventId(createEvent([
            ["e", ROOT_ID, "wss://root.example.com", "root", AUTHOR_HINT],
            ["p", AUTHOR_HINT],
            ["e", REPLY_ID, "wss://reply.example.com", AUTHOR_HINT],
        ], 7))).toBe(REPLY_ID);
    });

    it("reply marker があれば優先し、kind:7 以外は無視する", () => {
        expect(resolveKind7ReactionTargetEventId(createEvent([
            ["e", ROOT_ID, "wss://root.example.com", "root", AUTHOR_HINT],
            ["e", REPLY_ID, "wss://reply.example.com", "reply", AUTHOR_HINT],
        ], 7))).toBe(REPLY_ID);
        expect(resolveKind7ReactionTargetEventId(createEvent([
            ["e", REPLY_ID],
        ], 1))).toBeNull();
    });
});
