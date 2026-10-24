import { At as e, B as t, Ct as n, G as r, K as i, L as a, N as o, Ot as s, R as c, U as l, W as u, Z as d, a as f, at as p, ct as m, dt as h, et as g, ft as _, g as v, gt as y, i as b, jt as x, k as S, kt as ee, lt as C, mt as w, nt as T, ot as E, q as te, r as D, st as ne, v as re, wt as O, yt as k } from "./index-client-Bdka-Daw.js";
import { B as A, C as ie, E as ae, F as oe, G as se, J as j, K as ce, M as le, O as ue, Q as M, S as de, V as fe, X as N, Z as pe, c as me, dt as he, et as P, i as ge, j as _e, nt as ve, o as F, q as ye, r as be, s as xe, st as I, w as Se, x as Ce } from "./LoadingPlaceholder-j1_vRYno.js";
import { t as we } from "./sr-only-styles-BjSIU7_G.js";
import { t as Te } from "./after-sleep-mvoNP8rL.js";
import { a as Ee, g as De, m as Oe, n as ke } from "./customEmoji-Bvbh2sQz.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/utils.js
function Ae(e, t) {
	let n = e.nextElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.nextElementSibling;
	}
}
function je(e, t) {
	let n = e.previousElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.previousElementSibling;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/css-escape.js
function Me(e) {
	if (typeof CSS < "u" && typeof CSS.escape == "function") return CSS.escape(e);
	let t = e.length, n = -1, r, i = "", a = e.charCodeAt(0);
	if (t === 1 && a === 45) return "\\" + e;
	for (; ++n < t;) r = e.charCodeAt(n), i += r === 0 ? "�" : r >= 1 && r <= 31 || r === 127 || n === 0 && r >= 48 && r <= 57 || n === 1 && r >= 48 && r <= 57 && a === 45 ? "\\" + r.toString(16) + " " : r >= 128 || r === 45 || r === 95 || r >= 48 && r <= 57 || r >= 65 && r <= 90 || r >= 97 && r <= 122 ? e.charAt(n) : "\\" + e.charAt(n);
	return i;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/command.svelte.js
var L = "data-value", R = oe({
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
}), z = R.selector("group"), Ne = R.selector("group-items"), Pe = R.selector("group-heading"), Fe = R.selector("item"), Ie = `${R.selector("item")}:not([aria-disabled="true"])`, B = new M("Command.Root"), Le = new M("Command.List"), Re = new M("Command.Group"), ze = {
	search: "",
	value: "",
	filtered: {
		count: 0,
		items: /* @__PURE__ */ new Map(),
		groups: /* @__PURE__ */ new Set()
	}
}, Be = class e {
	static create(t) {
		return B.set(new e(t));
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
	#r = y(0);
	get key() {
		return g(this.#r);
	}
	set key(e) {
		w(this.#r, e, !0);
	}
	#i = y(null);
	get viewportNode() {
		return g(this.#i);
	}
	set viewportNode(e) {
		w(this.#i, e, !0);
	}
	#a = y(null);
	get inputNode() {
		return g(this.#a);
	}
	set inputNode(e) {
		w(this.#a, e, !0);
	}
	#o = y(null);
	get labelNode() {
		return g(this.#o);
	}
	set labelNode(e) {
		w(this.#o, e, !0);
	}
	#s = y(ze);
	get commandState() {
		return g(this.#s);
	}
	set commandState(e) {
		w(this.#s, e);
	}
	#c = y(_(ze));
	get _commandState() {
		return g(this.#c);
	}
	set _commandState(e) {
		w(this.#c, e, !0);
	}
	#l() {
		return s(this._commandState);
	}
	#u(e) {
		ce(() => {
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
		this.opts = e, this.attachment = A(this.opts.ref);
		let t = {
			...this._commandState,
			value: this.opts.value.current ?? ""
		};
		this._commandState = t, this.commandState = t, this.onkeydown = this.onkeydown.bind(this), ye(() => {
			this.#n = !0;
		});
	}
	#f(e, t) {
		let n = this.opts.filter.current ?? St;
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
			let t = e.closest(Ne);
			if (t) {
				let n = e.parentElement === t ? e : e.closest(`${Ne} > *`);
				n && t.appendChild(n);
			} else {
				let t = e.parentElement === r ? e : e.closest(`${Ne} > *`);
				t && r?.appendChild(t);
			}
		}
		let a = n.sort((e, t) => t[1] - e[1]);
		for (let e of a) {
			let t = r?.querySelector(`${z}[${L}="${Me(e[0])}"]`);
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
			let e = this.getValidItems().find((e) => e.getAttribute("aria-disabled") !== "true")?.getAttribute(L), t = this.#t && this.opts.disableInitialScroll.current;
			this.setValue(e ?? "", t), this.#t = !1;
		});
	}
	#h(e) {
		ce(() => {
			this._commandState.value === e && (this.getValidItems().some((t) => t.getAttribute(L) === e) || this.#m());
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
		return e ? Array.from(e.querySelectorAll(Ie)).filter((e) => !!e) : [];
	}
	getVisibleItems() {
		let e = this.opts.ref.current;
		return e ? Array.from(e.querySelectorAll(Fe)).filter((e) => !!e) : [];
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
		let t = e.querySelector(`${Ie}[data-selected]`);
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
						(e?.closest(z)?.querySelector(Pe))?.scrollIntoView({ block: "nearest" });
						return;
					}
				} else {
					let n = ge(t);
					if (n && n.dataset?.value === e.dataset?.value) {
						let t = e?.closest(z)?.querySelector(Pe);
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
		t && this.setValue(t.getAttribute(L) ?? "");
	}
	updateSelectedByItem(e) {
		let t = this.#v(), n = this.getValidItems(), r = n.findIndex((e) => e === t), i = n[r + e];
		this.opts.loop.current && (i = r + e < 0 ? n[n.length - 1] : r + e === n.length ? n[0] : n[r + e]), i && this.setValue(i.getAttribute(L) ?? "");
	}
	updateSelectedByGroup(e) {
		let t = this.#v()?.closest(z), n;
		for (; t && !n;) t = e > 0 ? Ae(t, z) : je(t, z), n = t?.querySelector(Ie);
		n ? this.setValue(n.getAttribute(L) ?? "") : this.updateSelectedByItem(e);
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
				let e = t.getAttribute(L);
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
			if (i = e[r]?.ref ?? null, i !== null && Ve(i)) i = null;
			else {
				if (i === null) for (let t = e.length - 1; t >= 0; t--) {
					let t = e[e.length - 1];
					if (!(t === void 0 || Ve(t.ref))) {
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
				if (i = e[r]?.ref ?? null, i !== null && Ve(i)) i = null;
				else {
					if (i === null) for (let t = e.length - 1; t >= 0; t--) {
						let t = e[e.length - 1];
						if (!(t === void 0 || Ve(t.ref))) {
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
			case Ce:
				this.isGrid ? this.#C(e) : this.#S(e);
				break;
			case ie:
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
			case Se:
				this.isGrid ? this.#O(e) : this.#j(e);
				break;
			case de:
				if (!this.isGrid) break;
				this.#j(e);
				break;
			case ue:
				e.preventDefault(), this.updateSelectedToIndex(0);
				break;
			case "End":
				e.preventDefault(), this.#x();
				break;
			case ae: if (!e.isComposing && e.keyCode !== 229) {
				e.preventDefault();
				let t = this.#v();
				t && t?.click();
			}
		}
	}
	#M = k(() => ({
		id: this.opts.id.current,
		role: "application",
		[R.root]: "",
		tabindex: -1,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return g(this.#M);
	}
	set props(e) {
		w(this.#M, e);
	}
};
function Ve(e) {
	return e.getAttribute("aria-disabled") === "true";
}
var He = class e {
	static create(t) {
		return new e(t, B.get());
	}
	opts;
	root;
	attachment;
	#e = k(() => this.root._commandState.filtered.count === 0 && this.#t === !1 || this.opts.forceMount.current);
	get shouldRender() {
		return g(this.#e);
	}
	set shouldRender(e) {
		w(this.#e, e);
	}
	#t = !0;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = A(this.opts.ref), ne(() => {
			this.#t = !1;
		});
	}
	#n = k(() => ({
		id: this.opts.id.current,
		role: "presentation",
		[R.empty]: "",
		...this.attachment
	}));
	get props() {
		return g(this.#n);
	}
	set props(e) {
		w(this.#n, e);
	}
}, Ue = class e {
	static create(t) {
		return new e(t, B.get());
	}
	opts;
	root;
	attachment;
	#e = k(() => {
		let e = this.root.viewportNode?.querySelector(`${Fe}[${L}="${Me(this.root.opts.value.current)}"]`);
		if (e != null) return e.getAttribute("id") ?? void 0;
	});
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = A(this.opts.ref, (e) => this.root.inputNode = e), N(() => this.opts.ref.current, () => {
			let e = this.opts.ref.current;
			e && this.opts.autofocus.current && Te(10, () => e.focus());
		}), N(() => this.opts.value.current, () => {
			this.root.commandState.search !== this.opts.value.current && this.root.setState("search", this.opts.value.current);
		});
	}
	#t = k(() => ({
		id: this.opts.id.current,
		type: "text",
		[R.input]: "",
		autocomplete: "off",
		autocorrect: "off",
		spellcheck: !1,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": le(!0),
		"aria-controls": this.root.viewportNode?.id ?? void 0,
		"aria-labelledby": this.root.labelNode?.id ?? void 0,
		"aria-activedescendant": g(this.#e),
		...this.attachment
	}));
	get props() {
		return g(this.#t);
	}
	set props(e) {
		w(this.#t, e);
	}
}, We = class e {
	static create(t) {
		let n = Re.getOr(null);
		return new e({
			...t,
			group: n
		}, B.get());
	}
	opts;
	root;
	attachment;
	#e = null;
	#t = k(() => this.opts.forceMount.current || this.#e?.opts.forceMount.current === !0);
	#n = k(() => {
		if (this.opts.ref.current, g(this.#t) || this.root.opts.shouldFilter.current === !1 || !this.root.commandState.search) return !0;
		let e = this.root.commandState.filtered.items.get(this.trueValue);
		return e !== void 0 && e > 0;
	});
	get shouldRender() {
		return g(this.#n);
	}
	set shouldRender(e) {
		w(this.#n, e);
	}
	#r = k(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
	get isSelected() {
		return g(this.#r);
	}
	set isSelected(e) {
		w(this.#r, e);
	}
	#i = y("");
	get trueValue() {
		return g(this.#i);
	}
	set trueValue(e) {
		w(this.#i, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#e = Re.getOr(null), this.trueValue = e.value.current, this.attachment = A(this.opts.ref), N([
			() => this.trueValue,
			() => this.#e?.trueValue,
			() => this.opts.forceMount.current
		], () => {
			if (!this.opts.forceMount.current && this.trueValue) return this.root.registerItem(this.trueValue, this.#e?.trueValue);
		}), N([() => this.opts.value.current, () => this.opts.ref.current], () => {
			this.opts.value.current ? this.trueValue = this.opts.value.current : this.opts.ref.current?.textContent && (this.trueValue = this.opts.ref.current.textContent.trim()), this.trueValue && (this.root.registerValue(this.trueValue, e.keywords.current.map((e) => e.trim())), this.opts.ref.current?.setAttribute(L, this.trueValue));
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
		"aria-disabled": le(this.opts.disabled.current),
		"aria-selected": le(this.isSelected),
		"data-disabled": _e(this.opts.disabled.current),
		"data-selected": _e(this.isSelected),
		"data-value": this.trueValue,
		"data-group": this.#e?.trueValue,
		[R.item]: "",
		role: "option",
		onpointermove: this.onpointermove,
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return g(this.#s);
	}
	set props(e) {
		w(this.#s, e);
	}
}, Ge = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = A(this.opts.ref);
	}
	#e = k(() => ({
		id: this.opts.id.current,
		role: "progressbar",
		"aria-valuenow": this.opts.progress.current,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": "Loading...",
		[R.loading]: "",
		...this.attachment
	}));
	get props() {
		return g(this.#e);
	}
	set props(e) {
		w(this.#e, e);
	}
}, Ke = class e {
	static create(t) {
		return Le.set(new e(t, B.get()));
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = A(this.opts.ref);
	}
	#e = k(() => ({
		id: this.opts.id.current,
		role: "listbox",
		"aria-label": this.opts.ariaLabel.current,
		[R.list]: "",
		...this.attachment
	}));
	get props() {
		return g(this.#e);
	}
	set props(e) {
		w(this.#e, e);
	}
}, qe = class e {
	static create(t) {
		return new e(t, B.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = A(this.opts.ref, (e) => this.root.labelNode = e);
	}
	#e = k(() => ({
		id: this.opts.id.current,
		[R["input-label"]]: "",
		for: this.opts.for?.current,
		style: we,
		...this.attachment
	}));
	get props() {
		return g(this.#e);
	}
	set props(e) {
		w(this.#e, e);
	}
}, Je = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children"
]), Ye = r("<label><!></label>");
function Xe(t, r) {
	let a = i();
	O(r, !0);
	let s = D(r, "id", 19, () => F(a)), c = D(r, "ref", 15, null), u = b(r, Je), d = qe.create({
		id: I(() => s()),
		ref: I(() => c(), (e) => c(e))
	}), f = k(() => P(u, d.props));
	var p = Ye();
	v(p, () => ({ ...g(f) }));
	var h = m(p);
	o(h, () => r.children ?? x), e(p), l(t, p), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command.svelte
var Ze = /* @__PURE__ */ new Set([
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
]), Qe = r("<!> <!>", 1), $e = r("<div><!> <!></div>");
function et(r, a) {
	let s = i();
	O(a, !0);
	let d = (e) => {
		Xe(e, {
			children: (e, n) => {
				ee();
				var r = te();
				p(() => t(r, re())), l(e, r);
			},
			$$slots: { default: !0 }
		});
	}, f = D(a, "id", 19, () => F(s)), _ = D(a, "ref", 15, null), y = D(a, "value", 15, ""), S = D(a, "onValueChange", 3, xe), w = D(a, "onStateChange", 3, xe), T = D(a, "loop", 3, !1), E = D(a, "shouldFilter", 3, !0), ne = D(a, "filter", 3, St), re = D(a, "label", 3, ""), A = D(a, "vimBindings", 3, !0), ie = D(a, "disablePointerSelection", 3, !1), ae = D(a, "disableInitialScroll", 3, !1), oe = D(a, "columns", 3, null), se = b(a, Ze), j = Be.create({
		id: I(() => f()),
		ref: I(() => _(), (e) => _(e)),
		filter: I(() => ne()),
		shouldFilter: I(() => E()),
		loop: I(() => T()),
		value: I(() => y(), (e) => {
			y() !== e && (y(e), S()(e));
		}),
		vimBindings: I(() => A()),
		disablePointerSelection: I(() => ie()),
		disableInitialScroll: I(() => ae()),
		onStateChange: I(() => w()),
		columns: I(() => oe())
	}), ce = (e) => j.updateSelectedToIndex(e), le = (e) => j.updateSelectedByGroup(e), ue = (e) => j.updateSelectedByItem(e), M = () => j.getValidItems(), de = k(() => P(se, j.props));
	var fe = {
		updateSelectedToIndex: ce,
		updateSelectedByGroup: le,
		updateSelectedByItem: ue,
		getValidItems: M
	}, N = u(), pe = C(N), me = (e) => {
		var t = Qe(), n = C(t);
		d(n);
		var r = h(n, 2);
		o(r, () => a.child, () => ({ props: g(de) })), l(e, t);
	}, he = (t) => {
		var n = $e();
		v(n, () => ({ ...g(de) }));
		var r = m(n);
		d(r);
		var i = h(r, 2);
		o(i, () => a.children ?? x), e(n), l(t, n);
	};
	return c(pe, (e) => {
		a.child ? e(me) : e(he, -1);
	}), l(r, N), n(fe);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-item.svelte
var tt = /* @__PURE__ */ new Set([
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
]), nt = r("<div><!></div>"), rt = r("<div style=\"display: contents;\" data-item-wrapper=\"\"><!></div>");
function it(t, r) {
	let s = i();
	O(r, !0);
	let d = D(r, "id", 19, () => F(s)), f = D(r, "ref", 15, null), h = D(r, "value", 3, ""), _ = D(r, "disabled", 3, !1), y = D(r, "onSelect", 3, xe), S = D(r, "forceMount", 3, !1), ee = D(r, "keywords", 19, () => []), w = b(r, tt), T = We.create({
		id: I(() => d()),
		ref: I(() => f(), (e) => f(e)),
		value: I(() => h()),
		disabled: I(() => _()),
		onSelect: I(() => y()),
		forceMount: I(() => S()),
		keywords: I(() => ee())
	}), E = k(() => P(w, T.props));
	var te = u(), ne = C(te);
	a(ne, () => T.root.key, (t) => {
		var n = rt(), i = m(n), a = (t) => {
			var n = u(), i = C(n), a = (e) => {
				var t = u(), n = C(t);
				o(n, () => r.child, () => ({ props: g(E) })), l(e, t);
			}, s = (t) => {
				var n = nt();
				v(n, () => ({ ...g(E) }));
				var i = m(n);
				o(i, () => r.children ?? x), e(n), l(t, n);
			};
			c(i, (e) => {
				r.child ? e(a) : e(s, -1);
			}), l(t, n);
		};
		c(i, (e) => {
			T.shouldRender && e(a);
		}), e(n), p(() => re(n, "data-value", T.trueValue)), l(t, n);
	}), l(t, te), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/components/command-list.svelte
var at = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"child",
	"children",
	"aria-label"
]), ot = r("<div><!></div>");
function st(t, r) {
	let s = i();
	O(r, !0);
	let d = D(r, "id", 19, () => F(s)), f = D(r, "ref", 15, null), p = b(r, at), h = Ke.create({
		id: I(() => d()),
		ref: I(() => f(), (e) => f(e)),
		ariaLabel: I(() => r["aria-label"] ?? "Suggestions...")
	}), _ = k(() => P(p, h.props));
	var y = u(), S = C(y);
	a(S, () => h.root.opts.shouldFilter.current === !1 || h.root._commandState.search === "", (t) => {
		var n = u(), i = C(n), a = (e) => {
			var t = u(), n = C(t);
			o(n, () => r.child, () => ({ props: g(_) })), l(e, t);
		}, s = (t) => {
			var n = ot();
			v(n, () => ({ ...g(_) }));
			var i = m(n);
			o(i, () => r.children ?? x), e(n), l(t, n);
		};
		c(i, (e) => {
			r.child ? e(a) : e(s, -1);
		}), l(t, n);
	}), l(t, y), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/compute-command-score.js
var ct = 1, lt = .9, ut = .8, dt = .17, ft = .1, pt = .999, mt = .9999, ht = .99, gt = /[\\/_+.#"@[({&]/, _t = /[\\/_+.#"@[({&]/g, vt = /[\s-]/, yt = /[\s-]/g;
function bt(e, t, n, r, i, a, o) {
	if (a === t.length) return i === e.length ? ct : ht;
	let s = `${i},${a}`;
	if (o[s] !== void 0) return o[s];
	let c = r.charAt(a), l = n.indexOf(c, i), u = 0, d, f, p, m;
	for (; l >= 0;) d = bt(e, t, n, r, l + 1, a + 1, o), d > u && (l === i ? d *= ct : gt.test(e.charAt(l - 1)) ? (d *= ut, p = e.slice(i, l - 1).match(_t), p && i > 0 && (d *= pt ** p.length)) : vt.test(e.charAt(l - 1)) ? (d *= lt, m = e.slice(i, l - 1).match(yt), m && i > 0 && (d *= pt ** m.length)) : (d *= dt, i > 0 && (d *= pt ** (l - i))), e.charAt(l) !== t.charAt(a) && (d *= mt)), (d < ft && n.charAt(l - 1) === r.charAt(a + 1) || r.charAt(a + 1) === r.charAt(a) && n.charAt(l - 1) !== r.charAt(a)) && (f = bt(e, t, n, r, l + 1, a + 2, o), f * ft > d && (d = f * ft)), d > u && (u = d), l = n.indexOf(c, l + 1);
	return o[s] = u, u;
}
function xt(e) {
	return e.toLowerCase().replace(yt, " ");
}
function St(e, t, n) {
	return e = n && n.length > 0 ? `${`${e} ${n?.join(" ")}`}` : e, bt(e, t, xt(e), xt(t), 0, 0, {});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/svelte-resize-observer.svelte.js
var Ct = null, V = /* @__PURE__ */ new WeakMap();
function wt() {
	return Ct ??= new ResizeObserver((e) => {
		for (let t of e) {
			let e = V.get(t.target);
			if (e) for (let t of [...e]) t();
		}
	}), Ct;
}
function Tt(e, t) {
	let n = V.get(e);
	return n === void 0 ? (n = /* @__PURE__ */ new Set(), V.set(e, n), n.add(t), wt().observe(e)) : (n.add(t), t()), () => {
		let n = V.get(e);
		n && (n.delete(t), !n.size && (V.delete(e), Ct?.unobserve(e)));
	};
}
var H = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t, this.handler = this.handler.bind(this), E(this.handler);
	}
	handler() {
		let e = 0, t = this.#e();
		if (!t) return;
		let n = Tt(t, () => {
			cancelAnimationFrame(e), e = window.requestAnimationFrame(this.#t);
		});
		return () => {
			window.cancelAnimationFrame(e), n();
		};
	}
}, Et = class {
	opts;
	present;
	#e;
	#t = y(!1);
	#n = !1;
	#r = y(void 0);
	#i = null;
	constructor(e) {
		this.opts = e, this.present = this.opts.open, w(this.#t, e.open.current, !0), this.#e = new me({
			ref: this.opts.ref,
			afterTick: this.opts.open
		}), ye(() => this.#o()), N(() => this.present.current, (e) => {
			this.#n ? (this.#o(), e && w(this.#t, !0), w(this.#r, e ? "starting" : "ending", !0), e && (this.#i = window.requestAnimationFrame(() => {
				this.#i = null, this.present.current && w(this.#r, void 0);
			})), this.#e.run(() => {
				e === this.present.current && (e || w(this.#t, !1), w(this.#r, void 0));
			})) : this.#n = !0;
		});
	}
	#a = k(() => g(this.#t));
	get isPresent() {
		return g(this.#a);
	}
	set isPresent(e) {
		w(this.#a, e);
	}
	get transitionStatus() {
		return g(this.#r);
	}
	#o() {
		this.#i !== null && (window.cancelAnimationFrame(this.#i), this.#i = null);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte
function U(e, t) {
	O(t, !0);
	let r = new Et({
		open: I(() => t.open),
		ref: T(() => t.ref)
	});
	var i = u(), a = C(i), s = (e) => {
		var n = u(), i = C(n);
		o(i, () => t.presence ?? x, () => ({
			present: r.isPresent,
			transitionStatus: r.transitionStatus
		})), l(e, n);
	};
	c(a, (e) => {
		(t.forceMount || t.open || r.isPresent) && e(s);
	}), l(e, i), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/clamp.js
function Dt(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/state-machine.js
var Ot = class {
	state;
	#e;
	constructor(e, t) {
		this.state = he(e), this.#e = t, this.dispatch = this.dispatch.bind(this);
	}
	#t(e) {
		return this.#e[this.state.current][e] ?? this.state.current;
	}
	dispatch(e) {
		this.state.current = this.#t(e);
	}
}, kt = oe({
	component: "scroll-area",
	parts: [
		"root",
		"viewport",
		"corner",
		"thumb",
		"scrollbar"
	]
}), At = new M("ScrollArea.Root"), W = new M("ScrollArea.Scrollbar"), G = new M("ScrollArea.ScrollbarVisible"), jt = new M("ScrollArea.ScrollbarAxis"), Mt = new M("ScrollArea.ScrollbarShared"), Nt = class e {
	static create(t) {
		return At.set(new e(t));
	}
	opts;
	attachment;
	#e = y(null);
	get scrollAreaNode() {
		return g(this.#e);
	}
	set scrollAreaNode(e) {
		w(this.#e, e, !0);
	}
	#t = y(null);
	get viewportNode() {
		return g(this.#t);
	}
	set viewportNode(e) {
		w(this.#t, e, !0);
	}
	#n = y(null);
	get contentNode() {
		return g(this.#n);
	}
	set contentNode(e) {
		w(this.#n, e, !0);
	}
	#r = y(null);
	get scrollbarXNode() {
		return g(this.#r);
	}
	set scrollbarXNode(e) {
		w(this.#r, e, !0);
	}
	#i = y(null);
	get scrollbarYNode() {
		return g(this.#i);
	}
	set scrollbarYNode(e) {
		w(this.#i, e, !0);
	}
	#a = y(0);
	get cornerWidth() {
		return g(this.#a);
	}
	set cornerWidth(e) {
		w(this.#a, e, !0);
	}
	#o = y(0);
	get cornerHeight() {
		return g(this.#o);
	}
	set cornerHeight(e) {
		w(this.#o, e, !0);
	}
	#s = y(!1);
	get scrollbarXEnabled() {
		return g(this.#s);
	}
	set scrollbarXEnabled(e) {
		w(this.#s, e, !0);
	}
	#c = y(!1);
	get scrollbarYEnabled() {
		return g(this.#c);
	}
	set scrollbarYEnabled(e) {
		w(this.#c, e, !0);
	}
	domContext;
	constructor(e) {
		this.opts = e, this.attachment = A(e.ref, (e) => this.scrollAreaNode = e), this.domContext = new fe(e.ref);
	}
	#l = k(() => ({
		id: this.opts.id.current,
		dir: this.opts.dir.current,
		style: {
			position: "relative",
			"--bits-scroll-area-corner-height": `${this.cornerHeight}px`,
			"--bits-scroll-area-corner-width": `${this.cornerWidth}px`
		},
		[kt.root]: "",
		...this.attachment
	}));
	get props() {
		return g(this.#l);
	}
	set props(e) {
		w(this.#l, e);
	}
}, Pt = class e {
	static create(t) {
		return new e(t, At.get());
	}
	opts;
	root;
	attachment;
	#e = he(be());
	#t = he(null);
	contentAttachment = A(this.#t, (e) => this.root.contentNode = e);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = A(e.ref, (e) => this.root.viewportNode = e);
	}
	#n = k(() => ({
		id: this.opts.id.current,
		style: {
			overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
			overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden"
		},
		[kt.viewport]: "",
		...this.attachment
	}));
	get props() {
		return g(this.#n);
	}
	set props(e) {
		w(this.#n, e);
	}
	#r = k(() => ({
		id: this.#e.current,
		"data-scroll-area-content": "",
		style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0 },
		...this.contentAttachment
	}));
	get contentProps() {
		return g(this.#r);
	}
	set contentProps(e) {
		w(this.#r, e);
	}
}, Ft = class e {
	static create(t) {
		return W.set(new e(t, At.get()));
	}
	opts;
	root;
	#e = k(() => this.opts.orientation.current === "horizontal");
	get isHorizontal() {
		return g(this.#e);
	}
	set isHorizontal(e) {
		w(this.#e, e);
	}
	#t = y(!1);
	get hasThumb() {
		return g(this.#t);
	}
	set hasThumb(e) {
		w(this.#t, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, N(() => this.isHorizontal, (e) => e ? (this.root.scrollbarXEnabled = !0, () => {
			this.root.scrollbarXEnabled = !1;
		}) : (this.root.scrollbarYEnabled = !0, () => {
			this.root.scrollbarYEnabled = !1;
		}));
	}
}, It = class e {
	static create() {
		return new e(W.get());
	}
	scrollbar;
	root;
	#e = y(!1);
	get isVisible() {
		return g(this.#e);
	}
	set isVisible(e) {
		w(this.#e, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root, E(() => {
			let e = this.root.scrollAreaNode, t = this.root.opts.scrollHideDelay.current, n = 0;
			if (!e) return;
			let r = ve(d(e, "pointerenter", () => {
				this.root.domContext.clearTimeout(n), T(() => this.isVisible = !0);
			}), d(e, "pointerleave", () => {
				n && this.root.domContext.clearTimeout(n), n = this.root.domContext.setTimeout(() => {
					T(() => {
						this.scrollbar.hasThumb = !1, this.isVisible = !1;
					});
				}, t);
			}));
			return () => {
				this.root.domContext.getWindow().clearTimeout(n), r();
			};
		});
	}
	#t = k(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return g(this.#t);
	}
	set props(e) {
		w(this.#t, e);
	}
}, Lt = class e {
	static create() {
		return new e(W.get());
	}
	scrollbar;
	root;
	machine = new Ot("hidden", {
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
		return g(this.#e);
	}
	set isHidden(e) {
		w(this.#e, e);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root;
		let t = pe(() => this.machine.dispatch("SCROLL_END"), 100);
		E(() => {
			let e = this.machine.state.current, t = this.root.opts.scrollHideDelay.current;
			if (e === "idle") {
				let e = this.root.domContext.setTimeout(() => this.machine.dispatch("HIDE"), t);
				return () => this.root.domContext.clearTimeout(e);
			}
		}), E(() => {
			let e = this.root.viewportNode;
			if (!e) return;
			let n = this.scrollbar.isHorizontal ? "scrollLeft" : "scrollTop", r = e[n];
			return d(e, "scroll", () => {
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
	#t = k(() => ({
		"data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave
	}));
	get props() {
		return g(this.#t);
	}
	set props(e) {
		w(this.#t, e);
	}
}, Rt = class e {
	static create() {
		return new e(W.get());
	}
	scrollbar;
	root;
	#e = y(!1);
	get isVisible() {
		return g(this.#e);
	}
	set isVisible(e) {
		w(this.#e, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root;
		let t = () => {
			let e = this.root.viewportNode;
			if (!e) return;
			let t = e.offsetWidth < e.scrollWidth, n = e.offsetHeight < e.scrollHeight;
			this.isVisible = this.scrollbar.isHorizontal ? t : n;
		};
		new H(() => this.root.viewportNode, t), new H(() => this.root.contentNode, t);
	}
	#t = k(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return g(this.#t);
	}
	set props(e) {
		w(this.#t, e);
	}
}, zt = class e {
	static create() {
		return G.set(new e(W.get()));
	}
	scrollbar;
	root;
	#e = y(null);
	get thumbNode() {
		return g(this.#e);
	}
	set thumbNode(e) {
		w(this.#e, e, !0);
	}
	#t = y(0);
	get pointerOffset() {
		return g(this.#t);
	}
	set pointerOffset(e) {
		w(this.#t, e, !0);
	}
	#n = y({
		content: 0,
		viewport: 0,
		scrollbar: {
			size: 0,
			paddingStart: 0,
			paddingEnd: 0
		}
	});
	get sizes() {
		return g(this.#n);
	}
	set sizes(e) {
		w(this.#n, e);
	}
	#r = k(() => Gt(this.sizes.viewport, this.sizes.content));
	get thumbRatio() {
		return g(this.#r);
	}
	set thumbRatio(e) {
		w(this.#r, e);
	}
	#i = k(() => this.thumbRatio > 0 && this.thumbRatio < 1);
	get hasThumb() {
		return g(this.#i);
	}
	set hasThumb(e) {
		w(this.#i, e);
	}
	#a = y("");
	get prevTransformStyle() {
		return g(this.#a);
	}
	set prevTransformStyle(e) {
		w(this.#a, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root, E(() => {
			this.scrollbar.hasThumb = this.hasThumb;
		}), E(() => {
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
		return jt.set(new e(t, G.get()));
	}
	opts;
	scrollbarVis;
	root;
	scrollbar;
	attachment;
	#e = y();
	get computedStyle() {
		return g(this.#e);
	}
	set computedStyle(e) {
		w(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = A(this.scrollbar.opts.ref, (e) => this.root.scrollbarXNode = e), E(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), E(() => {
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
		return g(this.#t);
	}
	set thumbSize(e) {
		w(this.#t, e);
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
		return g(this.#n);
	}
	set props(e) {
		w(this.#n, e);
	}
}, Vt = class e {
	static create(t) {
		return jt.set(new e(t, G.get()));
	}
	opts;
	scrollbarVis;
	root;
	scrollbar;
	attachment;
	#e = y();
	get computedStyle() {
		return g(this.#e);
	}
	set computedStyle(e) {
		w(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = A(this.scrollbar.opts.ref, (e) => this.root.scrollbarYNode = e), E(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), E(() => {
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
		return g(this.#t);
	}
	set thumbSize(e) {
		w(this.#t, e);
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
		return g(this.#n);
	}
	set props(e) {
		w(this.#n, e);
	}
}, Ht = class e {
	static create() {
		return Mt.set(new e(jt.get()));
	}
	scrollbarState;
	root;
	scrollbarVis;
	scrollbar;
	#e = y(null);
	get rect() {
		return g(this.#e);
	}
	set rect(e) {
		w(this.#e, e);
	}
	#t = y("");
	get prevWebkitUserSelect() {
		return g(this.#t);
	}
	set prevWebkitUserSelect(e) {
		w(this.#t, e, !0);
	}
	handleResize;
	handleThumbPositionChange;
	handleWheelScroll;
	handleThumbPointerDown;
	handleThumbPointerUp;
	#n = k(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport);
	get maxScrollPos() {
		return g(this.#n);
	}
	set maxScrollPos(e) {
		w(this.#n, e);
	}
	constructor(e) {
		this.scrollbarState = e, this.root = e.root, this.scrollbarVis = e.scrollbarVis, this.scrollbar = e.scrollbarVis.scrollbar, this.handleResize = () => this.scrollbarState.onResize(), this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange, this.handleWheelScroll = this.scrollbarState.onWheelScroll, this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown, this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp, E(() => {
			let e = this.maxScrollPos, t = this.scrollbar.opts.ref.current;
			return this.root.viewportNode, d(this.root.domContext.getDocument(), "wheel", (n) => {
				let r = n.target;
				t?.contains(r) && this.handleWheelScroll(n, e);
			}, { passive: !1 });
		}), ne(() => {
			this.scrollbarVis.sizes, T(() => this.handleThumbPositionChange());
		}), new H(() => this.scrollbar.opts.ref.current, this.handleResize), new H(() => this.root.contentNode, this.handleResize), this.onpointerdown = this.onpointerdown.bind(this), this.onpointermove = this.onpointermove.bind(this), this.onpointerup = this.onpointerup.bind(this), this.onlostpointercapture = this.onlostpointercapture.bind(this);
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
	#i = k(() => P({
		...this.scrollbarState.props,
		style: {
			position: "absolute",
			...this.scrollbarState.props.style
		},
		[kt.scrollbar]: "",
		onpointerdown: this.onpointerdown,
		onpointermove: this.onpointermove,
		onpointerup: this.onpointerup,
		onlostpointercapture: this.onlostpointercapture
	}));
	get props() {
		return g(this.#i);
	}
	set props(e) {
		w(this.#i, e);
	}
}, Ut = class e {
	static create(t) {
		return new e(t, Mt.get());
	}
	opts;
	scrollbarState;
	attachment;
	#e;
	#t = y();
	#n = pe(() => {
		g(this.#t) && (g(this.#t)(), w(this.#t, void 0));
	}, 100);
	constructor(e, t) {
		this.opts = e, this.scrollbarState = t, this.#e = t.root, this.attachment = A(this.opts.ref, (e) => this.scrollbarState.scrollbarVis.thumbNode = e), E(() => {
			let e = this.#e.viewportNode;
			return e ? (T(() => this.scrollbarState.handleThumbPositionChange()), d(e, "scroll", () => {
				if (this.#n(), !g(this.#t)) {
					let t = Zt(e, this.scrollbarState.handleThumbPositionChange);
					w(this.#t, t, !0), this.scrollbarState.handleThumbPositionChange();
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
		[kt.thumb]: "",
		...this.attachment
	}));
	get props() {
		return g(this.#r);
	}
	set props(e) {
		w(this.#r, e);
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
	let r = Kt(t), i = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, a = t.scrollbar.size - i, o = t.content - t.viewport, s = a - r, c = n === "ltr" ? [0, o] : [o * -1, 0], l = Dt(e, c[0], c[1]);
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
	}, r = 0, i = se(e);
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
]), $t = r("<div><!></div>");
function en(t, r) {
	let a = i();
	O(r, !0);
	let s = D(r, "ref", 15, null), d = D(r, "id", 19, () => F(a)), f = D(r, "type", 3, "hover"), p = D(r, "dir", 3, "ltr"), h = D(r, "scrollHideDelay", 3, 600), _ = b(r, Qt), y = Nt.create({
		type: I(() => f()),
		dir: I(() => p()),
		scrollHideDelay: I(() => h()),
		id: I(() => d()),
		ref: I(() => s(), (e) => s(e))
	}), S = k(() => P(_, y.props));
	var ee = u(), w = C(ee), T = (e) => {
		var t = u(), n = C(t);
		o(n, () => r.child, () => ({ props: g(S) })), l(e, t);
	}, E = (t) => {
		var n = $t();
		v(n, () => ({ ...g(S) }));
		var i = m(n);
		o(i, () => r.children ?? x), e(n), l(t, n);
	};
	c(w, (e) => {
		r.child ? e(T) : e(E, -1);
	}), l(t, ee), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-viewport.svelte
var tn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"children"
]), nn = r("<div><div><!></div></div>"), rn = {
	hash: "svelte-1gl71oa",
	code: "\n	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */[data-scroll-area-viewport] {scrollbar-width:none !important;-ms-overflow-style:none !important;-webkit-overflow-scrolling:touch !important;}[data-scroll-area-viewport]::-webkit-scrollbar {display:none !important;}:where([data-scroll-area-viewport]) {display:flex;flex-direction:column;align-items:stretch;}:where([data-scroll-area-content]) {flex-grow:1;}"
};
function an(t, r) {
	let a = i();
	O(r, !0), S(t, rn);
	let s = D(r, "ref", 15, null), c = D(r, "id", 19, () => F(a)), u = b(r, tn), d = Pt.create({
		id: I(() => c()),
		ref: I(() => s(), (e) => s(e))
	}), f = k(() => P(u, d.props)), p = k(() => P({}, d.contentProps));
	var h = nn();
	v(h, () => ({ ...g(f) }));
	var _ = m(h);
	v(_, () => ({ ...g(p) }));
	var y = m(_);
	o(y, () => r.children ?? x), e(_), e(h), l(t, h), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-shared.svelte
var on = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children"
]), sn = r("<div><!></div>");
function cn(t, r) {
	O(r, !0);
	let i = b(r, on), a = Ht.create(), s = k(() => P(i, a.props));
	var d = u(), f = C(d), p = (e) => {
		var t = u(), n = C(t);
		o(n, () => r.child, () => ({ props: g(s) })), l(e, t);
	}, h = (t) => {
		var n = sn();
		v(n, () => ({ ...g(s) }));
		var i = m(n);
		o(i, () => r.children ?? x), e(n), l(t, n);
	};
	c(f, (e) => {
		r.child ? e(p) : e(h, -1);
	}), l(t, d), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-x.svelte
var ln = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function un(e, t) {
	O(t, !0);
	let r = b(t, ln), i = new j(), a = Bt.create({ mounted: I(() => i.current) }), o = k(() => P(r, a.props));
	cn(e, f(() => g(o))), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-y.svelte
var dn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function fn(e, t) {
	O(t, !0);
	let r = b(t, dn), i = new j(), a = Vt.create({ mounted: I(() => i.current) }), o = k(() => P(r, a.props));
	cn(e, f(() => g(o))), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-visible.svelte
var pn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function mn(e, t) {
	O(t, !0);
	let r = b(t, pn), i = zt.create();
	var a = u(), o = C(a), s = (e) => {
		un(e, f(() => r));
	}, d = (e) => {
		fn(e, f(() => r));
	};
	c(o, (e) => {
		i.scrollbar.opts.orientation.current === "horizontal" ? e(s) : e(d, -1);
	}), l(e, a), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-auto.svelte
var hn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function gn(e, t) {
	O(t, !0);
	let r = D(t, "forceMount", 3, !1), i = b(t, hn), a = Rt.create(), o = k(() => P(i, a.props));
	{
		let t = (e) => {
			mn(e, f(() => g(o)));
		}, n = k(() => r() || a.isVisible);
		U(e, {
			get open() {
				return g(n);
			},
			get ref() {
				return a.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		});
	}
	n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-scroll.svelte
var _n = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function vn(e, t) {
	O(t, !0);
	let r = D(t, "forceMount", 3, !1), i = b(t, _n), a = Lt.create(), o = k(() => P(i, a.props));
	{
		let t = (e) => {
			mn(e, f(() => g(o)));
		}, n = k(() => r() || !a.isHidden);
		U(e, f(() => g(o), {
			get open() {
				return g(n);
			},
			get ref() {
				return a.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		}));
	}
	n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-hover.svelte
var yn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function bn(e, t) {
	O(t, !0);
	let r = D(t, "forceMount", 3, !1), i = b(t, yn), a = It.create(), o = Rt.create(), s = k(() => P(i, a.props, o.props, { "data-state": a.isVisible ? "visible" : "hidden" })), c = k(() => r() || a.isVisible && o.isVisible);
	U(e, {
		get open() {
			return g(c);
		},
		get ref() {
			return o.scrollbar.opts.ref;
		},
		presence: (e) => {
			mn(e, f(() => g(s)));
		},
		$$slots: { presence: !0 }
	}), n();
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
	let r = i();
	O(t, !0);
	let a = D(t, "ref", 15, null), o = D(t, "id", 19, () => F(r)), s = b(t, xn), d = Ft.create({
		orientation: I(() => t.orientation),
		id: I(() => o()),
		ref: I(() => a(), (e) => a(e))
	}), p = k(() => d.root.opts.type.current);
	var m = u(), h = C(m), _ = (e) => {
		bn(e, f(() => s, { get id() {
			return o();
		} }));
	}, v = (e) => {
		vn(e, f(() => s, { get id() {
			return o();
		} }));
	}, y = (e) => {
		gn(e, f(() => s, { get id() {
			return o();
		} }));
	}, x = (e) => {
		mn(e, f(() => s, { get id() {
			return o();
		} }));
	};
	c(h, (e) => {
		g(p) === "hover" ? e(_) : g(p) === "scroll" ? e(v, 1) : g(p) === "auto" ? e(y, 2) : g(p) === "always" && e(x, 3);
	}), l(e, m), n();
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
]), wn = r("<div><!></div>");
function Tn(t, r) {
	O(r, !0);
	let i = D(r, "ref", 15, null), a = b(r, Cn), s = new j(), d = Ut.create({
		id: I(() => r.id),
		ref: I(() => i(), (e) => i(e)),
		mounted: I(() => s.current)
	}), f = k(() => P(a, d.props, { style: { hidden: !r.present } }));
	var p = u(), h = C(p), _ = (e) => {
		var t = u(), n = C(t);
		o(n, () => r.child, () => ({ props: g(f) })), l(e, t);
	}, y = (t) => {
		var n = wn();
		v(n, () => ({ ...g(f) }));
		var i = m(n);
		o(i, () => r.children ?? x), e(n), l(t, n);
	};
	c(h, (e) => {
		r.child ? e(_) : e(y, -1);
	}), l(t, p), n();
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
	let r = i();
	O(t, !0);
	let a = D(t, "id", 19, () => F(r)), o = D(t, "ref", 15, null), s = D(t, "forceMount", 3, !1), c = b(t, En), l = G.get();
	{
		let t = (e, t) => {
			let n = () => (t?.()).present;
			Tn(e, f(() => c, {
				get id() {
					return a();
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
		U(e, {
			get open() {
				return g(n);
			},
			get ref() {
				return l.scrollbar.opts.ref;
			},
			presence: t,
			$$slots: { presence: !0 }
		});
	}
	n();
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/customEmojiStore.svelte.ts
var K = y(_([])), q = y(!1), J = y(null), Y = y(null), On = null, X = null, Z = 0, Q = 0, kn = 0, An = /* @__PURE__ */ new Map();
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
	w(K, [], !0), w(q, !1), w(J, null), w(Y, null), On = null, X = null;
}
function In() {
	Z += 1, w(q, !1);
}
function Ln(e) {
	let t = An.get(e);
	if (t) return t;
	let n = Oe(e).finally(() => {
		An.delete(e);
	});
	return An.set(e, n), n;
}
async function Rn(e, t) {
	let n = await Ln(e.loadKey);
	return !t() || n.length === 0 ? !1 : (w(K, n, !0), w(J, null), w(Y, e.loadKey, !0), !0);
}
var zn = {
	get items() {
		return g(K);
	},
	get loading() {
		return g(q);
	},
	get error() {
		return g(J);
	},
	async prefetchCache(e) {
		if (!e.pubkey) return;
		let t = e.pubkey;
		if (g(Y) === t && g(K).length > 0) return;
		let n = Nn(t);
		try {
			if (g(q) && X === t) return;
			await Rn(n, () => Pn(n));
		} catch {}
	},
	async load(e) {
		if (!e.rxNostr || !e.pubkey) {
			Z += 1, Fn();
			return;
		}
		let t = e.pubkey, n = Mn(t);
		if (!e.force && On === t && g(K).length > 0) return;
		let r = e.force ? !1 : g(Y) === t && g(K).length > 0 || await Rn(n, () => $(n));
		if ($(n)) {
			w(q, !r), w(J, null), w(Y, t, !0);
			try {
				let t = await Ee({
					rxNostr: e.rxNostr,
					pubkey: e.pubkey
				});
				if (!$(n) || (w(K, t, !0), await De(n.loadKey, t), !$(n))) return;
				ke(t.map((e) => e.src)), On = n.loadKey;
			} catch {
				if (!$(n)) return;
				w(J, "customEmoji.load_failed"), r || w(K, [], !0);
			} finally {
				$(n) && w(q, !1);
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
export { en as a, et as c, Ge as d, an as i, He as l, Dn as n, st as o, Sn as r, it as s, zn as t, Ue as u };
