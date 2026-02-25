import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { mount, unmount } from 'svelte';
import HashtagSuggestionList from '../../components/HashtagSuggestionList.svelte';
import { getSuggestions } from '../utils/hashtagHistory';

/**
 * ハッシュタグサジェスト拡張
 *
 * '#' を入力するとローカルストレージの履歴からサジェスト候補をドロップダウン表示する。
 * 候補選択で入力中の '#<query>' を '#<selected> ' に置換する。
 */
export const HashtagSuggestion = Extension.create({
    name: 'hashtagSuggestion',

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                char: '#',
                allowSpaces: false,
                allowedPrefixes: [' ', '\n', '\t', '\u3000'],
                items: ({ query }: { query: string }) => getSuggestions(query),

                render: () => {
                    type MountInstance = ReturnType<typeof mount>;
                    let component: MountInstance | null = null;
                    let container: HTMLElement | null = null;
                    let currentItems: string[] = [];
                    let currentCommand: ((item: string) => void) | null = null;

                    function getExports(): {
                        moveUp?: () => void;
                        moveDown?: () => void;
                        confirmSelection?: () => boolean;
                        resetIndex?: () => void;
                    } {
                        return (component ?? {}) as any;
                    }

                    function mountComponent(): void {
                        if (!container || !currentCommand) return;
                        if (component) {
                            unmount(component);
                            component = null;
                        }
                        if (!currentItems.length) return;
                        component = mount(HashtagSuggestionList, {
                            target: container,
                            props: {
                                items: currentItems,
                                onSelect: currentCommand,
                            },
                        });
                    }

                    function updatePosition(clientRect: (() => DOMRect | null) | null): void {
                        if (!container || !clientRect) return;
                        const rect = clientRect();
                        if (!rect) return;
                        const viewportHeight = window.innerHeight;
                        const approxDropdownHeight = 200;
                        const spaceBelow = viewportHeight - rect.bottom;
                        container.style.left = `${Math.max(0, rect.left)}px`;
                        if (spaceBelow < approxDropdownHeight && rect.top > approxDropdownHeight) {
                            container.style.top = `${rect.top - approxDropdownHeight - 4}px`;
                        } else {
                            container.style.top = `${rect.bottom + 4}px`;
                        }
                    }

                    function createContainer(): HTMLElement {
                        const el = document.createElement('div');
                        el.style.position = 'fixed';
                        el.style.zIndex = '9999';
                        document.body.appendChild(el);
                        return el;
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
                                case 'ArrowUp':
                                    exports.moveUp?.();
                                    return true;
                                case 'Enter':
                                case 'Tab':
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

                command: ({ editor, range, props }: { editor: any; range: any; props: string }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent('#' + props + ' ')
                        .run();
                },
            }),
        ];
    },
});
