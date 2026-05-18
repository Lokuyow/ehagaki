import { describe, expect, it } from "vitest";
import {
    buildAnchorNodeKey,
    buildInitialExpansionState,
    buildThreadGraphNode,
    mergeThreadGraphNode,
    sortEventIdsByEvent,
} from "../../lib/postHistoryThreadGraphUtils";
import type { NostrEvent } from "../../lib/types";

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "1".repeat(64),
        pubkey: "a".repeat(64),
        kind: 1,
        content: "content",
        tags: [],
        created_at: 100,
        sig: "b".repeat(128),
        ...overrides,
    };
}

describe("postHistoryThreadGraphUtils", () => {
    it("展開状態keyは anchorEventId と nodeEventId を組み合わせる", () => {
        expect(buildAnchorNodeKey("anchor", "node")).toBe("anchor:node");
    });

    it("loaded と visible を分離した初期状態を作る", () => {
        expect(buildInitialExpansionState()).toMatchObject({
            loadedParent: false,
            visibleParent: false,
            loadedChildren: false,
            visibleChildren: false,
        });
    });

    it("node sources と relayUrls を重複なしでmergeする", () => {
        const event = createEvent();
        const current = buildThreadGraphNode({
            event,
            relayUrls: ["wss://a.example.com/"],
            sources: ["anchor", "history-record"],
        });
        const next = buildThreadGraphNode({
            event,
            relayUrls: ["wss://a.example.com/", "wss://b.example.com/"],
            sources: ["reply-db", "history-record"],
        });

        expect(mergeThreadGraphNode(current, next)).toMatchObject({
            relayUrls: ["wss://a.example.com/", "wss://b.example.com/"],
            sources: ["anchor", "history-record", "reply-db"],
        });
    });

    it("childrenByParentId 用のeventIdをcreated_at古い順に並べる", () => {
        const older = buildThreadGraphNode({
            event: createEvent({ id: "2".repeat(64), created_at: 100 }),
            sources: ["reply-db"],
        });
        const newer = buildThreadGraphNode({
            event: createEvent({ id: "3".repeat(64), created_at: 200 }),
            sources: ["reply-db"],
        });

        expect(sortEventIdsByEvent([newer.eventId, older.eventId], {
            [newer.eventId]: newer,
            [older.eventId]: older,
        })).toEqual([older.eventId, newer.eventId]);
    });
});
