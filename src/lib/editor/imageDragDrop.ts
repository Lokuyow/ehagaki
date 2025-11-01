import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { moveImageNode, setDraggingFalse } from '../utils/editorUtils';
import { isTouchDevice } from '../utils/appDomUtils';
import { SCROLL_THRESHOLD, SCROLL_BASE_SPEED, SCROLL_MAX_SPEED } from '../constants';

export const ImageDragDropExtension = Extension.create({
    name: 'imageDragDrop',

    addProseMirrorPlugins() {
        const imageDragDropKey = new PluginKey('image-drag-drop');
        const dropZoneKey = new PluginKey('drop-zone-indicator');

        // PC（マウス操作）では Tiptap の Dropcursor extension を使用
        // タッチデバイスでは独自のドロップゾーン表示（視覚的なバー）を使用
        return [
            new Plugin({
                key: imageDragDropKey,
                state: {
                    init: () => ({
                        isDragging: false,
                        draggedNodePos: null,
                        autoScrollInterval: null as ReturnType<typeof setInterval> | null
                    }),
                    apply: (tr, value) => {
                        const meta = tr.getMeta('imageDrag');
                        if (meta) {
                            // 自動スクロール制御
                            if (meta.isDragging === false && value.autoScrollInterval) {
                                clearInterval(value.autoScrollInterval);
                                return { ...value, ...meta, autoScrollInterval: null };
                            }
                            return { ...value, ...meta };
                        }
                        return value;
                    }
                },
                props: {
                    handleDrop: (view, event, _slice, moved) => {
                        const dragData = event.dataTransfer?.getData('application/x-tiptap-node');
                        if (!moved && dragData) {
                            try {
                                const nodeData = JSON.parse(dragData);
                                if (nodeData.type === 'image') {
                                    event.preventDefault();
                                    const coords = view.posAtCoords({
                                        left: event.clientX,
                                        top: event.clientY
                                    });
                                    if (coords && typeof nodeData.pos === 'number') {
                                        setDraggingFalse(view);
                                        moveImageNode(view, nodeData, coords.pos);
                                        return true;
                                    }
                                }
                            } catch (e) {
                                console.warn('Failed to parse drag data:', e);
                            }
                        }
                        return false;
                    },
                    handleDOMEvents: {
                        dragstart: (_view, event) => {
                            if (isTouchDevice()) {
                                event.preventDefault();
                                return true;
                            }
                            return false;
                        },
                        dragover: (_view, event) => {
                            if (isTouchDevice()) {
                                event.preventDefault();
                                return true;
                            }
                            return false;
                        },
                        drop: (_view, event) => {
                            if (isTouchDevice()) {
                                event.preventDefault();
                                return true;
                            }
                            return false;
                        }
                    }
                },
                view: (editorView) => {
                    let currentAutoScrollFrame: number | null = null;

                    const startAutoScroll = (direction: 'up' | 'down', touchY: number) => {
                        // 既存のスクロールを停止
                        if (currentAutoScrollFrame) {
                            cancelAnimationFrame(currentAutoScrollFrame);
                            currentAutoScrollFrame = null;
                        }

                        const tiptapEditor = editorView.dom as HTMLElement;
                        if (!tiptapEditor) return;

                        const rect = tiptapEditor.getBoundingClientRect();
                        const scrollThreshold = SCROLL_THRESHOLD; // 定数化

                        // 境界からの距離に応じて速度を調整（より滑らかに）
                        let distance = 0;
                        if (direction === 'up') {
                            distance = touchY - rect.top;
                        } else {
                            distance = rect.bottom - touchY;
                        }

                        // 距離に応じた速度計算（より滑らかな範囲）
                        const normalizedDistance = Math.max(0, Math.min(1, distance / scrollThreshold));
                        const scrollSpeed = SCROLL_BASE_SPEED + (SCROLL_MAX_SPEED - SCROLL_BASE_SPEED) * (1 - normalizedDistance);

                        const animateScroll = () => {
                            const currentScrollTop = tiptapEditor.scrollTop;
                            const scrollHeight = tiptapEditor.scrollHeight;
                            const clientHeight = tiptapEditor.clientHeight;

                            if (direction === 'up' && currentScrollTop > 0) {
                                const newScrollTop = Math.max(0, currentScrollTop - scrollSpeed);
                                tiptapEditor.scrollTop = newScrollTop;

                                if (newScrollTop > 0) {
                                    currentAutoScrollFrame = requestAnimationFrame(animateScroll);
                                }
                            } else if (direction === 'down' && currentScrollTop < scrollHeight - clientHeight) {
                                const newScrollTop = Math.min(scrollHeight - clientHeight, currentScrollTop + scrollSpeed);
                                tiptapEditor.scrollTop = newScrollTop;

                                if (newScrollTop < scrollHeight - clientHeight) {
                                    currentAutoScrollFrame = requestAnimationFrame(animateScroll);
                                }
                            }
                        };

                        currentAutoScrollFrame = requestAnimationFrame(animateScroll);
                    };

                    const stopAutoScroll = () => {
                        if (currentAutoScrollFrame) {
                            cancelAnimationFrame(currentAutoScrollFrame);
                            currentAutoScrollFrame = null;
                        }
                    };

                    const handleTouchDrop = (event: CustomEvent) => {
                        const { nodeData, dropPosition, dropX, dropY } = event.detail;
                        stopAutoScroll();

                        // ドラッグ状態を解除
                        editorView.dispatch(
                            editorView.state.tr.setMeta('imageDrag', {
                                isDragging: false,
                                draggedNodePos: null
                            })
                        );

                        if (nodeData && nodeData.type === 'image') {
                            let targetPos: number;
                            if (typeof dropPosition === 'number') {
                                targetPos = dropPosition;
                            } else {
                                const coords = editorView.posAtCoords({
                                    left: dropX,
                                    top: dropY
                                });
                                targetPos = coords?.pos || nodeData.pos;
                            }
                            if (typeof nodeData.pos === 'number') {
                                moveImageNode(editorView, nodeData, targetPos);
                            }
                        }
                    };

                    const handleTouchDragStart = (event: CustomEvent) => {
                        const { nodePos } = event.detail;
                        editorView.dispatch(
                            editorView.state.tr.setMeta('imageDrag', {
                                isDragging: true,
                                draggedNodePos: nodePos
                            })
                        );
                    };

                    const handleTouchMove = (event: CustomEvent) => {
                        const { touchY } = event.detail;
                        if (typeof touchY !== 'number') return;

                        const state = imageDragDropKey.getState(editorView.state);
                        if (!state?.isDragging) return;

                        // .tiptap-editor要素を直接取得
                        const tiptapEditor = editorView.dom as HTMLElement;
                        if (!tiptapEditor) return;

                        const rect = tiptapEditor.getBoundingClientRect();
                        const scrollThreshold = SCROLL_THRESHOLD;

                        // 上端近くでスクロールアップ
                        if (touchY < rect.top + scrollThreshold) {
                            startAutoScroll('up', touchY);
                        }
                        // 下端近くでスクロールダウン
                        else if (touchY > rect.bottom - scrollThreshold) {
                            startAutoScroll('down', touchY);
                        }
                        // 中間位置では自動スクロール停止
                        else {
                            stopAutoScroll();
                        }
                    };

                    window.addEventListener('touch-image-drop', handleTouchDrop as EventListener);
                    window.addEventListener('touch-image-drag-start', handleTouchDragStart as EventListener);
                    window.addEventListener('touch-image-drag-move', handleTouchMove as EventListener);

                    return {
                        destroy() {
                            stopAutoScroll();
                            window.removeEventListener('touch-image-drop', handleTouchDrop as EventListener);
                            window.removeEventListener('touch-image-drag-start', handleTouchDragStart as EventListener);
                            window.removeEventListener('touch-image-drag-move', handleTouchMove as EventListener);
                        }
                    };
                }
            }),
            // ドロップゾーン表示プラグイン
            new Plugin({
                key: dropZoneKey,
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply(_tr, _prev, _oldState, newState) {
                        // PC環境ではドロップゾーンを作成しない
                        if (!isTouchDevice()) {
                            return DecorationSet.empty;
                        }

                        // imageDragDropKey を使用して状態を取得
                        const imageDragState = imageDragDropKey.getState(newState);

                        if (!imageDragState?.isDragging) {
                            return DecorationSet.empty;
                        }

                        const decorations: Decoration[] = [];
                        const doc = newState.doc;

                        // 画像が一番上にある場合は先頭バーを非表示
                        let skipTopDropZone = false;
                        if (typeof imageDragState.draggedNodePos === "number") {
                            const firstNode = doc.firstChild;
                            if (
                                firstNode &&
                                firstNode.type.name === "image" &&
                                firstNode.attrs &&
                                imageDragState.draggedNodePos === 0
                            ) {
                                skipTopDropZone = true;
                            }
                        }

                        // ドキュメントの最初にドロップゾーン
                        if (!skipTopDropZone) {
                            decorations.push(
                                Decoration.widget(0, () => {
                                    const dropZone = document.createElement('div');
                                    dropZone.className = 'drop-zone-indicator drop-zone-top';
                                    dropZone.setAttribute('data-drop-pos', '0');
                                    const bar = document.createElement('div');
                                    bar.className = 'drop-zone-bar';
                                    dropZone.appendChild(bar);
                                    return dropZone;
                                }, { side: -1 })
                            );
                        }

                        // 各ノードの間と後にドロップゾーンを追加
                        doc.descendants((node, pos) => {
                            if (node.type.name === 'paragraph' || node.type.name === 'image') {
                                const afterPos = pos + node.nodeSize;

                                // ドラッグ中の画像自身の直前にはバーを表示しない
                                if (
                                    typeof imageDragState.draggedNodePos === "number" &&
                                    afterPos === imageDragState.draggedNodePos
                                ) {
                                    return;
                                }

                                // ドラッグ中のノードの後ろには挿入ポイントを表示しない
                                if (imageDragState.draggedNodePos !== pos) {
                                    decorations.push(
                                        Decoration.widget(afterPos, () => {
                                            const dropZone = document.createElement('div');
                                            dropZone.className = 'drop-zone-indicator drop-zone-between';
                                            dropZone.setAttribute('data-drop-pos', afterPos.toString());
                                            const bar = document.createElement('div');
                                            bar.className = 'drop-zone-bar';
                                            dropZone.appendChild(bar);
                                            return dropZone;
                                        }, { side: 1 })
                                    );
                                }
                            }
                        });

                        return DecorationSet.create(doc, decorations);
                    }
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    }
                }
            })
        ];
    },

    addStorage() {
        return {
            moveImageNode: (view: any, nodeData: any, dropPos: number) => {
                setDraggingFalse(view);
                // フォーカスを奪わずに画像ノードを移動
                return moveImageNode(view, nodeData, dropPos);
            }
        };
    }
});
