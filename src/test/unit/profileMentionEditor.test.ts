import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { nip19 } from "nostr-tools";
import { expect, it } from "vitest";
import { sanitizeDraftHtml } from "../../lib/draftHtmlSanitizer";
import { ClipboardExtension } from "../../lib/editor/clipboardExtension";
import { insertProfileMention, ProfileMentionExtension } from "../../lib/editor/profileMentionExtension";
import { extractPostContentFromDoc } from "../../lib/utils/editorDocumentUtils";

it("restores the mention from a saved draft and copies its Nostr URI", () => {
    const editor = new Editor({
        element: document.createElement("div"),
        extensions: [StarterKit, ProfileMentionExtension, ClipboardExtension],
        content: "<p>Hello</p>",
    });
    try {
        const pubkey = "a".repeat(64);
        const uri = `nostr:${nip19.npubEncode(pubkey)}`;
        editor.commands.setTextSelection(6);
        expect(insertProfileMention(editor, { pubkey, relayHints: [], label: "Alice" })).toBe(true);
        const draft = sanitizeDraftHtml(editor.getHTML());
        expect(draft).toContain(`<span data-nostr-mention="${uri}">@Alice</span>`);
        editor.commands.clearContent();
        editor.commands.setContent(draft);
        expect(editor.view.dom.querySelector("[data-nostr-mention]")?.textContent).toBe("@Alice");
        expect(extractPostContentFromDoc(editor.state.doc).content.trim()).toBe(`Hello ${uri}`);

        editor.commands.selectAll();
        const clipboardText = editor.view.someProp("clipboardTextSerializer",
            serialize => serialize(editor.state.selection.content(), editor.view));
        expect(clipboardText?.trim()).toBe(`Hello ${uri}`);
    } finally {
        editor.destroy();
    }
});
