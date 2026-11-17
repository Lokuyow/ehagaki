import { A as e, Et as t, G as n, J as r, K as i, Mt as a, N as o, Nt as s, P as c, T as l, Tt as u, V as d, W as f, Y as p, _ as m, a as h, dt as g, ft as _, gt as v, i as y, jt as b, nt as x, pt as S, r as C, st as w, ut as T, vt as E, xt as D, y as O, z as k } from "./index-client-XkLzkVYC.js";
import { v as A } from "./relayConfigUtils-B4Q_AO1M.js";
import { et as j, o as M, s as N, st as P, t as ee } from "./LoadingPlaceholder-lit91akO.js";
import { l as te, s as F } from "./appUtils-BRia-Jm6.js";
import { a as I, b as L, c as R, g as z, h as B, i as V, l as H, m as U, n as ne, o as re, r as ie, s as W, x as G } from "./useDialogHistory.svelte-BgJftJRE.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function ae(e, r) {
	t(r, !0);
	let i = C(r, "open", 15, !1), a = C(r, "onOpenChange", 3, N), o = C(r, "onOpenChangeComplete", 3, N);
	G.create({
		variant: P(() => "dialog"),
		open: P(() => i(), (e) => {
			i(e), a()(e);
		}),
		onOpenChangeComplete: P(() => o())
	});
	var l = n(), d = g(l);
	c(d, () => r.children ?? s), f(e, l), u();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
var K = /* @__PURE__ */ new Set([
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
]), q = i("<!> <!>", 1), J = i("<!> <div><!></div>", 1);
function oe(e, i) {
	let o = r();
	t(i, !0);
	let l = C(i, "id", 19, () => M(o)), d = C(i, "ref", 15, null), p = C(i, "forceMount", 3, !1), _ = C(i, "onCloseAutoFocus", 3, N), v = C(i, "onOpenAutoFocus", 3, N), b = C(i, "onEscapeKeydown", 3, N), w = C(i, "onInteractOutside", 3, N), E = C(i, "trapFocus", 3, !0), O = C(i, "preventScroll", 3, !0), A = C(i, "preventOverflowTextSelection", 3, !0), ee = C(i, "restoreScrollDelay", 3, null), te = y(i, K), F = L.create({
		id: P(() => l()),
		ref: P(() => d(), (e) => d(e))
	}), I = D(() => j(te, F.props));
	var z = n(), V = g(z), ne = (e) => {
		H(e, {
			get ref() {
				return F.opts.ref;
			},
			loop: !0,
			get trapFocus() {
				return E();
			},
			get enabled() {
				return F.root.opts.open.current;
			},
			get onOpenAutoFocus() {
				return v();
			},
			get onCloseAutoFocus() {
				return _();
			},
			focusScope: (e, t) => {
				let r = () => (t?.()).props;
				U(e, h(() => x(I), {
					get enabled() {
						return F.root.opts.open.current;
					},
					get ref() {
						return F.opts.ref;
					},
					onEscapeKeydown: (e) => {
						b()(e), !e.defaultPrevented && F.root.handleClose();
					},
					children: (e, t) => {
						B(e, h(() => x(I), {
							get ref() {
								return F.opts.ref;
							},
							get enabled() {
								return F.root.opts.open.current;
							},
							onInteractOutside: (e) => {
								w()(e), !e.defaultPrevented && F.root.handleClose();
							},
							children: (e, t) => {
								R(e, h(() => x(I), {
									get preventOverflowTextSelection() {
										return A();
									},
									get ref() {
										return F.opts.ref;
									},
									get enabled() {
										return F.root.opts.open.current;
									},
									children: (e, t) => {
										var o = n(), l = g(o), u = (e) => {
											var t = q(), n = g(t), a = (e) => {
												W(e, {
													get preventScroll() {
														return O();
													},
													get restoreScrollDelay() {
														return ee();
													}
												});
											};
											k(n, (e) => {
												F.root.opts.open.current && e(a);
											});
											var o = S(n, 2);
											{
												let e = D(() => ({
													props: j(x(I), r()),
													...F.snippetProps
												}));
												c(o, () => i.child, () => x(e));
											}
											f(e, t);
										}, d = (e) => {
											var t = J(), n = g(t);
											W(n, { get preventScroll() {
												return O();
											} });
											var o = S(n, 2);
											m(o, (e) => ({ ...e }), [() => j(x(I), r())]);
											var l = T(o);
											c(l, () => i.children ?? s), a(o), f(e, t);
										};
										k(l, (e) => {
											i.child ? e(u) : e(d, -1);
										}), f(e, o);
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
	k(V, (e) => {
		(F.shouldRender || p()) && e(ne);
	}), f(e, z), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DialogWrapper.svelte
var Y = i("<span class=\"svg-icon\"></span>"), se = i("<div class=\"dialog-pagination svelte-1jiham3\"><div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div> <div class=\"dialog-page-center svelte-1jiham3\"><div class=\"dialog-page-indicator svelte-1jiham3\"> </div> <!></div> <div class=\"dialog-page-button-group svelte-1jiham3\"><!> <!></div></div>"), ce = i("<div><!></div>"), le = i("<!> <!> <div class=\"dialog-content svelte-1jiham3\"><!></div> <!>", 1), ue = i("<!> <!>", 1), de = {
	hash: "svelte-1jiham3",
	code: "\n    /* ダイアログ共通スタイル */.dialog-overlay {position:fixed;inset:0;background-color:var(--dialog-bg-overlay);z-index:calc(100 + var(--bits-dialog-depth, 0) * 2);}.dialog {position:fixed;top:50%;left:50%;translate:-50% -50%;background:var(--dialog-bg);color:var(--text);width:100%;max-width:600px;display:flex;flex-direction:column;align-items:center;z-index:calc(101 + var(--bits-dialog-depth, 0) * 2);}.dialog-overlay.dialog-container-layout {position:absolute;}.dialog.dialog-container-layout {position:absolute;max-height:100%;}.dialog:focus {outline:none;}.dialog-content.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;width:100%;max-height:85svh;padding:16px;overflow-y:auto;}.dialog.dialog-container-layout .dialog-content.svelte-1jiham3 {max-height:calc(100% - 50px);}.dialog-footer.svelte-1jiham3 {width:100%;box-sizing:content-box;display:flex;flex-direction:column;justify-content:center;align-items:center;}.dialog-pagination.svelte-1jiham3 {display:flex;align-items:stretch;justify-content:space-between;gap:8px;width:100%;padding:6px;border-top:1px solid var(--border-hr);}.dialog-page-button-group.svelte-1jiham3 {display:flex;align-items:stretch;gap:4px;flex:1 0 auto;.dialog-page-icon-button {width:44px;}.dialog-page-button {--icon-size: 32px;min-width:44px;height:auto;min-height:44px;flex:1 0 auto;}}.dialog-page-center.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;flex:1 0 auto;}.dialog-page-indicator.svelte-1jiham3 {min-width:0;color:var(--text-muted);font-size:0.82rem;text-align:center;white-space:nowrap;}.dialog-page-first-button .svg-icon {mask-image:var(--ehagaki-icon-66697273745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-previous-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-next-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-last-button .svg-icon {mask-image:var(--ehagaki-icon-6c6173745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-loading-placeholder {color:var(--text);column-gap:2px;}.dialog-page-loading-placeholder .placeholder-text {color:inherit;font-size:1rem;}.dialog-page-loading-placeholder .loader-container .square {background-color:currentColor;}\n\n    /* 閉じるボタン付きフッター用スタイル */.dialog-footer.close-button-footer.svelte-1jiham3 {border-top:1px solid var(--border-hr);.modal-close {--btn-bg: var(--dialog-bg);border:none;border-radius:0;width:100%;height:50px;}}.dialog-footer.close-button-footer.has-pagination.svelte-1jiham3 {border-top:none;.modal-close {--icon-size: 20px;border:1px solid var(--btn-border);border-radius:50px;width:100%;min-width:72px;min-height:44px;}}.modal-close:active:not(:disabled) {scale:1;}.visually-hidden {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;}"
};
function X(r, i) {
	t(i, !0), e(r, de);
	let m = C(i, "open", 15, !1), h = C(i, "onInteractOutside", 3, void 0), y = C(i, "onEscapeKeydown", 3, void 0), j = C(i, "trapFocus", 3, !0), M = C(i, "contentClass", 3, ""), N = C(i, "footerVariant", 3, "default"), P = C(i, "showPagination", 3, !1), L = C(i, "paginationLabel", 3, ""), R = C(i, "firstPageLabel", 3, ""), B = C(i, "previousPageLabel", 3, ""), H = C(i, "nextPageLabel", 3, ""), U = C(i, "lastPageLabel", 3, ""), W = C(i, "canGoFirst", 3, !1), G = C(i, "canGoPrevious", 3, !1), K = C(i, "canGoNext", 3, !1), q = C(i, "canGoLast", 3, !1), J = C(i, "nextPageLoading", 3, !1), X = C(i, "initialFocus", 3, "default"), fe = C(i, "onOpenAutoFocus", 3, void 0), pe = C(i, "restoreFocusOnClose", 15, !0), me = C(i, "returnFocus", 3, null), Z = E(null), Q = null, he = A(), ge = he.overlayTarget, $ = he.layoutMode === "container", _e = D(() => X() === "content");
	function ve(e) {
		e || i.onOpenChange?.(!1);
	}
	function ye(e) {
		pe(!0), Q = V(Q, ie(A().document), x(Z)), fe() ? fe()(e) : x(_e) && (e.preventDefault(), x(Z)?.focus({ preventScroll: !0 }));
	}
	function be(e) {
		ne(e, {
			restore: pe(),
			explicit: me(),
			opener: Q,
			container: x(Z)
		});
	}
	var xe = n(), Se = g(xe);
	o(Se, () => ae, (e, t) => {
		t(e, {
			onOpenChange: ve,
			get open() {
				return m();
			},
			set open(e) {
				m(e);
			},
			children: (e, t) => {
				var r = n(), u = g(r);
				o(u, () => te, (e, t) => {
					t(e, {
						get to() {
							return ge;
						},
						children: (e, t) => {
							var r = ue(), u = g(r);
							{
								let e = D(() => `dialog-overlay ${$ ? "dialog-container-layout" : ""}`);
								o(u, () => re, (t, n) => {
									n(t, { get class() {
										return x(e);
									} });
								});
							}
							var m = S(u, 2);
							{
								let e = D(() => `dialog ${M()} ${$ ? "dialog-container-layout" : ""}`), t = D(() => x(_e) ? -1 : void 0);
								o(m, () => oe, (r, u) => {
									u(r, {
										get class() {
											return x(e);
										},
										get tabindex() {
											return x(t);
										},
										get trapFocus() {
											return j();
										},
										preventScroll: !1,
										get onInteractOutside() {
											return h();
										},
										get onEscapeKeydown() {
											return y();
										},
										onOpenAutoFocus: ye,
										onCloseAutoFocus: be,
										get ref() {
											return x(Z);
										},
										set ref(e) {
											v(Z, e, !0);
										},
										children: (e, t) => {
											var r = le(), u = g(r);
											o(u, () => z, (e, t) => {
												t(e, {
													class: "visually-hidden",
													children: (e, t) => {
														b();
														var n = p();
														w(() => d(n, i.title)), f(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var m = S(u, 2);
											o(m, () => I, (e, t) => {
												t(e, {
													class: "visually-hidden",
													children: (e, t) => {
														b();
														var n = p();
														w(() => d(n, i.description)), f(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var h = S(m, 2), v = T(h);
											c(v, () => i.children ?? s), a(h);
											var y = S(h, 2), C = (e) => {
												var t = ce();
												let r;
												var o = T(t), u = (e) => {
													var t = se(), r = T(t), o = T(r), l = (e) => {
														{
															let t = D(() => !W());
															F(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-first-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return x(t);
																},
																get ariaLabel() {
																	return R();
																},
																get title() {
																	return R();
																},
																get onClick() {
																	return i.onFirstPage;
																},
																children: (e, t) => {
																	var n = Y();
																	f(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													k(o, (e) => {
														(R() || i.onFirstPage) && e(l);
													});
													var u = S(o, 2);
													{
														let e = D(() => !G());
														F(u, {
															className: "dialog-page-button dialog-page-icon-button dialog-page-previous-button",
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return x(e);
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
																var n = Y();
																f(e, n);
															},
															$$slots: { default: !0 }
														});
													}
													a(r);
													var p = S(r, 2), m = T(p), h = _(m, !0), v = S(m, 2);
													c(v, () => i.footer ?? s), a(p);
													var y = S(p, 2), b = T(y);
													{
														let e = D(() => `dialog-page-button dialog-page-icon-button dialog-page-next-button ${J() ? "loading" : ""}`), t = D(() => !K() || J());
														F(b, {
															get className() {
																return x(e);
															},
															variant: "default",
															shape: "pill",
															contentLayout: "icon",
															get disabled() {
																return x(t);
															},
															get ariaLabel() {
																return H();
															},
															get title() {
																return H();
															},
															get onClick() {
																return i.onNextPage;
															},
															children: (e, t) => {
																var r = n(), i = g(r), a = (e) => {
																	ee(e, {
																		showLoader: !0,
																		loaderSize: 30,
																		state: "loading",
																		customClass: "dialog-page-loading-placeholder"
																	});
																}, o = (e) => {
																	var t = Y();
																	f(e, t);
																};
																k(i, (e) => {
																	J() ? e(a) : e(o, -1);
																}), f(e, r);
															},
															$$slots: { default: !0 }
														});
													}
													var C = S(b, 2), E = (e) => {
														{
															let t = D(() => !q() || J());
															F(e, {
																className: "dialog-page-button dialog-page-icon-button dialog-page-last-button",
																variant: "default",
																shape: "pill",
																contentLayout: "icon",
																get disabled() {
																	return x(t);
																},
																get ariaLabel() {
																	return U();
																},
																get title() {
																	return U();
																},
																get onClick() {
																	return i.onLastPage;
																},
																children: (e, t) => {
																	var n = Y();
																	f(e, n);
																},
																$$slots: { default: !0 }
															});
														}
													};
													k(C, (e) => {
														(U() || i.onLastPage) && e(E);
													}), a(y), a(t), w(() => {
														O(t, "aria-label", L()), d(h, L());
													}), f(e, t);
												}, p = (e) => {
													var t = n(), r = g(t);
													c(r, () => i.footer ?? s), f(e, t);
												};
												k(o, (e) => {
													P() ? e(u) : e(p, -1);
												}), a(t), w(() => r = l(t, 1, "dialog-footer svelte-1jiham3", null, r, {
													"close-button-footer": N() === "close-button",
													"has-pagination": P()
												})), f(e, t);
											};
											k(y, (e) => {
												(i.footer || P()) && e(C);
											}), f(e, r);
										},
										$$slots: { default: !0 }
									});
								});
							}
							f(e, r);
						},
						$$slots: { default: !0 }
					});
				}), f(e, r);
			},
			$$slots: { default: !0 }
		});
	}), f(r, xe), u();
}
export { X as t };
