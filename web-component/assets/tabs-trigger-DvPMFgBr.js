import { G as e, Mt as t, N as n, R as r, Tt as i, U as a, W as o, _t as s, bt as c, g as l, ht as u, i as d, jt as f, lt as p, pt as m, q as h, r as g, st as _, tt as v, ut as y, wt as b } from "./index-client-57Odq85c.js";
import { $ as x, B as S, F as C, M as w, P as T, Q as E, X as D, et as O, j as k, o as A, s as j, st as M } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { t as N } from "./roving-focus-group-Lr_W2Xj3.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tabs/tabs.svelte.js
var P = C({
	component: "tabs",
	parts: [
		"root",
		"list",
		"trigger",
		"content"
	]
}), F = new E("Tabs.Root"), I = class e {
	static create(t) {
		return F.set(new e(t));
	}
	opts;
	attachment;
	rovingFocusGroup;
	#e = s(m([]));
	get triggerIds() {
		return v(this.#e);
	}
	set triggerIds(e) {
		u(this.#e, e, !0);
	}
	valueToTriggerId = new x();
	valueToContentId = new x();
	constructor(e) {
		this.opts = e, this.attachment = S(e.ref), this.rovingFocusGroup = new N({
			candidateAttr: P.trigger,
			rootAttr: P.root,
			rootNode: this.opts.ref,
			loop: this.opts.loop,
			orientation: this.opts.orientation
		});
	}
	registerTrigger(e, t) {
		return this.triggerIds.push(e), this.valueToTriggerId.set(t, e), () => {
			this.triggerIds = this.triggerIds.filter((t) => t !== e), this.valueToTriggerId.delete(t);
		};
	}
	registerContent(e, t) {
		return this.valueToContentId.set(t, e), () => {
			this.valueToContentId.delete(t);
		};
	}
	setValue(e) {
		this.opts.value.current = e;
	}
	#t = c(() => ({
		id: this.opts.id.current,
		"data-orientation": this.opts.orientation.current,
		[P.root]: "",
		...this.attachment
	}));
	get props() {
		return v(this.#t);
	}
	set props(e) {
		u(this.#t, e);
	}
}, L = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = c(() => this.root.opts.disabled.current);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref);
	}
	#t = c(() => ({
		id: this.opts.id.current,
		role: "tablist",
		"aria-orientation": this.root.opts.orientation.current,
		"data-orientation": this.root.opts.orientation.current,
		[P.list]: "",
		"data-disabled": k(v(this.#e)),
		...this.attachment
	}));
	get props() {
		return v(this.#t);
	}
	set props(e) {
		u(this.#t, e);
	}
}, R = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = s(0);
	#t = c(() => this.root.opts.value.current === this.opts.value.current);
	#n = c(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#r = c(() => this.root.valueToContentId.get(this.opts.value.current));
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref), D([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerTrigger(e, t)), _(() => {
			this.root.triggerIds.length, v(this.#t) || !this.root.opts.value.current ? u(this.#e, 0) : u(this.#e, -1);
		}), this.onfocus = this.onfocus.bind(this), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
	}
	#i() {
		this.root.opts.value.current !== this.opts.value.current && this.root.setValue(this.opts.value.current);
	}
	onfocus(e) {
		this.root.opts.activationMode.current !== "automatic" || v(this.#n) || this.#i();
	}
	onclick(e) {
		v(this.#n) || this.#i();
	}
	onkeydown(e) {
		v(this.#n) || (e.key === " " || e.key === "Enter" ? (e.preventDefault(), this.#i()) : this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e));
	}
	#a = c(() => ({
		id: this.opts.id.current,
		role: "tab",
		"data-state": B(v(this.#t)),
		"data-value": this.opts.value.current,
		"data-orientation": this.root.opts.orientation.current,
		"data-disabled": k(v(this.#n)),
		"aria-selected": w(v(this.#t)),
		"aria-controls": v(this.#r),
		[P.trigger]: "",
		disabled: T(v(this.#n)),
		tabindex: v(this.#e),
		onclick: this.onclick,
		onfocus: this.onfocus,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return v(this.#a);
	}
	set props(e) {
		u(this.#a, e);
	}
}, z = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = c(() => this.root.opts.value.current === this.opts.value.current);
	#t = c(() => this.root.valueToTriggerId.get(this.opts.value.current));
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref), D([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerContent(e, t));
	}
	#n = c(() => ({
		id: this.opts.id.current,
		role: "tabpanel",
		hidden: T(!v(this.#e)),
		tabindex: this.opts.tabindex.current,
		"data-value": this.opts.value.current,
		"data-state": B(v(this.#e)),
		"aria-labelledby": v(this.#t),
		"data-orientation": this.root.opts.orientation.current,
		[P.content]: "",
		...this.attachment
	}));
	get props() {
		return v(this.#n);
	}
	set props(e) {
		u(this.#n, e);
	}
};
function B(e) {
	return e ? "active" : "inactive";
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tabs/components/tabs.svelte
var V = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"value",
	"onValueChange",
	"orientation",
	"loop",
	"activationMode",
	"disabled",
	"children",
	"child"
]), H = e("<div><!></div>");
function U(e, s) {
	let u = h();
	i(s, !0);
	let m = g(s, "id", 19, () => A(u)), _ = g(s, "ref", 15, null), x = g(s, "value", 15, ""), S = g(s, "onValueChange", 3, j), C = g(s, "orientation", 3, "horizontal"), w = g(s, "loop", 3, !0), T = g(s, "activationMode", 3, "automatic"), E = g(s, "disabled", 3, !1), D = d(s, V), k = I.create({
		id: M(() => m()),
		value: M(() => x(), (e) => {
			x(e), S()(e);
		}),
		orientation: M(() => C()),
		loop: M(() => w()),
		activationMode: M(() => T()),
		disabled: M(() => E()),
		ref: M(() => _(), (e) => _(e))
	}), N = c(() => O(D, k.props));
	var P = o(), F = y(P), L = (e) => {
		var t = o(), r = y(t);
		n(r, () => s.child, () => ({ props: v(N) })), a(e, t);
	}, R = (e) => {
		var r = H();
		l(r, () => ({ ...v(N) }));
		var i = p(r);
		n(i, () => s.children ?? t), f(r), a(e, r);
	};
	r(F, (e) => {
		s.child ? e(L) : e(R, -1);
	}), a(e, P), b();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tabs/components/tabs-content.svelte
var W = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref",
	"value",
	"tabindex"
]), G = e("<div><!></div>");
function K(e, s) {
	let u = h();
	i(s, !0);
	let m = g(s, "id", 19, () => A(u)), _ = g(s, "ref", 15, null), x = g(s, "tabindex", 3, 0), S = d(s, W), C = z.create({
		value: M(() => s.value),
		tabindex: M(() => x() ?? 0),
		id: M(() => m()),
		ref: M(() => _(), (e) => _(e))
	}), w = c(() => O(S, C.props));
	var T = o(), E = y(T), D = (e) => {
		var t = o(), r = y(t);
		n(r, () => s.child, () => ({ props: v(w) })), a(e, t);
	}, k = (e) => {
		var r = G();
		l(r, () => ({ ...v(w) }));
		var i = p(r);
		n(i, () => s.children ?? t), f(r), a(e, r);
	};
	r(E, (e) => {
		s.child ? e(D) : e(k, -1);
	}), a(e, T), b();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tabs/components/tabs-list.svelte
var q = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"id",
	"ref"
]), J = e("<div><!></div>");
function Y(e, s) {
	let u = h();
	i(s, !0);
	let m = g(s, "id", 19, () => A(u)), _ = g(s, "ref", 15, null), x = d(s, q), S = L.create({
		id: M(() => m()),
		ref: M(() => _(), (e) => _(e))
	}), C = c(() => O(x, S.props));
	var w = o(), T = y(w), E = (e) => {
		var t = o(), r = y(t);
		n(r, () => s.child, () => ({ props: v(C) })), a(e, t);
	}, D = (e) => {
		var r = J();
		l(r, () => ({ ...v(C) }));
		var i = p(r);
		n(i, () => s.children ?? t), f(r), a(e, r);
	};
	r(T, (e) => {
		s.child ? e(E) : e(D, -1);
	}), a(e, w), b();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tabs/components/tabs-trigger.svelte
var X = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"disabled",
	"id",
	"type",
	"value",
	"ref"
]), Z = e("<button><!></button>");
function Q(e, s) {
	let u = h();
	i(s, !0);
	let m = g(s, "disabled", 3, !1), _ = g(s, "id", 19, () => A(u)), x = g(s, "type", 3, "button"), S = g(s, "ref", 15, null), C = d(s, X), w = R.create({
		id: M(() => _()),
		disabled: M(() => m() ?? !1),
		value: M(() => s.value),
		ref: M(() => S(), (e) => S(e))
	}), T = c(() => O(C, w.props, { type: x() }));
	var E = o(), D = y(E), k = (e) => {
		var t = o(), r = y(t);
		n(r, () => s.child, () => ({ props: v(T) })), a(e, t);
	}, j = (e) => {
		var r = Z();
		l(r, () => ({ ...v(T) }));
		var i = p(r);
		n(i, () => s.children ?? t), f(r), a(e, r);
	};
	r(D, (e) => {
		s.child ? e(k) : e(j, -1);
	}), a(e, E), b();
}
export { U as i, Y as n, K as r, Q as t };
