import { a as zn, h as Pt, m as $e, b as le, c as Dt, d as Rt, k as Bn, e as qn, s as jn, w as Kn, r as At, f as Un, i as xt, j as Gn, l as Qn, n as Xn, o as $n, p as Yn, q as Lt, t as Vn, u as Ye, v as Zn, P as Jn, x as ei, y as ti, z as ni, A as ii, B as ri, C as si, R as qe, D as oi, E as ai, F as Ot, G as li, H as di, I as ci, J as ui, K as pi, L as hi, M as Ze, N as j, O as gi, Q as de, S as ke, T as Me, U as pe, V as Ht, W as Je, X as fi, Y as vi, Z as mi, _ as et, $ as tt, a0 as yi, a1 as X, a2 as Re, a3 as Ct, a4 as wi, a5 as Si, a6 as _t, a7 as bi, a8 as Ei, a9 as Nt, aa as Pi, ab as xi, ac as Ci, ad as _i, ae as _e, af as Ii, ag as Fi, ah as ki, ai as Fe, aj as Mi, ak as Ti, al as Di, am as Ri, an as Ai, ao as It, ap as ze, aq as Be, ar as Li, as as Oi, at as Hi, au as Ni, av as Ft, aw as Wi, ax as zi, ay as Bi, az as qi, aA as ji, aB as Ki, aC as Ui, aD as Gi, aE as Qi, aF as Xi, aG as $i, aH as Yi, aI as Vi, aJ as Zi, aK as Ji, aL as er, aM as tr, aN as nr } from "./App-B2pbRRzr.js";
import { bk as Ce, aK as je, aq as Wt, b6 as nt, b0 as it, a as e, bf as he, b as m, Z as Pe, bD as se, ap as Ee, b3 as ce, b4 as rt, aT as V, ba as ge, b8 as ye, aS as E, b5 as K, bg as ir, b9 as ve, aO as be, b1 as rr, b2 as zt, bl as sr, u as Ae, bi as kt } from "./entry-DeBeimY8.js";
class or {
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
    const n = t.view?.dom;
    if (!n) return;
    const o = n.ownerDocument.defaultView;
    if (!o) return;
    const a = () => {
      this.domCompositionActive = !0, this.generation += 1, this.phase === "stale" && this.retire();
    }, s = () => {
      this.domCompositionActive = !1, this.phase === "stale" && this.scheduleRetire();
    };
    n.addEventListener("compositionstart", a, !0), n.addEventListener("compositionend", s, !0), this.cleanupListeners = () => {
      n.removeEventListener("compositionstart", a, !0), n.removeEventListener("compositionend", s, !0), this.frame !== void 0 && o.cancelAnimationFrame(this.frame), this.frame = void 0, this.cleanupListeners = void 0;
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
  decideTransaction({ transaction: t, observerState: n }) {
    if (!this.phase) return "default";
    const o = t.getMeta("composition");
    if (this.phase === "stale" || o === void 0 || this.capturedGeneration !== this.generation) return "reject";
    if (this.capturedId === void 0) {
      const a = n.idsByGeneration.get(this.capturedGeneration);
      if (a !== void 0) this.capturedId = a;
      else return "allow";
    }
    return Object.is(this.capturedId, o) ? "allow" : "reject";
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
class ar {
  constructor(t, n = {}) {
    this.deps = n, t && this.setRxNostr(t), this.deps.console = n.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = n.authStateStore || zn, this.deps.hashtagStore = n.hashtagStore || Pt, this.deps.mediaFreePlacementStore = n.mediaFreePlacementStore || $e, this.deps.mediaGalleryStore = n.mediaGalleryStore || le, this.deps.contentWarningStore = n.contentWarningStore || Dt, this.deps.contentWarningReasonStore = n.contentWarningReasonStore || Rt, this.deps.keyManager = n.keyManager || Bn, this.deps.createImetaTagFn = n.createImetaTagFn || qn, this.deps.settingsStore = n.settingsStore || jn, this.deps.writeRelaysStore = n.writeRelaysStore || Kn, this.deps.replyQuoteState = n.replyQuoteState || At, this.deps.getClientTagFn = n.getClientTagFn || (() => Un(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = n.seckeySignerFn || xt, this.deps.extractContentWithImagesFn = n.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = n.extractContentWithEmojiTagsFn || (n.extractContentWithImagesFn ? (o) => ({ content: n.extractContentWithImagesFn(o), emojiTags: [] }) : Gn), this.deps.extractImageBlurhashMapFn = n.extractImageBlurhashMapFn || Qn, this.deps.resetEditorStateFn = n.resetEditorStateFn || Xn, this.deps.resetPostStatusFn = n.resetPostStatusFn || $n, this.deps.notificationPort = n.iframeMessageService || n.notificationPort || Yn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = n.hashtagPinStore || Lt, this.deps.saveHashtagsToHistoryFn = n.saveHashtagsToHistoryFn || Vn, this.deps.clearReplyQuoteFn = n.clearReplyQuoteFn || Ye, this.deps.saveSensitivePayloadFn = n.saveSensitivePayloadFn || ((o) => Zn.putCandidate(o));
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
    const t = this.deps.replyQuoteState.value, n = Array.from(
      new Set(t.quotes.map((o) => o.eventId))
    );
    if (!(!t.reply && n.length === 0))
      return {
        ...t.reply ? { replyToEventId: t.reply.eventId } : {},
        ...n.length > 0 ? { quotedEventIds: n } : {}
      };
  }
  getReplyQuoteIdentity() {
    const t = this.deps.replyQuoteState.value;
    return JSON.stringify({
      reply: t.reply?.eventId ?? null,
      quotes: t.quotes.map((n) => n.eventId)
    });
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
      t.failClosedContentWarning,
      t.publicationKind
    );
  }
  async buildNip22ReplyTags(t, n) {
    return ti(t, n);
  }
  finalizeSubmittedPost(t, n, o, a = !0) {
    return t.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(n)).catch(() => {
      this.deps.console?.warn?.("hashtag_history_save_failed", {
        stage: "post-success",
        reason: "unexpected"
      });
    }), a && this.clearReplyQuoteAfterSuccess(), this.deps.notificationPort?.notifyPostSuccess({
      ...o,
      ...t.eventId ? { eventId: t.eventId } : {}
    }), t) : (this.deps.notificationPort?.notifyPostError(t.error), t);
  }
  async saveSubmittedPostHistory(t) {
    if (!t.result.success || !this.deps.savePostHistoryFn) return;
    const n = Ce.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), o = Ce.sanitizeExternalRelayUrls([
      ...n,
      ...t.additionalWriteRelays ?? [],
      ...t.writeRelayHintSnapshot
    ], { limit: 3 });
    try {
      await this.deps.savePostHistoryFn({
        event: t.event,
        attestation: t.attestation,
        acceptedRelays: n,
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
    const n = t.signEvent ?? (typeof t.signer?.signEvent == "function" ? t.signer.signEvent.bind(t.signer) : void 0), o = this.eventSender, a = this.rxNostr, s = t.replyQuoteIdentity, u = Ce.sanitizeExternalRelayUrls(t.writeRelaySnapshot), h = () => {
      const N = this.deps.authStateStore.value;
      return N.isAuthenticated && N.pubkey === t.sessionPubkey && this.rxNostr === a && this.eventSender === o;
    }, v = () => {
      if (pi(this.deps.authStateStore, t.sessionPubkey), !h()) throw new Error("post_event_runtime_changed");
    }, y = (N) => {
      const R = {
        success: !1,
        error: "postComponent.error.sensitive_partial_publish",
        ...N?.rejectedRelays ? { rejectedRelays: N.rejectedRelays } : {},
        ...N?.timedOutRelays ? { timedOutRelays: N.timedOutRelays } : {}
      };
      return this.deps.notificationPort?.notifyPostError({ code: "sensitive_partial_publish" }), R;
    }, b = async (N, R) => {
      if (t.signer && !n)
        return { success: !1, result: { success: !1, error: "nostr_sign_event_not_supported" } };
      v();
      const G = di(N);
      let ee;
      try {
        ee = n ? await n(G.signerTemplate) : N;
      } catch {
        return { success: !1, result: { success: !1, error: "post_error" } };
      }
      v();
      let oe;
      try {
        oe = ci(
          G.expectedTemplate,
          ee,
          t.sessionPubkey
        );
      } catch {
        return { success: !1, result: { success: !1, error: "post_error" } };
      }
      v();
      const P = ui(oe);
      if (!P)
        return { success: !1, result: { success: !1, error: "post_error" } };
      n && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
        eventKind: P.event.kind
      }), v();
      const A = await o.sendEvent(P.event, {
        targetRelays: R,
        includeDefaultWriteRelays: !1
      });
      return {
        success: !0,
        event: P.event,
        attestation: P.attestation,
        result: A
      };
    }, O = t.splitSensitiveContent && t.event.tags?.some((N) => N[0] === "content-warning");
    let f = t.event, D = u;
    if (O) {
      const N = ni(
        t.event.kind,
        t.event.content,
        t.sessionPubkey,
        t.event.created_at
      ), R = await b(N, u);
      if (!R.success)
        return this.finalizeSubmittedPost(R.result, t.hashtags, t.rqNotifyOptions);
      if (!R.result.success)
        return this.finalizeSubmittedPost(R.result, t.hashtags, t.rqNotifyOptions);
      const G = Ce.sanitizeExternalRelayUrls(
        R.result.acceptedRelays
      );
      try {
        await this.deps.saveSensitivePayloadFn?.({
          event: R.event,
          attestation: R.attestation,
          acceptedRelays: G,
          relayHints: u
        });
      } catch {
        this.deps.console?.warn?.("sensitive_payload_cache_save_failed", {
          stage: "payload-publish",
          reason: "storage"
        });
      }
      if (!h())
        return y();
      const ee = G[0] ?? null;
      f = ii(
        t.event,
        R.event.id,
        ee
      ), D = G;
    }
    let F;
    try {
      F = await b(f, D);
    } catch {
      if (O) return y();
      throw new Error("post_event_session_changed");
    }
    if (!F.success || !F.result.success)
      return O ? y(F.result) : this.finalizeSubmittedPost(F.result, t.hashtags, t.rqNotifyOptions);
    const M = F.result.success ? {
      ...F.result,
      eventId: F.result.eventId ?? F.event.id,
      event: F.event
    } : F.result;
    await this.saveSubmittedPostHistory({
      event: F.event,
      attestation: F.attestation,
      result: M,
      additionalWriteRelays: t.additionalWriteRelays,
      writeRelayHintSnapshot: t.writeRelayHintSnapshot
    });
    const J = !h(), ne = this.finalizeSubmittedPost(
      J ? { ...M, preserveComposerContent: !0 } : M,
      t.hashtags,
      t.rqNotifyOptions,
      !J && this.getReplyQuoteIdentity() === s
    );
    return this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: ne.success
    }), ne;
  }
  // 外部APIは変更なし（後方互換性のため）
  validatePost(t) {
    const n = this.deps.authStateStore;
    return ri.validatePost(
      t,
      n.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, n, o = []) {
    let a = si(t);
    const s = this.deps.settingsStore.quoteNotificationEnabled, u = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      a,
      s
    ) ?? new qe().extractInlineQuoteTags(
      a,
      s
    ), h = this.deps.replyQuoteState.value;
    if (h.quotes.length > 0) {
      const y = this.deps.replyQuoteService || new qe(), b = new Set(
        u.filter((f) => f[0] === "q").map((f) => f[1])
      ), O = h.quotes.filter((f) => !b.has(f.eventId)).map(
        (f) => y.generateNostrUri(
          f.eventId,
          f.relayHints,
          f.authorPubkey
        )
      );
      O.length > 0 && (a = `${a.trimEnd()}
${O.join(`
`)}`.trim());
    }
    const v = this.validatePost(a);
    if (!v.valid)
      return this.notifyPostFailure(v.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    if (hi() && Ce.sanitizeExternalRelayUrls(
      this.deps.writeRelaysStore?.value
    ).length === 0)
      return this.notifyPostFailure("no_write_relays");
    try {
      const y = this.deps.authStateStore, b = oi(y), O = this.deps.hashtagStore, { hashtags: f, tags: D } = this.getHashtagArrays(O), F = this.deps.keyManager, M = this.deps.window || (typeof window < "u" ? window : void 0), J = this.deps.contentWarningStore.value, ne = this.deps.contentWarningReasonStore.value, N = this.deps.settingsStore.failClosedContentWarning === !0, R = this.deps.channelContextState?.value ?? null, G = R?.channelRelays, ee = Ce.sanitizeExternalRelayUrls([
        ...Object.values(this.rxNostr.getDefaultRelays()).filter((I) => I.write).map((I) => I.url),
        ...this.deps.writeRelaysStore?.value ?? [],
        ...G ?? []
      ]), oe = Ce.sanitizeExternalRelayUrls(
        this.deps.writeRelaysStore?.value ?? []
      ), P = this.deps.replyQuoteState.value;
      let A;
      const d = this.getReplyQuoteNotifyOptions(), W = P.reply?.referencedEvent ?? null;
      if (P.reply && !R && (!W || W.id !== P.reply.eventId || ![1, 1111].includes(W.kind) || P.reply.authorPubkey && W.pubkey !== P.reply.authorPubkey))
        return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
      const $ = ai({
        channel: !!R,
        hasReply: !!P.reply,
        ...W ? { replyKind: W.kind } : {}
      });
      if ($ === null)
        return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
      if (P.reply || P.quotes.length > 0) {
        const I = this.deps.replyQuoteService || new qe();
        if (A = [], P.reply)
          if (R)
            A.push([
              "e",
              P.reply.eventId,
              P.reply.relayHints[0] || "",
              "reply",
              ...P.reply.authorPubkey ? [P.reply.authorPubkey] : []
            ]), I.buildReplyTags(P.reply).filter((x) => x[0] === "p").forEach((x) => {
              A.push(x);
            });
          else if ($ === 1111) {
            const x = W ? await this.buildNip22ReplyTags(
              W,
              P.reply.relayHints[0] ?? ""
            ) : null;
            if (!x)
              return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
            if (A.push(...x), $ === 1111) {
              const C = new Set(
                A.filter((k) => k[0] === "p").map((k) => k[1])
              );
              I.buildReplyTags(P.reply).filter((k) => k[0] === "p").forEach((k) => {
                C.has(k[1]) || (C.add(k[1]), A.push(k));
              });
            }
          } else
            A.push(...I.buildReplyTags(P.reply));
        const p = /* @__PURE__ */ new Set(), l = new Set(
          A.filter((x) => x[0] === "p").map((x) => x[1])
        );
        P.quotes.forEach((x) => {
          I.buildQuoteTags(x, x.quoteNotificationEnabled).forEach((C) => {
            if (C[0] === "q") {
              if (p.has(C[1]))
                return;
              p.add(C[1]);
            }
            if (C[0] === "p") {
              if (l.has(C[1]))
                return;
              l.add(C[1]);
            }
            A.push(C);
          });
        });
      }
      if (u.length > 0) {
        A || (A = []);
        const I = new Set(
          A.filter((l) => l[0] === "q").map((l) => l[1])
        ), p = new Set(
          A.filter((l) => l[0] === "p").map((l) => l[1])
        );
        for (const l of u)
          l[0] === "q" && !I.has(l[1]) ? (A.push(l), I.add(l[1])) : l[0] === "p" && !p.has(l[1]) && (A.push(l), p.add(l[1]));
      }
      const re = y.value;
      if (re.type === "nip07" && F.isWindowNostrAvailable() && M?.nostr)
        try {
          const I = re.pubkey;
          if (!I)
            return this.notifyPostFailure("pubkey_not_found");
          const p = typeof M.nostr.signEvent == "function" ? M.nostr.signEvent.bind(M.nostr) : void 0;
          if (!p)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const l = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: f,
            tags: D,
            pubkey: I,
            imageImetaMap: n,
            contentWarningEnabled: J,
            contentWarningReason: ne,
            failClosedContentWarning: N,
            publicationKind: $,
            replyQuoteTags: A,
            channelContext: R,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: l,
            sessionPubkey: b,
            hashtags: f,
            rqNotifyOptions: d,
            signEvent: p,
            logSignedEvent: !0,
            additionalWriteRelays: G,
            splitSensitiveContent: N,
            writeRelaySnapshot: ee,
            writeRelayHintSnapshot: oe,
            replyQuoteIdentity: JSON.stringify({ reply: P.reply?.eventId ?? null, quotes: P.quotes.map((x) => x.eventId) })
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (re.type === "nip46")
        try {
          const I = re.pubkey;
          if (!I)
            return this.notifyPostFailure("pubkey_not_found");
          const p = await this.deps.getNip46SignerForSessionFn?.(I), l = this.deps.authStateStore.value;
          if (!p || !l.isAuthenticated || l.type !== "nip46" || l.pubkey !== I)
            return this.notifyPostFailure("nip46_signer_not_available");
          const x = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: f,
            tags: D,
            pubkey: I,
            imageImetaMap: n,
            contentWarningEnabled: J,
            contentWarningReason: ne,
            failClosedContentWarning: N,
            publicationKind: $,
            replyQuoteTags: A,
            channelContext: R,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: x,
            sessionPubkey: b,
            hashtags: f,
            rqNotifyOptions: d,
            signer: p,
            additionalWriteRelays: G,
            splitSensitiveContent: N,
            writeRelaySnapshot: ee,
            writeRelayHintSnapshot: oe,
            replyQuoteIdentity: JSON.stringify({ reply: P.reply?.eventId ?? null, quotes: P.quotes.map((C) => C.eventId) })
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (re.type === "parentClient") {
        const I = this.deps.getParentClientSignerFn?.();
        if (!I)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const p = re.pubkey;
        if (!p)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const l = await this.buildSubmissionEvent({
            processedContent: a,
            hashtags: f,
            tags: D,
            pubkey: p,
            imageImetaMap: n,
            contentWarningEnabled: J,
            contentWarningReason: ne,
            failClosedContentWarning: N,
            publicationKind: $,
            replyQuoteTags: A,
            channelContext: R,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: l,
            sessionPubkey: b,
            hashtags: f,
            rqNotifyOptions: d,
            signer: I,
            additionalWriteRelays: G,
            splitSensitiveContent: N,
            writeRelaySnapshot: ee,
            writeRelayHintSnapshot: oe,
            replyQuoteIdentity: JSON.stringify({ reply: P.reply?.eventId ?? null, quotes: P.quotes.map((x) => x.eventId) })
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const L = F.getFromStore() || F.loadFromStorage(re.pubkey);
      if (!L)
        return this.notifyPostFailure("key_not_found");
      const te = await this.buildSubmissionEvent({
        processedContent: a,
        hashtags: f,
        tags: D,
        pubkey: b,
        imageImetaMap: n,
        contentWarningEnabled: J,
        contentWarningReason: ne,
        failClosedContentWarning: N,
        publicationKind: $,
        replyQuoteTags: A,
        channelContext: R,
        emojiTags: o
      }), z = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(L) : xt(L);
      return await this.sendPreparedEvent({
        event: te,
        sessionPubkey: b,
        hashtags: f,
        rqNotifyOptions: d,
        signer: z,
        additionalWriteRelays: G,
        splitSensitiveContent: N,
        writeRelaySnapshot: ee,
        writeRelayHintSnapshot: oe,
        replyQuoteIdentity: JSON.stringify({ reply: P.reply?.eventId ?? null, quotes: P.quotes.map((I) => I.eventId) })
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
    const n = t || this.deps.hashtagStore, o = this.deps.hashtagSnapshotFn;
    if (o) {
      const a = o(n);
      return {
        hashtags: Array.isArray(a?.hashtags) ? [...a.hashtags] : [],
        tags: Array.isArray(a?.tags) ? a.tags.map((s) => [...s]) : []
      };
    }
    if (n === Pt)
      try {
        const a = Ot();
        return {
          hashtags: Array.isArray(a?.hashtags) ? [...a.hashtags] : [],
          tags: Array.isArray(a?.tags) ? a.tags.map((s) => [...s]) : []
        };
      } catch (a) {
        this.deps.console?.warn("hashtag_snapshot_failed", a);
      }
    return {
      hashtags: Array.isArray(n?.hashtags) ? [...n.hashtags] : [],
      tags: Array.isArray(n?.tags) ? n.tags.map((a) => [...a]) : []
    };
  }
  // --- PostComponent 統合メソッド ---
  preparePostPayload(t) {
    const n = this.deps.extractContentWithEmojiTagsFn(t);
    if (!this.deps.mediaFreePlacementStore.value) {
      const o = this.deps.mediaGalleryStore.getContentUrls();
      if (o.length > 0) {
        const a = n.content.trim();
        return {
          content: a ? a + `
` + o.join(`
`) : o.join(`
`),
          emojiTags: n.emojiTags
        };
      }
    }
    return n;
  }
  preparePostContent(t) {
    return this.preparePostPayload(t).content;
  }
  prepareImageBlurhashMap(t, n, o) {
    if (!this.deps.mediaFreePlacementStore.value)
      return this.deps.mediaGalleryStore.getImageBlurhashMap();
    const a = {};
    t?.state?.doc?.descendants?.((h) => {
      if (h.type?.name !== "image" || !h.attrs?.src || h.attrs?.isPlaceholder)
        return;
      const v = typeof h.attrs.size == "number" ? h.attrs.size : Number(h.attrs.size);
      a[h.attrs.src] = {
        dim: h.attrs.dim ?? void 0,
        alt: h.attrs.alt ?? void 0,
        size: Number.isFinite(v) && v > 0 ? v : void 0,
        uploadProtocol: h.attrs.uploadProtocol ?? void 0
      };
    });
    const s = this.deps.extractImageBlurhashMapFn(t), u = {};
    for (const [h, v] of Object.entries(s))
      u[h] = {
        m: li(h),
        blurhash: v,
        dim: a[h]?.dim,
        alt: a[h]?.alt,
        size: a[h]?.size,
        uploadProtocol: a[h]?.uploadProtocol,
        ox: n[h],
        x: o[h]
      };
    return u;
  }
  async performPostSubmission(t, n, o, a, s, u, h) {
    const v = this.prepareImageBlurhashMap(t, o, a);
    s?.();
    try {
      const y = await this.submitPost(n.content, v, n.emojiTags);
      y.success ? u?.(y) : h?.(y.error || "post_error");
    } catch {
      h?.("post_error");
    }
  }
  applyEmptyStateToEditor(t) {
    t.chain().clearContent().run();
  }
  resetPostContent(t) {
    this.applyEmptyStateToEditor(t), this.deps.resetEditorStateFn?.(), this.deps.resetPostStatusFn?.(), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), this.deps.clearReplyQuoteFn?.();
  }
  clearContentAfterSuccess(t) {
    const n = this.deps.hashtagPinStore.value, o = n ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), n && o.length > 0) {
      const a = " " + o.map((s) => "#" + s).join(" ");
      t.commands.insertContent(a);
    }
    t.commands.setTextSelection(1);
  }
}
function lr(i) {
  return !!i && i.length > 0;
}
function dr(i, t, n) {
  i.isUploading = t, n !== void 0 && (i.uploadErrorMessage = n);
}
function cr(i) {
  const t = i.target;
  return t?.files?.length ? t.files : void 0;
}
function ur({
  getCurrentEditor: i,
  getFileInput: t,
  getImageOxMap: n,
  getImageXMap: o,
  getUploadFailedText: a,
  updateUploadState: s,
  setUploadErrorMessage: u,
  uploadFiles: h
}) {
  const v = async (b) => lr(b) ? await h({
    files: b,
    currentEditor: i(),
    fileInput: t(),
    updateUploadState: s,
    setUploadErrorMessage: u,
    imageOxMap: n(),
    imageXMap: o(),
    getUploadFailedText: a
  }) ?? null : null;
  return {
    performUpload: v,
    handleFileSelect: (b) => {
      const O = cr(b);
      O && v(O);
    }
  };
}
let B = je({
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
}), Le;
function Mt() {
  Le !== void 0 && (clearTimeout(Le), Le = void 0);
}
const ue = {
  get value() {
    return B;
  },
  // 秘密鍵ダイアログ
  showSecretKeyDialog: (i, t = []) => {
    B.pendingPost = i, B.pendingEmojiTags = t.map((n) => [...n]), B.showSecretKeyDialog = !0;
  },
  hideSecretKeyDialog: () => {
    B.showSecretKeyDialog = !1, B.pendingPost = "", B.pendingEmojiTags = [];
  },
  getPendingPost: () => B.pendingPost,
  getPendingEmojiTags: () => B.pendingEmojiTags.map((i) => [...i]),
  // 画像フルスクリーン
  showImageFullscreen: (i, t = "", n = "") => {
    B.fullscreenMediaId = n, B.fullscreenImageSrc = i, B.fullscreenImageAlt = t, B.showImageFullscreen = !0;
  },
  hideImageFullscreen: () => {
    B.showImageFullscreen = !1, B.fullscreenMediaId = "", B.fullscreenImageSrc = "", B.fullscreenImageAlt = "";
  },
  // フローティングメッセージ
  showFloatingMessage: (i, t, n, o = 1800) => {
    Mt(), B.floatingMessageX = i, B.floatingMessageY = t, B.floatingMessageText = n, B.showFloatingMessage = !0, Le = setTimeout(
      () => {
        B.showFloatingMessage = !1, Le = void 0;
      },
      o
    );
  },
  hideFloatingMessage: () => {
    Mt(), B.showFloatingMessage = !1;
  }
};
var pr = ge('<img draggable="false"/>'), hr = ge('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), gr = ge('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const fr = {
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
function Bt(i, t) {
  it(t, !0), Ze(i, fr);
  const n = () => et(tt, "$_", o), [o, a] = Je();
  let s = j(t, "item", 7), u = j(t, "index", 7), h = j(t, "onDelete", 7), v = j(t, "onDragStart", 7), y = j(t, "onDragOver", 7), b = j(t, "onDragEnd", 7), O = j(t, "onDrop", 7), f = j(t, "onTouchDragStart", 7), D = j(t, "disabled", 7, !1), F = V(void 0), M = V(void 0);
  const J = mi();
  gi(() => e(F), {
    onLongPress: (g, H) => {
      D() || f()?.(u(), g, H);
    }
  });
  let ne = E(() => !s().isPlaceholder && s().type === "image" && !!s().src), N = E(() => !s().isPlaceholder && s().type === "video" && !!s().src);
  const R = 180, G = 100, ee = 180;
  let oe = E(() => {
    if (!s().isPlaceholder) return;
    const g = s().dimensions;
    if (g && g.width > 0 && g.height > 0) {
      const H = g.width / g.height, Q = Math.round(R * H);
      return `width: ${Math.max(G, Math.min(ee, Q))}px; height: ${R}px;`;
    }
    return `width: ${ee}px; height: ${R}px;`;
  });
  function P() {
    s().isPlaceholder || s().type !== "image" || ue.showImageFullscreen(s().src, s().alt || "", s().id);
  }
  function A(g) {
    if (D()) {
      g.preventDefault();
      return;
    }
    if (e(F) && g.dataTransfer) {
      const H = e(F).getBoundingClientRect(), Q = g.clientX - H.left, Z = g.clientY - H.top;
      g.dataTransfer.setDragImage(e(F), Q, Z);
    }
    v()(u(), g);
  }
  function d(g) {
    g.stopPropagation(), e(M) && (e(M).paused ? e(M).play() : e(M).pause());
  }
  function W(g) {
    g.preventDefault(), !D() && y()(u(), g);
  }
  function $(g) {
    g.preventDefault(), !D() && O()(u());
  }
  function re(g) {
    s().type !== "image" || s().isPlaceholder || (g.key === "Enter" || g.key === " " || g.key === "Spacebar") && (g.preventDefault(), P());
  }
  var fe = {
    get item() {
      return s();
    },
    set item(g) {
      s(g), K();
    },
    get index() {
      return u();
    },
    set index(g) {
      u(g), K();
    },
    get onDelete() {
      return h();
    },
    set onDelete(g) {
      h(g), K();
    },
    get onDragStart() {
      return v();
    },
    set onDragStart(g) {
      v(g), K();
    },
    get onDragOver() {
      return y();
    },
    set onDragOver(g) {
      y(g), K();
    },
    get onDragEnd() {
      return b();
    },
    set onDragEnd(g) {
      b(g), K();
    },
    get onDrop() {
      return O();
    },
    set onDrop(g) {
      O(g), K();
    },
    get onTouchDragStart() {
      return f();
    },
    set onTouchDragStart(g) {
      f(g), K();
    },
    get disabled() {
      return D();
    },
    set disabled(g = !1) {
      D(g), K();
    }
  }, L = gr();
  let te;
  var z = ye(L), I = ye(z);
  {
    var p = (g) => {
      {
        let H = E(() => s().type === "video" ? n()("videoNode.uploading") : n()("imageNode.uploading"));
        fi(g, {
          get text() {
            return e(H);
          },
          showLoader: !0
        });
      }
    };
    de(I, (g) => {
      s().isPlaceholder && g(p);
    });
  }
  var l = he(I, 2);
  {
    var x = (g) => {
      var H = pr();
      let Q;
      Pe(() => {
        pe(H, "src", s().src), pe(H, "alt", s().alt || ""), Q = Me(H, 1, "gallery-image svelte-aw59wn", null, Q, { "image-loading": !J.isLoaded });
      }), se("load", H, function(...Z) {
        J.handleLoad?.apply(this, Z);
      }), se("error", H, function(...Z) {
        J.handleError?.apply(this, Z);
      }), Ee("contextmenu", H, (Z) => Z.preventDefault()), ir(H), ce(g, H);
    };
    de(l, (g) => {
      e(ne) && g(x);
    });
  }
  var C = he(l, 2);
  {
    var k = (g) => {
      var H = hr(), Q = ye(H);
      Q.muted = !0, ke(Q, (we) => m(M, we), () => e(M));
      var Z = he(Q, 2);
      ve(H), Pe(() => {
        pe(Q, "src", s().src), pe(Z, "draggable", !D());
      }), Ee("contextmenu", Q, (we) => we.preventDefault()), se("dragstart", Z, A), Ee("click", Z, d), ce(g, H);
    };
    de(C, (g) => {
      e(N) && g(k);
    });
  }
  ve(z);
  var U = he(z, 2);
  {
    var q = (g) => {
      {
        let H = E(() => n()("imageContextMenu.delete")), Q = E(() => n()("imageContextMenu.copyUrl")), Z = E(() => n()("imageContextMenu.copySuccess"));
        vi(g, {
          get src() {
            return s().src;
          },
          onDelete: () => h()(s().id),
          get deleteAriaLabel() {
            return e(H);
          },
          get copyAriaLabel() {
            return e(Q);
          },
          get copySuccessMessage() {
            return e(Z);
          },
          layout: "gallery",
          get deleteDisabled() {
            return D();
          }
        });
      }
    };
    de(U, (g) => {
      s().isPlaceholder || g(q);
    });
  }
  ve(L), ke(L, (g) => m(F, g), () => e(F)), Pe(() => {
    te = Me(L, 1, "gallery-item svelte-aw59wn", null, te, {
      "is-placeholder": s().isPlaceholder,
      "is-disabled": D()
    }), pe(L, "draggable", !D() && (s().type !== "video" || s().isPlaceholder)), Ht(z, e(oe)), pe(z, "role", s().type === "image" && !s().isPlaceholder ? "button" : void 0), pe(z, "tabindex", s().type === "image" && !s().isPlaceholder ? 0 : void 0), pe(z, "aria-label", s().alt || s().src);
  }), se("dragstart", L, A), se("dragover", L, W), se("drop", L, $), se("dragend", L, () => b()()), Ee("click", z, function(...g) {
    (s().type === "image" && !s().isPlaceholder ? P : void 0)?.apply(this, g);
  }), Ee("keydown", z, re), ce(i, L);
  var me = rt(fe);
  return a(), me;
}
Wt(["click", "keydown", "contextmenu"]);
nt(
  Bt,
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
function vr(i) {
  return Math.abs(i.deltaX) > Math.abs(i.deltaY) ? i.deltaX : i.deltaY;
}
function mr(i, t) {
  const n = i.scrollHeight - i.clientHeight;
  if (n <= 1)
    return !1;
  const o = i.scrollTop <= 0, a = i.scrollTop >= n - 1;
  return t > 0 ? !a : t < 0 ? !o : !1;
}
function yr(i, t) {
  const n = i.scrollWidth - i.clientWidth;
  if (n <= 1)
    return !1;
  const o = i.scrollLeft <= 0, a = i.scrollLeft >= n - 1;
  return t > 0 ? !a : t < 0 ? !o : !1;
}
function wr(i, t, n = null) {
  if (n && mr(n, t.deltaY))
    return !1;
  const o = vr(t);
  if (!yr(i, o))
    return !1;
  const a = Math.max(
    0,
    i.scrollWidth - i.clientWidth
  );
  return i.scrollLeft = Math.min(
    a,
    Math.max(0, i.scrollLeft + o)
  ), !0;
}
var Sr = ge("<div><!></div>"), br = ge('<div role="list"></div>');
const Er = {
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
function qt(i, t) {
  it(t, !0), Ze(i, Er);
  const n = () => et(tt, "$_", o), [o, a] = Je();
  let s = V(-1), u = V(-1), h = V(-1), v = V(-1), y = null, b = 60, O = 60, f = V(void 0), D = null, F = E(() => le.items), M = E(() => X.postStatus.sending), J = E(() => {
    const p = e(s) !== -1 ? e(s) : e(h), l = e(s) !== -1 ? e(u) : e(v);
    return p === -1 || l === -1 || l === p || l === p + 1 ? -1 : l;
  });
  function ne(p, l) {
    if (e(M)) {
      l.preventDefault();
      return;
    }
    m(s, p, !0), l.dataTransfer?.setData("text/plain", String(p)), l.dataTransfer && (l.dataTransfer.effectAllowed = "move");
  }
  function N(p, l) {
    if (l.preventDefault(), e(M)) return;
    const C = e(f)?.querySelectorAll(".gallery-item-wrapper")?.[p];
    if (C) {
      const k = C.getBoundingClientRect();
      m(u, l.clientX < k.left + k.width / 2 ? p : p + 1, !0);
    } else
      m(u, p, !0);
  }
  function R() {
    d(), m(s, -1), m(u, -1);
  }
  function G(p) {
  }
  function ee(p) {
    if (e(s) === -1) return;
    if (p.preventDefault(), e(M)) {
      d(), m(u, -1);
      return;
    }
    const l = e(f)?.querySelectorAll(".gallery-item-wrapper");
    if (l && l.length > 0) {
      const x = l[0].getBoundingClientRect(), C = l[l.length - 1].getBoundingClientRect();
      p.clientX < x.left ? m(u, 0) : p.clientX > C.right && m(u, e(F).length, !0);
    }
    if (e(f)) {
      const x = e(f).getBoundingClientRect();
      p.clientX - x.left < Re ? A("left", p.clientX) : x.right - p.clientX < Re ? A("right", p.clientX) : d();
    }
  }
  function oe(p) {
    if (p.preventDefault(), d(), e(M)) {
      m(s, -1), m(u, -1);
      return;
    }
    const l = e(u);
    if (e(s) !== -1 && l !== -1 && l !== e(s) && l !== e(s) + 1) {
      const x = e(s) < l ? l - 1 : l;
      le.reorderItems(e(s), x);
    }
    m(s, -1), m(u, -1);
  }
  function P(p) {
    e(M) || le.removeItem(p);
  }
  function A(p, l) {
    if (!e(f)) return;
    D !== null && (cancelAnimationFrame(D), D = null);
    const x = e(f).getBoundingClientRect(), C = p === "left" ? l - x.left : x.right - l, k = Math.max(0, Math.min(1, C / Re)), U = Ct + (wi - Ct) * (1 - k), q = () => {
      if (!e(f)) return;
      const me = e(f).scrollWidth - e(f).clientWidth;
      p === "left" && e(f).scrollLeft > 0 ? (e(f).scrollLeft = Math.max(0, e(f).scrollLeft - U), D = requestAnimationFrame(q)) : p === "right" && e(f).scrollLeft < me ? (e(f).scrollLeft = Math.min(me, e(f).scrollLeft + U), D = requestAnimationFrame(q)) : D = null;
    };
    D = requestAnimationFrame(q);
  }
  function d() {
    D !== null && (cancelAnimationFrame(D), D = null);
  }
  function W(p, l, x) {
    if (e(M)) return;
    m(h, p, !0), fe();
    const C = e(f)?.querySelectorAll(".gallery-item-wrapper")[p];
    if (C) {
      const k = C.getBoundingClientRect(), U = 120, q = Math.min(U / k.width, U / k.height);
      b = k.width * q / 2, O = k.height * q / 2, y = C.cloneNode(!0), y.style.cssText = `
                position: fixed;
                left: ${l - b}px;
                top: ${x - O}px;
                width: ${k.width}px;
                height: ${k.height}px;
                transform-origin: top left;
                transform: scale(${q});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, sr().overlayTarget.appendChild(y);
    }
    document.addEventListener("touchmove", $, { passive: !1 }), document.addEventListener("touchend", re, { passive: !1 });
  }
  function $(p) {
    if (e(h) === -1 || p.touches.length !== 1) return;
    if (p.preventDefault(), e(M)) {
      d(), m(v, -1);
      return;
    }
    const l = p.touches[0];
    y && (y.style.left = `${l.clientX - b}px`, y.style.top = `${l.clientY - O}px`), y && (y.style.display = "none");
    const x = document.elementFromPoint(l.clientX, l.clientY);
    y && (y.style.display = "");
    const C = x?.closest(".gallery-item-wrapper");
    if (C && e(f)) {
      const k = e(f).querySelectorAll(".gallery-item-wrapper"), U = Array.from(k).indexOf(C);
      if (U !== -1) {
        const q = C.getBoundingClientRect();
        m(v, l.clientX < q.left + q.width / 2 ? U : U + 1, !0);
      }
    } else if (e(f)) {
      const k = e(f).querySelectorAll(".gallery-item-wrapper");
      if (k.length > 0) {
        const U = k[0].getBoundingClientRect(), q = k[k.length - 1].getBoundingClientRect();
        l.clientX <= U.left ? m(v, 0) : l.clientX >= q.right && m(v, e(F).length, !0);
      }
    }
    if (e(f)) {
      const k = e(f).getBoundingClientRect();
      l.clientX - k.left < Re ? A("left", l.clientX) : k.right - l.clientX < Re ? A("right", l.clientX) : d();
    }
  }
  function re() {
    if (document.removeEventListener("touchmove", $), document.removeEventListener("touchend", re), d(), e(M)) {
      fe(), m(h, -1), m(v, -1);
      return;
    }
    const p = e(v);
    if (e(h) !== -1 && p !== -1 && p !== e(h) && p !== e(h) + 1) {
      const l = e(h) < p ? p - 1 : p;
      le.reorderItems(e(h), l);
    }
    fe(), m(h, -1), m(v, -1);
  }
  function fe() {
    y && (y.remove(), y = null);
  }
  function L(p) {
    if (!e(f)) return;
    const l = e(f).closest(".composer-scroll-region");
    wr(e(f), p, l instanceof HTMLElement ? l : null) && p.preventDefault();
  }
  be(() => {
    if (e(f))
      return e(f).addEventListener("wheel", L, { passive: !1 }), () => {
        e(f)?.removeEventListener("wheel", L);
      };
  });
  var te = rr(), z = zt(te);
  {
    var I = (p) => {
      var l = br();
      let x;
      yi(l, 23, () => e(F), (C) => C.id, (C, k, U) => {
        var q = Sr();
        let me;
        var g = ye(q);
        Bt(g, {
          get item() {
            return e(k);
          },
          get index() {
            return e(U);
          },
          onDelete: P,
          onDragStart: ne,
          onDragOver: N,
          onDragEnd: R,
          onDrop: G,
          onTouchDragStart: W,
          get disabled() {
            return e(M);
          }
        }), ve(q), Pe(() => me = Me(q, 1, "gallery-item-wrapper svelte-w2vv8k", null, me, {
          "insert-bar-left": e(J) === e(U),
          "insert-bar-right": e(J) === e(F).length && e(U) === e(F).length - 1
        })), ce(C, q);
      }), ve(l), ke(l, (C) => m(f, C), () => e(f)), Pe(
        (C) => {
          x = Me(l, 1, "media-gallery svelte-w2vv8k", null, x, { sending: e(M) }), pe(l, "aria-label", C);
        },
        [() => n()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), se("dragover", l, ee), se("drop", l, oe), ce(p, l);
    };
    de(z, (p) => {
      e(F).length > 0 && p(I);
    });
  }
  ce(i, te), rt(), a();
}
nt(qt, {}, [], [], { mode: "open" });
function Ve(i) {
  if (!i || !i.types) return !1;
  try {
    return Array.from(i.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function jt(i) {
  if (!i) return !1;
  try {
    return Array.from(i.types).includes("Files") || i.files && i.files.length > 0;
  } catch {
    return !!(i.files && i.files.length > 0);
  }
}
function Oe(i) {
  const t = i.__postStatus;
  return (typeof t == "function" ? t() : t)?.sending === !0;
}
function He(i) {
  return typeof i.__uploadFiles == "function";
}
function Pr(i) {
  let t = V(!1);
  function n(s) {
    if (Oe(i) || !He(i)) {
      s.preventDefault(), m(t, !1), i.classList.remove("drag-over");
      return;
    }
    const u = s.dataTransfer, h = Ve(u);
    jt(u) && !h ? (s.preventDefault(), e(t) || (m(t, !0), i.classList.add("drag-over"))) : e(t) && (m(t, !1), i.classList.remove("drag-over"));
  }
  function o(s) {
    e(t) && (m(t, !1), i.classList.remove("drag-over"));
  }
  async function a(s) {
    if (m(t, !1), i.classList.remove("drag-over"), Oe(i) || !He(i)) {
      s.preventDefault();
      return;
    }
    const u = s.dataTransfer;
    Ve(u) || u?.files && u.files.length > 0 && typeof i.__uploadFiles == "function" && (s.preventDefault(), i.__uploadFiles(u.files));
  }
  return i.addEventListener("dragover", n), i.addEventListener("dragleave", o), i.addEventListener("drop", a), {
    destroy() {
      i.removeEventListener("dragover", n), i.removeEventListener("dragleave", o), i.removeEventListener("drop", a);
    }
  };
}
function xr(i, t) {
  const n = Pr(i);
  function o(u) {
    if (Oe(i) || !He(i)) {
      u.preventDefault(), t.dragOver(!1);
      return;
    }
    const h = u.dataTransfer, v = Ve(h);
    jt(h) && !v ? t.dragOver(!0) : t.dragOver(!1);
  }
  function a(u) {
    t.dragOver(!1);
  }
  function s(u) {
    t.dragOver(!1), (Oe(i) || !He(i)) && u.preventDefault();
  }
  return i.addEventListener("dragover", o), i.addEventListener("dragleave", a), i.addEventListener("drop", s), {
    destroy() {
      n?.destroy?.(), i.removeEventListener("dragover", o), i.removeEventListener("dragleave", a), i.removeEventListener("drop", s);
    }
  };
}
function Cr(i) {
  function t(n) {
    if (Oe(i)) {
      n.preventDefault();
      return;
    }
    if (!n.clipboardData) return;
    if (!He(i)) {
      Array.from(n.clipboardData.items).some((s) => s.kind === "file" && s.type.startsWith("image/")) && n.preventDefault();
      return;
    }
    const o = [];
    for (const a of n.clipboardData.items)
      if (a.kind === "file" && a.type.startsWith("image/")) {
        const s = a.getAsFile();
        s && o.push(s);
      }
    o.length > 0 && (n.preventDefault(), i.__uploadFiles?.(o));
  }
  return i.addEventListener("paste", t), {
    destroy() {
      i.removeEventListener("paste", t);
    }
  };
}
function _r(i) {
  function t(o) {
    const a = o.target;
    if (a && (a.closest('.editor-image-button[data-dragging="true"]') || a.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const s = o.touches[0], u = 120, h = _t.querySelector(".tiptap-editor");
      if (h) {
        const v = h.getBoundingClientRect(), y = s.clientY < v.top + u, b = s.clientY > v.bottom - u;
        if (!y && !b)
          return o.preventDefault(), !1;
      }
    }
  }
  function n(o) {
    const a = _t.querySelectorAll(".drop-zone-indicator");
    a.forEach((s) => {
      s.classList.remove("drop-zone-hover"), s.classList.add("drop-zone-fade-out");
    }), setTimeout(
      () => {
        a.forEach((s) => {
          s.parentNode && s.parentNode.removeChild(s);
        });
      },
      300
    );
  }
  return i.addEventListener("touchmove", t), i.addEventListener("touchend", n), {
    destroy() {
      i.removeEventListener("touchmove", t), i.removeEventListener("touchend", n);
    }
  };
}
function Ir(i, t = !0) {
  function n(o) {
    if (t && (o.ctrlKey || o.metaKey) && (o.key === "Enter" || o.key === "NumpadEnter")) {
      o.preventDefault();
      const a = i.__currentEditor, s = typeof a == "function" ? a() : a, u = i.__hasPostingCapability, h = typeof u == "function" ? u() : u, v = i.__hasStoredKey, y = typeof v == "function" ? v() : v, b = i.__postStatus, O = typeof b == "function" ? b() : b, f = s ? bi(s) : "";
      !O?.sending && f.trim() && (h ?? y) && i.__submitPost?.();
    }
  }
  return i.addEventListener("keydown", n), {
    destroy() {
      i.removeEventListener("keydown", n);
    }
  };
}
function Fr(i) {
  let t = !1;
  return i?.descendants((n) => {
    if (t) return !1;
    const o = n.type?.name;
    (o === "image" || o === "video") && (t = !0);
  }), t;
}
function kr(i) {
  const { currentEditor: t, editorContainerEl: n, callbacks: o } = i, a = (h) => {
    const y = h.detail.plainText, b = t ? Fr(t.state?.doc) : !1;
    o.onContentUpdate?.(y, b);
  }, s = (h) => {
    const v = h;
    o.onImageFullscreenRequest?.(v.detail.src, v.detail.alt || "", v.detail.mediaId);
  }, u = (h) => {
    const y = h?.detail?.pos;
    if (y != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const b = Si.create(t.state.doc, y);
        t.view.dispatch(t.state.tr.setSelection(b).scrollIntoView());
      } catch (b) {
        console.warn("select-image-node handler failed:", b);
      }
      o.onSelectImageNode?.(y);
    }
  };
  return window.addEventListener("editor-content-changed", a), window.addEventListener("image-fullscreen-request", s), window.addEventListener("select-image-node", u), n && (n.addEventListener("image-fullscreen-request", s), n.addEventListener("select-image-node", u)), {
    handleContentUpdate: a,
    handleImageFullscreenRequest: s,
    handleSelectImageNode: u
  };
}
function Mr(i, t) {
  window.removeEventListener("editor-content-changed", i.handleContentUpdate), window.removeEventListener("image-fullscreen-request", i.handleImageFullscreenRequest), window.removeEventListener("select-image-node", i.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", i.handleImageFullscreenRequest), t.removeEventListener("select-image-node", i.handleSelectImageNode));
}
function Tr() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function Dr(i) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (i?.rejectedRelays?.length ?? 0) > 0 || (i?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function Rr(i) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: i || "postComponent.post_error",
    completed: !1
  };
}
function Ar({
  updatePostStatus: i,
  clearContentAfterSuccess: t,
  onPostSuccess: n
}) {
  return {
    markSending: () => {
      i(Tr());
    },
    markSuccess: (o) => {
      i(Dr(o)), o?.preserveComposerContent || (t(), n?.(o));
    },
    markFailure: (o) => {
      i(Rr(o));
    }
  };
}
async function Lr(i) {
  const t = i.postManager.prepareImageBlurhashMap(
    i.currentEditor,
    i.imageOxMap,
    i.imageXMap
  );
  i.onStart();
  try {
    const n = i.pendingEmojiTags?.length ? await i.postManager.submitPost(
      i.pendingPost,
      t,
      i.pendingEmojiTags
    ) : await i.postManager.submitPost(
      i.pendingPost,
      t
    );
    if (n.success) {
      i.onSuccess(n);
      return;
    }
    i.onFailure(n.error);
  } catch {
    i.onFailure();
  }
}
function Tt(i) {
  if (i.dimensions && i.dimensions.width > 0 && i.dimensions.height > 0)
    return {
      width: i.dimensions.width,
      height: i.dimensions.height
    };
  const t = Ei(i.dim);
  return t || {};
}
function Or(i) {
  if (!i.mediaFreePlacement)
    return i.galleryItems.filter((n) => !n.isPlaceholder).map((n) => {
      const o = Tt({
        dim: n.dim,
        dimensions: n.dimensions
      });
      return {
        id: n.id,
        src: n.src,
        alt: n.alt,
        type: n.type,
        dim: n.dim,
        width: o.width,
        height: o.height
      };
    });
  if (!i.currentEditor)
    return [];
  const t = [];
  return i.currentEditor.state.doc.descendants((n) => {
    if ((n.type.name === "image" || n.type.name === "video") && !n.attrs.isPlaceholder) {
      const o = Tt({
        dim: n.attrs.dim
      });
      t.push({
        id: n.attrs.id,
        src: n.attrs.src,
        alt: n.attrs.alt,
        type: n.type.name,
        dim: n.attrs.dim,
        width: o.width,
        height: o.height
      });
    }
  }), t;
}
function Hr(i, t, n) {
  if (t) {
    const o = i.findIndex((a) => a.id === t);
    if (o >= 0)
      return o;
  }
  return n ? i.findIndex((o) => o.src === n) : -1;
}
function Nr(i, t) {
  return i[t];
}
function Wr(i) {
  const t = [];
  return i.state.doc.descendants((n, o) => {
    (n.type.name === "image" || n.type.name === "video") && !n.attrs.isPlaceholder && t.push({ node: n, pos: o });
  }), t;
}
function zr(i) {
  const t = Wr(i.currentEditor);
  if (t.length === 0)
    return !1;
  t.forEach(({ node: o }) => {
    const a = o.attrs.src;
    a && i.addGalleryItem({
      id: i.createMediaItemId(),
      type: o.type.name,
      src: a,
      isPlaceholder: !1,
      blurhash: o.attrs.blurhash ?? void 0,
      ox: i.imageOxMap[a] ?? void 0,
      x: i.imageXMap[a] ?? void 0,
      dim: o.attrs.dim ?? void 0,
      size: typeof o.attrs.size == "number" ? o.attrs.size : void 0,
      alt: o.attrs.alt ?? void 0,
      uploadProtocol: o.attrs.uploadProtocol ?? void 0
    });
  });
  let n = i.currentEditor.state.tr;
  return [...t].reverse().forEach(({ node: o, pos: a }) => {
    n = n.delete(a, a + o.nodeSize);
  }), i.currentEditor.view.dispatch(n), !0;
}
function Br(i) {
  if (i.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = i.currentEditor.state;
  let n = i.currentEditor.state.tr, o = i.currentEditor.state.doc.content.size;
  const a = {}, s = {};
  return i.items.forEach((u) => {
    if (u.isPlaceholder)
      return;
    const h = u.src;
    if (u.type === "image" && t.nodes.image) {
      const v = t.nodes.image.create({
        src: h,
        alt: u.alt ?? "Image",
        blurhash: u.blurhash ?? null,
        dim: u.dim ?? null,
        size: u.size ?? null,
        uploadProtocol: u.uploadProtocol ?? null
      });
      n = n.insert(o, v), o += v.nodeSize;
    } else if (u.type === "video" && t.nodes.video) {
      const v = t.nodes.video.create({ src: h });
      n = n.insert(o, v), o += v.nodeSize;
    }
    u.ox && (a[h] = u.ox), u.x && (s[h] = u.x);
  }), i.currentEditor.view.dispatch(n), {
    imageOxMap: a,
    imageXMap: s,
    hadItems: !0
  };
}
async function qr(i) {
  const {
    input: t,
    postHistoryRepositoryImpl: n = Nt,
    postMediaCacheRepositoryImpl: o = xi
  } = i;
  await n.putPostedEvent(t);
  const a = Pi(t.event).map((s) => s.url).filter(Boolean);
  a.length !== 0 && await o.linkEventIdByUrls({
    eventId: t.event.id,
    urls: a
  });
}
function jr(i) {
  const {
    placeholderText: t,
    editorContainerEl: n,
    hasStoredKey: o,
    hasPostingCapability: a,
    submitPost: s,
    onCustomEmojiSelect: u,
    enterKeyBehavior: h,
    hostOwnedLite: v,
    uploadFiles: y,
    eventCallbacks: b
  } = i;
  Ci.value = t;
  const O = _i({
    isInputBlocked: i.isInputBlocked,
    isCompositionInputAllowed: i.isCompositionInputAllowed,
    compositionController: i.compositionController,
    placeholderText: t,
    onSubmitPost: s,
    onCustomEmojiSelect: u,
    enterKeyBehavior: h,
    hostOwnedLite: v,
    onCreate: (M) => {
      _e.set(M);
    }
  });
  let f = null;
  const D = O.subscribe((M) => {
    f = M;
  }), F = kr({
    currentEditor: f,
    editorContainerEl: n,
    callbacks: b
  });
  return Ii(s), n && Object.assign(n, {
    __uploadFiles: y,
    __currentEditor: () => f,
    __hasStoredKey: () => o,
    __hasPostingCapability: () => a ?? o,
    __postStatus: () => X.postStatus,
    __submitPost: s
  }), { editor: O, unsubscribe: D, handlers: F };
}
function Kr(i) {
  const {
    unsubscribe: t,
    componentUnsubscribe: n,
    handlers: o,
    currentEditor: a,
    editorContainerEl: s,
    submitPost: u
  } = i;
  Mr(o, s), _e.value === a && _e.set(null), Fi(u), n(), t(), a && !a.isDestroyed && a.destroy(), s && (delete s.__uploadFiles, delete s.__currentEditor, delete s.__hasStoredKey, delete s.__hasPostingCapability, delete s.__postStatus, delete s.__submitPost);
}
function Ur(i, t) {
  const n = i.view.dom;
  if (ki() && document.activeElement !== n) {
    i.commands.insertCustomEmoji(t);
    return;
  }
  i.chain().focus().insertCustomEmoji(t).run();
}
var Gr = ge('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), Qr = ge('<div class="plane-icon svg-icon svelte-15ticnd"></div>'), Xr = ge('<div class="editor-submit-button-container svelte-15ticnd"><!></div>'), $r = ge('<input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/>'), Yr = ge('<div class="upload-error svelte-15ticnd"> </div>'), Vr = ge('<div class="svelte-15ticnd"> </div>'), Zr = ge('<div data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!> <!></div> <!> <!> <!></div> <!> <!> <!>', 1);
const Jr = {
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
function es(i, t) {
  it(t, !0), Ze(i, Jr);
  const n = () => et(tt, "$_", o), [o, a] = Je();
  let s = j(t, "rxNostr", 7), u = j(t, "hasStoredKey", 7), h = j(t, "hasPostingCapability", 23, u), v = j(t, "isSwitchingAccount", 7, !1), y = j(t, "onPostSuccess", 7), b = j(t, "availableComposerHeight", 7, Fe), O = j(t, "minEditorHeight", 7, Fe), f = j(t, "onCustomEmojiSelect", 7), D = j(t, "onEditorEmptyChange", 7), F = j(t, "notificationPort", 7), M = j(t, "hostOwnedConfig", 7), J = j(t, "hostCustomEmojiItems", 23, () => []), ne = j(t, "normalUploadFiles", 7);
  const R = !1;
  let G = E(() => !R), ee = E(() => X.isUploading), oe = E(() => X.canPost), P = E(() => R), A = V(null), d = V(null), W = V(null), $ = V(!1), re = V(!1), fe = V(void 0), L = V(void 0), te = V(je({})), z = V(je({})), I = E(() => $e.value), p = E(() => X.postStatus), l = E(() => X.uploadErrorMessage), x = E(() => nr.value), C = E(() => Ui.value), k = E(() => Gi.value), U = V(!0), q = !1, me = E(() => u() && !v() && e(C) && !e(k) && e(U)), g = null, H = null, Q = null, Z = null, we = V(je(Fe)), Te = E(() => R), Kt = E(() => e(Te) ? `--post-editor-auto-grow-min-lines: ${M().editorMinLines}lh; --post-editor-auto-grow-max-lines: ${M().editorMaxLines}lh;` : `--post-editor-min-height: ${O()}px; --post-editor-target-height: ${e(we)}px;`), st = E(() => n()("postComponent.enter_your_text") || "テキストを入力してください");
  function ie() {
    return e(p).sending || e($);
  }
  be(() => {
    e(d), Mi(e(st));
  }), be(() => {
  });
  function ot() {
    if (e(Te)) return;
    const r = O();
    if (!g || !H) {
      m(we, r, !0);
      return;
    }
    const c = Array.from(g.children).reduce(
      (_, T) => T === H ? _ : _ + $i(T),
      0
    ), w = Yi({
      availableComposerHeight: b(),
      nonEditorHeight: c,
      minHeight: r
    });
    e(we) !== w && m(we, w, !0);
  }
  function Ut(r) {
    if (ie()) {
      r.preventDefault();
      return;
    }
    !(r.target instanceof HTMLElement) || !e(d) || Ki(r.target) || e(d).commands.focus("end");
  }
  function Gt(r) {
    !e(d) || r.currentTarget !== r.target || r.key !== "Enter" && r.key !== " " || (r.preventDefault(), e(d).commands.focus("end"));
  }
  function Qt(r) {
    ie() && (e(W)?.isCompositionInputAllowed() && (r.isComposing || r.keyCode === 229) || (r.preventDefault(), r.stopPropagation()));
  }
  function Ne(r) {
    const c = e(W)?.isCompositionInputAllowed() && r instanceof InputEvent && (r.isComposing || r.inputType === "insertCompositionText" || r.inputType === "insertFromComposition");
    ie() && !c && (r.preventDefault(), r.stopPropagation());
  }
  function Xt(r) {
    r.preventDefault();
  }
  function $t(r) {
    const c = e(d)?.view.dom;
    !e(P) || !c || r.relatedTarget !== c || c.focus({ preventScroll: !0 });
  }
  let Se = E(() => ue.value), Ke = E(() => e(Se).showSecretKeyDialog), at = E(() => e(Se).showImageFullscreen), Yt = E(() => e(Se).fullscreenMediaId), lt = E(() => e(Se).fullscreenImageSrc), Vt = E(() => e(Se).fullscreenImageAlt), dt = E(() => e(Se).showFloatingMessage), Zt = E(() => e(Se).floatingMessageX), Jt = E(() => e(Se).floatingMessageY), en = E(() => e(Se).floatingMessageText);
  be(() => {
    s() && (e(L) ? e(L).setRxNostr(s()) : m(
      L,
      new ar(s(), {
        getNip46SignerForSessionFn: (r) => Ri.getSignerForSession(r),
        getParentClientSignerFn: () => Di.getSigner(),
        channelContextState: Ti,
        replyQuoteState: At,
        replyQuoteService: new qe(),
        clearReplyQuoteFn: Ye,
        savePostHistoryFn: (r) => qr({ input: r, postHistoryRepositoryImpl: Nt }),
        notificationPort: F()
      }),
      !0
    ));
  });
  const Ue = ur({
    getCurrentEditor: () => e(d),
    getFileInput: () => e(fe),
    getImageOxMap: () => e(te),
    getImageXMap: () => e(z),
    getUploadFailedText: (r) => n()(r),
    updateUploadState: (r, c) => {
      dr(X, r, c);
    },
    setUploadErrorMessage: (r) => {
      X.uploadErrorMessage = r;
    },
    uploadFiles: async (r) => {
      if (ie() || X.isSubmitPending || X.isUploading || R)
        return null;
      {
        if (ne()) return await ne()(r);
        const { uploadFiles: c } = await import("./App-B2pbRRzr.js").then((w) => w.eQ);
        return await c(r);
      }
    }
  });
  function tn() {
    const r = !!(e(d)?.view.composing && Xi());
    r && e(d)?.view.dom.blur(), pt(), r ? e(W)?.retire() : e(W)?.markStale();
  }
  const De = Ar({
    updatePostStatus: It,
    clearContentAfterSuccess: tn,
    onPostSuccess: (r) => y()?.(r)
  });
  function ct(r) {
    e(W)?.markFailure(), De.markFailure(r);
  }
  be(() => {
    if (e(Te)) return;
    if (b(), O(), e(I), e(l), e(d), e(I) || le.items.length, typeof window > "u") {
      m(we, Fe, !0);
      return;
    }
    const r = window.requestAnimationFrame(() => {
      ot();
    });
    return () => {
      window.cancelAnimationFrame(r);
    };
  }), be(() => {
    if (e(Te) || (b(), O(), e(d), e(I), e(l), !g || typeof ResizeObserver > "u"))
      return;
    let r = null;
    const c = () => {
      r === null && (r = window.requestAnimationFrame(() => {
        r = null, ot();
      }));
    }, w = new ResizeObserver(c);
    c(), w.observe(g);
    for (const _ of Array.from(g.children))
      _ !== H && w.observe(_);
    return () => {
      w.disconnect(), r !== null && window.cancelAnimationFrame(r);
    };
  }), Ai(() => {
    m($, !1), m(
      W,
      new or((S) => {
        m($, S === "stale");
      }),
      !0
    ), Q = jr({
      isInputBlocked: ie,
      isCompositionInputAllowed: () => !!e(W)?.isCompositionInputAllowed(),
      compositionController: e(W) ?? void 0,
      placeholderText: e(st),
      editorContainerEl: H,
      currentEditor: e(d),
      hasStoredKey: u(),
      hasPostingCapability: h(),
      submitPost: We,
      onCustomEmojiSelect: f(),
      enterKeyBehavior: void 0,
      hostOwnedLite: R,
      uploadFiles: e(G) ? (S) => {
        ie() || Ue.performUpload(S);
      } : void 0,
      eventCallbacks: {
        onContentUpdate: Qi,
        onImageFullscreenRequest: (S, ae, xe) => {
          ue.showImageFullscreen(S, ae, xe || "");
        },
        onSelectImageNode: (S) => {
        }
      }
    }), m(A, Q.editor, !0);
    let r = null;
    const c = (S) => {
      const ae = S.isEmpty, xe = !q || e(U) !== ae;
      m(U, ae, !0), q = !0, xe && D()?.(ae);
    }, w = (S) => {
      ze(S, le.hasNonPlaceholderItems());
    }, _ = ({ editor: S }) => {
      c(S), w(S);
    };
    Z = e(A).subscribe((S) => {
      if (S !== null && S === r) {
        m(d, S, !0), S && (c(S), w(S));
        return;
      }
      r && r.off("transaction", _), r = S, m(d, S, !0), S ? (e(W)?.attach(S), c(S), w(S)) : (e(W)?.detach(), ze(null, !1)), S?.on("transaction", _), _e.set(S);
    });
    const T = (S) => {
      const ae = S, { src: xe, alt: Nn, mediaId: Wn } = ae.detail;
      ue.showImageFullscreen(xe, Nn, Wn || "");
    };
    return window.addEventListener("image-fullscreen-request", T), () => {
      e(W)?.destroy(), m(W, null), m($, !1), ze(null, !1), _e.value === e(d) && (X.isSubmitPending = !1, ue.hideSecretKeyDialog()), window.removeEventListener("image-fullscreen-request", T), Q && (r && r.off("transaction", _), Kr({
        unsubscribe: Q.unsubscribe,
        componentUnsubscribe: Z ?? (() => {
        }),
        handlers: Q.handlers,
        currentEditor: e(d),
        editorContainerEl: H,
        submitPost: We
      }), Z = null);
    };
  });
  const nn = Ue.handleFileSelect;
  async function rn(r) {
    return ie() ? null : await Ue.performUpload(r);
  }
  function sn() {
    e(d)?.commands.focus();
  }
  function on() {
    e(d)?.commands.blur();
  }
  function an(r) {
    if (!e(d) || !r || ie()) return;
    const c = e(
      d
      // nullチェック済みのローカル変数
    ), _ = r.split(`
`).map((T) => ({
      type: "paragraph",
      content: T ? [{ type: "text", text: T }] : void 0
    }));
    c.commands.setContent({ type: "doc", content: _ }), c.commands.focus("end");
  }
  function ln(r) {
    if (!e(d) || !r || ie()) return !1;
    const w = r.split(`
`).map((_) => ({
      type: "paragraph",
      content: _ ? [{ type: "text", text: _ }] : void 0
    }));
    return e(d).isEmpty ? e(d).commands.setContent({ type: "doc", content: w }) : e(d).chain().focus("end").insertContent([{ type: "paragraph" }, ...w]).run(), e(d).commands.focus("end"), !0;
  }
  function dn(r) {
    if (!e(d) || !r || ie()) return;
    const c = Oi(r);
    e(d).commands.setContent(c || "<p></p>"), e(d).commands.focus("end");
  }
  function cn() {
    return e(d) ? e(d).getHTML() : "";
  }
  function un(r) {
    if (!e(d) || r.length === 0 || ie()) return;
    const { schema: c } = e(d).state;
    let w = e(d).state.tr, _ = e(d).state.doc.content.size;
    r.forEach((T) => {
      if (T.isPlaceholder) return;
      const S = T.src;
      if (T.type === "image" && c.nodes.image) {
        const ae = c.nodes.image.create({
          src: S,
          alt: T.alt ?? "Image",
          blurhash: T.blurhash ?? null,
          dim: T.dim ?? null,
          size: T.size ?? null,
          uploadProtocol: T.uploadProtocol ?? null
        });
        w = w.insert(_, ae), _ += ae.nodeSize, T.ox && m(te, { ...e(te), [S]: T.ox }, !0), T.x && m(z, { ...e(z), [S]: T.x }, !0);
      } else if (T.type === "video" && c.nodes.video) {
        const ae = c.nodes.video.create({ src: S });
        w = w.insert(_, ae), _ += ae.nodeSize;
      }
    }), e(d).view.dispatch(w), e(d).commands.focus("end");
  }
  function pn(r) {
    !e(d) || ie() || Ur(e(d), r);
  }
  function Ge() {
    if (!e(d)) return;
    Bi(e(d).view.dom) || qi(e(d));
  }
  function ut(r) {
    if (!e(d) || ie()) return;
    Ge();
    const { state: c, view: w } = e(d), _ = r < 0 ? c.selection.from : c.selection.to, T = Math.max(0, Math.min(c.doc.content.size, _ + r));
    if (T === _) return;
    const S = zi.near(c.doc.resolve(T), r);
    w.dispatch(c.tr.setSelection(S).scrollIntoView().setMeta("addToHistory", !1));
  }
  function hn() {
    ut(-1);
  }
  function gn() {
    ut(1);
  }
  function fn() {
    if (!e(d) || ie()) return;
    Ge();
    const { state: r, view: c } = e(d), { selection: w } = r;
    if (!w.empty) {
      e(d).commands.deleteSelection();
      return;
    }
    const T = w.$from.nodeBefore;
    if (T) {
      const S = T.isText ? Array.from(T.text ?? "").at(-1)?.length ?? 0 : T.nodeSize;
      S > 0 && c.dispatch(r.tr.delete(w.from - S, w.from).scrollIntoView());
      return;
    }
    e(d).commands.first(({ commands: S }) => [
      () => S.joinBackward(),
      () => S.selectNodeBackward()
    ]);
  }
  function vn() {
    !e(d) || ie() || (Ge(), e(d).commands.keyboardShortcut("Enter"));
  }
  function mn() {
    return Qe() && ji(e(d), le.hasNonPlaceholderItems()) && !X.isSubmitPending && !e(Ke);
  }
  function Qe() {
    return !!e(d) && !!e(L) && !v() && !e(p).sending && !X.isUploading && !e(p).completed && h();
  }
  async function We(r) {
    if (!e(d) || !mn() || !e(L)) return;
    const c = e(d);
    X.isSubmitPending = !0;
    try {
      if (c.isDestroyed || _e.value !== c || !Qe()) return;
      const w = e(L).preparePostPayload(c);
      if (Hi(c.state.doc), Ni(w.content)) {
        ue.showSecretKeyDialog(w.content, w.emojiTags), X.isSubmitPending = !1;
        return;
      }
      c.view.composing && e(W)?.startSession(Ft.getState(c.state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await e(L).performPostSubmission(
        c,
        w,
        e(te),
        e(z),
        () => {
          De.markSending(), X.isSubmitPending = !1;
        },
        De.markSuccess,
        ct
      );
    } finally {
      _e.value === c && (X.isSubmitPending = !1);
    }
  }
  function yn() {
    if (e(d)) {
      if (e(L)) {
        e(L).resetPostContent(e(d));
        return;
      }
      e(d).chain().clearContent().run();
    }
  }
  function pt() {
    if (e(L) && e(d)) {
      e(L).clearContentAfterSuccess(e(d));
      return;
    }
    if (e(d)) {
      const r = M()?.hashtagPinEnabled === !0 && Lt.value ? [...Ot().hashtags] : [];
      e(d).chain().clearContent().run(), Dt.reset(), Rt.reset(), le.clearAll(), m(te, {}, !0), m(z, {}, !0), Ye(), r.length > 0 && e(d).commands.insertContent(` ${r.map((c) => `#${c}`).join(" ")}`), e(d).commands.focus("start");
    }
  }
  async function wn() {
    if (!e(Ke) || !Qe()) return;
    const r = ue.getPendingPost(), c = ue.getPendingEmojiTags();
    r.trim() && e(L) && e(d) && (e(d).view.composing && e(W)?.startSession(Ft.getState(e(d).state) ?? { idsByGeneration: /* @__PURE__ */ new Map() }), await Lr({
      postManager: e(L),
      currentEditor: e(d),
      imageOxMap: e(te),
      imageXMap: e(z),
      pendingPost: r,
      pendingEmojiTags: c,
      onStart: () => {
        De.markSending(), ue.hideSecretKeyDialog();
      },
      onSuccess: De.markSuccess,
      onFailure: ct
    }));
  }
  const Sn = ue.hideSecretKeyDialog, bn = ue.hideImageFullscreen;
  let Xe = E(() => Or({
    mediaFreePlacement: e(I),
    galleryItems: le.items,
    currentEditor: e(d)
  })), En = E(() => Hr(e(Xe), e(Yt), e(lt)));
  function Pn(r) {
    const c = Nr(e(Xe), r);
    c && ue.showImageFullscreen(c.src, c.alt ?? "", c.id ?? "");
  }
  be(() => {
    e(d) && e(L) && e(L).preparePostContent(e(d)) !== X.content && e(p).error && It({ ...e(p), error: !1, message: "" });
  });
  function xn() {
    !e(G) || ie() || X.isSubmitPending || X.isUploading || e(fe)?.click();
  }
  be(() => {
    const r = le.items.some((c) => !c.isPlaceholder);
    ze(e(d), r);
  });
  let ht = !0;
  be(() => {
    const r = !$e.value;
    if (ht) {
      ht = !1;
      return;
    }
    if (!e(d)) return;
    const c = e(d);
    if (r)
      Ae(() => zr({
        currentEditor: c,
        imageOxMap: e(te),
        imageXMap: e(z),
        addGalleryItem: (_) => le.addItem(_),
        createMediaItemId: Wi
      })) && Ae(() => {
        m(te, {}, !0), m(z, {}, !0);
      });
    else {
      const w = Ae(() => le.getItems()), _ = Br({ currentEditor: c, items: w });
      _.hadItems && Ae(() => {
        m(te, _.imageOxMap, !0), m(z, _.imageXMap, !0);
      }), Ae(() => le.clearAll());
    }
  });
  var Cn = {
    uploadFiles: rn,
    focusEditor: sn,
    blurEditor: on,
    insertTextContent: an,
    appendSharedTextContent: ln,
    loadDraftContent: dn,
    getEditorHtml: cn,
    appendMediaToEditor: un,
    insertCustomEmoji: pn,
    moveCaretLeft: hn,
    moveCaretRight: gn,
    deleteBackward: fn,
    insertLineBreak: vn,
    submitPost: We,
    resetPostContent: yn,
    clearContentAfterSuccess: pt,
    openFileDialog: xn,
    get rxNostr() {
      return s();
    },
    set rxNostr(r) {
      s(r), K();
    },
    get hasStoredKey() {
      return u();
    },
    set hasStoredKey(r) {
      u(r), K();
    },
    get hasPostingCapability() {
      return h();
    },
    set hasPostingCapability(r = u) {
      h(r), K();
    },
    get isSwitchingAccount() {
      return v();
    },
    set isSwitchingAccount(r = !1) {
      v(r), K();
    },
    get onPostSuccess() {
      return y();
    },
    set onPostSuccess(r) {
      y(r), K();
    },
    get availableComposerHeight() {
      return b();
    },
    set availableComposerHeight(r = Fe) {
      b(r), K();
    },
    get minEditorHeight() {
      return O();
    },
    set minEditorHeight(r = Fe) {
      O(r), K();
    },
    get onCustomEmojiSelect() {
      return f();
    },
    set onCustomEmojiSelect(r) {
      f(r), K();
    },
    get onEditorEmptyChange() {
      return D();
    },
    set onEditorEmptyChange(r) {
      D(r), K();
    },
    get notificationPort() {
      return F();
    },
    set notificationPort(r) {
      F(r), K();
    },
    get hostOwnedConfig() {
      return M();
    },
    set hostOwnedConfig(r) {
      M(r), K();
    },
    get hostCustomEmojiItems() {
      return J();
    },
    set hostCustomEmojiItems(r = []) {
      J(r), K();
    },
    get normalUploadFiles() {
      return ne();
    },
    set normalUploadFiles(r) {
      ne(r), K();
    }
  }, gt = Zr(), Ie = zt(gt);
  let ft;
  var Y = ye(Ie);
  let vt;
  var mt = ye(Y);
  {
    var _n = (r) => {
      var c = Gr(), w = ye(c);
      {
        let _ = E(() => e(x)?.picture || "");
        Vi(w, {
          get src() {
            return e(_);
          },
          alt: "",
          fallbackAriaLabel: "",
          rootClassName: "editor-account-placeholder-avatar",
          imageClassName: "editor-account-placeholder-image",
          fallbackClassName: "editor-account-placeholder-fallback"
        });
      }
      ve(c), ce(r, c);
    };
    de(mt, (r) => {
      e(me) && r(_n);
    });
  }
  var yt = he(mt, 2);
  {
    var In = (r) => {
      Zi(r, {
        get editor() {
          return e(d);
        },
        class: "editor-content"
      });
    };
    de(yt, (r) => {
      e(A) && e(d) && r(In);
    });
  }
  var Fn = he(yt, 2);
  {
    var kn = (r) => {
      var c = Xr(), w = ye(c);
      {
        let _ = E(() => !e(oe) || e(p).sending || e(ee) || !h() || e(p).completed), T = E(() => n()("postComponent.post"));
        Ji(w, {
          variant: "primary",
          shape: "circle",
          contentLayout: "icon",
          className: "editor-submit-button",
          get disabled() {
            return e(_);
          },
          onClick: () => {
            !e(oe) || e(p).sending || e(ee) || !h() || e(p).completed || We();
          },
          onfocus: $t,
          get ariaLabel() {
            return e(T);
          },
          children: (S, ae) => {
            var xe = Qr();
            ce(S, xe);
          },
          $$slots: { default: !0 }
        });
      }
      ve(c), se("pointerdown", c, Xt, !0), ce(r, c);
    };
    de(Fn, (r) => {
      e(P) && r(kn);
    });
  }
  ve(Y), Be(Y, (r, c) => xr?.(r, c), () => ({ dragOver: (r) => m(re, r, !0) })), Be(Y, (r) => Cr?.(r)), Be(Y, (r) => _r?.(r)), Be(Y, (r, c) => Ir?.(r, c), () => !R), ke(Y, (r) => H = r, () => H);
  var wt = he(Y, 2);
  {
    var Mn = (r) => {
      qt(r, {});
    };
    de(wt, (r) => {
      e(I) || r(Mn);
    });
  }
  var St = he(wt, 2);
  {
    var Tn = (r) => {
      var c = $r();
      ke(c, (w) => m(fe, w), () => e(fe)), Ee("change", c, nn), ce(r, c);
    };
    de(St, (r) => {
      e(G) && r(Tn);
    });
  }
  var Dn = he(St, 2);
  {
    var Rn = (r) => {
      var c = Yr(), w = ye(c, !0);
      ve(c), Pe(() => kt(w, e(l))), ce(r, c);
    };
    de(Dn, (r) => {
      e(l) && r(Rn);
    });
  }
  ve(Ie), ke(Ie, (r) => g = r, () => g);
  var bt = he(Ie, 2);
  {
    var An = (r) => {
      {
        let c = E(() => n()("postComponent.warning")), w = E(() => n()("postComponent.secret_key_detected")), _ = E(() => n()("postComponent.post")), T = E(() => n()("postComponent.cancel"));
        er(r, {
          get open() {
            return e(Ke);
          },
          get title() {
            return e(c);
          },
          get description() {
            return e(w);
          },
          get confirmLabel() {
            return e(_);
          },
          get cancelLabel() {
            return e(T);
          },
          confirmVariant: "danger",
          onConfirm: wn,
          get onCancel() {
            return Sn;
          },
          contentClass: "secretkey-warning-dialog"
        });
      }
    };
    de(bt, (r) => {
      r(An);
    });
  }
  var Et = he(bt, 2);
  Li(Et, {
    get src() {
      return e(lt);
    },
    get alt() {
      return e(Vt);
    },
    get onClose() {
      return bn;
    },
    get mediaList() {
      return e(Xe);
    },
    get currentIndex() {
      return e(En);
    },
    onNavigate: Pn,
    get show() {
      return e(at);
    },
    set show(r) {
      m(at, r);
    }
  });
  var Ln = he(Et, 2);
  {
    var On = (r) => {
      tr(r, {
        get show() {
          return e(dt);
        },
        get x() {
          return e(Zt);
        },
        get y() {
          return e(Jt);
        },
        children: (c, w) => {
          var _ = Vr(), T = ye(_, !0);
          ve(_), Pe(() => kt(T, e(en))), ce(c, _);
        },
        $$slots: { default: !0 }
      });
    };
    de(Ln, (r) => {
      e(dt) && r(On);
    });
  }
  Pe(
    (r) => {
      ft = Me(Ie, 1, "post-container svelte-15ticnd", null, ft, { "editor-auto-grow": e(Te) }), Ht(Ie, e(Kt)), vt = Me(Y, 1, "editor-container svelte-15ticnd", null, vt, {
        "drag-over": e(re),
        "gallery-mode": !e(I),
        sending: e(p).sending || e($),
        "editor-submit-enabled": e(P),
        "account-avatar-placeholder": e(me)
      }), pe(Y, "aria-label", r), pe(Y, "aria-readonly", e(p).sending || e($) ? "true" : void 0), pe(Y, "aria-disabled", void 0);
    },
    [() => n()("postComponent.editor_label")]
  ), Ee("click", Y, Ut), se("keydown", Y, Qt, !0), Ee("keydown", Y, Gt), se("beforeinput", Y, Ne, !0), se("paste", Y, Ne, !0), se("cut", Y, Ne, !0), se("drop", Y, Ne, !0), ce(i, gt);
  var Hn = rt(Cn);
  return a(), Hn;
}
Wt(["click", "keydown", "change"]);
nt(
  es,
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
  es as default
};
