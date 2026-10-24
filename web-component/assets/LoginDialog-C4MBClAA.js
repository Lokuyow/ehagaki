import { At as e, B as t, Ct as n, F as r, G as i, I as a, J as o, M as s, P as c, R as l, U as u, W as d, X as f, Y as ee, _ as te, a as p, at as m, ct as h, dt as g, et as _, f as ne, ft as v, gt as y, h as re, k as b, kt as x, lt as S, mt as C, o as w, ot as T, q as E, r as D, s as ie, ut as O, v as k, w as A, wt as j, y as ae, yt as M } from "./index-client-Bdka-Daw.js";
import { pt as N, t as P } from "./LoadingPlaceholder-j1_vRYno.js";
import { c as F, l as oe } from "./appUtils-Bsk0mFqn.js";
import { a as se, s as ce } from "./nip46Service-Dm-_k9SF.js";
import { i as le } from "./clipboardUtils-a0DTSm8D.js";
import { t as ue } from "./useDialogHistory.svelte-C49eZejL.js";
import { t as de } from "./DialogWrapper-C4-jPsAO.js";
import { t as fe } from "./dialog-close-DgGAhT4f.js";
import { i as pe, n as me, r as he, t as ge } from "./tabs-trigger-CTsCGK_5.js";
import { i as _e } from "./keyboardFocusUtils-Cil9djR5.js";
import { C as ve, D as ye, E as be, S as xe, T as Se, w as Ce } from "./App-BVcniO1E.js";
import { t as we } from "./InfoPopoverButton-CH8LtJ7D.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/QrCodeDisplay.svelte
var Te = i("<div class=\"qr-code-svg svelte-1pb586e\" role=\"img\"></div>"), I = i("<div class=\"qr-code-placeholder svelte-1pb586e\" aria-hidden=\"true\"></div>"), L = i("<div class=\"qr-code-frame\"><!></div>"), Ee = {
	hash: "svelte-1pb586e",
	code: ".qr-code-svg.svelte-1pb586e {display:flex;justify-content:center;align-items:center;width:100%;}.qr-code-svg.svelte-1pb586e svg {display:block;width:min(100%, 288px);height:auto;background:#ffffff;}.qr-code-placeholder.svelte-1pb586e {width:min(100%, 288px);aspect-ratio:1;border-radius:12px;background:color-mix(in srgb, var(--text) 6%, #ffffff);}"
};
function De(t, r) {
	j(r, !0), b(t, Ee);
	let i = y(""), a = 0;
	T(() => {
		let e = r.value, t = ++a;
		C(i, ""), e && Ce(e).then((n) => {
			t === a && r.value === e && C(i, n, !0);
		}).catch(() => {
			t === a && C(i, "");
		});
	});
	var o = L(), s = h(o), d = (t) => {
		var n = Te();
		c(n, () => _(i), !0), e(n), m(() => k(n, "aria-label", r.label)), u(t, n);
	}, f = (e) => {
		var t = I();
		u(e, t);
	};
	l(s, (e) => {
		_(i) ? e(d) : e(f, -1);
	}), e(o), m(() => k(o, "data-qr-value", r.value)), u(t, o), n();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/LoginDialog.svelte
var Oe = i("<div><span style=\"word-break:break-all\"> </span></div>"), ke = i("<div class=\"toast npub-toast svelte-1vy8d2x\"><!> <!></div>"), Ae = i("<div class=\"xmark-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), je = i("<div class=\"parent-client-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Me = i("<div class=\"parent-client-section svelte-1vy8d2x\"><!> <div aria-live=\"polite\"> </div></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div>", 1), Ne = i("<div class=\"extension-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Pe = i("<div aria-live=\"polite\"> </div>"), Fe = i("<div class=\"vault-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Ie = i("<!> <!>", 1), Le = i("<div class=\"nostrconnect-qr-shell svelte-1vy8d2x\" data-testid=\"nostrconnect-qr-code\"><!></div>"), Re = i("<div class=\"nostrconnect-qr-loading svelte-1vy8d2x\"><!></div>"), ze = i("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div>"), Be = i("<div class=\"nostrconnect-relay-popover svelte-1vy8d2x\"><div> </div> <div> </div> <div> </div></div>"), Ve = i("<div class=\"close-icon svg-icon\" aria-hidden=\"true\"></div>"), He = i("<div class=\"nostrconnect-relay-row svelte-1vy8d2x\"><input type=\"url\" class=\"nostrconnect-relay-field svelte-1vy8d2x\"/> <!></div>"), Ue = i("<div class=\"section-feedback error svelte-1vy8d2x\" aria-live=\"polite\" role=\"alert\"> </div>"), We = i("<!> <div class=\"nostrconnect-uri-card svelte-1vy8d2x\"><div class=\"nostrconnect-uri svelte-1vy8d2x\" data-testid=\"nostrconnect-uri\"><input type=\"text\" readonly=\"\" spellcheck=\"false\" autocomplete=\"off\" class=\"svelte-1vy8d2x\"/> <!></div></div> <div class=\"section-feedback info nostrconnect-status svelte-1vy8d2x\" role=\"status\"><!></div> <div class=\"nostrconnect-relay-settings svelte-1vy8d2x\"><div class=\"nostrconnect-relay-settings-header\"><div class=\"nostrconnect-relay-settings-title-row svelte-1vy8d2x\"><span class=\"nostrconnect-relay-settings-title svelte-1vy8d2x\"> </span> <!></div></div> <div class=\"nostrconnect-relay-editor-list svelte-1vy8d2x\"></div> <div class=\"nostrconnect-relay-editor-actions svelte-1vy8d2x\"><!> <!> <!></div></div> <!>", 1), Ge = i("<div class=\"clear-input-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), Ke = i("<form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"bunker-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"bunker://...\" class=\"bunker-input u-control svelte-1vy8d2x\" required=\"\" autocomplete=\"off\"/> <!></div> <!></div> <!></form>"), qe = i("<div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"secret-key-section svelte-1vy8d2x\"><div class=\"secret-heading-row svelte-1vy8d2x\"><div class=\"secret-icon svg-icon svelte-1vy8d2x\"></div> <h3 class=\"svelte-1vy8d2x\"> </h3></div> <form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"secret-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"nsec1...\" class=\"secret-input u-control svelte-1vy8d2x\" id=\"secretKey\" name=\"secretKey\" autocomplete=\"current-password\" required=\"\" minlength=\"63\" maxlength=\"63\"/> <!></div> <!></div></form></div>", 1), Je = i("<!> <div class=\"nip07-login-section svelte-1vy8d2x\"><!> <!></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"remote-signer-section svelte-1vy8d2x\"><!> <details class=\"remote-signer-details svelte-1vy8d2x\"><summary class=\"svelte-1vy8d2x\"> </summary> <!></details></div> <!>", 1), Ye = i("<div> </div>"), Xe = i("<!> <!> <!>", 1), Ze = {
	hash: "svelte-1vy8d2x",
	code: ".xmark-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}form.svelte-1vy8d2x {width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;}\n\n    /* トースト用スタイル */.toast.svelte-1vy8d2x {position:fixed;top:0px;left:50%;translate:-50% 0;display:flex;width:100%;max-width:500px;background:var(--dialog-bg);color:var(--text);border-radius:0 0 10px 10px;z-index:101;font-family:monospace;font-size:1rem;line-height:1.2;word-break:break-all;flex-direction:column;align-items:flex-start;gap:6px;padding:8px 14px 14px;margin-bottom:8px;}\n    @keyframes svelte-1vy8d2x-toast-fadein {\n        from {\n            opacity: 0;\n            translate: -50% -10px;\n        }\n        to {\n            opacity: 0.98;\n            translate: -50% 0;\n        }\n    }.parent-client-section.svelte-1vy8d2x,\n    .nip07-login-section.svelte-1vy8d2x {display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;gap:6px;}.parent-client-feedback.svelte-1vy8d2x,\n    .section-feedback.svelte-1vy8d2x {font-size:0.95rem;text-align:center;}.parent-client-feedback.info.svelte-1vy8d2x,\n    .section-feedback.info.svelte-1vy8d2x {color:var(--text-light);}.parent-client-feedback.error.svelte-1vy8d2x,\n    .section-feedback.error.svelte-1vy8d2x {background:var(--balloon-error-bg, hsl(351, 99%, 96%));border:1px solid var(--balloon-error-border, hsl(351, 99%, 70%));color:var(--balloon-error-color, hsl(351, 99%, 32%));}.parent-client-login-button.primary,\n    .nip07-login-button.primary,\n    .nostrconnect-open-btn.primary {flex-shrink:0;position:relative;overflow:hidden;.btn-text.svelte-1vy8d2x {font-size:1.125rem;}}.parent-client-login-button.loading,\n    .nip07-login-button.loading,\n    .nostrconnect-open-btn.loading {cursor:not-allowed;}.svg-icon.parent-client-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.svg-icon.extension-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-657874656e73696f6e5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.remote-signer-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:6px;}.secret-key-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:10px;}.remote-signer-panel {display:flex;flex-direction:column;gap:8px;}.remote-signer-details.svelte-1vy8d2x {width:100%;background:var(--dialog-bg2);border-radius:8px;}.remote-signer-details.svelte-1vy8d2x summary:where(.svelte-1vy8d2x) {padding:12px;cursor:pointer;font-weight:600;}.secret-heading-row.svelte-1vy8d2x {display:flex;gap:6px;justify-content:center;align-items:center;width:100%;}.secret-input-row.svelte-1vy8d2x,\n    .bunker-input-row.svelte-1vy8d2x {display:flex;gap:6px;width:100%;flex:none;}.input-shell.svelte-1vy8d2x {position:relative;display:flex;align-items:center;flex:1;min-width:0;}.secret-input.svelte-1vy8d2x,\n    .bunker-input.svelte-1vy8d2x {font-family:monospace;font-size:1rem;padding:0.6rem 3.25rem 0.6rem 0.6rem;background-color:var(--btn-bg);border:none;flex:1;min-width:0;}.ehagaki-app-root button.clear-input-btn {position:absolute;inset:50% auto 50% auto;right:2px;transform:translateY(-50%);width:46px;min-width:46px;height:46px;min-height:46px;padding:0;display:inline-flex;align-items:center;justify-content:center;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);flex:0 0 auto;z-index:1;}.ehagaki-app-root button.clear-input-btn:hover:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:active:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:focus-visible,\n    .ehagaki-app-root button.clear-input-btn:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.clear-input-btn:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.clear-input-icon.svelte-1vy8d2x {width:24px;height:24px;mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.secret-heading-row.svelte-1vy8d2x h3:where(.svelte-1vy8d2x) {margin:0;}.remote-signer-tabs {display:flex;flex-direction:column;padding:8px;gap:8px;}.remote-signer-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}.remote-signer-tab {background:var(--btn-bg);--btn-bg: var(--btn-bg2);color:var(--text);padding:12px 16px;font-size:0.95rem;font-weight:600;cursor:pointer;&[data-value=\"qr\"] {border-start-start-radius:10px;border-end-start-radius:10px;}&[data-value=\"bunker\"] {border-start-end-radius:10px;border-end-end-radius:10px;}}.nostrconnect-qr-shell.svelte-1vy8d2x,\n    .nostrconnect-qr-loading.svelte-1vy8d2x {width:100%;}.nostrconnect-qr-loading.svelte-1vy8d2x {min-height:320px;display:flex;align-items:center;justify-content:center;padding:16px;border-radius:16px;background:var(--btn-bg);border:1px solid var(--border-hr);}.nostrconnect-uri-card.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-uri.svelte-1vy8d2x {display:flex;align-items:center;position:relative;height:40px;padding:0 40px 0 12px;background:var(--btn-bg2);border-radius:12px;font-family:monospace;font-size:0.9rem;}.nostrconnect-uri.svelte-1vy8d2x input:where(.svelte-1vy8d2x) {width:100%;border:none;background:transparent;font-family:inherit;font-size:inherit;outline:none;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}button.nostrconnect-copy-btn.circle.copy {position:absolute;inset:auto 2px 2px auto;width:34px;min-width:34px;height:34px;flex:0 0 34px;z-index:1;}button.nostrconnect-copy-btn .copy-icon {width:18px;height:18px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.nostrconnect-relay-editor-actions.svelte-1vy8d2x {display:flex;flex-wrap:wrap;gap:6px;}.nostrconnect-relay-settings.svelte-1vy8d2x {display:flex;flex-direction:column;gap:6px;padding:2px 12px 12px;background:var(--dialog-bg3);border-radius:16px;}.nostrconnect-relay-settings-title-row.svelte-1vy8d2x {display:flex;align-items:center;}.nostrconnect-relay-settings-title.svelte-1vy8d2x {font-weight:600;}.nostrconnect-relay-popover.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-relay-editor-list.svelte-1vy8d2x {display:flex;flex-direction:column;gap:4px;}.nostrconnect-relay-row.svelte-1vy8d2x {display:flex;align-items:stretch;height:40px;.nostrconnect-remove-relay-btn {width:auto;height:auto;border-radius:0 12px 12px 0;--btn-bg: var(--btn-bg3);opacity:1;aspect-ratio:1;.close-icon {--svg: currentColor;width:24px;height:24px;}}}.nostrconnect-relay-field.svelte-1vy8d2x {flex:1;width:auto;height:auto;padding:0 0.75rem;background:var(--btn-bg3);border:none;border-radius:12px 0 0 12px;font-family:monospace;font-size:0.95rem;}.secret-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6b65795f766572746963616c5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;flex:0 0 28px;display:inline-block;vertical-align:middle;}.vault-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-736869656c645f6c6f636b65645f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;display:inline-block;vertical-align:middle;}\n\n    @media (max-width: 600px) {.bunker-input-row.svelte-1vy8d2x,\n        .secret-input-row.svelte-1vy8d2x {flex-direction:column;}\n    }.divider.svelte-1vy8d2x {display:flex;align-items:center;text-align:center;margin:16px 0;width:100%;}.divider.svelte-1vy8d2x::before,\n    .divider.svelte-1vy8d2x::after {content:\"\";flex:1;height:1px;background:var(--border-hr);}.divider.svelte-1vy8d2x span:where(.svelte-1vy8d2x) {color:var(--text-light);padding:0 16px;font-size:1rem;}input.u-control, button.u-control {min-height:50px;min-width:60px;width:100%;display:inline-flex;align-items:center;}\n\n    @media (min-width: 601px) {.save-btn.u-control, .bunker-connect-btn.u-control {width:120px;}\n    }"
};
function Qe(i, o) {
	j(o, !0), b(i, Ze);
	let c = () => ie(N, "$_", Ce), [Ce, Te] = w(), I = D(o, "show", 15, !1), L = D(o, "secretKey", 15), Ee = D(o, "isParentClientAvailable", 3, !1), Qe = D(o, "isLoadingParentClient", 3, !1), $e = D(o, "isNip07ExtensionAvailable", 3, !1), et = D(o, "isLoadingNip07", 3, !1), tt = D(o, "isLoadingNip46", 3, !1), nt = D(o, "isPreparingNip46NostrConnect", 3, !1), rt = D(o, "isWaitingNip46NostrConnect", 3, !1), it = D(o, "isHandshakeStartedNip46NostrConnect", 3, !1), R = D(o, "nip46NostrConnectUri", 3, null), at = D(o, "nip46NostrConnectErrorMessage", 3, ""), ot = D(o, "initialNostrConnectRelayCandidates", 19, () => []), st = D(o, "isAddAccountMode", 3, !1), ct = D(o, "localNsecAuthEnabled", 3, !0);
	function lt() {
		I(!1), o.onClose?.();
	}
	ue(() => I(), lt, !0);
	let ut = M($e), dt = M(Ee), ft = new ce(), pt = M(() => ft.isValid), mt = M(() => ft.npub), ht = M(() => ft.nprofile), gt = M(() => c()("clearInput") === "clearInput" ? "入力内容を消去" : c()("clearInput")), z = y(null), B = y(""), V = y("qr"), _t = y(!1), vt = y(null), H = y(v([""])), U = y(null), W = y(""), G = y(""), K = y(""), yt = y(!1), bt = y(!1), q = y(!1), J, xt = y(null);
	function Y() {
		J &&= (clearTimeout(J), void 0), C(xt, null), C(bt, !1);
	}
	function X() {
		Y(), C(q, !1);
	}
	function St() {
		return ot().length > 0 ? [...ot()] : Se();
	}
	function Ct() {
		X(), C(H, xe(St()), !0), C(V, "qr"), C(vt, null);
	}
	T(() => {
		I() && !_(_t) ? (C(_t, !0), L(""), C(B, ""), C(W, ""), C(G, ""), C(K, ""), C(yt, !1), Ct(), queueMicrotask(() => {
			I() && _(V) === "qr" && Wt();
		})) : I() || (C(_t, !1), X());
	}), T(() => {
		R(), C(yt, !1), X();
	}), T(() => {
		if (typeof document > "u") return;
		function e() {
			document.visibilityState !== "visible" && Y();
		}
		return document.addEventListener("visibilitychange", e), () => {
			document.removeEventListener("visibilitychange", e), X();
		};
	});
	let Z = M(() => ye(_(H))), wt = M(() => _(Z).errorKey === null ? _(Z).relays.join("\n") : null), Tt = M(() => _(V) === "qr" && _(Z).errorKey ? c()(_(Z).errorKey) : ""), Q = M(nt), $ = M(it), Et = M(() => _(Q) || rt()), Dt = M(() => _(Q) || _(Z).errorKey !== null || !_(wt) || !!R() && _(wt) === _(vt));
	T(() => {
		_($) && (C(q, !1), Y());
	}), T(() => {
		I(), _(V), R(), _(Et), I() && _(V) === "qr" && R() && _(Et) || X();
	}), T(() => {
		L() !== void 0 && ft.setNsec(L());
	}), T(() => {
		L() !== void 0 && _(z) && !L() && _(z).setCustomValidity("");
	});
	function Ot(e) {
		C(B, e.currentTarget.value, !0), C(K, ""), _(U) && _(U).setCustomValidity("");
	}
	function kt() {
		_(B) && (C(B, ""), C(K, ""), _(U)?.setCustomValidity(""), _(U)?.focus({ preventScroll: !0 }));
	}
	function At() {
		L() && (L(""), _(z)?.setCustomValidity(""), _(z)?.focus({ preventScroll: !0 }));
	}
	function jt() {
		if (X(), _(z)) {
			let e = _(z).validity, t = _(z).value ?? "";
			if (e.valueMissing) {
				_(z).setCustomValidity(c()("loginDialog.secret_key_required")), _(z).reportValidity();
				return;
			}
			if (!t.startsWith("nsec1")) {
				_(z).setCustomValidity(c()("loginDialog.secret_must_start_nsec1")), _(z).reportValidity();
				return;
			}
			if (t.length !== 63) {
				t.length < 63 ? _(z).setCustomValidity(c()("loginDialog.secret_too_short")) : _(z).setCustomValidity(c()("loginDialog.secret_too_long")), _(z).reportValidity();
				return;
			}
			if (!_(pt)) {
				_(z).setCustomValidity(c()("loginDialog.invalid_secret")), _(z).reportValidity();
				return;
			}
			_(z).setCustomValidity("");
		}
		o.onSave?.();
	}
	function Mt(e) {
		switch (e) {
			case "nip07_not_available": return c()("loginDialog.extension_not_found");
			case "nip07_auth_error": return c()("loginDialog.extension_login_failed");
			default: return e.startsWith("nip07_") ? c()("loginDialog.extension_login_failed") : e;
		}
	}
	function Nt(e) {
		switch (e) {
			case "Invalid bunker URL": return c()("loginDialog.bunker_invalid");
			case "nip46_connection_failed": return c()("loginDialog.bunker_connection_failed");
			default: return e;
		}
	}
	function Pt(e) {
		switch (e) {
			case "At least one public wss relay is required for nostrconnect": return c()("loginDialog.nostrconnect_relay_required");
			case "Nostr Connect timed out before the remote signer connected": return c()("loginDialog.nostrconnect_timeout");
			case "Timed out waiting for switch_relays response":
			case "Relay connection failed":
			case "Nostr Connect handshake pool is unavailable": return c()("loginDialog.nostrconnect_connection_failed");
			case "Timed out waiting for final relay list":
			case "Remote signer did not return final relay list":
			case "Remote signer returned an invalid final relay list":
			case "Remote signer returned an unsupported final relay": return c()("loginDialog.nostrconnect_relay_reconciliation_failed");
			case "Remote signer did not return any usable connection relay": return c()("loginDialog.nostrconnect_no_usable_final_relay");
			case "Could not connect to the local relay specified by the remote signer": return c()("loginDialog.nostrconnect_local_final_relay_unreachable");
			case "Communication could not be verified on the relay selected by the remote signer": return c()("loginDialog.nostrconnect_final_relay_verification_failed");
			case "Nostr Connect connection was cancelled": return "";
			default: return e.startsWith("Relay connection failed:") ? c()("loginDialog.nostrconnect_connection_failed") : e;
		}
	}
	async function Ft() {
		X(), C(G, "");
		let e = await o.onNip07Login?.();
		e && C(G, Mt(e), !0);
	}
	function It(e) {
		switch (e) {
			case "parent_client_not_available": return c()("loginDialog.parent_client_not_available");
			case "parent_client_timeout": return c()("loginDialog.parent_client_timeout");
			case "parent_client_auth_rejected": return c()("loginDialog.parent_client_auth_rejected");
			case "parent_client_not_logged_in": return c()("loginDialog.parent_client_not_logged_in");
			case "parent_client_disconnected": return c()("loginDialog.parent_client_disconnected");
			case "parent_client_invalid_response": return c()("loginDialog.parent_client_invalid_response");
			case "parent_client_auth_error": return c()("loginDialog.parent_client_auth_error");
			default: return e.startsWith("parent_client_") ? c()("loginDialog.parent_client_auth_error") : e;
		}
	}
	async function Lt() {
		X(), C(W, "");
		let e = await o.onParentClientLogin?.();
		e && C(W, It(e), !0);
	}
	async function Rt() {
		if (X(), C(K, ""), _(U)) {
			let e = _(U).value.trim();
			if (C(B, e, !0), _(U).validity.valueMissing) {
				C(K, c()("loginDialog.bunker_url_required"), !0), _(U).setCustomValidity(_(K)), _(U).reportValidity();
				return;
			}
			if (!se.test(e)) {
				C(K, c()("loginDialog.bunker_invalid"), !0), _(U).setCustomValidity(_(K)), _(U).reportValidity();
				return;
			}
			_(U).setCustomValidity("");
		}
		let e = _(B).trim(), t = await o.onNip46Login?.(e);
		if (t && _(U)) {
			let e = Nt(t);
			C(K, e, !0), _(U).setCustomValidity(e), _(U).reportValidity();
		} else C(K, "");
	}
	function zt(e) {
		_(V) !== e && (C(V, e, !0), X(), C(vt, null));
	}
	function Bt(e, t) {
		let n = [..._(H)];
		n[e] = t, C(H, ve(n), !0);
	}
	function Vt() {
		C(H, [..._(H), ""], !0);
	}
	function Ht(e) {
		C(H, ve(_(H).filter((t, n) => n !== e)), !0);
	}
	function Ut() {
		C(H, xe(Se()), !0);
	}
	async function Wt() {
		_(V) === "qr" && _(Z).errorKey === null && _(wt) && (_(Et) && o.onNostrConnectCancel?.(), C(vt, _(wt), !0), await o.onNostrConnectStart?.(_(Z).relays));
	}
	function Gt() {
		if (!R()) return;
		let e = R();
		Y(), C(xt, e, !0), C(q, !0), be(e), J = setTimeout(() => {
			J = void 0, typeof document < "u" && document.visibilityState !== "visible" ? Y() : I() && _(V) === "qr" && (nt() || rt()) && !_($) && R() === e && _(xt) === e ? (C(bt, !0), J = setTimeout(() => {
				C(bt, !1), J = void 0;
			}, 6e3)) : Y();
		}, 1200);
	}
	async function Kt() {
		if (!R()) return !1;
		let e = await le(R(), "nostrconnect");
		return C(yt, e, !0), e;
	}
	let qt = M(() => at() ? Pt(at()) : ""), Jt = M(() => _(V) === "qr" ? _(qt) || _(Tt) : "");
	function Yt(e) {
		X(), e.preventDefault(), jt();
	}
	var Xt = Xe(), Zt = S(Xt), Qt = (n) => {
		var r = ke(), i = h(r), a = (n) => {
			var r = Oe(), i = h(r), a = O(i, !0);
			e(r), m(() => t(a, _(mt))), u(n, r);
		};
		l(i, (e) => {
			_(mt) && e(a);
		});
		var o = g(i, 2), s = (n) => {
			var r = Oe(), i = h(r), a = O(i, !0);
			e(r), m(() => t(a, _(ht))), u(n, r);
		};
		l(o, (e) => {
			_(ht) && e(s);
		}), e(r), u(n, r);
	};
	l(Zt, (e) => {
		(_(mt) || _(ht)) && e(Qt);
	});
	var $t = g(Zt, 2);
	{
		let n = (e) => {
			var t = d(), n = S(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = M(() => c()("global.close"));
						F(e, p(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return _(t);
							},
							children: (e, t) => {
								var n = Ae();
								u(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				s(n, () => fe, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			u(e, t);
		}, i = M(() => st() ? c()("loginDialog.add_account_title") : ct() ? c()("loginDialog.input_secret") : c()("common.login")), o = M(() => st() ? c()("loginDialog.add_account_hint") : ct() ? c()("loginDialog.hint_input_secret") : c()("loginDialog.login_methods_hint"));
		de($t, {
			onOpenChange: (e) => !e && lt(),
			get title() {
				return _(i);
			},
			get description() {
				return _(o);
			},
			contentClass: "login-dialog",
			footerVariant: "close-button",
			get open() {
				return I();
			},
			set open(e) {
				I(e);
			},
			footer: n,
			children: (n, i) => {
				var o = Je(), p = S(o), v = (n) => {
					var r = Me(), i = S(r), a = h(i);
					{
						let e = M(() => Qe() ? "loading" : "");
						F(a, {
							variant: "primary",
							shape: "square",
							get className() {
								return `parent-client-login-button u-control ${_(e) ?? ""}`;
							},
							onClick: Lt,
							get disabled() {
								return Qe();
							},
							children: (e, n) => {
								var r = d(), i = S(r), a = (e) => {
									P(e, {
										text: !0,
										showLoader: !0
									});
								}, o = (e) => {
									var n = je(), r = g(S(n), 2), i = O(r, !0);
									m((e) => t(i, e), [() => c()("loginDialog.login_with_parent_client")]), u(e, n);
								};
								l(i, (e) => {
									Qe() ? e(a) : e(o, -1);
								}), u(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					var o = g(a, 2), s = O(o, !0);
					e(i);
					var f = g(i, 2), ee = h(f), te = O(ee, !0);
					e(f), m((e, n) => {
						A(o, 1, `parent-client-feedback ${_(W) ? "error" : "info"}`, "svelte-1vy8d2x"), k(o, "role", _(W) ? "alert" : "status"), t(s, e), t(te, n);
					}, [() => _(W) || c()("loginDialog.parent_client_hint"), () => c()("common.or")]), u(n, r);
				};
				l(p, (e) => {
					_(dt) && e(v);
				});
				var y = g(p, 2), b = h(y);
				{
					let e = M(() => et() ? "loading" : ""), n = M(() => et() || !_(ut));
					F(b, {
						variant: "primary",
						shape: "square",
						get className() {
							return `nip07-login-button u-control ${_(e) ?? ""}`;
						},
						onClick: Ft,
						get disabled() {
							return _(n);
						},
						children: (e, n) => {
							var r = d(), i = S(r), a = (e) => {
								P(e, {
									text: !0,
									showLoader: !0
								});
							}, o = (e) => {
								var n = Ne(), r = g(S(n), 2), i = O(r, !0);
								m((e) => t(i, e), [() => c()("loginDialog.login_with_extension")]), u(e, n);
							};
							l(i, (e) => {
								et() ? e(a) : e(o, -1);
							}), u(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var w = g(b, 2), T = (e) => {
					var n = Pe(), r = O(n, !0);
					m((e) => {
						A(n, 1, `section-feedback ${_(G) ? "error" : "info"}`, "svelte-1vy8d2x"), k(n, "role", _(G) ? "alert" : "status"), t(r, e);
					}, [() => _(G) || c()("loginDialog.extension_not_found")]), u(e, n);
				};
				l(w, (e) => {
					(_(G) || !_(ut)) && e(T);
				}), e(y);
				var D = g(y, 2), ie = h(D), j = O(ie, !0);
				e(D);
				var N = g(D, 2), oe = h(N);
				{
					let e = M(() => _($) ? c()("loginDialog.nostrconnect_handshake_started") : _(q) ? c()("loginDialog.nostrconnect_opening_signer") : c()("loginDialog.nostrconnect_open")), n = M(() => _(Q) || !R() || _(q) || _($)), r = M(() => _(Q) && !R() || _(q) || _($) ? "loading" : "");
					F(oe, {
						type: "button",
						variant: "primary",
						shape: "square",
						get ariaLabel() {
							return _(e);
						},
						onClick: Gt,
						get disabled() {
							return _(n);
						},
						get className() {
							return `nostrconnect-open-btn u-control ${_(r) ?? ""}`;
						},
						"data-testid": "nostrconnect-open-button",
						children: (e, n) => {
							var r = d(), i = S(r), a = (e) => {
								{
									let t = M(() => c()("loginDialog.nostrconnect_preparing"));
									P(e, {
										get text() {
											return _(t);
										},
										showLoader: !0
									});
								}
							}, o = (e) => {
								{
									let t = M(() => c()("loginDialog.nostrconnect_handshake_started"));
									P(e, {
										get text() {
											return _(t);
										},
										showLoader: !0
									});
								}
							}, s = (e) => {
								{
									let t = M(() => c()("loginDialog.nostrconnect_opening_signer"));
									P(e, {
										get text() {
											return _(t);
										},
										showLoader: !0
									});
								}
							}, f = (e) => {
								var n = Fe(), r = g(S(n), 2), i = O(r, !0);
								m((e) => t(i, e), [() => c()("loginDialog.remote_signer_title")]), u(e, n);
							};
							l(i, (e) => {
								_(Q) && !R() ? e(a) : _($) ? e(o, 1) : _(q) ? e(s, 2) : e(f, -1);
							}), u(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var se = g(oe, 2), ce = h(se), le = O(ce, !0), ue = g(ce, 2);
				s(ue, () => pe, (n, i) => {
					i(n, {
						get value() {
							return _(V);
						},
						onValueChange: (e) => zt(e),
						class: "remote-signer-tabs",
						children: (n, i) => {
							var o = Ie(), p = S(o);
							s(p, () => me, (e, n) => {
								n(e, {
									class: "remote-signer-tab-list",
									children: (e, n) => {
										var r = Ie(), i = S(r);
										s(i, () => ge, (e, n) => {
											n(e, {
												value: "qr",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-qr-tab",
												children: (e, n) => {
													x();
													var r = E();
													m((e) => t(r, e), [() => c()("loginDialog.nostrconnect_qr_tab")]), u(e, r);
												},
												$$slots: { default: !0 }
											});
										});
										var a = g(i, 2);
										s(a, () => ge, (e, n) => {
											n(e, {
												value: "bunker",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-bunker-tab",
												children: (e, n) => {
													x();
													var r = E();
													m((e) => t(r, e), [() => c()("loginDialog.nostrconnect_bunker_tab")]), u(e, r);
												},
												$$slots: { default: !0 }
											});
										}), u(e, r);
									},
									$$slots: { default: !0 }
								});
							});
							var v = g(p, 2), y = (n) => {
								var i = d(), o = S(i);
								s(o, () => he, (n, i) => {
									i(n, {
										value: "qr",
										class: "remote-signer-panel nostrconnect-panel",
										children: (n, i) => {
											var o = We(), s = S(o), d = (t) => {
												var n = Le(), r = h(n);
												{
													let e = M(() => c()("loginDialog.nostrconnect_qr_alt"));
													De(r, {
														get value() {
															return R();
														},
														get label() {
															return _(e);
														}
													});
												}
												e(n), u(t, n);
											}, f = (t) => {
												var n = Re(), r = h(n);
												P(r, {
													text: !0,
													showLoader: !0
												}), e(n), u(t, n);
											};
											l(s, (e) => {
												R() ? e(d) : _(Q) && e(f, 1);
											});
											var p = g(s, 2), ne = h(p), v = h(ne);
											te(v);
											var y = g(v, 2);
											{
												let e = M(() => c()("common.copySuccess")), t = M(() => _(Q) || !R()), n = M(() => _(yt) ? c()("loginDialog.nostrconnect_copied") : c()("loginDialog.nostrconnect_copy"));
												F(y, {
													type: "button",
													variant: "copy",
													shape: "circle",
													contentLayout: "icon",
													onClick: Kt,
													get floatingMessage() {
														return _(e);
													},
													get disabled() {
														return _(t);
													},
													className: "nostrconnect-copy-btn",
													get ariaLabel() {
														return _(n);
													},
													"data-testid": "nostrconnect-copy-button",
													children: (e, t) => {
														var n = ze();
														u(e, n);
													},
													$$slots: { default: !0 }
												});
											}
											e(ne), e(p);
											var re = g(p, 2), b = h(re), C = (e) => {
												var n = E();
												m((e) => t(n, e), [() => c()("loginDialog.nostrconnect_preparing")]), u(e, n);
											}, w = (e) => {
												{
													let t = M(() => c()("loginDialog.nostrconnect_opening_signer"));
													P(e, {
														get text() {
															return _(t);
														},
														showLoader: !0
													});
												}
											}, T = (e) => {
												{
													let t = M(() => c()("loginDialog.nostrconnect_handshake_started"));
													P(e, {
														get text() {
															return _(t);
														},
														showLoader: !0
													});
												}
											}, D = (e) => {
												var n = E();
												m((e) => t(n, e), [() => c()("loginDialog.nostrconnect_waiting")]), u(e, n);
											}, ie = (e) => {
												var n = E();
												m((e) => t(n, e), [() => c()("loginDialog.nostrconnect_idle")]), u(e, n);
											};
											l(b, (e) => {
												_(Q) ? e(C) : _(q) ? e(w, 1) : _($) ? e(T, 2) : rt() ? e(D, 3) : e(ie, -1);
											}), e(re);
											var A = g(re, 2), j = h(A), N = h(j), oe = h(N), se = O(oe, !0), ce = g(oe, 2);
											{
												let n = M(() => c()("loginDialog.nostrconnect_relay_settings_description"));
												we(ce, {
													side: "top",
													sideOffset: 8,
													get ariaLabel() {
														return _(n);
													},
													children: (n, r) => {
														var i = Be(), a = h(i), o = O(a, !0), s = g(a, 2), l = O(s, !0), d = g(s, 2), f = O(d, !0);
														e(i), m((e, n, r) => {
															t(o, e), t(l, n), t(f, r);
														}, [
															() => c()("loginDialog.nostrconnect_relay_hint"),
															() => c()("loginDialog.nostrconnect_relay_update_hint"),
															() => c()("loginDialog.nostrconnect_relay_switch_hint")
														]), u(n, i);
													},
													$$slots: { default: !0 }
												});
											}
											e(N), e(j);
											var le = g(j, 2);
											r(le, 21, () => _(H), a, (t, n, r) => {
												var i = He(), a = h(i);
												te(a);
												var o = g(a, 2);
												{
													let e = M(() => c()("loginDialog.nostrconnect_remove_relay")), t = M(() => _(H).length === 1 && !_(n).trim());
													F(o, {
														type: "button",
														variant: "close",
														shape: "rounded",
														className: "nostrconnect-remove-relay-btn",
														get ariaLabel() {
															return _(e);
														},
														onClick: () => Ht(r),
														get disabled() {
															return _(t);
														},
														children: (e, t) => {
															var n = Ve();
															u(e, n);
														},
														$$slots: { default: !0 }
													});
												}
												e(i), m((e) => {
													ae(a, _(n)), k(a, "placeholder", e);
												}, [() => c()("loginDialog.nostrconnect_relay_placeholder")]), ee("input", a, (e) => Bt(r, e.currentTarget.value)), u(t, i);
											}), e(le);
											var ue = g(le, 2), de = h(ue);
											F(de, {
												type: "button",
												variant: "primary",
												onClick: Wt,
												get disabled() {
													return _(Dt);
												},
												"data-testid": "nostrconnect-regenerate",
												children: (e, n) => {
													x();
													var r = E();
													m((e) => t(r, e), [() => c()("loginDialog.nostrconnect_generate")]), u(e, r);
												},
												$$slots: { default: !0 }
											});
											var fe = g(de, 2);
											F(fe, {
												type: "button",
												variant: "secondary",
												onClick: Vt,
												children: (e, n) => {
													x();
													var r = E();
													m((e) => t(r, e), [() => c()("loginDialog.nostrconnect_add_relay")]), u(e, r);
												},
												$$slots: { default: !0 }
											});
											var pe = g(fe, 2);
											F(pe, {
												type: "button",
												variant: "secondary",
												onClick: Ut,
												"data-testid": "nostrconnect-reset-relays",
												children: (e, n) => {
													x();
													var r = E();
													m((e) => t(r, e), [() => c()("loginDialog.nostrconnect_reset_relays")]), u(e, r);
												},
												$$slots: { default: !0 }
											}), e(ue), e(A);
											var me = g(A, 2), he = (e) => {
												var n = Ue(), r = O(n, !0);
												m(() => t(r, _(Jt))), u(e, n);
											};
											l(me, (e) => {
												_(Jt) && e(he);
											}), m((e) => {
												ae(v, R() || ""), k(v, "title", R() || ""), t(se, e);
											}, [() => c()("loginDialog.nostrconnect_edit_relays")]), u(n, o);
										},
										$$slots: { default: !0 }
									});
								}), u(n, i);
							}, re = (n) => {
								var r = d(), i = S(r);
								s(i, () => he, (n, r) => {
									r(n, {
										value: "bunker",
										class: "remote-signer-panel bunker-panel",
										children: (n, r) => {
											var i = Ke(), a = h(i), o = h(a), s = h(o);
											te(s), ne(s, (e) => C(U, e), () => _(U));
											var p = g(s, 2), v = (e) => {
												F(e, {
													variant: "secondary",
													type: "button",
													className: "clear-input-btn",
													get ariaLabel() {
														return _(gt);
													},
													onClick: kt,
													get onmousedown() {
														return _e;
													},
													get ontouchstart() {
														return _e;
													},
													get disabled() {
														return tt();
													},
													children: (e, t) => {
														var n = Ge();
														u(e, n);
													},
													$$slots: { default: !0 }
												});
											};
											l(p, (e) => {
												_(B).length > 0 && e(v);
											}), e(o);
											var y = g(o, 2);
											{
												let e = M(() => tt() ? "loading" : "");
												F(y, {
													variant: "primary",
													shape: "square",
													type: "submit",
													get disabled() {
														return tt();
													},
													get className() {
														return `bunker-connect-btn u-control ${_(e) ?? ""}`;
													},
													children: (e, n) => {
														var r = d(), i = S(r), a = (e) => {
															P(e, { showLoader: !0 });
														}, o = (e) => {
															var n = E();
															m((e) => t(n, e), [() => c()("loginDialog.bunker_connect")]), u(e, n);
														};
														l(i, (e) => {
															tt() ? e(a) : e(o, -1);
														}), u(e, r);
													},
													$$slots: { default: !0 }
												});
											}
											e(a);
											var re = g(a, 2), b = (e) => {
												var n = Ue(), r = O(n, !0);
												m(() => t(r, _(K))), u(e, n);
											};
											l(re, (e) => {
												_(K) && e(b);
											}), e(i), m(() => {
												ae(s, _(B)), s.disabled = tt();
											}), f("submit", i, (e) => {
												e.preventDefault(), Rt();
											}), ee("input", s, Ot), u(n, i);
										},
										$$slots: { default: !0 }
									});
								}), u(n, r);
							};
							l(v, (e) => {
								_(V) === "qr" ? e(y) : e(re, -1);
							}), u(n, o);
						},
						$$slots: { default: !0 }
					});
				}), e(se), e(N);
				var de = g(N, 2), fe = (n) => {
					var r = qe(), i = S(r), a = h(i), o = O(a, !0);
					e(i);
					var s = g(i, 2), d = h(s), p = g(h(d), 2), v = O(p, !0);
					e(d);
					var y = g(d, 2), b = h(y), w = h(b), T = h(w);
					te(T), ne(T, (e) => C(z, e), () => _(z));
					var D = g(T, 2), ie = (e) => {
						F(e, {
							variant: "secondary",
							type: "button",
							className: "clear-input-btn",
							get ariaLabel() {
								return _(gt);
							},
							onClick: At,
							get onmousedown() {
								return _e;
							},
							get ontouchstart() {
								return _e;
							},
							children: (e, t) => {
								var n = Ge();
								u(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					l(D, (e) => {
						L().length > 0 && e(ie);
					}), e(w);
					var A = g(w, 2);
					F(A, {
						variant: "primary",
						shape: "square",
						type: "submit",
						className: "save-btn u-control",
						children: (e, n) => {
							x();
							var r = E();
							m((e) => t(r, e), [() => c()("loginDialog.save")]), u(e, r);
						},
						$$slots: { default: !0 }
					}), e(b), e(y), e(s), m((e, n, r) => {
						t(o, e), t(v, n), k(T, "title", r);
					}, [
						() => c()("common.or"),
						() => c()("loginDialog.input_secret"),
						() => c()("loginDialog.hint_input_secret")
					]), f("submit", y, Yt), ee("input", T, () => _(z)?.setCustomValidity("")), re(T, L), u(n, r);
				};
				l(de, (e) => {
					ct() && e(fe);
				}), m((e, n) => {
					t(j, e), t(le, n);
				}, [() => c()("common.or"), () => c()("loginDialog.nostrconnect_input_title")]), u(n, o);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var en = g($t, 2);
	oe(en, {
		get show() {
			return _(bt);
		},
		variant: "top-right",
		children: (e, n) => {
			var r = Ye(), i = O(r, !0);
			m((e) => t(i, e), [() => c()("loginDialog.nostrconnect_direct_open_hint")]), u(e, r);
		},
		$$slots: { default: !0 }
	}), u(i, Xt), n(), Te();
}
o(["input"]);
export { Qe as default };
