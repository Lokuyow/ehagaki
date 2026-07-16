import { describe, expect, it } from "vitest";
import {
    buildAnchorNodeKey,
    buildInitialExpansionState,
    buildThreadGraphNode,
    mergeThreadGraphNode,
    resolvePostHistoryThreadContextDepth,
    resolvePostHistoryThreadContextIndentRem,
    sortEventIdsByEvent,
    toEventFromReplyRecord,
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

    it("親方向はanchorから遠い親ほど浅く、direct parentほど深いcompact depthにする", () => {
        expect(resolvePostHistoryThreadContextDepth(-6)).toBe(0);
        expect(resolvePostHistoryThreadContextDepth(-5)).toBe(0);
        expect(resolvePostHistoryThreadContextDepth(-4)).toBe(1);
        expect(resolvePostHistoryThreadContextDepth(-3)).toBe(2);
        expect(resolvePostHistoryThreadContextDepth(-2)).toBe(3);
        expect(resolvePostHistoryThreadContextDepth(-1)).toBe(4);
    });

    it("子方向はanchorから遠い子ほど深いcompact depthにする", () => {
        expect(resolvePostHistoryThreadContextDepth(0)).toBe(0);
        expect(resolvePostHistoryThreadContextDepth(1)).toBe(1);
        expect(resolvePostHistoryThreadContextDepth(2)).toBe(2);
        expect(resolvePostHistoryThreadContextDepth(3)).toBe(3);
    });

    it("thread graph のcompact indentは深いスレッドでも上限で止める", () => {
        expect(resolvePostHistoryThreadContextIndentRem(-5)).toBe(0);
        expect(resolvePostHistoryThreadContextIndentRem(-4)).toBe(0.5);
        expect(resolvePostHistoryThreadContextIndentRem(-3)).toBe(1);
        expect(resolvePostHistoryThreadContextIndentRem(-2)).toBe(1.5);
        expect(resolvePostHistoryThreadContextIndentRem(-1)).toBe(2);
        expect(resolvePostHistoryThreadContextIndentRem(1)).toBe(0.5);
        expect(resolvePostHistoryThreadContextIndentRem(2)).toBe(1);
        expect(resolvePostHistoryThreadContextIndentRem(3)).toBe(1.5);
        expect(resolvePostHistoryThreadContextIndentRem(4)).toBe(2);
        expect(resolvePostHistoryThreadContextIndentRem(5)).toBe(2.5);
        expect(resolvePostHistoryThreadContextIndentRem(20)).toBe(2.5);
    });

    it("reply cacheのrawEventがrecordと不一致ならrecord fieldsから再構築する", () => {
        const record = {
            eventId: "2".repeat(64),
            parentEventId: "1".repeat(64),
            authorPubkey: "a".repeat(64),
            kind: 42,
            content: "record content",
            tags: [
                ["e", "3".repeat(64), "", "root"],
                ["e", "1".repeat(64), "", "reply"],
            ],
            createdAt: 200,
            relayUrls: [],
            discoveredAs: ["direct-reply"],
            rawEvent: createEvent({
                id: "2".repeat(64),
                kind: 1,
                content: "stale raw content",
                tags: [],
                created_at: 100,
            }),
        } as any;

        expect(toEventFromReplyRecord(record)).toMatchObject({
            id: record.eventId,
            pubkey: record.authorPubkey,
            kind: 42,
            content: "record content",
            tags: record.tags,
            created_at: 200,
            sig: "",
        });
    });
});
