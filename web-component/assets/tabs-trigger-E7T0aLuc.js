import { Et as e, G as t, J as n, K as r, Mt as i, Nt as a, P as o, Tt as s, W as c, _ as l, ct as u, dt as d, gt as f, i as p, mt as m, nt as h, r as g, ut as _, vt as v, xt as y, z as b } from "./index-client-XkLzkVYC.js";
import { $ as x, B as S, F as C, M as w, P as T, Q as E, X as D, et as O, j as k, o as A, s as j, st as M } from "./LoadingPlaceholder-lit91akO.js";
import { t as N } from "./roving-focus-group-Dam_0Ov6.js";
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
	#e = v(m([]));
	get triggerIds() {
		return h(this.#e);
	}
	set triggerIds(e) {
		f(this.#e, e, !0);
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
	#t = y(() => ({
		id: this.opts.id.current,
		"data-orientation": this.opts.orientation.current,
		[P.root]: "",
		...this.attachment
	}));
	get props() {
		return h(this.#t);
	}
	set props(e) {
		f(this.#t, e);
	}
}, L = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = y(() => this.root.opts.disabled.current);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref);
	}
	#t = y(() => ({
		id: this.opts.id.current,
		role: "tablist",
		"aria-orientation": this.root.opts.orientation.current,
		"data-orientation": this.root.opts.orientation.current,
		[P.list]: "",
		"data-disabled": k(h(this.#e)),
		...this.attachment
	}));
	get props() {
		return h(this.#t);
	}
	set props(e) {
		f(this.#t, e);
	}
}, R = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = v(0);
	#t = y(() => this.root.opts.value.current === this.opts.value.current);
	#n = y(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#r = y(() => this.root.valueToContentId.get(this.opts.value.current));
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref), D([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerTrigger(e, t)), u(() => {
			this.root.triggerIds.length, h(this.#t) || !this.root.opts.value.current ? f(this.#e, 0) : f(this.#e, -1);
		}), this.onfocus = this.onfocus.bind(this), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
	}
	#i() {
		this.root.opts.value.current !== this.opts.value.current && this.root.setValue(this.opts.value.current);
	}
	onfocus(e) {
		this.root.opts.activationMode.current !== "automatic" || h(this.#n) || this.#i();
	}
	onclick(e) {
		h(this.#n) || this.#i();
	}
	onkeydown(e) {
		h(this.#n) || (e.key === " " || e.key === "Enter" ? (e.preventDefault(), this.#i()) : this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e));
	}
	#a = y(() => ({
		id: this.opts.id.current,
		role: "tab",
		"data-state": B(h(this.#t)),
		"data-value": this.opts.value.current,
		"data-orientation": this.root.opts.orientation.current,
		"data-disabled": k(h(this.#n)),
		"aria-selected": w(h(this.#t)),
		"aria-controls": h(this.#r),
		[P.trigger]: "",
		disabled: T(h(this.#n)),
		tabindex: h(this.#e),
		onclick: this.onclick,
		onfocus: this.onfocus,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return h(this.#a);
	}
	set props(e) {
		f(this.#a, e);
	}
}, z = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = y(() => this.root.opts.value.current === this.opts.value.current);
	#t = y(() => this.root.valueToTriggerId.get(this.opts.value.current));
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref), D([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerContent(e, t));
	}
	#n = y(() => ({
		id: this.opts.id.current,
		role: "tabpanel",
		hidden: T(!h(this.#e)),
		tabindex: this.opts.tabindex.current,
		"data-value": this.opts.value.current,
		"data-state": B(h(this.#e)),
		"aria-labelledby": h(this.#t),
		"data-orientation": this.root.opts.orientation.current,
		[P.content]: "",
		...this.attachment
	}));
	get props() {
		return h(this.#n);
	}
	set props(e) {
		f(this.#n, e);
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
]), H = r("<div><!></div>");
function U(r, u) {
	let f = n();
	e(u, !0);
	let m = g(u, "id", 19, () => A(f)), v = g(u, "ref", 15, null), x = g(u, "value", 15, ""), S = g(u, "onValueChange", 3, j), C = g(u, "orientation", 3, "horizontal"), w = g(u, "loop", 3, !0), T = g(u, "activationMode", 3, "automatic"), E = g(u, "disabled", 3, !1), D = p(u, V), k = I.create({
		id: M(() => m()),
		value: M(() => x(), (e) => {
			x(e), S()(e);
		}),
		orientation: M(() => C()),
		loop: M(() => w()),
		activationMode: M(() => T()),
		disabled: M(() => E()),
		ref: M(() => v(), (e) => v(e))
	}), N = y(() => O(D, k.props));
	var P = t(), F = d(P), L = (e) => {
		var n = t(), r = d(n);
		o(r, () => u.child, () => ({ props: h(N) })), c(e, n);
	}, R = (e) => {
		var t = H();
		l(t, () => ({ ...h(N) }));
		var n = _(t);
		o(n, () => u.children ?? a), i(t), c(e, t);
	};
	b(F, (e) => {
		u.child ? e(L) : e(R, -1);
	}), c(r, P), s();
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
]), G = r("<div><!></div>");
function K(r, u) {
	let f = n();
	e(u, !0);
	let m = g(u, "id", 19, () => A(f)), v = g(u, "ref", 15, null), x = g(u, "tabindex", 3, 0), S = p(u, W), C = z.create({
		value: M(() => u.value),
		tabindex: M(() => x() ?? 0),
		id: M(() => m()),
		ref: M(() => v(), (e) => v(e))
	}), w = y(() => O(S, C.props));
	var T = t(), E = d(T), D = (e) => {
		var n = t(), r = d(n);
		o(r, () => u.child, () => ({ props: h(w) })), c(e, n);
	}, k = (e) => {
		var t = G();
		l(t, () => ({ ...h(w) }));
		var n = _(t);
		o(n, () => u.children ?? a), i(t), c(e, t);
	};
	b(E, (e) => {
		u.child ? e(D) : e(k, -1);
	}), c(r, T), s();
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
]), J = r("<div><!></div>");
function Y(r, u) {
	let f = n();
	e(u, !0);
	let m = g(u, "id", 19, () => A(f)), v = g(u, "ref", 15, null), x = p(u, q), S = L.create({
		id: M(() => m()),
		ref: M(() => v(), (e) => v(e))
	}), C = y(() => O(x, S.props));
	var w = t(), T = d(w), E = (e) => {
		var n = t(), r = d(n);
		o(r, () => u.child, () => ({ props: h(C) })), c(e, n);
	}, D = (e) => {
		var t = J();
		l(t, () => ({ ...h(C) }));
		var n = _(t);
		o(n, () => u.children ?? a), i(t), c(e, t);
	};
	b(T, (e) => {
		u.child ? e(E) : e(D, -1);
	}), c(r, w), s();
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
]), Z = r("<button><!></button>");
function Q(r, u) {
	let f = n();
	e(u, !0);
	let m = g(u, "disabled", 3, !1), v = g(u, "id", 19, () => A(f)), x = g(u, "type", 3, "button"), S = g(u, "ref", 15, null), C = p(u, X), w = R.create({
		id: M(() => v()),
		disabled: M(() => m() ?? !1),
		value: M(() => u.value),
		ref: M(() => S(), (e) => S(e))
	}), T = y(() => O(C, w.props, { type: x() }));
	var E = t(), D = d(E), k = (e) => {
		var n = t(), r = d(n);
		o(r, () => u.child, () => ({ props: h(T) })), c(e, n);
	}, j = (e) => {
		var t = Z();
		l(t, () => ({ ...h(T) }));
		var n = _(t);
		o(n, () => u.children ?? a), i(t), c(e, t);
	};
	b(D, (e) => {
		u.child ? e(k) : e(j, -1);
	}), c(r, E), s();
}
export { U as i, Y as n, K as r, Q as t };
