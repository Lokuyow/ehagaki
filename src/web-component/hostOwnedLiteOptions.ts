import type {
    EHagakiHostOwnedComposerOptions,
    EHagakiHostSubmitShortcut,
    EHagakiHostSubmitShortcutModifier,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveSafeInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

const SUBMIT_SHORTCUT_MODIFIER_BITS = {
    ctrl: 1,
    meta: 2,
    alt: 4,
    shift: 8,
} as const;

const SUBMIT_SHORTCUT_MODIFIERS = new Set<EHagakiHostSubmitShortcutModifier>([
    "ctrl",
    "meta",
    "ctrlOrMeta",
    "alt",
    "shift",
]);

function getSubmitShortcutStates(
    modifiers: readonly EHagakiHostSubmitShortcutModifier[],
): number[] {
    let requiredBits = 0;
    const usesCtrlOrMeta = modifiers.includes("ctrlOrMeta");

    for (const modifier of modifiers) {
        if (modifier === "ctrlOrMeta") continue;
        requiredBits |= SUBMIT_SHORTCUT_MODIFIER_BITS[modifier];
    }

    if (usesCtrlOrMeta) {
        return [requiredBits | SUBMIT_SHORTCUT_MODIFIER_BITS.ctrl, requiredBits | SUBMIT_SHORTCUT_MODIFIER_BITS.meta];
    }
    return [requiredBits];
}

function validateAndSnapshotSubmitShortcuts(value: unknown): readonly EHagakiHostSubmitShortcut[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value)) {
        throw new TypeError("submitShortcuts must be an array when provided.");
    }

    const occupiedStates = new Set<number>();
    const snapshot: EHagakiHostSubmitShortcut[] = [];

    for (const shortcut of value) {
        if (!isRecord(shortcut)) {
            throw new TypeError("Each submitShortcuts item must be an object.");
        }
        if (typeof shortcut.id !== "string" || shortcut.id.trim() === "") {
            throw new TypeError("Each submitShortcuts item requires a non-blank string id.");
        }
        if (!Array.isArray(shortcut.modifiers) || shortcut.modifiers.length === 0) {
            throw new TypeError("Each submitShortcuts item requires a non-empty modifiers array.");
        }

        const modifiers: EHagakiHostSubmitShortcutModifier[] = [];
        const seenModifiers = new Set<string>();
        for (const modifier of shortcut.modifiers) {
            if (typeof modifier !== "string" || !SUBMIT_SHORTCUT_MODIFIERS.has(modifier as EHagakiHostSubmitShortcutModifier)) {
                throw new TypeError("submitShortcuts contains an unknown modifier.");
            }
            if (seenModifiers.has(modifier)) {
                throw new TypeError("submitShortcuts cannot contain duplicate modifiers.");
            }
            seenModifiers.add(modifier);
            modifiers.push(modifier as EHagakiHostSubmitShortcutModifier);
        }
        if (
            modifiers.includes("ctrlOrMeta")
            && (modifiers.includes("ctrl") || modifiers.includes("meta"))
        ) {
            throw new TypeError("ctrlOrMeta cannot be combined with ctrl or meta.");
        }

        for (const state of getSubmitShortcutStates(modifiers)) {
            if (occupiedStates.has(state)) {
                throw new TypeError("submitShortcuts cannot contain overlapping modifier states.");
            }
            occupiedStates.add(state);
        }

        snapshot.push(Object.freeze({
            id: shortcut.id,
            modifiers: Object.freeze([...modifiers]),
        }));
    }

    return Object.freeze(snapshot);
}

/** Validates and snapshots immutable Host-owned Lite mount options. */
export function validateHostOwnedOptions(value: unknown): EHagakiHostOwnedComposerOptions {
    if (!isRecord(value) || typeof value.submit !== "function") {
        throw new TypeError("Host-owned Composer requires a submit handler.");
    }
    if (value.uploadMedia !== undefined && typeof value.uploadMedia !== "function") {
        throw new TypeError("uploadMedia must be a function when provided.");
    }
    if (value.contentWarningEnabled !== undefined && typeof value.contentWarningEnabled !== "boolean") {
        throw new TypeError("contentWarningEnabled must be a boolean when provided.");
    }
    if (value.hashtagPinEnabled !== undefined && typeof value.hashtagPinEnabled !== "boolean") {
        throw new TypeError("hashtagPinEnabled must be a boolean when provided.");
    }
    if (value.keyboardButtonBarEnabled !== undefined && typeof value.keyboardButtonBarEnabled !== "boolean") {
        throw new TypeError("keyboardButtonBarEnabled must be a boolean when provided.");
    }
    if (value.editorSubmitButtonEnabled !== undefined && typeof value.editorSubmitButtonEnabled !== "boolean") {
        throw new TypeError("editorSubmitButtonEnabled must be a boolean when provided.");
    }
    if (
        value.enterKeyBehavior !== undefined
        && value.enterKeyBehavior !== "newline"
        && value.enterKeyBehavior !== "submit"
    ) {
        throw new TypeError("enterKeyBehavior must be \"newline\" or \"submit\" when provided.");
    }

    const hasEditorMinLines = value.editorMinLines !== undefined;
    const hasEditorMaxLines = value.editorMaxLines !== undefined;
    if (hasEditorMinLines !== hasEditorMaxLines) {
        throw new TypeError("editorMinLines and editorMaxLines must be provided together.");
    }
    if (
        hasEditorMinLines
        && (!isPositiveSafeInteger(value.editorMinLines)
            || !isPositiveSafeInteger(value.editorMaxLines)
            || value.editorMinLines > value.editorMaxLines)
    ) {
        throw new TypeError(
            "editorMinLines and editorMaxLines must be positive safe integers with editorMinLines <= editorMaxLines.",
        );
    }

    const submit = value.submit as EHagakiHostOwnedComposerOptions["submit"];
    const uploadMedia = value.uploadMedia as EHagakiHostOwnedComposerOptions["uploadMedia"];
    const editorMinLines = value.editorMinLines as number | undefined;
    const editorMaxLines = value.editorMaxLines as number | undefined;
    const submitShortcuts = validateAndSnapshotSubmitShortcuts(value.submitShortcuts);

    return {
        submit,
        ...(uploadMedia ? { uploadMedia } : {}),
        ...(value.contentWarningEnabled !== undefined
            ? { contentWarningEnabled: value.contentWarningEnabled }
            : {}),
        ...(value.hashtagPinEnabled !== undefined
            ? { hashtagPinEnabled: value.hashtagPinEnabled }
            : {}),
        ...(value.keyboardButtonBarEnabled !== undefined
            ? { keyboardButtonBarEnabled: value.keyboardButtonBarEnabled }
            : {}),
        ...(value.editorSubmitButtonEnabled !== undefined
            ? { editorSubmitButtonEnabled: value.editorSubmitButtonEnabled }
            : {}),
        ...(value.enterKeyBehavior !== undefined
            ? { enterKeyBehavior: value.enterKeyBehavior }
            : {}),
        ...(submitShortcuts !== undefined ? { submitShortcuts } : {}),
        ...(hasEditorMinLines
            ? {
                editorMinLines,
                editorMaxLines,
            }
            : {}),
    };
}
