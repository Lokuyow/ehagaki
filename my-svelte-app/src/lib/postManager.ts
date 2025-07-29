import { createRxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";
import { firstValueFrom } from "rxjs";
import { keyManager } from "./keyManager";

// 投稿状態の型定義
export interface PostStatus {
  sending: boolean;
  success: boolean;
  error: boolean;
  message: string;
}

export class PostManager {
  private rxNostr: ReturnType<typeof createRxNostr>;

  constructor(rxNostr: ReturnType<typeof createRxNostr>) {
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

  // 投稿を送信する
  async submitPost(content: string, postStatus: PostStatus): Promise<boolean> {
    const validation = this.validatePost(content);
    if (!validation.valid) {
      postStatus.error = true;
      postStatus.message = validation.error!;
      return false;
    }

    try {
      postStatus.sending = true;
      postStatus.success = false;
      postStatus.error = false;

      // 秘密鍵を取得
      const storedKey = keyManager.loadFromStorage();

      if (!storedKey) {
        postStatus.error = true;
        postStatus.message = "key_not_found";
        return false;
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
      await firstValueFrom(this.rxNostr.send(event, { signer }));

      // 送信成功 - オブジェクトを完全に置き換えて更新
      Object.assign(postStatus, {
        sending: false,
        success: true,
        error: false,
        message: "post_success"
      });

      return true;

    } catch (err) {
      // 送信エラー
      postStatus.error = true;
      postStatus.message = "post_error";
      console.error("投稿エラー:", err);
      return false;
    } finally {
      postStatus.sending = false;
    }
  }
}
