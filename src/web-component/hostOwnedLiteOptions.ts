import type { EHagakiHostOwnedComposerOptions } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveSafeInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
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
        ...(value.enterKeyBehavior !== undefined
            ? { enterKeyBehavior: value.enterKeyBehavior }
            : {}),
        ...(hasEditorMinLines
            ? {
                editorMinLines,
                editorMaxLines,
            }
            : {}),
    };
}
