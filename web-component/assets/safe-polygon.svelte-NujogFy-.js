import { $ as e, Et as t, G as n, K as r, Nt as i, P as a, Tt as o, W as s, a as c, ct as l, dt as u, gt as d, i as f, it as p, mt as m, n as h, nt as g, pt as _, r as v, vt as y, xt as b, z as x } from "./index-client-XkLzkVYC.js";
import { B as S, G as C, Q as w, W as T, X as E, Y as D, d as O, dt as k, et as A, g as j, ot as M, r as N, rt as P, st as F, tt as I } from "./LoadingPlaceholder-lit91akO.js";
import { c as L, h as ee, l as te, m as R, s as z } from "./useDialogHistory.svelte-BgJftJRE.js";
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
		l(() => {
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
	t(r, !0);
	let c = v(r, "tooltip", 3, !1);
	H.create(p(() => c()));
	var l = n(), d = u(l);
	a(d, () => r.children ?? i), s(e, l), o();
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
	t(r, !0);
	let c = v(r, "tooltip", 3, !1);
	U.create({
		id: F(() => r.id),
		virtualEl: F(() => r.virtualEl),
		ref: p(() => r.ref)
	}, p(() => c()));
	var l = n(), d = u(l);
	a(d, () => r.children ?? i), s(e, l), o();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function me(e) {
	let t = e.whileElementsMounted, n = b(() => W(e.open) ?? !0), r = b(() => W(e.middleware)), i = b(() => W(e.transform) ?? !0), a = b(() => W(e.placement) ?? "bottom"), o = b(() => W(e.strategy) ?? "absolute"), s = b(() => W(e.sideOffset) ?? 0), c = b(() => W(e.alignOffset) ?? 0), u = e.reference, f = y(0), p = y(0), h = k(null), _ = y(m(g(o))), v = y(m(g(a))), x = y(m({})), S = y(!1), C = !1, w = 0, T = !1, E = b(() => {
		let e = h.current ? K(h.current, g(f)) : g(f), t = h.current ? K(h.current, g(p)) : g(p);
		return g(i) ? {
			position: g(_),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...h.current && G(h.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: g(_),
			left: `${e}px`,
			top: `${t}px`
		};
	}), D;
	function O() {
		if (T || u.current === null || h.current === null) return;
		let e = u.current, t = h.current, i = ++w;
		ce(e, t, {
			middleware: g(r),
			placement: g(a),
			strategy: g(o)
		}).then((r) => {
			if (i === w && u.current === e && h.current === t) {
				if (he(e)) d(x, {
					...g(x),
					hide: {
						...g(x).hide,
						referenceHidden: !0
					}
				}, !0);
				else {
					if (!g(n) && g(f) !== 0 && g(p) !== 0) {
						let e = Math.max(Math.abs(g(s)), Math.abs(g(c)), 15);
						if (r.x <= e && r.y <= e) return;
					}
					d(f, r.x, !0), d(p, r.y, !0), d(_, r.strategy, !0), d(v, r.placement, !0), d(x, r.middlewareData, !0), d(S, !0);
				}
			}
		});
	}
	function A() {
		typeof D == "function" && (D(), D = void 0), w++;
	}
	function j() {
		A(), t === void 0 ? O() : g(n) && u.current !== null && h.current !== null && (D = t(u.current, h.current, O));
	}
	function M() {
		!g(n) && h.current === null && d(S, !1);
	}
	function N() {
		return [
			g(r),
			g(a),
			g(o),
			g(s),
			g(c),
			g(n)
		];
	}
	return l(() => {
		t === void 0 && g(n) && O();
	}), l(j), l(() => {
		t !== void 0 && (N(), g(n) && g(S) ? C ? O() : C = !0 : C = !1);
	}), l(M), l(() => () => {
		T = !0, A();
	}), {
		floating: h,
		reference: u,
		get strategy() {
			return g(_);
		},
		get placement() {
			return g(v);
		},
		get middlewareData() {
			return g(x);
		},
		get isPositioned() {
			return g(S);
		},
		get floatingStyles() {
			return g(E);
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
	#e = b(() => {
		if (typeof this.opts.style == "string") return P(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new D(() => this.arrowRef.current ?? void 0);
	#r = b(() => this.#n?.width ?? 0);
	#i = b(() => this.#n?.height ?? 0);
	#a = b(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = b(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#s = b(() => g(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return g(this.#s);
	}
	set hasExplicitBoundaries(e) {
		d(this.#s, e);
	}
	#c = b(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: g(this.#o).filter(j),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return g(this.#c);
	}
	set detectOverflowOptions(e) {
		d(this.#c, e);
	}
	#l = y(void 0);
	#u = y(void 0);
	#d = y(void 0);
	#f = y(void 0);
	#p = b(() => [
		le({
			mainAxis: this.opts.sideOffset.current + g(this.#i),
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
				d(this.#l, t, !0), d(this.#u, n, !0), d(this.#d, r, !0), d(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && ue({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		ve({
			arrowWidth: g(this.#r),
			arrowHeight: g(this.#i)
		}),
		this.opts.hideWhenDetached.current && ne({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return g(this.#p);
	}
	set middleware(e) {
		d(this.#p, e);
	}
	floating;
	#m = b(() => ye(this.floating.placement));
	get placedSide() {
		return g(this.#m);
	}
	set placedSide(e) {
		d(this.#m, e);
	}
	#h = b(() => be(this.floating.placement));
	get placedAlign() {
		return g(this.#h);
	}
	set placedAlign(e) {
		d(this.#h, e);
	}
	#g = b(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return g(this.#g);
	}
	set arrowX(e) {
		d(this.#g, e);
	}
	#_ = b(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return g(this.#_);
	}
	set arrowY(e) {
		d(this.#_, e);
	}
	#v = b(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return g(this.#v);
	}
	set cannotCenterArrow(e) {
		d(this.#v, e);
	}
	#y = y("auto");
	get contentZIndex() {
		return g(this.#y);
	}
	set contentZIndex(e) {
		d(this.#y, e, !0);
	}
	#b = b(() => ge[this.placedSide]);
	get arrowBaseSide() {
		return g(this.#b);
	}
	set arrowBaseSide(e) {
		d(this.#b, e);
	}
	#x = b(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${g(this.#l)}px`,
			"--bits-floating-available-height": `${g(this.#u)}px`,
			"--bits-floating-anchor-width": `${g(this.#d)}px`,
			"--bits-floating-anchor-height": `${g(this.#f)}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...g(this.#e)
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return g(this.#x);
	}
	set wrapperProps(e) {
		d(this.#x, e);
	}
	#S = b(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: I({ ...g(this.#e) }),
		...this.contentAttachment
	}));
	get props() {
		return g(this.#S);
	}
	set props(e) {
		d(this.#S, e);
	}
	#C = b(() => ({
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
		return g(this.#C);
	}
	set arrowStyle(e) {
		d(this.#C, e);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), E(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = me({
			strategy: () => this.opts.strategy.current,
			placement: () => g(this.#a),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...e) => oe(...e, { animationFrame: this.#t?.current === "always" }),
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		}), l(() => {
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
		}), l(() => {
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
	t(r, !0);
	let c = v(r, "side", 3, "bottom"), l = v(r, "sideOffset", 3, 0), d = v(r, "align", 3, "center"), f = v(r, "alignOffset", 3, 0), m = v(r, "arrowPadding", 3, 0), h = v(r, "avoidCollisions", 3, !0), _ = v(r, "collisionBoundary", 19, () => []), y = v(r, "collisionPadding", 3, 0), x = v(r, "hideWhenDetached", 3, !1), S = v(r, "onPlaced", 3, () => {}), C = v(r, "sticky", 3, "partial"), w = v(r, "updatePositionStrategy", 3, "optimized"), T = v(r, "strategy", 3, "fixed"), E = v(r, "dir", 3, "ltr"), D = v(r, "style", 19, () => ({})), O = v(r, "wrapperId", 19, N), k = v(r, "customAnchor", 3, null), j = v(r, "tooltip", 3, !1), M = _e.create({
		side: F(() => c()),
		sideOffset: F(() => l()),
		align: F(() => d()),
		alignOffset: F(() => f()),
		id: F(() => r.id),
		arrowPadding: F(() => m()),
		avoidCollisions: F(() => h()),
		collisionBoundary: F(() => _()),
		collisionPadding: F(() => y()),
		hideWhenDetached: F(() => x()),
		onPlaced: F(() => S()),
		sticky: F(() => C()),
		updatePositionStrategy: F(() => w()),
		strategy: F(() => T()),
		dir: F(() => E()),
		style: F(() => D()),
		enabled: F(() => r.enabled),
		wrapperId: F(() => O()),
		customAnchor: F(() => k())
	}, p(() => j())), P = b(() => A(M.wrapperProps, { style: { pointerEvents: "auto" } }));
	var I = n(), L = u(I);
	a(L, () => r.content ?? i, () => ({
		props: M.props,
		wrapperProps: g(P)
	})), s(e, I), o();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function Se(e, r) {
	t(r, !0), h(() => {
		r.onPlaced?.();
	});
	var c = n(), l = u(c);
	a(l, () => r.content ?? i, () => ({
		props: {},
		wrapperProps: {}
	})), s(e, c), o();
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
	let r = v(t, "isStatic", 3, !1), i = f(t, Ce);
	var a = n(), o = u(a), l = (e) => {
		Se(e, {
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		});
	}, d = (e) => {
		xe(e, c({
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		}, () => i));
	};
	x(o, (e) => {
		r() ? e(l) : e(d, -1);
	}), s(e, a);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var Y = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.forceMount.ref.tooltip.contentPointerEvents".split(".")), Te = r("<!> <!>", 1);
function X(e, r) {
	t(r, !0);
	let c = v(r, "interactOutsideBehavior", 3, "close"), l = v(r, "trapFocus", 3, !0), d = v(r, "isValidEvent", 3, () => !1), p = v(r, "customAnchor", 3, null), m = v(r, "isStatic", 3, !1), h = v(r, "tooltip", 3, !1), y = v(r, "contentPointerEvents", 3, "auto"), S = f(r, Y), C = b(() => r.preventScroll ?? !0), w = b(() => r.strategy ?? (g(C) ? "fixed" : "absolute"));
	we(e, {
		get isStatic() {
			return m();
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
			return g(w);
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
			return p();
		},
		get enabled() {
			return r.enabled;
		},
		get tooltip() {
			return h();
		},
		content: (e, t) => {
			let o = () => (t?.()).props, f = () => (t?.()).wrapperProps;
			var p = Te(), m = u(p), h = (e) => {
				z(e, { get preventScroll() {
					return g(C);
				} });
			}, v = (e) => {
				z(e, { get preventScroll() {
					return g(C);
				} });
			};
			x(m, (e) => {
				r.forceMount && r.enabled ? e(h) : r.forceMount || e(v, 1);
			});
			var w = _(m, 2);
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
				focusScope: (e, t) => {
					let l = () => (t?.()).props;
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
						children: (e, t) => {
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
									return d();
								},
								get enabled() {
									return r.enabled;
								},
								get ref() {
									return r.ref;
								},
								children: (e, t) => {
									let c = () => (t?.()).props;
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
										children: (e, t) => {
											var d = n(), p = u(d);
											{
												let e = b(() => ({
													props: A(S, o(), c(), l(), {
														id: r.id,
														style: { pointerEvents: y() }
													}),
													wrapperProps: f()
												}));
												a(p, () => r.popper ?? i, () => g(e));
											}
											s(e, d);
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
			}), s(e, p);
		},
		$$slots: { content: !0 }
	}), o();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var Ee = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function De(e, t) {
	let r = v(t, "interactOutsideBehavior", 3, "close"), i = v(t, "trapFocus", 3, !0), a = v(t, "isValidEvent", 3, () => !1), o = v(t, "customAnchor", 3, null), l = v(t, "isStatic", 3, !1), d = f(t, Ee);
	var p = n(), m = u(p), h = (e) => {
		X(e, c({
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
				return o();
			},
			get isStatic() {
				return l();
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
				return r();
			},
			get loop() {
				return t.loop;
			},
			get trapFocus() {
				return i();
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
	x(m, (e) => {
		t.shouldRender && e(h);
	}), s(e, p);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var Oe = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function ke(e, t) {
	let n = v(t, "interactOutsideBehavior", 3, "close"), r = v(t, "trapFocus", 3, !0), i = v(t, "isValidEvent", 3, () => !1), a = v(t, "customAnchor", 3, null), o = v(t, "isStatic", 3, !1), s = f(t, Oe);
	X(e, c({
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
	constructor(t) {
		this.#e = t, this.#t = t.buffer ?? 1;
		let n = t.transitIntentTimeout;
		this.#n = typeof n == "number" && n > 0 ? n : null, E([
			t.triggerNode,
			t.contentNode,
			t.enabled
		], ([t, n, r]) => {
			if (!t || !n || !r) {
				this.#o = null, this.#m();
				return;
			}
			this.#o && this.#o !== t && this.#m(), this.#o = t;
			let i = T(t);
			return [
				e(i, "pointermove", (e) => {
					this.#p([e.clientX, e.clientY], t, n);
				}),
				e(t, "pointerleave", (e) => {
					let t = e.relatedTarget;
					if (O(t) && n.contains(t)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					O(t) && r.some((e) => e === t || e.contains(t)) || (this.#a = O(t) && r.length > 0 ? r.filter((e) => t.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				e(t, "pointerenter", () => {
					this.#m();
				}),
				e(n, "pointerenter", () => {
					this.#m();
				}),
				e(n, "pointerleave", (e) => {
					let n = e.relatedTarget;
					O(n) && t.contains(n) || (this.#r = [e.clientX, e.clientY], this.#i = "trigger", this.#u());
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
