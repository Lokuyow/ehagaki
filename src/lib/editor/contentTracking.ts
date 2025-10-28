import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { validateAndNormalizeImageUrl, isWordBoundary, cleanUrlEnd, isEditorDocEmpty, isParagraphWithOnlyImageUrl } from '../utils/editorUtils';
import { updateHashtagData, getHashtagRangesFromDoc } from '../tags/hashtagManager';
import { CONTENT_TRACKING_CONFIG } from '../constants';
import type { ContentTrackingOptions } from '../types';

/**
 * ハッシュタグのデコレーション（装飾）を生成する関数
 * ProseMirror DecorationSet: ドキュメント内の範囲にスタイル/属性を適用
 */
function createHashtagDecorations(doc: import('@tiptap/pm/model').Node): DecorationSet {
    const ranges = getHashtagRangesFromDoc(doc);
    const decorations = ranges.map(({ from, to }) =>
        Decoration.inline(from, to, { class: CONTENT_TRACKING_CONFIG.HASHTAG_CLASS })
    );
    return DecorationSet.create(doc, decorations);
}

/**
 * 画像URL処理: 画像URLを画像ノードに置換
 * 段落が空または画像URLのみの場合は段落全体を置換
 */
function processImageUrl(
    tr: import('@tiptap/pm/state').Transaction,
    state: import('@tiptap/pm/state').EditorState,
    imageNodeType: import('@tiptap/pm/model').NodeType,
    normalizedImageUrl: string,
    start: number,
    end: number
): import('@tiptap/pm/state').Transaction {
    const $start = state.doc.resolve(start);
    const parentNode = $start.parent;
    const isInEmptyParagraph = parentNode.type.name === 'paragraph' &&
        parentNode.textContent.trim().length === 0;
    const isOnlyImageUrlInParagraph = isParagraphWithOnlyImageUrl(parentNode, end - start);
    const isDocEmpty = isEditorDocEmpty(state);

    // UniqueID extensionが自動的にIDを付与するため、明示的なID設定は不要
    const imageNode = imageNodeType.create({
        src: normalizedImageUrl,
        alt: 'Image'
    });

    // 段落が空またはURLのみの場合は段落全体を置換
    if (isInEmptyParagraph || isOnlyImageUrlInParagraph) {
        const paragraphDepth = $start.depth;
        const paragraphStart = $start.start(paragraphDepth);
        const paragraphEnd = $start.end(paragraphDepth);

        // ドキュメント全体が空または1段落のみの場合
        if (isDocEmpty || (state.doc.childCount === 1 && isOnlyImageUrlInParagraph)) {
            return tr.delete(0, state.doc.content.size).insert(0, imageNode);
        }
        return tr.replaceWith(paragraphStart, paragraphEnd, imageNode);
    }

    // インライン置換
    return tr.replaceWith(start, end, imageNode);
}


/**
 * テキスト中のURLと画像URLを検出し、動的にリンク化・画像ノード変換を行う関数
 * 
 * 機能:
 * 1. 既存のリンクマークを削除（動的な再評価を可能にする）
 * 2. URLパターンを検出してリンクマークを追加（Tiptap Link拡張の検証ルールを使用）
 * 3. 画像URLを画像ノードに変換
 * 
 * ProseMirror appendTransaction: ドキュメント変更後に追加のトランザクションを適用
 */
function processUrlsAndImages(
    newState: import('@tiptap/pm/state').EditorState,
    enableAutoLink: boolean,
    enableImageConversion: boolean
): import('@tiptap/pm/state').Transaction | null {
    const linkMark = newState.schema.marks.link;
    const imageNodeType = newState.schema.nodes.image;

    if (!linkMark) return null;

    let tr = newState.tr;
    let hasChanges = false;

    // ProseMirror重要仕様: descendants走査中にドキュメント構造を変更すると
    // 位置がずれるため、まず変更内容を収集してから一括適用する
    const changes: Array<{
        type: 'removeMark' | 'addMark' | 'replaceImage';
        from: number;
        to: number;
        mark?: any;
        imageUrl?: string;
    }> = [];

    // Step 1: 既存のリンクマークを全て削除（動的な再評価のため）
    // リンクマークがあるテキスト範囲を全て収集
    if (enableAutoLink) {
        newState.doc.descendants((node, pos) => {
            if (!node.isText) return;
            
            // このテキストノードにリンクマークがあるかチェック
            const linkMarkInNode = node.marks.find(m => m.type === linkMark);
            if (linkMarkInNode) {
                // リンクマーク付きの範囲を削除対象に追加
                changes.push({
                    type: 'removeMark',
                    from: pos,
                    to: pos + node.nodeSize
                });
            }
        });
    }

    // Step 2: URLパターンを検出してリンクマーク追加または画像変換
    // ProseMirror重要仕様: マークによってテキストノードが分割されるため、
    // 段落/ブロックレベルで処理する必要がある
    newState.doc.descendants((node, pos) => {
        // テキストを含むブロックノード（段落など）のみ処理
        if (!node.isTextblock || node.childCount === 0) return;

        // ブロック内の全テキストを結合
        let fullText = '';
        const textMapping: Array<{ textOffset: number; docPos: number }> = [];
        
        node.forEach((child, offset) => {
            if (child.isText && child.text) {
                textMapping.push({ textOffset: fullText.length, docPos: pos + 1 + offset });
                fullText += child.text;
            }
        });

        if (!fullText) return;

        // URL検出と処理
        let urlMatch: RegExpExecArray | null;
        while ((urlMatch = CONTENT_TRACKING_CONFIG.URL_REGEX.exec(fullText)) !== null) {
            if (typeof urlMatch.index !== 'number') continue;

            const matchStart = urlMatch.index;
            const originalUrl = urlMatch[0];
            const prevChar = matchStart > 0 ? fullText[matchStart - 1] : undefined;

            // 単語境界チェック
            if (!isWordBoundary(prevChar)) continue;

            const { cleanUrl, actualLength } = cleanUrlEnd(originalUrl);
            const matchEnd = matchStart + actualLength;
            
            // テキストオフセットをドキュメント位置に変換
            const startDocPos = pos + 1 + matchStart;
            const endDocPos = pos + 1 + matchEnd;

            // 画像URL処理（有効な場合のみ）
            if (enableImageConversion) {
                const normalizedImageUrl = validateAndNormalizeImageUrl(cleanUrl);
                if (normalizedImageUrl && imageNodeType) {
                    changes.push({
                        type: 'replaceImage',
                        from: startDocPos,
                        to: endDocPos,
                        imageUrl: normalizedImageUrl
                    });
                    break; // 画像ノード挿入後は処理を中断
                }
            }

            // 通常のURL処理（有効な場合のみ）
            // Tiptap v3のLink拡張の検証ルールに従う
            if (enableAutoLink) {
                // 最小長チェック（8文字以上）
                if (cleanUrl.length < 8) continue;

                // 基本的なURL形式チェック
                if (!/^https?:\/\/[a-zA-Z0-9]/.test(cleanUrl)) continue;

                // URLオブジェクトとして検証
                try {
                    const urlObj = new URL(cleanUrl);
                    // ドメイン名が存在し、かつTLD（トップレベルドメイン）を含むことを確認
                    // 例: "example.c" は無効、"example.com" は有効
                    const hostname = urlObj.hostname;
                    if (hostname.length > 0 && hostname.includes('.')) {
                        // ドメイン名の最後の部分（TLD）が2文字以上であることを確認
                        const parts = hostname.split('.');
                        const tld = parts[parts.length - 1];
                        if (tld && tld.length >= 2) {
                            const mark = linkMark.create({ href: cleanUrl });
                            changes.push({
                                type: 'addMark',
                                from: startDocPos,
                                to: endDocPos,
                                mark
                            });
                        }
                    }
                } catch {
                    // URL解析エラーの場合はスキップ
                    continue;
                }
            }
        }
    });

    // 変更を後ろから適用（位置のずれを防ぐ）
    changes.sort((a, b) => b.from - a.from);

    for (const change of changes) {
        if (change.type === 'removeMark') {
            tr = tr.removeMark(change.from, change.to, linkMark);
            hasChanges = true;
        } else if (change.type === 'addMark' && change.mark) {
            tr = tr.addMark(change.from, change.to, change.mark);
            hasChanges = true;
        } else if (change.type === 'replaceImage' && change.imageUrl) {
            tr = processImageUrl(tr, newState, imageNodeType, change.imageUrl, change.from, change.to);
            hasChanges = true;
        }
    }

    // トランザクションに変更があり、かつドキュメントが変更された場合のみ返す
    return (hasChanges && tr.docChanged) ? tr : null;
}

/**
 * ContentTracking Extension
 * 
 * 責務:
 * 1. ハッシュタグの装飾 (HashtagDecorationPlugin)
 * 2. URL/画像URLの動的変換 (LinkAndImageConversionPlugin)
 *    - 既存のリンクマークを削除して動的に再評価（URL判定解除）
 *    - URLをリンクマークに変換（動的なURL判定）
 *    - 画像URLを画像ノードに変換
 * 3. コンテンツ変更の追跡・通知 (ContentUpdatePlugin)
 * 
 * 注意: Tiptap v3のLink拡張機能の検証ルール（isAllowedUri, shouldAutoLink）は
 * 初期入力時のみ適用され、既存テキストの動的な再評価は行いません。
 * そのため、このプラグインで動的な判定・判定解除を実装しています。
 */
export const ContentTrackingExtension = Extension.create<ContentTrackingOptions>({
    name: 'contentTracking',

    addOptions() {
        return {
            debounceDelay: CONTENT_TRACKING_CONFIG.DEBOUNCE_DELAY,
            enableHashtags: CONTENT_TRACKING_CONFIG.ENABLE_HASHTAGS,
            enableAutoLink: CONTENT_TRACKING_CONFIG.ENABLE_AUTO_LINK,
            enableImageConversion: CONTENT_TRACKING_CONFIG.ENABLE_IMAGE_CONVERSION
        };
    },

    addStorage() {
        return {
            updateTimeout: null as ReturnType<typeof setTimeout> | null
        };
    },

    // ProseMirrorプラグインを追加するメソッド
    addProseMirrorPlugins() {
        const storage = this.storage;
        const options = this.options;

        return [
            // Plugin 1: ハッシュタグの装飾
            // ProseMirror Decoration: ドキュメントの見た目を変更（DOMに反映）
            ...(options.enableHashtags ? [
                new Plugin({
                    key: new PluginKey(CONTENT_TRACKING_CONFIG.PLUGIN_KEYS.HASHTAG_DECORATION),
                    state: {
                        init: (_, { doc }) => createHashtagDecorations(doc),
                        apply(tr, oldDecoSet) {
                            // ドキュメント変更時のみ再計算
                            if (tr.docChanged) {
                                return createHashtagDecorations(tr.doc);
                            }
                            // マッピング: 位置の変更を追跡（挿入・削除時にデコレーションの位置を調整）
                            return oldDecoSet.map(tr.mapping, tr.doc);
                        }
                    },
                    props: {
                        decorations(state) {
                            return this.getState(state);
                        }
                    }
                })
            ] : []),

            // Plugin 2: URL/画像URLの動的変換
            // - 既存のリンクマークを削除して動的に再評価（URL判定解除）
            // - URLをリンクマークに変換（動的なURL判定）
            // - 画像URLを画像ノードに変換
            // ProseMirror appendTransaction: 他のトランザクション後に追加処理を実行
            ...(options.enableAutoLink || options.enableImageConversion ? [
                new Plugin({
                    key: new PluginKey(CONTENT_TRACKING_CONFIG.PLUGIN_KEYS.LINK_AND_IMAGE_CONVERSION),
                    appendTransaction: (transactions, _oldState, newState) => {
                        // ドキュメント変更がある場合のみ処理
                        if (!transactions.some(tr => tr.docChanged)) return null;

                        // ペースト操作かどうかをチェック
                        const isPaste = transactions.some(tr => tr.getMeta('paste'));

                        // ペースト直後もURL処理を実行（リンク化を即座に適用）
                        // ただし、画像URLの変換のみ次の入力まで遅延する
                        // これにより、ペースト→Undoでテキストとリンクが一緒に戻る
                        const enableImageConversionForThisTr = !isPaste;

                        // URL/画像URL処理を実行
                        // - 既存のリンクマークを削除して動的に再評価
                        // - URLをリンクマークに変換（Tiptap Link拡張の検証ルールを適用）
                        // - 画像URLを画像ノードに変換（ペースト時はスキップ）
                        const resultTr = processUrlsAndImages(
                            newState,
                            options.enableAutoLink ?? true,
                            enableImageConversionForThisTr && (options.enableImageConversion ?? true)
                        );

                        // appendTransactionで返すトランザクションは
                        // デフォルトで元のトランザクションと同じ履歴エントリに統合される
                        // 
                        // ProseMirror History仕様:
                        // appendTransactionは元のトランザクションに付随する変更として扱われ、
                        // 同じ履歴グループに統合される。これにより、Undo時に一緒に戻る。
                        // 
                        // addToHistory: false を明示的に設定して、
                        // このトランザクションが履歴として独立しないことを確認
                        if (resultTr) {
                            resultTr.setMeta('addToHistory', false);

                            if (import.meta.env.MODE === 'development') {
                                console.log('🔗 Applying URL/image conversion:', {
                                    steps: resultTr.steps.length,
                                    docChanged: resultTr.docChanged,
                                    isPaste,
                                    imageConversionEnabled: enableImageConversionForThisTr
                                });
                            }
                        }

                        return resultTr;
                    }
                })
            ] : []),

            // Plugin 3: コンテンツ更新の追跡・通知
            // Debounce処理: 連続した変更を一定時間後にまとめて処理
            new Plugin({
                key: new PluginKey(CONTENT_TRACKING_CONFIG.PLUGIN_KEYS.CONTENT_UPDATE_TRACKER),
                state: {
                    init: () => null,
                    apply(tr) {
                        if (tr.docChanged) {
                            // 既存のタイムアウトをクリア
                            if (storage.updateTimeout) {
                                clearTimeout(storage.updateTimeout);
                            }

                            // 設定されたディレイ後にハッシュタグデータ更新とイベント発火
                            storage.updateTimeout = setTimeout(() => {
                                updateHashtagData(tr.doc);
                                window.dispatchEvent(new CustomEvent('editor-content-changed', {
                                    detail: { plainText: tr.doc.textContent }
                                }));
                            }, options.debounceDelay ?? CONTENT_TRACKING_CONFIG.DEBOUNCE_DELAY);
                        }
                        return null;
                    }
                }
            })
        ];
    },

    // 拡張破棄時にクリーンアップ処理を行うメソッド
    onDestroy() {
        if (this.storage.updateTimeout) {
            clearTimeout(this.storage.updateTimeout);
        }
    }
});
