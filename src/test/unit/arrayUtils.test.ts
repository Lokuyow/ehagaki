import { describe, expect, it } from "vitest";
import { chunkArray } from "../../lib/utils/arrayUtils";

describe("chunkArray", () => {
    it("splits into fixed-size chunks with a shorter last chunk", () => {
        expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("returns no chunks for an empty array", () => {
        expect(chunkArray([], 3)).toEqual([]);
    });
});
