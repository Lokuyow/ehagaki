import { R as lr, cW as ur, cL as cr, M as dr, N as be, dL as pr, c5 as vr, S as un, Q as w, a$ as fr, aL as gr, ar as hr, aM as mr, W as yr, aS as ct, U as _t, aK as Mt, aV as br, _ as cn, $ as xr, a_ as dn, T as pn, aI as _r, cI as wr, dN as Cr, cJ as Dt, dQ as Pr, cK as kr, b5 as Ot, b3 as Rr, X as Tr, cT as $r, dT as Hr, bO as Er, cY as vn } from "./App-Ck79ufzA.js";
import { bL as Ir, bN as Sr, bk as dt, c5 as Ar, aP as Ft, b0 as Lr, aT as C, aK as Nr, aO as Ut, a as e, b as n, b2 as A, Z as T, b3 as i, b8 as v, b4 as Mr, aS as r, b5 as xe, b1 as _e, bi as $, bf as u, ba as x, b6 as Dr, b9 as f, bj as Or, bh as Ur } from "./entry-CLkZn30j.js";
import { D as Br, a as Fr } from "./DialogWrapper-aT5t3sgb.js";
import { i as jr, j as qr, u as Kr, k as Qr, f as Wr, l as zr, P as Vr, o as Gr, b as Xr, d as Yr, A as Jr, M as Bt, a as Zr, y as ea, t as fn, w as ta, c as na, e as ra } from "./postBroadcastService-DDsWYlrN.js";
import { s as aa } from "./domSanitizer-Bzf7Qvaa.js";
function hn(c) {
  return c.cache?.resolutionQuality === "verified-root-only" || c.cache?.resolutionQuality === "verified-metadata";
}
const oa = /* @__PURE__ */ new Set([
  "missing-channel-root",
  "invalid-channel-root",
  "conflicting-channel-roots"
]);
function sa(c) {
  return c.some((d) => oa.has(d));
}
function ia(c, d) {
  return hn(d.snapshot) ? d.snapshot : c;
}
function gn(c = {}) {
  const d = c.replyQuoteService ?? new lr(), o = c.channelCoordinator ?? ur, H = c.verifyEventFn ?? ((y) => Ir(y) && Sr(y));
  c.deletionRequestsRepository ?? cr;
  function G(y) {
    let E = !1, we = null, F = null;
    return {
      promise: (async () => {
        y.onPhase?.("event-loading"), we = d.fetchReferencedEventTask(
          y.pointer.eventId,
          y.pointer.relayHints,
          y.rxNostr,
          y.relayConfig
        );
        const D = await we.promise;
        if (E || D.status === "cancelled")
          return { status: "cancelled" };
        if (D.status === "not-found")
          return { status: "error", reason: "not-found" };
        if (D.status === "timeout")
          return { status: "error", reason: "timeout" };
        if (D.status === "error")
          return { status: "error", reason: "network" };
        let k = D.event, Oe = D.relayUrl;
        if (!H(k))
          return { status: "error", reason: "invalid-event" };
        if (k.id !== y.pointer.eventId || y.pointer.authorHint && k.pubkey !== y.pointer.authorHint || y.pointer.kindHint !== null && k.kind !== y.pointer.kindHint)
          return { status: "error", reason: "mismatch" };
        const O = dt.sanitizeExternalRelayUrls(
          [
            ...Oe ? [Oe] : [],
            ...y.pointer.relayHints
          ],
          { limit: dt.EXTERNAL_INPUT_RELAY_LIMIT }
        ), j = y.profileService ? y.profileService.fetchProfileRealtime(k.pubkey, {
          additionalRelays: O
        }).catch(() => null) : Promise.resolve(null);
        let Ce = null, Pe = null, p = null, b = !1;
        if (k.kind === 40 || k.kind === 42) {
          const Y = k.kind === 42 ? Ar(k) : null, ve = k.kind === 40 ? k.id : Y?.channelEventId ?? null;
          if (!ve || k.kind === 42 && Y && sa(Y.issues)) {
            const Z = await j;
            return {
              status: "error",
              reason: "channel-unavailable",
              event: k,
              relayHints: O,
              authorProfile: Z
            };
          }
          y.onPhase?.("channel-loading"), F = o.resolveInternal(
            {
              eventId: ve,
              relayHints: dt.sanitizeExternalRelayUrls(
                [
                  ...Y?.channelRelayHints ?? [],
                  ...O
                ]
              )
            },
            y.rxNostr,
            y.relayConfig
          );
          const U = await F.cacheReady, J = await F.refresh;
          if (E) return { status: "cancelled" };
          const q = ia(U, J);
          if (!hn(q)) {
            const Z = await j;
            return {
              status: "error",
              reason: "channel-unavailable",
              event: k,
              relayHints: O,
              authorProfile: Z
            };
          }
          Ce = q.context, b = q.cache?.resolutionQuality === "verified-metadata", p = q.cache?.creatorPubkey ?? null, Pe = {
            eventId: ve,
            relayHints: [...q.cache?.relayHints ?? []]
          };
        }
        let a = null, oe = null;
        if (y.profileService) {
          if (y.onPhase?.("profile-loading"), [a, oe] = await Promise.all([
            j,
            p && p !== k.pubkey ? y.profileService.fetchProfileRealtime(
              p,
              {
                additionalRelays: Pe?.relayHints ?? []
              }
            ).catch(() => null) : Promise.resolve(null)
          ]), E) return { status: "cancelled" };
          p === k.pubkey && (oe = a);
        }
        return {
          status: "resolved",
          target: {
            event: k,
            relayHints: O,
            authorProfile: a,
            channelContext: Ce,
            channelCreatorPubkey: p,
            channelCreatorProfile: oe,
            channelQuery: Pe,
            channelPictureCacheEligible: b
          }
        };
      })().catch(
        () => E ? { status: "cancelled" } : { status: "error", reason: "network" }
      ).finally(() => {
        F?.release(), F = null;
      }),
      cancel() {
        E = !0, we?.cancel(), F?.release(), F = null;
      }
    };
  }
  return { resolve: G };
}
const la = 5e3, ua = 200, ca = 2e3;
function da(c) {
  if (c.length > la)
    return { status: "invalid", reason: "too-long" };
  const d = c.trim();
  if (!d)
    return { status: "empty" };
  const o = d.startsWith("nostr:") ? d.slice(6) : d;
  if (!o)
    return { status: "invalid", reason: "invalid-format" };
  try {
    const H = Ft.decode(o);
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
function pa(c, d) {
  return c === 1 || c === 1111 ? ["reply", "quote"] : c === 40 ? d ? ["channel"] : [] : c === 42 ? d ? ["reply", "quote"] : [] : [];
}
function va(c, d) {
  const o = Array.from(c);
  return o.length <= d ? c : `${o.slice(0, d).join("")}…`;
}
function fa(c, d = ca) {
  if (c.length <= d)
    return {
      content: c,
      exceedsRenderLimit: !1
    };
  let o = d;
  const H = c.charCodeAt(o - 1);
  return H >= 55296 && H <= 56319 && (o -= 1), {
    content: c.slice(0, o),
    exceedsRenderLimit: !0
  };
}
var ga = x('<div class="xmark-icon svg-icon svelte-19ui8fd"></div>'), ha = x('<p class="svelte-19ui8fd"> </p>'), ma = x('<span class="channel-creator svelte-19ui8fd"> </span>'), ya = x('<span class="channel-relays svelte-19ui8fd"> </span>'), ba = x('<div class="channel-preview svelte-19ui8fd"><!> <div class="channel-text svelte-19ui8fd"><strong class="channel-name svelte-19ui8fd"> </strong> <!> <!> <!></div></div>'), xa = x('<div class="clear-input-icon svg-icon svelte-19ui8fd" aria-hidden="true"></div>'), _a = x('<p class="svelte-19ui8fd"> </p>'), wa = x('<div aria-live="polite"><!> <!></div>'), Ca = x('<span hidden="" aria-hidden="true" class="svelte-19ui8fd"></span>'), Pa = x("<!> <!>", 1), ka = x('<p class="delete-failed svelte-19ui8fd"> </p>'), Ra = x('<div class="post-icon svg-icon" aria-hidden="true"></div>'), Ta = x('<div class="composer-target-channel-action svelte-19ui8fd"><!></div>'), $a = x('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), Ha = x('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), Ea = x('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), Ia = x("<!> <!>", 1), Sa = x("<!> <!> <!>", 1), Aa = x('<section class="target-preview svelte-19ui8fd"><div><!> <div class="event-author svelte-19ui8fd"><!> <span class="svelte-19ui8fd"> </span> <span class="event-kind svelte-19ui8fd"> </span></div> <!> <!> <!></div> <!> <!></section>'), La = x('<p class="unsupported-kind svelte-19ui8fd"> </p>'), Na = x('<div class="composer-target-content svelte-19ui8fd"><h2 class="svelte-19ui8fd"> </h2> <label class="target-input-label svelte-19ui8fd" for="composer-target-input"> </label> <div class="composer-target-input-shell svelte-19ui8fd"><input id="composer-target-input" type="text" inputmode="text" autocomplete="off" spellcheck="false" class="svelte-19ui8fd"/> <!></div> <!> <!> <!></div>'), Ma = x('<div class="delete-confirm-body svelte-19ui8fd"><p class="delete-confirm-description svelte-19ui8fd"> </p> <p class="delete-confirm-warning svelte-19ui8fd"> </p></div>'), Da = x("<div> </div>"), Oa = x("<!> <!> <!> <!> <!>", 1);
const Ua = {
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
function Ba(c, d) {
  Lr(d, !0), dr(c, Ua);
  const o = () => cn(xr, "$_", G), H = () => cn(Er, "$locale", G), [G, y] = yr();
  let E = be(d, "show", 7), we = be(d, "onClose", 7), F = be(d, "onApply", 7), X = be(d, "rxNostr", 7, void 0), D = be(d, "relayConfig", 7, null), k = be(d, "profileService", 7, void 0), Oe = be(d, "resolver", 23, gn), O = be(d, "pubkeyHex", 7, null), j = C(""), Ce = C(null), Pe = C(null), p = C("empty"), b = C(null), a = C(null), oe = C(null), Y = C(null), ve = C(0), U = 0, J, q = null, Z = C(Nr([])), ke = C(-1), Ue = C(!1), pt = C(null);
  const K = jr();
  let vt = C(!1), wt = C(null), ze = C(void 0), ee = C(void 0), ft = C(!1), jt = C(0), qt = C(0), Kt = C("postHistory.broadcastSent"), Ve, Ge = C(void 0), gt = C(null), Xe = r(() => e(a) ? pa(e(a).event.kind, [1, 1111].includes(e(a).event.kind) || !!e(a).channelQuery) : []), h = r(() => e(a)?.event ?? e(oe)), mn = r(() => e(h) ? e(h).created_at * 1e3 : 0), fe = r(() => e(a) ? An(e(a)) : null), yn = r(() => e(fe) ? ea(e(fe)) !== null : !1), bn = r(() => e(fe) ? fn(e(fe), O()) : !1), Ct = r(() => e(a)?.authorProfile ?? e(Y)), xn = r(() => {
    const t = e(h)?.pubkey;
    return t ? e(Ct)?.displayName?.trim() || e(Ct)?.name?.trim() || Ot(Ft.npubEncode(t), 12, 4) : "";
  }), Be = r(() => !e(h) || e(h).kind === 40 ? "" : Cr(e(h).content, e(h).tags)), Pt = r(() => fa(e(Be))), Qt = r(() => e(h) && e(Be) ? [
    {
      eventId: e(h).id,
      content: e(Pt).content,
      forceCollapsible: e(Pt).exceedsRenderLimit
    }
  ] : []);
  const Ye = qr({
    getShow: () => E(),
    getPosts: () => e(Qt),
    getContainer: () => e(Pe)
  }), ht = Wr({ getShow: () => E(), getRxNostr: () => X() });
  let _n = r(() => e(a) && [1, 42, 1111].includes(e(a).event.kind) ? [
    {
      eventId: e(a).event.id,
      relayHints: [...e(a).relayHints]
    }
  ] : []);
  const wn = Kr({
    getShow: () => E(),
    getPubkeyHex: () => O(),
    getRxNostr: () => X(),
    getRelayConfig: () => D(),
    getTargets: () => e(_n),
    profileSync: ht,
    source: "composer-target-display"
  });
  let se = r(() => e(a) && [1, 42, 1111].includes(e(a).event.kind) ? wn.getReadModel(e(a).event.id) : null), Je = r(() => !!e(a) && e(gt) === e(a).event.id), Wt = null;
  Ut(() => {
    const t = E() && e(a) && [1, 42, 1111].includes(e(a).event.kind) ? e(a).event.id : null;
    t !== Wt && (Wt = t, n(gt, null), ht.reset());
  });
  function Cn() {
    !e(a) || !e(se)?.totalCount || n(gt, e(Je) ? null : e(a).event.id, !0);
  }
  function Pn(t) {
    return e(Je) ? o()("postHistory.hideReactions") : o()("postHistory.showReactionsWithCount", { values: { count: t } });
  }
  const kn = Ye.previewRef;
  let Fe = r(() => e(Qt)[0]), kt = r(() => e(Fe) ? Ye.isPostExpanded(e(Fe)) : !1), zt = r(() => e(kt) ? e(Be) : e(Pt).content), mt = r(() => e(h)?.kind === 40 ? Dt({
    sourceContent: "",
    displayContent: "",
    tags: [],
    kind: e(h)?.kind,
    media: []
  }) : Dt({
    sourceContent: e(Be),
    kind: e(h)?.kind,
    tags: e(h)?.tags ?? []
  })), yt = r(() => e(zt) === e(Be) ? e(mt) : Dt({
    sourceContent: e(Be),
    kind: e(h)?.kind,
    displayContent: e(mt).hasRenderableText ? e(zt) : "",
    tags: e(h)?.tags ?? [],
    media: e(mt).media
  })), Vt = r(() => {
    const t = new Set(e(yt).previewContent.emojiUrls);
    if (e(Je))
      for (const s of e(se)?.groups ?? [])
        s.emojiUrl && t.add(s.emojiUrl);
    return [...t];
  }), Rn = r(() => e(mt).hasRenderableText), Rt = r(() => !!e(Fe) && e(Rn) && Ye.shouldCollapsePost(e(Fe))), Tt = r(() => e(h) ? `composer-target-preview-content-${e(h).id}` : ""), Gt = r(() => {
    const t = e(a)?.channelContext?.about;
    return t ? va(aa(t), ua) : "";
  }), Tn = r(() => {
    const t = e(a)?.channelContext;
    return t ? t.name?.trim() || `ID: ${Ot(t.eventId, 12, 8)}` : "";
  }), Xt = r(() => {
    const t = e(a)?.channelCreatorPubkey;
    return t ? e(a)?.channelCreatorProfile?.displayName?.trim() || e(a)?.channelCreatorProfile?.name?.trim() || Ot(Ft.npubEncode(t), 12, 4) : "";
  }), $t = r(En), $n = r(() => e(b) === "not-found" || e(b) === "timeout" || e(b) === "network" || e(b) === "channel-unavailable" || e(b) === "nostr-not-ready"), Hn = r(() => e(p) === "debouncing" || e(p) === "event-loading" || e(p) === "channel-loading" || e(p) === "profile-loading");
  const Ze = pr({
    getShow: () => E() && e(Vt).length > 0,
    getEmojiUrls: () => e(Vt),
    onStateChanged: () => Ye.remeasure()
  });
  function Ht() {
    J !== void 0 && (clearTimeout(J), J = void 0), q?.cancel(), q = null;
  }
  function Et() {
    Ve !== void 0 && (clearTimeout(Ve), Ve = void 0), n(ft, !1), n(Ge, void 0);
  }
  function Yt() {
    K.reset(), n(vt, !1), n(wt, null), n(ze, void 0), n(ee, void 0), Et();
  }
  function Jt() {
    U += 1, Ht(), n(j, ""), n(p, "empty"), n(b, null), n(a, null), n(oe, null), n(Y, null), n(ve, 0), n(gt, null), ht.reset(), Yt(), Ze.resetState(), n(Z, [], !0), n(ke, -1), n(Ue, !1), n(pt, null);
  }
  function En() {
    return e(p) === "parsing" ? o()("composerTarget.parsing") : e(p) === "debouncing" || e(p) === "event-loading" ? o()("composerTarget.checking") : e(p) === "channel-loading" ? o()("composerTarget.channelLoading") : e(p) === "profile-loading" ? o()("composerTarget.profileLoading") : e(b) ? e(b) === "unsupported" ? o()("composerTarget.unsupportedFormat") : e(b) === "secret-key" ? o()("composerTarget.secretKey") : e(b) === "invalid" ? o()("composerTarget.invalidFormat") : e(b) === "not-found" ? o()("composerTarget.notFound") : e(b) === "timeout" ? o()("composerTarget.timeout") : e(b) === "mismatch" ? o()("composerTarget.mismatch") : e(b) === "channel-unavailable" ? o()("composerTarget.channelUnavailable") : o()("composerTarget.fetchFailed") : "";
  }
  async function In(t, s) {
    if (!X()) {
      U === s && (n(p, "error"), n(b, "nostr-not-ready"));
      return;
    }
    q = Oe().resolve({
      pointer: t,
      rxNostr: X(),
      relayConfig: D(),
      profileService: k(),
      onPhase: (g) => {
        U === s && n(p, g, !0);
      }
    });
    const l = await q.promise;
    if (!(U !== s || l.status === "cancelled")) {
      if (q = null, l.status === "resolved") {
        n(a, l.target, !0), n(oe, null), n(Y, null), n(p, "ready"), n(b, null);
        return;
      }
      n(oe, l.event ?? null, !0), n(Y, l.authorProfile ?? null, !0), n(p, "error"), n(b, l.reason, !0);
    }
  }
  function Sn() {
    n(ve, e(ve) + 1);
  }
  function It(t) {
    if (!e(a)) return;
    F()(t, {
      source: "manual",
      kind: e(a).event.kind,
      eventId: e(a).event.id,
      relayHints: [...e(a).relayHints],
      authorPubkey: e(a).event.pubkey,
      event: e(a).event,
      channelQuery: e(a).channelQuery
    }) && St();
  }
  function An(t) {
    const s = t.event, l = Date.now(), g = s.kind === 42 && t.channelContext?.channelRelays?.length ? [...t.channelContext.channelRelays] : void 0;
    return {
      id: s.id,
      eventId: s.id,
      pubkeyHex: s.pubkey,
      kind: s.kind,
      content: s.content,
      tags: s.tags.map((Q) => [...Q]),
      createdAt: s.created_at,
      postedAt: s.created_at * 1e3,
      relayHints: [...t.relayHints],
      acceptedRelays: [],
      media: [],
      rawEvent: s,
      ...g ? { channelRelayHints: g } : {},
      updatedAt: l,
      schemaVersion: 1
    };
  }
  function Ln(t, s) {
    s && K.closeAllPostItemMenus(), K.setPostMenuOpen(t, s);
  }
  function Nn(t) {
    K.closeAllPostItemMenus(), n(wt, t, !0), n(vt, !0);
  }
  function Mn(t, s) {
    n(
      Ge,
      {
        eventId: t.eventId,
        ...vn(s.clientX, s.clientY)
      },
      !0
    );
  }
  function Dn(t, s) {
    if (e(Ge)?.eventId === t.eventId)
      return {
        x: e(Ge).x,
        y: e(Ge).y
      };
    const l = s.currentTarget, g = l instanceof HTMLElement ? l.getBoundingClientRect() : null;
    return vn(g ? g.left + g.width / 2 : 0, g ? g.bottom + 8 : 0);
  }
  function On(t, s) {
    Et(), n(jt, t.x, !0), n(qt, t.y, !0), n(
      Kt,
      s.success ? (s.rejectedRelays?.length ?? 0) > 0 || (s.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), n(ft, !0), Ve = setTimeout(
      () => {
        n(ft, !1), Ve = void 0;
      },
      1800
    );
  }
  async function Un(t, s) {
    if (e(ze) === "sending") return;
    const l = U, g = t.eventId, Q = Dn(t, s);
    n(ze, "sending");
    const ie = await ta.broadcast({ post: t, rxNostr: X() });
    U !== l || e(a)?.event.id !== g || (n(ze, void 0), On(Q, ie));
  }
  function Bn(t) {
    fn(t, O()) && K.openDeleteConfirm(t);
  }
  function Fn() {
    K.cancelDeleteConfirm();
  }
  async function jn() {
    const t = K.deleteTargetPost;
    if (!t || e(ee) === "sending") return;
    const s = U, l = t.eventId;
    n(ee, "sending");
    const g = await zr.requestDeletion({ post: t, rxNostr: X() });
    if (!(U !== s || e(a)?.event.id !== l)) {
      if (K.setDeleteConfirmOpen(!1), g.success) {
        n(ee, void 0), St();
        return;
      }
      n(ee, "failed");
    }
  }
  function St() {
    Jt(), we()();
  }
  function qn() {
    e(j).trim().length !== 0 && (n(j, ""), e(Ce)?.focus({ preventScroll: !0 }));
  }
  function Kn(t) {
    t.preventDefault(), e(Ce)?.focus({ preventScroll: !0 });
  }
  function Qn(t) {
    return t instanceof Element && t.closest(".ehagaki-pswp") !== null;
  }
  function Wn(t) {
    Qn(t.target) && t.preventDefault();
  }
  function zn(t) {
    e(Ue) && t.preventDefault();
  }
  function Vn(t) {
    n(Z, t.mediaList, !0), n(ke, t.index, !0), n(pt, t.focusOrigin, !0), n(Ue, !0);
  }
  function Gn() {
    n(Ue, !1), n(Z, [], !0), n(ke, -1), n(pt, null);
  }
  function Xn(t) {
    n(ke, t, !0);
  }
  Ut(() => {
    E() || Jt();
  }), Ut(() => {
    if (!E()) return;
    const t = e(j);
    e(ve);
    const s = ++U;
    Ht(), Yt(), n(a, null), n(oe, null), n(Y, null), n(b, null), n(p, "parsing");
    const l = da(t);
    if (l.status === "empty") {
      n(p, "empty");
      return;
    }
    if (l.status === "unsupported") {
      n(p, "error"), n(b, "unsupported");
      return;
    }
    if (l.status === "secret-key") {
      n(p, "error"), n(b, "secret-key");
      return;
    }
    if (l.status === "invalid") {
      n(p, "error"), n(b, "invalid");
      return;
    }
    const g = l.pointer;
    return n(p, "debouncing"), J = setTimeout(
      () => {
        J = void 0, In(g, s);
      },
      250
    ), () => {
      J !== void 0 && (clearTimeout(J), J = void 0);
    };
  }), vr(() => {
    U += 1, Ht(), Et(), ht.dispose();
  });
  var Yn = {
    get show() {
      return E();
    },
    set show(t) {
      E(t), xe();
    },
    get onClose() {
      return we();
    },
    set onClose(t) {
      we(t), xe();
    },
    get onApply() {
      return F();
    },
    set onApply(t) {
      F(t), xe();
    },
    get rxNostr() {
      return X();
    },
    set rxNostr(t = void 0) {
      X(t), xe();
    },
    get relayConfig() {
      return D();
    },
    set relayConfig(t = null) {
      D(t), xe();
    },
    get profileService() {
      return k();
    },
    set profileService(t = void 0) {
      k(t), xe();
    },
    get resolver() {
      return Oe();
    },
    set resolver(t = gn()) {
      Oe(t), xe();
    },
    get pubkeyHex() {
      return O();
    },
    set pubkeyHex(t = null) {
      O(t), xe();
    }
  }, Zt = Oa(), en = A(Zt);
  {
    const t = (g) => {
      var Q = _e(), ie = A(Q);
      {
        const Re = (le, W) => {
          let et = () => W?.().props;
          {
            let ge = r(() => o()("global.close"));
            Mt(le, br(et, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(ge);
              },
              children: (ue, bt) => {
                var je = ga();
                T((At) => _t(je, "aria-label", At), [() => o()("global.close")]), i(ue, je);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        ct(ie, () => Fr, (le, W) => {
          W(le, { child: Re, $$slots: { child: !0 } });
        });
      }
      i(g, Q);
    };
    let s = r(() => o()("composerTarget.title")), l = r(() => o()("composerTarget.description"));
    Br(en, {
      get open() {
        return E();
      },
      onOpenChange: (g) => !g && St(),
      get title() {
        return e(s);
      },
      get description() {
        return e(l);
      },
      contentClass: "composer-target-dialog",
      footerVariant: "close-button",
      onOpenAutoFocus: Kn,
      onInteractOutside: Wn,
      onEscapeKeydown: zn,
      footer: t,
      children: (g, Q) => {
        var ie = Na();
        {
          const sn = (_) => {
            var P = ba(), I = v(P);
            {
              var te = (R) => {
                Hr(R, {
                  get eventId() {
                    return e(a).channelContext.eventId;
                  },
                  get pictureUrl() {
                    return e(a).channelContext.picture;
                  },
                  get cacheEligible() {
                    return e(a).channelPictureCacheEligible;
                  },
                  alt: "",
                  className: "channel-picture"
                });
              };
              w(I, (R) => {
                e(a)?.channelContext?.picture && R(te);
              });
            }
            var ce = u(I, 2), Te = v(ce), $e = v(Te, !0);
            f(Te);
            var He = u(Te, 2);
            {
              var S = (R) => {
                var L = ha(), Ie = v(L, !0);
                f(L), T(() => $(Ie, e(Gt))), i(R, L);
              };
              w(He, (R) => {
                e(Gt) && R(S);
              });
            }
            var ne = u(He, 2);
            {
              var Ee = (R) => {
                var L = ma(), Ie = v(L);
                f(L), T((tt) => $(Ie, `${tt ?? ""}: ${e(Xt) ?? ""}`), [() => o()("composerTarget.creator")]), i(R, L);
              };
              w(ne, (R) => {
                e(Xt) && R(Ee);
              });
            }
            var qe = u(ne, 2);
            {
              var Ke = (R) => {
                var L = ya(), Ie = v(L, !0);
                f(L), T((tt) => $(Ie, tt), [() => e(a).channelContext.channelRelays.join(`
`)]), i(R, L);
              };
              w(qe, (R) => {
                e(a)?.channelContext?.channelRelays?.length && R(Ke);
              });
            }
            f(ce), f(P), T(() => $($e, e(Tn))), i(_, P);
          };
          var Re = v(ie), le = v(Re, !0);
          f(Re);
          var W = u(Re, 2), et = v(W, !0);
          f(W);
          var ge = u(W, 2), ue = v(ge);
          Rr(ue), un(ue, (_) => n(Ce, _), () => e(Ce));
          var bt = u(ue, 2);
          {
            var je = (_) => {
              {
                let P = r(() => o()("composerTarget.clearInput"));
                Mt(_, {
                  type: "button",
                  className: "composer-target-clear-button",
                  variant: "default",
                  shape: "square",
                  contentLayout: "icon",
                  get ariaLabel() {
                    return e(P);
                  },
                  onClick: qn,
                  get onmousedown() {
                    return dn;
                  },
                  get ontouchstart() {
                    return dn;
                  },
                  children: (I, te) => {
                    var ce = xa();
                    i(I, ce);
                  },
                  $$slots: { default: !0 }
                });
              }
            }, At = r(() => e(j).trim().length > 0);
            w(bt, (_) => {
              e(At) && _(je);
            });
          }
          f(ge);
          var an = u(ge, 2);
          {
            var er = (_) => {
              var P = wa();
              let I;
              var te = v(P);
              {
                var ce = (S) => {
                  Tr(S, {
                    showLoader: !0,
                    get text() {
                      return e($t);
                    },
                    customClass: "composer-target-loading"
                  });
                }, Te = (S) => {
                  var ne = _a(), Ee = v(ne, !0);
                  f(ne), T(() => $(Ee, e($t))), i(S, ne);
                };
                w(te, (S) => {
                  e(Hn) ? S(ce) : S(Te, -1);
                });
              }
              var $e = u(te, 2);
              {
                var He = (S) => {
                  Mt(S, {
                    onClick: Sn,
                    children: (ne, Ee) => {
                      Or();
                      var qe = Ur();
                      T((Ke) => $(qe, Ke), [() => o()("postHistory.contextRetry")]), i(ne, qe);
                    },
                    $$slots: { default: !0 }
                  });
                };
                w($e, (S) => {
                  e($n) && S(He);
                });
              }
              f(P), T(() => I = pn(P, 1, "target-status svelte-19ui8fd", null, I, { error: e(p) === "error" })), i(_, P);
            };
            w(an, (_) => {
              e($t) && _(er);
            });
          }
          var on = u(an, 2);
          {
            var tr = (_) => {
              var P = Aa(), I = v(P);
              let te;
              var ce = v(I);
              {
                var Te = (m) => {
                  sn(m);
                };
                w(ce, (m) => {
                  e(h).kind === 42 && e(a)?.channelContext && m(Te);
                });
              }
              var $e = u(ce, 2), He = v($e);
              {
                let m = r(() => e(Ct)?.picture ?? "");
                _r(He, {
                  get src() {
                    return e(m);
                  },
                  alt: "",
                  rootClassName: "composer-target-avatar",
                  imageClassName: "composer-target-avatar-image",
                  fallbackClassName: "composer-target-avatar-fallback",
                  fallbackAriaLabel: ""
                });
              }
              var S = u(He, 2), ne = v(S, !0);
              f(S);
              var Ee = u(S, 2), qe = v(Ee);
              f(Ee), f($e);
              var Ke = u($e, 2);
              {
                const m = (Ae) => {
                  var he = _e(), rt = A(he);
                  {
                    var at = (z) => {
                      var N = Pa(), Le = A(N);
                      {
                        var ot = (Ne) => {
                          var me = Ca();
                          T(() => _t(me, "id", e(Tt))), i(Ne, me);
                        };
                        w(Le, (Ne) => {
                          e(yt).hasRenderableText || Ne(ot);
                        });
                      }
                      var st = u(Le, 2);
                      Gr(st, {
                        get expanded() {
                          return e(kt);
                        },
                        get controls() {
                          return e(Tt);
                        },
                        onToggle: () => Ye.togglePostExpanded(e(Fe).eventId)
                      }), i(z, N);
                    };
                    w(rt, (z) => {
                      e(Fe) && e(Rt) && z(at);
                    });
                  }
                  i(Ae, he);
                };
                let Se = r(() => Pr({
                  ownerPubkey: O(),
                  structure: e(h),
                  relayHints: e(a)?.relayHints,
                  rxNostr: X(),
                  relayConfig: D()
                })), nt = r(() => e(yt).hasRenderableText && !e(kt) && e(Rt));
                wr(Ke, {
                  get model() {
                    return e(yt);
                  },
                  get loadSensitiveBody() {
                    return e(Se);
                  },
                  get contentWarningEventId() {
                    return e(h).id;
                  },
                  density: "dialog",
                  get emojiLoadStateByUrl() {
                    return Ze.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Ze.emojiImageMetaByUrl;
                  },
                  get previewContentId() {
                    return e(Tt);
                  },
                  contentClass: "event-content",
                  collapsedContentClass: "event-content-collapsed",
                  get renderWhenEmpty() {
                    return e(Rt);
                  },
                  get isTextCollapsed() {
                    return e(nt);
                  },
                  get previewCollapseAction() {
                    return kn;
                  },
                  get previewCollapseEventId() {
                    return e(h).id;
                  },
                  onImageOpen: Vn,
                  betweenContentAndMedia: m,
                  $$slots: { betweenContentAndMedia: !0 }
                });
              }
              var R = u(Ke, 2);
              {
                var L = (m) => {
                  sn(m);
                };
                w(R, (m) => {
                  e(h).kind !== 42 && e(a)?.channelContext && m(L);
                });
              }
              var Ie = u(R, 2);
              {
                var tt = (m) => {
                  var Se = ka(), nt = v(Se, !0);
                  f(Se), T((Ae) => $(nt, Ae), [() => o()("postHistory.deleteFailed")]), i(m, Se);
                };
                w(Ie, (m) => {
                  e(ee) === "failed" && e(a) && m(tt);
                });
              }
              f(I);
              var ln = u(I, 2);
              {
                const m = (Ae) => {
                  var he = _e(), rt = A(he);
                  {
                    var at = (z) => {
                      var N = _e(), Le = A(N);
                      {
                        var ot = (de) => {
                          var pe = _e(), Qe = A(pe);
                          {
                            var it = (Me) => {
                              {
                                const lt = (ye) => {
                                  var De = _e(), re = A(De);
                                  {
                                    var ae = (M) => {
                                      {
                                        let We = r(() => Pn(e(se).totalCount));
                                        ra(M, {
                                          get count() {
                                            return e(se).totalCount;
                                          },
                                          get expanded() {
                                            return e(Je);
                                          },
                                          get ariaLabel() {
                                            return e(We);
                                          },
                                          onToggle: Cn
                                        });
                                      }
                                    };
                                    w(re, (M) => {
                                      e(se) && e(se).totalCount > 0 && M(ae);
                                    });
                                  }
                                  i(ye, De);
                                };
                                let B = r(() => e(Xe).includes("reply") ? () => It("reply") : void 0), V = r(() => e(Xe).includes("quote") ? () => It("quote") : void 0);
                                na(Me, {
                                  get post() {
                                    return e(fe);
                                  },
                                  get onReplyPost() {
                                    return e(B);
                                  },
                                  get onQuotePost() {
                                    return e(V);
                                  },
                                  reactionExtras: lt,
                                  $$slots: { reactionExtras: !0 }
                                });
                              }
                            };
                            w(Qe, (Me) => {
                              e(fe) && Me(it);
                            });
                          }
                          i(de, pe);
                        }, st = r(() => e(Xe).includes("reply") || e(Xe).includes("quote")), Ne = (de) => {
                          var pe = Ta(), Qe = v(pe);
                          {
                            let it = r(() => o()("composerTarget.post")), Me = r(() => o()("composerTarget.post"));
                            Jr(Qe, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return e(it);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => It("channel"),
                              get tooltipContent() {
                                return e(Me);
                              },
                              children: (lt, B) => {
                                var V = Ra();
                                i(lt, V);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                          f(pe), i(de, pe);
                        }, me = r(() => e(Xe).includes("channel"));
                        w(Le, (de) => {
                          e(st) ? de(ot) : e(me) && de(Ne, 1);
                        });
                      }
                      i(z, N);
                    };
                    w(rt, (z) => {
                      e(a) && z(at);
                    });
                  }
                  i(Ae, he);
                }, Se = (Ae) => {
                  var he = _e(), rt = A(he);
                  {
                    var at = (z) => {
                      const N = r(() => e(fe)), Le = r(() => o()("common.showActions"));
                      {
                        const ot = (me) => {
                          var de = Sa(), pe = A(de);
                          ct(pe, () => Bt, (B, V) => {
                            V(B, {
                              class: "menu-action-button",
                              onSelect: () => Nn(e(N).rawEvent),
                              children: (ye, De) => {
                                var re = $a(), ae = u(A(re), 2), M = v(ae, !0);
                                f(ae), T((We) => $(M, We), [() => o()("postHistory.rawJson")]), i(ye, re);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var Qe = u(pe, 2);
                          {
                            var it = (B) => {
                              var V = _e(), ye = A(V);
                              {
                                let De = r(() => e(ze) === "sending");
                                ct(ye, () => Bt, (re, ae) => {
                                  ae(re, {
                                    class: "menu-action-button",
                                    get disabled() {
                                      return e(De);
                                    },
                                    onpointerdown: (M) => Mn(e(N), M),
                                    onSelect: (M) => void Un(e(N), M),
                                    children: (M, We) => {
                                      var Lt = Ha(), ut = u(A(Lt), 2), xt = v(ut, !0);
                                      f(ut), T((Nt) => $(xt, Nt), [() => o()("postHistory.broadcast")]), i(M, Lt);
                                    },
                                    $$slots: { default: !0 }
                                  });
                                });
                              }
                              i(B, V);
                            };
                            w(Qe, (B) => {
                              e(yn) && B(it);
                            });
                          }
                          var Me = u(Qe, 2);
                          {
                            var lt = (B) => {
                              var V = Ia(), ye = A(V);
                              ct(ye, () => Zr, (re, ae) => {
                                ae(re, { class: "post-history-menu-separator" });
                              });
                              var De = u(ye, 2);
                              {
                                let re = r(() => e(ee) === "sending");
                                ct(De, () => Bt, (ae, M) => {
                                  M(ae, {
                                    class: "menu-action-button menu-action-button-danger",
                                    get disabled() {
                                      return e(re);
                                    },
                                    onSelect: () => Bn(e(N)),
                                    children: (We, Lt) => {
                                      var ut = Ea(), xt = u(A(ut), 2), Nt = v(xt, !0);
                                      f(xt), T((ir) => $(Nt, ir), [
                                        () => e(ee) === "sending" ? o()("postHistory.deleteSending") : o()("postHistory.delete")
                                      ]), i(We, ut);
                                    },
                                    $$slots: { default: !0 }
                                  });
                                });
                              }
                              i(B, V);
                            };
                            w(Me, (B) => {
                              e(bn) && B(lt);
                            });
                          }
                          i(me, de);
                        };
                        let st = r(() => K.isPostMenuOpen(e(N).eventId)), Ne = r(() => $r(e(N).postedAt, H()));
                        Xr(z, {
                          get open() {
                            return e(st);
                          },
                          onOpenChange: (me) => Ln(e(N).eventId, me),
                          get triggerAriaLabel() {
                            return e(Le);
                          },
                          get tooltipContent() {
                            return e(Le);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return e(Ne);
                          },
                          items: ot,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    w(rt, (z) => {
                      e(fe) && z(at);
                    });
                  }
                  i(Ae, he);
                };
                let nt = r(() => kr(e(mn)));
                Vr(ln, {
                  get formattedDate() {
                    return e(nt);
                  },
                  actions: m,
                  trailing: Se,
                  $$slots: { actions: !0, trailing: !0 }
                });
              }
              var or = u(ln, 2);
              {
                var sr = (m) => {
                  Yr(m, {
                    get readModel() {
                      return e(se);
                    },
                    get emojiLoadStateByUrl() {
                      return Ze.emojiLoadStateByUrl;
                    },
                    get emojiImageMetaByUrl() {
                      return Ze.emojiImageMetaByUrl;
                    }
                  });
                };
                w(or, (m) => {
                  e(se) && e(se).totalCount > 0 && e(Je) && m(sr);
                });
              }
              f(P), un(P, (m) => n(Pe, m), () => e(Pe)), T(
                (m) => {
                  _t(P, "aria-label", m), te = pn(I, 1, "target-preview-body svelte-19ui8fd", null, te, {
                    "channel-first": e(h).kind === 42 && !!e(a)?.channelContext
                  }), $(ne, e(xn)), $(qe, `kind ${e(h).kind ?? ""}`);
                },
                [() => o()("composerTarget.preview")]
              ), i(_, P);
            };
            w(on, (_) => {
              e(h) && _(tr);
            });
          }
          var nr = u(on, 2);
          {
            var rr = (_) => {
              var P = La(), I = v(P, !0);
              f(P), T((te) => $(I, te), [() => o()("composerTarget.unsupportedKind")]), i(_, P);
            }, ar = r(() => e(a) && ![1, 40, 42, 1111].includes(e(a).event.kind));
            w(nr, (_) => {
              e(ar) && _(rr);
            });
          }
          f(ie), T(
            (_, P, I) => {
              $(le, _), $(et, P), _t(ue, "placeholder", I);
            },
            [
              () => o()("composerTarget.title"),
              () => o()("composerTarget.inputLabel"),
              () => o()("composerTarget.placeholder")
            ]
          ), fr(ue, () => e(j), (_) => n(j, _));
        }
        i(g, ie);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var tn = u(en, 2);
  Qr(tn, {
    get open() {
      return e(vt);
    },
    get rawEvent() {
      return e(wt);
    },
    onOpenChange: (t) => n(vt, t, !0)
  });
  var nn = u(tn, 2);
  {
    const t = (Re) => {
      var le = Ma(), W = v(le), et = v(W, !0);
      f(W);
      var ge = u(W, 2), ue = v(ge, !0);
      f(ge), f(le), T(
        (bt, je) => {
          $(et, bt), $(ue, je);
        },
        [
          () => o()("postHistory.deleteRequestDescription"),
          () => o()("postHistory.deleteRequestWarning")
        ]
      ), i(Re, le);
    };
    let s = r(() => o()("postHistory.deleteRequestTitle")), l = r(() => o()("postHistory.deleteRequestDescription")), g = r(() => e(ee) === "sending" ? o()("postHistory.deleteSending") : o()("postHistory.deleteConfirm")), Q = r(() => o()("postHistory.deleteCancel")), ie = r(() => e(ee) === "sending");
    gr(nn, {
      get open() {
        return K.deleteConfirmOpen;
      },
      get onOpenChange() {
        return K.setDeleteConfirmOpen;
      },
      get title() {
        return e(s);
      },
      get description() {
        return e(l);
      },
      get confirmLabel() {
        return e(g);
      },
      get cancelLabel() {
        return e(Q);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return e(ie);
      },
      onConfirm: jn,
      onCancel: Fn,
      contentClass: "post-history-delete-confirm",
      children: t,
      $$slots: { default: !0 }
    });
  }
  var rn = u(nn, 2);
  {
    let t = r(() => e(Z)[e(ke)]?.src ?? ""), s = r(() => e(Z)[e(ke)]?.alt ?? "");
    hr(rn, {
      get src() {
        return e(t);
      },
      get alt() {
        return e(s);
      },
      onClose: Gn,
      get mediaList() {
        return e(Z);
      },
      get currentIndex() {
        return e(ke);
      },
      onNavigate: Xn,
      get openingFocusOrigin() {
        return e(pt);
      },
      get show() {
        return e(Ue);
      },
      set show(l) {
        n(Ue, l, !0);
      }
    });
  }
  var Jn = u(rn, 2);
  mr(Jn, {
    get show() {
      return e(ft);
    },
    get x() {
      return e(jt);
    },
    get y() {
      return e(qt);
    },
    children: (t, s) => {
      var l = Da(), g = v(l, !0);
      f(l), T((Q) => $(g, Q), [() => o()(e(Kt))]), i(t, l);
    },
    $$slots: { default: !0 }
  }), i(c, Zt);
  var Zn = Mr(Yn);
  return y(), Zn;
}
Dr(
  Ba,
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
  Ba as default
};
