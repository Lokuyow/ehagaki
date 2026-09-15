import { a as zn, h as xt, m as Ye, b as ie, c as Lt, d as At, k as jn, e as qn, s as Gn, w as Un, r as Rt, f as Kn, i as Ct, j as Xn, l as Qn, n as $n, o as Yn, p as Vn, q as Ht, t as Zn, u as Ve, P as Jn, v as ei, x as Be, y as ti, z as ni, A as ii, B as ri, C as oi, R as je, D as si, E as Ot, F as ai, G as li, H as Je, I as N, J as di, K as se, L as Ie, M as _e, N as ce, O as Wt, Q as et, S as ci, T as ui, U as gi, V as tt, $ as nt, W as hi, X as K, Y as Te, Z as Ft, _ as pi, a0 as fi, a1 as kt, a2 as mi, a3 as vi, a4 as Bt, a5 as yi, a6 as wi, a7 as bi, a8 as Si, a9 as Ce, aa as Ei, ab as Pi, ac as xi, ad as ke, ae as Ci, af as Fi, ag as ki, ah as Ii, ai as _i, aj as It, ak as Ne, al as ze, am as Mi, an as Di, ao as Ti, ap as Li, aq as _t, ar as Ai, as as Ri, at as Hi, au as Oi, av as Wi, aw as Bi, ax as Ni, ay as zi, az as ji, aA as qi, aB as Gi, aC as Ui, aD as Ki, aE as Xi, aF as Qi, aG as $i, aH as Yi, aI as Vi } from "./App-BBD-wmht.js";
import { bk as $e, aJ as qe, aq as Nt, b6 as it, b0 as rt, a as e, bf as ue, b as y, Z as Pe, bD as ee, ap as Ee, b3 as ae, b4 as ot, aS as Q, ba as ge, b8 as ye, aR as E, b5 as z, bg as Zi, b9 as me, aN as Se, b1 as Ji, b2 as zt, bl as er, u as Le, bi as Mt } from "./entry-BhDgNuDQ.js";
class tr {
  onPhaseChange;
  editor = null;
  cleanupListeners;
  frame;
  generation = 0;
  domCompositionActive = !1;
  phase = null;
  capturedGeneration;
  capturedId;
  constructor(t) {
    this.onPhaseChange = t;
  }
  setPhase(t) {
    this.phase = t, this.onPhaseChange?.(t);
  }
  scheduleRetire() {
    const t = this.editor?.view?.dom?.ownerDocument.defaultView;
    if (!t) {
      this.retire();
      return;
    }
    this.frame !== void 0 && t.cancelAnimationFrame(this.frame), this.frame = t.requestAnimationFrame(() => {
      this.frame = void 0, this.phase === "stale" && !this.domCompositionActive && this.retire();
    });
  }
  attach(t) {
    this.editor && this.editor !== t && this.retire(), this.cleanupListeners?.(), this.editor = t;
    const i = t.view?.dom;
    if (!i) return;
    const s = i.ownerDocument.defaultView;
    if (!s) return;
    const a = () => {
      this.domCompositionActive = !0, this.generation += 1, this.phase === "stale" && this.retire();
    }, o = () => {
      this.domCompositionActive = !1, this.phase === "stale" && this.scheduleRetire();
    };
    i.addEventListener("compositionstart", a, !0), i.addEventListener("compositionend", o, !0), this.cleanupListeners = () => {
      i.removeEventListener("compositionstart", a, !0), i.removeEventListener("compositionend", o, !0), this.frame !== void 0 && s.cancelAnimationFrame(this.frame), this.frame = void 0, this.cleanupListeners = void 0;
    };
  }
  detach() {
    this.retire(), this.cleanupListeners?.(), this.cleanupListeners = void 0, this.editor = null;
  }
  getCurrentGeneration() {
    return this.generation;
  }
  startSession(t) {
    this.setPhase("continuing"), this.capturedGeneration = this.generation, this.capturedId = t.idsByGeneration.get(this.generation);
  }
  decideTransaction({ transaction: t, observerState: i }) {
    if (!this.phase) return "default";
    const s = t.getMeta("composition");
    if (this.phase === "stale" || s === void 0 || this.capturedGeneration !== this.generation) return "reject";
    if (this.capturedId === void 0) {
      const a = i.idsByGeneration.get(this.capturedGeneration);
      if (a !== void 0) this.capturedId = a;
      else return "allow";
    }
    return Object.is(this.capturedId, s) ? "allow" : "reject";
  }
  isCompositionInputAllowed() {
    return this.phase === "continuing" && this.capturedGeneration === this.generation;
  }
  isReadOnly() {
    return this.phase === "stale";
  }
  markStale() {
    this.phase === "continuing" && (this.setPhase("stale"), this.domCompositionActive || this.scheduleRetire());
  }
  markFailure() {
    this.retire();
  }
  retire() {
    this.setPhase(null), this.capturedGeneration = void 0, this.capturedId = void 0, this.frame !== void 0 && (this.editor?.view.dom.ownerDocument.defaultView?.cancelAnimationFrame(this.frame), this.frame = void 0);
  }
  destroy() {
    this.retire(), this.setPhase("disposed"), this.cleanupListeners?.(), this.cleanupListeners = void 0, this.editor = null;
  }
}
class nr {
  constructor(t, i = {}) {
    this.deps = i, t && this.setRxNostr(t), this.deps.console = i.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = i.authStateStore || zn, this.deps.hashtagStore = i.hashtagStore || xt, this.deps.mediaFreePlacementStore = i.mediaFreePlacementStore || Ye, this.deps.mediaGalleryStore = i.mediaGalleryStore || ie, this.deps.contentWarningStore = i.contentWarningStore || Lt, this.deps.contentWarningReasonStore = i.contentWarningReasonStore || At, this.deps.keyManager = i.keyManager || jn, this.deps.createImetaTagFn = i.createImetaTagFn || qn, this.deps.settingsStore = i.settingsStore || Gn, this.deps.writeRelaysStore = i.writeRelaysStore || Un, this.deps.replyQuoteState = i.replyQuoteState || Rt, this.deps.getClientTagFn = i.getClientTagFn || (() => Kn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = i.seckeySignerFn || Ct, this.deps.extractContentWithImagesFn = i.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = i.extractContentWithEmojiTagsFn || (i.extractContentWithImagesFn ? (s) => ({ content: i.extractContentWithImagesFn(s), emojiTags: [] }) : Xn), this.deps.extractImageBlurhashMapFn = i.extractImageBlurhashMapFn || Qn, this.deps.resetEditorStateFn = i.resetEditorStateFn || $n, this.deps.resetPostStatusFn = i.resetPostStatusFn || Yn, this.deps.notificationPort = i.iframeMessageService || i.notificationPort || Vn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = i.hashtagPinStore || Ht, this.deps.saveHashtagsToHistoryFn = i.saveHashtagsToHistoryFn || Zn, this.deps.clearReplyQuoteFn = i.clearReplyQuoteFn || Ve;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new Jn(t, this.deps.console || console);
  }
  clearReplyQuoteAfterSuccess() {
    this.deps.clearReplyQuoteFn?.();
  }
  getReplyQuoteNotifyOptions() {
    const t = this.deps.replyQuoteState.value, i = Array.from(
      new Set(t.quotes.map((s) => s.eventId))
    );
    if (!(!t.reply && i.length === 0))
      return {
        ...t.reply ? { replyToEventId: t.reply.eventId } : {},
        ...i.length > 0 ? { quotedEventIds: i } : {}
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
    return ei.buildEvent(
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
  finalizeSubmittedPost(t, i, s) {
    return t.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(i)).catch(() => {
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
    const i = $e.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), s = $e.sanitizeExternalRelayUrls([
      ...i,
      ...t.additionalWriteRelays ?? [],
      ...this.deps.writeRelaysStore?.value ?? []
    ], { limit: 3 });
    try {
      await this.deps.savePostHistoryFn({
        event: t.event,
        attestation: t.attestation,
        acceptedRelays: i,
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
    const i = t.signEvent ?? (typeof t.signer?.signEvent == "function" ? t.signer.signEvent.bind(t.signer) : void 0);
    if (t.signer && !i)
      return this.notifyPostFailure("nostr_sign_event_not_supported");
    Be(this.deps.authStateStore, t.sessionPubkey);
    const s = ti(t.event), a = i ? await i(s.signerTemplate) : t.event;
    Be(this.deps.authStateStore, t.sessionPubkey);
    let o;
    try {
      o = ni(
        s.expectedTemplate,
        a,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    Be(this.deps.authStateStore, t.sessionPubkey);
    const d = ii(o);
    if (!d)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: o?.kind ?? "(missing)"
    }), i && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), Be(this.deps.authStateStore, t.sessionPubkey);
    const u = await this.eventSender.sendEvent(d.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: u.success
    });
    const m = u.success ? {
      ...u,
      eventId: u.eventId ?? d.event.id,
      event: d.event
    } : u;
    return await this.saveSubmittedPostHistory({
      event: d.event,
      attestation: d.attestation,
      result: m,
      additionalWriteRelays: t.additionalWriteRelays
    }), this.finalizeSubmittedPost(
      m,
      t.hashtags,
      t.rqNotifyOptions
    );
  }
  // 外部APIは変更なし（後方互換性のため）
  validatePost(t) {
    const i = this.deps.authStateStore;
    return ri.validatePost(
      t,
      i.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, i, s = []) {
    let a = oi(t);
    const o = this.deps.settingsStore.quoteNotificationEnabled, d = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      a,
      o
    ) ?? new je().extractInlineQuoteTags(
      a,
      o
    ), u = this.deps.replyQuoteState.value;
    if (u.quotes.length > 0) {
      const b = this.deps.replyQuoteService || new je(), P = new Set(
        d.filter((p) => p[0] === "q").map((p) => p[1])
      ), D = u.quotes.filter((p) => !P.has(p.eventId)).map(
        (p) => b.generateNostrUri(
          p.eventId,
          p.relayHints,
          p.authorPubkey
        )
      );
      D.length > 0 && (a = `${a.trimEnd()}
${D.join(`
`)}`.trim());
    }
    const m = this.validatePost(a);
    if (!m.valid)
      return this.notifyPostFailure(m.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    if (li() && $e.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const b = this.deps.authStateStore, P = si(b), D = this.deps.hashtagStore, { hashtags: p, tags: F } = this.getHashtagArrays(D), O = this.deps.keyManager, k = this.deps.window || (typeof window < "u" ? window : void 0), te = this.deps.contentWarningStore.value, re = this.deps.contentWarningReasonStore.value, he = this.deps.channelContextState?.value ?? null, V = he?.channelRelays, $ = this.deps.replyQuoteState.value;
      let H;
      const pe = this.getReplyQuoteNotifyOptions();
      if ($.reply || $.quotes.length > 0) {
        const T = this.deps.replyQuoteService || new je();
        H = [], $.reply && (he ? (H.push([
          "e",
          $.reply.eventId,
          $.reply.relayHints[0] || "",
          "reply",
          ...$.reply.authorPubkey ? [$.reply.authorPubkey] : []
        ]), T.buildReplyTags($.reply).filter((M) => M[0] === "p").forEach((M) => {
          H.push(M);
        })) : H.push(...T.buildReplyTags($.reply)));
        const R = /* @__PURE__ */ new Set(), v = new Set(
          H.filter((M) => M[0] === "p").map((M) => M[1])
        );
        $.quotes.forEach((M) => {
          T.buildQuoteTags(M, M.quoteNotificationEnabled).forEach((_) => {
            if (_[0] === "q") {
              if (R.has(_[1]))
                return;
              R.add(_[1]);
            }
            if (_[0] === "p") {
              if (v.has(_[1]))
                return;
              v.add(_[1]);
            }
            H.push(_);
          });
        });
      }
      if (d.length > 0) {
        H || (H = []);
        const T = new Set(
          H.filter((v) => v[0] === "q").map((v) => v[1])
        ), R = new Set(
          H.filter((v) => v[0] === "p").map((v) => v[1])
        );
        for (const v of d)
          v[0] === "q" && !T.has(v[1]) ? (H.push(v), T.add(v[1])) : v[0] === "p" && !R.has(v[1]) && (H.push(v), R.add(v[1]));
      }
      const Z = b.value;
      if (Z.type === "nip07" && O.isWindowNostrAvailable() && k?.nostr)
        try {
          const T = Z.pubkey;
          if (!T)
            return this.notifyPostFailure("pubkey_not_found");
          const R = typeof k.nostr.signEvent == "function" ? k.nostr.signEvent.bind(k.nostr) : void 0;
          if (!R)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const v = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: F,
            pubkey: T,
            imageImetaMap: i,
            contentWarningEnabled: te,
            contentWarningReason: re,
            replyQuoteTags: H,
            channelContext: he,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: v,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: pe,
            signEvent: R,
            logSignedEvent: !0,
            additionalWriteRelays: V
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (Z.type === "nip46")
        try {
          const T = Z.pubkey;
          if (!T)
            return this.notifyPostFailure("pubkey_not_found");
          const R = await this.deps.getNip46SignerForSessionFn?.(T), v = this.deps.authStateStore.value;
          if (!R || !v.isAuthenticated || v.type !== "nip46" || v.pubkey !== T)
            return this.notifyPostFailure("nip46_signer_not_available");
          const M = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: F,
            pubkey: T,
            imageImetaMap: i,
            contentWarningEnabled: te,
            contentWarningReason: re,
            replyQuoteTags: H,
            channelContext: he,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: M,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: pe,
            signer: R,
            additionalWriteRelays: V
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (Z.type === "parentClient") {
        const T = this.deps.getParentClientSignerFn?.();
        if (!T)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const R = Z.pubkey;
        if (!R)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const v = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: F,
            pubkey: R,
            imageImetaMap: i,
            contentWarningEnabled: te,
            contentWarningReason: re,
            replyQuoteTags: H,
            channelContext: he,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: v,
            sessionPubkey: P,
            hashtags: p,
            rqNotifyOptions: pe,
            signer: T,
            additionalWriteRelays: V
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const l = O.getFromStore() || O.loadFromStorage(Z.pubkey);
      if (!l)
        return this.notifyPostFailure("key_not_found");
      const G = await this.buildSubmissionEvent({
        processedContent: a,
        hashtags: p,
        tags: F,
        imageImetaMap: i,
        contentWarningEnabled: te,
        contentWarningReason: re,
        replyQuoteTags: H,
        channelContext: he,
        emojiTags: s
      }), oe = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(l) : Ct(l);
      return await this.sendPreparedEvent({
        event: G,
        sessionPubkey: P,
        hashtags: p,
        rqNotifyOptions: pe,
        signer: oe,
        additionalWriteRelays: V
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
    const i = t || this.deps.hashtagStore, s = this.deps.hashtagSnapshotFn;
    if (s) {
      const a = s(i);
      return {
        hashtags: Array.isArray(a?.hashtags) ? [...a.hashtags] : [],
        tags: Array.isArray(a?.tags) ? a.tags.map((o) => [...o]) : []
      };
    }
    if (i === xt)
      try {
        const a = Ot();
        return {
          hashtags: Array.isArray(a?.hashtags) ? [...a.hashtags] : [],
          tags: Array.isArray(a?.tags) ? a.tags.map((o) => [...o]) : []
        };
      } catch (a) {
        this.deps.console?.warn("hashtag_snapshot_failed", a);
      }
    return {
      hashtags: Array.isArray(i?.hashtags) ? [...i.hashtags] : [],
      tags: Array.isArray(i?.tags) ? i.tags.map((a) => [...a]) : []
    };
  }
  // --- PostComponent 統合メソッド ---
  preparePostPayload(t) {
    const i = this.deps.extractContentWithEmojiTagsFn(t);
    if (!this.deps.mediaFreePlacementStore.value) {
      const s = this.deps.mediaGalleryStore.getContentUrls();
      if (s.length > 0) {
        const a = i.content.trim();
        return {
          content: a ? a + `
` + s.join(`
`) : s.join(`
`),
          emojiTags: i.emojiTags
        };
      }
    }
    return i;
  }
  preparePostContent(t) {
    return this.preparePostPayload(t).content;
  }
  prepareImageBlurhashMap(t, i, s) {
    if (!this.deps.mediaFreePlacementStore.value)
      return this.deps.mediaGalleryStore.getImageBlurhashMap();
    const a = {};
    t?.state?.doc?.descendants?.((u) => {
      if (u.type?.name !== "image" || !u.attrs?.src || u.attrs?.isPlaceholder)
        return;
      const m = typeof u.attrs.size == "number" ? u.attrs.size : Number(u.attrs.size);
      a[u.attrs.src] = {
        dim: u.attrs.dim ?? void 0,
        alt: u.attrs.alt ?? void 0,
        size: Number.isFinite(m) && m > 0 ? m : void 0,
        uploadProtocol: u.attrs.uploadProtocol ?? void 0
      };
    });
    const o = this.deps.extractImageBlurhashMapFn(t), d = {};
    for (const [u, m] of Object.entries(o))
      d[u] = {
        m: ai(u),
        blurhash: m,
        dim: a[u]?.dim,
        alt: a[u]?.alt,
        size: a[u]?.size,
        uploadProtocol: a[u]?.uploadProtocol,
        ox: i[u],
        x: s[u]
      };
    return d;
  }
  async performPostSubmission(t, i, s, a, o, d, u) {
    const m = this.prepareImageBlurhashMap(t, s, a);
    o?.();
    try {
      const b = await this.submitPost(i.content, m, i.emojiTags);
      b.success ? d?.(b) : u?.(b.error || "post_error");
    } catch {
      u?.("post_error");
    }
  }
  applyEmptyStateToEditor(t) {
    t.chain().clearContent().run();
  }
  resetPostContent(t) {
    this.applyEmptyStateToEditor(t), this.deps.resetEditorStateFn?.(), this.deps.resetPostStatusFn?.(), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), this.deps.clearReplyQuoteFn?.();
  }
  clearContentAfterSuccess(t) {
    const i = this.deps.hashtagPinStore.value, s = i ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), i && s.length > 0) {
      const a = " " + s.map((o) => "#" + o).join(" ");
      t.commands.insertContent(a);
    }
    t.commands.setTextSelection(1);
  }
}
function ir(n) {
  return !!n && n.length > 0;
}
function rr(n, t, i) {
  n.isUploading = t, i !== void 0 && (n.uploadErrorMessage = i);
}
function or(n) {
  const t = n.target;
  return t?.files?.length ? t.files : void 0;
}
function sr({
  getCurrentEditor: n,
  getFileInput: t,
  getImageOxMap: i,
  getImageXMap: s,
  getUploadFailedText: a,
  updateUploadState: o,
  setUploadErrorMessage: d,
  uploadFiles: u
}) {
  const m = async (P) => ir(P) ? await u({
    files: P,
    currentEditor: n(),
    fileInput: t(),
    updateUploadState: o,
    setUploadErrorMessage: d,
    imageOxMap: i(),
    imageXMap: s(),
    getUploadFailedText: a
  }) ?? null : null;
  return {
    performUpload: m,
    handleFileSelect: (P) => {
      const D = or(P);
      D && m(D);
    }
  };
}
let W = qe({
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
}), Ae;
function Dt() {
  Ae !== void 0 && (clearTimeout(Ae), Ae = void 0);
}
const de = {
  get value() {
    return W;
  },
  // 秘密鍵ダイアログ
  showSecretKeyDialog: (n, t = []) => {
    W.pendingPost = n, W.pendingEmojiTags = t.map((i) => [...i]), W.showSecretKeyDialog = !0;
  },
  hideSecretKeyDialog: () => {
    W.showSecretKeyDialog = !1, W.pendingPost = "", W.pendingEmojiTags = [];
  },
  getPendingPost: () => W.pendingPost,
  getPendingEmojiTags: () => W.pendingEmojiTags.map((n) => [...n]),
  // 画像フルスクリーン
  showImageFullscreen: (n, t = "", i = "") => {
    W.fullscreenMediaId = i, W.fullscreenImageSrc = n, W.fullscreenImageAlt = t, W.showImageFullscreen = !0;
  },
  hideImageFullscreen: () => {
    W.showImageFullscreen = !1, W.fullscreenMediaId = "", W.fullscreenImageSrc = "", W.fullscreenImageAlt = "";
  },
  // フローティングメッセージ
  showFloatingMessage: (n, t, i, s = 1800) => {
    Dt(), W.floatingMessageX = n, W.floatingMessageY = t, W.floatingMessageText = i, W.showFloatingMessage = !0, Ae = setTimeout(
      () => {
        W.showFloatingMessage = !1, Ae = void 0;
      },
      s
    );
  },
  hideFloatingMessage: () => {
    Dt(), W.showFloatingMessage = !1;
  }
};
var ar = ge('<img draggable="false"/>'), lr = ge('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), dr = ge('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const cr = {
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
function jt(n, t) {
  rt(t, !0), Je(n, cr);
  const i = () => tt(nt, "$_", s), [s, a] = et();
  let o = N(t, "item", 7), d = N(t, "index", 7), u = N(t, "onDelete", 7), m = N(t, "onDragStart", 7), b = N(t, "onDragOver", 7), P = N(t, "onDragEnd", 7), D = N(t, "onDrop", 7), p = N(t, "onTouchDragStart", 7), F = N(t, "disabled", 7, !1), O = Q(void 0), k = Q(void 0);
  const te = gi();
  di(() => e(O), {
    onLongPress: (g, I) => {
      F() || p()?.(d(), g, I);
    }
  });
  let re = E(() => !o().isPlaceholder && o().type === "image" && !!o().src), he = E(() => !o().isPlaceholder && o().type === "video" && !!o().src);
  const V = 180, $ = 100, H = 180;
  let pe = E(() => {
    if (!o().isPlaceholder) return;
    const g = o().dimensions;
    if (g && g.width > 0 && g.height > 0) {
      const I = g.width / g.height, U = Math.round(V * I);
      return `width: ${Math.max($, Math.min(H, U))}px; height: ${V}px;`;
    }
    return `width: ${H}px; height: ${V}px;`;
  });
  function Z() {
    o().isPlaceholder || o().type !== "image" || de.showImageFullscreen(o().src, o().alt || "", o().id);
  }
  function le(g) {
    if (F()) {
      g.preventDefault();
      return;
    }
    if (e(O) && g.dataTransfer) {
      const I = e(O).getBoundingClientRect(), U = g.clientX - I.left, Y = g.clientY - I.top;
      g.dataTransfer.setDragImage(e(O), U, Y);
    }
    m()(d(), g);
  }
  function l(g) {
    g.stopPropagation(), e(k) && (e(k).paused ? e(k).play() : e(k).pause());
  }
  function G(g) {
    g.preventDefault(), !F() && b()(d(), g);
  }
  function oe(g) {
    g.preventDefault(), !F() && D()(d());
  }
  function T(g) {
    o().type !== "image" || o().isPlaceholder || (g.key === "Enter" || g.key === " " || g.key === "Spacebar") && (g.preventDefault(), Z());
  }
  var R = {
    get item() {
      return o();
    },
    set item(g) {
      o(g), z();
    },
    get index() {
      return d();
    },
    set index(g) {
      d(g), z();
    },
    get onDelete() {
      return u();
    },
    set onDelete(g) {
      u(g), z();
    },
    get onDragStart() {
      return m();
    },
    set onDragStart(g) {
      m(g), z();
    },
    get onDragOver() {
      return b();
    },
    set onDragOver(g) {
      b(g), z();
    },
    get onDragEnd() {
      return P();
    },
    set onDragEnd(g) {
      P(g), z();
    },
    get onDrop() {
      return D();
    },
    set onDrop(g) {
      D(g), z();
    },
    get onTouchDragStart() {
      return p();
    },
    set onTouchDragStart(g) {
      p(g), z();
    },
    get disabled() {
      return F();
    },
    set disabled(g = !1) {
      F(g), z();
    }
  }, v = dr();
  let M;
  var _ = ye(v), fe = ye(_);
  {
    var f = (g) => {
      {
        let I = E(() => o().type === "video" ? i()("videoNode.uploading") : i()("imageNode.uploading"));
        ci(g, {
          get text() {
            return e(I);
          },
          showLoader: !0
        });
      }
    };
    se(fe, (g) => {
      o().isPlaceholder && g(f);
    });
  }
  var h = ue(fe, 2);
  {
    var j = (g) => {
      var I = ar();
      let U;
      Pe(() => {
        ce(I, "src", o().src), ce(I, "alt", o().alt || ""), U = _e(I, 1, "gallery-image svelte-aw59wn", null, U, { "image-loading": !te.isLoaded });
      }), ee("load", I, function(...Y) {
        te.handleLoad?.apply(this, Y);
      }), ee("error", I, function(...Y) {
        te.handleError?.apply(this, Y);
      }), Ee("contextmenu", I, (Y) => Y.preventDefault()), Zi(I), ae(g, I);
    };
    se(h, (g) => {
      e(re) && g(j);
    });
  }
  var A = ue(h, 2);
  {
    var L = (g) => {
      var I = lr(), U = ye(I);
      U.muted = !0, Ie(U, (we) => y(k, we), () => e(k));
      var Y = ue(U, 2);
      me(I), Pe(() => {
        ce(U, "src", o().src), ce(Y, "draggable", !F());
      }), Ee("contextmenu", U, (we) => we.preventDefault()), ee("dragstart", Y, le), Ee("click", Y, l), ae(g, I);
    };
    se(A, (g) => {
      e(he) && g(L);
    });
  }
  me(_);
  var q = ue(_, 2);
  {
    var B = (g) => {
      {
        let I = E(() => i()("imageContextMenu.delete")), U = E(() => i()("imageContextMenu.copyUrl")), Y = E(() => i()("imageContextMenu.copySuccess"));
        ui(g, {
          get src() {
            return o().src;
          },
          onDelete: () => u()(o().id),
          get deleteAriaLabel() {
            return e(I);
          },
          get copyAriaLabel() {
            return e(U);
          },
          get copySuccessMessage() {
            return e(Y);
          },
          layout: "gallery",
          get deleteDisabled() {
            return F();
          }
        });
      }
    };
    se(q, (g) => {
      o().isPlaceholder || g(B);
    });
  }
  me(v), Ie(v, (g) => y(O, g), () => e(O)), Pe(() => {
    M = _e(v, 1, "gallery-item svelte-aw59wn", null, M, {
      "is-placeholder": o().isPlaceholder,
      "is-disabled": F()
    }), ce(v, "draggable", !F() && (o().type !== "video" || o().isPlaceholder)), Wt(_, e(pe)), ce(_, "role", o().type === "image" && !o().isPlaceholder ? "button" : void 0), ce(_, "tabindex", o().type === "image" && !o().isPlaceholder ? 0 : void 0), ce(_, "aria-label", o().alt || o().src);
  }), ee("dragstart", v, le), ee("dragover", v, G), ee("drop", v, oe), ee("dragend", v, () => P()()), Ee("click", _, function(...g) {
    (o().type === "image" && !o().isPlaceholder ? Z : void 0)?.apply(this, g);
  }), Ee("keydown", _, T), ae(n, v);
  var ve = ot(R);
  return a(), ve;
}
Nt(["click", "keydown", "contextmenu"]);
it(
  jt,
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
function ur(n) {
  return Math.abs(n.deltaX) > Math.abs(n.deltaY) ? n.deltaX : n.deltaY;
}
function gr(n, t) {
  const i = n.scrollHeight - n.clientHeight;
  if (i <= 1)
    return !1;
  const s = n.scrollTop <= 0, a = n.scrollTop >= i - 1;
  return t > 0 ? !a : t < 0 ? !s : !1;
}
function hr(n, t) {
  const i = n.scrollWidth - n.clientWidth;
  if (i <= 1)
    return !1;
  const s = n.scrollLeft <= 0, a = n.scrollLeft >= i - 1;
  return t > 0 ? !a : t < 0 ? !s : !1;
}
function pr(n, t, i = null) {
  if (i && gr(i, t.deltaY))
    return !1;
  const s = ur(t);
  if (!hr(n, s))
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
var fr = ge("<div><!></div>"), mr = ge('<div role="list"></div>');
const vr = {
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
function qt(n, t) {
  rt(t, !0), Je(n, vr);
  const i = () => tt(nt, "$_", s), [s, a] = et();
  let o = Q(-1), d = Q(-1), u = Q(-1), m = Q(-1), b = null, P = 60, D = 60, p = Q(void 0), F = null, O = E(() => ie.items), k = E(() => K.postStatus.sending), te = E(() => {
    const f = e(o) !== -1 ? e(o) : e(u), h = e(o) !== -1 ? e(d) : e(m);
    return f === -1 || h === -1 || h === f || h === f + 1 ? -1 : h;
  });
  function re(f, h) {
    if (e(k)) {
      h.preventDefault();
      return;
    }
    y(o, f, !0), h.dataTransfer?.setData("text/plain", String(f)), h.dataTransfer && (h.dataTransfer.effectAllowed = "move");
  }
  function he(f, h) {
    if (h.preventDefault(), e(k)) return;
    const A = e(p)?.querySelectorAll(".gallery-item-wrapper")?.[f];
    if (A) {
      const L = A.getBoundingClientRect();
      y(d, h.clientX < L.left + L.width / 2 ? f : f + 1, !0);
    } else
      y(d, f, !0);
  }
  function V() {
    l(), y(o, -1), y(d, -1);
  }
  function $(f) {
  }
  function H(f) {
    if (e(o) === -1) return;
    if (f.preventDefault(), e(k)) {
      l(), y(d, -1);
      return;
    }
    const h = e(p)?.querySelectorAll(".gallery-item-wrapper");
    if (h && h.length > 0) {
      const j = h[0].getBoundingClientRect(), A = h[h.length - 1].getBoundingClientRect();
      f.clientX < j.left ? y(d, 0) : f.clientX > A.right && y(d, e(O).length, !0);
    }
    if (e(p)) {
      const j = e(p).getBoundingClientRect();
      f.clientX - j.left < Te ? le("left", f.clientX) : j.right - f.clientX < Te ? le("right", f.clientX) : l();
    }
  }
  function pe(f) {
    if (f.preventDefault(), l(), e(k)) {
      y(o, -1), y(d, -1);
      return;
    }
    const h = e(d);
    if (e(o) !== -1 && h !== -1 && h !== e(o) && h !== e(o) + 1) {
      const j = e(o) < h ? h - 1 : h;
      ie.reorderItems(e(o), j);
    }
    y(o, -1), y(d, -1);
  }
  function Z(f) {
    e(k) || ie.removeItem(f);
  }
  function le(f, h) {
    if (!e(p)) return;
    F !== null && (cancelAnimationFrame(F), F = null);
    const j = e(p).getBoundingClientRect(), A = f === "left" ? h - j.left : j.right - h, L = Math.max(0, Math.min(1, A / Te)), q = Ft + (pi - Ft) * (1 - L), B = () => {
      if (!e(p)) return;
      const ve = e(p).scrollWidth - e(p).clientWidth;
      f === "left" && e(p).scrollLeft > 0 ? (e(p).scrollLeft = Math.max(0, e(p).scrollLeft - q), F = requestAnimationFrame(B)) : f === "right" && e(p).scrollLeft < ve ? (e(p).scrollLeft = Math.min(ve, e(p).scrollLeft + q), F = requestAnimationFrame(B)) : F = null;
    };
    F = requestAnimationFrame(B);
  }
  function l() {
    F !== null && (cancelAnimationFrame(F), F = null);
  }
  function G(f, h, j) {
    if (e(k)) return;
    y(u, f, !0), R();
    const A = e(p)?.querySelectorAll(".gallery-item-wrapper")[f];
    if (A) {
      const L = A.getBoundingClientRect(), q = 120, B = Math.min(q / L.width, q / L.height);
      P = L.width * B / 2, D = L.height * B / 2, b = A.cloneNode(!0), b.style.cssText = `
                position: fixed;
                left: ${h - P}px;
                top: ${j - D}px;
                width: ${L.width}px;
                height: ${L.height}px;
                transform-origin: top left;
                transform: scale(${B});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, er().overlayTarget.appendChild(b);
    }
    document.addEventListener("touchmove", oe, { passive: !1 }), document.addEventListener("touchend", T, { passive: !1 });
  }
  function oe(f) {
    if (e(u) === -1 || f.touches.length !== 1) return;
    if (f.preventDefault(), e(k)) {
      l(), y(m, -1);
      return;
    }
    const h = f.touches[0];
    b && (b.style.left = `${h.clientX - P}px`, b.style.top = `${h.clientY - D}px`), b && (b.style.display = "none");
    const j = document.elementFromPoint(h.clientX, h.clientY);
    b && (b.style.display = "");
    const A = j?.closest(".gallery-item-wrapper");
    if (A && e(p)) {
      const L = e(p).querySelectorAll(".gallery-item-wrapper"), q = Array.from(L).indexOf(A);
      if (q !== -1) {
        const B = A.getBoundingClientRect();
        y(m, h.clientX < B.left + B.width / 2 ? q : q + 1, !0);
      }
    } else if (e(p)) {
      const L = e(p).querySelectorAll(".gallery-item-wrapper");
      if (L.length > 0) {
        const q = L[0].getBoundingClientRect(), B = L[L.length - 1].getBoundingClientRect();
        h.clientX <= q.left ? y(m, 0) : h.clientX >= B.right && y(m, e(O).length, !0);
      }
    }
    if (e(p)) {
      const L = e(p).getBoundingClientRect();
      h.clientX - L.left < Te ? le("left", h.clientX) : L.right - h.clientX < Te ? le("right", h.clientX) : l();
    }
  }
  function T() {
    if (document.removeEventListener("touchmove", oe), document.removeEventListener("touchend", T), l(), e(k)) {
      R(), y(u, -1), y(m, -1);
      return;
    }
    const f = e(m);
    if (e(u) !== -1 && f !== -1 && f !== e(u) && f !== e(u) + 1) {
      const h = e(u) < f ? f - 1 : f;
      ie.reorderItems(e(u), h);
    }
    R(), y(u, -1), y(m, -1);
  }
  function R() {
    b && (b.remove(), b = null);
  }
  function v(f) {
    if (!e(p)) return;
    const h = e(p).closest(".composer-scroll-region");
    pr(e(p), f, h instanceof HTMLElement ? h : null) && f.preventDefault();
  }
  Se(() => {
    if (e(p))
      return e(p).addEventListener("wheel", v, { passive: !1 }), () => {
        e(p)?.removeEventListener("wheel", v);
      };
  });
  var M = Ji(), _ = zt(M);
  {
    var fe = (f) => {
      var h = mr();
      let j;
      hi(h, 23, () => e(O), (A) => A.id, (A, L, q) => {
        var B = fr();
        let ve;
        var g = ye(B);
        jt(g, {
          get item() {
            return e(L);
          },
          get index() {
            return e(q);
          },
          onDelete: Z,
          onDragStart: re,
          onDragOver: he,
          onDragEnd: V,
          onDrop: $,
          onTouchDragStart: G,
          get disabled() {
            return e(k);
          }
        }), me(B), Pe(() => ve = _e(B, 1, "gallery-item-wrapper svelte-w2vv8k", null, ve, {
          "insert-bar-left": e(te) === e(q),
          "insert-bar-right": e(te) === e(O).length && e(q) === e(O).length - 1
        })), ae(A, B);
      }), me(h), Ie(h, (A) => y(p, A), () => e(p)), Pe(
        (A) => {
          j = _e(h, 1, "media-gallery svelte-w2vv8k", null, j, { sending: e(k) }), ce(h, "aria-label", A);
        },
        [() => i()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), ee("dragover", h, H), ee("drop", h, pe), ae(f, h);
    };
    se(_, (f) => {
      e(O).length > 0 && f(fe);
    });
  }
  ae(n, M), ot(), a();
}
it(qt, {}, [], [], { mode: "open" });
function Ze(n) {
  if (!n || !n.types) return !1;
  try {
    return Array.from(n.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function Gt(n) {
  if (!n) return !1;
  try {
    return Array.from(n.types).includes("Files") || n.files && n.files.length > 0;
  } catch {
    return !!(n.files && n.files.length > 0);
  }
}
function Re(n) {
  const t = n.__postStatus;
  return (typeof t == "function" ? t() : t)?.sending === !0;
}
function He(n) {
  return typeof n.__uploadFiles == "function";
}
function yr(n) {
  let t = Q(!1);
  function i(o) {
    if (Re(n) || !He(n)) {
      o.preventDefault(), y(t, !1), n.classList.remove("drag-over");
      return;
    }
    const d = o.dataTransfer, u = Ze(d);
    Gt(d) && !u ? (o.preventDefault(), e(t) || (y(t, !0), n.classList.add("drag-over"))) : e(t) && (y(t, !1), n.classList.remove("drag-over"));
  }
  function s(o) {
    e(t) && (y(t, !1), n.classList.remove("drag-over"));
  }
  async function a(o) {
    if (y(t, !1), n.classList.remove("drag-over"), Re(n) || !He(n)) {
      o.preventDefault();
      return;
    }
    const d = o.dataTransfer;
    Ze(d) || d?.files && d.files.length > 0 && typeof n.__uploadFiles == "function" && (o.preventDefault(), n.__uploadFiles(d.files));
  }
  return n.addEventListener("dragover", i), n.addEventListener("dragleave", s), n.addEventListener("drop", a), {
    destroy() {
      n.removeEventListener("dragover", i), n.removeEventListener("dragleave", s), n.removeEventListener("drop", a);
    }
  };
}
function wr(n, t) {
  const i = yr(n);
  function s(d) {
    if (Re(n) || !He(n)) {
      d.preventDefault(), t.dragOver(!1);
      return;
    }
    const u = d.dataTransfer, m = Ze(u);
    Gt(u) && !m ? t.dragOver(!0) : t.dragOver(!1);
  }
  function a(d) {
    t.dragOver(!1);
  }
  function o(d) {
    t.dragOver(!1), (Re(n) || !He(n)) && d.preventDefault();
  }
  return n.addEventListener("dragover", s), n.addEventListener("dragleave", a), n.addEventListener("drop", o), {
    destroy() {
      i?.destroy?.(), n.removeEventListener("dragover", s), n.removeEventListener("dragleave", a), n.removeEventListener("drop", o);
    }
  };
}
function br(n) {
  function t(i) {
    if (Re(n)) {
      i.preventDefault();
      return;
    }
    if (!i.clipboardData) return;
    if (!He(n)) {
      Array.from(i.clipboardData.items).some((o) => o.kind === "file" && o.type.startsWith("image/")) && i.preventDefault();
      return;
    }
    const s = [];
    for (const a of i.clipboardData.items)
      if (a.kind === "file" && a.type.startsWith("image/")) {
        const o = a.getAsFile();
        o && s.push(o);
      }
    s.length > 0 && (i.preventDefault(), n.__uploadFiles?.(s));
  }
  return n.addEventListener("paste", t), {
    destroy() {
      n.removeEventListener("paste", t);
    }
  };
}
function Sr(n) {
  function t(s) {
    const a = s.target;
    if (a && (a.closest('.editor-image-button[data-dragging="true"]') || a.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const o = s.touches[0], d = 120, u = kt.querySelector(".tiptap-editor");
      if (u) {
        const m = u.getBoundingClientRect(), b = o.clientY < m.top + d, P = o.clientY > m.bottom - d;
        if (!b && !P)
          return s.preventDefault(), !1;
      }
    }
  }
  function i(s) {
    const a = kt.querySelectorAll(".drop-zone-indicator");
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
  return n.addEventListener("touchmove", t), n.addEventListener("touchend", i), {
    destroy() {
      n.removeEventListener("touchmove", t), n.removeEventListener("touchend", i);
    }
  };
}
function Er(n, t = !0) {
  function i(s) {
    if (t && (s.ctrlKey || s.metaKey) && (s.key === "Enter" || s.key === "NumpadEnter")) {
      s.preventDefault();
      const a = n.__currentEditor, o = typeof a == "function" ? a() : a, d = n.__hasPostingCapability, u = typeof d == "function" ? d() : d, m = n.__hasStoredKey, b = typeof m == "function" ? m() : m, P = n.__postStatus, D = typeof P == "function" ? P() : P, p = o ? mi(o) : "";
      !D?.sending && p.trim() && (u ?? b) && n.__submitPost?.();
    }
  }
  return n.addEventListener("keydown", i), {
    destroy() {
      n.removeEventListener("keydown", i);
    }
  };
}
function Pr(n) {
  let t = !1;
  return n?.descendants((i) => {
    if (t) return !1;
    const s = i.type?.name;
    (s === "image" || s === "video") && (t = !0);
  }), t;
}
function xr(n) {
  const { currentEditor: t, editorContainerEl: i, callbacks: s } = n, a = (u) => {
    const b = u.detail.plainText, P = t ? Pr(t.state?.doc) : !1;
    s.onContentUpdate?.(b, P);
  }, o = (u) => {
    const m = u;
    s.onImageFullscreenRequest?.(m.detail.src, m.detail.alt || "", m.detail.mediaId);
  }, d = (u) => {
    const b = u?.detail?.pos;
    if (b != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const P = fi.create(t.state.doc, b);
        t.view.dispatch(t.state.tr.setSelection(P).scrollIntoView());
      } catch (P) {
        console.warn("select-image-node handler failed:", P);
      }
      s.onSelectImageNode?.(b);
    }
  };
  return window.addEventListener("editor-content-changed", a), window.addEventListener("image-fullscreen-request", o), window.addEventListener("select-image-node", d), i && (i.addEventListener("image-fullscreen-request", o), i.addEventListener("select-image-node", d)), {
    handleContentUpdate: a,
    handleImageFullscreenRequest: o,
    handleSelectImageNode: d
  };
}
function Cr(n, t) {
  window.removeEventListener("editor-content-changed", n.handleContentUpdate), window.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), window.removeEventListener("select-image-node", n.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", n.handleImageFullscreenRequest), t.removeEventListener("select-image-node", n.handleSelectImageNode));
}
function Fr() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function kr(n) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (n?.rejectedRelays?.length ?? 0) > 0 || (n?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function Ir(n) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: n || "postComponent.post_error",
    completed: !1
  };
}
function _r({
  updatePostStatus: n,
  clearContentAfterSuccess: t,
  onPostSuccess: i
}) {
  return {
    markSending: () => {
      n(Fr());
    },
    markSuccess: (s) => {
      n(kr(s)), t(), i?.(s);
    },
    markFailure: (s) => {
      n(Ir(s));
    }
  };
}
async function Mr(n) {
  const t = n.postManager.prepareImageBlurhashMap(
    n.currentEditor,
    n.imageOxMap,
    n.imageXMap
  );
  n.onStart();
  try {
    const i = n.pendingEmojiTags?.length ? await n.postManager.submitPost(
      n.pendingPost,
      t,
      n.pendingEmojiTags
    ) : await n.postManager.submitPost(
      n.pendingPost,
      t
    );
    if (i.success) {
      n.onSuccess(i);
      return;
    }
    n.onFailure(i.error);
  } catch {
    n.onFailure();
  }
}
function Tt(n) {
  if (n.dimensions && n.dimensions.width > 0 && n.dimensions.height > 0)
    return {
      width: n.dimensions.width,
      height: n.dimensions.height
    };
  const t = vi(n.dim);
  return t || {};
}
function Dr(n) {
  if (!n.mediaFreePlacement)
    return n.galleryItems.filter((i) => !i.isPlaceholder).map((i) => {
      const s = Tt({
        dim: i.dim,
        dimensions: i.dimensions
      });
      return {
        id: i.id,
        src: i.src,
        alt: i.alt,
        type: i.type,
        dim: i.dim,
        width: s.width,
        height: s.height
      };
    });
  if (!n.currentEditor)
    return [];
  const t = [];
  return n.currentEditor.state.doc.descendants((i) => {
    if ((i.type.name === "image" || i.type.name === "video") && !i.attrs.isPlaceholder) {
      const s = Tt({
        dim: i.attrs.dim
      });
      t.push({
        id: i.attrs.id,
        src: i.attrs.src,
        alt: i.attrs.alt,
        type: i.type.name,
        dim: i.attrs.dim,
        width: s.width,
        height: s.height
      });
    }
  }), t;
}
function Tr(n, t, i) {
  if (t) {
    const s = n.findIndex((a) => a.id === t);
    if (s >= 0)
      return s;
  }
  return i ? n.findIndex((s) => s.src === i) : -1;
}
function Lr(n, t) {
  return n[t];
}
function Ar(n) {
  const t = [];
  return n.state.doc.descendants((i, s) => {
    (i.type.name === "image" || i.type.name === "video") && !i.attrs.isPlaceholder && t.push({ node: i, pos: s });
  }), t;
}
function Rr(n) {
  const t = Ar(n.currentEditor);
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
  let i = n.currentEditor.state.tr;
  return [...t].reverse().forEach(({ node: s, pos: a }) => {
    i = i.delete(a, a + s.nodeSize);
  }), n.currentEditor.view.dispatch(i), !0;
}
function Hr(n) {
  if (n.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = n.currentEditor.state;
  let i = n.currentEditor.state.tr, s = n.currentEditor.state.doc.content.size;
  const a = {}, o = {};
  return n.items.forEach((d) => {
    if (d.isPlaceholder)
      return;
    const u = d.src;
    if (d.type === "image" && t.nodes.image) {
      const m = t.nodes.image.create({
        src: u,
        alt: d.alt ?? "Image",
        blurhash: d.blurhash ?? null,
        dim: d.dim ?? null,
        size: d.size ?? null,
        uploadProtocol: d.uploadProtocol ?? null
      });
      i = i.insert(s, m), s += m.nodeSize;
    } else if (d.type === "video" && t.nodes.video) {
      const m = t.nodes.video.create({ src: u });
      i = i.insert(s, m), s += m.nodeSize;
    }
    d.ox && (a[u] = d.ox), d.x && (o[u] = d.x);
  }), n.currentEditor.view.dispatch(i), {
    imageOxMap: a,
    imageXMap: o,
    hadItems: !0
  };
}
async function Or(n) {
  const {
    input: t,
    postHistoryRepositoryImpl: i = Bt,
    postMediaCacheRepositoryImpl: s = wi
  } = n;
  await i.putPostedEvent(t);
  const a = yi(t.event).map((o) => o.url).filter(Boolean);
  a.length !== 0 && await s.linkEventIdByUrls({
    eventId: t.event.id,
    urls: a
  });
}
function Wr(n) {
  const {
    placeholderText: t,
    editorContainerEl: i,
    hasStoredKey: s,
    hasPostingCapability: a,
    submitPost: o,
    onCustomEmojiSelect: d,
    enterKeyBehavior: u,
    hostOwnedLite: m,
    uploadFiles: b,
    eventCallbacks: P
  } = n;
  bi.value = t;
  const D = Si({
    isInputBlocked: n.isInputBlocked,
    isCompositionInputAllowed: n.isCompositionInputAllowed,
    compositionController: n.compositionController,
    placeholderText: t,
    onSubmitPost: o,
    onCustomEmojiSelect: d,
    enterKeyBehavior: u,
    hostOwnedLite: m,
    onCreate: (k) => {
      Ce.set(k);
    }
  });
  let p = null;
  const F = D.subscribe((k) => {
    p = k;
  }), O = xr({
    currentEditor: p,
    editorContainerEl: i,
    callbacks: P
  });
  return Ei(o), i && Object.assign(i, {
    __uploadFiles: b,
    __currentEditor: () => p,
    __hasStoredKey: () => s,
    __hasPostingCapability: () => a ?? s,
    __postStatus: () => K.postStatus,
    __submitPost: o
  }), { editor: D, unsubscribe: F, handlers: O };
}
function Br(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: i,
    handlers: s,
    currentEditor: a,
    editorContainerEl: o,
    submitPost: d
  } = n;
  Cr(s, o), Ce.value === a && Ce.set(null), Pi(d), i(), t(), a && !a.isDestroyed && a.destroy(), o && (delete o.__uploadFiles, delete o.__currentEditor, delete o.__hasStoredKey, delete o.__hasPostingCapability, delete o.__postStatus, delete o.__submitPost);
}
function Nr(n, t) {
  const i = n.view.dom;
  if (xi() && document.activeElement !== i) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
var zr = ge('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), jr = ge('<div class="plane-icon svg-icon svelte-15ticnd"></div>'), qr = ge('<div class="editor-submit-button-container svelte-15ticnd"><!></div>'), Gr = ge('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), Ur = ge('<div class="upload-error svelte-15ticnd"> </div>'), Kr = ge('<div class="svelte-15ticnd"> </div>'), Xr = ge('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const Qr = {
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
function $r(n, t) {
  rt(t, !0), Je(n, Qr);
  const i = () => tt(nt, "$_", s), [s, a] = et();
  let o = N(t, "rxNostr", 7), d = N(t, "hasStoredKey", 7), u = N(t, "hasPostingCapability", 23, d), m = N(t, "isSwitchingAccount", 7, !1), b = N(t, "onPostSuccess", 7), P = N(t, "availableComposerHeight", 7, ke), D = N(t, "minEditorHeight", 7, ke), p = N(t, "onCustomEmojiSelect", 7), F = N(t, "onEditorEmptyChange", 7), O = N(t, "notificationPort", 7), k = N(t, "hostOwnedConfig", 7), te = N(t, "hostCustomEmojiItems", 23, () => []), re = N(t, "normalUploadFiles", 7);
  const V = !1;
  let $ = E(() => !V), H = E(() => K.isUploading), pe = E(() => K.canPost), Z = E(() => V), le = Q(null), l = Q(null), G = Q(null), oe = Q(!1), T = Q(!1), R = Q(void 0), v = Q(void 0), M = Q(qe({})), _ = Q(qe({})), fe = E(() => Ye.value), f = E(() => K.postStatus), h = E(() => K.uploadErrorMessage), j = E(() => Vi.value), A = E(() => Ni.value), L = E(() => zi.value), q = Q(!0), B = !1, ve = E(() => d() && !m() && e(A) && !e(L) && e(q)), g = null, I = null, U = null, Y = null, we = Q(qe(ke)), Me = E(() => V), Ut = E(() => e(Me) ? `--post-editor-auto-grow-min-lines: ${k().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${k().editorMaxLines}lh;` : `--post-editor-min-height: ${D()}px; --post-editor-target-height: ${e(we)}px;`), st = E(() => i()("postComponent.enter_your_text") || "テキストを入力してください");
  function J() {
    return e(f).sending || e(oe);
  }
  Se(() => {
    e(l), Ci(e(st));
  }), Se(() => {
  });
  function at() {
    if (e(Me)) return;
    const r = D();
    if (!g || !I) {
      y(we, r, !0);
      return;
    }
    const c = Array.from(g.children).reduce(
      (x, C) => C === I ? x : x + Gi(C),
      0
    ), w = Ui({
      availableComposerHeight: P(),
      nonEditorHeight: c,
      minHeight: r
    });
    e(we) !== w && y(we, w, !0);
  }
  function Kt(r) {
    if (J()) {
      r.preventDefault();
      return;
    }
    !(r.target instanceof HTMLElement) || !e(l) || Bi(r.target) || e(l).commands.focus("end");
  }
  function Xt(r) {
    !e(l) || r.currentTarget !== r.target || r.key !== "Enter" && r.key !== " " || (r.preventDefault(), e(l).commands.focus("end"));
  }
  function Qt(r) {
    J() && (e(G)?.isCompositionInputAllowed() && (r.isComposing || r.keyCode === 229) || (r.preventDefault(), r.stopPropagation()));
  }
  function Oe(r) {
    const c = e(G)?.isCompositionInputAllowed() && r instanceof InputEvent && (r.isComposing || r.inputType === "insertCompositionText" || r.inputType === "insertFromComposition");
    J() && !c && (r.preventDefault(), r.stopPropagation());
  }
  function $t(r) {
    r.preventDefault();
  }
  function Yt(r) {
    const c = e(l)?.view.dom;
    !e(Z) || !c || r.relatedTarget !== c || c.focus({ preventScroll: !0 });
  }
  let be = E(() => de.value), Ge = E(() => e(be).showSecretKeyDialog), lt = E(() => e(be).showImageFullscreen), Vt = E(() => e(be).fullscreenMediaId), dt = E(() => e(be).fullscreenImageSrc), Zt = E(() => e(be).fullscreenImageAlt), ct = E(() => e(be).showFloatingMessage), Jt = E(() => e(be).floatingMessageX), en = E(() => e(be).floatingMessageY), tn = E(() => e(be).floatingMessageText);
  Se(() => {
    o() && (e(v) ? e(v).setRxNostr(o()) : y(
      v,
      new nr(o(), {
        getNip46SignerForSessionFn: (r) => Ii.getSignerForSession(r),
        getParentClientSignerFn: () => ki.getSigner(),
        channelContextState: Fi,
        replyQuoteState: Rt,
        replyQuoteService: new je(),
        clearReplyQuoteFn: Ve,
        savePostHistoryFn: (r) => Or({ input: r, postHistoryRepositoryImpl: Bt }),
        notificationPort: O()
      }),
      !0
    ));
  });
  const Ue = sr({
    getCurrentEditor: () => e(l),
    getFileInput: () => e(R),
    getImageOxMap: () => e(M),
    getImageXMap: () => e(_),
    getUploadFailedText: (r) => i()(r),
    updateUploadState: (r, c) => {
      rr(K, r, c);
    },
    setUploadErrorMessage: (r) => {
      K.uploadErrorMessage = r;
    },
    uploadFiles: async (r) => {
      if (J() || K.isSubmitPending || K.isUploading || V)
        return null;
      {
        if (re()) return await re()(r);
        const { uploadFiles: c } = await import("./App-BBD-wmht.js").then((w) => w.ey);
        return await c(r);
      }
    }
  });
  function nn() {
    const r = !!(e(l)?.view.composing && qi());
    r && e(l)?.view.dom.blur(), ht(), r ? e(G)?.retire() : e(G)?.markStale();
  }
  const De = _r({
    updatePostStatus: It,
    clearContentAfterSuccess: nn,
    onPostSuccess: (r) => b()?.(r)
  });
  function ut(r) {
    e(G)?.markFailure(), De.markFailure(r);
  }
  Se(() => {
    if (e(Me)) return;
    if (P(), D(), e(fe), e(h), e(l), e(fe) || ie.items.length, typeof window > "u") {
      y(we, ke, !0);
      return;
    }
    const r = window.requestAnimationFrame(() => {
      at();
    });
    return () => {
      window.cancelAnimationFrame(r);
    };
  }), Se(() => {
    if (e(Me) || (P(), D(), e(l), e(fe), e(h), !g || typeof ResizeObserver > "u"))
      return;
    let r = null;
    const c = () => {
      r === null && (r = window.requestAnimationFrame(() => {
        r = null, at();
      }));
    }, w = new ResizeObserver(c);
    c(), w.observe(g);
    for (const x of Array.from(g.children))
      x !== I && w.observe(x);
    return () => {
      w.disconnect(), r !== null && window.cancelAnimationFrame(r);
    };
  }), _i(() => {
    y(oe, !1), y(
      G,
      new tr((S) => {
        y(oe, S === "stale");
      }),
      !0
    ), U = Wr({
      isInputBlocked: J,
      isCompositionInputAllowed: () => !!e(G)?.isCompositionInputAllowed(),
      compositionController: e(G) ?? void 0,
      placeholderText: e(st),
      editorContainerEl: I,
      currentEditor: e(l),
      hasStoredKey: d(),
      hasPostingCapability: u(),
      submitPost: We,
      onCustomEmojiSelect: p(),
      enterKeyBehavior: void 0,
      hostOwnedLite: V,
      uploadFiles: e($) ? (S) => {
        J() || Ue.performUpload(S);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: ji,
        onImageFullscreenRequest: (S, ne, xe) => {
          de.showImageFullscreen(S, ne, xe || "");
        },
        onSelectImageNode: (S) => {
        }
      }
    }), y(le, U.editor, !0);
    let r = null;
    const c = (S) => {
      const ne = S.isEmpty, xe = !B || e(q) !== ne;
      y(q, ne, !0), B = !0, xe && F()?.(ne);
    }, w = (S) => {
      Ne(S, ie.hasNonPlaceholderItems());
    }, x = ({ editor: S }) => {
      c(S), w(S);
    };
    Y = e(le).subscribe((S) => {
      if (S !== null && S === r) {
        y(l, S, !0), S && (c(S), w(S));
        return;
      }
      r && r.off("transaction", x), r = S, y(l, S, !0), S ? (e(G)?.attach(S), c(S), w(S)) : (e(G)?.detach(), Ne(null, !1)), S?.on("transaction", x), Ce.set(S);
    });
    const C = (S) => {
      const ne = S, { src: xe, alt: Bn, mediaId: Nn } = ne.detail;
      de.showImageFullscreen(xe, Bn, Nn || "");
    };
    return window.addEventListener("image-fullscreen-request", C), () => {
      e(G)?.destroy(), y(G, null), y(oe, !1), Ne(null, !1), Ce.value === e(l) && (K.isSubmitPending = !1, de.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", C), U && (r && r.off("transaction", x), Br({
        unsubscribe: U.unsubscribe,
        componentUnsubscribe: Y ?? (() => {
        }),
        handlers: U.handlers,
        currentEditor: e(l),
        editorContainerEl: I,
        submitPost: We
      }), Y = null);
    };
  });
  const rn = Ue.handleFileSelect;
  async function on(r) {
    return J() ? null : await Ue.performUpload(r);
  }
  function sn() {
    e(l)?.commands.focus();
  }
  function an() {
    e(l)?.commands.blur();
  }
  function ln(r) {
    if (!e(l) || !r || J()) return;
    const c = e(
      l
      // nullチェック済みのローカル変数
    ), x = r.split(`
`).map((C) => ({
      type: "paragraph",
      content: C ? [{ type: "text", text: C }] : void 0
    }));
    c.commands.setContent({ type: "doc", content: x }), c.commands.focus("end");
  }
  function dn(r) {
    if (!e(l) || !r || J()) return !1;
    const w = r.split(`
`).map((x) => ({
      type: "paragraph",
      content: x ? [{ type: "text", text: x }] : void 0
    }));
    return e(l).isEmpty ? e(l).commands.setContent({ type: "doc", content: w }) : e(l).chain().focus("end").insertContent([{ type: "paragraph" }, ...w]).run(), e(l).commands.focus("end"), !0;
  }
  function cn(r) {
    if (!e(l) || !r || J()) return;
    const c = Di(r);
    e(l).commands.setContent(c || "<p></p>"), e(l).commands.focus("end");
  }
  function un() {
    return e(l) ? e(l).getHTML() : "";
  }
  function gn(r) {
    if (!e(l) || r.length === 0 || J()) return;
    const { schema: c } = e(l).state;
    let w = e(l).state.tr, x = e(l).state.doc.content.size;
    r.forEach((C) => {
      if (C.isPlaceholder) return;
      const S = C.src;
      if (C.type === "image" && c.nodes.image) {
        const ne = c.nodes.image.create({
          src: S,
          alt: C.alt ?? "Image",
          blurhash: C.blurhash ?? null,
          dim: C.dim ?? null,
          size: C.size ?? null,
          uploadProtocol: C.uploadProtocol ?? null
        });
        w = w.insert(x, ne), x += ne.nodeSize, C.ox && y(M, { ...e(M), [S]: C.ox }, !0), C.x && y(_, { ...e(_), [S]: C.x }, !0);
      } else if (C.type === "video" && c.nodes.video) {
        const ne = c.nodes.video.create({ src: S });
        w = w.insert(x, ne), x += ne.nodeSize;
      }
    }), e(l).view.dispatch(w), e(l).commands.focus("end");
  }
  function hn(r) {
    !e(l) || J() || Nr(e(l), r);
  }
  function Ke() {
    if (!e(l)) return;
    Hi(e(l).view.dom) || Oi(e(l));
  }
  function gt(r) {
    if (!e(l) || J()) return;
    Ke();
    const { state: c, view: w } = e(l), x = r < 0 ? c.selection.from : c.selection.to, C = Math.max(0, Math.min(c.doc.content.size, x + r));
    if (C === x) return;
    const S = Ri.near(c.doc.resolve(C), r);
    w.dispatch(c.tr.setSelection(S).scrollIntoView().setMeta("addToHistory", !1));
  }
  function pn() {
    gt(-1);
  }
  function fn() {
    gt(1);
  }
  function mn() {
    if (!e(l) || J()) return;
    Ke();
    const { state: r, view: c } = e(l), { selection: w } = r;
    if (!w.empty) {
      e(l).commands.deleteSelection();
      return;
    }
    const C = w.$from.nodeBefore;
    if (C) {
      const S = C.isText ? Array.from(C.text ?? "").at(-1)?.length ?? 0 : C.nodeSize;
      S > 0 && c.dispatch(r.tr.delete(w.from - S, w.from).scrollIntoView());
      return;
    }
    e(l).commands.first(({ commands: S }) => [
      () => S.joinBackward(),
      () => S.selectNodeBackward()
    ]);
  }
  function vn() {
    !e(l) || J() || (Ke(), e(l).commands.keyboardShortcut("Enter"));
  }
  function yn() {
    return Xe() && Wi(e(l), ie.hasNonPlaceholderItems()) && !K.isSubmitPending && !e(Ge);
  }
  function Xe() {
    return !!e(l) && !!e(v) && !m() && !e(f).sending && !K.isUploading && !e(f).completed && u();
  }
  async function We(r) {
    if (!e(l) || !yn() || !e(v)) return;
    const c = e(l);
    K.isSubmitPending = !0;
    try {
      if (c.isDestroyed || Ce.value !== c || !Xe()) return;
      const w = e(v).preparePostPayload(c);
      if (Ti(c.state.doc), Li(w.content)) {
        de.showSecretKeyDialog(w.content, w.emojiTags), K.isSubmitPending = !1;
        return;
      }
      c.view.composing && e(G)?.startSession(_t.getState(c.state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await e(v).performPostSubmission(
        c,
        w,
        e(M),
        e(_),
        () => {
          De.markSending(), K.isSubmitPending = !1;
        },
        De.markSuccess,
        ut
      );
    } finally {
      Ce.value === c && (K.isSubmitPending = !1);
    }
  }
  function wn() {
    if (e(l)) {
      if (e(v)) {
        e(v).resetPostContent(e(l));
        return;
      }
      e(l).chain().clearContent().run();
    }
  }
  function ht() {
    if (e(v) && e(l)) {
      e(v).clearContentAfterSuccess(e(l));
      return;
    }
    if (e(l)) {
      const r = k()?.hashtagPinEnabled === !0 && Ht.value ? [...Ot().hashtags] : [];
      e(l).chain().clearContent().run(), Lt.reset(), At.reset(), ie.clearAll(), y(M, {}, !0), y(_, {}, !0), Ve(), r.length > 0 && e(l).commands.insertContent(` ${r.map((c) => `#${c}`).join(" ")}`), e(l).commands.focus("start");
    }
  }
  async function bn() {
    if (!e(Ge) || !Xe()) return;
    const r = de.getPendingPost(), c = de.getPendingEmojiTags();
    r.trim() && e(v) && e(l) && (e(l).view.composing && e(G)?.startSession(_t.getState(e(l).state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await Mr({
      postManager: e(v),
      currentEditor: e(l),
      imageOxMap: e(M),
      imageXMap: e(_),
      pendingPost: r,
      pendingEmojiTags: c,
      onStart: () => {
        De.markSending(), de.hideSecretKeyDialog();
      },
      onSuccess: De.markSuccess,
      onFailure: ut
    }));
  }
  const Sn = de.hideSecretKeyDialog, En = de.hideImageFullscreen;
  let Qe = E(() => Dr({
    mediaFreePlacement: e(fe),
    galleryItems: ie.items,
    currentEditor: e(l)
  })), Pn = E(() => Tr(e(Qe), e(Vt), e(dt)));
  function xn(r) {
    const c = Lr(e(Qe), r);
    c && de.showImageFullscreen(c.src, c.alt ?? "", c.id ?? "");
  }
  Se(() => {
    e(l) && e(v) && e(v).preparePostContent(e(l)) !== K.content && e(f).error && It({ ...e(f), error: !1, message: "" });
  });
  function Cn() {
    !e($) || J() || K.isSubmitPending || K.isUploading || e(R)?.click();
  }
  Se(() => {
    const r = ie.items.some((c) => !c.isPlaceholder);
    Ne(e(l), r);
  });
  let pt = !0;
  Se(() => {
    const r = !Ye.value;
    if (pt) {
      pt = !1;
      return;
    }
    if (!e(l)) return;
    const c = e(l);
    if (r)
      Le(() => Rr({
        currentEditor: c,
        imageOxMap: e(M),
        imageXMap: e(_),
        addGalleryItem: (x) => ie.addItem(x),
        createMediaItemId: Ai
      })) && Le(() => {
        y(M, {}, !0), y(_, {}, !0);
      });
    else {
      const w = Le(() => ie.getItems()), x = Hr({ currentEditor: c, items: w });
      x.hadItems && Le(() => {
        y(M, x.imageOxMap, !0), y(_, x.imageXMap, !0);
      }), Le(() => ie.clearAll());
    }
  });
  var Fn = {
    uploadFiles: on,
    focusEditor: sn,
    blurEditor: an,
    insertTextContent: ln,
    appendSharedTextContent: dn,
    loadDraftContent: cn,
    getEditorHtml: un,
    appendMediaToEditor: gn,
    insertCustomEmoji: hn,
    moveCaretLeft: pn,
    moveCaretRight: fn,
    deleteBackward: mn,
    insertLineBreak: vn,
    submitPost: We,
    resetPostContent: wn,
    clearContentAfterSuccess: ht,
    openFileDialog: Cn,
    get rxNostr() {
      return o();
    },
    set rxNostr(r) {
      o(r), z();
    },
    get hasStoredKey() {
      return d();
    },
    set hasStoredKey(r) {
      d(r), z();
    },
    get hasPostingCapability() {
      return u();
    },
    set hasPostingCapability(r = d) {
      u(r), z();
    },
    get isSwitchingAccount() {
      return m();
    },
    set isSwitchingAccount(r = !1) {
      m(r), z();
    },
    get onPostSuccess() {
      return b();
    },
    set onPostSuccess(r) {
      b(r), z();
    },
    get availableComposerHeight() {
      return P();
    },
    set availableComposerHeight(r = ke) {
      P(r), z();
    },
    get minEditorHeight() {
      return D();
    },
    set minEditorHeight(r = ke) {
      D(r), z();
    },
    get onCustomEmojiSelect() {
      return p();
    },
    set onCustomEmojiSelect(r) {
      p(r), z();
    },
    get onEditorEmptyChange() {
      return F();
    },
    set onEditorEmptyChange(r) {
      F(r), z();
    },
    get notificationPort() {
      return O();
    },
    set notificationPort(r) {
      O(r), z();
    },
    get hostOwnedConfig() {
      return k();
    },
    set hostOwnedConfig(r) {
      k(r), z();
    },
    get hostCustomEmojiItems() {
      return te();
    },
    set hostCustomEmojiItems(r = []) {
      te(r), z();
    },
    get normalUploadFiles() {
      return re();
    },
    set normalUploadFiles(r) {
      re(r), z();
    }
  }, ft = Xr(), Fe = zt(ft);
  let mt;
  var X = ye(Fe);
  let vt;
  var yt = ye(X);
  {
    var kn = (r) => {
      var c = zr(), w = ye(c);
      {
        let x = E(() => e(j)?.picture || "");
        Ki(w, {
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
      me(c), ae(r, c);
    };
    se(yt, (r) => {
      e(ve) && r(kn);
    });
  }
  var wt = ue(yt, 2);
  {
    var In = (r) => {
      Xi(r, {
        get editor() {
          return e(l);
        },
        class: "editor-content"
      });
    };
    se(wt, (r) => {
      e(le) && e(l) && r(In);
    });
  }
  var _n = ue(wt, 2);
  {
    var Mn = (r) => {
      var c = qr(), w = ye(c);
      {
        let x = E(() => !e(pe) || e(f).sending || e(H) || !u() || e(f).completed), C = E(() => i()("postComponent.post"));
        Qi(w, {
          variant: "primary",
          shape: "circle",
          contentLayout: "icon",
          className: "editor-submit-button",
          get disabled() {
            return e(x);
          },
          onClick: () => {
            !e(pe) || e(f).sending || e(H) || !u() || e(f).completed || We();
          },
          onfocus: Yt,
          get ariaLabel() {
            return e(C);
          },
          children: (S, ne) => {
            var xe = jr();
            ae(S, xe);
          },
          $$slots: { default: !0 }
        });
      }
      me(c), ee("pointerdown", c, $t, !0), ae(r, c);
    };
    se(_n, (r) => {
      e(Z) && r(Mn);
    });
  }
  me(X), ze(X, (r, c) => wr?.(r, c), () => ({ dragOver: (r) => y(T, r, !0) })), ze(X, (r) => br?.(r)), ze(X, (r) => Sr?.(r)), ze(X, (r, c) => Er?.(r, c), () => !V), Ie(X, (r) => I = r, () => I);
  var bt = ue(X, 2);
  {
    var Dn = (r) => {
      qt(r, {});
    };
    se(bt, (r) => {
      e(fe) || r(Dn);
    });
  }
  var St = ue(bt, 2);
  {
    var Tn = (r) => {
      var c = Gr();
      Ie(c, (w) => y(R, w), () => e(R)), Ee("change", c, rn), ae(r, c);
    };
    se(St, (r) => {
      e($) && r(Tn);
    });
  }
  var Ln = ue(St, 2);
  {
    var An = (r) => {
      var c = Ur(), w = ye(c, !0);
      me(c), Pe(() => Mt(w, e(h))), ae(r, c);
    };
    se(Ln, (r) => {
      e(h) && r(An);
    });
  }
  me(Fe), Ie(Fe, (r) => g = r, () => g);
  var Et = ue(Fe, 2);
  {
    var Rn = (r) => {
      {
        let c = E(() => i()("postComponent.warning")), w = E(() => i()("postComponent.secret_key_detected")), x = E(() => i()("postComponent.post")), C = E(() => i()("postComponent.cancel"));
        $i(r, {
          get open() {
            return e(Ge);
          },
          get title() {
            return e(c);
          },
          get description() {
            return e(w);
          },
          get confirmLabel() {
            return e(x);
          },
          get cancelLabel() {
            return e(C);
          },
          confirmVariant: "danger",
          onConfirm: bn,
          get onCancel() {
            return Sn;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    se(Et, (r) => {
      r(Rn);
    });
  }
  var Pt = ue(Et, 2);
  Mi(Pt, {
    get src() {
      return e(dt);
    },
    get alt() {
      return e(Zt);
    },
    get onClose() {
      return En;
    },
    get mediaList() {
      return e(Qe);
    },
    get currentIndex() {
      return e(Pn);
    },
    onNavigate: xn,
    get show() {
      return e(lt);
    },
    set show(r) {
      y(lt, r);
    }
  });
  var Hn = ue(Pt, 2);
  {
    var On = (r) => {
      Yi(r, {
        get show() {
          return e(ct);
        },
        get x() {
          return e(Jt);
        },
        get y() {
          return e(en);
        },
        children: (c, w) => {
          var x = Kr(), C = ye(x, !0);
          me(x), Pe(() => Mt(C, e(tn))), ae(c, x);
        },
        $$slots: { default: !0 }
      });
    };
    se(Hn, (r) => {
      e(ct) && r(On);
    });
  }
  Pe(
    (r) => {
      mt = _e(Fe, 1, "post-container svelte-15ticnd", null, mt, { "editor-auto-grow": e(Me) }), Wt(Fe, e(Ut)), vt = _e(X, 1, "editor-container svelte-15ticnd", null, vt, {
        "drag-over": e(T),
        "gallery-mode": !e(fe),
        sending: e(f).sending || e(oe),
        "editor-submit-enabled": e(Z),
        "account-avatar-placeholder": e(ve)
      }), ce(X, "aria-label", r), ce(X, "aria-readonly", e(f).sending || e(oe) ? "true" : void 0), ce(X, "aria-disabled", void 0);
    },
    [() => i()("postComponent.editor_label")]
  ), Ee("click", X, Kt), ee("keydown", X, Qt, !0), Ee("keydown", X, Xt), ee("beforeinput", X, Oe, !0), ee("paste", X, Oe, !0), ee("cut", X, Oe, !0), ee("drop", X, Oe, !0), ae(n, ft);
  var Wn = ot(Fn);
  return a(), Wn;
}
Nt(["click", "keydown", "change"]);
it(
  $r,
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
  $r as default
};
