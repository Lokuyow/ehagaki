import { R as Yn, cH as Zn, dN as er, H as tr, I as me, dx as nr, bT as rr, L as nn, K as x, aA as ar, al as or, aB as ir, Q as sr, a_ as tt, N as ft, aZ as At, b1 as lr, V as rn, $ as cr, cq as St, b6 as an, M as on, ay as ur, cp as dr, bQ as sn, cr as pr, bc as Lt, ba as vr, S as fr, cE as gr, dO as hr, bB as mr, cJ as ln } from "./App-GbqYleiC.js";
import { bF as yr, bH as br, bk as rt, aO as Ot, b0 as _r, aS as w, aJ as xr, a as e, aN as cn, b as n, b2 as L, Z as T, b3 as s, b8 as v, b4 as wr, aR as a, b5 as ye, b1 as nt, bi as R, bf as l, ba as p, b6 as Cr, b9 as f, bj as Nt, bh as kr } from "./entry-BQ9RlsLv.js";
import { b as Pr } from "./input-ChTBsLhu.js";
import { D as $r, a as Tr } from "./DialogWrapper-CwT5pGyo.js";
import { u as Rr, c as Er, d as Hr, p as Ir, P as Ar, h as Sr, b as Lr, j as Mt, M as Dt, a as Nr, r as Mr, g as un, i as Dr } from "./postBroadcastService-VZtLb6fc.js";
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
  const u = d.replyQuoteService ?? new Yn(), r = d.channelCoordinator ?? Zn, E = d.verifyEventFn ?? ((m) => yr(m) && br(m));
  function G(m) {
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
        let J = null, fe = null, W = null, y = !1;
        if (C.kind === 40 || C.kind === 42) {
          const X = C.kind === 42 ? er(C) : null, ie = C.kind === 40 ? C.id : X?.channelEventId ?? null;
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
          J = S.context, y = S.cache?.resolutionQuality === "verified-metadata", W = S.cache?.creatorPubkey ?? null, fe = {
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
            channelContext: J,
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
  return { resolve: G };
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
      const G = E.data;
      return {
        status: "supported",
        pointer: {
          format: "nevent",
          eventId: G.id,
          relayHints: rt.sanitizeExternalRelayUrls(
            G.relays,
            { limit: rt.EXTERNAL_INPUT_RELAY_LIMIT }
          ),
          authorHint: G.author ?? null,
          kindHint: typeof G.kind == "number" ? G.kind : null
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
function Vr(d, u = qr) {
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
var Gr = p('<div class="xmark-icon svg-icon svelte-19ui8fd"></div>'), Jr = p('<p class="svelte-19ui8fd"> </p>'), Wr = p('<span class="channel-creator svelte-19ui8fd"> </span>'), Xr = p('<span class="channel-relays svelte-19ui8fd"> </span>'), Yr = p('<div class="channel-preview svelte-19ui8fd"><!> <div class="channel-text svelte-19ui8fd"><strong class="channel-name svelte-19ui8fd"> </strong> <!> <!> <!></div></div>'), Zr = p('<div class="clear-input-icon svg-icon svelte-19ui8fd" aria-hidden="true"></div>'), ea = p('<p class="svelte-19ui8fd"> </p>'), ta = p('<div aria-live="polite"><!> <!></div>'), na = p('<span hidden="" aria-hidden="true" class="svelte-19ui8fd"></span>'), ra = p("<!> <!>", 1), aa = p('<p class="delete-failed svelte-19ui8fd"> </p>'), oa = p('<div class="reply-icon svg-icon" aria-hidden="true"></div>'), ia = p('<div class="post-preview-action-buttons-group"><!> <div class="post-preview-footer-replies-slot"></div></div>'), sa = p('<div class="quote-icon svg-icon" aria-hidden="true"></div>'), la = p('<!> <div class="post-preview-footer-reaction-slot"></div>', 1), ca = p('<div class="post-icon svg-icon" aria-hidden="true"></div>'), ua = p("<!> <!> <!>", 1), da = p('<div class="raw-json-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), pa = p('<div class="broadcast-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), va = p('<div class="trash-icon svg-icon" aria-hidden="true"></div> <span class="svelte-19ui8fd"> </span>', 1), fa = p("<!> <!>", 1), ga = p("<!> <!> <!>", 1), ha = p('<section class="target-preview svelte-19ui8fd"><div><!> <div class="event-author svelte-19ui8fd"><!> <span class="svelte-19ui8fd"> </span> <span class="event-kind svelte-19ui8fd"> </span></div> <!> <!> <!></div> <!></section>'), ma = p('<p class="unsupported-kind svelte-19ui8fd"> </p>'), ya = p('<div class="composer-target-content svelte-19ui8fd"><h2 class="svelte-19ui8fd"> </h2> <label class="target-input-label svelte-19ui8fd" for="composer-target-input"> </label> <div class="composer-target-input-shell svelte-19ui8fd"><input id="composer-target-input" type="text" inputmode="text" autocomplete="off" spellcheck="false" class="svelte-19ui8fd"/> <!></div> <!> <!> <!></div>'), ba = p('<div class="delete-confirm-body svelte-19ui8fd"><p class="delete-confirm-description svelte-19ui8fd"> </p> <p class="delete-confirm-warning svelte-19ui8fd"> </p></div>'), _a = p("<div> </div>"), xa = p("<!> <!> <!> <!> <!>", 1);
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
  _r(u, !0), tr(d, wa);
  const r = () => rn(cr, "$_", G), E = () => rn(mr, "$locale", G), [G, m] = sr();
  let N = me(u, "show", 7), be = me(u, "onClose", 7), j = me(u, "onApply", 7), _e = me(u, "rxNostr", 7, void 0), q = me(u, "relayConfig", 7, null), C = me(u, "profileService", 7, void 0), oe = me(u, "resolver", 23, dn), ve = me(u, "pubkeyHex", 7, null), J = w(""), fe = w(null), W = w(null), y = w("empty"), h = w(null), o = w(null), X = w(null), ie = w(null), Le = w(0), U = 0, S, se = null, Ne = w(xr([])), xe = w(-1), Me = w(!1), at = w(null);
  const Q = Rr();
  let ot = w(!1), gt = w(null), qe = w(void 0), Y = w(void 0), it = w(!1), Ft = w(0), Ut = w(0), Bt = w("postHistory.broadcastSent"), Qe, Ke = w(void 0), ht = a(() => e(o) ? Kr(e(o).event.kind, e(o).event.kind === 1 || !!e(o).channelQuery) : []), P = a(() => e(o)?.event ?? e(X)), vn = a(() => e(P) ? e(P).created_at * 1e3 : 0), De = a(() => e(o) ? Pn(e(o)) : null), fn = a(() => e(De) ? Mr(e(De)) !== null : !1), gn = a(() => e(De) ? un(e(De), ve()) : !1), mt = a(() => e(o)?.authorProfile ?? e(ie)), hn = a(() => {
    const t = e(P)?.pubkey;
    return t ? e(mt)?.displayName?.trim() || e(mt)?.name?.trim() || Lt(Ot.npubEncode(t), 12, 4) : "";
  }), Oe = a(() => {
    const t = e(P)?.content;
    return !t || e(P)?.kind === 40 ? "" : t;
  }), yt = a(() => Vr(e(Oe))), jt = a(() => e(P) && e(Oe) ? [
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
  let Fe = a(() => e(jt)[0]), bt = a(() => e(Fe) ? ze.isPostExpanded(e(Fe)) : !1), qt = a(() => sn(e(bt) ? e(Oe) : e(yt).content)), st = a(() => e(P)?.kind === 40 ? St({ sourceContent: "", displayContent: "", tags: [], media: [] }) : St({
    sourceContent: e(Oe),
    tags: e(P)?.tags ?? []
  })), Ve = a(() => e(qt) === e(Oe) ? e(st) : St({
    sourceContent: e(Oe),
    displayContent: e(st).hasRenderableText ? e(qt) : "",
    tags: e(P)?.tags ?? [],
    media: e(st).media
  })), yn = a(() => e(st).hasRenderableText), _t = a(() => !!e(Fe) && e(yn) && ze.shouldCollapsePost(e(Fe))), xt = a(() => e(P) ? `composer-target-preview-content-${e(P).id}` : ""), Qt = a(() => {
    const t = e(o)?.channelContext?.about;
    return t ? zr(sn(t), jr) : "";
  }), bn = a(() => {
    const t = e(o)?.channelContext;
    return t ? t.name?.trim() || `ID: ${Lt(t.eventId, 12, 8)}` : "";
  }), Kt = a(() => {
    const t = e(o)?.channelCreatorPubkey;
    return t ? e(o)?.channelCreatorProfile?.displayName?.trim() || e(o)?.channelCreatorProfile?.name?.trim() || Lt(Ot.npubEncode(t), 12, 4) : "";
  }), wt = a(wn), _n = a(() => e(h) === "not-found" || e(h) === "timeout" || e(h) === "network" || e(h) === "channel-unavailable" || e(h) === "nostr-not-ready"), xn = a(() => e(y) === "debouncing" || e(y) === "event-loading" || e(y) === "channel-loading" || e(y) === "profile-loading");
  const Ct = nr({
    getShow: () => N() && e(Ve).previewContent.emojiUrls.length > 0,
    getEmojiUrls: () => e(Ve).previewContent.emojiUrls,
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
  function Vt() {
    U += 1, kt(), n(J, ""), n(y, "empty"), n(h, null), n(o, null), n(X, null), n(ie, null), n(Le, 0), zt(), Ct.resetState(), n(Ne, [], !0), n(xe, -1), n(Me, !1), n(at, null);
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
  function Hn(t, i) {
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
  async function In(t, i) {
    if (e(qe) === "sending") return;
    const c = U, g = t.eventId, K = En(t, i);
    n(qe, "sending");
    const le = await Dr.broadcast({ post: t, rxNostr: _e() });
    U !== c || e(o)?.event.id !== g || (n(qe, void 0), Hn(K, le));
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
    const g = await Ir.requestDeletion({ post: t, rxNostr: _e() });
    if (!(U !== i || e(o)?.event.id !== c)) {
      if (Q.setDeleteConfirmOpen(!1), g.success) {
        n(Y, void 0), Tt();
        return;
      }
      n(Y, "failed");
    }
  }
  function Tt() {
    Vt(), be()();
  }
  function Nn() {
    e(J).trim().length !== 0 && (n(J, ""), e(fe)?.focus({ preventScroll: !0 }));
  }
  function Mn(t) {
    t.preventDefault(), e(fe)?.focus({ preventScroll: !0 });
  }
  function Dn(t) {
    return t instanceof Element && t.closest(".ehagaki-pswp") !== null;
  }
  function On(t) {
    Dn(t.target) && t.preventDefault();
  }
  function Fn(t) {
    e(Me) && t.preventDefault();
  }
  function Un(t) {
    n(Ne, t.mediaList, !0), n(xe, t.index, !0), n(at, t.focusOrigin, !0), n(Me, !0);
  }
  function Bn() {
    n(Me, !1), n(Ne, [], !0), n(xe, -1), n(at, null);
  }
  function jn(t) {
    n(xe, t, !0);
  }
  cn(() => {
    N() || Vt();
  }), cn(() => {
    if (!N()) return;
    const t = e(J);
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
  }), rr(() => {
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
  }, Gt = xa(), Jt = L(Gt);
  {
    const t = (g) => {
      var K = nt(), le = L(K);
      {
        const we = (ce, z) => {
          let Ge = () => z?.().props;
          {
            let ge = a(() => r()("global.close"));
            At(ce, lr(Ge, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(ge);
              },
              children: (ue, lt) => {
                var Ue = Gr();
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
    $r(Jt, {
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
      onOpenAutoFocus: Mn,
      onInteractOutside: On,
      onEscapeKeydown: Fn,
      footer: t,
      children: (g, K) => {
        var le = ya();
        {
          const tn = (b) => {
            var _ = Yr(), H = v(_);
            {
              var Z = ($) => {
                hr($, {
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
              x(H, ($) => {
                e(o)?.channelContext?.picture && $(Z);
              });
            }
            var de = l(H, 2), Ce = v(de), ke = v(Ce, !0);
            f(Ce);
            var Pe = l(Ce, 2);
            {
              var I = ($) => {
                var M = Jr(), Te = v(M, !0);
                f(M), T(() => R(Te, e(Qt))), s($, M);
              };
              x(Pe, ($) => {
                e(Qt) && $(I);
              });
            }
            var ee = l(Pe, 2);
            {
              var $e = ($) => {
                var M = Wr(), Te = v(M);
                f(M), T((Je) => R(Te, `${Je ?? ""}: ${e(Kt) ?? ""}`), [() => r()("composerTarget.creator")]), s($, M);
              };
              x(ee, ($) => {
                e(Kt) && $($e);
              });
            }
            var Be = l(ee, 2);
            {
              var je = ($) => {
                var M = Xr(), Te = v(M, !0);
                f(M), T((Je) => R(Te, Je), [() => e(o).channelContext.channelRelays.join(`
`)]), s($, M);
              };
              x(Be, ($) => {
                e(o)?.channelContext?.channelRelays?.length && $(je);
              });
            }
            f(de), f(_), T(() => R(ke, e(bn))), s(b, _);
          };
          var we = v(le), ce = v(we, !0);
          f(we);
          var z = l(we, 2), Ge = v(z, !0);
          f(z);
          var ge = l(z, 2), ue = v(ge);
          vr(ue), nn(ue, (b) => n(fe, b), () => e(fe));
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
                    return an;
                  },
                  get ontouchstart() {
                    return an;
                  },
                  children: (H, Z) => {
                    var de = Zr();
                    s(H, de);
                  },
                  $$slots: { default: !0 }
                });
              }
            }, Rt = a(() => e(J).trim().length > 0);
            x(lt, (b) => {
              e(Rt) && b(Ue);
            });
          }
          f(ge);
          var Zt = l(ge, 2);
          {
            var zn = (b) => {
              var _ = ta();
              let H;
              var Z = v(_);
              {
                var de = (I) => {
                  fr(I, {
                    showLoader: !0,
                    get text() {
                      return e(wt);
                    },
                    customClass: "composer-target-loading"
                  });
                }, Ce = (I) => {
                  var ee = ea(), $e = v(ee, !0);
                  f(ee), T(() => R($e, e(wt))), s(I, ee);
                };
                x(Z, (I) => {
                  e(xn) ? I(de) : I(Ce, -1);
                });
              }
              var ke = l(Z, 2);
              {
                var Pe = (I) => {
                  At(I, {
                    onClick: kn,
                    children: (ee, $e) => {
                      Nt();
                      var Be = kr();
                      T((je) => R(Be, je), [() => r()("postHistory.contextRetry")]), s(ee, Be);
                    },
                    $$slots: { default: !0 }
                  });
                };
                x(ke, (I) => {
                  e(_n) && I(Pe);
                });
              }
              f(_), T(() => H = on(_, 1, "target-status svelte-19ui8fd", null, H, { error: e(y) === "error" })), s(b, _);
            };
            x(Zt, (b) => {
              e(wt) && b(zn);
            });
          }
          var en = l(Zt, 2);
          {
            var Vn = (b) => {
              var _ = ha(), H = v(_);
              let Z;
              var de = v(H);
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
                ur(Pe, {
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
              var I = l(Pe, 2), ee = v(I, !0);
              f(I);
              var $e = l(I, 2), Be = v($e);
              f($e), f(ke);
              var je = l(ke, 2);
              {
                const k = (We) => {
                  var he = nt(), Ee = L(he);
                  {
                    var Xe = (He) => {
                      var te = ra(), D = L(te);
                      {
                        var Ie = (Ae) => {
                          var Se = na();
                          T(() => ft(Se, "id", e(xt))), s(Ae, Se);
                        };
                        x(D, (Ae) => {
                          e(Ve).hasRenderableText || Ae(Ie);
                        });
                      }
                      var Ye = l(D, 2);
                      Sr(Ye, {
                        get expanded() {
                          return e(bt);
                        },
                        get controls() {
                          return e(xt);
                        },
                        onToggle: () => ze.togglePostExpanded(e(Fe).eventId)
                      }), s(He, te);
                    };
                    x(Ee, (He) => {
                      e(Fe) && e(_t) && He(Xe);
                    });
                  }
                  s(We, he);
                };
                let Re = a(() => e(Ve).hasRenderableText && !e(bt) && e(_t));
                dr(je, {
                  get model() {
                    return e(Ve);
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
                var M = (k) => {
                  tn(k);
                };
                x($, (k) => {
                  e(P).kind !== 42 && e(o)?.channelContext && k(M);
                });
              }
              var Te = l($, 2);
              {
                var Je = (k) => {
                  var Re = aa(), We = v(Re, !0);
                  f(Re), T((he) => R(We, he), [() => r()("postHistory.deleteFailed")]), s(k, Re);
                };
                x(Te, (k) => {
                  e(Y) === "failed" && e(o) && k(Je);
                });
              }
              f(H);
              var Wn = l(H, 2);
              {
                const k = (he) => {
                  var Ee = nt(), Xe = L(Ee);
                  {
                    var He = (te) => {
                      var D = ua(), Ie = L(D);
                      {
                        var Ye = (O) => {
                          var ne = ia(), A = v(ne);
                          {
                            let F = a(() => r()("replyQuote.reply_label")), V = a(() => r()("replyQuote.reply_label"));
                            Mt(A, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return e(F);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => $t("reply"),
                              get tooltipContent() {
                                return e(V);
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
                        x(Ie, (O) => {
                          e(Ae) && O(Ye);
                        });
                      }
                      var Se = l(Ie, 2);
                      {
                        var Ze = (O) => {
                          var ne = la(), A = L(ne);
                          {
                            let F = a(() => r()("replyQuote.quote_label")), V = a(() => r()("replyQuote.quote_label"));
                            Mt(A, {
                              type: "button",
                              className: "post-preview-action-button post-history-action-button",
                              get ariaLabel() {
                                return e(F);
                              },
                              contentLayout: "icon",
                              shape: "circle",
                              onClick: () => $t("quote"),
                              get tooltipContent() {
                                return e(V);
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
                            Mt(O, {
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
                              children: (F, V) => {
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
                      s(te, D);
                    };
                    x(Xe, (te) => {
                      e(o) && te(He);
                    });
                  }
                  s(he, Ee);
                }, Re = (he) => {
                  var Ee = nt(), Xe = L(Ee);
                  {
                    var He = (te) => {
                      const D = a(() => e(De)), Ie = a(() => r()("common.showActions"));
                      {
                        const Ye = (Ze) => {
                          var ct = ga(), ut = L(ct);
                          tt(ut, () => Dt, (A, F) => {
                            F(A, {
                              class: "menu-action-button",
                              onSelect: () => Tn(e(D).rawEvent),
                              children: (V, re) => {
                                var ae = da(), B = l(L(ae), 2), pe = v(B, !0);
                                f(B), T((pt) => R(pe, pt), [() => r()("postHistory.rawJson")]), s(V, ae);
                              },
                              $$slots: { default: !0 }
                            });
                          });
                          var dt = l(ut, 2);
                          {
                            var Et = (A) => {
                              var F = nt(), V = L(F);
                              {
                                let re = a(() => e(qe) === "sending");
                                tt(V, () => Dt, (ae, B) => {
                                  B(ae, {
                                    class: "menu-action-button",
                                    get disabled() {
                                      return e(re);
                                    },
                                    onpointerdown: (pe) => Rn(e(D), pe),
                                    onSelect: (pe) => void In(e(D), pe),
                                    children: (pe, pt) => {
                                      var Ht = pa(), et = l(L(Ht), 2), vt = v(et, !0);
                                      f(et), T((It) => R(vt, It), [() => r()("postHistory.broadcast")]), s(pe, Ht);
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
                              var F = fa(), V = L(F);
                              tt(V, () => Nr, (ae, B) => {
                                B(ae, { class: "post-history-menu-separator" });
                              });
                              var re = l(V, 2);
                              {
                                let ae = a(() => e(Y) === "sending");
                                tt(re, () => Dt, (B, pe) => {
                                  pe(B, {
                                    class: "menu-action-button menu-action-button-danger",
                                    get disabled() {
                                      return e(ae);
                                    },
                                    onSelect: () => An(e(D)),
                                    children: (pt, Ht) => {
                                      var et = va(), vt = l(L(et), 2), It = v(vt, !0);
                                      f(vt), T((Xn) => R(It, Xn), [
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
                        let Ae = a(() => Q.isPostMenuOpen(e(D).eventId)), Se = a(() => gr(e(D).postedAt, E()));
                        Lr(te, {
                          get open() {
                            return e(Ae);
                          },
                          onOpenChange: (Ze) => $n(e(D).eventId, Ze),
                          get triggerAriaLabel() {
                            return e(Ie);
                          },
                          get tooltipContent() {
                            return e(Ie);
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
                      e(De) && te(He);
                    });
                  }
                  s(he, Ee);
                };
                let We = a(() => pr(e(vn)));
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
                  ft(_, "aria-label", k), Z = on(H, 1, "target-preview-body svelte-19ui8fd", null, Z, {
                    "channel-first": e(P).kind === 42 && !!e(o)?.channelContext
                  }), R(ee, e(hn)), R(Be, `kind ${e(P).kind ?? ""}`);
                },
                [() => r()("composerTarget.preview")]
              ), s(b, _);
            };
            x(en, (b) => {
              e(P) && b(Vn);
            });
          }
          var Gn = l(en, 2);
          {
            var Jn = (b) => {
              var _ = ma(), H = v(_, !0);
              f(_), T((Z) => R(H, Z), [() => r()("composerTarget.unsupportedKind")]), s(b, _);
            };
            x(Gn, (b) => {
              e(o) && e(o).event.kind !== 1 && e(o).event.kind !== 40 && e(o).event.kind !== 42 && b(Jn);
            });
          }
          f(le), T(
            (b, _, H) => {
              R(ce, b), R(Ge, _), ft(ue, "placeholder", H);
            },
            [
              () => r()("composerTarget.title"),
              () => r()("composerTarget.inputLabel"),
              () => r()("composerTarget.placeholder")
            ]
          ), Pr(ue, () => e(J), (b) => n(J, b));
        }
        s(g, le);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Wt = l(Jt, 2);
  Hr(Wt, {
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
      var ce = ba(), z = v(ce), Ge = v(z, !0);
      f(z);
      var ge = l(z, 2), ue = v(ge, !0);
      f(ge), f(ce), T(
        (lt, Ue) => {
          R(Ge, lt), R(ue, Ue);
        },
        [
          () => r()("postHistory.deleteRequestDescription"),
          () => r()("postHistory.deleteRequestWarning")
        ]
      ), s(we, ce);
    };
    let i = a(() => r()("postHistory.deleteRequestTitle")), c = a(() => r()("postHistory.deleteRequestDescription")), g = a(() => e(Y) === "sending" ? r()("postHistory.deleteSending") : r()("postHistory.deleteConfirm")), K = a(() => r()("postHistory.deleteCancel")), le = a(() => e(Y) === "sending");
    ar(Xt, {
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
    or(Yt, {
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
        return e(Me);
      },
      set show(c) {
        n(Me, c, !0);
      }
    });
  }
  var Qn = l(Yt, 2);
  ir(Qn, {
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
  }), s(d, Gt);
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
