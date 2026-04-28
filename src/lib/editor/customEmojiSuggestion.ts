import { Extension } from '@tiptap/core';
import Suggestion, { exitSuggestion, type SuggestionMatch, type Trigger } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import { mount, unmount } from 'svelte';
import CustomEmojiSuggestionList from '../../components/CustomEmojiSuggestionList.svelte';
import {
    getCustomEmojiSuggestionItems,
    normalizeEmojiShortcode,
    type CustomEmojiItem,
} from '../customEmoji';
import { customEmojiStore } from '../../stores/customEmojiStore.svelte';

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

                render: () => {
                    type MountInstance = ReturnType<typeof mount>;
                    let component: MountInstance | null = null;
                    let container: HTMLElement | null = null;
                    let currentItems: CustomEmojiItem[] = [];
                    let currentCommand: ((item: CustomEmojiItem) => void) | null = null;

                    function getExports(): {
                        moveUp?: () => void;
                        moveDown?: () => void;
                        confirmSelection?: () => boolean;
                        resetIndex?: () => void;
                    } {
                        return (component ?? {}) as any;
                    }

                    function createContainer(): HTMLElement {
                        const el = document.createElement('div');
                        el.className = 'custom-emoji-suggestion-popover';
                        el.style.position = 'fixed';
                        el.style.zIndex = '9999';
                        document.body.appendChild(el);
                        return el;
                    }

                    function mountComponent(): void {
                        if (!container || !currentCommand) return;
                        if (component) {
                            unmount(component);
                            component = null;
                        }
                        if (!currentItems.length) return;

                        component = mount(CustomEmojiSuggestionList, {
                            target: container,
                            props: {
                                items: currentItems,
                                onSelect: currentCommand,
                                onDismiss: () => {
                                    exitSuggestion(editor.view, CUSTOM_EMOJI_SUGGESTION_PLUGIN_KEY);
                                },
                            },
                        });
                    }

                    function updatePosition(clientRect: (() => DOMRect | null) | null): void {
                        if (!container || !clientRect) return;
                        const rect = clientRect();
                        if (!rect) return;

                        const viewportHeight = window.innerHeight;
                        const approxDropdownHeight = 220;
                        const spaceBelow = viewportHeight - rect.bottom;
                        container.style.left = `${Math.max(0, rect.left)}px`;
                        if (spaceBelow < approxDropdownHeight && rect.top > approxDropdownHeight) {
                            container.style.top = `${rect.top - approxDropdownHeight - 4}px`;
                        } else {
                            container.style.top = `${rect.bottom + 4}px`;
                        }
                    }

                    function cleanup(): void {
                        if (component) {
                            unmount(component);
                            component = null;
                        }
                        if (container) {
                            container.remove();
                            container = null;
                        }
                        currentItems = [];
                        currentCommand = null;
                    }

                    return {
                        onStart(props: any): void {
                            currentItems = props.items ?? [];
                            currentCommand = props.command;
                            if (!currentItems.length) return;

                            container = createContainer();
                            mountComponent();
                            requestAnimationFrame(() => updatePosition(props.clientRect));
                        },

                        onUpdate(props: any): void {
                            currentItems = props.items ?? [];
                            currentCommand = props.command;

                            if (!currentItems.length) {
                                if (component) {
                                    unmount(component);
                                    component = null;
                                }
                                return;
                            }

                            if (!container) {
                                container = createContainer();
                            }
                            mountComponent();
                            getExports().resetIndex?.();
                            requestAnimationFrame(() => updatePosition(props.clientRect));
                        },

                        onKeyDown(props: any): boolean {
                            if (!currentItems.length) return false;
                            const exports = getExports();

                            switch (props.event.key) {
                                case 'ArrowDown':
                                    exports.moveDown?.();
                                    return true;
                                case 'Tab':
                                    if (props.event.shiftKey) {
                                        exports.moveUp?.();
                                    } else {
                                        exports.moveDown?.();
                                    }
                                    return true;
                                case 'ArrowUp':
                                    exports.moveUp?.();
                                    return true;
                                case 'Enter':
                                    return exports.confirmSelection?.() ?? false;
                                default:
                                    return false;
                            }
                        },

                        onExit(): void {
                            cleanup();
                        },
                    };
                },

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
