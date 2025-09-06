import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
import { createFileSizeInfo, generateSizeDisplayInfo } from "./utils";
import { showImageSizeInfo } from "./stores";
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
import { debugLogUploadResponse } from "./debug"; // 追加

// ファイルアップロード専用マネージャークラス
// 責務: ファイルの圧縮・アップロード処理、進捗管理
export class FileUploadManager {
  private static getCompressionOptions(): any {
    const level = (localStorage.getItem("imageCompressionLevel") || "medium") as keyof typeof COMPRESSION_OPTIONS_MAP;
    const opt = COMPRESSION_OPTIONS_MAP[level];
    if (opt && 'skip' in opt && (opt as { skip: boolean }).skip) return null;
    return { ...opt, preserveExif: false };
  }

  // 追加: WebP の品質指定サポート検出（結果をキャッシュ）
  private static _webpQualitySupport?: boolean;
  private static async canEncodeWebpWithQuality(): Promise<boolean> {
    if (this._webpQualitySupport !== undefined) return this._webpQualitySupport;
    try {
      // DOM が無い（SSR 等）や Canvas 非対応なら不可
      if (typeof document === "undefined") return (this._webpQualitySupport = false);
      const canvas = document.createElement("canvas");
      canvas.width = 2; canvas.height = 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return (this._webpQualitySupport = false);
      // 適当な内容を書いて size 差で quality 反映を推定
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

  // 追加: MIMEタイプが Canvas エンコード可能かの簡易判定（結果をキャッシュ）
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

  // 追加: MIME から拡張子を決めてファイル名を付け直す
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

  private static async compressImage(file: File): Promise<{ file: File; wasCompressed: boolean; wasSkipped?: boolean }> {
    if (!file.type.startsWith("image/")) return { file, wasCompressed: false };
    const options = this.getCompressionOptions();
    if (!options) {
      // 無圧縮設定
      return { file, wasCompressed: false, wasSkipped: true };
    }

    // WebP 品質制御が不可な環境では WebP 変換をやめる（元タイプで圧縮）
    let usedOptions: any = { ...options };
    if (usedOptions.fileType === "image/webp") {
      const webpOk = await this.canEncodeWebpWithQuality();
      if (!webpOk) {
        delete usedOptions.fileType;
      }
    }

    // ターゲット MIME を決定してエンコード可否を確認
    let targetMime: string = usedOptions.fileType || file.type;
    if (usedOptions.fileType && !this.canEncodeMimeType(usedOptions.fileType)) {
      // 指定タイプがエンコード不可なら指定を外す（フォールバックを回避）
      delete usedOptions.fileType;
      targetMime = file.type;
    }
    // 元タイプ自体がエンコード不可な環境（iOS Safari など）。PNG へフォールバックしてサイズ増になるのを避けるためスキップ
    if (!this.canEncodeMimeType(targetMime)) {
      return { file, wasCompressed: false, wasSkipped: true };
    }

    try {
      const compressed = await imageCompression(file, usedOptions);

      // 圧縮後にサイズが縮まらなければ採用しない（サイズ増防止）
      if ((compressed as File).size >= file.size) {
        return { file, wasCompressed: false };
      }

      // 実際の出力 MIME に基づきファイル名を設定
      const outType = (compressed as File).type || targetMime || file.type;
      const outName = this.renameByMime(file.name, outType);
      const outFile = new File([compressed], outName, { type: outType });

      // --- devモード時のみ: 圧縮後画像を新しいウィンドウで表示 ---
      if (import.meta.env.MODE === "development") {
        try {
          const blobUrl = URL.createObjectURL(outFile);
          const win = window.open(blobUrl, "_blank");
          // メモリリーク防止: ウィンドウが閉じられたらURLを解放
          if (win) {
            const revoke = () => {
              URL.revokeObjectURL(blobUrl);
              win.removeEventListener("beforeunload", revoke);
            };
            win.addEventListener("beforeunload", revoke);
          } else {
            // 失敗時も解放
            setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
          }
        } catch (e) {
          // noop
        }
      }
      // --- ここまで ---

      return { file: outFile, wasCompressed: true };
    } catch {
      return { file, wasCompressed: false, wasSkipped: true };
    }
  }

  public static validateImageFile(file: File): FileValidationResult {
    if (!file.type.startsWith("image/")) return { isValid: false, errorMessage: "only_images_allowed" };
    if (file.size > MAX_FILE_SIZE) return { isValid: false, errorMessage: "file_too_large" };
    return { isValid: true };
  }

  private static getUploadEndpoint(apiUrl: string): string {
    const stored = localStorage.getItem("uploadEndpoint");
    // 空文字や未設定ならデフォルトへフォールバック
    const pick = (v?: string | null) => (v && v.trim().length > 0 ? v : undefined);
    return pick(stored) ?? pick(apiUrl) ?? DEFAULT_API_URL;
  }

  // --- 追加: nip98 の getToken を使った Authorization ヘッダー生成 ---
  private static async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
    // 1) ローカル秘密鍵があればそれで署名
    const storedKey = keyManager.loadFromStorage();
    let signFunc: (event: any) => Promise<any>;
    if (storedKey) {
      const signer = seckeySigner(storedKey);
      signFunc = (event) => signer.signEvent(event);
    } else {
      // 2) nostr-login / nip-07 プロバイダがあればそれで署名
      const nostr = (window as any)?.nostr;
      if (nostr?.signEvent) {
        signFunc = (event) => nostr.signEvent(event);
      } else {
        throw new Error('Authentication required');
      }
    }
    // nip98 の getToken を使って Authorization ヘッダー値を生成
    const token = await getToken(url, method, signFunc, true /* Nostr prefix */);
    return token;
  }

  // --- アップロード完了をポーリングして検知する処理 ---
  private static async pollUploadStatus(
    processingUrl: string,
    authHeader: string,
    maxWaitTime: number = 8000
  ): Promise<any> {
    const startTime = Date.now();
    while (true) {
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error("Timeout while polling processing_url");
      }
      const response = await fetch(processingUrl, {
        method: "GET",
        headers: { Authorization: authHeader }
      });
      if (!response.ok) {
        throw new Error(`Unexpected status code ${response.status} while polling processing_url`);
      }
      if (response.status === 201) {
        return await response.json();
      }
      const processingStatus = await response.json();
      if (processingStatus.status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      if (processingStatus.status === "error") {
        throw new Error("File processing failed");
      }
      throw new Error("Unexpected processing status");
    }
  }

  public static async uploadFile(
    file: File,
    apiUrl: string = DEFAULT_API_URL
  ): Promise<FileUploadResponse> {
    try {
      if (!file) return { success: false, error: "No file selected" };
      const originalSize = file.size;
      const { file: uploadFile, wasCompressed, wasSkipped } = await this.compressImage(file);
      const compressedSize = uploadFile.size;

      // 圧縮設定が有効な場合、または実際に変化があった場合は表示対象とする
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

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
      });

      // --- devモード時のレスポンスログをdebug.tsに移譲 ---
      await debugLogUploadResponse(response);

      let data: any;
      try {
        data = await response.json();
      } catch {
        return { success: false, error: 'Could not parse upload response', sizeInfo };
      }

      // --- ポーリング処理追加 ---
      if ((response.status === 200 || response.status === 202) && data.processing_url) {
        try {
          // 認証トークン再取得（GETメソッドで取得）
          const processingAuthToken = await this.buildAuthHeader(data.processing_url, "GET");
          data = await this.pollUploadStatus(data.processing_url, processingAuthToken, 8000);
        } catch (e) {
          return { success: false, error: e instanceof Error ? e.message : String(e), sizeInfo };
        }
      }

      if (data.status === 'success' && data.nip94_event?.tags) {
        const urlTag = data.nip94_event.tags.find((tag: string[]) => tag[0] === 'url');
        if (urlTag?.[1]) return { success: true, url: urlTag[1], sizeInfo };
      }
      return { success: false, error: data.message || 'Could not extract URL from response', sizeInfo };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

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

  // --- ServiceWorker関連の共通処理をユーティリティ関数化 ---
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
    // 取得済みなら何も返さない
    if (localStorage.getItem("sharedImageProcessed") === "1") return null;
    if (!navigator.serviceWorker.controller) return null;
    try {
      const timeoutPromise = new Promise<null>(resolve => setTimeout(() => resolve(null), 5000));
      const result = await Promise.race([
        this.createSWMessagePromise(true),
        this.createSWMessagePromise(false),
        timeoutPromise
      ]);
      return result;
    } catch {
      return null;
    }
  }

  public static checkIfOpenedFromShare(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('shared') === 'true';
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

