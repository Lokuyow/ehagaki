import { createRxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
import { generateHashtagTags } from "./utils";
import { get } from "svelte/store";
import { authState } from "./stores";

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

  // 投稿内容の検証
  validatePost(content: string): { valid: boolean; error?: string } {
    if (!content.trim()) return { valid: false, error: "empty_content" };
    if (!this.rxNostr) return { valid: false, error: "nostr_not_ready" };
    const auth = get(authState);
    if (!auth.isAuthenticated) return { valid: false, error: "login_required" };
    return { valid: true };
  }

  // ハッシュタグを抽出してtタグを生成
  private extractHashtags(content: string): string[][] {
    return generateHashtagTags(content);
  }

  // 投稿イベント生成（共通化）
  private async buildEvent(content: string, pubkey?: string) {
    const tags = this.extractHashtags(content);
    const event: any = {
      kind: 1,
      content,
      tags,
      created_at: Math.floor(Date.now() / 1000)
    };
    if (pubkey) event.pubkey = pubkey;
    return event;
  }

  // 投稿送信（共通化）
  private sendEvent(event: any, signer?: any): Promise<PostResult> {
    if (!this.rxNostr) return Promise.resolve({ success: false, error: "nostr_not_ready" });
    return new Promise((resolve) => {
      let resolved = false;
      let hasSuccess = false;
      const sendObservable = this.rxNostr!.send(event, signer ? { signer } : undefined);
      const subscription = sendObservable.subscribe({
        next: (packet: any) => {
          console.log(`リレー ${packet.from} への送信結果:`, packet.ok ? "成功" : "失敗");
          if (packet.ok && !resolved) {
            hasSuccess = true;
            resolved = true;
            subscription.unsubscribe();
            resolve({ success: true });
          }
        },
        error: (error: any) => {
          console.error("送信エラー:", error);
          if (!resolved) {
            resolved = true;
            subscription.unsubscribe();
            resolve({ success: false, error: "post_error" });
          }
        },
        complete: () => {
          // すべて失敗した場合のみここでresolve
          if (!resolved && !hasSuccess) {
            resolved = true;
            subscription.unsubscribe();
            resolve({ success: false, error: "post_error" });
          }
        }
      });
      // 念のためタイムアウトも設定
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          subscription.unsubscribe();
          resolve(hasSuccess ? { success: true } : { success: false, error: "post_error" });
        }
      }, 3000);
    });
  }

  // 投稿を送信する（純粋な投稿処理のみ）
  async submitPost(content: string): Promise<PostResult> {
    const validation = this.validatePost(content);
    if (!validation.valid) return { success: false, error: validation.error };

    try {
      // ストアから認証状態を取得
      const auth = get(authState);
      const isNostrLoginAuth = auth.type === 'nostr-login';

      // nostr-login認証の場合のみwindow.nostrを使用
      if (isNostrLoginAuth && keyManager.isWindowNostrAvailable()) {
        try {
          // 公開鍵を取得
          const pubkey = await keyManager.getPublicKeyFromWindowNostr();
          if (!pubkey) return { success: false, error: "pubkey_not_found" };
          const event = await this.buildEvent(content, pubkey);
          const signedEvent = await (window.nostr as any).signEvent(event);
          console.log("署名済みイベント:", signedEvent);
          return await this.sendEvent(signedEvent);
        } catch (err) {
          console.error("window.nostrでの投稿エラー:", err);
          return { success: false, error: "post_error" };
        }
      }

      // ローカルキーを使用（秘密鍵直入れの場合）
      const storedKey = keyManager.loadFromStorage();
      if (!storedKey) return { success: false, error: "key_not_found" };
      const event = await this.buildEvent(content);
      const signer = seckeySigner(storedKey);
      return await this.sendEvent(event, signer);

    } catch (err) {
      console.error("投稿エラー:", err);
      return { success: false, error: "post_error" };
    }
  }
}
