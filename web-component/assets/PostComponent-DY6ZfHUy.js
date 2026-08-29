import { a as yn, h as ht, m as Be, b as ie, c as bt, d as Et, k as wn, e as Sn, s as bn, w as En, r as xt, f as xn, i as pt, j as Pn, l as Fn, n as Cn, o as _n, p as kn, q as Pt, t as In, u as qe, P as Mn, v as Tn, x as De, y as Dn, z as Ln, A as An, B as Rn, C as Hn, R as Ae, D as On, E as Ft, F as Wn, G as Nn, H as Ke, I as j, J as zn, K as ae, L as Fe, M as Ce, N as le, O as Ct, Q as Xe, S as jn, T as Bn, U as qn, V as Ge, $ as Qe, W as Un, X as ee, Y as _e, Z as ft, _ as Kn, a0 as Xn, a1 as vt, a2 as Gn, a3 as Qn, a4 as _t, a5 as $n, a6 as Yn, a7 as Vn, a8 as Zn, a9 as He, aa as Jn, ab as er, ac as tr, ad as Pe, ae as nr, af as rr, ag as ir, ah as ar, ai as or, aj as mt, ak as Le, al as sr, am as lr, an as cr, ao as dr, ap as ur, aq as gr, ar as hr, as as pr, at as fr, au as vr, av as mr, aw as yr, ax as wr, ay as Sr, az as br, aA as Er, aB as xr, aC as Pr } from "./App-BXRUDZkJ.js";
import { bk as je, aJ as Re, aq as kt, b6 as $e, b0 as Ye, a as e, bf as ce, b as w, Z as Se, bC as ve, ap as we, b3 as de, b4 as Ve, aS as X, ba as ge, b8 as me, aR as P, b5 as B, bg as Fr, b9 as ue, aN as fe, b1 as Cr, b2 as It, bl as _r, u as ke, bi as yt } from "./entry-P10b_OwJ.js";
class kr {
  constructor(t, r = {}) {
    this.deps = r, t && this.setRxNostr(t), this.deps.console = r.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = r.authStateStore || yn, this.deps.hashtagStore = r.hashtagStore || ht, this.deps.mediaFreePlacementStore = r.mediaFreePlacementStore || Be, this.deps.mediaGalleryStore = r.mediaGalleryStore || ie, this.deps.contentWarningStore = r.contentWarningStore || bt, this.deps.contentWarningReasonStore = r.contentWarningReasonStore || Et, this.deps.keyManager = r.keyManager || wn, this.deps.createImetaTagFn = r.createImetaTagFn || Sn, this.deps.settingsStore = r.settingsStore || bn, this.deps.writeRelaysStore = r.writeRelaysStore || En, this.deps.replyQuoteState = r.replyQuoteState || xt, this.deps.getClientTagFn = r.getClientTagFn || (() => xn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = r.seckeySignerFn || pt, this.deps.extractContentWithImagesFn = r.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = r.extractContentWithEmojiTagsFn || (r.extractContentWithImagesFn ? (o) => ({ content: r.extractContentWithImagesFn(o), emojiTags: [] }) : Pn), this.deps.extractImageBlurhashMapFn = r.extractImageBlurhashMapFn || Fn, this.deps.resetEditorStateFn = r.resetEditorStateFn || Cn, this.deps.resetPostStatusFn = r.resetPostStatusFn || _n, this.deps.notificationPort = r.iframeMessageService || r.notificationPort || kn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = r.hashtagPinStore || Pt, this.deps.saveHashtagsToHistoryFn = r.saveHashtagsToHistoryFn || In, this.deps.clearReplyQuoteFn = r.clearReplyQuoteFn || qe;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new Mn(t, this.deps.console || console);
  }
  clearReplyQuoteAfterSuccess() {
    this.deps.clearReplyQuoteFn?.();
  }
  getReplyQuoteNotifyOptions() {
    const t = this.deps.replyQuoteState.value, r = Array.from(
      new Set(t.quotes.map((o) => o.eventId))
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
    return Tn.buildEvent(
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
  finalizeSubmittedPost(t, r, o) {
    return t.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(r)).catch(() => {
      this.deps.console?.warn?.("hashtag_history_save_failed", {
        stage: "post-success",
        reason: "unexpected"
      });
    }), this.clearReplyQuoteAfterSuccess(), this.deps.notificationPort?.notifyPostSuccess({
      ...o,
      ...t.eventId ? { eventId: t.eventId } : {}
    }), t) : (this.deps.notificationPort?.notifyPostError(t.error), t);
  }
  async saveSubmittedPostHistory(t) {
    if (!t.result.success || !this.deps.savePostHistoryFn) return;
    const r = je.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), o = je.sanitizeExternalRelayUrls([
      ...r,
      ...t.additionalWriteRelays ?? [],
      ...this.deps.writeRelaysStore?.value ?? []
    ], { limit: 3 });
    try {
      await this.deps.savePostHistoryFn({
        event: t.event,
        attestation: t.attestation,
        acceptedRelays: r,
        relayHints: o
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
    const o = Dn(t.event), s = r ? await r(o.signerTemplate) : t.event;
    De(this.deps.authStateStore, t.sessionPubkey);
    let a;
    try {
      a = Ln(
        o.expectedTemplate,
        s,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    De(this.deps.authStateStore, t.sessionPubkey);
    const c = An(a);
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
    return Rn.validatePost(
      t,
      r.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, r, o = []) {
    let s = Hn(t);
    const a = this.deps.settingsStore.quoteNotificationEnabled, c = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      s,
      a
    ) ?? new Ae().extractInlineQuoteTags(
      s,
      a
    ), d = this.deps.replyQuoteState.value;
    if (d.quotes.length > 0) {
      const y = this.deps.replyQuoteService || new Ae(), x = new Set(
        c.filter((p) => p[0] === "q").map((p) => p[1])
      ), I = d.quotes.filter((p) => !x.has(p.eventId)).map(
        (p) => y.generateNostrUri(
          p.eventId,
          p.relayHints,
          p.authorPubkey
        )
      );
      I.length > 0 && (s = `${s.trimEnd()}
${I.join(`
`)}`.trim());
    }
    const f = this.validatePost(s);
    if (!f.valid)
      return this.notifyPostFailure(f.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    if (Nn() && je.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const y = this.deps.authStateStore, x = On(y), I = this.deps.hashtagStore, { hashtags: p, tags: C } = this.getHashtagArrays(I), M = this.deps.keyManager, L = this.deps.window || (typeof window < "u" ? window : void 0), G = this.deps.contentWarningStore.value, he = this.deps.contentWarningReasonStore.value, Z = this.deps.channelContextState?.value ?? null, J = Z?.channelRelays, U = this.deps.replyQuoteState.value;
      let l;
      const oe = this.getReplyQuoteNotifyOptions();
      if (U.reply || U.quotes.length > 0) {
        const E = this.deps.replyQuoteService || new Ae();
        l = [], U.reply && (Z ? (l.push([
          "e",
          U.reply.eventId,
          U.reply.relayHints[0] || "",
          "reply",
          ...U.reply.authorPubkey ? [U.reply.authorPubkey] : []
        ]), E.buildReplyTags(U.reply).filter((q) => q[0] === "p").forEach((q) => {
          l.push(q);
        })) : l.push(...E.buildReplyTags(U.reply)));
        const A = /* @__PURE__ */ new Set(), S = new Set(
          l.filter((q) => q[0] === "p").map((q) => q[1])
        );
        U.quotes.forEach((q) => {
          E.buildQuoteTags(q, q.quoteNotificationEnabled).forEach((z) => {
            if (z[0] === "q") {
              if (A.has(z[1]))
                return;
              A.add(z[1]);
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
        ), A = new Set(
          l.filter((S) => S[0] === "p").map((S) => S[1])
        );
        for (const S of c)
          S[0] === "q" && !E.has(S[1]) ? (l.push(S), E.add(S[1])) : S[0] === "p" && !A.has(S[1]) && (l.push(S), A.add(S[1]));
      }
      const K = y.value;
      if (K.type === "nip07" && M.isWindowNostrAvailable() && L?.nostr)
        try {
          const E = K.pubkey;
          if (!E)
            return this.notifyPostFailure("pubkey_not_found");
          const A = typeof L.nostr.signEvent == "function" ? L.nostr.signEvent.bind(L.nostr) : void 0;
          if (!A)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const S = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: C,
            pubkey: E,
            imageImetaMap: r,
            contentWarningEnabled: G,
            contentWarningReason: he,
            replyQuoteTags: l,
            channelContext: Z,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: x,
            hashtags: p,
            rqNotifyOptions: oe,
            signEvent: A,
            logSignedEvent: !0,
            additionalWriteRelays: J
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (K.type === "nip46")
        try {
          const E = K.pubkey;
          if (!E)
            return this.notifyPostFailure("pubkey_not_found");
          const A = await this.deps.getNip46SignerForSessionFn?.(E), S = this.deps.authStateStore.value;
          if (!A || !S.isAuthenticated || S.type !== "nip46" || S.pubkey !== E)
            return this.notifyPostFailure("nip46_signer_not_available");
          const q = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: C,
            pubkey: E,
            imageImetaMap: r,
            contentWarningEnabled: G,
            contentWarningReason: he,
            replyQuoteTags: l,
            channelContext: Z,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: q,
            sessionPubkey: x,
            hashtags: p,
            rqNotifyOptions: oe,
            signer: A,
            additionalWriteRelays: J
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (K.type === "parentClient") {
        const E = this.deps.getParentClientSignerFn?.();
        if (!E)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const A = K.pubkey;
        if (!A)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const S = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: C,
            pubkey: A,
            imageImetaMap: r,
            contentWarningEnabled: G,
            contentWarningReason: he,
            replyQuoteTags: l,
            channelContext: Z,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: x,
            hashtags: p,
            rqNotifyOptions: oe,
            signer: E,
            additionalWriteRelays: J
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const O = M.getFromStore() || M.loadFromStorage(K.pubkey);
      if (!O)
        return this.notifyPostFailure("key_not_found");
      const V = await this.buildSubmissionEvent({
        processedContent: s,
        hashtags: p,
        tags: C,
        imageImetaMap: r,
        contentWarningEnabled: G,
        contentWarningReason: he,
        replyQuoteTags: l,
        channelContext: Z,
        emojiTags: o
      }), te = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(O) : pt(O);
      return await this.sendPreparedEvent({
        event: V,
        sessionPubkey: x,
        hashtags: p,
        rqNotifyOptions: oe,
        signer: te,
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
    const r = t || this.deps.hashtagStore, o = this.deps.hashtagSnapshotFn;
    if (o) {
      const s = o(r);
      return {
        hashtags: Array.isArray(s?.hashtags) ? [...s.hashtags] : [],
        tags: Array.isArray(s?.tags) ? s.tags.map((a) => [...a]) : []
      };
    }
    if (r === ht)
      try {
        const s = Ft();
        return {
          hashtags: Array.isArray(s?.hashtags) ? [...s.hashtags] : [],
          tags: Array.isArray(s?.tags) ? s.tags.map((a) => [...a]) : []
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
      const o = this.deps.mediaGalleryStore.getContentUrls();
      if (o.length > 0) {
        const s = r.content.trim();
        return {
          content: s ? s + `
` + o.join(`
`) : o.join(`
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
  prepareImageBlurhashMap(t, r, o) {
    if (!this.deps.mediaFreePlacementStore.value)
      return this.deps.mediaGalleryStore.getImageBlurhashMap();
    const s = {};
    t?.state?.doc?.descendants?.((d) => {
      if (d.type?.name !== "image" || !d.attrs?.src || d.attrs?.isPlaceholder)
        return;
      const f = typeof d.attrs.size == "number" ? d.attrs.size : Number(d.attrs.size);
      s[d.attrs.src] = {
        dim: d.attrs.dim ?? void 0,
        alt: d.attrs.alt ?? void 0,
        size: Number.isFinite(f) && f > 0 ? f : void 0,
        uploadProtocol: d.attrs.uploadProtocol ?? void 0
      };
    });
    const a = this.deps.extractImageBlurhashMapFn(t), c = {};
    for (const [d, f] of Object.entries(a))
      c[d] = {
        m: Wn(d),
        blurhash: f,
        dim: s[d]?.dim,
        alt: s[d]?.alt,
        size: s[d]?.size,
        uploadProtocol: s[d]?.uploadProtocol,
        ox: r[d],
        x: o[d]
      };
    return c;
  }
  async performPostSubmission(t, r, o, s, a, c) {
    const d = this.preparePostPayload(t), f = this.prepareImageBlurhashMap(t, r, o);
    s?.();
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
    const r = this.deps.hashtagPinStore.value, o = r ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), r && o.length > 0) {
      const s = " " + o.map((a) => "#" + a).join(" ");
      t.commands.insertContent(s);
    }
    t.commands.focus("start");
  }
}
function Ir(n) {
  return !!n && n.length > 0;
}
function Mr(n, t, r) {
  n.isUploading = t, n.uploadErrorMessage = r || "";
}
function Tr(n) {
  const t = n.target;
  return t?.files?.length ? t.files : void 0;
}
function Dr({
  getCurrentEditor: n,
  getFileInput: t,
  getImageOxMap: r,
  getImageXMap: o,
  getUploadFailedText: s,
  updateUploadState: a,
  setUploadErrorMessage: c,
  uploadFiles: d
}) {
  const f = async (x) => Ir(x) ? await d({
    files: x,
    currentEditor: n(),
    fileInput: t(),
    updateUploadState: a,
    setUploadErrorMessage: c,
    imageOxMap: r(),
    imageXMap: o(),
    getUploadFailedText: s
  }) ?? null : null;
  return {
    performUpload: f,
    handleFileSelect: (x) => {
      const I = Tr(x);
      I && f(I);
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
function wt() {
  Ie !== void 0 && (clearTimeout(Ie), Ie = void 0);
}
const se = {
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
  showFloatingMessage: (n, t, r, o = 1800) => {
    wt(), N.floatingMessageX = n, N.floatingMessageY = t, N.floatingMessageText = r, N.showFloatingMessage = !0, Ie = setTimeout(
      () => {
        N.showFloatingMessage = !1, Ie = void 0;
      },
      o
    );
  },
  hideFloatingMessage: () => {
    wt(), N.showFloatingMessage = !1;
  }
};
var Lr = ge('<img draggable="false"/>'), Ar = ge('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), Rr = ge('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const Hr = {
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
function Mt(n, t) {
  Ye(t, !0), Ke(n, Hr);
  const r = () => Ge(Qe, "$_", o), [o, s] = Xe();
  let a = j(t, "item", 7), c = j(t, "index", 7), d = j(t, "onDelete", 7), f = j(t, "onDragStart", 7), y = j(t, "onDragOver", 7), x = j(t, "onDragEnd", 7), I = j(t, "onDrop", 7), p = j(t, "onTouchDragStart", 7), C = j(t, "disabled", 7, !1), M = X(void 0), L = X(void 0);
  const G = qn();
  zn(() => e(M), {
    onLongPress: (u, D) => {
      C() || p()?.(c(), u, D);
    }
  });
  let he = P(() => !a().isPlaceholder && a().type === "image" && !!a().src), Z = P(() => !a().isPlaceholder && a().type === "video" && !!a().src);
  const J = 180, U = 100, l = 180;
  let oe = P(() => {
    if (!a().isPlaceholder) return;
    const u = a().dimensions;
    if (u && u.width > 0 && u.height > 0) {
      const D = u.width / u.height, Q = Math.round(J * D);
      return `width: ${Math.max(U, Math.min(l, Q))}px; height: ${J}px;`;
    }
    return `width: ${l}px; height: ${J}px;`;
  });
  function K() {
    a().isPlaceholder || a().type !== "image" || se.showImageFullscreen(a().src, a().alt || "", a().id);
  }
  function H(u) {
    if (C()) {
      u.preventDefault();
      return;
    }
    if (e(M) && u.dataTransfer) {
      const D = e(M).getBoundingClientRect(), Q = u.clientX - D.left, $ = u.clientY - D.top;
      u.dataTransfer.setDragImage(e(M), Q, $);
    }
    f()(c(), u);
  }
  function O(u) {
    u.stopPropagation(), e(L) && (e(L).paused ? e(L).play() : e(L).pause());
  }
  function V(u) {
    u.preventDefault(), !C() && y()(c(), u);
  }
  function te(u) {
    u.preventDefault(), !C() && I()(c());
  }
  function E(u) {
    a().type !== "image" || a().isPlaceholder || (u.key === "Enter" || u.key === " " || u.key === "Spacebar") && (u.preventDefault(), K());
  }
  var A = {
    get item() {
      return a();
    },
    set item(u) {
      a(u), B();
    },
    get index() {
      return c();
    },
    set index(u) {
      c(u), B();
    },
    get onDelete() {
      return d();
    },
    set onDelete(u) {
      d(u), B();
    },
    get onDragStart() {
      return f();
    },
    set onDragStart(u) {
      f(u), B();
    },
    get onDragOver() {
      return y();
    },
    set onDragOver(u) {
      y(u), B();
    },
    get onDragEnd() {
      return x();
    },
    set onDragEnd(u) {
      x(u), B();
    },
    get onDrop() {
      return I();
    },
    set onDrop(u) {
      I(u), B();
    },
    get onTouchDragStart() {
      return p();
    },
    set onTouchDragStart(u) {
      p(u), B();
    },
    get disabled() {
      return C();
    },
    set disabled(u = !1) {
      C(u), B();
    }
  }, S = Rr();
  let q;
  var z = me(S), ye = me(z);
  {
    var v = (u) => {
      {
        let D = P(() => a().type === "video" ? r()("videoNode.uploading") : r()("imageNode.uploading"));
        jn(u, {
          get text() {
            return e(D);
          },
          showLoader: !0
        });
      }
    };
    ae(ye, (u) => {
      a().isPlaceholder && u(v);
    });
  }
  var g = ce(ye, 2);
  {
    var T = (u) => {
      var D = Lr();
      let Q;
      Se(() => {
        le(D, "src", a().src), le(D, "alt", a().alt || ""), Q = Ce(D, 1, "gallery-image svelte-aw59wn", null, Q, { "image-loading": !G.isLoaded });
      }), ve("load", D, function(...$) {
        G.handleLoad?.apply(this, $);
      }), ve("error", D, function(...$) {
        G.handleError?.apply(this, $);
      }), we("contextmenu", D, ($) => $.preventDefault()), Fr(D), de(u, D);
    };
    ae(g, (u) => {
      e(he) && u(T);
    });
  }
  var _ = ce(g, 2);
  {
    var k = (u) => {
      var D = Ar(), Q = me(D);
      Q.muted = !0, Fe(Q, (ne) => w(L, ne), () => e(L));
      var $ = ce(Q, 2);
      ue(D), Se(() => {
        le(Q, "src", a().src), le($, "draggable", !C());
      }), we("contextmenu", Q, (ne) => ne.preventDefault()), ve("dragstart", $, H), we("click", $, O), de(u, D);
    };
    ae(_, (u) => {
      e(Z) && u(k);
    });
  }
  ue(z);
  var W = ce(z, 2);
  {
    var R = (u) => {
      {
        let D = P(() => r()("imageContextMenu.delete")), Q = P(() => r()("imageContextMenu.copyUrl")), $ = P(() => r()("imageContextMenu.copySuccess"));
        Bn(u, {
          get src() {
            return a().src;
          },
          onDelete: () => d()(a().id),
          get deleteAriaLabel() {
            return e(D);
          },
          get copyAriaLabel() {
            return e(Q);
          },
          get copySuccessMessage() {
            return e($);
          },
          layout: "gallery",
          get deleteDisabled() {
            return C();
          }
        });
      }
    };
    ae(W, (u) => {
      a().isPlaceholder || u(R);
    });
  }
  ue(S), Fe(S, (u) => w(M, u), () => e(M)), Se(() => {
    q = Ce(S, 1, "gallery-item svelte-aw59wn", null, q, {
      "is-placeholder": a().isPlaceholder,
      "is-disabled": C()
    }), le(S, "draggable", !C() && (a().type !== "video" || a().isPlaceholder)), Ct(z, e(oe)), le(z, "role", a().type === "image" && !a().isPlaceholder ? "button" : void 0), le(z, "tabindex", a().type === "image" && !a().isPlaceholder ? 0 : void 0), le(z, "aria-label", a().alt || a().src);
  }), ve("dragstart", S, H), ve("dragover", S, V), ve("drop", S, te), ve("dragend", S, () => x()()), we("click", z, function(...u) {
    (a().type === "image" && !a().isPlaceholder ? K : void 0)?.apply(this, u);
  }), we("keydown", z, E), de(n, S);
  var pe = Ve(A);
  return s(), pe;
}
kt(["click", "keydown", "contextmenu"]);
$e(
  Mt,
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
function Or(n) {
  return Math.abs(n.deltaX) > Math.abs(n.deltaY) ? n.deltaX : n.deltaY;
}
function Wr(n, t) {
  const r = n.scrollHeight - n.clientHeight;
  if (r <= 1)
    return !1;
  const o = n.scrollTop <= 0, s = n.scrollTop >= r - 1;
  return t > 0 ? !s : t < 0 ? !o : !1;
}
function Nr(n, t) {
  const r = n.scrollWidth - n.clientWidth;
  if (r <= 1)
    return !1;
  const o = n.scrollLeft <= 0, s = n.scrollLeft >= r - 1;
  return t > 0 ? !s : t < 0 ? !o : !1;
}
function zr(n, t, r = null) {
  if (r && Wr(r, t.deltaY))
    return !1;
  const o = Or(t);
  if (!Nr(n, o))
    return !1;
  const s = Math.max(
    0,
    n.scrollWidth - n.clientWidth
  );
  return n.scrollLeft = Math.min(
    s,
    Math.max(0, n.scrollLeft + o)
  ), !0;
}
var jr = ge("<div><!></div>"), Br = ge('<div role="list"></div>');
const qr = {
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
function Tt(n, t) {
  Ye(t, !0), Ke(n, qr);
  const r = () => Ge(Qe, "$_", o), [o, s] = Xe();
  let a = X(-1), c = X(-1), d = X(-1), f = X(-1), y = null, x = 60, I = 60, p = X(void 0), C = null, M = P(() => ie.items), L = P(() => ee.postStatus.sending), G = P(() => {
    const v = e(a) !== -1 ? e(a) : e(d), g = e(a) !== -1 ? e(c) : e(f);
    return v === -1 || g === -1 || g === v || g === v + 1 ? -1 : g;
  });
  function he(v, g) {
    if (e(L)) {
      g.preventDefault();
      return;
    }
    w(a, v, !0), g.dataTransfer?.setData("text/plain", String(v)), g.dataTransfer && (g.dataTransfer.effectAllowed = "move");
  }
  function Z(v, g) {
    if (g.preventDefault(), e(L)) return;
    const _ = e(p)?.querySelectorAll(".gallery-item-wrapper")?.[v];
    if (_) {
      const k = _.getBoundingClientRect();
      w(c, g.clientX < k.left + k.width / 2 ? v : v + 1, !0);
    } else
      w(c, v, !0);
  }
  function J() {
    O(), w(a, -1), w(c, -1);
  }
  function U(v) {
  }
  function l(v) {
    if (e(a) === -1) return;
    if (v.preventDefault(), e(L)) {
      O(), w(c, -1);
      return;
    }
    const g = e(p)?.querySelectorAll(".gallery-item-wrapper");
    if (g && g.length > 0) {
      const T = g[0].getBoundingClientRect(), _ = g[g.length - 1].getBoundingClientRect();
      v.clientX < T.left ? w(c, 0) : v.clientX > _.right && w(c, e(M).length, !0);
    }
    if (e(p)) {
      const T = e(p).getBoundingClientRect();
      v.clientX - T.left < _e ? H("left", v.clientX) : T.right - v.clientX < _e ? H("right", v.clientX) : O();
    }
  }
  function oe(v) {
    if (v.preventDefault(), O(), e(L)) {
      w(a, -1), w(c, -1);
      return;
    }
    const g = e(c);
    if (e(a) !== -1 && g !== -1 && g !== e(a) && g !== e(a) + 1) {
      const T = e(a) < g ? g - 1 : g;
      ie.reorderItems(e(a), T);
    }
    w(a, -1), w(c, -1);
  }
  function K(v) {
    e(L) || ie.removeItem(v);
  }
  function H(v, g) {
    if (!e(p)) return;
    C !== null && (cancelAnimationFrame(C), C = null);
    const T = e(p).getBoundingClientRect(), _ = v === "left" ? g - T.left : T.right - g, k = Math.max(0, Math.min(1, _ / _e)), W = ft + (Kn - ft) * (1 - k), R = () => {
      if (!e(p)) return;
      const pe = e(p).scrollWidth - e(p).clientWidth;
      v === "left" && e(p).scrollLeft > 0 ? (e(p).scrollLeft = Math.max(0, e(p).scrollLeft - W), C = requestAnimationFrame(R)) : v === "right" && e(p).scrollLeft < pe ? (e(p).scrollLeft = Math.min(pe, e(p).scrollLeft + W), C = requestAnimationFrame(R)) : C = null;
    };
    C = requestAnimationFrame(R);
  }
  function O() {
    C !== null && (cancelAnimationFrame(C), C = null);
  }
  function V(v, g, T) {
    if (e(L)) return;
    w(d, v, !0), A();
    const _ = e(p)?.querySelectorAll(".gallery-item-wrapper")[v];
    if (_) {
      const k = _.getBoundingClientRect(), W = 120, R = Math.min(W / k.width, W / k.height);
      x = k.width * R / 2, I = k.height * R / 2, y = _.cloneNode(!0), y.style.cssText = `
                position: fixed;
                left: ${g - x}px;
                top: ${T - I}px;
                width: ${k.width}px;
                height: ${k.height}px;
                transform-origin: top left;
                transform: scale(${R});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, _r().overlayTarget.appendChild(y);
    }
    document.addEventListener("touchmove", te, { passive: !1 }), document.addEventListener("touchend", E, { passive: !1 });
  }
  function te(v) {
    if (e(d) === -1 || v.touches.length !== 1) return;
    if (v.preventDefault(), e(L)) {
      O(), w(f, -1);
      return;
    }
    const g = v.touches[0];
    y && (y.style.left = `${g.clientX - x}px`, y.style.top = `${g.clientY - I}px`), y && (y.style.display = "none");
    const T = document.elementFromPoint(g.clientX, g.clientY);
    y && (y.style.display = "");
    const _ = T?.closest(".gallery-item-wrapper");
    if (_ && e(p)) {
      const k = e(p).querySelectorAll(".gallery-item-wrapper"), W = Array.from(k).indexOf(_);
      if (W !== -1) {
        const R = _.getBoundingClientRect();
        w(f, g.clientX < R.left + R.width / 2 ? W : W + 1, !0);
      }
    } else if (e(p)) {
      const k = e(p).querySelectorAll(".gallery-item-wrapper");
      if (k.length > 0) {
        const W = k[0].getBoundingClientRect(), R = k[k.length - 1].getBoundingClientRect();
        g.clientX <= W.left ? w(f, 0) : g.clientX >= R.right && w(f, e(M).length, !0);
      }
    }
    if (e(p)) {
      const k = e(p).getBoundingClientRect();
      g.clientX - k.left < _e ? H("left", g.clientX) : k.right - g.clientX < _e ? H("right", g.clientX) : O();
    }
  }
  function E() {
    if (document.removeEventListener("touchmove", te), document.removeEventListener("touchend", E), O(), e(L)) {
      A(), w(d, -1), w(f, -1);
      return;
    }
    const v = e(f);
    if (e(d) !== -1 && v !== -1 && v !== e(d) && v !== e(d) + 1) {
      const g = e(d) < v ? v - 1 : v;
      ie.reorderItems(e(d), g);
    }
    A(), w(d, -1), w(f, -1);
  }
  function A() {
    y && (y.remove(), y = null);
  }
  function S(v) {
    if (!e(p)) return;
    const g = e(p).closest(".composer-scroll-region");
    zr(e(p), v, g instanceof HTMLElement ? g : null) && v.preventDefault();
  }
  fe(() => {
    if (e(p))
      return e(p).addEventListener("wheel", S, { passive: !1 }), () => {
        e(p)?.removeEventListener("wheel", S);
      };
  });
  var q = Cr(), z = It(q);
  {
    var ye = (v) => {
      var g = Br();
      let T;
      Un(g, 23, () => e(M), (_) => _.id, (_, k, W) => {
        var R = jr();
        let pe;
        var u = me(R);
        Mt(u, {
          get item() {
            return e(k);
          },
          get index() {
            return e(W);
          },
          onDelete: K,
          onDragStart: he,
          onDragOver: Z,
          onDragEnd: J,
          onDrop: U,
          onTouchDragStart: V,
          get disabled() {
            return e(L);
          }
        }), ue(R), Se(() => pe = Ce(R, 1, "gallery-item-wrapper svelte-w2vv8k", null, pe, {
          "insert-bar-left": e(G) === e(W),
          "insert-bar-right": e(G) === e(M).length && e(W) === e(M).length - 1
        })), de(_, R);
      }), ue(g), Fe(g, (_) => w(p, _), () => e(p)), Se(
        (_) => {
          T = Ce(g, 1, "media-gallery svelte-w2vv8k", null, T, { sending: e(L) }), le(g, "aria-label", _);
        },
        [() => r()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), ve("dragover", g, l), ve("drop", g, oe), de(v, g);
    };
    ae(z, (v) => {
      e(M).length > 0 && v(ye);
    });
  }
  de(n, q), Ve(), s();
}
$e(Tt, {}, [], [], { mode: "open" });
function Ue(n) {
  if (!n || !n.types) return !1;
  try {
    return Array.from(n.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function Dt(n) {
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
function Ur(n) {
  let t = X(!1);
  function r(a) {
    if (Me(n) || !Te(n)) {
      a.preventDefault(), w(t, !1), n.classList.remove("drag-over");
      return;
    }
    const c = a.dataTransfer, d = Ue(c);
    Dt(c) && !d ? (a.preventDefault(), e(t) || (w(t, !0), n.classList.add("drag-over"))) : e(t) && (w(t, !1), n.classList.remove("drag-over"));
  }
  function o(a) {
    e(t) && (w(t, !1), n.classList.remove("drag-over"));
  }
  async function s(a) {
    if (w(t, !1), n.classList.remove("drag-over"), Me(n) || !Te(n)) {
      a.preventDefault();
      return;
    }
    const c = a.dataTransfer;
    Ue(c) || c?.files && c.files.length > 0 && typeof n.__uploadFiles == "function" && (a.preventDefault(), n.__uploadFiles(c.files));
  }
  return n.addEventListener("dragover", r), n.addEventListener("dragleave", o), n.addEventListener("drop", s), {
    destroy() {
      n.removeEventListener("dragover", r), n.removeEventListener("dragleave", o), n.removeEventListener("drop", s);
    }
  };
}
function Kr(n, t) {
  const r = Ur(n);
  function o(c) {
    if (Me(n) || !Te(n)) {
      c.preventDefault(), t.dragOver(!1);
      return;
    }
    const d = c.dataTransfer, f = Ue(d);
    Dt(d) && !f ? t.dragOver(!0) : t.dragOver(!1);
  }
  function s(c) {
    t.dragOver(!1);
  }
  function a(c) {
    t.dragOver(!1), (Me(n) || !Te(n)) && c.preventDefault();
  }
  return n.addEventListener("dragover", o), n.addEventListener("dragleave", s), n.addEventListener("drop", a), {
    destroy() {
      r?.destroy?.(), n.removeEventListener("dragover", o), n.removeEventListener("dragleave", s), n.removeEventListener("drop", a);
    }
  };
}
function Xr(n) {
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
    const o = [];
    for (const s of r.clipboardData.items)
      if (s.kind === "file" && s.type.startsWith("image/")) {
        const a = s.getAsFile();
        a && o.push(a);
      }
    o.length > 0 && (r.preventDefault(), n.__uploadFiles?.(o));
  }
  return n.addEventListener("paste", t), {
    destroy() {
      n.removeEventListener("paste", t);
    }
  };
}
function Gr(n) {
  function t(o) {
    const s = o.target;
    if (s && (s.closest('.editor-image-button[data-dragging="true"]') || s.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const a = o.touches[0], c = 120, d = vt.querySelector(".tiptap-editor");
      if (d) {
        const f = d.getBoundingClientRect(), y = a.clientY < f.top + c, x = a.clientY > f.bottom - c;
        if (!y && !x)
          return o.preventDefault(), !1;
      }
    }
  }
  function r(o) {
    const s = vt.querySelectorAll(".drop-zone-indicator");
    s.forEach((a) => {
      a.classList.remove("drop-zone-hover"), a.classList.add("drop-zone-fade-out");
    }), setTimeout(
      () => {
        s.forEach((a) => {
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
function Qr(n) {
  function t(r) {
    if ((r.ctrlKey || r.metaKey) && (r.key === "Enter" || r.key === "NumpadEnter")) {
      r.preventDefault();
      const o = n.__currentEditor, s = typeof o == "function" ? o() : o, a = n.__hasPostingCapability, c = typeof a == "function" ? a() : a, d = n.__hasStoredKey, f = typeof d == "function" ? d() : d, y = n.__postStatus, x = typeof y == "function" ? y() : y, I = s ? Gn(s) : "";
      !x?.sending && I.trim() && (c ?? f) && n.__submitPost?.();
    }
  }
  return n.addEventListener("keydown", t), {
    destroy() {
      n.removeEventListener("keydown", t);
    }
  };
}
function $r(n) {
  let t = !1;
  return n?.descendants((r) => {
    if (t) return !1;
    const o = r.type?.name;
    (o === "image" || o === "video") && (t = !0);
  }), t;
}
function Yr(n) {
  const { currentEditor: t, editorContainerEl: r, callbacks: o } = n, s = (d) => {
    const y = d.detail.plainText, x = t ? $r(t.state?.doc) : !1;
    o.onContentUpdate?.(y, x);
  }, a = (d) => {
    const f = d;
    o.onImageFullscreenRequest?.(f.detail.src, f.detail.alt || "", f.detail.mediaId);
  }, c = (d) => {
    const y = d?.detail?.pos;
    if (y != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const x = Xn.create(t.state.doc, y);
        t.view.dispatch(t.state.tr.setSelection(x).scrollIntoView());
      } catch (x) {
        console.warn("select-image-node handler failed:", x);
      }
      o.onSelectImageNode?.(y);
    }
  };
  return window.addEventListener("editor-content-changed", s), window.addEventListener("image-fullscreen-request", a), window.addEventListener("select-image-node", c), r && (r.addEventListener("image-fullscreen-request", a), r.addEventListener("select-image-node", c)), {
    handleContentUpdate: s,
    handleImageFullscreenRequest: a,
    handleSelectImageNode: c
  };
}
function Vr(n, t) {
  window.removeEventListener("editor-content-changed", n.handleContentUpdate), window.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), window.removeEventListener("select-image-node", n.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), t.removeEventListener("select-image-node", n.handleSelectImageNode));
}
function Zr() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function Jr(n) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (n?.rejectedRelays?.length ?? 0) > 0 || (n?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function ei(n) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: n || "postComponent.post_error",
    completed: !1
  };
}
function ti({
  updatePostStatus: n,
  clearContentAfterSuccess: t,
  onPostSuccess: r
}) {
  return {
    markSending: () => {
      n(Zr());
    },
    markSuccess: (o) => {
      n(Jr(o)), t(), r?.(o);
    },
    markFailure: (o) => {
      n(ei(o));
    }
  };
}
async function ni(n) {
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
function St(n) {
  if (n.dimensions && n.dimensions.width > 0 && n.dimensions.height > 0)
    return {
      width: n.dimensions.width,
      height: n.dimensions.height
    };
  const t = Qn(n.dim);
  return t || {};
}
function ri(n) {
  if (!n.mediaFreePlacement)
    return n.galleryItems.filter((r) => !r.isPlaceholder).map((r) => {
      const o = St({
        dim: r.dim,
        dimensions: r.dimensions
      });
      return {
        id: r.id,
        src: r.src,
        alt: r.alt,
        type: r.type,
        dim: r.dim,
        width: o.width,
        height: o.height
      };
    });
  if (!n.currentEditor)
    return [];
  const t = [];
  return n.currentEditor.state.doc.descendants((r) => {
    if ((r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder) {
      const o = St({
        dim: r.attrs.dim
      });
      t.push({
        id: r.attrs.id,
        src: r.attrs.src,
        alt: r.attrs.alt,
        type: r.type.name,
        dim: r.attrs.dim,
        width: o.width,
        height: o.height
      });
    }
  }), t;
}
function ii(n, t, r) {
  if (t) {
    const o = n.findIndex((s) => s.id === t);
    if (o >= 0)
      return o;
  }
  return r ? n.findIndex((o) => o.src === r) : -1;
}
function ai(n, t) {
  return n[t];
}
function oi(n) {
  const t = [];
  return n.state.doc.descendants((r, o) => {
    (r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder && t.push({ node: r, pos: o });
  }), t;
}
function si(n) {
  const t = oi(n.currentEditor);
  if (t.length === 0)
    return !1;
  t.forEach(({ node: o }) => {
    const s = o.attrs.src;
    s && n.addGalleryItem({
      id: n.createMediaItemId(),
      type: o.type.name,
      src: s,
      isPlaceholder: !1,
      blurhash: o.attrs.blurhash ?? void 0,
      ox: n.imageOxMap[s] ?? void 0,
      x: n.imageXMap[s] ?? void 0,
      dim: o.attrs.dim ?? void 0,
      size: typeof o.attrs.size == "number" ? o.attrs.size : void 0,
      alt: o.attrs.alt ?? void 0,
      uploadProtocol: o.attrs.uploadProtocol ?? void 0
    });
  });
  let r = n.currentEditor.state.tr;
  return [...t].reverse().forEach(({ node: o, pos: s }) => {
    r = r.delete(s, s + o.nodeSize);
  }), n.currentEditor.view.dispatch(r), !0;
}
function li(n) {
  if (n.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = n.currentEditor.state;
  let r = n.currentEditor.state.tr, o = n.currentEditor.state.doc.content.size;
  const s = {}, a = {};
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
      r = r.insert(o, f), o += f.nodeSize;
    } else if (c.type === "video" && t.nodes.video) {
      const f = t.nodes.video.create({ src: d });
      r = r.insert(o, f), o += f.nodeSize;
    }
    c.ox && (s[d] = c.ox), c.x && (a[d] = c.x);
  }), n.currentEditor.view.dispatch(r), {
    imageOxMap: s,
    imageXMap: a,
    hadItems: !0
  };
}
async function ci(n) {
  const {
    input: t,
    postHistoryRepositoryImpl: r = _t,
    postMediaCacheRepositoryImpl: o = Yn
  } = n;
  await r.putPostedEvent(t);
  const s = $n(t.event).map((a) => a.url).filter(Boolean);
  s.length !== 0 && await o.linkEventIdByUrls({
    eventId: t.event.id,
    urls: s
  });
}
function di(n) {
  const {
    placeholderText: t,
    editorContainerEl: r,
    hasStoredKey: o,
    hasPostingCapability: s,
    submitPost: a,
    onCustomEmojiSelect: c,
    enterKeyBehavior: d,
    uploadFiles: f,
    eventCallbacks: y
  } = n;
  Vn.value = t;
  const x = Zn({
    placeholderText: t,
    onSubmitPost: a,
    onCustomEmojiSelect: c,
    enterKeyBehavior: d,
    onCreate: (M) => {
      He.set(M);
    }
  });
  let I = null;
  const p = x.subscribe((M) => {
    I = M;
  }), C = Yr({
    currentEditor: I,
    editorContainerEl: r,
    callbacks: y
  });
  return Jn(a), r && Object.assign(r, {
    __uploadFiles: f,
    __currentEditor: () => I,
    __hasStoredKey: () => o,
    __hasPostingCapability: () => s ?? o,
    __postStatus: () => ee.postStatus,
    __submitPost: a
  }), { editor: x, unsubscribe: p, handlers: C };
}
function ui(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: r,
    handlers: o,
    currentEditor: s,
    editorContainerEl: a,
    submitPost: c
  } = n;
  Vr(o, a), He.value === s && He.set(null), er(c), r(), t(), s && !s.isDestroyed && s.destroy(), a && (delete a.__uploadFiles, delete a.__currentEditor, delete a.__hasStoredKey, delete a.__hasPostingCapability, delete a.__postStatus, delete a.__submitPost);
}
function gi(n, t) {
  const r = n.view.dom;
  if (tr() && document.activeElement !== r) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
var hi = ge('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), pi = ge('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), fi = ge('<div class="upload-error svelte-15ticnd"> </div>'), vi = ge('<div class="svelte-15ticnd"> </div>'), mi = ge('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const yi = {
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
function wi(n, t) {
  Ye(t, !0), Ke(n, yi);
  const r = () => Ge(Qe, "$_", o), [o, s] = Xe();
  let a = j(t, "rxNostr", 7), c = j(t, "hasStoredKey", 7), d = j(t, "hasPostingCapability", 23, c), f = j(t, "isSwitchingAccount", 7, !1), y = j(t, "onPostSuccess", 7), x = j(t, "availableComposerHeight", 7, Pe), I = j(t, "minEditorHeight", 7, Pe), p = j(t, "onCustomEmojiSelect", 7), C = j(t, "notificationPort", 7), M = j(t, "hostOwnedConfig", 7), L = j(t, "hostCustomEmojiItems", 23, () => []), G = j(t, "normalUploadFiles", 7);
  const Z = !1;
  let J = P(() => !Z), U = X(null), l = X(null), oe = X(!1), K = X(void 0), H = X(void 0), O = X(Re({})), V = X(Re({})), te = P(() => Be.value), E = P(() => ee.postStatus), A = P(() => ee.uploadErrorMessage), S = P(() => Pr.value), q = P(() => fr.value), z = P(() => vr.value), ye = X(!0), v = P(() => c() && !f() && e(q) && !e(z) && e(ye)), g = null, T = null, _ = null, k = null, W = X(Re(Pe)), R = P(() => Z), pe = P(() => e(R) ? `--post-editor-auto-grow-min-lines: ${M().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${M().editorMaxLines}lh;` : `--post-editor-min-height: ${I()}px; --post-editor-target-height: ${e(W)}px;`), u = P(() => r()("postComponent.enter_your_text") || "テキストを入力してください");
  fe(() => {
    e(l), nr(e(u));
  }), fe(() => {
    const i = e(l), h = !e(E).sending;
    i && i.isEditable !== h && i.setEditable(h, !1);
  });
  function D() {
    if (e(R)) return;
    const i = I();
    if (!g || !T) {
      w(W, i, !0);
      return;
    }
    const h = Array.from(g.children).reduce(
      (m, F) => F === T ? m : m + yr(F),
      0
    ), b = wr({
      availableComposerHeight: x(),
      nonEditorHeight: h,
      minHeight: i
    });
    e(W) !== b && w(W, b, !0);
  }
  function Q(i) {
    if (e(E).sending) {
      i.preventDefault();
      return;
    }
    !(i.target instanceof HTMLElement) || !e(l) || pr(i.target) || e(l).commands.focus("end");
  }
  function $(i) {
    if (e(E).sending) {
      i.preventDefault();
      return;
    }
    !e(l) || i.currentTarget !== i.target || i.key !== "Enter" && i.key !== " " || (i.preventDefault(), e(l).commands.focus("end"));
  }
  let ne = P(() => se.value), Lt = P(() => e(ne).showSecretKeyDialog), Ze = P(() => e(ne).showImageFullscreen), At = P(() => e(ne).fullscreenMediaId), Je = P(() => e(ne).fullscreenImageSrc), Rt = P(() => e(ne).fullscreenImageAlt), et = P(() => e(ne).showFloatingMessage), Ht = P(() => e(ne).floatingMessageX), Ot = P(() => e(ne).floatingMessageY), Wt = P(() => e(ne).floatingMessageText);
  fe(() => {
    a() && (e(H) ? e(H).setRxNostr(a()) : w(
      H,
      new kr(a(), {
        getNip46SignerForSessionFn: (i) => ar.getSignerForSession(i),
        getParentClientSignerFn: () => ir.getSigner(),
        channelContextState: rr,
        replyQuoteState: xt,
        replyQuoteService: new Ae(),
        clearReplyQuoteFn: qe,
        savePostHistoryFn: (i) => ci({ input: i, postHistoryRepositoryImpl: _t }),
        notificationPort: C()
      }),
      !0
    ));
  });
  const Oe = Dr({
    getCurrentEditor: () => e(l),
    getFileInput: () => e(K),
    getImageOxMap: () => e(O),
    getImageXMap: () => e(V),
    getUploadFailedText: (i) => r()(i),
    updateUploadState: (i, h) => {
      Mr(ee, i, h);
    },
    setUploadErrorMessage: (i) => {
      ee.uploadErrorMessage = i;
    },
    uploadFiles: async (i) => {
      if (e(E).sending || ee.isUploading || Z)
        return null;
      {
        if (G()) return await G()(i);
        const { uploadFiles: h } = await import("./App-BXRUDZkJ.js").then((b) => b.eA);
        return await h(i);
      }
    }
  }), Ee = ti({
    updatePostStatus: mt,
    clearContentAfterSuccess: rt,
    onPostSuccess: (i) => y()?.(i)
  });
  fe(() => {
    if (e(R)) return;
    if (x(), I(), e(te), e(A), e(l), e(te) || ie.items.length, typeof window > "u") {
      w(W, Pe, !0);
      return;
    }
    const i = window.requestAnimationFrame(() => {
      D();
    });
    return () => {
      window.cancelAnimationFrame(i);
    };
  }), fe(() => {
    if (e(R) || (x(), I(), e(l), e(te), e(A), !g || typeof ResizeObserver > "u"))
      return;
    let i = null;
    const h = () => {
      i === null && (i = window.requestAnimationFrame(() => {
        i = null, D();
      }));
    }, b = new ResizeObserver(h);
    h(), b.observe(g);
    for (const m of Array.from(g.children))
      m !== T && b.observe(m);
    return () => {
      b.disconnect(), i !== null && window.cancelAnimationFrame(i);
    };
  }), or(() => {
    _ = di({
      placeholderText: e(u),
      editorContainerEl: T,
      currentEditor: e(l),
      hasStoredKey: c(),
      hasPostingCapability: d(),
      submitPost: Ne,
      onCustomEmojiSelect: p(),
      enterKeyBehavior: void 0,
      uploadFiles: e(J) ? (m) => {
        Oe.performUpload(m);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: mr,
        onImageFullscreenRequest: (m, F, Y) => {
          se.showImageFullscreen(m, F, Y || "");
        },
        onSelectImageNode: (m) => {
        }
      }
    }), w(U, _.editor, !0);
    let i = null;
    const h = ({ editor: m }) => {
      w(ye, m.isEmpty, !0);
    };
    k = e(U).subscribe((m) => {
      i && i.off("transaction", h), i = m, w(l, m, !0), w(ye, m?.isEmpty ?? !0, !0), m?.on("transaction", h), He.set(m);
    });
    const b = (m) => {
      const F = m, { src: Y, alt: be, mediaId: mn } = F.detail;
      se.showImageFullscreen(Y, be, mn || "");
    };
    return window.addEventListener("image-fullscreen-request", b), () => {
      window.removeEventListener("image-fullscreen-request", b), _ && (i && i.off("transaction", h), ui({
        unsubscribe: _.unsubscribe,
        componentUnsubscribe: k ?? (() => {
        }),
        handlers: _.handlers,
        currentEditor: e(l),
        editorContainerEl: T,
        submitPost: Ne
      }), k = null);
    };
  });
  const Nt = Oe.handleFileSelect;
  async function zt(i) {
    return await Oe.performUpload(i);
  }
  function jt(i) {
    if (!e(l) || !i) return;
    const h = e(
      l
      // nullチェック済みのローカル変数
    ), m = i.split(`
`).map((F) => ({
      type: "paragraph",
      content: F ? [{ type: "text", text: F }] : void 0
    }));
    h.commands.setContent({ type: "doc", content: m }), h.commands.focus("end");
  }
  function Bt(i) {
    if (!e(l) || !i) return !1;
    const b = i.split(`
`).map((m) => ({
      type: "paragraph",
      content: m ? [{ type: "text", text: m }] : void 0
    }));
    return e(l).isEmpty ? e(l).commands.setContent({ type: "doc", content: b }) : e(l).chain().focus("end").insertContent([{ type: "paragraph" }, ...b]).run(), e(l).commands.focus("end"), !0;
  }
  function qt(i) {
    if (!e(l) || !i) return;
    const h = lr(i);
    e(l).commands.setContent(h || "<p></p>"), e(l).commands.focus("end");
  }
  function Ut() {
    return e(l) ? e(l).getHTML() : "";
  }
  function Kt(i) {
    if (!e(l) || i.length === 0) return;
    const { schema: h } = e(l).state;
    let b = e(l).state.tr, m = e(l).state.doc.content.size;
    i.forEach((F) => {
      if (F.isPlaceholder) return;
      const Y = F.src;
      if (F.type === "image" && h.nodes.image) {
        const be = h.nodes.image.create({
          src: Y,
          alt: F.alt ?? "Image",
          blurhash: F.blurhash ?? null,
          dim: F.dim ?? null,
          size: F.size ?? null,
          uploadProtocol: F.uploadProtocol ?? null
        });
        b = b.insert(m, be), m += be.nodeSize, F.ox && w(O, { ...e(O), [Y]: F.ox }, !0), F.x && w(V, { ...e(V), [Y]: F.x }, !0);
      } else if (F.type === "video" && h.nodes.video) {
        const be = h.nodes.video.create({ src: Y });
        b = b.insert(m, be), m += be.nodeSize;
      }
    }), e(l).view.dispatch(b), e(l).commands.focus("end");
  }
  function Xt(i) {
    !e(l) || e(E).sending || gi(e(l), i);
  }
  function We() {
    if (!e(l)) return;
    gr(e(l).view.dom) || hr(e(l));
  }
  function tt(i) {
    if (!e(l) || e(E).sending) return;
    We();
    const { state: h, view: b } = e(l), m = i < 0 ? h.selection.from : h.selection.to, F = Math.max(0, Math.min(h.doc.content.size, m + i));
    if (F === m) return;
    const Y = ur.near(h.doc.resolve(F), i);
    b.dispatch(h.tr.setSelection(Y).scrollIntoView().setMeta("addToHistory", !1));
  }
  function Gt() {
    tt(-1);
  }
  function Qt() {
    tt(1);
  }
  function $t() {
    if (!e(l) || e(E).sending) return;
    We();
    const { state: i, view: h } = e(l), { selection: b } = i;
    if (!b.empty) {
      e(l).commands.deleteSelection();
      return;
    }
    const F = b.$from.nodeBefore;
    if (F) {
      const Y = F.isText ? Array.from(F.text ?? "").at(-1)?.length ?? 0 : F.nodeSize;
      Y > 0 && h.dispatch(i.tr.delete(b.from - Y, b.from).scrollIntoView());
      return;
    }
    e(l).commands.first(({ commands: Y }) => [
      () => Y.joinBackward(),
      () => Y.selectNodeBackward()
    ]);
  }
  function Yt() {
    !e(l) || e(E).sending || (We(), e(l).commands.keyboardShortcut("Enter"));
  }
  function nt() {
    return !!e(l) && ee.canPost && !e(E).sending && !ee.isUploading && !e(E).completed && (d() || !!e(H));
  }
  async function Ne() {
    if (!e(l) || !nt() || !e(H)) return;
    const i = e(H).preparePostPayload(e(l));
    if (cr(i.content)) {
      se.showSecretKeyDialog(i.content, i.emojiTags);
      return;
    }
    await e(H).performPostSubmission(e(l), e(O), e(V), Ee.markSending, Ee.markSuccess, Ee.markFailure);
  }
  function Vt() {
    e(H) && e(l) && e(H).resetPostContent(e(l));
  }
  function rt() {
    if (e(H) && e(l)) {
      e(H).clearContentAfterSuccess(e(l));
      return;
    }
    if (e(l)) {
      const i = M()?.hashtagPinEnabled === !0 && Pt.value ? [...Ft().hashtags] : [];
      e(l).chain().clearContent().run(), bt.reset(), Et.reset(), ie.clearAll(), w(O, {}, !0), w(V, {}, !0), qe(), i.length > 0 && e(l).commands.insertContent(` ${i.map((h) => `#${h}`).join(" ")}`), e(l).commands.focus("start");
    }
  }
  async function Zt() {
    if (!nt()) return;
    const i = se.getPendingPost(), h = se.getPendingEmojiTags();
    se.hideSecretKeyDialog(), e(H) && e(l) && await ni({
      postManager: e(H),
      currentEditor: e(l),
      imageOxMap: e(O),
      imageXMap: e(V),
      pendingPost: i,
      pendingEmojiTags: h,
      onStart: Ee.markSending,
      onSuccess: Ee.markSuccess,
      onFailure: Ee.markFailure
    });
  }
  const Jt = se.hideSecretKeyDialog, en = se.hideImageFullscreen;
  let ze = P(() => ri({
    mediaFreePlacement: e(te),
    galleryItems: ie.items,
    currentEditor: e(l)
  })), tn = P(() => ii(e(ze), e(At), e(Je)));
  function nn(i) {
    const h = ai(e(ze), i);
    h && se.showImageFullscreen(h.src, h.alt ?? "", h.id ?? "");
  }
  fe(() => {
    e(l) && e(H) && e(H).preparePostContent(e(l)) !== ee.content && e(E).error && mt({ ...e(E), error: !1, message: "" });
  });
  function rn() {
    !e(J) || e(E).sending || ee.isUploading || e(K)?.click();
  }
  fe(() => {
    const i = ie.items.some((m) => !m.isPlaceholder), h = !!ee.content.trim(), b = ee.hasImage;
    ee.canPost = h || b || i;
  });
  let it = !0;
  fe(() => {
    const i = !Be.value;
    if (it) {
      it = !1;
      return;
    }
    if (!e(l)) return;
    const h = e(l);
    if (i)
      ke(() => si({
        currentEditor: h,
        imageOxMap: e(O),
        imageXMap: e(V),
        addGalleryItem: (m) => ie.addItem(m),
        createMediaItemId: dr
      })) && ke(() => {
        w(O, {}, !0), w(V, {}, !0);
      });
    else {
      const b = ke(() => ie.getItems()), m = li({ currentEditor: h, items: b });
      m.hadItems && ke(() => {
        w(O, m.imageOxMap, !0), w(V, m.imageXMap, !0);
      }), ke(() => ie.clearAll());
    }
  });
  var an = {
    uploadFiles: zt,
    insertTextContent: jt,
    appendSharedTextContent: Bt,
    loadDraftContent: qt,
    getEditorHtml: Ut,
    appendMediaToEditor: Kt,
    insertCustomEmoji: Xt,
    moveCaretLeft: Gt,
    moveCaretRight: Qt,
    deleteBackward: $t,
    insertLineBreak: Yt,
    submitPost: Ne,
    resetPostContent: Vt,
    clearContentAfterSuccess: rt,
    openFileDialog: rn,
    get rxNostr() {
      return a();
    },
    set rxNostr(i) {
      a(i), B();
    },
    get hasStoredKey() {
      return c();
    },
    set hasStoredKey(i) {
      c(i), B();
    },
    get hasPostingCapability() {
      return d();
    },
    set hasPostingCapability(i = c) {
      d(i), B();
    },
    get isSwitchingAccount() {
      return f();
    },
    set isSwitchingAccount(i = !1) {
      f(i), B();
    },
    get onPostSuccess() {
      return y();
    },
    set onPostSuccess(i) {
      y(i), B();
    },
    get availableComposerHeight() {
      return x();
    },
    set availableComposerHeight(i = Pe) {
      x(i), B();
    },
    get minEditorHeight() {
      return I();
    },
    set minEditorHeight(i = Pe) {
      I(i), B();
    },
    get onCustomEmojiSelect() {
      return p();
    },
    set onCustomEmojiSelect(i) {
      p(i), B();
    },
    get notificationPort() {
      return C();
    },
    set notificationPort(i) {
      C(i), B();
    },
    get hostOwnedConfig() {
      return M();
    },
    set hostOwnedConfig(i) {
      M(i), B();
    },
    get hostCustomEmojiItems() {
      return L();
    },
    set hostCustomEmojiItems(i = []) {
      L(i), B();
    },
    get normalUploadFiles() {
      return G();
    },
    set normalUploadFiles(i) {
      G(i), B();
    }
  }, at = mi(), xe = It(at);
  let ot;
  var re = me(xe);
  let st;
  var lt = me(re);
  {
    var on = (i) => {
      var h = hi(), b = me(h);
      {
        let m = P(() => e(S)?.picture || "");
        Sr(b, {
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
      ue(h), de(i, h);
    };
    ae(lt, (i) => {
      e(v) && i(on);
    });
  }
  var sn = ce(lt, 2);
  {
    var ln = (i) => {
      br(i, {
        get editor() {
          return e(l);
        },
        class: "editor-content"
      });
    };
    ae(sn, (i) => {
      e(U) && e(l) && i(ln);
    });
  }
  ue(re), Le(re, (i, h) => Kr?.(i, h), () => ({ dragOver: (i) => w(oe, i, !0) })), Le(re, (i) => Xr?.(i)), Le(re, (i) => Gr?.(i)), Le(re, (i) => Qr?.(i)), Fe(re, (i) => T = i, () => T);
  var ct = ce(re, 2);
  {
    var cn = (i) => {
      Tt(i, {});
    };
    ae(ct, (i) => {
      e(te) || i(cn);
    });
  }
  var dt = ce(ct, 2);
  {
    var dn = (i) => {
      var h = pi();
      Fe(h, (b) => w(K, b), () => e(K)), we("change", h, Nt), de(i, h);
    };
    ae(dt, (i) => {
      e(J) && i(dn);
    });
  }
  var un = ce(dt, 2);
  {
    var gn = (i) => {
      var h = fi(), b = me(h, !0);
      ue(h), Se(() => yt(b, e(A))), de(i, h);
    };
    ae(un, (i) => {
      e(A) && i(gn);
    });
  }
  ue(xe), Fe(xe, (i) => g = i, () => g);
  var ut = ce(xe, 2);
  {
    var hn = (i) => {
      {
        let h = P(() => r()("postComponent.warning")), b = P(() => r()("postComponent.secret_key_detected")), m = P(() => r()("postComponent.post")), F = P(() => r()("postComponent.cancel"));
        Er(i, {
          get open() {
            return e(Lt);
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
          onConfirm: Zt,
          get onCancel() {
            return Jt;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    ae(ut, (i) => {
      i(hn);
    });
  }
  var gt = ce(ut, 2);
  sr(gt, {
    get src() {
      return e(Je);
    },
    get alt() {
      return e(Rt);
    },
    get onClose() {
      return en;
    },
    get mediaList() {
      return e(ze);
    },
    get currentIndex() {
      return e(tn);
    },
    onNavigate: nn,
    get show() {
      return e(Ze);
    },
    set show(i) {
      w(Ze, i);
    }
  });
  var pn = ce(gt, 2);
  {
    var fn = (i) => {
      xr(i, {
        get show() {
          return e(et);
        },
        get x() {
          return e(Ht);
        },
        get y() {
          return e(Ot);
        },
        children: (h, b) => {
          var m = vi(), F = me(m, !0);
          ue(m), Se(() => yt(F, e(Wt))), de(h, m);
        },
        $$slots: { default: !0 }
      });
    };
    ae(pn, (i) => {
      e(et) && i(fn);
    });
  }
  Se(
    (i) => {
      ot = Ce(xe, 1, "post-container svelte-15ticnd", null, ot, { "editor-auto-grow": e(R) }), Ct(xe, e(pe)), st = Ce(re, 1, "editor-container svelte-15ticnd", null, st, {
        "drag-over": e(oe),
        "gallery-mode": !e(te),
        sending: e(E).sending,
        "account-avatar-placeholder": e(v)
      }), le(re, "aria-label", i), le(re, "aria-disabled", e(E).sending ? "true" : void 0);
    },
    [() => r()("postComponent.editor_label")]
  ), we("click", re, Q), we("keydown", re, $), de(n, at);
  var vn = Ve(an);
  return s(), vn;
}
kt(["click", "keydown", "change"]);
$e(
  wi,
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
  wi as default
};
