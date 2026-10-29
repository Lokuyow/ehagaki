import { G as e, Mt as t, N as n, Q as r, R as i, Tt as a, U as o, W as s, _t as c, a as l, bt as u, ft as d, ht as f, i as p, n as m, pt as h, r as g, rt as _, st as v, tt as y, ut as b, wt as x } from "./index-client-57Odq85c.js";
import { B as S, G as C, Q as w, W as T, X as E, Y as D, d as O, dt as k, et as A, g as j, ot as M, r as N, rt as P, st as F, tt as I } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { a as L, d as R, f as ee, i as z, o as te } from "./useDialogHistory.svelte-BddVYV4P.js";
import { a as ne, c as re, i as ie, l as ae, n as oe, o as se, r as ce, s as le, t as ue } from "./floating-ui.dom-BRmGhLhL.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/floating-root.svelte.js
var B = new w("Floating.Root"), V = new w("Floating.Root"), H = class e {
	static create(t = !1) {
		return t ? V.set(new e()) : B.set(new e());
	}
	anchorNode = k(null);
	customAnchorNode = k(null);
	triggerNode = k(null);
	constructor() {
		v(() => {
			this.customAnchorNode.current ? typeof this.customAnchorNode.current == "string" ? this.anchorNode.current = document.querySelector(this.customAnchorNode.current) : this.anchorNode.current = this.customAnchorNode.current : this.anchorNode.current = this.triggerNode.current;
		});
	}
}, U = class e {
	static create(t, n = !1) {
		return n ? new e(t, V.get()) : new e(t, B.get());
	}
	opts;
	root;
	constructor(e, t) {
		this.opts = e, this.root = t, t.triggerNode = e.virtualEl && e.virtualEl.current ? M(e.virtualEl.current) : e.ref;
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
function de(e, r) {
	a(r, !0);
	let i = g(r, "tooltip", 3, !1);
	H.create(_(() => i()));
	var c = s(), l = b(c);
	n(l, () => r.children ?? t), o(e, c), x();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/floating-svelte/floating-utils.svelte.js
function W(e) {
	return typeof e == "function" ? e() : e;
}
function G(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function K(e, t) {
	let n = G(e);
	return Math.round(t * n) / n;
}
function fe(e) {
	return {
		[`--bits-${e}-content-transform-origin`]: "var(--bits-floating-transform-origin)",
		[`--bits-${e}-content-available-width`]: "var(--bits-floating-available-width)",
		[`--bits-${e}-content-available-height`]: "var(--bits-floating-available-height)",
		[`--bits-${e}-anchor-width`]: "var(--bits-floating-anchor-width)",
		[`--bits-${e}-anchor-height`]: "var(--bits-floating-anchor-height)"
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte
function pe(e, r) {
	a(r, !0);
	let i = g(r, "tooltip", 3, !1);
	U.create({
		id: F(() => r.id),
		virtualEl: F(() => r.virtualEl),
		ref: _(() => r.ref)
	}, _(() => i()));
	var c = s(), l = b(c);
	n(l, () => r.children ?? t), o(e, c), x();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function me(e) {
	let t = e.whileElementsMounted, n = u(() => W(e.open) ?? !0), r = u(() => W(e.middleware)), i = u(() => W(e.transform) ?? !0), a = u(() => W(e.placement) ?? "bottom"), o = u(() => W(e.strategy) ?? "absolute"), s = u(() => W(e.sideOffset) ?? 0), l = u(() => W(e.alignOffset) ?? 0), d = e.reference, p = c(0), m = c(0), g = k(null), _ = c(h(y(o))), b = c(h(y(a))), x = c(h({})), S = c(!1), C = !1, w = 0, T = !1, E = u(() => {
		let e = g.current ? K(g.current, y(p)) : y(p), t = g.current ? K(g.current, y(m)) : y(m);
		return y(i) ? {
			position: y(_),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...g.current && G(g.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: y(_),
			left: `${e}px`,
			top: `${t}px`
		};
	}), D;
	function O() {
		if (T || d.current === null || g.current === null) return;
		let e = d.current, t = g.current, i = ++w;
		ce(e, t, {
			middleware: y(r),
			placement: y(a),
			strategy: y(o)
		}).then((r) => {
			if (i === w && d.current === e && g.current === t) {
				if (he(e)) f(x, {
					...y(x),
					hide: {
						...y(x).hide,
						referenceHidden: !0
					}
				}, !0);
				else {
					if (!y(n) && y(p) !== 0 && y(m) !== 0) {
						let e = Math.max(Math.abs(y(s)), Math.abs(y(l)), 15);
						if (r.x <= e && r.y <= e) return;
					}
					f(p, r.x, !0), f(m, r.y, !0), f(_, r.strategy, !0), f(b, r.placement, !0), f(x, r.middlewareData, !0), f(S, !0);
				}
			}
		});
	}
	function A() {
		typeof D == "function" && (D(), D = void 0), w++;
	}
	function j() {
		A(), t === void 0 ? O() : y(n) && d.current !== null && g.current !== null && (D = t(d.current, g.current, O));
	}
	function M() {
		!y(n) && g.current === null && f(S, !1);
	}
	function N() {
		return [
			y(r),
			y(a),
			y(o),
			y(s),
			y(l),
			y(n)
		];
	}
	return v(() => {
		t === void 0 && y(n) && O();
	}), v(j), v(() => {
		t !== void 0 && (N(), y(n) && y(S) ? C ? O() : C = !0 : C = !1);
	}), v(M), v(() => () => {
		T = !0, A();
	}), {
		floating: g,
		reference: d,
		get strategy() {
			return y(_);
		},
		get placement() {
			return y(b);
		},
		get middlewareData() {
			return y(x);
		},
		get isPositioned() {
			return y(S);
		},
		get floatingStyles() {
			return y(E);
		},
		get update() {
			return O;
		}
	};
}
function he(e) {
	return e instanceof Element ? !e.isConnected || e instanceof HTMLElement && e.hidden ? !0 : e.getClientRects().length === 0 : !1;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/use-floating-layer.svelte.js
var ge = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
}, q = new w("Floating.Content"), _e = class e {
	static create(t, n = !1) {
		return n ? q.set(new e(t, V.get())) : q.set(new e(t, B.get()));
	}
	opts;
	root;
	contentRef = k(null);
	wrapperRef = k(null);
	arrowRef = k(null);
	contentAttachment = S(this.contentRef);
	wrapperAttachment = S(this.wrapperRef);
	arrowAttachment = S(this.arrowRef);
	arrowId = k(N());
	#e = u(() => {
		if (typeof this.opts.style == "string") return P(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new D(() => this.arrowRef.current ?? void 0);
	#r = u(() => this.#n?.width ?? 0);
	#i = u(() => this.#n?.height ?? 0);
	#a = u(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = u(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#s = u(() => y(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return y(this.#s);
	}
	set hasExplicitBoundaries(e) {
		f(this.#s, e);
	}
	#c = u(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: y(this.#o).filter(j),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return y(this.#c);
	}
	set detectOverflowOptions(e) {
		f(this.#c, e);
	}
	#l = c(void 0);
	#u = c(void 0);
	#d = c(void 0);
	#f = c(void 0);
	#p = u(() => [
		le({
			mainAxis: this.opts.sideOffset.current + y(this.#i),
			alignmentAxis: this.opts.alignOffset.current
		}),
		this.opts.avoidCollisions.current && re({
			mainAxis: !0,
			crossAxis: !1,
			limiter: this.opts.sticky.current === "partial" ? se() : void 0,
			...this.detectOverflowOptions
		}),
		this.opts.avoidCollisions.current && ie({ ...this.detectOverflowOptions }),
		ae({
			...this.detectOverflowOptions,
			apply: ({ rects: e, availableWidth: t, availableHeight: n }) => {
				let { width: r, height: i } = e.reference;
				f(this.#l, t, !0), f(this.#u, n, !0), f(this.#d, r, !0), f(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && ue({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		ve({
			arrowWidth: y(this.#r),
			arrowHeight: y(this.#i)
		}),
		this.opts.hideWhenDetached.current && ne({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return y(this.#p);
	}
	set middleware(e) {
		f(this.#p, e);
	}
	floating;
	#m = u(() => ye(this.floating.placement));
	get placedSide() {
		return y(this.#m);
	}
	set placedSide(e) {
		f(this.#m, e);
	}
	#h = u(() => be(this.floating.placement));
	get placedAlign() {
		return y(this.#h);
	}
	set placedAlign(e) {
		f(this.#h, e);
	}
	#g = u(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return y(this.#g);
	}
	set arrowX(e) {
		f(this.#g, e);
	}
	#_ = u(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return y(this.#_);
	}
	set arrowY(e) {
		f(this.#_, e);
	}
	#v = u(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return y(this.#v);
	}
	set cannotCenterArrow(e) {
		f(this.#v, e);
	}
	#y = c("auto");
	get contentZIndex() {
		return y(this.#y);
	}
	set contentZIndex(e) {
		f(this.#y, e, !0);
	}
	#b = u(() => ge[this.placedSide]);
	get arrowBaseSide() {
		return y(this.#b);
	}
	set arrowBaseSide(e) {
		f(this.#b, e);
	}
	#x = u(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${y(this.#l)}px`,
			"--bits-floating-available-height": `${y(this.#u)}px`,
			"--bits-floating-anchor-width": `${y(this.#d)}px`,
			"--bits-floating-anchor-height": `${y(this.#f)}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...y(this.#e)
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return y(this.#x);
	}
	set wrapperProps(e) {
		f(this.#x, e);
	}
	#S = u(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: I({ ...y(this.#e) }),
		...this.contentAttachment
	}));
	get props() {
		return y(this.#S);
	}
	set props(e) {
		f(this.#S, e);
	}
	#C = u(() => ({
		position: "absolute",
		left: this.arrowX ? `${this.arrowX}px` : void 0,
		top: this.arrowY ? `${this.arrowY}px` : void 0,
		[this.arrowBaseSide]: 0,
		"transform-origin": {
			top: "",
			right: "0 0",
			bottom: "center 0",
			left: "100% 0"
		}[this.placedSide],
		transform: {
			top: "translateY(100%)",
			right: "translateY(50%) rotate(90deg) translateX(-50%)",
			bottom: "rotate(180deg)",
			left: "translateY(50%) rotate(-90deg) translateX(50%)"
		}[this.placedSide],
		visibility: this.cannotCenterArrow ? "hidden" : void 0
	}));
	get arrowStyle() {
		return y(this.#C);
	}
	set arrowStyle(e) {
		f(this.#C, e);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), E(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = me({
			strategy: () => this.opts.strategy.current,
			placement: () => y(this.#a),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...e) => oe(...e, { animationFrame: this.#t?.current === "always" }),
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		}), v(() => {
			this.floating.isPositioned && this.opts.onPlaced?.current();
		}), E([() => this.contentRef.current, () => this.opts.enabled.current], ([e, t]) => {
			if (!e || !t) return;
			let n = C(e), r = n.requestAnimationFrame(() => {
				if (this.contentRef.current !== e || !this.opts.enabled.current) return;
				let t = n.getComputedStyle(e).zIndex;
				t !== this.contentZIndex && (this.contentZIndex = t);
			});
			return () => {
				n.cancelAnimationFrame(r);
			};
		}), v(() => {
			this.floating.floating.current = this.wrapperRef.current;
		});
	}
};
function ve(e) {
	return {
		name: "transformOrigin",
		options: e,
		fn(t) {
			let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = J(n), u = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[l], d = (i.arrow?.x ?? 0) + o / 2, f = (i.arrow?.y ?? 0) + s / 2, p = "", m = "";
			return c === "bottom" ? (p = a ? u : `${d}px`, m = `${-s}px`) : c === "top" ? (p = a ? u : `${d}px`, m = `${r.floating.height + s}px`) : c === "right" ? (p = `${-s}px`, m = a ? u : `${f}px`) : c === "left" && (p = `${r.floating.width + s}px`, m = a ? u : `${f}px`), { data: {
				x: p,
				y: m
			} };
		}
	};
}
function J(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
function ye(e) {
	return J(e)[0];
}
function be(e) {
	return J(e)[1];
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte
function xe(e, r) {
	a(r, !0);
	let i = g(r, "side", 3, "bottom"), c = g(r, "sideOffset", 3, 0), l = g(r, "align", 3, "center"), d = g(r, "alignOffset", 3, 0), f = g(r, "arrowPadding", 3, 0), p = g(r, "avoidCollisions", 3, !0), m = g(r, "collisionBoundary", 19, () => []), h = g(r, "collisionPadding", 3, 0), v = g(r, "hideWhenDetached", 3, !1), S = g(r, "onPlaced", 3, () => {}), C = g(r, "sticky", 3, "partial"), w = g(r, "updatePositionStrategy", 3, "optimized"), T = g(r, "strategy", 3, "fixed"), E = g(r, "dir", 3, "ltr"), D = g(r, "style", 19, () => ({})), O = g(r, "wrapperId", 19, N), k = g(r, "customAnchor", 3, null), j = g(r, "tooltip", 3, !1), M = _e.create({
		side: F(() => i()),
		sideOffset: F(() => c()),
		align: F(() => l()),
		alignOffset: F(() => d()),
		id: F(() => r.id),
		arrowPadding: F(() => f()),
		avoidCollisions: F(() => p()),
		collisionBoundary: F(() => m()),
		collisionPadding: F(() => h()),
		hideWhenDetached: F(() => v()),
		onPlaced: F(() => S()),
		sticky: F(() => C()),
		updatePositionStrategy: F(() => w()),
		strategy: F(() => T()),
		dir: F(() => E()),
		style: F(() => D()),
		enabled: F(() => r.enabled),
		wrapperId: F(() => O()),
		customAnchor: F(() => k())
	}, _(() => j())), P = u(() => A(M.wrapperProps, { style: { pointerEvents: "auto" } }));
	var I = s(), L = b(I);
	n(L, () => r.content ?? t, () => ({
		props: M.props,
		wrapperProps: y(P)
	})), o(e, I), x();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function Se(e, r) {
	a(r, !0), m(() => {
		r.onPlaced?.();
	});
	var i = s(), c = b(i);
	n(c, () => r.content ?? t, () => ({
		props: {},
		wrapperProps: {}
	})), o(e, i), x();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte
var Ce = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"content",
	"isStatic",
	"onPlaced"
]);
function we(e, t) {
	let n = g(t, "isStatic", 3, !1), r = p(t, Ce);
	var a = s(), c = b(a), u = (e) => {
		Se(e, {
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		});
	}, d = (e) => {
		xe(e, l({
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		}, () => r));
	};
	i(c, (e) => {
		n() ? e(u) : e(d, -1);
	}), o(e, a);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var Y = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.forceMount.ref.tooltip.contentPointerEvents".split(".")), Te = e("<!> <!>", 1);
function X(e, r) {
	a(r, !0);
	let c = g(r, "interactOutsideBehavior", 3, "close"), l = g(r, "trapFocus", 3, !0), f = g(r, "isValidEvent", 3, () => !1), m = g(r, "customAnchor", 3, null), h = g(r, "isStatic", 3, !1), _ = g(r, "tooltip", 3, !1), v = g(r, "contentPointerEvents", 3, "auto"), S = p(r, Y), C = u(() => r.preventScroll ?? !0), w = u(() => r.strategy ?? (y(C) ? "fixed" : "absolute"));
	we(e, {
		get isStatic() {
			return h();
		},
		get id() {
			return r.id;
		},
		get side() {
			return r.side;
		},
		get sideOffset() {
			return r.sideOffset;
		},
		get align() {
			return r.align;
		},
		get alignOffset() {
			return r.alignOffset;
		},
		get arrowPadding() {
			return r.arrowPadding;
		},
		get avoidCollisions() {
			return r.avoidCollisions;
		},
		get collisionBoundary() {
			return r.collisionBoundary;
		},
		get collisionPadding() {
			return r.collisionPadding;
		},
		get sticky() {
			return r.sticky;
		},
		get hideWhenDetached() {
			return r.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return r.updatePositionStrategy;
		},
		get strategy() {
			return y(w);
		},
		get dir() {
			return r.dir;
		},
		get wrapperId() {
			return r.wrapperId;
		},
		get style() {
			return r.style;
		},
		get onPlaced() {
			return r.onPlaced;
		},
		get customAnchor() {
			return m();
		},
		get enabled() {
			return r.enabled;
		},
		get tooltip() {
			return _();
		},
		content: (e, a) => {
			let p = () => (a?.()).props, m = () => (a?.()).wrapperProps;
			var h = Te(), g = b(h), _ = (e) => {
				z(e, { get preventScroll() {
					return y(C);
				} });
			}, x = (e) => {
				z(e, { get preventScroll() {
					return y(C);
				} });
			};
			i(g, (e) => {
				r.forceMount && r.enabled ? e(_) : r.forceMount || e(x, 1);
			});
			var w = d(g, 2);
			te(w, {
				get onOpenAutoFocus() {
					return r.onOpenAutoFocus;
				},
				get onCloseAutoFocus() {
					return r.onCloseAutoFocus;
				},
				get loop() {
					return r.loop;
				},
				get enabled() {
					return r.enabled;
				},
				get trapFocus() {
					return l();
				},
				get forceMount() {
					return r.forceMount;
				},
				get ref() {
					return r.ref;
				},
				focusScope: (e, i) => {
					let a = () => (i?.()).props;
					R(e, {
						get onEscapeKeydown() {
							return r.onEscapeKeydown;
						},
						get escapeKeydownBehavior() {
							return r.escapeKeydownBehavior;
						},
						get enabled() {
							return r.enabled;
						},
						get ref() {
							return r.ref;
						},
						children: (e, i) => {
							ee(e, {
								get id() {
									return r.id;
								},
								get onInteractOutside() {
									return r.onInteractOutside;
								},
								get onFocusOutside() {
									return r.onFocusOutside;
								},
								get interactOutsideBehavior() {
									return c();
								},
								get isValidEvent() {
									return f();
								},
								get enabled() {
									return r.enabled;
								},
								get ref() {
									return r.ref;
								},
								children: (e, i) => {
									let c = () => (i?.()).props;
									L(e, {
										get id() {
											return r.id;
										},
										get preventOverflowTextSelection() {
											return r.preventOverflowTextSelection;
										},
										get onPointerDown() {
											return r.onPointerDown;
										},
										get onPointerUp() {
											return r.onPointerUp;
										},
										get enabled() {
											return r.enabled;
										},
										get ref() {
											return r.ref;
										},
										children: (e, i) => {
											var l = s(), d = b(l);
											{
												let e = u(() => ({
													props: A(S, p(), c(), a(), {
														id: r.id,
														style: { pointerEvents: v() }
													}),
													wrapperProps: m()
												}));
												n(d, () => r.popper ?? t, () => y(e));
											}
											o(e, l);
										},
										$$slots: { default: !0 }
									});
								},
								$$slots: { default: !0 }
							});
						},
						$$slots: { default: !0 }
					});
				},
				$$slots: { focusScope: !0 }
			}), o(e, h);
		},
		$$slots: { content: !0 }
	}), x();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var Ee = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function De(e, t) {
	let n = g(t, "interactOutsideBehavior", 3, "close"), r = g(t, "trapFocus", 3, !0), a = g(t, "isValidEvent", 3, () => !1), c = g(t, "customAnchor", 3, null), u = g(t, "isStatic", 3, !1), d = p(t, Ee);
	var f = s(), m = b(f), h = (e) => {
		X(e, l({
			get popper() {
				return t.popper;
			},
			get onEscapeKeydown() {
				return t.onEscapeKeydown;
			},
			get escapeKeydownBehavior() {
				return t.escapeKeydownBehavior;
			},
			get preventOverflowTextSelection() {
				return t.preventOverflowTextSelection;
			},
			get id() {
				return t.id;
			},
			get onPointerDown() {
				return t.onPointerDown;
			},
			get onPointerUp() {
				return t.onPointerUp;
			},
			get side() {
				return t.side;
			},
			get sideOffset() {
				return t.sideOffset;
			},
			get align() {
				return t.align;
			},
			get alignOffset() {
				return t.alignOffset;
			},
			get arrowPadding() {
				return t.arrowPadding;
			},
			get avoidCollisions() {
				return t.avoidCollisions;
			},
			get collisionBoundary() {
				return t.collisionBoundary;
			},
			get collisionPadding() {
				return t.collisionPadding;
			},
			get sticky() {
				return t.sticky;
			},
			get hideWhenDetached() {
				return t.hideWhenDetached;
			},
			get updatePositionStrategy() {
				return t.updatePositionStrategy;
			},
			get strategy() {
				return t.strategy;
			},
			get dir() {
				return t.dir;
			},
			get preventScroll() {
				return t.preventScroll;
			},
			get wrapperId() {
				return t.wrapperId;
			},
			get style() {
				return t.style;
			},
			get onPlaced() {
				return t.onPlaced;
			},
			get customAnchor() {
				return c();
			},
			get isStatic() {
				return u();
			},
			get enabled() {
				return t.open;
			},
			get onInteractOutside() {
				return t.onInteractOutside;
			},
			get onCloseAutoFocus() {
				return t.onCloseAutoFocus;
			},
			get onOpenAutoFocus() {
				return t.onOpenAutoFocus;
			},
			get interactOutsideBehavior() {
				return n();
			},
			get loop() {
				return t.loop;
			},
			get trapFocus() {
				return r();
			},
			get isValidEvent() {
				return a();
			},
			get onFocusOutside() {
				return t.onFocusOutside;
			},
			forceMount: !1,
			get ref() {
				return t.ref;
			}
		}, () => d));
	};
	i(m, (e) => {
		t.shouldRender && e(h);
	}), o(e, f);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var Oe = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function ke(e, t) {
	let n = g(t, "interactOutsideBehavior", 3, "close"), r = g(t, "trapFocus", 3, !0), i = g(t, "isValidEvent", 3, () => !1), a = g(t, "customAnchor", 3, null), o = g(t, "isStatic", 3, !1), s = p(t, Oe);
	X(e, l({
		get popper() {
			return t.popper;
		},
		get onEscapeKeydown() {
			return t.onEscapeKeydown;
		},
		get escapeKeydownBehavior() {
			return t.escapeKeydownBehavior;
		},
		get preventOverflowTextSelection() {
			return t.preventOverflowTextSelection;
		},
		get id() {
			return t.id;
		},
		get onPointerDown() {
			return t.onPointerDown;
		},
		get onPointerUp() {
			return t.onPointerUp;
		},
		get side() {
			return t.side;
		},
		get sideOffset() {
			return t.sideOffset;
		},
		get align() {
			return t.align;
		},
		get alignOffset() {
			return t.alignOffset;
		},
		get arrowPadding() {
			return t.arrowPadding;
		},
		get avoidCollisions() {
			return t.avoidCollisions;
		},
		get collisionBoundary() {
			return t.collisionBoundary;
		},
		get collisionPadding() {
			return t.collisionPadding;
		},
		get sticky() {
			return t.sticky;
		},
		get hideWhenDetached() {
			return t.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return t.updatePositionStrategy;
		},
		get strategy() {
			return t.strategy;
		},
		get dir() {
			return t.dir;
		},
		get preventScroll() {
			return t.preventScroll;
		},
		get wrapperId() {
			return t.wrapperId;
		},
		get style() {
			return t.style;
		},
		get onPlaced() {
			return t.onPlaced;
		},
		get customAnchor() {
			return a();
		},
		get isStatic() {
			return o();
		},
		get enabled() {
			return t.enabled;
		},
		get onInteractOutside() {
			return t.onInteractOutside;
		},
		get onCloseAutoFocus() {
			return t.onCloseAutoFocus;
		},
		get onOpenAutoFocus() {
			return t.onOpenAutoFocus;
		},
		get interactOutsideBehavior() {
			return n();
		},
		get loop() {
			return t.loop;
		},
		get trapFocus() {
			return r();
		},
		get isValidEvent() {
			return i();
		},
		get onFocusOutside() {
			return t.onFocusOutside;
		}
	}, () => s, { forceMount: !0 }));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/safe-polygon.svelte.js
function Z(e, t) {
	let [n, r] = e, i = !1, a = t.length;
	for (let e = 0, o = a - 1; e < a; o = e++) {
		let [a, s] = t[e] ?? [0, 0], [c, l] = t[o] ?? [0, 0];
		s >= r != l >= r && n <= (c - a) * (r - s) / (l - s) + a && (i = !i);
	}
	return i;
}
function Q(e, t) {
	return e[0] >= t.left && e[0] <= t.right && e[1] >= t.top && e[1] <= t.bottom;
}
function $(e, t) {
	let n = e.left + e.width / 2, r = e.top + e.height / 2, i = t.left + t.width / 2, a = t.top + t.height / 2, o = i - n, s = a - r;
	return Math.abs(o) > Math.abs(s) ? o > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
var Ae = class {
	#e;
	#t;
	#n;
	#r = null;
	#i = null;
	#a = [];
	#o = null;
	#s = null;
	#c = null;
	#l() {
		this.#s !== null && (cancelAnimationFrame(this.#s), this.#s = null);
	}
	#u() {
		this.#l(), this.#s = requestAnimationFrame(() => {
			this.#s = null, this.#r && this.#i && (this.#m(), this.#e.onPointerExit());
		});
	}
	#d() {
		this.#c !== null && (clearTimeout(this.#c), this.#c = null);
	}
	#f() {
		this.#n !== null && (this.#d(), this.#c = window.setTimeout(() => {
			this.#c = null, this.#r && this.#i && (this.#m(), this.#e.onPointerExit());
		}, this.#n));
	}
	constructor(e) {
		this.#e = e, this.#t = e.buffer ?? 1;
		let t = e.transitIntentTimeout;
		this.#n = typeof t == "number" && t > 0 ? t : null, E([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (!e || !t || !n) {
				this.#o = null, this.#m();
				return;
			}
			this.#o && this.#o !== e && this.#m(), this.#o = e;
			let i = T(e);
			return [
				r(i, "pointermove", (n) => {
					this.#p([n.clientX, n.clientY], e, t);
				}),
				r(e, "pointerleave", (e) => {
					let n = e.relatedTarget;
					if (O(n) && t.contains(n)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					O(n) && r.some((e) => e === n || e.contains(n)) || (this.#a = O(n) && r.length > 0 ? r.filter((e) => n.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				r(e, "pointerenter", () => {
					this.#m();
				}),
				r(t, "pointerenter", () => {
					this.#m();
				}),
				r(t, "pointerleave", (t) => {
					let n = t.relatedTarget;
					O(n) && e.contains(n) || (this.#r = [t.clientX, t.clientY], this.#i = "trigger", this.#u());
				})
			].reduce((e, t) => () => {
				e(), t();
			}, () => {});
		});
	}
	#p(e, t, n) {
		if (!this.#r || !this.#i) return;
		this.#l(), this.#f();
		let r = t.getBoundingClientRect(), i = n.getBoundingClientRect();
		if (this.#i === "content" && Q(e, i) || this.#i === "trigger" && Q(e, r)) {
			this.#m();
			return;
		}
		if (this.#i === "content" && this.#a.length > 0) for (let t of this.#a) {
			let n = t.getBoundingClientRect();
			if (Q(e, n)) return;
			let i = $(r, n), a = this.#h(r, n, i);
			if (a && Z(e, a)) return;
		}
		let a = $(r, i), o = this.#h(r, i, a);
		if (o && Z(e, o)) return;
		let s = this.#i === "content" ? i : r;
		Z(e, this.#g(this.#r, s, a, this.#i)) || (this.#m(), this.#e.onPointerExit());
	}
	#m() {
		this.#r = null, this.#i = null, this.#a = [], this.#l(), this.#d();
	}
	#h(e, t, n) {
		let r = this.#t;
		switch (n) {
			case "top": return [
				[Math.min(e.left, t.left) - r, e.top],
				[Math.min(e.left, t.left) - r, t.bottom],
				[Math.max(e.right, t.right) + r, t.bottom],
				[Math.max(e.right, t.right) + r, e.top]
			];
			case "bottom": return [
				[Math.min(e.left, t.left) - r, e.bottom],
				[Math.min(e.left, t.left) - r, t.top],
				[Math.max(e.right, t.right) + r, t.top],
				[Math.max(e.right, t.right) + r, e.bottom]
			];
			case "left": return [
				[e.left, Math.min(e.top, t.top) - r],
				[t.right, Math.min(e.top, t.top) - r],
				[t.right, Math.max(e.bottom, t.bottom) + r],
				[e.left, Math.max(e.bottom, t.bottom) + r]
			];
			case "right": return [
				[e.right, Math.min(e.top, t.top) - r],
				[t.left, Math.min(e.top, t.top) - r],
				[t.left, Math.max(e.bottom, t.bottom) + r],
				[e.right, Math.max(e.bottom, t.bottom) + r]
			];
		}
	}
	#g(e, t, n, r) {
		let i = this.#t * 4, [a, o] = e;
		switch (r === "trigger" ? this.#_(n) : n) {
			case "top": return [
				[a - i, o + i],
				[a + i, o + i],
				[t.right + i, t.bottom],
				[t.right + i, t.top],
				[t.left - i, t.top],
				[t.left - i, t.bottom]
			];
			case "bottom": return [
				[a - i, o - i],
				[a + i, o - i],
				[t.right + i, t.top],
				[t.right + i, t.bottom],
				[t.left - i, t.bottom],
				[t.left - i, t.top]
			];
			case "left": return [
				[a + i, o - i],
				[a + i, o + i],
				[t.right, t.bottom + i],
				[t.left, t.bottom + i],
				[t.left, t.top - i],
				[t.right, t.top - i]
			];
			case "right": return [
				[a - i, o - i],
				[a - i, o + i],
				[t.left, t.bottom + i],
				[t.right, t.bottom + i],
				[t.right, t.top - i],
				[t.left, t.top - i]
			];
		}
	}
	#_(e) {
		switch (e) {
			case "top": return "bottom";
			case "bottom": return "top";
			case "left": return "right";
			case "right": return "left";
		}
	}
};
export { fe as a, pe as i, ke as n, de as o, De as r, Ae as t };
