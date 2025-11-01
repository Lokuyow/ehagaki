import type { Editor as TipTapEditor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import type { PlaceholderEntry, FileUploadResponse, ImageDimensions } from '../types';
import { findAndExecuteOnNode, removePlaceholderNode } from '../utils/editorUtils';
import { uploadAbortFlagStore } from '../../stores/appStore.svelte';

// 簡易的なUUID生成関数（プレースホルダー用）
function generatePlaceholderId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

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
    const placeholderMap: PlaceholderEntry[] = [];
    const fileUploadManager = new FileUploadManager();
    const timestamp = Date.now();

    if (!currentEditor) return placeholderMap;

    const state = currentEditor.state;
    const selection = state.selection;

    const isImageNodeSelected = selection instanceof NodeSelection && selection.node?.type?.name === 'image';

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

    fileArray.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const validation = fileUploadManager.validateMediaFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || "postComponent.upload_failed");
            return;
        }

        const placeholderId = `placeholder-${timestamp}-${index}-${generatePlaceholderId()}`;
        const processingResult = fileProcessingResults[index];
        const ox = processingResult?.ox;
        const dimensions = processingResult?.dimensions;

        try {
            let node;

            if (isVideo) {
                const videoAttrs: any = {
                    src: placeholderId,
                    isPlaceholder: true
                    // id属性は設定しない - UniqueID extensionが自動生成する
                };
                node = state.schema.nodes.video.create(videoAttrs);
            } else {
                const imageAttrs: any = {
                    src: placeholderId,
                    isPlaceholder: true
                    // id属性は設定しない - UniqueID extensionが自動生成する
                };

                if (dimensions) {
                    imageAttrs.dim = `${dimensions.width}x${dimensions.height}`;
                    imageSizeMapStore.update(map => ({
                        ...map,
                        [placeholderId]: dimensions
                    }));
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
                console.error("[uploadHelper] failed to insert media node", {
                    placeholderId,
                    file: file.name,
                    isVideo,
                    error,
                    insertPos: currentInsertPos,
                    docSize: state.doc.content.size
                });
            }
            showUploadError(isVideo ? "動画の挿入に失敗しました" : "画像の挿入に失敗しました");
        }
    });

    if (placeholderMap.length > 0) {
        currentEditor.view.dispatch(tr);
    }

    return placeholderMap;
}

/**
 * プレースホルダーのBlurhash生成
 */
export async function generateBlurhashesForPlaceholders(
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    FileUploadManager: any,
    devMode: boolean = false
): Promise<void> {
    // 中止フラグをチェック
    if (uploadAbortFlagStore.value) {
        if (devMode) console.log('[generateBlurhashesForPlaceholders] Aborted before blurhash generation');
        return;
    }

    const fileUploadManager = new FileUploadManager();

    const blurhashPromises = placeholderMap.map(async (item) => {
        // 各ファイルごとに中止チェック
        if (uploadAbortFlagStore.value) {
            if (devMode) console.log('[generateBlurhashesForPlaceholders] Aborted during blurhash generation');
            return;
        }

        try {
            const blurhash = await fileUploadManager.generateBlurhashForFile(item.file);

            // Blurhash生成後に中止チェック
            if (uploadAbortFlagStore.value) {
                if (devMode) console.log('[generateBlurhashesForPlaceholders] Aborted after blurhash generation');
                return;
            }

            if (blurhash) {
                item.blurhash = blurhash;
                if (currentEditor) {
                    findAndExecuteOnNode(
                        currentEditor,
                        (node: any, _pos: number) => {
                            const nodeType = node.type?.name;
                            const isVideoNode = item.file.type.startsWith('video/') && nodeType === 'video';
                            const isImageNode = !item.file.type.startsWith('video/') && nodeType === 'image';
                            return (isVideoNode || isImageNode) && (node.attrs?.src === item.placeholderId || node.attrs?.id === item.placeholderId);
                        },
                        (node: any, pos: number) => {
                            const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                blurhash: blurhash,
                            });
                            currentEditor!.view.dispatch(tr);
                        }
                    );
                }
            }
        } catch (error) {
            if (devMode) {
                console.warn("[uploadHelper] blurhash generation failed", {
                    file: item.file.name,
                    error
                });
            }
        }
    });

    await Promise.all(blurhashPromises);
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
    let errorMessage = "";

    const remainingPlaceholders = [...placeholderMap];

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (devMode) {
            console.log('[uploadHelper] Processing result', i, ':', {
                success: result.success,
                url: result.url,
                filename: result.filename,
                sizeInfo: result.sizeInfo,
                aborted: result.aborted
            });
        }

        if (result.aborted) {
            const aborted = remainingPlaceholders.shift();
            if (aborted) {
                const isVideo = aborted.file.type.startsWith('video/');
                removePlaceholderNode(aborted.placeholderId, isVideo, currentEditor, imageSizeMapStore, devMode);
            }
            continue;
        }

        if (result.success && result.url) {
            let matched: PlaceholderEntry | undefined = undefined;
            let matchedIndex = -1;

            if (result.sizeInfo && result.sizeInfo.originalFilename) {
                matchedIndex = remainingPlaceholders.findIndex(
                    (p) => p.file.name === result.sizeInfo!.originalFilename,
                );
                if (matchedIndex !== -1) {
                    matched = remainingPlaceholders[matchedIndex];
                }
            }

            if (!matched && remainingPlaceholders.length > 0) {
                matched = remainingPlaceholders[0];
                matchedIndex = 0;
            }

            if (matched && matchedIndex !== -1 && currentEditor) {
                remainingPlaceholders.splice(matchedIndex, 1);
                const isVideo = matched.file.type.startsWith('video/');

                if (devMode) {
                    console.log('[uploadHelper] Replacing placeholder', {
                        placeholderId: matched.placeholderId,
                        url: result.url,
                        isVideo
                    });
                }

                findAndExecuteOnNode(
                    currentEditor,
                    (node: any, _pos: number) => {
                        const nodeType = node.type?.name;
                        const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");
                        // プレースホルダーはsrc属性で検索（UniqueID extensionがid属性を管理）
                        return isSameNode && node.attrs?.src === matched!.placeholderId;
                    },
                    (node: any, pos: number) => {
                        if (isVideo) {
                            const newAttrs: any = {
                                ...node.attrs,
                                src: result.url,
                                isPlaceholder: false,
                                // id属性は保持（UniqueID extensionが管理）
                            };
                            const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, newAttrs);
                            currentEditor!.view.dispatch(tr);
                        } else {
                            const newAttrs: any = {
                                ...node.attrs,
                                src: result.url,
                                isPlaceholder: false,
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
                                if (matched!.dimensions) {
                                    newMap[result.url!] = matched!.dimensions;
                                }
                                return newMap;
                            });
                        }
                    }
                );

                if (!isVideo) {
                    const nip94 = result.nip94 || {};
                    const serverBlurhash = nip94['blurhash'] ?? nip94['b'] ?? undefined;
                    if (serverBlurhash && result.url) {
                        imageServerBlurhashMap[result.url] = serverBlurhash;
                    }
                    const oxFromServer = nip94['ox'] ?? nip94['o'] ?? undefined;
                    const xFromServer = nip94['x'] ?? undefined;

                    if (oxFromServer && result.url) {
                        imageOxMap[result.url] = oxFromServer;
                    } else if (matched.ox && result.url) {
                        imageOxMap[result.url] = matched.ox;
                    }

                    if (result.url) {
                        if (xFromServer) {
                            imageXMap[result.url] = xFromServer;
                        } else {
                            try {
                                const x = await calculateImageHash(result.url);
                                if (x) imageXMap[result.url] = x;
                            } catch (error) {
                                if (devMode) {
                                    console.warn("[uploadHelper] failed to calculate x hash (fallback)", {
                                        url: result.url,
                                        error
                                    });
                                }
                            }
                        }
                    }
                }
            }
        } else if (!result.success) {
            failedResults.push(result);
            const failed = remainingPlaceholders.shift();
            if (failed) {
                const isVideo = failed.file.type.startsWith('video/');
                removePlaceholderNode(failed.placeholderId, isVideo, currentEditor, imageSizeMapStore, devMode);
            }
        }
    }

    for (const remaining of remainingPlaceholders) {
        const isVideo = remaining.file.type.startsWith('video/');
        removePlaceholderNode(remaining.placeholderId, isVideo, currentEditor, imageSizeMapStore, devMode);
    }

    if (failedResults.length) {
        errorMessage = failedResults.length === 1
            ? failedResults[0].error || "postComponent.upload_failed"
            : `${failedResults.length}個のファイルのアップロードに失敗しました`;
    }

    return { failedResults, errorMessage, imageServerBlurhashMap };
}
