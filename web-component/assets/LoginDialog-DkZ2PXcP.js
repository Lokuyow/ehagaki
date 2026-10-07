import { M as tn, N as b, aO as Zn, Q as S, U as qe, aP as Gn, aQ as Jn, aR as er, aK as X, aS as Le, aM as tr, W as nr, aT as Qt, aU as rr, aV as ar, aW as Ft, _ as ir, $ as or, aX as sr, X as ge, a0 as lr, aY as St, aZ as cr, S as Xt, T as Yt, a_ as vt, a$ as dr, b0 as vr, b1 as Zt, b2 as ur, b3 as ut } from "./App-Ck79ufzA.js";
import { b6 as nn, b0 as rn, aO as he, b as o, a as e, Z as p, b3 as i, b4 as an, aT as U, ba as v, b8 as a, b5 as h, b9 as r, aK as gr, b2 as A, b1 as Pe, aS as c, bf as l, bh as ce, bi as u, ap as Rt, bD as Gt, aq as pr, bj as Te } from "./entry-CLkZn30j.js";
import { D as fr, a as _r } from "./DialogWrapper-aT5t3sgb.js";
import { I as xr } from "./InfoPopoverButton-lxbTtB7m.js";
import { T as yr, a as Jt, b as br, c as en } from "./tabs-trigger-bSEgGXRY.js";
var hr = v('<div class="qr-code-svg svelte-1pb586e" role="img"></div>'), mr = v('<div class="qr-code-placeholder svelte-1pb586e" aria-hidden="true"></div>'), Cr = v('<div class="qr-code-frame"><!></div>');
const Nr = {
  hash: "svelte-1pb586e",
  code: ".qr-code-svg.svelte-1pb586e {display:flex;justify-content:center;align-items:center;width:100%;}.qr-code-svg.svelte-1pb586e svg {display:block;width:min(100%, 288px);height:auto;background:#ffffff;}.qr-code-placeholder.svelte-1pb586e {width:min(100%, 288px);aspect-ratio:1;border-radius:12px;background:color-mix(in srgb, var(--text) 6%, #ffffff);}"
};
function on(Me, f) {
  rn(f, !0), tn(Me, Nr);
  let n = b(f, "value", 7), Ke = b(f, "label", 7), me = U(""), T = 0;
  he(() => {
    const L = n(), H = ++T;
    o(me, ""), L && Zn(L).then((ze) => {
      H !== T || n() !== L || o(me, ze, !0);
    }).catch(() => {
      H === T && o(me, "");
    });
  });
  var z = {
    get value() {
      return n();
    },
    set value(L) {
      n(L), h();
    },
    get label() {
      return Ke();
    },
    set label(L) {
      Ke(L), h();
    }
  }, pe = Cr(), Oe = a(pe);
  {
    var Ue = (L) => {
      var H = hr();
      Gn(H, () => e(me), !0), r(H), p(() => qe(H, "aria-label", Ke())), i(L, H);
    }, Ie = (L) => {
      var H = mr();
      i(L, H);
    };
    S(Oe, (L) => {
      e(me) ? L(Ue) : L(Ie, -1);
    });
  }
  return r(pe), p(() => qe(pe, "data-qr-value", n())), i(Me, pe), an(z);
}
nn(on, { value: {}, label: {} }, [], [], { mode: "open" });
var kr = v('<div><span style="word-break:break-all"> </span></div>'), wr = v('<div><span style="word-break:break-all"> </span></div>'), Dr = v('<div class="toast npub-toast svelte-1vy8d2x"><!> <!></div>'), $r = v('<div class="xmark-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div>'), Lr = v('<div class="parent-client-icon svg-icon svelte-1vy8d2x"></div> <span class="btn-text svelte-1vy8d2x"> </span>', 1), Pr = v('<div class="parent-client-section svelte-1vy8d2x"><!> <div aria-live="polite"> </div></div> <div class="divider svelte-1vy8d2x"><span class="svelte-1vy8d2x"> </span></div>', 1), qr = v('<div class="extension-icon svg-icon svelte-1vy8d2x"></div> <span class="btn-text svelte-1vy8d2x"> </span>', 1), Sr = v('<div aria-live="polite"> </div>'), Rr = v('<div class="vault-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div> <span class="btn-text svelte-1vy8d2x"> </span>', 1), Er = v("<!> <!>", 1), Vr = v('<div class="nostrconnect-qr-shell svelte-1vy8d2x" data-testid="nostrconnect-qr-code"><!></div>'), Ar = v('<div class="nostrconnect-qr-loading svelte-1vy8d2x"><!></div>'), Tr = v('<div class="copy-icon svg-icon" aria-hidden="true"></div>'), Mr = v('<div class="nostrconnect-relay-popover svelte-1vy8d2x"><div> </div> <div> </div> <div> </div></div>'), Kr = v('<div class="close-icon svg-icon" aria-hidden="true"></div>'), Or = v('<div class="nostrconnect-relay-row svelte-1vy8d2x"><input type="url" class="nostrconnect-relay-field svelte-1vy8d2x"/> <!></div>'), Ur = v('<div class="section-feedback error svelte-1vy8d2x" aria-live="polite" role="alert"> </div>'), Ir = v('<!> <div class="nostrconnect-uri-card svelte-1vy8d2x"><div class="nostrconnect-uri svelte-1vy8d2x" data-testid="nostrconnect-uri"><input type="text" readonly="" spellcheck="false" autocomplete="off" class="svelte-1vy8d2x"/> <!></div></div> <div class="section-feedback info nostrconnect-status svelte-1vy8d2x" role="status"><!></div> <div class="nostrconnect-relay-settings svelte-1vy8d2x"><div class="nostrconnect-relay-settings-header"><div class="nostrconnect-relay-settings-title-row svelte-1vy8d2x"><span class="nostrconnect-relay-settings-title svelte-1vy8d2x"> </span> <!></div></div> <div class="nostrconnect-relay-editor-list svelte-1vy8d2x"></div> <div class="nostrconnect-relay-editor-actions svelte-1vy8d2x"><!> <!> <!></div></div> <!>', 1), zr = v('<div class="clear-input-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div>'), Hr = v('<div class="section-feedback error svelte-1vy8d2x" aria-live="polite" role="alert"> </div>'), Wr = v('<form novalidate="" class="svelte-1vy8d2x"><div class="bunker-input-row svelte-1vy8d2x"><div class="input-shell svelte-1vy8d2x"><input type="password" placeholder="bunker://..." class="bunker-input u-control svelte-1vy8d2x" required="" autocomplete="off"/> <!></div> <!></div> <!></form>'), jr = v("<!> <!>", 1), Br = v('<div class="clear-input-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div>'), Qr = v('<div class="divider svelte-1vy8d2x"><span class="svelte-1vy8d2x"> </span></div> <div class="secret-key-section svelte-1vy8d2x"><div class="secret-heading-row svelte-1vy8d2x"><div class="secret-icon svg-icon svelte-1vy8d2x"></div> <h3 class="svelte-1vy8d2x"> </h3></div> <form novalidate="" class="svelte-1vy8d2x"><div class="secret-input-row svelte-1vy8d2x"><div class="input-shell svelte-1vy8d2x"><input type="password" placeholder="nsec1..." class="secret-input u-control svelte-1vy8d2x" id="secretKey" name="secretKey" autocomplete="current-password" required="" minlength="63" maxlength="63"/> <!></div> <!></div></form></div>', 1), Fr = v('<!> <div class="nip07-login-section svelte-1vy8d2x"><!> <!></div> <div class="divider svelte-1vy8d2x"><span class="svelte-1vy8d2x"> </span></div> <div class="remote-signer-section svelte-1vy8d2x"><!> <details class="remote-signer-details svelte-1vy8d2x"><summary class="svelte-1vy8d2x"> </summary> <!></details></div> <!>', 1), Xr = v("<div> </div>"), Yr = v("<!> <!> <!>", 1);
const Zr = {
  hash: "svelte-1vy8d2x",
  code: `.xmark-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}form.svelte-1vy8d2x {width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;}

    /* トースト用スタイル */.toast.svelte-1vy8d2x {position:fixed;top:0px;left:50%;translate:-50% 0;display:flex;width:100%;max-width:500px;background:var(--dialog-bg);color:var(--text);border-radius:0 0 10px 10px;z-index:101;font-family:monospace;font-size:1rem;line-height:1.2;word-break:break-all;flex-direction:column;align-items:flex-start;gap:6px;padding:8px 14px 14px;margin-bottom:8px;}
    @keyframes svelte-1vy8d2x-toast-fadein {
        from {
            opacity: 0;
            translate: -50% -10px;
        }
        to {
            opacity: 0.98;
            translate: -50% 0;
        }
    }.parent-client-section.svelte-1vy8d2x,
    .nip07-login-section.svelte-1vy8d2x {display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;gap:6px;}.parent-client-feedback.svelte-1vy8d2x,
    .section-feedback.svelte-1vy8d2x {font-size:0.95rem;text-align:center;}.parent-client-feedback.info.svelte-1vy8d2x,
    .section-feedback.info.svelte-1vy8d2x {color:var(--text-light);}.parent-client-feedback.error.svelte-1vy8d2x,
    .section-feedback.error.svelte-1vy8d2x {background:var(--balloon-error-bg, hsl(351, 99%, 96%));border:1px solid var(--balloon-error-border, hsl(351, 99%, 70%));color:var(--balloon-error-color, hsl(351, 99%, 32%));}.parent-client-login-button.primary,
    .nip07-login-button.primary,
    .nostrconnect-open-btn.primary {flex-shrink:0;position:relative;overflow:hidden;.btn-text.svelte-1vy8d2x {font-size:1.125rem;}}.parent-client-login-button.loading,
    .nip07-login-button.loading,
    .nostrconnect-open-btn.loading {cursor:not-allowed;}.svg-icon.parent-client-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.svg-icon.extension-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-657874656e73696f6e5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.remote-signer-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:6px;}.secret-key-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:10px;}.remote-signer-panel {display:flex;flex-direction:column;gap:8px;}.remote-signer-details.svelte-1vy8d2x {width:100%;background:var(--dialog-bg2);border-radius:8px;}.remote-signer-details.svelte-1vy8d2x summary:where(.svelte-1vy8d2x) {padding:12px;cursor:pointer;font-weight:600;}.secret-heading-row.svelte-1vy8d2x {display:flex;gap:6px;justify-content:center;align-items:center;width:100%;}.secret-input-row.svelte-1vy8d2x,
    .bunker-input-row.svelte-1vy8d2x {display:flex;gap:6px;width:100%;flex:none;}.input-shell.svelte-1vy8d2x {position:relative;display:flex;align-items:center;flex:1;min-width:0;}.secret-input.svelte-1vy8d2x,
    .bunker-input.svelte-1vy8d2x {font-family:monospace;font-size:1rem;padding:0.6rem 3.25rem 0.6rem 0.6rem;background-color:var(--btn-bg);border:none;flex:1;min-width:0;}.ehagaki-app-root button.clear-input-btn {position:absolute;inset:50% auto 50% auto;right:2px;transform:translateY(-50%);width:46px;min-width:46px;height:46px;min-height:46px;padding:0;display:inline-flex;align-items:center;justify-content:center;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);flex:0 0 auto;z-index:1;}.ehagaki-app-root button.clear-input-btn:hover:not(:disabled),
    .ehagaki-app-root button.clear-input-btn:active:not(:disabled),
    .ehagaki-app-root button.clear-input-btn:focus-visible,
    .ehagaki-app-root button.clear-input-btn:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.clear-input-btn:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.clear-input-icon.svelte-1vy8d2x {width:24px;height:24px;mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.secret-heading-row.svelte-1vy8d2x h3:where(.svelte-1vy8d2x) {margin:0;}.remote-signer-tabs {display:flex;flex-direction:column;padding:8px;gap:8px;}.remote-signer-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}.remote-signer-tab {background:var(--btn-bg);--btn-bg: var(--btn-bg2);color:var(--text);padding:12px 16px;font-size:0.95rem;font-weight:600;cursor:pointer;&[data-value="qr"] {border-start-start-radius:10px;border-end-start-radius:10px;}&[data-value="bunker"] {border-start-end-radius:10px;border-end-end-radius:10px;}}.nostrconnect-qr-shell.svelte-1vy8d2x,
    .nostrconnect-qr-loading.svelte-1vy8d2x {width:100%;}.nostrconnect-qr-loading.svelte-1vy8d2x {min-height:320px;display:flex;align-items:center;justify-content:center;padding:16px;border-radius:16px;background:var(--btn-bg);border:1px solid var(--border-hr);}.nostrconnect-uri-card.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-uri.svelte-1vy8d2x {display:flex;align-items:center;position:relative;height:40px;padding:0 40px 0 12px;background:var(--btn-bg2);border-radius:12px;font-family:monospace;font-size:0.9rem;}.nostrconnect-uri.svelte-1vy8d2x input:where(.svelte-1vy8d2x) {width:100%;border:none;background:transparent;font-family:inherit;font-size:inherit;outline:none;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}button.nostrconnect-copy-btn.circle.copy {position:absolute;inset:auto 2px 2px auto;width:34px;min-width:34px;height:34px;flex:0 0 34px;z-index:1;}button.nostrconnect-copy-btn .copy-icon {width:18px;height:18px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.nostrconnect-relay-editor-actions.svelte-1vy8d2x {display:flex;flex-wrap:wrap;gap:6px;}.nostrconnect-relay-settings.svelte-1vy8d2x {display:flex;flex-direction:column;gap:6px;padding:2px 12px 12px;background:var(--dialog-bg3);border-radius:16px;}.nostrconnect-relay-settings-title-row.svelte-1vy8d2x {display:flex;align-items:center;}.nostrconnect-relay-settings-title.svelte-1vy8d2x {font-weight:600;}.nostrconnect-relay-popover.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-relay-editor-list.svelte-1vy8d2x {display:flex;flex-direction:column;gap:4px;}.nostrconnect-relay-row.svelte-1vy8d2x {display:flex;align-items:stretch;height:40px;.nostrconnect-remove-relay-btn {width:auto;height:auto;border-radius:0 12px 12px 0;--btn-bg: var(--btn-bg3);opacity:1;aspect-ratio:1;.close-icon {--svg: currentColor;width:24px;height:24px;}}}.nostrconnect-relay-field.svelte-1vy8d2x {flex:1;width:auto;height:auto;padding:0 0.75rem;background:var(--btn-bg3);border:none;border-radius:12px 0 0 12px;font-family:monospace;font-size:0.95rem;}.secret-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6b65795f766572746963616c5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;flex:0 0 28px;display:inline-block;vertical-align:middle;}.vault-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-736869656c645f6c6f636b65645f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;display:inline-block;vertical-align:middle;}

    @media (max-width: 600px) {.bunker-input-row.svelte-1vy8d2x,
        .secret-input-row.svelte-1vy8d2x {flex-direction:column;}
    }.divider.svelte-1vy8d2x {display:flex;align-items:center;text-align:center;margin:16px 0;width:100%;}.divider.svelte-1vy8d2x::before,
    .divider.svelte-1vy8d2x::after {content:"";flex:1;height:1px;background:var(--border-hr);}.divider.svelte-1vy8d2x span:where(.svelte-1vy8d2x) {color:var(--text-light);padding:0 16px;font-size:1rem;}input.u-control, button.u-control {min-height:50px;min-width:60px;width:100%;display:inline-flex;align-items:center;}

    @media (min-width: 601px) {.save-btn.u-control, .bunker-connect-btn.u-control {width:120px;}
    }`
};
function Gr(Me, f) {
  rn(f, !0), tn(Me, Zr);
  const n = () => ir(or, "$_", Ke), [Ke, me] = nr();
  let T = b(f, "show", 15, !1), z = b(f, "secretKey", 15), pe = b(f, "onClose", 7), Oe = b(f, "onSave", 7), Ue = b(f, "onParentClientLogin", 7), Ie = b(f, "onNip07Login", 7), L = b(f, "onNip46Login", 7), H = b(f, "onNostrConnectStart", 7), ze = b(f, "onNostrConnectCancel", 7), gt = b(f, "isParentClientAvailable", 7, !1), He = b(f, "isLoadingParentClient", 7, !1), pt = b(f, "isNip07ExtensionAvailable", 7, !1), We = b(f, "isLoadingNip07", 7, !1), Ce = b(f, "isLoadingNip46", 7, !1), Je = b(f, "isPreparingNip46NostrConnect", 7, !1), je = b(f, "isWaitingNip46NostrConnect", 7, !1), ft = b(f, "isHandshakeStartedNip46NostrConnect", 7, !1), N = b(f, "nip46NostrConnectUri", 7, null), et = b(f, "nip46NostrConnectErrorMessage", 7, ""), tt = b(f, "initialNostrConnectRelayCandidates", 23, () => []), nt = b(f, "isAddAccountMode", 7, !1), Be = b(f, "localNsecAuthEnabled", 7, !0);
  function Et() {
    T(!1), pe()?.();
  }
  Jn(() => T(), Et, !0);
  let Vt = c(pt), sn = c(gt);
  const rt = new er();
  let ln = c(() => rt.isValid), _t = c(() => rt.npub), xt = c(() => rt.nprofile), At = c(() => n()("clearInput") === "clearInput" ? "入力内容を消去" : n()("clearInput")), C = U(null), fe = U(""), Y = U("qr"), yt = U(!1), at = U(null), ne = U(gr([""])), R = U(null), Se = U(""), Ne = U(""), Z = U(""), it = U(!1), ot = U(!1), _e = U(!1), ke, bt = U(null);
  const cn = 1200, dn = 6e3;
  function Re() {
    ke && (clearTimeout(ke), ke = void 0), o(bt, null), o(ot, !1);
  }
  function re() {
    Re(), o(_e, !1);
  }
  function vn() {
    return tt().length > 0 ? [...tt()] : Ft();
  }
  function un() {
    re(), o(ne, Qt(vn()), !0), o(Y, "qr"), o(at, null);
  }
  he(() => {
    if (T() && !e(yt)) {
      o(yt, !0), z(""), o(fe, ""), o(Se, ""), o(Ne, ""), o(Z, ""), o(it, !1), un(), queueMicrotask(() => {
        !T() || e(Y) !== "qr" || Tt();
      });
      return;
    }
    T() || (o(yt, !1), re());
  }), he(() => {
    N(), o(it, !1), re();
  }), he(() => {
    if (typeof document > "u")
      return;
    function t() {
      document.visibilityState !== "visible" && Re();
    }
    return document.addEventListener("visibilitychange", t), () => {
      document.removeEventListener("visibilitychange", t), re();
    };
  });
  let we = c(() => sr(e(ne))), st = c(() => e(we).errorKey === null ? e(we).relays.join(`
`) : null), gn = c(() => e(Y) === "qr" && e(we).errorKey ? n()(e(we).errorKey) : ""), xe = c(Je), De = c(ft), ht = c(() => e(xe) || je()), pn = c(() => e(xe) || e(we).errorKey !== null || !e(st) || !!N() && e(st) === e(at));
  he(() => {
    e(De) && (o(_e, !1), Re());
  }), he(() => {
    T(), e(Y), N(), e(ht), (!T() || e(Y) !== "qr" || !N() || !e(ht)) && re();
  }), he(() => {
    z() !== void 0 && rt.setNsec(z());
  }), he(() => {
    z() !== void 0 && e(C) && !z() && e(C).setCustomValidity("");
  });
  function fn(t) {
    o(fe, t.currentTarget.value, !0), o(Z, ""), e(R) && e(R).setCustomValidity("");
  }
  function _n() {
    e(fe) && (o(fe, ""), o(Z, ""), e(R)?.setCustomValidity(""), e(R)?.focus({ preventScroll: !0 }));
  }
  function xn() {
    z() && (z(""), e(C)?.setCustomValidity(""), e(C)?.focus({ preventScroll: !0 }));
  }
  function yn() {
    if (re(), e(C)) {
      const t = e(C).validity, M = e(C).value ?? "";
      if (t.valueMissing) {
        e(C).setCustomValidity(n()("loginDialog.secret_key_required")), e(C).reportValidity();
        return;
      }
      if (!M.startsWith("nsec1")) {
        e(C).setCustomValidity(n()("loginDialog.secret_must_start_nsec1")), e(C).reportValidity();
        return;
      }
      if (M.length !== 63) {
        M.length < 63 ? e(C).setCustomValidity(n()("loginDialog.secret_too_short")) : e(C).setCustomValidity(n()("loginDialog.secret_too_long")), e(C).reportValidity();
        return;
      }
      if (!e(ln)) {
        e(C).setCustomValidity(n()("loginDialog.invalid_secret")), e(C).reportValidity();
        return;
      }
      e(C).setCustomValidity("");
    }
    Oe()?.();
  }
  function bn(t) {
    switch (t) {
      case "nip07_not_available":
        return n()("loginDialog.extension_not_found");
      case "nip07_auth_error":
        return n()("loginDialog.extension_login_failed");
      default:
        return t.startsWith("nip07_") ? n()("loginDialog.extension_login_failed") : t;
    }
  }
  function hn(t) {
    switch (t) {
      case "Invalid bunker URL":
        return n()("loginDialog.bunker_invalid");
      case "nip46_connection_failed":
        return n()("loginDialog.bunker_connection_failed");
      default:
        return t;
    }
  }
  function mn(t) {
    switch (t) {
      case "At least one public wss relay is required for nostrconnect":
        return n()("loginDialog.nostrconnect_relay_required");
      case "Nostr Connect timed out before the remote signer connected":
        return n()("loginDialog.nostrconnect_timeout");
      case "Timed out waiting for switch_relays response":
      case "Relay connection failed":
      case "Nostr Connect handshake pool is unavailable":
        return n()("loginDialog.nostrconnect_connection_failed");
      case "Timed out waiting for final relay list":
      case "Remote signer did not return final relay list":
      case "Remote signer returned an invalid final relay list":
      case "Remote signer returned an unsupported final relay":
        return n()("loginDialog.nostrconnect_relay_reconciliation_failed");
      case "Remote signer did not return any usable connection relay":
        return n()("loginDialog.nostrconnect_no_usable_final_relay");
      case "Could not connect to the local relay specified by the remote signer":
        return n()("loginDialog.nostrconnect_local_final_relay_unreachable");
      case "Communication could not be verified on the relay selected by the remote signer":
        return n()("loginDialog.nostrconnect_final_relay_verification_failed");
      case "Nostr Connect connection was cancelled":
        return "";
      default:
        return t.startsWith("Relay connection failed:") ? n()("loginDialog.nostrconnect_connection_failed") : t;
    }
  }
  async function Cn() {
    re(), o(Ne, "");
    const t = await Ie()?.();
    t && o(Ne, bn(t), !0);
  }
  function Nn(t) {
    switch (t) {
      case "parent_client_not_available":
        return n()("loginDialog.parent_client_not_available");
      case "parent_client_timeout":
        return n()("loginDialog.parent_client_timeout");
      case "parent_client_auth_rejected":
        return n()("loginDialog.parent_client_auth_rejected");
      case "parent_client_not_logged_in":
        return n()("loginDialog.parent_client_not_logged_in");
      case "parent_client_disconnected":
        return n()("loginDialog.parent_client_disconnected");
      case "parent_client_invalid_response":
        return n()("loginDialog.parent_client_invalid_response");
      case "parent_client_auth_error":
        return n()("loginDialog.parent_client_auth_error");
      default:
        return t.startsWith("parent_client_") ? n()("loginDialog.parent_client_auth_error") : t;
    }
  }
  async function kn() {
    re(), o(Se, "");
    const t = await Ue()?.();
    t && o(Se, Nn(t), !0);
  }
  async function wn() {
    if (re(), o(Z, ""), e(R)) {
      const k = e(R).value.trim();
      if (o(fe, k, !0), e(R).validity.valueMissing) {
        o(Z, n()("loginDialog.bunker_url_required"), !0), e(R).setCustomValidity(e(Z)), e(R).reportValidity();
        return;
      }
      if (!ur.test(k)) {
        o(Z, n()("loginDialog.bunker_invalid"), !0), e(R).setCustomValidity(e(Z)), e(R).reportValidity();
        return;
      }
      e(R).setCustomValidity("");
    }
    const t = e(fe).trim(), M = await L()?.(t);
    if (M && e(R)) {
      const k = hn(M);
      o(Z, k, !0), e(R).setCustomValidity(k), e(R).reportValidity();
      return;
    }
    o(Z, "");
  }
  function Dn(t) {
    e(Y) !== t && (o(Y, t, !0), re(), o(at, null));
  }
  function $n(t, M) {
    const k = [...e(ne)];
    k[t] = M, o(ne, Zt(k), !0);
  }
  function Ln() {
    o(ne, [...e(ne), ""], !0);
  }
  function Pn(t) {
    o(ne, Zt(e(ne).filter((M, k) => k !== t)), !0);
  }
  function qn() {
    o(ne, Qt(Ft()), !0);
  }
  async function Tt() {
    e(Y) !== "qr" || e(we).errorKey !== null || !e(st) || (e(ht) && ze()?.(), o(at, e(st), !0), await H()?.(e(we).relays));
  }
  function Sn() {
    if (!N())
      return;
    const t = N();
    Re(), o(bt, t, !0), o(_e, !0), rr(t), ke = setTimeout(
      () => {
        if (ke = void 0, typeof document < "u" && document.visibilityState !== "visible") {
          Re();
          return;
        }
        if (T() && e(Y) === "qr" && (Je() || je()) && !e(De) && N() === t && e(bt) === t) {
          o(ot, !0), ke = setTimeout(
            () => {
              o(ot, !1), ke = void 0;
            },
            dn
          );
          return;
        }
        Re();
      },
      cn
    );
  }
  async function Rn() {
    if (!N())
      return !1;
    const t = await vr(N(), "nostrconnect");
    return o(it, t, !0), t;
  }
  let En = c(() => et() ? mn(et()) : ""), Mt = c(() => e(Y) === "qr" ? e(En) || e(gn) : "");
  function Vn(t) {
    re(), t.preventDefault(), yn();
  }
  var An = {
    get show() {
      return T();
    },
    set show(t = !1) {
      T(t), h();
    },
    get secretKey() {
      return z();
    },
    set secretKey(t) {
      z(t), h();
    },
    get onClose() {
      return pe();
    },
    set onClose(t) {
      pe(t), h();
    },
    get onSave() {
      return Oe();
    },
    set onSave(t) {
      Oe(t), h();
    },
    get onParentClientLogin() {
      return Ue();
    },
    set onParentClientLogin(t) {
      Ue(t), h();
    },
    get onNip07Login() {
      return Ie();
    },
    set onNip07Login(t) {
      Ie(t), h();
    },
    get onNip46Login() {
      return L();
    },
    set onNip46Login(t) {
      L(t), h();
    },
    get onNostrConnectStart() {
      return H();
    },
    set onNostrConnectStart(t) {
      H(t), h();
    },
    get onNostrConnectCancel() {
      return ze();
    },
    set onNostrConnectCancel(t) {
      ze(t), h();
    },
    get isParentClientAvailable() {
      return gt();
    },
    set isParentClientAvailable(t = !1) {
      gt(t), h();
    },
    get isLoadingParentClient() {
      return He();
    },
    set isLoadingParentClient(t = !1) {
      He(t), h();
    },
    get isNip07ExtensionAvailable() {
      return pt();
    },
    set isNip07ExtensionAvailable(t = !1) {
      pt(t), h();
    },
    get isLoadingNip07() {
      return We();
    },
    set isLoadingNip07(t = !1) {
      We(t), h();
    },
    get isLoadingNip46() {
      return Ce();
    },
    set isLoadingNip46(t = !1) {
      Ce(t), h();
    },
    get isPreparingNip46NostrConnect() {
      return Je();
    },
    set isPreparingNip46NostrConnect(t = !1) {
      Je(t), h();
    },
    get isWaitingNip46NostrConnect() {
      return je();
    },
    set isWaitingNip46NostrConnect(t = !1) {
      je(t), h();
    },
    get isHandshakeStartedNip46NostrConnect() {
      return ft();
    },
    set isHandshakeStartedNip46NostrConnect(t = !1) {
      ft(t), h();
    },
    get nip46NostrConnectUri() {
      return N();
    },
    set nip46NostrConnectUri(t = null) {
      N(t), h();
    },
    get nip46NostrConnectErrorMessage() {
      return et();
    },
    set nip46NostrConnectErrorMessage(t = "") {
      et(t), h();
    },
    get initialNostrConnectRelayCandidates() {
      return tt();
    },
    set initialNostrConnectRelayCandidates(t = []) {
      tt(t), h();
    },
    get isAddAccountMode() {
      return nt();
    },
    set isAddAccountMode(t = !1) {
      nt(t), h();
    },
    get localNsecAuthEnabled() {
      return Be();
    },
    set localNsecAuthEnabled(t = !0) {
      Be(t), h();
    }
  }, Kt = Yr(), Ot = A(Kt);
  {
    var Tn = (t) => {
      var M = Dr(), k = a(M);
      {
        var ae = (G) => {
          var W = kr(), j = a(W), ye = a(j, !0);
          r(j), r(W), p(() => u(ye, e(_t))), i(G, W);
        };
        S(k, (G) => {
          e(_t) && G(ae);
        });
      }
      var $e = l(k, 2);
      {
        var Ee = (G) => {
          var W = wr(), j = a(W), ye = a(j, !0);
          r(j), r(W), p(() => u(ye, e(xt))), i(G, W);
        };
        S($e, (G) => {
          e(xt) && G(Ee);
        });
      }
      r(M), i(t, M);
    };
    S(Ot, (t) => {
      (e(_t) || e(xt)) && t(Tn);
    });
  }
  var Ut = l(Ot, 2);
  {
    const t = (ae) => {
      var $e = Pe(), Ee = A($e);
      {
        const G = (W, j) => {
          let ye = () => j?.().props;
          {
            let mt = c(() => n()("global.close"));
            X(W, ar(ye, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(mt);
              },
              children: (Ct, lt) => {
                var ct = $r();
                i(Ct, ct);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Le(Ee, () => _r, (W, j) => {
          j(W, { child: G, $$slots: { child: !0 } });
        });
      }
      i(ae, $e);
    };
    let M = c(() => nt() ? n()("loginDialog.add_account_title") : Be() ? n()("loginDialog.input_secret") : n()("common.login")), k = c(() => nt() ? n()("loginDialog.add_account_hint") : Be() ? n()("loginDialog.hint_input_secret") : n()("loginDialog.login_methods_hint"));
    fr(Ut, {
      onOpenChange: (ae) => !ae && Et(),
      get title() {
        return e(M);
      },
      get description() {
        return e(k);
      },
      contentClass: "login-dialog",
      footerVariant: "close-button",
      get open() {
        return T();
      },
      set open(ae) {
        T(ae);
      },
      footer: t,
      children: (ae, $e) => {
        var Ee = Fr(), G = A(Ee);
        {
          var W = (w) => {
            var D = Pr(), E = A(D), ie = a(E);
            {
              let m = c(() => He() ? "loading" : "");
              X(ie, {
                variant: "primary",
                shape: "square",
                get className() {
                  return `parent-client-login-button u-control ${e(m) ?? ""}`;
                },
                onClick: kn,
                get disabled() {
                  return He();
                },
                children: ($, x) => {
                  var y = Pe(), Q = A(y);
                  {
                    var te = (g) => {
                      ge(g, { text: !0, showLoader: !0 });
                    }, de = (g) => {
                      var P = Lr(), q = l(A(P), 2), K = a(q, !0);
                      r(q), p((F) => u(K, F), [() => n()("loginDialog.login_with_parent_client")]), i(g, P);
                    };
                    S(Q, (g) => {
                      He() ? g(te) : g(de, -1);
                    });
                  }
                  i($, y);
                },
                $$slots: { default: !0 }
              });
            }
            var B = l(ie, 2), J = a(B, !0);
            r(B), r(E);
            var ee = l(E, 2), oe = a(ee), I = a(oe, !0);
            r(oe), r(ee), p(
              (m, $) => {
                Yt(B, 1, `parent-client-feedback ${e(Se) ? "error" : "info"}`, "svelte-1vy8d2x"), qe(B, "role", e(Se) ? "alert" : "status"), u(J, m), u(I, $);
              },
              [
                () => e(Se) || n()("loginDialog.parent_client_hint"),
                () => n()("common.or")
              ]
            ), i(w, D);
          };
          S(G, (w) => {
            e(sn) && w(W);
          });
        }
        var j = l(G, 2), ye = a(j);
        {
          let w = c(() => We() ? "loading" : ""), D = c(() => We() || !e(Vt));
          X(ye, {
            variant: "primary",
            shape: "square",
            get className() {
              return `nip07-login-button u-control ${e(w) ?? ""}`;
            },
            onClick: Cn,
            get disabled() {
              return e(D);
            },
            children: (E, ie) => {
              var B = Pe(), J = A(B);
              {
                var ee = (I) => {
                  ge(I, { text: !0, showLoader: !0 });
                }, oe = (I) => {
                  var m = qr(), $ = l(A(m), 2), x = a($, !0);
                  r($), p((y) => u(x, y), [() => n()("loginDialog.login_with_extension")]), i(I, m);
                };
                S(J, (I) => {
                  We() ? I(ee) : I(oe, -1);
                });
              }
              i(E, B);
            },
            $$slots: { default: !0 }
          });
        }
        var mt = l(ye, 2);
        {
          var Ct = (w) => {
            var D = Sr(), E = a(D, !0);
            r(D), p(
              (ie) => {
                Yt(D, 1, `section-feedback ${e(Ne) ? "error" : "info"}`, "svelte-1vy8d2x"), qe(D, "role", e(Ne) ? "alert" : "status"), u(E, ie);
              },
              [
                () => e(Ne) || n()("loginDialog.extension_not_found")
              ]
            ), i(w, D);
          };
          S(mt, (w) => {
            (e(Ne) || !e(Vt)) && w(Ct);
          });
        }
        r(j);
        var lt = l(j, 2), ct = a(lt), On = a(ct, !0);
        r(ct), r(lt);
        var Nt = l(lt, 2), It = a(Nt);
        {
          let w = c(() => e(De) ? n()("loginDialog.nostrconnect_handshake_started") : e(_e) ? n()("loginDialog.nostrconnect_opening_signer") : n()("loginDialog.nostrconnect_open")), D = c(() => e(xe) || !N() || e(_e) || e(De)), E = c(() => e(xe) && !N() || e(_e) || e(De) ? "loading" : "");
          X(It, {
            type: "button",
            variant: "primary",
            shape: "square",
            get ariaLabel() {
              return e(w);
            },
            onClick: Sn,
            get disabled() {
              return e(D);
            },
            get className() {
              return `nostrconnect-open-btn u-control ${e(E) ?? ""}`;
            },
            "data-testid": "nostrconnect-open-button",
            children: (ie, B) => {
              var J = Pe(), ee = A(J);
              {
                var oe = (x) => {
                  {
                    let y = c(() => n()("loginDialog.nostrconnect_preparing"));
                    ge(x, {
                      get text() {
                        return e(y);
                      },
                      showLoader: !0
                    });
                  }
                }, I = (x) => {
                  {
                    let y = c(() => n()("loginDialog.nostrconnect_handshake_started"));
                    ge(x, {
                      get text() {
                        return e(y);
                      },
                      showLoader: !0
                    });
                  }
                }, m = (x) => {
                  {
                    let y = c(() => n()("loginDialog.nostrconnect_opening_signer"));
                    ge(x, {
                      get text() {
                        return e(y);
                      },
                      showLoader: !0
                    });
                  }
                }, $ = (x) => {
                  var y = Rr(), Q = l(A(y), 2), te = a(Q, !0);
                  r(Q), p((de) => u(te, de), [() => n()("loginDialog.remote_signer_title")]), i(x, y);
                };
                S(ee, (x) => {
                  e(xe) && !N() ? x(oe) : e(De) ? x(I, 1) : e(_e) ? x(m, 2) : x($, -1);
                });
              }
              i(ie, J);
            },
            $$slots: { default: !0 }
          });
        }
        var zt = l(It, 2), kt = a(zt), Un = a(kt, !0);
        r(kt);
        var In = l(kt, 2);
        Le(In, () => br, (w, D) => {
          D(w, {
            get value() {
              return e(Y);
            },
            onValueChange: (E) => Dn(E),
            class: "remote-signer-tabs",
            children: (E, ie) => {
              var B = jr(), J = A(B);
              Le(J, () => yr, (m, $) => {
                $(m, {
                  class: "remote-signer-tab-list",
                  children: (x, y) => {
                    var Q = Er(), te = A(Q);
                    Le(te, () => Jt, (g, P) => {
                      P(g, {
                        value: "qr",
                        class: "remote-signer-tab",
                        "data-testid": "nostrconnect-qr-tab",
                        children: (q, K) => {
                          Te();
                          var F = ce();
                          p((be) => u(F, be), [() => n()("loginDialog.nostrconnect_qr_tab")]), i(q, F);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                    var de = l(te, 2);
                    Le(de, () => Jt, (g, P) => {
                      P(g, {
                        value: "bunker",
                        class: "remote-signer-tab",
                        "data-testid": "nostrconnect-bunker-tab",
                        children: (q, K) => {
                          Te();
                          var F = ce();
                          p((be) => u(F, be), [() => n()("loginDialog.nostrconnect_bunker_tab")]), i(q, F);
                        },
                        $$slots: { default: !0 }
                      });
                    }), i(x, Q);
                  },
                  $$slots: { default: !0 }
                });
              });
              var ee = l(J, 2);
              {
                var oe = (m) => {
                  var $ = Pe(), x = A($);
                  Le(x, () => en, (y, Q) => {
                    Q(y, {
                      value: "qr",
                      class: "remote-signer-panel nostrconnect-panel",
                      children: (te, de) => {
                        var g = Ir(), P = A(g);
                        {
                          var q = (s) => {
                            var d = Vr(), _ = a(d);
                            {
                              let V = c(() => n()("loginDialog.nostrconnect_qr_alt"));
                              on(_, {
                                get value() {
                                  return N();
                                },
                                get label() {
                                  return e(V);
                                }
                              });
                            }
                            r(d), i(s, d);
                          }, K = (s) => {
                            var d = Ar(), _ = a(d);
                            ge(_, { text: !0, showLoader: !0 }), r(d), i(s, d);
                          };
                          S(P, (s) => {
                            N() ? s(q) : e(xe) && s(K, 1);
                          });
                        }
                        var F = l(P, 2), be = a(F), Ve = a(be);
                        ut(Ve);
                        var wt = l(Ve, 2);
                        {
                          let s = c(() => n()("common.copySuccess")), d = c(() => e(xe) || !N()), _ = c(() => e(it) ? n()("loginDialog.nostrconnect_copied") : n()("loginDialog.nostrconnect_copy"));
                          X(wt, {
                            type: "button",
                            variant: "copy",
                            shape: "circle",
                            contentLayout: "icon",
                            onClick: Rn,
                            get floatingMessage() {
                              return e(s);
                            },
                            get disabled() {
                              return e(d);
                            },
                            className: "nostrconnect-copy-btn",
                            get ariaLabel() {
                              return e(_);
                            },
                            "data-testid": "nostrconnect-copy-button",
                            children: (V, le) => {
                              var Ge = Tr();
                              i(V, Ge);
                            },
                            $$slots: { default: !0 }
                          });
                        }
                        r(be), r(F);
                        var Qe = l(F, 2), O = a(Qe);
                        {
                          var ve = (s) => {
                            var d = ce();
                            p((_) => u(d, _), [() => n()("loginDialog.nostrconnect_preparing")]), i(s, d);
                          }, Fe = (s) => {
                            {
                              let d = c(() => n()("loginDialog.nostrconnect_opening_signer"));
                              ge(s, {
                                get text() {
                                  return e(d);
                                },
                                showLoader: !0
                              });
                            }
                          }, Ae = (s) => {
                            {
                              let d = c(() => n()("loginDialog.nostrconnect_handshake_started"));
                              ge(s, {
                                get text() {
                                  return e(d);
                                },
                                showLoader: !0
                              });
                            }
                          }, Dt = (s) => {
                            var d = ce();
                            p((_) => u(d, _), [() => n()("loginDialog.nostrconnect_waiting")]), i(s, d);
                          }, $t = (s) => {
                            var d = ce();
                            p((_) => u(d, _), [() => n()("loginDialog.nostrconnect_idle")]), i(s, d);
                          };
                          S(O, (s) => {
                            e(xe) ? s(ve) : e(_e) ? s(Fe, 1) : e(De) ? s(Ae, 2) : je() ? s(Dt, 3) : s($t, -1);
                          });
                        }
                        r(Qe);
                        var Xe = l(Qe, 2), se = a(Xe), Ye = a(se), Ze = a(Ye), Wn = a(Ze, !0);
                        r(Ze);
                        var jn = l(Ze, 2);
                        {
                          let s = c(() => n()("loginDialog.nostrconnect_relay_settings_description"));
                          xr(jn, {
                            side: "top",
                            sideOffset: 8,
                            get ariaLabel() {
                              return e(s);
                            },
                            children: (d, _) => {
                              var V = Mr(), le = a(V), Ge = a(le, !0);
                              r(le);
                              var ue = l(le, 2), Pt = a(ue, !0);
                              r(ue);
                              var dt = l(ue, 2), Bt = a(dt, !0);
                              r(dt), r(V), p(
                                (qt, Xn, Yn) => {
                                  u(Ge, qt), u(Pt, Xn), u(Bt, Yn);
                                },
                                [
                                  () => n()("loginDialog.nostrconnect_relay_hint"),
                                  () => n()("loginDialog.nostrconnect_relay_update_hint"),
                                  () => n()("loginDialog.nostrconnect_relay_switch_hint")
                                ]
                              ), i(d, V);
                            },
                            $$slots: { default: !0 }
                          });
                        }
                        r(Ye), r(se);
                        var Lt = l(se, 2);
                        lr(Lt, 21, () => e(ne), cr, (s, d, _) => {
                          var V = Or(), le = a(V);
                          ut(le);
                          var Ge = l(le, 2);
                          {
                            let ue = c(() => n()("loginDialog.nostrconnect_remove_relay")), Pt = c(() => e(ne).length === 1 && !e(d).trim());
                            X(Ge, {
                              type: "button",
                              variant: "close",
                              shape: "rounded",
                              className: "nostrconnect-remove-relay-btn",
                              get ariaLabel() {
                                return e(ue);
                              },
                              onClick: () => Pn(_),
                              get disabled() {
                                return e(Pt);
                              },
                              children: (dt, Bt) => {
                                var qt = Kr();
                                i(dt, qt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                          r(V), p(
                            (ue) => {
                              St(le, e(d)), qe(le, "placeholder", ue);
                            },
                            [() => n()("loginDialog.nostrconnect_relay_placeholder")]
                          ), Rt("input", le, (ue) => $n(_, ue.currentTarget.value)), i(s, V);
                        }), r(Lt);
                        var Ht = l(Lt, 2), Wt = a(Ht);
                        X(Wt, {
                          type: "button",
                          variant: "primary",
                          onClick: Tt,
                          get disabled() {
                            return e(pn);
                          },
                          "data-testid": "nostrconnect-regenerate",
                          children: (s, d) => {
                            Te();
                            var _ = ce();
                            p((V) => u(_, V), [() => n()("loginDialog.nostrconnect_generate")]), i(s, _);
                          },
                          $$slots: { default: !0 }
                        });
                        var jt = l(Wt, 2);
                        X(jt, {
                          type: "button",
                          variant: "secondary",
                          onClick: Ln,
                          children: (s, d) => {
                            Te();
                            var _ = ce();
                            p((V) => u(_, V), [() => n()("loginDialog.nostrconnect_add_relay")]), i(s, _);
                          },
                          $$slots: { default: !0 }
                        });
                        var Bn = l(jt, 2);
                        X(Bn, {
                          type: "button",
                          variant: "secondary",
                          onClick: qn,
                          "data-testid": "nostrconnect-reset-relays",
                          children: (s, d) => {
                            Te();
                            var _ = ce();
                            p((V) => u(_, V), [() => n()("loginDialog.nostrconnect_reset_relays")]), i(s, _);
                          },
                          $$slots: { default: !0 }
                        }), r(Ht), r(Xe);
                        var Qn = l(Xe, 2);
                        {
                          var Fn = (s) => {
                            var d = Ur(), _ = a(d, !0);
                            r(d), p(() => u(_, e(Mt))), i(s, d);
                          };
                          S(Qn, (s) => {
                            e(Mt) && s(Fn);
                          });
                        }
                        p(
                          (s) => {
                            St(Ve, N() || ""), qe(Ve, "title", N() || ""), u(Wn, s);
                          },
                          [() => n()("loginDialog.nostrconnect_edit_relays")]
                        ), i(te, g);
                      },
                      $$slots: { default: !0 }
                    });
                  }), i(m, $);
                }, I = (m) => {
                  var $ = Pe(), x = A($);
                  Le(x, () => en, (y, Q) => {
                    Q(y, {
                      value: "bunker",
                      class: "remote-signer-panel bunker-panel",
                      children: (te, de) => {
                        var g = Wr(), P = a(g), q = a(P), K = a(q);
                        ut(K), Xt(K, (O) => o(R, O), () => e(R));
                        var F = l(K, 2);
                        {
                          var be = (O) => {
                            X(O, {
                              variant: "secondary",
                              type: "button",
                              className: "clear-input-btn",
                              get ariaLabel() {
                                return e(At);
                              },
                              onClick: _n,
                              get onmousedown() {
                                return vt;
                              },
                              get ontouchstart() {
                                return vt;
                              },
                              get disabled() {
                                return Ce();
                              },
                              children: (ve, Fe) => {
                                var Ae = zr();
                                i(ve, Ae);
                              },
                              $$slots: { default: !0 }
                            });
                          };
                          S(F, (O) => {
                            e(fe).length > 0 && O(be);
                          });
                        }
                        r(q);
                        var Ve = l(q, 2);
                        {
                          let O = c(() => Ce() ? "loading" : "");
                          X(Ve, {
                            variant: "primary",
                            shape: "square",
                            type: "submit",
                            get disabled() {
                              return Ce();
                            },
                            get className() {
                              return `bunker-connect-btn u-control ${e(O) ?? ""}`;
                            },
                            children: (ve, Fe) => {
                              var Ae = Pe(), Dt = A(Ae);
                              {
                                var $t = (se) => {
                                  ge(se, { showLoader: !0 });
                                }, Xe = (se) => {
                                  var Ye = ce();
                                  p((Ze) => u(Ye, Ze), [() => n()("loginDialog.bunker_connect")]), i(se, Ye);
                                };
                                S(Dt, (se) => {
                                  Ce() ? se($t) : se(Xe, -1);
                                });
                              }
                              i(ve, Ae);
                            },
                            $$slots: { default: !0 }
                          });
                        }
                        r(P);
                        var wt = l(P, 2);
                        {
                          var Qe = (O) => {
                            var ve = Hr(), Fe = a(ve, !0);
                            r(ve), p(() => u(Fe, e(Z))), i(O, ve);
                          };
                          S(wt, (O) => {
                            e(Z) && O(Qe);
                          });
                        }
                        r(g), p(() => {
                          St(K, e(fe)), K.disabled = Ce();
                        }), Gt("submit", g, (O) => {
                          O.preventDefault(), wn();
                        }), Rt("input", K, fn), i(te, g);
                      },
                      $$slots: { default: !0 }
                    });
                  }), i(m, $);
                };
                S(ee, (m) => {
                  e(Y) === "qr" ? m(oe) : m(I, -1);
                });
              }
              i(E, B);
            },
            $$slots: { default: !0 }
          });
        }), r(zt), r(Nt);
        var zn = l(Nt, 2);
        {
          var Hn = (w) => {
            var D = Qr(), E = A(D), ie = a(E), B = a(ie, !0);
            r(ie), r(E);
            var J = l(E, 2), ee = a(J), oe = l(a(ee), 2), I = a(oe, !0);
            r(oe), r(ee);
            var m = l(ee, 2), $ = a(m), x = a($), y = a(x);
            ut(y), Xt(y, (g) => o(C, g), () => e(C));
            var Q = l(y, 2);
            {
              var te = (g) => {
                X(g, {
                  variant: "secondary",
                  type: "button",
                  className: "clear-input-btn",
                  get ariaLabel() {
                    return e(At);
                  },
                  onClick: xn,
                  get onmousedown() {
                    return vt;
                  },
                  get ontouchstart() {
                    return vt;
                  },
                  children: (P, q) => {
                    var K = Br();
                    i(P, K);
                  },
                  $$slots: { default: !0 }
                });
              };
              S(Q, (g) => {
                z().length > 0 && g(te);
              });
            }
            r(x);
            var de = l(x, 2);
            X(de, {
              variant: "primary",
              shape: "square",
              type: "submit",
              className: "save-btn u-control",
              children: (g, P) => {
                Te();
                var q = ce();
                p((K) => u(q, K), [() => n()("loginDialog.save")]), i(g, q);
              },
              $$slots: { default: !0 }
            }), r($), r(m), r(J), p(
              (g, P, q) => {
                u(B, g), u(I, P), qe(y, "title", q);
              },
              [
                () => n()("common.or"),
                () => n()("loginDialog.input_secret"),
                () => n()("loginDialog.hint_input_secret")
              ]
            ), Gt("submit", m, Vn), Rt("input", y, () => e(C)?.setCustomValidity("")), dr(y, z), i(w, D);
          };
          S(zn, (w) => {
            Be() && w(Hn);
          });
        }
        p(
          (w, D) => {
            u(On, w), u(Un, D);
          },
          [
            () => n()("common.or"),
            () => n()("loginDialog.nostrconnect_input_title")
          ]
        ), i(ae, Ee);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var Mn = l(Ut, 2);
  tr(Mn, {
    get show() {
      return e(ot);
    },
    variant: "top-right",
    children: (t, M) => {
      var k = Xr(), ae = a(k, !0);
      r(k), p(($e) => u(ae, $e), [() => n()("loginDialog.nostrconnect_direct_open_hint")]), i(t, k);
    },
    $$slots: { default: !0 }
  }), i(Me, Kt);
  var Kn = an(An);
  return me(), Kn;
}
pr(["input"]);
nn(
  Gr,
  {
    show: {},
    secretKey: {},
    onClose: {},
    onSave: {},
    onParentClientLogin: {},
    onNip07Login: {},
    onNip46Login: {},
    onNostrConnectStart: {},
    onNostrConnectCancel: {},
    isParentClientAvailable: {},
    isLoadingParentClient: {},
    isNip07ExtensionAvailable: {},
    isLoadingNip07: {},
    isLoadingNip46: {},
    isPreparingNip46NostrConnect: {},
    isWaitingNip46NostrConnect: {},
    isHandshakeStartedNip46NostrConnect: {},
    nip46NostrConnectUri: {},
    nip46NostrConnectErrorMessage: {},
    initialNostrConnectRelayCandidates: {},
    isAddAccountMode: {},
    localNsecAuthEnabled: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  Gr as default
};
