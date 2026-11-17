import { $ as e, Et as t, G as n, J as r, K as i, Mt as a, Nt as o, P as s, Tt as c, W as l, _ as u, a as d, ct as f, dt as p, gt as m, i as h, mt as g, nt as _, ot as v, r as y, ut as b, vt as x, xt as S, z as C } from "./index-client-XkLzkVYC.js";
import { A as w, B as T, E, F as D, K as O, M as k, O as A, Q as j, R as M, V as N, W as P, X as F, d as I, et as L, f as ee, j as R, k as te, m as z, nt as ne, o as B, q as re, s as V, st as H, u as U, w as ie, x as ae, y as oe, z as se } from "./LoadingPlaceholder-lit91akO.js";
import { t as ce } from "./roving-focus-group-Dam_0Ov6.js";
import { S as le, d as ue, f as W, p as de, u as fe } from "./useDialogHistory.svelte-BgJftJRE.js";
import { a as G, i as pe, n as me, o as he, r as ge } from "./safe-polygon.svelte-NujogFy-.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/events.js
var _e = class {
	eventName;
	options;
	constructor(e, t = {
		bubbles: !0,
		cancelable: !0
	}) {
		this.eventName = e, this.options = t;
	}
	createEvent(e) {
		return new CustomEvent(this.eventName, {
			...this.options,
			detail: e
		});
	}
	dispatch(e, t) {
		let n = this.createEvent(t);
		return e.dispatchEvent(n), n;
	}
	listen(t, n, r) {
		return e(t, this.eventName, (e) => {
			n(e);
		}, r);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/arrays.js
function ve(e, t) {
	if (t <= 0) return [];
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function ye(e, t) {
	return e >= 0 && e < t.length;
}
function K(e, t, n) {
	let r = t.toLowerCase();
	if (r.endsWith(" ")) {
		let i = r.slice(0, -1);
		if (e.filter((e) => e.toLowerCase().startsWith(i)).length <= 1) return K(e, i, n);
		let a = n?.toLowerCase();
		if (a && a.startsWith(i) && a.charAt(i.length) === " " && t.trim() === i) return n;
		let o = e.filter((e) => e.toLowerCase().startsWith(r));
		if (o.length > 0) {
			let t = n ? e.indexOf(n) : -1;
			return q(o, Math.max(t, 0)).find((e) => e !== n) || n;
		}
	}
	let i = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, a = i.toLowerCase(), o = n ? e.indexOf(n) : -1, s = q(e, Math.max(o, 0));
	i.length === 1 && (s = s.filter((e) => e !== n));
	let c = s.find((e) => e?.toLowerCase().startsWith(a));
	return c === n ? void 0 : c;
}
function q(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/box-auto-reset.svelte.js
var be = {
	afterMs: 1e4,
	onChange: V
};
function xe(e, t) {
	let { afterMs: n, onChange: r, getWindow: i } = {
		...be,
		...t
	}, a = null, o = x(g(e));
	function s() {
		return i().setTimeout(() => {
			m(o, e, !0), r?.(e);
		}, n);
	}
	return f(() => () => {
		a && i().clearTimeout(a);
	}), H(() => _(o), (e) => {
		m(o, e, !0), r?.(e), a && i().clearTimeout(a), a = s();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/dom-typeahead.svelte.js
var Se = class {
	#e;
	#t;
	#n = S(() => this.#e.onMatch ? this.#e.onMatch : (e) => e.focus());
	#r = S(() => this.#e.getCurrentItem ? this.#e.getCurrentItem : this.#e.getActiveElement);
	constructor(e) {
		this.#e = e, this.#t = xe("", {
			afterMs: 1e3,
			getWindow: e.getWindow
		}), this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this), this.resetTypeahead = this.resetTypeahead.bind(this);
	}
	handleTypeaheadSearch(e, t) {
		if (!t.length) return;
		this.#t.current = this.#t.current + e;
		let n = _(this.#r)(), r = t.find((e) => e === n)?.textContent?.trim() ?? "", i = K(t.map((e) => e.textContent?.trim() ?? ""), this.#t.current, r), a = t.find((e) => e.textContent?.trim() === i);
		return a && _(this.#n)(a), a;
	}
	resetTypeahead() {
		this.#t.current = "";
	}
	get search() {
		return this.#t.current;
	}
}, J = [E, " "], Ce = [
	ae,
	w,
	A
], Y = [
	ie,
	te,
	"End"
], we = [...Ce, ...Y];
[...J], [...J];
function X(e) {
	return e.pointerType === "mouse";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/focus.js
function Te(e, { select: t = !1 } = {}) {
	if (!e || !e.focus) return;
	let n = P(e);
	if (n.activeElement === e) return;
	let r = n.activeElement;
	e.focus({ preventScroll: !0 }), e !== r && oe(e) && t && e.select();
}
function Ee(e, { select: t = !1 } = {}, n) {
	let r = n();
	for (let i of e) if (Te(i, { select: t }), n() !== r) return !0;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/is-using-keyboard/is-using-keyboard.svelte.js
var Z = x(!1), De = class t {
	static _refs = 0;
	static _cleanup;
	constructor() {
		f(() => (t._refs === 0 && (t._cleanup = v(() => {
			let t = [], n = (e) => {
				m(Z, !1);
			};
			return t.push(e(document, "pointerdown", n, { capture: !0 }), e(document, "keydown", (e) => {
				m(Z, !0);
			}, { capture: !0 })), f(() => {
				if (_(Z)) return e(document, "pointermove", n, { capture: !0 });
			}), ne(...t);
		})), t._refs++, () => {
			t._refs--, t._refs === 0 && (m(Z, !1), t._cleanup?.());
		}));
	}
	get current() {
		return _(Z);
	}
	set current(e) {
		m(Z, e, !0);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/tabbable.js
function Q() {
	return {
		getShadowRoot: !0,
		displayCheck: typeof ResizeObserver == "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
	};
}
function Oe(e, t) {
	if (!W(e, Q())) return ke(e, t);
	let n = P(e), r = de(n.body, Q());
	t === "prev" && r.reverse();
	let i = r.indexOf(e);
	return i === -1 ? n.body : r.slice(i + 1)[0];
}
function ke(e, t) {
	let n = P(e);
	if (!ue(e, Q())) return n.body;
	let r = fe(n.body, Q());
	t === "prev" && r.reverse();
	let i = r.indexOf(e);
	return i === -1 ? n.body : r.slice(i + 1).find((e) => W(e, Q())) ?? n.body;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/menu.svelte.js
var Ae = new j("Menu.Root"), $ = new j("Menu.Root | Menu.Sub"), je = new j("Menu.Content");
new j("Menu.Group | Menu.RadioGroup"), new j("Menu.RadioGroup"), new j("Menu.CheckboxGroup");
var Me = new _e("bitsmenuopen", {
	bubbles: !1,
	cancelable: !0
}), Ne = D({
	component: "menu",
	parts: [
		"trigger",
		"content",
		"sub-trigger",
		"item",
		"group",
		"group-heading",
		"checkbox-group",
		"checkbox-item",
		"radio-group",
		"radio-item",
		"separator",
		"sub-content",
		"arrow"
	]
}), Pe = class {
	#e;
	#t = null;
	#n = null;
	#r = !1;
	#i = null;
	#a = null;
	#o = null;
	#s = null;
	constructor(e) {
		this.#e = e, F([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (this.#_(), !e || !t || !n) return;
			let r = (e) => {
				X(e) && (this.#s = {
					x: e.clientX,
					y: e.clientY
				}, this.#r || this.#d(e, "content"));
			}, i = (e) => {
				X(e) && this.#f(e, "content");
			}, a = (e) => {
				X(e) && (this.#r || this.#d(e, "trigger"));
			}, o = (e) => {
				if (X(e)) {
					if (I(e.relatedTarget)) {
						let n = this.#e.subContentSelector(), r = e.relatedTarget.closest(n);
						if (r && r !== t && r.id && t.querySelector(`[aria-controls="${r.id}"]`)) return;
					}
					this.#f(e, "trigger");
				}
			}, s = (e) => {
				X(e) && this.#m();
			}, c = (e) => {
				X(e) && this.#m();
			};
			return e.addEventListener("pointermove", r), e.addEventListener("pointerleave", i), e.addEventListener("pointerenter", s), t.addEventListener("pointermove", a), t.addEventListener("pointerleave", o), t.addEventListener("pointerenter", c), () => {
				e.removeEventListener("pointermove", r), e.removeEventListener("pointerleave", i), e.removeEventListener("pointerenter", s), t.removeEventListener("pointermove", a), t.removeEventListener("pointerleave", o), t.removeEventListener("pointerenter", c), this.#_();
			};
		}), re(() => {
			this.#_();
		});
	}
	#c() {
		let e = this.#e.parentContentNode();
		return e ? e.getBoundingClientRect() : this.#e.triggerNode()?.getBoundingClientRect() ?? null;
	}
	#l(e, t) {
		let n = this.#e.triggerNode(), r = this.#e.contentNode();
		if (!n || !r) return null;
		let i = n.getBoundingClientRect(), a = r.getBoundingClientRect(), o = Re(i, a), s, c, l;
		return t === "content" ? (s = this.#r ? this.#a ?? e : e, c = a) : (s = this.#s ?? e, c = this.#c() ?? i, l = a), this.#a = s, {
			corridor: ze(i, a, o),
			intent: Be(s, c, o, t, l),
			targetRect: c,
			side: o
		};
	}
	#u(e, t, n) {
		return Fe(e, t) || Fe(e, n);
	}
	#d(e, t) {
		let n = {
			x: e.clientX,
			y: e.clientY
		};
		this.#l(n, t) && (this.#i = t, this.#o = n);
	}
	#f(e, t) {
		if (!this.#e.enabled()) return;
		let n = this.#e.triggerNode(), r = this.#e.contentNode();
		if (!n || !r) return;
		let i = e.relatedTarget;
		if (I(i) && (t === "content" && r.contains(i) || t === "trigger" && n.contains(i))) return;
		let a = {
			x: e.clientX,
			y: e.clientY
		}, o = this.#l(a, t);
		o && (!Ie(a, o.targetRect) && !this.#u(a, o.corridor, o.intent) ? this.#w() : (this.#r = !0, this.#i = t, this.#o = a, this.#e.setIsPointerInTransit(!0), this.#b(), this.#S()));
	}
	#p = null;
	#m() {
		if (!this.#r) return;
		let e = this.#i === "trigger";
		this.#x(), this.#C(), this.#r = !1, this.#w(), e ? (this.#h(), this.#p = setTimeout(() => {
			this.#p = null, this.#e.setIsPointerInTransit(!1);
		}, 100)) : this.#e.setIsPointerInTransit(!1);
	}
	#h() {
		this.#p !== null && (clearTimeout(this.#p), this.#p = null);
	}
	#g() {
		let e = this.#o;
		this.#x(), this.#C(), this.#h(), this.#r = !1, this.#e.setIsPointerInTransit(!1), this.#w(), this.#e.onIntentExit(e);
	}
	#_() {
		this.#x(), this.#C(), this.#h(), this.#r && this.#e.setIsPointerInTransit(!1), this.#r = !1, this.#i = null, this.#a = null, this.#o = null, this.#s = null;
	}
	#v(e) {
		let t = this.#e.contentNode();
		if (!t) return !1;
		let n = t.ownerDocument.elementFromPoint(e.x, e.y);
		if (!n) return !1;
		let r = this.#e.subContentSelector(), i = n.closest(r);
		return !i || i === t ? !1 : i.id ? !!t.querySelector(`[aria-controls="${i.id}"]`) : !1;
	}
	#y = (e) => {
		if (!this.#r || !this.#i || !X(e)) return;
		let t = this.#e.triggerNode(), n = this.#e.contentNode();
		if (!t || !n) {
			this.#g();
			return;
		}
		this.#C();
		let r = {
			x: e.clientX,
			y: e.clientY
		};
		this.#o = r;
		let i = t.getBoundingClientRect(), a = n.getBoundingClientRect();
		if (this.#i === "content" && Ie(r, a) || this.#i === "trigger" && Le(r, i, 4)) {
			this.#m();
			return;
		}
		if (this.#v(r)) {
			this.#S();
			return;
		}
		let o = this.#l(r, this.#i);
		o && this.#u(r, o.corridor, o.intent) ? this.#S() : this.#g();
	};
	#b() {
		if (this.#t) return;
		let e = P(this.#e.triggerNode() ?? this.#e.contentNode());
		e && (e.addEventListener("pointermove", this.#y, !0), this.#t = () => {
			e.removeEventListener("pointermove", this.#y, !0), this.#t = null;
		});
	}
	#x() {
		this.#t?.();
	}
	#S() {
		this.#C(), this.#n = setTimeout(() => {
			this.#n = null, this.#r && this.#g();
		}, 500);
	}
	#C() {
		this.#n !== null && (clearTimeout(this.#n), this.#n = null);
	}
	#w() {
		this.#i = null, this.#a = null, this.#o = null;
	}
};
function Fe(e, t) {
	let { x: n, y: r } = e, i = !1;
	for (let e = 0, a = t.length - 1; e < t.length; a = e++) {
		let o = t[e].x, s = t[e].y, c = t[a].x, l = t[a].y;
		s > r != l > r && n < (c - o) * (r - s) / (l - s) + o && (i = !i);
	}
	return i;
}
function Ie(e, t) {
	return e.x >= t.left && e.x <= t.right && e.y >= t.top && e.y <= t.bottom;
}
function Le(e, t, n) {
	return e.x >= t.left + n && e.x <= t.right - n && e.y >= t.top + n && e.y <= t.bottom - n;
}
function Re(e, t) {
	let n = e.left + e.width / 2, r = e.top + e.height / 2, i = t.left + t.width / 2, a = t.top + t.height / 2, o = i - n, s = a - r;
	return Math.abs(o) > Math.abs(s) ? o > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function ze(e, t, n) {
	switch (n) {
		case "top": return [
			{
				x: Math.min(e.left, t.left) - 2,
				y: e.top
			},
			{
				x: Math.min(e.left, t.left) - 2,
				y: t.bottom
			},
			{
				x: Math.max(e.right, t.right) + 2,
				y: t.bottom
			},
			{
				x: Math.max(e.right, t.right) + 2,
				y: e.top
			}
		];
		case "bottom": return [
			{
				x: Math.min(e.left, t.left) - 2,
				y: e.bottom
			},
			{
				x: Math.min(e.left, t.left) - 2,
				y: t.top
			},
			{
				x: Math.max(e.right, t.right) + 2,
				y: t.top
			},
			{
				x: Math.max(e.right, t.right) + 2,
				y: e.bottom
			}
		];
		case "left": return [
			{
				x: e.left,
				y: Math.min(e.top, t.top) - 2
			},
			{
				x: t.right,
				y: Math.min(e.top, t.top) - 2
			},
			{
				x: t.right,
				y: Math.max(e.bottom, t.bottom) + 2
			},
			{
				x: e.left,
				y: Math.max(e.bottom, t.bottom) + 2
			}
		];
		case "right": return [
			{
				x: e.right,
				y: Math.min(e.top, t.top) - 2
			},
			{
				x: t.left,
				y: Math.min(e.top, t.top) - 2
			},
			{
				x: t.left,
				y: Math.max(e.bottom, t.bottom) + 2
			},
			{
				x: e.right,
				y: Math.max(e.bottom, t.bottom) + 2
			}
		];
	}
}
function Be(e, t, n, r, i) {
	let a = r === "trigger" ? Ve(n) : n, o = i ? Math.min(t.top, i.top) - 8 : t.top - 8, s = i ? Math.max(t.bottom, i.bottom) + 8 : t.bottom + 8, c = i ? Math.min(t.left, i.left) - 8 : t.left - 8, l = i ? Math.max(t.right, i.right) + 8 : t.right + 8;
	switch (a) {
		case "right": return [
			e,
			{
				x: t.left,
				y: o
			},
			{
				x: t.left,
				y: s
			}
		];
		case "left": return [
			e,
			{
				x: t.right,
				y: o
			},
			{
				x: t.right,
				y: s
			}
		];
		case "bottom": return [
			e,
			{
				x: c,
				y: t.top
			},
			{
				x: l,
				y: t.top
			}
		];
		case "top": return [
			e,
			{
				x: c,
				y: t.bottom
			},
			{
				x: l,
				y: t.bottom
			}
		];
	}
}
function Ve(e) {
	switch (e) {
		case "top": return "bottom";
		case "bottom": return "top";
		case "left": return "right";
		case "right": return "left";
	}
}
var He = class e {
	static create(t) {
		let n = new e(t);
		return Ae.set(n);
	}
	opts;
	isUsingKeyboard = new De();
	#e = x(!1);
	get ignoreCloseAutoFocus() {
		return _(this.#e);
	}
	set ignoreCloseAutoFocus(e) {
		m(this.#e, e, !0);
	}
	#t = x(!1);
	get isPointerInTransit() {
		return _(this.#t);
	}
	set isPointerInTransit(e) {
		m(this.#t, e, !0);
	}
	constructor(e) {
		this.opts = e;
	}
	getBitsAttr = (e) => Ne.getAttr(e, this.opts.variant.current);
}, Ue = class e {
	static create(t, n) {
		return $.set(new e(t, n, null));
	}
	opts;
	root;
	parentMenu;
	#e = x(H(() => ""));
	get contentId() {
		return _(this.#e);
	}
	set contentId(e) {
		m(this.#e, e);
	}
	#t = x(null);
	get contentNode() {
		return _(this.#t);
	}
	set contentNode(e) {
		m(this.#t, e, !0);
	}
	contentPresence;
	#n = x(null);
	get triggerNode() {
		return _(this.#n);
	}
	set triggerNode(e) {
		m(this.#n, e, !0);
	}
	constructor(e, t, n) {
		this.opts = e, this.root = t, this.parentMenu = n, this.contentPresence = new le({
			ref: H(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
			shouldSkipExitAnimation: () => this.root.opts.variant.current !== "menubar" || this.parentMenu !== null ? !1 : this.root.opts.shouldSkipExitAnimation?.() ?? !1
		}), n && F(() => n.opts.open.current, () => {
			n.opts.open.current || (this.opts.open.current = !1);
		});
	}
	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}
	onOpen() {
		this.opts.open.current = !0;
	}
	onClose() {
		this.opts.open.current = !1;
	}
}, We = class e {
	static create(t) {
		return je.set(new e(t, $.get()));
	}
	opts;
	parentMenu;
	rovingFocusGroup;
	domContext;
	attachment;
	#e = x("");
	get search() {
		return _(this.#e);
	}
	set search(e) {
		m(this.#e, e, !0);
	}
	#t = 0;
	#n;
	#r = x(!1);
	get mounted() {
		return _(this.#r);
	}
	set mounted(e) {
		m(this.#r, e, !0);
	}
	pressedItem = null;
	#i;
	constructor(e, t) {
		this.opts = e, this.parentMenu = t, this.domContext = new N(e.ref), this.attachment = T(this.opts.ref, (e) => {
			this.parentMenu.contentNode !== e && (this.parentMenu.contentNode = e);
		}), t.contentId = e.id, this.#i = e.isSub ?? !1, this.onkeydown = this.onkeydown.bind(this), this.onblur = this.onblur.bind(this), this.onfocus = this.onfocus.bind(this), this.handleInteractOutside = this.handleInteractOutside.bind(this), new Pe({
			contentNode: () => this.parentMenu.contentNode,
			triggerNode: () => this.parentMenu.triggerNode,
			parentContentNode: () => this.parentMenu.parentMenu?.contentNode ?? null,
			subContentSelector: () => `[${this.parentMenu.root.getBitsAttr("sub-content")}]`,
			enabled: () => this.parentMenu.opts.open.current && !!this.parentMenu.triggerNode?.hasAttribute(this.parentMenu.root.getBitsAttr("sub-trigger")),
			onIntentExit: (e) => {
				this.parentMenu.opts.open.current = !1, this.#s(e);
			},
			setIsPointerInTransit: (e) => {
				this.parentMenu.root.isPointerInTransit = e;
			}
		}), this.#n = new Se({
			getActiveElement: () => this.domContext.getActiveElement(),
			getWindow: () => this.domContext.getWindow()
		}).handleTypeaheadSearch, this.rovingFocusGroup = new ce({
			rootNode: H(() => this.parentMenu.contentNode),
			candidateAttr: this.parentMenu.root.getBitsAttr("item"),
			loop: this.opts.loop,
			orientation: H(() => "vertical")
		}), F(() => this.parentMenu.contentNode, (e) => e ? Me.listen(e, () => {
			O(() => {
				this.parentMenu.root.isUsingKeyboard.current && this.rovingFocusGroup.focusFirstCandidate();
			});
		}) : void 0), f(() => {
			this.parentMenu.opts.open.current || (this.domContext.getWindow().clearTimeout(this.#t), this.clearPressedItem());
		});
	}
	#a() {
		let e = this.parentMenu.contentNode;
		return e ? Array.from(e.querySelectorAll(`[${this.parentMenu.root.getBitsAttr("item")}]:not([data-disabled])`)) : [];
	}
	#o() {
		return this.parentMenu.root.isPointerInTransit;
	}
	#s(e) {
		if (!e) return;
		let t = this.parentMenu.parentMenu?.contentNode;
		if (!t) return;
		let n = this.domContext.getDocument().elementFromPoint(e.x, e.y);
		if (!I(n)) return;
		let r = n.closest(`[${this.parentMenu.root.getBitsAttr("sub-trigger")}]`);
		r && t.contains(r) && r !== this.parentMenu.triggerNode && r.dispatchEvent(new PointerEvent("pointermove", {
			bubbles: !0,
			cancelable: !0,
			pointerType: "mouse",
			clientX: e.x,
			clientY: e.y
		}));
	}
	onCloseAutoFocus = (e) => {
		this.opts.onCloseAutoFocus.current?.(e), !(e.defaultPrevented || this.#i) && (this.parentMenu.root.ignoreCloseAutoFocus ? e.preventDefault() : this.parentMenu.triggerNode && W(this.parentMenu.triggerNode) && (e.preventDefault(), this.parentMenu.triggerNode.focus()));
	};
	handleTabKeyDown(e) {
		let t = this.parentMenu;
		for (; t.parentMenu !== null;) t = t.parentMenu;
		if (!t.triggerNode) return;
		e.preventDefault();
		let n = Oe(t.triggerNode, e.shiftKey ? "prev" : "next");
		n ? (this.parentMenu.root.ignoreCloseAutoFocus = !0, t.onClose(), O(() => {
			n.focus(), O(() => {
				this.parentMenu.root.ignoreCloseAutoFocus = !1;
			});
		})) : this.domContext.getDocument().body.focus();
	}
	onkeydown(e) {
		if (e.defaultPrevented) return;
		if (e.key === "Tab") {
			this.handleTabKeyDown(e);
			return;
		}
		let t = e.target, n = e.currentTarget;
		if (!z(t) || !z(n)) return;
		let r = t.closest(`[${this.parentMenu.root.getBitsAttr("content")}]`)?.id === this.parentMenu.contentId.current, i = e.ctrlKey || e.altKey || e.metaKey, a = e.key.length === 1;
		if (this.rovingFocusGroup.handleKeydown(t, e) || e.code === "Space") return;
		let o = this.#a();
		r && !i && a && this.#n(e.key, o), e.target?.id === this.parentMenu.contentId.current && we.includes(e.key) && (e.preventDefault(), Y.includes(e.key) && o.reverse(), Ee(o, { select: !1 }, () => this.domContext.getActiveElement()));
	}
	onblur(e) {
		I(e.currentTarget) && I(e.target) && (e.currentTarget.contains?.(e.target) || (this.domContext.getWindow().clearTimeout(this.#t), this.search = ""));
	}
	onfocus(e) {
		this.parentMenu.root.isUsingKeyboard.current && O(() => this.rovingFocusGroup.focusFirstCandidate());
	}
	onItemEnter() {
		return this.#o();
	}
	onItemLeave(e) {
		e.currentTarget.hasAttribute(this.parentMenu.root.getBitsAttr("sub-trigger")) || this.#o() || this.parentMenu.root.isUsingKeyboard.current || (this.parentMenu.contentNode?.focus({ preventScroll: !0 }), this.rovingFocusGroup.setCurrentTabStopId(""));
	}
	onTriggerLeave() {
		return !!this.#o();
	}
	handleInteractOutside(e) {
		if (!ee(e.target)) return;
		let t = this.parentMenu.triggerNode?.id;
		e.target.id === t || e.target.closest(`#${t}`) ? e.preventDefault() : (this.parentMenu.root.ignoreCloseAutoFocus = !0, O(() => {
			this.parentMenu.root.ignoreCloseAutoFocus = !1;
		}));
	}
	clearPressedItem = () => {
		this.pressedItem = null;
	};
	get shouldRender() {
		return this.parentMenu.contentPresence.shouldRender;
	}
	#c = S(() => ({ open: this.parentMenu.opts.open.current }));
	get snippetProps() {
		return _(this.#c);
	}
	set snippetProps(e) {
		m(this.#c, e);
	}
	#l = S(() => ({
		id: this.opts.id.current,
		role: "menu",
		"aria-orientation": "vertical",
		[this.parentMenu.root.getBitsAttr("content")]: "",
		"data-state": M(this.parentMenu.opts.open.current),
		...se(this.parentMenu.contentPresence.transitionStatus),
		onkeydown: this.onkeydown,
		onblur: this.onblur,
		onfocus: this.onfocus,
		onpointerdowncapture: this.clearPressedItem,
		dir: this.parentMenu.root.opts.dir.current,
		style: {
			pointerEvents: "auto",
			contain: "layout style"
		},
		...this.attachment
	}));
	get props() {
		return _(this.#l);
	}
	set props(e) {
		m(this.#l, e);
	}
	popperProps = { onCloseAutoFocus: (e) => this.onCloseAutoFocus(e) };
}, Ge = class {
	opts;
	content;
	attachment;
	#e = x(!1);
	constructor(e, t) {
		this.opts = e, this.content = t, this.attachment = T(this.opts.ref), this.onpointermove = this.onpointermove.bind(this), this.onpointerleave = this.onpointerleave.bind(this), this.onfocus = this.onfocus.bind(this), this.onblur = this.onblur.bind(this);
	}
	onpointermove(e) {
		if (!e.defaultPrevented && X(e)) {
			if (this.opts.disabled.current) this.content.onItemLeave(e);
			else {
				if (this.content.onItemEnter()) return;
				let t = e.currentTarget;
				if (!z(t)) return;
				t.focus({ preventScroll: !0 });
			}
		}
	}
	onpointerleave(e) {
		e.defaultPrevented || X(e) && this.content.onItemLeave(e);
	}
	onfocus(e) {
		O(() => {
			e.defaultPrevented || this.opts.disabled.current || m(this.#e, !0);
		});
	}
	onblur(e) {
		O(() => {
			e.defaultPrevented || m(this.#e, !1);
		});
	}
	#t = S(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "menuitem",
		"aria-disabled": k(this.opts.disabled.current),
		"data-disabled": R(this.opts.disabled.current),
		"data-highlighted": _(this.#e) ? "" : void 0,
		[this.content.parentMenu.root.getBitsAttr("item")]: "",
		onpointermove: this.onpointermove,
		onpointerleave: this.onpointerleave,
		onfocus: this.onfocus,
		onblur: this.onblur,
		...this.attachment
	}));
	get props() {
		return _(this.#t);
	}
	set props(e) {
		m(this.#t, e);
	}
}, Ke = class e {
	static create(t) {
		let n = new Ge(t, je.get());
		return new e(t, n);
	}
	opts;
	item;
	root;
	constructor(e, t) {
		this.opts = e, this.item = t, this.root = t.content.parentMenu.root, this.onkeydown = this.onkeydown.bind(this), this.onclick = this.onclick.bind(this), this.onpointerdown = this.onpointerdown.bind(this), this.onpointerup = this.onpointerup.bind(this);
	}
	#e() {
		if (this.item.opts.disabled.current) return;
		let e = new CustomEvent("menuitemselect", {
			bubbles: !0,
			cancelable: !0
		});
		this.opts.onSelect.current(e), e.defaultPrevented ? this.item.content.parentMenu.root.isUsingKeyboard.current = !1 : this.opts.closeOnSelect.current && this.item.content.parentMenu.root.opts.onClose();
	}
	onkeydown(e) {
		let t = this.item.content.search !== "";
		if (!(this.item.opts.disabled.current || t && e.key === " ") && J.includes(e.key)) {
			if (!z(e.currentTarget)) return;
			e.currentTarget.click(), e.preventDefault();
		}
	}
	onclick(e) {
		this.item.opts.disabled.current || this.#e();
	}
	onpointerup(e) {
		let t = this.item.content, n = t.pressedItem;
		if (t.pressedItem = null, e.defaultPrevented || n?.item === this) return;
		let r = n && Math.hypot(e.clientX - n.x, e.clientY - n.y) < 4 ? n.item.item.opts.ref.current : e.currentTarget;
		z(r) && r.click();
	}
	onpointerdown(e) {
		this.item.content.pressedItem = {
			item: this,
			x: e.clientX,
			y: e.clientY
		};
	}
	#t = S(() => L(this.item.props, {
		onclick: this.onclick,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		onkeydown: this.onkeydown
	}));
	get props() {
		return _(this.#t);
	}
	set props(e) {
		m(this.#t, e);
	}
}, qe = class e {
	static create(t) {
		return new e(t, Ae.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = T(this.opts.ref);
	}
	#e = S(() => ({
		id: this.opts.id.current,
		role: "separator",
		[this.root.getBitsAttr("separator")]: "",
		...this.attachment
	}));
	get props() {
		return _(this.#e);
	}
	set props(e) {
		m(this.#e, e);
	}
}, Je = class e {
	static create(t) {
		return new e(t, $.get());
	}
	opts;
	parentMenu;
	attachment;
	constructor(e, t) {
		this.opts = e, this.parentMenu = t, this.attachment = T(this.opts.ref, (e) => this.parentMenu.triggerNode = e);
	}
	onclick = (e) => {
		this.opts.disabled.current || e.detail !== 0 || (this.parentMenu.toggleOpen(), e.preventDefault());
	};
	onpointerdown = (e) => {
		if (!(this.opts.disabled.current || U(this.opts.ref.current))) {
			if (e.pointerType === "touch") return e.preventDefault();
			e.button === 0 && e.ctrlKey === !1 && (this.parentMenu.toggleOpen(), this.parentMenu.opts.open.current || e.preventDefault());
		}
	};
	onpointerup = (e) => {
		this.opts.disabled.current || U(this.opts.ref.current) || e.pointerType === "touch" && (e.preventDefault(), this.parentMenu.toggleOpen());
	};
	onkeydown = (e) => {
		this.opts.disabled.current || (e.key === " " || e.key === "Enter" ? (this.parentMenu.toggleOpen(), e.preventDefault()) : e.key === "ArrowDown" && (this.parentMenu.onOpen(), e.preventDefault()));
	};
	#e = S(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current) return this.parentMenu.contentId.current;
	});
	#t = S(() => ({
		id: this.opts.id.current,
		disabled: this.opts.disabled.current,
		"aria-haspopup": "menu",
		"aria-expanded": k(this.parentMenu.opts.open.current),
		"aria-controls": _(this.#e),
		"data-disabled": R(this.opts.disabled.current),
		"data-state": M(this.parentMenu.opts.open.current),
		[this.parentMenu.root.getBitsAttr("trigger")]: "",
		onclick: this.onclick,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return _(this.#t);
	}
	set props(e) {
		m(this.#t, e);
	}
}, Ye = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"ref",
	"id",
	"disabled",
	"onSelect",
	"closeOnSelect"
]), Xe = i("<div><!></div>");
function Ze(e, i) {
	let d = r();
	t(i, !0);
	let f = y(i, "ref", 15, null), m = y(i, "id", 19, () => B(d)), g = y(i, "disabled", 3, !1), v = y(i, "onSelect", 3, V), x = y(i, "closeOnSelect", 3, !0), w = h(i, Ye), T = Ke.create({
		id: H(() => m()),
		disabled: H(() => g()),
		onSelect: H(() => v()),
		ref: H(() => f(), (e) => f(e)),
		closeOnSelect: H(() => x())
	}), E = S(() => L(w, T.props));
	var D = n(), O = p(D), k = (e) => {
		var t = n(), r = p(t);
		s(r, () => i.child, () => ({ props: _(E) })), l(e, t);
	}, A = (e) => {
		var t = Xe();
		u(t, () => ({ ..._(E) }));
		var n = b(t);
		s(n, () => i.children ?? o), a(t), l(e, t);
	};
	C(O, (e) => {
		i.child ? e(k) : e(A, -1);
	}), l(e, D), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/components/menu-separator.svelte
var Qe = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"child",
	"children"
]), $e = i("<div><!></div>");
function et(e, i) {
	let d = r();
	t(i, !0);
	let f = y(i, "ref", 15, null), m = y(i, "id", 19, () => B(d)), g = h(i, Qe), v = qe.create({
		id: H(() => m()),
		ref: H(() => f(), (e) => f(e))
	}), x = S(() => L(g, v.props));
	var w = n(), T = p(w), E = (e) => {
		var t = n(), r = p(t);
		s(r, () => i.child, () => ({ props: _(x) })), l(e, t);
	}, D = (e) => {
		var t = $e();
		u(t, () => ({ ..._(x) }));
		var n = b(t);
		s(n, () => i.children ?? o), a(t), l(e, t);
	};
	C(T, (e) => {
		i.child ? e(E) : e(D, -1);
	}), l(e, w), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/components/menu.svelte
function tt(e, r) {
	t(r, !0);
	let i = y(r, "open", 15, !1), a = y(r, "dir", 3, "ltr"), u = y(r, "onOpenChange", 3, V), d = y(r, "onOpenChangeComplete", 3, V), f = y(r, "_internal_variant", 3, "dropdown-menu"), m = y(r, "_internal_should_skip_exit_animation", 3, void 0), h = He.create({
		variant: H(() => f()),
		dir: H(() => a()),
		onClose: () => {
			i(!1), u()(!1);
		},
		shouldSkipExitAnimation: () => m()?.() ?? !1
	});
	Ue.create({
		open: H(() => i(), (e) => {
			i(e), u()(e);
		}),
		onOpenChangeComplete: H(() => d())
	}, h), he(e, {
		children: (e, t) => {
			var i = n(), a = p(i);
			s(a, () => r.children ?? o), l(e, i);
		},
		$$slots: { default: !0 }
	}), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dropdown-menu/components/dropdown-menu-content.svelte
var nt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"child",
	"children",
	"ref",
	"loop",
	"onInteractOutside",
	"onEscapeKeydown",
	"onCloseAutoFocus",
	"forceMount",
	"trapFocus",
	"style"
]), rt = i("<div><div><!></div></div>");
function it(e, i) {
	let f = r();
	t(i, !0);
	let m = y(i, "id", 19, () => B(f)), g = y(i, "ref", 15, null), v = y(i, "loop", 3, !0), x = y(i, "onInteractOutside", 3, V), w = y(i, "onEscapeKeydown", 3, V), T = y(i, "onCloseAutoFocus", 3, V), E = y(i, "forceMount", 3, !1), D = y(i, "trapFocus", 3, !1), O = h(i, nt), k = We.create({
		id: H(() => m()),
		loop: H(() => v()),
		ref: H(() => g(), (e) => g(e)),
		onCloseAutoFocus: H(() => T())
	}), A = S(() => L(O, k.props));
	function j(e) {
		if (k.handleInteractOutside(e), !e.defaultPrevented && (x()(e), !e.defaultPrevented)) {
			if (e.target && e.target instanceof Element) {
				let t = `[${k.parentMenu.root.getBitsAttr("sub-content")}]`;
				if (e.target.closest(t)) return;
			}
			k.parentMenu.onClose();
		}
	}
	function M(e) {
		w()(e), !e.defaultPrevented && k.parentMenu.onClose();
	}
	var N = n(), P = p(N), F = (e) => {
		me(e, d(() => _(A), () => k.popperProps, {
			get ref() {
				return k.opts.ref;
			},
			get enabled() {
				return k.parentMenu.opts.open.current;
			},
			onInteractOutside: j,
			onEscapeKeydown: M,
			get trapFocus() {
				return D();
			},
			get loop() {
				return v();
			},
			forceMount: !0,
			get id() {
				return m();
			},
			get shouldRender() {
				return k.shouldRender;
			},
			popper: (e, t) => {
				let r = () => (t?.()).props, c = () => (t?.()).wrapperProps, d = S(() => L(r(), { style: G("dropdown-menu") }, { style: i.style }));
				var f = n(), m = p(f), h = (e) => {
					var t = n(), r = p(t);
					{
						let e = S(() => ({
							props: _(d),
							wrapperProps: c(),
							...k.snippetProps
						}));
						s(r, () => i.child, () => _(e));
					}
					l(e, t);
				}, g = (e) => {
					var t = rt();
					u(t, () => ({ ...c() }));
					var n = b(t);
					u(n, () => ({ ..._(d) }));
					var r = b(n);
					s(r, () => i.children ?? o), a(n), a(t), l(e, t);
				};
				C(m, (e) => {
					i.child ? e(h) : e(g, -1);
				}), l(e, f);
			},
			$$slots: { popper: !0 }
		}));
	}, I = (e) => {
		ge(e, d(() => _(A), () => k.popperProps, {
			get ref() {
				return k.opts.ref;
			},
			get open() {
				return k.parentMenu.opts.open.current;
			},
			onInteractOutside: j,
			onEscapeKeydown: M,
			get trapFocus() {
				return D();
			},
			get loop() {
				return v();
			},
			forceMount: !1,
			get id() {
				return m();
			},
			get shouldRender() {
				return k.shouldRender;
			},
			popper: (e, t) => {
				let r = () => (t?.()).props, c = () => (t?.()).wrapperProps, d = S(() => L(r(), { style: G("dropdown-menu") }, { style: i.style }));
				var f = n(), m = p(f), h = (e) => {
					var t = n(), r = p(t);
					{
						let e = S(() => ({
							props: _(d),
							wrapperProps: c(),
							...k.snippetProps
						}));
						s(r, () => i.child, () => _(e));
					}
					l(e, t);
				}, g = (e) => {
					var t = rt();
					u(t, () => ({ ...c() }));
					var n = b(t);
					u(n, () => ({ ..._(d) }));
					var r = b(n);
					s(r, () => i.children ?? o), a(n), a(t), l(e, t);
				};
				C(m, (e) => {
					i.child ? e(h) : e(g, -1);
				}), l(e, f);
			},
			$$slots: { popper: !0 }
		}));
	};
	C(P, (e) => {
		E() ? e(F) : E() || e(I, 1);
	}), l(e, N), c();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/components/menu-trigger.svelte
var at = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"disabled",
	"type"
]), ot = i("<button><!></button>");
function st(e, i) {
	let d = r();
	t(i, !0);
	let f = y(i, "id", 19, () => B(d)), m = y(i, "ref", 15, null), g = y(i, "disabled", 3, !1), v = y(i, "type", 3, "button"), x = h(i, at), w = Je.create({
		id: H(() => f()),
		disabled: H(() => g() ?? !1),
		ref: H(() => m(), (e) => m(e))
	}), T = S(() => L(x, w.props, { type: v() }));
	pe(e, {
		get id() {
			return f();
		},
		get ref() {
			return w.opts.ref;
		},
		children: (e, t) => {
			var r = n(), c = p(r), d = (e) => {
				var t = n(), r = p(t);
				s(r, () => i.child, () => ({ props: _(T) })), l(e, t);
			}, f = (e) => {
				var t = ot();
				u(t, () => ({ ..._(T) }));
				var n = b(t);
				s(n, () => i.children ?? o), a(t), l(e, t);
			};
			C(c, (e) => {
				i.child ? e(d) : e(f, -1);
			}), l(e, r);
		},
		$$slots: { default: !0 }
	}), c();
}
export { Ze as a, et as i, it as n, ve as o, tt as r, ye as s, st as t };
