import { At as e, B as t, G as n, J as r, M as i, Mt as a, N as o, R as s, Tt as c, U as l, W as u, _t as d, a as f, bt as p, dt as m, ft as h, g, ht as _, i as v, jt as y, k as b, lt as x, ot as S, q as C, r as w, tt as T, ut as E, v as D, w as O, wt as k } from "./index-client-57Odq85c.js";
import { n as ee } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { et as A, o as j, s as M, st as N, t as P } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as F, u as I } from "./appUtils-CwuZyofa.js";
import { _ as L, a as R, d as z, f as B, i as V, n as H, o as U, p as W, r as G, v as K } from "./useDialogHistory.svelte-BddVYV4P.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function te(e, t) {
	c(t, !0);
	let n = w(t, "open", 15, !1), r = w(t, "onOpenChange", 3, M), i = w(t, "onOpenChangeComplete", 3, M);
	K.create({
		variant: N(() => "dialog"),
		open: N(() => n(), (e) => {
			n(e), r()(e);
		}),
		onOpenChangeComplete: N(() => i())
	});
	var s = u(), d = E(s);
	o(d, () => t.children ?? a), l(e, s), k();
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
]), J = n("<!> <!>", 1), Y = n("<!> <div><!></div>", 1);
function ne(e, t) {
	let n = C();
	c(t, !0);
	let r = w(t, "id", 19, () => j(n)), i = w(t, "ref", 15, null), d = w(t, "forceMount", 3, !1), m = w(t, "onCloseAutoFocus", 3, M), _ = w(t, "onOpenAutoFocus", 3, M), b = w(t, "onEscapeKeydown", 3, M), S = w(t, "onInteractOutside", 3, M), D = w(t, "trapFocus", 3, !0), O = w(t, "preventScroll", 3, !0), ee = w(t, "preventOverflowTextSelection", 3, !0), P = w(t, "restoreScrollDelay", 3, null), F = v(t, q), I = L.create({
		id: N(() => r()),
		ref: N(() => i(), (e) => i(e))
	}), H = p(() => A(F, I.props));
	var W = u(), G = E(W), K = (e) => {
		U(e, {
			get ref() {
				return I.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return D();
			},
			get enabled() {
				return I.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return _();
			},
			get onCloseAutoFocus() {
				return m();
			},
			focusScope: (e, n) => {
				let r = () => (n?.()).props;
				z(e, f(() => T(H), {
					get enabled() {
						return I.root.opts.open.current;
					},
					get ref() {
						return I.opts.ref;
					},
					onEscapeKeydown: (e) => {
						b()(e), !e.defaultPrevented && I.root.handleClose();
					},
					children: (e, n) => {
						B(e, f(() => T(H), {
							get ref() {
								return I.opts.ref;
							},
							get enabled() {
								return I.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								S()(e), !e.defaultPrevented && I.root.handleClose();
							},
							children: (e, n) => {
								R(e, f(() => T(H), {
									get preventOverflowTextSelection() {
										return ee();
									},
									get ref() {
										return I.opts.ref;
									},
									get enabled() {
										return I.root.opts.open.current;
									},
									children: (e, n) => {
										var i = u(), c = E(i), d = (e) => {
											var n = J(), i = E(n), a = (e) => {
												V(e, {
													get preventScroll() {
														return O();
													},
													get restoreScrollDelay() {
														return P();
													}
												});
											};
											s(i, (e) => {
												I.root.opts.open.current && e(a);
											});
											var c = h(i, 2);
											{
												let e = p(() => ({
													props: A(T(H), r()),
													...I.snippetProps
												}));
												o(c, () => t.child, () => T(e));
											}
											l(e, n);
										}, f = (e) => {
											var n = Y(), i = E(n);
											V(i, { get preventScroll() {
												return O();
											} });
											var s = h(i, 2);
											g(s, (e) => ({ ...e }), [() => A(T(H), r())]);
											var c = x(s);
											o(c, () => t.children ?? a), y(s), l(e, n);
										};
										s(c, (e) => {
											t.child ? e(d) : e(f, -1);
										}), l(e, i);
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
	s(G, (e) => {
		(I.shouldRender || d()) && e(K);
	}), l(e, W), k();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DialogWrapper.svelte
var X = n("<span class=\"svg-icon\"></span>"), re = n("<div class=\"dialog-pagination svelte-1jiham3\"><div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div> <div class=\"dialog-page-center svelte-1jiham3\"><div class=\"dialog-page-indicator svelte-1jiham3\"> </div> <!></div> <div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div></div>"), ie = n("<div><!></div>"), ae = n("<!> <!> <div class=\"dialog-content svelte-1jiham3\"><!></div> <!>", 1), oe = n("<!> <!>", 1), se = {
	hash: "svelte-1jiham3",
	code: "\n    /* ダイアログ共通スタイル */.dialog-overlay {position:fixed;inset:0;background-color:var(--dialog-bg-overlay);z-index:calc(100 + var(--bits-dialog-depth, 0) * 2);}.dialog {position:fixed;top:50%;left:50%;translate:-50% -50%;background:var(--dialog-bg);color:var(--text);width:100%;max-width:600px;display:flex;flex-direction:column;align-items:center;z-index:calc(101 + var(--bits-dialog-depth, 0) * 2);}.dialog-overlay.dialog-container-layout {position:absolute;}.dialog.dialog-container-layout {position:absolute;max-height:100%;}.dialog:focus {outline:none;}.dialog-content.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;width:100%;max-height:85svh;padding:16px;overflow-y:auto;}.dialog.dialog-container-layout .dialog-content.svelte-1jiham3 {max-height:calc(100% - 50px);}.dialog-footer.svelte-1jiham3 {width:100%;box-sizing:content-box;display:flex;flex-direction:column;justify-content:center;align-items:center;}.dialog-pagination.svelte-1jiham3 {display:flex;align-items:stretch;justify-content:space-between;gap:8px;width:100%;padding:6px;border-top:1px solid var(--border-hr);}.dialog-page-button-group.svelte-1jiham3 {display:flex;align-items:stretch;gap:4px;flex:1 0 auto;.dialog-page-icon-button {width:44px;}.dialog-page-button {--icon-size: 32px;min-width:44px;height:auto;min-height:44px;flex:1 0 auto;}}.dialog-page-center.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;flex:1 0 auto;}.dialog-page-indicator.svelte-1jiham3 {min-width:0;color:var(--text-muted);font-size:0.82rem;text-align:center;white-space:nowrap;}.dialog-page-first-button .svg-icon {mask-image:var(--ehagaki-icon-66697273745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-previous-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-next-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-last-button .svg-icon {mask-image:var(--ehagaki-icon-6c6173745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-loading-placeholder {color:var(--text);column-gap:2px;}.dialog-page-loading-placeholder .placeholder-text {color:inherit;font-size:1rem;}.dialog-page-loading-placeholder .loader-container .square {background-color:currentColor;}\n\n    /* 閉じるボタン付きフッター用スタイル */.dialog-footer.close-button-footer.svelte-1jiham3 {border-top:1px solid var(--border-hr);.modal-close {--btn-bg: var(--dialog-bg);border:none;border-radius:0;width:100%;height:50px;}}.dialog-footer.close-button-footer.has-pagination.svelte-1jiham3 {border-top:none;.modal-close {--icon-size: 20px;border:1px solid var(--btn-border);border-radius:50px;width:100%;min-width:72px;min-height:44px;}}.modal-close:active:not(:disabled) {scale:1;}.visually-hidden {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;}"
};
function Z(n, f) {
	c(f, !0), b(n, se);
	let g = w(f, "open", 15, !1), v = w(f, "onInteractOutside", 3, void 0), C = w(f, "onEscapeKeydown", 3, void 0), A = w(f, "trapFocus", 3, !0), j = w(f, "contentClass", 3, ""), M = w(f, "footerVariant", 3, "default"), N = w(f, "showPagination", 3, !1), L = w(f, "paginationLabel", 3, ""), R = w(f, "firstPageLabel", 3, ""), z = w(f, "previousPageLabel", 3, ""), B = w(f, "nextPageLabel", 3, ""), V = w(f, "lastPageLabel", 3, ""), U = w(f, "canGoFirst", 3, !1), K = w(f, "canGoPrevious", 3, !1), q = w(f, "canGoNext", 3, !1), J = w(f, "canGoLast", 3, !1), Y = w(f, "nextPageLoading", 3, !1), Z = w(f, "initialFocus", 3, "default"), Q = w(f, "onOpenAutoFocus", 3, void 0), $ = d(null), ce = ee(), le = ce.overlayTarget, ue = ce.layoutMode === "container", de = p(() => Z() === "content");
	function fe(e) {
		e || f.onOpenChange?.(!1);
	}
	function pe(e) {
		Q() ? Q()(e) : T(de) && (e.preventDefault(), T($)?.focus({ preventScroll: !0 }));
	}
	function me(e) {
		e.preventDefault();
	}
	var he = u(), ge = E(he);
	i(ge, () => te, (n, c) => {
		c(n, {
			onOpenChange: fe,
			get open() {
				return g();
			},
			set open(e) {
				g(e);
			},
			children: (n, c) => {
				var d = u(), g = E(d);
				i(g, () => I, (n, c) => {
					c(n, {
						get to() {
							return le;
						},
						children: (n, c) => {
							var d = oe(), g = E(d);
							{
								let e = p(() => `dialog-overlay ${ue ? "dialog-container-layout" : ""}`);
								i(g, () => G, (t, n) => {
									n(t, { get class() {
										return T(e);
									} });
								});
							}
							var b = h(g, 2);
							{
								let n = p(() => `dialog ${j()} ${ue ? "dialog-container-layout" : ""}`), c = p(() => T(de) ? -1 : void 0);
								i(b, () => ne, (d, g) => {
									g(d, {
										get class() {
											return T(n);
										},
										get tabindex() {
											return T(c);
										},
										get trapFocus() {
											return A();
										},
										preventScroll: !1,
										get onInteractOutside() {
											return v();
										},
										get onEscapeKeydown() {
											return C();
										},
										onOpenAutoFocus: pe,
										onCloseAutoFocus: me,
										get ref() {
											return T($);
										},
										set ref(e) {
											_($, e, !0);
										},
										children: (n, c) => {
											var d = ae(), g = E(d);
											i(g, () => W, (n, i) => {
												i(n, {
													class: "visually-hidden",
													children: (n, i) => {
														e();
														var a = r();
														S(() => t(a, f.title)), l(n, a);
													},
													$$slots: { default: !0 }
												});
											});
											var _ = h(g, 2);
											i(_, () => H, (n, i) => {
												i(n, {
													class: "visually-hidden",
													children: (n, i) => {
														e();
														var a = r();
														S(() => t(a, f.description)), l(n, a);
													},
													$$slots: { default: !0 }
												});
											});
											var v = h(_, 2), b = x(v);
											o(b, () => f.children ?? a), y(v);
											var C = h(v, 2), w = (e) => {
												var n = ie();
												let r;
												var i = x(n), c = (e) => {
													var n = re(), r = x(n), i = x(r), c = (e) => {
														{
															let t = p(() => !U());
															F(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-first-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return T(t);
																},
																get ariaLabel() {
																	return R();
																},
																get title() {
																	return R();
																},
																get onClick() {
																	return f.onFirstPage;
																},
																children: (e, t) => {
																	var n = X();
																	l(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													s(i, (e) => {
														(R() || f.onFirstPage) && e(c);
													});
													var d = h(i, 2);
													{
														let e = p(() => !K());
														F(d, {
															className: "dialog-page-button dialog-page-icon-button dialog-page-previous-button",
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return T(e);
															},
															get ariaLabel() {
																return z();
															},
															get title() {
																return z();
															},
															get onClick() {
																return f.onPreviousPage;
															},
															children: (e, t) => {
																var n = X();
																l(e, n);
															},
															$$slots: { default: !0 }
														});
													}
													y(r);
													var g = h(r, 2), _ = x(g), v = m(_, !0), b = h(_, 2);
													o(b, () => f.footer ?? a), y(g);
													var C = h(g, 2), w = x(C);
													{
														let e = p(() => `dialog-page-button dialog-page-icon-button dialog-page-next-button ${Y() ? "loading" : ""}`), t = p(() => !q() || Y());
														F(w, {
															get className() {
																return T(e);
															},
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return T(t);
															},
															get ariaLabel() {
																return B();
															},
															get title() {
																return B();
															},
															get onClick() {
																return f.onNextPage;
															},
															children: (e, t) => {
																var n = u(), r = E(n), i = (e) => {
																	P(e, {
																		showLoader: !0,
																		loaderSize: 30,
																		state: "loading",
																		customClass: "dialog-page-loading-placeholder"
																	});
																}, a = (e) => {
																	var t = X();
																	l(e, t);
																};
																s(r, (e) => {
																	Y() ? e(i) : e(a, -1);
																}), l(e, n);
															},
															$$slots: { default: !0 }
														});
													}
													var O = h(w, 2), k = (e) => {
														{
															let t = p(() => !J() || Y());
															F(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-last-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return T(t);
																},
																get ariaLabel() {
																	return V();
																},
																get title() {
																	return V();
																},
																get onClick() {
																	return f.onLastPage;
																},
																children: (e, t) => {
																	var n = X();
																	l(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													s(O, (e) => {
														(V() || f.onLastPage) && e(k);
													}), y(C), y(n), S(() => {
														D(n, "aria-label", L()), t(v, L());
													}), l(e, n);
												}, d = (e) => {
													var t = u(), n = E(t);
													o(n, () => f.footer ?? a), l(e, t);
												};
												s(i, (e) => {
													N() ? e(c) : e(d, -1);
												}), y(n), S(() => r = O(n, 1, "dialog-footer svelte-1jiham3", null, r, {
													"close-button-footer": M() === "close-button",
													"has-pagination": N()
												})), l(e, n);
											};
											s(C, (e) => {
												(f.footer || N()) && e(w);
											}), l(n, d);
										},
										$$slots: { default: !0 }
									});
								});
							}
							l(n, d);
						},
						$$slots: { default: !0 }
					});
				}), l(n, d);
			},
			$$slots: { default: !0 }
		});
	}), l(n, he), k();
}
export { Z as t };
