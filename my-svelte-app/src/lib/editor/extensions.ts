import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { updateHashtagData } from "../stores";
import { validateAndNormalizeUrl, validateAndNormalizeImageUrl, moveImageNode, setDraggingFalse } from './editorUtils';
import { HASHTAG_REGEX } from '../constants';
import { SCROLL_THRESHOLD, SCROLL_BASE_SPEED, SCROLL_MAX_SPEED } from '../constants';

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

                    console.log('ContentTrackingExtension: appendTransaction triggered');

                    const linkMark = newState.schema.marks.link;
                    const imageNodeType = newState.schema.nodes.image;
                    if (!linkMark) return;

                    let tr: any = null;

                    newState.doc.descendants((node, pos) => {
                        if (!node.isText || !node.text) return;

                        const text = node.text;
                        console.log('ContentTrackingExtension: processing text node:', text);

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
                                console.log('ContentTrackingExtension: found image URL in text:', normalizedImageUrl);

                                tr = tr || newState.tr;
                                const start = pos + matchStart;
                                const end = pos + actualEnd;

                                // 空のパラグラフ内の画像URLかチェック
                                const $start = newState.doc.resolve(start);
                                const isInEmptyParagraph = $start.parent.type.name === 'paragraph' &&
                                    $start.parent.content.size === (end - start);

                                console.log('ContentTrackingExtension: paragraph info:', {
                                    parentType: $start.parent.type.name,
                                    parentContentSize: $start.parent.content.size,
                                    urlLength: end - start,
                                    isInEmptyParagraph
                                });

                                // 画像ノードを作成してテキストを置換
                                const imageNode = imageNodeType.create({
                                    src: normalizedImageUrl,
                                    alt: 'Image'
                                });

                                if (isInEmptyParagraph) {
                                    console.log('ContentTrackingExtension: replacing empty paragraph with image');
                                    // 空のパラグラフ全体を画像で置換
                                    const paragraphStart = $start.start($start.depth);
                                    const paragraphEnd = $start.end($start.depth);
                                    tr = tr.replaceWith(paragraphStart, paragraphEnd, imageNode);
                                } else {
                                    console.log('ContentTrackingExtension: replacing URL text with image');
                                    // 通常の置換
                                    tr = tr.replaceWith(start, end, imageNode);
                                }
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

                    if (tr && tr.docChanged) {
                        console.log('ContentTrackingExtension: returning transaction');
                        return tr;
                    }
                    return null;
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

// 先頭の空パラグラフ削除用Extension
export const SmartBackspaceExtension = Extension.create({
    name: 'smartBackspace',
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('smart-backspace'),
                props: {
                    handleKeyDown(view, event) {
                        // Backspaceキーのみ
                        if (event.key !== 'Backspace') return false;
                        const { state } = view;
                        const { selection, doc } = state;
                        // キャレットが先頭かつパラグラフの先頭
                        if (selection.empty && selection.from === 1) {
                            const firstNode = doc.firstChild;
                            const secondNode = doc.childCount > 1 ? doc.child(1) : null;
                            // 先頭が空パラグラフ、次が画像ノード
                            if (
                                firstNode &&
                                firstNode.type.name === 'paragraph' &&
                                firstNode.content.size === 0 &&
                                secondNode &&
                                secondNode.type.name === 'image'
                            ) {
                                // パラグラフを削除
                                view.dispatch(
                                    state.tr.delete(0, firstNode.nodeSize)
                                );
                                return true;
                            }
                        }
                        return false;
                    }
                }
            })
        ];
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
                        // より詳細な実機デバッグログ
                        console.log('=== ImagePasteExtension DEBUG START ===');
                        console.log('User agent:', navigator.userAgent);
                        console.log('Event type:', event.type);
                        console.log('Event target:', event.target);

                        const text = event.clipboardData?.getData('text/plain') || '';
                        console.log('Clipboard text length:', text.length);
                        console.log('Clipboard text (first 100 chars):', text.substring(0, 100));

                        // --- 複数画像URL: 改行または半角スペース区切り対応 ---
                        const items = text.split(/[\n ]+/).map(line => line.trim()).filter(Boolean);
                        console.log('Split items count:', items.length);
                        console.log('Split items:', items);

                        // 画像URLのみ抽出
                        const imageUrls = items
                            .map(line => {
                                const result = validateAndNormalizeImageUrl(line);
                                console.log(`URL validation: "${line}" -> ${result}`);
                                return result;
                            })
                            .filter(Boolean);

                        console.log('Valid image URLs count:', imageUrls.length);
                        console.log('Valid image URLs:', imageUrls);

                        if (imageUrls.length > 0) {
                            console.log('=== PROCESSING IMAGE PASTE ===');
                            event.preventDefault();

                            const { state, dispatch } = view;
                            const { tr, selection, schema } = state;

                            // 詳細な状態ログ
                            console.log('Editor state info:');
                            console.log('- Document structure:', JSON.stringify(state.doc.toJSON(), null, 2));
                            console.log('- Selection:', { from: selection.from, to: selection.to, empty: selection.empty });

                            // 空のパラグラフ内にカーソルがあるかチェック
                            const $from = state.doc.resolve(selection.from);
                            console.log('Resolved position info:');
                            console.log('- Depth:', $from.depth);
                            console.log('- Parent type:', $from.parent.type.name);
                            console.log('- Parent content size:', $from.parent.content.size);
                            console.log('- Parent node:', $from.parent.toJSON());

                            const isInEmptyParagraph = selection.empty &&
                                $from.parent.type.name === 'paragraph' &&
                                $from.parent.content.size === 0;

                            console.log('Empty paragraph check result:', isInEmptyParagraph);

                            // 画像ノードを作成
                            const imageNodes = imageUrls.map((url, index) => {
                                const node = schema.nodes.image.create({
                                    src: url,
                                    alt: 'Pasted image'
                                });
                                console.log(`Created image node ${index}:`, node.toJSON());
                                return node;
                            });

                            let transaction = tr;

                            if (isInEmptyParagraph && imageNodes.length > 0) {
                                console.log('=== EMPTY PARAGRAPH REPLACEMENT ===');

                                // より確実な範囲計算
                                const paragraphStart = $from.before($from.depth);
                                const paragraphEnd = $from.after($from.depth);

                                console.log('Paragraph range calculation:');
                                console.log('- Paragraph start:', paragraphStart);
                                console.log('- Paragraph end:', paragraphEnd);
                                console.log('- Range size:', paragraphEnd - paragraphStart);
                                console.log('- Parent node size:', $from.parent.nodeSize);

                                try {
                                    // 最初の画像で置換
                                    console.log('Replacing empty paragraph with first image...');
                                    transaction = transaction.replaceWith(paragraphStart, paragraphEnd, imageNodes[0]);
                                    console.log('First replacement successful');

                                    // 残りの画像があれば順次挿入
                                    let insertPos = paragraphStart + imageNodes[0].nodeSize;
                                    console.log('Starting position for additional images:', insertPos);

                                    for (let i = 1; i < imageNodes.length; i++) {
                                        console.log(`Inserting image ${i} at position ${insertPos}`);
                                        transaction = transaction.insert(insertPos, imageNodes[i]);
                                        insertPos += imageNodes[i].nodeSize;
                                        console.log(`Image ${i} inserted, next position: ${insertPos}`);
                                    }

                                    console.log('All replacements/insertions completed');
                                } catch (error) {
                                    console.error('Error during paragraph replacement:', error);
                                    console.log('Falling back to normal insertion...');

                                    // フォールバック: 通常の挿入
                                    transaction = tr; // リセット
                                    imageNodes.forEach((imageNode, idx) => {
                                        if (idx === 0) {
                                            transaction = transaction.replaceSelectionWith(imageNode);
                                        } else {
                                            const pos = transaction.selection.$to.pos;
                                            transaction = transaction.insert(pos, imageNode);
                                        }
                                    });
                                }
                            } else {
                                console.log('=== NORMAL INSERTION ===');
                                // 通常の挿入処理
                                imageNodes.forEach((imageNode, idx) => {
                                    console.log(`Normal insertion of image ${idx}`);
                                    if (idx === 0) {
                                        transaction = transaction.replaceSelectionWith(imageNode);
                                    } else {
                                        const pos = transaction.selection.$to.pos;
                                        transaction = transaction.insert(pos, imageNode);
                                    }
                                });
                            }

                            console.log('Final transaction steps:', transaction.steps.length);
                            console.log('Dispatching transaction...');

                            // 実機でのタイミング問題対策として少し遅延
                            setTimeout(() => {
                                try {
                                    dispatch(transaction);
                                    console.log('Transaction dispatched successfully');
                                    console.log('=== ImagePasteExtension DEBUG END (SUCCESS) ===');
                                } catch (error) {
                                    console.error('Error dispatching transaction:', error);
                                    console.log('=== ImagePasteExtension DEBUG END (ERROR) ===');
                                }
                            }, 10);

                            return true;
                        }

                        console.log('No image URLs found, allowing normal paste');
                        console.log('=== ImagePasteExtension DEBUG END (NORMAL) ===');
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
                        console.log('Touch drop received in extension'); // デバッグログ
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
                        console.log('Touch drag start received in extension'); // デバッグログ
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
                        const scrollThreshold = SCROLL_THRESHOLD; // 拡大された境界範囲

                        console.log('Touch move:', { touchY, rect, isDragging: state.isDragging }); // デバッグログ

                        // 上端近くでスクロールアップ（範囲拡大）
                        if (touchY < rect.top + scrollThreshold) {
                            console.log('Starting auto scroll up, distance:', rect.top + scrollThreshold - touchY); // デバッグログ
                            startAutoScroll('up', touchY);
                        }
                        // 下端近くでスクロールダウン（範囲拡大）
                        else if (touchY > rect.bottom - scrollThreshold) {
                            console.log('Starting auto scroll down, distance:', touchY - (rect.bottom - scrollThreshold)); // デバッグログ
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
                setDraggingFalse(view);
                return moveImageNode(view, nodeData, dropPos);
            }
        };
    }
});
