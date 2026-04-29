import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { EditorView } from '@tiptap/pm/view';
import {
    findClosestCustomEmojiDropPosition,
    getCustomEmojiDropPositions,
    moveCustomEmojiNode,
} from '../utils/editorNodeActions';
import { highlightDropZoneAtPosition } from '../utils/mediaNodeUtils';
import { SCROLL_BASE_SPEED, SCROLL_MAX_SPEED, SCROLL_THRESHOLD } from '../constants';

const CUSTOM_EMOJI_DRAG_META = 'customEmojiDrag';
const INTERNAL_NODE_MIME = 'application/x-tiptap-node';

function parseCustomEmojiDragData(event: DragEvent): { pos: number; attrs: Record<string, unknown> } | null {
    const rawData = event.dataTransfer?.getData(INTERNAL_NODE_MIME);
    if (!rawData) return null;

    try {
        const nodeData = JSON.parse(rawData);
        if (nodeData?.type !== 'customEmoji' || typeof nodeData.pos !== 'number') {
            return null;
        }

        return {
            pos: nodeData.pos,
            attrs: nodeData.attrs ?? {},
        };
    } catch {
        return null;
    }
}

function findCustomEmojiDragDataFromDom(
    view: EditorView,
    event: DragEvent,
): { pos: number; attrs: Record<string, unknown> } | null {
    const target = event.target as HTMLElement | null;
    const customEmojiElement = target?.closest?.('.custom-emoji-wrapper, .custom-emoji-drag-target, [data-custom-emoji]');
    if (!customEmojiElement) return null;

    let found: { pos: number; attrs: Record<string, unknown> } | null = null;
    view.state.doc.descendants((node, pos) => {
        if (found || node.type.name !== 'customEmoji') {
            return;
        }

        const nodeDom = view.nodeDOM(pos);
        if (nodeDom instanceof HTMLElement && nodeDom.contains(customEmojiElement)) {
            found = { pos, attrs: node.attrs };
            return false;
        }
    });

    return found;
}

function getCustomEmojiDragData(
    view: EditorView,
    event: DragEvent,
): { pos: number; attrs: Record<string, unknown> } | null {
    return parseCustomEmojiDragData(event) ?? findCustomEmojiDragDataFromDom(view, event);
}

function getDropZonePositionFromPoint(x: number, y: number): number | null {
    const dropZone = document
        .elementFromPoint(x, y)
        ?.closest('.drop-zone-indicator[data-drop-pos]');
    const rawPosition = dropZone?.getAttribute('data-drop-pos');
    if (!rawPosition) return null;

    const position = Number.parseInt(rawPosition, 10);
    return Number.isFinite(position) ? position : null;
}

function createDropZoneWidget(position: number): HTMLElement {
    const dropZone = document.createElement('span');
    dropZone.className = 'drop-zone-indicator custom-emoji-drop-zone';
    dropZone.setAttribute('data-drop-pos', String(position));
    Object.assign(dropZone.style, {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10px',
        height: '1.7em',
        minHeight: '0',
        padding: '0',
        margin: '0 1px',
        verticalAlign: '-0.44em',
        background: 'none',
        border: '0',
        boxShadow: 'none',
        position: 'relative',
    });

    const bar = document.createElement('span');
    bar.className = 'drop-zone-bar';
    Object.assign(bar.style, {
        width: '4px',
        height: '1.35em',
        minHeight: '18px',
        borderRadius: '999px',
    });
    dropZone.appendChild(bar);

    return dropZone;
}

function setDraggingFalse(view: import('@tiptap/pm/view').EditorView): void {
    view.dispatch(
        view.state.tr.setMeta(CUSTOM_EMOJI_DRAG_META, {
            isDragging: false,
            draggedNodePos: null,
        }),
    );
}

export const CustomEmojiDragDropExtension = Extension.create({
    name: 'customEmojiDragDrop',

    addProseMirrorPlugins() {
        const dragDropKey = new PluginKey('custom-emoji-drag-drop');
        const dropZoneKey = new PluginKey('custom-emoji-drop-zone-indicator');

        return [
            new Plugin({
                key: dragDropKey,
                state: {
                    init: () => ({
                        isDragging: false,
                        draggedNodePos: null as number | null,
                    }),
                    apply: (tr, value) => {
                        const meta = tr.getMeta(CUSTOM_EMOJI_DRAG_META);
                        if (meta) {
                            return { ...value, ...meta };
                        }
                        return value;
                    },
                },
                props: {
                    handleDrop: (view, event) => {
                        const nodeData = parseCustomEmojiDragData(event);
                        if (!nodeData) return false;

                        event.preventDefault();
                        const zoneDropPos = getDropZonePositionFromPoint(event.clientX, event.clientY);
                        const coords = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        });
                        const dropPos =
                            zoneDropPos ??
                            (coords
                                ? findClosestCustomEmojiDropPosition(
                                    view.state.doc,
                                    coords.pos,
                                    nodeData.pos,
                                )
                                : null);

                        setDraggingFalse(view);
                        if (typeof dropPos !== 'number') return true;

                        moveCustomEmojiNode(view, nodeData, dropPos);
                        return true;
                    },
                    handleDOMEvents: {
                        dragstart: (view, event) => {
                            const dragEvent = event as DragEvent;
                            const nodeData = getCustomEmojiDragData(view, dragEvent);
                            if (!nodeData) return false;

                            dragEvent.dataTransfer?.setData(
                                INTERNAL_NODE_MIME,
                                JSON.stringify({
                                    type: 'customEmoji',
                                    attrs: nodeData.attrs,
                                    pos: nodeData.pos,
                                }),
                            );
                            if (dragEvent.dataTransfer) {
                                dragEvent.dataTransfer.effectAllowed = 'move';
                            }
                            view.dispatch(
                                view.state.tr.setMeta(CUSTOM_EMOJI_DRAG_META, {
                                    isDragging: true,
                                    draggedNodePos: nodeData.pos,
                                }),
                            );
                            return false;
                        },
                        dragover: (_view, event) => {
                            const dragEvent = event as DragEvent;
                            if (!dragEvent.dataTransfer?.types?.includes(INTERNAL_NODE_MIME)) {
                                return false;
                            }
                            event.preventDefault();
                            dragEvent.dataTransfer.dropEffect = 'move';
                            highlightDropZoneAtPosition(dragEvent.clientX, dragEvent.clientY);
                            return false;
                        },
                        dragend: (view) => {
                            setDraggingFalse(view);
                            return false;
                        },
                    },
                },
                view: (editorView) => {
                    let currentAutoScrollFrame: number | null = null;

                    const stopAutoScroll = () => {
                        if (currentAutoScrollFrame) {
                            cancelAnimationFrame(currentAutoScrollFrame);
                            currentAutoScrollFrame = null;
                        }
                    };

                    const startAutoScroll = (direction: 'up' | 'down', touchY: number) => {
                        stopAutoScroll();
                        const editorElement = editorView.dom as HTMLElement;
                        const rect = editorElement.getBoundingClientRect();
                        const distance =
                            direction === 'up'
                                ? touchY - rect.top
                                : rect.bottom - touchY;
                        const normalizedDistance = Math.max(0, Math.min(1, distance / SCROLL_THRESHOLD));
                        const scrollSpeed =
                            SCROLL_BASE_SPEED +
                            (SCROLL_MAX_SPEED - SCROLL_BASE_SPEED) * (1 - normalizedDistance);

                        const animateScroll = () => {
                            const currentScrollTop = editorElement.scrollTop;
                            const maxScrollTop = editorElement.scrollHeight - editorElement.clientHeight;

                            if (direction === 'up' && currentScrollTop > 0) {
                                editorElement.scrollTop = Math.max(0, currentScrollTop - scrollSpeed);
                                if (editorElement.scrollTop > 0) {
                                    currentAutoScrollFrame = requestAnimationFrame(animateScroll);
                                }
                                return;
                            }

                            if (direction === 'down' && currentScrollTop < maxScrollTop) {
                                editorElement.scrollTop = Math.min(maxScrollTop, currentScrollTop + scrollSpeed);
                                if (editorElement.scrollTop < maxScrollTop) {
                                    currentAutoScrollFrame = requestAnimationFrame(animateScroll);
                                }
                            }
                        };

                        currentAutoScrollFrame = requestAnimationFrame(animateScroll);
                    };

                    const handleTouchDrop = (event: CustomEvent) => {
                        stopAutoScroll();
                        const { nodeData, dropPosition, dropX, dropY } = event.detail;
                        editorView.dispatch(
                            editorView.state.tr.setMeta(CUSTOM_EMOJI_DRAG_META, {
                                isDragging: false,
                                draggedNodePos: null,
                            }),
                        );

                        if (nodeData?.type !== 'customEmoji' || typeof nodeData.pos !== 'number') {
                            return;
                        }

                        const coords =
                            typeof dropX === 'number' && typeof dropY === 'number'
                                ? editorView.posAtCoords({ left: dropX, top: dropY })
                                : null;
                        const targetPos =
                            typeof dropPosition === 'number'
                                ? dropPosition
                                : coords
                                    ? findClosestCustomEmojiDropPosition(
                                        editorView.state.doc,
                                        coords.pos,
                                        nodeData.pos,
                                    )
                                    : null;

                        if (typeof targetPos === 'number') {
                            moveCustomEmojiNode(editorView, nodeData, targetPos);
                        }
                    };

                    const handleTouchDragStart = (event: CustomEvent) => {
                        const { nodePos } = event.detail;
                        editorView.dispatch(
                            editorView.state.tr.setMeta(CUSTOM_EMOJI_DRAG_META, {
                                isDragging: true,
                                draggedNodePos: typeof nodePos === 'number' ? nodePos : null,
                            }),
                        );
                    };

                    const handleTouchMove = (event: CustomEvent) => {
                        const { touchY } = event.detail;
                        if (typeof touchY !== 'number') return;

                        const state = dragDropKey.getState(editorView.state);
                        if (!state?.isDragging) return;

                        const rect = editorView.dom.getBoundingClientRect();
                        if (touchY < rect.top + SCROLL_THRESHOLD) {
                            startAutoScroll('up', touchY);
                        } else if (touchY > rect.bottom - SCROLL_THRESHOLD) {
                            startAutoScroll('down', touchY);
                        } else {
                            stopAutoScroll();
                        }
                    };

                    const handleNativeDragStart = (event: CustomEvent) => {
                        const { nodePos } = event.detail;
                        editorView.dispatch(
                            editorView.state.tr.setMeta(CUSTOM_EMOJI_DRAG_META, {
                                isDragging: true,
                                draggedNodePos: typeof nodePos === 'number' ? nodePos : null,
                            }),
                        );
                    };

                    const handleNativeDragEnd = () => {
                        setDraggingFalse(editorView);
                    };

                    window.addEventListener('touch-custom-emoji-drop', handleTouchDrop as EventListener);
                    window.addEventListener('touch-custom-emoji-drag-start', handleTouchDragStart as EventListener);
                    window.addEventListener('touch-custom-emoji-drag-move', handleTouchMove as EventListener);
                    window.addEventListener('custom-emoji-native-drag-start', handleNativeDragStart as EventListener);
                    window.addEventListener('custom-emoji-native-drag-end', handleNativeDragEnd as EventListener);

                    return {
                        destroy() {
                            stopAutoScroll();
                            window.removeEventListener('touch-custom-emoji-drop', handleTouchDrop as EventListener);
                            window.removeEventListener('touch-custom-emoji-drag-start', handleTouchDragStart as EventListener);
                            window.removeEventListener('touch-custom-emoji-drag-move', handleTouchMove as EventListener);
                            window.removeEventListener('custom-emoji-native-drag-start', handleNativeDragStart as EventListener);
                            window.removeEventListener('custom-emoji-native-drag-end', handleNativeDragEnd as EventListener);
                        },
                    };
                },
            }),
            new Plugin({
                key: dropZoneKey,
                state: {
                    init: () => DecorationSet.empty,
                    apply(_tr, _previous, _oldState, newState) {
                        const dragState = dragDropKey.getState(newState);
                        if (!dragState?.isDragging) {
                            return DecorationSet.empty;
                        }

                        const decorations = getCustomEmojiDropPositions(
                            newState.doc,
                            dragState.draggedNodePos,
                        ).map((position) =>
                            Decoration.widget(position, () => createDropZoneWidget(position), {
                                side: -1,
                            }),
                        );

                        return DecorationSet.create(newState.doc, decorations);
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                },
            }),
        ];
    },
});
