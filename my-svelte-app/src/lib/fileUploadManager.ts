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
  COMPRESSION_OPTIONS_MAP // 修正: COMPRESSION_OPTIONS の import を削除
} from "./constants";

// ファイルアップロード専用マネージャークラス
// 責務: ファイルの圧縮・アップロード処理、進捗管理
export class FileUploadManager {
  private static async createAuthEvent(url: string, method: string): Promise<any> {
    // 共通の未署名イベント
    const unsignedEvent = {
      kind: 27235,
      created_at: Math.floor(Date.now() / 1000),
      content: "",
      tags: [
        ["u", url],
        ["method", method]
      ]
    };

    // 1) ローカル秘密鍵があればそれで署名
    const storedKey = keyManager.loadFromStorage();
    if (storedKey) {
      const signer = seckeySigner(storedKey);
      return await signer.signEvent(unsignedEvent);
    }

    // 2) nostr-login / nip-07 プロバイダがあればそれで署名
    const nostr = (window as any)?.nostr;
    if (nostr?.signEvent) {
      try {
        const signed = await nostr.signEvent(unsignedEvent);
        return signed;
      } catch (e) {
        throw new Error("Failed to sign auth event via nostr-login");
      }
    }

    // 3) どちらも無ければ認証不可
    throw new Error('Authentication required');
  }

  private static getCompressionOptions(): any {
    const level = (localStorage.getItem("imageCompressionLevel") || "medium") as keyof typeof COMPRESSION_OPTIONS_MAP;
    const opt = COMPRESSION_OPTIONS_MAP[level];
    if (opt && 'skip' in opt && (opt as { skip: boolean }).skip) return null;
    return opt;
  }

  private static async compressImage(file: File): Promise<{ file: File; wasCompressed: boolean }> {
    if (!file.type.startsWith("image/")) return { file, wasCompressed: false };
    const options = this.getCompressionOptions();
    if (!options) {
      // 無圧縮
      return { file, wasCompressed: false };
    }
    try {
      const compressed = await imageCompression(file, options);
      // fileType指定がある場合のみ拡張子・typeを変換
      let outFile: File;
      if (options.fileType && file.type !== options.fileType) {
        outFile = new File(
          [compressed],
          file.name.replace(/\.[^.]+$/, "") + ".webp",
          { type: "image/webp" }
        );
      } else {
        outFile = new File([compressed], file.name, { type: file.type });
      }
      return { file: outFile, wasCompressed: true };
    } catch {
      return { file, wasCompressed: false };
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

  private static async buildAuthHeader(url: string): Promise<string> {
    const authEvent = await this.createAuthEvent(url, "POST");
    return `Nostr ${btoa(JSON.stringify(authEvent))}`;
  }

  public static async uploadFile(
    file: File,
    apiUrl: string = DEFAULT_API_URL
  ): Promise<FileUploadResponse> {
    try {
      if (!file) return { success: false, error: "No file selected" };
      const originalSize = file.size;
      const { file: uploadFile, wasCompressed } = await this.compressImage(file);
      const compressedSize = uploadFile.size;
      const sizeInfo = createFileSizeInfo(originalSize, compressedSize, wasCompressed);
      const finalUrl = this.getUploadEndpoint(apiUrl);
      const authHeader = await this.buildAuthHeader(finalUrl);

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('uploadtype', 'media');

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Upload failed: ${response.status} ${errorText}`, sizeInfo };
      }

      const data = await response.json();
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

