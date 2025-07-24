import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";

// ファイルアップロードの応答型
export interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// ファイルアップロードマネージャークラス
export class FileUploadManager {
  // 修正: 正しいAPIエンドポイントを使用
  private static readonly NOSTRCHECK_API_URL = "https://nostrcheck.me/api/v2/media";
  
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
  public static async uploadFile(file: File): Promise<FileUploadResponse> {
    try {
      if (!file) {
        return { success: false, error: "No file selected" };
      }
      
      const authEvent = await this.createAuthEvent(
        this.NOSTRCHECK_API_URL, 
        "POST"
      );
      
      // Base64エンコード
      const authHeader = `Nostr ${btoa(JSON.stringify(authEvent))}`;
      
      const formData = new FormData();
      formData.append('file', file);
      // uploadtypeをmediaに設定（NIP-96準拠）
      formData.append('uploadtype', 'media');
      
      console.log('Uploading file to:', this.NOSTRCHECK_API_URL);
      
      const response = await fetch(this.NOSTRCHECK_API_URL, {
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
          error: `Upload failed: ${response.status} ${errorText}` 
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
            url: urlTag[1]
          };
        }
      }
      
      return {
        success: false,
        error: data.message || 'Could not extract URL from response'
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
