import { B as e, Dt as t, E as n, Et as r, F as i, G as a, H as o, K as s, Mt as c, Nt as l, P as u, Pt as d, St as f, X as p, Y as m, _t as h, a as g, b as ee, ct as _, dt as v, ft as y, i as b, j as x, mt as S, pt as C, q as w, r as T, rt as E, v as D, yt as O } from "./index-client-DEFG3Gqk.js";
import { n as k } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { G as A, R as j, r as M, t as N } from "./LoadingPlaceholder-YrD8D_td.js";
import { r as P, t as F } from "./Button-Cqrg0_jX.js";
import { i as I } from "./use-id-DCa3fCKD.js";
import { a as L, b as R, c as z, g as B, h as V, i as H, l as U, m as W, n as te, o as ne, r as re, s as G, x as K } from "./useDialogHistory.svelte-pVteCIez.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function ie(e, n) {
	t(n, !0);
	let o = T(n, "open", 15, !1), c = T(n, "onOpenChange", 3, I), l = T(n, "onOpenChangeComplete", 3, I);
	K.create({
		variant: A(() => "dialog"),
		open: A(() => o(), (e) => {
			o(e), c()(e);
		}),
		onOpenChangeComplete: A(() => l())
	});
	var u = s(), f = y(u);
	i(f, () => n.children ?? d), a(e, u), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
var q = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"children",
	"child",
	"ref",
	"forceMount",
	"onCloseAutoFocus",
	"onOpenAutoFocus",
	"onEscapeKeydown",
	"onInteractOutside",
	"trapFocus",
	"preventScroll",
	"preventOverflowTextSelection",
	"restoreScrollDelay"
]), J = w("<!> <!>", 1), Y = w("<!> <div><!></div>", 1);
function ae(n, o) {
	let c = m();
	t(o, !0);
	let u = T(o, "id", 19, () => M(c)), p = T(o, "ref", 15, null), h = T(o, "forceMount", 3, !1), ee = T(o, "onCloseAutoFocus", 3, I), _ = T(o, "onOpenAutoFocus", 3, I), x = T(o, "onEscapeKeydown", 3, I), C = T(o, "onInteractOutside", 3, I), w = T(o, "trapFocus", 3, !0), O = T(o, "preventScroll", 3, !0), k = T(o, "preventOverflowTextSelection", 3, !0), N = T(o, "restoreScrollDelay", 3, null), P = b(o, q), F = R.create({
		id: A(() => u()),
		ref: A(() => p(), (e) => p(e))
	}), L = f(() => j(P, F.props));
	var B = s(), H = y(B), te = (t) => {
		U(t, {
			get ref() {
				return F.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return w();
			},
			get enabled() {
				return F.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return _();
			},
			get onCloseAutoFocus() {
				return ee();
			},
			focusScope: (t, n) => {
				let r = () => (n?.()).props;
				W(t, g(() => E(L), {
					get enabled() {
						return F.root.opts.open.current;
					},
					get ref() {
						return F.opts.ref;
					},
					onEscapeKeydown: (e) => {
						x()(e), !e.defaultPrevented && F.root.handleClose();
					},
					children: (t, n) => {
						V(t, g(() => E(L), {
							get ref() {
								return F.opts.ref;
							},
							get enabled() {
								return F.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								C()(e), !e.defaultPrevented && F.root.handleClose();
							},
							children: (t, n) => {
								z(t, g(() => E(L), {
									get preventOverflowTextSelection() {
										return k();
									},
									get ref() {
										return F.opts.ref;
									},
									get enabled() {
										return F.root.opts.open.current;
									},
									children: (t, n) => {
										var c = s(), u = y(c), p = (t) => {
											var n = J(), s = y(n), c = (e) => {
												G(e, {
													get preventScroll() {
														return O();
													},
													get restoreScrollDelay() {
														return N();
													}
												});
											};
											e(s, (e) => {
												F.root.opts.open.current && e(c);
											});
											var l = S(s, 2);
											{
												let e = f(() => ({
													props: j(E(L), r()),
													...F.snippetProps
												}));
												i(l, () => o.child, () => E(e));
											}
											a(t, n);
										}, m = (e) => {
											var t = Y(), n = y(t);
											G(n, { get preventScroll() {
												return O();
											} });
											var s = S(n, 2);
											D(s, (e) => ({ ...e }), [() => j(E(L), r())]);
											var c = v(s);
											i(c, () => o.children ?? d), l(s), a(e, t);
										};
										e(u, (e) => {
											o.child ? e(p) : e(m, -1);
										}), a(t, c);
									},
									$$slots: { default: !0 }
								}));
							},
							$$slots: { default: !0 }
						}));
					},
					$$slots: { default: !0 }
				}));
			},
			$$slots: { focusScope: !0 }
		});
	};
	e(H, (e) => {
		(F.shouldRender || h()) && e(te);
	}), a(n, B), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DialogWrapper.svelte
var X = w("<span class=\"svg-icon\"></span>"), oe = w("<div class=\"dialog-pagination svelte-1jiham3\"><div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div> <div class=\"dialog-page-center svelte-1jiham3\"><div class=\"dialog-page-indicator svelte-1jiham3\"> </div> <!></div> <div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div></div>"), se = w("<div><!></div>"), ce = w("<!> <!> <div class=\"dialog-content svelte-1jiham3\"><!></div> <!>", 1), le = w("<!> <!>", 1), ue = {
	hash: "svelte-1jiham3",
	code: "\n    /* ダイアログ共通スタイル */.dialog-overlay {position:fixed;inset:0;background-color:var(--dialog-bg-overlay);z-index:calc(100 + var(--bits-dialog-depth, 0) * 2);}.dialog {position:fixed;top:50%;left:50%;translate:-50% -50%;background:var(--dialog-bg);color:var(--text);width:100%;max-width:600px;display:flex;flex-direction:column;align-items:center;z-index:calc(101 + var(--bits-dialog-depth, 0) * 2);}.dialog-overlay.dialog-container-layout {position:absolute;}.dialog.dialog-container-layout {position:absolute;max-height:100%;}.dialog:focus {outline:none;}.dialog-content.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;width:100%;max-height:85svh;padding:16px;overflow-y:auto;}.dialog.dialog-container-layout .dialog-content.svelte-1jiham3 {max-height:calc(100% - 50px);}.dialog-footer.svelte-1jiham3 {width:100%;box-sizing:content-box;display:flex;flex-direction:column;justify-content:center;align-items:center;}.dialog-pagination.svelte-1jiham3 {display:flex;align-items:stretch;justify-content:space-between;gap:8px;width:100%;padding:6px;border-top:1px solid var(--border-hr);}.dialog-page-button-group.svelte-1jiham3 {display:flex;align-items:stretch;gap:4px;flex:1 0 auto;.dialog-page-icon-button {width:44px;}.dialog-page-button {--icon-size: 32px;min-width:44px;height:auto;min-height:44px;flex:1 0 auto;}}.dialog-page-center.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;flex:1 0 auto;}.dialog-page-indicator.svelte-1jiham3 {min-width:0;color:var(--text-muted);font-size:0.82rem;text-align:center;white-space:nowrap;}.dialog-page-first-button .svg-icon {mask-image:var(--ehagaki-icon-66697273745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-previous-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-next-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-last-button .svg-icon {mask-image:var(--ehagaki-icon-6c6173745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-loading-placeholder {color:var(--text);column-gap:2px;}.dialog-page-loading-placeholder .placeholder-text {color:inherit;font-size:1rem;}.dialog-page-loading-placeholder .loader-container .square {background-color:currentColor;}\n\n    /* 閉じるボタン付きフッター用スタイル */.dialog-footer.close-button-footer.svelte-1jiham3 {border-top:1px solid var(--border-hr);.modal-close {--btn-bg: var(--dialog-bg);border:none;border-radius:0;width:100%;height:50px;}}.dialog-footer.close-button-footer.has-pagination.svelte-1jiham3 {border-top:none;.modal-close {--icon-size: 20px;border:1px solid var(--btn-border);border-radius:50px;width:100%;min-width:72px;min-height:44px;}}.modal-close:active:not(:disabled) {scale:1;}.visually-hidden {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;}"
};
function Z(m, g) {
	t(g, !0), x(m, ue);
	let b = T(g, "open", 15, !1), w = T(g, "onInteractOutside", 3, void 0), D = T(g, "onEscapeKeydown", 3, void 0), A = T(g, "trapFocus", 3, !0), j = T(g, "contentClass", 3, ""), M = T(g, "footerVariant", 3, "default"), I = T(g, "showPagination", 3, !1), R = T(g, "paginationLabel", 3, ""), z = T(g, "firstPageLabel", 3, ""), V = T(g, "previousPageLabel", 3, ""), U = T(g, "nextPageLabel", 3, ""), W = T(g, "lastPageLabel", 3, ""), G = T(g, "canGoFirst", 3, !1), K = T(g, "canGoPrevious", 3, !1), q = T(g, "canGoNext", 3, !1), J = T(g, "canGoLast", 3, !1), Y = T(g, "nextPageLoading", 3, !1), Z = T(g, "initialFocus", 3, "default"), de = T(g, "onOpenAutoFocus", 3, void 0), fe = T(g, "restoreFocusOnClose", 15, !0), pe = T(g, "returnFocus", 3, null), Q = O(null), $ = null, me = k(), he = me.overlayTarget, ge = me.layoutMode === "container", _e = f(() => Z() === "content");
	function ve(e) {
		e || g.onOpenChange?.(!1);
	}
	function ye(e) {
		fe(!0), $ = H($, re(k().document), E(Q)), de() ? de()(e) : E(_e) && (e.preventDefault(), E(Q)?.focus({ preventScroll: !0 }));
	}
	function be(e) {
		te(e, {
			restore: fe(),
			explicit: pe(),
			opener: $,
			container: E(Q)
		});
	}
	var xe = s(), Se = y(xe);
	u(Se, () => ie, (t, r) => {
		r(t, {
			onOpenChange: ve,
			get open() {
				return b();
			},
			set open(e) {
				b(e);
			},
			children: (t, r) => {
				var m = s(), b = y(m);
				u(b, () => P, (t, r) => {
					r(t, {
						get to() {
							return he;
						},
						children: (t, r) => {
							var m = le(), b = y(m);
							{
								let e = f(() => `dialog-overlay ${ge ? "dialog-container-layout" : ""}`);
								u(b, () => ne, (t, n) => {
									n(t, { get class() {
										return E(e);
									} });
								});
							}
							var x = S(b, 2);
							{
								let t = f(() => `dialog ${j()} ${ge ? "dialog-container-layout" : ""}`), r = f(() => E(_e) ? -1 : void 0);
								u(x, () => ae, (m, b) => {
									b(m, {
										get class() {
											return E(t);
										},
										get tabindex() {
											return E(r);
										},
										get trapFocus() {
											return A();
										},
										preventScroll: !1,
										get onInteractOutside() {
											return w();
										},
										get onEscapeKeydown() {
											return D();
										},
										onOpenAutoFocus: ye,
										onCloseAutoFocus: be,
										get ref() {
											return E(Q);
										},
										set ref(e) {
											h(Q, e, !0);
										},
										children: (t, r) => {
											var m = ce(), h = y(m);
											u(h, () => B, (e, t) => {
												t(e, {
													class: "visually-hidden",
													children: (e, t) => {
														c();
														var n = p();
														_(() => o(n, g.title)), a(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var b = S(h, 2);
											u(b, () => L, (e, t) => {
												t(e, {
													class: "visually-hidden",
													children: (e, t) => {
														c();
														var n = p();
														_(() => o(n, g.description)), a(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var x = S(b, 2), w = v(x);
											i(w, () => g.children ?? d), l(x);
											var T = S(x, 2), D = (t) => {
												var r = se();
												let c;
												var u = v(r), p = (t) => {
													var n = oe(), r = v(n), c = v(r), u = (e) => {
														{
															let t = f(() => !G());
															F(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-first-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return E(t);
																},
																get ariaLabel() {
																	return z();
																},
																get title() {
																	return z();
																},
																get onClick() {
																	return g.onFirstPage;
																},
																children: (e, t) => {
																	var n = X();
																	a(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													e(c, (e) => {
														(z() || g.onFirstPage) && e(u);
													});
													var p = S(c, 2);
													{
														let e = f(() => !K());
														F(p, {
															className: "dialog-page-button dialog-page-icon-button dialog-page-previous-button",
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return E(e);
															},
															get ariaLabel() {
																return V();
															},
															get title() {
																return V();
															},
															get onClick() {
																return g.onPreviousPage;
															},
															children: (e, t) => {
																var n = X();
																a(e, n);
															},
															$$slots: { default: !0 }
														});
													}
													l(r);
													var m = S(r, 2), h = v(m), b = C(h, !0), x = S(h, 2);
													i(x, () => g.footer ?? d), l(m);
													var w = S(m, 2), T = v(w);
													{
														let t = f(() => `dialog-page-button dialog-page-icon-button dialog-page-next-button ${Y() ? "loading" : ""}`), n = f(() => !q() || Y());
														F(T, {
															get className() {
																return E(t);
															},
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return E(n);
															},
															get ariaLabel() {
																return U();
															},
															get title() {
																return U();
															},
															get onClick() {
																return g.onNextPage;
															},
															children: (t, n) => {
																var r = s(), i = y(r), o = (e) => {
																	N(e, {
																		showLoader: !0,
																		loaderSize: 30,
																		state: "loading",
																		customClass: "dialog-page-loading-placeholder"
																	});
																}, c = (e) => {
																	var t = X();
																	a(e, t);
																};
																e(i, (e) => {
																	Y() ? e(o) : e(c, -1);
																}), a(t, r);
															},
															$$slots: { default: !0 }
														});
													}
													var D = S(T, 2), O = (e) => {
														{
															let t = f(() => !J() || Y());
															F(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-last-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return E(t);
																},
																get ariaLabel() {
																	return W();
																},
																get title() {
																	return W();
																},
																get onClick() {
																	return g.onLastPage;
																},
																children: (e, t) => {
																	var n = X();
																	a(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													e(D, (e) => {
														(W() || g.onLastPage) && e(O);
													}), l(w), l(n), _(() => {
														ee(n, "aria-label", R()), o(b, R());
													}), a(t, n);
												}, m = (e) => {
													var t = s(), n = y(t);
													i(n, () => g.footer ?? d), a(e, t);
												};
												e(u, (e) => {
													I() ? e(p) : e(m, -1);
												}), l(r), _(() => c = n(r, 1, "dialog-footer svelte-1jiham3", null, c, {
													"close-button-footer": M() === "close-button",
													"has-pagination": I()
												})), a(t, r);
											};
											e(T, (e) => {
												(g.footer || I()) && e(D);
											}), a(t, m);
										},
										$$slots: { default: !0 }
									});
								});
							}
							a(t, m);
						},
						$$slots: { default: !0 }
					});
				}), a(t, m);
			},
			$$slots: { default: !0 }
		});
	}), a(m, xe), r();
}
export { Z as t };
