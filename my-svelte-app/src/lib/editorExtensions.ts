import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { updateHashtagData } from "./stores";
import { validateAndNormalizeUrl, validateAndNormalizeImageUrl } from './editorUtils';

// ハッシュタグ共通正規表現
export const HASHTAG_REGEX = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g;

// 文字境界判定用の共通関数
function isWordBoundary(char: string | undefined): boolean {
    return !char || /[\s\n\u3000]/.test(char);
}

// URLの末尾クリーンアップ関数（より柔軟な判定）
function cleanUrlEnd(url: string): { cleanUrl: string; actualLength: number } {
    let cleanUrl = url;

    // 末尾の不要な文字を段階的に除去（ただし、入力中の場合は保持）
    // 連続する句読点や括弧のみを除去し、単独の場合は保持
    const trailingPattern = /([.,;:!?）】」』〉》】\]}>）]){2,}$/;
    const trailingMatch = cleanUrl.match(trailingPattern);
    if (trailingMatch) {
        cleanUrl = cleanUrl.slice(0, -trailingMatch[0].length);
    }

    return {
        cleanUrl,
        actualLength: cleanUrl.length
    };
}

// URLとハッシュタグの検出・装飾・再検証を統合したExtension
export const ContentTrackingExtension = Extension.create({
    name: 'contentTracking',

    addProseMirrorPlugins() {
        return [
            // ハッシュタグ装飾とURL再検証を統合したプラグイン
            new Plugin({
                key: new PluginKey('content-decoration-validation'),
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply(tr) {
                        const doc = tr.doc;
                        const decorations: Decoration[] = [];

                        doc.descendants((node, pos) => {
                            if (node.isText && node.text) {
                                const text = node.text;

                                // ハッシュタグ装飾
                                const hashtagRegex = new RegExp(HASHTAG_REGEX.source, 'g');
                                let hashtagMatch;
                                while ((hashtagMatch = hashtagRegex.exec(text)) !== null) {
                                    const hashIndex = hashtagMatch[0].indexOf('#');
                                    if (hashIndex === -1) continue;
                                    const start = pos + hashtagMatch.index + hashIndex;
                                    const end = start + 1 + hashtagMatch[1].length;
                                    decorations.push(
                                        Decoration.inline(start, end, {
                                            class: 'hashtag'
                                        })
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
                },
                // URL再検証のためのappendTransactionを追加
                appendTransaction: (transactions, _oldState, newState) => {
                    if (!transactions.some(tr => tr.docChanged)) return;
                    const linkMark = newState.schema.marks.link;
                    const imageNodeType = newState.schema.nodes.image;
                    if (!linkMark) return;

                    let tr: any = null;

                    newState.doc.descendants((node, pos) => {
                        if (!node.isText || !node.text) return;

                        const text = node.text;
                        const hasLinkMark = node.marks?.some(m => m.type === linkMark);

                        // 既存のリンクマークを一旦すべて削除
                        if (hasLinkMark) {
                            tr = tr || newState.tr;
                            tr.removeMark(pos, pos + text.length, linkMark);
                        }

                        // より柔軟なURL検出パターン（入力中も考慮）
                        const urlRegex = /https?:\/\/[^\s\u3000]+/gi;
                        let urlMatch;

                        while ((urlMatch = urlRegex.exec(text)) !== null) {
                            if (typeof urlMatch.index !== 'number') continue;

                            const matchStart = urlMatch.index;
                            const matchEnd = matchStart + urlMatch[0].length;

                            // 前の文字が境界文字（スペース、改行、全角スペース、文字列開始）かチェック
                            const prevChar = matchStart > 0 ? text[matchStart - 1] : undefined;

                            // URLの前に境界文字以外がある場合はスキップ
                            if (!isWordBoundary(prevChar)) {
                                continue;
                            }

                            // URLの末尾処理（より柔軟に）
                            const originalUrl = urlMatch[0];
                            const { cleanUrl, actualLength } = cleanUrlEnd(originalUrl);
                            const actualEnd = matchStart + actualLength;

                            // 画像URLなら画像ノードに置換
                            const normalizedImageUrl = validateAndNormalizeImageUrl(cleanUrl);
                            if (normalizedImageUrl && imageNodeType) {
                                tr = tr || newState.tr;
                                const start = pos + matchStart;
                                const end = pos + actualEnd;
                                // 画像ノードを作成してテキストを置換
                                const imageNode = imageNodeType.create({
                                    src: normalizedImageUrl,
                                    alt: 'Image'
                                });
                                tr = tr.replaceWith(start, end, imageNode);
                                continue;
                            }

                            // より緩い検証（入力中のURLも考慮）
                            // 基本的なURL構造があれば受け入れる
                            const isValidUrl = /^https?:\/\/[a-zA-Z0-9]/.test(cleanUrl) && cleanUrl.length > 8;

                            if (isValidUrl) {
                                // utils関数でのバリデーションは最終確認のみ
                                const normalizedUrl = validateAndNormalizeUrl(cleanUrl);
                                const finalUrl = normalizedUrl || cleanUrl; // バリデーション失敗でも基本構造があれば使用

                                tr = tr || newState.tr;
                                const start = pos + matchStart;
                                const end = pos + actualEnd;
                                const mark = linkMark.create({ href: finalUrl });
                                tr.addMark(start, end, mark);
                            }
                        }
                    });

                    return tr && tr.docChanged ? tr : null;
                }
            }),
            // コンテンツ更新追跡プラグイン
            new Plugin({
                key: new PluginKey('content-update-tracker'),
                state: {
                    init: () => null,
                    apply: (tr) => {
                        if (tr.docChanged) {
                            // デバウンス処理付きでハッシュタグデータを更新
                            this.storage.updateTimeout && clearTimeout(this.storage.updateTimeout);
                            this.storage.updateTimeout = setTimeout(() => {
                                const plainText = tr.doc.textContent;
                                updateHashtagData(plainText);

                                // カスタムイベント発火（外部コンポーネント用）
                                const event = new CustomEvent('editor-content-changed', {
                                    detail: { plainText }
                                });
                                window.dispatchEvent(event);
                            }, 300);
                        }
                        return null;
                    }
                }
            })
        ];
    },

    addStorage() {
        return {
            // setTimeout の戻り値型を明示（ブラウザ環境）
            updateTimeout: null as ReturnType<typeof setTimeout> | null
        };
    },

    onDestroy() {
        if (this.storage.updateTimeout) {
            clearTimeout(this.storage.updateTimeout);
        }
    }
});

// 画像自動挿入用のPasteハンドラーExtension
export const ImagePasteExtension = Extension.create({
    name: 'imagePaste',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('image-paste'),
                props: {
                    handlePaste: (view, event) => {
                        const text = event.clipboardData?.getData('text/plain') || '';
                        // --- 複数画像URL: 改行または半角スペース区切り対応 ---
                        // 改行または半角スペースで分割し、空要素を除外
                        const items = text.split(/[\n ]+/).map(line => line.trim()).filter(Boolean);

                        // 画像URLのみ抽出
                        const imageNodes = items
                            .map(line => {
                                const normalizedUrl = validateAndNormalizeImageUrl(line);
                                if (normalizedUrl) {
                                    return view.state.schema.nodes.image.create({
                                        src: normalizedUrl,
                                        alt: 'Pasted image'
                                    });
                                }
                                return null;
                            })
                            .filter(Boolean);

                        if (imageNodes.length > 0) {
                            event.preventDefault();
                            let { tr } = view.state;
                            imageNodes.forEach((imageNode, idx) => {
                                if (!imageNode) return;
                                if (idx === 0) {
                                    tr = tr.replaceSelectionWith(imageNode);
                                } else {
                                    const pos = tr.selection.$to.pos;
                                    tr = tr.insert(pos, imageNode);
                                }
                            });
                            view.dispatch(tr);
                            return true;
                        }

                        // 画像URLがなければ通常の貼り付け
                        return false;
                    }
                }
            })
        ];
    }
});

// 画像ドラッグドロップ用Extension
export const ImageDragDropExtension = Extension.create({
    name: 'imageDragDrop',

    addProseMirrorPlugins() {
        const imageDragDropKey = new PluginKey('image-drag-drop');
        const dropZoneKey = new PluginKey('drop-zone-indicator');

        // ドラッグ状態を解除する共通関数
        function setDraggingFalse(viewOrEditorView: any) {
            viewOrEditorView.dispatch(
                viewOrEditorView.state.tr.setMeta('imageDrag', { isDragging: false, draggedNodePos: null })
            );
        }

        // ノード移動処理を共通化
        function moveImage(viewOrEditorView: any, nodeData: any, targetPos: number, moveImageNode: any) {
            setDraggingFalse(viewOrEditorView);
            moveImageNode(viewOrEditorView, nodeData, targetPos);
        }

        return [
            new Plugin({
                key: imageDragDropKey,
                state: {
                    init: () => ({ isDragging: false, draggedNodePos: null }),
                    apply: (tr, value) => {
                        const meta = tr.getMeta('imageDrag');
                        if (meta) {
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
                                        moveImage(view, nodeData, coords.pos, (this as any).storage.moveImageNode);
                                        return true;
                                    }
                                }
                            } catch (e) {
                                console.warn('Failed to parse drag data:', e);
                            }
                        }
                        return false;
                    }
                },
                view: (editorView) => {
                    const handleTouchDrop = (event: CustomEvent) => {
                        const { nodeData, dropPosition, dropX, dropY } = event.detail;
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
                                moveImage(editorView, nodeData, targetPos, (this as any).storage.moveImageNode);
                            }
                        }
                    };

                    const handleTouchDragStart = (event: CustomEvent) => {
                        const { nodePos } = event.detail;
                        editorView.dispatch(editorView.state.tr.setMeta('imageDrag', { isDragging: true, draggedNodePos: nodePos }));
                    };

                    window.addEventListener('touch-image-drop', handleTouchDrop as EventListener);
                    window.addEventListener('touch-image-drag-start', handleTouchDragStart as EventListener);

                    return {
                        destroy() {
                            window.removeEventListener('touch-image-drop', handleTouchDrop as EventListener);
                            window.removeEventListener('touch-image-drag-start', handleTouchDragStart as EventListener);
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
                        // imageDragDropKey を使用して状態を取得
                        const imageDragState = imageDragDropKey.getState(newState);
                        console.log('Drop zone plugin - drag state:', imageDragState); // デバッグログ

                        if (!imageDragState?.isDragging) {
                            return DecorationSet.empty;
                        }

                        const decorations: Decoration[] = [];
                        const doc = newState.doc;

                        // --- 画像が一番上にある場合は先頭バーを非表示 ---
                        // 1. ドラッグ対象ノードが画像かつ先頭ノードか判定
                        let skipTopDropZone = false;
                        if (typeof imageDragState.draggedNodePos === "number") {
                            const firstNode = doc.firstChild;
                            if (
                                firstNode &&
                                firstNode.type.name === "image" &&
                                firstNode.attrs &&
                                // 先頭ノードのposは常に0
                                imageDragState.draggedNodePos === 0
                            ) {
                                skipTopDropZone = true;
                            }
                        }

                        // ドキュメントの最初にドロップゾーン（他のコンテンツより前）
                        if (!skipTopDropZone) {
                            decorations.push(
                                Decoration.widget(0, () => {
                                    const dropZone = document.createElement('div');
                                    dropZone.className = 'drop-zone-indicator drop-zone-top';
                                    dropZone.setAttribute('data-drop-pos', '0');
                                    // シンプルなバーのみ
                                    dropZone.innerHTML = `<div class="drop-zone-bar"></div>`;
                                    return dropZone;
                                }, { side: -1 })
                            );
                        }

                        // 各ノードの間と後にドロップゾーンを追加
                        doc.descendants((node, pos) => {
                            if (node.type.name === 'paragraph' || node.type.name === 'image') {
                                const afterPos = pos + node.nodeSize;

                                // ドラッグ中の画像自身の直前（＝自分の上）にはバーを表示しない
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
                                            // シンプルなバーのみ
                                            dropZone.innerHTML = `<div class="drop-zone-bar"></div>`;
                                            return dropZone;
                                        }, { side: 1 })
                                    );
                                }
                            }
                        });

                        console.log('Total decorations created:', decorations.length); // デバッグログ
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
                const { tr, schema } = view.state;
                let transaction = tr;

                // ドロップ位置と元の位置を取得
                const originalPos = nodeData.pos;

                console.log('Moving image:', { originalPos, dropPos });

                // 同じ位置にドロップした場合は何もしない
                if (dropPos === originalPos) {
                    console.log('Same position drop, ignoring');
                    return true;
                }

                // 新しい画像ノードを作成
                const imageNode = schema.nodes.image.create(nodeData.attrs);

                try {
                    // 位置関係に応じて削除と挿入の順序を調整
                    if (dropPos < originalPos) {
                        // ドロップ位置が元の位置より前の場合
                        console.log('Dropping before original position');
                        transaction = transaction.insert(dropPos, imageNode);
                        // 元のノードを削除（位置が1つずれるため+1）
                        transaction = transaction.delete(originalPos + 1, originalPos + 2);
                    } else if (dropPos > originalPos + 1) {
                        // ドロップ位置が元の位置より十分後ろの場合
                        console.log('Dropping after original position');
                        // 先に元のノードを削除
                        transaction = transaction.delete(originalPos, originalPos + 1);
                        // 削除によって位置が調整されるため-1
                        transaction = transaction.insert(dropPos - 1, imageNode);
                    } else {
                        // 隣接位置への移動は無視
                        console.log('Adjacent position drop, ignoring');
                        return true;
                    }

                    view.dispatch(transaction);
                    console.log('Image moved successfully');
                    return true;
                } catch (error) {
                    console.error('Error moving image:', error);
                    return false;
                }
            }
        };
    }
});
