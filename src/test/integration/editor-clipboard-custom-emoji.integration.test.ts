import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import type { Slice } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import { locale } from 'svelte-i18n';
import { ClipboardExtension } from '../../lib/editor/clipboardExtension';
import { CustomEmoji } from '../../lib/editor/customEmojiExtension';
import { Video } from '../../lib/editor/videoExtension';

type EditorContent = {
    type: 'doc';
    content: Array<Record<string, unknown>>;
};

function createClipboardEditor(): Editor {
    locale.set('en');
    return new Editor({
        extensions: [
            StarterKit.configure({
                link: false,
            }),
            Image.configure({ allowBase64: false }),
            Video,
            CustomEmoji,
            ClipboardExtension,
        ],
        content: '<p></p>',
    });
}

function customEmoji(shortcode = 'wave'): Record<string, unknown> {
    return {
        type: 'customEmoji',
        attrs: {
            identityKey: `identity-${shortcode}`,
            shortcode,
            src: 'https://example.com/wave.webp',
            setAddress: null,
        },
    };
}

function paragraph(...content: Array<Record<string, unknown>>): Record<string, unknown> {
    return { type: 'paragraph', content };
}

function text(text: string): Record<string, unknown> {
    return { type: 'text', text };
}

function serializeRegisteredClipboardText(editor: Editor, slice = editor.state.doc.slice(0, editor.state.doc.content.size)): string {
    const serializer = editor.state.plugins
        .map((plugin) => plugin.props.clipboardTextSerializer)
        .find((value): value is (slice: Slice) => string => typeof value === 'function');

    expect(serializer).toBeTypeOf('function');
    return serializer!(slice);
}

describe('ClipboardExtension custom emoji text serialization', () => {
    let editor: Editor;

    afterEach(() => {
        editor?.destroy();
    });

    it('preserves text around a custom emoji in the registered clipboard serializer', () => {
        editor = createClipboardEditor();
        editor.commands.setContent({
            type: 'doc',
            content: [paragraph(text('A'), customEmoji(), text('B'))],
        } satisfies EditorContent);

        expect(serializeRegisteredClipboardText(editor)).toBe('A:wave:B');
    });

    it('serializes a paragraph containing only a custom emoji', () => {
        editor = createClipboardEditor();
        editor.commands.setContent({
            type: 'doc',
            content: [paragraph(customEmoji())],
        } satisfies EditorContent);

        expect(serializeRegisteredClipboardText(editor)).toBe(':wave:');
    });

    it('preserves paragraph boundaries and empty paragraphs around custom emoji', () => {
        editor = createClipboardEditor();
        editor.commands.setContent({
            type: 'doc',
            content: [
                paragraph(text('A'), customEmoji('one')),
                paragraph(),
                paragraph(customEmoji('two'), text('B')),
            ],
        } satisfies EditorContent);

        expect(serializeRegisteredClipboardText(editor)).toBe('A:one:\n\n:two:B');
    });

    it('serializes a partial selection containing a custom emoji', () => {
        editor = createClipboardEditor();
        editor.commands.setContent({
            type: 'doc',
            content: [paragraph(text('A'), customEmoji(), text('B'))],
        } satisfies EditorContent);

        const selection = TextSelection.create(editor.state.doc, 2, 3);
        expect(serializeRegisteredClipboardText(editor, selection.content())).toBe(':wave:');
    });

    it('keeps existing text, media URL, and video URL serialization', () => {
        editor = createClipboardEditor();
        editor.commands.setContent({
            type: 'doc',
            content: [
                paragraph(text('first')),
                { type: 'image', attrs: { src: 'https://example.com/image.png' } },
                { type: 'video', attrs: { src: 'https://example.com/video.mp4' } },
                paragraph(text('last')),
            ],
        } satisfies EditorContent);

        expect(serializeRegisteredClipboardText(editor)).toBe(
            'first\nhttps://example.com/image.png\nhttps://example.com/video.mp4\nlast',
        );
    });
});
