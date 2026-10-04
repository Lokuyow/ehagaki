import { R as lr, cU as cr, H as ur, I as be, dG as dr, c4 as pr, L as cn, K as _, bc as vr, aG as fr, am as gr, aH as hr, Q as mr, b3 as ut, N as _t, aF as Nt, b6 as yr, V as un, $ as br, bb as dn, M as pn, aD as xr, cG as _r, dI as wr, cH as Dt, cI as Cr, bi as Ot, c1 as vn, bg as Pr, S as kr, cR as Tr, dM as Rr, bM as $r, cW as fn } from "./App-C8cvgCUG.js";
import { bL as Hr, bN as Ir, bk as dt, c0 as Er, aP as jt, b0 as Sr, aT as w, aK as Ar, aO as Ut, a as e, b as n, b2 as A, Z as R, b3 as s, b8 as p, b4 as Lr, aS as a, b5 as xe, b1 as _e, bi as $, bf as c, ba as b, b6 as Mr, b9 as v, bj as Nr, bh as Dr } from "./entry-B5mD5NTa.js";
import { D as Or, a as Ur } from "./DialogWrapper-BFdSo4_O.js";
import { i as Fr, j as jr, u as Br, k as qr, f as Kr, l as Qr, P as Gr, o as Wr, b as zr, d as Vr, A as Xr, M as Ft, a as Yr, y as Jr, t as gn, w as Zr, c as ea, e as ta } from "./postBroadcastService-CiTjh9oD.js";
function mn(d) {
  return d.cache?.resolutionQuality === "verified-root-only" || d.cache?.resolutionQuality === "verified-metadata";
}
const na = /* @__PURE__ */ new Set([
  "missing-channel-root",
  "invalid-channel-root",
  "conflicting-channel-roots"
]);
function ra(d) {
  return d.some((u) => na.has(u));
}
function aa(d, u) {
  return mn(u.snapshot) ? u.snapshot : d;
}
function hn(d = {}) {
  const u = d.replyQuoteService ?? new lr(), o = d.channelCoordinator ?? cr, H = d.verifyEventFn ?? ((m) => Hr(m) && Ir(m));
  function G(m) {
    let I = !1, we = null, j = null;
    return {
      promise: (async () => {
        m.onPhase?.("event-loading"), we = u.fetchReferencedEventTask(
          m.pointer.eventId,
          m.pointer.relayHints,
          m.rxNostr,
          m.relayConfig
        );
        const O = await we.promise;
        if (I || O.status === "cancelled")
          return { status: "cancelled" };
        if (O.status === "not-found")
          return { status: "error", reason: "not-found" };
        if (O.status === "timeout")
          return { status: "error", reason: "timeout" };
        if (O.status === "error")
          return { status: "error", reason: "network" };
        const P = O.event;
        if (!H(P))
          return { status: "error", reason: "invalid-event" };
        if (P.id !== m.pointer.eventId || m.pointer.authorHint && P.pubkey !== m.pointer.authorHint || m.pointer.kindHint !== null && P.kind !== m.pointer.kindHint)
          return { status: "error", reason: "mismatch" };
        const re = dt.sanitizeExternalRelayUrls(
          [
            ...m.pointer.relayHints,
            ...O.relayUrl ? [O.relayUrl] : []
          ],
          { limit: dt.EXTERNAL_INPUT_RELAY_LIMIT }
        ), ae = m.profileService ? m.profileService.fetchProfileRealtime(P.pubkey, {
          additionalRelays: re
        }).catch(() => null) : Promise.resolve(null);
        let W = null, fe = null, z = null, y = !1;
        if (P.kind === 40 || P.kind === 42) {
          const V = P.kind === 42 ? Er(P) : null, oe = P.kind === 40 ? P.id : V?.channelEventId ?? null;
          if (!oe || P.kind === 42 && V && ra(V.issues)) {
            const ie = await ae;
            return {
              status: "error",
              reason: "channel-unavailable",
              event: P,
              relayHints: re,
              authorProfile: ie
            };
          }
          m.onPhase?.("channel-loading"), j = o.resolveInternal(
            {
              eventId: oe,
              relayHints: dt.sanitizeExternalRelayUrls(
                [
                  ...V?.channelRelayHints ?? [],
                  ...re
                ]
              )
            },
            m.rxNostr,
            m.relayConfig
          );
          const Ne = await j.cacheReady, U = await j.refresh;
          if (I) return { status: "cancelled" };
          const L = aa(Ne, U);
          if (!mn(L)) {
            const ie = await ae;
            return {
              status: "error",
              reason: "channel-unavailable",
              event: P,
              relayHints: re,
              authorProfile: ie
            };
          }
          W = L.context, y = L.cache?.resolutionQuality === "verified-metadata", z = L.cache?.creatorPubkey ?? null, fe = {
            eventId: oe,
            relayHints: [...L.cache?.relayHints ?? []]
          };
        }
        let g = null, r = null;
        if (m.profileService) {
          if (m.onPhase?.("profile-loading"), [g, r] = await Promise.all([
            ae,
            z && z !== P.pubkey ? m.profileService.fetchProfileRealtime(
              z,
              {
                additionalRelays: fe?.relayHints ?? []
              }
            ).catch(() => null) : Promise.resolve(null)
          ]), I) return { status: "cancelled" };
          z === P.pubkey && (r = g);
        }
        return {
          status: "resolved",
          target: {
            event: P,
            relayHints: re,
            authorProfile: g,
            channelContext: W,
            channelCreatorPubkey: z,
            channelCreatorProfile: r,
            channelQuery: fe,
            channelPictureCacheEligible: y
          }
        };
      })().catch(
        () => I ? { status: "cancelled" } : { status: "error", reason: "network" }
      ).finally(() => {
        j?.release(), j = null;
      }),
      cancel() {
        I = !0, we?.cancel(), j?.release(), j = null;
      }
    };
  }
  return { resolve: G };
}
const oa = 5e3, ia = 200, sa = 2e3;
function la(d) {
  if (d.length > oa)
    return { status: "invalid", reason: "too-long" };
  const u = d.trim();
  if (!u)
    return { status: "empty" };
  const o = u.startsWith("nostr:") ? u.slice(6) : u;
  if (!o)
    return { status: "invalid", reason: "invalid-format" };
  try {
    const H = jt.decode(o);
    if (H.type === "note")
      return {
        status: "supported",
        pointer: {
          format: "note",
          eventId: H.data,
          relayHints: [],
          authorHint: null,
          kindHint: null
        }
      };
    if (H.type === "nevent") {
      const G = H.data;
      return {
        status: "supported",
        pointer: {
          format: "nevent",
          eventId: G.id,
          relayHints: dt.sanitizeExternalRelayUrls(
            G.relays,
            { limit: dt.EXTERNAL_INPUT_RELAY_LIMIT }
          ),
          authorHint: G.author ?? null,
          kindHint: typeof G.kind == "number" ? G.kind : null
        }
      };
    }
    return H.type === "npub" || H.type === "nprofile" || H.type === "naddr" ? { status: "unsupported", format: H.type } : H.type === "nsec" ? { status: "secret-key" } : { status: "invalid", reason: "invalid-format" };
  } catch {
    return { status: "invalid", reason: "invalid-format" };
  }
}
function ca(d, u) {
  return d === 1 ? ["reply", "quote"] : d === 40 ? u ? ["channel"] : [] : d === 42 ? u ? ["reply", "quote"] : [] : [];
}
function ua(d, u) {
  const o = Array.from(d);
  return o.length <= u ? d : `${o.slice(0, u).join("")}…`;
}
function da(d, u = sa) {
  if (d.length <= u)
    return {
      content: d,
      exceedsRenderLimit: !1
    };
  let o = u;
  const H = d.charCodeAt(o - 1);
  return H >= 55296 && H <= 56319 && (o -= 1), {
    content: d.slice(0, o),
    exceedsRenderLimit: !0
  };
}
var pa = b('<div class="xmark-icon svg-icon svelte-19ui8fd"></div>'), va = b('<p class="svelte-19ui8fd"> </p>'), fa = b('<span class="channel-creator svelte-19ui8fd"> </span>'), ga = b('<span class="channel-relays svelte-19ui8fd"> </span>'), ha = b('<div class="channel-preview svelte-19ui8fd"><!> <div class="channel-text svelte-19ui8fd"><strong class="channel-name svelte-19ui8fd"> </strong> <!> <!> <!></div></div>'), ma = b('<div class="clear-input-icon svg-icon svelte-19ui8fd" aria-hidden="true"></div>'), ya = b('<p class="svelte-19ui8fd"> </p>'), ba = b('<div aria-live="polite"><!> <!></div>'), xa = b('<span hidden="" aria-hidden="true" class="svelte-19ui8fd"></span>'), _a = b("<!> <!>", 1), wa = b('<p class="delete-failed svelte-19ui8fd"> </p>'), Ca = b('<div class="post-icon svg-icon" aria-hidden="true"></div>'), Pa = b('<div class="composer-target-channel-action svelte-19ui8fd"><!></div>'), ka = b('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), Ta = b('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), Ra = b('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), $a = b("<!> <!>", 1), Ha = b("<!> <!> <!>", 1), Ia = b('<section class="target-preview svelte-19ui8fd"><div><!> <div class="event-author svelte-19ui8fd"><!> <span class="svelte-19ui8fd"> </span> <span class="event-kind svelte-19ui8fd"> </span></div> <!> <!> <!></div> <!> <!></section>'), Ea = b('<p class="unsupported-kind svelte-19ui8fd"> </p>'), Sa = b('<div class="composer-target-content svelte-19ui8fd"><h2 class="svelte-19ui8fd"> </h2> <label class="target-input-label svelte-19ui8fd" for="composer-target-input"> </label> <div class="composer-target-input-shell svelte-19ui8fd"><input id="composer-target-input" type="text" inputmode="text" autocomplete="off" spellcheck="false" class="svelte-19ui8fd"/> <!></div> <!> <!> <!></div>'), Aa = b('<div class="delete-confirm-body svelte-19ui8fd"><p class="delete-confirm-description svelte-19ui8fd"> </p> <p class="delete-confirm-warning svelte-19ui8fd"> </p></div>'), La = b("<div> </div>"), Ma = b("<!> <!> <!> <!> <!>", 1);
const Na = {
  hash: "svelte-19ui8fd",
  code: `.xmark-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.composer-target-dialog {max-width:560px;}

    @media (max-width: 600px) {.composer-target-dialog {top:0;translate:-50%
                max(
                    calc(
                        var(--mobile-dialog-viewport-top) +
                            env(safe-area-inset-top, 0px) + 12px
                    ),
                    calc(var(--mobile-dialog-center-y) - 50%)
                );width:calc(100% - 24px);max-height:calc(
                var(--mobile-dialog-viewport-height) -
                    env(safe-area-inset-top, 0px) -
                    env(safe-area-inset-bottom, 0px) -
                    24px
            );}.composer-target-dialog .dialog-content {min-height:0;max-height:none;flex:1 1 auto;overflow-y:auto;}.composer-target-dialog .dialog-footer {flex:0 0 auto;}
    }.composer-target-content.svelte-19ui8fd {display:grid;gap:10px;width:100%;}h2.svelte-19ui8fd {margin:0;font-size:1.25rem;}.target-input-label.svelte-19ui8fd {font-weight:600;}.composer-target-input-shell.svelte-19ui8fd {position:relative;}input.svelte-19ui8fd {width:100%;min-height:50px;padding:8px 49px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}input.svelte-19ui8fd:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.composer-target-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);width:46px;height:46px;display:flex;align-items:center;justify-content:center;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.composer-target-clear-button:hover:not(:disabled),
    .ehagaki-app-root button.composer-target-clear-button:active:not(:disabled),
    .ehagaki-app-root button.composer-target-clear-button:focus-visible,
    .ehagaki-app-root button.composer-target-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.composer-target-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.composer-target-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.clear-input-icon.svelte-19ui8fd {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.target-status.svelte-19ui8fd p:where(.svelte-19ui8fd),
    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd),
    .unsupported-kind.svelte-19ui8fd {margin:0;}.event-kind.svelte-19ui8fd,
    .channel-creator.svelte-19ui8fd,
    .channel-relays.svelte-19ui8fd {color:var(--text-muted);font-size:0.85rem;}.target-status.svelte-19ui8fd {display:grid;gap:8px;color:var(--text-muted);}.target-status.error.svelte-19ui8fd {color:var(--danger);}.composer-target-loading {justify-content:flex-start;padding:0;}.target-preview.svelte-19ui8fd {display:grid;border:1px solid var(--border-hr);background:var(--bg-input);}.composer-target-channel-action.svelte-19ui8fd {display:flex;width:100%;justify-content:center;}.target-preview .post-preview-footer {--post-history-preview-footer-surface: var(--bg-input);}.target-preview-body.svelte-19ui8fd {display:grid;gap:10px;padding:12px;}.event-author.svelte-19ui8fd {display:flex;align-items:center;gap:8px;min-width:0;}.event-author.svelte-19ui8fd > span:where(.svelte-19ui8fd):first-of-type {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.event-kind.svelte-19ui8fd {margin-inline-start:auto;white-space:nowrap;}.composer-target-avatar {width:36px;height:36px;flex:0 0 auto;}.composer-target-avatar-image,
    .composer-target-avatar-fallback {width:100%;height:100%;border-radius:50%;}.target-preview .event-content,
    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}.target-preview .event-content-collapsed {max-height:calc(5 * 1.45em);overflow:hidden;}.channel-preview.svelte-19ui8fd {display:flex;gap:10px;padding-top:10px;border-top:1px solid var(--border-hr);}.target-preview-body.channel-first.svelte-19ui8fd .channel-preview:where(.svelte-19ui8fd) {padding-top:0;border-top:0;}.target-preview-body.channel-first.svelte-19ui8fd .event-author:where(.svelte-19ui8fd) {padding-top:10px;border-top:1px solid var(--border-hr);}.channel-preview .channel-picture {width:48px;height:48px;flex:0 0 auto;object-fit:cover;}.channel-text.svelte-19ui8fd {display:grid;gap:4px;min-width:0;}.channel-name.svelte-19ui8fd {min-width:0;overflow-wrap:anywhere;}.channel-relays.svelte-19ui8fd {white-space:pre-wrap;overflow-wrap:anywhere;}.delete-failed.svelte-19ui8fd {margin:0;color:var(--danger);}.delete-confirm-body.svelte-19ui8fd {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-19ui8fd,
    .delete-confirm-warning.svelte-19ui8fd {margin:0;line-height:1.5;}.delete-confirm-warning.svelte-19ui8fd {color:var(--text-light);font-size:0.875rem;}.target-preview .post-icon {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}`
};
function Da(d, u) {
  Sr(u, !0), ur(d, Na);
  const o = () => un(br, "$_", G), H = () => un($r, "$locale", G), [G, m] = mr();
  let I = be(u, "show", 7), we = be(u, "onClose", 7), j = be(u, "onApply", 7), ne = be(u, "rxNostr", 7, void 0), O = be(u, "relayConfig", 7, null), P = be(u, "profileService", 7, void 0), re = be(u, "resolver", 23, hn), ae = be(u, "pubkeyHex", 7, null), W = w(""), fe = w(null), z = w(null), y = w("empty"), g = w(null), r = w(null), V = w(null), oe = w(null), Ne = w(0), U = 0, L, ie = null, De = w(Ar([])), Ce = w(-1), Oe = w(!1), pt = w(null);
  const B = Fr();
  let vt = w(!1), wt = w(null), ze = w(void 0), X = w(void 0), ft = w(!1), Bt = w(0), qt = w(0), Kt = w("postHistory.broadcastSent"), Ve, Xe = w(void 0), gt = w(null), Ye = a(() => e(r) ? ca(e(r).event.kind, e(r).event.kind === 1 || !!e(r).channelQuery) : []), k = a(() => e(r)?.event ?? e(V)), yn = a(() => e(k) ? e(k).created_at * 1e3 : 0), ge = a(() => e(r) ? Ln(e(r)) : null), bn = a(() => e(ge) ? Jr(e(ge)) !== null : !1), xn = a(() => e(ge) ? gn(e(ge), ae()) : !1), Ct = a(() => e(r)?.authorProfile ?? e(oe)), _n = a(() => {
    const t = e(k)?.pubkey;
    return t ? e(Ct)?.displayName?.trim() || e(Ct)?.name?.trim() || Ot(jt.npubEncode(t), 12, 4) : "";
  }), Ue = a(() => !e(k) || e(k).kind === 40 ? "" : wr(e(k).content, e(k).tags)), Pt = a(() => da(e(Ue))), Qt = a(() => e(k) && e(Ue) ? [
    {
      eventId: e(k).id,
      content: e(Pt).content,
      forceCollapsible: e(Pt).exceedsRenderLimit
    }
  ] : []);
  const Je = jr({
    getShow: () => I(),
    getPosts: () => e(Qt),
    getContainer: () => e(z)
  }), ht = Kr({ getShow: () => I(), getRxNostr: () => ne() });
  let wn = a(() => e(r) && (e(r).event.kind === 1 || e(r).event.kind === 42) ? [
    {
      eventId: e(r).event.id,
      relayHints: [...e(r).relayHints]
    }
  ] : []);
  const Cn = Br({
    getShow: () => I(),
    getPubkeyHex: () => ae(),
    getRxNostr: () => ne(),
    getRelayConfig: () => O(),
    getTargets: () => e(wn),
    profileSync: ht,
    source: "composer-target-display"
  });
  let se = a(() => e(r) && (e(r).event.kind === 1 || e(r).event.kind === 42) ? Cn.getReadModel(e(r).event.id) : null), Ze = a(() => !!e(r) && e(gt) === e(r).event.id), Gt = null;
  Ut(() => {
    const t = I() && e(r) && (e(r).event.kind === 1 || e(r).event.kind === 42) ? e(r).event.id : null;
    t !== Gt && (Gt = t, n(gt, null), ht.reset());
  });
  function Pn() {
    !e(r) || !e(se)?.totalCount || n(gt, e(Ze) ? null : e(r).event.id, !0);
  }
  function kn(t) {
    return e(Ze) ? o()("postHistory.hideReactions") : o()("postHistory.showReactionsWithCount", { values: { count: t } });
  }
  const Tn = Je.previewRef;
  let Fe = a(() => e(Qt)[0]), kt = a(() => e(Fe) ? Je.isPostExpanded(e(Fe)) : !1), Wt = a(() => vn(e(kt) ? e(Ue) : e(Pt).content)), mt = a(() => e(k)?.kind === 40 ? Dt({ sourceContent: "", displayContent: "", tags: [], media: [] }) : Dt({
    sourceContent: e(Ue),
    tags: e(k)?.tags ?? []
  })), yt = a(() => e(Wt) === e(Ue) ? e(mt) : Dt({
    sourceContent: e(Ue),
    displayContent: e(mt).hasRenderableText ? e(Wt) : "",
    tags: e(k)?.tags ?? [],
    media: e(mt).media
  })), zt = a(() => {
    const t = new Set(e(yt).previewContent.emojiUrls);
    if (e(Ze))
      for (const i of e(se)?.groups ?? [])
        i.emojiUrl && t.add(i.emojiUrl);
    return [...t];
  }), Rn = a(() => e(mt).hasRenderableText), Tt = a(() => !!e(Fe) && e(Rn) && Je.shouldCollapsePost(e(Fe))), Rt = a(() => e(k) ? `composer-target-preview-content-${e(k).id}` : ""), Vt = a(() => {
    const t = e(r)?.channelContext?.about;
    return t ? ua(vn(t), ia) : "";
  }), $n = a(() => {
    const t = e(r)?.channelContext;
    return t ? t.name?.trim() || `ID: ${Ot(t.eventId, 12, 8)}` : "";
  }), Xt = a(() => {
    const t = e(r)?.channelCreatorPubkey;
    return t ? e(r)?.channelCreatorProfile?.displayName?.trim() || e(r)?.channelCreatorProfile?.name?.trim() || Ot(jt.npubEncode(t), 12, 4) : "";
  }), $t = a(En), Hn = a(() => e(g) === "not-found" || e(g) === "timeout" || e(g) === "network" || e(g) === "channel-unavailable" || e(g) === "nostr-not-ready"), In = a(() => e(y) === "debouncing" || e(y) === "event-loading" || e(y) === "channel-loading" || e(y) === "profile-loading");
  const et = dr({
    getShow: () => I() && e(zt).length > 0,
    getEmojiUrls: () => e(zt),
    onStateChanged: () => Je.remeasure()
  });
  function Ht() {
    L !== void 0 && (clearTimeout(L), L = void 0), ie?.cancel(), ie = null;
  }
  function It() {
    Ve !== void 0 && (clearTimeout(Ve), Ve = void 0), n(ft, !1), n(Xe, void 0);
  }
  function Yt() {
    B.reset(), n(vt, !1), n(wt, null), n(ze, void 0), n(X, void 0), It();
  }
  function Jt() {
    U += 1, Ht(), n(W, ""), n(y, "empty"), n(g, null), n(r, null), n(V, null), n(oe, null), n(Ne, 0), n(gt, null), ht.reset(), Yt(), et.resetState(), n(De, [], !0), n(Ce, -1), n(Oe, !1), n(pt, null);
  }
  function En() {
    return e(y) === "parsing" ? o()("composerTarget.parsing") : e(y) === "debouncing" || e(y) === "event-loading" ? o()("composerTarget.checking") : e(y) === "channel-loading" ? o()("composerTarget.channelLoading") : e(y) === "profile-loading" ? o()("composerTarget.profileLoading") : e(g) ? e(g) === "unsupported" ? o()("composerTarget.unsupportedFormat") : e(g) === "secret-key" ? o()("composerTarget.secretKey") : e(g) === "invalid" ? o()("composerTarget.invalidFormat") : e(g) === "not-found" ? o()("composerTarget.notFound") : e(g) === "timeout" ? o()("composerTarget.timeout") : e(g) === "mismatch" ? o()("composerTarget.mismatch") : e(g) === "channel-unavailable" ? o()("composerTarget.channelUnavailable") : o()("composerTarget.fetchFailed") : "";
  }
  async function Sn(t, i) {
    if (!ne()) {
      U === i && (n(y, "error"), n(g, "nostr-not-ready"));
      return;
    }
    ie = re().resolve({
      pointer: t,
      rxNostr: ne(),
      relayConfig: O(),
      profileService: P(),
      onPhase: (f) => {
        U === i && n(y, f, !0);
      }
    });
    const l = await ie.promise;
    if (!(U !== i || l.status === "cancelled")) {
      if (ie = null, l.status === "resolved") {
        n(r, l.target, !0), n(V, null), n(oe, null), n(y, "ready"), n(g, null);
        return;
      }
      n(V, l.event ?? null, !0), n(oe, l.authorProfile ?? null, !0), n(y, "error"), n(g, l.reason, !0);
    }
  }
  function An() {
    n(Ne, e(Ne) + 1);
  }
  function Et(t) {
    if (!e(r)) return;
    j()(t, {
      source: "manual",
      kind: e(r).event.kind,
      eventId: e(r).event.id,
      relayHints: [...e(r).relayHints],
      authorPubkey: e(r).event.pubkey,
      event: e(r).event,
      channelQuery: e(r).channelQuery
    }) && St();
  }
  function Ln(t) {
    const i = t.event, l = Date.now(), f = i.kind === 42 && t.channelContext?.channelRelays?.length ? [...t.channelContext.channelRelays] : void 0;
    return {
      id: i.id,
      eventId: i.id,
      pubkeyHex: i.pubkey,
      kind: i.kind,
      content: i.content,
      tags: i.tags.map((q) => [...q]),
      createdAt: i.created_at,
      postedAt: i.created_at * 1e3,
      relayHints: [...t.relayHints],
      acceptedRelays: [],
      media: [],
      rawEvent: i,
      ...f ? { channelRelayHints: f } : {},
      updatedAt: l,
      schemaVersion: 1
    };
  }
  function Mn(t, i) {
    i && B.closeAllPostItemMenus(), B.setPostMenuOpen(t, i);
  }
  function Nn(t) {
    B.closeAllPostItemMenus(), n(wt, t, !0), n(vt, !0);
  }
  function Dn(t, i) {
    n(
      Xe,
      {
        eventId: t.eventId,
        ...fn(i.clientX, i.clientY)
      },
      !0
    );
  }
  function On(t, i) {
    if (e(Xe)?.eventId === t.eventId)
      return {
        x: e(Xe).x,
        y: e(Xe).y
      };
    const l = i.currentTarget, f = l instanceof HTMLElement ? l.getBoundingClientRect() : null;
    return fn(f ? f.left + f.width / 2 : 0, f ? f.bottom + 8 : 0);
  }
  function Un(t, i) {
    It(), n(Bt, t.x, !0), n(qt, t.y, !0), n(
      Kt,
      i.success ? (i.rejectedRelays?.length ?? 0) > 0 || (i.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), n(ft, !0), Ve = setTimeout(
      () => {
        n(ft, !1), Ve = void 0;
      },
      1800
    );
  }
  async function Fn(t, i) {
    if (e(ze) === "sending") return;
    const l = U, f = t.eventId, q = On(t, i);
    n(ze, "sending");
    const le = await Zr.broadcast({ post: t, rxNostr: ne() });
    U !== l || e(r)?.event.id !== f || (n(ze, void 0), Un(q, le));
  }
  function jn(t) {
    gn(t, ae()) && B.openDeleteConfirm(t);
  }
  function Bn() {
    B.cancelDeleteConfirm();
  }
  async function qn() {
    const t = B.deleteTargetPost;
    if (!t || e(X) === "sending") return;
    const i = U, l = t.eventId;
    n(X, "sending");
    const f = await Qr.requestDeletion({ post: t, rxNostr: ne() });
    if (!(U !== i || e(r)?.event.id !== l)) {
      if (B.setDeleteConfirmOpen(!1), f.success) {
        n(X, void 0), St();
        return;
      }
      n(X, "failed");
    }
  }
  function St() {
    Jt(), we()();
  }
  function Kn() {
    e(W).trim().length !== 0 && (n(W, ""), e(fe)?.focus({ preventScroll: !0 }));
  }
  function Qn(t) {
    t.preventDefault(), e(fe)?.focus({ preventScroll: !0 });
  }
  function Gn(t) {
    return t instanceof Element && t.closest(".ehagaki-pswp") !== null;
  }
  function Wn(t) {
    Gn(t.target) && t.preventDefault();
  }
  function zn(t) {
    e(Oe) && t.preventDefault();
  }
  function Vn(t) {
    n(De, t.mediaList, !0), n(Ce, t.index, !0), n(pt, t.focusOrigin, !0), n(Oe, !0);
  }
  function Xn() {
    n(Oe, !1), n(De, [], !0), n(Ce, -1), n(pt, null);
  }
  function Yn(t) {
    n(Ce, t, !0);
  }
  Ut(() => {
    I() || Jt();
  }), Ut(() => {
    if (!I()) return;
    const t = e(W);
    e(Ne);
    const i = ++U;
    Ht(), Yt(), n(r, null), n(V, null), n(oe, null), n(g, null), n(y, "parsing");
    const l = la(t);
    if (l.status === "empty") {
      n(y, "empty");
      return;
    }
    if (l.status === "unsupported") {
      n(y, "error"), n(g, "unsupported");
      return;
    }
    if (l.status === "secret-key") {
      n(y, "error"), n(g, "secret-key");
      return;
    }
    if (l.status === "invalid") {
      n(y, "error"), n(g, "invalid");
      return;
    }
    const f = l.pointer;
    return n(y, "debouncing"), L = setTimeout(
      () => {
        L = void 0, Sn(f, i);
      },
      250
    ), () => {
      L !== void 0 && (clearTimeout(L), L = void 0);
    };
  }), pr(() => {
    U += 1, Ht(), It(), ht.dispose();
  });
  var Jn = {
    get show() {
      return I();
    },
    set show(t) {
      I(t), xe();
    },
    get onClose() {
      return we();
    },
    set onClose(t) {
      we(t), xe();
    },
    get onApply() {
      return j();
    },
    set onApply(t) {
      j(t), xe();
    },
    get rxNostr() {
      return ne();
    },
    set rxNostr(t = void 0) {
      ne(t), xe();
    },
    get relayConfig() {
      return O();
    },
    set relayConfig(t = null) {
      O(t), xe();
    },
    get profileService() {
      return P();
    },
    set profileService(t = void 0) {
      P(t), xe();
    },
    get resolver() {
      return re();
    },
    set resolver(t = hn()) {
      re(t), xe();
    },
    get pubkeyHex() {
      return ae();
    },
    set pubkeyHex(t = null) {
      ae(t), xe();
    }
  }, Zt = Ma(), en = A(Zt);
  {
    const t = (f) => {
      var q = _e(), le = A(q);
      {
        const Pe = (ce, K) => {
          let tt = () => K?.().props;
          {
            let he = a(() => o()("global.close"));
            Nt(ce, yr(tt, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(he);
              },
              children: (ue, bt) => {
                var je = pa();
                R((At) => _t(je, "aria-label", At), [() => o()("global.close")]), s(ue, je);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        ut(le, () => Ur, (ce, K) => {
          K(ce, { child: Pe, $$slots: { child: !0 } });
        });
      }
      s(f, q);
    };
    let i = a(() => o()("composerTarget.title")), l = a(() => o()("composerTarget.description"));
    Or(en, {
      get open() {
        return I();
      },
      onOpenChange: (f) => !f && St(),
      get title() {
        return e(i);
      },
      get description() {
        return e(l);
      },
      contentClass: "composer-target-dialog",
      footerVariant: "close-button",
      onOpenAutoFocus: Qn,
      onInteractOutside: Wn,
      onEscapeKeydown: zn,
      footer: t,
      children: (f, q) => {
        var le = Sa();
        {
          const sn = (x) => {
            var C = ha(), E = p(C);
            {
              var Y = (T) => {
                Rr(T, {
                  get eventId() {
                    return e(r).channelContext.eventId;
                  },
                  get pictureUrl() {
                    return e(r).channelContext.picture;
                  },
                  get cacheEligible() {
                    return e(r).channelPictureCacheEligible;
                  },
                  alt: "",
                  className: "channel-picture"
                });
              };
              _(E, (T) => {
                e(r)?.channelContext?.picture && T(Y);
              });
            }
            var de = c(E, 2), ke = p(de), Te = p(ke, !0);
            v(ke);
            var Re = c(ke, 2);
            {
              var S = (T) => {
                var M = va(), He = p(M, !0);
                v(M), R(() => $(He, e(Vt))), s(T, M);
              };
              _(Re, (T) => {
                e(Vt) && T(S);
              });
            }
            var J = c(Re, 2);
            {
              var $e = (T) => {
                var M = fa(), He = p(M);
                v(M), R((nt) => $(He, `${nt ?? ""}: ${e(Xt) ?? ""}`), [() => o()("composerTarget.creator")]), s(T, M);
              };
              _(J, (T) => {
                e(Xt) && T($e);
              });
            }
            var Be = c(J, 2);
            {
              var qe = (T) => {
                var M = ga(), He = p(M, !0);
                v(M), R((nt) => $(He, nt), [() => e(r).channelContext.channelRelays.join(`
`)]), s(T, M);
              };
              _(Be, (T) => {
                e(r)?.channelContext?.channelRelays?.length && T(qe);
              });
            }
            v(de), v(C), R(() => $(Te, e($n))), s(x, C);
          };
          var Pe = p(le), ce = p(Pe, !0);
          v(Pe);
          var K = c(Pe, 2), tt = p(K, !0);
          v(K);
          var he = c(K, 2), ue = p(he);
          Pr(ue), cn(ue, (x) => n(fe, x), () => e(fe));
          var bt = c(ue, 2);
          {
            var je = (x) => {
              {
                let C = a(() => o()("composerTarget.clearInput"));
                Nt(x, {
                  type: "button",
                  className: "composer-target-clear-button",
                  variant: "default",
                  shape: "square",
                  contentLayout: "icon",
                  get ariaLabel() {
                    return e(C);
                  },
                  onClick: Kn,
                  get onmousedown() {
                    return dn;
                  },
                  get ontouchstart() {
                    return dn;
                  },
                  children: (E, Y) => {
                    var de = ma();
                    s(E, de);
                  },
                  $$slots: { default: !0 }
                });
              }
            }, At = a(() => e(W).trim().length > 0);
            _(bt, (x) => {
              e(At) && x(je);
            });
          }
          v(he);
          var an = c(he, 2);
          {
            var tr = (x) => {
              var C = ba();
              let E;
              var Y = p(C);
              {
                var de = (S) => {
                  kr(S, {
                    showLoader: !0,
                    get text() {
                      return e($t);
                    },
                    customClass: "composer-target-loading"
                  });
                }, ke = (S) => {
                  var J = ya(), $e = p(J, !0);
                  v(J), R(() => $($e, e($t))), s(S, J);
                };
                _(Y, (S) => {
                  e(In) ? S(de) : S(ke, -1);
                });
              }
              var Te = c(Y, 2);
              {
                var Re = (S) => {
                  Nt(S, {
                    onClick: An,
                    children: (J, $e) => {
                      Nr();
                      var Be = Dr();
                      R((qe) => $(Be, qe), [() => o()("postHistory.contextRetry")]), s(J, Be);
                    },
                    $$slots: { default: !0 }
                  });
                };
                _(Te, (S) => {
                  e(Hn) && S(Re);
                });
              }
              v(C), R(() => E = pn(C, 1, "target-status svelte-19ui8fd", null, E, { error: e(y) === "error" })), s(x, C);
            };
            _(an, (x) => {
              e($t) && x(tr);
            });
          }
          var on = c(an, 2);
          {
            var nr = (x) => {
              var C = Ia(), E = p(C);
              let Y;
              var de = p(E);
              {
                var ke = (h) => {
                  sn(h);
                };
                _(de, (h) => {
                  e(k).kind === 42 && e(r)?.channelContext && h(ke);
                });
              }
              var Te = c(de, 2), Re = p(Te);
              {
                let h = a(() => e(Ct)?.picture ?? "");
                xr(Re, {
                  get src() {
                    return e(h);
                  },
                  alt: "",
                  rootClassName: "composer-target-avatar",
                  imageClassName: "composer-target-avatar-image",
                  fallbackClassName: "composer-target-avatar-fallback",
                  fallbackAriaLabel: ""
                });
              }
              var S = c(Re, 2), J = p(S, !0);
              v(S);
              var $e = c(S, 2), Be = p($e);
              v($e), v(Te);
              var qe = c(Te, 2);
              {
                const h = (rt) => {
                  var me = _e(), Ee = A(me);
                  {
                    var at = (Se) => {
                      var Z = _a(), N = A(Z);
                      {
                        var Ke = (Ae) => {
                          var Qe = xa();
                          R(() => _t(Qe, "id", e(Rt))), s(Ae, Qe);
                        };
                        _(N, (Ae) => {
                          e(yt).hasRenderableText || Ae(Ke);
                        });
                      }
                      var ot = c(N, 2);
                      Wr(ot, {
                        get expanded() {
                          return e(kt);
                        },
                        get controls() {
                          return e(Rt);
                        },
                        onToggle: () => Je.togglePostExpanded(e(Fe).eventId)
                      }), s(Se, Z);
                    };
                    _(Ee, (Se) => {
                      e(Fe) && e(Tt) && Se(at);
                    });
                  }
                  s(rt, me);
                };
                let Ie = a(() => e(yt).hasRenderableText && !e(kt) && e(Tt));
                _r(qe, {
                  get model() {
                    return e(yt);
                  },
                  get contentWarningEventId() {
                    return e(k).id;
                  },
                  density: "dialog",
                  get emojiLoadStateByUrl() {
                    return et.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return et.emojiImageMetaByUrl;
                  },
                  get previewContentId() {
                    return e(Rt);
                  },
                  contentClass: "event-content",
                  collapsedContentClass: "event-content-collapsed",
                  get renderWhenEmpty() {
                    return e(Tt);
                  },
                  get isTextCollapsed() {
                    return e(Ie);
                  },
                  get previewCollapseAction() {
                    return Tn;
                  },
                  get previewCollapseEventId() {
                    return e(k).id;
                  },
                  onImageOpen: Vn,
                  betweenContentAndMedia: h,
                  $$slots: { betweenContentAndMedia: !0 }
                });
              }
              var T = c(qe, 2);
              {
                var M = (h) => {
                  sn(h);
                };
                _(T, (h) => {
                  e(k).kind !== 42 && e(r)?.channelContext && h(M);
                });
              }
              var He = c(T, 2);
              {
                var nt = (h) => {
                  var Ie = wa(), rt = p(Ie, !0);
                  v(Ie), R((me) => $(rt, me), [() => o()("postHistory.deleteFailed")]), s(h, Ie);
                };
                _(He, (h) => {
                  e(X) === "failed" && e(r) && h(nt);
                });
              }
              v(E);
              var ln = c(E, 2);
              {
                const h = (me) => {
                  var Ee = _e(), at = A(Ee);
                  {
                    var Se = (Z) => {
                      var N = _e(), Ke = A(N);
                      {
                        var ot = (pe) => {
                          var ve = _e(), Ge = A(ve);
                          {
                            var st = (Le) => {
                              {
                                const lt = (ye) => {
                                  var Me = _e(), ee = A(Me);
                                  {
                                    var te = (D) => {
                                      {
                                        let We = a(() => kn(e(se).totalCount));
                                        ta(D, {
                                          get count() {
                                            return e(se).totalCount;
                                          },
                                          get expanded() {
                                            return e(Ze);
                                          },
                                          get ariaLabel() {
                                            return e(We);
                                          },
                                          onToggle: Pn
                                        });
                                      }
                                    };
                                    _(ee, (D) => {
                                      e(se) && e(se).totalCount > 0 && D(te);
                                    });
                                  }
                                  s(ye, Me);
                                };
                                let F = a(() => e(Ye).includes("reply") ? () => Et("reply") : void 0), Q = a(() => e(Ye).includes("quote") ? () => Et("quote") : void 0);
                                ea(Le, {
                                  get post() {
                                    return e(ge);
                                  },
                                  get onReplyPost() {
                                    return e(F);
                                  },
                                  get onQuotePost() {
                                    return e(Q);
                                  },
                                  reactionExtras: lt,
                                  $$slots: { reactionExtras: !0 }
                                });
                              }
                            };
                            _(Ge, (Le) => {
                              e(ge) && Le(st);
                            });
                          }
                          s(pe, ve);
                        }, Ae = a(() => e(Ye).includes("reply") || e(Ye).includes("quote")), Qe = (pe) => {
                          var ve = Pa(), Ge = p(ve);
                          {
                            let st = a(() => o()("composerTarget.post")), Le = a(() => o()("composerTarget.post"));
                            Xr(Ge, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return e(st);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => Et("channel"),
                              get tooltipContent() {
                                return e(Le);
                              },
                              children: (lt, F) => {
                                var Q = Ca();
                                s(lt, Q);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                          v(ve), s(pe, ve);
                        }, it = a(() => e(Ye).includes("channel"));
                        _(Ke, (pe) => {
                          e(Ae) ? pe(ot) : e(it) && pe(Qe, 1);
                        });
                      }
                      s(Z, N);
                    };
                    _(at, (Z) => {
                      e(r) && Z(Se);
                    });
                  }
                  s(me, Ee);
                }, Ie = (me) => {
                  var Ee = _e(), at = A(Ee);
                  {
                    var Se = (Z) => {
                      const N = a(() => e(ge)), Ke = a(() => o()("common.showActions"));
                      {
                        const ot = (it) => {
                          var pe = Ha(), ve = A(pe);
                          ut(ve, () => Ft, (F, Q) => {
                            Q(F, {
                              class: "menu-action-button",
                              onSelect: () => Nn(e(N).rawEvent),
                              children: (ye, Me) => {
                                var ee = ka(), te = c(A(ee), 2), D = p(te, !0);
                                v(te), R((We) => $(D, We), [() => o()("postHistory.rawJson")]), s(ye, ee);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Ge = c(ve, 2);
                          {
                            var st = (F) => {
                              var Q = _e(), ye = A(Q);
                              {
                                let Me = a(() => e(ze) === "sending");
                                ut(ye, () => Ft, (ee, te) => {
                                  te(ee, {
                                    class: "menu-action-button",
                                    get disabled() {
                                      return e(Me);
                                    },
                                    onpointerdown: (D) => Dn(e(N), D),
                                    onSelect: (D) => void Fn(e(N), D),
                                    children: (D, We) => {
                                      var Lt = Ta(), ct = c(A(Lt), 2), xt = p(ct, !0);
                                      v(ct), R((Mt) => $(xt, Mt), [() => o()("postHistory.broadcast")]), s(D, Lt);
                                    },
                                    $$slots: { default: !0 }
                                  });
                                });
                              }
                              s(F, Q);
                            };
                            _(Ge, (F) => {
                              e(bn) && F(st);
                            });
                          }
                          var Le = c(Ge, 2);
                          {
                            var lt = (F) => {
                              var Q = $a(), ye = A(Q);
                              ut(ye, () => Yr, (ee, te) => {
                                te(ee, { class: "post-history-menu-separator" });
                              });
                              var Me = c(ye, 2);
                              {
                                let ee = a(() => e(X) === "sending");
                                ut(Me, () => Ft, (te, D) => {
                                  D(te, {
                                    class: "menu-action-button menu-action-button-danger",
                                    get disabled() {
                                      return e(ee);
                                    },
                                    onSelect: () => jn(e(N)),
                                    children: (We, Lt) => {
                                      var ct = Ra(), xt = c(A(ct), 2), Mt = p(xt, !0);
                                      v(xt), R((sr) => $(Mt, sr), [
                                        () => e(X) === "sending" ? o()("postHistory.deleteSending") : o()("postHistory.delete")
                                      ]), s(We, ct);
                                    },
                                    $$slots: { default: !0 }
                                  });
                                });
                              }
                              s(F, Q);
                            };
                            _(Le, (F) => {
                              e(xn) && F(lt);
                            });
                          }
                          s(it, pe);
                        };
                        let Ae = a(() => B.isPostMenuOpen(e(N).eventId)), Qe = a(() => Tr(e(N).postedAt, H()));
                        zr(Z, {
                          get open() {
                            return e(Ae);
                          },
                          onOpenChange: (it) => Mn(e(N).eventId, it),
                          get triggerAriaLabel() {
                            return e(Ke);
                          },
                          get tooltipContent() {
                            return e(Ke);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return e(Qe);
                          },
                          items: ot,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    _(at, (Z) => {
                      e(ge) && Z(Se);
                    });
                  }
                  s(me, Ee);
                };
                let rt = a(() => Cr(e(yn)));
                Gr(ln, {
                  get formattedDate() {
                    return e(rt);
                  },
                  actions: h,
                  trailing: Ie,
                  $$slots: { actions: !0, trailing: !0 }
                });
              }
              var or = c(ln, 2);
              {
                var ir = (h) => {
                  Vr(h, {
                    get readModel() {
                      return e(se);
                    },
                    get emojiLoadStateByUrl() {
                      return et.emojiLoadStateByUrl;
                    },
                    get emojiImageMetaByUrl() {
                      return et.emojiImageMetaByUrl;
                    }
                  });
                };
                _(or, (h) => {
                  e(se) && e(se).totalCount > 0 && e(Ze) && h(ir);
                });
              }
              v(C), cn(C, (h) => n(z, h), () => e(z)), R(
                (h) => {
                  _t(C, "aria-label", h), Y = pn(E, 1, "target-preview-body svelte-19ui8fd", null, Y, {
                    "channel-first": e(k).kind === 42 && !!e(r)?.channelContext
                  }), $(J, e(_n)), $(Be, `kind ${e(k).kind ?? ""}`);
                },
                [() => o()("composerTarget.preview")]
              ), s(x, C);
            };
            _(on, (x) => {
              e(k) && x(nr);
            });
          }
          var rr = c(on, 2);
          {
            var ar = (x) => {
              var C = Ea(), E = p(C, !0);
              v(C), R((Y) => $(E, Y), [() => o()("composerTarget.unsupportedKind")]), s(x, C);
            };
            _(rr, (x) => {
              e(r) && e(r).event.kind !== 1 && e(r).event.kind !== 40 && e(r).event.kind !== 42 && x(ar);
            });
          }
          v(le), R(
            (x, C, E) => {
              $(ce, x), $(tt, C), _t(ue, "placeholder", E);
            },
            [
              () => o()("composerTarget.title"),
              () => o()("composerTarget.inputLabel"),
              () => o()("composerTarget.placeholder")
            ]
          ), vr(ue, () => e(W), (x) => n(W, x));
        }
        s(f, le);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var tn = c(en, 2);
  qr(tn, {
    get open() {
      return e(vt);
    },
    get rawEvent() {
      return e(wt);
    },
    onOpenChange: (t) => n(vt, t, !0)
  });
  var nn = c(tn, 2);
  {
    const t = (Pe) => {
      var ce = Aa(), K = p(ce), tt = p(K, !0);
      v(K);
      var he = c(K, 2), ue = p(he, !0);
      v(he), v(ce), R(
        (bt, je) => {
          $(tt, bt), $(ue, je);
        },
        [
          () => o()("postHistory.deleteRequestDescription"),
          () => o()("postHistory.deleteRequestWarning")
        ]
      ), s(Pe, ce);
    };
    let i = a(() => o()("postHistory.deleteRequestTitle")), l = a(() => o()("postHistory.deleteRequestDescription")), f = a(() => e(X) === "sending" ? o()("postHistory.deleteSending") : o()("postHistory.deleteConfirm")), q = a(() => o()("postHistory.deleteCancel")), le = a(() => e(X) === "sending");
    fr(nn, {
      get open() {
        return B.deleteConfirmOpen;
      },
      get onOpenChange() {
        return B.setDeleteConfirmOpen;
      },
      get title() {
        return e(i);
      },
      get description() {
        return e(l);
      },
      get confirmLabel() {
        return e(f);
      },
      get cancelLabel() {
        return e(q);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return e(le);
      },
      onConfirm: qn,
      onCancel: Bn,
      contentClass: "post-history-delete-confirm",
      children: t,
      $$slots: { default: !0 }
    });
  }
  var rn = c(nn, 2);
  {
    let t = a(() => e(De)[e(Ce)]?.src ?? ""), i = a(() => e(De)[e(Ce)]?.alt ?? "");
    gr(rn, {
      get src() {
        return e(t);
      },
      get alt() {
        return e(i);
      },
      onClose: Xn,
      get mediaList() {
        return e(De);
      },
      get currentIndex() {
        return e(Ce);
      },
      onNavigate: Yn,
      get openingFocusOrigin() {
        return e(pt);
      },
      get show() {
        return e(Oe);
      },
      set show(l) {
        n(Oe, l, !0);
      }
    });
  }
  var Zn = c(rn, 2);
  hr(Zn, {
    get show() {
      return e(ft);
    },
    get x() {
      return e(Bt);
    },
    get y() {
      return e(qt);
    },
    children: (t, i) => {
      var l = La(), f = p(l, !0);
      v(l), R((q) => $(f, q), [() => o()(e(Kt))]), s(t, l);
    },
    $$slots: { default: !0 }
  }), s(d, Zt);
  var er = Lr(Jn);
  return m(), er;
}
Mr(
  Da,
  {
    show: {},
    onClose: {},
    onApply: {},
    rxNostr: {},
    relayConfig: {},
    profileService: {},
    resolver: {},
    pubkeyHex: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  Da as default
};
