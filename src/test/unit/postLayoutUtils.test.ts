import { describe, expect, it } from "vitest";

import {
    POST_EDITOR_COMPACT_MIN_HEIGHT,
    POST_EDITOR_COMPACT_MIN_LINES,
    POST_EDITOR_MIN_HEIGHT,
    POST_EDITOR_MIN_LINES,
} from "../../lib/postLayoutUtils";

describe("postLayoutUtils", () => {
    it("editor の最低行数は 4 行に固定する", () => {
        expect(POST_EDITOR_MIN_LINES).toBe(4);
    });

    it("editor の最低高は 4 行ぶんの高さに固定する", () => {
        expect(POST_EDITOR_MIN_HEIGHT).toBe(152);
    });

    it("emoji picker 表示中の editor compact 高は 2 行ぶんにする", () => {
        expect(POST_EDITOR_COMPACT_MIN_LINES).toBe(2);
        expect(POST_EDITOR_COMPACT_MIN_HEIGHT).toBe(92);
    });
});
