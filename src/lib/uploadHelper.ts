import { tick } from "svelte";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { NodeSelection } from "prosemirror-state";
import { FileUploadManager } from "./fileUploadManager";
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./tags/imetaTag";
import { imageSizeMapStore } from "../stores/tagsStore.svelte";
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
    UploadInfoCallbacks,
    ImageDimensions
} from "./types";
import { getImageDimensions, generateSimpleUUID } from "./utils/appUtils";

// PlaceholderManagerクラス: プレースホルダー関連の操作を統合
export class PlaceholderManager {
    private dependencies: UploadHelperDependencies;
    private devMode: boolean;

    constructor(dependencies: UploadHelperDependencies, devMode: boolean) {
        this.dependencies = dependencies;
        this.devMode = devMode;
    }

    // プレースホルダーノードの削除
    removePlaceholderNode(placeholderId: string, isVideo: boolean, currentEditor: TipTapEditor | null): void {
        if (!currentEditor) return;

        updateImageSizeMap(this.dependencies.imageSizeMapStore, placeholderId);

        findAndExecuteOnNode(
            currentEditor,
            (node: any, pos: number) => {
                const nodeType = node.type?.name;
                const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");
                return isSameNode && (node.attrs?.src === placeholderId || node.attrs?.id === placeholderId);
            },
            (node: any, pos: number) => {
                const tr = currentEditor!.state.tr.delete(pos, pos + node.nodeSize);
                currentEditor!.view.dispatch(tr);

                if (this.devMode) {
                    console.log(`[uploadHelper] Deleted placeholder:`, placeholderId);
                }
            }
        );
    }

    // プレースホルダーの挿入
    insertPlaceholdersIntoEditor(
        fileArray: File[],
        fileProcessingResults: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>,
        currentEditor: TipTapEditor | null,
        showUploadError: (msg: string, duration?: number) => void
    ): PlaceholderEntry[] {
        const placeholderMap: PlaceholderEntry[] = [];
        const fileUploadManager = new this.dependencies.FileUploadManager();
        const timestamp = Date.now();

        if (!currentEditor) return placeholderMap;

        const state = currentEditor.state;
        const selection = state.selection;

        const isImageNodeSelected = selection instanceof NodeSelection && selection.node?.type?.name === 'image';

        if (this.devMode) {
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

            const placeholderId = `placeholder-${timestamp}-${index}-${generateSimpleUUID()}`;
            const processingResult = fileProcessingResults[index];
            const ox = processingResult?.ox;
            const dimensions = processingResult?.dimensions;

            try {
                let node;

                if (isVideo) {
                    const videoAttrs: any = {
                        src: placeholderId,
                        id: placeholderId,
                        isPlaceholder: true
                    };
                    node = state.schema.nodes.video.create(videoAttrs);
                } else {
                    const imageAttrs: any = {
                        src: placeholderId,
                        isPlaceholder: true
                    };

                    if (dimensions) {
                        imageAttrs.dim = `${dimensions.width}x${dimensions.height}`;
                        this.dependencies.imageSizeMapStore.update(map => ({
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
                if (this.devMode) {
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

    // Blurhash生成
    async generateBlurhashesForPlaceholders(
        placeholderMap: PlaceholderEntry[],
        currentEditor: TipTapEditor | null
    ): Promise<void> {
        const fileUploadManager = new this.dependencies.FileUploadManager();

        const blurhashPromises = placeholderMap.map(async (item) => {
            try {
                const blurhash = await fileUploadManager.generateBlurhashForFile(item.file);
                if (blurhash) {
                    item.blurhash = blurhash;
                    if (currentEditor) {
                        findAndExecuteOnNode(
                            currentEditor,
                            (node: any, pos: number) => node.type?.name === "image" && node.attrs?.src === item.placeholderId,
                            (node: any, pos: number) => {
                                const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, {
                                    ...node.attrs,
                                    blurhash,
                                });
                                currentEditor!.view.dispatch(tr);
                            }
                        );
                    }
                }
            } catch (error) {
                if (this.devMode) {
                    console.warn("[uploadHelper] blurhash generation failed", {
                        file: item.file.name,
                        error
                    });
                }
            }
        });

        await Promise.all(blurhashPromises);
    }

    // プレースホルダーの置換
    async replacePlaceholdersWithResults(
        results: FileUploadResponse[],
        placeholderMap: PlaceholderEntry[],
        currentEditor: TipTapEditor | null,
        imageOxMap: Record<string, string>,
        imageXMap: Record<string, string>
    ): Promise<{ failedResults: FileUploadResponse[]; errorMessage: string; imageServerBlurhashMap: Record<string, string> }> {
        const failedResults: FileUploadResponse[] = [];
        const imageServerBlurhashMap: Record<string, string> = {};
        let errorMessage = "";

        const remainingPlaceholders = [...placeholderMap];

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            if (this.devMode) {
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
                    this.removePlaceholderNode(aborted.placeholderId, isVideo, currentEditor);
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

                    if (this.devMode) {
                        console.log('[uploadHelper] Matched placeholder:', {
                            placeholderId: matched.placeholderId,
                            fileName: matched.file.name,
                            fileType: matched.file.type,
                            isVideo,
                            resultUrl: result.url
                        });
                    }

                    findAndExecuteOnNode(
                        currentEditor,
                        (node: any, pos: number) => {
                            const nodeType = node.type?.name;
                            const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");

                            if (this.devMode) {
                                console.log('[uploadHelper] Checking node:', {
                                    nodeType,
                                    nodeSrc: node.attrs?.src,
                                    nodeId: node.attrs?.id,
                                    placeholderId: matched!.placeholderId,
                                    isSameNode,
                                    isMatch: node.attrs?.src === matched!.placeholderId || node.attrs?.id === matched!.placeholderId
                                });
                            }

                            return isSameNode && (node.attrs?.src === matched!.placeholderId || node.attrs?.id === matched!.placeholderId);
                        },
                        (node: any, pos: number) => {
                            if (this.devMode) {
                                console.log('[uploadHelper] Replacing placeholder with actual URL:', {
                                    isVideo,
                                    placeholderId: matched!.placeholderId,
                                    newUrl: result.url
                                });
                            }

                            if (isVideo) {
                                const newAttrs = {
                                    ...node.attrs,
                                    src: result.url,
                                    id: result.url,
                                    isPlaceholder: false,
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
                                    updateImageSizeMap(this.dependencies.imageSizeMapStore, matched!.placeholderId, result.url!, matched!.dimensions!);
                                }

                                const tr = currentEditor!.state.tr.setNodeMarkup(pos, undefined, newAttrs);
                                currentEditor!.view.dispatch(tr);
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
                                    const x = await this.dependencies.calculateImageHash(result.url);
                                    if (x) imageXMap[result.url] = x;
                                } catch (error) {
                                    if (this.devMode) {
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
                    this.removePlaceholderNode(failed.placeholderId, isVideo, currentEditor);
                }
            }
        }

        for (const remaining of remainingPlaceholders) {
            const isVideo = remaining.file.type.startsWith('video/');
            this.removePlaceholderNode(remaining.placeholderId, isVideo, currentEditor);
        }

        if (failedResults.length) {
            errorMessage = failedResults.length === 1
                ? failedResults[0].error || "postComponent.upload_failed"
                : `${failedResults.length}個のファイルのアップロードに失敗しました`;
        }

        return { failedResults, errorMessage, imageServerBlurhashMap };
    }
}

// UploadManagerクラス: アップロード処理を統合
export class UploadManager {
    private dependencies: UploadHelperDependencies;
    private devMode: boolean;

    constructor(dependencies: UploadHelperDependencies, devMode: boolean) {
        this.dependencies = dependencies;
        this.devMode = devMode;
    }

    async uploadFiles(
        validFiles: File[],
        endpoint: string,
        uploadCallbacks?: UploadInfoCallbacks,
        metadataList?: Array<Record<string, string | number | undefined>>
    ): Promise<FileUploadResponse[] | null> {
        const fileUploadManager = new this.dependencies.FileUploadManager();

        try {
            if (validFiles.length === 1) {
                return [
                    await fileUploadManager.uploadFileWithCallbacks(
                        validFiles[0],
                        endpoint,
                        uploadCallbacks,
                        this.devMode,
                        metadataList?.[0],
                    ),
                ];
            } else if (validFiles.length > 1) {
                return await fileUploadManager.uploadMultipleFilesWithCallbacks(
                    validFiles,
                    endpoint,
                    uploadCallbacks,
                    metadataList,
                );
            }
        } catch (error) {
            if (this.devMode) {
                const isPreview = window.location.port === "4173" || window.location.hostname === "localhost";
                const modeLabel = isPreview ? "[preview]" : "[dev]";
                console.error(`${modeLabel} [uploadHelper] Upload error:`, error);
            }
            throw error;
        }
        return null;
    }
}

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

// 純粋関数: エディターノードの検索と実行
export function findAndExecuteOnNode(
    editor: TipTapEditor | null,
    predicate: (node: any, pos: number) => boolean,
    action: (node: any, pos: number) => void
): void {
    if (!editor) return;

    const doc = editor.state.doc;
    doc.descendants((node: any, pos: number) => {
        if (predicate(node, pos)) {
            action(node, pos);
            return false; // 最初のマッチで停止
        }
    });
}

// 純粋関数: 画像サイズマップの更新
export function updateImageSizeMap(
    store: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    deleteKey?: string,
    addKey?: string,
    addValue?: any
): void {
    store.update(map => {
        const newMap = { ...map };
        if (deleteKey) delete newMap[deleteKey];
        if (addKey && addValue) newMap[addKey] = addValue;
        return newMap;
    });
}

// 純粋関数: ファイル処理とプレースホルダー作成
/**
 * アップロードするファイルを処理し、ハッシュとサイズ情報を計算する
 * @param files 処理するファイル配列
 * @param dependencies 依存関係
 * @returns 処理結果の配列（ファイル、インデックス、ox、dimensions）
 */
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

// 純粋関数: メタデータ準備
/**
 * アップロード用のメタデータリストを作成する
 * @param fileArray ファイル配列
 * @returns メタデータレコードの配列
 */
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

    // マネージャーの初期化
    const placeholderManager = new PlaceholderManager(dependencies, devMode);
    const uploadManager = new UploadManager(dependencies, devMode);

    // ファイル処理
    const fileProcessingResults = await processFilesForUpload(fileArray, dependencies);

    // プレースホルダー挿入
    let placeholderMap = placeholderManager.insertPlaceholdersIntoEditor(
        fileArray,
        fileProcessingResults,
        currentEditor as TipTapEditor | null,
        showUploadError
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
    await placeholderManager.generateBlurhashesForPlaceholders(
        placeholderMap,
        currentEditor as TipTapEditor | null
    );

    // アップロード処理
    const validFiles = placeholderMap.map(entry => entry.file);
    let results: FileUploadResponse[] | null = null;

    try {
        const metadataList = prepareMetadataList(validFiles);
        results = await uploadManager.uploadFiles(validFiles, endpoint, uploadCallbacks, metadataList);
    } catch (error) {
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
        const replacementResult = await placeholderManager.replacePlaceholdersWithResults(
            results,
            placeholderMap,
            currentEditor as TipTapEditor | null,
            imageOxMap,
            imageXMap
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
