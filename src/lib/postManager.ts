import type { RxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { keyManager } from "./keyManager";
import { authState } from "../stores/appStore.svelte";
import { hashtagDataStore, getHashtagDataSnapshot } from "../stores/tagsStore.svelte";
import { createImetaTag } from "./tags/imetaTag";
import { getClientTag } from "./tags/clientTag";
import { extractContentWithImages } from "../lib/utils/editorUtils";
import { extractImageBlurhashMap, getMimeTypeFromUrl } from "../lib/tags/imetaTag";
import { resetEditorState, resetPostStatus } from "../stores/editorStore.svelte";
import type { PostResult, PostManagerDeps, HashtagStore } from "./types";
import { iframeMessageService } from "./iframeMessageService";

// --- 純粋関数（依存性なし） ---
export class PostValidator {
  static validatePost(content: string, isAuthenticated: boolean, hasRxNostr: boolean): { valid: boolean; error?: string } {
    if (!content.trim()) return { valid: false, error: "empty_content" };
    if (!hasRxNostr) return { valid: false, error: "nostr_not_ready" };
    if (!isAuthenticated) return { valid: false, error: "login_required" };
    return { valid: true };
  }
}

export class PostEventBuilder {
  static async buildEvent(
    content: string,
    hashtags: string[],
    tags: string[][],
    pubkey?: string,
    imageImetaMap?: Record<string, { m: string; blurhash?: string; dim?: string; alt?: string;[key: string]: any }>,
    createImetaTagFn?: (meta: any) => Promise<string[]>,
    getClientTagFn?: () => string[] | null
  ): Promise<any> {
    // 既にストアに tags が作られていればそれをコピー、なければ hashtags から小文字化して作成
    const eventTags: string[][] = Array.isArray(tags) && tags.length
      ? [...tags]
      : (Array.isArray(hashtags) ? hashtags.map((hashtag: string) => ['t', hashtag.toLowerCase()]) : []);

    // Client tag 追加
    if (getClientTagFn) {
      const clientTag = getClientTagFn();
      if (clientTag) {
        eventTags.push(clientTag);
      }
    }

    // 画像imetaタグ追加
    if (imageImetaMap && createImetaTagFn) {
      for (const [url, meta] of Object.entries(imageImetaMap)) {
        if (url && meta && meta.m) {
          const imetaTag = await createImetaTagFn({ url, ...meta });
          eventTags.push(imetaTag);
        }
      }
    }

    const event: any = {
      kind: 1,
      content,
      tags: eventTags,
      created_at: Math.floor(Date.now() / 1000)
    };

    if (pubkey) event.pubkey = pubkey;
    return event;
  }
}

// --- RxNostr送信処理の分離 ---
export class PostEventSender {
  constructor(
    private rxNostr: RxNostr,
    private console: Console
  ) { }

  sendEvent(event: any, signer?: any): Promise<PostResult> {
    return new Promise((resolve) => {
      let resolved = false;
      let hasSuccess = false;
      let subscription: any = null;

      const safeUnsubscribe = () => {
        try {
          subscription?.unsubscribe();
        } catch (e) {
          // ignore
        }
      };

      const observer = {
        next: (packet: any) => {
          this.console.log(`リレー ${packet.from} への送信結果:`, packet.ok ? "成功" : "失敗");
          if (packet.ok && !resolved) {
            hasSuccess = true;
            resolved = true;
            safeUnsubscribe();
            resolve({ success: true });
          }
        },
        error: (error: any) => {
          this.console.error("送信エラー:", error);
          if (!resolved) {
            resolved = true;
            safeUnsubscribe();
            resolve({ success: false, error: "post_error" });
          }
        },
        complete: () => {
          // すべて失敗した場合のみここでresolve
          if (!resolved && !hasSuccess) {
            resolved = true;
            safeUnsubscribe();
            resolve({ success: false, error: "post_error" });
          }
        }
      };

      subscription = this.rxNostr.send(event, signer ? { signer } : undefined).subscribe(observer);

      // 念のためタイムアウトも設定
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          safeUnsubscribe();
          resolve(hasSuccess ? { success: true } : { success: false, error: "post_error" });
        }
      }, 10000);
    });
  }
}

// --- メインのPostManager（依存性を組み合わせ） ---
export class PostManager {
  private rxNostr: RxNostr | null = null;
  private eventSender: PostEventSender | null = null;

  constructor(
    rxNostr?: RxNostr,
    private deps: PostManagerDeps = {}
  ) {
    if (rxNostr) {
      this.setRxNostr(rxNostr);
    }

    // デフォルト依存性の設定
    this.deps.console = deps.console || (typeof window !== 'undefined' ? window.console : {} as Console);
    this.deps.createImetaTagFn = deps.createImetaTagFn || createImetaTag;
    this.deps.getClientTagFn = deps.getClientTagFn || getClientTag;
    this.deps.seckeySignerFn = deps.seckeySignerFn || seckeySigner; // ★追加
    this.deps.extractContentWithImagesFn = deps.extractContentWithImagesFn || extractContentWithImages;
    this.deps.extractImageBlurhashMapFn = deps.extractImageBlurhashMapFn || extractImageBlurhashMap;
    this.deps.resetEditorStateFn = deps.resetEditorStateFn || resetEditorState;
    this.deps.resetPostStatusFn = deps.resetPostStatusFn || resetPostStatus;
    this.deps.iframeMessageService = deps.iframeMessageService || iframeMessageService;
  }

  setRxNostr(rxNostr: RxNostr) {
    this.rxNostr = rxNostr;
    this.eventSender = new PostEventSender(rxNostr, this.deps.console || console);
  }

  // 外部APIは変更なし（後方互換性のため）
  validatePost(content: string): { valid: boolean; error?: string } {
    const authStateStore = this.deps.authStateStore || { value: authState.value };
    return PostValidator.validatePost(
      content,
      authStateStore.value.isAuthenticated,
      !!this.rxNostr
    );
  }

  async submitPost(
    content: string,
    imageImetaMap?: Record<string, { m: string; blurhash?: string; dim?: string; alt?: string;[key: string]: any }>
  ): Promise<PostResult> {
    const validation = this.validatePost(content);
    if (!validation.valid) {
      // 投稿失敗をiframe親ウィンドウに通知
      this.deps.iframeMessageService?.notifyPostError(validation.error);
      return { success: false, error: validation.error };
    }

    if (!this.eventSender) {
      this.deps.iframeMessageService?.notifyPostError("nostr_not_ready");
      return { success: false, error: "nostr_not_ready" };
    }

    try {
      // 依存性から認証状態とストアを取得
      const authStateStore = this.deps.authStateStore || { value: authState.value };
      const hashtagStore = this.deps.hashtagStore || hashtagDataStore;
      const { hashtags, tags } = this.getHashtagArrays(hashtagStore);
      const keyMgr = this.deps.keyManager || keyManager;
      const windowObj = this.deps.window || (typeof window !== 'undefined' ? window : undefined);

      const auth = authStateStore.value;
      const isNostrLoginAuth = auth.type === 'nostr-login';

      // nostr-login認証の場合のみwindow.nostrを使用
      if (isNostrLoginAuth && keyMgr.isWindowNostrAvailable() && windowObj?.nostr) {
        try {
          const pubkey = auth.pubkey;
          if (!pubkey) {
            this.deps.iframeMessageService?.notifyPostError("pubkey_not_found");
            return { success: false, error: "pubkey_not_found" };
          }

          const event = await PostEventBuilder.buildEvent(
            content,
            hashtags,
            tags,
            pubkey,
            imageImetaMap,
            this.deps.createImetaTagFn,
            this.deps.getClientTagFn
          );

          // 型ガードで signEvent の存在を確認
          if (typeof (windowObj.nostr as any).signEvent === "function") {
            const signedEvent = await (windowObj.nostr as { signEvent: (event: any) => Promise<any> }).signEvent(event);
            this.deps.console?.log("署名済みイベント:", signedEvent);
            const result = await this.eventSender.sendEvent(signedEvent);
            // 投稿結果をiframe親ウィンドウに通知
            if (result.success) {
              this.deps.iframeMessageService?.notifyPostSuccess();
            } else {
              this.deps.iframeMessageService?.notifyPostError(result.error);
            }
            return result;
          } else {
            this.deps.iframeMessageService?.notifyPostError("nostr_sign_event_not_supported");
            return { success: false, error: "nostr_sign_event_not_supported" };
          }
        } catch (err) {
          this.deps.console?.error("window.nostrでの投稿エラー:", err);
          this.deps.iframeMessageService?.notifyPostError("post_error");
          return { success: false, error: "post_error" };
        }
      }

      // ローカルキーを使用（秘密鍵直入れの場合）
      const storedKey = keyMgr.getFromStore() || keyMgr.loadFromStorage();
      if (!storedKey) {
        this.deps.iframeMessageService?.notifyPostError("key_not_found");
        return { success: false, error: "key_not_found" };
      }

      const event = await PostEventBuilder.buildEvent(
        content,
        hashtags,
        tags,
        undefined,
        imageImetaMap,
        this.deps.createImetaTagFn,
        this.deps.getClientTagFn
      );

      const signer = this.deps.seckeySignerFn
        ? this.deps.seckeySignerFn(storedKey)
        : seckeySigner(storedKey);
      const result = await this.eventSender.sendEvent(event, signer);
      // 投稿結果をiframe親ウィンドウに通知
      if (result.success) {
        this.deps.iframeMessageService?.notifyPostSuccess();
      } else {
        this.deps.iframeMessageService?.notifyPostError(result.error);
      }
      return result;

    } catch (err) {
      this.deps.console?.error("投稿エラー:", err);
      this.deps.iframeMessageService?.notifyPostError("post_error");
      return { success: false, error: "post_error" };
    }
  }

  // テスト用の内部コンポーネントへのアクセス
  getEventSender(): PostEventSender | null {
    return this.eventSender;
  }

  private getHashtagArrays(store?: HashtagStore): { hashtags: string[]; tags: string[][] } {
    const resolvedStore = store || hashtagDataStore;

    const snapshotFn = this.deps.hashtagSnapshotFn;
    if (snapshotFn) {
      const snapshot = snapshotFn(resolvedStore);
      return {
        hashtags: Array.isArray(snapshot?.hashtags) ? [...snapshot.hashtags] : [],
        tags: Array.isArray(snapshot?.tags) ? snapshot.tags.map((tag) => [...tag]) : []
      };
    }

    if (resolvedStore === hashtagDataStore) {
      try {
        const snapshot = getHashtagDataSnapshot();
        return {
          hashtags: Array.isArray(snapshot?.hashtags) ? [...snapshot.hashtags] : [],
          tags: Array.isArray(snapshot?.tags) ? snapshot.tags.map((tag) => [...tag]) : []
        };
      } catch (error) {
        this.deps.console?.warn("hashtag_snapshot_failed", error);
      }
    }

    return {
      hashtags: Array.isArray(resolvedStore?.hashtags) ? [...resolvedStore.hashtags] : [],
      tags: Array.isArray(resolvedStore?.tags) ? resolvedStore.tags.map((tag) => [...tag]) : []
    };
  }

  // --- PostComponent 統合メソッド ---
  preparePostContent(editor: TipTapEditor): string {
    return this.deps.extractContentWithImagesFn!(editor) || "";
  }

  prepareImageBlurhashMap(editor: TipTapEditor, imageOxMap: Record<string, string>, imageXMap: Record<string, string>): Record<string, any> {
    const rawImageBlurhashMap = this.deps.extractImageBlurhashMapFn!(editor);
    const imageBlurhashMap: Record<string, any> = {};
    for (const [url, blurhash] of Object.entries(rawImageBlurhashMap)) {
      imageBlurhashMap[url] = {
        m: getMimeTypeFromUrl(url),
        blurhash,
        ox: imageOxMap[url],
        x: imageXMap[url],
      };
    }
    return imageBlurhashMap;
  }

  async performPostSubmission(
    editor: TipTapEditor,
    imageOxMap: Record<string, string>,
    imageXMap: Record<string, string>,
    onStart?: () => void,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    const postContent = this.preparePostContent(editor);
    const imageBlurhashMap = this.prepareImageBlurhashMap(editor, imageOxMap, imageXMap);

    onStart?.();

    try {
      const result = await this.submitPost(postContent, imageBlurhashMap);
      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error || "post_error");
      }
    } catch (error) {
      onError?.("post_error");
    }
  }

  private applyEmptyStateToEditor(editor: TipTapEditor): void {
    editor.chain().clearContent().run();
  }

  resetPostContent(editor: TipTapEditor): void {
    this.applyEmptyStateToEditor(editor);
    this.deps.resetEditorStateFn?.();
    this.deps.resetPostStatusFn?.();
  }

  clearContentAfterSuccess(editor: TipTapEditor): void {
    this.applyEmptyStateToEditor(editor);
  }
}
