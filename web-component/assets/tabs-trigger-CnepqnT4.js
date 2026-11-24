import { B as e, Dt as t, Et as n, F as r, G as i, K as a, Nt as o, Pt as s, St as c, Y as l, _t as u, dt as d, ft as f, ht as p, i as m, lt as h, q as g, r as _, rt as v, v as y, yt as b } from "./index-client-DEFG3Gqk.js";
import { F as x, G as S, I as C, N as w, R as T, T as E, _ as D, b as O, g as k, r as A, y as j } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as M } from "./roving-focus-group-DTahsFoe.js";
import { i as N } from "./use-id-DCa3fCKD.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/tabs/tabs.svelte.js
var P = O({
	component: "tabs",
	parts: [
		"root",
		"list",
		"trigger",
		"content"
	]
}), F = new x("Tabs.Root"), I = class e {
	static create(t) {
		return F.set(new e(t));
	}
	opts;
	attachment;
	rovingFocusGroup;
	#e = b(p([]));
	get triggerIds() {
		return v(this.#e);
	}
	set triggerIds(e) {
		u(this.#e, e, !0);
	}
	valueToTriggerId = new C();
	valueToContentId = new C();
	constructor(e) {
		this.opts = e, this.attachment = E(e.ref), this.rovingFocusGroup = new M({
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
		this.opts = e, this.root = t, this.attachment = E(e.ref);
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
	#e = b(0);
	#t = c(() => this.root.opts.value.current === this.opts.value.current);
	#n = c(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#r = c(() => this.root.valueToContentId.get(this.opts.value.current));
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = E(e.ref), w([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerTrigger(e, t)), h(() => {
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
		"aria-selected": D(v(this.#t)),
		"aria-controls": v(this.#r),
		[P.trigger]: "",
		disabled: j(v(this.#n)),
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
		this.opts = e, this.root = t, this.attachment = E(e.ref), w([() => this.opts.id.current, () => this.opts.value.current], ([e, t]) => this.root.registerContent(e, t));
	}
	#n = c(() => ({
		id: this.opts.id.current,
		role: "tabpanel",
		hidden: j(!v(this.#e)),
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
]), H = g("<div><!></div>");
function U(u, p) {
	let h = l();
	t(p, !0);
	let g = _(p, "id", 19, () => A(h)), b = _(p, "ref", 15, null), x = _(p, "value", 15, ""), C = _(p, "onValueChange", 3, N), w = _(p, "orientation", 3, "horizontal"), E = _(p, "loop", 3, !0), D = _(p, "activationMode", 3, "automatic"), O = _(p, "disabled", 3, !1), k = m(p, V), j = I.create({
		id: S(() => g()),
		value: S(() => x(), (e) => {
			x(e), C()(e);
		}),
		orientation: S(() => w()),
		loop: S(() => E()),
		activationMode: S(() => D()),
		disabled: S(() => O()),
		ref: S(() => b(), (e) => b(e))
	}), M = c(() => T(k, j.props));
	var P = a(), F = f(P), L = (e) => {
		var t = a(), n = f(t);
		r(n, () => p.child, () => ({ props: v(M) })), i(e, t);
	}, R = (e) => {
		var t = H();
		y(t, () => ({ ...v(M) }));
		var n = d(t);
		r(n, () => p.children ?? s), o(t), i(e, t);
	};
	e(F, (e) => {
		p.child ? e(L) : e(R, -1);
	}), i(u, P), n();
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
]), G = g("<div><!></div>");
function K(u, p) {
	let h = l();
	t(p, !0);
	let g = _(p, "id", 19, () => A(h)), b = _(p, "ref", 15, null), x = _(p, "tabindex", 3, 0), C = m(p, W), w = z.create({
		value: S(() => p.value),
		tabindex: S(() => x() ?? 0),
		id: S(() => g()),
		ref: S(() => b(), (e) => b(e))
	}), E = c(() => T(C, w.props));
	var D = a(), O = f(D), k = (e) => {
		var t = a(), n = f(t);
		r(n, () => p.child, () => ({ props: v(E) })), i(e, t);
	}, j = (e) => {
		var t = G();
		y(t, () => ({ ...v(E) }));
		var n = d(t);
		r(n, () => p.children ?? s), o(t), i(e, t);
	};
	e(O, (e) => {
		p.child ? e(k) : e(j, -1);
	}), i(u, D), n();
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
]), J = g("<div><!></div>");
function Y(u, p) {
	let h = l();
	t(p, !0);
	let g = _(p, "id", 19, () => A(h)), b = _(p, "ref", 15, null), x = m(p, q), C = L.create({
		id: S(() => g()),
		ref: S(() => b(), (e) => b(e))
	}), w = c(() => T(x, C.props));
	var E = a(), D = f(E), O = (e) => {
		var t = a(), n = f(t);
		r(n, () => p.child, () => ({ props: v(w) })), i(e, t);
	}, k = (e) => {
		var t = J();
		y(t, () => ({ ...v(w) }));
		var n = d(t);
		r(n, () => p.children ?? s), o(t), i(e, t);
	};
	e(D, (e) => {
		p.child ? e(O) : e(k, -1);
	}), i(u, E), n();
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
]), Z = g("<button><!></button>");
function Q(u, p) {
	let h = l();
	t(p, !0);
	let g = _(p, "disabled", 3, !1), b = _(p, "id", 19, () => A(h)), x = _(p, "type", 3, "button"), C = _(p, "ref", 15, null), w = m(p, X), E = R.create({
		id: S(() => b()),
		disabled: S(() => g() ?? !1),
		value: S(() => p.value),
		ref: S(() => C(), (e) => C(e))
	}), D = c(() => T(w, E.props, { type: x() }));
	var O = a(), k = f(O), j = (e) => {
		var t = a(), n = f(t);
		r(n, () => p.child, () => ({ props: v(D) })), i(e, t);
	}, M = (e) => {
		var t = Z();
		y(t, () => ({ ...v(D) }));
		var n = d(t);
		r(n, () => p.children ?? s), o(t), i(e, t);
	};
	e(k, (e) => {
		p.child ? e(j) : e(M, -1);
	}), i(u, O), n();
}
export { U as i, Y as n, K as r, Q as t };
