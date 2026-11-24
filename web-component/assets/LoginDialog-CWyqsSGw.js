import { $ as e, B as t, Dt as n, E as r, Et as i, G as a, H as o, I as s, K as c, L as l, Mt as u, Nt as d, P as f, Q as ee, R as te, St as p, X as m, Z as h, _t as g, a as _, b as v, ct as y, dt as b, f as ne, ft as x, h as re, ht as S, j as C, lt as w, mt as T, o as ie, pt as E, q as D, r as O, rt as k, s as ae, x as oe, y as se, yt as A } from "./index-client-DEFG3Gqk.js";
import { Z as j, t as M } from "./LoadingPlaceholder-YrD8D_td.js";
import { _ as ce, a as le } from "./clipboardUtils-CSGkJuUA.js";
import { a as ue, l as de } from "./nip46Service-ChjpWe9u.js";
import { n as fe, t as N } from "./Button-Cqrg0_jX.js";
import { t as pe } from "./useDialogHistory.svelte-pVteCIez.js";
import { t as me } from "./DialogWrapper-DlNV_DwH.js";
import { t as he } from "./dialog-close-DFGIFxm7.js";
import { i as ge, n as _e, r as ve, t as ye } from "./tabs-trigger-CnepqnT4.js";
import { i as be } from "./keyboardFocusUtils-BhXq7KwV.js";
import { C as xe, D as Se, E as Ce, S as we, T as Te, w as Ee, x as De } from "./App-CW2Ynbk9.js";
import { t as Oe } from "./InfoPopoverButton-DJx-e6v0.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/QrCodeDisplay.svelte
var ke = D("<div class=\"qr-code-svg svelte-1pb586e\" role=\"img\"></div>"), P = D("<div class=\"qr-code-placeholder svelte-1pb586e\" aria-hidden=\"true\"></div>"), F = D("<div class=\"qr-code-frame\"><!></div>"), Ae = {
	hash: "svelte-1pb586e",
	code: ".qr-code-svg.svelte-1pb586e {display:flex;justify-content:center;align-items:center;width:100%;}.qr-code-svg.svelte-1pb586e svg {display:block;width:min(100%, 288px);height:auto;background:#ffffff;}.qr-code-placeholder.svelte-1pb586e {width:min(100%, 288px);aspect-ratio:1;border-radius:12px;background:color-mix(in srgb, var(--text) 6%, #ffffff);}"
};
function je(e, r) {
	n(r, !0), C(e, Ae);
	let o = A(""), c = 0;
	w(() => {
		let e = r.value, t = ++c;
		g(o, ""), e && xe(e).then((n) => {
			t === c && r.value === e && g(o, n, !0);
		}).catch(() => {
			t === c && g(o, "");
		});
	});
	var l = F(), u = b(l), f = (e) => {
		var t = ke();
		s(t, () => k(o), !0), d(t), y(() => v(t, "aria-label", r.label)), a(e, t);
	}, ee = (e) => {
		var t = P();
		a(e, t);
	};
	t(u, (e) => {
		k(o) ? e(f) : e(ee, -1);
	}), d(l), y(() => v(l, "data-qr-value", r.value)), a(e, l), i();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/LoginDialog.svelte
var Me = D("<div><span style=\"word-break:break-all\"> </span></div>"), Ne = D("<div class=\"toast npub-toast svelte-1vy8d2x\"><!> <!></div>"), Pe = D("<div class=\"xmark-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), Fe = D("<div class=\"parent-client-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Ie = D("<div class=\"parent-client-section svelte-1vy8d2x\"><!> <div aria-live=\"polite\"> </div></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div>", 1), Le = D("<div class=\"extension-icon svg-icon svelte-1vy8d2x\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Re = D("<div aria-live=\"polite\"> </div>"), ze = D("<div class=\"vault-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div> <span class=\"btn-text svelte-1vy8d2x\"> </span>", 1), Be = D("<!> <!>", 1), Ve = D("<div class=\"nostrconnect-qr-shell svelte-1vy8d2x\" data-testid=\"nostrconnect-qr-code\"><!></div>"), He = D("<div class=\"nostrconnect-qr-loading svelte-1vy8d2x\"><!></div>"), Ue = D("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div>"), We = D("<div class=\"nostrconnect-relay-popover svelte-1vy8d2x\"><div> </div> <div> </div> <div> </div></div>"), Ge = D("<div class=\"close-icon svg-icon\" aria-hidden=\"true\"></div>"), Ke = D("<div class=\"nostrconnect-relay-row svelte-1vy8d2x\"><input type=\"url\" class=\"nostrconnect-relay-field svelte-1vy8d2x\"/> <!></div>"), qe = D("<div class=\"section-feedback error svelte-1vy8d2x\" aria-live=\"polite\" role=\"alert\"> </div>"), Je = D("<!> <div class=\"nostrconnect-uri-card svelte-1vy8d2x\"><div class=\"nostrconnect-uri svelte-1vy8d2x\" data-testid=\"nostrconnect-uri\"><input type=\"text\" readonly=\"\" spellcheck=\"false\" autocomplete=\"off\" class=\"svelte-1vy8d2x\"/> <!></div></div> <div class=\"section-feedback info nostrconnect-status svelte-1vy8d2x\" role=\"status\"><!></div> <div class=\"nostrconnect-relay-settings svelte-1vy8d2x\"><div class=\"nostrconnect-relay-settings-header\"><div class=\"nostrconnect-relay-settings-title-row svelte-1vy8d2x\"><span class=\"nostrconnect-relay-settings-title svelte-1vy8d2x\"> </span> <!></div></div> <div class=\"nostrconnect-relay-editor-list svelte-1vy8d2x\"></div> <div class=\"nostrconnect-relay-editor-actions svelte-1vy8d2x\"><!> <!> <!></div></div> <!>", 1), Ye = D("<div class=\"clear-input-icon svg-icon svelte-1vy8d2x\" aria-hidden=\"true\"></div>"), Xe = D("<form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"bunker-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"bunker://...\" class=\"bunker-input u-control svelte-1vy8d2x\" required=\"\" autocomplete=\"off\"/> <!></div> <!></div> <!></form>"), Ze = D("<div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"secret-key-section svelte-1vy8d2x\"><div class=\"secret-heading-row svelte-1vy8d2x\"><div class=\"secret-icon svg-icon svelte-1vy8d2x\"></div> <h3 class=\"svelte-1vy8d2x\"> </h3></div> <form novalidate=\"\" class=\"svelte-1vy8d2x\"><div class=\"secret-input-row svelte-1vy8d2x\"><div class=\"input-shell svelte-1vy8d2x\"><input type=\"password\" placeholder=\"nsec1...\" class=\"secret-input u-control svelte-1vy8d2x\" id=\"secretKey\" name=\"secretKey\" autocomplete=\"current-password\" required=\"\" minlength=\"63\"/> <!></div> <!></div> <!></form></div>", 1), Qe = D("<!> <div class=\"nip07-login-section svelte-1vy8d2x\"><!> <!></div> <div class=\"divider svelte-1vy8d2x\"><span class=\"svelte-1vy8d2x\"> </span></div> <div class=\"remote-signer-section svelte-1vy8d2x\"><!> <details class=\"remote-signer-details svelte-1vy8d2x\"><summary class=\"svelte-1vy8d2x\"> </summary> <!></details></div> <!>", 1), $e = D("<div> </div>"), et = D("<!> <!> <!>", 1), tt = {
	hash: "svelte-1vy8d2x",
	code: ".xmark-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}form.svelte-1vy8d2x {width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;}\n\n    /* トースト用スタイル */.toast.svelte-1vy8d2x {position:fixed;top:0px;left:50%;translate:-50% 0;display:flex;width:100%;max-width:500px;background:var(--dialog-bg);color:var(--text);border-radius:0 0 10px 10px;z-index:101;font-family:monospace;font-size:1rem;line-height:1.2;word-break:break-all;flex-direction:column;align-items:flex-start;gap:6px;padding:8px 14px 14px;margin-bottom:8px;}\n    @keyframes svelte-1vy8d2x-toast-fadein {\n        from {\n            opacity: 0;\n            translate: -50% -10px;\n        }\n        to {\n            opacity: 0.98;\n            translate: -50% 0;\n        }\n    }.parent-client-section.svelte-1vy8d2x,\n    .nip07-login-section.svelte-1vy8d2x {display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;gap:6px;}.parent-client-feedback.svelte-1vy8d2x,\n    .section-feedback.svelte-1vy8d2x {font-size:0.95rem;text-align:center;}.parent-client-feedback.info.svelte-1vy8d2x,\n    .section-feedback.info.svelte-1vy8d2x {color:var(--text-light);}.parent-client-feedback.error.svelte-1vy8d2x,\n    .section-feedback.error.svelte-1vy8d2x {background:var(--balloon-error-bg, hsl(351, 99%, 96%));border:1px solid var(--balloon-error-border, hsl(351, 99%, 70%));color:var(--balloon-error-color, hsl(351, 99%, 32%));}.parent-client-login-button.primary,\n    .nip07-login-button.primary,\n    .nostrconnect-open-btn.primary {flex-shrink:0;position:relative;overflow:hidden;.btn-text.svelte-1vy8d2x {font-size:1.125rem;}}.parent-client-login-button.loading,\n    .nip07-login-button.loading,\n    .nostrconnect-open-btn.loading {cursor:not-allowed;}.svg-icon.parent-client-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.svg-icon.extension-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-657874656e73696f6e5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.remote-signer-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:6px;}.secret-key-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:10px;}.remote-signer-panel {display:flex;flex-direction:column;gap:8px;}.remote-signer-details.svelte-1vy8d2x {width:100%;background:var(--dialog-bg2);border-radius:8px;}.remote-signer-details.svelte-1vy8d2x summary:where(.svelte-1vy8d2x) {padding:12px;cursor:pointer;font-weight:600;}.secret-heading-row.svelte-1vy8d2x {display:flex;gap:6px;justify-content:center;align-items:center;width:100%;}.secret-input-row.svelte-1vy8d2x,\n    .bunker-input-row.svelte-1vy8d2x {display:flex;gap:6px;width:100%;flex:none;}.input-shell.svelte-1vy8d2x {position:relative;display:flex;align-items:center;flex:1;min-width:0;}.secret-input.svelte-1vy8d2x,\n    .bunker-input.svelte-1vy8d2x {font-family:monospace;font-size:1rem;padding:0.6rem 3.25rem 0.6rem 0.6rem;background-color:var(--btn-bg);border:none;flex:1;min-width:0;}.ehagaki-app-root button.clear-input-btn {position:absolute;inset:50% auto 50% auto;right:2px;transform:translateY(-50%);width:46px;min-width:46px;height:46px;min-height:46px;padding:0;display:inline-flex;align-items:center;justify-content:center;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);flex:0 0 auto;z-index:1;}.ehagaki-app-root button.clear-input-btn:hover:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:active:not(:disabled),\n    .ehagaki-app-root button.clear-input-btn:focus-visible,\n    .ehagaki-app-root button.clear-input-btn:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.clear-input-btn:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.clear-input-icon.svelte-1vy8d2x {width:24px;height:24px;mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.secret-heading-row.svelte-1vy8d2x h3:where(.svelte-1vy8d2x) {margin:0;}.remote-signer-tabs {display:flex;flex-direction:column;padding:8px;gap:8px;}.remote-signer-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}.remote-signer-tab {background:var(--btn-bg);--btn-bg: var(--btn-bg2);color:var(--text);padding:12px 16px;font-size:0.95rem;font-weight:600;cursor:pointer;&[data-value=\"qr\"] {border-start-start-radius:10px;border-end-start-radius:10px;}&[data-value=\"bunker\"] {border-start-end-radius:10px;border-end-end-radius:10px;}}.nostrconnect-qr-shell.svelte-1vy8d2x,\n    .nostrconnect-qr-loading.svelte-1vy8d2x {width:100%;}.nostrconnect-qr-loading.svelte-1vy8d2x {min-height:320px;display:flex;align-items:center;justify-content:center;padding:16px;border-radius:16px;background:var(--btn-bg);border:1px solid var(--border-hr);}.nostrconnect-uri-card.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-uri.svelte-1vy8d2x {display:flex;align-items:center;position:relative;height:40px;padding:0 40px 0 12px;background:var(--btn-bg2);border-radius:12px;font-family:monospace;font-size:0.9rem;}.nostrconnect-uri.svelte-1vy8d2x input:where(.svelte-1vy8d2x) {width:100%;border:none;background:transparent;font-family:inherit;font-size:inherit;outline:none;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}button.nostrconnect-copy-btn.circle.copy {position:absolute;inset:auto 2px 2px auto;width:34px;min-width:34px;height:34px;flex:0 0 34px;z-index:1;}button.nostrconnect-copy-btn .copy-icon {width:18px;height:18px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.nostrconnect-relay-editor-actions.svelte-1vy8d2x {display:flex;flex-wrap:wrap;gap:6px;}.nostrconnect-relay-settings.svelte-1vy8d2x {display:flex;flex-direction:column;gap:6px;padding:2px 12px 12px;background:var(--dialog-bg3);border-radius:16px;}.nostrconnect-relay-settings-title-row.svelte-1vy8d2x {display:flex;align-items:center;}.nostrconnect-relay-settings-title.svelte-1vy8d2x {font-weight:600;}.nostrconnect-relay-popover.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-relay-editor-list.svelte-1vy8d2x {display:flex;flex-direction:column;gap:4px;}.nostrconnect-relay-row.svelte-1vy8d2x {display:flex;align-items:stretch;height:40px;.nostrconnect-remove-relay-btn {width:auto;height:auto;border-radius:0 12px 12px 0;--btn-bg: var(--btn-bg3);opacity:1;aspect-ratio:1;.close-icon {--svg: currentColor;width:24px;height:24px;}}}.nostrconnect-relay-field.svelte-1vy8d2x {flex:1;width:auto;height:auto;padding:0 0.75rem;background:var(--btn-bg3);border:none;border-radius:12px 0 0 12px;font-family:monospace;font-size:0.95rem;}.secret-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6b65795f766572746963616c5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;flex:0 0 28px;display:inline-block;vertical-align:middle;}.vault-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-736869656c645f6c6f636b65645f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;display:inline-block;vertical-align:middle;}\n\n    @media (max-width: 600px) {.bunker-input-row.svelte-1vy8d2x,\n        .secret-input-row.svelte-1vy8d2x {flex-direction:column;}\n    }.divider.svelte-1vy8d2x {display:flex;align-items:center;text-align:center;margin:16px 0;width:100%;}.divider.svelte-1vy8d2x::before,\n    .divider.svelte-1vy8d2x::after {content:\"\";flex:1;height:1px;background:var(--border-hr);}.divider.svelte-1vy8d2x span:where(.svelte-1vy8d2x) {color:var(--text-light);padding:0 16px;font-size:1rem;}input.u-control, button.u-control {min-height:50px;min-width:60px;width:100%;display:inline-flex;align-items:center;}\n\n    @media (min-width: 601px) {.save-btn.u-control, .bunker-connect-btn.u-control {width:120px;}\n    }"
};
function nt(s, h) {
	n(h, !0), C(s, tt);
	let D = () => ae(j, "$_", xe), [xe, ke] = ie(), P = O(h, "show", 15, !1), F = O(h, "secretKey", 15), Ae = O(h, "isParentClientAvailable", 3, !1), nt = O(h, "isLoadingParentClient", 3, !1), rt = O(h, "isNip07ExtensionAvailable", 3, !1), it = O(h, "isLoadingNip07", 3, !1), at = O(h, "isLoadingNip46", 3, !1), ot = O(h, "isPreparingNip46NostrConnect", 3, !1), st = O(h, "isWaitingNip46NostrConnect", 3, !1), ct = O(h, "isHandshakeStartedNip46NostrConnect", 3, !1), I = O(h, "nip46NostrConnectUri", 3, null), lt = O(h, "nip46NostrConnectErrorMessage", 3, ""), ut = O(h, "initialNostrConnectRelayCandidates", 19, () => []), dt = O(h, "isAddAccountMode", 3, !1), ft = O(h, "localNsecAuthEnabled", 3, !0);
	function pt() {
		P(!1), h.onClose?.();
	}
	pe(() => P(), pt, !0);
	let mt = p(rt), ht = p(Ae), gt = new de(), _t = p(() => gt.isValid), vt = p(() => gt.npub), yt = p(() => gt.nprofile), bt = p(() => D()("clearInput") === "clearInput" ? "入力内容を消去" : D()("clearInput")), L = A(null), R = A(""), z = A("qr"), xt = A(!1), St = A(null), B = A(S([""])), V = A(null), H = A(""), U = A(""), W = A(""), G = A(""), K = A(!1), Ct = A(!1), wt = A(!1), q = A(!1), J, Tt = A(null);
	function Y() {
		J &&= (clearTimeout(J), void 0), g(Tt, null), g(wt, !1);
	}
	function X() {
		Y(), g(q, !1);
	}
	function Et() {
		return ut().length > 0 ? [...ut()] : Ee();
	}
	function Dt() {
		X(), g(B, De(Et()), !0), g(z, "qr"), g(St, null);
	}
	w(() => {
		P() && !k(xt) ? (g(xt, !0), F(""), g(R, ""), g(H, ""), g(U, ""), g(W, ""), g(G, ""), g(Ct, !1), Dt(), queueMicrotask(() => {
			P() && k(z) === "qr" && Yt();
		})) : P() || (g(xt, !1), X());
	}), w(() => {
		I(), g(Ct, !1), X();
	}), w(() => {
		if (typeof document > "u") return;
		function e() {
			document.visibilityState !== "visible" && Y();
		}
		return document.addEventListener("visibilitychange", e), () => {
			document.removeEventListener("visibilitychange", e), X();
		};
	});
	let Z = p(() => Se(k(B))), Ot = p(() => k(Z).errorKey === null ? k(Z).relays.join("\n") : null), kt = p(() => k(z) === "qr" && k(Z).errorKey ? D()(k(Z).errorKey) : ""), Q = p(ot), $ = p(ct), At = p(() => k(Q) || st()), jt = p(() => k(Q) || k(Z).errorKey !== null || !k(Ot) || !!I() && k(Ot) === k(St));
	w(() => {
		k($) && (g(q, !1), Y());
	}), w(() => {
		P(), k(z), I(), k(At), P() && k(z) === "qr" && I() && k(At) || X();
	}), w(() => {
		F() !== void 0 && gt.setNsec(F());
	}), w(() => {
		F() !== void 0 && k(L) && !F() && k(L).setCustomValidity("");
	});
	function Mt(e) {
		g(R, e.currentTarget.value, !0), g(W, ""), k(V) && k(V).setCustomValidity("");
	}
	function Nt() {
		k(R) && (g(R, ""), g(W, ""), k(V)?.setCustomValidity(""), k(V)?.focus({ preventScroll: !0 }));
	}
	function Pt() {
		F() && (F(""), g(G, ""), k(L)?.setCustomValidity(""), k(L)?.focus({ preventScroll: !0 }));
	}
	function Ft(e) {
		return e === "invalid_public_key" || e === "public_key_account_already_registered" ? D()(`loginDialog.${e}`) : e === "invalid_secret" ? D()("loginDialog.invalid_secret") : D()("loginDialog.secret_login_failed");
	}
	async function It() {
		if (!k(K)) {
			if (X(), g(G, ""), k(L) && !ce(k(L).value)) {
				let e = k(L).validity, t = k(L).value ?? "";
				if (e.valueMissing) {
					k(L).setCustomValidity(D()("loginDialog.secret_key_required")), k(L).reportValidity();
					return;
				}
				if (!t.startsWith("nsec1")) {
					k(L).setCustomValidity(D()("loginDialog.secret_must_start_nsec1")), k(L).reportValidity();
					return;
				}
				if (t.length !== 63) {
					t.length < 63 ? k(L).setCustomValidity(D()("loginDialog.secret_too_short")) : k(L).setCustomValidity(D()("loginDialog.secret_too_long")), k(L).reportValidity();
					return;
				}
				if (!k(_t)) {
					k(L).setCustomValidity(D()("loginDialog.invalid_secret")), k(L).reportValidity();
					return;
				}
				k(L).setCustomValidity("");
			}
			g(K, !0);
			try {
				let e = await h.onSave?.();
				e && g(G, Ft(e), !0);
			} catch {
				g(G, D()("loginDialog.secret_login_failed"), !0);
			} finally {
				g(K, !1);
			}
		}
	}
	function Lt(e) {
		switch (e) {
			case "nip07_not_available": return D()("loginDialog.extension_not_found");
			case "nip07_auth_error": return D()("loginDialog.extension_login_failed");
			default: return e.startsWith("nip07_") ? D()("loginDialog.extension_login_failed") : e;
		}
	}
	function Rt(e) {
		switch (e) {
			case "Invalid bunker URL": return D()("loginDialog.bunker_invalid");
			case "nip46_connection_failed": return D()("loginDialog.bunker_connection_failed");
			default: return e;
		}
	}
	function zt(e) {
		let t = Ce(e);
		return t.kind === "key" ? D()(t.key) : t.kind === "hidden" ? "" : t.message;
	}
	async function Bt() {
		X(), g(U, "");
		let e = await h.onNip07Login?.();
		e && g(U, Lt(e), !0);
	}
	function Vt(e) {
		switch (e) {
			case "parent_client_not_available": return D()("loginDialog.parent_client_not_available");
			case "parent_client_timeout": return D()("loginDialog.parent_client_timeout");
			case "parent_client_auth_rejected": return D()("loginDialog.parent_client_auth_rejected");
			case "parent_client_not_logged_in": return D()("loginDialog.parent_client_not_logged_in");
			case "parent_client_disconnected": return D()("loginDialog.parent_client_disconnected");
			case "parent_client_invalid_response": return D()("loginDialog.parent_client_invalid_response");
			case "parent_client_auth_error": return D()("loginDialog.parent_client_auth_error");
			default: return e.startsWith("parent_client_") ? D()("loginDialog.parent_client_auth_error") : e;
		}
	}
	async function Ht() {
		X(), g(H, "");
		let e = await h.onParentClientLogin?.();
		e && g(H, Vt(e), !0);
	}
	async function Ut() {
		if (X(), g(W, ""), k(V)) {
			let e = k(V).value.trim();
			if (g(R, e, !0), k(V).validity.valueMissing) {
				g(W, D()("loginDialog.bunker_url_required"), !0), k(V).setCustomValidity(k(W)), k(V).reportValidity();
				return;
			}
			if (!ue.test(e)) {
				g(W, D()("loginDialog.bunker_invalid"), !0), k(V).setCustomValidity(k(W)), k(V).reportValidity();
				return;
			}
			k(V).setCustomValidity("");
		}
		let e = k(R).trim(), t = await h.onNip46Login?.(e);
		if (t && k(V)) {
			let e = Rt(t);
			g(W, e, !0), k(V).setCustomValidity(e), k(V).reportValidity();
		} else g(W, "");
	}
	function Wt(e) {
		k(z) !== e && (g(z, e, !0), X(), g(St, null));
	}
	function Gt(e, t) {
		let n = [...k(B)];
		n[e] = t, g(B, we(n), !0);
	}
	function Kt() {
		g(B, [...k(B), ""], !0);
	}
	function qt(e) {
		g(B, we(k(B).filter((t, n) => n !== e)), !0);
	}
	function Jt() {
		g(B, De(Ee()), !0);
	}
	async function Yt() {
		k(z) === "qr" && k(Z).errorKey === null && k(Ot) && (k(At) && h.onNostrConnectCancel?.(), g(St, k(Ot), !0), await h.onNostrConnectStart?.(k(Z).relays));
	}
	function Xt() {
		if (!I()) return;
		let e = I();
		Y(), g(Tt, e, !0), g(q, !0), Te(e), J = setTimeout(() => {
			J = void 0, typeof document < "u" && document.visibilityState !== "visible" ? Y() : P() && k(z) === "qr" && (ot() || st()) && !k($) && I() === e && k(Tt) === e ? (g(wt, !0), J = setTimeout(() => {
				g(wt, !1), J = void 0;
			}, 6e3)) : Y();
		}, 1200);
	}
	async function Zt() {
		if (!I()) return !1;
		let e = await le(I(), "nostrconnect");
		return g(Ct, e, !0), e;
	}
	let Qt = p(() => lt() ? zt(lt()) : ""), $t = p(() => k(z) === "qr" ? k(Qt) || k(kt) : "");
	function en(e) {
		X(), e.preventDefault(), It();
	}
	var tn = et(), nn = x(tn), rn = (e) => {
		var n = Ne(), r = b(n), i = (e) => {
			var t = Me(), n = b(t), r = E(n, !0);
			d(t), y(() => o(r, k(vt))), a(e, t);
		};
		t(r, (e) => {
			k(vt) && e(i);
		});
		var s = T(r, 2), c = (e) => {
			var t = Me(), n = b(t), r = E(n, !0);
			d(t), y(() => o(r, k(yt))), a(e, t);
		};
		t(s, (e) => {
			k(yt) && e(c);
		}), d(n), a(e, n);
	};
	t(nn, (e) => {
		(k(vt) || k(yt)) && e(rn);
	});
	var an = T(nn, 2);
	{
		let n = (e) => {
			var t = c(), n = x(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = p(() => D()("global.close"));
						N(e, _(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return k(t);
							},
							children: (e, t) => {
								var n = Pe();
								a(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				f(n, () => he, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			a(e, t);
		}, i = p(() => dt() ? D()("loginDialog.add_account_title") : ft() ? D()("loginDialog.input_secret") : D()("common.login")), s = p(() => dt() ? D()("loginDialog.add_account_hint") : ft() ? D()("loginDialog.hint_input_secret") : D()("loginDialog.login_methods_hint"));
		me(an, {
			onOpenChange: (e) => !e && pt(),
			get title() {
				return k(i);
			},
			get description() {
				return k(s);
			},
			contentClass: "login-dialog",
			footerVariant: "close-button",
			get open() {
				return P();
			},
			set open(e) {
				P(e);
			},
			footer: n,
			children: (n, i) => {
				var s = Qe(), h = x(s), _ = (e) => {
					var n = Ie(), i = x(n), s = b(i);
					{
						let e = p(() => nt() ? "loading" : "");
						N(s, {
							variant: "primary",
							shape: "square",
							get className() {
								return `parent-client-login-button u-control ${k(e) ?? ""}`;
							},
							onClick: Ht,
							get disabled() {
								return nt();
							},
							children: (e, n) => {
								var r = c(), i = x(r), s = (e) => {
									M(e, {
										text: !0,
										showLoader: !0
									});
								}, l = (e) => {
									var t = Fe(), n = T(x(t), 2), r = E(n, !0);
									y((e) => o(r, e), [() => D()("loginDialog.login_with_parent_client")]), a(e, t);
								};
								t(i, (e) => {
									nt() ? e(s) : e(l, -1);
								}), a(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					var l = T(s, 2), u = E(l, !0);
					d(i);
					var f = T(i, 2), ee = b(f), te = E(ee, !0);
					d(f), y((e, t) => {
						r(l, 1, `parent-client-feedback ${k(H) ? "error" : "info"}`, "svelte-1vy8d2x"), v(l, "role", k(H) ? "alert" : "status"), o(u, e), o(te, t);
					}, [() => k(H) || D()("loginDialog.parent_client_hint"), () => D()("common.or")]), a(e, n);
				};
				t(h, (e) => {
					k(ht) && e(_);
				});
				var S = T(h, 2), C = b(S);
				{
					let e = p(() => it() ? "loading" : ""), n = p(() => it() || !k(mt));
					N(C, {
						variant: "primary",
						shape: "square",
						get className() {
							return `nip07-login-button u-control ${k(e) ?? ""}`;
						},
						onClick: Bt,
						get disabled() {
							return k(n);
						},
						children: (e, n) => {
							var r = c(), i = x(r), s = (e) => {
								M(e, {
									text: !0,
									showLoader: !0
								});
							}, l = (e) => {
								var t = Le(), n = T(x(t), 2), r = E(n, !0);
								y((e) => o(r, e), [() => D()("loginDialog.login_with_extension")]), a(e, t);
							};
							t(i, (e) => {
								it() ? e(s) : e(l, -1);
							}), a(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var w = T(C, 2), ie = (e) => {
					var t = Re(), n = E(t, !0);
					y((e) => {
						r(t, 1, `section-feedback ${k(U) ? "error" : "info"}`, "svelte-1vy8d2x"), v(t, "role", k(U) ? "alert" : "status"), o(n, e);
					}, [() => k(U) || D()("loginDialog.extension_not_found")]), a(e, t);
				};
				t(w, (e) => {
					(k(U) || !k(mt)) && e(ie);
				}), d(S);
				var O = T(S, 2), ae = b(O), A = E(ae, !0);
				d(O);
				var j = T(O, 2), ce = b(j);
				{
					let e = p(() => k($) ? D()("loginDialog.nostrconnect_handshake_started") : k(q) ? D()("loginDialog.nostrconnect_opening_signer") : D()("loginDialog.nostrconnect_open")), n = p(() => k(Q) || !I() || k(q) || k($)), r = p(() => k(Q) && !I() || k(q) || k($) ? "loading" : "");
					N(ce, {
						type: "button",
						variant: "primary",
						shape: "square",
						get ariaLabel() {
							return k(e);
						},
						onClick: Xt,
						get disabled() {
							return k(n);
						},
						get className() {
							return `nostrconnect-open-btn u-control ${k(r) ?? ""}`;
						},
						"data-testid": "nostrconnect-open-button",
						children: (e, n) => {
							var r = c(), i = x(r), s = (e) => {
								{
									let t = p(() => D()("loginDialog.nostrconnect_preparing"));
									M(e, {
										get text() {
											return k(t);
										},
										showLoader: !0
									});
								}
							}, l = (e) => {
								{
									let t = p(() => D()("loginDialog.nostrconnect_handshake_started"));
									M(e, {
										get text() {
											return k(t);
										},
										showLoader: !0
									});
								}
							}, u = (e) => {
								{
									let t = p(() => D()("loginDialog.nostrconnect_opening_signer"));
									M(e, {
										get text() {
											return k(t);
										},
										showLoader: !0
									});
								}
							}, d = (e) => {
								var t = ze(), n = T(x(t), 2), r = E(n, !0);
								y((e) => o(r, e), [() => D()("loginDialog.remote_signer_title")]), a(e, t);
							};
							t(i, (e) => {
								k(Q) && !I() ? e(s) : k($) ? e(l, 1) : k(q) ? e(u, 2) : e(d, -1);
							}), a(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				var le = T(ce, 2), ue = b(le), de = E(ue, !0), fe = T(ue, 2);
				f(fe, () => ge, (n, r) => {
					r(n, {
						get value() {
							return k(z);
						},
						onValueChange: (e) => Wt(e),
						class: "remote-signer-tabs",
						children: (n, r) => {
							var i = Be(), s = x(i);
							f(s, () => _e, (e, t) => {
								t(e, {
									class: "remote-signer-tab-list",
									children: (e, t) => {
										var n = Be(), r = x(n);
										f(r, () => ye, (e, t) => {
											t(e, {
												value: "qr",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-qr-tab",
												children: (e, t) => {
													u();
													var n = m();
													y((e) => o(n, e), [() => D()("loginDialog.nostrconnect_qr_tab")]), a(e, n);
												},
												$$slots: { default: !0 }
											});
										});
										var i = T(r, 2);
										f(i, () => ye, (e, t) => {
											t(e, {
												value: "bunker",
												class: "remote-signer-tab",
												"data-testid": "nostrconnect-bunker-tab",
												children: (e, t) => {
													u();
													var n = m();
													y((e) => o(n, e), [() => D()("loginDialog.nostrconnect_bunker_tab")]), a(e, n);
												},
												$$slots: { default: !0 }
											});
										}), a(e, n);
									},
									$$slots: { default: !0 }
								});
							});
							var h = T(s, 2), _ = (e) => {
								var n = c(), r = x(n);
								f(r, () => ve, (e, n) => {
									n(e, {
										value: "qr",
										class: "remote-signer-panel nostrconnect-panel",
										children: (e, n) => {
											var r = Je(), i = x(r), s = (e) => {
												var t = Ve(), n = b(t);
												{
													let e = p(() => D()("loginDialog.nostrconnect_qr_alt"));
													je(n, {
														get value() {
															return I();
														},
														get label() {
															return k(e);
														}
													});
												}
												d(t), a(e, t);
											}, c = (e) => {
												var t = He(), n = b(t);
												M(n, {
													text: !0,
													showLoader: !0
												}), d(t), a(e, t);
											};
											t(i, (e) => {
												I() ? e(s) : k(Q) && e(c, 1);
											});
											var f = T(i, 2), h = b(f), g = b(h);
											se(g);
											var _ = T(g, 2);
											{
												let e = p(() => D()("common.copySuccess")), t = p(() => k(Q) || !I()), n = p(() => k(Ct) ? D()("loginDialog.nostrconnect_copied") : D()("loginDialog.nostrconnect_copy"));
												N(_, {
													type: "button",
													variant: "copy",
													shape: "circle",
													contentLayout: "icon",
													onClick: Zt,
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
														var n = Ue();
														a(e, n);
													},
													$$slots: { default: !0 }
												});
											}
											d(h), d(f);
											var ne = T(f, 2), re = b(ne), S = (e) => {
												var t = m();
												y((e) => o(t, e), [() => D()("loginDialog.nostrconnect_preparing")]), a(e, t);
											}, C = (e) => {
												{
													let t = p(() => D()("loginDialog.nostrconnect_opening_signer"));
													M(e, {
														get text() {
															return k(t);
														},
														showLoader: !0
													});
												}
											}, w = (e) => {
												{
													let t = p(() => D()("loginDialog.nostrconnect_handshake_started"));
													M(e, {
														get text() {
															return k(t);
														},
														showLoader: !0
													});
												}
											}, ie = (e) => {
												var t = m();
												y((e) => o(t, e), [() => D()("loginDialog.nostrconnect_waiting")]), a(e, t);
											}, O = (e) => {
												var t = m();
												y((e) => o(t, e), [() => D()("loginDialog.nostrconnect_idle")]), a(e, t);
											};
											t(re, (e) => {
												k(Q) ? e(S) : k(q) ? e(C, 1) : k($) ? e(w, 2) : st() ? e(ie, 3) : e(O, -1);
											}), d(ne);
											var ae = T(ne, 2), A = b(ae), j = b(A), ce = b(j), le = E(ce, !0), ue = T(ce, 2);
											{
												let e = p(() => D()("loginDialog.nostrconnect_relay_settings_description"));
												Oe(ue, {
													side: "top",
													sideOffset: 8,
													get ariaLabel() {
														return k(e);
													},
													children: (e, t) => {
														var n = We(), r = b(n), i = E(r, !0), s = T(r, 2), c = E(s, !0), l = T(s, 2), u = E(l, !0);
														d(n), y((e, t, n) => {
															o(i, e), o(c, t), o(u, n);
														}, [
															() => D()("loginDialog.nostrconnect_relay_hint"),
															() => D()("loginDialog.nostrconnect_relay_update_hint"),
															() => D()("loginDialog.nostrconnect_relay_switch_hint")
														]), a(e, n);
													},
													$$slots: { default: !0 }
												});
											}
											d(j), d(A);
											var de = T(A, 2);
											l(de, 21, () => k(B), te, (e, t, n) => {
												var r = Ke(), i = b(r);
												se(i);
												var o = T(i, 2);
												{
													let e = p(() => D()("loginDialog.nostrconnect_remove_relay")), r = p(() => k(B).length === 1 && !k(t).trim());
													N(o, {
														type: "button",
														variant: "close",
														shape: "rounded",
														className: "nostrconnect-remove-relay-btn",
														get ariaLabel() {
															return k(e);
														},
														onClick: () => qt(n),
														get disabled() {
															return k(r);
														},
														children: (e, t) => {
															var n = Ge();
															a(e, n);
														},
														$$slots: { default: !0 }
													});
												}
												d(r), y((e) => {
													oe(i, k(t)), v(i, "placeholder", e);
												}, [() => D()("loginDialog.nostrconnect_relay_placeholder")]), ee("input", i, (e) => Gt(n, e.currentTarget.value)), a(e, r);
											}), d(de);
											var fe = T(de, 2), pe = b(fe);
											N(pe, {
												type: "button",
												variant: "primary",
												onClick: Yt,
												get disabled() {
													return k(jt);
												},
												"data-testid": "nostrconnect-regenerate",
												children: (e, t) => {
													u();
													var n = m();
													y((e) => o(n, e), [() => D()("loginDialog.nostrconnect_generate")]), a(e, n);
												},
												$$slots: { default: !0 }
											});
											var me = T(pe, 2);
											N(me, {
												type: "button",
												variant: "secondary",
												onClick: Kt,
												children: (e, t) => {
													u();
													var n = m();
													y((e) => o(n, e), [() => D()("loginDialog.nostrconnect_add_relay")]), a(e, n);
												},
												$$slots: { default: !0 }
											});
											var he = T(me, 2);
											N(he, {
												type: "button",
												variant: "secondary",
												onClick: Jt,
												"data-testid": "nostrconnect-reset-relays",
												children: (e, t) => {
													u();
													var n = m();
													y((e) => o(n, e), [() => D()("loginDialog.nostrconnect_reset_relays")]), a(e, n);
												},
												$$slots: { default: !0 }
											}), d(fe), d(ae);
											var ge = T(ae, 2), _e = (e) => {
												var t = qe(), n = E(t, !0);
												y(() => o(n, k($t))), a(e, t);
											};
											t(ge, (e) => {
												k($t) && e(_e);
											}), y((e) => {
												oe(g, I() || ""), v(g, "title", I() || ""), o(le, e);
											}, [() => D()("loginDialog.nostrconnect_edit_relays")]), a(e, r);
										},
										$$slots: { default: !0 }
									});
								}), a(e, n);
							}, re = (n) => {
								var r = c(), i = x(r);
								f(i, () => ve, (n, r) => {
									r(n, {
										value: "bunker",
										class: "remote-signer-panel bunker-panel",
										children: (n, r) => {
											var i = Xe(), s = b(i), l = b(s), u = b(l);
											se(u), ne(u, (e) => g(V, e), () => k(V));
											var f = T(u, 2), te = (e) => {
												N(e, {
													variant: "secondary",
													type: "button",
													className: "clear-input-btn",
													get ariaLabel() {
														return k(bt);
													},
													onClick: Nt,
													get onmousedown() {
														return be;
													},
													get ontouchstart() {
														return be;
													},
													get disabled() {
														return at();
													},
													children: (e, t) => {
														var n = Ye();
														a(e, n);
													},
													$$slots: { default: !0 }
												});
											};
											t(f, (e) => {
												k(R).length > 0 && e(te);
											}), d(l);
											var h = T(l, 2);
											{
												let e = p(() => at() ? "loading" : "");
												N(h, {
													variant: "primary",
													shape: "square",
													type: "submit",
													get disabled() {
														return at();
													},
													get className() {
														return `bunker-connect-btn u-control ${k(e) ?? ""}`;
													},
													children: (e, n) => {
														var r = c(), i = x(r), s = (e) => {
															M(e, { showLoader: !0 });
														}, l = (e) => {
															var t = m();
															y((e) => o(t, e), [() => D()("loginDialog.bunker_connect")]), a(e, t);
														};
														t(i, (e) => {
															at() ? e(s) : e(l, -1);
														}), a(e, r);
													},
													$$slots: { default: !0 }
												});
											}
											d(s);
											var _ = T(s, 2), v = (e) => {
												var t = qe(), n = E(t, !0);
												y(() => o(n, k(W))), a(e, t);
											};
											t(_, (e) => {
												k(W) && e(v);
											}), d(i), y(() => {
												oe(u, k(R)), u.disabled = at();
											}), e("submit", i, (e) => {
												e.preventDefault(), Ut();
											}), ee("input", u, Mt), a(n, i);
										},
										$$slots: { default: !0 }
									});
								}), a(n, r);
							};
							t(h, (e) => {
								k(z) === "qr" ? e(_) : e(re, -1);
							}), a(n, i);
						},
						$$slots: { default: !0 }
					});
				}), d(le), d(j);
				var pe = T(j, 2), me = (n) => {
					var r = Ze(), i = x(r), s = b(i), l = E(s, !0);
					d(i);
					var u = T(i, 2), f = b(u), te = T(b(f), 2), h = E(te, !0);
					d(f);
					var _ = T(f, 2), S = b(_), C = b(S), w = b(C);
					se(w), ne(w, (e) => g(L, e), () => k(L));
					var ie = T(w, 2), O = (e) => {
						N(e, {
							variant: "secondary",
							type: "button",
							className: "clear-input-btn",
							get ariaLabel() {
								return k(bt);
							},
							onClick: Pt,
							get onmousedown() {
								return be;
							},
							get ontouchstart() {
								return be;
							},
							children: (e, t) => {
								var n = Ye();
								a(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					t(ie, (e) => {
						F().length > 0 && e(O);
					}), d(C);
					var ae = T(C, 2);
					{
						let e = p(() => k(K) ? "loading" : "");
						N(ae, {
							variant: "primary",
							shape: "square",
							type: "submit",
							get disabled() {
								return k(K);
							},
							get className() {
								return `save-btn u-control ${k(e) ?? ""}`;
							},
							children: (e, n) => {
								var r = c(), i = x(r), s = (e) => {
									M(e, { showLoader: !0 });
								}, l = (e) => {
									var t = m();
									y((e) => o(t, e), [() => D()("loginDialog.save")]), a(e, t);
								};
								t(i, (e) => {
									k(K) ? e(s) : e(l, -1);
								}), a(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					d(S);
					var oe = T(S, 2), A = (e) => {
						var t = qe(), n = E(t, !0);
						y(() => o(n, k(G))), a(e, t);
					};
					t(oe, (e) => {
						k(G) && e(A);
					}), d(_), d(u), y((e, t, n) => {
						o(l, e), o(h, t), v(w, "title", n);
					}, [
						() => D()("common.or"),
						() => D()("loginDialog.input_secret"),
						() => D()("loginDialog.hint_input_secret")
					]), e("submit", _, en), ee("input", w, () => {
						g(G, ""), k(L)?.setCustomValidity("");
					}), re(w, F), a(n, r);
				};
				t(pe, (e) => {
					ft() && e(me);
				}), y((e, t) => {
					o(A, e), o(de, t);
				}, [() => D()("common.or"), () => D()("loginDialog.nostrconnect_input_title")]), a(n, s);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var on = T(an, 2);
	fe(on, {
		get show() {
			return k(wt);
		},
		variant: "top-right",
		children: (e, t) => {
			var n = $e(), r = E(n, !0);
			y((e) => o(r, e), [() => D()("loginDialog.nostrconnect_direct_open_hint")]), a(e, n);
		},
		$$slots: { default: !0 }
	}), a(s, tn), i(), ke();
}
h(["input"]);
export { nt as default };
