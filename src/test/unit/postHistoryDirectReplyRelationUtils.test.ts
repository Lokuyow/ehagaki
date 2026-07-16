import { describe, expect, it } from "vitest";
import {
    validatePostHistoryDirectReplyRelation,
    type PostHistoryDirectReplyParentContext,
} from "../../lib/postHistoryDirectReplyRelationUtils";
import type { NostrEvent } from "../../lib/types";

const PARENT_ID = "1".repeat(64);
const CHILD_ID = "2".repeat(64);
const CHANNEL_ID = "3".repeat(64);
const OTHER_CHANNEL_ID = "4".repeat(64);

function parent(overrides: Partial<PostHistoryDirectReplyParentContext> = {}): PostHistoryDirectReplyParentContext {
    return {
        eventId: PARENT_ID,
        eventKind: 42,
        channelEventId: CHANNEL_ID,
        createdAt: 100,
        relayHints: [],
        ...overrides,
    };
}

function child(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: CHILD_ID,
        pubkey: "a".repeat(64),
        kind: 42,
        content: "reply",
        tags: [
            ["e", CHANNEL_ID, "", "root"],
            ["e", PARENT_ID, "", "reply"],
        ],
        created_at: 101,
        sig: "sig",
        ...overrides,
    };
}

describe("validatePostHistoryDirectReplyRelation", () => {
    it("ID・kind・channelが一致するkind 42返信を受け入れる", () => {
        expect(validatePostHistoryDirectReplyRelation({ child: child(), parent: parent() })).toEqual({
            valid: true,
            parentEventId: PARENT_ID,
        });
    });

    it("self reference、異種kind、channel不一致を拒否する", () => {
        expect(validatePostHistoryDirectReplyRelation({
            child: child({ id: PARENT_ID }),
            parent: parent(),
        })).toMatchObject({ valid: false, reason: "self-reference" });
        expect(validatePostHistoryDirectReplyRelation({
            child: child({ kind: 1 }),
            parent: parent(),
        })).toMatchObject({ valid: false, reason: "kind-mismatch" });
        expect(validatePostHistoryDirectReplyRelation({
            child: child({ tags: [
                ["e", OTHER_CHANNEL_ID, "", "root"],
                ["e", PARENT_ID, "", "reply"],
            ] }),
            parent: parent(),
        })).toMatchObject({ valid: false, reason: "channel-mismatch" });
    });
});
