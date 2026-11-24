import { B as e, Dt as t, Et as n, F as r, G as i, K as a, Pt as o, St as s, _t as c, a as l, at as u, et as d, ft as f, ht as p, i as m, lt as h, mt as g, n as _, q as v, r as y, rt as b, yt as x } from "./index-client-DEFG3Gqk.js";
import { A as S, F as C, G as w, M as T, N as E, R as D, T as O, V as k, W as A, Y as j, d as M, k as N, o as P, z as F } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as I } from "./use-id-DCa3fCKD.js";
import { c as L, h as ee, l as te, m as R, s as z } from "./useDialogHistory.svelte-pVteCIez.js";
import { a as ne, c as re, i as ie, l as ae, n as oe, o as se, r as ce, s as le, t as ue } from "./floating-ui.dom-BRmGhLhL.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/floating-root.svelte.js
var B = new C("Floating.Root"), V = new C("Floating.Root"), H = class e {
	static create(t = !1) {
		return t ? V.set(new e()) : B.set(new e());
	}
	anchorNode = j(null);
	customAnchorNode = j(null);
	triggerNode = j(null);
	constructor() {
		h(() => {
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
		this.opts = e, this.root = t, t.triggerNode = e.virtualEl && e.virtualEl.current ? A(e.virtualEl.current) : e.ref;
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
function de(e, s) {
	t(s, !0);
	let c = y(s, "tooltip", 3, !1);
	H.create(u(() => c()));
	var l = a(), d = f(l);
	r(d, () => s.children ?? o), i(e, l), n();
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
function pe(e, s) {
	t(s, !0);
	let c = y(s, "tooltip", 3, !1);
	U.create({
		id: w(() => s.id),
		virtualEl: w(() => s.virtualEl),
		ref: u(() => s.ref)
	}, u(() => c()));
	var l = a(), d = f(l);
	r(d, () => s.children ?? o), i(e, l), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function me(e) {
	let t = e.whileElementsMounted, n = s(() => W(e.open) ?? !0), r = s(() => W(e.middleware)), i = s(() => W(e.transform) ?? !0), a = s(() => W(e.placement) ?? "bottom"), o = s(() => W(e.strategy) ?? "absolute"), l = s(() => W(e.sideOffset) ?? 0), u = s(() => W(e.alignOffset) ?? 0), d = e.reference, f = x(0), m = x(0), g = j(null), _ = x(p(b(o))), v = x(p(b(a))), y = x(p({})), S = x(!1), C = !1, w = 0, T = !1, E = s(() => {
		let e = g.current ? K(g.current, b(f)) : b(f), t = g.current ? K(g.current, b(m)) : b(m);
		return b(i) ? {
			position: b(_),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...g.current && G(g.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: b(_),
			left: `${e}px`,
			top: `${t}px`
		};
	}), D;
	function O() {
		if (T || d.current === null || g.current === null) return;
		let e = d.current, t = g.current, i = ++w;
		ce(e, t, {
			middleware: b(r),
			placement: b(a),
			strategy: b(o)
		}).then((r) => {
			if (i === w && d.current === e && g.current === t) {
				if (he(e)) c(y, {
					...b(y),
					hide: {
						...b(y).hide,
						referenceHidden: !0
					}
				}, !0);
				else {
					if (!b(n) && b(f) !== 0 && b(m) !== 0) {
						let e = Math.max(Math.abs(b(l)), Math.abs(b(u)), 15);
						if (r.x <= e && r.y <= e) return;
					}
					c(f, r.x, !0), c(m, r.y, !0), c(_, r.strategy, !0), c(v, r.placement, !0), c(y, r.middlewareData, !0), c(S, !0);
				}
			}
		});
	}
	function k() {
		typeof D == "function" && (D(), D = void 0), w++;
	}
	function A() {
		k(), t === void 0 ? O() : b(n) && d.current !== null && g.current !== null && (D = t(d.current, g.current, O));
	}
	function M() {
		!b(n) && g.current === null && c(S, !1);
	}
	function N() {
		return [
			b(r),
			b(a),
			b(o),
			b(l),
			b(u),
			b(n)
		];
	}
	return h(() => {
		t === void 0 && b(n) && O();
	}), h(A), h(() => {
		t !== void 0 && (N(), b(n) && b(S) ? C ? O() : C = !0 : C = !1);
	}), h(M), h(() => () => {
		T = !0, k();
	}), {
		floating: g,
		reference: d,
		get strategy() {
			return b(_);
		},
		get placement() {
			return b(v);
		},
		get middlewareData() {
			return b(y);
		},
		get isPositioned() {
			return b(S);
		},
		get floatingStyles() {
			return b(E);
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
}, q = new C("Floating.Content"), _e = class e {
	static create(t, n = !1) {
		return n ? q.set(new e(t, V.get())) : q.set(new e(t, B.get()));
	}
	opts;
	root;
	contentRef = j(null);
	wrapperRef = j(null);
	arrowRef = j(null);
	contentAttachment = O(this.contentRef);
	wrapperAttachment = O(this.wrapperRef);
	arrowAttachment = O(this.arrowRef);
	arrowId = j(I());
	#e = s(() => {
		if (typeof this.opts.style == "string") return k(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new T(() => this.arrowRef.current ?? void 0);
	#r = s(() => this.#n?.width ?? 0);
	#i = s(() => this.#n?.height ?? 0);
	#a = s(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = s(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#s = s(() => b(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return b(this.#s);
	}
	set hasExplicitBoundaries(e) {
		c(this.#s, e);
	}
	#c = s(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: b(this.#o).filter(M),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return b(this.#c);
	}
	set detectOverflowOptions(e) {
		c(this.#c, e);
	}
	#l = x(void 0);
	#u = x(void 0);
	#d = x(void 0);
	#f = x(void 0);
	#p = s(() => [
		le({
			mainAxis: this.opts.sideOffset.current + b(this.#i),
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
				c(this.#l, t, !0), c(this.#u, n, !0), c(this.#d, r, !0), c(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && ue({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		ve({
			arrowWidth: b(this.#r),
			arrowHeight: b(this.#i)
		}),
		this.opts.hideWhenDetached.current && ne({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return b(this.#p);
	}
	set middleware(e) {
		c(this.#p, e);
	}
	floating;
	#m = s(() => ye(this.floating.placement));
	get placedSide() {
		return b(this.#m);
	}
	set placedSide(e) {
		c(this.#m, e);
	}
	#h = s(() => be(this.floating.placement));
	get placedAlign() {
		return b(this.#h);
	}
	set placedAlign(e) {
		c(this.#h, e);
	}
	#g = s(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return b(this.#g);
	}
	set arrowX(e) {
		c(this.#g, e);
	}
	#_ = s(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return b(this.#_);
	}
	set arrowY(e) {
		c(this.#_, e);
	}
	#v = s(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return b(this.#v);
	}
	set cannotCenterArrow(e) {
		c(this.#v, e);
	}
	#y = x("auto");
	get contentZIndex() {
		return b(this.#y);
	}
	set contentZIndex(e) {
		c(this.#y, e, !0);
	}
	#b = s(() => ge[this.placedSide]);
	get arrowBaseSide() {
		return b(this.#b);
	}
	set arrowBaseSide(e) {
		c(this.#b, e);
	}
	#x = s(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${b(this.#l)}px`,
			"--bits-floating-available-height": `${b(this.#u)}px`,
			"--bits-floating-anchor-width": `${b(this.#d)}px`,
			"--bits-floating-anchor-height": `${b(this.#f)}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...b(this.#e)
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return b(this.#x);
	}
	set wrapperProps(e) {
		c(this.#x, e);
	}
	#S = s(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: F({ ...b(this.#e) }),
		...this.contentAttachment
	}));
	get props() {
		return b(this.#S);
	}
	set props(e) {
		c(this.#S, e);
	}
	#C = s(() => ({
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
		return b(this.#C);
	}
	set arrowStyle(e) {
		c(this.#C, e);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), E(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = me({
			strategy: () => this.opts.strategy.current,
			placement: () => b(this.#a),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...e) => oe(...e, { animationFrame: this.#t?.current === "always" }),
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		}), h(() => {
			this.floating.isPositioned && this.opts.onPlaced?.current();
		}), E([() => this.contentRef.current, () => this.opts.enabled.current], ([e, t]) => {
			if (!e || !t) return;
			let n = S(e), r = n.requestAnimationFrame(() => {
				if (this.contentRef.current !== e || !this.opts.enabled.current) return;
				let t = n.getComputedStyle(e).zIndex;
				t !== this.contentZIndex && (this.contentZIndex = t);
			});
			return () => {
				n.cancelAnimationFrame(r);
			};
		}), h(() => {
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
function xe(e, c) {
	t(c, !0);
	let l = y(c, "side", 3, "bottom"), d = y(c, "sideOffset", 3, 0), p = y(c, "align", 3, "center"), m = y(c, "alignOffset", 3, 0), h = y(c, "arrowPadding", 3, 0), g = y(c, "avoidCollisions", 3, !0), _ = y(c, "collisionBoundary", 19, () => []), v = y(c, "collisionPadding", 3, 0), x = y(c, "hideWhenDetached", 3, !1), S = y(c, "onPlaced", 3, () => {}), C = y(c, "sticky", 3, "partial"), T = y(c, "updatePositionStrategy", 3, "optimized"), E = y(c, "strategy", 3, "fixed"), O = y(c, "dir", 3, "ltr"), k = y(c, "style", 19, () => ({})), A = y(c, "wrapperId", 19, I), j = y(c, "customAnchor", 3, null), M = y(c, "tooltip", 3, !1), N = _e.create({
		side: w(() => l()),
		sideOffset: w(() => d()),
		align: w(() => p()),
		alignOffset: w(() => m()),
		id: w(() => c.id),
		arrowPadding: w(() => h()),
		avoidCollisions: w(() => g()),
		collisionBoundary: w(() => _()),
		collisionPadding: w(() => v()),
		hideWhenDetached: w(() => x()),
		onPlaced: w(() => S()),
		sticky: w(() => C()),
		updatePositionStrategy: w(() => T()),
		strategy: w(() => E()),
		dir: w(() => O()),
		style: w(() => k()),
		enabled: w(() => c.enabled),
		wrapperId: w(() => A()),
		customAnchor: w(() => j())
	}, u(() => M())), P = s(() => D(N.wrapperProps, { style: { pointerEvents: "auto" } }));
	var F = a(), L = f(F);
	r(L, () => c.content ?? o, () => ({
		props: N.props,
		wrapperProps: b(P)
	})), i(e, F), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function Se(e, s) {
	t(s, !0), _(() => {
		s.onPlaced?.();
	});
	var c = a(), l = f(c);
	r(l, () => s.content ?? o, () => ({
		props: {},
		wrapperProps: {}
	})), i(e, c), n();
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
function we(t, n) {
	let r = y(n, "isStatic", 3, !1), o = m(n, Ce);
	var s = a(), c = f(s), u = (e) => {
		Se(e, {
			get content() {
				return n.content;
			},
			get onPlaced() {
				return n.onPlaced;
			}
		});
	}, d = (e) => {
		xe(e, l({
			get content() {
				return n.content;
			},
			get onPlaced() {
				return n.onPlaced;
			}
		}, () => o));
	};
	e(c, (e) => {
		r() ? e(u) : e(d, -1);
	}), i(t, s);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var Y = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.forceMount.ref.tooltip.contentPointerEvents".split(".")), Te = v("<!> <!>", 1);
function X(c, l) {
	t(l, !0);
	let u = y(l, "interactOutsideBehavior", 3, "close"), d = y(l, "trapFocus", 3, !0), p = y(l, "isValidEvent", 3, () => !1), h = y(l, "customAnchor", 3, null), _ = y(l, "isStatic", 3, !1), v = y(l, "tooltip", 3, !1), x = y(l, "contentPointerEvents", 3, "auto"), S = m(l, Y), C = s(() => l.preventScroll ?? !0), w = s(() => l.strategy ?? (b(C) ? "fixed" : "absolute"));
	we(c, {
		get isStatic() {
			return _();
		},
		get id() {
			return l.id;
		},
		get side() {
			return l.side;
		},
		get sideOffset() {
			return l.sideOffset;
		},
		get align() {
			return l.align;
		},
		get alignOffset() {
			return l.alignOffset;
		},
		get arrowPadding() {
			return l.arrowPadding;
		},
		get avoidCollisions() {
			return l.avoidCollisions;
		},
		get collisionBoundary() {
			return l.collisionBoundary;
		},
		get collisionPadding() {
			return l.collisionPadding;
		},
		get sticky() {
			return l.sticky;
		},
		get hideWhenDetached() {
			return l.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return l.updatePositionStrategy;
		},
		get strategy() {
			return b(w);
		},
		get dir() {
			return l.dir;
		},
		get wrapperId() {
			return l.wrapperId;
		},
		get style() {
			return l.style;
		},
		get onPlaced() {
			return l.onPlaced;
		},
		get customAnchor() {
			return h();
		},
		get enabled() {
			return l.enabled;
		},
		get tooltip() {
			return v();
		},
		content: (t, n) => {
			let c = () => (n?.()).props, m = () => (n?.()).wrapperProps;
			var h = Te(), _ = f(h), v = (e) => {
				z(e, { get preventScroll() {
					return b(C);
				} });
			}, y = (e) => {
				z(e, { get preventScroll() {
					return b(C);
				} });
			};
			e(_, (e) => {
				l.forceMount && l.enabled ? e(v) : l.forceMount || e(y, 1);
			});
			var w = g(_, 2);
			te(w, {
				get onOpenAutoFocus() {
					return l.onOpenAutoFocus;
				},
				get onCloseAutoFocus() {
					return l.onCloseAutoFocus;
				},
				get loop() {
					return l.loop;
				},
				get enabled() {
					return l.enabled;
				},
				get trapFocus() {
					return d();
				},
				get forceMount() {
					return l.forceMount;
				},
				get ref() {
					return l.ref;
				},
				focusScope: (e, t) => {
					let n = () => (t?.()).props;
					R(e, {
						get onEscapeKeydown() {
							return l.onEscapeKeydown;
						},
						get escapeKeydownBehavior() {
							return l.escapeKeydownBehavior;
						},
						get enabled() {
							return l.enabled;
						},
						get ref() {
							return l.ref;
						},
						children: (e, t) => {
							ee(e, {
								get id() {
									return l.id;
								},
								get onInteractOutside() {
									return l.onInteractOutside;
								},
								get onFocusOutside() {
									return l.onFocusOutside;
								},
								get interactOutsideBehavior() {
									return u();
								},
								get isValidEvent() {
									return p();
								},
								get enabled() {
									return l.enabled;
								},
								get ref() {
									return l.ref;
								},
								children: (e, t) => {
									let u = () => (t?.()).props;
									L(e, {
										get id() {
											return l.id;
										},
										get preventOverflowTextSelection() {
											return l.preventOverflowTextSelection;
										},
										get onPointerDown() {
											return l.onPointerDown;
										},
										get onPointerUp() {
											return l.onPointerUp;
										},
										get enabled() {
											return l.enabled;
										},
										get ref() {
											return l.ref;
										},
										children: (e, t) => {
											var d = a(), p = f(d);
											{
												let e = s(() => ({
													props: D(S, c(), u(), n(), {
														id: l.id,
														style: { pointerEvents: x() }
													}),
													wrapperProps: m()
												}));
												r(p, () => l.popper ?? o, () => b(e));
											}
											i(e, d);
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
			}), i(t, h);
		},
		$$slots: { content: !0 }
	}), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var Ee = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function De(t, n) {
	let r = y(n, "interactOutsideBehavior", 3, "close"), o = y(n, "trapFocus", 3, !0), s = y(n, "isValidEvent", 3, () => !1), c = y(n, "customAnchor", 3, null), u = y(n, "isStatic", 3, !1), d = m(n, Ee);
	var p = a(), h = f(p), g = (e) => {
		X(e, l({
			get popper() {
				return n.popper;
			},
			get onEscapeKeydown() {
				return n.onEscapeKeydown;
			},
			get escapeKeydownBehavior() {
				return n.escapeKeydownBehavior;
			},
			get preventOverflowTextSelection() {
				return n.preventOverflowTextSelection;
			},
			get id() {
				return n.id;
			},
			get onPointerDown() {
				return n.onPointerDown;
			},
			get onPointerUp() {
				return n.onPointerUp;
			},
			get side() {
				return n.side;
			},
			get sideOffset() {
				return n.sideOffset;
			},
			get align() {
				return n.align;
			},
			get alignOffset() {
				return n.alignOffset;
			},
			get arrowPadding() {
				return n.arrowPadding;
			},
			get avoidCollisions() {
				return n.avoidCollisions;
			},
			get collisionBoundary() {
				return n.collisionBoundary;
			},
			get collisionPadding() {
				return n.collisionPadding;
			},
			get sticky() {
				return n.sticky;
			},
			get hideWhenDetached() {
				return n.hideWhenDetached;
			},
			get updatePositionStrategy() {
				return n.updatePositionStrategy;
			},
			get strategy() {
				return n.strategy;
			},
			get dir() {
				return n.dir;
			},
			get preventScroll() {
				return n.preventScroll;
			},
			get wrapperId() {
				return n.wrapperId;
			},
			get style() {
				return n.style;
			},
			get onPlaced() {
				return n.onPlaced;
			},
			get customAnchor() {
				return c();
			},
			get isStatic() {
				return u();
			},
			get enabled() {
				return n.open;
			},
			get onInteractOutside() {
				return n.onInteractOutside;
			},
			get onCloseAutoFocus() {
				return n.onCloseAutoFocus;
			},
			get onOpenAutoFocus() {
				return n.onOpenAutoFocus;
			},
			get interactOutsideBehavior() {
				return r();
			},
			get loop() {
				return n.loop;
			},
			get trapFocus() {
				return o();
			},
			get isValidEvent() {
				return s();
			},
			get onFocusOutside() {
				return n.onFocusOutside;
			},
			forceMount: !1,
			get ref() {
				return n.ref;
			}
		}, () => d));
	};
	e(h, (e) => {
		n.shouldRender && e(g);
	}), i(t, p);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var Oe = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function ke(e, t) {
	let n = y(t, "interactOutsideBehavior", 3, "close"), r = y(t, "trapFocus", 3, !0), i = y(t, "isValidEvent", 3, () => !1), a = y(t, "customAnchor", 3, null), o = y(t, "isStatic", 3, !1), s = m(t, Oe);
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
			let r = N(e);
			return [
				d(r, "pointermove", (n) => {
					this.#p([n.clientX, n.clientY], e, t);
				}),
				d(e, "pointerleave", (e) => {
					let n = e.relatedTarget;
					if (P(n) && t.contains(n)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					P(n) && r.some((e) => e === n || e.contains(n)) || (this.#a = P(n) && r.length > 0 ? r.filter((e) => n.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				d(e, "pointerenter", () => {
					this.#m();
				}),
				d(t, "pointerenter", () => {
					this.#m();
				}),
				d(t, "pointerleave", (t) => {
					let n = t.relatedTarget;
					P(n) && e.contains(n) || (this.#r = [t.clientX, t.clientY], this.#i = "trigger", this.#u());
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
