import { At as e, B as t, G as n, J as r, L as i, Mt as a, N as o, Q as s, R as c, Tt as l, U as u, W as d, _t as f, a as p, bt as m, ct as h, ft as g, g as _, ht as v, i as y, jt as b, k as x, kt as S, lt as C, ot as ee, pt as w, q as T, r as E, rt as D, st as O, tt as k, ut as A, v as te, wt as j } from "./index-client-57Odq85c.js";
import { B as M, C as ne, E as re, F as ie, G as ae, J as N, K as oe, M as se, O as ce, Q as P, S as le, V as ue, X as F, Z as de, c as fe, dt as pe, et as I, i as me, j as he, nt as ge, o as L, q as _e, r as ve, s as ye, st as R, w as be, x as xe } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { t as Se } from "./sr-only-styles-6jsaWJLL.js";
import { t as Ce } from "./after-sleep-mvoNP8rL.js";
import { a as we, g as Te, m as Ee, n as De } from "./customEmoji-BFRq6RB7.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/utils.js
function Oe(e, t) {
	let n = e.nextElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.nextElementSibling;
	}
}
function ke(e, t) {
	let n = e.previousElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.previousElementSibling;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/css-escape.js
function Ae(e) {
	if (typeof CSS < "u" && typeof CSS.escape == "function") return CSS.escape(e);
	let t = e.length, n = -1, r, i = "", a = e.charCodeAt(0);
	if (t === 1 && a === 45) return "\\" + e;
	for (; ++n < t;) r = e.charCodeAt(n), i += r === 0 ? "�" : r >= 1 && r <= 31 || r === 127 || n === 0 && r >= 48 && r <= 57 || n === 1 && r >= 48 && r <= 57 && a === 45 ? "\\" + r.toString(16) + " " : r >= 128 || r === 45 || r === 95 || r >= 48 && r <= 57 || r >= 65 && r <= 90 || r >= 97 && r <= 122 ? e.charAt(n) : "\\" + e.charAt(n);
	return i;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/command.svelte.js
var z = "data-value", B = ie({
	component: "command",
	parts: [
		"root",
		"list",
		"input",
		"separator",
		"loading",
		"empty",
		"group",
		"group-items",
		"group-heading",
		"item",
		"viewport",
		"input-label"
	]
}), V = B.selector("group"), je = B.selector("group-items"), Me = B.selector("group-heading"), Ne = B.selector("item"), Pe = `${B.selector("item")}:not([aria-disabled="true"])`, H = new P("Command.Root"), Fe = new P("Command.List"), Ie = new P("Command.Group"), Le = {
	search: "",
	value: "",
	filtered: {
		count: 0,
		items: /* @__PURE__ */ new Map(),
		groups: /* @__PURE__ */ new Set()
	}
}, Re = class e {
	static create(t) {
		return H.set(new e(t));
	}
	opts;
	attachment;
	#e = !1;
	#t = !0;
	#n = !1;
	sortAfterTick = !1;
	sortAndFilterAfterTick = !1;
	allItems = /* @__PURE__ */ new Set();
	allGroups = /* @__PURE__ */ new Map();
	allIds = /* @__PURE__ */ new Map();
	#r = f(0);
	get key() {
		return k(this.#r);
	}
	set key(e) {
		v(this.#r, e, !0);
	}
	#i = f(null);
	get viewportNode() {
		return k(this.#i);
	}
	set viewportNode(e) {
		v(this.#i, e, !0);
	}
	#a = f(null);
	get inputNode() {
		return k(this.#a);
	}
	set inputNode(e) {
		v(this.#a, e, !0);
	}
	#o = f(null);
	get labelNode() {
		return k(this.#o);
	}
	set labelNode(e) {
		v(this.#o, e, !0);
	}
	#s = f(Le);
	get commandState() {
		return k(this.#s);
	}
	set commandState(e) {
		v(this.#s, e);
	}
	#c = f(w(Le));
	get _commandState() {
		return k(this.#c);
	}
	set _commandState(e) {
		v(this.#c, e, !0);
	}
	#l() {
		return S(this._commandState);
	}
	#u(e) {
		oe(() => {
			this.#n || e();
		});
	}
	#d() {
		this.#e || (this.#e = !0, this.#u(() => {
			this.#e = !1;
			let e = this.#l();
			Object.is(this.commandState, e) || (this.commandState = e, this.opts.onStateChange?.current?.(e));
		}));
	}
	setState(e, t, n) {
		Object.is(this._commandState[e], t) || (this._commandState[e] = t, e === "search" ? (this.#_(), this.#p({ forceSelectFirst: !this.#t })) : e === "value" && (n || this.#y()), this.#d());
	}
	constructor(e) {
		this.opts = e, this.attachment = M(this.opts.ref);
		let t = {
			...this._commandState,
			value: this.opts.value.current ?? ""
		};
		this._commandState = t, this.commandState = t, this.onkeydown = this.onkeydown.bind(this), _e(() => {
			this.#n = !0;
		});
	}
	#f(e, t) {
		let n = this.opts.filter.current ?? yt;
		return e ? n(e, this._commandState.search, t) : 0;
	}
	#p(e = {}) {
		if (!this._commandState.search || this.opts.shouldFilter.current === !1) {
			!this._commandState.value || e.forceSelectFirst ? this.#m() : this.#t && this._commandState.value && this.#g();
			return;
		}
		let t = this._commandState.filtered.items, n = [];
		for (let e of this._commandState.filtered.groups) {
			let r = this.allGroups.get(e), i = 0;
			if (!r) n.push([e, i]);
			else {
				for (let e of r) {
					let n = t.get(e);
					i = Math.max(n ?? 0, i);
				}
				n.push([e, i]);
			}
		}
		let r = this.viewportNode, i = this.getValidItems().sort((e, n) => {
			let r = e.getAttribute("data-value"), i = n.getAttribute("data-value"), a = t.get(r) ?? 0;
			return (t.get(i) ?? 0) - a;
		});
		for (let e of i) {
			let t = e.closest(je);
			if (t) {
				let n = e.parentElement === t ? e : e.closest(`${je} > *`);
				n && t.appendChild(n);
			} else {
				let t = e.parentElement === r ? e : e.closest(`${je} > *`);
				t && r?.appendChild(t);
			}
		}
		let a = n.sort((e, t) => t[1] - e[1]);
		for (let e of a) {
			let t = r?.querySelector(`${V}[${z}="${Ae(e[0])}"]`);
			t?.parentElement?.appendChild(t);
		}
		this.#m();
	}
	setValue(e, t) {
		e !== this.opts.value.current && e === "" && this.#u(() => {
			this.key++;
		}), this.setState("value", e, t), this.opts.value.current = e;
	}
	#m() {
		this.#u(() => {
			let e = this.getValidItems().find((e) => e.getAttribute("aria-disabled") !== "true")?.getAttribute(z), t = this.#t && this.opts.disableInitialScroll.current;
			this.setValue(e ?? "", t), this.#t = !1;
		});
	}
	#h(e) {
		oe(() => {
			this._commandState.value === e && (this.getValidItems().some((t) => t.getAttribute(z) === e) || this.#m());
		});
	}
	#g() {
		this.#u(() => {
			this.opts.disableInitialScroll.current || this.#y(), this.#t = !1;
		});
	}
	#_() {
		if (!this._commandState.search || this.opts.shouldFilter.current === !1) {
			this._commandState.filtered.count = this.allItems.size;
			return;
		}
		this._commandState.filtered.groups = /* @__PURE__ */ new Set();
		let e = 0;
		for (let t of this.allItems) {
			let n = this.allIds.get(t)?.value ?? "", r = this.allIds.get(t)?.keywords ?? [], i = this.#f(n, r);
			this._commandState.filtered.items.set(t, i), i > 0 && e++;
		}
		for (let [e, t] of this.allGroups) for (let n of t) {
			let t = this._commandState.filtered.items.get(n);
			if (t && t > 0) {
				this._commandState.filtered.groups.add(e);
				break;
			}
		}
		this._commandState.filtered.count = e;
	}
	getValidItems() {
		let e = this.opts.ref.current;
		return e ? Array.from(e.querySelectorAll(Pe)).filter((e) => !!e) : [];
	}
	getVisibleItems() {
		let e = this.opts.ref.current;
		return e ? Array.from(e.querySelectorAll(Ne)).filter((e) => !!e) : [];
	}
	get itemsGrid() {
		if (!this.isGrid) return [];
		let e = this.opts.columns.current ?? 1, t = this.getVisibleItems(), n = [[]], r = t[0]?.getAttribute("data-group"), i = 0, a = 0;
		for (let o = 0; o < t.length; o++) {
			let s = t[o], c = s?.getAttribute("data-group");
			r === c ? (i++, i > e && (a++, i = 1, n.push([])), n[a]?.push({
				index: o,
				firstRowOfGroup: n[a]?.[0]?.firstRowOfGroup ?? o === 0,
				ref: s
			})) : (r = c, i = 1, a++, n.push([{
				index: o,
				firstRowOfGroup: !0,
				ref: s
			}]));
		}
		return n;
	}
	#v() {
		let e = this.opts.ref.current;
		if (!e) return;
		let t = e.querySelector(`${Pe}[data-selected]`);
		if (t) return t;
	}
	#y() {
		this.#u(() => {
			let e = this.#v();
			if (!e) return;
			let t = e.parentElement?.parentElement;
			if (t) {
				if (this.isGrid) {
					let t = this.#b(e);
					if (e.scrollIntoView({ block: "nearest" }), t) {
						(e?.closest(V)?.querySelector(Me))?.scrollIntoView({ block: "nearest" });
						return;
					}
				} else {
					let n = me(t);
					if (n && n.dataset?.value === e.dataset?.value) {
						let t = e?.closest(V)?.querySelector(Me);
						if (t) {
							t.scrollIntoView({ block: "nearest" });
							return;
						}
					}
				}
				e.scrollIntoView({ block: "nearest" });
			}
		});
	}
	#b(e) {
		let t = this.itemsGrid;
		if (t.length === 0) return !1;
		for (let n = 0; n < t.length; n++) {
			let r = t[n];
			if (r !== void 0) for (let t = 0; t < r.length; t++) {
				let n = r[t];
				if (n !== void 0 && n.ref === e) return n.firstRowOfGroup;
			}
		}
		return !1;
	}
	updateSelectedToIndex(e) {
		let t = this.getValidItems()[e];
		t && this.setValue(t.getAttribute(z) ?? "");
	}
	updateSelectedByItem(e) {
		let t = this.#v(), n = this.getValidItems(), r = n.findIndex((e) => e === t), i = n[r + e];
		this.opts.loop.current && (i = r + e < 0 ? n[n.length - 1] : r + e === n.length ? n[0] : n[r + e]), i && this.setValue(i.getAttribute(z) ?? "");
	}
	updateSelectedByGroup(e) {
		let t = this.#v()?.closest(V), n;
		for (; t && !n;) t = e > 0 ? Oe(t, V) : ke(t, V), n = t?.querySelector(Pe);
		n ? this.setValue(n.getAttribute(z) ?? "") : this.updateSelectedByItem(e);
	}
	registerValue(e, t) {
		return e && e === this.allIds.get(e)?.value || this.allIds.set(e, {
			value: e,
			keywords: t
		}), this._commandState.filtered.items.set(e, this.#f(e, t)), this.sortAfterTick || (this.sortAfterTick = !0, this.#u(() => {
			this.#p(), this.sortAfterTick = !1;
		})), () => {
			this.allIds.delete(e);
		};
	}
	registerItem(e, t) {
		return this.allItems.add(e), t && (this.allGroups.has(t) ? this.allGroups.get(t).add(e) : this.allGroups.set(t, /* @__PURE__ */ new Set([e]))), this.sortAndFilterAfterTick || (this.sortAndFilterAfterTick = !0, this.#u(() => {
			this.#_(), this.#p(), this.sortAndFilterAfterTick = !1;
		})), this.#d(), () => {
			let t = this.#v();
			if (this.allItems.delete(e), this.commandState.filtered.items.delete(e), this.#_(), t?.getAttribute("id") === e) {
				let e = t.getAttribute(z);
				e ? this.#h(e) : this.#m();
			}
			this.#d();
		};
	}
	registerGroup(e) {
		return this.allGroups.has(e) || this.allGroups.set(e, /* @__PURE__ */ new Set()), () => {
			this.allIds.delete(e), this.allGroups.delete(e);
		};
	}
	get isGrid() {
		return this.opts.columns.current !== null;
	}
	#x() {
		return this.updateSelectedToIndex(this.getValidItems().length - 1);
	}
	#S(e) {
		e.preventDefault(), e.metaKey ? this.#x() : e.altKey ? this.updateSelectedByGroup(1) : this.updateSelectedByItem(1);
	}
	#C(e) {
		this.opts.columns.current !== null && (e.preventDefault(), e.metaKey ? this.updateSelectedByGroup(1) : this.updateSelectedByItem(this.#T(e)));
	}
	#w(e, t) {
		if (t.length === 0) return null;
		for (let n = 0; n < t.length; n++) {
			let r = t[n];
			if (r !== void 0) for (let t = 0; t < r.length; t++) {
				let i = r[t];
				if (i !== void 0 && i.ref === e) return {
					columnIndex: t,
					rowIndex: n
				};
			}
		}
		return null;
	}
	#T(e) {
		let t = this.itemsGrid, n = this.#v();
		if (!n) return 0;
		let r = this.#w(n, t);
		if (!r) return 0;
		let i = null, a = +!!e.altKey;
		if (e.altKey && r.rowIndex === t.length - 2 && !this.opts.loop.current) i = this.#E({
			start: t.length - 1,
			end: t.length,
			expectedColumnIndex: r.columnIndex,
			grid: t
		});
		else if (r.rowIndex === t.length - 1) {
			if (!this.opts.loop.current) return 0;
			i = this.#E({
				start: 0 + a,
				end: r.rowIndex,
				expectedColumnIndex: r.columnIndex,
				grid: t
			});
		} else i = this.#E({
			start: r.rowIndex + 1 + a,
			end: t.length,
			expectedColumnIndex: r.columnIndex,
			grid: t
		}), i === null && this.opts.loop.current && (i = this.#E({
			start: 0,
			end: r.rowIndex,
			expectedColumnIndex: r.columnIndex,
			grid: t
		}));
		return this.#D(n, i);
	}
	#E({ start: e, end: t, grid: n, expectedColumnIndex: r }) {
		let i = null;
		for (let a = e; a < t; a++) {
			let e = n[a];
			if (i = e[r]?.ref ?? null, i !== null && U(i)) i = null;
			else {
				if (i === null) for (let t = e.length - 1; t >= 0; t--) {
					let t = e[e.length - 1];
					if (!(t === void 0 || U(t.ref))) {
						i = t.ref;
						break;
					}
				}
				break;
			}
		}
		return i;
	}
	#D(e, t) {
		if (t === null) return 0;
		let n = this.getValidItems(), r = n.findIndex((t) => t === e);
		return n.findIndex((e) => e === t) - r;
	}
	#O(e) {
		this.opts.columns.current !== null && (e.preventDefault(), e.metaKey ? this.updateSelectedByGroup(-1) : this.updateSelectedByItem(this.#k(e)));
	}
	#k(e) {
		let t = this.itemsGrid, n = this.#v();
		if (n === void 0) return 0;
		let r = this.#w(n, t);
		if (r === null) return 0;
		let i = null, a = +!!e.altKey;
		if (e.altKey && r.rowIndex === 1 && this.opts.loop.current === !1) i = this.#A({
			start: 0,
			end: 0,
			expectedColumnIndex: r.columnIndex,
			grid: t
		});
		else if (r.rowIndex === 0) {
			if (this.opts.loop.current === !1) return 0;
			i = this.#A({
				start: t.length - 1 - a,
				end: r.rowIndex + 1,
				expectedColumnIndex: r.columnIndex,
				grid: t
			});
		} else i = this.#A({
			start: r.rowIndex - 1 - a,
			end: 0,
			expectedColumnIndex: r.columnIndex,
			grid: t
		}), i === null && this.opts.loop.current && (i = this.#A({
			start: t.length - 1,
			end: r.rowIndex + 1,
			expectedColumnIndex: r.columnIndex,
			grid: t
		}));
		return this.#D(n, i);
	}
	#A({ start: e, end: t, grid: n, expectedColumnIndex: r }) {
		let i = null;
		for (let a = e; a >= t; a--) {
			let e = n[a];
			if (e !== void 0) {
				if (i = e[r]?.ref ?? null, i !== null && U(i)) i = null;
				else {
					if (i === null) for (let t = e.length - 1; t >= 0; t--) {
						let t = e[e.length - 1];
						if (!(t === void 0 || U(t.ref))) {
							i = t.ref;
							break;
						}
					}
					break;
				}
			}
		}
		return i;
	}
	#j(e) {
		e.preventDefault(), e.metaKey ? this.updateSelectedToIndex(0) : e.altKey ? this.updateSelectedByGroup(-1) : this.updateSelectedByItem(-1);
	}
	onkeydown(e) {
		let t = this.opts.vimBindings.current && e.ctrlKey;
		switch (e.key) {
			case "n":
			case "j":
				t && (this.isGrid ? this.#C(e) : this.#S(e));
				break;
			case "l":
				t && this.isGrid && this.#S(e);
				break;
			case xe:
				this.isGrid ? this.#C(e) : this.#S(e);
				break;
			case ne:
				if (!this.isGrid) break;
				this.#S(e);
				break;
			case "p":
			case "k":
				t && (this.isGrid ? this.#O(e) : this.#j(e));
				break;
			case "h":
				t && this.isGrid && this.#j(e);
				break;
			case be:
				this.isGrid ? this.#O(e) : this.#j(e);
				break;
			case le:
				if (!this.isGrid) break;
				this.#j(e);
				break;
			case ce:
				e.preventDefault(), this.updateSelectedToIndex(0);
				break;
			case "End":
				e.preventDefault(), this.#x();
				break;
			case re: if (!e.isComposing && e.keyCode !== 229) {
				e.preventDefault();
				let t = this.#v();
				t && t?.click();
			}
		}
	}
	#M = m(() => ({
		id: this.opts.id.current,
		role: "application",
		[B.root]: "",
		tabindex: -1,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return k(this.#M);
	}
	set props(e) {
		v(this.#M, e);
	}
};
function U(e) {
	return e.getAttribute("aria-disabled") === "true";
}
var ze = class e {
	static create(t) {
		return new e(t, H.get());
	}
	opts;
	root;
	attachment;
	#e = m(() => this.root._commandState.filtered.count === 0 && this.#t === !1 || this.opts.forceMount.current);
	get shouldRender() {
		return k(this.#e);
	}
	set shouldRender(e) {
		v(this.#e, e);
	}
	#t = !0;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref), h(() => {
			this.#t = !1;
		});
	}
	#n = m(() => ({
		id: this.opts.id.current,
		role: "presentation",
		[B.empty]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#n);
	}
	set props(e) {
		v(this.#n, e);
	}
}, Be = class e {
	static create(t) {
		return new e(t, H.get());
	}
	opts;
	root;
	attachment;
	#e = m(() => {
		let e = this.root.viewportNode?.querySelector(`${Ne}[${z}="${Ae(this.root.opts.value.current)}"]`);
		if (e != null) return e.getAttribute("id") ?? void 0;
	});
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref, (e) => this.root.inputNode = e), F(() => this.opts.ref.current, () => {
			let e = this.opts.ref.current;
			e && this.opts.autofocus.current && Ce(10, () => e.focus());
		}), F(() => this.opts.value.current, () => {
			this.root.commandState.search !== this.opts.value.current && this.root.setState("search", this.opts.value.current);
		});
	}
	#t = m(() => ({
		id: this.opts.id.current,
		type: "text",
		[B.input]: "",
		autocomplete: "off",
		autocorrect: "off",
		spellcheck: !1,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": se(!0),
		"aria-controls": this.root.viewportNode?.id ?? void 0,
		"aria-labelledby": this.root.labelNode?.id ?? void 0,
		"aria-activedescendant": k(this.#e),
		...this.attachment
	}));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		v(this.#t, e);
	}
}, Ve = class e {
	static create(t) {
		let n = Ie.getOr(null);
		return new e({
			...t,
			group: n
		}, H.get());
	}
	opts;
	root;
	attachment;
	#e = null;
	#t = m(() => this.opts.forceMount.current || this.#e?.opts.forceMount.current === !0);
	#n = m(() => {
		if (this.opts.ref.current, k(this.#t) || this.root.opts.shouldFilter.current === !1 || !this.root.commandState.search) return !0;
		let e = this.root.commandState.filtered.items.get(this.trueValue);
		return e !== void 0 && e > 0;
	});
	get shouldRender() {
		return k(this.#n);
	}
	set shouldRender(e) {
		v(this.#n, e);
	}
	#r = m(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
	get isSelected() {
		return k(this.#r);
	}
	set isSelected(e) {
		v(this.#r, e);
	}
	#i = f("");
	get trueValue() {
		return k(this.#i);
	}
	set trueValue(e) {
		v(this.#i, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#e = Ie.getOr(null), this.trueValue = e.value.current, this.attachment = M(this.opts.ref), F([
			() => this.trueValue,
			() => this.#e?.trueValue,
			() => this.opts.forceMount.current
		], () => {
			if (!this.opts.forceMount.current && this.trueValue) return this.root.registerItem(this.trueValue, this.#e?.trueValue);
		}), F([() => this.opts.value.current, () => this.opts.ref.current], () => {
			this.opts.value.current ? this.trueValue = this.opts.value.current : this.opts.ref.current?.textContent && (this.trueValue = this.opts.ref.current.textContent.trim()), this.trueValue && (this.root.registerValue(this.trueValue, e.keywords.current.map((e) => e.trim())), this.opts.ref.current?.setAttribute(z, this.trueValue));
		}), this.onclick = this.onclick.bind(this), this.onpointermove = this.onpointermove.bind(this);
	}
	#a() {
		this.opts.disabled.current || (this.#o(), this.opts.onSelect?.current());
	}
	#o() {
		this.opts.disabled.current || this.root.setValue(this.trueValue, !0);
	}
	onpointermove(e) {
		this.opts.disabled.current || this.root.opts.disablePointerSelection.current || this.#o();
	}
	onclick(e) {
		this.opts.disabled.current || this.#a();
	}
	#s = m(() => ({
		id: this.opts.id.current,
		"aria-disabled": se(this.opts.disabled.current),
		"aria-selected": se(this.isSelected),
		"data-disabled": he(this.opts.disabled.current),
		"data-selected": he(this.isSelected),
		"data-value": this.trueValue,
		"data-group": this.#e?.trueValue,
		[B.item]: "",
		role: "option",
		onpointermove: this.onpointermove,
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return k(this.#s);
	}
	set props(e) {
		v(this.#s, e);
	}
}, He = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = M(this.opts.ref);
	}
	#e = m(() => ({
		id: this.opts.id.current,
		role: "progressbar",
		"aria-valuenow": this.opts.progress.current,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": "Loading...",
		[B.loading]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#e);
	}
	set props(e) {
		v(this.#e, e);
	}
}, Ue = class e {
	static create(t) {
		return Fe.set(new e(t, H.get()));
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref);
	}
	#e = m(() => ({
		id: this.opts.id.current,
		role: "listbox",
		"aria-label": this.opts.ariaLabel.current,
		[B.list]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#e);
	}
	set props(e) {
		v(this.#e, e);
	}
}, We = class e {
	static create(t) {
		return new e(t, H.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(this.opts.ref, (e) => this.root.labelNode = e);
	}
	#e = m(() => ({
		id: this.opts.id.current,
		[B["input-label"]]: "",
		for: this.opts.for?.current,
		style: Se,
		...this.attachment
	}));
	get props() {
		return k(this.#e);
	}
	set props(e) {
		v(this.#e, e);
	}
}, Ge = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children"
]), Ke = n("<label><!></label>");
function qe(e, t) {
	let n = T();
	l(t, !0);
	let r = E(t, "id", 19, () => L(n)), i = E(t, "ref", 15, null), s = y(t, Ge), c = We.create({
		id: R(() => r()),
		ref: R(() => i(), (e) => i(e))
	}), d = m(() => I(s, c.props));
	var f = Ke();
	_(f, () => ({ ...k(d) }));
	var p = C(f);
	o(p, () => t.children ?? a), b(f), u(e, f), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command.svelte
var Je = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"value",
	"onValueChange",
	"onStateChange",
	"loop",
	"shouldFilter",
	"filter",
	"label",
	"vimBindings",
	"disablePointerSelection",
	"disableInitialScroll",
	"columns",
	"children",
	"child"
]), Ye = n("<!> <!>", 1), Xe = n("<div><!> <!></div>");
function Ze(n, i) {
	let s = T();
	l(i, !0);
	let f = (n) => {
		qe(n, {
			children: (n, i) => {
				e();
				var a = r();
				ee(() => t(a, te())), u(n, a);
			},
			$$slots: { default: !0 }
		});
	}, p = E(i, "id", 19, () => L(s)), h = E(i, "ref", 15, null), v = E(i, "value", 15, ""), x = E(i, "onValueChange", 3, ye), S = E(i, "onStateChange", 3, ye), w = E(i, "loop", 3, !1), D = E(i, "shouldFilter", 3, !0), O = E(i, "filter", 3, yt), te = E(i, "label", 3, ""), M = E(i, "vimBindings", 3, !0), ne = E(i, "disablePointerSelection", 3, !1), re = E(i, "disableInitialScroll", 3, !1), ie = E(i, "columns", 3, null), ae = y(i, Je), N = Re.create({
		id: R(() => p()),
		ref: R(() => h(), (e) => h(e)),
		filter: R(() => O()),
		shouldFilter: R(() => D()),
		loop: R(() => w()),
		value: R(() => v(), (e) => {
			v() !== e && (v(e), x()(e));
		}),
		vimBindings: R(() => M()),
		disablePointerSelection: R(() => ne()),
		disableInitialScroll: R(() => re()),
		onStateChange: R(() => S()),
		columns: R(() => ie())
	}), oe = (e) => N.updateSelectedToIndex(e), se = (e) => N.updateSelectedByGroup(e), ce = (e) => N.updateSelectedByItem(e), P = () => N.getValidItems(), le = m(() => I(ae, N.props));
	var ue = {
		updateSelectedToIndex: oe,
		updateSelectedByGroup: se,
		updateSelectedByItem: ce,
		getValidItems: P
	}, F = d(), de = A(F), fe = (e) => {
		var t = Ye(), n = A(t);
		f(n);
		var r = g(n, 2);
		o(r, () => i.child, () => ({ props: k(le) })), u(e, t);
	}, pe = (e) => {
		var t = Xe();
		_(t, () => ({ ...k(le) }));
		var n = C(t);
		f(n);
		var r = g(n, 2);
		o(r, () => i.children ?? a), b(t), u(e, t);
	};
	return c(de, (e) => {
		i.child ? e(fe) : e(pe, -1);
	}), u(n, F), j(ue);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-item.svelte
var Qe = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"value",
	"disabled",
	"children",
	"child",
	"onSelect",
	"forceMount",
	"keywords"
]), $e = n("<div><!></div>"), et = n("<div style=\"display: contents;\" data-item-wrapper=\"\"><!></div>");
function tt(e, t) {
	let n = T();
	l(t, !0);
	let r = E(t, "id", 19, () => L(n)), s = E(t, "ref", 15, null), f = E(t, "value", 3, ""), p = E(t, "disabled", 3, !1), h = E(t, "onSelect", 3, ye), g = E(t, "forceMount", 3, !1), v = E(t, "keywords", 19, () => []), x = y(t, Qe), S = Ve.create({
		id: R(() => r()),
		ref: R(() => s(), (e) => s(e)),
		value: R(() => f()),
		disabled: R(() => p()),
		onSelect: R(() => h()),
		forceMount: R(() => g()),
		keywords: R(() => v())
	}), w = m(() => I(x, S.props));
	var D = d(), O = A(D);
	i(O, () => S.root.key, (e) => {
		var n = et(), r = C(n), i = (e) => {
			var n = d(), r = A(n), i = (e) => {
				var n = d(), r = A(n);
				o(r, () => t.child, () => ({ props: k(w) })), u(e, n);
			}, s = (e) => {
				var n = $e();
				_(n, () => ({ ...k(w) }));
				var r = C(n);
				o(r, () => t.children ?? a), b(n), u(e, n);
			};
			c(r, (e) => {
				t.child ? e(i) : e(s, -1);
			}), u(e, n);
		};
		c(r, (e) => {
			S.shouldRender && e(i);
		}), b(n), ee(() => te(n, "data-value", S.trueValue)), u(e, n);
	}), u(e, D), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-list.svelte
var nt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"aria-label"
]), rt = n("<div><!></div>");
function it(e, t) {
	let n = T();
	l(t, !0);
	let r = E(t, "id", 19, () => L(n)), s = E(t, "ref", 15, null), f = y(t, nt), p = Ue.create({
		id: R(() => r()),
		ref: R(() => s(), (e) => s(e)),
		ariaLabel: R(() => t["aria-label"] ?? "Suggestions...")
	}), h = m(() => I(f, p.props));
	var g = d(), v = A(g);
	i(v, () => p.root.opts.shouldFilter.current === !1 || p.root._commandState.search === "", (e) => {
		var n = d(), r = A(n), i = (e) => {
			var n = d(), r = A(n);
			o(r, () => t.child, () => ({ props: k(h) })), u(e, n);
		}, s = (e) => {
			var n = rt();
			_(n, () => ({ ...k(h) }));
			var r = C(n);
			o(r, () => t.children ?? a), b(n), u(e, n);
		};
		c(r, (e) => {
			t.child ? e(i) : e(s, -1);
		}), u(e, n);
	}), u(e, g), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/compute-command-score.js
var at = 1, ot = .9, st = .8, ct = .17, lt = .1, ut = .999, dt = .9999, ft = .99, pt = /[\\/_+.#"@[({&]/, mt = /[\\/_+.#"@[({&]/g, ht = /[\s-]/, gt = /[\s-]/g;
function _t(e, t, n, r, i, a, o) {
	if (a === t.length) return i === e.length ? at : ft;
	let s = `${i},${a}`;
	if (o[s] !== void 0) return o[s];
	let c = r.charAt(a), l = n.indexOf(c, i), u = 0, d, f, p, m;
	for (; l >= 0;) d = _t(e, t, n, r, l + 1, a + 1, o), d > u && (l === i ? d *= at : pt.test(e.charAt(l - 1)) ? (d *= st, p = e.slice(i, l - 1).match(mt), p && i > 0 && (d *= ut ** p.length)) : ht.test(e.charAt(l - 1)) ? (d *= ot, m = e.slice(i, l - 1).match(gt), m && i > 0 && (d *= ut ** m.length)) : (d *= ct, i > 0 && (d *= ut ** (l - i))), e.charAt(l) !== t.charAt(a) && (d *= dt)), (d < lt && n.charAt(l - 1) === r.charAt(a + 1) || r.charAt(a + 1) === r.charAt(a) && n.charAt(l - 1) !== r.charAt(a)) && (f = _t(e, t, n, r, l + 1, a + 2, o), f * lt > d && (d = f * lt)), d > u && (u = d), l = n.indexOf(c, l + 1);
	return o[s] = u, u;
}
function vt(e) {
	return e.toLowerCase().replace(gt, " ");
}
function yt(e, t, n) {
	return e = n && n.length > 0 ? `${`${e} ${n?.join(" ")}`}` : e, _t(e, t, vt(e), vt(t), 0, 0, {});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/svelte-resize-observer.svelte.js
var bt = null, W = /* @__PURE__ */ new WeakMap();
function xt() {
	return bt ??= new ResizeObserver((e) => {
		for (let t of e) {
			let e = W.get(t.target);
			if (e) for (let t of [...e]) t();
		}
	}), bt;
}
function St(e, t) {
	let n = W.get(e);
	return n === void 0 ? (n = /* @__PURE__ */ new Set(), W.set(e, n), n.add(t), xt().observe(e)) : (n.add(t), t()), () => {
		let n = W.get(e);
		n && (n.delete(t), !n.size && (W.delete(e), bt?.unobserve(e)));
	};
}
var Ct = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t, this.handler = this.handler.bind(this), O(this.handler);
	}
	handler() {
		let e = 0, t = this.#e();
		if (!t) return;
		let n = St(t, () => {
			cancelAnimationFrame(e), e = window.requestAnimationFrame(this.#t);
		});
		return () => {
			window.cancelAnimationFrame(e), n();
		};
	}
}, wt = class {
	opts;
	present;
	#e;
	#t = f(!1);
	#n = !1;
	#r = f(void 0);
	#i = null;
	constructor(e) {
		this.opts = e, this.present = this.opts.open, v(this.#t, e.open.current, !0), this.#e = new fe({
			ref: this.opts.ref,
			afterTick: this.opts.open
		}), _e(() => this.#o()), F(() => this.present.current, (e) => {
			this.#n ? (this.#o(), e && v(this.#t, !0), v(this.#r, e ? "starting" : "ending", !0), e && (this.#i = window.requestAnimationFrame(() => {
				this.#i = null, this.present.current && v(this.#r, void 0);
			})), this.#e.run(() => {
				e === this.present.current && (e || v(this.#t, !1), v(this.#r, void 0));
			})) : this.#n = !0;
		});
	}
	#a = m(() => k(this.#t));
	get isPresent() {
		return k(this.#a);
	}
	set isPresent(e) {
		v(this.#a, e);
	}
	get transitionStatus() {
		return k(this.#r);
	}
	#o() {
		this.#i !== null && (window.cancelAnimationFrame(this.#i), this.#i = null);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte
function Tt(e, t) {
	l(t, !0);
	let n = new wt({
		open: R(() => t.open),
		ref: D(() => t.ref)
	});
	var r = d(), i = A(r), s = (e) => {
		var r = d(), i = A(r);
		o(i, () => t.presence ?? a, () => ({
			present: n.isPresent,
			transitionStatus: n.transitionStatus
		})), u(e, r);
	};
	c(i, (e) => {
		(t.forceMount || t.open || n.isPresent) && e(s);
	}), u(e, r), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/clamp.js
function Et(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/state-machine.js
var Dt = class {
	state;
	#e;
	constructor(e, t) {
		this.state = pe(e), this.#e = t, this.dispatch = this.dispatch.bind(this);
	}
	#t(e) {
		return this.#e[this.state.current][e] ?? this.state.current;
	}
	dispatch(e) {
		this.state.current = this.#t(e);
	}
}, Ot = ie({
	component: "scroll-area",
	parts: [
		"root",
		"viewport",
		"corner",
		"thumb",
		"scrollbar"
	]
}), kt = new P("ScrollArea.Root"), G = new P("ScrollArea.Scrollbar"), At = new P("ScrollArea.ScrollbarVisible"), jt = new P("ScrollArea.ScrollbarAxis"), Mt = new P("ScrollArea.ScrollbarShared"), Nt = class e {
	static create(t) {
		return kt.set(new e(t));
	}
	opts;
	attachment;
	#e = f(null);
	get scrollAreaNode() {
		return k(this.#e);
	}
	set scrollAreaNode(e) {
		v(this.#e, e, !0);
	}
	#t = f(null);
	get viewportNode() {
		return k(this.#t);
	}
	set viewportNode(e) {
		v(this.#t, e, !0);
	}
	#n = f(null);
	get contentNode() {
		return k(this.#n);
	}
	set contentNode(e) {
		v(this.#n, e, !0);
	}
	#r = f(null);
	get scrollbarXNode() {
		return k(this.#r);
	}
	set scrollbarXNode(e) {
		v(this.#r, e, !0);
	}
	#i = f(null);
	get scrollbarYNode() {
		return k(this.#i);
	}
	set scrollbarYNode(e) {
		v(this.#i, e, !0);
	}
	#a = f(0);
	get cornerWidth() {
		return k(this.#a);
	}
	set cornerWidth(e) {
		v(this.#a, e, !0);
	}
	#o = f(0);
	get cornerHeight() {
		return k(this.#o);
	}
	set cornerHeight(e) {
		v(this.#o, e, !0);
	}
	#s = f(!1);
	get scrollbarXEnabled() {
		return k(this.#s);
	}
	set scrollbarXEnabled(e) {
		v(this.#s, e, !0);
	}
	#c = f(!1);
	get scrollbarYEnabled() {
		return k(this.#c);
	}
	set scrollbarYEnabled(e) {
		v(this.#c, e, !0);
	}
	domContext;
	constructor(e) {
		this.opts = e, this.attachment = M(e.ref, (e) => this.scrollAreaNode = e), this.domContext = new ue(e.ref);
	}
	#l = m(() => ({
		id: this.opts.id.current,
		dir: this.opts.dir.current,
		style: {
			position: "relative",
			"--bits-scroll-area-corner-height": `${this.cornerHeight}px`,
			"--bits-scroll-area-corner-width": `${this.cornerWidth}px`
		},
		[Ot.root]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#l);
	}
	set props(e) {
		v(this.#l, e);
	}
}, Pt = class e {
	static create(t) {
		return new e(t, kt.get());
	}
	opts;
	root;
	attachment;
	#e = pe(ve());
	#t = pe(null);
	contentAttachment = M(this.#t, (e) => this.root.contentNode = e);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = M(e.ref, (e) => this.root.viewportNode = e);
	}
	#n = m(() => ({
		id: this.opts.id.current,
		style: {
			overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
			overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden"
		},
		[Ot.viewport]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#n);
	}
	set props(e) {
		v(this.#n, e);
	}
	#r = m(() => ({
		id: this.#e.current,
		"data-scroll-area-content": "",
		style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0 },
		...this.contentAttachment
	}));
	get contentProps() {
		return k(this.#r);
	}
	set contentProps(e) {
		v(this.#r, e);
	}
}, Ft = class e {
	static create(t) {
		return G.set(new e(t, kt.get()));
	}
	opts;
	root;
	#e = m(() => this.opts.orientation.current === "horizontal");
	get isHorizontal() {
		return k(this.#e);
	}
	set isHorizontal(e) {
		v(this.#e, e);
	}
	#t = f(!1);
	get hasThumb() {
		return k(this.#t);
	}
	set hasThumb(e) {
		v(this.#t, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, F(() => this.isHorizontal, (e) => e ? (this.root.scrollbarXEnabled = !0, () => {
			this.root.scrollbarXEnabled = !1;
		}) : (this.root.scrollbarYEnabled = !0, () => {
			this.root.scrollbarYEnabled = !1;
		}));
	}
}, It = class e {
	static create() {
		return new e(G.get());
	}
	scrollbar;
	root;
	#e = f(!1);
	get isVisible() {
		return k(this.#e);
	}
	set isVisible(e) {
		v(this.#e, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root, O(() => {
			let e = this.root.scrollAreaNode, t = this.root.opts.scrollHideDelay.current, n = 0;
			if (!e) return;
			let r = ge(s(e, "pointerenter", () => {
				this.root.domContext.clearTimeout(n), D(() => this.isVisible = !0);
			}), s(e, "pointerleave", () => {
				n && this.root.domContext.clearTimeout(n), n = this.root.domContext.setTimeout(() => {
					D(() => {
						this.scrollbar.hasThumb = !1, this.isVisible = !1;
					});
				}, t);
			}));
			return () => {
				this.root.domContext.getWindow().clearTimeout(n), r();
			};
		});
	}
	#t = m(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		v(this.#t, e);
	}
}, Lt = class e {
	static create() {
		return new e(G.get());
	}
	scrollbar;
	root;
	machine = new Dt("hidden", {
		hidden: { SCROLL: "scrolling" },
		scrolling: {
			SCROLL_END: "idle",
			POINTER_ENTER: "interacting"
		},
		interacting: {
			SCROLL: "interacting",
			POINTER_LEAVE: "idle"
		},
		idle: {
			HIDE: "hidden",
			SCROLL: "scrolling",
			POINTER_ENTER: "interacting"
		}
	});
	#e = m(() => this.machine.state.current === "hidden");
	get isHidden() {
		return k(this.#e);
	}
	set isHidden(e) {
		v(this.#e, e);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root;
		let t = de(() => this.machine.dispatch("SCROLL_END"), 100);
		O(() => {
			let e = this.machine.state.current, t = this.root.opts.scrollHideDelay.current;
			if (e === "idle") {
				let e = this.root.domContext.setTimeout(() => this.machine.dispatch("HIDE"), t);
				return () => this.root.domContext.clearTimeout(e);
			}
		}), O(() => {
			let e = this.root.viewportNode;
			if (!e) return;
			let n = this.scrollbar.isHorizontal ? "scrollLeft" : "scrollTop", r = e[n];
			return s(e, "scroll", () => {
				let i = e[n];
				r !== i && (this.machine.dispatch("SCROLL"), t()), r = i;
			});
		}), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this);
	}
	onpointerenter(e) {
		this.machine.dispatch("POINTER_ENTER");
	}
	onpointerleave(e) {
		this.machine.dispatch("POINTER_LEAVE");
	}
	#t = m(() => ({
		"data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave
	}));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		v(this.#t, e);
	}
}, Rt = class e {
	static create() {
		return new e(G.get());
	}
	scrollbar;
	root;
	#e = f(!1);
	get isVisible() {
		return k(this.#e);
	}
	set isVisible(e) {
		v(this.#e, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root;
		let t = () => {
			let e = this.root.viewportNode;
			if (!e) return;
			let t = e.offsetWidth < e.scrollWidth, n = e.offsetHeight < e.scrollHeight;
			this.isVisible = this.scrollbar.isHorizontal ? t : n;
		};
		new Ct(() => this.root.viewportNode, t), new Ct(() => this.root.contentNode, t);
	}
	#t = m(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		v(this.#t, e);
	}
}, zt = class e {
	static create() {
		return At.set(new e(G.get()));
	}
	scrollbar;
	root;
	#e = f(null);
	get thumbNode() {
		return k(this.#e);
	}
	set thumbNode(e) {
		v(this.#e, e, !0);
	}
	#t = f(0);
	get pointerOffset() {
		return k(this.#t);
	}
	set pointerOffset(e) {
		v(this.#t, e, !0);
	}
	#n = f({
		content: 0,
		viewport: 0,
		scrollbar: {
			size: 0,
			paddingStart: 0,
			paddingEnd: 0
		}
	});
	get sizes() {
		return k(this.#n);
	}
	set sizes(e) {
		v(this.#n, e);
	}
	#r = m(() => Gt(this.sizes.viewport, this.sizes.content));
	get thumbRatio() {
		return k(this.#r);
	}
	set thumbRatio(e) {
		v(this.#r, e);
	}
	#i = m(() => this.thumbRatio > 0 && this.thumbRatio < 1);
	get hasThumb() {
		return k(this.#i);
	}
	set hasThumb(e) {
		v(this.#i, e);
	}
	#a = f("");
	get prevTransformStyle() {
		return k(this.#a);
	}
	set prevTransformStyle(e) {
		v(this.#a, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root, O(() => {
			this.scrollbar.hasThumb = this.hasThumb;
		}), O(() => {
			!this.scrollbar.hasThumb && this.thumbNode && (this.prevTransformStyle = this.thumbNode.style.transform);
		});
	}
	setSizes(e) {
		this.sizes = e;
	}
	getScrollPosition(e, t) {
		return qt({
			pointerPos: e,
			pointerOffset: this.pointerOffset,
			sizes: this.sizes,
			dir: t
		});
	}
	onThumbPointerUp() {
		this.pointerOffset = 0;
	}
	onThumbPointerDown(e) {
		this.pointerOffset = e;
	}
	xOnThumbPositionChange() {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		let e = this.root.viewportNode.scrollLeft, t = `translate3d(${Jt({
			scrollPos: e,
			sizes: this.sizes,
			dir: this.root.opts.dir.current
		})}px, 0, 0)`;
		this.thumbNode.style.transform = t, this.prevTransformStyle = t;
	}
	xOnWheelScroll(e) {
		this.root.viewportNode && (this.root.viewportNode.scrollLeft = e);
	}
	xOnDragScroll(e) {
		this.root.viewportNode && (this.root.viewportNode.scrollLeft = this.getScrollPosition(e, this.root.opts.dir.current));
	}
	yOnThumbPositionChange() {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		let e = this.root.viewportNode.scrollTop, t = `translate3d(0, ${Jt({
			scrollPos: e,
			sizes: this.sizes
		})}px, 0)`;
		this.thumbNode.style.transform = t, this.prevTransformStyle = t;
	}
	yOnWheelScroll(e) {
		this.root.viewportNode && (this.root.viewportNode.scrollTop = e);
	}
	yOnDragScroll(e) {
		this.root.viewportNode && (this.root.viewportNode.scrollTop = this.getScrollPosition(e, this.root.opts.dir.current));
	}
}, Bt = class e {
	static create(t) {
		return jt.set(new e(t, At.get()));
	}
	opts;
	scrollbarVis;
	root;
	scrollbar;
	attachment;
	#e = f();
	get computedStyle() {
		return k(this.#e);
	}
	set computedStyle(e) {
		v(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = M(this.scrollbar.opts.ref, (e) => this.root.scrollbarXNode = e), O(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), O(() => {
			this.onResize();
		});
	}
	onThumbPointerDown = (e) => {
		this.scrollbarVis.onThumbPointerDown(e.x);
	};
	onDragScroll = (e) => {
		this.scrollbarVis.xOnDragScroll(e.x);
	};
	onThumbPointerUp = () => {
		this.scrollbarVis.onThumbPointerUp();
	};
	onThumbPositionChange = () => {
		this.scrollbarVis.xOnThumbPositionChange();
	};
	onWheelScroll = (e, t) => {
		if (!this.root.viewportNode) return;
		let n = this.root.viewportNode.scrollLeft + e.deltaX;
		this.scrollbarVis.xOnWheelScroll(n), Xt(n, t) && e.preventDefault();
	};
	onResize = () => {
		this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle && this.scrollbarVis.setSizes({
			content: this.root.viewportNode.scrollWidth,
			viewport: this.root.viewportNode.offsetWidth,
			scrollbar: {
				size: this.scrollbar.opts.ref.current.clientWidth,
				paddingStart: Wt(this.computedStyle.paddingLeft),
				paddingEnd: Wt(this.computedStyle.paddingRight)
			}
		});
	};
	#t = m(() => Kt(this.scrollbarVis.sizes));
	get thumbSize() {
		return k(this.#t);
	}
	set thumbSize(e) {
		v(this.#t, e);
	}
	#n = m(() => ({
		id: this.scrollbar.opts.id.current,
		"data-orientation": "horizontal",
		style: {
			bottom: 0,
			left: this.root.opts.dir.current === "rtl" ? "var(--bits-scroll-area-corner-width)" : 0,
			right: this.root.opts.dir.current === "ltr" ? "var(--bits-scroll-area-corner-width)" : 0,
			"--bits-scroll-area-thumb-width": `${this.thumbSize}px`
		},
		...this.attachment
	}));
	get props() {
		return k(this.#n);
	}
	set props(e) {
		v(this.#n, e);
	}
}, Vt = class e {
	static create(t) {
		return jt.set(new e(t, At.get()));
	}
	opts;
	scrollbarVis;
	root;
	scrollbar;
	attachment;
	#e = f();
	get computedStyle() {
		return k(this.#e);
	}
	set computedStyle(e) {
		v(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = M(this.scrollbar.opts.ref, (e) => this.root.scrollbarYNode = e), O(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), O(() => {
			this.onResize();
		}), this.onThumbPointerDown = this.onThumbPointerDown.bind(this), this.onDragScroll = this.onDragScroll.bind(this), this.onThumbPointerUp = this.onThumbPointerUp.bind(this), this.onThumbPositionChange = this.onThumbPositionChange.bind(this), this.onWheelScroll = this.onWheelScroll.bind(this), this.onResize = this.onResize.bind(this);
	}
	onThumbPointerDown(e) {
		this.scrollbarVis.onThumbPointerDown(e.y);
	}
	onDragScroll(e) {
		this.scrollbarVis.yOnDragScroll(e.y);
	}
	onThumbPointerUp() {
		this.scrollbarVis.onThumbPointerUp();
	}
	onThumbPositionChange() {
		this.scrollbarVis.yOnThumbPositionChange();
	}
	onWheelScroll(e, t) {
		if (!this.root.viewportNode) return;
		let n = this.root.viewportNode.scrollTop + e.deltaY;
		this.scrollbarVis.yOnWheelScroll(n), Xt(n, t) && e.preventDefault();
	}
	onResize() {
		this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle && this.scrollbarVis.setSizes({
			content: this.root.viewportNode.scrollHeight,
			viewport: this.root.viewportNode.offsetHeight,
			scrollbar: {
				size: this.scrollbar.opts.ref.current.clientHeight,
				paddingStart: Wt(this.computedStyle.paddingTop),
				paddingEnd: Wt(this.computedStyle.paddingBottom)
			}
		});
	}
	#t = m(() => Kt(this.scrollbarVis.sizes));
	get thumbSize() {
		return k(this.#t);
	}
	set thumbSize(e) {
		v(this.#t, e);
	}
	#n = m(() => ({
		id: this.scrollbar.opts.id.current,
		"data-orientation": "vertical",
		style: {
			top: 0,
			right: this.root.opts.dir.current === "ltr" ? 0 : void 0,
			left: this.root.opts.dir.current === "rtl" ? 0 : void 0,
			bottom: "var(--bits-scroll-area-corner-height)",
			"--bits-scroll-area-thumb-height": `${this.thumbSize}px`
		},
		...this.attachment
	}));
	get props() {
		return k(this.#n);
	}
	set props(e) {
		v(this.#n, e);
	}
}, Ht = class e {
	static create() {
		return Mt.set(new e(jt.get()));
	}
	scrollbarState;
	root;
	scrollbarVis;
	scrollbar;
	#e = f(null);
	get rect() {
		return k(this.#e);
	}
	set rect(e) {
		v(this.#e, e);
	}
	#t = f("");
	get prevWebkitUserSelect() {
		return k(this.#t);
	}
	set prevWebkitUserSelect(e) {
		v(this.#t, e, !0);
	}
	handleResize;
	handleThumbPositionChange;
	handleWheelScroll;
	handleThumbPointerDown;
	handleThumbPointerUp;
	#n = m(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport);
	get maxScrollPos() {
		return k(this.#n);
	}
	set maxScrollPos(e) {
		v(this.#n, e);
	}
	constructor(e) {
		this.scrollbarState = e, this.root = e.root, this.scrollbarVis = e.scrollbarVis, this.scrollbar = e.scrollbarVis.scrollbar, this.handleResize = () => this.scrollbarState.onResize(), this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange, this.handleWheelScroll = this.scrollbarState.onWheelScroll, this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown, this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp, O(() => {
			let e = this.maxScrollPos, t = this.scrollbar.opts.ref.current;
			return this.root.viewportNode, s(this.root.domContext.getDocument(), "wheel", (n) => {
				let r = n.target;
				t?.contains(r) && this.handleWheelScroll(n, e);
			}, { passive: !1 });
		}), h(() => {
			this.scrollbarVis.sizes, D(() => this.handleThumbPositionChange());
		}), new Ct(() => this.scrollbar.opts.ref.current, this.handleResize), new Ct(() => this.root.contentNode, this.handleResize), this.onpointerdown = this.onpointerdown.bind(this), this.onpointermove = this.onpointermove.bind(this), this.onpointerup = this.onpointerup.bind(this), this.onlostpointercapture = this.onlostpointercapture.bind(this);
	}
	handleDragScroll(e) {
		if (!this.rect) return;
		let t = e.clientX - this.rect.left, n = e.clientY - this.rect.top;
		this.scrollbarState.onDragScroll({
			x: t,
			y: n
		});
	}
	#r() {
		this.rect !== null && (this.root.domContext.getDocument().body.style.webkitUserSelect = this.prevWebkitUserSelect, this.root.viewportNode && (this.root.viewportNode.style.scrollBehavior = ""), this.rect = null);
	}
	onpointerdown(e) {
		e.button === 0 && (e.target.setPointerCapture(e.pointerId), this.rect = this.scrollbar.opts.ref.current?.getBoundingClientRect() ?? null, this.prevWebkitUserSelect = this.root.domContext.getDocument().body.style.webkitUserSelect, this.root.domContext.getDocument().body.style.webkitUserSelect = "none", this.root.viewportNode && (this.root.viewportNode.style.scrollBehavior = "auto"), this.handleDragScroll(e));
	}
	onpointermove(e) {
		this.handleDragScroll(e);
	}
	onpointerup(e) {
		let t = e.target;
		t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this.#r();
	}
	onlostpointercapture(e) {
		this.#r();
	}
	#i = m(() => I({
		...this.scrollbarState.props,
		style: {
			position: "absolute",
			...this.scrollbarState.props.style
		},
		[Ot.scrollbar]: "",
		onpointerdown: this.onpointerdown,
		onpointermove: this.onpointermove,
		onpointerup: this.onpointerup,
		onlostpointercapture: this.onlostpointercapture
	}));
	get props() {
		return k(this.#i);
	}
	set props(e) {
		v(this.#i, e);
	}
}, Ut = class e {
	static create(t) {
		return new e(t, Mt.get());
	}
	opts;
	scrollbarState;
	attachment;
	#e;
	#t = f();
	#n = de(() => {
		k(this.#t) && (k(this.#t)(), v(this.#t, void 0));
	}, 100);
	constructor(e, t) {
		this.opts = e, this.scrollbarState = t, this.#e = t.root, this.attachment = M(this.opts.ref, (e) => this.scrollbarState.scrollbarVis.thumbNode = e), O(() => {
			let e = this.#e.viewportNode;
			return e ? (D(() => this.scrollbarState.handleThumbPositionChange()), s(e, "scroll", () => {
				if (this.#n(), !k(this.#t)) {
					let t = Zt(e, this.scrollbarState.handleThumbPositionChange);
					v(this.#t, t, !0), this.scrollbarState.handleThumbPositionChange();
				}
			})) : void 0;
		}), this.onpointerdowncapture = this.onpointerdowncapture.bind(this), this.onpointerup = this.onpointerup.bind(this);
	}
	onpointerdowncapture(e) {
		let t = e.target;
		if (!t) return;
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top;
		this.scrollbarState.handleThumbPointerDown({
			x: r,
			y: i
		});
	}
	onpointerup(e) {
		this.scrollbarState.handleThumbPointerUp();
	}
	#r = m(() => ({
		id: this.opts.id.current,
		"data-state": this.scrollbarState.scrollbarVis.hasThumb ? "visible" : "hidden",
		style: {
			width: "var(--bits-scroll-area-thumb-width)",
			height: "var(--bits-scroll-area-thumb-height)",
			transform: this.scrollbarState.scrollbarVis.prevTransformStyle
		},
		onpointerdowncapture: this.onpointerdowncapture,
		onpointerup: this.onpointerup,
		[Ot.thumb]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#r);
	}
	set props(e) {
		v(this.#r, e);
	}
};
function Wt(e) {
	return e ? Number.parseInt(e, 10) : 0;
}
function Gt(e, t) {
	let n = e / t;
	return Number.isNaN(n) ? 0 : n;
}
function Kt(e) {
	let t = Gt(e.viewport, e.content), n = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, r = (e.scrollbar.size - n) * t;
	return Math.max(r, 18);
}
function qt({ pointerPos: e, pointerOffset: t, sizes: n, dir: r = "ltr" }) {
	let i = Kt(n), a = i / 2, o = t || a, s = i - o, c = n.scrollbar.paddingStart + o, l = n.scrollbar.size - n.scrollbar.paddingEnd - s, u = n.content - n.viewport, d = r === "ltr" ? [0, u] : [u * -1, 0];
	return Yt([c, l], d)(e);
}
function Jt({ scrollPos: e, sizes: t, dir: n = "ltr" }) {
	let r = Kt(t), i = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, a = t.scrollbar.size - i, o = t.content - t.viewport, s = a - r, c = n === "ltr" ? [0, o] : [o * -1, 0], l = Et(e, c[0], c[1]);
	return Yt([0, o], [0, s])(l);
}
function Yt(e, t) {
	return (n) => {
		if (e[0] === e[1] || t[0] === t[1]) return t[0];
		let r = (t[1] - t[0]) / (e[1] - e[0]);
		return t[0] + r * (n - e[0]);
	};
}
function Xt(e, t) {
	return e > 0 && e < t;
}
function Zt(e, t) {
	let n = {
		left: e.scrollLeft,
		top: e.scrollTop
	}, r = 0, i = ae(e);
	return (function a() {
		let o = {
			left: e.scrollLeft,
			top: e.scrollTop
		}, s = n.left !== o.left, c = n.top !== o.top;
		(s || c) && t(), n = o, r = i.requestAnimationFrame(a);
	})(), () => i.cancelAnimationFrame(r);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area.svelte
var Qt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"type",
	"dir",
	"scrollHideDelay",
	"children",
	"child"
]), $t = n("<div><!></div>");
function en(e, t) {
	let n = T();
	l(t, !0);
	let r = E(t, "ref", 15, null), i = E(t, "id", 19, () => L(n)), s = E(t, "type", 3, "hover"), f = E(t, "dir", 3, "ltr"), p = E(t, "scrollHideDelay", 3, 600), h = y(t, Qt), g = Nt.create({
		type: R(() => s()),
		dir: R(() => f()),
		scrollHideDelay: R(() => p()),
		id: R(() => i()),
		ref: R(() => r(), (e) => r(e))
	}), v = m(() => I(h, g.props));
	var x = d(), S = A(x), ee = (e) => {
		var n = d(), r = A(n);
		o(r, () => t.child, () => ({ props: k(v) })), u(e, n);
	}, w = (e) => {
		var n = $t();
		_(n, () => ({ ...k(v) }));
		var r = C(n);
		o(r, () => t.children ?? a), b(n), u(e, n);
	};
	c(S, (e) => {
		t.child ? e(ee) : e(w, -1);
	}), u(e, x), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-viewport.svelte
var tn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"children"
]), nn = n("<div><div><!></div></div>"), rn = {
	hash: "svelte-1gl71oa",
	code: "\n	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */[data-scroll-area-viewport] {scrollbar-width:none !important;-ms-overflow-style:none !important;-webkit-overflow-scrolling:touch !important;}[data-scroll-area-viewport]::-webkit-scrollbar {display:none !important;}:where([data-scroll-area-viewport]) {display:flex;flex-direction:column;align-items:stretch;}:where([data-scroll-area-content]) {flex-grow:1;}"
};
function an(e, t) {
	let n = T();
	l(t, !0), x(e, rn);
	let r = E(t, "ref", 15, null), i = E(t, "id", 19, () => L(n)), s = y(t, tn), c = Pt.create({
		id: R(() => i()),
		ref: R(() => r(), (e) => r(e))
	}), d = m(() => I(s, c.props)), f = m(() => I({}, c.contentProps));
	var p = nn();
	_(p, () => ({ ...k(d) }));
	var h = C(p);
	_(h, () => ({ ...k(f) }));
	var g = C(h);
	o(g, () => t.children ?? a), b(h), b(p), u(e, p), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-shared.svelte
var on = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children"
]), sn = n("<div><!></div>");
function cn(e, t) {
	l(t, !0);
	let n = y(t, on), r = Ht.create(), i = m(() => I(n, r.props));
	var s = d(), f = A(s), p = (e) => {
		var n = d(), r = A(n);
		o(r, () => t.child, () => ({ props: k(i) })), u(e, n);
	}, h = (e) => {
		var n = sn();
		_(n, () => ({ ...k(i) }));
		var r = C(n);
		o(r, () => t.children ?? a), b(n), u(e, n);
	};
	c(f, (e) => {
		t.child ? e(p) : e(h, -1);
	}), u(e, s), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-x.svelte
var ln = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function un(e, t) {
	l(t, !0);
	let n = y(t, ln), r = new N(), i = Bt.create({ mounted: R(() => r.current) }), a = m(() => I(n, i.props));
	cn(e, p(() => k(a))), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-y.svelte
var dn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function fn(e, t) {
	l(t, !0);
	let n = y(t, dn), r = new N(), i = Vt.create({ mounted: R(() => r.current) }), a = m(() => I(n, i.props));
	cn(e, p(() => k(a))), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-visible.svelte
var pn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function mn(e, t) {
	l(t, !0);
	let n = y(t, pn), r = zt.create();
	var i = d(), a = A(i), o = (e) => {
		un(e, p(() => n));
	}, s = (e) => {
		fn(e, p(() => n));
	};
	c(a, (e) => {
		r.scrollbar.opts.orientation.current === "horizontal" ? e(o) : e(s, -1);
	}), u(e, i), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-auto.svelte
var hn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function gn(e, t) {
	l(t, !0);
	let n = E(t, "forceMount", 3, !1), r = y(t, hn), i = Rt.create(), a = m(() => I(r, i.props));
	{
		let t = (e) => {
			mn(e, p(() => k(a)));
		}, r = m(() => n() || i.isVisible);
		Tt(e, {
			get open() {
				return k(r);
			},
			get ref() {
				return i.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		});
	}
	j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-scroll.svelte
var _n = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function vn(e, t) {
	l(t, !0);
	let n = E(t, "forceMount", 3, !1), r = y(t, _n), i = Lt.create(), a = m(() => I(r, i.props));
	{
		let t = (e) => {
			mn(e, p(() => k(a)));
		}, r = m(() => n() || !i.isHidden);
		Tt(e, p(() => k(a), {
			get open() {
				return k(r);
			},
			get ref() {
				return i.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		}));
	}
	j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-hover.svelte
var yn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function bn(e, t) {
	l(t, !0);
	let n = E(t, "forceMount", 3, !1), r = y(t, yn), i = It.create(), a = Rt.create(), o = m(() => I(r, i.props, a.props, { "data-state": i.isVisible ? "visible" : "hidden" })), s = m(() => n() || i.isVisible && a.isVisible);
	Tt(e, {
		get open() {
			return k(s);
		},
		get ref() {
			return a.scrollbar.opts.ref;
		},
		presence: (e) => {
			mn(e, p(() => k(o)));
		},
		$$slots: { presence: !0 }
	}), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar.svelte
var xn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"orientation"
]);
function Sn(e, t) {
	let n = T();
	l(t, !0);
	let r = E(t, "ref", 15, null), i = E(t, "id", 19, () => L(n)), a = y(t, xn), o = Ft.create({
		orientation: R(() => t.orientation),
		id: R(() => i()),
		ref: R(() => r(), (e) => r(e))
	}), s = m(() => o.root.opts.type.current);
	var f = d(), h = A(f), g = (e) => {
		bn(e, p(() => a, { get id() {
			return i();
		} }));
	}, _ = (e) => {
		vn(e, p(() => a, { get id() {
			return i();
		} }));
	}, v = (e) => {
		gn(e, p(() => a, { get id() {
			return i();
		} }));
	}, b = (e) => {
		mn(e, p(() => a, { get id() {
			return i();
		} }));
	};
	c(h, (e) => {
		k(s) === "hover" ? e(g) : k(s) === "scroll" ? e(_, 1) : k(s) === "auto" ? e(v, 2) : k(s) === "always" && e(b, 3);
	}), u(e, f), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-thumb-impl.svelte
var Cn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"child",
	"children",
	"present"
]), wn = n("<div><!></div>");
function Tn(e, t) {
	l(t, !0);
	let n = E(t, "ref", 15, null), r = y(t, Cn), i = new N(), s = Ut.create({
		id: R(() => t.id),
		ref: R(() => n(), (e) => n(e)),
		mounted: R(() => i.current)
	}), f = m(() => I(r, s.props, { style: { hidden: !t.present } }));
	var p = d(), h = A(p), g = (e) => {
		var n = d(), r = A(n);
		o(r, () => t.child, () => ({ props: k(f) })), u(e, n);
	}, v = (e) => {
		var n = wn();
		_(n, () => ({ ...k(f) }));
		var r = C(n);
		o(r, () => t.children ?? a), b(n), u(e, n);
	};
	c(h, (e) => {
		t.child ? e(g) : e(v, -1);
	}), u(e, p), j();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-thumb.svelte
var En = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"forceMount"
]);
function Dn(e, t) {
	let n = T();
	l(t, !0);
	let r = E(t, "id", 19, () => L(n)), i = E(t, "ref", 15, null), a = E(t, "forceMount", 3, !1), o = y(t, En), s = At.get();
	{
		let t = (e, t) => {
			let n = () => (t?.()).present;
			Tn(e, p(() => o, {
				get id() {
					return r();
				},
				get present() {
					return n();
				},
				get ref() {
					return i();
				},
				set ref(e) {
					i(e);
				}
			}));
		}, n = m(() => a() || s.hasThumb);
		Tt(e, {
			get open() {
				return k(n);
			},
			get ref() {
				return s.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		});
	}
	j();
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/customEmojiStore.svelte.ts
var K = f(w([])), q = f(!1), J = f(null), Y = f(null), On = null, X = null, Z = 0, Q = 0, kn = 0, An = /* @__PURE__ */ new Map();
function jn(e) {
	return X !== e && (X = e, Z += 1), Z;
}
function Mn(e) {
	return Q += 1, {
		loadKey: e,
		ownerEpoch: jn(e),
		generation: Q
	};
}
function $(e) {
	return X === e.loadKey && Z === e.ownerEpoch && Q === e.generation;
}
function Nn(e) {
	return kn += 1, {
		loadKey: e,
		ownerEpoch: jn(e),
		generation: kn,
		foregroundGeneration: Q
	};
}
function Pn(e) {
	return X === e.loadKey && Z === e.ownerEpoch && kn === e.generation && Q === e.foregroundGeneration;
}
function Fn() {
	v(K, [], !0), v(q, !1), v(J, null), v(Y, null), On = null, X = null;
}
function In() {
	Z += 1, v(q, !1);
}
function Ln(e) {
	let t = An.get(e);
	if (t) return t;
	let n = Ee(e).finally(() => {
		An.delete(e);
	});
	return An.set(e, n), n;
}
async function Rn(e, t) {
	let n = await Ln(e.loadKey);
	return !t() || n.length === 0 ? !1 : (v(K, n, !0), v(J, null), v(Y, e.loadKey, !0), !0);
}
var zn = {
	get items() {
		return k(K);
	},
	get loading() {
		return k(q);
	},
	get error() {
		return k(J);
	},
	async prefetchCache(e) {
		if (!e.pubkey) return;
		let t = e.pubkey;
		if (k(Y) === t && k(K).length > 0) return;
		let n = Nn(t);
		try {
			if (k(q) && X === t) return;
			await Rn(n, () => Pn(n));
		} catch {}
	},
	async load(e) {
		if (!e.rxNostr || !e.pubkey) {
			Z += 1, Fn();
			return;
		}
		let t = e.pubkey, n = Mn(t);
		if (!e.force && On === t && k(K).length > 0) return;
		let r = e.force ? !1 : k(Y) === t && k(K).length > 0 || await Rn(n, () => $(n));
		if ($(n)) {
			v(q, !r), v(J, null), v(Y, t, !0);
			try {
				let t = await we({
					rxNostr: e.rxNostr,
					pubkey: e.pubkey
				});
				if (!$(n) || (v(K, t, !0), await Te(n.loadKey, t), !$(n))) return;
				De(t.map((e) => e.src)), On = n.loadKey;
			} catch {
				if (!$(n)) return;
				v(J, "customEmoji.load_failed"), r || v(K, [], !0);
			} finally {
				$(n) && v(q, !1);
			}
		}
	},
	invalidatePendingLoads() {
		In();
	},
	reset() {
		In(), Fn(), An.clear();
	}
};
export { en as a, Ze as c, He as d, an as i, ze as l, Dn as n, it as o, Sn as r, tt as s, zn as t, Be as u };
