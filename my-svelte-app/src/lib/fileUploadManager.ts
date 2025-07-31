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
  // 新しいプロパティ: サイズ比較情報
  compressionRatio?: number;
  sizeReduction?: string;
}

// 複数ファイルアップロードの進捗情報型
export interface MultipleUploadProgress {
  completed: number;
  failed: number;
  total: number;
}

// 新しい型定義: 情報通知用のコールバック
export interface UploadInfoCallbacks {
  onSizeInfo?: (info: string, visible: boolean) => void;
  onProgress?: (progress: MultipleUploadProgress) => void;
}

// 新しい型定義: サイズ情報
export interface SizeInfo {
  compressionRatio: number;
  sizeReduction: string;
  wasCompressed: boolean;
}

/**
 * ファイルアップロード専用マネージャークラス
 * 責務: ファイルの圧縮・アップロード処理、共有画像処理、情報管理
 */
export class FileUploadManager {
  private static readonly DEFAULT_API_URL = "https://nostrcheck.me/api/v2/media";

  /**
   * NIP-98形式の認証イベントを作成
   */
  private static async createAuthEvent(url: string, method: string): Promise<any> {
    const storedKey = keyManager.loadFromStorage();
    if (!storedKey) {
      throw new Error('No stored key found');
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

    const signedEvent = await signer.signEvent(event);
    return signedEvent;
  }

  /**
   * サイズ情報を生成する静的メソッド
   */
  public static generateSizeInfo(result: FileUploadResponse): string | null {
    if (result.wasCompressed && result.sizeReduction && result.compressionRatio) {
      return `データサイズ:<br>${result.sizeReduction} （${result.compressionRatio}%）`;
    }
    return null;
  }

  /**
   * 複数ファイルを並列アップロード
   */
  public static async uploadMultipleFiles(
    files: File[],
    apiUrl: string = FileUploadManager.DEFAULT_API_URL,
    onProgress?: (progress: MultipleUploadProgress) => void
  ): Promise<FileUploadResponse[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const results: FileUploadResponse[] = [];
    let completed = 0;
    let failed = 0;

    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await this.uploadFile(file, apiUrl);
        results[index] = result;

        if (result.success) {
          completed++;
        } else {
          failed++;
        }

        if (onProgress) {
          onProgress({
            completed,
            failed,
            total: files.length
          });
        }

        return result;
      } catch (error) {
        const errorResult: FileUploadResponse = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
        results[index] = errorResult;
        failed++;

        if (onProgress) {
          onProgress({
            completed,
            failed,
            total: files.length
          });
        }

        return errorResult;
      }
    });

    await Promise.all(uploadPromises);
    return results;
  }

  /**
   * ファイルをアップロード
   */
  public static async uploadFile(
    file: File,
    apiUrl: string = FileUploadManager.DEFAULT_API_URL
  ): Promise<FileUploadResponse> {
    try {
      if (!file) {
        return { success: false, error: "No file selected" };
      }

      // 元のファイル情報を記録
      const originalSize = file.size;
      const originalType = file.type;
      let wasCompressed = false;

      // 画像ファイルの場合はwebp変換＋リサイズ
      let uploadFile = file;
      if (file.type.startsWith("image/")) {
        try {
          const compressed = await imageCompression(file, {
            maxWidthOrHeight: 1024,
            fileType: "image/webp",
            initialQuality: 0.80,
            useWebWorker: true,
          });
          uploadFile = new File(
            [compressed],
            file.name.replace(/\.[^.]+$/, "") + ".webp",
            { type: "image/webp" }
          );
          wasCompressed = true;
        } catch (imgErr) {
          uploadFile = file;
        }
      }

      const compressedSize = uploadFile.size;
      const compressedType = uploadFile.type;

      // サイズ比較情報を計算
      const compressionRatio = originalSize > 0 ? Math.round((compressedSize / originalSize) * 100) : 100;
      const sizeReduction = `${Math.round(originalSize / 1024)}KB → ${Math.round(compressedSize / 1024)}KB`;

      // ローカルストレージから直接取得して優先的に使用
      const savedEndpoint = localStorage.getItem("uploadEndpoint");
      const finalUrl = savedEndpoint || apiUrl || FileUploadManager.DEFAULT_API_URL;

      const authEvent = await this.createAuthEvent(finalUrl, "POST");
      const authHeader = `Nostr ${btoa(JSON.stringify(authEvent))}`;

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('uploadtype', 'media');

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Upload failed: ${response.status} ${errorText}`,
          originalSize,
          compressedSize,
          originalType,
          compressedType,
          wasCompressed,
          compressionRatio,
          sizeReduction
        };
      }

      const data = await response.json();

      // NIP-96レスポンスからURLを取得
      if (data.status === 'success' && data.nip94_event?.tags) {
        const urlTag = data.nip94_event.tags.find((tag: string[]) => tag[0] === 'url');
        if (urlTag && urlTag[1]) {
          return {
            success: true,
            url: urlTag[1],
            originalSize,
            compressedSize,
            originalType,
            compressedType,
            wasCompressed,
            compressionRatio,
            sizeReduction
          };
        }
      }

      return {
        success: false,
        error: data.message || 'Could not extract URL from response',
        originalSize,
        compressedSize,
        originalType,
        compressedType,
        wasCompressed,
        compressionRatio,
        sizeReduction
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 複数ファイルを並列アップロード（コールバック対応版）
   */
  public static async uploadMultipleFilesWithCallbacks(
    files: File[],
    apiUrl: string = FileUploadManager.DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const results: FileUploadResponse[] = [];
    let completed = 0;
    let failed = 0;

    // 初期進捗を通知
    if (callbacks?.onProgress) {
      callbacks.onProgress({
        completed: 0,
        failed: 0,
        total: files.length
      });
    }

    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await this.uploadFile(file, apiUrl);
        results[index] = result;

        if (result.success) {
          completed++;

          // 最初の成功した結果からサイズ情報を生成
          if (completed === 1 && callbacks?.onSizeInfo) {
            const sizeInfo = this.generateSizeInfo(result);
            if (sizeInfo) {
              callbacks.onSizeInfo(sizeInfo, true);
            }
          }
        } else {
          failed++;
        }

        if (callbacks?.onProgress) {
          callbacks.onProgress({
            completed,
            failed,
            total: files.length
          });
        }

        return result;
      } catch (error) {
        const errorResult: FileUploadResponse = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
        results[index] = errorResult;
        failed++;

        if (callbacks?.onProgress) {
          callbacks.onProgress({
            completed,
            failed,
            total: files.length
          });
        }

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
    apiUrl: string = FileUploadManager.DEFAULT_API_URL,
    callbacks?: UploadInfoCallbacks
  ): Promise<FileUploadResponse> {
    // 進捗開始を通知
    if (callbacks?.onProgress) {
      callbacks.onProgress({
        completed: 0,
        failed: 0,
        total: 1
      });
    }

    try {
      const result = await this.uploadFile(file, apiUrl);

      // 結果に応じて進捗を更新
      if (callbacks?.onProgress) {
        callbacks.onProgress({
          completed: result.success ? 1 : 0,
          failed: result.success ? 0 : 1,
          total: 1
        });
      }

      // サイズ情報を通知
      if (result.success && callbacks?.onSizeInfo) {
        const sizeInfo = this.generateSizeInfo(result);
        if (sizeInfo) {
          callbacks.onSizeInfo(sizeInfo, true);
        }
      }

      return result;
    } catch (error) {
      // エラー時の進捗更新
      if (callbacks?.onProgress) {
        callbacks.onProgress({
          completed: 0,
          failed: 1,
          total: 1
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * サービスワーカーに保存されている共有画像を取得
   * @returns 共有された画像ファイルとメタデータ、またはnull
   */
  public static async getSharedImageFromServiceWorker(): Promise<{ image: File; metadata: any } | null> {
    // サービスワーカーがアクティブか確認
    if (!('serviceWorker' in navigator)) {
      return null;
    }

    // コントローラーがなければ登録を待つ
    if (!navigator.serviceWorker.controller) {
      try {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 5000); // タイムアウト時間を延長

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            clearTimeout(timeout);
            resolve();
          }, { once: true });
        });
      } catch (e) {
        // ...existing error handling...
      }
    }

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
   * ファイルタイプの検証
   */
  public static validateImageFile(file: File): { isValid: boolean; errorMessage?: string } {
    if (!file.type.startsWith("image/")) {
      return { isValid: false, errorMessage: "only_images_allowed" };
    }
    return { isValid: true };
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

