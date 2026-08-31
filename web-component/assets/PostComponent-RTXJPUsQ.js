import { a as Mn, h as yt, m as Ue, b as ae, c as Ft, d as _t, k as Dn, e as Tn, s as Ln, w as An, r as kt, f as Rn, i as wt, j as Hn, l as On, n as Wn, o as zn, p as Nn, q as It, t as Bn, u as Ke, P as jn, v as qn, x as Ae, y as Un, z as Kn, A as Xn, B as Gn, C as Qn, R as He, D as $n, E as Mt, F as Yn, G as Vn, H as Ge, I as N, J as Zn, K as te, L as Ce, M as Fe, N as ge, O as Dt, Q as Qe, S as Jn, T as er, U as tr, V as $e, $ as Ye, W as nr, X as $, Y as ke, Z as bt, _ as rr, a0 as ir, a1 as St, a2 as or, a3 as ar, a4 as Tt, a5 as sr, a6 as lr, a7 as dr, a8 as cr, a9 as We, aa as ur, ab as gr, ac as hr, ad as Pe, ae as pr, af as fr, ag as vr, ah as mr, ai as yr, aj as Et, ak as Re, al as wr, am as br, an as Sr, ao as Er, ap as xr, aq as Pr, ar as Cr, as as Fr, at as _r, au as kr, av as Ir, aw as Mr, ax as Dr, ay as Tr, az as Lr, aA as Ar, aB as Rr, aC as Hr, aD as Or } from "./App-CBRbsegU.js";
import { bk as qe, aJ as Oe, aq as Lt, b6 as Ve, b0 as Ze, a as e, bf as oe, b, Z as Se, bC as he, ap as we, b3 as ne, b4 as Je, aS as Q, ba as se, b8 as fe, aR as E, b5 as B, bg as Wr, b9 as pe, aN as ye, b1 as zr, b2 as At, bl as Nr, u as Ie, bi as xt } from "./entry-wxgtzGEF.js";
class Br {
  constructor(t, r = {}) {
    this.deps = r, t && this.setRxNostr(t), this.deps.console = r.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = r.authStateStore || Mn, this.deps.hashtagStore = r.hashtagStore || yt, this.deps.mediaFreePlacementStore = r.mediaFreePlacementStore || Ue, this.deps.mediaGalleryStore = r.mediaGalleryStore || ae, this.deps.contentWarningStore = r.contentWarningStore || Ft, this.deps.contentWarningReasonStore = r.contentWarningReasonStore || _t, this.deps.keyManager = r.keyManager || Dn, this.deps.createImetaTagFn = r.createImetaTagFn || Tn, this.deps.settingsStore = r.settingsStore || Ln, this.deps.writeRelaysStore = r.writeRelaysStore || An, this.deps.replyQuoteState = r.replyQuoteState || kt, this.deps.getClientTagFn = r.getClientTagFn || (() => Rn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = r.seckeySignerFn || wt, this.deps.extractContentWithImagesFn = r.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = r.extractContentWithEmojiTagsFn || (r.extractContentWithImagesFn ? (a) => ({ content: r.extractContentWithImagesFn(a), emojiTags: [] }) : Hn), this.deps.extractImageBlurhashMapFn = r.extractImageBlurhashMapFn || On, this.deps.resetEditorStateFn = r.resetEditorStateFn || Wn, this.deps.resetPostStatusFn = r.resetPostStatusFn || zn, this.deps.notificationPort = r.iframeMessageService || r.notificationPort || Nn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = r.hashtagPinStore || It, this.deps.saveHashtagsToHistoryFn = r.saveHashtagsToHistoryFn || Bn, this.deps.clearReplyQuoteFn = r.clearReplyQuoteFn || Ke;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new jn(t, this.deps.console || console);
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
    return qn.buildEvent(
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
    const a = Un(t.event), s = r ? await r(a.signerTemplate) : t.event;
    Ae(this.deps.authStateStore, t.sessionPubkey);
    let o;
    try {
      o = Kn(
        a.expectedTemplate,
        s,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    Ae(this.deps.authStateStore, t.sessionPubkey);
    const l = Xn(o);
    if (!l)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: o?.kind ?? "(missing)"
    }), r && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), Ae(this.deps.authStateStore, t.sessionPubkey);
    const d = await this.eventSender.sendEvent(l.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: d.success
    });
    const f = d.success ? {
      ...d,
      eventId: d.eventId ?? l.event.id,
      event: l.event
    } : d;
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
    return Gn.validatePost(
      t,
      r.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, r, a = []) {
    let s = Qn(t);
    const o = this.deps.settingsStore.quoteNotificationEnabled, l = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      s,
      o
    ) ?? new He().extractInlineQuoteTags(
      s,
      o
    ), d = this.deps.replyQuoteState.value;
    if (d.quotes.length > 0) {
      const w = this.deps.replyQuoteService || new He(), F = new Set(
        l.filter((p) => p[0] === "q").map((p) => p[1])
      ), I = d.quotes.filter((p) => !F.has(p.eventId)).map(
        (p) => w.generateNostrUri(
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
    if (Vn() && qe.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const w = this.deps.authStateStore, F = $n(w), I = this.deps.hashtagStore, { hashtags: p, tags: _ } = this.getHashtagArrays(I), R = this.deps.keyManager, M = this.deps.window || (typeof window < "u" ? window : void 0), J = this.deps.contentWarningStore.value, ee = this.deps.contentWarningReasonStore.value, le = this.deps.channelContextState?.value ?? null, Y = le?.channelRelays, X = this.deps.replyQuoteState.value;
      let O;
      const de = this.getReplyQuoteNotifyOptions();
      if (X.reply || X.quotes.length > 0) {
        const x = this.deps.replyQuoteService || new He();
        O = [], X.reply && (le ? (O.push([
          "e",
          X.reply.eventId,
          X.reply.relayHints[0] || "",
          "reply",
          ...X.reply.authorPubkey ? [X.reply.authorPubkey] : []
        ]), x.buildReplyTags(X.reply).filter((H) => H[0] === "p").forEach((H) => {
          O.push(H);
        })) : O.push(...x.buildReplyTags(X.reply)));
        const k = /* @__PURE__ */ new Set(), m = new Set(
          O.filter((H) => H[0] === "p").map((H) => H[1])
        );
        X.quotes.forEach((H) => {
          x.buildQuoteTags(H, H.quoteNotificationEnabled).forEach((P) => {
            if (P[0] === "q") {
              if (k.has(P[1]))
                return;
              k.add(P[1]);
            }
            if (P[0] === "p") {
              if (m.has(P[1]))
                return;
              m.add(P[1]);
            }
            O.push(P);
          });
        });
      }
      if (l.length > 0) {
        O || (O = []);
        const x = new Set(
          O.filter((m) => m[0] === "q").map((m) => m[1])
        ), k = new Set(
          O.filter((m) => m[0] === "p").map((m) => m[1])
        );
        for (const m of l)
          m[0] === "q" && !x.has(m[1]) ? (O.push(m), x.add(m[1])) : m[0] === "p" && !k.has(m[1]) && (O.push(m), k.add(m[1]));
      }
      const G = w.value;
      if (G.type === "nip07" && R.isWindowNostrAvailable() && M?.nostr)
        try {
          const x = G.pubkey;
          if (!x)
            return this.notifyPostFailure("pubkey_not_found");
          const k = typeof M.nostr.signEvent == "function" ? M.nostr.signEvent.bind(M.nostr) : void 0;
          if (!k)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const m = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: _,
            pubkey: x,
            imageImetaMap: r,
            contentWarningEnabled: J,
            contentWarningReason: ee,
            replyQuoteTags: O,
            channelContext: le,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: m,
            sessionPubkey: F,
            hashtags: p,
            rqNotifyOptions: de,
            signEvent: k,
            logSignedEvent: !0,
            additionalWriteRelays: Y
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (G.type === "nip46")
        try {
          const x = G.pubkey;
          if (!x)
            return this.notifyPostFailure("pubkey_not_found");
          const k = await this.deps.getNip46SignerForSessionFn?.(x), m = this.deps.authStateStore.value;
          if (!k || !m.isAuthenticated || m.type !== "nip46" || m.pubkey !== x)
            return this.notifyPostFailure("nip46_signer_not_available");
          const H = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: _,
            pubkey: x,
            imageImetaMap: r,
            contentWarningEnabled: J,
            contentWarningReason: ee,
            replyQuoteTags: O,
            channelContext: le,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: H,
            sessionPubkey: F,
            hashtags: p,
            rqNotifyOptions: de,
            signer: k,
            additionalWriteRelays: Y
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (G.type === "parentClient") {
        const x = this.deps.getParentClientSignerFn?.();
        if (!x)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const k = G.pubkey;
        if (!k)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const m = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: p,
            tags: _,
            pubkey: k,
            imageImetaMap: r,
            contentWarningEnabled: J,
            contentWarningReason: ee,
            replyQuoteTags: O,
            channelContext: le,
            emojiTags: a
          });
          return await this.sendPreparedEvent({
            event: m,
            sessionPubkey: F,
            hashtags: p,
            rqNotifyOptions: de,
            signer: x,
            additionalWriteRelays: Y
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const c = R.getFromStore() || R.loadFromStorage(G.pubkey);
      if (!c)
        return this.notifyPostFailure("key_not_found");
      const be = await this.buildSubmissionEvent({
        processedContent: s,
        hashtags: p,
        tags: _,
        imageImetaMap: r,
        contentWarningEnabled: J,
        contentWarningReason: ee,
        replyQuoteTags: O,
        channelContext: le,
        emojiTags: a
      }), ce = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(c) : wt(c);
      return await this.sendPreparedEvent({
        event: be,
        sessionPubkey: F,
        hashtags: p,
        rqNotifyOptions: de,
        signer: ce,
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
    const o = this.deps.extractImageBlurhashMapFn(t), l = {};
    for (const [d, f] of Object.entries(o))
      l[d] = {
        m: Yn(d),
        blurhash: f,
        dim: s[d]?.dim,
        alt: s[d]?.alt,
        size: s[d]?.size,
        uploadProtocol: s[d]?.uploadProtocol,
        ox: r[d],
        x: a[d]
      };
    return l;
  }
  async performPostSubmission(t, r, a, s, o, l) {
    const d = this.preparePostPayload(t), f = this.prepareImageBlurhashMap(t, r, a);
    s?.();
    try {
      const w = await this.submitPost(d.content, f, d.emojiTags);
      w.success ? o?.(w) : l?.(w.error || "post_error");
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
function jr(n) {
  return !!n && n.length > 0;
}
function qr(n, t, r) {
  n.isUploading = t, n.uploadErrorMessage = r || "";
}
function Ur(n) {
  const t = n.target;
  return t?.files?.length ? t.files : void 0;
}
function Kr({
  getCurrentEditor: n,
  getFileInput: t,
  getImageOxMap: r,
  getImageXMap: a,
  getUploadFailedText: s,
  updateUploadState: o,
  setUploadErrorMessage: l,
  uploadFiles: d
}) {
  const f = async (F) => jr(F) ? await d({
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
      const I = Ur(F);
      I && f(I);
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
var Xr = se('<img draggable="false"/>'), Gr = se('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), Qr = se('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const $r = {
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
  Ze(t, !0), Ge(n, $r);
  const r = () => $e(Ye, "$_", a), [a, s] = Qe();
  let o = N(t, "item", 7), l = N(t, "index", 7), d = N(t, "onDelete", 7), f = N(t, "onDragStart", 7), w = N(t, "onDragOver", 7), F = N(t, "onDragEnd", 7), I = N(t, "onDrop", 7), p = N(t, "onTouchDragStart", 7), _ = N(t, "disabled", 7, !1), R = Q(void 0), M = Q(void 0);
  const J = tr();
  Zn(() => e(R), {
    onLongPress: (g, A) => {
      _() || p()?.(l(), g, A);
    }
  });
  let ee = E(() => !o().isPlaceholder && o().type === "image" && !!o().src), le = E(() => !o().isPlaceholder && o().type === "video" && !!o().src);
  const Y = 180, X = 100, O = 180;
  let de = E(() => {
    if (!o().isPlaceholder) return;
    const g = o().dimensions;
    if (g && g.width > 0 && g.height > 0) {
      const A = g.width / g.height, U = Math.round(Y * A);
      return `width: ${Math.max(X, Math.min(O, U))}px; height: ${Y}px;`;
    }
    return `width: ${O}px; height: ${Y}px;`;
  });
  function G() {
    o().isPlaceholder || o().type !== "image" || ue.showImageFullscreen(o().src, o().alt || "", o().id);
  }
  function re(g) {
    if (_()) {
      g.preventDefault();
      return;
    }
    if (e(R) && g.dataTransfer) {
      const A = e(R).getBoundingClientRect(), U = g.clientX - A.left, K = g.clientY - A.top;
      g.dataTransfer.setDragImage(e(R), U, K);
    }
    f()(l(), g);
  }
  function c(g) {
    g.stopPropagation(), e(M) && (e(M).paused ? e(M).play() : e(M).pause());
  }
  function be(g) {
    g.preventDefault(), !_() && w()(l(), g);
  }
  function ce(g) {
    g.preventDefault(), !_() && I()(l());
  }
  function x(g) {
    o().type !== "image" || o().isPlaceholder || (g.key === "Enter" || g.key === " " || g.key === "Spacebar") && (g.preventDefault(), G());
  }
  var k = {
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
      return d();
    },
    set onDelete(g) {
      d(g), B();
    },
    get onDragStart() {
      return f();
    },
    set onDragStart(g) {
      f(g), B();
    },
    get onDragOver() {
      return w();
    },
    set onDragOver(g) {
      w(g), B();
    },
    get onDragEnd() {
      return F();
    },
    set onDragEnd(g) {
      F(g), B();
    },
    get onDrop() {
      return I();
    },
    set onDrop(g) {
      I(g), B();
    },
    get onTouchDragStart() {
      return p();
    },
    set onTouchDragStart(g) {
      p(g), B();
    },
    get disabled() {
      return _();
    },
    set disabled(g = !1) {
      _(g), B();
    }
  }, m = Qr();
  let H;
  var P = fe(m), ve = fe(P);
  {
    var v = (g) => {
      {
        let A = E(() => o().type === "video" ? r()("videoNode.uploading") : r()("imageNode.uploading"));
        Jn(g, {
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
  var h = oe(ve, 2);
  {
    var j = (g) => {
      var A = Xr();
      let U;
      Se(() => {
        ge(A, "src", o().src), ge(A, "alt", o().alt || ""), U = Fe(A, 1, "gallery-image svelte-aw59wn", null, U, { "image-loading": !J.isLoaded });
      }), he("load", A, function(...K) {
        J.handleLoad?.apply(this, K);
      }), he("error", A, function(...K) {
        J.handleError?.apply(this, K);
      }), we("contextmenu", A, (K) => K.preventDefault()), Wr(A), ne(g, A);
    };
    te(h, (g) => {
      e(ee) && g(j);
    });
  }
  var D = oe(h, 2);
  {
    var T = (g) => {
      var A = Gr(), U = fe(A);
      U.muted = !0, Ce(U, (_e) => b(M, _e), () => e(M));
      var K = oe(U, 2);
      pe(A), Se(() => {
        ge(U, "src", o().src), ge(K, "draggable", !_());
      }), we("contextmenu", U, (_e) => _e.preventDefault()), he("dragstart", K, re), we("click", K, c), ne(g, A);
    };
    te(D, (g) => {
      e(le) && g(T);
    });
  }
  pe(P);
  var q = oe(P, 2);
  {
    var L = (g) => {
      {
        let A = E(() => r()("imageContextMenu.delete")), U = E(() => r()("imageContextMenu.copyUrl")), K = E(() => r()("imageContextMenu.copySuccess"));
        er(g, {
          get src() {
            return o().src;
          },
          onDelete: () => d()(o().id),
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
  pe(m), Ce(m, (g) => b(R, g), () => e(R)), Se(() => {
    H = Fe(m, 1, "gallery-item svelte-aw59wn", null, H, {
      "is-placeholder": o().isPlaceholder,
      "is-disabled": _()
    }), ge(m, "draggable", !_() && (o().type !== "video" || o().isPlaceholder)), Dt(P, e(de)), ge(P, "role", o().type === "image" && !o().isPlaceholder ? "button" : void 0), ge(P, "tabindex", o().type === "image" && !o().isPlaceholder ? 0 : void 0), ge(P, "aria-label", o().alt || o().src);
  }), he("dragstart", m, re), he("dragover", m, be), he("drop", m, ce), he("dragend", m, () => F()()), we("click", P, function(...g) {
    (o().type === "image" && !o().isPlaceholder ? G : void 0)?.apply(this, g);
  }), we("keydown", P, x), ne(n, m);
  var V = Je(k);
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
function Yr(n) {
  return Math.abs(n.deltaX) > Math.abs(n.deltaY) ? n.deltaX : n.deltaY;
}
function Vr(n, t) {
  const r = n.scrollHeight - n.clientHeight;
  if (r <= 1)
    return !1;
  const a = n.scrollTop <= 0, s = n.scrollTop >= r - 1;
  return t > 0 ? !s : t < 0 ? !a : !1;
}
function Zr(n, t) {
  const r = n.scrollWidth - n.clientWidth;
  if (r <= 1)
    return !1;
  const a = n.scrollLeft <= 0, s = n.scrollLeft >= r - 1;
  return t > 0 ? !s : t < 0 ? !a : !1;
}
function Jr(n, t, r = null) {
  if (r && Vr(r, t.deltaY))
    return !1;
  const a = Yr(t);
  if (!Zr(n, a))
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
var ei = se("<div><!></div>"), ti = se('<div role="list"></div>');
const ni = {
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
  Ze(t, !0), Ge(n, ni);
  const r = () => $e(Ye, "$_", a), [a, s] = Qe();
  let o = Q(-1), l = Q(-1), d = Q(-1), f = Q(-1), w = null, F = 60, I = 60, p = Q(void 0), _ = null, R = E(() => ae.items), M = E(() => $.postStatus.sending), J = E(() => {
    const v = e(o) !== -1 ? e(o) : e(d), h = e(o) !== -1 ? e(l) : e(f);
    return v === -1 || h === -1 || h === v || h === v + 1 ? -1 : h;
  });
  function ee(v, h) {
    if (e(M)) {
      h.preventDefault();
      return;
    }
    b(o, v, !0), h.dataTransfer?.setData("text/plain", String(v)), h.dataTransfer && (h.dataTransfer.effectAllowed = "move");
  }
  function le(v, h) {
    if (h.preventDefault(), e(M)) return;
    const D = e(p)?.querySelectorAll(".gallery-item-wrapper")?.[v];
    if (D) {
      const T = D.getBoundingClientRect();
      b(l, h.clientX < T.left + T.width / 2 ? v : v + 1, !0);
    } else
      b(l, v, !0);
  }
  function Y() {
    c(), b(o, -1), b(l, -1);
  }
  function X(v) {
  }
  function O(v) {
    if (e(o) === -1) return;
    if (v.preventDefault(), e(M)) {
      c(), b(l, -1);
      return;
    }
    const h = e(p)?.querySelectorAll(".gallery-item-wrapper");
    if (h && h.length > 0) {
      const j = h[0].getBoundingClientRect(), D = h[h.length - 1].getBoundingClientRect();
      v.clientX < j.left ? b(l, 0) : v.clientX > D.right && b(l, e(R).length, !0);
    }
    if (e(p)) {
      const j = e(p).getBoundingClientRect();
      v.clientX - j.left < ke ? re("left", v.clientX) : j.right - v.clientX < ke ? re("right", v.clientX) : c();
    }
  }
  function de(v) {
    if (v.preventDefault(), c(), e(M)) {
      b(o, -1), b(l, -1);
      return;
    }
    const h = e(l);
    if (e(o) !== -1 && h !== -1 && h !== e(o) && h !== e(o) + 1) {
      const j = e(o) < h ? h - 1 : h;
      ae.reorderItems(e(o), j);
    }
    b(o, -1), b(l, -1);
  }
  function G(v) {
    e(M) || ae.removeItem(v);
  }
  function re(v, h) {
    if (!e(p)) return;
    _ !== null && (cancelAnimationFrame(_), _ = null);
    const j = e(p).getBoundingClientRect(), D = v === "left" ? h - j.left : j.right - h, T = Math.max(0, Math.min(1, D / ke)), q = bt + (rr - bt) * (1 - T), L = () => {
      if (!e(p)) return;
      const V = e(p).scrollWidth - e(p).clientWidth;
      v === "left" && e(p).scrollLeft > 0 ? (e(p).scrollLeft = Math.max(0, e(p).scrollLeft - q), _ = requestAnimationFrame(L)) : v === "right" && e(p).scrollLeft < V ? (e(p).scrollLeft = Math.min(V, e(p).scrollLeft + q), _ = requestAnimationFrame(L)) : _ = null;
    };
    _ = requestAnimationFrame(L);
  }
  function c() {
    _ !== null && (cancelAnimationFrame(_), _ = null);
  }
  function be(v, h, j) {
    if (e(M)) return;
    b(d, v, !0), k();
    const D = e(p)?.querySelectorAll(".gallery-item-wrapper")[v];
    if (D) {
      const T = D.getBoundingClientRect(), q = 120, L = Math.min(q / T.width, q / T.height);
      F = T.width * L / 2, I = T.height * L / 2, w = D.cloneNode(!0), w.style.cssText = `
                position: fixed;
                left: ${h - F}px;
                top: ${j - I}px;
                width: ${T.width}px;
                height: ${T.height}px;
                transform-origin: top left;
                transform: scale(${L});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, Nr().overlayTarget.appendChild(w);
    }
    document.addEventListener("touchmove", ce, { passive: !1 }), document.addEventListener("touchend", x, { passive: !1 });
  }
  function ce(v) {
    if (e(d) === -1 || v.touches.length !== 1) return;
    if (v.preventDefault(), e(M)) {
      c(), b(f, -1);
      return;
    }
    const h = v.touches[0];
    w && (w.style.left = `${h.clientX - F}px`, w.style.top = `${h.clientY - I}px`), w && (w.style.display = "none");
    const j = document.elementFromPoint(h.clientX, h.clientY);
    w && (w.style.display = "");
    const D = j?.closest(".gallery-item-wrapper");
    if (D && e(p)) {
      const T = e(p).querySelectorAll(".gallery-item-wrapper"), q = Array.from(T).indexOf(D);
      if (q !== -1) {
        const L = D.getBoundingClientRect();
        b(f, h.clientX < L.left + L.width / 2 ? q : q + 1, !0);
      }
    } else if (e(p)) {
      const T = e(p).querySelectorAll(".gallery-item-wrapper");
      if (T.length > 0) {
        const q = T[0].getBoundingClientRect(), L = T[T.length - 1].getBoundingClientRect();
        h.clientX <= q.left ? b(f, 0) : h.clientX >= L.right && b(f, e(R).length, !0);
      }
    }
    if (e(p)) {
      const T = e(p).getBoundingClientRect();
      h.clientX - T.left < ke ? re("left", h.clientX) : T.right - h.clientX < ke ? re("right", h.clientX) : c();
    }
  }
  function x() {
    if (document.removeEventListener("touchmove", ce), document.removeEventListener("touchend", x), c(), e(M)) {
      k(), b(d, -1), b(f, -1);
      return;
    }
    const v = e(f);
    if (e(d) !== -1 && v !== -1 && v !== e(d) && v !== e(d) + 1) {
      const h = e(d) < v ? v - 1 : v;
      ae.reorderItems(e(d), h);
    }
    k(), b(d, -1), b(f, -1);
  }
  function k() {
    w && (w.remove(), w = null);
  }
  function m(v) {
    if (!e(p)) return;
    const h = e(p).closest(".composer-scroll-region");
    Jr(e(p), v, h instanceof HTMLElement ? h : null) && v.preventDefault();
  }
  ye(() => {
    if (e(p))
      return e(p).addEventListener("wheel", m, { passive: !1 }), () => {
        e(p)?.removeEventListener("wheel", m);
      };
  });
  var H = zr(), P = At(H);
  {
    var ve = (v) => {
      var h = ti();
      let j;
      nr(h, 23, () => e(R), (D) => D.id, (D, T, q) => {
        var L = ei();
        let V;
        var g = fe(L);
        Rt(g, {
          get item() {
            return e(T);
          },
          get index() {
            return e(q);
          },
          onDelete: G,
          onDragStart: ee,
          onDragOver: le,
          onDragEnd: Y,
          onDrop: X,
          onTouchDragStart: be,
          get disabled() {
            return e(M);
          }
        }), pe(L), Se(() => V = Fe(L, 1, "gallery-item-wrapper svelte-w2vv8k", null, V, {
          "insert-bar-left": e(J) === e(q),
          "insert-bar-right": e(J) === e(R).length && e(q) === e(R).length - 1
        })), ne(D, L);
      }), pe(h), Ce(h, (D) => b(p, D), () => e(p)), Se(
        (D) => {
          j = Fe(h, 1, "media-gallery svelte-w2vv8k", null, j, { sending: e(M) }), ge(h, "aria-label", D);
        },
        [() => r()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), he("dragover", h, O), he("drop", h, de), ne(v, h);
    };
    te(P, (v) => {
      e(R).length > 0 && v(ve);
    });
  }
  ne(n, H), Je(), s();
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
function ri(n) {
  let t = Q(!1);
  function r(o) {
    if (De(n) || !Te(n)) {
      o.preventDefault(), b(t, !1), n.classList.remove("drag-over");
      return;
    }
    const l = o.dataTransfer, d = Xe(l);
    Ot(l) && !d ? (o.preventDefault(), e(t) || (b(t, !0), n.classList.add("drag-over"))) : e(t) && (b(t, !1), n.classList.remove("drag-over"));
  }
  function a(o) {
    e(t) && (b(t, !1), n.classList.remove("drag-over"));
  }
  async function s(o) {
    if (b(t, !1), n.classList.remove("drag-over"), De(n) || !Te(n)) {
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
function ii(n, t) {
  const r = ri(n);
  function a(l) {
    if (De(n) || !Te(n)) {
      l.preventDefault(), t.dragOver(!1);
      return;
    }
    const d = l.dataTransfer, f = Xe(d);
    Ot(d) && !f ? t.dragOver(!0) : t.dragOver(!1);
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
function oi(n) {
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
function ai(n) {
  function t(a) {
    const s = a.target;
    if (s && (s.closest('.editor-image-button[data-dragging="true"]') || s.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const o = a.touches[0], l = 120, d = St.querySelector(".tiptap-editor");
      if (d) {
        const f = d.getBoundingClientRect(), w = o.clientY < f.top + l, F = o.clientY > f.bottom - l;
        if (!w && !F)
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
function si(n) {
  function t(r) {
    if ((r.ctrlKey || r.metaKey) && (r.key === "Enter" || r.key === "NumpadEnter")) {
      r.preventDefault();
      const a = n.__currentEditor, s = typeof a == "function" ? a() : a, o = n.__hasPostingCapability, l = typeof o == "function" ? o() : o, d = n.__hasStoredKey, f = typeof d == "function" ? d() : d, w = n.__postStatus, F = typeof w == "function" ? w() : w, I = s ? or(s) : "";
      !F?.sending && I.trim() && (l ?? f) && n.__submitPost?.();
    }
  }
  return n.addEventListener("keydown", t), {
    destroy() {
      n.removeEventListener("keydown", t);
    }
  };
}
function li(n) {
  let t = !1;
  return n?.descendants((r) => {
    if (t) return !1;
    const a = r.type?.name;
    (a === "image" || a === "video") && (t = !0);
  }), t;
}
function di(n) {
  const { currentEditor: t, editorContainerEl: r, callbacks: a } = n, s = (d) => {
    const w = d.detail.plainText, F = t ? li(t.state?.doc) : !1;
    a.onContentUpdate?.(w, F);
  }, o = (d) => {
    const f = d;
    a.onImageFullscreenRequest?.(f.detail.src, f.detail.alt || "", f.detail.mediaId);
  }, l = (d) => {
    const w = d?.detail?.pos;
    if (w != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const F = ir.create(t.state.doc, w);
        t.view.dispatch(t.state.tr.setSelection(F).scrollIntoView());
      } catch (F) {
        console.warn("select-image-node handler failed:", F);
      }
      a.onSelectImageNode?.(w);
    }
  };
  return window.addEventListener("editor-content-changed", s), window.addEventListener("image-fullscreen-request", o), window.addEventListener("select-image-node", l), r && (r.addEventListener("image-fullscreen-request", o), r.addEventListener("select-image-node", l)), {
    handleContentUpdate: s,
    handleImageFullscreenRequest: o,
    handleSelectImageNode: l
  };
}
function ci(n, t) {
  window.removeEventListener("editor-content-changed", n.handleContentUpdate), window.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), window.removeEventListener("select-image-node", n.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), t.removeEventListener("select-image-node", n.handleSelectImageNode));
}
function ui() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function gi(n) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (n?.rejectedRelays?.length ?? 0) > 0 || (n?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function hi(n) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: n || "postComponent.post_error",
    completed: !1
  };
}
function pi({
  updatePostStatus: n,
  clearContentAfterSuccess: t,
  onPostSuccess: r
}) {
  return {
    markSending: () => {
      n(ui());
    },
    markSuccess: (a) => {
      n(gi(a)), t(), r?.(a);
    },
    markFailure: (a) => {
      n(hi(a));
    }
  };
}
async function fi(n) {
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
  const t = ar(n.dim);
  return t || {};
}
function vi(n) {
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
function mi(n, t, r) {
  if (t) {
    const a = n.findIndex((s) => s.id === t);
    if (a >= 0)
      return a;
  }
  return r ? n.findIndex((a) => a.src === r) : -1;
}
function yi(n, t) {
  return n[t];
}
function wi(n) {
  const t = [];
  return n.state.doc.descendants((r, a) => {
    (r.type.name === "image" || r.type.name === "video") && !r.attrs.isPlaceholder && t.push({ node: r, pos: a });
  }), t;
}
function bi(n) {
  const t = wi(n.currentEditor);
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
function Si(n) {
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
    const d = l.src;
    if (l.type === "image" && t.nodes.image) {
      const f = t.nodes.image.create({
        src: d,
        alt: l.alt ?? "Image",
        blurhash: l.blurhash ?? null,
        dim: l.dim ?? null,
        size: l.size ?? null,
        uploadProtocol: l.uploadProtocol ?? null
      });
      r = r.insert(a, f), a += f.nodeSize;
    } else if (l.type === "video" && t.nodes.video) {
      const f = t.nodes.video.create({ src: d });
      r = r.insert(a, f), a += f.nodeSize;
    }
    l.ox && (s[d] = l.ox), l.x && (o[d] = l.x);
  }), n.currentEditor.view.dispatch(r), {
    imageOxMap: s,
    imageXMap: o,
    hadItems: !0
  };
}
async function Ei(n) {
  const {
    input: t,
    postHistoryRepositoryImpl: r = Tt,
    postMediaCacheRepositoryImpl: a = lr
  } = n;
  await r.putPostedEvent(t);
  const s = sr(t.event).map((o) => o.url).filter(Boolean);
  s.length !== 0 && await a.linkEventIdByUrls({
    eventId: t.event.id,
    urls: s
  });
}
function xi(n) {
  const {
    placeholderText: t,
    editorContainerEl: r,
    hasStoredKey: a,
    hasPostingCapability: s,
    submitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: d,
    uploadFiles: f,
    eventCallbacks: w
  } = n;
  dr.value = t;
  const F = cr({
    placeholderText: t,
    onSubmitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: d,
    onCreate: (R) => {
      We.set(R);
    }
  });
  let I = null;
  const p = F.subscribe((R) => {
    I = R;
  }), _ = di({
    currentEditor: I,
    editorContainerEl: r,
    callbacks: w
  });
  return ur(o), r && Object.assign(r, {
    __uploadFiles: f,
    __currentEditor: () => I,
    __hasStoredKey: () => a,
    __hasPostingCapability: () => s ?? a,
    __postStatus: () => $.postStatus,
    __submitPost: o
  }), { editor: F, unsubscribe: p, handlers: _ };
}
function Pi(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: r,
    handlers: a,
    currentEditor: s,
    editorContainerEl: o,
    submitPost: l
  } = n;
  ci(a, o), We.value === s && We.set(null), gr(l), r(), t(), s && !s.isDestroyed && s.destroy(), o && (delete o.__uploadFiles, delete o.__currentEditor, delete o.__hasStoredKey, delete o.__hasPostingCapability, delete o.__postStatus, delete o.__submitPost);
}
function Ci(n, t) {
  const r = n.view.dom;
  if (hr() && document.activeElement !== r) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
var Fi = se('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), _i = se('<div class="plane-icon svg-icon svelte-15ticnd"></div>'), ki = se('<div class="editor-submit-button-container svelte-15ticnd"><!></div>'), Ii = se('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), Mi = se('<div class="upload-error svelte-15ticnd"> </div>'), Di = se('<div class="svelte-15ticnd"> </div>'), Ti = se('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const Li = {
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
function Ai(n, t) {
  Ze(t, !0), Ge(n, Li);
  const r = () => $e(Ye, "$_", a), [a, s] = Qe();
  let o = N(t, "rxNostr", 7), l = N(t, "hasStoredKey", 7), d = N(t, "hasPostingCapability", 23, l), f = N(t, "isSwitchingAccount", 7, !1), w = N(t, "onPostSuccess", 7), F = N(t, "availableComposerHeight", 7, Pe), I = N(t, "minEditorHeight", 7, Pe), p = N(t, "onCustomEmojiSelect", 7), _ = N(t, "onEditorEmptyChange", 7), R = N(t, "notificationPort", 7), M = N(t, "hostOwnedConfig", 7), J = N(t, "hostCustomEmojiItems", 23, () => []), ee = N(t, "normalUploadFiles", 7);
  const Y = !1;
  let X = E(() => !Y), O = E(() => $.isUploading), de = E(() => $.canPost), G = E(() => Y), re = Q(null), c = Q(null), be = Q(!1), ce = Q(void 0), x = Q(void 0), k = Q(Oe({})), m = Q(Oe({})), H = E(() => Ue.value), P = E(() => $.postStatus), ve = E(() => $.uploadErrorMessage), v = E(() => Or.value), h = E(() => _r.value), j = E(() => kr.value), D = Q(!0), T = !1, q = E(() => l() && !f() && e(h) && !e(j) && e(D)), L = null, V = null, g = null, A = null, U = Q(Oe(Pe)), K = E(() => Y), _e = E(() => e(K) ? `--post-editor-auto-grow-min-lines: ${M().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${M().editorMaxLines}lh;` : `--post-editor-min-height: ${I()}px; --post-editor-target-height: ${e(U)}px;`), et = E(() => r()("postComponent.enter_your_text") || "テキストを入力してください");
  ye(() => {
    e(c), pr(e(et));
  }), ye(() => {
    const i = e(c), u = !e(P).sending || e(G);
    i && i.isEditable !== u && i.setEditable(u, !1);
  });
  function tt() {
    if (e(K)) return;
    const i = I();
    if (!L || !V) {
      b(U, i, !0);
      return;
    }
    const u = Array.from(L.children).reduce(
      (C, y) => y === V ? C : C + Mr(y),
      0
    ), S = Dr({
      availableComposerHeight: F(),
      nonEditorHeight: u,
      minHeight: i
    });
    e(U) !== S && b(U, S, !0);
  }
  function Wt(i) {
    if (e(P).sending) {
      i.preventDefault();
      return;
    }
    !(i.target instanceof HTMLElement) || !e(c) || Fr(i.target) || e(c).commands.focus("end");
  }
  function zt(i) {
    !e(c) || i.currentTarget !== i.target || i.key !== "Enter" && i.key !== " " || (i.preventDefault(), e(c).commands.focus("end"));
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
    const u = e(c)?.view.dom;
    !e(G) || !u || i.relatedTarget !== u || u.focus({ preventScroll: !0 });
  }
  let me = E(() => ue.value), Ut = E(() => e(me).showSecretKeyDialog), nt = E(() => e(me).showImageFullscreen), Kt = E(() => e(me).fullscreenMediaId), rt = E(() => e(me).fullscreenImageSrc), Xt = E(() => e(me).fullscreenImageAlt), it = E(() => e(me).showFloatingMessage), Gt = E(() => e(me).floatingMessageX), Qt = E(() => e(me).floatingMessageY), $t = E(() => e(me).floatingMessageText);
  ye(() => {
    o() && (e(x) ? e(x).setRxNostr(o()) : b(
      x,
      new Br(o(), {
        getNip46SignerForSessionFn: (i) => mr.getSignerForSession(i),
        getParentClientSignerFn: () => vr.getSigner(),
        channelContextState: fr,
        replyQuoteState: kt,
        replyQuoteService: new He(),
        clearReplyQuoteFn: Ke,
        savePostHistoryFn: (i) => Ei({ input: i, postHistoryRepositoryImpl: Tt }),
        notificationPort: R()
      }),
      !0
    ));
  });
  const ze = Kr({
    getCurrentEditor: () => e(c),
    getFileInput: () => e(ce),
    getImageOxMap: () => e(k),
    getImageXMap: () => e(m),
    getUploadFailedText: (i) => r()(i),
    updateUploadState: (i, u) => {
      qr($, i, u);
    },
    setUploadErrorMessage: (i) => {
      $.uploadErrorMessage = i;
    },
    uploadFiles: async (i) => {
      if (e(P).sending || $.isUploading || Y)
        return null;
      {
        if (ee()) return await ee()(i);
        const { uploadFiles: u } = await import("./App-CBRbsegU.js").then((S) => S.eB);
        return await u(i);
      }
    }
  }), Ee = pi({
    updatePostStatus: Et,
    clearContentAfterSuccess: st,
    onPostSuccess: (i) => w()?.(i)
  });
  ye(() => {
    if (e(K)) return;
    if (F(), I(), e(H), e(ve), e(c), e(H) || ae.items.length, typeof window > "u") {
      b(U, Pe, !0);
      return;
    }
    const i = window.requestAnimationFrame(() => {
      tt();
    });
    return () => {
      window.cancelAnimationFrame(i);
    };
  }), ye(() => {
    if (e(K) || (F(), I(), e(c), e(H), e(ve), !L || typeof ResizeObserver > "u"))
      return;
    let i = null;
    const u = () => {
      i === null && (i = window.requestAnimationFrame(() => {
        i = null, tt();
      }));
    }, S = new ResizeObserver(u);
    u(), S.observe(L);
    for (const C of Array.from(L.children))
      C !== V && S.observe(C);
    return () => {
      S.disconnect(), i !== null && window.cancelAnimationFrame(i);
    };
  }), yr(() => {
    g = xi({
      placeholderText: e(et),
      editorContainerEl: V,
      currentEditor: e(c),
      hasStoredKey: l(),
      hasPostingCapability: d(),
      submitPost: Le,
      onCustomEmojiSelect: p(),
      enterKeyBehavior: void 0,
      uploadFiles: e(X) ? (y) => {
        ze.performUpload(y);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: Ir,
        onImageFullscreenRequest: (y, z, ie) => {
          ue.showImageFullscreen(y, z, ie || "");
        },
        onSelectImageNode: (y) => {
        }
      }
    }), b(re, g.editor, !0);
    let i = null;
    const u = (y) => {
      const z = y.isEmpty, ie = !T || e(D) !== z;
      b(D, z, !0), T = !0, ie && _()?.(z);
    }, S = ({ editor: y }) => {
      u(y);
    };
    A = e(re).subscribe((y) => {
      i && i.off("transaction", S), i = y, b(c, y, !0), y && u(y), y?.on("transaction", S), We.set(y);
    });
    const C = (y) => {
      const z = y, { src: ie, alt: je, mediaId: In } = z.detail;
      ue.showImageFullscreen(ie, je, In || "");
    };
    return window.addEventListener("image-fullscreen-request", C), () => {
      window.removeEventListener("image-fullscreen-request", C), g && (i && i.off("transaction", S), Pi({
        unsubscribe: g.unsubscribe,
        componentUnsubscribe: A ?? (() => {
        }),
        handlers: g.handlers,
        currentEditor: e(c),
        editorContainerEl: V,
        submitPost: Le
      }), A = null);
    };
  });
  const Yt = ze.handleFileSelect;
  async function Vt(i) {
    return await ze.performUpload(i);
  }
  function Zt(i) {
    if (!e(c) || !i) return;
    const u = e(
      c
      // nullチェック済みのローカル変数
    ), C = i.split(`
`).map((y) => ({
      type: "paragraph",
      content: y ? [{ type: "text", text: y }] : void 0
    }));
    u.commands.setContent({ type: "doc", content: C }), u.commands.focus("end");
  }
  function Jt(i) {
    if (!e(c) || !i) return !1;
    const S = i.split(`
`).map((C) => ({
      type: "paragraph",
      content: C ? [{ type: "text", text: C }] : void 0
    }));
    return e(c).isEmpty ? e(c).commands.setContent({ type: "doc", content: S }) : e(c).chain().focus("end").insertContent([{ type: "paragraph" }, ...S]).run(), e(c).commands.focus("end"), !0;
  }
  function en(i) {
    if (!e(c) || !i) return;
    const u = br(i);
    e(c).commands.setContent(u || "<p></p>"), e(c).commands.focus("end");
  }
  function tn() {
    return e(c) ? e(c).getHTML() : "";
  }
  function nn(i) {
    if (!e(c) || i.length === 0) return;
    const { schema: u } = e(c).state;
    let S = e(c).state.tr, C = e(c).state.doc.content.size;
    i.forEach((y) => {
      if (y.isPlaceholder) return;
      const z = y.src;
      if (y.type === "image" && u.nodes.image) {
        const ie = u.nodes.image.create({
          src: z,
          alt: y.alt ?? "Image",
          blurhash: y.blurhash ?? null,
          dim: y.dim ?? null,
          size: y.size ?? null,
          uploadProtocol: y.uploadProtocol ?? null
        });
        S = S.insert(C, ie), C += ie.nodeSize, y.ox && b(k, { ...e(k), [z]: y.ox }, !0), y.x && b(m, { ...e(m), [z]: y.x }, !0);
      } else if (y.type === "video" && u.nodes.video) {
        const ie = u.nodes.video.create({ src: z });
        S = S.insert(C, ie), C += ie.nodeSize;
      }
    }), e(c).view.dispatch(S), e(c).commands.focus("end");
  }
  function rn(i) {
    !e(c) || e(P).sending || Ci(e(c), i);
  }
  function Ne() {
    if (!e(c)) return;
    Pr(e(c).view.dom) || Cr(e(c));
  }
  function ot(i) {
    if (!e(c) || e(P).sending) return;
    Ne();
    const { state: u, view: S } = e(c), C = i < 0 ? u.selection.from : u.selection.to, y = Math.max(0, Math.min(u.doc.content.size, C + i));
    if (y === C) return;
    const z = xr.near(u.doc.resolve(y), i);
    S.dispatch(u.tr.setSelection(z).scrollIntoView().setMeta("addToHistory", !1));
  }
  function on() {
    ot(-1);
  }
  function an() {
    ot(1);
  }
  function sn() {
    if (!e(c) || e(P).sending) return;
    Ne();
    const { state: i, view: u } = e(c), { selection: S } = i;
    if (!S.empty) {
      e(c).commands.deleteSelection();
      return;
    }
    const y = S.$from.nodeBefore;
    if (y) {
      const z = y.isText ? Array.from(y.text ?? "").at(-1)?.length ?? 0 : y.nodeSize;
      z > 0 && u.dispatch(i.tr.delete(S.from - z, S.from).scrollIntoView());
      return;
    }
    e(c).commands.first(({ commands: z }) => [
      () => z.joinBackward(),
      () => z.selectNodeBackward()
    ]);
  }
  function ln() {
    !e(c) || e(P).sending || (Ne(), e(c).commands.keyboardShortcut("Enter"));
  }
  function at() {
    return !!e(c) && $.canPost && !e(P).sending && !$.isUploading && !e(P).completed && (d() || !!e(x));
  }
  async function Le() {
    if (!e(c) || !at() || !e(x)) return;
    const i = e(x).preparePostPayload(e(c));
    if (Sr(i.content)) {
      ue.showSecretKeyDialog(i.content, i.emojiTags);
      return;
    }
    await e(x).performPostSubmission(e(c), e(k), e(m), Ee.markSending, Ee.markSuccess, Ee.markFailure);
  }
  function dn() {
    if (e(c)) {
      if (e(x)) {
        e(x).resetPostContent(e(c));
        return;
      }
      e(c).chain().clearContent().run();
    }
  }
  function st() {
    if (e(x) && e(c)) {
      e(x).clearContentAfterSuccess(e(c));
      return;
    }
    if (e(c)) {
      const i = M()?.hashtagPinEnabled === !0 && It.value ? [...Mt().hashtags] : [];
      e(c).chain().clearContent().run(), Ft.reset(), _t.reset(), ae.clearAll(), b(k, {}, !0), b(m, {}, !0), Ke(), i.length > 0 && e(c).commands.insertContent(` ${i.map((u) => `#${u}`).join(" ")}`), e(c).commands.focus("start");
    }
  }
  async function cn() {
    if (!at()) return;
    const i = ue.getPendingPost(), u = ue.getPendingEmojiTags();
    ue.hideSecretKeyDialog(), e(x) && e(c) && await fi({
      postManager: e(x),
      currentEditor: e(c),
      imageOxMap: e(k),
      imageXMap: e(m),
      pendingPost: i,
      pendingEmojiTags: u,
      onStart: Ee.markSending,
      onSuccess: Ee.markSuccess,
      onFailure: Ee.markFailure
    });
  }
  const un = ue.hideSecretKeyDialog, gn = ue.hideImageFullscreen;
  let Be = E(() => vi({
    mediaFreePlacement: e(H),
    galleryItems: ae.items,
    currentEditor: e(c)
  })), hn = E(() => mi(e(Be), e(Kt), e(rt)));
  function pn(i) {
    const u = yi(e(Be), i);
    u && ue.showImageFullscreen(u.src, u.alt ?? "", u.id ?? "");
  }
  ye(() => {
    e(c) && e(x) && e(x).preparePostContent(e(c)) !== $.content && e(P).error && Et({ ...e(P), error: !1, message: "" });
  });
  function fn() {
    !e(X) || e(P).sending || $.isUploading || e(ce)?.click();
  }
  ye(() => {
    const i = ae.items.some((C) => !C.isPlaceholder), u = !!$.content.trim(), S = $.hasImage;
    $.canPost = u || S || i;
  });
  let lt = !0;
  ye(() => {
    const i = !Ue.value;
    if (lt) {
      lt = !1;
      return;
    }
    if (!e(c)) return;
    const u = e(c);
    if (i)
      Ie(() => bi({
        currentEditor: u,
        imageOxMap: e(k),
        imageXMap: e(m),
        addGalleryItem: (C) => ae.addItem(C),
        createMediaItemId: Er
      })) && Ie(() => {
        b(k, {}, !0), b(m, {}, !0);
      });
    else {
      const S = Ie(() => ae.getItems()), C = Si({ currentEditor: u, items: S });
      C.hadItems && Ie(() => {
        b(k, C.imageOxMap, !0), b(m, C.imageXMap, !0);
      }), Ie(() => ae.clearAll());
    }
  });
  var vn = {
    uploadFiles: Vt,
    insertTextContent: Zt,
    appendSharedTextContent: Jt,
    loadDraftContent: en,
    getEditorHtml: tn,
    appendMediaToEditor: nn,
    insertCustomEmoji: rn,
    moveCaretLeft: on,
    moveCaretRight: an,
    deleteBackward: sn,
    insertLineBreak: ln,
    submitPost: Le,
    resetPostContent: dn,
    clearContentAfterSuccess: st,
    openFileDialog: fn,
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
      return d();
    },
    set hasPostingCapability(i = l) {
      d(i), B();
    },
    get isSwitchingAccount() {
      return f();
    },
    set isSwitchingAccount(i = !1) {
      f(i), B();
    },
    get onPostSuccess() {
      return w();
    },
    set onPostSuccess(i) {
      w(i), B();
    },
    get availableComposerHeight() {
      return F();
    },
    set availableComposerHeight(i = Pe) {
      F(i), B();
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
    get onEditorEmptyChange() {
      return _();
    },
    set onEditorEmptyChange(i) {
      _(i), B();
    },
    get notificationPort() {
      return R();
    },
    set notificationPort(i) {
      R(i), B();
    },
    get hostOwnedConfig() {
      return M();
    },
    set hostOwnedConfig(i) {
      M(i), B();
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
  }, dt = Ti(), xe = At(dt);
  let ct;
  var Z = fe(xe);
  let ut;
  var gt = fe(Z);
  {
    var mn = (i) => {
      var u = Fi(), S = fe(u);
      {
        let C = E(() => e(v)?.picture || "");
        Tr(S, {
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
      pe(u), ne(i, u);
    };
    te(gt, (i) => {
      e(q) && i(mn);
    });
  }
  var ht = oe(gt, 2);
  {
    var yn = (i) => {
      Lr(i, {
        get editor() {
          return e(c);
        },
        class: "editor-content"
      });
    };
    te(ht, (i) => {
      e(re) && e(c) && i(yn);
    });
  }
  var wn = oe(ht, 2);
  {
    var bn = (i) => {
      var u = ki(), S = fe(u);
      {
        let C = E(() => !e(de) || e(P).sending || e(O) || !d() || e(P).completed), y = E(() => r()("postComponent.post"));
        Ar(S, {
          variant: "primary",
          shape: "circle",
          contentLayout: "icon",
          className: "editor-submit-button",
          get disabled() {
            return e(C);
          },
          onClick: () => {
            !e(de) || e(P).sending || e(O) || !d() || e(P).completed || Le();
          },
          onfocus: qt,
          get ariaLabel() {
            return e(y);
          },
          children: (z, ie) => {
            var je = _i();
            ne(z, je);
          },
          $$slots: { default: !0 }
        });
      }
      pe(u), he("pointerdown", u, jt, !0), ne(i, u);
    };
    te(wn, (i) => {
      e(G) && i(bn);
    });
  }
  pe(Z), Re(Z, (i, u) => ii?.(i, u), () => ({ dragOver: (i) => b(be, i, !0) })), Re(Z, (i) => oi?.(i)), Re(Z, (i) => ai?.(i)), Re(Z, (i) => si?.(i)), Ce(Z, (i) => V = i, () => V);
  var pt = oe(Z, 2);
  {
    var Sn = (i) => {
      Ht(i, {});
    };
    te(pt, (i) => {
      e(H) || i(Sn);
    });
  }
  var ft = oe(pt, 2);
  {
    var En = (i) => {
      var u = Ii();
      Ce(u, (S) => b(ce, S), () => e(ce)), we("change", u, Yt), ne(i, u);
    };
    te(ft, (i) => {
      e(X) && i(En);
    });
  }
  var xn = oe(ft, 2);
  {
    var Pn = (i) => {
      var u = Mi(), S = fe(u, !0);
      pe(u), Se(() => xt(S, e(ve))), ne(i, u);
    };
    te(xn, (i) => {
      e(ve) && i(Pn);
    });
  }
  pe(xe), Ce(xe, (i) => L = i, () => L);
  var vt = oe(xe, 2);
  {
    var Cn = (i) => {
      {
        let u = E(() => r()("postComponent.warning")), S = E(() => r()("postComponent.secret_key_detected")), C = E(() => r()("postComponent.post")), y = E(() => r()("postComponent.cancel"));
        Rr(i, {
          get open() {
            return e(Ut);
          },
          get title() {
            return e(u);
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
          onConfirm: cn,
          get onCancel() {
            return un;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    te(vt, (i) => {
      i(Cn);
    });
  }
  var mt = oe(vt, 2);
  wr(mt, {
    get src() {
      return e(rt);
    },
    get alt() {
      return e(Xt);
    },
    get onClose() {
      return gn;
    },
    get mediaList() {
      return e(Be);
    },
    get currentIndex() {
      return e(hn);
    },
    onNavigate: pn,
    get show() {
      return e(nt);
    },
    set show(i) {
      b(nt, i);
    }
  });
  var Fn = oe(mt, 2);
  {
    var _n = (i) => {
      Hr(i, {
        get show() {
          return e(it);
        },
        get x() {
          return e(Gt);
        },
        get y() {
          return e(Qt);
        },
        children: (u, S) => {
          var C = Di(), y = fe(C, !0);
          pe(C), Se(() => xt(y, e($t))), ne(u, C);
        },
        $$slots: { default: !0 }
      });
    };
    te(Fn, (i) => {
      e(it) && i(_n);
    });
  }
  Se(
    (i) => {
      ct = Fe(xe, 1, "post-container svelte-15ticnd", null, ct, { "editor-auto-grow": e(K) }), Dt(xe, e(_e)), ut = Fe(Z, 1, "editor-container svelte-15ticnd", null, ut, {
        "drag-over": e(be),
        "gallery-mode": !e(H),
        sending: e(P).sending,
        "editor-submit-enabled": e(G),
        "account-avatar-placeholder": e(q)
      }), ge(Z, "aria-label", i), ge(Z, "aria-disabled", e(P).sending ? "true" : void 0);
    },
    [() => r()("postComponent.editor_label")]
  ), we("click", Z, Wt), he("keydown", Z, Nt, !0), we("keydown", Z, zt), we("beforeinput", Z, Bt), ne(n, dt);
  var kn = Je(vn);
  return s(), kn;
}
Lt(["click", "keydown", "beforeinput", "change"]);
Ve(
  Ai,
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
  Ai as default
};
