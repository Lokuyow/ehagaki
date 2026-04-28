import { describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
    clampCustomEmojiPickerHeight,
    CUSTOM_EMOJI_PICKER_CHROME_HEIGHT,
    CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
    CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_HEIGHT,
    CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_OVERLAP,
    CUSTOM_EMOJI_PICKER_SEARCH_ROW_BORDER_HEIGHT,
    CUSTOM_EMOJI_PICKER_SEARCH_ROW_HEIGHT,
    findCustomEmojiByShortcode,
    getCustomEmojiCacheBatches,
    getCustomEmojiSuggestionItems,
    getEmojisCacheKey,
    getKind10030EmojiSetAddresses,
    mergeCustomEmojiItems,
    parseEmojiSetAddress,
    parseEmojiTags,
    readCachedCustomEmojiItems,
    readCustomEmojiPickerHeight,
    writeCachedCustomEmojiItems,
} from '../../lib/customEmoji';
import type { CustomEmojiItem } from '../../lib/customEmoji';
import { CustomEmoji } from '../../lib/editor/customEmojiExtension';
import { findCustomEmojiSuggestionMatch } from '../../lib/editor/customEmojiSuggestion';
import { extractPostContentFromDoc } from '../../lib/utils/editorDocumentUtils';

const emojiItems: CustomEmojiItem[] = [
    { shortcode: 'kubi', src: 'https://example.com/kubi.webp' },
    { shortcode: 'kubi_spin', src: 'https://example.com/kubi-spin.webp' },
    { shortcode: 'blobkubi', src: 'https://example.com/blobkubi.webp' },
    { shortcode: 'party', src: 'https://example.com/party.webp', setAddress: '30030:pubkey:set' },
];

function waitForRules(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 10));
}

function installClipboardEventPolyfill(): void {
    if (typeof globalThis.DataTransfer === 'undefined') {
        class TestDataTransfer {
            private values = new Map<string, string>();

            setData(type: string, value: string): void {
                this.values.set(type, value);
            }

            getData(type: string): string {
                return this.values.get(type) ?? '';
            }
        }
        vi.stubGlobal('DataTransfer', TestDataTransfer);
    }

    if (typeof globalThis.ClipboardEvent === 'undefined') {
        class TestClipboardEvent extends Event {
            clipboardData: DataTransfer | null;

            constructor(type: string, init?: { clipboardData?: DataTransfer }) {
                super(type);
                this.clipboardData = init?.clipboardData ?? null;
            }
        }
        vi.stubGlobal('ClipboardEvent', TestClipboardEvent);
    }
}

function createCustomEmojiEditor(items: CustomEmojiItem[] = emojiItems): Editor {
    return new Editor({
        extensions: [
            StarterKit.configure({
                heading: false,
                blockquote: false,
                bold: false,
                italic: false,
                strike: false,
                code: false,
                codeBlock: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                horizontalRule: false,
                hardBreak: false,
                link: false,
            }),
            CustomEmoji.configure({
                getItems: () => items,
            }),
        ],
        enablePasteRules: ['customEmoji'],
        content: '<p></p>',
    });
}

function createImageBeforeCustomEmojiEditor(items: CustomEmojiItem[] = emojiItems): Editor {
    return new Editor({
        extensions: [
            StarterKit.configure({
                heading: false,
                blockquote: false,
                bold: false,
                italic: false,
                strike: false,
                code: false,
                codeBlock: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                horizontalRule: false,
                hardBreak: false,
                link: false,
            }),
            Image.configure({
                allowBase64: false,
            }).extend({
                parseHTML() {
                    return [
                        {
                            tag: 'img[src]:not([src^="data:"]):not([data-custom-emoji]):not(.custom-emoji-inline[alt])',
                        },
                    ];
                },
            }),
            CustomEmoji.configure({
                getItems: () => items,
            }),
        ],
        content: '<p></p>',
    });
}

describe('customEmoji', () => {
    it('finds emoji by normalized shortcode', () => {
        expect(findCustomEmojiByShortcode(emojiItems, ':KUBI:')).toEqual(emojiItems[0]);
        expect(findCustomEmojiByShortcode(emojiItems, 'missing')).toBeNull();
    });

    it('orders shortcode suggestions by prefix matches before includes matches', () => {
        expect(getCustomEmojiSuggestionItems(emojiItems, 'kubi').map((item) => item.shortcode)).toEqual([
            'kubi',
            'kubi_spin',
            'blobkubi',
        ]);
        expect(getCustomEmojiSuggestionItems(emojiItems, 'kubi', 2).map((item) => item.shortcode)).toEqual([
            'kubi',
            'kubi_spin',
        ]);
    });

    it('matches custom emoji suggestions without requiring a leading space', () => {
        const match = findCustomEmojiSuggestionMatch({
            char: ':',
            allowSpaces: false,
            allowToIncludeChar: false,
            allowedPrefixes: null,
            startOfLine: false,
            $position: {
                pos: 'テスト:kubi'.length,
                nodeBefore: {
                    isText: true,
                    text: 'テスト:kubi',
                },
            } as any,
        });

        expect(match).toEqual({
            range: {
                from: 'テスト'.length,
                to: 'テスト:kubi'.length,
            },
            query: 'kubi',
            text: ':kubi',
        });
    });

    it('does not match empty or URL-like custom emoji suggestions', () => {
        const baseConfig = {
            char: ':',
            allowSpaces: false,
            allowToIncludeChar: false,
            allowedPrefixes: null,
            startOfLine: false,
        };

        expect(findCustomEmojiSuggestionMatch({
            ...baseConfig,
            $position: {
                pos: ':'.length,
                nodeBefore: { isText: true, text: ':' },
            } as any,
        })).toBeNull();

        expect(findCustomEmojiSuggestionMatch({
            ...baseConfig,
            $position: {
                pos: 'https://example.com:kubi'.length,
                nodeBefore: { isText: true, text: 'https://example.com:kubi' },
            } as any,
        })).toBeNull();
    });

    it('parses valid emoji tags and ignores invalid entries', () => {
        expect(
            parseEmojiTags(
                [
                    ['emoji', ':blobcat:', 'https://example.com/blobcat.webp'],
                    ['emoji', 'bad', 'notaurl'],
                    ['p', 'not-emoji'],
                ],
                '30030:pubkey:set',
            ),
        ).toEqual([
            {
                shortcode: 'blobcat',
                src: 'https://example.com/blobcat.webp',
                setAddress: '30030:pubkey:set',
            },
        ]);
    });

    it('parses kind 30030 addresses from kind 10030 tags', () => {
        expect(parseEmojiSetAddress('30030:pubkey:funny')).toEqual({
            kind: 30030,
            pubkey: 'pubkey',
            identifier: 'funny',
            address: '30030:pubkey:funny',
        });

        expect(
            getKind10030EmojiSetAddresses({
                kind: 10030,
                tags: [
                    ['a', '30030:pubkey:funny'],
                    ['a', '30030:pubkey:funny'],
                    ['a', '1:pubkey:wrong'],
                ],
            }),
        ).toEqual(['30030:pubkey:funny']);
    });

    it('keeps first shortcode when merging emoji candidates', () => {
        expect(
            mergeCustomEmojiItems([
                [{ shortcode: 'blobcat', src: 'https://example.com/a.webp' }],
                [{ shortcode: 'blobcat', src: 'https://example.com/b.webp' }],
                [{ shortcode: 'party', src: 'https://example.com/party.webp' }],
            ]),
        ).toEqual([
            { shortcode: 'blobcat', src: 'https://example.com/a.webp' },
            { shortcode: 'party', src: 'https://example.com/party.webp' },
        ]);
    });

    it('clamps picker height to the supported viewport range', () => {
        expect(clampCustomEmojiPickerHeight(20, 1000)).toBe(
            CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
        );
        expect(clampCustomEmojiPickerHeight(900, 1000)).toBe(600);
        expect(clampCustomEmojiPickerHeight(240, 1000)).toBe(240);
        expect(clampCustomEmojiPickerHeight(900, 1000, 320)).toBe(320);
        expect(clampCustomEmojiPickerHeight(900, 1000, 720)).toBe(720);
    });

    it('picker chrome height matches the non-scrollable picker controls', () => {
        expect(CUSTOM_EMOJI_PICKER_CHROME_HEIGHT).toBe(
            CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_HEIGHT -
                CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_OVERLAP +
                CUSTOM_EMOJI_PICKER_SEARCH_ROW_HEIGHT +
                CUSTOM_EMOJI_PICKER_SEARCH_ROW_BORDER_HEIGHT,
        );
    });

    it('uses the default picker height when no stored height exists', () => {
        const storage = {
            getItem: vi.fn(() => null),
        };

        expect(readCustomEmojiPickerHeight(storage, 1000)).toBe(240);
    });

    it('batches custom emoji cache urls and ignores duplicates or invalid urls', () => {
        expect(
            getCustomEmojiCacheBatches(
                [
                    'https://example.com/a.webp',
                    'notaurl',
                    'https://example.com/a.webp',
                    'https://example.com/b.webp',
                    'https://example.com/c.webp',
                ],
                3,
                2,
            ),
        ).toEqual([
            ['https://example.com/a.webp', 'https://example.com/b.webp'],
            ['https://example.com/c.webp'],
        ]);
    });

    it('restores cached custom emoji items from IndexedDB metadata', async () => {
        const records = new Map<string, unknown>();
        const repository = {
            get: async (pubkeyHex: string) => records.get(pubkeyHex) as any ?? null,
            put: async (pubkeyHex: string, items: unknown[]) => {
                records.set(pubkeyHex, {
                    pubkeyHex,
                    items,
                    fetchedAt: 1234,
                    updatedAt: 1234,
                    schemaVersion: 1,
                });
            },
        };

        await writeCachedCustomEmojiItems('pubkey', [
            { shortcode: ':blobcat:', src: 'https://example.com/blobcat.webp' },
            { shortcode: 'blobcat', src: 'https://example.com/other.webp' },
            { shortcode: 'bad', src: 'notaurl' },
            { shortcode: 'party', src: 'https://example.com/party.webp', setAddress: '30030:pubkey:set' },
        ], repository);

        expect(records.has(getEmojisCacheKey('pubkey'))).toBe(true);
        expect(await readCachedCustomEmojiItems('pubkey', repository)).toEqual([
            { shortcode: 'blobcat', src: 'https://example.com/blobcat.webp', setAddress: null },
            { shortcode: 'party', src: 'https://example.com/party.webp', setAddress: '30030:pubkey:set' },
        ]);
    });

    it('ignores broken cached custom emoji metadata', async () => {
        const repository = {
            get: async () => ({
                pubkeyHex: 'pubkey',
                items: [{ shortcode: 'bad', src: 'notaurl' }],
                fetchedAt: 1234,
                updatedAt: 1234,
                schemaVersion: 1,
            }),
        };

        expect(await readCachedCustomEmojiItems('pubkey', repository)).toEqual([]);
        expect(await readCachedCustomEmojiItems('pubkey', { get: async () => null })).toEqual([]);
    });

    it('converts typed shortcode text to a custom emoji node', async () => {
        const editor = createCustomEmojiEditor();
        try {
            editor.commands.insertContent('テスト:kubi:', { applyInputRules: true });
            await waitForRules();

            const json = editor.getJSON();
            expect(json.content?.[0].content).toEqual([
                { type: 'text', text: 'テスト' },
                {
                    type: 'customEmoji',
                    attrs: {
                        shortcode: 'kubi',
                        src: 'https://example.com/kubi.webp',
                        setAddress: null,
                    },
                },
            ]);
        } finally {
            editor.destroy();
        }
    });

    it('keeps unknown typed shortcode text unchanged', async () => {
        const editor = createCustomEmojiEditor();
        try {
            editor.commands.insertContent('テスト:missing:', { applyInputRules: true });
            await waitForRules();

            expect(editor.getText()).toBe('テスト:missing:');
        } finally {
            editor.destroy();
        }
    });

    it('converts pasted shortcode text to multiple custom emoji nodes', () => {
        installClipboardEventPolyfill();
        const editor = createCustomEmojiEditor();
        try {
            editor.commands.insertContent('a :kubi: b :party:', { applyPasteRules: true });

            const extraction = extractPostContentFromDoc(editor.state.doc);
            expect(extraction.content).toBe('a :kubi: b :party:');
            expect(extraction.emojiTags).toEqual([
                ['emoji', 'kubi', 'https://example.com/kubi.webp'],
                ['emoji', 'party', 'https://example.com/party.webp', '30030:pubkey:set'],
            ]);
            expect(editor.getJSON().content?.[0].content?.filter((node: any) => node.type === 'customEmoji')).toHaveLength(2);
        } finally {
            editor.destroy();
        }
    });

    it('parses draft HTML custom emoji as customEmoji even when Image is registered first', () => {
        const editor = createImageBeforeCustomEmojiEditor();
        try {
            editor.commands.setContent([
                '<p>text ',
                '<img src="https://example.com/party.webp" data-custom-emoji="true" data-shortcode="party" data-set-address="30030:pubkey:set" alt=":party:">',
                '</p>',
            ].join(''));

            expect(editor.getJSON().content?.[0].content).toEqual([
                { type: 'text', text: 'text ' },
                {
                    type: 'customEmoji',
                    attrs: {
                        shortcode: 'party',
                        src: 'https://example.com/party.webp',
                        setAddress: '30030:pubkey:set',
                    },
                },
            ]);
        } finally {
            editor.destroy();
        }
    });

    it('parses legacy draft custom emoji HTML from class and alt when data attributes are missing', () => {
        const editor = createImageBeforeCustomEmojiEditor();
        try {
            editor.commands.setContent([
                '<p>legacy ',
                '<img src="https://example.com/kubi.webp" class="custom-emoji-inline" alt=":kubi:">',
                '</p>',
            ].join(''));

            expect(editor.getJSON().content?.[0].content).toEqual([
                { type: 'text', text: 'legacy ' },
                {
                    type: 'customEmoji',
                    attrs: {
                        shortcode: 'kubi',
                        src: 'https://example.com/kubi.webp',
                        setAddress: null,
                    },
                },
            ]);
        } finally {
            editor.destroy();
        }
    });

    it('keeps unknown pasted shortcodes as text while converting known custom emoji', () => {
        installClipboardEventPolyfill();
        const editor = createCustomEmojiEditor();
        try {
            editor.commands.insertContent('a :kubi: b :missing: c :party:', { applyPasteRules: true });

            const extraction = extractPostContentFromDoc(editor.state.doc);
            expect(extraction.content).toBe('a :kubi: b :missing: c :party:');
            expect(extraction.emojiTags).toEqual([
                ['emoji', 'kubi', 'https://example.com/kubi.webp'],
                ['emoji', 'party', 'https://example.com/party.webp', '30030:pubkey:set'],
            ]);
            expect(editor.getJSON().content?.[0].content).toEqual([
                { type: 'text', text: 'a ' },
                {
                    type: 'customEmoji',
                    attrs: {
                        shortcode: 'kubi',
                        src: 'https://example.com/kubi.webp',
                        setAddress: null,
                    },
                },
                { type: 'text', text: ' b :missing: c ' },
                {
                    type: 'customEmoji',
                    attrs: {
                        shortcode: 'party',
                        src: 'https://example.com/party.webp',
                        setAddress: '30030:pubkey:set',
                    },
                },
            ]);
        } finally {
            editor.destroy();
        }
    });
});
