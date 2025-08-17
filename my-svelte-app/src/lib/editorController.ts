import { createEditor } from 'svelte-tiptap';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { updateHashtagData } from "./stores";
import Placeholder from '@tiptap/extension-placeholder';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteImageNode from '../components/SvelteImageNode.svelte';

// ハッシュタグ共通正規表現
export const HASHTAG_REGEX = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g;

// ハッシュタグ装飾とコンテンツ更新を統合したExtension
export const ContentTrackingExtension = Extension.create({
    name: 'contentTracking',

    addProseMirrorPlugins() {
        return [
            // ハッシュタグ装飾プラグイン
            new Plugin({
                key: new PluginKey('hashtag-decoration'),
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
                                // 既存の共通定数を利用して重複を排除
                                const regex = new RegExp(HASHTAG_REGEX.source, 'g');
                                let match;

                                while ((match = regex.exec(text)) !== null) {
                                    // match[0]: 前後の空白＋#＋タグ本体, match[1]: タグ本体
                                    // ハッシュタグの「#」からタグ本体までを装飾し、スペースは含めない
                                    // match.index: マッチ開始位置（空白含む）
                                    // match[0].indexOf('#'): 「#」の位置（空白の後）
                                    const hashIndex = match[0].indexOf('#');
                                    if (hashIndex === -1) continue;
                                    const start = pos + match.index + hashIndex;
                                    const end = start + 1 + match[1].length; // 「#」+タグ本体
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
                }
            }),
            // 追加: link マークの再検証プラグイン
            new Plugin({
                key: new PluginKey('link-validator'),
                // transactions がドキュメントを変更した場合に走る appendTransaction を使う
                appendTransaction: (transactions, _oldState, newState) => {
                    if (!transactions.some(tr => tr.docChanged)) return;
                    const linkMark = newState.schema.marks.link;
                    if (!linkMark) return;

                    // ノード内の部分的な URL を検出するための正規表現（改行・半角/全角空白で分断されると分割される）
                    const urlPartRegex = /https?:\/\/[^\s\u3000]+/gi;

                    let tr: any = null;

                    newState.doc.descendants((node, pos) => {
                        if (!node.isText || !node.marks || node.marks.length === 0) return;

                        const hasLink = node.marks.some(m => m.type === linkMark);
                        if (!hasLink) return;

                        const text = node.text || '';
                        const matches = Array.from(text.matchAll(urlPartRegex));

                        // 1) リンクマークを一旦削除
                        tr = tr || newState.tr;
                        tr.removeMark(pos, pos + text.length, linkMark);

                        // 2) URL と判断できる部分だけ再付与（href 属性はマッチした文字列そのものを使用）
                        for (const m of matches) {
                            if (typeof m.index !== 'number') continue;
                            const start = pos + m.index;
                            const end = start + m[0].length;
                            const mark = linkMark.create({ href: m[0] });
                            tr.addMark(start, end, mark);
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
                        const imageUrlMatch = text.match(/^https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|svg)(\?[^\s]*)?$/i);

                        if (imageUrlMatch) {
                            event.preventDefault();
                            const { tr } = view.state;
                            const imageNode = view.state.schema.nodes.image.create({
                                src: text.trim(),
                                alt: 'Pasted image'
                            });

                            const transaction = tr.replaceSelectionWith(imageNode);
                            view.dispatch(transaction);
                            return true;
                        }
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
                    init: () => ({ isDragging: false, draggedNodePos: null }),
                    apply: (tr, value) => {
                        const meta = tr.getMeta('imageDrag');
                        if (meta) {
                            console.log('ImageDrag state update:', meta); // デバッグログ
                            return { ...value, ...meta };
                        }
                        return value;
                    }
                },
                props: {
                    handleDrop: (view, event, _slice, moved) => {
                        // 既存のドラッグドロップ処理（外部ファイルなど）は通す
                        if (!moved && event.dataTransfer) {
                            const dragData = event.dataTransfer.getData('application/x-tiptap-node');
                            if (dragData) {
                                try {
                                    const nodeData = JSON.parse(dragData);
                                    if (nodeData.type === 'image') {
                                        event.preventDefault();

                                        const coords = view.posAtCoords({
                                            left: event.clientX,
                                            top: event.clientY
                                        });

                                        if (coords && typeof nodeData.pos === 'number') {
                                            // ドラッグ終了状態に更新
                                            view.dispatch(view.state.tr.setMeta('imageDrag', { isDragging: false, draggedNodePos: null }));
                                            return this.storage.moveImageNode(view, nodeData, coords.pos);
                                        }
                                    }
                                } catch (e) {
                                    console.warn('Failed to parse drag data:', e);
                                }
                            }
                        }
                        return false;
                    }
                },
                view: (editorView) => {
                    // タッチドロップイベントのリスナーを追加
                    const handleTouchDrop = (event: CustomEvent) => {
                        console.log('Touch drop event received:', event.detail); // デバッグログ
                        const { nodeData, dropX, dropY } = event.detail;

                        if (nodeData && nodeData.type === 'image') {
                            const coords = editorView.posAtCoords({
                                left: dropX,
                                top: dropY
                            });

                            if (coords && typeof nodeData.pos === 'number') {
                                // ドラッグ終了状態に更新
                                editorView.dispatch(editorView.state.tr.setMeta('imageDrag', { isDragging: false, draggedNodePos: null }));
                                this.storage.moveImageNode(editorView, nodeData, coords.pos);
                            }
                        }
                    };

                    // タッチドラッグ開始イベント
                    const handleTouchDragStart = (event: CustomEvent) => {
                        console.log('Touch drag start event received:', event.detail); // デバッグログ
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
                        let insertionIndex = 0;

                        // ドキュメントの最初にドロップゾーン（他のコンテンツより前）
                        decorations.push(
                            Decoration.widget(0, () => {
                                const dropZone = document.createElement('div');
                                dropZone.className = 'drop-zone-indicator drop-zone-top';
                                dropZone.setAttribute('data-drop-pos', '0');
                                dropZone.innerHTML = `
                                    <div class="drop-zone-content">
                                        <span class="drop-zone-arrow">↑</span>
                                        <span class="drop-zone-text">最初に挿入</span>
                                        <span class="drop-zone-arrow">↑</span>
                                    </div>
                                `;
                                return dropZone;
                            }, { side: -1 })
                        );

                        // 各ノードの後にドロップゾーンを追加
                        doc.descendants((node, pos) => {
                            if (node.type.name === 'paragraph' || node.type.name === 'image') {
                                insertionIndex++;
                                const afterPos = pos + node.nodeSize;

                                // ドラッグ中のノードの後ろには挿入ポイントを表示しない
                                if (imageDragState.draggedNodePos !== pos) {
                                    decorations.push(
                                        Decoration.widget(afterPos, () => {
                                            const dropZone = document.createElement('div');
                                            dropZone.className = 'drop-zone-indicator drop-zone-between';
                                            dropZone.setAttribute('data-drop-pos', afterPos.toString());

                                            // ノードの種類に応じてコンテキストを表示
                                            const nodeContent = node.type.name === 'paragraph'
                                                ? (node.textContent.slice(0, 20) + (node.textContent.length > 20 ? '...' : ''))
                                                : '画像';

                                            dropZone.innerHTML = `
                                                <div class="drop-zone-content">
                                                    <span class="drop-zone-arrow">↓</span>
                                                    <span class="drop-zone-text">${nodeContent}の後に挿入</span>
                                                    <span class="drop-zone-arrow">↓</span>
                                                </div>
                                            `;
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

                // 同じ位置にドロップした場合は何もしない
                if (Math.abs(dropPos - originalPos) <= 1) {
                    return true;
                }

                // 新しい画像ノードを作成
                const imageNode = schema.nodes.image.create(nodeData.attrs);

                // 位置関係に応じて削除と挿入の順序を調整
                if (dropPos < originalPos) {
                    // ドロップ位置が元の位置より前の場合
                    transaction = transaction.insert(dropPos, imageNode);
                    // 元のノードを削除（位置が1つずれるため+1）
                    transaction = transaction.delete(originalPos + 1, originalPos + 2);
                } else {
                    // ドロップ位置が元の位置より後の場合
                    // 先に元のノードを削除
                    transaction = transaction.delete(originalPos, originalPos + 1);
                    // 削除によって位置が調整されるため-1
                    transaction = transaction.insert(dropPos - 1, imageNode);
                }

                view.dispatch(transaction);
                return true;
            }
        };
    }
});


// ドキュメントが空かどうか判定（insertImagesToEditorと共通化）
function isEditorDocEmpty(state: any): boolean {
    return state.doc.childCount === 1 && state.doc.firstChild?.type.name === 'paragraph' && state.doc.firstChild.content.size === 0;
}

/**
 * プレーンテキストをTiptap用のノード構造に変換
 */
export function textToTiptapNodes(text: string): any {
    const lines = text.split('\n');
    const content: any[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const imageUrlMatch = trimmed.match(/^https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|svg)(\?[^\s]*)?$/i);

        if (imageUrlMatch) {
            // 画像ノードを追加
            content.push({
                type: 'image',
                attrs: {
                    src: trimmed,
                    alt: 'Image'
                }
            });
        } else {
            // パラグラフノードを追加（空行でも空のパラグラフとして追加）
            content.push({
                type: 'paragraph',
                content: line.trim() ? [
                    {
                        type: 'text',
                        text: line
                    }
                ] : []
            });
        }
    }

    return {
        type: 'doc',
        content: content.length > 0 ? content : [{ type: 'paragraph' }]
    };
}

/**
 * テキストをエディターに挿入（ノード構造を直接作成）
 */
export function insertTextAsNodes(editor: any, text: string) {
    if (!editor) return;

    const nodeStructure = textToTiptapNodes(text);
    const { state, dispatch } = editor.view;
    const { tr, schema } = state;

    let transaction = tr;
    const docIsEmpty = isEditorDocEmpty(state);

    if (docIsEmpty) {
        // 空のエディタの場合は全体を置き換え
        const nodes = nodeStructure.content.map((nodeData: any) =>
            createNodeFromData(schema, nodeData)
        );

        if (nodes.length > 0) {
            const fragment = schema.nodes.doc.createAndFill({}, nodes);
            if (fragment) {
                transaction = transaction.replaceWith(0, state.doc.content.size, fragment.content);
            }
        }
    } else {
        // 既存コンテンツがある場合は挿入位置に追加
        let insertPos = state.selection.from;

        nodeStructure.content.forEach((nodeData: any) => {
            const node = createNodeFromData(schema, nodeData);
            if (node) {
                transaction = transaction.insert(insertPos, node);
                insertPos += node.nodeSize;
            }
        });
    }

    dispatch(transaction);
}

/**
 * スキーマからノードデータを作成するヘルパー関数
 */
function createNodeFromData(schema: any, nodeData: any): any {
    switch (nodeData.type) {
        case 'image':
            return schema.nodes.image.create(nodeData.attrs);
        case 'paragraph':
            if (nodeData.content && nodeData.content.length > 0) {
                const textNodes = nodeData.content.map((textData: any) =>
                    schema.text(textData.text)
                );
                return schema.nodes.paragraph.create({}, textNodes);
            } else {
                return schema.nodes.paragraph.create();
            }
        default:
            return null;
    }
}

/**
 * Tiptap v2のエディターストアを作成
 */
export function createEditorStore(placeholderText: string) {
    let placeholderExtension = Placeholder.configure({
        placeholder: placeholderText,
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
        includeChildren: true,
    });

    const editorStore = createEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'editor-paragraph',
                    },
                },
            }),
            Link.configure({
                HTMLAttributes: {
                    class: 'preview-link',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                autolink: true,
                linkOnPaste: true,
                validate: (url) => {
                    // 指定された正規表現を使用してURLを検証
                    return /^https?:\/\/[\w!\?\/\+\-_~=;\.,\*&@#$%\(\)'\[\]]+/.test(url);
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
                allowBase64: false,
            }).extend({
                addNodeView() {
                    return SvelteNodeViewRenderer(SvelteImageNode);
                },
            }),
            ContentTrackingExtension,
            ImagePasteExtension,
            ImageDragDropExtension,
            placeholderExtension,
        ],
        // HTMLではなくJSONノード構造で初期化
        content: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph'
                }
            ]
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
            },
            // タッチデバイス対応のイベントハンドリング
            handleClickOn(view, _pos, _node, _nodePos, event, _direct) {
                // クリックターゲットがリンクかどうか判定
                let target = event.target as HTMLElement | null;
                while (target && target !== view.dom) {
                    if (target.tagName === 'A' && target.hasAttribute('href')) {
                        // Ctrl（またはCmd）+クリック時のみ遷移許可
                        if (event.ctrlKey || event.metaKey) {
                            // 通常遷移
                            return false;
                        } else {
                            // デフォルト遷移を抑制
                            event.preventDefault();
                            return true;
                        }
                    }
                    target = target.parentElement;
                }
                return false;
            },
        },
    });

    // プレースホルダー更新機能を簡潔に修正
    const updatePlaceholder = (newPlaceholder: string) => {
        // editorStoreから現在のエディターインスタンスを取得
        let currentEditor: any;
        const unsubscribe = editorStore.subscribe(editor => {
            currentEditor = editor;
        });
        unsubscribe();

        if (currentEditor) {
            // DOM要素に直接プレースホルダーを設定
            const editorElement = currentEditor.view.dom;
            if (editorElement) {
                editorElement.setAttribute('data-placeholder', newPlaceholder);
            }

            // プレースホルダー拡張のオプションも更新
            const placeholderExt = currentEditor.extensionManager.extensions.find(
                (ext: any) => ext.name === 'placeholder'
            );
            if (placeholderExt) {
                placeholderExt.options.placeholder = newPlaceholder;
                // エディターを再描画
                currentEditor.view.dispatch(
                    currentEditor.state.tr.setMeta('forceUpdate', true)
                );
            }
        }
    };

    // ストアにメソッドを追加
    (editorStore as any).updatePlaceholder = updatePlaceholder;

    return editorStore;
}

/**
 * 画像URLリストをエディターに挿入するヘルパー関数
 */
export function insertImagesToEditor(editor: any, urls: string | string[]) {
    if (!editor) return;

    const urlList = Array.isArray(urls) ? urls : urls.split('\n').map(s => s.trim()).filter(Boolean);

    if (urlList.length === 0) return;

    editor.chain().focus().run();

    const { state, dispatch } = editor.view;
    const { tr, schema } = state;
    let transaction = tr;

    let insertPos = state.selection.from;

    // 共通化した空判定関数を利用
    const docIsEmpty = isEditorDocEmpty(state);

    urlList.forEach((url, index) => {
        const trimmedUrl = (typeof url === 'string') ? url.trim() : '';
        if (trimmedUrl) {
            const imageNode = schema.nodes.image.create({
                src: trimmedUrl,
                alt: 'Uploaded image'
            });

            if (index === 0 && docIsEmpty) {
                transaction = transaction.replaceWith(0, state.doc.content.size, imageNode);
                insertPos = imageNode.nodeSize;
            } else {
                transaction = transaction.insert(insertPos, imageNode);
                insertPos += imageNode.nodeSize;
            }
        }
    });

    dispatch(transaction);
}

/**
 * エディターからプレーンテキストと画像URLを抽出して結合
 */
export function extractContentWithImages(editor: any): string {
    if (!editor) return '';

    const doc = editor.state.doc;
    const fragments: string[] = [];

    doc.descendants((node: any) => {
        if (node.type.name === 'paragraph') {
            // パラグラフ内のテキストを取得
            const textContent = node.textContent;
            if (textContent.trim()) {
                fragments.push(textContent);
            }
        } else if (node.type.name === 'image') {
            // 画像ノードからURLを抽出
            const src = node.attrs.src;
            if (src) {
                fragments.push(src);
            }
        }
    });

    return fragments.join('\n');
}

