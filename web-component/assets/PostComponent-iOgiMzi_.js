import { i as Ue, m as ee, N as yt, a as hn, r as fn, p as wt, c as mn, f as it, b as De, h as lt, d as Le, e as vn, j as yn, k as wn, l as St, s as Sn, w as bn, n as bt, o as Pn, q as ct, t as En, u as Pt, v as xn, x as In, y as Fn, z as Mn, A as Cn, B as Et, P as kn, C as _n, R as dt, D as _e, E as Tn, F as Dn, G as An, H as Rn, I as Ln, J as Ae, K as Hn, L as Un, M as xt, O as zn, Q as On, S as Wn, T as Bn, U as Nn, V as jn, W as qn, X as qe, Y as $n, Z as Xn, _ as Kn, $ as Gn, a0 as Qn, a1 as Vn, a2 as Yn, a3 as Zn, a4 as Jn, a5 as er, a6 as tr, a7 as Xe, a8 as Y, a9 as nr, aa as ge, ab as be, ac as Ke, ad as Ce, ae as se, af as It, ag as rr, ah as or, ai as ar, aj as Ge, ak as Qe, al as sr, am as de, an as Ie, ao as ut, ap as ir, aq as gt, ar as lr, as as Ft, at as cr, au as dr, av as ur, aw as gr, ax as He, ay as pr, az as hr, aA as fr, aB as Se, aC as mr, aD as vr, aE as yr, aF as wr, aG as Sr, aH as pt, aI as Te, aJ as br, aK as Pr, aL as Er, aM as xr, aN as Ir, aO as Fr, aP as Mr, aQ as Cr, aR as kr, aS as _r, aT as Tr, aU as Dr, aV as Ar, aW as Rr } from "./App-Cyoa6Q_G.js";
import { aZ as Lr, aO as Hr, aJ as Re, aq as Mt, b4 as Ve, a_ as Ye, a as r, bd as ie, Z as ve, bj as ue, ap as fe, b1 as he, b2 as Ze, aQ as J, b8 as ye, b6 as me, b3 as Z, b7 as pe, b as E, aP as A, be as Ur, aN as ce, a$ as zr, b0 as Ct, bi as Or, u as Fe, bh as ht } from "./entry-kEWtxODC.js";
function kt(e, t, n) {
  if (e.length === 0)
    return "";
  if (e.length === 1) {
    const o = e[0].errorCode;
    return o ? n?.(o) || e[0].error || t : e[0].error || t;
  }
  return `${e.length}個のファイルのアップロードに失敗しました`;
}
function Wr(e, t) {
  let n, o = -1;
  return t.sizeInfo?.originalFilename && (o = e.findIndex(
    (s) => s.file.name === t.sizeInfo.originalFilename
  ), o !== -1 && (n = e[o])), !n && e.length > 0 && (n = e[0], o = 0), { matched: n, matchedIndex: o };
}
function Br(e) {
  return kt(e, "postComponent.upload_failed");
}
function _t(e, t, n, o) {
  e.update((s) => {
    const a = { ...s };
    return delete a[t], n && o && (a[n] = o), a;
  });
}
function Tt(e, t) {
  return {
    onAborted: e,
    onFailure: e,
    onRemaining: e,
    onSuccess: t
  };
}
function Dt(e, t) {
  ee.removeItem(e), _t(t, e);
}
function Nr(e) {
  return {
    serverBlurhash: e.blurhash ?? e.b ?? void 0,
    oxFromServer: e.ox ?? e.o ?? void 0,
    xFromServer: e.x ?? void 0,
    dimFromServer: e.dim ?? void 0,
    sizeFromServer: e.size ?? void 0
  };
}
function jr(e) {
  if (typeof e == "number" && Number.isFinite(e) && e > 0)
    return e;
  if (typeof e == "string") {
    const t = Number(e);
    if (Number.isFinite(t) && t > 0)
      return t;
  }
}
function qr(e, t, n) {
  if (e.dimensions)
    return e.dimensions;
  const o = wt(t);
  return o ? mn(o.width, o.height) : n.dimensions;
}
function $r(e, t) {
  const { serverBlurhash: n, oxFromServer: o, xFromServer: s, dimFromServer: a, sizeFromServer: l } = Nr(e.nip94 || {}), i = qr(e, a, t);
  return {
    serverBlurhash: n,
    oxFromServer: o,
    xFromServer: s,
    blurhash: n ?? t.blurhash,
    ox: e.uploadProtocol === "blossom" ? void 0 : o ?? t.ox,
    dim: a ?? (i ? `${i.width}x${i.height}` : void 0),
    dimensions: i,
    size: jr(l) ?? e.sizeInfo?.compressedSize,
    uploadProtocol: e.uploadProtocol
  };
}
async function At(e, t, n, o, s, a, l, i) {
  return _t(
    a,
    t.placeholderId,
    n.dimensions ? e : void 0,
    n.dimensions
  ), Xr(
    e,
    t,
    n.uploadProtocol,
    n.oxFromServer,
    n.xFromServer,
    o,
    s,
    l,
    i
  );
}
async function Xr(e, t, n, o, s, a, l, i, d) {
  if (n !== "blossom" ? o ? a[e] = o : t.ox && (a[e] = t.ox) : delete a[e], s)
    return l[e] = s, s;
  try {
    const p = await i(e);
    return p && (l[e] = p), p ?? void 0;
  } catch (p) {
    d && console.warn("[placeholderManager] failed to calculate x hash", { url: e, error: p });
    return;
  }
}
function Rt(e, t, n, o, s) {
  const a = new o(), l = [];
  return e.forEach((i, d) => {
    const p = i.type.startsWith("video/"), v = a.validateMediaFile(i);
    if (!v.isValid) {
      n(v.errorMessage || "postComponent.upload_failed");
      return;
    }
    const w = `placeholder-${s}-${d}-${hn()}`, g = t[d];
    l.push({
      file: i,
      placeholderId: w,
      ox: g?.ox,
      dimensions: g?.dimensions,
      isVideo: p
    });
  }), l;
}
function Lt(e) {
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
      imageMetadata: $r(t, n)
    });
  };
}
async function Ht(e, t, n) {
  const o = [], s = [...t];
  for (const a of e) {
    if (a.aborted) {
      const i = s.shift();
      i && await n.onAborted(i);
      continue;
    }
    if (a.success && a.url) {
      const { matched: i, matchedIndex: d } = Wr(s, a);
      i && d !== -1 && (s.splice(d, 1), await n.onSuccess(a, i));
      continue;
    }
    o.push(a);
    const l = s.shift();
    l && await n.onFailure(l);
  }
  for (const a of s)
    await n.onRemaining(a);
  return {
    failedResults: o,
    errorMessage: Br(o)
  };
}
async function Kr(e, t, n = !1, o = Ue) {
  if (o()) {
    n && console.log("[generateBlurhashes] Aborted before blurhash generation");
    return;
  }
  const s = new t(), a = e.map(async (l) => {
    if (o()) {
      n && console.log("[generateBlurhashes] Aborted during blurhash generation");
      return;
    }
    try {
      const i = await s.generateBlurhashForFile(l.file);
      if (o()) {
        n && console.log("[generateBlurhashes] Aborted after blurhash generation");
        return;
      }
      i && (l.blurhash = i);
    } catch (i) {
      n && console.warn("[generateBlurhashes] blurhash generation failed", {
        file: l.file.name,
        error: i
      });
    }
  });
  await Promise.all(a);
}
function Gr(e, t, n, o, s, a, l = !1) {
  if (!n) return [];
  const i = n.state, d = i.selection, p = d instanceof yt && d.node?.type?.name === "image", v = Date.now();
  l && console.log("[dev] insertPlaceholdersIntoEditor:", {
    fileCount: e.length,
    isImageNodeSelected: p,
    selectionType: d.constructor.name,
    selectionFrom: d.from,
    selectionTo: d.to,
    docSize: i.doc.content.size
  });
  const w = i.doc.childCount === 1 && i.doc.firstChild?.type.name === "paragraph" && i.doc.firstChild.content.size === 0;
  let g = i.tr, u = p ? d.to : d.from;
  const b = Rt(
    e,
    t,
    o,
    a,
    v
  ), P = [];
  return b.forEach((x, z) => {
    const { file: L, placeholderId: O, ox: M, dimensions: C, isVideo: N } = x;
    try {
      let T;
      if (N)
        T = i.schema.nodes.video.create({ src: O, isPlaceholder: !0 });
      else {
        const j = { src: O, isPlaceholder: !0 };
        C && (j.dim = `${C.width}x${C.height}`, s.update((X) => ({ ...X, [O]: C }))), T = i.schema.nodes.image.create(j);
      }
      w && z === 0 ? (g = g.replaceWith(0, i.doc.content.size, T), u = T.nodeSize) : (g = g.insert(u, T), u += T.nodeSize), P.push({ file: L, placeholderId: O, ox: M, dimensions: C });
    } catch (T) {
      l && console.error("[uploadHelper] failed to insert media node", {
        placeholderId: O,
        file: L.name,
        isVideo: N,
        error: T,
        insertPos: u,
        docSize: i.doc.content.size
      }), o(N ? "動画の挿入に失敗しました" : "画像の挿入に失敗しました");
    }
  }), P.length > 0 && n.view.dispatch(g), P;
}
async function Qr(e, t, n, o, s, a, l, i = !1) {
  const d = {}, p = async (g) => {
    fn(
      g.placeholderId,
      g.file.type.startsWith("video/"),
      n,
      a,
      i
    );
  }, { failedResults: v, errorMessage: w } = await Ht(
    e,
    t,
    Tt(
      p,
      Lt({
        onBeforeReplace: ({ url: g, matched: u, isVideo: b }) => {
          i && console.log("[uploadHelper] Replacing placeholder", {
            placeholderId: u.placeholderId,
            url: g,
            isVideo: b
          });
        },
        onVideoSuccess: (g, u) => {
          it(
            n,
            (b) => b.type?.name === "video" && b.attrs?.src === u.placeholderId,
            (b, P) => {
              const x = n.state.tr.setNodeMarkup(P, void 0, {
                ...b.attrs,
                src: g,
                isPlaceholder: !1
              });
              n.view.dispatch(x);
            }
          );
        },
        onImageSuccess: async ({ url: g, matched: u, imageMetadata: b }) => {
          it(
            n,
            (P) => P.type?.name === "image" && P.attrs?.src === u.placeholderId,
            (P, x) => {
              const z = {
                ...P.attrs,
                src: g,
                isPlaceholder: !1,
                blurhash: b.blurhash
              };
              b.dim && (z.dim = b.dim), z.size = b.size ?? null, z.uploadProtocol = b.uploadProtocol ?? null;
              const L = n.state.tr.setNodeMarkup(x, void 0, z);
              n.view.dispatch(L);
            }
          ), b.serverBlurhash && (d[g] = b.serverBlurhash), await At(
            g,
            u,
            b,
            o,
            s,
            a,
            l,
            i
          );
        }
      })
    )
  );
  return { failedResults: v, errorMessage: w, imageServerBlurhashMap: d };
}
function Vr(e, t, n, o, s, a = !1) {
  const l = Date.now(), i = Rt(
    e,
    t,
    n,
    s,
    l
  ), d = [];
  for (const p of i) {
    const { file: v, placeholderId: w, ox: g, dimensions: u, isVideo: b } = p, P = {
      id: w,
      type: b ? "video" : "image",
      src: w,
      isPlaceholder: !0,
      dimensions: u,
      dim: u ? `${u.width}x${u.height}` : void 0
    };
    ee.addItem(P), !b && u && o.update((x) => ({ ...x, [w]: u })), d.push({ file: v, placeholderId: w, ox: g, dimensions: u }), a && console.log("[gallery] inserted placeholder:", w, b ? "video" : "image");
  }
  return d;
}
async function Yr(e, t, n, o, s, a, l, i = !1) {
  return Ht(
    e,
    t,
    Tt(
      async (d) => {
        Dt(d.placeholderId, s);
      },
      Lt({
        onVideoSuccess: (d, p) => {
          ee.updateItem(p.placeholderId, {
            src: d,
            isPlaceholder: !1,
            mimeType: l(d)
          });
        },
        onImageSuccess: async ({ url: d, matched: p, imageMetadata: v }) => {
          const w = l(d);
          ee.updateItem(p.placeholderId, {
            src: d,
            isPlaceholder: !1,
            blurhash: v.blurhash,
            mimeType: w,
            ox: v.ox,
            dim: v.dim,
            dimensions: v.dimensions,
            size: v.size,
            uploadProtocol: v.uploadProtocol
          });
          const g = await At(
            d,
            p,
            v,
            n,
            o,
            s,
            a,
            i
          );
          g && ee.updateItem(p.placeholderId, { x: g }), i && console.log("[gallery] replaced placeholder:", p.placeholderId, "->", d);
        }
      })
    )
  );
}
function Zr(e, t) {
  for (const n of e)
    Dt(n.placeholderId, t);
}
class Jr {
  constructor(t, n = {}) {
    this.deps = n, t && this.setRxNostr(t), this.deps.console = n.console || (typeof window < "u" ? window.console : {}), this.deps.authStateStore = n.authStateStore || De, this.deps.hashtagStore = n.hashtagStore || lt, this.deps.mediaFreePlacementStore = n.mediaFreePlacementStore || Le, this.deps.mediaGalleryStore = n.mediaGalleryStore || ee, this.deps.contentWarningStore = n.contentWarningStore || vn, this.deps.contentWarningReasonStore = n.contentWarningReasonStore || yn, this.deps.keyManager = n.keyManager || wn, this.deps.createImetaTagFn = n.createImetaTagFn || St, this.deps.settingsStore = n.settingsStore || Sn, this.deps.writeRelaysStore = n.writeRelaysStore || bn, this.deps.replyQuoteState = n.replyQuoteState || bt, this.deps.getClientTagFn = n.getClientTagFn || (() => Pn(this.deps.settingsStore?.clientTagEnabled ?? !0)), this.deps.seckeySignerFn = n.seckeySignerFn || ct, this.deps.extractContentWithImagesFn = n.extractContentWithImagesFn, this.deps.extractContentWithEmojiTagsFn = n.extractContentWithEmojiTagsFn || (n.extractContentWithImagesFn ? (o) => ({ content: n.extractContentWithImagesFn(o), emojiTags: [] }) : En), this.deps.extractImageBlurhashMapFn = n.extractImageBlurhashMapFn || Pt, this.deps.resetEditorStateFn = n.resetEditorStateFn || xn, this.deps.resetPostStatusFn = n.resetPostStatusFn || In, this.deps.notificationPort = n.iframeMessageService || n.notificationPort || Fn, this.deps.iframeMessageService = this.deps.notificationPort, this.deps.hashtagPinStore = n.hashtagPinStore || Mn, this.deps.saveHashtagsToHistoryFn = n.saveHashtagsToHistoryFn || Cn, this.deps.clearReplyQuoteFn = n.clearReplyQuoteFn || Et;
  }
  rxNostr = null;
  eventSender = null;
  setRxNostr(t) {
    this.rxNostr = t, this.eventSender = new kn(t, this.deps.console || console);
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
    return _n.buildEvent(
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
    const n = dt.sanitizeExternalRelayUrls(
      t.result.acceptedRelays
    ), o = dt.sanitizeExternalRelayUrls([
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
    _e(this.deps.authStateStore, t.sessionPubkey);
    const o = Tn(t.event), s = n ? await n(o.signerTemplate) : t.event;
    _e(this.deps.authStateStore, t.sessionPubkey);
    let a;
    try {
      a = Dn(
        o.expectedTemplate,
        s,
        t.sessionPubkey
      );
    } catch {
      return this.notifyPostFailure("post_error");
    }
    _e(this.deps.authStateStore, t.sessionPubkey);
    const l = An(a);
    if (!l)
      return this.notifyPostFailure("post_error");
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent signed", {
      eventKind: a?.kind ?? "(missing)"
    }), n && t.logSignedEvent && this.deps.console?.debug?.("[PostManager] signed event ready"), _e(this.deps.authStateStore, t.sessionPubkey);
    const i = await this.eventSender.sendEvent(l.event, {
      targetRelays: t.additionalWriteRelays,
      includeDefaultWriteRelays: !0
    });
    this.deps.console?.debug?.("[PostManager] sendPreparedEvent publish completed", {
      success: i.success
    });
    const d = i.success ? {
      ...i,
      eventId: i.eventId ?? l.event.id,
      event: l.event
    } : i;
    return await this.saveSubmittedPostHistory({
      event: l.event,
      attestation: l.attestation,
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
    return Rn.validatePost(
      t,
      n.value.isAuthenticated,
      !!this.rxNostr
    );
  }
  async submitPost(t, n, o = []) {
    let s = Ln(t);
    const a = this.deps.settingsStore.quoteNotificationEnabled, l = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      s,
      a
    ) ?? new Ae().extractInlineQuoteTags(
      s,
      a
    ), i = this.deps.replyQuoteState.value;
    if (i.quotes.length > 0) {
      const p = this.deps.replyQuoteService || new Ae(), v = new Set(
        l.filter((g) => g[0] === "q").map((g) => g[1])
      ), w = i.quotes.filter((g) => !v.has(g.eventId)).map(
        (g) => p.generateNostrUri(
          g.eventId,
          g.relayHints,
          g.authorPubkey
        )
      );
      w.length > 0 && (s = `${s.trimEnd()}
${w.join(`
`)}`.trim());
    }
    const d = this.validatePost(s);
    if (!d.valid)
      return this.notifyPostFailure(d.error);
    if (!this.eventSender)
      return this.notifyPostFailure("nostr_not_ready");
    try {
      const p = this.deps.authStateStore, v = Hn(p), w = this.deps.hashtagStore, { hashtags: g, tags: u } = this.getHashtagArrays(w), b = this.deps.keyManager, P = this.deps.window || (typeof window < "u" ? window : void 0), x = this.deps.contentWarningStore.value, z = this.deps.contentWarningReasonStore.value, L = this.deps.channelContextState?.value ?? null, O = L?.channelRelays, M = this.deps.replyQuoteState.value;
      let C;
      const N = this.getReplyQuoteNotifyOptions();
      if (M.reply || M.quotes.length > 0) {
        const H = this.deps.replyQuoteService || new Ae();
        C = [], M.reply && (L ? (C.push([
          "e",
          M.reply.eventId,
          M.reply.relayHints[0] || "",
          "reply",
          ...M.reply.authorPubkey ? [M.reply.authorPubkey] : []
        ]), H.buildReplyTags(M.reply).filter((k) => k[0] === "p").forEach((k) => {
          C.push(k);
        })) : C.push(...H.buildReplyTags(M.reply)));
        const B = /* @__PURE__ */ new Set(), S = new Set(
          C.filter((k) => k[0] === "p").map((k) => k[1])
        );
        M.quotes.forEach((k) => {
          H.buildQuoteTags(k, k.quoteNotificationEnabled).forEach((_) => {
            if (_[0] === "q") {
              if (B.has(_[1]))
                return;
              B.add(_[1]);
            }
            if (_[0] === "p") {
              if (S.has(_[1]))
                return;
              S.add(_[1]);
            }
            C.push(_);
          });
        });
      }
      if (l.length > 0) {
        C || (C = []);
        const H = new Set(
          C.filter((S) => S[0] === "q").map((S) => S[1])
        ), B = new Set(
          C.filter((S) => S[0] === "p").map((S) => S[1])
        );
        for (const S of l)
          S[0] === "q" && !H.has(S[1]) ? (C.push(S), H.add(S[1])) : S[0] === "p" && !B.has(S[1]) && (C.push(S), B.add(S[1]));
      }
      const T = p.value;
      if (T.type === "nip07" && b.isWindowNostrAvailable() && P?.nostr)
        try {
          const H = T.pubkey;
          if (!H)
            return this.notifyPostFailure("pubkey_not_found");
          const B = typeof P.nostr.signEvent == "function" ? P.nostr.signEvent.bind(P.nostr) : void 0;
          if (!B)
            return this.notifyPostFailure("nostr_sign_event_not_supported");
          const S = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: g,
            tags: u,
            pubkey: H,
            imageImetaMap: n,
            contentWarningEnabled: x,
            contentWarningReason: z,
            replyQuoteTags: C,
            channelContext: L,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: v,
            hashtags: g,
            rqNotifyOptions: N,
            signEvent: B,
            logSignedEvent: !0,
            additionalWriteRelays: O
          });
        } catch {
          return this.handleSubmissionError("window.nostrでの投稿エラー:");
        }
      if (T.type === "nip46")
        try {
          const H = T.pubkey;
          if (!H)
            return this.notifyPostFailure("pubkey_not_found");
          const B = await this.deps.getNip46SignerForSessionFn?.(H), S = this.deps.authStateStore.value;
          if (!B || !S.isAuthenticated || S.type !== "nip46" || S.pubkey !== H)
            return this.notifyPostFailure("nip46_signer_not_available");
          const k = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: g,
            tags: u,
            pubkey: H,
            imageImetaMap: n,
            contentWarningEnabled: x,
            contentWarningReason: z,
            replyQuoteTags: C,
            channelContext: L,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: k,
            sessionPubkey: v,
            hashtags: g,
            rqNotifyOptions: N,
            signer: B,
            additionalWriteRelays: O
          });
        } catch {
          return this.handleSubmissionError("NIP-46での投稿エラー:");
        }
      if (T.type === "parentClient") {
        const H = this.deps.getParentClientSignerFn?.();
        if (!H)
          return this.notifyPostFailure("parent_client_signer_not_available");
        const B = T.pubkey;
        if (!B)
          return this.notifyPostFailure("pubkey_not_found");
        try {
          const S = await this.buildSubmissionEvent({
            processedContent: s,
            hashtags: g,
            tags: u,
            pubkey: B,
            imageImetaMap: n,
            contentWarningEnabled: x,
            contentWarningReason: z,
            replyQuoteTags: C,
            channelContext: L,
            emojiTags: o
          });
          return await this.sendPreparedEvent({
            event: S,
            sessionPubkey: v,
            hashtags: g,
            rqNotifyOptions: N,
            signer: H,
            additionalWriteRelays: O
          });
        } catch {
          return this.handleSubmissionError("親クライアント連携での投稿エラー:");
        }
      }
      const X = b.getFromStore() || b.loadFromStorage(T.pubkey);
      if (!X)
        return this.notifyPostFailure("key_not_found");
      const te = await this.buildSubmissionEvent({
        processedContent: s,
        hashtags: g,
        tags: u,
        imageImetaMap: n,
        contentWarningEnabled: x,
        contentWarningReason: z,
        replyQuoteTags: C,
        channelContext: L,
        emojiTags: o
      }), oe = this.deps.seckeySignerFn ? this.deps.seckeySignerFn(X) : ct(X);
      return await this.sendPreparedEvent({
        event: te,
        sessionPubkey: v,
        hashtags: g,
        rqNotifyOptions: N,
        signer: oe,
        additionalWriteRelays: O
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
    if (n === lt)
      try {
        const s = Un();
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
    const a = this.deps.extractImageBlurhashMapFn(t), l = {};
    for (const [i, d] of Object.entries(a))
      l[i] = {
        m: xt(i),
        blurhash: d,
        dim: s[i]?.dim,
        alt: s[i]?.alt,
        size: s[i]?.size,
        uploadProtocol: s[i]?.uploadProtocol,
        ox: n[i],
        x: o[i]
      };
    return l;
  }
  async performPostSubmission(t, n, o, s, a, l) {
    const i = this.preparePostPayload(t), d = this.prepareImageBlurhashMap(t, n, o);
    s?.();
    try {
      const p = await this.submitPost(i.content, d, i.emojiTags);
      p.success ? a?.(p) : l?.(p.error || "post_error");
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
    const n = this.deps.hashtagPinStore.value, o = n ? this.getHashtagArrays(this.deps.hashtagStore).hashtags : [];
    if (this.applyEmptyStateToEditor(t), this.deps.contentWarningStore.reset(), this.deps.contentWarningReasonStore.reset(), this.deps.mediaGalleryStore.clearAll(), n && o.length > 0) {
      const s = " " + o.map((a) => "#" + a).join(" ");
      t.commands.insertContent(s), t.commands.focus("start");
    }
  }
}
async function eo({
  editor: e,
  imageServerBlurhashMap: t,
  imageOxMap: n,
  imageXMap: o,
  dependencies: s
}) {
  const a = s.extractImageBlurhashMap(e), l = /* @__PURE__ */ new Set([
    ...Object.keys(a),
    ...Object.keys(t)
  ]);
  return await Promise.all(
    Array.from(l).map(async (d) => {
      if (!o[d]) {
        const p = await s.calculateImageHash(d);
        p && (o[d] = p);
      }
    })
  ), await Promise.all(
    Array.from(l).map(async (d) => {
      const p = t[d] ?? a[d], v = s.getMimeTypeFromUrl(d), w = n[d], g = o[d];
      return (await s.createImetaTag({ url: d, m: v, blurhash: p, ox: w, x: g })).join(" ");
    })
  );
}
function to(e, t) {
  if (e.galleryCleanup) {
    Zr(
      t,
      e.galleryCleanup.imageSizeMapStore
    );
    return;
  }
  e.currentEditor && zn(e.currentEditor, e.devMode);
}
function Ut(e, { placeholderMap: t, cleanupPlaceholders: n }) {
  return e.updateUploadState(!1), n && to(e, t), e.notifyAbortProgress?.(e.fileArray.length), {
    placeholderMap: n ? [] : t,
    results: null,
    imageOxMap: {},
    imageXMap: {},
    failedResults: [],
    errorMessage: "Upload aborted by user"
  };
}
function no(e, t) {
  return e ? { imageSizeMapStore: t } : void 0;
}
function ro({
  isUploadAborted: e = Ue,
  ...t
}) {
  return ({
    placeholderMap: n,
    cleanupPlaceholders: o
  }) => e() ? Ut(t, {
    placeholderMap: n,
    cleanupPlaceholders: o
  }) : null;
}
function Ne(e, t = {}) {
  return {
    total: e,
    completed: 0,
    failed: 0,
    aborted: 0,
    inProgress: !1,
    ...t
  };
}
function je(e, t) {
  e?.onProgress?.(t);
}
function oo(e) {
  return {
    onProgress: (t) => {
      Bn(t), e?.onProgress?.(t);
    },
    onVideoCompressionProgress: (t) => {
      Wn.set(t), e?.onVideoCompressionProgress?.(t);
    },
    onImageCompressionProgress: (t) => {
      On.set(t), e?.onImageCompressionProgress?.(t);
    }
  };
}
function ao(e) {
  const t = e.isUploadAborted ?? Ue;
  if (e.FileUploadManager === qe) {
    const n = new Xn(
      typeof document > "u" ? void 0 : document
    ), o = new $n(
      n,
      e.localStorage,
      t
    ), s = new Kn(
      e.localStorage,
      t
    );
    return er(o), tr(s), new qe(
      {
        localStorage: e.localStorage,
        fetch: window.fetch.bind(window),
        crypto: e.crypto,
        document: typeof document > "u" ? void 0 : document,
        window: typeof window > "u" ? void 0 : window,
        navigator: typeof navigator > "u" ? void 0 : navigator,
        isUploadAborted: t
      },
      new Gn(),
      o,
      s,
      n
    );
  }
  return new e.FileUploadManager();
}
function so() {
  return De.value.isAuthenticated ? {
    pubkeyHex: De.value.pubkey || null,
    npub: De.value.npub || null
  } : {
    pubkeyHex: null,
    npub: null
  };
}
async function io() {
  const e = so();
  return Zn(
    await Jn.getDefault(e.pubkeyHex),
    e
  );
}
function lo(e) {
  if (e)
    return e.protocol === "nip96" && e.resolvedUploadUrl || e.serverUrl;
}
async function co(e, t, n, o, s, a, l) {
  try {
    if (t.length === 1)
      return [l ? await e.uploadFileWithCallbacks(
        t[0],
        n,
        o,
        a,
        s?.[0],
        l
      ) : await e.uploadFileWithCallbacks(
        t[0],
        n,
        o,
        a,
        s?.[0]
      )];
    if (t.length > 1)
      return l ? await e.uploadMultipleFilesWithCallbacks(
        t,
        n,
        o,
        s,
        l
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
async function uo(e) {
  const {
    results: t,
    placeholderMap: n,
    galleryMode: o,
    currentEditor: s,
    imageOxMap: a,
    imageXMap: l,
    imageSizeMapStore: i,
    calculateImageHash: d,
    getMimeTypeFromUrl: p,
    devMode: v
  } = e;
  if (!t || n.length === 0)
    return {
      failedResults: [],
      errorMessage: "",
      imageServerBlurhashMap: {}
    };
  if (o) {
    const g = await Yr(
      t,
      n,
      a,
      l,
      i,
      d,
      p,
      v
    );
    return {
      failedResults: g.failedResults,
      errorMessage: g.errorMessage,
      imageServerBlurhashMap: {}
    };
  }
  const w = await Qr(
    t,
    n,
    s,
    a,
    l,
    i,
    d,
    v
  );
  return {
    failedResults: w.failedResults,
    errorMessage: w.errorMessage,
    imageServerBlurhashMap: w.imageServerBlurhashMap
  };
}
const zt = () => ({
  localStorage: Hr(),
  crypto: window.crypto.subtle,
  tick: Lr,
  FileUploadManager: qe,
  getImageDimensions: Yn,
  isUploadAborted: Ue,
  extractImageBlurhashMap: Pt,
  calculateImageHash: Vn,
  getMimeTypeFromUrl: xt,
  createImetaTag: async (e) => await St(e),
  imageSizeMapStore: Qn,
  resolveUploadDestination: io
});
async function go({
  files: e,
  currentEditor: t,
  fileInput: n,
  uploadCallbacks: o,
  showUploadError: s,
  updateUploadState: a,
  devMode: l,
  dependencies: i = zt()
}) {
  const d = Array.from(e), p = oo(o), v = await i.resolveUploadDestination?.(), w = lo(v) || "", g = {}, u = {}, b = "[preview]";
  je(
    p,
    Ne(d.length, { inProgress: !0 })
  ), Nn();
  let P;
  try {
    P = await jn(d, i);
  } catch (k) {
    if (k instanceof Error && k.message === "Upload aborted by user")
      return Ut(
        {
          fileArray: d,
          currentEditor: t,
          updateUploadState: a,
          devMode: l,
          notifyAbortProgress: (_) => {
            je(
              p,
              Ne(_, {
                aborted: _
              })
            );
          }
        },
        {
          placeholderMap: [],
          cleanupPlaceholders: !1
        }
      );
    throw k;
  }
  const x = !Le.value, z = no(
    x,
    i.imageSizeMapStore
  ), L = ro({
    fileArray: d,
    currentEditor: t,
    updateUploadState: a,
    devMode: l,
    galleryCleanup: z,
    isUploadAborted: i.isUploadAborted,
    notifyAbortProgress: (k) => {
      je(
        p,
        Ne(k, {
          aborted: k
        })
      );
    }
  }), O = L({
    placeholderMap: [],
    cleanupPlaceholders: !1
  });
  if (O)
    return O;
  let M = x ? Vr(
    d,
    P,
    s,
    i.imageSizeMapStore,
    i.FileUploadManager,
    l
  ) : Gr(
    d,
    P,
    t,
    s,
    i.imageSizeMapStore,
    i.FileUploadManager,
    l
  );
  if (M.length === 0)
    return {
      placeholderMap: [],
      results: null,
      imageOxMap: g,
      imageXMap: u,
      failedResults: [],
      errorMessage: ""
    };
  const C = L({
    placeholderMap: M,
    cleanupPlaceholders: !0
  });
  if (C)
    return C;
  a(!0, ""), await Kr(
    M,
    i.FileUploadManager,
    l,
    i.isUploadAborted
  );
  const N = L({
    placeholderMap: M,
    cleanupPlaceholders: !0
  });
  if (N)
    return N;
  const T = M.map((k) => k.file);
  let j = null;
  const X = ao(i);
  try {
    const k = qn(T);
    j = await co(
      X,
      T,
      w,
      p,
      k,
      l,
      v
    );
  } catch (k) {
    const _ = k instanceof Error ? k.message : String(k);
    s(_, 5e3), j = null;
  } finally {
    a(!1);
  }
  const te = L({
    placeholderMap: M,
    cleanupPlaceholders: !0
  });
  if (te)
    return n && (n.value = ""), te;
  await i.tick();
  const oe = await uo({
    results: j,
    placeholderMap: M,
    galleryMode: x,
    currentEditor: t,
    imageOxMap: g,
    imageXMap: u,
    imageSizeMapStore: i.imageSizeMapStore,
    calculateImageHash: i.calculateImageHash,
    getMimeTypeFromUrl: i.getMimeTypeFromUrl,
    devMode: l
  }), H = [...oe.failedResults], B = oe.errorMessage;
  let S = oe.imageServerBlurhashMap;
  if (j && M.length > 0 && (M = []), l && t)
    try {
      await eo({
        editor: t,
        imageServerBlurhashMap: S,
        imageOxMap: g,
        imageXMap: u,
        dependencies: i
      });
    } catch {
      console.warn(`${b} [dev] imetaタグ生成失敗`, {
        stage: "imeta-tag",
        reason: "unexpected"
      });
    }
  return n && (n.value = ""), {
    placeholderMap: M,
    results: j,
    imageOxMap: g,
    imageXMap: u,
    failedResults: H,
    errorMessage: B
  };
}
function ft(e, t = 3e3, n) {
  n.updateUploadState(!1, e), setTimeout(() => n.updateUploadState(!1, ""), t);
}
async function po(e) {
  const {
    files: t,
    currentEditor: n,
    fileInput: o,
    uploadCallbacks: s,
    updateUploadState: a,
    devMode: l,
    imageOxMap: i,
    imageXMap: d,
    dependencies: p = zt(),
    getUploadFailedText: v
  } = e;
  if (!t || t.length === 0) return null;
  const w = await go({
    files: t,
    currentEditor: n,
    fileInput: o,
    uploadCallbacks: s,
    showUploadError: (g, u) => ft(g, u, { updateUploadState: a }),
    updateUploadState: a,
    devMode: l,
    dependencies: p
  });
  return Object.assign(i, w.imageOxMap), Object.assign(d, w.imageXMap), w.failedResults?.length && ft(
    kt(
      w.failedResults,
      v("postComponent.upload_failed"),
      (g) => v(`postComponent.${g}`)
    ) || w.errorMessage,
    5e3,
    { updateUploadState: a }
  ), o && (o.value = ""), w;
}
async function ho(e) {
  const {
    files: t,
    currentEditor: n,
    fileInput: o,
    updateUploadState: s,
    imageOxMap: a,
    imageXMap: l,
    getUploadFailedText: i,
    dependencies: d
  } = e;
  return await po({
    files: t,
    currentEditor: n,
    fileInput: o,
    updateUploadState: s,
    devMode: !1,
    imageOxMap: a,
    imageXMap: l,
    dependencies: d,
    getUploadFailedText: i
  });
}
function fo(e) {
  return !!e && e.length > 0;
}
function mo(e, t, n) {
  e.isUploading = t, e.uploadErrorMessage = n || "";
}
function vo(e) {
  const t = e.target;
  return t?.files?.length ? t.files : void 0;
}
function yo({
  getCurrentEditor: e,
  getFileInput: t,
  getImageOxMap: n,
  getImageXMap: o,
  getUploadFailedText: s,
  updateUploadState: a,
  uploadFiles: l = ho
}) {
  const i = async (p) => fo(p) ? await l({
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
      const v = vo(p);
      v && i(v);
    }
  };
}
let q = Re({
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
function mt() {
  Me !== void 0 && (clearTimeout(Me), Me = void 0);
}
const ae = {
  get value() {
    return q;
  },
  // 秘密鍵ダイアログ
  showSecretKeyDialog: (e, t = []) => {
    q.pendingPost = e, q.pendingEmojiTags = t.map((n) => [...n]), q.showSecretKeyDialog = !0;
  },
  hideSecretKeyDialog: () => {
    q.showSecretKeyDialog = !1, q.pendingPost = "", q.pendingEmojiTags = [];
  },
  getPendingPost: () => q.pendingPost,
  getPendingEmojiTags: () => q.pendingEmojiTags.map((e) => [...e]),
  // 画像フルスクリーン
  showImageFullscreen: (e, t = "", n = "") => {
    q.fullscreenMediaId = n, q.fullscreenImageSrc = e, q.fullscreenImageAlt = t, q.showImageFullscreen = !0;
  },
  hideImageFullscreen: () => {
    q.showImageFullscreen = !1, q.fullscreenMediaId = "", q.fullscreenImageSrc = "", q.fullscreenImageAlt = "";
  },
  // フローティングメッセージ
  showFloatingMessage: (e, t, n, o = 1800) => {
    mt(), q.floatingMessageX = e, q.floatingMessageY = t, q.floatingMessageText = n, q.showFloatingMessage = !0, Me = setTimeout(
      () => {
        q.showFloatingMessage = !1, Me = void 0;
      },
      o
    );
  },
  hideFloatingMessage: () => {
    mt(), q.showFloatingMessage = !1;
  }
};
var wo = ye('<img draggable="false"/>'), So = ye('<div class="video-wrapper svelte-aw59wn"><video controls="" playsinline="" autoplay="" loop="" preload="metadata" class="gallery-video svelte-aw59wn" draggable="false"><track kind="captions"/></video>  <div class="video-drag-overlay svelte-aw59wn" aria-hidden="true"></div></div>', 2), bo = ye('<div role="listitem"><div class="gallery-item-media svelte-aw59wn"><!> <!> <!></div> <!></div>');
const Po = {
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
function Ot(e, t) {
  Ye(t, !0), Xe(e, Po);
  const n = () => Ge(Qe, "$_", o), [o, s] = Ke();
  let a = Y(t, "item", 7), l = Y(t, "index", 7), i = Y(t, "onDelete", 7), d = Y(t, "onDragStart", 7), p = Y(t, "onDragOver", 7), v = Y(t, "onDragEnd", 7), w = Y(t, "onDrop", 7), g = Y(t, "onTouchDragStart", 7), u = Y(t, "disabled", 7, !1), b = J(void 0), P = J(void 0);
  const x = ar();
  nr(() => r(b), {
    onLongPress: (h, R) => {
      u() || g()?.(l(), h, R);
    }
  });
  let z = A(() => !a().isPlaceholder && a().type === "image" && !!a().src), L = A(() => !a().isPlaceholder && a().type === "video" && !!a().src);
  const O = 180, M = 100, C = 180;
  let N = A(() => {
    if (!a().isPlaceholder) return;
    const h = a().dimensions;
    if (h && h.width > 0 && h.height > 0) {
      const R = h.width / h.height, Q = Math.round(O * R);
      return `width: ${Math.max(M, Math.min(C, Q))}px; height: ${O}px;`;
    }
    return `width: ${C}px; height: ${O}px;`;
  });
  function T() {
    a().isPlaceholder || a().type !== "image" || ae.showImageFullscreen(a().src, a().alt || "", a().id);
  }
  function j(h) {
    if (u()) {
      h.preventDefault();
      return;
    }
    if (r(b) && h.dataTransfer) {
      const R = r(b).getBoundingClientRect(), Q = h.clientX - R.left, V = h.clientY - R.top;
      h.dataTransfer.setDragImage(r(b), Q, V);
    }
    d()(l(), h);
  }
  function X(h) {
    h.stopPropagation(), r(P) && (r(P).paused ? r(P).play() : r(P).pause());
  }
  function te(h) {
    h.preventDefault(), !u() && p()(l(), h);
  }
  function oe(h) {
    h.preventDefault(), !u() && w()(l());
  }
  function H(h) {
    a().type !== "image" || a().isPlaceholder || (h.key === "Enter" || h.key === " " || h.key === "Spacebar") && (h.preventDefault(), T());
  }
  var B = {
    get item() {
      return a();
    },
    set item(h) {
      a(h), Z();
    },
    get index() {
      return l();
    },
    set index(h) {
      l(h), Z();
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
      return v();
    },
    set onDragEnd(h) {
      v(h), Z();
    },
    get onDrop() {
      return w();
    },
    set onDrop(h) {
      w(h), Z();
    },
    get onTouchDragStart() {
      return g();
    },
    set onTouchDragStart(h) {
      g(h), Z();
    },
    get disabled() {
      return u();
    },
    set disabled(h = !1) {
      u(h), Z();
    }
  }, S = bo();
  let k;
  var _ = me(S), we = me(_);
  {
    var y = (h) => {
      {
        let R = A(() => a().type === "video" ? n()("videoNode.uploading") : n()("imageNode.uploading"));
        rr(h, {
          get text() {
            return r(R);
          },
          showLoader: !0
        });
      }
    };
    ge(we, (h) => {
      a().isPlaceholder && h(y);
    });
  }
  var f = ie(we, 2);
  {
    var $ = (h) => {
      var R = wo();
      let Q;
      ve(() => {
        se(R, "src", a().src), se(R, "alt", a().alt || ""), Q = Ce(R, 1, "gallery-image svelte-aw59wn", null, Q, { "image-loading": !x.isLoaded });
      }), ue("load", R, function(...V) {
        x.handleLoad?.apply(this, V);
      }), ue("error", R, function(...V) {
        x.handleError?.apply(this, V);
      }), fe("contextmenu", R, (V) => V.preventDefault()), Ur(R), he(h, R);
    };
    ge(f, (h) => {
      r(z) && h($);
    });
  }
  var W = ie(f, 2);
  {
    var U = (h) => {
      var R = So(), Q = me(R);
      Q.muted = !0, be(Q, (Pe) => E(P, Pe), () => r(P));
      var V = ie(Q, 2);
      pe(R), ve(() => {
        se(Q, "src", a().src), se(V, "draggable", !u());
      }), fe("contextmenu", Q, (Pe) => Pe.preventDefault()), ue("dragstart", V, j), fe("click", V, X), he(h, R);
    };
    ge(W, (h) => {
      r(L) && h(U);
    });
  }
  pe(_);
  var G = ie(_, 2);
  {
    var K = (h) => {
      {
        let R = A(() => n()("imageContextMenu.delete")), Q = A(() => n()("imageContextMenu.copyUrl")), V = A(() => n()("imageContextMenu.copySuccess"));
        or(h, {
          get src() {
            return a().src;
          },
          onDelete: () => i()(a().id),
          get deleteAriaLabel() {
            return r(R);
          },
          get copyAriaLabel() {
            return r(Q);
          },
          get copySuccessMessage() {
            return r(V);
          },
          layout: "gallery",
          get deleteDisabled() {
            return u();
          }
        });
      }
    };
    ge(G, (h) => {
      a().isPlaceholder || h(K);
    });
  }
  pe(S), be(S, (h) => E(b, h), () => r(b)), ve(() => {
    k = Ce(S, 1, "gallery-item svelte-aw59wn", null, k, {
      "is-placeholder": a().isPlaceholder,
      "is-disabled": u()
    }), se(S, "draggable", !u() && (a().type !== "video" || a().isPlaceholder)), It(_, r(N)), se(_, "role", a().type === "image" && !a().isPlaceholder ? "button" : void 0), se(_, "tabindex", a().type === "image" && !a().isPlaceholder ? 0 : void 0), se(_, "aria-label", a().alt || a().src);
  }), ue("dragstart", S, j), ue("dragover", S, te), ue("drop", S, oe), ue("dragend", S, () => v()()), fe("click", _, function(...h) {
    (a().type === "image" && !a().isPlaceholder ? T : void 0)?.apply(this, h);
  }), fe("keydown", _, H), he(e, S);
  var le = Ze(B);
  return s(), le;
}
Mt(["click", "keydown", "contextmenu"]);
Ve(
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
function Eo(e) {
  return Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
}
function xo(e, t) {
  const n = e.scrollHeight - e.clientHeight;
  if (n <= 1)
    return !1;
  const o = e.scrollTop <= 0, s = e.scrollTop >= n - 1;
  return t > 0 ? !s : t < 0 ? !o : !1;
}
function Io(e, t) {
  const n = e.scrollWidth - e.clientWidth;
  if (n <= 1)
    return !1;
  const o = e.scrollLeft <= 0, s = e.scrollLeft >= n - 1;
  return t > 0 ? !s : t < 0 ? !o : !1;
}
function Fo(e, t, n = null) {
  if (n && xo(n, t.deltaY))
    return !1;
  const o = Eo(t);
  if (!Io(e, o))
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
var Mo = ye("<div><!></div>"), Co = ye('<div role="list"></div>');
const ko = {
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
function Wt(e, t) {
  Ye(t, !0), Xe(e, ko);
  const n = () => Ge(Qe, "$_", o), [o, s] = Ke();
  let a = J(-1), l = J(-1), i = J(-1), d = J(-1), p = null, v = 60, w = 60, g = J(void 0), u = null, b = A(() => ee.items), P = A(() => de.postStatus.sending), x = A(() => {
    const y = r(a) !== -1 ? r(a) : r(i), f = r(a) !== -1 ? r(l) : r(d);
    return y === -1 || f === -1 || f === y || f === y + 1 ? -1 : f;
  });
  function z(y, f) {
    if (r(P)) {
      f.preventDefault();
      return;
    }
    E(a, y, !0), f.dataTransfer?.setData("text/plain", String(y)), f.dataTransfer && (f.dataTransfer.effectAllowed = "move");
  }
  function L(y, f) {
    if (f.preventDefault(), r(P)) return;
    const W = r(g)?.querySelectorAll(".gallery-item-wrapper")?.[y];
    if (W) {
      const U = W.getBoundingClientRect();
      E(l, f.clientX < U.left + U.width / 2 ? y : y + 1, !0);
    } else
      E(l, y, !0);
  }
  function O() {
    X(), E(a, -1), E(l, -1);
  }
  function M(y) {
  }
  function C(y) {
    if (r(a) === -1) return;
    if (y.preventDefault(), r(P)) {
      X(), E(l, -1);
      return;
    }
    const f = r(g)?.querySelectorAll(".gallery-item-wrapper");
    if (f && f.length > 0) {
      const $ = f[0].getBoundingClientRect(), W = f[f.length - 1].getBoundingClientRect();
      y.clientX < $.left ? E(l, 0) : y.clientX > W.right && E(l, r(b).length, !0);
    }
    if (r(g)) {
      const $ = r(g).getBoundingClientRect();
      y.clientX - $.left < Ie ? j("left", y.clientX) : $.right - y.clientX < Ie ? j("right", y.clientX) : X();
    }
  }
  function N(y) {
    if (y.preventDefault(), X(), r(P)) {
      E(a, -1), E(l, -1);
      return;
    }
    const f = r(l);
    if (r(a) !== -1 && f !== -1 && f !== r(a) && f !== r(a) + 1) {
      const $ = r(a) < f ? f - 1 : f;
      ee.reorderItems(r(a), $);
    }
    E(a, -1), E(l, -1);
  }
  function T(y) {
    r(P) || ee.removeItem(y);
  }
  function j(y, f) {
    if (!r(g)) return;
    u !== null && (cancelAnimationFrame(u), u = null);
    const $ = r(g).getBoundingClientRect(), W = y === "left" ? f - $.left : $.right - f, U = Math.max(0, Math.min(1, W / Ie)), G = ut + (ir - ut) * (1 - U), K = () => {
      if (!r(g)) return;
      const le = r(g).scrollWidth - r(g).clientWidth;
      y === "left" && r(g).scrollLeft > 0 ? (r(g).scrollLeft = Math.max(0, r(g).scrollLeft - G), u = requestAnimationFrame(K)) : y === "right" && r(g).scrollLeft < le ? (r(g).scrollLeft = Math.min(le, r(g).scrollLeft + G), u = requestAnimationFrame(K)) : u = null;
    };
    u = requestAnimationFrame(K);
  }
  function X() {
    u !== null && (cancelAnimationFrame(u), u = null);
  }
  function te(y, f, $) {
    if (r(P)) return;
    E(i, y, !0), B();
    const W = r(g)?.querySelectorAll(".gallery-item-wrapper")[y];
    if (W) {
      const U = W.getBoundingClientRect(), G = 120, K = Math.min(G / U.width, G / U.height);
      v = U.width * K / 2, w = U.height * K / 2, p = W.cloneNode(!0), p.style.cssText = `
                position: fixed;
                left: ${f - v}px;
                top: ${$ - w}px;
                width: ${U.width}px;
                height: ${U.height}px;
                transform-origin: top left;
                transform: scale(${K});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
            `, Or().overlayTarget.appendChild(p);
    }
    document.addEventListener("touchmove", oe, { passive: !1 }), document.addEventListener("touchend", H, { passive: !1 });
  }
  function oe(y) {
    if (r(i) === -1 || y.touches.length !== 1) return;
    if (y.preventDefault(), r(P)) {
      X(), E(d, -1);
      return;
    }
    const f = y.touches[0];
    p && (p.style.left = `${f.clientX - v}px`, p.style.top = `${f.clientY - w}px`), p && (p.style.display = "none");
    const $ = document.elementFromPoint(f.clientX, f.clientY);
    p && (p.style.display = "");
    const W = $?.closest(".gallery-item-wrapper");
    if (W && r(g)) {
      const U = r(g).querySelectorAll(".gallery-item-wrapper"), G = Array.from(U).indexOf(W);
      if (G !== -1) {
        const K = W.getBoundingClientRect();
        E(d, f.clientX < K.left + K.width / 2 ? G : G + 1, !0);
      }
    } else if (r(g)) {
      const U = r(g).querySelectorAll(".gallery-item-wrapper");
      if (U.length > 0) {
        const G = U[0].getBoundingClientRect(), K = U[U.length - 1].getBoundingClientRect();
        f.clientX <= G.left ? E(d, 0) : f.clientX >= K.right && E(d, r(b).length, !0);
      }
    }
    if (r(g)) {
      const U = r(g).getBoundingClientRect();
      f.clientX - U.left < Ie ? j("left", f.clientX) : U.right - f.clientX < Ie ? j("right", f.clientX) : X();
    }
  }
  function H() {
    if (document.removeEventListener("touchmove", oe), document.removeEventListener("touchend", H), X(), r(P)) {
      B(), E(i, -1), E(d, -1);
      return;
    }
    const y = r(d);
    if (r(i) !== -1 && y !== -1 && y !== r(i) && y !== r(i) + 1) {
      const f = r(i) < y ? y - 1 : y;
      ee.reorderItems(r(i), f);
    }
    B(), E(i, -1), E(d, -1);
  }
  function B() {
    p && (p.remove(), p = null);
  }
  function S(y) {
    if (!r(g)) return;
    const f = r(g).closest(".composer-scroll-region");
    Fo(r(g), y, f instanceof HTMLElement ? f : null) && y.preventDefault();
  }
  ce(() => {
    if (r(g))
      return r(g).addEventListener("wheel", S, { passive: !1 }), () => {
        r(g)?.removeEventListener("wheel", S);
      };
  });
  var k = zr(), _ = Ct(k);
  {
    var we = (y) => {
      var f = Co();
      let $;
      sr(f, 23, () => r(b), (W) => W.id, (W, U, G) => {
        var K = Mo();
        let le;
        var h = me(K);
        Ot(h, {
          get item() {
            return r(U);
          },
          get index() {
            return r(G);
          },
          onDelete: T,
          onDragStart: z,
          onDragOver: L,
          onDragEnd: O,
          onDrop: M,
          onTouchDragStart: te,
          get disabled() {
            return r(P);
          }
        }), pe(K), ve(() => le = Ce(K, 1, "gallery-item-wrapper svelte-w2vv8k", null, le, {
          "insert-bar-left": r(x) === r(G),
          "insert-bar-right": r(x) === r(b).length && r(G) === r(b).length - 1
        })), he(W, K);
      }), pe(f), be(f, (W) => E(g, W), () => r(g)), ve(
        (W) => {
          $ = Ce(f, 1, "media-gallery svelte-w2vv8k", null, $, { sending: r(P) }), se(f, "aria-label", W);
        },
        [() => n()("mediaGallery.aria_label") || "メディアギャラリー"]
      ), ue("dragover", f, C), ue("drop", f, N), he(y, f);
    };
    ge(_, (y) => {
      r(b).length > 0 && y(we);
    });
  }
  he(e, k), Ze(), s();
}
Ve(Wt, {}, [], [], { mode: "open" });
function $e(e) {
  if (!e || !e.types) return !1;
  try {
    return Array.from(e.types).some((t) => t === "application/x-tiptap-node");
  } catch {
    return !1;
  }
}
function Bt(e) {
  if (!e) return !1;
  try {
    return Array.from(e.types).includes("Files") || e.files && e.files.length > 0;
  } catch {
    return !!(e.files && e.files.length > 0);
  }
}
function ke(e) {
  const t = e.__postStatus;
  return (typeof t == "function" ? t() : t)?.sending === !0;
}
function _o(e) {
  let t = J(!1);
  function n(a) {
    if (ke(e)) {
      a.preventDefault(), E(t, !1), e.classList.remove("drag-over");
      return;
    }
    const l = a.dataTransfer, i = $e(l);
    Bt(l) && !i ? (a.preventDefault(), r(t) || (E(t, !0), e.classList.add("drag-over"))) : r(t) && (E(t, !1), e.classList.remove("drag-over"));
  }
  function o(a) {
    r(t) && (E(t, !1), e.classList.remove("drag-over"));
  }
  async function s(a) {
    if (E(t, !1), e.classList.remove("drag-over"), ke(e)) {
      a.preventDefault();
      return;
    }
    const l = a.dataTransfer;
    $e(l) || l?.files && l.files.length > 0 && typeof e.__uploadFiles == "function" && (a.preventDefault(), e.__uploadFiles(l.files));
  }
  return e.addEventListener("dragover", n), e.addEventListener("dragleave", o), e.addEventListener("drop", s), {
    destroy() {
      e.removeEventListener("dragover", n), e.removeEventListener("dragleave", o), e.removeEventListener("drop", s);
    }
  };
}
function To(e, t) {
  const n = _o(e);
  function o(l) {
    if (ke(e)) {
      l.preventDefault(), t.dragOver(!1);
      return;
    }
    const i = l.dataTransfer, d = $e(i);
    Bt(i) && !d ? t.dragOver(!0) : t.dragOver(!1);
  }
  function s(l) {
    t.dragOver(!1);
  }
  function a(l) {
    t.dragOver(!1), ke(e) && l.preventDefault();
  }
  return e.addEventListener("dragover", o), e.addEventListener("dragleave", s), e.addEventListener("drop", a), {
    destroy() {
      n?.destroy?.(), e.removeEventListener("dragover", o), e.removeEventListener("dragleave", s), e.removeEventListener("drop", a);
    }
  };
}
function Do(e) {
  function t(n) {
    if (ke(e)) {
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
function Ao(e) {
  function t(o) {
    const s = o.target;
    if (s && (s.closest('.editor-image-button[data-dragging="true"]') || s.closest('.custom-emoji-drag-target[data-dragging="true"]'))) {
      const a = o.touches[0], l = 120, i = gt.querySelector(".tiptap-editor");
      if (i) {
        const d = i.getBoundingClientRect(), p = a.clientY < d.top + l, v = a.clientY > d.bottom - l;
        if (!p && !v)
          return o.preventDefault(), !1;
      }
    }
  }
  function n(o) {
    const s = gt.querySelectorAll(".drop-zone-indicator");
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
function Ro(e) {
  function t(n) {
    if ((n.ctrlKey || n.metaKey) && (n.key === "Enter" || n.key === "NumpadEnter")) {
      n.preventDefault();
      const o = e.__currentEditor, s = typeof o == "function" ? o() : o, a = e.__hasStoredKey, l = typeof a == "function" ? a() : a, i = e.__postStatus, d = typeof i == "function" ? i() : i, p = s ? lr(s) : "";
      !d?.sending && p.trim() && l && e.__submitPost?.();
    }
  }
  return e.addEventListener("keydown", t), {
    destroy() {
      e.removeEventListener("keydown", t);
    }
  };
}
function Lo(e) {
  let t = !1;
  return e?.descendants((n) => {
    if (t) return !1;
    const o = n.type?.name;
    (o === "image" || o === "video") && (t = !0);
  }), t;
}
function Ho(e) {
  const { currentEditor: t, editorContainerEl: n, callbacks: o } = e, s = (i) => {
    const p = i.detail.plainText, v = t ? Lo(t.state?.doc) : !1;
    o.onContentUpdate?.(p, v);
  }, a = (i) => {
    const d = i;
    o.onImageFullscreenRequest?.(d.detail.src, d.detail.alt || "", d.detail.mediaId);
  }, l = (i) => {
    const p = i?.detail?.pos;
    if (p != null && !(!t || !t.view)) {
      try {
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || t.view.focus();
        const v = yt.create(t.state.doc, p);
        t.view.dispatch(t.state.tr.setSelection(v).scrollIntoView());
      } catch (v) {
        console.warn("select-image-node handler failed:", v);
      }
      o.onSelectImageNode?.(p);
    }
  };
  return window.addEventListener("editor-content-changed", s), window.addEventListener("image-fullscreen-request", a), window.addEventListener("select-image-node", l), n && (n.addEventListener("image-fullscreen-request", a), n.addEventListener("select-image-node", l)), {
    handleContentUpdate: s,
    handleImageFullscreenRequest: a,
    handleSelectImageNode: l
  };
}
function Uo(e, t) {
  window.removeEventListener("editor-content-changed", e.handleContentUpdate), window.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), window.removeEventListener("select-image-node", e.handleSelectImageNode), t && (t.removeEventListener("image-fullscreen-request", e.handleImageFullscreenRequest), t.removeEventListener("select-image-node", e.handleSelectImageNode));
}
function zo() {
  return {
    sending: !0,
    success: !1,
    error: !1,
    message: "",
    completed: !1
  };
}
function Oo(e) {
  return {
    sending: !1,
    success: !0,
    error: !1,
    message: (e?.rejectedRelays?.length ?? 0) > 0 || (e?.timedOutRelays?.length ?? 0) > 0 ? "postComponent.post_partial_success" : "postComponent.post_success",
    completed: !0
  };
}
function Wo(e) {
  return {
    sending: !1,
    success: !1,
    error: !0,
    message: e || "postComponent.post_error",
    completed: !1
  };
}
function Bo({
  updatePostStatus: e,
  clearContentAfterSuccess: t,
  onPostSuccess: n
}) {
  return {
    markSending: () => {
      e(zo());
    },
    markSuccess: (o) => {
      e(Oo(o)), t(), n?.(o);
    },
    markFailure: (o) => {
      e(Wo(o));
    }
  };
}
async function No(e) {
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
function vt(e) {
  if (e.dimensions && e.dimensions.width > 0 && e.dimensions.height > 0)
    return {
      width: e.dimensions.width,
      height: e.dimensions.height
    };
  const t = wt(e.dim);
  return t || {};
}
function jo(e) {
  if (!e.mediaFreePlacement)
    return e.galleryItems.filter((n) => !n.isPlaceholder).map((n) => {
      const o = vt({
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
      const o = vt({
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
function qo(e, t, n) {
  if (t) {
    const o = e.findIndex((s) => s.id === t);
    if (o >= 0)
      return o;
  }
  return n ? e.findIndex((o) => o.src === n) : -1;
}
function $o(e, t) {
  return e[t];
}
function Xo(e) {
  const t = [];
  return e.state.doc.descendants((n, o) => {
    (n.type.name === "image" || n.type.name === "video") && !n.attrs.isPlaceholder && t.push({ node: n, pos: o });
  }), t;
}
function Ko(e) {
  const t = Xo(e.currentEditor);
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
function Go(e) {
  if (e.items.length === 0)
    return {
      imageOxMap: {},
      imageXMap: {},
      hadItems: !1
    };
  const { schema: t } = e.currentEditor.state;
  let n = e.currentEditor.state.tr, o = e.currentEditor.state.doc.content.size;
  const s = {}, a = {};
  return e.items.forEach((l) => {
    if (l.isPlaceholder)
      return;
    const i = l.src;
    if (l.type === "image" && t.nodes.image) {
      const d = t.nodes.image.create({
        src: i,
        alt: l.alt ?? "Image",
        blurhash: l.blurhash ?? null,
        dim: l.dim ?? null,
        size: l.size ?? null,
        uploadProtocol: l.uploadProtocol ?? null
      });
      n = n.insert(o, d), o += d.nodeSize;
    } else if (l.type === "video" && t.nodes.video) {
      const d = t.nodes.video.create({ src: i });
      n = n.insert(o, d), o += d.nodeSize;
    }
    l.ox && (s[i] = l.ox), l.x && (a[i] = l.x);
  }), e.currentEditor.view.dispatch(n), {
    imageOxMap: s,
    imageXMap: a,
    hadItems: !0
  };
}
async function Qo(e) {
  const {
    input: t,
    postHistoryRepositoryImpl: n = Ft,
    postMediaCacheRepositoryImpl: o = dr
  } = e;
  await n.putPostedEvent(t);
  const s = cr(t.event).map((a) => a.url).filter(Boolean);
  s.length !== 0 && await o.linkEventIdByUrls({
    eventId: t.event.id,
    urls: s
  });
}
function Vo(e) {
  const {
    placeholderText: t,
    editorContainerEl: n,
    hasStoredKey: o,
    submitPost: s,
    onCustomEmojiSelect: a,
    uploadFiles: l,
    eventCallbacks: i
  } = e;
  ur.value = t;
  const d = gr({
    placeholderText: t,
    onSubmitPost: s,
    onCustomEmojiSelect: a,
    onCreate: (g) => {
      He.set(g);
    }
  });
  let p = null;
  const v = d.subscribe((g) => {
    p = g;
  }), w = Ho({
    currentEditor: p,
    editorContainerEl: n,
    callbacks: i
  });
  return pr(s), n && Object.assign(n, {
    __uploadFiles: l,
    __currentEditor: () => p,
    __hasStoredKey: () => o,
    __postStatus: () => de.postStatus,
    __submitPost: s
  }), { editor: d, unsubscribe: v, handlers: w };
}
function Yo(e) {
  const {
    unsubscribe: t,
    componentUnsubscribe: n,
    handlers: o,
    currentEditor: s,
    editorContainerEl: a,
    submitPost: l
  } = e;
  Uo(o, a), He.value === s && He.set(null), hr(l), n(), t(), s && !s.isDestroyed && s.destroy(), a && (delete a.__uploadFiles, delete a.__currentEditor, delete a.__hasStoredKey, delete a.__postStatus, delete a.__submitPost);
}
function Zo(e, t) {
  const n = e.view.dom;
  if (fr() && document.activeElement !== n) {
    e.commands.insertCustomEmoji(t);
    return;
  }
  e.chain().focus().insertCustomEmoji(t).run();
}
var Jo = ye('<div class="upload-error svelte-15ticnd"> </div>'), ea = ye('<div class="svelte-15ticnd"> </div>'), ta = ye('<div class="post-container svelte-15ticnd" data-post-editor-root=""><div role="textbox" tabindex="-1"><!></div> <!> <input type="file" accept="image/*,video/*" multiple="" style="display: none;" class="svelte-15ticnd"/> <!></div> <!> <!> <!>', 1);
const na = {
  hash: "svelte-15ticnd",
  code: `.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {width:100%;flex:1 1 auto;}.post-container.svelte-15ticnd,
  .editor-container.svelte-15ticnd,
  .editor-content {display:flex;flex-direction:column;}.post-container.svelte-15ticnd,
  .editor-content,
  .tiptap-editor {min-height:0;}.editor-content,
  .tiptap-editor {height:100%;}.post-container.svelte-15ticnd {max-width:800px;align-items:stretch;overflow:visible;}.upload-error.svelte-15ticnd {color:#c62828;font-size:0.9rem;margin-bottom:10px;width:100%;text-align:left;}.editor-container.svelte-15ticnd {min-height:var(--post-editor-min-height, 92px);height:var(--post-editor-target-height, auto);max-height:var(--post-editor-target-height, auto);position:relative;cursor:text;outline:none;background:var(--bg-input);-webkit-tap-highlight-color:transparent;overflow:hidden;}.editor-container.sending.svelte-15ticnd {background:color-mix(in srgb, var(--bg-input) 82%, var(--surface-button) 18%);cursor:not-allowed;}.editor-container.sending.svelte-15ticnd .tiptap-editor {cursor:not-allowed;opacity:0.72;}.editor-container.sending.svelte-15ticnd .editor-image-button,
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
function ra(e, t) {
  Ye(t, !0), Xe(e, na);
  const n = () => Ge(Qe, "$_", o), [o, s] = Ke();
  let a = Y(t, "rxNostr", 7), l = Y(t, "hasStoredKey", 7), i = Y(t, "onPostSuccess", 7), d = Y(t, "availableComposerHeight", 7, Se), p = Y(t, "minEditorHeight", 7, Se), v = Y(t, "onCustomEmojiSelect", 7), w = Y(t, "notificationPort", 7), g = J(null), u = J(null), b = J(!1), P = J(void 0), x = J(void 0), z = J(Re({})), L = J(Re({})), O = A(() => Le.value), M = A(() => de.postStatus), C = A(() => de.uploadErrorMessage), N = null, T = null, j = null, X = null, te = J(Re(Se)), oe = A(() => `--post-editor-min-height: ${p()}px; --post-editor-target-height: ${r(te)}px;`), H = A(() => n()("postComponent.enter_your_text") || "テキストを入力してください");
  ce(() => {
    r(u), mr(r(H));
  }), ce(() => {
    const c = r(u), m = !r(M).sending;
    c && c.isEditable !== m && c.setEditable(m, !1);
  });
  function B() {
    const c = p();
    if (!N || !T) {
      E(te, c, !0);
      return;
    }
    const m = Array.from(N.children).reduce(
      (F, D) => D === T ? F : F + Tr(D),
      0
    ), I = Dr({
      availableComposerHeight: d(),
      nonEditorHeight: m,
      minHeight: c
    });
    r(te) !== I && E(te, I, !0);
  }
  function S(c) {
    if (r(M).sending) {
      c.preventDefault();
      return;
    }
    !(c.target instanceof HTMLElement) || !r(u) || kr(c.target) || r(u).commands.focus("end");
  }
  function k(c) {
    if (r(M).sending) {
      c.preventDefault();
      return;
    }
    !r(u) || c.currentTarget !== c.target || c.key !== "Enter" && c.key !== " " || (c.preventDefault(), r(u).commands.focus("end"));
  }
  let _ = A(() => ae.value), we = A(() => r(_).showSecretKeyDialog), y = A(() => r(_).showImageFullscreen), f = A(() => r(_).fullscreenMediaId), $ = A(() => r(_).fullscreenImageSrc), W = A(() => r(_).fullscreenImageAlt), U = A(() => r(_).showFloatingMessage), G = A(() => r(_).floatingMessageX), K = A(() => r(_).floatingMessageY), le = A(() => r(_).floatingMessageText);
  ce(() => {
    a() && (r(x) ? r(x).setRxNostr(a()) : E(
      x,
      new Jr(a(), {
        getNip46SignerForSessionFn: (c) => wr.getSignerForSession(c),
        getParentClientSignerFn: () => yr.getSigner(),
        channelContextState: vr,
        replyQuoteState: bt,
        replyQuoteService: new Ae(),
        clearReplyQuoteFn: Et,
        savePostHistoryFn: (c) => Qo({ input: c, postHistoryRepositoryImpl: Ft }),
        notificationPort: w()
      }),
      !0
    ));
  });
  const h = yo({
    getCurrentEditor: () => r(u),
    getFileInput: () => r(P),
    getImageOxMap: () => r(z),
    getImageXMap: () => r(L),
    getUploadFailedText: (c) => n()(c),
    updateUploadState: (c, m) => {
      mo(de, c, m);
    }
  }), R = Bo({
    updatePostStatus: pt,
    clearContentAfterSuccess: et,
    onPostSuccess: (c) => i()?.(c)
  });
  ce(() => {
    if (d(), p(), r(O), r(C), r(u), r(O) || ee.items.length, typeof window > "u") {
      E(te, Se, !0);
      return;
    }
    const c = window.requestAnimationFrame(() => {
      B();
    });
    return () => {
      window.cancelAnimationFrame(c);
    };
  }), ce(() => {
    if (d(), p(), r(u), r(O), r(C), !N || typeof ResizeObserver > "u")
      return;
    let c = null;
    const m = () => {
      c === null && (c = window.requestAnimationFrame(() => {
        c = null, B();
      }));
    }, I = new ResizeObserver(m);
    m(), I.observe(N);
    for (const F of Array.from(N.children))
      F !== T && I.observe(F);
    return () => {
      I.disconnect(), c !== null && window.cancelAnimationFrame(c);
    };
  }), Sr(() => {
    j = Vo({
      placeholderText: r(H),
      editorContainerEl: T,
      currentEditor: r(u),
      hasStoredKey: l(),
      submitPost: Oe,
      onCustomEmojiSelect: v(),
      uploadFiles: (m) => {
        h.performUpload(m);
      },
      eventCallbacks: {
        onContentUpdate: _r,
        onImageFullscreenRequest: (m, I, F) => {
          ae.showImageFullscreen(m, I, F || "");
        },
        onSelectImageNode: (m) => {
        }
      }
    }), E(g, j.editor, !0), X = r(g).subscribe((m) => {
      E(u, m, !0), He.set(m);
    });
    const c = (m) => {
      const I = m, { src: F, alt: D, mediaId: ne } = I.detail;
      ae.showImageFullscreen(F, D, ne || "");
    };
    return window.addEventListener("image-fullscreen-request", c), () => {
      window.removeEventListener("image-fullscreen-request", c), j && (Yo({
        unsubscribe: j.unsubscribe,
        componentUnsubscribe: X ?? (() => {
        }),
        handlers: j.handlers,
        currentEditor: r(u),
        editorContainerEl: T,
        submitPost: Oe
      }), X = null);
    };
  });
  const Q = h.handleFileSelect;
  async function V(c) {
    return await h.performUpload(c);
  }
  function Pe(c) {
    if (!r(u) || !c) return;
    const m = r(
      u
      // nullチェック済みのローカル変数
    ), F = c.split(`
`).map((D) => ({
      type: "paragraph",
      content: D ? [{ type: "text", text: D }] : void 0
    }));
    m.commands.setContent({ type: "doc", content: F }), m.commands.focus("end");
  }
  function Nt(c) {
    if (!r(u) || !c) return !1;
    const I = c.split(`
`).map((F) => ({
      type: "paragraph",
      content: F ? [{ type: "text", text: F }] : void 0
    }));
    return r(u).isEmpty ? r(u).commands.setContent({ type: "doc", content: I }) : r(u).chain().focus("end").insertContent([{ type: "paragraph" }, ...I]).run(), r(u).commands.focus("end"), !0;
  }
  function jt(c) {
    if (!r(u) || !c) return;
    const m = Er(c);
    r(u).commands.setContent(m || "<p></p>"), r(u).commands.focus("end");
  }
  function qt() {
    return r(u) ? r(u).getHTML() : "";
  }
  function $t(c) {
    if (!r(u) || c.length === 0) return;
    const { schema: m } = r(u).state;
    let I = r(u).state.tr, F = r(u).state.doc.content.size;
    c.forEach((D) => {
      if (D.isPlaceholder) return;
      const ne = D.src;
      if (D.type === "image" && m.nodes.image) {
        const xe = m.nodes.image.create({
          src: ne,
          alt: D.alt ?? "Image",
          blurhash: D.blurhash ?? null,
          dim: D.dim ?? null,
          size: D.size ?? null,
          uploadProtocol: D.uploadProtocol ?? null
        });
        I = I.insert(F, xe), F += xe.nodeSize, D.ox && E(z, { ...r(z), [ne]: D.ox }, !0), D.x && E(L, { ...r(L), [ne]: D.x }, !0);
      } else if (D.type === "video" && m.nodes.video) {
        const xe = m.nodes.video.create({ src: ne });
        I = I.insert(F, xe), F += xe.nodeSize;
      }
    }), r(u).view.dispatch(I), r(u).commands.focus("end");
  }
  function Xt(c) {
    !r(u) || r(M).sending || Zo(r(u), c);
  }
  function ze() {
    if (!r(u)) return;
    Mr(r(u).view.dom) || Cr(r(u));
  }
  function Je(c) {
    if (!r(u)) return;
    ze();
    const { state: m, view: I } = r(u), F = c < 0 ? m.selection.from : m.selection.to, D = Math.max(0, Math.min(m.doc.content.size, F + c));
    if (D === F) return;
    const ne = Fr.near(m.doc.resolve(D), c);
    I.dispatch(m.tr.setSelection(ne).scrollIntoView().setMeta("addToHistory", !1));
  }
  function Kt() {
    Je(-1);
  }
  function Gt() {
    Je(1);
  }
  function Qt() {
    if (!r(u)) return;
    ze();
    const { state: c, view: m } = r(u), { selection: I } = c;
    if (!I.empty) {
      r(u).commands.deleteSelection();
      return;
    }
    const D = I.$from.nodeBefore;
    if (D) {
      const ne = D.isText ? Array.from(D.text ?? "").at(-1)?.length ?? 0 : D.nodeSize;
      ne > 0 && m.dispatch(c.tr.delete(I.from - ne, I.from).scrollIntoView());
      return;
    }
    r(u).commands.first(({ commands: ne }) => [
      () => ne.joinBackward(),
      () => ne.selectNodeBackward()
    ]);
  }
  function Vt() {
    r(u) && (ze(), r(u).commands.keyboardShortcut("Enter"));
  }
  async function Oe() {
    if (!r(x) || !r(u)) return;
    const c = r(x).preparePostPayload(r(u));
    if (xr(c.content)) {
      ae.showSecretKeyDialog(c.content, c.emojiTags);
      return;
    }
    await r(x).performPostSubmission(r(u), r(z), r(L), R.markSending, R.markSuccess, R.markFailure);
  }
  function Yt() {
    r(x) && r(u) && r(x).resetPostContent(r(u));
  }
  function et() {
    r(x) && r(u) && r(x).clearContentAfterSuccess(r(u));
  }
  async function Zt() {
    const c = ae.getPendingPost(), m = ae.getPendingEmojiTags();
    ae.hideSecretKeyDialog(), r(x) && r(u) && await No({
      postManager: r(x),
      currentEditor: r(u),
      imageOxMap: r(z),
      imageXMap: r(L),
      pendingPost: c,
      pendingEmojiTags: m,
      onStart: R.markSending,
      onSuccess: R.markSuccess,
      onFailure: R.markFailure
    });
  }
  const Jt = ae.hideSecretKeyDialog, en = ae.hideImageFullscreen;
  let We = A(() => jo({
    mediaFreePlacement: r(O),
    galleryItems: ee.items,
    currentEditor: r(u)
  })), tn = A(() => qo(r(We), r(f), r($)));
  function nn(c) {
    const m = $o(r(We), c);
    m && ae.showImageFullscreen(m.src, m.alt ?? "", m.id ?? "");
  }
  ce(() => {
    r(u) && r(x) && r(x).preparePostContent(r(u)) !== de.content && r(M).error && pt({ ...r(M), error: !1, message: "" });
  });
  function rn() {
    r(P)?.click();
  }
  ce(() => {
    const c = ee.items.some((F) => !F.isPlaceholder), m = !!de.content.trim(), I = de.hasImage;
    de.canPost = m || I || c;
  });
  let tt = !0;
  ce(() => {
    const c = !Le.value;
    if (tt) {
      tt = !1;
      return;
    }
    if (!r(u)) return;
    const m = r(u);
    if (c)
      Fe(() => Ko({
        currentEditor: m,
        imageOxMap: r(z),
        imageXMap: r(L),
        addGalleryItem: (F) => ee.addItem(F),
        createMediaItemId: Ir
      })) && Fe(() => {
        E(z, {}, !0), E(L, {}, !0);
      });
    else {
      const I = Fe(() => ee.getItems()), F = Go({ currentEditor: m, items: I });
      F.hadItems && Fe(() => {
        E(z, F.imageOxMap, !0), E(L, F.imageXMap, !0);
      }), Fe(() => ee.clearAll());
    }
  });
  var on = {
    uploadFiles: V,
    insertTextContent: Pe,
    appendSharedTextContent: Nt,
    loadDraftContent: jt,
    getEditorHtml: qt,
    appendMediaToEditor: $t,
    insertCustomEmoji: Xt,
    moveCaretLeft: Kt,
    moveCaretRight: Gt,
    deleteBackward: Qt,
    insertLineBreak: Vt,
    submitPost: Oe,
    resetPostContent: Yt,
    clearContentAfterSuccess: et,
    openFileDialog: rn,
    get rxNostr() {
      return a();
    },
    set rxNostr(c) {
      a(c), Z();
    },
    get hasStoredKey() {
      return l();
    },
    set hasStoredKey(c) {
      l(c), Z();
    },
    get onPostSuccess() {
      return i();
    },
    set onPostSuccess(c) {
      i(c), Z();
    },
    get availableComposerHeight() {
      return d();
    },
    set availableComposerHeight(c = Se) {
      d(c), Z();
    },
    get minEditorHeight() {
      return p();
    },
    set minEditorHeight(c = Se) {
      p(c), Z();
    },
    get onCustomEmojiSelect() {
      return v();
    },
    set onCustomEmojiSelect(c) {
      v(c), Z();
    },
    get notificationPort() {
      return w();
    },
    set notificationPort(c) {
      w(c), Z();
    }
  }, nt = ta(), Ee = Ct(nt), re = me(Ee);
  let rt;
  var an = me(re);
  {
    var sn = (c) => {
      Ar(c, {
        get editor() {
          return r(u);
        },
        class: "editor-content"
      });
    };
    ge(an, (c) => {
      r(g) && r(u) && c(sn);
    });
  }
  pe(re), Te(re, (c, m) => To?.(c, m), () => ({ dragOver: (c) => E(b, c, !0) })), Te(re, (c) => Do?.(c)), Te(re, (c) => Ao?.(c)), Te(re, (c) => Ro?.(c)), be(re, (c) => T = c, () => T);
  var ot = ie(re, 2);
  {
    var ln = (c) => {
      Wt(c, {});
    };
    ge(ot, (c) => {
      r(O) || c(ln);
    });
  }
  var Be = ie(ot, 2);
  be(Be, (c) => E(P, c), () => r(P));
  var cn = ie(Be, 2);
  {
    var dn = (c) => {
      var m = Jo(), I = me(m, !0);
      pe(m), ve(() => ht(I, r(C))), he(c, m);
    };
    ge(cn, (c) => {
      r(C) && c(dn);
    });
  }
  pe(Ee), be(Ee, (c) => N = c, () => N);
  var at = ie(Ee, 2);
  {
    let c = A(() => n()("postComponent.warning")), m = A(() => n()("postComponent.secret_key_detected")), I = A(() => n()("postComponent.post")), F = A(() => n()("postComponent.cancel"));
    br(at, {
      get open() {
        return r(we);
      },
      get title() {
        return r(c);
      },
      get description() {
        return r(m);
      },
      get confirmLabel() {
        return r(I);
      },
      get cancelLabel() {
        return r(F);
      },
      confirmVariant: "danger",
      onConfirm: Zt,
      get onCancel() {
        return Jt;
      },
      contentClass: "secretkey-warning-dialog"
    });
  }
  var st = ie(at, 2);
  Pr(st, {
    get src() {
      return r($);
    },
    get alt() {
      return r(W);
    },
    get onClose() {
      return en;
    },
    get mediaList() {
      return r(We);
    },
    get currentIndex() {
      return r(tn);
    },
    onNavigate: nn,
    get show() {
      return r(y);
    },
    set show(c) {
      E(y, c);
    }
  });
  var un = ie(st, 2);
  {
    var gn = (c) => {
      Rr(c, {
        get show() {
          return r(U);
        },
        get x() {
          return r(G);
        },
        get y() {
          return r(K);
        },
        children: (m, I) => {
          var F = ea(), D = me(F, !0);
          pe(F), ve(() => ht(D, r(le))), he(m, F);
        },
        $$slots: { default: !0 }
      });
    };
    ge(un, (c) => {
      r(U) && c(gn);
    });
  }
  ve(
    (c) => {
      It(Ee, r(oe)), rt = Ce(re, 1, "editor-container svelte-15ticnd", null, rt, {
        "drag-over": r(b),
        "gallery-mode": !r(O),
        sending: r(M).sending
      }), se(re, "aria-label", c), se(re, "aria-disabled", r(M).sending ? "true" : void 0);
    },
    [() => n()("postComponent.editor_label")]
  ), fe("click", re, S), fe("keydown", re, k), fe("change", Be, Q), he(e, nt);
  var pn = Ze(on);
  return s(), pn;
}
Mt(["click", "keydown", "change"]);
Ve(
  ra,
  {
    rxNostr: {},
    hasStoredKey: {},
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
  ra as default
};
