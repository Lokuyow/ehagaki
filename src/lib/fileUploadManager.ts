import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
import { createFileSizeInfo, generateSizeDisplayInfo, calculateSHA256Hex, renameByMimeType } from "./utils/appUtils";
import { showImageSizeInfo, setVideoCompressionService, setImageCompressionService, getVideoCompressionService, getImageCompressionService } from "../stores/appStore.svelte";
import imageCompression from "browser-image-compression";
import { VideoCompressionService } from "./videoCompression/videoCompressionService";
import type {
  FileUploadResponse,
  UploadProgress,
  UploadInfoCallbacks,
  FileValidationResult,
  FileUploadDependencies,
  CompressionService,
  AuthService,
  MimeTypeSupportInterface,
  SharedImageData,
  SharedImageProcessingResult,
  FileUploadManagerInterface
} from "./types";
import {
  DEFAULT_API_URL,
  MAX_FILE_SIZE,
  COMPRESSION_OPTIONS_MAP,
  UPLOAD_POLLING_CONFIG
} from "./constants";
import { getToken } from "nostr-tools/nip98";
import { generateBlurhashForFile, createPlaceholderUrl } from "./tags/imetaTag";
import { showCompressedImagePreview } from "./debug";

import { uploadAbortFlagStore } from '../stores/appStore.svelte';

// --- MIMEタイプサポート検出クラス ---
export class MimeTypeSupport implements MimeTypeSupportInterface {
  private mimeSupportCache: Record<string, boolean> = {};
  private webpQualitySupport?: boolean;

  constructor(private document?: Document) { }

  async canEncodeWebpWithQuality(): Promise<boolean> {
    if (this.webpQualitySupport !== undefined) return this.webpQualitySupport;
    try {
      if (!this.document) return (this.webpQualitySupport = false);
      const canvas = this.document.createElement("canvas");
      canvas.width = 2; canvas.height = 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return (this.webpQualitySupport = false);
      ctx.fillStyle = "#f00"; ctx.fillRect(0, 0, 2, 2);
      const qLow = canvas.toDataURL("image/webp", 0.2);
      const qHigh = canvas.toDataURL("image/webp", 0.9);
      const ok = qLow.startsWith("data:image/webp") && qHigh.startsWith("data:image/webp") && qLow.length !== qHigh.length;
      this.webpQualitySupport = ok;
      return ok;
    } catch {
      this.webpQualitySupport = false;
      return false;
    }
  }

  canEncodeMimeType(mime: string): boolean {
    if (!mime) return false;
    if (mime in this.mimeSupportCache) return this.mimeSupportCache[mime];
    try {
      if (!this.document) return (this.mimeSupportCache[mime] = false);
      const canvas = this.document.createElement("canvas");
      canvas.width = 2; canvas.height = 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return (this.mimeSupportCache[mime] = false);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 2, 2);
      const url = canvas.toDataURL(mime);
      const ok = typeof url === "string" && url.startsWith(`data:${mime}`);
      this.mimeSupportCache[mime] = ok;
      return ok;
    } catch {
      this.mimeSupportCache[mime] = false;
      return false;
    }
  }
}

// --- 画像圧縮サービス ---
export class ImageCompressionService implements CompressionService {
  private onProgress?: (progress: number) => void;

  constructor(
    private mimeSupport: MimeTypeSupportInterface,
    private localStorage: Storage
  ) { }

  /**
   * 圧縮処理を中止（グローバルフラグで管理）
   */
  public abort(): void {
    const isDev = import.meta.env.DEV;
    if (isDev) console.log('[ImageCompressionService] Abort requested');

    // 進捗を0にリセット
    if (this.onProgress) {
      this.onProgress(0);
    }
  }

  /**
   * 進捗コールバックを設定
   */
  public setProgressCallback(callback?: (progress: number) => void): void {
    this.onProgress = callback;
  }

  private getCompressionOptions(): any {
    const level = (this.localStorage.getItem("imageCompressionLevel") || "medium") as keyof typeof COMPRESSION_OPTIONS_MAP;
    const opt = COMPRESSION_OPTIONS_MAP[level];
    // skipプロパティがtrueの場合はnullを返す
    if (typeof opt === "object" && opt && "skip" in opt && opt.skip) {
      return null;
    }
    return opt ? { ...opt, preserveExif: false } : null;
  }

  // 公開メソッドとして追加（FileUploadManagerからアクセス可能にする）
  public hasCompressionSettings(): boolean {
    return this.getCompressionOptions() !== null;
  }

  async compress(file: File): Promise<{ file: File; wasCompressed: boolean; wasSkipped?: boolean; aborted?: boolean }> {
    // グローバル中止フラグをチェック
    if (uploadAbortFlagStore.value) {
      return { file, wasCompressed: false, aborted: true };
    }

    if (!file.type.startsWith("image/")) return { file, wasCompressed: false };
    if (file.size <= 20 * 1024) return { file, wasCompressed: false, wasSkipped: true };

    const options = this.getCompressionOptions();
    if (!options) return { file, wasCompressed: false, wasSkipped: true };

    let usedOptions: any = {
      ...options,
      onProgress: (progress: number) => {
        // 進捗を通知（0-100のパーセンテージ）
        if (this.onProgress) {
          this.onProgress(Math.round(progress * 100));
        }
      }
    };

    // WebPサポートチェックとfallback処理を改善
    if (usedOptions.fileType === "image/webp") {
      const webpSupported = await this.mimeSupport.canEncodeWebpWithQuality();
      if (!webpSupported) {
        // WebPがサポートされていない場合、JPEG/PNGにフォールバック
        usedOptions.fileType = file.type === "image/png" ? "image/png" : "image/jpeg";
      }
    }

    // 中止チェック
    if (uploadAbortFlagStore.value) {
      return { file, wasCompressed: false, aborted: true };
    }

    let targetMime: string = usedOptions.fileType || file.type;
    if (!this.mimeSupport.canEncodeMimeType(targetMime)) {
      // ターゲットMIMEタイプがサポートされていない場合、元のタイプを使用
      targetMime = file.type;
      delete usedOptions.fileType;
    }


    try {
      const compressed = await imageCompression(file, usedOptions);

      // 中止チェック
      if (uploadAbortFlagStore.value) {
        if (this.onProgress) {
          this.onProgress(0);
        }
        return { file, wasCompressed: false, aborted: true };
      }

      if ((compressed as File).size >= file.size) {
        return { file, wasCompressed: false };
      }

      // 出力ファイルのタイプと名前を正しく設定
      const outType = usedOptions.fileType || (compressed as File).type || targetMime || file.type;
      const outName = renameByMimeType(file.name, outType);
      const outFile = new File([compressed], outName, { type: outType });

      showCompressedImagePreview(outFile);
      return { file: outFile, wasCompressed: true };
    } catch (error) {

      // 中止による終了の場合
      if (uploadAbortFlagStore.value) {
        if (this.onProgress) {
          this.onProgress(0);
        }
        return { file, wasCompressed: false, aborted: true };
      }

      // 圧縮に失敗した場合もログを出力
      console.warn("[ImageCompressionService] Compression failed:", error);
      return { file, wasCompressed: false, wasSkipped: true };
    }
  }
}

// --- 認証サービス ---
export class NostrAuthService implements AuthService {
  async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
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
}

// ファイルアップロード専用マネージャークラス
export class FileUploadManager implements FileUploadManagerInterface {
  private imageCompressionService: CompressionService;
  private videoCompressionService: CompressionService;
  private mimeSupport: MimeTypeSupportInterface;
  private authService: AuthService;

  constructor(
    private dependencies: FileUploadDependencies = {
      localStorage: window.localStorage,
      fetch: window.fetch.bind(window),
      crypto: window.crypto.subtle,
      document: window.document,
      window: window,
      navigator: window.navigator
    },
    authService?: AuthService,
    imageCompressionService?: CompressionService,
    videoCompressionService?: CompressionService,
    mimeSupport?: MimeTypeSupportInterface
  ) {
    this.mimeSupport = mimeSupport || new MimeTypeSupport(dependencies.document);
    this.imageCompressionService = imageCompressionService || new ImageCompressionService(this.mimeSupport, dependencies.localStorage);
    this.videoCompressionService = videoCompressionService || new VideoCompressionService(dependencies.localStorage);
    this.authService = authService || new NostrAuthService();

    // VideoCompressionServiceインスタンスをストアに登録
    if (this.videoCompressionService instanceof VideoCompressionService && !getVideoCompressionService()) {
      setVideoCompressionService(this.videoCompressionService);
      console.log('[FileUploadManager] VideoCompressionService registered to store');
    }

    // ImageCompressionServiceインスタンスをストアに登録
    if (this.imageCompressionService instanceof ImageCompressionService && !getImageCompressionService()) {
      setImageCompressionService(this.imageCompressionService);
      console.log('[FileUploadManager] ImageCompressionService registered to store');
    }
  }

  validateImageFile(file: File): FileValidationResult {
    if (!file.type.startsWith("image/")) return { isValid: false, errorMessage: "only_images_allowed" };
    if (file.size > MAX_FILE_SIZE) return { isValid: false, errorMessage: "file_too_large" };
    return { isValid: true };
  }

  validateMediaFile(file: File): FileValidationResult {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return { isValid: false, errorMessage: "only_images_or_videos_allowed" };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, errorMessage: "file_too_large" };
    }

    return { isValid: true };
  }

  async generateBlurhashForFile(file: File): Promise<string | null> {
    return await generateBlurhashForFile(file);
  }

  async createPlaceholderUrl(file: File): Promise<string | null> {
    return await createPlaceholderUrl(file);
  }

  private getUploadEndpoint(apiUrl: string): string {
    const stored = this.dependencies.localStorage.getItem("uploadEndpoint");
    const pick = (v?: string | null) => (v && v.trim().length > 0 ? v : undefined);
    return pick(stored) ?? pick(apiUrl) ?? DEFAULT_API_URL;
  }

  private async pollUploadStatus(
    processingUrl: string,
    authHeader: string,
    maxWaitTime: number = UPLOAD_POLLING_CONFIG.MAX_WAIT_TIME
  ): Promise<any> {
    const startTime = Date.now();
    
    while (true) {
      // ポーリング中の中止チェック
      if (uploadAbortFlagStore.value) {
        throw new Error('Upload aborted by user');
      }
      
      if (Date.now() - startTime > maxWaitTime) throw new Error(UPLOAD_POLLING_CONFIG.TIMEOUT_MESSAGE);
      const response = await this.dependencies.fetch(processingUrl, {
        method: "GET",
        headers: { Authorization: authHeader }
      });
      if (!response.ok) throw new Error(`Unexpected status code ${response.status} while polling processing_url`);

      let processingStatus: any = null;
      try {
        processingStatus = await response.json();
      } catch {
        processingStatus = null;
      }

      if (response.status === 201 && processingStatus) return processingStatus;

      if (processingStatus?.status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, UPLOAD_POLLING_CONFIG.RETRY_INTERVAL));
        continue;
      }

      if (processingStatus?.status === "success") {
        return processingStatus;
      }

      if (processingStatus?.status === "error") {
        throw new Error(processingStatus?.message || "File processing failed");
      }

      if (response.status === 200) {
        return processingStatus;
      }

      throw new Error("Unexpected processing status");
    }
  }

  async uploadFile(
    file: File,
    apiUrl: string = DEFAULT_API_URL,
    devMode: boolean = false,
    metadata?: Record<string, string | number | undefined>,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse> {
    let sizeInfo: any = undefined; // sizeInfoを関数スコープで宣言
    
    try {
      if (!file) return { success: false, error: "No file selected" };

      let ox: string | undefined = undefined;
      try {
        ox = await calculateSHA256Hex(file, this.dependencies.crypto);
      } catch (e) {
        ox = undefined;
      }

      const originalSize = file.size;

      // 圧縮開始前に中止チェック
      if (uploadAbortFlagStore.value) {
        if (devMode) console.log('[FileUploadManager] Upload aborted before compression');
        return { success: false, error: 'Upload aborted by user', aborted: true };
      }

      // ファイルタイプに応じて適切な圧縮サービスを選択
      const isVideo = file.type.startsWith('video/');
      const compressionService = isVideo ? this.videoCompressionService : this.imageCompressionService;

      // 動画圧縮の進捗コールバックを設定
      if (isVideo && callbacks?.onVideoCompressionProgress) {
        (this.videoCompressionService as VideoCompressionService).setProgressCallback(callbacks.onVideoCompressionProgress);
      }

      // 画像圧縮の進捗コールバックを設定
      if (!isVideo && callbacks?.onImageCompressionProgress) {
        (this.imageCompressionService as ImageCompressionService).setProgressCallback(callbacks.onImageCompressionProgress);
      }

      const { file: uploadFile, wasCompressed, wasSkipped, aborted } = await compressionService.compress(file);

      // 圧縮完了後はコールバックをクリア
      if (isVideo) {
        (this.videoCompressionService as VideoCompressionService).setProgressCallback(undefined);
      } else {
        (this.imageCompressionService as ImageCompressionService).setProgressCallback(undefined);
      }

      // 中止された場合はアップロードを中止
      if (aborted) {
        if (devMode) console.log('[FileUploadManager] Upload aborted by user');
        return { success: false, error: 'Upload aborted by user', aborted: true };
      }

      const compressedSize = uploadFile.size;

      // 型安全にアクセス
      const hasCompressionSettings = isVideo
        ? (this.videoCompressionService as VideoCompressionService).hasCompressionSettings()
        : (this.imageCompressionService as ImageCompressionService).hasCompressionSettings();
      sizeInfo = createFileSizeInfo(
        originalSize,
        compressedSize,
        hasCompressionSettings || wasCompressed,
        file.name,
        uploadFile.name,
        wasSkipped
      );

      const finalUrl = this.getUploadEndpoint(apiUrl);
      const authHeader = await this.authService.buildAuthHeader(finalUrl, "POST");

      const formData = new FormData();
      formData.append('file', uploadFile);

      if (metadata?.caption) formData.append('caption', String(metadata.caption));
      if (metadata?.expiration !== undefined) formData.append('expiration', String(metadata.expiration));
      formData.append('size', String(uploadFile.size));
      if (metadata?.alt) formData.append('alt', String(metadata.alt));
      if (metadata?.media_type) formData.append('media_type', String(metadata.media_type));
      formData.append('content_type', metadata?.content_type ? String(metadata.content_type) : uploadFile.type || '');
      formData.append('no_transform', metadata?.no_transform ? String(metadata.no_transform) : 'true');

      const response = await this.dependencies.fetch(finalUrl, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
      });

      // 重要な処理前後のみ中止チェック
      if (uploadAbortFlagStore.value) {
        return { 
          success: false, 
          error: 'Upload aborted by user', 
          sizeInfo,
          aborted: true 
        };
      }

      // レスポンスの処理
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        return {
          success: false,
          error: `Upload failed: ${response.status} ${response.statusText} - ${errorText}`,
          sizeInfo
        };
      }

      let data: any;
      try {
        data = await response.json();
      } catch (jsonError) {
        if (devMode) {
          console.error("[dev] JSON parse error:", jsonError);
        }
        return { success: false, error: 'Could not parse upload response', sizeInfo };
      }

      if ((response.status === 200 || response.status === 202) && data.processing_url) {
        try {
          const processingAuthToken = await this.authService.buildAuthHeader(data.processing_url, "GET");
          data = await this.pollUploadStatus(data.processing_url, processingAuthToken);
          
          // ポーリング後の中止チェック
          if (uploadAbortFlagStore.value) {
            return { 
              success: false, 
              error: 'Upload aborted by user', 
              sizeInfo,
              aborted: true 
            };
          }
        } catch (e) {
          return { success: false, error: e instanceof Error ? e.message : String(e), sizeInfo };
        }
      }

      const parsedNip94: Record<string, string> = {};
      if (data?.nip94_event?.tags && Array.isArray(data.nip94_event.tags)) {
        for (const tag of data.nip94_event.tags) {
          if (!Array.isArray(tag) || tag.length < 2) continue;
          const key = String(tag[0]);
          const value = tag.slice(1).join(' ');
          if (!(key in parsedNip94)) parsedNip94[key] = value;
        }
      }

      if (data.status === 'success' && data.nip94_event?.tags) {
        const urlTag = data.nip94_event.tags.find((tag: string[]) => tag[0] === 'url');
        if (urlTag?.[1]) return { success: true, url: urlTag[1], sizeInfo, nip94: parsedNip94 };
      }
      return {
        success: false,
        error: data.message || 'Could not extract URL from response',
        sizeInfo,
        nip94: Object.keys(parsedNip94).length ? parsedNip94 : undefined
      };
    } catch (error) {
      // エラーハンドリング時の中止チェック
      if (uploadAbortFlagStore.value) {
        return { 
          success: false, 
          error: 'Upload aborted by user', 
          sizeInfo,
          aborted: true 
        };
      }
      
      if (devMode) {
        console.error("[dev] Upload error:", error);
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // ユーザーによる中止の場合
      if (errorMessage.includes('aborted by user')) {
        return { 
          success: false, 
          error: errorMessage,
          sizeInfo,
          aborted: true 
        };
      }
      
      // Service Workerが原因の可能性がある場合のヒントを追加
      const enhancedError = errorMessage.includes('Failed to fetch')
        ? `${errorMessage} (Service Workerが画像アップロードをブロックしている可能性があります)`
        : errorMessage;
      return { success: false, error: enhancedError };
    }
  }

  async uploadMultipleFiles(
    files: File[],
    apiUrl: string = DEFAULT_API_URL,
    onProgress?: (progress: UploadProgress) => void,
    devMode: boolean = false,
    metadataList?: Array<Record<string, string | number | undefined> | undefined>,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse[]> {
    if (!files?.length) return [];
    const results: FileUploadResponse[] = new Array(files.length);
    let completed = 0, failed = 0, aborted = 0;
    const updateProgress = () => onProgress?.({
      completed, failed, aborted, total: files.length, inProgress: completed + failed + aborted < files.length
    });
    updateProgress();

    // 順次実行に変更し、中止時は即座に終了
    for (let index = 0; index < files.length; index++) {
      // 中止フラグチェック
      if (uploadAbortFlagStore.value) {
        // 残りのファイルをabortedとしてマーク
        for (let i = index; i < files.length; i++) {
          results[i] = { success: false, aborted: true };
          aborted++;
        }
        updateProgress();
        break;
      }

      const file = files[index];
      try {
        const meta = metadataList ? metadataList[index] : undefined;
        const result = await this.uploadFile(file, apiUrl, devMode, meta, callbacks);
        results[index] = result;
        if (result.success) {
          completed++;
        } else if (result.aborted) {
          aborted++;
        } else {
          failed++;
        }
        updateProgress();
      } catch (error) {
        results[index] = { success: false, error: error instanceof Error ? error.message : String(error) };
        failed++; 
        updateProgress();
      }
    }

    return results;
  }

  async uploadFileWithCallbacks(
    file: File,
    apiUrl: string = DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks,
    devMode: boolean = false,
    metadata?: Record<string, string | number | undefined>
  ): Promise<FileUploadResponse> {
    callbacks?.onProgress?.({ completed: 0, failed: 0, aborted: 0, total: 1, inProgress: true });
    try {
      const result = await this.uploadFile(file, apiUrl, devMode, metadata, callbacks);
      callbacks?.onProgress?.({
        completed: result.success ? 1 : 0,
        failed: (!result.success && !result.aborted) ? 1 : 0,
        aborted: result.aborted ? 1 : 0,
        total: 1,
        inProgress: false
      });
      
      // 中止された場合はサイズ情報表示をスキップ
      if (result.success && result.sizeInfo && !result.aborted) {
        const displayInfo = generateSizeDisplayInfo(result.sizeInfo);
        if (displayInfo) showImageSizeInfo(displayInfo);
      }
      return result;
    } catch (error) {
      callbacks?.onProgress?.({ completed: 0, failed: 1, aborted: 0, total: 1, inProgress: false });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async uploadMultipleFilesWithCallbacks(
    files: File[],
    apiUrl: string = DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks,
    metadataList?: Array<Record<string, string | number | undefined> | undefined>
  ): Promise<FileUploadResponse[]> {
    if (!files?.length) return [];

    // 処理開始を即座に通知（圧縮開始前）
    callbacks?.onProgress?.({
      completed: 0,
      failed: 0,
      aborted: 0,
      total: files.length,
      inProgress: true
    });

    const results = await this.uploadMultipleFiles(
      files,
      apiUrl,
      callbacks?.onProgress,
      import.meta.env.MODE === "development",
      metadataList,
      callbacks
    );

    // 中止された場合はサイズ情報表示をスキップ
    if (!uploadAbortFlagStore.value) {
      const firstSuccess = results.find(r => r.success && r.sizeInfo);
      if (firstSuccess?.sizeInfo) {
        const displayInfo = generateSizeDisplayInfo(firstSuccess.sizeInfo);
        if (displayInfo) showImageSizeInfo(displayInfo);
      }
    }

    return results;
  }


  // --- 共有画像処理の統一メソッド ---
  async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (!this.dependencies.navigator?.serviceWorker?.controller) return null;

    try {
      const channel = new MessageChannel();
      const promise = new Promise<SharedImageData | null>((resolve) => {
        channel.port1.onmessage = (event) => {
          if (event.data?.type === 'SHARED_IMAGE') {
            resolve(event.data.data);
          } else {
            resolve(null);
          }
        };
        setTimeout(() => resolve(null), 3000);
      });

      this.dependencies.navigator.serviceWorker.controller.postMessage(
        { action: 'getSharedImage' },
        [channel.port2]
      );

      return await promise;
    } catch (error) {
      console.error('Service Workerからの共有画像取得に失敗:', error);
      return null;
    }
  }

  checkIfOpenedFromShare(): boolean {
    if (!this.dependencies.window?.location) return false;
    return new URLSearchParams(this.dependencies.window.location.search).get('shared') === 'true';
  }

  // 共有画像の包括的な処理メソッド
  async processSharedImageOnLaunch(): Promise<SharedImageProcessingResult> {
    try {
      // Service Workerから取得を試行
      const sharedData = await this.getSharedImageFromServiceWorker();
      if (sharedData?.image) {
        return {
          success: true,
          data: sharedData,
          fromServiceWorker: true
        };
      }

      // IndexedDBフォールバック（必要に応じて実装）
      // この部分はshareHandler.tsから移行

      return {
        success: false,
        error: '共有画像が見つかりません'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// getSharedImageFromServiceWorker: 別名エクスポート用（後方互換性）
export async function getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
  const manager = new FileUploadManager();
  return await manager.getSharedImageFromServiceWorker();
}

