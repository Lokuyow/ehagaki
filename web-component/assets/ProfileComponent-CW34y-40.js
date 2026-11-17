import { A as e, Et as t, G as n, I as r, K as i, Mt as a, N as o, T as s, Tt as c, V as l, W as u, X as d, Y as f, Z as p, a as m, ct as h, dt as g, ft as _, gt as v, mt as y, nt as b, o as x, pt as S, r as C, s as w, st as T, ut as E, vt as D, xt as O, y as ee, z as k } from "./index-client-XkLzkVYC.js";
import { pt as A } from "./LoadingPlaceholder-lit91akO.js";
import { r as j } from "./authStore.svelte-DWJhnXxr.js";
import { nt as M, rt as N, s as P } from "./appUtils-BRia-Jm6.js";
import { a as F } from "./clipboardUtils-DL4u_EPs.js";
import { t as I } from "./useDialogHistory.svelte-BgJftJRE.js";
import { t as te } from "./DialogWrapper-DOH4rn3S.js";
import { t as ne } from "./dialog-close-erjPpz45.js";
import { Q as L, et as R } from "./App-D7-eoDXE.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/ProfileComponent.svelte
var re = i("<div class=\"xmark-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), z = i("<div class=\"copy-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), B = i("<div class=\"profile-info-row svelte-1qzltz2\"><div class=\"profile-info-content svelte-1qzltz2\"><span class=\"profile-info-text svelte-1qzltz2\"> </span> <!></div></div>"), ie = i("<div class=\"logout-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span> </span>", 1), ae = i("<div class=\"recovery-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"recovery-description svelte-1qzltz2\"> </div> <!></div>"), oe = i("<span class=\"active-badge svelte-1qzltz2\"> </span>"), se = i("<div><div class=\"account-row svelte-1qzltz2\"><button class=\"account-info-button svelte-1qzltz2\"><!> <div class=\"account-details svelte-1qzltz2\"><div class=\"account-name-row svelte-1qzltz2\"><span class=\"account-name svelte-1qzltz2\"> </span> <span class=\"account-npub-short svelte-1qzltz2\"> </span></div> <span class=\"account-type-badge svelte-1qzltz2\"><!></span></div> <!></button> <button class=\"account-logout-button svelte-1qzltz2\"><div class=\"logout-icon svg-icon svelte-1qzltz2\"></div></button></div></div>"), ce = i("<div class=\"plus-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span class=\"add-account-label svelte-1qzltz2\"> </span>", 1), le = i("<div class=\"accounts-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"account-list svelte-1qzltz2\"></div> <!></div>"), ue = i("<div class=\"profile-container svelte-1qzltz2\"><div class=\"current-account-section svelte-1qzltz2\"><div class=\"profile-summary svelte-1qzltz2\"><!> <div class=\"profile-name svelte-1qzltz2\"> </div></div> <div class=\"nostr-ids svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"profile-info-container svelte-1qzltz2\"><!> <!></div></div></div> <!> <!></div>"), de = {
	hash: "svelte-1qzltz2",
	code: ".xmark-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.profile-container.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;gap:28px;width:100%;height:100%;}.current-account-section.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:16px;padding:8px 0;border-bottom:1px solid var(--border-hr);}.profile-summary.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:10px;.profile-image-container {width:80px;height:80px;border-radius:50%;overflow:hidden;}.profile-image {width:100%;height:100%;object-fit:cover;}.profile-image-placeholder {width:100%;height:100%;}.profile-name:where(.svelte-1qzltz2) {font-size:1.375rem;font-weight:600;color:var(--text);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}.nostr-ids.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;min-width:0;.profile-info-container:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:6px;width:100%;min-width:0;.profile-info-row:where(.svelte-1qzltz2) {min-height:50px;width:100%;min-width:0;display:flex;flex-direction:column;.profile-info-content:where(.svelte-1qzltz2) {display:flex;align-items:stretch;background-color:var(--btn-bg);border-radius:8px;overflow:hidden;width:100%;min-width:0;.profile-info-text:where(.svelte-1qzltz2) {flex:1 1 auto;min-width:0;font-family:monospace;font-size:1rem;line-height:1.2;color:var(--text);margin:6px 0 6px 8px;overflow-wrap:anywhere;}}}}}.copy-button {height:auto;width:44px;flex:0 0 44px;background-color:var(--btn-bg);.copy-icon.svelte-1qzltz2 {width:20px;height:20px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.profile-info-label.svelte-1qzltz2 {font-size:0.875rem;font-weight:500;color:var(--text-light);}.accounts-section.svelte-1qzltz2 {display:flex;flex-direction:column;gap:8px;width:100%;.account-list:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:4px;}.account-item:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:stretch;gap:8px;padding:0;border-radius:8px;transition:background-color 0.15s;.account-row:where(.svelte-1qzltz2) {display:flex;align-items:center;}&.active {:disabled {opacity:1;}.account-info-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-end:none;}.account-logout-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-start:none;}}}.account-avatar {width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;}.account-avatar-img {width:100%;height:100%;object-fit:cover;}.account-avatar-placeholder {width:100%;height:100%;}.account-details:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:flex-start;min-width:0;width:100%;gap:4px;}.account-name-row:where(.svelte-1qzltz2) {display:flex;align-items:baseline;gap:6px;min-width:0;width:100%;}.account-name:where(.svelte-1qzltz2) {font-size:1rem;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex-shrink:1;}.account-npub-short:where(.svelte-1qzltz2) {font-size:0.7rem;color:var(--text-light);font-family:monospace;white-space:nowrap;flex-shrink:0;}.account-type-badge:where(.svelte-1qzltz2) {font-size:0.75rem;color:var(--text-light);}.active-badge:where(.svelte-1qzltz2) {font-size:0.875rem;font-weight:600;color:var(--theme);margin-inline-start:auto;flex-shrink:0;}.account-logout-button:where(.svelte-1qzltz2) {display:flex;align-items:center;justify-content:center;width:50px;height:50px;background-color:var(--btn-bg);border:solid 1px var(--btn-bg);border-inline-start:none;border-radius:0 8px 8px 0;cursor:pointer;flex-shrink:0;color:var(--text-light);transition:background-color 0.15s,\n                color 0.15s;\n\n            @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:rgba(239, 68, 68, 0.1);color:#ef4444;}\n            }&:disabled {opacity:0.4;cursor:default;}}button.add-account-btn {display:flex;align-items:center;gap:4px;width:100%;height:50px;margin-top:4px;}.add-account-label:where(.svelte-1qzltz2) {font-size:1rem;}}.logout-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6c6f676f75745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;}.recovery-section.svelte-1qzltz2 {width:100%;display:flex;flex-direction:column;gap:10px;padding:10px;border:1px solid var(--border);border-radius:10px;background:color-mix(in srgb, var(--btn-bg), transparent 18%);.recovery-description:where(.svelte-1qzltz2) {color:var(--text-light);font-size:0.9rem;line-height:1.4;}.recovery-logout-btn {width:100%;min-height:44px;display:inline-flex;align-items:center;gap:8px;}}.account-info-button.svelte-1qzltz2 {display:flex;align-items:center;gap:8px;flex:1;min-width:0;height:50px;padding-inline-start:8px;background-color:var(--btn-bg);border-radius:8px 0 0 8px;cursor:pointer;color:inherit;font:inherit;&:disabled {cursor:default;}}.plus-icon.svg-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6164645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;flex-shrink:0;}"
};
function V(i, d) {
	t(d, !0), e(i, de);
	let V = () => w(A, "$_", fe), [fe, pe] = x();
	function me(e) {
		try {
			let t = M(e);
			return N(t, 9, 4);
		} catch {
			return "";
		}
	}
	function he(e) {
		try {
			return M(e);
		} catch {
			return "";
		}
	}
	let H = C(d, "show", 15, !1), U = C(d, "fallbackRecoveryPubkeyHex", 3, ""), W = C(d, "accounts", 19, () => []), ge = C(d, "accountProfiles", 19, () => /* @__PURE__ */ new Map()), G = C(d, "isLoggingOut", 3, !1), K = C(d, "isSwitchingAccount", 3, !1), q = C(d, "profilePending", 3, !1);
	function J() {
		H(!1), d.onClose?.();
	}
	I(() => H(), J, !0);
	let Y = O(() => L.value), X = O(() => j.value), Z = D(y(L.value)), Q = O(() => b(X)?.pubkey || U() || ""), $ = O(() => b(Z).npub || (b(Q) ? he(b(Q)) : "")), _e = O(() => b(Z).displayName || b(Z).name ? b(Z).displayName || b(Z).name : V()("profileDialog.profile_image_alt")), ve = O(() => V()("profileDialog.profile_image_fallback")), ye = O(() => W().length === 0 && !!b(Q));
	h(() => {
		!G() && b(Y) && v(Z, b(Y), !0);
	});
	function be(e) {
		let t = e || b(X)?.pubkey || U() || "";
		t && d.onLogout?.(t);
	}
	function xe(e) {
		d.onSwitchAccount?.(e), J();
	}
	async function Se(e, t) {
		return F(e, t, navigator, window);
	}
	{
		let e = (e) => {
			var t = n(), r = g(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = O(() => V()("global.close"));
						P(e, m(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return b(t);
							},
							children: (e, t) => {
								var n = re();
								u(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				o(r, () => ne, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			u(e, t);
		}, t = O(() => V()("profileDialog.title")), c = O(() => V()("profileDialog.npub"));
		te(i, {
			onOpenChange: (e) => !e && J(),
			get title() {
				return b(t);
			},
			get description() {
				return b(c);
			},
			contentClass: "profile-dialog",
			footerVariant: "close-button",
			get open() {
				return H();
			},
			set open(e) {
				H(e);
			},
			footer: e,
			children: (e, t) => {
				var n = ue(), i = E(n), o = E(i), c = E(o);
				R(c, {
					get pubkeyHex() {
						return b(Q);
					},
					get displayName() {
						return b(Z).displayName;
					},
					get name() {
						return b(Z).name;
					},
					showLoadingIndicator: !0,
					get pending() {
						return q();
					},
					get src() {
						return b(Z).picture;
					},
					get alt() {
						return b(_e);
					},
					rootClassName: "profile-image-container",
					imageClassName: "profile-image",
					fallbackClassName: "profile-image-placeholder",
					get fallbackAriaLabel() {
						return b(ve);
					}
				});
				var m = S(c, 2), h = _(m, !0);
				a(o);
				var v = S(o, 2), y = E(v), x = _(y, !0), C = S(y, 2), w = E(C), D = (e) => {
					var t = B(), n = E(t), r = E(n), i = _(r, !0), o = S(r, 2);
					{
						let e = O(() => V()("profileDialog.copy_npub")), t = O(() => V()("common.copySuccess"));
						P(o, {
							shape: "square",
							className: "copy-button",
							onClick: () => Se(b($), "npub"),
							get ariaLabel() {
								return b(e);
							},
							get floatingMessage() {
								return b(t);
							},
							children: (e, t) => {
								var n = z();
								u(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					a(n), a(t), T(() => l(i, b($))), u(e, t);
				};
				k(w, (e) => {
					b($) && e(D);
				});
				var A = S(w, 2), j = (e) => {
					var t = B(), n = E(t), r = E(n), i = _(r, !0), o = S(r, 2);
					{
						let e = O(() => V()("profileDialog.copy_nprofile")), t = O(() => V()("common.copySuccess"));
						P(o, {
							className: "copy-button",
							onClick: () => Se(b(Z).nprofile, "nprofile"),
							get ariaLabel() {
								return b(e);
							},
							get floatingMessage() {
								return b(t);
							},
							children: (e, t) => {
								var n = z();
								u(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					a(n), a(t), T(() => l(i, b(Z).nprofile)), u(e, t);
				};
				k(A, (e) => {
					b(Z).nprofile && e(j);
				}), a(C), a(v), a(i);
				var M = S(i, 2), N = (e) => {
					var t = ae(), n = E(t), r = _(n, !0), i = S(n, 2), o = _(i, !0), s = S(i, 2);
					{
						let e = O(() => G() || K()), t = O(() => V()("profileDialog.recovery_logout_current"));
						P(s, {
							className: "recovery-logout-btn",
							variant: "danger",
							shape: "rounded",
							get disabled() {
								return b(e);
							},
							onClick: () => be(b(Q)),
							get ariaLabel() {
								return b(t);
							},
							children: (e, t) => {
								var n = ie(), r = S(g(n), 2), i = _(r, !0);
								T((e) => l(i, e), [() => V()("profileDialog.recovery_logout_current")]), u(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					a(t), T((e, t) => {
						l(r, e), l(o, t);
					}, [() => V()("profileDialog.recovery_title"), () => V()("profileDialog.recovery_description")]), u(e, t);
				};
				k(M, (e) => {
					b(ye) && e(N);
				});
				var F = S(M, 2), I = (e) => {
					var t = le(), n = E(t), i = _(n, !0), o = S(n, 2);
					r(o, 21, W, (e) => e.pubkeyHex, (e, t) => {
						let n = O(() => b(t).pubkeyHex === b(X)?.pubkey), r = O(() => ge().get(b(t).pubkeyHex));
						var i = se();
						let o;
						var c = E(i), d = E(c), m = E(d);
						{
							let e = O(() => b(r)?.displayName), i = O(() => b(r)?.name), a = O(() => b(n) && q()), o = O(() => b(r)?.picture), s = O(() => b(r)?.displayName || b(r)?.name || V()("profileDialog.profile_image_alt"));
							R(m, {
								get pubkeyHex() {
									return b(t).pubkeyHex;
								},
								get displayName() {
									return b(e);
								},
								get name() {
									return b(i);
								},
								showLoadingIndicator: !0,
								get pending() {
									return b(a);
								},
								get src() {
									return b(o);
								},
								get alt() {
									return b(s);
								},
								rootClassName: "account-avatar",
								imageClassName: "account-avatar-img",
								fallbackClassName: "account-avatar-placeholder",
								get fallbackAriaLabel() {
									return b(ve);
								}
							});
						}
						var h = S(m, 2), g = E(h), v = E(g), y = _(v, !0), x = S(v, 2), C = _(x, !0);
						a(g);
						var w = S(g, 2), D = E(w), A = (e) => {
							var t = f();
							T((e) => l(t, e), [() => V()("profileDialog.login_method_nsec")]), u(e, t);
						}, j = (e) => {
							var t = f();
							T((e) => l(t, e), [() => V()("profileDialog.login_method_nip07")]), u(e, t);
						}, M = (e) => {
							var t = f();
							T((e) => l(t, e), [() => V()("profileDialog.login_method_nip46")]), u(e, t);
						}, N = (e) => {
							var t = f();
							T((e) => l(t, e), [() => V()("profileDialog.login_method_parent_client")]), u(e, t);
						};
						k(D, (e) => {
							b(t).type === "nsec" ? e(A) : b(t).type === "nip07" ? e(j, 1) : b(t).type === "nip46" ? e(M, 2) : b(t).type === "parentClient" && e(N, 3);
						}), a(w), a(h);
						var P = S(h, 2), F = (e) => {
							var t = oe(), n = _(t, !0);
							T((e) => l(n, e), [() => V()("profileDialog.active")]), u(e, t);
						};
						k(P, (e) => {
							b(n) && e(F);
						}), a(d);
						var I = S(d, 2);
						a(c), a(i), T((e, t, r) => {
							o = s(i, 1, "account-item svelte-1qzltz2", null, o, { active: b(n) }), d.disabled = b(n) || K(), l(y, e), l(C, t), I.disabled = G() || K(), ee(I, "aria-label", r);
						}, [
							() => b(r)?.displayName || b(r)?.name || V()("profileDialog.anonymous"),
							() => me(b(t).pubkeyHex),
							() => V()("profileDialog.logout_account")
						]), p("click", d, () => {
							!b(n) && !K() && xe(b(t).pubkeyHex);
						}), p("click", I, () => be(b(t).pubkeyHex)), u(e, i);
					}), a(o);
					var c = S(o, 2);
					P(c, {
						onClick: () => d.onAddAccount?.(),
						className: "add-account-btn",
						variant: "primary",
						shape: "square",
						children: (e, t) => {
							var n = ce(), r = S(g(n), 2), i = _(r, !0);
							T((e) => l(i, e), [() => V()("profileDialog.add_account")]), u(e, n);
						},
						$$slots: { default: !0 }
					}), a(t), T((e) => l(i, e), [() => V()("profileDialog.accounts")]), u(e, t);
				};
				k(F, (e) => {
					W().length > 0 && e(I);
				}), a(n), T((e, t) => {
					l(h, e), l(x, t);
				}, [() => b(Z).displayName || b(Z).name || V()("profileDialog.anonymous"), () => V()("profileDialog.npub")]), u(e, n);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	c(), pe();
}
d(["click"]);
export { V as default };
