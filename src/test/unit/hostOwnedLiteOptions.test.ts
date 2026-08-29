import { describe, expect, it } from "vitest";

import { validateHostOwnedOptions } from "../../web-component/hostOwnedLiteOptions";

const submit = () => undefined;

describe("Host-owned Lite mount options", () => {
    it("keeps editor auto-grow disabled when both line options are omitted", () => {
        expect(validateHostOwnedOptions({ submit })).toEqual({ submit });
    });

    it("accepts and preserves valid editor auto-grow pairs, including an equal range", () => {
        expect(validateHostOwnedOptions({
            submit,
            editorMinLines: 1,
            editorMaxLines: 3,
        })).toEqual({ submit, editorMinLines: 1, editorMaxLines: 3 });
        expect(validateHostOwnedOptions({
            submit,
            editorMinLines: 1,
            editorMaxLines: 1,
        })).toEqual({ submit, editorMinLines: 1, editorMaxLines: 1 });
    });

    it.each([
        { editorMinLines: 1 },
        { editorMaxLines: 3 },
        { editorMinLines: 0, editorMaxLines: 1 },
        { editorMinLines: -1, editorMaxLines: 1 },
        { editorMinLines: 1.5, editorMaxLines: 2 },
        { editorMinLines: Number.NaN, editorMaxLines: 2 },
        { editorMinLines: 1, editorMaxLines: Number.POSITIVE_INFINITY },
        { editorMinLines: Number.MAX_SAFE_INTEGER + 1, editorMaxLines: Number.MAX_SAFE_INTEGER + 1 },
        { editorMinLines: "1", editorMaxLines: 3 },
        { editorMinLines: 3, editorMaxLines: "3" },
        { editorMinLines: 3, editorMaxLines: 1 },
    ])("rejects invalid editor line configuration %#", (options) => {
        expect(() => validateHostOwnedOptions({ submit, ...options })).toThrow(TypeError);
    });
});
