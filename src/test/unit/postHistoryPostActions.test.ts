import { fireEvent, render, screen } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { describe, expect, it, vi } from "vitest";

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => key),
}));

import PostHistoryPostActions from "../../components/PostHistoryPostActions.svelte";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";

function createPost(eventId: string): PostHistoryRecord {
    return {
        id: eventId,
        eventId,
        pubkeyHex: "a".repeat(64),
        kind: 1,
        content: "post",
        tags: [],
        createdAt: 1_700_000_000_000,
        postedAt: 1_700_000_000_000,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: null,
        updatedAt: 1_700_000_000_000,
        schemaVersion: 1,
    };
}

describe("PostHistoryPostActions", () => {
    it("uses the supplied post for both shared actions and keeps their labels", async () => {
        const post = createPost("1".repeat(64));
        const onReplyPost = vi.fn();
        const onQuotePost = vi.fn();

        render(PostHistoryPostActions, {
            props: { post, onReplyPost, onQuotePost },
        });

        const reply = screen.getByRole("button", {
            name: "replyQuote.reply_label",
        });
        const quote = screen.getByRole("button", {
            name: "replyQuote.quote_label",
        });
        expect(reply.querySelector(".reply-icon")).toBeTruthy();
        expect(quote.querySelector(".quote-icon")).toBeTruthy();

        await fireEvent.click(reply);
        await fireEvent.click(quote);

        expect(onReplyPost).toHaveBeenCalledWith(post);
        expect(onQuotePost).toHaveBeenCalledWith(post);
    });

    it("only renders actions whose existing callbacks are available", () => {
        render(PostHistoryPostActions, {
            props: {
                post: createPost("2".repeat(64)),
                onQuotePost: vi.fn(),
            },
        });

        expect(screen.queryByRole("button", {
            name: "replyQuote.reply_label",
        })).toBeNull();
        expect(screen.getByRole("button", {
            name: "replyQuote.quote_label",
        })).toBeTruthy();
    });

    it.each([
        { label: "with a channel root", tags: [["e", "c".repeat(64), "", "root"]], deletedAt: undefined, visible: true },
        { label: "without a channel root", tags: [], deletedAt: undefined, visible: false },
        { label: "when deleted", tags: [["e", "c".repeat(64), "", "root"]], deletedAt: 1, visible: false },
    ])("renders channel reply and quote buttons $label", ({ tags, deletedAt, visible }) => {
        const post = { ...createPost("3".repeat(64)), kind: 42, tags, deletedAt };
        render(PostHistoryPostActions, {
            props: { post, onReplyPost: vi.fn(), onQuotePost: vi.fn() },
        });

        for (const name of ["replyQuote.reply_label", "replyQuote.quote_label"]) {
            expect(screen.queryAllByRole("button", { name })).toHaveLength(visible ? 1 : 0);
        }
    });
});
