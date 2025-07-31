import { createRxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";
import { firstValueFrom } from "rxjs";
import { keyManager } from "./keyManager";

// 投稿結果の型定義
export interface PostResult {
  success: boolean;
  error?: string;
}

// 投稿状態の型定義（UIコンポーネント用）
export interface PostStatus {
  sending: boolean;
  success: boolean;
  error: boolean;
  message: string;
}

export class PostManager {
  private rxNostr: ReturnType<typeof createRxNostr> | null = null;

  constructor(rxNostr?: ReturnType<typeof createRxNostr>) {
    if (rxNostr) {
      this.rxNostr = rxNostr;
    }
  }

  // rxNostrインスタンスを更新するメソッド
  setRxNostr(rxNostr: ReturnType<typeof createRxNostr>) {
    this.rxNostr = rxNostr;
  }

  // 秘密鍵が含まれているかチェック
  containsSecretKey(content: string): boolean {
    return /nsec1[0-9a-zA-Z]+/.test(content);
  }

  // 投稿内容の検証
  validatePost(content: string): { valid: boolean; error?: string } {
    if (!content.trim()) {
      return { valid: false, error: "empty_content" };
    }

    if (!this.rxNostr) {
      return { valid: false, error: "nostr_not_ready" };
    }

    if (!keyManager.hasStoredKey()) {
      return { valid: false, error: "login_required" };
    }

    return { valid: true };
  }

  // 投稿を送信する（純粋な投稿処理のみ）
  async submitPost(content: string): Promise<PostResult> {
    const validation = this.validatePost(content);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      // 秘密鍵を取得
      const storedKey = keyManager.loadFromStorage();

      if (!storedKey) {
        return { success: false, error: "key_not_found" };
      }

      // 秘密鍵でsignerを作成
      const signer = seckeySigner(storedKey);

      // kind=1のテキスト投稿を作成
      const event = {
        kind: 1,
        content,
        tags: [] // 必要に応じてタグを追加可能
      };

      // 秘密鍵で署名してイベントを送信
      if (!this.rxNostr) {
        return { success: false, error: "nostr_not_ready" };
      }

      await firstValueFrom(this.rxNostr.send(event, { signer }));
      return { success: true };

    } catch (err) {
      console.error("投稿エラー:", err);
      return { success: false, error: "post_error" };
    }
  }
}
