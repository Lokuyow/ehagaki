import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { Node as PMNode } from '@tiptap/pm/model';
import {
    validateAndNormalizeImageUrl,
    isWordBoundary,
    cleanUrlEnd,
} from '../utils/editorUrlUtils';
import {
    extractPostContentFromDoc,
    isEditorDocEmpty,
    isParagraphWithOnlyImageUrl,
} from '../utils/editorDocumentUtils';
import { updateHashtagData, getHashtagRangesFromDoc } from '../tags/hashtagManager';
import { CONTENT_TRACKING_CONFIG } from '../constants';
import type { ContentTrackingOptions } from '../types';
import { mediaFreePlacementStore } from '../../stores/uploadStore.svelte';
import { mediaGalleryStore } from '../../stores/mediaGalleryStore.svelte';
import { generateMediaItemId } from '../utils/appUtils';

const CONTENT_TRACKING_META_KEY = 'content-tracking-normalized';

interface TextBlockRange {
    from: number;
    to: number;
    pos: number;
    node: PMNode;
}

/**
 * ハッシュタグのデコレーション（装飾）を生成する関数
 * ProseMirror DecorationSet: ドキュメント内の範囲にスタイル/属性を適用
 */
function createHashtagDecorations(doc: PMNode): DecorationSet {
    const ranges = getHashtagRangesFromDoc(doc);
    const decorations = ranges.map(({ from, to }) =>
        Decoration.inline(from, to, { class: CONTENT_TRACKING_CONFIG.HASHTAG_CLASS })
    );
    return DecorationSet.create(doc, decorations);
}

function createHashtagDecorationsForTextBlock(block: TextBlockRange): Decoration[] {
    return getHashtagRangesFromDoc(block.node).map(({ from, to }) =>
        Decoration.inline(
            block.pos + 1 + from,
            block.pos + 1 + to,
            { class: CONTENT_TRACKING_CONFIG.HASHTAG_CLASS }
        )
    );
}

function clampDocPos(doc: PMNode, pos: number): number {
    return Math.max(0, Math.min(pos, doc.content.size));
}

function getChangedRange(
    oldDoc: PMNode,
    newDoc: PMNode
): { from: number; to: number } | null {
    const diffStart = oldDoc.content.findDiffStart(newDoc.content);
    if (diffStart == null) {
        return null;
    }

    const diffEnd = oldDoc.content.findDiffEnd(newDoc.content);
    if (!diffEnd) {
        return { from: diffStart, to: diffStart };
    }

    return {
        from: diffStart,
        to: Math.max(diffStart, diffEnd.b),
    };
}

function addContainingTextBlock(
    doc: PMNode,
    pos: number,
    blocks: Map<string, TextBlockRange>
): void {
    const $pos = doc.resolve(clampDocPos(doc, pos));

    for (let depth = $pos.depth; depth > 0; depth -= 1) {
        const node = $pos.node(depth);
        if (!node.isTextblock) {
            continue;
        }

        const from = $pos.start(depth);
        const to = $pos.end(depth);
        const key = `${from}:${to}`;

        if (!blocks.has(key)) {
            blocks.set(key, {
                from,
                to,
                pos: from - 1,
                node,
            });
        }

        return;
    }
}

function getChangedTextBlocks(
    doc: PMNode,
    changedFrom: number,
    changedTo: number
): TextBlockRange[] {
    const blocks = new Map<string, TextBlockRange>();
    const from = clampDocPos(doc, Math.min(changedFrom, changedTo));
    const to = clampDocPos(doc, Math.max(changedFrom, changedTo));

    addContainingTextBlock(doc, from, blocks);
    addContainingTextBlock(doc, to, blocks);

    doc.nodesBetween(from, to, (node, pos) => {
        if (!node.isTextblock) {
            return;
        }

        const blockFrom = pos + 1;
        const blockTo = pos + node.nodeSize - 1;
        const key = `${blockFrom}:${blockTo}`;

        if (!blocks.has(key)) {
            blocks.set(key, {
                from: blockFrom,
                to: blockTo,
                pos,
                node,
            });
        }

        return false;
    });

    return Array.from(blocks.values()).sort((left, right) => left.from - right.from);
}

function createBlockUrlRegex(): RegExp {
    return new RegExp(
        CONTENT_TRACKING_CONFIG.URL_REGEX.source,
        CONTENT_TRACKING_CONFIG.URL_REGEX.flags
    );
}

function collectBlockChanges(
    block: TextBlockRange,
    linkMark: NonNullable<import('@tiptap/pm/model').Schema['marks']['link']>,
    imageNodeType: import('@tiptap/pm/model').NodeType | undefined,
    enableAutoLink: boolean,
    enableImageConversion: boolean
): Array<{
    type: 'removeMark' | 'addMark' | 'replaceImage';
    from: number;
    to: number;
    mark?: any;
    imageUrl?: string;
}> {
    const changes: Array<{
        type: 'removeMark' | 'addMark' | 'replaceImage';
        from: number;
        to: number;
        mark?: any;
        imageUrl?: string;
    }> = [];
    let fullText = '';
    let hasExistingLinkMark = false;

    block.node.descendants((node, relativePos) => {
        if (!node.isText || !node.text) {
            return;
        }

        const absoluteFrom = block.pos + 1 + relativePos;
        const absoluteTo = absoluteFrom + node.nodeSize;

        if (enableAutoLink) {
            const linkMarkInNode = node.marks.find((mark) => mark.type === linkMark);
            if (linkMarkInNode) {
                hasExistingLinkMark = true;
                changes.push({
                    type: 'removeMark',
                    from: absoluteFrom,
                    to: absoluteTo,
                });
            }
        }

        fullText += node.text;
    });

    if (!fullText) {
        return changes;
    }

    const mayContainUrl = fullText.includes('http://') || fullText.includes('https://');
    if (!mayContainUrl && !hasExistingLinkMark) {
        return changes;
    }

    const urlRegex = createBlockUrlRegex();
    let urlMatch: RegExpExecArray | null;

    while ((urlMatch = urlRegex.exec(fullText)) !== null) {
        if (typeof urlMatch.index !== 'number') {
            continue;
        }

        const matchStart = urlMatch.index;
        const originalUrl = urlMatch[0];
        const prevChar = matchStart > 0 ? fullText[matchStart - 1] : undefined;

        if (!isWordBoundary(prevChar)) {
            continue;
        }

        const { cleanUrl, actualLength } = cleanUrlEnd(originalUrl);
        const matchEnd = matchStart + actualLength;
        const startDocPos = block.pos + 1 + matchStart;
        const endDocPos = block.pos + 1 + matchEnd;

        if (enableImageConversion) {
            const normalizedImageUrl = validateAndNormalizeImageUrl(cleanUrl);
            if (normalizedImageUrl && imageNodeType) {
                changes.push({
                    type: 'replaceImage',
                    from: startDocPos,
                    to: endDocPos,
                    imageUrl: normalizedImageUrl,
                });
                break;
            }
        }

        if (!enableAutoLink) {
            continue;
        }

        if (cleanUrl.length < 8) {
            continue;
        }

        if (!/^https?:\/\/[a-zA-Z0-9]/.test(cleanUrl)) {
            continue;
        }

        try {
            const urlObj = new URL(cleanUrl);
            const hostname = urlObj.hostname;

            if (!hostname.includes('.')) {
                continue;
            }

            const parts = hostname.split('.');
            const tld = parts[parts.length - 1];

            if (tld && tld.length >= 2) {
                changes.push({
                    type: 'addMark',
                    from: startDocPos,
                    to: endDocPos,
                    mark: linkMark.create({ href: cleanUrl }),
                });
            }
        } catch {
            continue;
        }
    }

    return changes;
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
    enableImageConversion: boolean,
    affectedBlocks: TextBlockRange[]
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

    for (const block of affectedBlocks) {
        changes.push(
            ...collectBlockChanges(
                block,
                linkMark,
                imageNodeType,
                enableAutoLink,
                enableImageConversion
            )
        );
    }

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
            if (!mediaFreePlacementStore.value) {
                // ギャラリーモード: 画像をギャラリーに追加し、URLテキストを削除
                mediaGalleryStore.addItem({
                    id: generateMediaItemId(),
                    type: 'image',
                    src: change.imageUrl,
                    isPlaceholder: false
                });
                tr = tr.delete(change.from, change.to);
            } else {
                tr = processImageUrl(tr, newState, imageNodeType, change.imageUrl, change.from, change.to);
            }
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
                        apply(tr, oldDecoSet, oldState, newState) {
                            // ドキュメント変更時のみ再計算
                            if (!tr.docChanged) {
                                return oldDecoSet.map(tr.mapping, tr.doc);
                            }

                            const changedRange = getChangedRange(oldState.doc, newState.doc);
                            if (!changedRange) {
                                return oldDecoSet.map(tr.mapping, tr.doc);
                            }

                            const affectedBlocks = getChangedTextBlocks(
                                tr.doc,
                                changedRange.from,
                                changedRange.to
                            );
                            let nextDecoSet = oldDecoSet.map(tr.mapping, tr.doc);

                            if (affectedBlocks.length === 0) {
                                return nextDecoSet;
                            }

                            const decorationsToRemove = affectedBlocks.flatMap((block) =>
                                nextDecoSet.find(block.from, block.to)
                            );
                            if (decorationsToRemove.length > 0) {
                                nextDecoSet = nextDecoSet.remove(decorationsToRemove);
                            }

                            const decorationsToAdd = affectedBlocks.flatMap(
                                createHashtagDecorationsForTextBlock
                            );

                            return decorationsToAdd.length > 0
                                ? nextDecoSet.add(tr.doc, decorationsToAdd)
                                : nextDecoSet;
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
                    appendTransaction: (transactions, oldState, newState) => {
                        // ドキュメント変更がある場合のみ処理
                        if (!transactions.some(tr => tr.docChanged)) return null;

                        if (transactions.some((tr) => tr.getMeta(CONTENT_TRACKING_META_KEY))) {
                            return null;
                        }

                        const changedRange = getChangedRange(oldState.doc, newState.doc);
                        if (!changedRange) {
                            return null;
                        }

                        const affectedBlocks = getChangedTextBlocks(
                            newState.doc,
                            changedRange.from,
                            changedRange.to
                        );
                        if (affectedBlocks.length === 0) {
                            return null;
                        }

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
                            enableImageConversionForThisTr && (options.enableImageConversion ?? true),
                            affectedBlocks
                        );

                        // appendTransactionで返すトランザクションは
                        // デフォルトで元のトランザクションと同じ履歴エントリに統合される
                        // 
                        // Tiptap v3 UndoRedo拡張の仕様:
                        // appendTransactionは元のトランザクションに付随する変更として扱われ、
                        // 同じ履歴グループに統合される。これにより、Undo時に一緒に戻る。
                        // 
                        // addToHistory: false を明示的に設定して、
                        // このトランザクションが履歴として独立しないことを確認
                        if (resultTr) {
                            resultTr.setMeta('addToHistory', false);
                            resultTr.setMeta(CONTENT_TRACKING_META_KEY, true);
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
                                    detail: { plainText: extractPostContentFromDoc(tr.doc).content }
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
