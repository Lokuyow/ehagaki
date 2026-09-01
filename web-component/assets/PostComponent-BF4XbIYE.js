import { a as Tn, h as yt, m as Ue, b as ae, c as Ft, d as _t, k as Ln, e as An, s as Rn, w as Hn, r as kt, f as On, i as wt, j as Wn, l as zn, n as Nn, o as Bn, p as jn, q as It, t as qn, u as Ke, P as Un, v as Kn, x as Ae, y as Xn, z as Gn, A as Qn, B as $n, C as Yn, R as He, D as Vn, E as Mt, F as Zn, G as Jn, H as Ge, I as N, J as er, K as te, L as Ce, M as Fe, N as ge, O as Dt, Q as Qe, S as tr, T as nr, U as rr, V as $e, $ as Ye, W as ir, X as Y, Y as ke, Z as bt, _ as or, a0 as ar, a1 as St, a2 as sr, a3 as lr, a4 as Tt, a5 as dr, a6 as cr, a7 as ur, a8 as gr, a9 as We, aa as hr, ab as pr, ac as fr, ad as Pe, ae as vr, af as mr, ag as yr, ah as wr, ai as br, aj as Et, ak as Re, al as Sr, am as Er, an as xr, ao as Pr, ap as Cr, aq as Fr, ar as _r, as as kr, at as Ir, au as Mr, av as Dr, aw as Tr, ax as Lr, ay as Ar, az as Rr, aA as Hr, aB as Or, aC as Wr, aD as zr } from "./App-0-rBUlwf.js";
import { bk as qe, aJ as Oe, aq as Lt, b6 as Ve, b0 as Ze, a as e, bf as oe, b as w, Z as Se, bC as he, ap as we, b3 as ne, b4 as Je, aS as $, ba as se, b8 as fe, aR as E, b5 as B, bg as Nr, b9 as pe, aN as ye, b1 as Br, b2 as At, bl as jr, u as Ie, bi as xt } from "./entry-vGGuKCM6.js";
class qr {
  constructor(t, r = {}) {
    this.deps = r, t && this.setRxNostr(t), this.deps.console = r.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = r.authStateStore || Tn, this.deps.hashtagStore = r.hashtagStore || yt, this.deps.mediaFreePlacementStore = r.mediaFreePlacementStore || Ue, this.deps.mediaGalleryStore = r.mediaGalleryStore || ae, this.deps.contentWarningStore = r.contentWarningStore || Ft, this.deps.contentWarningReasonStore = r.contentWarningReasonStore || _t, this.deps.keyManager = r.keyManager || Ln, this.deps.createImetaTagFn = r.createImetaTagFn || An, this.deps.settingsStore = r.settingsStore || Rn, this.deps.writeRelaysStore = r.writeRelaysStore || Hn, this.deps.replyQuoteState = r.replyQuoteState || kt, this.deps.getClientTagFn = r.getClientTagFn || (() => On(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = r.seckeySignerFn || wt, this.deps.extractContentWithImagesFn = r.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = r.extractContentWithEmojiTagsFn || (r.extractContentWithImagesFn ? (a) => ({ content: r.extractContentWithImagesFn(a), emojiTags: [] }) : Wn), this.deps.extractImageBlurhashMapFn = r.extractImageBlurhashMapFn || zn, this.deps.resetEditorStateFn = r.resetEditorStateFn || Nn, this.deps.resetPostStatusFn = r.resetPostStatusFn || Bn, this.deps.notificationPort = r.iframeMessageService || r.notificationPort || jn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = r.hashtagPinStore || It, this.deps.saveHashtagsToHistoryFn = r.saveHashtagsToHistoryFn || qn, this.deps.clearReplyQuoteFn = r.clearReplyQuoteFn || Ke;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new Un(t, this.deps.console || console);
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
    return Kn.buildEvent(
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
    const r = qe.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), a = qe.sanitizeExternalRelayUrls([
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
    Ae(this.deps.authStateStore, t.sessionPubkey);
    const a = Xn(t.event), s = r ? await r(a.signerTemplate) : t.event;
    Ae(this.deps.authStateStore, t.sessionPubkey);
    let o;
    try {
      o = Gn(
        a.expectedTemplate,
        s,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    Ae(this.deps.authStateStore, t.sessionPubkey);
    const l = Qn(o);
    if (!l)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: o?.kind ?? "(missing)"
    }), r && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), Ae(this.deps.authStateStore, t.sessionPubkey);
    const u = await this.eventSender.sendEvent(l.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: u.success
    });
    const f = u.success ? {
      ...u,
      eventId: u.eventId ?? l.event.id,
      event: l.event
    } : u;
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
    return $n.validatePost(
      t,
      r.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, r, a = []) {
    let s = Yn(t);
    const o = this.deps.settingsStore.quoteNotificationEnabled, l = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      s,
      o
    ) ?? new He().extractInlineQuoteTags(
      s,
      o
    ), u = this.deps.replyQuoteState.value;
    if (u.quotes.length > 0) {
      const b = this.deps.replyQuoteService || new He(), F = new Set(
        l.filter((h) => h[0] === "q").map((h) => h[1])
      ), T = u.quotes.filter((h) => !F.has(h.eventId)).map(
        (h) => b.generateNostrUri(
          h.eventId,
          h.relayHints,
          h.authorPubkey
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
    if (Jn() && qe.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const b = this.deps.authStateStore, F = Vn(b), T = this.deps.hashtagStore, { hashtags: h, tags: _ } = this.getHashtagArrays(T), O = this.deps.keyManager, k = this.deps.window || (typeof window < "u" ? window : void 0), J = this.deps.contentWarningStore.value, ee = this.deps.contentWarningReasonStore.value, le = this.deps.channelContextState?.value ?? null, G = le?.channelRelays, X = this.deps.replyQuoteState.value;
      let H;
      const de = this.getReplyQuoteNotifyOptions();
      if (X.reply || X.quotes.length > 0) {
        const x = this.deps.replyQuoteService || new He();
        H = [], X.reply && (le ? (H.push([
          "e",
          X.reply.eventId,
          X.reply.relayHints[0] || "",
          "reply",
          ...X.reply.authorPubkey ? [X.reply.authorPubkey] : []
        ]), x.buildReplyTags(X.reply).filter((R) => R[0] === "p").forEach((R) => {
          H.push(R);
        })) : H.push(...x.buildReplyTags(X.reply)));
        const I = /* @__PURE__ */ new Set(), m = new Set(
          H.filter((R) => R[0] === "p").map((R) => R[1])
        );
        X.quotes.forEach((R) => {
          x.buildQuoteTags(R, R.quoteNotificationEnabled).forEach((P) => {
            if (P[0] === "q") {
              if (I.has(P[1]))
                return;
              I.add(P[1]);
            }
            if (P[0] === "p") {
              if (m.has(P[1]))
                return;
              m.add(P[1]);
            }
            H.push(P);
          });
        });
      }
      if (l.length > 0) {
        H || (H = []);
        const x = new Set(
          H.filter((m) => m[0] === "q").map((m) => m[1])
        ), I = new Set(
          H.filter((m) => m[0] === "p").map((m) => m[1])
        );
        for (const m of l)
          m[0] === "q" && !x.has(m[1]) ? (H.push(m), x.add(m[1])) : m[0] === "p" && !I.has(m[1]) && (H.push(m), I.add(m[1]));
      }
      const Q = b.value;
      if (Q.type === "nip07" && O.isWindowNostrAvailable() && k?.nostr)
        try {
          const x = Q.pubkey;
          if (!x)
            return this.notifyPostFailure("pubkey_not_found");
          const I = typeof k.nostr.signEvent == "function" ? k.nostr.signEvent.bind(k.nostr) : void 0;
          if (!I)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const m = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: h,
            tags: _,
            pubkey: x,
            imageImetaMap: r,
            contentWarningEnabled: J,
            contentWarningReason: ee,
            replyQuoteTags: H,
            channelContext: le,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: m,
            sessionPubkey: F,
            hashtags: h,
            rqNotifyOptions: de,
            signEvent: I,
            logSignedEvent: !0,
            additionalWriteRelays: G
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (Q.type === "nip46")
        try {
          const x = Q.pubkey;
          if (!x)
            return this.notifyPostFailure("pubkey_not_found");
          const I = await this.deps.getNip46SignerForSessionFn?.(x), m = this.deps.authStateStore.value;
          if (!I || !m.isAuthenticated || m.type !== "nip46" || m.pubkey !== x)
            return this.notifyPostFailure("nip46_signer_not_available");
          const R = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: h,
            tags: _,
            pubkey: x,
            imageImetaMap: r,
            contentWarningEnabled: J,
            contentWarningReason: ee,
            replyQuoteTags: H,
            channelContext: le,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: R,
            sessionPubkey: F,
            hashtags: h,
            rqNotifyOptions: de,
            signer: I,
            additionalWriteRelays: G
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (Q.type === "parentClient") {
        const x = this.deps.getParentClientSignerFn?.();
        if (!x)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const I = Q.pubkey;
        if (!I)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const m = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: h,
            tags: _,
            pubkey: I,
            imageImetaMap: r,
            contentWarningEnabled: J,
            contentWarningReason: ee,
            replyQuoteTags: H,
            channelContext: le,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: m,
            sessionPubkey: F,
            hashtags: h,
            rqNotifyOptions: de,
            signer: x,
            additionalWriteRelays: G
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const d = O.getFromStore() || O.loadFromStorage(Q.pubkey);
      if (!d)
        return this.notifyPostFailure("key_not_found");
      const be = await this.buildSubmissionEvent({
        processedContent: s,
        hashtags: h,
        tags: _,
        imageImetaMap: r,
        contentWarningEnabled: J,
        contentWarningReason: ee,
        replyQuoteTags: H,
        channelContext: le,
        emojiTags: a
      }), ce = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(d) : wt(d);
      return await this.sendPreparedEvent({
        event: be,
        sessionPubkey: F,
        hashtags: h,
        rqNotifyOptions: de,
        signer: ce,
        additionalWriteRelays: G
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
    if (r === yt)
      try {
        const s = Mt();
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
    t?.state?.doc?.descendants?.((u) => {
      if (u.type?.name !== "image" || !u.attrs?.src || u.attrs?.isPlaceholder)
        return;
      const f = typeof u.attrs.size == "number" ? u.attrs.size : Number(u.attrs.size);
      s[u.attrs.src] = {
        dim: u.attrs.dim ?? void 0,
        alt: u.attrs.alt ?? void 0,
        size: Number.isFinite(f) && f > 0 ? f : void 0,
        uploadProtocol: u.attrs.uploadProtocol ?? void 0
      };
    });
    const o = this.deps.extractImageBlurhashMapFn(t), l = {};
    for (const [u, f] of Object.entries(o))
      l[u] = {
        m: Zn(u),
        blurhash: f,
        dim: s[u]?.dim,
        alt: s[u]?.alt,
        size: s[u]?.size,
        uploadProtocol: s[u]?.uploadProtocol,
        ox: r[u],
        x: a[u]
      };
    return l;
  }
  async performPostSubmission(t, r, a, s, o, l) {
    const u = this.preparePostPayload(t), f = this.prepareImageBlurhashMap(t, r, a);
    s?.();
    try {
      const b = await this.submitPost(u.content, f, u.emojiTags);
      b.success ? o?.(b) : l?.(b.error || "post_error");
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
function Ur(n) {
  return !!n && n.length > 0;
}
function Kr(n, t, r) {
  n.isUploading = t, n.uploadErrorMessage = r || "";
}
function Xr(n) {
  const t = n.target;
  return t?.files?.length ? t.files : void 0;
}
function Gr({
  getCurrentEditor: n,
  getFileInput: t,
  getImageOxMap: r,
  getImageXMap: a,
  getUploadFailedText: s,
  updateUploadState: o,
  setUploadErrorMessage: l,
  uploadFiles: u
}) {
  const f = async (F) => Ur(F) ? await u({
    files: F,
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
    handleFileSelect: (F) => {
      const T = Xr(F);
      T && f(T);
    }
  };
}
let W = Oe({
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
function Pt() {
  Me !== void 0 && (clearTimeout(Me), Me = void 0);
}
const ue = {
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
    Pt(), W.floatingMessageX = n, W.floatingMessageY = t, W.floatingMessageText = r, W.showFloatingMessage = !0, Me = setTimeout(
      () => {
        W.showFloatingMessage = !1, Me = void 0;
      },
      a
    );
  },
  hideFloatingMessage: () => {
    Pt(), W.showFloatingMessage = !1;
  }
};
var Qr = se('<img draggable="false"/>'), $r = se('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), Yr = se('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const Vr = {
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
function Rt(n, t) {
  Ze(t, !0), Ge(n, Vr);
  const r = () => $e(Ye, "$_", a), [a, s] = Qe();
  let o = N(t, "item", 7), l = N(t, "index", 7), u = N(t, "onDelete", 7), f = N(t, "onDragStart", 7), b = N(t, "onDragOver", 7), F = N(t, "onDragEnd", 7), T = N(t, "onDrop", 7), h = N(t, "onTouchDragStart", 7), _ = N(t, "disabled", 7, !1), O = $(void 0), k = $(void 0);
  const J = rr();
  er(() => e(O), {
    onLongPress: (g, A) => {
      _() || h()?.(l(), g, A);
    }
  });
  let ee = E(() => !o().isPlaceholder && o().type === "image" && !!o().src), le = E(() => !o().isPlaceholder && o().type === "video" && !!o().src);
  const G = 180, X = 100, H = 180;
  let de = E(() => {
    if (!o().isPlaceholder) return;
    const g = o().dimensions;
    if (g && g.width > 0 && g.height > 0) {
      const A = g.width / g.height, U = Math.round(G * A);
      return `width: ${Math.max(X, Math.min(H, U))}px; height: ${G}px;`;
    }
    return `width: ${H}px; height: ${G}px;`;
  });
  function Q() {
    o().isPlaceholder || o().type !== "image" || ue.showImageFullscreen(o().src, o().alt || "", o().id);
  }
  function re(g) {
    if (_()) {
      g.preventDefault();
      return;
    }
    if (e(O) && g.dataTransfer) {
      const A = e(O).getBoundingClientRect(), U = g.clientX - A.left, K = g.clientY - A.top;
      g.dataTransfer.setDragImage(e(O), U, K);
    }
    f()(l(), g);
  }
  function d(g) {
    g.stopPropagation(), e(k) && (e(k).paused ? e(k).play() : e(k).pause());
  }
  function be(g) {
    g.preventDefault(), !_() && b()(l(), g);
  }
  function ce(g) {
    g.preventDefault(), !_() && T()(l());
  }
  function x(g) {
    o().type !== "image" || o().isPlaceholder || (g.key === "Enter" || g.key === " " || g.key === "Spacebar") && (g.preventDefault(), Q());
  }
  var I = {
    get item() {
      return o();
    },
    set item(g) {
      o(g), B();
    },
    get index() {
      return l();
    },
    set index(g) {
      l(g), B();
    },
    get onDelete() {
      return u();
    },
    set onDelete(g) {
      u(g), B();
    },
    get onDragStart() {
      return f();
    },
    set onDragStart(g) {
      f(g), B();
    },
    get onDragOver() {
      return b();
    },
    set onDragOver(g) {
      b(g), B();
    },
    get onDragEnd() {
      return F();
    },
    set onDragEnd(g) {
      F(g), B();
    },
    get onDrop() {
      return T();
    },
    set onDrop(g) {
      T(g), B();
    },
    get onTouchDragStart() {
      return h();
    },
    set onTouchDragStart(g) {
      h(g), B();
    },
    get disabled() {
      return _();
    },
    set disabled(g = !1) {
      _(g), B();
    }
  }, m = Yr();
  let R;
  var P = fe(m), ve = fe(P);
  {
    var v = (g) => {
      {
        let A = E(() => o().type === "video" ? r()("videoNode.uploading") : r()("imageNode.uploading"));
        tr(g, {
          get text() {
            return e(A);
          },
          showLoader: !0
        });
      }
    };
    te(ve, (g) => {
      o().isPlaceholder && g(v);
    });
  }
  var p = oe(ve, 2);
  {
    var j = (g) => {
      var A = Qr();
      let U;
      Se(() => {
        ge(A, "src", o().src), ge(A, "alt", o().alt || ""), U = Fe(A, 1, "gallery-image svelte-aw59wn", null, U, { "image-loading": !J.isLoaded });
      }), he("load", A, function(...K) {
        J.handleLoad?.apply(this, K);
      }), he("error", A, function(...K) {
        J.handleError?.apply(this, K);
      }), we("contextmenu", A, (K) => K.preventDefault()), Nr(A), ne(g, A);
    };
    te(p, (g) => {
      e(ee) && g(j);
    });
  }
  var M = oe(p, 2);
  {
    var D = (g) => {
      var A = $r(), U = fe(A);
      U.muted = !0, Ce(U, (_e) => w(k, _e), () => e(k));
      var K = oe(U, 2);
      pe(A), Se(() => {
        ge(U, "src", o().src), ge(K, "draggable", !_());
      }), we("contextmenu", U, (_e) => _e.preventDefault()), he("dragstart", K, re), we("click", K, d), ne(g, A);
    };
    te(M, (g) => {
      e(le) && g(D);
    });
  }
  pe(P);
  var q = oe(P, 2);
  {
    var L = (g) => {
      {
        let A = E(() => r()("imageContextMenu.delete")), U = E(() => r()("imageContextMenu.copyUrl")), K = E(() => r()("imageContextMenu.copySuccess"));
        nr(g, {
          get src() {
            return o().src;
          },
          onDelete: () => u()(o().id),
          get deleteAriaLabel() {
            return e(A);
          },
          get copyAriaLabel() {
            return e(U);
          },
          get copySuccessMessage() {
            return e(K);
          },
          layout: "gallery",
          get deleteDisabled() {
            return _();
          }
        });
      }
    };
    te(q, (g) => {
      o().isPlaceholder || g(L);
    });
  }
  pe(m), Ce(m, (g) => w(O, g), () => e(O)), Se(() => {
    R = Fe(m, 1, "gallery-item svelte-aw59wn", null, R, {
      "is-placeholder": o().isPlaceholder,
      "is-disabled": _()
    }), ge(m, "draggable", !_() && (o().type !== "video" || o().isPlaceholder)), Dt(P, e(de)), ge(P, "role", o().type === "image" && !o().isPlaceholder ? "button" : void 0), ge(P, "tabindex", o().type === "image" && !o().isPlaceholder ? 0 : void 0), ge(P, "aria-label", o().alt || o().src);
  }), he("dragstart", m, re), he("dragover", m, be), he("drop", m, ce), he("dragend", m, () => F()()), we("click", P, function(...g) {
    (o().type === "image" && !o().isPlaceholder ? Q : void 0)?.apply(this, g);
  }), we("keydown", P, x), ne(n, m);
  var V = Je(I);
  return s(), V;
}
Lt(["click", "keydown", "contextmenu"]);
Ve(
  Rt,
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
function Zr(n) {
  return Math.abs(n.deltaX) > Math.abs(n.deltaY) ? n.deltaX : n.deltaY;
}
function Jr(n, t) {
  const r = n.scrollHeight - n.clientHeight;
  if (r <= 1)
    return !1;
  const a = n.scrollTop <= 0, s = n.scrollTop >= r - 1;
  return t > 0 ? !s : t < 0 ? !a : !1;
}
function ei(n, t) {
  const r = n.scrollWidth - n.clientWidth;
  if (r <= 1)
    return !1;
  const a = n.scrollLeft <= 0, s = n.scrollLeft >= r - 1;
  return t > 0 ? !s : t < 0 ? !a : !1;
}
function ti(n, t, r = null) {
  if (r && Jr(r, t.deltaY))
    return !1;
  const a = Zr(t);
  if (!ei(n, a))
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
var ni = se("<div><!></div>"), ri = se('<div role="list"></div>');
const ii = {
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
function Ht(n, t) {
  Ze(t, !0), Ge(n, ii);
  const r = () => $e(Ye, "$_", a), [a, s] = Qe();
  let o = $(-1), l = $(-1), u = $(-1), f = $(-1), b = null, F = 60, T = 60, h = $(void 0), _ = null, O = E(() => ae.items), k = E(() => Y.postStatus.sending), J = E(() => {
    const v = e(o) !== -1 ? e(o) : e(u), p = e(o) !== -1 ? e(l) : e(f);
    return v === -1 || p === -1 || p === v || p === v + 1 ? -1 : p;
  });
  function ee(v, p) {
    if (e(k)) {
      p.preventDefault();
      return;
    }
    w(o, v, !0), p.dataTransfer?.setData("text/plain", String(v)), p.dataTransfer && (p.dataTransfer.effectAllowed = "move");
  }
  function le(v, p) {
    if (p.preventDefault(), e(k)) return;
    const M = e(h)?.querySelectorAll(".gallery-item-wrapper")?.[v];
    if (M) {
      const D = M.getBoundingClientRect();
      w(l, p.clientX < D.left + D.width / 2 ? v : v + 1, !0);
    } else
      w(l, v, !0);
  }
  function G() {
    d(), w(o, -1), w(l, -1);
  }
  function X(v) {
  }
  function H(v) {
    if (e(o) === -1) return;
    if (v.preventDefault(), e(k)) {
      d(), w(l, -1);
      return;
    }
    const p = e(h)?.querySelectorAll(".gallery-item-wrapper");
    if (p && p.length > 0) {
      const j = p[0].getBoundingClientRect(), M = p[p.length - 1].getBoundingClientRect();
      v.clientX < j.left ? w(l, 0) : v.clientX > M.right && w(l, e(O).length, !0);
    }
    if (e(h)) {
      const j = e(h).getBoundingClientRect();
      v.clientX - j.left < ke ? re("left", v.clientX) : j.right - v.clientX < ke ? re("right", v.clientX) : d();
    }
  }
  function de(v) {
    if (v.preventDefault(), d(), e(k)) {
      w(o, -1), w(l, -1);
      return;
    }
    const p = e(l);
    if (e(o) !== -1 && p !== -1 && p !== e(o) && p !== e(o) + 1) {
      const j = e(o) < p ? p - 1 : p;
      ae.reorderItems(e(o), j);
    }
    w(o, -1), w(l, -1);
  }
  function Q(v) {
    e(k) || ae.removeItem(v);
  }
  function re(v, p) {
    if (!e(h)) return;
    _ !== null && (cancelAnimationFrame(_), _ = null);
    const j = e(h).getBoundingClientRect(), M = v === "left" ? p - j.left : j.right - p, D = Math.max(0, Math.min(1, M / ke)), q = bt + (or - bt) * (1 - D), L = () => {
      if (!e(h)) return;
      const V = e(h).scrollWidth - e(h).clientWidth;
      v === "left" && e(h).scrollLeft > 0 ? (e(h).scrollLeft = Math.max(0, e(h).scrollLeft - q), _ = requestAnimationFrame(L)) : v === "right" && e(h).scrollLeft < V ? (e(h).scrollLeft = Math.min(V, e(h).scrollLeft + q), _ = requestAnimationFrame(L)) : _ = null;
    };
    _ = requestAnimationFrame(L);
  }
  function d() {
    _ !== null && (cancelAnimationFrame(_), _ = null);
  }
  function be(v, p, j) {
    if (e(k)) return;
    w(u, v, !0), I();
    const M = e(h)?.querySelectorAll(".gallery-item-wrapper")[v];
    if (M) {
      const D = M.getBoundingClientRect(), q = 120, L = Math.min(q / D.width, q / D.height);
      F = D.width * L / 2, T = D.height * L / 2, b = M.cloneNode(!0), b.style.cssText = `
                position: fixed;
                left: ${p - F}px;
                top: ${j - T}px;
                width: ${D.width}px;
                height: ${D.height}px;
                transform-origin: top left;
                transform: scale(${L});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, jr().overlayTarget.appendChild(b);
    }
    document.addEventListener("touchmove", ce, { passive: !1 }), document.addEventListener("touchend", x, { passive: !1 });
  }
  function ce(v) {
    if (e(u) === -1 || v.touches.length !== 1) return;
    if (v.preventDefault(), e(k)) {
      d(), w(f, -1);
      return;
    }
    const p = v.touches[0];
    b && (b.style.left = `${p.clientX - F}px`, b.style.top = `${p.clientY - T}px`), b && (b.style.display = "none");
    const j = document.elementFromPoint(p.clientX, p.clientY);
    b && (b.style.display = "");
    const M = j?.closest(".gallery-item-wrapper");
    if (M && e(h)) {
      const D = e(h).querySelectorAll(".gallery-item-wrapper"), q = Array.from(D).indexOf(M);
      if (q !== -1) {
        const L = M.getBoundingClientRect();
        w(f, p.clientX < L.left + L.width / 2 ? q : q + 1, !0);
      }
    } else if (e(h)) {
      const D = e(h).querySelectorAll(".gallery-item-wrapper");
      if (D.length > 0) {
        const q = D[0].getBoundingClientRect(), L = D[D.length - 1].getBoundingClientRect();
        p.clientX <= q.left ? w(f, 0) : p.clientX >= L.right && w(f, e(O).length, !0);
      }
    }
    if (e(h)) {
      const D = e(h).getBoundingClientRect();
      p.clientX - D.left < ke ? re("left", p.clientX) : D.right - p.clientX < ke ? re("right", p.clientX) : d();
    }
  }
  function x() {
    if (document.removeEventListener("touchmove", ce), document.removeEventListener("touchend", x), d(), e(k)) {
      I(), w(u, -1), w(f, -1);
      return;
    }
    const v = e(f);
    if (e(u) !== -1 && v !== -1 && v !== e(u) && v !== e(u) + 1) {
      const p = e(u) < v ? v - 1 : v;
      ae.reorderItems(e(u), p);
    }
    I(), w(u, -1), w(f, -1);
  }
  function I() {
    b && (b.remove(), b = null);
  }
  function m(v) {
    if (!e(h)) return;
    const p = e(h).closest(".composer-scroll-region");
    ti(e(h), v, p instanceof HTMLElement ? p : null) && v.preventDefault();
  }
  ye(() => {
    if (e(h))
      return e(h).addEventListener("wheel", m, { passive: !1 }), () => {
        e(h)?.removeEventListener("wheel", m);
      };
  });
  var R = Br(), P = At(R);
  {
    var ve = (v) => {
      var p = ri();
      let j;
      ir(p, 23, () => e(O), (M) => M.id, (M, D, q) => {
        var L = ni();
        let V;
        var g = fe(L);
        Rt(g, {
          get item() {
            return e(D);
          },
          get index() {
            return e(q);
          },
          onDelete: Q,
          onDragStart: ee,
          onDragOver: le,
          onDragEnd: G,
          onDrop: X,
          onTouchDragStart: be,
          get disabled() {
            return e(k);
          }
        }), pe(L), Se(() => V = Fe(L, 1, "gallery-item-wrapper svelte-w2vv8k", null, V, {
          "insert-bar-left": e(J) === e(q),
          "insert-bar-right": e(J) === e(O).length && e(q) === e(O).length - 1
        })), ne(M, L);
      }), pe(p), Ce(p, (M) => w(h, M), () => e(h)), Se(
        (M) => {
          j = Fe(p, 1, "media-gallery svelte-w2vv8k", null, j, { sending: e(k) }), ge(p, "aria-label", M);
        },
        [() => r()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), he("dragover", p, H), he("drop", p, de), ne(v, p);
    };
    te(P, (v) => {
      e(O).length > 0 && v(ve);
    });
  }
  ne(n, R), Je(), s();
}
Ve(Ht, {}, [], [], { mode: "open" });
function Xe(n) {
  if (!n || !n.types) return !1;
  try {
    return Array.from(n.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function Ot(n) {
  if (!n) return !1;
  try {
    return Array.from(n.types).includes("Files") || n.files && n.files.length > 0;
  } catch {
    return !!(n.files && n.files.length > 0);
  }
}
function De(n) {
  const t = n.__postStatus;
  return (typeof t == "function" ? t() : t)?.sending === !0;
}
function Te(n) {
  return typeof n.__uploadFiles == "function";
}
function oi(n) {
  let t = $(!1);
  function r(o) {
    if (De(n) || !Te(n)) {
      o.preventDefault(), w(t, !1), n.classList.remove("drag-over");
      return;
    }
    const l = o.dataTransfer, u = Xe(l);
    Ot(l) && !u ? (o.preventDefault(), e(t) || (w(t, !0), n.classList.add("drag-over"))) : e(t) && (w(t, !1), n.classList.remove("drag-over"));
  }
  function a(o) {
    e(t) && (w(t, !1), n.classList.remove("drag-over"));
  }
  async function s(o) {
    if (w(t, !1), n.classList.remove("drag-over"), De(n) || !Te(n)) {
      o.preventDefault();
      return;
    }
    const l = o.dataTransfer;
    Xe(l) || l?.files && l.files.length > 0 && typeof n.__uploadFiles == "function" && (o.preventDefault(), n.__uploadFiles(l.files));
  }
  return n.addEventListener("dragover", r), n.addEventListener("dragleave", a), n.addEventListener("drop", s), {
    destroy() {
      n.removeEventListener("dragover", r), n.removeEventListener("dragleave", a), n.removeEventListener("drop", s);
    }
  };
}
function ai(n, t) {
  const r = oi(n);
  function a(l) {
    if (De(n) || !Te(n)) {
      l.preventDefault(), t.dragOver(!1);
      return;
    }
    const u = l.dataTransfer, f = Xe(u);
    Ot(u) && !f ? t.dragOver(!0) : t.dragOver(!1);
  }
  function s(l) {
    t.dragOver(!1);
  }
  function o(l) {
    t.dragOver(!1), (De(n) || !Te(n)) && l.preventDefault();
  }
  return n.addEventListener("dragover", a), n.addEventListener("dragleave", s), n.addEventListener("drop", o), {
    destroy() {
      r?.destroy?.(), n.removeEventListener("dragover", a), n.removeEventListener("dragleave", s), n.removeEventListener("drop", o);
    }
  };
}
function si(n) {
  function t(r) {
    if (De(n)) {
      r.preventDefault();
      return;
    }
    if (!r.clipboardData) return;
    if (!Te(n)) {
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
function li(n) {
  function t(a) {
    const s = a.target;
    if (s && (s.closest('.editor-image-button[data-dragging="true"]') || s.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const o = a.touches[0], l = 120, u = St.querySelector(".tiptap-editor");
      if (u) {
        const f = u.getBoundingClientRect(), b = o.clientY < f.top + l, F = o.clientY > f.bottom - l;
        if (!b && !F)
          return a.preventDefault(), !1;
      }
    }
  }
  function r(a) {
    const s = St.querySelectorAll(".drop-zone-indicator");
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
function di(n, t = !0) {
  function r(a) {
    if (t && (a.ctrlKey || a.metaKey) && (a.key === "Enter" || a.key === "NumpadEnter")) {
      a.preventDefault();
      const s = n.__currentEditor, o = typeof s == "function" ? s() : s, l = n.__hasPostingCapability, u = typeof l == "function" ? l() : l, f = n.__hasStoredKey, b = typeof f == "function" ? f() : f, F = n.__postStatus, T = typeof F == "function" ? F() : F, h = o ? sr(o) : "";
      !T?.sending && h.trim() && (u ?? b) && n.__submitPost?.();
    }
  }
  return n.addEventListener("keydown", r), {
    destroy() {
      n.removeEventListener("keydown", r);
    }
  };
}
function ci(n) {
  let t = !1;
  return n?.descendants((r) => {
    if (t) return !1;
    const a = r.type?.name;
    (a === "image" || a === "video") && (t = !0);
  }), t;
}
function ui(n) {
  const { currentEditor: t, editorContainerEl: r, callbacks: a } = n, s = (u) => {
    const b = u.detail.plainText, F = t ? ci(t.state?.doc) : !1;
    a.onContentUpdate?.(b, F);
  }, o = (u) => {
    const f = u;
    a.onImageFullscreenRequest?.(f.detail.src, f.detail.alt || "", f.detail.mediaId);
  }, l = (u) => {
    const b = u?.detail?.pos;
    if (b != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const F = ar.create(t.state.doc, b);
        t.view.dispatch(t.state.tr.setSelection(F).scrollIntoView());
      } catch (F) {
        console.warn("select-image-node handler failed:", F);
      }
      a.onSelectImageNode?.(b);
    }
  };
  return window.addEventListener("editor-content-changed", s), window.addEventListener("image-fullscreen-request", o), window.addEventListener("select-image-node", l), r && (r.addEventListener("image-fullscreen-request", o), r.addEventListener("select-image-node", l)), {
    handleContentUpdate: s,
    handleImageFullscreenRequest: o,
    handleSelectImageNode: l
  };
}
function gi(n, t) {
  window.removeEventListener("editor-content-changed", n.handleContentUpdate), window.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), window.removeEventListener("select-image-node", n.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), t.removeEventListener("select-image-node", n.handleSelectImageNode));
}
function hi() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function pi(n) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (n?.rejectedRelays?.length ?? 0) > 0 || (n?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function fi(n) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: n || "postComponent.post_error",
    completed: !1
  };
}
function vi({
  updatePostStatus: n,
  clearContentAfterSuccess: t,
  onPostSuccess: r
}) {
  return {
    markSending: () => {
      n(hi());
    },
    markSuccess: (a) => {
      n(pi(a)), t(), r?.(a);
    },
    markFailure: (a) => {
      n(fi(a));
    }
  };
}
async function mi(n) {
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
function Ct(n) {
  if (n.dimensions && n.dimensions.width > 0 && n.dimensions.height > 0)
    return {
      width: n.dimensions.width,
      height: n.dimensions.height
    };
  const t = lr(n.dim);
  return t || {};
}
function yi(n) {
  if (!n.mediaFreePlacement)
    return n.galleryItems.filter((r) => !r.isPlaceholder).map((r) => {
      const a = Ct({
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
      const a = Ct({
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
function wi(n, t, r) {
  if (t) {
    const a = n.findIndex((s) => s.id === t);
    if (a >= 0)
      return a;
  }
  return r ? n.findIndex((a) => a.src === r) : -1;
}
function bi(n, t) {
  return n[t];
}
function Si(n) {
  const t = [];
  return n.state.doc.descendants((r, a) => {
    (r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder && t.push({ node: r, pos: a });
  }), t;
}
function Ei(n) {
  const t = Si(n.currentEditor);
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
function xi(n) {
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
    const u = l.src;
    if (l.type === "image" && t.nodes.image) {
      const f = t.nodes.image.create({
        src: u,
        alt: l.alt ?? "Image",
        blurhash: l.blurhash ?? null,
        dim: l.dim ?? null,
        size: l.size ?? null,
        uploadProtocol: l.uploadProtocol ?? null
      });
      r = r.insert(a, f), a += f.nodeSize;
    } else if (l.type === "video" && t.nodes.video) {
      const f = t.nodes.video.create({ src: u });
      r = r.insert(a, f), a += f.nodeSize;
    }
    l.ox && (s[u] = l.ox), l.x && (o[u] = l.x);
  }), n.currentEditor.view.dispatch(r), {
    imageOxMap: s,
    imageXMap: o,
    hadItems: !0
  };
}
async function Pi(n) {
  const {
    input: t,
    postHistoryRepositoryImpl: r = Tt,
    postMediaCacheRepositoryImpl: a = cr
  } = n;
  await r.putPostedEvent(t);
  const s = dr(t.event).map((o) => o.url).filter(Boolean);
  s.length !== 0 && await a.linkEventIdByUrls({
    eventId: t.event.id,
    urls: s
  });
}
function Ci(n) {
  const {
    placeholderText: t,
    editorContainerEl: r,
    hasStoredKey: a,
    hasPostingCapability: s,
    submitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: u,
    hostOwnedLite: f,
    uploadFiles: b,
    eventCallbacks: F
  } = n;
  ur.value = t;
  const T = gr({
    placeholderText: t,
    onSubmitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: u,
    hostOwnedLite: f,
    onCreate: (k) => {
      We.set(k);
    }
  });
  let h = null;
  const _ = T.subscribe((k) => {
    h = k;
  }), O = ui({
    currentEditor: h,
    editorContainerEl: r,
    callbacks: F
  });
  return hr(o), r && Object.assign(r, {
    __uploadFiles: b,
    __currentEditor: () => h,
    __hasStoredKey: () => a,
    __hasPostingCapability: () => s ?? a,
    __postStatus: () => Y.postStatus,
    __submitPost: o
  }), { editor: T, unsubscribe: _, handlers: O };
}
function Fi(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: r,
    handlers: a,
    currentEditor: s,
    editorContainerEl: o,
    submitPost: l
  } = n;
  gi(a, o), We.value === s && We.set(null), pr(l), r(), t(), s && !s.isDestroyed && s.destroy(), o && (delete o.__uploadFiles, delete o.__currentEditor, delete o.__hasStoredKey, delete o.__hasPostingCapability, delete o.__postStatus, delete o.__submitPost);
}
function _i(n, t) {
  const r = n.view.dom;
  if (fr() && document.activeElement !== r) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
var ki = se('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), Ii = se('<div class="plane-icon svg-icon svelte-15ticnd"></div>'), Mi = se('<div class="editor-submit-button-container svelte-15ticnd"><!></div>'), Di = se('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), Ti = se('<div class="upload-error svelte-15ticnd"> </div>'), Li = se('<div class="svelte-15ticnd"> </div>'), Ai = se('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const Ri = {
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
function Hi(n, t) {
  Ze(t, !0), Ge(n, Ri);
  const r = () => $e(Ye, "$_", a), [a, s] = Qe();
  let o = N(t, "rxNostr", 7), l = N(t, "hasStoredKey", 7), u = N(t, "hasPostingCapability", 23, l), f = N(t, "isSwitchingAccount", 7, !1), b = N(t, "onPostSuccess", 7), F = N(t, "availableComposerHeight", 7, Pe), T = N(t, "minEditorHeight", 7, Pe), h = N(t, "onCustomEmojiSelect", 7), _ = N(t, "onEditorEmptyChange", 7), O = N(t, "notificationPort", 7), k = N(t, "hostOwnedConfig", 7), J = N(t, "hostCustomEmojiItems", 23, () => []), ee = N(t, "normalUploadFiles", 7);
  const G = !1;
  let X = E(() => !G), H = E(() => Y.isUploading), de = E(() => Y.canPost), Q = E(() => G), re = $(null), d = $(null), be = $(!1), ce = $(void 0), x = $(void 0), I = $(Oe({})), m = $(Oe({})), R = E(() => Ue.value), P = E(() => Y.postStatus), ve = E(() => Y.uploadErrorMessage), v = E(() => zr.value), p = E(() => Ir.value), j = E(() => Mr.value), M = $(!0), D = !1, q = E(() => l() && !f() && e(p) && !e(j) && e(M)), L = null, V = null, g = null, A = null, U = $(Oe(Pe)), K = E(() => G), _e = E(() => e(K) ? `--post-editor-auto-grow-min-lines: ${k().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${k().editorMaxLines}lh;` : `--post-editor-min-height: ${T()}px; --post-editor-target-height: ${e(U)}px;`), et = E(() => r()("postComponent.enter_your_text") || "テキストを入力してください");
  ye(() => {
    e(d), vr(e(et));
  }), ye(() => {
    const i = e(d), c = !e(P).sending || e(Q);
    i && i.isEditable !== c && i.setEditable(c, !1);
  });
  function tt() {
    if (e(K)) return;
    const i = T();
    if (!L || !V) {
      w(U, i, !0);
      return;
    }
    const c = Array.from(L.children).reduce(
      (C, y) => y === V ? C : C + Tr(y),
      0
    ), S = Lr({
      availableComposerHeight: F(),
      nonEditorHeight: c,
      minHeight: i
    });
    e(U) !== S && w(U, S, !0);
  }
  function Wt(i) {
    if (e(P).sending) {
      i.preventDefault();
      return;
    }
    !(i.target instanceof HTMLElement) || !e(d) || kr(i.target) || e(d).commands.focus("end");
  }
  function zt(i) {
    !e(d) || i.currentTarget !== i.target || i.key !== "Enter" && i.key !== " " || (i.preventDefault(), e(d).commands.focus("end"));
  }
  function Nt(i) {
    e(P).sending && (i.preventDefault(), i.stopPropagation());
  }
  function Bt(i) {
    e(P).sending && i.preventDefault();
  }
  function jt(i) {
    i.preventDefault();
  }
  function qt(i) {
    const c = e(d)?.view.dom;
    !e(Q) || !c || i.relatedTarget !== c || c.focus({ preventScroll: !0 });
  }
  let me = E(() => ue.value), Ut = E(() => e(me).showSecretKeyDialog), nt = E(() => e(me).showImageFullscreen), Kt = E(() => e(me).fullscreenMediaId), rt = E(() => e(me).fullscreenImageSrc), Xt = E(() => e(me).fullscreenImageAlt), it = E(() => e(me).showFloatingMessage), Gt = E(() => e(me).floatingMessageX), Qt = E(() => e(me).floatingMessageY), $t = E(() => e(me).floatingMessageText);
  ye(() => {
    o() && (e(x) ? e(x).setRxNostr(o()) : w(
      x,
      new qr(o(), {
        getNip46SignerForSessionFn: (i) => wr.getSignerForSession(i),
        getParentClientSignerFn: () => yr.getSigner(),
        channelContextState: mr,
        replyQuoteState: kt,
        replyQuoteService: new He(),
        clearReplyQuoteFn: Ke,
        savePostHistoryFn: (i) => Pi({ input: i, postHistoryRepositoryImpl: Tt }),
        notificationPort: O()
      }),
      !0
    ));
  });
  const ze = Gr({
    getCurrentEditor: () => e(d),
    getFileInput: () => e(ce),
    getImageOxMap: () => e(I),
    getImageXMap: () => e(m),
    getUploadFailedText: (i) => r()(i),
    updateUploadState: (i, c) => {
      Kr(Y, i, c);
    },
    setUploadErrorMessage: (i) => {
      Y.uploadErrorMessage = i;
    },
    uploadFiles: async (i) => {
      if (e(P).sending || Y.isUploading || G)
        return null;
      {
        if (ee()) return await ee()(i);
        const { uploadFiles: c } = await import("./App-0-rBUlwf.js").then((S) => S.eB);
        return await c(i);
      }
    }
  }), Ee = vi({
    updatePostStatus: Et,
    clearContentAfterSuccess: st,
    onPostSuccess: (i) => b()?.(i)
  });
  ye(() => {
    if (e(K)) return;
    if (F(), T(), e(R), e(ve), e(d), e(R) || ae.items.length, typeof window > "u") {
      w(U, Pe, !0);
      return;
    }
    const i = window.requestAnimationFrame(() => {
      tt();
    });
    return () => {
      window.cancelAnimationFrame(i);
    };
  }), ye(() => {
    if (e(K) || (F(), T(), e(d), e(R), e(ve), !L || typeof ResizeObserver > "u"))
      return;
    let i = null;
    const c = () => {
      i === null && (i = window.requestAnimationFrame(() => {
        i = null, tt();
      }));
    }, S = new ResizeObserver(c);
    c(), S.observe(L);
    for (const C of Array.from(L.children))
      C !== V && S.observe(C);
    return () => {
      S.disconnect(), i !== null && window.cancelAnimationFrame(i);
    };
  }), br(() => {
    g = Ci({
      placeholderText: e(et),
      editorContainerEl: V,
      currentEditor: e(d),
      hasStoredKey: l(),
      hasPostingCapability: u(),
      submitPost: Le,
      onCustomEmojiSelect: h(),
      enterKeyBehavior: void 0,
      hostOwnedLite: G,
      uploadFiles: e(X) ? (y) => {
        ze.performUpload(y);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: Dr,
        onImageFullscreenRequest: (y, z, ie) => {
          ue.showImageFullscreen(y, z, ie || "");
        },
        onSelectImageNode: (y) => {
        }
      }
    }), w(re, g.editor, !0);
    let i = null;
    const c = (y) => {
      const z = y.isEmpty, ie = !D || e(M) !== z;
      w(M, z, !0), D = !0, ie && _()?.(z);
    }, S = ({ editor: y }) => {
      c(y);
    };
    A = e(re).subscribe((y) => {
      i && i.off("transaction", S), i = y, w(d, y, !0), y && c(y), y?.on("transaction", S), We.set(y);
    });
    const C = (y) => {
      const z = y, { src: ie, alt: je, mediaId: Dn } = z.detail;
      ue.showImageFullscreen(ie, je, Dn || "");
    };
    return window.addEventListener("image-fullscreen-request", C), () => {
      window.removeEventListener("image-fullscreen-request", C), g && (i && i.off("transaction", S), Fi({
        unsubscribe: g.unsubscribe,
        componentUnsubscribe: A ?? (() => {
        }),
        handlers: g.handlers,
        currentEditor: e(d),
        editorContainerEl: V,
        submitPost: Le
      }), A = null);
    };
  });
  const Yt = ze.handleFileSelect;
  async function Vt(i) {
    return await ze.performUpload(i);
  }
  function Zt() {
    e(d)?.commands.focus();
  }
  function Jt() {
    e(d)?.commands.blur();
  }
  function en(i) {
    if (!e(d) || !i) return;
    const c = e(
      d
      // nullチェック済みのローカル変数
    ), C = i.split(`
`).map((y) => ({
      type: "paragraph",
      content: y ? [{ type: "text", text: y }] : void 0
    }));
    c.commands.setContent({ type: "doc", content: C }), c.commands.focus("end");
  }
  function tn(i) {
    if (!e(d) || !i) return !1;
    const S = i.split(`
`).map((C) => ({
      type: "paragraph",
      content: C ? [{ type: "text", text: C }] : void 0
    }));
    return e(d).isEmpty ? e(d).commands.setContent({ type: "doc", content: S }) : e(d).chain().focus("end").insertContent([{ type: "paragraph" }, ...S]).run(), e(d).commands.focus("end"), !0;
  }
  function nn(i) {
    if (!e(d) || !i) return;
    const c = Er(i);
    e(d).commands.setContent(c || "<p></p>"), e(d).commands.focus("end");
  }
  function rn() {
    return e(d) ? e(d).getHTML() : "";
  }
  function on(i) {
    if (!e(d) || i.length === 0) return;
    const { schema: c } = e(d).state;
    let S = e(d).state.tr, C = e(d).state.doc.content.size;
    i.forEach((y) => {
      if (y.isPlaceholder) return;
      const z = y.src;
      if (y.type === "image" && c.nodes.image) {
        const ie = c.nodes.image.create({
          src: z,
          alt: y.alt ?? "Image",
          blurhash: y.blurhash ?? null,
          dim: y.dim ?? null,
          size: y.size ?? null,
          uploadProtocol: y.uploadProtocol ?? null
        });
        S = S.insert(C, ie), C += ie.nodeSize, y.ox && w(I, { ...e(I), [z]: y.ox }, !0), y.x && w(m, { ...e(m), [z]: y.x }, !0);
      } else if (y.type === "video" && c.nodes.video) {
        const ie = c.nodes.video.create({ src: z });
        S = S.insert(C, ie), C += ie.nodeSize;
      }
    }), e(d).view.dispatch(S), e(d).commands.focus("end");
  }
  function an(i) {
    !e(d) || e(P).sending || _i(e(d), i);
  }
  function Ne() {
    if (!e(d)) return;
    Fr(e(d).view.dom) || _r(e(d));
  }
  function ot(i) {
    if (!e(d) || e(P).sending) return;
    Ne();
    const { state: c, view: S } = e(d), C = i < 0 ? c.selection.from : c.selection.to, y = Math.max(0, Math.min(c.doc.content.size, C + i));
    if (y === C) return;
    const z = Cr.near(c.doc.resolve(y), i);
    S.dispatch(c.tr.setSelection(z).scrollIntoView().setMeta("addToHistory", !1));
  }
  function sn() {
    ot(-1);
  }
  function ln() {
    ot(1);
  }
  function dn() {
    if (!e(d) || e(P).sending) return;
    Ne();
    const { state: i, view: c } = e(d), { selection: S } = i;
    if (!S.empty) {
      e(d).commands.deleteSelection();
      return;
    }
    const y = S.$from.nodeBefore;
    if (y) {
      const z = y.isText ? Array.from(y.text ?? "").at(-1)?.length ?? 0 : y.nodeSize;
      z > 0 && c.dispatch(i.tr.delete(S.from - z, S.from).scrollIntoView());
      return;
    }
    e(d).commands.first(({ commands: z }) => [
      () => z.joinBackward(),
      () => z.selectNodeBackward()
    ]);
  }
  function cn() {
    !e(d) || e(P).sending || (Ne(), e(d).commands.keyboardShortcut("Enter"));
  }
  function at() {
    return !!e(d) && Y.canPost && !e(P).sending && !Y.isUploading && !e(P).completed && (u() || !!e(x));
  }
  async function Le(i) {
    if (!e(d) || !at() || !e(x)) return;
    const c = e(x).preparePostPayload(e(d));
    if (xr(c.content)) {
      ue.showSecretKeyDialog(c.content, c.emojiTags);
      return;
    }
    await e(x).performPostSubmission(e(d), e(I), e(m), Ee.markSending, Ee.markSuccess, Ee.markFailure);
  }
  function un() {
    if (e(d)) {
      if (e(x)) {
        e(x).resetPostContent(e(d));
        return;
      }
      e(d).chain().clearContent().run();
    }
  }
  function st() {
    if (e(x) && e(d)) {
      e(x).clearContentAfterSuccess(e(d));
      return;
    }
    if (e(d)) {
      const i = k()?.hashtagPinEnabled === !0 && It.value ? [...Mt().hashtags] : [];
      e(d).chain().clearContent().run(), Ft.reset(), _t.reset(), ae.clearAll(), w(I, {}, !0), w(m, {}, !0), Ke(), i.length > 0 && e(d).commands.insertContent(` ${i.map((c) => `#${c}`).join(" ")}`), e(d).commands.focus("start");
    }
  }
  async function gn() {
    if (!at()) return;
    const i = ue.getPendingPost(), c = ue.getPendingEmojiTags();
    ue.hideSecretKeyDialog(), e(x) && e(d) && await mi({
      postManager: e(x),
      currentEditor: e(d),
      imageOxMap: e(I),
      imageXMap: e(m),
      pendingPost: i,
      pendingEmojiTags: c,
      onStart: Ee.markSending,
      onSuccess: Ee.markSuccess,
      onFailure: Ee.markFailure
    });
  }
  const hn = ue.hideSecretKeyDialog, pn = ue.hideImageFullscreen;
  let Be = E(() => yi({
    mediaFreePlacement: e(R),
    galleryItems: ae.items,
    currentEditor: e(d)
  })), fn = E(() => wi(e(Be), e(Kt), e(rt)));
  function vn(i) {
    const c = bi(e(Be), i);
    c && ue.showImageFullscreen(c.src, c.alt ?? "", c.id ?? "");
  }
  ye(() => {
    e(d) && e(x) && e(x).preparePostContent(e(d)) !== Y.content && e(P).error && Et({ ...e(P), error: !1, message: "" });
  });
  function mn() {
    !e(X) || e(P).sending || Y.isUploading || e(ce)?.click();
  }
  ye(() => {
    const i = ae.items.some((C) => !C.isPlaceholder), c = !!Y.content.trim(), S = Y.hasImage;
    Y.canPost = c || S || i;
  });
  let lt = !0;
  ye(() => {
    const i = !Ue.value;
    if (lt) {
      lt = !1;
      return;
    }
    if (!e(d)) return;
    const c = e(d);
    if (i)
      Ie(() => Ei({
        currentEditor: c,
        imageOxMap: e(I),
        imageXMap: e(m),
        addGalleryItem: (C) => ae.addItem(C),
        createMediaItemId: Pr
      })) && Ie(() => {
        w(I, {}, !0), w(m, {}, !0);
      });
    else {
      const S = Ie(() => ae.getItems()), C = xi({ currentEditor: c, items: S });
      C.hadItems && Ie(() => {
        w(I, C.imageOxMap, !0), w(m, C.imageXMap, !0);
      }), Ie(() => ae.clearAll());
    }
  });
  var yn = {
    uploadFiles: Vt,
    focusEditor: Zt,
    blurEditor: Jt,
    insertTextContent: en,
    appendSharedTextContent: tn,
    loadDraftContent: nn,
    getEditorHtml: rn,
    appendMediaToEditor: on,
    insertCustomEmoji: an,
    moveCaretLeft: sn,
    moveCaretRight: ln,
    deleteBackward: dn,
    insertLineBreak: cn,
    submitPost: Le,
    resetPostContent: un,
    clearContentAfterSuccess: st,
    openFileDialog: mn,
    get rxNostr() {
      return o();
    },
    set rxNostr(i) {
      o(i), B();
    },
    get hasStoredKey() {
      return l();
    },
    set hasStoredKey(i) {
      l(i), B();
    },
    get hasPostingCapability() {
      return u();
    },
    set hasPostingCapability(i = l) {
      u(i), B();
    },
    get isSwitchingAccount() {
      return f();
    },
    set isSwitchingAccount(i = !1) {
      f(i), B();
    },
    get onPostSuccess() {
      return b();
    },
    set onPostSuccess(i) {
      b(i), B();
    },
    get availableComposerHeight() {
      return F();
    },
    set availableComposerHeight(i = Pe) {
      F(i), B();
    },
    get minEditorHeight() {
      return T();
    },
    set minEditorHeight(i = Pe) {
      T(i), B();
    },
    get onCustomEmojiSelect() {
      return h();
    },
    set onCustomEmojiSelect(i) {
      h(i), B();
    },
    get onEditorEmptyChange() {
      return _();
    },
    set onEditorEmptyChange(i) {
      _(i), B();
    },
    get notificationPort() {
      return O();
    },
    set notificationPort(i) {
      O(i), B();
    },
    get hostOwnedConfig() {
      return k();
    },
    set hostOwnedConfig(i) {
      k(i), B();
    },
    get hostCustomEmojiItems() {
      return J();
    },
    set hostCustomEmojiItems(i = []) {
      J(i), B();
    },
    get normalUploadFiles() {
      return ee();
    },
    set normalUploadFiles(i) {
      ee(i), B();
    }
  }, dt = Ai(), xe = At(dt);
  let ct;
  var Z = fe(xe);
  let ut;
  var gt = fe(Z);
  {
    var wn = (i) => {
      var c = ki(), S = fe(c);
      {
        let C = E(() => e(v)?.picture || "");
        Ar(S, {
          get src() {
            return e(C);
          },
          alt: "",
          fallbackAriaLabel: "",
          rootClassName: "editor-account-placeholder-avatar",
          imageClassName: "editor-account-placeholder-image",
          fallbackClassName: "editor-account-placeholder-fallback"
        });
      }
      pe(c), ne(i, c);
    };
    te(gt, (i) => {
      e(q) && i(wn);
    });
  }
  var ht = oe(gt, 2);
  {
    var bn = (i) => {
      Rr(i, {
        get editor() {
          return e(d);
        },
        class: "editor-content"
      });
    };
    te(ht, (i) => {
      e(re) && e(d) && i(bn);
    });
  }
  var Sn = oe(ht, 2);
  {
    var En = (i) => {
      var c = Mi(), S = fe(c);
      {
        let C = E(() => !e(de) || e(P).sending || e(H) || !u() || e(P).completed), y = E(() => r()("postComponent.post"));
        Hr(S, {
          variant: "primary",
          shape: "circle",
          contentLayout: "icon",
          className: "editor-submit-button",
          get disabled() {
            return e(C);
          },
          onClick: () => {
            !e(de) || e(P).sending || e(H) || !u() || e(P).completed || Le();
          },
          onfocus: qt,
          get ariaLabel() {
            return e(y);
          },
          children: (z, ie) => {
            var je = Ii();
            ne(z, je);
          },
          $$slots: { default: !0 }
        });
      }
      pe(c), he("pointerdown", c, jt, !0), ne(i, c);
    };
    te(Sn, (i) => {
      e(Q) && i(En);
    });
  }
  pe(Z), Re(Z, (i, c) => ai?.(i, c), () => ({ dragOver: (i) => w(be, i, !0) })), Re(Z, (i) => si?.(i)), Re(Z, (i) => li?.(i)), Re(Z, (i, c) => di?.(i, c), () => !G), Ce(Z, (i) => V = i, () => V);
  var pt = oe(Z, 2);
  {
    var xn = (i) => {
      Ht(i, {});
    };
    te(pt, (i) => {
      e(R) || i(xn);
    });
  }
  var ft = oe(pt, 2);
  {
    var Pn = (i) => {
      var c = Di();
      Ce(c, (S) => w(ce, S), () => e(ce)), we("change", c, Yt), ne(i, c);
    };
    te(ft, (i) => {
      e(X) && i(Pn);
    });
  }
  var Cn = oe(ft, 2);
  {
    var Fn = (i) => {
      var c = Ti(), S = fe(c, !0);
      pe(c), Se(() => xt(S, e(ve))), ne(i, c);
    };
    te(Cn, (i) => {
      e(ve) && i(Fn);
    });
  }
  pe(xe), Ce(xe, (i) => L = i, () => L);
  var vt = oe(xe, 2);
  {
    var _n = (i) => {
      {
        let c = E(() => r()("postComponent.warning")), S = E(() => r()("postComponent.secret_key_detected")), C = E(() => r()("postComponent.post")), y = E(() => r()("postComponent.cancel"));
        Or(i, {
          get open() {
            return e(Ut);
          },
          get title() {
            return e(c);
          },
          get description() {
            return e(S);
          },
          get confirmLabel() {
            return e(C);
          },
          get cancelLabel() {
            return e(y);
          },
          confirmVariant: "danger",
          onConfirm: gn,
          get onCancel() {
            return hn;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    te(vt, (i) => {
      i(_n);
    });
  }
  var mt = oe(vt, 2);
  Sr(mt, {
    get src() {
      return e(rt);
    },
    get alt() {
      return e(Xt);
    },
    get onClose() {
      return pn;
    },
    get mediaList() {
      return e(Be);
    },
    get currentIndex() {
      return e(fn);
    },
    onNavigate: vn,
    get show() {
      return e(nt);
    },
    set show(i) {
      w(nt, i);
    }
  });
  var kn = oe(mt, 2);
  {
    var In = (i) => {
      Wr(i, {
        get show() {
          return e(it);
        },
        get x() {
          return e(Gt);
        },
        get y() {
          return e(Qt);
        },
        children: (c, S) => {
          var C = Li(), y = fe(C, !0);
          pe(C), Se(() => xt(y, e($t))), ne(c, C);
        },
        $$slots: { default: !0 }
      });
    };
    te(kn, (i) => {
      e(it) && i(In);
    });
  }
  Se(
    (i) => {
      ct = Fe(xe, 1, "post-container svelte-15ticnd", null, ct, { "editor-auto-grow": e(K) }), Dt(xe, e(_e)), ut = Fe(Z, 1, "editor-container svelte-15ticnd", null, ut, {
        "drag-over": e(be),
        "gallery-mode": !e(R),
        sending: e(P).sending,
        "editor-submit-enabled": e(Q),
        "account-avatar-placeholder": e(q)
      }), ge(Z, "aria-label", i), ge(Z, "aria-disabled", e(P).sending ? "true" : void 0);
    },
    [() => r()("postComponent.editor_label")]
  ), we("click", Z, Wt), he("keydown", Z, Nt, !0), we("keydown", Z, zt), we("beforeinput", Z, Bt), ne(n, dt);
  var Mn = Je(yn);
  return s(), Mn;
}
Lt(["click", "keydown", "beforeinput", "change"]);
Ve(
  Hi,
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
  Hi as default
};
