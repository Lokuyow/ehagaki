import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
import { createFileSizeInfo, generateSizeDisplayInfo } from "./utils";
import { showImageSizeInfo } from "./appStores.svelte";
import imageCompression from "browser-image-compression";
import type { SharedImageData } from "./shareHandler";
import type {
  FileUploadResponse,
  MultipleUploadProgress,
  UploadInfoCallbacks,
  FileValidationResult
} from "./types";
import {
  DEFAULT_API_URL,
  MAX_FILE_SIZE,
  COMPRESSION_OPTIONS_MAP
} from "./constants";
import { getToken } from "nostr-tools/nip98";
import { debugLogUploadResponse } from "./debug";
import { generateBlurhashForFile, createPlaceholderUrl } from "./tags/imetaTag";
import { showCompressedImagePreview } from "./debug";
import { calculateImageDisplaySize, type ImageDimensions } from "./imageUtils";

// --- 画像のSHA-256ハッシュ計算 ---
async function calculateSHA256Hex(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- 画像サイズ取得関数を追加 ---
export async function getImageDimensions(file: File): Promise<ImageDimensions | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const dimensions = calculateImageDisplaySize(img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(url);
      resolve(dimensions);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

// ファイルアップロード専用マネージャークラス
// 責務: ファイルの圧縮・アップロード処理、進捗管理
export class FileUploadManager {
  // --- 圧縮オプション取得 ---
  private static getCompressionOptions(): any {
    const level = (localStorage.getItem("imageCompressionLevel") || "medium") as keyof typeof COMPRESSION_OPTIONS_MAP;
    const opt = COMPRESSION_OPTIONS_MAP[level];
    if (typeof opt === "object" && "skip" in opt && (opt as any).skip) return null;
    return { ...opt, preserveExif: false };
  }

  // --- WebP品質サポート検出 ---
  private static _webpQualitySupport?: boolean;
  private static async canEncodeWebpWithQuality(): Promise<boolean> {
    if (this._webpQualitySupport !== undefined) return this._webpQualitySupport;
    try {
      if (typeof document === "undefined") return (this._webpQualitySupport = false);
      const canvas = document.createElement("canvas");
      canvas.width = 2; canvas.height = 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return (this._webpQualitySupport = false);
      ctx.fillStyle = "#f00"; ctx.fillRect(0, 0, 2, 2);
      const qLow = canvas.toDataURL("image/webp", 0.2);
      const qHigh = canvas.toDataURL("image/webp", 0.9);
      const ok = qLow.startsWith("data:image/webp") && qHigh.startsWith("data:image/webp") && qLow.length !== qHigh.length;
      this._webpQualitySupport = ok;
      return ok;
    } catch {
      this._webpQualitySupport = false;
      return false;
    }
  }

  // --- MIMEタイプエンコード可否キャッシュ ---
  private static _mimeSupportCache: Record<string, boolean> = {};
  private static canEncodeMimeType(mime: string): boolean {
    if (!mime) return false;
    if (mime in this._mimeSupportCache) return this._mimeSupportCache[mime];
    try {
      if (typeof document === "undefined") return (this._mimeSupportCache[mime] = false);
      const canvas = document.createElement("canvas");
      canvas.width = 2; canvas.height = 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return (this._mimeSupportCache[mime] = false);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 2, 2);
      const url = canvas.toDataURL(mime);
      const ok = typeof url === "string" && url.startsWith(`data:${mime}`);
      this._mimeSupportCache[mime] = ok;
      return ok;
    } catch {
      this._mimeSupportCache[mime] = false;
      return false;
    }
  }

  // --- MIMEから拡張子決定 ---
  private static renameByMime(filename: string, mime: string): string {
    const map: Record<string, string> = {
      "image/webp": ".webp",
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/avif": ".avif",
      "image/bmp": ".bmp"
    };
    const ext = map[mime];
    if (!ext) return filename;
    const base = filename.replace(/\.[^.]+$/, "");
    return `${base}${ext}`;
  }

  // --- 画像圧縮 ---
  private static async compressImage(file: File): Promise<{ file: File; wasCompressed: boolean; wasSkipped?: boolean }> {
    if (!file.type.startsWith("image/")) return { file, wasCompressed: false };
    if (file.size <= 20 * 1024) return { file, wasCompressed: false, wasSkipped: true };
    const options = this.getCompressionOptions();
    if (!options) return { file, wasCompressed: false, wasSkipped: true };

    let usedOptions: any = { ...options };
    if (usedOptions.fileType === "image/webp" && !(await this.canEncodeWebpWithQuality())) {
      delete usedOptions.fileType;
    }
    let targetMime: string = usedOptions.fileType || file.type;
    if (usedOptions.fileType && !this.canEncodeMimeType(usedOptions.fileType)) {
      delete usedOptions.fileType;
      targetMime = file.type;
    }
    if (!this.canEncodeMimeType(targetMime)) return { file, wasCompressed: false, wasSkipped: true };

    try {
      const compressed = await imageCompression(file, usedOptions);
      if ((compressed as File).size >= file.size) return { file, wasCompressed: false };
      const outType = (compressed as File).type || targetMime || file.type;
      const outName = this.renameByMime(file.name, outType);
      const outFile = new File([compressed], outName, { type: outType });

      // 圧縮画像プレビュー表示（debug.tsに移動）
      showCompressedImagePreview(outFile);
      return { file: outFile, wasCompressed: true };
    } catch {
      return { file, wasCompressed: false, wasSkipped: true };
    }
  }

  // --- 画像バリデーション ---
  public static validateImageFile(file: File): FileValidationResult {
    if (!file.type.startsWith("image/")) return { isValid: false, errorMessage: "only_images_allowed" };
    if (file.size > MAX_FILE_SIZE) return { isValid: false, errorMessage: "file_too_large" };
    return { isValid: true };
  }

  // --- blurhash生成 ---
  public static async generateBlurhashForFile(file: File): Promise<string | null> {
    return await generateBlurhashForFile(file);
  }

  // --- 画像からプレースホルダーURL生成 ---
  public static async createPlaceholderUrl(file: File): Promise<string | null> {
    return await createPlaceholderUrl(file);
  }

  // --- アップロードエンドポイント取得 ---
  private static getUploadEndpoint(apiUrl: string): string {
    const stored = localStorage.getItem("uploadEndpoint");
    const pick = (v?: string | null) => (v && v.trim().length > 0 ? v : undefined);
    return pick(stored) ?? pick(apiUrl) ?? DEFAULT_API_URL;
  }

  // --- nip98認証ヘッダー生成 ---
  private static async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
    const storedKey = keyManager.getFromStore() || keyManager.loadFromStorage();
    let signFunc: (event: any) => Promise<any>;
    if (storedKey) {
      signFunc = (event) => seckeySigner(storedKey).signEvent(event);
    } else {
      const nostr = (window as any)?.nostr;
      if (nostr?.signEvent) {
        signFunc = (event) => nostr.signEvent(event);
      } else {
        throw new Error('Authentication required');
      }
    }
    return await getToken(url, method, signFunc, true);
  }

  // --- アップロード完了ポーリング ---
  private static async pollUploadStatus(
    processingUrl: string,
    authHeader: string,
    maxWaitTime: number = 8000
  ): Promise<any> {
    const startTime = Date.now();
    while (true) {
      if (Date.now() - startTime > maxWaitTime) throw new Error("Timeout while polling processing_url");
      const response = await fetch(processingUrl, {
        method: "GET",
        headers: { Authorization: authHeader }
      });
      if (!response.ok) throw new Error(`Unexpected status code ${response.status} while polling processing_url`);

      // 応答ボディをパースしてステータスを確認（processing / success / error 等）
      let processingStatus: any = null;
      try {
        processingStatus = await response.json();
      } catch {
        processingStatus = null;
      }

      // 201 は多くの実装で「created / processing complete を示す」場合があるためそのまま返す
      if (response.status === 201 && processingStatus) return processingStatus;

      // processing中なら待機してリトライ
      if (processingStatus?.status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      // 処理成功ならその結果を返す（nip94_event 等を含む想定）
      if (processingStatus?.status === "success") {
        return processingStatus;
      }

      // エラーなら例外
      if (processingStatus?.status === "error") {
        throw new Error(processingStatus?.message || "File processing failed");
      }

      // フォールバック: サーバーが 200 で最終結果を返している場合はそのボディを返す
      if (response.status === 200) {
        return processingStatus;
      }

      throw new Error("Unexpected processing status");
    }
  }

  // --- ファイルアップロード ---
  public static async uploadFile(
    file: File,
    apiUrl: string = DEFAULT_API_URL
  ): Promise<FileUploadResponse> {
    try {
      if (!file) return { success: false, error: "No file selected" };
      // --- ox計算（圧縮・変換前） ---
      let ox: string | undefined = undefined;
      try {
        ox = await calculateSHA256Hex(file);
      } catch (e) {
        ox = undefined;
      }
      const originalSize = file.size;
      const { file: uploadFile, wasCompressed, wasSkipped } = await this.compressImage(file);
      const compressedSize = uploadFile.size;
      const options = this.getCompressionOptions();
      const hasCompressionSettings = options !== null;
      const sizeInfo = createFileSizeInfo(
        originalSize,
        compressedSize,
        hasCompressionSettings || wasCompressed,
        file.name,
        uploadFile.name,
        wasSkipped
      );
      const finalUrl = this.getUploadEndpoint(apiUrl);
      const authHeader = await this.buildAuthHeader(finalUrl, "POST");
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('uploadtype', 'media');
      // --- oxをformDataに追加（APIが対応していれば） ---
      if (ox) formData.append('ox', ox);
      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
      });
      await debugLogUploadResponse(response);

      let data: any;
      try {
        data = await response.json();
      } catch {
        return { success: false, error: 'Could not parse upload response', sizeInfo };
      }

      if ((response.status === 200 || response.status === 202) && data.processing_url) {
        try {
          const processingAuthToken = await this.buildAuthHeader(data.processing_url, "GET");
          data = await this.pollUploadStatus(data.processing_url, processingAuthToken, 8000);
        } catch (e) {
          return { success: false, error: e instanceof Error ? e.message : String(e), sizeInfo };
        }
      }

      // --- nip94_event.tags を優先してパースして返す ---
      const parsedNip94: Record<string, string> = {};
      if (data?.nip94_event?.tags && Array.isArray(data.nip94_event.tags)) {
        for (const tag of data.nip94_event.tags) {
          if (!Array.isArray(tag) || tag.length < 2) continue;
          const key = String(tag[0]);
          const value = tag.slice(1).join(' ');
          // 同一キーが複数出る場合は先に存在しない場合のみセット（上書きはしない）
          if (!(key in parsedNip94)) parsedNip94[key] = value;
        }
      }

      if (data.status === 'success' && data.nip94_event?.tags) {
        const urlTag = data.nip94_event.tags.find((tag: string[]) => tag[0] === 'url');
        if (urlTag?.[1]) return { success: true, url: urlTag[1], sizeInfo, nip94: parsedNip94 };
      }
      return { success: false, error: data.message || 'Could not extract URL from response', sizeInfo, nip94: Object.keys(parsedNip94).length ? parsedNip94 : null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  // --- 複数ファイルアップロード ---
  public static async uploadMultipleFiles(
    files: File[],
    apiUrl: string = DEFAULT_API_URL,
    onProgress?: (progress: MultipleUploadProgress) => void
  ): Promise<FileUploadResponse[]> {
    if (!files?.length) return [];
    const results: FileUploadResponse[] = new Array(files.length);
    let completed = 0, failed = 0;
    const updateProgress = () => onProgress?.({
      completed, failed, total: files.length, inProgress: completed + failed < files.length
    });
    updateProgress();
    await Promise.all(files.map(async (file, index) => {
      try {
        const result = await this.uploadFile(file, apiUrl);
        results[index] = result;
        result.success ? completed++ : failed++;
        updateProgress();
      } catch (error) {
        results[index] = { success: false, error: error instanceof Error ? error.message : String(error) };
        failed++; updateProgress();
      }
    }));
    return results;
  }

  // --- コールバック付きアップロード ---
  public static async uploadFileWithCallbacks(
    file: File,
    apiUrl: string = DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse> {
    callbacks?.onProgress?.({ completed: 0, failed: 0, total: 1, inProgress: true });
    try {
      const result = await this.uploadFile(file, apiUrl);
      callbacks?.onProgress?.({
        completed: result.success ? 1 : 0,
        failed: result.success ? 0 : 1,
        total: 1,
        inProgress: false
      });
      if (result.success && result.sizeInfo) {
        const displayInfo = generateSizeDisplayInfo(result.sizeInfo);
        if (displayInfo) showImageSizeInfo(displayInfo);
      }
      return result;
    } catch (error) {
      callbacks?.onProgress?.({ completed: 0, failed: 1, total: 1, inProgress: false });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  public static async uploadMultipleFilesWithCallbacks(
    files: File[],
    apiUrl: string = DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse[]> {
    if (!files?.length) return [];
    const results = await this.uploadMultipleFiles(files, apiUrl, callbacks?.onProgress);
    const firstSuccess = results.find(r => r.success && r.sizeInfo);
    if (firstSuccess?.sizeInfo) {
      const displayInfo = generateSizeDisplayInfo(firstSuccess.sizeInfo);
      if (displayInfo) showImageSizeInfo(displayInfo);
    }
    return results;
  }

  // --- ServiceWorker関連 ---
  private static createSWMessagePromise(
    useChannel: boolean
  ): Promise<SharedImageData | null> {
    return new Promise((resolve) => {
      let timeoutId: number;
      const cleanup = () => clearTimeout(timeoutId);

      if (useChannel) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          cleanup();
          if (event.data?.type === 'SHARED_IMAGE' && event.data?.data?.image) {
            resolve({ image: event.data.data.image, metadata: event.data.data.metadata || {} });
          } else {
            resolve(null);
          }
        };
        timeoutId = window.setTimeout(() => resolve(null), 3000);
        navigator.serviceWorker.controller?.postMessage(
          { action: 'getSharedImage' },
          [messageChannel.port2]
        );
      } else {
        const handler = (event: MessageEvent) => {
          cleanup();
          navigator.serviceWorker.removeEventListener('message', handler);
          if (event.data?.type === 'SHARED_IMAGE' && event.data?.data?.image) {
            resolve({ image: event.data.data.image, metadata: event.data.data.metadata || {} });
          } else {
            resolve(null);
          }
        };
        navigator.serviceWorker.addEventListener('message', handler);
        timeoutId = window.setTimeout(() => {
          navigator.serviceWorker.removeEventListener('message', handler);
          resolve(null);
        }, 3000);
        navigator.serviceWorker.controller?.postMessage({ action: 'getSharedImage' });
      }
    });
  }

  public static async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (localStorage.getItem("sharedImageProcessed") === "1") return null;
    if (!navigator.serviceWorker.controller) return null;
    try {
      const timeoutPromise = new Promise<null>(resolve => setTimeout(() => resolve(null), 5000));
      return await Promise.race([
        this.createSWMessagePromise(true),
        this.createSWMessagePromise(false),
        timeoutPromise
      ]);
    } catch {
      return null;
    }
  }

  public static checkIfOpenedFromShare(): boolean {
    return new URLSearchParams(window.location.search).get('shared') === 'true';
  }

  public static async processSharedImage(): Promise<FileUploadResponse | null> {
    const sharedData = await this.getSharedImageFromServiceWorker();
    if (!sharedData?.image) return null;
    return await this.uploadFile(sharedData.image);
  }
}

// getSharedImageFromServiceWorker: 別名エクスポート用（クラスのstaticメソッドを直接呼び出す）
export async function getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
  return await FileUploadManager.getSharedImageFromServiceWorker();
}

