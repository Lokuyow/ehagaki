import { FileUploadManager, getImageDimensions } from "./fileUploadManager";
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./tags/imetaTag";
import { tick } from "svelte";
import type { UploadHelperParams, UploadHelperResult, PlaceholderEntry, FileUploadResponse } from "./types";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { imageSizeMapStore } from "./tags/tagsStore.svelte";
import type { ImageDimensions } from "./utils/imageUtils";

export async function uploadHelper({
    files,
    currentEditor,
    fileInput,
    uploadCallbacks,
    showUploadError,
    updateUploadState,
    devMode,
}: UploadHelperParams): Promise<UploadHelperResult> {
    const fileArray = Array.from(files);
    const endpoint = localStorage.getItem("uploadEndpoint") || "";
    const placeholderMap: PlaceholderEntry[] = [];
    const imageOxMap: Record<string, string> = {};
    const imageXMap: Record<string, string> = {};

    // サーバーが返した nip94 タグ内の blurhash を保持するマップ
    const imageServerBlurhashMap: Record<string, string> = {};

    // ox計算とサイズ計算を並列実行
    const fileProcessingPromises = fileArray.map(async (file, index) => {
        let ox: string | undefined = undefined;
        let dimensions: ImageDimensions | null = null;

        // 並列でox計算とサイズ計算を実行
        const [oxResult, dimensionsResult] = await Promise.all([
            // ox計算
            (async () => {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
                    return Array.from(new Uint8Array(hashBuffer))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                } catch (e) {
                    return undefined;
                }
            })(),
            // サイズ計算
            getImageDimensions(file)
        ]);

        return { file, index, ox: oxResult, dimensions: dimensionsResult };
    });
    const fileProcessingResults = await Promise.all(fileProcessingPromises);

    // プレースホルダー挿入（サイズ情報付き）
    fileArray.forEach((file, index) => {
        const validation = new FileUploadManager().validateImageFile(file);
        if (!validation.isValid) {
            showUploadError(validation.errorMessage || "postComponent.upload_failed");
            return;
        }

        const placeholderId = `placeholder-${Date.now()}-${index}`;
        const processingResult = fileProcessingResults[index];
        const ox = processingResult?.ox;
        const dimensions = processingResult?.dimensions;

        if (currentEditor) {
            // プレースホルダー挿入時にサイズ情報も含める
            const imageAttrs: any = {
                src: placeholderId,
                isPlaceholder: true
            };

            // サイズ情報があればdim属性として追加
            if (dimensions) {
                imageAttrs.dim = `${dimensions.width}x${dimensions.height}`;

                // サイズマップストアに保存
                imageSizeMapStore.update(map => ({
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

            (currentEditor as TipTapEditor).chain?.().focus?.().setImage?.(imageAttrs)?.run?.();
        }

        placeholderMap.push({ file, placeholderId, ox, dimensions: dimensions ?? undefined });

        if (devMode) {
            console.log("[uploadHelper] insertPlaceholderImage", {
                placeholderId,
                file: file.name,
                ox,
                dimensions
            });
        }
    });

    // blurhash生成
    const blurhashPromises = placeholderMap.map(async (item) => {
        try {
            const blurhash = await new FileUploadManager().generateBlurhashForFile(item.file);
            if (blurhash) {
                item.blurhash = blurhash;
                if (currentEditor) {
                    // プレースホルダー更新
                    const state = (currentEditor as TipTapEditor).state;
                    const doc = state.doc;
                    doc.descendants((node: any, pos: number) => {
                        if (node.type?.name === "image" && node.attrs?.src === item.placeholderId) {
                            const tr = state.tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                blurhash,
                            });
                            (currentEditor as TipTapEditor).view.dispatch(tr);
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
    // 並列処理開始（待機は任意だがここでは開始のみ）
    void Promise.all(blurhashPromises);

    // アップロード
    let results: FileUploadResponse[] | null = null;
    try {
        updateUploadState(true, "");
        // prepare metadata per-file according to NIP-96
        const metadataList = fileArray.map((f) => {
            return {
                caption: f.name,               // 緩い説明
                expiration: "",               // 空文字 = 永続希望
                size: f.size,                 // バイトサイズ
                alt: f.name,                  // アクセシビリティ用の説明（簡易）
                media_type: undefined,        // 必要なら識別してセット可能（avatar/banner）
                content_type: f.type || "",   // mime type のヒント
                no_transform: "true"          // 変換を避けたい場合
            } as Record<string, string | number | undefined>;
        });

        if (fileArray.length === 1) {
            const fileUploadManager = new FileUploadManager();
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
            const fileUploadManager = new FileUploadManager();
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

    await tick();

    // プレースホルダー置換・失敗時削除
    const failedResults: FileUploadResponse[] = [];
    let errorMessage = "";
    if (results && placeholderMap.length > 0) {
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
                    // 置換時にサイズ情報も移行
                    const state = (currentEditor as TipTapEditor).state;
                    const doc = state.doc;
                    doc.descendants((node: any, pos: number) => {
                        if (node.type?.name === "image" && node.attrs?.src === matched!.placeholderId) {
                            const newAttrs: any = {
                                ...node.attrs,
                                src: result.url,
                                isPlaceholder: false,
                                blurhash: matched!.blurhash ?? undefined,
                            };

                            // サイズ情報があれば保持
                            if (matched!.dimensions) {
                                newAttrs.dim = `${matched!.dimensions.width}x${matched!.dimensions.height}`;

                                // サイズマップストアを更新（古いキーを削除して新しいキーを追加）
                                imageSizeMapStore.update(map => {
                                    const newMap = { ...map };
                                    delete newMap[matched!.placeholderId];
                                    newMap[result.url!] = matched!.dimensions!;
                                    return newMap;
                                });
                            }

                            const tr = state.tr.setNodeMarkup(pos, undefined, newAttrs);
                            (currentEditor as TipTapEditor).view.dispatch(tr);
                            return false;
                        }
                    });

                    // --- ここから: サーバー返却の nip94 を優先 ---
                    const nip94 = result.nip94 || {};
                    // サーバーが返した blurhash を優先的に保持（キー名のバリエーションに対応）
                    const serverBlurhash = nip94['blurhash'] ?? nip94['b'] ?? undefined;
                    if (serverBlurhash && result.url) {
                        imageServerBlurhashMap[result.url] = serverBlurhash;
                    }
                    const oxFromServer = nip94['ox'] ?? nip94['o'] ?? undefined;
                    const xFromServer = nip94['x'] ?? undefined;

                    if (oxFromServer && result.url) {
                        imageOxMap[result.url] = oxFromServer;
                    } else if (matched.ox && result.url) {
                        // 旧来のローカル計算値を補完として使う
                        imageOxMap[result.url] = matched.ox;
                    }

                    if (result.url) {
                        if (xFromServer) {
                            imageXMap[result.url] = xFromServer;
                        } else {
                            // サーバーに x がなければフォールバックでクライアント側で計算（ダウンロードしてハッシュ）
                            try {
                                const x = await calculateImageHash(result.url);
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
                    // --- ここまで ---
                }
            } else if (!result.success) {
                failedResults.push(result);
                const failed = placeholderMap.shift();
                if (failed && currentEditor) {
                    // プレースホルダー削除時にサイズマップからも削除
                    imageSizeMapStore.update(map => {
                        const newMap = { ...map };
                        delete newMap[failed.placeholderId];
                        return newMap;
                    });

                    // プレースホルダー削除
                    const state = (currentEditor as TipTapEditor).state;
                    const doc = state.doc;
                    doc.descendants((node: any, pos: number) => {
                        if (node.type?.name === "image" && node.attrs?.src === failed.placeholderId) {
                            const tr = state.tr.delete(pos, pos + node.nodeSize);
                            (currentEditor as TipTapEditor).view.dispatch(tr);
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
            // サーバー提供の blurhash を優先するため、URL の集合を作る
            const urls = new Set<string>([...Object.keys(rawImageBlurhashMap), ...Object.keys(imageServerBlurhashMap)]);
            await Promise.all(
                Array.from(urls).map(async (url) => {
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
                Array.from(urls).map(async (url) => {
                    // サーバーが返した blurhash があればそちらを優先、なければエディタ内の blurhash を使う
                    const blurhash = imageServerBlurhashMap[url] ?? rawImageBlurhashMap[url];
                    const m = getMimeTypeFromUrl(url);
                    const ox = imageOxMap[url];
                    const x = imageXMap[url];
                    const tag = await createImetaTag({ url, m, blurhash, ox, x });
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
