import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { nip19 } from "nostr-tools";
import { expect, it } from "vitest";
import { sanitizeDraftHtml } from "../../lib/draftHtmlSanitizer";
import { ClipboardExtension } from "../../lib/editor/clipboardExtension";
import { insertProfileMention, ProfileMentionExtension } from "../../lib/editor/profileMentionExtension";
import { extractPostContentFromDoc } from "../../lib/utils/editorDocumentUtils";

it.each([
    { label: "Alice", display: "Alice" },
    { label: `${"寿".repeat(23)}👩🏽‍💻アリス`, display: `${"寿".repeat(23)}👩🏽‍💻…` },
])("restores the display label from a saved draft and copies its Nostr URI", ({ label, display }) => {
    const editor = new Editor({
        element: document.createElement("div"),
        extensions: [StarterKit, ProfileMentionExtension, ClipboardExtension],
        content: "<p>Hello</p>",
    });
    try {
        const pubkey = "a".repeat(64);
        const uri = `nostr:${nip19.npubEncode(pubkey)}`;
        editor.commands.setTextSelection(6);
        expect(insertProfileMention(editor, { pubkey, relayHints: [], label })).toBe(true);
        const draft = sanitizeDraftHtml(editor.getHTML());
        expect(draft).toContain(`<span data-nostr-mention="${uri}">@${display}</span>`);
        editor.commands.clearContent();
        const olderDraft = `<p>Hello <span data-nostr-mention="${uri}">@${label}</span></p>`;
        editor.commands.setContent(sanitizeDraftHtml(olderDraft));
        expect(editor.view.dom.querySelector("[data-nostr-mention]")?.textContent).toBe(`@${display}`);
        expect(extractPostContentFromDoc(editor.state.doc).content.trim()).toBe(`Hello ${uri}`);

        editor.commands.selectAll();
        const clipboardText = editor.view.someProp("clipboardTextSerializer",
            serialize => serialize(editor.state.selection.content(), editor.view));
        expect(clipboardText?.trim()).toBe(`Hello ${uri}`);
    } finally {
        editor.destroy();
    }
});
