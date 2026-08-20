import { J as Yn, d7 as Zn, cU as er, dZ as tr, R as rt, ee as nr, ch as Ot, a7 as rr, a8 as me, d_ as ar, ci as or, ab as nn, aa as x, aJ as ir, aK as sr, aW as lr, ac as cr, bi as tt, ae as ft, bh as At, bl as ur, aj as rn, ak as dr, cR as St, ce as an, bo as pr, br as on, ad as sn, bw as vr, cQ as fr, cS as gr, by as Lt, ag as hr, d4 as mr, ef as yr, b_ as br, d9 as ln } from "./App-B-vAJu8d.js";
import { a_ as _r, aQ as w, aJ as xr, a as e, aN as cn, b as n, b0 as L, Z as T, b1 as s, b6 as v, b2 as wr, aP as a, b3 as ye, a$ as nt, bh as R, bd as l, b8 as p, b4 as Cr, b7 as f, bf as Nt, bg as kr } from "./entry-y-09yyZ0.js";
import { b as Pr } from "./input-BsTyw8KX.js";
import { D as $r, a as Tr } from "./DialogWrapper-Cz7-m3ip.js";
import { u as Rr, c as Er, d as Ir, p as Hr, P as Ar, h as Sr, b as Lr, j as Dt, M as Mt, a as Nr, r as Dr, g as un, i as Mr } from "./postBroadcastService-CqibkaTv.js";
function pn(d) {
  return d.cache?.resolutionQuality === "verified-root-only" || d.cache?.resolutionQuality === "verified-metadata";
}
const Or = /* @__PURE__ */ new Set([
  "missing-channel-root",
  "invalid-channel-root",
  "conflicting-channel-roots"
]);
function Fr(d) {
  return d.some((u) => Or.has(u));
}
function Ur(d, u) {
  return pn(u.snapshot) ? u.snapshot : d;
}
function dn(d = {}) {
  const u = d.replyQuoteService ?? new Yn(), r = d.channelCoordinator ?? Zn, E = d.verifyEventFn ?? ((m) => er(m) && tr(m));
  function J(m) {
    let N = !1, be = null, j = null;
    return {
      promise: (async () => {
        m.onPhase?.("event-loading"), be = u.fetchReferencedEventTask(
          m.pointer.eventId,
          m.pointer.relayHints,
          m.rxNostr,
          m.relayConfig
        );
        const q = await be.promise;
        if (N || q.status === "cancelled")
          return { status: "cancelled" };
        if (q.status === "not-found")
          return { status: "error", reason: "not-found" };
        if (q.status === "timeout")
          return { status: "error", reason: "timeout" };
        if (q.status === "error")
          return { status: "error", reason: "network" };
        const C = q.event;
        if (!E(C))
          return { status: "error", reason: "invalid-event" };
        if (C.id !== m.pointer.eventId || m.pointer.authorHint && C.pubkey !== m.pointer.authorHint || m.pointer.kindHint !== null && C.kind !== m.pointer.kindHint)
          return { status: "error", reason: "mismatch" };
        const oe = rt.sanitizeExternalRelayUrls(
          [
            ...m.pointer.relayHints,
            ...q.relayUrl ? [q.relayUrl] : []
          ],
          { limit: rt.EXTERNAL_INPUT_RELAY_LIMIT }
        ), ve = m.profileService ? m.profileService.fetchProfileRealtime(C.pubkey, {
          additionalRelays: oe
        }).catch(() => null) : Promise.resolve(null);
        let V = null, fe = null, W = null, y = !1;
        if (C.kind === 40 || C.kind === 42) {
          const X = C.kind === 42 ? nr(C) : null, ie = C.kind === 40 ? C.id : X?.channelEventId ?? null;
          if (!ie || C.kind === 42 && X && Fr(X.issues)) {
            const se = await ve;
            return {
              status: "error",
              reason: "channel-unavailable",
              event: C,
              relayHints: oe,
              authorProfile: se
            };
          }
          m.onPhase?.("channel-loading"), j = r.resolveInternal(
            {
              eventId: ie,
              relayHints: rt.sanitizeExternalRelayUrls(
                [
                  ...X?.channelRelayHints ?? [],
                  ...oe
                ]
              )
            },
            m.rxNostr,
            m.relayConfig
          );
          const Le = await j.cacheReady, U = await j.refresh;
          if (N) return { status: "cancelled" };
          const S = Ur(Le, U);
          if (!pn(S)) {
            const se = await ve;
            return {
              status: "error",
              reason: "channel-unavailable",
              event: C,
              relayHints: oe,
              authorProfile: se
            };
          }
          V = S.context, y = S.cache?.resolutionQuality === "verified-metadata", W = S.cache?.creatorPubkey ?? null, fe = {
            eventId: ie,
            relayHints: [...S.cache?.relayHints ?? []]
          };
        }
        let h = null, o = null;
        if (m.profileService) {
          if (m.onPhase?.("profile-loading"), [h, o] = await Promise.all([
            ve,
            W && W !== C.pubkey ? m.profileService.fetchProfileRealtime(
              W,
              {
                additionalRelays: fe?.relayHints ?? []
              }
            ).catch(() => null) : Promise.resolve(null)
          ]), N) return { status: "cancelled" };
          W === C.pubkey && (o = h);
        }
        return {
          status: "resolved",
          target: {
            event: C,
            relayHints: oe,
            authorProfile: h,
            channelContext: V,
            channelCreatorPubkey: W,
            channelCreatorProfile: o,
            channelQuery: fe,
            channelPictureCacheEligible: y
          }
        };
      })().catch(
        () => N ? { status: "cancelled" } : { status: "error", reason: "network" }
      ).finally(() => {
        j?.release(), j = null;
      }),
      cancel() {
        N = !0, be?.cancel(), j?.release(), j = null;
      }
    };
  }
  return { resolve: J };
}
const Br = 5e3, jr = 200, qr = 2e3;
function Qr(d) {
  if (d.length > Br)
    return { status: "invalid", reason: "too-long" };
  const u = d.trim();
  if (!u)
    return { status: "empty" };
  const r = u.startsWith("nostr:") ? u.slice(6) : u;
  if (!r)
    return { status: "invalid", reason: "invalid-format" };
  try {
    const E = Ot.decode(r);
    if (E.type === "note")
      return {
        status: "supported",
        pointer: {
          format: "note",
          eventId: E.data,
          relayHints: [],
          authorHint: null,
          kindHint: null
        }
      };
    if (E.type === "nevent") {
      const J = E.data;
      return {
        status: "supported",
        pointer: {
          format: "nevent",
          eventId: J.id,
          relayHints: rt.sanitizeExternalRelayUrls(
            J.relays,
            { limit: rt.EXTERNAL_INPUT_RELAY_LIMIT }
          ),
          authorHint: J.author ?? null,
          kindHint: typeof J.kind == "number" ? J.kind : null
        }
      };
    }
    return E.type === "npub" || E.type === "nprofile" || E.type === "naddr" ? { status: "unsupported", format: E.type } : E.type === "nsec" ? { status: "secret-key" } : { status: "invalid", reason: "invalid-format" };
  } catch {
    return { status: "invalid", reason: "invalid-format" };
  }
}
function Kr(d, u) {
  return d === 1 ? ["reply", "quote"] : d === 40 ? u ? ["channel"] : [] : d === 42 ? u ? ["reply", "quote"] : [] : [];
}
function zr(d, u) {
  const r = Array.from(d);
  return r.length <= u ? d : `${r.slice(0, u).join("")}…`;
}
function Gr(d, u = qr) {
  if (d.length <= u)
    return {
      content: d,
      exceedsRenderLimit: !1
    };
  let r = u;
  const E = d.charCodeAt(r - 1);
  return E >= 55296 && E <= 56319 && (r -= 1), {
    content: d.slice(0, r),
    exceedsRenderLimit: !0
  };
}
var Jr = p('<div class="xmark-icon svg-icon svelte-19ui8fd"></div>'), Vr = p('<p class="svelte-19ui8fd"> </p>'), Wr = p('<span class="channel-creator svelte-19ui8fd"> </span>'), Xr = p('<span class="channel-relays svelte-19ui8fd"> </span>'), Yr = p('<div class="channel-preview svelte-19ui8fd"><!> <div class="channel-text svelte-19ui8fd"><strong class="channel-name svelte-19ui8fd"> </strong> <!> <!> <!></div></div>'), Zr = p('<div class="clear-input-icon svg-icon svelte-19ui8fd" aria-hidden="true"></div>'), ea = p('<p class="svelte-19ui8fd"> </p>'), ta = p('<div aria-live="polite"><!> <!></div>'), na = p('<span hidden="" aria-hidden="true" class="svelte-19ui8fd"></span>'), ra = p("<!> <!>", 1), aa = p('<p class="delete-failed svelte-19ui8fd"> </p>'), oa = p('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), ia = p('<div class="post-preview-action-buttons-group"><!> <div class="post-preview-footer-replies-slot"></div></div>'), sa = p('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), la = p('<!> <div class="post-preview-footer-reaction-slot"></div>', 1), ca = p('<div class="post-icon svg-icon" aria-hidden="true"></div>'), ua = p("<!> <!> <!>", 1), da = p('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), pa = p('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), va = p('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), fa = p("<!> <!>", 1), ga = p("<!> <!> <!>", 1), ha = p('<section class="target-preview svelte-19ui8fd"><div><!> <div class="event-author svelte-19ui8fd"><!> <span class="svelte-19ui8fd"> </span> <span class="event-kind svelte-19ui8fd"> </span></div> <!> <!> <!></div> <!></section>'), ma = p('<p class="unsupported-kind svelte-19ui8fd"> </p>'), ya = p('<div class="composer-target-content svelte-19ui8fd"><h2 class="svelte-19ui8fd"> </h2> <label class="target-input-label svelte-19ui8fd" for="composer-target-input"> </label> <div class="composer-target-input-shell svelte-19ui8fd"><input id="composer-target-input" type="text" inputmode="text" autocomplete="off" spellcheck="false" class="svelte-19ui8fd"/> <!></div> <!> <!> <!></div>'), ba = p('<div class="delete-confirm-body svelte-19ui8fd"><p class="delete-confirm-description svelte-19ui8fd"> </p> <p class="delete-confirm-warning svelte-19ui8fd"> </p></div>'), _a = p("<div> </div>"), xa = p("<!> <!> <!> <!> <!>", 1);
const wa = {
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
    .channel-relays.svelte-19ui8fd {color:var(--text-muted);font-size:0.85rem;}.target-status.svelte-19ui8fd {display:grid;gap:8px;color:var(--text-muted);}.target-status.error.svelte-19ui8fd {color:var(--danger);}.composer-target-loading {justify-content:flex-start;padding:0;}.target-preview.svelte-19ui8fd {display:grid;border:1px solid var(--border-hr);background:var(--bg-input);}.target-preview .post-preview-footer {--post-history-preview-footer-surface: var(--bg-input);}.target-preview .post-preview-footer-replies-slot {flex:0 1 36px;min-width:0;}.target-preview .post-preview-footer-reaction-slot {flex:0 1 70px;min-width:0;}.target-preview-body.svelte-19ui8fd {display:grid;gap:10px;padding:12px;}.event-author.svelte-19ui8fd {display:flex;align-items:center;gap:8px;min-width:0;}.event-author.svelte-19ui8fd > span:where(.svelte-19ui8fd):first-of-type {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.event-kind.svelte-19ui8fd {margin-inline-start:auto;white-space:nowrap;}.composer-target-avatar {width:36px;height:36px;flex:0 0 auto;}.composer-target-avatar-image,
    .composer-target-avatar-fallback {width:100%;height:100%;border-radius:50%;}.target-preview .event-content,
    .channel-preview.svelte-19ui8fd p:where(.svelte-19ui8fd) {white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}.target-preview .event-content-collapsed {max-height:calc(5 * 1.45em);overflow:hidden;}.channel-preview.svelte-19ui8fd {display:flex;gap:10px;padding-top:10px;border-top:1px solid var(--border-hr);}.target-preview-body.channel-first.svelte-19ui8fd .channel-preview:where(.svelte-19ui8fd) {padding-top:0;border-top:0;}.target-preview-body.channel-first.svelte-19ui8fd .event-author:where(.svelte-19ui8fd) {padding-top:10px;border-top:1px solid var(--border-hr);}.channel-preview .channel-picture {width:48px;height:48px;flex:0 0 auto;object-fit:cover;}.channel-text.svelte-19ui8fd {display:grid;gap:4px;min-width:0;}.channel-name.svelte-19ui8fd {min-width:0;overflow-wrap:anywhere;}.channel-relays.svelte-19ui8fd {white-space:pre-wrap;overflow-wrap:anywhere;}.delete-failed.svelte-19ui8fd {margin:0;color:var(--danger);}.delete-confirm-body.svelte-19ui8fd {display:flex;flex-direction:column;justify-content:center;gap:0.5rem;margin:10px 0 30px;margin-inline:auto;text-align:start;}.delete-confirm-description.svelte-19ui8fd,
    .delete-confirm-warning.svelte-19ui8fd {margin:0;line-height:1.5;}.delete-confirm-warning.svelte-19ui8fd {color:var(--text-light);font-size:0.875rem;}.target-preview .post-icon {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.post-history-menu-content .menu-action-button .raw-json-icon {mask-image:var(--ehagaki-icon-646174615f6f626a6563745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .broadcast-icon {mask-image:var(--ehagaki-icon-63656c6c5f746f7765725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}.post-history-menu-content .menu-action-button .trash-icon {mask-image:var(--ehagaki-icon-64656c6574655f666f72657665725f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:currentColor;}`
};
function Ca(d, u) {
  _r(u, !0), rr(d, wa);
  const r = () => rn(dr, "$_", J), E = () => rn(br, "$locale", J), [J, m] = cr();
  let N = me(u, "show", 7), be = me(u, "onClose", 7), j = me(u, "onApply", 7), _e = me(u, "rxNostr", 7, void 0), q = me(u, "relayConfig", 7, null), C = me(u, "profileService", 7, void 0), oe = me(u, "resolver", 23, dn), ve = me(u, "pubkeyHex", 7, null), V = w(""), fe = w(null), W = w(null), y = w("empty"), h = w(null), o = w(null), X = w(null), ie = w(null), Le = w(0), U = 0, S, se = null, Ne = w(xr([])), xe = w(-1), De = w(!1), at = w(null);
  const Q = Rr();
  let ot = w(!1), gt = w(null), qe = w(void 0), Y = w(void 0), it = w(!1), Ft = w(0), Ut = w(0), Bt = w("postHistory.broadcastSent"), Qe, Ke = w(void 0), ht = a(() => e(o) ? Kr(e(o).event.kind, e(o).event.kind === 1 || !!e(o).channelQuery) : []), P = a(() => e(o)?.event ?? e(X)), vn = a(() => e(P) ? e(P).created_at * 1e3 : 0), Me = a(() => e(o) ? Pn(e(o)) : null), fn = a(() => e(Me) ? Dr(e(Me)) !== null : !1), gn = a(() => e(Me) ? un(e(Me), ve()) : !1), mt = a(() => e(o)?.authorProfile ?? e(ie)), hn = a(() => {
    const t = e(P)?.pubkey;
    return t ? e(mt)?.displayName?.trim() || e(mt)?.name?.trim() || Lt(Ot.npubEncode(t), 12, 4) : "";
  }), Oe = a(() => {
    const t = e(P)?.content;
    return !t || e(P)?.kind === 40 ? "" : t;
  }), yt = a(() => Gr(e(Oe))), jt = a(() => e(P) && e(Oe) ? [
    {
      eventId: e(P).id,
      content: e(yt).content,
      forceCollapsible: e(yt).exceedsRenderLimit
    }
  ] : []);
  const ze = Er({
    getShow: () => N(),
    getPosts: () => e(jt),
    getContainer: () => e(W)
  }), mn = ze.previewRef;
  let Fe = a(() => e(jt)[0]), bt = a(() => e(Fe) ? ze.isPostExpanded(e(Fe)) : !1), qt = a(() => an(e(bt) ? e(Oe) : e(yt).content)), st = a(() => e(P)?.kind === 40 ? St({ sourceContent: "", displayContent: "", tags: [], media: [] }) : St({
    sourceContent: e(Oe),
    tags: e(P)?.tags ?? []
  })), Ge = a(() => e(qt) === e(Oe) ? e(st) : St({
    sourceContent: e(Oe),
    displayContent: e(st).hasRenderableText ? e(qt) : "",
    tags: e(P)?.tags ?? [],
    media: e(st).media
  })), yn = a(() => e(st).hasRenderableText), _t = a(() => !!e(Fe) && e(yn) && ze.shouldCollapsePost(e(Fe))), xt = a(() => e(P) ? `composer-target-preview-content-${e(P).id}` : ""), Qt = a(() => {
    const t = e(o)?.channelContext?.about;
    return t ? zr(an(t), jr) : "";
  }), bn = a(() => {
    const t = e(o)?.channelContext;
    return t ? t.name?.trim() || `ID: ${Lt(t.eventId, 12, 8)}` : "";
  }), Kt = a(() => {
    const t = e(o)?.channelCreatorPubkey;
    return t ? e(o)?.channelCreatorProfile?.displayName?.trim() || e(o)?.channelCreatorProfile?.name?.trim() || Lt(Ot.npubEncode(t), 12, 4) : "";
  }), wt = a(wn), _n = a(() => e(h) === "not-found" || e(h) === "timeout" || e(h) === "network" || e(h) === "channel-unavailable" || e(h) === "nostr-not-ready"), xn = a(() => e(y) === "debouncing" || e(y) === "event-loading" || e(y) === "channel-loading" || e(y) === "profile-loading");
  const Ct = ar({
    getShow: () => N() && e(Ge).previewContent.emojiUrls.length > 0,
    getEmojiUrls: () => e(Ge).previewContent.emojiUrls,
    onStateChanged: () => ze.remeasure()
  });
  function kt() {
    S !== void 0 && (clearTimeout(S), S = void 0), se?.cancel(), se = null;
  }
  function Pt() {
    Qe !== void 0 && (clearTimeout(Qe), Qe = void 0), n(it, !1), n(Ke, void 0);
  }
  function zt() {
    Q.reset(), n(ot, !1), n(gt, null), n(qe, void 0), n(Y, void 0), Pt();
  }
  function Gt() {
    U += 1, kt(), n(V, ""), n(y, "empty"), n(h, null), n(o, null), n(X, null), n(ie, null), n(Le, 0), zt(), Ct.resetState(), n(Ne, [], !0), n(xe, -1), n(De, !1), n(at, null);
  }
  function wn() {
    return e(y) === "parsing" ? r()("composerTarget.parsing") : e(y) === "debouncing" || e(y) === "event-loading" ? r()("composerTarget.checking") : e(y) === "channel-loading" ? r()("composerTarget.channelLoading") : e(y) === "profile-loading" ? r()("composerTarget.profileLoading") : e(h) ? e(h) === "unsupported" ? r()("composerTarget.unsupportedFormat") : e(h) === "secret-key" ? r()("composerTarget.secretKey") : e(h) === "invalid" ? r()("composerTarget.invalidFormat") : e(h) === "not-found" ? r()("composerTarget.notFound") : e(h) === "timeout" ? r()("composerTarget.timeout") : e(h) === "mismatch" ? r()("composerTarget.mismatch") : e(h) === "channel-unavailable" ? r()("composerTarget.channelUnavailable") : r()("composerTarget.fetchFailed") : "";
  }
  async function Cn(t, i) {
    if (!_e()) {
      U === i && (n(y, "error"), n(h, "nostr-not-ready"));
      return;
    }
    se = oe().resolve({
      pointer: t,
      rxNostr: _e(),
      relayConfig: q(),
      profileService: C(),
      onPhase: (g) => {
        U === i && n(y, g, !0);
      }
    });
    const c = await se.promise;
    if (!(U !== i || c.status === "cancelled")) {
      if (se = null, c.status === "resolved") {
        n(o, c.target, !0), n(X, null), n(ie, null), n(y, "ready"), n(h, null);
        return;
      }
      n(X, c.event ?? null, !0), n(ie, c.authorProfile ?? null, !0), n(y, "error"), n(h, c.reason, !0);
    }
  }
  function kn() {
    n(Le, e(Le) + 1);
  }
  function $t(t) {
    if (!e(o)) return;
    j()(t, {
      source: "manual",
      kind: e(o).event.kind,
      eventId: e(o).event.id,
      relayHints: [...e(o).relayHints],
      authorPubkey: e(o).event.pubkey,
      event: e(o).event,
      channelQuery: e(o).channelQuery
    }) && Tt();
  }
  function Pn(t) {
    const i = t.event, c = Date.now(), g = i.kind === 42 && t.channelContext?.channelRelays?.length ? [...t.channelContext.channelRelays] : void 0;
    return {
      id: i.id,
      eventId: i.id,
      pubkeyHex: i.pubkey,
      kind: i.kind,
      content: i.content,
      tags: i.tags.map((K) => [...K]),
      createdAt: i.created_at,
      postedAt: i.created_at * 1e3,
      relayHints: [...t.relayHints],
      acceptedRelays: [],
      media: [],
      rawEvent: i,
      ...g ? { channelRelayHints: g } : {},
      updatedAt: c,
      schemaVersion: 1
    };
  }
  function $n(t, i) {
    i && Q.closeAllPostItemMenus(), Q.setPostMenuOpen(t, i);
  }
  function Tn(t) {
    Q.closeAllPostItemMenus(), n(gt, t, !0), n(ot, !0);
  }
  function Rn(t, i) {
    n(
      Ke,
      {
        eventId: t.eventId,
        ...ln(i.clientX, i.clientY)
      },
      !0
    );
  }
  function En(t, i) {
    if (e(Ke)?.eventId === t.eventId)
      return {
        x: e(Ke).x,
        y: e(Ke).y
      };
    const c = i.currentTarget, g = c instanceof HTMLElement ? c.getBoundingClientRect() : null;
    return ln(g ? g.left + g.width / 2 : 0, g ? g.bottom + 8 : 0);
  }
  function In(t, i) {
    Pt(), n(Ft, t.x, !0), n(Ut, t.y, !0), n(
      Bt,
      i.success ? (i.rejectedRelays?.length ?? 0) > 0 || (i.timedOutRelays?.length ?? 0) > 0 ? "postHistory.broadcastPartial" : "postHistory.broadcastSent" : "postHistory.broadcastFailed",
      !0
    ), n(it, !0), Qe = setTimeout(
      () => {
        n(it, !1), Qe = void 0;
      },
      1800
    );
  }
  async function Hn(t, i) {
    if (e(qe) === "sending") return;
    const c = U, g = t.eventId, K = En(t, i);
    n(qe, "sending");
    const le = await Mr.broadcast({ post: t, rxNostr: _e() });
    U !== c || e(o)?.event.id !== g || (n(qe, void 0), In(K, le));
  }
  function An(t) {
    un(t, ve()) && Q.openDeleteConfirm(t);
  }
  function Sn() {
    Q.cancelDeleteConfirm();
  }
  async function Ln() {
    const t = Q.deleteTargetPost;
    if (!t || e(Y) === "sending") return;
    const i = U, c = t.eventId;
    n(Y, "sending");
    const g = await Hr.requestDeletion({ post: t, rxNostr: _e() });
    if (!(U !== i || e(o)?.event.id !== c)) {
      if (Q.setDeleteConfirmOpen(!1), g.success) {
        n(Y, void 0), Tt();
        return;
      }
      n(Y, "failed");
    }
  }
  function Tt() {
    Gt(), be()();
  }
  function Nn() {
    e(V).trim().length !== 0 && (n(V, ""), e(fe)?.focus({ preventScroll: !0 }));
  }
  function Dn(t) {
    t.preventDefault(), e(fe)?.focus({ preventScroll: !0 });
  }
  function Mn(t) {
    return t instanceof Element && t.closest(".ehagaki-pswp") !== null;
  }
  function On(t) {
    Mn(t.target) && t.preventDefault();
  }
  function Fn(t) {
    e(De) && t.preventDefault();
  }
  function Un(t) {
    n(Ne, t.mediaList, !0), n(xe, t.index, !0), n(at, t.focusOrigin, !0), n(De, !0);
  }
  function Bn() {
    n(De, !1), n(Ne, [], !0), n(xe, -1), n(at, null);
  }
  function jn(t) {
    n(xe, t, !0);
  }
  cn(() => {
    N() || Gt();
  }), cn(() => {
    if (!N()) return;
    const t = e(V);
    e(Le);
    const i = ++U;
    kt(), zt(), n(o, null), n(X, null), n(ie, null), n(h, null), n(y, "parsing");
    const c = Qr(t);
    if (c.status === "empty") {
      n(y, "empty");
      return;
    }
    if (c.status === "unsupported") {
      n(y, "error"), n(h, "unsupported");
      return;
    }
    if (c.status === "secret-key") {
      n(y, "error"), n(h, "secret-key");
      return;
    }
    if (c.status === "invalid") {
      n(y, "error"), n(h, "invalid");
      return;
    }
    const g = c.pointer;
    return n(y, "debouncing"), S = setTimeout(
      () => {
        S = void 0, Cn(g, i);
      },
      250
    ), () => {
      S !== void 0 && (clearTimeout(S), S = void 0);
    };
  }), or(() => {
    U += 1, kt(), Pt();
  });
  var qn = {
    get show() {
      return N();
    },
    set show(t) {
      N(t), ye();
    },
    get onClose() {
      return be();
    },
    set onClose(t) {
      be(t), ye();
    },
    get onApply() {
      return j();
    },
    set onApply(t) {
      j(t), ye();
    },
    get rxNostr() {
      return _e();
    },
    set rxNostr(t = void 0) {
      _e(t), ye();
    },
    get relayConfig() {
      return q();
    },
    set relayConfig(t = null) {
      q(t), ye();
    },
    get profileService() {
      return C();
    },
    set profileService(t = void 0) {
      C(t), ye();
    },
    get resolver() {
      return oe();
    },
    set resolver(t = dn()) {
      oe(t), ye();
    },
    get pubkeyHex() {
      return ve();
    },
    set pubkeyHex(t = null) {
      ve(t), ye();
    }
  }, Jt = xa(), Vt = L(Jt);
  {
    const t = (g) => {
      var K = nt(), le = L(K);
      {
        const we = (ce, z) => {
          let Je = () => z?.().props;
          {
            let ge = a(() => r()("global.close"));
            At(ce, ur(Je, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(ge);
              },
              children: (ue, lt) => {
                var Ue = Jr();
                T((Rt) => ft(Ue, "aria-label", Rt), [() => r()("global.close")]), s(ue, Ue);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        tt(le, () => Tr, (ce, z) => {
          z(ce, { child: we, $$slots: { child: !0 } });
        });
      }
      s(g, K);
    };
    let i = a(() => r()("composerTarget.title")), c = a(() => r()("composerTarget.description"));
    $r(Vt, {
      get open() {
        return N();
      },
      onOpenChange: (g) => !g && Tt(),
      get title() {
        return e(i);
      },
      get description() {
        return e(c);
      },
      contentClass: "composer-target-dialog",
      footerVariant: "close-button",
      onOpenAutoFocus: Dn,
      onInteractOutside: On,
      onEscapeKeydown: Fn,
      footer: t,
      children: (g, K) => {
        var le = ya();
        {
          const tn = (b) => {
            var _ = Yr(), I = v(_);
            {
              var Z = ($) => {
                yr($, {
                  get eventId() {
                    return e(o).channelContext.eventId;
                  },
                  get pictureUrl() {
                    return e(o).channelContext.picture;
                  },
                  get cacheEligible() {
                    return e(o).channelPictureCacheEligible;
                  },
                  alt: "",
                  className: "channel-picture"
                });
              };
              x(I, ($) => {
                e(o)?.channelContext?.picture && $(Z);
              });
            }
            var de = l(I, 2), Ce = v(de), ke = v(Ce, !0);
            f(Ce);
            var Pe = l(Ce, 2);
            {
              var H = ($) => {
                var D = Vr(), Te = v(D, !0);
                f(D), T(() => R(Te, e(Qt))), s($, D);
              };
              x(Pe, ($) => {
                e(Qt) && $(H);
              });
            }
            var ee = l(Pe, 2);
            {
              var $e = ($) => {
                var D = Wr(), Te = v(D);
                f(D), T((Ve) => R(Te, `${Ve ?? ""}: ${e(Kt) ?? ""}`), [() => r()("composerTarget.creator")]), s($, D);
              };
              x(ee, ($) => {
                e(Kt) && $($e);
              });
            }
            var Be = l(ee, 2);
            {
              var je = ($) => {
                var D = Xr(), Te = v(D, !0);
                f(D), T((Ve) => R(Te, Ve), [() => e(o).channelContext.channelRelays.join(`
`)]), s($, D);
              };
              x(Be, ($) => {
                e(o)?.channelContext?.channelRelays?.length && $(je);
              });
            }
            f(de), f(_), T(() => R(ke, e(bn))), s(b, _);
          };
          var we = v(le), ce = v(we, !0);
          f(we);
          var z = l(we, 2), Je = v(z, !0);
          f(z);
          var ge = l(z, 2), ue = v(ge);
          pr(ue), nn(ue, (b) => n(fe, b), () => e(fe));
          var lt = l(ue, 2);
          {
            var Ue = (b) => {
              {
                let _ = a(() => r()("composerTarget.clearInput"));
                At(b, {
                  type: "button",
                  className: "composer-target-clear-button",
                  variant: "default",
                  shape: "square",
                  contentLayout: "icon",
                  get ariaLabel() {
                    return e(_);
                  },
                  onClick: Nn,
                  get onmousedown() {
                    return on;
                  },
                  get ontouchstart() {
                    return on;
                  },
                  children: (I, Z) => {
                    var de = Zr();
                    s(I, de);
                  },
                  $$slots: { default: !0 }
                });
              }
            }, Rt = a(() => e(V).trim().length > 0);
            x(lt, (b) => {
              e(Rt) && b(Ue);
            });
          }
          f(ge);
          var Zt = l(ge, 2);
          {
            var zn = (b) => {
              var _ = ta();
              let I;
              var Z = v(_);
              {
                var de = (H) => {
                  hr(H, {
                    showLoader: !0,
                    get text() {
                      return e(wt);
                    },
                    customClass: "composer-target-loading"
                  });
                }, Ce = (H) => {
                  var ee = ea(), $e = v(ee, !0);
                  f(ee), T(() => R($e, e(wt))), s(H, ee);
                };
                x(Z, (H) => {
                  e(xn) ? H(de) : H(Ce, -1);
                });
              }
              var ke = l(Z, 2);
              {
                var Pe = (H) => {
                  At(H, {
                    onClick: kn,
                    children: (ee, $e) => {
                      Nt();
                      var Be = kr();
                      T((je) => R(Be, je), [() => r()("postHistory.contextRetry")]), s(ee, Be);
                    },
                    $$slots: { default: !0 }
                  });
                };
                x(ke, (H) => {
                  e(_n) && H(Pe);
                });
              }
              f(_), T(() => I = sn(_, 1, "target-status svelte-19ui8fd", null, I, { error: e(y) === "error" })), s(b, _);
            };
            x(Zt, (b) => {
              e(wt) && b(zn);
            });
          }
          var en = l(Zt, 2);
          {
            var Gn = (b) => {
              var _ = ha(), I = v(_);
              let Z;
              var de = v(I);
              {
                var Ce = (k) => {
                  tn(k);
                };
                x(de, (k) => {
                  e(P).kind === 42 && e(o)?.channelContext && k(Ce);
                });
              }
              var ke = l(de, 2), Pe = v(ke);
              {
                let k = a(() => e(mt)?.picture ?? "");
                vr(Pe, {
                  get src() {
                    return e(k);
                  },
                  alt: "",
                  rootClassName: "composer-target-avatar",
                  imageClassName: "composer-target-avatar-image",
                  fallbackClassName: "composer-target-avatar-fallback",
                  fallbackAriaLabel: ""
                });
              }
              var H = l(Pe, 2), ee = v(H, !0);
              f(H);
              var $e = l(H, 2), Be = v($e);
              f($e), f(ke);
              var je = l(ke, 2);
              {
                const k = (We) => {
                  var he = nt(), Ee = L(he);
                  {
                    var Xe = (Ie) => {
                      var te = ra(), M = L(te);
                      {
                        var He = (Ae) => {
                          var Se = na();
                          T(() => ft(Se, "id", e(xt))), s(Ae, Se);
                        };
                        x(M, (Ae) => {
                          e(Ge).hasRenderableText || Ae(He);
                        });
                      }
                      var Ye = l(M, 2);
                      Sr(Ye, {
                        get expanded() {
                          return e(bt);
                        },
                        get controls() {
                          return e(xt);
                        },
                        onToggle: () => ze.togglePostExpanded(e(Fe).eventId)
                      }), s(Ie, te);
                    };
                    x(Ee, (Ie) => {
                      e(Fe) && e(_t) && Ie(Xe);
                    });
                  }
                  s(We, he);
                };
                let Re = a(() => e(Ge).hasRenderableText && !e(bt) && e(_t));
                fr(je, {
                  get model() {
                    return e(Ge);
                  },
                  density: "dialog",
                  get emojiLoadStateByUrl() {
                    return Ct.emojiLoadStateByUrl;
                  },
                  get emojiImageMetaByUrl() {
                    return Ct.emojiImageMetaByUrl;
                  },
                  get previewContentId() {
                    return e(xt);
                  },
                  contentClass: "event-content",
                  collapsedContentClass: "event-content-collapsed",
                  get renderWhenEmpty() {
                    return e(_t);
                  },
                  get isTextCollapsed() {
                    return e(Re);
                  },
                  get previewCollapseAction() {
                    return mn;
                  },
                  get previewCollapseEventId() {
                    return e(P).id;
                  },
                  onImageOpen: Un,
                  betweenContentAndMedia: k,
                  $$slots: { betweenContentAndMedia: !0 }
                });
              }
              var $ = l(je, 2);
              {
                var D = (k) => {
                  tn(k);
                };
                x($, (k) => {
                  e(P).kind !== 42 && e(o)?.channelContext && k(D);
                });
              }
              var Te = l($, 2);
              {
                var Ve = (k) => {
                  var Re = aa(), We = v(Re, !0);
                  f(Re), T((he) => R(We, he), [() => r()("postHistory.deleteFailed")]), s(k, Re);
                };
                x(Te, (k) => {
                  e(Y) === "failed" && e(o) && k(Ve);
                });
              }
              f(I);
              var Wn = l(I, 2);
              {
                const k = (he) => {
                  var Ee = nt(), Xe = L(Ee);
                  {
                    var Ie = (te) => {
                      var M = ua(), He = L(M);
                      {
                        var Ye = (O) => {
                          var ne = ia(), A = v(ne);
                          {
                            let F = a(() => r()("replyQuote.reply_label")), G = a(() => r()("replyQuote.reply_label"));
                            Dt(A, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return e(F);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => $t("reply"),
                              get tooltipContent() {
                                return e(G);
                              },
                              children: (re, ae) => {
                                var B = oa();
                                s(re, B);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                          Nt(2), f(ne), s(O, ne);
                        }, Ae = a(() => e(ht).includes("reply"));
                        x(He, (O) => {
                          e(Ae) && O(Ye);
                        });
                      }
                      var Se = l(He, 2);
                      {
                        var Ze = (O) => {
                          var ne = la(), A = L(ne);
                          {
                            let F = a(() => r()("replyQuote.quote_label")), G = a(() => r()("replyQuote.quote_label"));
                            Dt(A, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return e(F);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => $t("quote"),
                              get tooltipContent() {
                                return e(G);
                              },
                              children: (re, ae) => {
                                var B = sa();
                                s(re, B);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                          Nt(2), s(O, ne);
                        }, ct = a(() => e(ht).includes("quote"));
                        x(Se, (O) => {
                          e(ct) && O(Ze);
                        });
                      }
                      var ut = l(Se, 2);
                      {
                        var dt = (O) => {
                          {
                            let ne = a(() => r()("composerTarget.post")), A = a(() => r()("composerTarget.post"));
                            Dt(O, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return e(ne);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => $t("channel"),
                              get tooltipContent() {
                                return e(A);
                              },
                              children: (F, G) => {
                                var re = ca();
                                s(F, re);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                        }, Et = a(() => e(ht).includes("channel"));
                        x(ut, (O) => {
                          e(Et) && O(dt);
                        });
                      }
                      s(te, M);
                    };
                    x(Xe, (te) => {
                      e(o) && te(Ie);
                    });
                  }
                  s(he, Ee);
                }, Re = (he) => {
                  var Ee = nt(), Xe = L(Ee);
                  {
                    var Ie = (te) => {
                      const M = a(() => e(Me)), He = a(() => r()("common.showActions"));
                      {
                        const Ye = (Ze) => {
                          var ct = ga(), ut = L(ct);
                          tt(ut, () => Mt, (A, F) => {
                            F(A, {
                              class: "menu-action-button",
                              onSelect: () => Tn(e(M).rawEvent),
                              children: (G, re) => {
                                var ae = da(), B = l(L(ae), 2), pe = v(B, !0);
                                f(B), T((pt) => R(pe, pt), [() => r()("postHistory.rawJson")]), s(G, ae);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var dt = l(ut, 2);
                          {
                            var Et = (A) => {
                              var F = nt(), G = L(F);
                              {
                                let re = a(() => e(qe) === "sending");
                                tt(G, () => Mt, (ae, B) => {
                                  B(ae, {
                                    class: "menu-action-button",
                                    get disabled() {
                                      return e(re);
                                    },
                                    onpointerdown: (pe) => Rn(e(M), pe),
                                    onSelect: (pe) => void Hn(e(M), pe),
                                    children: (pe, pt) => {
                                      var It = pa(), et = l(L(It), 2), vt = v(et, !0);
                                      f(et), T((Ht) => R(vt, Ht), [() => r()("postHistory.broadcast")]), s(pe, It);
                                    },
                                    $$slots: { default: !0 }
                                  });
                                });
                              }
                              s(A, F);
                            };
                            x(dt, (A) => {
                              e(fn) && A(Et);
                            });
                          }
                          var O = l(dt, 2);
                          {
                            var ne = (A) => {
                              var F = fa(), G = L(F);
                              tt(G, () => Nr, (ae, B) => {
                                B(ae, { class: "post-history-menu-separator" });
                              });
                              var re = l(G, 2);
                              {
                                let ae = a(() => e(Y) === "sending");
                                tt(re, () => Mt, (B, pe) => {
                                  pe(B, {
                                    class: "menu-action-button menu-action-button-danger",
                                    get disabled() {
                                      return e(ae);
                                    },
                                    onSelect: () => An(e(M)),
                                    children: (pt, It) => {
                                      var et = va(), vt = l(L(et), 2), Ht = v(vt, !0);
                                      f(vt), T((Xn) => R(Ht, Xn), [
                                        () => e(Y) === "sending" ? r()("postHistory.deleteSending") : r()("postHistory.delete")
                                      ]), s(pt, et);
                                    },
                                    $$slots: { default: !0 }
                                  });
                                });
                              }
                              s(A, F);
                            };
                            x(O, (A) => {
                              e(gn) && A(ne);
                            });
                          }
                          s(Ze, ct);
                        };
                        let Ae = a(() => Q.isPostMenuOpen(e(M).eventId)), Se = a(() => mr(e(M).postedAt, E()));
                        Lr(te, {
                          get open() {
                            return e(Ae);
                          },
                          onOpenChange: (Ze) => $n(e(M).eventId, Ze),
                          get triggerAriaLabel() {
                            return e(He);
                          },
                          get tooltipContent() {
                            return e(He);
                          },
                          enableTooltip: !0,
                          get timestamp() {
                            return e(Se);
                          },
                          items: Ye,
                          $$slots: { items: !0 }
                        });
                      }
                    };
                    x(Xe, (te) => {
                      e(Me) && te(Ie);
                    });
                  }
                  s(he, Ee);
                };
                let We = a(() => gr(e(vn)));
                Ar(Wn, {
                  get formattedDate() {
                    return e(We);
                  },
                  actions: k,
                  trailing: Re,
                  $$slots: { actions: !0, trailing: !0 }
                });
              }
              f(_), nn(_, (k) => n(W, k), () => e(W)), T(
                (k) => {
                  ft(_, "aria-label", k), Z = sn(I, 1, "target-preview-body svelte-19ui8fd", null, Z, {
                    "channel-first": e(P).kind === 42 && !!e(o)?.channelContext
                  }), R(ee, e(hn)), R(Be, `kind ${e(P).kind ?? ""}`);
                },
                [() => r()("composerTarget.preview")]
              ), s(b, _);
            };
            x(en, (b) => {
              e(P) && b(Gn);
            });
          }
          var Jn = l(en, 2);
          {
            var Vn = (b) => {
              var _ = ma(), I = v(_, !0);
              f(_), T((Z) => R(I, Z), [() => r()("composerTarget.unsupportedKind")]), s(b, _);
            };
            x(Jn, (b) => {
              e(o) && e(o).event.kind !== 1 && e(o).event.kind !== 40 && e(o).event.kind !== 42 && b(Vn);
            });
          }
          f(le), T(
            (b, _, I) => {
              R(ce, b), R(Je, _), ft(ue, "placeholder", I);
            },
            [
              () => r()("composerTarget.title"),
              () => r()("composerTarget.inputLabel"),
              () => r()("composerTarget.placeholder")
            ]
          ), Pr(ue, () => e(V), (b) => n(V, b));
        }
        s(g, le);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Wt = l(Vt, 2);
  Ir(Wt, {
    get open() {
      return e(ot);
    },
    get rawEvent() {
      return e(gt);
    },
    onOpenChange: (t) => n(ot, t, !0)
  });
  var Xt = l(Wt, 2);
  {
    const t = (we) => {
      var ce = ba(), z = v(ce), Je = v(z, !0);
      f(z);
      var ge = l(z, 2), ue = v(ge, !0);
      f(ge), f(ce), T(
        (lt, Ue) => {
          R(Je, lt), R(ue, Ue);
        },
        [
          () => r()("postHistory.deleteRequestDescription"),
          () => r()("postHistory.deleteRequestWarning")
        ]
      ), s(we, ce);
    };
    let i = a(() => r()("postHistory.deleteRequestTitle")), c = a(() => r()("postHistory.deleteRequestDescription")), g = a(() => e(Y) === "sending" ? r()("postHistory.deleteSending") : r()("postHistory.deleteConfirm")), K = a(() => r()("postHistory.deleteCancel")), le = a(() => e(Y) === "sending");
    ir(Xt, {
      get open() {
        return Q.deleteConfirmOpen;
      },
      get onOpenChange() {
        return Q.setDeleteConfirmOpen;
      },
      get title() {
        return e(i);
      },
      get description() {
        return e(c);
      },
      get confirmLabel() {
        return e(g);
      },
      get cancelLabel() {
        return e(K);
      },
      confirmVariant: "danger",
      get confirmDisabled() {
        return e(le);
      },
      onConfirm: Ln,
      onCancel: Sn,
      contentClass: "post-history-delete-confirm",
      children: t,
      $$slots: { default: !0 }
    });
  }
  var Yt = l(Xt, 2);
  {
    let t = a(() => e(Ne)[e(xe)]?.src ?? ""), i = a(() => e(Ne)[e(xe)]?.alt ?? "");
    sr(Yt, {
      get src() {
        return e(t);
      },
      get alt() {
        return e(i);
      },
      onClose: Bn,
      get mediaList() {
        return e(Ne);
      },
      get currentIndex() {
        return e(xe);
      },
      onNavigate: jn,
      get openingFocusOrigin() {
        return e(at);
      },
      get show() {
        return e(De);
      },
      set show(c) {
        n(De, c, !0);
      }
    });
  }
  var Qn = l(Yt, 2);
  lr(Qn, {
    get show() {
      return e(it);
    },
    get x() {
      return e(Ft);
    },
    get y() {
      return e(Ut);
    },
    children: (t, i) => {
      var c = _a(), g = v(c, !0);
      f(c), T((K) => R(g, K), [() => r()(e(Bt))]), s(t, c);
    },
    $$slots: { default: !0 }
  }), s(d, Jt);
  var Kn = wr(qn);
  return m(), Kn;
}
Cr(
  Ca,
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
  Ca as default
};
