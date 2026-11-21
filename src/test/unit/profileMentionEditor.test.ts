import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Slice } from "@tiptap/pm/model";
import { nip19 } from "nostr-tools";
import { expect, it, vi } from "vitest";
import { tick } from "svelte";
import { sanitizeDraftHtml } from "../../lib/draftHtmlSanitizer";
import { ClipboardExtension } from "../../lib/editor/clipboardExtension";
import { ContentTrackingExtension } from "../../lib/editor/contentTracking";
import { MediaPasteExtension } from "../../lib/editor/mediaPaste";
import { insertProfileMention, ProfileMentionExtension } from "../../lib/editor/profileMentionExtension.svelte";
import { extractPostContentFromDoc } from "../../lib/utils/editorDocumentUtils";
import { mediaFreePlacementStore } from "../../stores/uploadStore.svelte";
import { mediaGalleryStore } from "../../stores/mediaGalleryStore.svelte";

vi.unmock("../../stores/uploadStore.svelte");

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

const imageUrl = "https://example.com/photo.png";
const mentionUris = ["a", "b"].map(hex => `nostr:${nip19.npubEncode(hex.repeat(64))}`);
const savedMention = (uri: string) => `<span data-nostr-mention="${uri}">@Alice</span>`;

it.each([false, true])("converts a typed image URL after two mentions (free placement: %s)", freePlacement => {
    const previousMode = mediaFreePlacementStore.value;
    mediaFreePlacementStore.set(freePlacement);
    const editor = new Editor({
        extensions: [StarterKit.configure({ link: { autolink: false } }), ProfileMentionExtension, Image,
            ContentTrackingExtension.configure({ enableHashtags: false, enableImageConversion: true })],
        content: `<p>${mentionUris.map(savedMention).join(" ")} text</p>`,
    });
    try {
        editor.view.dispatch(editor.state.tr.insertText(` ${imageUrl}`, editor.state.doc.firstChild!.nodeSize - 1));
        expect(extractPostContentFromDoc(editor.state.doc).content).toContain(`${mentionUris.join(" ")} text`);
        expect(editor.state.doc.textContent).not.toContain(".png");
        if (freePlacement) {
            expect(editor.getHTML()).toContain(`src="${imageUrl}"`);
        } else {
            expect(mediaGalleryStore.getContentUrls()).toEqual([imageUrl]);
        }
    } finally {
        editor.destroy();
        mediaFreePlacementStore.set(previousMode);
        mediaGalleryStore.clearAll();
    }
});

it("preserves both mention-only paragraphs when pasting an image into one", () => {
    const previousMode = mediaFreePlacementStore.value;
    mediaFreePlacementStore.set(true);
    const editor = new Editor({
        extensions: [StarterKit, ProfileMentionExtension, Image, MediaPasteExtension],
        content: mentionUris.map(uri => `<p>${savedMention(uri)}</p>`).join(""),
    });
    try {
        editor.commands.setTextSelection(2);
        const event = Object.assign(new Event("paste", { cancelable: true }), {
            clipboardData: { getData: () => imageUrl, files: [], items: [] },
        }) as unknown as ClipboardEvent;
        expect(editor.view.someProp("handlePaste", handle => handle(editor.view, event, Slice.empty))).toBe(true);
        const saved = editor.getHTML();
        for (const uri of mentionUris) expect(saved).toContain(`data-nostr-mention="${uri}"`);
        expect(saved).toContain(`src="${imageUrl}"`);
    } finally {
        editor.destroy();
        mediaFreePlacementStore.set(previousMode);
    }
});
