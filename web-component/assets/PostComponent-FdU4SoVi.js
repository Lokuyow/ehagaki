import { i as ze, m as te, N as bt, a as En, r as xn, p as Pt, c as In, f as dt, b as Ae, h as ut, d as He, e as Fn, j as Mn, k as Cn, l as Et, s as kn, w as _n, n as xt, o as Tn, q as gt, t as Dn, u as It, v as An, x as Rn, y as Ln, z as Hn, A as Un, B as Ft, P as zn, C as On, R as pt, D as Te, E as Wn, F as Nn, G as Bn, H as jn, I as qn, J as Re, K as Xn, L as $n, M as Mt, O as Kn, Q as Gn, S as Qn, T as Vn, U as Yn, V as Zn, W as Jn, X as $e, Y as er, Z as tr, _ as nr, $ as rr, a0 as or, a1 as ar, a2 as sr, a3 as ir, a4 as lr, a5 as cr, a6 as dr, a7 as Ge, a8 as V, a9 as ur, aa as le, ab as Ee, ac as Qe, ad as ke, ae as se, af as Ct, ag as gr, ah as pr, ai as hr, aj as Ve, ak as Ye, al as fr, am as pe, an as Fe, ao as ht, ap as mr, aq as ft, ar as vr, as as kt, at as yr, au as wr, av as Sr, aw as br, ax as Ue, ay as Pr, az as Er, aA as xr, aB as Pe, aC as Ir, aD as Fr, aE as Mr, aF as Cr, aG as kr, aH as mt, aI as De, aJ as _r, aK as Tr, aL as Dr, aM as Ar, aN as Rr, aO as Lr, aP as Hr, aQ as Ur, aR as zr, aS as Or, aT as Wr, aU as Nr, aV as Br, aW as jr, aX as qr, aY as Xr, aZ as $r, a_ as Kr } from "./App-1qWol-Cs.js";
import { aZ as Gr, aO as Qr, aJ as Le, aq as _t, b4 as Ze, a_ as Je, a as r, bd as ie, Z as ye, bj as he, ap as ve, b1 as de, b2 as et, aQ as Y, b8 as me, b6 as fe, b3 as Z, b7 as ce, b as E, aP as C, be as Vr, aN as ge, a$ as Yr, b0 as Tt, bi as Zr, u as Me, bh as vt } from "./entry-De5pG27L.js";
function Dt(e, t, n) {
  if (e.length === 0)
    return "";
  if (e.length === 1) {
    const o = e[0].errorCode;
    return o ? n?.(o) || e[0].error || t : e[0].error || t;
  }
  return `${e.length}個のファイルのアップロードに失敗しました`;
}
function Jr(e, t) {
  let n, o = -1;
  return t.sizeInfo?.originalFilename && (o = e.findIndex(
    (s) => s.file.name === t.sizeInfo.originalFilename
  ), o !== -1 && (n = e[o])), !n && e.length > 0 && (n = e[0], o = 0), { matched: n, matchedIndex: o };
}
function eo(e) {
  return Dt(e, "postComponent.upload_failed");
}
function At(e, t, n, o) {
  e.update((s) => {
    const a = { ...s };
    return delete a[t], n && o && (a[n] = o), a;
  });
}
function Rt(e, t) {
  return {
    onAborted: e,
    onFailure: e,
    onRemaining: e,
    onSuccess: t
  };
}
function Lt(e, t) {
  te.removeItem(e), At(t, e);
}
function to(e) {
  return {
    serverBlurhash: e.blurhash ?? e.b ?? void 0,
    oxFromServer: e.ox ?? e.o ?? void 0,
    xFromServer: e.x ?? void 0,
    dimFromServer: e.dim ?? void 0,
    sizeFromServer: e.size ?? void 0
  };
}
function no(e) {
  if (typeof e == "number" && Number.isFinite(e) && e > 0)
    return e;
  if (typeof e == "string") {
    const t = Number(e);
    if (Number.isFinite(t) && t > 0)
      return t;
  }
}
function ro(e, t, n) {
  if (e.dimensions)
    return e.dimensions;
  const o = Pt(t);
  return o ? In(o.width, o.height) : n.dimensions;
}
function oo(e, t) {
  const { serverBlurhash: n, oxFromServer: o, xFromServer: s, dimFromServer: a, sizeFromServer: c } = to(e.nip94 || {}), i = ro(e, a, t);
  return {
    serverBlurhash: n,
    oxFromServer: o,
    xFromServer: s,
    blurhash: n ?? t.blurhash,
    ox: e.uploadProtocol === "blossom" ? void 0 : o ?? t.ox,
    dim: a ?? (i ? `${i.width}x${i.height}` : void 0),
    dimensions: i,
    size: no(c) ?? e.sizeInfo?.compressedSize,
    uploadProtocol: e.uploadProtocol
  };
}
async function Ht(e, t, n, o, s, a, c, i) {
  return At(
    a,
    t.placeholderId,
    n.dimensions ? e : void 0,
    n.dimensions
  ), ao(
    e,
    t,
    n.uploadProtocol,
    n.oxFromServer,
    n.xFromServer,
    o,
    s,
    c,
    i
  );
}
async function ao(e, t, n, o, s, a, c, i, d) {
  if (n !== "blossom" ? o ? a[e] = o : t.ox && (a[e] = t.ox) : delete a[e], s)
    return c[e] = s, s;
  try {
    const p = await i(e);
    return p && (c[e] = p), p ?? void 0;
  } catch (p) {
    d && console.warn("[placeholderManager] failed to calculate x hash", { url: e, error: p });
    return;
  }
}
function Ut(e, t, n, o, s) {
  const a = new o(), c = [];
  return e.forEach((i, d) => {
    const p = i.type.startsWith("video/"), f = a.validateMediaFile(i);
    if (!f.isValid) {
      n(f.errorMessage || "postComponent.upload_failed");
      return;
    }
    const P = `placeholder-${s}-${d}-${En()}`, g = t[d];
    c.push({
      file: i,
      placeholderId: P,
      ox: g?.ox,
      dimensions: g?.dimensions,
      isVideo: p
    });
  }), c;
}
function zt(e) {
  return async (t, n) => {
    const o = t.url;
    if (!o)
      return;
    const s = n.file.type.startsWith("video/");
    if (e.onBeforeReplace?.({
      url: o,
      matched: n,
      isVideo: s
    }), s) {
      await e.onVideoSuccess(o, n);
      return;
    }
    await e.onImageSuccess({
      url: o,
      matched: n,
      imageMetadata: oo(t, n)
    });
  };
}
async function Ot(e, t, n) {
  const o = [], s = [...t];
  for (const a of e) {
    if (a.aborted) {
      const i = s.shift();
      i && await n.onAborted(i);
      continue;
    }
    if (a.success && a.url) {
      const { matched: i, matchedIndex: d } = Jr(s, a);
      i && d !== -1 && (s.splice(d, 1), await n.onSuccess(a, i));
      continue;
    }
    o.push(a);
    const c = s.shift();
    c && await n.onFailure(c);
  }
  for (const a of s)
    await n.onRemaining(a);
  return {
    failedResults: o,
    errorMessage: eo(o)
  };
}
async function so(e, t, n = !1, o = ze) {
  if (o()) {
    n && console.log("[generateBlurhashes] Aborted before blurhash generation");
    return;
  }
  const s = new t(), a = e.map(async (c) => {
    if (o()) {
      n && console.log("[generateBlurhashes] Aborted during blurhash generation");
      return;
    }
    try {
      const i = await s.generateBlurhashForFile(c.file);
      if (o()) {
        n && console.log("[generateBlurhashes] Aborted after blurhash generation");
        return;
      }
      i && (c.blurhash = i);
    } catch (i) {
      n && console.warn("[generateBlurhashes] blurhash generation failed", {
        file: c.file.name,
        error: i
      });
    }
  });
  await Promise.all(a);
}
function io(e, t, n, o, s, a, c = !1) {
  if (!n) return [];
  const i = n.state, d = i.selection, p = d instanceof bt && d.node?.type?.name === "image", f = Date.now();
  c && console.log("[dev] insertPlaceholdersIntoEditor:", {
    fileCount: e.length,
    isImageNodeSelected: p,
    selectionType: d.constructor.name,
    selectionFrom: d.from,
    selectionTo: d.to,
    docSize: i.doc.content.size
  });
  const P = i.doc.childCount === 1 && i.doc.firstChild?.type.name === "paragraph" && i.doc.firstChild.content.size === 0;
  let g = i.tr, v = p ? d.to : d.from;
  const u = Ut(
    e,
    t,
    o,
    a,
    f
  ), x = [];
  return u.forEach((U, A) => {
    const { file: H, placeholderId: z, ox: _, dimensions: I, isVideo: X } = U;
    try {
      let O;
      if (X)
        O = i.schema.nodes.video.create({ src: z, isPlaceholder: !0 });
      else {
        const $ = { src: z, isPlaceholder: !0 };
        I && ($.dim = `${I.width}x${I.height}`, s.update((K) => ({ ...K, [z]: I }))), O = i.schema.nodes.image.create($);
      }
      P && A === 0 ? (g = g.replaceWith(0, i.doc.content.size, O), v = O.nodeSize) : (g = g.insert(v, O), v += O.nodeSize), x.push({ file: H, placeholderId: z, ox: _, dimensions: I });
    } catch (O) {
      c && console.error("[uploadHelper] failed to insert media node", {
        placeholderId: z,
        file: H.name,
        isVideo: X,
        error: O,
        insertPos: v,
        docSize: i.doc.content.size
      }), o(X ? "動画の挿入に失敗しました" : "画像の挿入に失敗しました");
    }
  }), x.length > 0 && n.view.dispatch(g), x;
}
async function lo(e, t, n, o, s, a, c, i = !1) {
  const d = {}, p = async (g) => {
    xn(
      g.placeholderId,
      g.file.type.startsWith("video/"),
      n,
      a,
      i
    );
  }, { failedResults: f, errorMessage: P } = await Ot(
    e,
    t,
    Rt(
      p,
      zt({
        onBeforeReplace: ({ url: g, matched: v, isVideo: u }) => {
          i && console.log("[uploadHelper] Replacing placeholder", {
            placeholderId: v.placeholderId,
            url: g,
            isVideo: u
          });
        },
        onVideoSuccess: (g, v) => {
          dt(
            n,
            (u) => u.type?.name === "video" && u.attrs?.src === v.placeholderId,
            (u, x) => {
              const U = n.state.tr.setNodeMarkup(x, void 0, {
                ...u.attrs,
                src: g,
                isPlaceholder: !1
              });
              n.view.dispatch(U);
            }
          );
        },
        onImageSuccess: async ({ url: g, matched: v, imageMetadata: u }) => {
          dt(
            n,
            (x) => x.type?.name === "image" && x.attrs?.src === v.placeholderId,
            (x, U) => {
              const A = {
                ...x.attrs,
                src: g,
                isPlaceholder: !1,
                blurhash: u.blurhash
              };
              u.dim && (A.dim = u.dim), A.size = u.size ?? null, A.uploadProtocol = u.uploadProtocol ?? null;
              const H = n.state.tr.setNodeMarkup(U, void 0, A);
              n.view.dispatch(H);
            }
          ), u.serverBlurhash && (d[g] = u.serverBlurhash), await Ht(
            g,
            v,
            u,
            o,
            s,
            a,
            c,
            i
          );
        }
      })
    )
  );
  return { failedResults: f, errorMessage: P, imageServerBlurhashMap: d };
}
function co(e, t, n, o, s, a = !1) {
  const c = Date.now(), i = Ut(
    e,
    t,
    n,
    s,
    c
  ), d = [];
  for (const p of i) {
    const { file: f, placeholderId: P, ox: g, dimensions: v, isVideo: u } = p, x = {
      id: P,
      type: u ? "video" : "image",
      src: P,
      isPlaceholder: !0,
      dimensions: v,
      dim: v ? `${v.width}x${v.height}` : void 0
    };
    te.addItem(x), !u && v && o.update((U) => ({ ...U, [P]: v })), d.push({ file: f, placeholderId: P, ox: g, dimensions: v }), a && console.log("[gallery] inserted placeholder:", P, u ? "video" : "image");
  }
  return d;
}
async function uo(e, t, n, o, s, a, c, i = !1) {
  return Ot(
    e,
    t,
    Rt(
      async (d) => {
        Lt(d.placeholderId, s);
      },
      zt({
        onVideoSuccess: (d, p) => {
          te.updateItem(p.placeholderId, {
            src: d,
            isPlaceholder: !1,
            mimeType: c(d)
          });
        },
        onImageSuccess: async ({ url: d, matched: p, imageMetadata: f }) => {
          const P = c(d);
          te.updateItem(p.placeholderId, {
            src: d,
            isPlaceholder: !1,
            blurhash: f.blurhash,
            mimeType: P,
            ox: f.ox,
            dim: f.dim,
            dimensions: f.dimensions,
            size: f.size,
            uploadProtocol: f.uploadProtocol
          });
          const g = await Ht(
            d,
            p,
            f,
            n,
            o,
            s,
            a,
            i
          );
          g && te.updateItem(p.placeholderId, { x: g }), i && console.log("[gallery] replaced placeholder:", p.placeholderId, "->", d);
        }
      })
    )
  );
}
function go(e, t) {
  for (const n of e)
    Lt(n.placeholderId, t);
}
class po {
  constructor(t, n = {}) {
    this.deps = n, t && this.setRxNostr(t), this.deps.console = n.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = n.authStateStore || Ae, this.deps.hashtagStore = n.hashtagStore || ut, this.deps.mediaFreePlacementStore = n.mediaFreePlacementStore || He, this.deps.mediaGalleryStore = n.mediaGalleryStore || te, this.deps.contentWarningStore = n.contentWarningStore || Fn, this.deps.contentWarningReasonStore = n.contentWarningReasonStore || Mn, this.deps.keyManager = n.keyManager || Cn, this.deps.createImetaTagFn = n.createImetaTagFn || Et, this.deps.settingsStore = n.settingsStore || kn, this.deps.writeRelaysStore = n.writeRelaysStore || _n, this.deps.replyQuoteState = n.replyQuoteState || xt, this.deps.getClientTagFn = n.getClientTagFn || (() => Tn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = n.seckeySignerFn || gt, this.deps.extractContentWithImagesFn = n.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = n.extractContentWithEmojiTagsFn || (n.extractContentWithImagesFn ? (o) => ({ content: n.extractContentWithImagesFn(o), emojiTags: [] }) : Dn), this.deps.extractImageBlurhashMapFn = n.extractImageBlurhashMapFn || It, this.deps.resetEditorStateFn = n.resetEditorStateFn || An, this.deps.resetPostStatusFn = n.resetPostStatusFn || Rn, this.deps.notificationPort = n.iframeMessageService || n.notificationPort || Ln, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = n.hashtagPinStore || Hn, this.deps.saveHashtagsToHistoryFn = n.saveHashtagsToHistoryFn || Un, this.deps.clearReplyQuoteFn = n.clearReplyQuoteFn || Ft;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new zn(t, this.deps.console || console);
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
    return On.buildEvent(
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
  finalizeSubmittedPost(t, n, o) {
    return t.success ? (Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(n)).catch(() => {
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
    const n = pt.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), o = pt.sanitizeExternalRelayUrls([
      ...n,
      ...t.additionalWriteRelays ?? [],
      ...this.deps.writeRelaysStore?.value ?? []
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
    const n = t.signEvent ?? (typeof t.signer?.signEvent == "function" ? t.signer.signEvent.bind(t.signer) : void 0);
    if (t.signer && !n)
      return this.notifyPostFailure("nostr_sign_event_not_supported");
    Te(this.deps.authStateStore, t.sessionPubkey);
    const o = Wn(t.event), s = n ? await n(o.signerTemplate) : t.event;
    Te(this.deps.authStateStore, t.sessionPubkey);
    let a;
    try {
      a = Nn(
        o.expectedTemplate,
        s,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    Te(this.deps.authStateStore, t.sessionPubkey);
    const c = Bn(a);
    if (!c)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: a?.kind ?? "(missing)"
    }), n && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), Te(this.deps.authStateStore, t.sessionPubkey);
    const i = await this.eventSender.sendEvent(c.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: i.success
    });
    const d = i.success ? {
      ...i,
      eventId: i.eventId ?? c.event.id,
      event: c.event
    } : i;
    return await this.saveSubmittedPostHistory({
      event: c.event,
      attestation: c.attestation,
      result: d,
      additionalWriteRelays: t.additionalWriteRelays
    }), this.finalizeSubmittedPost(
      d,
      t.hashtags,
      t.rqNotifyOptions
    );
  }
  // 外部APIは変更なし（後方互換性のため）
  validatePost(t) {
    const n = this.deps.authStateStore;
    return jn.validatePost(
      t,
      n.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, n, o = []) {
    let s = qn(t);
    const a = this.deps.settingsStore.quoteNotificationEnabled, c = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      s,
      a
    ) ?? new Re().extractInlineQuoteTags(
      s,
      a
    ), i = this.deps.replyQuoteState.value;
    if (i.quotes.length > 0) {
      const p = this.deps.replyQuoteService || new Re(), f = new Set(
        c.filter((g) => g[0] === "q").map((g) => g[1])
      ), P = i.quotes.filter((g) => !f.has(g.eventId)).map(
        (g) => p.generateNostrUri(
          g.eventId,
          g.relayHints,
          g.authorPubkey
        )
      );
      P.length > 0 && (s = `${s.trimEnd()}
${P.join(`
`)}`.trim());
    }
    const d = this.validatePost(s);
    if (!d.valid)
      return this.notifyPostFailure(d.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    try {
      const p = this.deps.authStateStore, f = Xn(p), P = this.deps.hashtagStore, { hashtags: g, tags: v } = this.getHashtagArrays(P), u = this.deps.keyManager, x = this.deps.window || (typeof window < "u" ? window : void 0), U = this.deps.contentWarningStore.value, A = this.deps.contentWarningReasonStore.value, H = this.deps.channelContextState?.value ?? null, z = H?.channelRelays, _ = this.deps.replyQuoteState.value;
      let I;
      const X = this.getReplyQuoteNotifyOptions();
      if (_.reply || _.quotes.length > 0) {
        const T = this.deps.replyQuoteService || new Re();
        I = [], _.reply && (H ? (I.push([
          "e",
          _.reply.eventId,
          _.reply.relayHints[0] || "",
          "reply",
          ..._.reply.authorPubkey ? [_.reply.authorPubkey] : []
        ]), T.buildReplyTags(_.reply).filter((M) => M[0] === "p").forEach((M) => {
          I.push(M);
        })) : I.push(...T.buildReplyTags(_.reply)));
        const R = /* @__PURE__ */ new Set(), S = new Set(
          I.filter((M) => M[0] === "p").map((M) => M[1])
        );
        _.quotes.forEach((M) => {
          T.buildQuoteTags(M, M.quoteNotificationEnabled).forEach((L) => {
            if (L[0] === "q") {
              if (R.has(L[1]))
                return;
              R.add(L[1]);
            }
            if (L[0] === "p") {
              if (S.has(L[1]))
                return;
              S.add(L[1]);
            }
            I.push(L);
          });
        });
      }
      if (c.length > 0) {
        I || (I = []);
        const T = new Set(
          I.filter((S) => S[0] === "q").map((S) => S[1])
        ), R = new Set(
          I.filter((S) => S[0] === "p").map((S) => S[1])
        );
        for (const S of c)
          S[0] === "q" && !T.has(S[1]) ? (I.push(S), T.add(S[1])) : S[0] === "p" && !R.has(S[1]) && (I.push(S), R.add(S[1]));
      }
      const O = p.value;
      if (O.type === "nip07" && u.isWindowNostrAvailable() && x?.nostr)
        try {
          const T = O.pubkey;
          if (!T)
            return this.notifyPostFailure("pubkey_not_found");
          const R = typeof x.nostr.signEvent == "function" ? x.nostr.signEvent.bind(x.nostr) : void 0;
          if (!R)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const S = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: g,
            tags: v,
            pubkey: T,
            imageImetaMap: n,
            contentWarningEnabled: U,
            contentWarningReason: A,
            replyQuoteTags: I,
            channelContext: H,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: f,
            hashtags: g,
            rqNotifyOptions: X,
            signEvent: R,
            logSignedEvent: !0,
            additionalWriteRelays: z
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (O.type === "nip46")
        try {
          const T = O.pubkey;
          if (!T)
            return this.notifyPostFailure("pubkey_not_found");
          const R = await this.deps.getNip46SignerForSessionFn?.(T), S = this.deps.authStateStore.value;
          if (!R || !S.isAuthenticated || S.type !== "nip46" || S.pubkey !== T)
            return this.notifyPostFailure("nip46_signer_not_available");
          const M = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: g,
            tags: v,
            pubkey: T,
            imageImetaMap: n,
            contentWarningEnabled: U,
            contentWarningReason: A,
            replyQuoteTags: I,
            channelContext: H,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: M,
            sessionPubkey: f,
            hashtags: g,
            rqNotifyOptions: X,
            signer: R,
            additionalWriteRelays: z
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (O.type === "parentClient") {
        const T = this.deps.getParentClientSignerFn?.();
        if (!T)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const R = O.pubkey;
        if (!R)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const S = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: g,
            tags: v,
            pubkey: R,
            imageImetaMap: n,
            contentWarningEnabled: U,
            contentWarningReason: A,
            replyQuoteTags: I,
            channelContext: H,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: f,
            hashtags: g,
            rqNotifyOptions: X,
            signer: T,
            additionalWriteRelays: z
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const K = u.getFromStore() || u.loadFromStorage(O.pubkey);
      if (!K)
        return this.notifyPostFailure("key_not_found");
      const oe = await this.buildSubmissionEvent({
        processedContent: s,
        hashtags: g,
        tags: v,
        imageImetaMap: n,
        contentWarningEnabled: U,
        contentWarningReason: A,
        replyQuoteTags: I,
        channelContext: H,
        emojiTags: o
      }), ne = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(K) : gt(K);
      return await this.sendPreparedEvent({
        event: oe,
        sessionPubkey: f,
        hashtags: g,
        rqNotifyOptions: X,
        signer: ne,
        additionalWriteRelays: z
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
      const s = o(n);
      return {
        hashtags: Array.isArray(s?.hashtags) ? [...s.hashtags] : [],
        tags: Array.isArray(s?.tags) ? s.tags.map((a) => [...a]) : []
      };
    }
    if (n === ut)
      try {
        const s = $n();
        return {
          hashtags: Array.isArray(s?.hashtags) ? [...s.hashtags] : [],
          tags: Array.isArray(s?.tags) ? s.tags.map((a) => [...a]) : []
        };
      } catch (s) {
        this.deps.console?.warn("hashtag_snapshot_failed", s);
      }
    return {
      hashtags: Array.isArray(n?.hashtags) ? [...n.hashtags] : [],
      tags: Array.isArray(n?.tags) ? n.tags.map((s) => [...s]) : []
    };
  }
  // --- PostComponent 統合メソッド ---
  preparePostPayload(t) {
    const n = this.deps.extractContentWithEmojiTagsFn(t);
    if (!this.deps.mediaFreePlacementStore.value) {
      const o = this.deps.mediaGalleryStore.getContentUrls();
      if (o.length > 0) {
        const s = n.content.trim();
        return {
          content: s ? s + `
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
    const s = {};
    t?.state?.doc?.descendants?.((i) => {
      if (i.type?.name !== "image" || !i.attrs?.src || i.attrs?.isPlaceholder)
        return;
      const d = typeof i.attrs.size == "number" ? i.attrs.size : Number(i.attrs.size);
      s[i.attrs.src] = {
        dim: i.attrs.dim ?? void 0,
        alt: i.attrs.alt ?? void 0,
        size: Number.isFinite(d) && d > 0 ? d : void 0,
        uploadProtocol: i.attrs.uploadProtocol ?? void 0
      };
    });
    const a = this.deps.extractImageBlurhashMapFn(t), c = {};
    for (const [i, d] of Object.entries(a))
      c[i] = {
        m: Mt(i),
        blurhash: d,
        dim: s[i]?.dim,
        alt: s[i]?.alt,
        size: s[i]?.size,
        uploadProtocol: s[i]?.uploadProtocol,
        ox: n[i],
        x: o[i]
      };
    return c;
  }
  async performPostSubmission(t, n, o, s, a, c) {
    const i = this.preparePostPayload(t), d = this.prepareImageBlurhashMap(t, n, o);
    s?.();
    try {
      const p = await this.submitPost(i.content, d, i.emojiTags);
      p.success ? a?.(p) : c?.(p.error || "post_error");
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
    const n = this.deps.hashtagPinStore.value, o = n ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), n && o.length > 0) {
      const s = " " + o.map((a) => "#" + a).join(" ");
      t.commands.insertContent(s), t.commands.focus("start");
    }
  }
}
async function ho({
  editor: e,
  imageServerBlurhashMap: t,
  imageOxMap: n,
  imageXMap: o,
  dependencies: s
}) {
  const a = s.extractImageBlurhashMap(e), c = /* @__PURE__ */ new Set([
    ...Object.keys(a),
    ...Object.keys(t)
  ]);
  return await Promise.all(
    Array.from(c).map(async (d) => {
      if (!o[d]) {
        const p = await s.calculateImageHash(d);
        p && (o[d] = p);
      }
    })
  ), await Promise.all(
    Array.from(c).map(async (d) => {
      const p = t[d] ?? a[d], f = s.getMimeTypeFromUrl(d), P = n[d], g = o[d];
      return (await s.createImetaTag({ url: d, m: f, blurhash: p, ox: P, x: g })).join(" ");
    })
  );
}
function fo(e, t) {
  if (e.galleryCleanup) {
    go(
      t,
      e.galleryCleanup.imageSizeMapStore
    );
    return;
  }
  e.currentEditor && Kn(e.currentEditor, e.devMode);
}
function Wt(e, { placeholderMap: t, cleanupPlaceholders: n }) {
  return e.updateUploadState(!1), n && fo(e, t), e.notifyAbortProgress?.(e.fileArray.length), {
    placeholderMap: n ? [] : t,
    results: null,
    imageOxMap: {},
    imageXMap: {},
    failedResults: [],
    errorMessage: "Upload aborted by user"
  };
}
function mo(e, t) {
  return e ? { imageSizeMapStore: t } : void 0;
}
function vo({
  isUploadAborted: e = ze,
  ...t
}) {
  return ({
    placeholderMap: n,
    cleanupPlaceholders: o
  }) => e() ? Wt(t, {
    placeholderMap: n,
    cleanupPlaceholders: o
  }) : null;
}
function qe(e, t = {}) {
  return {
    total: e,
    completed: 0,
    failed: 0,
    aborted: 0,
    inProgress: !1,
    ...t
  };
}
function Xe(e, t) {
  e?.onProgress?.(t);
}
function yo(e) {
  return {
    onProgress: (t) => {
      Vn(t), e?.onProgress?.(t);
    },
    onVideoCompressionProgress: (t) => {
      Qn.set(t), e?.onVideoCompressionProgress?.(t);
    },
    onImageCompressionProgress: (t) => {
      Gn.set(t), e?.onImageCompressionProgress?.(t);
    }
  };
}
function wo(e) {
  const t = e.isUploadAborted ?? ze;
  if (e.FileUploadManager === $e) {
    const n = new tr(
      typeof document > "u" ? void 0 : document
    ), o = new er(
      n,
      e.localStorage,
      t
    ), s = new nr(
      e.localStorage,
      t
    );
    return cr(o), dr(s), new $e(
      {
        localStorage: e.localStorage,
        fetch: window.fetch.bind(window),
        crypto: e.crypto,
        document: typeof document > "u" ? void 0 : document,
        window: typeof window > "u" ? void 0 : window,
        navigator: typeof navigator > "u" ? void 0 : navigator,
        isUploadAborted: t
      },
      new rr(),
      o,
      s,
      n
    );
  }
  return new e.FileUploadManager();
}
function So() {
  return Ae.value.isAuthenticated ? {
    pubkeyHex: Ae.value.pubkey || null,
    npub: Ae.value.npub || null
  } : {
    pubkeyHex: null,
    npub: null
  };
}
async function bo() {
  const e = So();
  return ir(
    await lr.getDefault(e.pubkeyHex),
    e
  );
}
function Po(e) {
  if (e)
    return e.protocol === "nip96" && e.resolvedUploadUrl || e.serverUrl;
}
async function Eo(e, t, n, o, s, a, c) {
  try {
    if (t.length === 1)
      return [c ? await e.uploadFileWithCallbacks(
        t[0],
        n,
        o,
        a,
        s?.[0],
        c
      ) : await e.uploadFileWithCallbacks(
        t[0],
        n,
        o,
        a,
        s?.[0]
      )];
    if (t.length > 1)
      return c ? await e.uploadMultipleFilesWithCallbacks(
        t,
        n,
        o,
        s,
        c
      ) : await e.uploadMultipleFilesWithCallbacks(
        t,
        n,
        o,
        s
      );
  } catch (i) {
    throw a && console.error("[preview] [uploadHelper] Upload error", {
      stage: "upload",
      reason: "unexpected"
    }), i;
  }
  return null;
}
async function xo(e) {
  const {
    results: t,
    placeholderMap: n,
    galleryMode: o,
    currentEditor: s,
    imageOxMap: a,
    imageXMap: c,
    imageSizeMapStore: i,
    calculateImageHash: d,
    getMimeTypeFromUrl: p,
    devMode: f
  } = e;
  if (!t || n.length === 0)
    return {
      failedResults: [],
      errorMessage: "",
      imageServerBlurhashMap: {}
    };
  if (o) {
    const g = await uo(
      t,
      n,
      a,
      c,
      i,
      d,
      p,
      f
    );
    return {
      failedResults: g.failedResults,
      errorMessage: g.errorMessage,
      imageServerBlurhashMap: {}
    };
  }
  const P = await lo(
    t,
    n,
    s,
    a,
    c,
    i,
    d,
    f
  );
  return {
    failedResults: P.failedResults,
    errorMessage: P.errorMessage,
    imageServerBlurhashMap: P.imageServerBlurhashMap
  };
}
const Nt = () => ({
  localStorage: Qr(),
  crypto: window.crypto.subtle,
  tick: Gr,
  FileUploadManager: $e,
  getImageDimensions: sr,
  isUploadAborted: ze,
  extractImageBlurhashMap: It,
  calculateImageHash: ar,
  getMimeTypeFromUrl: Mt,
  createImetaTag: async (e) => await Et(e),
  imageSizeMapStore: or,
  resolveUploadDestination: bo
});
async function Io({
  files: e,
  currentEditor: t,
  fileInput: n,
  uploadCallbacks: o,
  showUploadError: s,
  updateUploadState: a,
  devMode: c,
  dependencies: i = Nt()
}) {
  const d = Array.from(e), p = yo(o), f = await i.resolveUploadDestination?.(), P = Po(f) || "", g = {}, v = {}, u = "[preview]";
  Xe(
    p,
    qe(d.length, { inProgress: !0 })
  ), Yn();
  let x;
  try {
    x = await Zn(d, i);
  } catch (M) {
    if (M instanceof Error && M.message === "Upload aborted by user")
      return Wt(
        {
          fileArray: d,
          currentEditor: t,
          updateUploadState: a,
          devMode: c,
          notifyAbortProgress: (L) => {
            Xe(
              p,
              qe(L, {
                aborted: L
              })
            );
          }
        },
        {
          placeholderMap: [],
          cleanupPlaceholders: !1
        }
      );
    throw M;
  }
  const U = !He.value, A = mo(
    U,
    i.imageSizeMapStore
  ), H = vo({
    fileArray: d,
    currentEditor: t,
    updateUploadState: a,
    devMode: c,
    galleryCleanup: A,
    isUploadAborted: i.isUploadAborted,
    notifyAbortProgress: (M) => {
      Xe(
        p,
        qe(M, {
          aborted: M
        })
      );
    }
  }), z = H({
    placeholderMap: [],
    cleanupPlaceholders: !1
  });
  if (z)
    return z;
  let _ = U ? co(
    d,
    x,
    s,
    i.imageSizeMapStore,
    i.FileUploadManager,
    c
  ) : io(
    d,
    x,
    t,
    s,
    i.imageSizeMapStore,
    i.FileUploadManager,
    c
  );
  if (_.length === 0)
    return {
      placeholderMap: [],
      results: null,
      imageOxMap: g,
      imageXMap: v,
      failedResults: [],
      errorMessage: ""
    };
  const I = H({
    placeholderMap: _,
    cleanupPlaceholders: !0
  });
  if (I)
    return I;
  a(!0, ""), await so(
    _,
    i.FileUploadManager,
    c,
    i.isUploadAborted
  );
  const X = H({
    placeholderMap: _,
    cleanupPlaceholders: !0
  });
  if (X)
    return X;
  const O = _.map((M) => M.file);
  let $ = null;
  const K = wo(i);
  try {
    const M = Jn(O);
    $ = await Eo(
      K,
      O,
      P,
      p,
      M,
      c,
      f
    );
  } catch (M) {
    const L = M instanceof Error ? M.message : String(M);
    s(L, 5e3), $ = null;
  } finally {
    a(!1);
  }
  const oe = H({
    placeholderMap: _,
    cleanupPlaceholders: !0
  });
  if (oe)
    return n && (n.value = ""), oe;
  await i.tick();
  const ne = await xo({
    results: $,
    placeholderMap: _,
    galleryMode: U,
    currentEditor: t,
    imageOxMap: g,
    imageXMap: v,
    imageSizeMapStore: i.imageSizeMapStore,
    calculateImageHash: i.calculateImageHash,
    getMimeTypeFromUrl: i.getMimeTypeFromUrl,
    devMode: c
  }), T = [...ne.failedResults], R = ne.errorMessage;
  let S = ne.imageServerBlurhashMap;
  if ($ && _.length > 0 && (_ = []), c && t)
    try {
      await ho({
        editor: t,
        imageServerBlurhashMap: S,
        imageOxMap: g,
        imageXMap: v,
        dependencies: i
      });
    } catch {
      console.warn(`${u} [dev] imetaタグ生成失敗`, {
        stage: "imeta-tag",
        reason: "unexpected"
      });
    }
  return n && (n.value = ""), {
    placeholderMap: _,
    results: $,
    imageOxMap: g,
    imageXMap: v,
    failedResults: T,
    errorMessage: R
  };
}
function yt(e, t = 3e3, n) {
  n.updateUploadState(!1, e), setTimeout(() => n.updateUploadState(!1, ""), t);
}
async function Fo(e) {
  const {
    files: t,
    currentEditor: n,
    fileInput: o,
    uploadCallbacks: s,
    updateUploadState: a,
    devMode: c,
    imageOxMap: i,
    imageXMap: d,
    dependencies: p = Nt(),
    getUploadFailedText: f
  } = e;
  if (!t || t.length === 0) return null;
  const P = await Io({
    files: t,
    currentEditor: n,
    fileInput: o,
    uploadCallbacks: s,
    showUploadError: (g, v) => yt(g, v, { updateUploadState: a }),
    updateUploadState: a,
    devMode: c,
    dependencies: p
  });
  return Object.assign(i, P.imageOxMap), Object.assign(d, P.imageXMap), P.failedResults?.length && yt(
    Dt(
      P.failedResults,
      f("postComponent.upload_failed"),
      (g) => f(`postComponent.${g}`)
    ) || P.errorMessage,
    5e3,
    { updateUploadState: a }
  ), o && (o.value = ""), P;
}
async function Mo(e) {
  const {
    files: t,
    currentEditor: n,
    fileInput: o,
    updateUploadState: s,
    imageOxMap: a,
    imageXMap: c,
    getUploadFailedText: i,
    dependencies: d
  } = e;
  return await Fo({
    files: t,
    currentEditor: n,
    fileInput: o,
    updateUploadState: s,
    devMode: !1,
    imageOxMap: a,
    imageXMap: c,
    dependencies: d,
    getUploadFailedText: i
  });
}
function Co(e) {
  return !!e && e.length > 0;
}
function ko(e, t, n) {
  e.isUploading = t, e.uploadErrorMessage = n || "";
}
function _o(e) {
  const t = e.target;
  return t?.files?.length ? t.files : void 0;
}
function To({
  getCurrentEditor: e,
  getFileInput: t,
  getImageOxMap: n,
  getImageXMap: o,
  getUploadFailedText: s,
  updateUploadState: a,
  uploadFiles: c = Mo
}) {
  const i = async (p) => Co(p) ? await c({
    files: p,
    currentEditor: e(),
    fileInput: t(),
    updateUploadState: a,
    imageOxMap: n(),
    imageXMap: o(),
    getUploadFailedText: s
  }) ?? null : null;
  return {
    performUpload: i,
    handleFileSelect: (p) => {
      const f = _o(p);
      f && i(f);
    }
  };
}
let B = Le({
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
}), Ce;
function wt() {
  Ce !== void 0 && (clearTimeout(Ce), Ce = void 0);
}
const ae = {
  get value() {
    return B;
  },
  // 秘密鍵ダイアログ
  showSecretKeyDialog: (e, t = []) => {
    B.pendingPost = e, B.pendingEmojiTags = t.map((n) => [...n]), B.showSecretKeyDialog = !0;
  },
  hideSecretKeyDialog: () => {
    B.showSecretKeyDialog = !1, B.pendingPost = "", B.pendingEmojiTags = [];
  },
  getPendingPost: () => B.pendingPost,
  getPendingEmojiTags: () => B.pendingEmojiTags.map((e) => [...e]),
  // 画像フルスクリーン
  showImageFullscreen: (e, t = "", n = "") => {
    B.fullscreenMediaId = n, B.fullscreenImageSrc = e, B.fullscreenImageAlt = t, B.showImageFullscreen = !0;
  },
  hideImageFullscreen: () => {
    B.showImageFullscreen = !1, B.fullscreenMediaId = "", B.fullscreenImageSrc = "", B.fullscreenImageAlt = "";
  },
  // フローティングメッセージ
  showFloatingMessage: (e, t, n, o = 1800) => {
    wt(), B.floatingMessageX = e, B.floatingMessageY = t, B.floatingMessageText = n, B.showFloatingMessage = !0, Ce = setTimeout(
      () => {
        B.showFloatingMessage = !1, Ce = void 0;
      },
      o
    );
  },
  hideFloatingMessage: () => {
    wt(), B.showFloatingMessage = !1;
  }
};
var Do = me('<img draggable="false"/>'), Ao = me('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), Ro = me('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const Lo = {
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
function Bt(e, t) {
  Je(t, !0), Ge(e, Lo);
  const n = () => Ve(Ye, "$_", o), [o, s] = Qe();
  let a = V(t, "item", 7), c = V(t, "index", 7), i = V(t, "onDelete", 7), d = V(t, "onDragStart", 7), p = V(t, "onDragOver", 7), f = V(t, "onDragEnd", 7), P = V(t, "onDrop", 7), g = V(t, "onTouchDragStart", 7), v = V(t, "disabled", 7, !1), u = Y(void 0), x = Y(void 0);
  const U = hr();
  ur(() => r(u), {
    onLongPress: (h, N) => {
      v() || g()?.(c(), h, N);
    }
  });
  let A = C(() => !a().isPlaceholder && a().type === "image" && !!a().src), H = C(() => !a().isPlaceholder && a().type === "video" && !!a().src);
  const z = 180, _ = 100, I = 180;
  let X = C(() => {
    if (!a().isPlaceholder) return;
    const h = a().dimensions;
    if (h && h.width > 0 && h.height > 0) {
      const N = h.width / h.height, Q = Math.round(z * N);
      return `width: ${Math.max(_, Math.min(I, Q))}px; height: ${z}px;`;
    }
    return `width: ${I}px; height: ${z}px;`;
  });
  function O() {
    a().isPlaceholder || a().type !== "image" || ae.showImageFullscreen(a().src, a().alt || "", a().id);
  }
  function $(h) {
    if (v()) {
      h.preventDefault();
      return;
    }
    if (r(u) && h.dataTransfer) {
      const N = r(u).getBoundingClientRect(), Q = h.clientX - N.left, J = h.clientY - N.top;
      h.dataTransfer.setDragImage(r(u), Q, J);
    }
    d()(c(), h);
  }
  function K(h) {
    h.stopPropagation(), r(x) && (r(x).paused ? r(x).play() : r(x).pause());
  }
  function oe(h) {
    h.preventDefault(), !v() && p()(c(), h);
  }
  function ne(h) {
    h.preventDefault(), !v() && P()(c());
  }
  function T(h) {
    a().type !== "image" || a().isPlaceholder || (h.key === "Enter" || h.key === " " || h.key === "Spacebar") && (h.preventDefault(), O());
  }
  var R = {
    get item() {
      return a();
    },
    set item(h) {
      a(h), Z();
    },
    get index() {
      return c();
    },
    set index(h) {
      c(h), Z();
    },
    get onDelete() {
      return i();
    },
    set onDelete(h) {
      i(h), Z();
    },
    get onDragStart() {
      return d();
    },
    set onDragStart(h) {
      d(h), Z();
    },
    get onDragOver() {
      return p();
    },
    set onDragOver(h) {
      p(h), Z();
    },
    get onDragEnd() {
      return f();
    },
    set onDragEnd(h) {
      f(h), Z();
    },
    get onDrop() {
      return P();
    },
    set onDrop(h) {
      P(h), Z();
    },
    get onTouchDragStart() {
      return g();
    },
    set onTouchDragStart(h) {
      g(h), Z();
    },
    get disabled() {
      return v();
    },
    set disabled(h = !1) {
      v(h), Z();
    }
  }, S = Ro();
  let M;
  var L = fe(S), Se = fe(L);
  {
    var w = (h) => {
      {
        let N = C(() => a().type === "video" ? n()("videoNode.uploading") : n()("imageNode.uploading"));
        gr(h, {
          get text() {
            return r(N);
          },
          showLoader: !0
        });
      }
    };
    le(Se, (h) => {
      a().isPlaceholder && h(w);
    });
  }
  var m = ie(Se, 2);
  {
    var q = (h) => {
      var N = Do();
      let Q;
      ye(() => {
        se(N, "src", a().src), se(N, "alt", a().alt || ""), Q = ke(N, 1, "gallery-image svelte-aw59wn", null, Q, { "image-loading": !U.isLoaded });
      }), he("load", N, function(...J) {
        U.handleLoad?.apply(this, J);
      }), he("error", N, function(...J) {
        U.handleError?.apply(this, J);
      }), ve("contextmenu", N, (J) => J.preventDefault()), Vr(N), de(h, N);
    };
    le(m, (h) => {
      r(A) && h(q);
    });
  }
  var W = ie(m, 2);
  {
    var k = (h) => {
      var N = Ao(), Q = fe(N);
      Q.muted = !0, Ee(Q, (xe) => E(x, xe), () => r(x));
      var J = ie(Q, 2);
      ce(N), ye(() => {
        se(Q, "src", a().src), se(J, "draggable", !v());
      }), ve("contextmenu", Q, (xe) => xe.preventDefault()), he("dragstart", J, $), ve("click", J, K), de(h, N);
    };
    le(W, (h) => {
      r(H) && h(k);
    });
  }
  ce(L);
  var G = ie(L, 2);
  {
    var j = (h) => {
      {
        let N = C(() => n()("imageContextMenu.delete")), Q = C(() => n()("imageContextMenu.copyUrl")), J = C(() => n()("imageContextMenu.copySuccess"));
        pr(h, {
          get src() {
            return a().src;
          },
          onDelete: () => i()(a().id),
          get deleteAriaLabel() {
            return r(N);
          },
          get copyAriaLabel() {
            return r(Q);
          },
          get copySuccessMessage() {
            return r(J);
          },
          layout: "gallery",
          get deleteDisabled() {
            return v();
          }
        });
      }
    };
    le(G, (h) => {
      a().isPlaceholder || h(j);
    });
  }
  ce(S), Ee(S, (h) => E(u, h), () => r(u)), ye(() => {
    M = ke(S, 1, "gallery-item svelte-aw59wn", null, M, {
      "is-placeholder": a().isPlaceholder,
      "is-disabled": v()
    }), se(S, "draggable", !v() && (a().type !== "video" || a().isPlaceholder)), Ct(L, r(X)), se(L, "role", a().type === "image" && !a().isPlaceholder ? "button" : void 0), se(L, "tabindex", a().type === "image" && !a().isPlaceholder ? 0 : void 0), se(L, "aria-label", a().alt || a().src);
  }), he("dragstart", S, $), he("dragover", S, oe), he("drop", S, ne), he("dragend", S, () => f()()), ve("click", L, function(...h) {
    (a().type === "image" && !a().isPlaceholder ? O : void 0)?.apply(this, h);
  }), ve("keydown", L, T), de(e, S);
  var ue = et(R);
  return s(), ue;
}
_t(["click", "keydown", "contextmenu"]);
Ze(
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
function Ho(e) {
  return Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
}
function Uo(e, t) {
  const n = e.scrollHeight - e.clientHeight;
  if (n <= 1)
    return !1;
  const o = e.scrollTop <= 0, s = e.scrollTop >= n - 1;
  return t > 0 ? !s : t < 0 ? !o : !1;
}
function zo(e, t) {
  const n = e.scrollWidth - e.clientWidth;
  if (n <= 1)
    return !1;
  const o = e.scrollLeft <= 0, s = e.scrollLeft >= n - 1;
  return t > 0 ? !s : t < 0 ? !o : !1;
}
function Oo(e, t, n = null) {
  if (n && Uo(n, t.deltaY))
    return !1;
  const o = Ho(t);
  if (!zo(e, o))
    return !1;
  const s = Math.max(
    0,
    e.scrollWidth - e.clientWidth
  );
  return e.scrollLeft = Math.min(
    s,
    Math.max(0, e.scrollLeft + o)
  ), !0;
}
var Wo = me("<div><!></div>"), No = me('<div role="list"></div>');
const Bo = {
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
function jt(e, t) {
  Je(t, !0), Ge(e, Bo);
  const n = () => Ve(Ye, "$_", o), [o, s] = Qe();
  let a = Y(-1), c = Y(-1), i = Y(-1), d = Y(-1), p = null, f = 60, P = 60, g = Y(void 0), v = null, u = C(() => te.items), x = C(() => pe.postStatus.sending), U = C(() => {
    const w = r(a) !== -1 ? r(a) : r(i), m = r(a) !== -1 ? r(c) : r(d);
    return w === -1 || m === -1 || m === w || m === w + 1 ? -1 : m;
  });
  function A(w, m) {
    if (r(x)) {
      m.preventDefault();
      return;
    }
    E(a, w, !0), m.dataTransfer?.setData("text/plain", String(w)), m.dataTransfer && (m.dataTransfer.effectAllowed = "move");
  }
  function H(w, m) {
    if (m.preventDefault(), r(x)) return;
    const W = r(g)?.querySelectorAll(".gallery-item-wrapper")?.[w];
    if (W) {
      const k = W.getBoundingClientRect();
      E(c, m.clientX < k.left + k.width / 2 ? w : w + 1, !0);
    } else
      E(c, w, !0);
  }
  function z() {
    K(), E(a, -1), E(c, -1);
  }
  function _(w) {
  }
  function I(w) {
    if (r(a) === -1) return;
    if (w.preventDefault(), r(x)) {
      K(), E(c, -1);
      return;
    }
    const m = r(g)?.querySelectorAll(".gallery-item-wrapper");
    if (m && m.length > 0) {
      const q = m[0].getBoundingClientRect(), W = m[m.length - 1].getBoundingClientRect();
      w.clientX < q.left ? E(c, 0) : w.clientX > W.right && E(c, r(u).length, !0);
    }
    if (r(g)) {
      const q = r(g).getBoundingClientRect();
      w.clientX - q.left < Fe ? $("left", w.clientX) : q.right - w.clientX < Fe ? $("right", w.clientX) : K();
    }
  }
  function X(w) {
    if (w.preventDefault(), K(), r(x)) {
      E(a, -1), E(c, -1);
      return;
    }
    const m = r(c);
    if (r(a) !== -1 && m !== -1 && m !== r(a) && m !== r(a) + 1) {
      const q = r(a) < m ? m - 1 : m;
      te.reorderItems(r(a), q);
    }
    E(a, -1), E(c, -1);
  }
  function O(w) {
    r(x) || te.removeItem(w);
  }
  function $(w, m) {
    if (!r(g)) return;
    v !== null && (cancelAnimationFrame(v), v = null);
    const q = r(g).getBoundingClientRect(), W = w === "left" ? m - q.left : q.right - m, k = Math.max(0, Math.min(1, W / Fe)), G = ht + (mr - ht) * (1 - k), j = () => {
      if (!r(g)) return;
      const ue = r(g).scrollWidth - r(g).clientWidth;
      w === "left" && r(g).scrollLeft > 0 ? (r(g).scrollLeft = Math.max(0, r(g).scrollLeft - G), v = requestAnimationFrame(j)) : w === "right" && r(g).scrollLeft < ue ? (r(g).scrollLeft = Math.min(ue, r(g).scrollLeft + G), v = requestAnimationFrame(j)) : v = null;
    };
    v = requestAnimationFrame(j);
  }
  function K() {
    v !== null && (cancelAnimationFrame(v), v = null);
  }
  function oe(w, m, q) {
    if (r(x)) return;
    E(i, w, !0), R();
    const W = r(g)?.querySelectorAll(".gallery-item-wrapper")[w];
    if (W) {
      const k = W.getBoundingClientRect(), G = 120, j = Math.min(G / k.width, G / k.height);
      f = k.width * j / 2, P = k.height * j / 2, p = W.cloneNode(!0), p.style.cssText = `
                position: fixed;
                left: ${m - f}px;
                top: ${q - P}px;
                width: ${k.width}px;
                height: ${k.height}px;
                transform-origin: top left;
                transform: scale(${j});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, Zr().overlayTarget.appendChild(p);
    }
    document.addEventListener("touchmove", ne, { passive: !1 }), document.addEventListener("touchend", T, { passive: !1 });
  }
  function ne(w) {
    if (r(i) === -1 || w.touches.length !== 1) return;
    if (w.preventDefault(), r(x)) {
      K(), E(d, -1);
      return;
    }
    const m = w.touches[0];
    p && (p.style.left = `${m.clientX - f}px`, p.style.top = `${m.clientY - P}px`), p && (p.style.display = "none");
    const q = document.elementFromPoint(m.clientX, m.clientY);
    p && (p.style.display = "");
    const W = q?.closest(".gallery-item-wrapper");
    if (W && r(g)) {
      const k = r(g).querySelectorAll(".gallery-item-wrapper"), G = Array.from(k).indexOf(W);
      if (G !== -1) {
        const j = W.getBoundingClientRect();
        E(d, m.clientX < j.left + j.width / 2 ? G : G + 1, !0);
      }
    } else if (r(g)) {
      const k = r(g).querySelectorAll(".gallery-item-wrapper");
      if (k.length > 0) {
        const G = k[0].getBoundingClientRect(), j = k[k.length - 1].getBoundingClientRect();
        m.clientX <= G.left ? E(d, 0) : m.clientX >= j.right && E(d, r(u).length, !0);
      }
    }
    if (r(g)) {
      const k = r(g).getBoundingClientRect();
      m.clientX - k.left < Fe ? $("left", m.clientX) : k.right - m.clientX < Fe ? $("right", m.clientX) : K();
    }
  }
  function T() {
    if (document.removeEventListener("touchmove", ne), document.removeEventListener("touchend", T), K(), r(x)) {
      R(), E(i, -1), E(d, -1);
      return;
    }
    const w = r(d);
    if (r(i) !== -1 && w !== -1 && w !== r(i) && w !== r(i) + 1) {
      const m = r(i) < w ? w - 1 : w;
      te.reorderItems(r(i), m);
    }
    R(), E(i, -1), E(d, -1);
  }
  function R() {
    p && (p.remove(), p = null);
  }
  function S(w) {
    if (!r(g)) return;
    const m = r(g).closest(".composer-scroll-region");
    Oo(r(g), w, m instanceof HTMLElement ? m : null) && w.preventDefault();
  }
  ge(() => {
    if (r(g))
      return r(g).addEventListener("wheel", S, { passive: !1 }), () => {
        r(g)?.removeEventListener("wheel", S);
      };
  });
  var M = Yr(), L = Tt(M);
  {
    var Se = (w) => {
      var m = No();
      let q;
      fr(m, 23, () => r(u), (W) => W.id, (W, k, G) => {
        var j = Wo();
        let ue;
        var h = fe(j);
        Bt(h, {
          get item() {
            return r(k);
          },
          get index() {
            return r(G);
          },
          onDelete: O,
          onDragStart: A,
          onDragOver: H,
          onDragEnd: z,
          onDrop: _,
          onTouchDragStart: oe,
          get disabled() {
            return r(x);
          }
        }), ce(j), ye(() => ue = ke(j, 1, "gallery-item-wrapper svelte-w2vv8k", null, ue, {
          "insert-bar-left": r(U) === r(G),
          "insert-bar-right": r(U) === r(u).length && r(G) === r(u).length - 1
        })), de(W, j);
      }), ce(m), Ee(m, (W) => E(g, W), () => r(g)), ye(
        (W) => {
          q = ke(m, 1, "media-gallery svelte-w2vv8k", null, q, { sending: r(x) }), se(m, "aria-label", W);
        },
        [() => n()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), he("dragover", m, I), he("drop", m, X), de(w, m);
    };
    le(L, (w) => {
      r(u).length > 0 && w(Se);
    });
  }
  de(e, M), et(), s();
}
Ze(jt, {}, [], [], { mode: "open" });
function Ke(e) {
  if (!e || !e.types) return !1;
  try {
    return Array.from(e.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function qt(e) {
  if (!e) return !1;
  try {
    return Array.from(e.types).includes("Files") || e.files && e.files.length > 0;
  } catch {
    return !!(e.files && e.files.length > 0);
  }
}
function _e(e) {
  const t = e.__postStatus;
  return (typeof t == "function" ? t() : t)?.sending === !0;
}
function jo(e) {
  let t = Y(!1);
  function n(a) {
    if (_e(e)) {
      a.preventDefault(), E(t, !1), e.classList.remove("drag-over");
      return;
    }
    const c = a.dataTransfer, i = Ke(c);
    qt(c) && !i ? (a.preventDefault(), r(t) || (E(t, !0), e.classList.add("drag-over"))) : r(t) && (E(t, !1), e.classList.remove("drag-over"));
  }
  function o(a) {
    r(t) && (E(t, !1), e.classList.remove("drag-over"));
  }
  async function s(a) {
    if (E(t, !1), e.classList.remove("drag-over"), _e(e)) {
      a.preventDefault();
      return;
    }
    const c = a.dataTransfer;
    Ke(c) || c?.files && c.files.length > 0 && typeof e.__uploadFiles == "function" && (a.preventDefault(), e.__uploadFiles(c.files));
  }
  return e.addEventListener("dragover", n), e.addEventListener("dragleave", o), e.addEventListener("drop", s), {
    destroy() {
      e.removeEventListener("dragover", n), e.removeEventListener("dragleave", o), e.removeEventListener("drop", s);
    }
  };
}
function qo(e, t) {
  const n = jo(e);
  function o(c) {
    if (_e(e)) {
      c.preventDefault(), t.dragOver(!1);
      return;
    }
    const i = c.dataTransfer, d = Ke(i);
    qt(i) && !d ? t.dragOver(!0) : t.dragOver(!1);
  }
  function s(c) {
    t.dragOver(!1);
  }
  function a(c) {
    t.dragOver(!1), _e(e) && c.preventDefault();
  }
  return e.addEventListener("dragover", o), e.addEventListener("dragleave", s), e.addEventListener("drop", a), {
    destroy() {
      n?.destroy?.(), e.removeEventListener("dragover", o), e.removeEventListener("dragleave", s), e.removeEventListener("drop", a);
    }
  };
}
function Xo(e) {
  function t(n) {
    if (_e(e)) {
      n.preventDefault();
      return;
    }
    if (!n.clipboardData) return;
    const o = [];
    for (const s of n.clipboardData.items)
      if (s.kind === "file" && s.type.startsWith("image/")) {
        const a = s.getAsFile();
        a && o.push(a);
      }
    o.length > 0 && (n.preventDefault(), e.__uploadFiles?.(o));
  }
  return e.addEventListener("paste", t), {
    destroy() {
      e.removeEventListener("paste", t);
    }
  };
}
function $o(e) {
  function t(o) {
    const s = o.target;
    if (s && (s.closest('.editor-image-button[data-dragging="true"]') || s.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const a = o.touches[0], c = 120, i = ft.querySelector(".tiptap-editor");
      if (i) {
        const d = i.getBoundingClientRect(), p = a.clientY < d.top + c, f = a.clientY > d.bottom - c;
        if (!p && !f)
          return o.preventDefault(), !1;
      }
    }
  }
  function n(o) {
    const s = ft.querySelectorAll(".drop-zone-indicator");
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
  return e.addEventListener("touchmove", t), e.addEventListener("touchend", n), {
    destroy() {
      e.removeEventListener("touchmove", t), e.removeEventListener("touchend", n);
    }
  };
}
function Ko(e) {
  function t(n) {
    if ((n.ctrlKey || n.metaKey) && (n.key === "Enter" || n.key === "NumpadEnter")) {
      n.preventDefault();
      const o = e.__currentEditor, s = typeof o == "function" ? o() : o, a = e.__hasStoredKey, c = typeof a == "function" ? a() : a, i = e.__postStatus, d = typeof i == "function" ? i() : i, p = s ? vr(s) : "";
      !d?.sending && p.trim() && c && e.__submitPost?.();
    }
  }
  return e.addEventListener("keydown", t), {
    destroy() {
      e.removeEventListener("keydown", t);
    }
  };
}
function Go(e) {
  let t = !1;
  return e?.descendants((n) => {
    if (t) return !1;
    const o = n.type?.name;
    (o === "image" || o === "video") && (t = !0);
  }), t;
}
function Qo(e) {
  const { currentEditor: t, editorContainerEl: n, callbacks: o } = e, s = (i) => {
    const p = i.detail.plainText, f = t ? Go(t.state?.doc) : !1;
    o.onContentUpdate?.(p, f);
  }, a = (i) => {
    const d = i;
    o.onImageFullscreenRequest?.(d.detail.src, d.detail.alt || "", d.detail.mediaId);
  }, c = (i) => {
    const p = i?.detail?.pos;
    if (p != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const f = bt.create(t.state.doc, p);
        t.view.dispatch(t.state.tr.setSelection(f).scrollIntoView());
      } catch (f) {
        console.warn("select-image-node handler failed:", f);
      }
      o.onSelectImageNode?.(p);
    }
  };
  return window.addEventListener("editor-content-changed", s), window.addEventListener("image-fullscreen-request", a), window.addEventListener("select-image-node", c), n && (n.addEventListener("image-fullscreen-request", a), n.addEventListener("select-image-node", c)), {
    handleContentUpdate: s,
    handleImageFullscreenRequest: a,
    handleSelectImageNode: c
  };
}
function Vo(e, t) {
  window.removeEventListener("editor-content-changed", e.handleContentUpdate), window.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), window.removeEventListener("select-image-node", e.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), t.removeEventListener("select-image-node", e.handleSelectImageNode));
}
function Yo() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function Zo(e) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (e?.rejectedRelays?.length ?? 0) > 0 || (e?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function Jo(e) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: e || "postComponent.post_error",
    completed: !1
  };
}
function ea({
  updatePostStatus: e,
  clearContentAfterSuccess: t,
  onPostSuccess: n
}) {
  return {
    markSending: () => {
      e(Yo());
    },
    markSuccess: (o) => {
      e(Zo(o)), t(), n?.(o);
    },
    markFailure: (o) => {
      e(Jo(o));
    }
  };
}
async function ta(e) {
  const t = e.postManager.prepareImageBlurhashMap(
    e.currentEditor,
    e.imageOxMap,
    e.imageXMap
  );
  e.onStart();
  try {
    const n = e.pendingEmojiTags?.length ? await e.postManager.submitPost(
      e.pendingPost,
      t,
      e.pendingEmojiTags
    ) : await e.postManager.submitPost(
      e.pendingPost,
      t
    );
    if (n.success) {
      e.onSuccess(n);
      return;
    }
    e.onFailure(n.error);
  } catch {
    e.onFailure();
  }
}
function St(e) {
  if (e.dimensions && e.dimensions.width > 0 && e.dimensions.height > 0)
    return {
      width: e.dimensions.width,
      height: e.dimensions.height
    };
  const t = Pt(e.dim);
  return t || {};
}
function na(e) {
  if (!e.mediaFreePlacement)
    return e.galleryItems.filter((n) => !n.isPlaceholder).map((n) => {
      const o = St({
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
  if (!e.currentEditor)
    return [];
  const t = [];
  return e.currentEditor.state.doc.descendants((n) => {
    if ((n.type.name === "image" || n.type.name === "video") && !n.attrs.isPlaceholder) {
      const o = St({
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
function ra(e, t, n) {
  if (t) {
    const o = e.findIndex((s) => s.id === t);
    if (o >= 0)
      return o;
  }
  return n ? e.findIndex((o) => o.src === n) : -1;
}
function oa(e, t) {
  return e[t];
}
function aa(e) {
  const t = [];
  return e.state.doc.descendants((n, o) => {
    (n.type.name === "image" || n.type.name === "video") && !n.attrs.isPlaceholder && t.push({ node: n, pos: o });
  }), t;
}
function sa(e) {
  const t = aa(e.currentEditor);
  if (t.length === 0)
    return !1;
  t.forEach(({ node: o }) => {
    const s = o.attrs.src;
    s && e.addGalleryItem({
      id: e.createMediaItemId(),
      type: o.type.name,
      src: s,
      isPlaceholder: !1,
      blurhash: o.attrs.blurhash ?? void 0,
      ox: e.imageOxMap[s] ?? void 0,
      x: e.imageXMap[s] ?? void 0,
      dim: o.attrs.dim ?? void 0,
      size: typeof o.attrs.size == "number" ? o.attrs.size : void 0,
      alt: o.attrs.alt ?? void 0,
      uploadProtocol: o.attrs.uploadProtocol ?? void 0
    });
  });
  let n = e.currentEditor.state.tr;
  return [...t].reverse().forEach(({ node: o, pos: s }) => {
    n = n.delete(s, s + o.nodeSize);
  }), e.currentEditor.view.dispatch(n), !0;
}
function ia(e) {
  if (e.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = e.currentEditor.state;
  let n = e.currentEditor.state.tr, o = e.currentEditor.state.doc.content.size;
  const s = {}, a = {};
  return e.items.forEach((c) => {
    if (c.isPlaceholder)
      return;
    const i = c.src;
    if (c.type === "image" && t.nodes.image) {
      const d = t.nodes.image.create({
        src: i,
        alt: c.alt ?? "Image",
        blurhash: c.blurhash ?? null,
        dim: c.dim ?? null,
        size: c.size ?? null,
        uploadProtocol: c.uploadProtocol ?? null
      });
      n = n.insert(o, d), o += d.nodeSize;
    } else if (c.type === "video" && t.nodes.video) {
      const d = t.nodes.video.create({ src: i });
      n = n.insert(o, d), o += d.nodeSize;
    }
    c.ox && (s[i] = c.ox), c.x && (a[i] = c.x);
  }), e.currentEditor.view.dispatch(n), {
    imageOxMap: s,
    imageXMap: a,
    hadItems: !0
  };
}
async function la(e) {
  const {
    input: t,
    postHistoryRepositoryImpl: n = kt,
    postMediaCacheRepositoryImpl: o = wr
  } = e;
  await n.putPostedEvent(t);
  const s = yr(t.event).map((a) => a.url).filter(Boolean);
  s.length !== 0 && await o.linkEventIdByUrls({
    eventId: t.event.id,
    urls: s
  });
}
function ca(e) {
  const {
    placeholderText: t,
    editorContainerEl: n,
    hasStoredKey: o,
    submitPost: s,
    onCustomEmojiSelect: a,
    uploadFiles: c,
    eventCallbacks: i
  } = e;
  Sr.value = t;
  const d = br({
    placeholderText: t,
    onSubmitPost: s,
    onCustomEmojiSelect: a,
    onCreate: (g) => {
      Ue.set(g);
    }
  });
  let p = null;
  const f = d.subscribe((g) => {
    p = g;
  }), P = Qo({
    currentEditor: p,
    editorContainerEl: n,
    callbacks: i
  });
  return Pr(s), n && Object.assign(n, {
    __uploadFiles: c,
    __currentEditor: () => p,
    __hasStoredKey: () => o,
    __postStatus: () => pe.postStatus,
    __submitPost: s
  }), { editor: d, unsubscribe: f, handlers: P };
}
function da(e) {
  const {
    unsubscribe: t,
    componentUnsubscribe: n,
    handlers: o,
    currentEditor: s,
    editorContainerEl: a,
    submitPost: c
  } = e;
  Vo(o, a), Ue.value === s && Ue.set(null), Er(c), n(), t(), s && !s.isDestroyed && s.destroy(), a && (delete a.__uploadFiles, delete a.__currentEditor, delete a.__hasStoredKey, delete a.__postStatus, delete a.__submitPost);
}
function ua(e, t) {
  const n = e.view.dom;
  if (xr() && document.activeElement !== n) {
    e.commands.insertCustomEmoji(t);
    return;
  }
  e.chain().focus().insertCustomEmoji(t).run();
}
var ga = me('<div class="editor-account-placeholder svelte-15ticnd" aria-hidden="true"><!></div>'), pa = me('<div class="upload-error svelte-15ticnd"> </div>'), ha = me('<div class="svelte-15ticnd"> </div>'), fa = me('<div class="post-container svelte-15ticnd" data-post-editor-root=""><div role="textbox" tabindex="-1"><!> <!></div> <!> <input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/> <!></div> <!> <!> <!>', 1);
const ma = {
  hash: "svelte-15ticnd",
  code: `.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {min-height:0;}.editor-content,
  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--bg-input);-webkit-tap-highlight-color:transparent;overflow:hidden;}.editor-account-placeholder {position:absolute;top:11px;left:10px;z-index:3;width:28px;height:28px;opacity:0.5;pointer-events:none;}.editor-account-placeholder-avatar {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.editor-account-placeholder-image,
  .editor-account-placeholder-fallback {display:block;width:100%;height:100%;border-radius:50%;}.editor-account-placeholder-image {object-fit:cover;}.editor-container.account-avatar-placeholder.svelte-15ticnd
    p.is-editor-empty:first-child::before {padding-left:36px;}.editor-container.sending.svelte-15ticnd {background:color-mix(in srgb, var(--bg-input) 82%, var(--surface-button) 18%);cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.sending.svelte-15ticnd .editor-image-button,
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
function va(e, t) {
  Je(t, !0), Ge(e, ma);
  const n = () => Ve(Ye, "$_", o), [o, s] = Qe();
  let a = V(t, "rxNostr", 7), c = V(t, "hasStoredKey", 7), i = V(t, "isSwitchingAccount", 7, !1), d = V(t, "onPostSuccess", 7), p = V(t, "availableComposerHeight", 7, Pe), f = V(t, "minEditorHeight", 7, Pe), P = V(t, "onCustomEmojiSelect", 7), g = V(t, "notificationPort", 7), v = Y(null), u = Y(null), x = Y(!1), U = Y(void 0), A = Y(void 0), H = Y(Le({})), z = Y(Le({})), _ = C(() => He.value), I = C(() => pe.postStatus), X = C(() => pe.uploadErrorMessage), O = C(() => Kr.value), $ = C(() => Or.value), K = C(() => Wr.value), oe = Y(!0), ne = C(() => c() && !i() && r($) && !r(K) && r(oe)), T = null, R = null, S = null, M = null, L = Y(Le(Pe)), Se = C(() => `--post-editor-min-height: ${f()}px; --post-editor-target-height: ${r(L)}px;`), w = C(() => n()("postComponent.enter_your_text") || "テキストを入力してください");
  ge(() => {
    r(u), Ir(r(w));
  }), ge(() => {
    const l = r(u), y = !r(I).sending;
    l && l.isEditable !== y && l.setEditable(y, !1);
  });
  function m() {
    const l = f();
    if (!T || !R) {
      E(L, l, !0);
      return;
    }
    const y = Array.from(T.children).reduce(
      (b, D) => D === R ? b : b + Br(D),
      0
    ), F = jr({
      availableComposerHeight: p(),
      nonEditorHeight: y,
      minHeight: l
    });
    r(L) !== F && E(L, F, !0);
  }
  function q(l) {
    if (r(I).sending) {
      l.preventDefault();
      return;
    }
    !(l.target instanceof HTMLElement) || !r(u) || zr(l.target) || r(u).commands.focus("end");
  }
  function W(l) {
    if (r(I).sending) {
      l.preventDefault();
      return;
    }
    !r(u) || l.currentTarget !== l.target || l.key !== "Enter" && l.key !== " " || (l.preventDefault(), r(u).commands.focus("end"));
  }
  let k = C(() => ae.value), G = C(() => r(k).showSecretKeyDialog), j = C(() => r(k).showImageFullscreen), ue = C(() => r(k).fullscreenMediaId), h = C(() => r(k).fullscreenImageSrc), N = C(() => r(k).fullscreenImageAlt), Q = C(() => r(k).showFloatingMessage), J = C(() => r(k).floatingMessageX), xe = C(() => r(k).floatingMessageY), Xt = C(() => r(k).floatingMessageText);
  ge(() => {
    a() && (r(A) ? r(A).setRxNostr(a()) : E(
      A,
      new po(a(), {
        getNip46SignerForSessionFn: (l) => Cr.getSignerForSession(l),
        getParentClientSignerFn: () => Mr.getSigner(),
        channelContextState: Fr,
        replyQuoteState: xt,
        replyQuoteService: new Re(),
        clearReplyQuoteFn: Ft,
        savePostHistoryFn: (l) => la({ input: l, postHistoryRepositoryImpl: kt }),
        notificationPort: g()
      }),
      !0
    ));
  });
  const Oe = To({
    getCurrentEditor: () => r(u),
    getFileInput: () => r(U),
    getImageOxMap: () => r(H),
    getImageXMap: () => r(z),
    getUploadFailedText: (l) => n()(l),
    updateUploadState: (l, y) => {
      ko(pe, l, y);
    }
  }), be = ea({
    updatePostStatus: mt,
    clearContentAfterSuccess: nt,
    onPostSuccess: (l) => d()?.(l)
  });
  ge(() => {
    if (p(), f(), r(_), r(X), r(u), r(_) || te.items.length, typeof window > "u") {
      E(L, Pe, !0);
      return;
    }
    const l = window.requestAnimationFrame(() => {
      m();
    });
    return () => {
      window.cancelAnimationFrame(l);
    };
  }), ge(() => {
    if (p(), f(), r(u), r(_), r(X), !T || typeof ResizeObserver > "u")
      return;
    let l = null;
    const y = () => {
      l === null && (l = window.requestAnimationFrame(() => {
        l = null, m();
      }));
    }, F = new ResizeObserver(y);
    y(), F.observe(T);
    for (const b of Array.from(T.children))
      b !== R && F.observe(b);
    return () => {
      F.disconnect(), l !== null && window.cancelAnimationFrame(l);
    };
  }), kr(() => {
    S = ca({
      placeholderText: r(w),
      editorContainerEl: R,
      currentEditor: r(u),
      hasStoredKey: c(),
      submitPost: Ne,
      onCustomEmojiSelect: P(),
      uploadFiles: (b) => {
        Oe.performUpload(b);
      },
      eventCallbacks: {
        onContentUpdate: Nr,
        onImageFullscreenRequest: (b, D, ee) => {
          ae.showImageFullscreen(b, D, ee || "");
        },
        onSelectImageNode: (b) => {
        }
      }
    }), E(v, S.editor, !0);
    let l = null;
    const y = ({ editor: b }) => {
      E(oe, b.isEmpty, !0);
    };
    M = r(v).subscribe((b) => {
      l && l.off("transaction", y), l = b, E(u, b, !0), E(oe, b?.isEmpty ?? !0, !0), b?.on("transaction", y), Ue.set(b);
    });
    const F = (b) => {
      const D = b, { src: ee, alt: we, mediaId: Pn } = D.detail;
      ae.showImageFullscreen(ee, we, Pn || "");
    };
    return window.addEventListener("image-fullscreen-request", F), () => {
      window.removeEventListener("image-fullscreen-request", F), S && (l && l.off("transaction", y), da({
        unsubscribe: S.unsubscribe,
        componentUnsubscribe: M ?? (() => {
        }),
        handlers: S.handlers,
        currentEditor: r(u),
        editorContainerEl: R,
        submitPost: Ne
      }), M = null);
    };
  });
  const $t = Oe.handleFileSelect;
  async function Kt(l) {
    return await Oe.performUpload(l);
  }
  function Gt(l) {
    if (!r(u) || !l) return;
    const y = r(
      u
      // nullチェック済みのローカル変数
    ), b = l.split(`
`).map((D) => ({
      type: "paragraph",
      content: D ? [{ type: "text", text: D }] : void 0
    }));
    y.commands.setContent({ type: "doc", content: b }), y.commands.focus("end");
  }
  function Qt(l) {
    if (!r(u) || !l) return !1;
    const F = l.split(`
`).map((b) => ({
      type: "paragraph",
      content: b ? [{ type: "text", text: b }] : void 0
    }));
    return r(u).isEmpty ? r(u).commands.setContent({ type: "doc", content: F }) : r(u).chain().focus("end").insertContent([{ type: "paragraph" }, ...F]).run(), r(u).commands.focus("end"), !0;
  }
  function Vt(l) {
    if (!r(u) || !l) return;
    const y = Dr(l);
    r(u).commands.setContent(y || "<p></p>"), r(u).commands.focus("end");
  }
  function Yt() {
    return r(u) ? r(u).getHTML() : "";
  }
  function Zt(l) {
    if (!r(u) || l.length === 0) return;
    const { schema: y } = r(u).state;
    let F = r(u).state.tr, b = r(u).state.doc.content.size;
    l.forEach((D) => {
      if (D.isPlaceholder) return;
      const ee = D.src;
      if (D.type === "image" && y.nodes.image) {
        const we = y.nodes.image.create({
          src: ee,
          alt: D.alt ?? "Image",
          blurhash: D.blurhash ?? null,
          dim: D.dim ?? null,
          size: D.size ?? null,
          uploadProtocol: D.uploadProtocol ?? null
        });
        F = F.insert(b, we), b += we.nodeSize, D.ox && E(H, { ...r(H), [ee]: D.ox }, !0), D.x && E(z, { ...r(z), [ee]: D.x }, !0);
      } else if (D.type === "video" && y.nodes.video) {
        const we = y.nodes.video.create({ src: ee });
        F = F.insert(b, we), b += we.nodeSize;
      }
    }), r(u).view.dispatch(F), r(u).commands.focus("end");
  }
  function Jt(l) {
    !r(u) || r(I).sending || ua(r(u), l);
  }
  function We() {
    if (!r(u)) return;
    Hr(r(u).view.dom) || Ur(r(u));
  }
  function tt(l) {
    if (!r(u)) return;
    We();
    const { state: y, view: F } = r(u), b = l < 0 ? y.selection.from : y.selection.to, D = Math.max(0, Math.min(y.doc.content.size, b + l));
    if (D === b) return;
    const ee = Lr.near(y.doc.resolve(D), l);
    F.dispatch(y.tr.setSelection(ee).scrollIntoView().setMeta("addToHistory", !1));
  }
  function en() {
    tt(-1);
  }
  function tn() {
    tt(1);
  }
  function nn() {
    if (!r(u)) return;
    We();
    const { state: l, view: y } = r(u), { selection: F } = l;
    if (!F.empty) {
      r(u).commands.deleteSelection();
      return;
    }
    const D = F.$from.nodeBefore;
    if (D) {
      const ee = D.isText ? Array.from(D.text ?? "").at(-1)?.length ?? 0 : D.nodeSize;
      ee > 0 && y.dispatch(l.tr.delete(F.from - ee, F.from).scrollIntoView());
      return;
    }
    r(u).commands.first(({ commands: ee }) => [
      () => ee.joinBackward(),
      () => ee.selectNodeBackward()
    ]);
  }
  function rn() {
    r(u) && (We(), r(u).commands.keyboardShortcut("Enter"));
  }
  async function Ne() {
    if (!r(A) || !r(u)) return;
    const l = r(A).preparePostPayload(r(u));
    if (Ar(l.content)) {
      ae.showSecretKeyDialog(l.content, l.emojiTags);
      return;
    }
    await r(A).performPostSubmission(r(u), r(H), r(z), be.markSending, be.markSuccess, be.markFailure);
  }
  function on() {
    r(A) && r(u) && r(A).resetPostContent(r(u));
  }
  function nt() {
    r(A) && r(u) && r(A).clearContentAfterSuccess(r(u));
  }
  async function an() {
    const l = ae.getPendingPost(), y = ae.getPendingEmojiTags();
    ae.hideSecretKeyDialog(), r(A) && r(u) && await ta({
      postManager: r(A),
      currentEditor: r(u),
      imageOxMap: r(H),
      imageXMap: r(z),
      pendingPost: l,
      pendingEmojiTags: y,
      onStart: be.markSending,
      onSuccess: be.markSuccess,
      onFailure: be.markFailure
    });
  }
  const sn = ae.hideSecretKeyDialog, ln = ae.hideImageFullscreen;
  let Be = C(() => na({
    mediaFreePlacement: r(_),
    galleryItems: te.items,
    currentEditor: r(u)
  })), cn = C(() => ra(r(Be), r(ue), r(h)));
  function dn(l) {
    const y = oa(r(Be), l);
    y && ae.showImageFullscreen(y.src, y.alt ?? "", y.id ?? "");
  }
  ge(() => {
    r(u) && r(A) && r(A).preparePostContent(r(u)) !== pe.content && r(I).error && mt({ ...r(I), error: !1, message: "" });
  });
  function un() {
    r(U)?.click();
  }
  ge(() => {
    const l = te.items.some((b) => !b.isPlaceholder), y = !!pe.content.trim(), F = pe.hasImage;
    pe.canPost = y || F || l;
  });
  let rt = !0;
  ge(() => {
    const l = !He.value;
    if (rt) {
      rt = !1;
      return;
    }
    if (!r(u)) return;
    const y = r(u);
    if (l)
      Me(() => sa({
        currentEditor: y,
        imageOxMap: r(H),
        imageXMap: r(z),
        addGalleryItem: (b) => te.addItem(b),
        createMediaItemId: Rr
      })) && Me(() => {
        E(H, {}, !0), E(z, {}, !0);
      });
    else {
      const F = Me(() => te.getItems()), b = ia({ currentEditor: y, items: F });
      b.hadItems && Me(() => {
        E(H, b.imageOxMap, !0), E(z, b.imageXMap, !0);
      }), Me(() => te.clearAll());
    }
  });
  var gn = {
    uploadFiles: Kt,
    insertTextContent: Gt,
    appendSharedTextContent: Qt,
    loadDraftContent: Vt,
    getEditorHtml: Yt,
    appendMediaToEditor: Zt,
    insertCustomEmoji: Jt,
    moveCaretLeft: en,
    moveCaretRight: tn,
    deleteBackward: nn,
    insertLineBreak: rn,
    submitPost: Ne,
    resetPostContent: on,
    clearContentAfterSuccess: nt,
    openFileDialog: un,
    get rxNostr() {
      return a();
    },
    set rxNostr(l) {
      a(l), Z();
    },
    get hasStoredKey() {
      return c();
    },
    set hasStoredKey(l) {
      c(l), Z();
    },
    get isSwitchingAccount() {
      return i();
    },
    set isSwitchingAccount(l = !1) {
      i(l), Z();
    },
    get onPostSuccess() {
      return d();
    },
    set onPostSuccess(l) {
      d(l), Z();
    },
    get availableComposerHeight() {
      return p();
    },
    set availableComposerHeight(l = Pe) {
      p(l), Z();
    },
    get minEditorHeight() {
      return f();
    },
    set minEditorHeight(l = Pe) {
      f(l), Z();
    },
    get onCustomEmojiSelect() {
      return P();
    },
    set onCustomEmojiSelect(l) {
      P(l), Z();
    },
    get notificationPort() {
      return g();
    },
    set notificationPort(l) {
      g(l), Z();
    }
  }, ot = fa(), Ie = Tt(ot), re = fe(Ie);
  let at;
  var st = fe(re);
  {
    var pn = (l) => {
      var y = ga(), F = fe(y);
      {
        let b = C(() => r(O)?.picture || "");
        qr(F, {
          get src() {
            return r(b);
          },
          alt: "",
          fallbackAriaLabel: "",
          rootClassName: "editor-account-placeholder-avatar",
          imageClassName: "editor-account-placeholder-image",
          fallbackClassName: "editor-account-placeholder-fallback"
        });
      }
      ce(y), de(l, y);
    };
    le(st, (l) => {
      r(ne) && l(pn);
    });
  }
  var hn = ie(st, 2);
  {
    var fn = (l) => {
      Xr(l, {
        get editor() {
          return r(u);
        },
        class: "editor-content"
      });
    };
    le(hn, (l) => {
      r(v) && r(u) && l(fn);
    });
  }
  ce(re), De(re, (l, y) => qo?.(l, y), () => ({ dragOver: (l) => E(x, l, !0) })), De(re, (l) => Xo?.(l)), De(re, (l) => $o?.(l)), De(re, (l) => Ko?.(l)), Ee(re, (l) => R = l, () => R);
  var it = ie(re, 2);
  {
    var mn = (l) => {
      jt(l, {});
    };
    le(it, (l) => {
      r(_) || l(mn);
    });
  }
  var je = ie(it, 2);
  Ee(je, (l) => E(U, l), () => r(U));
  var vn = ie(je, 2);
  {
    var yn = (l) => {
      var y = pa(), F = fe(y, !0);
      ce(y), ye(() => vt(F, r(X))), de(l, y);
    };
    le(vn, (l) => {
      r(X) && l(yn);
    });
  }
  ce(Ie), Ee(Ie, (l) => T = l, () => T);
  var lt = ie(Ie, 2);
  {
    let l = C(() => n()("postComponent.warning")), y = C(() => n()("postComponent.secret_key_detected")), F = C(() => n()("postComponent.post")), b = C(() => n()("postComponent.cancel"));
    _r(lt, {
      get open() {
        return r(G);
      },
      get title() {
        return r(l);
      },
      get description() {
        return r(y);
      },
      get confirmLabel() {
        return r(F);
      },
      get cancelLabel() {
        return r(b);
      },
      confirmVariant: "danger",
      onConfirm: an,
      get onCancel() {
        return sn;
      },
      contentClass: "secretkey-warning-dialog"
    });
  }
  var ct = ie(lt, 2);
  Tr(ct, {
    get src() {
      return r(h);
    },
    get alt() {
      return r(N);
    },
    get onClose() {
      return ln;
    },
    get mediaList() {
      return r(Be);
    },
    get currentIndex() {
      return r(cn);
    },
    onNavigate: dn,
    get show() {
      return r(j);
    },
    set show(l) {
      E(j, l);
    }
  });
  var wn = ie(ct, 2);
  {
    var Sn = (l) => {
      $r(l, {
        get show() {
          return r(Q);
        },
        get x() {
          return r(J);
        },
        get y() {
          return r(xe);
        },
        children: (y, F) => {
          var b = ha(), D = fe(b, !0);
          ce(b), ye(() => vt(D, r(Xt))), de(y, b);
        },
        $$slots: { default: !0 }
      });
    };
    le(wn, (l) => {
      r(Q) && l(Sn);
    });
  }
  ye(
    (l) => {
      Ct(Ie, r(Se)), at = ke(re, 1, "editor-container svelte-15ticnd", null, at, {
        "drag-over": r(x),
        "gallery-mode": !r(_),
        sending: r(I).sending,
        "account-avatar-placeholder": r(ne)
      }), se(re, "aria-label", l), se(re, "aria-disabled", r(I).sending ? "true" : void 0);
    },
    [() => n()("postComponent.editor_label")]
  ), ve("click", re, q), ve("keydown", re, W), ve("change", je, $t), de(e, ot);
  var bn = et(gn);
  return s(), bn;
}
_t(["click", "keydown", "change"]);
Ze(
  va,
  {
    rxNostr: {},
    hasStoredKey: {},
    isSwitchingAccount: {},
    onPostSuccess: {},
    availableComposerHeight: {},
    minEditorHeight: {},
    onCustomEmojiSelect: {},
    notificationPort: {}
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
  va as default
};
