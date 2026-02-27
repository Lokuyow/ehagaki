import type { Editor as TipTapEditor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import type { PlaceholderEntry, FileUploadResponse, ImageDimensions, MediaGalleryItem } from '../types';
import { findAndExecuteOnNode, removePlaceholderNode } from '../utils/editorUtils';
import { uploadAbortFlagStore } from '../../stores/appStore.svelte';
import { mediaGalleryStore } from '../../stores/mediaGalleryStore.svelte';

// ============================================================
// 共通プライベートヘルパー
// ============================================================

/** アップロード結果に対応するプレースホルダーを検索する */
function findMatchedPlaceholder(
    remainingPlaceholders: PlaceholderEntry[],
    result: FileUploadResponse
): { matched: PlaceholderEntry | undefined; matchedIndex: number } {
    let matched: PlaceholderEntry | undefined;
    let matchedIndex = -1;

    if (result.sizeInfo?.originalFilename) {
        matchedIndex = remainingPlaceholders.findIndex(
            (p) => p.file.name === result.sizeInfo!.originalFilename
        );
        if (matchedIndex !== -1) matched = remainingPlaceholders[matchedIndex];
    }

    if (!matched && remainingPlaceholders.length > 0) {
        matched = remainingPlaceholders[0];
        matchedIndex = 0;
    }

    return { matched, matchedIndex };
}

/** 失敗アップロード結果のエラーメッセージを構築する */
function buildUploadErrorMessage(failedResults: FileUploadResponse[]): string {
    if (failedResults.length === 0) return '';
    return failedResults.length === 1
        ? failedResults[0].error || 'postComponent.upload_failed'
        : `${failedResults.length}個のファイルのアップロードに失敗しました`;
}

/** ギャラリーからプレースホルダーアイテムを削除しサイズマップも更新する */
function removeGalleryPlaceholder(
    id: string,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void }
): void {
    mediaGalleryStore.removeItem(id);
    imageSizeMapStore.update(map => {
        const newMap = { ...map };
        delete newMap[id];
        return newMap;
    });
}

/** NIP-94メタデータから各フィールドを抽出する */
function extractNip94Metadata(nip94: Record<string, any>) {
    return {
        serverBlurhash: nip94['blurhash'] ?? nip94['b'] ?? undefined as string | undefined,
        oxFromServer: nip94['ox'] ?? nip94['o'] ?? undefined as string | undefined,
        xFromServer: nip94['x'] ?? undefined as string | undefined,
        dimFromServer: nip94['dim'] ?? undefined as string | undefined,
    };
}

/**
 * ox/xマップへの記録（エディタ・ギャラリー共通）
 * xハッシュが計算された場合はその値を返す
 */
async function recordOxAndXMaps(
    url: string,
    matched: PlaceholderEntry,
    oxFromServer: string | undefined,
    xFromServer: string | undefined,
    imageOxMap: Record<string, string>,
    imageXMap: Record<string, string>,
    calculateImageHash: (url: string) => Promise<string | null>,
    devMode: boolean
): Promise<string | undefined> {
    if (oxFromServer) {
        imageOxMap[url] = oxFromServer;
    } else if (matched.ox) {
        imageOxMap[url] = matched.ox;
    }

    if (xFromServer) {
        imageXMap[url] = xFromServer;
        return xFromServer;
    }

    try {
        const x = await calculateImageHash(url);
        if (x) imageXMap[url] = x;
        return x ?? undefined;
    } catch (error) {
        if (devMode) {
            console.warn('[placeholderManager] failed to calculate x hash', { url, error });
        }
        return undefined;
    }
}

/** バリデーション済みのプレースホルダーエントリを生成する（挿入先に依存しない共通処理） */
function validateAndBuildPlaceholderEntries(
    fileArray: File[],
    fileProcessingResults: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>,
    showUploadError: (msg: string, duration?: number) => void,
    FileUploadManager: any,
    timestamp: number
): Array<{ file: File; placeholderId: string; ox?: string; dimensions?: ImageDimensions; isVideo: boolean }> {
    const fileUploadManager = new FileUploadManager();
    const entries: Array<{ file: File; placeholderId: string; ox?: string; dimensions?: ImageDimensions; isVideo: boolean }> = [];

    fileArray.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const validation = fileUploadManager.validateMediaFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || 'postComponent.upload_failed');
            return;
        }

        const placeholderId = `placeholder-${timestamp}-${index}-${generatePlaceholderId()}`;
        const processingResult = fileProcessingResults[index];

        entries.push({
            file,
            placeholderId,
            ox: processingResult?.ox,
            dimensions: processingResult?.dimensions,
            isVideo,
        });
    });

    return entries;
}

// 簡易的なUUID生成関数（プレースホルダー用）
function generatePlaceholderId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

// ============================================================
// Blurhash生成（共通）
// ============================================================

/**
 * Blurhashを並列生成する（エディタ・ギャラリー両モード共通）
 */
export async function generateBlurhashes(
    placeholderMap: PlaceholderEntry[],
    FileUploadManager: any,
    devMode: boolean = false
): Promise<void> {
    if (uploadAbortFlagStore.value) {
        if (devMode) console.log('[generateBlurhashes] Aborted before blurhash generation');
        return;
    }

    const fileUploadManager = new FileUploadManager();

    const promises = placeholderMap.map(async (item) => {
        if (uploadAbortFlagStore.value) {
            if (devMode) console.log('[generateBlurhashes] Aborted during blurhash generation');
            return;
        }

        try {
            const blurhash = await fileUploadManager.generateBlurhashForFile(item.file);

            if (uploadAbortFlagStore.value) {
                if (devMode) console.log('[generateBlurhashes] Aborted after blurhash generation');
                return;
            }

            if (blurhash) {
                item.blurhash = blurhash;
            }
        } catch (error) {
            if (devMode) {
                console.warn('[generateBlurhashes] blurhash generation failed', {
                    file: item.file.name,
                    error
                });
            }
        }
    });

    await Promise.all(promises);
}

// ============================================================
// エディタモード関数
// ============================================================

/**
 * プレースホルダーノードをエディターに挿入
 */
export function insertPlaceholdersIntoEditor(
    fileArray: File[],
    fileProcessingResults: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>,
    currentEditor: TipTapEditor | null,
    showUploadError: (msg: string, duration?: number) => void,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    FileUploadManager: any,
    devMode: boolean = false
): PlaceholderEntry[] {
    if (!currentEditor) return [];

    const state = currentEditor.state;
    const selection = state.selection;
    const isImageNodeSelected = selection instanceof NodeSelection && selection.node?.type?.name === 'image';
    const timestamp = Date.now();

    if (devMode) {
        console.log('[dev] insertPlaceholdersIntoEditor:', {
            fileCount: fileArray.length,
            isImageNodeSelected,
            selectionType: selection.constructor.name,
            selectionFrom: selection.from,
            selectionTo: (selection as any).to,
            docSize: state.doc.content.size
        });
    }

    const isOnlyEmptyParagraph = state.doc.childCount === 1 &&
        state.doc.firstChild?.type.name === 'paragraph' &&
        state.doc.firstChild.content.size === 0;

    let tr = state.tr;
    let currentInsertPos = isImageNodeSelected ? (selection as NodeSelection).to : selection.from;

    const validEntries = validateAndBuildPlaceholderEntries(
        fileArray, fileProcessingResults, showUploadError, FileUploadManager, timestamp
    );
    const placeholderMap: PlaceholderEntry[] = [];

    validEntries.forEach((entry, index) => {
        const { file, placeholderId, ox, dimensions, isVideo } = entry;

        try {
            let node;
            if (isVideo) {
                node = state.schema.nodes.video.create({ src: placeholderId, isPlaceholder: true });
            } else {
                const imageAttrs: any = { src: placeholderId, isPlaceholder: true };
                if (dimensions) {
                    imageAttrs.dim = `${dimensions.width}x${dimensions.height}`;
                    imageSizeMapStore.update(map => ({ ...map, [placeholderId]: dimensions }));
                }
                node = state.schema.nodes.image.create(imageAttrs);
            }

            if (isOnlyEmptyParagraph && index === 0) {
                tr = tr.replaceWith(0, state.doc.content.size, node);
                currentInsertPos = node.nodeSize;
            } else {
                tr = tr.insert(currentInsertPos, node);
                currentInsertPos += node.nodeSize;
            }

            placeholderMap.push({ file, placeholderId, ox, dimensions });
        } catch (error) {
            if (devMode) {
                console.error('[uploadHelper] failed to insert media node', {
                    placeholderId, file: file.name, isVideo, error,
                    insertPos: currentInsertPos, docSize: state.doc.content.size
                });
            }
            showUploadError(isVideo ? '動画の挿入に失敗しました' : '画像の挿入に失敗しました');
        }
    });

    if (placeholderMap.length > 0) {
        currentEditor.view.dispatch(tr);
    }

    return placeholderMap;
}

/**
 * プレースホルダーを実際のURLに置換
 */
export async function replacePlaceholdersWithResults(
    results: FileUploadResponse[],
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    imageOxMap: Record<string, string>,
    imageXMap: Record<string, string>,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    _extractImageBlurhashMap: (editor: TipTapEditor) => Record<string, string>,
    _getMimeTypeFromUrl: (url: string) => string,
    calculateImageHash: (url: string) => Promise<string | null>,
    _createImetaTag: (params: any) => Promise<string[]>,
    devMode: boolean = false
): Promise<{ failedResults: FileUploadResponse[]; errorMessage: string; imageServerBlurhashMap: Record<string, string> }> {
    const failedResults: FileUploadResponse[] = [];
    const imageServerBlurhashMap: Record<string, string> = {};
    let errorMessage = '';
    const remainingPlaceholders = [...placeholderMap];

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (devMode) {
            console.log('[uploadHelper] Processing result', i, ':', {
                success: result.success, url: result.url,
                filename: result.filename, sizeInfo: result.sizeInfo, aborted: result.aborted
            });
        }

        if (result.aborted) {
            const aborted = remainingPlaceholders.shift();
            if (aborted) {
                removePlaceholderNode(aborted.placeholderId, aborted.file.type.startsWith('video/'), currentEditor, imageSizeMapStore, devMode);
            }
            continue;
        }

        if (result.success && result.url) {
            const { matched, matchedIndex } = findMatchedPlaceholder(remainingPlaceholders, result);

            if (matched && matchedIndex !== -1 && currentEditor) {
                remainingPlaceholders.splice(matchedIndex, 1);
                const isVideo = matched.file.type.startsWith('video/');

                if (devMode) {
                    console.log('[uploadHelper] Replacing placeholder', {
                        placeholderId: matched.placeholderId, url: result.url, isVideo
                    });
                }

                findAndExecuteOnNode(
                    currentEditor,
                    (node: any) => {
                        const nodeType = node.type?.name;
                        const isSameNode = (isVideo && nodeType === 'video') || (!isVideo && nodeType === 'image');
                        return isSameNode && node.attrs?.src === matched!.placeholderId;
                    },
                    (node: any, pos: number) => {
                        if (isVideo) {
                            const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs, src: result.url, isPlaceholder: false,
                            });
                            currentEditor!.view.dispatch(tr);
                        } else {
                            const newAttrs: any = {
                                ...node.attrs, src: result.url, isPlaceholder: false,
                                blurhash: matched!.blurhash ?? undefined,
                            };
                            if (matched!.dimensions) {
                                newAttrs.dim = `${matched!.dimensions.width}x${matched!.dimensions.height}`;
                            }
                            const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, newAttrs);
                            currentEditor!.view.dispatch(tr);

                            imageSizeMapStore.update(map => {
                                const newMap = { ...map };
                                delete newMap[matched!.placeholderId];
                                if (matched!.dimensions) newMap[result.url!] = matched!.dimensions;
                                return newMap;
                            });
                        }
                    }
                );

                if (!isVideo) {
                    const nip94 = result.nip94 || {};
                    const { serverBlurhash, oxFromServer, xFromServer } = extractNip94Metadata(nip94);
                    if (serverBlurhash) imageServerBlurhashMap[result.url] = serverBlurhash;
                    await recordOxAndXMaps(result.url, matched, oxFromServer, xFromServer, imageOxMap, imageXMap, calculateImageHash, devMode);
                }
            }
        } else if (!result.success) {
            failedResults.push(result);
            const failed = remainingPlaceholders.shift();
            if (failed) {
                removePlaceholderNode(failed.placeholderId, failed.file.type.startsWith('video/'), currentEditor, imageSizeMapStore, devMode);
            }
        }
    }

    for (const remaining of remainingPlaceholders) {
        removePlaceholderNode(remaining.placeholderId, remaining.file.type.startsWith('video/'), currentEditor, imageSizeMapStore, devMode);
    }

    if (failedResults.length) errorMessage = buildUploadErrorMessage(failedResults);
    return { failedResults, errorMessage, imageServerBlurhashMap };
}

// ============================================================
// ギャラリーモード関数
// ============================================================

/**
 * ギャラリーにプレースホルダーアイテムを追加
 */
export function insertPlaceholdersIntoGallery(
    fileArray: File[],
    fileProcessingResults: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>,
    showUploadError: (msg: string, duration?: number) => void,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    FileUploadManager: any,
    devMode: boolean = false
): PlaceholderEntry[] {
    const timestamp = Date.now();
    const validEntries = validateAndBuildPlaceholderEntries(
        fileArray, fileProcessingResults, showUploadError, FileUploadManager, timestamp
    );
    const placeholderMap: PlaceholderEntry[] = [];

    for (const entry of validEntries) {
        const { file, placeholderId, ox, dimensions, isVideo } = entry;

        const item: MediaGalleryItem = {
            id: placeholderId,
            type: isVideo ? 'video' : 'image',
            src: placeholderId,
            isPlaceholder: true,
            dimensions,
            dim: dimensions ? `${dimensions.width}x${dimensions.height}` : undefined,
        };

        mediaGalleryStore.addItem(item);

        if (!isVideo && dimensions) {
            imageSizeMapStore.update(map => ({ ...map, [placeholderId]: dimensions }));
        }

        placeholderMap.push({ file, placeholderId, ox, dimensions });

        if (devMode) {
            console.log('[gallery] inserted placeholder:', placeholderId, isVideo ? 'video' : 'image');
        }
    }

    return placeholderMap;
}

/**
 * ギャラリーのプレースホルダーを実際のURLに置換
 */
export async function replacePlaceholdersInGallery(
    results: FileUploadResponse[],
    placeholderMap: PlaceholderEntry[],
    imageOxMap: Record<string, string>,
    imageXMap: Record<string, string>,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    calculateImageHash: (url: string) => Promise<string | null>,
    getMimeTypeFromUrl: (url: string) => string,
    devMode: boolean = false
): Promise<{ failedResults: FileUploadResponse[]; errorMessage: string }> {
    const failedResults: FileUploadResponse[] = [];
    let errorMessage = '';
    const remainingPlaceholders = [...placeholderMap];

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.aborted) {
            const aborted = remainingPlaceholders.shift();
            if (aborted) removeGalleryPlaceholder(aborted.placeholderId, imageSizeMapStore);
            continue;
        }

        if (result.success && result.url) {
            const { matched, matchedIndex } = findMatchedPlaceholder(remainingPlaceholders, result);

            if (matched && matchedIndex !== -1) {
                remainingPlaceholders.splice(matchedIndex, 1);
                const isVideo = matched.file.type.startsWith('video/');
                const nip94 = result.nip94 || {};

                if (isVideo) {
                    mediaGalleryStore.updateItem(matched.placeholderId, {
                        src: result.url,
                        isPlaceholder: false,
                        mimeType: getMimeTypeFromUrl(result.url),
                    });
                } else {
                    const { serverBlurhash, oxFromServer, xFromServer, dimFromServer } = extractNip94Metadata(nip94);
                    const mimeType = getMimeTypeFromUrl(result.url);

                    mediaGalleryStore.updateItem(matched.placeholderId, {
                        src: result.url,
                        isPlaceholder: false,
                        blurhash: serverBlurhash ?? matched.blurhash,
                        mimeType,
                        ox: oxFromServer ?? matched.ox,
                        dim: dimFromServer ?? (matched.dimensions
                            ? `${matched.dimensions.width}x${matched.dimensions.height}`
                            : undefined),
                    });

                    const x = await recordOxAndXMaps(
                        result.url, matched, oxFromServer, xFromServer,
                        imageOxMap, imageXMap, calculateImageHash, devMode
                    );
                    if (x) mediaGalleryStore.updateItem(result.url, { x });

                    if (matched.dimensions) {
                        imageSizeMapStore.update(map => {
                            const newMap = { ...map };
                            delete newMap[matched!.placeholderId];
                            newMap[result.url!] = matched!.dimensions!;
                            return newMap;
                        });
                    }
                }

                if (devMode) {
                    console.log('[gallery] replaced placeholder:', matched.placeholderId, '->', result.url);
                }
            }
        } else if (!result.success) {
            failedResults.push(result);
            const failed = remainingPlaceholders.shift();
            if (failed) removeGalleryPlaceholder(failed.placeholderId, imageSizeMapStore);
        }
    }

    for (const remaining of remainingPlaceholders) {
        removeGalleryPlaceholder(remaining.placeholderId, imageSizeMapStore);
    }

    if (failedResults.length) errorMessage = buildUploadErrorMessage(failedResults);
    return { failedResults, errorMessage };
}

/**
 * ギャラリーのすべてのプレースホルダーを削除（中止時）
 */
export function removeAllGalleryPlaceholders(
    placeholderMap: PlaceholderEntry[],
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void }
): void {
    for (const entry of placeholderMap) {
        removeGalleryPlaceholder(entry.placeholderId, imageSizeMapStore);
    }
}
