import { mount, unmount } from 'svelte';

type MountInstance = ReturnType<typeof mount>;

export interface SuggestionListExports {
    moveUp?: () => void;
    moveDown?: () => void;
    confirmSelection?: () => boolean;
    resetIndex?: () => void;
}

interface CreateSuggestionRendererOptions<T> {
    component: any;
    className?: string;
    approxDropdownHeight?: number;
    getProps?: (params: {
        items: T[];
        command: (item: T) => void;
    }) => Record<string, unknown>;
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
    getProps,
}: CreateSuggestionRendererOptions<T>) {
    return () => {
        let component: MountInstance | null = null;
        let container: HTMLElement | null = null;
        let currentItems: T[] = [];
        let currentCommand: ((item: T) => void) | null = null;

        function getExports(): SuggestionListExports {
            return (component ?? {}) as SuggestionListExports;
        }

        function createContainer(): HTMLElement {
            const el = document.createElement('div');
            if (className) {
                el.className = className;
            }
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

            const props = getProps?.({
                items: currentItems,
                command: currentCommand,
            }) ?? {
                items: currentItems,
                onSelect: currentCommand,
            };

            component = mount(Component, {
                target: container,
                props,
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
        }

        return {
            onStart(props: SuggestionRenderProps<T>): void {
                currentItems = props.items ?? [];
                currentCommand = props.command ?? null;
                if (!currentItems.length) return;

                container = createContainer();
                mountComponent();
                requestAnimationFrame(() => updatePosition(props.clientRect));
            },

            onUpdate(props: SuggestionRenderProps<T>): void {
                currentItems = props.items ?? [];
                currentCommand = props.command ?? null;

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
