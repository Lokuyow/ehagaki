import { describe, expect, it } from "vitest";
import {
    postHistoryQuoteTargetDiscoveryAdapter,
    postHistoryReplyParentTargetDiscoveryAdapter,
} from "../../lib/postHistoryRelatedTargetDiscoveryAdapter";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import type { PostHistoryThreadGraphNode } from "../../lib/postHistoryThreadGraphUtils";
import type { NostrEvent } from "../../lib/types";

function createHex(seed: string): string {
    return seed.repeat(64).slice(0, 64);
}

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: createHex("a"),
        pubkey: createHex("b"),
        kind: 1,
        content: "",
        tags: [],
        created_at: 1,
        sig: createHex("c"),
        ...overrides,
    };
}

function createRecord(overrides: Partial<PostHistoryRecord> = {}): PostHistoryRecord {
    const eventId = overrides.eventId ?? createHex("1");
    const pubkeyHex = overrides.pubkeyHex ?? createHex("2");

    return {
        id: `record-${eventId}`,
        eventId,
        pubkeyHex,
        kind: 1,
        content: "",
        tags: [],
        createdAt: 1,
        postedAt: 1,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: createEvent({ id: eventId, pubkey: pubkeyHex, tags: overrides.tags ?? [] }),
        updatedAt: 1,
        schemaVersion: 1,
        ...overrides,
    };
}

function createNode(overrides: Partial<PostHistoryThreadGraphNode> = {}): PostHistoryThreadGraphNode {
    const event = overrides.event ?? createEvent();

    return {
        eventId: overrides.eventId ?? event.id,
        event,
        authorPubkey: overrides.authorPubkey ?? event.pubkey,
        rootEventId: overrides.rootEventId ?? null,
        parentEventId: overrides.parentEventId ?? null,
        profile: overrides.profile ?? null,
        relayUrls: overrides.relayUrls ?? [],
        sources: overrides.sources ?? ["history-record"],
    };
}

describe("postHistoryRelatedTargetDiscoveryAdapter", () => {
    it("builds a merged quote target index and preserves the first source event", () => {
        const targetEventId = createHex("9");
        const authorHint = createHex("8");
        const firstSourceEventId = createHex("1");
        const secondSourceEventId = createHex("2");

        const index = postHistoryQuoteTargetDiscoveryAdapter.buildIndex([
            createRecord({
                eventId: firstSourceEventId,
                relayHints: ["wss://post-a.example.com/"],
                acceptedRelays: ["wss://accepted.example.com/"],
                tags: [["q", targetEventId, "wss://quote-a.example.com/", authorHint]],
            }),
            createRecord({
                eventId: secondSourceEventId,
                fetchedRelays: ["wss://fetched.example.com/"],
                tags: [["q", targetEventId, "wss://quote-b.example.com/"]],
            }),
        ]);

        expect(index.byPostId[firstSourceEventId]).toHaveLength(1);
        expect(index.byPostId[secondSourceEventId]).toHaveLength(1);
        expect(index.contextsByEventId[targetEventId]).toEqual({
            eventId: targetEventId,
            sourceEventId: firstSourceEventId,
            authorHint,
            relayHints: [
                "wss://quote-a.example.com/",
                "wss://post-a.example.com/",
                "wss://accepted.example.com/",
                "wss://quote-b.example.com/",
                "wss://fetched.example.com/",
            ],
        });
    });

    it("converts a quote target context into a resolver descriptor", () => {
        const descriptor = postHistoryQuoteTargetDiscoveryAdapter.toDescriptor(
            {
                eventId: createHex("3"),
                sourceEventId: createHex("4"),
                authorHint: createHex("5"),
                relayHints: ["wss://relay.example.com/"],
            },
            "scope-quote",
        );

        expect(descriptor).toEqual({
            sourceEventId: createHex("4"),
            targetEventId: createHex("3"),
            relationKind: "quote",
            relayHints: ["wss://relay.example.com/"],
            authorHint: createHex("5"),
            scopeKey: "scope-quote",
        });
    });

    it("builds a reply parent discovery context and descriptor from NIP-10 tags", () => {
        const rootEventId = createHex("6");
        const parentEventId = createHex("7");
        const rootAuthorHint = createHex("a");
        const replyAuthorHint = createHex("b");
        const sourceEventId = createHex("c");
        const post = createRecord({
            eventId: sourceEventId,
            relayHints: ["wss://post.example.com/"],
            acceptedRelays: ["wss://accepted.example.com/"],
            fetchedRelays: ["wss://fetched.example.com/"],
        });
        const node = createNode({
            eventId: sourceEventId,
            parentEventId,
            relayUrls: ["wss://node.example.com/"],
            event: createEvent({
                id: sourceEventId,
                tags: [
                    ["e", rootEventId, "wss://root.example.com/", "root", rootAuthorHint],
                    ["e", parentEventId, "wss://reply.example.com/", "reply", replyAuthorHint],
                ],
            }),
        });

        const context = postHistoryReplyParentTargetDiscoveryAdapter.buildContext(
            post,
            sourceEventId,
            node,
        );

        expect(context).toEqual({
            sourceEventId,
            targetEventId: parentEventId,
            authorHint: replyAuthorHint,
            relayHints: [
                "wss://reply.example.com/",
                "wss://root.example.com/",
                "wss://node.example.com/",
                "wss://post.example.com/",
                "wss://accepted.example.com/",
                "wss://fetched.example.com/",
            ],
        });
        expect(
            postHistoryReplyParentTargetDiscoveryAdapter.toDescriptor(
                context!,
                "scope-reply-parent",
            ),
        ).toEqual({
            sourceEventId,
            targetEventId: parentEventId,
            relationKind: "reply-parent",
            relayHints: [
                "wss://reply.example.com/",
                "wss://root.example.com/",
                "wss://node.example.com/",
                "wss://post.example.com/",
                "wss://accepted.example.com/",
                "wss://fetched.example.com/",
            ],
            authorHint: replyAuthorHint,
            scopeKey: "scope-reply-parent",
        });
    });
});