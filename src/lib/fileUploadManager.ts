import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager.svelte";
import { createFileSizeInfo, generateSizeDisplayInfo } from "./utils/fileSizeUtils";
import { calculateSHA256Hex } from "./utils/fileUtils";
import { showImageSizeInfo, setVideoCompressionService, setImageCompressionService, getVideoCompressionService, getImageCompressionService } from "../stores/appStore.svelte";
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
  SharedMediaData,
  SharedMediaProcessingResult,
  FileUploadManagerInterface
} from "./types";
import {
  DEFAULT_API_URL,
  MAX_FILE_SIZE,
  UPLOAD_POLLING_CONFIG
} from "./constants";
import { generateBlurhashForFile, createPlaceholderUrl } from "./tags/imetaTag";
import { uploadAbortFlagStore } from '../stores/appStore.svelte';
import { MimeTypeSupport } from './mimeTypeSupport';
import { ImageCompressionService } from './imageCompressionService';
export { MimeTypeSupport } from './mimeTypeSupport';
export { ImageCompressionService } from './imageCompressionService';

// --- 認証サービス ---
export class NostrAuthService implements AuthService {
  /**
   * window.nostrが利用可能になるまで待機する（nostr-login初期化用）
   * @param maxWaitMs 最大待機時間（ミリ秒）
   * @param pollIntervalMs ポーリング間隔（ミリ秒）
   * @returns window.nostrオブジェクト（利用可能な場合）またはnull
   */
  private async waitForWindowNostr(maxWaitMs: number = 3000, pollIntervalMs: number = 100): Promise<any | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      const nostr = (window as any)?.nostr;
      if (nostr?.signEvent) {
        return nostr;
      }
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    return null;
  }

  async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
    const storedKey = keyManager.getFromStore() || keyManager.loadFromStorage();
    let signFunc: (event: any) => Promise<any>;
    if (storedKey) {
      signFunc = (event) => seckeySigner(storedKey).signEvent(event);
    } else {
      // まずwindow.nostrを即時チェック
      let nostr = (window as any)?.nostr;

      // window.nostrがない場合、nostr-loginの初期化を待機
      if (!nostr?.signEvent) {
        nostr = await this.waitForWindowNostr();
      }

      if (nostr?.signEvent) {
        signFunc = (event) => nostr.signEvent(event);
      } else {
        throw new Error('Authentication required');
      }
    }
    const { getToken } = await import("nostr-tools/nip98");
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


  // --- 共有メディア処理の統一メソッド ---
  async getSharedMediaFromServiceWorker(): Promise<SharedMediaData | null> {
    if (!this.dependencies.navigator?.serviceWorker?.controller) return null;

    try {
      const channel = new MessageChannel();
      const promise = new Promise<SharedMediaData | null>((resolve) => {
        channel.port1.onmessage = (event) => {
          if (event.data?.type === 'SHARED_MEDIA') {
            resolve(event.data.data);
          } else {
            resolve(null);
          }
        };
        setTimeout(() => resolve(null), 3000);
      });

      this.dependencies.navigator.serviceWorker.controller.postMessage(
        { action: 'getSharedMedia' },
        [channel.port2]
      );

      return await promise;
    } catch (error) {
      console.error('Service Workerからの共有メディア取得に失敗:', error);
      return null;
    }
  }

  checkIfOpenedFromShare(): boolean {
    if (!this.dependencies.window?.location) return false;
    return new URLSearchParams(this.dependencies.window.location.search).get('shared') === 'true';
  }

  // 共有メディアの包括的な処理メソッド
  async processSharedMediaOnLaunch(): Promise<SharedMediaProcessingResult> {
    try {
      // Service Workerから取得を試行
      const sharedData = await this.getSharedMediaFromServiceWorker();
      if (sharedData?.images?.length) {
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
        error: '共有メディアが見つかりません'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}


