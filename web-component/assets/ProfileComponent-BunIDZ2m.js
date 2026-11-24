import { B as e, Dt as t, E as n, Et as r, G as i, H as a, K as o, L as s, Nt as c, P as l, Q as u, St as d, X as f, Z as p, _t as m, a as h, b as ee, ct as g, dt as _, ft as v, ht as y, j as b, lt as x, mt as S, o as C, pt as w, q as T, r as E, rt as D, s as O, yt as k } from "./index-client-DEFG3Gqk.js";
import { Z as A } from "./LoadingPlaceholder-YrD8D_td.js";
import { r as j } from "./authStore.svelte-DkMZvUSe.js";
import { C as M, S as N, a as P } from "./clipboardUtils-CSGkJuUA.js";
import { t as F } from "./Button-Cqrg0_jX.js";
import { t as I } from "./useDialogHistory.svelte-pVteCIez.js";
import { t as L } from "./ProfileAvatar-eo19xgt6.js";
import { t as R } from "./DialogWrapper-DlNV_DwH.js";
import { t as z } from "./dialog-close-DFGIFxm7.js";
import { Z as B } from "./App-CW2Ynbk9.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/ProfileComponent.svelte
var te = T("<div class=\"xmark-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), ne = T("<span class=\"account-type-badge public-key-status svelte-1qzltz2\"> </span>"), V = T("<div class=\"copy-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), re = T("<div class=\"profile-info-row svelte-1qzltz2\"><div class=\"profile-info-content svelte-1qzltz2\"><span class=\"profile-info-text svelte-1qzltz2\"> </span> <!></div></div>"), ie = T("<div class=\"logout-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span> </span>", 1), ae = T("<div class=\"recovery-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"recovery-description svelte-1qzltz2\"> </div> <!></div>"), oe = T("<span class=\"active-badge svelte-1qzltz2\"> </span>"), se = T("<div><div class=\"account-row svelte-1qzltz2\"><button class=\"account-info-button svelte-1qzltz2\"><!> <div class=\"account-details svelte-1qzltz2\"><div class=\"account-name-row svelte-1qzltz2\"><span class=\"account-name svelte-1qzltz2\"> </span> <span class=\"account-npub-short svelte-1qzltz2\"> </span></div> <span class=\"account-type-badge svelte-1qzltz2\"><!></span></div> <!></button> <button class=\"account-logout-button svelte-1qzltz2\"><div class=\"logout-icon svg-icon svelte-1qzltz2\"></div></button></div></div>"), ce = T("<div class=\"plus-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span class=\"add-account-label svelte-1qzltz2\"> </span>", 1), le = T("<div class=\"accounts-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"account-list svelte-1qzltz2\"></div> <!></div>"), ue = T("<div class=\"profile-container svelte-1qzltz2\"><div class=\"current-account-section svelte-1qzltz2\"><div class=\"profile-summary svelte-1qzltz2\"><!> <div class=\"profile-name svelte-1qzltz2\"> </div></div> <!> <div class=\"nostr-ids svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"profile-info-container svelte-1qzltz2\"><!> <!></div></div></div> <!> <!></div>"), de = {
	hash: "svelte-1qzltz2",
	code: ".xmark-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.profile-container.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;gap:28px;width:100%;height:100%;}.current-account-section.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:16px;padding:8px 0;border-bottom:1px solid var(--border-hr);}.profile-summary.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:10px;.profile-image-container {width:80px;height:80px;border-radius:50%;overflow:hidden;}.profile-image {width:100%;height:100%;object-fit:cover;}.profile-image-placeholder {width:100%;height:100%;}.profile-name:where(.svelte-1qzltz2) {font-size:1.375rem;font-weight:600;color:var(--text);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}.nostr-ids.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;min-width:0;.profile-info-container:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:6px;width:100%;min-width:0;.profile-info-row:where(.svelte-1qzltz2) {min-height:50px;width:100%;min-width:0;display:flex;flex-direction:column;.profile-info-content:where(.svelte-1qzltz2) {display:flex;align-items:stretch;background-color:var(--btn-bg);border-radius:8px;overflow:hidden;width:100%;min-width:0;.profile-info-text:where(.svelte-1qzltz2) {flex:1 1 auto;min-width:0;font-family:monospace;font-size:1rem;line-height:1.2;color:var(--text);margin:6px 0 6px 8px;overflow-wrap:anywhere;}}}}}.copy-button {height:auto;width:44px;flex:0 0 44px;background-color:var(--btn-bg);.copy-icon.svelte-1qzltz2 {width:20px;height:20px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.profile-info-label.svelte-1qzltz2 {font-size:0.875rem;font-weight:500;color:var(--text-light);}.accounts-section.svelte-1qzltz2 {display:flex;flex-direction:column;gap:8px;width:100%;.account-list:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:4px;}.account-item:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:stretch;gap:8px;padding:0;border-radius:8px;transition:background-color 0.15s;.account-row:where(.svelte-1qzltz2) {display:flex;align-items:center;}&.active {:disabled {opacity:1;}.account-info-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-end:none;}.account-logout-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-start:none;}}}.account-avatar {width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;}.account-avatar-img {width:100%;height:100%;object-fit:cover;}.account-avatar-placeholder {width:100%;height:100%;}.account-details:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:flex-start;min-width:0;width:100%;gap:4px;}.account-name-row:where(.svelte-1qzltz2) {display:flex;align-items:baseline;gap:6px;min-width:0;width:100%;}.account-name:where(.svelte-1qzltz2) {font-size:1rem;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex-shrink:1;}.account-npub-short:where(.svelte-1qzltz2) {font-size:0.7rem;color:var(--text-light);font-family:monospace;white-space:nowrap;flex-shrink:0;}.account-type-badge:where(.svelte-1qzltz2) {font-size:0.75rem;color:var(--text-light);}.active-badge:where(.svelte-1qzltz2) {font-size:0.875rem;font-weight:600;color:var(--theme);margin-inline-start:auto;flex-shrink:0;}.account-logout-button:where(.svelte-1qzltz2) {display:flex;align-items:center;justify-content:center;width:50px;height:50px;background-color:var(--btn-bg);border:solid 1px var(--btn-bg);border-inline-start:none;border-radius:0 8px 8px 0;cursor:pointer;flex-shrink:0;color:var(--text-light);transition:background-color 0.15s,\n                color 0.15s;\n\n            @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:rgba(239, 68, 68, 0.1);color:#ef4444;}\n            }&:disabled {opacity:0.4;cursor:default;}}button.add-account-btn {display:flex;align-items:center;gap:4px;width:100%;height:50px;margin-top:4px;}.add-account-label:where(.svelte-1qzltz2) {font-size:1rem;}}.logout-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6c6f676f75745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;}.public-key-status.svelte-1qzltz2 {align-self:flex-start;}.recovery-section.svelte-1qzltz2 {width:100%;display:flex;flex-direction:column;gap:10px;padding:10px;border:1px solid var(--border);border-radius:10px;background:color-mix(in srgb, var(--btn-bg), transparent 18%);.recovery-description:where(.svelte-1qzltz2) {color:var(--text-light);font-size:0.9rem;line-height:1.4;}.recovery-logout-btn {width:100%;min-height:44px;display:inline-flex;align-items:center;gap:8px;}}.account-info-button.svelte-1qzltz2 {display:flex;align-items:center;gap:8px;flex:1;min-width:0;height:50px;padding-inline-start:8px;background-color:var(--btn-bg);border-radius:8px 0 0 8px;cursor:pointer;color:inherit;font:inherit;&:disabled {cursor:default;}}.plus-icon.svg-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6164645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;flex-shrink:0;}"
};
function H(p, T) {
	t(T, !0), b(p, de);
	let H = () => O(A, "$_", fe), [fe, pe] = C();
	function me(e) {
		try {
			let t = N(e);
			return M(t, 9, 4);
		} catch {
			return "";
		}
	}
	function he(e) {
		try {
			return N(e);
		} catch {
			return "";
		}
	}
	let U = E(T, "show", 15, !1), W = E(T, "fallbackRecoveryPubkeyHex", 3, ""), G = E(T, "accounts", 19, () => []), ge = E(T, "accountProfiles", 19, () => /* @__PURE__ */ new Map()), K = E(T, "isLoggingOut", 3, !1), q = E(T, "isSwitchingAccount", 3, !1), J = E(T, "profilePending", 3, !1);
	function Y() {
		U(!1), T.onClose?.();
	}
	I(() => U(), Y, !0);
	let _e = d(() => B.value), X = d(() => j.value), Z = k(y(B.value)), Q = d(() => D(X)?.pubkey || W() || ""), $ = d(() => D(Z).npub || (D(Q) ? he(D(Q)) : "")), ve = d(() => D(Z).displayName || D(Z).name ? D(Z).displayName || D(Z).name : H()("profileDialog.profile_image_alt")), ye = d(() => H()("profileDialog.profile_image_fallback")), be = d(() => G().length === 0 && !!D(Q));
	x(() => {
		!K() && D(_e) && m(Z, D(_e), !0);
	});
	function xe(e) {
		let t = e || D(X)?.pubkey || W() || "";
		t && T.onLogout?.(t);
	}
	function Se(e) {
		T.onSwitchAccount?.(e), Y();
	}
	async function Ce(e, t) {
		return P(e, t, navigator, window);
	}
	{
		let t = (e) => {
			var t = o(), n = v(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = d(() => H()("global.close"));
						F(e, h(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return D(t);
							},
							children: (e, t) => {
								var n = te();
								i(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				l(n, () => z, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			i(e, t);
		}, r = d(() => H()("profileDialog.title")), m = d(() => H()("profileDialog.npub"));
		R(p, {
			onOpenChange: (e) => !e && Y(),
			get title() {
				return D(r);
			},
			get description() {
				return D(m);
			},
			contentClass: "profile-dialog",
			footerVariant: "close-button",
			get open() {
				return U();
			},
			set open(e) {
				U(e);
			},
			footer: t,
			children: (t, r) => {
				var o = ue(), l = _(o), p = _(l), m = _(p);
				L(m, {
					get pubkeyHex() {
						return D(Q);
					},
					get displayName() {
						return D(Z).displayName;
					},
					get name() {
						return D(Z).name;
					},
					showLoadingIndicator: !0,
					get pending() {
						return J();
					},
					get src() {
						return D(Z).picture;
					},
					get alt() {
						return D(ve);
					},
					rootClassName: "profile-image-container",
					imageClassName: "profile-image",
					fallbackClassName: "profile-image-placeholder",
					get fallbackAriaLabel() {
						return D(ye);
					}
				});
				var h = S(m, 2), y = w(h, !0);
				c(p);
				var b = S(p, 2), x = (e) => {
					var t = ne(), n = w(t, !0);
					g((e) => a(n, e), [() => H()("profileDialog.public_key_login_active")]), i(e, t);
				};
				e(b, (e) => {
					D(X).type === "npub" && e(x);
				});
				var C = S(b, 2), E = _(C), O = w(E, !0), k = S(E, 2), A = _(k), j = (e) => {
					var t = re(), n = _(t), r = _(n), o = w(r, !0), s = S(r, 2);
					{
						let e = d(() => H()("profileDialog.copy_npub")), t = d(() => H()("common.copySuccess"));
						F(s, {
							shape: "square",
							className: "copy-button",
							onClick: () => Ce(D($), "npub"),
							get ariaLabel() {
								return D(e);
							},
							get floatingMessage() {
								return D(t);
							},
							children: (e, t) => {
								var n = V();
								i(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					c(n), c(t), g(() => a(o, D($))), i(e, t);
				};
				e(A, (e) => {
					D($) && e(j);
				});
				var M = S(A, 2), N = (e) => {
					var t = re(), n = _(t), r = _(n), o = w(r, !0), s = S(r, 2);
					{
						let e = d(() => H()("profileDialog.copy_nprofile")), t = d(() => H()("common.copySuccess"));
						F(s, {
							className: "copy-button",
							onClick: () => Ce(D(Z).nprofile, "nprofile"),
							get ariaLabel() {
								return D(e);
							},
							get floatingMessage() {
								return D(t);
							},
							children: (e, t) => {
								var n = V();
								i(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					c(n), c(t), g(() => a(o, D(Z).nprofile)), i(e, t);
				};
				e(M, (e) => {
					D(Z).nprofile && e(N);
				}), c(k), c(C), c(l);
				var P = S(l, 2), I = (e) => {
					var t = ae(), n = _(t), r = w(n, !0), o = S(n, 2), s = w(o, !0), l = S(o, 2);
					{
						let e = d(() => K() || q()), t = d(() => H()("profileDialog.recovery_logout_current"));
						F(l, {
							className: "recovery-logout-btn",
							variant: "danger",
							shape: "rounded",
							get disabled() {
								return D(e);
							},
							onClick: () => xe(D(Q)),
							get ariaLabel() {
								return D(t);
							},
							children: (e, t) => {
								var n = ie(), r = S(v(n), 2), o = w(r, !0);
								g((e) => a(o, e), [() => H()("profileDialog.recovery_logout_current")]), i(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					c(t), g((e, t) => {
						a(r, e), a(s, t);
					}, [() => H()("profileDialog.recovery_title"), () => H()("profileDialog.recovery_description")]), i(e, t);
				};
				e(P, (e) => {
					D(be) && e(I);
				});
				var R = S(P, 2), z = (t) => {
					var r = le(), o = _(r), l = w(o, !0), p = S(o, 2);
					s(p, 21, G, (e) => e.pubkeyHex, (t, r) => {
						let o = d(() => D(r).pubkeyHex === D(X)?.pubkey), s = d(() => ge().get(D(r).pubkeyHex));
						var l = se();
						let p;
						var m = _(l), h = _(m), v = _(h);
						{
							let e = d(() => D(s)?.displayName), t = d(() => D(s)?.name), n = d(() => D(o) && J()), i = d(() => D(s)?.picture), a = d(() => D(s)?.displayName || D(s)?.name || H()("profileDialog.profile_image_alt"));
							L(v, {
								get pubkeyHex() {
									return D(r).pubkeyHex;
								},
								get displayName() {
									return D(e);
								},
								get name() {
									return D(t);
								},
								showLoadingIndicator: !0,
								get pending() {
									return D(n);
								},
								get src() {
									return D(i);
								},
								get alt() {
									return D(a);
								},
								rootClassName: "account-avatar",
								imageClassName: "account-avatar-img",
								fallbackClassName: "account-avatar-placeholder",
								get fallbackAriaLabel() {
									return D(ye);
								}
							});
						}
						var y = S(v, 2), b = _(y), x = _(b), C = w(x, !0), T = S(x, 2), E = w(T, !0);
						c(b);
						var O = S(b, 2), k = _(O), A = (e) => {
							var t = f();
							g((e) => a(t, e), [() => H()("profileDialog.login_method_nsec")]), i(e, t);
						}, j = (e) => {
							var t = f();
							g((e) => a(t, e), [() => H()("profileDialog.login_method_nip07")]), i(e, t);
						}, M = (e) => {
							var t = f();
							g((e) => a(t, e), [() => H()("profileDialog.login_method_nip46")]), i(e, t);
						}, N = (e) => {
							var t = f("Nosskey");
							i(e, t);
						}, P = (e) => {
							var t = f();
							g((e) => a(t, e), [() => H()("profileDialog.login_method_public_key")]), i(e, t);
						}, F = (e) => {
							var t = f();
							g((e) => a(t, e), [() => H()("profileDialog.login_method_parent_client")]), i(e, t);
						};
						e(k, (e) => {
							D(r).type === "nsec" ? e(A) : D(r).type === "nip07" ? e(j, 1) : D(r).type === "nip46" ? e(M, 2) : D(r).type === "nosskey" ? e(N, 3) : D(r).type === "npub" ? e(P, 4) : D(r).type === "parentClient" && e(F, 5);
						}), c(O), c(y);
						var I = S(y, 2), R = (e) => {
							var t = oe(), n = w(t, !0);
							g((e) => a(n, e), [() => H()("profileDialog.active")]), i(e, t);
						};
						e(I, (e) => {
							D(o) && e(R);
						}), c(h);
						var z = S(h, 2);
						c(m), c(l), g((e, t, i) => {
							p = n(l, 1, "account-item svelte-1qzltz2", null, p, { active: D(o) }), h.disabled = D(o) || q() || D(r).type === "nosskey", a(C, e), a(E, t), z.disabled = K() || q(), ee(z, "aria-label", i);
						}, [
							() => D(s)?.displayName || D(s)?.name || H()("profileDialog.anonymous"),
							() => me(D(r).pubkeyHex),
							() => H()("profileDialog.logout_account")
						]), u("click", h, () => {
							!D(o) && !q() && D(r).type !== "nosskey" && Se(D(r).pubkeyHex);
						}), u("click", z, () => xe(D(r).pubkeyHex)), i(t, l);
					}), c(p);
					var m = S(p, 2);
					F(m, {
						onClick: () => T.onAddAccount?.(),
						className: "add-account-btn",
						variant: "primary",
						shape: "square",
						children: (e, t) => {
							var n = ce(), r = S(v(n), 2), o = w(r, !0);
							g((e) => a(o, e), [() => H()("profileDialog.add_account")]), i(e, n);
						},
						$$slots: { default: !0 }
					}), c(r), g((e) => a(l, e), [() => H()("profileDialog.accounts")]), i(t, r);
				};
				e(R, (e) => {
					G().length > 0 && e(z);
				}), c(o), g((e, t) => {
					a(y, e), a(O, t);
				}, [() => D(Z).displayName || D(Z).name || H()("profileDialog.anonymous"), () => H()("profileDialog.npub")]), i(t, o);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	r(), pe();
}
p(["click"]);
export { H as default };
