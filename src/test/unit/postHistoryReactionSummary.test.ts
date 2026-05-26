import { describe, expect, it } from "vitest";
import {
    EMPTY_POST_HISTORY_REACTION_SUMMARY,
    summarizePostHistoryReactionRecords,
} from "../../lib/postHistoryReactionSummary";

describe("postHistoryReactionSummary", () => {
    it("kind:7だけをcontentごとに集約し、初出順を維持する", () => {
        expect(summarizePostHistoryReactionRecords([
            { kind: 7, content: "+" },
            { kind: 1, content: "reply" },
            { kind: 7, content: "👍" },
            { kind: 7, content: "+" },
            { kind: 7, content: "😂" },
            { kind: 7, content: "👍" },
        ])).toEqual({
            totalCount: 5,
            groups: [
                { content: "+", count: 2 },
                { content: "👍", count: 2 },
                { content: "😂", count: 1 },
            ],
        });
    });

    it("reactionがなければ空summaryを返す", () => {
        expect(summarizePostHistoryReactionRecords([
            { kind: 1, content: "reply" },
        ])).toEqual(EMPTY_POST_HISTORY_REACTION_SUMMARY);
    });

    it("custom emoji reaction は最初の有効 url を保持し、後続 record で url を補完できる", () => {
        expect(summarizePostHistoryReactionRecords([
            { kind: 7, content: ":blobcat:" },
            {
                kind: 7,
                content: ":blobcat:",
                tags: [["emoji", "blobcat", "https://example.com/blobcat.webp"]],
            },
            {
                kind: 7,
                content: ":party:",
                tags: [
                    ["emoji", "party", "https://example.com/party-first.webp"],
                    ["emoji", "party", "https://example.com/party-second.webp"],
                ],
            },
            {
                kind: 7,
                content: ":party:",
                tags: [["emoji", "party", "https://example.com/party-third.webp"]],
            },
            {
                kind: 7,
                content: "abc",
                tags: [["emoji", "abc", "https://example.com/abc.webp"]],
            },
        ])).toEqual({
            totalCount: 5,
            groups: [
                {
                    content: ":blobcat:",
                    count: 2,
                    emojiUrl: "https://example.com/blobcat.webp",
                },
                {
                    content: ":party:",
                    count: 2,
                    emojiUrl: "https://example.com/party-first.webp",
                },
                { content: "abc", count: 1 },
            ],
        });
    });
});