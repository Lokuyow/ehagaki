import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteCustomEmojiNode from '../../components/SvelteCustomEmojiNode.svelte';

export interface CustomEmojiAttrs {
    shortcode: string;
    src: string;
    setAddress?: string | null;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customEmoji: {
            insertCustomEmoji: (attrs: CustomEmojiAttrs) => ReturnType;
        };
    }
}

function normalizeShortcode(value: string): string {
    return value.replace(/^:+|:+$/g, '').trim();
}

export const CustomEmoji = Node.create({
    name: 'customEmoji',

    group: 'inline',
    inline: true,
    atom: true,
    selectable: true,

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

    addNodeView() {
        return SvelteNodeViewRenderer(SvelteCustomEmojiNode as any);
    },
});
