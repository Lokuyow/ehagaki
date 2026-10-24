import { At as e, B as t, C as n, Ct as r, F as i, G as a, J as o, K as s, M as c, N as l, R as u, T as d, U as f, W as p, Y as m, Z as h, a as g, at as _, ct as v, dt as y, et as b, ft as x, g as S, gt as C, i as w, it as T, jt as E, k as D, kt as O, lt as k, mt as A, nt as j, o as M, ot as N, q as P, r as F, s as I, t as L, tt as R, ut as z, v as B, w as V, wt as H, yt as U } from "./index-client-Bdka-Daw.js";
import { n as W } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { i as G, l as K, n as q } from "./relayConfigUtils-DD5f1UAM.js";
import { a as J, i as ee, l as te, o as ne, t as re } from "./postHistoryEventUtils-CUIBkIiy.js";
import { A as ie, B as ae, E as oe, F as se, K as Y, M as ce, O as le, Q as ue, R as de, V as fe, W as pe, X as me, d as he, et as ge, f as _e, j as ve, k as ye, m as be, nt as xe, o as Se, pt as Ce, q as we, s as Te, st as X, u as Ee, w as De, x as Oe, y as ke, z as Ae } from "./LoadingPlaceholder-j1_vRYno.js";
import { i as je, n as Me, t as Ne, u as Pe, v as Fe } from "./signedEventResultValidator-BsR3Zf_8.js";
import { r as Ie } from "./authStore.svelte-CoGdd5_Z.js";
import { f as Le, h as Re, m as ze, p as Be, s as Ve } from "./relayStore.svelte-BIc4bQdy.js";
import { c as He, l as Ue, nt as We, u as Ge } from "./appUtils-Bsk0mFqn.js";
import { c as Ke, n as qe } from "./nip46Service-Dm-_k9SF.js";
import { t as Je } from "./rx-nostr-BHeS362x.js";
import { n as Ye } from "./postEventBuilder-D_jeb3kI.js";
import { A as Xe, D as Ze, E as Qe, J as $e, K as et, M as tt, N as nt, T as rt, X as it, _ as at, a as ot, c as st, ct, g as lt, i as ut, j as Z, k as dt, n as ft, nt as pt, o as mt, q as ht, s as gt, v as _t } from "./nip65RelayDirectory-BZVsYwqc.js";
import { C as vt, D as yt, F as bt, G as xt, H as St, I as Ct, J as wt, O as Tt, Q as Et, R as Dt, S as Ot, T as kt, X as At, Y as jt, Z as Mt, i as Nt, k as Pt, q as Ft, w as It, x as Q } from "./sensitiveContentPayloadReader-BBXhV5Qm.js";
import { c as Lt } from "./legacyImportMarkers-CZ4J2IrE.js";
import { t as Rt } from "./roving-focus-group-DIgmMOCR.js";
import { c as zt, l as Bt, s as Vt, u as Ht, y as Ut } from "./useDialogHistory.svelte-C49eZejL.js";
import { a as Wt, i as Gt, n as Kt, o as qt, r as Jt } from "./safe-polygon.svelte-lFWsjvSm.js";
import { t as Yt } from "./DialogWrapper-C4-jPsAO.js";
import { t as Xt } from "./dialog-close-DgGAhT4f.js";
import { i as Zt, n as Qt, r as $t, t as en } from "./tabs-trigger-CTsCGK_5.js";
import { c as tn, d as nn, t as rn } from "./customEmoji-Bvbh2sQz.js";
import { q as an, tt as on } from "./App-BVcniO1E.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/events.js
var sn = class {
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
		return h(e, this.eventName, (e) => {
			t(e);
		}, n);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/arrays.js
function cn(e, t) {
	if (t <= 0) return [];
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function ln(e, t) {
	return e >= 0 && e < t.length;
}
function un(e, t, n) {
	let r = t.toLowerCase();
	if (r.endsWith(" ")) {
		let i = r.slice(0, -1);
		if (e.filter((e) => e.toLowerCase().startsWith(i)).length <= 1) return un(e, i, n);
		let a = n?.toLowerCase();
		if (a && a.startsWith(i) && a.charAt(i.length) === " " && t.trim() === i) return n;
		let o = e.filter((e) => e.toLowerCase().startsWith(r));
		if (o.length > 0) {
			let t = n ? e.indexOf(n) : -1;
			return dn(o, Math.max(t, 0)).find((e) => e !== n) || n;
		}
	}
	let i = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, a = i.toLowerCase(), o = n ? e.indexOf(n) : -1, s = dn(e, Math.max(o, 0));
	i.length === 1 && (s = s.filter((e) => e !== n));
	let c = s.find((e) => e?.toLowerCase().startsWith(a));
	return c === n ? void 0 : c;
}
function dn(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/box-auto-reset.svelte.js
var fn = {
	afterMs: 1e4,
	onChange: Te
};
function pn(e, t) {
	let { afterMs: n, onChange: r, getWindow: i } = {
		...fn,
		...t
	}, a = null, o = C(x(e));
	function s() {
		return i().setTimeout(() => {
			A(o, e, !0), r?.(e);
		}, n);
	}
	return N(() => () => {
		a && i().clearTimeout(a);
	}), X(() => b(o), (e) => {
		A(o, e, !0), r?.(e), a && i().clearTimeout(a), a = s();
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/dom-typeahead.svelte.js
var mn = class {
	#e;
	#t;
	#n = U(() => this.#e.onMatch ? this.#e.onMatch : (e) => e.focus());
	#r = U(() => this.#e.getCurrentItem ? this.#e.getCurrentItem : this.#e.getActiveElement);
	constructor(e) {
		this.#e = e, this.#t = pn("", {
			afterMs: 1e3,
			getWindow: e.getWindow
		}), this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this), this.resetTypeahead = this.resetTypeahead.bind(this);
	}
	handleTypeaheadSearch(e, t) {
		if (!t.length) return;
		this.#t.current = this.#t.current + e;
		let n = b(this.#r)(), r = t.find((e) => e === n)?.textContent?.trim() ?? "", i = un(t.map((e) => e.textContent?.trim() ?? ""), this.#t.current, r), a = t.find((e) => e.textContent?.trim() === i);
		return a && b(this.#n)(a), a;
	}
	resetTypeahead() {
		this.#t.current = "";
	}
	get search() {
		return this.#t.current;
	}
}, hn = [oe, " "], gn = [
	Oe,
	ie,
	le
], _n = [
	De,
	ye,
	"End"
], vn = [...gn, ..._n];
[...hn], [...hn];
function $(e) {
	return e.pointerType === "mouse";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/focus.js
function yn(e, { select: t = !1 } = {}) {
	if (!e || !e.focus) return;
	let n = pe(e);
	if (n.activeElement === e) return;
	let r = n.activeElement;
	e.focus({ preventScroll: !0 }), e !== r && ke(e) && t && e.select();
}
function bn(e, { select: t = !1 } = {}, n) {
	let r = n();
	for (let i of e) if (yn(i, { select: t }), n() !== r) return !0;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/is-using-keyboard/is-using-keyboard.svelte.js
var xn = C(!1), Sn = class e {
	static _refs = 0;
	static _cleanup;
	constructor() {
		N(() => (e._refs === 0 && (e._cleanup = T(() => {
			let e = [], t = (e) => {
				A(xn, !1);
			};
			return e.push(h(document, "pointerdown", t, { capture: !0 }), h(document, "keydown", (e) => {
				A(xn, !0);
			}, { capture: !0 })), N(() => {
				if (b(xn)) return h(document, "pointermove", t, { capture: !0 });
			}), xe(...e);
		})), e._refs++, () => {
			e._refs--, e._refs === 0 && (A(xn, !1), e._cleanup?.());
		}));
	}
	get current() {
		return b(xn);
	}
	set current(e) {
		A(xn, e, !0);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/tabbable.js
function Cn() {
	return {
		getShadowRoot: !0,
		displayCheck: typeof ResizeObserver == "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
	};
}
function wn(e, t) {
	if (!Bt(e, Cn())) return Tn(e, t);
	let n = pe(e), r = Ht(n.body, Cn());
	t === "prev" && r.reverse();
	let i = r.indexOf(e);
	return i === -1 ? n.body : r.slice(i + 1)[0];
}
function Tn(e, t) {
	let n = pe(e);
	if (!zt(e, Cn())) return n.body;
	let r = Vt(n.body, Cn());
	t === "prev" && r.reverse();
	let i = r.indexOf(e);
	return i === -1 ? n.body : r.slice(i + 1).find((e) => Bt(e, Cn())) ?? n.body;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/menu.svelte.js
var En = new ue("Menu.Root"), Dn = new ue("Menu.Root | Menu.Sub"), On = new ue("Menu.Content");
new ue("Menu.Group | Menu.RadioGroup"), new ue("Menu.RadioGroup"), new ue("Menu.CheckboxGroup");
var kn = new sn("bitsmenuopen", {
	bubbles: !1,
	cancelable: !0
}), An = se({
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
}), jn = class {
	#e;
	#t = null;
	#n = null;
	#r = !1;
	#i = null;
	#a = null;
	#o = null;
	#s = null;
	constructor(e) {
		this.#e = e, me([
			e.triggerNode,
			e.contentNode,
			e.enabled
		], ([e, t, n]) => {
			if (this.#_(), !e || !t || !n) return;
			let r = (e) => {
				$(e) && (this.#s = {
					x: e.clientX,
					y: e.clientY
				}, this.#r || this.#d(e, "content"));
			}, i = (e) => {
				$(e) && this.#f(e, "content");
			}, a = (e) => {
				$(e) && (this.#r || this.#d(e, "trigger"));
			}, o = (e) => {
				if ($(e)) {
					if (he(e.relatedTarget)) {
						let n = this.#e.subContentSelector(), r = e.relatedTarget.closest(n);
						if (r && r !== t && r.id && t.querySelector(`[aria-controls="${r.id}"]`)) return;
					}
					this.#f(e, "trigger");
				}
			}, s = (e) => {
				$(e) && this.#m();
			}, c = (e) => {
				$(e) && this.#m();
			};
			return e.addEventListener("pointermove", r), e.addEventListener("pointerleave", i), e.addEventListener("pointerenter", s), t.addEventListener("pointermove", a), t.addEventListener("pointerleave", o), t.addEventListener("pointerenter", c), () => {
				e.removeEventListener("pointermove", r), e.removeEventListener("pointerleave", i), e.removeEventListener("pointerenter", s), t.removeEventListener("pointermove", a), t.removeEventListener("pointerleave", o), t.removeEventListener("pointerenter", c), this.#_();
			};
		}), we(() => {
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
		let i = n.getBoundingClientRect(), a = r.getBoundingClientRect(), o = Fn(i, a), s, c, l;
		return t === "content" ? (s = this.#r ? this.#a ?? e : e, c = a) : (s = this.#s ?? e, c = this.#c() ?? i, l = a), this.#a = s, {
			corridor: In(i, a, o),
			intent: Ln(s, c, o, t, l),
			targetRect: c,
			side: o
		};
	}
	#u(e, t, n) {
		return Mn(e, t) || Mn(e, n);
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
		if (he(i) && (t === "content" && r.contains(i) || t === "trigger" && n.contains(i))) return;
		let a = {
			x: e.clientX,
			y: e.clientY
		}, o = this.#l(a, t);
		o && (!Nn(a, o.targetRect) && !this.#u(a, o.corridor, o.intent) ? this.#w() : (this.#r = !0, this.#i = t, this.#o = a, this.#e.setIsPointerInTransit(!0), this.#b(), this.#S()));
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
		if (!this.#r || !this.#i || !$(e)) return;
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
		if (this.#i === "content" && Nn(r, a) || this.#i === "trigger" && Pn(r, i, 4)) {
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
		let e = pe(this.#e.triggerNode() ?? this.#e.contentNode());
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
function Mn(e, t) {
	let { x: n, y: r } = e, i = !1;
	for (let e = 0, a = t.length - 1; e < t.length; a = e++) {
		let o = t[e].x, s = t[e].y, c = t[a].x, l = t[a].y;
		s > r != l > r && n < (c - o) * (r - s) / (l - s) + o && (i = !i);
	}
	return i;
}
function Nn(e, t) {
	return e.x >= t.left && e.x <= t.right && e.y >= t.top && e.y <= t.bottom;
}
function Pn(e, t, n) {
	return e.x >= t.left + n && e.x <= t.right - n && e.y >= t.top + n && e.y <= t.bottom - n;
}
function Fn(e, t) {
	let n = e.left + e.width / 2, r = e.top + e.height / 2, i = t.left + t.width / 2, a = t.top + t.height / 2, o = i - n, s = a - r;
	return Math.abs(o) > Math.abs(s) ? o > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function In(e, t, n) {
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
function Ln(e, t, n, r, i) {
	let a = r === "trigger" ? Rn(n) : n, o = i ? Math.min(t.top, i.top) - 8 : t.top - 8, s = i ? Math.max(t.bottom, i.bottom) + 8 : t.bottom + 8, c = i ? Math.min(t.left, i.left) - 8 : t.left - 8, l = i ? Math.max(t.right, i.right) + 8 : t.right + 8;
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
function Rn(e) {
	switch (e) {
		case "top": return "bottom";
		case "bottom": return "top";
		case "left": return "right";
		case "right": return "left";
	}
}
var zn = class e {
	static create(t) {
		let n = new e(t);
		return En.set(n);
	}
	opts;
	isUsingKeyboard = new Sn();
	#e = C(!1);
	get ignoreCloseAutoFocus() {
		return b(this.#e);
	}
	set ignoreCloseAutoFocus(e) {
		A(this.#e, e, !0);
	}
	#t = C(!1);
	get isPointerInTransit() {
		return b(this.#t);
	}
	set isPointerInTransit(e) {
		A(this.#t, e, !0);
	}
	constructor(e) {
		this.opts = e;
	}
	getBitsAttr = (e) => An.getAttr(e, this.opts.variant.current);
}, Bn = class e {
	static create(t, n) {
		return Dn.set(new e(t, n, null));
	}
	opts;
	root;
	parentMenu;
	#e = C(X(() => ""));
	get contentId() {
		return b(this.#e);
	}
	set contentId(e) {
		A(this.#e, e);
	}
	#t = C(null);
	get contentNode() {
		return b(this.#t);
	}
	set contentNode(e) {
		A(this.#t, e, !0);
	}
	contentPresence;
	#n = C(null);
	get triggerNode() {
		return b(this.#n);
	}
	set triggerNode(e) {
		A(this.#n, e, !0);
	}
	constructor(e, t, n) {
		this.opts = e, this.root = t, this.parentMenu = n, this.contentPresence = new Ut({
			ref: X(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
			shouldSkipExitAnimation: () => this.root.opts.variant.current !== "menubar" || this.parentMenu !== null ? !1 : this.root.opts.shouldSkipExitAnimation?.() ?? !1
		}), n && me(() => n.opts.open.current, () => {
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
}, Vn = class e {
	static create(t) {
		return On.set(new e(t, Dn.get()));
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
		A(this.#e, e, !0);
	}
	#t = 0;
	#n;
	#r = C(!1);
	get mounted() {
		return b(this.#r);
	}
	set mounted(e) {
		A(this.#r, e, !0);
	}
	pressedItem = null;
	#i;
	constructor(e, t) {
		this.opts = e, this.parentMenu = t, this.domContext = new fe(e.ref), this.attachment = ae(this.opts.ref, (e) => {
			this.parentMenu.contentNode !== e && (this.parentMenu.contentNode = e);
		}), t.contentId = e.id, this.#i = e.isSub ?? !1, this.onkeydown = this.onkeydown.bind(this), this.onblur = this.onblur.bind(this), this.onfocus = this.onfocus.bind(this), this.handleInteractOutside = this.handleInteractOutside.bind(this), new jn({
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
		}), this.#n = new mn({
			getActiveElement: () => this.domContext.getActiveElement(),
			getWindow: () => this.domContext.getWindow()
		}).handleTypeaheadSearch, this.rovingFocusGroup = new Rt({
			rootNode: X(() => this.parentMenu.contentNode),
			candidateAttr: this.parentMenu.root.getBitsAttr("item"),
			loop: this.opts.loop,
			orientation: X(() => "vertical")
		}), me(() => this.parentMenu.contentNode, (e) => e ? kn.listen(e, () => {
			Y(() => {
				this.parentMenu.root.isUsingKeyboard.current && this.rovingFocusGroup.focusFirstCandidate();
			});
		}) : void 0), N(() => {
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
		if (!he(n)) return;
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
		this.opts.onCloseAutoFocus.current?.(e), !(e.defaultPrevented || this.#i) && (this.parentMenu.root.ignoreCloseAutoFocus ? e.preventDefault() : this.parentMenu.triggerNode && Bt(this.parentMenu.triggerNode) && (e.preventDefault(), this.parentMenu.triggerNode.focus()));
	};
	handleTabKeyDown(e) {
		let t = this.parentMenu;
		for (; t.parentMenu !== null;) t = t.parentMenu;
		if (!t.triggerNode) return;
		e.preventDefault();
		let n = wn(t.triggerNode, e.shiftKey ? "prev" : "next");
		n ? (this.parentMenu.root.ignoreCloseAutoFocus = !0, t.onClose(), Y(() => {
			n.focus(), Y(() => {
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
		if (!be(t) || !be(n)) return;
		let r = t.closest(`[${this.parentMenu.root.getBitsAttr("content")}]`)?.id === this.parentMenu.contentId.current, i = e.ctrlKey || e.altKey || e.metaKey, a = e.key.length === 1;
		if (this.rovingFocusGroup.handleKeydown(t, e) || e.code === "Space") return;
		let o = this.#a();
		r && !i && a && this.#n(e.key, o), e.target?.id === this.parentMenu.contentId.current && vn.includes(e.key) && (e.preventDefault(), _n.includes(e.key) && o.reverse(), bn(o, { select: !1 }, () => this.domContext.getActiveElement()));
	}
	onblur(e) {
		he(e.currentTarget) && he(e.target) && (e.currentTarget.contains?.(e.target) || (this.domContext.getWindow().clearTimeout(this.#t), this.search = ""));
	}
	onfocus(e) {
		this.parentMenu.root.isUsingKeyboard.current && Y(() => this.rovingFocusGroup.focusFirstCandidate());
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
		if (!_e(e.target)) return;
		let t = this.parentMenu.triggerNode?.id;
		e.target.id === t || e.target.closest(`#${t}`) ? e.preventDefault() : (this.parentMenu.root.ignoreCloseAutoFocus = !0, Y(() => {
			this.parentMenu.root.ignoreCloseAutoFocus = !1;
		}));
	}
	clearPressedItem = () => {
		this.pressedItem = null;
	};
	get shouldRender() {
		return this.parentMenu.contentPresence.shouldRender;
	}
	#c = U(() => ({ open: this.parentMenu.opts.open.current }));
	get snippetProps() {
		return b(this.#c);
	}
	set snippetProps(e) {
		A(this.#c, e);
	}
	#l = U(() => ({
		id: this.opts.id.current,
		role: "menu",
		"aria-orientation": "vertical",
		[this.parentMenu.root.getBitsAttr("content")]: "",
		"data-state": de(this.parentMenu.opts.open.current),
		...Ae(this.parentMenu.contentPresence.transitionStatus),
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
		A(this.#l, e);
	}
	popperProps = { onCloseAutoFocus: (e) => this.onCloseAutoFocus(e) };
}, Hn = class {
	opts;
	content;
	attachment;
	#e = C(!1);
	constructor(e, t) {
		this.opts = e, this.content = t, this.attachment = ae(this.opts.ref), this.onpointermove = this.onpointermove.bind(this), this.onpointerleave = this.onpointerleave.bind(this), this.onfocus = this.onfocus.bind(this), this.onblur = this.onblur.bind(this);
	}
	onpointermove(e) {
		if (!e.defaultPrevented && $(e)) {
			if (this.opts.disabled.current) this.content.onItemLeave(e);
			else {
				if (this.content.onItemEnter()) return;
				let t = e.currentTarget;
				if (!be(t)) return;
				t.focus({ preventScroll: !0 });
			}
		}
	}
	onpointerleave(e) {
		e.defaultPrevented || $(e) && this.content.onItemLeave(e);
	}
	onfocus(e) {
		Y(() => {
			e.defaultPrevented || this.opts.disabled.current || A(this.#e, !0);
		});
	}
	onblur(e) {
		Y(() => {
			e.defaultPrevented || A(this.#e, !1);
		});
	}
	#t = U(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "menuitem",
		"aria-disabled": ce(this.opts.disabled.current),
		"data-disabled": ve(this.opts.disabled.current),
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
		A(this.#t, e);
	}
}, Un = class e {
	static create(t) {
		let n = new Hn(t, On.get());
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
		if (!(this.item.opts.disabled.current || t && e.key === " ") && hn.includes(e.key)) {
			if (!be(e.currentTarget)) return;
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
		be(r) && r.click();
	}
	onpointerdown(e) {
		this.item.content.pressedItem = {
			item: this,
			x: e.clientX,
			y: e.clientY
		};
	}
	#t = U(() => ge(this.item.props, {
		onclick: this.onclick,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		onkeydown: this.onkeydown
	}));
	get props() {
		return b(this.#t);
	}
	set props(e) {
		A(this.#t, e);
	}
}, Wn = class e {
	static create(t) {
		return new e(t, En.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = ae(this.opts.ref);
	}
	#e = U(() => ({
		id: this.opts.id.current,
		role: "separator",
		[this.root.getBitsAttr("separator")]: "",
		...this.attachment
	}));
	get props() {
		return b(this.#e);
	}
	set props(e) {
		A(this.#e, e);
	}
}, Gn = class e {
	static create(t) {
		return new e(t, Dn.get());
	}
	opts;
	parentMenu;
	attachment;
	constructor(e, t) {
		this.opts = e, this.parentMenu = t, this.attachment = ae(this.opts.ref, (e) => this.parentMenu.triggerNode = e);
	}
	onclick = (e) => {
		this.opts.disabled.current || e.detail !== 0 || (this.parentMenu.toggleOpen(), e.preventDefault());
	};
	onpointerdown = (e) => {
		if (!(this.opts.disabled.current || Ee(this.opts.ref.current))) {
			if (e.pointerType === "touch") return e.preventDefault();
			e.button === 0 && e.ctrlKey === !1 && (this.parentMenu.toggleOpen(), this.parentMenu.opts.open.current || e.preventDefault());
		}
	};
	onpointerup = (e) => {
		this.opts.disabled.current || Ee(this.opts.ref.current) || e.pointerType === "touch" && (e.preventDefault(), this.parentMenu.toggleOpen());
	};
	onkeydown = (e) => {
		this.opts.disabled.current || (e.key === " " || e.key === "Enter" ? (this.parentMenu.toggleOpen(), e.preventDefault()) : e.key === "ArrowDown" && (this.parentMenu.onOpen(), e.preventDefault()));
	};
	#e = U(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current) return this.parentMenu.contentId.current;
	});
	#t = U(() => ({
		id: this.opts.id.current,
		disabled: this.opts.disabled.current,
		"aria-haspopup": "menu",
		"aria-expanded": ce(this.parentMenu.opts.open.current),
		"aria-controls": b(this.#e),
		"data-disabled": ve(this.opts.disabled.current),
		"data-state": de(this.parentMenu.opts.open.current),
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
		A(this.#t, e);
	}
}, Kn = /* @__PURE__ */ new Set([
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
]), qn = a("<div><!></div>");
function Jn(t, n) {
	let i = s();
	H(n, !0);
	let a = F(n, "ref", 15, null), o = F(n, "id", 19, () => Se(i)), c = F(n, "disabled", 3, !1), d = F(n, "onSelect", 3, Te), m = F(n, "closeOnSelect", 3, !0), h = w(n, Kn), g = Un.create({
		id: X(() => o()),
		disabled: X(() => c()),
		onSelect: X(() => d()),
		ref: X(() => a(), (e) => a(e)),
		closeOnSelect: X(() => m())
	}), _ = U(() => ge(h, g.props));
	var y = p(), x = k(y), C = (e) => {
		var t = p(), r = k(t);
		l(r, () => n.child, () => ({ props: b(_) })), f(e, t);
	}, T = (t) => {
		var r = qn();
		S(r, () => ({ ...b(_) }));
		var i = v(r);
		l(i, () => n.children ?? E), e(r), f(t, r);
	};
	u(x, (e) => {
		n.child ? e(C) : e(T, -1);
	}), f(t, y), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/components/menu-separator.svelte
var Yn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"child",
	"children"
]), Xn = a("<div><!></div>");
function Zn(t, n) {
	let i = s();
	H(n, !0);
	let a = F(n, "ref", 15, null), o = F(n, "id", 19, () => Se(i)), c = w(n, Yn), d = Wn.create({
		id: X(() => o()),
		ref: X(() => a(), (e) => a(e))
	}), m = U(() => ge(c, d.props));
	var h = p(), g = k(h), _ = (e) => {
		var t = p(), r = k(t);
		l(r, () => n.child, () => ({ props: b(m) })), f(e, t);
	}, y = (t) => {
		var r = Xn();
		S(r, () => ({ ...b(m) }));
		var i = v(r);
		l(i, () => n.children ?? E), e(r), f(t, r);
	};
	u(g, (e) => {
		n.child ? e(_) : e(y, -1);
	}), f(t, h), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/components/menu.svelte
function Qn(e, t) {
	H(t, !0);
	let n = F(t, "open", 15, !1), i = F(t, "dir", 3, "ltr"), a = F(t, "onOpenChange", 3, Te), o = F(t, "onOpenChangeComplete", 3, Te), s = F(t, "_internal_variant", 3, "dropdown-menu"), c = F(t, "_internal_should_skip_exit_animation", 3, void 0), u = zn.create({
		variant: X(() => s()),
		dir: X(() => i()),
		onClose: () => {
			n(!1), a()(!1);
		},
		shouldSkipExitAnimation: () => c()?.() ?? !1
	});
	Bn.create({
		open: X(() => n(), (e) => {
			n(e), a()(e);
		}),
		onOpenChangeComplete: X(() => o())
	}, u), qt(e, {
		children: (e, n) => {
			var r = p(), i = k(r);
			l(i, () => t.children ?? E), f(e, r);
		},
		$$slots: { default: !0 }
	}), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/dropdown-menu/components/dropdown-menu-content.svelte
var $n = /* @__PURE__ */ new Set([
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
]), er = a("<div><div><!></div></div>");
function tr(t, n) {
	let i = s();
	H(n, !0);
	let a = F(n, "id", 19, () => Se(i)), o = F(n, "ref", 15, null), c = F(n, "loop", 3, !0), d = F(n, "onInteractOutside", 3, Te), m = F(n, "onEscapeKeydown", 3, Te), h = F(n, "onCloseAutoFocus", 3, Te), _ = F(n, "forceMount", 3, !1), y = F(n, "trapFocus", 3, !1), x = w(n, $n), C = Vn.create({
		id: X(() => a()),
		loop: X(() => c()),
		ref: X(() => o(), (e) => o(e)),
		onCloseAutoFocus: X(() => h())
	}), T = U(() => ge(x, C.props));
	function D(e) {
		if (C.handleInteractOutside(e), !e.defaultPrevented && (d()(e), !e.defaultPrevented)) {
			if (e.target && e.target instanceof Element) {
				let t = `[${C.parentMenu.root.getBitsAttr("sub-content")}]`;
				if (e.target.closest(t)) return;
			}
			C.parentMenu.onClose();
		}
	}
	function O(e) {
		m()(e), !e.defaultPrevented && C.parentMenu.onClose();
	}
	var A = p(), j = k(A), M = (t) => {
		Kt(t, g(() => b(T), () => C.popperProps, {
			get ref() {
				return C.opts.ref;
			},
			get enabled() {
				return C.parentMenu.opts.open.current;
			},
			onInteractOutside: D,
			onEscapeKeydown: O,
			get trapFocus() {
				return y();
			},
			get loop() {
				return c();
			},
			forceMount: !0,
			get id() {
				return a();
			},
			get shouldRender() {
				return C.shouldRender;
			},
			popper: (t, r) => {
				let i = () => (r?.()).props, a = () => (r?.()).wrapperProps, o = U(() => ge(i(), { style: Wt("dropdown-menu") }, { style: n.style }));
				var s = p(), c = k(s), d = (e) => {
					var t = p(), r = k(t);
					{
						let e = U(() => ({
							props: b(o),
							wrapperProps: a(),
							...C.snippetProps
						}));
						l(r, () => n.child, () => b(e));
					}
					f(e, t);
				}, m = (t) => {
					var r = er();
					S(r, () => ({ ...a() }));
					var i = v(r);
					S(i, () => ({ ...b(o) }));
					var s = v(i);
					l(s, () => n.children ?? E), e(i), e(r), f(t, r);
				};
				u(c, (e) => {
					n.child ? e(d) : e(m, -1);
				}), f(t, s);
			},
			$$slots: { popper: !0 }
		}));
	}, N = (t) => {
		Jt(t, g(() => b(T), () => C.popperProps, {
			get ref() {
				return C.opts.ref;
			},
			get open() {
				return C.parentMenu.opts.open.current;
			},
			onInteractOutside: D,
			onEscapeKeydown: O,
			get trapFocus() {
				return y();
			},
			get loop() {
				return c();
			},
			forceMount: !1,
			get id() {
				return a();
			},
			get shouldRender() {
				return C.shouldRender;
			},
			popper: (t, r) => {
				let i = () => (r?.()).props, a = () => (r?.()).wrapperProps, o = U(() => ge(i(), { style: Wt("dropdown-menu") }, { style: n.style }));
				var s = p(), c = k(s), d = (e) => {
					var t = p(), r = k(t);
					{
						let e = U(() => ({
							props: b(o),
							wrapperProps: a(),
							...C.snippetProps
						}));
						l(r, () => n.child, () => b(e));
					}
					f(e, t);
				}, m = (t) => {
					var r = er();
					S(r, () => ({ ...a() }));
					var i = v(r);
					S(i, () => ({ ...b(o) }));
					var s = v(i);
					l(s, () => n.children ?? E), e(i), e(r), f(t, r);
				};
				u(c, (e) => {
					n.child ? e(d) : e(m, -1);
				}), f(t, s);
			},
			$$slots: { popper: !0 }
		}));
	};
	u(j, (e) => {
		_() ? e(M) : _() || e(N, 1);
	}), f(t, A), r();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/menu/components/menu-trigger.svelte
var nr = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"disabled",
	"type"
]), rr = a("<button><!></button>");
function ir(t, n) {
	let i = s();
	H(n, !0);
	let a = F(n, "id", 19, () => Se(i)), o = F(n, "ref", 15, null), c = F(n, "disabled", 3, !1), d = F(n, "type", 3, "button"), m = w(n, nr), h = Gn.create({
		id: X(() => a()),
		disabled: X(() => c() ?? !1),
		ref: X(() => o(), (e) => o(e))
	}), g = U(() => ge(m, h.props, { type: d() }));
	Gt(t, {
		get id() {
			return a();
		},
		get ref() {
			return h.opts.ref;
		},
		children: (t, r) => {
			var i = p(), a = k(i), o = (e) => {
				var t = p(), r = k(t);
				l(r, () => n.child, () => ({ props: b(g) })), f(e, t);
			}, s = (t) => {
				var r = rr();
				S(r, () => ({ ...b(g) }));
				var i = v(r);
				l(i, () => n.children ?? E), e(r), f(t, r);
			};
			u(a, (e) => {
				n.child ? e(o) : e(s, -1);
			}), f(t, i);
		},
		$$slots: { default: !0 }
	}), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPreviewFooter.svelte
var ar = a("<div><div class=\"post-preview-footer-left svelte-r1d5vb\"><span class=\"post-preview-date svelte-r1d5vb\"> </span> <!></div> <div class=\"post-preview-footer-actions svelte-r1d5vb\"><!></div> <div class=\"post-preview-footer-right svelte-r1d5vb\"><!></div></div>"), or = {
	hash: "svelte-r1d5vb",
	code: ".post-preview-footer.svelte-r1d5vb {display:grid;grid-template-columns:minmax(0, 120px) minmax(144px, 1fr) 36px;align-items:stretch;height:36px;--post-history-preview-action-icon-size: 20px;color:var(--btn-post-preview-action);--post-history-preview-footer-surface: var(--dialog-bg);}.post-preview-footer-regular.svelte-r1d5vb {padding-inline-start:1rem;}\n\n    /* React and the count share one cell. Reserve their intrinsic width before shrinking the date. */.post-preview-footer:has(.reaction-compose-button) {grid-template-columns:minmax(0, 120px) minmax(min-content, 1fr) 36px;}.post-preview-action-buttons-group:has(.reaction-compose-button) {grid-template-columns:minmax(72px, 1fr) minmax(36px, 1fr) minmax(72px, 1fr);}.post-preview-footer-compact.svelte-r1d5vb {padding-inline-start:1rem;--post-history-preview-footer-surface: var(\n            --post-history-related-card-bg,\n            var(--dialog-bg)\n        );}.post-preview-footer.is-dimmed.svelte-r1d5vb {opacity:0.65;}.post-preview-footer-left.svelte-r1d5vb,\n    .post-preview-footer-actions.svelte-r1d5vb,\n    .post-preview-footer-right.svelte-r1d5vb {display:flex;align-items:stretch;}.post-preview-footer-left.svelte-r1d5vb {align-items:center;justify-content:flex-start;min-width:0;}.post-preview-footer-actions.svelte-r1d5vb {justify-content:stretch;min-width:0;}.post-preview-footer-right.svelte-r1d5vb {align-items:center;justify-content:flex-end;min-width:0;}.post-preview-date.svelte-r1d5vb {overflow:hidden;color:var(--text-muted);font-size:0.875rem;text-overflow:ellipsis;white-space:nowrap;}.post-preview-footer-regular.svelte-r1d5vb .post-preview-date:where(.svelte-r1d5vb) {font-size:0.9375rem;}.post-preview-footer-replies-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-reply-button-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;}.post-preview-footer-reaction-slot {display:flex;align-items:stretch;justify-content:center;flex:0 0 36px;min-width:36px;max-width:100%;}.post-history-action-button,\n    .post-preview-reactions-button {min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface);background-color:var(--post-history-preview-footer-surface);}.post-preview-action-buttons-group {display:grid;grid-template-columns:minmax(72px, 1fr) repeat(2, minmax(36px, 1fr));align-items:stretch;width:100%;min-width:0;}.post-preview-action-cell {display:flex;align-items:stretch;justify-content:center;min-width:0;}.post-preview-reply-action-cell {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-reaction-action-cell:has(.reaction-compose-button) {display:grid;grid-template-columns:36px 36px;justify-content:center;}.post-preview-quote-action-cell,\n    .post-preview-reaction-action-cell {justify-content:center;}.post-preview-reaction-action-cell .post-preview-footer-reaction-slot {max-width:100%;}.post-preview-action-button {position:relative;}.post-history-action-button {width:36px;min-width:36px;color:var(--btn-post-preview-action);}.post-history-action-button .svg-icon {--svg: currentColor;}.post-preview-footer :is(.reply-icon, .quote-icon, .reaction-compose-icon).svg-icon {width:var(--post-history-preview-action-icon-size);height:var(--post-history-preview-action-icon-size);}.post-preview-footer .reply-icon.svg-icon {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-preview-footer .quote-icon.svg-icon {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function sr(n, i) {
	H(i, !0), D(n, or);
	let a = F(i, "density", 3, "regular"), o = F(i, "dimmed", 3, !1), s = F(i, "leftExtras", 3, void 0), c = F(i, "actions", 3, void 0), u = F(i, "trailing", 3, void 0);
	var p = ar(), m = v(p), h = v(m), g = z(h, !0), b = y(h, 2);
	l(b, () => s() ?? E), e(m);
	var x = y(m, 2), S = v(x);
	l(S, () => c() ?? E), e(x);
	var C = y(x, 2), w = v(C);
	l(w, () => u() ?? E), e(C), e(p), _((e) => {
		V(p, 1, e, "svelte-r1d5vb"), t(g, i.formattedDate);
	}, [() => d(`post-preview-footer post-preview-footer-${a()} ${o() ? "is-dimmed" : ""}`.trim())]), f(n, p), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRelatedEventCard.svelte
var cr = a("<img class=\"post-history-related-avatar svelte-1g9bqtt\"/>"), lr = a("<span class=\"post-history-related-avatar-placeholder svelte-1g9bqtt\" aria-hidden=\"true\"></span>"), ur = a("<article class=\"post-history-related-card svelte-1g9bqtt\"><!> <div class=\"post-history-related-card-body svelte-1g9bqtt\"><div class=\"post-history-related-author svelte-1g9bqtt\"><!> <span class=\"post-history-related-author-name svelte-1g9bqtt\"> </span></div> <!> <!> <!></div></article>"), dr = {
	hash: "svelte-1g9bqtt",
	code: ".post-history-related-card.svelte-1g9bqtt {display:grid;margin-inline-start:-2px;--post-history-related-card-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--border-hr) 24%\n        );border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:var(--post-history-related-card-bg);color:var(--text);font-size:0.9rem;}.post-history-related-card-body.svelte-1g9bqtt {display:grid;grid-template-columns:minmax(0, 1fr);min-width:0;gap:2px;padding:2px 10px 0 8px;}.post-history-related-card .post-preview-footer {margin-inline:-8px -10px;}.post-history-related-author.svelte-1g9bqtt {display:flex;align-items:center;min-width:0;gap:8px;}.post-history-related-avatar.svelte-1g9bqtt,\n    .post-history-related-avatar-placeholder.svelte-1g9bqtt {width:24px;height:24px;flex:0 0 auto;border-radius:50%;background:var(--border-hr);object-fit:cover;}.post-history-related-avatar-placeholder.svelte-1g9bqtt {display:inline-block;mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);background-color:var(--text-muted);}.post-history-related-author-name.svelte-1g9bqtt {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}.post-history-related-card .post-history-related-content {margin:0;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45;}"
};
function fr(n, i) {
	H(i, !0), D(n, dr);
	let a = F(i, "profile", 3, null), o = F(i, "media", 3, void 0), s = F(i, "model", 3, void 0), c = F(i, "loadSensitiveBody", 3, void 0), d = F(i, "emojiLoadStateByUrl", 19, () => ({})), p = F(i, "emojiImageMetaByUrl", 19, () => ({})), m = F(i, "scrollRoot", 3, null), h = F(i, "onImageOpen", 3, void 0), g = F(i, "topActions", 3, void 0), x = F(i, "footerLeftExtras", 3, void 0), S = F(i, "footerActions", 3, void 0), C = F(i, "footerDetails", 3, void 0), w = F(i, "footerMenu", 3, void 0), T = U(() => a()?.displayName?.trim() || a()?.name?.trim() || an(K.npubEncode(i.event.pubkey), 12, 4)), O = U(() => s() ?? Ct({
		kind: i.event.kind,
		sourceContent: i.event.content,
		tags: i.event.tags,
		media: o()
	})), k = U(() => St(i.event.created_at * 1e3));
	var A = ur(), j = v(A);
	l(j, () => g() ?? E);
	var M = y(j, 2), N = v(M), P = v(N), I = (e) => {
		var t = cr();
		_(() => {
			B(t, "src", a().picture), B(t, "alt", b(T));
		}), f(e, t);
	}, L = (e) => {
		var t = lr();
		f(e, t);
	};
	u(P, (e) => {
		a()?.picture ? e(I) : e(L, -1);
	});
	var R = y(P, 2), V = z(R, !0);
	e(N);
	var W = y(N, 2);
	bt(W, {
		get model() {
			return b(O);
		},
		get loadSensitiveBody() {
			return c();
		},
		get contentWarningEventId() {
			return i.event.id;
		},
		density: "compact",
		contentClass: "post-history-related-content",
		get emojiLoadStateByUrl() {
			return d();
		},
		get emojiImageMetaByUrl() {
			return p();
		},
		get scrollRoot() {
			return m();
		},
		get onImageOpen() {
			return h();
		}
	});
	var G = y(W, 2);
	sr(G, {
		get formattedDate() {
			return b(k);
		},
		density: "compact",
		get leftExtras() {
			return x();
		},
		get actions() {
			return S();
		},
		get trailing() {
			return w();
		}
	});
	var q = y(G, 2);
	l(q, () => C() ?? E), e(M), e(A), _(() => t(V, b(T))), f(n, A), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewFooterActionButton.svelte
var pr = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"tooltipContent",
	"children",
	"onClick",
	"ariaLabel"
]), mr = a("<!> <!>", 1);
function hr(e, n) {
	H(n, !0);
	let i = F(n, "onClick", 3, void 0), a = F(n, "ariaLabel", 3, ""), o = w(n, pr), s = W().overlayTarget;
	var u = p(), d = k(u);
	c(d, () => Ft, (e, r) => {
		r(e, {
			children: (e, r) => {
				var u = p(), d = k(u);
				c(d, () => At, (e, r) => {
					r(e, {
						delayDuration: 500,
						children: (e, r) => {
							var u = mr(), d = k(u);
							{
								let e = (e, t) => {
									let r = () => (t?.()).props, s = U(() => {
										let { onclick: e, ...t } = r();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									He(e, g(() => o, () => b(s).restProps, {
										get ariaLabel() {
											return a();
										},
										onClick: (e) => {
											let t = i()?.(e);
											return typeof b(s).tooltipOnclick == "function" && b(s).tooltipOnclick(e), t;
										},
										children: (e, t) => {
											var r = p(), i = k(r);
											l(i, () => n.children ?? E), f(e, r);
										},
										$$slots: { default: !0 }
									}));
								};
								c(d, () => wt, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var m = y(d, 2);
							c(m, () => Ge, (e, r) => {
								r(e, {
									get to() {
										return s;
									},
									children: (e, r) => {
										var i = p(), a = k(i);
										c(a, () => jt, (e, r) => {
											r(e, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (e, r) => {
													O();
													var i = P();
													_(() => t(i, n.tooltipContent)), f(e, i);
												},
												$$slots: { default: !0 }
											});
										}), f(e, i);
									},
									$$slots: { default: !0 }
								});
							}), f(e, u);
						},
						$$slots: { default: !0 }
					});
				}), f(e, u);
			},
			$$slots: { default: !0 }
		});
	}), f(e, u), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostReactionActionButton.svelte
var gr = a("<div aria-hidden=\"true\"></div>"), _r = a("<span class=\"reaction-action-error svelte-kvh7jt\" role=\"alert\"> </span>"), vr = a("<!> <!>", 1), yr = {
	hash: "svelte-kvh7jt",
	code: ".reaction-compose-icon.svelte-kvh7jt {--svg: currentColor;mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.failed.svelte-kvh7jt {color:var(--danger);}.reaction-action-error.svelte-kvh7jt {position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);}"
};
function br(e, n) {
	H(n, !0), D(e, yr);
	let i = () => I(Ce, "$_", a), [a, o] = M(), s = C(!1), c = C(!1);
	async function l() {
		if (!b(s)) {
			A(s, !0), A(c, !1);
			try {
				A(c, await n.onReact() === !1);
			} catch {
				A(c, !0);
			} finally {
				A(s, !1);
			}
		}
	}
	var d = vr(), p = k(d);
	{
		let e = U(() => i()("reaction.action")), t = U(() => i()(b(c) ? "reaction.targetFailed" : "reaction.action"));
		hr(p, {
			type: "button",
			className: "post-history-action-button post-preview-action-button reaction-compose-button",
			get ariaLabel() {
				return b(e);
			},
			get tooltipContent() {
				return b(t);
			},
			shape: "circle",
			contentLayout: "icon",
			get disabled() {
				return b(s);
			},
			onClick: l,
			children: (e, t) => {
				var n = gr();
				let r;
				_(() => r = V(n, 1, "reaction-compose-icon svg-icon svelte-kvh7jt", null, r, { failed: b(c) })), f(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	var m = y(p, 2), h = (e) => {
		var n = _r(), r = z(n, !0);
		_((e) => t(r, e), [() => i()("reaction.targetFailed")]), f(e, n);
	};
	u(m, (e) => {
		b(c) && e(h);
	}), f(e, d), r(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryPostActions.svelte
var xr = a("<div class=\"reply-icon svg-icon\" aria-hidden=\"true\"></div>"), Sr = a("<div class=\"quote-icon svg-icon\" aria-hidden=\"true\"></div>"), Cr = a("<div class=\"post-preview-action-buttons-group\"><div class=\"post-preview-action-cell post-preview-reply-action-cell\"><div class=\"post-preview-reply-button-slot\"><!></div> <div class=\"post-preview-footer-replies-slot\"><!></div></div> <div class=\"post-preview-action-cell post-preview-quote-action-cell\"><!></div> <div class=\"post-preview-action-cell post-preview-reaction-action-cell\"><!> <div class=\"post-preview-footer-reaction-slot\"><!></div></div></div>");
function wr(t, n) {
	H(n, !0);
	let i = () => I(Ce, "$_", a), [a, o] = M(), s = F(n, "onReactionPost", 3, void 0), c = F(n, "onReplyPost", 3, void 0), d = F(n, "onQuotePost", 3, void 0), p = F(n, "replyExtras", 3, void 0), m = F(n, "reactionExtras", 3, void 0);
	var h = Cr(), g = v(h), _ = v(g), x = v(_), S = (e) => {
		{
			let t = U(() => i()("replyQuote.reply_label")), r = U(() => i()("replyQuote.reply_label"));
			hr(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return b(t);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => c()?.(n.post),
				get tooltipContent() {
					return b(r);
				},
				children: (e, t) => {
					var n = xr();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	u(x, (e) => {
		c() && e(S);
	}), e(_);
	var C = y(_, 2), w = v(C);
	l(w, () => p() ?? E), e(C), e(g);
	var T = y(g, 2), D = v(T), O = (e) => {
		{
			let t = U(() => i()("replyQuote.quote_label")), r = U(() => i()("replyQuote.quote_label"));
			hr(e, {
				type: "button",
				className: "post-preview-action-button post-history-action-button",
				get ariaLabel() {
					return b(t);
				},
				contentLayout: "icon",
				shape: "circle",
				onClick: () => d()?.(n.post),
				get tooltipContent() {
					return b(r);
				},
				children: (e, t) => {
					var n = Sr();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	u(D, (e) => {
		d() && e(O);
	}), e(T);
	var k = y(T, 2), A = v(k), j = (e) => {
		br(e, { onReact: () => s()(n.post) });
	}, N = U(() => s() && n.post.deletedAt === void 0 && ut(n.post.kind));
	u(A, (e) => {
		b(N) && e(j);
	});
	var P = y(A, 2), L = v(P);
	l(L, () => m() ?? E), e(P), e(k), e(h), f(t, h), r(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepostPreview.svelte
var Tr = a("<p> </p>"), Er = a("<div class=\"repost-target-label svelte-1l68xot\"> </div>"), Dr = a("<div class=\"repost-channel-row svelte-1l68xot\"><span> </span> <strong> </strong></div>"), Or = a("<!> <!>", 1), kr = a("<p role=\"status\"> </p> <!>", 1), Ar = a("<div class=\"post-history-repost svelte-1l68xot\"><div class=\"post-history-repost-label svelte-1l68xot\"><span class=\"post-history-repost-title svelte-1l68xot\"><!> <span class=\"post-history-repost-icon svg-icon svelte-1l68xot\" aria-hidden=\"true\"></span> <span> </span></span> <!></div> <!> <!></div>"), jr = {
	hash: "svelte-1l68xot",
	code: ".post-history-repost.svelte-1l68xot {min-width:0;}.repost-target-label.svelte-1l68xot {padding:4px 6px;color:var(--text-muted);}.repost-channel-row.svelte-1l68xot {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.post-history-repost-label.svelte-1l68xot {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.post-history-repost-title.svelte-1l68xot {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.post-history-repost-icon.svelte-1l68xot {--icon-size: 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-7265706f73742e737667);}.post-history-repost-label .post-history-menu-trigger {inline-size:28px;block-size:28px;min-inline-size:28px;min-block-size:28px;flex:0 0 28px;padding:0;}"
};
function Mr(n, i) {
	H(i, !0), D(n, jr);
	let a = () => I(Ce, "$_", o), [o, s] = M(), c = F(i, "channelText", 3, null), d = F(i, "targetLabel", 3, null), m = F(i, "scrollRoot", 3, null), h = F(i, "emojiLoadStateByUrl", 19, () => ({})), g = F(i, "emojiImageMetaByUrl", 19, () => ({})), x = U(() => i.preview.event ? dt(i.preview.event, i.preview.relayHints) : null), S = U(() => i.preview.status === "deleted" ? "repost.targetDeleted" : i.preview.status === "unsupported-target-kind" ? "repost.targetUnsupported" : i.preview.status === "unsupported-reference" ? "repost.referenceUnsupported" : i.preview.status === "invalid-reference" || i.preview.status === "invalid-target" || i.preview.status === "outer-target-kind-mismatch" ? "repost.targetInvalid" : i.preview.status === "loading" ? "repost.targetLoading" : "repost.targetMissing");
	var C = Ar(), w = v(C), T = v(w), A = v(T);
	l(A, () => i.author ?? E);
	var j = y(A, 4), N = z(j, !0);
	e(T);
	var L = y(T, 2);
	l(L, () => i.menu ?? E, () => i.post, () => `repost-outer:${i.post.eventId}`), e(w);
	var R = y(w, 2), V = (e) => {
		var n = Tr(), r = z(n, !0);
		_((e) => t(r, e), [() => a()("postHistory.deleted")]), f(e, n);
	}, W = (n) => {
		var r = Or(), o = k(r);
		fr(o, {
			get event() {
				return i.preview.event;
			},
			get profile() {
				return i.preview.profile;
			},
			get model() {
				return i.model;
			},
			get loadSensitiveBody() {
				return i.loadSensitiveBody;
			},
			get scrollRoot() {
				return m();
			},
			get onImageOpen() {
				return i.onImageOpen;
			},
			get emojiLoadStateByUrl() {
				return h();
			},
			get emojiImageMetaByUrl() {
				return g();
			},
			topActions: (n) => {
				var r = Or(), i = k(r), o = (e) => {
					var n = Er(), r = z(n, !0);
					_(() => t(r, d())), f(e, n);
				};
				u(i, (e) => {
					d() && e(o);
				});
				var s = y(i, 2), l = (n) => {
					var r = Dr(), i = v(r), o = z(i, !0), s = y(i, 2), l = z(s, !0);
					e(r), _((e) => {
						t(o, e), t(l, c());
					}, [() => a()("postHistory.channel")]), f(n, r);
				};
				u(s, (e) => {
					c() && e(l);
				}), f(n, r);
			},
			footerActions: (e) => {
				wr(e, {
					get post() {
						return b(x);
					},
					get onReplyPost() {
						return i.onReplyPost;
					},
					get onQuotePost() {
						return i.onQuotePost;
					},
					get onReactionPost() {
						return i.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = p(), n = k(t);
						l(n, () => i.reactionExtras ?? E, () => b(x)), f(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			},
			footerDetails: (e) => {
				var t = p(), n = k(t);
				l(n, () => i.reactionDetails ?? E, () => b(x)), f(e, t);
			},
			footerMenu: (e) => {
				var t = p(), n = k(t);
				l(n, () => i.menu ?? E, () => b(x), () => `repost-target:${i.post.eventId}:${b(x).eventId}`), f(e, t);
			},
			$$slots: {
				topActions: !0,
				footerActions: !0,
				footerDetails: !0,
				footerMenu: !0
			}
		});
		var s = y(o, 2), S = (e) => {
			var n = kr(), r = k(n), o = z(r, !0), s = y(r, 2);
			He(s, {
				get onClick() {
					return i.onRetry;
				},
				children: (e, n) => {
					O();
					var r = P();
					_((e) => t(r, e), [() => a()("repost.retrySave")]), f(e, r);
				},
				$$slots: { default: !0 }
			}), _((e) => t(o, e), [() => a()("repost.targetSaveFailed")]), f(e, n);
		};
		u(s, (e) => {
			"saveFailed" in i.preview && i.preview.saveFailed && e(S);
		}), f(n, r);
	}, G = (e) => {
		var n = kr(), r = k(n), o = z(r, !0), s = y(r, 2), c = (e) => {
			He(e, {
				get onClick() {
					return i.onRetry;
				},
				children: (e, n) => {
					O();
					var r = P();
					_((e) => t(r, e), [() => a()("postHistory.contextRetry")]), f(e, r);
				},
				$$slots: { default: !0 }
			});
		};
		u(s, (e) => {
			(i.preview.status === "not-found" || i.preview.status === "error" || i.preview.status === "invalid-target") && e(c);
		}), _((e) => t(o, e), [() => a()(b(S))]), f(e, n);
	};
	u(R, (e) => {
		i.post.deletedAt === void 0 ? i.preview.status === "resolved" && i.preview.event && b(x) ? e(W, 1) : e(G, -1) : e(V);
	});
	var K = y(R, 2), q = (e) => {
		var t = Or(), n = k(t);
		{
			let e = (e) => {
				wr(e, {
					get post() {
						return i.post;
					},
					get onReactionPost() {
						return i.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = p(), n = k(t);
						l(n, () => i.reactionExtras ?? E, () => i.post), f(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			}, t = U(() => St(i.post.postedAt));
			sr(n, {
				get formattedDate() {
					return b(t);
				},
				actions: e,
				$$slots: { actions: !0 }
			});
		}
		var r = y(n, 2);
		l(r, () => i.reactionDetails ?? E, () => i.post), f(e, t);
	};
	u(K, (e) => {
		i.post.deletedAt === void 0 && i.onReactionPost && e(q);
	}), e(C), _((e) => {
		B(C, "data-repost-event-id", i.post.eventId), t(N, e);
	}, [() => a()("repost.entry")]), f(n, C), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryChannelDisplay.svelte.ts
function Nr({ getShow: e, getSessionOpen: t = e, getPosts: n, getRxNostr: r, getRelayConfig: i, getIsSearchMode: a }) {
	let o = C(x({})), s = 0, c = [];
	function l() {
		c = [];
	}
	function u() {
		s++, c.forEach((e) => e.release()), l();
	}
	function d() {
		u(), A(o, {}, !0);
	}
	function f(e, t) {
		if (e.kind !== 42) return null;
		if (!e.channelEventId) return t("postHistory.channelUnknown");
		let n = b(o)[e.channelEventId];
		return !n || n.status === "loading" ? t("postHistory.channelLoading") : n.status === "resolved" && n.name ? n.name : t("postHistory.channelUnknown");
	}
	return N(() => {
		t() || j(d);
	}), N(() => {
		if (e()) return () => {
			u();
		};
	}), N(() => {
		if (!e()) {
			u();
			return;
		}
		u();
		let t = n().filter((e) => e.kind === 42);
		if (t.length === 0) return;
		let d = Array.from(new Set(t.map((e) => e.channelEventId).filter((e) => typeof e == "string")));
		if (d.length === 0) return;
		let f = ++s, p = a() ? void 0 : r(), m = d.map((e) => {
			let n = q.sanitizeExternalRelayUrls(t.filter((t) => t.channelEventId === e).flatMap((e) => Dt(e, null)), { limit: 8 });
			return kt.resolveInternal({
				eventId: e,
				relayHints: n
			}, p, i());
		});
		c = m, A(o, {
			...j(() => b(o)),
			...Object.fromEntries(d.map((e) => [e, {
				status: "loading",
				name: null
			}]))
		}, !0), Promise.all(m.map((e) => e.cacheReady)).then((t) => {
			e() && f === s && A(o, {
				...b(o),
				...Object.fromEntries(t.map((e) => [e.context.eventId, xt(e.cache, !!p)]))
			}, !0);
		}).catch((e) => {
			console.error("チャンネル表示のキャッシュ解決に失敗しました:", e);
		}), Promise.all(m.map((e) => e.refresh)).then((t) => {
			e() && f === s && (l(), A(o, {
				...b(o),
				...Object.fromEntries(t.map((e) => [e.snapshot.context.eventId, {
					status: e.snapshot.context.name ? "resolved" : "failed",
					name: e.snapshot.context.name
				}]))
			}, !0));
		}).catch((e) => {
			f === s && l(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", e);
		});
	}), L(() => {
		u();
	}), {
		getChannelText: f,
		cancelCurrentChannelResolution: u
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryThreadGraphUtils.ts
var Pr = 5, Fr = .5, Ir = 2.5;
function Lr(e, t) {
	return `${e}:${t}`;
}
function Rr(e) {
	return e < 0 ? Math.max(0, Pr + e) : e;
}
function zr(e) {
	return Math.min(Rr(e) * Fr, Ir);
}
function Br() {
	return {
		loadedParent: !1,
		visibleParent: !1,
		loadingParent: !1,
		parentError: null,
		parentMissing: !1,
		parentDeleted: !1,
		showParentLoadingIndicator: !1,
		revalidatingParent: !1,
		loadedChildren: !1,
		visibleChildren: !1,
		loadingChildren: !1,
		revalidatingChildren: !1,
		childrenError: null,
		lastFetchedParentAt: null,
		lastFetchedChildrenAt: null
	};
}
function Vr(e) {
	return ee(e.rawEvent, e) ? re(e.rawEvent) : {
		id: e.eventId,
		pubkey: e.pubkeyHex,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
}
function Hr(e) {
	let t = {
		id: e.eventId,
		pubkey: e.authorPubkey,
		kind: e.kind,
		content: e.content,
		tags: e.tags.map((e) => [...e]),
		created_at: e.createdAt,
		sig: ""
	};
	return ne(e.rawEvent) && e.rawEvent.id === t.id && e.rawEvent.pubkey === t.pubkey && e.rawEvent.kind === t.kind && e.rawEvent.content === t.content && e.rawEvent.created_at === t.created_at && JSON.stringify(e.rawEvent.tags) === JSON.stringify(t.tags) ? re(e.rawEvent) : t;
}
function Ur(e) {
	let t = te(e.event);
	return {
		eventId: e.event.id,
		event: re(e.event),
		authorPubkey: e.event.pubkey,
		rootEventId: t.rootId,
		parentEventId: t.parentId,
		profile: e.profile ?? null,
		relayUrls: [...e.relayUrls ?? []],
		sources: [...e.sources]
	};
}
function Wr(e, t) {
	if (!e) return t;
	let n = Array.from(/* @__PURE__ */ new Set([...e.relayUrls, ...t.relayUrls])).sort((e, t) => e.localeCompare(t)), r = Array.from(/* @__PURE__ */ new Set([...e.sources, ...t.sources]));
	return {
		...e,
		event: t.event,
		authorPubkey: t.authorPubkey,
		rootEventId: t.rootEventId,
		parentEventId: t.parentEventId,
		profile: t.profile ?? e.profile,
		relayUrls: n,
		sources: r
	};
}
function Gr(e, t) {
	return [...e].sort((e, n) => {
		let r = t[e]?.event, i = t[n]?.event;
		return !r || !i ? e.localeCompare(n) : r.created_at === i.created_at ? r.id.localeCompare(i.id) : r.created_at - i.created_at;
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryProfileSync.ts
function Kr(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function qr({ getShow: e, getRxNostr: t, profileCache: n = yt, logger: r = console }) {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = !1, s = (t, n) => {
		if (!o && !t.disposed && i.get(t.pubkey) === t && e() && n && t.lastProfile !== n) {
			t.lastProfile = n;
			for (let e of a) e(t.pubkey, n);
		}
	}, c = (a, l) => {
		if (!e() || a.pending || a.disposed || o) return;
		let u = a.relayHints;
		a.pending = n.getProfile(a.pubkey, {
			rxNostr: t(),
			additionalRelays: u,
			forceRefresh: l,
			allowBackgroundRefresh: !0,
			signal: a.abort.signal
		}).then((e) => {
			s(a, e);
		}).catch((e) => {
			a.abort.signal.aborted || r.error("投稿履歴プロフィールの取得に失敗:", e);
		}).finally(() => {
			i.get(a.pubkey) === a && (a.pending = null, a.refreshQueued && (a.refreshQueued = !1, c(a, !0)));
		});
	}, l = (t, r = []) => {
		if (!e() || !t || o) return null;
		let a = q.sanitizeExternalRelayUrls(r), l = i.get(t);
		if (l) {
			let e = q.mergeRelayConfigs(l.relayHints, a);
			return Kr(l.relayHints, e) || (l.relayHints = e, l.pending ? l.refreshQueued = !0 : c(l, !0)), l.lastProfile;
		}
		let u = {
			pubkey: t,
			relayHints: a,
			lastProfile: null,
			unsubscribe: () => void 0,
			pending: null,
			refreshQueued: !1,
			disposed: !1,
			abort: new AbortController()
		};
		return i.set(t, u), u.unsubscribe = n.subscribe(t, (e) => {
			s(u, e);
		}), c(u, !1), null;
	}, u = (e) => {
		if (o) return () => void 0;
		a.add(e);
		for (let t of i.values()) t.lastProfile && e(t.pubkey, t.lastProfile);
		return () => a.delete(e);
	}, d = () => {
		for (let e of i.values()) e.disposed = !0, e.abort.abort(), e.unsubscribe();
		i.clear();
	};
	return {
		ensureProfile: l,
		subscribe: u,
		reset: d,
		dispose: () => {
			o ||= (d(), a.clear(), !0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedTargetResolver.svelte.ts
var Jr = 8;
function Yr(e) {
	return q.sanitizeExternalRelayUrls(e, { limit: Jr });
}
function Xr(e, t) {
	return {
		id: e,
		pubkey: t,
		kind: 1,
		content: "",
		tags: [],
		created_at: 0,
		sig: ""
	};
}
function Zr(e) {
	return {
		targetEventId: e.targetEventId,
		status: "loading",
		event: null,
		profile: null,
		authorPubkey: e.authorHint ?? null,
		relayHints: Yr(e.relayHints ?? []),
		errorCode: null,
		updatedAt: null
	};
}
function Qr({ getShow: e, getRxNostr: t, getRelayConfig: n, postHistoryRepositoryImpl: r = st, contextFetchService: i = Tt, deletionRequestsRepositoryImpl: a = Et, deletionFetchService: o = Ot, profileSyncCoordinator: s = void 0, loadRepostTarget: c = void 0, requireFullVerification: l = !1 }) {
	let u = s ?? qr({
		getShow: e,
		getRxNostr: t
	}), d = !s, f = C({}), p = C(x({})), m = C(x({})), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), T = 0;
	function E(e) {
		A(p, {
			...b(p),
			[e]: (b(p)[e] ?? 0) + 1
		}, !0);
	}
	function D(e) {
		let t = g.get(e);
		if (t) for (let e of t) E(e);
	}
	function O(e, t) {
		let n = b(f)[e], r = t(n);
		return n && n.status === r.status && n.event === r.event && n.profile === r.profile && n.authorPubkey === r.authorPubkey && n.errorCode === r.errorCode && n.updatedAt === r.updatedAt && _t(n.relayHints, r.relayHints) ? n : (A(f, {
			...b(f),
			[e]: r
		}), D(e), r);
	}
	function k(e, t) {
		return O(e, (n) => {
			let r = n ?? Zr({
				targetEventId: e,
				relationKind: "related-target",
				scopeKey: ""
			});
			return {
				targetEventId: e,
				status: t.status ?? r.status,
				event: t.event === void 0 ? r.event : t.event,
				profile: t.profile === void 0 ? r.profile : t.profile,
				authorPubkey: t.authorPubkey === void 0 ? r.authorPubkey : t.authorPubkey,
				relayHints: t.relayHints ? Yr(t.relayHints) : r.relayHints,
				errorCode: t.errorCode === void 0 ? r.errorCode : t.errorCode,
				updatedAt: t.updatedAt === void 0 ? r.updatedAt : t.updatedAt
			};
		});
	}
	function j(e) {
		let t = b(f)[e.targetEventId], n = Yr([...t?.relayHints ?? [], ...e.relayHints ?? []]), r = t?.authorPubkey ?? e.authorHint ?? null, i = !t || t.authorPubkey !== r || !_t(t.relayHints, n);
		return k(e.targetEventId, {
			authorPubkey: r,
			relayHints: n
		}), i;
	}
	function M(e) {
		let t = h.get(e.scopeKey) ?? /* @__PURE__ */ new Set();
		t.add(e.targetEventId), h.set(e.scopeKey, t);
		let n = g.get(e.targetEventId) ?? /* @__PURE__ */ new Set();
		n.add(e.scopeKey), g.set(e.targetEventId, n), e.scopeKey in b(m) || A(m, {
			...b(m),
			[e.scopeKey]: 0
		}, !0), e.scopeKey in b(p) || A(p, {
			...b(p),
			[e.scopeKey]: 0
		}, !0);
	}
	async function N(e, t) {
		return (await a.getDeletedTargets([{
			targetAuthorPubkey: e,
			targetEventId: t
		}])).get(e)?.has(t) ?? !1;
	}
	function P(e, t) {
		if (e && t) for (let [n, r] of Object.entries(b(f))) r.authorPubkey === e && k(n, { profile: t });
	}
	function F(e, t) {
		P(e, u.ensureProfile(e, t));
	}
	u.subscribe((t, n) => {
		e() && P(t, n);
	});
	async function I(r, i, s = {}) {
		if (!r.pubkey || !r.id) return !1;
		let c = g.get(r.id), l = t(), u = () => e() && t() === l && c === g.get(r.id) && !!c?.size, d = await N(r.pubkey, r.id);
		if (!u()) return !1;
		if (d) return k(r.id, {
			status: "deleted",
			event: null,
			authorPubkey: r.pubkey,
			relayHints: i,
			errorCode: null,
			updatedAt: Date.now()
		}), !0;
		let f = t();
		if (!f) return !1;
		let p = `${r.pubkey}:${r.id}`, m = y.get(p) ?? Promise.resolve().then(async () => {
			try {
				if (!u()) return !1;
				let e = at(Lt, r.pubkey), t = o.fetchDeletionRequests(f, {
					targets: [{
						event: r,
						relayUrls: i
					}],
					relayHints: i,
					relayConfig: n()
				});
				S.set(p, t);
				let s = await t.promise;
				if (!u()) return !1;
				if (s.events.length > 0) {
					if (await a.upsertValidDeletionRequests({
						targetEvents: [r],
						deletionEvents: s.events,
						fetchedAt: s.fetchedAt
					}), !u()) return !1;
					Mt.archiveAdoptedAuthored([{ event: r }], {
						ownerPubkeyHex: r.pubkey,
						expectedRevision: await e,
						isActive: u
					});
				}
				let c = await N(r.pubkey, r.id);
				return u() ? (c && k(r.id, {
					status: "deleted",
					event: null,
					authorPubkey: r.pubkey,
					relayHints: i,
					errorCode: null,
					updatedAt: Date.now()
				}), c) : !1;
			} catch {
				return !1;
			} finally {
				y.get(p) === m && (S.delete(p), y.delete(p));
			}
		});
		return y.set(p, m), !s.background && await m;
	}
	function L(e, t) {
		return w.get(e) === t;
	}
	async function R(a, o = {}, s) {
		M(a);
		let u = b(f)[a.targetEventId], d = j(a), p = b(f)[a.targetEventId] ?? Zr(a), h = !!o.background && u?.status === "resolved";
		if (l && u?.status === "resolved" && !nt(u.event, {
			eventId: a.targetEventId,
			authorHint: null,
			relayHints: []
		}) && (o = {
			...o,
			force: !0
		}), (a.relationKind === "repost" || l) && u?.status === "resolved") {
			let t = pt(u.event)?.event;
			if (t?.id === a.targetEventId) {
				let n = b(m)[a.scopeKey], r = await N(t.pubkey, t.id);
				if (!e() || n !== b(m)[a.scopeKey] || !g.get(t.id)?.has(a.scopeKey)) return null;
				if (r) return k(t.id, {
					status: "deleted",
					event: null,
					authorPubkey: t.pubkey,
					errorCode: null,
					updatedAt: Date.now()
				});
			}
		}
		if (!o.force && u && (!o.requireRelayHint || u.relayHints.length > 0)) {
			if (u.status === "resolved" || u.status === "deleted") return a.relationKind === "repost" && u.status === "resolved" && !Z(u.event, {
				eventId: a.targetEventId,
				authorHint: null,
				relayHints: []
			}) ? await R(a, {
				...o,
				force: !0
			}, s) : (u.status === "resolved" && u.authorPubkey && F(u.authorPubkey, b(f)[a.targetEventId]?.relayHints ?? u.relayHints), b(f)[a.targetEventId] ?? u);
			if (u.status === "loading" && !s && _.has(a.targetEventId)) return await _.get(a.targetEventId) ?? b(f)[a.targetEventId] ?? u;
			if (!d && !s && (u.status === "not-found" || u.status === "error")) return b(f)[a.targetEventId] ?? u;
		}
		if (!o.force && !s && _.has(a.targetEventId)) return await _.get(a.targetEventId) ?? b(f)[a.targetEventId] ?? p;
		o.force && (v.get(a.targetEventId)?.cancel(), v.delete(a.targetEventId), _.delete(a.targetEventId));
		let y = ++T;
		w.set(a.targetEventId, y);
		let x = (async () => {
			try {
				h || k(a.targetEventId, {
					status: "loading",
					errorCode: null
				});
				let u = s ? {
					event: s.target,
					relayHints: p.relayHints
				} : a.relationKind === "repost" ? await c?.(a) : null;
				if (!L(a.targetEventId, y)) return null;
				let d = u && Z(u.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: a.relayHints ?? []
				});
				if (d && (!o.requireRelayHint || u.relayHints.length > 0)) {
					let e = Yr([...u.relayHints, ...p.relayHints]), t = k(a.targetEventId, {
						status: "resolved",
						event: d.event,
						authorPubkey: d.event.pubkey,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					return F(d.event.pubkey, e), s || I(d.event, e, { background: !0 }), t;
				}
				let m = await r.getByEventId(a.targetEventId);
				if (!L(a.targetEventId, y)) return b(f)[a.targetEventId] ?? null;
				let g = l && m ? nt(m.rawEvent, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (m && (!l || g) && (!o.requireRelayHint || [
					...m.relayHints,
					...m.acceptedRelays,
					...m.fetchedRelays ?? []
				].length > 0) && (a.relationKind !== "repost" || Z(m.rawEvent, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}))) {
					let e = Yr([
						...p.relayHints,
						...m.relayHints,
						...m.acceptedRelays,
						...m.fetchedRelays ?? []
					]);
					if (typeof m.deletedAt == "number") return k(a.targetEventId, {
						status: "deleted",
						event: null,
						authorPubkey: g?.event.pubkey ?? m.pubkeyHex,
						relayHints: e,
						errorCode: null,
						updatedAt: Date.now()
					});
					let t = g?.event ?? (a.relationKind === "repost" ? Z(m.rawEvent).event : Vr(m)), n = e, r = k(a.targetEventId, {
						status: "resolved",
						event: t,
						authorPubkey: t.pubkey,
						relayHints: n,
						errorCode: null,
						updatedAt: Date.now()
					});
					return F(t.pubkey, n), s || I(t, n, { background: !0 }), b(f)[a.targetEventId] ?? r;
				}
				if (!l && a.authorHint && a.relationKind !== "repost") {
					let e = await I(Xr(a.targetEventId, a.authorHint), p.relayHints);
					if (!L(a.targetEventId, y) || e) return b(f)[a.targetEventId] ?? null;
				}
				let _ = t();
				if (!_ || !e()) return h ? b(f)[a.targetEventId] ?? p : k(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: p.authorPubkey,
					relayHints: p.relayHints,
					errorCode: "nostr_not_ready",
					updatedAt: Date.now()
				});
				let x = (s ? v.get(a.targetEventId) : void 0) ?? i.fetchEventById(_, {
					eventId: a.targetEventId,
					authorHint: a.authorHint,
					relayHints: p.relayHints,
					relayConfig: n()
				});
				v.set(a.targetEventId, x);
				let S = await x.promise;
				if (!L(a.targetEventId, y)) return b(f)[a.targetEventId] ?? null;
				if (v.delete(a.targetEventId), !S.event) {
					if (!l && a.authorHint && a.relationKind !== "repost") {
						let e = await I(Xr(a.targetEventId, a.authorHint), p.relayHints);
						if (!L(a.targetEventId, y) || e) return b(f)[a.targetEventId] ?? null;
					}
					return h ? b(f)[a.targetEventId] ?? p : k(a.targetEventId, {
						status: "not-found",
						event: null,
						authorPubkey: p.authorPubkey,
						relayHints: p.relayHints,
						errorCode: null,
						updatedAt: Date.now()
					});
				}
				let C = Yr([...S.relayUrl ? [S.relayUrl] : [], ...p.relayHints]), w = l ? nt(S.event, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				}) : null;
				if (l && !w) return k(a.targetEventId, {
					status: "error",
					event: null,
					errorCode: "invalid_event",
					updatedAt: Date.now()
				});
				let T = w?.event ?? S.event;
				if (a.relationKind === "repost" && !Z(T, {
					eventId: a.targetEventId,
					authorHint: null,
					relayHints: []
				})) throw Error("invalid_repost_target");
				let E = C, D = !s && await I(T, E);
				if (!L(a.targetEventId, y)) return b(f)[a.targetEventId] ?? null;
				if (D) return T.id !== a.targetEventId && k(a.targetEventId, {
					status: "deleted",
					event: null,
					authorPubkey: T.pubkey,
					relayHints: E,
					errorCode: null,
					updatedAt: Date.now()
				}), b(f)[a.targetEventId] ?? null;
				let O = k(a.targetEventId, {
					status: "resolved",
					event: T,
					authorPubkey: T.pubkey,
					relayHints: E,
					errorCode: null,
					updatedAt: Date.now()
				});
				return F(T.pubkey, E), b(f)[a.targetEventId] ?? O;
			} catch {
				return L(a.targetEventId, y) ? h ? b(f)[a.targetEventId] ?? p : k(a.targetEventId, {
					status: "error",
					event: null,
					authorPubkey: p.authorPubkey,
					relayHints: p.relayHints,
					errorCode: "fetch_failed",
					updatedAt: Date.now()
				}) : b(f)[a.targetEventId] ?? null;
			} finally {
				L(a.targetEventId, y) && (v.delete(a.targetEventId), _.delete(a.targetEventId));
			}
		})();
		return _.set(a.targetEventId, x), await x;
	}
	async function z(e, t = {}) {
		return R(e, t);
	}
	async function B(n, r) {
		let i = Z(r, {
			eventId: n.targetEventId,
			authorHint: n.authorHint ?? null,
			relayHints: n.relayHints ?? []
		});
		if (n.relationKind !== "repost" || !i || !Ze(i.event.kind) || !e() || !t()) return null;
		M(n);
		let a = g.get(n.targetEventId), o = b(m)[n.scopeKey], s = t(), c = () => e() && t() === s && a === g.get(n.targetEventId) && a?.has(n.scopeKey) && o === b(m)[n.scopeKey], l = await R(n, { requireRelayHint: !0 }, { target: i.event });
		if (!c() || l?.status !== "resolved" || !Z(l.event, {
			eventId: i.event.id,
			authorHint: i.event.pubkey,
			relayHints: []
		})) return null;
		let u = await N(i.event.pubkey, i.event.id);
		return c() ? u ? k(i.event.id, {
			status: "deleted",
			event: null,
			authorPubkey: i.event.pubkey,
			errorCode: null,
			updatedAt: Date.now()
		}) : l : null;
	}
	async function V(e, t = {}) {
		return await Promise.all(e.map((e) => z(e, t)));
	}
	async function H(e, t = {}) {
		return await z(e, {
			...t,
			force: !0
		});
	}
	function U(e) {
		return b(f)[e] ?? null;
	}
	function W(e) {
		return b(p)[e] ?? 0;
	}
	function G(e) {
		let t = h.get(e);
		if (t) for (let n of t) {
			let t = g.get(n);
			if (t && (t.delete(e), !(t.size > 0))) {
				g.delete(n), w.delete(n), v.get(n)?.cancel(), v.delete(n);
				for (let [e, t] of S) e.endsWith(`:${n}`) && (t.cancel(), S.delete(e), y.delete(e));
				_.delete(n);
			}
		}
		h.delete(e), A(m, {
			...b(m),
			[e]: (b(m)[e] ?? 0) + 1
		}, !0), E(e);
	}
	function K() {
		v.forEach((e) => e.cancel()), S.forEach((e) => e.cancel()), v.clear(), S.clear(), _.clear(), y.clear(), h.clear(), g.clear(), d && u.reset(), w.clear(), A(f, {}), A(p, {}, !0), A(m, {}, !0);
	}
	return {
		ensureTarget: z,
		prepareRepostTarget: B,
		ensureTargets: V,
		retryTarget: H,
		getTargetSnapshot: U,
		getScopeRevision: W,
		invalidateScope: G,
		reset: K
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRepostPreviews.svelte.ts
var $r = 0;
async function ei(e) {
	if (!e.sourceEventId) return null;
	let t = await st.getByEventId(e.sourceEventId), n = t && rt(t), r = t?.repostTarget ?? (t && n ? (await Lt.postHistory.where("pubkeyHex").equals(t.pubkeyHex).filter((e) => Qe(e.kind) && e.repostTarget?.rawEvent.id === n.eventId).first())?.repostTarget : void 0), i = n && n.eventId === e.targetEventId && r ? Z(r.rawEvent, {
		eventId: e.targetEventId,
		authorHint: null,
		relayHints: []
	}) : null;
	return i ? {
		event: i.event,
		relayHints: r.relayHints
	} : null;
}
function ti(e) {
	let t = `post-history-repost:${++$r}`, n = 0, r = C(x({}));
	function i(e) {
		let n = rt(e);
		return n ? {
			targetEventId: n.eventId,
			authorHint: n.authorHint,
			relayHints: n.relayHints,
			relationKind: "repost",
			sourceEventId: e.eventId,
			scopeKey: t
		} : null;
	}
	function a(n) {
		e.resolver.getScopeRevision(t);
		let i = rt(n);
		return {
			...Xe(n, i ? e.resolver.getTargetSnapshot(i.eventId) : null),
			saveFailed: b(r)[n.eventId] ?? !1
		};
	}
	async function o(t, a = !1) {
		let o = i(t), s = e.getPubkey(), c = n;
		if (!e.getShow() || !o || !s) return;
		let l = await at(Lt, s), u = () => n === c && e.getShow() && e.getPubkey() === s && e.getPosts().some((e) => e.eventId === t.eventId && e.deletedAt === void 0);
		if (!u()) return;
		let d = e.resolver.getTargetSnapshot(o.targetEventId), f = a ? await e.resolver.retryTarget(o) : await e.resolver.ensureTarget(o, { force: !!t.repostTarget && d?.status !== "resolved" });
		if (!u() || !f?.event) return;
		let p = rt(t), m = p && tt(f.event, p);
		if (m) try {
			await st.attachRepostTarget({
				outerEventId: t.eventId,
				target: m.event,
				relayHints: f.relayHints,
				localWriteScope: {
					ownerPubkeyHex: s,
					expectedRevision: l,
					isActive: u
				}
			}), u() && b(r)[t.eventId] && A(r, {
				...b(r),
				[t.eventId]: !1
			}, !0);
		} catch {
			u() && A(r, {
				...b(r),
				[t.eventId]: !0
			}, !0);
		}
	}
	return N(() => {
		let r = e.getPosts(), i = e.getPubkey();
		if (e.getShow() && i) {
			for (let e of r) Qe(e.kind) && e.deletedAt === void 0 && o(e).catch(() => void 0);
			return () => {
				n++, e.resolver.invalidateScope(t);
			};
		}
	}), L(() => {
		n++, e.resolver.invalidateScope(t);
	}), {
		suspend: () => {
			n++, e.resolver.invalidateScope(t);
		},
		getPreview: a,
		retry: (e) => {
			o(e, !b(r)[e.eventId]).catch(() => void 0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostMenuItem.svelte
var ni = a("<div class=\"repost-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), ri = {
	hash: "svelte-1s9x7c7",
	code: ".repost-icon {mask-image:var(--ehagaki-icon-7265706f73742e737667);}"
};
function ii(e, n) {
	H(n, !0), D(e, ri);
	let i = () => I(Ce, "$_", a), [a, o] = M(), s = F(n, "pending", 3, !1);
	var l = p(), u = k(l);
	c(u, () => Jn, (e, r) => {
		r(e, {
			class: "menu-action-button",
			get disabled() {
				return s();
			},
			get onSelect() {
				return n.onSelect;
			},
			children: (e, n) => {
				var r = ni(), a = y(k(r), 2), o = z(a, !0);
				_((e) => t(o, e), [() => i()(s() ? "repost.sending" : "repost.action")]), f(e, r);
			},
			$$slots: { default: !0 }
		});
	}), f(e, l), r(), o();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostRepostFeedback.svelte
var ai = a("<div class=\"repost-save-feedback svelte-rif0a0\" role=\"status\"><span> </span> <!></div>"), oi = a("<div class=\"repost-message svelte-rif0a0\"> </div>"), si = a("<!> <!>", 1), ci = {
	hash: "svelte-rif0a0",
	code: ".repost-message.svelte-rif0a0 {white-space:normal;overflow-wrap:anywhere;}.repost-save-feedback.svelte-rif0a0 {display:flex;flex:0 0 auto;flex-wrap:wrap;align-items:center;gap:8px;min-width:0;width:100%;padding:8px 12px;box-sizing:border-box;}.repost-save-feedback.svelte-rif0a0 .repost-retry-save {height:auto;min-height:44px;padding:8px 12px;}"
};
function li(n, i) {
	H(i, !0), D(n, ci);
	let a = () => I(Ce, "$_", o), [o, s] = M(), c = F(i, "saveFailure", 3, null), l = F(i, "pending", 3, !1), d = F(i, "anchor", 3, null), p = F(i, "anchorRightOffset", 3, 0), m = C(!1), h = C(!1), g = C(null), x = U(() => c() ?? (i.result?.retryInput ? i.result : null));
	N(() => {
		if (A(m, l() || !!i.result && i.result !== b(g) && i.result.error !== "repost_stale", !0), l() || !i.result || i.result.retryInput) return;
		let e = setTimeout(() => {
			A(m, !1);
		}, 4e3);
		return () => clearTimeout(e);
	});
	let S = U(() => l() ? "repost.sending" : i.result?.success ? i.result.historySaved === !1 ? "repost.saveFailed" : "repost.sent" : i.result?.error === "repost_relay_missing" ? "repost.relayMissing" : "repost.failed");
	async function w() {
		if (!b(x) || !i.onRetrySave || b(h)) return;
		let e = b(x);
		A(h, !0);
		try {
			await i.onRetrySave(e) && (A(g, e), i.result === e && A(m, !1));
		} finally {
			A(h, !1);
		}
	}
	var T = si(), E = k(T), j = (n) => {
		var r = ai(), i = v(r), o = z(i, !0), s = y(i, 2);
		{
			let e = U(() => l() || b(h));
			He(s, {
				className: "repost-retry-save",
				variant: "default",
				shape: "rounded",
				get disabled() {
					return b(e);
				},
				onClick: () => void w(),
				children: (e, n) => {
					O();
					var r = P();
					_((e) => t(r, e), [() => a()("repost.retrySave")]), f(e, r);
				},
				$$slots: { default: !0 }
			});
		}
		e(r), _((e) => t(o, e), [() => a()("repost.saveFailed")]), f(n, r);
	};
	u(E, (e) => {
		b(x) && b(x) !== b(g) && i.onRetrySave && e(j);
	});
	var L = y(E, 2);
	{
		let e = U(() => b(m) && (l() || !i.result?.retryInput)), n = U(() => d() ? "anchor-bottom-right" : "top-right");
		Ue(L, {
			get show() {
				return b(e);
			},
			get variant() {
				return b(n);
			},
			get anchor() {
				return d();
			},
			get anchorRightOffset() {
				return p();
			},
			children: (e, n) => {
				var r = oi(), i = z(r, !0);
				_((e) => t(i, e), [() => a()(b(S))]), f(e, r);
			},
			$$slots: { default: !0 }
		});
	}
	f(n, T), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryActionMenu.svelte
var ui = a("<div class=\"more-icon svg-icon\"></div>"), di = a("<!> <!>", 1), fi = a("<div class=\"post-history-menu-timestamp\"> </div> <!>", 1), pi = a("<div class=\"post-history-menu-body\"><!> <!></div>"), mi = a("<button><div class=\"more-icon svg-icon\"></div></button>"), hi = a("<button type=\"button\" aria-haspopup=\"menu\"><div class=\"more-icon svg-icon\"></div></button>"), gi = {
	hash: "svelte-ea4c9b",
	code: ".post-history-menu-trigger {aspect-ratio:1;border-radius:50%;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-history-menu-trigger .more-icon {width:22px;height:22px;mask-image:var(--ehagaki-icon-6d6f72655f766572745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);--svg: currentColor;}.post-history-menu-trigger.post-history-heading-menu-trigger {min-height:50px;padding:0;border-radius:0;--btn-bg: var(--dialog-bg);background-color:var(--dialog-bg);color:var(--text-muted);}\n            .post-history-menu-trigger.post-history-heading-menu-trigger\n                .more-icon\n         {width:28px;height:28px;}.post-history-menu-content {background:var(--dialog-bg, #fff);color:var(--text, #000);border:1px solid var(--border, #ccc);border-radius:10px;box-shadow:0 8px 24px rgba(0, 0, 0, 0.16);padding:8px;min-width:180px;z-index:102;outline:none;--post-history-menu-action-hover-bg: light-dark(\n            color-mix(in srgb, var(--dialog-bg), black 6%),\n            color-mix(in srgb, var(--dialog-bg), white 10%)\n        );--post-history-menu-action-hover-color: light-dark(\n            color-mix(in srgb, var(--text), black 6%),\n            color-mix(in srgb, var(--text), white 10%)\n        );--post-history-menu-action-danger-hover-bg: color-mix(\n            in srgb,\n            var(--dialog-bg),\n            var(--danger) 12%\n        );}.post-history-menu-body {display:flex;flex-direction:column;align-items:stretch;gap:2px;}.post-history-menu-timestamp {width:fit-content;margin-inline:auto;color:var(--text-muted);font-size:0.875rem;line-height:1.35;user-select:text;white-space:nowrap;}.post-history-menu-content[data-state=\"open\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-in 150ms ease-out;}.post-history-menu-content[data-state=\"closed\"] {\n        animation: svelte-ea4c9b-post-history-menu-popover-out 100ms ease-in;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-menu-content[data-state=\"open\"],\n        .post-history-menu-content[data-state=\"closed\"] {\n            animation: none;}\n    }.post-history-menu-content .post-history-menu-separator {height:1px;margin:4px 0;background:var(--border-hr);}.post-history-menu-content .menu-action-button {display:flex;align-items:center;justify-content:flex-start;gap:10px;width:100%;min-height:44px;padding:10px 12px;border:none;border-radius:6px;background-color:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer;}.post-history-menu-content .menu-action-button-danger {color:var(--danger);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button[data-highlighted]:not([data-disabled])\n         {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n            .post-history-menu-content\n                .menu-action-button-danger[data-highlighted]:not(\n                    [data-disabled]\n                )\n         {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-history-menu-content\n                    .menu-action-button:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-hover-bg);color:var(--post-history-menu-action-hover-color);--svg: currentColor;}\n                .post-history-menu-content\n                    .menu-action-button-danger:hover:not([data-disabled])\n             {background-color:var(--post-history-menu-action-danger-hover-bg);color:var(--danger);--svg: currentColor;}\n    }.post-history-menu-content .menu-action-button[data-disabled] {opacity:0.55;cursor:not-allowed;}.post-history-menu-content .menu-action-button .svg-icon {display:inline-flex;align-items:center;justify-content:center;--icon-size: 20px;}\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-in {\n        from {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n        to {\n            opacity: 1;\n            translate: 0 0;\n        }\n    }\n\n    @keyframes svelte-ea4c9b-post-history-menu-popover-out {\n        from {\n            opacity: 1;\n            translate: 0 0;\n        }\n        to {\n            opacity: 0;\n            translate: 0 -4px;\n        }\n    }"
};
function _i(n, i) {
	H(i, !0), D(n, gi);
	let a = F(i, "open", 3, !1), o = F(i, "onOpenChange", 3, void 0), s = F(i, "triggerClassName", 3, ""), h = F(i, "align", 3, "start"), x = F(i, "timestamp", 3, void 0), w = F(i, "items", 3, void 0), T = F(i, "tooltipContent", 3, void 0), j = F(i, "enableTooltip", 3, !1), M = F(i, "lazy", 3, !1), I = F(i, "restoreFocusOnClose", 3, !1), L = W().overlayTarget, G = C(!1), K = C(!1), q = C(!1), J = C(null), ee = U(() => !M() || b(G) || a()), te = !1;
	N(() => {
		a() !== te && (te = a(), A(K, a()), a() && A(q, !1));
	});
	function ne(e) {
		A(K, e, !0), e && A(q, !1), o()?.(e);
	}
	function re() {
		return b(q) && !b(K);
	}
	function ie(e) {
		A(q, e && !b(K), !0);
	}
	async function ae(e, t) {
		typeof t == "function" && t(e);
		let n = typeof o() == "function";
		A(q, !1), A(G, !0), await R(), n && (A(K, !0), A(q, !1), o()(!0)), b(J) && (b(J).focus({ preventScroll: !0 }), n || b(J).click());
	}
	function oe(e) {
		e.key === "ArrowDown" && (e.preventDefault(), ae(e));
	}
	var se = p(), Y = k(se), ce = (n) => {
		var r = p(), a = k(r);
		c(a, () => Qn, (n, r) => {
			r(n, {
				get open() {
					return b(K);
				},
				onOpenChange: ne,
				children: (n, r) => {
					var a = di(), o = k(a), d = (e) => {
						var n = p(), r = k(n);
						c(r, () => Ft, (e, n) => {
							n(e, {
								children: (e, n) => {
									var r = p(), a = k(r), o = re, l = ie;
									c(a, () => At, (e, n) => {
										n(e, {
											get open() {
												return o();
											},
											set open(e) {
												l(e);
											},
											delayDuration: 500,
											get disabled() {
												return b(K);
											},
											children: (e, n) => {
												var r = di(), a = k(r);
												{
													let e = (e, t) => {
														let n = () => (t?.()).props, r = U(() => {
															let { onclick: e, ...t } = n();
															return {
																tooltipOnclick: e,
																restProps: t
															};
														});
														var a = p(), o = k(a);
														{
															let e = U(() => `menu-trigger post-history-menu-trigger ${s()} ${b(K) ? "is-open" : ""}`.trim());
															c(o, () => ir, (t, n) => {
																n(t, g({
																	get class() {
																		return b(e);
																	},
																	get "aria-label"() {
																		return i.triggerAriaLabel;
																	}
																}, () => b(r).restProps, {
																	onclick: (e) => {
																		typeof b(r).tooltipOnclick == "function" && b(r).tooltipOnclick(e);
																	},
																	get ref() {
																		return b(J);
																	},
																	set ref(e) {
																		A(J, e, !0);
																	},
																	children: (e, t) => {
																		var n = ui();
																		f(e, n);
																	},
																	$$slots: { default: !0 }
																}));
															});
														}
														f(e, a);
													};
													c(a, () => wt, (t, n) => {
														n(t, {
															child: e,
															$$slots: { child: !0 }
														});
													});
												}
												var o = y(a, 2);
												c(o, () => Ge, (e, n) => {
													n(e, {
														get to() {
															return L;
														},
														children: (e, n) => {
															var r = p(), i = k(r);
															c(i, () => jt, (e, n) => {
																n(e, {
																	sideOffset: 8,
																	class: "tooltip-content post-preview-tooltip-content",
																	children: (e, n) => {
																		O();
																		var r = P();
																		_(() => t(r, T())), f(e, r);
																	},
																	$$slots: { default: !0 }
																});
															}), f(e, r);
														},
														$$slots: { default: !0 }
													});
												}), f(e, r);
											},
											$$slots: { default: !0 }
										});
									}), f(e, r);
								},
								$$slots: { default: !0 }
							});
						}), f(e, n);
					}, m = (e) => {
						var t = p(), n = k(t);
						{
							let e = U(() => `menu-trigger post-history-menu-trigger ${s()} ${b(K) ? "is-open" : ""}`.trim());
							c(n, () => ir, (t, n) => {
								n(t, {
									get class() {
										return b(e);
									},
									get "aria-label"() {
										return i.triggerAriaLabel;
									},
									get ref() {
										return b(J);
									},
									set ref(e) {
										A(J, e, !0);
									},
									children: (e, t) => {
										var n = ui();
										f(e, n);
									},
									$$slots: { default: !0 }
								});
							});
						}
						f(e, t);
					};
					u(o, (e) => {
						j() && T() ? e(d) : e(m, -1);
					});
					var S = y(o, 2);
					c(S, () => Ge, (n, r) => {
						r(n, {
							get to() {
								return L;
							},
							children: (n, r) => {
								var i = p(), a = k(i);
								c(a, () => tr, (n, r) => {
									r(n, {
										side: "bottom",
										get align() {
											return h();
										},
										sideOffset: 8,
										class: "post-history-menu-content",
										trapFocus: !1,
										preventScroll: !1,
										onCloseAutoFocus: (e) => {
											e.preventDefault(), I() && b(J)?.focus({ preventScroll: !0 });
										},
										children: (n, r) => {
											var i = pi(), a = v(i), o = (e) => {
												var n = fi(), r = k(n), i = z(r, !0), a = y(r, 2);
												c(a, () => Zn, (e, t) => {
													t(e, { class: "post-history-menu-separator" });
												}), _(() => t(i, x())), f(e, n);
											};
											u(a, (e) => {
												x() && e(o);
											});
											var s = y(a, 2);
											l(s, () => w() ?? E), e(i), f(n, i);
										},
										$$slots: { default: !0 }
									});
								}), f(n, i);
							},
							$$slots: { default: !0 }
						});
					}), f(n, a);
				},
				$$slots: { default: !0 }
			});
		}), f(n, r);
	}, le = (e) => {
		var n = p(), r = k(n);
		c(r, () => Ft, (e, n) => {
			n(e, {
				children: (e, n) => {
					var r = p(), a = k(r), o = re, l = ie;
					c(a, () => At, (e, n) => {
						n(e, {
							get open() {
								return o();
							},
							set open(e) {
								l(e);
							},
							delayDuration: 500,
							get disabled() {
								return b(K);
							},
							children: (e, n) => {
								var r = di(), a = k(r);
								{
									let e = (e, t) => {
										let n = () => (t?.()).props, r = U(() => {
											let { onclick: e, ...t } = n();
											return {
												tooltipOnclick: e,
												restProps: t
											};
										});
										var a = mi(), o = (e) => void ae(e, b(r).tooltipOnclick);
										S(a, (e) => ({
											type: "button",
											class: e,
											"aria-label": i.triggerAriaLabel,
											"aria-haspopup": "menu",
											"aria-expanded": b(K),
											...b(r).restProps,
											onclick: o,
											onkeydown: oe
										}), [() => `menu-trigger post-history-menu-trigger ${s()}`.trim()]), f(e, a);
									};
									c(a, () => wt, (t, n) => {
										n(t, {
											child: e,
											$$slots: { child: !0 }
										});
									});
								}
								var o = y(a, 2);
								c(o, () => Ge, (e, n) => {
									n(e, {
										get to() {
											return L;
										},
										children: (e, n) => {
											var r = p(), i = k(r);
											c(i, () => jt, (e, n) => {
												n(e, {
													sideOffset: 8,
													class: "tooltip-content post-preview-tooltip-content",
													children: (e, n) => {
														O();
														var r = P();
														_(() => t(r, T())), f(e, r);
													},
													$$slots: { default: !0 }
												});
											}), f(e, r);
										},
										$$slots: { default: !0 }
									});
								}), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}), f(e, r);
				},
				$$slots: { default: !0 }
			});
		}), f(e, n);
	}, ue = (e) => {
		var t = hi();
		_((e) => {
			V(t, 1, e), B(t, "aria-label", i.triggerAriaLabel), B(t, "aria-expanded", b(K));
		}, [() => d(`menu-trigger post-history-menu-trigger ${s()}`.trim())]), m("click", t, (e) => void ae(e)), m("keydown", t, oe), f(e, t);
	};
	u(Y, (e) => {
		b(ee) ? e(ce) : j() && T() ? e(le, 1) : e(ue, -1);
	}), f(n, se), r();
}
o(["click", "keydown"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepliesBadgeButton.svelte
var vi = a("<span class=\"post-preview-replies-badge svelte-11vk23d\" aria-hidden=\"true\"> </span>"), yi = a("<!> <!>", 1), bi = {
	hash: "svelte-11vk23d",
	code: ".post-preview-replies-badge-button {width:36px;min-width:36px;min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-preview-replies-badge.svelte-11vk23d {display:inline-flex;align-items:center;justify-content:center;aspect-ratio:1;width:20px;height:20px;border-radius:999px;background:var(--btn-post-preview-action);color:var(--post-history-preview-footer-surface, var(--dialog-bg));font-size:0.6875rem;font-weight:700;line-height:20px;text-align:center;}\n            .post-preview-replies-badge-button.selected\n                .post-preview-replies-badge\n         {background-color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-preview-replies-badge-button:hover:not(:disabled)\n                    .post-preview-replies-badge\n             {background-color:var(--text);}\n    }"
};
function xi(e, n) {
	H(n, !0), D(e, bi);
	let i = F(n, "tooltipContent", 19, () => n.ariaLabel), a = F(n, "className", 3, ""), o = W().overlayTarget;
	var s = p(), l = k(s);
	c(l, () => Ft, (e, r) => {
		r(e, {
			children: (e, r) => {
				var s = p(), l = k(s);
				c(l, () => At, (e, r) => {
					r(e, {
						delayDuration: 500,
						children: (e, r) => {
							var s = yi(), l = k(s);
							{
								let e = (e, r) => {
									let i = () => (r?.()).props, o = U(() => {
										let { onclick: e, ...t } = i();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									{
										let r = U(() => `post-preview-replies-badge-button ${a()}`);
										He(e, g({
											type: "button",
											get class() {
												return b(r);
											},
											get ariaLabel() {
												return n.ariaLabel;
											},
											contentLayout: "icon",
											shape: "circle",
											get selected() {
												return n.selected;
											},
											onClick: (e) => {
												n.onClick(), typeof b(o).tooltipOnclick == "function" && b(o).tooltipOnclick(e);
											}
										}, () => b(o).restProps, {
											children: (e, r) => {
												var i = vi(), a = z(i, !0);
												_(() => t(a, n.count)), f(e, i);
											},
											$$slots: { default: !0 }
										}));
									}
								};
								c(l, () => wt, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var u = y(l, 2);
							c(u, () => Ge, (e, n) => {
								n(e, {
									get to() {
										return o;
									},
									children: (e, n) => {
										var r = p(), a = k(r);
										c(a, () => jt, (e, n) => {
											n(e, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (e, n) => {
													O();
													var r = P();
													_(() => t(r, i())), f(e, r);
												},
												$$slots: { default: !0 }
											});
										}), f(e, r);
									},
									$$slots: { default: !0 }
								});
							}), f(e, s);
						},
						$$slots: { default: !0 }
					});
				}), f(e, s);
			},
			$$slots: { default: !0 }
		});
	}), f(e, s), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryReactionActionButton.svelte
function Si(e, t) {
	xi(e, {
		className: "post-preview-reactions-button",
		get count() {
			return t.count;
		},
		get ariaLabel() {
			return t.ariaLabel;
		},
		get selected() {
			return t.expanded;
		},
		get onClick() {
			return t.onToggle;
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryReactionReadModel.ts
var Ci = {
	totalCount: 0,
	groups: []
}, wi = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function Ti(e) {
	if (!tn(e.content)) return;
	let t = nn(e.content);
	if (t) return rn(e.tags ?? []).get(t)?.url;
}
function Ei(e) {
	let t = e.trim();
	if (!t) return "+";
	if (tn(t)) return t;
	let n = wi.segment(t)[Symbol.iterator]().next();
	return n.done ? "" : n.value.segment;
}
function Di(e, t) {
	return e ? e instanceof Map ? e.get(t) ?? null : e[t] ?? null : null;
}
function Oi(e) {
	try {
		return an(We(e), 9, 4);
	} catch {
		return e.slice(0, 12);
	}
}
function ki(e) {
	return e.profile?.displayName?.trim() || e.profile?.name?.trim() || Oi(e.pubkey);
}
async function Ai(e, t = Q) {
	return e ? t.getReactionRecords(e) : [];
}
function ji(e, t) {
	if (e.length === 0) return Ci;
	let n = [], r = /* @__PURE__ */ new Map(), i = 0;
	for (let a of e) {
		if (a.kind !== 7) continue;
		i += 1;
		let e = Ei(a.content);
		if (!e) continue;
		let o = {
			eventId: a.eventId,
			pubkey: a.authorPubkey,
			profile: Di(t, a.authorPubkey),
			createdAt: a.createdAt
		}, s = r.get(e), c = Ti(a);
		if (s === void 0) {
			r.set(e, n.length), n.push({
				content: e,
				count: 1,
				...c ? { emojiUrl: c } : {},
				reactors: [o]
			});
			continue;
		}
		let l = n[s], u = l.emojiUrl ?? c;
		n[s] = {
			...l,
			count: l.count + 1,
			...u ? { emojiUrl: u } : {},
			reactors: [...l.reactors, o]
		};
	}
	return i === 0 ? Ci : {
		totalCount: i,
		groups: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryReactionDetails.svelte
var Mi = a("<div class=\"favorite-icon svg-icon post-preview-reaction-symbol\" aria-hidden=\"true\"></div>"), Ni = a("<span class=\"post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed\" role=\"img\" tabindex=\"0\"> </span>"), Pi = a("<img class=\"post-preview-reaction-emoji\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/>"), Fi = a("<span class=\"post-preview-reaction-emoji-placeholder\" aria-hidden=\"true\"></span>"), Ii = a("<span class=\"post-preview-reaction-emoji-slot\"><!></span>"), Li = a("<span class=\"post-preview-reaction-content\"> </span>"), Ri = a("<span class=\"post-preview-reaction-actor\"><!></span>"), zi = a("<div class=\"post-preview-reaction-chip\"><div class=\"post-preview-reaction-summary\"><!> <span class=\"post-preview-reaction-count\"> </span></div> <div class=\"post-preview-reaction-actors\"></div></div>"), Bi = a("<div class=\"post-preview-reactions-panel\"></div>"), Vi = {
	hash: "svelte-j0ansb",
	code: ".post-preview-reactions-panel {display:flex;flex-wrap:wrap;gap:4px;padding:0 16px;}.post-preview-reaction-chip {display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);color:var(--text);}.post-preview-reaction-summary {display:inline-flex;align-items:center;justify-content:center;gap:2px;row-gap:4px;flex-wrap:wrap;}.post-preview-reaction-content {font-size:20px;line-height:1;}.post-preview-reaction-count {font-size:1rem;line-height:1;color:var(--text-muted);}.post-preview-reaction-emoji-slot {display:inline-grid;margin:0;padding:0;}.post-preview-reaction-emoji,\n    .post-preview-reaction-emoji-placeholder {width:100%;height:100%;}.post-preview-reaction-emoji {display:block;margin:0;padding:0;object-fit:contain;user-select:none;-webkit-user-drag:none;}.post-preview-reaction-emoji-placeholder {display:block;border-radius:4px;background:rgba(127, 127, 127, 0.18);}.post-preview-reaction-emoji-failed {display:inline-grid;place-items:center;overflow:hidden;border-radius:4px;background:rgba(127, 127, 127, 0.18);font-size:0.45em;line-height:1;white-space:nowrap;cursor:help;}.post-preview-reaction-actors {display:inline-flex;flex-wrap:wrap;gap:2px;align-items:center;}.post-preview-reaction-actor {display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;overflow:hidden;flex:0 0 auto;}.post-preview-reaction-avatar,\n    .post-preview-reaction-avatar-image,\n    .post-preview-reaction-avatar-fallback {width:100%;height:100%;}.post-preview-reaction-avatar-image {object-fit:cover;}.post-preview-reaction-symbol {width:18px;height:18px;background-color:rgb(249, 24, 128);mask-image:var(--ehagaki-icon-6661766f726974655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Hi(a, o) {
	H(o, !0), D(a, Vi);
	let s = F(o, "emojiLoadStateByUrl", 19, () => ({})), c = F(o, "emojiImageMetaByUrl", 19, () => ({}));
	function l(e) {
		let t = c()[e]?.aspectRatio;
		return `width:${typeof t == "number" && Number.isFinite(t) && t > 0 ? 18 * t : 18}px;height:18px;vertical-align:bottom;`;
	}
	var d = p(), m = k(d), h = (r) => {
		var a = Bi();
		i(a, 21, () => o.readModel.groups, (e) => e.content, (r, a) => {
			var o = zi(), c = v(o), d = v(c), m = (e) => {
				var t = Mi();
				f(e, t);
			}, h = U(() => Pt(b(a).content)), g = (r) => {
				var i = p(), o = k(i), c = (e) => {
					var r = Ni(), i = z(r, !0);
					_((e) => {
						n(r, e), B(r, "aria-label", b(a).content), B(r, "title", b(a).content), t(i, b(a).content);
					}, [() => l(b(a).emojiUrl)]), f(e, r);
				}, d = (t) => {
					var r = Ii(), i = v(r), o = (e) => {
						var t = Pi();
						_(() => {
							B(t, "src", b(a).emojiUrl), B(t, "alt", b(a).content), B(t, "title", b(a).content);
						}), f(e, t);
					}, c = (e) => {
						var t = Fi();
						f(e, t);
					};
					u(i, (e) => {
						s()[b(a).emojiUrl] === "ready" ? e(o) : e(c, -1);
					}), e(r), _((e) => n(r, e), [() => l(b(a).emojiUrl)]), f(t, r);
				};
				u(o, (e) => {
					s()[b(a).emojiUrl] === "failed" ? e(c) : e(d, -1);
				}), f(r, i);
			}, x = (e) => {
				var n = Li(), r = z(n, !0);
				_(() => t(r, b(a).content)), f(e, n);
			};
			u(d, (e) => {
				b(h) ? e(m) : b(a).emojiUrl ? e(g, 1) : e(x, -1);
			});
			var S = y(d, 2), C = z(S, !0);
			e(c);
			var w = y(c, 2);
			i(w, 21, () => b(a).reactors, (e) => e.eventId, (t, n) => {
				let r = U(() => ki(b(n)));
				var i = Ri(), a = v(i);
				{
					let e = U(() => b(n).profile?.picture || "");
					on(a, {
						get src() {
							return b(e);
						},
						get alt() {
							return b(r);
						},
						rootClassName: "post-preview-reaction-avatar",
						imageClassName: "post-preview-reaction-avatar-image",
						fallbackClassName: "post-preview-reaction-avatar-fallback",
						get fallbackAriaLabel() {
							return b(r);
						},
						fallbackDelayMs: 0
					});
				}
				e(i), _(() => {
					B(i, "title", b(r)), B(i, "aria-label", b(r));
				}), f(t, i);
			}), e(w), e(o), _(() => t(C, b(a).count)), f(r, o);
		}), e(a), f(r, a);
	};
	u(m, (e) => {
		o.readModel.totalCount > 0 && e(h);
	}), f(a, d), r();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRawJsonDialog.svelte
var Ui = a("<div class=\"xmark-icon svg-icon svelte-10wau4w\"></div>"), Wi = a("<!> <!>", 1), Gi = a("<pre class=\"raw-json-content svelte-10wau4w\"><code> </code></pre>"), Ki = a("<!> <!> <!>", 1), qi = a("<div class=\"raw-json-heading svelte-10wau4w\"><h2 class=\"svelte-10wau4w\"> </h2></div> <!>", 1), Ji = {
	hash: "svelte-10wau4w",
	code: ".xmark-icon.svelte-10wau4w {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-raw-json-dialog .dialog-content {padding:8px;}.post-history-raw-json-dialog--tabs {height:min(80svh, 720px);max-height:calc(100svh - 24px);}.post-history-raw-json-dialog--tabs .dialog-content {flex:1 1 0;min-height:0;max-height:none;overflow:hidden;box-sizing:border-box;align-items:stretch;}.raw-json-heading.svelte-10wau4w {width:100%;flex:0 0 auto;}.raw-json-heading.svelte-10wau4w h2:where(.svelte-10wau4w) {margin:0;font-size:1.1rem;}.raw-json-tabs {display:flex;width:100%;box-sizing:border-box;gap:4px;margin-top:8px;border-bottom:1px solid var(--border-hr);}.raw-json-tabs-root,\n    .raw-json-panel {width:100%;min-width:0;}.raw-json-tabs-root {display:flex;flex:1 1 0;flex-direction:column;min-height:0;overflow:hidden;}.raw-json-panel[data-state=\"active\"] {display:flex;flex:1 1 0;min-height:0;overflow:hidden;}.post-history-raw-json-dialog--tabs .raw-json-content {flex:1 1 0;min-height:0;height:auto;}.raw-json-tabs button {border:0;border-bottom:2px solid transparent;padding:6px 10px;background:transparent;color:var(--text);font:inherit;cursor:pointer;}.raw-json-tabs button[data-state=\"active\"] {border-bottom-color:var(--accent-color);}.raw-json-content.svelte-10wau4w {width:100%;min-width:0;box-sizing:border-box;height:100%;margin:10px 0 0;padding:8px;overflow:auto;border:1px solid var(--border-hr);border-radius:8px;background:color-mix(in srgb, var(--dialog-bg), var(--text) 4%);color:var(--text);font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\n            \"Liberation Mono\", monospace;font-size:0.82rem;line-height:1.45;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;}.post-history-raw-json-dialog {max-width:min(760px, calc(100% - 10px));}"
};
function Yi(n, i) {
	H(i, !0), D(n, Ji);
	let a = () => I(Ce, "$_", o), [o, s] = M(), l = F(i, "open", 15, !1), d = F(i, "resetKey", 3, 0), m = F(i, "loadPayloadEvent", 3, void 0), h = F(i, "observePayloadStatus", 3, void 0), x = F(i, "onOpenChange", 3, void 0), S = C("structure"), w = C(void 0), T, E, j = 0, R = -1, V = U(() => it(i.rawEvent) && ht(i.rawEvent) ? i.rawEvent : null), W = U(() => m() !== void 0 && b(V) !== null), G = U(() => JSON.stringify(i.rawEvent, null, 2) ?? ""), K = U(() => b(w) ? JSON.stringify(b(w), null, 2) ?? "" : "");
	function q() {
		j += 1, T?.abort(), T = void 0, E?.(), E = void 0, A(S, "structure"), A(w, void 0);
	}
	L(q), N(() => {
		let e = d();
		e !== R && q(), R = e;
	});
	async function J(e) {
		if (A(S, e, !0), e !== "payload" || b(w) !== void 0 || !b(V) || !m()) return;
		let t = new AbortController();
		T?.abort(), T = t;
		let n = ++j, r = b(V).id;
		E?.(), E = h()?.(b(V), (e) => {
			(e === "deleted" || e === "invalid") && l() && b(V)?.id === r && A(w, null);
		});
		try {
			let e = await m()(b(V), t.signal);
			!t.signal.aborted && n === j && A(w, e, !0);
		} catch {
			!t.signal.aborted && n === j && A(w, null);
		} finally {
			n === j && (T = void 0);
		}
	}
	function ee(e) {
		e || (q(), x()?.(!1));
	}
	{
		let r = (e) => {
			var t = p(), n = k(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = U(() => a()("global.close"));
						He(e, g(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return b(t);
							},
							children: (e, t) => {
								var n = Ui();
								_((e) => B(n, "aria-label", e), [() => a()("global.close")]), f(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				c(n, () => Xt, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			f(e, t);
		}, i = U(() => a()("postHistory.rawJsonTitle")), o = U(() => a()("postHistory.rawJsonDescription")), s = U(() => b(W) ? "post-history-raw-json-dialog post-history-raw-json-dialog--tabs" : "post-history-raw-json-dialog");
		Yt(n, {
			onOpenChange: ee,
			get title() {
				return b(i);
			},
			get description() {
				return b(o);
			},
			get contentClass() {
				return b(s);
			},
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return l();
			},
			set open(e) {
				l(e);
			},
			footer: r,
			children: (n, r) => {
				var i = qi(), o = k(i), s = v(o), l = z(s, !0);
				e(o);
				var d = y(o, 2), m = (n) => {
					var r = p(), i = k(r);
					c(i, () => Zt, (n, r) => {
						r(n, {
							get value() {
								return b(S);
							},
							onValueChange: (e) => void J(e),
							class: "raw-json-tabs-root",
							children: (n, r) => {
								var i = Ki(), a = k(i);
								c(a, () => Qt, (e, t) => {
									t(e, {
										class: "raw-json-tabs",
										children: (e, t) => {
											var n = Wi(), r = k(n);
											c(r, () => en, (e, t) => {
												t(e, {
													value: "structure",
													children: (e, t) => {
														O();
														var n = P("Structure");
														f(e, n);
													},
													$$slots: { default: !0 }
												});
											});
											var i = y(r, 2);
											c(i, () => en, (e, t) => {
												t(e, {
													value: "payload",
													children: (e, t) => {
														O();
														var n = P("Payload");
														f(e, n);
													},
													$$slots: { default: !0 }
												});
											}), f(e, n);
										},
										$$slots: { default: !0 }
									});
								});
								var o = y(a, 2);
								c(o, () => $t, (n, r) => {
									r(n, {
										value: "structure",
										class: "raw-json-panel",
										children: (n, r) => {
											var i = Gi(), a = v(i), o = z(a, !0);
											e(i), _(() => t(o, b(G))), f(n, i);
										},
										$$slots: { default: !0 }
									});
								});
								var s = y(o, 2);
								c(s, () => $t, (n, r) => {
									r(n, {
										value: "payload",
										class: "raw-json-panel",
										children: (n, r) => {
											var i = Gi(), a = v(i), o = z(a, !0);
											e(i), _(() => t(o, b(K))), f(n, i);
										},
										$$slots: { default: !0 }
									});
								}), f(n, i);
							},
							$$slots: { default: !0 }
						});
					}), f(n, r);
				}, h = (n) => {
					var r = Gi(), i = v(r), a = z(i, !0);
					e(r), _(() => t(a, b(G))), f(n, r);
				};
				u(d, (e) => {
					b(W) ? e(m) : e(h, -1);
				}), _((e) => t(l, e), [() => a()("postHistory.rawJsonTitle")]), f(n, i);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostPreviewToggleButton.svelte
var Xi = a("<div><!></div>"), Zi = {
	hash: "svelte-1yd56n0",
	code: ".post-preview-toggle-row.svelte-1yd56n0 {display:flex;&.post-preview-toggle-hidden {visibility:hidden;pointer-events:none;}&.post-preview-toggle-overlay {position:absolute;inset-inline-end:0;inset-block-end:0;z-index:1;padding-inline-start:12px;background:linear-gradient(90deg, transparent, var(--dialog-bg) 18%);}&.post-preview-toggle-flow {position:static;align-self:flex-end;padding:0;background:none;}.ehagaki-app-root & button.post-preview-toggle-button,\n        .ehagaki-app-root & button.post-preview-toggle-button:hover {color:var(--text-muted);font-size:0.875rem;font-weight:normal;min-height:24px;padding:0;background:transparent;}\n\n        @media (hover: hover) and (pointer: fine) {.ehagaki-app-root & button.post-preview-toggle-button:hover {text-decoration:underline;}\n        }}"
};
function Qi(n, i) {
	H(i, !0), D(n, Zi);
	let a = () => I(Ce, "$_", o), [o, s] = M(), c = F(i, "visible", 3, !0), l = F(i, "placement", 3, "inline");
	var u = Xi();
	let d;
	var p = v(u);
	{
		let e = U(() => !c());
		He(p, {
			type: "button",
			class: "post-preview-action-button post-preview-toggle-button",
			get "aria-expanded"() {
				return i.expanded;
			},
			get "aria-controls"() {
				return i.controls;
			},
			get disabled() {
				return b(e);
			},
			get onClick() {
				return i.onToggle;
			},
			children: (e, n) => {
				O();
				var r = P();
				_((e) => t(r, e), [() => i.expanded ? a()("postHistory.collapse") : a()("postHistory.expand")]), f(e, r);
			},
			$$slots: { default: !0 }
		});
	}
	e(u), _(() => d = V(u, 1, "post-preview-toggle-row svelte-1yd56n0", null, d, {
		"post-preview-toggle-overlay": l() === "overlay" && (!i.expanded || !c()),
		"post-preview-toggle-flow": l() === "overlay" && i.expanded && c(),
		"post-preview-toggle-hidden": !c()
	})), f(n, u), r(), s();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPreviewCollapse.svelte.ts
function $i({ getShow: e, getSessionOpen: t = e, getPosts: n, getContainer: r, maxLines: i = 5 }) {
	let a = C(x({})), o = C(x({})), s = {}, c = null, l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), d = !1, f = null, p = 0;
	function m(e) {
		let t = getComputedStyle(e), n = parseFloat(t.lineHeight);
		if (!n || Number.isNaN(n)) {
			let e = parseFloat(t.fontSize);
			return e && !Number.isNaN(e) ? e * 1.5 : 24;
		}
		return n;
	}
	function h(e, t) {
		return s[t] = e, y(t), { destroy() {
			s[t] === e && delete s[t];
		} };
	}
	function g(e) {
		let t = Object.keys(b(a)), n = Object.keys(e);
		t.length === n.length && t.every((t) => b(a)[t] === e[t]) || A(a, e, !0);
	}
	function _() {
		if (!e()) {
			u.clear(), d = !1, g({});
			return;
		}
		let t = n(), r = u, o = d;
		u = /* @__PURE__ */ new Set(), d = !1;
		let c = {}, l;
		for (let e of t) {
			if (e.forceCollapsible) continue;
			if (!o && !r.has(e.eventId)) {
				let t = b(a)[e.eventId];
				t !== void 0 && (c[e.eventId] = t);
				continue;
			}
			let t = s[e.eventId];
			if (!t) continue;
			l ??= m(t);
			let n = l * i, u = t.scrollHeight > 0;
			c[e.eventId] = u ? t.scrollHeight > n + .5 : e.content.split("\n").length > i;
		}
		g(c);
	}
	function v() {
		if (f) return f;
		let e = ++p, t = R().then(() => {
			e === p && (f = null, _());
		});
		return f = t, t;
	}
	function y(e) {
		return e ? u.add(e) : d = !0, v();
	}
	function S() {
		let e = r();
		typeof ResizeObserver < "u" && e && (c || (c = new ResizeObserver(() => {
			y();
		}), c.observe(e)));
	}
	function w() {
		c?.disconnect(), c = null;
	}
	function T() {
		p++, f = null, w(), s = {};
	}
	function E() {
		T(), g({}), A(o, {}, !0), s = {}, l.clear(), u.clear(), d = !1, w();
	}
	function D(e) {
		return b(o)[e.eventId] ?? !1;
	}
	function O(e) {
		A(o, {
			...b(o),
			[e]: !b(o)[e]
		}, !0);
	}
	function k(e) {
		return e.forceCollapsible === !0 || (b(a)[e.eventId] ?? !1);
	}
	return N(() => {
		t() || j(E);
	}), N(() => {
		if (!e()) return;
		let t = n(), r = /* @__PURE__ */ new Map();
		for (let e of t) {
			let t = {
				content: e.content,
				forceCollapsible: e.forceCollapsible
			}, n = l.get(e.eventId);
			(n?.content !== t.content || n.forceCollapsible !== t.forceCollapsible) && u.add(e.eventId), r.set(e.eventId, t);
		}
		l = r, v();
	}), N(() => {
		if (e() && r()) return S(), () => {
			w();
		};
	}), L(() => {
		w();
	}), {
		suspend: T,
		previewRef: h,
		isPostExpanded: D,
		remeasure: () => y(),
		togglePostExpanded: O,
		shouldCollapsePost: k
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRepairSaveService.ts
var ea = {
	status: "saved",
	savedParentEventIds: [],
	savedDirectReplyCount: 0,
	deletedEventIds: [],
	deletionConfirmationIncomplete: !1
};
function ta(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.parentEventId || !n.event?.id || !n.event.pubkey || ![
			1,
			42,
			1111
		].includes(n.event.kind)) continue;
		let e = t.get(n.event.id);
		t.set(n.event.id, {
			parentEventId: n.parentEventId,
			event: n.event,
			relayUrls: Array.from(/* @__PURE__ */ new Set([...e?.relayUrls ?? [], ...n.relayUrls ?? []]))
		});
	}
	return Array.from(t.values());
}
function na(e, t) {
	return e.filter((e) => t.get(e.event.pubkey)?.has(e.event.id)).map((e) => e.event.id);
}
function ra(e) {
	return {
		...e,
		status: "cancelled",
		savedParentEventIds: [],
		savedDirectReplyCount: 0
	};
}
var ia = new class {
	deletionFetchService;
	deletionRequestsRepository;
	childInteractionsRepository;
	now;
	constructor(e = {}) {
		this.deletionFetchService = e.deletionFetchService ?? Ot, this.deletionRequestsRepository = e.deletionRequestsRepository ?? Et, this.childInteractionsRepository = e.childInteractionsRepository ?? ft, this.now = e.now ?? Date.now;
	}
	saveRepairDirectReplies(e, t) {
		let n = !0, r = null, i = () => n && t.isActive?.() !== !1;
		return {
			promise: (async () => {
				let n = ta(t.items);
				if (n.length === 0) return ea;
				let a = await this.filterKnownDeletedDirectReplies(n), o = a.deletedEventIds;
				if (!i()) return ra({
					...ea,
					deletedEventIds: o
				});
				let s = a.visibleItems, c = !1;
				if (s.length > 0) {
					r = this.deletionFetchService.fetchDeletionRequests(e, {
						targets: s.map((e) => ({
							event: e.event,
							relayUrls: e.relayUrls
						})),
						relayHints: t.relayHints,
						relayConfig: t.relayConfig
					});
					let n = await r.promise;
					if (r = null, !i() || n.status === "cancelled") return ra({
						...ea,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c || n.status !== "success"
					});
					if (c = n.status !== "success", n.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
						targetEvents: s.map((e) => e.event),
						deletionEvents: n.events,
						fetchedAt: n.fetchedAt
					}), !i()) return ra({
						...ea,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c
					});
					let a = await this.filterKnownDeletedDirectReplies(s);
					s = a.visibleItems, o = Array.from(/* @__PURE__ */ new Set([...o, ...a.deletedEventIds]));
				}
				if (!i()) return ra({
					...ea,
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				});
				let l = await this.saveVisibleDirectReplies(s, t.fetchedAt ?? this.now(), i, t.expectedChildGeneration);
				return i() ? {
					...l,
					status: "saved",
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				} : ra({
					...l,
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				});
			})(),
			cancel: () => {
				n = !1, r?.cancel();
			}
		};
	}
	async filterKnownDeletedDirectReplies(e) {
		let t = na(e, await this.deletionRequestsRepository.getDeletedTargets(e.map((e) => ({
			targetAuthorPubkey: e.event.pubkey,
			targetEventId: e.event.id
		}))));
		await this.purgeDeletedReplyCache(t);
		let n = new Set(t);
		return {
			visibleItems: e.filter((e) => !n.has(e.event.id)),
			deletedEventIds: t
		};
	}
	async purgeDeletedReplyCache(e) {
		for (let t of new Set(e)) await this.childInteractionsRepository.deleteChildInteractionByEventId(t);
	}
	async saveVisibleDirectReplies(e, t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = i.get(t.parentEventId) ?? [];
			e.push({
				event: t.event,
				...t.relayUrls ? { relayUrls: t.relayUrls } : {}
			}), i.set(t.parentEventId, e);
		}
		let a = [], o = 0;
		for (let [e, s] of i.entries()) {
			if (!n()) break;
			let i = await this.childInteractionsRepository.upsertChildInteractions({
				parentEventId: e,
				events: s,
				fetchedAt: t,
				expectedChildGeneration: r
			}), c = i.insertedCount + i.updatedCount;
			c > 0 && (a.push(e), o += c);
		}
		return {
			status: "saved",
			savedParentEventIds: a,
			savedDirectReplyCount: o
		};
	}
}(), aa = [
	"reply",
	"reaction",
	"quote"
];
function oa(e) {
	let t = e ?? aa;
	return Array.from(new Set(t.filter((e) => e === "reply" || e === "reaction" || e === "quote")));
}
function sa(e, t) {
	let n = oa(t.relationKinds);
	return {
		source: e,
		relationKinds: n,
		parentEventIds: Array.from(new Set(t.savedParentEventIds)),
		shouldRefreshQuotePreviews: n.includes("quote") && t.quoteRepairApplied
	};
}
var ca = 6e3, la = 8, ua = 6e4, da = aa, fa = {
	status: "success",
	targetParentEventIds: [],
	checkedParentEventIds: [],
	savedParentEventIds: [],
	savedDirectReplyCount: 0,
	attemptedChunkCount: 0,
	saturatedChunkCount: 0,
	incompleteParentEventIds: [],
	deletionConfirmationIncomplete: !1
};
function pa() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-visible-relation-repair-${Date.now().toString(36)}-${e}`;
}
function ma(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) if ([
		1,
		42,
		1111
	].includes(r.kind) && r.pubkeyHex === e && r.eventId && !n.has(r.eventId) && (n.set(r.eventId, r), n.size >= 150)) break;
	return Array.from(n.values());
}
function ha(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
function ga(e, t) {
	return t.includeDirectReplies ? [
		1,
		42,
		1111
	].flatMap((t) => ha(e.filter((e) => e.kind === t), 30).map((e) => ({
		posts: e,
		depth: 0
	}))) : ha(e, 30).map((e) => ({
		posts: e,
		depth: 0
	}));
}
function _a(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : t.event.created_at - e.event.created_at);
}
var va = new class {
	directReplySaveService;
	childInteractionsRepository;
	quoteVisibleRangeRepairExecutor;
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	lastFetchTimeoutWarnAt = 0;
	constructor(e = {}) {
		this.directReplySaveService = e.directReplySaveService ?? ia, this.childInteractionsRepository = e.childInteractionsRepository ?? ft, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (globalThis.console === void 0 ? {
			warn: () => void 0,
			error: () => void 0
		} : globalThis.console), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	repairVisibleRangeChildInteractions(e, t) {
		return this.repairVisibleRangeChildInteractionsInternal(e, t, {
			includeDirectReplies: !0,
			includeReactions: !0
		});
	}
	repairRelatedCardReactions(e, t) {
		let n = !0, r = /* @__PURE__ */ new Set(), i = () => n && t.isActive?.() !== !1, a = /* @__PURE__ */ new Map();
		for (let e of t.targets) {
			if (!e.eventId) continue;
			let t = a.get(e.eventId);
			a.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: q.sanitizeExternalRelayUrls([...t?.relayHints ?? [], ...e.relayHints])
			});
		}
		let o = Array.from(a.values()).slice(0, 150), s = o.map((e) => e.eventId), c = lt(Lt);
		return {
			promise: (async () => {
				if (o.length === 0) return {
					status: "success",
					targetEventIds: s
				};
				let n = !1, a = [];
				for (let e = 0; e < o.length; e += 30) a.push(o.slice(e, e + 30).map((e) => ({
					eventId: e.eventId,
					kind: 1,
					relayHints: e.relayHints,
					reactionTarget: {
						eventId: e.eventId,
						targetAuthorPubkey: e.targetAuthorPubkey,
						targetKind: e.targetKind
					}
				})));
				let l = 0, u = async (a, o) => {
					if (!i()) return;
					let s = this.fetchCandidates(e, a, t.relayConfig, {
						includeDirectReplies: !1,
						includeReactions: !0
					});
					r.add(s);
					let l = await s.promise;
					if (r.delete(s), !i() || l.status === "cancelled") return;
					let d = o === 0 && l.requiresFallback;
					l.status !== "success" && !d && (n = !0);
					let f = this.toReactionItems(a.map((e) => e.reactionTarget ?? { eventId: e.eventId }), l.items);
					if (f.length > 0 && await this.saveReactionInteractions(f, l.fetchedAt, i, await c), l.requiresFallback) {
						if (o === 0) for (let e = 0; e < a.length; e += 10) await u(a.slice(e, e + 10), 1);
						else l.coverageSaturated && (n = !0);
					}
				}, d = async () => {
					for (; i();) {
						let e = a[l++];
						if (!e) return;
						await u(e, 0);
					}
				};
				return await Promise.all(Array.from({ length: Math.min(2, a.length) }, () => d())), {
					status: i() ? n ? "partial" : "success" : "cancelled",
					targetEventIds: s
				};
			})(),
			cancel: () => {
				n = !1, r.forEach((e) => e.cancel());
			}
		};
	}
	repairVisibleRangeRelations(e, t) {
		let n = oa(t.relationKinds ?? da), r = this.repairVisibleRangeChildInteractionsInternal(e, t, {
			includeDirectReplies: n.includes("reply"),
			includeReactions: n.includes("reaction")
		});
		return {
			promise: (async () => {
				let i = await r.promise, a = !1, o = t.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
				return n.includes("quote") && i.status !== "cancelled" && t.isActive?.() !== !1 && o && (await o(e, t), a = !0), {
					...i,
					relationKinds: n,
					quoteRepairApplied: a
				};
			})(),
			cancel: () => r.cancel()
		};
	}
	repairVisibleRangeChildInteractionsInternal(e, t, n) {
		let r = !0, i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = () => r && t.isActive?.() !== !1, s = ma(t.ownerPubkeyHex, t.visiblePosts), c = s.map((e) => e.eventId), l = lt(Lt);
		return {
			promise: (async () => {
				if (s.length === 0) return {
					...fa,
					targetParentEventIds: c
				};
				let r = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), d = 0, f = 0, p = 0, m = !1, h = !1, g = async (s) => {
					let c = [], g = 0, _ = Math.min(2, s.length), v = async () => {
						for (; o();) {
							let _ = s[g++];
							if (!_) return;
							f += 1;
							let v = this.fetchCandidates(e, _.posts, t.relayConfig, n);
							i.add(v);
							let y = await v.promise;
							if (i.delete(v), !o() || y.status === "cancelled") return;
							let b = _.depth === 0 && y.requiresFallback;
							y.status !== "success" && !b && (h = !0), y.requiresFallback && (p += 1, _.depth === 0 ? c.push(...ha(_.posts, 10).map((e) => ({
								posts: e,
								depth: 1
							}))) : y.coverageSaturated && (h = !0));
							let x = n.includeDirectReplies ? this.toDirectReplyItems(_.posts, y.items) : [], S = n.includeReactions ? this.toReactionItems(_.posts.map((e) => ({
								eventId: e.eventId,
								targetAuthorPubkey: e.pubkeyHex,
								targetKind: e.kind
							})), y.items) : [], C = y.status === "success" && !y.coverageSaturated && !(_.depth === 0 && y.requiresFallback);
							if (x.length === 0 && S.length === 0) C && _.posts.forEach((e) => u.add(e.eventId));
							else {
								if (x.length > 0) {
									let n = this.directReplySaveService.saveRepairDirectReplies(e, {
										items: x,
										expectedChildGeneration: await l,
										relayHints: [...this.collectParentRelayHints(_.posts), ...y.relayUrls],
										relayConfig: t.relayConfig,
										fetchedAt: y.fetchedAt,
										isActive: o
									});
									a.add(n);
									let i = await n.promise;
									if (a.delete(n), !o() || i.status === "cancelled") return;
									i.savedParentEventIds.forEach((e) => r.add(e)), d += i.savedDirectReplyCount, m ||= i.deletionConfirmationIncomplete;
								}
								if (S.length > 0) {
									let e = await this.saveReactionInteractions(S, y.fetchedAt, o, await l);
									if (!o()) return;
									e.savedParentEventIds.forEach((e) => r.add(e));
								}
								C && _.posts.forEach((e) => u.add(e.eventId));
							}
						}
					};
					return await Promise.all(Array.from({ length: _ }, () => v())), c;
				}, _ = await g(ga(s, n));
				if (o() && _.length > 0 && await g(_), !o()) return {
					...fa,
					status: "cancelled",
					targetParentEventIds: c,
					attemptedChunkCount: f,
					saturatedChunkCount: p,
					deletionConfirmationIncomplete: m
				};
				let v = c.filter((e) => !u.has(e));
				return {
					status: h || v.length > 0 ? "partial" : "success",
					targetParentEventIds: c,
					checkedParentEventIds: Array.from(u),
					savedParentEventIds: Array.from(r),
					savedDirectReplyCount: d,
					attemptedChunkCount: f,
					saturatedChunkCount: p,
					incompleteParentEventIds: v,
					deletionConfirmationIncomplete: m
				};
			})(),
			cancel: () => {
				r = !1, i.forEach((e) => e.cancel()), a.forEach((e) => e.cancel());
			}
		};
	}
	toDirectReplyItems(e, t) {
		let n = new Map(e.flatMap((e) => {
			let t = vt({
				event: {
					id: e.eventId,
					kind: e.kind,
					tags: e.tags,
					created_at: e.createdAt
				},
				relayHints: [
					...e.relayHints,
					...e.acceptedRelays,
					...e.fetchedRelays ?? []
				]
			});
			return t ? [[e.eventId, t]] : [];
		}));
		return t.flatMap((e) => {
			let t = te(e.event).parentId, r = t ? n.get(t) : null;
			return !t || !r || !It({
				child: e.event,
				parent: r
			}).valid ? [] : [{
				parentEventId: t,
				event: e.event,
				relayUrls: e.relayUrls
			}];
		});
	}
	toReactionItems(e, t) {
		let n = new Map(e.map((e) => [e.eventId, e]));
		return t.flatMap((e) => {
			if (e.event.kind !== 7) return [];
			let t = mt(e.event).reference, r = t ? n.get(t.eventId) : void 0;
			return !t || !r || !ot(t, r) || e.event.id === t.eventId ? [] : [{
				parentEventId: t.eventId,
				event: e.event,
				relayUrls: e.relayUrls,
				reactionTarget: r
			}];
		});
	}
	async saveReactionInteractions(e, t, n, r) {
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = i.get(t.parentEventId) ?? [];
			e.push({
				event: t.event,
				relayUrls: t.relayUrls
			}), i.set(t.parentEventId, e), t.reactionTarget && a.set(t.parentEventId, t.reactionTarget);
		}
		let o = [];
		for (let [e, s] of i.entries()) {
			if (!n()) break;
			let i = a.get(e), c = await this.childInteractionsRepository.upsertChildInteractions({
				parentEventId: e,
				expectedChildGeneration: r,
				events: s,
				fetchedAt: t,
				...i && (i.targetKind != null || i.targetAuthorPubkey != null) ? { reactionTarget: i } : {}
			});
			c.insertedCount + c.updatedCount > 0 && o.push(e);
		}
		return { savedParentEventIds: o };
	}
	fetchCandidates(e, t, n, r) {
		let { destinationRelayUrls: i, coverageRelayUrls: a } = this.resolveRelayPlan(t, n), o = t.map((e) => e.eventId), s = pa(), c = `${s}:0`, l = Je(s), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = 0, _ = !1, v, y, b, x, S, C, w = () => {
			S !== void 0 && (this.clearTimeoutFn(S), S = void 0), v?.unsubscribe?.(), v = void 0, y?.unsubscribe?.(), y = void 0, b?.unsubscribe?.(), b = void 0, x?.unsubscribe?.(), x = void 0;
		}, T = (e) => {
			let t = _a(u), n = new Set(Array.from(d.entries()).filter(([, e]) => e >= 250).map(([e]) => e)), r = a.some((e) => n.has(e)), o = a.length > 0 && a.every((e) => f.has(e));
			return {
				status: e === "cancelled" ? "cancelled" : e === "error" ? "error" : o ? "success" : "partial",
				items: t,
				rawCount: g,
				requiresFallback: n.size > 0,
				coverageSaturated: r,
				fetchedAt: this.now(),
				relayUrls: i,
				eoseRelayUrls: Array.from(f).sort(),
				closedRelayUrls: Array.from(p).sort(),
				errorRelayUrls: Array.from(m).sort(),
				downRelayUrls: Array.from(h).sort(),
				perRelayRawCounts: Array.from(d.entries()).map(([e, t]) => ({
					relayUrl: e,
					rawCount: t
				})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl))
			};
		};
		return {
			promise: new Promise((n) => {
				let s = (e) => {
					_ || (_ = !0, w(), n(T(e)));
				};
				C = s;
				try {
					if (o.length === 0) {
						s("complete");
						return;
					}
					y = e.createAllMessageObservable?.().subscribe({ next: (e) => {
						this.handleCandidateMessagePacket({
							packet: e,
							targetSubId: c,
							destinationRelayUrls: i,
							eoseRelayUrls: f,
							closedRelayUrls: p,
							perRelayRawCounts: d
						});
					} }), b = e.createAllErrorObservable?.().subscribe({ next: (e) => {
						let t = this.sanitizeCandidateRelayUrl(e.from, i);
						t && m.add(t);
					} }), x = e.createConnectionStateObservable?.().subscribe({ next: (e) => {
						let t = this.sanitizeCandidateRelayUrl(e.from, i);
						t && (e.state === "error" || e.state === "rejected" || e.state === "terminated") && h.add(t);
					} }), v = ct(e, l, { on: i.length > 0 ? { relays: i } : { defaultReadRelays: !0 } }).subscribe({
						next: (e) => {
							g += 1;
							let t = this.sanitizeCandidateRelayUrl(e.from, i);
							this.handleCandidatePacket(u, e, t);
						},
						complete: () => s("complete"),
						error: (e) => {
							this.console.error("post_history_visible_child_interaction_repair_fetch_error", e), s("error");
						}
					});
					let n = r.includeDirectReplies ? t.flatMap((e) => e.kind === 1 ? [1, 1111] : e.kind === 42 ? [42] : e.kind === 1111 ? [1111] : []) : [], _ = Array.from(/* @__PURE__ */ new Set([...n, ...r.includeReactions ? [7] : []])).sort((e, t) => e - t);
					l.emit({
						kinds: _,
						"#e": o,
						limit: 250
					}), l.over(), S = this.setTimeoutFn(() => {
						a.length > 0 && a.every((e) => f.has(e)) || this.warnCandidateFetchTimeout(), s("timeout");
					}, ca);
				} catch (e) {
					this.console.error("post_history_visible_child_interaction_repair_request_error", e), s("error");
				}
			}),
			cancel: () => C?.("cancelled")
		};
	}
	warnCandidateFetchTimeout() {
		let e = this.now();
		e - this.lastFetchTimeoutWarnAt < ua || (this.lastFetchTimeoutWarnAt = e, this.console.warn("post_history_visible_child_interaction_repair_fetch_timeout"));
	}
	handleCandidatePacket(e, t, n) {
		let r = t.event;
		if (!r?.id || ![
			1,
			7,
			42,
			1111
		].includes(r.kind)) return;
		let i = e.get(r.id);
		i ? J(i.event, r) ? n && i.relayUrls.add(n) : this.console.warn("post_history_visible_child_interaction_repair_packet_conflict") : e.set(r.id, {
			event: r,
			relayUrls: new Set(n ? [n] : [])
		});
	}
	collectParentRelayHints(e) {
		return e.flatMap((e) => [
			...e.relayHints ?? [],
			...e.acceptedRelays ?? [],
			...e.fetchedRelays ?? []
		]);
	}
	handleCandidateMessagePacket(e) {
		let t = this.sanitizeCandidateRelayUrl(e.packet.from, e.destinationRelayUrls);
		t && (e.packet.type === "EVENT" && e.packet.subId === e.targetSubId ? e.perRelayRawCounts.set(t, (e.perRelayRawCounts.get(t) ?? 0) + 1) : e.packet.type === "EOSE" && e.packet.subId === e.targetSubId ? e.eoseRelayUrls.add(t) : e.packet.type === "CLOSED" && e.packet.subId === e.targetSubId && e.closedRelayUrls.add(t));
	}
	sanitizeCandidateRelayUrl(e, t) {
		let n = q.sanitizeExternalRelayUrls(typeof e == "string" ? [e] : [], { limit: 1 })[0] ?? null;
		return n && t.includes(n) ? n : null;
	}
	resolveRelayPlan(e, t) {
		let n = this.collectParentRelayHints(e), r = Re(n, la);
		if (r !== null) return {
			destinationRelayUrls: r,
			coverageRelayUrls: Be()
		};
		let i = t ? q.sanitizeExternalRelayUrls(q.extractReadRelays(t)) : [], a = t ? q.sanitizeExternalRelayUrls(q.extractWriteRelays(t)) : [], o = q.sanitizeExternalRelayUrls(G), s = i.length > 0 ? i : a.length > 0 ? a : o, c = i.length > 0 ? a.filter((e) => !s.includes(e)) : [], l = q.sanitizeExternalRelayUrls(n, { limit: la });
		return {
			coverageRelayUrls: s,
			destinationRelayUrls: q.sanitizeExternalRelayUrls([
				...s,
				...c,
				...l
			])
		};
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRelatedReactions.svelte.ts
function ya(e) {
	let t = C({}), n = C({}), r = C({}), i = C(0), a = 0, o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map(), l = null, u = e.source ?? "related-card-display", d = e.profileSync.subscribe((t, r) => {
		e.getShow() && A(n, {
			...b(n),
			[t]: r
		});
	}), f = () => {
		A(i, b(i) + 1);
	}, p = () => {
		document.visibilityState === "visible" && A(i, b(i) + 1);
	};
	N(() => {
		if (e.getShow() && typeof window < "u") return window.addEventListener("online", f), document.addEventListener("visibilitychange", p), () => {
			window.removeEventListener("online", f), document.removeEventListener("visibilitychange", p);
		};
	}), L(() => {
		a += 1, l?.cancel(), typeof window < "u" && (window.removeEventListener("online", f), document.removeEventListener("visibilitychange", p)), d();
	});
	function m(e) {
		return b(r)[e] ? ji(b(t)[e] ?? [], b(n)) : null;
	}
	function h(e) {
		return !!b(r)[e];
	}
	N(() => {
		let d = e.getShow(), f = e.getPubkeyHex() ?? "", p = e.getRxNostr(), m = e.getRelayConfig(), h = e.getTargets(), g = b(i);
		if (!d) {
			a += 1, l?.cancel(), l = null, s.clear(), (e.getSessionOpen ?? e.getShow)() || (o.clear(), c.clear(), A(t, {}), A(r, {}));
			return;
		}
		let _ = ++a, v = !0, y = null, x = () => v && _ === a && e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, S = /* @__PURE__ */ new Map();
		for (let e of h) {
			if (!e.eventId) continue;
			let t = S.get(e.eventId);
			S.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...t?.relayHints ?? [], ...e.relayHints])).sort()
			});
		}
		let C = Array.from(S.values()), w = C.map((e) => e.eventId), T = JSON.stringify(Object.entries(m ?? {}).sort(([e], [t]) => e.localeCompare(t))), E = (e) => JSON.stringify([
			e.eventId,
			e.targetAuthorPubkey,
			e.targetKind,
			e.relayHints,
			T
		]), D = (e) => JSON.stringify([E(e), g]), O = new Set(C.map((e) => e.eventId));
		for (let e of c.keys()) O.has(e) || c.delete(e);
		return C.forEach((e) => c.set(e.eventId, D(e))), (async () => {
			let a = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			let d = {};
			for (let e of w) d[e] = a.filter((t) => t.parentEventId === e);
			A(t, {
				...b(t),
				...d
			}), A(r, {
				...b(r),
				...Object.fromEntries(w.map((e) => [e, !0]))
			});
			for (let t of a) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && A(n, {
					...b(n),
					[t.authorPubkey]: r
				});
			}
			if (!p || w.length === 0 || (await Nt({
				source: u,
				parentEventIds: w,
				rxNostr: p,
				relayConfig: m,
				isActive: x
			}), !x())) return;
			let h = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			for (let e of w) d[e] = h.filter((t) => t.parentEventId === e);
			A(t, {
				...b(t),
				...d
			});
			let g = C.filter((e) => !o.has(E(e)) && !s.has(e.eventId));
			if (!g.length) return;
			g.forEach((e) => s.add(e.eventId));
			let _ = new Map(g.map((e) => [e.eventId, D(e)]));
			y = va.repairRelatedCardReactions(p, {
				targets: g,
				relayConfig: m,
				isActive: x
			}), l = y;
			let v = await y.promise.catch(() => ({
				status: "partial",
				targetEventIds: g.map((e) => e.eventId)
			}));
			l === y && (l = null), y = null, g.forEach((e) => s.delete(e.eventId));
			let T = e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, O = g.some((e) => {
				let t = c.get(e.eventId);
				return t !== void 0 && (v.status === "cancelled" || t !== _.get(e.eventId));
			});
			if (T && O && A(i, b(i) + 1), !x() || v.status === "cancelled") return;
			if (v.status === "success") {
				let e = new Set(v.targetEventIds);
				g.filter((t) => e.has(t.eventId)).forEach((e) => o.add(E(e)));
			}
			let k = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			for (let e of w) d[e] = k.filter((t) => t.parentEventId === e);
			A(t, {
				...b(t),
				...d
			});
			for (let t of k) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && A(n, {
					...b(n),
					[t.authorPubkey]: r
				});
			}
			let j = await Nt({
				source: u,
				parentEventIds: w,
				rxNostr: p,
				relayConfig: m,
				isActive: x
			});
			if (x() && j.deletedReactionEventIds.length > 0) {
				let e = await Q.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => Q.getReactionRecords(e, S.get(e))))).flat();
				if (!x()) return;
				for (let t of w) d[t] = e.filter((e) => e.parentEventId === t);
				A(t, {
					...b(t),
					...d
				});
			}
		})().catch(() => void 0), () => {
			v = !1, y?.cancel(), l === y && (l = null);
		};
	});
	async function g(i) {
		let o = a, s = e.getPubkeyHex(), c = e.getRxNostr(), l = e.getTargets().filter((e) => i.includes(e.eventId)), u = await Promise.all(l.map((e) => Q.getReactionRecords(e.eventId, e)));
		o === a && e.getShow() && e.getPubkeyHex() === s && e.getRxNostr() === c && l.forEach((i, a) => {
			A(t, {
				...b(t),
				[i.eventId]: u[a]
			}), A(r, {
				...b(r),
				[i.eventId]: !0
			});
			for (let t of u[a]) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && A(n, {
					...b(n),
					[t.authorPubkey]: r
				});
			}
		});
	}
	function _() {
		a++, l?.cancel(), l = null, s.clear();
	}
	return {
		getReadModel: m,
		isLoaded: h,
		refreshCachedReactions: g,
		suspend: _
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPostActionUiController.svelte.ts
function ba() {
	let e = C(x({})), t = C(!1), n = C(null);
	function r(t) {
		return b(e)[t] ?? !1;
	}
	function i(t, n) {
		A(e, {
			...b(e),
			[t]: n
		}, !0);
	}
	function a() {
		Object.keys(b(e)).length > 0 && A(e, {}, !0);
	}
	function o(e) {
		A(t, e, !0), e || A(n, null);
	}
	function s(e) {
		a(), A(n, e, !0), A(t, !0);
	}
	function c() {
		o(!1);
	}
	function l() {
		A(n, null);
	}
	function u() {
		A(t, !1), A(n, null);
	}
	function d() {
		A(e, {}, !0), u();
	}
	return {
		get deleteConfirmOpen() {
			return b(t);
		},
		get deleteTargetPost() {
			return b(n);
		},
		isPostMenuOpen: r,
		setPostMenuOpen: i,
		closeAllPostItemMenus: a,
		setDeleteConfirmOpen: o,
		openDeleteConfirm: s,
		cancelDeleteConfirm: c,
		clearDeleteTarget: l,
		resetDeleteConfirmation: u,
		reset: d
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postDeletionService.ts
var xa = [
	1,
	6,
	16,
	42,
	1111
];
function Sa() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Ca(e, t) {
	return !t || e.pubkeyHex !== t || typeof e.deletedAt == "number" ? !1 : xa.includes(e.kind) && typeof e.eventId == "string" && e.eventId.length > 0;
}
function wa(e, t = Math.floor(Date.now() / 1e3), n) {
	let r = [["e", e.eventId], ["k", String(e.kind)]];
	return n && r.push(["e", n], ["k", "36"]), {
		kind: 5,
		pubkey: e.pubkeyHex,
		content: "",
		tags: r,
		created_at: t
	};
}
function Ta(e, t, n) {
	return q.sanitizeExternalRelayUrls([
		...e.acceptedRelays ?? [],
		...e.fetchedRelays ?? [],
		...e.relayHints ?? [],
		...e.kind === 42 ? e.channelRelayHints ?? [] : [],
		...n?.acceptedRelays ?? [],
		...n?.fetchedRelays ?? [],
		...t
	]);
}
var Ea = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			authStateStore: e.authStateStore ?? Ie,
			keyManager: e.keyManager ?? Ke,
			window: e.window ?? (typeof window < "u" ? window : {}),
			console: e.console ?? (globalThis.console === void 0 ? Sa() : globalThis.console),
			seckeySignerFn: e.seckeySignerFn ?? Fe,
			getNip46SignerForSessionFn: e.getNip46SignerForSessionFn ?? ((e) => qe.getSignerForSession(e)),
			getParentClientSignerFn: e.getParentClientSignerFn ?? (() => Pe.getSigner()),
			writeRelaysStore: e.writeRelaysStore ?? Le,
			postHistoryDeletionRequestsRepository: e.postHistoryDeletionRequestsRepository ?? Et,
			eventSenderFactory: e.eventSenderFactory,
			sensitivePayloadRepository: e.sensitivePayloadRepository ?? gt,
			fetchPayloadFn: e.fetchPayloadFn ?? Tt.fetchEventById.bind(Tt),
			saveSensitivePayloadFn: e.saveSensitivePayloadFn ?? gt.putCandidate.bind(gt),
			now: e.now ?? Date.now,
			storeSignedEventsFn: e.storeSignedEventsFn ?? (() => void 0)
		};
	}
	async requestDeletion(e) {
		let t = this.deps.authStateStore.value, n = t.pubkey || null;
		if (!e.rxNostr) return {
			success: !1,
			error: "nostr_not_ready"
		};
		if (!t.isAuthenticated || !n) return {
			success: !1,
			error: "pubkey_not_found"
		};
		if (ze() && q.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value).length === 0) return {
			success: !1,
			error: "no_write_relays"
		};
		let r = () => je(this.deps.authStateStore, n);
		if (!Ca(e.post, n)) return {
			success: !1,
			error: "deletion_request_not_allowed"
		};
		let i;
		if (t.type === "nip46") try {
			r(), i = await this.deps.getNip46SignerForSessionFn(n);
			let e = this.deps.authStateStore.value;
			if (!i || !e.isAuthenticated || e.type !== "nip46" || e.pubkey !== n) return {
				success: !1,
				error: "nip46_signer_not_available"
			};
		} catch {
			return this.deps.console.error("post_deletion_nip46_signer_failed", {
				stage: "resolve-signer",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		let a = this.resolveSigner(t, i);
		if (a.error) return {
			success: !1,
			error: a.error
		};
		try {
			r();
		} catch {
			return {
				success: !1,
				error: "post_error"
			};
		}
		let o = await this.resolveAssociatedPayload(e.post, e.rxNostr), s = it(e.post.rawEvent) && !!et(e.post.rawEvent) && !o, c = wa(e.post, Math.floor(this.deps.now() / 1e3), o?.id), l;
		try {
			r();
			let e = Ne(c), t = await a.signEvent(e.signerTemplate);
			r(), l = Me(e.expectedTemplate, t, n), r();
		} catch {
			return this.deps.console.error("post_deletion_sign_failed", {
				stage: "sign-event",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		let u = pt(l);
		if (!u) return {
			success: !1,
			error: "post_error"
		};
		let d = Ta(e.post, this.deps.writeRelaysStore.value, o), f;
		try {
			r(), f = await this.createEventSender(e.rxNostr).sendEvent(u.event, {
				targetRelays: d,
				includeDefaultWriteRelays: !0
			});
		} catch {
			return this.deps.console.error("post_deletion_send_failed", {
				stage: "publish",
				reason: "unexpected"
			}), {
				success: !1,
				error: "post_error"
			};
		}
		if (!f.success) return f;
		try {
			Promise.resolve(this.deps.storeSignedEventsFn([u], () => this.deps.authStateStore.value === t && t.isAuthenticated)).catch(() => void 0);
		} catch {}
		let p = u.event.id ?? f.eventId;
		if (!p) return {
			success: !1,
			error: "post_error"
		};
		let m = this.deps.now();
		try {
			await this.deps.postHistoryDeletionRequestsRepository.saveLocalDeletion({
				targetEvent: it(e.post.rawEvent) ? e.post.rawEvent : void 0,
				targetEventIds: c.tags.filter((e) => e[0] === "e").map((e) => e[1]),
				deletionEvent: u.event,
				attestation: u.attestation,
				deletedAt: m,
				relayUrls: d
			});
		} catch {
			this.deps.console.warn("post_history_local_deletion_save_failed", {
				stage: "post-history",
				reason: "unexpected"
			});
		}
		return {
			...f,
			eventId: p,
			deletionEventId: p,
			deletionEvent: u.event,
			deletionEventAttestation: u.attestation,
			deletedAt: m,
			...s ? { sensitivePayloadOmitted: !0 } : {}
		};
	}
	createEventSender(e) {
		return this.deps.eventSenderFactory ? this.deps.eventSenderFactory(e, this.deps.console) : new Ye(e, this.deps.console);
	}
	async resolveAssociatedPayload(e, t) {
		let n = e.rawEvent;
		if (!it(n)) return;
		let r = et(n);
		if (!r || n.id !== e.eventId || n.pubkey !== e.pubkeyHex) return;
		let i;
		try {
			[i] = await this.deps.sensitivePayloadRepository.getByIds([r.eventId]);
		} catch {
			return;
		}
		if (i?.deletedAt !== void 0) return;
		if (!i) {
			let a = await at(Lt, e.pubkeyHex), o = this.deps.fetchPayloadFn(t, {
				eventId: r.eventId,
				relayHints: q.sanitizeExternalRelayUrls([
					...r.relayHint ? [r.relayHint] : [],
					...e.acceptedRelays ?? [],
					...e.fetchedRelays ?? [],
					...e.relayHints ?? []
				]),
				relayConfig: Ve.value
			});
			try {
				let t = await o.promise;
				if (!t.event || !$e(n, t.event, r.eventId)) return;
				let s = q.sanitizeExternalRelayUrls(t.relayUrl ? [t.relayUrl] : []);
				try {
					await this.deps.saveSensitivePayloadFn({
						event: t.event,
						fetchedRelays: s,
						localWriteScope: {
							ownerPubkeyHex: e.pubkeyHex,
							expectedRevision: a,
							isActive: () => !0
						}
					});
				} catch {
					this.deps.console.warn("sensitive_payload_cache_save_failed", {
						stage: "deletion",
						reason: "storage"
					});
				}
				if ([i] = await this.deps.sensitivePayloadRepository.getByIds([r.eventId]), i?.deletedAt !== void 0) return;
				if (!i) return {
					id: t.event.id,
					fetchedRelays: s
				};
			} catch {
				return;
			} finally {
				o.cancel();
			}
		}
		let a = i.rawEvent;
		if ($e(n, a, r.eventId)) return {
			id: r.eventId,
			acceptedRelays: i.acceptedRelays,
			fetchedRelays: i.fetchedRelays
		};
	}
	resolveSigner(e, t) {
		if (e.type === "nip07") {
			let e = this.deps.window.nostr?.signEvent;
			return typeof e == "function" ? { signEvent: e.bind(this.deps.window.nostr) } : { error: "nostr_sign_event_not_supported" };
		}
		if (e.type === "nip46") return this.resolveExternalSigner(t, "nip46_signer_not_available");
		if (e.type === "parentClient") return this.resolveExternalSigner(this.deps.getParentClientSignerFn(), "parent_client_signer_not_available");
		let n = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(e.pubkey);
		return n ? this.resolveExternalSigner(this.deps.seckeySignerFn(n), "nostr_sign_event_not_supported") : { error: "key_not_found" };
	}
	resolveExternalSigner(e, t) {
		return e ? typeof e.signEvent == "function" ? { signEvent: e.signEvent.bind(e) } : { error: "nostr_sign_event_not_supported" } : { error: t };
	}
}({ storeSignedEventsFn: (e, t) => Mt.storeSignedEventsBestEffort(e, t) });
// D:/ドキュメント/GitHub/ehagaki/src/lib/postBroadcastService.ts
function Da() {
	return {
		log: () => void 0,
		warn: () => void 0,
		error: () => void 0
	};
}
function Oa(e) {
	let t = e.rawEvent;
	if (!t || typeof t != "object") return null;
	let n = t;
	return typeof n.id != "string" || typeof n.pubkey != "string" || typeof n.created_at != "number" || typeof n.kind != "number" || !Array.isArray(n.tags) || typeof n.content != "string" || typeof n.sig != "string" ? null : n;
}
var ka = new class {
	deps;
	constructor(e = {}) {
		this.deps = {
			writeRelaysStore: e.writeRelaysStore ?? Le,
			console: e.console ?? (globalThis.console === void 0 ? Da() : globalThis.console)
		};
	}
	async broadcast(e) {
		if (!e.rxNostr) return {
			success: !1,
			error: "nostr_not_ready"
		};
		let t = e.rxNostr, n = Oa(e.post);
		if (!n) return {
			success: !1,
			error: "invalid_event"
		};
		let r = q.sanitizeExternalRelayUrls(this.deps.writeRelaysStore.value);
		return r.length === 0 ? {
			success: !1,
			error: "no_write_relays"
		} : new Ye(t, this.deps.console).sendEvent(n, {
			targetRelays: r,
			includeDefaultWriteRelays: !1
		});
	}
}();
export { zr as A, ir as B, ti as C, Br as D, Lr as E, Mr as F, cn as G, Qn as H, wr as I, ln as K, hr as L, Vr as M, Hr as N, Ur as O, Nr as P, fr as R, ei as S, qr as T, Zn as U, tr as V, Jn as W, Si as _, ba as a, li as b, aa as c, Qi as d, Yi as f, Ai as g, ji as h, Ea as i, Gr as j, Wr as k, sa as l, Ci as m, Oa as n, ya as o, Hi as p, Ca as r, va as s, ka as t, $i as u, xi as v, Qr as w, ii as x, _i as y, sr as z };
