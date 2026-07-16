import { describe, expect, it } from "vitest";
import { isValidPostHistoryCachedDirectReply } from "../../lib/hooks/usePostHistoryThreadGraph.svelte";
import { buildThreadGraphNode } from "../../lib/postHistoryThreadGraphUtils";
import type { NostrEvent } from "../../lib/types";

const PARENT_ID = "1".repeat(64);
const CHILD_ID = "2".repeat(64);
const CHANNEL_ID = "3".repeat(64);
const OTHER_CHANNEL_ID = "4".repeat(64);

function event(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: PARENT_ID,
        pubkey: "a".repeat(64),
        kind: 42,
        content: "parent",
        tags: [["e", CHANNEL_ID, "", "root"]],
        created_at: 100,
        sig: "sig",
        ...overrides,
    };
}

function record(overrides: Record<string, unknown> = {}) {
    const child = event({
        id: CHILD_ID,
        pubkey: "b".repeat(64),
        content: "child",
        tags: [
            ["e", CHANNEL_ID, "", "root"],
            ["e", PARENT_ID, "", "reply"],
        ],
        created_at: 101,
    });
    return {
        eventId: child.id,
        parentEventId: PARENT_ID,
        authorPubkey: child.pubkey,
        kind: child.kind,
        content: child.content,
        tags: child.tags,
        createdAt: child.created_at,
        relayUrls: [],
        discoveredAs: ["direct-reply"],
        rawEvent: child,
        ...overrides,
    } as any;
}

describe("isValidPostHistoryCachedDirectReply", () => {
    const parentNode = buildThreadGraphNode({
        event: event(),
        sources: ["history-record"],
    });

    it("同一kind・同一channelのkind42 cacheだけを受け入れる", () => {
        expect(isValidPostHistoryCachedDirectReply({ parentNode, record: record() })).toBe(true);
        expect(isValidPostHistoryCachedDirectReply({
            parentNode,
            record: record({ kind: 1, rawEvent: null }),
        })).toBe(false);
        expect(isValidPostHistoryCachedDirectReply({
            parentNode,
            record: record({
                tags: [
                    ["e", OTHER_CHANNEL_ID, "", "root"],
                    ["e", PARENT_ID, "", "reply"],
                ],
                rawEvent: null,
            }),
        })).toBe(false);
    });

    it("recordと不一致なrawEventではなくrecord tagsを検証する", () => {
        expect(isValidPostHistoryCachedDirectReply({
            parentNode,
            record: record({
                tags: [
                    ["e", CHANNEL_ID, "", "root"],
                    ["e", PARENT_ID, "", "reply"],
                ],
                rawEvent: event({
                    id: CHILD_ID,
                    tags: [
                        ["e", OTHER_CHANNEL_ID, "", "root"],
                        ["e", PARENT_ID, "", "reply"],
                    ],
                }),
            }),
        })).toBe(true);
    });
});
