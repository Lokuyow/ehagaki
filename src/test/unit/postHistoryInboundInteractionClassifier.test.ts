import { describe, expect, it } from "vitest";
import { classifyPostHistoryInboundInteraction } from "../../lib/postHistoryInboundInteractionClassifier";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);
const PARENT_ID = "1".repeat(64);
const ROOT_ID = "2".repeat(64);
const OTHER_PARENT_ID = "3".repeat(64);

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "f".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "hello",
        tags: [["p", OWNER_PUBKEY]],
        created_at: 100,
        sig: "c".repeat(128),
        ...overrides,
    };
}

describe("classifyPostHistoryInboundInteraction", () => {
    it("owner postHistory parentを持つkind:1をdirect-replyに分類する", () => {
        const event = createEvent({
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", ROOT_ID, "", "root"],
                ["e", PARENT_ID, "", "reply"],
            ],
        });

        expect(classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([PARENT_ID]),
        })).toMatchObject({
            type: "direct-reply",
            parentEventId: PARENT_ID,
            rootEventId: ROOT_ID,
            reason: "owner-post-parent",
        });
    });

    it("parentがあるがowner parent未確認のkind:1はdirect-reply-candidateに分類する", () => {
        const event = createEvent({
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", OTHER_PARENT_ID, "", "reply"],
            ],
        });

        expect(classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([PARENT_ID]),
        })).toMatchObject({
            type: "direct-reply-candidate",
            parentEventId: OTHER_PARENT_ID,
            reason: "owner-post-parent-unconfirmed",
        });
    });

    it("parent候補はrootがowner投稿でもmention-likeへ落とさない", () => {
        const event = createEvent({
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", PARENT_ID, "", "root"],
                ["e", OTHER_PARENT_ID, "", "reply"],
            ],
        });

        expect(classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([PARENT_ID]),
        })).toMatchObject({
            type: "direct-reply-candidate",
            parentEventId: OTHER_PARENT_ID,
        });
    });

    it("thread parentがないowner #p eventはmention-likeに分類する", () => {
        const event = createEvent({
            tags: [["p", OWNER_PUBKEY]],
        });

        expect(classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([PARENT_ID]),
        })).toMatchObject({
            type: "mention-like",
            parentEventId: null,
            reason: "mention-without-thread-parent",
        });
    });

    it("kind:7 reactionはtarget event付きでreactionに分類する", () => {
        const reaction = createEvent({
            kind: 7,
            content: "+",
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", PARENT_ID],
            ],
        });

        expect(classifyPostHistoryInboundInteraction({
            event: reaction,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([PARENT_ID]),
        })).toMatchObject({
            type: "reaction",
            targetEventId: PARENT_ID,
            targetAuthorPubkey: OWNER_PUBKEY,
            reason: "owner-post-reaction",
        });
    });

    it("channel rootとreplyを持つkind:42をdirect-replyに分類する", () => {
        const event = createEvent({
            kind: 42,
            tags: [
                ["e", ROOT_ID, "", "root"],
                ["e", PARENT_ID, "", "reply"],
                ["p", OWNER_PUBKEY],
            ],
        });

        expect(classifyPostHistoryInboundInteraction({
            event,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([PARENT_ID]),
        })).toMatchObject({
            type: "direct-reply",
            parentEventId: PARENT_ID,
            rootEventId: null,
            references: { channelEventId: ROOT_ID },
        });
    });

    it("kind:7 reactionはroot付きでも末尾の返信対象を優先する", () => {
        const reaction = createEvent({
            kind: 7,
            content: "🍬",
            tags: [
                ["e", ROOT_ID, "wss://root.example.com", "root", OWNER_PUBKEY],
                ["p", OWNER_PUBKEY],
                ["e", OTHER_PARENT_ID, "wss://reply.example.com", OWNER_PUBKEY],
            ],
        });

        expect(classifyPostHistoryInboundInteraction({
            event: reaction,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([ROOT_ID, OTHER_PARENT_ID]),
        })).toMatchObject({
            type: "reaction",
            targetEventId: OTHER_PARENT_ID,
            targetAuthorPubkey: OWNER_PUBKEY,
            reason: "owner-post-reaction",
        });
    });

    it("自分が自分の投稿へ付けたkind:7 reactionもreactionに分類する", () => {
        const reaction = createEvent({
            pubkey: OWNER_PUBKEY,
            kind: 7,
            content: "+",
            tags: [
                ["p", OWNER_PUBKEY],
                ["e", PARENT_ID],
            ],
        });

        expect(classifyPostHistoryInboundInteraction({
            event: reaction,
            ownerPubkeyHex: OWNER_PUBKEY,
            ownerPostEventIds: new Set([PARENT_ID]),
        })).toMatchObject({
            type: "reaction",
            targetEventId: PARENT_ID,
            targetAuthorPubkey: OWNER_PUBKEY,
            reason: "owner-post-reaction",
        });
    });
});
