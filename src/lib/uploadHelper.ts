import { FileUploadManager } from "./fileUploadManager";
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./tags/imetaTag";
import { tick } from "svelte";
import type {
    UploadHelperParams,
    UploadHelperResult,
    PlaceholderEntry,
    FileUploadResponse,
    UploadHelperDependencies,
    FileUploadManagerInterface,
    FileUploadDependencies,
    AuthService,
    CompressionService,
    MimeTypeSupportInterface
} from "./types";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { imageSizeMapStore } from "../stores/tagsStore.svelte";
import type { ImageDimensions } from "./utils/imageUtils";
import { getImageDimensions } from "./utils/appUtils";

// デフォルトの依存関係
const createDefaultDependencies = (): UploadHelperDependencies => ({
    localStorage: window.localStorage,
    crypto: window.crypto.subtle,
    tick,
    FileUploadManager: FileUploadManager as unknown as new (
        deps?: FileUploadDependencies,
        auth?: AuthService,
        compression?: CompressionService,
        mime?: MimeTypeSupportInterface
    ) => FileUploadManagerInterface,
    getImageDimensions,
    extractImageBlurhashMap,
    calculateImageHash,
    getMimeTypeFromUrl,
    createImetaTag: async (params: any) => (await createImetaTag(params)).join(" "),
    imageSizeMapStore,
});

// 純粋関数: ファイル処理とプレースホルダー作成
export async function processFilesForUpload(
    files: File[],
    dependencies: UploadHelperDependencies
): Promise<Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>> {
    const fileProcessingPromises = files.map(async (file, index) => {
        const [oxResult, dimensionsResult] = await Promise.all([
            // ox計算
            (async () => {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const hashBuffer = await dependencies.crypto.digest("SHA-256", arrayBuffer);
                    return Array.from(new Uint8Array(hashBuffer))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                } catch (e) {
                    return undefined;
                }
            })(),
            // サイズ計算
            dependencies.getImageDimensions(file)
        ]);

        return { file, index, ox: oxResult, dimensions: dimensionsResult ?? undefined };
    });

    return await Promise.all(fileProcessingPromises);
}

// 純粋関数: プレースホルダー挿入（責務を明確化）
export function insertPlaceholdersIntoEditor(
    fileArray: File[],
    fileProcessingResults: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>,
    currentEditor: TipTapEditor | null,
    showUploadError: (msg: string, duration?: number) => void,
    dependencies: UploadHelperDependencies,
    devMode: boolean
): PlaceholderEntry[] {
    const placeholderMap: PlaceholderEntry[] = [];

    // FileUploadManagerインスタンス作成時の依存性注入を改善
    const fileUploadManager = new dependencies.FileUploadManager();
    const timestamp = Date.now();

    fileArray.forEach((file, index) => {
        const validation = fileUploadManager.validateImageFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || "postComponent.upload_failed");
            return;
        }

        // プレースホルダーIDを一意にするため、タイムスタンプ＋インデックス＋ランダム値を使用
        const placeholderId = `placeholder-${timestamp}-${index}-${Math.random().toString(36).substr(2, 9)}`;
        const processingResult = fileProcessingResults[index];
        const ox = processingResult?.ox;
        const dimensions = processingResult?.dimensions;

        if (currentEditor) {
            const imageAttrs: any = {
                src: placeholderId,
                isPlaceholder: true
            };

            if (dimensions) {
                imageAttrs.dim = `${dimensions.width}x${dimensions.height}`;
                dependencies.imageSizeMapStore.update(map => ({
                    ...map,
                    [placeholderId]: dimensions
                }));

                if (devMode) {
                    console.log("[uploadHelper] calculated dimensions for placeholder", {
                        placeholderId,
                        dimensions,
                        file: file.name
                    });
                }
            }

            try {
                // 修正: フォーカスを奪わずに画像を挿入
                const { state } = currentEditor;
                const docIsEmpty = state.doc.content.size <= 2; // 空のparagraphは2文字

                if (index === 0) {
                    // 最初の画像：現在の位置またはエディターの末尾に画像を挿入
                    if (docIsEmpty) {
                        // 空のドキュメントの場合、フォーカスを奪わずに画像を設定
                        const tr = state.tr.replaceWith(0, state.doc.content.size, state.schema.nodes.image.create(imageAttrs));
                        currentEditor.view.dispatch(tr);
                    } else {
                        // テキストがある場合、カーソル位置にフォーカスを奪わずに画像を挿入
                        const pos = state.selection.from;
                        const tr = state.tr.insert(pos, state.schema.nodes.image.create(imageAttrs));
                        currentEditor.view.dispatch(tr);
                    }
                } else {
                    // 2番目以降の画像：前の画像の直後に挿入（改行なし）
                    const docSize = currentEditor.state.doc.content.size;
                    // 最後のノードの位置を取得
                    let insertPos = docSize;

                    // 最後のノードがparagraphの場合は、その直後に挿入
                    currentEditor.state.doc.descendants((node, pos) => {
                        if (pos + node.nodeSize === docSize) {
                            insertPos = pos + node.nodeSize;
                        }
                    });

                    // 位置を指定して画像を挿入
                    const tr = currentEditor.state.tr.insert(insertPos, currentEditor.state.schema.nodes.image.create(imageAttrs));
                    currentEditor.view.dispatch(tr);
                }

                if (devMode) {
                    console.log("[uploadHelper] inserted image node", {
                        placeholderId,
                        file: file.name,
                        index,
                        totalFiles: fileArray.length,
                        method: index === 0 ? 'first' : 'subsequent',
                        docSize: currentEditor.state.doc.content.size
                    });
                }
            } catch (error) {
                if (devMode) {
                    console.error("[uploadHelper] failed to insert image node", {
                        placeholderId,
                        file: file.name,
                        error
                    });
                }
                showUploadError("画像の挿入に失敗しました");
                return;
            }
        }

        placeholderMap.push({ file, placeholderId, ox, dimensions });

        if (devMode) {
            console.log("[uploadHelper] insertPlaceholderImage", {
                placeholderId,
                file: file.name,
                ox,
                dimensions
            });
        }
    });

    return placeholderMap;
}

// 純粹関数: Blurhash生成
export async function generateBlurhashesForPlaceholders(
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    dependencies: UploadHelperDependencies,
    devMode: boolean
): Promise<void> {
    const fileUploadManager = new dependencies.FileUploadManager();

    const blurhashPromises = placeholderMap.map(async (item) => {
        try {
            const blurhash = await fileUploadManager.generateBlurhashForFile(item.file);
            if (blurhash) {
                item.blurhash = blurhash;
                if (currentEditor) {
                    const state = currentEditor.state;
                    const doc = state.doc;
                    doc.descendants((node: any, pos: number) => {
                        if (node.type?.name === "image" && node.attrs?.src === item.placeholderId) {
                            const tr = state.tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                blurhash,
                            });
                            currentEditor.view.dispatch(tr);
                            return false;
                        }
                    });
                }
                if (devMode) {
                    console.log("[uploadHelper] updated placeholder with blurhash", {
                        placeholderId: item.placeholderId,
                        blurhash,
                        file: item.file.name
                    });
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

// 純粹関数: メタデータ準備
export function prepareMetadataList(fileArray: File[]): Array<Record<string, string | number | undefined>> {
    return fileArray.map((f) => ({
        caption: f.name,
        expiration: "",
        size: f.size,
        alt: f.name,
        media_type: undefined,
        content_type: f.type || "",
        no_transform: "true"
    }));
}

// 純粋関数: プレースホルダー置換処理
export async function replacePlaceholdersWithResults(
    results: FileUploadResponse[],
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    imageOxMap: Record<string, string>,
    imageXMap: Record<string, string>,
    dependencies: UploadHelperDependencies,
    devMode: boolean
): Promise<{ failedResults: FileUploadResponse[]; errorMessage: string; imageServerBlurhashMap: Record<string, string> }> {
    const failedResults: FileUploadResponse[] = [];
    const imageServerBlurhashMap: Record<string, string> = {};
    let errorMessage = "";

    // プレースホルダーマップのコピーを作成（順序を保持）
    const remainingPlaceholders = [...placeholderMap];

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.success && result.url) {
            // 対応するプレースホルダーを見つける
            let matched: PlaceholderEntry | undefined = undefined;
            let matchedIndex = -1;

            // 1. ファイル名でのマッチングを試行
            if (result.sizeInfo && result.sizeInfo.originalFilename) {
                matchedIndex = remainingPlaceholders.findIndex(
                    (p) => p.file.name === result.sizeInfo!.originalFilename,
                );
                if (matchedIndex !== -1) {
                    matched = remainingPlaceholders[matchedIndex];
                }
            }

            // 2. ファイル名マッチングが失敗した場合、順序でマッチング
            if (!matched && remainingPlaceholders.length > 0) {
                matched = remainingPlaceholders[0];
                matchedIndex = 0;
            }

            // マッチしたプレースホルダーを処理
            if (matched && matchedIndex !== -1 && currentEditor) {
                // リストから削除
                remainingPlaceholders.splice(matchedIndex, 1);

                const state = currentEditor.state;
                const doc = state.doc;
                doc.descendants((node: any, pos: number) => {
                    if (node.type?.name === "image" && node.attrs?.src === matched!.placeholderId) {
                        const newAttrs: any = {
                            ...node.attrs,
                            src: result.url,
                            isPlaceholder: false,
                            blurhash: matched!.blurhash ?? undefined,
                        };

                        if (matched!.dimensions) {
                            newAttrs.dim = `${matched!.dimensions.width}x${matched!.dimensions.height}`;
                            dependencies.imageSizeMapStore.update(map => {
                                const newMap = { ...map };
                                delete newMap[matched!.placeholderId];
                                newMap[result.url!] = matched!.dimensions!;
                                return newMap;
                            });
                        }

                        const tr = state.tr.setNodeMarkup(pos, undefined, newAttrs);
                        currentEditor.view.dispatch(tr);
                        return false;
                    }
                });

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
                            const x = await dependencies.calculateImageHash(result.url);
                            if (x) imageXMap[result.url] = x;
                            if (devMode) {
                                console.log("[uploadHelper] calculated x hash for uploaded image (fallback)", {
                                    url: result.url,
                                    x
                                });
                            }
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

                if (devMode) {
                    console.log("[uploadHelper] replaced placeholder with result", {
                        placeholderId: matched.placeholderId,
                        url: result.url,
                        fileName: matched.file.name
                    });
                }
            }
        } else if (!result.success) {
            failedResults.push(result);
            // 失敗したファイルに対応するプレースホルダーを削除
            const failed = remainingPlaceholders.shift();
            if (failed && currentEditor) {
                dependencies.imageSizeMapStore.update(map => {
                    const newMap = { ...map };
                    delete newMap[failed.placeholderId];
                    return newMap;
                });

                const state = currentEditor.state;
                const doc = state.doc;
                doc.descendants((node: any, pos: number) => {
                    if (node.type?.name === "image" && node.attrs?.src === failed.placeholderId) {
                        const tr = state.tr.delete(pos, pos + node.nodeSize);
                        currentEditor.view.dispatch(tr);
                        return false;
                    }
                });

                if (devMode) {
                    console.log("[uploadHelper] removed failed placeholder", {
                        placeholderId: failed.placeholderId,
                        fileName: failed.file.name,
                        error: result.error
                    });
                }
            }
        }
    }

    // 残ったプレースホルダーがあれば削除（サーバーから想定より少ない結果が返った場合）
    for (const remaining of remainingPlaceholders) {
        if (currentEditor) {
            dependencies.imageSizeMapStore.update(map => {
                const newMap = { ...map };
                delete newMap[remaining.placeholderId];
                return newMap;
            });

            const state = currentEditor.state;
            const doc = state.doc;
            doc.descendants((node: any, pos: number) => {
                if (node.type?.name === "image" && node.attrs?.src === remaining.placeholderId) {
                    const tr = state.tr.delete(pos, pos + node.nodeSize);
                    currentEditor.view.dispatch(tr);
                    return false;
                }
            });

            if (devMode) {
                console.log("[uploadHelper] removed unmatched placeholder", {
                    placeholderId: remaining.placeholderId,
                    fileName: remaining.file.name
                });
            }
        }
    }

    if (failedResults.length) {
        errorMessage = failedResults.length === 1
            ? failedResults[0].error || "postComponent.upload_failed"
            : `${failedResults.length}個のファイルのアップロードに失敗しました`;
    }

    return { failedResults, errorMessage, imageServerBlurhashMap };
}

export async function uploadHelper({
    files,
    currentEditor,
    fileInput,
    uploadCallbacks,
    showUploadError,
    updateUploadState,
    devMode,
    dependencies = createDefaultDependencies(),
}: UploadHelperParams): Promise<UploadHelperResult> {
    const fileArray = Array.from(files);
    const endpoint = dependencies.localStorage.getItem("uploadEndpoint") || "";
    const imageOxMap: Record<string, string> = {};
    const imageXMap: Record<string, string> = {};

    const isPreview = window.location.port === "4173" || window.location.hostname === "localhost";
    const modeLabel = isPreview ? "[preview]" : "[dev]";

    if (devMode) {
        console.log(`${modeLabel} [uploadHelper] Starting upload process:`, {
            fileCount: fileArray.length,
            endpoint,
            hasServiceWorker: !!navigator.serviceWorker?.controller
        });
    }

    // ファイル処理
    const fileProcessingResults = await processFilesForUpload(fileArray, dependencies);

    // プレースホルダー挿入
    let placeholderMap = insertPlaceholdersIntoEditor(
        fileArray,
        fileProcessingResults,
        currentEditor as TipTapEditor | null,
        showUploadError,
        dependencies,
        devMode
    );

    // 有効ファイルがない場合は早期リターン
    if (placeholderMap.length === 0) {
        return {
            placeholderMap: [],
            results: null,
            imageOxMap,
            imageXMap,
            failedResults: [],
            errorMessage: "",
        };
    }

    // アップロード状態を更新
    updateUploadState(true, "");

    // Blurhash生成
    await generateBlurhashesForPlaceholders(
        placeholderMap,
        currentEditor as TipTapEditor | null,
        dependencies,
        devMode
    );

    // アップロード処理（FileUploadManagerに委譲）
    const validFiles = placeholderMap.map(entry => entry.file);
    let results: FileUploadResponse[] | null = null;

    try {
        const metadataList = prepareMetadataList(validFiles);
        // 依存性注入されたFileUploadManagerを使用
        const fileUploadManager = new dependencies.FileUploadManager();

        if (validFiles.length === 1) {
            results = [
                await fileUploadManager.uploadFileWithCallbacks(
                    validFiles[0],
                    endpoint,
                    uploadCallbacks,
                    devMode,
                    metadataList[0],
                ),
            ];
        } else if (validFiles.length > 1) {
            results = await fileUploadManager.uploadMultipleFilesWithCallbacks(
                validFiles,
                endpoint,
                uploadCallbacks,
                metadataList,
            );
        }

        if (devMode) {
            console.log(`${modeLabel} [uploadHelper] Upload results:`, {
                totalResults: results?.length || 0,
                successful: results?.filter(r => r.success).length || 0,
                failed: results?.filter(r => !r.success).length || 0
            });
        }
    } catch (error) {
        if (devMode) {
            console.error(`${modeLabel} [uploadHelper] Upload error:`, error);
        }
        const errorMsg = error instanceof Error ? error.message : String(error);
        showUploadError(errorMsg, 5000);
        results = null;
    } finally {
        updateUploadState(false);
    }

    await dependencies.tick();

    // プレースホルダー置換・失敗時削除
    const failedResults: FileUploadResponse[] = [];
    let errorMessage = "";
    let imageServerBlurhashMap: Record<string, string> = {};

    if (results && placeholderMap.length > 0) {
        const replacementResult = await replacePlaceholdersWithResults(
            results,
            placeholderMap,
            currentEditor as TipTapEditor | null,
            imageOxMap,
            imageXMap,
            dependencies,
            devMode
        );
        failedResults.push(...replacementResult.failedResults);
        errorMessage = replacementResult.errorMessage;
        imageServerBlurhashMap = replacementResult.imageServerBlurhashMap;

        // 置換処理後、placeholderMapをクリア
        placeholderMap = [];
    }

    // dev: imetaタグ出力
    if (devMode && currentEditor) {
        try {
            const rawImageBlurhashMap = dependencies.extractImageBlurhashMap(currentEditor);
            const urls = new Set<string>([...Object.keys(rawImageBlurhashMap), ...Object.keys(imageServerBlurhashMap)]);
            await Promise.all(
                Array.from(urls).map(async (url) => {
                    if (!imageXMap[url]) {
                        const x = await dependencies.calculateImageHash(url);
                        if (x) imageXMap[url] = x;
                        if (devMode) {
                            console.log(`${modeLabel} [dev] x計算Promise.all: url, x`, { url, x });
                        }
                    }
                }),
            );
            const imetaTags = await Promise.all(
                Array.from(urls).map(async (url) => {
                    const blurhash = imageServerBlurhashMap[url] ?? rawImageBlurhashMap[url];
                    const m = dependencies.getMimeTypeFromUrl(url);
                    const ox = imageOxMap[url];
                    const x = imageXMap[url];
                    const tag = await dependencies.createImetaTag({ url, m, blurhash, ox, x });
                    if (devMode) {
                        console.log(`${modeLabel} [dev] imeta生成後: url, tag, usedBlurhashSource`, { url, tag, usedBlurhash: blurhash ? 'server' : (rawImageBlurhashMap[url] ? 'client' : 'none') });
                    }
                    return tag;
                }),
            );
            console.log(`${modeLabel} [dev] 画像アップロード直後imetaタグまとめ`, imetaTags);
        } catch (e) {
            console.warn(`${modeLabel} [dev] imetaタグ生成失敗`, e);
        }
    }

    if (fileInput) fileInput.value = "";

    return {
        placeholderMap,
        results,
        imageOxMap,
        imageXMap,
        failedResults,
        errorMessage,
    };
}
