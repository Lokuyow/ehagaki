import { a as An, h as bt, m as Ge, b as de, c as kt, d as It, k as Rn, e as Hn, s as On, w as Wn, r as Mt, f as Nn, i as St, j as zn, l as Bn, n as jn, o as qn, p as Un, q as Dt, t as Kn, u as Qe, P as Xn, v as Gn, x as He, y as Qn, z as $n, A as Yn, B as Vn, C as Zn, R as We, D as Jn, E as Tt, F as er, G as tr, H as Ye, I as j, J as nr, K as re, L as _e, M as ke, N as he, O as Lt, Q as Ve, S as rr, T as ir, U as or, V as Ze, $ as Je, W as sr, X as R, Y as Ie, Z as Et, _ as ar, a0 as lr, a1 as xt, a2 as dr, a3 as cr, a4 as At, a5 as ur, a6 as gr, a7 as pr, a8 as hr, a9 as xe, aa as fr, ab as vr, ac as mr, ad as Ce, ae as yr, af as wr, ag as br, ah as Sr, ai as Er, aj as Pt, ak as Oe, al as xr, am as Pr, an as Fr, ao as Cr, ap as _r, aq as kr, ar as Ir, as as Mr, at as Dr, au as Tr, av as Lr, aw as Ar, ax as Rr, ay as Hr, az as Or, aA as Wr, aB as Nr, aC as zr, aD as Br } from "./App-BmKERuNr.js";
import { bk as Xe, aJ as Ne, aq as Rt, b6 as et, b0 as tt, a as e, bf as le, b, Z as Ee, bD as ee, ap as Se, b3 as ie, b4 as nt, aS as V, ba as ce, b8 as ve, aR as E, b5 as q, bg as jr, b9 as fe, aN as be, b1 as qr, b2 as Ht, bl as Ur, u as Me, bi as Ft } from "./entry-COr0Xz6m.js";
class Kr {
  constructor(t, r = {}) {
    this.deps = r, t && this.setRxNostr(t), this.deps.console = r.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = r.authStateStore || An, this.deps.hashtagStore = r.hashtagStore || bt, this.deps.mediaFreePlacementStore = r.mediaFreePlacementStore || Ge, this.deps.mediaGalleryStore = r.mediaGalleryStore || de, this.deps.contentWarningStore = r.contentWarningStore || kt, this.deps.contentWarningReasonStore = r.contentWarningReasonStore || It, this.deps.keyManager = r.keyManager || Rn, this.deps.createImetaTagFn = r.createImetaTagFn || Hn, this.deps.settingsStore = r.settingsStore || On, this.deps.writeRelaysStore = r.writeRelaysStore || Wn, this.deps.replyQuoteState = r.replyQuoteState || Mt, this.deps.getClientTagFn = r.getClientTagFn || (() => Nn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = r.seckeySignerFn || St, this.deps.extractContentWithImagesFn = r.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = r.extractContentWithEmojiTagsFn || (r.extractContentWithImagesFn ? (s) => ({ content: r.extractContentWithImagesFn(s), emojiTags: [] }) : zn), this.deps.extractImageBlurhashMapFn = r.extractImageBlurhashMapFn || Bn, this.deps.resetEditorStateFn = r.resetEditorStateFn || jn, this.deps.resetPostStatusFn = r.resetPostStatusFn || qn, this.deps.notificationPort = r.iframeMessageService || r.notificationPort || Un, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = r.hashtagPinStore || Dt, this.deps.saveHashtagsToHistoryFn = r.saveHashtagsToHistoryFn || Kn, this.deps.clearReplyQuoteFn = r.clearReplyQuoteFn || Qe;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new Xn(t, this.deps.console || console);
  }
  clearReplyQuoteAfterSuccess() {
    this.deps.clearReplyQuoteFn?.();
  }
  getReplyQuoteNotifyOptions() {
    const t = this.deps.replyQuoteState.value, r = Array.from(
      new Set(t.quotes.map((s) => s.eventId))
    );
    if (!(!t.reply && r.length === 0))
      return {
        ...t.reply ? { replyToEventId: t.reply.eventId } : {},
        ...r.length > 0 ? { quotedEventIds: r } : {}
      };
  }
  notifyPostFailure(t) {
    return this.deps.notificationPort?.notifyPostError(t), { success: !1, error: t };
  }
  handleSubmissionError(t) {
    return this.deps.console?.error(t, {
      stage: "submission",
      reason: "unexpected"
    }), this.notifyPostFailure("post_error");
  }
  async buildSubmissionEvent(t) {
    return Gn.buildEvent(
      t.processedContent,
      t.hashtags,
      t.tags,
      t.pubkey,
      t.imageImetaMap,
      this.deps.createImetaTagFn,
      this.deps.getClientTagFn,
      t.contentWarningEnabled,
      t.contentWarningReason,
      t.replyQuoteTags,
      t.channelContext,
      t.emojiTags
    );
  }
  finalizeSubmittedPost(t, r, s) {
    return t.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(r)).catch(() => {
      this.deps.console?.warn?.("hashtag_history_save_failed", {
        stage: "post-success",
        reason: "unexpected"
      });
    }), this.clearReplyQuoteAfterSuccess(), this.deps.notificationPort?.notifyPostSuccess({
      ...s,
      ...t.eventId ? { eventId: t.eventId } : {}
    }), t) : (this.deps.notificationPort?.notifyPostError(t.error), t);
  }
  async saveSubmittedPostHistory(t) {
    if (!t.result.success || !this.deps.savePostHistoryFn) return;
    const r = Xe.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), s = Xe.sanitizeExternalRelayUrls([
      ...r,
      ...t.additionalWriteRelays ?? [],
      ...this.deps.writeRelaysStore?.value ?? []
    ], { limit: 3 });
    try {
      await this.deps.savePostHistoryFn({
        event: t.event,
        attestation: t.attestation,
        acceptedRelays: r,
        relayHints: s
      });
    } catch {
      this.deps.console?.warn?.("post_history_save_failed", {
        stage: "post-history",
        reason: "unexpected"
      });
    }
  }
  async sendPreparedEvent(t) {
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent start", {
      eventKind: t.event?.kind
    });
    const r = t.signEvent ?? (typeof t.signer?.signEvent == "function" ? t.signer.signEvent.bind(t.signer) : void 0);
    if (t.signer && !r)
      return this.notifyPostFailure("nostr_sign_event_not_supported");
    He(this.deps.authStateStore, t.sessionPubkey);
    const s = Qn(t.event), a = r ? await r(s.signerTemplate) : t.event;
    He(this.deps.authStateStore, t.sessionPubkey);
    let o;
    try {
      o = $n(
        s.expectedTemplate,
        a,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    He(this.deps.authStateStore, t.sessionPubkey);
    const l = Yn(o);
    if (!l)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: o?.kind ?? "(missing)"
    }), r && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), He(this.deps.authStateStore, t.sessionPubkey);
    const d = await this.eventSender.sendEvent(l.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: d.success
    });
    const h = d.success ? {
      ...d,
      eventId: d.eventId ?? l.event.id,
      event: l.event
    } : d;
    return await this.saveSubmittedPostHistory({
      event: l.event,
      attestation: l.attestation,
      result: h,
      additionalWriteRelays: t.additionalWriteRelays
    }), this.finalizeSubmittedPost(
      h,
      t.hashtags,
      t.rqNotifyOptions
    );
  }
  // 外部APIは変更なし（後方互換性のため）
  validatePost(t) {
    const r = this.deps.authStateStore;
    return Vn.validatePost(
      t,
      r.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, r, s = []) {
    let a = Zn(t);
    const o = this.deps.settingsStore.quoteNotificationEnabled, l = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      a,
      o
    ) ?? new We().extractInlineQuoteTags(
      a,
      o
    ), d = this.deps.replyQuoteState.value;
    if (d.quotes.length > 0) {
      const S = this.deps.replyQuoteService || new We(), P = new Set(
        l.filter((p) => p[0] === "q").map((p) => p[1])
      ), T = d.quotes.filter((p) => !P.has(p.eventId)).map(
        (p) => S.generateNostrUri(
          p.eventId,
          p.relayHints,
          p.authorPubkey
        )
      );
      T.length > 0 && (a = `${a.trimEnd()}
${T.join(`
`)}`.trim());
    }
    const h = this.validatePost(a);
    if (!h.valid)
      return this.notifyPostFailure(h.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    if (tr() && Xe.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const S = this.deps.authStateStore, P = Jn(S), T = this.deps.hashtagStore, { hashtags: p, tags: C } = this.getHashtagArrays(T), W = this.deps.keyManager, _ = this.deps.window || (typeof window < "u" ? window : void 0), te = this.deps.contentWarningStore.value, ne = this.deps.contentWarningReasonStore.value, ue = this.deps.channelContextState?.value ?? null, Y = ue?.channelRelays, G = this.deps.replyQuoteState.value;
      let H;
      const ge = this.getReplyQuoteNotifyOptions();
      if (G.reply || G.quotes.length > 0) {
        const k = this.deps.replyQuoteService || new We();
        H = [], G.reply && (ue ? (H.push([
          "e",
          G.reply.eventId,
          G.reply.relayHints[0] || "",
          "reply",
          ...G.reply.authorPubkey ? [G.reply.authorPubkey] : []
        ]), k.buildReplyTags(G.reply).filter((D) => D[0] === "p").forEach((D) => {
          H.push(D);
        })) : H.push(...k.buildReplyTags(G.reply)));
        const F = /* @__PURE__ */ new Set(), m = new Set(
          H.filter((D) => D[0] === "p").map((D) => D[1])
        );
        G.quotes.forEach((D) => {
          k.buildQuoteTags(D, D.quoteNotificationEnabled).forEach((L) => {
            if (L[0] === "q") {
              if (F.has(L[1]))
                return;
              F.add(L[1]);
            }
            if (L[0] === "p") {
              if (m.has(L[1]))
                return;
              m.add(L[1]);
            }
            H.push(L);
          });
        });
      }
      if (l.length > 0) {
        H || (H = []);
        const k = new Set(
          H.filter((m) => m[0] === "q").map((m) => m[1])
        ), F = new Set(
          H.filter((m) => m[0] === "p").map((m) => m[1])
        );
        for (const m of l)
          m[0] === "q" && !k.has(m[1]) ? (H.push(m), k.add(m[1])) : m[0] === "p" && !F.has(m[1]) && (H.push(m), F.add(m[1]));
      }
      const Z = S.value;
      if (Z.type === "nip07" && W.isWindowNostrAvailable() && _?.nostr)
        try {
          const k = Z.pubkey;
          if (!k)
            return this.notifyPostFailure("pubkey_not_found");
          const F = typeof _.nostr.signEvent == "function" ? _.nostr.signEvent.bind(_.nostr) : void 0;
          if (!F)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const m = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: C,
            pubkey: k,
            imageImetaMap: r,
            contentWarningEnabled: te,
            contentWarningReason: ne,
            replyQuoteTags: H,
            channelContext: ue,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: m,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: ge,
            signEvent: F,
            logSignedEvent: !0,
            additionalWriteRelays: Y
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (Z.type === "nip46")
        try {
          const k = Z.pubkey;
          if (!k)
            return this.notifyPostFailure("pubkey_not_found");
          const F = await this.deps.getNip46SignerForSessionFn?.(k), m = this.deps.authStateStore.value;
          if (!F || !m.isAuthenticated || m.type !== "nip46" || m.pubkey !== k)
            return this.notifyPostFailure("nip46_signer_not_available");
          const D = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: C,
            pubkey: k,
            imageImetaMap: r,
            contentWarningEnabled: te,
            contentWarningReason: ne,
            replyQuoteTags: H,
            channelContext: ue,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: D,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: ge,
            signer: F,
            additionalWriteRelays: Y
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (Z.type === "parentClient") {
        const k = this.deps.getParentClientSignerFn?.();
        if (!k)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const F = Z.pubkey;
        if (!F)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const m = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: C,
            pubkey: F,
            imageImetaMap: r,
            contentWarningEnabled: te,
            contentWarningReason: ne,
            replyQuoteTags: H,
            channelContext: ue,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: m,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: ge,
            signer: k,
            additionalWriteRelays: Y
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const c = W.getFromStore() || W.loadFromStorage(Z.pubkey);
      if (!c)
        return this.notifyPostFailure("key_not_found");
      const pe = await this.buildSubmissionEvent({
        processedContent: a,
        hashtags: p,
        tags: C,
        imageImetaMap: r,
        contentWarningEnabled: te,
        contentWarningReason: ne,
        replyQuoteTags: H,
        channelContext: ue,
        emojiTags: s
      }), me = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(c) : St(c);
      return await this.sendPreparedEvent({
        event: pe,
        sessionPubkey: P,
        hashtags: p,
        rqNotifyOptions: ge,
        signer: me,
        additionalWriteRelays: Y
      });
    } catch {
      return this.handleSubmissionError("投稿エラー:");
    }
  }
  // テスト用の内部コンポーネントへのアクセス
  getEventSender() {
    return this.eventSender;
  }
  getHashtagArrays(t) {
    const r = t || this.deps.hashtagStore, s = this.deps.hashtagSnapshotFn;
    if (s) {
      const a = s(r);
      return {
        hashtags: Array.isArray(a?.hashtags) ? [...a.hashtags] : [],
        tags: Array.isArray(a?.tags) ? a.tags.map((o) => [...o]) : []
      };
    }
    if (r === bt)
      try {
        const a = Tt();
        return {
          hashtags: Array.isArray(a?.hashtags) ? [...a.hashtags] : [],
          tags: Array.isArray(a?.tags) ? a.tags.map((o) => [...o]) : []
        };
      } catch (a) {
        this.deps.console?.warn("hashtag_snapshot_failed", a);
      }
    return {
      hashtags: Array.isArray(r?.hashtags) ? [...r.hashtags] : [],
      tags: Array.isArray(r?.tags) ? r.tags.map((a) => [...a]) : []
    };
  }
  // --- PostComponent 統合メソッド ---
  preparePostPayload(t) {
    const r = this.deps.extractContentWithEmojiTagsFn(t);
    if (!this.deps.mediaFreePlacementStore.value) {
      const s = this.deps.mediaGalleryStore.getContentUrls();
      if (s.length > 0) {
        const a = r.content.trim();
        return {
          content: a ? a + `
` + s.join(`
`) : s.join(`
`),
          emojiTags: r.emojiTags
        };
      }
    }
    return r;
  }
  preparePostContent(t) {
    return this.preparePostPayload(t).content;
  }
  prepareImageBlurhashMap(t, r, s) {
    if (!this.deps.mediaFreePlacementStore.value)
      return this.deps.mediaGalleryStore.getImageBlurhashMap();
    const a = {};
    t?.state?.doc?.descendants?.((d) => {
      if (d.type?.name !== "image" || !d.attrs?.src || d.attrs?.isPlaceholder)
        return;
      const h = typeof d.attrs.size == "number" ? d.attrs.size : Number(d.attrs.size);
      a[d.attrs.src] = {
        dim: d.attrs.dim ?? void 0,
        alt: d.attrs.alt ?? void 0,
        size: Number.isFinite(h) && h > 0 ? h : void 0,
        uploadProtocol: d.attrs.uploadProtocol ?? void 0
      };
    });
    const o = this.deps.extractImageBlurhashMapFn(t), l = {};
    for (const [d, h] of Object.entries(o))
      l[d] = {
        m: er(d),
        blurhash: h,
        dim: a[d]?.dim,
        alt: a[d]?.alt,
        size: a[d]?.size,
        uploadProtocol: a[d]?.uploadProtocol,
        ox: r[d],
        x: s[d]
      };
    return l;
  }
  async performPostSubmission(t, r, s, a, o, l, d) {
    const h = this.prepareImageBlurhashMap(t, s, a);
    o?.();
    try {
      const S = await this.submitPost(r.content, h, r.emojiTags);
      S.success ? l?.(S) : d?.(S.error || "post_error");
    } catch {
      d?.("post_error");
    }
  }
  applyEmptyStateToEditor(t) {
    t.chain().clearContent().run();
  }
  resetPostContent(t) {
    this.applyEmptyStateToEditor(t), this.deps.resetEditorStateFn?.(), this.deps.resetPostStatusFn?.(), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), this.deps.clearReplyQuoteFn?.();
  }
  clearContentAfterSuccess(t) {
    const r = this.deps.hashtagPinStore.value, s = r ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), r && s.length > 0) {
      const a = " " + s.map((o) => "#" + o).join(" ");
      t.commands.insertContent(a);
    }
    t.commands.setTextSelection(1);
  }
}
function Xr(n) {
  return !!n && n.length > 0;
}
function Gr(n, t, r) {
  n.isUploading = t, r !== void 0 && (n.uploadErrorMessage = r);
}
function Qr(n) {
  const t = n.target;
  return t?.files?.length ? t.files : void 0;
}
function $r({
  getCurrentEditor: n,
  getFileInput: t,
  getImageOxMap: r,
  getImageXMap: s,
  getUploadFailedText: a,
  updateUploadState: o,
  setUploadErrorMessage: l,
  uploadFiles: d
}) {
  const h = async (P) => Xr(P) ? await d({
    files: P,
    currentEditor: n(),
    fileInput: t(),
    updateUploadState: o,
    setUploadErrorMessage: l,
    imageOxMap: r(),
    imageXMap: s(),
    getUploadFailedText: a
  }) ?? null : null;
  return {
    performUpload: h,
    handleFileSelect: (P) => {
      const T = Qr(P);
      T && h(T);
    }
  };
}
let N = Ne({
  showSecretKeyDialog: !1,
  pendingPost: "",
  pendingEmojiTags: [],
  showImageFullscreen: !1,
  fullscreenMediaId: "",
  fullscreenImageSrc: "",
  fullscreenImageAlt: "",
  showFloatingMessage: !1,
  floatingMessageX: 0,
  floatingMessageY: 0,
  floatingMessageText: ""
}), De;
function Ct() {
  De !== void 0 && (clearTimeout(De), De = void 0);
}
const ae = {
  get value() {
    return N;
  },
  // 秘密鍵ダイアログ
  showSecretKeyDialog: (n, t = []) => {
    N.pendingPost = n, N.pendingEmojiTags = t.map((r) => [...r]), N.showSecretKeyDialog = !0;
  },
  hideSecretKeyDialog: () => {
    N.showSecretKeyDialog = !1, N.pendingPost = "", N.pendingEmojiTags = [];
  },
  getPendingPost: () => N.pendingPost,
  getPendingEmojiTags: () => N.pendingEmojiTags.map((n) => [...n]),
  // 画像フルスクリーン
  showImageFullscreen: (n, t = "", r = "") => {
    N.fullscreenMediaId = r, N.fullscreenImageSrc = n, N.fullscreenImageAlt = t, N.showImageFullscreen = !0;
  },
  hideImageFullscreen: () => {
    N.showImageFullscreen = !1, N.fullscreenMediaId = "", N.fullscreenImageSrc = "", N.fullscreenImageAlt = "";
  },
  // フローティングメッセージ
  showFloatingMessage: (n, t, r, s = 1800) => {
    Ct(), N.floatingMessageX = n, N.floatingMessageY = t, N.floatingMessageText = r, N.showFloatingMessage = !0, De = setTimeout(
      () => {
        N.showFloatingMessage = !1, De = void 0;
      },
      s
    );
  },
  hideFloatingMessage: () => {
    Ct(), N.showFloatingMessage = !1;
  }
};
var Yr = ce('<img draggable="false"/>'), Vr = ce('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), Zr = ce('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const Jr = {
  hash: "svelte-aw59wn",
  code: `.gallery-item.svelte-aw59wn,
    .gallery-item-media.svelte-aw59wn,
    .video-wrapper.svelte-aw59wn {position:relative;}.gallery-item.svelte-aw59wn,
    .gallery-item-media.svelte-aw59wn,
    .gallery-image.svelte-aw59wn,
    .gallery-video.svelte-aw59wn {-webkit-touch-callout:none;}.gallery-item.svelte-aw59wn,
    .gallery-image.svelte-aw59wn,
    .gallery-video.svelte-aw59wn {-webkit-user-select:none;user-select:none;}.gallery-item.svelte-aw59wn,
    .video-drag-overlay.svelte-aw59wn {cursor:grab;}.gallery-item.svelte-aw59wn:active,
    .video-drag-overlay.svelte-aw59wn:active {cursor:grabbing;}.gallery-item.is-disabled.svelte-aw59wn,
    .gallery-item.is-disabled.svelte-aw59wn .gallery-item-media:where(.svelte-aw59wn),
    .gallery-item.is-disabled.svelte-aw59wn .video-drag-overlay:where(.svelte-aw59wn) {cursor:not-allowed;}.gallery-item.is-disabled.svelte-aw59wn {opacity:0.72;}.gallery-item.svelte-aw59wn {display:inline-flex;flex-shrink:0;overflow:visible;transition:transform 0.15s ease,
            opacity 0.15s ease;.circle {width:40px;height:40px;}}.gallery-item-media.svelte-aw59wn {border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;}.gallery-item-media[role="button"].svelte-aw59wn {cursor:pointer;background-color:transparent;}.gallery-image.svelte-aw59wn,
    .gallery-video.svelte-aw59wn {object-fit:cover;display:block;}.gallery-image.svelte-aw59wn {min-width:100px;max-width:180px;height:180px;-webkit-drag:none;&.image-loading {opacity:0;}}.video-wrapper.svelte-aw59wn,
    .gallery-video.svelte-aw59wn {width:180px;height:180px;}.video-drag-overlay.svelte-aw59wn {position:absolute;inset:0 0 50px;z-index:1;}

    @media (hover: none) and (pointer: coarse) {.video-drag-overlay.svelte-aw59wn {display:none;}
    }`
};
function Ot(n, t) {
  tt(t, !0), Ye(n, Jr);
  const r = () => Ze(Je, "$_", s), [s, a] = Ve();
  let o = j(t, "item", 7), l = j(t, "index", 7), d = j(t, "onDelete", 7), h = j(t, "onDragStart", 7), S = j(t, "onDragOver", 7), P = j(t, "onDragEnd", 7), T = j(t, "onDrop", 7), p = j(t, "onTouchDragStart", 7), C = j(t, "disabled", 7, !1), W = V(void 0), _ = V(void 0);
  const te = or();
  nr(() => e(W), {
    onLongPress: (g, M) => {
      C() || p()?.(l(), g, M);
    }
  });
  let ne = E(() => !o().isPlaceholder && o().type === "image" && !!o().src), ue = E(() => !o().isPlaceholder && o().type === "video" && !!o().src);
  const Y = 180, G = 100, H = 180;
  let ge = E(() => {
    if (!o().isPlaceholder) return;
    const g = o().dimensions;
    if (g && g.width > 0 && g.height > 0) {
      const M = g.width / g.height, Q = Math.round(Y * M);
      return `width: ${Math.max(G, Math.min(H, Q))}px; height: ${Y}px;`;
    }
    return `width: ${H}px; height: ${Y}px;`;
  });
  function Z() {
    o().isPlaceholder || o().type !== "image" || ae.showImageFullscreen(o().src, o().alt || "", o().id);
  }
  function oe(g) {
    if (C()) {
      g.preventDefault();
      return;
    }
    if (e(W) && g.dataTransfer) {
      const M = e(W).getBoundingClientRect(), Q = g.clientX - M.left, X = g.clientY - M.top;
      g.dataTransfer.setDragImage(e(W), Q, X);
    }
    h()(l(), g);
  }
  function c(g) {
    g.stopPropagation(), e(_) && (e(_).paused ? e(_).play() : e(_).pause());
  }
  function pe(g) {
    g.preventDefault(), !C() && S()(l(), g);
  }
  function me(g) {
    g.preventDefault(), !C() && T()(l());
  }
  function k(g) {
    o().type !== "image" || o().isPlaceholder || (g.key === "Enter" || g.key === " " || g.key === "Spacebar") && (g.preventDefault(), Z());
  }
  var F = {
    get item() {
      return o();
    },
    set item(g) {
      o(g), q();
    },
    get index() {
      return l();
    },
    set index(g) {
      l(g), q();
    },
    get onDelete() {
      return d();
    },
    set onDelete(g) {
      d(g), q();
    },
    get onDragStart() {
      return h();
    },
    set onDragStart(g) {
      h(g), q();
    },
    get onDragOver() {
      return S();
    },
    set onDragOver(g) {
      S(g), q();
    },
    get onDragEnd() {
      return P();
    },
    set onDragEnd(g) {
      P(g), q();
    },
    get onDrop() {
      return T();
    },
    set onDrop(g) {
      T(g), q();
    },
    get onTouchDragStart() {
      return p();
    },
    set onTouchDragStart(g) {
      p(g), q();
    },
    get disabled() {
      return C();
    },
    set disabled(g = !1) {
      C(g), q();
    }
  }, m = Zr();
  let D;
  var L = ve(m), O = ve(L);
  {
    var v = (g) => {
      {
        let M = E(() => o().type === "video" ? r()("videoNode.uploading") : r()("imageNode.uploading"));
        rr(g, {
          get text() {
            return e(M);
          },
          showLoader: !0
        });
      }
    };
    re(O, (g) => {
      o().isPlaceholder && g(v);
    });
  }
  var f = le(O, 2);
  {
    var U = (g) => {
      var M = Yr();
      let Q;
      Ee(() => {
        he(M, "src", o().src), he(M, "alt", o().alt || ""), Q = ke(M, 1, "gallery-image svelte-aw59wn", null, Q, { "image-loading": !te.isLoaded });
      }), ee("load", M, function(...X) {
        te.handleLoad?.apply(this, X);
      }), ee("error", M, function(...X) {
        te.handleError?.apply(this, X);
      }), Se("contextmenu", M, (X) => X.preventDefault()), jr(M), ie(g, M);
    };
    re(f, (g) => {
      e(ne) && g(U);
    });
  }
  var A = le(f, 2);
  {
    var I = (g) => {
      var M = Vr(), Q = ve(M);
      Q.muted = !0, _e(Q, (ye) => b(_, ye), () => e(_));
      var X = le(Q, 2);
      fe(M), Ee(() => {
        he(Q, "src", o().src), he(X, "draggable", !C());
      }), Se("contextmenu", Q, (ye) => ye.preventDefault()), ee("dragstart", X, oe), Se("click", X, c), ie(g, M);
    };
    re(A, (g) => {
      e(ue) && g(I);
    });
  }
  fe(L);
  var K = le(L, 2);
  {
    var z = (g) => {
      {
        let M = E(() => r()("imageContextMenu.delete")), Q = E(() => r()("imageContextMenu.copyUrl")), X = E(() => r()("imageContextMenu.copySuccess"));
        ir(g, {
          get src() {
            return o().src;
          },
          onDelete: () => d()(o().id),
          get deleteAriaLabel() {
            return e(M);
          },
          get copyAriaLabel() {
            return e(Q);
          },
          get copySuccessMessage() {
            return e(X);
          },
          layout: "gallery",
          get deleteDisabled() {
            return C();
          }
        });
      }
    };
    re(K, (g) => {
      o().isPlaceholder || g(z);
    });
  }
  fe(m), _e(m, (g) => b(W, g), () => e(W)), Ee(() => {
    D = ke(m, 1, "gallery-item svelte-aw59wn", null, D, {
      "is-placeholder": o().isPlaceholder,
      "is-disabled": C()
    }), he(m, "draggable", !C() && (o().type !== "video" || o().isPlaceholder)), Lt(L, e(ge)), he(L, "role", o().type === "image" && !o().isPlaceholder ? "button" : void 0), he(L, "tabindex", o().type === "image" && !o().isPlaceholder ? 0 : void 0), he(L, "aria-label", o().alt || o().src);
  }), ee("dragstart", m, oe), ee("dragover", m, pe), ee("drop", m, me), ee("dragend", m, () => P()()), Se("click", L, function(...g) {
    (o().type === "image" && !o().isPlaceholder ? Z : void 0)?.apply(this, g);
  }), Se("keydown", L, k), ie(n, m);
  var J = nt(F);
  return a(), J;
}
Rt(["click", "keydown", "contextmenu"]);
et(
  Ot,
  {
    item: {},
    index: {},
    onDelete: {},
    onDragStart: {},
    onDragOver: {},
    onDragEnd: {},
    onDrop: {},
    onTouchDragStart: {},
    disabled: {}
  },
  [],
  [],
  { mode: "open" }
);
function ei(n) {
  return Math.abs(n.deltaX) > Math.abs(n.deltaY) ? n.deltaX : n.deltaY;
}
function ti(n, t) {
  const r = n.scrollHeight - n.clientHeight;
  if (r <= 1)
    return !1;
  const s = n.scrollTop <= 0, a = n.scrollTop >= r - 1;
  return t > 0 ? !a : t < 0 ? !s : !1;
}
function ni(n, t) {
  const r = n.scrollWidth - n.clientWidth;
  if (r <= 1)
    return !1;
  const s = n.scrollLeft <= 0, a = n.scrollLeft >= r - 1;
  return t > 0 ? !a : t < 0 ? !s : !1;
}
function ri(n, t, r = null) {
  if (r && ti(r, t.deltaY))
    return !1;
  const s = ei(t);
  if (!ni(n, s))
    return !1;
  const a = Math.max(
    0,
    n.scrollWidth - n.clientWidth
  );
  return n.scrollLeft = Math.min(
    a,
    Math.max(0, n.scrollLeft + s)
  ), !0;
}
var ii = ce("<div><!></div>"), oi = ce('<div role="list"></div>');
const si = {
  hash: "svelte-w2vv8k",
  code: `.media-gallery.svelte-w2vv8k {display:flex;align-items:center;width:100%;min-height:180px;overflow-x:auto;overflow-y:visible;scrollbar-width:thin;gap:4px;background-color:var(--window);}.media-gallery.sending.svelte-w2vv8k {background-color:color-mix(
            in srgb,
            var(--window) 82%,
            var(--surface-button) 18%
        );cursor:not-allowed;}.media-gallery.sending.svelte-w2vv8k .gallery-item {cursor:not-allowed;}.gallery-item-wrapper.svelte-w2vv8k {position:relative;display:inline-flex;align-items:center;width:fit-content;height:fit-content;}

    /* 挿入位置インジケーターバー */.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before,
    .gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {content:"";position:absolute;top:0;bottom:0;width:8px;background:var(--theme, #2196f3);border-radius:4px;z-index:10;pointer-events:none;}.gallery-item-wrapper.insert-bar-left.svelte-w2vv8k::before {left:-5px;}.gallery-item-wrapper.insert-bar-right.svelte-w2vv8k::after {right:-5px;}

    @media (hover: none) and (pointer: coarse) {.media-gallery.svelte-w2vv8k {scrollbar-width:none;}.media-gallery.svelte-w2vv8k::-webkit-scrollbar {display:none;}
    }`
};
function Wt(n, t) {
  tt(t, !0), Ye(n, si);
  const r = () => Ze(Je, "$_", s), [s, a] = Ve();
  let o = V(-1), l = V(-1), d = V(-1), h = V(-1), S = null, P = 60, T = 60, p = V(void 0), C = null, W = E(() => de.items), _ = E(() => R.postStatus.sending), te = E(() => {
    const v = e(o) !== -1 ? e(o) : e(d), f = e(o) !== -1 ? e(l) : e(h);
    return v === -1 || f === -1 || f === v || f === v + 1 ? -1 : f;
  });
  function ne(v, f) {
    if (e(_)) {
      f.preventDefault();
      return;
    }
    b(o, v, !0), f.dataTransfer?.setData("text/plain", String(v)), f.dataTransfer && (f.dataTransfer.effectAllowed = "move");
  }
  function ue(v, f) {
    if (f.preventDefault(), e(_)) return;
    const A = e(p)?.querySelectorAll(".gallery-item-wrapper")?.[v];
    if (A) {
      const I = A.getBoundingClientRect();
      b(l, f.clientX < I.left + I.width / 2 ? v : v + 1, !0);
    } else
      b(l, v, !0);
  }
  function Y() {
    c(), b(o, -1), b(l, -1);
  }
  function G(v) {
  }
  function H(v) {
    if (e(o) === -1) return;
    if (v.preventDefault(), e(_)) {
      c(), b(l, -1);
      return;
    }
    const f = e(p)?.querySelectorAll(".gallery-item-wrapper");
    if (f && f.length > 0) {
      const U = f[0].getBoundingClientRect(), A = f[f.length - 1].getBoundingClientRect();
      v.clientX < U.left ? b(l, 0) : v.clientX > A.right && b(l, e(W).length, !0);
    }
    if (e(p)) {
      const U = e(p).getBoundingClientRect();
      v.clientX - U.left < Ie ? oe("left", v.clientX) : U.right - v.clientX < Ie ? oe("right", v.clientX) : c();
    }
  }
  function ge(v) {
    if (v.preventDefault(), c(), e(_)) {
      b(o, -1), b(l, -1);
      return;
    }
    const f = e(l);
    if (e(o) !== -1 && f !== -1 && f !== e(o) && f !== e(o) + 1) {
      const U = e(o) < f ? f - 1 : f;
      de.reorderItems(e(o), U);
    }
    b(o, -1), b(l, -1);
  }
  function Z(v) {
    e(_) || de.removeItem(v);
  }
  function oe(v, f) {
    if (!e(p)) return;
    C !== null && (cancelAnimationFrame(C), C = null);
    const U = e(p).getBoundingClientRect(), A = v === "left" ? f - U.left : U.right - f, I = Math.max(0, Math.min(1, A / Ie)), K = Et + (ar - Et) * (1 - I), z = () => {
      if (!e(p)) return;
      const J = e(p).scrollWidth - e(p).clientWidth;
      v === "left" && e(p).scrollLeft > 0 ? (e(p).scrollLeft = Math.max(0, e(p).scrollLeft - K), C = requestAnimationFrame(z)) : v === "right" && e(p).scrollLeft < J ? (e(p).scrollLeft = Math.min(J, e(p).scrollLeft + K), C = requestAnimationFrame(z)) : C = null;
    };
    C = requestAnimationFrame(z);
  }
  function c() {
    C !== null && (cancelAnimationFrame(C), C = null);
  }
  function pe(v, f, U) {
    if (e(_)) return;
    b(d, v, !0), F();
    const A = e(p)?.querySelectorAll(".gallery-item-wrapper")[v];
    if (A) {
      const I = A.getBoundingClientRect(), K = 120, z = Math.min(K / I.width, K / I.height);
      P = I.width * z / 2, T = I.height * z / 2, S = A.cloneNode(!0), S.style.cssText = `
                position: fixed;
                left: ${f - P}px;
                top: ${U - T}px;
                width: ${I.width}px;
                height: ${I.height}px;
                transform-origin: top left;
                transform: scale(${z});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, Ur().overlayTarget.appendChild(S);
    }
    document.addEventListener("touchmove", me, { passive: !1 }), document.addEventListener("touchend", k, { passive: !1 });
  }
  function me(v) {
    if (e(d) === -1 || v.touches.length !== 1) return;
    if (v.preventDefault(), e(_)) {
      c(), b(h, -1);
      return;
    }
    const f = v.touches[0];
    S && (S.style.left = `${f.clientX - P}px`, S.style.top = `${f.clientY - T}px`), S && (S.style.display = "none");
    const U = document.elementFromPoint(f.clientX, f.clientY);
    S && (S.style.display = "");
    const A = U?.closest(".gallery-item-wrapper");
    if (A && e(p)) {
      const I = e(p).querySelectorAll(".gallery-item-wrapper"), K = Array.from(I).indexOf(A);
      if (K !== -1) {
        const z = A.getBoundingClientRect();
        b(h, f.clientX < z.left + z.width / 2 ? K : K + 1, !0);
      }
    } else if (e(p)) {
      const I = e(p).querySelectorAll(".gallery-item-wrapper");
      if (I.length > 0) {
        const K = I[0].getBoundingClientRect(), z = I[I.length - 1].getBoundingClientRect();
        f.clientX <= K.left ? b(h, 0) : f.clientX >= z.right && b(h, e(W).length, !0);
      }
    }
    if (e(p)) {
      const I = e(p).getBoundingClientRect();
      f.clientX - I.left < Ie ? oe("left", f.clientX) : I.right - f.clientX < Ie ? oe("right", f.clientX) : c();
    }
  }
  function k() {
    if (document.removeEventListener("touchmove", me), document.removeEventListener("touchend", k), c(), e(_)) {
      F(), b(d, -1), b(h, -1);
      return;
    }
    const v = e(h);
    if (e(d) !== -1 && v !== -1 && v !== e(d) && v !== e(d) + 1) {
      const f = e(d) < v ? v - 1 : v;
      de.reorderItems(e(d), f);
    }
    F(), b(d, -1), b(h, -1);
  }
  function F() {
    S && (S.remove(), S = null);
  }
  function m(v) {
    if (!e(p)) return;
    const f = e(p).closest(".composer-scroll-region");
    ri(e(p), v, f instanceof HTMLElement ? f : null) && v.preventDefault();
  }
  be(() => {
    if (e(p))
      return e(p).addEventListener("wheel", m, { passive: !1 }), () => {
        e(p)?.removeEventListener("wheel", m);
      };
  });
  var D = qr(), L = Ht(D);
  {
    var O = (v) => {
      var f = oi();
      let U;
      sr(f, 23, () => e(W), (A) => A.id, (A, I, K) => {
        var z = ii();
        let J;
        var g = ve(z);
        Ot(g, {
          get item() {
            return e(I);
          },
          get index() {
            return e(K);
          },
          onDelete: Z,
          onDragStart: ne,
          onDragOver: ue,
          onDragEnd: Y,
          onDrop: G,
          onTouchDragStart: pe,
          get disabled() {
            return e(_);
          }
        }), fe(z), Ee(() => J = ke(z, 1, "gallery-item-wrapper svelte-w2vv8k", null, J, {
          "insert-bar-left": e(te) === e(K),
          "insert-bar-right": e(te) === e(W).length && e(K) === e(W).length - 1
        })), ie(A, z);
      }), fe(f), _e(f, (A) => b(p, A), () => e(p)), Ee(
        (A) => {
          U = ke(f, 1, "media-gallery svelte-w2vv8k", null, U, { sending: e(_) }), he(f, "aria-label", A);
        },
        [() => r()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), ee("dragover", f, H), ee("drop", f, ge), ie(v, f);
    };
    re(L, (v) => {
      e(W).length > 0 && v(O);
    });
  }
  ie(n, D), nt(), a();
}
et(Wt, {}, [], [], { mode: "open" });
function $e(n) {
  if (!n || !n.types) return !1;
  try {
    return Array.from(n.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function Nt(n) {
  if (!n) return !1;
  try {
    return Array.from(n.types).includes("Files") || n.files && n.files.length > 0;
  } catch {
    return !!(n.files && n.files.length > 0);
  }
}
function Te(n) {
  const t = n.__postStatus;
  return (typeof t == "function" ? t() : t)?.sending === !0;
}
function Le(n) {
  return typeof n.__uploadFiles == "function";
}
function ai(n) {
  let t = V(!1);
  function r(o) {
    if (Te(n) || !Le(n)) {
      o.preventDefault(), b(t, !1), n.classList.remove("drag-over");
      return;
    }
    const l = o.dataTransfer, d = $e(l);
    Nt(l) && !d ? (o.preventDefault(), e(t) || (b(t, !0), n.classList.add("drag-over"))) : e(t) && (b(t, !1), n.classList.remove("drag-over"));
  }
  function s(o) {
    e(t) && (b(t, !1), n.classList.remove("drag-over"));
  }
  async function a(o) {
    if (b(t, !1), n.classList.remove("drag-over"), Te(n) || !Le(n)) {
      o.preventDefault();
      return;
    }
    const l = o.dataTransfer;
    $e(l) || l?.files && l.files.length > 0 && typeof n.__uploadFiles == "function" && (o.preventDefault(), n.__uploadFiles(l.files));
  }
  return n.addEventListener("dragover", r), n.addEventListener("dragleave", s), n.addEventListener("drop", a), {
    destroy() {
      n.removeEventListener("dragover", r), n.removeEventListener("dragleave", s), n.removeEventListener("drop", a);
    }
  };
}
function li(n, t) {
  const r = ai(n);
  function s(l) {
    if (Te(n) || !Le(n)) {
      l.preventDefault(), t.dragOver(!1);
      return;
    }
    const d = l.dataTransfer, h = $e(d);
    Nt(d) && !h ? t.dragOver(!0) : t.dragOver(!1);
  }
  function a(l) {
    t.dragOver(!1);
  }
  function o(l) {
    t.dragOver(!1), (Te(n) || !Le(n)) && l.preventDefault();
  }
  return n.addEventListener("dragover", s), n.addEventListener("dragleave", a), n.addEventListener("drop", o), {
    destroy() {
      r?.destroy?.(), n.removeEventListener("dragover", s), n.removeEventListener("dragleave", a), n.removeEventListener("drop", o);
    }
  };
}
function di(n) {
  function t(r) {
    if (Te(n)) {
      r.preventDefault();
      return;
    }
    if (!r.clipboardData) return;
    if (!Le(n)) {
      Array.from(r.clipboardData.items).some((o) => o.kind === "file" && o.type.startsWith("image/")) && r.preventDefault();
      return;
    }
    const s = [];
    for (const a of r.clipboardData.items)
      if (a.kind === "file" && a.type.startsWith("image/")) {
        const o = a.getAsFile();
        o && s.push(o);
      }
    s.length > 0 && (r.preventDefault(), n.__uploadFiles?.(s));
  }
  return n.addEventListener("paste", t), {
    destroy() {
      n.removeEventListener("paste", t);
    }
  };
}
function ci(n) {
  function t(s) {
    const a = s.target;
    if (a && (a.closest('.editor-image-button[data-dragging="true"]') || a.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const o = s.touches[0], l = 120, d = xt.querySelector(".tiptap-editor");
      if (d) {
        const h = d.getBoundingClientRect(), S = o.clientY < h.top + l, P = o.clientY > h.bottom - l;
        if (!S && !P)
          return s.preventDefault(), !1;
      }
    }
  }
  function r(s) {
    const a = xt.querySelectorAll(".drop-zone-indicator");
    a.forEach((o) => {
      o.classList.remove("drop-zone-hover"), o.classList.add("drop-zone-fade-out");
    }), setTimeout(
      () => {
        a.forEach((o) => {
          o.parentNode && o.parentNode.removeChild(o);
        });
      },
      300
    );
  }
  return n.addEventListener("touchmove", t), n.addEventListener("touchend", r), {
    destroy() {
      n.removeEventListener("touchmove", t), n.removeEventListener("touchend", r);
    }
  };
}
function ui(n, t = !0) {
  function r(s) {
    if (t && (s.ctrlKey || s.metaKey) && (s.key === "Enter" || s.key === "NumpadEnter")) {
      s.preventDefault();
      const a = n.__currentEditor, o = typeof a == "function" ? a() : a, l = n.__hasPostingCapability, d = typeof l == "function" ? l() : l, h = n.__hasStoredKey, S = typeof h == "function" ? h() : h, P = n.__postStatus, T = typeof P == "function" ? P() : P, p = o ? dr(o) : "";
      !T?.sending && p.trim() && (d ?? S) && n.__submitPost?.();
    }
  }
  return n.addEventListener("keydown", r), {
    destroy() {
      n.removeEventListener("keydown", r);
    }
  };
}
function gi(n) {
  let t = !1;
  return n?.descendants((r) => {
    if (t) return !1;
    const s = r.type?.name;
    (s === "image" || s === "video") && (t = !0);
  }), t;
}
function pi(n) {
  const { currentEditor: t, editorContainerEl: r, callbacks: s } = n, a = (d) => {
    const S = d.detail.plainText, P = t ? gi(t.state?.doc) : !1;
    s.onContentUpdate?.(S, P);
  }, o = (d) => {
    const h = d;
    s.onImageFullscreenRequest?.(h.detail.src, h.detail.alt || "", h.detail.mediaId);
  }, l = (d) => {
    const S = d?.detail?.pos;
    if (S != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const P = lr.create(t.state.doc, S);
        t.view.dispatch(t.state.tr.setSelection(P).scrollIntoView());
      } catch (P) {
        console.warn("select-image-node handler failed:", P);
      }
      s.onSelectImageNode?.(S);
    }
  };
  return window.addEventListener("editor-content-changed", a), window.addEventListener("image-fullscreen-request", o), window.addEventListener("select-image-node", l), r && (r.addEventListener("image-fullscreen-request", o), r.addEventListener("select-image-node", l)), {
    handleContentUpdate: a,
    handleImageFullscreenRequest: o,
    handleSelectImageNode: l
  };
}
function hi(n, t) {
  window.removeEventListener("editor-content-changed", n.handleContentUpdate), window.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), window.removeEventListener("select-image-node", n.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), t.removeEventListener("select-image-node", n.handleSelectImageNode));
}
function fi() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function vi(n) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (n?.rejectedRelays?.length ?? 0) > 0 || (n?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function mi(n) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: n || "postComponent.post_error",
    completed: !1
  };
}
function yi({
  updatePostStatus: n,
  clearContentAfterSuccess: t,
  onPostSuccess: r
}) {
  return {
    markSending: () => {
      n(fi());
    },
    markSuccess: (s) => {
      n(vi(s)), t(), r?.(s);
    },
    markFailure: (s) => {
      n(mi(s));
    }
  };
}
async function wi(n) {
  const t = n.postManager.prepareImageBlurhashMap(
    n.currentEditor,
    n.imageOxMap,
    n.imageXMap
  );
  n.onStart();
  try {
    const r = n.pendingEmojiTags?.length ? await n.postManager.submitPost(
      n.pendingPost,
      t,
      n.pendingEmojiTags
    ) : await n.postManager.submitPost(
      n.pendingPost,
      t
    );
    if (r.success) {
      n.onSuccess(r);
      return;
    }
    n.onFailure(r.error);
  } catch {
    n.onFailure();
  }
}
function _t(n) {
  if (n.dimensions && n.dimensions.width > 0 && n.dimensions.height > 0)
    return {
      width: n.dimensions.width,
      height: n.dimensions.height
    };
  const t = cr(n.dim);
  return t || {};
}
function bi(n) {
  if (!n.mediaFreePlacement)
    return n.galleryItems.filter((r) => !r.isPlaceholder).map((r) => {
      const s = _t({
        dim: r.dim,
        dimensions: r.dimensions
      });
      return {
        id: r.id,
        src: r.src,
        alt: r.alt,
        type: r.type,
        dim: r.dim,
        width: s.width,
        height: s.height
      };
    });
  if (!n.currentEditor)
    return [];
  const t = [];
  return n.currentEditor.state.doc.descendants((r) => {
    if ((r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder) {
      const s = _t({
        dim: r.attrs.dim
      });
      t.push({
        id: r.attrs.id,
        src: r.attrs.src,
        alt: r.attrs.alt,
        type: r.type.name,
        dim: r.attrs.dim,
        width: s.width,
        height: s.height
      });
    }
  }), t;
}
function Si(n, t, r) {
  if (t) {
    const s = n.findIndex((a) => a.id === t);
    if (s >= 0)
      return s;
  }
  return r ? n.findIndex((s) => s.src === r) : -1;
}
function Ei(n, t) {
  return n[t];
}
function xi(n) {
  const t = [];
  return n.state.doc.descendants((r, s) => {
    (r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder && t.push({ node: r, pos: s });
  }), t;
}
function Pi(n) {
  const t = xi(n.currentEditor);
  if (t.length === 0)
    return !1;
  t.forEach(({ node: s }) => {
    const a = s.attrs.src;
    a && n.addGalleryItem({
      id: n.createMediaItemId(),
      type: s.type.name,
      src: a,
      isPlaceholder: !1,
      blurhash: s.attrs.blurhash ?? void 0,
      ox: n.imageOxMap[a] ?? void 0,
      x: n.imageXMap[a] ?? void 0,
      dim: s.attrs.dim ?? void 0,
      size: typeof s.attrs.size == "number" ? s.attrs.size : void 0,
      alt: s.attrs.alt ?? void 0,
      uploadProtocol: s.attrs.uploadProtocol ?? void 0
    });
  });
  let r = n.currentEditor.state.tr;
  return [...t].reverse().forEach(({ node: s, pos: a }) => {
    r = r.delete(a, a + s.nodeSize);
  }), n.currentEditor.view.dispatch(r), !0;
}
function Fi(n) {
  if (n.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = n.currentEditor.state;
  let r = n.currentEditor.state.tr, s = n.currentEditor.state.doc.content.size;
  const a = {}, o = {};
  return n.items.forEach((l) => {
    if (l.isPlaceholder)
      return;
    const d = l.src;
    if (l.type === "image" && t.nodes.image) {
      const h = t.nodes.image.create({
        src: d,
        alt: l.alt ?? "Image",
        blurhash: l.blurhash ?? null,
        dim: l.dim ?? null,
        size: l.size ?? null,
        uploadProtocol: l.uploadProtocol ?? null
      });
      r = r.insert(s, h), s += h.nodeSize;
    } else if (l.type === "video" && t.nodes.video) {
      const h = t.nodes.video.create({ src: d });
      r = r.insert(s, h), s += h.nodeSize;
    }
    l.ox && (a[d] = l.ox), l.x && (o[d] = l.x);
  }), n.currentEditor.view.dispatch(r), {
    imageOxMap: a,
    imageXMap: o,
    hadItems: !0
  };
}
async function Ci(n) {
  const {
    input: t,
    postHistoryRepositoryImpl: r = At,
    postMediaCacheRepositoryImpl: s = gr
  } = n;
  await r.putPostedEvent(t);
  const a = ur(t.event).map((o) => o.url).filter(Boolean);
  a.length !== 0 && await s.linkEventIdByUrls({
    eventId: t.event.id,
    urls: a
  });
}
function _i(n) {
  const {
    placeholderText: t,
    editorContainerEl: r,
    hasStoredKey: s,
    hasPostingCapability: a,
    submitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: d,
    hostOwnedLite: h,
    uploadFiles: S,
    eventCallbacks: P
  } = n;
  pr.value = t;
  const T = hr({
    isInputBlocked: n.isInputBlocked,
    placeholderText: t,
    onSubmitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: d,
    hostOwnedLite: h,
    onCreate: (_) => {
      xe.set(_);
    }
  });
  let p = null;
  const C = T.subscribe((_) => {
    p = _;
  }), W = pi({
    currentEditor: p,
    editorContainerEl: r,
    callbacks: P
  });
  return fr(o), r && Object.assign(r, {
    __uploadFiles: S,
    __currentEditor: () => p,
    __hasStoredKey: () => s,
    __hasPostingCapability: () => a ?? s,
    __postStatus: () => R.postStatus,
    __submitPost: o
  }), { editor: T, unsubscribe: C, handlers: W };
}
function ki(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: r,
    handlers: s,
    currentEditor: a,
    editorContainerEl: o,
    submitPost: l
  } = n;
  hi(s, o), xe.value === a && xe.set(null), vr(l), r(), t(), a && !a.isDestroyed && a.destroy(), o && (delete o.__uploadFiles, delete o.__currentEditor, delete o.__hasStoredKey, delete o.__hasPostingCapability, delete o.__postStatus, delete o.__submitPost);
}
function Ii(n, t) {
  const r = n.view.dom;
  if (mr() && document.activeElement !== r) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
function Mi(n) {
  const t = n.view.dom, r = t.ownerDocument.defaultView;
  let s, a;
  const o = new Promise((h) => {
    a = h;
  }), l = (h) => {
    t.removeEventListener("compositionend", d), s !== void 0 && r.cancelAnimationFrame(s), s = void 0, a(h);
  };
  function d() {
    s !== void 0 && r.cancelAnimationFrame(s), s = r.requestAnimationFrame(() => {
      s = void 0, n.isDestroyed ? l(!1) : n.view.composing || l(!0);
    });
  }
  return t.addEventListener("compositionend", d), { settled: o, cancel: () => l(!1) };
}
var Di = ce('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), Ti = ce('<div class="plane-icon svg-icon svelte-15ticnd"></div>'), Li = ce('<div class="editor-submit-button-container svelte-15ticnd"><!></div>'), Ai = ce('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), Ri = ce('<div class="upload-error svelte-15ticnd"> </div>'), Hi = ce('<div class="svelte-15ticnd"> </div>'), Oi = ce('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const Wi = {
  hash: "svelte-15ticnd",
  code: `.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {min-height:0;}.editor-content,
  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;--post-editor-block-padding: 10px;--post-editor-line-height: 30px;--post-editor-submit-button-size: 40px;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--surface-editor);-webkit-tap-highlight-color:transparent;overflow:hidden;}.post-container.editor-auto-grow.svelte-15ticnd,
  .post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),
  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,
  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {flex:0 0 auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),
  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,
  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {height:auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd) {min-height:0;max-height:none;}.post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {min-height:calc(
      var(--post-editor-auto-grow-min-lines) + var(--post-editor-block-padding) +
        var(--post-editor-block-padding)
    );max-height:calc(
      var(--post-editor-auto-grow-max-lines) + var(--post-editor-block-padding) +
        var(--post-editor-block-padding)
    );}.editor-account-placeholder {position:absolute;top:11px;left:14px;z-index:3;width:28px;height:28px;opacity:0.5;pointer-events:none;user-select:none;-webkit-user-select:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,
  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {object-fit:cover;}.editor-container.account-avatar-placeholder.svelte-15ticnd
    p.is-editor-empty:first-child::before {padding-left:38px;}.editor-container.sending.svelte-15ticnd {background:color-mix(
      in srgb,
      var(--surface-editor) 82%,
      var(--surface-button) 18%
    );cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.editor-submit-enabled.sending.svelte-15ticnd .tiptap-editor {pointer-events:none;}.editor-container.sending.svelte-15ticnd .editor-image-button,
  .editor-container.sending.svelte-15ticnd .custom-emoji-drag-target,
  .editor-container.sending.svelte-15ticnd .media-delete-btn {pointer-events:none;}.editor-container.editor-submit-enabled.svelte-15ticnd .tiptap-editor {padding-inline-end:calc(var(--post-editor-block-padding) + 40px);}.editor-submit-button-container.svelte-15ticnd {position:absolute;inset-inline-end:var(--post-editor-block-padding);bottom:var(--post-editor-block-padding);z-index:4;inset-inline-end:14px;}.post-container.editor-auto-grow.svelte-15ticnd .editor-submit-button-container:where(.svelte-15ticnd) {bottom:calc(
      var(--post-editor-block-padding) +
        (var(--post-editor-line-height) - var(--post-editor-submit-button-size)) /
        2
    );}.editor-submit-button {width:var(--post-editor-submit-button-size);height:var(--post-editor-submit-button-size);flex:0 0 var(--post-editor-submit-button-size);}button.editor-submit-button .plane-icon.svg-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-70617065722d706c616e652d736f6c69642d66756c6c2e737667);margin-inline-end:1px;margin-top:1px;}.editor-container.drag-over.svelte-15ticnd {border:3px dashed var(--theme);}

  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */.editor-container.gallery-mode.svelte-15ticnd .tiptap-dropcursor {display:none !important;}

  /* Tiptapエディターのスタイル */.tiptap-editor {display:block;padding:var(--post-editor-block-padding);font-family:inherit;font-size:1.25rem;line-height:var(--post-editor-line-height);outline:none;overflow-y:auto;overflow-x:hidden;scroll-padding-bottom:16px;scroll-behavior:auto;will-change:scroll-position;transform:translateZ(0);-webkit-tap-highlight-color:transparent;.editor-paragraph {margin:0;padding:0;color:var(--text);position:relative;z-index:2;word-break:normal;overflow-wrap:anywhere;line-break:loose;white-space:break-spaces;}.hashtag {color:var(--hashtag-text);font-weight:600;background:var(--hashtag-bg);padding:2px 4px;border-radius:4px;word-break:break-all;}.preview-link {color:var(--link);word-break:break-all;}.preview-link:visited {color:var(--link-visited);}p.is-editor-empty:first-child::before {color:var(--text);content:attr(data-placeholder);float:left;height:0;pointer-events:none;opacity:0.6;}.toolbar-caret {display:inline-block;width:0;height:1.5em;margin-left:-1px;border-left:2px solid var(--text);vertical-align:-0.25em;pointer-events:none;
      animation: svelte-15ticnd-toolbar-caret-blink 1s steps(1) infinite;}}

  @keyframes svelte-15ticnd-toolbar-caret-blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }

  /* ドロップゾーンのフェードアウトアニメーション（改善版） */.drop-zone-fade-out {
    animation: svelte-15ticnd-dropZoneFadeOut 0.3s ease-out forwards;}

  @keyframes svelte-15ticnd-dropZoneFadeOut {
    from {
      opacity: 0.9;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  /* タッチデバイス用の追加スタイル */
  @media (hover: none) and (pointer: coarse) {.editor-container.svelte-15ticnd {-webkit-tap-highlight-color:transparent;will-change:scroll-position;}

    /* ドラッグ中の視覚フィードバック強化 */.editor-image-button[data-dragging="true"] {z-index:1;}.tiptap-editor {-webkit-user-select:text;user-select:text;-webkit-transform:translateZ(0);transform:translateZ(0);backface-visibility:hidden;}
  }

  /* ProseMirror のギャップカーソルの色を上書き（Light / Dark 対応） */.tiptap-editor .ProseMirror-gapcursor:after,
  .tiptap-editor .ProseMirror-gapcursor:before {border-top-color:light-dark(black, white);}`
};
function Ni(n, t) {
  tt(t, !0), Ye(n, Wi);
  const r = () => Ze(Je, "$_", s), [s, a] = Ve();
  let o = j(t, "rxNostr", 7), l = j(t, "hasStoredKey", 7), d = j(t, "hasPostingCapability", 23, l), h = j(t, "isSwitchingAccount", 7, !1), S = j(t, "onPostSuccess", 7), P = j(t, "availableComposerHeight", 7, Ce), T = j(t, "minEditorHeight", 7, Ce), p = j(t, "onCustomEmojiSelect", 7), C = j(t, "onEditorEmptyChange", 7), W = j(t, "notificationPort", 7), _ = j(t, "hostOwnedConfig", 7), te = j(t, "hostCustomEmojiItems", 23, () => []), ne = j(t, "normalUploadFiles", 7);
  const Y = !1;
  let G = E(() => !Y), H = E(() => R.isUploading), ge = E(() => R.canPost), Z = E(() => Y), oe = V(null), c = V(null), pe, me = V(!1), k = V(void 0), F = V(void 0), m = V(Ne({})), D = V(Ne({})), L = E(() => Ge.value), O = E(() => R.postStatus), v = E(() => R.uploadErrorMessage), f = E(() => Br.value), U = E(() => Dr.value), A = E(() => Tr.value), I = V(!0), K = !1, z = E(() => l() && !h() && e(U) && !e(A) && e(I)), J = null, g = null, M = null, Q = null, X = V(Ne(Ce)), ye = E(() => Y), zt = E(() => e(ye) ? `--post-editor-auto-grow-min-lines: ${_().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${_().editorMaxLines}lh;` : `--post-editor-min-height: ${T()}px; --post-editor-target-height: ${e(X)}px;`), rt = E(() => r()("postComponent.enter_your_text") || "テキストを入力してください");
  be(() => {
    e(c), yr(e(rt));
  }), be(() => {
  });
  function it() {
    if (e(ye)) return;
    const i = T();
    if (!J || !g) {
      b(X, i, !0);
      return;
    }
    const u = Array.from(J.children).reduce(
      (x, w) => w === g ? x : x + Ar(w),
      0
    ), y = Rr({
      availableComposerHeight: P(),
      nonEditorHeight: u,
      minHeight: i
    });
    e(X) !== y && b(X, y, !0);
  }
  function Bt(i) {
    if (e(O).sending) {
      i.preventDefault();
      return;
    }
    !(i.target instanceof HTMLElement) || !e(c) || Mr(i.target) || e(c).commands.focus("end");
  }
  function jt(i) {
    !e(c) || i.currentTarget !== i.target || i.key !== "Enter" && i.key !== " " || (i.preventDefault(), e(c).commands.focus("end"));
  }
  function qt(i) {
    e(O).sending && (i.preventDefault(), i.stopPropagation());
  }
  function Ae(i) {
    e(O).sending && (i.preventDefault(), i.stopPropagation());
  }
  function Ut(i) {
    i.preventDefault();
  }
  function Kt(i) {
    const u = e(c)?.view.dom;
    !e(Z) || !u || i.relatedTarget !== u || u.focus({ preventScroll: !0 });
  }
  let we = E(() => ae.value), ze = E(() => e(we).showSecretKeyDialog), ot = E(() => e(we).showImageFullscreen), Xt = E(() => e(we).fullscreenMediaId), st = E(() => e(we).fullscreenImageSrc), Gt = E(() => e(we).fullscreenImageAlt), at = E(() => e(we).showFloatingMessage), Qt = E(() => e(we).floatingMessageX), $t = E(() => e(we).floatingMessageY), Yt = E(() => e(we).floatingMessageText);
  be(() => {
    o() && (e(F) ? e(F).setRxNostr(o()) : b(
      F,
      new Kr(o(), {
        getNip46SignerForSessionFn: (i) => Sr.getSignerForSession(i),
        getParentClientSignerFn: () => br.getSigner(),
        channelContextState: wr,
        replyQuoteState: Mt,
        replyQuoteService: new We(),
        clearReplyQuoteFn: Qe,
        savePostHistoryFn: (i) => Ci({ input: i, postHistoryRepositoryImpl: At }),
        notificationPort: W()
      }),
      !0
    ));
  });
  const Be = $r({
    getCurrentEditor: () => e(c),
    getFileInput: () => e(k),
    getImageOxMap: () => e(m),
    getImageXMap: () => e(D),
    getUploadFailedText: (i) => r()(i),
    updateUploadState: (i, u) => {
      Gr(R, i, u);
    },
    setUploadErrorMessage: (i) => {
      R.uploadErrorMessage = i;
    },
    uploadFiles: async (i) => {
      if (e(O).sending || R.isSubmitPending || R.isUploading || Y)
        return null;
      {
        if (ne()) return await ne()(i);
        const { uploadFiles: u } = await import("./App-BmKERuNr.js").then((y) => y.et);
        return await u(i);
      }
    }
  }), Pe = yi({
    updatePostStatus: Pt,
    clearContentAfterSuccess: dt,
    onPostSuccess: (i) => S()?.(i)
  });
  be(() => {
    if (e(ye)) return;
    if (P(), T(), e(L), e(v), e(c), e(L) || de.items.length, typeof window > "u") {
      b(X, Ce, !0);
      return;
    }
    const i = window.requestAnimationFrame(() => {
      it();
    });
    return () => {
      window.cancelAnimationFrame(i);
    };
  }), be(() => {
    if (e(ye) || (P(), T(), e(c), e(L), e(v), !J || typeof ResizeObserver > "u"))
      return;
    let i = null;
    const u = () => {
      i === null && (i = window.requestAnimationFrame(() => {
        i = null, it();
      }));
    }, y = new ResizeObserver(u);
    u(), y.observe(J);
    for (const x of Array.from(J.children))
      x !== g && y.observe(x);
    return () => {
      y.disconnect(), i !== null && window.cancelAnimationFrame(i);
    };
  }), Er(() => {
    M = _i({
      isInputBlocked: () => R.postStatus.sending,
      placeholderText: e(rt),
      editorContainerEl: g,
      currentEditor: e(c),
      hasStoredKey: l(),
      hasPostingCapability: d(),
      submitPost: Re,
      onCustomEmojiSelect: p(),
      enterKeyBehavior: void 0,
      hostOwnedLite: Y,
      uploadFiles: e(G) ? (w) => {
        Be.performUpload(w);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: Lr,
        onImageFullscreenRequest: (w, B, se) => {
          ae.showImageFullscreen(w, B, se || "");
        },
        onSelectImageNode: (w) => {
        }
      }
    }), b(oe, M.editor, !0);
    let i = null;
    const u = (w) => {
      const B = w.isEmpty, se = !K || e(I) !== B;
      b(I, B, !0), K = !0, se && C()?.(B);
    }, y = ({ editor: w }) => {
      u(w);
    };
    Q = e(oe).subscribe((w) => {
      i && i.off("transaction", y), i = w, b(c, w, !0), w && u(w), w?.on("transaction", y), xe.set(w);
    });
    const x = (w) => {
      const B = w, { src: se, alt: Ke, mediaId: Ln } = B.detail;
      ae.showImageFullscreen(se, Ke, Ln || "");
    };
    return window.addEventListener("image-fullscreen-request", x), () => {
      pe?.cancel(), pe = void 0, xe.value === e(c) && (R.isSubmitPending = !1, ae.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", x), M && (i && i.off("transaction", y), ki({
        unsubscribe: M.unsubscribe,
        componentUnsubscribe: Q ?? (() => {
        }),
        handlers: M.handlers,
        currentEditor: e(c),
        editorContainerEl: g,
        submitPost: Re
      }), Q = null);
    };
  });
  const Vt = Be.handleFileSelect;
  async function Zt(i) {
    return await Be.performUpload(i);
  }
  function Jt() {
    e(c)?.commands.focus();
  }
  function en() {
    e(c)?.commands.blur();
  }
  function tn(i) {
    if (!e(c) || !i) return;
    const u = e(
      c
      // nullチェック済みのローカル変数
    ), x = i.split(`
`).map((w) => ({
      type: "paragraph",
      content: w ? [{ type: "text", text: w }] : void 0
    }));
    u.commands.setContent({ type: "doc", content: x }), u.commands.focus("end");
  }
  function nn(i) {
    if (!e(c) || !i) return !1;
    const y = i.split(`
`).map((x) => ({
      type: "paragraph",
      content: x ? [{ type: "text", text: x }] : void 0
    }));
    return e(c).isEmpty ? e(c).commands.setContent({ type: "doc", content: y }) : e(c).chain().focus("end").insertContent([{ type: "paragraph" }, ...y]).run(), e(c).commands.focus("end"), !0;
  }
  function rn(i) {
    if (!e(c) || !i) return;
    const u = Pr(i);
    e(c).commands.setContent(u || "<p></p>"), e(c).commands.focus("end");
  }
  function on() {
    return e(c) ? e(c).getHTML() : "";
  }
  function sn(i) {
    if (!e(c) || i.length === 0) return;
    const { schema: u } = e(c).state;
    let y = e(c).state.tr, x = e(c).state.doc.content.size;
    i.forEach((w) => {
      if (w.isPlaceholder) return;
      const B = w.src;
      if (w.type === "image" && u.nodes.image) {
        const se = u.nodes.image.create({
          src: B,
          alt: w.alt ?? "Image",
          blurhash: w.blurhash ?? null,
          dim: w.dim ?? null,
          size: w.size ?? null,
          uploadProtocol: w.uploadProtocol ?? null
        });
        y = y.insert(x, se), x += se.nodeSize, w.ox && b(m, { ...e(m), [B]: w.ox }, !0), w.x && b(D, { ...e(D), [B]: w.x }, !0);
      } else if (w.type === "video" && u.nodes.video) {
        const se = u.nodes.video.create({ src: B });
        y = y.insert(x, se), x += se.nodeSize;
      }
    }), e(c).view.dispatch(y), e(c).commands.focus("end");
  }
  function an(i) {
    !e(c) || e(O).sending || Ii(e(c), i);
  }
  function je() {
    if (!e(c)) return;
    kr(e(c).view.dom) || Ir(e(c));
  }
  function lt(i) {
    if (!e(c) || e(O).sending) return;
    je();
    const { state: u, view: y } = e(c), x = i < 0 ? u.selection.from : u.selection.to, w = Math.max(0, Math.min(u.doc.content.size, x + i));
    if (w === x) return;
    const B = _r.near(u.doc.resolve(w), i);
    y.dispatch(u.tr.setSelection(B).scrollIntoView().setMeta("addToHistory", !1));
  }
  function ln() {
    lt(-1);
  }
  function dn() {
    lt(1);
  }
  function cn() {
    if (!e(c) || e(O).sending) return;
    je();
    const { state: i, view: u } = e(c), { selection: y } = i;
    if (!y.empty) {
      e(c).commands.deleteSelection();
      return;
    }
    const w = y.$from.nodeBefore;
    if (w) {
      const B = w.isText ? Array.from(w.text ?? "").at(-1)?.length ?? 0 : w.nodeSize;
      B > 0 && u.dispatch(i.tr.delete(y.from - B, y.from).scrollIntoView());
      return;
    }
    e(c).commands.first(({ commands: B }) => [
      () => B.joinBackward(),
      () => B.selectNodeBackward()
    ]);
  }
  function un() {
    !e(c) || e(O).sending || (je(), e(c).commands.keyboardShortcut("Enter"));
  }
  function gn() {
    return qe() && R.canPost && !R.isSubmitPending && !e(ze);
  }
  function qe() {
    return !!e(c) && !!e(F) && !h() && !e(O).sending && !R.isUploading && !e(O).completed && d();
  }
  async function Re(i) {
    if (!e(c) || !gn() || !e(F)) return;
    const u = e(c);
    R.isSubmitPending = !0;
    try {
      if (u.view.composing) {
        pe = Mi(u);
        const x = await pe.settled;
        if (pe = void 0, !x) return;
      }
      if (u.isDestroyed || xe.value !== u || !qe()) return;
      const y = e(F).preparePostPayload(u);
      if (!y.content.trim()) return;
      if (Fr(y.content)) {
        ae.showSecretKeyDialog(y.content, y.emojiTags), R.isSubmitPending = !1;
        return;
      }
      await e(F).performPostSubmission(
        u,
        y,
        e(m),
        e(D),
        () => {
          Pe.markSending(), R.isSubmitPending = !1;
        },
        Pe.markSuccess,
        Pe.markFailure
      );
    } finally {
      xe.value === u && (R.isSubmitPending = !1);
    }
  }
  function pn() {
    if (e(c)) {
      if (e(F)) {
        e(F).resetPostContent(e(c));
        return;
      }
      e(c).chain().clearContent().run();
    }
  }
  function dt() {
    if (e(F) && e(c)) {
      e(F).clearContentAfterSuccess(e(c));
      return;
    }
    if (e(c)) {
      const i = _()?.hashtagPinEnabled === !0 && Dt.value ? [...Tt().hashtags] : [];
      e(c).chain().clearContent().run(), kt.reset(), It.reset(), de.clearAll(), b(m, {}, !0), b(D, {}, !0), Qe(), i.length > 0 && e(c).commands.insertContent(` ${i.map((u) => `#${u}`).join(" ")}`), e(c).commands.focus("start");
    }
  }
  async function hn() {
    if (!e(ze) || !qe()) return;
    const i = ae.getPendingPost(), u = ae.getPendingEmojiTags();
    i.trim() && e(F) && e(c) && await wi({
      postManager: e(F),
      currentEditor: e(c),
      imageOxMap: e(m),
      imageXMap: e(D),
      pendingPost: i,
      pendingEmojiTags: u,
      onStart: () => {
        Pe.markSending(), ae.hideSecretKeyDialog();
      },
      onSuccess: Pe.markSuccess,
      onFailure: Pe.markFailure
    });
  }
  const fn = ae.hideSecretKeyDialog, vn = ae.hideImageFullscreen;
  let Ue = E(() => bi({
    mediaFreePlacement: e(L),
    galleryItems: de.items,
    currentEditor: e(c)
  })), mn = E(() => Si(e(Ue), e(Xt), e(st)));
  function yn(i) {
    const u = Ei(e(Ue), i);
    u && ae.showImageFullscreen(u.src, u.alt ?? "", u.id ?? "");
  }
  be(() => {
    e(c) && e(F) && e(F).preparePostContent(e(c)) !== R.content && e(O).error && Pt({ ...e(O), error: !1, message: "" });
  });
  function wn() {
    !e(G) || e(O).sending || R.isSubmitPending || R.isUploading || e(k)?.click();
  }
  be(() => {
    const i = de.items.some((x) => !x.isPlaceholder), u = !!R.content.trim(), y = R.hasImage;
    R.canPost = u || y || i;
  });
  let ct = !0;
  be(() => {
    const i = !Ge.value;
    if (ct) {
      ct = !1;
      return;
    }
    if (!e(c)) return;
    const u = e(c);
    if (i)
      Me(() => Pi({
        currentEditor: u,
        imageOxMap: e(m),
        imageXMap: e(D),
        addGalleryItem: (x) => de.addItem(x),
        createMediaItemId: Cr
      })) && Me(() => {
        b(m, {}, !0), b(D, {}, !0);
      });
    else {
      const y = Me(() => de.getItems()), x = Fi({ currentEditor: u, items: y });
      x.hadItems && Me(() => {
        b(m, x.imageOxMap, !0), b(D, x.imageXMap, !0);
      }), Me(() => de.clearAll());
    }
  });
  var bn = {
    uploadFiles: Zt,
    focusEditor: Jt,
    blurEditor: en,
    insertTextContent: tn,
    appendSharedTextContent: nn,
    loadDraftContent: rn,
    getEditorHtml: on,
    appendMediaToEditor: sn,
    insertCustomEmoji: an,
    moveCaretLeft: ln,
    moveCaretRight: dn,
    deleteBackward: cn,
    insertLineBreak: un,
    submitPost: Re,
    resetPostContent: pn,
    clearContentAfterSuccess: dt,
    openFileDialog: wn,
    get rxNostr() {
      return o();
    },
    set rxNostr(i) {
      o(i), q();
    },
    get hasStoredKey() {
      return l();
    },
    set hasStoredKey(i) {
      l(i), q();
    },
    get hasPostingCapability() {
      return d();
    },
    set hasPostingCapability(i = l) {
      d(i), q();
    },
    get isSwitchingAccount() {
      return h();
    },
    set isSwitchingAccount(i = !1) {
      h(i), q();
    },
    get onPostSuccess() {
      return S();
    },
    set onPostSuccess(i) {
      S(i), q();
    },
    get availableComposerHeight() {
      return P();
    },
    set availableComposerHeight(i = Ce) {
      P(i), q();
    },
    get minEditorHeight() {
      return T();
    },
    set minEditorHeight(i = Ce) {
      T(i), q();
    },
    get onCustomEmojiSelect() {
      return p();
    },
    set onCustomEmojiSelect(i) {
      p(i), q();
    },
    get onEditorEmptyChange() {
      return C();
    },
    set onEditorEmptyChange(i) {
      C(i), q();
    },
    get notificationPort() {
      return W();
    },
    set notificationPort(i) {
      W(i), q();
    },
    get hostOwnedConfig() {
      return _();
    },
    set hostOwnedConfig(i) {
      _(i), q();
    },
    get hostCustomEmojiItems() {
      return te();
    },
    set hostCustomEmojiItems(i = []) {
      te(i), q();
    },
    get normalUploadFiles() {
      return ne();
    },
    set normalUploadFiles(i) {
      ne(i), q();
    }
  }, ut = Oi(), Fe = Ht(ut);
  let gt;
  var $ = ve(Fe);
  let pt;
  var ht = ve($);
  {
    var Sn = (i) => {
      var u = Di(), y = ve(u);
      {
        let x = E(() => e(f)?.picture || "");
        Hr(y, {
          get src() {
            return e(x);
          },
          alt: "",
          fallbackAriaLabel: "",
          rootClassName: "editor-account-placeholder-avatar",
          imageClassName: "editor-account-placeholder-image",
          fallbackClassName: "editor-account-placeholder-fallback"
        });
      }
      fe(u), ie(i, u);
    };
    re(ht, (i) => {
      e(z) && i(Sn);
    });
  }
  var ft = le(ht, 2);
  {
    var En = (i) => {
      Or(i, {
        get editor() {
          return e(c);
        },
        class: "editor-content"
      });
    };
    re(ft, (i) => {
      e(oe) && e(c) && i(En);
    });
  }
  var xn = le(ft, 2);
  {
    var Pn = (i) => {
      var u = Li(), y = ve(u);
      {
        let x = E(() => !e(ge) || e(O).sending || e(H) || !d() || e(O).completed), w = E(() => r()("postComponent.post"));
        Wr(y, {
          variant: "primary",
          shape: "circle",
          contentLayout: "icon",
          className: "editor-submit-button",
          get disabled() {
            return e(x);
          },
          onClick: () => {
            !e(ge) || e(O).sending || e(H) || !d() || e(O).completed || Re();
          },
          onfocus: Kt,
          get ariaLabel() {
            return e(w);
          },
          children: (B, se) => {
            var Ke = Ti();
            ie(B, Ke);
          },
          $$slots: { default: !0 }
        });
      }
      fe(u), ee("pointerdown", u, Ut, !0), ie(i, u);
    };
    re(xn, (i) => {
      e(Z) && i(Pn);
    });
  }
  fe($), Oe($, (i, u) => li?.(i, u), () => ({ dragOver: (i) => b(me, i, !0) })), Oe($, (i) => di?.(i)), Oe($, (i) => ci?.(i)), Oe($, (i, u) => ui?.(i, u), () => !Y), _e($, (i) => g = i, () => g);
  var vt = le($, 2);
  {
    var Fn = (i) => {
      Wt(i, {});
    };
    re(vt, (i) => {
      e(L) || i(Fn);
    });
  }
  var mt = le(vt, 2);
  {
    var Cn = (i) => {
      var u = Ai();
      _e(u, (y) => b(k, y), () => e(k)), Se("change", u, Vt), ie(i, u);
    };
    re(mt, (i) => {
      e(G) && i(Cn);
    });
  }
  var _n = le(mt, 2);
  {
    var kn = (i) => {
      var u = Ri(), y = ve(u, !0);
      fe(u), Ee(() => Ft(y, e(v))), ie(i, u);
    };
    re(_n, (i) => {
      e(v) && i(kn);
    });
  }
  fe(Fe), _e(Fe, (i) => J = i, () => J);
  var yt = le(Fe, 2);
  {
    var In = (i) => {
      {
        let u = E(() => r()("postComponent.warning")), y = E(() => r()("postComponent.secret_key_detected")), x = E(() => r()("postComponent.post")), w = E(() => r()("postComponent.cancel"));
        Nr(i, {
          get open() {
            return e(ze);
          },
          get title() {
            return e(u);
          },
          get description() {
            return e(y);
          },
          get confirmLabel() {
            return e(x);
          },
          get cancelLabel() {
            return e(w);
          },
          confirmVariant: "danger",
          onConfirm: hn,
          get onCancel() {
            return fn;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    re(yt, (i) => {
      i(In);
    });
  }
  var wt = le(yt, 2);
  xr(wt, {
    get src() {
      return e(st);
    },
    get alt() {
      return e(Gt);
    },
    get onClose() {
      return vn;
    },
    get mediaList() {
      return e(Ue);
    },
    get currentIndex() {
      return e(mn);
    },
    onNavigate: yn,
    get show() {
      return e(ot);
    },
    set show(i) {
      b(ot, i);
    }
  });
  var Mn = le(wt, 2);
  {
    var Dn = (i) => {
      zr(i, {
        get show() {
          return e(at);
        },
        get x() {
          return e(Qt);
        },
        get y() {
          return e($t);
        },
        children: (u, y) => {
          var x = Hi(), w = ve(x, !0);
          fe(x), Ee(() => Ft(w, e(Yt))), ie(u, x);
        },
        $$slots: { default: !0 }
      });
    };
    re(Mn, (i) => {
      e(at) && i(Dn);
    });
  }
  Ee(
    (i) => {
      gt = ke(Fe, 1, "post-container svelte-15ticnd", null, gt, { "editor-auto-grow": e(ye) }), Lt(Fe, e(zt)), pt = ke($, 1, "editor-container svelte-15ticnd", null, pt, {
        "drag-over": e(me),
        "gallery-mode": !e(L),
        sending: e(O).sending,
        "editor-submit-enabled": e(Z),
        "account-avatar-placeholder": e(z)
      }), he($, "aria-label", i), he($, "aria-disabled", e(O).sending ? "true" : void 0);
    },
    [() => r()("postComponent.editor_label")]
  ), Se("click", $, Bt), ee("keydown", $, qt, !0), Se("keydown", $, jt), ee("beforeinput", $, Ae, !0), ee("paste", $, Ae, !0), ee("cut", $, Ae, !0), ee("drop", $, Ae, !0), ie(n, ut);
  var Tn = nt(bn);
  return a(), Tn;
}
Rt(["click", "keydown", "change"]);
et(
  Ni,
  {
    rxNostr: {},
    hasStoredKey: {},
    hasPostingCapability: {},
    isSwitchingAccount: {},
    onPostSuccess: {},
    availableComposerHeight: {},
    minEditorHeight: {},
    onCustomEmojiSelect: {},
    onEditorEmptyChange: {},
    notificationPort: {},
    hostOwnedConfig: {},
    hostCustomEmojiItems: {},
    normalUploadFiles: {}
  },
  [],
  [
    "uploadFiles",
    "focusEditor",
    "blurEditor",
    "insertTextContent",
    "appendSharedTextContent",
    "loadDraftContent",
    "getEditorHtml",
    "appendMediaToEditor",
    "insertCustomEmoji",
    "moveCaretLeft",
    "moveCaretRight",
    "deleteBackward",
    "insertLineBreak",
    "submitPost",
    "resetPostContent",
    "clearContentAfterSuccess",
    "openFileDialog"
  ],
  { mode: "open" }
);
export {
  Ni as default
};
