import type { RxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { keyManager } from "./keyManager.svelte";
import { authState } from "../stores/authStore.svelte";
import { mediaFreePlacementStore } from "../stores/uploadStore.svelte";
import { hashtagDataStore, getHashtagDataSnapshot, contentWarningStore, contentWarningReasonStore, hashtagPinStore } from "../stores/tagsStore.svelte";
import { createImetaTag } from "./tags/imetaTag";
import { getClientTag } from "./tags/clientTag";
import { extractContentWithImages } from "./utils/editorDocumentUtils";
import { extractImageBlurhashMap, getMimeTypeFromUrl } from "../lib/tags/imetaTag";
import { resetEditorState, resetPostStatus } from "../stores/editorStore.svelte";
import type { PostResult, PostManagerDeps, HashtagStore } from "./types";
import { iframeMessageService } from "./iframeMessageService";
import { saveHashtagsToHistory } from "./utils/hashtagHistory";
import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
import { trimTrailingNewlineAfterMedia, PostValidator, PostEventBuilder, PostEventSender } from "./postEventBuilder";
import { ReplyQuoteService } from "./replyQuoteService";
import { replyQuoteState, clearReplyQuote } from "../stores/replyQuoteStore.svelte";

// 後方互換性のためre-export
export { trimTrailingNewlineAfterMedia, PostValidator, PostEventBuilder, PostEventSender } from "./postEventBuilder";

type ImageImetaMap = Record<string, {
  m: string;
  blurhash?: string;
  dim?: string;
  alt?: string;
  [key: string]: any;
}>;

type ReplyQuoteNotifyOptions = {
  eventId?: string;
  replyToEventId?: string;
  quotedEventIds?: string[];
};

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
    this.deps.hashtagPinStore = deps.hashtagPinStore || hashtagPinStore;
    this.deps.saveHashtagsToHistoryFn = deps.saveHashtagsToHistoryFn || saveHashtagsToHistory;
  }

  setRxNostr(rxNostr: RxNostr) {
    this.rxNostr = rxNostr;
    this.eventSender = new PostEventSender(rxNostr, this.deps.console || console);
  }

  private clearReplyQuoteAfterSuccess(): void {
    const clearFn = this.deps.clearReplyQuoteFn || clearReplyQuote;
    clearFn();
  }

  private getReplyQuoteNotifyOptions(): ReplyQuoteNotifyOptions | undefined {
    const rqState = this.deps.replyQuoteState?.value ?? replyQuoteState.value;
    const quotedEventIds = Array.from(
      new Set(rqState.quotes.map((quote) => quote.eventId)),
    );

    if (!rqState.reply && quotedEventIds.length === 0) {
      return undefined;
    }

    return {
      ...(rqState.reply ? { replyToEventId: rqState.reply.eventId } : {}),
      ...(quotedEventIds.length > 0 ? { quotedEventIds } : {}),
    };
  }

  private notifyPostFailure(error: string): PostResult {
    this.deps.iframeMessageService?.notifyPostError(error);
    return { success: false, error };
  }

  private handleSubmissionError(logMessage: string, error: unknown): PostResult {
    this.deps.console?.error(logMessage, error);
    return this.notifyPostFailure('post_error');
  }

  private async buildSubmissionEvent(params: {
    processedContent: string;
    hashtags: string[];
    tags: string[][];
    pubkey?: string;
    imageImetaMap?: ImageImetaMap;
    contentWarningEnabled: boolean;
    contentWarningReason: string;
    replyQuoteTags?: string[][];
    channelContext?: import("./types").ChannelContextState | null;
  }): Promise<any> {
    return PostEventBuilder.buildEvent(
      params.processedContent,
      params.hashtags,
      params.tags,
      params.pubkey,
      params.imageImetaMap,
      this.deps.createImetaTagFn,
      this.deps.getClientTagFn,
      params.contentWarningEnabled,
      params.contentWarningReason,
      params.replyQuoteTags,
      params.channelContext,
    );
  }

  private finalizeSubmittedPost(
    result: PostResult,
    hashtags: string[],
    rqNotifyOptions?: ReplyQuoteNotifyOptions,
  ): PostResult {
    if (result.success) {
      this.deps.saveHashtagsToHistoryFn?.(hashtags);
      this.clearReplyQuoteAfterSuccess();
      this.deps.iframeMessageService?.notifyPostSuccess({
        ...rqNotifyOptions,
        ...(result.eventId ? { eventId: result.eventId } : {}),
      });
      return result;
    }

    this.deps.iframeMessageService?.notifyPostError(result.error);
    return result;
  }

  private async sendPreparedEvent(params: {
    event: any;
    hashtags: string[];
    rqNotifyOptions?: ReplyQuoteNotifyOptions;
    signer?: any;
    additionalWriteRelays?: string[];
    signEvent?: (event: any) => Promise<any>;
    logSignedEvent?: boolean;
  }): Promise<PostResult> {
    const eventToSend = params.signEvent
      ? await params.signEvent(params.event)
      : params.event;

    if (params.signEvent && params.logSignedEvent) {
      this.deps.console?.log('署名済みイベント:', eventToSend);
    }

    const result = await this.eventSender!.sendEvent(eventToSend, {
      signer: params.signer,
      additionalWriteRelays: params.additionalWriteRelays,
    });
    return this.finalizeSubmittedPost(
      result,
      params.hashtags,
      params.rqNotifyOptions,
    );
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
    imageImetaMap?: ImageImetaMap,
  ): Promise<PostResult> {
    // 末尾のメディアURL直後の改行を削除
    let processedContent = trimTrailingNewlineAfterMedia(content);

    // インラインのnostr: URIから引用タグを抽出（ストアベースのURI追加前に実行）
    const inlineQuoteTags = this.deps.replyQuoteService?.extractInlineQuoteTags?.(processedContent)
      ?? new ReplyQuoteService().extractInlineQuoteTags(processedContent);

    // ストア由来の引用がある場合、文末にnostr: URIを追加
    const rqStateForUri = this.deps.replyQuoteState?.value ?? replyQuoteState.value;
    if (rqStateForUri.quotes.length > 0) {
      const rqService = this.deps.replyQuoteService || new ReplyQuoteService();
      const existingInlineQuoteEventIds = new Set(
        inlineQuoteTags.filter((tag) => tag[0] === 'q').map((tag) => tag[1]),
      );
      const quoteUris = rqStateForUri.quotes
        .filter((quote) => !existingInlineQuoteEventIds.has(quote.eventId))
        .map((quote) =>
          rqService.generateNostrUri(
            quote.eventId,
            quote.relayHints,
            quote.authorPubkey,
          ),
        );

      if (quoteUris.length > 0) {
        processedContent = `${processedContent.trimEnd()}\n${quoteUris.join('\n')}`.trim();
      }
    }

    const validation = this.validatePost(processedContent);
    if (!validation.valid) {
      return this.notifyPostFailure(validation.error!);
    }

    if (!this.eventSender) {
      return this.notifyPostFailure("nostr_not_ready");
    }

    try {
      // 依存性から認証状態とストアを取得
      const authStateStore = this.deps.authStateStore || { value: authState.value };
      const hashtagStore = this.deps.hashtagStore || hashtagDataStore;
      const { hashtags, tags } = this.getHashtagArrays(hashtagStore);
      const keyMgr = this.deps.keyManager || keyManager;
      const windowObj = this.deps.window || (typeof window !== 'undefined' ? window : undefined);

      // Content Warning状態を取得
      const contentWarningEnabled = contentWarningStore.value;
      const contentWarningReason = contentWarningReasonStore.value;
      const channelContext = this.deps.channelContextState?.value ?? null;
      const additionalWriteRelays = channelContext?.relayHints;

      // リプライ/引用タグを構築
      const rqState = this.deps.replyQuoteState?.value ?? replyQuoteState.value;
      let replyQuoteTags: string[][] | undefined;
      const rqNotifyOptions = this.getReplyQuoteNotifyOptions();
      if (rqState.reply || rqState.quotes.length > 0) {
        const rqService = this.deps.replyQuoteService || new ReplyQuoteService();
        replyQuoteTags = [];

        if (rqState.reply) {
          if (channelContext) {
            replyQuoteTags.push([
              'e',
              rqState.reply.eventId,
              rqState.reply.relayHints[0] || '',
              'reply',
              ...(rqState.reply.authorPubkey ? [rqState.reply.authorPubkey] : []),
            ]);

            rqService
              .buildReplyTags(rqState.reply)
              .filter((tag) => tag[0] === 'p')
              .forEach((tag) => {
                replyQuoteTags!.push(tag);
              });
          } else {
            replyQuoteTags.push(...rqService.buildReplyTags(rqState.reply));
          }
        }

        const existingQuoteEventIds = new Set<string>();
        const existingPPubkeys = new Set(
          replyQuoteTags.filter((tag) => tag[0] === 'p').map((tag) => tag[1]),
        );

        rqState.quotes.forEach((quote) => {
          rqService.buildQuoteTags(quote).forEach((tag) => {
            if (tag[0] === 'q') {
              if (existingQuoteEventIds.has(tag[1])) {
                return;
              }
              existingQuoteEventIds.add(tag[1]);
            }

            if (tag[0] === 'p') {
              if (existingPPubkeys.has(tag[1])) {
                return;
              }
              existingPPubkeys.add(tag[1]);
            }

            replyQuoteTags!.push(tag);
          });
        });
      }

      // インライン引用タグをマージ（重複排除）
      if (inlineQuoteTags.length > 0) {
        if (!replyQuoteTags) {
          replyQuoteTags = [];
        }
        const existingQEventIds = new Set(
          replyQuoteTags.filter(t => t[0] === 'q').map(t => t[1])
        );
        const existingPPubkeys = new Set(
          replyQuoteTags.filter(t => t[0] === 'p').map(t => t[1])
        );
        for (const tag of inlineQuoteTags) {
          if (tag[0] === 'q' && !existingQEventIds.has(tag[1])) {
            replyQuoteTags.push(tag);
            existingQEventIds.add(tag[1]);
          } else if (tag[0] === 'p' && !existingPPubkeys.has(tag[1])) {
            replyQuoteTags.push(tag);
            existingPPubkeys.add(tag[1]);
          }
        }
      }

      const auth = authStateStore.value;
      const isExtensionAuth = auth.type === 'nip07';

      // 拡張機能認証（NIP-07）の場合はwindow.nostrを使用
      if (isExtensionAuth && keyMgr.isWindowNostrAvailable() && windowObj?.nostr) {
        try {
          const pubkey = auth.pubkey;
          if (!pubkey) {
            return this.notifyPostFailure('pubkey_not_found');
          }

          const signEvent = typeof (windowObj.nostr as any).signEvent === 'function'
            ? (windowObj.nostr as { signEvent: (event: any) => Promise<any> }).signEvent.bind(windowObj.nostr)
            : undefined;

          if (!signEvent) {
            return this.notifyPostFailure('nostr_sign_event_not_supported');
          }

          const event = await this.buildSubmissionEvent({
            processedContent,
            hashtags,
            tags,
            pubkey,
            imageImetaMap,
            contentWarningEnabled,
            contentWarningReason,
            replyQuoteTags,
            channelContext,
          });

          return await this.sendPreparedEvent({
            event,
            hashtags,
            rqNotifyOptions,
            signEvent,
            logSignedEvent: true,
            additionalWriteRelays,
          });
        } catch (err) {
          return this.handleSubmissionError('window.nostrでの投稿エラー:', err);
        }
      }

      // NIP-46リモートサイナーの場合
      if (auth.type === 'nip46') {
        const nip46Signer = this.deps.getNip46SignerFn?.();
        if (!nip46Signer) {
          return this.notifyPostFailure('nip46_signer_not_available');
        }

        const pubkey = auth.pubkey;
        if (!pubkey) {
          return this.notifyPostFailure('pubkey_not_found');
        }

        try {
          const event = await this.buildSubmissionEvent({
            processedContent,
            hashtags,
            tags,
            pubkey,
            imageImetaMap,
            contentWarningEnabled,
            contentWarningReason,
            replyQuoteTags,
            channelContext,
          });

          return await this.sendPreparedEvent({
            event,
            hashtags,
            rqNotifyOptions,
            signer: nip46Signer,
            additionalWriteRelays,
          });
        } catch (err) {
          return this.handleSubmissionError('NIP-46での投稿エラー:', err);
        }
      }

      // 親クライアント連携の場合
      if (auth.type === 'parentClient') {
        const parentClientSigner = this.deps.getParentClientSignerFn?.();
        if (!parentClientSigner) {
          return this.notifyPostFailure('parent_client_signer_not_available');
        }

        const pubkey = auth.pubkey;
        if (!pubkey) {
          return this.notifyPostFailure('pubkey_not_found');
        }

        try {
          const event = await this.buildSubmissionEvent({
            processedContent,
            hashtags,
            tags,
            pubkey,
            imageImetaMap,
            contentWarningEnabled,
            contentWarningReason,
            replyQuoteTags,
            channelContext,
          });

          return await this.sendPreparedEvent({
            event,
            hashtags,
            rqNotifyOptions,
            signer: parentClientSigner,
            additionalWriteRelays,
          });
        } catch (err) {
          return this.handleSubmissionError('親クライアント連携での投稿エラー:', err);
        }
      }

      // ローカルキーを使用（秘密鍵直入れの場合）
      const storedKey = keyMgr.getFromStore() || keyMgr.loadFromStorage(auth.pubkey);
      if (!storedKey) {
        return this.notifyPostFailure('key_not_found');
      }

      const event = await this.buildSubmissionEvent({
        processedContent,
        hashtags,
        tags,
        imageImetaMap,
        contentWarningEnabled,
        contentWarningReason,
        replyQuoteTags,
        channelContext,
      });

      const signer = this.deps.seckeySignerFn
        ? this.deps.seckeySignerFn(storedKey)
        : seckeySigner(storedKey);
      return await this.sendPreparedEvent({
        event,
        hashtags,
        rqNotifyOptions,
        signer,
        additionalWriteRelays,
      });

    } catch (err) {
      return this.handleSubmissionError('投稿エラー:', err);
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
    const editorContent = this.deps.extractContentWithImagesFn!(editor) || "";
    if (!mediaFreePlacementStore.value) {
      // ギャラリーモード: エディタのテキスト + ギャラリーのメディアURL
      const galleryUrls = mediaGalleryStore.getContentUrls();
      if (galleryUrls.length > 0) {
        const textPart = editorContent.trim();
        return textPart ? textPart + '\n' + galleryUrls.join('\n') : galleryUrls.join('\n');
      }
      return editorContent;
    }
    return editorContent;
  }

  prepareImageBlurhashMap(editor: TipTapEditor, imageOxMap: Record<string, string>, imageXMap: Record<string, string>): Record<string, any> {
    if (!mediaFreePlacementStore.value) {
      // ギャラリーモード: ギャラリーのメタデータを使用
      return mediaGalleryStore.getImageBlurhashMap();
    }
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
    contentWarningStore.reset(); // Content Warningもリセット
    contentWarningReasonStore.reset(); // Content Warning Reasonもリセット
    // ギャラリーモード: ギャラリーもリセット
    mediaGalleryStore.clearAll();
    // リプライ/引用状態もクリア
    this.deps.clearReplyQuoteFn?.();
  }

  clearContentAfterSuccess(editor: TipTapEditor): void {
    // ピン留めON時: エディタクリア前にハッシュタグを保存
    const pinEnabled = this.deps.hashtagPinStore!.value;
    const snapshot = pinEnabled ? getHashtagDataSnapshot() : null;

    this.applyEmptyStateToEditor(editor);
    contentWarningStore.reset(); // Content Warningもリセット
    contentWarningReasonStore.reset(); // Content Warning Reasonもリセット
    // ギャラリーモード: ギャラリーもクリア
    mediaGalleryStore.clearAll();

    // ピン留めON+ハッシュタグがある場合: エディタにハッシュタグを復元
    if (pinEnabled && snapshot && snapshot.hashtags.length > 0) {
      const hashtagText = ' ' + snapshot.hashtags.map(h => '#' + h).join(' ');
      editor.commands.insertContent(hashtagText);
      editor.commands.focus('start');
    }
  }
}
