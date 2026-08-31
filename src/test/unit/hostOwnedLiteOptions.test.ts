import { describe, expect, it } from "vitest";

import { validateHostOwnedOptions } from "../../web-component/hostOwnedLiteOptions";
import type { EHagakiHostSubmitShortcutModifier } from "../../web-component/types";

const submit = () => undefined;

describe("Host-owned Lite mount options", () => {
    it("keeps editor auto-grow disabled when both line options are omitted", () => {
        expect(validateHostOwnedOptions({ submit })).toEqual({ submit });
    });

    it("accepts and snapshots the optional Editor submit surface toggle", () => {
        const options = { submit, editorSubmitButtonEnabled: true };
        const snapshot = validateHostOwnedOptions(options);
        options.editorSubmitButtonEnabled = false;

        expect(snapshot).toEqual({ submit, editorSubmitButtonEnabled: true });
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

    it("accepts multiple exact submit shortcuts and snapshots all three levels", () => {
        const modifiers = ["ctrlOrMeta"] as EHagakiHostSubmitShortcutModifier[];
        const shortcut = { id: "primary", modifiers };
        const submitShortcuts = [shortcut];
        const snapshot = validateHostOwnedOptions({ submit, submitShortcuts });

        submitShortcuts.push({ id: "secondary", modifiers: ["alt"] });
        shortcut.id = "changed";
        modifiers[0] = "shift";

        expect(snapshot.submitShortcuts).toEqual([
            { id: "primary", modifiers: ["ctrlOrMeta"] },
        ]);
        expect(snapshot.submitShortcuts).not.toBe(submitShortcuts);
        expect(snapshot.submitShortcuts?.[0]).not.toBe(shortcut);
        expect(snapshot.submitShortcuts?.[0].modifiers).not.toBe(modifiers);
    });

    it("preserves an explicit empty shortcut list", () => {
        expect(validateHostOwnedOptions({ submit, submitShortcuts: [] })).toEqual({
            submit,
            submitShortcuts: [],
        });
    });

    it("allows duplicate IDs when their physical states do not overlap", () => {
        expect(validateHostOwnedOptions({
            submit,
            submitShortcuts: [
                { id: "same", modifiers: ["ctrl"] },
                { id: "same", modifiers: ["meta"] },
            ],
        }).submitShortcuts).toEqual([
            { id: "same", modifiers: ["ctrl"] },
            { id: "same", modifiers: ["meta"] },
        ]);
    });

    it.each([
        { name: "non-array", submitShortcuts: {} },
        { name: "non-object item", submitShortcuts: [null] },
        { name: "blank id", submitShortcuts: [{ id: "  ", modifiers: ["ctrl"] }] },
        { name: "non-string id", submitShortcuts: [{ id: 1, modifiers: ["ctrl"] }] },
        { name: "non-array modifiers", submitShortcuts: [{ id: "x", modifiers: "ctrl" }] },
        { name: "empty modifiers", submitShortcuts: [{ id: "x", modifiers: [] }] },
        { name: "unknown modifier", submitShortcuts: [{ id: "x", modifiers: ["capsLock"] }] },
        { name: "duplicate modifier", submitShortcuts: [{ id: "x", modifiers: ["ctrl", "ctrl"] }] },
        { name: "ctrlOrMeta with ctrl", submitShortcuts: [{ id: "x", modifiers: ["ctrlOrMeta", "ctrl"] }] },
        { name: "ctrlOrMeta with meta", submitShortcuts: [{ id: "x", modifiers: ["ctrlOrMeta", "meta"] }] },
        {
            name: "overlap after ctrlOrMeta expansion",
            submitShortcuts: [
                { id: "x", modifiers: ["ctrlOrMeta"] },
                { id: "y", modifiers: ["ctrl"] },
            ],
        },
        {
            name: "overlap independent of modifier order",
            submitShortcuts: [
                { id: "x", modifiers: ["ctrl", "shift"] },
                { id: "y", modifiers: ["shift", "ctrl"] },
            ],
        },
    ])("rejects invalid submit shortcut configuration: $name", ({ submitShortcuts }) => {
        expect(() => validateHostOwnedOptions({ submit, submitShortcuts })).toThrow(TypeError);
    });

    it.each([
        { editorSubmitButtonEnabled: "true" },
        { editorSubmitButtonEnabled: 1 },
        { editorSubmitButtonEnabled: null },
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
