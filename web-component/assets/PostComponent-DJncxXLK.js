import { a as bn, h as pt, m as qe, b as oe, c as Et, d as xt, k as En, e as xn, s as Pn, w as Cn, r as Pt, f as Fn, i as ft, j as _n, l as kn, n as In, o as Mn, p as Tn, q as Ct, t as Dn, u as Ue, P as Ln, v as An, x as Le, y as Rn, z as Hn, A as On, B as Wn, C as Nn, R as Re, D as zn, E as Ft, F as jn, G as Bn, H as Xe, I as z, J as qn, K as ae, L as Ce, M as Fe, N as de, O as _t, Q as Ge, S as Un, T as Kn, U as Xn, V as Qe, $ as $e, W as Gn, X as ee, Y as ke, Z as vt, _ as Qn, a0 as $n, a1 as mt, a2 as Yn, a3 as Vn, a4 as kt, a5 as Zn, a6 as Jn, a7 as er, a8 as tr, a9 as Oe, aa as nr, ab as rr, ac as ir, ad as Pe, ae as or, af as ar, ag as sr, ah as lr, ai as cr, aj as yt, ak as Ae, al as dr, am as ur, an as gr, ao as hr, ap as pr, aq as fr, ar as vr, as as mr, at as yr, au as wr, av as Sr, aw as br, ax as Er, ay as xr, az as Pr, aA as Cr, aB as Fr, aC as _r } from "./App-UP5voPz2.js";
import { bk as Be, aJ as He, aq as It, b6 as Ye, b0 as Ve, a as e, bf as ue, b as S, Z as Se, bC as me, ap as we, b3 as ge, b4 as Ze, aS as Q, ba as pe, b8 as ye, aR as P, b5 as j, bg as kr, b9 as he, aN as ve, b1 as Ir, b2 as Mt, bl as Mr, u as Ie, bi as wt } from "./entry-jZ4F5rmU.js";
class Tr {
  constructor(t, r = {}) {
    this.deps = r, t && this.setRxNostr(t), this.deps.console = r.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = r.authStateStore || bn, this.deps.hashtagStore = r.hashtagStore || pt, this.deps.mediaFreePlacementStore = r.mediaFreePlacementStore || qe, this.deps.mediaGalleryStore = r.mediaGalleryStore || oe, this.deps.contentWarningStore = r.contentWarningStore || Et, this.deps.contentWarningReasonStore = r.contentWarningReasonStore || xt, this.deps.keyManager = r.keyManager || En, this.deps.createImetaTagFn = r.createImetaTagFn || xn, this.deps.settingsStore = r.settingsStore || Pn, this.deps.writeRelaysStore = r.writeRelaysStore || Cn, this.deps.replyQuoteState = r.replyQuoteState || Pt, this.deps.getClientTagFn = r.getClientTagFn || (() => Fn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = r.seckeySignerFn || ft, this.deps.extractContentWithImagesFn = r.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = r.extractContentWithEmojiTagsFn || (r.extractContentWithImagesFn ? (a) => ({ content: r.extractContentWithImagesFn(a), emojiTags: [] }) : _n), this.deps.extractImageBlurhashMapFn = r.extractImageBlurhashMapFn || kn, this.deps.resetEditorStateFn = r.resetEditorStateFn || In, this.deps.resetPostStatusFn = r.resetPostStatusFn || Mn, this.deps.notificationPort = r.iframeMessageService || r.notificationPort || Tn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = r.hashtagPinStore || Ct, this.deps.saveHashtagsToHistoryFn = r.saveHashtagsToHistoryFn || Dn, this.deps.clearReplyQuoteFn = r.clearReplyQuoteFn || Ue;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new Ln(t, this.deps.console || console);
  }
  clearReplyQuoteAfterSuccess() {
    this.deps.clearReplyQuoteFn?.();
  }
  getReplyQuoteNotifyOptions() {
    const t = this.deps.replyQuoteState.value, r = Array.from(
      new Set(t.quotes.map((a) => a.eventId))
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
    return An.buildEvent(
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
  finalizeSubmittedPost(t, r, a) {
    return t.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(r)).catch(() => {
      this.deps.console?.warn?.("hashtag_history_save_failed", {
        stage: "post-success",
        reason: "unexpected"
      });
    }), this.clearReplyQuoteAfterSuccess(), this.deps.notificationPort?.notifyPostSuccess({
      ...a,
      ...t.eventId ? { eventId: t.eventId } : {}
    }), t) : (this.deps.notificationPort?.notifyPostError(t.error), t);
  }
  async saveSubmittedPostHistory(t) {
    if (!t.result.success || !this.deps.savePostHistoryFn) return;
    const r = Be.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), a = Be.sanitizeExternalRelayUrls([
      ...r,
      ...t.additionalWriteRelays ?? [],
      ...this.deps.writeRelaysStore?.value ?? []
    ], { limit: 3 });
    try {
      await this.deps.savePostHistoryFn({
        event: t.event,
        attestation: t.attestation,
        acceptedRelays: r,
        relayHints: a
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
    Le(this.deps.authStateStore, t.sessionPubkey);
    const a = Rn(t.event), s = r ? await r(a.signerTemplate) : t.event;
    Le(this.deps.authStateStore, t.sessionPubkey);
    let o;
    try {
      o = Hn(
        a.expectedTemplate,
        s,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    Le(this.deps.authStateStore, t.sessionPubkey);
    const l = On(o);
    if (!l)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: o?.kind ?? "(missing)"
    }), r && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), Le(this.deps.authStateStore, t.sessionPubkey);
    const c = await this.eventSender.sendEvent(l.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: c.success
    });
    const f = c.success ? {
      ...c,
      eventId: c.eventId ?? l.event.id,
      event: l.event
    } : c;
    return await this.saveSubmittedPostHistory({
      event: l.event,
      attestation: l.attestation,
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
    return Wn.validatePost(
      t,
      r.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, r, a = []) {
    let s = Nn(t);
    const o = this.deps.settingsStore.quoteNotificationEnabled, l = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      s,
      o
    ) ?? new Re().extractInlineQuoteTags(
      s,
      o
    ), c = this.deps.replyQuoteState.value;
    if (c.quotes.length > 0) {
      const y = this.deps.replyQuoteService || new Re(), E = new Set(
        l.filter((p) => p[0] === "q").map((p) => p[1])
      ), T = c.quotes.filter((p) => !E.has(p.eventId)).map(
        (p) => y.generateNostrUri(
          p.eventId,
          p.relayHints,
          p.authorPubkey
        )
      );
      T.length > 0 && (s = `${s.trimEnd()}
${T.join(`
`)}`.trim());
    }
    const f = this.validatePost(s);
    if (!f.valid)
      return this.notifyPostFailure(f.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    if (Bn() && Be.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const y = this.deps.authStateStore, E = zn(y), T = this.deps.hashtagStore, { hashtags: p, tags: _ } = this.getHashtagArrays(T), L = this.deps.keyManager, D = this.deps.window || (typeof window < "u" ? window : void 0), Z = this.deps.contentWarningStore.value, te = this.deps.contentWarningReasonStore.value, se = this.deps.channelContextState?.value ?? null, J = se?.channelRelays, K = this.deps.replyQuoteState.value;
      let A;
      const d = this.getReplyQuoteNotifyOptions();
      if (K.reply || K.quotes.length > 0) {
        const I = this.deps.replyQuoteService || new Re();
        A = [], K.reply && (se ? (A.push([
          "e",
          K.reply.eventId,
          K.reply.relayHints[0] || "",
          "reply",
          ...K.reply.authorPubkey ? [K.reply.authorPubkey] : []
        ]), I.buildReplyTags(K.reply).filter((q) => q[0] === "p").forEach((q) => {
          A.push(q);
        })) : A.push(...I.buildReplyTags(K.reply)));
        const C = /* @__PURE__ */ new Set(), w = new Set(
          A.filter((q) => q[0] === "p").map((q) => q[1])
        );
        K.quotes.forEach((q) => {
          I.buildQuoteTags(q, q.quoteNotificationEnabled).forEach((B) => {
            if (B[0] === "q") {
              if (C.has(B[1]))
                return;
              C.add(B[1]);
            }
            if (B[0] === "p") {
              if (w.has(B[1]))
                return;
              w.add(B[1]);
            }
            A.push(B);
          });
        });
      }
      if (l.length > 0) {
        A || (A = []);
        const I = new Set(
          A.filter((w) => w[0] === "q").map((w) => w[1])
        ), C = new Set(
          A.filter((w) => w[0] === "p").map((w) => w[1])
        );
        for (const w of l)
          w[0] === "q" && !I.has(w[1]) ? (A.push(w), I.add(w[1])) : w[0] === "p" && !C.has(w[1]) && (A.push(w), C.add(w[1]));
      }
      const Y = y.value;
      if (Y.type === "nip07" && L.isWindowNostrAvailable() && D?.nostr)
        try {
          const I = Y.pubkey;
          if (!I)
            return this.notifyPostFailure("pubkey_not_found");
          const C = typeof D.nostr.signEvent == "function" ? D.nostr.signEvent.bind(D.nostr) : void 0;
          if (!C)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const w = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: _,
            pubkey: I,
            imageImetaMap: r,
            contentWarningEnabled: Z,
            contentWarningReason: te,
            replyQuoteTags: A,
            channelContext: se,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: w,
            sessionPubkey: E,
            hashtags: p,
            rqNotifyOptions: d,
            signEvent: C,
            logSignedEvent: !0,
            additionalWriteRelays: J
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (Y.type === "nip46")
        try {
          const I = Y.pubkey;
          if (!I)
            return this.notifyPostFailure("pubkey_not_found");
          const C = await this.deps.getNip46SignerForSessionFn?.(I), w = this.deps.authStateStore.value;
          if (!C || !w.isAuthenticated || w.type !== "nip46" || w.pubkey !== I)
            return this.notifyPostFailure("nip46_signer_not_available");
          const q = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: _,
            pubkey: I,
            imageImetaMap: r,
            contentWarningEnabled: Z,
            contentWarningReason: te,
            replyQuoteTags: A,
            channelContext: se,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: q,
            sessionPubkey: E,
            hashtags: p,
            rqNotifyOptions: d,
            signer: C,
            additionalWriteRelays: J
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (Y.type === "parentClient") {
        const I = this.deps.getParentClientSignerFn?.();
        if (!I)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const C = Y.pubkey;
        if (!C)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const w = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: _,
            pubkey: C,
            imageImetaMap: r,
            contentWarningEnabled: Z,
            contentWarningReason: te,
            replyQuoteTags: A,
            channelContext: se,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: w,
            sessionPubkey: E,
            hashtags: p,
            rqNotifyOptions: d,
            signer: I,
            additionalWriteRelays: J
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const M = L.getFromStore() || L.loadFromStorage(Y.pubkey);
      if (!M)
        return this.notifyPostFailure("key_not_found");
      const V = await this.buildSubmissionEvent({
        processedContent: s,
        hashtags: p,
        tags: _,
        imageImetaMap: r,
        contentWarningEnabled: Z,
        contentWarningReason: te,
        replyQuoteTags: A,
        channelContext: se,
        emojiTags: a
      }), $ = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(M) : ft(M);
      return await this.sendPreparedEvent({
        event: V,
        sessionPubkey: E,
        hashtags: p,
        rqNotifyOptions: d,
        signer: $,
        additionalWriteRelays: J
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
    const r = t || this.deps.hashtagStore, a = this.deps.hashtagSnapshotFn;
    if (a) {
      const s = a(r);
      return {
        hashtags: Array.isArray(s?.hashtags) ? [...s.hashtags] : [],
        tags: Array.isArray(s?.tags) ? s.tags.map((o) => [...o]) : []
      };
    }
    if (r === pt)
      try {
        const s = Ft();
        return {
          hashtags: Array.isArray(s?.hashtags) ? [...s.hashtags] : [],
          tags: Array.isArray(s?.tags) ? s.tags.map((o) => [...o]) : []
        };
      } catch (s) {
        this.deps.console?.warn("hashtag_snapshot_failed", s);
      }
    return {
      hashtags: Array.isArray(r?.hashtags) ? [...r.hashtags] : [],
      tags: Array.isArray(r?.tags) ? r.tags.map((s) => [...s]) : []
    };
  }
  // --- PostComponent 統合メソッド ---
  preparePostPayload(t) {
    const r = this.deps.extractContentWithEmojiTagsFn(t);
    if (!this.deps.mediaFreePlacementStore.value) {
      const a = this.deps.mediaGalleryStore.getContentUrls();
      if (a.length > 0) {
        const s = r.content.trim();
        return {
          content: s ? s + `
` + a.join(`
`) : a.join(`
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
  prepareImageBlurhashMap(t, r, a) {
    if (!this.deps.mediaFreePlacementStore.value)
      return this.deps.mediaGalleryStore.getImageBlurhashMap();
    const s = {};
    t?.state?.doc?.descendants?.((c) => {
      if (c.type?.name !== "image" || !c.attrs?.src || c.attrs?.isPlaceholder)
        return;
      const f = typeof c.attrs.size == "number" ? c.attrs.size : Number(c.attrs.size);
      s[c.attrs.src] = {
        dim: c.attrs.dim ?? void 0,
        alt: c.attrs.alt ?? void 0,
        size: Number.isFinite(f) && f > 0 ? f : void 0,
        uploadProtocol: c.attrs.uploadProtocol ?? void 0
      };
    });
    const o = this.deps.extractImageBlurhashMapFn(t), l = {};
    for (const [c, f] of Object.entries(o))
      l[c] = {
        m: jn(c),
        blurhash: f,
        dim: s[c]?.dim,
        alt: s[c]?.alt,
        size: s[c]?.size,
        uploadProtocol: s[c]?.uploadProtocol,
        ox: r[c],
        x: a[c]
      };
    return l;
  }
  async performPostSubmission(t, r, a, s, o, l) {
    const c = this.preparePostPayload(t), f = this.prepareImageBlurhashMap(t, r, a);
    s?.();
    try {
      const y = await this.submitPost(c.content, f, c.emojiTags);
      y.success ? o?.(y) : l?.(y.error || "post_error");
    } catch {
      l?.("post_error");
    }
  }
  applyEmptyStateToEditor(t) {
    t.chain().clearContent().run();
  }
  resetPostContent(t) {
    this.applyEmptyStateToEditor(t), this.deps.resetEditorStateFn?.(), this.deps.resetPostStatusFn?.(), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), this.deps.clearReplyQuoteFn?.();
  }
  clearContentAfterSuccess(t) {
    const r = this.deps.hashtagPinStore.value, a = r ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), r && a.length > 0) {
      const s = " " + a.map((o) => "#" + o).join(" ");
      t.commands.insertContent(s);
    }
    t.commands.focus("start");
  }
}
function Dr(n) {
  return !!n && n.length > 0;
}
function Lr(n, t, r) {
  n.isUploading = t, n.uploadErrorMessage = r || "";
}
function Ar(n) {
  const t = n.target;
  return t?.files?.length ? t.files : void 0;
}
function Rr({
  getCurrentEditor: n,
  getFileInput: t,
  getImageOxMap: r,
  getImageXMap: a,
  getUploadFailedText: s,
  updateUploadState: o,
  setUploadErrorMessage: l,
  uploadFiles: c
}) {
  const f = async (E) => Dr(E) ? await c({
    files: E,
    currentEditor: n(),
    fileInput: t(),
    updateUploadState: o,
    setUploadErrorMessage: l,
    imageOxMap: r(),
    imageXMap: a(),
    getUploadFailedText: s
  }) ?? null : null;
  return {
    performUpload: f,
    handleFileSelect: (E) => {
      const T = Ar(E);
      T && f(T);
    }
  };
}
let W = He({
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
}), Me;
function St() {
  Me !== void 0 && (clearTimeout(Me), Me = void 0);
}
const ce = {
  get value() {
    return W;
  },
  // 秘密鍵ダイアログ
  showSecretKeyDialog: (n, t = []) => {
    W.pendingPost = n, W.pendingEmojiTags = t.map((r) => [...r]), W.showSecretKeyDialog = !0;
  },
  hideSecretKeyDialog: () => {
    W.showSecretKeyDialog = !1, W.pendingPost = "", W.pendingEmojiTags = [];
  },
  getPendingPost: () => W.pendingPost,
  getPendingEmojiTags: () => W.pendingEmojiTags.map((n) => [...n]),
  // 画像フルスクリーン
  showImageFullscreen: (n, t = "", r = "") => {
    W.fullscreenMediaId = r, W.fullscreenImageSrc = n, W.fullscreenImageAlt = t, W.showImageFullscreen = !0;
  },
  hideImageFullscreen: () => {
    W.showImageFullscreen = !1, W.fullscreenMediaId = "", W.fullscreenImageSrc = "", W.fullscreenImageAlt = "";
  },
  // フローティングメッセージ
  showFloatingMessage: (n, t, r, a = 1800) => {
    St(), W.floatingMessageX = n, W.floatingMessageY = t, W.floatingMessageText = r, W.showFloatingMessage = !0, Me = setTimeout(
      () => {
        W.showFloatingMessage = !1, Me = void 0;
      },
      a
    );
  },
  hideFloatingMessage: () => {
    St(), W.showFloatingMessage = !1;
  }
};
var Hr = pe('<img draggable="false"/>'), Or = pe('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), Wr = pe('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const Nr = {
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
function Tt(n, t) {
  Ve(t, !0), Xe(n, Nr);
  const r = () => Qe($e, "$_", a), [a, s] = Ge();
  let o = z(t, "item", 7), l = z(t, "index", 7), c = z(t, "onDelete", 7), f = z(t, "onDragStart", 7), y = z(t, "onDragOver", 7), E = z(t, "onDragEnd", 7), T = z(t, "onDrop", 7), p = z(t, "onTouchDragStart", 7), _ = z(t, "disabled", 7, !1), L = Q(void 0), D = Q(void 0);
  const Z = Xn();
  qn(() => e(L), {
    onLongPress: (u, R) => {
      _() || p()?.(l(), u, R);
    }
  });
  let te = P(() => !o().isPlaceholder && o().type === "image" && !!o().src), se = P(() => !o().isPlaceholder && o().type === "video" && !!o().src);
  const J = 180, K = 100, A = 180;
  let d = P(() => {
    if (!o().isPlaceholder) return;
    const u = o().dimensions;
    if (u && u.width > 0 && u.height > 0) {
      const R = u.width / u.height, X = Math.round(J * R);
      return `width: ${Math.max(K, Math.min(A, X))}px; height: ${J}px;`;
    }
    return `width: ${A}px; height: ${J}px;`;
  });
  function Y() {
    o().isPlaceholder || o().type !== "image" || ce.showImageFullscreen(o().src, o().alt || "", o().id);
  }
  function ne(u) {
    if (_()) {
      u.preventDefault();
      return;
    }
    if (e(L) && u.dataTransfer) {
      const R = e(L).getBoundingClientRect(), X = u.clientX - R.left, G = u.clientY - R.top;
      u.dataTransfer.setDragImage(e(L), X, G);
    }
    f()(l(), u);
  }
  function M(u) {
    u.stopPropagation(), e(D) && (e(D).paused ? e(D).play() : e(D).pause());
  }
  function V(u) {
    u.preventDefault(), !_() && y()(l(), u);
  }
  function $(u) {
    u.preventDefault(), !_() && T()(l());
  }
  function I(u) {
    o().type !== "image" || o().isPlaceholder || (u.key === "Enter" || u.key === " " || u.key === "Spacebar") && (u.preventDefault(), Y());
  }
  var C = {
    get item() {
      return o();
    },
    set item(u) {
      o(u), j();
    },
    get index() {
      return l();
    },
    set index(u) {
      l(u), j();
    },
    get onDelete() {
      return c();
    },
    set onDelete(u) {
      c(u), j();
    },
    get onDragStart() {
      return f();
    },
    set onDragStart(u) {
      f(u), j();
    },
    get onDragOver() {
      return y();
    },
    set onDragOver(u) {
      y(u), j();
    },
    get onDragEnd() {
      return E();
    },
    set onDragEnd(u) {
      E(u), j();
    },
    get onDrop() {
      return T();
    },
    set onDrop(u) {
      T(u), j();
    },
    get onTouchDragStart() {
      return p();
    },
    set onTouchDragStart(u) {
      p(u), j();
    },
    get disabled() {
      return _();
    },
    set disabled(u = !1) {
      _(u), j();
    }
  }, w = Wr();
  let q;
  var B = ye(w), be = ye(B);
  {
    var v = (u) => {
      {
        let R = P(() => o().type === "video" ? r()("videoNode.uploading") : r()("imageNode.uploading"));
        Un(u, {
          get text() {
            return e(R);
          },
          showLoader: !0
        });
      }
    };
    ae(be, (u) => {
      o().isPlaceholder && u(v);
    });
  }
  var h = ue(be, 2);
  {
    var N = (u) => {
      var R = Hr();
      let X;
      Se(() => {
        de(R, "src", o().src), de(R, "alt", o().alt || ""), X = Fe(R, 1, "gallery-image svelte-aw59wn", null, X, { "image-loading": !Z.isLoaded });
      }), me("load", R, function(...G) {
        Z.handleLoad?.apply(this, G);
      }), me("error", R, function(...G) {
        Z.handleError?.apply(this, G);
      }), we("contextmenu", R, (G) => G.preventDefault()), kr(R), ge(u, R);
    };
    ae(h, (u) => {
      e(te) && u(N);
    });
  }
  var k = ue(h, 2);
  {
    var F = (u) => {
      var R = Or(), X = ye(R);
      X.muted = !0, Ce(X, (_e) => S(D, _e), () => e(D));
      var G = ue(X, 2);
      he(R), Se(() => {
        de(X, "src", o().src), de(G, "draggable", !_());
      }), we("contextmenu", X, (_e) => _e.preventDefault()), me("dragstart", G, ne), we("click", G, M), ge(u, R);
    };
    ae(k, (u) => {
      e(se) && u(F);
    });
  }
  he(B);
  var H = ue(B, 2);
  {
    var O = (u) => {
      {
        let R = P(() => r()("imageContextMenu.delete")), X = P(() => r()("imageContextMenu.copyUrl")), G = P(() => r()("imageContextMenu.copySuccess"));
        Kn(u, {
          get src() {
            return o().src;
          },
          onDelete: () => c()(o().id),
          get deleteAriaLabel() {
            return e(R);
          },
          get copyAriaLabel() {
            return e(X);
          },
          get copySuccessMessage() {
            return e(G);
          },
          layout: "gallery",
          get deleteDisabled() {
            return _();
          }
        });
      }
    };
    ae(H, (u) => {
      o().isPlaceholder || u(O);
    });
  }
  he(w), Ce(w, (u) => S(L, u), () => e(L)), Se(() => {
    q = Fe(w, 1, "gallery-item svelte-aw59wn", null, q, {
      "is-placeholder": o().isPlaceholder,
      "is-disabled": _()
    }), de(w, "draggable", !_() && (o().type !== "video" || o().isPlaceholder)), _t(B, e(d)), de(B, "role", o().type === "image" && !o().isPlaceholder ? "button" : void 0), de(B, "tabindex", o().type === "image" && !o().isPlaceholder ? 0 : void 0), de(B, "aria-label", o().alt || o().src);
  }), me("dragstart", w, ne), me("dragover", w, V), me("drop", w, $), me("dragend", w, () => E()()), we("click", B, function(...u) {
    (o().type === "image" && !o().isPlaceholder ? Y : void 0)?.apply(this, u);
  }), we("keydown", B, I), ge(n, w);
  var re = Ze(C);
  return s(), re;
}
It(["click", "keydown", "contextmenu"]);
Ye(
  Tt,
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
function zr(n) {
  return Math.abs(n.deltaX) > Math.abs(n.deltaY) ? n.deltaX : n.deltaY;
}
function jr(n, t) {
  const r = n.scrollHeight - n.clientHeight;
  if (r <= 1)
    return !1;
  const a = n.scrollTop <= 0, s = n.scrollTop >= r - 1;
  return t > 0 ? !s : t < 0 ? !a : !1;
}
function Br(n, t) {
  const r = n.scrollWidth - n.clientWidth;
  if (r <= 1)
    return !1;
  const a = n.scrollLeft <= 0, s = n.scrollLeft >= r - 1;
  return t > 0 ? !s : t < 0 ? !a : !1;
}
function qr(n, t, r = null) {
  if (r && jr(r, t.deltaY))
    return !1;
  const a = zr(t);
  if (!Br(n, a))
    return !1;
  const s = Math.max(
    0,
    n.scrollWidth - n.clientWidth
  );
  return n.scrollLeft = Math.min(
    s,
    Math.max(0, n.scrollLeft + a)
  ), !0;
}
var Ur = pe("<div><!></div>"), Kr = pe('<div role="list"></div>');
const Xr = {
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
function Dt(n, t) {
  Ve(t, !0), Xe(n, Xr);
  const r = () => Qe($e, "$_", a), [a, s] = Ge();
  let o = Q(-1), l = Q(-1), c = Q(-1), f = Q(-1), y = null, E = 60, T = 60, p = Q(void 0), _ = null, L = P(() => oe.items), D = P(() => ee.postStatus.sending), Z = P(() => {
    const v = e(o) !== -1 ? e(o) : e(c), h = e(o) !== -1 ? e(l) : e(f);
    return v === -1 || h === -1 || h === v || h === v + 1 ? -1 : h;
  });
  function te(v, h) {
    if (e(D)) {
      h.preventDefault();
      return;
    }
    S(o, v, !0), h.dataTransfer?.setData("text/plain", String(v)), h.dataTransfer && (h.dataTransfer.effectAllowed = "move");
  }
  function se(v, h) {
    if (h.preventDefault(), e(D)) return;
    const k = e(p)?.querySelectorAll(".gallery-item-wrapper")?.[v];
    if (k) {
      const F = k.getBoundingClientRect();
      S(l, h.clientX < F.left + F.width / 2 ? v : v + 1, !0);
    } else
      S(l, v, !0);
  }
  function J() {
    M(), S(o, -1), S(l, -1);
  }
  function K(v) {
  }
  function A(v) {
    if (e(o) === -1) return;
    if (v.preventDefault(), e(D)) {
      M(), S(l, -1);
      return;
    }
    const h = e(p)?.querySelectorAll(".gallery-item-wrapper");
    if (h && h.length > 0) {
      const N = h[0].getBoundingClientRect(), k = h[h.length - 1].getBoundingClientRect();
      v.clientX < N.left ? S(l, 0) : v.clientX > k.right && S(l, e(L).length, !0);
    }
    if (e(p)) {
      const N = e(p).getBoundingClientRect();
      v.clientX - N.left < ke ? ne("left", v.clientX) : N.right - v.clientX < ke ? ne("right", v.clientX) : M();
    }
  }
  function d(v) {
    if (v.preventDefault(), M(), e(D)) {
      S(o, -1), S(l, -1);
      return;
    }
    const h = e(l);
    if (e(o) !== -1 && h !== -1 && h !== e(o) && h !== e(o) + 1) {
      const N = e(o) < h ? h - 1 : h;
      oe.reorderItems(e(o), N);
    }
    S(o, -1), S(l, -1);
  }
  function Y(v) {
    e(D) || oe.removeItem(v);
  }
  function ne(v, h) {
    if (!e(p)) return;
    _ !== null && (cancelAnimationFrame(_), _ = null);
    const N = e(p).getBoundingClientRect(), k = v === "left" ? h - N.left : N.right - h, F = Math.max(0, Math.min(1, k / ke)), H = vt + (Qn - vt) * (1 - F), O = () => {
      if (!e(p)) return;
      const re = e(p).scrollWidth - e(p).clientWidth;
      v === "left" && e(p).scrollLeft > 0 ? (e(p).scrollLeft = Math.max(0, e(p).scrollLeft - H), _ = requestAnimationFrame(O)) : v === "right" && e(p).scrollLeft < re ? (e(p).scrollLeft = Math.min(re, e(p).scrollLeft + H), _ = requestAnimationFrame(O)) : _ = null;
    };
    _ = requestAnimationFrame(O);
  }
  function M() {
    _ !== null && (cancelAnimationFrame(_), _ = null);
  }
  function V(v, h, N) {
    if (e(D)) return;
    S(c, v, !0), C();
    const k = e(p)?.querySelectorAll(".gallery-item-wrapper")[v];
    if (k) {
      const F = k.getBoundingClientRect(), H = 120, O = Math.min(H / F.width, H / F.height);
      E = F.width * O / 2, T = F.height * O / 2, y = k.cloneNode(!0), y.style.cssText = `
                position: fixed;
                left: ${h - E}px;
                top: ${N - T}px;
                width: ${F.width}px;
                height: ${F.height}px;
                transform-origin: top left;
                transform: scale(${O});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, Mr().overlayTarget.appendChild(y);
    }
    document.addEventListener("touchmove", $, { passive: !1 }), document.addEventListener("touchend", I, { passive: !1 });
  }
  function $(v) {
    if (e(c) === -1 || v.touches.length !== 1) return;
    if (v.preventDefault(), e(D)) {
      M(), S(f, -1);
      return;
    }
    const h = v.touches[0];
    y && (y.style.left = `${h.clientX - E}px`, y.style.top = `${h.clientY - T}px`), y && (y.style.display = "none");
    const N = document.elementFromPoint(h.clientX, h.clientY);
    y && (y.style.display = "");
    const k = N?.closest(".gallery-item-wrapper");
    if (k && e(p)) {
      const F = e(p).querySelectorAll(".gallery-item-wrapper"), H = Array.from(F).indexOf(k);
      if (H !== -1) {
        const O = k.getBoundingClientRect();
        S(f, h.clientX < O.left + O.width / 2 ? H : H + 1, !0);
      }
    } else if (e(p)) {
      const F = e(p).querySelectorAll(".gallery-item-wrapper");
      if (F.length > 0) {
        const H = F[0].getBoundingClientRect(), O = F[F.length - 1].getBoundingClientRect();
        h.clientX <= H.left ? S(f, 0) : h.clientX >= O.right && S(f, e(L).length, !0);
      }
    }
    if (e(p)) {
      const F = e(p).getBoundingClientRect();
      h.clientX - F.left < ke ? ne("left", h.clientX) : F.right - h.clientX < ke ? ne("right", h.clientX) : M();
    }
  }
  function I() {
    if (document.removeEventListener("touchmove", $), document.removeEventListener("touchend", I), M(), e(D)) {
      C(), S(c, -1), S(f, -1);
      return;
    }
    const v = e(f);
    if (e(c) !== -1 && v !== -1 && v !== e(c) && v !== e(c) + 1) {
      const h = e(c) < v ? v - 1 : v;
      oe.reorderItems(e(c), h);
    }
    C(), S(c, -1), S(f, -1);
  }
  function C() {
    y && (y.remove(), y = null);
  }
  function w(v) {
    if (!e(p)) return;
    const h = e(p).closest(".composer-scroll-region");
    qr(e(p), v, h instanceof HTMLElement ? h : null) && v.preventDefault();
  }
  ve(() => {
    if (e(p))
      return e(p).addEventListener("wheel", w, { passive: !1 }), () => {
        e(p)?.removeEventListener("wheel", w);
      };
  });
  var q = Ir(), B = Mt(q);
  {
    var be = (v) => {
      var h = Kr();
      let N;
      Gn(h, 23, () => e(L), (k) => k.id, (k, F, H) => {
        var O = Ur();
        let re;
        var u = ye(O);
        Tt(u, {
          get item() {
            return e(F);
          },
          get index() {
            return e(H);
          },
          onDelete: Y,
          onDragStart: te,
          onDragOver: se,
          onDragEnd: J,
          onDrop: K,
          onTouchDragStart: V,
          get disabled() {
            return e(D);
          }
        }), he(O), Se(() => re = Fe(O, 1, "gallery-item-wrapper svelte-w2vv8k", null, re, {
          "insert-bar-left": e(Z) === e(H),
          "insert-bar-right": e(Z) === e(L).length && e(H) === e(L).length - 1
        })), ge(k, O);
      }), he(h), Ce(h, (k) => S(p, k), () => e(p)), Se(
        (k) => {
          N = Fe(h, 1, "media-gallery svelte-w2vv8k", null, N, { sending: e(D) }), de(h, "aria-label", k);
        },
        [() => r()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), me("dragover", h, A), me("drop", h, d), ge(v, h);
    };
    ae(B, (v) => {
      e(L).length > 0 && v(be);
    });
  }
  ge(n, q), Ze(), s();
}
Ye(Dt, {}, [], [], { mode: "open" });
function Ke(n) {
  if (!n || !n.types) return !1;
  try {
    return Array.from(n.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function Lt(n) {
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
function De(n) {
  return typeof n.__uploadFiles == "function";
}
function Gr(n) {
  let t = Q(!1);
  function r(o) {
    if (Te(n) || !De(n)) {
      o.preventDefault(), S(t, !1), n.classList.remove("drag-over");
      return;
    }
    const l = o.dataTransfer, c = Ke(l);
    Lt(l) && !c ? (o.preventDefault(), e(t) || (S(t, !0), n.classList.add("drag-over"))) : e(t) && (S(t, !1), n.classList.remove("drag-over"));
  }
  function a(o) {
    e(t) && (S(t, !1), n.classList.remove("drag-over"));
  }
  async function s(o) {
    if (S(t, !1), n.classList.remove("drag-over"), Te(n) || !De(n)) {
      o.preventDefault();
      return;
    }
    const l = o.dataTransfer;
    Ke(l) || l?.files && l.files.length > 0 && typeof n.__uploadFiles == "function" && (o.preventDefault(), n.__uploadFiles(l.files));
  }
  return n.addEventListener("dragover", r), n.addEventListener("dragleave", a), n.addEventListener("drop", s), {
    destroy() {
      n.removeEventListener("dragover", r), n.removeEventListener("dragleave", a), n.removeEventListener("drop", s);
    }
  };
}
function Qr(n, t) {
  const r = Gr(n);
  function a(l) {
    if (Te(n) || !De(n)) {
      l.preventDefault(), t.dragOver(!1);
      return;
    }
    const c = l.dataTransfer, f = Ke(c);
    Lt(c) && !f ? t.dragOver(!0) : t.dragOver(!1);
  }
  function s(l) {
    t.dragOver(!1);
  }
  function o(l) {
    t.dragOver(!1), (Te(n) || !De(n)) && l.preventDefault();
  }
  return n.addEventListener("dragover", a), n.addEventListener("dragleave", s), n.addEventListener("drop", o), {
    destroy() {
      r?.destroy?.(), n.removeEventListener("dragover", a), n.removeEventListener("dragleave", s), n.removeEventListener("drop", o);
    }
  };
}
function $r(n) {
  function t(r) {
    if (Te(n)) {
      r.preventDefault();
      return;
    }
    if (!r.clipboardData) return;
    if (!De(n)) {
      Array.from(r.clipboardData.items).some((o) => o.kind === "file" && o.type.startsWith("image/")) && r.preventDefault();
      return;
    }
    const a = [];
    for (const s of r.clipboardData.items)
      if (s.kind === "file" && s.type.startsWith("image/")) {
        const o = s.getAsFile();
        o && a.push(o);
      }
    a.length > 0 && (r.preventDefault(), n.__uploadFiles?.(a));
  }
  return n.addEventListener("paste", t), {
    destroy() {
      n.removeEventListener("paste", t);
    }
  };
}
function Yr(n) {
  function t(a) {
    const s = a.target;
    if (s && (s.closest('.editor-image-button[data-dragging="true"]') || s.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const o = a.touches[0], l = 120, c = mt.querySelector(".tiptap-editor");
      if (c) {
        const f = c.getBoundingClientRect(), y = o.clientY < f.top + l, E = o.clientY > f.bottom - l;
        if (!y && !E)
          return a.preventDefault(), !1;
      }
    }
  }
  function r(a) {
    const s = mt.querySelectorAll(".drop-zone-indicator");
    s.forEach((o) => {
      o.classList.remove("drop-zone-hover"), o.classList.add("drop-zone-fade-out");
    }), setTimeout(
      () => {
        s.forEach((o) => {
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
function Vr(n) {
  function t(r) {
    if ((r.ctrlKey || r.metaKey) && (r.key === "Enter" || r.key === "NumpadEnter")) {
      r.preventDefault();
      const a = n.__currentEditor, s = typeof a == "function" ? a() : a, o = n.__hasPostingCapability, l = typeof o == "function" ? o() : o, c = n.__hasStoredKey, f = typeof c == "function" ? c() : c, y = n.__postStatus, E = typeof y == "function" ? y() : y, T = s ? Yn(s) : "";
      !E?.sending && T.trim() && (l ?? f) && n.__submitPost?.();
    }
  }
  return n.addEventListener("keydown", t), {
    destroy() {
      n.removeEventListener("keydown", t);
    }
  };
}
function Zr(n) {
  let t = !1;
  return n?.descendants((r) => {
    if (t) return !1;
    const a = r.type?.name;
    (a === "image" || a === "video") && (t = !0);
  }), t;
}
function Jr(n) {
  const { currentEditor: t, editorContainerEl: r, callbacks: a } = n, s = (c) => {
    const y = c.detail.plainText, E = t ? Zr(t.state?.doc) : !1;
    a.onContentUpdate?.(y, E);
  }, o = (c) => {
    const f = c;
    a.onImageFullscreenRequest?.(f.detail.src, f.detail.alt || "", f.detail.mediaId);
  }, l = (c) => {
    const y = c?.detail?.pos;
    if (y != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const E = $n.create(t.state.doc, y);
        t.view.dispatch(t.state.tr.setSelection(E).scrollIntoView());
      } catch (E) {
        console.warn("select-image-node handler failed:", E);
      }
      a.onSelectImageNode?.(y);
    }
  };
  return window.addEventListener("editor-content-changed", s), window.addEventListener("image-fullscreen-request", o), window.addEventListener("select-image-node", l), r && (r.addEventListener("image-fullscreen-request", o), r.addEventListener("select-image-node", l)), {
    handleContentUpdate: s,
    handleImageFullscreenRequest: o,
    handleSelectImageNode: l
  };
}
function ei(n, t) {
  window.removeEventListener("editor-content-changed", n.handleContentUpdate), window.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), window.removeEventListener("select-image-node", n.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), t.removeEventListener("select-image-node", n.handleSelectImageNode));
}
function ti() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function ni(n) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (n?.rejectedRelays?.length ?? 0) > 0 || (n?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function ri(n) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: n || "postComponent.post_error",
    completed: !1
  };
}
function ii({
  updatePostStatus: n,
  clearContentAfterSuccess: t,
  onPostSuccess: r
}) {
  return {
    markSending: () => {
      n(ti());
    },
    markSuccess: (a) => {
      n(ni(a)), t(), r?.(a);
    },
    markFailure: (a) => {
      n(ri(a));
    }
  };
}
async function oi(n) {
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
function bt(n) {
  if (n.dimensions && n.dimensions.width > 0 && n.dimensions.height > 0)
    return {
      width: n.dimensions.width,
      height: n.dimensions.height
    };
  const t = Vn(n.dim);
  return t || {};
}
function ai(n) {
  if (!n.mediaFreePlacement)
    return n.galleryItems.filter((r) => !r.isPlaceholder).map((r) => {
      const a = bt({
        dim: r.dim,
        dimensions: r.dimensions
      });
      return {
        id: r.id,
        src: r.src,
        alt: r.alt,
        type: r.type,
        dim: r.dim,
        width: a.width,
        height: a.height
      };
    });
  if (!n.currentEditor)
    return [];
  const t = [];
  return n.currentEditor.state.doc.descendants((r) => {
    if ((r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder) {
      const a = bt({
        dim: r.attrs.dim
      });
      t.push({
        id: r.attrs.id,
        src: r.attrs.src,
        alt: r.attrs.alt,
        type: r.type.name,
        dim: r.attrs.dim,
        width: a.width,
        height: a.height
      });
    }
  }), t;
}
function si(n, t, r) {
  if (t) {
    const a = n.findIndex((s) => s.id === t);
    if (a >= 0)
      return a;
  }
  return r ? n.findIndex((a) => a.src === r) : -1;
}
function li(n, t) {
  return n[t];
}
function ci(n) {
  const t = [];
  return n.state.doc.descendants((r, a) => {
    (r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder && t.push({ node: r, pos: a });
  }), t;
}
function di(n) {
  const t = ci(n.currentEditor);
  if (t.length === 0)
    return !1;
  t.forEach(({ node: a }) => {
    const s = a.attrs.src;
    s && n.addGalleryItem({
      id: n.createMediaItemId(),
      type: a.type.name,
      src: s,
      isPlaceholder: !1,
      blurhash: a.attrs.blurhash ?? void 0,
      ox: n.imageOxMap[s] ?? void 0,
      x: n.imageXMap[s] ?? void 0,
      dim: a.attrs.dim ?? void 0,
      size: typeof a.attrs.size == "number" ? a.attrs.size : void 0,
      alt: a.attrs.alt ?? void 0,
      uploadProtocol: a.attrs.uploadProtocol ?? void 0
    });
  });
  let r = n.currentEditor.state.tr;
  return [...t].reverse().forEach(({ node: a, pos: s }) => {
    r = r.delete(s, s + a.nodeSize);
  }), n.currentEditor.view.dispatch(r), !0;
}
function ui(n) {
  if (n.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = n.currentEditor.state;
  let r = n.currentEditor.state.tr, a = n.currentEditor.state.doc.content.size;
  const s = {}, o = {};
  return n.items.forEach((l) => {
    if (l.isPlaceholder)
      return;
    const c = l.src;
    if (l.type === "image" && t.nodes.image) {
      const f = t.nodes.image.create({
        src: c,
        alt: l.alt ?? "Image",
        blurhash: l.blurhash ?? null,
        dim: l.dim ?? null,
        size: l.size ?? null,
        uploadProtocol: l.uploadProtocol ?? null
      });
      r = r.insert(a, f), a += f.nodeSize;
    } else if (l.type === "video" && t.nodes.video) {
      const f = t.nodes.video.create({ src: c });
      r = r.insert(a, f), a += f.nodeSize;
    }
    l.ox && (s[c] = l.ox), l.x && (o[c] = l.x);
  }), n.currentEditor.view.dispatch(r), {
    imageOxMap: s,
    imageXMap: o,
    hadItems: !0
  };
}
async function gi(n) {
  const {
    input: t,
    postHistoryRepositoryImpl: r = kt,
    postMediaCacheRepositoryImpl: a = Jn
  } = n;
  await r.putPostedEvent(t);
  const s = Zn(t.event).map((o) => o.url).filter(Boolean);
  s.length !== 0 && await a.linkEventIdByUrls({
    eventId: t.event.id,
    urls: s
  });
}
function hi(n) {
  const {
    placeholderText: t,
    editorContainerEl: r,
    hasStoredKey: a,
    hasPostingCapability: s,
    submitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: c,
    uploadFiles: f,
    eventCallbacks: y
  } = n;
  er.value = t;
  const E = tr({
    placeholderText: t,
    onSubmitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: c,
    onCreate: (L) => {
      Oe.set(L);
    }
  });
  let T = null;
  const p = E.subscribe((L) => {
    T = L;
  }), _ = Jr({
    currentEditor: T,
    editorContainerEl: r,
    callbacks: y
  });
  return nr(o), r && Object.assign(r, {
    __uploadFiles: f,
    __currentEditor: () => T,
    __hasStoredKey: () => a,
    __hasPostingCapability: () => s ?? a,
    __postStatus: () => ee.postStatus,
    __submitPost: o
  }), { editor: E, unsubscribe: p, handlers: _ };
}
function pi(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: r,
    handlers: a,
    currentEditor: s,
    editorContainerEl: o,
    submitPost: l
  } = n;
  ei(a, o), Oe.value === s && Oe.set(null), rr(l), r(), t(), s && !s.isDestroyed && s.destroy(), o && (delete o.__uploadFiles, delete o.__currentEditor, delete o.__hasStoredKey, delete o.__hasPostingCapability, delete o.__postStatus, delete o.__submitPost);
}
function fi(n, t) {
  const r = n.view.dom;
  if (ir() && document.activeElement !== r) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
var vi = pe('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), mi = pe('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), yi = pe('<div class="upload-error svelte-15ticnd"> </div>'), wi = pe('<div class="svelte-15ticnd"> </div>'), Si = pe('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const bi = {
  hash: "svelte-15ticnd",
  code: `.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {min-height:0;}.editor-content,
  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;--post-editor-block-padding: 10px;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--surface-editor);-webkit-tap-highlight-color:transparent;overflow:hidden;}.post-container.editor-auto-grow.svelte-15ticnd,
  .post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),
  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,
  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {flex:0 0 auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd),
  .post-container.editor-auto-grow.svelte-15ticnd .editor-content,
  .post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {height:auto;}.post-container.editor-auto-grow.svelte-15ticnd .editor-container:where(.svelte-15ticnd) {min-height:0;max-height:none;}.post-container.editor-auto-grow.svelte-15ticnd .tiptap-editor {min-height:calc(
      var(--post-editor-auto-grow-min-lines) +
      var(--post-editor-block-padding) +
      var(--post-editor-block-padding)
    );max-height:calc(
      var(--post-editor-auto-grow-max-lines) +
      var(--post-editor-block-padding) +
      var(--post-editor-block-padding)
    );}.editor-account-placeholder {position:absolute;top:11px;left:14px;z-index:3;width:28px;height:28px;opacity:0.5;pointer-events:none;user-select:none;-webkit-user-select:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,
  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {object-fit:cover;}.editor-container.account-avatar-placeholder.svelte-15ticnd
    p.is-editor-empty:first-child::before {padding-left:38px;}.editor-container.sending.svelte-15ticnd {background:color-mix(in srgb, var(--surface-editor) 82%, var(--surface-button) 18%);cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.sending.svelte-15ticnd .editor-image-button,
  .editor-container.sending.svelte-15ticnd .custom-emoji-drag-target,
  .editor-container.sending.svelte-15ticnd .media-delete-btn {pointer-events:none;}.editor-container.drag-over.svelte-15ticnd {border:3px dashed var(--theme);}

  /* ギャラリーモード時はドロップカーソル（差し込み位置バー）を常に非表示 */.editor-container.gallery-mode.svelte-15ticnd .tiptap-dropcursor {display:none !important;}

  /* Tiptapエディターのスタイル */.tiptap-editor {display:block;padding:var(--post-editor-block-padding);font-family:inherit;font-size:1.25rem;line-height:1.5;outline:none;overflow-y:auto;overflow-x:hidden;scroll-padding-bottom:16px;scroll-behavior:auto;will-change:scroll-position;transform:translateZ(0);-webkit-tap-highlight-color:transparent;.editor-paragraph {margin:0;padding:0;color:var(--text);position:relative;z-index:2;word-break:normal;overflow-wrap:anywhere;line-break:loose;white-space:break-spaces;}.hashtag {color:var(--hashtag-text);font-weight:600;background:var(--hashtag-bg);padding:2px 4px;border-radius:4px;word-break:break-all;}.preview-link {color:var(--link);word-break:break-all;}.preview-link:visited {color:var(--link-visited);}p.is-editor-empty:first-child::before {color:var(--text);content:attr(data-placeholder);float:left;height:0;pointer-events:none;opacity:0.6;}.toolbar-caret {display:inline-block;width:0;height:1.5em;margin-left:-1px;border-left:2px solid var(--text);vertical-align:-0.25em;pointer-events:none;
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
function Ei(n, t) {
  Ve(t, !0), Xe(n, bi);
  const r = () => Qe($e, "$_", a), [a, s] = Ge();
  let o = z(t, "rxNostr", 7), l = z(t, "hasStoredKey", 7), c = z(t, "hasPostingCapability", 23, l), f = z(t, "isSwitchingAccount", 7, !1), y = z(t, "onPostSuccess", 7), E = z(t, "availableComposerHeight", 7, Pe), T = z(t, "minEditorHeight", 7, Pe), p = z(t, "onCustomEmojiSelect", 7), _ = z(t, "onEditorEmptyChange", 7), L = z(t, "notificationPort", 7), D = z(t, "hostOwnedConfig", 7), Z = z(t, "hostCustomEmojiItems", 23, () => []), te = z(t, "normalUploadFiles", 7);
  const J = !1;
  let K = P(() => !J), A = Q(null), d = Q(null), Y = Q(!1), ne = Q(void 0), M = Q(void 0), V = Q(He({})), $ = Q(He({})), I = P(() => qe.value), C = P(() => ee.postStatus), w = P(() => ee.uploadErrorMessage), q = P(() => _r.value), B = P(() => yr.value), be = P(() => wr.value), v = Q(!0), h = !1, N = P(() => l() && !f() && e(B) && !e(be) && e(v)), k = null, F = null, H = null, O = null, re = Q(He(Pe)), u = P(() => J), R = P(() => e(u) ? `--post-editor-auto-grow-min-lines: ${D().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${D().editorMaxLines}lh;` : `--post-editor-min-height: ${T()}px; --post-editor-target-height: ${e(re)}px;`), X = P(() => r()("postComponent.enter_your_text") || "テキストを入力してください");
  ve(() => {
    e(d), or(e(X));
  }), ve(() => {
    const i = e(d), g = !e(C).sending;
    i && i.isEditable !== g && i.setEditable(g, !1);
  });
  function G() {
    if (e(u)) return;
    const i = T();
    if (!k || !F) {
      S(re, i, !0);
      return;
    }
    const g = Array.from(k.children).reduce(
      (x, m) => m === F ? x : x + br(m),
      0
    ), b = Er({
      availableComposerHeight: E(),
      nonEditorHeight: g,
      minHeight: i
    });
    e(re) !== b && S(re, b, !0);
  }
  function _e(i) {
    if (e(C).sending) {
      i.preventDefault();
      return;
    }
    !(i.target instanceof HTMLElement) || !e(d) || mr(i.target) || e(d).commands.focus("end");
  }
  function At(i) {
    if (e(C).sending) {
      i.preventDefault();
      return;
    }
    !e(d) || i.currentTarget !== i.target || i.key !== "Enter" && i.key !== " " || (i.preventDefault(), e(d).commands.focus("end"));
  }
  let fe = P(() => ce.value), Rt = P(() => e(fe).showSecretKeyDialog), Je = P(() => e(fe).showImageFullscreen), Ht = P(() => e(fe).fullscreenMediaId), et = P(() => e(fe).fullscreenImageSrc), Ot = P(() => e(fe).fullscreenImageAlt), tt = P(() => e(fe).showFloatingMessage), Wt = P(() => e(fe).floatingMessageX), Nt = P(() => e(fe).floatingMessageY), zt = P(() => e(fe).floatingMessageText);
  ve(() => {
    o() && (e(M) ? e(M).setRxNostr(o()) : S(
      M,
      new Tr(o(), {
        getNip46SignerForSessionFn: (i) => lr.getSignerForSession(i),
        getParentClientSignerFn: () => sr.getSigner(),
        channelContextState: ar,
        replyQuoteState: Pt,
        replyQuoteService: new Re(),
        clearReplyQuoteFn: Ue,
        savePostHistoryFn: (i) => gi({ input: i, postHistoryRepositoryImpl: kt }),
        notificationPort: L()
      }),
      !0
    ));
  });
  const We = Rr({
    getCurrentEditor: () => e(d),
    getFileInput: () => e(ne),
    getImageOxMap: () => e(V),
    getImageXMap: () => e($),
    getUploadFailedText: (i) => r()(i),
    updateUploadState: (i, g) => {
      Lr(ee, i, g);
    },
    setUploadErrorMessage: (i) => {
      ee.uploadErrorMessage = i;
    },
    uploadFiles: async (i) => {
      if (e(C).sending || ee.isUploading || J)
        return null;
      {
        if (te()) return await te()(i);
        const { uploadFiles: g } = await import("./App-UP5voPz2.js").then((b) => b.eA);
        return await g(i);
      }
    }
  }), Ee = ii({
    updatePostStatus: yt,
    clearContentAfterSuccess: it,
    onPostSuccess: (i) => y()?.(i)
  });
  ve(() => {
    if (e(u)) return;
    if (E(), T(), e(I), e(w), e(d), e(I) || oe.items.length, typeof window > "u") {
      S(re, Pe, !0);
      return;
    }
    const i = window.requestAnimationFrame(() => {
      G();
    });
    return () => {
      window.cancelAnimationFrame(i);
    };
  }), ve(() => {
    if (e(u) || (E(), T(), e(d), e(I), e(w), !k || typeof ResizeObserver > "u"))
      return;
    let i = null;
    const g = () => {
      i === null && (i = window.requestAnimationFrame(() => {
        i = null, G();
      }));
    }, b = new ResizeObserver(g);
    g(), b.observe(k);
    for (const x of Array.from(k.children))
      x !== F && b.observe(x);
    return () => {
      b.disconnect(), i !== null && window.cancelAnimationFrame(i);
    };
  }), cr(() => {
    H = hi({
      placeholderText: e(X),
      editorContainerEl: F,
      currentEditor: e(d),
      hasStoredKey: l(),
      hasPostingCapability: c(),
      submitPost: ze,
      onCustomEmojiSelect: p(),
      enterKeyBehavior: void 0,
      uploadFiles: e(K) ? (m) => {
        We.performUpload(m);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: Sr,
        onImageFullscreenRequest: (m, U, le) => {
          ce.showImageFullscreen(m, U, le || "");
        },
        onSelectImageNode: (m) => {
        }
      }
    }), S(A, H.editor, !0);
    let i = null;
    const g = (m) => {
      const U = m.isEmpty, le = !h || e(v) !== U;
      S(v, U, !0), h = !0, le && _()?.(U);
    }, b = ({ editor: m }) => {
      g(m);
    };
    O = e(A).subscribe((m) => {
      i && i.off("transaction", b), i = m, S(d, m, !0), m && g(m), m?.on("transaction", b), Oe.set(m);
    });
    const x = (m) => {
      const U = m, { src: le, alt: wn, mediaId: Sn } = U.detail;
      ce.showImageFullscreen(le, wn, Sn || "");
    };
    return window.addEventListener("image-fullscreen-request", x), () => {
      window.removeEventListener("image-fullscreen-request", x), H && (i && i.off("transaction", b), pi({
        unsubscribe: H.unsubscribe,
        componentUnsubscribe: O ?? (() => {
        }),
        handlers: H.handlers,
        currentEditor: e(d),
        editorContainerEl: F,
        submitPost: ze
      }), O = null);
    };
  });
  const jt = We.handleFileSelect;
  async function Bt(i) {
    return await We.performUpload(i);
  }
  function qt(i) {
    if (!e(d) || !i) return;
    const g = e(
      d
      // nullチェック済みのローカル変数
    ), x = i.split(`
`).map((m) => ({
      type: "paragraph",
      content: m ? [{ type: "text", text: m }] : void 0
    }));
    g.commands.setContent({ type: "doc", content: x }), g.commands.focus("end");
  }
  function Ut(i) {
    if (!e(d) || !i) return !1;
    const b = i.split(`
`).map((x) => ({
      type: "paragraph",
      content: x ? [{ type: "text", text: x }] : void 0
    }));
    return e(d).isEmpty ? e(d).commands.setContent({ type: "doc", content: b }) : e(d).chain().focus("end").insertContent([{ type: "paragraph" }, ...b]).run(), e(d).commands.focus("end"), !0;
  }
  function Kt(i) {
    if (!e(d) || !i) return;
    const g = ur(i);
    e(d).commands.setContent(g || "<p></p>"), e(d).commands.focus("end");
  }
  function Xt() {
    return e(d) ? e(d).getHTML() : "";
  }
  function Gt(i) {
    if (!e(d) || i.length === 0) return;
    const { schema: g } = e(d).state;
    let b = e(d).state.tr, x = e(d).state.doc.content.size;
    i.forEach((m) => {
      if (m.isPlaceholder) return;
      const U = m.src;
      if (m.type === "image" && g.nodes.image) {
        const le = g.nodes.image.create({
          src: U,
          alt: m.alt ?? "Image",
          blurhash: m.blurhash ?? null,
          dim: m.dim ?? null,
          size: m.size ?? null,
          uploadProtocol: m.uploadProtocol ?? null
        });
        b = b.insert(x, le), x += le.nodeSize, m.ox && S(V, { ...e(V), [U]: m.ox }, !0), m.x && S($, { ...e($), [U]: m.x }, !0);
      } else if (m.type === "video" && g.nodes.video) {
        const le = g.nodes.video.create({ src: U });
        b = b.insert(x, le), x += le.nodeSize;
      }
    }), e(d).view.dispatch(b), e(d).commands.focus("end");
  }
  function Qt(i) {
    !e(d) || e(C).sending || fi(e(d), i);
  }
  function Ne() {
    if (!e(d)) return;
    fr(e(d).view.dom) || vr(e(d));
  }
  function nt(i) {
    if (!e(d) || e(C).sending) return;
    Ne();
    const { state: g, view: b } = e(d), x = i < 0 ? g.selection.from : g.selection.to, m = Math.max(0, Math.min(g.doc.content.size, x + i));
    if (m === x) return;
    const U = pr.near(g.doc.resolve(m), i);
    b.dispatch(g.tr.setSelection(U).scrollIntoView().setMeta("addToHistory", !1));
  }
  function $t() {
    nt(-1);
  }
  function Yt() {
    nt(1);
  }
  function Vt() {
    if (!e(d) || e(C).sending) return;
    Ne();
    const { state: i, view: g } = e(d), { selection: b } = i;
    if (!b.empty) {
      e(d).commands.deleteSelection();
      return;
    }
    const m = b.$from.nodeBefore;
    if (m) {
      const U = m.isText ? Array.from(m.text ?? "").at(-1)?.length ?? 0 : m.nodeSize;
      U > 0 && g.dispatch(i.tr.delete(b.from - U, b.from).scrollIntoView());
      return;
    }
    e(d).commands.first(({ commands: U }) => [
      () => U.joinBackward(),
      () => U.selectNodeBackward()
    ]);
  }
  function Zt() {
    !e(d) || e(C).sending || (Ne(), e(d).commands.keyboardShortcut("Enter"));
  }
  function rt() {
    return !!e(d) && ee.canPost && !e(C).sending && !ee.isUploading && !e(C).completed && (c() || !!e(M));
  }
  async function ze() {
    if (!e(d) || !rt() || !e(M)) return;
    const i = e(M).preparePostPayload(e(d));
    if (gr(i.content)) {
      ce.showSecretKeyDialog(i.content, i.emojiTags);
      return;
    }
    await e(M).performPostSubmission(e(d), e(V), e($), Ee.markSending, Ee.markSuccess, Ee.markFailure);
  }
  function Jt() {
    if (e(d)) {
      if (e(M)) {
        e(M).resetPostContent(e(d));
        return;
      }
      e(d).chain().clearContent().run();
    }
  }
  function it() {
    if (e(M) && e(d)) {
      e(M).clearContentAfterSuccess(e(d));
      return;
    }
    if (e(d)) {
      const i = D()?.hashtagPinEnabled === !0 && Ct.value ? [...Ft().hashtags] : [];
      e(d).chain().clearContent().run(), Et.reset(), xt.reset(), oe.clearAll(), S(V, {}, !0), S($, {}, !0), Ue(), i.length > 0 && e(d).commands.insertContent(` ${i.map((g) => `#${g}`).join(" ")}`), e(d).commands.focus("start");
    }
  }
  async function en() {
    if (!rt()) return;
    const i = ce.getPendingPost(), g = ce.getPendingEmojiTags();
    ce.hideSecretKeyDialog(), e(M) && e(d) && await oi({
      postManager: e(M),
      currentEditor: e(d),
      imageOxMap: e(V),
      imageXMap: e($),
      pendingPost: i,
      pendingEmojiTags: g,
      onStart: Ee.markSending,
      onSuccess: Ee.markSuccess,
      onFailure: Ee.markFailure
    });
  }
  const tn = ce.hideSecretKeyDialog, nn = ce.hideImageFullscreen;
  let je = P(() => ai({
    mediaFreePlacement: e(I),
    galleryItems: oe.items,
    currentEditor: e(d)
  })), rn = P(() => si(e(je), e(Ht), e(et)));
  function on(i) {
    const g = li(e(je), i);
    g && ce.showImageFullscreen(g.src, g.alt ?? "", g.id ?? "");
  }
  ve(() => {
    e(d) && e(M) && e(M).preparePostContent(e(d)) !== ee.content && e(C).error && yt({ ...e(C), error: !1, message: "" });
  });
  function an() {
    !e(K) || e(C).sending || ee.isUploading || e(ne)?.click();
  }
  ve(() => {
    const i = oe.items.some((x) => !x.isPlaceholder), g = !!ee.content.trim(), b = ee.hasImage;
    ee.canPost = g || b || i;
  });
  let ot = !0;
  ve(() => {
    const i = !qe.value;
    if (ot) {
      ot = !1;
      return;
    }
    if (!e(d)) return;
    const g = e(d);
    if (i)
      Ie(() => di({
        currentEditor: g,
        imageOxMap: e(V),
        imageXMap: e($),
        addGalleryItem: (x) => oe.addItem(x),
        createMediaItemId: hr
      })) && Ie(() => {
        S(V, {}, !0), S($, {}, !0);
      });
    else {
      const b = Ie(() => oe.getItems()), x = ui({ currentEditor: g, items: b });
      x.hadItems && Ie(() => {
        S(V, x.imageOxMap, !0), S($, x.imageXMap, !0);
      }), Ie(() => oe.clearAll());
    }
  });
  var sn = {
    uploadFiles: Bt,
    insertTextContent: qt,
    appendSharedTextContent: Ut,
    loadDraftContent: Kt,
    getEditorHtml: Xt,
    appendMediaToEditor: Gt,
    insertCustomEmoji: Qt,
    moveCaretLeft: $t,
    moveCaretRight: Yt,
    deleteBackward: Vt,
    insertLineBreak: Zt,
    submitPost: ze,
    resetPostContent: Jt,
    clearContentAfterSuccess: it,
    openFileDialog: an,
    get rxNostr() {
      return o();
    },
    set rxNostr(i) {
      o(i), j();
    },
    get hasStoredKey() {
      return l();
    },
    set hasStoredKey(i) {
      l(i), j();
    },
    get hasPostingCapability() {
      return c();
    },
    set hasPostingCapability(i = l) {
      c(i), j();
    },
    get isSwitchingAccount() {
      return f();
    },
    set isSwitchingAccount(i = !1) {
      f(i), j();
    },
    get onPostSuccess() {
      return y();
    },
    set onPostSuccess(i) {
      y(i), j();
    },
    get availableComposerHeight() {
      return E();
    },
    set availableComposerHeight(i = Pe) {
      E(i), j();
    },
    get minEditorHeight() {
      return T();
    },
    set minEditorHeight(i = Pe) {
      T(i), j();
    },
    get onCustomEmojiSelect() {
      return p();
    },
    set onCustomEmojiSelect(i) {
      p(i), j();
    },
    get onEditorEmptyChange() {
      return _();
    },
    set onEditorEmptyChange(i) {
      _(i), j();
    },
    get notificationPort() {
      return L();
    },
    set notificationPort(i) {
      L(i), j();
    },
    get hostOwnedConfig() {
      return D();
    },
    set hostOwnedConfig(i) {
      D(i), j();
    },
    get hostCustomEmojiItems() {
      return Z();
    },
    set hostCustomEmojiItems(i = []) {
      Z(i), j();
    },
    get normalUploadFiles() {
      return te();
    },
    set normalUploadFiles(i) {
      te(i), j();
    }
  }, at = Si(), xe = Mt(at);
  let st;
  var ie = ye(xe);
  let lt;
  var ct = ye(ie);
  {
    var ln = (i) => {
      var g = vi(), b = ye(g);
      {
        let x = P(() => e(q)?.picture || "");
        xr(b, {
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
      he(g), ge(i, g);
    };
    ae(ct, (i) => {
      e(N) && i(ln);
    });
  }
  var cn = ue(ct, 2);
  {
    var dn = (i) => {
      Pr(i, {
        get editor() {
          return e(d);
        },
        class: "editor-content"
      });
    };
    ae(cn, (i) => {
      e(A) && e(d) && i(dn);
    });
  }
  he(ie), Ae(ie, (i, g) => Qr?.(i, g), () => ({ dragOver: (i) => S(Y, i, !0) })), Ae(ie, (i) => $r?.(i)), Ae(ie, (i) => Yr?.(i)), Ae(ie, (i) => Vr?.(i)), Ce(ie, (i) => F = i, () => F);
  var dt = ue(ie, 2);
  {
    var un = (i) => {
      Dt(i, {});
    };
    ae(dt, (i) => {
      e(I) || i(un);
    });
  }
  var ut = ue(dt, 2);
  {
    var gn = (i) => {
      var g = mi();
      Ce(g, (b) => S(ne, b), () => e(ne)), we("change", g, jt), ge(i, g);
    };
    ae(ut, (i) => {
      e(K) && i(gn);
    });
  }
  var hn = ue(ut, 2);
  {
    var pn = (i) => {
      var g = yi(), b = ye(g, !0);
      he(g), Se(() => wt(b, e(w))), ge(i, g);
    };
    ae(hn, (i) => {
      e(w) && i(pn);
    });
  }
  he(xe), Ce(xe, (i) => k = i, () => k);
  var gt = ue(xe, 2);
  {
    var fn = (i) => {
      {
        let g = P(() => r()("postComponent.warning")), b = P(() => r()("postComponent.secret_key_detected")), x = P(() => r()("postComponent.post")), m = P(() => r()("postComponent.cancel"));
        Cr(i, {
          get open() {
            return e(Rt);
          },
          get title() {
            return e(g);
          },
          get description() {
            return e(b);
          },
          get confirmLabel() {
            return e(x);
          },
          get cancelLabel() {
            return e(m);
          },
          confirmVariant: "danger",
          onConfirm: en,
          get onCancel() {
            return tn;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    ae(gt, (i) => {
      i(fn);
    });
  }
  var ht = ue(gt, 2);
  dr(ht, {
    get src() {
      return e(et);
    },
    get alt() {
      return e(Ot);
    },
    get onClose() {
      return nn;
    },
    get mediaList() {
      return e(je);
    },
    get currentIndex() {
      return e(rn);
    },
    onNavigate: on,
    get show() {
      return e(Je);
    },
    set show(i) {
      S(Je, i);
    }
  });
  var vn = ue(ht, 2);
  {
    var mn = (i) => {
      Fr(i, {
        get show() {
          return e(tt);
        },
        get x() {
          return e(Wt);
        },
        get y() {
          return e(Nt);
        },
        children: (g, b) => {
          var x = wi(), m = ye(x, !0);
          he(x), Se(() => wt(m, e(zt))), ge(g, x);
        },
        $$slots: { default: !0 }
      });
    };
    ae(vn, (i) => {
      e(tt) && i(mn);
    });
  }
  Se(
    (i) => {
      st = Fe(xe, 1, "post-container svelte-15ticnd", null, st, { "editor-auto-grow": e(u) }), _t(xe, e(R)), lt = Fe(ie, 1, "editor-container svelte-15ticnd", null, lt, {
        "drag-over": e(Y),
        "gallery-mode": !e(I),
        sending: e(C).sending,
        "account-avatar-placeholder": e(N)
      }), de(ie, "aria-label", i), de(ie, "aria-disabled", e(C).sending ? "true" : void 0);
    },
    [() => r()("postComponent.editor_label")]
  ), we("click", ie, _e), we("keydown", ie, At), ge(n, at);
  var yn = Ze(sn);
  return s(), yn;
}
It(["click", "keydown", "change"]);
Ye(
  Ei,
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
  Ei as default
};
