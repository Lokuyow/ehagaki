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
            initialQuality: 1.0, // 品質100
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
}
