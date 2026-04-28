import { InputRule, Node, PasteRule, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteCustomEmojiNode from '../../components/SvelteCustomEmojiNode.svelte';
import {
    findCustomEmojiByShortcode,
    normalizeEmojiShortcode,
    type CustomEmojiItem,
} from '../customEmoji';
import { customEmojiStore } from '../../stores/customEmojiStore.svelte';

export interface CustomEmojiAttrs {
    shortcode: string;
    src: string;
    setAddress?: string | null;
}

export interface CustomEmojiOptions {
    getItems: () => CustomEmojiItem[];
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customEmoji: {
            insertCustomEmoji: (attrs: CustomEmojiAttrs) => ReturnType;
        };
    }
}

function normalizeShortcode(value: unknown): string {
    return normalizeEmojiShortcode(value);
}

const SHORTCODE_PATTERN = '[\\p{L}\\p{N}_+-]';
const SHORTCODE_INPUT_REGEX = new RegExp(`:(${SHORTCODE_PATTERN}{1,64}):$`, 'u');
const SHORTCODE_PASTE_REGEX = new RegExp(`:(${SHORTCODE_PATTERN}{1,64}):`, 'gu');

function findEmojiFromMatch(
    items: CustomEmojiItem[],
    match: ArrayLike<unknown>,
): CustomEmojiItem | null {
    return findCustomEmojiByShortcode(items, match[1]);
}

function findKnownEmojiPasteMatches(text: string, items: CustomEmojiItem[]) {
    return [...text.matchAll(SHORTCODE_PASTE_REGEX)]
        .filter((match) => findEmojiFromMatch(items, match))
        .map((match) => ({
            index: match.index ?? 0,
            text: match[0],
            replaceWith: String(match[1] ?? ''),
        }));
}

export const CustomEmoji = Node.create<CustomEmojiOptions>({
    name: 'customEmoji',

    group: 'inline',
    inline: true,
    atom: true,
    selectable: true,

    addOptions() {
        return {
            getItems: () => customEmojiStore.items,
        };
    },

    addAttributes() {
        return {
            shortcode: {
                default: '',
                parseHTML: (element) => normalizeShortcode(element.getAttribute('data-shortcode') ?? ''),
            },
            src: {
                default: '',
                parseHTML: (element) => element.getAttribute('src') ?? '',
            },
            setAddress: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-set-address'),
                renderHTML: (attributes) =>
                    attributes.setAddress ? { 'data-set-address': attributes.setAddress } : {},
            },
        };
    },

    parseHTML() {
        return [{ tag: 'img[data-custom-emoji]' }];
    },

    renderHTML({ HTMLAttributes }) {
        const shortcode = normalizeShortcode(HTMLAttributes.shortcode ?? '');
        const { shortcode: _shortcode, setAddress: _setAddress, ...restAttributes } = HTMLAttributes;
        return [
            'img',
            mergeAttributes(restAttributes, {
                'data-custom-emoji': 'true',
                'data-shortcode': shortcode,
                alt: shortcode ? `:${shortcode}:` : '',
                class: 'custom-emoji-inline',
            }),
        ];
    },

    addCommands() {
        return {
            insertCustomEmoji:
                (attrs) =>
                ({ chain }) => {
                    const shortcode = normalizeShortcode(attrs.shortcode);
                    if (!shortcode || !attrs.src) {
                        return false;
                    }

                    return chain()
                        .insertContent({
                            type: this.name,
                            attrs: {
                                shortcode,
                                src: attrs.src,
                                setAddress: attrs.setAddress ?? null,
                            },
                        })
                        .run();
                },
        };
    },

    addInputRules() {
        return [
            new InputRule({
                find: SHORTCODE_INPUT_REGEX,
                handler: ({ state, range, match }) => {
                    const emoji = findEmojiFromMatch(this.options.getItems(), match);
                    if (!emoji) {
                        return null;
                    }

                    state.tr
                        .replaceWith(
                            range.from,
                            range.to,
                            this.type.create({
                                shortcode: normalizeShortcode(emoji.shortcode),
                                src: emoji.src,
                                setAddress: emoji.setAddress ?? null,
                            }),
                        )
                        .scrollIntoView();
                },
            }),
        ];
    },

    addPasteRules() {
        return [
            new PasteRule({
                find: (text) => findKnownEmojiPasteMatches(text, this.options.getItems()),
                handler: ({ state, range, match }) => {
                    const emoji = findEmojiFromMatch(this.options.getItems(), match);
                    if (!emoji) {
                        return null;
                    }

                    state.tr.replaceWith(
                        range.from,
                        range.to,
                        this.type.create({
                            shortcode: normalizeShortcode(emoji.shortcode),
                            src: emoji.src,
                            setAddress: emoji.setAddress ?? null,
                        }),
                    );
                },
            }),
        ];
    },

    addNodeView() {
        return SvelteNodeViewRenderer(SvelteCustomEmojiNode as any);
    },
});
