import type { RxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager";
import { authState } from "../stores/appStores.svelte";
import { hashtagDataStore } from "./tags/tagsStore.svelte";
import { createImetaTag } from "./tags/imetaTag";
import { getClientTag } from "./tags/clientTag";

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
  // 型を RxNostr に変更
  private rxNostr: RxNostr | null = null;

  // コンストラクタの型を RxNostr に変更
  constructor(rxNostr?: RxNostr) {
    if (rxNostr) {
      this.rxNostr = rxNostr;
    }
  }

  // setRxNostr の型を RxNostr に変更
  setRxNostr(rxNostr: RxNostr) {
    this.rxNostr = rxNostr;
  }

  // 投稿内容の検証
  validatePost(content: string): { valid: boolean; error?: string } {
    if (!content.trim()) return { valid: false, error: "empty_content" };
    if (!this.rxNostr) return { valid: false, error: "nostr_not_ready" };
    const auth = authState.value;
    if (!auth.isAuthenticated) return { valid: false, error: "login_required" };
    return { valid: true };
  }

  // 投稿イベント生成（共通化）
  private async buildEvent(content: string, pubkey?: string, imageImetaMap?: Record<string, { m: string; blurhash?: string; dim?: string; alt?: string;[key: string]: any }>) {
    // ストアからハッシュタグ／既存の tags を取得
    const { hashtags, tags: storedTags } = hashtagDataStore;
    // 既にストアに tags が作られていればそれをコピー、なければ hashtags から小文字化して作成
    const tags: string[][] = Array.isArray(storedTags) && storedTags.length
      ? [...storedTags]
      : (Array.isArray(hashtags) ? hashtags.map((hashtag: string) => ['t', hashtag.toLowerCase()]) : []);

    // Client tag は clientTag モジュールへ移譲
    const clientTag = getClientTag();
    if (clientTag) {
      tags.push(clientTag);
    }

    // 画像imetaタグ追加
    if (imageImetaMap) {
      for (const [url, meta] of Object.entries(imageImetaMap)) {
        if (url && meta && meta.m) {
          const imetaTag = await createImetaTag({ url, ...meta });
          tags.push(imetaTag);
        }
      }
    }
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
  async submitPost(content: string, imageImetaMap?: Record<string, { m: string; blurhash?: string; dim?: string; alt?: string;[key: string]: any }>): Promise<PostResult> {
    const validation = this.validatePost(content);
    if (!validation.valid) return { success: false, error: validation.error };

    try {
      // ストアから認証状態を取得
      const auth = authState.value;
      const isNostrLoginAuth = auth.type === 'nostr-login';

      // nostr-login認証の場合のみwindow.nostrを使用
      if (isNostrLoginAuth && keyManager.isWindowNostrAvailable()) {
        try {
          const pubkey = auth.pubkey;
          if (!pubkey) return { success: false, error: "pubkey_not_found" };

          const event = await this.buildEvent(content, pubkey, imageImetaMap);
          const signedEvent = await (window.nostr as any).signEvent(event);
          console.log("署名済みイベント:", signedEvent);
          return await this.sendEvent(signedEvent);
        } catch (err) {
          console.error("window.nostrでの投稿エラー:", err);
          return { success: false, error: "post_error" };
        }
      }

      // ローカルキーを使用（秘密鍵直入れの場合）
      const storedKey = keyManager.getFromStore() || keyManager.loadFromStorage();
      if (!storedKey) return { success: false, error: "key_not_found" };
      const event = await this.buildEvent(content, undefined, imageImetaMap);
      const signer = seckeySigner(storedKey);
      return await this.sendEvent(event, signer);

    } catch (err) {
      console.error("投稿エラー:", err);
      return { success: false, error: "post_error" };
    }
  }
}
