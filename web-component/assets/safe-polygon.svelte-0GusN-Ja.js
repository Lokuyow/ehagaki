import { Ct as e, G as t, N as n, R as r, U as i, W as a, Z as o, a as s, dt as c, et as l, ft as u, gt as d, i as f, jt as p, lt as m, mt as h, n as g, nt as _, ot as v, r as y, wt as b, yt as x } from "./index-client-Bdka-Daw.js";
import { B as S, G as C, Q as w, W as T, X as E, Y as D, d as O, dt as k, et as A, g as j, ot as M, r as N, rt as P, st as F, tt as I } from "./LoadingPlaceholder-j1_vRYno.js";
import { a as L, d as R, f as ee, i as z, o as te } from "./useDialogHistory.svelte-Bf7sbISs.js";
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
function de(t, r) {
	b(r, !0);
	let o = y(r, "tooltip", 3, !1);
	H.create(_(() => o()));
	var s = a(), c = m(s);
	n(c, () => r.children ?? p), i(t, s), e();
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
function pe(t, r) {
	b(r, !0);
	let o = y(r, "tooltip", 3, !1);
	U.create({
		id: F(() => r.id),
		virtualEl: F(() => r.virtualEl),
		ref: _(() => r.ref)
	}, _(() => o()));
	var s = a(), c = m(s);
	n(c, () => r.children ?? p), i(t, s), e();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function me(e) {
	let t = e.whileElementsMounted, n = x(() => W(e.open) ?? !0), r = x(() => W(e.middleware)), i = x(() => W(e.transform) ?? !0), a = x(() => W(e.placement) ?? "bottom"), o = x(() => W(e.strategy) ?? "absolute"), s = x(() => W(e.sideOffset) ?? 0), c = x(() => W(e.alignOffset) ?? 0), f = e.reference, p = d(0), m = d(0), g = k(null), _ = d(u(l(o))), y = d(u(l(a))), b = d(u({})), S = d(!1), C = !1, w = 0, T = !1, E = x(() => {
		let e = g.current ? K(g.current, l(p)) : l(p), t = g.current ? K(g.current, l(m)) : l(m);
		return l(i) ? {
			position: l(_),
			left: "0",
			top: "0",
			transform: `translate(${e}px, ${t}px)`,
			...g.current && G(g.current) >= 1.5 && { willChange: "transform" }
		} : {
			position: l(_),
			left: `${e}px`,
			top: `${t}px`
		};
	}), D;
	function O() {
		if (T || f.current === null || g.current === null) return;
		let e = f.current, t = g.current, i = ++w;
		ce(e, t, {
			middleware: l(r),
			placement: l(a),
			strategy: l(o)
		}).then((r) => {
			if (i === w && f.current === e && g.current === t) {
				if (he(e)) h(b, {
					...l(b),
					hide: {
						...l(b).hide,
						referenceHidden: !0
					}
				}, !0);
				else {
					if (!l(n) && l(p) !== 0 && l(m) !== 0) {
						let e = Math.max(Math.abs(l(s)), Math.abs(l(c)), 15);
						if (r.x <= e && r.y <= e) return;
					}
					h(p, r.x, !0), h(m, r.y, !0), h(_, r.strategy, !0), h(y, r.placement, !0), h(b, r.middlewareData, !0), h(S, !0);
				}
			}
		});
	}
	function A() {
		typeof D == "function" && (D(), D = void 0), w++;
	}
	function j() {
		A(), t === void 0 ? O() : l(n) && f.current !== null && g.current !== null && (D = t(f.current, g.current, O));
	}
	function M() {
		!l(n) && g.current === null && h(S, !1);
	}
	function N() {
		return [
			l(r),
			l(a),
			l(o),
			l(s),
			l(c),
			l(n)
		];
	}
	return v(() => {
		t === void 0 && l(n) && O();
	}), v(j), v(() => {
		t !== void 0 && (N(), l(n) && l(S) ? C ? O() : C = !0 : C = !1);
	}), v(M), v(() => () => {
		T = !0, A();
	}), {
		floating: g,
		reference: f,
		get strategy() {
			return l(_);
		},
		get placement() {
			return l(y);
		},
		get middlewareData() {
			return l(b);
		},
		get isPositioned() {
			return l(S);
		},
		get floatingStyles() {
			return l(E);
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
	#e = x(() => {
		if (typeof this.opts.style == "string") return P(this.opts.style);
		if (!this.opts.style) return {};
	});
	#t = void 0;
	#n = new D(() => this.arrowRef.current ?? void 0);
	#r = x(() => this.#n?.width ?? 0);
	#i = x(() => this.#n?.height ?? 0);
	#a = x(() => this.opts.side?.current + (this.opts.align.current === "center" ? "" : `-${this.opts.align.current}`));
	#o = x(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#s = x(() => l(this.#o).length > 0);
	get hasExplicitBoundaries() {
		return l(this.#s);
	}
	set hasExplicitBoundaries(e) {
		h(this.#s, e);
	}
	#c = x(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: l(this.#o).filter(j),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return l(this.#c);
	}
	set detectOverflowOptions(e) {
		h(this.#c, e);
	}
	#l = d(void 0);
	#u = d(void 0);
	#d = d(void 0);
	#f = d(void 0);
	#p = x(() => [
		le({
			mainAxis: this.opts.sideOffset.current + l(this.#i),
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
				h(this.#l, t, !0), h(this.#u, n, !0), h(this.#d, r, !0), h(this.#f, i, !0);
			}
		}),
		this.arrowRef.current && ue({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		ve({
			arrowWidth: l(this.#r),
			arrowHeight: l(this.#i)
		}),
		this.opts.hideWhenDetached.current && ne({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return l(this.#p);
	}
	set middleware(e) {
		h(this.#p, e);
	}
	floating;
	#m = x(() => ye(this.floating.placement));
	get placedSide() {
		return l(this.#m);
	}
	set placedSide(e) {
		h(this.#m, e);
	}
	#h = x(() => be(this.floating.placement));
	get placedAlign() {
		return l(this.#h);
	}
	set placedAlign(e) {
		h(this.#h, e);
	}
	#g = x(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return l(this.#g);
	}
	set arrowX(e) {
		h(this.#g, e);
	}
	#_ = x(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return l(this.#_);
	}
	set arrowY(e) {
		h(this.#_, e);
	}
	#v = x(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return l(this.#v);
	}
	set cannotCenterArrow(e) {
		h(this.#v, e);
	}
	#y = d("auto");
	get contentZIndex() {
		return l(this.#y);
	}
	set contentZIndex(e) {
		h(this.#y, e, !0);
	}
	#b = x(() => ge[this.placedSide]);
	get arrowBaseSide() {
		return l(this.#b);
	}
	set arrowBaseSide(e) {
		h(this.#b, e);
	}
	#x = x(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${l(this.#l)}px`,
			"--bits-floating-available-height": `${l(this.#u)}px`,
			"--bits-floating-anchor-width": `${l(this.#d)}px`,
			"--bits-floating-anchor-height": `${l(this.#f)}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...l(this.#e)
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return l(this.#x);
	}
	set wrapperProps(e) {
		h(this.#x, e);
	}
	#S = x(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: I({ ...l(this.#e) }),
		...this.contentAttachment
	}));
	get props() {
		return l(this.#S);
	}
	set props(e) {
		h(this.#S, e);
	}
	#C = x(() => ({
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
		return l(this.#C);
	}
	set arrowStyle(e) {
		h(this.#C, e);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#t = e.updatePositionStrategy, e.customAnchor && (this.root.customAnchorNode.current = e.customAnchor.current), E(() => e.customAnchor.current, (e) => {
			this.root.customAnchorNode.current = e;
		}), this.floating = me({
			strategy: () => this.opts.strategy.current,
			placement: () => l(this.#a),
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
function xe(t, r) {
	b(r, !0);
	let o = y(r, "side", 3, "bottom"), s = y(r, "sideOffset", 3, 0), c = y(r, "align", 3, "center"), u = y(r, "alignOffset", 3, 0), d = y(r, "arrowPadding", 3, 0), f = y(r, "avoidCollisions", 3, !0), h = y(r, "collisionBoundary", 19, () => []), g = y(r, "collisionPadding", 3, 0), v = y(r, "hideWhenDetached", 3, !1), S = y(r, "onPlaced", 3, () => {}), C = y(r, "sticky", 3, "partial"), w = y(r, "updatePositionStrategy", 3, "optimized"), T = y(r, "strategy", 3, "fixed"), E = y(r, "dir", 3, "ltr"), D = y(r, "style", 19, () => ({})), O = y(r, "wrapperId", 19, N), k = y(r, "customAnchor", 3, null), j = y(r, "tooltip", 3, !1), M = _e.create({
		side: F(() => o()),
		sideOffset: F(() => s()),
		align: F(() => c()),
		alignOffset: F(() => u()),
		id: F(() => r.id),
		arrowPadding: F(() => d()),
		avoidCollisions: F(() => f()),
		collisionBoundary: F(() => h()),
		collisionPadding: F(() => g()),
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
	}, _(() => j())), P = x(() => A(M.wrapperProps, { style: { pointerEvents: "auto" } }));
	var I = a(), L = m(I);
	n(L, () => r.content ?? p, () => ({
		props: M.props,
		wrapperProps: l(P)
	})), i(t, I), e();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function Se(t, r) {
	b(r, !0), g(() => {
		r.onPlaced?.();
	});
	var o = a(), s = m(o);
	n(s, () => r.content ?? p, () => ({
		props: {},
		wrapperProps: {}
	})), i(t, o), e();
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
	let n = y(t, "isStatic", 3, !1), o = f(t, Ce);
	var c = a(), l = m(c), u = (e) => {
		Se(e, {
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		});
	}, d = (e) => {
		xe(e, s({
			get content() {
				return t.content;
			},
			get onPlaced() {
				return t.onPlaced;
			}
		}, () => o));
	};
	r(l, (e) => {
		n() ? e(u) : e(d, -1);
	}), i(e, c);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
var Y = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled.forceMount.ref.tooltip.contentPointerEvents".split(".")), Te = t("<!> <!>", 1);
function X(t, o) {
	b(o, !0);
	let s = y(o, "interactOutsideBehavior", 3, "close"), u = y(o, "trapFocus", 3, !0), d = y(o, "isValidEvent", 3, () => !1), h = y(o, "customAnchor", 3, null), g = y(o, "isStatic", 3, !1), _ = y(o, "tooltip", 3, !1), v = y(o, "contentPointerEvents", 3, "auto"), S = f(o, Y), C = x(() => o.preventScroll ?? !0), w = x(() => o.strategy ?? (l(C) ? "fixed" : "absolute"));
	we(t, {
		get isStatic() {
			return g();
		},
		get id() {
			return o.id;
		},
		get side() {
			return o.side;
		},
		get sideOffset() {
			return o.sideOffset;
		},
		get align() {
			return o.align;
		},
		get alignOffset() {
			return o.alignOffset;
		},
		get arrowPadding() {
			return o.arrowPadding;
		},
		get avoidCollisions() {
			return o.avoidCollisions;
		},
		get collisionBoundary() {
			return o.collisionBoundary;
		},
		get collisionPadding() {
			return o.collisionPadding;
		},
		get sticky() {
			return o.sticky;
		},
		get hideWhenDetached() {
			return o.hideWhenDetached;
		},
		get updatePositionStrategy() {
			return o.updatePositionStrategy;
		},
		get strategy() {
			return l(w);
		},
		get dir() {
			return o.dir;
		},
		get wrapperId() {
			return o.wrapperId;
		},
		get style() {
			return o.style;
		},
		get onPlaced() {
			return o.onPlaced;
		},
		get customAnchor() {
			return h();
		},
		get enabled() {
			return o.enabled;
		},
		get tooltip() {
			return _();
		},
		content: (e, t) => {
			let f = () => (t?.()).props, h = () => (t?.()).wrapperProps;
			var g = Te(), _ = m(g), y = (e) => {
				z(e, { get preventScroll() {
					return l(C);
				} });
			}, b = (e) => {
				z(e, { get preventScroll() {
					return l(C);
				} });
			};
			r(_, (e) => {
				o.forceMount && o.enabled ? e(y) : o.forceMount || e(b, 1);
			});
			var w = c(_, 2);
			te(w, {
				get onOpenAutoFocus() {
					return o.onOpenAutoFocus;
				},
				get onCloseAutoFocus() {
					return o.onCloseAutoFocus;
				},
				get loop() {
					return o.loop;
				},
				get enabled() {
					return o.enabled;
				},
				get trapFocus() {
					return u();
				},
				get forceMount() {
					return o.forceMount;
				},
				get ref() {
					return o.ref;
				},
				focusScope: (e, t) => {
					let r = () => (t?.()).props;
					R(e, {
						get onEscapeKeydown() {
							return o.onEscapeKeydown;
						},
						get escapeKeydownBehavior() {
							return o.escapeKeydownBehavior;
						},
						get enabled() {
							return o.enabled;
						},
						get ref() {
							return o.ref;
						},
						children: (e, t) => {
							ee(e, {
								get id() {
									return o.id;
								},
								get onInteractOutside() {
									return o.onInteractOutside;
								},
								get onFocusOutside() {
									return o.onFocusOutside;
								},
								get interactOutsideBehavior() {
									return s();
								},
								get isValidEvent() {
									return d();
								},
								get enabled() {
									return o.enabled;
								},
								get ref() {
									return o.ref;
								},
								children: (e, t) => {
									let s = () => (t?.()).props;
									L(e, {
										get id() {
											return o.id;
										},
										get preventOverflowTextSelection() {
											return o.preventOverflowTextSelection;
										},
										get onPointerDown() {
											return o.onPointerDown;
										},
										get onPointerUp() {
											return o.onPointerUp;
										},
										get enabled() {
											return o.enabled;
										},
										get ref() {
											return o.ref;
										},
										children: (e, t) => {
											var c = a(), u = m(c);
											{
												let e = x(() => ({
													props: A(S, f(), s(), r(), {
														id: o.id,
														style: { pointerEvents: v() }
													}),
													wrapperProps: h()
												}));
												n(u, () => o.popper ?? p, () => l(e));
											}
											i(e, c);
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
			}), i(e, g);
		},
		$$slots: { content: !0 }
	}), e();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
var Ee = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.open.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.ref.shouldRender".split("."));
function De(e, t) {
	let n = y(t, "interactOutsideBehavior", 3, "close"), o = y(t, "trapFocus", 3, !0), c = y(t, "isValidEvent", 3, () => !1), l = y(t, "customAnchor", 3, null), u = y(t, "isStatic", 3, !1), d = f(t, Ee);
	var p = a(), h = m(p), g = (e) => {
		X(e, s({
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
				return l();
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
				return o();
			},
			get isValidEvent() {
				return c();
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
	r(h, (e) => {
		t.shouldRender && e(g);
	}), i(e, p);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
var Oe = /* @__PURE__ */ new Set(/* @__PURE__ */ "$$slots.$$events.$$legacy.popper.onEscapeKeydown.escapeKeydownBehavior.preventOverflowTextSelection.id.onPointerDown.onPointerUp.side.sideOffset.align.alignOffset.arrowPadding.avoidCollisions.collisionBoundary.collisionPadding.sticky.hideWhenDetached.updatePositionStrategy.strategy.dir.preventScroll.wrapperId.style.onPlaced.onInteractOutside.onCloseAutoFocus.onOpenAutoFocus.onFocusOutside.interactOutsideBehavior.loop.trapFocus.isValidEvent.customAnchor.isStatic.enabled".split("."));
function ke(e, t) {
	let n = y(t, "interactOutsideBehavior", 3, "close"), r = y(t, "trapFocus", 3, !0), i = y(t, "isValidEvent", 3, () => !1), a = y(t, "customAnchor", 3, null), o = y(t, "isStatic", 3, !1), c = f(t, Oe);
	X(e, s({
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
	}, () => c, { forceMount: !0 }));
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
			let r = T(e);
			return [
				o(r, "pointermove", (n) => {
					this.#p([n.clientX, n.clientY], e, t);
				}),
				o(e, "pointerleave", (e) => {
					let n = e.relatedTarget;
					if (O(n) && t.contains(n)) return;
					let r = this.#e.ignoredTargets?.() ?? [];
					O(n) && r.some((e) => e === n || e.contains(n)) || (this.#a = O(n) && r.length > 0 ? r.filter((e) => n.contains(e)) : [], this.#r = [e.clientX, e.clientY], this.#i = "content", this.#u());
				}),
				o(e, "pointerenter", () => {
					this.#m();
				}),
				o(t, "pointerenter", () => {
					this.#m();
				}),
				o(t, "pointerleave", (t) => {
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
