import { A as e, At as t, B as n, C as r, Ct as i, F as a, G as o, J as s, M as c, N as l, Q as u, R as d, T as f, U as p, V as m, W as h, X as g, Y as _, at as v, ct as y, dt as b, et as x, f as S, ft as C, g as ee, gt as w, i as T, jt as E, k as te, lt as D, mt as O, n as ne, o as re, ot as ie, r as ae, s as oe, t as se, tt as ce, u as le, ut as ue, v as k, w as de, wt as fe, xt as pe, yt as A, z as me } from "./index-client-Bdka-Daw.js";
import { i as he, n as ge } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { $ as _e, pt as ve, t as ye } from "./LoadingPlaceholder-j1_vRYno.js";
import { a as be, c as xe, gt as Se, i as Ce, o as we, pt as Te, yt as Ee } from "./appUtils-C7IXsQBk.js";
import { C as De, S as Oe, a as ke, b as Ae } from "./uploadStore.svelte-CqQfA1h_.js";
import { c as je, n as Me } from "./legacyImportMarkers-CZ4J2IrE.js";
import { a as Ne, c as Pe, d as Fe, i as Ie, n as Le, r as Re, u as ze } from "./clipboardUtils-CZAthnT_.js";
import { i as Be, n as Ve, r as He, s as Ue } from "./floating-ui.dom-BRmGhLhL.js";
import { a as We, c as Ge, i as Ke, n as qe, o as Je, r as Ye, s as Xe, t as Ze } from "./customEmojiStore.svelte-emb-rLwV.js";
import { d as Qe, o as $e, r as et, s as tt, u as nt } from "./customEmoji-Bvbh2sQz.js";
import { _ as rt, a as it, c as at, d as ot, f as st, i as ct, l as lt, n as ut, o as dt, r as ft, s as pt, t as mt, u as ht } from "./mediaNodeUtils-DykrJwDv.js";
import { i as gt, r as _t } from "./keyboardFocusUtils-Cil9djR5.js";
import { t as vt } from "./reactionValue-CpLSKf5v.js";
import { t as yt } from "./uploadAbortUtils-BPjD1mwB.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/core/dist/rolldown-runtime-D7D4PA-g.js
var bt = Object.defineProperty, xt = (e, t) => {
	let n = {};
	for (var r in e) bt(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || bt(n, Symbol.toStringTag, { value: "Module" }), n;
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/orderedmap/dist/index.js
function St(e) {
	this.content = e;
}
St.prototype = {
	constructor: St,
	find: function(e) {
		for (var t = 0; t < this.content.length; t += 2) if (this.content[t] === e) return t;
		return -1;
	},
	get: function(e) {
		var t = this.find(e);
		return t == -1 ? void 0 : this.content[t + 1];
	},
	update: function(e, t, n) {
		var r = n && n != e ? this.remove(n) : this, i = r.find(e), a = r.content.slice();
		return i == -1 ? a.push(n || e, t) : (a[i + 1] = t, n && (a[i] = n)), new St(a);
	},
	remove: function(e) {
		var t = this.find(e);
		if (t == -1) return this;
		var n = this.content.slice();
		return n.splice(t, 2), new St(n);
	},
	addToStart: function(e, t) {
		return new St([e, t].concat(this.remove(e).content));
	},
	addToEnd: function(e, t) {
		var n = this.remove(e).content.slice();
		return n.push(e, t), new St(n);
	},
	addBefore: function(e, t, n) {
		var r = this.remove(t), i = r.content.slice(), a = r.find(e);
		return i.splice(a == -1 ? i.length : a, 0, t, n), new St(i);
	},
	forEach: function(e) {
		for (var t = 0; t < this.content.length; t += 2) e(this.content[t], this.content[t + 1]);
	},
	prepend: function(e) {
		return e = St.from(e), e.size ? new St(e.content.concat(this.subtract(e).content)) : this;
	},
	append: function(e) {
		return e = St.from(e), e.size ? new St(this.subtract(e).content.concat(e.content)) : this;
	},
	subtract: function(e) {
		var t = this;
		e = St.from(e);
		for (var n = 0; n < e.content.length; n += 2) t = t.remove(e.content[n]);
		return t;
	},
	toObject: function() {
		var e = {};
		return this.forEach(function(t, n) {
			e[t] = n;
		}), e;
	},
	get size() {
		return this.content.length >> 1;
	}
}, St.from = function(e) {
	if (e instanceof St) return e;
	var t = [];
	if (e) for (var n in e) t.push(n, e[n]);
	return new St(t);
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-model/dist/index.js
function Ct(e, t, n) {
	for (let r = 0;; r++) {
		if (r == e.childCount || r == t.childCount) return e.childCount == t.childCount ? null : n;
		let i = e.child(r), a = t.child(r);
		if (i == a) n += i.nodeSize;
		else {
			if (!i.sameMarkup(a)) return n;
			if (i.isText && i.text != a.text) {
				let e = i.text, t = a.text, r = 0;
				for (; e[r] == t[r]; r++) n++;
				return r && r < e.length && r < t.length && Et(e.charCodeAt(r - 1)) && Tt(e.charCodeAt(r)) && n--, n;
			}
			if (i.content.size || a.content.size) {
				let e = Ct(i.content, a.content, n + 1);
				if (e != null) return e;
			}
			n += i.nodeSize;
		}
	}
}
function wt(e, t, n, r) {
	for (let i = e.childCount, a = t.childCount;;) {
		if (i == 0 || a == 0) return i == a ? null : {
			a: n,
			b: r
		};
		let o = e.child(--i), s = t.child(--a), c = o.nodeSize;
		if (o == s) n -= c, r -= c;
		else {
			if (!o.sameMarkup(s)) return {
				a: n,
				b: r
			};
			if (o.isText && o.text != s.text) {
				let e = o.text, t = s.text, i = e.length, a = t.length;
				for (; i > 0 && a > 0 && e[i - 1] == t[a - 1];) i--, a--, n--, r--;
				return i && a && i < e.length && Et(e.charCodeAt(i - 1)) && Tt(e.charCodeAt(i)) && (n++, r++), {
					a: n,
					b: r
				};
			}
			if (o.content.size || s.content.size) {
				let e = wt(o.content, s.content, n - 1, r - 1);
				if (e) return e;
			}
			n -= c, r -= c;
		}
	}
}
function Tt(e) {
	return e >= 56320 && e < 57344;
}
function Et(e) {
	return e >= 55296 && e < 56320;
}
var j = class e {
	constructor(e, t) {
		if (this.content = e, this.size = t || 0, t == null) for (let t = 0; t < e.length; t++) this.size += e[t].nodeSize;
	}
	nodesBetween(e, t, n, r = 0, i) {
		for (let a = 0, o = 0; o < t; a++) {
			let s = this.content[a], c = o + s.nodeSize;
			if (c > e && n(s, r + o, i || null, a) !== !1 && s.content.size) {
				let i = o + 1;
				s.nodesBetween(Math.max(0, e - i), Math.min(s.content.size, t - i), n, r + i);
			}
			o = c;
		}
	}
	descendants(e) {
		this.nodesBetween(0, this.size, e);
	}
	textBetween(e, t, n, r) {
		let i = "", a = !0;
		return this.nodesBetween(e, t, (o, s) => {
			let c = o.isText ? o.text.slice(Math.max(e, s) - s, t - s) : o.isLeaf ? r ? typeof r == "function" ? r(o) : r : o.type.spec.leafText ? o.type.spec.leafText(o) : "" : "";
			o.isBlock && (o.isLeaf && c || o.isTextblock) && n && (a ? a = !1 : i += n), i += c;
		}, 0), i;
	}
	append(t) {
		if (!t.size) return this;
		if (!this.size) return t;
		let n = this.lastChild, r = t.firstChild, i = this.content.slice(), a = 0;
		for (n.isText && n.sameMarkup(r) && (i[i.length - 1] = n.withText(n.text + r.text), a = 1); a < t.content.length; a++) i.push(t.content[a]);
		return new e(i, this.size + t.size);
	}
	cut(t, n = this.size) {
		if (t == 0 && n == this.size) return this;
		let r = [], i = 0;
		if (n > t) for (let e = 0, a = 0; a < n; e++) {
			let o = this.content[e], s = a + o.nodeSize;
			s > t && ((a < t || s > n) && (o = o.isText ? o.cut(Math.max(0, t - a), Math.min(o.text.length, n - a)) : o.cut(Math.max(0, t - a - 1), Math.min(o.content.size, n - a - 1))), r.push(o), i += o.nodeSize), a = s;
		}
		return new e(r, i);
	}
	cutByIndex(t, n) {
		return t == n ? e.empty : t == 0 && n == this.content.length ? this : new e(this.content.slice(t, n));
	}
	replaceChild(t, n) {
		let r = this.content[t];
		if (r == n) return this;
		let i = this.content.slice(), a = this.size + n.nodeSize - r.nodeSize;
		return i[t] = n, new e(i, a);
	}
	addToStart(t) {
		return new e([t].concat(this.content), this.size + t.nodeSize);
	}
	addToEnd(t) {
		return new e(this.content.concat(t), this.size + t.nodeSize);
	}
	eq(e) {
		if (this.content.length != e.content.length) return !1;
		for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
		return !0;
	}
	get firstChild() {
		return this.content.length ? this.content[0] : null;
	}
	get lastChild() {
		return this.content.length ? this.content[this.content.length - 1] : null;
	}
	get childCount() {
		return this.content.length;
	}
	child(e) {
		let t = this.content[e];
		if (!t) throw RangeError("Index " + e + " out of range for " + this);
		return t;
	}
	maybeChild(e) {
		return this.content[e] || null;
	}
	forEach(e) {
		for (let t = 0, n = 0; t < this.content.length; t++) {
			let r = this.content[t];
			e(r, n, t), n += r.nodeSize;
		}
	}
	findDiffStart(e, t = 0) {
		return Ct(this, e, t);
	}
	findDiffEnd(e, t = this.size, n = e.size) {
		return wt(this, e, t, n);
	}
	findIndex(e) {
		if (e == 0) return Ot(0, e);
		if (e == this.size) return Ot(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? Ot(t + 1, i) : Ot(t, n);
			n = i;
		}
	}
	toString() {
		return "<" + this.toStringInner() + ">";
	}
	toStringInner() {
		return this.content.join(", ");
	}
	toJSON() {
		return this.content.length ? this.content.map((e) => e.toJSON()) : null;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		if (!Array.isArray(n)) throw RangeError("Invalid input for Fragment.fromJSON");
		return e.fromArray(n.map(t.nodeFromJSON));
	}
	static fromArray(t) {
		if (!t.length) return e.empty;
		let n, r = 0;
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			r += i.nodeSize, e && i.isText && t[e - 1].sameMarkup(i) ? (n ||= t.slice(0, e), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
		}
		return new e(n || t, r);
	}
	static from(t) {
		if (!t) return e.empty;
		if (t instanceof e) return t;
		if (Array.isArray(t)) return this.fromArray(t);
		if (t.attrs) return new e([t], t.nodeSize);
		throw RangeError("Can not convert " + t + " to a Fragment" + (t.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
	}
};
j.empty = new j([], 0);
var Dt = {
	index: 0,
	offset: 0
};
function Ot(e, t) {
	return Dt.index = e, Dt.offset = t, Dt;
}
function kt(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!kt(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !kt(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var M = class e {
	constructor(e, t) {
		this.type = e, this.attrs = t;
	}
	addToSet(e) {
		let t, n = !1;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.eq(i)) return e;
			if (this.type.excludes(i.type)) t ||= e.slice(0, r);
			else if (i.type.excludes(this.type)) return e;
			else !n && i.type.rank > this.type.rank && (t ||= e.slice(0, r), t.push(this), n = !0), t && t.push(i);
		}
		return t ||= e.slice(), n || t.push(this), t;
	}
	removeFromSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
		return !1;
	}
	eq(e) {
		return this == e || this.type == e.type && kt(this.attrs, e.attrs);
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Mark.fromJSON");
		let n = e.marks[t.type];
		if (!n) throw RangeError(`There is no mark type ${t.type} in this schema`);
		return n.create(t.attrs);
	}
	static sameSet(e, t) {
		if (e == t) return !0;
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!e[n].eq(t[n])) return !1;
		return !0;
	}
	static setFrom(t) {
		if (!t || Array.isArray(t) && t.length == 0) return e.none;
		if (t instanceof e) return [t];
		let n = t.slice();
		return n.sort((e, t) => e.type.rank - t.type.rank), n;
	}
};
M.none = [];
var At = class extends Error {}, N = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = Mt(this.content, t + this.openStart, n, this.openStart + 1, this.openEnd + 1);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(jt(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
	}
	eq(e) {
		return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
	}
	toString() {
		return this.content + "(" + this.openStart + "," + this.openEnd + ")";
	}
	toJSON() {
		if (!this.content.size) return null;
		let e = { content: this.content.toJSON() };
		return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		let r = n.openStart || 0, i = n.openEnd || 0;
		if (typeof r != "number" || typeof i != "number") throw RangeError("Invalid input for Slice.fromJSON");
		return new e(j.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
N.empty = new N(j.empty, 0, 0);
function jt(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(jt(a.content, t - i - 1, n - i - 1)));
}
function Mt(e, t, n, r, i, a) {
	let { index: o, offset: s } = e.findIndex(t), c = e.maybeChild(o);
	if (s == t || c.isText) return a && r <= 0 && i <= 0 && !a.canReplace(o, o, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let l = Mt(c.content, t - s - 1, n, o == 0 ? r - 1 : 0, o == e.childCount - 1 ? i - 1 : 0, c);
	return l && e.replaceChild(o, c.copy(l));
}
function Nt(e, t, n) {
	if (n.openStart > e.depth) throw new At("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new At("Inconsistent open depths");
	return Pt(e, t, n, 0);
}
function Pt(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = Pt(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	}
	if (!n.content.size) return zt(a, Vt(e, t, r));
	if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return zt(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	}
	{
		let { start: i, end: o } = Ht(n, e);
		return zt(a, Bt(e, i, o, t, r));
	}
}
function Ft(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new At("Cannot join " + t.type.name + " onto " + e.type.name);
}
function It(e, t, n) {
	let r = e.node(n);
	return Ft(r, t.node(n)), r;
}
function Lt(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function Rt(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && (Lt(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) Lt(i.child(e), r);
	t && t.depth == n && t.textOffset && Lt(t.nodeBefore, r);
}
function zt(e, t) {
	if (!e.type.validContent(t)) throw new At("Invalid content for node " + e.type.name);
	return e.copy(t);
}
function Bt(e, t, n, r, i) {
	let a = e.depth > i && It(e, t, i + 1), o = r.depth > i && It(n, r, i + 1), s = [];
	return Rt(null, e, i, s), a && o && t.index(i) == n.index(i) ? (Ft(a, o), Lt(zt(a, Bt(e, t, n, r, i + 1)), s)) : (a && Lt(zt(a, Vt(e, t, i + 1)), s), Rt(t, n, i, s), o && Lt(zt(o, Vt(n, r, i + 1)), s)), Rt(r, null, i, s), new j(s);
}
function Vt(e, t, n) {
	let r = [];
	return Rt(null, e, n, r), e.depth > n && Lt(zt(It(e, t, n + 1), Vt(e, t, n + 1)), r), Rt(t, null, n, r), new j(r);
}
function Ht(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(j.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var Ut = class e {
	constructor(e, t, n) {
		this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
	}
	resolveDepth(e) {
		return e == null ? this.depth : e < 0 ? this.depth + e : e;
	}
	get parent() {
		return this.node(this.depth);
	}
	get doc() {
		return this.node(0);
	}
	node(e) {
		return this.path[this.resolveDepth(e) * 3];
	}
	index(e) {
		return this.path[this.resolveDepth(e) * 3 + 1];
	}
	indexAfter(e) {
		return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
	}
	start(e) {
		return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
	}
	end(e) {
		return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
	}
	before(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position before the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
	}
	after(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position after the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
	}
	get textOffset() {
		return this.pos - this.path[this.path.length - 1];
	}
	get nodeAfter() {
		let e = this.parent, t = this.index(this.depth);
		if (t == e.childCount) return null;
		let n = this.pos - this.path[this.path.length - 1], r = e.child(t);
		return n ? e.child(t).cut(n) : r;
	}
	get nodeBefore() {
		let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
		return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
	}
	posAtIndex(e, t) {
		t = this.resolveDepth(t);
		let n = this.path[t * 3], r = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
		for (let t = 0; t < e; t++) r += n.child(t).nodeSize;
		return r;
	}
	marks() {
		let e = this.parent, t = this.index();
		if (e.content.size == 0) return M.none;
		if (this.textOffset) return e.child(t).marks;
		let n = e.maybeChild(t - 1), r = e.maybeChild(t);
		if (!n) {
			let e = n;
			n = r, r = e;
		}
		let i = n.marks;
		for (var a = 0; a < i.length; a++) i[a].type.spec.inclusive !== !1 || r && i[a].isInSet(r.marks) || (i = i[a--].removeFromSet(i));
		return i;
	}
	marksAcross(e) {
		let t = this.parent.maybeChild(this.index());
		if (!t || !t.isInline) return null;
		let n = t.marks, r = e.parent.maybeChild(e.index());
		for (var i = 0; i < n.length; i++) n[i].type.spec.inclusive !== !1 || r && n[i].isInSet(r.marks) || (n = n[i--].removeFromSet(n));
		return n;
	}
	sharedDepth(e) {
		for (let t = this.depth; t > 0; t--) if (this.start(t) <= e && this.end(t) >= e) return t;
		return 0;
	}
	blockRange(e = this, t) {
		if (e.pos < this.pos) return e.blockRange(this);
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new qt(this, e, n);
		return null;
	}
	sameParent(e) {
		return this.pos - this.parentOffset == e.pos - e.parentOffset;
	}
	max(e) {
		return e.pos > this.pos ? e : this;
	}
	min(e) {
		return e.pos < this.pos ? e : this;
	}
	toString() {
		let e = "";
		for (let t = 1; t <= this.depth; t++) e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
		return e + ":" + this.parentOffset;
	}
	static resolve(t, n) {
		if (!(n >= 0 && n <= t.content.size)) throw RangeError("Position " + n + " out of range");
		let r = [], i = 0, a = n;
		for (let e = t;;) {
			let { index: t, offset: n } = e.content.findIndex(a), o = a - n;
			if (r.push(e, t, i + n), !o || (e = e.child(t), e.isText)) break;
			a = o - 1, i += n + 1;
		}
		return new e(n, r, a);
	}
	static resolveCached(t, n) {
		let r = Kt.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else Kt.set(t, r = new Wt());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % Gt, i;
	}
}, Wt = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, Gt = 12, Kt = /* @__PURE__ */ new WeakMap(), qt = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.depth = n;
	}
	get start() {
		return this.$from.before(this.depth + 1);
	}
	get end() {
		return this.$to.after(this.depth + 1);
	}
	get parent() {
		return this.$from.node(this.depth);
	}
	get startIndex() {
		return this.$from.index(this.depth);
	}
	get endIndex() {
		return this.$to.indexAfter(this.depth);
	}
}, Jt = Object.create(null), Yt = class e {
	constructor(e, t, n, r = M.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || j.empty;
	}
	get children() {
		return this.content.content;
	}
	get nodeSize() {
		return this.isLeaf ? 1 : 2 + this.content.size;
	}
	get childCount() {
		return this.content.childCount;
	}
	child(e) {
		return this.content.child(e);
	}
	maybeChild(e) {
		return this.content.maybeChild(e);
	}
	forEach(e) {
		this.content.forEach(e);
	}
	nodesBetween(e, t, n, r = 0) {
		this.content.nodesBetween(e, t, n, r, this);
	}
	descendants(e) {
		this.nodesBetween(0, this.content.size, e);
	}
	get textContent() {
		return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
	}
	textBetween(e, t, n, r) {
		return this.content.textBetween(e, t, n, r);
	}
	get firstChild() {
		return this.content.firstChild;
	}
	get lastChild() {
		return this.content.lastChild;
	}
	eq(e) {
		return this == e || this.sameMarkup(e) && this.content.eq(e.content);
	}
	sameMarkup(e) {
		return this.hasMarkup(e.type, e.attrs, e.marks);
	}
	hasMarkup(e, t, n) {
		return this.type == e && kt(this.attrs, t || e.defaultAttrs || Jt) && M.sameSet(this.marks, n || M.none);
	}
	copy(t = null) {
		return t == this.content ? this : new e(this.type, this.attrs, t, this.marks);
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.content, t);
	}
	cut(e, t = this.content.size) {
		return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
	}
	slice(e, t = this.content.size, n = !1) {
		if (e == t) return N.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new N(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return Nt(this.resolve(e), this.resolve(t), n);
	}
	nodeAt(e) {
		for (let t = this;;) {
			let { index: n, offset: r } = t.content.findIndex(e);
			if (t = t.maybeChild(n), !t) return null;
			if (r == e || t.isText) return t;
			e -= r + 1;
		}
	}
	childAfter(e) {
		let { index: t, offset: n } = this.content.findIndex(e);
		return {
			node: this.content.maybeChild(t),
			index: t,
			offset: n
		};
	}
	childBefore(e) {
		if (e == 0) return {
			node: null,
			index: 0,
			offset: 0
		};
		let { index: t, offset: n } = this.content.findIndex(e);
		if (n < e) return {
			node: this.content.child(t),
			index: t,
			offset: n
		};
		let r = this.content.child(t - 1);
		return {
			node: r,
			index: t - 1,
			offset: n - r.nodeSize
		};
	}
	resolve(e) {
		return Ut.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return Ut.resolve(this, e);
	}
	rangeHasMark(e, t, n) {
		let r = !1;
		return t > e && this.nodesBetween(e, t, (e) => (n.isInSet(e.marks) && (r = !0), !r)), r;
	}
	get isBlock() {
		return this.type.isBlock;
	}
	get isTextblock() {
		return this.type.isTextblock;
	}
	get inlineContent() {
		return this.type.inlineContent;
	}
	get isInline() {
		return this.type.isInline;
	}
	get isText() {
		return this.type.isText;
	}
	get isLeaf() {
		return this.type.isLeaf;
	}
	get isAtom() {
		return this.type.isAtom;
	}
	toString() {
		if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
		let e = this.type.name;
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Zt(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = j.empty, r = 0, i = n.childCount) {
		let a = this.contentMatchAt(e).matchFragment(n, r, i), o = a && a.matchFragment(this.content, t);
		if (!o || !o.validEnd) return !1;
		for (let e = r; e < i; e++) if (!this.type.allowsMarks(n.child(e).marks)) return !1;
		return !0;
	}
	canReplaceWith(e, t, n, r) {
		if (r && !this.type.allowsMarks(r)) return !1;
		let i = this.contentMatchAt(e).matchType(n), a = i && i.matchFragment(this.content, t);
		return a ? a.validEnd : !1;
	}
	canAppend(e) {
		return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
	}
	check() {
		this.type.checkContent(this.content), Qt(this.type.attrs, this.attrs, "node", this.type.name);
		let e = M.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			Qt(n.type.attrs, n.attrs, "mark", n.type.name), e = n.addToSet(e);
		}
		if (!M.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
		this.content.forEach((e) => e.check());
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((e) => e.toJSON())), e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Node.fromJSON");
		let n;
		if (t.marks) {
			if (!Array.isArray(t.marks)) throw RangeError("Invalid mark data for Node.fromJSON");
			n = t.marks.map(e.markFromJSON);
		}
		if (t.type == "text") {
			if (typeof t.text != "string") throw RangeError("Invalid text node in JSON");
			return e.text(t.text, n);
		}
		let r = j.fromJSON(e, t.content);
		return e.nodeType(t.type).create(t.attrs, r, n);
	}
};
Yt.prototype.text = void 0;
var Xt = class e extends Yt {
	constructor(e, t, n, r) {
		if (super(e, t, null, r), !n) throw RangeError("Empty text nodes are not allowed");
		this.text = n;
	}
	toString() {
		return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Zt(this.marks, JSON.stringify(this.text));
	}
	get textContent() {
		return this.text;
	}
	textBetween(e, t) {
		return this.text.slice(e, t);
	}
	get nodeSize() {
		return this.text.length;
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.text, t);
	}
	withText(t) {
		return t == this.text ? this : new e(this.type, this.attrs, t, this.marks);
	}
	cut(e = 0, t = this.text.length) {
		return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
	}
	eq(e) {
		return this.sameMarkup(e) && this.text == e.text;
	}
	toJSON() {
		let e = super.toJSON();
		return e.text = this.text, e;
	}
};
function Zt(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
function Qt(e, t, n, r) {
	for (let i in t) if (!(i in e)) throw RangeError(`Unsupported attribute ${i} for ${n} of type ${r}`);
	for (let n in e) e[n].validate && e[n].validate(t[n]);
}
var $t = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new en(t, n);
		if (r.next == null) return e.empty;
		let i = tn(r);
		r.next && r.err("Unexpected trailing text");
		let a = fn(ln(i));
		return pn(a, r), a;
	}
	matchType(e) {
		for (let t = 0; t < this.next.length; t++) if (this.next[t].type == e) return this.next[t].next;
		return null;
	}
	matchFragment(e, t = 0, n = e.childCount) {
		let r = this;
		for (let i = t; r && i < n; i++) r = r.matchType(e.child(i).type);
		return r;
	}
	get inlineContent() {
		return this.next.length != 0 && this.next[0].type.isInline;
	}
	get defaultType() {
		for (let e = 0; e < this.next.length; e++) {
			let { type: t } = this.next[e];
			if (!(t.isText || t.hasRequiredAttrs())) return t;
		}
		return null;
	}
	compatible(e) {
		for (let t = 0; t < this.next.length; t++) for (let n = 0; n < e.next.length; n++) if (this.next[t].type == e.next[n].type) return !0;
		return !1;
	}
	fillBefore(e, t = !1, n = 0) {
		let r = [this];
		function i(a, o) {
			let s = a.matchFragment(e, n);
			if (s && (!t || s.validEnd)) return j.from(o.map((e) => e.createAndFill()));
			for (let e = 0; e < a.next.length; e++) {
				let { type: t, next: n } = a.next[e];
				if (!(t.isText || t.hasRequiredAttrs()) && r.indexOf(n) == -1) {
					r.push(n);
					let e = i(n, o.concat(t));
					if (e) return e;
				}
			}
			return null;
		}
		return i(this, []);
	}
	findWrapping(e) {
		for (let t = 0; t < this.wrapCache.length; t += 2) if (this.wrapCache[t] == e) return this.wrapCache[t + 1];
		let t = this.computeWrapping(e);
		return this.wrapCache.push(e, t), t;
	}
	computeWrapping(e) {
		let t = Object.create(null), n = [{
			match: this,
			type: null,
			via: null
		}];
		for (; n.length;) {
			let r = n.shift(), i = r.match;
			if (i.matchType(e)) {
				let e = [];
				for (let t = r; t.type; t = t.via) e.push(t.type);
				return e.reverse();
			}
			for (let e = 0; e < i.next.length; e++) {
				let { type: a, next: o } = i.next[e];
				a.isLeaf || a.hasRequiredAttrs() || a.name in t || r.type && !o.validEnd || (n.push({
					match: a.contentMatch,
					type: a,
					via: r
				}), t[a.name] = !0);
			}
		}
		return null;
	}
	get edgeCount() {
		return this.next.length;
	}
	edge(e) {
		if (e >= this.next.length) throw RangeError(`There's no ${e}th edge in this content match`);
		return this.next[e];
	}
	toString() {
		let e = [];
		function t(n) {
			e.push(n);
			for (let r = 0; r < n.next.length; r++) e.indexOf(n.next[r].next) == -1 && t(n.next[r].next);
		}
		return t(this), e.map((t, n) => {
			let r = n + (t.validEnd ? "*" : " ") + " ";
			for (let n = 0; n < t.next.length; n++) r += (n ? ", " : "") + t.next[n].type.name + "->" + e.indexOf(t.next[n].next);
			return r;
		}).join("\n");
	}
};
$t.empty = new $t(!0);
var en = class {
	constructor(e, t) {
		this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
	}
	get next() {
		return this.tokens[this.pos];
	}
	eat(e) {
		return this.next == e && (this.pos++ || !0);
	}
	err(e) {
		throw SyntaxError(e + " (in content expression '" + this.string + "')");
	}
};
function tn(e) {
	let t = [];
	do
		t.push(nn(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function nn(e) {
	let t = [];
	do
		t.push(rn(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function rn(e) {
	let t = cn(e);
	for (;;) if (e.eat("+")) t = {
		type: "plus",
		expr: t
	};
	else if (e.eat("*")) t = {
		type: "star",
		expr: t
	};
	else if (e.eat("?")) t = {
		type: "opt",
		expr: t
	};
	else if (e.eat("{")) t = on(e, t);
	else break;
	return t;
}
function an(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function on(e, t) {
	let n = an(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : an(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function sn(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function cn(e) {
	if (e.eat("(")) {
		let t = tn(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	}
	if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = sn(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function ln(e) {
	let t = [[]];
	return i(a(e, 0), n()), t;
	function n() {
		return t.push([]) - 1;
	}
	function r(e, n, r) {
		let i = {
			term: r,
			to: n
		};
		return t[e].push(i), i;
	}
	function i(e, t) {
		e.forEach((e) => e.to = t);
	}
	function a(e, t) {
		if (e.type == "choice") return e.exprs.reduce((e, n) => e.concat(a(n, t)), []);
		if (e.type == "seq") for (let r = 0;; r++) {
			let o = a(e.exprs[r], t);
			if (r == e.exprs.length - 1) return o;
			i(o, t = n());
		}
		else if (e.type == "star") {
			let o = n();
			return r(t, o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "plus") {
			let o = n();
			return i(a(e.expr, t), o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "opt") return [r(t)].concat(a(e.expr, t));
		else if (e.type == "range") {
			let o = t;
			for (let t = 0; t < e.min; t++) {
				let t = n();
				i(a(e.expr, o), t), o = t;
			}
			if (e.max == -1) i(a(e.expr, o), o);
			else for (let t = e.min; t < e.max; t++) {
				let t = n();
				r(o, t), i(a(e.expr, o), t), o = t;
			}
			return [r(o)];
		} else if (e.type == "name") return [r(t, void 0, e.value)];
		else throw Error("Unknown expr type");
	}
}
function un(e, t) {
	return t - e;
}
function dn(e, t) {
	let n = [];
	return r(t), n.sort(un);
	function r(t) {
		let i = e[t];
		if (i.length == 1 && !i[0].term) return r(i[0].to);
		n.push(t);
		for (let e = 0; e < i.length; e++) {
			let { term: t, to: a } = i[e];
			!t && n.indexOf(a) == -1 && r(a);
		}
	}
}
function fn(e) {
	let t = Object.create(null);
	return n(dn(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				dn(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new $t(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(un);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function pn(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
function mn(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		if (!r.hasDefault) return null;
		t[n] = r.default;
	}
	return t;
}
function hn(e, t) {
	let n = Object.create(null);
	for (let r in e) {
		let i = e[r], a = t && t[r];
		if (a === void 0) {
			if (i.hasDefault) a = i.default;
			else throw RangeError("No value supplied for attribute " + r);
		} else i.validate && i.validate(a);
		n[r] = a;
	}
	return n;
}
function gn(e, t) {
	let n = Object.create(null);
	if (t) for (let r in t) n[r] = new yn(e, r, t[r]);
	return n;
}
var _n = class e {
	constructor(e, t, n) {
		this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = gn(e, n.attrs), this.defaultAttrs = mn(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
	}
	get isInline() {
		return !this.isBlock;
	}
	get isTextblock() {
		return this.isBlock && this.inlineContent;
	}
	get isLeaf() {
		return this.contentMatch == $t.empty;
	}
	get isAtom() {
		return this.isLeaf || !!this.spec.atom;
	}
	isInGroup(e) {
		return this.groups.indexOf(e) > -1;
	}
	get whitespace() {
		return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
	}
	hasRequiredAttrs() {
		for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
		return !1;
	}
	compatibleContent(e) {
		return this == e || this.contentMatch.compatible(e.contentMatch);
	}
	computeAttrs(e) {
		return !e && this.defaultAttrs ? this.defaultAttrs : hn(this.attrs, e);
	}
	create(e = null, t, n) {
		if (this.isText) throw Error("NodeType.create can't construct text nodes");
		return new Yt(this, this.computeAttrs(e), j.from(t), M.setFrom(n));
	}
	createChecked(e = null, t, n) {
		return t = j.from(t), this.checkContent(t), new Yt(this, this.computeAttrs(e), t, M.setFrom(n));
	}
	createAndFill(e = null, t, n) {
		if (e = this.computeAttrs(e), t = j.from(t), t.size) {
			let e = this.contentMatch.fillBefore(t);
			if (!e) return null;
			t = e.append(t);
		}
		let r = this.contentMatch.matchFragment(t), i = r && r.fillBefore(j.empty, !0);
		return i ? new Yt(this, e, t.append(i), M.setFrom(n)) : null;
	}
	validContent(e) {
		let t = this.contentMatch.matchFragment(e);
		if (!t || !t.validEnd) return !1;
		for (let t = 0; t < e.childCount; t++) if (!this.allowsMarks(e.child(t).marks)) return !1;
		return !0;
	}
	checkContent(e) {
		if (!this.validContent(e)) throw RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
	}
	checkAttrs(e) {}
	allowsMarkType(e) {
		return this.markSet == null || this.markSet.indexOf(e) > -1;
	}
	allowsMarks(e) {
		if (this.markSet == null) return !0;
		for (let t = 0; t < e.length; t++) if (!this.allowsMarkType(e[t].type)) return !1;
		return !0;
	}
	allowedMarks(e) {
		if (this.markSet == null) return e;
		let t;
		for (let n = 0; n < e.length; n++) this.allowsMarkType(e[n].type) ? t && t.push(e[n]) : t ||= e.slice(0, n);
		return t ? t.length ? t : M.none : e;
	}
	static compile(t, n) {
		let r = Object.create(null);
		t.forEach((t, i) => r[t] = new e(t, n, i));
		let i = n.spec.topNode || "doc";
		if (!r[i]) throw RangeError("Schema is missing its top node type ('" + i + "')");
		if (!r.text) throw RangeError("Every schema needs a 'text' type");
		for (let e in r.text.attrs) throw RangeError("The text node type should not have attributes");
		return r;
	}
};
function vn(e, t, n) {
	let r = n.split("|");
	return (n) => {
		let i = n === null ? "null" : typeof n;
		if (r.indexOf(i) < 0) throw RangeError(`Expected value of type ${r} for attribute ${t} on type ${e}, got ${i}`);
	};
}
var yn = class {
	constructor(e, t, n) {
		this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? vn(e, t, n.validate) : n.validate;
	}
	get isRequired() {
		return !this.hasDefault;
	}
}, bn = class e {
	constructor(e, t, n, r) {
		this.name = e, this.rank = t, this.schema = n, this.spec = r, this.attrs = gn(e, r.attrs), this.excluded = null;
		let i = mn(this.attrs);
		this.instance = i ? new M(this, i) : null;
	}
	create(e = null) {
		return !e && this.instance ? this.instance : new M(this, hn(this.attrs, e));
	}
	static compile(t, n) {
		let r = Object.create(null), i = 0;
		return t.forEach((t, a) => r[t] = new e(t, i++, n, a)), r;
	}
	removeFromSet(e) {
		for (var t = 0; t < e.length; t++) e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
	}
	excludes(e) {
		return this.excluded.indexOf(e) > -1;
	}
}, xn = class {
	constructor(e) {
		this.linebreakReplacement = null, this.cached = Object.create(null);
		let t = this.spec = {};
		for (let n in e) t[n] = e[n];
		t.nodes = St.from(e.nodes), t.marks = St.from(e.marks || {}), this.nodes = _n.compile(this.spec.nodes, this), this.marks = bn.compile(this.spec.marks, this);
		let n = Object.create(null);
		for (let e in this.nodes) {
			if (e in this.marks) throw RangeError(e + " can not be both a node and a mark");
			let t = this.nodes[e], r = t.spec.content || "", i = t.spec.marks;
			if (t.contentMatch = n[r] || (n[r] = $t.parse(r, this.nodes)), t.inlineContent = t.contentMatch.inlineContent, t.spec.linebreakReplacement) {
				if (this.linebreakReplacement) throw RangeError("Multiple linebreak nodes defined");
				if (!t.isInline || !t.isLeaf) throw RangeError("Linebreak replacement nodes must be inline leaf nodes");
				this.linebreakReplacement = t;
			}
			t.markSet = i == "_" ? null : i ? Sn(this, i.split(" ")) : i == "" || !t.inlineContent ? [] : null;
		}
		for (let e in this.marks) {
			let t = this.marks[e], n = t.spec.excludes;
			t.excluded = n == null ? [t] : n == "" ? [] : Sn(this, n.split(" "));
		}
		this.nodeFromJSON = (e) => Yt.fromJSON(this, e), this.markFromJSON = (e) => M.fromJSON(this, e), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null);
	}
	node(e, t = null, n, r) {
		if (typeof e == "string") e = this.nodeType(e);
		else if (!(e instanceof _n)) throw RangeError("Invalid node type: " + e);
		else if (e.schema != this) throw RangeError("Node type from different schema used (" + e.name + ")");
		return e.createChecked(t, n, r);
	}
	text(e, t) {
		let n = this.nodes.text;
		return new Xt(n, n.defaultAttrs, e, M.setFrom(t));
	}
	mark(e, t) {
		return typeof e == "string" && (e = this.marks[e]), e.create(t);
	}
	nodeType(e) {
		let t = this.nodes[e];
		if (!t) throw RangeError("Unknown node type: " + e);
		return t;
	}
};
function Sn(e, t) {
	let n = [];
	for (let r = 0; r < t.length; r++) {
		let i = t[r], a = e.marks[i], o = a;
		if (a) n.push(a);
		else for (let t in e.marks) {
			let r = e.marks[t];
			(i == "_" || r.spec.group && r.spec.group.split(" ").indexOf(i) > -1) && n.push(o = r);
		}
		if (!o) throw SyntaxError("Unknown mark type: '" + t[r] + "'");
	}
	return n;
}
function Cn(e) {
	return e.tag != null;
}
function wn(e) {
	return e.style != null;
}
var Tn = class e {
	constructor(e, t) {
		this.schema = e, this.rules = t, this.tags = [], this.styles = [];
		let n = this.matchedStyles = [];
		t.forEach((e) => {
			if (Cn(e)) this.tags.push(e);
			else if (wn(e)) {
				let t = /[^=]*/.exec(e.style)[0];
				n.indexOf(t) < 0 && n.push(t), this.styles.push(e);
			}
		}), this.normalizeLists = !this.tags.some((t) => {
			if (!/^(ul|ol)\b/.test(t.tag) || !t.node) return !1;
			let n = e.nodes[t.node];
			return n.contentMatch.matchType(n);
		});
	}
	parse(e, t = {}) {
		let n = new Pn(this, t, !1);
		return n.addAll(e, M.none, t.from, t.to), n.finish();
	}
	parseSlice(e, t = {}) {
		let n = new Pn(this, t, !0);
		return n.addAll(e, M.none, t.from, t.to), N.maxOpen(n.finish());
	}
	matchTag(e, t, n) {
		for (let r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
			let n = this.tags[r];
			if (In(e, n.tag) && (n.namespace === void 0 || e.namespaceURI == n.namespace) && (!n.context || t.matchesContext(n.context))) {
				if (n.getAttrs) {
					let t = n.getAttrs(e);
					if (t === !1) continue;
					n.attrs = t || void 0;
				}
				return n;
			}
		}
	}
	matchStyle(e, t, n, r) {
		for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
			let r = this.styles[i], a = r.style;
			if (!(a.indexOf(e) != 0 || r.context && !n.matchesContext(r.context) || a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
				if (r.getAttrs) {
					let e = r.getAttrs(t);
					if (e === !1) continue;
					r.attrs = e || void 0;
				}
				return r;
			}
		}
	}
	static schemaRules(e) {
		let t = [];
		function n(e) {
			let n = e.priority == null ? 50 : e.priority, r = 0;
			for (; r < t.length; r++) {
				let e = t[r];
				if ((e.priority == null ? 50 : e.priority) < n) break;
			}
			t.splice(r, 0, e);
		}
		for (let t in e.marks) {
			let r = e.marks[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = Ln(e)), e.mark || e.ignore || e.clearMark || (e.mark = t);
			});
		}
		for (let t in e.nodes) {
			let r = e.nodes[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = Ln(e)), e.node || e.ignore || e.mark || (e.node = t);
			});
		}
		return t;
	}
	static fromSchema(t) {
		return t.cached.domParser || (t.cached.domParser = new e(t, e.schemaRules(t)));
	}
}, En = {
	address: !0,
	article: !0,
	aside: !0,
	blockquote: !0,
	body: !0,
	canvas: !0,
	dd: !0,
	div: !0,
	dl: !0,
	fieldset: !0,
	figcaption: !0,
	figure: !0,
	footer: !0,
	form: !0,
	h1: !0,
	h2: !0,
	h3: !0,
	h4: !0,
	h5: !0,
	h6: !0,
	header: !0,
	hgroup: !0,
	hr: !0,
	li: !0,
	noscript: !0,
	ol: !0,
	output: !0,
	p: !0,
	pre: !0,
	section: !0,
	table: !0,
	tfoot: !0,
	ul: !0
}, Dn = {
	head: !0,
	noscript: !0,
	object: !0,
	script: !0,
	style: !0,
	title: !0
}, On = {
	ol: !0,
	ul: !0
}, kn = 1, An = 2, jn = 4;
function Mn(e, t, n) {
	return t == null ? e && e.whitespace == "pre" ? 3 : n & -5 : (t ? kn : 0) | (t === "full" ? An : 0);
}
var Nn = class {
	constructor(e, t, n, r, i, a) {
		this.type = e, this.attrs = t, this.marks = n, this.solid = r, this.options = a, this.content = [], this.activeMarks = M.none, this.match = i || (a & jn ? null : e.contentMatch);
	}
	findWrapping(e) {
		if (!this.match) {
			if (!this.type) return [];
			let t = this.type.contentMatch.fillBefore(j.from(e));
			if (t) this.match = this.type.contentMatch.matchFragment(t);
			else {
				let t = this.type.contentMatch, n;
				return (n = t.findWrapping(e.type)) ? (this.match = t, n) : null;
			}
		}
		return this.match.findWrapping(e.type);
	}
	finish(e) {
		if (!(this.options & kn)) {
			let e = this.content[this.content.length - 1], t;
			if (e && e.isText && (t = /[ \t\r\n\u000c]+$/.exec(e.text))) {
				let n = e;
				e.text.length == t[0].length ? this.content.pop() : this.content[this.content.length - 1] = n.withText(n.text.slice(0, n.text.length - t[0].length));
			}
		}
		let t = j.from(this.content);
		return !e && this.match && (t = t.append(this.match.fillBefore(j.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
	}
	inlineContext(e) {
		return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !En.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
	}
}, Pn = class {
	constructor(e, t, n) {
		this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
		let r = t.topNode, i, a = Mn(null, t.preserveWhitespace, 0) | (n ? jn : 0);
		i = r ? new Nn(r.type, r.attrs, M.none, !0, t.topMatch || r.type.contentMatch, a) : n ? new Nn(null, null, M.none, !0, null, a) : new Nn(e.schema.topNodeType, null, M.none, !0, null, a), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
	}
	get top() {
		return this.nodes[this.open];
	}
	addDOM(e, t) {
		e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
	}
	addTextNode(e, t) {
		let n = e.nodeValue, r = this.top, i = r.options & An ? "full" : this.localPreserveWS || (r.options & kn) > 0, { schema: a } = this.parser;
		if (i === "full" || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
			if (!i) {
				if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
					let t = r.content[r.content.length - 1], i = e.previousSibling;
					(!t || i && i.nodeName == "BR" || t.isText && /[ \t\r\n\u000c]$/.test(t.text)) && (n = n.slice(1));
				}
			} else if (i === "full") n = n.replace(/\r\n?/g, "\n");
			else if (a.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(a.linebreakReplacement.create())) {
				let e = n.split(/\r?\n|\r/);
				for (let n = 0; n < e.length; n++) n && this.insertNode(a.linebreakReplacement.create(), t, !0), e[n] && this.insertNode(a.text(e[n]), t, !/\S/.test(e[n]));
				n = "";
			} else n = n.replace(/\r?\n|\r/g, " ");
			n && this.insertNode(a.text(n), t, !/\S/.test(n)), this.findInText(e);
		} else this.findInside(e);
	}
	addElement(e, t, n) {
		let r = this.localPreserveWS, i = this.top;
		(e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
		let a = e.nodeName.toLowerCase(), o;
		On.hasOwnProperty(a) && this.parser.normalizeLists && Fn(e);
		let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, n));
		out: if (s ? s.ignore : Dn.hasOwnProperty(a)) this.findInside(e), this.ignoreFallback(e, t);
		else if (!s || s.skip || s.closeParent) {
			s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
			let n, r = this.needsBlock;
			if (En.hasOwnProperty(a)) i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), n = !0, i.type || (this.needsBlock = !0);
			else if (!e.firstChild) {
				this.leafFallback(e, t);
				break out;
			}
			let o = s && s.skip ? t : this.readStyles(e, t);
			o && this.addAll(e, o), n && this.sync(i), this.needsBlock = r;
		} else {
			let n = this.readStyles(e, t);
			n && this.addElementByRule(e, s, n, s.consuming === !1 ? o : void 0);
		}
		this.localPreserveWS = r;
	}
	leafFallback(e, t) {
		e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode("\n"), t);
	}
	ignoreFallback(e, t) {
		e.nodeName != "BR" || this.top.type && this.top.type.inlineContent || this.findPlace(this.parser.schema.text("-"), t, !0);
	}
	readStyles(e, t) {
		let n = e.style;
		if (n && n.length) for (let e = 0; e < this.parser.matchedStyles.length; e++) {
			let r = this.parser.matchedStyles[e], i = n.getPropertyValue(r);
			if (i) for (let e;;) {
				let n = this.parser.matchStyle(r, i, this, e);
				if (!n) break;
				if (n.ignore) return null;
				if (t = n.clearMark ? t.filter((e) => !n.clearMark(e)) : t.concat(this.parser.schema.marks[n.mark].create(n.attrs)), n.consuming === !1) e = n;
				else break;
			}
		}
		return t;
	}
	addElementByRule(e, t, n, r) {
		let i, a;
		if (t.node) {
			if (a = this.parser.schema.nodes[t.node], a.isLeaf) this.insertNode(a.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
			else {
				let e = this.enter(a, t.attrs || null, n, t.preserveWhitespace);
				e && (i = !0, n = e);
			}
		} else {
			let e = this.parser.schema.marks[t.mark];
			n = n.concat(e.create(t.attrs));
		}
		let o = this.top;
		if (a && a.isLeaf) this.findInside(e);
		else if (r) this.addElement(e, n, r);
		else if (t.getContent) this.findInside(e), t.getContent(e, this.parser.schema).forEach((e) => this.insertNode(e, n, !1));
		else {
			let r = e;
			typeof t.contentElement == "string" ? r = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? r = t.contentElement(e) : t.contentElement && (r = t.contentElement), this.findAround(e, r, !0), this.addAll(r, n), this.findAround(e, r, !1);
		}
		i && this.sync(o) && this.open--;
	}
	addAll(e, t, n, r) {
		let i = n || 0;
		for (let a = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; a != o; a = a.nextSibling, ++i) this.findAtPoint(e, i), this.addDOM(a, t);
		this.findAtPoint(e, i);
	}
	findPlace(e, t, n) {
		let r, i;
		for (let t = this.open, a = 0; t >= 0; t--) {
			let o = this.nodes[t], s = o.findWrapping(e);
			if (s && (!r || r.length > s.length + a) && (r = s, i = o, !s.length)) break;
			if (o.solid) {
				if (n) break;
				a += 2;
			}
		}
		if (!r) return null;
		this.sync(i);
		for (let e = 0; e < r.length; e++) t = this.enterInner(r[e], null, t, !1);
		return t;
	}
	insertNode(e, t, n) {
		if (e.isInline && this.needsBlock && !this.top.type) {
			let e = this.textblockFromContext();
			e && (t = this.enterInner(e, null, t));
		}
		let r = this.findPlace(e, t, n);
		if (r) {
			this.closeExtra();
			let t = this.top;
			t.match &&= t.match.matchType(e.type);
			let n = M.none;
			for (let i of r.concat(e.marks)) (t.type ? t.type.allowsMarkType(i.type) : Rn(i.type, e.type)) && (n = i.addToSet(n));
			return t.content.push(e.mark(n)), !0;
		}
		return !1;
	}
	enter(e, t, n, r) {
		let i = this.findPlace(e.create(t), n, !1);
		return i &&= this.enterInner(e, t, n, !0, r), i;
	}
	enterInner(e, t, n, r = !1, i) {
		this.closeExtra();
		let a = this.top;
		a.match = a.match && a.match.matchType(e);
		let o = Mn(e, i, a.options);
		a.options & jn && a.content.length == 0 && (o |= jn);
		let s = M.none;
		return n = n.filter((t) => !(a.type ? a.type.allowsMarkType(t.type) : Rn(t.type, e)) || (s = t.addToSet(s), !1)), this.nodes.push(new Nn(e, t, s, r, null, o)), this.open++, n;
	}
	closeExtra(e = !1) {
		let t = this.nodes.length - 1;
		if (t > this.open) {
			for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
			this.nodes.length = this.open + 1;
		}
	}
	finish() {
		return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
	}
	sync(e) {
		for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return this.open = t, !0;
		else this.localPreserveWS && (this.nodes[t].options |= kn);
		return !1;
	}
	get currentPos() {
		this.closeExtra();
		let e = 0;
		for (let t = this.open; t >= 0; t--) {
			let n = this.nodes[t].content;
			for (let t = n.length - 1; t >= 0; t--) e += n[t].nodeSize;
			t && e++;
		}
		return e;
	}
	findAtPoint(e, t) {
		if (this.find) for (let n = 0; n < this.find.length; n++) this.find[n].node == e && this.find[n].offset == t && (this.find[n].pos = this.currentPos);
	}
	findInside(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
	}
	findAround(e, t, n) {
		if (e != t && this.find) for (let r = 0; r < this.find.length; r++) this.find[r].pos == null && e.nodeType == 1 && e.contains(this.find[r].node) && t.compareDocumentPosition(this.find[r].node) & (n ? 2 : 4) && (this.find[r].pos = this.currentPos);
	}
	findInText(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
	}
	matchesContext(e) {
		if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
		let t = e.split("/"), n = this.options.context, r = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), i = -(n ? n.depth + 1 : 0) + +!r, a = (e, o) => {
			for (; e >= 0; e--) {
				let s = t[e];
				if (s == "") {
					if (e == t.length - 1 || e == 0) continue;
					for (; o >= i; o--) if (a(e - 1, o)) return !0;
					return !1;
				}
				{
					let e = o > 0 || o == 0 && r ? this.nodes[o].type : n && o >= i ? n.node(o - i).type : null;
					if (!e || e.name != s && !e.isInGroup(s)) return !1;
					o--;
				}
			}
			return !0;
		};
		return a(t.length - 1, this.open);
	}
	textblockFromContext() {
		let e = this.options.context;
		if (e) for (let t = e.depth; t >= 0; t--) {
			let n = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
			if (n && n.isTextblock && n.defaultAttrs) return n;
		}
		for (let e in this.parser.schema.nodes) {
			let t = this.parser.schema.nodes[e];
			if (t.isTextblock && t.defaultAttrs) return t;
		}
	}
};
function Fn(e) {
	for (let t = e.firstChild, n = null; t; t = t.nextSibling) {
		let e = t.nodeType == 1 ? t.nodeName.toLowerCase() : null;
		e && On.hasOwnProperty(e) && n ? (n.appendChild(t), t = n) : e == "li" ? n = t : e && (n = null);
	}
}
function In(e, t) {
	return (e.matches || e.msMatchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector).call(e, t);
}
function Ln(e) {
	let t = {};
	for (let n in e) t[n] = e[n];
	return t;
}
function Rn(e, t) {
	let n = t.schema.nodes;
	for (let r in n) {
		let i = n[r];
		if (!i.allowsMarkType(e)) continue;
		let a = [], o = (e) => {
			a.push(e);
			for (let n = 0; n < e.edgeCount; n++) {
				let { type: r, next: i } = e.edge(n);
				if (r == t || a.indexOf(i) < 0 && o(i)) return !0;
			}
		};
		if (o(i.contentMatch)) return !0;
	}
}
var zn = class e {
	constructor(e, t) {
		this.nodes = e, this.marks = t;
	}
	serializeFragment(e, t = {}, n) {
		n ||= Vn(t).createDocumentFragment();
		let r = n, i = [];
		return e.forEach((e) => {
			if (i.length || e.marks.length) {
				let n = 0, a = 0;
				for (; n < i.length && a < e.marks.length;) {
					let t = e.marks[a];
					if (!this.marks[t.type.name]) a++;
					else {
						if (!t.eq(i[n][0]) || t.type.spec.spanning === !1) break;
						n++, a++;
					}
				}
				for (; n < i.length;) r = i.pop()[1];
				for (; a < e.marks.length;) {
					let n = e.marks[a++], o = this.serializeMark(n, e.isInline, t);
					o && (i.push([n, r]), r.appendChild(o.dom), r = o.contentDOM || o.dom);
				}
			}
			r.appendChild(this.serializeNodeInner(e, t));
		}), n;
	}
	serializeNodeInner(e, t) {
		if (e.isText) return Vn(t).createTextNode(e.text);
		let { dom: n, contentDOM: r } = Gn(Vn(t), this.nodes[e.type.name](e), null, e.attrs);
		if (r) {
			if (e.isLeaf) throw RangeError("Content hole not allowed in a leaf node spec");
			this.serializeFragment(e.content, t, r);
		}
		return n;
	}
	serializeNode(e, t = {}) {
		let n = this.serializeNodeInner(e, t);
		for (let r = e.marks.length - 1; r >= 0; r--) {
			let i = this.serializeMark(e.marks[r], e.isInline, t);
			i && ((i.contentDOM || i.dom).appendChild(n), n = i.dom);
		}
		return n;
	}
	serializeMark(e, t, n = {}) {
		let r = this.marks[e.type.name];
		return r && Gn(Vn(n), r(e, t), null, e.attrs);
	}
	static renderSpec(e, t, n = null, r) {
		return typeof t == "string" ? { dom: e.createTextNode(t) } : Gn(e, t, n, r);
	}
	static fromSchema(t) {
		return t.cached.domSerializer || (t.cached.domSerializer = new e(this.nodesFromSchema(t), this.marksFromSchema(t)));
	}
	static nodesFromSchema(e) {
		let t = Bn(e.nodes);
		return t.text ||= (e) => e.text, t;
	}
	static marksFromSchema(e) {
		return Bn(e.marks);
	}
};
function Bn(e) {
	let t = {};
	for (let n in e) {
		let r = e[n].spec.toDOM;
		r && (t[n] = r);
	}
	return t;
}
function Vn(e) {
	return e.document || window.document;
}
var Hn = /* @__PURE__ */ new WeakMap();
function Un(e) {
	let t = Hn.get(e);
	return t === void 0 && Hn.set(e, t = Wn(e)), t;
}
function Wn(e) {
	let t = null;
	function n(e) {
		if (e && typeof e == "object") {
			if (Array.isArray(e)) {
				if (typeof e[0] == "string") t ||= [], t.push(e);
				else for (let t = 0; t < e.length; t++) n(e[t]);
			} else for (let t in e) n(e[t]);
		}
	}
	return n(e), t;
}
function Gn(e, t, n, r) {
	if (t.nodeType == 1) return { dom: t };
	if (t.dom && t.dom.nodeType == 1) return t;
	let i = t[0], a;
	if (typeof i != "string") throw RangeError("Invalid array passed to renderSpec");
	if (r && (a = Un(r)) && a.indexOf(t) > -1) throw RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
	let o = i.indexOf(" ");
	o > 0 && (n = i.slice(0, o), i = i.slice(o + 1));
	let s, c = n ? e.createElementNS(n, i) : e.createElement(i), l = t[1], u = 1;
	if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
		u = 2;
		for (let e in l) if (l[e] != null) {
			let t = e.indexOf(" ");
			t > 0 ? c.setAttributeNS(e.slice(0, t), e.slice(t + 1), l[e]) : e == "style" && c.style ? c.style.cssText = l[e] : c.setAttribute(e, l[e]);
		}
	}
	for (let i = u; i < t.length; i++) {
		let a = t[i];
		if (a === 0) {
			if (i < t.length - 1 || i > u) throw RangeError("Content hole must be the only child of its parent node");
			return {
				dom: c,
				contentDOM: c
			};
		}
		if (typeof a == "string") c.appendChild(e.createTextNode(a));
		else {
			let { dom: t, contentDOM: i } = Gn(e, a, n, r);
			if (c.appendChild(t), i) {
				if (s) throw RangeError("Multiple content holes");
				s = i;
			}
		}
	}
	return {
		dom: c,
		contentDOM: s
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-transform/dist/index.js
var Kn = 65535, qn = 2 ** 16;
function Jn(e, t) {
	return e + t * qn;
}
function Yn(e) {
	return e & Kn;
}
function Xn(e) {
	return (e - (e & Kn)) / qn;
}
var Zn = 1, Qn = 2, $n = 4, er = 8, tr = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & er) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & 5) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & 6) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & $n) > 0;
	}
}, nr = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = Yn(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + Xn(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : Jn(o / 3, e - s), f = 0;
				return c && (f |= e == s ? Qn : e == u ? Zn : $n, (t < 0 ? e != s : e != u) && (f |= er)), new tr(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new tr(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = Yn(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
nr.empty = new nr([]);
var rr = class e {
	constructor(e, t, n = 0, r = e ? e.length : 0) {
		this.mirror = t, this.from = n, this.to = r, this._maps = e || [], this.ownData = !(e || t);
	}
	get maps() {
		return this._maps;
	}
	slice(t = 0, n = this.maps.length) {
		return new e(this._maps, this.mirror, t, n);
	}
	appendMap(e, t) {
		this.ownData ||= (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
	}
	appendMapping(e) {
		for (let t = 0, n = this._maps.length; t < e._maps.length; t++) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t], r != null && r < t ? n + r : void 0);
		}
	}
	getMirror(e) {
		if (this.mirror) {
			for (let t = 0; t < this.mirror.length; t++) if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
		}
	}
	setMirror(e, t) {
		this.mirror ||= [], this.mirror.push(e, t);
	}
	appendMappingInverted(e) {
		for (let t = e.maps.length - 1, n = this._maps.length + e._maps.length; t >= 0; t--) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t].invert(), r != null && r > t ? n - r - 1 : void 0);
		}
	}
	invert() {
		let t = new e();
		return t.appendMappingInverted(this), t;
	}
	map(e, t = 1) {
		if (this.mirror) return this._map(e, t, !0);
		for (let n = this.from; n < this.to; n++) e = this._maps[n].map(e, t);
		return e;
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	_map(e, t, n) {
		let r = 0;
		for (let n = this.from; n < this.to; n++) {
			let i = this._maps[n].mapResult(e, t);
			if (i.recover != null) {
				let t = this.getMirror(n);
				if (t != null && t > n && t < this.to) {
					n = t, e = this._maps[t].recover(i.recover);
					continue;
				}
			}
			r |= i.delInfo, e = i.pos;
		}
		return n ? e : new tr(e, r, null);
	}
}, ir = Object.create(null), P = class {
	getMap() {
		return nr.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = ir[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in ir) throw RangeError("Duplicate use of step JSON ID " + e);
		return ir[e] = t, t.prototype.jsonID = e, t;
	}
}, ar = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof At) return e.fail(t.message);
			throw t;
		}
	}
};
function or(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(or(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return j.fromArray(r);
}
var sr = class e extends P {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new N(or(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return ar.fromReplace(e, this.from, this.to, i);
	}
	invert(t) {
		let n = [];
		return t.nodesBetween(this.from, this.to, (t, r) => {
			if (t.isInline && t.isAtom) {
				let i = this.mark.addToSet(t.marks);
				if (!M.sameSet(i, t.marks)) {
					let a = Math.max(this.from, r), o = Math.min(this.to, r + t.nodeSize);
					lr(cr, a, o, this.mark, n);
					for (let r of t.marks) r.isInSet(i) || lr(e, a, o, r, n);
				}
			}
		}), n.length == 1 ? n[0] : new ur(n);
	}
	map(t) {
		let n = t.map(this.from, 1), r = t.map(this.to, -1);
		return n >= r ? null : new e(n, r, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
P.jsonID("addMark", sr);
var cr = class e extends P {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new N(or(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return ar.fromReplace(e, this.from, this.to, n);
	}
	invert(e) {
		let t = [];
		return e.nodesBetween(this.from, this.to, (e, n) => {
			e.isInline && e.isAtom && this.mark.isInSet(e.marks) && lr(sr, Math.max(this.from, n), Math.min(this.to, n + e.nodeSize), this.mark, t);
		}), t.length == 1 ? t[0] : new ur(t);
	}
	map(t) {
		let n = t.map(this.from, 1), r = t.map(this.to, -1);
		return n >= r ? null : new e(n, r, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
P.jsonID("removeMark", cr);
function lr(e, t, n, r, i) {
	let a = i.length ? i[i.length - 1] : null;
	a && a instanceof e && a.to == t && a.mark.eq(r) ? i[i.length - 1] = new e(a.from, n, r) : i.push(new e(t, n, r));
}
var ur = class e extends P {
	constructor(e) {
		super(), this.steps = e;
	}
	apply(e) {
		for (let t of this.steps) {
			let n = t.apply(e);
			if (!n.doc) return n;
			e = n.doc;
		}
		return new ar(e, null);
	}
	invert(t) {
		return new e(this.steps.map((e) => e.invert(t)));
	}
	map(t) {
		let n = [];
		for (let e of this.steps) {
			let r = e.map(t);
			r && n.push(r);
		}
		return n.length ? new e(n) : null;
	}
	toJSON() {
		return {
			stepType: "markSet",
			steps: this.steps.map((e) => e.toJSON())
		};
	}
	static fromJSON(t, n) {
		if (!Array.isArray(n.steps) || !n.steps.every((e) => e.stepType == "addMark" || e.stepType == "removeMark")) throw RangeError("Invalid JSON for MarkSetStep");
		return new e(n.steps.map((e) => P.fromJSON(t, e)));
	}
};
P.jsonID("markSet", ur);
var dr = class e extends P {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return ar.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return ar.fromReplace(e, this.pos, this.pos + 1, new N(j.from(n), 0, +!t.isLeaf));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new fr(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
P.jsonID("addNodeMark", dr);
var fr = class e extends P {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return ar.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return ar.fromReplace(e, this.pos, this.pos + 1, new N(j.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new dr(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
P.jsonID("removeNodeMark", fr);
var pr = class e extends P {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && hr(e, this.from, this.to) ? ar.fail("Structure replace would overwrite content") : ar.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new nr([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.to, -1), r = this.from == this.to && e.MAP_BIAS < 0 ? n : t.mapResult(this.from, 1);
		return r.deletedAcross && n.deletedAcross ? null : new e(r.pos, Math.max(r.pos, n.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? N.empty : new N(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		}
		if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? N.empty : new N(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		}
		return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, N.fromJSON(t, n.slice), !!n.structure);
	}
};
pr.MAP_BIAS = 1, P.jsonID("replace", pr);
var mr = class e extends P {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (hr(e, this.from, this.gapFrom) || hr(e, this.gapTo, this.to))) return ar.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return ar.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? ar.fromReplace(e, this.from, this.to, n) : ar.fail("Content does not fit in gap");
	}
	getMap() {
		return new nr([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
	}
	toJSON() {
		let e = {
			stepType: "replaceAround",
			from: this.from,
			to: this.to,
			gapFrom: this.gapFrom,
			gapTo: this.gapTo,
			insert: this.insert
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, N.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
P.jsonID("replaceAround", mr);
function hr(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
function gr(e, t, n, r) {
	let i = [];
	e.doc.nodesBetween(t, n, (e, a, o) => {
		if (!e.isInline) return;
		let s = e.marks;
		!r.isInSet(s) && o.type.allowsMarkType(r.type) && lr(sr, Math.max(a, t), Math.min(a + e.nodeSize, n), r, i);
	}), i.forEach((t) => e.step(t));
}
function _r(e, t, n, r) {
	let i = [], a = 0;
	e.doc.nodesBetween(t, n, (e, o) => {
		if (!e.isInline || !e.isAtom) return;
		a++;
		let s = null;
		if (r instanceof bn) {
			let t = e.marks, n;
			for (; n = r.isInSet(t);) (s ||= []).push(n), t = n.removeFromSet(t);
		} else r ? r.isInSet(e.marks) && (s = [r]) : s = e.marks;
		if (s && s.length) {
			let r = Math.min(o + e.nodeSize, n);
			for (let e = 0; e < s.length; e++) {
				let n = s[e], c;
				for (let e = 0; e < i.length; e++) {
					let t = i[e];
					t.step == a - 1 && n.eq(i[e].style) && (c = t);
				}
				c ? (c.to = r, c.step = a) : i.push({
					style: n,
					from: Math.max(o, t),
					to: r,
					step: a
				});
			}
		}
	}), i.forEach((t) => e.step(new cr(t.from, t.to, t.style)));
}
function vr(e, t, n, r = n.contentMatch, i = !0) {
	let a = e.doc.nodeAt(t), o = [], s = t + 1;
	for (let t = 0; t < a.childCount; t++) {
		let c = a.child(t), l = s + c.nodeSize, u = r.matchType(c.type);
		if (!u) o.push(new pr(s, l, N.empty));
		else {
			r = u;
			for (let t = 0; t < c.marks.length; t++) n.allowsMarkType(c.marks[t].type) || e.step(new cr(s, l, c.marks[t]));
			if (i && c.isText && n.whitespace != "pre") {
				let e, t = /\r?\n|\r/g, r;
				for (; e = t.exec(c.text);) r ||= new N(j.from(n.schema.text(" ", n.allowedMarks(c.marks))), 0, 0), o.push(new pr(s + e.index, s + e.index + e[0].length, r));
			}
		}
		s = l;
	}
	if (!r.validEnd) {
		let t = r.fillBefore(j.empty, !0);
		e.replace(s, s, new N(t, 0, 0));
	}
	for (let t = o.length - 1; t >= 0; t--) e.step(o[t]);
}
function yr(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function br(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !yr(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function xr(e, t, n) {
	let { $from: r, $to: i, depth: a } = t, o = r.before(a + 1), s = i.after(a + 1), c = o, l = s, u = j.empty, d = 0;
	for (let e = a, t = !1; e > n; e--) t || r.index(e) > 0 ? (t = !0, u = j.from(r.node(e).copy(u)), d++) : c--;
	let f = j.empty, p = 0;
	for (let e = a, t = !1; e > n; e--) t || i.after(e + 1) < i.end(e) ? (t = !0, f = j.from(i.node(e).copy(f)), p++) : l++;
	e.step(new mr(c, l, o, s, new N(u.append(f), d, p), u.size - d, !0));
}
function Sr(e, t, n = null, r = e) {
	let i = wr(e, t), a = i && Tr(r, t);
	return a ? i.map(Cr).concat({
		type: t,
		attrs: n
	}).concat(a.map(Cr)) : null;
}
function Cr(e) {
	return {
		type: e,
		attrs: null
	};
}
function wr(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.contentMatchAt(r).findWrapping(t);
	if (!a) return null;
	let o = a.length ? a[0] : t;
	return n.canReplaceWith(r, i, o) ? a : null;
}
function Tr(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (!o) return null;
	let s = (o.length ? o[o.length - 1] : t).contentMatch;
	for (let e = r; s && e < i; e++) s = s.matchType(n.child(e).type);
	return !s || !s.validEnd ? null : o;
}
function Er(e, t, n) {
	let r = j.empty;
	for (let e = n.length - 1; e >= 0; e--) {
		if (r.size) {
			let t = n[e].type.contentMatch.matchFragment(r);
			if (!t || !t.validEnd) throw RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
		}
		r = j.from(n[e].type.create(n[e].attrs, r));
	}
	let i = t.start, a = t.end;
	e.step(new mr(i, a, i, a, new N(r, 0, 0), n.length, !0));
}
function Dr(e, t, n, r, i) {
	if (!r.isTextblock) throw RangeError("Type given to setBlockType should be a textblock");
	let a = e.steps.length;
	e.doc.nodesBetween(t, n, (t, n) => {
		let o = typeof i == "function" ? i(t) : i;
		if (t.isTextblock && !t.hasMarkup(r, o) && Ar(e.doc, e.mapping.slice(a).map(n), r)) {
			let i = null;
			if (r.schema.linebreakReplacement) {
				let e = r.whitespace == "pre", t = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
				e && !t ? i = !1 : !e && t && (i = !0);
			}
			i === !1 && kr(e, t, n, a), vr(e, e.mapping.slice(a).map(n, 1), r, void 0, i === null);
			let s = e.mapping.slice(a), c = s.map(n, 1), l = s.map(n + t.nodeSize, 1);
			return e.step(new mr(c, l, c + 1, l - 1, new N(j.from(r.create(o, null, t.marks)), 0, 0), 1, !0)), i === !0 && Or(e, t, n, a), !1;
		}
	});
}
function Or(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.isText) {
			let o, s = /\r?\n|\r/g;
			for (; o = s.exec(i.text);) {
				let i = e.mapping.slice(r).map(n + 1 + a + o.index);
				e.replaceWith(i, i + 1, t.type.schema.linebreakReplacement.create());
			}
		}
	});
}
function kr(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.type == i.type.schema.linebreakReplacement) {
			let i = e.mapping.slice(r).map(n + 1 + a);
			e.replaceWith(i, i + 1, t.type.schema.text("\n"));
		}
	});
}
function Ar(e, t, n) {
	let r = e.resolve(t), i = r.index();
	return r.parent.canReplaceWith(i, i + 1, n);
}
function jr(e, t, n, r, i) {
	let a = e.doc.nodeAt(t);
	if (!a) throw RangeError("No node at given position");
	n ||= a.type;
	let o = n.create(r, null, i || a.marks);
	if (a.isLeaf) return e.replaceWith(t, t + a.nodeSize, o);
	if (!n.validContent(a.content)) throw RangeError("Invalid content for node type " + n.name);
	e.step(new mr(t, t + a.nodeSize, t + 1, t + a.nodeSize - 1, new N(j.from(o), 0, 0), 1, !0));
}
function Mr(e, t, n = 1, r) {
	let i = e.resolve(t), a = i.depth - n, o = r && r[r.length - 1] || i.parent;
	if (a < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount))) return !1;
	for (let e = i.depth - 1, t = n - 2; e > a; e--, t--) {
		let n = i.node(e), a = i.index(e);
		if (n.type.spec.isolating) return !1;
		let o = n.content.cutByIndex(a, n.childCount), s = r && r[t + 1];
		s && (o = o.replaceChild(0, s.type.create(s.attrs)));
		let c = r && r[t] || n;
		if (!n.canReplace(a + 1, n.childCount) || !c.type.validContent(o)) return !1;
	}
	let s = i.indexAfter(a), c = r && r[0];
	return i.node(a).canReplaceWith(s, s, c ? c.type : i.node(a + 1).type);
}
function Nr(e, t, n = 1, r) {
	let i = e.doc.resolve(t), a = j.empty, o = j.empty;
	for (let e = i.depth, t = i.depth - n, s = n - 1; e > t; e--, s--) {
		a = j.from(i.node(e).copy(a));
		let t = r && r[s];
		o = j.from(t ? t.type.create(t.attrs, o) : i.node(e).copy(o));
	}
	e.step(new pr(t, t, new N(a.append(o), n, n), !0));
}
function Pr(e, t) {
	let n = e.resolve(t), r = n.index();
	return Ir(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function Fr(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function Ir(e, t) {
	return !!(e && t && !e.isLeaf && Fr(e, t));
}
function Lr(e, t, n = -1) {
	let r = e.resolve(t);
	for (let e = r.depth;; e--) {
		let i, a, o = r.index(e);
		if (e == r.depth ? (i = r.nodeBefore, a = r.nodeAfter) : n > 0 ? (i = r.node(e + 1), o++, a = r.node(e).maybeChild(o)) : (i = r.node(e).maybeChild(o - 1), a = r.node(e + 1)), i && !i.isTextblock && Ir(i, a) && r.node(e).canReplace(o, o + 1)) return t;
		if (e == 0) break;
		t = n < 0 ? r.before(e) : r.after(e);
	}
}
function Rr(e, t, n) {
	let r = null, { linebreakReplacement: i } = e.doc.type.schema, a = e.doc.resolve(t - n), o = a.node().type;
	if (i && o.inlineContent) {
		let e = o.whitespace == "pre", t = !!o.contentMatch.matchType(i);
		e && !t ? r = !1 : !e && t && (r = !0);
	}
	let s = e.steps.length;
	if (r === !1) {
		let r = e.doc.resolve(t + n);
		kr(e, r.node(), r.before(), s);
	}
	o.inlineContent && vr(e, t + n - 1, o, a.node().contentMatchAt(a.index()), r == null);
	let c = e.mapping.slice(s), l = c.map(t - n);
	if (e.step(new pr(l, c.map(t + n, -1), N.empty, !0)), r === !0) {
		let t = e.doc.resolve(l);
		Or(e, t.node(), t.before(), e.steps.length);
	}
	return e;
}
function zr(e, t, n) {
	let r = e.resolve(t);
	if (r.parent.canReplaceWith(r.index(), r.index(), n)) return t;
	if (r.parentOffset == 0) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.index(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.before(e + 1);
		if (t > 0) return null;
	}
	if (r.parentOffset == r.parent.content.size) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.indexAfter(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.after(e + 1);
		if (t < r.node(e).childCount) return null;
	}
	return null;
}
function Br(e, t, n) {
	let r = e.resolve(t);
	if (!n.content.size) return t;
	let i = n.content;
	for (let e = 0; e < n.openStart; e++) i = i.firstChild.content;
	for (let e = 1; e <= (n.openStart == 0 && n.size ? 2 : 1); e++) for (let t = r.depth; t >= 0; t--) {
		let n = t == r.depth ? 0 : r.pos <= (r.start(t + 1) + r.end(t + 1)) / 2 ? -1 : 1, a = r.index(t) + +(n > 0), o = r.node(t), s = !1;
		if (e == 1) s = o.canReplace(a, a, i);
		else {
			let e = o.contentMatchAt(a).findWrapping(i.firstChild.type);
			s = e && o.canReplaceWith(a, a, e[0]);
		}
		if (s) return n == 0 ? r.pos : n < 0 ? r.before(t + 1) : r.after(t + 1);
	}
	return null;
}
function Vr(e, t, n = t, r = N.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return Hr(i, a, r) ? new pr(t, n, r) : new Ur(i, a, r).fit();
}
function Hr(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var Ur = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = j.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = j.from(e.node(t).copy(this.placed));
	}
	get depth() {
		return this.frontier.length - 1;
	}
	fit() {
		for (; this.unplaced.size;) {
			let e = this.findFittable();
			e ? this.placeNodes(e) : this.openMore() || this.dropNode();
		}
		let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, r = this.close(e < 0 ? this.$to : n.doc.resolve(e));
		if (!r) return null;
		let i = this.placed, a = n.depth, o = r.depth;
		for (; a && o && i.childCount == 1;) i = i.firstChild.content, a--, o--;
		let s = new N(i, a, o);
		return e > -1 ? new mr(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new pr(n.pos, r.pos, s) : null;
	}
	findFittable() {
		let e = this.unplaced.openStart;
		for (let t = this.unplaced.content, n = 0, r = this.unplaced.openEnd; n < e; n++) {
			let i = t.firstChild;
			if (t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= n) {
				e = n;
				break;
			}
			t = i.content;
		}
		for (let t = 1; t <= 2; t++) for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
			let e, r = null;
			n ? (r = Kr(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: a, match: o } = this.frontier[e], s, c = null;
				if (t == 1 && (i ? o.matchType(i.type) || (c = o.fillBefore(j.from(i), !1)) : r && a.compatibleContent(r.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					inject: c
				};
				if (t == 2 && i && (s = o.findWrapping(i.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					wrap: s
				};
				if (r && o.matchType(r.type)) break;
			}
		}
	}
	openMore() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced;
		return Zr(e, -1) <= t ? !1 : (this.unplaced.size > 1 && Zr(e, 1) > n && n++, this.unplaced = new N(e, t + 1, n), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = Kr(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new N(Wr(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new N(Wr(e, t, 1), t, n);
	}
	placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: r, wrap: i }) {
		for (; this.depth > t;) this.closeFrontierNode();
		if (i) for (let e = 0; e < i.length; e++) this.openFrontierNode(i[e]);
		let a = this.unplaced, o = n ? n.content : a.content, s = a.openStart - e, c = 0, l = [], { match: u, type: d } = this.frontier[t];
		if (r) {
			for (let e = 0; e < r.childCount; e++) l.push(r.child(e));
			u = u.matchFragment(r);
		}
		let f = o.size + e - (a.content.size - a.openEnd);
		for (; c < o.childCount;) {
			let e = o.child(c), t = u.matchType(e.type);
			if (!t) break;
			c++, (c > 1 || s == 0 || e.content.size) && (u = t, l.push(qr(e.mark(d.allowedMarks(e.marks)), c == 1 ? s : 0, c == o.childCount ? f : -1)));
		}
		let p = c == o.childCount;
		p || (f = -1), this.placed = Gr(this.placed, t, j.from(l)), this.frontier[t].match = u, p && f < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = o; e < f; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = p ? e == 0 ? N.empty : new N(Wr(a.content, e - 1, 1), e - 1, f < 0 ? a.openEnd : e - 1) : new N(Wr(a.content, e, c), a.openStart, a.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !Jr(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = Jr(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = Jr(e, n, r, t, !0);
					if (!i || i.childCount) continue scan;
				}
				return {
					depth: t,
					fit: a,
					move: i ? e.doc.resolve(e.after(t + 1)) : e
				};
			}
		}
	}
	close(e) {
		let t = this.findCloseLevel(e);
		if (!t) return null;
		for (; this.depth > t.depth;) this.closeFrontierNode();
		t.fit.childCount && (this.placed = Gr(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = Gr(this.placed, this.depth, j.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(j.empty, !0);
		e.childCount && (this.placed = Gr(this.placed, this.frontier.length, e));
	}
};
function Wr(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(Wr(e.firstChild.content, t - 1, n)));
}
function Gr(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(Gr(e.lastChild.content, t - 1, n)));
}
function Kr(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function qr(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, qr(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(j.empty, !0)))), e.copy(r);
}
function Jr(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !Yr(n, a.content, o) ? s : null;
}
function Yr(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
function Xr(e) {
	return e.spec.defining || e.spec.definingForContent;
}
function Zr(e, t) {
	for (let n = 0;; n++) {
		let r = t < 0 ? e.firstChild : e.lastChild;
		if (!r || r.isAtom) return n;
		e = r.content;
	}
}
function Qr(e, t, n, r) {
	if (!r.size) return e.deleteRange(t, n);
	let i = e.doc.resolve(t), a = e.doc.resolve(n);
	if (Hr(i, a, r)) return e.step(new pr(t, n, r));
	let o = ni(i, a);
	o[o.length - 1] == 0 && o.pop();
	let s = -(i.depth + 1);
	o.unshift(s);
	for (let e = i.depth, t = i.pos - 1; e > 0; e--, t--) {
		let n = i.node(e).type.spec;
		if (n.defining || n.definingAsContext || n.isolating) break;
		o.indexOf(e) > -1 ? s = e : i.before(e) == t && o.splice(1, 0, -e);
	}
	let c = o.indexOf(s), l = [], u = r.openStart;
	for (let e = r.content, t = 0;; t++) {
		let n = e.firstChild;
		if (l.push(n), t == r.openStart) break;
		e = n.content;
	}
	for (let e = u - 1; e >= 0; e--) {
		let t = l[e], n = Xr(t.type);
		if (n && !t.sameMarkup(i.node(Math.abs(s) - 1))) u = e;
		else if (n || !t.type.isTextblock) break;
	}
	for (let t = r.openStart; t >= 0; t--) {
		let s = (t + u + 1) % (r.openStart + 1), d = l[s];
		if (d) for (let t = 0; t < o.length; t++) {
			let l = o[(t + c) % o.length], u = !0;
			l < 0 && (u = !1, l = -l);
			let f = i.node(l - 1), p = i.index(l - 1);
			if (f.canReplaceWith(p, p, d.type, d.marks)) return e.replace(i.before(l), u ? a.after(l) : n, new N($r(r.content, 0, r.openStart, s), s, r.openEnd));
		}
	}
	let d = e.steps.length;
	for (let s = o.length - 1; s >= 0 && (e.replace(t, n, r), !(e.steps.length > d)); s--) {
		let e = o[s];
		e < 0 || (t = i.before(e), n = a.after(e));
	}
}
function $r(e, t, n, r, i) {
	if (t < n) {
		let i = e.firstChild;
		e = e.replaceChild(0, i.copy($r(i.content, t + 1, n, r, i)));
	}
	if (t > r) {
		let t = i.contentMatchAt(0), n = t.fillBefore(e).append(e);
		e = n.append(t.matchFragment(n).fillBefore(j.empty, !0));
	}
	return e;
}
function ei(e, t, n, r) {
	if (!r.isInline && t == n && e.doc.resolve(t).parent.content.size) {
		let i = zr(e.doc, t, r.type);
		i != null && (t = n = i);
	}
	e.replaceRange(t, n, new N(j.from(r), 0, 0));
}
function ti(e, t, n) {
	let r = e.doc.resolve(t), i = e.doc.resolve(n);
	if (r.parent.isTextblock && i.parent.isTextblock && r.start() != i.start() && r.parentOffset == 0 && i.parentOffset == 0) {
		let a = r.sharedDepth(n), o = !1;
		for (let e = r.depth; e > a; e--) r.node(e).type.spec.isolating && (o = !0);
		for (let e = i.depth; e > a; e--) i.node(e).type.spec.isolating && (o = !0);
		if (!o) {
			for (let e = r.depth; e > 0 && t == r.start(e); e--) t = r.before(e);
			for (let e = i.depth; e > 0 && n == i.start(e); e--) n = i.before(e);
			r = e.doc.resolve(t), i = e.doc.resolve(n);
		}
	}
	let a = ni(r, i);
	for (let t = 0; t < a.length; t++) {
		let n = a[t], o = t == a.length - 1;
		if (o && n == 0 || r.node(n).type.contentMatch.validEnd) return e.delete(r.start(n), i.end(n));
		if (n > 0 && (o || r.node(n - 1).canReplace(r.index(n - 1), i.indexAfter(n - 1)))) return e.delete(r.before(n), i.after(n));
	}
	for (let a = 1; a <= r.depth && a <= i.depth; a++) if (t - r.start(a) == r.depth - a && n > r.end(a) && i.end(a) - n != i.depth - a && r.start(a - 1) == i.start(a - 1) && r.node(a - 1).canReplace(r.index(a - 1), i.index(a - 1))) return e.delete(r.before(a), n);
	e.delete(t, n);
}
function ni(e, t) {
	let n = [], r = Math.min(e.depth, t.depth);
	for (let i = r; i >= 0; i--) {
		let r = e.start(i);
		if (r < e.pos - (e.depth - i) || t.end(i) > t.pos + (t.depth - i) || e.node(i).type.spec.isolating || t.node(i).type.spec.isolating) break;
		(r == t.start(i) || i == e.depth && i == t.depth && e.parent.inlineContent && t.parent.inlineContent && i && t.start(i - 1) == r - 1) && n.push(i);
	}
	return n;
}
var ri = class e extends P {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return ar.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return ar.fromReplace(e, this.pos, this.pos + 1, new N(j.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return nr.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
P.jsonID("attr", ri);
var ii = class e extends P {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return ar.ok(n);
	}
	getMap() {
		return nr.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
P.jsonID("docAttr", ii);
var ai = class extends Error {};
ai = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, ai.prototype = Object.create(Error.prototype), ai.prototype.constructor = ai, ai.prototype.name = "TransformError";
var oi = class {
	constructor(e) {
		this.doc = e, this.steps = [], this.docs = [], this.mapping = new rr();
	}
	get before() {
		return this.docs.length ? this.docs[0] : this.doc;
	}
	step(e) {
		let t = this.maybeStep(e);
		if (t.failed) throw new ai(t.failed);
		return this;
	}
	maybeStep(e) {
		let t = e.apply(this.doc);
		return t.failed || this.addStep(e, t.doc), t;
	}
	get docChanged() {
		return this.steps.length > 0;
	}
	changedRange() {
		let e = 1e9, t = -1e9;
		for (let n = 0; n < this.mapping.maps.length; n++) {
			let r = this.mapping.maps[n];
			n && (e = r.map(e, 1), t = r.map(t, -1)), r.forEach((n, r, i, a) => {
				e = Math.min(e, i), t = Math.max(t, a);
			});
		}
		return e == 1e9 ? null : {
			from: e,
			to: t
		};
	}
	addStep(e, t) {
		this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
	}
	replace(e, t = e, n = N.empty) {
		let r = Vr(this.doc, e, t, n);
		return r && this.step(r), this;
	}
	replaceWith(e, t, n) {
		return this.replace(e, t, new N(j.from(n), 0, 0));
	}
	delete(e, t) {
		return this.replace(e, t, N.empty);
	}
	insert(e, t) {
		return this.replaceWith(e, e, t);
	}
	replaceRange(e, t, n) {
		return Qr(this, e, t, n), this;
	}
	replaceRangeWith(e, t, n) {
		return ei(this, e, t, n), this;
	}
	deleteRange(e, t) {
		return ti(this, e, t), this;
	}
	lift(e, t) {
		return xr(this, e, t), this;
	}
	join(e, t = 1) {
		return Rr(this, e, t), this;
	}
	wrap(e, t) {
		return Er(this, e, t), this;
	}
	setBlockType(e, t = e, n, r = null) {
		return Dr(this, e, t, n, r), this;
	}
	setNodeMarkup(e, t, n = null, r) {
		return jr(this, e, t, n, r), this;
	}
	setNodeAttribute(e, t, n) {
		return this.step(new ri(e, t, n)), this;
	}
	setDocAttribute(e, t) {
		return this.step(new ii(e, t)), this;
	}
	addNodeMark(e, t) {
		return this.step(new dr(e, t)), this;
	}
	removeNodeMark(e, t) {
		let n = this.doc.nodeAt(e);
		if (!n) throw RangeError("No node at position " + e);
		if (t instanceof M) t.isInSet(n.marks) && this.step(new fr(e, t));
		else {
			let r = n.marks, i, a = [];
			for (; i = t.isInSet(r);) a.push(new fr(e, i)), r = i.removeFromSet(r);
			for (let e = a.length - 1; e >= 0; e--) this.step(a[e]);
		}
		return this;
	}
	split(e, t = 1, n) {
		return Nr(this, e, t, n), this;
	}
	addMark(e, t, n) {
		return gr(this, e, t, n), this;
	}
	removeMark(e, t, n) {
		return _r(this, e, t, n), this;
	}
	clearIncompatible(e, t, n) {
		return vr(this, e, t, n), this;
	}
}, si = Object.create(null), F = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new ci(e.min(t), e.max(t))];
	}
	get anchor() {
		return this.$anchor.pos;
	}
	get head() {
		return this.$head.pos;
	}
	get from() {
		return this.$from.pos;
	}
	get to() {
		return this.$to.pos;
	}
	get $from() {
		return this.ranges[0].$from;
	}
	get $to() {
		return this.ranges[0].$to;
	}
	get empty() {
		let e = this.ranges;
		for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
		return !0;
	}
	content() {
		return this.$from.doc.slice(this.from, this.to, !0);
	}
	replace(e, t = N.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? N.empty : t), o == 0 && gi(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), gi(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new I(e) : hi(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? hi(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : hi(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new pi(e.node(0));
	}
	static atStart(e) {
		return hi(e, e, 0, 0, 1) || new pi(e);
	}
	static atEnd(e) {
		return hi(e, e, e.content.size, e.childCount, -1) || new pi(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = si[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in si) throw RangeError("Duplicate use of selection JSON ID " + e);
		return si[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return I.between(this.$anchor, this.$head).getBookmark();
	}
};
F.prototype.visible = !0;
var ci = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, li = !1;
function ui(e) {
	!li && !e.parent.inlineContent && (li = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var I = class e extends F {
	constructor(e, t = e) {
		ui(e), ui(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return F.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = N.empty) {
		if (super.replace(e, t), t == N.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new di(this.anchor, this.head);
	}
	toJSON() {
		return {
			type: "text",
			anchor: this.anchor,
			head: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number" || typeof n.head != "number") throw RangeError("Invalid input for TextSelection.fromJSON");
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(e, t, n = t) {
		let r = e.resolve(t);
		return new this(r, n == t ? r : e.resolve(n));
	}
	static between(t, n, r) {
		let i = t.pos - n.pos;
		if ((!r || i) && (r = i >= 0 ? 1 : -1), !n.parent.inlineContent) {
			let e = F.findFrom(n, r, !0) || F.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return F.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (F.findFrom(t, -r, !0) || F.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
F.jsonID("text", I);
var di = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return I.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, L = class e extends F {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? F.near(a) : new e(a);
	}
	content() {
		return new N(j.from(this.node), 0, 0);
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor;
	}
	toJSON() {
		return {
			type: "node",
			anchor: this.anchor
		};
	}
	getBookmark() {
		return new fi(this.anchor);
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number") throw RangeError("Invalid input for NodeSelection.fromJSON");
		return new e(t.resolve(n.anchor));
	}
	static create(t, n) {
		return new e(t.resolve(n));
	}
	static isSelectable(e) {
		return !e.isText && e.type.spec.selectable !== !1;
	}
};
L.prototype.visible = !1, F.jsonID("node", L);
var fi = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new di(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && L.isSelectable(n) ? new L(t) : F.near(t);
	}
}, pi = class e extends F {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = N.empty) {
		if (t == N.empty) {
			e.delete(0, e.doc.content.size);
			let t = F.atStart(e.doc);
			t.eq(e.selection) || e.setSelection(t);
		} else super.replace(e, t);
	}
	toJSON() {
		return { type: "all" };
	}
	static fromJSON(t) {
		return new e(t);
	}
	map(t) {
		return new e(t);
	}
	eq(t) {
		return t instanceof e;
	}
	getBookmark() {
		return mi;
	}
};
F.jsonID("all", pi);
var mi = {
	map() {
		return this;
	},
	resolve(e) {
		return new pi(e);
	}
};
function hi(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return I.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = hi(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && L.isSelectable(r)) return L.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function gi(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof pr || i instanceof mr)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o ??= r;
	}), e.setSelection(F.near(e.doc.resolve(o), n));
}
var _i = 1, vi = 2, yi = 4, bi = class extends oi {
	constructor(e) {
		super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
	}
	get selection() {
		return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
	}
	setSelection(e) {
		if (e.$from.doc != this.doc) throw RangeError("Selection passed to setSelection must point at the current document");
		return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | _i) & -3, this.storedMarks = null, this;
	}
	get selectionSet() {
		return (this.updated & _i) > 0;
	}
	setStoredMarks(e) {
		return this.storedMarks = e, this.updated |= vi, this;
	}
	ensureMarks(e) {
		return M.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
	}
	addStoredMark(e) {
		return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
	}
	removeStoredMark(e) {
		return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
	}
	get storedMarksSet() {
		return (this.updated & vi) > 0;
	}
	addStep(e, t) {
		super.addStep(e, t), this.updated &= -3, this.storedMarks = null;
	}
	setTime(e) {
		return this.time = e, this;
	}
	replaceSelection(e) {
		return this.selection.replace(this, e), this;
	}
	replaceSelectionWith(e, t = !0) {
		let n = this.selection;
		return t && (e = e.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || M.none))), n.replaceWith(this, e), this;
	}
	deleteSelection() {
		return this.selection.replace(this), this;
	}
	insertText(e, t, n) {
		let r = this.doc.type.schema;
		if (t == null) return e ? this.replaceSelectionWith(r.text(e), !0) : this.deleteSelection();
		{
			if (n ??= t, !e) return this.deleteRange(t, n);
			let i = this.storedMarks;
			if (!i) {
				let e = this.doc.resolve(t);
				i = n == t ? e.marks() : e.marksAcross(this.doc.resolve(n));
			}
			return this.replaceRangeWith(t, n, r.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(F.near(this.selection.$to)), this;
		}
	}
	setMeta(e, t) {
		return this.meta[typeof e == "string" ? e : e.key] = t, this;
	}
	getMeta(e) {
		return this.meta[typeof e == "string" ? e : e.key];
	}
	get isGeneric() {
		for (let e in this.meta) return !1;
		return !0;
	}
	scrollIntoView() {
		return this.updated |= yi, this;
	}
	get scrolledIntoView() {
		return (this.updated & yi) > 0;
	}
};
function xi(e, t) {
	return !t || !e ? e : e.bind(t);
}
var Si = class {
	constructor(e, t, n) {
		this.name = e, this.init = xi(t.init, n), this.apply = xi(t.apply, n);
	}
}, Ci = [
	new Si("doc", {
		init(e) {
			return e.doc || e.schema.topNodeType.createAndFill();
		},
		apply(e) {
			return e.doc;
		}
	}),
	new Si("selection", {
		init(e, t) {
			return e.selection || F.atStart(t.doc);
		},
		apply(e) {
			return e.selection;
		}
	}),
	new Si("storedMarks", {
		init(e) {
			return e.storedMarks || null;
		},
		apply(e, t, n, r) {
			return r.selection.$cursor ? e.storedMarks : null;
		}
	}),
	new Si("scrollToSelection", {
		init() {
			return 0;
		},
		apply(e, t) {
			return e.scrolledIntoView ? t + 1 : t;
		}
	})
], wi = class {
	constructor(e, t) {
		this.schema = e, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = Ci.slice(), t && t.forEach((e) => {
			if (this.pluginsByKey[e.key]) throw RangeError("Adding different instances of a keyed plugin (" + e.key + ")");
			this.plugins.push(e), this.pluginsByKey[e.key] = e, e.spec.state && this.fields.push(new Si(e.key, e.spec.state, e));
		});
	}
}, Ti = class e {
	constructor(e) {
		this.config = e;
	}
	get schema() {
		return this.config.schema;
	}
	get plugins() {
		return this.config.plugins;
	}
	apply(e) {
		return this.applyTransaction(e).state;
	}
	filterTransaction(e, t = -1) {
		for (let n = 0; n < this.config.plugins.length; n++) if (n != t) {
			let t = this.config.plugins[n];
			if (t.spec.filterTransaction && !t.spec.filterTransaction.call(t, e, this)) return !1;
		}
		return !0;
	}
	applyTransaction(e) {
		if (!this.filterTransaction(e)) return {
			state: this,
			transactions: []
		};
		let t = [e], n = this.applyInner(e), r = null;
		for (;;) {
			let i = !1;
			for (let a = 0; a < this.config.plugins.length; a++) {
				let o = this.config.plugins[a];
				if (o.spec.appendTransaction) {
					let s = r ? r[a].n : 0, c = r ? r[a].state : this, l = s < t.length && o.spec.appendTransaction.call(o, s ? t.slice(s) : t, c, n);
					if (l && n.filterTransaction(l, a)) {
						if (l.setMeta("appendedTransaction", e), !r) {
							r = [];
							for (let e = 0; e < this.config.plugins.length; e++) r.push(e < a ? {
								state: n,
								n: t.length
							} : {
								state: this,
								n: 0
							});
						}
						t.push(l), n = n.applyInner(l), i = !0;
					}
					r && (r[a] = {
						state: n,
						n: t.length
					});
				}
			}
			if (!i) return {
				state: n,
				transactions: t
			};
		}
	}
	applyInner(t) {
		if (!t.before.eq(this.doc)) throw RangeError("Applying a mismatched transaction");
		let n = new e(this.config), r = this.config.fields;
		for (let e = 0; e < r.length; e++) {
			let i = r[e];
			n[i.name] = i.apply(t, this[i.name], this, n);
		}
		return n;
	}
	get tr() {
		return new bi(this);
	}
	static create(t) {
		let n = new wi(t.doc ? t.doc.type.schema : t.schema, t.plugins), r = new e(n);
		for (let e = 0; e < n.fields.length; e++) r[n.fields[e].name] = n.fields[e].init(t, r);
		return r;
	}
	reconfigure(t) {
		let n = new wi(this.schema, t.plugins), r = n.fields, i = new e(n);
		for (let e = 0; e < r.length; e++) {
			let n = r[e].name;
			i[n] = this.hasOwnProperty(n) ? this[n] : r[e].init(t, i);
		}
		return i;
	}
	toJSON(e) {
		let t = {
			doc: this.doc.toJSON(),
			selection: this.selection.toJSON()
		};
		if (this.storedMarks && (t.storedMarks = this.storedMarks.map((e) => e.toJSON())), e && typeof e == "object") for (let n in e) {
			if (n == "doc" || n == "selection") throw RangeError("The JSON fields `doc` and `selection` are reserved");
			let r = e[n], i = r.spec.state;
			i && i.toJSON && (t[n] = i.toJSON.call(r, this[r.key]));
		}
		return t;
	}
	static fromJSON(t, n, r) {
		if (!n) throw RangeError("Invalid input for EditorState.fromJSON");
		if (!t.schema) throw RangeError("Required config field 'schema' missing");
		let i = new wi(t.schema, t.plugins), a = new e(i);
		return i.fields.forEach((e) => {
			if (e.name == "doc") a.doc = Yt.fromJSON(t.schema, n.doc);
			else if (e.name == "selection") a.selection = F.fromJSON(a.doc, n.selection);
			else if (e.name == "storedMarks") n.storedMarks && (a.storedMarks = n.storedMarks.map(t.schema.markFromJSON));
			else {
				if (r) for (let i in r) {
					let o = r[i], s = o.spec.state;
					if (o.key == e.name && s && s.fromJSON && Object.prototype.hasOwnProperty.call(n, i)) {
						a[e.name] = s.fromJSON.call(o, t, n[i], a);
						return;
					}
				}
				a[e.name] = e.init(t, a);
			}
		}), a;
	}
};
function Ei(e, t, n) {
	for (let r in e) {
		let i = e[r];
		i instanceof Function ? i = i.bind(t) : r == "handleDOMEvents" && (i = Ei(i, t, {})), n[r] = i;
	}
	return n;
}
var R = class {
	constructor(e) {
		this.spec = e, this.props = {}, e.props && Ei(e.props, this, this.props), this.key = e.key ? e.key.key : Oi("plugin");
	}
	getState(e) {
		return e[this.key];
	}
}, Di = Object.create(null);
function Oi(e) {
	return e in Di ? e + "$" + ++Di[e] : (Di[e] = 0, e + "$");
}
var z = class {
	constructor(e = "key") {
		this.key = Oi(e);
	}
	get(e) {
		return e.config.pluginsByKey[this.key];
	}
	getState(e) {
		return e[this.key];
	}
}, ki = (e, t) => !e.selection.empty && (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function Ai(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var ji = (e, t, n) => {
	let r = Ai(e, n);
	if (!r) return !1;
	let i = Li(r);
	if (!i) {
		let n = r.blockRange(), i = n && br(n);
		return i != null && (t && t(e.tr.lift(n, i).scrollIntoView()), !0);
	}
	let a = i.nodeBefore;
	if (ta(e, i, t, -1)) return !0;
	if (r.parent.content.size == 0 && (Fi(a, "end") || L.isSelectable(a))) for (let n = r.depth;; n--) {
		let o = Vr(e.doc, r.before(n), r.after(n), N.empty);
		if (o && o.slice.size < o.to - o.from) {
			if (t) {
				let n = e.tr.step(o);
				n.setSelection(Fi(a, "end") ? F.findFrom(n.doc.resolve(n.mapping.map(i.pos, -1)), -1) : L.create(n.doc, i.pos - a.nodeSize)), t(n.scrollIntoView());
			}
			return !0;
		}
		if (n == 1 || r.node(n - 1).childCount > 1) break;
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos - a.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Mi = (e, t, n) => {
	let r = Ai(e, n);
	if (!r) return !1;
	let i = Li(r);
	return i ? Pi(e, i, t) : !1;
}, Ni = (e, t, n) => {
	let r = Ri(e, n);
	if (!r) return !1;
	let i = Vi(r);
	return i ? Pi(e, i, t) : !1;
};
function Pi(e, t, n) {
	let r = t.nodeBefore, i = t.pos - 1;
	for (; !r.isTextblock; i--) {
		if (r.type.spec.isolating) return !1;
		let e = r.lastChild;
		if (!e) return !1;
		r = e;
	}
	let a = t.nodeAfter, o = t.pos + 1;
	for (; !a.isTextblock; o++) {
		if (a.type.spec.isolating) return !1;
		let e = a.firstChild;
		if (!e) return !1;
		a = e;
	}
	let s = Vr(e.doc, i, o, N.empty);
	if (!s || s.from != i || s instanceof pr && s.slice.size >= o - i) return !1;
	if (n) {
		let t = e.tr.step(s);
		t.setSelection(I.create(t.doc, i)), n(t.scrollIntoView());
	}
	return !0;
}
function Fi(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var Ii = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("backward", e) : r.parentOffset > 0) return !1;
		a = Li(r);
	}
	let o = a && a.nodeBefore;
	return !o || !L.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(L.create(e.doc, a.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Li(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function Ri(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var zi = (e, t, n) => {
	let r = Ri(e, n);
	if (!r) return !1;
	let i = Vi(r);
	if (!i) return !1;
	let a = i.nodeAfter;
	if (ta(e, i, t, 1)) return !0;
	if (r.parent.content.size == 0 && (Fi(a, "start") || L.isSelectable(a))) {
		let n = Vr(e.doc, r.before(), r.after(), N.empty);
		if (n && n.slice.size < n.to - n.from) {
			if (t) {
				let r = e.tr.step(n);
				r.setSelection(Fi(a, "start") ? F.findFrom(r.doc.resolve(r.mapping.map(i.pos)), 1) : L.create(r.doc, r.mapping.map(i.pos))), t(r.scrollIntoView());
			}
			return !0;
		}
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos, i.pos + a.nodeSize).scrollIntoView()), !0) : !1;
}, Bi = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("forward", e) : r.parentOffset < r.parent.content.size) return !1;
		a = Vi(r);
	}
	let o = a && a.nodeAfter;
	return !o || !L.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(L.create(e.doc, a.pos)).scrollIntoView()), !0);
};
function Vi(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var Hi = (e, t) => {
	let n = e.selection, r = n instanceof L, i;
	if (r) {
		if (n.node.isTextblock || !Pr(e.doc, n.from)) return !1;
		i = n.from;
	} else if (i = Lr(e.doc, n.from, -1), i == null) return !1;
	if (t) {
		let n = e.tr.join(i);
		r && n.setSelection(L.create(n.doc, i - e.doc.resolve(i).nodeBefore.nodeSize)), t(n.scrollIntoView());
	}
	return !0;
}, Ui = (e, t) => {
	let n = e.selection, r;
	if (n instanceof L) {
		if (n.node.isTextblock || !Pr(e.doc, n.to)) return !1;
		r = n.to;
	} else if (r = Lr(e.doc, n.to, 1), r == null) return !1;
	return t && t(e.tr.join(r).scrollIntoView()), !0;
}, Wi = (e, t) => {
	let { $from: n, $to: r } = e.selection, i = n.blockRange(r), a = i && br(i);
	return a != null && (t && t(e.tr.lift(i, a).scrollIntoView()), !0);
}, Gi = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function Ki(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var qi = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), a = n.indexAfter(-1), o = Ki(i.contentMatchAt(a));
	if (!o || !i.canReplaceWith(a, a, o)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, o.createAndFill());
		i.setSelection(F.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, Ji = (e, t) => {
	let n = e.selection, { $from: r, $to: i } = n;
	if (n instanceof pi || r.parent.inlineContent || i.parent.inlineContent) return !1;
	let a = Ki(i.parent.contentMatchAt(i.indexAfter()));
	if (!a || !a.isTextblock) return !1;
	if (t) {
		let n = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = e.tr.insert(n, a.createAndFill());
		o.setSelection(I.create(o.doc, n + 1)), t(o.scrollIntoView());
	}
	return !0;
}, Yi = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (Mr(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && br(r);
	return i != null && (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function Xi(e) {
	return (t, n) => {
		if (t.selection instanceof L && t.selection.node.isBlock) {
			let { $from: e } = t.selection;
			return !e.parentOffset || !Mr(t.doc, e.pos) ? !1 : (n && n(t.tr.split(e.pos).scrollIntoView()), !0);
		}
		if (!t.selection.$from.depth) return !1;
		let r = t.tr;
		!t.selection.empty && (t.selection instanceof I || t.selection instanceof pi) && r.deleteSelection();
		let { $from: i } = r.selection, a = r.steps.length, o = [], s, c, l = !1, u = !1;
		for (let t = i.depth;; t--) if (i.node(t).isBlock) {
			l = i.end(t) == i.pos + (i.depth - t), u = i.start(t) == i.pos - (i.depth - t), c = Ki(i.node(t - 1).contentMatchAt(i.indexAfter(t - 1)));
			let n = e && e(i.parent, l, i);
			o.unshift(n || (l && c ? { type: c } : null)), s = t;
			break;
		} else {
			if (t == 1) return !1;
			o.unshift(null);
		}
		let d = i.pos, f = Mr(r.doc, d, o.length, o);
		if (f ||= (o[0] = c ? { type: c } : null, Mr(r.doc, d, o.length, o)), !f) return !1;
		if (r.split(d, o.length, o), !l && u && i.node(s).type != c) {
			let e = r.mapping.slice(a), t = e.map(i.before(s)), n = r.doc.resolve(t);
			c && i.node(s - 1).canReplaceWith(n.index(), n.index() + 1, c) && r.setNodeMarkup(e.map(i.before(s)), c);
		}
		return n && n(r.scrollIntoView()), !0;
	};
}
var Zi = Xi(), Qi = (e, t) => {
	let { $from: n, to: r } = e.selection, i, a = n.sharedDepth(r);
	return a != 0 && (i = n.before(a), t && t(e.tr.setSelection(L.create(e.doc, i))), !0);
}, $i = (e, t) => (t && t(e.tr.setSelection(new pi(e.doc))), !0);
function ea(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || Pr(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function ta(e, t, n, r) {
	let i = t.nodeBefore, a = t.nodeAfter, o, s, c = i.type.spec.isolating || a.type.spec.isolating;
	if (!c && ea(e, t, n)) return !0;
	let l = !c && t.parent.canReplace(t.index(), t.index() + 1);
	if (l && (o = (s = i.contentMatchAt(i.childCount)).findWrapping(a.type)) && s.matchType(o[0] || a.type).validEnd) {
		if (n) {
			let r = t.pos + a.nodeSize, s = j.empty;
			for (let e = o.length - 1; e >= 0; e--) s = j.from(o[e].create(null, s));
			s = j.from(i.copy(s));
			let c = e.tr.step(new mr(t.pos - 1, r, t.pos, r, new N(s, 1, 0), o.length, !0)), l = c.doc.resolve(r + 2 * o.length);
			l.nodeAfter && l.nodeAfter.type == i.type && Pr(c.doc, l.pos) && c.join(l.pos), n(c.scrollIntoView());
		}
		return !0;
	}
	let u = a.type.spec.isolating || r > 0 && c ? null : F.findFrom(t, 1), d = u && u.$from.blockRange(u.$to), f = d && br(d);
	if (f != null && f >= t.depth) return n && n(e.tr.lift(d, f).scrollIntoView()), !0;
	if (l && Fi(a, "start", !0) && Fi(i, "end")) {
		let r = i, o = [];
		for (; o.push(r), !r.isTextblock;) r = r.lastChild;
		let s = a, c = 1;
		for (; !s.isTextblock; s = s.firstChild) c++;
		if (r.canReplace(r.childCount, r.childCount, s.content)) {
			if (n) {
				let r = j.empty;
				for (let e = o.length - 1; e >= 0; e--) r = j.from(o[e].copy(r));
				n(e.tr.step(new mr(t.pos - o.length, t.pos + a.nodeSize, t.pos + c, t.pos + a.nodeSize - c, new N(r, o.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function na(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(I.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var ra = na(-1), ia = na(1);
function aa(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a), s = o && Sr(o, e, t);
		return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
	};
}
function oa(e, t = null) {
	return function(n, r) {
		let i = !1;
		for (let r = 0; r < n.selection.ranges.length && !i; r++) {
			let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
			n.doc.nodesBetween(a, o, (r, a) => {
				if (i) return !1;
				if (r.isTextblock && !r.hasMarkup(e, t)) {
					if (r.type == e) i = !0;
					else {
						let t = n.doc.resolve(a), r = t.index();
						i = t.parent.canReplaceWith(r, r + 1, e);
					}
				}
			});
		}
		if (!i) return !1;
		if (r) {
			let i = n.tr;
			for (let r = 0; r < n.selection.ranges.length; r++) {
				let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
				i.setBlockType(a, o, e, t);
			}
			r(i.scrollIntoView());
		}
		return !0;
	};
}
function sa(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var ca = sa(ki, ji, Ii), la = sa(ki, zi, Bi), ua = {
	Enter: sa(Gi, Ji, Yi, Zi),
	"Mod-Enter": qi,
	Backspace: ca,
	"Mod-Backspace": ca,
	"Shift-Backspace": ca,
	Delete: la,
	"Mod-Delete": la,
	"Mod-a": $i
}, da = {
	"Ctrl-h": ua.Backspace,
	"Alt-Backspace": ua["Mod-Backspace"],
	"Ctrl-d": ua.Delete,
	"Ctrl-Alt-Backspace": ua["Mod-Delete"],
	"Alt-Delete": ua["Mod-Delete"],
	"Alt-d": ua["Mod-Delete"],
	"Ctrl-a": ra,
	"Ctrl-e": ia
};
for (let e in ua) da[e] = ua[e];
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform();
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-schema-list/dist/index.js
function fa(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return pa(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function pa(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new qt(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new qt(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = Sr(a, n, r, t);
	return s ? (e && ma(e, t, s, i, n), !0) : !1;
}
function ma(e, t, n, r, i) {
	let a = j.empty;
	for (let e = n.length - 1; e >= 0; e--) a = j.from(n[e].type.create(n[e].attrs, a));
	e.step(new mr(t.start - (r ? 2 : 0), t.end, t.start, t.end, new N(a, 0, 0), n.length, !0));
	let o = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (o = e + 1);
	let s = n.length - o, c = t.start + n.length - (r ? 2 : 0), l = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && Mr(e.doc, c, s) && (e.split(c, s), c += 2 * s), c += l.child(n).nodeSize;
	return e;
}
function ha(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		return a ? n ? r.node(a.depth - 1).type == e ? ga(t, n, e, a) : _a(t, n, a) : !0 : !1;
	};
}
function ga(e, t, n, r) {
	let i = e.tr, a = r.end, o = r.$to.end(r.depth);
	a < o && (i.step(new mr(a - 1, o, a, o, new N(j.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new qt(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
	let s = br(r);
	if (s == null) return !1;
	i.lift(r, s);
	let c = i.doc.resolve(i.mapping.map(a, -1) - 1);
	return Pr(i.doc, c.pos) && c.nodeBefore.type == c.nodeAfter.type && i.join(c.pos), t(i.scrollIntoView()), !0;
}
function _a(e, t, n) {
	let r = e.tr, i = n.parent;
	for (let e = n.end, t = n.endIndex - 1, a = n.startIndex; t > a; t--) e -= i.child(t).nodeSize, r.delete(e - 1, e + 1);
	let a = r.doc.resolve(n.start), o = a.nodeAfter;
	if (r.mapping.map(n.end) != n.start + a.nodeAfter.nodeSize) return !1;
	let s = n.startIndex == 0, c = n.endIndex == i.childCount, l = a.node(-1), u = a.index(-1);
	if (!l.canReplace(u + +!s, u + 1, o.content.append(c ? j.empty : j.from(i)))) return !1;
	let d = a.pos, f = d + o.nodeSize;
	return r.step(new mr(d - +!!s, f + +!!c, d + 1, f - 1, new N((s ? j.empty : j.from(i.copy(j.empty))).append(c ? j.empty : j.from(i.copy(j.empty))), +!s, +!c), +!s)), t(r.scrollIntoView()), !0;
}
function va(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		if (!a) return !1;
		let o = a.startIndex;
		if (o == 0) return !1;
		let s = a.parent, c = s.child(o - 1);
		if (c.type != e) return !1;
		if (n) {
			let r = c.lastChild && c.lastChild.type == s.type, i = j.from(r ? e.create() : null), o = new N(j.from(e.create(null, j.from(s.type.create(null, i)))), r ? 3 : 1, 0), l = a.start, u = a.end;
			n(t.tr.step(new mr(l - (r ? 3 : 1), u, l, u, o, 1, !0)).scrollIntoView());
		}
		return !0;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-view/dist/index.js
var B = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, ya = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, ba = null, xa = function(e, t, n) {
	let r = ba ||= document.createRange();
	return r.setEnd(e, n ?? e.nodeValue.length), r.setStart(e, t || 0), r;
}, Sa = function() {
	ba = null;
}, Ca = function(e, t, n, r) {
	return n && (Ta(e, t, n, r, -1) || Ta(e, t, n, r, 1));
}, wa = /^(img|br|input|textarea|hr)$/i;
function Ta(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : Ea(e))) {
			let n = e.parentNode;
			if (!n || !V(n) || ja(e) || wa.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = B(e) + (i < 0 ? 0 : 1), e = n;
		} else if (V(e)) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (V(n) && n.contentEditable == "false") {
				if (n.pmViewDesc?.ignoreForSelection) t += i;
				else return !1;
			} else e = n, t = i < 0 ? Ea(e) : 0;
		} else return !1;
	}
}
function Ea(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function V(e) {
	return e.nodeType == 1;
}
function H(e) {
	return e.nodeType == 3;
}
function Da(e, t) {
	return t ? e.contains(V(t) ? t : t.parentNode) : !1;
}
function Oa(e, t) {
	for (;;) {
		if (H(e) && t) return e;
		if (V(e) && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = Ea(e);
		} else if (e.parentNode && !ja(e)) t = B(e), e = e.parentNode;
		else return null;
	}
}
function ka(e, t) {
	for (;;) {
		if (H(e) && t < e.nodeValue.length) return e;
		if (V(e) && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !ja(e)) t = B(e) + 1, e = e.parentNode;
		else return null;
	}
}
function Aa(e, t, n) {
	for (let r = t == 0, i = t == Ea(e); r || i;) {
		if (e == n) return !0;
		let t = B(e);
		if (e = e.parentNode, !e) return !1;
		r &&= t == 0, i &&= t == Ea(e);
	}
}
function ja(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var Ma = function(e) {
	return e.focusNode && Ca(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function Na(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function Pa(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function Fa(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(Ea(r.offsetNode), r.offset)
		};
	} catch {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(Ea(r.startContainer), r.startOffset)
		};
	}
}
var Ia = typeof navigator < "u" ? navigator : null, La = typeof document < "u" ? document : null, Ra = Ia && Ia.userAgent || "", za = /Edge\/(\d+)/.exec(Ra), Ba = /MSIE \d/.exec(Ra), Va = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Ra), Ha = !!(Ba || Va || za), Ua = Ba ? document.documentMode : Va ? +Va[1] : za ? +za[1] : 0, Wa = !Ha && /gecko\/(\d+)/i.test(Ra);
Wa && +(/Firefox\/(\d+)/.exec(Ra) || [0, 0])[1];
var Ga = !Ha && /Chrome\/(\d+)/.exec(Ra), Ka = !!Ga, qa = Ga ? +Ga[1] : 0, Ja = !Ha && !!Ia && /Apple Computer/.test(Ia.vendor), Ya = Ja && (/Mobile\/\w+/.test(Ra) || !!Ia && Ia.maxTouchPoints > 2), Xa = Ya || (Ia ? /Mac/.test(Ia.platform) : !1), Za = Ia ? /Win/.test(Ia.platform) : !1, Qa = /Android \d/.test(Ra), $a = !!La && "webkitFontSmoothing" in La.documentElement.style, eo = $a ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function to(e) {
	let t = e.defaultView && e.defaultView.visualViewport;
	return t ? {
		left: 0,
		right: t.width,
		top: 0,
		bottom: t.height
	} : {
		left: 0,
		right: e.documentElement.clientWidth,
		top: 0,
		bottom: e.documentElement.clientHeight
	};
}
function no(e, t) {
	return typeof e == "number" ? e : e[t];
}
function ro(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function io(e, t, n) {
	if (!bo(t) && t.left == 0) return;
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (!V(o)) {
			o = ya(o);
			continue;
		}
		let e = o == a.body, n = e ? to(a) : ro(o), s = 0, c = 0;
		if (t.top < n.top + no(r, "top") ? c = -(n.top - t.top + no(i, "top")) : t.bottom > n.bottom - no(r, "bottom") && (c = t.bottom - t.top > n.bottom - n.top ? t.top + no(i, "top") - n.top : t.bottom - n.bottom + no(i, "bottom")), t.left < n.left + no(r, "left") ? s = -(n.left - t.left + no(i, "left")) : t.right > n.right - no(r, "right") && (s = t.right - n.right + no(i, "right")), s || c) {
			if (e) a.defaultView.scrollBy(s, c);
			else {
				let e = o.scrollLeft, n = o.scrollTop;
				c && (o.scrollTop += c), s && (o.scrollLeft += s);
				let r = o.scrollLeft - e, i = o.scrollTop - n;
				t = {
					left: t.left - r,
					top: t.top - i,
					right: t.right - r,
					bottom: t.bottom - i
				};
			}
		}
		let l = e ? "fixed" : getComputedStyle(o).position;
		if (/^(fixed|sticky)$/.test(l)) break;
		o = l == "absolute" ? o.offsetParent : ya(o);
	}
}
function ao(e) {
	let t = e.dom.getBoundingClientRect(), n = Math.max(0, t.top), r, i;
	for (let a = (t.left + t.right) / 2, o = n + 1; o < Math.min(innerHeight, t.bottom); o += 5) {
		let t = e.root.elementFromPoint(a, o);
		if (!t || t == e.dom || !e.dom.contains(t)) continue;
		let s = t.getBoundingClientRect();
		if (s.top >= n - 20) {
			r = t, i = s.top;
			break;
		}
	}
	return {
		refDOM: r,
		refTop: i,
		stack: oo(e.dom)
	};
}
function oo(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = ya(r));
	return t;
}
function so({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	co(n, r == 0 ? 0 : r - t);
}
function co(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var lo = null;
function uo(e) {
	if (e.setActive) return e.setActive();
	if (lo) return e.focus(lo);
	let t = oo(e);
	e.focus(lo == null ? { get preventScroll() {
		return lo = { preventScroll: !0 }, !0;
	} } : void 0), lo || (lo = !1, co(t, 0));
}
function fo(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (V(u)) e = u.getClientRects();
		else if (H(u)) e = xa(u).getClientRects();
		else continue;
		for (let f = 0; f < e.length; f++) {
			let p = e[f];
			if (p.top <= o && p.bottom >= s) {
				o = Math.max(p.bottom, o), s = Math.min(p.top, s);
				let e = p.left > t.left ? p.left - t.left : p.right < t.left ? t.left - p.right : 0;
				if (e < r) {
					n = u, r = e, i = e && H(n) ? {
						left: p.right < t.left ? p.right : p.left,
						top: t.top
					} : t, V(u) && e && (a = d + +(t.left >= (p.left + p.right) / 2));
					continue;
				}
			} else p.top > t.top && !c && p.left <= t.left && p.right >= t.left && (c = u, l = {
				left: Math.max(p.left, Math.min(p.right, t.left)),
				top: p.top
			});
			!n && (t.left >= p.right && t.top >= p.top || t.left >= p.left && t.top >= p.bottom) && (a = d + 1);
		}
	}
	return !n && c && (n = c, i = l, r = 0), n && H(n) ? po(n, i) : !n || r ? {
		node: e,
		offset: a
	} : fo(n, i);
}
function po(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = xo(r, 1);
		if (n.top != n.bottom && mo(t, n)) {
			i = {
				node: e,
				offset: a + +(t.left >= (n.left + n.right) / 2)
			};
			break;
		}
	}
	return r.detach(), i || {
		node: e,
		offset: 0
	};
}
function mo(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function ho(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function go(e, t, n) {
	let { node: r, offset: i } = fo(t, n), a = -1;
	if (V(r) && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function _o(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (V(t.dom) && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function vo(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (V(n)) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (mo(t, i)) return vo(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function yo(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = Fa(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o)) {
		let n = e.dom.getBoundingClientRect();
		if (!mo(t, n) || (o = vo(e.dom, t, n), !o)) return null;
	}
	if (Ja) for (let e = o; r && e; e = ya(e)) e.draggable && (r = void 0);
	if (o = ho(o, t), r) {
		if (Wa && V(r) && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		$a && i && V(r) && V(n = r.childNodes[i - 1]) && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && V(r.lastChild) && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : i != 0 && V(r) && r.childNodes[i - 1].nodeName == "BR" || (s = _o(e, r, i, t));
	}
	s ??= go(e, o, t);
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function bo(e) {
	return e.top < e.bottom || e.left < e.right;
}
function xo(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (bo(e)) return e;
	}
	return Array.prototype.find.call(n, bo) || e.getBoundingClientRect();
}
var So = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Co(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = $a || Wa;
	if (H(r)) {
		if (o && (So.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
			let e = xo(xa(r, i, i), n);
			if (Wa && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
				let t = xo(xa(r, i - 1, i - 1), -1);
				if (t.top == e.top) {
					let n = xo(xa(r, i, i + 1), -1);
					if (n.top != e.top) return wo(n, n.left < t.left);
				}
			}
			return e;
		}
		{
			let e = i, t = i, a = n < 0 ? 1 : -1;
			return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, wo(xo(xa(r, e, t), a), a < 0);
		}
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == Ea(r))) {
			let e = r.childNodes[i - 1];
			if (V(e)) return To(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < Ea(r)) {
			let e = r.childNodes[i];
			if (V(e)) return To(e.getBoundingClientRect(), !0);
		}
		return To(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == Ea(r))) {
		let e = r.childNodes[i - 1], t = H(e) ? xa(e, Ea(e) - +!o) : V(e) && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return wo(xo(t, 1), !1);
	}
	if (a == null && i < Ea(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? H(e) ? xa(e, 0, +!o) : V(e) ? e : null : null;
		if (t) return wo(xo(t, -1), !0);
	}
	return wo(xo(H(r) ? xa(r) : r, -n), n >= 0);
}
function wo(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function To(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function Eo(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function Do(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return Eo(e, t, () => {
		let { node: t } = e.docView.domFromPos(i.pos, n == "up" ? -1 : 1);
		for (;;) {
			let n = e.docView.nearestDesc(t, !0);
			if (!n) break;
			if (n.node.isBlock) {
				t = n.contentDOM || n.dom;
				break;
			}
			t = n.dom.parentNode;
		}
		let r = Co(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (V(e)) t = e.getClientRects();
			else if (H(e)) t = xa(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var Oo = /[\u0590-\u08ac]/;
function ko(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !Oo.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : Eo(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !Da(l, u) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var Ao = null, jo = null, Mo = !1;
function No(e, t, n) {
	return Ao == t && jo == n ? Mo : (Ao = t, jo = n, Mo = n == "up" || n == "down" ? Do(e, t, n) : ko(e, t, n));
}
var Po = 0, Fo = 1, Io = 2, Lo = 3, Ro = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = Po, n.pmViewDesc = this;
	}
	matchesWidget(e) {
		return !1;
	}
	matchesMark(e) {
		return !1;
	}
	matchesNode(e, t, n) {
		return !1;
	}
	matchesHack(e) {
		return !1;
	}
	parseRule(e) {
		return null;
	}
	stopEvent(e) {
		return !1;
	}
	get size() {
		let e = 0;
		for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
		return e;
	}
	get border() {
		return 0;
	}
	destroy() {
		this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
		for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
	}
	posBeforeChild(e) {
		for (let t = 0, n = this.posAtStart;; t++) {
			let r = this.children[t];
			if (r == e) return n;
			n += r.size;
		}
	}
	get posBefore() {
		return this.parent.posBeforeChild(this);
	}
	get posAtStart() {
		return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
	}
	get posAfter() {
		return this.posBefore + this.size;
	}
	get posAtEnd() {
		return this.posAtStart + this.size - 2 * this.border;
	}
	localPosFromDOM(e, t, n) {
		if (this.contentDOM && Da(this.contentDOM, e)) {
			if (n < 0) {
				let n, r;
				if (e == this.contentDOM) n = e.childNodes[t - 1];
				else {
					for (; e.parentNode != this.contentDOM;) e = e.parentNode;
					n = e.previousSibling;
				}
				for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.previousSibling;
				return n ? this.posBeforeChild(r) + r.size : this.posAtStart;
			}
			{
				let n, r;
				if (e == this.contentDOM) n = e.childNodes[t];
				else {
					for (; e.parentNode != this.contentDOM;) e = e.parentNode;
					n = e.nextSibling;
				}
				for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.nextSibling;
				return n ? this.posBeforeChild(r) : this.posAtEnd;
			}
		}
		let r;
		if (e == this.dom && this.contentDOM) r = t > B(this.contentDOM);
		else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) r = !!(e.compareDocumentPosition(this.contentDOM) & 4);
		else if (this.dom.firstChild) {
			if (t == 0) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !1;
					break;
				}
				if (t.previousSibling) break;
			}
			if (r == null && t == e.childNodes.length) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !0;
					break;
				}
				if (t.nextSibling) break;
			}
		}
		return r ?? n > 0 ? this.posAtEnd : this.posAtStart;
	}
	nearestDesc(e, t = !1) {
		for (let n = !0, r = e; r; r = r.parentNode) {
			let i = this.getDesc(r), a;
			if (i && (!t || i.node)) {
				if (n && (a = i.nodeDOM) && !(V(a) ? Da(a, e) : a == e)) n = !1;
				else return i;
			}
		}
	}
	getDesc(e) {
		let t = e.pmViewDesc;
		for (let e = t; e; e = e.parent) if (e == this) return t;
	}
	posFromDOM(e, t, n) {
		for (let r = e; r; r = r.parentNode) {
			let i = this.getDesc(r);
			if (i) return i.localPosFromDOM(e, t, n);
		}
		return -1;
	}
	descAt(e) {
		for (let t = 0, n = 0; t < this.children.length; t++) {
			let r = this.children[t], i = n + r.size;
			if (n == e && i != n) {
				for (; !r.border && r.children.length;) for (let e = 0; e < r.children.length; e++) {
					let t = r.children[e];
					if (t.size) {
						r = t;
						break;
					}
				}
				return r;
			}
			if (e < i) return r.descAt(e - n - r.border);
			n = i;
		}
	}
	domFromPos(e, t) {
		if (!this.contentDOM) return {
			node: this.dom,
			offset: 0,
			atom: e + 1
		};
		let n = 0, r = 0;
		for (let t = 0; n < this.children.length; n++) {
			let i = this.children[n], a = t + i.size;
			if (a > e) {
				r = e - t;
				break;
			}
			t = a;
		}
		if (r) return this.children[n].domFromPos(r - this.children[n].border, t);
		for (; n > 0; n--) {
			let e = this.children[n - 1];
			if (e.size || !(e instanceof Go || e instanceof zo && e.side >= 0)) break;
		}
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, e && e.dom.parentNode != this.contentDOM; n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? B(e.dom) + 1 : 0
			};
		}
		{
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, e && e.dom.parentNode != this.contentDOM; n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? B(e.dom) : this.contentDOM.childNodes.length
			};
		}
	}
	parseRange(e, t, n = 0) {
		if (this.children.length == 0) return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: 0,
			toOffset: this.contentDOM.childNodes.length
		};
		let r = -1, i = -1;
		for (let a = n, o = 0;; o++) {
			let n = this.children[o], s = a + n.size;
			if (r == -1 && e <= s) {
				let i = a + n.border;
				if (e >= i && t <= s - n.border && n.node && n.contentDOM && this.contentDOM.contains(n.contentDOM)) return n.parseRange(e, t, i);
				e = a;
				for (let t = o; t > 0; t--) {
					let n = this.children[t - 1];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(1)) {
						r = B(n.dom) + 1;
						break;
					}
					e -= n.size;
				}
				r == -1 && (r = 0);
			}
			if (r > -1 && (s > t || o == this.children.length - 1)) {
				t = s;
				for (let e = o + 1; e < this.children.length; e++) {
					let n = this.children[e];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(-1)) {
						i = B(n.dom);
						break;
					}
					t += n.size;
				}
				i == -1 && (i = this.contentDOM.childNodes.length);
				break;
			}
			a = s;
		}
		return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: r,
			toOffset: i
		};
	}
	emptyChildAt(e) {
		if (this.border || !this.contentDOM || !this.children.length) return !1;
		let t = this.children[e < 0 ? 0 : this.children.length - 1];
		return t.size == 0 || t.emptyChildAt(e);
	}
	domAfterPos(e) {
		let { node: t, offset: n } = this.domFromPos(e, 0);
		if (!V(t) || n == t.childNodes.length) throw RangeError("No node after pos " + e);
		return t.childNodes[n];
	}
	setSelection(e, t, n, r = !1) {
		let i = Math.min(e, t), a = Math.max(e, t);
		for (let o = 0, s = 0; o < this.children.length; o++) {
			let c = this.children[o], l = s + c.size;
			if (i > s && a < l) return c.setSelection(e - s - c.border, t - s - c.border, n, r);
			s = l;
		}
		let o = this.domFromPos(e, e ? -1 : 1), s = t == e ? o : this.domFromPos(t, t ? -1 : 1), c = n.root.getSelection(), l = n.domSelectionRange(), u = !1;
		if ((Wa || Ja) && e == t) {
			let { node: e, offset: t } = o;
			if (H(e)) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: B(n) + 1
						});
						break;
					}
					let e = t.pmViewDesc;
					if (e && e.node && e.node.isBlock) break;
				}
			} else {
				let n = e.childNodes[t - 1];
				u = n && (n.nodeName == "BR" || n.contentEditable == "false");
			}
		}
		if (Wa && l.focusNode && l.focusNode != s.node && V(l.focusNode)) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && Ja) && Ca(o.node, o.offset, l.anchorNode, l.anchorOffset) && Ca(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && Wa)) {
			c.collapse(o.node, o.offset);
			try {
				e != t && c.extend(s.node, s.offset), d = !0;
			} catch {}
		}
		if (!d) {
			if (e > t) {
				let e = o;
				o = s, s = e;
			}
			let n = document.createRange();
			n.setEnd(s.node, s.offset), n.setStart(o.node, o.offset), c.removeAllRanges(), c.addRange(n);
		}
	}
	ignoreMutation(e) {
		return !this.contentDOM && e.type != "selection";
	}
	get contentLost() {
		return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
	}
	markDirty(e, t) {
		for (let n = 0, r = 0; r < this.children.length; r++) {
			let i = this.children[r], a = n + i.size;
			if (n == a ? e <= a && t >= n : e < a && t > n) {
				let r = n + i.border, o = a - i.border;
				if (e >= r && t <= o) {
					this.dirty = e == n || t == a ? Io : Fo, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = Lo : i.markDirty(e - r, t - r);
					return;
				}
				i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? Io : Lo;
			}
			n = a;
		}
		this.dirty = Io;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? Io : Fo;
			t.dirty < n && (t.dirty = n);
		}
	}
	get domAtom() {
		return !1;
	}
	get ignoreForCoords() {
		return !1;
	}
	get ignoreForSelection() {
		return !1;
	}
	isText(e) {
		return !1;
	}
}, zo = class extends Ro {
	constructor(e, t, n, r) {
		let i, a = t.type.toDOM;
		if (typeof a == "function" && (a = a(n, () => {
			if (!i) return r;
			if (i.parent) return i.parent.posBeforeChild(i);
		})), !t.type.spec.raw) {
			let e = V(a) ? a : document.createElement("span");
			e != a && e.appendChild(a), e.hasAttribute("contenteditable") || (e.contentEditable = "false"), e.classList.add("ProseMirror-widget");
		}
		super(e, [], a, null), this.widget = t, this.widget = t, i = this;
	}
	matchesWidget(e) {
		return this.dirty == Po && e.type.eq(this.widget.type);
	}
	parseRule() {
		return { ignore: !0 };
	}
	stopEvent(e) {
		let t = this.widget.spec.stopEvent;
		return t ? t(e) : !1;
	}
	ignoreMutation(e) {
		return e.type != "selection" || this.widget.spec.ignoreSelection;
	}
	destroy() {
		this.widget.type.destroy(this.dom), super.destroy();
	}
	get domAtom() {
		return !0;
	}
	get ignoreForSelection() {
		return !!this.widget.type.spec.relaxedSide;
	}
	get side() {
		return this.widget.type.side;
	}
}, Bo = class extends Ro {
	constructor(e, t, n, r) {
		super(e, [], t, null), this.textDOM = n, this.text = r;
	}
	get size() {
		return this.text.length;
	}
	localPosFromDOM(e, t) {
		return e == this.textDOM ? this.posAtStart + t : this.posAtStart + (t ? this.size : 0);
	}
	domFromPos(e) {
		return {
			node: this.textDOM,
			offset: e
		};
	}
	ignoreMutation(e) {
		return e.type === "characterData" && e.target.nodeValue == e.oldValue;
	}
}, Vo = class e extends Ro {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return o && o.dom || (o = zn.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & Lo || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != Lo && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != Po) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = Po;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = ls(a, n, o, r)), t > 0 && (a = ls(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, Ho = class e extends Ro {
	constructor(e, t, n, r, i, a, o) {
		super(e, [], i, a), this.node = t, this.outerDeco = n, this.innerDeco = r, this.nodeDOM = o;
	}
	static create(t, n, r, i, a, o) {
		let s = a.nodeViews[n.type.name], c, l = s && s(n, a, () => {
			if (!c) return o;
			if (c.parent) return c.parent.posBeforeChild(c);
		}, r, i), u = l && l.dom, d = l && l.contentDOM;
		if (n.isText) {
			if (!u) u = document.createTextNode(n.text);
			else if (!H(u)) throw RangeError("Text must be rendered as a DOM text node");
		} else if (!u) {
			let e = zn.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = $o(u, r, n), l ? c = new Ko(t, n, r, i, u, d || null, f, l) : n.isText ? new Wo(t, n, r, i, u, f) : new e(t, n, r, i, u, d || null, f);
	}
	parseRule(e) {
		if (this.node.type.spec.reparseInView) return null;
		let t = {
			node: this.node.type.name,
			attrs: this.node.attrs
		};
		if (this.node.type.whitespace == "pre" && (t.preserveWhitespace = "full"), !this.contentDOM) t.getContent = () => this.node.content;
		else if (!this.contentLost) t.contentElement = this.contentDOM;
		else {
			for (let e = this.children.length - 1; e >= 0; e--) {
				let n = this.children[e];
				if (this.dom.contains(n.dom.parentNode)) {
					t.contentElement = n.dom.parentNode;
					break;
				}
			}
			if (!t.contentElement) {
				let n = e && e.find((t) => V(t) && e.indexOf(t.parentNode) < 0 && this.dom.contains(t));
				n ? t.contentElement = n : t.getContent = () => j.empty;
			}
		}
		return t;
	}
	matchesNode(e, t, n) {
		return this.dirty == Po && e.eq(this.node) && es(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new ns(this, a && a.node, e), c = this.node.inlineContent, l = c && this.node.isBlock;
		as(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? M.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, u, d) => {
			s.syncToMarks(t.marks, n, e, d), l && t.isAtom && !t.isText && s.addHackNode("IMG", s.top);
			let f;
			s.findNodeMatch(t, a, u, d) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (f = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, u, f, e) || s.updateNextNode(t, a, u, e, d, r) || s.addNode(t, a, u, e, r), r += t.nodeSize, c && (l = t.isAtom && !t.isText);
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == Io) && (a && this.protectLocalComposition(e, a), qo(this.contentDOM, this.children, e), Ya && ss(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof I) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = cs(this.node.content, e, n - t, r - t);
			return a < 0 ? null : {
				node: i,
				pos: a,
				text: e
			};
		}
		return {
			node: i,
			pos: -1,
			text: ""
		};
	}
	protectLocalComposition(e, { node: t, pos: n, text: r }) {
		if (this.getDesc(t)) return;
		let i = t;
		for (; i.parentNode != this.contentDOM; i = i.parentNode) {
			for (; i.previousSibling;) i.parentNode.removeChild(i.previousSibling);
			for (; i.nextSibling;) i.parentNode.removeChild(i.nextSibling);
			i.pmViewDesc && (i.pmViewDesc = void 0);
		}
		let a = new Bo(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = ls(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == Lo || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = Po;
	}
	updateOuterDeco(e) {
		if (es(e, this.outerDeco)) return;
		let t = !V(this.nodeDOM), n = this.dom;
		this.dom = Zo(this.dom, this.nodeDOM, Xo(this.outerDeco, this.node, t), Xo(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
	}
	selectNode() {
		V(this.nodeDOM) && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
	}
	deselectNode() {
		V(this.nodeDOM) && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
	}
	get domAtom() {
		return this.node.isAtom;
	}
};
function Uo(e, t, n, r, i) {
	$o(r, t, e);
	let a = new Ho(void 0, e, t, n, r, r, r);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var Wo = class e extends Ho {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i, null, a);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == Lo || this.dirty != Po && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != Po || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = Po, !0);
	}
	inParent() {
		let e = this.parent.contentDOM;
		for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
		return !1;
	}
	domFromPos(e) {
		return {
			node: this.nodeDOM,
			offset: e
		};
	}
	localPosFromDOM(e, t, n) {
		return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, n);
	}
	ignoreMutation(e) {
		return e.type != "characterData" && e.type != "selection";
	}
	slice(t, n, r) {
		let i = this.node.cut(t, n), a = document.createTextNode(i.text);
		return new e(this.parent, i, this.outerDeco, this.innerDeco, a, a);
	}
	markDirty(e, t) {
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Lo);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, Go = class extends Ro {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == Po && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, Ko = class extends Ho {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, t, n, r, i, a, o), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == Lo) return !1;
		if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
			let i = this.spec.update(e, t, n);
			return i && this.updateInner(e, t, n, r), i;
		}
		return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, n, r);
	}
	selectNode() {
		this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
	}
	deselectNode() {
		this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
	}
	setSelection(e, t, n, r) {
		this.spec.setSelection ? this.spec.setSelection(e, t, n.root) : super.setSelection(e, t, n, r);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
	stopEvent(e) {
		return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
};
function qo(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = ts(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof Vo) {
			let t = r ? r.previousSibling : e.lastChild;
			qo(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = ts(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var Jo = function(e) {
	e && (this.nodeName = e);
};
Jo.prototype = Object.create(null);
var Yo = [new Jo()];
function Xo(e, t, n) {
	if (e.length == 0) return Yo;
	let r = n ? Yo[0] : new Jo(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new Jo(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new Jo(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function Zo(e, t, n, r) {
	if (n == Yo && r == Yo) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName || (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = Yo[0]), i = t;
		}
		Qo(i, o || Yo[0], a);
	}
	return i;
}
function Qo(e, t, n) {
	for (let r in t) r != "class" && r != "style" && r != "nodeName" && !(r in n) && e.removeAttribute(r);
	for (let r in n) r != "class" && r != "style" && r != "nodeName" && n[r] != t[r] && e.setAttribute(r, n[r]);
	if (t.class != n.class) {
		let r = t.class ? t.class.split(" ").filter(Boolean) : [], i = n.class ? n.class.split(" ").filter(Boolean) : [];
		for (let t = 0; t < r.length; t++) i.indexOf(r[t]) == -1 && e.classList.remove(r[t]);
		for (let t = 0; t < i.length; t++) r.indexOf(i[t]) == -1 && e.classList.add(i[t]);
		e.classList.length == 0 && e.removeAttribute("class");
	}
	if (t.style != n.style) {
		if (t.style) {
			let n = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, r;
			for (; r = n.exec(t.style);) e.style.removeProperty(r[1]);
		}
		n.style && (e.style.cssText += n.style);
	}
}
function $o(e, t, n) {
	return Zo(e, e, Yo, Xo(t, n, !V(e)));
}
function es(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function ts(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var ns = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = rs(e.node.content, e);
	}
	destroyBetween(e, t) {
		if (e != t) {
			for (let n = e; n < t; n++) this.top.children[n].destroy();
			this.top.children.splice(e, t - e), this.changed = !0;
		}
	}
	destroyRest() {
		this.destroyBetween(this.index, this.top.children.length);
	}
	syncToMarks(e, t, n, r) {
		let i = 0, a = this.stack.length >> 1, o = Math.min(a, e.length);
		for (; i < o && (i == a - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1;) i++;
		for (; i < a;) this.destroyRest(), this.top.dirty = Po, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
		for (; a < e.length;) {
			this.stack.push(this.top, this.index + 1);
			let i = -1, o = this.top.children.length;
			r < this.preMatch.index && (o = Math.min(this.index + 3, o));
			for (let t = this.index; t < o; t++) {
				let n = this.top.children[t];
				if (n.matchesMark(e[a]) && !this.isLocked(n.dom)) {
					i = t;
					break;
				}
			}
			if (i < 0 && this.index < this.top.children.length) {
				let t = this.top.children[this.index];
				t instanceof Vo && t.dirty != Lo && t.mark.type == e[a].type && t.spec.update && !this.isLocked(t.dom) && t.spec.update(e[a]) && (t.mark = e[a], i = this.index, this.changed = !0);
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = Vo.create(this.top, e[a], t, n);
				this.top.children.splice(this.index, 0, r), this.top = r, this.changed = !0;
			}
			this.index = 0, a++;
		}
	}
	findNodeMatch(e, t, n, r) {
		let i = -1, a;
		if (r >= this.preMatch.index && (a = this.preMatch.matches[r - this.preMatch.index]).parent == this.top && a.matchesNode(e, t, n)) i = this.top.children.indexOf(a, this.index);
		else for (let r = this.index, a = Math.min(this.top.children.length, r + 5); r < a; r++) {
			let a = this.top.children[r];
			if (a.matchesNode(e, t, n) && !this.preMatch.matched.has(a)) {
				i = r;
				break;
			}
		}
		return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
	}
	updateNodeAt(e, t, n, r, i) {
		let a = this.top.children[r];
		return a.dirty == Lo && a.dom == a.contentDOM && (a.dirty = Io), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
	}
	findIndexWithChild(e) {
		for (;;) {
			let t = e.parentNode;
			if (!t) return -1;
			if (t == this.top.contentDOM) {
				let t = e.pmViewDesc;
				if (t) {
					for (let e = this.index; e < this.top.children.length; e++) if (this.top.children[e] == t) return e;
				}
				return -1;
			}
			e = t;
		}
	}
	updateNextNode(e, t, n, r, i, a) {
		for (let o = this.index; o < this.top.children.length; o++) {
			let s = this.top.children[o];
			if (s instanceof Ho) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != Lo && es(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = Io, u.updateChildren(r, a + 1), u.dirty = Po), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !es(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = Ho.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = Ho.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new zo(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof Vo;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof Wo) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Ja || Ka) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new Go(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || V(e) && e.contains(this.lock.parentNode));
	}
};
function rs(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof Vo) n = e, r = e.children.length;
			else {
				s = e, r--;
				break;
			}
		} else if (n == t) break outer;
		else r = n.parent.children.indexOf(n), n = n.parent;
		let c = s.node;
		if (c) {
			if (c != e.child(i - 1)) break;
			--i, a.set(s, i), o.push(s);
		}
	}
	return {
		index: i,
		matched: a,
		matches: o.reverse()
	};
}
function is(e, t) {
	return e.type.side - t.type.side;
}
function as(e, t, n, r) {
	let i = t.locals(e), a = 0;
	if (i.length == 0) {
		for (let n = 0; n < e.childCount; n++) {
			let o = e.child(n);
			r(o, i, t.forChild(a, o), n), a += o.nodeSize;
		}
		return;
	}
	let o = 0, s = [], c = null;
	for (let l = 0;;) {
		let u, d;
		for (; o < i.length && i[o].to == a;) {
			let e = i[o++];
			e.widget && (u ? (d ||= [u]).push(e) : u = e);
		}
		if (u) {
			if (d) {
				d.sort(is);
				for (let e = 0; e < d.length; e++) n(d[e], l, !!c);
			} else n(u, l, !!c);
		}
		let f, p;
		if (c) p = -1, f = c, c = null;
		else if (l < e.childCount) p = l, f = e.child(l++);
		else break;
		for (let e = 0; e < s.length; e++) s[e].to <= a && s.splice(e--, 1);
		for (; o < i.length && i[o].from <= a && i[o].to > a;) s.push(i[o++]);
		let m = a + f.nodeSize;
		if (f.isText) {
			let e = m;
			o < i.length && i[o].from < e && (e = i[o].from);
			for (let t = 0; t < s.length; t++) s[t].to < e && (e = s[t].to);
			e < m && (c = f.cut(e - a), f = f.cut(0, e - a), m = e, p = -1);
		} else for (; o < i.length && i[o].to < m;) o++;
		let h = f.isInline && !f.isLeaf ? s.filter((e) => !e.inline) : s.slice();
		r(f, h, t.forChild(a, f), p), a = m;
	}
}
function ss(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function cs(e, t, n, r) {
	for (let i = 0, a = 0; i < e.childCount && a <= r;) {
		let o = e.child(i++), s = a;
		if (a += o.nodeSize, !o.isText) continue;
		let c = o.text;
		for (; i < e.childCount;) {
			let t = e.child(i++);
			if (a += t.nodeSize, !t.isText) break;
			c += t.text;
		}
		if (a >= n) {
			if (a >= r && c.slice(r - t.length - s, r - s) == t) return r - t.length;
			let e = s < r ? c.lastIndexOf(t, r - s - 1) : -1;
			if (e >= 0 && e + t.length + s >= n) return s + e;
			if (n == r && c.length >= r + t.length - s && c.slice(r - s, r - s + t.length) == t) return r;
		}
	}
	return -1;
}
function ls(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i &&= (a.push(i), void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function us(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (Ma(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		if (i && i.node.isAtom && L.isSelectable(i.node) && i.parent && !(i.node.isInline && Aa(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new L(o == e ? s : r.resolve(e));
		} else if (Wa && t == "key" && o > e.state.selection.to && V(n.focusNode) && n.focusOffset == n.focusNode.childNodes.length && i && i.posAtStart > e.state.selection.to) for (let e = n.focusNode;; e = e.parentNode) {
			if (getComputedStyle(e).overflow != "visible") {
				l = F.findFrom(r.resolve(i.posAtStart), 1);
				break;
			}
			if (e == i.dom || e.nextSibling || !e.parentNode || !V(e.parentNode)) break;
		}
	} else {
		if (n instanceof e.dom.ownerDocument.defaultView.Selection && n.rangeCount > 1) {
			let t = o, i = o;
			for (let r = 0; r < n.rangeCount; r++) {
				let a = n.getRangeAt(r);
				t = Math.min(t, e.docView.posFromDOM(a.startContainer, a.startOffset, 1)), i = Math.max(i, e.docView.posFromDOM(a.endContainer, a.endOffset, -1));
			}
			if (t < 0) return null;
			[c, o] = i == e.state.selection.anchor ? [i, t] : [t, i], s = r.resolve(o);
		} else c = e.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
		if (c < 0) return null;
	}
	let u = r.resolve(c);
	if (!l) {
		let n = t == "pointer" || e.state.selection.head < s.pos && !a ? 1 : -1;
		l = xs(e, u, s, n);
	}
	return l;
}
function ds(e) {
	return e.editable ? e.hasFocus() : Cs(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function fs(e, t = !1) {
	let n = e.state.selection;
	if (ys(e, n), !ds(e)) return;
	let r = e.input.mouseDown;
	if (!t && Ka && r) {
		let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
		if (t.anchorNode && n.anchorNode && Ca(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset) && r.delaySelUpdate()) {
			e.domObserver.setCurSelection();
			return;
		}
	}
	if (e.domObserver.disconnectSelection(), e.cursorWrapper) vs(e);
	else {
		let { anchor: r, head: i } = n, a, o;
		ps && !(n instanceof I) && (n.$from.parent.inlineContent || (a = ms(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = ms(e, n.to))), e.docView.setSelection(r, i, e, t), ps && (a && gs(a), o && gs(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && _s(e));
	}
	e.domObserver.setCurSelection(), e.domObserver.connectSelection();
}
var ps = Ja || Ka && qa < 63;
function ms(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (Ja && i && i.contentEditable == "false") return hs(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return hs(i);
		if (a) return hs(a);
	}
}
function hs(e) {
	return e.contentEditable = "true", Ja && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function gs(e) {
	e.contentEditable = "false", e.wasDraggable &&= (e.draggable = !0, null);
}
function _s(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!ds(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function vs(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, B(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && Ha && Ua <= 11 && (n.disabled = !0, n.disabled = !1);
}
function ys(e, t) {
	if (t instanceof L) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (bs(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else bs(e);
}
function bs(e) {
	e.lastSelectedViewDesc &&= (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), void 0);
}
function xs(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || I.between(t, n, r);
}
function Ss(e) {
	return e.editable && !e.hasFocus() ? !1 : Cs(e);
}
function Cs(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return Da(e.dom, t.anchorNode) && (e.editable || Da(e.dom, t.focusNode));
	} catch {
		return !1;
	}
}
function ws(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return Ca(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function Ts(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && F.findFrom(a, t);
}
function Es(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function Ds(e, t, n) {
	let r = e.state.selection;
	if (r instanceof I) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return Es(e, new I(r.$anchor, a));
		}
		if (!r.empty) return !1;
		if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = Ts(e.state, t);
			return n && n instanceof L ? Es(e, n) : !1;
		}
		if (!(Xa && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? L.isSelectable(i) ? Es(e, new L(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : Es(e, new I(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1;
		}
	} else if (r instanceof L && r.node.isInline) return Es(e, new I(t > 0 ? r.$to : r.$from));
	else {
		let n = Ts(e.state, t);
		return n ? Es(e, n) : !1;
	}
}
function Os(e, t) {
	let n = e.pmViewDesc;
	return n ? n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR") : V(e) && e.contentEditable == "false";
}
function ks(e, t) {
	return t < 0 ? As(e) : js(e);
}
function As(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (Wa && V(n) && r < Ea(n) && Os(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (!V(n)) break;
		let e = n.childNodes[r - 1];
		if (Os(e, -1)) i = n, a = --r;
		else if (H(e)) n = e, r = n.nodeValue.length;
		else break;
	} else if (Ms(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && Os(t, -1);) i = n.parentNode, a = B(t), t = t.previousSibling;
		if (t) n = t, r = Ea(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? Fs(e, n, r) : i && Fs(e, i, a);
}
function js(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = Ea(n), a, o;
	for (;;) if (r < i) {
		if (!V(n)) break;
		let e = n.childNodes[r];
		if (Os(e, 1)) a = n, o = ++r;
		else break;
	} else if (Ms(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && Os(t, 1);) a = t.parentNode, o = B(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = Ea(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && Fs(e, a, o);
}
function Ms(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function Ns(e, t) {
	for (; e && t == e.childNodes.length && !ja(e);) t = B(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (H(n)) return n;
		if (V(n) && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function Ps(e, t) {
	for (; e && !t && !ja(e);) t = B(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (H(n)) return n;
		if (V(n) && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function Fs(e, t, n) {
	if (!H(t)) {
		let e, r;
		(r = Ns(t, n)) ? (t = r, n = 0) : (e = Ps(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (Ma(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && fs(e);
	}, 50);
}
function Is(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(Ka || Za) && n.parent.inlineContent) {
		let r = e.coordsAtPos(t);
		if (t > n.start()) {
			let n = e.coordsAtPos(t - 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left < r.left ? "ltr" : "rtl";
		}
		if (t < n.end()) {
			let n = e.coordsAtPos(t + 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left > r.left ? "ltr" : "rtl";
		}
	}
	return getComputedStyle(e.dom).direction == "rtl" ? "rtl" : "ltr";
}
function Ls(e, t, n) {
	let r = e.state.selection;
	if (r instanceof I && !r.empty || n.indexOf("s") > -1 || Xa && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = Ts(e.state, t);
		if (n && n instanceof L) return Es(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof pi ? F.near(n, t) : F.findFrom(n, t);
		return o ? Es(e, o) : !1;
	}
	return !1;
}
function Rs(e, t) {
	if (!(e.state.selection instanceof I)) return !0;
	let { $head: n, $anchor: r, empty: i } = e.state.selection;
	if (!n.sameParent(r)) return !0;
	if (!i) return !1;
	if (e.endOfTextblock(t > 0 ? "forward" : "backward")) return !0;
	let a = !n.textOffset && (t < 0 ? n.nodeBefore : n.nodeAfter);
	if (a && !a.isText) {
		let r = e.state.tr;
		return t < 0 ? r.delete(n.pos - a.nodeSize, n.pos) : r.delete(n.pos, n.pos + a.nodeSize), e.dispatch(r), !0;
	}
	return !1;
}
function zs(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function Bs(e) {
	if (!Ja || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && V(t) && n == 0 && t.firstChild && V(t.firstChild) && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		zs(e, n, "true"), setTimeout(() => zs(e, n, "false"), 20);
	}
	return !1;
}
function Vs(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function Hs(e, t) {
	let n = t.keyCode, r = Vs(t);
	if (n == 8 || Xa && n == 72 && r == "c") return Rs(e, -1) || ks(e, -1);
	if (n == 46 && !t.shiftKey || Xa && n == 68 && r == "c") return Rs(e, 1) || ks(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || Xa && n == 66 && r == "c") {
		let t = n == 37 ? Is(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return Ds(e, t, r) || ks(e, t);
	}
	if (n == 39 || Xa && n == 70 && r == "c") {
		let t = n == 39 ? Is(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return Ds(e, t, r) || ks(e, t);
	}
	return n == 38 || Xa && n == 80 && r == "c" ? Ls(e, -1, r) || ks(e, -1) : n == 40 || Xa && n == 78 && r == "c" ? Bs(e) || Ls(e, 1, r) || ks(e, 1) : !(r != (Xa ? "m" : "c") || n != 66 && n != 73 && n != 89 && n != 90);
}
function Us(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || zn.fromSchema(e.state.schema), s = $s(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && V(l) && (u = Qs[l.nodeName.toLowerCase()]);) {
		for (let e = u.length - 1; e >= 0; e--) {
			let t = s.createElement(u[e]);
			for (; c.firstChild;) t.appendChild(c.firstChild);
			c.appendChild(t), d++;
		}
		l = c.firstChild;
	}
	return l && V(l) && l.setAttribute("data-pm-slice", `${i} ${a}${d ? ` -${d}` : ""} ${JSON.stringify(n)}`), {
		dom: c,
		text: e.someProp("clipboardTextSerializer", (n) => n(t, e)) || t.content.textBetween(0, t.content.size, "\n\n"),
		slice: t
	};
}
function Ws(e, t, n, r, i) {
	let a = i.parent.type.spec.code, o, s;
	if (!n && !t) return null;
	let c = !!t && (r || a || !n);
	if (c) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, a || r, e);
		}), a) return s = new N(j.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			s = t(s, e, !0);
		}), s;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) s = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = zn.fromSchema(r);
			o = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = o.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), o = nc(n), $a && rc(o);
	let l = o && o.querySelector("[data-pm-slice]"), u = l && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(l.getAttribute("data-pm-slice") || "");
	if (u && u[3]) for (let e = +u[3]; e > 0; e--) {
		let e = o.firstChild;
		for (; e && !V(e);) e = e.nextSibling;
		if (!e) break;
		o = e;
	}
	if (s ||= (e.someProp("clipboardParser") || e.someProp("domParser") || Tn.fromSchema(e.state.schema)).parseSlice(o, {
		preserveWhitespace: !!(c || u),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !Gs.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	}), u) s = ic(Zs(s, +u[1], +u[2]), u[4]);
	else if (s = N.maxOpen(Ks(s.content, i), !0), s.openStart || s.openEnd) {
		let e = 0, t = 0;
		for (let t = s.content.firstChild; e < s.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = s.content.lastChild; t < s.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		s = Zs(s, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		s = t(s, e, c);
	}), s;
}
var Gs = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Ks(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, a = [];
		if (e.forEach((e) => {
			if (!a) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return a = null;
			if (n = a.length && i.length && Js(t, i, e, a[a.length - 1], 0)) a[a.length - 1] = n;
			else {
				a.length && (a[a.length - 1] = Ys(a[a.length - 1], i.length));
				let n = qs(e, t);
				a.push(n), r = r.matchType(n.type), i = t;
			}
		}), a) return j.from(a);
	}
	return e;
}
function qs(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, j.from(e));
	return e;
}
function Js(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let a = Js(e, t, n, r.lastChild, i + 1);
		if (a) return r.copy(r.content.replaceChild(r.childCount - 1, a));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(j.from(qs(n, e, i + 1))));
	}
}
function Ys(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, Ys(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(j.empty, !0);
	return e.copy(n.append(r));
}
function Xs(e, t, n, r, i, a) {
	let o = t < 0 ? e.firstChild : e.lastChild, s = o.content;
	return e.childCount > 1 && (a = 0), i < r - 1 && (s = Xs(s, t, n, r, i + 1, a)), i >= n && (s = t < 0 ? o.contentMatchAt(0).fillBefore(s, a <= i).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(j.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, o.copy(s));
}
function Zs(e, t, n) {
	return t < e.openStart && (e = new N(Xs(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new N(Xs(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var Qs = {
	thead: ["table"],
	tbody: ["table"],
	tfoot: ["table"],
	caption: ["table"],
	colgroup: ["table"],
	col: ["table", "colgroup"],
	tr: ["table", "tbody"],
	td: [
		"table",
		"tbody",
		"tr"
	],
	th: [
		"table",
		"tbody",
		"tr"
	]
};
function $s() {
	return document.implementation.createHTMLDocument("title");
}
var ec = null;
function tc(e) {
	let t = window.trustedTypes;
	if (!t) return e;
	if (!ec) {
		if (ec = t.defaultPolicy) try {
			return ec.createHTML(e);
		} catch {}
		ec = t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e });
	}
	return ec.createHTML(e);
}
function nc(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = $s(), r = n.body, i = /<([a-z][^>\s]+)/i.exec(e), a;
	if ((a = i && Qs[i[1].toLowerCase()]) && (e = a.map((e) => "<" + e + ">").join("") + e + a.map((e) => "</" + e + ">").reverse().join("")), r.innerHTML = tc(e), a) for (let e = 0; e < a.length; e++) r = r.querySelector(a[e]) || r;
	for (let e = 0; e < n.styleSheets.length; e++) {
		let t = n.styleSheets[e];
		for (let e = 0; e < t.rules.length; e++) {
			let n = t.rules[e];
			if (n instanceof CSSStyleRule) {
				let e = r.querySelectorAll(n.selectorText);
				for (let t = 0; t < e.length; t++) e[t].style.cssText += n.style.cssText;
			}
		}
	}
	return r;
}
function rc(e) {
	let t = e.querySelectorAll(Ka ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function ic(e, t) {
	if (!e.size) return e;
	let n = e.content.firstChild.type.schema, r;
	try {
		r = JSON.parse(t);
	} catch {
		return e;
	}
	let { content: i, openStart: a, openEnd: o } = e;
	for (let e = r.length - 2; e >= 0; e -= 2) {
		let t = n.nodes[r[e]];
		if (!t || t.hasRequiredAttrs()) break;
		try {
			i = j.from(t.create(r[e + 1], i));
		} catch {
			break;
		}
		a++, o++;
	}
	return new N(i, a, o);
}
var ac = {}, oc = {}, sc = {
	touchstart: !0,
	touchmove: !0
}, cc = class {
	constructor() {
		this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = {
			time: 0,
			x: 0,
			y: 0,
			type: "",
			button: 0
		}, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = Object.create(null), this.hideSelectionGuard = null;
	}
};
function lc(e) {
	for (let t in ac) {
		let n = ac[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			mc(e, t) && !pc(e, t) && (e.editable || !(t.type in oc)) && n(e, t);
		}, sc[t] ? { passive: !0 } : void 0);
	}
	Ja && e.dom.addEventListener("input", () => null), fc(e);
}
function uc(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function dc(e) {
	e.input.mouseDown && e.input.mouseDown.done(), e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function fc(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => pc(e, t));
	});
}
function pc(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function mc(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function hc(e, t) {
	!pc(e, t) && ac[t.type] && (e.editable || !(t.type in oc)) && ac[t.type](e, t);
}
oc.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Mc(e) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(Qa && Ka && n.keyCode == 13))) {
		if (n.keyCode != 229 && e.domObserver.forceFlush(), Ya && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
			let t = Date.now();
			e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
				e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, Na(13, "Enter"))), e.input.lastIOSEnter = 0);
			}, 200);
		} else e.someProp("handleKeyDown", (t) => t(e, n)) || Hs(e, n) ? n.preventDefault() : uc(e, "key");
	}
}, oc.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, oc.keypress = (e, t) => {
	let n = t;
	if (Mc(e) || !n.charCode || n.ctrlKey && !n.altKey || Xa && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof I) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function gc(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function _c(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function vc(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function yc(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	r.setMeta("pointer", !0), e.dispatch(r);
}
function bc(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && L.isSelectable(r) ? (yc(e, new L(n)), !0) : !1;
}
function xc(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof L && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (L.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i != null && (yc(e, L.create(e.state.doc, i)), !0);
}
function Sc(e, t, n, r, i) {
	return vc(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? xc(e, n) : bc(e, n));
}
function Cc(e, t, n, r) {
	return vc(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function wc(e, t, n, r) {
	return vc(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || Tc(e, n, r);
}
function Tc(e, t, n) {
	if (n.button != 0) return !1;
	let r = Ec(e, t, !0), i = e.state.doc;
	return r ? (yc(e, r), r instanceof I && i.eq(e.state.doc) && (e.input.mouseDown = new jc(e, r)), !0) : !1;
}
function Ec(e, t, n) {
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? I.create(r, 0, r.content.size) : null;
	let i = r.resolve(t);
	for (let e = i.depth + 1; e > 0; e--) {
		let t = e > i.depth ? i.nodeAfter : i.node(e), a = i.before(e);
		if (t.inlineContent) return I.create(r, a + 1, a + 1 + t.content.size);
		if (n && L.isSelectable(t)) return L.create(r, a);
	}
	return null;
}
function Dc(e) {
	return Rc(e);
}
var Oc = Xa ? "metaKey" : "ctrlKey";
ac.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = Dc(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && _c(n, e.input.lastClick) && !n[Oc] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	}, e.input.mouseDown && e.input.mouseDown.done();
	let o = e.posAtCoords(gc(n));
	o && (a == "singleClick" ? e.input.mouseDown = new Ac(e, o, n, !!r) : (a == "doubleClick" ? Cc : wc)(e, o.pos, o.inside, n) ? n.preventDefault() : uc(e, "pointer"));
};
var kc = class {
	constructor(e) {
		this.view = e, this.mightDrag = null, e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this));
	}
	up(e) {
		this.done();
	}
	move(e) {
		e.buttons == 0 && this.done();
	}
	done() {
		this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.view.input.mouseDown == this && (this.view.input.mouseDown = null);
	}
	delaySelUpdate() {
		return !1;
	}
}, Ac = class extends kc {
	constructor(e, t, n, r) {
		super(e), this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!n[Oc], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && V(s.nodeDOM) ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof L && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !(!this.target || this.target.draggable),
			setUneditable: !!(this.target && Wa && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), uc(e, "pointer");
	}
	done() {
		super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
			this.view.isDestroyed || fs(this.view);
		});
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(gc(e))), this.updateAllowDefault(e), this.allowDefault || !t ? uc(this.view, "pointer") : Sc(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || Ja && this.mightDrag && !this.mightDrag.node.isAtom || Ka && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (yc(this.view, F.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : uc(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), uc(this.view, "pointer"), super.move(e);
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
	delaySelUpdate() {
		return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
	}
}, jc = class extends kc {
	constructor(e, t) {
		super(e), this.startSelection = t, this.startDoc = e.state.doc;
	}
	move(e) {
		if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
			this.done();
			return;
		}
		e.preventDefault(), uc(this.view, "pointer");
		let t = this.view.posAtCoords(gc(e)), n = t && Ec(this.view, t.inside, !1);
		if (!n) return;
		let { doc: r } = this.view.state, i = this.startSelection, [a, o] = n.from < i.from ? [i.to, n.from] : [i.from, n.to];
		yc(this.view, I.create(r, a, o));
	}
};
ac.touchstart = (e) => {
	e.input.lastTouch = Date.now(), Dc(e), uc(e, "pointer");
}, ac.touchmove = (e) => {
	e.input.lastTouch = Date.now(), uc(e, "pointer");
}, ac.contextmenu = (e) => Dc(e);
function Mc(e, t) {
	return e.composing ? !0 : Ja && Math.abs(Date.now() - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var Nc = Qa ? 5e3 : -1;
oc.compositionstart = oc.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof I && t.selection.empty && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || Ka && Za && Pc(e))) e.markCursor = e.state.storedMarks || n.marks(), Rc(e, !0), e.markCursor = null;
		else if (Rc(e, !t.selection.empty), Wa && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
			let t = e.domSelectionRange();
			for (let n = t.focusNode, r = t.focusOffset; n && V(n) && r != 0;) {
				let t = r < 0 ? n.lastChild : n.childNodes[r - 1];
				if (!t) break;
				if (H(t)) {
					let n = e.domSelection();
					n && n.collapse(t, t.nodeValue.length);
					break;
				}
				n = t, r = -1;
			}
		}
		e.input.composing = !0;
	}
	Fc(e, Nc);
};
function Pc(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || !V(t) || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return V(r) && r.contentEditable == "false";
}
oc.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now(), e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, Fc(e, 20));
};
function Fc(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => Rc(e), t));
}
function Ic(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function Lc(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = Oa(t.focusNode, t.focusOffset), r = ka(t.focusNode, t.focusOffset);
	if (n && r && n != r) {
		let t = r.pmViewDesc, i = e.domObserver.lastChangedTextNode;
		if (n == i || r == i) return i;
		if (!t || !t.isText(r.nodeValue)) return r;
		if (e.input.compositionNode == r) {
			let e = n.pmViewDesc;
			if (e && e.isText(n.nodeValue)) return r;
		}
	}
	return n || r;
}
function Rc(e, t = !1) {
	if (!(Qa && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), Ic(e), t || e.docView && e.docView.dirty) {
			let n = us(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function zc(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var Bc = Ha && Ua < 15 || Ya && eo < 604;
ac.copy = oc.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = Bc ? null : n.clipboardData, { dom: o, text: s } = Us(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : zc(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Vc(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function Hc(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? Uc(e, r.value, null, i, t) : Uc(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function Uc(e, t, n, r, i) {
	let a = Ws(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || N.empty))) return !0;
	if (!a) return !1;
	let o = Vc(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Wc(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
oc.paste = (e, t) => {
	let n = t;
	if (e.composing && !Qa) return;
	let r = Bc ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && Uc(e, Wc(r), r.getData("text/html"), i, n) ? n.preventDefault() : Hc(e, n);
};
var Gc = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, Kc = Xa ? "altKey" : "ctrlKey";
function qc(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n ||= e(t);
	}), n == null ? !t[Kc] : !n;
}
ac.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(gc(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof L ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = L.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && V(n.target)) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = L.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = Us(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !Ka || qa > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(Bc ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Bc || n.dataTransfer.setData("text/plain", c), e.dragging = new Gc(l, qc(e, n), o);
}, ac.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, oc.dragover = oc.dragenter = (e, t) => t.preventDefault(), oc.drop = (e, t) => {
	try {
		Jc(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function Jc(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(gc(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = Ws(e, Wc(t.dataTransfer), Bc ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && qc(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || N.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? Br(e.state.doc, i.pos, a) : i.pos;
	s ??= i.pos;
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, d = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(d)) return;
	let f = c.doc.resolve(l);
	if (u && L.isSelectable(a.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new L(f));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(xs(e, f, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
ac.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && fs(e);
	}, 20));
}, ac.blur = (e, t) => {
	let n = t;
	e.focused &&= (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), !1);
}, ac.beforeinput = (e, t) => {
	if (Qa && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, Na(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in oc) ac[e] = oc[e];
function Yc(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var Xc = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || tl, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new $c(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && Yc(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, Zc = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || tl;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new $c(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Yc(this.attrs, t.attrs) && Yc(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, Qc = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || tl;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new $c(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && Yc(this.attrs, t.attrs) && Yc(this.spec, t.spec);
	}
	destroy() {}
}, $c = class e {
	constructor(e, t, n) {
		this.from = e, this.to = t, this.type = n;
	}
	copy(t, n) {
		return new e(t, n, this.type);
	}
	eq(e, t = 0) {
		return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
	}
	map(e, t, n) {
		return this.type.map(e, this, t, n);
	}
	static widget(t, n, r) {
		return new e(t, t, new Xc(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new Zc(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new Qc(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof Zc;
	}
	get widget() {
		return this.type instanceof Xc;
	}
}, el = [], tl = {}, U = class e {
	constructor(e, t) {
		this.local = e.length ? e : el, this.children = t.length ? t : el;
	}
	static create(e, t) {
		return t.length ? ll(t, e, 0, tl) : nl;
	}
	find(e, t, n) {
		let r = [];
		return this.findInner(e ?? 0, t ?? 1e9, r, 0, n), r;
	}
	findInner(e, t, n, r, i) {
		for (let a = 0; a < this.local.length; a++) {
			let o = this.local[a];
			o.from <= t && o.to >= e && (!i || i(o.spec)) && n.push(o.copy(o.from + r, o.to + r));
		}
		for (let a = 0; a < this.children.length; a += 3) if (this.children[a] < t && this.children[a + 1] > e) {
			let o = this.children[a] + 1;
			this.children[a + 2].findInner(e - o, t - o, n, r + o, i);
		}
	}
	map(e, t, n) {
		return this == nl || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || tl);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o ||= []).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? il(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(ul), el) : nl;
	}
	add(t, n) {
		return n.length ? this == nl ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = sl(n, e, o)) {
				for (i ||= this.children.slice(); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, ll(s, e, o + 1, tl)), a += 3;
			}
		});
		let o = al(a ? cl(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(ul) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == nl ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i ||= []).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == nl ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : nl;
	}
	forChild(t, n) {
		if (this == nl) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof Zc) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i ||= []).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(ul), el);
			return r ? new rl([t, r]) : t;
		}
		return r || nl;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return dl(this.localsInner(e));
	}
	localsInner(e) {
		if (this == nl) return el;
		if (e.inlineContent || !this.local.some(Zc.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof Zc || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
U.empty = new U([], []), U.removeOverlap = dl;
var nl = U.empty, rl = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, tl));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return U.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != nl && (a instanceof e ? r = r.concat(a.members) : r.push(a));
		}
		return e.from(r);
	}
	eq(t) {
		if (!(t instanceof e) || t.members.length != this.members.length) return !1;
		for (let e = 0; e < this.members.length; e++) if (!this.members[e].eq(t.members[e])) return !1;
		return !0;
	}
	locals(e) {
		let t, n = !0;
		for (let r = 0; r < this.members.length; r++) {
			let i = this.members[r].localsInner(e);
			if (i.length) {
				if (!t) t = i;
				else {
					n &&= (t = t.slice(), !1);
					for (let e = 0; e < i.length; e++) t.push(i[e]);
				}
			}
		}
		return t ? dl(n ? t : t.sort(ul)) : el;
	}
	static from(t) {
		switch (t.length) {
			case 0: return nl;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof U) ? t : t.reduce((e, t) => e.concat(t instanceof U ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function il(e, t, n, r, i, a, o) {
	let s = e.slice();
	for (let e = 0, t = a; e < n.maps.length; e++) {
		let r = 0;
		n.maps[e].forEach((e, n, i, a) => {
			let o = a - i - (n - e);
			for (let i = 0; i < s.length; i += 3) {
				let a = s[i + 1];
				if (a < 0 || e > a + t - r) continue;
				let c = s[i] + t - r;
				n >= c ? s[i + 1] = e <= c ? -2 : -1 : e >= t && o && (s[i] += o, s[i + 1] += o);
			}
			r += o;
		}), t = n.maps[e].map(t, -1);
	}
	let c = !1;
	for (let t = 0; t < s.length; t += 3) if (s[t + 1] < 0) {
		if (s[t + 1] == -2) {
			c = !0, s[t + 1] = -1;
			continue;
		}
		let l = n.map(e[t] + a), u = l - i;
		if (u < 0 || u >= r.content.size) {
			c = !0;
			continue;
		}
		let d = n.map(e[t + 1] + a, -1) - i, { index: f, offset: p } = r.content.findIndex(u), m = r.maybeChild(f);
		if (m && p == u && p + m.nodeSize == d) {
			let r = s[t + 2].mapInner(n, m, l + 1, e[t] + a + 1, o);
			r == nl ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = ll(ol(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new U(t.sort(ul), s);
}
function al(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new $c(i.from + t, i.to + t, i.type));
	}
	return n;
}
function ol(e, t, n, r, i, a, o) {
	function s(e, t) {
		for (let a = 0; a < e.local.length; a++) {
			let s = e.local[a].map(r, i, t);
			s ? n.push(s) : o.onRemove && o.onRemove(e.local[a].spec);
		}
		for (let n = 0; n < e.children.length; n += 3) s(e.children[n + 2], e.children[n] + t + 1);
	}
	for (let n = 0; n < e.length; n += 3) e[n + 1] == -1 && s(e[n + 2], t[n] + a + 1);
	return n;
}
function sl(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i ||= []).push(a), e[t] = null);
	return i;
}
function cl(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function ll(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = sl(e, t, o + n);
		if (s) {
			a = !0;
			let e = ll(s, t, n + o + 1, r);
			e != nl && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = al(a ? cl(e) : e, -n).sort(ul);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new U(o, i) : nl;
}
function ul(e, t) {
	return e.from - t.from || e.to - t.to;
}
function dl(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), fl(t, i + 1, a.copy(r.to, a.to)));
			else {
				a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), fl(t, i, r.copy(a.from, r.to)));
				break;
			}
		}
	}
	return t;
}
function fl(e, t, n) {
	for (; t < e.length && ul(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function pl(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != nl && t.push(r);
	}), e.cursorWrapper && t.push(U.create(e.state.doc, [e.cursorWrapper.deco])), rl.from(t);
}
var ml = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, hl = Ha && Ua <= 11, gl = class {
	constructor() {
		this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
	}
	set(e) {
		this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
	}
	clear() {
		this.anchorNode = this.focusNode = null;
	}
	eq(e) {
		return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
	}
}, _l = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new gl(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			Ha && Ua <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : Ja && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), hl && (this.onCharData = (e) => {
			this.queue.push({
				target: e.target,
				type: "characterData",
				oldValue: e.prevValue
			}), this.flushSoon();
		}), this.onSelectionChange = this.onSelectionChange.bind(this);
	}
	flushSoon() {
		this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
			this.flushingSoon = -1, this.flush();
		}, 20));
	}
	forceFlush() {
		this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
	}
	start() {
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, ml)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
	}
	stop() {
		if (this.observer) {
			let e = this.observer.takeRecords();
			if (e.length) {
				for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
				window.setTimeout(() => this.flush(), 20);
			}
			this.observer.disconnect();
		}
		this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
	}
	connectSelection() {
		this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
	}
	disconnectSelection() {
		this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
	}
	suppressSelectionUpdates() {
		this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
	}
	onSelectionChange() {
		if (Ss(this.view)) {
			if (this.suppressingSelectionUpdates) return fs(this.view);
			if (Ha && Ua <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && Ca(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
			}
			this.flush();
		}
	}
	setCurSelection() {
		this.currentSelection.set(this.view.domSelectionRange());
	}
	ignoreSelectionChange(e) {
		if (!e.focusNode) return !0;
		let t = /* @__PURE__ */ new Set(), n;
		for (let n = e.focusNode; n; n = ya(n)) t.add(n);
		for (let r = e.anchorNode; r; r = ya(r)) if (t.has(r)) {
			n = r;
			break;
		}
		let r = n && this.view.docView.nearestDesc(n);
		if (r && r.ignoreMutation({
			type: "selection",
			target: H(n) ? n.parentNode : n
		})) return this.setCurSelection(), !0;
	}
	pendingRecords() {
		if (this.observer) for (let e of this.observer.takeRecords()) this.queue.push(e);
		return this.queue;
	}
	flush() {
		let { view: e } = this;
		if (!e.docView || this.flushingSoon > -1) return;
		let t = this.pendingRecords();
		t.length && (this.queue = []);
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && Ss(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || Ka && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((e) => e.type == "childList" && e.removedNodes.length))) {
			for (let e of s) if (e.nodeName == "BR" && e.parentNode) {
				let t = e.nextSibling;
				for (; t && V(t);) {
					if (t.contentEditable == "false") {
						e.parentNode.removeChild(e);
						break;
					}
					t = t.firstChild;
				}
			}
		} else if (Wa && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || Cl(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ma(n) && (c = us(e)) && c.eq(F.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, fs(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), bl(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, wl(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || fs(e), this.currentSelection.set(n));
	}
	registerMutation(e, t) {
		if (t.indexOf(e.target) > -1) return null;
		let n = this.view.docView.nearestDesc(e.target);
		if (e.type == "attributes" && (n == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !n || n.ignoreMutation(e)) return null;
		if (e.type == "childList") {
			for (let n = 0; n < e.addedNodes.length; n++) {
				let r = e.addedNodes[n];
				t.push(r), H(r) && (this.lastChangedTextNode = r);
			}
			if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(e.target)) return {
				from: n.posBefore,
				to: n.posAfter
			};
			let r = e.previousSibling, i = e.nextSibling;
			if (Ha && Ua <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? B(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? B(i) : e.target.childNodes.length;
			return {
				from: o,
				to: n.localPosFromDOM(e.target, s, 1)
			};
		}
		return e.type == "attributes" ? {
			from: n.posAtStart - n.border,
			to: n.posAtEnd + n.border
		} : (this.lastChangedTextNode = e.target, {
			from: n.posAtStart,
			to: n.posAtEnd,
			typeOver: e.target.nodeValue == e.oldValue
		});
	}
}, vl = /* @__PURE__ */ new WeakMap(), yl = !1;
function bl(e) {
	if (!vl.has(e) && (vl.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = Wa, yl) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), yl = !0;
	}
}
function xl(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return Ca(o.node, o.offset, i, a) && ([n, r, i, a] = [
		i,
		a,
		n,
		r
	]), {
		anchorNode: n,
		anchorOffset: r,
		focusNode: i,
		focusOffset: a
	};
}
function Sl(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return xl(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? xl(e, n) : null;
}
function Cl(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function wl(e, t) {
	let { focusNode: n, focusOffset: r } = e.domSelectionRange();
	for (let i of t) if (i.parentNode?.nodeName == "TR") {
		let t = i.nextSibling;
		for (; t && t.nodeName != "TD" && t.nodeName != "TH";) t = t.nextSibling;
		if (t) {
			let a = t;
			for (;;) {
				let e = a.firstChild;
				if (!e || !V(e) || e.contentEditable == "false" || /^(BR|IMG)$/.test(e.nodeName)) break;
				a = e;
			}
			a.insertBefore(i, a.firstChild), n == i && e.domSelection().collapse(i, r);
		} else i.parentNode.removeChild(i);
	}
}
function Tl(e, t, n, r) {
	let { node: i, fromOffset: a, toOffset: o, from: s, to: c } = e.docView.parseRange(t, n), l = e.domSelectionRange(), u, d = l.anchorNode;
	if (d && Da(e.dom, d) && (u = [{
		node: d,
		offset: l.anchorOffset
	}], Ma(l) || u.push({
		node: l.focusNode,
		offset: l.focusOffset
	})), Ka && e.input.lastKeyCode === 8) for (let e = o; e > a; e--) {
		let t = i.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			o = e;
			break;
		}
		if (!n || n.size) break;
	}
	let f = e.state.doc, p = e.someProp("domParser") || Tn.fromSchema(e.state.schema), m = f.resolve(s), h = null, g = p.parse(i, {
		topNode: m.parent,
		topMatch: m.parent.contentMatchAt(m.index()),
		topOpen: !0,
		from: a,
		to: o,
		preserveWhitespace: m.parent.type.whitespace != "pre" || "full",
		findPositions: u,
		ruleFromNode: El(r),
		context: m
	});
	if (u && u[0].pos != null) {
		let e = u[0].pos, t = u[1] && u[1].pos;
		t ??= e, h = {
			anchor: e + s,
			head: t + s
		};
	}
	return {
		doc: g,
		sel: h,
		from: s,
		to: c
	};
}
var El = (e) => (t) => {
	let n = t.pmViewDesc;
	if (n) return n.parseRule(e);
	if (t.nodeName == "BR" && t.parentNode) {
		if (Ja && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		}
		if (t.parentNode.lastChild == t || Ja && /^(tr|table)$/i.test(t.parentNode.nodeName)) return { ignore: !0 };
	} else if (t.nodeName == "IMG" && t.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}, Dl = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Ol(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = us(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (Ka && Qa && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, Na(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = Tl(e, t, n, i), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = Pl(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (Ya && e.input.lastIOSEnter > Date.now() - 225 || Qa) && i.some((e) => V(e) && !Dl.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, Na(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) {
		if (r && c instanceof I && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
			start: c.from,
			endA: c.to,
			endB: c.to
		};
		else {
			if (l.sel) {
				let t = kl(e, e.state.doc, l.sel);
				if (t && !t.eq(e.state.selection)) {
					let n = e.state.tr.setSelection(t);
					a && n.setMeta("composition", a), e.dispatch(n);
				}
			}
			return;
		}
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof I && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), Ha && Ua <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), _ = u.resolve(m.start), v = h.sameParent(g) && h.parent.inlineContent && _.end() >= m.endA;
	if ((Ya && e.input.lastIOSEnter > Date.now() - 225 && (!v || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !v && Ml(l.doc, h.pos, g.pos)) && e.someProp("handleKeyDown", (t) => t(e, Na(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && jl(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, Na(8, "Backspace")))) {
		Qa && Ka && e.domObserver.suppressSelectionUpdates();
		return;
	}
	Ka && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), Qa && !v && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, Na(13, "Enter"));
		});
	}, 20));
	let y = m.start, b = m.endA, x = (t) => {
		let n = t || e.state.tr.replace(y, b, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = kl(e, n.doc, l.sel);
			t && !(Ka && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == y || t.head == n.mapping.map(b) - 1) || Ha && t.empty && t.head == y) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, S;
	if (v) {
		if (h.pos == g.pos) {
			Ha && Ua <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => fs(e), 20));
			let t = x(e.state.tr.delete(y, b)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
			n && t.ensureMarks(n), e.dispatch(t);
		} else if (m.endA == m.endB && (S = Al(h.parent.content.cut(h.parentOffset, g.parentOffset), _.parent.content.cut(_.parentOffset, m.endA - _.start())))) {
			let t = x(e.state.tr);
			S.type == "add" ? t.addMark(y, b, S.mark) : t.removeMark(y, b, S.mark), e.dispatch(t);
		} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
			let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => x(e.state.tr.insertText(t, y, b));
			e.someProp("handleTextInput", (r) => r(e, y, b, t, n)) || e.dispatch(n());
		} else e.dispatch(x());
	} else e.dispatch(x());
}
function kl(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : xs(e, t.resolve(n.anchor), t.resolve(n.head));
}
function Al(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, a = r, o, s, c;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) a = n[e].removeFromSet(a);
	if (i.length == 1 && a.length == 0) s = i[0], o = "add", c = (e) => e.mark(s.addToSet(e.marks));
	else if (i.length == 0 && a.length == 1) s = a[0], o = "remove", c = (e) => e.mark(s.removeFromSet(e.marks));
	else return null;
	let l = [];
	for (let e = 0; e < t.childCount; e++) l.push(c(t.child(e)));
	if (j.from(l).eq(e)) return {
		mark: s,
		type: o
	};
}
function jl(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || Nl(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(Nl(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || Nl(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Ml(e, t, n) {
	let r = 0, i = 0;
	return e.nodesBetween(t, n, (e, a) => {
		e.isTextblock && a >= t && a < n ? r++ : (e.isText ? /\S/.test(e.text.slice(Math.max(0, t - a), Math.min(e.nodeSize, n - a))) : e.isLeaf) && i++;
	}), i == 0 && r == 1;
}
function Nl(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function Pl(e, t, n, r, i) {
	let a = e.findDiffStart(t, n), o = n + e.size, s = n + t.size;
	if (a == null) return null;
	let { a: c, b: l } = e.findDiffEnd(t, o, s);
	if (i == "end") {
		let e = Math.max(0, a - Math.min(c, l));
		r -= c + e - a;
	}
	if (c < a && o < s) {
		let e = r <= a && r >= c ? a - r : 0;
		a -= e, l = a + (l - c), c = a;
	} else if (l < a) {
		let e = r <= a && r >= l ? a - r : 0;
		a -= e, c = a + (c - l), l = a;
	}
	return {
		start: a,
		endA: c,
		endB: l
	};
}
var Fl = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new cc(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Hl), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Rl(this), Ll(this), this.nodeViews = Bl(this), this.docView = Uo(this.state.doc, Il(this), pl(this), this.dom, this), this.domObserver = new _l(this, (e, t, n, r) => Ol(this, e, t, n, r)), this.domObserver.start(), lc(this), this.updatePluginViews();
	}
	get composing() {
		return this.input.composing;
	}
	get props() {
		if (this._props.state != this.state) {
			let e = this._props;
			this._props = {};
			for (let t in e) this._props[t] = e[t];
			this._props.state = this.state;
		}
		return this._props;
	}
	update(e) {
		e.handleDOMEvents != this._props.handleDOMEvents && fc(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(Hl), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
	}
	setProps(e) {
		let t = {};
		for (let e in this._props) t[e] = this._props[e];
		t.state = this.state;
		for (let n in e) t[n] = e[n];
		this.update(t);
	}
	updateState(e) {
		this.updateStateInner(e, this._props);
	}
	updateStateInner(e, t) {
		let n = this.state, r = !1, i = !1;
		e.storedMarks && this.composing && (Ic(this), i = !0), this.state = e;
		let a = n.plugins != e.plugins || this._props.plugins != t.plugins;
		if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = Bl(this);
			Vl(e, this.nodeViews) && (this.nodeViews = e, r = !0);
		}
		(a || t.handleDOMEvents != this._props.handleDOMEvents) && fc(this), this.editable = Rl(this), Ll(this);
		let o = pl(this), s = Il(this), c = n.plugins != e.plugins && !n.doc.eq(e.doc) ? "reset" : e.scrollToSelection > n.scrollToSelection ? "to selection" : "preserve", l = r || !this.docView.matchesNode(e.doc, s, o);
		(l || !e.selection.eq(n.selection)) && (i = !0);
		let u = c == "preserve" && i && this.dom.style.overflowAnchor == null && ao(this);
		if (i) {
			this.domObserver.stop();
			let t = l && (Ha || Ka) && !this.composing && !n.selection.empty && !e.selection.empty && zl(n.selection, e.selection);
			if (l) {
				let n = Ka ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = Lc(this)), (r || !this.docView.update(e.doc, s, o, this)) && (this.docView.updateOuterDeco(s), this.docView.destroy(), this.docView = Uo(e.doc, s, o, this.dom, this)), !n || this.trackWrites && this.dom.contains(this.trackWrites) || (t = !0);
			}
			let i = this.input.mouseDown;
			t || !(i && this.domObserver.currentSelection.eq(this.domSelectionRange()) && ws(this) && i.delaySelUpdate()) ? fs(this, t) : (ys(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(n), this.dragging?.node && !n.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, n), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : u && so(u);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (e && Da(this.dom, e) && !this.someProp("handleScrollToSelection", (e) => e(this))) {
			if (this.state.selection instanceof L) {
				let t = this.docView.domAfterPos(this.state.selection.from);
				V(t) && io(this, t.getBoundingClientRect(), e);
			} else io(this, this.coordsAtPos(this.state.selection.head, 1), e);
		}
	}
	destroyPluginViews() {
		let e;
		for (; e = this.pluginViews.pop();) e.destroy && e.destroy();
	}
	updatePluginViews(e) {
		if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
			this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
			for (let e = 0; e < this.directPlugins.length; e++) {
				let t = this.directPlugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
			for (let e = 0; e < this.state.plugins.length; e++) {
				let t = this.state.plugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
		} else for (let t = 0; t < this.pluginViews.length; t++) {
			let n = this.pluginViews[t];
			n.update && n.update(this, e);
		}
	}
	updateDraggedNode(e, t) {
		let n = e.node, r = -1;
		if (n.from < this.state.doc.content.size && this.state.doc.nodeAt(n.from) == n.node) r = n.from;
		else {
			let e = n.from + (this.state.doc.content.size - t.doc.content.size);
			(e > 0 && e < this.state.doc.content.size && this.state.doc.nodeAt(e)) == n.node && (r = e);
		}
		this.dragging = new Gc(e.slice, e.move, r < 0 ? void 0 : L.create(this.state.doc, r));
	}
	someProp(e, t) {
		let n = this._props && this._props[e], r;
		if (n != null && (r = t ? t(n) : n)) return r;
		for (let n = 0; n < this.directPlugins.length; n++) {
			let i = this.directPlugins[n].props[e];
			if (i != null && (r = t ? t(i) : i)) return r;
		}
		let i = this.state.plugins;
		if (i) for (let n = 0; n < i.length; n++) {
			let a = i[n].props[e];
			if (a != null && (r = t ? t(a) : a)) return r;
		}
	}
	hasFocus() {
		if (Ha) {
			let e = this.root.activeElement;
			if (e == this.dom) return !0;
			if (!e || !this.dom.contains(e)) return !1;
			for (; e && this.dom != e && this.dom.contains(e);) {
				if (e.contentEditable == "false") return !1;
				e = e.parentElement;
			}
			return !0;
		}
		return this.root.activeElement == this.dom;
	}
	focus() {
		this.domObserver.stop(), this.editable && uo(this.dom), fs(this), this.domObserver.start();
	}
	get root() {
		let e = this._root;
		if (e == null) {
			for (let e = this.dom.parentNode; e; e = e.parentNode) if (e.nodeType == 9 || e.nodeType == 11 && e.host) return e.getSelection || (Object.getPrototypeOf(e).getSelection = () => e.ownerDocument.getSelection()), this._root = e;
		}
		return e || document;
	}
	updateRoot() {
		this._root = null;
	}
	posAtCoords(e) {
		return yo(this, e);
	}
	coordsAtPos(e, t = 1) {
		return Co(this, e, t);
	}
	domAtPos(e, t = 0) {
		return this.docView.domFromPos(e, t);
	}
	nodeDOM(e) {
		let t = this.docView.descAt(e);
		return t ? t.nodeDOM : null;
	}
	posAtDOM(e, t, n = -1) {
		let r = this.docView.posFromDOM(e, t, n);
		if (r == null) throw RangeError("DOM position not inside the editor");
		return r;
	}
	endOfTextblock(e, t) {
		return No(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return Uc(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return Uc(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return Us(this, e);
	}
	destroy() {
		this.docView && (dc(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], pl(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Sa());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return hc(this, e);
	}
	domSelectionRange() {
		let e = this.dom.isConnected !== !1 && this.domSelection();
		return e ? Ja && this.root.nodeType === 11 && Pa(this.dom.ownerDocument) == this.dom && Sl(this, e) || e : {
			focusNode: null,
			focusOffset: 0,
			anchorNode: null,
			anchorOffset: 0
		};
	}
	domSelection() {
		return this.root.getSelection();
	}
};
Fl.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function Il(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate ||= "no", [$c.node(0, e.state.doc.content.size, t)];
}
function Ll(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: $c.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function Rl(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function zl(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function Bl(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function Vl(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function Hl(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
for (var Ul = {
	8: "Backspace",
	9: "Tab",
	10: "Enter",
	12: "NumLock",
	13: "Enter",
	16: "Shift",
	17: "Control",
	18: "Alt",
	20: "CapsLock",
	27: "Escape",
	32: " ",
	33: "PageUp",
	34: "PageDown",
	35: "End",
	36: "Home",
	37: "ArrowLeft",
	38: "ArrowUp",
	39: "ArrowRight",
	40: "ArrowDown",
	44: "PrintScreen",
	45: "Insert",
	46: "Delete",
	59: ";",
	61: "=",
	91: "Meta",
	92: "Meta",
	106: "*",
	107: "+",
	108: ",",
	109: "-",
	110: ".",
	111: "/",
	144: "NumLock",
	145: "ScrollLock",
	160: "Shift",
	161: "Shift",
	162: "Control",
	163: "Control",
	164: "Alt",
	165: "Alt",
	173: "-",
	186: ";",
	187: "=",
	188: ",",
	189: "-",
	190: ".",
	191: "/",
	192: "`",
	219: "[",
	220: "\\",
	221: "]",
	222: "'"
}, Wl = {
	48: ")",
	49: "!",
	50: "@",
	51: "#",
	52: "$",
	53: "%",
	54: "^",
	55: "&",
	56: "*",
	57: "(",
	59: ":",
	61: "+",
	173: "_",
	186: ":",
	187: "+",
	188: "<",
	189: "_",
	190: ">",
	191: "?",
	192: "~",
	219: "{",
	220: "|",
	221: "}",
	222: "\""
}, Gl = typeof navigator < "u" && /Mac/.test(navigator.platform), Kl = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), ql = 0; ql < 10; ql++) Ul[48 + ql] = Ul[96 + ql] = String(ql);
for (var ql = 1; ql <= 24; ql++) Ul[ql + 111] = "F" + ql;
for (var ql = 65; ql <= 90; ql++) Ul[ql] = String.fromCharCode(ql + 32), Wl[ql] = String.fromCharCode(ql);
for (var Jl in Ul) Wl.hasOwnProperty(Jl) || (Wl[Jl] = Ul[Jl]);
function Yl(e) {
	var t = !(Gl && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || Kl && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? Wl : Ul)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-keymap/dist/index.js
var Xl = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Zl = typeof navigator < "u" && /Win/.test(navigator.platform);
function Ql(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) Xl ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function $l(e) {
	let t = Object.create(null);
	for (let n in e) t[Ql(n)] = e[n];
	return t;
}
function eu(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function tu(e) {
	return new R({ props: { handleKeyDown: nu(e) } });
}
function nu(e) {
	let t = $l(e);
	return function(e, n) {
		let r = Yl(n), i, a = t[eu(r, n)];
		if (a && a(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[eu(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(Zl && n.ctrlKey && n.altKey) && (i = Ul[n.keyCode]) && i != r) {
				let r = t[eu(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rope-sequence/dist/index.js
var ru = 200, W = function() {};
W.prototype.append = function(e) {
	return e.length ? (e = W.from(e), !this.length && e || e.length < ru && this.leafAppend(e) || this.length < ru && e.leafPrepend(this) || this.appendInner(e)) : this;
}, W.prototype.prepend = function(e) {
	return e.length ? W.from(e).append(this) : this;
}, W.prototype.appendInner = function(e) {
	return new au(this, e);
}, W.prototype.slice = function(e, t) {
	return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? W.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
}, W.prototype.get = function(e) {
	if (!(e < 0 || e >= this.length)) return this.getInner(e);
}, W.prototype.forEach = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length), t <= n ? this.forEachInner(e, t, n, 0) : this.forEachInvertedInner(e, t, n, 0);
}, W.prototype.map = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length);
	var r = [];
	return this.forEach(function(t, n) {
		return r.push(e(t, n));
	}, t, n), r;
}, W.from = function(e) {
	return e instanceof W ? e : e && e.length ? new iu(e) : W.empty;
};
var iu = /* @__PURE__ */ function(e) {
	function t(t) {
		e.call(this), this.values = t;
	}
	e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
	var n = {
		length: { configurable: !0 },
		depth: { configurable: !0 }
	};
	return t.prototype.flatten = function() {
		return this.values;
	}, t.prototype.sliceInner = function(e, n) {
		return e == 0 && n == this.length ? this : new t(this.values.slice(e, n));
	}, t.prototype.getInner = function(e) {
		return this.values[e];
	}, t.prototype.forEachInner = function(e, t, n, r) {
		for (var i = t; i < n; i++) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		for (var i = t - 1; i >= n; i--) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.leafAppend = function(e) {
		if (this.length + e.length <= ru) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= ru) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(W);
W.empty = new iu([]);
var au = /* @__PURE__ */ function(e) {
	function t(t, n) {
		e.call(this), this.left = t, this.right = n, this.length = t.length + n.length, this.depth = Math.max(t.depth, n.depth) + 1;
	}
	return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.flatten = function() {
		return this.left.flatten().concat(this.right.flatten());
	}, t.prototype.getInner = function(e) {
		return e < this.left.length ? this.left.get(e) : this.right.get(e - this.left.length);
	}, t.prototype.forEachInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t < i && this.left.forEachInner(e, t, Math.min(n, i), r) === !1 || n > i && this.right.forEachInner(e, Math.max(t - i, 0), Math.min(this.length, n) - i, r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t > i && this.right.forEachInvertedInner(e, t - i, Math.max(n, i) - i, r + i) === !1 || n < i && this.left.forEachInvertedInner(e, Math.min(t, i), n, r) === !1) return !1;
	}, t.prototype.sliceInner = function(e, t) {
		if (e == 0 && t == this.length) return this;
		var n = this.left.length;
		return t <= n ? this.left.slice(e, t) : e >= n ? this.right.slice(e - n, t - n) : this.left.slice(e, n).append(this.right.slice(0, t - n));
	}, t.prototype.leafAppend = function(e) {
		var n = this.right.leafAppend(e);
		if (n) return new t(this.left, n);
	}, t.prototype.leafPrepend = function(e) {
		var n = this.left.leafPrepend(e);
		if (n) return new t(n, this.right);
	}, t.prototype.appendInner = function(e) {
		return this.left.depth >= Math.max(this.right.depth, e.depth) + 1 ? new t(this.left, new t(this.right, e)) : new t(this, e);
	}, t;
}(W), ou = 500, su = class e {
	constructor(e, t) {
		this.items = e, this.eventCount = t;
	}
	popEvent(t, n) {
		if (this.eventCount == 0) return null;
		let r = this.items.length;
		for (;; r--) if (this.items.get(r - 1).selection) {
			--r;
			break;
		}
		let i, a;
		n && (i = this.remapping(r, this.items.length), a = i.maps.length);
		let o = t.tr, s, c, l = [], u = [];
		return this.items.forEach((t, n) => {
			if (!t.step) i || (i = this.remapping(r, n + 1), a = i.maps.length), a--, u.push(t);
			else {
				if (i) {
					u.push(new lu(t.map));
					let e = t.step.map(i.slice(a)), n;
					e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new lu(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
				} else o.maybeStep(t.step);
				if (t.selection) return s = i ? t.selection.map(i.slice(a)) : t.selection, c = new e(this.items.slice(0, r).append(u.reverse().concat(l)), this.eventCount - 1), !1;
			}
		}, this.items.length, 0), {
			remaining: c,
			transform: o,
			selection: s
		};
	}
	addTransform(t, n, r, i) {
		let a = [], o = this.eventCount, s = this.items, c = !i && s.length ? s.get(s.length - 1) : null;
		for (let e = 0; e < t.steps.length; e++) {
			let r = t.steps[e].invert(t.docs[e]), l = new lu(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n &&= (o++, void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > du && (s = cu(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new rr();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new lu(e))), this.eventCount);
	}
	rebased(t, n) {
		if (!this.eventCount) return this;
		n = Math.min(this.items.length, n);
		let r = [], i = this.items.length - n, a = t.mapping, o = t.steps.length, s = this.eventCount;
		this.items.forEach((e) => {
			e.selection && s--;
		}, i);
		let c = n;
		this.items.forEach((e) => {
			let n = a.getMirror(--c);
			if (n == null) return;
			o = Math.min(o, n);
			let i = a.maps[n];
			if (e.step) {
				let o = t.steps[n].invert(t.docs[n]), l = e.selection && e.selection.map(a.slice(c + 1, n));
				l && s++, r.push(new lu(i, o, l));
			} else r.push(new lu(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new lu(a.maps[e]));
		let u = this.items.slice(0, i).append(l).append(r), d = new e(u, s);
		return d.emptyItemCount() > ou && (d = d.compress(this.items.length - r.length)), d;
	}
	emptyItemCount() {
		let e = 0;
		return this.items.forEach((t) => {
			t.step || e++;
		}), e;
	}
	compress(t = this.items.length) {
		let n = this.remapping(0, t), r = n.maps.length, i = [], a = 0;
		return this.items.forEach((e, o) => {
			if (o >= t) i.push(e), e.selection && a++;
			else if (e.step) {
				let t = e.step.map(n.slice(r)), o = t && t.getMap();
				if (r--, o && n.appendMap(o, r), t) {
					let s = e.selection && e.selection.map(n.slice(r));
					s && a++;
					let c = new lu(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(W.from(i.reverse()), a);
	}
};
su.empty = new su(W.empty, 0);
function cu(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var lu = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, uu = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, du = 20;
function fu(e, t, n, r) {
	let i = n.getMeta(xu), a;
	if (i) return i.historyState;
	n.getMeta(Su) && (e = new uu(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(xu)) return o.getMeta(xu).redo ? new uu(e.done.addTransform(n, void 0, r, yu(t)), e.undone, mu(n.mapping.maps), e.prevTime, e.prevComposition) : new uu(e.done, e.undone.addTransform(n, void 0, r, yu(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !pu(n, e.prevRanges)), s = o ? hu(e.prevRanges, n.mapping) : mu(n.mapping.maps);
		return new uu(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, yu(t)), su.empty, s, n.time, i ?? e.prevComposition);
	}
	return (a = n.getMeta("rebased")) ? new uu(e.done.rebased(n, a), e.undone.rebased(n, a), hu(e.prevRanges, n.mapping), e.prevTime, e.prevComposition) : new uu(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), hu(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function pu(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function mu(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function hu(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function gu(e, t, n) {
	let r = yu(t), i = xu.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new uu(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(xu, {
		redo: n,
		historyState: c
	});
}
var _u = !1, vu = null;
function yu(e) {
	let t = e.plugins;
	if (vu != t) {
		_u = !1, vu = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			_u = !0;
			break;
		}
	}
	return _u;
}
function bu(e) {
	return e.setMeta(Su, !0);
}
var xu = new z("history"), Su = new z("closeHistory");
function Cu(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new R({
		key: xu,
		state: {
			init() {
				return new uu(su.empty, su.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return fu(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? Tu : n == "historyRedo" ? Eu : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function wu(e, t) {
	return (n, r) => {
		let i = xu.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = gu(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var Tu = wu(!1, !0), Eu = wu(!0, !0);
function Du(e) {
	return e.getMeta(xu) != null;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/core/dist/index.js
function Ou(e) {
	let { state: t, transaction: n } = e, { selection: r } = n, { doc: i } = n, { storedMarks: a } = n;
	return {
		...t,
		apply: t.apply.bind(t),
		applyTransaction: t.applyTransaction.bind(t),
		plugins: t.plugins,
		schema: t.schema,
		reconfigure: t.reconfigure.bind(t),
		toJSON: t.toJSON.bind(t),
		get storedMarks() {
			return a;
		},
		get selection() {
			return r;
		},
		get doc() {
			return i;
		},
		get tr() {
			return r = n.selection, i = n.doc, a = n.storedMarks, n;
		}
	};
}
var ku = class e {
	constructor(e) {
		this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
	}
	get hasCustomState() {
		return !!this.customState;
	}
	get state() {
		return this.customState || this.editor.state;
	}
	get commands() {
		let { rawCommands: e, editor: t, state: n } = this, { view: r } = t, { tr: i } = n, a = this.buildProps(i);
		return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, (...e) => {
			let n = t(...e)(a);
			return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), n;
		}]));
	}
	get chain() {
		return () => this.createChain();
	}
	get can() {
		return () => this.createCan();
	}
	createChain(e, t = !0) {
		let { rawCommands: n, editor: r, state: i } = this, { view: a } = r, o = [], s = !!e, c = e || i.tr, l = () => (!s && t && !c.getMeta("preventDispatch") && !this.hasCustomState && a.dispatch(c), o.every((e) => e === !0)), u = {
			...Object.fromEntries(Object.entries(n).map(([e, n]) => [e, (...e) => {
				let r = this.buildProps(c, t), i = n(...e)(r);
				return o.push(i), u;
			}])),
			run: l
		};
		return u;
	}
	static createFakeChain() {
		let e = new Proxy({}, { get: (t, n) => {
			if (n !== "then") return n === "run" ? () => !1 : () => e;
		} });
		return e;
	}
	createCan(e) {
		let { rawCommands: t, state: n } = this, r = e || n.tr, i = this.buildProps(r, !1);
		return {
			...Object.fromEntries(Object.entries(t).map(([e, t]) => [e, (...e) => t(...e)({
				...i,
				dispatch: void 0
			})])),
			chain: () => this.createChain(r, !1)
		};
	}
	static createFallbackCan() {
		let t = e.createFakeChain();
		return new Proxy({ chain: () => t }, { get: (e, t) => {
			if (t !== "then") return t === "chain" ? e.chain : () => !1;
		} });
	}
	buildProps(e, t = !0) {
		let { rawCommands: n, editor: r, state: i } = this, { view: a } = r, o = {
			tr: e,
			editor: r,
			view: a,
			state: Ou({
				state: i,
				transaction: e
			}),
			dispatch: t ? () => void 0 : void 0,
			chain: () => this.createChain(e, t),
			can: () => this.createCan(e),
			get commands() {
				return Object.fromEntries(Object.entries(n).map(([e, t]) => [e, (...e) => t(...e)(o)]));
			}
		};
		return o;
	}
}, Au = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
	if (!e.isDestroyed) {
		var n;
		t.dom.blur(), (n = window) == null || (n = n.getSelection()) == null || n.removeAllRanges();
	}
}), !0), ju = (e = !0) => ({ commands: t }) => t.setContent("", { emitUpdate: e }), Mu = () => ({ state: e, tr: t, dispatch: n }) => {
	let { selection: r } = t, { ranges: i } = r;
	return n && i.forEach(({ $from: n, $to: r }) => {
		e.doc.nodesBetween(n.pos, r.pos, (e, n) => {
			if (e.type.isText) return;
			let { doc: r, mapping: i } = t, a = r.resolve(i.map(n)), o = r.resolve(i.map(n + e.nodeSize)), s = a.blockRange(o);
			if (!s) return;
			let c = br(s);
			if (e.type.isTextblock) {
				let { defaultType: e } = a.parent.contentMatchAt(a.index());
				t.setNodeMarkup(s.start, e);
			}
			(c || c === 0) && t.lift(s, c);
		});
	}), !0;
}, Nu = (e) => (t) => e(t), Pu = () => ({ state: e, dispatch: t }) => Ji(e, t), Fu = (e, t) => ({ editor: n, tr: r }) => {
	let { state: i } = n, a = i.doc.slice(e.from, e.to);
	r.deleteRange(e.from, e.to);
	let o = r.mapping.map(t);
	return r.insert(o, a.content), r.setSelection(new I(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, Iu = () => ({ tr: e, dispatch: t }) => {
	let { selection: n } = e, r = n.$anchor.node();
	if (r.content.size > 0) return !1;
	let i = e.selection.$anchor;
	for (let n = i.depth; n > 0; --n) if (i.node(n).type === r.type) {
		if (t) {
			let t = i.before(n), r = i.after(n);
			e.delete(t, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
};
function G(e, t) {
	if (typeof e == "string") {
		if (!t.nodes[e]) throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);
		return t.nodes[e];
	}
	return e;
}
var Lu = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let i = G(e, n.schema), a = t.selection.$anchor;
	for (let e = a.depth; e > 0; --e) if (a.node(e).type === i) {
		if (r) {
			let n = a.before(e), r = a.after(e);
			t.delete(n, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
}, Ru = (e) => ({ tr: t, dispatch: n }) => {
	let { from: r, to: i } = e;
	return n && t.delete(r, i), !0;
}, zu = (e) => e.content ? /^text(\*|\+)/.test(e.content) : !1, Bu = (e, t, n) => {
	if (!e.parent.isInline || n === "left" && e.pos > e.start() || n === "right" && e.pos < e.end()) return e.pos;
	let r = t.nodes[e.parent.type.name].spec;
	return zu(r) ? n === "left" ? e.start() - 1 : e.end() + 1 : e.pos;
}, Vu = (e, t, n) => ({
	from: Bu(e, n, "left"),
	to: Bu(t, n, "right")
}), Hu = () => ({ state: e, dispatch: t }) => {
	if (e.selection.empty) return !1;
	if (t) {
		let n = e.tr, { ranges: r } = e.selection, i = n.steps.length;
		r.forEach((t) => {
			let r = n.mapping.slice(i), { from: a, to: o } = Vu(n.doc.resolve(r.map(t.$from.pos)), n.doc.resolve(r.map(t.$to.pos)), e.schema);
			n.deleteRange(a, o);
		}), n.selection.empty || n.setSelection(I.near(n.doc.resolve(n.selection.from))), n.scrollIntoView(), t(n);
	}
	return !0;
}, Uu = () => ({ commands: e }) => e.keyboardShortcut("Enter"), Wu = () => ({ state: e, dispatch: t }) => qi(e, t);
function Gu(e) {
	return Object.prototype.toString.call(e) === "[object RegExp]";
}
function Ku(e, t, n = { strict: !0 }) {
	let r = Object.keys(t);
	return !r.length || r.every((r) => n.strict ? t[r] === e[r] : Gu(t[r]) ? t[r].test(e[r]) : t[r] === e[r]);
}
function qu(e, t, n = {}) {
	return e.find((e) => e.type === t && Ku(Object.fromEntries(Object.keys(n).map((t) => [t, e.attrs[t]])), n));
}
function Ju(e, t, n = {}) {
	return !!qu(e, t, n);
}
function Yu(e, t, n) {
	if (!e || !t) return;
	let r = e.parent.childAfter(e.parentOffset);
	if (r.node && r.node.marks.some((e) => e.type === t) || (r = e.parent.childBefore(e.parentOffset)), !r.node || !r.node.marks.some((e) => e.type === t)) return;
	if (!n) {
		let e = r.node.marks.find((e) => e.type === t);
		e && (n = e.attrs);
	}
	if (!qu([...r.node.marks], t, n)) return;
	let i = r.index, a = e.start() + r.offset, o = i + 1, s = a + r.node.nodeSize;
	for (; i > 0 && Ju([...e.parent.child(i - 1).marks], t, n);) --i, a -= e.parent.child(i).nodeSize;
	for (; o < e.parent.childCount && Ju([...e.parent.child(o).marks], t, n);) s += e.parent.child(o).nodeSize, o += 1;
	return {
		from: a,
		to: s
	};
}
function Xu(e, t) {
	if (typeof e == "string") {
		if (!t.marks[e]) throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
		return t.marks[e];
	}
	return e;
}
var Zu = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = Xu(e, r.schema), { doc: o, selection: s } = n, { $from: c, from: l, to: u } = s;
	if (i) {
		let e = Yu(c, a, t);
		if (e && e.from <= l && e.to >= u) {
			let t = I.create(o, e.from, e.to);
			n.setSelection(t);
		}
	}
	return !0;
}, Qu = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	for (let e = 0; e < n.length; e += 1) if (n[e](t)) return !0;
	return !1;
};
function $u(e) {
	return e instanceof I;
}
function ed(e = 0, t = 0, n = 0) {
	return Math.min(Math.max(e, t), n);
}
function td(e, t = null) {
	if (!t) return null;
	let n = F.atStart(e), r = F.atEnd(e);
	if (t === "start" || t === !0) return n;
	if (t === "end") return r;
	let i = n.from, a = r.to;
	return t === "all" ? I.create(e, ed(0, i, a), ed(e.content.size, i, a)) : I.create(e, ed(t, i, a), ed(t, i, a));
}
function nd() {
	return ["Android"].includes(navigator.platform) || /android/i.test(navigator.userAgent);
}
function rd() {
	return [
		"iPad Simulator",
		"iPhone Simulator",
		"iPod Simulator",
		"iPad",
		"iPhone",
		"iPod"
	].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function id() {
	return typeof navigator < "u" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
var ad = (e = null, t = {}) => ({ editor: n, view: r, tr: i, dispatch: a }) => {
	t = {
		scrollIntoView: !0,
		...t
	};
	let o = () => {
		(rd() || nd()) && r.dom.focus(), id() && !rd() && !nd() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
			n.isDestroyed || (r.focus(), t?.scrollIntoView && n.commands.scrollIntoView());
		});
	};
	try {
		if (r.hasFocus() && e === null || e === !1) return !0;
	} catch {
		return !1;
	}
	if (a && e === null && !$u(n.state.selection)) return o(), !0;
	let s = td(i.doc, e) || n.state.selection, c = n.state.selection.eq(s);
	return a && (c || i.setSelection(s), c && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, od = (e, t) => (n) => e.every((e, r) => t(e, {
	...n,
	index: r
})), sd = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({
	from: n.selection.from,
	to: n.selection.to
}, e, t), cd = (e) => {
	let t = e.childNodes;
	for (let n = t.length - 1; n >= 0; --n) {
		let r = t[n];
		r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && cd(r);
	}
	return e;
};
function ld(e) {
	if (typeof window > "u") throw Error("[tiptap error]: there is no window object available, so this function cannot be used");
	let t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
	return cd(n);
}
function ud(e) {
	return typeof e?.nodesBetween == "function";
}
function dd(e, t, n) {
	if (ud(e)) return e;
	let r = typeof e == "object" && !!e;
	n = {
		slice: !0,
		parseOptions: {},
		...n
	};
	let i = typeof e == "string";
	if (r) try {
		if (Array.isArray(e) && e.length > 0) return j.fromArray(e.map((e) => t.nodeFromJSON(e)));
		let r = t.nodeFromJSON(e);
		return n.errorOnInvalidContent && r.check(), r;
	} catch (r) {
		if (n.errorOnInvalidContent) throw Error("[tiptap error]: Invalid JSON content", { cause: r });
		return console.warn("[tiptap warn]: Invalid content.", "Passed value:", e, "Error:", r), dd("", t, n);
	}
	if (i) {
		if (n.errorOnInvalidContent) {
			let r = !1, i = "", a = new xn({
				topNode: t.spec.topNode,
				marks: t.spec.marks,
				nodes: t.spec.nodes.append({ __tiptap__private__unknown__catch__all__node: {
					content: "inline*",
					group: "block",
					parseDOM: [{
						tag: "*",
						getAttrs: (e) => (r = !0, i = typeof e == "string" ? e : e.outerHTML, null)
					}]
				} })
			});
			if (n.slice ? Tn.fromSchema(a).parseSlice(ld(e), n.parseOptions) : Tn.fromSchema(a).parse(ld(e), n.parseOptions), n.errorOnInvalidContent && r) throw Error("[tiptap error]: Invalid HTML content", { cause: /* @__PURE__ */ Error(`Invalid element found: ${i}`) });
		}
		let r = Tn.fromSchema(t);
		return n.slice ? r.parseSlice(ld(e), n.parseOptions).content : r.parse(ld(e), n.parseOptions);
	}
	return dd("", t, n);
}
function fd(e) {
	return !("type" in e);
}
function pd(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof pr || i instanceof mr)) return;
	let a = e.mapping.maps[r], o = 0;
	a.forEach((e, t, n, r) => {
		o === 0 && (o = r);
	}), e.setSelection(F.near(e.doc.resolve(o), n));
}
var md = (e, t, n) => ({ tr: r, dispatch: i, editor: a }) => {
	if (i) {
		n = {
			parseOptions: a.options.parseOptions,
			updateSelection: !0,
			applyInputRules: !1,
			applyPasteRules: !1,
			...n
		};
		let i, o = (e) => {
			a.emit("contentError", {
				editor: a,
				error: e,
				disableCollaboration: () => {
					"collaboration" in a.storage && typeof a.storage.collaboration == "object" && a.storage.collaboration && (a.storage.collaboration.isDisabled = !0);
				}
			});
		}, s = {
			preserveWhitespace: "full",
			...n.parseOptions
		};
		if (!n.errorOnInvalidContent && !a.options.enableContentCheck && a.options.emitContentError) try {
			dd(t, a.schema, {
				parseOptions: s,
				errorOnInvalidContent: !0
			});
		} catch (e) {
			o(e);
		}
		try {
			i = dd(t, a.schema, {
				parseOptions: s,
				errorOnInvalidContent: n.errorOnInvalidContent ?? a.options.enableContentCheck
			});
		} catch (e) {
			return o(e), !1;
		}
		let { from: c, to: l } = typeof e == "number" ? {
			from: e,
			to: e
		} : {
			from: e.from,
			to: e.to
		}, u = !0, d = !0, f = fd(i) ? i.content : [i];
		if (f.forEach((e) => {
			e.check(), u = u ? e.isText && e.marks.length === 0 : !1, d = d ? e.isBlock : !1;
		}), c === l && d) {
			let { parent: e } = r.doc.resolve(c);
			e.isTextblock && !e.type.spec.code && !e.childCount && (--c, l += 1);
		}
		let p;
		if (u) p = Array.isArray(t) ? t.map((e) => e.text || "").join("") : ud(t) ? f.map((e) => e.text ?? "").join("") : typeof t == "object" && t && t.text ? t.text : t, r.insertText(p, c, l);
		else {
			p = j.from(f);
			let e = r.doc.resolve(c), t = e.node(), n = e.parentOffset === 0, i = t.isText || t.isTextblock, a = t.content.size > 0;
			n && i && a && d && (c = Math.max(0, c - 1)), r.replaceWith(c, l, f);
		}
		n.updateSelection && pd(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", {
			from: c,
			text: p
		}), n.applyPasteRules && r.setMeta("applyPasteRules", {
			from: c,
			text: p
		});
	}
	return !0;
};
function hd(e) {
	for (let t = 0; t < e.edgeCount; t += 1) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var gd = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
	let { pos: i, attrs: a, content: o, updateSelection: s = !0 } = e, c;
	c = typeof i == "number" ? t.doc.resolve(i) : i || t.selection.$from;
	let l = hd(c.parent.contentMatchAt(c.index()));
	if (!l) return !1;
	let u = Object.keys(l.spec.attrs || {}), d = a ? Object.fromEntries(Object.entries(a).filter(([e]) => u.includes(e))) : {}, f;
	if (o) {
		let e = dd(o, r.schema);
		f = l.createAndFill(d, e);
	} else f = l.createAndFill(d);
	return f ? (n && (t.insert(c.pos, f), s && pd(t, t.steps.length - 1, -1)), !0) : !1;
}, _d = () => ({ state: e, dispatch: t }) => Hi(e, t), vd = () => ({ state: e, dispatch: t }) => Ui(e, t), yd = () => ({ state: e, dispatch: t }) => ji(e, t), bd = () => ({ state: e, dispatch: t }) => zi(e, t), xd = (e, t) => {
	let n = e.resolve(t), r = n.nodeBefore, i = n.nodeAfter;
	return !r || !i ? !1 : !r.type.spec.isolating && !i.type.spec.isolating;
}, Sd = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = Lr(e.doc, e.selection.$from.pos, -1);
		return r == null || !xd(e.doc, r) ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, Cd = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = Lr(e.doc, e.selection.$from.pos, 1);
		return r == null || !xd(e.doc, r) ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, wd = () => ({ state: e, dispatch: t }) => Mi(e, t), Td = () => ({ state: e, dispatch: t }) => Ni(e, t);
function Ed() {
	return typeof navigator < "u" && /Mac/.test(navigator.platform);
}
function Dd(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n === "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e += 1) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) rd() || Ed() ? o = !0 : i = !0;
		else throw Error(`Unrecognized modifier name: ${n}`);
	}
	return r && (n = `Alt-${n}`), i && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), a && (n = `Shift-${n}`), n;
}
var Od = (e) => ({ editor: t, view: n, tr: r, dispatch: i }) => {
	let a = Dd(e).split(/-(?!$)/), o = a.find((e) => ![
		"Alt",
		"Ctrl",
		"Meta",
		"Shift"
	].includes(e)), s = new KeyboardEvent("keydown", {
		key: o === "Space" ? " " : o,
		altKey: a.includes("Alt"),
		ctrlKey: a.includes("Ctrl"),
		metaKey: a.includes("Meta"),
		shiftKey: a.includes("Shift"),
		bubbles: !0,
		cancelable: !0
	});
	return t.captureTransaction(() => {
		n.someProp("handleKeyDown", (e) => e(n, s));
	})?.steps.forEach((e) => {
		let t = e.map(r.mapping);
		t && i && r.maybeStep(t);
	}), !0;
};
function kd(e, t, n = {}) {
	let { from: r, to: i, empty: a } = e.selection, o = t ? G(t, e.schema) : null, s = [];
	e.doc.nodesBetween(r, i, (e, t) => {
		if (e.isText) return;
		let n = Math.max(r, t), a = Math.min(i, t + e.nodeSize);
		s.push({
			node: e,
			from: n,
			to: a
		});
	});
	let c = i - r, l = s.filter((e) => !o || o.name === e.node.type.name).filter((e) => Ku(e.node.attrs, n, { strict: !1 }));
	return a ? !!l.length : l.reduce((e, t) => e + t.to - t.from, 0) >= c;
}
var Ad = (e, t = {}) => ({ state: n, dispatch: r }) => kd(n, G(e, n.schema), t) ? Wi(n, r) : !1, jd = () => ({ state: e, dispatch: t }) => Yi(e, t), Md = (e) => ({ state: t, dispatch: n }) => ha(G(e, t.schema))(t, n), Nd = () => ({ state: e, dispatch: t }) => Gi(e, t);
function Pd(e, t) {
	return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function Fd(e, t) {
	let n = typeof t == "string" ? [t] : t;
	return Object.keys(e).reduce((t, r) => (n.includes(r) || (t[r] = e[r]), t), {});
}
var Id = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Pd(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = G(e, r.schema)), s === "mark" && (o = Xu(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		r.doc.nodesBetween(e.$from.pos, e.$to.pos, (e, r) => {
			a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, Fd(e.attrs, t))), o && e.marks.length && e.marks.forEach((a) => {
				o === a.type && (c = !0, i && n.addMark(r, r + e.nodeSize, o.create(Fd(a.attrs, t))));
			});
		});
	}), c;
}, Ld = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), Rd = () => ({ tr: e, dispatch: t }) => {
	if (t) {
		let t = new pi(e.doc);
		e.setSelection(t);
	}
	return !0;
}, zd = () => ({ state: e, dispatch: t }) => Ii(e, t), Bd = () => ({ state: e, dispatch: t }) => Bi(e, t), Vd = () => ({ state: e, dispatch: t }) => Qi(e, t), Hd = () => ({ state: e, dispatch: t }) => ia(e, t), Ud = () => ({ state: e, dispatch: t }) => ra(e, t);
function Wd(e, t, n = {}, r = {}) {
	return dd(e, t, {
		slice: !1,
		parseOptions: n,
		errorOnInvalidContent: r.errorOnInvalidContent
	});
}
var Gd = (e, { errorOnInvalidContent: t, emitUpdate: n = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: a, dispatch: o, commands: s }) => {
	let { doc: c } = a;
	if (r.preserveWhitespace !== "full") {
		let s = Wd(e, i.schema, r, { errorOnInvalidContent: t ?? i.options.enableContentCheck });
		if (o) {
			let e = fd(s) ? s.content : [s];
			a.replaceWith(0, c.content.size, e).setMeta("preventUpdate", !n);
		}
		return !0;
	}
	return o && a.setMeta("preventUpdate", !n), s.insertContentAt({
		from: 0,
		to: c.content.size
	}, e, {
		parseOptions: r,
		errorOnInvalidContent: t ?? i.options.enableContentCheck
	});
};
function Kd(e, t) {
	let n = Xu(t, e.schema), { from: r, to: i, empty: a } = e.selection, o = [];
	a ? (e.storedMarks && o.push(...e.storedMarks), o.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, i, (e) => {
		o.push(...e.marks);
	});
	let s = o.find((e) => e.type.name === n.name);
	return s ? { ...s.attrs } : {};
}
function qd(e, t) {
	let n = new oi(e);
	return t.forEach((e) => {
		e.steps.forEach((e) => {
			n.step(e);
		});
	}), n;
}
function Jd(e, t) {
	let n = [];
	return e.descendants((e, r) => {
		t(e) && n.push({
			node: e,
			pos: r
		});
	}), n;
}
function Yd(e, t, n) {
	let r = [];
	return e.nodesBetween(t.from, t.to, (e, t) => {
		n(e) && r.push({
			node: e,
			pos: t
		});
	}), r;
}
function Xd(e, t) {
	for (let n = e.depth; n > 0; --n) {
		let r = e.node(n);
		if (t(r)) return {
			pos: n > 0 ? e.before(n) : 0,
			start: e.start(n),
			depth: n,
			node: r
		};
	}
}
function Zd(e) {
	return (t) => Xd(t.$from, e);
}
function K(e, t, n) {
	return e.config[t] === void 0 && e.parent ? K(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
		...n,
		parent: e.parent ? K(e.parent, t, n) : null
	}) : e.config[t];
}
function Qd(e) {
	return e.map((e) => {
		let t = K(e, "addExtensions", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		return t ? [e, ...Qd(t())] : e;
	}).flat(10);
}
function $d(e, t) {
	let n = zn.fromSchema(t).serializeFragment(e), r = document.implementation.createHTMLDocument().createElement("div");
	return r.appendChild(n), r.innerHTML;
}
function ef(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = n.get(t.type) ?? /* @__PURE__ */ new Map();
		e.set(t.name, t), n.set(t.type, e);
	}
	return [...Object.values(t.nodes), ...Object.values(t.marks)].flatMap((e) => Object.entries(e.spec.attrs ?? {}).map(([t, r]) => {
		let i = n.get(e.name)?.get(t), a = Object.hasOwn(r, "default");
		return {
			type: e.name,
			name: t,
			attribute: {
				rendered: !0,
				renderHTML: null,
				parseHTML: null,
				keepOnSplit: !0,
				...i?.attribute,
				default: r.default,
				isRequired: !a,
				validate: r.validate
			}
		};
	}));
}
var tf = {
	content: "string",
	marks: "string",
	group: "string",
	inline: "boolean",
	atom: "boolean",
	selectable: "boolean",
	draggable: "boolean",
	code: "boolean",
	whitespace: ["pre", "normal"],
	definingAsContext: "boolean",
	definingForContent: "boolean",
	defining: "boolean",
	isolating: "boolean",
	linebreakReplacement: "boolean"
}, nf = {
	inclusive: "boolean",
	excludes: "string",
	group: "string",
	spanning: "boolean",
	code: "boolean"
};
function rf(e, t, n) {
	return Object.fromEntries(Object.entries(t).flatMap(([t, r]) => {
		let i = e[t];
		if (i === void 0) return [];
		if (!(typeof r == "string" ? typeof i === r : typeof i == "string" && r.includes(i))) throw RangeError(`Invalid schemaSpec field '${n}.${t}'`);
		return [[t, i]];
	}));
}
function af(e, t, n, r) {
	return {
		...Object.fromEntries(Object.entries(t).filter(([e]) => e !== "attrs" && !Object.hasOwn(r, e))),
		...rf(n, r, e),
		attrs: n.attrs
	};
}
function of(e, t, n) {
	for (let r of Object.keys(t)) if (!Object.hasOwn(e, r)) throw RangeError(`schemaSpec requires a local ${n} extension named '${r}'`);
	for (let r of Object.keys(e)) if (!Object.hasOwn(t, r)) throw RangeError(`Local ${n} extension '${r}' is not in schemaSpec`);
}
function sf(e, t) {
	of(e.nodes, t.nodes, "node"), of(e.marks, t.marks, "mark");
	let n = t.spec.nodes, r = t.spec.marks;
	return t.spec.nodes.forEach((t, r) => {
		n = n.update(t, af(t, e.nodes[t], r, tf));
	}), t.spec.marks.forEach((t, n) => {
		r = r.update(t, af(t, e.marks[t], n, nf));
	}), {
		topNode: t.topNodeType.name,
		nodes: n,
		marks: r
	};
}
function cf(e) {
	let t = e.filter((t, n) => e.indexOf(t) !== n);
	return Array.from(new Set(t));
}
function lf(e) {
	return {
		baseExtensions: e.filter((e) => e.type === "extension"),
		nodeExtensions: e.filter((e) => e.type === "node"),
		markExtensions: e.filter((e) => e.type === "mark")
	};
}
function uf(e) {
	let t = [], { nodeExtensions: n, markExtensions: r } = lf(e), i = [...n, ...r], a = {
		default: null,
		validate: void 0,
		rendered: !0,
		renderHTML: null,
		parseHTML: null,
		keepOnSplit: !0,
		isRequired: !1
	}, o = n.filter((e) => e.name !== "text").map((e) => e.name), s = r.map((e) => e.name), c = [...o, ...s];
	return e.forEach((e) => {
		let n = K(e, "addGlobalAttributes", {
			name: e.name,
			options: e.options,
			storage: e.storage,
			extensions: i
		});
		n && n().forEach((e) => {
			let n;
			n = Array.isArray(e.types) ? e.types : e.types === "*" ? c : e.types === "nodes" ? o : e.types === "marks" ? s : [], n.forEach((n) => {
				Object.entries(e.attributes).forEach(([e, r]) => {
					t.push({
						type: n,
						name: e,
						attribute: {
							...a,
							...r
						}
					});
				});
			});
		});
	}), i.forEach((e) => {
		let n = K(e, "addAttributes", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		if (!n) return;
		let r = n();
		Object.entries(r).forEach(([n, r]) => {
			let i = {
				...a,
				...r
			};
			typeof i?.default == "function" && (i.default = i.default()), i?.isRequired && i?.default === void 0 && delete i.default, t.push({
				type: e.name,
				name: n,
				attribute: i
			});
		});
	}), t;
}
function df(e) {
	return typeof e == "function";
}
function q(e, t = void 0, ...n) {
	return df(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function ff(e = {}) {
	return Object.keys(e).length === 0 && e.constructor === Object;
}
function pf(e) {
	let t = [], n = "", r = !1, i = !1, a = 0, o = e.length;
	for (let s = 0; s < o; s += 1) {
		let o = e[s];
		if (o === "'" && !i) r = !r, n += o;
		else if (o === "\"" && !r) i = !i, n += o;
		else {
			if (!r && !i) {
				if (o === "(") {
					a += 1, n += o;
					continue;
				}
				if (o === ")" && a > 0) {
					--a, n += o;
					continue;
				}
				if (o === ";" && a === 0) {
					t.push(n), n = "";
					continue;
				}
			}
			n += o;
		}
	}
	return n && t.push(n), t;
}
function mf(e) {
	let t = [], n = pf(e || ""), r = n.length;
	for (let e = 0; e < r; e += 1) {
		let r = n[e], i = r.indexOf(":");
		if (i === -1) continue;
		let a = r.slice(0, i).trim(), o = r.slice(i + 1).trim();
		a && o && t.push([a, o]);
	}
	return t;
}
function J(...e) {
	return e.filter((e) => !!e).reduce((e, t) => {
		let n = { ...e };
		return Object.entries(t).forEach(([e, t]) => {
			if (e === "__proto__") Object.defineProperty(n, e, {
				configurable: !0,
				enumerable: !0,
				value: t,
				writable: !0
			});
			else if (!n[e]) n[e] = t;
			else if (e === "class") {
				let r = t ? String(t).split(" ") : [], i = n[e] ? n[e].split(" ") : [], a = r.filter((e) => !i.includes(e));
				n[e] = [...i, ...a].join(" ");
			} else if (e === "style") {
				let r = new Map([...mf(n[e]), ...mf(t)]);
				n[e] = Array.from(r.entries()).map(([e, t]) => `${e}: ${t}`).join("; ");
			} else n[e] = t;
		}), n;
	}, {});
}
function hf(e, t) {
	return t.filter((t) => t.type === e.type.name).filter((e) => e.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(e.attrs) || {} : { [t.name]: e.attrs[t.name] }).reduce((e, t) => J(e, t), {});
}
function gf(e) {
	return typeof e == "string" ? e.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(e) : e === "true" || e !== "false" && e : e;
}
function _f(e, t) {
	return "style" in e ? e : {
		...e,
		getAttrs: (n) => {
			let r = e.getAttrs ? e.getAttrs(n) : e.attrs;
			if (r === !1) return !1;
			let i = t.reduce((e, t) => {
				let r = t.attribute.parseHTML ? t.attribute.parseHTML(n) : gf(n.getAttribute(t.name));
				return r == null ? e : {
					...e,
					[t.name]: r
				};
			}, {});
			return {
				...r,
				...i
			};
		}
	};
}
function vf(e) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => e === "attrs" && ff(t) ? !1 : t != null));
}
function yf(e) {
	var t, n;
	let r = {};
	return !(e != null && (t = e.attribute) != null && t.isRequired) && "default" in (e?.attribute || {}) && (r.default = e.attribute.default), (e == null || (n = e.attribute) == null ? void 0 : n.validate) !== void 0 && (r.validate = e.attribute.validate), [e.name, r];
}
function bf(e, t, n = uf(e)) {
	let { nodeExtensions: r, markExtensions: i } = lf(e);
	return {
		topNode: r.find((e) => K(e, "topNode"))?.name,
		nodes: Object.fromEntries(r.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = vf({
				...e.reduce((e, t) => {
					let n = K(t, "extendNodeSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				content: q(K(r, "content", a)),
				marks: q(K(r, "marks", a)),
				group: q(K(r, "group", a)),
				inline: q(K(r, "inline", a)),
				atom: q(K(r, "atom", a)),
				selectable: q(K(r, "selectable", a)),
				draggable: q(K(r, "draggable", a)),
				code: q(K(r, "code", a)),
				whitespace: q(K(r, "whitespace", a)),
				linebreakReplacement: q(K(r, "linebreakReplacement", a)),
				defining: q(K(r, "defining", a)),
				isolating: q(K(r, "isolating", a)),
				attrs: Object.fromEntries(i.map(yf))
			}), s = q(K(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => _f(e, i)));
			let c = K(r, "renderHTML", a);
			c && (o.toDOM = (e) => c({
				node: e,
				HTMLAttributes: hf(e, i)
			}));
			let l = K(r, "renderText", a);
			return l && (o.toText = l), [r.name, o];
		})),
		marks: Object.fromEntries(i.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = vf({
				...e.reduce((e, t) => {
					let n = K(t, "extendMarkSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				inclusive: q(K(r, "inclusive", a)),
				excludes: q(K(r, "excludes", a)),
				group: q(K(r, "group", a)),
				spanning: q(K(r, "spanning", a)),
				code: q(K(r, "code", a)),
				attrs: Object.fromEntries(i.map(yf))
			}), s = q(K(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => _f(e, i)));
			let c = K(r, "renderHTML", a);
			return c && (o.toDOM = (e) => c({
				mark: e,
				HTMLAttributes: hf(e, i)
			})), [r.name, o];
		}))
	};
}
function xf(e, t, n) {
	if (n === void 0) return new xn(bf(e, t));
	let r = cf(e.filter((e) => e.type !== "extension").map((e) => e.name));
	if (r.length) throw RangeError(`Duplicate local schema types: ${r.join(", ")}`);
	let i = new xn(n);
	return new xn(sf(bf(e, t, ef(uf(e), i)), i));
}
function Sf(e) {
	return e.sort((e, t) => {
		let n = K(e, "priority") || 100, r = K(t, "priority") || 100;
		return n > r ? -1 : +(n < r);
	});
}
function Cf(e) {
	let t = Sf(Qd(e)), n = cf(t.map((e) => e.name));
	return n.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${n.map((e) => `'${e}'`).join(", ")}]. This can lead to issues.`), t;
}
function wf(e, t, n) {
	let { from: r, to: i } = t, { blockSeparator: a = "\n\n", textSerializers: o = {} } = n || {}, s = "";
	return e.nodesBetween(r, i, (e, n, c, l) => {
		e.isBlock && n > r && (s += a);
		let u = o?.[e.type.name];
		if (u) return c && (s += u({
			node: e,
			pos: n,
			parent: c,
			index: l,
			range: t
		})), !1;
		if (e.isText) {
			var d;
			s += e == null || (d = e.text) == null ? void 0 : d.slice(Math.max(r, n) - n, i - n);
		}
	}), s;
}
function Tf(e, t) {
	return wf(e, {
		from: 0,
		to: e.content.size
	}, t);
}
function Ef(e) {
	return Object.fromEntries(Object.entries(e.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
function Df(e, t) {
	let n = G(t, e.schema), { from: r, to: i } = e.selection, a = [];
	e.doc.nodesBetween(r, i, (e) => {
		a.push(e);
	});
	let o = a.reverse().find((e) => e.type.name === n.name);
	return o ? { ...o.attrs } : {};
}
function Of(e, t) {
	let n = Pd(typeof t == "string" ? t : t.name, e.schema);
	return n === "node" ? Df(e, t) : n === "mark" ? Kd(e, t) : {};
}
function kf(e, t = JSON.stringify) {
	let n = {};
	return e.filter((e) => {
		let r = t(e);
		return Object.prototype.hasOwnProperty.call(n, r) ? !1 : n[r] = !0;
	});
}
function Af(e) {
	let t = kf(e);
	return t.length === 1 ? t : t.filter((e, n) => !t.filter((e, t) => t !== n).some((t) => e.oldRange.from >= t.oldRange.from && e.oldRange.to <= t.oldRange.to && e.newRange.from >= t.newRange.from && e.newRange.to <= t.newRange.to));
}
function jf(e) {
	let { mapping: t, steps: n } = e, r = [];
	return t.maps.forEach((e, i) => {
		let a = [];
		if (e.ranges.length) e.forEach((e, t) => {
			a.push({
				from: e,
				to: t
			});
		});
		else {
			let { from: e, to: t } = n[i];
			if (e === void 0 || t === void 0) return;
			a.push({
				from: e,
				to: t
			});
		}
		a.forEach(({ from: e, to: n }) => {
			let a = t.slice(i).map(e, -1), o = t.slice(i).map(n), s = t.invert().map(a, -1), c = t.invert().map(o);
			r.push({
				oldRange: {
					from: s,
					to: c
				},
				newRange: {
					from: a,
					to: o
				}
			});
		});
	}), Af(r);
}
function Mf(e, t, n) {
	let r = [];
	return e === t ? n.resolve(e).marks().forEach((t) => {
		let i = Yu(n.resolve(e), t.type);
		i && r.push({
			mark: t,
			...i
		});
	}) : n.nodesBetween(e, t, (e, t) => {
		e && e?.nodeSize !== void 0 && r.push(...e.marks.map((n) => ({
			from: t,
			to: t + e.nodeSize,
			mark: n
		})));
	}), r;
}
var Nf = (e, t, n, r = 20) => {
	let i = e.doc.resolve(n), a = r, o = null;
	for (; a > 0 && o === null;) {
		let e = i.node(a);
		e?.type.name === t ? o = e : --a;
	}
	return [o, a];
}, Pf = (e) => {
	let t = e.depth - 1;
	if (t < 0) return null;
	let n = e.index(t);
	return n === 0 ? null : e.node(t).child(n - 1);
};
function Ff(e, t) {
	return t.nodes[e] || t.marks[e] || null;
}
function If(e, t, n) {
	return Object.fromEntries(Object.entries(n).filter(([n]) => {
		let r = e.find((e) => e.type === t && e.name === n);
		return r ? r.attribute.keepOnSplit : !1;
	}));
}
var Lf = (e, t = 500) => {
	let n = "", r = e.parentOffset;
	return e.parent.nodesBetween(Math.max(0, r - t), r, (e, t, i, a) => {
		var o;
		let s = (o = e.type.spec).toText?.call(o, {
			node: e,
			pos: t,
			parent: i,
			index: a
		}) || e.textContent || "%leaf%";
		n += e.isAtom && !e.isText ? s : s.slice(0, Math.max(0, r - t));
	}), n;
};
function Rf(e, t, n = {}) {
	let { empty: r, ranges: i } = e.selection, a = t ? Xu(t, e.schema) : null;
	if (r) return !!(e.storedMarks || e.selection.$from.marks()).filter((e) => !a || a.name === e.type.name).find((e) => Ku(e.attrs, n, { strict: !1 }));
	let o = 0, s = [];
	if (i.forEach(({ $from: t, $to: n }) => {
		let r = t.pos, i = n.pos;
		e.doc.nodesBetween(r, i, (e, t) => {
			if (a && e.inlineContent && !e.type.allowsMarkType(a)) return !1;
			if (!e.isText && !e.marks.length) return;
			let n = Math.max(r, t), c = Math.min(i, t + e.nodeSize), l = c - n;
			o += l, s.push(...e.marks.map((e) => ({
				mark: e,
				from: n,
				to: c
			})));
		});
	}), o === 0) return !1;
	let c = s.filter((e) => !a || a.name === e.mark.type.name).filter((e) => Ku(e.mark.attrs, n, { strict: !1 })).reduce((e, t) => e + t.to - t.from, 0), l = s.filter((e) => !a || e.mark.type !== a && e.mark.type.excludes(a)).reduce((e, t) => e + t.to - t.from, 0);
	return (c > 0 ? c + l : c) >= o;
}
function zf(e, t, n = {}) {
	if (!t) return kd(e, null, n) || Rf(e, null, n);
	let r = Pd(t, e.schema);
	return r === "node" ? kd(e, t, n) : r === "mark" && Rf(e, t, n);
}
var Bf = (e, t) => {
	let { $from: n, $to: r, $anchor: i } = e.selection;
	if (t) {
		let n = Zd((e) => e.type.name === t)(e.selection);
		if (!n) return !1;
		let r = e.doc.resolve(n.pos + 1);
		return i.pos + 1 === r.end();
	}
	return !(r.parentOffset < r.parent.nodeSize - 2 || n.pos !== r.pos);
}, Vf = (e) => {
	let { $from: t, $to: n } = e.selection;
	return !(t.parentOffset > 0 || t.pos !== n.pos);
};
function Hf(e, t) {
	return Array.isArray(t) ? t.some((t) => (typeof t == "string" ? t : t.name) === e.name) : t;
}
function Uf(e, t) {
	let { nodeExtensions: n } = lf(t), r = n.find((t) => t.name === e);
	if (!r) return !1;
	let i = q(K(r, "group", {
		name: r.name,
		options: r.options,
		storage: r.storage
	}));
	return typeof i == "string" && i.split(" ").includes("list");
}
function Wf(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
	if (n) {
		if (e.type.name === "hardBreak") return !0;
		if (e.isText) return !/\S/.test(e.text ?? "");
	}
	if (e.isText) return !e.text;
	if (e.isAtom || e.isLeaf) return !1;
	if (e.content.childCount === 0) return !0;
	if (t) {
		let r = !0;
		return e.content.forEach((e) => {
			r !== !1 && (Wf(e, {
				ignoreWhitespace: n,
				checkChildren: t
			}) || (r = !1));
		}), r;
	}
	return !1;
}
function Gf(e) {
	return e instanceof L;
}
function Kf(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.apply == "function" && typeof t.getMap == "function" && typeof t.invert == "function" && typeof t.map == "function" && typeof t.merge == "function" && typeof t.toJSON == "function";
}
function qf(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	if (!Kf(t)) return !1;
	let n = t.toJSON();
	return !(typeof n != "object" || !n || n.stepType !== "replace");
}
var Jf = class e {
	constructor(e) {
		this.position = e;
	}
	static fromJSON(t) {
		return new e(t.position);
	}
	toJSON() {
		return { position: this.position };
	}
};
function Yf(e, t) {
	let n = t.mapping.mapResult(e.position);
	return {
		position: new Jf(n.pos),
		mapResult: n
	};
}
function Xf(e) {
	return new Jf(e);
}
function Zf(e, t, n) {
	let { selection: r } = t, i = null;
	if ($u(r) && (i = r.$cursor), i) {
		let t = e.storedMarks ?? i.marks();
		return i.parent.type.allowsMarkType(n) && (!!n.isInSet(t) || !t.some((e) => e.type.excludes(n)));
	}
	let { ranges: a } = r;
	return a.some(({ $from: t, $to: r }) => {
		let i = t.depth === 0 && e.doc.inlineContent && e.doc.type.allowsMarkType(n);
		return e.doc.nodesBetween(t.pos, r.pos, (e, t, r) => {
			if (i) return !1;
			if (e.isInline) {
				let t = !r || r.type.allowsMarkType(n), a = !!n.isInSet(e.marks) || !e.marks.some((e) => e.type.excludes(n));
				i = t && a;
			}
			return !i;
		}), i;
	});
}
var Qf = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = n, { empty: o, ranges: s } = a, c = Xu(e, r.schema);
	if (i) {
		if (o) {
			let e = Kd(r, c);
			n.addStoredMark(c.create({
				...e,
				...t
			}));
		} else s.forEach((e) => {
			let i = e.$from.pos, a = e.$to.pos;
			r.doc.nodesBetween(i, a, (e, r) => {
				let o = Math.max(r, i), s = Math.min(r + e.nodeSize, a);
				e.marks.find((e) => e.type === c) ? e.marks.forEach((e) => {
					c === e.type && n.addMark(o, s, c.create({
						...e.attrs,
						...t
					}));
				}) : n.addMark(o, s, c.create(t));
			});
		});
	}
	return Zf(r, n, c);
}, $f = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), ep = (e, t = {}) => ({ state: n, dispatch: r, chain: i }) => {
	let a = G(e, n.schema), o;
	return n.selection.$anchor.sameParent(n.selection.$head) && (o = n.selection.$anchor.parent.attrs), a.isTextblock ? i().command(({ commands: e }) => oa(a, {
		...o,
		...t
	})(n) ? !0 : e.clearNodes()).command(({ state: e }) => oa(a, {
		...o,
		...t
	})(e, r)).run() : (console.warn("[tiptap warn]: Currently \"setNode()\" only supports text block nodes."), !1);
}, tp = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, r = ed(e, 0, n.content.size), i = L.create(n, r);
		t.setSelection(i);
	}
	return !0;
}, np = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = r, o, s;
	return typeof t == "number" ? (o = t, s = t) : t && "from" in t && "to" in t ? (o = t.from, s = t.to) : (o = a.from, s = a.to), i && n.doc.nodesBetween(o, s, (t, r) => {
		t.isText || n.setNodeMarkup(r, void 0, {
			...t.attrs,
			dir: e
		});
	}), !0;
}, rp = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, { from: r, to: i } = typeof e == "number" ? {
			from: e,
			to: e
		} : e, a = I.atStart(n).from, o = I.atEnd(n).to, s = ed(r, a, o), c = ed(i, a, o), l = I.create(n, s, c);
		t.setSelection(l);
	}
	return !0;
}, ip = (e) => ({ state: t, dispatch: n }) => va(G(e, t.schema))(t, n);
function ap(e, t) {
	let n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
	if (n) {
		let r = n.filter((e) => t?.includes(e.type.name));
		e.tr.ensureMarks(r);
	}
}
var op = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: i }) => {
	let { selection: a, doc: o } = t, { $from: s, $to: c } = a, l = i.extensionManager.attributes, u = If(l, s.node().type.name, s.node().attrs);
	if (a instanceof L && a.node.isBlock) return !s.parentOffset || !Mr(o, s.pos) ? !1 : (r && (e && ap(n, i.extensionManager.splittableMarks), t.split(s.pos).scrollIntoView()), !0);
	if (!s.parent.isBlock) return !1;
	let d = c.parentOffset === c.parent.content.size, f = s.depth === 0 ? void 0 : hd(s.node(-1).contentMatchAt(s.indexAfter(-1))), p = d && f ? [{
		type: f,
		attrs: u
	}] : void 0, m = a instanceof I && !a.empty ? Ti.create({
		doc: t.doc,
		selection: a
	}).tr.deleteSelection() : null, h = m ? m.doc : t.doc, g = m ? m.mapping.map(s.pos) : s.pos, _ = Mr(h, g, 1, p);
	if (!p && !_ && Mr(h, g, 1, f ? [{ type: f }] : void 0) && (_ = !0, p = f ? [{
		type: f,
		attrs: u
	}] : void 0), r) {
		if (_) {
			let e = t.steps.length;
			if (a instanceof I && t.deleteSelection(), t.split(t.mapping.slice(e).map(s.pos), 1, p), f && !d && !s.parentOffset && s.parent.type !== f) {
				let n = t.mapping.slice(e).map(s.before()), r = t.doc.resolve(n);
				s.node(-1).canReplaceWith(r.index(), r.index() + 1, f) && t.setNodeMarkup(t.mapping.slice(e).map(s.before()), f);
			}
		}
		e && ap(n, i.extensionManager.splittableMarks), t.scrollIntoView();
	}
	return _;
}, sp = (e, t = {}) => ({ tr: n, state: r, dispatch: i, editor: a }) => {
	let o = G(e, r.schema), { $from: s, $to: c } = r.selection, l = r.selection.node;
	if (l && l.isBlock || s.depth < 2 || !s.sameParent(c)) return !1;
	let u = s.node(-1);
	if (u.type !== o) return !1;
	let d = a.extensionManager.attributes;
	if (s.parent.content.size === 0 && s.node(-1).childCount === s.indexAfter(-1)) {
		if (s.depth === 2 || s.node(-3).type !== o || s.index(-2) !== s.node(-2).childCount - 1) return !1;
		if (i) {
			let e = j.empty, r = s.index(-1) ? 1 : s.index(-2) ? 2 : 3;
			for (let t = s.depth - r; t >= s.depth - 3; --t) e = j.from(s.node(t).copy(e));
			let i = s.indexAfter(-1) < s.node(-2).childCount ? 1 : s.indexAfter(-2) < s.node(-3).childCount ? 2 : 3, a = {
				...If(d, s.node().type.name, s.node().attrs),
				...t
			}, c = o.contentMatch.defaultType?.createAndFill(a) || void 0;
			e = e.append(j.from(o.createAndFill(null, c) || void 0));
			let l = s.before(s.depth - (r - 1));
			n.replace(l, s.after(-i), new N(e, 4 - r, 0));
			let u = -1;
			n.doc.nodesBetween(l, n.doc.content.size, (e, t) => {
				if (u > -1) return !1;
				e.isTextblock && e.content.size === 0 && (u = t + 1);
			}), u > -1 && n.setSelection(I.near(n.doc.resolve(u))), n.scrollIntoView();
		}
		return !0;
	}
	let f = c.pos === s.end() ? u.contentMatchAt(0).defaultType : null, p = {
		...If(d, u.type.name, u.attrs),
		...t
	}, m = {
		...If(d, s.node().type.name, s.node().attrs),
		...t
	}, h = s.parentOffset === 0 && s.index(-1) === 0, g = s.before(-1);
	n.delete(s.pos, c.pos);
	let _ = h ? u.attrs : p, v = f ? [{
		type: o,
		attrs: _
	}, {
		type: f,
		attrs: m
	}] : [{
		type: o,
		attrs: _
	}];
	if (!Mr(n.doc, s.pos, 2)) return !1;
	if (i) {
		let { selection: e, storedMarks: t } = r, { splittableMarks: o } = a.extensionManager, c = t || e.$to.parentOffset && e.$from.marks();
		if (n.split(s.pos, 2, v).scrollIntoView(), h && n.setNodeMarkup(g, void 0, p), !c || !i) return !0;
		let l = c.filter((e) => o.includes(e.type.name));
		n.ensureMarks(l);
	}
	return !0;
};
function cp(e, t, n) {
	if (!e.validContent(t)) return null;
	try {
		return e.create(n, t);
	} catch {
		return null;
	}
}
function lp(e, t) {
	if (e.pendingContent.length === 0) return !0;
	let n = cp(t, j.from(e.pendingContent));
	return n ? (e.items.push(n), e.pendingContent = [], !0) : !1;
}
function up(e, t, n) {
	return n.validContent(j.from([...t.pendingContent, e])) ? (t.pendingContent.push(e), !0) : !lp(t, n) || !n.validContent(j.from(e)) ? !1 : (t.pendingContent.push(e), !0);
}
function dp(e, t, n, r) {
	let i = r(e, n);
	if (!i) return !1;
	let a = cp(n.listType, j.from(i), e.attrs);
	return a ? n.itemType.validContent(j.from([...t.pendingContent, a])) ? (t.pendingContent.push(a), !0) : lp(t, n.itemType) ? (t.items.push(...i), !0) : !1 : !1;
}
function fp(e, t, n) {
	let r = {
		items: [],
		pendingContent: []
	};
	for (let i = 0; i < e.childCount; i += 1) {
		let a = e.child(i);
		if (!(t.isListNode(a) ? dp(a, r, t, n) : up(a, r, t.itemType))) return null;
	}
	return lp(r, t.itemType) ? r.items : null;
}
function pp(e, t) {
	let n = [];
	for (let r = 0; r < e.childCount; r += 1) {
		let i = fp(e.child(r), t, pp);
		if (!i) return null;
		n.push(...i);
	}
	return n;
}
function mp(e, t) {
	let n = null;
	return e.descendants((e, r) => e !== t || (n = r, !1)), n;
}
function hp(e) {
	return !e || e === "1" ? null : e;
}
function gp(e, t) {
	return hp(e) === hp(t);
}
var _p = (e, t) => {
	let n = Zd((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Pr(e.doc, n.pos)) || !gp(n.node.attrs.type, i?.attrs.type) || e.join(n.pos), !0;
}, vp = (e, t) => {
	let n = Zd((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(n.start).after(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Pr(e.doc, r)) || !gp(n.node.attrs.type, i?.attrs.type) || e.join(r), !0;
};
function yp(e) {
	let t = e.doc, n = t.firstChild;
	if (!n) return null;
	let r = t.resolve(1), i = t.resolve(n.nodeSize - 1);
	return I.between(r, i);
}
var bp = (e, t, n, r = {}) => ({ editor: i, tr: a, state: o, dispatch: s, chain: c, commands: l, can: u }) => {
	let { extensions: d, splittableMarks: f } = i.extensionManager, p = G(e, o.schema), m = G(t, o.schema), { selection: h, storedMarks: g } = o, { $from: _, $to: v } = h, y = _.blockRange(v), b = g || h.$to.parentOffset && h.$from.marks();
	if (!y) return !1;
	let x = Zd((e) => Uf(e.type.name, d))(h), S = h.from === 0 && h.to === o.doc.content.size, C = o.doc.content.content, ee = C.length === 1 ? C[0] : null, w = S && ee && Uf(ee.type.name, d) ? {
		node: ee,
		pos: 0,
		depth: 0
	} : null, T = x ?? w, E = !!x && y.depth >= 1 && y.depth - x.depth <= 1, te = !!w;
	if ((E || te) && T) {
		if (T.node.type === p) return S && te ? c().command(({ tr: e, dispatch: t }) => {
			let n = yp(e);
			return n ? (e.setSelection(n), t && t(e), !0) : !1;
		}).liftListItem(m).run() : l.liftListItem(m);
		if (Uf(T.node.type.name, d) && p.validContent(T.node.content)) return c().command(() => (a.setNodeMarkup(T.pos, p), !0)).command(() => _p(a, p)).command(() => vp(a, p)).run();
		if (Uf(T.node.type.name, d)) {
			let e = T.node.firstChild?.type;
			if (e && e !== m) {
				let e = pp(T.node, {
					listType: p,
					itemType: m,
					isListNode: (e) => Uf(e.type.name, d)
				}), t = e ? j.from(e) : null;
				return !t || !p.validContent(t) ? !1 : c().command(() => {
					let { $anchor: e, $head: n } = a.selection, i = e.parent, o = n.parent, s = e.parentOffset, c = n.parentOffset, l;
					try {
						l = p.create(r, t);
					} catch {
						return !1;
					}
					if (a.replaceWith(T.pos, T.pos + T.node.nodeSize, l), i.inlineContent && o.inlineContent) {
						let e = mp(l, i), t = mp(l, o);
						if (e !== null && t !== null) {
							let n = T.pos + e + 2 + s, r = T.pos + t + 2 + c;
							a.setSelection(I.create(a.doc, n, r));
						}
					}
					return !0;
				}).command(() => _p(a, p)).command(() => vp(a, p)).run();
			}
		}
	}
	return !n || !b || !s ? c().command(() => u().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => _p(a, p)).command(() => vp(a, p)).run() : c().command(() => {
		let e = u().wrapInList(p, r), t = b.filter((e) => f.includes(e.type.name));
		return a.ensureMarks(t), e ? !0 : l.clearNodes();
	}).wrapInList(p, r).command(() => _p(a, p)).command(() => vp(a, p)).run();
}, xp = (e, t = {}, n = {}) => ({ state: r, commands: i }) => {
	let { extendEmptyMarkRange: a = !1 } = n, o = Xu(e, r.schema);
	return Rf(r, o, t) ? i.unsetMark(o, { extendEmptyMarkRange: a }) : i.setMark(o, t);
}, Sp = (e, t, n = {}) => ({ state: r, commands: i }) => {
	let a = G(e, r.schema), o = G(t, r.schema), s = kd(r, a, n), c;
	return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), s ? i.setNode(o, c) : i.setNode(a, {
		...c,
		...n
	});
}, Cp = (e, t = {}) => ({ state: n, commands: r }) => {
	let i = G(e, n.schema);
	return kd(n, i, t) ? r.lift(i) : r.wrapIn(i, t);
}, wp = () => ({ state: e, dispatch: t }) => {
	let n = e.plugins;
	for (let r = 0; r < n.length; r += 1) {
		let i = n[r], a;
		if (i.spec.isInputRules && (a = i.getState(e))) {
			if (t) {
				let t = e.tr, n = a.transform;
				for (let e = n.steps.length - 1; e >= 0; --e) t.step(n.steps[e].invert(n.docs[e]));
				if (a.text) {
					let n = t.doc.resolve(a.from).marks();
					t.replaceWith(a.from, a.to, e.schema.text(a.text, n));
				} else t.delete(a.from, a.to);
			}
			return !0;
		}
	}
	return !1;
}, Tp = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
	let { ignoreClearable: i = !1 } = e, { selection: a } = t, { empty: o, ranges: s } = a;
	if (o) return !0;
	let { nonClearableMarks: c } = r.extensionManager;
	if (n) {
		let e = Object.values(r.schema.marks).filter((e) => i || !c.includes(e.name));
		s.forEach((n) => {
			for (let r of e) t.removeMark(n.$from.pos, n.$to.pos, r);
		});
	}
	return !0;
}, Ep = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { extendEmptyMarkRange: a = !1 } = t, { selection: o } = n, s = Xu(e, r.schema), { $from: c, empty: l, ranges: u } = o;
	if (!i) return !0;
	if (l && a) {
		let { from: e, to: t } = o, r = Yu(c, s, c.marks().find((e) => e.type === s)?.attrs);
		r && (e = r.from, t = r.to), n.removeMark(e, t, s);
	} else u.forEach((e) => {
		n.removeMark(e.$from.pos, e.$to.pos, s);
	});
	return n.removeStoredMark(s), !0;
}, Dp = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let { selection: i } = n, a, o;
	return typeof e == "number" ? (a = e, o = e) : e && "from" in e && "to" in e ? (a = e.from, o = e.to) : (a = i.from, o = i.to), r && t.doc.nodesBetween(a, o, (e, n) => {
		if (e.isText) return;
		let r = { ...e.attrs };
		delete r.dir, t.setNodeMarkup(n, void 0, r);
	}), !0;
}, Op = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Pd(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = G(e, r.schema)), s === "mark" && (o = Xu(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		let s = e.$from.pos, l = e.$to.pos, u, d, f, p;
		n.selection.empty ? r.doc.nodesBetween(s, l, (e, t) => {
			a && a === e.type && (c = !0, f = Math.max(t, s), p = Math.min(t + e.nodeSize, l), u = t, d = e);
		}) : r.doc.nodesBetween(s, l, (e, r) => {
			r < s && a && a === e.type && (c = !0, f = Math.max(r, s), p = Math.min(r + e.nodeSize, l), u = r, d = e), r >= s && r <= l && (a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, {
				...e.attrs,
				...t
			})), o && e.marks.length && e.marks.forEach((a) => {
				if (o === a.type && (c = !0, i)) {
					let i = Math.max(r, s), c = Math.min(r + e.nodeSize, l);
					n.addMark(i, c, o.create({
						...a.attrs,
						...t
					}));
				}
			}));
		}), d && (u !== void 0 && i && n.setNodeMarkup(u, void 0, {
			...d.attrs,
			...t
		}), o && d.marks.length && d.marks.forEach((e) => {
			o === e.type && i && n.addMark(f, p, o.create({
				...e.attrs,
				...t
			}));
		}));
	}), c;
}, kp = new z("__tiptap_decorations__"), Ap = (e) => ({ tr: t, dispatch: n }) => (n && t.setMeta(kp, {
	type: "force",
	name: e
}), !0), jp = (e, t = {}) => ({ state: n, dispatch: r }) => aa(G(e, n.schema), t)(n, r), Mp = (e, t = {}) => ({ state: n, dispatch: r }) => fa(G(e, n.schema), t)(n, r), Np = /* @__PURE__ */ xt({
	blur: () => Au,
	clearContent: () => ju,
	clearNodes: () => Mu,
	command: () => Nu,
	createParagraphNear: () => Pu,
	cut: () => Fu,
	deleteCurrentNode: () => Iu,
	deleteNode: () => Lu,
	deleteRange: () => Ru,
	deleteSelection: () => Hu,
	enter: () => Uu,
	exitCode: () => Wu,
	extendMarkRange: () => Zu,
	first: () => Qu,
	focus: () => ad,
	forEach: () => od,
	insertContent: () => sd,
	insertContentAt: () => md,
	insertDefaultBlock: () => gd,
	joinBackward: () => yd,
	joinDown: () => vd,
	joinForward: () => bd,
	joinItemBackward: () => Sd,
	joinItemForward: () => Cd,
	joinTextblockBackward: () => wd,
	joinTextblockForward: () => Td,
	joinUp: () => _d,
	keyboardShortcut: () => Od,
	lift: () => Ad,
	liftEmptyBlock: () => jd,
	liftListItem: () => Md,
	newlineInCode: () => Nd,
	resetAttributes: () => Id,
	scrollIntoView: () => Ld,
	selectAll: () => Rd,
	selectNodeBackward: () => zd,
	selectNodeForward: () => Bd,
	selectParentNode: () => Vd,
	selectTextblockEnd: () => Hd,
	selectTextblockStart: () => Ud,
	setContent: () => Gd,
	setMark: () => Qf,
	setMeta: () => $f,
	setNode: () => ep,
	setNodeSelection: () => tp,
	setTextDirection: () => np,
	setTextSelection: () => rp,
	sinkListItem: () => ip,
	splitBlock: () => op,
	splitListItem: () => sp,
	toggleList: () => bp,
	toggleMark: () => xp,
	toggleNode: () => Sp,
	toggleWrap: () => Cp,
	undoInputRule: () => wp,
	unsetAllMarks: () => Tp,
	unsetMark: () => Ep,
	unsetTextDirection: () => Dp,
	updateAttributes: () => Op,
	updateDecorations: () => Ap,
	wrapIn: () => jp,
	wrapInList: () => Mp
}), Pp = /* @__PURE__ */ new WeakMap();
function Fp(e, t) {
	Pp.set(e, (Pp.get(e) ?? 0) + 1);
	try {
		return t();
	} finally {
		let t = (Pp.get(e) ?? 1) - 1;
		t > 0 ? Pp.set(e, t) : Pp.delete(e);
	}
}
function Ip(e) {
	return Pp.has(e);
}
var Lp = class {
	constructor() {
		this.callbacks = {};
	}
	on(e, t) {
		return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
	}
	emit(e, ...t) {
		let n = this.callbacks[e];
		return n && n.forEach((e) => e.apply(this, t)), this;
	}
	off(e, t) {
		let n = this.callbacks[e];
		return n && (t ? this.callbacks[e] = n.filter((e) => e !== t) : delete this.callbacks[e]), this;
	}
	once(e, t) {
		let n = (...r) => {
			this.off(e, n), t.apply(this, r);
		};
		return this.on(e, n);
	}
	removeAllListeners() {
		this.callbacks = {};
	}
}, Rp = typeof process < "u" && process.env.NODE_ENV !== "production";
function zp(e) {
	return e.kind === "widget";
}
function Bp(e, t) {
	let n = [], r = /* @__PURE__ */ new Set();
	for (let i of e) i.kind === "widget" && zp(i) && r.add(i.key), n.push(i.toPMDecoration(t));
	return {
		decorations: n,
		widgetKeys: r
	};
}
function Vp(e, t, n) {
	let { decorations: r, widgetKeys: i } = Bp(t, n);
	return {
		set: U.create(e, r),
		widgetKeys: i
	};
}
function Hp({ position: e, from: t, to: n, docSize: r }) {
	return e < t ? !1 : e < n || e === n && n === r;
}
function Up({ decorations: e, from: t, to: n, docSize: r, extensionName: i, warnedExtensions: a }) {
	return e.filter((e) => Hp({
		position: e.anchor,
		from: t,
		to: n,
		docSize: r
	}) ? !0 : (e.anchor === n || a.has(i) || (a.add(i), console.warn(`[tiptap warn]: Extension "${i}" returned a decoration outside the requested range [${t}, ${n}). It was ignored.`)), !1));
}
function Wp(e) {
	let t = e.spec?.key;
	return typeof t == "string" ? t : void 0;
}
function Gp(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
	for (let r of e.find()) {
		let e = Wp(r);
		if (!e) continue;
		let i = r.spec.extensionName ?? "unknown", a = t.get(e) ?? /* @__PURE__ */ new Set();
		a.add(i), t.set(e, a), n.set(e, (n.get(e) ?? 0) + 1);
	}
	return Array.from(t, ([e, t]) => ({
		key: e,
		extensions: t
	})).filter(({ key: e }) => (n.get(e) ?? 0) > 1);
}
function Kp(e) {
	return e.jsonID === "attr";
}
function qp(e) {
	let t = !1;
	if (e.getMap().forEach(() => {
		t = !0;
	}), t || Kp(e)) return !0;
	let n = e;
	return typeof n.from == "number" && typeof n.to == "number";
}
function Jp(e, t) {
	let n = null, r = 0, i = 0;
	for (let a = 0; a < e.childCount && !(i > t.to); a += 1) {
		let o = i + e.child(a).nodeSize;
		o >= t.from && (n === null && (n = i), r = o), i = o;
	}
	return n === null ? null : {
		from: n,
		to: r
	};
}
function Yp(e, t) {
	if (e.steps.some((e) => !qp(e))) return { type: "full" };
	let n = jf(e).map(({ newRange: e }) => e);
	e.steps.forEach((t, r) => {
		if (!Kp(t)) return;
		let i = e.mapping.slice(r);
		n.push({
			from: i.map(t.pos, -1),
			to: i.map(t.pos + 1)
		});
	});
	let r = [];
	for (let e of n) {
		let n = Jp(t, e);
		n && r.push(n);
	}
	r.sort((e, t) => e.from - t.from);
	let i = [];
	for (let e of r) {
		let t = i[i.length - 1];
		t && e.from <= t.to ? t.to = Math.max(t.to, e.to) : i.push({ ...e });
	}
	return {
		type: "ranges",
		ranges: i
	};
}
function Xp(e, t, n, r) {
	return e.map(t, n, { onRemove: (e) => {
		let t = e?.key;
		typeof t == "string" && r.delete(t);
	} });
}
function Zp(e, t, n) {
	let r = t.decorationSetsByExtension[e] ?? U.empty, i = new Set(t.widgetKeysByExtension[e] ?? []);
	return {
		set: Xp(r, n.mapping, n.doc, i),
		widgetKeys: i
	};
}
function Qp(e, t) {
	let n = Object.values(t).flatMap((e) => e.find());
	return U.create(e, n);
}
function $p(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of Object.values(e)) for (let e of n) t.add(e);
	return t;
}
function em(e, t) {
	switch (t.update ?? "document") {
		case "document":
			if (t.createInRange) throw Error(`[tiptap error]: Extension "${e}" provides createInRange() but does not use the "changedRanges" decoration update strategy.`);
			return;
		case "changedRanges":
			if (!t.createInRange) throw Error(`[tiptap error]: Extension "${e}" uses the "changedRanges" decoration update strategy but does not provide createInRange().`);
			return;
		case "manual":
			if (t.createInRange) throw Error(`[tiptap error]: Extension "${e}" uses the "manual" decoration update strategy, which is not compatible with createInRange(). createInRange() requires the "changedRanges" strategy.`);
			if (t.shouldUpdate) throw Error(`[tiptap error]: Extension "${e}" cannot combine the "manual" decoration update strategy with shouldUpdate().`);
			return;
		default: throw Error(`[tiptap error]: Extension "${e}" uses an unknown decoration update strategy. Expected "document", "changedRanges", or "manual".`);
	}
}
function tm(e, t, n) {
	return n ? !0 : e.update === "manual" ? !1 : e.shouldUpdate ? e.shouldUpdate(t) : t.tr.docChanged;
}
var nm = /* @__PURE__ */ new Set(), rm = class {
	constructor(e) {
		this.warnedWidgetKeys = /* @__PURE__ */ new Set(), this.warnedOutOfRangeExtensions = /* @__PURE__ */ new Set(), this.handleBeforeTransaction = ({ nextState: e }) => {
			let t = kp.getState(e);
			t && this.warnDuplicateWidgetKeys(t);
		}, this.editor = e.editor, this.entries = this.resolveEntries(e.entries), this.entries.forEach(({ name: e, spec: t }) => em(e, t)), this.plugin = this.entries.length > 0 ? this.createPlugin() : null, this.editor.on("beforeTransaction", this.handleBeforeTransaction);
	}
	destroy() {
		this.editor.off("beforeTransaction", this.handleBeforeTransaction);
	}
	liveWidgetKeys() {
		return kp.getState(this.editor.state)?.widgetKeys ?? nm;
	}
	get mountedView() {
		return this.editor.isDestroyed ? null : this.editor.view;
	}
	resolveEntries(e) {
		let t = [];
		for (let { name: n, addDecorations: r } of e) {
			let e = r();
			e && t.push({
				name: n,
				spec: e
			});
		}
		return t;
	}
	createPlugin() {
		let { editor: e, entries: t } = this;
		return new R({
			key: kp,
			state: {
				init: (e, n) => {
					let r = {}, i = {};
					for (let { name: e, spec: a } of t) {
						let { set: t, widgetKeys: o } = this.buildFullSet(e, a, n);
						r[e] = t, i[e] = o;
					}
					let a = {
						decorationSetsByExtension: r,
						widgetKeysByExtension: i,
						mergedDecorationSet: this.buildMergedSet(n.doc, r),
						widgetKeys: $p(i)
					};
					return this.warnDuplicateWidgetKeys(a), a;
				},
				apply: (n, r, i, a) => {
					let o = n.getMeta(kp), s = o?.type === "force" && !o.name, c = o?.type === "force" ? o.name : void 0, l = {}, u = {}, d = /* @__PURE__ */ new Set();
					return Fp(e, () => {
						for (let { name: o, spec: f } of t) {
							let t = s || c === o;
							if (!tm(f, {
								editor: e,
								tr: n,
								oldState: i,
								newState: a
							}, t)) {
								let e = Zp(o, r, n);
								l[o] = e.set, u[o] = e.widgetKeys;
							} else if (f.update === "changedRanges" && n.docChanged && !t) {
								let e = this.applyChangedRangesRecompute(o, f, r, n, a);
								l[o] = e.set, u[o] = e.widgetKeys, d.add(o);
							} else {
								let { set: e, widgetKeys: t } = this.buildFullSet(o, f, a);
								l[o] = e, u[o] = t, d.add(o);
							}
						}
					}), d.size === 0 && !n.docChanged ? r : {
						decorationSetsByExtension: l,
						widgetKeysByExtension: u,
						mergedDecorationSet: this.mergeAfterApply({
							entries: t,
							previous: r,
							tr: n,
							decorationSetsByExtension: l,
							recomputedNames: d
						}),
						widgetKeys: $p(u)
					};
				}
			},
			props: { decorations(e) {
				return kp.getState(e)?.mergedDecorationSet ?? U.empty;
			} }
		});
	}
	applyChangedRangesRecompute(e, t, n, r, i) {
		let a = Yp(r, i.doc);
		return a.type === "full" ? this.buildFullSet(e, t, i) : this.rebuildRanges(e, t, n, r, i, a.ranges);
	}
	rebuildRanges(e, t, n, r, i, a) {
		let o = n.decorationSetsByExtension[e] ?? U.empty, s = new Set(n.widgetKeysByExtension[e] ?? []), c = Xp(o, r.mapping, r.doc, s), l = i.doc.content.size;
		for (let { from: n, to: r } of a) {
			let a = c.find(n, r).filter((e) => Hp({
				position: e.from,
				from: n,
				to: r,
				docSize: l
			}));
			for (let e of a) {
				let t = Wp(e);
				t && s.delete(t);
			}
			c = c.remove(a);
			let { decorations: o, widgetKeys: u } = Bp(Up({
				decorations: this.runCreate(e, "createInRange", () => t.createInRange({
					editor: this.editor,
					state: i,
					view: this.mountedView,
					from: n,
					to: r
				})),
				from: n,
				to: r,
				docSize: l,
				extensionName: e,
				warnedExtensions: this.warnedOutOfRangeExtensions
			}), e);
			c = c.add(i.doc, o);
			for (let e of u) s.add(e);
		}
		return {
			set: c,
			widgetKeys: s
		};
	}
	buildFullSet(e, t, n) {
		let r = this.runCreate(e, "create", () => t.create({
			editor: this.editor,
			state: n,
			view: this.mountedView
		}));
		return Vp(n.doc, r, e);
	}
	runCreate(e, t, n) {
		try {
			return n();
		} catch (n) {
			return console.error(`[tiptap error]: Extension "${e}" threw in \`addDecorations().${t}()\`. Its decorations were dropped for this update.`, n), [];
		}
	}
	warnDuplicateWidgetKeys(e) {
		if (!Rp) return;
		if (e.widgetKeys.size === 0) {
			this.warnedWidgetKeys.clear();
			return;
		}
		let t = Gp(e.mergedDecorationSet), n = new Set(t.map(({ key: e }) => e));
		for (let { key: e, extensions: n } of t) {
			if (this.warnedWidgetKeys.has(e)) continue;
			let t = Array.from(n).map((e) => `"${e}"`).join(", ");
			console.warn(`[tiptap warn]: Duplicate widget decoration key "${e}" in extension${n.size === 1 ? "" : "s"} ${t}. Widget decoration keys must be globally unique, otherwise ProseMirror misplaces the widget DOM. Use a stable, unique key (e.g. \`comment-\${id}\`).`);
		}
		this.warnedWidgetKeys = n;
	}
	buildMergedSet(e, t) {
		let n = Object.keys(t);
		return n.length === 1 ? t[n[0]] : Qp(e, t);
	}
	mergeAfterApply({ entries: e, previous: t, tr: n, decorationSetsByExtension: r, recomputedNames: i }) {
		return e.length === 1 ? r[e[0].name] : i.size === 0 ? t.mergedDecorationSet.map(n.mapping, n.doc) : Qp(n.doc, r);
	}
};
function im(e, t) {
	let { selection: n } = e, { $from: r } = n;
	if (n instanceof L) {
		let e = r.index();
		return r.parent.canReplaceWith(e, e + 1, t);
	}
	let i = r.depth;
	for (; i >= 0;) {
		let e = r.index(i);
		if (r.node(i).contentMatchAt(e).matchType(t)) return !0;
		--i;
	}
	return !1;
}
function am(e, t, n) {
	let r = document.querySelector(`style[data-tiptap-style${n ? `-${n}` : ""}]`);
	if (r !== null) return r;
	let i = document.createElement("style");
	return t && i.setAttribute("nonce", t), i.setAttribute(`data-tiptap-style${n ? `-${n}` : ""}`, ""), i.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(i), i;
}
function om(e) {
	return e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function sm(e) {
	return typeof e == "number";
}
function cm(e) {
	return Object.prototype.toString.call(e).slice(8, -1);
}
function lm(e) {
	return cm(e) === "Object" && e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype;
}
function um(e, t, n) {
	let r = e.split("\n"), i = [], a = "", o = 0, s = t.baseIndentSize || 2;
	for (; o < r.length;) {
		let e = r[o], u = e.match(t.itemPattern);
		if (!u) {
			if (i.length > 0) break;
			if (e.trim() === "") {
				o += 1, a = `${a}${e}\n`;
				continue;
			}
			return;
		}
		let d = t.extractItemData(u), { indentLevel: f, mainContent: p } = d;
		a = `${a}${e}\n`;
		let m = [p];
		for (o += 1; o < r.length;) {
			var c;
			let e = r[o];
			if (e.trim() === "") {
				var l;
				let t = r.slice(o + 1).findIndex((e) => e.trim() !== "");
				if (t === -1) break;
				if ((((l = r[o + 1 + t].match(/^(\s*)/)) == null || (l = l[1]) == null ? void 0 : l.length) || 0) > f) {
					m.push(e), a = `${a}${e}\n`, o += 1;
					continue;
				}
				break;
			}
			if ((((c = e.match(/^(\s*)/)) == null || (c = c[1]) == null ? void 0 : c.length) || 0) > f) m.push(e), a = `${a}${e}\n`, o += 1;
			else break;
		}
		let h, g = m.slice(1);
		if (g.length > 0) {
			let e = g.map((e) => e.slice(f + s)).join("\n");
			e.trim() && (h = t.customNestedParser ? t.customNestedParser(e) : n.blockTokens(e));
		}
		let _ = t.createToken(d, h);
		i.push(_);
	}
	if (i.length !== 0) return {
		items: i,
		raw: a
	};
}
var dm = 4;
function fm(e) {
	let t = 0;
	for (let n of e) t = n === "	" ? t + dm - t % dm : t + 1;
	return t;
}
function pm(e, t, n, r, i) {
	if (!e || !Array.isArray(e.content)) return "";
	let a = typeof n == "function" ? n(r) : n, [o, ...s] = e.content, c = `${a}${t.renderChildren([o])}`;
	return s && s.length > 0 && s.forEach((e, n) => {
		let r = t.renderChild?.call(t, e, n + 1) ?? t.renderChildren([e]);
		if (r != null) {
			let n = (e) => {
				if (!i?.alignNestedToPrefix) return t.indent(e);
				let n = t.indent(""), r = fm(a);
				return (fm(n) >= r ? n : " ".repeat(r)) + e;
			}, o = r.split("\n").map((e) => n(e || "")).join("\n");
			c += e.type === "paragraph" ? `\n\n${o}` : `\n${o}`;
		}
	}), c;
}
function mm(e, t) {
	let n = { ...e };
	return lm(e) && lm(t) && Object.keys(t).forEach((r) => {
		lm(t[r]) && lm(e[r]) ? n[r] = mm(e[r], t[r]) : n[r] = t[r];
	}), n;
}
function hm(e, t, n = {}) {
	let { state: r } = t, { doc: i, tr: a } = r, o = e;
	i.descendants((t, r) => {
		let i = a.mapping.map(r), s = a.mapping.map(r) + t.nodeSize, c = null;
		if (t.marks.forEach((e) => {
			if (e !== o) return !1;
			c = e;
		}), !c) return;
		let l = !1;
		if (Object.keys(n).forEach((e) => {
			n[e] !== c.attrs[e] && (l = !0);
		}), l) {
			let t = e.type.create({
				...e.attrs,
				...n
			});
			a.removeMark(i, s, e.type), a.addMark(i, s, t);
		}
	}), a.docChanged && t.view.dispatch(a);
}
var gm = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler, this.undoable = e.undoable ?? !0;
	}
}, _m = (e, t) => {
	if (Gu(t)) return t.exec(e);
	let n = t(e);
	if (!n) return null;
	let r = [n.text];
	return r.index = n.index, r.input = e, r.data = n.data, n.replaceWith && (n.text.includes(n.replaceWith) || console.warn("[tiptap warn]: \"inputRuleMatch.replaceWith\" must be part of \"inputRuleMatch.text\"."), r.push(n.replaceWith)), r;
};
function vm(e) {
	let { editor: t, from: n, to: r, text: i, insertText: a } = e;
	if (!a) return {
		inputTransaction: null,
		tr: t.view.state.tr
	};
	let o = t.view.state.tr.insertText(i, n, r);
	return {
		inputTransaction: o,
		tr: Ti.create({
			doc: o.doc,
			selection: o.selection,
			storedMarks: o.storedMarks
		}).tr
	};
}
function ym(e) {
	let { editor: t, from: n, to: r, text: i, rule: a, match: o, plugin: s, insertText: c } = e, { view: l } = t, { inputTransaction: u, tr: d } = vm({
		editor: t,
		from: n,
		to: r,
		text: i,
		insertText: c
	}), f = u ? n + i.length : r, p = Ou({
		state: l.state,
		transaction: d
	}), m = {
		from: n - (o[0].length - i.length),
		to: f
	}, { commands: h, chain: g, can: _ } = new ku({
		editor: t,
		state: p
	});
	return a.handler({
		state: p,
		range: m,
		match: o,
		commands: h,
		chain: g,
		can: _
	}) === null || !d.steps.length ? !1 : (u && (l.dispatch(u), !l.state.doc.eq(u.doc)) || (bu(d), d.setMeta("inputRule", !0), a.undoable && d.setMeta(s, {
		transform: d,
		from: n,
		to: f,
		text: i
	}), l.dispatch(d)), !0);
}
function bm(e, t, n) {
	let r = t[0].length - n.length;
	if (r <= 0) return !0;
	let i = e.parentOffset - r;
	return i >= 0 && e.parent.textBetween(i, e.parentOffset) === t[0].slice(0, r);
}
function xm(e) {
	let { editor: t, from: n, to: r, text: i, rules: a, plugin: o, insertText: s } = e, { view: c } = t;
	if (c.composing) return !1;
	let l = c.state.doc.resolve(n);
	if (l.parent.type.spec.code || (l.nodeBefore || l.nodeAfter)?.marks.find((e) => e.type.spec.code)) return !1;
	let u = Lf(l) + i;
	for (let e of a) {
		let a = _m(u, e.find);
		if (a && bm(l, a, i) && ym({
			editor: t,
			from: n,
			to: r,
			text: i,
			rule: e,
			match: a,
			plugin: o,
			insertText: s
		})) return !0;
	}
	return !1;
}
function Sm(e) {
	let { editor: t, rules: n } = e, r = new R({
		state: {
			init() {
				return null;
			},
			apply(e, i, a) {
				let o = e.getMeta(r);
				if (o) return o;
				let s = e.getMeta("applyInputRules");
				return s && setTimeout(() => {
					let { text: e } = s;
					e = typeof e == "string" ? e : $d(j.from(e), a.schema);
					let { from: i } = s, o = i + e.length;
					xm({
						editor: t,
						from: i,
						to: o,
						text: e,
						rules: n,
						plugin: r
					});
				}), e.selectionSet || e.docChanged ? null : i;
			}
		},
		props: {
			handleTextInput(e, i, a, o) {
				return xm({
					editor: t,
					from: i,
					to: a,
					text: o,
					rules: n,
					plugin: r,
					insertText: !0
				});
			},
			handleDOMEvents: { compositionend: (e) => (setTimeout(() => {
				let { $cursor: i } = e.state.selection;
				i && xm({
					editor: t,
					from: i.pos,
					to: i.pos,
					text: "",
					rules: n,
					plugin: r
				});
			}), !1) },
			handleKeyDown(e, i) {
				if (i.key !== "Enter") return !1;
				let { $cursor: a } = e.state.selection;
				return a ? xm({
					editor: t,
					from: a.pos,
					to: a.pos,
					text: "\n",
					rules: n,
					plugin: r
				}) : !1;
			}
		},
		isInputRules: !0
	});
	return r;
}
var Cm = class {
	constructor(e = {}) {
		this.type = "extendable", this.parent = null, this.child = null, this.name = "", this.config = { name: this.name }, this.config = {
			...this.config,
			...e
		}, this.name = this.config.name;
	}
	get options() {
		return { ...q(K(this, "addOptions", { name: this.name })) };
	}
	get storage() {
		return { ...q(K(this, "addStorage", {
			name: this.name,
			options: this.options
		})) };
	}
	configure(e = {}) {
		let t = this.extend({
			...this.config,
			addOptions: () => mm(this.options, e)
		});
		return t.name = this.name, t.parent = this.parent, this.child = null, t;
	}
	extend(e = {}) {
		let t = new this.constructor({
			...this.config,
			...e
		});
		return t.parent = this, this.child = t, t.name = "name" in e ? e.name : t.parent.name, t;
	}
}, wm = class e extends Cm {
	constructor(...e) {
		super(...e), this.type = "mark";
	}
	static create(t = {}) {
		let n = typeof t == "function" ? t() : t;
		return new e(n);
	}
	static handleExit({ editor: e, mark: t }) {
		let { tr: n } = e.state, r = e.state.selection.$from;
		if (r.pos === r.end()) {
			let i = r.marks();
			if (!i.find((e) => e?.type.name === t.name)) return !1;
			let a = i.find((e) => e?.type.name === t.name);
			return a && n.removeStoredMark(a), n.insertText(" ", r.pos), e.view.dispatch(n), !0;
		}
		return !1;
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
}, Tm = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler;
	}
}, Em = (e, t, n) => {
	if (Gu(t)) return [...e.matchAll(t)];
	let r = t(e, n);
	return r ? r.map((t) => {
		let n = [t.text];
		return n.index = t.index, n.input = e, n.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn("[tiptap warn]: \"pasteRuleMatch.replaceWith\" must be part of \"pasteRuleMatch.text\"."), n.push(t.replaceWith)), n;
	}) : [];
};
function Dm(e) {
	let { editor: t, state: n, from: r, to: i, rule: a, pasteEvent: o, dropEvent: s } = e, { commands: c, chain: l, can: u } = new ku({
		editor: t,
		state: n
	}), d = [];
	return n.doc.nodesBetween(r, i, (e, t) => {
		var f;
		if ((f = e.type) != null && (f = f.spec) != null && f.code || !(e.isText || e.isTextblock || e.isInline)) return;
		let p = e.content?.size ?? e.nodeSize ?? 0, m = Math.max(r, t), h = Math.min(i, t + p);
		m >= h || Em(e.isText ? e.text || "" : e.textBetween(m - t, h - t, void 0, "￼"), a.find, o).forEach((e) => {
			if (e.index === void 0) return;
			let t = m + e.index + 1, r = t + e[0].length, i = {
				from: n.tr.mapping.map(t),
				to: n.tr.mapping.map(r)
			}, f = a.handler({
				state: n,
				range: i,
				match: e,
				commands: c,
				chain: l,
				can: u,
				pasteEvent: o,
				dropEvent: s
			});
			d.push(f);
		});
	}), d.every((e) => e !== null);
}
var Om = null, km = (e) => {
	var t;
	let n = new ClipboardEvent("paste", { clipboardData: new DataTransfer() });
	return (t = n.clipboardData) == null || t.setData("text/html", e), n;
};
function Am(e) {
	let { editor: t, rules: n } = e, r = null, i = !1, a = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, s;
	try {
		s = typeof DragEvent < "u" ? new DragEvent("drop") : null;
	} catch {
		s = null;
	}
	let c = ({ state: e, from: n, to: r, rule: i, pasteEvt: a }) => {
		let c = e.tr, l = Ou({
			state: e,
			transaction: c
		});
		if (Dm({
			editor: t,
			state: l,
			from: Math.max(n - 1, 0),
			to: r.b - 1,
			rule: i,
			pasteEvent: a,
			dropEvent: s
		}) && c.steps.length) {
			try {
				s = typeof DragEvent < "u" ? new DragEvent("drop") : null;
			} catch {
				s = null;
			}
			return o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, c;
		}
	};
	return t.on("destroy", () => {
		Om === t && (Om = null);
	}), n.map((e) => new R({
		view(e) {
			let n = (n) => {
				r = e.dom.parentElement?.contains(n.target) ? e.dom.parentElement : null, r && (Om = t);
			}, i = () => {
				Om &&= null;
			};
			return window.addEventListener("dragstart", n), window.addEventListener("dragend", i), { destroy() {
				window.removeEventListener("dragstart", n), window.removeEventListener("dragend", i);
			} };
		},
		props: { handleDOMEvents: {
			drop: (e, t) => {
				if (a = r === e.dom.parentElement, s = t, !a) {
					let e = Om;
					e?.isEditable && setTimeout(() => {
						if (e.isDestroyed) return;
						let t = e.state.selection;
						t && e.commands.deleteRange({
							from: t.from,
							to: t.to
						});
					}, 10);
				}
				return !1;
			},
			paste: (e, t) => {
				let n = t.clipboardData?.getData("text/html");
				return o = t, i = !!n?.includes("data-pm-slice"), !1;
			}
		} },
		appendTransaction: (t, n, r) => {
			let s = t[0], l = s.getMeta("uiEvent") === "paste" && !i, u = s.getMeta("uiEvent") === "drop" && !a, d = s.getMeta("applyPasteRules"), f = !!d;
			if (!l && !u && !f) return;
			if (f) {
				let { text: t } = d;
				t = typeof t == "string" ? t : $d(j.from(t), r.schema);
				let { from: n } = d, i = n + t.length, a = km(t);
				return c({
					rule: e,
					state: r,
					from: n,
					to: { b: i },
					pasteEvt: a
				});
			}
			let p = n.doc.content.findDiffStart(r.doc.content), m = n.doc.content.findDiffEnd(r.doc.content);
			if (sm(p) && m && p !== m.b) return c({
				rule: e,
				state: r,
				from: p,
				to: m,
				pasteEvt: o
			});
		}
	}));
}
var jm = class {
	constructor(e, t) {
		this.splittableMarks = [], this.nonClearableMarks = [], this.decorationManager = null, this.editor = t, this.baseExtensions = e, this.extensions = Cf(e), this.hasSchemaSpec = t.options.schemaSpec !== void 0, this.schema = xf(this.extensions, t, t.options.schemaSpec), this.setupExtensions();
	}
	get commands() {
		return this.extensions.reduce((e, t) => {
			let n = K(t, "addCommands", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: this.editor,
				type: Ff(t.name, this.schema)
			});
			return n ? {
				...e,
				...n()
			} : e;
		}, {});
	}
	get plugins() {
		let { editor: e } = this, t = Sf([...this.extensions].reverse()).flatMap((t) => {
			let n = {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: Ff(t.name, this.schema)
			}, r = [], i = K(t, "addKeyboardShortcuts", n), a = {};
			if (t.type === "mark" && K(t, "exitable", n) && (a.ArrowRight = () => wm.handleExit({
				editor: e,
				mark: t
			})), i) {
				let t = Object.fromEntries(Object.entries(i()).map(([t, n]) => [t, () => n({ editor: e })]));
				a = {
					...a,
					...t
				};
			}
			let o = tu(a);
			r.push(o);
			let s = K(t, "addInputRules", n);
			if (Hf(t, e.options.enableInputRules) && s) {
				let t = s();
				if (t && t.length) {
					let n = Sm({
						editor: e,
						rules: t
					}), i = Array.isArray(n) ? n : [n];
					r.push(...i);
				}
			}
			let c = K(t, "addPasteRules", n);
			if (Hf(t, e.options.enablePasteRules) && c) {
				let t = c();
				if (t && t.length) {
					let n = Am({
						editor: e,
						rules: t
					});
					r.push(...n);
				}
			}
			let l = K(t, "addProseMirrorPlugins", n);
			if (l) {
				let e = l();
				r.push(...e);
			}
			return r;
		}), n = this.createDecorationPlugin();
		return n && t.push(n), t;
	}
	createDecorationPlugin() {
		var e;
		let { editor: t } = this;
		(e = this.decorationManager) == null || e.destroy();
		let n = [];
		return this.extensions.forEach((e) => {
			let r = K(e, "addDecorations", {
				name: e.name,
				options: e.options,
				storage: this.editor.extensionStorage[e.name],
				editor: t,
				type: Ff(e.name, this.schema)
			});
			r && n.push({
				name: e.name,
				addDecorations: r
			});
		}), this.decorationManager = new rm({
			editor: t,
			entries: n
		}), this.decorationManager.plugin;
	}
	get attributes() {
		let e = uf(this.extensions);
		return this.hasSchemaSpec ? ef(e, this.schema) : e;
	}
	get nodeViews() {
		let { editor: e } = this, { nodeExtensions: t } = lf(this.extensions);
		return Object.fromEntries(t.filter((e) => !!K(e, "addNodeView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = K(t, "addNodeView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: G(t.name, this.schema)
			});
			if (!r) return [];
			let i = r();
			return i ? [t.name, (r, a, o, s, c) => {
				let l = hf(r, n);
				return i({
					node: r,
					view: a,
					getPos: o,
					decorations: s,
					innerDecorations: c,
					editor: e,
					extension: t,
					HTMLAttributes: l
				});
			}] : [];
		}));
	}
	dispatchTransaction(e) {
		let { editor: t } = this;
		return Sf([...this.extensions].reverse()).reduceRight((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: Ff(n.name, this.schema)
			}, i = K(n, "dispatchTransaction", r);
			return i ? (t) => {
				i.call(r, {
					transaction: t,
					next: e
				});
			} : e;
		}, e);
	}
	transformPastedHTML(e) {
		let { editor: t } = this;
		return Sf([...this.extensions]).reduce((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: Ff(n.name, this.schema)
			}, i = K(n, "transformPastedHTML", r);
			return i ? (t, n) => {
				let a = e(t, n);
				return i.call(r, a);
			} : e;
		}, e || ((e) => e));
	}
	get markViews() {
		let { editor: e } = this, { markExtensions: t } = lf(this.extensions);
		return Object.fromEntries(t.filter((e) => !!K(e, "addMarkView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = K(t, "addMarkView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: Xu(t.name, this.schema)
			});
			return r ? [t.name, (i, a, o) => {
				let s = hf(i, n);
				return r()({
					mark: i,
					view: a,
					inline: o,
					editor: e,
					extension: t,
					HTMLAttributes: s,
					updateAttributes: (t) => {
						hm(i, e, t);
					}
				});
			}] : [];
		}));
	}
	destroy() {
		var e;
		(e = this.decorationManager) == null || e.destroy(), this.extensions.forEach((e) => {
			let t = e;
			for (; t.parent;) {
				let e = t.parent;
				e.child === t && (e.child = null), t = e;
			}
		}), this.extensions = [], this.baseExtensions = [], this.decorationManager = null, this.schema = null, this.editor = null;
	}
	setupExtensions() {
		let e = this.extensions;
		this.editor.extensionStorage = Object.fromEntries(e.map((e) => [e.name, e.storage])), e.forEach((e) => {
			let t = {
				name: e.name,
				options: e.options,
				storage: this.editor.extensionStorage[e.name],
				editor: this.editor,
				type: Ff(e.name, this.schema)
			};
			e.type === "mark" && ((q(K(e, "keepOnSplit", t)) ?? !0) && this.splittableMarks.push(e.name), (q(K(e, "clearable", t)) ?? !0) || this.nonClearableMarks.push(e.name));
			let n = K(e, "onBeforeCreate", t), r = K(e, "onCreate", t), i = K(e, "onUpdate", t), a = K(e, "onSelectionUpdate", t), o = K(e, "onTransaction", t), s = K(e, "onFocus", t), c = K(e, "onBlur", t), l = K(e, "onDestroy", t);
			n && this.editor.on("beforeCreate", n), r && this.editor.on("create", r), i && this.editor.on("update", i), a && this.editor.on("selectionUpdate", a), o && this.editor.on("transaction", o), s && this.editor.on("focus", s), c && this.editor.on("blur", c), l && this.editor.on("destroy", l);
		});
	}
};
jm.resolve = Cf, jm.sort = Sf, jm.flatten = Qd;
var Y = class e extends Cm {
	constructor(...e) {
		super(...e), this.type = "extension";
	}
	static create(t = {}) {
		let n = typeof t == "function" ? t() : t;
		return new e(n);
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
}, Mm = Y.create({
	name: "clipboardTextSerializer",
	addOptions() {
		return { blockSeparator: void 0 };
	},
	addProseMirrorPlugins() {
		return [new R({
			key: new z("clipboardTextSerializer"),
			props: { clipboardTextSerializer: () => {
				let { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: i } = t, a = Ef(n), { blockSeparator: o } = this.options, s = {
					...o === void 0 ? {} : { blockSeparator: o },
					textSerializers: a
				};
				return [...i.ranges].sort((e, t) => e.$from.pos - t.$from.pos).map(({ $from: e, $to: t }) => wf(r, {
					from: e.pos,
					to: t.pos
				}, s)).join(o ?? "\n\n");
			} }
		})];
	}
}), Nm = Y.create({
	name: "commands",
	addCommands() {
		return { ...Np };
	}
}), Pm = Y.create({
	name: "delete",
	onUpdate({ transaction: e, appendedTransactions: t }) {
		var n;
		let r = () => {
			var n, r;
			if (((n = this.editor.options.coreExtensionOptions) == null || (n = n.delete) == null || (r = n.filterTransaction) == null ? void 0 : r.call(n, e)) ?? e.getMeta("y-sync$")) return;
			let i = qd(e.before, [e, ...t]);
			jf(i).forEach((t) => {
				i.mapping.mapResult(t.oldRange.from).deletedAfter && i.mapping.mapResult(t.oldRange.to).deletedBefore && i.before.nodesBetween(t.oldRange.from, t.oldRange.to, (n, r) => {
					let a = r + n.nodeSize - 2, o = t.oldRange.from <= r && a <= t.oldRange.to;
					this.editor.emit("delete", {
						type: "node",
						node: n,
						from: r,
						to: a,
						newFrom: i.mapping.map(r),
						newTo: i.mapping.map(a),
						deletedRange: t.oldRange,
						newRange: t.newRange,
						partial: !o,
						editor: this.editor,
						transaction: e,
						combinedTransform: i
					});
				});
			});
			let a = i.mapping;
			i.steps.forEach((t, n) => {
				if (t instanceof cr) {
					let r = a.slice(n).map(t.from, -1), o = a.slice(n).map(t.to), s = a.invert().map(r, -1), c = a.invert().map(o), l = r > 0 && i.doc.nodeAt(r - 1)?.marks.some((e) => e.eq(t.mark)), u = i.doc.nodeAt(o)?.marks.some((e) => e.eq(t.mark));
					this.editor.emit("delete", {
						type: "mark",
						mark: t.mark,
						from: t.from,
						to: t.to,
						deletedRange: {
							from: s,
							to: c
						},
						newRange: {
							from: r,
							to: o
						},
						partial: !!(u || l),
						editor: this.editor,
						transaction: e,
						combinedTransform: i
					});
				}
			});
		};
		((n = this.editor.options.coreExtensionOptions) == null || (n = n.delete) == null ? void 0 : n.async) ?? !0 ? setTimeout(r, 0) : r();
	}
}), Fm = Y.create({
	name: "drop",
	addProseMirrorPlugins() {
		return [new R({
			key: new z("tiptapDrop"),
			props: { handleDrop: (e, t, n, r) => {
				this.editor.emit("drop", {
					editor: this.editor,
					event: t,
					slice: n,
					moved: r
				});
			} }
		})];
	}
}), Im = Y.create({
	name: "editable",
	addProseMirrorPlugins() {
		return [new R({
			key: new z("editable"),
			props: { editable: () => this.editor.options.editable }
		})];
	}
}), Lm = new z("focusEvents"), Rm = Y.create({
	name: "focusEvents",
	addProseMirrorPlugins() {
		let { editor: e } = this;
		return [new R({
			key: Lm,
			props: { handleDOMEvents: {
				focus: (t, n) => {
					e.isFocused = !0;
					let r = e.state.tr.setMeta("focus", { event: n }).setMeta("addToHistory", !1);
					return t.dispatch(r), !1;
				},
				blur: (t, n) => {
					e.isFocused = !1;
					let r = e.state.tr.setMeta("blur", { event: n }).setMeta("addToHistory", !1);
					return t.dispatch(r), !1;
				}
			} }
		})];
	}
}), zm = Y.create({
	name: "keymap",
	addKeyboardShortcuts() {
		let e = () => this.editor.commands.first(({ commands: e }) => [
			() => e.undoInputRule(),
			() => e.command(({ tr: t }) => {
				let { selection: n, doc: r } = t, { empty: i, $anchor: a } = n, { pos: o, parent: s } = a, c = a.parent.isTextblock && o > 0 ? t.doc.resolve(o - 1) : a, l = c.parent.type.spec.isolating, u = a.pos - a.parentOffset, d = l && c.parent.childCount === 1 ? u === a.pos : F.atStart(r).from === o;
				return !i || !s.type.isTextblock || s.textContent.length || !d || d && a.parent.type.name === "paragraph" ? !1 : e.clearNodes();
			}),
			() => e.deleteSelection(),
			() => e.joinBackward(),
			() => e.selectNodeBackward()
		]), t = () => this.editor.commands.first(({ commands: e }) => [
			() => e.deleteSelection(),
			() => e.deleteCurrentNode(),
			() => e.joinForward(),
			() => e.selectNodeForward()
		]), n = {
			Enter: () => this.editor.commands.first(({ commands: e }) => [
				() => e.newlineInCode(),
				() => e.createParagraphNear(),
				() => e.liftEmptyBlock(),
				() => e.splitBlock()
			]),
			"Mod-Enter": () => this.editor.commands.exitCode(),
			Backspace: e,
			"Mod-Backspace": e,
			"Shift-Backspace": e,
			Delete: t,
			"Mod-Delete": t,
			"Mod-a": () => this.editor.commands.selectAll()
		}, r = { ...n }, i = {
			...n,
			"Ctrl-h": e,
			"Alt-Backspace": e,
			"Ctrl-d": t,
			"Ctrl-Alt-Backspace": t,
			"Alt-Delete": t,
			"Alt-d": t,
			"Ctrl-a": () => this.editor.commands.selectTextblockStart(),
			"Ctrl-e": () => this.editor.commands.selectTextblockEnd()
		};
		return rd() || Ed() ? i : r;
	},
	addProseMirrorPlugins() {
		return [new R({
			key: new z("clearDocument"),
			appendTransaction: (e, t, n) => {
				if (e.some((e) => e.getMeta("composition"))) return;
				let r = e.some((e) => e.docChanged) && !t.doc.eq(n.doc), i = e.some((e) => e.getMeta("preventClearDocument"));
				if (!r || i) return;
				let { empty: a, from: o, to: s } = t.selection, c = F.atStart(t.doc).from, l = F.atEnd(t.doc).to;
				if (a || o !== c || s !== l || !Wf(n.doc)) return;
				let u = n.tr, d = Ou({
					state: n,
					transaction: u
				}), { commands: f } = new ku({
					editor: this.editor,
					state: d
				});
				if (f.clearNodes(), u.steps.length) return u;
			}
		})];
	}
}), Bm = Y.create({
	name: "paste",
	addProseMirrorPlugins() {
		return [new R({
			key: new z("tiptapPaste"),
			props: { handlePaste: (e, t, n) => {
				this.editor.emit("paste", {
					editor: this.editor,
					event: t,
					slice: n
				});
			} }
		})];
	}
}), Vm = Y.create({
	name: "tabindex",
	addOptions() {
		return { value: void 0 };
	},
	addProseMirrorPlugins() {
		return [new R({
			key: new z("tabindex"),
			props: { attributes: () => !this.editor.isEditable && this.options.value === void 0 ? {} : { tabindex: this.options.value ?? "0" } }
		})];
	}
}), Hm = Y.create({
	name: "textDirection",
	addOptions() {
		return { direction: void 0 };
	},
	addGlobalAttributes() {
		if (!this.options.direction) return [];
		let { nodeExtensions: e } = lf(this.extensions);
		return [{
			types: e.filter((e) => e.name !== "text").map((e) => e.name),
			attributes: { dir: {
				default: this.options.direction,
				parseHTML: (e) => {
					let t = e.getAttribute("dir");
					return t && (t === "ltr" || t === "rtl" || t === "auto") ? t : this.options.direction;
				},
				renderHTML: (e) => e.dir ? { dir: e.dir } : {}
			} }
		}];
	},
	addProseMirrorPlugins() {
		return [new R({
			key: new z("textDirection"),
			props: { attributes: () => {
				let e = this.options.direction;
				return e ? { dir: e } : {};
			} }
		})];
	}
}), Um = !1;
function Wm(e) {
	if (Um) return;
	Um = !0;
	let t;
	try {
		let n = pr.fromJSON(e, {
			from: 0,
			to: 0
		});
		if (!qf(n)) return;
		t = n.slice.content;
	} catch {
		return;
	}
	t instanceof j || console.warn("[tiptap warn]: prosemirror-model is loaded more than once. Wrapping and splitting nodes will fail. Deduplicate it in your lock file, or alias it to a single copy in your bundler.");
}
var Gm = class e {
	get name() {
		return this.node.type.name;
	}
	constructor(e, t, n = !1, r = null) {
		this.currentNode = null, this.actualDepth = null, this.isBlock = n, this.resolvedPos = e, this.editor = t, this.currentNode = r;
	}
	get node() {
		return this.currentNode || this.resolvedPos.node();
	}
	get element() {
		return this.editor.view.domAtPos(this.pos).node;
	}
	get depth() {
		return this.actualDepth ?? this.resolvedPos.depth;
	}
	get pos() {
		return this.resolvedPos.pos;
	}
	get content() {
		return this.node.content;
	}
	set content(e) {
		let t = this.from, n = this.to;
		if (this.isBlock) {
			if (this.content.size === 0) {
				console.error(`You can’t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`);
				return;
			}
			t = this.from + 1, n = this.to - 1;
		}
		this.editor.commands.insertContentAt({
			from: t,
			to: n
		}, e);
	}
	get attributes() {
		return this.node.attrs;
	}
	get textContent() {
		return this.node.textContent;
	}
	get size() {
		return this.node.nodeSize;
	}
	get from() {
		return this.isBlock ? this.pos : this.resolvedPos.start(this.resolvedPos.depth);
	}
	get range() {
		return {
			from: this.from,
			to: this.to
		};
	}
	get to() {
		return this.isBlock ? this.pos + this.size : this.resolvedPos.end(this.resolvedPos.depth) + +!this.node.isText;
	}
	get parent() {
		if (this.depth === 0) return null;
		let t = this.resolvedPos.start(this.resolvedPos.depth - 1), n = this.resolvedPos.doc.resolve(t);
		return new e(n, this.editor);
	}
	get before() {
		let t = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
		return t.depth !== this.depth && (t = this.resolvedPos.doc.resolve(this.from - 3)), new e(t, this.editor);
	}
	get after() {
		let t = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
		return t.depth !== this.depth && (t = this.resolvedPos.doc.resolve(this.to + 3)), new e(t, this.editor);
	}
	get children() {
		let t = [];
		return this.node.content.forEach((n, r) => {
			let i = n.isBlock && !n.isTextblock, a = n.isAtom && !n.isText, o = n.isInline, s = this.pos + r + +!a;
			if (s < 0 || s > this.resolvedPos.doc.nodeSize - 2) return;
			let c = this.resolvedPos.doc.resolve(s);
			if (!i && !o && c.depth <= this.depth) return;
			let l = new e(c, this.editor, i, i || o ? n : null);
			i && (l.actualDepth = this.depth + 1), t.push(l);
		}), t;
	}
	get firstChild() {
		return this.children[0] || null;
	}
	get lastChild() {
		let e = this.children;
		return e[e.length - 1] || null;
	}
	closest(e, t = {}) {
		let n = null, r = this.parent;
		for (; r && !n;) {
			if (r.node.type.name === e) {
				if (Object.keys(t).length > 0) {
					let e = r.node.attrs, n = Object.keys(t);
					for (let r = 0; r < n.length; r += 1) {
						let i = n[r];
						if (e[i] !== t[i]) break;
					}
				} else n = r;
			}
			r = r.parent;
		}
		return n;
	}
	querySelector(e, t = {}) {
		return this.querySelectorAll(e, t, !0)[0] || null;
	}
	querySelectorAll(e, t = {}, n = !1) {
		let r = [];
		if (!this.children || this.children.length === 0) return r;
		let i = Object.keys(t);
		return this.children.forEach((a) => {
			n && r.length > 0 || (a.node.type.name === e && i.every((e) => t[e] === a.node.attrs[e]) && r.push(a), !(n && r.length > 0) && (r = r.concat(a.querySelectorAll(e, t, n))));
		}), r;
	}
	setAttribute(e) {
		let { tr: t } = this.editor.state;
		t.setNodeMarkup(this.from, void 0, {
			...this.node.attrs,
			...e
		}), this.editor.view.dispatch(t);
	}
}, Km = ".ProseMirror {\n  position: relative;\n}\n\n.ProseMirror {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  white-space: break-spaces;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none;\n  font-feature-settings: \"liga\" 0; /* the above doesn't seem to work in Edge */\n}\n\n.ProseMirror [contenteditable=\"false\"] {\n  white-space: normal;\n}\n\n.ProseMirror [contenteditable=\"false\"] [contenteditable=\"true\"] {\n  white-space: pre-wrap;\n}\n\n.ProseMirror pre {\n  white-space: pre-wrap;\n}\n\nimg.ProseMirror-separator {\n  display: inline !important;\n  border: none !important;\n  margin: 0 !important;\n  width: 0 !important;\n  height: 0 !important;\n}\n\n.ProseMirror-gapcursor {\n  display: none;\n  pointer-events: none;\n  position: absolute;\n  margin: 0;\n}\n\n.ProseMirror-gapcursor:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: -2px;\n  width: 20px;\n  border-top: 1px solid black;\n  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;\n}\n\n@keyframes ProseMirror-cursor-blink {\n  to {\n    visibility: hidden;\n  }\n}\n\n.ProseMirror-hideselection *::selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection *::-moz-selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection * {\n  caret-color: transparent;\n}\n\n.ProseMirror-focused .ProseMirror-gapcursor {\n  display: block;\n}", qm = class extends Lp {
	constructor(e = {}) {
		super(), this.css = null, this.className = "tiptap", this.editorView = null, this.isFocused = !1, this.destroyed = !1, this.isInitialized = !1, this.extensionStorage = {}, this.instanceId = Math.random().toString(36).slice(2, 9), this.hasWarnedStaleDecorationRead = !1, this.options = {
			element: typeof document < "u" ? document.createElement("div") : null,
			content: "",
			injectCSS: !0,
			injectNonce: void 0,
			extensions: [],
			autofocus: !1,
			editable: !0,
			textDirection: void 0,
			editorProps: {},
			parseOptions: {},
			coreExtensionOptions: {},
			enableInputRules: !0,
			enablePasteRules: !0,
			enableCoreExtensions: !0,
			enableContentCheck: !1,
			emitContentError: !1,
			onBeforeCreate: () => null,
			onCreate: () => null,
			onMount: () => null,
			onUnmount: () => null,
			onUpdate: () => null,
			onSelectionUpdate: () => null,
			onTransaction: () => null,
			onFocus: () => null,
			onBlur: () => null,
			onDestroy: () => null,
			onContentError: ({ error: e }) => {
				throw e;
			},
			onPaste: () => null,
			onDrop: () => null,
			onDelete: () => null,
			enableExtensionDispatchTransaction: !0
		}, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.utils = {
			getUpdatedPosition: Yf,
			createMappablePosition: Xf
		}, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: e, slice: t, moved: n }) => this.options.onDrop(e, t, n)), this.on("paste", ({ event: e, slice: t }) => this.options.onPaste(e, t)), this.on("delete", this.options.onDelete);
		let t = this.createDoc();
		if (!this.editorState) {
			let e = td(t, this.options.autofocus);
			this.editorState = Ti.create({
				doc: t,
				schema: this.schema,
				selection: e || void 0
			});
		}
		Wm(this.schema), this.options.element && this.mount(this.options.element);
	}
	mount(e) {
		if (typeof document > "u") throw Error("[tiptap error]: The editor cannot be mounted because there is no 'document' defined in this environment.");
		this.createView(e), this.emit("mount", { editor: this }), this.css && !document.head.contains(this.css) && document.head.appendChild(this.css), window.setTimeout(() => {
			this.isDestroyed || (this.options.autofocus !== !1 && this.options.autofocus !== null && this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }), this.isInitialized = !0);
		}, 0);
	}
	unmount() {
		if (this.editorView) {
			this.editorState = this.editorView.state;
			let e = this.editorView.dom;
			e?.editor && delete e.editor, this.editorView.destroy();
		}
		if (this.editorView = null, this.isInitialized = !1, this.css && !document.querySelectorAll(`.${this.className}`).length) try {
			typeof this.css.remove == "function" ? this.css.remove() : this.css.parentNode && this.css.parentNode.removeChild(this.css);
		} catch (e) {
			console.warn("Failed to remove CSS element:", e);
		}
		this.css = null, this.emit("unmount", { editor: this });
	}
	get storage() {
		return this.extensionStorage;
	}
	get commands() {
		return this.commandManager.commands;
	}
	chain() {
		return this.commandManager ? this.commandManager.chain() : ku.createFakeChain();
	}
	can() {
		return this.commandManager ? this.commandManager.can() : ku.createFallbackCan();
	}
	injectCSS() {
		this.options.injectCSS && typeof document < "u" && (this.css = am(Km, this.options.injectNonce));
	}
	setOptions(e = {}) {
		this.options = {
			...this.options,
			...e
		}, this.editorView && this.state && !this.isDestroyed && (this.options.editorProps && this.view.setProps({
			...this.options.editorProps,
			attributes: this.getEditorViewAttributes()
		}), this.view.updateState(this.state));
	}
	setEditable(e, t = !0) {
		this.setOptions({ editable: e }), t && this.emit("update", {
			editor: this,
			transaction: this.state.tr,
			appendedTransactions: []
		});
	}
	get isEditable() {
		return this.options.editable && this.view && this.view.editable;
	}
	get view() {
		return this.editorView ? this.editorView : new Proxy({
			state: this.editorState,
			updateState: (e) => {
				this.editorState = e;
			},
			dispatch: (e) => {
				this.dispatchTransaction(e);
			},
			composing: !1,
			dragging: null,
			editable: !0,
			isDestroyed: !1
		}, { get: (e, t) => {
			if (this.editorView) return this.editorView[t];
			if (t === "state") return this.editorState;
			if (t in e) return Reflect.get(e, t);
			throw Error(`[tiptap error]: The editor view is not available. Cannot access view['${t}']. The editor may not be mounted yet.`);
		} });
	}
	get state() {
		return Rp && !this.hasWarnedStaleDecorationRead && Ip(this) && (this.hasWarnedStaleDecorationRead = !0, console.warn("[tiptap warn]: `editor.state` was read while decoration `create()` was running. It returns the pre-transaction document. Use the `state` argument passed to `create()` instead. Helpers like `editor.isActive()` read `editor.state` too, so pass `state` to their standalone versions instead of calling them on the editor.")), this.editorView && (this.editorState = this.view.state), this.editorState;
	}
	registerPlugin(e, t) {
		let n = df(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], r = this.state.reconfigure({ plugins: n });
		return this.view.updateState(r), r;
	}
	unregisterPlugin(e) {
		if (this.isDestroyed) return;
		let t = this.state.plugins, n = t;
		if ([].concat(e).forEach((e) => {
			let t = typeof e == "string" ? `${e}$` : e.key;
			n = n.filter((e) => !e.key.startsWith(t));
		}), t.length === n.length) return;
		let r = this.state.reconfigure({ plugins: n });
		return this.view.updateState(r), r;
	}
	createExtensionManager() {
		var e, t;
		let n = [...this.options.enableCoreExtensions ? [
			Im,
			Mm.configure({ blockSeparator: (e = this.options.coreExtensionOptions) == null || (e = e.clipboardTextSerializer) == null ? void 0 : e.blockSeparator }),
			Nm,
			Rm,
			zm,
			Vm.configure({ value: (t = this.options.coreExtensionOptions) == null || (t = t.tabindex) == null ? void 0 : t.value }),
			Fm,
			Bm,
			Pm,
			Hm.configure({ direction: this.options.textDirection })
		].filter((e) => typeof this.options.enableCoreExtensions != "object" || this.options.enableCoreExtensions[e.name] !== !1) : [], ...this.options.extensions].filter((e) => [
			"extension",
			"node",
			"mark"
		].includes(e?.type));
		this.extensionManager = new jm(n, this);
	}
	createCommandManager() {
		this.commandManager = new ku({ editor: this });
	}
	createSchema() {
		this.schema = this.extensionManager.schema;
	}
	createDoc() {
		let e;
		try {
			e = Wd(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: this.options.enableContentCheck });
		} catch (e) {
			if (!(e instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(e.message)) throw e;
			let t = Wd(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: !1 });
			return this.editorState = Ti.create({
				doc: t,
				schema: this.schema,
				selection: td(t, this.options.autofocus) || void 0
			}), this.emit("contentError", {
				editor: this,
				error: e,
				disableCollaboration: () => {
					"collaboration" in this.storage && typeof this.storage.collaboration == "object" && this.storage.collaboration && (this.storage.collaboration.isDisabled = !0), this.options.extensions = this.options.extensions.filter((e) => e.name !== "collaboration"), this.createExtensionManager();
				}
			}), this.editorState.doc;
		}
		return e;
	}
	getEditorViewAttributes() {
		let e = this.options.editorProps?.attributes;
		return df(e) ? (t) => ({
			role: "textbox",
			...e(t)
		}) : {
			role: "textbox",
			...e
		};
	}
	createView(e) {
		let { editorProps: t, enableExtensionDispatchTransaction: n } = this.options, r = t.dispatchTransaction || this.dispatchTransaction.bind(this), i = n ? this.extensionManager.dispatchTransaction(r) : r, a = t.transformPastedHTML, o = this.extensionManager.transformPastedHTML(a);
		this.editorView = new Fl(e, {
			...t,
			attributes: this.getEditorViewAttributes(),
			dispatchTransaction: i,
			transformPastedHTML: o,
			state: this.editorState,
			markViews: this.extensionManager.markViews,
			nodeViews: this.extensionManager.nodeViews
		});
		let s = this.state.reconfigure({ plugins: this.extensionManager.plugins });
		this.view.updateState(s), this.prependClass(), this.injectCSS();
		let c = this.view.dom;
		c.editor = this;
	}
	createNodeViews() {
		this.view.isDestroyed || this.view.setProps({
			markViews: this.extensionManager.markViews,
			nodeViews: this.extensionManager.nodeViews
		});
	}
	prependClass() {
		this.view.dom.className = `${this.className} ${this.view.dom.className}`;
	}
	captureTransaction(e) {
		this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
		let t = this.capturedTransaction;
		return this.capturedTransaction = null, t;
	}
	dispatchTransaction(e) {
		if (this.view.isDestroyed) return;
		if (this.isCapturingTransaction) {
			if (!this.capturedTransaction) {
				this.capturedTransaction = e;
				return;
			}
			e.steps.forEach((e) => this.capturedTransaction?.step(e));
			return;
		}
		let { state: t, transactions: n } = this.state.applyTransaction(e), r = !this.state.selection.eq(t.selection), i = n.includes(e), a = this.state;
		if (this.emit("beforeTransaction", {
			editor: this,
			transaction: e,
			nextState: t
		}), !i) return;
		this.view.updateState(t), this.emit("transaction", {
			editor: this,
			transaction: e,
			appendedTransactions: n.slice(1)
		}), r && this.emit("selectionUpdate", {
			editor: this,
			transaction: e
		});
		let o = n.findLast((e) => e.getMeta("focus") || e.getMeta("blur")), s = o?.getMeta("focus"), c = o?.getMeta("blur");
		s && this.emit("focus", {
			editor: this,
			event: s.event,
			transaction: o
		}), c && this.emit("blur", {
			editor: this,
			event: c.event,
			transaction: o
		}), !(e.getMeta("preventUpdate") || !n.some((e) => e.docChanged) || a.doc.eq(t.doc)) && this.emit("update", {
			editor: this,
			transaction: e,
			appendedTransactions: n.slice(1)
		});
	}
	getAttributes(e) {
		return Of(this.state, e);
	}
	isActive(e, t) {
		let n = typeof e == "string" ? e : null, r = typeof e == "string" ? t : e;
		return zf(this.state, n, r);
	}
	getJSON() {
		return this.state.doc.toJSON();
	}
	getHTML() {
		return $d(this.state.doc.content, this.schema);
	}
	getText(e) {
		let { blockSeparator: t = "\n\n", textSerializers: n = {} } = e || {};
		return Tf(this.state.doc, {
			blockSeparator: t,
			textSerializers: {
				...Ef(this.schema),
				...n
			}
		});
	}
	get isEmpty() {
		return Wf(this.state.doc);
	}
	destroy() {
		this.destroyed || (this.destroyed = !0, this.emit("destroy"), this.unmount(), this.removeAllListeners(), this.extensionManager.destroy(), this.extensionManager = null, this.schema = null, this.commandManager = null, this.extensionStorage = {});
	}
	get isDestroyed() {
		return this.editorView?.isDestroyed ?? !0;
	}
	$node(e, t) {
		return this.$doc?.querySelector(e, t) || null;
	}
	$nodes(e, t) {
		return this.$doc?.querySelectorAll(e, t) || null;
	}
	$pos(e) {
		let t = this.state.doc.resolve(e), n = e > 0 && t.nodeAfter && !t.nodeAfter.isText && t.nodeAfter.isAtom ? t.nodeAfter : null;
		return new Gm(t, this, !1, n);
	}
	get $doc() {
		return this.$pos(0);
	}
};
function Jm(e) {
	return new gm({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = q(e.getAttributes, void 0, r);
			if (i === !1 || i === null) return null;
			let { tr: a } = t, o = r[r.length - 1], s = r[0];
			if (o) {
				let r = s.search(/\S/), c = n.from + s.indexOf(o), l = c + o.length;
				if (Mf(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > c).length) return null;
				l < n.to && a.delete(l, n.to), c > n.from && a.delete(n.from + r, c);
				let u = n.from + r + o.length;
				a.addMark(n.from + r, u, e.type.create(i || {})), a.removeStoredMark(e.type);
			}
		},
		undoable: e.undoable
	});
}
function Ym(e) {
	return new gm({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = q(e.getAttributes, void 0, r) || {}, { tr: a } = t, o = n.from, s = n.to, c = e.type.create(i);
			if (r[1]) {
				let e = o + r[0].lastIndexOf(r[1]);
				e > s ? e = s : s = e + r[1].length;
				let t = r[0][r[0].length - 1];
				a.insertText(t, o + r[0].length - 1), a.replaceWith(e, s, c);
			} else if (r[0]) {
				let t = e.type.isInline ? o : o - 1;
				a.insert(t, e.type.create(i)).delete(a.mapping.map(o), a.mapping.map(s));
			}
			a.scrollIntoView();
		},
		undoable: e.undoable
	});
}
function Xm(e) {
	return new gm({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = t.doc.resolve(n.from), a = q(e.getAttributes, void 0, r) || {};
			if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), e.type)) return null;
			t.tr.delete(n.from, n.to).setBlockType(n.from, n.from, e.type, a);
		},
		undoable: e.undoable
	});
}
function Zm(e) {
	return new gm({
		find: e.find,
		handler: ({ state: t, range: n, match: r, chain: i }) => {
			let a = q(e.getAttributes, void 0, r) || {}, o = t.tr.delete(n.from, n.to), s = o.doc.resolve(n.from).blockRange(), c = s && Sr(s, e.type, a);
			if (!c) return null;
			if (o.wrap(s, c), e.keepMarks && e.editor) {
				let { selection: n, storedMarks: r } = t, { splittableMarks: i } = e.editor.extensionManager, a = r || n.$to.parentOffset && n.$from.marks();
				if (a) {
					let e = a.filter((e) => i.includes(e.type.name));
					o.ensureMarks(e);
				}
			}
			if (e.keepAttributes) {
				let t = e.type.name === "bulletList" || e.type.name === "orderedList" ? "listItem" : "taskList";
				i().updateAttributes(t, a).run();
			}
			let l = o.doc.resolve(n.from - 1).nodeBefore;
			l && l.type === e.type && Pr(o.doc, n.from - 1) && (!e.joinPredicate || e.joinPredicate(r, l)) && o.join(n.from - 1);
		},
		undoable: e.undoable
	});
}
var Qm = (e) => "touches" in e, $m = class {
	constructor(e) {
		var t;
		this.directions = [
			"bottom-left",
			"bottom-right",
			"top-left",
			"top-right"
		], this.minSize = {
			height: 8,
			width: 8
		}, this.preserveAspectRatio = !1, this.classNames = {
			container: "",
			wrapper: "",
			handle: "",
			resizing: ""
		}, this.initialWidth = 0, this.initialHeight = 0, this.aspectRatio = 1, this.isResizing = !1, this.activeHandle = null, this.startX = 0, this.startY = 0, this.startWidth = 0, this.startHeight = 0, this.isShiftKeyPressed = !1, this.lastEditableState = void 0, this.handleMap = /* @__PURE__ */ new Map(), this.handleMouseMove = (e) => {
			if (!this.isResizing || !this.activeHandle) return;
			let t = e.clientX - this.startX, n = e.clientY - this.startY;
			this.handleResize(t, n);
		}, this.handleTouchMove = (e) => {
			if (!this.isResizing || !this.activeHandle) return;
			let t = e.touches[0];
			if (!t) return;
			let n = t.clientX - this.startX, r = t.clientY - this.startY;
			this.handleResize(n, r);
		}, this.handleMouseUp = () => {
			if (!this.isResizing) return;
			let e = this.element.offsetWidth, t = this.element.offsetHeight;
			this.onCommit(e, t), this.isResizing = !1, this.activeHandle = null, this.container.dataset.resizeState = "false", this.classNames.resizing && this.container.classList.remove(this.classNames.resizing), document.removeEventListener("mousemove", this.handleMouseMove), document.removeEventListener("mouseup", this.handleMouseUp), document.removeEventListener("keydown", this.handleKeyDown), document.removeEventListener("keyup", this.handleKeyUp);
		}, this.handleKeyDown = (e) => {
			e.key === "Shift" && (this.isShiftKeyPressed = !0);
		}, this.handleKeyUp = (e) => {
			e.key === "Shift" && (this.isShiftKeyPressed = !1);
		}, this.node = e.node, this.editor = e.editor, this.element = e.element, this.element.draggable = !1, this.contentElement = e.contentElement, this.getPos = e.getPos, this.onResize = e.onResize, this.onCommit = e.onCommit, this.onUpdate = e.onUpdate, e.options?.min && (this.minSize = {
			...this.minSize,
			...e.options.min
		}), e.options?.max && (this.maxSize = e.options.max), e != null && (t = e.options) != null && t.directions && (this.directions = e.options.directions), e.options?.preserveAspectRatio && (this.preserveAspectRatio = e.options.preserveAspectRatio), e.options?.className && (this.classNames = {
			container: e.options.className.container || "",
			wrapper: e.options.className.wrapper || "",
			handle: e.options.className.handle || "",
			resizing: e.options.className.resizing || ""
		}), e.options?.createCustomHandle && (this.createCustomHandle = e.options.createCustomHandle), this.wrapper = this.createWrapper(), this.container = this.createContainer(), this.applyInitialSize(), this.attachHandles(), this.editor.on("update", this.handleEditorUpdate.bind(this));
	}
	get dom() {
		return this.container;
	}
	get contentDOM() {
		return this.contentElement ?? null;
	}
	handleEditorUpdate() {
		let e = this.editor.isEditable;
		e !== this.lastEditableState && (this.lastEditableState = e, e ? e && this.handleMap.size === 0 && this.attachHandles() : this.removeHandles());
	}
	update(e, t, n) {
		return e.type === this.node.type && (this.node = e, !this.onUpdate || this.onUpdate(e, t, n));
	}
	destroy() {
		this.isResizing && (this.container.dataset.resizeState = "false", this.classNames.resizing && this.container.classList.remove(this.classNames.resizing), document.removeEventListener("mousemove", this.handleMouseMove), document.removeEventListener("mouseup", this.handleMouseUp), document.removeEventListener("keydown", this.handleKeyDown), document.removeEventListener("keyup", this.handleKeyUp), this.isResizing = !1, this.activeHandle = null), this.editor.off("update", this.handleEditorUpdate.bind(this)), this.container.remove();
	}
	createContainer() {
		let e = document.createElement("div");
		return e.dataset.resizeContainer = "", e.dataset.node = this.node.type.name, e.style.display = this.node.type.isInline ? "inline-flex" : "flex", this.classNames.container && (e.className = this.classNames.container), e.appendChild(this.wrapper), e;
	}
	createWrapper() {
		let e = document.createElement("div");
		return e.style.position = "relative", e.style.display = "block", e.dataset.resizeWrapper = "", this.classNames.wrapper && (e.className = this.classNames.wrapper), e.appendChild(this.element), e;
	}
	createHandle(e) {
		let t = document.createElement("div");
		return t.dataset.resizeHandle = e, t.style.position = "absolute", this.classNames.handle && (t.className = this.classNames.handle), t;
	}
	positionHandle(e, t) {
		let n = t.includes("top"), r = t.includes("bottom"), i = t.includes("left"), a = t.includes("right");
		n && (e.style.top = "0"), r && (e.style.bottom = "0"), i && (e.style.left = "0"), a && (e.style.right = "0"), (t === "top" || t === "bottom") && (e.style.left = "0", e.style.right = "0"), (t === "left" || t === "right") && (e.style.top = "0", e.style.bottom = "0");
	}
	attachHandles() {
		this.directions.forEach((e) => {
			let t;
			t = this.createCustomHandle ? this.createCustomHandle(e) : this.createHandle(e), t instanceof HTMLElement || (console.warn(`[ResizableNodeView] createCustomHandle("${e}") did not return an HTMLElement. Falling back to default handle.`), t = this.createHandle(e)), this.createCustomHandle || this.positionHandle(t, e), t.addEventListener("mousedown", (t) => this.handleResizeStart(t, e)), t.addEventListener("touchstart", (t) => this.handleResizeStart(t, e)), this.handleMap.set(e, t), this.wrapper.appendChild(t);
		});
	}
	removeHandles() {
		this.handleMap.forEach((e) => e.remove()), this.handleMap.clear();
	}
	applyInitialSize() {
		let e = this.node.attrs.width, t = this.node.attrs.height;
		e ? (this.element.style.width = `${e}px`, this.initialWidth = e) : this.initialWidth = this.element.offsetWidth, t ? (this.element.style.height = `${t}px`, this.initialHeight = t) : this.initialHeight = this.element.offsetHeight, this.initialWidth > 0 && this.initialHeight > 0 && (this.aspectRatio = this.initialWidth / this.initialHeight);
	}
	handleResizeStart(e, t) {
		e.preventDefault(), e.stopPropagation(), this.isResizing = !0, this.activeHandle = t, Qm(e) ? (this.startX = e.touches[0].clientX, this.startY = e.touches[0].clientY) : (this.startX = e.clientX, this.startY = e.clientY), this.startWidth = this.element.offsetWidth, this.startHeight = this.element.offsetHeight, this.startWidth > 0 && this.startHeight > 0 && (this.aspectRatio = this.startWidth / this.startHeight), this.getPos(), this.container.dataset.resizeState = "true", this.classNames.resizing && this.container.classList.add(this.classNames.resizing), document.addEventListener("mousemove", this.handleMouseMove), document.addEventListener("touchmove", this.handleTouchMove), document.addEventListener("mouseup", this.handleMouseUp), document.addEventListener("keydown", this.handleKeyDown), document.addEventListener("keyup", this.handleKeyUp);
	}
	handleResize(e, t) {
		if (!this.activeHandle) return;
		let n = this.preserveAspectRatio || this.isShiftKeyPressed, { width: r, height: i } = this.calculateNewDimensions(this.activeHandle, e, t), a = this.applyConstraints(r, i, n);
		this.element.style.width = `${a.width}px`, this.element.style.height = `${a.height}px`, this.onResize && this.onResize(a.width, a.height);
	}
	calculateNewDimensions(e, t, n) {
		let r = this.startWidth, i = this.startHeight, a = e.includes("right"), o = e.includes("left"), s = e.includes("bottom"), c = e.includes("top");
		return a ? r = this.startWidth + t : o && (r = this.startWidth - t), s ? i = this.startHeight + n : c && (i = this.startHeight - n), (e === "right" || e === "left") && (r = this.startWidth + (a ? t : -t)), (e === "top" || e === "bottom") && (i = this.startHeight + (s ? n : -n)), this.preserveAspectRatio || this.isShiftKeyPressed ? this.applyAspectRatio(r, i, e) : {
			width: r,
			height: i
		};
	}
	applyConstraints(e, t, n) {
		if (!n) {
			let n = Math.max(this.minSize.width, e), r = Math.max(this.minSize.height, t);
			return this.maxSize?.width && (n = Math.min(this.maxSize.width, n)), this.maxSize?.height && (r = Math.min(this.maxSize.height, r)), {
				width: n,
				height: r
			};
		}
		let r = e, i = t;
		return r < this.minSize.width && (r = this.minSize.width, i = r / this.aspectRatio), i < this.minSize.height && (i = this.minSize.height, r = i * this.aspectRatio), this.maxSize?.width && r > this.maxSize.width && (r = this.maxSize.width, i = r / this.aspectRatio), this.maxSize?.height && i > this.maxSize.height && (i = this.maxSize.height, r = i * this.aspectRatio), {
			width: r,
			height: i
		};
	}
	applyAspectRatio(e, t, n) {
		return n === "left" || n === "right" ? {
			width: e,
			height: e / this.aspectRatio
		} : n === "top" || n === "bottom" ? {
			width: t * this.aspectRatio,
			height: t
		} : {
			width: e,
			height: e / this.aspectRatio
		};
	}
}, eh = class e extends Cm {
	constructor(...e) {
		super(...e), this.type = "node";
	}
	static create(t = {}) {
		let n = typeof t == "function" ? t() : t;
		return new e(n);
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
}, th = class {
	constructor(e, t, n) {
		this.isDragging = !1, this.component = e, this.editor = t.editor, this.options = {
			stopEvent: null,
			ignoreMutation: null,
			...n
		}, this.extension = t.extension, this.node = t.node, this.decorations = t.decorations, this.innerDecorations = t.innerDecorations, this.view = t.view, this.HTMLAttributes = t.HTMLAttributes, this.getPos = () => {
			try {
				return t.getPos();
			} catch {
				return;
			}
		}, this.mount();
	}
	mount() {}
	get dom() {
		return this.editor.view.dom;
	}
	get contentDOM() {
		return null;
	}
	onDragStart(e) {
		let { view: t } = this.editor, n = e.target, r = n.nodeType === 3 ? n.parentElement?.closest("[data-drag-handle]") : n.closest("[data-drag-handle]");
		if (!this.dom || this.contentDOM?.contains(n) || !r) return;
		let i = 0, a = 0;
		if (this.dom !== r) {
			let t = this.dom.getBoundingClientRect(), n = r.getBoundingClientRect(), o = e.offsetX ?? e.nativeEvent?.offsetX, s = e.offsetY ?? e.nativeEvent?.offsetY;
			i = n.x - t.x + o, a = n.y - t.y + s;
		}
		let o = this.dom.cloneNode(!0);
		try {
			let e = this.dom.getBoundingClientRect();
			o.style.width = `${Math.round(e.width)}px`, o.style.height = `${Math.round(e.height)}px`, o.style.boxSizing = "border-box", o.style.pointerEvents = "none";
		} catch {}
		let s = null;
		try {
			var c;
			s = document.createElement("div"), s.style.position = "absolute", s.style.top = "-9999px", s.style.left = "-9999px", s.style.pointerEvents = "none", s.appendChild(o), document.body.appendChild(s), (c = e.dataTransfer) == null || c.setDragImage(o, i, a);
		} finally {
			s && setTimeout(() => {
				try {
					s?.remove();
				} catch {}
			}, 0);
		}
		let l = this.getPos();
		if (typeof l != "number") return;
		let u = L.create(t.state.doc, l), d = t.state.tr.setSelection(u);
		t.dispatch(d);
	}
	stopEvent(e) {
		if (!this.dom) return !1;
		if (typeof this.options.stopEvent == "function") return this.options.stopEvent({ event: e });
		let t = e.target;
		if (!this.dom.contains(t) || this.contentDOM?.contains(t)) return !1;
		let n = e.type.startsWith("drag"), r = e.type === "dragover" || e.type === "dragenter", i = e.type === "drop";
		if (([
			"INPUT",
			"BUTTON",
			"SELECT",
			"TEXTAREA"
		].includes(t.tagName) || t.isContentEditable) && !i && !n) return !0;
		let { isEditable: a } = this.editor, { isDragging: o } = this, s = !!this.node.type.spec.draggable, c = L.isSelectable(this.node), l = e.type === "copy", u = e.type === "paste", d = e.type === "cut", f = e.type === "mousedown";
		if (!s && c && n && e.target === this.dom && e.preventDefault(), s && n && !o && e.target === this.dom) return e.preventDefault(), !1;
		if (s && a && !o && f) {
			let e = t.closest("[data-drag-handle]");
			e && (this.dom === e || this.dom.contains(e)) && (this.isDragging = !0, document.addEventListener("dragend", () => {
				this.isDragging = !1;
			}, { once: !0 }), document.addEventListener("drop", () => {
				this.isDragging = !1;
			}, { once: !0 }), document.addEventListener("mouseup", () => {
				this.isDragging = !1;
			}, { once: !0 }));
		}
		return !(o || r || i || l || u || d || f && c);
	}
	ignoreMutation(e) {
		return this.dom ? this.contentDOM ? typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: e }) : this.node.isLeaf || this.node.isAtom ? !0 : e.type === "selection" || this.contentDOM.contains(e.target) && e.type === "childList" && (rd() || nd()) && this.editor.isFocused && [...Array.from(e.addedNodes), ...Array.from(e.removedNodes)].every((e) => e.isContentEditable) ? !1 : this.contentDOM === e.target && e.type === "attributes" || !this.contentDOM.contains(e.target) : e.type !== "selection" : !0;
	}
	updateAttributes(e) {
		this.editor.commands.command(({ tr: t }) => {
			let n = this.getPos();
			return typeof n == "number" && (t.setNodeMarkup(n, void 0, {
				...this.node.attrs,
				...e
			}), !0);
		});
	}
	deleteNode() {
		let e = this.getPos();
		if (typeof e != "number") return;
		let t = e + this.node.nodeSize;
		this.editor.commands.deleteRange({
			from: e,
			to: t
		});
	}
};
function nh(e) {
	return new Tm({
		find: e.find,
		handler: ({ state: t, range: n, match: r, pasteEvent: i }) => {
			let a = q(e.getAttributes, void 0, r, i);
			if (a === !1 || a === null) return null;
			let { tr: o } = t, s = r[r.length - 1], c = r[0], l = n.to;
			if (s) {
				let i = c.search(/\S/), u = n.from + c.indexOf(s), d = u + s.length;
				if (Mf(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > u).length) return null;
				d < n.to && o.delete(d, n.to), u > n.from && o.delete(n.from + i, u), l = n.from + i + s.length, o.addMark(n.from + i, l, e.type.create(a || {})), r.index !== void 0 && r.input !== void 0 && r.index + r[0].length >= r.input.length || o.removeStoredMark(e.type);
			}
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/editorDocumentUtils.ts
function rh(e) {
	if (e.childCount === 1) {
		let t = e.firstChild;
		return t?.type.name === "paragraph" && t.content.size === 0;
	}
	return e.childCount === 0;
}
function ih(e) {
	return rh(e.doc);
}
function ah(e, t) {
	return e.type.name === "paragraph" && e.content.size === t && e.textContent.trim().length === t;
}
var oh = /:([A-Za-z0-9_-]{1,64}):/g;
function sh(e, t) {
	typeof e.forEach == "function" && e.forEach((e) => t(e));
}
function ch(e) {
	if (typeof e != "string" || !e) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function lh(e) {
	let t = nt(e?.shortcode), n = e?.src;
	if (!t || !ch(n)) return null;
	let r = typeof e?.setAddress == "string" ? e.setAddress.trim() : "";
	return {
		identityKey: typeof e?.identityKey == "string" && e.identityKey ? e.identityKey : et({
			shortcodeLower: Qe(t),
			src: n,
			setAddress: r || null
		}),
		shortcode: t,
		shortcodeLower: Qe(t),
		src: n,
		setAddress: r
	};
}
function uh(e) {
	let t = lh(e);
	if (t) return {
		type: "customEmoji",
		emoji: t
	};
	let n = nt(e?.shortcode);
	return {
		type: "text",
		text: n ? `:${n}:` : ""
	};
}
function dh(e) {
	let t = [];
	return sh(e, (e) => {
		e.isText ? t.push({
			type: "text",
			text: e.text ?? ""
		}) : e.type.name === "customEmoji" ? t.push(uh(e.attrs)) : t.push({
			type: "text",
			text: e.textContent ?? ""
		});
	}), t;
}
function fh(e, t) {
	for (let n of e.matchAll(oh)) {
		let e = Qe(n[1]);
		e && t.add(e);
	}
}
function ph(e) {
	let t = /* @__PURE__ */ new Set(), n = [], r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
	for (let a of e) if (a.type === "media") fh(a.text, t);
	else for (let e of a.parts) {
		if (e.type === "text") {
			fh(e.text, t);
			continue;
		}
		let a = i.get(e.emoji.shortcodeLower) ?? /* @__PURE__ */ new Set();
		a.add(e.emoji.identityKey), i.set(e.emoji.shortcodeLower, a), r.has(e.emoji.identityKey) || (r.add(e.emoji.identityKey), n.push(e.emoji));
	}
	return {
		reservedTextShortcodes: t,
		emojiOrder: n,
		originalOwners: i
	};
}
function mh(e) {
	let t = Qe(e.alias);
	if (!t || e.usedAliasShortcodes.has(t) || e.reservedTextShortcodes.has(t)) return !1;
	if (!e.isOriginalShortcode) {
		let n = e.originalOwners.get(t);
		if (n && !(n.size === 1 && n.has(e.emoji.identityKey))) return !1;
	}
	return !0;
}
function hh(e) {
	let { reservedTextShortcodes: t, emojiOrder: n, originalOwners: r } = ph(e), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
	for (let e of n) {
		if (mh({
			alias: e.shortcode,
			emoji: e,
			isOriginalShortcode: !0,
			usedAliasShortcodes: a,
			reservedTextShortcodes: t,
			originalOwners: r
		})) {
			i.set(e.identityKey, e.shortcode), a.add(e.shortcodeLower);
			continue;
		}
		let n = 2;
		for (;;) {
			let o = `${e.shortcode}_${n}`, s = Qe(o);
			if (mh({
				alias: o,
				emoji: e,
				isOriginalShortcode: !1,
				usedAliasShortcodes: a,
				reservedTextShortcodes: t,
				originalOwners: r
			})) {
				i.set(e.identityKey, o), a.add(s);
				break;
			}
			n++;
		}
	}
	return i;
}
function gh(e) {
	let t = hh(e), n = [], r = /* @__PURE__ */ new Set();
	return {
		content: e.map((e) => {
			if (e.type === "media") return e.text;
			let i = "";
			for (let a of e.parts) {
				if (a.type === "text") {
					i += a.text;
					continue;
				}
				let e = t.get(a.emoji.identityKey) ?? a.emoji.shortcode;
				if (i += `:${e}:`, !r.has(a.emoji.identityKey)) {
					r.add(a.emoji.identityKey);
					let t = [
						"emoji",
						e,
						a.emoji.src
					];
					a.emoji.setAddress && t.push(a.emoji.setAddress), n.push(t);
				}
			}
			return i;
		}).join("\n"),
		emojiTags: n
	};
}
function _h(e) {
	let t = [];
	return typeof e.forEach != "function" && typeof e.descendants == "function" ? (e.descendants((e) => {
		if (e.type.name === "paragraph") t.push({
			type: "inline",
			parts: [{
				type: "text",
				text: e.textContent
			}]
		});
		else if (e.type.name === "image" || e.type.name === "video") {
			let n = e.attrs?.src;
			n && t.push({
				type: "media",
				text: n
			});
		} else e.type.name === "customEmoji" && t.push({
			type: "inline",
			parts: [uh(e.attrs)]
		});
	}), gh(t)) : (sh(e, (e) => {
		if (e.type.name === "paragraph") t.push({
			type: "inline",
			parts: dh(e)
		});
		else if (e.type.name === "image" || e.type.name === "video") {
			let n = e.attrs?.src;
			n && t.push({
				type: "media",
				text: n
			});
		} else e.type.name === "customEmoji" && t.push({
			type: "inline",
			parts: [uh(e.attrs)]
		});
	}), gh(t));
}
function vh(e) {
	if (!e) return null;
	try {
		return e.state?.doc ?? e.view?.state?.doc ?? null;
	} catch {
		return null;
	}
}
function yh(e) {
	let t = vh(e);
	return t ? _h(t).content : "";
}
function bh(e) {
	let t = vh(e);
	return t ? _h(t) : {
		content: "",
		emojiTags: []
	};
}
function xh(e, t) {
	if (!e || e.isDestroyed) return t;
	let n = !1;
	return e.state.doc.descendants((e) => {
		(e.type.name === "image" || e.type.name === "video") && (n = !0);
	}), !!(_h(e.state.doc).content.trim() || n || t);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/tags/hashtagManager.ts
function Sh(e) {
	let t = [], n = Se.source;
	return e.descendants((e, r) => {
		if (!e.isText || !e.text) return;
		let i = e.text, a = new RegExp(n, "g"), o;
		for (; (o = a.exec(i)) !== null;) {
			let e = o[0].indexOf("#");
			if (e === -1) continue;
			let n = r + o.index + e, i = n + 1 + o[1].length;
			t.push({
				from: n,
				to: i,
				hashtag: o[1]
			});
		}
	}), t;
}
function Ch(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	Se.lastIndex = 0;
	let r;
	for (; (r = Se.exec(e)) !== null;) {
		let e = r[1];
		e && e.trim() && (n.has(e) || (n.add(e), t.push(e)));
	}
	return t;
}
function wh(e) {
	let t = Sh(e), n = [], r = /* @__PURE__ */ new Set();
	for (let e of t) r.has(e.hashtag) || (r.add(e.hashtag), n.push(e.hashtag));
	return n;
}
function Th(e) {
	let t, n;
	typeof e == "string" ? (n = e, t = Ch(n)) : (t = wh(e), n = e.textContent);
	let r = t.map((e) => ["t", e.toLowerCase()]);
	return {
		content: n,
		hashtags: t,
		tags: r
	};
}
function Eh(e, t) {
	e.content = t.content, e.hashtags = t.hashtags, e.tags = t.tags;
}
function Dh(e) {
	Eh(Ae, Th(e));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/contentTracking.ts
var Oh = "content-tracking-normalized";
function kh(e) {
	let t = Sh(e).map(({ from: e, to: t }) => $c.inline(e, t, { class: Te.HASHTAG_CLASS }));
	return U.create(e, t);
}
function Ah(e) {
	return Sh(e.node).map(({ from: t, to: n }) => $c.inline(e.pos + 1 + t, e.pos + 1 + n, { class: Te.HASHTAG_CLASS }));
}
function jh(e, t) {
	return Math.max(0, Math.min(t, e.content.size));
}
function Mh(e, t) {
	let n = e.content.findDiffStart(t.content);
	if (n == null) return null;
	let r = e.content.findDiffEnd(t.content);
	return r ? {
		from: n,
		to: Math.max(n, r.b)
	} : {
		from: n,
		to: n
	};
}
function Nh(e, t, n) {
	let r = e.resolve(jh(e, t));
	for (let e = r.depth; e > 0; --e) {
		let t = r.node(e);
		if (!t.isTextblock) continue;
		let i = r.start(e), a = r.end(e), o = `${i}:${a}`;
		n.has(o) || n.set(o, {
			from: i,
			to: a,
			pos: i - 1,
			node: t
		});
		return;
	}
}
function Ph(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = jh(e, Math.min(t, n)), a = jh(e, Math.max(t, n));
	return Nh(e, i, r), Nh(e, a, r), e.nodesBetween(i, a, (e, t) => {
		if (!e.isTextblock) return;
		let n = t + 1, i = t + e.nodeSize - 1, a = `${n}:${i}`;
		return r.has(a) || r.set(a, {
			from: n,
			to: i,
			pos: t,
			node: e
		}), !1;
	}), Array.from(r.values()).sort((e, t) => e.from - t.from);
}
function Fh(e, t, n, r, i) {
	let a = [], o = "", s = !1;
	if (e.node.descendants((n, i) => {
		if (!n.isText || !n.text) return;
		let c = e.pos + 1 + i, l = c + n.nodeSize;
		r && n.marks.find((e) => e.type === t) && (s = !0, a.push({
			type: "removeMark",
			from: c,
			to: l
		})), o += n.text;
	}), !o || !(o.includes("http://") || o.includes("https://")) && !s) return a;
	for (let s of Fe(o)) {
		let c = s.start, l = c > 0 ? o[c - 1] : void 0;
		if (!Ne(l)) continue;
		let u = s.displayText, d = s.end, f = e.pos + 1 + c, p = e.pos + 1 + d;
		if (i) {
			let e = Pe(u);
			if (e && n) {
				a.push({
					type: "replaceImage",
					from: f,
					to: p,
					imageUrl: e
				});
				break;
			}
		}
		if (r && !(u.length < 8) && /^https?:\/\/[a-zA-Z0-9]/.test(u)) try {
			let e = new URL(u).hostname;
			if (!e.includes(".")) continue;
			let n = e.split("."), r = n[n.length - 1];
			r && r.length >= 2 && a.push({
				type: "addMark",
				from: f,
				to: p,
				mark: t.create({ href: u })
			});
		} catch {
			continue;
		}
	}
	return a;
}
function Ih(e, t, n, r, i, a) {
	let o = t.doc.resolve(i), s = o.parent, c = s.type.name === "paragraph" && s.textContent.trim().length === 0, l = ah(s, a - i), u = ih(t), d = n.create({
		src: r,
		alt: "Image"
	});
	if (c || l) {
		let n = o.depth, r = o.start(n), i = o.end(n);
		return u || t.doc.childCount === 1 && l ? e.delete(0, t.doc.content.size).insert(0, d) : e.replaceWith(r, i, d);
	}
	return e.replaceWith(i, a, d);
}
function Lh(e, t, n, r) {
	let i = e.schema.marks.link, a = e.schema.nodes.image;
	if (!i) return null;
	let o = e.tr, s = !1, c = [];
	for (let e of r) c.push(...Fh(e, i, a, t, n));
	c.sort((e, t) => t.from - e.from);
	for (let t of c) t.type === "removeMark" ? (o = o.removeMark(t.from, t.to, i), s = !0) : t.type === "addMark" && t.mark ? (o = o.addMark(t.from, t.to, t.mark), s = !0) : t.type === "replaceImage" && t.imageUrl && (ke.value ? o = Ih(o, e, a, t.imageUrl, t.from, t.to) : (De.addItem({
		id: Ce(),
		type: "image",
		src: t.imageUrl,
		isPlaceholder: !1
	}), o = o.delete(t.from, t.to)), s = !0);
	return s && o.docChanged ? o : null;
}
var Rh = Y.create({
	name: "contentTracking",
	addOptions() {
		return {
			debounceDelay: Te.DEBOUNCE_DELAY,
			enableHashtags: Te.ENABLE_HASHTAGS,
			enableAutoLink: Te.ENABLE_AUTO_LINK,
			enableImageConversion: Te.ENABLE_IMAGE_CONVERSION
		};
	},
	addStorage() {
		return { updateTimeout: null };
	},
	addProseMirrorPlugins() {
		let e = this.storage, t = this.options;
		return [
			...t.enableHashtags ? [new R({
				key: new z(Te.PLUGIN_KEYS.HASHTAG_DECORATION),
				state: {
					init: (e, { doc: t }) => kh(t),
					apply(e, t, n, r) {
						if (!e.docChanged) return t.map(e.mapping, e.doc);
						let i = Mh(n.doc, r.doc);
						if (!i) return t.map(e.mapping, e.doc);
						let a = Ph(e.doc, i.from, i.to), o = t.map(e.mapping, e.doc);
						if (a.length === 0) return o;
						let s = a.flatMap((e) => o.find(e.from, e.to));
						s.length > 0 && (o = o.remove(s));
						let c = a.flatMap(Ah);
						return c.length > 0 ? o.add(e.doc, c) : o;
					}
				},
				props: { decorations(e) {
					return this.getState(e);
				} }
			})] : [],
			...t.enableAutoLink || t.enableImageConversion ? [new R({
				key: new z(Te.PLUGIN_KEYS.LINK_AND_IMAGE_CONVERSION),
				appendTransaction: (e, n, r) => {
					if (!e.some((e) => e.docChanged) || e.some((e) => e.getMeta(Oh))) return null;
					let i = Mh(n.doc, r.doc);
					if (!i) return null;
					let a = Ph(r.doc, i.from, i.to);
					if (a.length === 0) return null;
					let o = !e.some((e) => e.getMeta("paste")), s = Lh(r, t.enableAutoLink ?? !0, o && !t.isMediaConversionDisabled?.() && (t.enableImageConversion ?? !0), a);
					return s && (s.setMeta("addToHistory", !1), s.setMeta(Oh, !0)), s;
				}
			})] : [],
			new R({
				key: new z(Te.PLUGIN_KEYS.CONTENT_UPDATE_TRACKER),
				state: {
					init: () => null,
					apply(n) {
						return n.docChanged && (e.updateTimeout && clearTimeout(e.updateTimeout), e.updateTimeout = setTimeout(() => {
							Dh(n.doc), window.dispatchEvent(new CustomEvent("editor-content-changed", { detail: { plainText: _h(n.doc).content } }));
						}, t.debounceDelay ?? Te.DEBOUNCE_DELAY)), null;
					}
				}
			})
		];
	},
	onDestroy() {
		this.storage.updateTimeout && clearTimeout(this.storage.updateTimeout);
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/mediaPaste.ts
function zh(e) {
	return e.split(/[\n ]+/).map((e) => e.trim()).filter(Boolean).map((e) => {
		let t = Pe(e);
		if (t) return {
			url: t,
			type: "image"
		};
		let n = ze(e);
		return n ? {
			url: n,
			type: "video"
		} : null;
	}).filter((e) => e !== null);
}
function Bh(e) {
	let t = e.parent;
	return t.type.name === "paragraph" && t.textContent.trim().length === 0;
}
function Vh(e) {
	let { selection: t } = e, n = e.doc.resolve(t.from);
	if (Bh(n)) {
		let e = n.depth;
		return {
			start: n.start(e),
			end: n.end(e)
		};
	}
	return null;
}
function Hh(e, t) {
	return e.map((e, n) => {
		let r = Date.now();
		if (e.type === "image") return t.nodes.image.create({
			src: e.url,
			alt: "Pasted image"
		});
		{
			let i = `pasted-video-${r}-${n}`;
			return t.nodes.video.create({
				src: e.url,
				id: i
			});
		}
	});
}
function Uh(e) {
	let t = e.doc;
	if (!t) return e;
	let n = [];
	return t.descendants((e, r) => {
		if (e.type.name === "paragraph" && e.textContent.trim().length === 0) {
			if (t.childCount === 1 && t.firstChild === e) return;
			let i = !1;
			e.descendants((e) => e.type && (e.type.name === "image" || e.type.name === "video") ? (i = !0, !1) : !0), i || n.push([r, r + e.nodeSize]);
		}
	}), n.sort((e, t) => t[0] - e[0]), n.forEach(([t, n]) => {
		e = e.delete(t, n);
	}), e;
}
var Wh = Y.create({
	name: "mediaPaste",
	addOptions: () => ({ isMediaConversionDisabled: () => !1 }),
	addProseMirrorPlugins() {
		return [new R({
			key: new z("image-paste"),
			props: {
				handlePaste: (e, t) => {
					if (this.options.isMediaConversionDisabled?.()) return !1;
					if (e.editable === !1) return t.preventDefault(), !0;
					let n = zh(t.clipboardData?.getData("text/plain") || "");
					if (n.length > 0) {
						if (t.preventDefault(), !ke.value) return n.forEach((e) => {
							De.addItem({
								id: Ce(),
								type: e.type,
								src: e.url,
								isPlaceholder: !1
							});
						}), !0;
						let { state: r, dispatch: i } = e, { tr: a, selection: o, schema: s } = r, c = Hh(n, s), l = a, u = Vh(r);
						if (u && c.length > 0) {
							l = l.replaceWith(u.start, u.end, c[0]);
							let e = u.start + c[0].nodeSize;
							for (let t = 1; t < c.length; t++) l = l.insert(e, c[t]), e += c[t].nodeSize;
						} else {
							let e = o.from;
							c.forEach((t) => {
								l = l.insert(e, t), e += t.nodeSize;
							});
						}
						return l = Uh(l), i(l), !0;
					}
					return !1;
				},
				handleTextInput: (e, t, n, r) => {
					if (this.options.isMediaConversionDisabled?.()) return !1;
					if (e.editable === !1) return !0;
					if (r.includes("\n") || r.length > 20) {
						let i = zh(r);
						if (i.length > 0) {
							let { state: r, dispatch: a } = e, { tr: o, schema: s } = r;
							if (!ke.value) return i.forEach((e) => {
								De.addItem({
									id: Ce(),
									type: e.type,
									src: e.url,
									isPlaceholder: !1
								});
							}), a(o.delete(t, n)), !0;
							let c = Hh(i, s), l = o;
							l = l.delete(t, n);
							let u = t;
							return c.forEach((e) => {
								l = l.insert(u, e), u += e.nodeSize;
							}), l = Uh(l), a(l), !0;
						}
					}
					return !1;
				}
			}
		})];
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/editorNodeActions.ts
function Gh(e, t, n) {
	if (e === t) return null;
	let r = e;
	if (n) {
		let t = n.resolve(e);
		t.parent.type.name === "paragraph" && (r = t.after());
	}
	return r < t ? {
		insertPos: r,
		deleteStart: t + 1,
		deleteEnd: t + 2
	} : r > t + 1 ? {
		insertPos: r - 1,
		deleteStart: t,
		deleteEnd: t + 1
	} : null;
}
function Kh(e, t, n) {
	return n.insertPos < n.deleteStart ? e.insert(n.insertPos, t).delete(n.deleteStart, n.deleteEnd) : e.delete(n.deleteStart, n.deleteEnd).insert(n.insertPos, t);
}
function qh(e, t, n) {
	let { tr: r, doc: i, schema: a } = e.state, o = t.pos, s = Gh(n, o, i);
	if (!s) return !0;
	let c = a.nodes.image.create(t.attrs);
	try {
		let t = Kh(r, c, s);
		return e.dispatch(t), !0;
	} catch (e) {
		return console.error("Error moving image:", e), !1;
	}
}
function Jh(e, t) {
	let n = /* @__PURE__ */ new Set();
	if (e.descendants((e, t) => {
		if (e.type.name !== "paragraph") return;
		let r = t + 1, i = t + e.nodeSize - 1;
		n.add(r), n.add(i), e.descendants((e, t) => {
			if (e.type.name !== "customEmoji") return;
			let i = r + t;
			n.add(i), n.add(i + e.nodeSize);
		});
	}), typeof t == "number") {
		let r = e.nodeAt(t), i = r?.type.name === "customEmoji" ? r.nodeSize : 1;
		n.delete(t), n.delete(t + i);
	}
	return [...n].sort((e, t) => e - t);
}
function Yh(e, t, n) {
	if (typeof n != "number") return !1;
	let r = e.nodeAt(n);
	return r?.type.name === "customEmoji" && t >= n && t <= n + r.nodeSize;
}
function Xh(e, t, n) {
	if (Yh(e, t, n)) return n ?? null;
	let r = Jh(e, n);
	return r.length === 0 ? null : r.reduce((e, n) => {
		let r = Math.abs(e - t);
		return Math.abs(n - t) < r ? n : e;
	}, r[0]);
}
function Zh(e, t, n) {
	let { tr: r, doc: i, schema: a } = e.state, o = t.pos, s = i.nodeAt(o);
	if (s?.type.name !== "customEmoji") return !1;
	if (n === o || n === o + s.nodeSize || !Jh(i, o).includes(n)) return !0;
	let c = a.nodes.customEmoji.create({
		...s.attrs,
		...t.attrs
	});
	try {
		let t = n < o ? n : n - s.nodeSize, i = n < o ? r.insert(t, c).delete(o + c.nodeSize, o + c.nodeSize + s.nodeSize) : r.delete(o, o + s.nodeSize).insert(t, c);
		return i.setSelection(L.create(i.doc, t)), e.dispatch(i.scrollIntoView()), !0;
	} catch (e) {
		return console.error("Error moving custom emoji:", e), !1;
	}
}
function Qh(e) {
	e.dispatch(e.state.tr.setMeta("imageDrag", {
		isDragging: !1,
		draggedNodePos: null
	}));
}
function $h(e, t, n) {
	e && e.state.doc.descendants((e, r) => {
		if (t(e, r)) return n(e, r), !1;
	});
}
function eg(e, t, n, r) {
	e.update((e) => {
		let i = { ...e };
		return t && delete i[t], n && r && (i[n] = r), i;
	});
}
function tg(e, t, n, r, i = !1) {
	n && (eg(r, e), $h(n, (n) => {
		let r = n.type?.name;
		return (t && r === "video" || !t && r === "image") && (n.attrs?.src === e || n.attrs?.id === e);
	}, (t, r) => {
		let a = n.state.tr.delete(r, r + t.nodeSize);
		n.view.dispatch(a), i && console.log("[uploadHelper] Deleted placeholder:", e);
	}));
}
function ng(e, t = !1) {
	if (!e) return;
	let { state: n } = e, { doc: r } = n, i = n.tr, a = 0, o = [];
	r.descendants((e, t) => {
		let n = e.type?.name, r = pt(e.attrs);
		(n === "image" || n === "video") && r && o.push({
			pos: t,
			size: e.nodeSize
		});
	}), o.reverse().forEach(({ pos: e, size: t }) => {
		i.delete(e, e + t), a++;
	}), a > 0 && (e.view.dispatch(i), t && console.log(`[editorNodeActions] Deleted ${a} placeholder(s)`));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/imageDragDrop.ts
var rg = Y.create({
	name: "imageDragDrop",
	addProseMirrorPlugins() {
		let e = new z("image-drag-drop"), t = new z("drop-zone-indicator");
		return [new R({
			key: e,
			state: {
				init: () => ({
					isDragging: !1,
					draggedNodePos: null,
					autoScrollInterval: null
				}),
				apply: (e, t) => {
					let n = e.getMeta("imageDrag");
					return n ? n.isDragging === !1 && t.autoScrollInterval ? (clearInterval(t.autoScrollInterval), {
						...t,
						...n,
						autoScrollInterval: null
					}) : {
						...t,
						...n
					} : t;
				}
			},
			props: {
				handleDrop: (e, t, n, r) => {
					if (e.editable === !1) return t.preventDefault(), !0;
					let i = t.dataTransfer?.getData("application/x-tiptap-node");
					if (!r && i) try {
						let n = JSON.parse(i);
						if (n.type === "image") {
							t.preventDefault();
							let r = e.posAtCoords({
								left: t.clientX,
								top: t.clientY
							});
							if (r && typeof n.pos == "number") return Qh(e), qh(e, n, r.pos), !0;
						}
					} catch (e) {
						console.warn("Failed to parse drag data:", e);
					}
					let a = t.dataTransfer;
					return !!(!r && a && a.files && a.files.length > 0 && !i);
				},
				handleDOMEvents: {
					dragstart: (e, t) => e.editable === !1 || rt() ? (t.preventDefault(), !0) : !1,
					dragover: (e, t) => e.editable === !1 || rt() ? (t.preventDefault(), !0) : !1,
					drop: (e, t) => e.editable === !1 || rt() ? (t.preventDefault(), !0) : !1
				}
			},
			view: (t) => {
				let n = null, r = (e, r) => {
					n &&= (cancelAnimationFrame(n), null);
					let i = t.dom;
					if (!i) return;
					let a = i.getBoundingClientRect(), o = 0;
					o = e === "up" ? r - a.top : a.bottom - r;
					let s = 1 + 9 * (1 - Math.max(0, Math.min(1, o / 100))), c = () => {
						let t = i.scrollTop, r = i.scrollHeight, a = i.clientHeight;
						if (e === "up" && t > 0) {
							let e = Math.max(0, t - s);
							i.scrollTop = e, e > 0 && (n = requestAnimationFrame(c));
						} else if (e === "down" && t < r - a) {
							let e = Math.min(r - a, t + s);
							i.scrollTop = e, e < r - a && (n = requestAnimationFrame(c));
						}
					};
					n = requestAnimationFrame(c);
				}, i = () => {
					n &&= (cancelAnimationFrame(n), null);
				}, a = (e) => {
					if (t.editable === !1) {
						i();
						return;
					}
					let { nodeData: n, dropPosition: r, dropX: a, dropY: o } = e.detail;
					if (i(), t.dispatch(t.state.tr.setMeta("imageDrag", {
						isDragging: !1,
						draggedNodePos: null
					})), n && n.type === "image") {
						let e;
						e = typeof r == "number" ? r : t.posAtCoords({
							left: a,
							top: o
						})?.pos || n.pos, typeof n.pos == "number" && qh(t, n, e);
					}
				}, o = (e) => {
					if (t.editable === !1) return;
					let { nodePos: n } = e.detail;
					t.dispatch(t.state.tr.setMeta("imageDrag", {
						isDragging: !0,
						draggedNodePos: n
					}));
				}, s = (n) => {
					if (t.editable === !1) {
						i();
						return;
					}
					let { touchY: a } = n.detail;
					if (typeof a != "number" || !e.getState(t.state)?.isDragging) return;
					let o = t.dom;
					if (!o) return;
					let s = o.getBoundingClientRect();
					a < s.top + 100 ? r("up", a) : a > s.bottom - 100 ? r("down", a) : i();
				};
				return window.addEventListener("touch-image-drop", a), window.addEventListener("touch-image-drag-start", o), window.addEventListener("touch-image-drag-move", s), { destroy() {
					i(), window.removeEventListener("touch-image-drop", a), window.removeEventListener("touch-image-drag-start", o), window.removeEventListener("touch-image-drag-move", s);
				} };
			}
		}), new R({
			key: t,
			state: {
				init() {
					return U.empty;
				},
				apply(t, n, r, i) {
					if (!rt()) return U.empty;
					let a = e.getState(i);
					if (!a?.isDragging) return U.empty;
					let o = [], s = i.doc, c = !1;
					if (typeof a.draggedNodePos == "number") {
						let e = s.firstChild;
						e && e.type.name === "image" && e.attrs && a.draggedNodePos === 0 && (c = !0);
					}
					return c || o.push($c.widget(0, () => {
						let e = document.createElement("div");
						e.className = "drop-zone-indicator drop-zone-top", e.setAttribute("data-drop-pos", "0");
						let t = document.createElement("div");
						return t.className = "drop-zone-bar", e.appendChild(t), e;
					}, { side: -1 })), s.descendants((e, t) => {
						if (e.type.name === "paragraph" || e.type.name === "image") {
							let n = t + e.nodeSize;
							if (typeof a.draggedNodePos == "number" && n === a.draggedNodePos) return;
							a.draggedNodePos !== t && o.push($c.widget(n, () => {
								let e = document.createElement("div");
								e.className = "drop-zone-indicator drop-zone-between", e.setAttribute("data-drop-pos", n.toString());
								let t = document.createElement("div");
								return t.className = "drop-zone-bar", e.appendChild(t), e;
							}, { side: 1 }));
						}
					}), U.create(s, o);
				}
			},
			props: { decorations(e) {
				return this.getState(e);
			} }
		})];
	},
	addStorage() {
		return { moveImageNode: (e, t, n) => (Qh(e), qh(e, t, n)) };
	}
}), ig = Y.create({
	name: "smartBackspace",
	addProseMirrorPlugins() {
		return [new R({
			key: new z("smart-backspace"),
			props: { handleKeyDown(e, t) {
				if (t.key !== "Backspace" || rt() && document.activeElement !== e.dom) return !1;
				let { state: n } = e, { selection: r, doc: i } = n;
				if (r.empty && r.from === 1) {
					let t = i.firstChild, r = i.childCount > 1 ? i.child(1) : null;
					if (t && t.type.name === "paragraph" && t.content.size === 0 && r && r.type.name === "image") return e.dispatch(n.tr.delete(0, t.nodeSize)), !0;
				}
				return !1;
			} }
		})];
	}
}), ag = class extends qm {
	contentElement = null;
}, og = (e) => {
	let t = new ag(e);
	return le(t, (e) => (t.on("transaction", () => {
		e(t);
	}), () => {
		t.destroy();
	}));
}, sg = class {
	component;
	props;
	dom;
	constructor(e, { element: t, props: n }) {
		this.component = e, this.props = n, this.dom = t, this.dom.classList.add("svelte-renderer");
	}
	updateProps(e) {
		Object.assign(this.props, e);
	}
	updateAttributes(e) {
		Object.keys(e).forEach((t) => {
			this.dom.setAttribute(t, e[t]);
		});
	}
	destroy() {
		m(this.component);
	}
}, cg = "TipTapNodeView", lg = (e, t) => {
	if (!e) throw Error(t);
}, ug = class extends th {
	mount() {
		let e = this.component, t = C({
			editor: this.editor,
			node: this.node,
			decorations: this.decorations,
			innerDecorations: this.innerDecorations,
			view: this.view,
			selected: !1,
			extension: this.extension,
			HTMLAttributes: this.HTMLAttributes,
			getPos: () => this.getPos(),
			updateAttributes: (e = {}) => this.updateAttributes(e),
			deleteNode: () => this.deleteNode()
		});
		this.contentDOMElement = this.node.isLeaf ? null : document.createElement(this.node.isInline ? "span" : "div"), this.contentDOMElement && (this.contentDOMElement.style.whiteSpace = "inherit");
		let n = new _e(this.options.context);
		n.set(cg, { onDragStart: this.onDragStart.bind(this) });
		let r = this.options.as ?? (this.node.isInline ? "span" : "div"), i = document.createElement(r);
		i.classList.add(`node-${this.node.type.name}`), this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate);
		let a = me(e, {
			target: i,
			props: t,
			context: n
		});
		this.renderer = new sg(a, {
			element: i,
			props: t
		}), this.appendContendDom(), this.updateElementAttributes();
	}
	appendContendDom() {
		let e = this.dom.querySelector("[data-node-view-content]");
		this.contentDOMElement && e && !e.contains(this.contentDOMElement) && e.appendChild(this.contentDOMElement);
	}
	get dom() {
		return lg(this.renderer.dom.firstElementChild?.hasAttribute("data-node-view-wrapper"), "Please use the NodeViewWrapper component for your node view."), this.renderer.dom;
	}
	get contentDOM() {
		return this.node.isLeaf ? null : this.contentDOMElement;
	}
	handleSelectionUpdate() {
		let { from: e, to: t } = this.editor.state.selection, n = this.getPos();
		if (typeof n == "number") {
			if (e <= n && t >= n + this.node.nodeSize) {
				if (this.renderer.props.selected) return;
				this.selectNode();
			} else {
				if (!this.renderer.props.selected) return;
				this.deselectNode();
			}
		}
	}
	update(e, t, n) {
		let r = (e) => {
			this.renderer.updateProps(e), typeof this.options.attrs == "function" && this.updateElementAttributes();
		};
		if (typeof this.options.update == "function") {
			let i = this.node, a = this.decorations, o = this.innerDecorations;
			return this.node = e, this.decorations = t, this.innerDecorations = n, this.options.update({
				oldNode: i,
				oldDecorations: a,
				oldInnerDecorations: o,
				newNode: e,
				newDecorations: t,
				newInnerDecorations: n,
				updateProps: () => r({
					node: e,
					decorations: t,
					innerDecorations: n
				})
			});
		}
		return e.type === this.node.type && (e === this.node && this.decorations === t && this.innerDecorations === n || (this.node = e, this.decorations = t, this.innerDecorations = n, r({
			node: e,
			decorations: t,
			innerDecorations: n
		})), !0);
	}
	selectNode() {
		this.renderer.updateProps({ selected: !0 }), this.renderer.dom.classList.add("ProseMirror-selectednode");
	}
	deselectNode() {
		this.renderer.updateProps({ selected: !1 }), this.renderer.dom.classList.remove("ProseMirror-selectednode");
	}
	destroy() {
		this.renderer.destroy(), this.editor.off("selectionUpdate", this.handleSelectionUpdate), this.contentDOMElement = null;
	}
	updateElementAttributes() {
		if (this.options.attrs) {
			let e = {};
			if (typeof this.options.attrs == "function") {
				let t = this.editor.extensionManager.attributes, n = hf(this.node, t);
				e = this.options.attrs({
					node: this.node,
					HTMLAttributes: n
				});
			} else e = this.options.attrs;
			this.renderer.updateAttributes(e);
		}
	}
}, dg = (e, t) => (n) => new ug(e, n, t), fg = o("<div></div> <!>", 1);
function pg(e, t) {
	fe(t, !0);
	let n = ae(t, "editor", 7), r;
	ne(async () => {
		await ce(), r && n()?.options.element && (n().contentElement || (r.append(...Array.from(n().options.element?.childNodes || [])), n().setOptions({ element: r }), n().contentElement = r));
	}), se(() => {
		if (!n() || (n().contentElement = null, !n().options.element?.firstChild)) return;
		let e = document.createElement("div");
		e.append(...Array.from(n().options.element?.childNodes || [])), n().setOptions({ element: e });
	});
	var a = fg(), o = D(a);
	S(o, (e) => r = e, () => r);
	var s = b(o, 2), c = (e) => {
		var n = h(), r = D(n);
		l(r, () => t.children), p(e, n);
	};
	d(s, (e) => {
		t.children && e(c);
	}), v(() => de(o, 1, f(t.class))), p(e, a), i();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-tiptap/dist/NodeViewWrapper.svelte
var mg = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"as",
	"children"
]);
function hg(t, n) {
	fe(n, !0);
	let r = ae(n, "as", 3, "div"), a = T(n, mg), { onDragStart: o } = pe(cg), s;
	ne(async () => {
		await ce(), s && (s.style.whiteSpace = "normal");
	});
	var c = h(), u = D(c);
	e(u, r, !1, (e, t) => {
		S(e, (e) => s = e, () => s), ee(e, () => ({
			"data-node-view-wrapper": "",
			role: "none",
			...a,
			ondragstart: o
		}));
		var r = h(), i = D(r), c = (e) => {
			var t = h(), r = D(t);
			l(r, () => n.children), p(e, t);
		};
		d(i, (e) => {
			n.children && e(c);
		}), p(t, r);
	}), p(t, c), i();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/MediaActionButtons.svelte
var gg = o("<div class=\"copy-icon svg-icon\"></div>"), _g = o("<div class=\"close-icon svg-icon\"></div>"), vg = o("<!> <!>", 1), yg = {
	hash: "svelte-7oer9x",
	code: "button.media-delete-btn.circle.close {position:absolute;inset:6px 6px auto auto;z-index:10;width:50px;height:50px;}button.media-copy-btn.circle.copy {position:absolute;inset:62px 6px auto auto;z-index:10;width:50px;height:50px;}"
};
function bg(e, t) {
	fe(t, !0), te(e, yg);
	let n = ae(t, "deleteDisabled", 3, !1), r = ae(t, "layout", 3, "editor-image");
	async function a(e) {
		return e.stopPropagation(), Ie(t.src, "URL", navigator, window);
	}
	function o(e) {
		e.stopPropagation(), !n() && t.onDelete();
	}
	var s = vg(), c = D(s);
	xe(c, {
		variant: "copy",
		shape: "circle",
		get className() {
			return `media-copy-btn media-copy-btn--${r() ?? ""}`;
		},
		get ariaLabel() {
			return t.copyAriaLabel;
		},
		onClick: a,
		get floatingMessage() {
			return t.copySuccessMessage;
		},
		children: (e, t) => {
			var n = gg();
			p(e, n);
		},
		$$slots: { default: !0 }
	});
	var l = b(c, 2);
	xe(l, {
		variant: "close",
		shape: "circle",
		get className() {
			return `media-delete-btn media-delete-btn--${r() ?? ""}`;
		},
		get ariaLabel() {
			return t.deleteAriaLabel;
		},
		get disabled() {
			return n();
		},
		onClick: o,
		children: (e, t) => {
			var n = _g();
			p(e, n);
		},
		$$slots: { default: !0 }
	}), p(e, s), i();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useMediaLoadState.svelte.ts
function xg() {
	let e = w(!1);
	function t() {
		O(e, !0);
	}
	function n() {
		O(e, !1);
	}
	return {
		get isLoaded() {
			return x(e);
		},
		handleLoad: t,
		handleError: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useLongPress.svelte.ts
function Sg(e, t) {
	let n = t.delay ?? 400, r = t.moveThreshold ?? 10, i = null, a = {
		x: 0,
		y: 0
	};
	function o() {
		i !== null && (clearTimeout(i), i = null);
	}
	function s(e) {
		if (e.touches.length !== 1) {
			o();
			return;
		}
		let r = e.touches[0];
		a = {
			x: r.clientX,
			y: r.clientY
		}, o(), i = setTimeout(() => {
			i = null, t.onLongPress?.(a.x, a.y, e);
		}, n);
	}
	function c(e) {
		if (e.touches.length !== 1) {
			o();
			return;
		}
		if (i === null) return;
		let t = e.touches[0];
		ut(t.clientX, t.clientY, a.x, a.y, r) && o();
	}
	function l(e) {
		i !== null && (o(), t.onTap?.(e));
	}
	ie(() => {
		let t = e();
		if (t) return t.addEventListener("touchstart", s, { passive: !0 }), t.addEventListener("touchmove", c, { passive: !0 }), t.addEventListener("touchend", l, { passive: !0 }), () => {
			o(), t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", c), t.removeEventListener("touchend", l);
		};
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/components/SvelteVideoNode.svelte
var Cg = o("<video controls=\"\" playsinline=\"\" autoplay=\"\" loop=\"\" preload=\"metadata\"><track kind=\"captions\"/> </video>", 2), wg = o("<div class=\"video-node-container svelte-s4lxcs\"><div class=\"video-wrapper svelte-s4lxcs\" data-video-node=\"\" role=\"button\" tabindex=\"0\"><!></div> <!></div>"), Tg = {
	hash: "svelte-s4lxcs",
	code: ".node-video {margin:12px 0;}.node-video[data-node-view-wrapper] {display:block;margin:0;}\n\n    /* 動画ノードコンテナ */.video-node-container.svelte-s4lxcs {position:relative;display:inline-block;width:100%;max-width:100%;}.video-wrapper.svelte-s4lxcs {display:flex;justify-content:center;align-items:center;width:100%;max-width:100%;min-height:150px;max-height:380px;position:relative;border-radius:6px;overflow:hidden;aspect-ratio:16 / 9;cursor:pointer;&:active {scale:1;}}.node-video.is-node-focused .video-wrapper {outline:2px solid var(--theme);}.node-video.is-node-focused span.placeholder-text.loading-text {font-size:1.125rem;}.editor-video.svelte-s4lxcs {max-width:100%;max-height:380px;width:100%;height:100%;object-fit:contain;display:block;opacity:0;transition:opacity 0.3s ease;pointer-events:auto;cursor:pointer;}.editor-video.loaded.svelte-s4lxcs {opacity:1;}.video-wrapper.svelte-s4lxcs {background-color:light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));}"
};
function Eg(e, r) {
	fe(r, !0), te(e, Tg);
	let a = () => oe(ve, "$_", o), [o, s] = re(), c = w(void 0), l = w(void 0), u = xg(), f = A(() => pt(r.node.attrs)), m = A(() => r.node.attrs.id || (typeof r.getPos == "function" ? (r.getPos() ?? "unknown").toString() : "unknown")), h = A(() => a()("videoNode.select"));
	function C() {
		let e = document;
		return !!(e.fullscreenElement || e.webkitFullscreenElement || e.mozFullScreenElement || e.msFullscreenElement);
	}
	Sg(() => x(c), {
		onTap: (e) => {
			if (x(f) || C()) return;
			let t = e.changedTouches[0];
			if (x(c)) {
				let e = x(c).getBoundingClientRect();
				if (t.clientY > e.bottom - 48) return;
			}
			e.stopPropagation(), ht(r.getPos);
		},
		delay: 200,
		moveThreshold: 10
	});
	function ee(e) {
		x(f) || C() || e.target !== x(c) && (e.stopPropagation(), e.preventDefault(), ht(r.getPos));
	}
	function T(e) {
		if (!x(f) && !C() && e.button !== 2) {
			if (x(c)) {
				let t = x(c).getBoundingClientRect();
				if (e.clientY > t.bottom - 48) return;
			}
			e.stopPropagation(), ht(r.getPos);
		}
	}
	function E(e) {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), ht(r.getPos));
	}
	hg(e, {
		children: (e, i) => {
			var o = wg(), s = y(o), C = y(s), w = (e) => {
				{
					let t = A(() => a()("videoNode.uploading"));
					ye(e, {
						get text() {
							return x(t);
						},
						showLoader: !0
					});
				}
			}, te = (e) => {
				var i = Cg();
				i.muted = !0;
				let o;
				var s = b(y(i));
				t(i), S(i, (e) => O(c, e), () => x(c)), v((e) => {
					k(i, "src", r.node.attrs.src), o = de(i, 1, "editor-video svelte-s4lxcs", null, o, { loaded: u.isLoaded }), k(i, "data-node-id", x(m)), n(s, ` ${e ?? ""}`);
				}, [() => a()("videoNode.not_supported")]), g("loadeddata", i, function(...e) {
					u.handleLoad?.apply(this, e);
				}), g("error", i, function(...e) {
					u.handleError?.apply(this, e);
				}), _("click", i, T), p(e, i);
			};
			d(C, (e) => {
				x(f) ? e(w) : e(te, -1);
			}), t(s), S(s, (e) => O(l, e), () => x(l));
			var D = b(s, 2), ne = (e) => {
				{
					let t = A(() => a()("videoContextMenu.delete")), n = A(() => a()("videoContextMenu.copyUrl")), i = A(() => a()("videoContextMenu.copySuccess"));
					bg(e, {
						get src() {
							return r.node.attrs.src;
						},
						get onDelete() {
							return r.deleteNode;
						},
						get deleteAriaLabel() {
							return x(t);
						},
						get copyAriaLabel() {
							return x(n);
						},
						get copySuccessMessage() {
							return x(i);
						},
						layout: "editor-video"
					});
				}
			};
			d(D, (e) => {
				x(f) || e(ne);
			}), t(o), v(() => k(s, "aria-label", x(h))), _("click", s, ee), _("keydown", s, E), p(e, o);
		},
		$$slots: { default: !0 }
	}), i(), s();
}
s(["click", "keydown"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/videoExtension.ts
var Dg = eh.create({
	name: "video",
	group: "block",
	draggable: !1,
	addAttributes() {
		return {
			src: { default: null },
			isPlaceholder: { default: !1 },
			alt: { default: null },
			blurhash: { default: null },
			dim: { default: null },
			size: { default: null },
			uploadProtocol: { default: null },
			m: { default: null },
			ox: { default: null },
			x: { default: null }
		};
	},
	parseHTML() {
		return [{ tag: "video[src]" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["video", J(e, { controls: !0 })];
	},
	addNodeView() {
		return dg(Eg);
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/clipboardTextCleanup.ts
function Og(e) {
	let t = [], n = !1;
	for (let r of e) /^\s*```[^`]*$/.test(r) ? n = !n : t.push(n ? r : kg(r));
	return t;
}
function kg(e) {
	let t = e.replace(/^([ \t]*)#{1,6}[ \t]+/, "$1"), n = "", r = 0;
	for (; r < t.length;) {
		let e = Ag(t, r);
		if (e < 0) {
			n += jg(t.slice(r));
			break;
		}
		let i = Ag(t, e + 1);
		if (i < 0) {
			n += jg(t.slice(r));
			break;
		}
		n += jg(t.slice(r, e)), n += t.slice(e + 1, i), r = i + 1;
	}
	return n;
}
function Ag(e, t) {
	for (let n = t; n < e.length; n += 1) {
		if (e[n] !== "`") continue;
		let t = n + 1;
		for (; e[t] === "`";) t += 1;
		if (t - n === 1) return n;
		n = t - 1;
	}
	return -1;
}
function jg(e) {
	let t = Fe(e);
	if (t.length === 0) return Mg(e);
	let n = "", r = 0;
	for (let i of t) i.start < r || (n += Mg(e.slice(r, i.start)), n += e.slice(i.start, i.end), r = i.end);
	return n + Mg(e.slice(r));
}
function Mg(e) {
	return e.replace(/\*\*|__|~~/g, "");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/clipboardExtension.ts
function Ng(e, t) {
	return e.map((e) => {
		let n = e.length > 0 ? [t.text(e)] : [];
		return t.nodes.paragraph.create(null, n);
	});
}
function Pg(e) {
	let t = [];
	return e.content.forEach((e) => {
		if (e.type.name === "paragraph") {
			let n = "";
			e.content.forEach((e) => {
				if (e.isText) n += e.text || "";
				else if (e.type.name === "customEmoji") {
					let t = nt(e.attrs?.shortcode);
					t && (n += `:${t}:`);
				}
			}), t.push(n);
		} else if (e.type.name === "image" || e.type.name === "video") {
			let n = e.attrs?.src;
			n && t.push(n);
		} else e.isTextblock && t.push(e.textContent);
	}), t;
}
function Fg(e) {
	return new DOMParser().parseFromString(e, "text/html").querySelector("p.editor-paragraph[data-pm-slice]") !== null;
}
var Ig = Y.create({
	name: "clipboardExtension",
	addProseMirrorPlugins() {
		let e = !1;
		return [new R({
			key: new z("clipboardExtension"),
			props: {
				transformPastedText(t, n) {
					return e = n, t;
				},
				transformPastedHTML(t) {
					return e = !1, t;
				},
				handlePaste(t, n, r) {
					if (t.editable === !1) return n.preventDefault(), !0;
					let { state: i, dispatch: a } = t, { clipboardData: o } = n;
					if (!o || o.files && o.files.length > 0) return !1;
					let s = o.getData("text/plain"), c = o.types.includes("text/html"), l = !1, u = !1;
					if (c) {
						let e = o.getData("text/html"), t = Fg(e), n = e.includes("data-block=\"true\"") && e.includes("data-editor=");
						u = t || n, l = t || n;
					}
					if (!s) return !1;
					let d = Le(s, {
						collapseEmptyLines: l,
						maxConsecutiveEmptyLines: 1
					}).lines;
					if (c && !e && !u && (d = Og(d)), d.length === 0) return !1;
					let f = Ng(d, i.schema), p = new N(j.from(f), 1, 1);
					return a(i.tr.replaceSelection(p).setMeta("paste", !0).setMeta("uiEvent", "paste").setMeta("addToHistory", !0)), !0;
				},
				clipboardTextSerializer(e) {
					let t = Pg(e);
					return Re(t);
				}
			}
		})];
	}
}), Lg = typeof navigator < "u" && /android/i.test(navigator.userAgent), Rg = 4e3, zg = Y.create({
	name: "androidCompositionFix",
	addStorage() {
		return {
			keepAliveInterval: null,
			isComposing: !1,
			compositionStartHandler: null,
			compositionEndHandler: null
		};
	},
	onCreate() {
		if (!Lg) return;
		let e = this.editor, t = this.storage, n = () => {
			t.isComposing = !0, t.keepAliveInterval && clearInterval(t.keepAliveInterval), t.keepAliveInterval = setInterval(() => {
				if (t.isComposing && e.view.composing) {
					let t = new CompositionEvent("compositionupdate", {
						bubbles: !0,
						cancelable: !0,
						data: ""
					});
					e.view.dom.dispatchEvent(t);
				}
			}, Rg);
		}, r = () => {
			t.isComposing = !1, t.keepAliveInterval &&= (clearInterval(t.keepAliveInterval), null);
		};
		e.view.dom.addEventListener("compositionstart", n), e.view.dom.addEventListener("compositionend", r), t.compositionStartHandler = n, t.compositionEndHandler = r;
	},
	onDestroy() {
		if (!Lg) return;
		let e = this.storage;
		e.keepAliveInterval &&= (clearInterval(e.keepAliveInterval), null);
		let t = e.compositionStartHandler, n = e.compositionEndHandler;
		this.editor?.view?.dom && (t && this.editor.view.dom.removeEventListener("compositionstart", t), n && this.editor.view.dom.removeEventListener("compositionend", n)), e.compositionStartHandler = null, e.compositionEndHandler = null;
	}
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/suggestion/dist/index.js
function Bg(e) {
	let { char: t, allowSpaces: n, allowToIncludeChar: r, allowedPrefixes: i, startOfLine: a, $position: o } = e, s = n && !r, c = om(t), l = RegExp(`\\s${c}$`), u = a ? "^" : "", d = r ? "" : c, f = RegExp(s ? `${u}${c}.*?(?=\\s${d}|$)` : `${u}(?:^)?${c}[^\\s${d}]*`, "gm"), p = o.nodeBefore?.isText && o.nodeBefore.text;
	if (!p) return null;
	let m = o.pos - p.length, h = Array.from(p.matchAll(f)).pop();
	if (!h || h.input === void 0 || h.index === void 0) return null;
	let g = h.input.slice(Math.max(0, h.index - 1), h.index), _ = RegExp(`^[${i?.join("")}\0]?$`).test(g);
	if (i !== null && !_) return null;
	let v = m + h.index, y = v + h[0].length;
	return s && l.test(p.slice(y - 1, y + 1)) && (h[0] += " ", y += 1), v < o.pos && y >= o.pos ? {
		range: {
			from: v,
			to: y
		},
		query: h[0].slice(t.length),
		text: h[0]
	} : null;
}
function Vg(e) {
	return e.docChanged ? e.steps.some((e) => {
		let t = e.slice;
		if (!t?.content) return !1;
		let n = t.content.textBetween(0, t.content.size, "\n");
		return /\s/.test(n);
	}) : !1;
}
function Hg(e) {
	return () => {
		let t = e.state.selection.$anchor.pos, { top: n, right: r, bottom: i, left: a } = e.view.coordsAtPos(t);
		try {
			return new DOMRect(a, n, r - a, i - n);
		} catch {
			return null;
		}
	};
}
function Ug(e, t, n, r) {
	return n ? () => {
		let n = r.getState(e.state)?.decorationId;
		return t.dom.querySelector(`[data-decoration-id="${n}"]`)?.getBoundingClientRect() || null;
	} : Hg(e);
}
function Wg({ match: e, dismissedRange: t, state: n, transaction: r, editor: i, shouldResetDismissed: a, effectiveAllowSpaces: o }) {
	return a?.({
		editor: i,
		state: n,
		range: t,
		match: e,
		transaction: r,
		allowSpaces: o
	}) ? !1 : o ? e.range.from === t.from : e.range.from === t.from && !Vg(r);
}
function Gg({ view: e, pluginKeyRef: t }) {
	let n = e.state.tr.setMeta(t, { exit: !0 });
	e.dispatch(n);
}
function Kg({ pluginKey: e, decorationTag: t, decorationClass: n, decorationContent: r, decorationEmptyClass: i, renderer: a, dispatchExit: o }) {
	return {
		handleKeyDown(t, n) {
			var r;
			let i = e.getState(t.state);
			if (!i.active) return !1;
			if (n.key === "Escape" || n.key === "Esc") {
				var s;
				return a == null || (s = a.onKeyDown) == null || s.call(a, {
					view: t,
					event: n,
					range: i.range
				}), o(t), !0;
			}
			return (a == null || (r = a.onKeyDown) == null ? void 0 : r.call(a, {
				view: t,
				event: n,
				range: i.range
			})) || !1;
		},
		decorations(a) {
			let { active: o, range: s, decorationId: c, query: l } = e.getState(a);
			if (!o) return null;
			let u = !l?.length, d = [n];
			return u && d.push(i), U.create(a.doc, [$c.inline(s.from, s.to, {
				nodeName: t,
				class: d.join(" "),
				"data-decoration-id": c || void 0,
				"data-decoration-content": r
			})]);
		}
	};
}
function qg({ editor: e, char: t, effectiveAllowSpaces: n, allowToIncludeChar: r, allowedPrefixes: i, startOfLine: a, findSuggestionMatch: o, allow: s, shouldShow: c, shouldKeepDismissed: l, pluginKey: u }) {
	return {
		init() {
			return {
				active: !1,
				range: {
					from: 0,
					to: 0
				},
				query: null,
				text: null,
				composing: !1,
				dismissedRange: null
			};
		},
		apply(d, f, p, m) {
			let { isEditable: h } = e, { composing: g } = e.view, { selection: _ } = d, { empty: v, from: y } = _, b = { ...f }, x = d.getMeta(u);
			if (x && x.exit) return b.active = !1, b.decorationId = null, b.range = {
				from: 0,
				to: 0
			}, b.query = null, b.text = null, b.dismissedRange = f.active ? { ...f.range } : f.dismissedRange, b;
			if (b.composing = g, d.docChanged && b.dismissedRange !== null && (b.dismissedRange = {
				from: d.mapping.map(b.dismissedRange.from),
				to: d.mapping.map(b.dismissedRange.to)
			}), h && (v || e.view.composing)) {
				(y < f.range.from || y > f.range.to) && !g && !f.composing && (b.active = !1);
				let u = o({
					char: t,
					allowSpaces: n,
					allowToIncludeChar: r,
					allowedPrefixes: i,
					startOfLine: a,
					$position: _.$from
				}), p = `id_${Math.floor(Math.random() * 4294967295)}`;
				u && s({
					editor: e,
					state: m,
					range: u.range,
					isActive: f.active
				}) && (!c || c({
					editor: e,
					range: u.range,
					query: u.query,
					text: u.text,
					transaction: d
				})) ? (b.dismissedRange !== null && !l({
					match: u,
					dismissedRange: b.dismissedRange,
					state: m,
					transaction: d
				}) && (b.dismissedRange = null), b.dismissedRange === null ? (b.active = !0, b.decorationId = f.decorationId || p, b.range = u.range, b.query = u.query, b.text = u.text) : b.active = !1) : (u || (b.dismissedRange = null), b.active = !1);
			} else b.active = !1;
			return b.active || (b.decorationId = null, b.range = {
				from: 0,
				to: 0
			}, b.query = null, b.text = null), b;
		}
	};
}
function Jg({ editor: e, items: t }) {
	let n = null, r = null, i = null, a = () => {
		r !== null && (clearTimeout(r), r = null), i?.(), i = null;
	}, o = (e) => new Promise((t) => {
		i = t, r = setTimeout(() => {
			r = null;
			let e = i;
			i = null, e?.();
		}, e);
	}), s = () => {
		n?.abort(), a(), n = null;
	};
	return {
		abort: s,
		fetch: async (r, i) => {
			s(), n = new AbortController();
			let a = n;
			if (i > 0 && await o(i), n !== a || a.signal.aborted) return { status: "aborted" };
			try {
				let i = await t({
					editor: e,
					query: r,
					signal: a.signal
				});
				return n !== a || a.signal.aborted ? { status: "aborted" } : {
					status: "resolved",
					items: i
				};
			} catch {
				return n !== a || a.signal.aborted ? { status: "aborted" } : { status: "error" };
			}
		}
	};
}
function Yg({ placement: e, offset: t, flip: n, floatingUi: r }) {
	var i;
	let a = [Ue({
		mainAxis: t.mainAxis ?? 4,
		crossAxis: t.crossAxis ?? 0
	})];
	return n && a.push(Be()), r != null && (i = r.middleware) != null && i.length && a.push(...r.middleware), {
		placement: e,
		strategy: r?.strategy ?? "absolute",
		middleware: a
	};
}
function Xg(e) {
	if (e instanceof HTMLElement) return e;
	if (typeof e == "string") try {
		let t = document.querySelector(e);
		if (t) return t;
	} catch {
		return document.body;
	}
	return document.body;
}
function Zg({ getReferenceRect: e, contextElement: t, config: n, container: r, dismissOnOutsideClick: i, dismiss: a }) {
	return (o, s = {}) => {
		let c = {
			getBoundingClientRect: () => e() ?? new DOMRect(),
			contextElement: t
		}, l = !1, u = !o.isConnected;
		u && Xg(r).appendChild(o), s.onPosition || (o.style.visibility = "hidden", o.style.width = "max-content");
		let d = Ve(c, o, () => {
			He(c, o, {
				placement: n.placement,
				strategy: n.strategy,
				middleware: n.middleware
			}).then(({ x: e, y: t, placement: n, strategy: r }) => {
				s.onPosition ? s.onPosition({
					x: e,
					y: t,
					placement: n,
					strategy: r
				}) : (Object.assign(o.style, {
					position: r,
					left: `${e}px`,
					top: `${t}px`
				}), l || (l = !0, o.style.visibility = ""));
			});
		}, s.autoUpdate), f;
		return i && (f = (e) => {
			let n = e.target;
			!(n instanceof Node) || o.contains(n) || t.contains(n) || a();
		}, document.addEventListener("pointerdown", f, !0)), () => {
			d(), f && document.removeEventListener("pointerdown", f, !0), u && o.remove();
		};
	};
}
function Qg({ editor: e, pluginKey: t, items: n, renderer: r, minQueryLength: i, debounce: a, initialItems: o, placement: s, offset: c, container: l, flip: u, floatingUi: d, dismissOnOutsideClick: f, command: p, clientRectFor: m, dispatchExit: h }) {
	let g, _ = Jg({
		editor: e,
		items: n
	}), v = Yg({
		placement: s,
		offset: c,
		flip: u,
		floatingUi: d
	});
	function y(e, t) {
		switch (e) {
			case "started":
				var n;
				r == null || (n = r.onStart) == null || n.call(r, t);
				break;
			case "updated":
				var i;
				r == null || (i = r.onUpdate) == null || i.call(r, t);
				break;
			case "stopped":
				var a;
				r == null || (a = r.onExit) == null || a.call(r, t);
		}
	}
	return {
		update: async (n, d) => {
			let b = t.getState(d), x = t.getState(n.state);
			if (!b || !x) return;
			let S = null, C = b.query !== x.query, ee = b.text !== x.text, w = b.range.from !== x.range.from || b.range.to !== x.range.to, T = C || ee || w;
			if (!b.active && x.active) S = "started";
			else if (b.active && !x.active) S = "stopped";
			else if (x.active && T) S = "updated";
			else return;
			let E = S === "stopped" ? b : x, te = n.dom.querySelector(`[data-decoration-id="${E.decorationId}"]`), D = m(n, te), O = i === 0 || (E.query ? E.query.length >= i : !1), ne = (S === "started" || S === "updated") && O;
			if (g = {
				editor: e,
				range: E.range,
				query: E.query || "",
				text: E.text || "",
				items: o ?? [],
				command: (t) => p({
					editor: e,
					range: E.range,
					props: t
				}),
				decorationNode: te,
				clientRect: D,
				loading: ne,
				placement: s,
				offset: {
					mainAxis: c.mainAxis ?? 4,
					crossAxis: c.crossAxis ?? 0
				},
				container: l,
				flip: u,
				floatingUi: v,
				mount: Zg({
					getReferenceRect: D,
					contextElement: n.dom,
					config: v,
					container: l,
					dismissOnOutsideClick: f,
					dismiss: () => h(e.view)
				})
			}, S === "started") {
				var re;
				r == null || (re = r.onBeforeStart) == null || re.call(r, g);
			}
			if (S === "updated") {
				var ie;
				r == null || (ie = r.onBeforeUpdate) == null || ie.call(r, g);
			}
			if (S === "started" && y(S, g), S === "started" || S === "updated") {
				if (!ne) _.abort(), g = {
					...g,
					items: o ?? [],
					loading: !1
				};
				else {
					g = {
						...g,
						items: o ?? [],
						loading: !0
					}, S = "updated", y(S, g);
					let e = await _.fetch(E.query || "", a);
					if (e.status === "aborted") return;
					if (!t.getState(n.state)?.active) {
						_.abort();
						return;
					}
					g = e.status === "resolved" ? {
						...g,
						items: e.items,
						loading: !1
					} : {
						...g,
						loading: !1
					};
				}
			}
			S === "stopped" ? (_.abort(), y(S, g), g = void 0) : S === "updated" && y(S, g);
		},
		destroy: () => {
			var e;
			_.abort(), g && (r == null || (e = r.onExit) == null || e.call(r, g));
		}
	};
}
var $g = new z("suggestion");
function e_({ pluginKey: e = $g, editor: t, char: n = "@", allowSpaces: r = !1, allowToIncludeChar: i = !1, allowedPrefixes: a = [" "], startOfLine: o = !1, decorationTag: s = "span", decorationClass: c = "suggestion", decorationContent: l = "", decorationEmptyClass: u = "is-empty", command: d = () => null, items: f = () => [], minQueryLength: p = 0, debounce: m = 0, initialItems: h, placement: g = "bottom-start", offset: _ = {}, container: v, flip: y = !0, floatingUi: b, dismissOnOutsideClick: x = !0, render: S = () => ({}), allow: C = () => !0, findSuggestionMatch: ee = Bg, shouldShow: w, shouldResetDismissed: T }) {
	let E = S?.(), te = r && !i, D = (n, r) => Ug(t, n, r, e);
	function O(e) {
		return Wg({
			...e,
			editor: t,
			shouldResetDismissed: T,
			effectiveAllowSpaces: te
		});
	}
	let ne = (t) => Gg({
		view: t,
		pluginKeyRef: e
	});
	return new R({
		key: e,
		view: () => Qg({
			editor: t,
			pluginKey: e,
			items: f,
			renderer: E,
			minQueryLength: p,
			debounce: m,
			initialItems: h,
			placement: g,
			offset: _,
			container: v,
			flip: y,
			floatingUi: b,
			dismissOnOutsideClick: x,
			command: d,
			clientRectFor: D,
			dispatchExit: ne
		}),
		state: qg({
			editor: t,
			char: n,
			effectiveAllowSpaces: te,
			allowToIncludeChar: i,
			allowedPrefixes: a,
			startOfLine: o,
			findSuggestionMatch: ee,
			allow: C,
			shouldShow: w,
			shouldKeepDismissed: O,
			pluginKey: e
		}),
		props: Kg({
			pluginKey: e,
			decorationTag: s,
			decorationClass: c,
			decorationContent: l,
			decorationEmptyClass: u,
			renderer: E,
			dispatchExit: ne
		})
	});
}
var t_ = e_, n_ = o("<!> <!>", 1), r_ = {
	hash: "svelte-1ybpe8d",
	code: ".suggestion-command {display:inline-block;width:fit-content;max-width:calc(100vw - 16px);background:var(--window);color:var(--text);overflow:hidden;}.suggestion-command-list {--suggestion-command-row-height: 40px;--suggestion-command-visible-rows: 10;max-height:calc(\n            var(--suggestion-command-row-height) *\n                var(--suggestion-command-visible-rows)\n        );width:max-content;max-width:100%;}.suggestion-command-scroll {width:max-content;max-width:100%;max-height:calc(\n            var(--suggestion-command-row-height) *\n                var(--suggestion-command-visible-rows)\n        );overflow:hidden;}.suggestion-command-viewport {max-height:calc(\n            var(--suggestion-command-row-height) *\n                var(--suggestion-command-visible-rows)\n        );width:max-content;max-width:calc(100vw - 16px);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}.suggestion-command-item {display:grid;grid-template-columns:var(\n            --suggestion-command-item-columns,\n            minmax(0, 1fr)\n        );align-items:center;gap:8px;width:100%;max-width:calc(100vw - 16px);min-height:var(--suggestion-command-row-height);padding:4px 10px;cursor:pointer;color:var(--text);outline:none;user-select:none;}.suggestion-command-item.selected,\n    .suggestion-command-item[data-highlighted] {background:var(--btn-hover-bg);}\n\n    @media (hover: hover) and (pointer: fine) {.suggestion-command-item:hover {background:var(--btn-hover-bg);}\n    }.suggestion-command-scrollbar {display:flex;width:8px;padding:1px;background:transparent;}.suggestion-command-scrollbar-thumb {flex:1;border-radius:999px;background:var(--border);}"
};
function i_(e, t) {
	fe(t, !0), te(e, r_);
	let n = ae(t, "rootClass", 3, ""), r = ae(t, "itemClass", 3, ""), o = w(0), s = w(null);
	function u() {
		t.items.length > 0 && (O(o, (x(o) + 1) % t.items.length), v());
	}
	function f() {
		t.items.length > 0 && (O(o, (x(o) - 1 + t.items.length) % t.items.length), v());
	}
	function m() {
		let e = t.items[x(o)];
		return e !== void 0 && (t.onSelect(e), !0);
	}
	function g() {
		O(o, 0), v();
	}
	function _(e) {
		t.onSelect(e);
	}
	function v() {
		ce().then(y);
	}
	function y() {
		if (!x(s)) return;
		let e = x(s).querySelector(".suggestion-command-item.selected");
		if (!e) return;
		let t = e.offsetTop, n = t + e.offsetHeight, r = x(s).scrollTop, i = r + x(s).clientHeight;
		t < r ? x(s).scrollTop = t : n > i && (x(s).scrollTop = n - x(s).clientHeight);
	}
	var S = {
		moveDown: u,
		moveUp: f,
		confirmSelection: m,
		resetIndex: g
	}, C = h(), ee = D(C), T = (e) => {
		var i = h(), u = D(i);
		{
			let e = A(() => `suggestion-command ${n()}`.trim());
			c(u, () => Ge, (n, i) => {
				i(n, {
					get class() {
						return x(e);
					},
					shouldFilter: !1,
					loop: !0,
					children: (e, n) => {
						var i = h(), u = D(i);
						c(u, () => Je, (e, n) => {
							n(e, {
								class: "suggestion-command-list",
								children: (e, n) => {
									var i = h(), u = D(i);
									c(u, () => We, (e, n) => {
										n(e, {
											type: "auto",
											class: "suggestion-command-scroll",
											children: (e, n) => {
												var i = n_(), u = D(i);
												c(u, () => Ke, (e, n) => {
													n(e, {
														class: "suggestion-command-viewport",
														get ref() {
															return x(s);
														},
														set ref(e) {
															O(s, e, !0);
														},
														children: (e, n) => {
															var i = h(), s = D(i);
															a(s, 19, () => t.items, (e) => t.getKey(e), (e, n, i) => {
																var a = h(), s = D(a);
																{
																	let e = A(() => t.getValue(x(n))), a = A(() => [t.getValue(x(n))]), u = A(() => `suggestion-command-item ${r()}${x(i) === x(o) ? " selected" : ""}`.trim());
																	c(s, () => Xe, (r, s) => {
																		s(r, {
																			get value() {
																				return x(e);
																			},
																			get keywords() {
																				return x(a);
																			},
																			get class() {
																				return x(u);
																			},
																			onSelect: () => _(x(n)),
																			onmouseenter: () => {
																				O(o, x(i), !0);
																			},
																			get onmousedown() {
																				return gt;
																			},
																			get ontouchstart() {
																				return _t;
																			},
																			children: (e, r) => {
																				var a = h(), s = D(a);
																				l(s, () => t.children, () => x(n), () => x(i), () => x(i) === x(o)), p(e, a);
																			},
																			$$slots: { default: !0 }
																		});
																	});
																}
																p(e, a);
															}), p(e, i);
														},
														$$slots: { default: !0 }
													});
												});
												var d = b(u, 2);
												c(d, () => Ye, (e, t) => {
													t(e, {
														orientation: "vertical",
														class: "suggestion-command-scrollbar",
														children: (e, t) => {
															var n = h(), r = D(n);
															c(r, () => qe, (e, t) => {
																t(e, { class: "suggestion-command-scrollbar-thumb" });
															}), p(e, n);
														},
														$$slots: { default: !0 }
													});
												}), p(e, i);
											},
											$$slots: { default: !0 }
										});
									}), p(e, i);
								},
								$$slots: { default: !0 }
							});
						}), p(e, i);
					},
					$$slots: { default: !0 }
				});
			});
		}
		p(e, i);
	};
	return d(ee, (e) => {
		t.items.length > 0 && e(T);
	}), p(e, C), i(S);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/HashtagSuggestionList.svelte
var a_ = o("<span class=\"hashtag-prefix svelte-1kcfexa\">#</span> <span class=\"hashtag-label svelte-1kcfexa\"> </span>", 1), o_ = {
	hash: "svelte-1kcfexa",
	code: ".hashtag-suggestion-command {--suggestion-command-item-columns: auto minmax(0, 1fr);}.hashtag-prefix.svelte-1kcfexa {opacity:0.65;}.hashtag-label.svelte-1kcfexa {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.95rem;font-weight:600;}"
};
function s_(e, t) {
	fe(t, !0), te(e, o_);
	let r = w(null);
	function a() {
		x(r)?.moveDown?.();
	}
	function o() {
		x(r)?.moveUp?.();
	}
	function s() {
		return x(r)?.confirmSelection?.() ?? !1;
	}
	function c() {
		x(r)?.resetIndex?.();
	}
	var l = {
		moveDown: a,
		moveUp: o,
		confirmSelection: s,
		resetIndex: c
	};
	return S(i_(e, {
		get items() {
			return t.items;
		},
		getKey: (e) => e,
		getValue: (e) => e,
		get onSelect() {
			return t.onSelect;
		},
		rootClass: "hashtag-suggestion-command",
		itemClass: "hashtag-suggestion-item",
		children: (e, t = E) => {
			var r = a_(), i = b(D(r), 2), a = ue(i, !0);
			v(() => n(a, t())), p(e, r);
		},
		$$slots: { default: !0 }
	}), (e) => O(r, e, !0), () => x(r)), i(l);
}
var c_ = 1;
function l_(e) {
	return e.toLowerCase();
}
function u_(e) {
	return typeof e?.tag == "string" && typeof e?.lastUsed == "number";
}
function d_(e) {
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return !Array.isArray(t) || !t.every(u_) ? null : t;
	} catch {
		return null;
	}
}
function f_(e) {
	return {
		tag: e.tag,
		lastUsed: e.lastUsed,
		useCount: e.useCount
	};
}
function p_(e, t, n, r) {
	let i = r();
	return {
		tagLower: l_(e),
		tag: e,
		useCount: t,
		lastUsed: n,
		createdAt: i,
		updatedAt: i,
		schemaVersion: c_
	};
}
function m_(e, t) {
	return t.useCount === e.useCount ? t.lastUsed === e.lastUsed ? e.tagLower.localeCompare(t.tagLower) : t.lastUsed - e.lastUsed : t.useCount - e.useCount;
}
function h_(e, t) {
	return !t || e === t ? 0 : e.startsWith(t) ? 1 : e.includes(t) ? 2 : 3;
}
function g_(e) {
	let t = l_(e);
	return (e, n) => {
		let r = h_(e.tagLower, t) - h_(n.tagLower, t);
		return r === 0 ? m_(e, n) : r;
	};
}
var __ = new class {
	db;
	now;
	getStorage;
	constructor(e = je, t = Date.now, n = () => he()) {
		this.db = e, this.now = t, this.getStorage = n;
	}
	async getAll() {
		return await this.ensureLegacyHistoryMigrated(), (await this.db.hashtagHistory.toArray()).sort(m_).map(f_);
	}
	async save(e) {
		if (!e.length) return;
		await this.ensureLegacyHistoryMigrated();
		let t = this.now(), n = [...new Set(e.filter((e) => typeof e == "string" && e.length > 0 && e.length <= 100).map(l_))];
		if (n.length === 0) return;
		let r = await this.db.hashtagHistory.bulkGet(n), i = /* @__PURE__ */ new Map();
		r.forEach((e) => {
			e && i.set(e.tagLower, e);
		});
		let a = /* @__PURE__ */ new Map();
		for (let n of e) {
			if (!n || n.length > 100) continue;
			let e = l_(n), r = i.get(e);
			if (r) {
				let n = {
					...r,
					useCount: r.useCount + 1,
					lastUsed: t,
					updatedAt: t,
					schemaVersion: c_
				};
				i.set(e, n), a.set(e, n);
			} else {
				let r = p_(n, 1, t, () => t);
				i.set(e, r), a.set(e, r);
			}
		}
		let o = [...a.values()];
		o.length !== 0 && await this.db.transaction("rw", this.db.hashtagHistory, async () => {
			await this.db.hashtagHistory.bulkPut(o), await this.trimToMax();
		});
	}
	async getSuggestions(e) {
		await this.ensureLegacyHistoryMigrated();
		let t = l_(e);
		return (await this.db.hashtagHistory.toArray()).filter((e) => !t || e.tagLower.includes(t)).sort(g_(e)).slice(0, 5).map((e) => e.tag);
	}
	async trimToMax() {
		let e = (await this.db.hashtagHistory.toArray()).sort(m_).slice(100);
		e.length !== 0 && await this.db.hashtagHistory.bulkDelete(e.map((e) => e.tagLower));
	}
	async ensureLegacyHistoryMigrated() {
		if ((await this.db.legacyImportState.get("migrated.localStorage.hashtagHistory.v1"))?.done === !0) return;
		let e = this.getStorage(), t = d_(e.getItem(Ee.HASHTAG_HISTORY));
		if (t === null) return;
		let n = /* @__PURE__ */ new Map();
		for (let e of t) {
			if (!e.tag || e.tag.length > 100) continue;
			let t = l_(e.tag), r = n.get(t), i = Math.max(1, e.useCount ?? 1);
			(!r || e.lastUsed > r.lastUsed) && n.set(t, p_(e.tag, i, e.lastUsed, this.now));
		}
		let r = !1;
		if (await this.db.transaction("rw", this.db.hashtagHistory, this.db.legacyImportState, async () => {
			if ((await this.db.legacyImportState.get("migrated.localStorage.hashtagHistory.v1"))?.done === !0) {
				r = !0;
				return;
			}
			let e = [...n.values()].sort(m_).slice(0, 100);
			e.length > 0 && await this.db.hashtagHistory.bulkPut(e), await this.db.legacyImportState.put({
				id: Me,
				done: !0,
				updatedAt: this.now()
			}), r = !0;
		}), r) try {
			e.removeItem(Ee.HASHTAG_HISTORY);
		} catch {}
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/hashtagHistory.ts
function v_(e) {
	return __.save(e);
}
function y_(e) {
	return __.getSuggestions(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/suggestionRenderer.ts
function b_({ component: e, className: t, approxDropdownHeight: n = 220, zIndex: r = "9999", getProps: i }) {
	return () => {
		let a = null, o = null, s = [], c = null;
		function l() {
			return a ?? {};
		}
		function u() {
			let e = document.createElement("div");
			return t && (e.className = t), e.style.position = "fixed", e.style.zIndex = r, ge().overlayTarget.appendChild(e), e;
		}
		function d() {
			if (!o || !c || (a &&= (m(a), null), !s.length)) return;
			let t = i?.({
				items: s,
				command: c
			}) ?? {
				items: s,
				onSelect: c
			};
			a = me(e, {
				target: o,
				props: t
			});
		}
		function f(e) {
			if (!o || !e) return;
			let t = e();
			if (!t) return;
			let r = window.innerHeight - t.bottom, i = o.offsetWidth, a = Math.max(0, window.innerWidth - i - 8);
			o.style.left = `${Math.min(Math.max(0, t.left), a)}px`, r < n && t.top > n ? o.style.top = `${t.top - n - 4}px` : o.style.top = `${t.bottom + 4}px`;
		}
		function p() {
			a &&= (m(a), null), o &&= (o.remove(), null), s = [], c = null;
		}
		return {
			onStart(e) {
				s = e.items ?? [], c = e.command ?? null, s.length && (o = u(), d(), requestAnimationFrame(() => f(e.clientRect)));
			},
			onUpdate(e) {
				s = e.items ?? [], c = e.command ?? null, s.length ? (o ||= u(), d(), l().resetIndex?.(), requestAnimationFrame(() => f(e.clientRect))) : a &&= (m(a), null);
			},
			onKeyDown(e) {
				if (!s.length || !e.event) return !1;
				let t = l();
				switch (e.event.key) {
					case "ArrowDown": return t.moveDown?.(), !0;
					case "Tab": return t.confirmSelection?.() ?? !1;
					case "ArrowUp": return t.moveUp?.(), !0;
					case "Enter": return t.confirmSelection?.() ?? !1;
					default: return !1;
				}
			},
			onExit() {
				p();
			}
		};
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/hashtagSuggestion.ts
var x_ = Y.create({
	name: "hashtagSuggestion",
	addProseMirrorPlugins() {
		return [t_({
			editor: this.editor,
			char: "#",
			allowSpaces: !1,
			allowedPrefixes: [
				" ",
				"\n",
				"	",
				"　"
			],
			items: ({ query: e }) => y_(e),
			render: b_({ component: s_ }),
			command: ({ editor: e, range: t, props: n }) => {
				e.chain().focus().deleteRange(t).insertContent("#" + n + " ").run();
			}
		})];
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useCustomEmojiDrag.svelte.ts
function S_(e, t) {
	window.dispatchEvent(new CustomEvent({
		start: "touch-custom-emoji-drag-start",
		move: "touch-custom-emoji-drag-move",
		end: "touch-custom-emoji-drop"
	}[e], {
		detail: t,
		bubbles: !0,
		cancelable: !0
	}));
}
function C_({ getElement: e, getPos: t, dragState: n, getNodeAttrs: r }) {
	let i = rt();
	function a() {
		n.longPressTimeout &&= (clearTimeout(n.longPressTimeout), null), n.startTarget = null;
	}
	function o() {
		let e = t();
		typeof e == "number" && n.startTarget && (n.isDragging = !0, n.draggedNodePos = e, S_("start", { nodePos: e }), n.preview = ft(n.startTarget, n.startPos.x, n.startPos.y));
	}
	function s(e) {
		if (e.touches.length !== 1) return;
		st();
		let t = we(e);
		a(), n.startPos = {
			x: t.x,
			y: t.y
		}, n.startTarget = e.currentTarget, n.longPressTimeout = setTimeout(o, 400);
	}
	function c(e) {
		if (e.touches.length !== 1) {
			a();
			return;
		}
		let r = we(e);
		!n.isDragging && n.longPressTimeout && ut(r.x, r.y, n.startPos.x, n.startPos.y, 10) ? a() : n.isDragging && (e.preventDefault(), ot(n.preview, r.x, r.y), dt(r.x, r.y), S_("move", {
			touchX: r.x,
			touchY: r.y,
			nodePos: t()
		}));
	}
	function l(e) {
		if (n.longPressTimeout && a(), !n.isDragging) return;
		e.preventDefault();
		let i = we(e), o = document.elementFromPoint(i.x, i.y), s = (o?.closest(".drop-zone-indicator, .custom-emoji-origin-drop-zone"))?.getAttribute("data-drop-pos");
		S_("end", {
			nodeData: {
				type: "customEmoji",
				attrs: r(),
				pos: t()
			},
			dropX: i.x,
			dropY: i.y,
			target: o,
			dropPosition: s ? Number.parseInt(s, 10) : null
		}), n.isDragging = !1, n.draggedNodePos = null, lt(n.preview), n.preview = null;
	}
	function u(e) {
		e.pointerType !== "touch" && e.button === 0 && (e.preventDefault(), e.stopPropagation(), a(), n.startPos = {
			x: e.clientX,
			y: e.clientY
		}, n.startTarget = e.currentTarget, window.addEventListener("pointermove", d, { passive: !1 }), window.addEventListener("pointerup", p, { passive: !1 }), window.addEventListener("pointercancel", p, { passive: !1 }));
	}
	function d(e) {
		if (e.pointerType !== "touch") {
			if (!n.isDragging) {
				if (!ut(e.clientX, e.clientY, n.startPos.x, n.startPos.y, 10)) return;
				o();
			}
			e.preventDefault(), ot(n.preview, e.clientX, e.clientY), dt(e.clientX, e.clientY), S_("move", {
				touchX: e.clientX,
				touchY: e.clientY,
				nodePos: t()
			});
		}
	}
	function f() {
		window.removeEventListener("pointermove", d), window.removeEventListener("pointerup", p), window.removeEventListener("pointercancel", p);
	}
	function p(e) {
		if (e.pointerType === "touch") return;
		if (f(), !n.isDragging) {
			n.startTarget = null;
			return;
		}
		e.preventDefault();
		let i = document.elementFromPoint(e.clientX, e.clientY), a = (i?.closest(".drop-zone-indicator, .custom-emoji-origin-drop-zone"))?.getAttribute("data-drop-pos");
		S_("end", {
			nodeData: {
				type: "customEmoji",
				attrs: r(),
				pos: t()
			},
			dropX: e.clientX,
			dropY: e.clientY,
			target: i,
			dropPosition: a ? Number.parseInt(a, 10) : null
		}), n.isDragging = !1, n.draggedNodePos = null, n.startTarget = null, lt(n.preview), n.preview = null;
	}
	ie(() => {
		let t = e();
		if (t) return t.addEventListener("pointerdown", u, { passive: !1 }), i && (t.addEventListener("touchstart", s, { passive: !1 }), t.addEventListener("touchmove", c, { passive: !1 }), t.addEventListener("touchend", l, { passive: !1 }), t.addEventListener("touchcancel", l, { passive: !1 })), () => {
			t.removeEventListener("pointerdown", u), i && (t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", c), t.removeEventListener("touchend", l), t.removeEventListener("touchcancel", l)), f(), a(), lt(n.preview), n.draggedNodePos = null, n.preview = null;
		};
	});
	function m() {
		f(), a(), lt(n.preview), n.draggedNodePos = null, n.preview = null;
	}
	return { cleanup: m };
}
// D:/ドキュメント/GitHub/ehagaki/src/components/SvelteCustomEmojiNode.svelte
var w_ = o("<span class=\"custom-emoji-drag-target svelte-2v0oq4\" data-drag-handle=\"\" draggable=\"false\"><img class=\"custom-emoji-image svelte-2v0oq4\" data-custom-emoji=\"true\" draggable=\"false\"/></span>"), T_ = {
	hash: "svelte-2v0oq4",
	code: ".custom-emoji-wrapper,\n    .custom-emoji-wrapper[data-node-view-wrapper] {display:inline-block;width:auto;height:34px;margin:0;vertical-align:bottom;border-radius:4px;line-height:0;}.custom-emoji-wrapper.is-selected {outline:2px solid var(--theme);outline-offset:1px;}.custom-emoji-wrapper.custom-emoji-origin-drop-zone {outline:2px solid dodgerblue;outline-offset:2px;background:rgba(30, 144, 255, 0.16);}\n            .custom-emoji-wrapper.custom-emoji-origin-drop-zone.drop-zone-hover\n         {outline-color:var(--yellow);outline-width:3px;background:rgba(255, 200, 0, 0.28);box-shadow:0 0 0 3px rgba(255, 200, 0, 0.22);}.custom-emoji-image.svelte-2v0oq4 {width:auto;height:100%;max-width:none;user-select:none;-webkit-user-drag:none;pointer-events:none;}.custom-emoji-drag-target.svelte-2v0oq4 {display:inline-flex;align-items:center;justify-content:center;height:100%;min-width:1.2em;cursor:grab;touch-action:pan-y;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;}.custom-emoji-drag-target[data-dragging=\"true\"].svelte-2v0oq4 {opacity:0.35;}.drop-zone-indicator.custom-emoji-drop-zone {display:inline-flex;align-items:center;justify-content:center;width:12px;height:1.5lh;min-height:0;margin:0;padding:0;vertical-align:middle;background:none;border:0;box-shadow:none;position:relative;cursor:pointer;}.drop-zone-indicator.custom-emoji-drop-zone .drop-zone-bar {width:4px;height:1.4lh;min-height:0;border-radius:999px;background:dodgerblue;margin:0;padding:0;}\n            .drop-zone-indicator.custom-emoji-drop-zone.drop-zone-hover\n                .drop-zone-bar\n         {background:var(--yellow);outline:2px solid var(--yellow);}\n\n    @media (hover: none) {.custom-emoji-drag-target.svelte-2v0oq4 {cursor:default;}\n    }"
};
function E_(e, t) {
	fe(t, !0), te(e, T_);
	let n = A(() => String(t.node.attrs.shortcode ?? "")), r = A(() => String(t.node.attrs.identityKey ?? "")), a = A(() => x(n) ? `:${x(n)}:` : "Custom emoji"), o = w(void 0), s = cw, c = rt(), l = w(void 0);
	function u() {
		try {
			let e = t.getPos();
			return typeof e == "number" ? e : void 0;
		} catch {
			return;
		}
	}
	ie(() => {
		let e = s.isDragging, t = s.draggedNodePos, n = u();
		O(l, e && typeof n == "number" && t === n ? n : void 0, !0);
	});
	let { cleanup: d } = C_({
		getElement: () => x(o),
		getPos: u,
		dragState: s,
		getNodeAttrs: () => t.node.attrs
	});
	function f(e) {
		if (c) {
			e.preventDefault();
			return;
		}
		if (!e.dataTransfer) return;
		let n = u();
		typeof n == "number" && (e.dataTransfer.setData("application/x-tiptap-node", JSON.stringify({
			type: "customEmoji",
			attrs: t.node.attrs,
			pos: n
		})), e.dataTransfer.effectAllowed = "move", s.isDragging = !0, s.draggedNodePos = n, window.dispatchEvent(new CustomEvent("custom-emoji-native-drag-start", { detail: { nodePos: n } })));
	}
	function m() {
		s.isDragging = !1, s.draggedNodePos = null, window.dispatchEvent(new CustomEvent("custom-emoji-native-drag-end"));
	}
	function h(e) {
		(e.type === "touchstart" || typeof PointerEvent < "u" && e instanceof PointerEvent && e.pointerType === "touch") && gt(e);
		let n = u();
		if (typeof n != "number") return;
		let { state: r, view: i } = t.editor, a = L.create(r.doc, n);
		a.eq(r.selection) || i.dispatch(r.tr.setSelection(a));
	}
	se(() => {
		d(), Object.assign(cw, {
			isDragging: !1,
			draggedNodePos: null,
			longPressTimeout: null,
			startTarget: null,
			preview: null
		});
	});
	{
		let i = A(() => `custom-emoji-wrapper${t.selected ? " is-selected" : ""}${typeof x(l) == "number" ? " custom-emoji-origin-drop-zone" : ""}`);
		hg(e, {
			as: "span",
			get class() {
				return x(i);
			},
			get "data-drop-pos"() {
				return x(l);
			},
			children: (e, i) => {
				var c = w_(), l = ue(c);
				S(c, (e) => O(o, e), () => x(o)), v(() => {
					k(c, "data-dragging", s.isDragging), k(c, "title", x(a)), k(c, "aria-label", x(a)), k(l, "data-identity-key", x(r)), k(l, "data-shortcode", x(n)), k(l, "data-set-address", t.node.attrs.setAddress ?? void 0), k(l, "src", t.node.attrs.src), k(l, "alt", x(a));
				}), g("pointerdown", c, h, !0), g("touchstart", c, h, !0, !0), g("dragstart", c, f), g("dragend", c, m), p(e, c);
			},
			$$slots: { default: !0 }
		});
	}
	i();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiExtension.ts
function D_(e) {
	return nt(e);
}
function O_(e) {
	return D_(e.getAttribute("data-shortcode") ?? "") || D_((e.getAttribute("alt") ?? "").match(/^:([^:]+):$/)?.[1] ?? "");
}
function k_(e) {
	let t = e.getAttribute("data-identity-key") ?? "";
	if (t) return t;
	let n = O_(e), r = e.getAttribute("src") ?? "", i = e.getAttribute("data-set-address") ?? null;
	return !n || !r ? "" : et({
		shortcodeLower: Qe(n),
		src: r,
		setAddress: i
	});
}
var A_ = "[\\p{L}\\p{N}_+-]", j_ = RegExp(`:(${A_}{1,64}):$`, "u"), M_ = RegExp(`:(${A_}{1,64}):`, "gu");
function N_(e, t) {
	return $e(e, t[1]);
}
function P_(e, t) {
	return [...e.matchAll(M_)].filter((e) => N_(t, e)).map((e) => ({
		index: e.index ?? 0,
		text: e[0],
		replaceWith: String(e[1] ?? "")
	}));
}
var F_ = eh.create({
	name: "customEmoji",
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	draggable: !0,
	addOptions() {
		return { getItems: () => Ze.items };
	},
	addAttributes() {
		return {
			identityKey: {
				default: "",
				parseHTML: (e) => k_(e)
			},
			shortcode: {
				default: "",
				parseHTML: (e) => O_(e)
			},
			src: {
				default: "",
				parseHTML: (e) => e.getAttribute("src") ?? ""
			},
			setAddress: {
				default: null,
				parseHTML: (e) => e.getAttribute("data-set-address"),
				renderHTML: (e) => e.setAddress ? { "data-set-address": e.setAddress } : {}
			}
		};
	},
	parseHTML() {
		return [{ tag: "img[data-custom-emoji]" }, { tag: "img.custom-emoji-inline[alt]" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		let t = D_(e.shortcode ?? ""), n = typeof e.setAddress == "string" ? e.setAddress : typeof e["data-set-address"] == "string" ? e["data-set-address"] : null, r = String(e.identityKey || (t && e.src ? et({
			shortcodeLower: Qe(t),
			src: String(e.src),
			setAddress: n
		}) : "")), { identityKey: i, shortcode: a, setAddress: o, ...s } = e;
		return ["img", J(s, {
			"data-custom-emoji": "true",
			"data-identity-key": r,
			"data-shortcode": t,
			alt: t ? `:${t}:` : "",
			class: "custom-emoji-inline"
		})];
	},
	addCommands() {
		return { insertCustomEmoji: (e) => ({ chain: t }) => {
			let n = D_(e.shortcode);
			if (!n || !e.src) return !1;
			let r = e.setAddress ?? null, i = e.identityKey || et({
				shortcodeLower: Qe(n),
				src: e.src,
				setAddress: r
			});
			return t().insertContent({
				type: this.name,
				attrs: {
					identityKey: i,
					shortcode: n,
					src: e.src,
					setAddress: r
				}
			}).run();
		} };
	},
	addInputRules() {
		return [new gm({
			find: j_,
			handler: ({ state: e, range: t, match: n }) => {
				let r = N_(this.options.getItems(), n);
				if (!r) return null;
				e.tr.replaceWith(t.from, t.to, this.type.create({
					shortcode: D_(r.shortcode),
					identityKey: r.identityKey,
					src: r.src,
					setAddress: r.setAddress
				})).scrollIntoView();
			}
		})];
	},
	addPasteRules() {
		return [new Tm({
			find: (e) => P_(e, this.options.getItems()),
			handler: ({ state: e, range: t, match: n }) => {
				let r = N_(this.options.getItems(), n);
				if (!r) return null;
				e.tr.replaceWith(t.from, t.to, this.type.create({
					shortcode: D_(r.shortcode),
					identityKey: r.identityKey,
					src: r.src,
					setAddress: r.setAddress
				}));
			}
		})];
	},
	addNodeView() {
		return dg(E_);
	}
}), I_ = "customEmojiDrag", L_ = "application/x-tiptap-node";
function R_(e) {
	let t = e.dataTransfer?.getData(L_);
	if (!t) return null;
	try {
		let e = JSON.parse(t);
		return e?.type !== "customEmoji" || typeof e.pos != "number" ? null : {
			pos: e.pos,
			attrs: e.attrs ?? {}
		};
	} catch {
		return null;
	}
}
function z_(e, t) {
	let n = t.target?.closest?.(".custom-emoji-wrapper, .custom-emoji-drag-target, [data-custom-emoji]");
	if (!n) return null;
	let r = null;
	return e.state.doc.descendants((t, i) => {
		if (r || t.type.name !== "customEmoji") return;
		let a = e.nodeDOM(i);
		if (a instanceof HTMLElement && a.contains(n)) return r = {
			pos: i,
			attrs: t.attrs
		}, !1;
	}), r;
}
function B_(e, t) {
	return R_(t) ?? z_(e, t);
}
function V_(e, t) {
	let n = (document.elementFromPoint(e, t)?.closest(".drop-zone-indicator[data-drop-pos], .custom-emoji-origin-drop-zone[data-drop-pos]"))?.getAttribute("data-drop-pos");
	if (!n) return null;
	let r = Number.parseInt(n, 10);
	return Number.isFinite(r) ? r : null;
}
function H_(e) {
	let t = document.createElement("span");
	t.className = "drop-zone-indicator custom-emoji-drop-zone", t.setAttribute("data-drop-pos", String(e));
	let n = document.createElement("span");
	return n.className = "drop-zone-bar", t.appendChild(n), t;
}
function U_(e) {
	e.dispatch(e.state.tr.setMeta(I_, {
		isDragging: !1,
		draggedNodePos: null
	}));
}
var W_ = Y.create({
	name: "customEmojiDragDrop",
	addProseMirrorPlugins() {
		let e = new z("custom-emoji-drag-drop"), t = new z("custom-emoji-drop-zone-indicator");
		return [new R({
			key: e,
			state: {
				init: () => ({
					isDragging: !1,
					draggedNodePos: null
				}),
				apply: (e, t) => {
					let n = e.getMeta(I_);
					return n ? {
						...t,
						...n
					} : t;
				}
			},
			props: {
				handleDrop: (e, t) => {
					if (e.editable === !1) return t.preventDefault(), !0;
					let n = R_(t);
					if (!n) return !1;
					t.preventDefault();
					let r = V_(t.clientX, t.clientY), i = e.posAtCoords({
						left: t.clientX,
						top: t.clientY
					}), a = r ?? (i ? Xh(e.state.doc, i.pos, n.pos) : null);
					return U_(e), typeof a == "number" && Zh(e, n, a), !0;
				},
				handleDOMEvents: {
					dragstart: (e, t) => {
						if (e.editable === !1) return t.preventDefault(), !0;
						let n = t, r = B_(e, n);
						return r && (n.dataTransfer?.setData(L_, JSON.stringify({
							type: "customEmoji",
							attrs: r.attrs,
							pos: r.pos
						})), n.dataTransfer && (n.dataTransfer.effectAllowed = "move"), e.dispatch(e.state.tr.setMeta(I_, {
							isDragging: !0,
							draggedNodePos: r.pos
						}))), !1;
					},
					dragover: (e, t) => {
						if (e.editable === !1) return t.preventDefault(), !0;
						let n = t;
						return n.dataTransfer?.types?.includes(L_) && (t.preventDefault(), n.dataTransfer.dropEffect = "move", dt(n.clientX, n.clientY)), !1;
					},
					dragend: (e) => (e.editable === !1 || U_(e), !1)
				}
			},
			view: (t) => {
				let n = null, r = () => {
					n &&= (cancelAnimationFrame(n), null);
				}, i = (e, i) => {
					r();
					let a = t.dom, o = a.getBoundingClientRect(), s = e === "up" ? i - o.top : o.bottom - i, c = 1 + 9 * (1 - Math.max(0, Math.min(1, s / 100))), l = () => {
						let t = a.scrollTop, r = a.scrollHeight - a.clientHeight;
						e === "up" && t > 0 ? (a.scrollTop = Math.max(0, t - c), a.scrollTop > 0 && (n = requestAnimationFrame(l))) : e === "down" && t < r && (a.scrollTop = Math.min(r, t + c), a.scrollTop < r && (n = requestAnimationFrame(l)));
					};
					n = requestAnimationFrame(l);
				}, a = (e) => {
					if (t.editable === !1) {
						r();
						return;
					}
					r();
					let { nodeData: n, dropPosition: i, dropX: a, dropY: o } = e.detail;
					if (t.dispatch(t.state.tr.setMeta(I_, {
						isDragging: !1,
						draggedNodePos: null
					})), n?.type !== "customEmoji" || typeof n.pos != "number") return;
					let s = typeof a == "number" && typeof o == "number" ? t.posAtCoords({
						left: a,
						top: o
					}) : null, c = typeof i == "number" ? i : s ? Xh(t.state.doc, s.pos, n.pos) : null;
					typeof c == "number" && Zh(t, n, c);
				}, o = (e) => {
					if (t.editable === !1) return;
					let { nodePos: n } = e.detail;
					t.dispatch(t.state.tr.setMeta(I_, {
						isDragging: !0,
						draggedNodePos: typeof n == "number" ? n : null
					}));
				}, s = (n) => {
					if (t.editable === !1) {
						r();
						return;
					}
					let { touchY: a } = n.detail;
					if (typeof a != "number" || !e.getState(t.state)?.isDragging) return;
					let o = t.dom.getBoundingClientRect();
					a < o.top + 100 ? i("up", a) : a > o.bottom - 100 ? i("down", a) : r();
				}, c = (e) => {
					if (t.editable === !1) return;
					let { nodePos: n } = e.detail;
					t.dispatch(t.state.tr.setMeta(I_, {
						isDragging: !0,
						draggedNodePos: typeof n == "number" ? n : null
					}));
				}, l = () => {
					t.editable !== !1 && U_(t);
				};
				return window.addEventListener("touch-custom-emoji-drop", a), window.addEventListener("touch-custom-emoji-drag-start", o), window.addEventListener("touch-custom-emoji-drag-move", s), window.addEventListener("custom-emoji-native-drag-start", c), window.addEventListener("custom-emoji-native-drag-end", l), { destroy() {
					r(), window.removeEventListener("touch-custom-emoji-drop", a), window.removeEventListener("touch-custom-emoji-drag-start", o), window.removeEventListener("touch-custom-emoji-drag-move", s), window.removeEventListener("custom-emoji-native-drag-start", c), window.removeEventListener("custom-emoji-native-drag-end", l);
				} };
			}
		}), new R({
			key: t,
			state: {
				init: () => U.empty,
				apply(t, n, r, i) {
					let a = e.getState(i);
					if (!a?.isDragging) return U.empty;
					let o = Jh(i.doc, a.draggedNodePos).map((e) => $c.widget(e, () => H_(e), { side: -1 }));
					return U.create(i.doc, o);
				}
			},
			props: { decorations(e) {
				return this.getState(e);
			} }
		})];
	}
}), G_ = o("<img class=\"custom-emoji-suggestion-image svelte-7ukt5v\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/> <span class=\"custom-emoji-suggestion-shortcode svelte-7ukt5v\"> </span>", 1), K_ = {
	hash: "svelte-7ukt5v",
	code: ".custom-emoji-suggestion-command {--suggestion-command-item-columns: 34px minmax(0, 1fr);}.custom-emoji-suggestion-image.svelte-7ukt5v {width:32px;height:32px;object-fit:contain;user-select:none;-webkit-user-drag:none;}.custom-emoji-suggestion-shortcode.svelte-7ukt5v {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.95rem;font-weight:600;}"
};
function q_(e, t) {
	fe(t, !0), te(e, K_);
	let r = w(null);
	function a() {
		x(r)?.moveDown?.();
	}
	function o() {
		x(r)?.moveUp?.();
	}
	function s() {
		return x(r)?.confirmSelection?.() ?? !1;
	}
	function c() {
		x(r)?.resetIndex?.();
	}
	var l = {
		moveDown: a,
		moveUp: o,
		confirmSelection: s,
		resetIndex: c
	};
	return S(i_(e, {
		get items() {
			return t.items;
		},
		getKey: (e) => e.identityKey,
		getValue: (e) => e.identityKey,
		get onSelect() {
			return t.onSelect;
		},
		rootClass: "custom-emoji-suggestion-command",
		itemClass: "custom-emoji-suggestion-item",
		children: (e, t = E) => {
			var r = G_(), i = D(r), a = b(i, 2), o = ue(a);
			v(() => {
				k(i, "src", t().src), k(i, "alt", `:${t().shortcode}:`), n(o, `:${t().shortcode ?? ""}:`);
			}), p(e, r);
		},
		$$slots: { default: !0 }
	}), (e) => O(r, e, !0), () => x(r)), i(l);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiSuggestion.ts
var J_ = new z("customEmojiSuggestion"), Y_ = /:([\p{L}\p{N}_+-]{1,64})$/u, X_ = /^[a-z][a-z0-9+.-]*:\/\/\S*$/i;
function Z_(e) {
	let t = Math.max(e.lastIndexOf(" "), e.lastIndexOf("\n"), e.lastIndexOf("	"), e.lastIndexOf("　")), n = e.slice(t + 1);
	return X_.test(n);
}
function Q_(e) {
	let t = e.$position.nodeBefore?.isText ? e.$position.nodeBefore.text ?? "" : "";
	if (!t) return null;
	let n = Y_.exec(t);
	if (!n || n.index === void 0) return null;
	let r = nt(n[1]);
	if (!r) return null;
	let i = t.slice(0, n.index).at(-1);
	if (i === ":" || i === "/" || Z_(t.slice(0, n.index + n[0].length))) return null;
	let a = e.$position.pos - t.length + n.index, o = a + n[0].length;
	return a < e.$position.pos && o >= e.$position.pos ? {
		range: {
			from: a,
			to: o
		},
		query: r,
		text: n[0]
	} : null;
}
var $_ = Y.create({
	name: "customEmojiSuggestion",
	addOptions() {
		return {
			getItems: () => Ze.items,
			limit: 30,
			onSelectEmoji: void 0
		};
	},
	addProseMirrorPlugins() {
		let e = this.editor;
		return [t_({
			editor: e,
			pluginKey: J_,
			char: ":",
			allowSpaces: !1,
			allowedPrefixes: null,
			findSuggestionMatch: Q_,
			items: ({ query: e }) => tt(this.options.getItems(), e, this.options.limit),
			render: b_({
				component: q_,
				className: "custom-emoji-suggestion-popover",
				zIndex: "99",
				getProps: ({ items: e, command: t }) => ({
					items: e,
					onSelect: t
				})
			}),
			command: ({ editor: e, range: t, props: n }) => {
				let r = e.state.doc;
				e.chain().focus().deleteRange(t).insertContent({
					type: "customEmoji",
					attrs: {
						identityKey: n.identityKey,
						shortcode: nt(n.shortcode),
						src: n.src,
						setAddress: n.setAddress
					}
				}).run() && !r.eq(e.state.doc) && this.options.onSelectEmoji?.(n);
			}
		})];
	}
}), ev = new z("toolbarCaret");
function tv(e) {
	e.view.dispatch(e.state.tr.setMeta(ev, !0).setMeta("addToHistory", !1));
}
function nv(e) {
	ev.getState(e.state) && e.dispatch(e.state.tr.setMeta(ev, !1).setMeta("addToHistory", !1));
}
var rv = Y.create({
	name: "toolbarCaret",
	addProseMirrorPlugins() {
		return [new R({
			key: ev,
			state: {
				init: () => !1,
				apply(e, t) {
					let n = e.getMeta(ev);
					return typeof n == "boolean" ? n : t;
				}
			},
			props: {
				decorations(e) {
					if (!this.getState(e) || !e.selection.empty) return U.empty;
					let t = $c.widget(e.selection.from, () => {
						let e = document.createElement("span");
						return e.className = "toolbar-caret", e.setAttribute("aria-hidden", "true"), e.contentEditable = "false", e;
					}, {
						key: "toolbar-caret",
						side: -1
					});
					return U.create(e.doc, [t]);
				},
				handleDOMEvents: { focus(e) {
					return nv(e), !1;
				} }
			}
		})];
	}
}), iv = /* @__PURE__ */ new WeakSet(), av = /* @__PURE__ */ new WeakSet();
function ov(e) {
	let t = e;
	return iv.add(t), t;
}
function sv(e) {
	return Array.isArray(e) && iv.has(e);
}
function cv(e) {
	return e.flatMap((e) => e == null ? [] : Array.isArray(e) && av.has(e) && !sv(e) ? cv(e) : [e]);
}
function lv(e, t) {
	if (e === "slot") return 0;
	if (e instanceof Function) {
		let n = e(t);
		return Array.isArray(n) && !sv(n) && !av.has(n) ? ov(n) : n;
	}
	let { children: n, ...r } = t ?? {};
	if (e === "svg") throw Error("SVG elements are not supported in the JSX syntax, use the array syntax instead");
	if (Array.isArray(n)) {
		if (sv(n)) return ov([
			e,
			r,
			n
		]);
		if (n.length === 0) return ov([e, r]);
		let t = cv(n);
		return t.length === 0 ? ov([e, r]) : ov([
			e,
			r,
			...t
		]);
	}
	return ov(n == null ? [e, r] : [
		e,
		r,
		n
	]);
}
var uv = (e, t) => lv(e, t), dv = (e, t) => {
	let { state: n } = e, { selection: r } = n;
	if (!r.empty) return !1;
	let { $from: i } = r;
	if (i.parentOffset !== 0) return !1;
	let a = i.depth - 1;
	if (a < 0) return !1;
	let o = i.node(a), s = i.index(a);
	if (s === 0) return !1;
	if (o.type === t) return e.commands.lift(t.name);
	let c = o.child(s - 1);
	if (c.type !== t || !c.lastChild?.isTextblock) return !1;
	let l = i.before() - 1 - 1;
	return e.commands.command(({ tr: e, dispatch: t }) => {
		if (!t) return !0;
		let n = i.parent.content, r = new N(n, 0, 0);
		return e.replace(l, i.after(), r), e.setSelection(I.create(e.doc, l + n.size)), e.scrollIntoView(), t(e), !0;
	});
}, fv = /^\s*>\s$/, pv = eh.create({
	name: "blockquote",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	content: "block+",
	group: "block",
	defining: !0,
	parseHTML() {
		return [{ tag: "blockquote" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return /* @__PURE__ */ uv("blockquote", {
			...J(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ uv("slot", {})
		});
	},
	parseMarkdown: (e, t) => {
		let n = t.parseBlockChildren ?? t.parseChildren;
		return t.createNode("blockquote", void 0, n(e.tokens || []));
	},
	renderMarkdown: (e, t) => {
		if (!e.content) return "";
		let n = [];
		return e.content.forEach((e, r) => {
			let i = (t.renderChild?.call(t, e, r) ?? t.renderChildren([e])).split("\n").map((e) => e.trim() === "" ? ">" : `> ${e}`);
			n.push(i.join("\n"));
		}), n.join("\n>\n");
	},
	addCommands() {
		return {
			setBlockquote: () => ({ commands: e }) => e.wrapIn(this.name),
			toggleBlockquote: () => ({ commands: e }) => e.toggleWrap(this.name),
			unsetBlockquote: () => ({ commands: e }) => e.lift(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Shift-b": () => this.editor.commands.toggleBlockquote(),
			Backspace: () => dv(this.editor, this.type)
		};
	},
	addInputRules() {
		return [Zm({
			find: fv,
			type: this.type
		})];
	}
}), mv = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, hv = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, gv = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, _v = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, vv = wm.create({
	name: "bold",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "strong" },
			{
				tag: "b",
				getAttrs: (e) => e.style.fontWeight !== "normal" && null
			},
			{
				style: "font-weight=400",
				clearMark: (e) => e.type.name === this.name
			},
			{
				style: "font-weight",
				getAttrs: (e) => /^(bold(er)?|[5-9]\d{2,})$/.test(e) && null
			}
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return /* @__PURE__ */ uv("strong", {
			...J(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ uv("slot", {})
		});
	},
	markdownTokenName: "strong",
	parseMarkdown: (e, t) => t.applyMark("bold", t.parseInline(e.tokens || [])),
	markdownOptions: { htmlReopen: {
		open: "<strong>",
		close: "</strong>"
	} },
	renderMarkdown: (e, t) => `**${t.renderChildren(e)}**`,
	addCommands() {
		return {
			setBold: () => ({ commands: e }) => e.setMark(this.name),
			toggleBold: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetBold: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-b": () => this.editor.commands.toggleBold(),
			"Mod-B": () => this.editor.commands.toggleBold()
		};
	},
	addInputRules() {
		return [Jm({
			find: mv,
			type: this.type
		}), Jm({
			find: gv,
			type: this.type
		})];
	},
	addPasteRules() {
		return [nh({
			find: hv,
			type: this.type
		}), nh({
			find: _v,
			type: this.type
		})];
	}
}), yv = (e) => {
	let t = /`([^`]+)`(?!`)$/.exec(e);
	return !t || t.index > 0 && e[t.index - 1] === "`" ? null : {
		index: t.index,
		text: t[0],
		replaceWith: t[1]
	};
}, bv = (e) => {
	let t = /`([^`]+)`(?!`)/g, n = [], r;
	for (; (r = t.exec(e)) !== null;) r.index > 0 && e[r.index - 1] === "`" || n.push({
		index: r.index,
		text: r[0],
		replaceWith: r[1]
	});
	return n;
};
function xv(e) {
	let t = new Set((e.match(/`+/g) || []).map((e) => e.length)), n = 1;
	for (; t.has(n);) n += 1;
	return n;
}
var Sv = wm.create({
	name: "code",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	excludes: "_",
	code: !0,
	exitable: !0,
	parseHTML() {
		return [{ tag: "code" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"code",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "codespan",
	parseMarkdown: (e, t) => t.applyMark("code", [{
		type: "text",
		text: e.text || ""
	}]),
	renderMarkdown: (e, t, n) => {
		var r;
		if (!e.content) return "";
		let i = typeof (n == null || (r = n.meta) == null ? void 0 : r.markText) == "string" ? n.meta.markText : "", a = "`".repeat(xv(i)), o = i.startsWith("`") || i.endsWith("`") ? " " : "";
		return `${a}${o}${t.renderChildren(e.content)}${o}${a}`;
	},
	addCommands() {
		return {
			setCode: () => ({ commands: e }) => e.setMark(this.name),
			toggleCode: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetCode: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return { "Mod-e": () => this.editor.commands.toggleCode() };
	},
	addInputRules() {
		return [Jm({
			find: yv,
			type: this.type
		})];
	},
	addPasteRules() {
		return [nh({
			find: bv,
			type: this.type
		})];
	}
}), Cv = 4, wv = /^```([a-z]+)?[\s\n]$/, Tv = /^~~~([a-z]+)?[\s\n]$/, Ev = eh.create({
	name: "codeBlock",
	addOptions() {
		return {
			languageClassPrefix: "language-",
			exitOnTripleEnter: !0,
			exitOnArrowDown: !0,
			exitOnArrowUp: !0,
			defaultLanguage: null,
			enableTabIndentation: !1,
			tabSize: Cv,
			HTMLAttributes: {}
		};
	},
	content: "text*",
	marks: "",
	group: "block",
	code: !0,
	defining: !0,
	addAttributes() {
		return { language: {
			default: this.options.defaultLanguage,
			parseHTML: (e) => {
				let { languageClassPrefix: t } = this.options;
				return t && [...e.firstElementChild?.classList || []].filter((e) => e.startsWith(t)).map((e) => e.replace(t, ""))[0] || null;
			},
			rendered: !1
		} };
	},
	parseHTML() {
		return [{
			tag: "pre",
			preserveWhitespace: "full"
		}];
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			"pre",
			J(this.options.HTMLAttributes, t),
			[
				"code",
				{ class: e.attrs.language ? this.options.languageClassPrefix + e.attrs.language : null },
				0
			]
		];
	},
	markdownTokenName: "code",
	parseMarkdown: (e, t) => e.raw?.startsWith("```") === !1 && e.raw?.startsWith("~~~") === !1 && e.codeBlockStyle !== "indented" ? [] : t.createNode("codeBlock", { language: e.lang || null }, e.text ? [t.createTextNode(e.text)] : []),
	renderMarkdown: (e, t) => {
		let n = "", r = e.attrs?.language || "";
		return n = e.content ? [
			`\`\`\`${r}`,
			t.renderChildren(e.content),
			"```"
		].join("\n") : `\`\`\`${r}\n\n\`\`\``, n;
	},
	addCommands() {
		return {
			setCodeBlock: (e) => ({ commands: t }) => t.setNode(this.name, e),
			toggleCodeBlock: (e) => ({ commands: t }) => t.toggleNode(this.name, "paragraph", e)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
			Backspace: () => {
				let { empty: e, $anchor: t } = this.editor.state.selection, n = t.pos === 1;
				return !e || t.parent.type.name !== this.name ? !1 : n || !t.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
			},
			Tab: ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? Cv, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				if (i.parent.type !== this.type) return !1;
				let o = " ".repeat(t);
				return a ? e.commands.insertContent(o) : e.commands.command(({ tr: e }) => {
					let { from: t, to: i } = r, a = n.doc.textBetween(t, i, "\n", "\n").split("\n").map((e) => o + e).join("\n");
					return e.replaceWith(t, i, n.schema.text(a)), !0;
				});
			},
			"Shift-Tab": ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? Cv, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				return i.parent.type === this.type ? a ? e.commands.command(({ tr: e }) => {
					let { pos: r } = i, a = i.start(), o = i.end(), s = n.doc.textBetween(a, o, "\n", "\n").split("\n"), c = 0, l = 0, u = r - a;
					for (let e = 0; e < s.length; e += 1) {
						if (l + s[e].length >= u) {
							c = e;
							break;
						}
						l += s[e].length + 1;
					}
					let d = s[c].match(/^ */)?.[0] || "", f = Math.min(d.length, t);
					if (f === 0) return !0;
					let p = a;
					for (let e = 0; e < c; e += 1) p += s[e].length + 1;
					return e.delete(p, p + f), r - p <= f && e.setSelection(I.create(e.doc, p)), !0;
				}) : e.commands.command(({ tr: e }) => {
					let { from: i, to: a } = r, o = n.doc.textBetween(i, a, "\n", "\n").split("\n").map((e) => {
						let n = e.match(/^ */)?.[0] || "", r = Math.min(n.length, t);
						return e.slice(r);
					}).join("\n");
					return e.replaceWith(i, a, n.schema.text(o)), !0;
				}) : !1;
			},
			Enter: ({ editor: e }) => {
				if (!this.options.exitOnTripleEnter) return !1;
				let { state: t } = e, { selection: n } = t, { $from: r, empty: i } = n;
				if (!i || r.parent.type !== this.type) return !1;
				let a = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith("\n\n");
				return !a || !o ? !1 : e.chain().command(({ tr: e }) => (e.delete(r.pos - 2, r.pos), !0)).exitCode().run();
			},
			ArrowUp: ({ editor: e }) => {
				if (!this.options.exitOnArrowUp) return !1;
				let { state: t } = e, { selection: n } = t, { $from: r, empty: i } = n;
				if (!i || r.parent.type !== this.type || r.parentOffset !== 0) return !1;
				let a = r.before();
				return a > 0 ? !1 : e.commands.insertDefaultBlock({ pos: a });
			},
			ArrowDown: ({ editor: e }) => {
				if (!this.options.exitOnArrowDown) return !1;
				let { state: t } = e, { selection: n, doc: r } = t, { $from: i, empty: a } = n;
				if (!a || i.parent.type !== this.type || i.parentOffset !== i.parent.nodeSize - 2) return !1;
				let o = i.after();
				return o === void 0 ? !1 : r.nodeAt(o) ? e.commands.command(({ tr: e }) => (e.setSelection(F.near(r.resolve(o))), !0)) : e.commands.exitCode();
			}
		};
	},
	addInputRules() {
		return [Xm({
			find: wv,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		}), Xm({
			find: Tv,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		})];
	},
	addProseMirrorPlugins() {
		return [new R({
			key: new z("codeBlockVSCodeHandler"),
			props: { handlePaste: (e, t) => {
				if (!t.clipboardData || this.editor.isActive(this.type.name)) return !1;
				let n = t.clipboardData.getData("text/plain"), r = t.clipboardData.getData("vscode-editor-data"), i = (r ? JSON.parse(r) : void 0)?.mode;
				if (!n || !i) return !1;
				let { tr: a, schema: o } = e.state, s = o.text(n.replace(/\r\n?/g, "\n"));
				return a.replaceSelectionWith(this.type.create({ language: i }, s)), a.selection.$from.parent.type !== this.type && a.setSelection(I.near(a.doc.resolve(Math.max(0, a.selection.from - 2)))), a.setMeta("paste", !0), e.dispatch(a), !0;
			} }
		})];
	}
}), Dv = eh.create({
	name: "doc",
	topNode: !0,
	content: "block+",
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n\n") : ""
}), Ov = eh.create({
	name: "hardBreak",
	markdownTokenName: "br",
	addOptions() {
		return {
			keepMarks: !0,
			HTMLAttributes: {}
		};
	},
	inline: !0,
	group: "inline",
	selectable: !1,
	linebreakReplacement: !0,
	parseHTML() {
		return [{ tag: "br" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["br", J(this.options.HTMLAttributes, e)];
	},
	renderText() {
		return "\n";
	},
	renderMarkdown: () => "  \n",
	parseMarkdown: () => ({ type: "hardBreak" }),
	addCommands() {
		return { setHardBreak: () => ({ commands: e, chain: t, state: n, editor: r }) => e.first([() => e.exitCode(), () => e.command(() => {
			let { selection: e, storedMarks: i } = n;
			if (e.$from.parent.type.spec.isolating) return !1;
			let { keepMarks: a } = this.options, { splittableMarks: o } = r.extensionManager, s = i || e.$to.parentOffset && e.$from.marks();
			return t().insertContent({ type: this.name }).command(({ tr: e, dispatch: t }) => {
				if (t && s && a) {
					let t = s.filter((e) => o.includes(e.type.name));
					e.ensureMarks(t);
				}
				return !0;
			}).scrollIntoView().run();
		})]) };
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Enter": () => this.editor.commands.setHardBreak(),
			"Shift-Enter": () => this.editor.commands.setHardBreak()
		};
	}
}), kv = eh.create({
	name: "heading",
	addOptions() {
		return {
			levels: [
				1,
				2,
				3,
				4,
				5,
				6
			],
			HTMLAttributes: {}
		};
	},
	content: "inline*",
	group: "block",
	defining: !0,
	addAttributes() {
		return { level: {
			default: 1,
			rendered: !1
		} };
	},
	parseHTML() {
		return this.options.levels.map((e) => ({
			tag: `h${e}`,
			attrs: { level: e }
		}));
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			`h${this.options.levels.includes(e.attrs.level) ? e.attrs.level : this.options.levels[0]}`,
			J(this.options.HTMLAttributes, t),
			0
		];
	},
	parseMarkdown: (e, t) => t.createNode("heading", { level: e.depth || 1 }, t.parseInline(e.tokens || [])),
	renderMarkdown: (e, t) => {
		let n = e.attrs?.level ? parseInt(e.attrs.level, 10) : 1, r = "#".repeat(n);
		return e.content ? `${r} ${t.renderChildren(e.content)}` : "";
	},
	addCommands() {
		return {
			setHeading: (e) => ({ commands: t }) => this.options.levels.includes(e.level) ? t.setNode(this.name, e) : !1,
			toggleHeading: (e) => ({ commands: t }) => this.options.levels.includes(e.level) ? t.toggleNode(this.name, "paragraph", e) : !1
		};
	},
	addKeyboardShortcuts() {
		return this.options.levels.reduce((e, t) => ({
			...e,
			[`Mod-Alt-${t}`]: () => this.editor.commands.toggleHeading({ level: t })
		}), {});
	},
	addInputRules() {
		return this.options.levels.map((e) => Xm({
			find: RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),
			type: this.type,
			getAttributes: { level: e }
		}));
	}
}), Av = eh.create({
	name: "horizontalRule",
	addOptions() {
		return {
			HTMLAttributes: {},
			nextNodeType: "paragraph"
		};
	},
	group: "block",
	parseHTML() {
		return [{ tag: "hr" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["hr", J(this.options.HTMLAttributes, e)];
	},
	markdownTokenName: "hr",
	parseMarkdown: (e, t) => t.createNode("horizontalRule"),
	renderMarkdown: () => "---",
	addCommands() {
		return { setHorizontalRule: () => ({ chain: e, state: t }) => {
			if (!im(t, t.schema.nodes[this.name])) return !1;
			let { selection: n } = t, { $to: r } = n, i = e();
			return Gf(n) ? i.insertContentAt(r.pos, { type: this.name }) : i.insertContent({ type: this.name }), i.command(({ state: e, tr: t, dispatch: n }) => {
				if (n) {
					let { $to: n } = t.selection, r = n.end();
					if (n.nodeAfter) n.nodeAfter.isTextblock ? t.setSelection(I.create(t.doc, n.pos + 1)) : n.nodeAfter.isBlock ? t.setSelection(L.create(t.doc, n.pos)) : t.setSelection(I.create(t.doc, n.pos));
					else {
						let i = (e.schema.nodes[this.options.nextNodeType] || n.parent.type.contentMatch.defaultType)?.create();
						i && (t.insert(r, i), t.setSelection(I.create(t.doc, r + 1)));
					}
					t.scrollIntoView();
				}
				return !0;
			}).run();
		} };
	},
	addInputRules() {
		return [Ym({
			find: /^(?:---|—-|___\s|\*\*\*\s)$/,
			type: this.type
		})];
	}
}), jv = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, Mv = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, Nv = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, Pv = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, Fv = wm.create({
	name: "italic",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "em" },
			{
				tag: "i",
				getAttrs: (e) => e.style.fontStyle !== "normal" && null
			},
			{
				style: "font-style=normal",
				clearMark: (e) => e.type.name === this.name
			},
			{ style: "font-style=italic" }
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"em",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	addCommands() {
		return {
			setItalic: () => ({ commands: e }) => e.setMark(this.name),
			toggleItalic: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetItalic: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	markdownTokenName: "em",
	parseMarkdown: (e, t) => t.applyMark("italic", t.parseInline(e.tokens || [])),
	markdownOptions: { htmlReopen: {
		open: "<em>",
		close: "</em>"
	} },
	renderMarkdown: (e, t) => `*${t.renderChildren(e)}*`,
	addKeyboardShortcuts() {
		return {
			"Mod-i": () => this.editor.commands.toggleItalic(),
			"Mod-I": () => this.editor.commands.toggleItalic()
		};
	},
	addInputRules() {
		return [Jm({
			find: jv,
			type: this.type
		}), Jm({
			find: Nv,
			type: this.type
		})];
	},
	addPasteRules() {
		return [nh({
			find: Mv,
			type: this.type
		}), nh({
			find: Pv,
			type: this.type
		})];
	}
}), Iv = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos6kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12b0cam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", Lv = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", Rv = "numeric", zv = "ascii", Bv = "alpha", Vv = "asciinumeric", Hv = "alphanumeric", Uv = "domain", Wv = "emoji", Gv = "scheme", Kv = "slashscheme", qv = "whitespace";
function Jv(e, t) {
	return e in t || (t[e] = []), t[e];
}
function Yv(e, t, n) {
	t[Rv] && (t[Vv] = !0, t[Hv] = !0), t[zv] && (t[Vv] = !0, t[Bv] = !0), t[Vv] && (t[Hv] = !0), t[Bv] && (t[Hv] = !0), t[Hv] && (t[Uv] = !0), t[Wv] && (t[Uv] = !0);
	for (let r in t) {
		let t = Jv(r, n);
		t.indexOf(e) < 0 && t.push(e);
	}
}
function Xv(e, t) {
	let n = {};
	for (let r in t) t[r].indexOf(e) >= 0 && (n[r] = !0);
	return n;
}
function Zv(e = null) {
	this.j = {}, this.jr = [], this.jd = null, this.t = e;
}
Zv.groups = {}, Zv.prototype = {
	accepts() {
		return !!this.t;
	},
	go(e) {
		let t = this, n = t.j[e];
		if (n) return n;
		for (let n = 0; n < t.jr.length; n++) {
			let r = t.jr[n][0], i = t.jr[n][1];
			if (i && r.test(e)) return i;
		}
		return t.jd;
	},
	has(e, t = !1) {
		return t ? e in this.j : !!this.go(e);
	},
	ta(e, t, n, r) {
		for (let i = 0; i < e.length; i++) this.tt(e[i], t, n, r);
	},
	tr(e, t, n, r) {
		r ||= Zv.groups;
		let i;
		return t && t.j ? i = t : (i = new Zv(t), n && r && Yv(t, n, r)), this.jr.push([e, i]), i;
	},
	ts(e, t, n, r) {
		let i = this, a = e.length;
		if (!a) return i;
		for (let t = 0; t < a - 1; t++) i = i.tt(e[t]);
		return i.tt(e[a - 1], t, n, r);
	},
	tt(e, t, n, r) {
		r ||= Zv.groups;
		let i = this;
		if (t && t.j) return i.j[e] = t, t;
		let a = t, o, s = i.go(e);
		return s ? (o = new Zv(), Object.assign(o.j, s.j), o.jr.push.apply(o.jr, s.jr), o.jd = s.jd, o.t = s.t) : o = new Zv(), a && (r && (o.t && typeof o.t == "string" ? Yv(a, Object.assign(Xv(o.t, r), n), r) : n && Yv(a, n, r)), o.t = a), i.j[e] = o, o;
	}
};
var X = (e, t, n, r, i) => e.ta(t, n, r, i), Z = (e, t, n, r, i) => e.tr(t, n, r, i), Qv = (e, t, n, r, i) => e.ts(t, n, r, i), Q = (e, t, n, r, i) => e.tt(t, n, r, i), $v = "WORD", ey = "UWORD", ty = "ASCIINUMERICAL", ny = "ALPHANUMERICAL", ry = "LOCALHOST", iy = "TLD", ay = "UTLD", oy = "SCHEME", sy = "SLASH_SCHEME", cy = "NUM", ly = "WS", uy = "NL", dy = "OPENBRACE", fy = "CLOSEBRACE", py = "OPENBRACKET", my = "CLOSEBRACKET", hy = "OPENPAREN", gy = "CLOSEPAREN", _y = "OPENANGLEBRACKET", vy = "CLOSEANGLEBRACKET", yy = "FULLWIDTHLEFTPAREN", by = "FULLWIDTHRIGHTPAREN", xy = "LEFTCORNERBRACKET", Sy = "RIGHTCORNERBRACKET", Cy = "LEFTWHITECORNERBRACKET", wy = "RIGHTWHITECORNERBRACKET", Ty = "FULLWIDTHLESSTHAN", Ey = "FULLWIDTHGREATERTHAN", Dy = "AMPERSAND", Oy = "APOSTROPHE", ky = "ASTERISK", Ay = "AT", jy = "BACKSLASH", My = "BACKTICK", Ny = "CARET", Py = "COLON", Fy = "COMMA", Iy = "DOLLAR", Ly = "DOT", Ry = "EQUALS", zy = "EXCLAMATION", By = "HYPHEN", Vy = "PERCENT", Hy = "PIPE", Uy = "PLUS", Wy = "POUND", Gy = "QUERY", Ky = "QUOTE", qy = "FULLWIDTHMIDDLEDOT", Jy = "SEMI", Yy = "SLASH", Xy = "TILDE", Zy = "UNDERSCORE", Qy = "EMOJI", $y = "SYM", eb = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ALPHANUMERICAL: ny,
	AMPERSAND: Dy,
	APOSTROPHE: Oy,
	ASCIINUMERICAL: ty,
	ASTERISK: ky,
	AT: Ay,
	BACKSLASH: jy,
	BACKTICK: My,
	CARET: Ny,
	CLOSEANGLEBRACKET: vy,
	CLOSEBRACE: fy,
	CLOSEBRACKET: my,
	CLOSEPAREN: gy,
	COLON: Py,
	COMMA: Fy,
	DOLLAR: Iy,
	DOT: Ly,
	EMOJI: Qy,
	EQUALS: Ry,
	EXCLAMATION: zy,
	FULLWIDTHGREATERTHAN: Ey,
	FULLWIDTHLEFTPAREN: yy,
	FULLWIDTHLESSTHAN: Ty,
	FULLWIDTHMIDDLEDOT: qy,
	FULLWIDTHRIGHTPAREN: by,
	HYPHEN: By,
	LEFTCORNERBRACKET: xy,
	LEFTWHITECORNERBRACKET: Cy,
	LOCALHOST: ry,
	NL: uy,
	NUM: cy,
	OPENANGLEBRACKET: _y,
	OPENBRACE: dy,
	OPENBRACKET: py,
	OPENPAREN: hy,
	PERCENT: Vy,
	PIPE: Hy,
	PLUS: Uy,
	POUND: Wy,
	QUERY: Gy,
	QUOTE: Ky,
	RIGHTCORNERBRACKET: Sy,
	RIGHTWHITECORNERBRACKET: wy,
	SCHEME: oy,
	SEMI: Jy,
	SLASH: Yy,
	SLASH_SCHEME: sy,
	SYM: $y,
	TILDE: Xy,
	TLD: iy,
	UNDERSCORE: Zy,
	UTLD: ay,
	UWORD: ey,
	WORD: $v,
	WS: ly
}), tb = /[a-z]/, nb = /[a-z]/i, rb = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]|\u{FE0F}/u;
try {
	nb = /* @__PURE__ */ RegExp("\\p{L}", "u"), rb = /* @__PURE__ */ RegExp("\\p{Emoji}", "u");
} catch {}
var ib = /\d/, ab = /\s/, ob = "\r", sb = "\n", cb = "️", lb = "‍", ub = "￼", db = null, fb = null;
function pb(e = []) {
	let t = {};
	Zv.groups = t;
	let n = new Zv();
	db ??= _b(Iv), fb ??= _b(Lv), Q(n, "'", Oy), Q(n, "{", dy), Q(n, "}", fy), Q(n, "[", py), Q(n, "]", my), Q(n, "(", hy), Q(n, ")", gy), Q(n, "<", _y), Q(n, ">", vy), Q(n, "（", yy), Q(n, "）", by), Q(n, "「", xy), Q(n, "」", Sy), Q(n, "『", Cy), Q(n, "』", wy), Q(n, "＜", Ty), Q(n, "＞", Ey), Q(n, "&", Dy), Q(n, "*", ky), Q(n, "@", Ay), Q(n, "`", My), Q(n, "^", Ny), Q(n, ":", Py), Q(n, ",", Fy), Q(n, "$", Iy), Q(n, ".", Ly), Q(n, "=", Ry), Q(n, "!", zy), Q(n, "-", By), Q(n, "%", Vy), Q(n, "|", Hy), Q(n, "+", Uy), Q(n, "#", Wy), Q(n, "?", Gy), Q(n, "\"", Ky), Q(n, "/", Yy), Q(n, ";", Jy), Q(n, "~", Xy), Q(n, "_", Zy), Q(n, "\\", jy), Q(n, "・", qy);
	let r = Z(n, ib, cy, { [Rv]: !0 });
	Z(r, ib, r);
	let i = Z(r, tb, ty, { [Vv]: !0 }), a = Z(r, nb, ny, { [Hv]: !0 }), o = Z(n, tb, $v, { [zv]: !0 });
	Z(o, ib, i), Z(o, tb, o), Z(i, ib, i), Z(i, tb, i);
	let s = Z(n, nb, ey, { [Bv]: !0 });
	Z(s, tb), Z(s, ib, a), Z(s, nb, s), Z(a, ib, a), Z(a, tb), Z(a, nb, a);
	let c = Q(n, sb, uy, { [qv]: !0 }), l = Q(n, ob, ly, { [qv]: !0 }), u = Z(n, ab, ly, { [qv]: !0 });
	Q(n, ub, u), Q(l, sb, c), Q(l, ub, u), Z(l, ab, u), Q(u, ob), Q(u, sb), Z(u, ab, u), Q(u, ub, u);
	let d = Z(n, rb, Qy, { [Wv]: !0 });
	Q(d, "#"), Z(d, rb, d), Q(d, cb, d);
	let f = Q(d, lb);
	Q(f, "#"), Z(f, rb, d);
	let p = [[tb, o], [ib, i]], m = [
		[tb, null],
		[nb, s],
		[ib, a]
	];
	for (let e = 0; e < db.length; e++) gb(n, db[e], iy, $v, p);
	for (let e = 0; e < fb.length; e++) gb(n, fb[e], ay, ey, m);
	Yv(iy, {
		tld: !0,
		ascii: !0
	}, t), Yv(ay, {
		utld: !0,
		alpha: !0
	}, t), gb(n, "file", oy, $v, p), gb(n, "mailto", oy, $v, p), gb(n, "http", sy, $v, p), gb(n, "https", sy, $v, p), gb(n, "ftp", sy, $v, p), gb(n, "ftps", sy, $v, p), Yv(oy, {
		scheme: !0,
		ascii: !0
	}, t), Yv(sy, {
		slashscheme: !0,
		ascii: !0
	}, t), e = e.sort((e, t) => e[0] > t[0] ? 1 : -1);
	for (let t = 0; t < e.length; t++) {
		let r = e[t][0], i = e[t][1] ? { [Gv]: !0 } : { [Kv]: !0 };
		r.indexOf("-") >= 0 ? i[Uv] = !0 : tb.test(r) ? ib.test(r) ? i[Vv] = !0 : i[zv] = !0 : i[Rv] = !0, Qv(n, r, r, i);
	}
	return Qv(n, "localhost", ry, { ascii: !0 }), n.jd = new Zv($y), {
		start: n,
		tokens: Object.assign({ groups: t }, eb)
	};
}
function mb(e, t) {
	let n = hb(t.replace(/[A-Z]/g, (e) => e.toLowerCase())), r = n.length, i = [], a = 0, o = 0;
	for (; o < r;) {
		let s = e, c = null, l = 0, u = null, d = -1, f = -1;
		for (; o < r && (c = s.go(n[o]));) s = c, s.accepts() ? (d = 0, f = 0, u = s) : d >= 0 && (d += n[o].length, f++), l += n[o].length, a += n[o].length, o++;
		a -= d, o -= f, l -= d, i.push({
			t: u.t,
			v: t.slice(a - l, a),
			s: a - l,
			e: a
		});
	}
	return i;
}
function hb(e) {
	let t = [], n = e.length, r = 0;
	for (; r < n;) {
		let i = e.charCodeAt(r), a, o = i < 55296 || i > 56319 || r + 1 === n || (a = e.charCodeAt(r + 1)) < 56320 || a > 57343 ? e[r] : e.slice(r, r + 2);
		t.push(o), r += o.length;
	}
	return t;
}
function gb(e, t, n, r, i) {
	let a, o = t.length;
	for (let n = 0; n < o - 1; n++) {
		let o = t[n];
		e.j[o] ? a = e.j[o] : (a = new Zv(r), a.jr = i.slice(), e.j[o] = a), e = a;
	}
	return a = new Zv(n), a.jr = i.slice(), e.j[t[o - 1]] = a, a;
}
function _b(e) {
	let t = [], n = [], r = 0;
	for (; r < e.length;) {
		let i = 0;
		for (; "0123456789".indexOf(e[r + i]) >= 0;) i++;
		if (i > 0) {
			t.push(n.join(""));
			for (let t = parseInt(e.substring(r, r + i), 10); t > 0; t--) n.pop();
			r += i;
		} else n.push(e[r]), r++;
	}
	return t;
}
var vb = {
	defaultProtocol: "http",
	events: null,
	format: bb,
	formatHref: bb,
	nl2br: !1,
	tagName: "a",
	target: null,
	rel: null,
	validate: !0,
	truncate: Infinity,
	className: null,
	attributes: null,
	ignoreTags: [],
	ignoreClasses: [],
	render: null
};
function yb(e, t = null) {
	let n = Object.assign({}, vb);
	e && (n = Object.assign(n, e instanceof yb ? e.o : e));
	let r = n.ignoreTags, i = [];
	for (let e = 0; e < r.length; e++) i.push(r[e].toUpperCase());
	this.o = n, t && (this.defaultRender = t), this.ignoreTags = i, this.ignoreClasses = n.ignoreClasses.slice();
}
yb.prototype = {
	o: vb,
	ignoreTags: [],
	ignoreClasses: [],
	isIgnoredClass(e) {
		if (typeof e != "string" || this.ignoreClasses.length === 0) return !1;
		let t = e.split(/\s+/);
		for (let e = 0; e < t.length; e++) if (this.ignoreClasses.indexOf(t[e]) >= 0) return !0;
		return !1;
	},
	defaultRender(e) {
		return e;
	},
	check(e) {
		return this.get("validate", e.toString(), e);
	},
	get(e, t, n) {
		let r = t != null, i = this.o[e];
		return i && (typeof i == "object" ? (i = n.t in i ? i[n.t] : vb[e], typeof i == "function" && r && (i = i(t, n))) : typeof i == "function" && r && (i = i(t, n.t, n)), i);
	},
	getObj(e, t, n) {
		let r = this.o[e];
		return typeof r == "function" && t != null && (r = r(t, n.t, n)), r;
	},
	render(e) {
		let t = e.render(this);
		return (this.get("render", null, e) || this.defaultRender)(t, e.t, e);
	}
};
function bb(e) {
	return e;
}
function xb(e, t) {
	this.t = "token", this.v = e, this.tk = t;
}
xb.prototype = {
	isLink: !1,
	toString() {
		return this.v;
	},
	toHref(e) {
		return this.toString();
	},
	toFormattedString(e) {
		let t = this.toString(), n = e.get("truncate", t, this), r = e.get("format", t, this);
		return n && r.length > n ? r.substring(0, n) + "…" : r;
	},
	toFormattedHref(e) {
		return e.get("formatHref", this.toHref(e.get("defaultProtocol")), this);
	},
	startIndex() {
		return this.tk[0].s;
	},
	endIndex() {
		return this.tk[this.tk.length - 1].e;
	},
	toObject(e = vb.defaultProtocol) {
		return {
			type: this.t,
			value: this.toString(),
			isLink: this.isLink,
			href: this.toHref(e),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},
	toFormattedObject(e) {
		return {
			type: this.t,
			value: this.toFormattedString(e),
			isLink: this.isLink,
			href: this.toFormattedHref(e),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},
	validate(e) {
		return e.get("validate", this.toString(), this);
	},
	render(e) {
		let t = this, n = this.toHref(e.get("defaultProtocol")), r = e.get("formatHref", n, this), i = e.get("tagName", n, t), a = this.toFormattedString(e), o = {}, s = e.get("className", n, t), c = e.get("target", n, t), l = e.get("rel", n, t), u = e.getObj("attributes", n, t), d = e.getObj("events", n, t);
		return o.href = r, s && (o.class = s), c && (o.target = c), l && (o.rel = l), u && Object.assign(o, u), {
			tagName: i,
			attributes: o,
			content: a,
			eventListeners: d
		};
	}
};
function Sb(e, t) {
	class n extends xb {
		constructor(t, n) {
			super(t, n), this.t = e;
		}
	}
	for (let e in t) n.prototype[e] = t[e];
	return n.t = e, n;
}
var Cb = Sb("email", {
	isLink: !0,
	toHref() {
		return "mailto:" + this.toString();
	}
}), wb = Sb("text"), Tb = Sb("nl"), Eb = Sb("url", {
	isLink: !0,
	toHref(e = vb.defaultProtocol) {
		return this.hasProtocol() ? this.v : `${e}://${this.v}`;
	},
	hasProtocol() {
		let e = this.tk;
		return e.length >= 2 && e[0].t !== ry && e[1].t === Py;
	}
}), Db = (e) => new Zv(e);
function Ob({ groups: e }) {
	let t = e.domain.concat([
		Dy,
		ky,
		Ay,
		jy,
		My,
		Ny,
		Iy,
		Ry,
		By,
		cy,
		Vy,
		Hy,
		Uy,
		Wy,
		Yy,
		$y,
		Xy,
		Zy
	]), n = [
		Oy,
		Py,
		Fy,
		Ly,
		zy,
		Vy,
		Gy,
		Ky,
		Jy,
		_y,
		vy,
		dy,
		fy,
		my,
		py,
		hy,
		gy,
		yy,
		by,
		xy,
		Sy,
		Cy,
		wy,
		Ty,
		Ey
	], r = [
		Dy,
		Oy,
		ky,
		jy,
		My,
		Ny,
		Iy,
		Ry,
		By,
		dy,
		fy,
		Vy,
		Hy,
		Uy,
		Wy,
		Gy,
		Yy,
		$y,
		Xy,
		Zy
	], i = Db(), a = Q(i, Xy);
	X(a, r, a), X(a, e.domain, a);
	let o = Db(), s = Db(), c = Db();
	X(i, e.domain, o), X(i, e.scheme, s), X(i, e.slashscheme, c), X(o, r, a), X(o, e.domain, o);
	let l = Q(o, Ay);
	Q(a, Ay, l), Q(s, Ay, l), Q(c, Ay, l);
	let u = Q(a, Ly);
	X(u, r, a), X(u, e.domain, a);
	let d = Db();
	X(l, e.domain, d), X(d, e.domain, d);
	let f = Q(d, Ly);
	X(f, e.domain, d);
	let p = Db(Cb);
	X(f, e.tld, p), X(f, e.utld, p), Q(l, ry, p);
	let m = Q(d, By);
	Q(m, By, m), X(m, e.domain, d), X(p, e.domain, d), Q(p, Ly, f), Q(p, By, m);
	let h = Q(o, By), g = Q(o, Ly);
	Q(h, By, h), X(h, e.domain, o), X(g, r, a), X(g, e.domain, o);
	let _ = Db(Eb);
	X(g, e.tld, _), X(g, e.utld, _), X(_, e.domain, o), X(_, r, a), Q(_, Ly, g), Q(_, By, h), Q(_, Ay, l);
	let v = Q(_, Py), y = Db(Eb);
	X(v, e.numeric, y);
	let b = Db(Eb), x = Db();
	X(b, t, b), X(b, n, x), X(x, t, b), X(x, n, x), Q(_, Yy, b), Q(y, Yy, b), Q(_, Gy, x), Q(_, Wy, b), Q(y, Gy, x), Q(y, Wy, b);
	let S = Q(s, Py), C = Q(Q(Q(c, Py), Yy), Yy);
	X(s, e.domain, o), Q(s, Ly, g), Q(s, By, h), X(c, e.domain, o), Q(c, Ly, g), Q(c, By, h), X(S, e.domain, b), Q(S, Yy, b), Q(S, Gy, b), X(C, e.domain, b), X(C, t, b), Q(C, Yy, b);
	let ee = [
		[dy, fy],
		[py, my],
		[hy, gy],
		[_y, vy],
		[yy, by],
		[xy, Sy],
		[Cy, wy],
		[Ty, Ey]
	];
	for (let e = 0; e < ee.length; e++) {
		let [r, i] = ee[e], a = Q(b, r);
		Q(x, r, a);
		let o = Db(Eb);
		X(a, t, o);
		let s = Db();
		X(a, n, s), Q(a, i, b), X(o, t, o), X(o, n, s), X(s, t, o), X(s, n, s), Q(o, i, b), Q(s, i, b);
	}
	return Q(i, ry, _), Q(i, uy, Tb), {
		start: i,
		tokens: eb
	};
}
function kb(e, t, n) {
	let r = n.length, i = 0, a = [], o = [], s = [];
	for (; i < r;) {
		let c = e, l = null, u = null, d = 0, f = null, p = -1, m = [];
		for (; i < r && !(l = c.go(n[i].t));) o.push(n[i++]);
		for (; i < r && (u = l || c.go(n[i].t));) if (l = null, c = u, i++, d++, c.accepts()) p = 0, f = c, m = [];
		else if (p >= 0 && p++, m.push(c), s[i] && s[i].has(c)) break;
		for (let e = 0, t = i - m.length + 1; e < m.length; e++, t++) (s[t] || (s[t] = /* @__PURE__ */ new Set())).add(m[e]);
		if (p < 0) i -= d, i < r && (o.push(n[i]), i++);
		else {
			o.length > 0 && (a.push(Ab(wb, t, o)), o = []), i -= p, d -= p;
			let e = f.t, r = n.slice(i - d, i);
			a.push(Ab(e, t, r));
		}
	}
	return o.length > 0 && a.push(Ab(wb, t, o)), a;
}
function Ab(e, t, n) {
	let r = n[0].s, i = n[n.length - 1].e;
	return new e(t.slice(r, i), n);
}
var jb = typeof console < "u" && console && console.warn || (() => {}), Mb = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", $ = {
	scanner: null,
	parser: null,
	tokenQueue: [],
	pluginQueue: [],
	customSchemes: [],
	initialized: !1
};
function Nb() {
	return Zv.groups = {}, $.scanner = null, $.parser = null, $.tokenQueue = [], $.pluginQueue = [], $.customSchemes = [], $.initialized = !1, $;
}
function Pb(e, t = !1) {
	if ($.initialized && jb(`linkifyjs: already initialized - will not register custom scheme "${e}" ${Mb}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e)) throw Error("linkifyjs: incorrect scheme format.\n1. Must only contain digits, lowercase ASCII letters or \"-\"\n2. Cannot start or end with \"-\"\n3. \"-\" cannot repeat");
	$.customSchemes.push([e, t]);
}
function Fb() {
	$.scanner = pb($.customSchemes);
	for (let e = 0; e < $.tokenQueue.length; e++) $.tokenQueue[e][1]({ scanner: $.scanner });
	$.parser = Ob($.scanner.tokens);
	for (let e = 0; e < $.pluginQueue.length; e++) $.pluginQueue[e][1]({
		scanner: $.scanner,
		parser: $.parser
	});
	return $.initialized = !0, $;
}
function Ib(e) {
	return $.initialized || Fb(), kb($.parser.start, e, mb($.scanner.start, e));
}
Ib.scan = mb;
function Lb(e, t = null, n = null) {
	if (t && typeof t == "object") {
		if (n) throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);
		n = t, t = null;
	}
	let r = new yb(n), i = Ib(e), a = [];
	for (let e = 0; e < i.length; e++) {
		let n = i[e];
		n.isLink && (!t || n.t === t) && r.check(n) && a.push(n.toFormattedObject(r));
	}
	return a;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/extension-link/dist/index.js
var Rb = "[\0- \xA0 ᠎ -\u2029 　]", zb = new RegExp(Rb), Bb = RegExp(`${Rb}$`), Vb = RegExp(`${Rb}+$`), Hb = new RegExp(Rb, "g");
function Ub(e, t, n) {
	let r = e.doc.resolve(t.to);
	if (!r.nodeBefore?.isText) return;
	let i = e.doc.textBetween(t.from, t.to, "￼", "￼").match(Vb)?.[0];
	if (!i) return;
	let a = t.to - i.length, o = Mf(a, t.to, e.doc).filter((e) => e.mark.type === n);
	if (!o.length) return;
	let { nodeAfter: s } = r;
	if (s && o.some((e) => e.mark.isInSet(s.marks))) return;
	let c = e.storedMarks;
	e.removeMark(a, t.to, n), e.setStoredMarks(c), e.selection.empty && e.selection.from === t.to && e.removeStoredMark(n);
}
function Wb(e) {
	return e.length === 1 ? e[0].isLink : e.length === 3 && e[1].isLink ? ["()", "[]"].includes(e[0].value + e[2].value) : !1;
}
function Gb(e) {
	return new R({
		key: new z("autolink"),
		appendTransaction: (t, n, r) => {
			let i = t.some((e) => e.docChanged) && !n.doc.eq(r.doc), a = t.some((e) => e.getMeta("preventAutolink"));
			if (!i || a) return;
			let { tr: o } = r, s = qd(n.doc, [...t]);
			if (!t.some(Du)) {
				let t = [];
				s.steps.forEach((e, n) => {
					if (!(e instanceof pr) || !e.slice.size) return;
					let r = s.mapping.slice(n + 1), i = r.map(e.from, 1), a = r.map(e.from + e.slice.size, -1);
					i < a && t.push({
						from: i,
						to: a
					});
				}), t.sort((e, t) => t.to - e.to), t.forEach((t) => Ub(o, t, e.type));
			}
			if (jf(s).forEach(({ newRange: t }) => {
				let n = Yd(r.doc, t, (e) => e.isTextblock), i, a;
				if (n.length > 1) i = n[0], a = r.doc.textBetween(i.pos, i.pos + i.node.nodeSize, void 0, " ");
				else if (n.length) {
					let e = r.doc.textBetween(t.from, t.to, " ", " ");
					if (!Bb.test(e)) return;
					i = n[0], a = r.doc.textBetween(i.pos, t.to, void 0, " ");
				}
				if (i && a) {
					let t = a.split(zb).filter(Boolean);
					if (t.length <= 0) return !1;
					let n = t[t.length - 1], s = i.pos + a.lastIndexOf(n);
					if (!n) return !1;
					let c = Ib(n).map((t) => t.toObject(e.defaultProtocol));
					if (!Wb(c)) return !1;
					c.filter((e) => e.isLink).map((e) => ({
						...e,
						from: s + e.start + 1,
						to: s + e.end + 1
					})).filter((e) => !r.schema.marks.code || !r.doc.rangeHasMark(e.from, e.to, r.schema.marks.code)).filter((t) => e.validate(t.value)).filter((t) => e.shouldAutoLink(t.value)).forEach((t) => {
						Mf(t.from, t.to, r.doc).some((t) => t.mark.type === e.type) || o.addMark(t.from, t.to, e.type.create({ href: t.href }));
					});
				}
			}), o.steps.length) return o;
		}
	});
}
function Kb(e) {
	return new R({
		key: new z("handleClickLink"),
		props: { handleClick: (t, n, r) => {
			if (r.button !== 0 || !t.editable) return !1;
			let i = null;
			if (r.target instanceof HTMLAnchorElement) i = r.target;
			else {
				let t = r.target;
				if (!t) return !1;
				let n = e.editor.view.dom;
				i = t.closest("a"), i && !n.contains(i) && (i = null);
			}
			if (!i) return !1;
			let a = !1;
			if (e.enableClickSelection && (a = e.editor.commands.extendMarkRange(e.type.name)), e.openOnClick) {
				let n = Of(t.state, e.type.name), r = i.href ?? n.href, o = i.target ?? n.target;
				r && (window.open(r, o), a = !0);
			}
			return a;
		} }
	});
}
var qb = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/, Jb = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;
function Yb(e, t) {
	let n = 0;
	for (let r = t - 1; r >= 0 && e[r] === "\\"; --r) n += 1;
	return n % 2 == 1;
}
function Xb(e, t) {
	let n = 0, r = 0;
	for (; r < t;) {
		if (e[r] !== "`" || n === 0 && Yb(e, r)) {
			r += 1;
			continue;
		}
		let i = 0;
		for (; r < t && e[r] === "`";) i += 1, r += 1;
		n === 0 ? n = i : i === n && (n = 0);
	}
	return n > 0;
}
function Zb(e, t, n) {
	let [, r, i] = t;
	return (t.index ? e[t.index - 1] : void 0) === "!" || Yb(e, t.index ?? 0) || Xb(e, t.index ?? 0) ? !1 : !!r.trim() && n(i);
}
function Qb(e) {
	let [t, n, r, , i, a, o] = e, s = i ?? a ?? o;
	return {
		index: e.index ?? 0,
		text: t,
		replaceWith: n,
		data: {
			href: r,
			title: s || null,
			markdown: !0
		}
	};
}
function $b(e, t) {
	return e.index < t.index + t.text.length && t.index < e.index + e.text.length;
}
function ex(e) {
	return {
		href: e.data?.href,
		title: e.data?.title ?? null
	};
}
function tx(e) {
	let t = Jm({
		find: (t) => {
			let n = qb.exec(t);
			return !n || !Zb(t, n, e.isAllowedHref) ? null : Qb(n);
		},
		type: e.type,
		getAttributes: ex
	});
	return new gm({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function nx(e) {
	let t = nh({
		find: (t) => {
			let n = [];
			for (let r of t.matchAll(Jb)) Zb(t, r, e.isAllowedHref) && n.push(Qb(r));
			let r = (e.findPlainUrls?.call(e, t) ?? []).filter((e) => !n.some((t) => $b(t, e)));
			return [...n, ...r];
		},
		type: e.type,
		getAttributes: ex
	});
	return new Tm({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.match.data?.markdown && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function rx(e) {
	return new R({
		key: new z("handlePasteLink"),
		props: { handlePaste: (t, n, r) => {
			let { shouldAutoLink: i } = e, { state: a } = t, { selection: o } = a, { empty: s } = o;
			if (s) return !1;
			let c = "";
			r.content.forEach((e) => {
				c += e.textContent;
			});
			let l = Lb(c, { defaultProtocol: e.defaultProtocol }).find((e) => e.isLink && e.value === c);
			return !c || !l || i !== void 0 && !i(l.value) ? !1 : e.editor.commands.setMark(e.type, { href: l.href });
		} }
	});
}
function ix(e, t) {
	let n = [
		"http",
		"https",
		"ftp",
		"ftps",
		"mailto",
		"tel",
		"callto",
		"sms",
		"cid",
		"xmpp"
	];
	return t && t.forEach((e) => {
		let t = typeof e == "string" ? e : e.scheme;
		t && n.push(t);
	}), !e || e.replace(Hb, "").match(RegExp(`^(?:(?:${n.map((e) => e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`, "i"));
}
var ax = wm.create({
	name: "link",
	priority: 1e3,
	keepOnSplit: !1,
	exitable: !0,
	onCreate() {
		this.options.validate && !this.options.shouldAutoLink && (this.options.shouldAutoLink = this.options.validate, console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")), this.options.protocols.forEach((e) => {
			typeof e == "string" ? Pb(e) : Pb(e.scheme, e.optionalSlashes);
		});
	},
	onDestroy() {
		Nb();
	},
	inclusive() {
		return this.options.autolink;
	},
	addOptions() {
		return {
			openOnClick: !0,
			enableClickSelection: !1,
			linkOnPaste: !0,
			markdownLinks: !1,
			autolink: !0,
			protocols: [],
			defaultProtocol: "http",
			HTMLAttributes: {
				target: "_blank",
				rel: "noopener noreferrer nofollow",
				class: null
			},
			isAllowedUri: (e, t) => !!ix(e, t.protocols),
			validate: (e) => !!e,
			shouldAutoLink: (e) => {
				let t = /^[a-z][a-z0-9+.-]*:\/\//i.test(e), n = /^[a-z][a-z0-9+.-]*:/i.test(e);
				if (t || n && !e.includes("@")) return !0;
				let r = (e.includes("@") ? e.split("@").pop() : e).split(/[/?#:]/)[0];
				return !(/^\d{1,3}(\.\d{1,3}){3}$/.test(r) || !/\./.test(r));
			}
		};
	},
	addAttributes() {
		return {
			href: {
				default: null,
				parseHTML(e) {
					return e.getAttribute("href");
				}
			},
			target: { default: this.options.HTMLAttributes.target ?? null },
			rel: { default: this.options.HTMLAttributes.rel ?? null },
			class: { default: this.options.HTMLAttributes.class ?? null },
			title: { default: null }
		};
	},
	parseHTML() {
		return [{
			tag: "a[href]",
			getAttrs: (e) => {
				let t = e.getAttribute("href");
				return !t || !this.options.isAllowedUri(t, {
					defaultValidate: (e) => !!ix(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : null;
			}
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return this.options.isAllowedUri(e.href, {
			defaultValidate: (e) => !!ix(e, this.options.protocols),
			protocols: this.options.protocols,
			defaultProtocol: this.options.defaultProtocol
		}) ? [
			"a",
			J(this.options.HTMLAttributes, e),
			0
		] : [
			"a",
			J(this.options.HTMLAttributes, {
				...e,
				href: ""
			}),
			0
		];
	},
	markdownTokenName: "link",
	parseMarkdown: (e, t) => t.applyMark("link", t.parseInline(e.tokens || []), {
		href: e.href,
		title: e.title || null
	}),
	renderMarkdown: (e, t) => {
		let n = e.attrs?.href ?? "", r = e.attrs?.title ?? "", i = t.renderChildren(e);
		return r ? `[${i}](${n} "${r}")` : `[${i}](${n})`;
	},
	addCommands() {
		return {
			setLink: (e) => ({ chain: t }) => {
				let { href: n } = e;
				return this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!ix(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? t().setMark(this.name, e).setMeta("preventAutolink", !0).run() : !1;
			},
			toggleLink: (e) => ({ chain: t }) => {
				let { href: n } = e || {};
				return n && !this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!ix(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : t().toggleMark(this.name, e, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run();
			},
			unsetLink: () => ({ chain: e }) => e().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
		};
	},
	addInputRules() {
		return this.options.markdownLinks ? [tx({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!ix(e, this.options.protocols),
				protocols: this.options.protocols,
				defaultProtocol: this.options.defaultProtocol
			})
		})] : [];
	},
	addPasteRules() {
		let e = (e) => {
			let t = [];
			if (e) {
				let { protocols: n, defaultProtocol: r } = this.options;
				Lb(e).filter((e) => e.isLink && this.options.isAllowedUri(e.value, {
					defaultValidate: (e) => !!ix(e, n),
					protocols: n,
					defaultProtocol: r
				})).forEach((e) => {
					this.options.shouldAutoLink(e.value) && t.push({
						text: e.value,
						data: { href: e.href },
						index: e.start
					});
				});
			}
			return t;
		};
		return this.options.markdownLinks ? [nx({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!ix(e, this.options.protocols),
				protocols: this.options.protocols,
				defaultProtocol: this.options.defaultProtocol
			}),
			findPlainUrls: e
		})] : [nh({
			find: e,
			type: this.type,
			getAttributes: (e) => ({ href: e.data?.href })
		})];
	},
	addProseMirrorPlugins() {
		let e = [], { protocols: t, defaultProtocol: n } = this.options;
		return this.options.autolink && e.push(Gb({
			type: this.type,
			defaultProtocol: this.options.defaultProtocol,
			validate: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!ix(e, t),
				protocols: t,
				defaultProtocol: n
			}),
			shouldAutoLink: this.options.shouldAutoLink
		})), e.push(Kb({
			type: this.type,
			editor: this.editor,
			openOnClick: this.options.openOnClick === "whenNotEditable" || this.options.openOnClick,
			enableClickSelection: this.options.enableClickSelection
		})), this.options.linkOnPaste && e.push(rx({
			editor: this.editor,
			defaultProtocol: this.options.defaultProtocol,
			type: this.type,
			shouldAutoLink: this.options.shouldAutoLink
		})), e;
	}
}), ox = ax, sx = "listItem", cx = "textStyle", lx = /^\s*([-+*])\s$/, ux = eh.create({
	name: "bulletList",
	addOptions() {
		return {
			itemTypeName: "listItem",
			HTMLAttributes: {},
			keepMarks: !1,
			keepAttributes: !1
		};
	},
	group: "block list",
	content() {
		return `${this.options.itemTypeName}+`;
	},
	parseHTML() {
		return [{ tag: "ul" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"ul",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "list",
	parseMarkdown: (e, t) => e.type !== "list" || e.ordered ? [] : {
		type: "bulletList",
		content: e.items ? t.parseChildren(e.items) : []
	},
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleBulletList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(sx, this.editor.getAttributes(cx)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-8": () => this.editor.commands.toggleBulletList() };
	},
	addInputRules() {
		let e = Zm({
			find: lx,
			type: this.type
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (e = Zm({
			find: lx,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: () => this.editor.getAttributes(cx),
			editor: this.editor
		})), [e];
	}
}), dx = (e, t, n) => {
	let { selection: r } = e;
	if (!r.empty) return null;
	let { $from: i } = r;
	if (!i.parent.isTextblock || i.parentOffset !== i.parent.content.size) return null;
	let a = -1;
	for (let e = i.depth; e > 0; --e) if (i.node(e).type.name === t) {
		a = e;
		break;
	}
	if (a < 0) return null;
	let o = i.node(a), s = i.index(a);
	if (s + 1 >= o.childCount) return null;
	let c = o.child(s + 1);
	if (!n.includes(c.type.name)) return null;
	let l = e.schema.nodes[t], u = !1;
	if (c.forEach((e) => {
		e.type === l && e.childCount > 1 && (u = !0);
	}), !u) return null;
	let d = e.doc.resolve(i.after()).nodeAfter;
	if (!d || !n.includes(d.type.name)) return null;
	let f = [];
	return d.forEach((e) => {
		f.push(e);
	}), f.length === 0 ? null : {
		listItemDepth: a,
		nestedList: d,
		nestedListPos: i.after(),
		insertPos: i.after(a),
		items: f
	};
}, fx = (e, t, n, r) => {
	let i = dx(e, n, r);
	if (!i) return !1;
	let { selection: a } = e, { nestedList: o, nestedListPos: s, insertPos: c, items: l } = i, u = e.tr;
	u.delete(s, s + o.nodeSize);
	let d = u.mapping.map(c);
	return u.insert(d, j.from(l)), u.setSelection(a.map(u.doc, u.mapping)), t && t(u), !0;
}, px = (e, t, n) => fx(e.state, e.view.dispatch, t, n), mx = (e, t) => Y.create({
	name: `${e}BranchingDeleteKeymap`,
	priority: 101,
	addKeyboardShortcuts() {
		let n = () => px(this.editor, e, t);
		return {
			Delete: n,
			"Mod-Delete": n
		};
	}
}), hx = [
	[1e3, "m"],
	[900, "cm"],
	[500, "d"],
	[400, "cd"],
	[100, "c"],
	[90, "xc"],
	[50, "l"],
	[40, "xl"],
	[10, "x"],
	[9, "ix"],
	[5, "v"],
	[4, "iv"],
	[1, "i"]
], gx = "abcdefghijklmnopqrstuvwxyz", _x = String.raw`\d+|[ivxlcdmIVXLCDM]+|${"[a-zA-Z]{1,2}"}`;
function vx(e) {
	let t = e, n = "";
	for (let [e, r] of hx) for (; t >= e;) n += r, t -= e;
	return n;
}
function yx(e) {
	return vx(e).toUpperCase();
}
function bx(e) {
	let t = e.toLowerCase(), n = 0, r = 0;
	for (; n < t.length;) {
		let e = !1;
		for (let [i, a] of hx) if (t.startsWith(a, n)) {
			r += i, n += a.length, e = !0;
			break;
		}
		if (!e) return 0;
	}
	return r;
}
function xx(e) {
	if (!/^[ivxlcdmIVXLCDM]+$/.test(e)) return !1;
	let t = bx(e);
	return t <= 0 ? !1 : (e === e.toLowerCase() ? vx(t) : yx(t)) === e;
}
function Sx(e) {
	let t = e.toLowerCase();
	if (t.length === 1) return t.charCodeAt(0) - 97 + 1;
	if (t.length === 2) {
		let e = t.charCodeAt(0) - 97, n = t.charCodeAt(1) - 97;
		return (e + 1) * 26 + n + 1;
	}
	return 0;
}
function Cx(e) {
	if (e <= 26) return gx[e - 1];
	let t = Math.floor((e - 1) / 26) - 1, n = (e - 1) % 26;
	return t < 0 ? gx[n] : gx[t] + gx[n];
}
function wx(e) {
	if (e && !/^\d+$/.test(e)) {
		if (xx(e)) return e === e.toLowerCase() ? "i" : "I";
		if (/^[a-z]{1,2}$/.test(e)) return "a";
		if (/^[A-Z]{1,2}$/.test(e)) return "A";
	}
}
function Tx(e) {
	if (/^\d+$/.test(e)) return parseInt(e, 10);
	let t = wx(e);
	if (t === "i" || t === "I") return bx(e);
	if (t === "a" || t === "A") {
		let t = Sx(e);
		return t > 0 ? t : 1;
	}
	let n = parseInt(e, 10);
	return Number.isNaN(n) ? 1 : n;
}
function Ex(e, t) {
	if (e === "numeric") return String(t);
	switch (e) {
		case "a": return Cx(t);
		case "A": return Cx(t).toUpperCase();
		case "i": return vx(t);
		case "I": return yx(t);
		default: return String(t);
	}
}
function Dx(e) {
	if (e.length === 0) return !1;
	let t = wx(e[0]) ?? "numeric", n = Tx(e[0]);
	if (n < 1) return !1;
	for (let r = 0; r < e.length; r++) {
		let i = Ex(t, n + r);
		if (e[r] !== i) return !1;
	}
	return !0;
}
function Ox(e) {
	return {
		type: wx(e),
		start: Tx(e)
	};
}
function kx(e) {
	let { type: t, start: n } = Ox(e), r = {};
	return t && (r.type = t), n !== 1 && (r.start = n), r;
}
function Ax(e, t, n = ". ") {
	let r = t + 1;
	if (!e || e === "1") return `${r}${n}`;
	switch (e) {
		case "a": return `${Cx(r)}${n}`;
		case "A": return `${Cx(r).toUpperCase()}${n}`;
		case "i": return `${vx(r)}${n}`;
		case "I": return `${yx(r)}${n}`;
		default: return `${r}${n}`;
	}
}
function jx(e) {
	let t = e.tokens?.[0];
	return !!(e.text && e.tokens?.length === 1 && t?.type === "list" && t.ordered && t.raw === e.text);
}
function Mx(e, t) {
	return t.tokenizeInline ? t.parseInline(t.tokenizeInline(e)) : t.parseInline([{
		type: "text",
		raw: e,
		text: e
	}]);
}
var Nx = eh.create({
	name: "listItem",
	addOptions() {
		return {
			HTMLAttributes: {},
			bulletListTypeName: "bulletList",
			orderedListTypeName: "orderedList"
		};
	},
	content: "paragraph block*",
	defining: !0,
	parseHTML() {
		return [{ tag: "li" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"li",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "list_item",
	parseMarkdown: (e, t) => {
		if (e.type !== "list_item") return [];
		let n = t.parseBlockChildren ?? t.parseChildren, r = [];
		if (e.tokens && e.tokens.length > 0) {
			if (jx(e)) return {
				type: "listItem",
				content: [{
					type: "paragraph",
					content: Mx(e.text || "", t)
				}]
			};
			if (e.tokens.some((e) => e.type === "paragraph")) r = n(e.tokens);
			else {
				let i = e.tokens[0];
				if (i && i.type === "text" && i.tokens && i.tokens.length > 0) {
					if (r = [{
						type: "paragraph",
						content: t.parseInline(i.tokens)
					}], e.tokens.length > 1) {
						let t = n(e.tokens.slice(1));
						r.push(...t);
					}
				} else r = n(e.tokens);
			}
		}
		return r.length === 0 && (r = [{
			type: "paragraph",
			content: []
		}]), {
			type: "listItem",
			content: r
		};
	},
	renderMarkdown: (e, t, n) => pm(e, t, (e) => {
		if (e.parentType === "bulletList") return "- ";
		if (e.parentType === "orderedList") {
			var t, n;
			let r = ((t = e.meta) == null || (t = t.parentAttrs) == null ? void 0 : t.start) || 1;
			return Ax((n = e.meta) == null || (n = n.parentAttrs) == null ? void 0 : n.type, r - 1 + (e.index || 0), ". ");
		}
		return "- ";
	}, n, { alignNestedToPrefix: n?.parentType === "orderedList" }),
	addExtensions() {
		return [mx(this.name, [this.options.bulletListTypeName, this.options.orderedListTypeName])];
	},
	addKeyboardShortcuts() {
		return {
			Enter: () => this.editor.commands.splitListItem(this.name),
			Tab: () => this.editor.commands.sinkListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
	}
}), Px = (e, t) => {
	let { $from: n } = t.selection, r = G(e, t.schema), i = null, a = n.depth, o = n.pos, s = null;
	for (; a > 0 && s === null;) i = n.node(a), i.type === r ? s = a : (--a, --o);
	return s === null ? null : {
		$pos: t.doc.resolve(o),
		depth: s
	};
}, Fx = (e, t) => {
	let n = Px(e, t);
	if (!n) return !1;
	let [, r] = Nf(t, e, n.$pos.pos + 4);
	return r;
}, Ix = (e, t, n) => {
	let { $anchor: r } = e.selection, i = Math.max(0, r.pos - 2), a = e.doc.resolve(i).node();
	return !(!a || !n.includes(a.type.name));
}, Lx = (e, t, n) => {
	if (e.commands.undoInputRule()) return !0;
	if (e.state.selection.from !== e.state.selection.to) return !1;
	if (!kd(e.state, t) && Ix(e.state, t, n)) {
		let { $anchor: n } = e.state.selection, r = e.state.doc.resolve(n.before() - 1), i = [];
		r.node().descendants((e, n) => {
			e.type.name === t && i.push({
				node: e,
				pos: n
			});
		});
		let a = i.at(-1);
		if (!a) return !1;
		let o = e.state.doc.resolve(r.start() + a.pos + 1);
		return e.chain().cut({
			from: n.start() - 1,
			to: n.end() + 1
		}, o.end()).joinForward().run();
	}
	if (!kd(e.state, t) || !Vf(e.state)) return !1;
	let { $from: r } = e.state.selection, i = r.depth - 1;
	return r.node(i).type !== e.schema.nodes[t] || r.index(i) !== 0 ? !1 : e.chain().liftListItem(t).run();
}, Rx = (e, t) => {
	let n = Fx(e, t), r = Px(e, t);
	return !r || !n ? !1 : n > r.depth;
}, zx = (e, t) => {
	let n = Fx(e, t), r = Px(e, t);
	return !r || !n ? !1 : n < r.depth;
}, Bx = (e, t) => {
	if (!kd(e.state, t) || !Bf(e.state, t)) return !1;
	let { selection: n } = e.state, { $from: r, $to: i } = n;
	return !n.empty && r.sameParent(i) ? !1 : Rx(t, e.state) ? e.chain().focus(e.state.selection.from + 4).lift(t).joinBackward().run() : zx(t, e.state) ? e.chain().joinForward().joinBackward().run() : e.commands.joinItemForward();
}, Vx = (e, t, n) => {
	let { state: r } = e, { selection: i } = r;
	if (!i.empty) return !1;
	let { $from: a } = i;
	if (a.parentOffset !== 0 || !a.parent.isTextblock || kd(r, t)) return !1;
	let o = Pf(a);
	if (!o || !n.includes(o.type.name)) return !1;
	let s = o.lastChild;
	if (!s || s.type.name !== t) return !1;
	let c = a.parent;
	if (!s.canReplace(s.childCount, s.childCount, j.from(c))) return !1;
	let l = a.before(), u = a.after(), d = l - 2;
	return e.commands.command(({ tr: e, dispatch: t }) => (t && (e.delete(l, u).insert(d, j.from(c)), e.setSelection(I.create(e.doc, d + 1)), e.scrollIntoView()), !0));
}, Hx = Y.create({
	name: "listKeymap",
	addOptions() {
		return { listTypes: [{
			itemName: "listItem",
			wrapperNames: ["bulletList", "orderedList"]
		}, {
			itemName: "taskItem",
			wrapperNames: ["taskList"]
		}] };
	},
	addKeyboardShortcuts() {
		return {
			Delete: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && Bx(e, n) && (t = !0);
				}), t;
			},
			"Mod-Delete": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && Bx(e, n) && (t = !0);
				}), t;
			},
			Backspace: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && Lx(e, n, r) && (t = !0);
				}), t;
			},
			"Mod-Backspace": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && Lx(e, n, r) && (t = !0);
				}), t;
			},
			Tab: ({ editor: e }) => {
				for (let { itemName: t, wrapperNames: n } of this.options.listTypes) if (e.state.schema.nodes[t] !== void 0 && Vx(e, t, n)) return !0;
				return !1;
			}
		};
	}
}), Ux = RegExp(`^(\\s*)(${_x})([.)])\\s+(.*)$`), Wx = /^\s/, Gx = {
	heading: /^#{1,6}(?:\s|$)/,
	bulletItem: /^[-+*]\s+/,
	codeFence: /^(?:```|~~~)/,
	blockMath: /^\$\$/,
	thematicBreak: /^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/
};
function Kx(e) {
	return Ux.test(e.trimStart());
}
function qx(e) {
	let t = e.trimStart();
	return Gx.bulletItem.test(t) || Kx(t) || Gx.heading.test(t) || Gx.thematicBreak.test(t) && !t.startsWith("-") || /^>\s?/.test(t) || Gx.codeFence.test(t) || Gx.blockMath.test(t);
}
function Jx(e) {
	return Object.values(Gx).some((t) => t.test(e));
}
function Yx(e) {
	let t = [], n = [], r = !1;
	return e.forEach((e) => {
		r ? n.push(e) : e.trim() === "" || t.length > 0 && qx(e) ? (r = !0, n.push(e)) : t.push(e);
	}), {
		paragraphLines: t,
		blockLines: n
	};
}
function Xx(e) {
	let t = [], n = 0, r = 0;
	for (; n < e.length;) {
		let i = e[n], a = i.match(Ux);
		if (!a) break;
		let [, o, s, c, l] = a, u = o.length, d = parseInt(s, 10), f = isNaN(d) ? wx(s) : void 0, p = isNaN(d) ? Tx(s) : d, m = [l], h = n + 1, g = [i], _ = !1;
		for (; h < e.length;) {
			let t = e[h];
			if (t.match(Ux)) break;
			if (t.trim() === "") g.push(t), m.push(""), _ = !0, h += 1;
			else if (t.match(Wx)) {
				let e = t.length - t.trimStart().length, n = u + s.length + 1;
				g.push(t), m.push(t.slice(Math.min(e, n))), h += 1;
			} else {
				if (_ || Jx(t)) break;
				g.push(t), m.push(t), h += 1;
			}
		}
		t.push({
			indent: u,
			number: p,
			type: f,
			content: m.join("\n").trim(),
			contentLines: m,
			raw: g.join("\n")
		}), r = h, n = h;
	}
	return [t, r];
}
var Zx = RegExp(`^(${_x})([.)])\\s+(.+)$`);
function Qx(e) {
	let t = e.split("\n").filter((e) => e.trim().length > 0);
	if (t.length === 0) return null;
	let n = [];
	for (let e of t) {
		let t = e.trim().match(Zx);
		if (!t) return null;
		n.push({
			marker: t[1],
			content: t[3]
		});
	}
	return Dx(n.map((e) => e.marker)) ? {
		type: "orderedList",
		attrs: kx(n[0].marker),
		content: n.map((e) => ({
			type: "listItem",
			content: [{
				type: "paragraph",
				content: [{
					type: "text",
					text: e.content
				}]
			}]
		}))
	} : null;
}
function $x(e, t, n) {
	let r = [], i = 0;
	for (; i < e.length;) {
		let a = e[i];
		if (a.indent === t) {
			let { paragraphLines: o, blockLines: s } = Yx(a.contentLines), c = o.join("\n").trim(), l = [];
			c && l.push({
				type: "paragraph",
				raw: c,
				tokens: n.inlineTokens(c)
			});
			let u = s.join("\n").trim();
			if (u) {
				let e = n.blockTokens(u);
				l.push(...e);
			}
			let d = i + 1, f = [];
			for (; d < e.length && e[d].indent > t;) f.push(e[d]), d += 1;
			if (f.length > 0) {
				let e = $x(f, Math.min(...f.map((e) => e.indent)), n);
				l.push({
					type: "list",
					ordered: !0,
					start: f[0].number,
					typeMarker: f[0].type,
					items: e,
					raw: f.map((e) => e.raw).join("\n")
				});
			}
			r.push({
				type: "list_item",
				raw: a.raw,
				tokens: l
			}), i = d;
		} else i += 1;
	}
	return r;
}
function eS(e, t) {
	return e.map((e) => {
		if (e.type !== "list_item") return t.parseChildren([e])[0];
		let n = [];
		return e.tokens && e.tokens.length > 0 && e.tokens.forEach((e) => {
			if (e.type === "paragraph" || e.type === "list" || e.type === "blockquote" || e.type === "code") n.push(...t.parseChildren([e]));
			else if (e.type === "text" && e.tokens) {
				let r = t.parseChildren([e]);
				n.push({
					type: "paragraph",
					content: r
				});
			} else {
				let r = t.parseChildren([e]);
				r.length > 0 && n.push(...r);
			}
		}), {
			type: "listItem",
			content: n
		};
	});
}
var tS = 64;
function nS(e, t) {
	let n = [], r = 0;
	for (; n.length < t;) {
		let t = e.indexOf("\n", r);
		if (t === -1) return n.push(e.slice(r)), n;
		n.push(e.slice(r, t)), r = t + 1;
	}
	return n;
}
function rS(e) {
	let t = e.indexOf("\n"), n = t === -1 ? e : e.slice(0, t);
	if (!Ux.test(n)) return [
		[],
		0,
		[]
	];
	let r = tS, i = nS(e, r), a = Xx(i);
	for (; a[1] === i.length && i.length === r;) r *= 2, i = nS(e, r), a = Xx(i);
	return [
		a[0],
		a[1],
		i
	];
}
var iS = "listItem", aS = "textStyle", oS = /^(\d+)\.\s$/;
function sS(e) {
	let t = e.match(/list-style-type\s*:\s*([^;]+)/i);
	if (!t) return null;
	switch (t[1].trim().toLowerCase()) {
		case "upper-roman": return "I";
		case "lower-roman": return "i";
		case "upper-alpha":
		case "upper-latin": return "A";
		case "lower-alpha":
		case "lower-latin": return "a";
		default: return null;
	}
}
var cS = eh.create({
	name: "orderedList",
	addOptions() {
		return {
			itemTypeName: "listItem",
			HTMLAttributes: {},
			keepMarks: !1,
			keepAttributes: !1
		};
	},
	group: "block list",
	content() {
		return `${this.options.itemTypeName}+`;
	},
	addAttributes() {
		return {
			start: {
				default: 1,
				parseHTML: (e) => e.hasAttribute("start") ? parseInt(e.getAttribute("start") || "", 10) : 1
			},
			type: {
				default: null,
				parseHTML: (e) => {
					let t = e.getAttribute("type");
					if (t) return t;
					let n = e.getAttribute("style");
					if (n) {
						let e = sS(n);
						if (e) return e;
					}
					let r = e.querySelector("li");
					if (r) {
						let e = r.getAttribute("style");
						if (e) {
							let t = sS(e);
							if (t) return t;
						}
					}
					return null;
				}
			}
		};
	},
	parseHTML() {
		return [{ tag: "ol" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		let { start: t, type: n, ...r } = e, i = J(this.options.HTMLAttributes, r);
		return t !== 1 && (i.start = t), n && n !== "1" && (i.type = n), [
			"ol",
			i,
			0
		];
	},
	markdownTokenName: "list",
	parseMarkdown: (e, t) => {
		if (e.type !== "list" || !e.ordered) return [];
		let n = e.start || 1, r = e.typeMarker, i = e.items ? eS(e.items, t) : [], a = {};
		return n !== 1 && (a.start = n), r && (a.type = r), Object.keys(a).length > 0 ? {
			type: "orderedList",
			attrs: a,
			content: i
		} : {
			type: "orderedList",
			content: i
		};
	},
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownTokenizer: {
		name: "orderedList",
		level: "block",
		start: () => -1,
		tokenize: (e, t, n) => {
			let [r, i, a] = rS(e);
			if (r.length === 0) return;
			let o = $x(r, r[0].indent, n);
			if (o.length !== 0) return {
				type: "list",
				ordered: !0,
				start: r[0]?.number || 1,
				typeMarker: r[0]?.type,
				items: o,
				raw: a.slice(0, i).join("\n")
			};
		}
	},
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleOrderedList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(iS, this.editor.getAttributes(aS)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-7": () => this.editor.commands.toggleOrderedList() };
	},
	addProseMirrorPlugins() {
		return [new R({ props: { handlePaste: (e, t) => {
			if ((t.clipboardData?.getData("text/html"))?.trim()) return !1;
			let n = t.clipboardData?.getData("text/plain");
			if (!n) return !1;
			let r = Qx(n);
			if (!r) return !1;
			try {
				let t = e.state.schema.nodeFromJSON(r), n = e.state.tr.replaceSelectionWith(t);
				return e.dispatch(n), !0;
			} catch {
				return !1;
			}
		} } })];
	},
	addInputRules() {
		let e = (e, t) => (!t.attrs.type || t.attrs.type === "1") && t.childCount + t.attrs.start === +e[1], t = Zm({
			find: oS,
			type: this.type,
			getAttributes: (e) => ({ start: +e[1] }),
			joinPredicate: e
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (t = Zm({
			find: oS,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: (e) => ({
				start: +e[1],
				...this.editor.getAttributes(aS)
			}),
			joinPredicate: e,
			editor: this.editor
		})), [t];
	}
}), lS = /^\s*(\[([( |x])?\])\s$/, uS = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0", dS = (e, t, n) => {
	var r;
	return (n == null || (r = n.checkboxLabel) == null ? void 0 : r.call(n, e, t)) || `Task item checkbox for ${e.textContent || "empty task item"}`;
}, fS = eh.create({
	name: "taskItem",
	addOptions() {
		return {
			nested: !1,
			HTMLAttributes: {},
			taskListTypeName: "taskList",
			a11y: void 0
		};
	},
	content() {
		return this.options.nested ? "paragraph block*" : "paragraph+";
	},
	defining: !0,
	addAttributes() {
		return { checked: {
			default: !1,
			keepOnSplit: !1,
			parseHTML: (e) => {
				let t = e.getAttribute("data-checked");
				return t === "" || t === "true";
			},
			renderHTML: (e) => ({ "data-checked": e.checked })
		} };
	},
	parseHTML() {
		return [{
			tag: `li[data-type="${this.name}"]`,
			priority: 51,
			contentElement: (e) => e.querySelector("div") ?? e
		}];
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			"li",
			J(this.options.HTMLAttributes, t, { "data-type": this.name }),
			[
				"label",
				["input", {
					type: "checkbox",
					checked: e.attrs.checked ? "checked" : null
				}],
				["span"]
			],
			["div", 0]
		];
	},
	parseMarkdown: (e, t) => {
		let n = [];
		if (e.tokens && e.tokens.length > 0 ? n.push(t.createNode("paragraph", {}, t.parseInline(e.tokens))) : e.text ? n.push(t.createNode("paragraph", {}, [t.createNode("text", { text: e.text })])) : n.push(t.createNode("paragraph", {}, [])), e.nestedTokens && e.nestedTokens.length > 0) {
			let r = t.parseChildren(e.nestedTokens);
			n.push(...r);
		}
		return t.createNode("taskItem", { checked: e.checked || !1 }, n);
	},
	renderMarkdown: (e, t) => pm(e, t, `- [${e.attrs?.checked ? "x" : " "}] `),
	addExtensions() {
		return this.options.nested ? [mx(this.name, [this.options.taskListTypeName])] : [];
	},
	addKeyboardShortcuts() {
		let e = {
			Enter: () => this.editor.commands.splitListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
		return this.options.nested ? {
			...e,
			Tab: () => this.editor.commands.sinkListItem(this.name)
		} : e;
	},
	addNodeView() {
		return ({ node: e, HTMLAttributes: t, getPos: n, editor: r }) => {
			let i = document.createElement("li"), a = document.createElement("label"), o = document.createElement("span"), s = document.createElement("input"), c = document.createElement("div");
			o.style.cssText = uS;
			let l = (e) => {
				let t = dS(e, e.attrs.checked, this.options.a11y);
				s.setAttribute("aria-label", t), o.textContent = t;
			};
			l(e), a.contentEditable = "false", s.type = "checkbox", s.addEventListener("mousedown", (e) => e.preventDefault()), s.addEventListener("change", (t) => {
				if (!r.isEditable && !this.options.onReadOnlyChecked) {
					s.checked = !s.checked;
					return;
				}
				let { checked: i } = t.target;
				r.isEditable && typeof n == "function" && r.chain().focus(void 0, { scrollIntoView: !1 }).command(({ tr: e }) => {
					let t = n();
					if (typeof t != "number") return !1;
					let r = e.doc.nodeAt(t);
					return e.setNodeMarkup(t, void 0, {
						...r?.attrs,
						checked: i
					}), !0;
				}).run(), !r.isEditable && this.options.onReadOnlyChecked && (this.options.onReadOnlyChecked(e, i) || (s.checked = !s.checked));
			}), Object.entries(this.options.HTMLAttributes).forEach(([e, t]) => {
				i.setAttribute(e, t);
			}), i.dataset.checked = e.attrs.checked, s.checked = e.attrs.checked, a.append(s, o), i.append(a, c), Object.entries(t).forEach(([e, t]) => {
				i.setAttribute(e, t);
			});
			let u = new Set(Object.keys(t));
			return {
				dom: i,
				contentDOM: c,
				update: (e) => {
					if (e.type !== this.type) return !1;
					i.dataset.checked = e.attrs.checked, s.checked = e.attrs.checked, l(e);
					let t = r.extensionManager.attributes, n = hf(e, t), a = new Set(Object.keys(n)), o = this.options.HTMLAttributes;
					return u.forEach((e) => {
						a.has(e) || (e in o ? i.setAttribute(e, o[e]) : i.removeAttribute(e));
					}), Object.entries(n).forEach(([e, t]) => {
						t == null ? e in o ? i.setAttribute(e, o[e]) : i.removeAttribute(e) : i.setAttribute(e, t);
					}), u = a, !0;
				}
			};
		};
	},
	addInputRules() {
		return [Zm({
			find: lS,
			type: this.type,
			getAttributes: (e) => ({ checked: e[e.length - 1] === "x" })
		})];
	}
}), pS = eh.create({
	name: "taskList",
	addOptions() {
		return {
			itemTypeName: "taskItem",
			HTMLAttributes: {}
		};
	},
	group: "block list",
	content() {
		return `${this.options.itemTypeName}+`;
	},
	parseHTML() {
		return [{
			tag: `ul[data-type="${this.name}"]`,
			priority: 51
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"ul",
			J(this.options.HTMLAttributes, e, { "data-type": this.name }),
			0
		];
	},
	parseMarkdown: (e, t) => t.createNode("taskList", {}, t.parseChildren(e.items || [])),
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownTokenizer: {
		name: "taskList",
		level: "block",
		start(e) {
			let t = e.match(/^\s*[-+*]\s+\[([ xX])\]\s+/)?.index;
			return t === void 0 ? -1 : t;
		},
		tokenize(e, t, n) {
			let r = (e) => {
				let t = um(e, {
					itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
					extractItemData: (e) => ({
						indentLevel: e[1].length,
						mainContent: e[4],
						checked: e[3].toLowerCase() === "x"
					}),
					createToken: (e, t) => ({
						type: "taskItem",
						raw: "",
						mainContent: e.mainContent,
						indentLevel: e.indentLevel,
						checked: e.checked,
						text: e.mainContent,
						tokens: n.inlineTokens(e.mainContent),
						nestedTokens: t
					}),
					customNestedParser: r
				}, n);
				if (t) {
					let r = {
						type: "taskList",
						raw: t.raw,
						items: t.items
					}, i = e.slice(t.raw.length);
					return i.trim() ? [r, ...n.blockTokens(i)] : [r];
				}
				return n.blockTokens(e);
			}, i = um(e, {
				itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
				extractItemData: (e) => ({
					indentLevel: e[1].length,
					mainContent: e[4],
					checked: e[3].toLowerCase() === "x"
				}),
				createToken: (e, t) => ({
					type: "taskItem",
					raw: "",
					mainContent: e.mainContent,
					indentLevel: e.indentLevel,
					checked: e.checked,
					text: e.mainContent,
					tokens: n.inlineTokens(e.mainContent),
					nestedTokens: t
				}),
				customNestedParser: r
			}, n);
			if (i) return {
				type: "taskList",
				raw: i.raw,
				items: i.items
			};
		}
	},
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleTaskList: () => ({ commands: e }) => e.toggleList(this.name, this.options.itemTypeName) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-9": () => this.editor.commands.toggleTaskList() };
	}
});
Y.create({
	name: "listKit",
	addExtensions() {
		let e = [];
		return this.options.bulletList !== !1 && e.push(ux.configure(this.options.bulletList)), this.options.listItem !== !1 && e.push(Nx.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(Hx.configure(this.options.listKeymap)), this.options.orderedList !== !1 && e.push(cS.configure(this.options.orderedList)), this.options.taskItem !== !1 && e.push(fS.configure(this.options.taskItem)), this.options.taskList !== !1 && e.push(pS.configure(this.options.taskList)), e;
	}
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/extension-paragraph/dist/index.js
var mS = "&nbsp;", hS = "\xA0", gS = eh.create({
	name: "paragraph",
	priority: 1e3,
	addOptions() {
		return { HTMLAttributes: {} };
	},
	group: "block",
	content: "inline*",
	parseHTML() {
		return [{ tag: "p" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"p",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	parseMarkdown: (e, t) => {
		let n = e.tokens || [];
		if (n.length === 1 && n[0].type === "image") return t.parseChildren([n[0]]);
		let r = t.parseInline(n);
		return n.length === 1 && n[0].type === "text" && (n[0].raw === mS || n[0].text === mS || n[0].raw === hS || n[0].text === hS) && r.length === 1 && r[0].type === "text" && (r[0].text === mS || r[0].text === hS) ? t.createNode("paragraph", void 0, []) : t.createNode("paragraph", void 0, r);
	},
	renderMarkdown: (e, t, n) => {
		if (!e) return "";
		let r = Array.isArray(e.content) ? e.content : [];
		if (r.length === 0) {
			var i, a;
			let e = Array.isArray(n == null || (i = n.previousNode) == null ? void 0 : i.content) ? n.previousNode.content : [];
			return (n == null || (a = n.previousNode) == null ? void 0 : a.type) === "paragraph" && e.length === 0 ? mS : "";
		}
		return t.renderChildren(r);
	},
	addCommands() {
		return { setParagraph: () => ({ commands: e }) => e.setNode(this.name) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
	}
}), _S = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, vS = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, yS = wm.create({
	name: "strike",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "s" },
			{ tag: "del" },
			{ tag: "strike" },
			{
				style: "text-decoration",
				consuming: !1,
				getAttrs: (e) => e.includes("line-through") ? {} : !1
			}
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"s",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "del",
	parseMarkdown: (e, t) => t.applyMark("strike", t.parseInline(e.tokens || [])),
	renderMarkdown: (e, t) => `~~${t.renderChildren(e)}~~`,
	addCommands() {
		return {
			setStrike: () => ({ commands: e }) => e.setMark(this.name),
			toggleStrike: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetStrike: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-s": () => this.editor.commands.toggleStrike() };
	},
	addInputRules() {
		return [Jm({
			find: _S,
			type: this.type
		})];
	},
	addPasteRules() {
		return [nh({
			find: vS,
			type: this.type
		})];
	}
}), bS = eh.create({
	name: "text",
	group: "inline",
	parseMarkdown: (e) => ({
		type: "text",
		text: e.text || ""
	}),
	renderMarkdown: (e) => e.text || ""
}), xS = wm.create({
	name: "underline",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [{ tag: "u" }, {
			style: "text-decoration",
			consuming: !1,
			getAttrs: (e) => e.includes("underline") ? {} : !1
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"u",
			J(this.options.HTMLAttributes, e),
			0
		];
	},
	parseMarkdown(e, t) {
		return t.applyMark(this.name || "underline", t.parseInline(e.tokens || []));
	},
	renderMarkdown(e, t) {
		return `++${t.renderChildren(e)}++`;
	},
	markdownTokenizer: {
		name: "underline",
		level: "inline",
		start(e) {
			return e.indexOf("++");
		},
		tokenize(e, t, n) {
			let r = /^(\+\+)([\s\S]+?)(\+\+)/.exec(e);
			if (!r) return;
			let i = r[2].trim();
			return {
				type: "underline",
				raw: r[0],
				text: i,
				tokens: n.inlineTokens(i)
			};
		}
	},
	addCommands() {
		return {
			setUnderline: () => ({ commands: e }) => e.setMark(this.name),
			toggleUnderline: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetUnderline: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-u": () => this.editor.commands.toggleUnderline(),
			"Mod-U": () => this.editor.commands.toggleUnderline()
		};
	}
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-dropcursor/dist/index.js
function SS(e = {}) {
	return new R({ view(t) {
		return new CS(t, e);
	} });
}
var CS = class {
	constructor(e, t) {
		this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.lastDragEvent = null, this.width = t.width ?? 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = [
			"dragover",
			"dragend",
			"drop",
			"dragleave"
		].map((t) => {
			let n = (e) => {
				this[t](e);
			};
			return e.dom.addEventListener(t, n), {
				name: t,
				handler: n
			};
		});
	}
	destroy() {
		this.setCursor(null), this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
	}
	update(e, t) {
		if (this.cursorPos != null && t.doc != e.state.doc) {
			if (this.lastDragEvent) {
				let e = this.computeTarget(this.lastDragEvent);
				e == this.cursorPos ? this.updateOverlay() : this.setCursor(e);
			} else this.updateOverlay();
		}
	}
	setCursor(e) {
		e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
	}
	updateOverlay() {
		let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, n, r = this.editorView.dom, i = r.getBoundingClientRect(), a = i.width / r.offsetWidth, o = i.height / r.offsetHeight;
		if (t) {
			let t = e.nodeBefore, r = e.nodeAfter;
			if (t || r) {
				let e = this.editorView.nodeDOM(this.cursorPos - (t ? t.nodeSize : 0));
				if (e) {
					let i = e.getBoundingClientRect(), a = t ? i.bottom : i.top;
					t && r && (a = (a + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2);
					let s = this.width / 2 * o;
					n = {
						left: i.left,
						right: i.right,
						top: a - s,
						bottom: a + s
					};
				}
			}
		}
		if (!n) {
			let e = this.editorView.coordsAtPos(this.cursorPos), t = this.width / 2 * a;
			n = {
				left: e.left - t,
				right: e.left + t,
				top: e.top,
				bottom: e.bottom
			};
		}
		let s = this.editorView.dom.offsetParent;
		this.element || (this.element = s.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
		let c, l;
		if (!s || s == document.body && getComputedStyle(s).position == "static") c = -pageXOffset, l = -pageYOffset;
		else {
			let e = s.getBoundingClientRect(), t = e.width / s.offsetWidth, n = e.height / s.offsetHeight;
			c = e.left - s.scrollLeft * t, l = e.top - s.scrollTop * n;
		}
		this.element.style.left = (n.left - c) / a + "px", this.element.style.top = (n.top - l) / o + "px", this.element.style.width = (n.right - n.left) / a + "px", this.element.style.height = (n.bottom - n.top) / o + "px";
	}
	scheduleRemoval(e) {
		clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
	}
	computeTarget(e) {
		let t = this.editorView.posAtCoords({
			left: e.clientX,
			top: e.clientY
		}), n = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), r = n && n.type.spec.disableDropCursor, i = typeof r == "function" ? r(this.editorView, t, e) : r;
		if (!t || i) return null;
		let a = t.pos;
		if (this.editorView.dragging && this.editorView.dragging.slice) {
			let e = Br(this.editorView.state.doc, a, this.editorView.dragging.slice);
			e != null && (a = e);
		}
		return a;
	}
	dragover(e) {
		if (!this.editorView.editable) return;
		this.lastDragEvent = e;
		let t = this.computeTarget(e);
		t != null && (this.setCursor(t), this.scheduleRemoval(5e3));
	}
	dragend() {
		this.scheduleRemoval(20);
	}
	drop() {
		this.scheduleRemoval(20);
	}
	dragleave(e) {
		this.editorView.dom.contains(e.relatedTarget) || this.setCursor(null);
	}
}, wS = class e extends F {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : F.near(r);
	}
	content() {
		return N.empty;
	}
	eq(t) {
		return t instanceof e && t.head == this.head;
	}
	toJSON() {
		return {
			type: "gapcursor",
			pos: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for GapCursor.fromJSON");
		return new e(t.resolve(n.pos));
	}
	getBookmark() {
		return new TS(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !DS(e) || !OS(e)) return !1;
		let n = t.type.spec.allowGapCursor;
		if (n != null) return n;
		let r = t.contentMatchAt(e.index()).defaultType;
		return r && r.isTextblock;
	}
	static findGapCursorFrom(t, n, r = !1) {
		search: for (;;) {
			if (!r && e.valid(t)) return t;
			let i = t.pos, a = null;
			for (let r = t.depth;; r--) {
				let o = t.node(r);
				if (n > 0 ? t.indexAfter(r) < o.childCount : t.index(r) > 0) {
					a = o.child(n > 0 ? t.indexAfter(r) : t.index(r) - 1);
					break;
				}
				if (r == 0) return null;
				i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			for (;;) {
				let o = n > 0 ? a.firstChild : a.lastChild;
				if (!o) {
					if (a.isAtom && !a.isText && !L.isSelectable(a)) {
						t = t.doc.resolve(i + a.nodeSize * n), r = !1;
						continue search;
					}
					break;
				}
				a = o, i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			return null;
		}
	}
};
wS.prototype.visible = !1, wS.findFrom = wS.findGapCursorFrom, F.jsonID("gapcursor", wS);
var TS = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return wS.valid(t) ? new wS(t) : F.near(t);
	}
};
function ES(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function DS(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || ES(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function OS(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || ES(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function kS() {
	return new R({ props: {
		decorations: PS,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && wS.valid(n) ? new wS(n) : null;
		},
		handleClick: MS,
		handleKeyDown: AS,
		handleDOMEvents: { beforeinput: NS }
	} });
}
var AS = nu({
	ArrowLeft: jS("horiz", -1),
	ArrowRight: jS("horiz", 1),
	ArrowUp: jS("vert", -1),
	ArrowDown: jS("vert", 1)
});
function jS(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof I) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = wS.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new wS(c))), !0) : !1;
	};
}
function MS(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!wS.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && L.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new wS(r))), !0);
}
function NS(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof wS)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = j.empty;
	for (let e = r.length - 1; e >= 0; e--) i = j.from(r[e].createAndFill(null, i));
	let a = e.state.tr.replace(n.pos, n.pos, new N(i, 0, 0));
	return a.setSelection(I.near(a.doc.resolve(n.pos + 1))), e.dispatch(a), !1;
}
function PS(e) {
	if (!(e.selection instanceof wS)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", U.create(e.doc, [$c.widget(e.selection.head, t, { key: "gapcursor" })]);
}
Y.create({
	name: "characterCount",
	addOptions() {
		return {
			limit: null,
			autoTrim: !0,
			mode: "textSize",
			textCounter: (e) => e.length,
			wordCounter: (e) => e.split(" ").filter((e) => e !== "").length
		};
	},
	addStorage() {
		return {
			characters: () => 0,
			words: () => 0
		};
	},
	onBeforeCreate() {
		this.storage.characters = (e) => {
			let t = e?.node || this.editor.state.doc;
			if ((e?.mode || this.options.mode) === "textSize") {
				let e = t.textBetween(0, t.content.size, void 0, " ");
				return this.options.textCounter(e);
			}
			return t.nodeSize;
		}, this.storage.words = (e) => {
			let t = e?.node || this.editor.state.doc, n = t.textBetween(0, t.content.size, " ", " ");
			return this.options.wordCounter(n);
		};
	},
	addProseMirrorPlugins() {
		let e = !1;
		return [new R({
			key: new z("characterCount"),
			appendTransaction: (t, n, r) => {
				if (e) return;
				let i = this.options.limit, a = this.options.autoTrim;
				if (i == null || i === 0 || a === !1) {
					e = !0;
					return;
				}
				let o = this.storage.characters({ node: r.doc });
				if (o > i) {
					let t = o - i;
					console.warn(`[CharacterCount] Initial content exceeded limit of ${i} characters. Content was automatically trimmed.`);
					let n = r.tr.deleteRange(0, t);
					return e = !0, n;
				}
				e = !0;
			},
			filterTransaction: (e, t) => {
				let n = this.options.limit;
				if (!e.docChanged || n === 0 || n == null) return !0;
				let r = this.storage.characters({ node: t.doc }), i = this.storage.characters({ node: e.doc });
				if (i <= n || r > n && i > n && i <= r) return !0;
				if (r > n && i > n && i > r || !e.getMeta("paste")) return !1;
				let a = e.selection.$head.pos, o = a - (i - n), s = a;
				return e.deleteRange(o, s), !(this.storage.characters({ node: e.doc }) > n);
			}
		})];
	}
});
var FS = Y.create({
	name: "dropCursor",
	addOptions() {
		return {
			color: "currentColor",
			width: 1,
			class: void 0
		};
	},
	addProseMirrorPlugins() {
		return [SS(this.options)];
	}
}), IS = Y.create({
	name: "focus",
	addOptions() {
		return {
			className: "has-focus",
			mode: "all"
		};
	},
	addProseMirrorPlugins() {
		return [new R({
			key: new z("focus"),
			props: { decorations: ({ doc: e, selection: t }) => {
				let { isEditable: n, isFocused: r } = this.editor, { anchor: i } = t, a = [];
				if (!n || !r) return U.create(e, []);
				let o = 0;
				this.options.mode === "deepest" && e.descendants((e, t) => {
					if (!e.isText) {
						if (!(i >= t && i <= t + e.nodeSize - 1)) return !1;
						o += 1;
					}
				});
				let s = 0;
				return e.descendants((e, t) => {
					if (e.isText || !(i >= t && i <= t + e.nodeSize - 1)) return !1;
					if (s += 1, this.options.mode === "deepest" && o - s > 0 || this.options.mode === "shallowest" && s > 1) return this.options.mode === "deepest";
					a.push($c.node(t, t + e.nodeSize, { class: this.options.className }));
				}), U.create(e, a);
			} }
		})];
	}
}), LS = Y.create({
	name: "gapCursor",
	addProseMirrorPlugins() {
		return [kS()];
	},
	extendNodeSchema(e) {
		return { allowGapCursor: q(K(e, "allowGapCursor", {
			name: e.name,
			options: e.options,
			storage: e.storage
		})) ?? null };
	}
}), RS = "placeholder", zS = new z("tiptap__placeholder");
function BS(e) {
	let { editor: t, placeholder: n, dataAttribute: r, pos: i, node: a, isEmptyDoc: o, hasAnchor: s, classes: { emptyNode: c, emptyEditor: l } } = e, u = [c];
	return o && u.push(l), $c.node(i, i + a.nodeSize, {
		class: u.join(" "),
		[r]: typeof n == "function" ? n({
			editor: t,
			node: a,
			pos: i,
			hasAnchor: s
		}) : n
	});
}
function VS(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function HS({ editor: e, options: t, dataAttribute: n, doc: r, selection: i, from: a, to: o }) {
	let { anchor: s } = i, c = [], l = e.isEmpty;
	return r.nodesBetween(a, o, (r, i) => {
		let a = s >= i && s <= i + r.nodeSize, o = !r.isLeaf && Wf(r);
		return r.type.isTextblock && (a || !t.showOnlyCurrent) && o && c.push(BS({
			editor: e,
			isEmptyDoc: l,
			dataAttribute: n,
			hasAnchor: a,
			placeholder: t.placeholder,
			classes: {
				emptyEditor: t.emptyEditorClass,
				emptyNode: VS(t.emptyNodeClass, {
					editor: e,
					node: r,
					pos: i,
					hasAnchor: a
				})
			},
			node: r,
			pos: i
		})), t.includeChildren;
	}), c;
}
function US({ editor: e, options: t, dataAttribute: n, doc: r, selection: i }) {
	if (!e.isEditable && t.showOnlyWhenEditable) return null;
	let { anchor: a } = i, o = [], s = e.isEmpty;
	if (t.showOnlyCurrent && !t.includeChildren) {
		let i = r.resolve(a), c = i.depth > 0 ? i.node(1) : i.nodeAfter, l = i.depth > 0 ? i.before(1) : a;
		if (c && c.type.isTextblock && Wf(c)) {
			let r = a >= l && a <= l + c.nodeSize;
			o.push(BS({
				editor: e,
				isEmptyDoc: s,
				dataAttribute: n,
				hasAnchor: r,
				placeholder: t.placeholder,
				classes: {
					emptyEditor: t.emptyEditorClass,
					emptyNode: VS(t.emptyNodeClass, {
						editor: e,
						node: c,
						pos: l,
						hasAnchor: r
					})
				},
				node: c,
				pos: l
			}));
		}
	} else o.push(...HS({
		editor: e,
		options: t,
		dataAttribute: n,
		doc: r,
		selection: i,
		from: 0,
		to: r.content.size
	}));
	return U.create(r, o);
}
function WS(e, t) {
	let n = e.resolve(t);
	if (n.depth === 0) {
		let e = n.nodeAfter ?? n.nodeBefore;
		if (!e) return {
			from: t,
			to: t
		};
		let r = n.nodeAfter ? t : t - e.nodeSize;
		return {
			from: r,
			to: r + e.nodeSize
		};
	}
	let r = n.before(1);
	return {
		from: r,
		to: r + n.node(1).nodeSize
	};
}
function GS(e, t) {
	return {
		from: Math.max(0, t.from - 1),
		to: Math.min(e.content.size, t.to - 1)
	};
}
function KS(e, t, n) {
	let r = [];
	return e.forEach((e, i) => {
		let a = i, o = a + e.nodeSize, s = a + 1, c = o + 1;
		s < n && c > t && r.push({
			from: a,
			to: o
		});
	}), r;
}
function qS(e) {
	if (e.length === 0) return [];
	let t = [...e].sort((e, t) => e.from - t.from), n = [{ ...t[0] }];
	for (let e = 1; e < t.length; e += 1) {
		let r = n[n.length - 1], i = t[e];
		i.from <= r.to ? r.to = Math.max(r.to, i.to) : n.push({ ...i });
	}
	return n;
}
function JS(e, t) {
	let n = KS(e, t.from, t.to);
	return n.push(GS(e, WS(e, t.from))), t.to > t.from ? n.push(GS(e, WS(e, Math.min(t.to, e.content.size + 1) - 1))) : t.from < e.content.size + 1 && n.push(GS(e, WS(e, Math.min(t.from + 1, e.content.size)))), n;
}
function YS(e, t, n) {
	let r = [];
	if (e.docChanged) {
		let t = jf(e);
		for (let e of t) r.push(...JS(n.doc, e.newRange));
	}
	return e.selectionSet && (r.push(GS(n.doc, WS(n.doc, e.mapping.map(t.selection.anchor)))), r.push(GS(n.doc, WS(n.doc, n.selection.anchor)))), qS(r);
}
function XS(e, t, n) {
	let r = Math.max(0, Math.min(e, n.content.size));
	return {
		from: r,
		to: Math.max(r, Math.min(t, n.content.size))
	};
}
function ZS({ decorations: e, ranges: t, editor: n, options: r, dataAttribute: i, doc: a, selection: o }) {
	let s = e;
	for (let e of t) {
		let { from: t, to: c } = XS(e.from, e.to, a), l = s.find(t, c).filter((e) => e.from >= t && e.to <= c);
		l.length && (s = s.remove(l));
		let u = HS({
			editor: n,
			options: r,
			dataAttribute: i,
			doc: a,
			selection: o,
			from: t,
			to: c
		});
		u.length && (s = s.add(a, u));
	}
	return s;
}
function QS({ editor: e, options: t, dataAttribute: n }) {
	return {
		init(r, i) {
			return US({
				editor: e,
				options: t,
				dataAttribute: n,
				doc: i.doc,
				selection: i.selection
			}) ?? U.empty;
		},
		apply(r, i, a, o) {
			return !r.docChanged && !r.selectionSet ? i : ZS({
				decorations: i.map(r.mapping, r.doc),
				ranges: YS(r, a, o),
				editor: e,
				options: t,
				dataAttribute: n,
				doc: o.doc,
				selection: o.selection
			});
		}
	};
}
function $S(e) {
	return e.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
function eC({ editor: e, options: t }) {
	let n = t.dataAttribute ? `data-${$S(t.dataAttribute)}` : `data-${RS}`, r = t.showOnlyCurrent && !t.includeChildren;
	return new R({
		key: zS,
		...r ? {} : { state: QS({
			editor: e,
			options: t,
			dataAttribute: n
		}) },
		props: { decorations: r ? ({ doc: r, selection: i }) => US({
			editor: e,
			options: t,
			dataAttribute: n,
			doc: r,
			selection: i
		}) : (n) => t.showOnlyWhenEditable && !e.isEditable ? U.empty : zS.getState(n) ?? U.empty }
	});
}
var tC = Y.create({
	name: "placeholder",
	addOptions() {
		return {
			emptyEditorClass: "is-editor-empty",
			emptyNodeClass: "is-empty",
			dataAttribute: RS,
			placeholder: "Write something …",
			showOnlyWhenEditable: !0,
			showOnlyCurrent: !0,
			includeChildren: !1
		};
	},
	addProseMirrorPlugins() {
		return [eC({
			editor: this.editor,
			options: this.options
		})];
	}
});
function nC(e, t) {
	return !e.selection.empty && !Gf(e.selection) && t.isEditable;
}
function rC(e, t) {
	return nC(e, t) && !t.isFocused && !t.view.dragging;
}
function iC() {
	var e;
	(e = window.getSelection()) == null || e.removeAllRanges();
}
function aC(e) {
	e.focus();
}
Y.create({
	name: "selection",
	addOptions() {
		return { className: "selection" };
	},
	addProseMirrorPlugins() {
		let { editor: e, options: t } = this;
		return [new R({
			key: new z("selection"),
			props: {
				decorations(n) {
					return rC(n, e) ? U.create(n.doc, [$c.inline(n.selection.from, n.selection.to, { class: t.className })]) : null;
				},
				handleDOMEvents: {
					blur(t) {
						return nC(t.state, e) && iC(), !1;
					},
					focus(t) {
						return nC(t.state, e) && requestAnimationFrame(() => {
							!e.isDestroyed && t.hasFocus() && aC(t);
						}), !1;
					}
				}
			}
		})];
	}
});
function oC({ types: e, node: t }) {
	return t && Array.isArray(e) && e.includes(t.type) || t?.type === e;
}
var sC = Y.create({
	name: "trailingNode",
	addOptions() {
		return {
			node: void 0,
			notAfter: []
		};
	},
	addProseMirrorPlugins() {
		let e = new z(this.name), t = this.options.node || this.editor.schema.topNodeType.contentMatch.defaultType?.name || "paragraph", n = Object.entries(this.editor.schema.nodes).map(([, e]) => e).filter((e) => (this.options.notAfter || []).concat(t).includes(e.name));
		return [new R({
			key: e,
			appendTransaction: (n, r, i) => {
				let { doc: a, tr: o, schema: s } = i, c = e.getState(i), l = a.content.size, u = s.nodes[t];
				if (!n.some((e) => e.getMeta("skipTrailingNode")) && c) return o.insert(l, u.create());
			},
			state: {
				init: (e, t) => {
					let r = t.tr.doc.lastChild;
					return !oC({
						node: r,
						types: n
					});
				},
				apply: (e, t) => {
					if (!e.docChanged || e.getMeta("__uniqueIDTransaction")) return t;
					let r = e.doc.lastChild;
					return !oC({
						node: r,
						types: n
					});
				}
			}
		})];
	}
}), cC = Y.create({
	name: "undoRedo",
	addOptions() {
		return {
			depth: 100,
			newGroupDelay: 500
		};
	},
	addCommands() {
		return {
			undo: () => ({ state: e, dispatch: t }) => Tu(e, t),
			redo: () => ({ state: e, dispatch: t }) => Eu(e, t)
		};
	},
	addProseMirrorPlugins() {
		return [Cu(this.options)];
	},
	addKeyboardShortcuts() {
		return {
			"Mod-z": () => this.editor.commands.undo(),
			"Shift-Mod-z": () => this.editor.commands.redo(),
			"Mod-y": () => this.editor.commands.redo(),
			"Mod-я": () => this.editor.commands.undo(),
			"Shift-Mod-я": () => this.editor.commands.redo()
		};
	}
}), lC = Y.create({
	name: "starterKit",
	addExtensions() {
		let e = [];
		return this.options.bold !== !1 && e.push(vv.configure(this.options.bold)), this.options.blockquote !== !1 && e.push(pv.configure(this.options.blockquote)), this.options.bulletList !== !1 && e.push(ux.configure(this.options.bulletList)), this.options.code !== !1 && e.push(Sv.configure(this.options.code)), this.options.codeBlock !== !1 && e.push(Ev.configure(this.options.codeBlock)), this.options.document !== !1 && e.push(Dv.configure(this.options.document)), this.options.dropcursor !== !1 && e.push(FS.configure(this.options.dropcursor)), this.options.gapcursor !== !1 && e.push(LS.configure(this.options.gapcursor)), this.options.hardBreak !== !1 && e.push(Ov.configure(this.options.hardBreak)), this.options.heading !== !1 && e.push(kv.configure(this.options.heading)), this.options.undoRedo !== !1 && e.push(cC.configure(this.options.undoRedo)), this.options.horizontalRule !== !1 && e.push(Av.configure(this.options.horizontalRule)), this.options.italic !== !1 && e.push(Fv.configure(this.options.italic)), this.options.listItem !== !1 && e.push(Nx.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(Hx.configure(this.options?.listKeymap)), this.options.link !== !1 && e.push(ax.configure(this.options?.link)), this.options.orderedList !== !1 && e.push(cS.configure(this.options.orderedList)), this.options.paragraph !== !1 && e.push(gS.configure(this.options.paragraph)), this.options.strike !== !1 && e.push(yS.configure(this.options.strike)), this.options.text !== !1 && e.push(bS.configure(this.options.text)), this.options.underline !== !1 && e.push(xS.configure(this.options?.underline)), this.options.trailingNode !== !1 && e.push(sC.configure(this.options?.trailingNode)), e;
	}
}), uC = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/, dC = eh.create({
	name: "image",
	addOptions() {
		return {
			inline: !1,
			allowBase64: !1,
			HTMLAttributes: {},
			resize: !1
		};
	},
	inline() {
		return this.options.inline;
	},
	group() {
		return this.options.inline ? "inline" : "block";
	},
	draggable: !0,
	addAttributes() {
		return {
			src: { default: null },
			alt: { default: null },
			title: { default: null },
			width: { default: null },
			height: { default: null }
		};
	},
	parseHTML() {
		return [{ tag: this.options.allowBase64 ? "img[src]" : "img[src]:not([src^=\"data:\"])" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["img", J(this.options.HTMLAttributes, e)];
	},
	parseMarkdown: (e, t) => t.createNode("image", {
		src: e.href,
		title: e.title,
		alt: e.text
	}),
	renderMarkdown: (e) => {
		let t = e.attrs?.src ?? "", n = e.attrs?.alt ?? "", r = e.attrs?.title ?? "";
		return r ? `![${n}](${t} "${r}")` : `![${n}](${t})`;
	},
	addNodeView() {
		if (!this.options.resize || !this.options.resize.enabled || typeof document > "u") return null;
		let { directions: e, minWidth: t, minHeight: n, alwaysPreserveAspectRatio: r } = this.options.resize, i = /* @__PURE__ */ new Set([
			"src",
			"width",
			"height"
		]);
		return ({ node: a, getPos: o, HTMLAttributes: s, editor: c }) => {
			let l = document.createElement("img");
			l.draggable = !1;
			let u = J(this.options.HTMLAttributes, s);
			Object.entries(u).forEach(([e, t]) => {
				if (t != null) switch (e) {
					case "src":
					case "width":
					case "height": break;
					default: l.setAttribute(e, t);
				}
			}), u.src !== null && (l.src = u.src);
			let d = { ...s }, f = (e) => {
				typeof e == "string" && e !== "" ? l.getAttribute("src") !== e && (l.src = e) : (l.hasAttribute("src") && l.removeAttribute("src"), l.src !== "" && (l.src = ""));
			};
			f(s.src);
			let p = new $m({
				element: l,
				editor: c,
				node: a,
				getPos: o,
				onResize: (e, t) => {
					l.style.width = `${e}px`, l.style.height = `${t}px`;
				},
				onCommit: (e, t) => {
					let n = o();
					n !== void 0 && this.editor.chain().setNodeSelection(n).updateAttributes(this.name, {
						width: e,
						height: t
					}).run();
				},
				onUpdate: (e) => {
					if (e.type !== a.type) return !1;
					let t = hf(e, c.extensionManager.attributes.filter((t) => t.type === e.type.name));
					return Object.keys(d).forEach((e) => {
						!i.has(e) && !(e in t) && l.removeAttribute(e);
					}), Object.entries(t).forEach(([e, t]) => {
						i.has(e) || (t == null ? l.removeAttribute(e) : l.setAttribute(e, t));
					}), f(t.src), d = t, !0;
				},
				options: {
					directions: e,
					min: {
						width: t,
						height: n
					},
					preserveAspectRatio: r === !0
				}
			}), m = p.dom, h = () => {
				m.style.visibility = "", m.style.pointerEvents = "";
			};
			return m.style.visibility = "hidden", m.style.pointerEvents = "none", l.complete && l.naturalWidth > 0 ? h() : (l.onload = h, l.onerror = h), p;
		};
	},
	addCommands() {
		return { setImage: (e) => ({ commands: t }) => t.insertContent({
			type: this.name,
			attrs: e
		}) };
	},
	addInputRules() {
		return [Ym({
			find: uC,
			type: this.type,
			getAttributes: (e) => {
				let [, , t, n, r] = e;
				return {
					src: n,
					alt: t,
					title: r
				};
			}
		})];
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useImageDrag.svelte.ts
function fC({ getButtonElement: e, getPos: t, dragState: n, getIsPlaceholder: r, getNodeAttrs: i, handleInteraction: a }) {
	let o = rt();
	function s() {
		n.isDragging = !0, ct("start", {}, t), n.preview = ft(n.startTarget, n.startPos.x, n.startPos.y, r());
	}
	function c() {
		n.longPressTimeout &&= (clearTimeout(n.longPressTimeout), null), n.startTarget = null;
	}
	function l(e, t, r) {
		c(), n.startPos = {
			x: t,
			y: r
		}, n.startTarget = e, n.longPressTimeout = setTimeout(() => {
			s();
		}, 400);
	}
	function u(e) {
		if (e.touches.length !== 1) return;
		st();
		let t = we(e);
		l(e.currentTarget, t.x, t.y);
	}
	function d(e) {
		if (e.touches.length !== 1) {
			c();
			return;
		}
		let r = we(e);
		!n.isDragging && n.longPressTimeout && ut(r.x, r.y, n.startPos.x, n.startPos.y, 10) ? c() : n.isDragging && (e.preventDefault(), ot(n.preview, r.x, r.y), dt(r.x, r.y), ct("move", {
			touchX: r.x,
			touchY: r.y,
			nodePos: t()
		}));
	}
	function f(e) {
		if (n.longPressTimeout && (c(), !n.isDragging)) {
			a(e, !0);
			return;
		}
		if (!n.isDragging) return;
		e.preventDefault();
		let r = we(e), o = document.elementFromPoint(r.x, r.y);
		if (o) {
			let e = o.closest(".drop-zone-indicator")?.getAttribute("data-drop-pos"), n = i();
			ct("end", {
				nodeData: {
					type: "image",
					attrs: n,
					pos: t()
				},
				dropX: r.x,
				dropY: r.y,
				target: o,
				dropPosition: e ? parseInt(e, 10) : null
			});
		}
		n.isDragging = !1, lt(n.preview), n.preview = null;
	}
	ie(() => {
		let t = e();
		if (o && t) return t.addEventListener("touchstart", u, { passive: !1 }), t.addEventListener("touchmove", d, { passive: !1 }), t.addEventListener("touchend", f, { passive: !1 }), () => {
			t.removeEventListener("touchstart", u), t.removeEventListener("touchmove", d), t.removeEventListener("touchend", f), c(), lt(n.preview), n.preview = null;
		};
	});
	function p() {
		c(), lt(n.preview);
	}
	return { cleanup: p };
}
// D:/ドキュメント/GitHub/ehagaki/src/components/SvelteImageNode.svelte
var pC = o("<img draggable=\"false\"/>"), mC = o("<div class=\"image-node-container svelte-xptkcy\"><button type=\"button\" tabindex=\"0\"><!> <!></button> <!></div>"), hC = {
	hash: "svelte-xptkcy",
	code: "\n    /* ProseMirrorが生成する外側のラッパーも制御 */.node-image {display:block;width:fit-content;max-width:100%;max-height:240px;line-height:0;margin:10px 0;}\n\n    /* NodeViewWrapperが生成するdata-node-view-wrapperを縦並び用に調整 */.node-image[data-node-view-wrapper] {display:block;margin:0;padding:0;}\n\n    /* 画像ノードコンテナ */.image-node-container.svelte-xptkcy {position:relative;display:inline-block;max-width:100%;max-height:240px;\n\n        /* ボタンを画像サイズに完全に合わせる */button.editor-image-button:where(.svelte-xptkcy) {background:none;border:none;padding:0;margin:0;cursor:grab;display:inline;position:relative;touch-action:pan-y; /* 垂直スクロールを許可し、水平ドラッグはJavaScriptで制御 */-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;max-width:100%;max-height:240px;line-height:0;vertical-align:top;pointer-events:auto;outline:none;-webkit-tap-highlight-color:transparent;&:focus {outline:none;}&:active {scale:1;}\n            @media (hover: hover) and (pointer: fine) {&:hover {background:none;}\n            }}}\n\n    /* Focus extensionが付与するクラスで選択状態を表現 */.node-image.is-node-focused .editor-image {outline:2px solid var(--theme, #2196f3);outline-offset:-1px;}\n\n    /* ドラッグ状態での追加スタイル */.editor-image-button[data-dragging=\"true\"].svelte-xptkcy .editor-image:where(.svelte-xptkcy) {opacity:0.3;scale:0.95;transition:all 0.2s ease;}\n\n    /* 画像要素 */img.editor-image.svelte-xptkcy {display:block;max-width:100%;max-height:240px;min-width:100px;min-height:100px;object-fit:cover;width:auto;border:1px solid var(--border);border-radius:6px;cursor:pointer;outline:none;transition:opacity 0.2s ease;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;&.image-loading {opacity:0;transition:opacity 0.3s ease;}&:not(.image-loading) {opacity:1;}}\n\n    /* プレースホルダー状態のボタン */.editor-image-button.is-placeholder.svelte-xptkcy {display:flex;align-items:center;justify-content:center;min-width:100px;min-height:100px;max-width:100%;border:1px solid var(--border);border-radius:6px;background:var(--bg-input);cursor:default;}\n\n    /* 画像読み込み中（プレースホルダー表示中）はレイアウトに影響させない */.editor-image-button.is-placeholder.svelte-xptkcy img.editor-image.image-loading:where(.svelte-xptkcy) {position:absolute;opacity:0;}\n\n    /* タッチデバイス用 */\n    @media (hover: none) {.editor-image-button.svelte-xptkcy {cursor:default;}.editor-image-button.svelte-xptkcy:active {cursor:default;}\n    }\n\n    /* 改善されたドロップゾーンスタイル（シンプルなバーのみ） */.drop-zone-indicator {min-height:0;margin:0;border-radius:3px;opacity:1;position:relative;z-index:1000;cursor:pointer;display:flex;align-items:center;justify-content:center;width:100%;height:fit-content;padding:10px 0;background:none;border:none;box-shadow:none;}.drop-zone-bar {width:90%;max-width:260px;height:6px;border-radius:9999px;background:dodgerblue;margin:0 auto;}.drop-zone-hover .drop-zone-bar {background:var(--yellow);outline:2px solid var(--yellow);}\n\n    /* ドラッグプレビュー用のクラス */.drag-preview {position:fixed;pointer-events:none;z-index:9999;transform-origin:center center;transition:transform 120ms ease,\n            opacity 120ms ease;border-radius:6px;box-shadow:0 4px 16px rgba(0, 0, 0, 0.12);background:white;}"
};
function gC(e, n) {
	fe(n, !0), te(e, hC);
	let a = () => oe(ve, "$_", o), [o, s] = re(), c = ow, l = sw, f = w(void 0), m = xg(), h = rt(), C = A(() => pt(n.node.attrs)), ee = A(() => !x(C) && !!n.node.attrs.src), T = A(() => x(C) || x(ee) && !m.isLoaded), E = w(null), D = A(() => n.node.attrs.alt ? n.node.attrs.alt : a()("imageNode.default_alt")), ne = A(() => x(E)?.displayWidth ?? 240), ae = A(() => x(E)?.displayHeight ?? 160);
	ie(() => {
		let e = n.node.attrs.src;
		if (!e) return;
		let t = Oe.value[e];
		if (t) {
			O(E, t, !0);
			return;
		}
		let r = at(n.node.attrs.dim);
		if (r) {
			let t = mt(r.width, r.height);
			O(E, t, !0), Oe.update((n) => ({
				...n,
				[e]: t
			}));
		}
	});
	function ce(e, t = !1) {
		it(e, t, c.isDragging, x(C), n.selected, l.justSelected, n.node.attrs.src, x(D), n.node.attrs.id, n.getPos) && !n.selected && (l.justSelectedTimeout && clearTimeout(l.justSelectedTimeout), l.justSelected = !0, l.justSelectedTimeout = setTimeout(() => {
			l.justSelected = !1, l.justSelectedTimeout = null;
		}, 400));
	}
	let { cleanup: le } = fC({
		getButtonElement: () => x(f),
		getPos: () => n.getPos(),
		dragState: c,
		getIsPlaceholder: () => x(C),
		getNodeAttrs: () => n.node.attrs,
		handleInteraction: ce
	});
	function ue(e) {
		ce(e, !1);
	}
	function pe(e, t) {
		if (e === "start") {
			let e = t;
			if (!e?.dataTransfer && !h) return;
			if (h) {
				t?.preventDefault();
				return;
			}
			e?.dataTransfer && (e.dataTransfer.setData("application/x-tiptap-node", JSON.stringify({
				type: "image",
				attrs: n.node.attrs,
				pos: n.getPos()
			})), e.dataTransfer.effectAllowed = "move"), c.isDragging = !0, ct("start");
		} else c.isDragging = !1, lt(c.preview), ct("end");
	}
	function me(e) {
		e.preventDefault();
	}
	se(() => {
		le(), l.justSelectedTimeout && clearTimeout(l.justSelectedTimeout), Object.assign(ow, {
			isDragging: !1,
			longPressTimeout: null,
			startTarget: null,
			preview: null
		}), Object.assign(sw, {
			justSelected: !1,
			justSelectedTimeout: null
		});
	}), hg(e, {
		children: (e, i) => {
			var o = mC(), s = y(o);
			let l;
			var C = y(s), w = (e) => {
				{
					let t = A(() => a()("imageNode.uploading"));
					ye(e, {
						get text() {
							return x(t);
						},
						showLoader: !0
					});
				}
			};
			d(C, (e) => {
				x(T) && e(w);
			});
			var E = b(C, 2), te = (e) => {
				var t = pC();
				let r;
				v(() => {
					k(t, "src", n.node?.attrs?.src), k(t, "alt", x(D)), r = de(t, 1, "editor-image svelte-xptkcy", null, r, { "image-loading": !m.isLoaded });
				}), g("load", t, function(...e) {
					m.handleLoad?.apply(this, e);
				}), g("error", t, function(...e) {
					m.handleError?.apply(this, e);
				}), _("contextmenu", t, me), u(t), p(e, t);
			};
			d(E, (e) => {
				x(ee) && e(te);
			}), t(s), S(s, (e) => O(f, e), () => x(f));
			var re = b(s, 2), ie = (e) => {
				{
					let t = A(() => a()("imageContextMenu.delete")), r = A(() => a()("imageContextMenu.copyUrl")), i = A(() => a()("imageContextMenu.copySuccess"));
					bg(e, {
						get src() {
							return n.node.attrs.src;
						},
						get onDelete() {
							return n.deleteNode;
						},
						get deleteAriaLabel() {
							return x(t);
						},
						get copyAriaLabel() {
							return x(r);
						},
						get copySuccessMessage() {
							return x(i);
						},
						layout: "editor-image"
					});
				}
			};
			d(re, (e) => {
				x(T) || e(ie);
			}), t(o), v(() => {
				l = de(s, 1, "editor-image-button svelte-xptkcy", null, l, { "is-placeholder": x(T) }), r(s, x(T) ? `width: ${x(ne)}px; aspect-ratio: ${x(ne)} / ${x(ae)};` : void 0), k(s, "data-dragging", c.isDragging), k(s, "aria-label", x(D)), k(s, "draggable", !h);
			}), _("click", s, ue), g("dragstart", s, (e) => pe("start", e)), g("dragend", s, () => pe("end")), g("dragover", s, function(...e) {
				(h ? (e) => e.preventDefault() : void 0)?.apply(this, e);
			}), g("drop", s, function(...e) {
				(h ? (e) => e.preventDefault() : void 0)?.apply(this, e);
			}), p(e, o);
		},
		$$slots: { default: !0 }
	}), i(), s();
}
s(["click", "contextmenu"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/uniqueIdExtension.ts
function _C() {
	if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
	if (globalThis.crypto?.getRandomValues) {
		let e = globalThis.crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
		e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
		let t = [...e].map((e) => e.toString(16).padStart(2, "0"));
		return `${t.slice(0, 4).join("")}-${t.slice(4, 6).join("")}-${t.slice(6, 8).join("")}-${t.slice(8, 10).join("")}-${t.slice(10).join("")}`;
	}
	return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function vC(e, t) {
	if (e !== "all") return e;
	let { nodeExtensions: n } = lf(t);
	return n.map((e) => e.name).filter((e) => e !== "doc" && e !== "text");
}
function yC(e) {
	return e == null || e === "";
}
var bC = Y.create({
	name: "uniqueID",
	priority: 1e4,
	addOptions() {
		return {
			attributeName: "id",
			types: [],
			generateID: () => _C(),
			filterTransaction: null,
			updateDocument: !0
		};
	},
	addGlobalAttributes() {
		return [{
			types: vC(this.options.types, this.extensions),
			attributes: { [this.options.attributeName]: {
				default: null,
				parseHTML: (e) => e.getAttribute(`data-${this.options.attributeName}`),
				renderHTML: (e) => {
					let t = e[this.options.attributeName];
					return yC(t) ? {} : { [`data-${this.options.attributeName}`]: t };
				}
			} }
		}];
	},
	onCreate() {
		if (!this.options.updateDocument) return;
		let { state: e, view: t } = this.editor, n = vC(this.options.types, this.editor.extensionManager.extensions), { attributeName: r, generateID: i } = this.options, a = /* @__PURE__ */ new Set(), o = e.tr;
		Jd(e.doc, (e) => n.includes(e.type.name)).forEach(({ node: e, pos: t }) => {
			let n = e.attrs[r];
			if (yC(n) || a.has(n)) {
				let n = i({
					node: e,
					pos: t
				});
				o.setNodeMarkup(t, void 0, {
					...e.attrs,
					[r]: n
				}), a.add(n);
			} else a.add(n);
		}), o.steps.length && (o.setMeta("addToHistory", !1), t.dispatch(o));
	},
	addProseMirrorPlugins() {
		if (!this.options.updateDocument) return [];
		let e = vC(this.options.types, this.editor.extensionManager.extensions);
		return [new R({
			key: new z("uniqueID"),
			appendTransaction: (t, n, r) => {
				let i = t.some((e) => e.docChanged), a = t.some((e) => e.getMeta("__uniqueIDTransaction")), o = this.options.filterTransaction ? t.some((e) => !this.options.filterTransaction?.(e)) : !1;
				if (!i || a || o || n.doc.eq(r.doc)) return;
				let { attributeName: s, generateID: c } = this.options, l = /* @__PURE__ */ new Set(), u = r.tr;
				if (Jd(r.doc, (t) => e.includes(t.type.name)).forEach(({ node: e, pos: t }) => {
					let n = u.doc.nodeAt(t)?.attrs[s];
					if (yC(n) || l.has(n)) {
						let n = c({
							node: e,
							pos: t
						});
						u.setNodeMarkup(t, void 0, {
							...e.attrs,
							[s]: n
						}), l.add(n);
					} else l.add(n);
				}), u.steps.length) return u.setStoredMarks(r.tr.storedMarks), u.setMeta("__uniqueIDTransaction", !0), u.setMeta("addToHistory", !1), u;
			}
		})];
	}
}), xC = new z("editorInputGuard"), SC = Y.create({
	name: "editorInputGuard",
	addOptions: () => ({
		isInputBlocked: () => !1,
		compositionController: void 0,
		isCompositionInputAllowed: () => !1
	}),
	addProseMirrorPlugins() {
		let e = this.options.compositionController;
		return [new R({
			key: xC,
			state: {
				init: () => ({ idsByGeneration: /* @__PURE__ */ new Map() }),
				apply: (t, n) => {
					let r = t.getMeta("composition");
					return r === void 0 || !e ? n : { idsByGeneration: /* @__PURE__ */ new Map([[e.getCurrentGeneration(), r]]) };
				}
			},
			filterTransaction: (t, n) => {
				if (!t.docChanged || !this.options.isInputBlocked()) return !0;
				if (e) {
					let r = e.decideTransaction({
						transaction: t,
						observerState: xC.getState(n) ?? { idsByGeneration: /* @__PURE__ */ new Map() }
					});
					if (r !== "default") return r === "allow";
				}
				return !!(this.options.isCompositionInputAllowed?.() && t.getMeta("composition") !== void 0);
			}
		})];
	}
}), CC = new z("reactionInput");
function wC(e) {
	return CC.getState(e.state) === !0;
}
var TC = Y.create({
	name: "reactionInput",
	addOptions: () => ({
		isActive: () => !1,
		getInputMode: () => "singleValue"
	}),
	addProseMirrorPlugins() {
		let e = null, t;
		return [new R({
			key: CC,
			state: {
				init: () => !1,
				apply: (e, t) => e.getMeta(CC)?.composing ?? t
			},
			filterTransaction: (e, t) => !e.docChanged || !this.options.isActive() || e.getMeta(CC)?.rollback || Du(e) || CC.getState(t) ? !0 : vt(t.doc, e.doc, this.options.getInputMode()),
			view: (n) => {
				let r = n.dom.ownerDocument.defaultView, i = () => {
					this.options.isActive() && (t !== void 0 && r.cancelAnimationFrame(t), e = {
						doc: n.state.doc,
						selection: n.state.selection
					}, n.dispatch(n.state.tr.setMeta(CC, { composing: !0 }).setMeta("addToHistory", !1)));
				}, a = () => {
					e && (t = r.requestAnimationFrame(() => {
						t = void 0;
						let r = e;
						e = null;
						let i = n.state.tr.setMeta(CC, {
							composing: !1,
							rollback: !0
						}).setMeta("addToHistory", !1);
						r && this.options.isActive() && !vt(r.doc, n.state.doc, this.options.getInputMode()) && (i.replaceWith(0, i.doc.content.size, r.doc.content), i.setSelection(F.fromJSON(i.doc, r.selection.toJSON()))), n.dispatch(i);
					}));
				};
				return n.dom.addEventListener("compositionstart", i, !0), n.dom.addEventListener("compositionend", a, !0), { destroy() {
					n.dom.removeEventListener("compositionstart", i, !0), n.dom.removeEventListener("compositionend", a, !0), t !== void 0 && r.cancelAnimationFrame(t), e = null;
				} };
			}
		})];
	}
}), EC = /* @__PURE__ */ new Set([
	"image",
	"video",
	"customEmoji"
]), DC = ".node-image.is-node-focused, .node-video.is-node-focused, .custom-emoji-wrapper.is-node-focused", OC = ".custom-emoji-picker", kC = Y.create({
	name: "shiftEnterToParagraph",
	addKeyboardShortcuts() {
		return { "Shift-Enter": () => this.editor.commands.splitBlock() };
	}
}), AC = [{ modifiers: ["ctrl"] }, { modifiers: ["meta"] }];
function jC(e, t) {
	let n = t.includes("ctrlOrMeta");
	return !((n ? e.ctrlKey === e.metaKey : e.ctrlKey !== t.includes("ctrl")) || !n && e.metaKey !== t.includes("meta") || e.altKey !== t.includes("alt") || e.shiftKey !== t.includes("shift"));
}
var MC = Y.create({
	name: "gapCursorFocusReset",
	onSelectionUpdate() {
		let { state: e, view: t } = this.editor, n = e.selection, r = (e) => {
			t.dom.querySelectorAll(DC).forEach((t) => {
				e && t === e || t.classList.remove("is-node-focused");
			});
		};
		if (n instanceof L && EC.has(n.node.type.name)) {
			let e = t.nodeDOM(n.from), i = e?.matches(".node-image, .node-video") ? e : e?.closest(".node-image, .node-video");
			if (i) {
				r(i), i.classList.add("is-node-focused");
				return;
			}
		}
		n instanceof wS, r();
	},
	onCreate() {
		let e = (e) => {
			let { view: t } = this.editor, n = e.target;
			if (t.dom.contains(n) || n.closest(OC)) return;
			t.dom.querySelectorAll(DC).forEach((e) => {
				e.classList.remove("is-node-focused");
			});
			let { state: r } = t, { selection: i } = r;
			if (i instanceof L && EC.has(i.node.type.name)) {
				let e = r.doc.content.size, n = r.doc.resolve(e), i = r.tr.setSelection(I.near(n)).setMeta("addToHistory", !1);
				t.dispatch(i);
			}
		};
		document.addEventListener("mousedown", e), document.addEventListener("touchstart", e), this.editor.__outsideClickHandler = e;
	},
	onDestroy() {
		let e = this.editor, t = e.__outsideClickHandler;
		t && (document.removeEventListener("mousedown", t), document.removeEventListener("touchstart", t), delete e.__outsideClickHandler);
	}
});
function NC(e) {
	let { placeholderText: t, onSubmitPost: n, onCustomEmojiSelect: r, getCustomEmojiItems: i, enterKeyBehavior: a = "newline", hostOwnedLite: o = !1, submitShortcuts: s, onUpdate: c, onCreate: l, onDestroy: u } = e, d = { text: t }, f = () => e.getReactionInputMode?.() === "uploadedShortcode" ? [] : (i ?? F_.options.getItems)();
	return og({
		extensions: [
			...e.isReactionMode ? [TC.configure({
				isActive: e.isReactionMode,
				...e.getReactionInputMode ? { getInputMode: e.getReactionInputMode } : {}
			})] : [],
			...!o && e.isInputBlocked ? [SC.configure({
				isInputBlocked: e.isInputBlocked,
				isCompositionInputAllowed: e.isCompositionInputAllowed,
				compositionController: e.compositionController
			})] : [],
			lC.configure({
				paragraph: { HTMLAttributes: { class: "editor-paragraph" } },
				undoRedo: {
					depth: 100,
					newGroupDelay: 500
				},
				dropcursor: {
					color: "dodgerblue",
					width: 5,
					class: "tiptap-dropcursor"
				},
				heading: !1,
				blockquote: !1,
				bold: !1,
				italic: !1,
				strike: !1,
				code: !1,
				codeBlock: !1,
				bulletList: !1,
				orderedList: !1,
				listItem: !1,
				horizontalRule: !1,
				hardBreak: !1,
				link: !1
			}),
			ox.extend({ renderHTML({ mark: e, HTMLAttributes: t }) {
				return [
					"a",
					{
						...t,
						href: e.attrs.href
					},
					0
				];
			} }).configure({
				HTMLAttributes: {
					class: "preview-link",
					rel: null,
					target: "_blank"
				},
				autolink: !1,
				linkOnPaste: !1,
				defaultProtocol: "https",
				isAllowedUri: (e, t) => {
					if (!t.defaultValidate(e) || e.startsWith("./") || e.startsWith("../")) return !1;
					try {
						let n = new URL(e, `${t.defaultProtocol}://`);
						return t.protocols.includes(n.protocol.replace(":", ""));
					} catch {
						return !1;
					}
				},
				shouldAutoLink: (e) => {
					if (e.length < 8) return !1;
					try {
						return new URL(e).hostname.length > 0 && /^https?:\/\/[a-zA-Z0-9]/.test(e);
					} catch {
						return !1;
					}
				},
				protocols: [{
					scheme: "http",
					optionalSlashes: !1
				}, {
					scheme: "https",
					optionalSlashes: !1
				}]
			}),
			dC.configure({
				HTMLAttributes: { class: "editor-image" },
				allowBase64: !1
			}).extend({
				parseHTML() {
					return [{ tag: "img[src]:not([src^=\"data:\"]):not([data-custom-emoji]):not(.custom-emoji-inline[alt])" }];
				},
				addAttributes() {
					return {
						src: { default: null },
						blurhash: { default: null },
						isPlaceholder: { default: null },
						dim: { default: null },
						size: { default: null },
						uploadProtocol: { default: null },
						alt: { default: null },
						m: { default: null },
						ox: { default: null },
						x: { default: null }
					};
				},
				addNodeView() {
					return dg(gC);
				}
			}),
			bC.configure({
				types: ["image", "video"],
				attributeName: "id"
			}),
			IS.configure({
				className: "is-node-focused",
				mode: "all"
			}),
			MC,
			kC,
			Rh.configure({ isMediaConversionDisabled: e.isReactionMode }),
			x_,
			Dg,
			F_.configure({ getItems: f }),
			$_.configure({
				onSelectEmoji: r,
				getItems: f
			}),
			rv,
			Ig,
			Wh.configure({ isMediaConversionDisabled: e.isReactionMode }),
			rg,
			W_,
			ig,
			zg,
			tC.configure({
				placeholder: () => d.text,
				emptyEditorClass: "is-editor-empty",
				showOnlyWhenEditable: !0,
				showOnlyCurrent: !0,
				includeChildren: !1
			})
		],
		enablePasteRules: ["clipboardExtension", "customEmoji"],
		content: {
			type: "doc",
			content: [{ type: "paragraph" }]
		},
		editorProps: {
			attributes: {
				class: "tiptap-editor",
				...a === "submit" ? { enterkeyhint: "send" } : {}
			},
			handleClickOn(e, t, n, r, i, a) {
				let o = i.target;
				for (; o && o !== e.dom;) {
					if (o.tagName === "A" && o.hasAttribute("href")) return i.ctrlKey || i.metaKey ? !1 : (i.preventDefault(), !0);
					o = o.parentElement;
				}
				return !1;
			},
			handleKeyDown: (e, t) => {
				if (o) {
					if (t.key !== "Enter" && t.key !== "NumpadEnter" || t.isComposing || t.keyCode === 229 || e.composing) return !1;
					let r = (s === void 0 ? AC : s).find((e) => jC(t, e.modifiers));
					return r ? (t.preventDefault(), r.id === void 0 ? n() : n({ shortcutId: r.id }), !0) : t.ctrlKey || t.metaKey || t.altKey || t.shiftKey ? !1 : a === "submit" && (t.preventDefault(), n(), !0);
				}
				return (t.ctrlKey || t.metaKey) && (t.key === "Enter" || t.key === "NumpadEnter") ? (t.preventDefault(), n(), !0) : !1;
			}
		},
		onCreate({ editor: e }) {
			e.__placeholderState = d, window.__currentEditor = e, l?.(e);
		},
		onUpdate() {
			c?.();
		},
		onDestroy() {
			delete window.__currentEditor, u?.();
		}
	});
}
function PC(e, t) {
	if (!e) return;
	let n = e, r = Array.from(e.view.dom.querySelectorAll("[data-placeholder]")), i = r.some((e) => e.getAttribute("data-placeholder") !== t);
	if (n.__placeholderState?.text === t && !i) return;
	n.__placeholderState && (n.__placeholderState.text = t);
	let a = e.extensionManager.extensions.find((e) => e.name === "placeholder");
	a && a.options && (a.options.placeholder = n.__placeholderState ? () => n.__placeholderState?.text ?? t : t, r.forEach((e) => {
		e.setAttribute("data-placeholder", t);
	}), e.view.dispatch(e.state.tr.setMeta("addToHistory", !1)));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadResultUtils.ts
function FC(e, t, n) {
	if (e.length === 0) return "";
	if (e.length === 1) {
		let r = e[0].errorCode;
		return r ? n?.(r) || e[0].error || t : e[0].error || t;
	}
	return `${e.length}個のファイルのアップロードに失敗しました`;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/placeholderManager.ts
function IC(e, t) {
	let n, r = -1;
	return t.sizeInfo?.originalFilename && (r = e.findIndex((e) => e.file.name === t.sizeInfo.originalFilename), r !== -1 && (n = e[r])), !n && e.length > 0 && (n = e[0], r = 0), {
		matched: n,
		matchedIndex: r
	};
}
function LC(e) {
	return FC(e, "postComponent.upload_failed");
}
function RC(e, t, n, r) {
	e.update((e) => {
		let i = { ...e };
		return delete i[t], n && r && (i[n] = r), i;
	});
}
function zC(e, t) {
	return {
		onAborted: e,
		onFailure: e,
		onRemaining: e,
		onSuccess: t
	};
}
function BC(e, t) {
	De.removeItem(e), RC(t, e);
}
function VC(e) {
	return {
		mFromServer: typeof e.m == "string" ? e.m : void 0,
		altFromServer: typeof e.alt == "string" ? e.alt : void 0,
		serverBlurhash: typeof e.blurhash == "string" ? e.blurhash : typeof e.b == "string" ? e.b : void 0,
		oxFromServer: typeof e.ox == "string" ? e.ox : typeof e.o == "string" ? e.o : void 0,
		xFromServer: typeof e.x == "string" ? e.x : void 0,
		dimFromServer: typeof e.dim == "string" ? e.dim : void 0,
		sizeFromServer: typeof e.size == "number" || typeof e.size == "string" ? e.size : void 0
	};
}
function HC(e) {
	if (typeof e == "number" && Number.isFinite(e) && e > 0) return e;
	if (typeof e == "string") {
		let t = Number(e);
		if (Number.isFinite(t) && t > 0) return t;
	}
}
function UC(e, t, n) {
	if (e.dimensions) return e.dimensions;
	let r = at(t);
	return r ? mt(r.width, r.height) : n.dimensions;
}
function WC(e, t) {
	let { mFromServer: n, altFromServer: r, serverBlurhash: i, oxFromServer: a, xFromServer: o, dimFromServer: s, sizeFromServer: c } = VC(e.nip94 || {}), l = UC(e, s, t), u = e.hostOwnedMedia === !0;
	return {
		mimeType: u ? n ?? t.file.type : void 0,
		alt: u ? r : void 0,
		serverBlurhash: i,
		oxFromServer: a,
		xFromServer: o,
		blurhash: i ?? t.blurhash,
		ox: e.uploadProtocol === "blossom" ? void 0 : a ?? t.ox,
		dim: s ?? (l ? `${l.width}x${l.height}` : void 0),
		dimensions: l,
		size: HC(c) ?? e.sizeInfo?.compressedSize,
		uploadProtocol: e.uploadProtocol
	};
}
async function GC(e, t, n, r, i, a, o, s) {
	return RC(a, t.placeholderId, n.dimensions ? e : void 0, n.dimensions), KC(e, t, n.uploadProtocol, n.oxFromServer, n.xFromServer, r, i, o, s);
}
async function KC(e, t, n, r, i, a, o, s, c) {
	if (n === "blossom" ? delete a[e] : r ? a[e] = r : t.ox && (a[e] = t.ox), i) return o[e] = i, i;
	try {
		let t = await s(e);
		return t && (o[e] = t), t ?? void 0;
	} catch (t) {
		c && console.warn("[placeholderManager] failed to calculate x hash", {
			url: e,
			error: t
		});
		return;
	}
}
function qC(e, t, n, r, i) {
	let a = new r(), o = [];
	return e.forEach((e, r) => {
		let s = e.type.startsWith("video/"), c = a.validateMediaFile(e);
		if (!c.isValid) {
			n(c.errorMessage || "postComponent.upload_failed");
			return;
		}
		let l = `placeholder-${i}-${r}-${be()}`, u = t[r];
		o.push({
			file: e,
			placeholderId: l,
			ox: u?.ox,
			dimensions: u?.dimensions,
			isVideo: s
		});
	}), o;
}
function JC(e) {
	return async (t, n) => {
		let r = t.url;
		if (!r) return;
		let i = n.file.type.startsWith("video/");
		e.onBeforeReplace?.({
			url: r,
			matched: n,
			isVideo: i
		}), i ? await e.onVideoSuccess({
			url: r,
			matched: n,
			result: t
		}) : await e.onImageSuccess({
			url: r,
			matched: n,
			imageMetadata: WC(t, n)
		});
	};
}
async function YC(e, t, n) {
	let r = [], i = [...t];
	for (let t of e) {
		if (t.aborted) {
			let e = i.shift();
			e && await n.onAborted(e);
			continue;
		}
		if (t.success && t.url) {
			let { matched: e, matchedIndex: r } = IC(i, t);
			e && r !== -1 && (i.splice(r, 1), await n.onSuccess(t, e));
			continue;
		}
		r.push(t);
		let e = i.shift();
		e && await n.onFailure(e);
	}
	for (let e of i) await n.onRemaining(e);
	return {
		failedResults: r,
		errorMessage: LC(r)
	};
}
async function XC(e, t, n = !1, r = yt) {
	if (r()) {
		n && console.log("[generateBlurhashes] Aborted before blurhash generation");
		return;
	}
	let i = new t(), a = e.map(async (e) => {
		if (r()) n && console.log("[generateBlurhashes] Aborted during blurhash generation");
		else try {
			let t = await i.generateBlurhashForFile(e.file);
			if (r()) {
				n && console.log("[generateBlurhashes] Aborted after blurhash generation");
				return;
			}
			t && (e.blurhash = t);
		} catch (t) {
			n && console.warn("[generateBlurhashes] blurhash generation failed", {
				file: e.file.name,
				error: t
			});
		}
	});
	await Promise.all(a);
}
function ZC(e, t, n, r, i, a, o = !1) {
	if (!n) return [];
	let s = n.state, c = s.selection, l = c instanceof L && c.node?.type?.name === "image", u = Date.now();
	o && console.log("[dev] insertPlaceholdersIntoEditor:", {
		fileCount: e.length,
		isImageNodeSelected: l,
		selectionType: c.constructor.name,
		selectionFrom: c.from,
		selectionTo: c.to,
		docSize: s.doc.content.size
	});
	let d = s.doc.childCount === 1 && s.doc.firstChild?.type.name === "paragraph" && s.doc.firstChild.content.size === 0, f = s.tr, p = l ? c.to : c.from, m = qC(e, t, r, a, u), h = [];
	return m.forEach((e, t) => {
		let { file: n, placeholderId: a, ox: c, dimensions: l, isVideo: u } = e;
		try {
			let e;
			if (u) e = s.schema.nodes.video.create({
				src: a,
				isPlaceholder: !0
			});
			else {
				let t = {
					src: a,
					isPlaceholder: !0
				};
				l && (t.dim = `${l.width}x${l.height}`, i.update((e) => ({
					...e,
					[a]: l
				}))), e = s.schema.nodes.image.create(t);
			}
			d && t === 0 ? (f = f.replaceWith(0, s.doc.content.size, e), p = e.nodeSize) : (f = f.insert(p, e), p += e.nodeSize), h.push({
				file: n,
				placeholderId: a,
				ox: c,
				dimensions: l
			});
		} catch (e) {
			o && console.error("[uploadHelper] failed to insert media node", {
				placeholderId: a,
				file: n.name,
				isVideo: u,
				error: e,
				insertPos: p,
				docSize: s.doc.content.size
			}), r(u ? "動画の挿入に失敗しました" : "画像の挿入に失敗しました");
		}
	}), h.length > 0 && n.view.dispatch(f), h;
}
async function QC(e, t, n, r, i, a, o, s = !1) {
	let c = {}, { failedResults: l, errorMessage: u } = await YC(e, t, zC(async (e) => {
		tg(e.placeholderId, e.file.type.startsWith("video/"), n, a, s);
	}, JC({
		onBeforeReplace: ({ url: e, matched: t, isVideo: n }) => {
			s && console.log("[uploadHelper] Replacing placeholder", {
				placeholderId: t.placeholderId,
				url: e,
				isVideo: n
			});
		},
		onVideoSuccess: ({ url: e, matched: t, result: r }) => {
			$h(n, (e) => e.type.name === "video" && e.attrs.src === t.placeholderId, (t, i) => {
				let a = r.hostOwnedMedia === !0 ? VC(r.nip94 || {}) : null, o = n.state.tr.setNodeMarkup(i, void 0, {
					...t.attrs,
					src: e,
					isPlaceholder: !1,
					...a?.mFromServer ? { m: a.mFromServer } : {},
					...a?.altFromServer ? { alt: a.altFromServer } : {},
					...a?.serverBlurhash ? { blurhash: a.serverBlurhash } : {},
					...a?.dimFromServer ? { dim: a.dimFromServer } : {},
					...a?.sizeFromServer ? { size: a.sizeFromServer } : {},
					...a?.oxFromServer ? { ox: a.oxFromServer } : {},
					...a?.xFromServer ? { x: a.xFromServer } : {},
					...r.hostOwnedMedia === !0 ? { uploadProtocol: r.uploadProtocol } : {}
				});
				n.view.dispatch(o);
			});
		},
		onImageSuccess: async ({ url: e, matched: t, imageMetadata: l }) => {
			$h(n, (e) => e.type.name === "image" && e.attrs.src === t.placeholderId, (t, r) => {
				let i = {
					...t.attrs,
					src: e,
					isPlaceholder: !1,
					blurhash: l.blurhash
				};
				l.dim && (i.dim = l.dim), l.mimeType && (i.m = l.mimeType), l.alt !== void 0 && (i.alt = l.alt), l.oxFromServer && (i.ox = l.oxFromServer), l.xFromServer && (i.x = l.xFromServer), i.size = l.size ?? null, i.uploadProtocol = l.uploadProtocol ?? null;
				let a = n.state.tr.setNodeMarkup(r, void 0, i);
				n.view.dispatch(a);
			}), l.serverBlurhash && (c[e] = l.serverBlurhash), await GC(e, t, l, r, i, a, o, s);
		}
	})));
	return {
		failedResults: l,
		errorMessage: u,
		imageServerBlurhashMap: c
	};
}
function $C(e, t, n, r, i, a = !1) {
	let o = qC(e, t, n, i, Date.now()), s = [];
	for (let e of o) {
		let { file: t, placeholderId: n, ox: i, dimensions: o, isVideo: c } = e, l = {
			id: n,
			type: c ? "video" : "image",
			src: n,
			isPlaceholder: !0,
			dimensions: o,
			dim: o ? `${o.width}x${o.height}` : void 0
		};
		De.addItem(l), !c && o && r.update((e) => ({
			...e,
			[n]: o
		})), s.push({
			file: t,
			placeholderId: n,
			ox: i,
			dimensions: o
		}), a && console.log("[gallery] inserted placeholder:", n, c ? "video" : "image");
	}
	return s;
}
async function ew(e, t, n, r, i, a, o, s = !1, c) {
	return YC(e, t, zC(async (e) => {
		BC(e.placeholderId, i);
	}, JC({
		onVideoSuccess: ({ url: e, matched: t, result: n }) => {
			if (c?.isCurrent && !c.isCurrent()) return;
			let r = n.hostOwnedMedia === !0 ? VC(n.nip94 || {}) : null;
			De.updateItem(t.placeholderId, {
				src: e,
				isPlaceholder: !1,
				mimeType: r?.mFromServer ?? o(e),
				...r?.altFromServer ? { alt: r.altFromServer } : {},
				...r?.serverBlurhash ? { blurhash: r.serverBlurhash } : {},
				...r?.dimFromServer ? { dim: r.dimFromServer } : {},
				...r?.sizeFromServer ? { size: HC(r.sizeFromServer) } : {},
				...r?.oxFromServer ? { ox: r.oxFromServer } : {},
				...r?.xFromServer ? { x: r.xFromServer } : {},
				...n.hostOwnedMedia === !0 ? { uploadProtocol: n.uploadProtocol } : {}
			});
		},
		onImageSuccess: async ({ url: e, matched: t, imageMetadata: l }) => {
			if (c?.isCurrent && !c.isCurrent()) return;
			let u = l.mimeType ?? (c?.useFileMimeType ? t.file.type : o(e));
			De.updateItem(t.placeholderId, {
				src: e,
				isPlaceholder: !1,
				blurhash: l.blurhash,
				mimeType: u,
				...l.alt === void 0 ? {} : { alt: l.alt },
				ox: l.ox,
				dim: l.dim,
				dimensions: l.dimensions,
				size: l.size,
				uploadProtocol: l.uploadProtocol
			});
			let d = await GC(e, t, l, n, r, i, a, s);
			d && (!c?.isCurrent || c.isCurrent()) && De.updateItem(t.placeholderId, { x: d }), s && console.log("[gallery] replaced placeholder:", t.placeholderId, "->", e);
		}
	})));
}
function tw(e, t) {
	for (let n of e) BC(n.placeholderId, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/editorStore.svelte.ts
var nw = C({ value: "" }), rw = w(null), iw = {
	get value() {
		return x(rw);
	},
	set: (e) => {
		O(rw, e, !0);
	}
}, aw = C({
	isSubmitPending: !1,
	content: "",
	canPost: !1,
	isUploading: !1,
	uploadErrorMessage: "",
	postStatus: {
		sending: !1,
		success: !1,
		error: !1,
		message: ""
	},
	hasImage: !1
}), ow = C({
	isDragging: !1,
	startPos: {
		x: 0,
		y: 0
	},
	longPressTimeout: null,
	startTarget: null,
	preview: null
}), sw = C({
	justSelected: !1,
	justSelectedTimeout: null
}), cw = C({
	isDragging: !1,
	draggedNodePos: null,
	startPos: {
		x: 0,
		y: 0
	},
	longPressTimeout: null,
	startTarget: null,
	preview: null
});
function lw(e, t = !1) {
	aw.content = e, aw.hasImage = t;
}
function uw(e, t, n) {
	aw.canPost = n ?? xh(e, t);
}
function dw(e) {
	aw.postStatus = e;
}
function fw() {
	aw.content = "", aw.canPost = !1, aw.uploadErrorMessage = "", aw.postStatus = {
		sending: !1,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	}, aw.hasImage = !1;
}
function pw() {
	aw.postStatus = {
		sending: !1,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	};
}
function mw(e) {
	nw.value = e, x(rw) && PC(x(rw), e);
}
var hw = void 0;
function gw(e) {
	hw = e;
}
function _w(e) {
	e && hw !== e || (hw = void 0);
}
async function vw(e) {
	hw && await hw(e);
}
export { Dh as A, tv as C, bg as D, xg as E, F, bh as M, xh as N, pg as O, L as P, xC as S, Sg as T, ew as _, fw as a, NC as b, vw as c, mw as d, dw as f, tw as g, $C as h, nw as i, yh as j, ng as k, lw as l, ZC as m, iw as n, pw as o, XC as p, aw as r, gw as s, _w as t, uw as u, QC as v, v_ as w, wC as x, FC as y };
