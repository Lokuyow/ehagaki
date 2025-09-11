import { FileUploadManager } from "./fileUploadManager";
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./imeta";
import { tick } from "svelte";

export async function uploadHelper({
    files,
    currentEditor,
    fileInput,
    uploadCallbacks,
    showUploadError,
    updateUploadState,
    devMode,
}: {
    files: File[] | FileList;
    currentEditor: any;
    fileInput: HTMLInputElement | undefined;
    uploadCallbacks: any;
    showUploadError: (msg: string, duration?: number) => void;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    devMode: boolean;
}) {
    const fileArray = Array.from(files);
    const endpoint = localStorage.getItem("uploadEndpoint") || "";
    const placeholderMap: {
        file: File;
        placeholderId: string;
        blurhash?: string;
        ox?: string;
    }[] = [];
    const imageOxMap: Record<string, string> = {};
    const imageXMap: Record<string, string> = {};

    // ox計算
    const oxPromises = fileArray.map(async (file, index) => {
        let ox: string | undefined = undefined;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
            ox = Array.from(new Uint8Array(hashBuffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
        } catch (e) {
            ox = undefined;
        }
        return { file, index, ox };
    });
    const oxResults = await Promise.all(oxPromises);

    // プレースホルダー挿入
    fileArray.forEach((file, index) => {
        const validation = FileUploadManager.validateImageFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || "postComponent.upload_failed");
            return;
        }
        const placeholderId = `placeholder-${Date.now()}-${index}`;
        const ox = oxResults[index]?.ox;
        if (currentEditor) {
            currentEditor.chain().focus().setImage({ src: placeholderId, isPlaceholder: true }).run();
        }
        placeholderMap.push({ file, placeholderId, ox });
        if (devMode) {
            console.log("[uploadHelper] insertPlaceholderImage", { placeholderId, file, ox });
        }
    });

    // blurhash生成
    const blurhashPromises = placeholderMap.map(async (item) => {
        try {
            const blurhash = await FileUploadManager.generateBlurhashForFile(item.file);
            if (blurhash) {
                item.blurhash = blurhash;
                if (currentEditor) {
                    // プレースホルダー更新
                    const { state } = currentEditor;
                    const { doc } = state;
                    doc.descendants((node: any, pos: number) => {
                        if (node.type?.name === "image" && node.attrs?.src === item.placeholderId) {
                            const tr = state.tr.setNodeMarkup(pos, null, {
                                ...node.attrs,
                                blurhash,
                            });
                            currentEditor.view.dispatch(tr);
                            return false;
                        }
                    });
                }
                if (devMode) {
                    console.log("[uploadHelper] updated placeholder with blurhash", { placeholderId: item.placeholderId, blurhash, file: item.file });
                }
            }
        } catch (error) {
            if (devMode) {
                console.warn("[uploadHelper] blurhash generation failed", { file: item.file, error });
            }
        }
    });
    Promise.all(blurhashPromises);

    // アップロード
    let results: any[] | null = null;
    try {
        updateUploadState(true, "");
        if (fileArray.length === 1) {
            results = [
                await FileUploadManager.uploadFileWithCallbacks(
                    fileArray[0],
                    endpoint,
                    uploadCallbacks,
                ),
            ];
        } else {
            results = await FileUploadManager.uploadMultipleFilesWithCallbacks(
                fileArray,
                endpoint,
                uploadCallbacks,
            );
        }
    } catch (error) {
        showUploadError(error instanceof Error ? error.message : String(error), 5000);
        results = null;
    } finally {
        updateUploadState(false);
    }

    await tick();

    // プレースホルダー置換・失敗時削除
    const failedResults = [];
    let errorMessage = "";
    if (results && placeholderMap.length > 0) {
        for (const result of results) {
            if (result.success && result.url) {
                let matched = null;
                if (result.sizeInfo && result.sizeInfo.originalFilename) {
                    matched = placeholderMap.find(
                        (p) => p.file.name === result.sizeInfo.originalFilename,
                    );
                }
                if (!matched) {
                    matched = placeholderMap.shift();
                } else {
                    const idx = placeholderMap.indexOf(matched);
                    if (idx !== -1) placeholderMap.splice(idx, 1);
                }
                if (matched && currentEditor) {
                    // 置換
                    const { state } = currentEditor;
                    const { doc } = state;
                    doc.descendants((node: any, pos: number) => {
                        if (node.type?.name === "image" && node.attrs?.src === matched.placeholderId) {
                            const tr = state.tr.setNodeMarkup(pos, null, {
                                ...node.attrs,
                                src: result.url,
                                isPlaceholder: false,
                                blurhash: matched.blurhash ?? undefined,
                            });
                            currentEditor.view.dispatch(tr);
                            return false;
                        }
                    });
                    if (matched.ox && result.url) {
                        imageOxMap[result.url] = matched.ox;
                    }
                    if (result.url) {
                        try {
                            const x = await calculateImageHash(result.url);
                            if (x) imageXMap[result.url] = x;
                            if (devMode) {
                                console.log("[uploadHelper] calculated x hash for uploaded image", { url: result.url, x });
                            }
                        } catch (error) {
                            if (devMode) {
                                console.warn("[uploadHelper] failed to calculate x hash", { url: result.url, error });
                            }
                        }
                    }
                }
            } else if (!result.success) {
                failedResults.push(result);
                const failed = placeholderMap.shift();
                if (failed && currentEditor) {
                    // プレースホルダー削除
                    const { state } = currentEditor;
                    const { doc } = state;
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
            errorMessage =
                failedResults.length === 1
                    ? failedResults[0].error || "postComponent.upload_failed"
                    : `${failedResults.length}個のファイルのアップロードに失敗しました`;
        }
    }

    // dev: imetaタグ出力
    if (devMode && currentEditor) {
        try {
            const rawImageBlurhashMap = extractImageBlurhashMap(currentEditor);
            await Promise.all(
                Object.keys(rawImageBlurhashMap).map(async (url) => {
                    if (!imageXMap[url]) {
                        const x = await calculateImageHash(url);
                        if (x) imageXMap[url] = x;
                        if (devMode) {
                            console.log("[dev] x計算Promise.all: url, x", { url, x });
                        }
                    }
                }),
            );
            const imetaTags = await Promise.all(
                Object.entries(rawImageBlurhashMap).map(async ([url, blurhash]) => {
                    const m = getMimeTypeFromUrl(url);
                    const ox = imageOxMap[url];
                    const x = imageXMap[url];
                    const tag = await createImetaTag({ url, m, blurhash, ox, x });
                    if (devMode) {
                        console.log("[dev] imeta生成後: url, tag", { url, tag });
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
