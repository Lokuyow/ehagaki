import { mount, unmount } from 'svelte';
import type { Component } from 'svelte';
import { getAppRuntimeEnvironment } from '../appRuntimeEnvironment';

type MountInstance = ReturnType<typeof mount>;

export interface SuggestionListExports {
    moveUp?: () => void;
    moveDown?: () => void;
    confirmSelection?: () => boolean;
    resetIndex?: () => void;
}

interface SuggestionListProps<T> {
    items: T[];
    onSelect: (item: T) => void;
}

interface CreateSuggestionRendererOptions<T> {
    component: Component<SuggestionListProps<T>, SuggestionListExports>;
    className?: string;
    approxDropdownHeight?: number;
    zIndex?: string;
    /** Must return the same set of keys on every call. */
    getProps?: (params: {
        items: T[];
        command: (item: T) => void;
    }) => SuggestionListProps<T>;
}

interface SuggestionRenderProps<T> {
    items?: T[];
    command?: (item: T) => void;
    clientRect?: (() => DOMRect | null) | null;
    event?: KeyboardEvent;
}

export function createSuggestionRenderer<T>({
    component: Component,
    className,
    approxDropdownHeight = 220,
    zIndex = '9999',
    getProps,
}: CreateSuggestionRendererOptions<T>) {
    return () => {
        let component: MountInstance | null = null;
        let container: HTMLElement | null = null;
        let currentItems: T[] = [];
        let currentCommand: ((item: T) => void) | null = null;
        // The list stays mounted while the suggestion is active and reads its
        // props through getters, so each keystroke updates the existing rows
        // instead of rebuilding the whole list.
        let listProps = $state.raw<Record<string, unknown> | null>(null);

        function getExports(): SuggestionListExports {
            return (component ?? {}) as SuggestionListExports;
        }

        function createContainer(): HTMLElement {
            const el = document.createElement('div');
            if (className) {
                el.className = className;
            }
            el.style.position = 'fixed';
            el.style.zIndex = zIndex;
            getAppRuntimeEnvironment().overlayTarget.appendChild(el);
            return el;
        }

        function resolveProps(command: (item: T) => void): SuggestionListProps<T> {
            return getProps?.({
                items: currentItems,
                command,
            }) ?? {
                items: currentItems,
                onSelect: command,
            };
        }

        function createReactiveProps(
            initial: Record<string, unknown>,
        ): SuggestionListProps<T> {
            const props: Record<string, unknown> = {};
            for (const key of Object.keys(initial)) {
                Object.defineProperty(props, key, {
                    enumerable: true,
                    get: () => listProps?.[key],
                });
            }
            return props as unknown as SuggestionListProps<T>;
        }

        function syncComponent(): void {
            if (!container || !currentCommand) return;
            const nextProps = resolveProps(currentCommand) as unknown as Record<string, unknown>;
            listProps = nextProps;
            // An empty list renders nothing, so keep the instance for the next
            // query instead of unmounting it.
            if (component || !currentItems.length) return;

            component = mount(Component, {
                target: container,
                props: createReactiveProps(nextProps),
            });
        }

        function updatePosition(
            clientRect: (() => DOMRect | null) | null | undefined,
        ): void {
            if (!container || !clientRect) return;
            const rect = clientRect();
            if (!rect) return;

            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const margin = 8;
            const containerWidth = container.offsetWidth;
            const maxLeft = Math.max(
                0,
                window.innerWidth - containerWidth - margin,
            );
            container.style.left = `${Math.min(Math.max(0, rect.left), maxLeft)}px`;
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
            listProps = null;
        }

        return {
            onStart(props: SuggestionRenderProps<T>): void {
                currentItems = props.items ?? [];
                currentCommand = props.command ?? null;
                if (!currentItems.length) return;

                container = createContainer();
                syncComponent();
                requestAnimationFrame(() => updatePosition(props.clientRect));
            },

            onUpdate(props: SuggestionRenderProps<T>): void {
                currentItems = props.items ?? [];
                currentCommand = props.command ?? null;

                if (!currentItems.length) {
                    syncComponent();
                    return;
                }

                if (!container) {
                    container = createContainer();
                }
                syncComponent();
                getExports().resetIndex?.();
                requestAnimationFrame(() => updatePosition(props.clientRect));
            },

            onKeyDown(props: SuggestionRenderProps<T>): boolean {
                if (!currentItems.length || !props.event) return false;
                const exports = getExports();

                switch (props.event.key) {
                    case 'ArrowDown':
                        exports.moveDown?.();
                        return true;
                    case 'Tab':
                        return exports.confirmSelection?.() ?? false;
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
    };
}
