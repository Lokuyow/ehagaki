import { $ as e, A as t, At as n, Et as r, G as i, J as a, K as o, Mt as s, Nt as c, P as l, R as u, Tt as d, V as f, W as p, Y as m, _ as h, a as g, ct as _, dt as v, gt as y, i as b, it as x, jt as ee, lt as S, mt as C, nt as w, pt as T, r as E, st as te, ut as D, vt as O, xt as k, y as ne, z as A } from "./index-client-XkLzkVYC.js";
import { B as j, C as re, E as ie, F as ae, G as oe, J as M, K as se, M as ce, O as le, Q as N, S as ue, V as de, X as P, Z as fe, c as pe, dt as me, et as F, i as he, j as ge, nt as _e, o as I, q as ve, r as ye, s as be, st as L, w as xe, x as Se } from "./LoadingPlaceholder-lit91akO.js";
import { t as Ce } from "./sr-only-styles-CUOVv6Ud.js";
import { t as we } from "./after-sleep-mvoNP8rL.js";
import { a as Te, g as Ee, m as De, n as Oe } from "./customEmoji-DDC4uHz2.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/utils.js
function ke(e, t) {
	let n = e.nextElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.nextElementSibling;
	}
}
function Ae(e, t) {
	let n = e.previousElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.previousElementSibling;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/css-escape.js
function je(e) {
	if (typeof CSS < "u" && typeof CSS.escape == "function") return CSS.escape(e);
	let t = e.length, n = -1, r, i = "", a = e.charCodeAt(0);
	if (t === 1 && a === 45) return "\\" + e;
	for (; ++n < t;) r = e.charCodeAt(n), i += r === 0 ? "�" : r >= 1 && r <= 31 || r === 127 || n === 0 && r >= 48 && r <= 57 || n === 1 && r >= 48 && r <= 57 && a === 45 ? "\\" + r.toString(16) + " " : r >= 128 || r === 45 || r === 95 || r >= 48 && r <= 57 || r >= 65 && r <= 90 || r >= 97 && r <= 122 ? e.charAt(n) : "\\" + e.charAt(n);
	return i;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/command.svelte.js
var R = "data-value", z = ae({
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
}), B = z.selector("group"), Me = z.selector("group-items"), Ne = z.selector("group-heading"), Pe = z.selector("item"), Fe = `${z.selector("item")}:not([aria-disabled="true"])`, V = new N("Command.Root"), Ie = new N("Command.List"), Le = new N("Command.Group"), Re = {
	search: "",
	value: "",
	filtered: {
		count: 0,
		items: /* @__PURE__ */ new Map(),
		groups: /* @__PURE__ */ new Set()
	}
}, ze = class e {
	static create(t) {
		return V.set(new e(t));
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
	#r = O(0);
	get key() {
		return w(this.#r);
	}
	set key(e) {
		y(this.#r, e, !0);
	}
	#i = O(null);
	get viewportNode() {
		return w(this.#i);
	}
	set viewportNode(e) {
		y(this.#i, e, !0);
	}
	#a = O(null);
	get inputNode() {
		return w(this.#a);
	}
	set inputNode(e) {
		y(this.#a, e, !0);
	}
	#o = O(null);
	get labelNode() {
		return w(this.#o);
	}
	set labelNode(e) {
		y(this.#o, e, !0);
	}
	#s = O(Re);
	get commandState() {
		return w(this.#s);
	}
	set commandState(e) {
		y(this.#s, e);
	}
	#c = O(C(Re));
	get _commandState() {
		return w(this.#c);
	}
	set _commandState(e) {
		y(this.#c, e, !0);
	}
	#l() {
		return n(this._commandState);
	}
	#u(e) {
		se(() => {
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
		this.opts = e, this.attachment = j(this.opts.ref);
		let t = {
			...this._commandState,
			value: this.opts.value.current ?? ""
		};
		this._commandState = t, this.commandState = t, this.onkeydown = this.onkeydown.bind(this), ve(() => {
			this.#n = !0;
		});
	}
	#f(e, t) {
		let n = this.opts.filter.current ?? bt;
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
			let t = e.closest(Me);
			if (t) {
				let n = e.parentElement === t ? e : e.closest(`${Me} > *`);
				n && t.appendChild(n);
			} else {
				let t = e.parentElement === r ? e : e.closest(`${Me} > *`);
				t && r?.appendChild(t);
			}
		}
		let a = n.sort((e, t) => t[1] - e[1]);
		for (let e of a) {
			let t = r?.querySelector(`${B}[${R}="${je(e[0])}"]`);
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
			let e = this.getValidItems().find((e) => e.getAttribute("aria-disabled") !== "true")?.getAttribute(R), t = this.#t && this.opts.disableInitialScroll.current;
			this.setValue(e ?? "", t), this.#t = !1;
		});
	}
	#h(e) {
		se(() => {
			this._commandState.value === e && (this.getValidItems().some((t) => t.getAttribute(R) === e) || this.#m());
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
		return e ? Array.from(e.querySelectorAll(Fe)).filter((e) => !!e) : [];
	}
	getVisibleItems() {
		let e = this.opts.ref.current;
		return e ? Array.from(e.querySelectorAll(Pe)).filter((e) => !!e) : [];
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
		let t = e.querySelector(`${Fe}[data-selected]`);
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
						(e?.closest(B)?.querySelector(Ne))?.scrollIntoView({ block: "nearest" });
						return;
					}
				} else {
					let n = he(t);
					if (n && n.dataset?.value === e.dataset?.value) {
						let t = e?.closest(B)?.querySelector(Ne);
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
		t && this.setValue(t.getAttribute(R) ?? "");
	}
	updateSelectedByItem(e) {
		let t = this.#v(), n = this.getValidItems(), r = n.findIndex((e) => e === t), i = n[r + e];
		this.opts.loop.current && (i = r + e < 0 ? n[n.length - 1] : r + e === n.length ? n[0] : n[r + e]), i && this.setValue(i.getAttribute(R) ?? "");
	}
	updateSelectedByGroup(e) {
		let t = this.#v()?.closest(B), n;
		for (; t && !n;) t = e > 0 ? ke(t, B) : Ae(t, B), n = t?.querySelector(Fe);
		n ? this.setValue(n.getAttribute(R) ?? "") : this.updateSelectedByItem(e);
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
				let e = t.getAttribute(R);
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
			if (i = e[r]?.ref ?? null, i !== null && H(i)) i = null;
			else {
				if (i === null) for (let t = e.length - 1; t >= 0; t--) {
					let t = e[e.length - 1];
					if (!(t === void 0 || H(t.ref))) {
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
				if (i = e[r]?.ref ?? null, i !== null && H(i)) i = null;
				else {
					if (i === null) for (let t = e.length - 1; t >= 0; t--) {
						let t = e[e.length - 1];
						if (!(t === void 0 || H(t.ref))) {
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
			case Se:
				this.isGrid ? this.#C(e) : this.#S(e);
				break;
			case re:
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
			case xe:
				this.isGrid ? this.#O(e) : this.#j(e);
				break;
			case ue:
				if (!this.isGrid) break;
				this.#j(e);
				break;
			case le:
				e.preventDefault(), this.updateSelectedToIndex(0);
				break;
			case "End":
				e.preventDefault(), this.#x();
				break;
			case ie: if (!e.isComposing && e.keyCode !== 229) {
				e.preventDefault();
				let t = this.#v();
				t && t?.click();
			}
		}
	}
	#M = k(() => ({
		id: this.opts.id.current,
		role: "application",
		[z.root]: "",
		tabindex: -1,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return w(this.#M);
	}
	set props(e) {
		y(this.#M, e);
	}
};
function H(e) {
	return e.getAttribute("aria-disabled") === "true";
}
var Be = class e {
	static create(t) {
		return new e(t, V.get());
	}
	opts;
	root;
	attachment;
	#e = k(() => this.root._commandState.filtered.count === 0 && this.#t === !1 || this.opts.forceMount.current);
	get shouldRender() {
		return w(this.#e);
	}
	set shouldRender(e) {
		y(this.#e, e);
	}
	#t = !0;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = j(this.opts.ref), S(() => {
			this.#t = !1;
		});
	}
	#n = k(() => ({
		id: this.opts.id.current,
		role: "presentation",
		[z.empty]: "",
		...this.attachment
	}));
	get props() {
		return w(this.#n);
	}
	set props(e) {
		y(this.#n, e);
	}
}, Ve = class e {
	static create(t) {
		return new e(t, V.get());
	}
	opts;
	root;
	attachment;
	#e = k(() => {
		let e = this.root.viewportNode?.querySelector(`${Pe}[${R}="${je(this.root.opts.value.current)}"]`);
		if (e != null) return e.getAttribute("id") ?? void 0;
	});
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = j(this.opts.ref, (e) => this.root.inputNode = e), P(() => this.opts.ref.current, () => {
			let e = this.opts.ref.current;
			e && this.opts.autofocus.current && we(10, () => e.focus());
		}), P(() => this.opts.value.current, () => {
			this.root.commandState.search !== this.opts.value.current && this.root.setState("search", this.opts.value.current);
		});
	}
	#t = k(() => ({
		id: this.opts.id.current,
		type: "text",
		[z.input]: "",
		autocomplete: "off",
		autocorrect: "off",
		spellcheck: !1,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": ce(!0),
		"aria-controls": this.root.viewportNode?.id ?? void 0,
		"aria-labelledby": this.root.labelNode?.id ?? void 0,
		"aria-activedescendant": w(this.#e),
		...this.attachment
	}));
	get props() {
		return w(this.#t);
	}
	set props(e) {
		y(this.#t, e);
	}
}, He = class e {
	static create(t) {
		let n = Le.getOr(null);
		return new e({
			...t,
			group: n
		}, V.get());
	}
	opts;
	root;
	attachment;
	#e = null;
	#t = k(() => this.opts.forceMount.current || this.#e?.opts.forceMount.current === !0);
	#n = k(() => {
		if (this.opts.ref.current, w(this.#t) || this.root.opts.shouldFilter.current === !1 || !this.root.commandState.search) return !0;
		let e = this.root.commandState.filtered.items.get(this.trueValue);
		return e !== void 0 && e > 0;
	});
	get shouldRender() {
		return w(this.#n);
	}
	set shouldRender(e) {
		y(this.#n, e);
	}
	#r = k(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
	get isSelected() {
		return w(this.#r);
	}
	set isSelected(e) {
		y(this.#r, e);
	}
	#i = O("");
	get trueValue() {
		return w(this.#i);
	}
	set trueValue(e) {
		y(this.#i, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#e = Le.getOr(null), this.trueValue = e.value.current, this.attachment = j(this.opts.ref), P([
			() => this.trueValue,
			() => this.#e?.trueValue,
			() => this.opts.forceMount.current
		], () => {
			if (!this.opts.forceMount.current && this.trueValue) return this.root.registerItem(this.trueValue, this.#e?.trueValue);
		}), P([() => this.opts.value.current, () => this.opts.ref.current], () => {
			this.opts.value.current ? this.trueValue = this.opts.value.current : this.opts.ref.current?.textContent && (this.trueValue = this.opts.ref.current.textContent.trim()), this.trueValue && (this.root.registerValue(this.trueValue, e.keywords.current.map((e) => e.trim())), this.opts.ref.current?.setAttribute(R, this.trueValue));
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
	#s = k(() => ({
		id: this.opts.id.current,
		"aria-disabled": ce(this.opts.disabled.current),
		"aria-selected": ce(this.isSelected),
		"data-disabled": ge(this.opts.disabled.current),
		"data-selected": ge(this.isSelected),
		"data-value": this.trueValue,
		"data-group": this.#e?.trueValue,
		[z.item]: "",
		role: "option",
		onpointermove: this.onpointermove,
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return w(this.#s);
	}
	set props(e) {
		y(this.#s, e);
	}
}, Ue = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = j(this.opts.ref);
	}
	#e = k(() => ({
		id: this.opts.id.current,
		role: "progressbar",
		"aria-valuenow": this.opts.progress.current,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": "Loading...",
		[z.loading]: "",
		...this.attachment
	}));
	get props() {
		return w(this.#e);
	}
	set props(e) {
		y(this.#e, e);
	}
}, We = class e {
	static create(t) {
		return Ie.set(new e(t, V.get()));
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = j(this.opts.ref);
	}
	#e = k(() => ({
		id: this.opts.id.current,
		role: "listbox",
		"aria-label": this.opts.ariaLabel.current,
		[z.list]: "",
		...this.attachment
	}));
	get props() {
		return w(this.#e);
	}
	set props(e) {
		y(this.#e, e);
	}
}, Ge = class e {
	static create(t) {
		return new e(t, V.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = j(this.opts.ref, (e) => this.root.labelNode = e);
	}
	#e = k(() => ({
		id: this.opts.id.current,
		[z["input-label"]]: "",
		for: this.opts.for?.current,
		style: Ce,
		...this.attachment
	}));
	get props() {
		return w(this.#e);
	}
	set props(e) {
		y(this.#e, e);
	}
}, Ke = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children"
]), qe = o("<label><!></label>");
function Je(e, t) {
	let n = a();
	r(t, !0);
	let i = E(t, "id", 19, () => I(n)), o = E(t, "ref", 15, null), u = b(t, Ke), f = Ge.create({
		id: L(() => i()),
		ref: L(() => o(), (e) => o(e))
	}), m = k(() => F(u, f.props));
	var g = qe();
	h(g, () => ({ ...w(m) }));
	var _ = D(g);
	l(_, () => t.children ?? c), s(g), p(e, g), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command.svelte
var Ye = /* @__PURE__ */ new Set([
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
]), Xe = o("<!> <!>", 1), Ze = o("<div><!> <!></div>");
function Qe(e, t) {
	let n = a();
	r(t, !0);
	let o = (e) => {
		Je(e, {
			children: (e, t) => {
				ee();
				var n = m();
				te(() => f(n, ne())), p(e, n);
			},
			$$slots: { default: !0 }
		});
	}, u = E(t, "id", 19, () => I(n)), g = E(t, "ref", 15, null), _ = E(t, "value", 15, ""), y = E(t, "onValueChange", 3, be), x = E(t, "onStateChange", 3, be), S = E(t, "loop", 3, !1), C = E(t, "shouldFilter", 3, !0), O = E(t, "filter", 3, bt), ne = E(t, "label", 3, ""), j = E(t, "vimBindings", 3, !0), re = E(t, "disablePointerSelection", 3, !1), ie = E(t, "disableInitialScroll", 3, !1), ae = E(t, "columns", 3, null), oe = b(t, Ye), M = ze.create({
		id: L(() => u()),
		ref: L(() => g(), (e) => g(e)),
		filter: L(() => O()),
		shouldFilter: L(() => C()),
		loop: L(() => S()),
		value: L(() => _(), (e) => {
			_() !== e && (_(e), y()(e));
		}),
		vimBindings: L(() => j()),
		disablePointerSelection: L(() => re()),
		disableInitialScroll: L(() => ie()),
		onStateChange: L(() => x()),
		columns: L(() => ae())
	}), se = (e) => M.updateSelectedToIndex(e), ce = (e) => M.updateSelectedByGroup(e), le = (e) => M.updateSelectedByItem(e), N = () => M.getValidItems(), ue = k(() => F(oe, M.props));
	var de = {
		updateSelectedToIndex: se,
		updateSelectedByGroup: ce,
		updateSelectedByItem: le,
		getValidItems: N
	}, P = i(), fe = v(P), pe = (e) => {
		var n = Xe(), r = v(n);
		o(r);
		var i = T(r, 2);
		l(i, () => t.child, () => ({ props: w(ue) })), p(e, n);
	}, me = (e) => {
		var n = Ze();
		h(n, () => ({ ...w(ue) }));
		var r = D(n);
		o(r);
		var i = T(r, 2);
		l(i, () => t.children ?? c), s(n), p(e, n);
	};
	return A(fe, (e) => {
		t.child ? e(pe) : e(me, -1);
	}), p(e, P), d(de);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-item.svelte
var $e = /* @__PURE__ */ new Set([
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
]), et = o("<div><!></div>"), tt = o("<div style=\"display: contents;\" data-item-wrapper=\"\"><!></div>");
function nt(e, t) {
	let n = a();
	r(t, !0);
	let o = E(t, "id", 19, () => I(n)), f = E(t, "ref", 15, null), m = E(t, "value", 3, ""), g = E(t, "disabled", 3, !1), _ = E(t, "onSelect", 3, be), y = E(t, "forceMount", 3, !1), x = E(t, "keywords", 19, () => []), ee = b(t, $e), S = He.create({
		id: L(() => o()),
		ref: L(() => f(), (e) => f(e)),
		value: L(() => m()),
		disabled: L(() => g()),
		onSelect: L(() => _()),
		forceMount: L(() => y()),
		keywords: L(() => x())
	}), C = k(() => F(ee, S.props));
	var T = i(), O = v(T);
	u(O, () => S.root.key, (e) => {
		var n = tt(), r = D(n), a = (e) => {
			var n = i(), r = v(n), a = (e) => {
				var n = i(), r = v(n);
				l(r, () => t.child, () => ({ props: w(C) })), p(e, n);
			}, o = (e) => {
				var n = et();
				h(n, () => ({ ...w(C) }));
				var r = D(n);
				l(r, () => t.children ?? c), s(n), p(e, n);
			};
			A(r, (e) => {
				t.child ? e(a) : e(o, -1);
			}), p(e, n);
		};
		A(r, (e) => {
			S.shouldRender && e(a);
		}), s(n), te(() => ne(n, "data-value", S.trueValue)), p(e, n);
	}), p(e, T), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-list.svelte
var rt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"aria-label"
]), it = o("<div><!></div>");
function at(e, t) {
	let n = a();
	r(t, !0);
	let o = E(t, "id", 19, () => I(n)), f = E(t, "ref", 15, null), m = b(t, rt), g = We.create({
		id: L(() => o()),
		ref: L(() => f(), (e) => f(e)),
		ariaLabel: L(() => t["aria-label"] ?? "Suggestions...")
	}), _ = k(() => F(m, g.props));
	var y = i(), x = v(y);
	u(x, () => g.root.opts.shouldFilter.current === !1 || g.root._commandState.search === "", (e) => {
		var n = i(), r = v(n), a = (e) => {
			var n = i(), r = v(n);
			l(r, () => t.child, () => ({ props: w(_) })), p(e, n);
		}, o = (e) => {
			var n = it();
			h(n, () => ({ ...w(_) }));
			var r = D(n);
			l(r, () => t.children ?? c), s(n), p(e, n);
		};
		A(r, (e) => {
			t.child ? e(a) : e(o, -1);
		}), p(e, n);
	}), p(e, y), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/compute-command-score.js
var ot = 1, st = .9, ct = .8, lt = .17, ut = .1, dt = .999, ft = .9999, pt = .99, mt = /[\\/_+.#"@[({&]/, ht = /[\\/_+.#"@[({&]/g, gt = /[\s-]/, _t = /[\s-]/g;
function vt(e, t, n, r, i, a, o) {
	if (a === t.length) return i === e.length ? ot : pt;
	let s = `${i},${a}`;
	if (o[s] !== void 0) return o[s];
	let c = r.charAt(a), l = n.indexOf(c, i), u = 0, d, f, p, m;
	for (; l >= 0;) d = vt(e, t, n, r, l + 1, a + 1, o), d > u && (l === i ? d *= ot : mt.test(e.charAt(l - 1)) ? (d *= ct, p = e.slice(i, l - 1).match(ht), p && i > 0 && (d *= dt ** p.length)) : gt.test(e.charAt(l - 1)) ? (d *= st, m = e.slice(i, l - 1).match(_t), m && i > 0 && (d *= dt ** m.length)) : (d *= lt, i > 0 && (d *= dt ** (l - i))), e.charAt(l) !== t.charAt(a) && (d *= ft)), (d < ut && n.charAt(l - 1) === r.charAt(a + 1) || r.charAt(a + 1) === r.charAt(a) && n.charAt(l - 1) !== r.charAt(a)) && (f = vt(e, t, n, r, l + 1, a + 2, o), f * ut > d && (d = f * ut)), d > u && (u = d), l = n.indexOf(c, l + 1);
	return o[s] = u, u;
}
function yt(e) {
	return e.toLowerCase().replace(_t, " ");
}
function bt(e, t, n) {
	return e = n && n.length > 0 ? `${`${e} ${n?.join(" ")}`}` : e, vt(e, t, yt(e), yt(t), 0, 0, {});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/svelte-resize-observer.svelte.js
var xt = null, U = /* @__PURE__ */ new WeakMap();
function St() {
	return xt ??= new ResizeObserver((e) => {
		for (let t of e) {
			let e = U.get(t.target);
			if (e) for (let t of [...e]) t();
		}
	}), xt;
}
function Ct(e, t) {
	let n = U.get(e);
	return n === void 0 ? (n = /* @__PURE__ */ new Set(), U.set(e, n), n.add(t), St().observe(e)) : (n.add(t), t()), () => {
		let n = U.get(e);
		n && (n.delete(t), !n.size && (U.delete(e), xt?.unobserve(e)));
	};
}
var W = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t, this.handler = this.handler.bind(this), _(this.handler);
	}
	handler() {
		let e = 0, t = this.#e();
		if (!t) return;
		let n = Ct(t, () => {
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
	#t = O(!1);
	#n = !1;
	#r = O(void 0);
	#i = null;
	constructor(e) {
		this.opts = e, this.present = this.opts.open, y(this.#t, e.open.current, !0), this.#e = new pe({
			ref: this.opts.ref,
			afterTick: this.opts.open
		}), ve(() => this.#o()), P(() => this.present.current, (e) => {
			this.#n ? (this.#o(), e && y(this.#t, !0), y(this.#r, e ? "starting" : "ending", !0), e && (this.#i = window.requestAnimationFrame(() => {
				this.#i = null, this.present.current && y(this.#r, void 0);
			})), this.#e.run(() => {
				e === this.present.current && (e || y(this.#t, !1), y(this.#r, void 0));
			})) : this.#n = !0;
		});
	}
	#a = k(() => w(this.#t));
	get isPresent() {
		return w(this.#a);
	}
	set isPresent(e) {
		y(this.#a, e);
	}
	get transitionStatus() {
		return w(this.#r);
	}
	#o() {
		this.#i !== null && (window.cancelAnimationFrame(this.#i), this.#i = null);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte
function Tt(e, t) {
	r(t, !0);
	let n = new wt({
		open: L(() => t.open),
		ref: x(() => t.ref)
	});
	var a = i(), o = v(a), s = (e) => {
		var r = i(), a = v(r);
		l(a, () => t.presence ?? c, () => ({
			present: n.isPresent,
			transitionStatus: n.transitionStatus
		})), p(e, r);
	};
	A(o, (e) => {
		(t.forceMount || t.open || n.isPresent) && e(s);
	}), p(e, a), d();
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
		this.state = me(e), this.#e = t, this.dispatch = this.dispatch.bind(this);
	}
	#t(e) {
		return this.#e[this.state.current][e] ?? this.state.current;
	}
	dispatch(e) {
		this.state.current = this.#t(e);
	}
}, Ot = ae({
	component: "scroll-area",
	parts: [
		"root",
		"viewport",
		"corner",
		"thumb",
		"scrollbar"
	]
}), kt = new N("ScrollArea.Root"), G = new N("ScrollArea.Scrollbar"), At = new N("ScrollArea.ScrollbarVisible"), jt = new N("ScrollArea.ScrollbarAxis"), Mt = new N("ScrollArea.ScrollbarShared"), Nt = class e {
	static create(t) {
		return kt.set(new e(t));
	}
	opts;
	attachment;
	#e = O(null);
	get scrollAreaNode() {
		return w(this.#e);
	}
	set scrollAreaNode(e) {
		y(this.#e, e, !0);
	}
	#t = O(null);
	get viewportNode() {
		return w(this.#t);
	}
	set viewportNode(e) {
		y(this.#t, e, !0);
	}
	#n = O(null);
	get contentNode() {
		return w(this.#n);
	}
	set contentNode(e) {
		y(this.#n, e, !0);
	}
	#r = O(null);
	get scrollbarXNode() {
		return w(this.#r);
	}
	set scrollbarXNode(e) {
		y(this.#r, e, !0);
	}
	#i = O(null);
	get scrollbarYNode() {
		return w(this.#i);
	}
	set scrollbarYNode(e) {
		y(this.#i, e, !0);
	}
	#a = O(0);
	get cornerWidth() {
		return w(this.#a);
	}
	set cornerWidth(e) {
		y(this.#a, e, !0);
	}
	#o = O(0);
	get cornerHeight() {
		return w(this.#o);
	}
	set cornerHeight(e) {
		y(this.#o, e, !0);
	}
	#s = O(!1);
	get scrollbarXEnabled() {
		return w(this.#s);
	}
	set scrollbarXEnabled(e) {
		y(this.#s, e, !0);
	}
	#c = O(!1);
	get scrollbarYEnabled() {
		return w(this.#c);
	}
	set scrollbarYEnabled(e) {
		y(this.#c, e, !0);
	}
	domContext;
	constructor(e) {
		this.opts = e, this.attachment = j(e.ref, (e) => this.scrollAreaNode = e), this.domContext = new de(e.ref);
	}
	#l = k(() => ({
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
		return w(this.#l);
	}
	set props(e) {
		y(this.#l, e);
	}
}, Pt = class e {
	static create(t) {
		return new e(t, kt.get());
	}
	opts;
	root;
	attachment;
	#e = me(ye());
	#t = me(null);
	contentAttachment = j(this.#t, (e) => this.root.contentNode = e);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = j(e.ref, (e) => this.root.viewportNode = e);
	}
	#n = k(() => ({
		id: this.opts.id.current,
		style: {
			overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
			overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden"
		},
		[Ot.viewport]: "",
		...this.attachment
	}));
	get props() {
		return w(this.#n);
	}
	set props(e) {
		y(this.#n, e);
	}
	#r = k(() => ({
		id: this.#e.current,
		"data-scroll-area-content": "",
		style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0 },
		...this.contentAttachment
	}));
	get contentProps() {
		return w(this.#r);
	}
	set contentProps(e) {
		y(this.#r, e);
	}
}, Ft = class e {
	static create(t) {
		return G.set(new e(t, kt.get()));
	}
	opts;
	root;
	#e = k(() => this.opts.orientation.current === "horizontal");
	get isHorizontal() {
		return w(this.#e);
	}
	set isHorizontal(e) {
		y(this.#e, e);
	}
	#t = O(!1);
	get hasThumb() {
		return w(this.#t);
	}
	set hasThumb(e) {
		y(this.#t, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, P(() => this.isHorizontal, (e) => e ? (this.root.scrollbarXEnabled = !0, () => {
			this.root.scrollbarXEnabled = !1;
		}) : (this.root.scrollbarYEnabled = !0, () => {
			this.root.scrollbarYEnabled = !1;
		}));
	}
}, It = class t {
	static create() {
		return new t(G.get());
	}
	scrollbar;
	root;
	#e = O(!1);
	get isVisible() {
		return w(this.#e);
	}
	set isVisible(e) {
		y(this.#e, e, !0);
	}
	constructor(t) {
		this.scrollbar = t, this.root = t.root, _(() => {
			let t = this.root.scrollAreaNode, n = this.root.opts.scrollHideDelay.current, r = 0;
			if (!t) return;
			let i = _e(e(t, "pointerenter", () => {
				this.root.domContext.clearTimeout(r), x(() => this.isVisible = !0);
			}), e(t, "pointerleave", () => {
				r && this.root.domContext.clearTimeout(r), r = this.root.domContext.setTimeout(() => {
					x(() => {
						this.scrollbar.hasThumb = !1, this.isVisible = !1;
					});
				}, n);
			}));
			return () => {
				this.root.domContext.getWindow().clearTimeout(r), i();
			};
		});
	}
	#t = k(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return w(this.#t);
	}
	set props(e) {
		y(this.#t, e);
	}
}, Lt = class t {
	static create() {
		return new t(G.get());
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
	#e = k(() => this.machine.state.current === "hidden");
	get isHidden() {
		return w(this.#e);
	}
	set isHidden(e) {
		y(this.#e, e);
	}
	constructor(t) {
		this.scrollbar = t, this.root = t.root;
		let n = fe(() => this.machine.dispatch("SCROLL_END"), 100);
		_(() => {
			let e = this.machine.state.current, t = this.root.opts.scrollHideDelay.current;
			if (e === "idle") {
				let e = this.root.domContext.setTimeout(() => this.machine.dispatch("HIDE"), t);
				return () => this.root.domContext.clearTimeout(e);
			}
		}), _(() => {
			let t = this.root.viewportNode;
			if (!t) return;
			let r = this.scrollbar.isHorizontal ? "scrollLeft" : "scrollTop", i = t[r];
			return e(t, "scroll", () => {
				let e = t[r];
				i !== e && (this.machine.dispatch("SCROLL"), n()), i = e;
			});
		}), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this);
	}
	onpointerenter(e) {
		this.machine.dispatch("POINTER_ENTER");
	}
	onpointerleave(e) {
		this.machine.dispatch("POINTER_LEAVE");
	}
	#t = k(() => ({
		"data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave
	}));
	get props() {
		return w(this.#t);
	}
	set props(e) {
		y(this.#t, e);
	}
}, Rt = class e {
	static create() {
		return new e(G.get());
	}
	scrollbar;
	root;
	#e = O(!1);
	get isVisible() {
		return w(this.#e);
	}
	set isVisible(e) {
		y(this.#e, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root;
		let t = () => {
			let e = this.root.viewportNode;
			if (!e) return;
			let t = e.offsetWidth < e.scrollWidth, n = e.offsetHeight < e.scrollHeight;
			this.isVisible = this.scrollbar.isHorizontal ? t : n;
		};
		new W(() => this.root.viewportNode, t), new W(() => this.root.contentNode, t);
	}
	#t = k(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return w(this.#t);
	}
	set props(e) {
		y(this.#t, e);
	}
}, zt = class e {
	static create() {
		return At.set(new e(G.get()));
	}
	scrollbar;
	root;
	#e = O(null);
	get thumbNode() {
		return w(this.#e);
	}
	set thumbNode(e) {
		y(this.#e, e, !0);
	}
	#t = O(0);
	get pointerOffset() {
		return w(this.#t);
	}
	set pointerOffset(e) {
		y(this.#t, e, !0);
	}
	#n = O({
		content: 0,
		viewport: 0,
		scrollbar: {
			size: 0,
			paddingStart: 0,
			paddingEnd: 0
		}
	});
	get sizes() {
		return w(this.#n);
	}
	set sizes(e) {
		y(this.#n, e);
	}
	#r = k(() => Gt(this.sizes.viewport, this.sizes.content));
	get thumbRatio() {
		return w(this.#r);
	}
	set thumbRatio(e) {
		y(this.#r, e);
	}
	#i = k(() => this.thumbRatio > 0 && this.thumbRatio < 1);
	get hasThumb() {
		return w(this.#i);
	}
	set hasThumb(e) {
		y(this.#i, e);
	}
	#a = O("");
	get prevTransformStyle() {
		return w(this.#a);
	}
	set prevTransformStyle(e) {
		y(this.#a, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root, _(() => {
			this.scrollbar.hasThumb = this.hasThumb;
		}), _(() => {
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
	#e = O();
	get computedStyle() {
		return w(this.#e);
	}
	set computedStyle(e) {
		y(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = j(this.scrollbar.opts.ref, (e) => this.root.scrollbarXNode = e), _(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), _(() => {
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
	#t = k(() => Kt(this.scrollbarVis.sizes));
	get thumbSize() {
		return w(this.#t);
	}
	set thumbSize(e) {
		y(this.#t, e);
	}
	#n = k(() => ({
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
		return w(this.#n);
	}
	set props(e) {
		y(this.#n, e);
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
	#e = O();
	get computedStyle() {
		return w(this.#e);
	}
	set computedStyle(e) {
		y(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = j(this.scrollbar.opts.ref, (e) => this.root.scrollbarYNode = e), _(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), _(() => {
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
	#t = k(() => Kt(this.scrollbarVis.sizes));
	get thumbSize() {
		return w(this.#t);
	}
	set thumbSize(e) {
		y(this.#t, e);
	}
	#n = k(() => ({
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
		return w(this.#n);
	}
	set props(e) {
		y(this.#n, e);
	}
}, Ht = class t {
	static create() {
		return Mt.set(new t(jt.get()));
	}
	scrollbarState;
	root;
	scrollbarVis;
	scrollbar;
	#e = O(null);
	get rect() {
		return w(this.#e);
	}
	set rect(e) {
		y(this.#e, e);
	}
	#t = O("");
	get prevWebkitUserSelect() {
		return w(this.#t);
	}
	set prevWebkitUserSelect(e) {
		y(this.#t, e, !0);
	}
	handleResize;
	handleThumbPositionChange;
	handleWheelScroll;
	handleThumbPointerDown;
	handleThumbPointerUp;
	#n = k(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport);
	get maxScrollPos() {
		return w(this.#n);
	}
	set maxScrollPos(e) {
		y(this.#n, e);
	}
	constructor(t) {
		this.scrollbarState = t, this.root = t.root, this.scrollbarVis = t.scrollbarVis, this.scrollbar = t.scrollbarVis.scrollbar, this.handleResize = () => this.scrollbarState.onResize(), this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange, this.handleWheelScroll = this.scrollbarState.onWheelScroll, this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown, this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp, _(() => {
			let t = this.maxScrollPos, n = this.scrollbar.opts.ref.current;
			return this.root.viewportNode, e(this.root.domContext.getDocument(), "wheel", (e) => {
				let r = e.target;
				n?.contains(r) && this.handleWheelScroll(e, t);
			}, { passive: !1 });
		}), S(() => {
			this.scrollbarVis.sizes, x(() => this.handleThumbPositionChange());
		}), new W(() => this.scrollbar.opts.ref.current, this.handleResize), new W(() => this.root.contentNode, this.handleResize), this.onpointerdown = this.onpointerdown.bind(this), this.onpointermove = this.onpointermove.bind(this), this.onpointerup = this.onpointerup.bind(this), this.onlostpointercapture = this.onlostpointercapture.bind(this);
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
	#i = k(() => F({
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
		return w(this.#i);
	}
	set props(e) {
		y(this.#i, e);
	}
}, Ut = class t {
	static create(e) {
		return new t(e, Mt.get());
	}
	opts;
	scrollbarState;
	attachment;
	#e;
	#t = O();
	#n = fe(() => {
		w(this.#t) && (w(this.#t)(), y(this.#t, void 0));
	}, 100);
	constructor(t, n) {
		this.opts = t, this.scrollbarState = n, this.#e = n.root, this.attachment = j(this.opts.ref, (e) => this.scrollbarState.scrollbarVis.thumbNode = e), _(() => {
			let t = this.#e.viewportNode;
			return t ? (x(() => this.scrollbarState.handleThumbPositionChange()), e(t, "scroll", () => {
				if (this.#n(), !w(this.#t)) {
					let e = Zt(t, this.scrollbarState.handleThumbPositionChange);
					y(this.#t, e, !0), this.scrollbarState.handleThumbPositionChange();
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
	#r = k(() => ({
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
		return w(this.#r);
	}
	set props(e) {
		y(this.#r, e);
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
	}, r = 0, i = oe(e);
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
]), $t = o("<div><!></div>");
function en(e, t) {
	let n = a();
	r(t, !0);
	let o = E(t, "ref", 15, null), u = E(t, "id", 19, () => I(n)), f = E(t, "type", 3, "hover"), m = E(t, "dir", 3, "ltr"), g = E(t, "scrollHideDelay", 3, 600), _ = b(t, Qt), y = Nt.create({
		type: L(() => f()),
		dir: L(() => m()),
		scrollHideDelay: L(() => g()),
		id: L(() => u()),
		ref: L(() => o(), (e) => o(e))
	}), x = k(() => F(_, y.props));
	var ee = i(), S = v(ee), C = (e) => {
		var n = i(), r = v(n);
		l(r, () => t.child, () => ({ props: w(x) })), p(e, n);
	}, T = (e) => {
		var n = $t();
		h(n, () => ({ ...w(x) }));
		var r = D(n);
		l(r, () => t.children ?? c), s(n), p(e, n);
	};
	A(S, (e) => {
		t.child ? e(C) : e(T, -1);
	}), p(e, ee), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-viewport.svelte
var tn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"children"
]), nn = o("<div><div><!></div></div>"), rn = {
	hash: "svelte-1gl71oa",
	code: "\n	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */[data-scroll-area-viewport] {scrollbar-width:none !important;-ms-overflow-style:none !important;-webkit-overflow-scrolling:touch !important;}[data-scroll-area-viewport]::-webkit-scrollbar {display:none !important;}:where([data-scroll-area-viewport]) {display:flex;flex-direction:column;align-items:stretch;}:where([data-scroll-area-content]) {flex-grow:1;}"
};
function an(e, n) {
	let i = a();
	r(n, !0), t(e, rn);
	let o = E(n, "ref", 15, null), u = E(n, "id", 19, () => I(i)), f = b(n, tn), m = Pt.create({
		id: L(() => u()),
		ref: L(() => o(), (e) => o(e))
	}), g = k(() => F(f, m.props)), _ = k(() => F({}, m.contentProps));
	var v = nn();
	h(v, () => ({ ...w(g) }));
	var y = D(v);
	h(y, () => ({ ...w(_) }));
	var x = D(y);
	l(x, () => n.children ?? c), s(y), s(v), p(e, v), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-shared.svelte
var on = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children"
]), sn = o("<div><!></div>");
function cn(e, t) {
	r(t, !0);
	let n = b(t, on), a = Ht.create(), o = k(() => F(n, a.props));
	var u = i(), f = v(u), m = (e) => {
		var n = i(), r = v(n);
		l(r, () => t.child, () => ({ props: w(o) })), p(e, n);
	}, g = (e) => {
		var n = sn();
		h(n, () => ({ ...w(o) }));
		var r = D(n);
		l(r, () => t.children ?? c), s(n), p(e, n);
	};
	A(f, (e) => {
		t.child ? e(m) : e(g, -1);
	}), p(e, u), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-x.svelte
var ln = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function un(e, t) {
	r(t, !0);
	let n = b(t, ln), i = new M(), a = Bt.create({ mounted: L(() => i.current) }), o = k(() => F(n, a.props));
	cn(e, g(() => w(o))), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-y.svelte
var dn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function fn(e, t) {
	r(t, !0);
	let n = b(t, dn), i = new M(), a = Vt.create({ mounted: L(() => i.current) }), o = k(() => F(n, a.props));
	cn(e, g(() => w(o))), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-visible.svelte
var pn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function mn(e, t) {
	r(t, !0);
	let n = b(t, pn), a = zt.create();
	var o = i(), s = v(o), c = (e) => {
		un(e, g(() => n));
	}, l = (e) => {
		fn(e, g(() => n));
	};
	A(s, (e) => {
		a.scrollbar.opts.orientation.current === "horizontal" ? e(c) : e(l, -1);
	}), p(e, o), d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-auto.svelte
var hn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function gn(e, t) {
	r(t, !0);
	let n = E(t, "forceMount", 3, !1), i = b(t, hn), a = Rt.create(), o = k(() => F(i, a.props));
	{
		let t = (e) => {
			mn(e, g(() => w(o)));
		}, r = k(() => n() || a.isVisible);
		Tt(e, {
			get open() {
				return w(r);
			},
			get ref() {
				return a.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		});
	}
	d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-scroll.svelte
var _n = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function vn(e, t) {
	r(t, !0);
	let n = E(t, "forceMount", 3, !1), i = b(t, _n), a = Lt.create(), o = k(() => F(i, a.props));
	{
		let t = (e) => {
			mn(e, g(() => w(o)));
		}, r = k(() => n() || !a.isHidden);
		Tt(e, g(() => w(o), {
			get open() {
				return w(r);
			},
			get ref() {
				return a.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		}));
	}
	d();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-hover.svelte
var yn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function bn(e, t) {
	r(t, !0);
	let n = E(t, "forceMount", 3, !1), i = b(t, yn), a = It.create(), o = Rt.create(), s = k(() => F(i, a.props, o.props, { "data-state": a.isVisible ? "visible" : "hidden" })), c = k(() => n() || a.isVisible && o.isVisible);
	Tt(e, {
		get open() {
			return w(c);
		},
		get ref() {
			return o.scrollbar.opts.ref;
		},
		presence: (e) => {
			mn(e, g(() => w(s)));
		},
		$$slots: { presence: !0 }
	}), d();
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
	let n = a();
	r(t, !0);
	let o = E(t, "ref", 15, null), s = E(t, "id", 19, () => I(n)), c = b(t, xn), l = Ft.create({
		orientation: L(() => t.orientation),
		id: L(() => s()),
		ref: L(() => o(), (e) => o(e))
	}), u = k(() => l.root.opts.type.current);
	var f = i(), m = v(f), h = (e) => {
		bn(e, g(() => c, { get id() {
			return s();
		} }));
	}, _ = (e) => {
		vn(e, g(() => c, { get id() {
			return s();
		} }));
	}, y = (e) => {
		gn(e, g(() => c, { get id() {
			return s();
		} }));
	}, x = (e) => {
		mn(e, g(() => c, { get id() {
			return s();
		} }));
	};
	A(m, (e) => {
		w(u) === "hover" ? e(h) : w(u) === "scroll" ? e(_, 1) : w(u) === "auto" ? e(y, 2) : w(u) === "always" && e(x, 3);
	}), p(e, f), d();
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
]), wn = o("<div><!></div>");
function Tn(e, t) {
	r(t, !0);
	let n = E(t, "ref", 15, null), a = b(t, Cn), o = new M(), u = Ut.create({
		id: L(() => t.id),
		ref: L(() => n(), (e) => n(e)),
		mounted: L(() => o.current)
	}), f = k(() => F(a, u.props, { style: { hidden: !t.present } }));
	var m = i(), g = v(m), _ = (e) => {
		var n = i(), r = v(n);
		l(r, () => t.child, () => ({ props: w(f) })), p(e, n);
	}, y = (e) => {
		var n = wn();
		h(n, () => ({ ...w(f) }));
		var r = D(n);
		l(r, () => t.children ?? c), s(n), p(e, n);
	};
	A(g, (e) => {
		t.child ? e(_) : e(y, -1);
	}), p(e, m), d();
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
	let n = a();
	r(t, !0);
	let i = E(t, "id", 19, () => I(n)), o = E(t, "ref", 15, null), s = E(t, "forceMount", 3, !1), c = b(t, En), l = At.get();
	{
		let t = (e, t) => {
			let n = () => (t?.()).present;
			Tn(e, g(() => c, {
				get id() {
					return i();
				},
				get present() {
					return n();
				},
				get ref() {
					return o();
				},
				set ref(e) {
					o(e);
				}
			}));
		}, n = k(() => s() || l.hasThumb);
		Tt(e, {
			get open() {
				return w(n);
			},
			get ref() {
				return l.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		});
	}
	d();
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/customEmojiStore.svelte.ts
var K = O(C([])), q = O(!1), J = O(null), Y = O(null), On = null, X = null, Z = 0, Q = 0, kn = 0, An = /* @__PURE__ */ new Map();
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
	y(K, [], !0), y(q, !1), y(J, null), y(Y, null), On = null, X = null;
}
function In() {
	Z += 1, y(q, !1);
}
function Ln(e) {
	let t = An.get(e);
	if (t) return t;
	let n = De(e).finally(() => {
		An.delete(e);
	});
	return An.set(e, n), n;
}
async function Rn(e, t) {
	let n = await Ln(e.loadKey);
	return !t() || n.length === 0 ? !1 : (y(K, n, !0), y(J, null), y(Y, e.loadKey, !0), !0);
}
var zn = {
	get items() {
		return w(K);
	},
	get loading() {
		return w(q);
	},
	get error() {
		return w(J);
	},
	async prefetchCache(e) {
		if (!e.pubkey) return;
		let t = e.pubkey;
		if (w(Y) === t && w(K).length > 0) return;
		let n = Nn(t);
		try {
			if (w(q) && X === t) return;
			await Rn(n, () => Pn(n));
		} catch {}
	},
	async load(e) {
		if (!e.rxNostr || !e.pubkey) {
			Z += 1, Fn();
			return;
		}
		let t = e.pubkey, n = Mn(t);
		if (!e.force && On === t && w(K).length > 0) return;
		let r = e.force ? !1 : w(Y) === t && w(K).length > 0 || await Rn(n, () => $(n));
		if ($(n)) {
			y(q, !r), y(J, null), y(Y, t, !0);
			try {
				let t = await Te({
					rxNostr: e.rxNostr,
					pubkey: e.pubkey
				});
				if (!$(n) || (y(K, t, !0), await Ee(n.loadKey, t), !$(n))) return;
				Oe(t.map((e) => e.src)), On = n.loadKey;
			} catch {
				if (!$(n)) return;
				y(J, "customEmoji.load_failed"), r || y(K, [], !0);
			} finally {
				$(n) && y(q, !1);
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
export { en as a, Qe as c, Ue as d, an as i, Be as l, Dn as n, at as o, Sn as r, nt as s, zn as t, Ve as u };
