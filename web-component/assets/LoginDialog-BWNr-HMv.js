import { At as e, B as t, F as n, G as r, I as i, J as a, M as o, P as s, R as c, Tt as l, U as u, W as d, X as ee, Y as f, Z as te, _ as ne, _t as p, a as m, bt as h, dt as g, f as _, ft as v, h as re, ht as y, jt as b, k as x, lt as S, o as C, ot as w, pt as T, r as E, s as D, st as O, tt as k, ut as A, v as j, w as ie, wt as M, y as ae } from "./index-client-57Odq85c.js";
import { pt as N, t as P } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as F, l as oe } from "./appUtils-CwuZyofa.js";
import { a as se, s as ce } from "./nip46Service-DWYw1Qh-.js";
import { i as le } from "./clipboardUtils-LENkGqCk.js";
import { t as ue } from "./useDialogHistory.svelte-BddVYV4P.js";
import { t as de } from "./DialogWrapper-CvCDxqOJ.js";
import { t as fe } from "./dialog-close-BfZcAfRJ.js";
import { i as pe, n as me, r as he, t as ge } from "./tabs-trigger-DvPMFgBr.js";
import { i as _e } from "./keyboardFocusUtils-Cil9djR5.js";
import { C as ve, D as ye, E as be, O as xe, T as Se, w as Ce } from "./App-BWEIk7fu.js";
import { t as we } from "./InfoPopoverButton-dKimDdMq.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/QrCodeDisplay.svelte
var Te = r("<div class=\"qr-code-svg svelte-1pb586e\" role=\"img\"></div>"), I = r("<div class=\"qr-code-placeholder svelte-1pb586e\" aria-hidden=\"true\"></div>"), L = r("<div class=\"qr-code-frame\"><!></div>"), Ee = {
	hash: "svelte-1pb586e",
	code: ".qr-code-svg.svelte-1pb586e {display:flex;justify-content:center;align-items:center;width:100%;}.qr-code-svg.svelte-1pb586e svg {display:block;width:min(100%, 288px);height:auto;background:#ffffff;}.qr-code-placeholder.svelte-1pb586e {width:min(100%, 288px);aspect-ratio:1;border-radius:12px;background:color-mix(in srgb, var(--text) 6%, #ffffff);}"
};
function De(e, t) {
	l(t, !0), x(e, Ee);
	let n = p(""), r = 0;
	O(() => {
		let e = t.value, i = ++r;
		y(n, ""), e && Se(e).then((a) => {
			i === r && t.value === e && y(n, a, !0);
		}).catch(() => {
			i === r && y(n, "");
		});
	});
	var i = L(), a = S(i), o = (e) => {
		var r = Te();
		s(r, () => k(n), !0), b(r), w(() => j(r, "aria-label", t.label)), u(e, r);
	}, d = (e) => {
		var t = I();
		u(e, t);
	};
	c(a, (e) => {
		k(n) ? e(o) : e(d, -1);
	}), b(i), w(() => j(i, "data-qr-value", t.value)), u(e, i), M();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/LoginDialog.svelte
var Oe = r("<div><span style=\"word-break:break-all\"> </span></div>"), ke = r("<div class=\"toast npub-toast svelte-1vy8d2x\"><!> <!></div>"), Ae = r("<div class=\"xmark-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), je = r("<div class=\"parent-client-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Me = r("<div class=\"parent-client-section svelte-1vy8d2x\"><!> <div aria-live=\"polite\"> </div></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div>", 1), Ne = r("<div class=\"extension-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Pe = r("<div aria-live=\"polite\"> </div>"), Fe = r("<div class=\"vault-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Ie = r("<!> <!>", 1), Le = r("<div class=\"nostrconnect-qr-shell svelte-1vy8d2x\" data-testid=\"nostrconnect-qr-code\"><!></div>"), Re = r("<div class=\"nostrconnect-qr-loading svelte-1vy8d2x\"><!></div>"), ze = r("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div>"), Be = r("<div class=\"nostrconnect-relay-popover svelte-1vy8d2x\"><div> </div> <div> </div> <div> </div></div>"), Ve = r("<div class=\"close-icon svg-icon\" aria-hidden=\"true\"></div>"), He = r("<div class=\"nostrconnect-relay-row svelte-1vy8d2x\"><input type=\"url\" class=\"nostrconnect-relay-field svelte-1vy8d2x\"/> <!></div>"), Ue = r("<div class=\"section-feedback error svelte-1vy8d2x\" aria-live=\"polite\" role=\"alert\"> </div>"), We = r("<!> <div class=\"nostrconnect-uri-card svelte-1vy8d2x\"><div class=\"nostrconnect-uri svelte-1vy8d2x\" data-testid=\"nostrconnect-uri\"><input type=\"text\" readonly=\"\" spellcheck=\"false\" autocomplete=\"off\" class=\"svelte-1vy8d2x\"/> <!></div></div> <div class=\"section-feedback info nostrconnect-status svelte-1vy8d2x\" role=\"status\"><!></div> <div class=\"nostrconnect-relay-settings svelte-1vy8d2x\"><div class=\"nostrconnect-relay-settings-header\"><div class=\"nostrconnect-relay-settings-title-row svelte-1vy8d2x\"><span class=\"nostrconnect-relay-settings-title svelte-1vy8d2x\"> </span> <!></div></div> <div class=\"nostrconnect-relay-editor-list svelte-1vy8d2x\"></div> <div class=\"nostrconnect-relay-editor-actions svelte-1vy8d2x\"><!> <!> <!></div></div> <!>", 1), Ge = r("<div class=\"clear-input-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), Ke = r("<form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"bunker-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"bunker://...\" class=\"bunker-input u-control svelte-1vy8d2x\" required=\"\" autocomplete=\"off\"/> <!></div> <!></div> <!></form>"), qe = r("<div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"secret-key-section svelte-1vy8d2x\"><div class=\"secret-heading-row svelte-1vy8d2x\"><div class=\"secret-icon svg-icon svelte-1vy8d2x\"></div> <h3 class=\"svelte-1vy8d2x\"> </h3></div> <form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"secret-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"nsec1...\" class=\"secret-input u-control svelte-1vy8d2x\" id=\"secretKey\" name=\"secretKey\" autocomplete=\"current-password\" required=\"\" minlength=\"63\" maxlength=\"63\"/> <!></div> <!></div></form></div>", 1), Je = r("<!> <div class=\"nip07-login-section svelte-1vy8d2x\"><!> <!></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"remote-signer-section svelte-1vy8d2x\"><!> <details class=\"remote-signer-details svelte-1vy8d2x\"><summary class=\"svelte-1vy8d2x\"> </summary> <!></details></div> <!>", 1), Ye = r("<div> </div>"), Xe = r("<!> <!> <!>", 1), Ze = {
	hash: "svelte-1vy8d2x",
	code: ".xmark-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}form.svelte-1vy8d2x {width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;}\n\n    /* トースト用スタイル */.toast.svelte-1vy8d2x {position:fixed;top:0px;left:50%;translate:-50% 0;display:flex;width:100%;max-width:500px;background:var(--dialog-bg);color:var(--text);border-radius:0 0 10px 10px;z-index:101;font-family:monospace;font-size:1rem;line-height:1.2;word-break:break-all;flex-direction:column;align-items:flex-start;gap:6px;padding:8px 14px 14px;margin-bottom:8px;}\n    @keyframes svelte-1vy8d2x-toast-fadein {\n        from {\n            opacity: 0;\n            translate: -50% -10px;\n        }\n        to {\n            opacity: 0.98;\n            translate: -50% 0;\n        }\n    }.parent-client-section.svelte-1vy8d2x,\n    .nip07-login-section.svelte-1vy8d2x {display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;gap:6px;}.parent-client-feedback.svelte-1vy8d2x,\n    .section-feedback.svelte-1vy8d2x {font-size:0.95rem;text-align:center;}.parent-client-feedback.info.svelte-1vy8d2x,\n    .section-feedback.info.svelte-1vy8d2x {color:var(--text-light);}.parent-client-feedback.error.svelte-1vy8d2x,\n    .section-feedback.error.svelte-1vy8d2x {background:var(--balloon-error-bg, hsl(351, 99%, 96%));border:1px solid var(--balloon-error-border, hsl(351, 99%, 70%));color:var(--balloon-error-color, hsl(351, 99%, 32%));}.parent-client-login-button.primary,\n    .nip07-login-button.primary,\n    .nostrconnect-open-btn.primary {flex-shrink:0;position:relative;overflow:hidden;.btn-text.svelte-1vy8d2x {font-size:1.125rem;}}.parent-client-login-button.loading,\n    .nip07-login-button.loading,\n    .nostrconnect-open-btn.loading {cursor:not-allowed;}.svg-icon.parent-client-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.svg-icon.extension-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-657874656e73696f6e5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.remote-signer-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:6px;}.secret-key-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:10px;}.remote-signer-panel {display:flex;flex-direction:column;gap:8px;}.remote-signer-details.svelte-1vy8d2x {width:100%;background:var(--dialog-bg2);border-radius:8px;}.remote-signer-details.svelte-1vy8d2x summary:where(.svelte-1vy8d2x) {padding:12px;cursor:pointer;font-weight:600;}.secret-heading-row.svelte-1vy8d2x {display:flex;gap:6px;justify-content:center;align-items:center;width:100%;}.secret-input-row.svelte-1vy8d2x,\n    .bunker-input-row.svelte-1vy8d2x {display:flex;gap:6px;width:100%;flex:none;}.input-shell.svelte-1vy8d2x {position:relative;display:flex;align-items:center;flex:1;min-width:0;}.secret-input.svelte-1vy8d2x,\n    .bunker-input.svelte-1vy8d2x {font-family:monospace;font-size:1rem;padding:0.6rem 3.25rem 0.6rem 0.6rem;background-color:var(--btn-bg);border:none;flex:1;min-width:0;}.ehagaki-app-root button.clear-input-btn {position:absolute;inset:50% auto 50% auto;right:2px;transform:translateY(-50%);width:46px;min-width:46px;height:46px;min-height:46px;padding:0;display:inline-flex;align-items:center;justify-content:center;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);flex:0 0 auto;z-index:1;}.ehagaki-app-root button.clear-input-btn:hover:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:active:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:focus-visible,\n    .ehagaki-app-root button.clear-input-btn:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.clear-input-btn:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.clear-input-icon.svelte-1vy8d2x {width:24px;height:24px;mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.secret-heading-row.svelte-1vy8d2x h3:where(.svelte-1vy8d2x) {margin:0;}.remote-signer-tabs {display:flex;flex-direction:column;padding:8px;gap:8px;}.remote-signer-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}.remote-signer-tab {background:var(--btn-bg);--btn-bg: var(--btn-bg2);color:var(--text);padding:12px 16px;font-size:0.95rem;font-weight:600;cursor:pointer;&[data-value=\"qr\"] {border-start-start-radius:10px;border-end-start-radius:10px;}&[data-value=\"bunker\"] {border-start-end-radius:10px;border-end-end-radius:10px;}}.nostrconnect-qr-shell.svelte-1vy8d2x,\n    .nostrconnect-qr-loading.svelte-1vy8d2x {width:100%;}.nostrconnect-qr-loading.svelte-1vy8d2x {min-height:320px;display:flex;align-items:center;justify-content:center;padding:16px;border-radius:16px;background:var(--btn-bg);border:1px solid var(--border-hr);}.nostrconnect-uri-card.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-uri.svelte-1vy8d2x {display:flex;align-items:center;position:relative;height:40px;padding:0 40px 0 12px;background:var(--btn-bg2);border-radius:12px;font-family:monospace;font-size:0.9rem;}.nostrconnect-uri.svelte-1vy8d2x input:where(.svelte-1vy8d2x) {width:100%;border:none;background:transparent;font-family:inherit;font-size:inherit;outline:none;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}button.nostrconnect-copy-btn.circle.copy {position:absolute;inset:auto 2px 2px auto;width:34px;min-width:34px;height:34px;flex:0 0 34px;z-index:1;}button.nostrconnect-copy-btn .copy-icon {width:18px;height:18px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.nostrconnect-relay-editor-actions.svelte-1vy8d2x {display:flex;flex-wrap:wrap;gap:6px;}.nostrconnect-relay-settings.svelte-1vy8d2x {display:flex;flex-direction:column;gap:6px;padding:2px 12px 12px;background:var(--dialog-bg3);border-radius:16px;}.nostrconnect-relay-settings-title-row.svelte-1vy8d2x {display:flex;align-items:center;}.nostrconnect-relay-settings-title.svelte-1vy8d2x {font-weight:600;}.nostrconnect-relay-popover.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-relay-editor-list.svelte-1vy8d2x {display:flex;flex-direction:column;gap:4px;}.nostrconnect-relay-row.svelte-1vy8d2x {display:flex;align-items:stretch;height:40px;.nostrconnect-remove-relay-btn {width:auto;height:auto;border-radius:0 12px 12px 0;--btn-bg: var(--btn-bg3);opacity:1;aspect-ratio:1;.close-icon {--svg: currentColor;width:24px;height:24px;}}}.nostrconnect-relay-field.svelte-1vy8d2x {flex:1;width:auto;height:auto;padding:0 0.75rem;background:var(--btn-bg3);border:none;border-radius:12px 0 0 12px;font-family:monospace;font-size:0.95rem;}.secret-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6b65795f766572746963616c5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;flex:0 0 28px;display:inline-block;vertical-align:middle;}.vault-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-736869656c645f6c6f636b65645f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;display:inline-block;vertical-align:middle;}\n\n    @media (max-width: 600px) {.bunker-input-row.svelte-1vy8d2x,\n        .secret-input-row.svelte-1vy8d2x {flex-direction:column;}\n    }.divider.svelte-1vy8d2x {display:flex;align-items:center;text-align:center;margin:16px 0;width:100%;}.divider.svelte-1vy8d2x::before,\n    .divider.svelte-1vy8d2x::after {content:\"\";flex:1;height:1px;background:var(--border-hr);}.divider.svelte-1vy8d2x span:where(.svelte-1vy8d2x) {color:var(--text-light);padding:0 16px;font-size:1rem;}input.u-control, button.u-control {min-height:50px;min-width:60px;width:100%;display:inline-flex;align-items:center;}\n\n    @media (min-width: 601px) {.save-btn.u-control, .bunker-connect-btn.u-control {width:120px;}\n    }"
};
function Qe(r, s) {
	l(s, !0), x(r, Ze);
	let f = () => D(N, "$_", Se), [Se, Te] = C(), I = E(s, "show", 15, !1), L = E(s, "secretKey", 15), Ee = E(s, "isParentClientAvailable", 3, !1), Qe = E(s, "isLoadingParentClient", 3, !1), $e = E(s, "isNip07ExtensionAvailable", 3, !1), et = E(s, "isLoadingNip07", 3, !1), tt = E(s, "isLoadingNip46", 3, !1), nt = E(s, "isPreparingNip46NostrConnect", 3, !1), rt = E(s, "isWaitingNip46NostrConnect", 3, !1), it = E(s, "isHandshakeStartedNip46NostrConnect", 3, !1), R = E(s, "nip46NostrConnectUri", 3, null), at = E(s, "nip46NostrConnectErrorMessage", 3, ""), ot = E(s, "initialNostrConnectRelayCandidates", 19, () => []), st = E(s, "isAddAccountMode", 3, !1), ct = E(s, "localNsecAuthEnabled", 3, !0);
	function lt() {
		I(!1), s.onClose?.();
	}
	ue(() => I(), lt, !0);
	let ut = h($e), dt = h(Ee), ft = new ce(), pt = h(() => ft.isValid), mt = h(() => ft.npub), ht = h(() => ft.nprofile), gt = h(() => f()("clearInput") === "clearInput" ? "入力内容を消去" : f()("clearInput")), z = p(null), B = p(""), V = p("qr"), _t = p(!1), vt = p(null), H = p(T([""])), U = p(null), W = p(""), G = p(""), K = p(""), yt = p(!1), bt = p(!1), q = p(!1), J, xt = p(null);
	function Y() {
		J &&= (clearTimeout(J), void 0), y(xt, null), y(bt, !1);
	}
	function X() {
		Y(), y(q, !1);
	}
	function St() {
		return ot().length > 0 ? [...ot()] : be();
	}
	function Ct() {
		X(), y(H, ve(St()), !0), y(V, "qr"), y(vt, null);
	}
	O(() => {
		I() && !k(_t) ? (y(_t, !0), L(""), y(B, ""), y(W, ""), y(G, ""), y(K, ""), y(yt, !1), Ct(), queueMicrotask(() => {
			I() && k(V) === "qr" && Wt();
		})) : I() || (y(_t, !1), X());
	}), O(() => {
		R(), y(yt, !1), X();
	}), O(() => {
		if (typeof document > "u") return;
		function e() {
			document.visibilityState !== "visible" && Y();
		}
		return document.addEventListener("visibilitychange", e), () => {
			document.removeEventListener("visibilitychange", e), X();
		};
	});
	let Z = h(() => xe(k(H))), wt = h(() => k(Z).errorKey === null ? k(Z).relays.join("\n") : null), Tt = h(() => k(V) === "qr" && k(Z).errorKey ? f()(k(Z).errorKey) : ""), Q = h(nt), $ = h(it), Et = h(() => k(Q) || rt()), Dt = h(() => k(Q) || k(Z).errorKey !== null || !k(wt) || !!R() && k(wt) === k(vt));
	O(() => {
		k($) && (y(q, !1), Y());
	}), O(() => {
		I(), k(V), R(), k(Et), I() && k(V) === "qr" && R() && k(Et) || X();
	}), O(() => {
		L() !== void 0 && ft.setNsec(L());
	}), O(() => {
		L() !== void 0 && k(z) && !L() && k(z).setCustomValidity("");
	});
	function Ot(e) {
		y(B, e.currentTarget.value, !0), y(K, ""), k(U) && k(U).setCustomValidity("");
	}
	function kt() {
		k(B) && (y(B, ""), y(K, ""), k(U)?.setCustomValidity(""), k(U)?.focus({ preventScroll: !0 }));
	}
	function At() {
		L() && (L(""), k(z)?.setCustomValidity(""), k(z)?.focus({ preventScroll: !0 }));
	}
	function jt() {
		if (X(), k(z)) {
			let e = k(z).validity, t = k(z).value ?? "";
			if (e.valueMissing) {
				k(z).setCustomValidity(f()("loginDialog.secret_key_required")), k(z).reportValidity();
				return;
			}
			if (!t.startsWith("nsec1")) {
				k(z).setCustomValidity(f()("loginDialog.secret_must_start_nsec1")), k(z).reportValidity();
				return;
			}
			if (t.length !== 63) {
				t.length < 63 ? k(z).setCustomValidity(f()("loginDialog.secret_too_short")) : k(z).setCustomValidity(f()("loginDialog.secret_too_long")), k(z).reportValidity();
				return;
			}
			if (!k(pt)) {
				k(z).setCustomValidity(f()("loginDialog.invalid_secret")), k(z).reportValidity();
				return;
			}
			k(z).setCustomValidity("");
		}
		s.onSave?.();
	}
	function Mt(e) {
		switch (e) {
			case "nip07_not_available": return f()("loginDialog.extension_not_found");
			case "nip07_auth_error": return f()("loginDialog.extension_login_failed");
			default: return e.startsWith("nip07_") ? f()("loginDialog.extension_login_failed") : e;
		}
	}
	function Nt(e) {
		switch (e) {
			case "Invalid bunker URL": return f()("loginDialog.bunker_invalid");
			case "nip46_connection_failed": return f()("loginDialog.bunker_connection_failed");
			default: return e;
		}
	}
	function Pt(e) {
		switch (e) {
			case "At least one public wss relay is required for nostrconnect": return f()("loginDialog.nostrconnect_relay_required");
			case "Nostr Connect timed out before the remote signer connected": return f()("loginDialog.nostrconnect_timeout");
			case "Timed out waiting for switch_relays response":
			case "Relay connection failed":
			case "Nostr Connect handshake pool is unavailable": return f()("loginDialog.nostrconnect_connection_failed");
			case "Timed out waiting for final relay list":
			case "Remote signer did not return final relay list":
			case "Remote signer returned an invalid final relay list":
			case "Remote signer returned an unsupported final relay": return f()("loginDialog.nostrconnect_relay_reconciliation_failed");
			case "Remote signer did not return any usable connection relay": return f()("loginDialog.nostrconnect_no_usable_final_relay");
			case "Could not connect to the local relay specified by the remote signer": return f()("loginDialog.nostrconnect_local_final_relay_unreachable");
			case "Communication could not be verified on the relay selected by the remote signer": return f()("loginDialog.nostrconnect_final_relay_verification_failed");
			case "Nostr Connect connection was cancelled": return "";
			default: return e.startsWith("Relay connection failed:") ? f()("loginDialog.nostrconnect_connection_failed") : e;
		}
	}
	async function Ft() {
		X(), y(G, "");
		let e = await s.onNip07Login?.();
		e && y(G, Mt(e), !0);
	}
	function It(e) {
		switch (e) {
			case "parent_client_not_available": return f()("loginDialog.parent_client_not_available");
			case "parent_client_timeout": return f()("loginDialog.parent_client_timeout");
			case "parent_client_auth_rejected": return f()("loginDialog.parent_client_auth_rejected");
			case "parent_client_not_logged_in": return f()("loginDialog.parent_client_not_logged_in");
			case "parent_client_disconnected": return f()("loginDialog.parent_client_disconnected");
			case "parent_client_invalid_response": return f()("loginDialog.parent_client_invalid_response");
			case "parent_client_auth_error": return f()("loginDialog.parent_client_auth_error");
			default: return e.startsWith("parent_client_") ? f()("loginDialog.parent_client_auth_error") : e;
		}
	}
	async function Lt() {
		X(), y(W, "");
		let e = await s.onParentClientLogin?.();
		e && y(W, It(e), !0);
	}
	async function Rt() {
		if (X(), y(K, ""), k(U)) {
			let e = k(U).value.trim();
			if (y(B, e, !0), k(U).validity.valueMissing) {
				y(K, f()("loginDialog.bunker_url_required"), !0), k(U).setCustomValidity(k(K)), k(U).reportValidity();
				return;
			}
			if (!se.test(e)) {
				y(K, f()("loginDialog.bunker_invalid"), !0), k(U).setCustomValidity(k(K)), k(U).reportValidity();
				return;
			}
			k(U).setCustomValidity("");
		}
		let e = k(B).trim(), t = await s.onNip46Login?.(e);
		if (t && k(U)) {
			let e = Nt(t);
			y(K, e, !0), k(U).setCustomValidity(e), k(U).reportValidity();
		} else y(K, "");
	}
	function zt(e) {
		k(V) !== e && (y(V, e, !0), X(), y(vt, null));
	}
	function Bt(e, t) {
		let n = [...k(H)];
		n[e] = t, y(H, Ce(n), !0);
	}
	function Vt() {
		y(H, [...k(H), ""], !0);
	}
	function Ht(e) {
		y(H, Ce(k(H).filter((t, n) => n !== e)), !0);
	}
	function Ut() {
		y(H, ve(be()), !0);
	}
	async function Wt() {
		k(V) === "qr" && k(Z).errorKey === null && k(wt) && (k(Et) && s.onNostrConnectCancel?.(), y(vt, k(wt), !0), await s.onNostrConnectStart?.(k(Z).relays));
	}
	function Gt() {
		if (!R()) return;
		let e = R();
		Y(), y(xt, e, !0), y(q, !0), ye(e), J = setTimeout(() => {
			J = void 0, typeof document < "u" && document.visibilityState !== "visible" ? Y() : I() && k(V) === "qr" && (nt() || rt()) && !k($) && R() === e && k(xt) === e ? (y(bt, !0), J = setTimeout(() => {
				y(bt, !1), J = void 0;
			}, 6e3)) : Y();
		}, 1200);
	}
	async function Kt() {
		if (!R()) return !1;
		let e = await le(R(), "nostrconnect");
		return y(yt, e, !0), e;
	}
	let qt = h(() => at() ? Pt(at()) : ""), Jt = h(() => k(V) === "qr" ? k(qt) || k(Tt) : "");
	function Yt(e) {
		X(), e.preventDefault(), jt();
	}
	var Xt = Xe(), Zt = A(Xt), Qt = (e) => {
		var n = ke(), r = S(n), i = (e) => {
			var n = Oe(), r = S(n), i = g(r, !0);
			b(n), w(() => t(i, k(mt))), u(e, n);
		};
		c(r, (e) => {
			k(mt) && e(i);
		});
		var a = v(r, 2), o = (e) => {
			var n = Oe(), r = S(n), i = g(r, !0);
			b(n), w(() => t(i, k(ht))), u(e, n);
		};
		c(a, (e) => {
			k(ht) && e(o);
		}), b(n), u(e, n);
	};
	c(Zt, (e) => {
		(k(mt) || k(ht)) && e(Qt);
	});
	var $t = v(Zt, 2);
	{
		let r = (e) => {
			var t = d(), n = A(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = h(() => f()("global.close"));
						F(e, m(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return k(t);
							},
							children: (e, t) => {
								var n = Ae();
								u(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				o(n, () => fe, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			u(e, t);
		}, s = h(() => st() ? f()("loginDialog.add_account_title") : ct() ? f()("loginDialog.input_secret") : f()("common.login")), l = h(() => st() ? f()("loginDialog.add_account_hint") : ct() ? f()("loginDialog.hint_input_secret") : f()("loginDialog.login_methods_hint"));
		de($t, {
			onOpenChange: (e) => !e && lt(),
			get title() {
				return k(s);
			},
			get description() {
				return k(l);
			},
			contentClass: "login-dialog",
			footerVariant: "close-button",
			get open() {
				return I();
			},
			set open(e) {
				I(e);
			},
			footer: r,
			children: (r, s) => {
				var l = Je(), p = A(l), m = (e) => {
					var n = Me(), r = A(n), i = S(r);
					{
						let e = h(() => Qe() ? "loading" : "");
						F(i, {
							variant: "primary",
							shape: "square",
							get className() {
								return `parent-client-login-button u-control ${k(e) ?? ""}`;
							},
							onClick: Lt,
							get disabled() {
								return Qe();
							},
							children: (e, n) => {
								var r = d(), i = A(r), a = (e) => {
									P(e, {
										text: !0,
										showLoader: !0
									});
								}, o = (e) => {
									var n = je(), r = v(A(n), 2), i = g(r, !0);
									w((e) => t(i, e), [() => f()("loginDialog.login_with_parent_client")]), u(e, n);
								};
								c(i, (e) => {
									Qe() ? e(a) : e(o, -1);
								}), u(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					var a = v(i, 2), o = g(a, !0);
					b(r);
					var s = v(r, 2), l = S(s), ee = g(l, !0);
					b(s), w((e, n) => {
						ie(a, 1, `parent-client-feedback ${k(W) ? "error" : "info"}`, "svelte-1vy8d2x"), j(a, "role", k(W) ? "alert" : "status"), t(o, e), t(ee, n);
					}, [() => k(W) || f()("loginDialog.parent_client_hint"), () => f()("common.or")]), u(e, n);
				};
				c(p, (e) => {
					k(dt) && e(m);
				});
				var x = v(p, 2), C = S(x);
				{
					let e = h(() => et() ? "loading" : ""), n = h(() => et() || !k(ut));
					F(C, {
						variant: "primary",
						shape: "square",
						get className() {
							return `nip07-login-button u-control ${k(e) ?? ""}`;
						},
						onClick: Ft,
						get disabled() {
							return k(n);
						},
						children: (e, n) => {
							var r = d(), i = A(r), a = (e) => {
								P(e, {
									text: !0,
									showLoader: !0
								});
							}, o = (e) => {
								var n = Ne(), r = v(A(n), 2), i = g(r, !0);
								w((e) => t(i, e), [() => f()("loginDialog.login_with_extension")]), u(e, n);
							};
							c(i, (e) => {
								et() ? e(a) : e(o, -1);
							}), u(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var T = v(C, 2), E = (e) => {
					var n = Pe(), r = g(n, !0);
					w((e) => {
						ie(n, 1, `section-feedback ${k(G) ? "error" : "info"}`, "svelte-1vy8d2x"), j(n, "role", k(G) ? "alert" : "status"), t(r, e);
					}, [() => k(G) || f()("loginDialog.extension_not_found")]), u(e, n);
				};
				c(T, (e) => {
					(k(G) || !k(ut)) && e(E);
				}), b(x);
				var D = v(x, 2), O = S(D), M = g(O, !0);
				b(D);
				var N = v(D, 2), oe = S(N);
				{
					let e = h(() => k($) ? f()("loginDialog.nostrconnect_handshake_started") : k(q) ? f()("loginDialog.nostrconnect_opening_signer") : f()("loginDialog.nostrconnect_open")), n = h(() => k(Q) || !R() || k(q) || k($)), r = h(() => k(Q) && !R() || k(q) || k($) ? "loading" : "");
					F(oe, {
						type: "button",
						variant: "primary",
						shape: "square",
						get ariaLabel() {
							return k(e);
						},
						onClick: Gt,
						get disabled() {
							return k(n);
						},
						get className() {
							return `nostrconnect-open-btn u-control ${k(r) ?? ""}`;
						},
						"data-testid": "nostrconnect-open-button",
						children: (e, n) => {
							var r = d(), i = A(r), a = (e) => {
								{
									let t = h(() => f()("loginDialog.nostrconnect_preparing"));
									P(e, {
										get text() {
											return k(t);
										},
										showLoader: !0
									});
								}
							}, o = (e) => {
								{
									let t = h(() => f()("loginDialog.nostrconnect_handshake_started"));
									P(e, {
										get text() {
											return k(t);
										},
										showLoader: !0
									});
								}
							}, s = (e) => {
								{
									let t = h(() => f()("loginDialog.nostrconnect_opening_signer"));
									P(e, {
										get text() {
											return k(t);
										},
										showLoader: !0
									});
								}
							}, l = (e) => {
								var n = Fe(), r = v(A(n), 2), i = g(r, !0);
								w((e) => t(i, e), [() => f()("loginDialog.remote_signer_title")]), u(e, n);
							};
							c(i, (e) => {
								k(Q) && !R() ? e(a) : k($) ? e(o, 1) : k(q) ? e(s, 2) : e(l, -1);
							}), u(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var se = v(oe, 2), ce = S(se), le = g(ce, !0), ue = v(ce, 2);
				o(ue, () => pe, (r, s) => {
					s(r, {
						get value() {
							return k(V);
						},
						onValueChange: (e) => zt(e),
						class: "remote-signer-tabs",
						children: (r, s) => {
							var l = Ie(), p = A(l);
							o(p, () => me, (n, r) => {
								r(n, {
									class: "remote-signer-tab-list",
									children: (n, r) => {
										var i = Ie(), s = A(i);
										o(s, () => ge, (n, r) => {
											r(n, {
												value: "qr",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-qr-tab",
												children: (n, r) => {
													e();
													var i = a();
													w((e) => t(i, e), [() => f()("loginDialog.nostrconnect_qr_tab")]), u(n, i);
												},
												$$slots: { default: !0 }
											});
										});
										var c = v(s, 2);
										o(c, () => ge, (n, r) => {
											r(n, {
												value: "bunker",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-bunker-tab",
												children: (n, r) => {
													e();
													var i = a();
													w((e) => t(i, e), [() => f()("loginDialog.nostrconnect_bunker_tab")]), u(n, i);
												},
												$$slots: { default: !0 }
											});
										}), u(n, i);
									},
									$$slots: { default: !0 }
								});
							});
							var m = v(p, 2), re = (r) => {
								var s = d(), l = A(s);
								o(l, () => he, (r, o) => {
									o(r, {
										value: "qr",
										class: "remote-signer-panel nostrconnect-panel",
										children: (r, o) => {
											var s = We(), l = A(s), d = (e) => {
												var t = Le(), n = S(t);
												{
													let e = h(() => f()("loginDialog.nostrconnect_qr_alt"));
													De(n, {
														get value() {
															return R();
														},
														get label() {
															return k(e);
														}
													});
												}
												b(t), u(e, t);
											}, te = (e) => {
												var t = Re(), n = S(t);
												P(n, {
													text: !0,
													showLoader: !0
												}), b(t), u(e, t);
											};
											c(l, (e) => {
												R() ? e(d) : k(Q) && e(te, 1);
											});
											var p = v(l, 2), m = S(p), _ = S(m);
											ne(_);
											var re = v(_, 2);
											{
												let e = h(() => f()("common.copySuccess")), t = h(() => k(Q) || !R()), n = h(() => k(yt) ? f()("loginDialog.nostrconnect_copied") : f()("loginDialog.nostrconnect_copy"));
												F(re, {
													type: "button",
													variant: "copy",
													shape: "circle",
													contentLayout: "icon",
													onClick: Kt,
													get floatingMessage() {
														return k(e);
													},
													get disabled() {
														return k(t);
													},
													className: "nostrconnect-copy-btn",
													get ariaLabel() {
														return k(n);
													},
													"data-testid": "nostrconnect-copy-button",
													children: (e, t) => {
														var n = ze();
														u(e, n);
													},
													$$slots: { default: !0 }
												});
											}
											b(m), b(p);
											var y = v(p, 2), x = S(y), C = (e) => {
												var n = a();
												w((e) => t(n, e), [() => f()("loginDialog.nostrconnect_preparing")]), u(e, n);
											}, T = (e) => {
												{
													let t = h(() => f()("loginDialog.nostrconnect_opening_signer"));
													P(e, {
														get text() {
															return k(t);
														},
														showLoader: !0
													});
												}
											}, E = (e) => {
												{
													let t = h(() => f()("loginDialog.nostrconnect_handshake_started"));
													P(e, {
														get text() {
															return k(t);
														},
														showLoader: !0
													});
												}
											}, D = (e) => {
												var n = a();
												w((e) => t(n, e), [() => f()("loginDialog.nostrconnect_waiting")]), u(e, n);
											}, O = (e) => {
												var n = a();
												w((e) => t(n, e), [() => f()("loginDialog.nostrconnect_idle")]), u(e, n);
											};
											c(x, (e) => {
												k(Q) ? e(C) : k(q) ? e(T, 1) : k($) ? e(E, 2) : rt() ? e(D, 3) : e(O, -1);
											}), b(y);
											var ie = v(y, 2), M = S(ie), N = S(M), oe = S(N), se = g(oe, !0), ce = v(oe, 2);
											{
												let e = h(() => f()("loginDialog.nostrconnect_relay_settings_description"));
												we(ce, {
													side: "top",
													sideOffset: 8,
													get ariaLabel() {
														return k(e);
													},
													children: (e, n) => {
														var r = Be(), i = S(r), a = g(i, !0), o = v(i, 2), s = g(o, !0), c = v(o, 2), l = g(c, !0);
														b(r), w((e, n, r) => {
															t(a, e), t(s, n), t(l, r);
														}, [
															() => f()("loginDialog.nostrconnect_relay_hint"),
															() => f()("loginDialog.nostrconnect_relay_update_hint"),
															() => f()("loginDialog.nostrconnect_relay_switch_hint")
														]), u(e, r);
													},
													$$slots: { default: !0 }
												});
											}
											b(N), b(M);
											var le = v(M, 2);
											n(le, 21, () => k(H), i, (e, t, n) => {
												var r = He(), i = S(r);
												ne(i);
												var a = v(i, 2);
												{
													let e = h(() => f()("loginDialog.nostrconnect_remove_relay")), r = h(() => k(H).length === 1 && !k(t).trim());
													F(a, {
														type: "button",
														variant: "close",
														shape: "rounded",
														className: "nostrconnect-remove-relay-btn",
														get ariaLabel() {
															return k(e);
														},
														onClick: () => Ht(n),
														get disabled() {
															return k(r);
														},
														children: (e, t) => {
															var n = Ve();
															u(e, n);
														},
														$$slots: { default: !0 }
													});
												}
												b(r), w((e) => {
													ae(i, k(t)), j(i, "placeholder", e);
												}, [() => f()("loginDialog.nostrconnect_relay_placeholder")]), ee("input", i, (e) => Bt(n, e.currentTarget.value)), u(e, r);
											}), b(le);
											var ue = v(le, 2), de = S(ue);
											F(de, {
												type: "button",
												variant: "primary",
												onClick: Wt,
												get disabled() {
													return k(Dt);
												},
												"data-testid": "nostrconnect-regenerate",
												children: (n, r) => {
													e();
													var i = a();
													w((e) => t(i, e), [() => f()("loginDialog.nostrconnect_generate")]), u(n, i);
												},
												$$slots: { default: !0 }
											});
											var fe = v(de, 2);
											F(fe, {
												type: "button",
												variant: "secondary",
												onClick: Vt,
												children: (n, r) => {
													e();
													var i = a();
													w((e) => t(i, e), [() => f()("loginDialog.nostrconnect_add_relay")]), u(n, i);
												},
												$$slots: { default: !0 }
											});
											var pe = v(fe, 2);
											F(pe, {
												type: "button",
												variant: "secondary",
												onClick: Ut,
												"data-testid": "nostrconnect-reset-relays",
												children: (n, r) => {
													e();
													var i = a();
													w((e) => t(i, e), [() => f()("loginDialog.nostrconnect_reset_relays")]), u(n, i);
												},
												$$slots: { default: !0 }
											}), b(ue), b(ie);
											var me = v(ie, 2), he = (e) => {
												var n = Ue(), r = g(n, !0);
												w(() => t(r, k(Jt))), u(e, n);
											};
											c(me, (e) => {
												k(Jt) && e(he);
											}), w((e) => {
												ae(_, R() || ""), j(_, "title", R() || ""), t(se, e);
											}, [() => f()("loginDialog.nostrconnect_edit_relays")]), u(r, s);
										},
										$$slots: { default: !0 }
									});
								}), u(r, s);
							}, x = (e) => {
								var n = d(), r = A(n);
								o(r, () => he, (e, n) => {
									n(e, {
										value: "bunker",
										class: "remote-signer-panel bunker-panel",
										children: (e, n) => {
											var r = Ke(), i = S(r), o = S(i), s = S(o);
											ne(s), _(s, (e) => y(U, e), () => k(U));
											var l = v(s, 2), p = (e) => {
												F(e, {
													variant: "secondary",
													type: "button",
													className: "clear-input-btn",
													get ariaLabel() {
														return k(gt);
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
											c(l, (e) => {
												k(B).length > 0 && e(p);
											}), b(o);
											var m = v(o, 2);
											{
												let e = h(() => tt() ? "loading" : "");
												F(m, {
													variant: "primary",
													shape: "square",
													type: "submit",
													get disabled() {
														return tt();
													},
													get className() {
														return `bunker-connect-btn u-control ${k(e) ?? ""}`;
													},
													children: (e, n) => {
														var r = d(), i = A(r), o = (e) => {
															P(e, { showLoader: !0 });
														}, s = (e) => {
															var n = a();
															w((e) => t(n, e), [() => f()("loginDialog.bunker_connect")]), u(e, n);
														};
														c(i, (e) => {
															tt() ? e(o) : e(s, -1);
														}), u(e, r);
													},
													$$slots: { default: !0 }
												});
											}
											b(i);
											var re = v(i, 2), x = (e) => {
												var n = Ue(), r = g(n, !0);
												w(() => t(r, k(K))), u(e, n);
											};
											c(re, (e) => {
												k(K) && e(x);
											}), b(r), w(() => {
												ae(s, k(B)), s.disabled = tt();
											}), te("submit", r, (e) => {
												e.preventDefault(), Rt();
											}), ee("input", s, Ot), u(e, r);
										},
										$$slots: { default: !0 }
									});
								}), u(e, n);
							};
							c(m, (e) => {
								k(V) === "qr" ? e(re) : e(x, -1);
							}), u(r, l);
						},
						$$slots: { default: !0 }
					});
				}), b(se), b(N);
				var de = v(N, 2), fe = (n) => {
					var r = qe(), i = A(r), o = S(i), s = g(o, !0);
					b(i);
					var l = v(i, 2), d = S(l), p = v(S(d), 2), m = g(p, !0);
					b(d);
					var h = v(d, 2), x = S(h), C = S(x), T = S(C);
					ne(T), _(T, (e) => y(z, e), () => k(z));
					var E = v(T, 2), D = (e) => {
						F(e, {
							variant: "secondary",
							type: "button",
							className: "clear-input-btn",
							get ariaLabel() {
								return k(gt);
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
					c(E, (e) => {
						L().length > 0 && e(D);
					}), b(C);
					var O = v(C, 2);
					F(O, {
						variant: "primary",
						shape: "square",
						type: "submit",
						className: "save-btn u-control",
						children: (n, r) => {
							e();
							var i = a();
							w((e) => t(i, e), [() => f()("loginDialog.save")]), u(n, i);
						},
						$$slots: { default: !0 }
					}), b(x), b(h), b(l), w((e, n, r) => {
						t(s, e), t(m, n), j(T, "title", r);
					}, [
						() => f()("common.or"),
						() => f()("loginDialog.input_secret"),
						() => f()("loginDialog.hint_input_secret")
					]), te("submit", h, Yt), ee("input", T, () => k(z)?.setCustomValidity("")), re(T, L), u(n, r);
				};
				c(de, (e) => {
					ct() && e(fe);
				}), w((e, n) => {
					t(M, e), t(le, n);
				}, [() => f()("common.or"), () => f()("loginDialog.nostrconnect_input_title")]), u(r, l);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var en = v($t, 2);
	oe(en, {
		get show() {
			return k(bt);
		},
		variant: "top-right",
		children: (e, n) => {
			var r = Ye(), i = g(r, !0);
			w((e) => t(i, e), [() => f()("loginDialog.nostrconnect_direct_open_hint")]), u(e, r);
		},
		$$slots: { default: !0 }
	}), u(r, Xt), M(), Te();
}
f(["input"]);
export { Qe as default };
