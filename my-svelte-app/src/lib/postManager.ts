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
    if (!content.trim()) {
      return { valid: false, error: "empty_content" };
    }

    if (!this.rxNostr) {
      return { valid: false, error: "nostr_not_ready" };
    }

    // ストアから認証状態をチェック
    const auth = get(authState);
    if (!auth.isAuthenticated) {
      return { valid: false, error: "login_required" };
    }

    return { valid: true };
  }

  // ハッシュタグを抽出してtタグを生成
  private extractHashtags(content: string): string[][] {
    return generateHashtagTags(content);
  }

  // 投稿を送信する（純粋な投稿処理のみ）
  async submitPost(content: string): Promise<PostResult> {
    const validation = this.validatePost(content);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      // ハッシュタグを抽出してtタグを生成
      const hashtagTags = this.extractHashtags(content);

      if (!this.rxNostr) {
        return { success: false, error: "nostr_not_ready" };
      }

      // ストアから認証状態を取得
      const auth = get(authState);
      const isNostrLoginAuth = auth.type === 'nostr-login';

      // nostr-login認証の場合のみwindow.nostrを使用
      if (isNostrLoginAuth && keyManager.isWindowNostrAvailable()) {
        try {
          // 公開鍵を取得
          const pubkey = await keyManager.getPublicKeyFromWindowNostr();
          if (!pubkey) {
            return { success: false, error: "pubkey_not_found" };
          }

          // kind=1のテキスト投稿を作成（window.nostr用）
          const event = {
            kind: 1,
            content,
            tags: hashtagTags,
            created_at: Math.floor(Date.now() / 1000),
            pubkey
          };

          const signedEvent = await (window.nostr as any).signEvent(event);
          console.log("署名済みイベント:", signedEvent);

          // rxNostr.send()を直接使用（応答待ちなし）
          const sendObservable = this.rxNostr.send(signedEvent);

          // Observableをすぐに購読して送信開始、結果は無視
          const subscription = sendObservable.subscribe({
            next: (packet: any) => {
              console.log(`リレー ${packet.from} への送信結果:`, packet.ok ? "成功" : "失敗");
            },
            error: (error: any) => {
              console.error("送信エラー:", error);
            },
            complete: () => {
              console.log("送信完了");
            }
          });

          // 購読をすぐに解除（送信は継続される）
          setTimeout(() => {
            subscription.unsubscribe();
          }, 100);

          console.log("イベントを送信しました（リレーへの送信開始）");
          return { success: true };
        } catch (err) {
          console.error("window.nostrでの投稿エラー:", err);
          return { success: false, error: "post_error" };
        }
      }

      // ローカルキーを使用（秘密鍵直入れの場合）
      const storedKey = keyManager.loadFromStorage();
      if (!storedKey) {
        return { success: false, error: "key_not_found" };
      }

      // kind=1のテキスト投稿を作成（ローカルキー用）
      const event = {
        kind: 1,
        content,
        tags: hashtagTags // ハッシュタグから生成したtタグを設定
      };

      // 秘密鍵でsignerを作成
      const signer = seckeySigner(storedKey);

      // 秘密鍵で署名してイベントを送信
      const sendObservable = this.rxNostr.send(event, { signer });

      // Observableをすぐに購読して送信開始
      const subscription = sendObservable.subscribe({
        next: (packet: any) => {
          console.log(`リレー ${packet.from} への送信結果:`, packet.ok ? "成功" : "失敗");
        },
        error: (error: any) => {
          console.error("送信エラー:", error);
        },
        complete: () => {
          console.log("送信完了");
        }
      });

      // 購読をすぐに解除（送信は継続される）
      setTimeout(() => {
        subscription.unsubscribe();
      }, 100);

      console.log("イベントを送信しました（リレーへの送信開始）");
      return { success: true };

    } catch (err) {
      console.error("投稿エラー:", err);
      return { success: false, error: "post_error" };
    }
  }
}
