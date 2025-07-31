import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
import imageCompression from "browser-image-compression";

// ファイルアップロードの応答型
export interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
  originalType?: string;
  compressedType?: string;
  wasCompressed?: boolean;
  compressionRatio?: number;
  sizeReduction?: string;
}

// 複数ファイルアップロードの進捗情報型
export interface MultipleUploadProgress {
  completed: number;
  failed: number;
  total: number;
  inProgress: boolean;
}

// 情報通知用のコールバック
export interface UploadInfoCallbacks {
  onSizeInfo?: (info: string, visible: boolean) => void;
  onProgress?: (progress: MultipleUploadProgress) => void;
}

// ファイル検証結果型
export interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * ファイルアップロード専用マネージャークラス
 * 責務: ファイルの圧縮・アップロード処理、進捗管理
 */
export class FileUploadManager {
  private static readonly DEFAULT_API_URL = "https://nostrcheck.me/api/v2/media";
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly COMPRESSION_OPTIONS = {
    maxWidthOrHeight: 1024,
    fileType: "image/webp" as const,
    initialQuality: 0.80,
    useWebWorker: true,
  };

  /**
   * NIP-98形式の認証イベントを作成
   */
  private static async createAuthEvent(url: string, method: string): Promise<any> {
    const storedKey = keyManager.loadFromStorage();
    if (!storedKey) {
      throw new Error('Authentication required');
    }

    const signer = seckeySigner(storedKey);
    const event = {
      kind: 27235,
      created_at: Math.floor(Date.now() / 1000),
      content: "",
      tags: [
        ["u", url],
        ["method", method]
      ]
    };

    return await signer.signEvent(event);
  }

  /**
   * 画像ファイルを圧縮
   */
  private static async compressImage(file: File): Promise<{ file: File; wasCompressed: boolean }> {
    if (!file.type.startsWith("image/")) {
      return { file, wasCompressed: false };
    }

    try {
      const compressed = await imageCompression(file, this.COMPRESSION_OPTIONS);
      const compressedFile = new File(
        [compressed],
        file.name.replace(/\.[^.]+$/, "") + ".webp",
        { type: "image/webp" }
      );
      return { file: compressedFile, wasCompressed: true };
    } catch (error) {
      console.warn('画像圧縮に失敗しました:', error);
      return { file, wasCompressed: false };
    }
  }

  /**
   * サイズ情報を生成
   */
  public static generateSizeInfo(result: FileUploadResponse): string | null {
    if (result.wasCompressed && result.sizeReduction && result.compressionRatio) {
      return `データサイズ:<br>${result.sizeReduction} （${result.compressionRatio}%）`;
    }
    return null;
  }

  /**
   * ファイルタイプの検証
   */
  public static validateImageFile(file: File): FileValidationResult {
    if (!file.type.startsWith("image/")) {
      return { isValid: false, errorMessage: "only_images_allowed" };
    }
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, errorMessage: "file_too_large" };
    }
    return { isValid: true };
  }

  /**
   * 単一ファイルをアップロード
   */
  public static async uploadFile(
    file: File,
    apiUrl: string = this.DEFAULT_API_URL
  ): Promise<FileUploadResponse> {
    try {
      if (!file) {
        return { success: false, error: "No file selected" };
      }

      // 元のファイル情報を記録
      const originalSize = file.size;
      const originalType = file.type;

      // 画像圧縮
      const { file: uploadFile, wasCompressed } = await this.compressImage(file);
      const compressedSize = uploadFile.size;
      const compressedType = uploadFile.type;

      // サイズ比較情報を計算
      const compressionRatio = originalSize > 0 ? Math.round((compressedSize / originalSize) * 100) : 100;
      const sizeReduction = `${Math.round(originalSize / 1024)}KB → ${Math.round(compressedSize / 1024)}KB`;

      // アップロード先URLの決定
      const savedEndpoint = localStorage.getItem("uploadEndpoint");
      const finalUrl = savedEndpoint || apiUrl;

      // 認証とアップロード実行
      const authEvent = await this.createAuthEvent(finalUrl, "POST");
      const authHeader = `Nostr ${btoa(JSON.stringify(authEvent))}`;

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('uploadtype', 'media');

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
      });

      const baseResponse = {
        originalSize,
        compressedSize,
        originalType,
        compressedType,
        wasCompressed,
        compressionRatio,
        sizeReduction
      };

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Upload failed: ${response.status} ${errorText}`,
          ...baseResponse
        };
      }

      const data = await response.json();

      // NIP-96レスポンスからURLを取得
      if (data.status === 'success' && data.nip94_event?.tags) {
        const urlTag = data.nip94_event.tags.find((tag: string[]) => tag[0] === 'url');
        if (urlTag?.[1]) {
          return {
            success: true,
            url: urlTag[1],
            ...baseResponse
          };
        }
      }

      return {
        success: false,
        error: data.message || 'Could not extract URL from response',
        ...baseResponse
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 複数ファイルを並列アップロード
   */
  public static async uploadMultipleFiles(
    files: File[],
    apiUrl: string = this.DEFAULT_API_URL,
    onProgress?: (progress: MultipleUploadProgress) => void
  ): Promise<FileUploadResponse[]> {
    if (!files?.length) return [];

    const results: FileUploadResponse[] = new Array(files.length);
    let completed = 0;
    let failed = 0;

    const updateProgress = () => {
      onProgress?.({
        completed,
        failed,
        total: files.length,
        inProgress: completed + failed < files.length
      });
    };

    // 初期進捗を通知
    updateProgress();

    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await this.uploadFile(file, apiUrl);
        results[index] = result;

        if (result.success) {
          completed++;
        } else {
          failed++;
        }

        updateProgress();
        return result;
      } catch (error) {
        const errorResult: FileUploadResponse = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
        results[index] = errorResult;
        failed++;
        updateProgress();
        return errorResult;
      }
    });

    await Promise.all(uploadPromises);
    return results;
  }

  /**
   * 単一ファイルアップロード（コールバック対応版）
   */
  public static async uploadFileWithCallbacks(
    file: File,
    apiUrl: string = this.DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse> {
    // 進捗開始を通知
    callbacks?.onProgress?.({
      completed: 0,
      failed: 0,
      total: 1,
      inProgress: true
    });

    try {
      const result = await this.uploadFile(file, apiUrl);

      // 進捗完了を通知
      callbacks?.onProgress?.({
        completed: result.success ? 1 : 0,
        failed: result.success ? 0 : 1,
        total: 1,
        inProgress: false
      });

      // サイズ情報を通知
      if (result.success && callbacks?.onSizeInfo) {
        const sizeInfo = this.generateSizeInfo(result);
        if (sizeInfo) {
          callbacks.onSizeInfo(sizeInfo, true);
        }
      }

      return result;
    } catch (error) {
      callbacks?.onProgress?.({
        completed: 0,
        failed: 1,
        total: 1,
        inProgress: false
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 複数ファイルアップロード（コールバック対応版）
   */
  public static async uploadMultipleFilesWithCallbacks(
    files: File[],
    apiUrl: string = this.DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse[]> {
    if (!files?.length) return [];

    const results = await this.uploadMultipleFiles(files, apiUrl, callbacks?.onProgress);

    // 最初の成功した結果からサイズ情報を生成
    const firstSuccess = results.find(r => r.success);
    if (firstSuccess && callbacks?.onSizeInfo) {
      const sizeInfo = this.generateSizeInfo(firstSuccess);
      if (sizeInfo) {
        callbacks.onSizeInfo(sizeInfo, true);
      }
    }

    return results;
  }

  /**
   * ServiceWorkerから共有画像を取得
   */
  public static async getSharedImageFromServiceWorker(): Promise<{ image: File; metadata: any } | null> {

    if (!navigator.serviceWorker.controller) {
      return null;
    }

    try {
      // 両方の方法を試す

      // 1. MessageChannelを使用する方法
      const messageChannelPromise = (async () => {
        const messageChannel = new MessageChannel();

        const promise = new Promise<{ image: File; metadata: any } | null>((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data?.type === 'SHARED_IMAGE' && event.data?.data?.image) {
              resolve({
                image: event.data.data.image,
                metadata: event.data.data.metadata || {}
              });
            } else {
              resolve(null);
            }
          };

          // タイムアウト設定
          setTimeout(() => resolve(null), 3000);
        });

        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage(
            { action: 'getSharedImage' },
            [messageChannel.port2]
          );
        } else {
          return null;
        }

        return promise;
      })();

      // 2. 通常のメッセージイベントリスナーを使用する方法
      const eventListenerPromise = (async () => {
        const promise = new Promise<{ image: File; metadata: any } | null>((resolve) => {
          const handler = (event: MessageEvent) => {
            navigator.serviceWorker.removeEventListener('message', handler);

            if (event.data?.type === 'SHARED_IMAGE' && event.data?.data?.image) {
              resolve({
                image: event.data.data.image,
                metadata: event.data.data.metadata || {}
              });
            } else {
              resolve(null);
            }
          };

          navigator.serviceWorker.addEventListener('message', handler);

          // タイムアウト設定
          setTimeout(() => {
            navigator.serviceWorker.removeEventListener('message', handler);
            resolve(null);
          }, 3000);
        });

        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ action: 'getSharedImage' });
        } else {
          return null;
        }

        return promise;
      })();

      // タイムアウト設定
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 5000);
      });

      // どれか一つが結果を返すのを待つ
      const result = await Promise.race([
        messageChannelPromise,
        eventListenerPromise,
        timeoutPromise
      ]);

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * URLパラメータから共有フラグを確認
   * @returns 共有からの起動かどうか
   */
  public static checkIfOpenedFromShare(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('shared') && urlParams.get('shared') === 'true';
  }

  /**
   * 共有画像の処理とアップロードを統合した便利メソッド
   */
  public static async processSharedImage(): Promise<FileUploadResponse | null> {
    const sharedData = await this.getSharedImageFromServiceWorker();
    if (!sharedData?.image) {
      return null;
    }

    return await this.uploadFile(sharedData.image);
  }
}

// getSharedImageFromServiceWorker: 別名エクスポート用（クラスのstaticメソッドを直接呼び出す）
export async function getSharedImageFromServiceWorker(): Promise<{ image: File; metadata: any } | null> {
  return await FileUploadManager.getSharedImageFromServiceWorker();
}

