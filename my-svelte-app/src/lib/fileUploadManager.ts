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

/**
 * ファイルアップロード専用マネージャークラス
 * 責務: ファイルの圧縮・アップロード処理、共有画像処理
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

