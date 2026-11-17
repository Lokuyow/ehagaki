import { A as e, Et as t, F as n, G as r, I as i, K as a, L as o, Mt as s, N as c, Q as l, T as u, Tt as d, V as f, W as p, X as m, Y as h, Z as ee, a as g, b as _, ct as v, dt as y, f as te, ft as b, gt as x, h as ne, jt as S, mt as re, nt as C, o as ie, pt as w, r as T, s as E, st as D, ut as O, v as ae, vt as k, xt as A, y as j, z as M } from "./index-client-XkLzkVYC.js";
import { pt as oe, t as N } from "./LoadingPlaceholder-lit91akO.js";
import { c as se, s as P } from "./appUtils-BRia-Jm6.js";
import { a as ce, l as le } from "./nip46Service-CClbdsGu.js";
import { a as ue } from "./clipboardUtils-DL4u_EPs.js";
import { t as de } from "./useDialogHistory.svelte-BgJftJRE.js";
import { t as fe } from "./DialogWrapper-DOH4rn3S.js";
import { t as pe } from "./dialog-close-erjPpz45.js";
import { i as me, n as he, r as ge, t as _e } from "./tabs-trigger-E7T0aLuc.js";
import { i as ve } from "./keyboardFocusUtils-EFYjXEKy.js";
import { C as ye, D as be, E as xe, O as Se, S as Ce, T as we, w as Te } from "./App-B2GhfviI.js";
import { t as Ee } from "./InfoPopoverButton-6JVVo3_8.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/QrCodeDisplay.svelte
var De = a("<div class=\"qr-code-svg svelte-1pb586e\" role=\"img\"></div>"), F = a("<div class=\"qr-code-placeholder svelte-1pb586e\" aria-hidden=\"true\"></div>"), I = a("<div class=\"qr-code-frame\"><!></div>"), Oe = {
	hash: "svelte-1pb586e",
	code: ".qr-code-svg.svelte-1pb586e {display:flex;justify-content:center;align-items:center;width:100%;}.qr-code-svg.svelte-1pb586e svg {display:block;width:min(100%, 288px);height:auto;background:#ffffff;}.qr-code-placeholder.svelte-1pb586e {width:min(100%, 288px);aspect-ratio:1;border-radius:12px;background:color-mix(in srgb, var(--text) 6%, #ffffff);}"
};
function ke(r, i) {
	t(i, !0), e(r, Oe);
	let a = k(""), o = 0;
	v(() => {
		let e = i.value, t = ++o;
		x(a, ""), e && Te(e).then((n) => {
			t === o && i.value === e && x(a, n, !0);
		}).catch(() => {
			t === o && x(a, "");
		});
	});
	var c = I(), l = O(c), u = (e) => {
		var t = De();
		n(t, () => C(a), !0), s(t), D(() => j(t, "aria-label", i.label)), p(e, t);
	}, f = (e) => {
		var t = F();
		p(e, t);
	};
	M(l, (e) => {
		C(a) ? e(u) : e(f, -1);
	}), s(c), D(() => j(c, "data-qr-value", i.value)), p(r, c), d();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/LoginDialog.svelte
var Ae = a("<div><span style=\"word-break:break-all\"> </span></div>"), je = a("<div class=\"toast npub-toast svelte-1vy8d2x\"><!> <!></div>"), Me = a("<div class=\"xmark-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), Ne = a("<div class=\"parent-client-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Pe = a("<div class=\"parent-client-section svelte-1vy8d2x\"><!> <div aria-live=\"polite\"> </div></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div>", 1), Fe = a("<div class=\"extension-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Ie = a("<div aria-live=\"polite\"> </div>"), Le = a("<div class=\"vault-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Re = a("<!> <!>", 1), ze = a("<div class=\"nostrconnect-qr-shell svelte-1vy8d2x\" data-testid=\"nostrconnect-qr-code\"><!></div>"), Be = a("<div class=\"nostrconnect-qr-loading svelte-1vy8d2x\"><!></div>"), Ve = a("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div>"), He = a("<div class=\"nostrconnect-relay-popover svelte-1vy8d2x\"><div> </div> <div> </div> <div> </div></div>"), Ue = a("<div class=\"close-icon svg-icon\" aria-hidden=\"true\"></div>"), We = a("<div class=\"nostrconnect-relay-row svelte-1vy8d2x\"><input type=\"url\" class=\"nostrconnect-relay-field svelte-1vy8d2x\"/> <!></div>"), Ge = a("<div class=\"section-feedback error svelte-1vy8d2x\" aria-live=\"polite\" role=\"alert\"> </div>"), Ke = a("<!> <div class=\"nostrconnect-uri-card svelte-1vy8d2x\"><div class=\"nostrconnect-uri svelte-1vy8d2x\" data-testid=\"nostrconnect-uri\"><input type=\"text\" readonly=\"\" spellcheck=\"false\" autocomplete=\"off\" class=\"svelte-1vy8d2x\"/> <!></div></div> <div class=\"section-feedback info nostrconnect-status svelte-1vy8d2x\" role=\"status\"><!></div> <div class=\"nostrconnect-relay-settings svelte-1vy8d2x\"><div class=\"nostrconnect-relay-settings-header\"><div class=\"nostrconnect-relay-settings-title-row svelte-1vy8d2x\"><span class=\"nostrconnect-relay-settings-title svelte-1vy8d2x\"> </span> <!></div></div> <div class=\"nostrconnect-relay-editor-list svelte-1vy8d2x\"></div> <div class=\"nostrconnect-relay-editor-actions svelte-1vy8d2x\"><!> <!> <!></div></div> <!>", 1), qe = a("<div class=\"clear-input-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), Je = a("<form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"bunker-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"bunker://...\" class=\"bunker-input u-control svelte-1vy8d2x\" required=\"\" autocomplete=\"off\"/> <!></div> <!></div> <!></form>"), Ye = a("<div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"secret-key-section svelte-1vy8d2x\"><div class=\"secret-heading-row svelte-1vy8d2x\"><div class=\"secret-icon svg-icon svelte-1vy8d2x\"></div> <h3 class=\"svelte-1vy8d2x\"> </h3></div> <form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"secret-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"nsec1...\" class=\"secret-input u-control svelte-1vy8d2x\" id=\"secretKey\" name=\"secretKey\" autocomplete=\"current-password\" required=\"\" minlength=\"63\" maxlength=\"63\"/> <!></div> <!></div> <!></form></div>", 1), Xe = a("<!> <div class=\"nip07-login-section svelte-1vy8d2x\"><!> <!></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"remote-signer-section svelte-1vy8d2x\"><!> <details class=\"remote-signer-details svelte-1vy8d2x\"><summary class=\"svelte-1vy8d2x\"> </summary> <!></details></div> <!>", 1), Ze = a("<div> </div>"), Qe = a("<!> <!> <!>", 1), $e = {
	hash: "svelte-1vy8d2x",
	code: ".xmark-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}form.svelte-1vy8d2x {width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;}\n\n    /* トースト用スタイル */.toast.svelte-1vy8d2x {position:fixed;top:0px;left:50%;translate:-50% 0;display:flex;width:100%;max-width:500px;background:var(--dialog-bg);color:var(--text);border-radius:0 0 10px 10px;z-index:101;font-family:monospace;font-size:1rem;line-height:1.2;word-break:break-all;flex-direction:column;align-items:flex-start;gap:6px;padding:8px 14px 14px;margin-bottom:8px;}\n    @keyframes svelte-1vy8d2x-toast-fadein {\n        from {\n            opacity: 0;\n            translate: -50% -10px;\n        }\n        to {\n            opacity: 0.98;\n            translate: -50% 0;\n        }\n    }.parent-client-section.svelte-1vy8d2x,\n    .nip07-login-section.svelte-1vy8d2x {display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;gap:6px;}.parent-client-feedback.svelte-1vy8d2x,\n    .section-feedback.svelte-1vy8d2x {font-size:0.95rem;text-align:center;}.parent-client-feedback.info.svelte-1vy8d2x,\n    .section-feedback.info.svelte-1vy8d2x {color:var(--text-light);}.parent-client-feedback.error.svelte-1vy8d2x,\n    .section-feedback.error.svelte-1vy8d2x {background:var(--balloon-error-bg, hsl(351, 99%, 96%));border:1px solid var(--balloon-error-border, hsl(351, 99%, 70%));color:var(--balloon-error-color, hsl(351, 99%, 32%));}.parent-client-login-button.primary,\n    .nip07-login-button.primary,\n    .nostrconnect-open-btn.primary {flex-shrink:0;position:relative;overflow:hidden;.btn-text.svelte-1vy8d2x {font-size:1.125rem;}}.parent-client-login-button.loading,\n    .nip07-login-button.loading,\n    .nostrconnect-open-btn.loading {cursor:not-allowed;}.svg-icon.parent-client-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.svg-icon.extension-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-657874656e73696f6e5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.remote-signer-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:6px;}.secret-key-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:10px;}.remote-signer-panel {display:flex;flex-direction:column;gap:8px;}.remote-signer-details.svelte-1vy8d2x {width:100%;background:var(--dialog-bg2);border-radius:8px;}.remote-signer-details.svelte-1vy8d2x summary:where(.svelte-1vy8d2x) {padding:12px;cursor:pointer;font-weight:600;}.secret-heading-row.svelte-1vy8d2x {display:flex;gap:6px;justify-content:center;align-items:center;width:100%;}.secret-input-row.svelte-1vy8d2x,\n    .bunker-input-row.svelte-1vy8d2x {display:flex;gap:6px;width:100%;flex:none;}.input-shell.svelte-1vy8d2x {position:relative;display:flex;align-items:center;flex:1;min-width:0;}.secret-input.svelte-1vy8d2x,\n    .bunker-input.svelte-1vy8d2x {font-family:monospace;font-size:1rem;padding:0.6rem 3.25rem 0.6rem 0.6rem;background-color:var(--btn-bg);border:none;flex:1;min-width:0;}.ehagaki-app-root button.clear-input-btn {position:absolute;inset:50% auto 50% auto;right:2px;transform:translateY(-50%);width:46px;min-width:46px;height:46px;min-height:46px;padding:0;display:inline-flex;align-items:center;justify-content:center;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);flex:0 0 auto;z-index:1;}.ehagaki-app-root button.clear-input-btn:hover:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:active:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:focus-visible,\n    .ehagaki-app-root button.clear-input-btn:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.clear-input-btn:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.clear-input-icon.svelte-1vy8d2x {width:24px;height:24px;mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.secret-heading-row.svelte-1vy8d2x h3:where(.svelte-1vy8d2x) {margin:0;}.remote-signer-tabs {display:flex;flex-direction:column;padding:8px;gap:8px;}.remote-signer-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}.remote-signer-tab {background:var(--btn-bg);--btn-bg: var(--btn-bg2);color:var(--text);padding:12px 16px;font-size:0.95rem;font-weight:600;cursor:pointer;&[data-value=\"qr\"] {border-start-start-radius:10px;border-end-start-radius:10px;}&[data-value=\"bunker\"] {border-start-end-radius:10px;border-end-end-radius:10px;}}.nostrconnect-qr-shell.svelte-1vy8d2x,\n    .nostrconnect-qr-loading.svelte-1vy8d2x {width:100%;}.nostrconnect-qr-loading.svelte-1vy8d2x {min-height:320px;display:flex;align-items:center;justify-content:center;padding:16px;border-radius:16px;background:var(--btn-bg);border:1px solid var(--border-hr);}.nostrconnect-uri-card.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-uri.svelte-1vy8d2x {display:flex;align-items:center;position:relative;height:40px;padding:0 40px 0 12px;background:var(--btn-bg2);border-radius:12px;font-family:monospace;font-size:0.9rem;}.nostrconnect-uri.svelte-1vy8d2x input:where(.svelte-1vy8d2x) {width:100%;border:none;background:transparent;font-family:inherit;font-size:inherit;outline:none;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}button.nostrconnect-copy-btn.circle.copy {position:absolute;inset:auto 2px 2px auto;width:34px;min-width:34px;height:34px;flex:0 0 34px;z-index:1;}button.nostrconnect-copy-btn .copy-icon {width:18px;height:18px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.nostrconnect-relay-editor-actions.svelte-1vy8d2x {display:flex;flex-wrap:wrap;gap:6px;}.nostrconnect-relay-settings.svelte-1vy8d2x {display:flex;flex-direction:column;gap:6px;padding:2px 12px 12px;background:var(--dialog-bg3);border-radius:16px;}.nostrconnect-relay-settings-title-row.svelte-1vy8d2x {display:flex;align-items:center;}.nostrconnect-relay-settings-title.svelte-1vy8d2x {font-weight:600;}.nostrconnect-relay-popover.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-relay-editor-list.svelte-1vy8d2x {display:flex;flex-direction:column;gap:4px;}.nostrconnect-relay-row.svelte-1vy8d2x {display:flex;align-items:stretch;height:40px;.nostrconnect-remove-relay-btn {width:auto;height:auto;border-radius:0 12px 12px 0;--btn-bg: var(--btn-bg3);opacity:1;aspect-ratio:1;.close-icon {--svg: currentColor;width:24px;height:24px;}}}.nostrconnect-relay-field.svelte-1vy8d2x {flex:1;width:auto;height:auto;padding:0 0.75rem;background:var(--btn-bg3);border:none;border-radius:12px 0 0 12px;font-family:monospace;font-size:0.95rem;}.secret-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6b65795f766572746963616c5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;flex:0 0 28px;display:inline-block;vertical-align:middle;}.vault-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-736869656c645f6c6f636b65645f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;display:inline-block;vertical-align:middle;}\n\n    @media (max-width: 600px) {.bunker-input-row.svelte-1vy8d2x,\n        .secret-input-row.svelte-1vy8d2x {flex-direction:column;}\n    }.divider.svelte-1vy8d2x {display:flex;align-items:center;text-align:center;margin:16px 0;width:100%;}.divider.svelte-1vy8d2x::before,\n    .divider.svelte-1vy8d2x::after {content:\"\";flex:1;height:1px;background:var(--border-hr);}.divider.svelte-1vy8d2x span:where(.svelte-1vy8d2x) {color:var(--text-light);padding:0 16px;font-size:1rem;}input.u-control, button.u-control {min-height:50px;min-width:60px;width:100%;display:inline-flex;align-items:center;}\n\n    @media (min-width: 601px) {.save-btn.u-control, .bunker-connect-btn.u-control {width:120px;}\n    }"
};
function et(n, a) {
	t(a, !0), e(n, $e);
	let m = () => E(oe, "$_", Te), [Te, De] = ie(), F = T(a, "show", 15, !1), I = T(a, "secretKey", 15), Oe = T(a, "isParentClientAvailable", 3, !1), et = T(a, "isLoadingParentClient", 3, !1), tt = T(a, "isNip07ExtensionAvailable", 3, !1), nt = T(a, "isLoadingNip07", 3, !1), rt = T(a, "isLoadingNip46", 3, !1), it = T(a, "isPreparingNip46NostrConnect", 3, !1), at = T(a, "isWaitingNip46NostrConnect", 3, !1), ot = T(a, "isHandshakeStartedNip46NostrConnect", 3, !1), L = T(a, "nip46NostrConnectUri", 3, null), st = T(a, "nip46NostrConnectErrorMessage", 3, ""), ct = T(a, "initialNostrConnectRelayCandidates", 19, () => []), lt = T(a, "isAddAccountMode", 3, !1), ut = T(a, "localNsecAuthEnabled", 3, !0);
	function dt() {
		F(!1), a.onClose?.();
	}
	de(() => F(), dt, !0);
	let ft = A(tt), pt = A(Oe), mt = new le(), ht = A(() => mt.isValid), gt = A(() => mt.npub), _t = A(() => mt.nprofile), vt = A(() => m()("clearInput") === "clearInput" ? "入力内容を消去" : m()("clearInput")), R = k(null), z = k(""), B = k("qr"), yt = k(!1), bt = k(null), V = k(re([""])), H = k(null), U = k(""), W = k(""), G = k(""), K = k(""), q = k(!1), xt = k(!1), St = k(!1), J = k(!1), Y, Ct = k(null);
	function wt() {
		Y &&= (clearTimeout(Y), void 0), x(Ct, null), x(St, !1);
	}
	function X() {
		wt(), x(J, !1);
	}
	function Tt() {
		return ct().length > 0 ? [...ct()] : we();
	}
	function Et() {
		X(), x(V, Ce(Tt()), !0), x(B, "qr"), x(bt, null);
	}
	v(() => {
		F() && !C(yt) ? (x(yt, !0), I(""), x(z, ""), x(U, ""), x(W, ""), x(G, ""), x(K, ""), x(xt, !1), Et(), queueMicrotask(() => {
			F() && C(B) === "qr" && Jt();
		})) : F() || (x(yt, !1), X());
	}), v(() => {
		L(), x(xt, !1), X();
	}), v(() => {
		if (typeof document > "u") return;
		function e() {
			document.visibilityState !== "visible" && wt();
		}
		return document.addEventListener("visibilitychange", e), () => {
			document.removeEventListener("visibilitychange", e), X();
		};
	});
	let Z = A(() => Se(C(V))), Dt = A(() => C(Z).errorKey === null ? C(Z).relays.join("\n") : null), Ot = A(() => C(B) === "qr" && C(Z).errorKey ? m()(C(Z).errorKey) : ""), Q = A(it), $ = A(ot), kt = A(() => C(Q) || at()), At = A(() => C(Q) || C(Z).errorKey !== null || !C(Dt) || !!L() && C(Dt) === C(bt));
	v(() => {
		C($) && (x(J, !1), wt());
	}), v(() => {
		F(), C(B), L(), C(kt), F() && C(B) === "qr" && L() && C(kt) || X();
	}), v(() => {
		I() !== void 0 && mt.setNsec(I());
	}), v(() => {
		I() !== void 0 && C(R) && !I() && C(R).setCustomValidity("");
	});
	function jt(e) {
		x(z, e.currentTarget.value, !0), x(G, ""), C(H) && C(H).setCustomValidity("");
	}
	function Mt() {
		C(z) && (x(z, ""), x(G, ""), C(H)?.setCustomValidity(""), C(H)?.focus({ preventScroll: !0 }));
	}
	function Nt() {
		I() && (I(""), x(K, ""), C(R)?.setCustomValidity(""), C(R)?.focus({ preventScroll: !0 }));
	}
	function Pt(e) {
		return e === "invalid_secret" ? m()("loginDialog.invalid_secret") : m()("loginDialog.secret_login_failed");
	}
	async function Ft() {
		if (!C(q)) {
			if (X(), x(K, ""), C(R)) {
				let e = C(R).validity, t = C(R).value ?? "";
				if (e.valueMissing) {
					C(R).setCustomValidity(m()("loginDialog.secret_key_required")), C(R).reportValidity();
					return;
				}
				if (!t.startsWith("nsec1")) {
					C(R).setCustomValidity(m()("loginDialog.secret_must_start_nsec1")), C(R).reportValidity();
					return;
				}
				if (t.length !== 63) {
					t.length < 63 ? C(R).setCustomValidity(m()("loginDialog.secret_too_short")) : C(R).setCustomValidity(m()("loginDialog.secret_too_long")), C(R).reportValidity();
					return;
				}
				if (!C(ht)) {
					C(R).setCustomValidity(m()("loginDialog.invalid_secret")), C(R).reportValidity();
					return;
				}
				C(R).setCustomValidity("");
			}
			x(q, !0);
			try {
				let e = await a.onSave?.();
				e && x(K, Pt(e), !0);
			} catch {
				x(K, m()("loginDialog.secret_login_failed"), !0);
			} finally {
				x(q, !1);
			}
		}
	}
	function It(e) {
		switch (e) {
			case "nip07_not_available": return m()("loginDialog.extension_not_found");
			case "nip07_auth_error": return m()("loginDialog.extension_login_failed");
			default: return e.startsWith("nip07_") ? m()("loginDialog.extension_login_failed") : e;
		}
	}
	function Lt(e) {
		switch (e) {
			case "Invalid bunker URL": return m()("loginDialog.bunker_invalid");
			case "nip46_connection_failed": return m()("loginDialog.bunker_connection_failed");
			default: return e;
		}
	}
	function Rt(e) {
		let t = be(e);
		return t.kind === "key" ? m()(t.key) : t.kind === "hidden" ? "" : t.message;
	}
	async function zt() {
		X(), x(W, "");
		let e = await a.onNip07Login?.();
		e && x(W, It(e), !0);
	}
	function Bt(e) {
		switch (e) {
			case "parent_client_not_available": return m()("loginDialog.parent_client_not_available");
			case "parent_client_timeout": return m()("loginDialog.parent_client_timeout");
			case "parent_client_auth_rejected": return m()("loginDialog.parent_client_auth_rejected");
			case "parent_client_not_logged_in": return m()("loginDialog.parent_client_not_logged_in");
			case "parent_client_disconnected": return m()("loginDialog.parent_client_disconnected");
			case "parent_client_invalid_response": return m()("loginDialog.parent_client_invalid_response");
			case "parent_client_auth_error": return m()("loginDialog.parent_client_auth_error");
			default: return e.startsWith("parent_client_") ? m()("loginDialog.parent_client_auth_error") : e;
		}
	}
	async function Vt() {
		X(), x(U, "");
		let e = await a.onParentClientLogin?.();
		e && x(U, Bt(e), !0);
	}
	async function Ht() {
		if (X(), x(G, ""), C(H)) {
			let e = C(H).value.trim();
			if (x(z, e, !0), C(H).validity.valueMissing) {
				x(G, m()("loginDialog.bunker_url_required"), !0), C(H).setCustomValidity(C(G)), C(H).reportValidity();
				return;
			}
			if (!ce.test(e)) {
				x(G, m()("loginDialog.bunker_invalid"), !0), C(H).setCustomValidity(C(G)), C(H).reportValidity();
				return;
			}
			C(H).setCustomValidity("");
		}
		let e = C(z).trim(), t = await a.onNip46Login?.(e);
		if (t && C(H)) {
			let e = Lt(t);
			x(G, e, !0), C(H).setCustomValidity(e), C(H).reportValidity();
		} else x(G, "");
	}
	function Ut(e) {
		C(B) !== e && (x(B, e, !0), X(), x(bt, null));
	}
	function Wt(e, t) {
		let n = [...C(V)];
		n[e] = t, x(V, ye(n), !0);
	}
	function Gt() {
		x(V, [...C(V), ""], !0);
	}
	function Kt(e) {
		x(V, ye(C(V).filter((t, n) => n !== e)), !0);
	}
	function qt() {
		x(V, Ce(we()), !0);
	}
	async function Jt() {
		C(B) === "qr" && C(Z).errorKey === null && C(Dt) && (C(kt) && a.onNostrConnectCancel?.(), x(bt, C(Dt), !0), await a.onNostrConnectStart?.(C(Z).relays));
	}
	function Yt() {
		if (!L()) return;
		let e = L();
		wt(), x(Ct, e, !0), x(J, !0), xe(e), Y = setTimeout(() => {
			Y = void 0, typeof document < "u" && document.visibilityState !== "visible" ? wt() : F() && C(B) === "qr" && (it() || at()) && !C($) && L() === e && C(Ct) === e ? (x(St, !0), Y = setTimeout(() => {
				x(St, !1), Y = void 0;
			}, 6e3)) : wt();
		}, 1200);
	}
	async function Xt() {
		if (!L()) return !1;
		let e = await ue(L(), "nostrconnect");
		return x(xt, e, !0), e;
	}
	let Zt = A(() => st() ? Rt(st()) : ""), Qt = A(() => C(B) === "qr" ? C(Zt) || C(Ot) : "");
	function $t(e) {
		X(), e.preventDefault(), Ft();
	}
	var en = Qe(), tn = y(en), nn = (e) => {
		var t = je(), n = O(t), r = (e) => {
			var t = Ae(), n = O(t), r = b(n, !0);
			s(t), D(() => f(r, C(gt))), p(e, t);
		};
		M(n, (e) => {
			C(gt) && e(r);
		});
		var i = w(n, 2), a = (e) => {
			var t = Ae(), n = O(t), r = b(n, !0);
			s(t), D(() => f(r, C(_t))), p(e, t);
		};
		M(i, (e) => {
			C(_t) && e(a);
		}), s(t), p(e, t);
	};
	M(tn, (e) => {
		(C(gt) || C(_t)) && e(nn);
	});
	var rn = w(tn, 2);
	{
		let e = (e) => {
			var t = r(), n = y(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = A(() => m()("global.close"));
						P(e, g(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return C(t);
							},
							children: (e, t) => {
								var n = Me();
								p(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				c(n, () => pe, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			p(e, t);
		}, t = A(() => lt() ? m()("loginDialog.add_account_title") : ut() ? m()("loginDialog.input_secret") : m()("common.login")), n = A(() => lt() ? m()("loginDialog.add_account_hint") : ut() ? m()("loginDialog.hint_input_secret") : m()("loginDialog.login_methods_hint"));
		fe(rn, {
			onOpenChange: (e) => !e && dt(),
			get title() {
				return C(t);
			},
			get description() {
				return C(n);
			},
			contentClass: "login-dialog",
			footerVariant: "close-button",
			get open() {
				return F();
			},
			set open(e) {
				F(e);
			},
			footer: e,
			children: (e, t) => {
				var n = Xe(), a = y(n), d = (e) => {
					var t = Pe(), n = y(t), i = O(n);
					{
						let e = A(() => et() ? "loading" : "");
						P(i, {
							variant: "primary",
							shape: "square",
							get className() {
								return `parent-client-login-button u-control ${C(e) ?? ""}`;
							},
							onClick: Vt,
							get disabled() {
								return et();
							},
							children: (e, t) => {
								var n = r(), i = y(n), a = (e) => {
									N(e, {
										text: !0,
										showLoader: !0
									});
								}, o = (e) => {
									var t = Ne(), n = w(y(t), 2), r = b(n, !0);
									D((e) => f(r, e), [() => m()("loginDialog.login_with_parent_client")]), p(e, t);
								};
								M(i, (e) => {
									et() ? e(a) : e(o, -1);
								}), p(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					var a = w(i, 2), o = b(a, !0);
					s(n);
					var c = w(n, 2), l = O(c), d = b(l, !0);
					s(c), D((e, t) => {
						u(a, 1, `parent-client-feedback ${C(U) ? "error" : "info"}`, "svelte-1vy8d2x"), j(a, "role", C(U) ? "alert" : "status"), f(o, e), f(d, t);
					}, [() => C(U) || m()("loginDialog.parent_client_hint"), () => m()("common.or")]), p(e, t);
				};
				M(a, (e) => {
					C(pt) && e(d);
				});
				var g = w(a, 2), v = O(g);
				{
					let e = A(() => nt() ? "loading" : ""), t = A(() => nt() || !C(ft));
					P(v, {
						variant: "primary",
						shape: "square",
						get className() {
							return `nip07-login-button u-control ${C(e) ?? ""}`;
						},
						onClick: zt,
						get disabled() {
							return C(t);
						},
						children: (e, t) => {
							var n = r(), i = y(n), a = (e) => {
								N(e, {
									text: !0,
									showLoader: !0
								});
							}, o = (e) => {
								var t = Fe(), n = w(y(t), 2), r = b(n, !0);
								D((e) => f(r, e), [() => m()("loginDialog.login_with_extension")]), p(e, t);
							};
							M(i, (e) => {
								nt() ? e(a) : e(o, -1);
							}), p(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				var re = w(v, 2), ie = (e) => {
					var t = Ie(), n = b(t, !0);
					D((e) => {
						u(t, 1, `section-feedback ${C(W) ? "error" : "info"}`, "svelte-1vy8d2x"), j(t, "role", C(W) ? "alert" : "status"), f(n, e);
					}, [() => C(W) || m()("loginDialog.extension_not_found")]), p(e, t);
				};
				M(re, (e) => {
					(C(W) || !C(ft)) && e(ie);
				}), s(g);
				var T = w(g, 2), E = O(T), k = b(E, !0);
				s(T);
				var oe = w(T, 2), se = O(oe);
				{
					let e = A(() => C($) ? m()("loginDialog.nostrconnect_handshake_started") : C(J) ? m()("loginDialog.nostrconnect_opening_signer") : m()("loginDialog.nostrconnect_open")), t = A(() => C(Q) || !L() || C(J) || C($)), n = A(() => C(Q) && !L() || C(J) || C($) ? "loading" : "");
					P(se, {
						type: "button",
						variant: "primary",
						shape: "square",
						get ariaLabel() {
							return C(e);
						},
						onClick: Yt,
						get disabled() {
							return C(t);
						},
						get className() {
							return `nostrconnect-open-btn u-control ${C(n) ?? ""}`;
						},
						"data-testid": "nostrconnect-open-button",
						children: (e, t) => {
							var n = r(), i = y(n), a = (e) => {
								{
									let t = A(() => m()("loginDialog.nostrconnect_preparing"));
									N(e, {
										get text() {
											return C(t);
										},
										showLoader: !0
									});
								}
							}, o = (e) => {
								{
									let t = A(() => m()("loginDialog.nostrconnect_handshake_started"));
									N(e, {
										get text() {
											return C(t);
										},
										showLoader: !0
									});
								}
							}, s = (e) => {
								{
									let t = A(() => m()("loginDialog.nostrconnect_opening_signer"));
									N(e, {
										get text() {
											return C(t);
										},
										showLoader: !0
									});
								}
							}, c = (e) => {
								var t = Le(), n = w(y(t), 2), r = b(n, !0);
								D((e) => f(r, e), [() => m()("loginDialog.remote_signer_title")]), p(e, t);
							};
							M(i, (e) => {
								C(Q) && !L() ? e(a) : C($) ? e(o, 1) : C(J) ? e(s, 2) : e(c, -1);
							}), p(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				var ce = w(se, 2), le = O(ce), ue = b(le, !0), de = w(le, 2);
				c(de, () => me, (e, t) => {
					t(e, {
						get value() {
							return C(B);
						},
						onValueChange: (e) => Ut(e),
						class: "remote-signer-tabs",
						children: (e, t) => {
							var n = Re(), a = y(n);
							c(a, () => he, (e, t) => {
								t(e, {
									class: "remote-signer-tab-list",
									children: (e, t) => {
										var n = Re(), r = y(n);
										c(r, () => _e, (e, t) => {
											t(e, {
												value: "qr",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-qr-tab",
												children: (e, t) => {
													S();
													var n = h();
													D((e) => f(n, e), [() => m()("loginDialog.nostrconnect_qr_tab")]), p(e, n);
												},
												$$slots: { default: !0 }
											});
										});
										var i = w(r, 2);
										c(i, () => _e, (e, t) => {
											t(e, {
												value: "bunker",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-bunker-tab",
												children: (e, t) => {
													S();
													var n = h();
													D((e) => f(n, e), [() => m()("loginDialog.nostrconnect_bunker_tab")]), p(e, n);
												},
												$$slots: { default: !0 }
											});
										}), p(e, n);
									},
									$$slots: { default: !0 }
								});
							});
							var u = w(a, 2), d = (e) => {
								var t = r(), n = y(t);
								c(n, () => ge, (e, t) => {
									t(e, {
										value: "qr",
										class: "remote-signer-panel nostrconnect-panel",
										children: (e, t) => {
											var n = Ke(), r = y(n), a = (e) => {
												var t = ze(), n = O(t);
												{
													let e = A(() => m()("loginDialog.nostrconnect_qr_alt"));
													ke(n, {
														get value() {
															return L();
														},
														get label() {
															return C(e);
														}
													});
												}
												s(t), p(e, t);
											}, c = (e) => {
												var t = Be(), n = O(t);
												N(n, {
													text: !0,
													showLoader: !0
												}), s(t), p(e, t);
											};
											M(r, (e) => {
												L() ? e(a) : C(Q) && e(c, 1);
											});
											var l = w(r, 2), u = O(l), d = O(u);
											ae(d);
											var g = w(d, 2);
											{
												let e = A(() => m()("common.copySuccess")), t = A(() => C(Q) || !L()), n = A(() => C(xt) ? m()("loginDialog.nostrconnect_copied") : m()("loginDialog.nostrconnect_copy"));
												P(g, {
													type: "button",
													variant: "copy",
													shape: "circle",
													contentLayout: "icon",
													onClick: Xt,
													get floatingMessage() {
														return C(e);
													},
													get disabled() {
														return C(t);
													},
													className: "nostrconnect-copy-btn",
													get ariaLabel() {
														return C(n);
													},
													"data-testid": "nostrconnect-copy-button",
													children: (e, t) => {
														var n = Ve();
														p(e, n);
													},
													$$slots: { default: !0 }
												});
											}
											s(u), s(l);
											var v = w(l, 2), te = O(v), x = (e) => {
												var t = h();
												D((e) => f(t, e), [() => m()("loginDialog.nostrconnect_preparing")]), p(e, t);
											}, ne = (e) => {
												{
													let t = A(() => m()("loginDialog.nostrconnect_opening_signer"));
													N(e, {
														get text() {
															return C(t);
														},
														showLoader: !0
													});
												}
											}, re = (e) => {
												{
													let t = A(() => m()("loginDialog.nostrconnect_handshake_started"));
													N(e, {
														get text() {
															return C(t);
														},
														showLoader: !0
													});
												}
											}, ie = (e) => {
												var t = h();
												D((e) => f(t, e), [() => m()("loginDialog.nostrconnect_waiting")]), p(e, t);
											}, T = (e) => {
												var t = h();
												D((e) => f(t, e), [() => m()("loginDialog.nostrconnect_idle")]), p(e, t);
											};
											M(te, (e) => {
												C(Q) ? e(x) : C(J) ? e(ne, 1) : C($) ? e(re, 2) : at() ? e(ie, 3) : e(T, -1);
											}), s(v);
											var E = w(v, 2), k = O(E), oe = O(k), se = O(oe), ce = b(se, !0), le = w(se, 2);
											{
												let e = A(() => m()("loginDialog.nostrconnect_relay_settings_description"));
												Ee(le, {
													side: "top",
													sideOffset: 8,
													get ariaLabel() {
														return C(e);
													},
													children: (e, t) => {
														var n = He(), r = O(n), i = b(r, !0), a = w(r, 2), o = b(a, !0), c = w(a, 2), l = b(c, !0);
														s(n), D((e, t, n) => {
															f(i, e), f(o, t), f(l, n);
														}, [
															() => m()("loginDialog.nostrconnect_relay_hint"),
															() => m()("loginDialog.nostrconnect_relay_update_hint"),
															() => m()("loginDialog.nostrconnect_relay_switch_hint")
														]), p(e, n);
													},
													$$slots: { default: !0 }
												});
											}
											s(oe), s(k);
											var ue = w(k, 2);
											i(ue, 21, () => C(V), o, (e, t, n) => {
												var r = We(), i = O(r);
												ae(i);
												var a = w(i, 2);
												{
													let e = A(() => m()("loginDialog.nostrconnect_remove_relay")), r = A(() => C(V).length === 1 && !C(t).trim());
													P(a, {
														type: "button",
														variant: "close",
														shape: "rounded",
														className: "nostrconnect-remove-relay-btn",
														get ariaLabel() {
															return C(e);
														},
														onClick: () => Kt(n),
														get disabled() {
															return C(r);
														},
														children: (e, t) => {
															var n = Ue();
															p(e, n);
														},
														$$slots: { default: !0 }
													});
												}
												s(r), D((e) => {
													_(i, C(t)), j(i, "placeholder", e);
												}, [() => m()("loginDialog.nostrconnect_relay_placeholder")]), ee("input", i, (e) => Wt(n, e.currentTarget.value)), p(e, r);
											}), s(ue);
											var de = w(ue, 2), fe = O(de);
											P(fe, {
												type: "button",
												variant: "primary",
												onClick: Jt,
												get disabled() {
													return C(At);
												},
												"data-testid": "nostrconnect-regenerate",
												children: (e, t) => {
													S();
													var n = h();
													D((e) => f(n, e), [() => m()("loginDialog.nostrconnect_generate")]), p(e, n);
												},
												$$slots: { default: !0 }
											});
											var pe = w(fe, 2);
											P(pe, {
												type: "button",
												variant: "secondary",
												onClick: Gt,
												children: (e, t) => {
													S();
													var n = h();
													D((e) => f(n, e), [() => m()("loginDialog.nostrconnect_add_relay")]), p(e, n);
												},
												$$slots: { default: !0 }
											});
											var me = w(pe, 2);
											P(me, {
												type: "button",
												variant: "secondary",
												onClick: qt,
												"data-testid": "nostrconnect-reset-relays",
												children: (e, t) => {
													S();
													var n = h();
													D((e) => f(n, e), [() => m()("loginDialog.nostrconnect_reset_relays")]), p(e, n);
												},
												$$slots: { default: !0 }
											}), s(de), s(E);
											var he = w(E, 2), ge = (e) => {
												var t = Ge(), n = b(t, !0);
												D(() => f(n, C(Qt))), p(e, t);
											};
											M(he, (e) => {
												C(Qt) && e(ge);
											}), D((e) => {
												_(d, L() || ""), j(d, "title", L() || ""), f(ce, e);
											}, [() => m()("loginDialog.nostrconnect_edit_relays")]), p(e, n);
										},
										$$slots: { default: !0 }
									});
								}), p(e, t);
							}, g = (e) => {
								var t = r(), n = y(t);
								c(n, () => ge, (e, t) => {
									t(e, {
										value: "bunker",
										class: "remote-signer-panel bunker-panel",
										children: (e, t) => {
											var n = Je(), i = O(n), a = O(i), o = O(a);
											ae(o), te(o, (e) => x(H, e), () => C(H));
											var c = w(o, 2), u = (e) => {
												P(e, {
													variant: "secondary",
													type: "button",
													className: "clear-input-btn",
													get ariaLabel() {
														return C(vt);
													},
													onClick: Mt,
													get onmousedown() {
														return ve;
													},
													get ontouchstart() {
														return ve;
													},
													get disabled() {
														return rt();
													},
													children: (e, t) => {
														var n = qe();
														p(e, n);
													},
													$$slots: { default: !0 }
												});
											};
											M(c, (e) => {
												C(z).length > 0 && e(u);
											}), s(a);
											var d = w(a, 2);
											{
												let e = A(() => rt() ? "loading" : "");
												P(d, {
													variant: "primary",
													shape: "square",
													type: "submit",
													get disabled() {
														return rt();
													},
													get className() {
														return `bunker-connect-btn u-control ${C(e) ?? ""}`;
													},
													children: (e, t) => {
														var n = r(), i = y(n), a = (e) => {
															N(e, { showLoader: !0 });
														}, o = (e) => {
															var t = h();
															D((e) => f(t, e), [() => m()("loginDialog.bunker_connect")]), p(e, t);
														};
														M(i, (e) => {
															rt() ? e(a) : e(o, -1);
														}), p(e, n);
													},
													$$slots: { default: !0 }
												});
											}
											s(i);
											var g = w(i, 2), v = (e) => {
												var t = Ge(), n = b(t, !0);
												D(() => f(n, C(G))), p(e, t);
											};
											M(g, (e) => {
												C(G) && e(v);
											}), s(n), D(() => {
												_(o, C(z)), o.disabled = rt();
											}), l("submit", n, (e) => {
												e.preventDefault(), Ht();
											}), ee("input", o, jt), p(e, n);
										},
										$$slots: { default: !0 }
									});
								}), p(e, t);
							};
							M(u, (e) => {
								C(B) === "qr" ? e(d) : e(g, -1);
							}), p(e, n);
						},
						$$slots: { default: !0 }
					});
				}), s(ce), s(oe);
				var fe = w(oe, 2), pe = (e) => {
					var t = Ye(), n = y(t), i = O(n), a = b(i, !0);
					s(n);
					var o = w(n, 2), c = O(o), u = w(O(c), 2), d = b(u, !0);
					s(c);
					var g = w(c, 2), _ = O(g), v = O(_), S = O(v);
					ae(S), te(S, (e) => x(R, e), () => C(R));
					var re = w(S, 2), ie = (e) => {
						P(e, {
							variant: "secondary",
							type: "button",
							className: "clear-input-btn",
							get ariaLabel() {
								return C(vt);
							},
							onClick: Nt,
							get onmousedown() {
								return ve;
							},
							get ontouchstart() {
								return ve;
							},
							children: (e, t) => {
								var n = qe();
								p(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					M(re, (e) => {
						I().length > 0 && e(ie);
					}), s(v);
					var T = w(v, 2);
					{
						let e = A(() => C(q) ? "loading" : "");
						P(T, {
							variant: "primary",
							shape: "square",
							type: "submit",
							get disabled() {
								return C(q);
							},
							get className() {
								return `save-btn u-control ${C(e) ?? ""}`;
							},
							children: (e, t) => {
								var n = r(), i = y(n), a = (e) => {
									N(e, { showLoader: !0 });
								}, o = (e) => {
									var t = h();
									D((e) => f(t, e), [() => m()("loginDialog.save")]), p(e, t);
								};
								M(i, (e) => {
									C(q) ? e(a) : e(o, -1);
								}), p(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					s(_);
					var E = w(_, 2), k = (e) => {
						var t = Ge(), n = b(t, !0);
						D(() => f(n, C(K))), p(e, t);
					};
					M(E, (e) => {
						C(K) && e(k);
					}), s(g), s(o), D((e, t, n) => {
						f(a, e), f(d, t), j(S, "title", n);
					}, [
						() => m()("common.or"),
						() => m()("loginDialog.input_secret"),
						() => m()("loginDialog.hint_input_secret")
					]), l("submit", g, $t), ee("input", S, () => {
						x(K, ""), C(R)?.setCustomValidity("");
					}), ne(S, I), p(e, t);
				};
				M(fe, (e) => {
					ut() && e(pe);
				}), D((e, t) => {
					f(k, e), f(ue, t);
				}, [() => m()("common.or"), () => m()("loginDialog.nostrconnect_input_title")]), p(e, n);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var an = w(rn, 2);
	se(an, {
		get show() {
			return C(St);
		},
		variant: "top-right",
		children: (e, t) => {
			var n = Ze(), r = b(n, !0);
			D((e) => f(r, e), [() => m()("loginDialog.nostrconnect_direct_open_hint")]), p(e, n);
		},
		$$slots: { default: !0 }
	}), p(n, en), d(), De();
}
m(["input"]);
export { et as default };
