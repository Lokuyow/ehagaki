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
    MimeTypeSupportInterface,
    UploadProgress,
    UploadInfoCallbacks
} from "./types";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { imageSizeMapStore } from "../stores/tagsStore.svelte";
import { getImageDimensions } from "./utils/appUtils";
import { generateSimpleUUID } from "./utils/appUtils";
import { NodeSelection } from "prosemirror-state";
import type { ImageDimensions } from "./types";

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
    createImetaTag: async (params: any) => await createImetaTag(params),
    imageSizeMapStore,
});

// 純粹関数: ファイル処理とプレースホルダー作成
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

// 純粹関数: プレースホルダー挿入（責務を明確化）
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

    if (!currentEditor) return placeholderMap;

    const state = currentEditor.state;
    const selection = state.selection;

    // 画像ノードが選択されているかチェック（instanceofを使用）
    const isImageNodeSelected = selection instanceof NodeSelection &&
        selection.node?.type?.name === 'image';

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

    // ドキュメントが空のパラグラフ1つだけかをチェック
    const isOnlyEmptyParagraph = state.doc.childCount === 1 &&
        state.doc.firstChild?.type.name === 'paragraph' &&
        state.doc.firstChild.content.size === 0;

    // 単一のトランザクションで全ての挿入を行う
    let tr = state.tr;
    let currentInsertPos = isImageNodeSelected ? (selection as NodeSelection).to : selection.from;

    fileArray.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const validation = fileUploadManager.validateMediaFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || "postComponent.upload_failed");
            return;
        }

        // プレースホルダーIDを一意にするため、タイムスタンプ＋インデックス＋ランダム値を使用
        const placeholderId = `placeholder-${timestamp}-${index}-${generateSimpleUUID()}`;
        const processingResult = fileProcessingResults[index];
        const ox = processingResult?.ox;
        const dimensions = processingResult?.dimensions;

        try {
            let node;

            if (isVideo) {
                // 動画ノードの作成
                const videoAttrs: any = {
                    src: placeholderId,
                    id: placeholderId,
                    isPlaceholder: true
                };
                node = state.schema.nodes.video.create(videoAttrs);
            } else {
                // 画像ノードの作成
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
                }
                node = state.schema.nodes.image.create(imageAttrs);
            }

            if (isOnlyEmptyParagraph && index === 0) {
                // 空のパラグラフを最初のメディアで置き換え
                tr = tr.replaceWith(0, state.doc.content.size, node);
                currentInsertPos = node.nodeSize; // 次の挿入位置を更新
            } else {
                tr = tr.insert(currentInsertPos, node);
                currentInsertPos += node.nodeSize; // 次の挿入位置を更新
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

    // 全ての挿入を一度に適用
    if (placeholderMap.length > 0) {
        currentEditor.view.dispatch(tr);
    }

    return placeholderMap;
}

// 純粗関数: Blurhash生成
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

// 純粋関数: メタデータ準備
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

        if (devMode) {
            console.log('[uploadHelper] Processing result', i, ':', {
                success: result.success,
                url: result.url,
                filename: result.filename,
                sizeInfo: result.sizeInfo,
                aborted: result.aborted
            });
        }

        // 中止されたアップロードの場合、プレースホルダーを削除
        if (result.aborted) {
            const aborted = remainingPlaceholders.shift();
            if (aborted && currentEditor) {
                const isVideo = aborted.file.type.startsWith('video/');

                dependencies.imageSizeMapStore.update(map => {
                    delete map[aborted.placeholderId];
                    return map;
                });

                const state = currentEditor.state;
                const doc = state.doc;
                doc.descendants((node: any, pos: number) => {
                    const nodeType = isVideo ? 'video' : 'image';
                    if (node.type.name === nodeType &&
                        (node.attrs.src === aborted.placeholderId || node.attrs.id === aborted.placeholderId)) {
                        const tr = state.tr.delete(pos, pos + node.nodeSize);
                        currentEditor.view.dispatch(tr);
                        if (devMode) {
                            console.log(`[uploadHelper] Deleted aborted ${nodeType} placeholder:`, aborted.placeholderId);
                        }
                        return false;
                    }
                });
            }
            continue;
        }

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

                const isVideo = matched.file.type.startsWith('video/');

                if (devMode) {
                    console.log('[uploadHelper] Matched placeholder:', {
                        placeholderId: matched.placeholderId,
                        fileName: matched.file.name,
                        fileType: matched.file.type,
                        isVideo,
                        resultUrl: result.url
                    });
                }

                const state = currentEditor.state;
                const doc = state.doc;

                doc.descendants((node: any, pos: number) => {
                    const nodeType = node.type?.name;
                    const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");

                    if (devMode) {
                        console.log('[uploadHelper] Checking node:', {
                            nodeType,
                            nodeSrc: node.attrs?.src,
                            nodeId: node.attrs?.id,
                            placeholderId: matched!.placeholderId,
                            isSameNode,
                            isMatch: node.attrs?.src === matched!.placeholderId || node.attrs?.id === matched!.placeholderId
                        });
                    }

                    if (isSameNode && (node.attrs?.src === matched!.placeholderId || node.attrs?.id === matched!.placeholderId)) {
                        if (devMode) {
                            console.log('[uploadHelper] Replacing placeholder with actual URL:', {
                                isVideo,
                                placeholderId: matched!.placeholderId,
                                newUrl: result.url
                            });
                        }

                        if (isVideo) {
                            // 動画ノードの更新
                            const newAttrs = {
                                ...node.attrs,
                                src: result.url,
                                id: result.url,
                                isPlaceholder: false,
                            };
                            const tr = state.tr.setNodeMarkup(pos, undefined, newAttrs);
                            currentEditor.view.dispatch(tr);
                        } else {
                            // 画像ノードの更新
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
                        }
                        return false;
                    }
                });

                // 画像の場合のみハッシュマップを更新
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
                                const x = await dependencies.calculateImageHash(result.url);
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
            // 失敗したファイルに対応するプレースホルダーを削除
            const failed = remainingPlaceholders.shift();
            if (failed && currentEditor) {
                const isVideo = failed.file.type.startsWith('video/');

                dependencies.imageSizeMapStore.update(map => {
                    const newMap = { ...map };
                    delete newMap[failed.placeholderId];
                    return newMap;
                });

                const state = currentEditor.state;
                const doc = state.doc;
                doc.descendants((node: any, pos: number) => {
                    const nodeType = node.type?.name;
                    const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");

                    if (isSameNode && (node.attrs?.src === failed.placeholderId || node.attrs?.id === failed.placeholderId)) {
                        const tr = state.tr.delete(pos, pos + node.nodeSize);
                        currentEditor.view.dispatch(tr);
                        return false;
                    }
                });
            }
        }
    }

    // 残ったプレースホルダーがあれば削除（サーバーから想定より少ない結果が返った場合）
    for (const remaining of remainingPlaceholders) {
        if (currentEditor) {
            const isVideo = remaining.file.type.startsWith('video/');

            dependencies.imageSizeMapStore.update(map => {
                const newMap = { ...map };
                delete newMap[remaining.placeholderId];
                return newMap;
            });

            const state = currentEditor.state;
            const doc = state.doc;
            doc.descendants((node: any, pos: number) => {
                const nodeType = node.type?.name;
                const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");

                if (isSameNode && (node.attrs?.src === remaining.placeholderId || node.attrs?.id === remaining.placeholderId)) {
                    const tr = state.tr.delete(pos, pos + node.nodeSize);
                    currentEditor.view.dispatch(tr);
                    return false;
                }
            });
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
                    return tag.join(" ");
                }),
            );
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

// --- 統合されたアップロード関連関数 ---

export interface CreateUploadCallbacksParams {
    onUploadProgress?: (progress: UploadProgress) => void;
    videoCompressionProgressStore: {
        set: (value: number) => void;
    };
}

export function createUploadCallbacks(params: CreateUploadCallbacksParams): UploadInfoCallbacks | undefined {
    const { onUploadProgress, videoCompressionProgressStore } = params;
    return onUploadProgress
        ? {
            onProgress: onUploadProgress,
            onVideoCompressionProgress: (progress: number) => {
                videoCompressionProgressStore.set(progress);
            },
        }
        : undefined;
}

export interface ShowUploadErrorMessageParams {
    updateUploadState: (isUploading: boolean, message?: string) => void;
}

export function showUploadErrorMessage(
    message: string,
    duration = 3000,
    params: ShowUploadErrorMessageParams
) {
    params.updateUploadState(false, message);
    setTimeout(() => params.updateUploadState(false, ""), duration);
}

export interface PerformFileUploadParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    uploadCallbacks?: UploadInfoCallbacks;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    devMode: boolean;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    dependencies?: UploadHelperDependencies;
    getUploadFailedText: (key: string) => string;
}

export async function performFileUpload(params: PerformFileUploadParams): Promise<void> {
    const {
        files,
        currentEditor,
        fileInput,
        uploadCallbacks,
        updateUploadState,
        devMode,
        imageOxMap,
        imageXMap,
        dependencies = createDefaultDependencies(),
        getUploadFailedText,
    } = params;

    if (!files || files.length === 0) return;

    const result: UploadHelperResult = await uploadHelper({
        files,
        currentEditor,
        fileInput,
        uploadCallbacks,
        showUploadError: (msg: string, duration?: number) =>
            showUploadErrorMessage(msg, duration, { updateUploadState }),
        updateUploadState,
        devMode,
        dependencies,
    });

    Object.assign(imageOxMap, result.imageOxMap);
    Object.assign(imageXMap, result.imageXMap);

    if (result.failedResults?.length) {
        showUploadErrorMessage(
            result.errorMessage ||
            (result.failedResults.length === 1
                ? result.failedResults[0].error || getUploadFailedText("postComponent.upload_failed")
                : `${result.failedResults.length}個のファイルのアップロードに失敗しました`),
            5000,
            { updateUploadState }
        );
    }
    if (fileInput) fileInput.value = "";
}

export interface UploadFilesParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    onUploadProgress?: (progress: UploadProgress) => void;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    videoCompressionProgressStore: {
        set: (value: number) => void;
    };
    getUploadFailedText: (key: string) => string;
    dependencies?: UploadHelperDependencies;
}

export async function uploadFiles(params: UploadFilesParams): Promise<void> {
    const {
        files,
        currentEditor,
        fileInput,
        onUploadProgress,
        updateUploadState,
        imageOxMap,
        imageXMap,
        videoCompressionProgressStore,
        getUploadFailedText,
        dependencies,
    } = params;

    const uploadCallbacks = createUploadCallbacks({
        onUploadProgress,
        videoCompressionProgressStore,
    });

    await performFileUpload({
        files,
        currentEditor,
        fileInput,
        uploadCallbacks,
        updateUploadState,
        devMode: import.meta.env.MODE === "development",
        imageOxMap,
        imageXMap,
        dependencies,
        getUploadFailedText,
    });
}
