import { B as e, Dt as t, Et as n, F as r, G as i, H as a, K as o, Mt as s, Nt as c, Pt as l, St as u, X as d, Y as f, _t as p, a as m, at as h, b as g, ct as _, dt as v, et as y, ft as b, ht as x, i as S, j as C, jt as w, lt as T, mt as E, q as D, r as O, rt as k, ut as A, v as j, yt as M, z as ee } from "./index-client-DEFG3Gqk.js";
import { A as te, B as ne, E as re, F as N, G as P, N as F, P as I, R as L, T as R, Y as ie, _ as ae, b as oe, g as se, j as ce, r as z } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as le } from "./sr-only-styles-C-S1Yy1T.js";
import { _ as ue, a as de, c as fe, d as pe, g as me, i as he, l as ge, n as _e, o as ve, p as ye, s as be, t as xe } from "./use-id-DCa3fCKD.js";
import { t as Se } from "./after-sleep-mvoNP8rL.js";
import { a as Ce, g as we, m as Te, n as Ee } from "./customEmoji-C4nd4cTR.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/utils.js
function De(e, t) {
	let n = e.nextElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.nextElementSibling;
	}
}
function Oe(e, t) {
	let n = e.previousElementSibling;
	for (; n;) {
		if (n.matches(t)) return n;
		n = n.previousElementSibling;
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/internal/css-escape.js
function ke(e) {
	if (typeof CSS < "u" && typeof CSS.escape == "function") return CSS.escape(e);
	let t = e.length, n = -1, r, i = "", a = e.charCodeAt(0);
	if (t === 1 && a === 45) return "\\" + e;
	for (; ++n < t;) r = e.charCodeAt(n), i += r === 0 ? "�" : r >= 1 && r <= 31 || r === 127 || n === 0 && r >= 48 && r <= 57 || n === 1 && r >= 48 && r <= 57 && a === 45 ? "\\" + r.toString(16) + " " : r >= 128 || r === 45 || r === 95 || r >= 48 && r <= 57 || r >= 65 && r <= 90 || r >= 97 && r <= 122 ? e.charAt(n) : "\\" + e.charAt(n);
	return i;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/command/command.svelte.js
var B = "data-value", V = oe({
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
}), H = V.selector("group"), Ae = V.selector("group-items"), je = V.selector("group-heading"), Me = V.selector("item"), Ne = `${V.selector("item")}:not([aria-disabled="true"])`, U = new N("Command.Root"), Pe = new N("Command.List"), Fe = new N("Command.Group"), Ie = {
	search: "",
	value: "",
	filtered: {
		count: 0,
		items: /* @__PURE__ */ new Map(),
		groups: /* @__PURE__ */ new Set()
	}
}, Le = class e {
	static create(t) {
		return U.set(new e(t));
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
	#r = M(0);
	get key() {
		return k(this.#r);
	}
	set key(e) {
		p(this.#r, e, !0);
	}
	#i = M(null);
	get viewportNode() {
		return k(this.#i);
	}
	set viewportNode(e) {
		p(this.#i, e, !0);
	}
	#a = M(null);
	get inputNode() {
		return k(this.#a);
	}
	set inputNode(e) {
		p(this.#a, e, !0);
	}
	#o = M(null);
	get labelNode() {
		return k(this.#o);
	}
	set labelNode(e) {
		p(this.#o, e, !0);
	}
	#s = M(Ie);
	get commandState() {
		return k(this.#s);
	}
	set commandState(e) {
		p(this.#s, e);
	}
	#c = M(x(Ie));
	get _commandState() {
		return k(this.#c);
	}
	set _commandState(e) {
		p(this.#c, e, !0);
	}
	#l() {
		return w(this._commandState);
	}
	#u(e) {
		me(() => {
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
		this.opts = e, this.attachment = R(this.opts.ref);
		let t = {
			...this._commandState,
			value: this.opts.value.current ?? ""
		};
		this._commandState = t, this.commandState = t, this.onkeydown = this.onkeydown.bind(this), ue(() => {
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
			let t = e.closest(Ae);
			if (t) {
				let n = e.parentElement === t ? e : e.closest(`${Ae} > *`);
				n && t.appendChild(n);
			} else {
				let t = e.parentElement === r ? e : e.closest(`${Ae} > *`);
				t && r?.appendChild(t);
			}
		}
		let a = n.sort((e, t) => t[1] - e[1]);
		for (let e of a) {
			let t = r?.querySelector(`${H}[${B}="${ke(e[0])}"]`);
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
			let e = this.getValidItems().find((e) => e.getAttribute("aria-disabled") !== "true")?.getAttribute(B), t = this.#t && this.opts.disableInitialScroll.current;
			this.setValue(e ?? "", t), this.#t = !1;
		});
	}
	#h(e) {
		me(() => {
			this._commandState.value === e && (this.getValidItems().some((t) => t.getAttribute(B) === e) || this.#m());
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
		return e ? Array.from(e.querySelectorAll(Ne)).filter((e) => !!e) : [];
	}
	getVisibleItems() {
		let e = this.opts.ref.current;
		return e ? Array.from(e.querySelectorAll(Me)).filter((e) => !!e) : [];
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
		let t = e.querySelector(`${Ne}[data-selected]`);
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
						(e?.closest(H)?.querySelector(je))?.scrollIntoView({ block: "nearest" });
						return;
					}
				} else {
					let n = _e(t);
					if (n && n.dataset?.value === e.dataset?.value) {
						let t = e?.closest(H)?.querySelector(je);
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
		t && this.setValue(t.getAttribute(B) ?? "");
	}
	updateSelectedByItem(e) {
		let t = this.#v(), n = this.getValidItems(), r = n.findIndex((e) => e === t), i = n[r + e];
		this.opts.loop.current && (i = r + e < 0 ? n[n.length - 1] : r + e === n.length ? n[0] : n[r + e]), i && this.setValue(i.getAttribute(B) ?? "");
	}
	updateSelectedByGroup(e) {
		let t = this.#v()?.closest(H), n;
		for (; t && !n;) t = e > 0 ? De(t, H) : Oe(t, H), n = t?.querySelector(Ne);
		n ? this.setValue(n.getAttribute(B) ?? "") : this.updateSelectedByItem(e);
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
				let e = t.getAttribute(B);
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
			if (i = e[r]?.ref ?? null, i !== null && Re(i)) i = null;
			else {
				if (i === null) for (let t = e.length - 1; t >= 0; t--) {
					let t = e[e.length - 1];
					if (!(t === void 0 || Re(t.ref))) {
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
				if (i = e[r]?.ref ?? null, i !== null && Re(i)) i = null;
				else {
					if (i === null) for (let t = e.length - 1; t >= 0; t--) {
						let t = e[e.length - 1];
						if (!(t === void 0 || Re(t.ref))) {
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
			case ve:
				this.isGrid ? this.#C(e) : this.#S(e);
				break;
			case fe:
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
			case ge:
				this.isGrid ? this.#O(e) : this.#j(e);
				break;
			case be:
				if (!this.isGrid) break;
				this.#j(e);
				break;
			case ye:
				e.preventDefault(), this.updateSelectedToIndex(0);
				break;
			case "End":
				e.preventDefault(), this.#x();
				break;
			case pe: if (!e.isComposing && e.keyCode !== 229) {
				e.preventDefault();
				let t = this.#v();
				t && t?.click();
			}
		}
	}
	#M = u(() => ({
		id: this.opts.id.current,
		role: "application",
		[V.root]: "",
		tabindex: -1,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return k(this.#M);
	}
	set props(e) {
		p(this.#M, e);
	}
};
function Re(e) {
	return e.getAttribute("aria-disabled") === "true";
}
var ze = class e {
	static create(t) {
		return new e(t, U.get());
	}
	opts;
	root;
	attachment;
	#e = u(() => this.root._commandState.filtered.count === 0 && this.#t === !1 || this.opts.forceMount.current);
	get shouldRender() {
		return k(this.#e);
	}
	set shouldRender(e) {
		p(this.#e, e);
	}
	#t = !0;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = R(this.opts.ref), A(() => {
			this.#t = !1;
		});
	}
	#n = u(() => ({
		id: this.opts.id.current,
		role: "presentation",
		[V.empty]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#n);
	}
	set props(e) {
		p(this.#n, e);
	}
}, Be = class e {
	static create(t) {
		return new e(t, U.get());
	}
	opts;
	root;
	attachment;
	#e = u(() => {
		let e = this.root.viewportNode?.querySelector(`${Me}[${B}="${ke(this.root.opts.value.current)}"]`);
		if (e != null) return e.getAttribute("id") ?? void 0;
	});
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = R(this.opts.ref, (e) => this.root.inputNode = e), F(() => this.opts.ref.current, () => {
			let e = this.opts.ref.current;
			e && this.opts.autofocus.current && Se(10, () => e.focus());
		}), F(() => this.opts.value.current, () => {
			this.root.commandState.search !== this.opts.value.current && this.root.setState("search", this.opts.value.current);
		});
	}
	#t = u(() => ({
		id: this.opts.id.current,
		type: "text",
		[V.input]: "",
		autocomplete: "off",
		autocorrect: "off",
		spellcheck: !1,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": ae(!0),
		"aria-controls": this.root.viewportNode?.id ?? void 0,
		"aria-labelledby": this.root.labelNode?.id ?? void 0,
		"aria-activedescendant": k(this.#e),
		...this.attachment
	}));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		p(this.#t, e);
	}
}, Ve = class e {
	static create(t) {
		let n = Fe.getOr(null);
		return new e({
			...t,
			group: n
		}, U.get());
	}
	opts;
	root;
	attachment;
	#e = null;
	#t = u(() => this.opts.forceMount.current || this.#e?.opts.forceMount.current === !0);
	#n = u(() => {
		if (this.opts.ref.current, k(this.#t) || this.root.opts.shouldFilter.current === !1 || !this.root.commandState.search) return !0;
		let e = this.root.commandState.filtered.items.get(this.trueValue);
		return e !== void 0 && e > 0;
	});
	get shouldRender() {
		return k(this.#n);
	}
	set shouldRender(e) {
		p(this.#n, e);
	}
	#r = u(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
	get isSelected() {
		return k(this.#r);
	}
	set isSelected(e) {
		p(this.#r, e);
	}
	#i = M("");
	get trueValue() {
		return k(this.#i);
	}
	set trueValue(e) {
		p(this.#i, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.root = t, this.#e = Fe.getOr(null), this.trueValue = e.value.current, this.attachment = R(this.opts.ref), F([
			() => this.trueValue,
			() => this.#e?.trueValue,
			() => this.opts.forceMount.current
		], () => {
			if (!this.opts.forceMount.current && this.trueValue) return this.root.registerItem(this.trueValue, this.#e?.trueValue);
		}), F([() => this.opts.value.current, () => this.opts.ref.current], () => {
			this.opts.value.current ? this.trueValue = this.opts.value.current : this.opts.ref.current?.textContent && (this.trueValue = this.opts.ref.current.textContent.trim()), this.trueValue && (this.root.registerValue(this.trueValue, e.keywords.current.map((e) => e.trim())), this.opts.ref.current?.setAttribute(B, this.trueValue));
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
	#s = u(() => ({
		id: this.opts.id.current,
		"aria-disabled": ae(this.opts.disabled.current),
		"aria-selected": ae(this.isSelected),
		"data-disabled": se(this.opts.disabled.current),
		"data-selected": se(this.isSelected),
		"data-value": this.trueValue,
		"data-group": this.#e?.trueValue,
		[V.item]: "",
		role: "option",
		onpointermove: this.onpointermove,
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return k(this.#s);
	}
	set props(e) {
		p(this.#s, e);
	}
}, He = class e {
	static create(t) {
		return new e(t);
	}
	opts;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = R(this.opts.ref);
	}
	#e = u(() => ({
		id: this.opts.id.current,
		role: "progressbar",
		"aria-valuenow": this.opts.progress.current,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": "Loading...",
		[V.loading]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, Ue = class e {
	static create(t) {
		return Pe.set(new e(t, U.get()));
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = R(this.opts.ref);
	}
	#e = u(() => ({
		id: this.opts.id.current,
		role: "listbox",
		"aria-label": this.opts.ariaLabel.current,
		[V.list]: "",
		...this.attachment
	}));
	get props() {
		return k(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, We = class e {
	static create(t) {
		return new e(t, U.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = R(this.opts.ref, (e) => this.root.labelNode = e);
	}
	#e = u(() => ({
		id: this.opts.id.current,
		[V["input-label"]]: "",
		for: this.opts.for?.current,
		style: le,
		...this.attachment
	}));
	get props() {
		return k(this.#e);
	}
	set props(e) {
		p(this.#e, e);
	}
}, Ge = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"id",
	"ref",
	"children"
]), Ke = D("<label><!></label>");
function qe(e, a) {
	let o = f();
	t(a, !0);
	let s = O(a, "id", 19, () => z(o)), d = O(a, "ref", 15, null), p = S(a, Ge), m = We.create({
		id: P(() => s()),
		ref: P(() => d(), (e) => d(e))
	}), h = u(() => L(p, m.props));
	var g = Ke();
	j(g, () => ({ ...k(h) }));
	var _ = v(g);
	r(_, () => a.children ?? l), c(g), i(e, g), n();
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
]), Ye = D("<!> <!>", 1), Xe = D("<div><!> <!></div>");
function Ze(p, m) {
	let h = f();
	t(m, !0);
	let g = (e) => {
		qe(e, {
			children: (e, t) => {
				s();
				var n = d();
				_(() => a(n, ee())), i(e, n);
			},
			$$slots: { default: !0 }
		});
	}, y = O(m, "id", 19, () => z(h)), x = O(m, "ref", 15, null), C = O(m, "value", 15, ""), w = O(m, "onValueChange", 3, he), T = O(m, "onStateChange", 3, he), D = O(m, "loop", 3, !1), A = O(m, "shouldFilter", 3, !0), M = O(m, "filter", 3, yt), ee = O(m, "label", 3, ""), te = O(m, "vimBindings", 3, !0), ne = O(m, "disablePointerSelection", 3, !1), re = O(m, "disableInitialScroll", 3, !1), N = O(m, "columns", 3, null), F = S(m, Je), I = Le.create({
		id: P(() => y()),
		ref: P(() => x(), (e) => x(e)),
		filter: P(() => M()),
		shouldFilter: P(() => A()),
		loop: P(() => D()),
		value: P(() => C(), (e) => {
			C() !== e && (C(e), w()(e));
		}),
		vimBindings: P(() => te()),
		disablePointerSelection: P(() => ne()),
		disableInitialScroll: P(() => re()),
		onStateChange: P(() => T()),
		columns: P(() => N())
	}), R = (e) => I.updateSelectedToIndex(e), ie = (e) => I.updateSelectedByGroup(e), ae = (e) => I.updateSelectedByItem(e), oe = () => I.getValidItems(), se = u(() => L(F, I.props));
	var ce = {
		updateSelectedToIndex: R,
		updateSelectedByGroup: ie,
		updateSelectedByItem: ae,
		getValidItems: oe
	}, le = o(), ue = b(le), de = (e) => {
		var t = Ye(), n = b(t);
		g(n);
		var a = E(n, 2);
		r(a, () => m.child, () => ({ props: k(se) })), i(e, t);
	}, fe = (e) => {
		var t = Xe();
		j(t, () => ({ ...k(se) }));
		var n = v(t);
		g(n);
		var a = E(n, 2);
		r(a, () => m.children ?? l), c(t), i(e, t);
	};
	return e(ue, (e) => {
		m.child ? e(de) : e(fe, -1);
	}), i(p, le), n(ce);
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
]), $e = D("<div><!></div>"), et = D("<div style=\"display: contents;\" data-item-wrapper=\"\"><!></div>");
function tt(a, s) {
	let d = f();
	t(s, !0);
	let p = O(s, "id", 19, () => z(d)), m = O(s, "ref", 15, null), h = O(s, "value", 3, ""), y = O(s, "disabled", 3, !1), x = O(s, "onSelect", 3, he), C = O(s, "forceMount", 3, !1), w = O(s, "keywords", 19, () => []), T = S(s, Qe), E = Ve.create({
		id: P(() => p()),
		ref: P(() => m(), (e) => m(e)),
		value: P(() => h()),
		disabled: P(() => y()),
		onSelect: P(() => x()),
		forceMount: P(() => C()),
		keywords: P(() => w())
	}), D = u(() => L(T, E.props));
	var A = o(), M = b(A);
	ee(M, () => E.root.key, (t) => {
		var n = et(), a = v(n), u = (t) => {
			var n = o(), a = b(n), u = (e) => {
				var t = o(), n = b(t);
				r(n, () => s.child, () => ({ props: k(D) })), i(e, t);
			}, d = (e) => {
				var t = $e();
				j(t, () => ({ ...k(D) }));
				var n = v(t);
				r(n, () => s.children ?? l), c(t), i(e, t);
			};
			e(a, (e) => {
				s.child ? e(u) : e(d, -1);
			}), i(t, n);
		};
		e(a, (e) => {
			E.shouldRender && e(u);
		}), c(n), _(() => g(n, "data-value", E.trueValue)), i(t, n);
	}), i(a, A), n();
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
]), rt = D("<div><!></div>");
function it(a, s) {
	let d = f();
	t(s, !0);
	let p = O(s, "id", 19, () => z(d)), m = O(s, "ref", 15, null), h = S(s, nt), g = Ue.create({
		id: P(() => p()),
		ref: P(() => m(), (e) => m(e)),
		ariaLabel: P(() => s["aria-label"] ?? "Suggestions...")
	}), _ = u(() => L(h, g.props));
	var y = o(), x = b(y);
	ee(x, () => g.root.opts.shouldFilter.current === !1 || g.root._commandState.search === "", (t) => {
		var n = o(), a = b(n), u = (e) => {
			var t = o(), n = b(t);
			r(n, () => s.child, () => ({ props: k(_) })), i(e, t);
		}, d = (e) => {
			var t = rt();
			j(t, () => ({ ...k(_) }));
			var n = v(t);
			r(n, () => s.children ?? l), c(t), i(e, t);
		};
		e(a, (e) => {
			s.child ? e(u) : e(d, -1);
		}), i(t, n);
	}), i(a, y), n();
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
		this.#e = e, this.#t = t, this.handler = this.handler.bind(this), T(this.handler);
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
	#t = M(!1);
	#n = !1;
	#r = M(void 0);
	#i = null;
	constructor(e) {
		this.opts = e, this.present = this.opts.open, p(this.#t, e.open.current, !0), this.#e = new de({
			ref: this.opts.ref,
			afterTick: this.opts.open
		}), ue(() => this.#o()), F(() => this.present.current, (e) => {
			this.#n ? (this.#o(), e && p(this.#t, !0), p(this.#r, e ? "starting" : "ending", !0), e && (this.#i = window.requestAnimationFrame(() => {
				this.#i = null, this.present.current && p(this.#r, void 0);
			})), this.#e.run(() => {
				e === this.present.current && (e || p(this.#t, !1), p(this.#r, void 0));
			})) : this.#n = !0;
		});
	}
	#a = u(() => k(this.#t));
	get isPresent() {
		return k(this.#a);
	}
	set isPresent(e) {
		p(this.#a, e);
	}
	get transitionStatus() {
		return k(this.#r);
	}
	#o() {
		this.#i !== null && (window.cancelAnimationFrame(this.#i), this.#i = null);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte
function Tt(a, s) {
	t(s, !0);
	let c = new wt({
		open: P(() => s.open),
		ref: h(() => s.ref)
	});
	var u = o(), d = b(u), f = (e) => {
		var t = o(), n = b(t);
		r(n, () => s.presence ?? l, () => ({
			present: c.isPresent,
			transitionStatus: c.transitionStatus
		})), i(e, t);
	};
	e(d, (e) => {
		(s.forceMount || s.open || c.isPresent) && e(f);
	}), i(a, u), n();
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
		this.state = ie(e), this.#e = t, this.dispatch = this.dispatch.bind(this);
	}
	#t(e) {
		return this.#e[this.state.current][e] ?? this.state.current;
	}
	dispatch(e) {
		this.state.current = this.#t(e);
	}
}, Ot = oe({
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
	#e = M(null);
	get scrollAreaNode() {
		return k(this.#e);
	}
	set scrollAreaNode(e) {
		p(this.#e, e, !0);
	}
	#t = M(null);
	get viewportNode() {
		return k(this.#t);
	}
	set viewportNode(e) {
		p(this.#t, e, !0);
	}
	#n = M(null);
	get contentNode() {
		return k(this.#n);
	}
	set contentNode(e) {
		p(this.#n, e, !0);
	}
	#r = M(null);
	get scrollbarXNode() {
		return k(this.#r);
	}
	set scrollbarXNode(e) {
		p(this.#r, e, !0);
	}
	#i = M(null);
	get scrollbarYNode() {
		return k(this.#i);
	}
	set scrollbarYNode(e) {
		p(this.#i, e, !0);
	}
	#a = M(0);
	get cornerWidth() {
		return k(this.#a);
	}
	set cornerWidth(e) {
		p(this.#a, e, !0);
	}
	#o = M(0);
	get cornerHeight() {
		return k(this.#o);
	}
	set cornerHeight(e) {
		p(this.#o, e, !0);
	}
	#s = M(!1);
	get scrollbarXEnabled() {
		return k(this.#s);
	}
	set scrollbarXEnabled(e) {
		p(this.#s, e, !0);
	}
	#c = M(!1);
	get scrollbarYEnabled() {
		return k(this.#c);
	}
	set scrollbarYEnabled(e) {
		p(this.#c, e, !0);
	}
	domContext;
	constructor(e) {
		this.opts = e, this.attachment = R(e.ref, (e) => this.scrollAreaNode = e), this.domContext = new re(e.ref);
	}
	#l = u(() => ({
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
		p(this.#l, e);
	}
}, Pt = class e {
	static create(t) {
		return new e(t, kt.get());
	}
	opts;
	root;
	attachment;
	#e = ie(xe());
	#t = ie(null);
	contentAttachment = R(this.#t, (e) => this.root.contentNode = e);
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = R(e.ref, (e) => this.root.viewportNode = e);
	}
	#n = u(() => ({
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
		p(this.#n, e);
	}
	#r = u(() => ({
		id: this.#e.current,
		"data-scroll-area-content": "",
		style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0 },
		...this.contentAttachment
	}));
	get contentProps() {
		return k(this.#r);
	}
	set contentProps(e) {
		p(this.#r, e);
	}
}, Ft = class e {
	static create(t) {
		return G.set(new e(t, kt.get()));
	}
	opts;
	root;
	#e = u(() => this.opts.orientation.current === "horizontal");
	get isHorizontal() {
		return k(this.#e);
	}
	set isHorizontal(e) {
		p(this.#e, e);
	}
	#t = M(!1);
	get hasThumb() {
		return k(this.#t);
	}
	set hasThumb(e) {
		p(this.#t, e, !0);
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
	#e = M(!1);
	get isVisible() {
		return k(this.#e);
	}
	set isVisible(e) {
		p(this.#e, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root, T(() => {
			let e = this.root.scrollAreaNode, t = this.root.opts.scrollHideDelay.current, n = 0;
			if (!e) return;
			let r = ne(y(e, "pointerenter", () => {
				this.root.domContext.clearTimeout(n), h(() => this.isVisible = !0);
			}), y(e, "pointerleave", () => {
				n && this.root.domContext.clearTimeout(n), n = this.root.domContext.setTimeout(() => {
					h(() => {
						this.scrollbar.hasThumb = !1, this.isVisible = !1;
					});
				}, t);
			}));
			return () => {
				this.root.domContext.getWindow().clearTimeout(n), r();
			};
		});
	}
	#t = u(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		p(this.#t, e);
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
	#e = u(() => this.machine.state.current === "hidden");
	get isHidden() {
		return k(this.#e);
	}
	set isHidden(e) {
		p(this.#e, e);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root;
		let t = I(() => this.machine.dispatch("SCROLL_END"), 100);
		T(() => {
			let e = this.machine.state.current, t = this.root.opts.scrollHideDelay.current;
			if (e === "idle") {
				let e = this.root.domContext.setTimeout(() => this.machine.dispatch("HIDE"), t);
				return () => this.root.domContext.clearTimeout(e);
			}
		}), T(() => {
			let e = this.root.viewportNode;
			if (!e) return;
			let n = this.scrollbar.isHorizontal ? "scrollLeft" : "scrollTop", r = e[n];
			return y(e, "scroll", () => {
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
	#t = u(() => ({
		"data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave
	}));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		p(this.#t, e);
	}
}, Rt = class e {
	static create() {
		return new e(G.get());
	}
	scrollbar;
	root;
	#e = M(!1);
	get isVisible() {
		return k(this.#e);
	}
	set isVisible(e) {
		p(this.#e, e, !0);
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
	#t = u(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return k(this.#t);
	}
	set props(e) {
		p(this.#t, e);
	}
}, zt = class e {
	static create() {
		return At.set(new e(G.get()));
	}
	scrollbar;
	root;
	#e = M(null);
	get thumbNode() {
		return k(this.#e);
	}
	set thumbNode(e) {
		p(this.#e, e, !0);
	}
	#t = M(0);
	get pointerOffset() {
		return k(this.#t);
	}
	set pointerOffset(e) {
		p(this.#t, e, !0);
	}
	#n = M({
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
		p(this.#n, e);
	}
	#r = u(() => Gt(this.sizes.viewport, this.sizes.content));
	get thumbRatio() {
		return k(this.#r);
	}
	set thumbRatio(e) {
		p(this.#r, e);
	}
	#i = u(() => this.thumbRatio > 0 && this.thumbRatio < 1);
	get hasThumb() {
		return k(this.#i);
	}
	set hasThumb(e) {
		p(this.#i, e);
	}
	#a = M("");
	get prevTransformStyle() {
		return k(this.#a);
	}
	set prevTransformStyle(e) {
		p(this.#a, e, !0);
	}
	constructor(e) {
		this.scrollbar = e, this.root = e.root, T(() => {
			this.scrollbar.hasThumb = this.hasThumb;
		}), T(() => {
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
	#e = M();
	get computedStyle() {
		return k(this.#e);
	}
	set computedStyle(e) {
		p(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = R(this.scrollbar.opts.ref, (e) => this.root.scrollbarXNode = e), T(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), T(() => {
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
	#t = u(() => Kt(this.scrollbarVis.sizes));
	get thumbSize() {
		return k(this.#t);
	}
	set thumbSize(e) {
		p(this.#t, e);
	}
	#n = u(() => ({
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
		p(this.#n, e);
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
	#e = M();
	get computedStyle() {
		return k(this.#e);
	}
	set computedStyle(e) {
		p(this.#e, e, !0);
	}
	constructor(e, t) {
		this.opts = e, this.scrollbarVis = t, this.root = t.root, this.scrollbar = t.scrollbar, this.attachment = R(this.scrollbar.opts.ref, (e) => this.root.scrollbarYNode = e), T(() => {
			this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
		}), T(() => {
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
	#t = u(() => Kt(this.scrollbarVis.sizes));
	get thumbSize() {
		return k(this.#t);
	}
	set thumbSize(e) {
		p(this.#t, e);
	}
	#n = u(() => ({
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
		p(this.#n, e);
	}
}, Ht = class e {
	static create() {
		return Mt.set(new e(jt.get()));
	}
	scrollbarState;
	root;
	scrollbarVis;
	scrollbar;
	#e = M(null);
	get rect() {
		return k(this.#e);
	}
	set rect(e) {
		p(this.#e, e);
	}
	#t = M("");
	get prevWebkitUserSelect() {
		return k(this.#t);
	}
	set prevWebkitUserSelect(e) {
		p(this.#t, e, !0);
	}
	handleResize;
	handleThumbPositionChange;
	handleWheelScroll;
	handleThumbPointerDown;
	handleThumbPointerUp;
	#n = u(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport);
	get maxScrollPos() {
		return k(this.#n);
	}
	set maxScrollPos(e) {
		p(this.#n, e);
	}
	constructor(e) {
		this.scrollbarState = e, this.root = e.root, this.scrollbarVis = e.scrollbarVis, this.scrollbar = e.scrollbarVis.scrollbar, this.handleResize = () => this.scrollbarState.onResize(), this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange, this.handleWheelScroll = this.scrollbarState.onWheelScroll, this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown, this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp, T(() => {
			let e = this.maxScrollPos, t = this.scrollbar.opts.ref.current;
			return this.root.viewportNode, y(this.root.domContext.getDocument(), "wheel", (n) => {
				let r = n.target;
				t?.contains(r) && this.handleWheelScroll(n, e);
			}, { passive: !1 });
		}), A(() => {
			this.scrollbarVis.sizes, h(() => this.handleThumbPositionChange());
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
	#i = u(() => L({
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
		p(this.#i, e);
	}
}, Ut = class e {
	static create(t) {
		return new e(t, Mt.get());
	}
	opts;
	scrollbarState;
	attachment;
	#e;
	#t = M();
	#n = I(() => {
		k(this.#t) && (k(this.#t)(), p(this.#t, void 0));
	}, 100);
	constructor(e, t) {
		this.opts = e, this.scrollbarState = t, this.#e = t.root, this.attachment = R(this.opts.ref, (e) => this.scrollbarState.scrollbarVis.thumbNode = e), T(() => {
			let e = this.#e.viewportNode;
			return e ? (h(() => this.scrollbarState.handleThumbPositionChange()), y(e, "scroll", () => {
				if (this.#n(), !k(this.#t)) {
					let t = Zt(e, this.scrollbarState.handleThumbPositionChange);
					p(this.#t, t, !0), this.scrollbarState.handleThumbPositionChange();
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
	#r = u(() => ({
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
		p(this.#r, e);
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
	}, r = 0, i = te(e);
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
]), $t = D("<div><!></div>");
function en(a, s) {
	let d = f();
	t(s, !0);
	let p = O(s, "ref", 15, null), m = O(s, "id", 19, () => z(d)), h = O(s, "type", 3, "hover"), g = O(s, "dir", 3, "ltr"), _ = O(s, "scrollHideDelay", 3, 600), y = S(s, Qt), x = Nt.create({
		type: P(() => h()),
		dir: P(() => g()),
		scrollHideDelay: P(() => _()),
		id: P(() => m()),
		ref: P(() => p(), (e) => p(e))
	}), C = u(() => L(y, x.props));
	var w = o(), T = b(w), E = (e) => {
		var t = o(), n = b(t);
		r(n, () => s.child, () => ({ props: k(C) })), i(e, t);
	}, D = (e) => {
		var t = $t();
		j(t, () => ({ ...k(C) }));
		var n = v(t);
		r(n, () => s.children ?? l), c(t), i(e, t);
	};
	e(T, (e) => {
		s.child ? e(E) : e(D, -1);
	}), i(a, w), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-viewport.svelte
var tn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"ref",
	"id",
	"children"
]), nn = D("<div><div><!></div></div>"), rn = {
	hash: "svelte-1gl71oa",
	code: "\n	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */[data-scroll-area-viewport] {scrollbar-width:none !important;-ms-overflow-style:none !important;-webkit-overflow-scrolling:touch !important;}[data-scroll-area-viewport]::-webkit-scrollbar {display:none !important;}:where([data-scroll-area-viewport]) {display:flex;flex-direction:column;align-items:stretch;}:where([data-scroll-area-content]) {flex-grow:1;}"
};
function an(e, a) {
	let o = f();
	t(a, !0), C(e, rn);
	let s = O(a, "ref", 15, null), d = O(a, "id", 19, () => z(o)), p = S(a, tn), m = Pt.create({
		id: P(() => d()),
		ref: P(() => s(), (e) => s(e))
	}), h = u(() => L(p, m.props)), g = u(() => L({}, m.contentProps));
	var _ = nn();
	j(_, () => ({ ...k(h) }));
	var y = v(_);
	j(y, () => ({ ...k(g) }));
	var b = v(y);
	r(b, () => a.children ?? l), c(y), c(_), i(e, _), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-shared.svelte
var on = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children"
]), sn = D("<div><!></div>");
function cn(a, s) {
	t(s, !0);
	let d = S(s, on), f = Ht.create(), p = u(() => L(d, f.props));
	var m = o(), h = b(m), g = (e) => {
		var t = o(), n = b(t);
		r(n, () => s.child, () => ({ props: k(p) })), i(e, t);
	}, _ = (e) => {
		var t = sn();
		j(t, () => ({ ...k(p) }));
		var n = v(t);
		r(n, () => s.children ?? l), c(t), i(e, t);
	};
	e(h, (e) => {
		s.child ? e(g) : e(_, -1);
	}), i(a, m), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-x.svelte
var ln = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function un(e, r) {
	t(r, !0);
	let i = S(r, ln), a = new ce(), o = Bt.create({ mounted: P(() => a.current) }), s = u(() => L(i, o.props));
	cn(e, m(() => k(s))), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-y.svelte
var dn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function fn(e, r) {
	t(r, !0);
	let i = S(r, dn), a = new ce(), o = Vt.create({ mounted: P(() => a.current) }), s = u(() => L(i, o.props));
	cn(e, m(() => k(s))), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-visible.svelte
var pn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy"
]);
function mn(r, a) {
	t(a, !0);
	let s = S(a, pn), c = zt.create();
	var l = o(), u = b(l), d = (e) => {
		un(e, m(() => s));
	}, f = (e) => {
		fn(e, m(() => s));
	};
	e(u, (e) => {
		c.scrollbar.opts.orientation.current === "horizontal" ? e(d) : e(f, -1);
	}), i(r, l), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-auto.svelte
var hn = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"forceMount"
]);
function gn(e, r) {
	t(r, !0);
	let i = O(r, "forceMount", 3, !1), a = S(r, hn), o = Rt.create(), s = u(() => L(a, o.props));
	{
		let t = (e) => {
			mn(e, m(() => k(s)));
		}, n = u(() => i() || o.isVisible);
		Tt(e, {
			get open() {
				return k(n);
			},
			get ref() {
				return o.scrollbar.opts.ref;
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
function vn(e, r) {
	t(r, !0);
	let i = O(r, "forceMount", 3, !1), a = S(r, _n), o = Lt.create(), s = u(() => L(a, o.props));
	{
		let t = (e) => {
			mn(e, m(() => k(s)));
		}, n = u(() => i() || !o.isHidden);
		Tt(e, m(() => k(s), {
			get open() {
				return k(n);
			},
			get ref() {
				return o.scrollbar.opts.ref;
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
function bn(e, r) {
	t(r, !0);
	let i = O(r, "forceMount", 3, !1), a = S(r, yn), o = It.create(), s = Rt.create(), c = u(() => L(a, o.props, s.props, { "data-state": o.isVisible ? "visible" : "hidden" })), l = u(() => i() || o.isVisible && s.isVisible);
	Tt(e, {
		get open() {
			return k(l);
		},
		get ref() {
			return s.scrollbar.opts.ref;
		},
		presence: (e) => {
			mn(e, m(() => k(c)));
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
function Sn(r, a) {
	let s = f();
	t(a, !0);
	let c = O(a, "ref", 15, null), l = O(a, "id", 19, () => z(s)), d = S(a, xn), p = Ft.create({
		orientation: P(() => a.orientation),
		id: P(() => l()),
		ref: P(() => c(), (e) => c(e))
	}), h = u(() => p.root.opts.type.current);
	var g = o(), _ = b(g), v = (e) => {
		bn(e, m(() => d, { get id() {
			return l();
		} }));
	}, y = (e) => {
		vn(e, m(() => d, { get id() {
			return l();
		} }));
	}, x = (e) => {
		gn(e, m(() => d, { get id() {
			return l();
		} }));
	}, C = (e) => {
		mn(e, m(() => d, { get id() {
			return l();
		} }));
	};
	e(_, (e) => {
		k(h) === "hover" ? e(v) : k(h) === "scroll" ? e(y, 1) : k(h) === "auto" ? e(x, 2) : k(h) === "always" && e(C, 3);
	}), i(r, g), n();
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
]), wn = D("<div><!></div>");
function Tn(a, s) {
	t(s, !0);
	let d = O(s, "ref", 15, null), f = S(s, Cn), p = new ce(), m = Ut.create({
		id: P(() => s.id),
		ref: P(() => d(), (e) => d(e)),
		mounted: P(() => p.current)
	}), h = u(() => L(f, m.props, { style: { hidden: !s.present } }));
	var g = o(), _ = b(g), y = (e) => {
		var t = o(), n = b(t);
		r(n, () => s.child, () => ({ props: k(h) })), i(e, t);
	}, x = (e) => {
		var t = wn();
		j(t, () => ({ ...k(h) }));
		var n = v(t);
		r(n, () => s.children ?? l), c(t), i(e, t);
	};
	e(_, (e) => {
		s.child ? e(y) : e(x, -1);
	}), i(a, g), n();
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
function Dn(e, r) {
	let i = f();
	t(r, !0);
	let a = O(r, "id", 19, () => z(i)), o = O(r, "ref", 15, null), s = O(r, "forceMount", 3, !1), c = S(r, En), l = At.get();
	{
		let t = (e, t) => {
			let n = () => (t?.()).present;
			Tn(e, m(() => c, {
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
		}, n = u(() => s() || l.hasThumb);
		Tt(e, {
			get open() {
				return k(n);
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
var K = M([]), q = M(!1), J = M(null), Y = M(null), On = null, X = null, Z = 0, Q = 0, kn = 0, An = /* @__PURE__ */ new Map();
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
	p(K, []), p(q, !1), p(J, null), p(Y, null), On = null, X = null;
}
function In() {
	Z += 1, p(q, !1);
}
function Ln(e) {
	let t = An.get(e);
	if (t) return t;
	let n = Te(e).finally(() => {
		An.delete(e);
	});
	return An.set(e, n), n;
}
async function Rn(e, t) {
	let n = await Ln(e.loadKey);
	return !t() || n.length === 0 ? !1 : (p(K, n), p(J, null), p(Y, e.loadKey, !0), !0);
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
			p(q, !r), p(J, null), p(Y, t, !0);
			try {
				let t = await Ce({
					rxNostr: e.rxNostr,
					pubkey: e.pubkey
				});
				if (!$(n) || (p(K, t), await we(n.loadKey, t), !$(n))) return;
				Ee(t.map((e) => e.src)), On = n.loadKey;
			} catch {
				if (!$(n)) return;
				p(J, "customEmoji.load_failed"), r || p(K, []);
			} finally {
				$(n) && p(q, !1);
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
