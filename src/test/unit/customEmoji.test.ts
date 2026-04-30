import { describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
    clampCustomEmojiPickerHeight,
    createCustomEmojiItem,
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

function emojiItem(
    shortcode: string,
    src: string,
    options: Partial<Pick<CustomEmojiItem, 'setAddress' | 'sortIndex' | 'sourceType' | 'sourceAddress'>> = {},
): CustomEmojiItem {
    const item = createCustomEmojiItem({
        shortcode,
        src,
        setAddress: options.setAddress ?? null,
        sortIndex: options.sortIndex ?? 0,
        sourceType: options.sourceType ?? 'kind10030',
        sourceAddress: options.sourceAddress ?? null,
    });
    if (!item) {
        throw new Error(`Invalid custom emoji fixture: ${shortcode}`);
    }
    return item;
}

const emojiItems: CustomEmojiItem[] = [
    emojiItem('kubi', 'https://example.com/kubi.webp', { sortIndex: 0 }),
    emojiItem('kubi_spin', 'https://example.com/kubi-spin.webp', { sortIndex: 1 }),
    emojiItem('blobkubi', 'https://example.com/blobkubi.webp', { sortIndex: 2 }),
    emojiItem('party', 'https://example.com/party.webp', { setAddress: '30030:pubkey:set', sortIndex: 3 }),
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
            ).map(({ shortcode, shortcodeLower, src, setAddress, sourceType, sourceAddress, sortIndex }) => ({
                shortcode,
                shortcodeLower,
                src,
                setAddress,
                sourceType,
                sourceAddress,
                sortIndex,
            })),
        ).toEqual([
            {
                shortcode: 'blobcat',
                shortcodeLower: 'blobcat',
                src: 'https://example.com/blobcat.webp',
                setAddress: '30030:pubkey:set',
                sourceType: 'kind10030',
                sourceAddress: null,
                sortIndex: 0,
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

    it('keeps same shortcode candidates when their identity differs', () => {
        expect(
            mergeCustomEmojiItems([
                [emojiItem('blobcat', 'https://example.com/a.webp')],
                [emojiItem('blobcat', 'https://example.com/b.webp')],
                [emojiItem('blobcat', 'https://example.com/a.webp')],
                [emojiItem('party', 'https://example.com/party.webp')],
            ]).map(({ shortcode, src, sortIndex }) => ({ shortcode, src, sortIndex })),
        ).toEqual([
            { shortcode: 'blobcat', src: 'https://example.com/a.webp', sortIndex: 0 },
            { shortcode: 'blobcat', src: 'https://example.com/b.webp', sortIndex: 1 },
            { shortcode: 'party', src: 'https://example.com/party.webp', sortIndex: 2 },
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
                    meta: {
                        pubkeyHex,
                        fetchedAt: 1234,
                        updatedAt: 1234,
                        schemaVersion: 2,
                    },
                    items,
                });
            },
        };

        await writeCachedCustomEmojiItems('pubkey', [
            emojiItem(':blobcat:', 'https://example.com/blobcat.webp', { sortIndex: 0 }),
            emojiItem('blobcat', 'https://example.com/other.webp', { sortIndex: 1 }),
            { shortcode: 'bad', src: 'notaurl' } as CustomEmojiItem,
            emojiItem('party', 'https://example.com/party.webp', { setAddress: '30030:pubkey:set', sortIndex: 2 }),
        ], repository as any);

        expect(records.has(getEmojisCacheKey('pubkey'))).toBe(true);
        expect((await readCachedCustomEmojiItems('pubkey', repository as any)).map(({ shortcode, src, setAddress }) => ({
            shortcode,
            src,
            setAddress,
        }))).toEqual([
            { shortcode: 'blobcat', src: 'https://example.com/blobcat.webp', setAddress: null },
            { shortcode: 'blobcat', src: 'https://example.com/other.webp', setAddress: null },
            { shortcode: 'party', src: 'https://example.com/party.webp', setAddress: '30030:pubkey:set' },
        ]);
    });

    it('ignores broken cached custom emoji metadata', async () => {
        const repository = {
            get: async () => ({
                meta: {
                    pubkeyHex: 'pubkey',
                    fetchedAt: 1234,
                    updatedAt: 1234,
                    schemaVersion: 2,
                },
                items: [{ shortcode: 'bad', src: 'notaurl' } as CustomEmojiItem],
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
            expect(json.content?.[0].content).toMatchObject([
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

    it('keeps ambiguous typed shortcode text unchanged', async () => {
        const editor = createCustomEmojiEditor([
            emojiItem('blobcat', 'https://example.com/blobcat-a.webp'),
            emojiItem('blobcat', 'https://example.com/blobcat-b.webp'),
        ]);
        try {
            editor.commands.insertContent('テスト:blobcat:', { applyInputRules: true });
            await waitForRules();

            expect(editor.getText()).toBe('テスト:blobcat:');
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

    it('keeps ambiguous pasted shortcode text unchanged', () => {
        installClipboardEventPolyfill();
        const editor = createCustomEmojiEditor([
            emojiItem('blobcat', 'https://example.com/blobcat-a.webp'),
            emojiItem('blobcat', 'https://example.com/blobcat-b.webp'),
            emojiItem('party', 'https://example.com/party.webp'),
        ]);
        try {
            editor.commands.insertContent('a :blobcat: b :party:', { applyPasteRules: true });

            const extraction = extractPostContentFromDoc(editor.state.doc);
            expect(extraction.content).toBe('a :blobcat: b :party:');
            expect(extraction.emojiTags).toEqual([
                ['emoji', 'party', 'https://example.com/party.webp'],
            ]);
            expect(editor.getJSON().content?.[0].content?.filter((node: any) => node.type === 'customEmoji')).toHaveLength(1);
        } finally {
            editor.destroy();
        }
    });

    it('serializes same-shortcode selected emoji with their selected image urls', () => {
        const first = emojiItem('blobcat', 'https://example.com/blobcat-a.webp');
        const second = emojiItem('blobcat', 'https://example.com/blobcat-b.webp');
        const editor = createCustomEmojiEditor([first, second]);
        try {
            editor.commands.insertCustomEmoji(first);
            editor.commands.insertContent(' ');
            editor.commands.insertCustomEmoji(second);

            const extraction = extractPostContentFromDoc(editor.state.doc);
            expect(extraction.content).toBe(':blobcat: :blobcat_2:');
            expect(extraction.emojiTags).toEqual([
                ['emoji', 'blobcat', 'https://example.com/blobcat-a.webp'],
                ['emoji', 'blobcat_2', 'https://example.com/blobcat-b.webp'],
            ]);
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

            expect(editor.getJSON().content?.[0].content).toMatchObject([
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

            expect(editor.getJSON().content?.[0].content).toMatchObject([
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
            expect(editor.getJSON().content?.[0].content).toMatchObject([
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
