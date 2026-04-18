import { describe, expect, it } from "vitest";

import {
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
});