import { a as zn, h as xt, m as Ye, b as ie, c as Lt, d as At, k as jn, e as qn, s as Gn, w as Kn, r as Rt, f as Un, i as Ct, j as Xn, l as Qn, n as $n, o as Yn, p as Vn, q as Ht, t as Zn, u as Ve, P as Jn, v as ei, x as Be, y as ti, z as ni, A as ii, B as ri, C as oi, R as je, D as si, E as Ot, F as ai, G as li, H as Je, I as N, J as di, K as ae, L as Ie, M as _e, N as ue, O as Wt, Q as et, S as ci, T as ui, U as gi, V as tt, $ as nt, W as hi, X as K, Y as Te, Z as Ft, _ as pi, a0 as fi, a1 as kt, a2 as mi, a3 as vi, a4 as Bt, a5 as yi, a6 as wi, a7 as bi, a8 as Si, a9 as Ce, aa as Ei, ab as Pi, ac as xi, ad as ke, ae as Ci, af as Fi, ag as ki, ah as Ii, ai as _i, aj as It, ak as Ne, al as ze, am as Mi, an as Di, ao as Ti, ap as Li, aq as _t, ar as Ai, as as Ri, at as Hi, au as Oi, av as Wi, aw as Bi, ax as Ni, ay as zi, az as ji, aA as qi, aB as Gi, aC as Ki, aD as Ui, aE as Xi, aF as Qi, aG as $i, aH as Yi, aI as Vi } from "./App-C8cvgCUG.js";
import { bk as $e, aK as qe, aq as Nt, b6 as it, b0 as rt, a as e, bf as ge, b as v, Z as Pe, bD as ee, ap as Ee, b3 as le, b4 as ot, aT as Y, ba as he, b8 as me, aS as P, b5 as z, bg as Zi, b9 as pe, aO as Se, b1 as Ji, b2 as zt, bl as er, u as Le, bi as Mt } from "./entry-B5mD5NTa.js";
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
    this.deps = i, t && this.setRxNostr(t), this.deps.console = i.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = i.authStateStore || zn, this.deps.hashtagStore = i.hashtagStore || xt, this.deps.mediaFreePlacementStore = i.mediaFreePlacementStore || Ye, this.deps.mediaGalleryStore = i.mediaGalleryStore || ie, this.deps.contentWarningStore = i.contentWarningStore || Lt, this.deps.contentWarningReasonStore = i.contentWarningReasonStore || At, this.deps.keyManager = i.keyManager || jn, this.deps.createImetaTagFn = i.createImetaTagFn || qn, this.deps.settingsStore = i.settingsStore || Gn, this.deps.writeRelaysStore = i.writeRelaysStore || Kn, this.deps.replyQuoteState = i.replyQuoteState || Rt, this.deps.getClientTagFn = i.getClientTagFn || (() => Un(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = i.seckeySignerFn || Ct, this.deps.extractContentWithImagesFn = i.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = i.extractContentWithEmojiTagsFn || (i.extractContentWithImagesFn ? (s) => ({ content: i.extractContentWithImagesFn(s), emojiTags: [] }) : Xn), this.deps.extractImageBlurhashMapFn = i.extractImageBlurhashMapFn || Qn, this.deps.resetEditorStateFn = i.resetEditorStateFn || $n, this.deps.resetPostStatusFn = i.resetPostStatusFn || Yn, this.deps.notificationPort = i.iframeMessageService || i.notificationPort || Vn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = i.hashtagPinStore || Ht, this.deps.saveHashtagsToHistoryFn = i.saveHashtagsToHistoryFn || Zn, this.deps.clearReplyQuoteFn = i.clearReplyQuoteFn || Ve;
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
      t.emojiTags,
      t.failClosedContentWarning
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
    const l = ii(o);
    if (!l)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: o?.kind ?? "(missing)"
    }), i && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), Be(this.deps.authStateStore, t.sessionPubkey);
    const u = await this.eventSender.sendEvent(l.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: u.success
    });
    const m = u.success ? {
      ...u,
      eventId: u.eventId ?? l.event.id,
      event: l.event
    } : u;
    return await this.saveSubmittedPostHistory({
      event: l.event,
      attestation: l.attestation,
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
    const o = this.deps.settingsStore.quoteNotificationEnabled, l = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      a,
      o
    ) ?? new je().extractInlineQuoteTags(
      a,
      o
    ), u = this.deps.replyQuoteState.value;
    if (u.quotes.length > 0) {
      const w = this.deps.replyQuoteService || new je(), x = new Set(
        l.filter((p) => p[0] === "q").map((p) => p[1])
      ), T = u.quotes.filter((p) => !x.has(p.eventId)).map(
        (p) => w.generateNostrUri(
          p.eventId,
          p.relayHints,
          p.authorPubkey
        )
      );
      T.length > 0 && (a = `${a.trimEnd()}
${T.join(`
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
      const w = this.deps.authStateStore, x = si(w), T = this.deps.hashtagStore, { hashtags: p, tags: I } = this.getHashtagArrays(T), R = this.deps.keyManager, _ = this.deps.window || (typeof window < "u" ? window : void 0), te = this.deps.contentWarningStore.value, re = this.deps.contentWarningReasonStore.value, ve = this.deps.settingsStore.failClosedContentWarning === !0, U = this.deps.channelContextState?.value ?? null, de = U?.channelRelays, V = this.deps.replyQuoteState.value;
      let H;
      const oe = this.getReplyQuoteNotifyOptions();
      if (V.reply || V.quotes.length > 0) {
        const D = this.deps.replyQuoteService || new je();
        H = [], V.reply && (U ? (H.push([
          "e",
          V.reply.eventId,
          V.reply.relayHints[0] || "",
          "reply",
          ...V.reply.authorPubkey ? [V.reply.authorPubkey] : []
        ]), D.buildReplyTags(V.reply).filter((k) => k[0] === "p").forEach((k) => {
          H.push(k);
        })) : H.push(...D.buildReplyTags(V.reply)));
        const S = /* @__PURE__ */ new Set(), E = new Set(
          H.filter((k) => k[0] === "p").map((k) => k[1])
        );
        V.quotes.forEach((k) => {
          D.buildQuoteTags(k, k.quoteNotificationEnabled).forEach((Q) => {
            if (Q[0] === "q") {
              if (S.has(Q[1]))
                return;
              S.add(Q[1]);
            }
            if (Q[0] === "p") {
              if (E.has(Q[1]))
                return;
              E.add(Q[1]);
            }
            H.push(Q);
          });
        });
      }
      if (l.length > 0) {
        H || (H = []);
        const D = new Set(
          H.filter((E) => E[0] === "q").map((E) => E[1])
        ), S = new Set(
          H.filter((E) => E[0] === "p").map((E) => E[1])
        );
        for (const E of l)
          E[0] === "q" && !D.has(E[1]) ? (H.push(E), D.add(E[1])) : E[0] === "p" && !S.has(E[1]) && (H.push(E), S.add(E[1]));
      }
      const X = w.value;
      if (X.type === "nip07" && R.isWindowNostrAvailable() && _?.nostr)
        try {
          const D = X.pubkey;
          if (!D)
            return this.notifyPostFailure("pubkey_not_found");
          const S = typeof _.nostr.signEvent == "function" ? _.nostr.signEvent.bind(_.nostr) : void 0;
          if (!S)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const E = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: I,
            pubkey: D,
            imageImetaMap: i,
            contentWarningEnabled: te,
            contentWarningReason: re,
            failClosedContentWarning: ve,
            replyQuoteTags: H,
            channelContext: U,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: E,
            sessionPubkey: x,
            hashtags: p,
            rqNotifyOptions: oe,
            signEvent: S,
            logSignedEvent: !0,
            additionalWriteRelays: de
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (X.type === "nip46")
        try {
          const D = X.pubkey;
          if (!D)
            return this.notifyPostFailure("pubkey_not_found");
          const S = await this.deps.getNip46SignerForSessionFn?.(D), E = this.deps.authStateStore.value;
          if (!S || !E.isAuthenticated || E.type !== "nip46" || E.pubkey !== D)
            return this.notifyPostFailure("nip46_signer_not_available");
          const k = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: I,
            pubkey: D,
            imageImetaMap: i,
            contentWarningEnabled: te,
            contentWarningReason: re,
            failClosedContentWarning: ve,
            replyQuoteTags: H,
            channelContext: U,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: k,
            sessionPubkey: x,
            hashtags: p,
            rqNotifyOptions: oe,
            signer: S,
            additionalWriteRelays: de
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (X.type === "parentClient") {
        const D = this.deps.getParentClientSignerFn?.();
        if (!D)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const S = X.pubkey;
        if (!S)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const E = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: p,
            tags: I,
            pubkey: S,
            imageImetaMap: i,
            contentWarningEnabled: te,
            contentWarningReason: re,
            failClosedContentWarning: ve,
            replyQuoteTags: H,
            channelContext: U,
            emojiTags: s
          });
          return await this.sendPreparedEvent({
            event: E,
            sessionPubkey: x,
            hashtags: p,
            rqNotifyOptions: oe,
            signer: D,
            additionalWriteRelays: de
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const W = R.getFromStore() || R.loadFromStorage(X.pubkey);
      if (!W)
        return this.notifyPostFailure("key_not_found");
      const se = await this.buildSubmissionEvent({
        processedContent: a,
        hashtags: p,
        tags: I,
        imageImetaMap: i,
        contentWarningEnabled: te,
        contentWarningReason: re,
        failClosedContentWarning: ve,
        replyQuoteTags: H,
        channelContext: U,
        emojiTags: s
      }), ye = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(W) : Ct(W);
      return await this.sendPreparedEvent({
        event: se,
        sessionPubkey: x,
        hashtags: p,
        rqNotifyOptions: oe,
        signer: ye,
        additionalWriteRelays: de
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
    const o = this.deps.extractImageBlurhashMapFn(t), l = {};
    for (const [u, m] of Object.entries(o))
      l[u] = {
        m: ai(u),
        blurhash: m,
        dim: a[u]?.dim,
        alt: a[u]?.alt,
        size: a[u]?.size,
        uploadProtocol: a[u]?.uploadProtocol,
        ox: i[u],
        x: s[u]
      };
    return l;
  }
  async performPostSubmission(t, i, s, a, o, l, u) {
    const m = this.prepareImageBlurhashMap(t, s, a);
    o?.();
    try {
      const w = await this.submitPost(i.content, m, i.emojiTags);
      w.success ? l?.(w) : u?.(w.error || "post_error");
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
  setUploadErrorMessage: l,
  uploadFiles: u
}) {
  const m = async (x) => ir(x) ? await u({
    files: x,
    currentEditor: n(),
    fileInput: t(),
    updateUploadState: o,
    setUploadErrorMessage: l,
    imageOxMap: i(),
    imageXMap: s(),
    getUploadFailedText: a
  }) ?? null : null;
  return {
    performUpload: m,
    handleFileSelect: (x) => {
      const T = or(x);
      T && m(T);
    }
  };
}
let O = qe({
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
const ce = {
  get value() {
    return O;
  },
  // 秘密鍵ダイアログ
  showSecretKeyDialog: (n, t = []) => {
    O.pendingPost = n, O.pendingEmojiTags = t.map((i) => [...i]), O.showSecretKeyDialog = !0;
  },
  hideSecretKeyDialog: () => {
    O.showSecretKeyDialog = !1, O.pendingPost = "", O.pendingEmojiTags = [];
  },
  getPendingPost: () => O.pendingPost,
  getPendingEmojiTags: () => O.pendingEmojiTags.map((n) => [...n]),
  // 画像フルスクリーン
  showImageFullscreen: (n, t = "", i = "") => {
    O.fullscreenMediaId = i, O.fullscreenImageSrc = n, O.fullscreenImageAlt = t, O.showImageFullscreen = !0;
  },
  hideImageFullscreen: () => {
    O.showImageFullscreen = !1, O.fullscreenMediaId = "", O.fullscreenImageSrc = "", O.fullscreenImageAlt = "";
  },
  // フローティングメッセージ
  showFloatingMessage: (n, t, i, s = 1800) => {
    Dt(), O.floatingMessageX = n, O.floatingMessageY = t, O.floatingMessageText = i, O.showFloatingMessage = !0, Ae = setTimeout(
      () => {
        O.showFloatingMessage = !1, Ae = void 0;
      },
      s
    );
  },
  hideFloatingMessage: () => {
    Dt(), O.showFloatingMessage = !1;
  }
};
var ar = he('<img draggable="false"/>'), lr = he('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), dr = he('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
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
  let o = N(t, "item", 7), l = N(t, "index", 7), u = N(t, "onDelete", 7), m = N(t, "onDragStart", 7), w = N(t, "onDragOver", 7), x = N(t, "onDragEnd", 7), T = N(t, "onDrop", 7), p = N(t, "onTouchDragStart", 7), I = N(t, "disabled", 7, !1), R = Y(void 0), _ = Y(void 0);
  const te = gi();
  di(() => e(R), {
    onLongPress: (g, M) => {
      I() || p()?.(l(), g, M);
    }
  });
  let re = P(() => !o().isPlaceholder && o().type === "image" && !!o().src), ve = P(() => !o().isPlaceholder && o().type === "video" && !!o().src);
  const U = 180, de = 100, V = 180;
  let H = P(() => {
    if (!o().isPlaceholder) return;
    const g = o().dimensions;
    if (g && g.width > 0 && g.height > 0) {
      const M = g.width / g.height, G = Math.round(U * M);
      return `width: ${Math.max(de, Math.min(V, G))}px; height: ${U}px;`;
    }
    return `width: ${V}px; height: ${U}px;`;
  });
  function oe() {
    o().isPlaceholder || o().type !== "image" || ce.showImageFullscreen(o().src, o().alt || "", o().id);
  }
  function X(g) {
    if (I()) {
      g.preventDefault();
      return;
    }
    if (e(R) && g.dataTransfer) {
      const M = e(R).getBoundingClientRect(), G = g.clientX - M.left, Z = g.clientY - M.top;
      g.dataTransfer.setDragImage(e(R), G, Z);
    }
    m()(l(), g);
  }
  function d(g) {
    g.stopPropagation(), e(_) && (e(_).paused ? e(_).play() : e(_).pause());
  }
  function W(g) {
    g.preventDefault(), !I() && w()(l(), g);
  }
  function se(g) {
    g.preventDefault(), !I() && T()(l());
  }
  function ye(g) {
    o().type !== "image" || o().isPlaceholder || (g.key === "Enter" || g.key === " " || g.key === "Spacebar") && (g.preventDefault(), oe());
  }
  var D = {
    get item() {
      return o();
    },
    set item(g) {
      o(g), z();
    },
    get index() {
      return l();
    },
    set index(g) {
      l(g), z();
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
      return w();
    },
    set onDragOver(g) {
      w(g), z();
    },
    get onDragEnd() {
      return x();
    },
    set onDragEnd(g) {
      x(g), z();
    },
    get onDrop() {
      return T();
    },
    set onDrop(g) {
      T(g), z();
    },
    get onTouchDragStart() {
      return p();
    },
    set onTouchDragStart(g) {
      p(g), z();
    },
    get disabled() {
      return I();
    },
    set disabled(g = !1) {
      I(g), z();
    }
  }, S = dr();
  let E;
  var k = me(S), Q = me(k);
  {
    var f = (g) => {
      {
        let M = P(() => o().type === "video" ? i()("videoNode.uploading") : i()("imageNode.uploading"));
        ci(g, {
          get text() {
            return e(M);
          },
          showLoader: !0
        });
      }
    };
    ae(Q, (g) => {
      o().isPlaceholder && g(f);
    });
  }
  var h = ge(Q, 2);
  {
    var j = (g) => {
      var M = ar();
      let G;
      Pe(() => {
        ue(M, "src", o().src), ue(M, "alt", o().alt || ""), G = _e(M, 1, "gallery-image svelte-aw59wn", null, G, { "image-loading": !te.isLoaded });
      }), ee("load", M, function(...Z) {
        te.handleLoad?.apply(this, Z);
      }), ee("error", M, function(...Z) {
        te.handleError?.apply(this, Z);
      }), Ee("contextmenu", M, (Z) => Z.preventDefault()), Zi(M), le(g, M);
    };
    ae(h, (g) => {
      e(re) && g(j);
    });
  }
  var A = ge(h, 2);
  {
    var L = (g) => {
      var M = lr(), G = me(M);
      G.muted = !0, Ie(G, (we) => v(_, we), () => e(_));
      var Z = ge(G, 2);
      pe(M), Pe(() => {
        ue(G, "src", o().src), ue(Z, "draggable", !I());
      }), Ee("contextmenu", G, (we) => we.preventDefault()), ee("dragstart", Z, X), Ee("click", Z, d), le(g, M);
    };
    ae(A, (g) => {
      e(ve) && g(L);
    });
  }
  pe(k);
  var q = ge(k, 2);
  {
    var B = (g) => {
      {
        let M = P(() => i()("imageContextMenu.delete")), G = P(() => i()("imageContextMenu.copyUrl")), Z = P(() => i()("imageContextMenu.copySuccess"));
        ui(g, {
          get src() {
            return o().src;
          },
          onDelete: () => u()(o().id),
          get deleteAriaLabel() {
            return e(M);
          },
          get copyAriaLabel() {
            return e(G);
          },
          get copySuccessMessage() {
            return e(Z);
          },
          layout: "gallery",
          get deleteDisabled() {
            return I();
          }
        });
      }
    };
    ae(q, (g) => {
      o().isPlaceholder || g(B);
    });
  }
  pe(S), Ie(S, (g) => v(R, g), () => e(R)), Pe(() => {
    E = _e(S, 1, "gallery-item svelte-aw59wn", null, E, {
      "is-placeholder": o().isPlaceholder,
      "is-disabled": I()
    }), ue(S, "draggable", !I() && (o().type !== "video" || o().isPlaceholder)), Wt(k, e(H)), ue(k, "role", o().type === "image" && !o().isPlaceholder ? "button" : void 0), ue(k, "tabindex", o().type === "image" && !o().isPlaceholder ? 0 : void 0), ue(k, "aria-label", o().alt || o().src);
  }), ee("dragstart", S, X), ee("dragover", S, W), ee("drop", S, se), ee("dragend", S, () => x()()), Ee("click", k, function(...g) {
    (o().type === "image" && !o().isPlaceholder ? oe : void 0)?.apply(this, g);
  }), Ee("keydown", k, ye), le(n, S);
  var fe = ot(D);
  return a(), fe;
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
var fr = he("<div><!></div>"), mr = he('<div role="list"></div>');
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
  let o = Y(-1), l = Y(-1), u = Y(-1), m = Y(-1), w = null, x = 60, T = 60, p = Y(void 0), I = null, R = P(() => ie.items), _ = P(() => K.postStatus.sending), te = P(() => {
    const f = e(o) !== -1 ? e(o) : e(u), h = e(o) !== -1 ? e(l) : e(m);
    return f === -1 || h === -1 || h === f || h === f + 1 ? -1 : h;
  });
  function re(f, h) {
    if (e(_)) {
      h.preventDefault();
      return;
    }
    v(o, f, !0), h.dataTransfer?.setData("text/plain", String(f)), h.dataTransfer && (h.dataTransfer.effectAllowed = "move");
  }
  function ve(f, h) {
    if (h.preventDefault(), e(_)) return;
    const A = e(p)?.querySelectorAll(".gallery-item-wrapper")?.[f];
    if (A) {
      const L = A.getBoundingClientRect();
      v(l, h.clientX < L.left + L.width / 2 ? f : f + 1, !0);
    } else
      v(l, f, !0);
  }
  function U() {
    d(), v(o, -1), v(l, -1);
  }
  function de(f) {
  }
  function V(f) {
    if (e(o) === -1) return;
    if (f.preventDefault(), e(_)) {
      d(), v(l, -1);
      return;
    }
    const h = e(p)?.querySelectorAll(".gallery-item-wrapper");
    if (h && h.length > 0) {
      const j = h[0].getBoundingClientRect(), A = h[h.length - 1].getBoundingClientRect();
      f.clientX < j.left ? v(l, 0) : f.clientX > A.right && v(l, e(R).length, !0);
    }
    if (e(p)) {
      const j = e(p).getBoundingClientRect();
      f.clientX - j.left < Te ? X("left", f.clientX) : j.right - f.clientX < Te ? X("right", f.clientX) : d();
    }
  }
  function H(f) {
    if (f.preventDefault(), d(), e(_)) {
      v(o, -1), v(l, -1);
      return;
    }
    const h = e(l);
    if (e(o) !== -1 && h !== -1 && h !== e(o) && h !== e(o) + 1) {
      const j = e(o) < h ? h - 1 : h;
      ie.reorderItems(e(o), j);
    }
    v(o, -1), v(l, -1);
  }
  function oe(f) {
    e(_) || ie.removeItem(f);
  }
  function X(f, h) {
    if (!e(p)) return;
    I !== null && (cancelAnimationFrame(I), I = null);
    const j = e(p).getBoundingClientRect(), A = f === "left" ? h - j.left : j.right - h, L = Math.max(0, Math.min(1, A / Te)), q = Ft + (pi - Ft) * (1 - L), B = () => {
      if (!e(p)) return;
      const fe = e(p).scrollWidth - e(p).clientWidth;
      f === "left" && e(p).scrollLeft > 0 ? (e(p).scrollLeft = Math.max(0, e(p).scrollLeft - q), I = requestAnimationFrame(B)) : f === "right" && e(p).scrollLeft < fe ? (e(p).scrollLeft = Math.min(fe, e(p).scrollLeft + q), I = requestAnimationFrame(B)) : I = null;
    };
    I = requestAnimationFrame(B);
  }
  function d() {
    I !== null && (cancelAnimationFrame(I), I = null);
  }
  function W(f, h, j) {
    if (e(_)) return;
    v(u, f, !0), D();
    const A = e(p)?.querySelectorAll(".gallery-item-wrapper")[f];
    if (A) {
      const L = A.getBoundingClientRect(), q = 120, B = Math.min(q / L.width, q / L.height);
      x = L.width * B / 2, T = L.height * B / 2, w = A.cloneNode(!0), w.style.cssText = `
                position: fixed;
                left: ${h - x}px;
                top: ${j - T}px;
                width: ${L.width}px;
                height: ${L.height}px;
                transform-origin: top left;
                transform: scale(${B});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, er().overlayTarget.appendChild(w);
    }
    document.addEventListener("touchmove", se, { passive: !1 }), document.addEventListener("touchend", ye, { passive: !1 });
  }
  function se(f) {
    if (e(u) === -1 || f.touches.length !== 1) return;
    if (f.preventDefault(), e(_)) {
      d(), v(m, -1);
      return;
    }
    const h = f.touches[0];
    w && (w.style.left = `${h.clientX - x}px`, w.style.top = `${h.clientY - T}px`), w && (w.style.display = "none");
    const j = document.elementFromPoint(h.clientX, h.clientY);
    w && (w.style.display = "");
    const A = j?.closest(".gallery-item-wrapper");
    if (A && e(p)) {
      const L = e(p).querySelectorAll(".gallery-item-wrapper"), q = Array.from(L).indexOf(A);
      if (q !== -1) {
        const B = A.getBoundingClientRect();
        v(m, h.clientX < B.left + B.width / 2 ? q : q + 1, !0);
      }
    } else if (e(p)) {
      const L = e(p).querySelectorAll(".gallery-item-wrapper");
      if (L.length > 0) {
        const q = L[0].getBoundingClientRect(), B = L[L.length - 1].getBoundingClientRect();
        h.clientX <= q.left ? v(m, 0) : h.clientX >= B.right && v(m, e(R).length, !0);
      }
    }
    if (e(p)) {
      const L = e(p).getBoundingClientRect();
      h.clientX - L.left < Te ? X("left", h.clientX) : L.right - h.clientX < Te ? X("right", h.clientX) : d();
    }
  }
  function ye() {
    if (document.removeEventListener("touchmove", se), document.removeEventListener("touchend", ye), d(), e(_)) {
      D(), v(u, -1), v(m, -1);
      return;
    }
    const f = e(m);
    if (e(u) !== -1 && f !== -1 && f !== e(u) && f !== e(u) + 1) {
      const h = e(u) < f ? f - 1 : f;
      ie.reorderItems(e(u), h);
    }
    D(), v(u, -1), v(m, -1);
  }
  function D() {
    w && (w.remove(), w = null);
  }
  function S(f) {
    if (!e(p)) return;
    const h = e(p).closest(".composer-scroll-region");
    pr(e(p), f, h instanceof HTMLElement ? h : null) && f.preventDefault();
  }
  Se(() => {
    if (e(p))
      return e(p).addEventListener("wheel", S, { passive: !1 }), () => {
        e(p)?.removeEventListener("wheel", S);
      };
  });
  var E = Ji(), k = zt(E);
  {
    var Q = (f) => {
      var h = mr();
      let j;
      hi(h, 23, () => e(R), (A) => A.id, (A, L, q) => {
        var B = fr();
        let fe;
        var g = me(B);
        jt(g, {
          get item() {
            return e(L);
          },
          get index() {
            return e(q);
          },
          onDelete: oe,
          onDragStart: re,
          onDragOver: ve,
          onDragEnd: U,
          onDrop: de,
          onTouchDragStart: W,
          get disabled() {
            return e(_);
          }
        }), pe(B), Pe(() => fe = _e(B, 1, "gallery-item-wrapper svelte-w2vv8k", null, fe, {
          "insert-bar-left": e(te) === e(q),
          "insert-bar-right": e(te) === e(R).length && e(q) === e(R).length - 1
        })), le(A, B);
      }), pe(h), Ie(h, (A) => v(p, A), () => e(p)), Pe(
        (A) => {
          j = _e(h, 1, "media-gallery svelte-w2vv8k", null, j, { sending: e(_) }), ue(h, "aria-label", A);
        },
        [() => i()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), ee("dragover", h, V), ee("drop", h, H), le(f, h);
    };
    ae(k, (f) => {
      e(R).length > 0 && f(Q);
    });
  }
  le(n, E), ot(), a();
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
  let t = Y(!1);
  function i(o) {
    if (Re(n) || !He(n)) {
      o.preventDefault(), v(t, !1), n.classList.remove("drag-over");
      return;
    }
    const l = o.dataTransfer, u = Ze(l);
    Gt(l) && !u ? (o.preventDefault(), e(t) || (v(t, !0), n.classList.add("drag-over"))) : e(t) && (v(t, !1), n.classList.remove("drag-over"));
  }
  function s(o) {
    e(t) && (v(t, !1), n.classList.remove("drag-over"));
  }
  async function a(o) {
    if (v(t, !1), n.classList.remove("drag-over"), Re(n) || !He(n)) {
      o.preventDefault();
      return;
    }
    const l = o.dataTransfer;
    Ze(l) || l?.files && l.files.length > 0 && typeof n.__uploadFiles == "function" && (o.preventDefault(), n.__uploadFiles(l.files));
  }
  return n.addEventListener("dragover", i), n.addEventListener("dragleave", s), n.addEventListener("drop", a), {
    destroy() {
      n.removeEventListener("dragover", i), n.removeEventListener("dragleave", s), n.removeEventListener("drop", a);
    }
  };
}
function wr(n, t) {
  const i = yr(n);
  function s(l) {
    if (Re(n) || !He(n)) {
      l.preventDefault(), t.dragOver(!1);
      return;
    }
    const u = l.dataTransfer, m = Ze(u);
    Gt(u) && !m ? t.dragOver(!0) : t.dragOver(!1);
  }
  function a(l) {
    t.dragOver(!1);
  }
  function o(l) {
    t.dragOver(!1), (Re(n) || !He(n)) && l.preventDefault();
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
      const o = s.touches[0], l = 120, u = kt.querySelector(".tiptap-editor");
      if (u) {
        const m = u.getBoundingClientRect(), w = o.clientY < m.top + l, x = o.clientY > m.bottom - l;
        if (!w && !x)
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
      const a = n.__currentEditor, o = typeof a == "function" ? a() : a, l = n.__hasPostingCapability, u = typeof l == "function" ? l() : l, m = n.__hasStoredKey, w = typeof m == "function" ? m() : m, x = n.__postStatus, T = typeof x == "function" ? x() : x, p = o ? mi(o) : "";
      !T?.sending && p.trim() && (u ?? w) && n.__submitPost?.();
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
    const w = u.detail.plainText, x = t ? Pr(t.state?.doc) : !1;
    s.onContentUpdate?.(w, x);
  }, o = (u) => {
    const m = u;
    s.onImageFullscreenRequest?.(m.detail.src, m.detail.alt || "", m.detail.mediaId);
  }, l = (u) => {
    const w = u?.detail?.pos;
    if (w != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const x = fi.create(t.state.doc, w);
        t.view.dispatch(t.state.tr.setSelection(x).scrollIntoView());
      } catch (x) {
        console.warn("select-image-node handler failed:", x);
      }
      s.onSelectImageNode?.(w);
    }
  };
  return window.addEventListener("editor-content-changed", a), window.addEventListener("image-fullscreen-request", o), window.addEventListener("select-image-node", l), i && (i.addEventListener("image-fullscreen-request", o), i.addEventListener("select-image-node", l)), {
    handleContentUpdate: a,
    handleImageFullscreenRequest: o,
    handleSelectImageNode: l
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
  return n.items.forEach((l) => {
    if (l.isPlaceholder)
      return;
    const u = l.src;
    if (l.type === "image" && t.nodes.image) {
      const m = t.nodes.image.create({
        src: u,
        alt: l.alt ?? "Image",
        blurhash: l.blurhash ?? null,
        dim: l.dim ?? null,
        size: l.size ?? null,
        uploadProtocol: l.uploadProtocol ?? null
      });
      i = i.insert(s, m), s += m.nodeSize;
    } else if (l.type === "video" && t.nodes.video) {
      const m = t.nodes.video.create({ src: u });
      i = i.insert(s, m), s += m.nodeSize;
    }
    l.ox && (a[u] = l.ox), l.x && (o[u] = l.x);
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
    onCustomEmojiSelect: l,
    enterKeyBehavior: u,
    hostOwnedLite: m,
    uploadFiles: w,
    eventCallbacks: x
  } = n;
  bi.value = t;
  const T = Si({
    isInputBlocked: n.isInputBlocked,
    isCompositionInputAllowed: n.isCompositionInputAllowed,
    compositionController: n.compositionController,
    placeholderText: t,
    onSubmitPost: o,
    onCustomEmojiSelect: l,
    enterKeyBehavior: u,
    hostOwnedLite: m,
    onCreate: (_) => {
      Ce.set(_);
    }
  });
  let p = null;
  const I = T.subscribe((_) => {
    p = _;
  }), R = xr({
    currentEditor: p,
    editorContainerEl: i,
    callbacks: x
  });
  return Ei(o), i && Object.assign(i, {
    __uploadFiles: w,
    __currentEditor: () => p,
    __hasStoredKey: () => s,
    __hasPostingCapability: () => a ?? s,
    __postStatus: () => K.postStatus,
    __submitPost: o
  }), { editor: T, unsubscribe: I, handlers: R };
}
function Br(n) {
  const {
    unsubscribe: t,
    componentUnsubscribe: i,
    handlers: s,
    currentEditor: a,
    editorContainerEl: o,
    submitPost: l
  } = n;
  Cr(s, o), Ce.value === a && Ce.set(null), Pi(l), i(), t(), a && !a.isDestroyed && a.destroy(), o && (delete o.__uploadFiles, delete o.__currentEditor, delete o.__hasStoredKey, delete o.__hasPostingCapability, delete o.__postStatus, delete o.__submitPost);
}
function Nr(n, t) {
  const i = n.view.dom;
  if (xi() && document.activeElement !== i) {
    n.commands.insertCustomEmoji(t);
    return;
  }
  n.chain().focus().insertCustomEmoji(t).run();
}
var zr = he('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), jr = he('<div class="plane-icon svg-icon svelte-15ticnd"></div>'), qr = he('<div class="editor-submit-button-container svelte-15ticnd"><!></div>'), Gr = he('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), Kr = he('<div class="upload-error svelte-15ticnd"> </div>'), Ur = he('<div class="svelte-15ticnd"> </div>'), Xr = he('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
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
  let o = N(t, "rxNostr", 7), l = N(t, "hasStoredKey", 7), u = N(t, "hasPostingCapability", 23, l), m = N(t, "isSwitchingAccount", 7, !1), w = N(t, "onPostSuccess", 7), x = N(t, "availableComposerHeight", 7, ke), T = N(t, "minEditorHeight", 7, ke), p = N(t, "onCustomEmojiSelect", 7), I = N(t, "onEditorEmptyChange", 7), R = N(t, "notificationPort", 7), _ = N(t, "hostOwnedConfig", 7), te = N(t, "hostCustomEmojiItems", 23, () => []), re = N(t, "normalUploadFiles", 7);
  const U = !1;
  let de = P(() => !U), V = P(() => K.isUploading), H = P(() => K.canPost), oe = P(() => U), X = Y(null), d = Y(null), W = Y(null), se = Y(!1), ye = Y(!1), D = Y(void 0), S = Y(void 0), E = Y(qe({})), k = Y(qe({})), Q = P(() => Ye.value), f = P(() => K.postStatus), h = P(() => K.uploadErrorMessage), j = P(() => Vi.value), A = P(() => Ni.value), L = P(() => zi.value), q = Y(!0), B = !1, fe = P(() => l() && !m() && e(A) && !e(L) && e(q)), g = null, M = null, G = null, Z = null, we = Y(qe(ke)), Me = P(() => U), Kt = P(() => e(Me) ? `--post-editor-auto-grow-min-lines: ${_().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${_().editorMaxLines}lh;` : `--post-editor-min-height: ${T()}px; --post-editor-target-height: ${e(we)}px;`), st = P(() => i()("postComponent.enter_your_text") || "テキストを入力してください");
  function J() {
    return e(f).sending || e(se);
  }
  Se(() => {
    e(d), Ci(e(st));
  }), Se(() => {
  });
  function at() {
    if (e(Me)) return;
    const r = T();
    if (!g || !M) {
      v(we, r, !0);
      return;
    }
    const c = Array.from(g.children).reduce(
      (C, F) => F === M ? C : C + Gi(F),
      0
    ), y = Ki({
      availableComposerHeight: x(),
      nonEditorHeight: c,
      minHeight: r
    });
    e(we) !== y && v(we, y, !0);
  }
  function Ut(r) {
    if (J()) {
      r.preventDefault();
      return;
    }
    !(r.target instanceof HTMLElement) || !e(d) || Bi(r.target) || e(d).commands.focus("end");
  }
  function Xt(r) {
    !e(d) || r.currentTarget !== r.target || r.key !== "Enter" && r.key !== " " || (r.preventDefault(), e(d).commands.focus("end"));
  }
  function Qt(r) {
    J() && (e(W)?.isCompositionInputAllowed() && (r.isComposing || r.keyCode === 229) || (r.preventDefault(), r.stopPropagation()));
  }
  function Oe(r) {
    const c = e(W)?.isCompositionInputAllowed() && r instanceof InputEvent && (r.isComposing || r.inputType === "insertCompositionText" || r.inputType === "insertFromComposition");
    J() && !c && (r.preventDefault(), r.stopPropagation());
  }
  function $t(r) {
    r.preventDefault();
  }
  function Yt(r) {
    const c = e(d)?.view.dom;
    !e(oe) || !c || r.relatedTarget !== c || c.focus({ preventScroll: !0 });
  }
  let be = P(() => ce.value), Ge = P(() => e(be).showSecretKeyDialog), lt = P(() => e(be).showImageFullscreen), Vt = P(() => e(be).fullscreenMediaId), dt = P(() => e(be).fullscreenImageSrc), Zt = P(() => e(be).fullscreenImageAlt), ct = P(() => e(be).showFloatingMessage), Jt = P(() => e(be).floatingMessageX), en = P(() => e(be).floatingMessageY), tn = P(() => e(be).floatingMessageText);
  Se(() => {
    o() && (e(S) ? e(S).setRxNostr(o()) : v(
      S,
      new nr(o(), {
        getNip46SignerForSessionFn: (r) => Ii.getSignerForSession(r),
        getParentClientSignerFn: () => ki.getSigner(),
        channelContextState: Fi,
        replyQuoteState: Rt,
        replyQuoteService: new je(),
        clearReplyQuoteFn: Ve,
        savePostHistoryFn: (r) => Or({ input: r, postHistoryRepositoryImpl: Bt }),
        notificationPort: R()
      }),
      !0
    ));
  });
  const Ke = sr({
    getCurrentEditor: () => e(d),
    getFileInput: () => e(D),
    getImageOxMap: () => e(E),
    getImageXMap: () => e(k),
    getUploadFailedText: (r) => i()(r),
    updateUploadState: (r, c) => {
      rr(K, r, c);
    },
    setUploadErrorMessage: (r) => {
      K.uploadErrorMessage = r;
    },
    uploadFiles: async (r) => {
      if (J() || K.isSubmitPending || K.isUploading || U)
        return null;
      {
        if (re()) return await re()(r);
        const { uploadFiles: c } = await import("./App-C8cvgCUG.js").then((y) => y.eE);
        return await c(r);
      }
    }
  });
  function nn() {
    const r = !!(e(d)?.view.composing && qi());
    r && e(d)?.view.dom.blur(), ht(), r ? e(W)?.retire() : e(W)?.markStale();
  }
  const De = _r({
    updatePostStatus: It,
    clearContentAfterSuccess: nn,
    onPostSuccess: (r) => w()?.(r)
  });
  function ut(r) {
    e(W)?.markFailure(), De.markFailure(r);
  }
  Se(() => {
    if (e(Me)) return;
    if (x(), T(), e(Q), e(h), e(d), e(Q) || ie.items.length, typeof window > "u") {
      v(we, ke, !0);
      return;
    }
    const r = window.requestAnimationFrame(() => {
      at();
    });
    return () => {
      window.cancelAnimationFrame(r);
    };
  }), Se(() => {
    if (e(Me) || (x(), T(), e(d), e(Q), e(h), !g || typeof ResizeObserver > "u"))
      return;
    let r = null;
    const c = () => {
      r === null && (r = window.requestAnimationFrame(() => {
        r = null, at();
      }));
    }, y = new ResizeObserver(c);
    c(), y.observe(g);
    for (const C of Array.from(g.children))
      C !== M && y.observe(C);
    return () => {
      y.disconnect(), r !== null && window.cancelAnimationFrame(r);
    };
  }), _i(() => {
    v(se, !1), v(
      W,
      new tr((b) => {
        v(se, b === "stale");
      }),
      !0
    ), G = Wr({
      isInputBlocked: J,
      isCompositionInputAllowed: () => !!e(W)?.isCompositionInputAllowed(),
      compositionController: e(W) ?? void 0,
      placeholderText: e(st),
      editorContainerEl: M,
      currentEditor: e(d),
      hasStoredKey: l(),
      hasPostingCapability: u(),
      submitPost: We,
      onCustomEmojiSelect: p(),
      enterKeyBehavior: void 0,
      hostOwnedLite: U,
      uploadFiles: e(de) ? (b) => {
        J() || Ke.performUpload(b);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: ji,
        onImageFullscreenRequest: (b, ne, xe) => {
          ce.showImageFullscreen(b, ne, xe || "");
        },
        onSelectImageNode: (b) => {
        }
      }
    }), v(X, G.editor, !0);
    let r = null;
    const c = (b) => {
      const ne = b.isEmpty, xe = !B || e(q) !== ne;
      v(q, ne, !0), B = !0, xe && I()?.(ne);
    }, y = (b) => {
      Ne(b, ie.hasNonPlaceholderItems());
    }, C = ({ editor: b }) => {
      c(b), y(b);
    };
    Z = e(X).subscribe((b) => {
      if (b !== null && b === r) {
        v(d, b, !0), b && (c(b), y(b));
        return;
      }
      r && r.off("transaction", C), r = b, v(d, b, !0), b ? (e(W)?.attach(b), c(b), y(b)) : (e(W)?.detach(), Ne(null, !1)), b?.on("transaction", C), Ce.set(b);
    });
    const F = (b) => {
      const ne = b, { src: xe, alt: Bn, mediaId: Nn } = ne.detail;
      ce.showImageFullscreen(xe, Bn, Nn || "");
    };
    return window.addEventListener("image-fullscreen-request", F), () => {
      e(W)?.destroy(), v(W, null), v(se, !1), Ne(null, !1), Ce.value === e(d) && (K.isSubmitPending = !1, ce.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", F), G && (r && r.off("transaction", C), Br({
        unsubscribe: G.unsubscribe,
        componentUnsubscribe: Z ?? (() => {
        }),
        handlers: G.handlers,
        currentEditor: e(d),
        editorContainerEl: M,
        submitPost: We
      }), Z = null);
    };
  });
  const rn = Ke.handleFileSelect;
  async function on(r) {
    return J() ? null : await Ke.performUpload(r);
  }
  function sn() {
    e(d)?.commands.focus();
  }
  function an() {
    e(d)?.commands.blur();
  }
  function ln(r) {
    if (!e(d) || !r || J()) return;
    const c = e(
      d
      // nullチェック済みのローカル変数
    ), C = r.split(`
`).map((F) => ({
      type: "paragraph",
      content: F ? [{ type: "text", text: F }] : void 0
    }));
    c.commands.setContent({ type: "doc", content: C }), c.commands.focus("end");
  }
  function dn(r) {
    if (!e(d) || !r || J()) return !1;
    const y = r.split(`
`).map((C) => ({
      type: "paragraph",
      content: C ? [{ type: "text", text: C }] : void 0
    }));
    return e(d).isEmpty ? e(d).commands.setContent({ type: "doc", content: y }) : e(d).chain().focus("end").insertContent([{ type: "paragraph" }, ...y]).run(), e(d).commands.focus("end"), !0;
  }
  function cn(r) {
    if (!e(d) || !r || J()) return;
    const c = Di(r);
    e(d).commands.setContent(c || "<p></p>"), e(d).commands.focus("end");
  }
  function un() {
    return e(d) ? e(d).getHTML() : "";
  }
  function gn(r) {
    if (!e(d) || r.length === 0 || J()) return;
    const { schema: c } = e(d).state;
    let y = e(d).state.tr, C = e(d).state.doc.content.size;
    r.forEach((F) => {
      if (F.isPlaceholder) return;
      const b = F.src;
      if (F.type === "image" && c.nodes.image) {
        const ne = c.nodes.image.create({
          src: b,
          alt: F.alt ?? "Image",
          blurhash: F.blurhash ?? null,
          dim: F.dim ?? null,
          size: F.size ?? null,
          uploadProtocol: F.uploadProtocol ?? null
        });
        y = y.insert(C, ne), C += ne.nodeSize, F.ox && v(E, { ...e(E), [b]: F.ox }, !0), F.x && v(k, { ...e(k), [b]: F.x }, !0);
      } else if (F.type === "video" && c.nodes.video) {
        const ne = c.nodes.video.create({ src: b });
        y = y.insert(C, ne), C += ne.nodeSize;
      }
    }), e(d).view.dispatch(y), e(d).commands.focus("end");
  }
  function hn(r) {
    !e(d) || J() || Nr(e(d), r);
  }
  function Ue() {
    if (!e(d)) return;
    Hi(e(d).view.dom) || Oi(e(d));
  }
  function gt(r) {
    if (!e(d) || J()) return;
    Ue();
    const { state: c, view: y } = e(d), C = r < 0 ? c.selection.from : c.selection.to, F = Math.max(0, Math.min(c.doc.content.size, C + r));
    if (F === C) return;
    const b = Ri.near(c.doc.resolve(F), r);
    y.dispatch(c.tr.setSelection(b).scrollIntoView().setMeta("addToHistory", !1));
  }
  function pn() {
    gt(-1);
  }
  function fn() {
    gt(1);
  }
  function mn() {
    if (!e(d) || J()) return;
    Ue();
    const { state: r, view: c } = e(d), { selection: y } = r;
    if (!y.empty) {
      e(d).commands.deleteSelection();
      return;
    }
    const F = y.$from.nodeBefore;
    if (F) {
      const b = F.isText ? Array.from(F.text ?? "").at(-1)?.length ?? 0 : F.nodeSize;
      b > 0 && c.dispatch(r.tr.delete(y.from - b, y.from).scrollIntoView());
      return;
    }
    e(d).commands.first(({ commands: b }) => [
      () => b.joinBackward(),
      () => b.selectNodeBackward()
    ]);
  }
  function vn() {
    !e(d) || J() || (Ue(), e(d).commands.keyboardShortcut("Enter"));
  }
  function yn() {
    return Xe() && Wi(e(d), ie.hasNonPlaceholderItems()) && !K.isSubmitPending && !e(Ge);
  }
  function Xe() {
    return !!e(d) && !!e(S) && !m() && !e(f).sending && !K.isUploading && !e(f).completed && u();
  }
  async function We(r) {
    if (!e(d) || !yn() || !e(S)) return;
    const c = e(d);
    K.isSubmitPending = !0;
    try {
      if (c.isDestroyed || Ce.value !== c || !Xe()) return;
      const y = e(S).preparePostPayload(c);
      if (Ti(c.state.doc), Li(y.content)) {
        ce.showSecretKeyDialog(y.content, y.emojiTags), K.isSubmitPending = !1;
        return;
      }
      c.view.composing && e(W)?.startSession(_t.getState(c.state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await e(S).performPostSubmission(
        c,
        y,
        e(E),
        e(k),
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
    if (e(d)) {
      if (e(S)) {
        e(S).resetPostContent(e(d));
        return;
      }
      e(d).chain().clearContent().run();
    }
  }
  function ht() {
    if (e(S) && e(d)) {
      e(S).clearContentAfterSuccess(e(d));
      return;
    }
    if (e(d)) {
      const r = _()?.hashtagPinEnabled === !0 && Ht.value ? [...Ot().hashtags] : [];
      e(d).chain().clearContent().run(), Lt.reset(), At.reset(), ie.clearAll(), v(E, {}, !0), v(k, {}, !0), Ve(), r.length > 0 && e(d).commands.insertContent(` ${r.map((c) => `#${c}`).join(" ")}`), e(d).commands.focus("start");
    }
  }
  async function bn() {
    if (!e(Ge) || !Xe()) return;
    const r = ce.getPendingPost(), c = ce.getPendingEmojiTags();
    r.trim() && e(S) && e(d) && (e(d).view.composing && e(W)?.startSession(_t.getState(e(d).state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await Mr({
      postManager: e(S),
      currentEditor: e(d),
      imageOxMap: e(E),
      imageXMap: e(k),
      pendingPost: r,
      pendingEmojiTags: c,
      onStart: () => {
        De.markSending(), ce.hideSecretKeyDialog();
      },
      onSuccess: De.markSuccess,
      onFailure: ut
    }));
  }
  const Sn = ce.hideSecretKeyDialog, En = ce.hideImageFullscreen;
  let Qe = P(() => Dr({
    mediaFreePlacement: e(Q),
    galleryItems: ie.items,
    currentEditor: e(d)
  })), Pn = P(() => Tr(e(Qe), e(Vt), e(dt)));
  function xn(r) {
    const c = Lr(e(Qe), r);
    c && ce.showImageFullscreen(c.src, c.alt ?? "", c.id ?? "");
  }
  Se(() => {
    e(d) && e(S) && e(S).preparePostContent(e(d)) !== K.content && e(f).error && It({ ...e(f), error: !1, message: "" });
  });
  function Cn() {
    !e(de) || J() || K.isSubmitPending || K.isUploading || e(D)?.click();
  }
  Se(() => {
    const r = ie.items.some((c) => !c.isPlaceholder);
    Ne(e(d), r);
  });
  let pt = !0;
  Se(() => {
    const r = !Ye.value;
    if (pt) {
      pt = !1;
      return;
    }
    if (!e(d)) return;
    const c = e(d);
    if (r)
      Le(() => Rr({
        currentEditor: c,
        imageOxMap: e(E),
        imageXMap: e(k),
        addGalleryItem: (C) => ie.addItem(C),
        createMediaItemId: Ai
      })) && Le(() => {
        v(E, {}, !0), v(k, {}, !0);
      });
    else {
      const y = Le(() => ie.getItems()), C = Hr({ currentEditor: c, items: y });
      C.hadItems && Le(() => {
        v(E, C.imageOxMap, !0), v(k, C.imageXMap, !0);
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
      return l();
    },
    set hasStoredKey(r) {
      l(r), z();
    },
    get hasPostingCapability() {
      return u();
    },
    set hasPostingCapability(r = l) {
      u(r), z();
    },
    get isSwitchingAccount() {
      return m();
    },
    set isSwitchingAccount(r = !1) {
      m(r), z();
    },
    get onPostSuccess() {
      return w();
    },
    set onPostSuccess(r) {
      w(r), z();
    },
    get availableComposerHeight() {
      return x();
    },
    set availableComposerHeight(r = ke) {
      x(r), z();
    },
    get minEditorHeight() {
      return T();
    },
    set minEditorHeight(r = ke) {
      T(r), z();
    },
    get onCustomEmojiSelect() {
      return p();
    },
    set onCustomEmojiSelect(r) {
      p(r), z();
    },
    get onEditorEmptyChange() {
      return I();
    },
    set onEditorEmptyChange(r) {
      I(r), z();
    },
    get notificationPort() {
      return R();
    },
    set notificationPort(r) {
      R(r), z();
    },
    get hostOwnedConfig() {
      return _();
    },
    set hostOwnedConfig(r) {
      _(r), z();
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
  var $ = me(Fe);
  let vt;
  var yt = me($);
  {
    var kn = (r) => {
      var c = zr(), y = me(c);
      {
        let C = P(() => e(j)?.picture || "");
        Ui(y, {
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
      pe(c), le(r, c);
    };
    ae(yt, (r) => {
      e(fe) && r(kn);
    });
  }
  var wt = ge(yt, 2);
  {
    var In = (r) => {
      Xi(r, {
        get editor() {
          return e(d);
        },
        class: "editor-content"
      });
    };
    ae(wt, (r) => {
      e(X) && e(d) && r(In);
    });
  }
  var _n = ge(wt, 2);
  {
    var Mn = (r) => {
      var c = qr(), y = me(c);
      {
        let C = P(() => !e(H) || e(f).sending || e(V) || !u() || e(f).completed), F = P(() => i()("postComponent.post"));
        Qi(y, {
          variant: "primary",
          shape: "circle",
          contentLayout: "icon",
          className: "editor-submit-button",
          get disabled() {
            return e(C);
          },
          onClick: () => {
            !e(H) || e(f).sending || e(V) || !u() || e(f).completed || We();
          },
          onfocus: Yt,
          get ariaLabel() {
            return e(F);
          },
          children: (b, ne) => {
            var xe = jr();
            le(b, xe);
          },
          $$slots: { default: !0 }
        });
      }
      pe(c), ee("pointerdown", c, $t, !0), le(r, c);
    };
    ae(_n, (r) => {
      e(oe) && r(Mn);
    });
  }
  pe($), ze($, (r, c) => wr?.(r, c), () => ({ dragOver: (r) => v(ye, r, !0) })), ze($, (r) => br?.(r)), ze($, (r) => Sr?.(r)), ze($, (r, c) => Er?.(r, c), () => !U), Ie($, (r) => M = r, () => M);
  var bt = ge($, 2);
  {
    var Dn = (r) => {
      qt(r, {});
    };
    ae(bt, (r) => {
      e(Q) || r(Dn);
    });
  }
  var St = ge(bt, 2);
  {
    var Tn = (r) => {
      var c = Gr();
      Ie(c, (y) => v(D, y), () => e(D)), Ee("change", c, rn), le(r, c);
    };
    ae(St, (r) => {
      e(de) && r(Tn);
    });
  }
  var Ln = ge(St, 2);
  {
    var An = (r) => {
      var c = Kr(), y = me(c, !0);
      pe(c), Pe(() => Mt(y, e(h))), le(r, c);
    };
    ae(Ln, (r) => {
      e(h) && r(An);
    });
  }
  pe(Fe), Ie(Fe, (r) => g = r, () => g);
  var Et = ge(Fe, 2);
  {
    var Rn = (r) => {
      {
        let c = P(() => i()("postComponent.warning")), y = P(() => i()("postComponent.secret_key_detected")), C = P(() => i()("postComponent.post")), F = P(() => i()("postComponent.cancel"));
        $i(r, {
          get open() {
            return e(Ge);
          },
          get title() {
            return e(c);
          },
          get description() {
            return e(y);
          },
          get confirmLabel() {
            return e(C);
          },
          get cancelLabel() {
            return e(F);
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
    ae(Et, (r) => {
      r(Rn);
    });
  }
  var Pt = ge(Et, 2);
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
      v(lt, r);
    }
  });
  var Hn = ge(Pt, 2);
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
        children: (c, y) => {
          var C = Ur(), F = me(C, !0);
          pe(C), Pe(() => Mt(F, e(tn))), le(c, C);
        },
        $$slots: { default: !0 }
      });
    };
    ae(Hn, (r) => {
      e(ct) && r(On);
    });
  }
  Pe(
    (r) => {
      mt = _e(Fe, 1, "post-container svelte-15ticnd", null, mt, { "editor-auto-grow": e(Me) }), Wt(Fe, e(Kt)), vt = _e($, 1, "editor-container svelte-15ticnd", null, vt, {
        "drag-over": e(ye),
        "gallery-mode": !e(Q),
        sending: e(f).sending || e(se),
        "editor-submit-enabled": e(oe),
        "account-avatar-placeholder": e(fe)
      }), ue($, "aria-label", r), ue($, "aria-readonly", e(f).sending || e(se) ? "true" : void 0), ue($, "aria-disabled", void 0);
    },
    [() => i()("postComponent.editor_label")]
  ), Ee("click", $, Ut), ee("keydown", $, Qt, !0), Ee("keydown", $, Xt), ee("beforeinput", $, Oe, !0), ee("paste", $, Oe, !0), ee("cut", $, Oe, !0), ee("drop", $, Oe, !0), le(n, ft);
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
