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
});