import { describe, expect, it, vi } from "vitest";
import {
    RepositoryPostHistoryDirectReplyRecordsAdapter,
    RepositoryPostHistoryReactionRecordsAdapter,
} from "../../lib/postHistoryChildInteractionsAdapter";

const FIRST_PARENT_ID = "1".repeat(64);
const SECOND_PARENT_ID = "2".repeat(64);

function record(input: {
    eventId: string;
    parentEventId: string;
    kind: 1 | 7 | 42;
    createdAt: number;
}) {
    return {
        ...input,
        id: input.eventId,
        rootEventId: input.parentEventId,
        authorPubkey: "a".repeat(64),
        content: "",
        tags: [],
        rawEvent: {
            id: input.eventId,
            pubkey: "a".repeat(64),
            created_at: input.createdAt,
            kind: input.kind,
            tags: [],
            content: "",
            sig: "b".repeat(128),
        },
        relayUrls: [],
        discoveredAs: input.kind === 7 ? ["reaction"] : ["direct-reply"],
        fetchedAt: input.createdAt,
        updatedAt: input.createdAt,
        schemaVersion: 1,
    };
}

describe("Repository post-history child-interaction adapters", () => {
    it("reads and sorts reaction records for multiple parents with one repository batch", async () => {
        const getChildInteractionsForParents = vi.fn(async () => [
            record({ eventId: "reaction-second", parentEventId: SECOND_PARENT_ID, kind: 7, createdAt: 4 }),
            record({ eventId: "reply", parentEventId: FIRST_PARENT_ID, kind: 1, createdAt: 1 }),
            record({ eventId: "reaction-later", parentEventId: FIRST_PARENT_ID, kind: 7, createdAt: 3 }),
            record({ eventId: "reaction-first", parentEventId: FIRST_PARENT_ID, kind: 7, createdAt: 2 }),
        ]);
        const adapter = new RepositoryPostHistoryReactionRecordsAdapter({
            getChildInteractions: vi.fn(),
            getChildInteractionsForParents,
        });

        await expect(adapter.getReactionRecordsForParents([
            FIRST_PARENT_ID,
            SECOND_PARENT_ID,
            FIRST_PARENT_ID,
        ])).resolves.toMatchObject([
            { eventId: "reaction-first" },
            { eventId: "reaction-later" },
            { eventId: "reaction-second" },
        ]);
        expect(getChildInteractionsForParents).toHaveBeenCalledTimes(1);
        expect(getChildInteractionsForParents).toHaveBeenCalledWith([
            FIRST_PARENT_ID,
            SECOND_PARENT_ID,
        ]);
    });

    it("reads and sorts direct replies for multiple parents with one repository batch", async () => {
        const getChildInteractionsForParents = vi.fn(async () => [
            record({ eventId: "reaction", parentEventId: FIRST_PARENT_ID, kind: 7, createdAt: 1 }),
            record({ eventId: "reply-second", parentEventId: SECOND_PARENT_ID, kind: 42, createdAt: 4 }),
            record({ eventId: "reply-later", parentEventId: FIRST_PARENT_ID, kind: 1, createdAt: 3 }),
            record({ eventId: "reply-first", parentEventId: FIRST_PARENT_ID, kind: 1, createdAt: 2 }),
        ]);
        const adapter = new RepositoryPostHistoryDirectReplyRecordsAdapter({
            getDirectReplyInteractions: vi.fn(),
            getChildInteractionsForParents,
        });

        await expect(adapter.getDirectReplyRecordsForParents([
            FIRST_PARENT_ID,
            SECOND_PARENT_ID,
        ])).resolves.toMatchObject([
            { eventId: "reply-first" },
            { eventId: "reply-later" },
            { eventId: "reply-second" },
        ]);
        expect(getChildInteractionsForParents).toHaveBeenCalledTimes(1);
    });
});
