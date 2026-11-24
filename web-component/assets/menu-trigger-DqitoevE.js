import { B as e, Dt as t, Et as n, F as r, G as i, K as a, Nt as o, Pt as s, St as c, Y as l, _t as u, a as d, dt as f, et as p, ft as m, ht as h, i as g, lt as _, q as v, r as y, rt as b, st as x, v as S, yt as C } from "./index-client-DEFG3Gqk.js";
import { B as w, C as T, E, F as D, G as O, N as k, R as A, T as j, _ as M, a as N, b as P, g as F, k as I, l as L, m as R, o as z, r as B, s as ee, w as te } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as ne } from "./roving-focus-group-DTahsFoe.js";
import { _ as re, d as ie, g as V, h as ae, i as H, l as oe, m as se, o as ce, p as le } from "./use-id-DCa3fCKD.js";
import { S as ue, d as de, f as U, p as fe, u as pe } from "./useDialogHistory.svelte-pVteCIez.js";
import { a as W, i as me, n as he, o as ge, r as _e } from "./safe-polygon.svelte-DzVpqP0C.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/events.js
var ve = class {
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
	listen(e, t, n) {
		return p(e, this.eventName, (e) => {
			t(e);
		}, n);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/arrays.js
function ye(e, t) {
	if (t <= 0) return [];
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function be(e, t) {
	return e >= 0 && e < t.length;
}
function G(e, t, n) {
	let r = t.toLowerCase();
	if (r.endsWith(" ")) {
		let i = r.slice(0, -1);
		if (e.filter((e) => e.toLowerCase().startsWith(i)).length <= 1) return G(e, i, n);
		let a = n?.toLowerCase();
		if (a && a.startsWith(i) && a.charAt(i.length) === " " && t.trim() === i) return n;
		let o = e.filter((e) => e.toLowerCase().startsWith(r));
		if (o.length > 0) {
			let t = n ? e.indexOf(n) : -1;
			return K(o, Math.max(t, 0)).find((e) => e !== n) || n;
		}
	}
	let i = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, a = i.toLowerCase(), o = n ? e.indexOf(n) : -1, s = K(e, Math.max(o, 0));
	i.length === 1 && (s = s.filter((e) => e !== n));
	let c = s.find((e) => e?.toLowerCase().startsWith(a));
	return c === n ? void 0 : c;
}
function K(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/box-auto-reset.svelte.js
var xe = {
	afterMs: 1e4,
	onChange: H
};
function Se(e, t) {
	let { afterMs: n, onChange: r, getWindow: i } = {
		...xe,
		...t
	}, a = null, o = C(h(e));
	function s() {
		return i().setTimeout(() => {
			u(o, e, !0), r?.(e);
		}, n);
	}
	return _(() => () => {
		a && i().clearTimeout(a);
	}), O(() => b(o), (e) => {
		u(o, e, !0), r?.(e), a && i().clearTimeout(a), a = s();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/dom-typeahead.svelte.js
var Ce = class {
	#e;
	#t;
	#n = c(() => this.#e.onMatch ? this.#e.onMatch : (e) => e.focus());
	#r = c(() => this.#e.getCurrentItem ? this.#e.getCurrentItem : this.#e.getActiveElement);
	constructor(e) {
		this.#e = e, this.#t = Se("", {
			afterMs: 1e3,
			getWindow: e.getWindow
		}), this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this), this.resetTypeahead = this.resetTypeahead.bind(this);
	}
	handleTypeaheadSearch(e, t) {
		if (!t.length) return;
		this.#t.current = this.#t.current + e;
		let n = b(this.#r)(), r = t.find((e) => e === n)?.textContent?.trim() ?? "", i = G(t.map((e) => e.textContent?.trim() ?? ""), this.#t.current, r), a = t.find((e) => e.textContent?.trim() === i);
		return a && b(this.#n)(a), a;
	}
	resetTypeahead() {
		this.#t.current = "";
	}
	get search() {
		return this.#t.current;
	}
}, q = [ie, " "], we = [
	ce,
	ae,
	le
], J = [
	oe,
	se,
	"End"
], Te = [...we, ...J];
[...q], [...q];
function Y(e) {
	return e.pointerType === "mouse";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/focus.js
function Ee(e, { select: t = !1 } = {}) {
	if (!e || !e.focus) return;
	let n = I(e);
	if (n.activeElement === e) return;
	let r = n.activeElement;
	e.focus({ preventScroll: !0 }), e !== r && R(e) && t && e.select();
}
function De(e, { select: t = !1 } = {}, n) {
	let r = n();
	for (let i of e) if (Ee(i, { select: t }), n() !== r) return !0;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/is-using-keyboard/is-using-keyboard.svelte.js
var X = C(!1), Oe = class e {
	static _refs = 0;
	static _cleanup;
	constructor() {
		_(() => (e._refs === 0 && (e._cleanup = x(() => {
			let e = [], t = (e) => {
				u(X, !1);
			};
			return e.push(p(document, "pointerdown", t, { capture: !0 }), p(document, "keydown", (e) => {
				u(X, !0);
			}, { capture: !0 })), _(() => {
				if (b(X)) return p(document, "pointermove", t, { capture: !0 });
			}), w(...e);
		})), e._refs++, () => {
			e._refs--, e._refs === 0 && (u(X, !1), e._cleanup?.());
		}));
	}
	get current() {
		return b(X);
	}
	set current(e) {
		u(X, e, !0);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/tabbable.js
function Z() {
	return {
		getShadowRoot: !0,
		displayCheck: typeof ResizeObserver == "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
	};
}
function ke(e, t) {
	if (!U(e, Z())) return Ae(e, t);
	let n = I(e), r = fe(n.body, Z());
	t === "prev" && r.reverse();
	let i = r.indexOf(e);
	return i === -1 ? n.body : r.slice(i + 1)[0];
}
function Ae(e, t) {
	let n = I(e);
	if (!de(e, Z())) return n.body;
	let r = pe(n.body, Z());
	t === "prev" && r.reverse();
	let i = r.indexOf(e);
	return i === -1 ? n.body : r.slice(i + 1).find((e) => U(e, Z())) ?? n.body;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/menu.svelte.js
var Q = new D("Menu.Root"), $ = new D("Menu.Root | Menu.Sub"), je = new D("Menu.Content");
new D("Menu.Group | Menu.RadioGroup"), new D("Menu.RadioGroup"), new D("Menu.CheckboxGroup");
var Me = new ve("bitsmenuopen", {
	bubbles: !1,
	cancelable: !0
}), Ne = P({
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
		this.#e = e, k([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (this.#_(), !e || !t || !n) return;
			let r = (e) => {
				Y(e) && (this.#s = {
					x: e.clientX,
					y: e.clientY
				}, this.#r || this.#d(e, "content"));
			}, i = (e) => {
				Y(e) && this.#f(e, "content");
			}, a = (e) => {
				Y(e) && (this.#r || this.#d(e, "trigger"));
			}, o = (e) => {
				if (Y(e)) {
					if (z(e.relatedTarget)) {
						let n = this.#e.subContentSelector(), r = e.relatedTarget.closest(n);
						if (r && r !== t && r.id && t.querySelector(`[aria-controls="${r.id}"]`)) return;
					}
					this.#f(e, "trigger");
				}
			}, s = (e) => {
				Y(e) && this.#m();
			}, c = (e) => {
				Y(e) && this.#m();
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
		if (z(i) && (t === "content" && r.contains(i) || t === "trigger" && n.contains(i))) return;
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
		if (!this.#r || !this.#i || !Y(e)) return;
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
		let e = I(this.#e.triggerNode() ?? this.#e.contentNode());
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
		return Q.set(n);
	}
	opts;
	isUsingKeyboard = new Oe();
	#e = C(!1);
	get ignoreCloseAutoFocus() {
		return b(this.#e);
	}
	set ignoreCloseAutoFocus(e) {
		u(this.#e, e, !0);
	}
	#t = C(!1);
	get isPointerInTransit() {
		return b(this.#t);
	}
	set isPointerInTransit(e) {
		u(this.#t, e, !0);
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
	#e = C(O(() => ""));
	get contentId() {
		return b(this.#e);
	}
	set contentId(e) {
		u(this.#e, e);
	}
	#t = C(null);
	get contentNode() {
		return b(this.#t);
	}
	set contentNode(e) {
		u(this.#t, e, !0);
	}
	contentPresence;
	#n = C(null);
	get triggerNode() {
		return b(this.#n);
	}
	set triggerNode(e) {
		u(this.#n, e, !0);
	}
	constructor(e, t, n) {
		this.opts = e, this.root = t, this.parentMenu = n, this.contentPresence = new ue({
			ref: O(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
			shouldSkipExitAnimation: () => this.root.opts.variant.current !== "menubar" || this.parentMenu !== null ? !1 : this.root.opts.shouldSkipExitAnimation?.() ?? !1
		}), n && k(() => n.opts.open.current, () => {
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
	#e = C("");
	get search() {
		return b(this.#e);
	}
	set search(e) {
		u(this.#e, e, !0);
	}
	#t = 0;
	#n;
	#r = C(!1);
	get mounted() {
		return b(this.#r);
	}
	set mounted(e) {
		u(this.#r, e, !0);
	}
	pressedItem = null;
	#i;
	constructor(e, t) {
		this.opts = e, this.parentMenu = t, this.domContext = new E(e.ref), this.attachment = j(this.opts.ref, (e) => {
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
		}), this.#n = new Ce({
			getActiveElement: () => this.domContext.getActiveElement(),
			getWindow: () => this.domContext.getWindow()
		}).handleTypeaheadSearch, this.rovingFocusGroup = new ne({
			rootNode: O(() => this.parentMenu.contentNode),
			candidateAttr: this.parentMenu.root.getBitsAttr("item"),
			loop: this.opts.loop,
			orientation: O(() => "vertical")
		}), k(() => this.parentMenu.contentNode, (e) => e ? Me.listen(e, () => {
			V(() => {
				this.parentMenu.root.isUsingKeyboard.current && this.rovingFocusGroup.focusFirstCandidate();
			});
		}) : void 0), _(() => {
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
		if (!z(n)) return;
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
		this.opts.onCloseAutoFocus.current?.(e), !(e.defaultPrevented || this.#i) && (this.parentMenu.root.ignoreCloseAutoFocus ? e.preventDefault() : this.parentMenu.triggerNode && U(this.parentMenu.triggerNode) && (e.preventDefault(), this.parentMenu.triggerNode.focus()));
	};
	handleTabKeyDown(e) {
		let t = this.parentMenu;
		for (; t.parentMenu !== null;) t = t.parentMenu;
		if (!t.triggerNode) return;
		e.preventDefault();
		let n = ke(t.triggerNode, e.shiftKey ? "prev" : "next");
		n ? (this.parentMenu.root.ignoreCloseAutoFocus = !0, t.onClose(), V(() => {
			n.focus(), V(() => {
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
		if (!L(t) || !L(n)) return;
		let r = t.closest(`[${this.parentMenu.root.getBitsAttr("content")}]`)?.id === this.parentMenu.contentId.current, i = e.ctrlKey || e.altKey || e.metaKey, a = e.key.length === 1;
		if (this.rovingFocusGroup.handleKeydown(t, e) || e.code === "Space") return;
		let o = this.#a();
		r && !i && a && this.#n(e.key, o), e.target?.id === this.parentMenu.contentId.current && Te.includes(e.key) && (e.preventDefault(), J.includes(e.key) && o.reverse(), De(o, { select: !1 }, () => this.domContext.getActiveElement()));
	}
	onblur(e) {
		z(e.currentTarget) && z(e.target) && (e.currentTarget.contains?.(e.target) || (this.domContext.getWindow().clearTimeout(this.#t), this.search = ""));
	}
	onfocus(e) {
		this.parentMenu.root.isUsingKeyboard.current && V(() => this.rovingFocusGroup.focusFirstCandidate());
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
		e.target.id === t || e.target.closest(`#${t}`) ? e.preventDefault() : (this.parentMenu.root.ignoreCloseAutoFocus = !0, V(() => {
			this.parentMenu.root.ignoreCloseAutoFocus = !1;
		}));
	}
	clearPressedItem = () => {
		this.pressedItem = null;
	};
	get shouldRender() {
		return this.parentMenu.contentPresence.shouldRender;
	}
	#c = c(() => ({ open: this.parentMenu.opts.open.current }));
	get snippetProps() {
		return b(this.#c);
	}
	set snippetProps(e) {
		u(this.#c, e);
	}
	#l = c(() => ({
		id: this.opts.id.current,
		role: "menu",
		"aria-orientation": "vertical",
		[this.parentMenu.root.getBitsAttr("content")]: "",
		"data-state": T(this.parentMenu.opts.open.current),
		...te(this.parentMenu.contentPresence.transitionStatus),
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
		return b(this.#l);
	}
	set props(e) {
		u(this.#l, e);
	}
	popperProps = { onCloseAutoFocus: (e) => this.onCloseAutoFocus(e) };
}, Ge = class {
	opts;
	content;
	attachment;
	#e = C(!1);
	constructor(e, t) {
		this.opts = e, this.content = t, this.attachment = j(this.opts.ref), this.onpointermove = this.onpointermove.bind(this), this.onpointerleave = this.onpointerleave.bind(this), this.onfocus = this.onfocus.bind(this), this.onblur = this.onblur.bind(this);
	}
	onpointermove(e) {
		if (!e.defaultPrevented && Y(e)) {
			if (this.opts.disabled.current) this.content.onItemLeave(e);
			else {
				if (this.content.onItemEnter()) return;
				let t = e.currentTarget;
				if (!L(t)) return;
				t.focus({ preventScroll: !0 });
			}
		}
	}
	onpointerleave(e) {
		e.defaultPrevented || Y(e) && this.content.onItemLeave(e);
	}
	onfocus(e) {
		V(() => {
			e.defaultPrevented || this.opts.disabled.current || u(this.#e, !0);
		});
	}
	onblur(e) {
		V(() => {
			e.defaultPrevented || u(this.#e, !1);
		});
	}
	#t = c(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "menuitem",
		"aria-disabled": M(this.opts.disabled.current),
		"data-disabled": F(this.opts.disabled.current),
		"data-highlighted": b(this.#e) ? "" : void 0,
		[this.content.parentMenu.root.getBitsAttr("item")]: "",
		onpointermove: this.onpointermove,
		onpointerleave: this.onpointerleave,
		onfocus: this.onfocus,
		onblur: this.onblur,
		...this.attachment
	}));
	get props() {
		return b(this.#t);
	}
	set props(e) {
		u(this.#t, e);
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
		if (!(this.item.opts.disabled.current || t && e.key === " ") && q.includes(e.key)) {
			if (!L(e.currentTarget)) return;
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
		L(r) && r.click();
	}
	onpointerdown(e) {
		this.item.content.pressedItem = {
			item: this,
			x: e.clientX,
			y: e.clientY
		};
	}
	#t = c(() => A(this.item.props, {
		onclick: this.onclick,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		onkeydown: this.onkeydown
	}));
	get props() {
		return b(this.#t);
	}
	set props(e) {
		u(this.#t, e);
	}
}, qe = class e {
	static create(t) {
		return new e(t, Q.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = j(this.opts.ref);
	}
	#e = c(() => ({
		id: this.opts.id.current,
		role: "separator",
		[this.root.getBitsAttr("separator")]: "",
		...this.attachment
	}));
	get props() {
		return b(this.#e);
	}
	set props(e) {
		u(this.#e, e);
	}
}, Je = class e {
	static create(t) {
		return new e(t, $.get());
	}
	opts;
	parentMenu;
	attachment;
	constructor(e, t) {
		this.opts = e, this.parentMenu = t, this.attachment = j(this.opts.ref, (e) => this.parentMenu.triggerNode = e);
	}
	onclick = (e) => {
		this.opts.disabled.current || e.detail !== 0 || (this.parentMenu.toggleOpen(), e.preventDefault());
	};
	onpointerdown = (e) => {
		if (!(this.opts.disabled.current || N(this.opts.ref.current))) {
			if (e.pointerType === "touch") return e.preventDefault();
			e.button === 0 && e.ctrlKey === !1 && (this.parentMenu.toggleOpen(), this.parentMenu.opts.open.current || e.preventDefault());
		}
	};
	onpointerup = (e) => {
		this.opts.disabled.current || N(this.opts.ref.current) || e.pointerType === "touch" && (e.preventDefault(), this.parentMenu.toggleOpen());
	};
	onkeydown = (e) => {
		this.opts.disabled.current || (e.key === " " || e.key === "Enter" ? (this.parentMenu.toggleOpen(), e.preventDefault()) : e.key === "ArrowDown" && (this.parentMenu.onOpen(), e.preventDefault()));
	};
	#e = c(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current) return this.parentMenu.contentId.current;
	});
	#t = c(() => ({
		id: this.opts.id.current,
		disabled: this.opts.disabled.current,
		"aria-haspopup": "menu",
		"aria-expanded": M(this.parentMenu.opts.open.current),
		"aria-controls": b(this.#e),
		"data-disabled": F(this.opts.disabled.current),
		"data-state": T(this.parentMenu.opts.open.current),
		[this.parentMenu.root.getBitsAttr("trigger")]: "",
		onclick: this.onclick,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return b(this.#t);
	}
	set props(e) {
		u(this.#t, e);
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
]), Xe = v("<div><!></div>");
function Ze(u, d) {
	let p = l();
	t(d, !0);
	let h = y(d, "ref", 15, null), _ = y(d, "id", 19, () => B(p)), v = y(d, "disabled", 3, !1), x = y(d, "onSelect", 3, H), C = y(d, "closeOnSelect", 3, !0), w = g(d, Ye), T = Ke.create({
		id: O(() => _()),
		disabled: O(() => v()),
		onSelect: O(() => x()),
		ref: O(() => h(), (e) => h(e)),
		closeOnSelect: O(() => C())
	}), E = c(() => A(w, T.props));
	var D = a(), k = m(D), j = (e) => {
		var t = a(), n = m(t);
		r(n, () => d.child, () => ({ props: b(E) })), i(e, t);
	}, M = (e) => {
		var t = Xe();
		S(t, () => ({ ...b(E) }));
		var n = f(t);
		r(n, () => d.children ?? s), o(t), i(e, t);
	};
	e(k, (e) => {
		d.child ? e(j) : e(M, -1);
	}), i(u, D), n();
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
]), $e = v("<div><!></div>");
function et(u, d) {
	let p = l();
	t(d, !0);
	let h = y(d, "ref", 15, null), _ = y(d, "id", 19, () => B(p)), v = g(d, Qe), x = qe.create({
		id: O(() => _()),
		ref: O(() => h(), (e) => h(e))
	}), C = c(() => A(v, x.props));
	var w = a(), T = m(w), E = (e) => {
		var t = a(), n = m(t);
		r(n, () => d.child, () => ({ props: b(C) })), i(e, t);
	}, D = (e) => {
		var t = $e();
		S(t, () => ({ ...b(C) }));
		var n = f(t);
		r(n, () => d.children ?? s), o(t), i(e, t);
	};
	e(T, (e) => {
		d.child ? e(E) : e(D, -1);
	}), i(u, w), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/components/menu.svelte
function tt(e, o) {
	t(o, !0);
	let c = y(o, "open", 15, !1), l = y(o, "dir", 3, "ltr"), u = y(o, "onOpenChange", 3, H), d = y(o, "onOpenChangeComplete", 3, H), f = y(o, "_internal_variant", 3, "dropdown-menu"), p = y(o, "_internal_should_skip_exit_animation", 3, void 0), h = He.create({
		variant: O(() => f()),
		dir: O(() => l()),
		onClose: () => {
			c(!1), u()(!1);
		},
		shouldSkipExitAnimation: () => p()?.() ?? !1
	});
	Ue.create({
		open: O(() => c(), (e) => {
			c(e), u()(e);
		}),
		onOpenChangeComplete: O(() => d())
	}, h), ge(e, {
		children: (e, t) => {
			var n = a(), c = m(n);
			r(c, () => o.children ?? s), i(e, n);
		},
		$$slots: { default: !0 }
	}), n();
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
]), rt = v("<div><div><!></div></div>");
function it(u, p) {
	let h = l();
	t(p, !0);
	let _ = y(p, "id", 19, () => B(h)), v = y(p, "ref", 15, null), x = y(p, "loop", 3, !0), C = y(p, "onInteractOutside", 3, H), w = y(p, "onEscapeKeydown", 3, H), T = y(p, "onCloseAutoFocus", 3, H), E = y(p, "forceMount", 3, !1), D = y(p, "trapFocus", 3, !1), k = g(p, nt), j = We.create({
		id: O(() => _()),
		loop: O(() => x()),
		ref: O(() => v(), (e) => v(e)),
		onCloseAutoFocus: O(() => T())
	}), M = c(() => A(k, j.props));
	function N(e) {
		if (j.handleInteractOutside(e), !e.defaultPrevented && (C()(e), !e.defaultPrevented)) {
			if (e.target && e.target instanceof Element) {
				let t = `[${j.parentMenu.root.getBitsAttr("sub-content")}]`;
				if (e.target.closest(t)) return;
			}
			j.parentMenu.onClose();
		}
	}
	function P(e) {
		w()(e), !e.defaultPrevented && j.parentMenu.onClose();
	}
	var F = a(), I = m(F), L = (t) => {
		he(t, d(() => b(M), () => j.popperProps, {
			get ref() {
				return j.opts.ref;
			},
			get enabled() {
				return j.parentMenu.opts.open.current;
			},
			onInteractOutside: N,
			onEscapeKeydown: P,
			get trapFocus() {
				return D();
			},
			get loop() {
				return x();
			},
			forceMount: !0,
			get id() {
				return _();
			},
			get shouldRender() {
				return j.shouldRender;
			},
			popper: (t, n) => {
				let l = () => (n?.()).props, u = () => (n?.()).wrapperProps, d = c(() => A(l(), { style: W("dropdown-menu") }, { style: p.style }));
				var h = a(), g = m(h), _ = (e) => {
					var t = a(), n = m(t);
					{
						let e = c(() => ({
							props: b(d),
							wrapperProps: u(),
							...j.snippetProps
						}));
						r(n, () => p.child, () => b(e));
					}
					i(e, t);
				}, v = (e) => {
					var t = rt();
					S(t, () => ({ ...u() }));
					var n = f(t);
					S(n, () => ({ ...b(d) }));
					var a = f(n);
					r(a, () => p.children ?? s), o(n), o(t), i(e, t);
				};
				e(g, (e) => {
					p.child ? e(_) : e(v, -1);
				}), i(t, h);
			},
			$$slots: { popper: !0 }
		}));
	}, R = (t) => {
		_e(t, d(() => b(M), () => j.popperProps, {
			get ref() {
				return j.opts.ref;
			},
			get open() {
				return j.parentMenu.opts.open.current;
			},
			onInteractOutside: N,
			onEscapeKeydown: P,
			get trapFocus() {
				return D();
			},
			get loop() {
				return x();
			},
			forceMount: !1,
			get id() {
				return _();
			},
			get shouldRender() {
				return j.shouldRender;
			},
			popper: (t, n) => {
				let l = () => (n?.()).props, u = () => (n?.()).wrapperProps, d = c(() => A(l(), { style: W("dropdown-menu") }, { style: p.style }));
				var h = a(), g = m(h), _ = (e) => {
					var t = a(), n = m(t);
					{
						let e = c(() => ({
							props: b(d),
							wrapperProps: u(),
							...j.snippetProps
						}));
						r(n, () => p.child, () => b(e));
					}
					i(e, t);
				}, v = (e) => {
					var t = rt();
					S(t, () => ({ ...u() }));
					var n = f(t);
					S(n, () => ({ ...b(d) }));
					var a = f(n);
					r(a, () => p.children ?? s), o(n), o(t), i(e, t);
				};
				e(g, (e) => {
					p.child ? e(_) : e(v, -1);
				}), i(t, h);
			},
			$$slots: { popper: !0 }
		}));
	};
	e(I, (e) => {
		E() ? e(L) : E() || e(R, 1);
	}), i(u, F), n();
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
]), ot = v("<button><!></button>");
function st(u, d) {
	let p = l();
	t(d, !0);
	let h = y(d, "id", 19, () => B(p)), _ = y(d, "ref", 15, null), v = y(d, "disabled", 3, !1), x = y(d, "type", 3, "button"), C = g(d, at), w = Je.create({
		id: O(() => h()),
		disabled: O(() => v() ?? !1),
		ref: O(() => _(), (e) => _(e))
	}), T = c(() => A(C, w.props, { type: x() }));
	me(u, {
		get id() {
			return h();
		},
		get ref() {
			return w.opts.ref;
		},
		children: (t, n) => {
			var c = a(), l = m(c), u = (e) => {
				var t = a(), n = m(t);
				r(n, () => d.child, () => ({ props: b(T) })), i(e, t);
			}, p = (e) => {
				var t = ot();
				S(t, () => ({ ...b(T) }));
				var n = f(t);
				r(n, () => d.children ?? s), o(t), i(e, t);
			};
			e(l, (e) => {
				d.child ? e(u) : e(p, -1);
			}), i(t, c);
		},
		$$slots: { default: !0 }
	}), n();
}
export { Ze as a, et as i, it as n, ye as o, tt as r, be as s, st as t };
