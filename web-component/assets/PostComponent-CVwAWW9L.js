import { a as vn, h as gt, m as Be, b as re, c as St, d as bt, k as mn, e as yn, s as wn, w as Sn, r as Et, f as bn, i as ht, j as En, l as Pn, n as xn, o as Fn, p as Cn, q as Pt, t as _n, u as qe, P as In, v as kn, x as De, y as Mn, z as Tn, A as Dn, B as Ln, C as An, R as Ae, D as Rn, E as xt, F as Hn, G as On, H as Ke, I as B, J as Wn, K as se, L as Pe, M as ke, N as oe, O as Ft, Q as Xe, S as Nn, T as zn, U as jn, V as Ge, $ as Qe, W as Bn, X as J, Y as Ce, Z as pt, _ as qn, a0 as Un, a1 as ft, a2 as Kn, a3 as Xn, a4 as Ct, a5 as Gn, a6 as Qn, a7 as $n, a8 as Yn, a9 as He, aa as Vn, ab as Zn, ac as Jn, ad as Ee, ae as er, af as tr, ag as nr, ah as rr, ai as sr, aj as vt, ak as Le, al as ar, am as ir, an as or, ao as lr, ap as cr, aq as dr, ar as ur, as as gr, at as hr, au as pr, av as fr, aw as vr, ax as mr, ay as yr, az as wr, aA as Sr, aB as br, aC as Er } from "./App-GbqYleiC.js";
import { bk as je, aJ as Re, aq as _t, b6 as $e, b0 as Ye, a as e, bf as le, b as w, Z as we, bC as fe, ap as ye, b3 as ce, b4 as Ve, aS as G, ba as ge, b8 as ve, aR as x, b5 as q, bg as Pr, b9 as ue, aN as pe, b1 as xr, b2 as It, bl as Fr, u as _e, bi as mt } from "./entry-BQ9RlsLv.js";
class Cr {
  constructor(t, r = {}) {
    this.deps = r, t && this.setRxNostr(t), this.deps.console = r.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = r.authStateStore || vn, this.deps.hashtagStore = r.hashtagStore || gt, this.deps.mediaFreePlacementStore = r.mediaFreePlacementStore || Be, this.deps.mediaGalleryStore = r.mediaGalleryStore || re, this.deps.contentWarningStore = r.contentWarningStore || St, this.deps.contentWarningReasonStore = r.contentWarningReasonStore || bt, this.deps.keyManager = r.keyManager || mn, this.deps.createImetaTagFn = r.createImetaTagFn || yn, this.deps.settingsStore = r.settingsStore || wn, this.deps.writeRelaysStore = r.writeRelaysStore || Sn, this.deps.replyQuoteState = r.replyQuoteState || Et, this.deps.getClientTagFn = r.getClientTagFn || (() => bn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = r.seckeySignerFn || ht, this.deps.extractContentWithImagesFn = r.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = r.extractContentWithEmojiTagsFn || (r.extractContentWithImagesFn ? (i) => ({ content: r.extractContentWithImagesFn(i), emojiTags: [] }) : En), this.deps.extractImageBlurhashMapFn = r.extractImageBlurhashMapFn || Pn, this.deps.resetEditorStateFn = r.resetEditorStateFn || xn, this.deps.resetPostStatusFn = r.resetPostStatusFn || Fn, this.deps.notificationPort = r.iframeMessageService || r.notificationPort || Cn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = r.hashtagPinStore || Pt, this.deps.saveHashtagsToHistoryFn = r.saveHashtagsToHistoryFn || _n, this.deps.clearReplyQuoteFn = r.clearReplyQuoteFn || qe;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new In(t, this.deps.console || console);
  }
  clearReplyQuoteAfterSuccess() {
    this.deps.clearReplyQuoteFn?.();
  }
  getReplyQuoteNotifyOptions() {
    const t = this.deps.replyQuoteState.value, r = Array.from(
      new Set(t.quotes.map((i) => i.eventId))
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
    return kn.buildEvent(
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
  finalizeSubmittedPost(t, r, i) {
    return t.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(r)).catch(() => {
      this.deps.console?.warn?.("hashtag_history_save_failed", {
        stage: "post-success",
        reason: "unexpected"
      });
    }), this.clearReplyQuoteAfterSuccess(), this.deps.notificationPort?.notifyPostSuccess({
      ...i,
      ...t.eventId ? { eventId: t.eventId } : {}
    }), t) : (this.deps.notificationPort?.notifyPostError(t.error), t);
  }
  async saveSubmittedPostHistory(t) {
    if (!t.result.success || !this.deps.savePostHistoryFn) return;
    const r = je.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), i = je.sanitizeExternalRelayUrls([
      ...r,
      ...t.additionalWriteRelays ?? [],
      ...this.deps.writeRelaysStore?.value ?? []
    ], { limit: 3 });
    try {
      await this.deps.savePostHistoryFn({
        event: t.event,
        attestation: t.attestation,
        acceptedRelays: r,
        relayHints: i
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
    De(this.deps.authStateStore, t.sessionPubkey);
    const i = Mn(t.event), o = r ? await r(i.signerTemplate) : t.event;
    De(this.deps.authStateStore, t.sessionPubkey);
    let a;
    try {
      a = Tn(
        i.expectedTemplate,
        o,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    De(this.deps.authStateStore, t.sessionPubkey);
    const c = Dn(a);
    if (!c)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: a?.kind ?? "(missing)"
    }), r && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), De(this.deps.authStateStore, t.sessionPubkey);
    const d = await this.eventSender.sendEvent(c.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: d.success
    });
    const f = d.success ? {
      ...d,
      eventId: d.eventId ?? c.event.id,
      event: c.event
    } : d;
    return await this.saveSubmittedPostHistory({
      event: c.event,
      attestation: c.attestation,
      result: f,
      additionalWriteRelays: t.additionalWriteRelays
    }), this.finalizeSubmittedPost(
      f,
      t.hashtags,
      t.rqNotifyOptions
    );
  }
  // 外部APIは変更なし（後方互換性のため）
  validatePost(t) {
    const r = this.deps.authStateStore;
    return Ln.validatePost(
      t,
      r.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, r, i = []) {
    let o = An(t);
    const a = this.deps.settingsStore.quoteNotificationEnabled, c = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      o,
      a
    ) ?? new Ae().extractInlineQuoteTags(
      o,
      a
    ), d = this.deps.replyQuoteState.value;
    if (d.quotes.length > 0) {
      const y = this.deps.replyQuoteService || new Ae(), P = new Set(
        c.filter((p) => p[0] === "q").map((p) => p[1])
      ), k = d.quotes.filter((p) => !P.has(p.eventId)).map(
        (p) => y.generateNostrUri(
          p.eventId,
          p.relayHints,
          p.authorPubkey
        )
      );
      k.length > 0 && (o = `${o.trimEnd()}
${k.join(`
`)}`.trim());
    }
    const f = this.validatePost(o);
    if (!f.valid)
      return this.notifyPostFailure(f.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    if (On() && je.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const y = this.deps.authStateStore, P = Rn(y), k = this.deps.hashtagStore, { hashtags: p, tags: C } = this.getHashtagArrays(k), T = this.deps.keyManager, D = this.deps.window || (typeof window < "u" ? window : void 0), Q = this.deps.contentWarningStore.value, he = this.deps.contentWarningReasonStore.value, ee = this.deps.channelContextState?.value ?? null, Z = ee?.channelRelays, K = this.deps.replyQuoteState.value;
      let l;
      const ae = this.getReplyQuoteNotifyOptions();
      if (K.reply || K.quotes.length > 0) {
        const E = this.deps.replyQuoteService || new Ae();
        l = [], K.reply && (ee ? (l.push([
          "e",
          K.reply.eventId,
          K.reply.relayHints[0] || "",
          "reply",
          ...K.reply.authorPubkey ? [K.reply.authorPubkey] : []
        ]), E.buildReplyTags(K.reply).filter((U) => U[0] === "p").forEach((U) => {
          l.push(U);
        })) : l.push(...E.buildReplyTags(K.reply)));
        const L = /* @__PURE__ */ new Set(), S = new Set(
          l.filter((U) => U[0] === "p").map((U) => U[1])
        );
        K.quotes.forEach((U) => {
          E.buildQuoteTags(U, U.quoteNotificationEnabled).forEach((z) => {
            if (z[0] === "q") {
              if (L.has(z[1]))
                return;
              L.add(z[1]);
            }
            if (z[0] === "p") {
              if (S.has(z[1]))
                return;
              S.add(z[1]);
            }
            l.push(z);
          });
        });
      }
      if (c.length > 0) {
        l || (l = []);
        const E = new Set(
          l.filter((S) => S[0] === "q").map((S) => S[1])
        ), L = new Set(
          l.filter((S) => S[0] === "p").map((S) => S[1])
        );
        for (const S of c)
          S[0] === "q" && !E.has(S[1]) ? (l.push(S), E.add(S[1])) : S[0] === "p" && !L.has(S[1]) && (l.push(S), L.add(S[1]));
      }
      const X = y.value;
      if (X.type === "nip07" && T.isWindowNostrAvailable() && D?.nostr)
        try {
          const E = X.pubkey;
          if (!E)
            return this.notifyPostFailure("pubkey_not_found");
          const L = typeof D.nostr.signEvent == "function" ? D.nostr.signEvent.bind(D.nostr) : void 0;
          if (!L)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const S = await this.buildSubmissionEvent({
            processedContent: o,
            hashtags: p,
            tags: C,
            pubkey: E,
            imageImetaMap: r,
            contentWarningEnabled: Q,
            contentWarningReason: he,
            replyQuoteTags: l,
            channelContext: ee,
            emojiTags: i
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: ae,
            signEvent: L,
            logSignedEvent: !0,
            additionalWriteRelays: Z
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (X.type === "nip46")
        try {
          const E = X.pubkey;
          if (!E)
            return this.notifyPostFailure("pubkey_not_found");
          const L = await this.deps.getNip46SignerForSessionFn?.(E), S = this.deps.authStateStore.value;
          if (!L || !S.isAuthenticated || S.type !== "nip46" || S.pubkey !== E)
            return this.notifyPostFailure("nip46_signer_not_available");
          const U = await this.buildSubmissionEvent({
            processedContent: o,
            hashtags: p,
            tags: C,
            pubkey: E,
            imageImetaMap: r,
            contentWarningEnabled: Q,
            contentWarningReason: he,
            replyQuoteTags: l,
            channelContext: ee,
            emojiTags: i
          });
          return await this.sendPreparedEvent({
            event: U,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: ae,
            signer: L,
            additionalWriteRelays: Z
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (X.type === "parentClient") {
        const E = this.deps.getParentClientSignerFn?.();
        if (!E)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const L = X.pubkey;
        if (!L)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const S = await this.buildSubmissionEvent({
            processedContent: o,
            hashtags: p,
            tags: C,
            pubkey: L,
            imageImetaMap: r,
            contentWarningEnabled: Q,
            contentWarningReason: he,
            replyQuoteTags: l,
            channelContext: ee,
            emojiTags: i
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: ae,
            signer: E,
            additionalWriteRelays: Z
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const O = T.getFromStore() || T.loadFromStorage(X.pubkey);
      if (!O)
        return this.notifyPostFailure("key_not_found");
      const V = await this.buildSubmissionEvent({
        processedContent: o,
        hashtags: p,
        tags: C,
        imageImetaMap: r,
        contentWarningEnabled: Q,
        contentWarningReason: he,
        replyQuoteTags: l,
        channelContext: ee,
        emojiTags: i
      }), te = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(O) : ht(O);
      return await this.sendPreparedEvent({
        event: V,
        sessionPubkey: P,
        hashtags: p,
        rqNotifyOptions: ae,
        signer: te,
        additionalWriteRelays: Z
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
    const r = t || this.deps.hashtagStore, i = this.deps.hashtagSnapshotFn;
    if (i) {
      const o = i(r);
      return {
        hashtags: Array.isArray(o?.hashtags) ? [...o.hashtags] : [],
        tags: Array.isArray(o?.tags) ? o.tags.map((a) => [...a]) : []
      };
    }
    if (r === gt)
      try {
        const o = xt();
        return {
          hashtags: Array.isArray(o?.hashtags) ? [...o.hashtags] : [],
          tags: Array.isArray(o?.tags) ? o.tags.map((a) => [...a]) : []
        };
      } catch (o) {
        this.deps.console?.warn("hashtag_snapshot_failed", o);
      }
    return {
      hashtags: Array.isArray(r?.hashtags) ? [...r.hashtags] : [],
      tags: Array.isArray(r?.tags) ? r.tags.map((o) => [...o]) : []
    };
  }
  // --- PostComponent 統合メソッド ---
  preparePostPayload(t) {
    const r = this.deps.extractContentWithEmojiTagsFn(t);
    if (!this.deps.mediaFreePlacementStore.value) {
      const i = this.deps.mediaGalleryStore.getContentUrls();
      if (i.length > 0) {
        const o = r.content.trim();
        return {
          content: o ? o + `
` + i.join(`
`) : i.join(`
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
  prepareImageBlurhashMap(t, r, i) {
    if (!this.deps.mediaFreePlacementStore.value)
      return this.deps.mediaGalleryStore.getImageBlurhashMap();
    const o = {};
    t?.state?.doc?.descendants?.((d) => {
      if (d.type?.name !== "image" || !d.attrs?.src || d.attrs?.isPlaceholder)
        return;
      const f = typeof d.attrs.size == "number" ? d.attrs.size : Number(d.attrs.size);
      o[d.attrs.src] = {
        dim: d.attrs.dim ?? void 0,
        alt: d.attrs.alt ?? void 0,
        size: Number.isFinite(f) && f > 0 ? f : void 0,
        uploadProtocol: d.attrs.uploadProtocol ?? void 0
      };
    });
    const a = this.deps.extractImageBlurhashMapFn(t), c = {};
    for (const [d, f] of Object.entries(a))
      c[d] = {
        m: Hn(d),
        blurhash: f,
        dim: o[d]?.dim,
        alt: o[d]?.alt,
        size: o[d]?.size,
        uploadProtocol: o[d]?.uploadProtocol,
        ox: r[d],
        x: i[d]
      };
    return c;
  }
  async performPostSubmission(t, r, i, o, a, c) {
    const d = this.preparePostPayload(t), f = this.prepareImageBlurhashMap(t, r, i);
    o?.();
    try {
      const y = await this.submitPost(d.content, f, d.emojiTags);
      y.success ? a?.(y) : c?.(y.error || "post_error");
    } catch {
      c?.("post_error");
    }
  }
  applyEmptyStateToEditor(t) {
    t.chain().clearContent().run();
  }
  resetPostContent(t) {
    this.applyEmptyStateToEditor(t), this.deps.resetEditorStateFn?.(), this.deps.resetPostStatusFn?.(), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), this.deps.clearReplyQuoteFn?.();
  }
  clearContentAfterSuccess(t) {
    const r = this.deps.hashtagPinStore.value, i = r ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), r && i.length > 0) {
      const o = " " + i.map((a) => "#" + a).join(" ");
      t.commands.insertContent(o);
    }
    t.commands.focus("start");
  }
}
function _r(n) {
  return !!n && n.length > 0;
}
function Ir(n, t, r) {
  n.isUploading = t, n.uploadErrorMessage = r || "";
}
function kr(n) {
  const t = n.target;
  return t?.files?.length ? t.files : void 0;
}
function Mr({
  getCurrentEditor: n,
  getFileInput: t,
  getImageOxMap: r,
  getImageXMap: i,
  getUploadFailedText: o,
  updateUploadState: a,
  setUploadErrorMessage: c,
  uploadFiles: d
}) {
  const f = async (P) => _r(P) ? await d({
    files: P,
    currentEditor: n(),
    fileInput: t(),
    updateUploadState: a,
    setUploadErrorMessage: c,
    imageOxMap: r(),
    imageXMap: i(),
    getUploadFailedText: o
  }) ?? null : null;
  return {
    performUpload: f,
    handleFileSelect: (P) => {
      const k = kr(P);
      k && f(k);
    }
  };
}
let N = Re({
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
}), Ie;
function yt() {
  Ie !== void 0 && (clearTimeout(Ie), Ie = void 0);
}
const ie = {
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
  showFloatingMessage: (n, t, r, i = 1800) => {
    yt(), N.floatingMessageX = n, N.floatingMessageY = t, N.floatingMessageText = r, N.showFloatingMessage = !0, Ie = setTimeout(
      () => {
        N.showFloatingMessage = !1, Ie = void 0;
      },
      i
    );
  },
  hideFloatingMessage: () => {
    yt(), N.showFloatingMessage = !1;
  }
};
var Tr = ge('<img draggable="false"/>'), Dr = ge('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), Lr = ge('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const Ar = {
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
function kt(n, t) {
  Ye(t, !0), Ke(n, Ar);
  const r = () => Ge(Qe, "$_", i), [i, o] = Xe();
  let a = B(t, "item", 7), c = B(t, "index", 7), d = B(t, "onDelete", 7), f = B(t, "onDragStart", 7), y = B(t, "onDragOver", 7), P = B(t, "onDragEnd", 7), k = B(t, "onDrop", 7), p = B(t, "onTouchDragStart", 7), C = B(t, "disabled", 7, !1), T = G(void 0), D = G(void 0);
  const Q = jn();
  Wn(() => e(T), {
    onLongPress: (u, A) => {
      C() || p()?.(c(), u, A);
    }
  });
  let he = x(() => !a().isPlaceholder && a().type === "image" && !!a().src), ee = x(() => !a().isPlaceholder && a().type === "video" && !!a().src);
  const Z = 180, K = 100, l = 180;
  let ae = x(() => {
    if (!a().isPlaceholder) return;
    const u = a().dimensions;
    if (u && u.width > 0 && u.height > 0) {
      const A = u.width / u.height, $ = Math.round(Z * A);
      return `width: ${Math.max(K, Math.min(l, $))}px; height: ${Z}px;`;
    }
    return `width: ${l}px; height: ${Z}px;`;
  });
  function X() {
    a().isPlaceholder || a().type !== "image" || ie.showImageFullscreen(a().src, a().alt || "", a().id);
  }
  function R(u) {
    if (C()) {
      u.preventDefault();
      return;
    }
    if (e(T) && u.dataTransfer) {
      const A = e(T).getBoundingClientRect(), $ = u.clientX - A.left, H = u.clientY - A.top;
      u.dataTransfer.setDragImage(e(T), $, H);
    }
    f()(c(), u);
  }
  function O(u) {
    u.stopPropagation(), e(D) && (e(D).paused ? e(D).play() : e(D).pause());
  }
  function V(u) {
    u.preventDefault(), !C() && y()(c(), u);
  }
  function te(u) {
    u.preventDefault(), !C() && k()(c());
  }
  function E(u) {
    a().type !== "image" || a().isPlaceholder || (u.key === "Enter" || u.key === " " || u.key === "Spacebar") && (u.preventDefault(), X());
  }
  var L = {
    get item() {
      return a();
    },
    set item(u) {
      a(u), q();
    },
    get index() {
      return c();
    },
    set index(u) {
      c(u), q();
    },
    get onDelete() {
      return d();
    },
    set onDelete(u) {
      d(u), q();
    },
    get onDragStart() {
      return f();
    },
    set onDragStart(u) {
      f(u), q();
    },
    get onDragOver() {
      return y();
    },
    set onDragOver(u) {
      y(u), q();
    },
    get onDragEnd() {
      return P();
    },
    set onDragEnd(u) {
      P(u), q();
    },
    get onDrop() {
      return k();
    },
    set onDrop(u) {
      k(u), q();
    },
    get onTouchDragStart() {
      return p();
    },
    set onTouchDragStart(u) {
      p(u), q();
    },
    get disabled() {
      return C();
    },
    set disabled(u = !1) {
      C(u), q();
    }
  }, S = Lr();
  let U;
  var z = ve(S), me = ve(z);
  {
    var v = (u) => {
      {
        let A = x(() => a().type === "video" ? r()("videoNode.uploading") : r()("imageNode.uploading"));
        Nn(u, {
          get text() {
            return e(A);
          },
          showLoader: !0
        });
      }
    };
    se(me, (u) => {
      a().isPlaceholder && u(v);
    });
  }
  var g = le(me, 2);
  {
    var M = (u) => {
      var A = Tr();
      let $;
      we(() => {
        oe(A, "src", a().src), oe(A, "alt", a().alt || ""), $ = ke(A, 1, "gallery-image svelte-aw59wn", null, $, { "image-loading": !Q.isLoaded });
      }), fe("load", A, function(...H) {
        Q.handleLoad?.apply(this, H);
      }), fe("error", A, function(...H) {
        Q.handleError?.apply(this, H);
      }), ye("contextmenu", A, (H) => H.preventDefault()), Pr(A), ce(u, A);
    };
    se(g, (u) => {
      e(he) && u(M);
    });
  }
  var _ = le(g, 2);
  {
    var I = (u) => {
      var A = Dr(), $ = ve(A);
      $.muted = !0, Pe($, (xe) => w(D, xe), () => e(D));
      var H = le($, 2);
      ue(A), we(() => {
        oe($, "src", a().src), oe(H, "draggable", !C());
      }), ye("contextmenu", $, (xe) => xe.preventDefault()), fe("dragstart", H, R), ye("click", H, O), ce(u, A);
    };
    se(_, (u) => {
      e(ee) && u(I);
    });
  }
  ue(z);
  var W = le(z, 2);
  {
    var j = (u) => {
      {
        let A = x(() => r()("imageContextMenu.delete")), $ = x(() => r()("imageContextMenu.copyUrl")), H = x(() => r()("imageContextMenu.copySuccess"));
        zn(u, {
          get src() {
            return a().src;
          },
          onDelete: () => d()(a().id),
          get deleteAriaLabel() {
            return e(A);
          },
          get copyAriaLabel() {
            return e($);
          },
          get copySuccessMessage() {
            return e(H);
          },
          layout: "gallery",
          get deleteDisabled() {
            return C();
          }
        });
      }
    };
    se(W, (u) => {
      a().isPlaceholder || u(j);
    });
  }
  ue(S), Pe(S, (u) => w(T, u), () => e(T)), we(() => {
    U = ke(S, 1, "gallery-item svelte-aw59wn", null, U, {
      "is-placeholder": a().isPlaceholder,
      "is-disabled": C()
    }), oe(S, "draggable", !C() && (a().type !== "video" || a().isPlaceholder)), Ft(z, e(ae)), oe(z, "role", a().type === "image" && !a().isPlaceholder ? "button" : void 0), oe(z, "tabindex", a().type === "image" && !a().isPlaceholder ? 0 : void 0), oe(z, "aria-label", a().alt || a().src);
  }), fe("dragstart", S, R), fe("dragover", S, V), fe("drop", S, te), fe("dragend", S, () => P()()), ye("click", z, function(...u) {
    (a().type === "image" && !a().isPlaceholder ? X : void 0)?.apply(this, u);
  }), ye("keydown", z, E), ce(n, S);
  var de = Ve(L);
  return o(), de;
}
_t(["click", "keydown", "contextmenu"]);
$e(
  kt,
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
function Rr(n) {
  return Math.abs(n.deltaX) > Math.abs(n.deltaY) ? n.deltaX : n.deltaY;
}
function Hr(n, t) {
  const r = n.scrollHeight - n.clientHeight;
  if (r <= 1)
    return !1;
  const i = n.scrollTop <= 0, o = n.scrollTop >= r - 1;
  return t > 0 ? !o : t < 0 ? !i : !1;
}
function Or(n, t) {
  const r = n.scrollWidth - n.clientWidth;
  if (r <= 1)
    return !1;
  const i = n.scrollLeft <= 0, o = n.scrollLeft >= r - 1;
  return t > 0 ? !o : t < 0 ? !i : !1;
}
function Wr(n, t, r = null) {
  if (r && Hr(r, t.deltaY))
    return !1;
  const i = Rr(t);
  if (!Or(n, i))
    return !1;
  const o = Math.max(
    0,
    n.scrollWidth - n.clientWidth
  );
  return n.scrollLeft = Math.min(
    o,
    Math.max(0, n.scrollLeft + i)
  ), !0;
}
var Nr = ge("<div><!></div>"), zr = ge('<div role="list"></div>');
const jr = {
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
function Mt(n, t) {
  Ye(t, !0), Ke(n, jr);
  const r = () => Ge(Qe, "$_", i), [i, o] = Xe();
  let a = G(-1), c = G(-1), d = G(-1), f = G(-1), y = null, P = 60, k = 60, p = G(void 0), C = null, T = x(() => re.items), D = x(() => J.postStatus.sending), Q = x(() => {
    const v = e(a) !== -1 ? e(a) : e(d), g = e(a) !== -1 ? e(c) : e(f);
    return v === -1 || g === -1 || g === v || g === v + 1 ? -1 : g;
  });
  function he(v, g) {
    if (e(D)) {
      g.preventDefault();
      return;
    }
    w(a, v, !0), g.dataTransfer?.setData("text/plain", String(v)), g.dataTransfer && (g.dataTransfer.effectAllowed = "move");
  }
  function ee(v, g) {
    if (g.preventDefault(), e(D)) return;
    const _ = e(p)?.querySelectorAll(".gallery-item-wrapper")?.[v];
    if (_) {
      const I = _.getBoundingClientRect();
      w(c, g.clientX < I.left + I.width / 2 ? v : v + 1, !0);
    } else
      w(c, v, !0);
  }
  function Z() {
    O(), w(a, -1), w(c, -1);
  }
  function K(v) {
  }
  function l(v) {
    if (e(a) === -1) return;
    if (v.preventDefault(), e(D)) {
      O(), w(c, -1);
      return;
    }
    const g = e(p)?.querySelectorAll(".gallery-item-wrapper");
    if (g && g.length > 0) {
      const M = g[0].getBoundingClientRect(), _ = g[g.length - 1].getBoundingClientRect();
      v.clientX < M.left ? w(c, 0) : v.clientX > _.right && w(c, e(T).length, !0);
    }
    if (e(p)) {
      const M = e(p).getBoundingClientRect();
      v.clientX - M.left < Ce ? R("left", v.clientX) : M.right - v.clientX < Ce ? R("right", v.clientX) : O();
    }
  }
  function ae(v) {
    if (v.preventDefault(), O(), e(D)) {
      w(a, -1), w(c, -1);
      return;
    }
    const g = e(c);
    if (e(a) !== -1 && g !== -1 && g !== e(a) && g !== e(a) + 1) {
      const M = e(a) < g ? g - 1 : g;
      re.reorderItems(e(a), M);
    }
    w(a, -1), w(c, -1);
  }
  function X(v) {
    e(D) || re.removeItem(v);
  }
  function R(v, g) {
    if (!e(p)) return;
    C !== null && (cancelAnimationFrame(C), C = null);
    const M = e(p).getBoundingClientRect(), _ = v === "left" ? g - M.left : M.right - g, I = Math.max(0, Math.min(1, _ / Ce)), W = pt + (qn - pt) * (1 - I), j = () => {
      if (!e(p)) return;
      const de = e(p).scrollWidth - e(p).clientWidth;
      v === "left" && e(p).scrollLeft > 0 ? (e(p).scrollLeft = Math.max(0, e(p).scrollLeft - W), C = requestAnimationFrame(j)) : v === "right" && e(p).scrollLeft < de ? (e(p).scrollLeft = Math.min(de, e(p).scrollLeft + W), C = requestAnimationFrame(j)) : C = null;
    };
    C = requestAnimationFrame(j);
  }
  function O() {
    C !== null && (cancelAnimationFrame(C), C = null);
  }
  function V(v, g, M) {
    if (e(D)) return;
    w(d, v, !0), L();
    const _ = e(p)?.querySelectorAll(".gallery-item-wrapper")[v];
    if (_) {
      const I = _.getBoundingClientRect(), W = 120, j = Math.min(W / I.width, W / I.height);
      P = I.width * j / 2, k = I.height * j / 2, y = _.cloneNode(!0), y.style.cssText = `
                position: fixed;
                left: ${g - P}px;
                top: ${M - k}px;
                width: ${I.width}px;
                height: ${I.height}px;
                transform-origin: top left;
                transform: scale(${j});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, Fr().overlayTarget.appendChild(y);
    }
    document.addEventListener("touchmove", te, { passive: !1 }), document.addEventListener("touchend", E, { passive: !1 });
  }
  function te(v) {
    if (e(d) === -1 || v.touches.length !== 1) return;
    if (v.preventDefault(), e(D)) {
      O(), w(f, -1);
      return;
    }
    const g = v.touches[0];
    y && (y.style.left = `${g.clientX - P}px`, y.style.top = `${g.clientY - k}px`), y && (y.style.display = "none");
    const M = document.elementFromPoint(g.clientX, g.clientY);
    y && (y.style.display = "");
    const _ = M?.closest(".gallery-item-wrapper");
    if (_ && e(p)) {
      const I = e(p).querySelectorAll(".gallery-item-wrapper"), W = Array.from(I).indexOf(_);
      if (W !== -1) {
        const j = _.getBoundingClientRect();
        w(f, g.clientX < j.left + j.width / 2 ? W : W + 1, !0);
      }
    } else if (e(p)) {
      const I = e(p).querySelectorAll(".gallery-item-wrapper");
      if (I.length > 0) {
        const W = I[0].getBoundingClientRect(), j = I[I.length - 1].getBoundingClientRect();
        g.clientX <= W.left ? w(f, 0) : g.clientX >= j.right && w(f, e(T).length, !0);
      }
    }
    if (e(p)) {
      const I = e(p).getBoundingClientRect();
      g.clientX - I.left < Ce ? R("left", g.clientX) : I.right - g.clientX < Ce ? R("right", g.clientX) : O();
    }
  }
  function E() {
    if (document.removeEventListener("touchmove", te), document.removeEventListener("touchend", E), O(), e(D)) {
      L(), w(d, -1), w(f, -1);
      return;
    }
    const v = e(f);
    if (e(d) !== -1 && v !== -1 && v !== e(d) && v !== e(d) + 1) {
      const g = e(d) < v ? v - 1 : v;
      re.reorderItems(e(d), g);
    }
    L(), w(d, -1), w(f, -1);
  }
  function L() {
    y && (y.remove(), y = null);
  }
  function S(v) {
    if (!e(p)) return;
    const g = e(p).closest(".composer-scroll-region");
    Wr(e(p), v, g instanceof HTMLElement ? g : null) && v.preventDefault();
  }
  pe(() => {
    if (e(p))
      return e(p).addEventListener("wheel", S, { passive: !1 }), () => {
        e(p)?.removeEventListener("wheel", S);
      };
  });
  var U = xr(), z = It(U);
  {
    var me = (v) => {
      var g = zr();
      let M;
      Bn(g, 23, () => e(T), (_) => _.id, (_, I, W) => {
        var j = Nr();
        let de;
        var u = ve(j);
        kt(u, {
          get item() {
            return e(I);
          },
          get index() {
            return e(W);
          },
          onDelete: X,
          onDragStart: he,
          onDragOver: ee,
          onDragEnd: Z,
          onDrop: K,
          onTouchDragStart: V,
          get disabled() {
            return e(D);
          }
        }), ue(j), we(() => de = ke(j, 1, "gallery-item-wrapper svelte-w2vv8k", null, de, {
          "insert-bar-left": e(Q) === e(W),
          "insert-bar-right": e(Q) === e(T).length && e(W) === e(T).length - 1
        })), ce(_, j);
      }), ue(g), Pe(g, (_) => w(p, _), () => e(p)), we(
        (_) => {
          M = ke(g, 1, "media-gallery svelte-w2vv8k", null, M, { sending: e(D) }), oe(g, "aria-label", _);
        },
        [() => r()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), fe("dragover", g, l), fe("drop", g, ae), ce(v, g);
    };
    se(z, (v) => {
      e(T).length > 0 && v(me);
    });
  }
  ce(n, U), Ve(), o();
}
$e(Mt, {}, [], [], { mode: "open" });
function Ue(n) {
  if (!n || !n.types) return !1;
  try {
    return Array.from(n.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function Tt(n) {
  if (!n) return !1;
  try {
    return Array.from(n.types).includes("Files") || n.files && n.files.length > 0;
  } catch {
    return !!(n.files && n.files.length > 0);
  }
}
function Me(n) {
  const t = n.__postStatus;
  return (typeof t == "function" ? t() : t)?.sending === !0;
}
function Te(n) {
  return typeof n.__uploadFiles == "function";
}
function Br(n) {
  let t = G(!1);
  function r(a) {
    if (Me(n) || !Te(n)) {
      a.preventDefault(), w(t, !1), n.classList.remove("drag-over");
      return;
    }
    const c = a.dataTransfer, d = Ue(c);
    Tt(c) && !d ? (a.preventDefault(), e(t) || (w(t, !0), n.classList.add("drag-over"))) : e(t) && (w(t, !1), n.classList.remove("drag-over"));
  }
  function i(a) {
    e(t) && (w(t, !1), n.classList.remove("drag-over"));
  }
  async function o(a) {
    if (w(t, !1), n.classList.remove("drag-over"), Me(n) || !Te(n)) {
      a.preventDefault();
      return;
    }
    const c = a.dataTransfer;
    Ue(c) || c?.files && c.files.length > 0 && typeof n.__uploadFiles == "function" && (a.preventDefault(), n.__uploadFiles(c.files));
  }
  return n.addEventListener("dragover", r), n.addEventListener("dragleave", i), n.addEventListener("drop", o), {
    destroy() {
      n.removeEventListener("dragover", r), n.removeEventListener("dragleave", i), n.removeEventListener("drop", o);
    }
  };
}
function qr(n, t) {
  const r = Br(n);
  function i(c) {
    if (Me(n) || !Te(n)) {
      c.preventDefault(), t.dragOver(!1);
      return;
    }
    const d = c.dataTransfer, f = Ue(d);
    Tt(d) && !f ? t.dragOver(!0) : t.dragOver(!1);
  }
  function o(c) {
    t.dragOver(!1);
  }
  function a(c) {
    t.dragOver(!1), (Me(n) || !Te(n)) && c.preventDefault();
  }
  return n.addEventListener("dragover", i), n.addEventListener("dragleave", o), n.addEventListener("drop", a), {
    destroy() {
      r?.destroy?.(), n.removeEventListener("dragover", i), n.removeEventListener("dragleave", o), n.removeEventListener("drop", a);
    }
  };
}
function Ur(n) {
  function t(r) {
    if (Me(n)) {
      r.preventDefault();
      return;
    }
    if (!r.clipboardData) return;
    if (!Te(n)) {
      Array.from(r.clipboardData.items).some((a) => a.kind === "file" && a.type.startsWith("image/")) && r.preventDefault();
      return;
    }
    const i = [];
    for (const o of r.clipboardData.items)
      if (o.kind === "file" && o.type.startsWith("image/")) {
        const a = o.getAsFile();
        a && i.push(a);
      }
    i.length > 0 && (r.preventDefault(), n.__uploadFiles?.(i));
  }
  return n.addEventListener("paste", t), {
    destroy() {
      n.removeEventListener("paste", t);
    }
  };
}
function Kr(n) {
  function t(i) {
    const o = i.target;
    if (o && (o.closest('.editor-image-button[data-dragging="true"]') || o.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const a = i.touches[0], c = 120, d = ft.querySelector(".tiptap-editor");
      if (d) {
        const f = d.getBoundingClientRect(), y = a.clientY < f.top + c, P = a.clientY > f.bottom - c;
        if (!y && !P)
          return i.preventDefault(), !1;
      }
    }
  }
  function r(i) {
    const o = ft.querySelectorAll(".drop-zone-indicator");
    o.forEach((a) => {
      a.classList.remove("drop-zone-hover"), a.classList.add("drop-zone-fade-out");
    }), setTimeout(
      () => {
        o.forEach((a) => {
          a.parentNode && a.parentNode.removeChild(a);
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
function Xr(n) {
  function t(r) {
    if ((r.ctrlKey || r.metaKey) && (r.key === "Enter" || r.key === "NumpadEnter")) {
      r.preventDefault();
      const i = n.__currentEditor, o = typeof i == "function" ? i() : i, a = n.__hasPostingCapability, c = typeof a == "function" ? a() : a, d = n.__hasStoredKey, f = typeof d == "function" ? d() : d, y = n.__postStatus, P = typeof y == "function" ? y() : y, k = o ? Kn(o) : "";
      !P?.sending && k.trim() && (c ?? f) && n.__submitPost?.();
    }
  }
  return n.addEventListener("keydown", t), {
    destroy() {
      n.removeEventListener("keydown", t);
    }
  };
}
function Gr(n) {
  let t = !1;
  return n?.descendants((r) => {
    if (t) return !1;
    const i = r.type?.name;
    (i === "image" || i === "video") && (t = !0);
  }), t;
}
function Qr(n) {
  const { currentEditor: t, editorContainerEl: r, callbacks: i } = n, o = (d) => {
    const y = d.detail.plainText, P = t ? Gr(t.state?.doc) : !1;
    i.onContentUpdate?.(y, P);
  }, a = (d) => {
    const f = d;
    i.onImageFullscreenRequest?.(f.detail.src, f.detail.alt || "", f.detail.mediaId);
  }, c = (d) => {
    const y = d?.detail?.pos;
    if (y != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const P = Un.create(t.state.doc, y);
        t.view.dispatch(t.state.tr.setSelection(P).scrollIntoView());
      } catch (P) {
        console.warn("select-image-node handler failed:", P);
      }
      i.onSelectImageNode?.(y);
    }
  };
  return window.addEventListener("editor-content-changed", o), window.addEventListener("image-fullscreen-request", a), window.addEventListener("select-image-node", c), r && (r.addEventListener("image-fullscreen-request", a), r.addEventListener("select-image-node", c)), {
    handleContentUpdate: o,
    handleImageFullscreenRequest: a,
    handleSelectImageNode: c
  };
}
function $r(n, t) {
  window.removeEventListener("editor-content-changed", n.handleContentUpdate), window.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), window.removeEventListener("select-image-node", n.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), t.removeEventListener("select-image-node", n.handleSelectImageNode));
}
function Yr() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function Vr(n) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (n?.rejectedRelays?.length ?? 0) > 0 || (n?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function Zr(n) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: n || "postComponent.post_error",
    completed: !1
  };
}
function Jr({
  updatePostStatus: n,
  clearContentAfterSuccess: t,
  onPostSuccess: r
}) {
  return {
    markSending: () => {
      n(Yr());
    },
    markSuccess: (i) => {
      n(Vr(i)), t(), r?.(i);
    },
    markFailure: (i) => {
      n(Zr(i));
    }
  };
}
async function es(n) {
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
function wt(n) {
  if (n.dimensions && n.dimensions.width > 0 && n.dimensions.height > 0)
    return {
      width: n.dimensions.width,
      height: n.dimensions.height
    };
  const t = Xn(n.dim);
  return t || {};
}
function ts(n) {
  if (!n.mediaFreePlacement)
    return n.galleryItems.filter((r) => !r.isPlaceholder).map((r) => {
      const i = wt({
        dim: r.dim,
        dimensions: r.dimensions
      });
      return {
        id: r.id,
        src: r.src,
        alt: r.alt,
        type: r.type,
        dim: r.dim,
        width: i.width,
        height: i.height
      };
    });
  if (!n.currentEditor)
    return [];
  const t = [];
  return n.currentEditor.state.doc.descendants((r) => {
    if ((r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder) {
      const i = wt({
        dim: r.attrs.dim
      });
      t.push({
        id: r.attrs.id,
        src: r.attrs.src,
        alt: r.attrs.alt,
        type: r.type.name,
        dim: r.attrs.dim,
        width: i.width,
        height: i.height
      });
    }
  }), t;
}
function ns(n, t, r) {
  if (t) {
    const i = n.findIndex((o) => o.id === t);
    if (i >= 0)
      return i;
  }
  return r ? n.findIndex((i) => i.src === r) : -1;
}
function rs(n, t) {
  return n[t];
}
function ss(n) {
  const t = [];
  return n.state.doc.descendants((r, i) => {
    (r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder && t.push({ node: r, pos: i });
  }), t;
}
function as(n) {
  const t = ss(n.currentEditor);
  if (t.length === 0)
    return !1;
  t.forEach(({ node: i }) => {
    const o = i.attrs.src;
    o && n.addGalleryItem({
      id: n.createMediaItemId(),
      type: i.type.name,
      src: o,
      isPlaceholder: !1,
      blurhash: i.attrs.blurhash ?? void 0,
      ox: n.imageOxMap[o] ?? void 0,
      x: n.imageXMap[o] ?? void 0,
      dim: i.attrs.dim ?? void 0,
      size: typeof i.attrs.size == "number" ? i.attrs.size : void 0,
      alt: i.attrs.alt ?? void 0,
      uploadProtocol: i.attrs.uploadProtocol ?? void 0
    });
  });
  let r = n.currentEditor.state.tr;
  return [...t].reverse().forEach(({ node: i, pos: o }) => {
    r = r.delete(o, o + i.nodeSize);
  }), n.currentEditor.view.dispatch(r), !0;
}
function is(n) {
  if (n.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = n.currentEditor.state;
  let r = n.currentEditor.state.tr, i = n.currentEditor.state.doc.content.size;
  const o = {}, a = {};
  return n.items.forEach((c) => {
    if (c.isPlaceholder)
      return;
    const d = c.src;
    if (c.type === "image" && t.nodes.image) {
      const f = t.nodes.image.create({
        src: d,
        alt: c.alt ?? "Image",
        blurhash: c.blurhash ?? null,
        dim: c.dim ?? null,
        size: c.size ?? null,
        uploadProtocol: c.uploadProtocol ?? null
      });
      r = r.insert(i, f), i += f.nodeSize;
    } else if (c.type === "video" && t.nodes.video) {
      const f = t.nodes.video.create({ src: d });
      r = r.insert(i, f), i += f.nodeSize;
    }
    c.ox && (o[d] = c.ox), c.x && (a[d] = c.x);
  }), n.currentEditor.view.dispatch(r), {
    imageOxMap: o,
    imageXMap: a,
    hadItems: !0
  };
}
async function os(n) {
  const {
    input: t,
    postHistoryRepositoryImpl: r = Ct,
    postMediaCacheRepositoryImpl: i = Qn
  } = n;
  await r.putPostedEvent(t);
  const o = Gn(t.event).map((a) => a.url).filter(Boolean);
  o.length !== 0 && await i.linkEventIdByUrls({
    eventId: t.event.id,
    urls: o
  });
}
function ls(n) {
  const {
    placeholderText: t,
    editorContainerEl: r,
    hasStoredKey: i,
    hasPostingCapability: o,
    submitPost: a,
    onCustomEmojiSelect: c,
    enterKeyBehavior: d,
    uploadFiles: f,
    eventCallbacks: y
  } = n;
  $n.value = t;
  const P = Yn({
    placeholderText: t,
    onSubmitPost: a,
    onCustomEmojiSelect: c,
    enterKeyBehavior: d,
    onCreate: (T) => {
      He.set(T);
    }
  });
  let k = null;
  const p = P.subscribe((T) => {
    k = T;
  }), C = Qr({
    currentEditor: k,
    editorContainerEl: r,
    callbacks: y
  });
  return Vn(a), r && Object.assign(r, {
    __uploadFiles: f,
    __currentEditor: () => k,
    __hasStoredKey: () => i,
    __hasPostingCapability: () => o ?? i,
    __postStatus: () => J.postStatus,
    __submitPost: a
  }), { editor: P, unsubscribe: p, handlers: C };
}
function cs(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: r,
    handlers: i,
    currentEditor: o,
    editorContainerEl: a,
    submitPost: c
  } = n;
  $r(i, a), He.value === o && He.set(null), Zn(c), r(), t(), o && !o.isDestroyed && o.destroy(), a && (delete a.__uploadFiles, delete a.__currentEditor, delete a.__hasStoredKey, delete a.__hasPostingCapability, delete a.__postStatus, delete a.__submitPost);
}
function ds(n, t) {
  const r = n.view.dom;
  if (Jn() && document.activeElement !== r) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
var us = ge('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), gs = ge('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), hs = ge('<div class="upload-error svelte-15ticnd"> </div>'), ps = ge('<div class="svelte-15ticnd"> </div>'), fs = ge('<div class="post-container svelte-15ticnd" data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const vs = {
  hash: "svelte-15ticnd",
  code: `.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {min-height:0;}.editor-content,
  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--surface-editor);-webkit-tap-highlight-color:transparent;overflow:hidden;}.editor-account-placeholder {position:absolute;top:11px;left:14px;z-index:3;width:28px;height:28px;opacity:0.5;pointer-events:none;user-select:none;-webkit-user-select:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,
  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {object-fit:cover;}.editor-container.account-avatar-placeholder.svelte-15ticnd
    p.is-editor-empty:first-child::before {padding-left:38px;}.editor-container.sending.svelte-15ticnd {background:color-mix(in srgb, var(--surface-editor) 82%, var(--surface-button) 18%);cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.sending.svelte-15ticnd .editor-image-button,
  .editor-container.sending.svelte-15ticnd .custom-emoji-drag-target,
  .editor-container.sending.svelte-15ticnd .media-delete-btn {pointer-events:none;}.editor-container.drag-over.svelte-15ticnd {border:3px dashed var(--theme);}

  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */.editor-container.gallery-mode.svelte-15ticnd .tiptap-dropcursor {display:none !important;}

  /* Tiptapエディターのスタイル */.tiptap-editor {display:block;padding:10px;font-family:inherit;font-size:1.25rem;line-height:1.5;outline:none;overflow-y:auto;overflow-x:hidden;scroll-padding-bottom:16px;scroll-behavior:auto;will-change:scroll-position;transform:translateZ(0);-webkit-tap-highlight-color:transparent;.editor-paragraph {margin:0;padding:0;color:var(--text);position:relative;z-index:2;word-break:normal;overflow-wrap:anywhere;line-break:loose;white-space:break-spaces;}.hashtag {color:var(--hashtag-text);font-weight:600;background:var(--hashtag-bg);padding:2px 4px;border-radius:4px;word-break:break-all;}.preview-link {color:var(--link);word-break:break-all;}.preview-link:visited {color:var(--link-visited);}p.is-editor-empty:first-child::before {color:var(--text);content:attr(data-placeholder);float:left;height:0;pointer-events:none;opacity:0.6;}.toolbar-caret {display:inline-block;width:0;height:1.5em;margin-left:-1px;border-left:2px solid var(--text);vertical-align:-0.25em;pointer-events:none;
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
function ms(n, t) {
  Ye(t, !0), Ke(n, vs);
  const r = () => Ge(Qe, "$_", i), [i, o] = Xe();
  let a = B(t, "rxNostr", 7), c = B(t, "hasStoredKey", 7), d = B(t, "hasPostingCapability", 23, c), f = B(t, "isSwitchingAccount", 7, !1), y = B(t, "onPostSuccess", 7), P = B(t, "availableComposerHeight", 7, Ee), k = B(t, "minEditorHeight", 7, Ee), p = B(t, "onCustomEmojiSelect", 7), C = B(t, "notificationPort", 7), T = B(t, "hostOwnedConfig", 7), D = B(t, "hostCustomEmojiItems", 23, () => []), Q = B(t, "normalUploadFiles", 7);
  const ee = !1;
  let Z = x(() => !ee), K = G(null), l = G(null), ae = G(!1), X = G(void 0), R = G(void 0), O = G(Re({})), V = G(Re({})), te = x(() => Be.value), E = x(() => J.postStatus), L = x(() => J.uploadErrorMessage), S = x(() => Er.value), U = x(() => hr.value), z = x(() => pr.value), me = G(!0), v = x(() => c() && !f() && e(U) && !e(z) && e(me)), g = null, M = null, _ = null, I = null, W = G(Re(Ee)), j = x(() => `--post-editor-min-height: ${k()}px; --post-editor-target-height: ${e(W)}px;`), de = x(() => r()("postComponent.enter_your_text") || "テキストを入力してください");
  pe(() => {
    e(l), er(e(de));
  }), pe(() => {
    const s = e(l), h = !e(E).sending;
    s && s.isEditable !== h && s.setEditable(h, !1);
  });
  function u() {
    const s = k();
    if (!g || !M) {
      w(W, s, !0);
      return;
    }
    const h = Array.from(g.children).reduce(
      (m, F) => F === M ? m : m + vr(F),
      0
    ), b = mr({
      availableComposerHeight: P(),
      nonEditorHeight: h,
      minHeight: s
    });
    e(W) !== b && w(W, b, !0);
  }
  function A(s) {
    if (e(E).sending) {
      s.preventDefault();
      return;
    }
    !(s.target instanceof HTMLElement) || !e(l) || gr(s.target) || e(l).commands.focus("end");
  }
  function $(s) {
    if (e(E).sending) {
      s.preventDefault();
      return;
    }
    !e(l) || s.currentTarget !== s.target || s.key !== "Enter" && s.key !== " " || (s.preventDefault(), e(l).commands.focus("end"));
  }
  let H = x(() => ie.value), xe = x(() => e(H).showSecretKeyDialog), Ze = x(() => e(H).showImageFullscreen), Dt = x(() => e(H).fullscreenMediaId), Je = x(() => e(H).fullscreenImageSrc), Lt = x(() => e(H).fullscreenImageAlt), et = x(() => e(H).showFloatingMessage), At = x(() => e(H).floatingMessageX), Rt = x(() => e(H).floatingMessageY), Ht = x(() => e(H).floatingMessageText);
  pe(() => {
    a() && (e(R) ? e(R).setRxNostr(a()) : w(
      R,
      new Cr(a(), {
        getNip46SignerForSessionFn: (s) => rr.getSignerForSession(s),
        getParentClientSignerFn: () => nr.getSigner(),
        channelContextState: tr,
        replyQuoteState: Et,
        replyQuoteService: new Ae(),
        clearReplyQuoteFn: qe,
        savePostHistoryFn: (s) => os({ input: s, postHistoryRepositoryImpl: Ct }),
        notificationPort: C()
      }),
      !0
    ));
  });
  const Oe = Mr({
    getCurrentEditor: () => e(l),
    getFileInput: () => e(X),
    getImageOxMap: () => e(O),
    getImageXMap: () => e(V),
    getUploadFailedText: (s) => r()(s),
    updateUploadState: (s, h) => {
      Ir(J, s, h);
    },
    setUploadErrorMessage: (s) => {
      J.uploadErrorMessage = s;
    },
    uploadFiles: async (s) => {
      if (e(E).sending || J.isUploading || ee)
        return null;
      {
        if (Q()) return await Q()(s);
        const { uploadFiles: h } = await import("./App-GbqYleiC.js").then((b) => b.eA);
        return await h(s);
      }
    }
  }), be = Jr({
    updatePostStatus: vt,
    clearContentAfterSuccess: rt,
    onPostSuccess: (s) => y()?.(s)
  });
  pe(() => {
    if (P(), k(), e(te), e(L), e(l), e(te) || re.items.length, typeof window > "u") {
      w(W, Ee, !0);
      return;
    }
    const s = window.requestAnimationFrame(() => {
      u();
    });
    return () => {
      window.cancelAnimationFrame(s);
    };
  }), pe(() => {
    if (P(), k(), e(l), e(te), e(L), !g || typeof ResizeObserver > "u")
      return;
    let s = null;
    const h = () => {
      s === null && (s = window.requestAnimationFrame(() => {
        s = null, u();
      }));
    }, b = new ResizeObserver(h);
    h(), b.observe(g);
    for (const m of Array.from(g.children))
      m !== M && b.observe(m);
    return () => {
      b.disconnect(), s !== null && window.cancelAnimationFrame(s);
    };
  }), sr(() => {
    _ = ls({
      placeholderText: e(de),
      editorContainerEl: M,
      currentEditor: e(l),
      hasStoredKey: c(),
      hasPostingCapability: d(),
      submitPost: Ne,
      onCustomEmojiSelect: p(),
      enterKeyBehavior: void 0,
      uploadFiles: e(Z) ? (m) => {
        Oe.performUpload(m);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: fr,
        onImageFullscreenRequest: (m, F, Y) => {
          ie.showImageFullscreen(m, F, Y || "");
        },
        onSelectImageNode: (m) => {
        }
      }
    }), w(K, _.editor, !0);
    let s = null;
    const h = ({ editor: m }) => {
      w(me, m.isEmpty, !0);
    };
    I = e(K).subscribe((m) => {
      s && s.off("transaction", h), s = m, w(l, m, !0), w(me, m?.isEmpty ?? !0, !0), m?.on("transaction", h), He.set(m);
    });
    const b = (m) => {
      const F = m, { src: Y, alt: Se, mediaId: fn } = F.detail;
      ie.showImageFullscreen(Y, Se, fn || "");
    };
    return window.addEventListener("image-fullscreen-request", b), () => {
      window.removeEventListener("image-fullscreen-request", b), _ && (s && s.off("transaction", h), cs({
        unsubscribe: _.unsubscribe,
        componentUnsubscribe: I ?? (() => {
        }),
        handlers: _.handlers,
        currentEditor: e(l),
        editorContainerEl: M,
        submitPost: Ne
      }), I = null);
    };
  });
  const Ot = Oe.handleFileSelect;
  async function Wt(s) {
    return await Oe.performUpload(s);
  }
  function Nt(s) {
    if (!e(l) || !s) return;
    const h = e(
      l
      // nullチェック済みのローカル変数
    ), m = s.split(`
`).map((F) => ({
      type: "paragraph",
      content: F ? [{ type: "text", text: F }] : void 0
    }));
    h.commands.setContent({ type: "doc", content: m }), h.commands.focus("end");
  }
  function zt(s) {
    if (!e(l) || !s) return !1;
    const b = s.split(`
`).map((m) => ({
      type: "paragraph",
      content: m ? [{ type: "text", text: m }] : void 0
    }));
    return e(l).isEmpty ? e(l).commands.setContent({ type: "doc", content: b }) : e(l).chain().focus("end").insertContent([{ type: "paragraph" }, ...b]).run(), e(l).commands.focus("end"), !0;
  }
  function jt(s) {
    if (!e(l) || !s) return;
    const h = ir(s);
    e(l).commands.setContent(h || "<p></p>"), e(l).commands.focus("end");
  }
  function Bt() {
    return e(l) ? e(l).getHTML() : "";
  }
  function qt(s) {
    if (!e(l) || s.length === 0) return;
    const { schema: h } = e(l).state;
    let b = e(l).state.tr, m = e(l).state.doc.content.size;
    s.forEach((F) => {
      if (F.isPlaceholder) return;
      const Y = F.src;
      if (F.type === "image" && h.nodes.image) {
        const Se = h.nodes.image.create({
          src: Y,
          alt: F.alt ?? "Image",
          blurhash: F.blurhash ?? null,
          dim: F.dim ?? null,
          size: F.size ?? null,
          uploadProtocol: F.uploadProtocol ?? null
        });
        b = b.insert(m, Se), m += Se.nodeSize, F.ox && w(O, { ...e(O), [Y]: F.ox }, !0), F.x && w(V, { ...e(V), [Y]: F.x }, !0);
      } else if (F.type === "video" && h.nodes.video) {
        const Se = h.nodes.video.create({ src: Y });
        b = b.insert(m, Se), m += Se.nodeSize;
      }
    }), e(l).view.dispatch(b), e(l).commands.focus("end");
  }
  function Ut(s) {
    !e(l) || e(E).sending || ds(e(l), s);
  }
  function We() {
    if (!e(l)) return;
    dr(e(l).view.dom) || ur(e(l));
  }
  function tt(s) {
    if (!e(l) || e(E).sending) return;
    We();
    const { state: h, view: b } = e(l), m = s < 0 ? h.selection.from : h.selection.to, F = Math.max(0, Math.min(h.doc.content.size, m + s));
    if (F === m) return;
    const Y = cr.near(h.doc.resolve(F), s);
    b.dispatch(h.tr.setSelection(Y).scrollIntoView().setMeta("addToHistory", !1));
  }
  function Kt() {
    tt(-1);
  }
  function Xt() {
    tt(1);
  }
  function Gt() {
    if (!e(l) || e(E).sending) return;
    We();
    const { state: s, view: h } = e(l), { selection: b } = s;
    if (!b.empty) {
      e(l).commands.deleteSelection();
      return;
    }
    const F = b.$from.nodeBefore;
    if (F) {
      const Y = F.isText ? Array.from(F.text ?? "").at(-1)?.length ?? 0 : F.nodeSize;
      Y > 0 && h.dispatch(s.tr.delete(b.from - Y, b.from).scrollIntoView());
      return;
    }
    e(l).commands.first(({ commands: Y }) => [
      () => Y.joinBackward(),
      () => Y.selectNodeBackward()
    ]);
  }
  function Qt() {
    !e(l) || e(E).sending || (We(), e(l).commands.keyboardShortcut("Enter"));
  }
  function nt() {
    return !!e(l) && J.canPost && !e(E).sending && !J.isUploading && !e(E).completed && (d() || !!e(R));
  }
  async function Ne() {
    if (!e(l) || !nt() || !e(R)) return;
    const s = e(R).preparePostPayload(e(l));
    if (or(s.content)) {
      ie.showSecretKeyDialog(s.content, s.emojiTags);
      return;
    }
    await e(R).performPostSubmission(e(l), e(O), e(V), be.markSending, be.markSuccess, be.markFailure);
  }
  function $t() {
    e(R) && e(l) && e(R).resetPostContent(e(l));
  }
  function rt() {
    if (e(R) && e(l)) {
      e(R).clearContentAfterSuccess(e(l));
      return;
    }
    if (e(l)) {
      const s = T()?.hashtagPinEnabled === !0 && Pt.value ? [...xt().hashtags] : [];
      e(l).chain().clearContent().run(), St.reset(), bt.reset(), re.clearAll(), w(O, {}, !0), w(V, {}, !0), qe(), s.length > 0 && e(l).commands.insertContent(` ${s.map((h) => `#${h}`).join(" ")}`), e(l).commands.focus("start");
    }
  }
  async function Yt() {
    if (!nt()) return;
    const s = ie.getPendingPost(), h = ie.getPendingEmojiTags();
    ie.hideSecretKeyDialog(), e(R) && e(l) && await es({
      postManager: e(R),
      currentEditor: e(l),
      imageOxMap: e(O),
      imageXMap: e(V),
      pendingPost: s,
      pendingEmojiTags: h,
      onStart: be.markSending,
      onSuccess: be.markSuccess,
      onFailure: be.markFailure
    });
  }
  const Vt = ie.hideSecretKeyDialog, Zt = ie.hideImageFullscreen;
  let ze = x(() => ts({
    mediaFreePlacement: e(te),
    galleryItems: re.items,
    currentEditor: e(l)
  })), Jt = x(() => ns(e(ze), e(Dt), e(Je)));
  function en(s) {
    const h = rs(e(ze), s);
    h && ie.showImageFullscreen(h.src, h.alt ?? "", h.id ?? "");
  }
  pe(() => {
    e(l) && e(R) && e(R).preparePostContent(e(l)) !== J.content && e(E).error && vt({ ...e(E), error: !1, message: "" });
  });
  function tn() {
    !e(Z) || e(E).sending || J.isUploading || e(X)?.click();
  }
  pe(() => {
    const s = re.items.some((m) => !m.isPlaceholder), h = !!J.content.trim(), b = J.hasImage;
    J.canPost = h || b || s;
  });
  let st = !0;
  pe(() => {
    const s = !Be.value;
    if (st) {
      st = !1;
      return;
    }
    if (!e(l)) return;
    const h = e(l);
    if (s)
      _e(() => as({
        currentEditor: h,
        imageOxMap: e(O),
        imageXMap: e(V),
        addGalleryItem: (m) => re.addItem(m),
        createMediaItemId: lr
      })) && _e(() => {
        w(O, {}, !0), w(V, {}, !0);
      });
    else {
      const b = _e(() => re.getItems()), m = is({ currentEditor: h, items: b });
      m.hadItems && _e(() => {
        w(O, m.imageOxMap, !0), w(V, m.imageXMap, !0);
      }), _e(() => re.clearAll());
    }
  });
  var nn = {
    uploadFiles: Wt,
    insertTextContent: Nt,
    appendSharedTextContent: zt,
    loadDraftContent: jt,
    getEditorHtml: Bt,
    appendMediaToEditor: qt,
    insertCustomEmoji: Ut,
    moveCaretLeft: Kt,
    moveCaretRight: Xt,
    deleteBackward: Gt,
    insertLineBreak: Qt,
    submitPost: Ne,
    resetPostContent: $t,
    clearContentAfterSuccess: rt,
    openFileDialog: tn,
    get rxNostr() {
      return a();
    },
    set rxNostr(s) {
      a(s), q();
    },
    get hasStoredKey() {
      return c();
    },
    set hasStoredKey(s) {
      c(s), q();
    },
    get hasPostingCapability() {
      return d();
    },
    set hasPostingCapability(s = c) {
      d(s), q();
    },
    get isSwitchingAccount() {
      return f();
    },
    set isSwitchingAccount(s = !1) {
      f(s), q();
    },
    get onPostSuccess() {
      return y();
    },
    set onPostSuccess(s) {
      y(s), q();
    },
    get availableComposerHeight() {
      return P();
    },
    set availableComposerHeight(s = Ee) {
      P(s), q();
    },
    get minEditorHeight() {
      return k();
    },
    set minEditorHeight(s = Ee) {
      k(s), q();
    },
    get onCustomEmojiSelect() {
      return p();
    },
    set onCustomEmojiSelect(s) {
      p(s), q();
    },
    get notificationPort() {
      return C();
    },
    set notificationPort(s) {
      C(s), q();
    },
    get hostOwnedConfig() {
      return T();
    },
    set hostOwnedConfig(s) {
      T(s), q();
    },
    get hostCustomEmojiItems() {
      return D();
    },
    set hostCustomEmojiItems(s = []) {
      D(s), q();
    },
    get normalUploadFiles() {
      return Q();
    },
    set normalUploadFiles(s) {
      Q(s), q();
    }
  }, at = fs(), Fe = It(at), ne = ve(Fe);
  let it;
  var ot = ve(ne);
  {
    var rn = (s) => {
      var h = us(), b = ve(h);
      {
        let m = x(() => e(S)?.picture || "");
        yr(b, {
          get src() {
            return e(m);
          },
          alt: "",
          fallbackAriaLabel: "",
          rootClassName: "editor-account-placeholder-avatar",
          imageClassName: "editor-account-placeholder-image",
          fallbackClassName: "editor-account-placeholder-fallback"
        });
      }
      ue(h), ce(s, h);
    };
    se(ot, (s) => {
      e(v) && s(rn);
    });
  }
  var sn = le(ot, 2);
  {
    var an = (s) => {
      wr(s, {
        get editor() {
          return e(l);
        },
        class: "editor-content"
      });
    };
    se(sn, (s) => {
      e(K) && e(l) && s(an);
    });
  }
  ue(ne), Le(ne, (s, h) => qr?.(s, h), () => ({ dragOver: (s) => w(ae, s, !0) })), Le(ne, (s) => Ur?.(s)), Le(ne, (s) => Kr?.(s)), Le(ne, (s) => Xr?.(s)), Pe(ne, (s) => M = s, () => M);
  var lt = le(ne, 2);
  {
    var on = (s) => {
      Mt(s, {});
    };
    se(lt, (s) => {
      e(te) || s(on);
    });
  }
  var ct = le(lt, 2);
  {
    var ln = (s) => {
      var h = gs();
      Pe(h, (b) => w(X, b), () => e(X)), ye("change", h, Ot), ce(s, h);
    };
    se(ct, (s) => {
      e(Z) && s(ln);
    });
  }
  var cn = le(ct, 2);
  {
    var dn = (s) => {
      var h = hs(), b = ve(h, !0);
      ue(h), we(() => mt(b, e(L))), ce(s, h);
    };
    se(cn, (s) => {
      e(L) && s(dn);
    });
  }
  ue(Fe), Pe(Fe, (s) => g = s, () => g);
  var dt = le(Fe, 2);
  {
    var un = (s) => {
      {
        let h = x(() => r()("postComponent.warning")), b = x(() => r()("postComponent.secret_key_detected")), m = x(() => r()("postComponent.post")), F = x(() => r()("postComponent.cancel"));
        Sr(s, {
          get open() {
            return e(xe);
          },
          get title() {
            return e(h);
          },
          get description() {
            return e(b);
          },
          get confirmLabel() {
            return e(m);
          },
          get cancelLabel() {
            return e(F);
          },
          confirmVariant: "danger",
          onConfirm: Yt,
          get onCancel() {
            return Vt;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    se(dt, (s) => {
      s(un);
    });
  }
  var ut = le(dt, 2);
  ar(ut, {
    get src() {
      return e(Je);
    },
    get alt() {
      return e(Lt);
    },
    get onClose() {
      return Zt;
    },
    get mediaList() {
      return e(ze);
    },
    get currentIndex() {
      return e(Jt);
    },
    onNavigate: en,
    get show() {
      return e(Ze);
    },
    set show(s) {
      w(Ze, s);
    }
  });
  var gn = le(ut, 2);
  {
    var hn = (s) => {
      br(s, {
        get show() {
          return e(et);
        },
        get x() {
          return e(At);
        },
        get y() {
          return e(Rt);
        },
        children: (h, b) => {
          var m = ps(), F = ve(m, !0);
          ue(m), we(() => mt(F, e(Ht))), ce(h, m);
        },
        $$slots: { default: !0 }
      });
    };
    se(gn, (s) => {
      e(et) && s(hn);
    });
  }
  we(
    (s) => {
      Ft(Fe, e(j)), it = ke(ne, 1, "editor-container svelte-15ticnd", null, it, {
        "drag-over": e(ae),
        "gallery-mode": !e(te),
        sending: e(E).sending,
        "account-avatar-placeholder": e(v)
      }), oe(ne, "aria-label", s), oe(ne, "aria-disabled", e(E).sending ? "true" : void 0);
    },
    [() => r()("postComponent.editor_label")]
  ), ye("click", ne, A), ye("keydown", ne, $), ce(n, at);
  var pn = Ve(nn);
  return o(), pn;
}
_t(["click", "keydown", "change"]);
$e(
  ms,
  {
    rxNostr: {},
    hasStoredKey: {},
    hasPostingCapability: {},
    isSwitchingAccount: {},
    onPostSuccess: {},
    availableComposerHeight: {},
    minEditorHeight: {},
    onCustomEmojiSelect: {},
    notificationPort: {},
    hostOwnedConfig: {},
    hostCustomEmojiItems: {},
    normalUploadFiles: {}
  },
  [],
  [
    "uploadFiles",
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
  ms as default
};
