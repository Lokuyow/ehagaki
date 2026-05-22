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

    it("kind:7 reactionは入口だけ分類し保存対象にしない", () => {
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
            reason: "reaction-not-implemented",
        });
    });
});
