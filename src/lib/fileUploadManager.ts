import { createFileSizeInfo } from "./utils/fileSizeUtils";
import { calculateSHA256Hex } from "./utils/fileUtils";
import { setImageSizeInfoFromFileSize } from "../stores/uploadStore.svelte";
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
  FileUploadManagerInterface,
  UploadDestination
} from "./types";
import {
  DEFAULT_API_URL,
  getDefaultEndpoint,
  MAX_FILE_SIZE,
  STORAGE_KEYS
} from "./constants";
import { generateBlurhashForFile, createPlaceholderUrl } from "./tags/imetaTag";
import { MimeTypeSupport } from './mimeTypeSupport';
import { ImageCompressionService } from './imageCompressionService';
import { NostrAuthService } from './nostrAuthService';
import { isValidUploadEndpoint, normalizeLocale } from './utils/settingsStorage';
import { isDefaultUploadAborted } from './uploadAbortUtils';
import { getUploadAdapter } from "./upload/uploadAdapterRegistry";
import { createLegacyUploadDestination } from "./upload/uploadDestinationPresets";

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
    this.dependencies.setImageSizeInfoFromFileSize ??= setImageSizeInfoFromFileSize;
    this.mimeSupport = mimeSupport || new MimeTypeSupport(dependencies.document);
    this.imageCompressionService = imageCompressionService || new ImageCompressionService(
      this.mimeSupport,
      dependencies.localStorage,
      this.isUploadAborted.bind(this)
    );
    this.videoCompressionService = videoCompressionService || new VideoCompressionService(
      dependencies.localStorage,
      this.isUploadAborted.bind(this)
    );
    this.authService = authService || new NostrAuthService();
  }

  private isUploadAborted(): boolean {
    return this.dependencies.isUploadAborted?.() ?? isDefaultUploadAborted();
  }

  private updateImageSizeInfo(sizeInfo: FileUploadResponse['sizeInfo']): void {
    if (!sizeInfo) {
      return;
    }

    this.dependencies.setImageSizeInfoFromFileSize?.(sizeInfo);
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
    return await generateBlurhashForFile(file, this.isUploadAborted.bind(this));
  }

  async createPlaceholderUrl(file: File): Promise<string | null> {
    return await createPlaceholderUrl(file);
  }

  private getUploadEndpoint(apiUrl: string): string {
    const stored = this.dependencies.localStorage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT);
    if (isValidUploadEndpoint(stored)) {
      return stored;
    }

    const normalizedApiUrl = apiUrl?.trim();
    if (normalizedApiUrl && normalizedApiUrl !== DEFAULT_API_URL) {
      return normalizedApiUrl;
    }

    const fallbackEndpoint = getDefaultEndpoint(
      normalizeLocale(
        this.dependencies.localStorage.getItem(STORAGE_KEYS.LOCALE) ??
        this.dependencies.navigator?.language,
      ),
    );

    return fallbackEndpoint;
  }

  async uploadFile(
    file: File,
    apiUrl: string = DEFAULT_API_URL,
    devMode: boolean = false,
    metadata?: Record<string, string | number | undefined>,
    callbacks?: UploadInfoCallbacks,
    destination?: UploadDestination
  ): Promise<FileUploadResponse> {
    let sizeInfo: any = undefined; // sizeInfoを関数スコープで宣言

    try {
      if (!file) return { success: false, error: "No file selected" };

      let ox: string | undefined = undefined;
      try {
        ox = await calculateSHA256Hex(file, this.dependencies.crypto, this.isUploadAborted.bind(this));
      } catch (e) {
        ox = undefined;
      }

      const originalSize = file.size;

      // 圧縮開始前に中止チェック
      if (this.isUploadAborted()) {
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

      const finalUrl = destination ? "" : this.getUploadEndpoint(apiUrl);
      const uploadDestination = destination ?? createLegacyUploadDestination({
        endpoint: finalUrl,
        locale: this.dependencies.localStorage.getItem(STORAGE_KEYS.LOCALE),
      });
      const adapter = getUploadAdapter(uploadDestination.protocol);
      const uploadResult = await adapter.upload({
        file: uploadFile,
        destination: uploadDestination,
        authService: this.authService,
        fetch: this.dependencies.fetch,
        metadata,
        devMode,
      });

      // 重要な処理前後のみ中止チェック
      if (this.isUploadAborted()) {
        return {
          success: false,
          error: 'Upload aborted by user',
          sizeInfo,
          aborted: true
        };
      }

      return {
        ...uploadResult,
        sizeInfo
      };
    } catch (error) {
      // エラーハンドリング時の中止チェック
      if (this.isUploadAborted()) {
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
    callbacks?: UploadInfoCallbacks,
    destination?: UploadDestination
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
      if (this.isUploadAborted()) {
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
        const result = await this.uploadFile(file, apiUrl, devMode, meta, callbacks, destination);
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
    metadata?: Record<string, string | number | undefined>,
    destination?: UploadDestination
  ): Promise<FileUploadResponse> {
    callbacks?.onProgress?.({ completed: 0, failed: 0, aborted: 0, total: 1, inProgress: true });
    try {
      const result = await this.uploadFile(file, apiUrl, devMode, metadata, callbacks, destination);
      callbacks?.onProgress?.({
        completed: result.success ? 1 : 0,
        failed: (!result.success && !result.aborted) ? 1 : 0,
        aborted: result.aborted ? 1 : 0,
        total: 1,
        inProgress: false
      });

      // 中止された場合はサイズ情報表示をスキップ
      if (result.success && result.sizeInfo && !result.aborted) {
        this.updateImageSizeInfo(result.sizeInfo);
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
    metadataList?: Array<Record<string, string | number | undefined> | undefined>,
    destination?: UploadDestination
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
      callbacks,
      destination
    );

    // 中止された場合はサイズ情報表示をスキップ
    if (!this.isUploadAborted()) {
      const firstSuccess = results.find(r => r.success && r.sizeInfo);
      if (firstSuccess?.sizeInfo) {
        this.updateImageSizeInfo(firstSuccess.sizeInfo);
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


