import { describe, expect, it } from "vitest";
import { resolvePostHistoryReplyBadgePreloadParentIds } from "../../lib/hooks/usePostHistoryThreadGraph.svelte";

describe("resolvePostHistoryReplyBadgePreloadParentIds", () => {
    it("parentEventIdsが指定された場合も現在表示postsにあるparentだけをpreload対象にする", () => {
        const visibleParentId = "1".repeat(64);
        const hiddenParentId = "2".repeat(64);

        expect(resolvePostHistoryReplyBadgePreloadParentIds(
            [{ eventId: visibleParentId }],
            [hiddenParentId, visibleParentId, visibleParentId],
        )).toEqual([visibleParentId]);
    });

    it("parentEventIds未指定なら現在表示postsだけをpreload対象にする", () => {
        const firstParentId = "1".repeat(64);
        const secondParentId = "2".repeat(64);

        expect(resolvePostHistoryReplyBadgePreloadParentIds([
            { eventId: firstParentId },
            { eventId: secondParentId },
        ])).toEqual([firstParentId, secondParentId]);
    });
});
