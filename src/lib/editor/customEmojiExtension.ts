import { InputRule, Node, PasteRule, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteCustomEmojiNode from '../../components/SvelteCustomEmojiNode.svelte';
import {
    createCustomEmojiIdentityKey,
    findUniqueCustomEmojiByShortcode,
    normalizeEmojiShortcode,
    normalizeEmojiShortcodeForLookup,
    type CustomEmojiItem,
} from '../customEmoji';
import { customEmojiStore } from '../../stores/customEmojiStore.svelte';

export interface CustomEmojiAttrs {
    identityKey?: string;
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

function parseShortcodeFromElement(element: HTMLElement): string {
    const shortcode = normalizeShortcode(element.getAttribute('data-shortcode') ?? '');
    if (shortcode) {
        return shortcode;
    }

    const alt = element.getAttribute('alt') ?? '';
    const match = alt.match(/^:([^:]+):$/);
    return normalizeShortcode(match?.[1] ?? '');
}

function parseIdentityKeyFromElement(element: HTMLElement): string {
    const identityKey = element.getAttribute('data-identity-key') ?? '';
    if (identityKey) {
        return identityKey;
    }

    const shortcode = parseShortcodeFromElement(element);
    const src = element.getAttribute('src') ?? '';
    const setAddress = element.getAttribute('data-set-address') ?? null;
    if (!shortcode || !src) return '';

    return createCustomEmojiIdentityKey({
        shortcodeLower: normalizeEmojiShortcodeForLookup(shortcode),
        src,
        setAddress,
    });
}

const SHORTCODE_PATTERN = '[\\p{L}\\p{N}_+-]';
const SHORTCODE_INPUT_REGEX = new RegExp(`:(${SHORTCODE_PATTERN}{1,64}):$`, 'u');
const SHORTCODE_PASTE_REGEX = new RegExp(`:(${SHORTCODE_PATTERN}{1,64}):`, 'gu');

function findEmojiFromMatch(
    items: CustomEmojiItem[],
    match: ArrayLike<unknown>,
): CustomEmojiItem | null {
    return findUniqueCustomEmojiByShortcode(items, match[1]);
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
    draggable: true,

    addOptions() {
        return {
            getItems: () => customEmojiStore.items,
        };
    },

    addAttributes() {
        return {
            identityKey: {
                default: '',
                parseHTML: (element) => parseIdentityKeyFromElement(element as HTMLElement),
            },
            shortcode: {
                default: '',
                parseHTML: (element) => parseShortcodeFromElement(element as HTMLElement),
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
        return [
            { tag: 'img[data-custom-emoji]' },
            { tag: 'img.custom-emoji-inline[alt]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const shortcode = normalizeShortcode(HTMLAttributes.shortcode ?? '');
        const setAddress = typeof HTMLAttributes.setAddress === 'string'
            ? HTMLAttributes.setAddress
            : typeof HTMLAttributes['data-set-address'] === 'string'
                ? HTMLAttributes['data-set-address']
                : null;
        const identityKey = String(
            HTMLAttributes.identityKey ||
                (shortcode && HTMLAttributes.src
                    ? createCustomEmojiIdentityKey({
                        shortcodeLower: normalizeEmojiShortcodeForLookup(shortcode),
                        src: String(HTMLAttributes.src),
                        setAddress,
                    })
                    : ''),
        );
        const { identityKey: _identityKey, shortcode: _shortcode, setAddress: _setAddress, ...restAttributes } = HTMLAttributes;
        return [
            'img',
            mergeAttributes(restAttributes, {
                'data-custom-emoji': 'true',
                'data-identity-key': identityKey,
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
                    const setAddress = attrs.setAddress ?? null;
                    const identityKey = attrs.identityKey || createCustomEmojiIdentityKey({
                        shortcodeLower: normalizeEmojiShortcodeForLookup(shortcode),
                        src: attrs.src,
                        setAddress,
                    });

                    return chain()
                        .insertContent({
                            type: this.name,
                            attrs: {
                                identityKey,
                                shortcode,
                                src: attrs.src,
                                setAddress,
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
                                identityKey: emoji.identityKey,
                                src: emoji.src,
                                setAddress: emoji.setAddress,
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
                            identityKey: emoji.identityKey,
                            src: emoji.src,
                            setAddress: emoji.setAddress,
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
