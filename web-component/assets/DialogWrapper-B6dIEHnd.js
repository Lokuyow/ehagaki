import { At as e, B as t, Ct as n, G as r, K as i, M as a, N as o, R as s, U as c, W as l, a as u, at as d, ct as f, dt as p, et as m, g as h, gt as g, i as _, jt as v, k as y, kt as b, lt as x, mt as S, q as C, r as w, ut as T, v as E, w as D, wt as O, yt as k } from "./index-client-Bdka-Daw.js";
import { n as A } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { et as j, o as M, s as N, st as P, t as F } from "./LoadingPlaceholder-j1_vRYno.js";
import { c as I, u as L } from "./appUtils-C7IXsQBk.js";
import { _ as R, a as z, d as B, f as V, i as H, n as U, o as ee, p as W, r as G, v as K } from "./useDialogHistory.svelte-Bf7sbISs.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function te(e, t) {
	O(t, !0);
	let r = w(t, "open", 15, !1), i = w(t, "onOpenChange", 3, N), a = w(t, "onOpenChangeComplete", 3, N);
	K.create({
		variant: P(() => "dialog"),
		open: P(() => r(), (e) => {
			r(e), i()(e);
		}),
		onOpenChangeComplete: P(() => a())
	});
	var s = l(), u = x(s);
	o(u, () => t.children ?? v), c(e, s), n();
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
]), J = r("<!> <!>", 1), Y = r("<!> <div><!></div>", 1);
function ne(t, r) {
	let a = i();
	O(r, !0);
	let d = w(r, "id", 19, () => M(a)), g = w(r, "ref", 15, null), y = w(r, "forceMount", 3, !1), b = w(r, "onCloseAutoFocus", 3, N), S = w(r, "onOpenAutoFocus", 3, N), C = w(r, "onEscapeKeydown", 3, N), T = w(r, "onInteractOutside", 3, N), E = w(r, "trapFocus", 3, !0), D = w(r, "preventScroll", 3, !0), A = w(r, "preventOverflowTextSelection", 3, !0), F = w(r, "restoreScrollDelay", 3, null), I = _(r, q), L = R.create({
		id: P(() => d()),
		ref: P(() => g(), (e) => g(e))
	}), U = k(() => j(I, L.props));
	var W = l(), G = x(W), K = (t) => {
		ee(t, {
			get ref() {
				return L.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return E();
			},
			get enabled() {
				return L.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return S();
			},
			get onCloseAutoFocus() {
				return b();
			},
			focusScope: (t, n) => {
				let i = () => (n?.()).props;
				B(t, u(() => m(U), {
					get enabled() {
						return L.root.opts.open.current;
					},
					get ref() {
						return L.opts.ref;
					},
					onEscapeKeydown: (e) => {
						C()(e), !e.defaultPrevented && L.root.handleClose();
					},
					children: (t, n) => {
						V(t, u(() => m(U), {
							get ref() {
								return L.opts.ref;
							},
							get enabled() {
								return L.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								T()(e), !e.defaultPrevented && L.root.handleClose();
							},
							children: (t, n) => {
								z(t, u(() => m(U), {
									get preventOverflowTextSelection() {
										return A();
									},
									get ref() {
										return L.opts.ref;
									},
									get enabled() {
										return L.root.opts.open.current;
									},
									children: (t, n) => {
										var a = l(), u = x(a), d = (e) => {
											var t = J(), n = x(t), a = (e) => {
												H(e, {
													get preventScroll() {
														return D();
													},
													get restoreScrollDelay() {
														return F();
													}
												});
											};
											s(n, (e) => {
												L.root.opts.open.current && e(a);
											});
											var l = p(n, 2);
											{
												let e = k(() => ({
													props: j(m(U), i()),
													...L.snippetProps
												}));
												o(l, () => r.child, () => m(e));
											}
											c(e, t);
										}, g = (t) => {
											var n = Y(), a = x(n);
											H(a, { get preventScroll() {
												return D();
											} });
											var s = p(a, 2);
											h(s, (e) => ({ ...e }), [() => j(m(U), i())]);
											var l = f(s);
											o(l, () => r.children ?? v), e(s), c(t, n);
										};
										s(u, (e) => {
											r.child ? e(d) : e(g, -1);
										}), c(t, a);
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
		(L.shouldRender || y()) && e(K);
	}), c(t, W), n();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DialogWrapper.svelte
var X = r("<span class=\"svg-icon\"></span>"), re = r("<div class=\"dialog-pagination svelte-1jiham3\"><div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div> <div class=\"dialog-page-center svelte-1jiham3\"><div class=\"dialog-page-indicator svelte-1jiham3\"> </div> <!></div> <div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div></div>"), ie = r("<div><!></div>"), ae = r("<!> <!> <div class=\"dialog-content svelte-1jiham3\"><!></div> <!>", 1), oe = r("<!> <!>", 1), se = {
	hash: "svelte-1jiham3",
	code: "\n    /* ダイアログ共通スタイル */.dialog-overlay {position:fixed;inset:0;background-color:var(--dialog-bg-overlay);z-index:calc(100 + var(--bits-dialog-depth, 0) * 2);}.dialog {position:fixed;top:50%;left:50%;translate:-50% -50%;background:var(--dialog-bg);color:var(--text);width:100%;max-width:600px;display:flex;flex-direction:column;align-items:center;z-index:calc(101 + var(--bits-dialog-depth, 0) * 2);}.dialog-overlay.dialog-container-layout {position:absolute;}.dialog.dialog-container-layout {position:absolute;max-height:100%;}.dialog:focus {outline:none;}.dialog-content.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;width:100%;max-height:85svh;padding:16px;overflow-y:auto;}.dialog.dialog-container-layout .dialog-content.svelte-1jiham3 {max-height:calc(100% - 50px);}.dialog-footer.svelte-1jiham3 {width:100%;box-sizing:content-box;display:flex;flex-direction:column;justify-content:center;align-items:center;}.dialog-pagination.svelte-1jiham3 {display:flex;align-items:stretch;justify-content:space-between;gap:8px;width:100%;padding:6px;border-top:1px solid var(--border-hr);}.dialog-page-button-group.svelte-1jiham3 {display:flex;align-items:stretch;gap:4px;flex:1 0 auto;.dialog-page-icon-button {width:44px;}.dialog-page-button {--icon-size: 32px;min-width:44px;height:auto;min-height:44px;flex:1 0 auto;}}.dialog-page-center.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;flex:1 0 auto;}.dialog-page-indicator.svelte-1jiham3 {min-width:0;color:var(--text-muted);font-size:0.82rem;text-align:center;white-space:nowrap;}.dialog-page-first-button .svg-icon {mask-image:var(--ehagaki-icon-66697273745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-previous-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-next-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-last-button .svg-icon {mask-image:var(--ehagaki-icon-6c6173745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-loading-placeholder {color:var(--text);column-gap:2px;}.dialog-page-loading-placeholder .placeholder-text {color:inherit;font-size:1rem;}.dialog-page-loading-placeholder .loader-container .square {background-color:currentColor;}\n\n    /* 閉じるボタン付きフッター用スタイル */.dialog-footer.close-button-footer.svelte-1jiham3 {border-top:1px solid var(--border-hr);.modal-close {--btn-bg: var(--dialog-bg);border:none;border-radius:0;width:100%;height:50px;}}.dialog-footer.close-button-footer.has-pagination.svelte-1jiham3 {border-top:none;.modal-close {--icon-size: 20px;border:1px solid var(--btn-border);border-radius:50px;width:100%;min-width:72px;min-height:44px;}}.modal-close:active:not(:disabled) {scale:1;}.visually-hidden {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;}"
};
function Z(r, i) {
	O(i, !0), y(r, se);
	let u = w(i, "open", 15, !1), h = w(i, "onInteractOutside", 3, void 0), _ = w(i, "onEscapeKeydown", 3, void 0), j = w(i, "trapFocus", 3, !0), M = w(i, "contentClass", 3, ""), N = w(i, "footerVariant", 3, "default"), P = w(i, "showPagination", 3, !1), R = w(i, "paginationLabel", 3, ""), z = w(i, "firstPageLabel", 3, ""), B = w(i, "previousPageLabel", 3, ""), V = w(i, "nextPageLabel", 3, ""), H = w(i, "lastPageLabel", 3, ""), ee = w(i, "canGoFirst", 3, !1), K = w(i, "canGoPrevious", 3, !1), q = w(i, "canGoNext", 3, !1), J = w(i, "canGoLast", 3, !1), Y = w(i, "nextPageLoading", 3, !1), Z = w(i, "initialFocus", 3, "default"), Q = w(i, "onOpenAutoFocus", 3, void 0), $ = g(null), ce = A(), le = ce.overlayTarget, ue = ce.layoutMode === "container", de = k(() => Z() === "content");
	function fe(e) {
		e || i.onOpenChange?.(!1);
	}
	function pe(e) {
		Q() ? Q()(e) : m(de) && (e.preventDefault(), m($)?.focus({ preventScroll: !0 }));
	}
	function me(e) {
		e.preventDefault();
	}
	var he = l(), ge = x(he);
	a(ge, () => te, (n, r) => {
		r(n, {
			onOpenChange: fe,
			get open() {
				return u();
			},
			set open(e) {
				u(e);
			},
			children: (n, r) => {
				var u = l(), g = x(u);
				a(g, () => L, (n, r) => {
					r(n, {
						get to() {
							return le;
						},
						children: (n, r) => {
							var u = oe(), g = x(u);
							{
								let e = k(() => `dialog-overlay ${ue ? "dialog-container-layout" : ""}`);
								a(g, () => G, (t, n) => {
									n(t, { get class() {
										return m(e);
									} });
								});
							}
							var y = p(g, 2);
							{
								let n = k(() => `dialog ${M()} ${ue ? "dialog-container-layout" : ""}`), r = k(() => m(de) ? -1 : void 0);
								a(y, () => ne, (u, g) => {
									g(u, {
										get class() {
											return m(n);
										},
										get tabindex() {
											return m(r);
										},
										get trapFocus() {
											return j();
										},
										preventScroll: !1,
										get onInteractOutside() {
											return h();
										},
										get onEscapeKeydown() {
											return _();
										},
										onOpenAutoFocus: pe,
										onCloseAutoFocus: me,
										get ref() {
											return m($);
										},
										set ref(e) {
											S($, e, !0);
										},
										children: (n, r) => {
											var u = ae(), h = x(u);
											a(h, () => W, (e, n) => {
												n(e, {
													class: "visually-hidden",
													children: (e, n) => {
														b();
														var r = C();
														d(() => t(r, i.title)), c(e, r);
													},
													$$slots: { default: !0 }
												});
											});
											var g = p(h, 2);
											a(g, () => U, (e, n) => {
												n(e, {
													class: "visually-hidden",
													children: (e, n) => {
														b();
														var r = C();
														d(() => t(r, i.description)), c(e, r);
													},
													$$slots: { default: !0 }
												});
											});
											var _ = p(g, 2), y = f(_);
											o(y, () => i.children ?? v), e(_);
											var S = p(_, 2), w = (n) => {
												var r = ie();
												let a;
												var u = f(r), h = (n) => {
													var r = re(), a = f(r), u = f(a), h = (e) => {
														{
															let t = k(() => !ee());
															I(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-first-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return m(t);
																},
																get ariaLabel() {
																	return z();
																},
																get title() {
																	return z();
																},
																get onClick() {
																	return i.onFirstPage;
																},
																children: (e, t) => {
																	var n = X();
																	c(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													s(u, (e) => {
														(z() || i.onFirstPage) && e(h);
													});
													var g = p(u, 2);
													{
														let e = k(() => !K());
														I(g, {
															className: "dialog-page-button dialog-page-icon-button dialog-page-previous-button",
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return m(e);
															},
															get ariaLabel() {
																return B();
															},
															get title() {
																return B();
															},
															get onClick() {
																return i.onPreviousPage;
															},
															children: (e, t) => {
																var n = X();
																c(e, n);
															},
															$$slots: { default: !0 }
														});
													}
													e(a);
													var _ = p(a, 2), y = f(_), b = T(y, !0), S = p(y, 2);
													o(S, () => i.footer ?? v), e(_);
													var C = p(_, 2), w = f(C);
													{
														let e = k(() => `dialog-page-button dialog-page-icon-button dialog-page-next-button ${Y() ? "loading" : ""}`), t = k(() => !q() || Y());
														I(w, {
															get className() {
																return m(e);
															},
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return m(t);
															},
															get ariaLabel() {
																return V();
															},
															get title() {
																return V();
															},
															get onClick() {
																return i.onNextPage;
															},
															children: (e, t) => {
																var n = l(), r = x(n), i = (e) => {
																	F(e, {
																		showLoader: !0,
																		loaderSize: 30,
																		state: "loading",
																		customClass: "dialog-page-loading-placeholder"
																	});
																}, a = (e) => {
																	var t = X();
																	c(e, t);
																};
																s(r, (e) => {
																	Y() ? e(i) : e(a, -1);
																}), c(e, n);
															},
															$$slots: { default: !0 }
														});
													}
													var D = p(w, 2), O = (e) => {
														{
															let t = k(() => !J() || Y());
															I(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-last-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return m(t);
																},
																get ariaLabel() {
																	return H();
																},
																get title() {
																	return H();
																},
																get onClick() {
																	return i.onLastPage;
																},
																children: (e, t) => {
																	var n = X();
																	c(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													s(D, (e) => {
														(H() || i.onLastPage) && e(O);
													}), e(C), e(r), d(() => {
														E(r, "aria-label", R()), t(b, R());
													}), c(n, r);
												}, g = (e) => {
													var t = l(), n = x(t);
													o(n, () => i.footer ?? v), c(e, t);
												};
												s(u, (e) => {
													P() ? e(h) : e(g, -1);
												}), e(r), d(() => a = D(r, 1, "dialog-footer svelte-1jiham3", null, a, {
													"close-button-footer": N() === "close-button",
													"has-pagination": P()
												})), c(n, r);
											};
											s(S, (e) => {
												(i.footer || P()) && e(w);
											}), c(n, u);
										},
										$$slots: { default: !0 }
									});
								});
							}
							c(n, u);
						},
						$$slots: { default: !0 }
					});
				}), c(n, u);
			},
			$$slots: { default: !0 }
		});
	}), c(r, he), n();
}
export { Z as t };
