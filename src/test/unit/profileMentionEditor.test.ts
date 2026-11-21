import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { nip19 } from "nostr-tools";
import { expect, it, vi } from "vitest";
import { tick } from "svelte";
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

it("cancels the avatar lookup when the inline mention is removed", async () => {
    const load = vi.fn(async (_mention, _signal: AbortSignal) => null);
    const editor = new Editor({
        element: document.createElement("div"),
        extensions: [StarterKit, ProfileMentionExtension.configure({
            profileSource: { readProfile: () => null, getInlineLoader: () => load },
        })],
    });
    try {
        const pubkey = "b".repeat(64);
        expect(insertProfileMention(editor, { pubkey, relayHints: [], label: "Alice" })).toBe(true);
        await tick();
        expect(load).toHaveBeenCalledOnce();
        const [target, signal] = load.mock.calls[0]!;
        expect(target).toEqual({ pubkey, relayHints: [] });
        expect(signal.aborted).toBe(false);

        editor.commands.clearContent();
        await tick();
        expect(signal.aborted).toBe(true);
    } finally {
        editor.destroy();
    }
});
