import { Extension } from '@tiptap/core';
import Suggestion, { type SuggestionMatch, type Trigger } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import CustomEmojiSuggestionList from '../../components/CustomEmojiSuggestionList.svelte';
import {
    getCustomEmojiSuggestionItems,
    normalizeEmojiShortcode,
    type CustomEmojiItem,
} from '../customEmoji';
import { customEmojiStore } from '../../stores/customEmojiStore.svelte';
import { createSuggestionRenderer } from './suggestionRenderer';

export interface CustomEmojiSuggestionOptions {
    getItems: () => CustomEmojiItem[];
    limit: number;
}

const CUSTOM_EMOJI_SUGGESTION_PLUGIN_KEY = new PluginKey('customEmojiSuggestion');
const CUSTOM_EMOJI_QUERY_REGEX = /:([\p{L}\p{N}_+-]{1,64})$/u;
const URL_LIKE_SEGMENT_REGEX = /^[a-z][a-z0-9+.-]*:\/\/\S*$/i;

function isLikelyUrlSegment(value: string): boolean {
    const lastWhitespaceIndex = Math.max(
        value.lastIndexOf(' '),
        value.lastIndexOf('\n'),
        value.lastIndexOf('\t'),
        value.lastIndexOf('\u3000'),
    );
    const segment = value.slice(lastWhitespaceIndex + 1);
    return URL_LIKE_SEGMENT_REGEX.test(segment);
}

export function findCustomEmojiSuggestionMatch(config: Trigger): SuggestionMatch {
    const text = config.$position.nodeBefore?.isText
        ? config.$position.nodeBefore.text ?? ''
        : '';
    if (!text) return null;

    const match = CUSTOM_EMOJI_QUERY_REGEX.exec(text);
    if (!match || match.index === undefined) return null;

    const query = normalizeEmojiShortcode(match[1]);
    if (!query) return null;

    const textBeforeMatch = text.slice(0, match.index);
    const previousChar = textBeforeMatch.at(-1);
    if (previousChar === ':' || previousChar === '/') {
        return null;
    }
    if (isLikelyUrlSegment(text.slice(0, match.index + match[0].length))) {
        return null;
    }

    const from = config.$position.pos - text.length + match.index;
    const to = from + match[0].length;
    if (!(from < config.$position.pos && to >= config.$position.pos)) {
        return null;
    }

    return {
        range: { from, to },
        query,
        text: match[0],
    };
}

export const CustomEmojiSuggestion = Extension.create<CustomEmojiSuggestionOptions>({
    name: 'customEmojiSuggestion',

    addOptions() {
        return {
            getItems: () => customEmojiStore.items,
            limit: 30,
        };
    },

    addProseMirrorPlugins() {
        const editor = this.editor;

        return [
            Suggestion<CustomEmojiItem>({
                editor,
                pluginKey: CUSTOM_EMOJI_SUGGESTION_PLUGIN_KEY,
                char: ':',
                allowSpaces: false,
                allowedPrefixes: null,
                findSuggestionMatch: findCustomEmojiSuggestionMatch,
                items: ({ query }: { query: string }) =>
                    getCustomEmojiSuggestionItems(
                        this.options.getItems(),
                        query,
                        this.options.limit,
                    ),

                render: createSuggestionRenderer<CustomEmojiItem>({
                    component: CustomEmojiSuggestionList,
                    className: 'custom-emoji-suggestion-popover',
                    zIndex: '99',
                    getProps: ({ items, command }) => ({
                        items,
                        onSelect: command,
                    }),
                }),

                command: ({ editor, range, props }: { editor: any; range: any; props: CustomEmojiItem }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: 'customEmoji',
                            attrs: {
                                shortcode: normalizeEmojiShortcode(props.shortcode),
                                src: props.src,
                                setAddress: props.setAddress ?? null,
                            },
                        })
                        .run();
                },
            }),
        ];
    },
});
