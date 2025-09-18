import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
import { createFileSizeInfo, generateSizeDisplayInfo, calculateSHA256Hex, getImageDimensions, renameByMimeType } from "./utils/appUtils";
import { showImageSizeInfo } from "../stores/appStore.svelte";
import imageCompression from "browser-image-compression";
import type {
  FileUploadResponse,
  UploadProgress,
  UploadInfoCallbacks,
  FileValidationResult,
  FileUploadDependencies,
  CompressionService,
  AuthService,
  MimeTypeSupportInterface,
  SharedImageData
} from "./types";
import {
  DEFAULT_API_URL,
  MAX_FILE_SIZE,
  COMPRESSION_OPTIONS_MAP,
  UPLOAD_POLLING_CONFIG
} from "./constants";
import { getToken } from "nostr-tools/nip98";
import { debugLogUploadResponse } from "./debug";
import { generateBlurhashForFile, createPlaceholderUrl } from "./tags/imetaTag";
import { showCompressedImagePreview } from "./debug";

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
  constructor(
    private mimeSupport: MimeTypeSupportInterface,
    private localStorage: Storage
  ) { }

  private getCompressionOptions(): any {
    const level = (this.localStorage.getItem("imageCompressionLevel") || "medium") as keyof typeof COMPRESSION_OPTIONS_MAP;
    const opt = COMPRESSION_OPTIONS_MAP[level];
    if (typeof opt === "object" && "skip" in opt && (opt as any).skip) return null;
    return { ...opt, preserveExif: false };
  }

  // 公開メソッドとして追加（FileUploadManagerからアクセス可能にする）
  public hasCompressionSettings(): boolean {
    return this.getCompressionOptions() !== null;
  }

  async compress(file: File): Promise<{ file: File; wasCompressed: boolean; wasSkipped?: boolean }> {
    if (!file.type.startsWith("image/")) return { file, wasCompressed: false };
    if (file.size <= 20 * 1024) return { file, wasCompressed: false, wasSkipped: true };
    const options = this.getCompressionOptions();
    if (!options) return { file, wasCompressed: false, wasSkipped: true };

    let usedOptions: any = { ...options };
    if (usedOptions.fileType === "image/webp" && !(await this.mimeSupport.canEncodeWebpWithQuality())) {
      delete usedOptions.fileType;
    }
    let targetMime: string = usedOptions.fileType || file.type;
    if (usedOptions.fileType && !this.mimeSupport.canEncodeMimeType(usedOptions.fileType)) {
      delete usedOptions.fileType;
      targetMime = file.type;
    }
    if (!this.mimeSupport.canEncodeMimeType(targetMime)) return { file, wasCompressed: false, wasSkipped: true };

    try {
      const compressed = await imageCompression(file, usedOptions);
      if ((compressed as File).size >= file.size) return { file, wasCompressed: false };
      const outType = (compressed as File).type || targetMime || file.type;
      const outName = renameByMimeType(file.name, outType);
      const outFile = new File([compressed], outName, { type: outType });

      showCompressedImagePreview(outFile);
      return { file: outFile, wasCompressed: true };
    } catch {
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
export class FileUploadManager {
  private compressionService: CompressionService;
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
    compressionService?: CompressionService,
    mimeSupport?: MimeTypeSupportInterface
  ) {
    this.mimeSupport = mimeSupport || new MimeTypeSupport(dependencies.document);
    this.compressionService = compressionService || new ImageCompressionService(this.mimeSupport, dependencies.localStorage);
    this.authService = authService || new NostrAuthService();
  }

  validateImageFile(file: File): FileValidationResult {
    if (!file.type.startsWith("image/")) return { isValid: false, errorMessage: "only_images_allowed" };
    if (file.size > MAX_FILE_SIZE) return { isValid: false, errorMessage: "file_too_large" };
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
    metadata?: Record<string, string | number | undefined>
  ): Promise<FileUploadResponse> {
    try {
      if (!file) return { success: false, error: "No file selected" };

      let ox: string | undefined = undefined;
      try {
        ox = await calculateSHA256Hex(file, this.dependencies.crypto);
      } catch (e) {
        ox = undefined;
      }

      const originalSize = file.size;
      const { file: uploadFile, wasCompressed, wasSkipped } = await this.compressionService.compress(file);
      const compressedSize = uploadFile.size;

      // 型安全にアクセス
      const hasCompressionSettings = (this.compressionService as ImageCompressionService).hasCompressionSettings();
      const sizeInfo = createFileSizeInfo(
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

      if (devMode) {
        try {
          const entries: any[] = [];
          for (const entry of (formData as any).entries()) {
            const [k, v] = entry;
            if (v instanceof File) {
              entries.push({ key: k, filename: v.name, size: v.size, type: v.type });
            } else {
              entries.push({ key: k, value: String(v) });
            }
          }
          // 修正: previewモード判定を追加
          const isPreview = window.location.port === "4173" || window.location.hostname === "localhost";
          const modeLabel = isPreview ? "[preview]" : "[dev]";
          console.log(`${modeLabel} FormData to be sent to server:`, entries);
          console.log(`${modeLabel} Upload endpoint:`, finalUrl);
        } catch (e) {
          console.log("[dev] Failed to enumerate FormData for debug", e);
        }
      }

      // fetchリクエストの詳細ログを追加
      if (devMode) {
        const isPreview = window.location.port === "4173" || window.location.hostname === "localhost";
        const modeLabel = isPreview ? "[preview]" : "[dev]";
        console.log(`${modeLabel} Making fetch request:`, {
          url: finalUrl,
          method: 'POST',
          hasAuth: !!authHeader,
          formDataSize: uploadFile.size
        });
      }

      const response = await this.dependencies.fetch(finalUrl, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
      });

      if (devMode) {
        const isPreview = window.location.port === "4173" || window.location.hostname === "localhost";
        const modeLabel = isPreview ? "[preview]" : "[dev]";
        console.log(`${modeLabel} Fetch response received:`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          ok: response.ok
        });
      }

      await debugLogUploadResponse(response);

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
      return { success: false, error: data.message || 'Could not extract URL from response', sizeInfo, nip94: Object.keys(parsedNip94).length ? parsedNip94 : null };
    } catch (error) {
      if (devMode) {
        console.error("[dev] Upload error:", error);
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
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
    metadataList?: Array<Record<string, string | number | undefined> | undefined>
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
        const meta = metadataList ? metadataList[index] : undefined;
        const result = await this.uploadFile(file, apiUrl, devMode, meta);
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

  async uploadFileWithCallbacks(
    file: File,
    apiUrl: string = DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks,
    devMode: boolean = false,
    metadata?: Record<string, string | number | undefined>
  ): Promise<FileUploadResponse> {
    callbacks?.onProgress?.({ completed: 0, failed: 0, total: 1, inProgress: true });
    try {
      const result = await this.uploadFile(file, apiUrl, devMode, metadata);
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

  async uploadMultipleFilesWithCallbacks(
    files: File[],
    apiUrl: string = DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks,
    metadataList?: Array<Record<string, string | number | undefined> | undefined>
  ): Promise<FileUploadResponse[]> {
    if (!files?.length) return [];
    const results = await this.uploadMultipleFiles(
      files,
      apiUrl,
      callbacks?.onProgress,
      import.meta.env.MODE === "development",
      metadataList
    );
    const firstSuccess = results.find(r => r.success && r.sizeInfo);
    if (firstSuccess?.sizeInfo) {
      const displayInfo = generateSizeDisplayInfo(firstSuccess.sizeInfo);
      if (displayInfo) showImageSizeInfo(displayInfo);
    }
    return results;
  }


  // Service Worker から画像データを取得するためのインスタンスメソッド
  private createSWMessagePromise(useShareTarget: boolean): Promise<SharedImageData | null> {
    return new Promise((resolve) => {
      if (!this.dependencies.navigator?.serviceWorker?.controller) return resolve(null);
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data && event.data.image) {
          resolve(event.data as SharedImageData);
        } else {
          resolve(null);
        }
      };
      this.dependencies.navigator.serviceWorker.controller.postMessage(
        { type: useShareTarget ? "getSharedImage" : "getSharedImageFallback" },
        [channel.port2]
      );
      // 応答がない場合のタイムアウト
      setTimeout(() => resolve(null), 3000);
    });
  }

  // --- Service Worker から共有画像を取得 ---
  async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (this.dependencies.localStorage.getItem("sharedImageProcessed") === "1") return null;
    if (!this.dependencies.navigator?.serviceWorker?.controller) return null;
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

  // --- 共有画像処理 ---
  public checkIfOpenedFromShare(): boolean {
    if (!this.dependencies.window?.location) return false;
    return new URLSearchParams(this.dependencies.window.location.search).get('shared') === 'true';
  }

  public async processSharedImage(): Promise<FileUploadResponse | null> {
    const sharedData = await this.getSharedImageFromServiceWorker();
    if (!sharedData?.image) return null;

    try {
      // sharedData.imageは既にFileオブジェクトなので直接使用
      const file = sharedData.image;

      // ファイルをアップロード
      return await this.uploadFile(file);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  // 後方互換性のためのstatic メソッド
  static async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    const manager = new FileUploadManager();
    return await manager.getSharedImageFromServiceWorker();
  }

  static checkIfOpenedFromShare(): boolean {
    return new URLSearchParams(window.location.search).get('shared') === 'true';
  }

  static async processSharedImage(): Promise<FileUploadResponse | null> {
    const manager = new FileUploadManager();
    return await manager.processSharedImage();
  }
}

// getSharedImageFromServiceWorker: 別名エクスポート用（後方互換性）
export async function getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
  return await FileUploadManager.getSharedImageFromServiceWorker();
}

