import type { Editor as TipTapEditor } from "@tiptap/core";
import type { CustomEmojiAttrs } from "./customEmojiExtension";
import { isTouchDevice } from "../utils/appDomUtils";

export function insertCustomEmojiWithoutUnwantedKeyboard(
    editor: TipTapEditor,
    emoji: CustomEmojiAttrs,
): void {
    const editorElement = editor.view.dom;
    const shouldAvoidFocus =
        isTouchDevice() && document.activeElement !== editorElement;

    if (shouldAvoidFocus) {
        editor.commands.insertCustomEmoji(emoji);
        return;
    }

    editor.chain().focus().insertCustomEmoji(emoji).run();
}
