import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
// 追加: 画像圧縮ライブラリ
import imageCompression from "browser-image-compression";

// ファイルアップロードの応答型
export interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  originalSize?: number;     // 追加: 元のファイルサイズ
  compressedSize?: number;   // 追加: 圧縮後のファイルサイズ
  originalType?: string;     // 追加: 元のファイル種類
  compressedType?: string;   // 追加: 圧縮後のファイル種類
  wasCompressed?: boolean;   // 追加: 圧縮されたかどうか
}

// ファイルアップロードマネージャークラス
export class FileUploadManager {
  // デフォルトAPIエンドポイント
  private static readonly DEFAULT_API_URL = "https://nostrcheck.me/api/v2/media";
  
  // NIP-98形式の認証イベントを作成
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
  
  // ファイルをアップロード
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
            initialQuality: 0.80, // 品質80
            useWebWorker: true,
          });
          // ファイル名をwebp拡張子に変更
          uploadFile = new File(
            [compressed],
            file.name.replace(/\.[^.]+$/, "") + ".webp",
            { type: "image/webp" }
          );
          wasCompressed = true;
        } catch (imgErr) {
          console.error("Image compression error:", imgErr);
          // 圧縮失敗時は元ファイルをそのまま使う
          uploadFile = file;
        }
      }
      
      // 圧縮後のファイル情報
      const compressedSize = uploadFile.size;
      const compressedType = uploadFile.type;
      
      // ローカルストレージから直接取得して優先的に使用
      const savedEndpoint = localStorage.getItem("uploadEndpoint");
      const finalUrl = savedEndpoint || apiUrl || FileUploadManager.DEFAULT_API_URL;
      
      console.log('Upload process:', {
        savedInStorage: savedEndpoint,
        passedUrl: apiUrl,
        usingUrl: finalUrl
      });
      
      const authEvent = await this.createAuthEvent(
        finalUrl, 
        "POST"
      );
      
      // Base64エンコード
      const authHeader = `Nostr ${btoa(JSON.stringify(authEvent))}`;
      
      const formData = new FormData();
      formData.append('file', uploadFile);
      // uploadtypeをmediaに設定（NIP-96準拠）
      formData.append('uploadtype', 'media');
      
      console.log('Uploading file to:', finalUrl);
      
      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        },
        body: formData
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        return { 
          success: false, 
          error: `Upload failed: ${response.status} ${errorText}`,
          originalSize,
          compressedSize,
          originalType,
          compressedType,
          wasCompressed 
        };
      }
      
      const data = await response.json();
      console.log('Upload response data:', data);
      
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
            wasCompressed
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
        wasCompressed
      };
    } catch (error) {
      console.error("File upload error:", error);
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
  public static async getSharedImageFromServiceWorker(): Promise<{image: File, metadata: any} | null> {
    // サービスワーカーがアクティブか確認
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workerがサポートされていません');
      return null;
    }
    
    // コントローラーがなければ登録を待つ
    if (!navigator.serviceWorker.controller) {
      console.log('Service Workerコントローラーがありません、登録を待ちます');
      try {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 5000); // タイムアウト時間を延長
          
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            clearTimeout(timeout);
            resolve();
          }, { once: true });
        });
      } catch (e) {
        console.error('Service Worker登録待機エラー:', e);
      }
    }
    
    if (!navigator.serviceWorker.controller) {
      console.log('Service Workerコントローラーが取得できませんでした');
      return null;
    }
    
    try {
      // 両方の方法を試す
    
      // 1. MessageChannelを使用する方法
      const messageChannelPromise = (async () => {
        const messageChannel = new MessageChannel();
        
        const promise = new Promise<{image: File, metadata: any} | null>((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            console.log('MessageChannel: 応答を受信', event.data);
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
        const promise = new Promise<{image: File, metadata: any} | null>((resolve) => {
          const handler = (event: MessageEvent) => {
            console.log('EventListener: 応答を受信', event.data);
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
      
      console.log('共有画像取得結果:', result ? '成功' : '失敗');
      return result;
    } catch (error) {
      console.error('共有画像の取得中にエラーが発生しました:', error);
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
}

// getSharedImageFromServiceWorker: 別名エクスポート用（クラスのstaticメソッドを直接呼び出す）
export async function getSharedImageFromServiceWorker(): Promise<{image: File, metadata: any} | null> {
  return await FileUploadManager.getSharedImageFromServiceWorker();
}

