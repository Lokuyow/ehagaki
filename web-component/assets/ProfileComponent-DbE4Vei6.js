import { B as e, F as t, G as n, J as r, M as i, R as a, Tt as o, U as s, W as c, X as l, Y as u, _t as d, a as f, bt as p, dt as m, ft as h, ht as g, jt as _, k as v, lt as y, o as b, ot as x, pt as S, r as C, s as w, st as T, tt as E, ut as D, v as ee, w as te, wt as O } from "./index-client-57Odq85c.js";
import { pt as k } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { r as A } from "./authStore.svelte-BlvJ-J7q.js";
import { c as j, nt as M } from "./appUtils-CwuZyofa.js";
import { i as N } from "./clipboardUtils-LENkGqCk.js";
import { t as P } from "./useDialogHistory.svelte-BddVYV4P.js";
import { t as F } from "./DialogWrapper-CvCDxqOJ.js";
import { t as ne } from "./dialog-close-BfZcAfRJ.js";
import { J as re, et as I, nt as L } from "./App-BWEIk7fu.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/ProfileComponent.svelte
var ie = n("<div class=\"xmark-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), R = n("<div class=\"copy-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div>"), z = n("<div class=\"profile-info-row svelte-1qzltz2\"><div class=\"profile-info-content svelte-1qzltz2\"><span class=\"profile-info-text svelte-1qzltz2\"> </span> <!></div></div>"), ae = n("<div class=\"logout-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span> </span>", 1), oe = n("<div class=\"recovery-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"recovery-description svelte-1qzltz2\"> </div> <!></div>"), se = n("<span class=\"active-badge svelte-1qzltz2\"> </span>"), ce = n("<div><div class=\"account-row svelte-1qzltz2\"><button class=\"account-info-button svelte-1qzltz2\"><!> <div class=\"account-details svelte-1qzltz2\"><div class=\"account-name-row svelte-1qzltz2\"><span class=\"account-name svelte-1qzltz2\"> </span> <span class=\"account-npub-short svelte-1qzltz2\"> </span></div> <span class=\"account-type-badge svelte-1qzltz2\"><!></span></div> <!></button> <button class=\"account-logout-button svelte-1qzltz2\"><div class=\"logout-icon svg-icon svelte-1qzltz2\"></div></button></div></div>"), le = n("<div class=\"plus-icon svg-icon svelte-1qzltz2\" aria-hidden=\"true\"></div> <span class=\"add-account-label svelte-1qzltz2\"> </span>", 1), ue = n("<div class=\"accounts-section svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"account-list svelte-1qzltz2\"></div> <!></div>"), de = n("<div class=\"profile-container svelte-1qzltz2\"><div class=\"current-account-section svelte-1qzltz2\"><div class=\"profile-summary svelte-1qzltz2\"><!> <div class=\"profile-name svelte-1qzltz2\"> </div></div> <div class=\"nostr-ids svelte-1qzltz2\"><div class=\"profile-info-label svelte-1qzltz2\"> </div> <div class=\"profile-info-container svelte-1qzltz2\"><!> <!></div></div></div> <!> <!></div>"), fe = {
	hash: "svelte-1qzltz2",
	code: ".xmark-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.profile-container.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;gap:28px;width:100%;height:100%;}.current-account-section.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:16px;padding:8px 0;border-bottom:1px solid var(--border-hr);}.profile-summary.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:center;width:100%;gap:10px;.profile-image-container {width:80px;height:80px;border-radius:50%;overflow:hidden;}.profile-image {width:100%;height:100%;object-fit:cover;}.profile-image-placeholder {width:100%;height:100%;}.profile-name:where(.svelte-1qzltz2) {font-size:1.375rem;font-weight:600;color:var(--text);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}.nostr-ids.svelte-1qzltz2 {display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;min-width:0;.profile-info-container:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:6px;width:100%;min-width:0;.profile-info-row:where(.svelte-1qzltz2) {min-height:50px;width:100%;min-width:0;display:flex;flex-direction:column;.profile-info-content:where(.svelte-1qzltz2) {display:flex;align-items:stretch;background-color:var(--btn-bg);border-radius:8px;overflow:hidden;width:100%;min-width:0;.profile-info-text:where(.svelte-1qzltz2) {flex:1 1 auto;min-width:0;font-family:monospace;font-size:1rem;line-height:1.2;color:var(--text);margin:6px 0 6px 8px;overflow-wrap:anywhere;}}}}}.copy-button {height:auto;width:44px;flex:0 0 44px;background-color:var(--btn-bg);.copy-icon.svelte-1qzltz2 {width:20px;height:20px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}.profile-info-label.svelte-1qzltz2 {font-size:0.875rem;font-weight:500;color:var(--text-light);}.accounts-section.svelte-1qzltz2 {display:flex;flex-direction:column;gap:8px;width:100%;.account-list:where(.svelte-1qzltz2) {display:flex;flex-direction:column;gap:4px;}.account-item:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:stretch;gap:8px;padding:0;border-radius:8px;transition:background-color 0.15s;.account-row:where(.svelte-1qzltz2) {display:flex;align-items:center;}&.active {:disabled {opacity:1;}.account-info-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-end:none;}.account-logout-button:where(.svelte-1qzltz2) {background-color:transparent;border:solid 1px var(--border);border-inline-start:none;}}}.account-avatar {width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;}.account-avatar-img {width:100%;height:100%;object-fit:cover;}.account-avatar-placeholder {width:100%;height:100%;}.account-details:where(.svelte-1qzltz2) {display:flex;flex-direction:column;align-items:flex-start;min-width:0;width:100%;gap:4px;}.account-name-row:where(.svelte-1qzltz2) {display:flex;align-items:baseline;gap:6px;min-width:0;width:100%;}.account-name:where(.svelte-1qzltz2) {font-size:1rem;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex-shrink:1;}.account-npub-short:where(.svelte-1qzltz2) {font-size:0.7rem;color:var(--text-light);font-family:monospace;white-space:nowrap;flex-shrink:0;}.account-type-badge:where(.svelte-1qzltz2) {font-size:0.75rem;color:var(--text-light);}.active-badge:where(.svelte-1qzltz2) {font-size:0.875rem;font-weight:600;color:var(--theme);margin-inline-start:auto;flex-shrink:0;}.account-logout-button:where(.svelte-1qzltz2) {display:flex;align-items:center;justify-content:center;width:50px;height:50px;background-color:var(--btn-bg);border:solid 1px var(--btn-bg);border-inline-start:none;border-radius:0 8px 8px 0;cursor:pointer;flex-shrink:0;color:var(--text-light);transition:background-color 0.15s,\n                color 0.15s;\n\n            @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {background-color:rgba(239, 68, 68, 0.1);color:#ef4444;}\n            }&:disabled {opacity:0.4;cursor:default;}}button.add-account-btn {display:flex;align-items:center;gap:4px;width:100%;height:50px;margin-top:4px;}.add-account-label:where(.svelte-1qzltz2) {font-size:1rem;}}.logout-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6c6f676f75745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;}.recovery-section.svelte-1qzltz2 {width:100%;display:flex;flex-direction:column;gap:10px;padding:10px;border:1px solid var(--border);border-radius:10px;background:color-mix(in srgb, var(--btn-bg), transparent 18%);.recovery-description:where(.svelte-1qzltz2) {color:var(--text-light);font-size:0.9rem;line-height:1.4;}.recovery-logout-btn {width:100%;min-height:44px;display:inline-flex;align-items:center;gap:8px;}}.account-info-button.svelte-1qzltz2 {display:flex;align-items:center;gap:8px;flex:1;min-width:0;height:50px;padding-inline-start:8px;background-color:var(--btn-bg);border-radius:8px 0 0 8px;cursor:pointer;color:inherit;font:inherit;&:disabled {cursor:default;}}.plus-icon.svg-icon.svelte-1qzltz2 {mask-image:var(--ehagaki-icon-6164645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:26px;height:26px;flex-shrink:0;}"
};
function B(n, u) {
	o(u, !0), v(n, fe);
	let B = () => w(k, "$_", pe), [pe, me] = b();
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
	let V = C(u, "show", 15, !1), H = C(u, "fallbackRecoveryPubkeyHex", 3, ""), U = C(u, "accounts", 19, () => []), _e = C(u, "accountProfiles", 19, () => /* @__PURE__ */ new Map()), W = C(u, "isLoggingOut", 3, !1), G = C(u, "isSwitchingAccount", 3, !1), K = C(u, "profilePending", 3, !1);
	function q() {
		V(!1), u.onClose?.();
	}
	P(() => V(), q, !0);
	let J = p(() => I.value), Y = p(() => A.value), X = d(S(I.value)), Z = p(() => E(Y)?.pubkey || H() || ""), Q = p(() => E(X).npub || (E(Z) ? ge(E(Z)) : "")), ve = p(() => E(X).displayName || E(X).name ? E(X).displayName || E(X).name : B()("profileDialog.profile_image_alt")), ye = p(() => B()("profileDialog.profile_image_fallback")), be = p(() => U().length === 0 && !!E(Z));
	T(() => {
		!W() && E(J) && g(X, E(J), !0);
	});
	function xe(e) {
		let t = e || E(Y)?.pubkey || H() || "";
		t && u.onLogout?.(t);
	}
	function Se(e) {
		u.onSwitchAccount?.(e), q();
	}
	async function $(e, t) {
		return N(e, t, navigator, window);
	}
	{
		let o = (e) => {
			var t = c(), n = D(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = p(() => B()("global.close"));
						j(e, f(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return E(t);
							},
							children: (e, t) => {
								var n = ie();
								s(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				i(n, () => ne, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			s(e, t);
		}, d = p(() => B()("profileDialog.title")), g = p(() => B()("profileDialog.npub"));
		F(n, {
			onOpenChange: (e) => !e && q(),
			get title() {
				return E(d);
			},
			get description() {
				return E(g);
			},
			contentClass: "profile-dialog",
			footerVariant: "close-button",
			get open() {
				return V();
			},
			set open(e) {
				V(e);
			},
			footer: o,
			children: (n, i) => {
				var o = de(), c = y(o), d = y(c), f = y(d);
				L(f, {
					get pubkeyHex() {
						return E(Z);
					},
					get displayName() {
						return E(X).displayName;
					},
					get name() {
						return E(X).name;
					},
					showLoadingIndicator: !0,
					get pending() {
						return K();
					},
					get src() {
						return E(X).picture;
					},
					get alt() {
						return E(ve);
					},
					rootClassName: "profile-image-container",
					imageClassName: "profile-image",
					fallbackClassName: "profile-image-placeholder",
					get fallbackAriaLabel() {
						return E(ye);
					}
				});
				var g = h(f, 2), v = m(g, !0);
				_(d);
				var b = h(d, 2), S = y(b), C = m(S, !0), w = h(S, 2), T = y(w), O = (t) => {
					var n = z(), r = y(n), i = y(r), a = m(i, !0), o = h(i, 2);
					{
						let e = p(() => B()("profileDialog.copy_npub")), t = p(() => B()("common.copySuccess"));
						j(o, {
							shape: "square",
							className: "copy-button",
							onClick: () => $(E(Q), "npub"),
							get ariaLabel() {
								return E(e);
							},
							get floatingMessage() {
								return E(t);
							},
							children: (e, t) => {
								var n = R();
								s(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					_(r), _(n), x(() => e(a, E(Q))), s(t, n);
				};
				a(T, (e) => {
					E(Q) && e(O);
				});
				var k = h(T, 2), A = (t) => {
					var n = z(), r = y(n), i = y(r), a = m(i, !0), o = h(i, 2);
					{
						let e = p(() => B()("profileDialog.copy_nprofile")), t = p(() => B()("common.copySuccess"));
						j(o, {
							className: "copy-button",
							onClick: () => $(E(X).nprofile, "nprofile"),
							get ariaLabel() {
								return E(e);
							},
							get floatingMessage() {
								return E(t);
							},
							children: (e, t) => {
								var n = R();
								s(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					_(r), _(n), x(() => e(a, E(X).nprofile)), s(t, n);
				};
				a(k, (e) => {
					E(X).nprofile && e(A);
				}), _(w), _(b), _(c);
				var M = h(c, 2), N = (t) => {
					var n = oe(), r = y(n), i = m(r, !0), a = h(r, 2), o = m(a, !0), c = h(a, 2);
					{
						let t = p(() => W() || G()), n = p(() => B()("profileDialog.recovery_logout_current"));
						j(c, {
							className: "recovery-logout-btn",
							variant: "danger",
							shape: "rounded",
							get disabled() {
								return E(t);
							},
							onClick: () => xe(E(Z)),
							get ariaLabel() {
								return E(n);
							},
							children: (t, n) => {
								var r = ae(), i = h(D(r), 2), a = m(i, !0);
								x((t) => e(a, t), [() => B()("profileDialog.recovery_logout_current")]), s(t, r);
							},
							$$slots: { default: !0 }
						});
					}
					_(n), x((t, n) => {
						e(i, t), e(o, n);
					}, [() => B()("profileDialog.recovery_title"), () => B()("profileDialog.recovery_description")]), s(t, n);
				};
				a(M, (e) => {
					E(be) && e(N);
				});
				var P = h(M, 2), F = (n) => {
					var i = ue(), o = y(i), c = m(o, !0), d = h(o, 2);
					t(d, 21, U, (e) => e.pubkeyHex, (t, n) => {
						let i = p(() => E(n).pubkeyHex === E(Y)?.pubkey), o = p(() => _e().get(E(n).pubkeyHex));
						var c = ce();
						let u;
						var d = y(c), f = y(d), g = y(f);
						{
							let e = p(() => E(o)?.displayName), t = p(() => E(o)?.name), r = p(() => E(i) && K()), a = p(() => E(o)?.picture), s = p(() => E(o)?.displayName || E(o)?.name || B()("profileDialog.profile_image_alt"));
							L(g, {
								get pubkeyHex() {
									return E(n).pubkeyHex;
								},
								get displayName() {
									return E(e);
								},
								get name() {
									return E(t);
								},
								showLoadingIndicator: !0,
								get pending() {
									return E(r);
								},
								get src() {
									return E(a);
								},
								get alt() {
									return E(s);
								},
								rootClassName: "account-avatar",
								imageClassName: "account-avatar-img",
								fallbackClassName: "account-avatar-placeholder",
								get fallbackAriaLabel() {
									return E(ye);
								}
							});
						}
						var v = h(g, 2), b = y(v), S = y(b), C = m(S, !0), w = h(S, 2), T = m(w, !0);
						_(b);
						var D = h(b, 2), O = y(D), k = (t) => {
							var n = r();
							x((t) => e(n, t), [() => B()("profileDialog.login_method_nsec")]), s(t, n);
						}, A = (t) => {
							var n = r();
							x((t) => e(n, t), [() => B()("profileDialog.login_method_nip07")]), s(t, n);
						}, j = (t) => {
							var n = r();
							x((t) => e(n, t), [() => B()("profileDialog.login_method_nip46")]), s(t, n);
						}, M = (t) => {
							var n = r();
							x((t) => e(n, t), [() => B()("profileDialog.login_method_parent_client")]), s(t, n);
						};
						a(O, (e) => {
							E(n).type === "nsec" ? e(k) : E(n).type === "nip07" ? e(A, 1) : E(n).type === "nip46" ? e(j, 2) : E(n).type === "parentClient" && e(M, 3);
						}), _(D), _(v);
						var N = h(v, 2), P = (t) => {
							var n = se(), r = m(n, !0);
							x((t) => e(r, t), [() => B()("profileDialog.active")]), s(t, n);
						};
						a(N, (e) => {
							E(i) && e(P);
						}), _(f);
						var F = h(f, 2);
						_(d), _(c), x((t, n, r) => {
							u = te(c, 1, "account-item svelte-1qzltz2", null, u, { active: E(i) }), f.disabled = E(i) || G(), e(C, t), e(T, n), F.disabled = W() || G(), ee(F, "aria-label", r);
						}, [
							() => E(o)?.displayName || E(o)?.name || B()("profileDialog.anonymous"),
							() => he(E(n).pubkeyHex),
							() => B()("profileDialog.logout_account")
						]), l("click", f, () => {
							!E(i) && !G() && Se(E(n).pubkeyHex);
						}), l("click", F, () => xe(E(n).pubkeyHex)), s(t, c);
					}), _(d);
					var f = h(d, 2);
					j(f, {
						onClick: () => u.onAddAccount?.(),
						className: "add-account-btn",
						variant: "primary",
						shape: "square",
						children: (t, n) => {
							var r = le(), i = h(D(r), 2), a = m(i, !0);
							x((t) => e(a, t), [() => B()("profileDialog.add_account")]), s(t, r);
						},
						$$slots: { default: !0 }
					}), _(i), x((t) => e(c, t), [() => B()("profileDialog.accounts")]), s(n, i);
				};
				a(P, (e) => {
					U().length > 0 && e(F);
				}), _(o), x((t, n) => {
					e(v, t), e(C, n);
				}, [() => E(X).displayName || E(X).name || B()("profileDialog.anonymous"), () => B()("profileDialog.npub")]), s(n, o);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	O(), me();
}
u(["click"]);
export { B as default };
