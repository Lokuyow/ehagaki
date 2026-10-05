import { describe, expect, it } from "vitest";
import {
    buildPostHistoryDirectReplyParentContext,
    validatePostHistoryDirectReplyRelation,
    type PostHistoryDirectReplyParentContext,
} from "../../lib/postHistoryDirectReplyRelationUtils";
import type { NostrEvent } from "../../lib/types";

const PARENT_ID = "1".repeat(64);
const CHILD_ID = "2".repeat(64);
const CHANNEL_ID = "3".repeat(64);
const OTHER_CHANNEL_ID = "4".repeat(64);
const ROOT_ID = "7".repeat(64);
const ROOT_AUTHOR = "5".repeat(64);
const PARENT_AUTHOR = "6".repeat(64);

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

function event(kind: number, id: string, pubkey: string, tags: string[][]): NostrEvent {
    return {
        id,
        pubkey,
        kind,
        content: "body",
        tags,
        created_at: 101,
        sig: "signature",
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

    it("accepts NIP-22 replies to a Sensitive Text Note only when root and direct parent metadata agree", () => {
        const sensitiveParent = {
            ...event(36, PARENT_ID, PARENT_AUTHOR, []),
        };
        const context = buildPostHistoryDirectReplyParentContext({ event: sensitiveParent });
        expect(context).toMatchObject({
            eventKind: 36,
            rootEventId: PARENT_ID,
            rootKind: 36,
            rootPubkey: PARENT_AUTHOR,
        });
        const comment = event(3636, CHILD_ID, ROOT_AUTHOR, [
            ["E", PARENT_ID, "", PARENT_AUTHOR], ["K", "36"], ["P", PARENT_AUTHOR],
            ["e", PARENT_ID, "", PARENT_AUTHOR], ["k", "36"], ["p", PARENT_AUTHOR],
        ]);
        expect(validatePostHistoryDirectReplyRelation({ child: comment, parent: context! })).toEqual({
            valid: true,
            parentEventId: PARENT_ID,
        });
        expect(validatePostHistoryDirectReplyRelation({
            child: event(3636, CHILD_ID, ROOT_AUTHOR, [
                ["E", OTHER_CHANNEL_ID, "", PARENT_AUTHOR], ["K", "36"], ["P", PARENT_AUTHOR],
                ["e", PARENT_ID, "", PARENT_AUTHOR], ["k", "36"], ["p", PARENT_AUTHOR],
            ]),
            parent: context!,
        })).toMatchObject({ valid: false, reason: "kind-mismatch" });
    });

    it("carries and validates an A-scope root when replying to an NIP-22 comment", () => {
        const rootAddress = `30023:${ROOT_AUTHOR}:article`;
        const parentEvent = event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["A", rootAddress, "wss://root.example.com/"], ["K", "30023"], ["P", ROOT_AUTHOR],
            ["e", ROOT_ID, "", ROOT_AUTHOR], ["k", "36"], ["p", ROOT_AUTHOR],
        ]);
        const context = buildPostHistoryDirectReplyParentContext({ event: parentEvent });
        const childEvent = event(1111, CHILD_ID, "7".repeat(64), [
            ["A", rootAddress, "wss://root.example.com/"], ["K", "30023"], ["P", ROOT_AUTHOR],
            ["e", PARENT_ID, "", PARENT_AUTHOR], ["k", "1111"], ["p", PARENT_AUTHOR],
        ]);
        expect(validatePostHistoryDirectReplyRelation({ child: childEvent, parent: context! })).toEqual({
            valid: true,
            parentEventId: PARENT_ID,
        });
    });

    it("supports replies to comments whose external I/i scope has no author tags", () => {
        const externalComment = event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["I", "https://example.test/article/1"], ["K", "web"],
            ["i", "https://example.test/article/1"], ["k", "web"],
        ]);
        const context = buildPostHistoryDirectReplyParentContext({ event: externalComment });
        expect(context).toMatchObject({
            eventId: PARENT_ID,
            eventKind: 1111,
            rootKind: "web",
            rootPubkey: null,
        });
        const childEvent = event(1111, CHILD_ID, ROOT_AUTHOR, [
            ["I", "https://example.test/article/1"], ["K", "web"],
            ["e", PARENT_ID, "", PARENT_AUTHOR], ["k", "1111"], ["p", PARENT_AUTHOR],
        ]);
        expect(validatePostHistoryDirectReplyRelation({ child: childEvent, parent: context! })).toEqual({
            valid: true,
            parentEventId: PARENT_ID,
        });
    });
});
