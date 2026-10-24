import { At as e, Ct as t, G as n, K as r, N as i, R as a, U as o, W as s, ct as c, et as l, ft as u, g as d, gt as f, i as p, jt as m, lt as h, mt as g, ot as _, r as v, wt as y, yt as b } from "./index-client-Bdka-Daw.js";
import { $ as x, B as S, F as C, M as w, P as T, Q as E, X as D, et as O, j as k, o as A, s as j, st as M } from "./LoadingPlaceholder-j1_vRYno.js";
import { t as N } from "./roving-focus-group-DIgmMOCR.js";
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
	#e = f(u([]));
	get triggerIds() {
		return l(this.#e);
	}
	set triggerIds(e) {
		g(this.#e, e, !0);
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
	#t = b(() => ({
		id: this.opts.id.current,
		"data-orientation": this.opts.orientation.current,
		[P.root]: "",
		...this.attachment
	}));
	get props() {
		return l(this.#t);
	}
	set props(e) {
		g(this.#t, e);
	}
}, L = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = b(() => this.root.opts.disabled.current);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref);
	}
	#t = b(() => ({
		id: this.opts.id.current,
		role: "tablist",
		"aria-orientation": this.root.opts.orientation.current,
		"data-orientation": this.root.opts.orientation.current,
		[P.list]: "",
		"data-disabled": k(l(this.#e)),
		...this.attachment
	}));
	get props() {
		return l(this.#t);
	}
	set props(e) {
		g(this.#t, e);
	}
}, R = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = f(0);
	#t = b(() => this.root.opts.value.current === this.opts.value.current);
	#n = b(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#r = b(() => this.root.valueToContentId.get(this.opts.value.current));
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref), D([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerTrigger(e, t)), _(() => {
			this.root.triggerIds.length, l(this.#t) || !this.root.opts.value.current ? g(this.#e, 0) : g(this.#e, -1);
		}), this.onfocus = this.onfocus.bind(this), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
	}
	#i() {
		this.root.opts.value.current !== this.opts.value.current && this.root.setValue(this.opts.value.current);
	}
	onfocus(e) {
		this.root.opts.activationMode.current !== "automatic" || l(this.#n) || this.#i();
	}
	onclick(e) {
		l(this.#n) || this.#i();
	}
	onkeydown(e) {
		l(this.#n) || (e.key === " " || e.key === "Enter" ? (e.preventDefault(), this.#i()) : this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e));
	}
	#a = b(() => ({
		id: this.opts.id.current,
		role: "tab",
		"data-state": B(l(this.#t)),
		"data-value": this.opts.value.current,
		"data-orientation": this.root.opts.orientation.current,
		"data-disabled": k(l(this.#n)),
		"aria-selected": w(l(this.#t)),
		"aria-controls": l(this.#r),
		[P.trigger]: "",
		disabled: T(l(this.#n)),
		tabindex: l(this.#e),
		onclick: this.onclick,
		onfocus: this.onfocus,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return l(this.#a);
	}
	set props(e) {
		g(this.#a, e);
	}
}, z = class e {
	static create(t) {
		return new e(t, F.get());
	}
	opts;
	root;
	attachment;
	#e = b(() => this.root.opts.value.current === this.opts.value.current);
	#t = b(() => this.root.valueToTriggerId.get(this.opts.value.current));
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = S(e.ref), D([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerContent(e, t));
	}
	#n = b(() => ({
		id: this.opts.id.current,
		role: "tabpanel",
		hidden: T(!l(this.#e)),
		tabindex: this.opts.tabindex.current,
		"data-value": this.opts.value.current,
		"data-state": B(l(this.#e)),
		"aria-labelledby": l(this.#t),
		"data-orientation": this.root.opts.orientation.current,
		[P.content]: "",
		...this.attachment
	}));
	get props() {
		return l(this.#n);
	}
	set props(e) {
		g(this.#n, e);
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
]), H = n("<div><!></div>");
function U(n, u) {
	let f = r();
	y(u, !0);
	let g = v(u, "id", 19, () => A(f)), _ = v(u, "ref", 15, null), x = v(u, "value", 15, ""), S = v(u, "onValueChange", 3, j), C = v(u, "orientation", 3, "horizontal"), w = v(u, "loop", 3, !0), T = v(u, "activationMode", 3, "automatic"), E = v(u, "disabled", 3, !1), D = p(u, V), k = I.create({
		id: M(() => g()),
		value: M(() => x(), (e) => {
			x(e), S()(e);
		}),
		orientation: M(() => C()),
		loop: M(() => w()),
		activationMode: M(() => T()),
		disabled: M(() => E()),
		ref: M(() => _(), (e) => _(e))
	}), N = b(() => O(D, k.props));
	var P = s(), F = h(P), L = (e) => {
		var t = s(), n = h(t);
		i(n, () => u.child, () => ({ props: l(N) })), o(e, t);
	}, R = (t) => {
		var n = H();
		d(n, () => ({ ...l(N) }));
		var r = c(n);
		i(r, () => u.children ?? m), e(n), o(t, n);
	};
	a(F, (e) => {
		u.child ? e(L) : e(R, -1);
	}), o(n, P), t();
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
]), G = n("<div><!></div>");
function K(n, u) {
	let f = r();
	y(u, !0);
	let g = v(u, "id", 19, () => A(f)), _ = v(u, "ref", 15, null), x = v(u, "tabindex", 3, 0), S = p(u, W), C = z.create({
		value: M(() => u.value),
		tabindex: M(() => x() ?? 0),
		id: M(() => g()),
		ref: M(() => _(), (e) => _(e))
	}), w = b(() => O(S, C.props));
	var T = s(), E = h(T), D = (e) => {
		var t = s(), n = h(t);
		i(n, () => u.child, () => ({ props: l(w) })), o(e, t);
	}, k = (t) => {
		var n = G();
		d(n, () => ({ ...l(w) }));
		var r = c(n);
		i(r, () => u.children ?? m), e(n), o(t, n);
	};
	a(E, (e) => {
		u.child ? e(D) : e(k, -1);
	}), o(n, T), t();
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
]), J = n("<div><!></div>");
function Y(n, u) {
	let f = r();
	y(u, !0);
	let g = v(u, "id", 19, () => A(f)), _ = v(u, "ref", 15, null), x = p(u, q), S = L.create({
		id: M(() => g()),
		ref: M(() => _(), (e) => _(e))
	}), C = b(() => O(x, S.props));
	var w = s(), T = h(w), E = (e) => {
		var t = s(), n = h(t);
		i(n, () => u.child, () => ({ props: l(C) })), o(e, t);
	}, D = (t) => {
		var n = J();
		d(n, () => ({ ...l(C) }));
		var r = c(n);
		i(r, () => u.children ?? m), e(n), o(t, n);
	};
	a(T, (e) => {
		u.child ? e(E) : e(D, -1);
	}), o(n, w), t();
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
]), Z = n("<button><!></button>");
function Q(n, u) {
	let f = r();
	y(u, !0);
	let g = v(u, "disabled", 3, !1), _ = v(u, "id", 19, () => A(f)), x = v(u, "type", 3, "button"), S = v(u, "ref", 15, null), C = p(u, X), w = R.create({
		id: M(() => _()),
		disabled: M(() => g() ?? !1),
		value: M(() => u.value),
		ref: M(() => S(), (e) => S(e))
	}), T = b(() => O(C, w.props, { type: x() }));
	var E = s(), D = h(E), k = (e) => {
		var t = s(), n = h(t);
		i(n, () => u.child, () => ({ props: l(T) })), o(e, t);
	}, j = (t) => {
		var n = Z();
		d(n, () => ({ ...l(T) }));
		var r = c(n);
		i(r, () => u.children ?? m), e(n), o(t, n);
	};
	a(D, (e) => {
		u.child ? e(k) : e(j, -1);
	}), o(n, E), t();
}
export { U as i, Y as n, K as r, Q as t };
