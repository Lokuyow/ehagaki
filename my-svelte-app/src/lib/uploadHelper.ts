import { FileUploadManager, getImageDimensions } from "./fileUploadManager";
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./tags/imetaTag";
import { tick } from "svelte";
import type { UploadHelperParams, UploadHelperResult, PlaceholderEntry, FileUploadResponse, UploadHelperDependencies, FileUploadManagerInterface } from "./types";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { imageSizeMapStore } from "./tags/tagsStore.svelte";
import type { ImageDimensions } from "./utils/imageUtils";

// デフォルトの依存関係
const createDefaultDependencies = (): UploadHelperDependencies => ({
    localStorage: window.localStorage,
    crypto: window.crypto.subtle,
    tick,
    FileUploadManager: FileUploadManager as new () => FileUploadManagerInterface,
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

// 純粋関数: プレースホルダー挿入
export function insertPlaceholdersIntoEditor(
    fileArray: File[],
    fileProcessingResults: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>,
    currentEditor: TipTapEditor | null,
    showUploadError: (msg: string, duration?: number) => void,
    dependencies: UploadHelperDependencies,
    devMode: boolean
): PlaceholderEntry[] {
    const placeholderMap: PlaceholderEntry[] = [];
    const fileUploadManager = new dependencies.FileUploadManager();

    fileArray.forEach((file, index) => {
        const validation = fileUploadManager.validateImageFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || "postComponent.upload_failed");
            return;
        }

        const placeholderId = `placeholder-${Date.now()}-${index}`;
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

            currentEditor.chain?.().focus?.().setImage?.(imageAttrs)?.run?.();
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

// 純粋関数: Blurhash生成
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

    for (const result of results) {
        if (result.success && result.url) {
            let matched: PlaceholderEntry | undefined = undefined;
            if (result.sizeInfo && result.sizeInfo.originalFilename) {
                matched = placeholderMap.find(
                    (p) => p.file.name === result.sizeInfo!.originalFilename,
                );
            }
            if (!matched) {
                matched = placeholderMap.shift();
            } else {
                const idx = placeholderMap.indexOf(matched);
                if (idx !== -1) placeholderMap.splice(idx, 1);
            }
            if (matched && currentEditor) {
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
            }
        } else if (!result.success) {
            failedResults.push(result);
            const failed = placeholderMap.shift();
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

    // ファイル処理
    const fileProcessingResults = await processFilesForUpload(fileArray, dependencies);

    // プレースホルダー挿入
    const placeholderMap = insertPlaceholdersIntoEditor(
        fileArray,
        fileProcessingResults,
        currentEditor as TipTapEditor | null,
        showUploadError,
        dependencies,
        devMode
    );

    // Blurhash生成
    await generateBlurhashesForPlaceholders(
        placeholderMap,
        currentEditor as TipTapEditor | null,
        dependencies,
        devMode
    );

    // アップロード
    let results: FileUploadResponse[] | null = null;
    try {
        updateUploadState(true, "");
        const metadataList = prepareMetadataList(fileArray);
        const fileUploadManager = new dependencies.FileUploadManager();

        if (fileArray.length === 1) {
            results = [
                await fileUploadManager.uploadFileWithCallbacks(
                    fileArray[0],
                    endpoint,
                    uploadCallbacks,
                    devMode,
                    metadataList[0],
                ),
            ];
        } else {
            results = await fileUploadManager.uploadMultipleFilesWithCallbacks(
                fileArray,
                endpoint,
                uploadCallbacks,
                metadataList,
            );
        }
    } catch (error) {
        showUploadError(error instanceof Error ? error.message : String(error), 5000);
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
                            console.log("[dev] x計算Promise.all: url, x", { url, x });
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
                        console.log("[dev] imeta生成後: url, tag, usedBlurhashSource", { url, tag, usedBlurhash: blurhash ? 'server' : (rawImageBlurhashMap[url] ? 'client' : 'none') });
                    }
                    return tag;
                }),
            );
            console.log("[dev] 画像アップロード直後imetaタグまとめ", imetaTags);
        } catch (e) {
            console.warn("[dev] imetaタグ生成失敗", e);
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
