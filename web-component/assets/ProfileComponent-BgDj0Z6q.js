import { At as e, B as t, Ct as n, F as r, G as i, J as a, M as o, R as s, U as c, W as l, Y as u, a as d, at as f, ct as p, dt as m, et as h, ft as g, gt as _, k as v, lt as y, mt as b, o as x, ot as S, q as C, r as w, s as T, ut as E, v as ee, w as te, wt as D, yt as O } from "./index-client-Bdka-Daw.js";
import { pt as k } from "./LoadingPlaceholder-j1_vRYno.js";
import { r as A } from "./authStore.svelte-CoGdd5_Z.js";
import { c as j, nt as M } from "./appUtils-Bsk0mFqn.js";
import { i as N } from "./clipboardUtils-a0DTSm8D.js";
import { t as P } from "./useDialogHistory.svelte-C49eZejL.js";
import { t as F } from "./DialogWrapper-C4-jPsAO.js";
import { t as ne } from "./dialog-close-DgGAhT4f.js";
import { $ as I, q as re, tt as L } from "./App-BVcniO1E.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/ProfileComponent.svelte
var ie = i("<div class=\"xmark-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), R = i("<div class=\"copy-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), z = i("<div class=\"profile-info-row svelte-1qzltz2\"><div class=\"profile-info-content svelte-1qzltz2\"><span class=\"profile-info-text svelte-1qzltz2\"> </span> <!></div></div>"), ae = i("<div class=\"logout-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span> </span>", 1), oe = i("<div class=\"recovery-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"recovery-description svelte-1qzltz2\"> </div> <!></div>"), se = i("<span class=\"active-badge svelte-1qzltz2\"> </span>"), ce = i("<div><div class=\"account-row svelte-1qzltz2\"><button class=\"account-info-button svelte-1qzltz2\"><!> <div class=\"account-details svelte-1qzltz2\"><div class=\"account-name-row svelte-1qzltz2\"><span class=\"account-name svelte-1qzltz2\"> </span> <span class=\"account-npub-short svelte-1qzltz2\"> </span></div> <span class=\"account-type-badge svelte-1qzltz2\"><!></span></div> <!></button> <button class=\"account-logout-button svelte-1qzltz2\"><div class=\"logout-icon svg-icon svelte-1qzltz2\"></div></button></div></div>"), le = i("<div class=\"plus-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span class=\"add-account-label svelte-1qzltz2\"> </span>", 1), ue = i("<div class=\"accounts-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"account-list svelte-1qzltz2\"></div> <!></div>"), de = i("<div class=\"profile-container svelte-1qzltz2\"><div class=\"current-account-section svelte-1qzltz2\"><div class=\"profile-summary svelte-1qzltz2\"><!> <div class=\"profile-name svelte-1qzltz2\"> </div></div> <div class=\"nostr-ids svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"profile-info-container svelte-1qzltz2\"><!> <!></div></div></div> <!> <!></div>"), fe = {
	hash: "svelte-1qzltz2",
	code: ".xmark-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.profile-container.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;gap:28px;width:100%;height:100%;}.current-account-section.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:16px;padding:8px 0;border-bottom:1px solid var(--border-hr);}.profile-summary.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:10px;.profile-image-container {width:80px;height:80px;border-radius:50%;overflow:hidden;}.profile-image {width:100%;height:100%;object-fit:cover;}.profile-image-placeholder {width:100%;height:100%;}.profile-name:where(.svelte-1qzltz2) {font-size:1.375rem;font-weight:600;color:var(--text);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}.nostr-ids.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;min-width:0;.profile-info-container:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:6px;width:100%;min-width:0;.profile-info-row:where(.svelte-1qzltz2) {min-height:50px;width:100%;min-width:0;display:flex;flex-direction:column;.profile-info-content:where(.svelte-1qzltz2) {display:flex;align-items:stretch;background-color:var(--btn-bg);border-radius:8px;overflow:hidden;width:100%;min-width:0;.profile-info-text:where(.svelte-1qzltz2) {flex:1 1 auto;min-width:0;font-family:monospace;font-size:1rem;line-height:1.2;color:var(--text);margin:6px 0 6px 8px;overflow-wrap:anywhere;}}}}}.copy-button {height:auto;width:44px;flex:0 0 44px;background-color:var(--btn-bg);.copy-icon.svelte-1qzltz2 {width:20px;height:20px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.profile-info-label.svelte-1qzltz2 {font-size:0.875rem;font-weight:500;color:var(--text-light);}.accounts-section.svelte-1qzltz2 {display:flex;flex-direction:column;gap:8px;width:100%;.account-list:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:4px;}.account-item:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:stretch;gap:8px;padding:0;border-radius:8px;transition:background-color 0.15s;.account-row:where(.svelte-1qzltz2) {display:flex;align-items:center;}&.active {:disabled {opacity:1;}.account-info-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-end:none;}.account-logout-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-start:none;}}}.account-avatar {width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;}.account-avatar-img {width:100%;height:100%;object-fit:cover;}.account-avatar-placeholder {width:100%;height:100%;}.account-details:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:flex-start;min-width:0;width:100%;gap:4px;}.account-name-row:where(.svelte-1qzltz2) {display:flex;align-items:baseline;gap:6px;min-width:0;width:100%;}.account-name:where(.svelte-1qzltz2) {font-size:1rem;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex-shrink:1;}.account-npub-short:where(.svelte-1qzltz2) {font-size:0.7rem;color:var(--text-light);font-family:monospace;white-space:nowrap;flex-shrink:0;}.account-type-badge:where(.svelte-1qzltz2) {font-size:0.75rem;color:var(--text-light);}.active-badge:where(.svelte-1qzltz2) {font-size:0.875rem;font-weight:600;color:var(--theme);margin-inline-start:auto;flex-shrink:0;}.account-logout-button:where(.svelte-1qzltz2) {display:flex;align-items:center;justify-content:center;width:50px;height:50px;background-color:var(--btn-bg);border:solid 1px var(--btn-bg);border-inline-start:none;border-radius:0 8px 8px 0;cursor:pointer;flex-shrink:0;color:var(--text-light);transition:background-color 0.15s,\n                color 0.15s;\n\n            @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:rgba(239, 68, 68, 0.1);color:#ef4444;}\n            }&:disabled {opacity:0.4;cursor:default;}}button.add-account-btn {display:flex;align-items:center;gap:4px;width:100%;height:50px;margin-top:4px;}.add-account-label:where(.svelte-1qzltz2) {font-size:1rem;}}.logout-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6c6f676f75745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;}.recovery-section.svelte-1qzltz2 {width:100%;display:flex;flex-direction:column;gap:10px;padding:10px;border:1px solid var(--border);border-radius:10px;background:color-mix(in srgb, var(--btn-bg), transparent 18%);.recovery-description:where(.svelte-1qzltz2) {color:var(--text-light);font-size:0.9rem;line-height:1.4;}.recovery-logout-btn {width:100%;min-height:44px;display:inline-flex;align-items:center;gap:8px;}}.account-info-button.svelte-1qzltz2 {display:flex;align-items:center;gap:8px;flex:1;min-width:0;height:50px;padding-inline-start:8px;background-color:var(--btn-bg);border-radius:8px 0 0 8px;cursor:pointer;color:inherit;font:inherit;&:disabled {cursor:default;}}.plus-icon.svg-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6164645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;flex-shrink:0;}"
};
function B(i, a) {
	D(a, !0), v(i, fe);
	let B = () => T(k, "$_", pe), [pe, me] = x();
	function he(e) {
		try {
			let t = M(e);
			return re(t, 9, 4);
		} catch {
			return "";
		}
	}
	function ge(e) {
		try {
			return M(e);
		} catch {
			return "";
		}
	}
	let V = w(a, "show", 15, !1), H = w(a, "fallbackRecoveryPubkeyHex", 3, ""), U = w(a, "accounts", 19, () => []), _e = w(a, "accountProfiles", 19, () => /* @__PURE__ */ new Map()), W = w(a, "isLoggingOut", 3, !1), G = w(a, "isSwitchingAccount", 3, !1);
	function K() {
		V(!1), a.onClose?.();
	}
	P(() => V(), K, !0);
	let q = O(() => I.value), J = O(() => A.value), Y = _(g(I.value)), X = O(() => h(J)?.pubkey || H() || ""), Z = O(() => h(Y).npub || (h(X) ? ge(h(X)) : "")), ve = O(() => h(Y).displayName || h(Y).name ? h(Y).displayName || h(Y).name : B()("profileDialog.profile_image_alt")), Q = O(() => B()("profileDialog.profile_image_fallback")), ye = O(() => U().length === 0 && !!h(X));
	S(() => {
		!W() && h(q) && b(Y, h(q), !0);
	});
	function $(e) {
		let t = e || h(J)?.pubkey || H() || "";
		t && a.onLogout?.(t);
	}
	function be(e) {
		a.onSwitchAccount?.(e), K();
	}
	async function xe(e, t) {
		return N(e, t, navigator, window);
	}
	{
		let n = (e) => {
			var t = l(), n = y(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = O(() => B()("global.close"));
						j(e, d(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return h(t);
							},
							children: (e, t) => {
								var n = ie();
								c(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				o(n, () => ne, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			c(e, t);
		}, g = O(() => B()("profileDialog.title")), _ = O(() => B()("profileDialog.npub"));
		F(i, {
			onOpenChange: (e) => !e && K(),
			get title() {
				return h(g);
			},
			get description() {
				return h(_);
			},
			contentClass: "profile-dialog",
			footerVariant: "close-button",
			get open() {
				return V();
			},
			set open(e) {
				V(e);
			},
			footer: n,
			children: (n, i) => {
				var o = de(), l = p(o), d = p(l), g = p(d);
				L(g, {
					get src() {
						return h(Y).picture;
					},
					get alt() {
						return h(ve);
					},
					rootClassName: "profile-image-container",
					imageClassName: "profile-image",
					fallbackClassName: "profile-image-placeholder",
					get fallbackAriaLabel() {
						return h(Q);
					}
				});
				var _ = m(g, 2), v = E(_, !0);
				e(d);
				var b = m(d, 2), x = p(b), S = E(x, !0), w = m(x, 2), T = p(w), D = (n) => {
					var r = z(), i = p(r), a = p(i), o = E(a, !0), s = m(a, 2);
					{
						let e = O(() => B()("profileDialog.copy_npub")), t = O(() => B()("common.copySuccess"));
						j(s, {
							shape: "square",
							className: "copy-button",
							onClick: () => xe(h(Z), "npub"),
							get ariaLabel() {
								return h(e);
							},
							get floatingMessage() {
								return h(t);
							},
							children: (e, t) => {
								var n = R();
								c(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					e(i), e(r), f(() => t(o, h(Z))), c(n, r);
				};
				s(T, (e) => {
					h(Z) && e(D);
				});
				var k = m(T, 2), A = (n) => {
					var r = z(), i = p(r), a = p(i), o = E(a, !0), s = m(a, 2);
					{
						let e = O(() => B()("profileDialog.copy_nprofile")), t = O(() => B()("common.copySuccess"));
						j(s, {
							className: "copy-button",
							onClick: () => xe(h(Y).nprofile, "nprofile"),
							get ariaLabel() {
								return h(e);
							},
							get floatingMessage() {
								return h(t);
							},
							children: (e, t) => {
								var n = R();
								c(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					e(i), e(r), f(() => t(o, h(Y).nprofile)), c(n, r);
				};
				s(k, (e) => {
					h(Y).nprofile && e(A);
				}), e(w), e(b), e(l);
				var M = m(l, 2), N = (n) => {
					var r = oe(), i = p(r), a = E(i, !0), o = m(i, 2), s = E(o, !0), l = m(o, 2);
					{
						let e = O(() => W() || G()), n = O(() => B()("profileDialog.recovery_logout_current"));
						j(l, {
							className: "recovery-logout-btn",
							variant: "danger",
							shape: "rounded",
							get disabled() {
								return h(e);
							},
							onClick: () => $(h(X)),
							get ariaLabel() {
								return h(n);
							},
							children: (e, n) => {
								var r = ae(), i = m(y(r), 2), a = E(i, !0);
								f((e) => t(a, e), [() => B()("profileDialog.recovery_logout_current")]), c(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(r), f((e, n) => {
						t(a, e), t(s, n);
					}, [() => B()("profileDialog.recovery_title"), () => B()("profileDialog.recovery_description")]), c(n, r);
				};
				s(M, (e) => {
					h(ye) && e(N);
				});
				var P = m(M, 2), F = (n) => {
					var i = ue(), o = p(i), l = E(o, !0), d = m(o, 2);
					r(d, 21, U, (e) => e.pubkeyHex, (n, r) => {
						let i = O(() => h(r).pubkeyHex === h(J)?.pubkey), a = O(() => _e().get(h(r).pubkeyHex));
						var o = ce();
						let l;
						var d = p(o), g = p(d), _ = p(g);
						{
							let e = O(() => h(a)?.picture), t = O(() => h(a)?.displayName || h(a)?.name || B()("profileDialog.profile_image_alt"));
							L(_, {
								get src() {
									return h(e);
								},
								get alt() {
									return h(t);
								},
								rootClassName: "account-avatar",
								imageClassName: "account-avatar-img",
								fallbackClassName: "account-avatar-placeholder",
								get fallbackAriaLabel() {
									return h(Q);
								}
							});
						}
						var v = m(_, 2), y = p(v), b = p(y), x = E(b, !0), S = m(b, 2), w = E(S, !0);
						e(y);
						var T = m(y, 2), D = p(T), k = (e) => {
							var n = C();
							f((e) => t(n, e), [() => B()("profileDialog.login_method_nsec")]), c(e, n);
						}, A = (e) => {
							var n = C();
							f((e) => t(n, e), [() => B()("profileDialog.login_method_nip07")]), c(e, n);
						}, j = (e) => {
							var n = C();
							f((e) => t(n, e), [() => B()("profileDialog.login_method_nip46")]), c(e, n);
						}, M = (e) => {
							var n = C();
							f((e) => t(n, e), [() => B()("profileDialog.login_method_parent_client")]), c(e, n);
						};
						s(D, (e) => {
							h(r).type === "nsec" ? e(k) : h(r).type === "nip07" ? e(A, 1) : h(r).type === "nip46" ? e(j, 2) : h(r).type === "parentClient" && e(M, 3);
						}), e(T), e(v);
						var N = m(v, 2), P = (e) => {
							var n = se(), r = E(n, !0);
							f((e) => t(r, e), [() => B()("profileDialog.active")]), c(e, n);
						};
						s(N, (e) => {
							h(i) && e(P);
						}), e(g);
						var F = m(g, 2);
						e(d), e(o), f((e, n, r) => {
							l = te(o, 1, "account-item svelte-1qzltz2", null, l, { active: h(i) }), g.disabled = h(i) || G(), t(x, e), t(w, n), F.disabled = W() || G(), ee(F, "aria-label", r);
						}, [
							() => h(a)?.displayName || h(a)?.name || B()("profileDialog.anonymous"),
							() => he(h(r).pubkeyHex),
							() => B()("profileDialog.logout_account")
						]), u("click", g, () => {
							!h(i) && !G() && be(h(r).pubkeyHex);
						}), u("click", F, () => $(h(r).pubkeyHex)), c(n, o);
					}), e(d);
					var g = m(d, 2);
					j(g, {
						onClick: () => a.onAddAccount?.(),
						className: "add-account-btn",
						variant: "primary",
						shape: "square",
						children: (e, n) => {
							var r = le(), i = m(y(r), 2), a = E(i, !0);
							f((e) => t(a, e), [() => B()("profileDialog.add_account")]), c(e, r);
						},
						$$slots: { default: !0 }
					}), e(i), f((e) => t(l, e), [() => B()("profileDialog.accounts")]), c(n, i);
				};
				s(P, (e) => {
					U().length > 0 && e(F);
				}), e(o), f((e, n) => {
					t(v, e), t(S, n);
				}, [() => h(Y).displayName || h(Y).name || B()("profileDialog.anonymous"), () => B()("profileDialog.npub")]), c(n, o);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	n(), me();
}
a(["click"]);
export { B as default };
