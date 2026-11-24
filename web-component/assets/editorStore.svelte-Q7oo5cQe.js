import { $ as e, B as t, D as n, Dt as r, E as i, Et as a, F as o, G as s, H as c, K as l, L as u, M as d, Nt as f, P as p, Pt as m, Q as h, St as g, T as _, U as v, V as y, Z as b, _t as x, at as S, b as C, ct as w, dt as ee, f as T, ft as E, ht as D, i as te, it as ne, j as re, lt as ie, mt as ae, n as oe, o as se, pt as ce, q as le, r as ue, rt as O, s as de, st as fe, t as pe, tt as me, u as he, v as ge, wt as _e, yt as ve } from "./index-client-DEFG3Gqk.js";
import { a as ye, n as be } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { r as xe, t as Se } from "./uploadOperation-BVOBq-hD.js";
import { I as Ce, Z as we, t as Te } from "./LoadingPlaceholder-YrD8D_td.js";
import { n as Ee } from "./ehagakiDb-DuXS0XPm.js";
import { o as De } from "./ehagakiDbUpgradeState-tA-618gW.js";
import { a as Oe, at as ke, dt as Ae, i as je, r as Me, rt as Ne } from "./appUtils-B3-zUpkb.js";
import { C as Pe, S as Fe, a as Ie, b as Le } from "./uploadStore.svelte-DWirN09w.js";
import { a as Re, f as ze, g as Be, i as Ve, n as He, o as Ue, r as We, s as Ge, u as Ke } from "./clipboardUtils-CSGkJuUA.js";
import { n as qe } from "./httpUrlCandidates-BckQw1dk.js";
import { t as Je } from "./Button-Cqrg0_jX.js";
import { t as Ye } from "./ProfileAvatar-eo19xgt6.js";
import { i as Xe, n as Ze, r as Qe, s as $e } from "./floating-ui.dom-BRmGhLhL.js";
import { a as et, c as tt, i as nt, n as rt, o as it, r as at, s as ot, t as st } from "./customEmojiStore.svelte-C42g6-3J.js";
import { a as ct, c as lt, d as ut, f as dt, n as ft, s as pt, t as mt } from "./profileMention-C2raJMGE.js";
import { d as ht, o as gt, r as _t, s as vt, u as yt } from "./customEmoji-C4nd4cTR.js";
import { _ as bt, a as xt, c as St, d as Ct, f as wt, i as Tt, l as Et, n as Dt, o as Ot, r as kt, s as At, t as jt, u as Mt } from "./mediaNodeUtils-CzHZhHXE.js";
import { i as Nt, r as Pt } from "./keyboardFocusUtils-BhXq7KwV.js";
import { t as Ft } from "./reactionValue-pGAZaGcf.js";
import { t as It } from "./uploadAbortUtils-F30ArOJg.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/core/dist/rolldown-runtime-D7D4PA-g.js
var Lt = Object.defineProperty, Rt = (e, t) => {
	let n = {};
	for (var r in e) Lt(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || Lt(n, Symbol.toStringTag, { value: "Module" }), n;
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/orderedmap/dist/index.js
function k(e) {
	this.content = e;
}
k.prototype = {
	constructor: k,
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
		return i == -1 ? a.push(n || e, t) : (a[i + 1] = t, n && (a[i] = n)), new k(a);
	},
	remove: function(e) {
		var t = this.find(e);
		if (t == -1) return this;
		var n = this.content.slice();
		return n.splice(t, 2), new k(n);
	},
	addToStart: function(e, t) {
		return new k([e, t].concat(this.remove(e).content));
	},
	addToEnd: function(e, t) {
		var n = this.remove(e).content.slice();
		return n.push(e, t), new k(n);
	},
	addBefore: function(e, t, n) {
		var r = this.remove(t), i = r.content.slice(), a = r.find(e);
		return i.splice(a == -1 ? i.length : a, 0, t, n), new k(i);
	},
	forEach: function(e) {
		for (var t = 0; t < this.content.length; t += 2) e(this.content[t], this.content[t + 1]);
	},
	prepend: function(e) {
		return e = k.from(e), e.size ? new k(e.content.concat(this.subtract(e).content)) : this;
	},
	append: function(e) {
		return e = k.from(e), e.size ? new k(this.subtract(e).content.concat(e.content)) : this;
	},
	subtract: function(e) {
		var t = this;
		e = k.from(e);
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
}, k.from = function(e) {
	if (e instanceof k) return e;
	var t = [];
	if (e) for (var n in e) t.push(n, e[n]);
	return new k(t);
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-model/dist/index.js
function zt(e, t, n) {
	for (let r = 0;; r++) {
		if (r == e.childCount || r == t.childCount) return e.childCount == t.childCount ? null : n;
		let i = e.child(r), a = t.child(r);
		if (i == a) n += i.nodeSize;
		else {
			if (!i.sameMarkup(a)) return n;
			if (i.isText && i.text != a.text) {
				let e = i.text, t = a.text, r = 0;
				for (; e[r] == t[r]; r++) n++;
				return r && r < e.length && r < t.length && Ht(e.charCodeAt(r - 1)) && Vt(e.charCodeAt(r)) && n--, n;
			}
			if (i.content.size || a.content.size) {
				let e = zt(i.content, a.content, n + 1);
				if (e != null) return e;
			}
			n += i.nodeSize;
		}
	}
}
function Bt(e, t, n, r) {
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
				return i && a && i < e.length && Ht(e.charCodeAt(i - 1)) && Vt(e.charCodeAt(i)) && (n++, r++), {
					a: n,
					b: r
				};
			}
			if (o.content.size || s.content.size) {
				let e = Bt(o.content, s.content, n - 1, r - 1);
				if (e) return e;
			}
			n -= c, r -= c;
		}
	}
}
function Vt(e) {
	return e >= 56320 && e < 57344;
}
function Ht(e) {
	return e >= 55296 && e < 56320;
}
var A = class e {
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
		return zt(this, e, t);
	}
	findDiffEnd(e, t = this.size, n = e.size) {
		return Bt(this, e, t, n);
	}
	findIndex(e) {
		if (e == 0) return Wt(0, e);
		if (e == this.size) return Wt(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? Wt(t + 1, i) : Wt(t, n);
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
A.empty = new A([], 0);
var Ut = {
	index: 0,
	offset: 0
};
function Wt(e, t) {
	return Ut.index = e, Ut.offset = t, Ut;
}
function Gt(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!Gt(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !Gt(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var j = class e {
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
		return this == e || this.type == e.type && Gt(this.attrs, e.attrs);
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
j.none = [];
var Kt = class extends Error {}, M = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = Jt(this.content, t + this.openStart, n, this.openStart + 1, this.openEnd + 1);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(qt(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
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
		return new e(A.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
M.empty = new M(A.empty, 0, 0);
function qt(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(qt(a.content, t - i - 1, n - i - 1)));
}
function Jt(e, t, n, r, i, a) {
	let { index: o, offset: s } = e.findIndex(t), c = e.maybeChild(o);
	if (s == t || c.isText) return a && r <= 0 && i <= 0 && !a.canReplace(o, o, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let l = Jt(c.content, t - s - 1, n, o == 0 ? r - 1 : 0, o == e.childCount - 1 ? i - 1 : 0, c);
	return l && e.replaceChild(o, c.copy(l));
}
function Yt(e, t, n) {
	if (n.openStart > e.depth) throw new Kt("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new Kt("Inconsistent open depths");
	return Xt(e, t, n, 0);
}
function Xt(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = Xt(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	}
	if (!n.content.size) return tn(a, rn(e, t, r));
	if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return tn(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	}
	{
		let { start: i, end: o } = an(n, e);
		return tn(a, nn(e, i, o, t, r));
	}
}
function Zt(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new Kt("Cannot join " + t.type.name + " onto " + e.type.name);
}
function Qt(e, t, n) {
	let r = e.node(n);
	return Zt(r, t.node(n)), r;
}
function $t(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function en(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && ($t(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) $t(i.child(e), r);
	t && t.depth == n && t.textOffset && $t(t.nodeBefore, r);
}
function tn(e, t) {
	if (!e.type.validContent(t)) throw new Kt("Invalid content for node " + e.type.name);
	return e.copy(t);
}
function nn(e, t, n, r, i) {
	let a = e.depth > i && Qt(e, t, i + 1), o = r.depth > i && Qt(n, r, i + 1), s = [];
	return en(null, e, i, s), a && o && t.index(i) == n.index(i) ? (Zt(a, o), $t(tn(a, nn(e, t, n, r, i + 1)), s)) : (a && $t(tn(a, rn(e, t, i + 1)), s), en(t, n, i, s), o && $t(tn(o, rn(n, r, i + 1)), s)), en(r, null, i, s), new A(s);
}
function rn(e, t, n) {
	let r = [];
	return en(null, e, n, r), e.depth > n && $t(tn(Qt(e, t, n + 1), rn(e, t, n + 1)), r), en(t, null, n, r), new A(r);
}
function an(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(A.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var on = class e {
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
		if (e.content.size == 0) return j.none;
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
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new un(this, e, n);
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
		let r = ln.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else ln.set(t, r = new sn());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % cn, i;
	}
}, sn = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, cn = 12, ln = /* @__PURE__ */ new WeakMap(), un = class {
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
}, dn = Object.create(null), fn = class e {
	constructor(e, t, n, r = j.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || A.empty;
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
		return this.type == e && Gt(this.attrs, t || e.defaultAttrs || dn) && j.sameSet(this.marks, n || j.none);
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
		if (e == t) return M.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new M(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return Yt(this.resolve(e), this.resolve(t), n);
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
		return on.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return on.resolve(this, e);
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
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), mn(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = A.empty, r = 0, i = n.childCount) {
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
		this.type.checkContent(this.content), hn(this.type.attrs, this.attrs, "node", this.type.name);
		let e = j.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			hn(n.type.attrs, n.attrs, "mark", n.type.name), e = n.addToSet(e);
		}
		if (!j.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
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
		let r = A.fromJSON(e, t.content);
		return e.nodeType(t.type).create(t.attrs, r, n);
	}
};
fn.prototype.text = void 0;
var pn = class e extends fn {
	constructor(e, t, n, r) {
		if (super(e, t, null, r), !n) throw RangeError("Empty text nodes are not allowed");
		this.text = n;
	}
	toString() {
		return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : mn(this.marks, JSON.stringify(this.text));
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
function mn(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
function hn(e, t, n, r) {
	for (let i in t) if (!(i in e)) throw RangeError(`Unsupported attribute ${i} for ${n} of type ${r}`);
	for (let n in e) e[n].validate && e[n].validate(t[n]);
}
var gn = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new _n(t, n);
		if (r.next == null) return e.empty;
		let i = vn(r);
		r.next && r.err("Unexpected trailing text");
		let a = On(Tn(i));
		return kn(a, r), a;
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
			if (s && (!t || s.validEnd)) return A.from(o.map((e) => e.createAndFill()));
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
gn.empty = new gn(!0);
var _n = class {
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
function vn(e) {
	let t = [];
	do
		t.push(yn(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function yn(e) {
	let t = [];
	do
		t.push(bn(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function bn(e) {
	let t = wn(e);
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
	else if (e.eat("{")) t = Sn(e, t);
	else break;
	return t;
}
function xn(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function Sn(e, t) {
	let n = xn(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : xn(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function Cn(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function wn(e) {
	if (e.eat("(")) {
		let t = vn(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	}
	if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = Cn(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function Tn(e) {
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
function En(e, t) {
	return t - e;
}
function Dn(e, t) {
	let n = [];
	return r(t), n.sort(En);
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
function On(e) {
	let t = Object.create(null);
	return n(Dn(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				Dn(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new gn(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(En);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function kn(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
function An(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		if (!r.hasDefault) return null;
		t[n] = r.default;
	}
	return t;
}
function jn(e, t) {
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
function Mn(e, t) {
	let n = Object.create(null);
	if (t) for (let r in t) n[r] = new Fn(e, r, t[r]);
	return n;
}
var Nn = class e {
	constructor(e, t, n) {
		this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = Mn(e, n.attrs), this.defaultAttrs = An(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
	}
	get isInline() {
		return !this.isBlock;
	}
	get isTextblock() {
		return this.isBlock && this.inlineContent;
	}
	get isLeaf() {
		return this.contentMatch == gn.empty;
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
		return !e && this.defaultAttrs ? this.defaultAttrs : jn(this.attrs, e);
	}
	create(e = null, t, n) {
		if (this.isText) throw Error("NodeType.create can't construct text nodes");
		return new fn(this, this.computeAttrs(e), A.from(t), j.setFrom(n));
	}
	createChecked(e = null, t, n) {
		return t = A.from(t), this.checkContent(t), new fn(this, this.computeAttrs(e), t, j.setFrom(n));
	}
	createAndFill(e = null, t, n) {
		if (e = this.computeAttrs(e), t = A.from(t), t.size) {
			let e = this.contentMatch.fillBefore(t);
			if (!e) return null;
			t = e.append(t);
		}
		let r = this.contentMatch.matchFragment(t), i = r && r.fillBefore(A.empty, !0);
		return i ? new fn(this, e, t.append(i), j.setFrom(n)) : null;
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
		return t ? t.length ? t : j.none : e;
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
function Pn(e, t, n) {
	let r = n.split("|");
	return (n) => {
		let i = n === null ? "null" : typeof n;
		if (r.indexOf(i) < 0) throw RangeError(`Expected value of type ${r} for attribute ${t} on type ${e}, got ${i}`);
	};
}
var Fn = class {
	constructor(e, t, n) {
		this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? Pn(e, t, n.validate) : n.validate;
	}
	get isRequired() {
		return !this.hasDefault;
	}
}, In = class e {
	constructor(e, t, n, r) {
		this.name = e, this.rank = t, this.schema = n, this.spec = r, this.attrs = Mn(e, r.attrs), this.excluded = null;
		let i = An(this.attrs);
		this.instance = i ? new j(this, i) : null;
	}
	create(e = null) {
		return !e && this.instance ? this.instance : new j(this, jn(this.attrs, e));
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
}, Ln = class {
	constructor(e) {
		this.linebreakReplacement = null, this.cached = Object.create(null);
		let t = this.spec = {};
		for (let n in e) t[n] = e[n];
		t.nodes = k.from(e.nodes), t.marks = k.from(e.marks || {}), this.nodes = Nn.compile(this.spec.nodes, this), this.marks = In.compile(this.spec.marks, this);
		let n = Object.create(null);
		for (let e in this.nodes) {
			if (e in this.marks) throw RangeError(e + " can not be both a node and a mark");
			let t = this.nodes[e], r = t.spec.content || "", i = t.spec.marks;
			if (t.contentMatch = n[r] || (n[r] = gn.parse(r, this.nodes)), t.inlineContent = t.contentMatch.inlineContent, t.spec.linebreakReplacement) {
				if (this.linebreakReplacement) throw RangeError("Multiple linebreak nodes defined");
				if (!t.isInline || !t.isLeaf) throw RangeError("Linebreak replacement nodes must be inline leaf nodes");
				this.linebreakReplacement = t;
			}
			t.markSet = i == "_" ? null : i ? Rn(this, i.split(" ")) : i == "" || !t.inlineContent ? [] : null;
		}
		for (let e in this.marks) {
			let t = this.marks[e], n = t.spec.excludes;
			t.excluded = n == null ? [t] : n == "" ? [] : Rn(this, n.split(" "));
		}
		this.nodeFromJSON = (e) => fn.fromJSON(this, e), this.markFromJSON = (e) => j.fromJSON(this, e), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null);
	}
	node(e, t = null, n, r) {
		if (typeof e == "string") e = this.nodeType(e);
		else if (!(e instanceof Nn)) throw RangeError("Invalid node type: " + e);
		else if (e.schema != this) throw RangeError("Node type from different schema used (" + e.name + ")");
		return e.createChecked(t, n, r);
	}
	text(e, t) {
		let n = this.nodes.text;
		return new pn(n, n.defaultAttrs, e, j.setFrom(t));
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
function Rn(e, t) {
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
function zn(e) {
	return e.tag != null;
}
function Bn(e) {
	return e.style != null;
}
var Vn = class e {
	constructor(e, t) {
		this.schema = e, this.rules = t, this.tags = [], this.styles = [];
		let n = this.matchedStyles = [];
		t.forEach((e) => {
			if (zn(e)) this.tags.push(e);
			else if (Bn(e)) {
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
		let n = new Xn(this, t, !1);
		return n.addAll(e, j.none, t.from, t.to), n.finish();
	}
	parseSlice(e, t = {}) {
		let n = new Xn(this, t, !0);
		return n.addAll(e, j.none, t.from, t.to), M.maxOpen(n.finish());
	}
	matchTag(e, t, n) {
		for (let r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
			let n = this.tags[r];
			if (Qn(e, n.tag) && (n.namespace === void 0 || e.namespaceURI == n.namespace) && (!n.context || t.matchesContext(n.context))) {
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
				n(e = $n(e)), e.mark || e.ignore || e.clearMark || (e.mark = t);
			});
		}
		for (let t in e.nodes) {
			let r = e.nodes[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = $n(e)), e.node || e.ignore || e.mark || (e.node = t);
			});
		}
		return t;
	}
	static fromSchema(t) {
		return t.cached.domParser || (t.cached.domParser = new e(t, e.schemaRules(t)));
	}
}, Hn = {
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
}, Un = {
	head: !0,
	noscript: !0,
	object: !0,
	script: !0,
	style: !0,
	title: !0
}, Wn = {
	ol: !0,
	ul: !0
}, Gn = 1, Kn = 2, qn = 4;
function Jn(e, t, n) {
	return t == null ? e && e.whitespace == "pre" ? 3 : n & -5 : (t ? Gn : 0) | (t === "full" ? Kn : 0);
}
var Yn = class {
	constructor(e, t, n, r, i, a) {
		this.type = e, this.attrs = t, this.marks = n, this.solid = r, this.options = a, this.content = [], this.activeMarks = j.none, this.match = i || (a & qn ? null : e.contentMatch);
	}
	findWrapping(e) {
		if (!this.match) {
			if (!this.type) return [];
			let t = this.type.contentMatch.fillBefore(A.from(e));
			if (t) this.match = this.type.contentMatch.matchFragment(t);
			else {
				let t = this.type.contentMatch, n;
				return (n = t.findWrapping(e.type)) ? (this.match = t, n) : null;
			}
		}
		return this.match.findWrapping(e.type);
	}
	finish(e) {
		if (!(this.options & Gn)) {
			let e = this.content[this.content.length - 1], t;
			if (e && e.isText && (t = /[ \t\r\n\u000c]+$/.exec(e.text))) {
				let n = e;
				e.text.length == t[0].length ? this.content.pop() : this.content[this.content.length - 1] = n.withText(n.text.slice(0, n.text.length - t[0].length));
			}
		}
		let t = A.from(this.content);
		return !e && this.match && (t = t.append(this.match.fillBefore(A.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
	}
	inlineContext(e) {
		return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Hn.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
	}
}, Xn = class {
	constructor(e, t, n) {
		this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
		let r = t.topNode, i, a = Jn(null, t.preserveWhitespace, 0) | (n ? qn : 0);
		i = r ? new Yn(r.type, r.attrs, j.none, !0, t.topMatch || r.type.contentMatch, a) : n ? new Yn(null, null, j.none, !0, null, a) : new Yn(e.schema.topNodeType, null, j.none, !0, null, a), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
	}
	get top() {
		return this.nodes[this.open];
	}
	addDOM(e, t) {
		e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
	}
	addTextNode(e, t) {
		let n = e.nodeValue, r = this.top, i = r.options & Kn ? "full" : this.localPreserveWS || (r.options & Gn) > 0, { schema: a } = this.parser;
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
		Wn.hasOwnProperty(a) && this.parser.normalizeLists && Zn(e);
		let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, n));
		out: if (s ? s.ignore : Un.hasOwnProperty(a)) this.findInside(e), this.ignoreFallback(e, t);
		else if (!s || s.skip || s.closeParent) {
			s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
			let n, r = this.needsBlock;
			if (Hn.hasOwnProperty(a)) i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), n = !0, i.type || (this.needsBlock = !0);
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
			let n = j.none;
			for (let i of r.concat(e.marks)) (t.type ? t.type.allowsMarkType(i.type) : er(i.type, e.type)) && (n = i.addToSet(n));
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
		let o = Jn(e, i, a.options);
		a.options & qn && a.content.length == 0 && (o |= qn);
		let s = j.none;
		return n = n.filter((t) => !(a.type ? a.type.allowsMarkType(t.type) : er(t.type, e)) || (s = t.addToSet(s), !1)), this.nodes.push(new Yn(e, t, s, r, null, o)), this.open++, n;
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
		else this.localPreserveWS && (this.nodes[t].options |= Gn);
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
function Zn(e) {
	for (let t = e.firstChild, n = null; t; t = t.nextSibling) {
		let e = t.nodeType == 1 ? t.nodeName.toLowerCase() : null;
		e && Wn.hasOwnProperty(e) && n ? (n.appendChild(t), t = n) : e == "li" ? n = t : e && (n = null);
	}
}
function Qn(e, t) {
	return (e.matches || e.msMatchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector).call(e, t);
}
function $n(e) {
	let t = {};
	for (let n in e) t[n] = e[n];
	return t;
}
function er(e, t) {
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
var tr = class e {
	constructor(e, t) {
		this.nodes = e, this.marks = t;
	}
	serializeFragment(e, t = {}, n) {
		n ||= rr(t).createDocumentFragment();
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
		if (e.isText) return rr(t).createTextNode(e.text);
		let { dom: n, contentDOM: r } = sr(rr(t), this.nodes[e.type.name](e), null, e.attrs);
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
		return r && sr(rr(n), r(e, t), null, e.attrs);
	}
	static renderSpec(e, t, n = null, r) {
		return typeof t == "string" ? { dom: e.createTextNode(t) } : sr(e, t, n, r);
	}
	static fromSchema(t) {
		return t.cached.domSerializer || (t.cached.domSerializer = new e(this.nodesFromSchema(t), this.marksFromSchema(t)));
	}
	static nodesFromSchema(e) {
		let t = nr(e.nodes);
		return t.text ||= (e) => e.text, t;
	}
	static marksFromSchema(e) {
		return nr(e.marks);
	}
};
function nr(e) {
	let t = {};
	for (let n in e) {
		let r = e[n].spec.toDOM;
		r && (t[n] = r);
	}
	return t;
}
function rr(e) {
	return e.document || window.document;
}
var ir = /* @__PURE__ */ new WeakMap();
function ar(e) {
	let t = ir.get(e);
	return t === void 0 && ir.set(e, t = or(e)), t;
}
function or(e) {
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
function sr(e, t, n, r) {
	if (t.nodeType == 1) return { dom: t };
	if (t.dom && t.dom.nodeType == 1) return t;
	let i = t[0], a;
	if (typeof i != "string") throw RangeError("Invalid array passed to renderSpec");
	if (r && (a = ar(r)) && a.indexOf(t) > -1) throw RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
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
			let { dom: t, contentDOM: i } = sr(e, a, n, r);
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
var cr = 65535, lr = 2 ** 16;
function ur(e, t) {
	return e + t * lr;
}
function dr(e) {
	return e & cr;
}
function fr(e) {
	return (e - (e & cr)) / lr;
}
var pr = 1, mr = 2, hr = 4, gr = 8, _r = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & gr) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & 5) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & 6) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & hr) > 0;
	}
}, vr = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = dr(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + fr(e);
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
				let d = e == (t < 0 ? s : u) ? null : ur(o / 3, e - s), f = 0;
				return c && (f |= e == s ? mr : e == u ? pr : hr, (t < 0 ? e != s : e != u) && (f |= gr)), new _r(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new _r(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = dr(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
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
vr.empty = new vr([]);
var yr = class e {
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
		return n ? e : new _r(e, r, null);
	}
}, br = Object.create(null), N = class {
	getMap() {
		return vr.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = br[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in br) throw RangeError("Duplicate use of step JSON ID " + e);
		return br[e] = t, t.prototype.jsonID = e, t;
	}
}, xr = class e {
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
			if (t instanceof Kt) return e.fail(t.message);
			throw t;
		}
	}
};
function Sr(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(Sr(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return A.fromArray(r);
}
var Cr = class e extends N {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new M(Sr(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return xr.fromReplace(e, this.from, this.to, i);
	}
	invert(t) {
		let n = [];
		return t.nodesBetween(this.from, this.to, (t, r) => {
			if (t.isInline && t.isAtom) {
				let i = this.mark.addToSet(t.marks);
				if (!j.sameSet(i, t.marks)) {
					let a = Math.max(this.from, r), o = Math.min(this.to, r + t.nodeSize);
					Tr(wr, a, o, this.mark, n);
					for (let r of t.marks) r.isInSet(i) || Tr(e, a, o, r, n);
				}
			}
		}), n.length == 1 ? n[0] : new Er(n);
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
N.jsonID("addMark", Cr);
var wr = class e extends N {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new M(Sr(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return xr.fromReplace(e, this.from, this.to, n);
	}
	invert(e) {
		let t = [];
		return e.nodesBetween(this.from, this.to, (e, n) => {
			e.isInline && e.isAtom && this.mark.isInSet(e.marks) && Tr(Cr, Math.max(this.from, n), Math.min(this.to, n + e.nodeSize), this.mark, t);
		}), t.length == 1 ? t[0] : new Er(t);
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
N.jsonID("removeMark", wr);
function Tr(e, t, n, r, i) {
	let a = i.length ? i[i.length - 1] : null;
	a && a instanceof e && a.to == t && a.mark.eq(r) ? i[i.length - 1] = new e(a.from, n, r) : i.push(new e(t, n, r));
}
var Er = class e extends N {
	constructor(e) {
		super(), this.steps = e;
	}
	apply(e) {
		for (let t of this.steps) {
			let n = t.apply(e);
			if (!n.doc) return n;
			e = n.doc;
		}
		return new xr(e, null);
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
		return new e(n.steps.map((e) => N.fromJSON(t, e)));
	}
};
N.jsonID("markSet", Er);
var Dr = class e extends N {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return xr.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return xr.fromReplace(e, this.pos, this.pos + 1, new M(A.from(n), 0, +!t.isLeaf));
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
		return new Or(this.pos, this.mark);
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
N.jsonID("addNodeMark", Dr);
var Or = class e extends N {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return xr.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return xr.fromReplace(e, this.pos, this.pos + 1, new M(A.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new Dr(this.pos, this.mark);
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
N.jsonID("removeNodeMark", Or);
var kr = class e extends N {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && jr(e, this.from, this.to) ? xr.fail("Structure replace would overwrite content") : xr.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new vr([
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
			let n = this.slice.size + t.slice.size == 0 ? M.empty : new M(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		}
		if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? M.empty : new M(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
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
		return new e(n.from, n.to, M.fromJSON(t, n.slice), !!n.structure);
	}
};
kr.MAP_BIAS = 1, N.jsonID("replace", kr);
var Ar = class e extends N {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (jr(e, this.from, this.gapFrom) || jr(e, this.gapTo, this.to))) return xr.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return xr.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? xr.fromReplace(e, this.from, this.to, n) : xr.fail("Content does not fit in gap");
	}
	getMap() {
		return new vr([
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
		return new e(n.from, n.to, n.gapFrom, n.gapTo, M.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
N.jsonID("replaceAround", Ar);
function jr(e, t, n) {
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
function Mr(e, t, n, r) {
	let i = [];
	e.doc.nodesBetween(t, n, (e, a, o) => {
		if (!e.isInline) return;
		let s = e.marks;
		!r.isInSet(s) && o.type.allowsMarkType(r.type) && Tr(Cr, Math.max(a, t), Math.min(a + e.nodeSize, n), r, i);
	}), i.forEach((t) => e.step(t));
}
function Nr(e, t, n, r) {
	let i = [], a = 0;
	e.doc.nodesBetween(t, n, (e, o) => {
		if (!e.isInline || !e.isAtom) return;
		a++;
		let s = null;
		if (r instanceof In) {
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
	}), i.forEach((t) => e.step(new wr(t.from, t.to, t.style)));
}
function Pr(e, t, n, r = n.contentMatch, i = !0) {
	let a = e.doc.nodeAt(t), o = [], s = t + 1;
	for (let t = 0; t < a.childCount; t++) {
		let c = a.child(t), l = s + c.nodeSize, u = r.matchType(c.type);
		if (!u) o.push(new kr(s, l, M.empty));
		else {
			r = u;
			for (let t = 0; t < c.marks.length; t++) n.allowsMarkType(c.marks[t].type) || e.step(new wr(s, l, c.marks[t]));
			if (i && c.isText && n.whitespace != "pre") {
				let e, t = /\r?\n|\r/g, r;
				for (; e = t.exec(c.text);) r ||= new M(A.from(n.schema.text(" ", n.allowedMarks(c.marks))), 0, 0), o.push(new kr(s + e.index, s + e.index + e[0].length, r));
			}
		}
		s = l;
	}
	if (!r.validEnd) {
		let t = r.fillBefore(A.empty, !0);
		e.replace(s, s, new M(t, 0, 0));
	}
	for (let t = o.length - 1; t >= 0; t--) e.step(o[t]);
}
function Fr(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function Ir(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !Fr(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function Lr(e, t, n) {
	let { $from: r, $to: i, depth: a } = t, o = r.before(a + 1), s = i.after(a + 1), c = o, l = s, u = A.empty, d = 0;
	for (let e = a, t = !1; e > n; e--) t || r.index(e) > 0 ? (t = !0, u = A.from(r.node(e).copy(u)), d++) : c--;
	let f = A.empty, p = 0;
	for (let e = a, t = !1; e > n; e--) t || i.after(e + 1) < i.end(e) ? (t = !0, f = A.from(i.node(e).copy(f)), p++) : l++;
	e.step(new Ar(c, l, o, s, new M(u.append(f), d, p), u.size - d, !0));
}
function Rr(e, t, n = null, r = e) {
	let i = Br(e, t), a = i && Vr(r, t);
	return a ? i.map(zr).concat({
		type: t,
		attrs: n
	}).concat(a.map(zr)) : null;
}
function zr(e) {
	return {
		type: e,
		attrs: null
	};
}
function Br(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.contentMatchAt(r).findWrapping(t);
	if (!a) return null;
	let o = a.length ? a[0] : t;
	return n.canReplaceWith(r, i, o) ? a : null;
}
function Vr(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (!o) return null;
	let s = (o.length ? o[o.length - 1] : t).contentMatch;
	for (let e = r; s && e < i; e++) s = s.matchType(n.child(e).type);
	return !s || !s.validEnd ? null : o;
}
function Hr(e, t, n) {
	let r = A.empty;
	for (let e = n.length - 1; e >= 0; e--) {
		if (r.size) {
			let t = n[e].type.contentMatch.matchFragment(r);
			if (!t || !t.validEnd) throw RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
		}
		r = A.from(n[e].type.create(n[e].attrs, r));
	}
	let i = t.start, a = t.end;
	e.step(new Ar(i, a, i, a, new M(r, 0, 0), n.length, !0));
}
function Ur(e, t, n, r, i) {
	if (!r.isTextblock) throw RangeError("Type given to setBlockType should be a textblock");
	let a = e.steps.length;
	e.doc.nodesBetween(t, n, (t, n) => {
		let o = typeof i == "function" ? i(t) : i;
		if (t.isTextblock && !t.hasMarkup(r, o) && Kr(e.doc, e.mapping.slice(a).map(n), r)) {
			let i = null;
			if (r.schema.linebreakReplacement) {
				let e = r.whitespace == "pre", t = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
				e && !t ? i = !1 : !e && t && (i = !0);
			}
			i === !1 && Gr(e, t, n, a), Pr(e, e.mapping.slice(a).map(n, 1), r, void 0, i === null);
			let s = e.mapping.slice(a), c = s.map(n, 1), l = s.map(n + t.nodeSize, 1);
			return e.step(new Ar(c, l, c + 1, l - 1, new M(A.from(r.create(o, null, t.marks)), 0, 0), 1, !0)), i === !0 && Wr(e, t, n, a), !1;
		}
	});
}
function Wr(e, t, n, r) {
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
function Gr(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.type == i.type.schema.linebreakReplacement) {
			let i = e.mapping.slice(r).map(n + 1 + a);
			e.replaceWith(i, i + 1, t.type.schema.text("\n"));
		}
	});
}
function Kr(e, t, n) {
	let r = e.resolve(t), i = r.index();
	return r.parent.canReplaceWith(i, i + 1, n);
}
function qr(e, t, n, r, i) {
	let a = e.doc.nodeAt(t);
	if (!a) throw RangeError("No node at given position");
	n ||= a.type;
	let o = n.create(r, null, i || a.marks);
	if (a.isLeaf) return e.replaceWith(t, t + a.nodeSize, o);
	if (!n.validContent(a.content)) throw RangeError("Invalid content for node type " + n.name);
	e.step(new Ar(t, t + a.nodeSize, t + 1, t + a.nodeSize - 1, new M(A.from(o), 0, 0), 1, !0));
}
function Jr(e, t, n = 1, r) {
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
function Yr(e, t, n = 1, r) {
	let i = e.doc.resolve(t), a = A.empty, o = A.empty;
	for (let e = i.depth, t = i.depth - n, s = n - 1; e > t; e--, s--) {
		a = A.from(i.node(e).copy(a));
		let t = r && r[s];
		o = A.from(t ? t.type.create(t.attrs, o) : i.node(e).copy(o));
	}
	e.step(new kr(t, t, new M(a.append(o), n, n), !0));
}
function Xr(e, t) {
	let n = e.resolve(t), r = n.index();
	return Qr(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function Zr(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function Qr(e, t) {
	return !!(e && t && !e.isLeaf && Zr(e, t));
}
function $r(e, t, n = -1) {
	let r = e.resolve(t);
	for (let e = r.depth;; e--) {
		let i, a, o = r.index(e);
		if (e == r.depth ? (i = r.nodeBefore, a = r.nodeAfter) : n > 0 ? (i = r.node(e + 1), o++, a = r.node(e).maybeChild(o)) : (i = r.node(e).maybeChild(o - 1), a = r.node(e + 1)), i && !i.isTextblock && Qr(i, a) && r.node(e).canReplace(o, o + 1)) return t;
		if (e == 0) break;
		t = n < 0 ? r.before(e) : r.after(e);
	}
}
function ei(e, t, n) {
	let r = null, { linebreakReplacement: i } = e.doc.type.schema, a = e.doc.resolve(t - n), o = a.node().type;
	if (i && o.inlineContent) {
		let e = o.whitespace == "pre", t = !!o.contentMatch.matchType(i);
		e && !t ? r = !1 : !e && t && (r = !0);
	}
	let s = e.steps.length;
	if (r === !1) {
		let r = e.doc.resolve(t + n);
		Gr(e, r.node(), r.before(), s);
	}
	o.inlineContent && Pr(e, t + n - 1, o, a.node().contentMatchAt(a.index()), r == null);
	let c = e.mapping.slice(s), l = c.map(t - n);
	if (e.step(new kr(l, c.map(t + n, -1), M.empty, !0)), r === !0) {
		let t = e.doc.resolve(l);
		Wr(e, t.node(), t.before(), e.steps.length);
	}
	return e;
}
function ti(e, t, n) {
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
function ni(e, t, n) {
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
function ri(e, t, n = t, r = M.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return ii(i, a, r) ? new kr(t, n, r) : new ai(i, a, r).fit();
}
function ii(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var ai = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = A.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = A.from(e.node(t).copy(this.placed));
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
		let s = new M(i, a, o);
		return e > -1 ? new Ar(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new kr(n.pos, r.pos, s) : null;
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
			n ? (r = ci(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: a, match: o } = this.frontier[e], s, c = null;
				if (t == 1 && (i ? o.matchType(i.type) || (c = o.fillBefore(A.from(i), !1)) : r && a.compatibleContent(r.type))) return {
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
		return pi(e, -1) <= t ? !1 : (this.unplaced.size > 1 && pi(e, 1) > n && n++, this.unplaced = new M(e, t + 1, n), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = ci(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new M(oi(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new M(oi(e, t, 1), t, n);
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
			c++, (c > 1 || s == 0 || e.content.size) && (u = t, l.push(li(e.mark(d.allowedMarks(e.marks)), c == 1 ? s : 0, c == o.childCount ? f : -1)));
		}
		let p = c == o.childCount;
		p || (f = -1), this.placed = si(this.placed, t, A.from(l)), this.frontier[t].match = u, p && f < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = o; e < f; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = p ? e == 0 ? M.empty : new M(oi(a.content, e - 1, 1), e - 1, f < 0 ? a.openEnd : e - 1) : new M(oi(a.content, e, c), a.openStart, a.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !ui(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = ui(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = ui(e, n, r, t, !0);
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
		t.fit.childCount && (this.placed = si(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = si(this.placed, this.depth, A.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(A.empty, !0);
		e.childCount && (this.placed = si(this.placed, this.frontier.length, e));
	}
};
function oi(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(oi(e.firstChild.content, t - 1, n)));
}
function si(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(si(e.lastChild.content, t - 1, n)));
}
function ci(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function li(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, li(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(A.empty, !0)))), e.copy(r);
}
function ui(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !di(n, a.content, o) ? s : null;
}
function di(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
function fi(e) {
	return e.spec.defining || e.spec.definingForContent;
}
function pi(e, t) {
	for (let n = 0;; n++) {
		let r = t < 0 ? e.firstChild : e.lastChild;
		if (!r || r.isAtom) return n;
		e = r.content;
	}
}
function mi(e, t, n, r) {
	if (!r.size) return e.deleteRange(t, n);
	let i = e.doc.resolve(t), a = e.doc.resolve(n);
	if (ii(i, a, r)) return e.step(new kr(t, n, r));
	let o = vi(i, a);
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
		let t = l[e], n = fi(t.type);
		if (n && !t.sameMarkup(i.node(Math.abs(s) - 1))) u = e;
		else if (n || !t.type.isTextblock) break;
	}
	for (let t = r.openStart; t >= 0; t--) {
		let s = (t + u + 1) % (r.openStart + 1), d = l[s];
		if (d) for (let t = 0; t < o.length; t++) {
			let l = o[(t + c) % o.length], u = !0;
			l < 0 && (u = !1, l = -l);
			let f = i.node(l - 1), p = i.index(l - 1);
			if (f.canReplaceWith(p, p, d.type, d.marks)) return e.replace(i.before(l), u ? a.after(l) : n, new M(hi(r.content, 0, r.openStart, s), s, r.openEnd));
		}
	}
	let d = e.steps.length;
	for (let s = o.length - 1; s >= 0 && (e.replace(t, n, r), !(e.steps.length > d)); s--) {
		let e = o[s];
		e < 0 || (t = i.before(e), n = a.after(e));
	}
}
function hi(e, t, n, r, i) {
	if (t < n) {
		let i = e.firstChild;
		e = e.replaceChild(0, i.copy(hi(i.content, t + 1, n, r, i)));
	}
	if (t > r) {
		let t = i.contentMatchAt(0), n = t.fillBefore(e).append(e);
		e = n.append(t.matchFragment(n).fillBefore(A.empty, !0));
	}
	return e;
}
function gi(e, t, n, r) {
	if (!r.isInline && t == n && e.doc.resolve(t).parent.content.size) {
		let i = ti(e.doc, t, r.type);
		i != null && (t = n = i);
	}
	e.replaceRange(t, n, new M(A.from(r), 0, 0));
}
function _i(e, t, n) {
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
	let a = vi(r, i);
	for (let t = 0; t < a.length; t++) {
		let n = a[t], o = t == a.length - 1;
		if (o && n == 0 || r.node(n).type.contentMatch.validEnd) return e.delete(r.start(n), i.end(n));
		if (n > 0 && (o || r.node(n - 1).canReplace(r.index(n - 1), i.indexAfter(n - 1)))) return e.delete(r.before(n), i.after(n));
	}
	for (let a = 1; a <= r.depth && a <= i.depth; a++) if (t - r.start(a) == r.depth - a && n > r.end(a) && i.end(a) - n != i.depth - a && r.start(a - 1) == i.start(a - 1) && r.node(a - 1).canReplace(r.index(a - 1), i.index(a - 1))) return e.delete(r.before(a), n);
	e.delete(t, n);
}
function vi(e, t) {
	let n = [], r = Math.min(e.depth, t.depth);
	for (let i = r; i >= 0; i--) {
		let r = e.start(i);
		if (r < e.pos - (e.depth - i) || t.end(i) > t.pos + (t.depth - i) || e.node(i).type.spec.isolating || t.node(i).type.spec.isolating) break;
		(r == t.start(i) || i == e.depth && i == t.depth && e.parent.inlineContent && t.parent.inlineContent && i && t.start(i - 1) == r - 1) && n.push(i);
	}
	return n;
}
var yi = class e extends N {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return xr.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return xr.fromReplace(e, this.pos, this.pos + 1, new M(A.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return vr.empty;
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
N.jsonID("attr", yi);
var bi = class e extends N {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return xr.ok(n);
	}
	getMap() {
		return vr.empty;
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
N.jsonID("docAttr", bi);
var xi = class extends Error {};
xi = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, xi.prototype = Object.create(Error.prototype), xi.prototype.constructor = xi, xi.prototype.name = "TransformError";
var Si = class {
	constructor(e) {
		this.doc = e, this.steps = [], this.docs = [], this.mapping = new yr();
	}
	get before() {
		return this.docs.length ? this.docs[0] : this.doc;
	}
	step(e) {
		let t = this.maybeStep(e);
		if (t.failed) throw new xi(t.failed);
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
	replace(e, t = e, n = M.empty) {
		let r = ri(this.doc, e, t, n);
		return r && this.step(r), this;
	}
	replaceWith(e, t, n) {
		return this.replace(e, t, new M(A.from(n), 0, 0));
	}
	delete(e, t) {
		return this.replace(e, t, M.empty);
	}
	insert(e, t) {
		return this.replaceWith(e, e, t);
	}
	replaceRange(e, t, n) {
		return mi(this, e, t, n), this;
	}
	replaceRangeWith(e, t, n) {
		return gi(this, e, t, n), this;
	}
	deleteRange(e, t) {
		return _i(this, e, t), this;
	}
	lift(e, t) {
		return Lr(this, e, t), this;
	}
	join(e, t = 1) {
		return ei(this, e, t), this;
	}
	wrap(e, t) {
		return Hr(this, e, t), this;
	}
	setBlockType(e, t = e, n, r = null) {
		return Ur(this, e, t, n, r), this;
	}
	setNodeMarkup(e, t, n = null, r) {
		return qr(this, e, t, n, r), this;
	}
	setNodeAttribute(e, t, n) {
		return this.step(new yi(e, t, n)), this;
	}
	setDocAttribute(e, t) {
		return this.step(new bi(e, t)), this;
	}
	addNodeMark(e, t) {
		return this.step(new Dr(e, t)), this;
	}
	removeNodeMark(e, t) {
		let n = this.doc.nodeAt(e);
		if (!n) throw RangeError("No node at position " + e);
		if (t instanceof j) t.isInSet(n.marks) && this.step(new Or(e, t));
		else {
			let r = n.marks, i, a = [];
			for (; i = t.isInSet(r);) a.push(new Or(e, i)), r = i.removeFromSet(r);
			for (let e = a.length - 1; e >= 0; e--) this.step(a[e]);
		}
		return this;
	}
	split(e, t = 1, n) {
		return Yr(this, e, t, n), this;
	}
	addMark(e, t, n) {
		return Mr(this, e, t, n), this;
	}
	removeMark(e, t, n) {
		return Nr(this, e, t, n), this;
	}
	clearIncompatible(e, t, n) {
		return Pr(this, e, t, n), this;
	}
}, Ci = Object.create(null), P = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new wi(e.min(t), e.max(t))];
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
	replace(e, t = M.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? M.empty : t), o == 0 && Mi(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), Mi(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new F(e) : ji(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? ji(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : ji(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new ki(e.node(0));
	}
	static atStart(e) {
		return ji(e, e, 0, 0, 1) || new ki(e);
	}
	static atEnd(e) {
		return ji(e, e, e.content.size, e.childCount, -1) || new ki(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = Ci[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in Ci) throw RangeError("Duplicate use of selection JSON ID " + e);
		return Ci[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return F.between(this.$anchor, this.$head).getBookmark();
	}
};
P.prototype.visible = !0;
var wi = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, Ti = !1;
function Ei(e) {
	!Ti && !e.parent.inlineContent && (Ti = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var F = class e extends P {
	constructor(e, t = e) {
		Ei(e), Ei(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return P.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = M.empty) {
		if (super.replace(e, t), t == M.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new Di(this.anchor, this.head);
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
			let e = P.findFrom(n, r, !0) || P.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return P.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (P.findFrom(t, -r, !0) || P.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
P.jsonID("text", F);
var Di = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return F.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, I = class e extends P {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? P.near(a) : new e(a);
	}
	content() {
		return new M(A.from(this.node), 0, 0);
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
		return new Oi(this.anchor);
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
I.prototype.visible = !1, P.jsonID("node", I);
var Oi = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new Di(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && I.isSelectable(n) ? new I(t) : P.near(t);
	}
}, ki = class e extends P {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = M.empty) {
		if (t == M.empty) {
			e.delete(0, e.doc.content.size);
			let t = P.atStart(e.doc);
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
		return Ai;
	}
};
P.jsonID("all", ki);
var Ai = {
	map() {
		return this;
	},
	resolve(e) {
		return new ki(e);
	}
};
function ji(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return F.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = ji(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && I.isSelectable(r)) return I.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function Mi(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof kr || i instanceof Ar)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o ??= r;
	}), e.setSelection(P.near(e.doc.resolve(o), n));
}
var Ni = 1, Pi = 2, Fi = 4, Ii = class extends Si {
	constructor(e) {
		super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
	}
	get selection() {
		return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
	}
	setSelection(e) {
		if (e.$from.doc != this.doc) throw RangeError("Selection passed to setSelection must point at the current document");
		return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Ni) & -3, this.storedMarks = null, this;
	}
	get selectionSet() {
		return (this.updated & Ni) > 0;
	}
	setStoredMarks(e) {
		return this.storedMarks = e, this.updated |= Pi, this;
	}
	ensureMarks(e) {
		return j.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
	}
	addStoredMark(e) {
		return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
	}
	removeStoredMark(e) {
		return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
	}
	get storedMarksSet() {
		return (this.updated & Pi) > 0;
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
		return t && (e = e.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || j.none))), n.replaceWith(this, e), this;
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
			return this.replaceRangeWith(t, n, r.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(P.near(this.selection.$to)), this;
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
		return this.updated |= Fi, this;
	}
	get scrolledIntoView() {
		return (this.updated & Fi) > 0;
	}
};
function Li(e, t) {
	return !t || !e ? e : e.bind(t);
}
var Ri = class {
	constructor(e, t, n) {
		this.name = e, this.init = Li(t.init, n), this.apply = Li(t.apply, n);
	}
}, zi = [
	new Ri("doc", {
		init(e) {
			return e.doc || e.schema.topNodeType.createAndFill();
		},
		apply(e) {
			return e.doc;
		}
	}),
	new Ri("selection", {
		init(e, t) {
			return e.selection || P.atStart(t.doc);
		},
		apply(e) {
			return e.selection;
		}
	}),
	new Ri("storedMarks", {
		init(e) {
			return e.storedMarks || null;
		},
		apply(e, t, n, r) {
			return r.selection.$cursor ? e.storedMarks : null;
		}
	}),
	new Ri("scrollToSelection", {
		init() {
			return 0;
		},
		apply(e, t) {
			return e.scrolledIntoView ? t + 1 : t;
		}
	})
], Bi = class {
	constructor(e, t) {
		this.schema = e, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = zi.slice(), t && t.forEach((e) => {
			if (this.pluginsByKey[e.key]) throw RangeError("Adding different instances of a keyed plugin (" + e.key + ")");
			this.plugins.push(e), this.pluginsByKey[e.key] = e, e.spec.state && this.fields.push(new Ri(e.key, e.spec.state, e));
		});
	}
}, Vi = class e {
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
		return new Ii(this);
	}
	static create(t) {
		let n = new Bi(t.doc ? t.doc.type.schema : t.schema, t.plugins), r = new e(n);
		for (let e = 0; e < n.fields.length; e++) r[n.fields[e].name] = n.fields[e].init(t, r);
		return r;
	}
	reconfigure(t) {
		let n = new Bi(this.schema, t.plugins), r = n.fields, i = new e(n);
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
		let i = new Bi(t.schema, t.plugins), a = new e(i);
		return i.fields.forEach((e) => {
			if (e.name == "doc") a.doc = fn.fromJSON(t.schema, n.doc);
			else if (e.name == "selection") a.selection = P.fromJSON(a.doc, n.selection);
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
function Hi(e, t, n) {
	for (let r in e) {
		let i = e[r];
		i instanceof Function ? i = i.bind(t) : r == "handleDOMEvents" && (i = Hi(i, t, {})), n[r] = i;
	}
	return n;
}
var L = class {
	constructor(e) {
		this.spec = e, this.props = {}, e.props && Hi(e.props, this, this.props), this.key = e.key ? e.key.key : Wi("plugin");
	}
	getState(e) {
		return e[this.key];
	}
}, Ui = Object.create(null);
function Wi(e) {
	return e in Ui ? e + "$" + ++Ui[e] : (Ui[e] = 0, e + "$");
}
var R = class {
	constructor(e = "key") {
		this.key = Wi(e);
	}
	get(e) {
		return e.config.pluginsByKey[this.key];
	}
	getState(e) {
		return e[this.key];
	}
}, Gi = (e, t) => !e.selection.empty && (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function Ki(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var qi = (e, t, n) => {
	let r = Ki(e, n);
	if (!r) return !1;
	let i = $i(r);
	if (!i) {
		let n = r.blockRange(), i = n && Ir(n);
		return i != null && (t && t(e.tr.lift(n, i).scrollIntoView()), !0);
	}
	let a = i.nodeBefore;
	if (_a(e, i, t, -1)) return !0;
	if (r.parent.content.size == 0 && (Zi(a, "end") || I.isSelectable(a))) for (let n = r.depth;; n--) {
		let o = ri(e.doc, r.before(n), r.after(n), M.empty);
		if (o && o.slice.size < o.to - o.from) {
			if (t) {
				let n = e.tr.step(o);
				n.setSelection(Zi(a, "end") ? P.findFrom(n.doc.resolve(n.mapping.map(i.pos, -1)), -1) : I.create(n.doc, i.pos - a.nodeSize)), t(n.scrollIntoView());
			}
			return !0;
		}
		if (n == 1 || r.node(n - 1).childCount > 1) break;
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos - a.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Ji = (e, t, n) => {
	let r = Ki(e, n);
	if (!r) return !1;
	let i = $i(r);
	return i ? Xi(e, i, t) : !1;
}, Yi = (e, t, n) => {
	let r = ea(e, n);
	if (!r) return !1;
	let i = ra(r);
	return i ? Xi(e, i, t) : !1;
};
function Xi(e, t, n) {
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
	let s = ri(e.doc, i, o, M.empty);
	if (!s || s.from != i || s instanceof kr && s.slice.size >= o - i) return !1;
	if (n) {
		let t = e.tr.step(s);
		t.setSelection(F.create(t.doc, i)), n(t.scrollIntoView());
	}
	return !0;
}
function Zi(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var Qi = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("backward", e) : r.parentOffset > 0) return !1;
		a = $i(r);
	}
	let o = a && a.nodeBefore;
	return !o || !I.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(I.create(e.doc, a.pos - o.nodeSize)).scrollIntoView()), !0);
};
function $i(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function ea(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var ta = (e, t, n) => {
	let r = ea(e, n);
	if (!r) return !1;
	let i = ra(r);
	if (!i) return !1;
	let a = i.nodeAfter;
	if (_a(e, i, t, 1)) return !0;
	if (r.parent.content.size == 0 && (Zi(a, "start") || I.isSelectable(a))) {
		let n = ri(e.doc, r.before(), r.after(), M.empty);
		if (n && n.slice.size < n.to - n.from) {
			if (t) {
				let r = e.tr.step(n);
				r.setSelection(Zi(a, "start") ? P.findFrom(r.doc.resolve(r.mapping.map(i.pos)), 1) : I.create(r.doc, r.mapping.map(i.pos))), t(r.scrollIntoView());
			}
			return !0;
		}
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos, i.pos + a.nodeSize).scrollIntoView()), !0) : !1;
}, na = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("forward", e) : r.parentOffset < r.parent.content.size) return !1;
		a = ra(r);
	}
	let o = a && a.nodeAfter;
	return !o || !I.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(I.create(e.doc, a.pos)).scrollIntoView()), !0);
};
function ra(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var ia = (e, t) => {
	let n = e.selection, r = n instanceof I, i;
	if (r) {
		if (n.node.isTextblock || !Xr(e.doc, n.from)) return !1;
		i = n.from;
	} else if (i = $r(e.doc, n.from, -1), i == null) return !1;
	if (t) {
		let n = e.tr.join(i);
		r && n.setSelection(I.create(n.doc, i - e.doc.resolve(i).nodeBefore.nodeSize)), t(n.scrollIntoView());
	}
	return !0;
}, aa = (e, t) => {
	let n = e.selection, r;
	if (n instanceof I) {
		if (n.node.isTextblock || !Xr(e.doc, n.to)) return !1;
		r = n.to;
	} else if (r = $r(e.doc, n.to, 1), r == null) return !1;
	return t && t(e.tr.join(r).scrollIntoView()), !0;
}, oa = (e, t) => {
	let { $from: n, $to: r } = e.selection, i = n.blockRange(r), a = i && Ir(i);
	return a != null && (t && t(e.tr.lift(i, a).scrollIntoView()), !0);
}, sa = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function ca(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var la = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), a = n.indexAfter(-1), o = ca(i.contentMatchAt(a));
	if (!o || !i.canReplaceWith(a, a, o)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, o.createAndFill());
		i.setSelection(P.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, ua = (e, t) => {
	let n = e.selection, { $from: r, $to: i } = n;
	if (n instanceof ki || r.parent.inlineContent || i.parent.inlineContent) return !1;
	let a = ca(i.parent.contentMatchAt(i.indexAfter()));
	if (!a || !a.isTextblock) return !1;
	if (t) {
		let n = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = e.tr.insert(n, a.createAndFill());
		o.setSelection(F.create(o.doc, n + 1)), t(o.scrollIntoView());
	}
	return !0;
}, da = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (Jr(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && Ir(r);
	return i != null && (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function fa(e) {
	return (t, n) => {
		if (t.selection instanceof I && t.selection.node.isBlock) {
			let { $from: e } = t.selection;
			return !e.parentOffset || !Jr(t.doc, e.pos) ? !1 : (n && n(t.tr.split(e.pos).scrollIntoView()), !0);
		}
		if (!t.selection.$from.depth) return !1;
		let r = t.tr;
		!t.selection.empty && (t.selection instanceof F || t.selection instanceof ki) && r.deleteSelection();
		let { $from: i } = r.selection, a = r.steps.length, o = [], s, c, l = !1, u = !1;
		for (let t = i.depth;; t--) if (i.node(t).isBlock) {
			l = i.end(t) == i.pos + (i.depth - t), u = i.start(t) == i.pos - (i.depth - t), c = ca(i.node(t - 1).contentMatchAt(i.indexAfter(t - 1)));
			let n = e && e(i.parent, l, i);
			o.unshift(n || (l && c ? { type: c } : null)), s = t;
			break;
		} else {
			if (t == 1) return !1;
			o.unshift(null);
		}
		let d = i.pos, f = Jr(r.doc, d, o.length, o);
		if (f ||= (o[0] = c ? { type: c } : null, Jr(r.doc, d, o.length, o)), !f) return !1;
		if (r.split(d, o.length, o), !l && u && i.node(s).type != c) {
			let e = r.mapping.slice(a), t = e.map(i.before(s)), n = r.doc.resolve(t);
			c && i.node(s - 1).canReplaceWith(n.index(), n.index() + 1, c) && r.setNodeMarkup(e.map(i.before(s)), c);
		}
		return n && n(r.scrollIntoView()), !0;
	};
}
var pa = fa(), ma = (e, t) => {
	let { $from: n, to: r } = e.selection, i, a = n.sharedDepth(r);
	return a != 0 && (i = n.before(a), t && t(e.tr.setSelection(I.create(e.doc, i))), !0);
}, ha = (e, t) => (t && t(e.tr.setSelection(new ki(e.doc))), !0);
function ga(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || Xr(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function _a(e, t, n, r) {
	let i = t.nodeBefore, a = t.nodeAfter, o, s, c = i.type.spec.isolating || a.type.spec.isolating;
	if (!c && ga(e, t, n)) return !0;
	let l = !c && t.parent.canReplace(t.index(), t.index() + 1);
	if (l && (o = (s = i.contentMatchAt(i.childCount)).findWrapping(a.type)) && s.matchType(o[0] || a.type).validEnd) {
		if (n) {
			let r = t.pos + a.nodeSize, s = A.empty;
			for (let e = o.length - 1; e >= 0; e--) s = A.from(o[e].create(null, s));
			s = A.from(i.copy(s));
			let c = e.tr.step(new Ar(t.pos - 1, r, t.pos, r, new M(s, 1, 0), o.length, !0)), l = c.doc.resolve(r + 2 * o.length);
			l.nodeAfter && l.nodeAfter.type == i.type && Xr(c.doc, l.pos) && c.join(l.pos), n(c.scrollIntoView());
		}
		return !0;
	}
	let u = a.type.spec.isolating || r > 0 && c ? null : P.findFrom(t, 1), d = u && u.$from.blockRange(u.$to), f = d && Ir(d);
	if (f != null && f >= t.depth) return n && n(e.tr.lift(d, f).scrollIntoView()), !0;
	if (l && Zi(a, "start", !0) && Zi(i, "end")) {
		let r = i, o = [];
		for (; o.push(r), !r.isTextblock;) r = r.lastChild;
		let s = a, c = 1;
		for (; !s.isTextblock; s = s.firstChild) c++;
		if (r.canReplace(r.childCount, r.childCount, s.content)) {
			if (n) {
				let r = A.empty;
				for (let e = o.length - 1; e >= 0; e--) r = A.from(o[e].copy(r));
				n(e.tr.step(new Ar(t.pos - o.length, t.pos + a.nodeSize, t.pos + c, t.pos + a.nodeSize - c, new M(r, o.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function va(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(F.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var ya = va(-1), ba = va(1);
function xa(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a), s = o && Rr(o, e, t);
		return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
	};
}
function Sa(e, t = null) {
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
function Ca(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var wa = Ca(Gi, qi, Qi), Ta = Ca(Gi, ta, na), Ea = {
	Enter: Ca(sa, ua, da, pa),
	"Mod-Enter": la,
	Backspace: wa,
	"Mod-Backspace": wa,
	"Shift-Backspace": wa,
	Delete: Ta,
	"Mod-Delete": Ta,
	"Mod-a": ha
}, Da = {
	"Ctrl-h": Ea.Backspace,
	"Alt-Backspace": Ea["Mod-Backspace"],
	"Ctrl-d": Ea.Delete,
	"Ctrl-Alt-Backspace": Ea["Mod-Delete"],
	"Alt-Delete": Ea["Mod-Delete"],
	"Alt-d": Ea["Mod-Delete"],
	"Ctrl-a": ya,
	"Ctrl-e": ba
};
for (let e in Ea) Da[e] = Ea[e];
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform();
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-schema-list/dist/index.js
function Oa(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return ka(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function ka(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new un(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new un(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = Rr(a, n, r, t);
	return s ? (e && Aa(e, t, s, i, n), !0) : !1;
}
function Aa(e, t, n, r, i) {
	let a = A.empty;
	for (let e = n.length - 1; e >= 0; e--) a = A.from(n[e].type.create(n[e].attrs, a));
	e.step(new Ar(t.start - (r ? 2 : 0), t.end, t.start, t.end, new M(a, 0, 0), n.length, !0));
	let o = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (o = e + 1);
	let s = n.length - o, c = t.start + n.length - (r ? 2 : 0), l = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && Jr(e.doc, c, s) && (e.split(c, s), c += 2 * s), c += l.child(n).nodeSize;
	return e;
}
function ja(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		return a ? n ? r.node(a.depth - 1).type == e ? Ma(t, n, e, a) : Na(t, n, a) : !0 : !1;
	};
}
function Ma(e, t, n, r) {
	let i = e.tr, a = r.end, o = r.$to.end(r.depth);
	a < o && (i.step(new Ar(a - 1, o, a, o, new M(A.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new un(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
	let s = Ir(r);
	if (s == null) return !1;
	i.lift(r, s);
	let c = i.doc.resolve(i.mapping.map(a, -1) - 1);
	return Xr(i.doc, c.pos) && c.nodeBefore.type == c.nodeAfter.type && i.join(c.pos), t(i.scrollIntoView()), !0;
}
function Na(e, t, n) {
	let r = e.tr, i = n.parent;
	for (let e = n.end, t = n.endIndex - 1, a = n.startIndex; t > a; t--) e -= i.child(t).nodeSize, r.delete(e - 1, e + 1);
	let a = r.doc.resolve(n.start), o = a.nodeAfter;
	if (r.mapping.map(n.end) != n.start + a.nodeAfter.nodeSize) return !1;
	let s = n.startIndex == 0, c = n.endIndex == i.childCount, l = a.node(-1), u = a.index(-1);
	if (!l.canReplace(u + +!s, u + 1, o.content.append(c ? A.empty : A.from(i)))) return !1;
	let d = a.pos, f = d + o.nodeSize;
	return r.step(new Ar(d - +!!s, f + +!!c, d + 1, f - 1, new M((s ? A.empty : A.from(i.copy(A.empty))).append(c ? A.empty : A.from(i.copy(A.empty))), +!s, +!c), +!s)), t(r.scrollIntoView()), !0;
}
function Pa(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		if (!a) return !1;
		let o = a.startIndex;
		if (o == 0) return !1;
		let s = a.parent, c = s.child(o - 1);
		if (c.type != e) return !1;
		if (n) {
			let r = c.lastChild && c.lastChild.type == s.type, i = A.from(r ? e.create() : null), o = new M(A.from(e.create(null, A.from(s.type.create(null, i)))), r ? 3 : 1, 0), l = a.start, u = a.end;
			n(t.tr.step(new Ar(l - (r ? 3 : 1), u, l, u, o, 1, !0)).scrollIntoView());
		}
		return !0;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-view/dist/index.js
var z = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, Fa = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, Ia = null, La = function(e, t, n) {
	let r = Ia ||= document.createRange();
	return r.setEnd(e, n ?? e.nodeValue.length), r.setStart(e, t || 0), r;
}, Ra = function() {
	Ia = null;
}, za = function(e, t, n, r) {
	return n && (Va(e, t, n, r, -1) || Va(e, t, n, r, 1));
}, Ba = /^(img|br|input|textarea|hr)$/i;
function Va(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : Ha(e))) {
			let n = e.parentNode;
			if (!n || !B(n) || qa(e) || Ba.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = z(e) + (i < 0 ? 0 : 1), e = n;
		} else if (B(e)) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (B(n) && n.contentEditable == "false") {
				if (n.pmViewDesc?.ignoreForSelection) t += i;
				else return !1;
			} else e = n, t = i < 0 ? Ha(e) : 0;
		} else return !1;
	}
}
function Ha(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function B(e) {
	return e.nodeType == 1;
}
function V(e) {
	return e.nodeType == 3;
}
function Ua(e, t) {
	return t ? e.contains(B(t) ? t : t.parentNode) : !1;
}
function Wa(e, t) {
	for (;;) {
		if (V(e) && t) return e;
		if (B(e) && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = Ha(e);
		} else if (e.parentNode && !qa(e)) t = z(e), e = e.parentNode;
		else return null;
	}
}
function Ga(e, t) {
	for (;;) {
		if (V(e) && t < e.nodeValue.length) return e;
		if (B(e) && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !qa(e)) t = z(e) + 1, e = e.parentNode;
		else return null;
	}
}
function Ka(e, t, n) {
	for (let r = t == 0, i = t == Ha(e); r || i;) {
		if (e == n) return !0;
		let t = z(e);
		if (e = e.parentNode, !e) return !1;
		r &&= t == 0, i &&= t == Ha(e);
	}
}
function qa(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var Ja = function(e) {
	return e.focusNode && za(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function Ya(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function Xa(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function Za(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(Ha(r.offsetNode), r.offset)
		};
	} catch {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(Ha(r.startContainer), r.startOffset)
		};
	}
}
var Qa = typeof navigator < "u" ? navigator : null, $a = typeof document < "u" ? document : null, eo = Qa && Qa.userAgent || "", to = /Edge\/(\d+)/.exec(eo), no = /MSIE \d/.exec(eo), ro = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(eo), io = !!(no || ro || to), ao = no ? document.documentMode : ro ? +ro[1] : to ? +to[1] : 0, oo = !io && /gecko\/(\d+)/i.test(eo);
oo && +(/Firefox\/(\d+)/.exec(eo) || [0, 0])[1];
var so = !io && /Chrome\/(\d+)/.exec(eo), H = !!so, co = so ? +so[1] : 0, lo = !io && !!Qa && /Apple Computer/.test(Qa.vendor), uo = lo && (/Mobile\/\w+/.test(eo) || !!Qa && Qa.maxTouchPoints > 2), fo = uo || (Qa ? /Mac/.test(Qa.platform) : !1), po = Qa ? /Win/.test(Qa.platform) : !1, mo = /Android \d/.test(eo), ho = !!$a && "webkitFontSmoothing" in $a.documentElement.style, go = ho ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function _o(e) {
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
function vo(e, t) {
	return typeof e == "number" ? e : e[t];
}
function yo(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function bo(e, t, n) {
	if (!Fo(t) && t.left == 0) return;
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (!B(o)) {
			o = Fa(o);
			continue;
		}
		let e = o == a.body, n = e ? _o(a) : yo(o), s = 0, c = 0;
		if (t.top < n.top + vo(r, "top") ? c = -(n.top - t.top + vo(i, "top")) : t.bottom > n.bottom - vo(r, "bottom") && (c = t.bottom - t.top > n.bottom - n.top ? t.top + vo(i, "top") - n.top : t.bottom - n.bottom + vo(i, "bottom")), t.left < n.left + vo(r, "left") ? s = -(n.left - t.left + vo(i, "left")) : t.right > n.right - vo(r, "right") && (s = t.right - n.right + vo(i, "right")), s || c) {
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
		o = l == "absolute" ? o.offsetParent : Fa(o);
	}
}
function xo(e) {
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
		stack: So(e.dom)
	};
}
function So(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = Fa(r));
	return t;
}
function Co({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	wo(n, r == 0 ? 0 : r - t);
}
function wo(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var To = null;
function Eo(e) {
	if (e.setActive) return e.setActive();
	if (To) return e.focus(To);
	let t = So(e);
	e.focus(To == null ? { get preventScroll() {
		return To = { preventScroll: !0 }, !0;
	} } : void 0), To || (To = !1, wo(t, 0));
}
function Do(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (B(u)) e = u.getClientRects();
		else if (V(u)) e = La(u).getClientRects();
		else continue;
		for (let f = 0; f < e.length; f++) {
			let p = e[f];
			if (p.top <= o && p.bottom >= s) {
				o = Math.max(p.bottom, o), s = Math.min(p.top, s);
				let e = p.left > t.left ? p.left - t.left : p.right < t.left ? t.left - p.right : 0;
				if (e < r) {
					n = u, r = e, i = e && V(n) ? {
						left: p.right < t.left ? p.right : p.left,
						top: t.top
					} : t, B(u) && e && (a = d + +(t.left >= (p.left + p.right) / 2));
					continue;
				}
			} else p.top > t.top && !c && p.left <= t.left && p.right >= t.left && (c = u, l = {
				left: Math.max(p.left, Math.min(p.right, t.left)),
				top: p.top
			});
			!n && (t.left >= p.right && t.top >= p.top || t.left >= p.left && t.top >= p.bottom) && (a = d + 1);
		}
	}
	return !n && c && (n = c, i = l, r = 0), n && V(n) ? Oo(n, i) : !n || r ? {
		node: e,
		offset: a
	} : Do(n, i);
}
function Oo(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = Io(r, 1);
		if (n.top != n.bottom && ko(t, n)) {
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
function ko(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function Ao(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function jo(e, t, n) {
	let { node: r, offset: i } = Do(t, n), a = -1;
	if (B(r) && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function Mo(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (B(t.dom) && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function No(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (B(n)) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (ko(t, i)) return No(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function Po(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = Za(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o)) {
		let n = e.dom.getBoundingClientRect();
		if (!ko(t, n) || (o = No(e.dom, t, n), !o)) return null;
	}
	if (lo) for (let e = o; r && e; e = Fa(e)) e.draggable && (r = void 0);
	if (o = Ao(o, t), r) {
		if (oo && B(r) && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		ho && i && B(r) && B(n = r.childNodes[i - 1]) && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && B(r.lastChild) && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : i != 0 && B(r) && r.childNodes[i - 1].nodeName == "BR" || (s = Mo(e, r, i, t));
	}
	s ??= jo(e, o, t);
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function Fo(e) {
	return e.top < e.bottom || e.left < e.right;
}
function Io(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (Fo(e)) return e;
	}
	return Array.prototype.find.call(n, Fo) || e.getBoundingClientRect();
}
var Lo = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Ro(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = ho || oo;
	if (V(r)) {
		if (o && (Lo.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
			let e = Io(La(r, i, i), n);
			if (oo && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
				let t = Io(La(r, i - 1, i - 1), -1);
				if (t.top == e.top) {
					let n = Io(La(r, i, i + 1), -1);
					if (n.top != e.top) return zo(n, n.left < t.left);
				}
			}
			return e;
		}
		{
			let e = i, t = i, a = n < 0 ? 1 : -1;
			return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, zo(Io(La(r, e, t), a), a < 0);
		}
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == Ha(r))) {
			let e = r.childNodes[i - 1];
			if (B(e)) return Bo(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < Ha(r)) {
			let e = r.childNodes[i];
			if (B(e)) return Bo(e.getBoundingClientRect(), !0);
		}
		return Bo(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == Ha(r))) {
		let e = r.childNodes[i - 1], t = V(e) ? La(e, Ha(e) - +!o) : B(e) && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return zo(Io(t, 1), !1);
	}
	if (a == null && i < Ha(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? V(e) ? La(e, 0, +!o) : B(e) ? e : null : null;
		if (t) return zo(Io(t, -1), !0);
	}
	return zo(Io(V(r) ? La(r) : r, -n), n >= 0);
}
function zo(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function Bo(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function Vo(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function Ho(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return Vo(e, t, () => {
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
		let r = Ro(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (B(e)) t = e.getClientRects();
			else if (V(e)) t = La(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var Uo = /[\u0590-\u08ac]/;
function Wo(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !Uo.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : Vo(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !Ua(l, u) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var Go = null, Ko = null, qo = !1;
function Jo(e, t, n) {
	return Go == t && Ko == n ? qo : (Go = t, Ko = n, qo = n == "up" || n == "down" ? Ho(e, t, n) : Wo(e, t, n));
}
var Yo = 0, Xo = 1, Zo = 2, Qo = 3, $o = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = Yo, n.pmViewDesc = this;
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
		if (this.contentDOM && Ua(this.contentDOM, e)) {
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
		if (e == this.dom && this.contentDOM) r = t > z(this.contentDOM);
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
				if (n && (a = i.nodeDOM) && !(B(a) ? Ua(a, e) : a == e)) n = !1;
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
			if (e.size || !(e instanceof ss || e instanceof es && e.side >= 0)) break;
		}
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, e && e.dom.parentNode != this.contentDOM; n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? z(e.dom) + 1 : 0
			};
		}
		{
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, e && e.dom.parentNode != this.contentDOM; n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? z(e.dom) : this.contentDOM.childNodes.length
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
						r = z(n.dom) + 1;
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
						i = z(n.dom);
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
		if (!B(t) || n == t.childNodes.length) throw RangeError("No node after pos " + e);
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
		if ((oo || lo) && e == t) {
			let { node: e, offset: t } = o;
			if (V(e)) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: z(n) + 1
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
		if (oo && l.focusNode && l.focusNode != s.node && B(l.focusNode)) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && lo) && za(o.node, o.offset, l.anchorNode, l.anchorOffset) && za(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && oo)) {
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
					this.dirty = e == n || t == a ? Zo : Xo, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = Qo : i.markDirty(e - r, t - r);
					return;
				}
				i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? Zo : Qo;
			}
			n = a;
		}
		this.dirty = Zo;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? Zo : Xo;
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
}, es = class extends $o {
	constructor(e, t, n, r) {
		let i, a = t.type.toDOM;
		if (typeof a == "function" && (a = a(n, () => {
			if (!i) return r;
			if (i.parent) return i.parent.posBeforeChild(i);
		})), !t.type.spec.raw) {
			let e = B(a) ? a : document.createElement("span");
			e != a && e.appendChild(a), e.hasAttribute("contenteditable") || (e.contentEditable = "false"), e.classList.add("ProseMirror-widget");
		}
		super(e, [], a, null), this.widget = t, this.widget = t, i = this;
	}
	matchesWidget(e) {
		return this.dirty == Yo && e.type.eq(this.widget.type);
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
}, ts = class extends $o {
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
}, ns = class e extends $o {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return o && o.dom || (o = tr.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & Qo || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != Qo && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != Yo) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = Yo;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = ws(a, n, o, r)), t > 0 && (a = ws(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, rs = class e extends $o {
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
			else if (!V(u)) throw RangeError("Text must be rendered as a DOM text node");
		} else if (!u) {
			let e = tr.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = hs(u, r, n), l ? c = new cs(t, n, r, i, u, d || null, f, l) : n.isText ? new as(t, n, r, i, u, f) : new e(t, n, r, i, u, d || null, f);
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
				let n = e && e.find((t) => B(t) && e.indexOf(t.parentNode) < 0 && this.dom.contains(t));
				n ? t.contentElement = n : t.getContent = () => A.empty;
			}
		}
		return t;
	}
	matchesNode(e, t, n) {
		return this.dirty == Yo && e.eq(this.node) && gs(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new vs(this, a && a.node, e), c = this.node.inlineContent, l = c && this.node.isBlock;
		xs(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? j.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, u, d) => {
			s.syncToMarks(t.marks, n, e, d), l && t.isAtom && !t.isText && s.addHackNode("IMG", s.top);
			let f;
			s.findNodeMatch(t, a, u, d) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (f = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, u, f, e) || s.updateNextNode(t, a, u, e, d, r) || s.addNode(t, a, u, e, r), r += t.nodeSize, c && (l = t.isAtom && !t.isText);
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == Zo) && (a && this.protectLocalComposition(e, a), ls(this.contentDOM, this.children, e), uo && Ss(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof F) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = Cs(this.node.content, e, n - t, r - t);
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
		let a = new ts(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = ws(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == Qo || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = Yo;
	}
	updateOuterDeco(e) {
		if (gs(e, this.outerDeco)) return;
		let t = !B(this.nodeDOM), n = this.dom;
		this.dom = ps(this.dom, this.nodeDOM, fs(this.outerDeco, this.node, t), fs(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
	}
	selectNode() {
		B(this.nodeDOM) && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
	}
	deselectNode() {
		B(this.nodeDOM) && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
	}
	get domAtom() {
		return this.node.isAtom;
	}
};
function is(e, t, n, r, i) {
	hs(r, t, e);
	let a = new rs(void 0, e, t, n, r, r, r);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var as = class e extends rs {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i, null, a);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == Qo || this.dirty != Yo && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != Yo || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = Yo, !0);
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
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Qo);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, ss = class extends $o {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == Yo && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, cs = class extends rs {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, t, n, r, i, a, o), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == Qo) return !1;
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
function ls(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = _s(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof ns) {
			let t = r ? r.previousSibling : e.lastChild;
			ls(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = _s(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var us = function(e) {
	e && (this.nodeName = e);
};
us.prototype = Object.create(null);
var ds = [new us()];
function fs(e, t, n) {
	if (e.length == 0) return ds;
	let r = n ? ds[0] : new us(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new us(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new us(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function ps(e, t, n, r) {
	if (n == ds && r == ds) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName || (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = ds[0]), i = t;
		}
		ms(i, o || ds[0], a);
	}
	return i;
}
function ms(e, t, n) {
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
function hs(e, t, n) {
	return ps(e, e, ds, fs(t, n, !B(e)));
}
function gs(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function _s(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var vs = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = ys(e.node.content, e);
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
		for (; i < a;) this.destroyRest(), this.top.dirty = Yo, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
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
				t instanceof ns && t.dirty != Qo && t.mark.type == e[a].type && t.spec.update && !this.isLocked(t.dom) && t.spec.update(e[a]) && (t.mark = e[a], i = this.index, this.changed = !0);
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = ns.create(this.top, e[a], t, n);
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
		return a.dirty == Qo && a.dom == a.contentDOM && (a.dirty = Zo), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
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
			if (s instanceof rs) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != Qo && gs(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = Zo, u.updateChildren(r, a + 1), u.dirty = Yo), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !gs(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = rs.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = rs.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new es(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof ns;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof as) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((lo || H) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new ss(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || B(e) && e.contains(this.lock.parentNode));
	}
};
function ys(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof ns) n = e, r = e.children.length;
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
function bs(e, t) {
	return e.type.side - t.type.side;
}
function xs(e, t, n, r) {
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
				d.sort(bs);
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
function Ss(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function Cs(e, t, n, r) {
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
function ws(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i &&= (a.push(i), void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function Ts(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (Ja(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		if (i && i.node.isAtom && I.isSelectable(i.node) && i.parent && !(i.node.isInline && Ka(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new I(o == e ? s : r.resolve(e));
		} else if (oo && t == "key" && o > e.state.selection.to && B(n.focusNode) && n.focusOffset == n.focusNode.childNodes.length && i && i.posAtStart > e.state.selection.to) for (let e = n.focusNode;; e = e.parentNode) {
			if (getComputedStyle(e).overflow != "visible") {
				l = P.findFrom(r.resolve(i.posAtStart), 1);
				break;
			}
			if (e == i.dom || e.nextSibling || !e.parentNode || !B(e.parentNode)) break;
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
		l = Is(e, u, s, n);
	}
	return l;
}
function Es(e) {
	return e.editable ? e.hasFocus() : Rs(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function Ds(e, t = !1) {
	let n = e.state.selection;
	if (Ps(e, n), !Es(e)) return;
	let r = e.input.mouseDown;
	if (!t && H && r) {
		let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
		if (t.anchorNode && n.anchorNode && za(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset) && r.delaySelUpdate()) {
			e.domObserver.setCurSelection();
			return;
		}
	}
	if (e.domObserver.disconnectSelection(), e.cursorWrapper) Ns(e);
	else {
		let { anchor: r, head: i } = n, a, o;
		Os && !(n instanceof F) && (n.$from.parent.inlineContent || (a = ks(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = ks(e, n.to))), e.docView.setSelection(r, i, e, t), Os && (a && js(a), o && js(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Ms(e));
	}
	e.domObserver.setCurSelection(), e.domObserver.connectSelection();
}
var Os = lo || H && co < 63;
function ks(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (lo && i && i.contentEditable == "false") return As(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return As(i);
		if (a) return As(a);
	}
}
function As(e) {
	return e.contentEditable = "true", lo && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function js(e) {
	e.contentEditable = "false", e.wasDraggable &&= (e.draggable = !0, null);
}
function Ms(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!Es(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function Ns(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, z(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && io && ao <= 11 && (n.disabled = !0, n.disabled = !1);
}
function Ps(e, t) {
	if (t instanceof I) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (Fs(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else Fs(e);
}
function Fs(e) {
	e.lastSelectedViewDesc &&= (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), void 0);
}
function Is(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || F.between(t, n, r);
}
function Ls(e) {
	return e.editable && !e.hasFocus() ? !1 : Rs(e);
}
function Rs(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return Ua(e.dom, t.anchorNode) && (e.editable || Ua(e.dom, t.focusNode));
	} catch {
		return !1;
	}
}
function zs(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return za(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function Bs(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && P.findFrom(a, t);
}
function Vs(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function Hs(e, t, n) {
	let r = e.state.selection;
	if (r instanceof F) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return Vs(e, new F(r.$anchor, a));
		}
		if (!r.empty) return !1;
		if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = Bs(e.state, t);
			return n && n instanceof I ? Vs(e, n) : !1;
		}
		if (!(fo && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? I.isSelectable(i) ? Vs(e, new I(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : Vs(e, new F(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1;
		}
	} else if (r instanceof I && r.node.isInline) return Vs(e, new F(t > 0 ? r.$to : r.$from));
	else {
		let n = Bs(e.state, t);
		return n ? Vs(e, n) : !1;
	}
}
function Us(e, t) {
	let n = e.pmViewDesc;
	return n ? n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR") : B(e) && e.contentEditable == "false";
}
function Ws(e, t) {
	return t < 0 ? Gs(e) : Ks(e);
}
function Gs(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (oo && B(n) && r < Ha(n) && Us(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (!B(n)) break;
		let e = n.childNodes[r - 1];
		if (Us(e, -1)) i = n, a = --r;
		else if (V(e)) n = e, r = n.nodeValue.length;
		else break;
	} else if (qs(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && Us(t, -1);) i = n.parentNode, a = z(t), t = t.previousSibling;
		if (t) n = t, r = Ha(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? Xs(e, n, r) : i && Xs(e, i, a);
}
function Ks(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = Ha(n), a, o;
	for (;;) if (r < i) {
		if (!B(n)) break;
		let e = n.childNodes[r];
		if (Us(e, 1)) a = n, o = ++r;
		else break;
	} else if (qs(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && Us(t, 1);) a = t.parentNode, o = z(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = Ha(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && Xs(e, a, o);
}
function qs(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function Js(e, t) {
	for (; e && t == e.childNodes.length && !qa(e);) t = z(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (V(n)) return n;
		if (B(n) && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function Ys(e, t) {
	for (; e && !t && !qa(e);) t = z(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (V(n)) return n;
		if (B(n) && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function Xs(e, t, n) {
	if (!V(t)) {
		let e, r;
		(r = Js(t, n)) ? (t = r, n = 0) : (e = Ys(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (Ja(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && Ds(e);
	}, 50);
}
function Zs(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(H || po) && n.parent.inlineContent) {
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
function Qs(e, t, n) {
	let r = e.state.selection;
	if (r instanceof F && !r.empty || n.indexOf("s") > -1 || fo && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = Bs(e.state, t);
		if (n && n instanceof I) return Vs(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof ki ? P.near(n, t) : P.findFrom(n, t);
		return o ? Vs(e, o) : !1;
	}
	return !1;
}
function $s(e, t) {
	if (!(e.state.selection instanceof F)) return !0;
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
function ec(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function tc(e) {
	if (!lo || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && B(t) && n == 0 && t.firstChild && B(t.firstChild) && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		ec(e, n, "true"), setTimeout(() => ec(e, n, "false"), 20);
	}
	return !1;
}
function nc(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function rc(e, t) {
	let n = t.keyCode, r = nc(t);
	if (n == 8 || fo && n == 72 && r == "c") return $s(e, -1) || Ws(e, -1);
	if (n == 46 && !t.shiftKey || fo && n == 68 && r == "c") return $s(e, 1) || Ws(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || fo && n == 66 && r == "c") {
		let t = n == 37 ? Zs(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return Hs(e, t, r) || Ws(e, t);
	}
	if (n == 39 || fo && n == 70 && r == "c") {
		let t = n == 39 ? Zs(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return Hs(e, t, r) || Ws(e, t);
	}
	return n == 38 || fo && n == 80 && r == "c" ? Qs(e, -1, r) || Ws(e, -1) : n == 40 || fo && n == 78 && r == "c" ? tc(e) || Qs(e, 1, r) || Ws(e, 1) : !(r != (fo ? "m" : "c") || n != 66 && n != 73 && n != 89 && n != 90);
}
function ic(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || tr.fromSchema(e.state.schema), s = mc(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && B(l) && (u = pc[l.nodeName.toLowerCase()]);) {
		for (let e = u.length - 1; e >= 0; e--) {
			let t = s.createElement(u[e]);
			for (; c.firstChild;) t.appendChild(c.firstChild);
			c.appendChild(t), d++;
		}
		l = c.firstChild;
	}
	return l && B(l) && l.setAttribute("data-pm-slice", `${i} ${a}${d ? ` -${d}` : ""} ${JSON.stringify(n)}`), {
		dom: c,
		text: e.someProp("clipboardTextSerializer", (n) => n(t, e)) || t.content.textBetween(0, t.content.size, "\n\n"),
		slice: t
	};
}
function ac(e, t, n, r, i) {
	let a = i.parent.type.spec.code, o, s;
	if (!n && !t) return null;
	let c = !!t && (r || a || !n);
	if (c) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, a || r, e);
		}), a) return s = new M(A.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			s = t(s, e, !0);
		}), s;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) s = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = tr.fromSchema(r);
			o = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = o.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), o = _c(n), ho && vc(o);
	let l = o && o.querySelector("[data-pm-slice]"), u = l && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(l.getAttribute("data-pm-slice") || "");
	if (u && u[3]) for (let e = +u[3]; e > 0; e--) {
		let e = o.firstChild;
		for (; e && !B(e);) e = e.nextSibling;
		if (!e) break;
		o = e;
	}
	if (s ||= (e.someProp("clipboardParser") || e.someProp("domParser") || Vn.fromSchema(e.state.schema)).parseSlice(o, {
		preserveWhitespace: !!(c || u),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !oc.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	}), u) s = yc(fc(s, +u[1], +u[2]), u[4]);
	else if (s = M.maxOpen(sc(s.content, i), !0), s.openStart || s.openEnd) {
		let e = 0, t = 0;
		for (let t = s.content.firstChild; e < s.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = s.content.lastChild; t < s.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		s = fc(s, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		s = t(s, e, c);
	}), s;
}
var oc = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function sc(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, a = [];
		if (e.forEach((e) => {
			if (!a) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return a = null;
			if (n = a.length && i.length && lc(t, i, e, a[a.length - 1], 0)) a[a.length - 1] = n;
			else {
				a.length && (a[a.length - 1] = uc(a[a.length - 1], i.length));
				let n = cc(e, t);
				a.push(n), r = r.matchType(n.type), i = t;
			}
		}), a) return A.from(a);
	}
	return e;
}
function cc(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, A.from(e));
	return e;
}
function lc(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let a = lc(e, t, n, r.lastChild, i + 1);
		if (a) return r.copy(r.content.replaceChild(r.childCount - 1, a));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(A.from(cc(n, e, i + 1))));
	}
}
function uc(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, uc(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(A.empty, !0);
	return e.copy(n.append(r));
}
function dc(e, t, n, r, i, a) {
	let o = t < 0 ? e.firstChild : e.lastChild, s = o.content;
	return e.childCount > 1 && (a = 0), i < r - 1 && (s = dc(s, t, n, r, i + 1, a)), i >= n && (s = t < 0 ? o.contentMatchAt(0).fillBefore(s, a <= i).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(A.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, o.copy(s));
}
function fc(e, t, n) {
	return t < e.openStart && (e = new M(dc(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new M(dc(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var pc = {
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
function mc() {
	return document.implementation.createHTMLDocument("title");
}
var hc = null;
function gc(e) {
	let t = window.trustedTypes;
	if (!t) return e;
	if (!hc) {
		if (hc = t.defaultPolicy) try {
			return hc.createHTML(e);
		} catch {}
		hc = t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e });
	}
	return hc.createHTML(e);
}
function _c(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = mc(), r = n.body, i = /<([a-z][^>\s]+)/i.exec(e), a;
	if ((a = i && pc[i[1].toLowerCase()]) && (e = a.map((e) => "<" + e + ">").join("") + e + a.map((e) => "</" + e + ">").reverse().join("")), r.innerHTML = gc(e), a) for (let e = 0; e < a.length; e++) r = r.querySelector(a[e]) || r;
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
function vc(e) {
	let t = e.querySelectorAll(H ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function yc(e, t) {
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
			i = A.from(t.create(r[e + 1], i));
		} catch {
			break;
		}
		a++, o++;
	}
	return new M(i, a, o);
}
var bc = {}, xc = {}, Sc = {
	touchstart: !0,
	touchmove: !0
}, Cc = class {
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
function wc(e) {
	for (let t in bc) {
		let n = bc[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			kc(e, t) && !Oc(e, t) && (e.editable || !(t.type in xc)) && n(e, t);
		}, Sc[t] ? { passive: !0 } : void 0);
	}
	lo && e.dom.addEventListener("input", () => null), Dc(e);
}
function Tc(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function Ec(e) {
	e.input.mouseDown && e.input.mouseDown.done(), e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function Dc(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => Oc(e, t));
	});
}
function Oc(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function kc(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function Ac(e, t) {
	!Oc(e, t) && bc[t.type] && (e.editable || !(t.type in xc)) && bc[t.type](e, t);
}
xc.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !qc(e) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(mo && H && n.keyCode == 13))) {
		if (n.keyCode != 229 && e.domObserver.forceFlush(), uo && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
			let t = Date.now();
			e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
				e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, Ya(13, "Enter"))), e.input.lastIOSEnter = 0);
			}, 200);
		} else e.someProp("handleKeyDown", (t) => t(e, n)) || rc(e, n) ? n.preventDefault() : Tc(e, "key");
	}
}, xc.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, xc.keypress = (e, t) => {
	let n = t;
	if (qc(e) || !n.charCode || n.ctrlKey && !n.altKey || fo && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof F) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function jc(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function Mc(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function Nc(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function Pc(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	r.setMeta("pointer", !0), e.dispatch(r);
}
function Fc(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && I.isSelectable(r) ? (Pc(e, new I(n)), !0) : !1;
}
function Ic(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof I && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (I.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i != null && (Pc(e, I.create(e.state.doc, i)), !0);
}
function Lc(e, t, n, r, i) {
	return Nc(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? Ic(e, n) : Fc(e, n));
}
function Rc(e, t, n, r) {
	return Nc(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function zc(e, t, n, r) {
	return Nc(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || Bc(e, n, r);
}
function Bc(e, t, n) {
	if (n.button != 0) return !1;
	let r = Vc(e, t, !0), i = e.state.doc;
	return r ? (Pc(e, r), r instanceof F && i.eq(e.state.doc) && (e.input.mouseDown = new Kc(e, r)), !0) : !1;
}
function Vc(e, t, n) {
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? F.create(r, 0, r.content.size) : null;
	let i = r.resolve(t);
	for (let e = i.depth + 1; e > 0; e--) {
		let t = e > i.depth ? i.nodeAfter : i.node(e), a = i.before(e);
		if (t.inlineContent) return F.create(r, a + 1, a + 1 + t.content.size);
		if (n && I.isSelectable(t)) return I.create(r, a);
	}
	return null;
}
function Hc(e) {
	return $c(e);
}
var Uc = fo ? "metaKey" : "ctrlKey";
bc.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = Hc(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && Mc(n, e.input.lastClick) && !n[Uc] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	}, e.input.mouseDown && e.input.mouseDown.done();
	let o = e.posAtCoords(jc(n));
	o && (a == "singleClick" ? e.input.mouseDown = new Gc(e, o, n, !!r) : (a == "doubleClick" ? Rc : zc)(e, o.pos, o.inside, n) ? n.preventDefault() : Tc(e, "pointer"));
};
var Wc = class {
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
}, Gc = class extends Wc {
	constructor(e, t, n, r) {
		super(e), this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!n[Uc], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && B(s.nodeDOM) ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof I && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !(!this.target || this.target.draggable),
			setUneditable: !!(this.target && oo && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), Tc(e, "pointer");
	}
	done() {
		super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
			this.view.isDestroyed || Ds(this.view);
		});
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(jc(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Tc(this.view, "pointer") : Lc(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || lo && this.mightDrag && !this.mightDrag.node.isAtom || H && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Pc(this.view, P.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Tc(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), Tc(this.view, "pointer"), super.move(e);
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
	delaySelUpdate() {
		return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
	}
}, Kc = class extends Wc {
	constructor(e, t) {
		super(e), this.startSelection = t, this.startDoc = e.state.doc;
	}
	move(e) {
		if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
			this.done();
			return;
		}
		e.preventDefault(), Tc(this.view, "pointer");
		let t = this.view.posAtCoords(jc(e)), n = t && Vc(this.view, t.inside, !1);
		if (!n) return;
		let { doc: r } = this.view.state, i = this.startSelection, [a, o] = n.from < i.from ? [i.to, n.from] : [i.from, n.to];
		Pc(this.view, F.create(r, a, o));
	}
};
bc.touchstart = (e) => {
	e.input.lastTouch = Date.now(), Hc(e), Tc(e, "pointer");
}, bc.touchmove = (e) => {
	e.input.lastTouch = Date.now(), Tc(e, "pointer");
}, bc.contextmenu = (e) => Hc(e);
function qc(e, t) {
	return e.composing ? !0 : lo && Math.abs(Date.now() - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var Jc = mo ? 5e3 : -1;
xc.compositionstart = xc.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof F && t.selection.empty && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || H && po && Yc(e))) e.markCursor = e.state.storedMarks || n.marks(), $c(e, !0), e.markCursor = null;
		else if ($c(e, !t.selection.empty), oo && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
			let t = e.domSelectionRange();
			for (let n = t.focusNode, r = t.focusOffset; n && B(n) && r != 0;) {
				let t = r < 0 ? n.lastChild : n.childNodes[r - 1];
				if (!t) break;
				if (V(t)) {
					let n = e.domSelection();
					n && n.collapse(t, t.nodeValue.length);
					break;
				}
				n = t, r = -1;
			}
		}
		e.input.composing = !0;
	}
	Xc(e, Jc);
};
function Yc(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || !B(t) || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return B(r) && r.contentEditable == "false";
}
xc.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now(), e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, Xc(e, 20));
};
function Xc(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => $c(e), t));
}
function Zc(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function Qc(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = Wa(t.focusNode, t.focusOffset), r = Ga(t.focusNode, t.focusOffset);
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
function $c(e, t = !1) {
	if (!(mo && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), Zc(e), t || e.docView && e.docView.dirty) {
			let n = Ts(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function el(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var tl = io && ao < 15 || uo && go < 604;
bc.copy = xc.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = tl ? null : n.clipboardData, { dom: o, text: s } = ic(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : el(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function nl(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function rl(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? il(e, r.value, null, i, t) : il(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function il(e, t, n, r, i) {
	let a = ac(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || M.empty))) return !0;
	if (!a) return !1;
	let o = nl(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function al(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
xc.paste = (e, t) => {
	let n = t;
	if (e.composing && !mo) return;
	let r = tl ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && il(e, al(r), r.getData("text/html"), i, n) ? n.preventDefault() : rl(e, n);
};
var ol = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, sl = fo ? "altKey" : "ctrlKey";
function cl(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n ||= e(t);
	}), n == null ? !t[sl] : !n;
}
bc.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(jc(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof I ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = I.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && B(n.target)) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = I.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = ic(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !H || co > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(tl ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", tl || n.dataTransfer.setData("text/plain", c), e.dragging = new ol(l, cl(e, n), o);
}, bc.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, xc.dragover = xc.dragenter = (e, t) => t.preventDefault(), xc.drop = (e, t) => {
	try {
		ll(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function ll(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(jc(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = ac(e, al(t.dataTransfer), tl ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && cl(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || M.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? ni(e.state.doc, i.pos, a) : i.pos;
	s ??= i.pos;
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, d = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(d)) return;
	let f = c.doc.resolve(l);
	if (u && I.isSelectable(a.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new I(f));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(Is(e, f, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
bc.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && Ds(e);
	}, 20));
}, bc.blur = (e, t) => {
	let n = t;
	e.focused &&= (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), !1);
}, bc.beforeinput = (e, t) => {
	if (mo && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, Ya(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in xc) bc[e] = xc[e];
function ul(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var dl = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || gl, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new ml(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && ul(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, fl = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || gl;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new ml(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && ul(this.attrs, t.attrs) && ul(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, pl = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || gl;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new ml(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && ul(this.attrs, t.attrs) && ul(this.spec, t.spec);
	}
	destroy() {}
}, ml = class e {
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
		return new e(t, t, new dl(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new fl(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new pl(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof fl;
	}
	get widget() {
		return this.type instanceof dl;
	}
}, hl = [], gl = {}, U = class e {
	constructor(e, t) {
		this.local = e.length ? e : hl, this.children = t.length ? t : hl;
	}
	static create(e, t) {
		return t.length ? wl(t, e, 0, gl) : _l;
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
		return this == _l || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || gl);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o ||= []).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? yl(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(Tl), hl) : _l;
	}
	add(t, n) {
		return n.length ? this == _l ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = Sl(n, e, o)) {
				for (i ||= this.children.slice(); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, wl(s, e, o + 1, gl)), a += 3;
			}
		});
		let o = bl(a ? Cl(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(Tl) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == _l ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i ||= []).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == _l ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : _l;
	}
	forChild(t, n) {
		if (this == _l) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof fl) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i ||= []).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(Tl), hl);
			return r ? new vl([t, r]) : t;
		}
		return r || _l;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return El(this.localsInner(e));
	}
	localsInner(e) {
		if (this == _l) return hl;
		if (e.inlineContent || !this.local.some(fl.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof fl || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
U.empty = new U([], []), U.removeOverlap = El;
var _l = U.empty, vl = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, gl));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return U.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != _l && (a instanceof e ? r = r.concat(a.members) : r.push(a));
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
		return t ? El(n ? t : t.sort(Tl)) : hl;
	}
	static from(t) {
		switch (t.length) {
			case 0: return _l;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof U) ? t : t.reduce((e, t) => e.concat(t instanceof U ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function yl(e, t, n, r, i, a, o) {
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
			r == _l ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = wl(xl(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new U(t.sort(Tl), s);
}
function bl(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new ml(i.from + t, i.to + t, i.type));
	}
	return n;
}
function xl(e, t, n, r, i, a, o) {
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
function Sl(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i ||= []).push(a), e[t] = null);
	return i;
}
function Cl(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function wl(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = Sl(e, t, o + n);
		if (s) {
			a = !0;
			let e = wl(s, t, n + o + 1, r);
			e != _l && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = bl(a ? Cl(e) : e, -n).sort(Tl);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new U(o, i) : _l;
}
function Tl(e, t) {
	return e.from - t.from || e.to - t.to;
}
function El(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), Dl(t, i + 1, a.copy(r.to, a.to)));
			else {
				a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), Dl(t, i, r.copy(a.from, r.to)));
				break;
			}
		}
	}
	return t;
}
function Dl(e, t, n) {
	for (; t < e.length && Tl(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function Ol(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != _l && t.push(r);
	}), e.cursorWrapper && t.push(U.create(e.state.doc, [e.cursorWrapper.deco])), vl.from(t);
}
var kl = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, Al = io && ao <= 11, jl = class {
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
}, Ml = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new jl(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			io && ao <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : lo && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), Al && (this.onCharData = (e) => {
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
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, kl)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
		if (Ls(this.view)) {
			if (this.suppressingSelectionUpdates) return Ds(this.view);
			if (io && ao <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && za(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
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
		for (let n = e.focusNode; n; n = Fa(n)) t.add(n);
		for (let r = e.anchorNode; r; r = Fa(r)) if (t.has(r)) {
			n = r;
			break;
		}
		let r = n && this.view.docView.nearestDesc(n);
		if (r && r.ignoreMutation({
			type: "selection",
			target: V(n) ? n.parentNode : n
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
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && Ls(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || H && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((e) => e.type == "childList" && e.removedNodes.length))) {
			for (let e of s) if (e.nodeName == "BR" && e.parentNode) {
				let t = e.nextSibling;
				for (; t && B(t);) {
					if (t.contentEditable == "false") {
						e.parentNode.removeChild(e);
						break;
					}
					t = t.firstChild;
				}
			}
		} else if (oo && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || Rl(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ja(n) && (c = Ts(e)) && c.eq(P.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Ds(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), Fl(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, zl(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || Ds(e), this.currentSelection.set(n));
	}
	registerMutation(e, t) {
		if (t.indexOf(e.target) > -1) return null;
		let n = this.view.docView.nearestDesc(e.target);
		if (e.type == "attributes" && (n == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !n || n.ignoreMutation(e)) return null;
		if (e.type == "childList") {
			for (let n = 0; n < e.addedNodes.length; n++) {
				let r = e.addedNodes[n];
				t.push(r), V(r) && (this.lastChangedTextNode = r);
			}
			if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(e.target)) return {
				from: n.posBefore,
				to: n.posAfter
			};
			let r = e.previousSibling, i = e.nextSibling;
			if (io && ao <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? z(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? z(i) : e.target.childNodes.length;
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
}, Nl = /* @__PURE__ */ new WeakMap(), Pl = !1;
function Fl(e) {
	if (!Nl.has(e) && (Nl.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = oo, Pl) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Pl = !0;
	}
}
function Il(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return za(o.node, o.offset, i, a) && ([n, r, i, a] = [
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
function Ll(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return Il(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? Il(e, n) : null;
}
function Rl(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function zl(e, t) {
	let { focusNode: n, focusOffset: r } = e.domSelectionRange();
	for (let i of t) if (i.parentNode?.nodeName == "TR") {
		let t = i.nextSibling;
		for (; t && t.nodeName != "TD" && t.nodeName != "TH";) t = t.nextSibling;
		if (t) {
			let a = t;
			for (;;) {
				let e = a.firstChild;
				if (!e || !B(e) || e.contentEditable == "false" || /^(BR|IMG)$/.test(e.nodeName)) break;
				a = e;
			}
			a.insertBefore(i, a.firstChild), n == i && e.domSelection().collapse(i, r);
		} else i.parentNode.removeChild(i);
	}
}
function Bl(e, t, n, r) {
	let { node: i, fromOffset: a, toOffset: o, from: s, to: c } = e.docView.parseRange(t, n), l = e.domSelectionRange(), u, d = l.anchorNode;
	if (d && Ua(e.dom, d) && (u = [{
		node: d,
		offset: l.anchorOffset
	}], Ja(l) || u.push({
		node: l.focusNode,
		offset: l.focusOffset
	})), H && e.input.lastKeyCode === 8) for (let e = o; e > a; e--) {
		let t = i.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			o = e;
			break;
		}
		if (!n || n.size) break;
	}
	let f = e.state.doc, p = e.someProp("domParser") || Vn.fromSchema(e.state.schema), m = f.resolve(s), h = null, g = p.parse(i, {
		topNode: m.parent,
		topMatch: m.parent.contentMatchAt(m.index()),
		topOpen: !0,
		from: a,
		to: o,
		preserveWhitespace: m.parent.type.whitespace != "pre" || "full",
		findPositions: u,
		ruleFromNode: Vl(r),
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
var Vl = (e) => (t) => {
	let n = t.pmViewDesc;
	if (n) return n.parseRule(e);
	if (t.nodeName == "BR" && t.parentNode) {
		if (lo && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		}
		if (t.parentNode.lastChild == t || lo && /^(tr|table)$/i.test(t.parentNode.nodeName)) return { ignore: !0 };
	} else if (t.nodeName == "IMG" && t.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}, Hl = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Ul(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = Ts(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (H && mo && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, Ya(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = Bl(e, t, n, i), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = Yl(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (uo && e.input.lastIOSEnter > Date.now() - 225 || mo) && i.some((e) => B(e) && !Hl.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, Ya(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) {
		if (r && c instanceof F && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
			start: c.from,
			endA: c.to,
			endB: c.to
		};
		else {
			if (l.sel) {
				let t = Wl(e, e.state.doc, l.sel);
				if (t && !t.eq(e.state.selection)) {
					let n = e.state.tr.setSelection(t);
					a && n.setMeta("composition", a), e.dispatch(n);
				}
			}
			return;
		}
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof F && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), io && ao <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), _ = u.resolve(m.start), v = h.sameParent(g) && h.parent.inlineContent && _.end() >= m.endA;
	if ((uo && e.input.lastIOSEnter > Date.now() - 225 && (!v || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !v && ql(l.doc, h.pos, g.pos)) && e.someProp("handleKeyDown", (t) => t(e, Ya(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && Kl(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, Ya(8, "Backspace")))) {
		mo && H && e.domObserver.suppressSelectionUpdates();
		return;
	}
	H && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), mo && !v && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, Ya(13, "Enter"));
		});
	}, 20));
	let y = m.start, b = m.endA, x = (t) => {
		let n = t || e.state.tr.replace(y, b, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = Wl(e, n.doc, l.sel);
			t && !(H && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == y || t.head == n.mapping.map(b) - 1) || io && t.empty && t.head == y) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, S;
	if (v) {
		if (h.pos == g.pos) {
			io && ao <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => Ds(e), 20));
			let t = x(e.state.tr.delete(y, b)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
			n && t.ensureMarks(n), e.dispatch(t);
		} else if (m.endA == m.endB && (S = Gl(h.parent.content.cut(h.parentOffset, g.parentOffset), _.parent.content.cut(_.parentOffset, m.endA - _.start())))) {
			let t = x(e.state.tr);
			S.type == "add" ? t.addMark(y, b, S.mark) : t.removeMark(y, b, S.mark), e.dispatch(t);
		} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
			let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => x(e.state.tr.insertText(t, y, b));
			e.someProp("handleTextInput", (r) => r(e, y, b, t, n)) || e.dispatch(n());
		} else e.dispatch(x());
	} else e.dispatch(x());
}
function Wl(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : Is(e, t.resolve(n.anchor), t.resolve(n.head));
}
function Gl(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, a = r, o, s, c;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) a = n[e].removeFromSet(a);
	if (i.length == 1 && a.length == 0) s = i[0], o = "add", c = (e) => e.mark(s.addToSet(e.marks));
	else if (i.length == 0 && a.length == 1) s = a[0], o = "remove", c = (e) => e.mark(s.removeFromSet(e.marks));
	else return null;
	let l = [];
	for (let e = 0; e < t.childCount; e++) l.push(c(t.child(e)));
	if (A.from(l).eq(e)) return {
		mark: s,
		type: o
	};
}
function Kl(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || Jl(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(Jl(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || Jl(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function ql(e, t, n) {
	let r = 0, i = 0;
	return e.nodesBetween(t, n, (e, a) => {
		e.isTextblock && a >= t && a < n ? r++ : (e.isText ? /\S/.test(e.text.slice(Math.max(0, t - a), Math.min(e.nodeSize, n - a))) : e.isLeaf) && i++;
	}), i == 0 && r == 1;
}
function Jl(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function Yl(e, t, n, r, i) {
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
var Xl = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Cc(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(ru), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = $l(this), Ql(this), this.nodeViews = tu(this), this.docView = is(this.state.doc, Zl(this), Ol(this), this.dom, this), this.domObserver = new Ml(this, (e, t, n, r) => Ul(this, e, t, n, r)), this.domObserver.start(), wc(this), this.updatePluginViews();
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
		e.handleDOMEvents != this._props.handleDOMEvents && Dc(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(ru), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
		e.storedMarks && this.composing && (Zc(this), i = !0), this.state = e;
		let a = n.plugins != e.plugins || this._props.plugins != t.plugins;
		if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = tu(this);
			nu(e, this.nodeViews) && (this.nodeViews = e, r = !0);
		}
		(a || t.handleDOMEvents != this._props.handleDOMEvents) && Dc(this), this.editable = $l(this), Ql(this);
		let o = Ol(this), s = Zl(this), c = n.plugins != e.plugins && !n.doc.eq(e.doc) ? "reset" : e.scrollToSelection > n.scrollToSelection ? "to selection" : "preserve", l = r || !this.docView.matchesNode(e.doc, s, o);
		(l || !e.selection.eq(n.selection)) && (i = !0);
		let u = c == "preserve" && i && this.dom.style.overflowAnchor == null && xo(this);
		if (i) {
			this.domObserver.stop();
			let t = l && (io || H) && !this.composing && !n.selection.empty && !e.selection.empty && eu(n.selection, e.selection);
			if (l) {
				let n = H ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = Qc(this)), (r || !this.docView.update(e.doc, s, o, this)) && (this.docView.updateOuterDeco(s), this.docView.destroy(), this.docView = is(e.doc, s, o, this.dom, this)), !n || this.trackWrites && this.dom.contains(this.trackWrites) || (t = !0);
			}
			let i = this.input.mouseDown;
			t || !(i && this.domObserver.currentSelection.eq(this.domSelectionRange()) && zs(this) && i.delaySelUpdate()) ? Ds(this, t) : (Ps(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(n), this.dragging?.node && !n.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, n), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : u && Co(u);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (e && Ua(this.dom, e) && !this.someProp("handleScrollToSelection", (e) => e(this))) {
			if (this.state.selection instanceof I) {
				let t = this.docView.domAfterPos(this.state.selection.from);
				B(t) && bo(this, t.getBoundingClientRect(), e);
			} else bo(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
		this.dragging = new ol(e.slice, e.move, r < 0 ? void 0 : I.create(this.state.doc, r));
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
		if (io) {
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
		this.domObserver.stop(), this.editable && Eo(this.dom), Ds(this), this.domObserver.start();
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
		return Po(this, e);
	}
	coordsAtPos(e, t = 1) {
		return Ro(this, e, t);
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
		return Jo(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return il(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return il(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return ic(this, e);
	}
	destroy() {
		this.docView && (Ec(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Ol(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Ra());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return Ac(this, e);
	}
	domSelectionRange() {
		let e = this.dom.isConnected !== !1 && this.domSelection();
		return e ? lo && this.root.nodeType === 11 && Xa(this.dom.ownerDocument) == this.dom && Ll(this, e) || e : {
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
Xl.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function Zl(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate ||= "no", [ml.node(0, e.state.doc.content.size, t)];
}
function Ql(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: ml.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function $l(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function eu(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function tu(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function nu(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function ru(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
for (var iu = {
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
}, au = {
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
}, ou = typeof navigator < "u" && /Mac/.test(navigator.platform), su = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), cu = 0; cu < 10; cu++) iu[48 + cu] = iu[96 + cu] = String(cu);
for (var cu = 1; cu <= 24; cu++) iu[cu + 111] = "F" + cu;
for (var cu = 65; cu <= 90; cu++) iu[cu] = String.fromCharCode(cu + 32), au[cu] = String.fromCharCode(cu);
for (var lu in iu) au.hasOwnProperty(lu) || (au[lu] = iu[lu]);
function uu(e) {
	var t = !(ou && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || su && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? au : iu)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/prosemirror-keymap/dist/index.js
var du = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), fu = typeof navigator < "u" && /Win/.test(navigator.platform);
function pu(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) du ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function mu(e) {
	let t = Object.create(null);
	for (let n in e) t[pu(n)] = e[n];
	return t;
}
function hu(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function gu(e) {
	return new L({ props: { handleKeyDown: _u(e) } });
}
function _u(e) {
	let t = mu(e);
	return function(e, n) {
		let r = uu(n), i, a = t[hu(r, n)];
		if (a && a(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[hu(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(fu && n.ctrlKey && n.altKey) && (i = iu[n.keyCode]) && i != r) {
				let r = t[hu(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/rope-sequence/dist/index.js
var vu = 200, W = function() {};
W.prototype.append = function(e) {
	return e.length ? (e = W.from(e), !this.length && e || e.length < vu && this.leafAppend(e) || this.length < vu && e.leafPrepend(this) || this.appendInner(e)) : this;
}, W.prototype.prepend = function(e) {
	return e.length ? W.from(e).append(this) : this;
}, W.prototype.appendInner = function(e) {
	return new bu(this, e);
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
	return e instanceof W ? e : e && e.length ? new yu(e) : W.empty;
};
var yu = /* @__PURE__ */ function(e) {
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
		if (this.length + e.length <= vu) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= vu) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(W);
W.empty = new yu([]);
var bu = /* @__PURE__ */ function(e) {
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
}(W), xu = 500, Su = class e {
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
					u.push(new wu(t.map));
					let e = t.step.map(i.slice(a)), n;
					e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new wu(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
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
			let r = t.steps[e].invert(t.docs[e]), l = new wu(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n &&= (o++, void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > Eu && (s = Cu(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new yr();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new wu(e))), this.eventCount);
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
				l && s++, r.push(new wu(i, o, l));
			} else r.push(new wu(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new wu(a.maps[e]));
		let u = this.items.slice(0, i).append(l).append(r), d = new e(u, s);
		return d.emptyItemCount() > xu && (d = d.compress(this.items.length - r.length)), d;
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
					let c = new wu(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(W.from(i.reverse()), a);
	}
};
Su.empty = new Su(W.empty, 0);
function Cu(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var wu = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, Tu = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, Eu = 20;
function Du(e, t, n, r) {
	let i = n.getMeta(Iu), a;
	if (i) return i.historyState;
	n.getMeta(Lu) && (e = new Tu(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(Iu)) return o.getMeta(Iu).redo ? new Tu(e.done.addTransform(n, void 0, r, Pu(t)), e.undone, ku(n.mapping.maps), e.prevTime, e.prevComposition) : new Tu(e.done, e.undone.addTransform(n, void 0, r, Pu(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !Ou(n, e.prevRanges)), s = o ? Au(e.prevRanges, n.mapping) : ku(n.mapping.maps);
		return new Tu(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, Pu(t)), Su.empty, s, n.time, i ?? e.prevComposition);
	}
	return (a = n.getMeta("rebased")) ? new Tu(e.done.rebased(n, a), e.undone.rebased(n, a), Au(e.prevRanges, n.mapping), e.prevTime, e.prevComposition) : new Tu(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), Au(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function Ou(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function ku(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function Au(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function ju(e, t, n) {
	let r = Pu(t), i = Iu.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new Tu(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(Iu, {
		redo: n,
		historyState: c
	});
}
var Mu = !1, Nu = null;
function Pu(e) {
	let t = e.plugins;
	if (Nu != t) {
		Mu = !1, Nu = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			Mu = !0;
			break;
		}
	}
	return Mu;
}
function Fu(e) {
	return e.setMeta(Lu, !0);
}
var Iu = new R("history"), Lu = new R("closeHistory");
function Ru(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new L({
		key: Iu,
		state: {
			init() {
				return new Tu(Su.empty, Su.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return Du(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? Bu : n == "historyRedo" ? Vu : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function zu(e, t) {
	return (n, r) => {
		let i = Iu.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = ju(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var Bu = zu(!1, !0), Vu = zu(!0, !0);
function Hu(e) {
	return e.getMeta(Iu) != null;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/core/dist/index.js
function Uu(e) {
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
var Wu = class e {
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
			state: Uu({
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
}, Gu = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
	if (!e.isDestroyed) {
		var n;
		t.dom.blur(), (n = window) == null || (n = n.getSelection()) == null || n.removeAllRanges();
	}
}), !0), Ku = (e = !0) => ({ commands: t }) => t.setContent("", { emitUpdate: e }), qu = () => ({ state: e, tr: t, dispatch: n }) => {
	let { selection: r } = t, { ranges: i } = r;
	return n && i.forEach(({ $from: n, $to: r }) => {
		e.doc.nodesBetween(n.pos, r.pos, (e, n) => {
			if (e.type.isText) return;
			let { doc: r, mapping: i } = t, a = r.resolve(i.map(n)), o = r.resolve(i.map(n + e.nodeSize)), s = a.blockRange(o);
			if (!s) return;
			let c = Ir(s);
			if (e.type.isTextblock) {
				let { defaultType: e } = a.parent.contentMatchAt(a.index());
				t.setNodeMarkup(s.start, e);
			}
			(c || c === 0) && t.lift(s, c);
		});
	}), !0;
}, Ju = (e) => (t) => e(t), Yu = () => ({ state: e, dispatch: t }) => ua(e, t), Xu = (e, t) => ({ editor: n, tr: r }) => {
	let { state: i } = n, a = i.doc.slice(e.from, e.to);
	r.deleteRange(e.from, e.to);
	let o = r.mapping.map(t);
	return r.insert(o, a.content), r.setSelection(new F(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, Zu = () => ({ tr: e, dispatch: t }) => {
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
var Qu = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let i = G(e, n.schema), a = t.selection.$anchor;
	for (let e = a.depth; e > 0; --e) if (a.node(e).type === i) {
		if (r) {
			let n = a.before(e), r = a.after(e);
			t.delete(n, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
}, $u = (e) => ({ tr: t, dispatch: n }) => {
	let { from: r, to: i } = e;
	return n && t.delete(r, i), !0;
}, ed = (e) => e.content ? /^text(\*|\+)/.test(e.content) : !1, td = (e, t, n) => {
	if (!e.parent.isInline || n === "left" && e.pos > e.start() || n === "right" && e.pos < e.end()) return e.pos;
	let r = t.nodes[e.parent.type.name].spec;
	return ed(r) ? n === "left" ? e.start() - 1 : e.end() + 1 : e.pos;
}, nd = (e, t, n) => ({
	from: td(e, n, "left"),
	to: td(t, n, "right")
}), rd = () => ({ state: e, dispatch: t }) => {
	if (e.selection.empty) return !1;
	if (t) {
		let n = e.tr, { ranges: r } = e.selection, i = n.steps.length;
		r.forEach((t) => {
			let r = n.mapping.slice(i), { from: a, to: o } = nd(n.doc.resolve(r.map(t.$from.pos)), n.doc.resolve(r.map(t.$to.pos)), e.schema);
			n.deleteRange(a, o);
		}), n.selection.empty || n.setSelection(F.near(n.doc.resolve(n.selection.from))), n.scrollIntoView(), t(n);
	}
	return !0;
}, id = () => ({ commands: e }) => e.keyboardShortcut("Enter"), ad = () => ({ state: e, dispatch: t }) => la(e, t);
function od(e) {
	return Object.prototype.toString.call(e) === "[object RegExp]";
}
function sd(e, t, n = { strict: !0 }) {
	let r = Object.keys(t);
	return !r.length || r.every((r) => n.strict ? t[r] === e[r] : od(t[r]) ? t[r].test(e[r]) : t[r] === e[r]);
}
function cd(e, t, n = {}) {
	return e.find((e) => e.type === t && sd(Object.fromEntries(Object.keys(n).map((t) => [t, e.attrs[t]])), n));
}
function ld(e, t, n = {}) {
	return !!cd(e, t, n);
}
function ud(e, t, n) {
	if (!e || !t) return;
	let r = e.parent.childAfter(e.parentOffset);
	if (r.node && r.node.marks.some((e) => e.type === t) || (r = e.parent.childBefore(e.parentOffset)), !r.node || !r.node.marks.some((e) => e.type === t)) return;
	if (!n) {
		let e = r.node.marks.find((e) => e.type === t);
		e && (n = e.attrs);
	}
	if (!cd([...r.node.marks], t, n)) return;
	let i = r.index, a = e.start() + r.offset, o = i + 1, s = a + r.node.nodeSize;
	for (; i > 0 && ld([...e.parent.child(i - 1).marks], t, n);) --i, a -= e.parent.child(i).nodeSize;
	for (; o < e.parent.childCount && ld([...e.parent.child(o).marks], t, n);) s += e.parent.child(o).nodeSize, o += 1;
	return {
		from: a,
		to: s
	};
}
function dd(e, t) {
	if (typeof e == "string") {
		if (!t.marks[e]) throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
		return t.marks[e];
	}
	return e;
}
var fd = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = dd(e, r.schema), { doc: o, selection: s } = n, { $from: c, from: l, to: u } = s;
	if (i) {
		let e = ud(c, a, t);
		if (e && e.from <= l && e.to >= u) {
			let t = F.create(o, e.from, e.to);
			n.setSelection(t);
		}
	}
	return !0;
}, pd = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	for (let e = 0; e < n.length; e += 1) if (n[e](t)) return !0;
	return !1;
};
function md(e) {
	return e instanceof F;
}
function hd(e = 0, t = 0, n = 0) {
	return Math.min(Math.max(e, t), n);
}
function gd(e, t = null) {
	if (!t) return null;
	let n = P.atStart(e), r = P.atEnd(e);
	if (t === "start" || t === !0) return n;
	if (t === "end") return r;
	let i = n.from, a = r.to;
	return t === "all" ? F.create(e, hd(0, i, a), hd(e.content.size, i, a)) : F.create(e, hd(t, i, a), hd(t, i, a));
}
function _d() {
	return ["Android"].includes(navigator.platform) || /android/i.test(navigator.userAgent);
}
function vd() {
	return [
		"iPad Simulator",
		"iPhone Simulator",
		"iPod Simulator",
		"iPad",
		"iPhone",
		"iPod"
	].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function yd() {
	return typeof navigator < "u" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
var bd = (e = null, t = {}) => ({ editor: n, view: r, tr: i, dispatch: a }) => {
	t = {
		scrollIntoView: !0,
		...t
	};
	let o = () => {
		(vd() || _d()) && r.dom.focus(), yd() && !vd() && !_d() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
			n.isDestroyed || (r.focus(), t?.scrollIntoView && n.commands.scrollIntoView());
		});
	};
	try {
		if (r.hasFocus() && e === null || e === !1) return !0;
	} catch {
		return !1;
	}
	if (a && e === null && !md(n.state.selection)) return o(), !0;
	let s = gd(i.doc, e) || n.state.selection, c = n.state.selection.eq(s);
	return a && (c || i.setSelection(s), c && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, xd = (e, t) => (n) => e.every((e, r) => t(e, {
	...n,
	index: r
})), Sd = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({
	from: n.selection.from,
	to: n.selection.to
}, e, t), Cd = (e) => {
	let t = e.childNodes;
	for (let n = t.length - 1; n >= 0; --n) {
		let r = t[n];
		r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && Cd(r);
	}
	return e;
};
function wd(e) {
	if (typeof window > "u") throw Error("[tiptap error]: there is no window object available, so this function cannot be used");
	let t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
	return Cd(n);
}
function Td(e) {
	return typeof e?.nodesBetween == "function";
}
function Ed(e, t, n) {
	if (Td(e)) return e;
	let r = typeof e == "object" && !!e;
	n = {
		slice: !0,
		parseOptions: {},
		...n
	};
	let i = typeof e == "string";
	if (r) try {
		if (Array.isArray(e) && e.length > 0) return A.fromArray(e.map((e) => t.nodeFromJSON(e)));
		let r = t.nodeFromJSON(e);
		return n.errorOnInvalidContent && r.check(), r;
	} catch (r) {
		if (n.errorOnInvalidContent) throw Error("[tiptap error]: Invalid JSON content", { cause: r });
		return console.warn("[tiptap warn]: Invalid content.", "Passed value:", e, "Error:", r), Ed("", t, n);
	}
	if (i) {
		if (n.errorOnInvalidContent) {
			let r = !1, i = "", a = new Ln({
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
			if (n.slice ? Vn.fromSchema(a).parseSlice(wd(e), n.parseOptions) : Vn.fromSchema(a).parse(wd(e), n.parseOptions), n.errorOnInvalidContent && r) throw Error("[tiptap error]: Invalid HTML content", { cause: /* @__PURE__ */ Error(`Invalid element found: ${i}`) });
		}
		let r = Vn.fromSchema(t);
		return n.slice ? r.parseSlice(wd(e), n.parseOptions).content : r.parse(wd(e), n.parseOptions);
	}
	return Ed("", t, n);
}
function Dd(e) {
	return !("type" in e);
}
function Od(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof kr || i instanceof Ar)) return;
	let a = e.mapping.maps[r], o = 0;
	a.forEach((e, t, n, r) => {
		o === 0 && (o = r);
	}), e.setSelection(P.near(e.doc.resolve(o), n));
}
var kd = (e, t, n) => ({ tr: r, dispatch: i, editor: a }) => {
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
			Ed(t, a.schema, {
				parseOptions: s,
				errorOnInvalidContent: !0
			});
		} catch (e) {
			o(e);
		}
		try {
			i = Ed(t, a.schema, {
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
		}, u = !0, d = !0, f = Dd(i) ? i.content : [i];
		if (f.forEach((e) => {
			e.check(), u = u ? e.isText && e.marks.length === 0 : !1, d = d ? e.isBlock : !1;
		}), c === l && d) {
			let { parent: e } = r.doc.resolve(c);
			e.isTextblock && !e.type.spec.code && !e.childCount && (--c, l += 1);
		}
		let p;
		if (u) p = Array.isArray(t) ? t.map((e) => e.text || "").join("") : Td(t) ? f.map((e) => e.text ?? "").join("") : typeof t == "object" && t && t.text ? t.text : t, r.insertText(p, c, l);
		else {
			p = A.from(f);
			let e = r.doc.resolve(c), t = e.node(), n = e.parentOffset === 0, i = t.isText || t.isTextblock, a = t.content.size > 0;
			n && i && a && d && (c = Math.max(0, c - 1)), r.replaceWith(c, l, f);
		}
		n.updateSelection && Od(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", {
			from: c,
			text: p
		}), n.applyPasteRules && r.setMeta("applyPasteRules", {
			from: c,
			text: p
		});
	}
	return !0;
};
function Ad(e) {
	for (let t = 0; t < e.edgeCount; t += 1) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var jd = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
	let { pos: i, attrs: a, content: o, updateSelection: s = !0 } = e, c;
	c = typeof i == "number" ? t.doc.resolve(i) : i || t.selection.$from;
	let l = Ad(c.parent.contentMatchAt(c.index()));
	if (!l) return !1;
	let u = Object.keys(l.spec.attrs || {}), d = a ? Object.fromEntries(Object.entries(a).filter(([e]) => u.includes(e))) : {}, f;
	if (o) {
		let e = Ed(o, r.schema);
		f = l.createAndFill(d, e);
	} else f = l.createAndFill(d);
	return f ? (n && (t.insert(c.pos, f), s && Od(t, t.steps.length - 1, -1)), !0) : !1;
}, Md = () => ({ state: e, dispatch: t }) => ia(e, t), Nd = () => ({ state: e, dispatch: t }) => aa(e, t), Pd = () => ({ state: e, dispatch: t }) => qi(e, t), Fd = () => ({ state: e, dispatch: t }) => ta(e, t), Id = (e, t) => {
	let n = e.resolve(t), r = n.nodeBefore, i = n.nodeAfter;
	return !r || !i ? !1 : !r.type.spec.isolating && !i.type.spec.isolating;
}, Ld = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = $r(e.doc, e.selection.$from.pos, -1);
		return r == null || !Id(e.doc, r) ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, Rd = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = $r(e.doc, e.selection.$from.pos, 1);
		return r == null || !Id(e.doc, r) ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, zd = () => ({ state: e, dispatch: t }) => Ji(e, t), Bd = () => ({ state: e, dispatch: t }) => Yi(e, t);
function Vd() {
	return typeof navigator < "u" && /Mac/.test(navigator.platform);
}
function Hd(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n === "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e += 1) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) vd() || Vd() ? o = !0 : i = !0;
		else throw Error(`Unrecognized modifier name: ${n}`);
	}
	return r && (n = `Alt-${n}`), i && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), a && (n = `Shift-${n}`), n;
}
var Ud = (e) => ({ editor: t, view: n, tr: r, dispatch: i }) => {
	let a = Hd(e).split(/-(?!$)/), o = a.find((e) => ![
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
function Wd(e, t, n = {}) {
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
	let c = i - r, l = s.filter((e) => !o || o.name === e.node.type.name).filter((e) => sd(e.node.attrs, n, { strict: !1 }));
	return a ? !!l.length : l.reduce((e, t) => e + t.to - t.from, 0) >= c;
}
var Gd = (e, t = {}) => ({ state: n, dispatch: r }) => Wd(n, G(e, n.schema), t) ? oa(n, r) : !1, Kd = () => ({ state: e, dispatch: t }) => da(e, t), qd = (e) => ({ state: t, dispatch: n }) => ja(G(e, t.schema))(t, n), Jd = () => ({ state: e, dispatch: t }) => sa(e, t);
function Yd(e, t) {
	return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function Xd(e, t) {
	let n = typeof t == "string" ? [t] : t;
	return Object.keys(e).reduce((t, r) => (n.includes(r) || (t[r] = e[r]), t), {});
}
var Zd = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Yd(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = G(e, r.schema)), s === "mark" && (o = dd(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		r.doc.nodesBetween(e.$from.pos, e.$to.pos, (e, r) => {
			a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, Xd(e.attrs, t))), o && e.marks.length && e.marks.forEach((a) => {
				o === a.type && (c = !0, i && n.addMark(r, r + e.nodeSize, o.create(Xd(a.attrs, t))));
			});
		});
	}), c;
}, Qd = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), $d = () => ({ tr: e, dispatch: t }) => {
	if (t) {
		let t = new ki(e.doc);
		e.setSelection(t);
	}
	return !0;
}, ef = () => ({ state: e, dispatch: t }) => Qi(e, t), tf = () => ({ state: e, dispatch: t }) => na(e, t), nf = () => ({ state: e, dispatch: t }) => ma(e, t), rf = () => ({ state: e, dispatch: t }) => ba(e, t), af = () => ({ state: e, dispatch: t }) => ya(e, t);
function of(e, t, n = {}, r = {}) {
	return Ed(e, t, {
		slice: !1,
		parseOptions: n,
		errorOnInvalidContent: r.errorOnInvalidContent
	});
}
var sf = (e, { errorOnInvalidContent: t, emitUpdate: n = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: a, dispatch: o, commands: s }) => {
	let { doc: c } = a;
	if (r.preserveWhitespace !== "full") {
		let s = of(e, i.schema, r, { errorOnInvalidContent: t ?? i.options.enableContentCheck });
		if (o) {
			let e = Dd(s) ? s.content : [s];
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
function cf(e, t) {
	let n = dd(t, e.schema), { from: r, to: i, empty: a } = e.selection, o = [];
	a ? (e.storedMarks && o.push(...e.storedMarks), o.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, i, (e) => {
		o.push(...e.marks);
	});
	let s = o.find((e) => e.type.name === n.name);
	return s ? { ...s.attrs } : {};
}
function lf(e, t) {
	let n = new Si(e);
	return t.forEach((e) => {
		e.steps.forEach((e) => {
			n.step(e);
		});
	}), n;
}
function uf(e, t) {
	let n = [];
	return e.descendants((e, r) => {
		t(e) && n.push({
			node: e,
			pos: r
		});
	}), n;
}
function df(e, t, n) {
	let r = [];
	return e.nodesBetween(t.from, t.to, (e, t) => {
		n(e) && r.push({
			node: e,
			pos: t
		});
	}), r;
}
function ff(e, t) {
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
function pf(e) {
	return (t) => ff(t.$from, e);
}
function K(e, t, n) {
	return e.config[t] === void 0 && e.parent ? K(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
		...n,
		parent: e.parent ? K(e.parent, t, n) : null
	}) : e.config[t];
}
function mf(e) {
	return e.map((e) => {
		let t = K(e, "addExtensions", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		return t ? [e, ...mf(t())] : e;
	}).flat(10);
}
function hf(e, t) {
	let n = tr.fromSchema(t).serializeFragment(e), r = document.implementation.createHTMLDocument().createElement("div");
	return r.appendChild(n), r.innerHTML;
}
function gf(e, t) {
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
var _f = {
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
}, vf = {
	inclusive: "boolean",
	excludes: "string",
	group: "string",
	spanning: "boolean",
	code: "boolean"
};
function yf(e, t, n) {
	return Object.fromEntries(Object.entries(t).flatMap(([t, r]) => {
		let i = e[t];
		if (i === void 0) return [];
		if (!(typeof r == "string" ? typeof i === r : typeof i == "string" && r.includes(i))) throw RangeError(`Invalid schemaSpec field '${n}.${t}'`);
		return [[t, i]];
	}));
}
function bf(e, t, n, r) {
	return {
		...Object.fromEntries(Object.entries(t).filter(([e]) => e !== "attrs" && !Object.hasOwn(r, e))),
		...yf(n, r, e),
		attrs: n.attrs
	};
}
function xf(e, t, n) {
	for (let r of Object.keys(t)) if (!Object.hasOwn(e, r)) throw RangeError(`schemaSpec requires a local ${n} extension named '${r}'`);
	for (let r of Object.keys(e)) if (!Object.hasOwn(t, r)) throw RangeError(`Local ${n} extension '${r}' is not in schemaSpec`);
}
function Sf(e, t) {
	xf(e.nodes, t.nodes, "node"), xf(e.marks, t.marks, "mark");
	let n = t.spec.nodes, r = t.spec.marks;
	return t.spec.nodes.forEach((t, r) => {
		n = n.update(t, bf(t, e.nodes[t], r, _f));
	}), t.spec.marks.forEach((t, n) => {
		r = r.update(t, bf(t, e.marks[t], n, vf));
	}), {
		topNode: t.topNodeType.name,
		nodes: n,
		marks: r
	};
}
function Cf(e) {
	let t = e.filter((t, n) => e.indexOf(t) !== n);
	return Array.from(new Set(t));
}
function wf(e) {
	return {
		baseExtensions: e.filter((e) => e.type === "extension"),
		nodeExtensions: e.filter((e) => e.type === "node"),
		markExtensions: e.filter((e) => e.type === "mark")
	};
}
function Tf(e) {
	let t = [], { nodeExtensions: n, markExtensions: r } = wf(e), i = [...n, ...r], a = {
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
function Ef(e) {
	return typeof e == "function";
}
function q(e, t = void 0, ...n) {
	return Ef(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function Df(e = {}) {
	return Object.keys(e).length === 0 && e.constructor === Object;
}
function Of(e) {
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
function kf(e) {
	let t = [], n = Of(e || ""), r = n.length;
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
				let r = new Map([...kf(n[e]), ...kf(t)]);
				n[e] = Array.from(r.entries()).map(([e, t]) => `${e}: ${t}`).join("; ");
			} else n[e] = t;
		}), n;
	}, {});
}
function Af(e, t) {
	return t.filter((t) => t.type === e.type.name).filter((e) => e.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(e.attrs) || {} : { [t.name]: e.attrs[t.name] }).reduce((e, t) => J(e, t), {});
}
function jf(e) {
	return typeof e == "string" ? e.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(e) : e === "true" || e !== "false" && e : e;
}
function Mf(e, t) {
	return "style" in e ? e : {
		...e,
		getAttrs: (n) => {
			let r = e.getAttrs ? e.getAttrs(n) : e.attrs;
			if (r === !1) return !1;
			let i = t.reduce((e, t) => {
				let r = t.attribute.parseHTML ? t.attribute.parseHTML(n) : jf(n.getAttribute(t.name));
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
function Nf(e) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => e === "attrs" && Df(t) ? !1 : t != null));
}
function Pf(e) {
	var t, n;
	let r = {};
	return !(e != null && (t = e.attribute) != null && t.isRequired) && "default" in (e?.attribute || {}) && (r.default = e.attribute.default), (e == null || (n = e.attribute) == null ? void 0 : n.validate) !== void 0 && (r.validate = e.attribute.validate), [e.name, r];
}
function Ff(e, t, n = Tf(e)) {
	let { nodeExtensions: r, markExtensions: i } = wf(e);
	return {
		topNode: r.find((e) => K(e, "topNode"))?.name,
		nodes: Object.fromEntries(r.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = Nf({
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
				attrs: Object.fromEntries(i.map(Pf))
			}), s = q(K(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => Mf(e, i)));
			let c = K(r, "renderHTML", a);
			c && (o.toDOM = (e) => c({
				node: e,
				HTMLAttributes: Af(e, i)
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
			}, o = Nf({
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
				attrs: Object.fromEntries(i.map(Pf))
			}), s = q(K(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => Mf(e, i)));
			let c = K(r, "renderHTML", a);
			return c && (o.toDOM = (e) => c({
				mark: e,
				HTMLAttributes: Af(e, i)
			})), [r.name, o];
		}))
	};
}
function If(e, t, n) {
	if (n === void 0) return new Ln(Ff(e, t));
	let r = Cf(e.filter((e) => e.type !== "extension").map((e) => e.name));
	if (r.length) throw RangeError(`Duplicate local schema types: ${r.join(", ")}`);
	let i = new Ln(n);
	return new Ln(Sf(Ff(e, t, gf(Tf(e), i)), i));
}
function Lf(e) {
	return e.sort((e, t) => {
		let n = K(e, "priority") || 100, r = K(t, "priority") || 100;
		return n > r ? -1 : +(n < r);
	});
}
function Rf(e) {
	let t = Lf(mf(e)), n = Cf(t.map((e) => e.name));
	return n.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${n.map((e) => `'${e}'`).join(", ")}]. This can lead to issues.`), t;
}
function zf(e, t, n) {
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
function Bf(e, t) {
	return zf(e, {
		from: 0,
		to: e.content.size
	}, t);
}
function Vf(e) {
	return Object.fromEntries(Object.entries(e.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
function Hf(e, t) {
	let n = G(t, e.schema), { from: r, to: i } = e.selection, a = [];
	e.doc.nodesBetween(r, i, (e) => {
		a.push(e);
	});
	let o = a.reverse().find((e) => e.type.name === n.name);
	return o ? { ...o.attrs } : {};
}
function Uf(e, t) {
	let n = Yd(typeof t == "string" ? t : t.name, e.schema);
	return n === "node" ? Hf(e, t) : n === "mark" ? cf(e, t) : {};
}
function Wf(e, t = JSON.stringify) {
	let n = {};
	return e.filter((e) => {
		let r = t(e);
		return Object.prototype.hasOwnProperty.call(n, r) ? !1 : n[r] = !0;
	});
}
function Gf(e) {
	let t = Wf(e);
	return t.length === 1 ? t : t.filter((e, n) => !t.filter((e, t) => t !== n).some((t) => e.oldRange.from >= t.oldRange.from && e.oldRange.to <= t.oldRange.to && e.newRange.from >= t.newRange.from && e.newRange.to <= t.newRange.to));
}
function Kf(e) {
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
	}), Gf(r);
}
function qf(e, t, n) {
	let r = [];
	return e === t ? n.resolve(e).marks().forEach((t) => {
		let i = ud(n.resolve(e), t.type);
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
var Jf = (e, t, n, r = 20) => {
	let i = e.doc.resolve(n), a = r, o = null;
	for (; a > 0 && o === null;) {
		let e = i.node(a);
		e?.type.name === t ? o = e : --a;
	}
	return [o, a];
}, Yf = (e) => {
	let t = e.depth - 1;
	if (t < 0) return null;
	let n = e.index(t);
	return n === 0 ? null : e.node(t).child(n - 1);
};
function Xf(e, t) {
	return t.nodes[e] || t.marks[e] || null;
}
function Zf(e, t, n) {
	return Object.fromEntries(Object.entries(n).filter(([n]) => {
		let r = e.find((e) => e.type === t && e.name === n);
		return r ? r.attribute.keepOnSplit : !1;
	}));
}
var Qf = (e, t = 500) => {
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
function $f(e, t, n = {}) {
	let { empty: r, ranges: i } = e.selection, a = t ? dd(t, e.schema) : null;
	if (r) return !!(e.storedMarks || e.selection.$from.marks()).filter((e) => !a || a.name === e.type.name).find((e) => sd(e.attrs, n, { strict: !1 }));
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
	let c = s.filter((e) => !a || a.name === e.mark.type.name).filter((e) => sd(e.mark.attrs, n, { strict: !1 })).reduce((e, t) => e + t.to - t.from, 0), l = s.filter((e) => !a || e.mark.type !== a && e.mark.type.excludes(a)).reduce((e, t) => e + t.to - t.from, 0);
	return (c > 0 ? c + l : c) >= o;
}
function ep(e, t, n = {}) {
	if (!t) return Wd(e, null, n) || $f(e, null, n);
	let r = Yd(t, e.schema);
	return r === "node" ? Wd(e, t, n) : r === "mark" && $f(e, t, n);
}
var tp = (e, t) => {
	let { $from: n, $to: r, $anchor: i } = e.selection;
	if (t) {
		let n = pf((e) => e.type.name === t)(e.selection);
		if (!n) return !1;
		let r = e.doc.resolve(n.pos + 1);
		return i.pos + 1 === r.end();
	}
	return !(r.parentOffset < r.parent.nodeSize - 2 || n.pos !== r.pos);
}, np = (e) => {
	let { $from: t, $to: n } = e.selection;
	return !(t.parentOffset > 0 || t.pos !== n.pos);
};
function rp(e, t) {
	return Array.isArray(t) ? t.some((t) => (typeof t == "string" ? t : t.name) === e.name) : t;
}
function ip(e, t) {
	let { nodeExtensions: n } = wf(t), r = n.find((t) => t.name === e);
	if (!r) return !1;
	let i = q(K(r, "group", {
		name: r.name,
		options: r.options,
		storage: r.storage
	}));
	return typeof i == "string" && i.split(" ").includes("list");
}
function ap(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
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
			r !== !1 && (ap(e, {
				ignoreWhitespace: n,
				checkChildren: t
			}) || (r = !1));
		}), r;
	}
	return !1;
}
function op(e) {
	return e instanceof I;
}
function sp(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.apply == "function" && typeof t.getMap == "function" && typeof t.invert == "function" && typeof t.map == "function" && typeof t.merge == "function" && typeof t.toJSON == "function";
}
function cp(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	if (!sp(t)) return !1;
	let n = t.toJSON();
	return !(typeof n != "object" || !n || n.stepType !== "replace");
}
var lp = class e {
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
function up(e, t) {
	let n = t.mapping.mapResult(e.position);
	return {
		position: new lp(n.pos),
		mapResult: n
	};
}
function dp(e) {
	return new lp(e);
}
function fp(e, t, n) {
	let { selection: r } = t, i = null;
	if (md(r) && (i = r.$cursor), i) {
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
var pp = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = n, { empty: o, ranges: s } = a, c = dd(e, r.schema);
	if (i) {
		if (o) {
			let e = cf(r, c);
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
	return fp(r, n, c);
}, mp = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), hp = (e, t = {}) => ({ state: n, dispatch: r, chain: i }) => {
	let a = G(e, n.schema), o;
	return n.selection.$anchor.sameParent(n.selection.$head) && (o = n.selection.$anchor.parent.attrs), a.isTextblock ? i().command(({ commands: e }) => Sa(a, {
		...o,
		...t
	})(n) ? !0 : e.clearNodes()).command(({ state: e }) => Sa(a, {
		...o,
		...t
	})(e, r)).run() : (console.warn("[tiptap warn]: Currently \"setNode()\" only supports text block nodes."), !1);
}, gp = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, r = hd(e, 0, n.content.size), i = I.create(n, r);
		t.setSelection(i);
	}
	return !0;
}, _p = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = r, o, s;
	return typeof t == "number" ? (o = t, s = t) : t && "from" in t && "to" in t ? (o = t.from, s = t.to) : (o = a.from, s = a.to), i && n.doc.nodesBetween(o, s, (t, r) => {
		t.isText || n.setNodeMarkup(r, void 0, {
			...t.attrs,
			dir: e
		});
	}), !0;
}, vp = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, { from: r, to: i } = typeof e == "number" ? {
			from: e,
			to: e
		} : e, a = F.atStart(n).from, o = F.atEnd(n).to, s = hd(r, a, o), c = hd(i, a, o), l = F.create(n, s, c);
		t.setSelection(l);
	}
	return !0;
}, yp = (e) => ({ state: t, dispatch: n }) => Pa(G(e, t.schema))(t, n);
function bp(e, t) {
	let n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
	if (n) {
		let r = n.filter((e) => t?.includes(e.type.name));
		e.tr.ensureMarks(r);
	}
}
var xp = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: i }) => {
	let { selection: a, doc: o } = t, { $from: s, $to: c } = a, l = i.extensionManager.attributes, u = Zf(l, s.node().type.name, s.node().attrs);
	if (a instanceof I && a.node.isBlock) return !s.parentOffset || !Jr(o, s.pos) ? !1 : (r && (e && bp(n, i.extensionManager.splittableMarks), t.split(s.pos).scrollIntoView()), !0);
	if (!s.parent.isBlock) return !1;
	let d = c.parentOffset === c.parent.content.size, f = s.depth === 0 ? void 0 : Ad(s.node(-1).contentMatchAt(s.indexAfter(-1))), p = d && f ? [{
		type: f,
		attrs: u
	}] : void 0, m = a instanceof F && !a.empty ? Vi.create({
		doc: t.doc,
		selection: a
	}).tr.deleteSelection() : null, h = m ? m.doc : t.doc, g = m ? m.mapping.map(s.pos) : s.pos, _ = Jr(h, g, 1, p);
	if (!p && !_ && Jr(h, g, 1, f ? [{ type: f }] : void 0) && (_ = !0, p = f ? [{
		type: f,
		attrs: u
	}] : void 0), r) {
		if (_) {
			let e = t.steps.length;
			if (a instanceof F && t.deleteSelection(), t.split(t.mapping.slice(e).map(s.pos), 1, p), f && !d && !s.parentOffset && s.parent.type !== f) {
				let n = t.mapping.slice(e).map(s.before()), r = t.doc.resolve(n);
				s.node(-1).canReplaceWith(r.index(), r.index() + 1, f) && t.setNodeMarkup(t.mapping.slice(e).map(s.before()), f);
			}
		}
		e && bp(n, i.extensionManager.splittableMarks), t.scrollIntoView();
	}
	return _;
}, Sp = (e, t = {}) => ({ tr: n, state: r, dispatch: i, editor: a }) => {
	let o = G(e, r.schema), { $from: s, $to: c } = r.selection, l = r.selection.node;
	if (l && l.isBlock || s.depth < 2 || !s.sameParent(c)) return !1;
	let u = s.node(-1);
	if (u.type !== o) return !1;
	let d = a.extensionManager.attributes;
	if (s.parent.content.size === 0 && s.node(-1).childCount === s.indexAfter(-1)) {
		if (s.depth === 2 || s.node(-3).type !== o || s.index(-2) !== s.node(-2).childCount - 1) return !1;
		if (i) {
			let e = A.empty, r = s.index(-1) ? 1 : s.index(-2) ? 2 : 3;
			for (let t = s.depth - r; t >= s.depth - 3; --t) e = A.from(s.node(t).copy(e));
			let i = s.indexAfter(-1) < s.node(-2).childCount ? 1 : s.indexAfter(-2) < s.node(-3).childCount ? 2 : 3, a = {
				...Zf(d, s.node().type.name, s.node().attrs),
				...t
			}, c = o.contentMatch.defaultType?.createAndFill(a) || void 0;
			e = e.append(A.from(o.createAndFill(null, c) || void 0));
			let l = s.before(s.depth - (r - 1));
			n.replace(l, s.after(-i), new M(e, 4 - r, 0));
			let u = -1;
			n.doc.nodesBetween(l, n.doc.content.size, (e, t) => {
				if (u > -1) return !1;
				e.isTextblock && e.content.size === 0 && (u = t + 1);
			}), u > -1 && n.setSelection(F.near(n.doc.resolve(u))), n.scrollIntoView();
		}
		return !0;
	}
	let f = c.pos === s.end() ? u.contentMatchAt(0).defaultType : null, p = {
		...Zf(d, u.type.name, u.attrs),
		...t
	}, m = {
		...Zf(d, s.node().type.name, s.node().attrs),
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
	if (!Jr(n.doc, s.pos, 2)) return !1;
	if (i) {
		let { selection: e, storedMarks: t } = r, { splittableMarks: o } = a.extensionManager, c = t || e.$to.parentOffset && e.$from.marks();
		if (n.split(s.pos, 2, v).scrollIntoView(), h && n.setNodeMarkup(g, void 0, p), !c || !i) return !0;
		let l = c.filter((e) => o.includes(e.type.name));
		n.ensureMarks(l);
	}
	return !0;
};
function Cp(e, t, n) {
	if (!e.validContent(t)) return null;
	try {
		return e.create(n, t);
	} catch {
		return null;
	}
}
function wp(e, t) {
	if (e.pendingContent.length === 0) return !0;
	let n = Cp(t, A.from(e.pendingContent));
	return n ? (e.items.push(n), e.pendingContent = [], !0) : !1;
}
function Tp(e, t, n) {
	return n.validContent(A.from([...t.pendingContent, e])) ? (t.pendingContent.push(e), !0) : !wp(t, n) || !n.validContent(A.from(e)) ? !1 : (t.pendingContent.push(e), !0);
}
function Ep(e, t, n, r) {
	let i = r(e, n);
	if (!i) return !1;
	let a = Cp(n.listType, A.from(i), e.attrs);
	return a ? n.itemType.validContent(A.from([...t.pendingContent, a])) ? (t.pendingContent.push(a), !0) : wp(t, n.itemType) ? (t.items.push(...i), !0) : !1 : !1;
}
function Dp(e, t, n) {
	let r = {
		items: [],
		pendingContent: []
	};
	for (let i = 0; i < e.childCount; i += 1) {
		let a = e.child(i);
		if (!(t.isListNode(a) ? Ep(a, r, t, n) : Tp(a, r, t.itemType))) return null;
	}
	return wp(r, t.itemType) ? r.items : null;
}
function Op(e, t) {
	let n = [];
	for (let r = 0; r < e.childCount; r += 1) {
		let i = Dp(e.child(r), t, Op);
		if (!i) return null;
		n.push(...i);
	}
	return n;
}
function kp(e, t) {
	let n = null;
	return e.descendants((e, r) => e !== t || (n = r, !1)), n;
}
function Ap(e) {
	return !e || e === "1" ? null : e;
}
function jp(e, t) {
	return Ap(e) === Ap(t);
}
var Mp = (e, t) => {
	let n = pf((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Xr(e.doc, n.pos)) || !jp(n.node.attrs.type, i?.attrs.type) || e.join(n.pos), !0;
}, Np = (e, t) => {
	let n = pf((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(n.start).after(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Xr(e.doc, r)) || !jp(n.node.attrs.type, i?.attrs.type) || e.join(r), !0;
};
function Pp(e) {
	let t = e.doc, n = t.firstChild;
	if (!n) return null;
	let r = t.resolve(1), i = t.resolve(n.nodeSize - 1);
	return F.between(r, i);
}
var Fp = (e, t, n, r = {}) => ({ editor: i, tr: a, state: o, dispatch: s, chain: c, commands: l, can: u }) => {
	let { extensions: d, splittableMarks: f } = i.extensionManager, p = G(e, o.schema), m = G(t, o.schema), { selection: h, storedMarks: g } = o, { $from: _, $to: v } = h, y = _.blockRange(v), b = g || h.$to.parentOffset && h.$from.marks();
	if (!y) return !1;
	let x = pf((e) => ip(e.type.name, d))(h), S = h.from === 0 && h.to === o.doc.content.size, C = o.doc.content.content, w = C.length === 1 ? C[0] : null, ee = S && w && ip(w.type.name, d) ? {
		node: w,
		pos: 0,
		depth: 0
	} : null, T = x ?? ee, E = !!x && y.depth >= 1 && y.depth - x.depth <= 1, D = !!ee;
	if ((E || D) && T) {
		if (T.node.type === p) return S && D ? c().command(({ tr: e, dispatch: t }) => {
			let n = Pp(e);
			return n ? (e.setSelection(n), t && t(e), !0) : !1;
		}).liftListItem(m).run() : l.liftListItem(m);
		if (ip(T.node.type.name, d) && p.validContent(T.node.content)) return c().command(() => (a.setNodeMarkup(T.pos, p), !0)).command(() => Mp(a, p)).command(() => Np(a, p)).run();
		if (ip(T.node.type.name, d)) {
			let e = T.node.firstChild?.type;
			if (e && e !== m) {
				let e = Op(T.node, {
					listType: p,
					itemType: m,
					isListNode: (e) => ip(e.type.name, d)
				}), t = e ? A.from(e) : null;
				return !t || !p.validContent(t) ? !1 : c().command(() => {
					let { $anchor: e, $head: n } = a.selection, i = e.parent, o = n.parent, s = e.parentOffset, c = n.parentOffset, l;
					try {
						l = p.create(r, t);
					} catch {
						return !1;
					}
					if (a.replaceWith(T.pos, T.pos + T.node.nodeSize, l), i.inlineContent && o.inlineContent) {
						let e = kp(l, i), t = kp(l, o);
						if (e !== null && t !== null) {
							let n = T.pos + e + 2 + s, r = T.pos + t + 2 + c;
							a.setSelection(F.create(a.doc, n, r));
						}
					}
					return !0;
				}).command(() => Mp(a, p)).command(() => Np(a, p)).run();
			}
		}
	}
	return !n || !b || !s ? c().command(() => u().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => Mp(a, p)).command(() => Np(a, p)).run() : c().command(() => {
		let e = u().wrapInList(p, r), t = b.filter((e) => f.includes(e.type.name));
		return a.ensureMarks(t), e ? !0 : l.clearNodes();
	}).wrapInList(p, r).command(() => Mp(a, p)).command(() => Np(a, p)).run();
}, Ip = (e, t = {}, n = {}) => ({ state: r, commands: i }) => {
	let { extendEmptyMarkRange: a = !1 } = n, o = dd(e, r.schema);
	return $f(r, o, t) ? i.unsetMark(o, { extendEmptyMarkRange: a }) : i.setMark(o, t);
}, Lp = (e, t, n = {}) => ({ state: r, commands: i }) => {
	let a = G(e, r.schema), o = G(t, r.schema), s = Wd(r, a, n), c;
	return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), s ? i.setNode(o, c) : i.setNode(a, {
		...c,
		...n
	});
}, Rp = (e, t = {}) => ({ state: n, commands: r }) => {
	let i = G(e, n.schema);
	return Wd(n, i, t) ? r.lift(i) : r.wrapIn(i, t);
}, zp = () => ({ state: e, dispatch: t }) => {
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
}, Bp = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
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
}, Vp = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { extendEmptyMarkRange: a = !1 } = t, { selection: o } = n, s = dd(e, r.schema), { $from: c, empty: l, ranges: u } = o;
	if (!i) return !0;
	if (l && a) {
		let { from: e, to: t } = o, r = ud(c, s, c.marks().find((e) => e.type === s)?.attrs);
		r && (e = r.from, t = r.to), n.removeMark(e, t, s);
	} else u.forEach((e) => {
		n.removeMark(e.$from.pos, e.$to.pos, s);
	});
	return n.removeStoredMark(s), !0;
}, Hp = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let { selection: i } = n, a, o;
	return typeof e == "number" ? (a = e, o = e) : e && "from" in e && "to" in e ? (a = e.from, o = e.to) : (a = i.from, o = i.to), r && t.doc.nodesBetween(a, o, (e, n) => {
		if (e.isText) return;
		let r = { ...e.attrs };
		delete r.dir, t.setNodeMarkup(n, void 0, r);
	}), !0;
}, Up = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Yd(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = G(e, r.schema)), s === "mark" && (o = dd(e, r.schema));
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
}, Wp = new R("__tiptap_decorations__"), Gp = (e) => ({ tr: t, dispatch: n }) => (n && t.setMeta(Wp, {
	type: "force",
	name: e
}), !0), Kp = (e, t = {}) => ({ state: n, dispatch: r }) => xa(G(e, n.schema), t)(n, r), qp = (e, t = {}) => ({ state: n, dispatch: r }) => Oa(G(e, n.schema), t)(n, r), Jp = /* @__PURE__ */ Rt({
	blur: () => Gu,
	clearContent: () => Ku,
	clearNodes: () => qu,
	command: () => Ju,
	createParagraphNear: () => Yu,
	cut: () => Xu,
	deleteCurrentNode: () => Zu,
	deleteNode: () => Qu,
	deleteRange: () => $u,
	deleteSelection: () => rd,
	enter: () => id,
	exitCode: () => ad,
	extendMarkRange: () => fd,
	first: () => pd,
	focus: () => bd,
	forEach: () => xd,
	insertContent: () => Sd,
	insertContentAt: () => kd,
	insertDefaultBlock: () => jd,
	joinBackward: () => Pd,
	joinDown: () => Nd,
	joinForward: () => Fd,
	joinItemBackward: () => Ld,
	joinItemForward: () => Rd,
	joinTextblockBackward: () => zd,
	joinTextblockForward: () => Bd,
	joinUp: () => Md,
	keyboardShortcut: () => Ud,
	lift: () => Gd,
	liftEmptyBlock: () => Kd,
	liftListItem: () => qd,
	newlineInCode: () => Jd,
	resetAttributes: () => Zd,
	scrollIntoView: () => Qd,
	selectAll: () => $d,
	selectNodeBackward: () => ef,
	selectNodeForward: () => tf,
	selectParentNode: () => nf,
	selectTextblockEnd: () => rf,
	selectTextblockStart: () => af,
	setContent: () => sf,
	setMark: () => pp,
	setMeta: () => mp,
	setNode: () => hp,
	setNodeSelection: () => gp,
	setTextDirection: () => _p,
	setTextSelection: () => vp,
	sinkListItem: () => yp,
	splitBlock: () => xp,
	splitListItem: () => Sp,
	toggleList: () => Fp,
	toggleMark: () => Ip,
	toggleNode: () => Lp,
	toggleWrap: () => Rp,
	undoInputRule: () => zp,
	unsetAllMarks: () => Bp,
	unsetMark: () => Vp,
	unsetTextDirection: () => Hp,
	updateAttributes: () => Up,
	updateDecorations: () => Gp,
	wrapIn: () => Kp,
	wrapInList: () => qp
}), Yp = /* @__PURE__ */ new WeakMap();
function Xp(e, t) {
	Yp.set(e, (Yp.get(e) ?? 0) + 1);
	try {
		return t();
	} finally {
		let t = (Yp.get(e) ?? 1) - 1;
		t > 0 ? Yp.set(e, t) : Yp.delete(e);
	}
}
function Zp(e) {
	return Yp.has(e);
}
var Qp = class {
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
}, $p = typeof process < "u" && process.env.NODE_ENV !== "production";
function em(e) {
	return e.kind === "widget";
}
function tm(e, t) {
	let n = [], r = /* @__PURE__ */ new Set();
	for (let i of e) i.kind === "widget" && em(i) && r.add(i.key), n.push(i.toPMDecoration(t));
	return {
		decorations: n,
		widgetKeys: r
	};
}
function nm(e, t, n) {
	let { decorations: r, widgetKeys: i } = tm(t, n);
	return {
		set: U.create(e, r),
		widgetKeys: i
	};
}
function rm({ position: e, from: t, to: n, docSize: r }) {
	return e < t ? !1 : e < n || e === n && n === r;
}
function im({ decorations: e, from: t, to: n, docSize: r, extensionName: i, warnedExtensions: a }) {
	return e.filter((e) => rm({
		position: e.anchor,
		from: t,
		to: n,
		docSize: r
	}) ? !0 : (e.anchor === n || a.has(i) || (a.add(i), console.warn(`[tiptap warn]: Extension "${i}" returned a decoration outside the requested range [${t}, ${n}). It was ignored.`)), !1));
}
function am(e) {
	let t = e.spec?.key;
	return typeof t == "string" ? t : void 0;
}
function om(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
	for (let r of e.find()) {
		let e = am(r);
		if (!e) continue;
		let i = r.spec.extensionName ?? "unknown", a = t.get(e) ?? /* @__PURE__ */ new Set();
		a.add(i), t.set(e, a), n.set(e, (n.get(e) ?? 0) + 1);
	}
	return Array.from(t, ([e, t]) => ({
		key: e,
		extensions: t
	})).filter(({ key: e }) => (n.get(e) ?? 0) > 1);
}
function sm(e) {
	return e.jsonID === "attr";
}
function cm(e) {
	let t = !1;
	if (e.getMap().forEach(() => {
		t = !0;
	}), t || sm(e)) return !0;
	let n = e;
	return typeof n.from == "number" && typeof n.to == "number";
}
function lm(e, t) {
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
function um(e, t) {
	if (e.steps.some((e) => !cm(e))) return { type: "full" };
	let n = Kf(e).map(({ newRange: e }) => e);
	e.steps.forEach((t, r) => {
		if (!sm(t)) return;
		let i = e.mapping.slice(r);
		n.push({
			from: i.map(t.pos, -1),
			to: i.map(t.pos + 1)
		});
	});
	let r = [];
	for (let e of n) {
		let n = lm(t, e);
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
function dm(e, t, n, r) {
	return e.map(t, n, { onRemove: (e) => {
		let t = e?.key;
		typeof t == "string" && r.delete(t);
	} });
}
function fm(e, t, n) {
	let r = t.decorationSetsByExtension[e] ?? U.empty, i = new Set(t.widgetKeysByExtension[e] ?? []);
	return {
		set: dm(r, n.mapping, n.doc, i),
		widgetKeys: i
	};
}
function pm(e, t) {
	let n = Object.values(t).flatMap((e) => e.find());
	return U.create(e, n);
}
function mm(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of Object.values(e)) for (let e of n) t.add(e);
	return t;
}
function hm(e, t) {
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
function gm(e, t, n) {
	return n ? !0 : e.update === "manual" ? !1 : e.shouldUpdate ? e.shouldUpdate(t) : t.tr.docChanged;
}
var _m = /* @__PURE__ */ new Set(), vm = class {
	constructor(e) {
		this.warnedWidgetKeys = /* @__PURE__ */ new Set(), this.warnedOutOfRangeExtensions = /* @__PURE__ */ new Set(), this.handleBeforeTransaction = ({ nextState: e }) => {
			let t = Wp.getState(e);
			t && this.warnDuplicateWidgetKeys(t);
		}, this.editor = e.editor, this.entries = this.resolveEntries(e.entries), this.entries.forEach(({ name: e, spec: t }) => hm(e, t)), this.plugin = this.entries.length > 0 ? this.createPlugin() : null, this.editor.on("beforeTransaction", this.handleBeforeTransaction);
	}
	destroy() {
		this.editor.off("beforeTransaction", this.handleBeforeTransaction);
	}
	liveWidgetKeys() {
		return Wp.getState(this.editor.state)?.widgetKeys ?? _m;
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
		return new L({
			key: Wp,
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
						widgetKeys: mm(i)
					};
					return this.warnDuplicateWidgetKeys(a), a;
				},
				apply: (n, r, i, a) => {
					let o = n.getMeta(Wp), s = o?.type === "force" && !o.name, c = o?.type === "force" ? o.name : void 0, l = {}, u = {}, d = /* @__PURE__ */ new Set();
					return Xp(e, () => {
						for (let { name: o, spec: f } of t) {
							let t = s || c === o;
							if (!gm(f, {
								editor: e,
								tr: n,
								oldState: i,
								newState: a
							}, t)) {
								let e = fm(o, r, n);
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
						widgetKeys: mm(u)
					};
				}
			},
			props: { decorations(e) {
				return Wp.getState(e)?.mergedDecorationSet ?? U.empty;
			} }
		});
	}
	applyChangedRangesRecompute(e, t, n, r, i) {
		let a = um(r, i.doc);
		return a.type === "full" ? this.buildFullSet(e, t, i) : this.rebuildRanges(e, t, n, r, i, a.ranges);
	}
	rebuildRanges(e, t, n, r, i, a) {
		let o = n.decorationSetsByExtension[e] ?? U.empty, s = new Set(n.widgetKeysByExtension[e] ?? []), c = dm(o, r.mapping, r.doc, s), l = i.doc.content.size;
		for (let { from: n, to: r } of a) {
			let a = c.find(n, r).filter((e) => rm({
				position: e.from,
				from: n,
				to: r,
				docSize: l
			}));
			for (let e of a) {
				let t = am(e);
				t && s.delete(t);
			}
			c = c.remove(a);
			let { decorations: o, widgetKeys: u } = tm(im({
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
		return nm(n.doc, r, e);
	}
	runCreate(e, t, n) {
		try {
			return n();
		} catch (n) {
			return console.error(`[tiptap error]: Extension "${e}" threw in \`addDecorations().${t}()\`. Its decorations were dropped for this update.`, n), [];
		}
	}
	warnDuplicateWidgetKeys(e) {
		if (!$p) return;
		if (e.widgetKeys.size === 0) {
			this.warnedWidgetKeys.clear();
			return;
		}
		let t = om(e.mergedDecorationSet), n = new Set(t.map(({ key: e }) => e));
		for (let { key: e, extensions: n } of t) {
			if (this.warnedWidgetKeys.has(e)) continue;
			let t = Array.from(n).map((e) => `"${e}"`).join(", ");
			console.warn(`[tiptap warn]: Duplicate widget decoration key "${e}" in extension${n.size === 1 ? "" : "s"} ${t}. Widget decoration keys must be globally unique, otherwise ProseMirror misplaces the widget DOM. Use a stable, unique key (e.g. \`comment-\${id}\`).`);
		}
		this.warnedWidgetKeys = n;
	}
	buildMergedSet(e, t) {
		let n = Object.keys(t);
		return n.length === 1 ? t[n[0]] : pm(e, t);
	}
	mergeAfterApply({ entries: e, previous: t, tr: n, decorationSetsByExtension: r, recomputedNames: i }) {
		return e.length === 1 ? r[e[0].name] : i.size === 0 ? t.mergedDecorationSet.map(n.mapping, n.doc) : pm(n.doc, r);
	}
};
function ym(e, t) {
	let { selection: n } = e, { $from: r } = n;
	if (n instanceof I) {
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
function bm(e, t, n) {
	let r = document.querySelector(`style[data-tiptap-style${n ? `-${n}` : ""}]`);
	if (r !== null) return r;
	let i = document.createElement("style");
	return t && i.setAttribute("nonce", t), i.setAttribute(`data-tiptap-style${n ? `-${n}` : ""}`, ""), i.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(i), i;
}
function xm(e) {
	return e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function Sm(e) {
	return typeof e == "number";
}
function Cm(e) {
	return Object.prototype.toString.call(e).slice(8, -1);
}
function wm(e) {
	return Cm(e) === "Object" && e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype;
}
function Tm(e, t, n) {
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
var Em = 4;
function Dm(e) {
	let t = 0;
	for (let n of e) t = n === "	" ? t + Em - t % Em : t + 1;
	return t;
}
function Om(e, t, n, r, i) {
	if (!e || !Array.isArray(e.content)) return "";
	let a = typeof n == "function" ? n(r) : n, [o, ...s] = e.content, c = `${a}${t.renderChildren([o])}`;
	return s && s.length > 0 && s.forEach((e, n) => {
		let r = t.renderChild?.call(t, e, n + 1) ?? t.renderChildren([e]);
		if (r != null) {
			let n = (e) => {
				if (!i?.alignNestedToPrefix) return t.indent(e);
				let n = t.indent(""), r = Dm(a);
				return (Dm(n) >= r ? n : " ".repeat(r)) + e;
			}, o = r.split("\n").map((e) => n(e || "")).join("\n");
			c += e.type === "paragraph" ? `\n\n${o}` : `\n${o}`;
		}
	}), c;
}
function km(e, t) {
	let n = { ...e };
	return wm(e) && wm(t) && Object.keys(t).forEach((r) => {
		wm(t[r]) && wm(e[r]) ? n[r] = km(e[r], t[r]) : n[r] = t[r];
	}), n;
}
function Am(e, t, n = {}) {
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
var jm = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler, this.undoable = e.undoable ?? !0;
	}
}, Mm = (e, t) => {
	if (od(t)) return t.exec(e);
	let n = t(e);
	if (!n) return null;
	let r = [n.text];
	return r.index = n.index, r.input = e, r.data = n.data, n.replaceWith && (n.text.includes(n.replaceWith) || console.warn("[tiptap warn]: \"inputRuleMatch.replaceWith\" must be part of \"inputRuleMatch.text\"."), r.push(n.replaceWith)), r;
};
function Nm(e) {
	let { editor: t, from: n, to: r, text: i, insertText: a } = e;
	if (!a) return {
		inputTransaction: null,
		tr: t.view.state.tr
	};
	let o = t.view.state.tr.insertText(i, n, r);
	return {
		inputTransaction: o,
		tr: Vi.create({
			doc: o.doc,
			selection: o.selection,
			storedMarks: o.storedMarks
		}).tr
	};
}
function Pm(e) {
	let { editor: t, from: n, to: r, text: i, rule: a, match: o, plugin: s, insertText: c } = e, { view: l } = t, { inputTransaction: u, tr: d } = Nm({
		editor: t,
		from: n,
		to: r,
		text: i,
		insertText: c
	}), f = u ? n + i.length : r, p = Uu({
		state: l.state,
		transaction: d
	}), m = {
		from: n - (o[0].length - i.length),
		to: f
	}, { commands: h, chain: g, can: _ } = new Wu({
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
	}) === null || !d.steps.length ? !1 : (u && (l.dispatch(u), !l.state.doc.eq(u.doc)) || (Fu(d), d.setMeta("inputRule", !0), a.undoable && d.setMeta(s, {
		transform: d,
		from: n,
		to: f,
		text: i
	}), l.dispatch(d)), !0);
}
function Fm(e, t, n) {
	let r = t[0].length - n.length;
	if (r <= 0) return !0;
	let i = e.parentOffset - r;
	return i >= 0 && e.parent.textBetween(i, e.parentOffset) === t[0].slice(0, r);
}
function Im(e) {
	let { editor: t, from: n, to: r, text: i, rules: a, plugin: o, insertText: s } = e, { view: c } = t;
	if (c.composing) return !1;
	let l = c.state.doc.resolve(n);
	if (l.parent.type.spec.code || (l.nodeBefore || l.nodeAfter)?.marks.find((e) => e.type.spec.code)) return !1;
	let u = Qf(l) + i;
	for (let e of a) {
		let a = Mm(u, e.find);
		if (a && Fm(l, a, i) && Pm({
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
function Lm(e) {
	let { editor: t, rules: n } = e, r = new L({
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
					e = typeof e == "string" ? e : hf(A.from(e), a.schema);
					let { from: i } = s, o = i + e.length;
					Im({
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
				return Im({
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
				i && Im({
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
				return a ? Im({
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
var Rm = class {
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
			addOptions: () => km(this.options, e)
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
}, zm = class e extends Rm {
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
}, Bm = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler;
	}
}, Vm = (e, t, n) => {
	if (od(t)) return [...e.matchAll(t)];
	let r = t(e, n);
	return r ? r.map((t) => {
		let n = [t.text];
		return n.index = t.index, n.input = e, n.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn("[tiptap warn]: \"pasteRuleMatch.replaceWith\" must be part of \"pasteRuleMatch.text\"."), n.push(t.replaceWith)), n;
	}) : [];
};
function Hm(e) {
	let { editor: t, state: n, from: r, to: i, rule: a, pasteEvent: o, dropEvent: s } = e, { commands: c, chain: l, can: u } = new Wu({
		editor: t,
		state: n
	}), d = [];
	return n.doc.nodesBetween(r, i, (e, t) => {
		var f;
		if ((f = e.type) != null && (f = f.spec) != null && f.code || !(e.isText || e.isTextblock || e.isInline)) return;
		let p = e.content?.size ?? e.nodeSize ?? 0, m = Math.max(r, t), h = Math.min(i, t + p);
		m >= h || Vm(e.isText ? e.text || "" : e.textBetween(m - t, h - t, void 0, "￼"), a.find, o).forEach((e) => {
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
var Um = null, Wm = (e) => {
	var t;
	let n = new ClipboardEvent("paste", { clipboardData: new DataTransfer() });
	return (t = n.clipboardData) == null || t.setData("text/html", e), n;
};
function Gm(e) {
	let { editor: t, rules: n } = e, r = null, i = !1, a = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, s;
	try {
		s = typeof DragEvent < "u" ? new DragEvent("drop") : null;
	} catch {
		s = null;
	}
	let c = ({ state: e, from: n, to: r, rule: i, pasteEvt: a }) => {
		let c = e.tr, l = Uu({
			state: e,
			transaction: c
		});
		if (Hm({
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
		Um === t && (Um = null);
	}), n.map((e) => new L({
		view(e) {
			let n = (n) => {
				r = e.dom.parentElement?.contains(n.target) ? e.dom.parentElement : null, r && (Um = t);
			}, i = () => {
				Um &&= null;
			};
			return window.addEventListener("dragstart", n), window.addEventListener("dragend", i), { destroy() {
				window.removeEventListener("dragstart", n), window.removeEventListener("dragend", i);
			} };
		},
		props: { handleDOMEvents: {
			drop: (e, t) => {
				if (a = r === e.dom.parentElement, s = t, !a) {
					let e = Um;
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
				t = typeof t == "string" ? t : hf(A.from(t), r.schema);
				let { from: n } = d, i = n + t.length, a = Wm(t);
				return c({
					rule: e,
					state: r,
					from: n,
					to: { b: i },
					pasteEvt: a
				});
			}
			let p = n.doc.content.findDiffStart(r.doc.content), m = n.doc.content.findDiffEnd(r.doc.content);
			if (Sm(p) && m && p !== m.b) return c({
				rule: e,
				state: r,
				from: p,
				to: m,
				pasteEvt: o
			});
		}
	}));
}
var Km = class {
	constructor(e, t) {
		this.splittableMarks = [], this.nonClearableMarks = [], this.decorationManager = null, this.editor = t, this.baseExtensions = e, this.extensions = Rf(e), this.hasSchemaSpec = t.options.schemaSpec !== void 0, this.schema = If(this.extensions, t, t.options.schemaSpec), this.setupExtensions();
	}
	get commands() {
		return this.extensions.reduce((e, t) => {
			let n = K(t, "addCommands", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: this.editor,
				type: Xf(t.name, this.schema)
			});
			return n ? {
				...e,
				...n()
			} : e;
		}, {});
	}
	get plugins() {
		let { editor: e } = this, t = Lf([...this.extensions].reverse()).flatMap((t) => {
			let n = {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: Xf(t.name, this.schema)
			}, r = [], i = K(t, "addKeyboardShortcuts", n), a = {};
			if (t.type === "mark" && K(t, "exitable", n) && (a.ArrowRight = () => zm.handleExit({
				editor: e,
				mark: t
			})), i) {
				let t = Object.fromEntries(Object.entries(i()).map(([t, n]) => [t, () => n({ editor: e })]));
				a = {
					...a,
					...t
				};
			}
			let o = gu(a);
			r.push(o);
			let s = K(t, "addInputRules", n);
			if (rp(t, e.options.enableInputRules) && s) {
				let t = s();
				if (t && t.length) {
					let n = Lm({
						editor: e,
						rules: t
					}), i = Array.isArray(n) ? n : [n];
					r.push(...i);
				}
			}
			let c = K(t, "addPasteRules", n);
			if (rp(t, e.options.enablePasteRules) && c) {
				let t = c();
				if (t && t.length) {
					let n = Gm({
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
				type: Xf(e.name, this.schema)
			});
			r && n.push({
				name: e.name,
				addDecorations: r
			});
		}), this.decorationManager = new vm({
			editor: t,
			entries: n
		}), this.decorationManager.plugin;
	}
	get attributes() {
		let e = Tf(this.extensions);
		return this.hasSchemaSpec ? gf(e, this.schema) : e;
	}
	get nodeViews() {
		let { editor: e } = this, { nodeExtensions: t } = wf(this.extensions);
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
				let l = Af(r, n);
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
		return Lf([...this.extensions].reverse()).reduceRight((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: Xf(n.name, this.schema)
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
		return Lf([...this.extensions]).reduce((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: Xf(n.name, this.schema)
			}, i = K(n, "transformPastedHTML", r);
			return i ? (t, n) => {
				let a = e(t, n);
				return i.call(r, a);
			} : e;
		}, e || ((e) => e));
	}
	get markViews() {
		let { editor: e } = this, { markExtensions: t } = wf(this.extensions);
		return Object.fromEntries(t.filter((e) => !!K(e, "addMarkView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = K(t, "addMarkView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: dd(t.name, this.schema)
			});
			return r ? [t.name, (i, a, o) => {
				let s = Af(i, n);
				return r()({
					mark: i,
					view: a,
					inline: o,
					editor: e,
					extension: t,
					HTMLAttributes: s,
					updateAttributes: (t) => {
						Am(i, e, t);
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
				type: Xf(e.name, this.schema)
			};
			e.type === "mark" && ((q(K(e, "keepOnSplit", t)) ?? !0) && this.splittableMarks.push(e.name), (q(K(e, "clearable", t)) ?? !0) || this.nonClearableMarks.push(e.name));
			let n = K(e, "onBeforeCreate", t), r = K(e, "onCreate", t), i = K(e, "onUpdate", t), a = K(e, "onSelectionUpdate", t), o = K(e, "onTransaction", t), s = K(e, "onFocus", t), c = K(e, "onBlur", t), l = K(e, "onDestroy", t);
			n && this.editor.on("beforeCreate", n), r && this.editor.on("create", r), i && this.editor.on("update", i), a && this.editor.on("selectionUpdate", a), o && this.editor.on("transaction", o), s && this.editor.on("focus", s), c && this.editor.on("blur", c), l && this.editor.on("destroy", l);
		});
	}
};
Km.resolve = Rf, Km.sort = Lf, Km.flatten = mf;
var Y = class e extends Rm {
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
}, qm = Y.create({
	name: "clipboardTextSerializer",
	addOptions() {
		return { blockSeparator: void 0 };
	},
	addProseMirrorPlugins() {
		return [new L({
			key: new R("clipboardTextSerializer"),
			props: { clipboardTextSerializer: () => {
				let { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: i } = t, a = Vf(n), { blockSeparator: o } = this.options, s = {
					...o === void 0 ? {} : { blockSeparator: o },
					textSerializers: a
				};
				return [...i.ranges].sort((e, t) => e.$from.pos - t.$from.pos).map(({ $from: e, $to: t }) => zf(r, {
					from: e.pos,
					to: t.pos
				}, s)).join(o ?? "\n\n");
			} }
		})];
	}
}), Jm = Y.create({
	name: "commands",
	addCommands() {
		return { ...Jp };
	}
}), Ym = Y.create({
	name: "delete",
	onUpdate({ transaction: e, appendedTransactions: t }) {
		var n;
		let r = () => {
			var n, r;
			if (((n = this.editor.options.coreExtensionOptions) == null || (n = n.delete) == null || (r = n.filterTransaction) == null ? void 0 : r.call(n, e)) ?? e.getMeta("y-sync$")) return;
			let i = lf(e.before, [e, ...t]);
			Kf(i).forEach((t) => {
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
				if (t instanceof wr) {
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
}), Xm = Y.create({
	name: "drop",
	addProseMirrorPlugins() {
		return [new L({
			key: new R("tiptapDrop"),
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
}), Zm = Y.create({
	name: "editable",
	addProseMirrorPlugins() {
		return [new L({
			key: new R("editable"),
			props: { editable: () => this.editor.options.editable }
		})];
	}
}), Qm = new R("focusEvents"), $m = Y.create({
	name: "focusEvents",
	addProseMirrorPlugins() {
		let { editor: e } = this;
		return [new L({
			key: Qm,
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
}), eh = Y.create({
	name: "keymap",
	addKeyboardShortcuts() {
		let e = () => this.editor.commands.first(({ commands: e }) => [
			() => e.undoInputRule(),
			() => e.command(({ tr: t }) => {
				let { selection: n, doc: r } = t, { empty: i, $anchor: a } = n, { pos: o, parent: s } = a, c = a.parent.isTextblock && o > 0 ? t.doc.resolve(o - 1) : a, l = c.parent.type.spec.isolating, u = a.pos - a.parentOffset, d = l && c.parent.childCount === 1 ? u === a.pos : P.atStart(r).from === o;
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
		return vd() || Vd() ? i : r;
	},
	addProseMirrorPlugins() {
		return [new L({
			key: new R("clearDocument"),
			appendTransaction: (e, t, n) => {
				if (e.some((e) => e.getMeta("composition"))) return;
				let r = e.some((e) => e.docChanged) && !t.doc.eq(n.doc), i = e.some((e) => e.getMeta("preventClearDocument"));
				if (!r || i) return;
				let { empty: a, from: o, to: s } = t.selection, c = P.atStart(t.doc).from, l = P.atEnd(t.doc).to;
				if (a || o !== c || s !== l || !ap(n.doc)) return;
				let u = n.tr, d = Uu({
					state: n,
					transaction: u
				}), { commands: f } = new Wu({
					editor: this.editor,
					state: d
				});
				if (f.clearNodes(), u.steps.length) return u;
			}
		})];
	}
}), th = Y.create({
	name: "paste",
	addProseMirrorPlugins() {
		return [new L({
			key: new R("tiptapPaste"),
			props: { handlePaste: (e, t, n) => {
				this.editor.emit("paste", {
					editor: this.editor,
					event: t,
					slice: n
				});
			} }
		})];
	}
}), nh = Y.create({
	name: "tabindex",
	addOptions() {
		return { value: void 0 };
	},
	addProseMirrorPlugins() {
		return [new L({
			key: new R("tabindex"),
			props: { attributes: () => !this.editor.isEditable && this.options.value === void 0 ? {} : { tabindex: this.options.value ?? "0" } }
		})];
	}
}), rh = Y.create({
	name: "textDirection",
	addOptions() {
		return { direction: void 0 };
	},
	addGlobalAttributes() {
		if (!this.options.direction) return [];
		let { nodeExtensions: e } = wf(this.extensions);
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
		return [new L({
			key: new R("textDirection"),
			props: { attributes: () => {
				let e = this.options.direction;
				return e ? { dir: e } : {};
			} }
		})];
	}
}), ih = !1;
function ah(e) {
	if (ih) return;
	ih = !0;
	let t;
	try {
		let n = kr.fromJSON(e, {
			from: 0,
			to: 0
		});
		if (!cp(n)) return;
		t = n.slice.content;
	} catch {
		return;
	}
	t instanceof A || console.warn("[tiptap warn]: prosemirror-model is loaded more than once. Wrapping and splitting nodes will fail. Deduplicate it in your lock file, or alias it to a single copy in your bundler.");
}
var oh = class e {
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
}, sh = ".ProseMirror {\n  position: relative;\n}\n\n.ProseMirror {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  white-space: break-spaces;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none;\n  font-feature-settings: \"liga\" 0; /* the above doesn't seem to work in Edge */\n}\n\n.ProseMirror [contenteditable=\"false\"] {\n  white-space: normal;\n}\n\n.ProseMirror [contenteditable=\"false\"] [contenteditable=\"true\"] {\n  white-space: pre-wrap;\n}\n\n.ProseMirror pre {\n  white-space: pre-wrap;\n}\n\nimg.ProseMirror-separator {\n  display: inline !important;\n  border: none !important;\n  margin: 0 !important;\n  width: 0 !important;\n  height: 0 !important;\n}\n\n.ProseMirror-gapcursor {\n  display: none;\n  pointer-events: none;\n  position: absolute;\n  margin: 0;\n}\n\n.ProseMirror-gapcursor:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: -2px;\n  width: 20px;\n  border-top: 1px solid black;\n  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;\n}\n\n@keyframes ProseMirror-cursor-blink {\n  to {\n    visibility: hidden;\n  }\n}\n\n.ProseMirror-hideselection *::selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection *::-moz-selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection * {\n  caret-color: transparent;\n}\n\n.ProseMirror-focused .ProseMirror-gapcursor {\n  display: block;\n}", ch = class extends Qp {
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
			getUpdatedPosition: up,
			createMappablePosition: dp
		}, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: e, slice: t, moved: n }) => this.options.onDrop(e, t, n)), this.on("paste", ({ event: e, slice: t }) => this.options.onPaste(e, t)), this.on("delete", this.options.onDelete);
		let t = this.createDoc();
		if (!this.editorState) {
			let e = gd(t, this.options.autofocus);
			this.editorState = Vi.create({
				doc: t,
				schema: this.schema,
				selection: e || void 0
			});
		}
		ah(this.schema), this.options.element && this.mount(this.options.element);
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
		return this.commandManager ? this.commandManager.chain() : Wu.createFakeChain();
	}
	can() {
		return this.commandManager ? this.commandManager.can() : Wu.createFallbackCan();
	}
	injectCSS() {
		this.options.injectCSS && typeof document < "u" && (this.css = bm(sh, this.options.injectNonce));
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
		return $p && !this.hasWarnedStaleDecorationRead && Zp(this) && (this.hasWarnedStaleDecorationRead = !0, console.warn("[tiptap warn]: `editor.state` was read while decoration `create()` was running. It returns the pre-transaction document. Use the `state` argument passed to `create()` instead. Helpers like `editor.isActive()` read `editor.state` too, so pass `state` to their standalone versions instead of calling them on the editor.")), this.editorView && (this.editorState = this.view.state), this.editorState;
	}
	registerPlugin(e, t) {
		let n = Ef(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], r = this.state.reconfigure({ plugins: n });
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
			Zm,
			qm.configure({ blockSeparator: (e = this.options.coreExtensionOptions) == null || (e = e.clipboardTextSerializer) == null ? void 0 : e.blockSeparator }),
			Jm,
			$m,
			eh,
			nh.configure({ value: (t = this.options.coreExtensionOptions) == null || (t = t.tabindex) == null ? void 0 : t.value }),
			Xm,
			th,
			Ym,
			rh.configure({ direction: this.options.textDirection })
		].filter((e) => typeof this.options.enableCoreExtensions != "object" || this.options.enableCoreExtensions[e.name] !== !1) : [], ...this.options.extensions].filter((e) => [
			"extension",
			"node",
			"mark"
		].includes(e?.type));
		this.extensionManager = new Km(n, this);
	}
	createCommandManager() {
		this.commandManager = new Wu({ editor: this });
	}
	createSchema() {
		this.schema = this.extensionManager.schema;
	}
	createDoc() {
		let e;
		try {
			e = of(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: this.options.enableContentCheck });
		} catch (e) {
			if (!(e instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(e.message)) throw e;
			let t = of(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: !1 });
			return this.editorState = Vi.create({
				doc: t,
				schema: this.schema,
				selection: gd(t, this.options.autofocus) || void 0
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
		return Ef(e) ? (t) => ({
			role: "textbox",
			...e(t)
		}) : {
			role: "textbox",
			...e
		};
	}
	createView(e) {
		let { editorProps: t, enableExtensionDispatchTransaction: n } = this.options, r = t.dispatchTransaction || this.dispatchTransaction.bind(this), i = n ? this.extensionManager.dispatchTransaction(r) : r, a = t.transformPastedHTML, o = this.extensionManager.transformPastedHTML(a);
		this.editorView = new Xl(e, {
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
		return Uf(this.state, e);
	}
	isActive(e, t) {
		let n = typeof e == "string" ? e : null, r = typeof e == "string" ? t : e;
		return ep(this.state, n, r);
	}
	getJSON() {
		return this.state.doc.toJSON();
	}
	getHTML() {
		return hf(this.state.doc.content, this.schema);
	}
	getText(e) {
		let { blockSeparator: t = "\n\n", textSerializers: n = {} } = e || {};
		return Bf(this.state.doc, {
			blockSeparator: t,
			textSerializers: {
				...Vf(this.schema),
				...n
			}
		});
	}
	get isEmpty() {
		return ap(this.state.doc);
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
		return new oh(t, this, !1, n);
	}
	get $doc() {
		return this.$pos(0);
	}
};
function lh(e) {
	return new jm({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = q(e.getAttributes, void 0, r);
			if (i === !1 || i === null) return null;
			let { tr: a } = t, o = r[r.length - 1], s = r[0];
			if (o) {
				let r = s.search(/\S/), c = n.from + s.indexOf(o), l = c + o.length;
				if (qf(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > c).length) return null;
				l < n.to && a.delete(l, n.to), c > n.from && a.delete(n.from + r, c);
				let u = n.from + r + o.length;
				a.addMark(n.from + r, u, e.type.create(i || {})), a.removeStoredMark(e.type);
			}
		},
		undoable: e.undoable
	});
}
function uh(e) {
	return new jm({
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
function dh(e) {
	return new jm({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = t.doc.resolve(n.from), a = q(e.getAttributes, void 0, r) || {};
			if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), e.type)) return null;
			t.tr.delete(n.from, n.to).setBlockType(n.from, n.from, e.type, a);
		},
		undoable: e.undoable
	});
}
function fh(e) {
	return new jm({
		find: e.find,
		handler: ({ state: t, range: n, match: r, chain: i }) => {
			let a = q(e.getAttributes, void 0, r) || {}, o = t.tr.delete(n.from, n.to), s = o.doc.resolve(n.from).blockRange(), c = s && Rr(s, e.type, a);
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
			l && l.type === e.type && Xr(o.doc, n.from - 1) && (!e.joinPredicate || e.joinPredicate(r, l)) && o.join(n.from - 1);
		},
		undoable: e.undoable
	});
}
var ph = (e) => "touches" in e, mh = class {
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
		e.preventDefault(), e.stopPropagation(), this.isResizing = !0, this.activeHandle = t, ph(e) ? (this.startX = e.touches[0].clientX, this.startY = e.touches[0].clientY) : (this.startX = e.clientX, this.startY = e.clientY), this.startWidth = this.element.offsetWidth, this.startHeight = this.element.offsetHeight, this.startWidth > 0 && this.startHeight > 0 && (this.aspectRatio = this.startWidth / this.startHeight), this.getPos(), this.container.dataset.resizeState = "true", this.classNames.resizing && this.container.classList.add(this.classNames.resizing), document.addEventListener("mousemove", this.handleMouseMove), document.addEventListener("touchmove", this.handleTouchMove), document.addEventListener("mouseup", this.handleMouseUp), document.addEventListener("keydown", this.handleKeyDown), document.addEventListener("keyup", this.handleKeyUp);
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
}, hh = class e extends Rm {
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
}, gh = class {
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
		let u = I.create(t.state.doc, l), d = t.state.tr.setSelection(u);
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
		let { isEditable: a } = this.editor, { isDragging: o } = this, s = !!this.node.type.spec.draggable, c = I.isSelectable(this.node), l = e.type === "copy", u = e.type === "paste", d = e.type === "cut", f = e.type === "mousedown";
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
		return this.dom ? this.contentDOM ? typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: e }) : this.node.isLeaf || this.node.isAtom ? !0 : e.type === "selection" || this.contentDOM.contains(e.target) && e.type === "childList" && (vd() || _d()) && this.editor.isFocused && [...Array.from(e.addedNodes), ...Array.from(e.removedNodes)].every((e) => e.isContentEditable) ? !1 : this.contentDOM === e.target && e.type === "attributes" || !this.contentDOM.contains(e.target) : e.type !== "selection" : !0;
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
function _h(e) {
	return new Bm({
		find: e.find,
		handler: ({ state: t, range: n, match: r, pasteEvent: i }) => {
			let a = q(e.getAttributes, void 0, r, i);
			if (a === !1 || a === null) return null;
			let { tr: o } = t, s = r[r.length - 1], c = r[0], l = n.to;
			if (s) {
				let i = c.search(/\S/), u = n.from + c.indexOf(s), d = u + s.length;
				if (qf(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > u).length) return null;
				d < n.to && o.delete(d, n.to), u > n.from && o.delete(n.from + i, u), l = n.from + i + s.length, o.addMark(n.from + i, l, e.type.create(a || {})), r.index !== void 0 && r.input !== void 0 && r.index + r[0].length >= r.input.length || o.removeStoredMark(e.type);
			}
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/editorDocumentUtils.ts
function vh(e) {
	if (e.childCount === 1) {
		let t = e.firstChild;
		return t?.type.name === "paragraph" && t.content.size === 0;
	}
	return e.childCount === 0;
}
function yh(e) {
	return vh(e.doc);
}
function bh(e, t) {
	return e.type.name === "paragraph" && e.content.size === t && e.textContent.trim().length === t;
}
var xh = /:([A-Za-z0-9_-]{1,64}):/g;
function Sh(e, t) {
	typeof e.forEach == "function" && e.forEach((e) => t(e));
}
function Ch(e) {
	if (typeof e != "string" || !e) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function wh(e) {
	let t = yt(e?.shortcode), n = e?.src;
	if (!t || !Ch(n)) return null;
	let r = typeof e?.setAddress == "string" ? e.setAddress.trim() : "";
	return {
		identityKey: typeof e?.identityKey == "string" && e.identityKey ? e.identityKey : _t({
			shortcodeLower: ht(t),
			src: n,
			setAddress: r || null
		}),
		shortcode: t,
		shortcodeLower: ht(t),
		src: n,
		setAddress: r
	};
}
function Th(e) {
	let t = wh(e);
	if (t) return {
		type: "customEmoji",
		emoji: t
	};
	let n = yt(e?.shortcode);
	return {
		type: "text",
		text: n ? `:${n}:` : ""
	};
}
function Eh(e) {
	let t = [];
	return Sh(e, (e) => {
		e.isText ? t.push({
			type: "text",
			text: e.text ?? ""
		}) : e.type.name === "customEmoji" ? t.push(Th(e.attrs)) : e.type.name === "profileMention" ? t.push({
			type: "mention",
			uri: e.attrs.uri
		}) : t.push({
			type: "text",
			text: e.textContent ?? ""
		});
	}), t;
}
function Dh(e, t) {
	for (let n of e.matchAll(xh)) {
		let e = ht(n[1]);
		e && t.add(e);
	}
}
function Oh(e) {
	let t = /* @__PURE__ */ new Set(), n = [], r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
	for (let a of e) if (a.type === "media") Dh(a.text, t);
	else for (let e of a.parts) {
		if (e.type === "mention") continue;
		if (e.type === "text") {
			Dh(e.text, t);
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
function kh(e) {
	let t = ht(e.alias);
	if (!t || e.usedAliasShortcodes.has(t) || e.reservedTextShortcodes.has(t)) return !1;
	if (!e.isOriginalShortcode) {
		let n = e.originalOwners.get(t);
		if (n && !(n.size === 1 && n.has(e.emoji.identityKey))) return !1;
	}
	return !0;
}
function Ah(e) {
	let { reservedTextShortcodes: t, emojiOrder: n, originalOwners: r } = Oh(e), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
	for (let e of n) {
		if (kh({
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
			let o = `${e.shortcode}_${n}`, s = ht(o);
			if (kh({
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
function jh(e) {
	let t = Ah(e), n = [], r = /* @__PURE__ */ new Set();
	return {
		content: e.map((e) => {
			if (e.type === "media") return e.text;
			let i = "";
			for (let [a, o] of e.parts.entries()) {
				if (o.type === "text") {
					i += o.text;
					continue;
				}
				if (o.type === "mention") {
					let t = e.parts[a + 1];
					i += ut(o.uri, i, t?.type === "text" ? t.text : "");
					continue;
				}
				let s = t.get(o.emoji.identityKey) ?? o.emoji.shortcode;
				if (i += `:${s}:`, !r.has(o.emoji.identityKey)) {
					r.add(o.emoji.identityKey);
					let e = [
						"emoji",
						s,
						o.emoji.src
					];
					o.emoji.setAddress && e.push(o.emoji.setAddress), n.push(e);
				}
			}
			return i;
		}).join("\n"),
		emojiTags: n
	};
}
function Mh(e) {
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
			parts: [Th(e.attrs)]
		});
	}), jh(t)) : (Sh(e, (e) => {
		if (e.type.name === "paragraph") t.push({
			type: "inline",
			parts: Eh(e)
		});
		else if (e.type.name === "image" || e.type.name === "video") {
			let n = e.attrs?.src;
			n && t.push({
				type: "media",
				text: n
			});
		} else e.type.name === "customEmoji" && t.push({
			type: "inline",
			parts: [Th(e.attrs)]
		});
	}), jh(t));
}
function Nh(e) {
	if (!e) return null;
	try {
		return e.state?.doc ?? e.view?.state?.doc ?? null;
	} catch {
		return null;
	}
}
function Ph(e) {
	let t = Nh(e);
	return t ? Mh(t).content : "";
}
function Fh(e) {
	let t = Nh(e);
	return t ? Mh(t) : {
		content: "",
		emojiTags: []
	};
}
var Ih = /* @__PURE__ */ new WeakMap();
function Lh(e) {
	let t = !1;
	return e.descendants((e) => {
		if (t) return !1;
		if (e.type.name === "image" || e.type.name === "video") return t = !0, !1;
	}), t;
}
function Rh(e) {
	let t = Ih.get(e);
	if (t !== void 0) return t;
	let n = Lh(e) || !!Mh(e).content.trim();
	return Ih.set(e, n), n;
}
function zh(e, t) {
	return !e || e.isDestroyed ? t : t ? !0 : Rh(e.state.doc);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/tags/hashtagManager.ts
function Bh(e) {
	let t = [], n = ke.source;
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
function Vh(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	ke.lastIndex = 0;
	let r;
	for (; (r = ke.exec(e)) !== null;) {
		let e = r[1];
		e && e.trim() && (n.has(e) || (n.add(e), t.push(e)));
	}
	return t;
}
function Hh(e) {
	let t = Bh(e), n = [], r = /* @__PURE__ */ new Set();
	for (let e of t) r.has(e.hashtag) || (r.add(e.hashtag), n.push(e.hashtag));
	return n;
}
function Uh(e) {
	let t, n;
	typeof e == "string" ? (n = e, t = Vh(n)) : (t = Hh(e), n = e.textContent);
	let r = t.map((e) => ["t", e.toLowerCase()]);
	return {
		content: n,
		hashtags: t,
		tags: r
	};
}
function Wh(e, t) {
	e.content = t.content, e.hashtags = t.hashtags, e.tags = t.tags;
}
function Gh(e) {
	Wh(Le, Uh(e));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/contentTracking.ts
var Kh = "content-tracking-normalized";
function qh(e) {
	let t = Bh(e).map(({ from: e, to: t }) => ml.inline(e, t, { class: Ne.HASHTAG_CLASS }));
	return U.create(e, t);
}
function Jh(e) {
	return Bh(e.node).map(({ from: t, to: n }) => ml.inline(e.pos + 1 + t, e.pos + 1 + n, { class: Ne.HASHTAG_CLASS }));
}
function Yh(e, t) {
	return Math.max(0, Math.min(t, e.content.size));
}
function Xh(e, t) {
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
function Zh(e, t, n) {
	let r = e.resolve(Yh(e, t));
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
function Qh(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = Yh(e, Math.min(t, n)), a = Yh(e, Math.max(t, n));
	return Zh(e, i, r), Zh(e, a, r), e.nodesBetween(i, a, (e, t) => {
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
function $h(e, t, n, r, i) {
	let a = [], o = "", s = !1;
	if (e.node.forEach((n, i) => {
		if (!n.isText || !n.text) {
			o += " ".repeat(n.nodeSize);
			return;
		}
		let c = e.pos + 1 + i, l = c + n.nodeSize;
		r && n.marks.find((e) => e.type === t) && (s = !0, a.push({
			type: "removeMark",
			from: c,
			to: l
		})), o += n.text;
	}), !o || !(o.includes("http://") || o.includes("https://")) && !s) return a;
	for (let s of qe(o)) {
		let c = s.start, l = c > 0 ? o[c - 1] : void 0;
		if (!Ge(l)) continue;
		let u = s.displayText, d = s.end, f = e.pos + 1 + c, p = e.pos + 1 + d;
		if (i) {
			let e = Ke(u);
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
function eg(e, t, n, r, i, a) {
	let o = t.doc.resolve(i), s = o.parent, c = s.type.name === "paragraph" && s.textContent.trim().length === 0, l = bh(s, a - i), u = yh(t), d = n.create({
		src: r,
		alt: "Image"
	});
	if (c || l) {
		let n = o.depth, r = o.start(n), i = o.end(n);
		return u || t.doc.childCount === 1 && l ? e.delete(0, t.doc.content.size).insert(0, d) : e.replaceWith(r, i, d);
	}
	return e.replaceWith(i, a, d);
}
function tg(e, t, n, r) {
	let i = e.schema.marks.link, a = e.schema.nodes.image;
	if (!i) return null;
	let o = e.tr, s = !1, c = [];
	for (let e of r) c.push(...$h(e, i, a, t, n));
	c.sort((e, t) => t.from - e.from);
	for (let t of c) t.type === "removeMark" ? (o = o.removeMark(t.from, t.to, i), s = !0) : t.type === "addMark" && t.mark ? (o = o.addMark(t.from, t.to, t.mark), s = !0) : t.type === "replaceImage" && t.imageUrl && (Ie.value ? o = eg(o, e, a, t.imageUrl, t.from, t.to) : (Pe.addItem({
		id: Me(),
		type: "image",
		src: t.imageUrl,
		isPlaceholder: !1
	}), o = o.delete(t.from, t.to)), s = !0);
	return s && o.docChanged ? o : null;
}
var ng = Y.create({
	name: "contentTracking",
	addOptions() {
		return {
			debounceDelay: Ne.DEBOUNCE_DELAY,
			enableHashtags: Ne.ENABLE_HASHTAGS,
			enableAutoLink: Ne.ENABLE_AUTO_LINK,
			enableImageConversion: Ne.ENABLE_IMAGE_CONVERSION
		};
	},
	addStorage() {
		return { updateTimeout: null };
	},
	addProseMirrorPlugins() {
		let e = this.storage, t = this.options;
		return [
			...t.enableHashtags ? [new L({
				key: new R(Ne.PLUGIN_KEYS.HASHTAG_DECORATION),
				state: {
					init: (e, { doc: t }) => qh(t),
					apply(e, t, n, r) {
						if (!e.docChanged) return t.map(e.mapping, e.doc);
						let i = Xh(n.doc, r.doc);
						if (!i) return t.map(e.mapping, e.doc);
						let a = Qh(e.doc, i.from, i.to), o = t.map(e.mapping, e.doc);
						if (a.length === 0) return o;
						let s = a.flatMap((e) => o.find(e.from, e.to));
						s.length > 0 && (o = o.remove(s));
						let c = a.flatMap(Jh);
						return c.length > 0 ? o.add(e.doc, c) : o;
					}
				},
				props: { decorations(e) {
					return this.getState(e);
				} }
			})] : [],
			...t.enableAutoLink || t.enableImageConversion ? [new L({
				key: new R(Ne.PLUGIN_KEYS.LINK_AND_IMAGE_CONVERSION),
				appendTransaction: (e, n, r) => {
					if (!e.some((e) => e.docChanged) || e.some((e) => e.getMeta(Kh))) return null;
					let i = Xh(n.doc, r.doc);
					if (!i) return null;
					let a = Qh(r.doc, i.from, i.to);
					if (a.length === 0) return null;
					let o = !e.some((e) => e.getMeta("paste")), s = tg(r, t.enableAutoLink ?? !0, o && !t.isMediaConversionDisabled?.() && (t.enableImageConversion ?? !0), a);
					return s && (s.setMeta("addToHistory", !1), s.setMeta(Kh, !0)), s;
				}
			})] : [],
			new L({
				key: new R(Ne.PLUGIN_KEYS.CONTENT_UPDATE_TRACKER),
				state: {
					init: () => null,
					apply(n) {
						return n.docChanged && (e.updateTimeout && clearTimeout(e.updateTimeout), e.updateTimeout = setTimeout(() => {
							Gh(n.doc), window.dispatchEvent(new CustomEvent("editor-content-changed", { detail: { plainText: Mh(n.doc).content } }));
						}, t.debounceDelay ?? Ne.DEBOUNCE_DELAY)), null;
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
function rg(e) {
	return e.split(/[\n ]+/).map((e) => e.trim()).filter(Boolean).map((e) => {
		let t = Ke(e);
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
function ig(e) {
	return e.type.name === "paragraph" && e.textContent.trim().length === 0 && e.children.every((e) => e.isText || e.type.name === "hardBreak");
}
function ag(e) {
	let { selection: t } = e, n = e.doc.resolve(t.from);
	if (ig(n.parent)) {
		let e = n.depth;
		return {
			start: n.start(e),
			end: n.end(e)
		};
	}
	return null;
}
function og(e, t) {
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
function sg(e) {
	let t = e.doc;
	if (!t) return e;
	let n = [];
	return t.descendants((e, r) => {
		ig(e) && (t.childCount !== 1 || t.firstChild !== e) && n.push([r, r + e.nodeSize]);
	}), n.sort((e, t) => t[0] - e[0]), n.forEach(([t, n]) => {
		e = e.delete(t, n);
	}), e;
}
function cg(e) {
	let t = e.trim().split(/\s+/u).map((e) => Ke(e) ? e : null);
	return t.length && t.every((e) => e !== null) ? t : null;
}
var lg = Y.create({
	name: "mediaPaste",
	addOptions: () => ({ isMediaConversionDisabled: () => !1 }),
	addProseMirrorPlugins() {
		return [new L({
			key: new R("image-paste"),
			props: {
				handlePaste: (e, t) => {
					if (this.options.isMediaConversionDisabled?.()) {
						if (e.editable === !1) return !0;
						if (t.clipboardData?.files.length || Array.from(t.clipboardData?.items ?? []).some((e) => e.kind === "file")) return !1;
						let n = cg(t.clipboardData?.getData("text/plain") ?? "");
						return !n || !this.options.onReactionImageUrls ? !1 : (t.preventDefault(), this.options.onReactionImageUrls(n), !0);
					}
					if (e.editable === !1) return t.preventDefault(), !0;
					if (He(t.clipboardData).length > 0) return !1;
					let n = rg(t.clipboardData?.getData("text/plain") || "");
					if (n.length > 0) {
						if (t.preventDefault(), !Ie.value) return n.forEach((e) => {
							Pe.addItem({
								id: Me(),
								type: e.type,
								src: e.url,
								isPlaceholder: !1
							});
						}), !0;
						let { state: r, dispatch: i } = e, { tr: a, selection: o, schema: s } = r, c = og(n, s), l = a, u = ag(r);
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
						return l = sg(l), i(l), !0;
					}
					return !1;
				},
				handleTextInput: (e, t, n, r) => {
					if (this.options.isMediaConversionDisabled?.()) {
						if (e.editable === !1) return !0;
						let t = cg(r);
						return !t || !this.options.onReactionImageUrls ? !1 : (this.options.onReactionImageUrls(t), !0);
					}
					if (e.editable === !1) return !0;
					if (r.includes("\n") || r.length > 20) {
						let i = rg(r);
						if (i.length > 0) {
							let { state: r, dispatch: a } = e, { tr: o, schema: s } = r;
							if (!Ie.value) return i.forEach((e) => {
								Pe.addItem({
									id: Me(),
									type: e.type,
									src: e.url,
									isPlaceholder: !1
								});
							}), a(o.delete(t, n)), !0;
							let c = og(i, s), l = o;
							l = l.delete(t, n);
							let u = t;
							return c.forEach((e) => {
								l = l.insert(u, e), u += e.nodeSize;
							}), l = sg(l), a(l), !0;
						}
					}
					return !1;
				}
			}
		})];
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/editorNodeActions.ts
function ug(e, t, n) {
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
function dg(e, t, n) {
	return n.insertPos < n.deleteStart ? e.insert(n.insertPos, t).delete(n.deleteStart, n.deleteEnd) : e.delete(n.deleteStart, n.deleteEnd).insert(n.insertPos, t);
}
function fg(e, t, n) {
	let { tr: r, doc: i, schema: a } = e.state, o = t.pos, s = ug(n, o, i);
	if (!s) return !0;
	let c = a.nodes.image.create(t.attrs);
	try {
		let t = dg(r, c, s);
		return e.dispatch(t), !0;
	} catch (e) {
		return console.error("Error moving image:", e), !1;
	}
}
function pg(e, t) {
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
function mg(e, t, n) {
	if (typeof n != "number") return !1;
	let r = e.nodeAt(n);
	return r?.type.name === "customEmoji" && t >= n && t <= n + r.nodeSize;
}
function hg(e, t, n) {
	if (mg(e, t, n)) return n ?? null;
	let r = pg(e, n);
	return r.length === 0 ? null : r.reduce((e, n) => {
		let r = Math.abs(e - t);
		return Math.abs(n - t) < r ? n : e;
	}, r[0]);
}
function gg(e, t, n) {
	let { tr: r, doc: i, schema: a } = e.state, o = t.pos, s = i.nodeAt(o);
	if (s?.type.name !== "customEmoji") return !1;
	if (n === o || n === o + s.nodeSize || !pg(i, o).includes(n)) return !0;
	let c = a.nodes.customEmoji.create({
		...s.attrs,
		...t.attrs
	});
	try {
		let t = n < o ? n : n - s.nodeSize, i = n < o ? r.insert(t, c).delete(o + c.nodeSize, o + c.nodeSize + s.nodeSize) : r.delete(o, o + s.nodeSize).insert(t, c);
		return i.setSelection(I.create(i.doc, t)), e.dispatch(i.scrollIntoView()), !0;
	} catch (e) {
		return console.error("Error moving custom emoji:", e), !1;
	}
}
function _g(e) {
	e.dispatch(e.state.tr.setMeta("imageDrag", {
		isDragging: !1,
		draggedNodePos: null
	}));
}
function vg(e, t, n) {
	e && e.state.doc.descendants((e, r) => {
		if (t(e, r)) return n(e, r), !1;
	});
}
function yg(e, t, n, r) {
	e.update((e) => {
		let i = { ...e };
		return t && delete i[t], n && r && (i[n] = r), i;
	});
}
function bg(e, t, n, r, i = !1) {
	n && (yg(r, e), vg(n, (n) => {
		let r = n.type?.name;
		return (t && r === "video" || !t && r === "image") && (n.attrs?.src === e || n.attrs?.id === e);
	}, (t, r) => {
		let a = n.state.tr.delete(r, r + t.nodeSize);
		n.view.dispatch(a), i && console.log("[uploadHelper] Deleted placeholder:", e);
	}));
}
function xg(e, t = !1) {
	if (!e) return;
	let { state: n } = e, { doc: r } = n, i = n.tr, a = 0, o = [];
	r.descendants((e, t) => {
		let n = e.type?.name, r = At(e.attrs);
		(n === "image" || n === "video") && r && o.push({
			pos: t,
			size: e.nodeSize
		});
	}), o.reverse().forEach(({ pos: e, size: t }) => {
		i.delete(e, e + t), a++;
	}), a > 0 && (e.view.dispatch(i), t && console.log(`[editorNodeActions] Deleted ${a} placeholder(s)`));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/imageDragDrop.ts
var Sg = Y.create({
	name: "imageDragDrop",
	addProseMirrorPlugins() {
		let e = new R("image-drag-drop"), t = new R("drop-zone-indicator");
		return [new L({
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
							if (r && typeof n.pos == "number") return _g(e), fg(e, n, r.pos), !0;
						}
					} catch (e) {
						console.warn("Failed to parse drag data:", e);
					}
					let a = t.dataTransfer;
					return !!(!r && a && a.files && a.files.length > 0 && !i);
				},
				handleDOMEvents: {
					dragstart: (e, t) => e.editable === !1 || bt() ? (t.preventDefault(), !0) : !1,
					dragover: (e, t) => e.editable === !1 || bt() ? (t.preventDefault(), !0) : !1,
					drop: (e, t) => e.editable === !1 || bt() ? (t.preventDefault(), !0) : !1
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
						})?.pos || n.pos, typeof n.pos == "number" && fg(t, n, e);
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
		}), new L({
			key: t,
			state: {
				init() {
					return U.empty;
				},
				apply(t, n, r, i) {
					if (!bt()) return U.empty;
					let a = e.getState(i);
					if (!a?.isDragging) return U.empty;
					let o = [], s = i.doc, c = !1;
					if (typeof a.draggedNodePos == "number") {
						let e = s.firstChild;
						e && e.type.name === "image" && e.attrs && a.draggedNodePos === 0 && (c = !0);
					}
					return c || o.push(ml.widget(0, () => {
						let e = document.createElement("div");
						e.className = "drop-zone-indicator drop-zone-top", e.setAttribute("data-drop-pos", "0");
						let t = document.createElement("div");
						return t.className = "drop-zone-bar", e.appendChild(t), e;
					}, { side: -1 })), s.descendants((e, t) => {
						if (e.type.name === "paragraph" || e.type.name === "image") {
							let n = t + e.nodeSize;
							if (typeof a.draggedNodePos == "number" && n === a.draggedNodePos) return;
							a.draggedNodePos !== t && o.push(ml.widget(n, () => {
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
		return { moveImageNode: (e, t, n) => (_g(e), fg(e, t, n)) };
	}
}), Cg = Y.create({
	name: "smartBackspace",
	addProseMirrorPlugins() {
		return [new L({
			key: new R("smart-backspace"),
			props: { handleKeyDown(e, t) {
				if (t.key !== "Backspace" || bt() && document.activeElement !== e.dom) return !1;
				let { state: n } = e, { selection: r, doc: i } = n;
				if (r.empty && r.from === 1) {
					let t = i.firstChild, r = i.childCount > 1 ? i.child(1) : null;
					if (t && t.type.name === "paragraph" && t.content.size === 0 && r && r.type.name === "image") return e.dispatch(n.tr.delete(0, t.nodeSize)), !0;
				}
				return !1;
			} }
		})];
	}
}), wg = class extends ch {
	contentElement = null;
}, Tg = (e) => {
	let t = new wg(e);
	return he(t, (e) => (t.on("transaction", () => {
		e(t);
	}), () => {
		t.destroy();
	}));
}, Eg = class {
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
		v(this.component);
	}
}, Dg = "TipTapNodeView", Og = (e, t) => {
	if (!e) throw Error(t);
}, kg = class extends gh {
	mount() {
		let e = this.component, t = D({
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
		let n = new Ce(this.options.context);
		n.set(Dg, { onDragStart: this.onDragStart.bind(this) });
		let r = this.options.as ?? (this.node.isInline ? "span" : "div"), i = document.createElement(r);
		i.classList.add(`node-${this.node.type.name}`), this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate);
		let a = y(e, {
			target: i,
			props: t,
			context: n
		});
		this.renderer = new Eg(a, {
			element: i,
			props: t
		}), this.appendContendDom(), this.updateElementAttributes();
	}
	appendContendDom() {
		let e = this.dom.querySelector("[data-node-view-content]");
		this.contentDOMElement && e && !e.contains(this.contentDOMElement) && e.appendChild(this.contentDOMElement);
	}
	get dom() {
		return Og(this.renderer.dom.firstElementChild?.hasAttribute("data-node-view-wrapper"), "Please use the NodeViewWrapper component for your node view."), this.renderer.dom;
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
				let t = this.editor.extensionManager.attributes, n = Af(this.node, t);
				e = this.options.attrs({
					node: this.node,
					HTMLAttributes: n
				});
			} else e = this.options.attrs;
			this.renderer.updateAttributes(e);
		}
	}
}, Ag = (e, t) => (n) => new kg(e, n, t), jg = le("<div></div> <!>", 1);
function Mg(e, c) {
	r(c, !0);
	let u = ue(c, "editor", 7), d;
	oe(async () => {
		await ne(), d && u()?.options.element && (u().contentElement || (d.append(...Array.from(u().options.element?.childNodes || [])), u().setOptions({ element: d }), u().contentElement = d));
	}), pe(() => {
		if (!u() || (u().contentElement = null, !u().options.element?.firstChild)) return;
		let e = document.createElement("div");
		e.append(...Array.from(u().options.element?.childNodes || [])), u().setOptions({ element: e });
	});
	var f = jg(), p = E(f);
	T(p, (e) => d = e, () => d);
	var m = ae(p, 2), h = (e) => {
		var t = l(), n = E(t);
		o(n, () => c.children), s(e, t);
	};
	t(m, (e) => {
		c.children && e(h);
	}), w(() => i(p, 1, n(c.class))), s(e, f), a();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/svelte-tiptap/dist/NodeViewWrapper.svelte
var Ng = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"as",
	"children"
]);
function Pg(e, n) {
	r(n, !0);
	let i = ue(n, "as", 3, "div"), c = te(n, Ng), { onDragStart: u } = _e(Dg), f;
	oe(async () => {
		await ne(), f && (f.style.whiteSpace = "normal");
	});
	var p = l(), m = E(p);
	d(m, i, !1, (e, r) => {
		T(e, (e) => f = e, () => f), ge(e, () => ({
			"data-node-view-wrapper": "",
			role: "none",
			...c,
			ondragstart: u
		}));
		var i = l(), a = E(i), d = (e) => {
			var t = l(), r = E(t);
			o(r, () => n.children), s(e, t);
		};
		t(a, (e) => {
			n.children && e(d);
		}), s(r, i);
	}), s(e, p), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/MediaActionButtons.svelte
var Fg = le("<div class=\"copy-icon svg-icon\"></div>"), Ig = le("<div class=\"close-icon svg-icon\"></div>"), Lg = le("<!> <!>", 1), Rg = {
	hash: "svelte-7oer9x",
	code: "button.media-delete-btn.circle.close {position:absolute;inset:6px 6px auto auto;z-index:10;width:50px;height:50px;}button.media-copy-btn.circle.copy {position:absolute;inset:62px 6px auto auto;z-index:10;width:50px;height:50px;}"
};
function zg(e, t) {
	r(t, !0), re(e, Rg);
	let n = ue(t, "deleteDisabled", 3, !1), i = ue(t, "layout", 3, "editor-image");
	async function o(e) {
		return e.stopPropagation(), Re(t.src, "URL", navigator, window);
	}
	function c(e) {
		e.stopPropagation(), !n() && t.onDelete();
	}
	var l = Lg(), u = E(l);
	Je(u, {
		variant: "copy",
		shape: "circle",
		get className() {
			return `media-copy-btn media-copy-btn--${i() ?? ""}`;
		},
		get ariaLabel() {
			return t.copyAriaLabel;
		},
		onClick: o,
		get floatingMessage() {
			return t.copySuccessMessage;
		},
		children: (e, t) => {
			var n = Fg();
			s(e, n);
		},
		$$slots: { default: !0 }
	});
	var d = ae(u, 2);
	Je(d, {
		variant: "close",
		shape: "circle",
		get className() {
			return `media-delete-btn media-delete-btn--${i() ?? ""}`;
		},
		get ariaLabel() {
			return t.deleteAriaLabel;
		},
		get disabled() {
			return n();
		},
		onClick: c,
		children: (e, t) => {
			var n = Ig();
			s(e, n);
		},
		$$slots: { default: !0 }
	}), s(e, l), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useMediaLoadState.svelte.ts
function Bg() {
	let e = ve(!1);
	function t() {
		x(e, !0);
	}
	function n() {
		x(e, !1);
	}
	return {
		get isLoaded() {
			return O(e);
		},
		handleLoad: t,
		handleError: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useLongPress.svelte.ts
function Vg(e, t) {
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
		Dt(t.clientX, t.clientY, a.x, a.y, r) && o();
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
var Hg = le("<video controls=\"\" playsinline=\"\" autoplay=\"\" loop=\"\" preload=\"metadata\"><track kind=\"captions\"/> </video>", 2), Ug = le("<div class=\"video-node-container svelte-s4lxcs\"><div class=\"video-wrapper svelte-s4lxcs\" data-video-node=\"\" role=\"button\" tabindex=\"0\"><!></div> <!></div>"), Wg = {
	hash: "svelte-s4lxcs",
	code: ".node-video {margin:12px 0;}.node-video[data-node-view-wrapper] {display:block;margin:0;}\n\n    /* 動画ノードコンテナ */.video-node-container.svelte-s4lxcs {position:relative;display:inline-block;width:100%;max-width:100%;}.video-wrapper.svelte-s4lxcs {display:flex;justify-content:center;align-items:center;width:100%;max-width:100%;min-height:150px;max-height:380px;position:relative;border-radius:6px;overflow:hidden;aspect-ratio:16 / 9;cursor:pointer;&:active {scale:1;}}.node-video.is-node-focused .video-wrapper {outline:2px solid var(--theme);}.node-video.is-node-focused span.placeholder-text.loading-text {font-size:1.125rem;}.editor-video.svelte-s4lxcs {max-width:100%;max-height:380px;width:100%;height:100%;object-fit:contain;display:block;opacity:0;transition:opacity 0.3s ease;pointer-events:auto;cursor:pointer;}.editor-video.loaded.svelte-s4lxcs {opacity:1;}.video-wrapper.svelte-s4lxcs {background-color:light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));}"
};
function Gg(n, o) {
	r(o, !0), re(n, Wg);
	let l = () => de(we, "$_", u), [u, d] = se(), p = ve(void 0), m = ve(void 0), _ = Bg(), v = g(() => At(o.node.attrs)), y = g(() => o.node.attrs.id || (typeof o.getPos == "function" ? (o.getPos() ?? "unknown").toString() : "unknown")), b = g(() => l()("videoNode.select"));
	function S() {
		let e = document;
		return !!(e.fullscreenElement || e.webkitFullscreenElement || e.mozFullScreenElement || e.msFullscreenElement);
	}
	Vg(() => O(p), {
		onTap: (e) => {
			if (O(v) || S()) return;
			let t = e.changedTouches[0];
			if (O(p)) {
				let e = O(p).getBoundingClientRect();
				if (t.clientY > e.bottom - 48) return;
			}
			e.stopPropagation(), Mt(o.getPos);
		},
		delay: 200,
		moveThreshold: 10
	});
	function E(e) {
		O(v) || S() || e.target !== O(p) && (e.stopPropagation(), e.preventDefault(), Mt(o.getPos));
	}
	function D(e) {
		if (!O(v) && !S() && e.button !== 2) {
			if (O(p)) {
				let t = O(p).getBoundingClientRect();
				if (e.clientY > t.bottom - 48) return;
			}
			e.stopPropagation(), Mt(o.getPos);
		}
	}
	function te(e) {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), Mt(o.getPos));
	}
	Pg(n, {
		children: (n, r) => {
			var a = Ug(), u = ee(a), d = ee(u), S = (e) => {
				{
					let t = g(() => l()("videoNode.uploading"));
					Te(e, {
						get text() {
							return O(t);
						},
						showLoader: !0
					});
				}
			}, ne = (t) => {
				var n = Hg();
				n.muted = !0;
				let r;
				var a = ae(ee(n));
				f(n), T(n, (e) => x(p, e), () => O(p)), w((e) => {
					C(n, "src", o.node.attrs.src), r = i(n, 1, "editor-video svelte-s4lxcs", null, r, { loaded: _.isLoaded }), C(n, "data-node-id", O(y)), c(a, ` ${e ?? ""}`);
				}, [() => l()("videoNode.not_supported")]), e("loadeddata", n, function(...e) {
					_.handleLoad?.apply(this, e);
				}), e("error", n, function(...e) {
					_.handleError?.apply(this, e);
				}), h("click", n, D), s(t, n);
			};
			t(d, (e) => {
				O(v) ? e(S) : e(ne, -1);
			}), f(u), T(u, (e) => x(m, e), () => O(m));
			var re = ae(u, 2), ie = (e) => {
				{
					let t = g(() => l()("videoContextMenu.delete")), n = g(() => l()("videoContextMenu.copyUrl")), r = g(() => l()("videoContextMenu.copySuccess"));
					zg(e, {
						get src() {
							return o.node.attrs.src;
						},
						get onDelete() {
							return o.deleteNode;
						},
						get deleteAriaLabel() {
							return O(t);
						},
						get copyAriaLabel() {
							return O(n);
						},
						get copySuccessMessage() {
							return O(r);
						},
						layout: "editor-video"
					});
				}
			};
			t(re, (e) => {
				O(v) || e(ie);
			}), f(a), w(() => C(u, "aria-label", O(b))), h("click", u, E), h("keydown", u, te), s(n, a);
		},
		$$slots: { default: !0 }
	}), a(), d();
}
b(["click", "keydown"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/videoExtension.ts
var Kg = hh.create({
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
		return Ag(Gg);
	}
}), qg = "image/avif";
function Jg(e) {
	return (!e.type || e.type === "application/octet-stream") && /\.avif$/i.test(e.name);
}
function Yg(e, t) {
	let n = e.getUint32(t);
	return n === 1635150182 || n === 1635150195;
}
async function Xg(e, t) {
	xe(t);
	let n = new DataView(await Se(e.slice(0, 24).arrayBuffer(), t));
	if (n.byteLength < 16 || n.getUint32(4) !== 1718909296) return !1;
	let r = n.getUint32(0), i = r === 1;
	if (i && n.byteLength < 24) return !1;
	let a = i ? 16 : 8, o = i ? Number(n.getBigUint64(8)) : r, s = a + 8;
	if (!Number.isSafeInteger(o) || o < s || o > e.size || o % 4 != 0) return !1;
	if (Yg(n, a)) return !0;
	let c = Math.min(o, 4096);
	if (c > s) {
		xe(t);
		let n = new DataView(await Se(e.slice(s, c).arrayBuffer(), t));
		for (let e = 0; e < n.byteLength; e += 4) if (Yg(n, e)) return !0;
	}
	return !1;
}
async function Zg(e, t) {
	return !Jg(e) || !await Xg(e, t) ? e : new File([e], e.name, {
		type: qg,
		lastModified: e.lastModified
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/clipboardTextCleanup.ts
function Qg(e) {
	let t = [], n = !1;
	for (let r of e) /^\s*```[^`]*$/.test(r) ? n = !n : t.push(n ? r : $g(r));
	return t;
}
function $g(e) {
	let t = e.replace(/^([ \t]*)#{1,6}[ \t]+/, "$1"), n = "", r = 0;
	for (; r < t.length;) {
		let e = e_(t, r);
		if (e < 0) {
			n += t_(t.slice(r));
			break;
		}
		let i = e_(t, e + 1);
		if (i < 0) {
			n += t_(t.slice(r));
			break;
		}
		n += t_(t.slice(r, e)), n += t.slice(e + 1, i), r = i + 1;
	}
	return n;
}
function e_(e, t) {
	for (let n = t; n < e.length; n += 1) {
		if (e[n] !== "`") continue;
		let t = n + 1;
		for (; e[t] === "`";) t += 1;
		if (t - n === 1) return n;
		n = t - 1;
	}
	return -1;
}
function t_(e) {
	let t = qe(e);
	if (t.length === 0) return n_(e);
	let n = "", r = 0;
	for (let i of t) i.start < r || (n += n_(e.slice(r, i.start)), n += e.slice(i.start, i.end), r = i.end);
	return n + n_(e.slice(r));
}
function n_(e) {
	return e.replace(/\*\*|__|~~/g, "");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/clipboardExtension.ts
function r_(e, t) {
	return e.map((e) => {
		let n = e.length > 0 ? [t.text(e)] : [];
		return t.nodes.paragraph.create(null, n);
	});
}
function i_(e) {
	let t = [];
	return e.content.forEach((e) => {
		if (e.type.name === "paragraph") {
			let n = "";
			e.content.forEach((t, r, i) => {
				if (t.isText) n += t.text || "";
				else if (t.type.name === "customEmoji") {
					let e = yt(t.attrs?.shortcode);
					e && (n += `:${e}:`);
				} else t.type.name === "profileMention" && (n += ut(t.attrs.uri, n, e.maybeChild(i + 1)?.text ?? ""));
			}), t.push(n);
		} else if (e.type.name === "image" || e.type.name === "video") {
			let n = e.attrs?.src;
			n && t.push(n);
		} else e.isTextblock && t.push(e.textContent);
	}), t;
}
function a_(e) {
	return new DOMParser().parseFromString(e, "text/html").querySelector("p.editor-paragraph[data-pm-slice]") !== null;
}
function o_(e, t) {
	try {
		let n = new URL(e, t);
		return Ue(n.protocol) ? n.href : void 0;
	} catch {
		return;
	}
}
function s_(e, t, n) {
	if (!e || !t) return e;
	let r = n.createElement("template");
	r.innerHTML = t;
	let i = r.content.querySelector("base[href]")?.getAttribute("href"), a = i ? o_(i) : void 0, o = /* @__PURE__ */ new Set();
	for (let e of r.content.querySelectorAll("img[src]")) {
		let t = e.getAttribute("src")?.trim();
		if (!t) continue;
		o.add(t);
		let n = o_(t, a);
		n && o.add(n);
	}
	return o.size ? e.split(/\r\n?|\n/).flatMap((e) => {
		let t = e.replace(/\S+[ \t]*/g, (e) => {
			let t = e.trimEnd();
			if (o.has(t)) return "";
			let n = /^https?:\/\//i.test(t) ? o_(t) : void 0;
			return n && o.has(n) ? "" : e;
		});
		return t === e ? [e] : t.trim() ? [t.trimEnd()] : [];
	}).join("\n") : e;
}
function c_(e) {
	let t = [];
	return e.content.forEach((e) => {
		e.type.name !== "image" && t.push(e);
	}), t.length === e.content.childCount ? e : M.maxOpen(A.from(t), !1);
}
var l_ = Y.create({
	name: "clipboardExtension",
	addProseMirrorPlugins() {
		let e = !1;
		return [new L({
			key: new R("clipboardExtension"),
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
					if (!o) return !1;
					let s = He(o);
					if (s.some((e) => !e.type.startsWith("image/") && !Jg(e))) return n.preventDefault(), !0;
					let c = s.length > 0, l = o.types.includes("text/html"), u = l ? o.getData("text/html") : "", d = o.getData("text/plain"), f = c ? s_(d, u, t.dom.ownerDocument) : d, p = !1, m = !1;
					if (l) {
						let e = a_(u), t = u.includes("data-block=\"true\"") && u.includes("data-editor=");
						m = e || t, p = e || t;
					}
					let h = We(f, {
						collapseEmptyLines: p,
						maxConsecutiveEmptyLines: 1
					}).lines;
					l && !e && !m && (h = Qg(h));
					let g;
					if (c && !h.some((e) => e.trim())) {
						if (!l || e || (g = c_(r), g.size === 0)) return !0;
					} else {
						if (h.length === 0) return !1;
						g = new M(A.from(r_(h, i.schema)), 1, 1);
					}
					return a(i.tr.replaceSelection(g).setMeta("paste", !0).setMeta("uiEvent", "paste").setMeta("addToHistory", !0)), !0;
				},
				clipboardTextSerializer(e) {
					let t = i_(e);
					return Ve(t);
				}
			}
		})];
	}
}), u_ = typeof navigator < "u" && /android/i.test(navigator.userAgent), d_ = 4e3, f_ = Y.create({
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
		if (!u_) return;
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
			}, d_);
		}, r = () => {
			t.isComposing = !1, t.keepAliveInterval &&= (clearInterval(t.keepAliveInterval), null);
		};
		e.view.dom.addEventListener("compositionstart", n), e.view.dom.addEventListener("compositionend", r), t.compositionStartHandler = n, t.compositionEndHandler = r;
	},
	onDestroy() {
		if (!u_) return;
		let e = this.storage;
		e.keepAliveInterval &&= (clearInterval(e.keepAliveInterval), null);
		let t = e.compositionStartHandler, n = e.compositionEndHandler;
		this.editor?.view?.dom && (t && this.editor.view.dom.removeEventListener("compositionstart", t), n && this.editor.view.dom.removeEventListener("compositionend", n)), e.compositionStartHandler = null, e.compositionEndHandler = null;
	}
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/suggestion/dist/index.js
function p_(e) {
	let { char: t, allowSpaces: n, allowToIncludeChar: r, allowedPrefixes: i, startOfLine: a, $position: o } = e, s = n && !r, c = xm(t), l = RegExp(`\\s${c}$`), u = a ? "^" : "", d = r ? "" : c, f = RegExp(s ? `${u}${c}.*?(?=\\s${d}|$)` : `${u}(?:^)?${c}[^\\s${d}]*`, "gm"), p = o.nodeBefore?.isText && o.nodeBefore.text;
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
function m_(e) {
	return e.docChanged ? e.steps.some((e) => {
		let t = e.slice;
		if (!t?.content) return !1;
		let n = t.content.textBetween(0, t.content.size, "\n");
		return /\s/.test(n);
	}) : !1;
}
function h_(e) {
	return () => {
		let t = e.state.selection.$anchor.pos, { top: n, right: r, bottom: i, left: a } = e.view.coordsAtPos(t);
		try {
			return new DOMRect(a, n, r - a, i - n);
		} catch {
			return null;
		}
	};
}
function g_(e, t, n, r) {
	return n ? () => {
		let n = r.getState(e.state)?.decorationId;
		return t.dom.querySelector(`[data-decoration-id="${n}"]`)?.getBoundingClientRect() || null;
	} : h_(e);
}
function __({ match: e, dismissedRange: t, state: n, transaction: r, editor: i, shouldResetDismissed: a, effectiveAllowSpaces: o }) {
	return a?.({
		editor: i,
		state: n,
		range: t,
		match: e,
		transaction: r,
		allowSpaces: o
	}) ? !1 : o ? e.range.from === t.from : e.range.from === t.from && !m_(r);
}
function v_({ view: e, pluginKeyRef: t }) {
	let n = e.state.tr.setMeta(t, { exit: !0 });
	e.dispatch(n);
}
function y_({ pluginKey: e, decorationTag: t, decorationClass: n, decorationContent: r, decorationEmptyClass: i, renderer: a, dispatchExit: o }) {
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
			return u && d.push(i), U.create(a.doc, [ml.inline(s.from, s.to, {
				nodeName: t,
				class: d.join(" "),
				"data-decoration-id": c || void 0,
				"data-decoration-content": r
			})]);
		}
	};
}
function b_({ editor: e, char: t, effectiveAllowSpaces: n, allowToIncludeChar: r, allowedPrefixes: i, startOfLine: a, findSuggestionMatch: o, allow: s, shouldShow: c, shouldKeepDismissed: l, pluginKey: u }) {
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
function x_({ editor: e, items: t }) {
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
function S_({ placement: e, offset: t, flip: n, floatingUi: r }) {
	var i;
	let a = [$e({
		mainAxis: t.mainAxis ?? 4,
		crossAxis: t.crossAxis ?? 0
	})];
	return n && a.push(Xe()), r != null && (i = r.middleware) != null && i.length && a.push(...r.middleware), {
		placement: e,
		strategy: r?.strategy ?? "absolute",
		middleware: a
	};
}
function C_(e) {
	if (e instanceof HTMLElement) return e;
	if (typeof e == "string") try {
		let t = document.querySelector(e);
		if (t) return t;
	} catch {
		return document.body;
	}
	return document.body;
}
function w_({ getReferenceRect: e, contextElement: t, config: n, container: r, dismissOnOutsideClick: i, dismiss: a }) {
	return (o, s = {}) => {
		let c = {
			getBoundingClientRect: () => e() ?? new DOMRect(),
			contextElement: t
		}, l = !1, u = !o.isConnected;
		u && C_(r).appendChild(o), s.onPosition || (o.style.visibility = "hidden", o.style.width = "max-content");
		let d = Ze(c, o, () => {
			Qe(c, o, {
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
function T_({ editor: e, pluginKey: t, items: n, renderer: r, minQueryLength: i, debounce: a, initialItems: o, placement: s, offset: c, container: l, flip: u, floatingUi: d, dismissOnOutsideClick: f, command: p, clientRectFor: m, dispatchExit: h }) {
	let g, _ = x_({
		editor: e,
		items: n
	}), v = S_({
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
			let S = null, C = b.query !== x.query, w = b.text !== x.text, ee = b.range.from !== x.range.from || b.range.to !== x.range.to, T = C || w || ee;
			if (!b.active && x.active) S = "started";
			else if (b.active && !x.active) S = "stopped";
			else if (x.active && T) S = "updated";
			else return;
			let E = S === "stopped" ? b : x, D = n.dom.querySelector(`[data-decoration-id="${E.decorationId}"]`), te = m(n, D), ne = i === 0 || (E.query ? E.query.length >= i : !1), re = (S === "started" || S === "updated") && ne;
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
				decorationNode: D,
				clientRect: te,
				loading: re,
				placement: s,
				offset: {
					mainAxis: c.mainAxis ?? 4,
					crossAxis: c.crossAxis ?? 0
				},
				container: l,
				flip: u,
				floatingUi: v,
				mount: w_({
					getReferenceRect: te,
					contextElement: n.dom,
					config: v,
					container: l,
					dismissOnOutsideClick: f,
					dismiss: () => h(e.view)
				})
			}, S === "started") {
				var ie;
				r == null || (ie = r.onBeforeStart) == null || ie.call(r, g);
			}
			if (S === "updated") {
				var ae;
				r == null || (ae = r.onBeforeUpdate) == null || ae.call(r, g);
			}
			if (S === "started" && y(S, g), S === "started" || S === "updated") {
				if (!re) _.abort(), g = {
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
var E_ = new R("suggestion");
function D_({ pluginKey: e = E_, editor: t, char: n = "@", allowSpaces: r = !1, allowToIncludeChar: i = !1, allowedPrefixes: a = [" "], startOfLine: o = !1, decorationTag: s = "span", decorationClass: c = "suggestion", decorationContent: l = "", decorationEmptyClass: u = "is-empty", command: d = () => null, items: f = () => [], minQueryLength: p = 0, debounce: m = 0, initialItems: h, placement: g = "bottom-start", offset: _ = {}, container: v, flip: y = !0, floatingUi: b, dismissOnOutsideClick: x = !0, render: S = () => ({}), allow: C = () => !0, findSuggestionMatch: w = p_, shouldShow: ee, shouldResetDismissed: T }) {
	let E = S?.(), D = r && !i, te = (n, r) => g_(t, n, r, e);
	function ne(e) {
		return __({
			...e,
			editor: t,
			shouldResetDismissed: T,
			effectiveAllowSpaces: D
		});
	}
	let re = (t) => v_({
		view: t,
		pluginKeyRef: e
	});
	return new L({
		key: e,
		view: () => T_({
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
			clientRectFor: te,
			dispatchExit: re
		}),
		state: b_({
			editor: t,
			char: n,
			effectiveAllowSpaces: D,
			allowToIncludeChar: i,
			allowedPrefixes: a,
			startOfLine: o,
			findSuggestionMatch: w,
			allow: C,
			shouldShow: ee,
			shouldKeepDismissed: ne,
			pluginKey: e
		}),
		props: y_({
			pluginKey: e,
			decorationTag: s,
			decorationClass: c,
			decorationContent: l,
			decorationEmptyClass: u,
			renderer: E,
			dispatchExit: re
		})
	});
}
var O_ = D_, k_ = le("<!> <!>", 1), A_ = {
	hash: "svelte-1ybpe8d",
	code: ".suggestion-command {display:inline-block;width:fit-content;max-width:calc(100vw - 16px);background:var(--window);color:var(--text);overflow:hidden;}.suggestion-command-list {--suggestion-command-row-height: 40px;--suggestion-command-visible-rows: 10;max-height:calc(\n            var(--suggestion-command-row-height) *\n                var(--suggestion-command-visible-rows)\n        );width:max-content;max-width:100%;}.suggestion-command-scroll {width:max-content;max-width:100%;max-height:calc(\n            var(--suggestion-command-row-height) *\n                var(--suggestion-command-visible-rows)\n        );overflow:hidden;}.suggestion-command-viewport {max-height:calc(\n            var(--suggestion-command-row-height) *\n                var(--suggestion-command-visible-rows)\n        );width:max-content;max-width:calc(100vw - 16px);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}.suggestion-command-item {display:grid;grid-template-columns:var(\n            --suggestion-command-item-columns,\n            minmax(0, 1fr)\n        );align-items:center;gap:8px;width:100%;max-width:calc(100vw - 16px);min-height:var(--suggestion-command-row-height);padding:4px 10px;cursor:pointer;color:var(--text);outline:none;user-select:none;}.suggestion-command-item.selected,\n    .suggestion-command-item[data-highlighted] {background:var(--btn-hover-bg);}\n\n    @media (hover: hover) and (pointer: fine) {.suggestion-command-item:hover {background:var(--btn-hover-bg);}\n    }.suggestion-command-scrollbar {display:flex;width:8px;padding:1px;background:transparent;}.suggestion-command-scrollbar-thumb {flex:1;border-radius:999px;background:var(--border);}"
};
function j_(e, n) {
	r(n, !0), re(e, A_);
	let i = ue(n, "rootClass", 3, ""), c = ue(n, "itemClass", 3, ""), d = ve(0), f = ve(null);
	function m() {
		n.items.length > 0 && (x(d, (O(d) + 1) % n.items.length), b());
	}
	function h() {
		n.items.length > 0 && (x(d, (O(d) - 1 + n.items.length) % n.items.length), b());
	}
	function _() {
		let e = n.items[O(d)];
		return e !== void 0 && (n.onSelect(e), !0);
	}
	function v() {
		x(d, 0), b();
	}
	function y(e) {
		n.onSelect(e);
	}
	function b() {
		ne().then(S);
	}
	function S() {
		if (!O(f)) return;
		let e = O(f).querySelector(".suggestion-command-item.selected");
		if (!e) return;
		let t = e.offsetTop, n = t + e.offsetHeight, r = O(f).scrollTop, i = r + O(f).clientHeight;
		t < r ? O(f).scrollTop = t : n > i && (O(f).scrollTop = n - O(f).clientHeight);
	}
	var C = {
		moveDown: m,
		moveUp: h,
		confirmSelection: _,
		resetIndex: v
	}, w = l(), ee = E(w), T = (e) => {
		var t = l(), r = E(t);
		{
			let e = g(() => `suggestion-command ${i()}`.trim());
			p(r, () => tt, (t, r) => {
				r(t, {
					get class() {
						return O(e);
					},
					shouldFilter: !1,
					disableInitialScroll: !0,
					loop: !0,
					children: (e, t) => {
						var r = l(), i = E(r);
						p(i, () => it, (e, t) => {
							t(e, {
								class: "suggestion-command-list",
								children: (e, t) => {
									var r = l(), i = E(r);
									p(i, () => et, (e, t) => {
										t(e, {
											type: "auto",
											class: "suggestion-command-scroll",
											children: (e, t) => {
												var r = k_(), i = E(r);
												p(i, () => nt, (e, t) => {
													t(e, {
														class: "suggestion-command-viewport",
														get ref() {
															return O(f);
														},
														set ref(e) {
															x(f, e, !0);
														},
														children: (e, t) => {
															var r = l(), i = E(r);
															u(i, 19, () => n.items, (e) => n.getKey(e), (e, t, r) => {
																var i = l(), a = E(i);
																{
																	let e = g(() => n.getValue(O(t))), i = g(() => [n.getValue(O(t))]), u = g(() => `suggestion-command-item ${c()}${O(r) === O(d) ? " selected" : ""}`.trim());
																	p(a, () => ot, (a, c) => {
																		c(a, {
																			get value() {
																				return O(e);
																			},
																			get keywords() {
																				return O(i);
																			},
																			get class() {
																				return O(u);
																			},
																			onSelect: () => y(O(t)),
																			onmouseenter: () => {
																				x(d, O(r), !0);
																			},
																			get onmousedown() {
																				return Nt;
																			},
																			get ontouchstart() {
																				return Pt;
																			},
																			children: (e, i) => {
																				var a = l(), c = E(a);
																				o(c, () => n.children, () => O(t), () => O(r), () => O(r) === O(d)), s(e, a);
																			},
																			$$slots: { default: !0 }
																		});
																	});
																}
																s(e, i);
															}), s(e, r);
														},
														$$slots: { default: !0 }
													});
												});
												var a = ae(i, 2);
												p(a, () => at, (e, t) => {
													t(e, {
														orientation: "vertical",
														class: "suggestion-command-scrollbar",
														children: (e, t) => {
															var n = l(), r = E(n);
															p(r, () => rt, (e, t) => {
																t(e, { class: "suggestion-command-scrollbar-thumb" });
															}), s(e, n);
														},
														$$slots: { default: !0 }
													});
												}), s(e, r);
											},
											$$slots: { default: !0 }
										});
									}), s(e, r);
								},
								$$slots: { default: !0 }
							});
						}), s(e, r);
					},
					$$slots: { default: !0 }
				});
			});
		}
		s(e, t);
	};
	return t(ee, (e) => {
		n.items.length > 0 && e(T);
	}), s(e, w), a(C);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/HashtagSuggestionList.svelte
var M_ = le("<span class=\"hashtag-prefix svelte-1kcfexa\">#</span> <span class=\"hashtag-label svelte-1kcfexa\"> </span>", 1), N_ = {
	hash: "svelte-1kcfexa",
	code: ".hashtag-suggestion-command {--suggestion-command-item-columns: auto minmax(0, 1fr);}.hashtag-prefix.svelte-1kcfexa {opacity:0.65;}.hashtag-label.svelte-1kcfexa {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.95rem;font-weight:600;}"
};
function P_(e, t) {
	r(t, !0), re(e, N_);
	let n = ve(null);
	function i() {
		O(n)?.moveDown?.();
	}
	function o() {
		O(n)?.moveUp?.();
	}
	function l() {
		return O(n)?.confirmSelection?.() ?? !1;
	}
	function u() {
		O(n)?.resetIndex?.();
	}
	var d = {
		moveDown: i,
		moveUp: o,
		confirmSelection: l,
		resetIndex: u
	};
	return T(j_(e, {
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
		children: (e, t = m) => {
			var n = M_(), r = ae(E(n), 2), i = ce(r, !0);
			w(() => c(i, t())), s(e, n);
		},
		$$slots: { default: !0 }
	}), (e) => x(n, e, !0), () => O(n)), a(d);
}
var F_ = 1;
function I_(e) {
	return e.toLowerCase();
}
function L_(e) {
	return typeof e?.tag == "string" && typeof e?.lastUsed == "number";
}
function R_(e) {
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return !Array.isArray(t) || !t.every(L_) ? null : t;
	} catch {
		return null;
	}
}
function z_(e) {
	return {
		tag: e.tag,
		lastUsed: e.lastUsed,
		useCount: e.useCount
	};
}
function B_(e, t, n, r) {
	let i = r();
	return {
		tagLower: I_(e),
		tag: e,
		useCount: t,
		lastUsed: n,
		createdAt: i,
		updatedAt: i,
		schemaVersion: F_
	};
}
function V_(e, t) {
	return t.useCount === e.useCount ? t.lastUsed === e.lastUsed ? e.tagLower.localeCompare(t.tagLower) : t.lastUsed - e.lastUsed : t.useCount - e.useCount;
}
function H_(e, t) {
	return !t || e === t ? 0 : e.startsWith(t) ? 1 : e.includes(t) ? 2 : 3;
}
function U_(e) {
	let t = I_(e);
	return (e, n) => {
		let r = H_(e.tagLower, t) - H_(n.tagLower, t);
		return r === 0 ? V_(e, n) : r;
	};
}
var W_ = new class {
	db;
	now;
	getStorage;
	constructor(e = Ee, t = Date.now, n = () => ye()) {
		this.db = e, this.now = t, this.getStorage = n;
	}
	async getAll() {
		return await this.ensureLegacyHistoryMigrated(), (await this.db.hashtagHistory.toArray()).sort(V_).map(z_);
	}
	async save(e) {
		if (!e.length) return;
		await this.ensureLegacyHistoryMigrated();
		let t = this.now(), n = [...new Set(e.filter((e) => typeof e == "string" && e.length > 0 && e.length <= 100).map(I_))];
		if (n.length === 0) return;
		let r = await this.db.hashtagHistory.bulkGet(n), i = /* @__PURE__ */ new Map();
		r.forEach((e) => {
			e && i.set(e.tagLower, e);
		});
		let a = /* @__PURE__ */ new Map();
		for (let n of e) {
			if (!n || n.length > 100) continue;
			let e = I_(n), r = i.get(e);
			if (r) {
				let n = {
					...r,
					useCount: r.useCount + 1,
					lastUsed: t,
					updatedAt: t,
					schemaVersion: F_
				};
				i.set(e, n), a.set(e, n);
			} else {
				let r = B_(n, 1, t, () => t);
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
		let t = I_(e);
		return (await this.db.hashtagHistory.toArray()).filter((e) => !t || e.tagLower.includes(t)).sort(U_(e)).slice(0, 5).map((e) => e.tag);
	}
	async trimToMax() {
		let e = (await this.db.hashtagHistory.toArray()).sort(V_).slice(100);
		e.length !== 0 && await this.db.hashtagHistory.bulkDelete(e.map((e) => e.tagLower));
	}
	async ensureLegacyHistoryMigrated() {
		if ((await this.db.legacyImportState.get("migrated.localStorage.hashtagHistory.v1"))?.done === !0) return;
		let e = this.getStorage(), t = R_(e.getItem(Ae.HASHTAG_HISTORY));
		if (t === null) return;
		let n = /* @__PURE__ */ new Map();
		for (let e of t) {
			if (!e.tag || e.tag.length > 100) continue;
			let t = I_(e.tag), r = n.get(t), i = Math.max(1, e.useCount ?? 1);
			(!r || e.lastUsed > r.lastUsed) && n.set(t, B_(e.tag, i, e.lastUsed, this.now));
		}
		let r = !1;
		if (await this.db.transaction("rw", this.db.hashtagHistory, this.db.legacyImportState, async () => {
			if ((await this.db.legacyImportState.get("migrated.localStorage.hashtagHistory.v1"))?.done === !0) {
				r = !0;
				return;
			}
			let e = [...n.values()].sort(V_).slice(0, 100);
			e.length > 0 && await this.db.hashtagHistory.bulkPut(e), await this.db.legacyImportState.put({
				id: De,
				done: !0,
				updatedAt: this.now()
			}), r = !0;
		}), r) try {
			e.removeItem(Ae.HASHTAG_HISTORY);
		} catch {}
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/hashtagHistory.ts
function G_(e) {
	return W_.save(e);
}
function K_(e) {
	return W_.getSuggestions(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/suggestionRenderer.svelte.ts
function q_({ component: e, className: t, approxDropdownHeight: n = 220, zIndex: r = "9999", getProps: i }) {
	return () => {
		let a = null, o = null, s = [], c = null, l = ve(null);
		function u() {
			return a ?? {};
		}
		function d() {
			let e = document.createElement("div");
			return t && (e.className = t), e.style.position = "fixed", e.style.zIndex = r, be().overlayTarget.appendChild(e), e;
		}
		function f(e) {
			return i?.({
				items: s,
				command: e
			}) ?? {
				items: s,
				onSelect: e
			};
		}
		function p(e) {
			let t = {};
			for (let n of Object.keys(e)) Object.defineProperty(t, n, {
				enumerable: !0,
				get: () => O(l)?.[n]
			});
			return t;
		}
		function m() {
			if (!o || !c) return;
			let t = f(c);
			x(l, t), !a && s.length && (a = y(e, {
				target: o,
				props: p(t)
			}));
		}
		function h(e) {
			if (!o || !e) return;
			let t = e();
			if (!t) return;
			let r = window.innerHeight - t.bottom, i = o.offsetWidth, a = Math.max(0, window.innerWidth - i - 8);
			o.style.left = `${Math.min(Math.max(0, t.left), a)}px`, r < n && t.top > n ? o.style.top = `${t.top - n - 4}px` : o.style.top = `${t.bottom + 4}px`;
		}
		function g() {
			a &&= (v(a), null), o &&= (o.remove(), null), s = [], c = null, x(l, null);
		}
		return {
			onStart(e) {
				s = e.items ?? [], c = e.command ?? null, s.length && (o = d(), m(), requestAnimationFrame(() => h(e.clientRect)));
			},
			onUpdate(e) {
				s = e.items ?? [], c = e.command ?? null, s.length ? (o ||= d(), m(), u().resetIndex?.(), requestAnimationFrame(() => h(e.clientRect))) : m();
			},
			onKeyDown(e) {
				if (!s.length || !e.event) return !1;
				let t = u();
				switch (e.event.key) {
					case "ArrowDown": return t.moveDown?.(), !0;
					case "Tab": return t.confirmSelection?.() ?? !1;
					case "ArrowUp": return t.moveUp?.(), !0;
					case "Enter": return t.confirmSelection?.() ?? !1;
					default: return !1;
				}
			},
			onExit() {
				g();
			}
		};
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/hashtagSuggestion.ts
var J_ = Y.create({
	name: "hashtagSuggestion",
	addProseMirrorPlugins() {
		return [O_({
			editor: this.editor,
			char: "#",
			allowSpaces: !1,
			allowedPrefixes: [
				" ",
				"\n",
				"	",
				"　"
			],
			items: ({ query: e }) => K_(e),
			render: q_({ component: P_ }),
			command: ({ editor: e, range: t, props: n }) => {
				e.chain().focus().deleteRange(t).insertContent("#" + n + " ").run();
			}
		})];
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useCustomEmojiDrag.svelte.ts
function Y_(e, t) {
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
function X_({ getElement: e, getPos: t, dragState: n, getNodeAttrs: r }) {
	let i = bt();
	function a() {
		n.longPressTimeout &&= (clearTimeout(n.longPressTimeout), null), n.startTarget = null;
	}
	function o() {
		let e = t();
		typeof e == "number" && n.startTarget && (n.isDragging = !0, n.draggedNodePos = e, Y_("start", { nodePos: e }), n.preview = kt(n.startTarget, n.startPos.x, n.startPos.y));
	}
	function s(e) {
		if (e.touches.length !== 1) return;
		wt();
		let t = Oe(e);
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
		let r = Oe(e);
		!n.isDragging && n.longPressTimeout && Dt(r.x, r.y, n.startPos.x, n.startPos.y, 10) ? a() : n.isDragging && (e.preventDefault(), Ct(n.preview, r.x, r.y), Ot(r.x, r.y), Y_("move", {
			touchX: r.x,
			touchY: r.y,
			nodePos: t()
		}));
	}
	function l(e) {
		if (n.longPressTimeout && a(), !n.isDragging) return;
		e.preventDefault();
		let i = Oe(e), o = document.elementFromPoint(i.x, i.y), s = (o?.closest(".drop-zone-indicator, .custom-emoji-origin-drop-zone"))?.getAttribute("data-drop-pos");
		Y_("end", {
			nodeData: {
				type: "customEmoji",
				attrs: r(),
				pos: t()
			},
			dropX: i.x,
			dropY: i.y,
			target: o,
			dropPosition: s ? Number.parseInt(s, 10) : null
		}), n.isDragging = !1, n.draggedNodePos = null, Et(n.preview), n.preview = null;
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
				if (!Dt(e.clientX, e.clientY, n.startPos.x, n.startPos.y, 10)) return;
				o();
			}
			e.preventDefault(), Ct(n.preview, e.clientX, e.clientY), Ot(e.clientX, e.clientY), Y_("move", {
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
		Y_("end", {
			nodeData: {
				type: "customEmoji",
				attrs: r(),
				pos: t()
			},
			dropX: e.clientX,
			dropY: e.clientY,
			target: i,
			dropPosition: a ? Number.parseInt(a, 10) : null
		}), n.isDragging = !1, n.draggedNodePos = null, n.startTarget = null, Et(n.preview), n.preview = null;
	}
	ie(() => {
		let t = e();
		if (t) return t.addEventListener("pointerdown", u, { passive: !1 }), i && (t.addEventListener("touchstart", s, { passive: !1 }), t.addEventListener("touchmove", c, { passive: !1 }), t.addEventListener("touchend", l, { passive: !1 }), t.addEventListener("touchcancel", l, { passive: !1 })), () => {
			t.removeEventListener("pointerdown", u), i && (t.removeEventListener("touchstart", s), t.removeEventListener("touchmove", c), t.removeEventListener("touchend", l), t.removeEventListener("touchcancel", l)), f(), a(), Et(n.preview), n.draggedNodePos = null, n.preview = null;
		};
	});
	function m() {
		f(), a(), Et(n.preview), n.draggedNodePos = null, n.preview = null;
	}
	return { cleanup: m };
}
// D:/ドキュメント/GitHub/ehagaki/src/components/SvelteCustomEmojiNode.svelte
var Z_ = le("<span class=\"custom-emoji-drag-target svelte-2v0oq4\" data-drag-handle=\"\" draggable=\"false\"><img class=\"custom-emoji-image svelte-2v0oq4\" data-custom-emoji=\"true\" draggable=\"false\"/></span>"), Q_ = {
	hash: "svelte-2v0oq4",
	code: ".custom-emoji-wrapper,\n    .custom-emoji-wrapper[data-node-view-wrapper] {display:inline-block;width:auto;height:34px;margin:0;vertical-align:bottom;border-radius:4px;line-height:0;}.custom-emoji-wrapper.is-selected {outline:2px solid var(--theme);outline-offset:1px;}.custom-emoji-wrapper.custom-emoji-origin-drop-zone {outline:2px solid dodgerblue;outline-offset:2px;background:rgba(30, 144, 255, 0.16);}\n            .custom-emoji-wrapper.custom-emoji-origin-drop-zone.drop-zone-hover\n         {outline-color:var(--yellow);outline-width:3px;background:rgba(255, 200, 0, 0.28);box-shadow:0 0 0 3px rgba(255, 200, 0, 0.22);}.custom-emoji-image.svelte-2v0oq4 {width:auto;height:100%;max-width:none;user-select:none;-webkit-user-drag:none;pointer-events:none;}.custom-emoji-drag-target.svelte-2v0oq4 {display:inline-flex;align-items:center;justify-content:center;height:100%;min-width:1.2em;cursor:grab;touch-action:pan-y;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;}.custom-emoji-drag-target[data-dragging=\"true\"].svelte-2v0oq4 {opacity:0.35;}.drop-zone-indicator.custom-emoji-drop-zone {display:inline-flex;align-items:center;justify-content:center;width:12px;height:1.5lh;min-height:0;margin:0;padding:0;vertical-align:middle;background:none;border:0;box-shadow:none;position:relative;cursor:pointer;}.drop-zone-indicator.custom-emoji-drop-zone .drop-zone-bar {width:4px;height:1.4lh;min-height:0;border-radius:999px;background:dodgerblue;margin:0;padding:0;}\n            .drop-zone-indicator.custom-emoji-drop-zone.drop-zone-hover\n                .drop-zone-bar\n         {background:var(--yellow);outline:2px solid var(--yellow);}\n\n    @media (hover: none) {.custom-emoji-drag-target.svelte-2v0oq4 {cursor:default;}\n    }"
};
function $_(t, n) {
	r(n, !0), re(t, Q_);
	let i = g(() => String(n.node.attrs.shortcode ?? "")), o = g(() => String(n.node.attrs.identityKey ?? "")), c = g(() => O(i) ? `:${O(i)}:` : "Custom emoji"), l = ve(void 0), u = iT, d = bt(), f = ve(void 0);
	function p() {
		try {
			let e = n.getPos();
			return typeof e == "number" ? e : void 0;
		} catch {
			return;
		}
	}
	ie(() => {
		let e = u.isDragging, t = u.draggedNodePos, n = p();
		x(f, e && typeof n == "number" && t === n ? n : void 0, !0);
	});
	let { cleanup: m } = X_({
		getElement: () => O(l),
		getPos: p,
		dragState: u,
		getNodeAttrs: () => n.node.attrs
	});
	function h(e) {
		if (d) {
			e.preventDefault();
			return;
		}
		if (!e.dataTransfer) return;
		let t = p();
		typeof t == "number" && (e.dataTransfer.setData("application/x-tiptap-node", JSON.stringify({
			type: "customEmoji",
			attrs: n.node.attrs,
			pos: t
		})), e.dataTransfer.effectAllowed = "move", u.isDragging = !0, u.draggedNodePos = t, window.dispatchEvent(new CustomEvent("custom-emoji-native-drag-start", { detail: { nodePos: t } })));
	}
	function _() {
		u.isDragging = !1, u.draggedNodePos = null, window.dispatchEvent(new CustomEvent("custom-emoji-native-drag-end"));
	}
	function v(e) {
		(e.type === "touchstart" || typeof PointerEvent < "u" && e instanceof PointerEvent && e.pointerType === "touch") && Nt(e);
		let t = p();
		if (typeof t != "number") return;
		let { state: r, view: i } = n.editor, a = I.create(r.doc, t);
		a.eq(r.selection) || i.dispatch(r.tr.setSelection(a));
	}
	pe(() => {
		m(), Object.assign(iT, {
			isDragging: !1,
			draggedNodePos: null,
			longPressTimeout: null,
			startTarget: null,
			preview: null
		});
	});
	{
		let r = g(() => `custom-emoji-wrapper${n.selected ? " is-selected" : ""}${typeof O(f) == "number" ? " custom-emoji-origin-drop-zone" : ""}`);
		Pg(t, {
			as: "span",
			get class() {
				return O(r);
			},
			get "data-drop-pos"() {
				return O(f);
			},
			children: (t, r) => {
				var a = Z_(), d = ce(a);
				T(a, (e) => x(l, e), () => O(l)), w(() => {
					C(a, "data-dragging", u.isDragging), C(a, "title", O(c)), C(a, "aria-label", O(c)), C(d, "data-identity-key", O(o)), C(d, "data-shortcode", O(i)), C(d, "data-set-address", n.node.attrs.setAddress ?? void 0), C(d, "src", n.node.attrs.src), C(d, "alt", O(c));
				}), e("pointerdown", a, v, !0), e("touchstart", a, v, !0, !0), e("dragstart", a, h), e("dragend", a, _), s(t, a);
			},
			$$slots: { default: !0 }
		});
	}
	a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiExtension.ts
function ev(e) {
	return yt(e);
}
function tv(e) {
	return ev(e.getAttribute("data-shortcode") ?? "") || ev((e.getAttribute("alt") ?? "").match(/^:([^:]+):$/)?.[1] ?? "");
}
function nv(e) {
	let t = e.getAttribute("data-identity-key") ?? "";
	if (t) return t;
	let n = tv(e), r = e.getAttribute("src") ?? "", i = e.getAttribute("data-set-address") ?? null;
	return !n || !r ? "" : _t({
		shortcodeLower: ht(n),
		src: r,
		setAddress: i
	});
}
var rv = "[\\p{L}\\p{N}_+-]", iv = RegExp(`:(${rv}{1,64}):$`, "u"), av = RegExp(`:(${rv}{1,64}):`, "gu");
function ov(e, t) {
	return gt(e, t[1]);
}
function sv(e, t) {
	return [...e.matchAll(av)].filter((e) => ov(t, e)).map((e) => ({
		index: e.index ?? 0,
		text: e[0],
		replaceWith: String(e[1] ?? "")
	}));
}
var cv = hh.create({
	name: "customEmoji",
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	draggable: !0,
	addOptions() {
		return { getItems: () => st.items };
	},
	addAttributes() {
		return {
			identityKey: {
				default: "",
				parseHTML: (e) => nv(e)
			},
			shortcode: {
				default: "",
				parseHTML: (e) => tv(e)
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
		let t = ev(e.shortcode ?? ""), n = typeof e.setAddress == "string" ? e.setAddress : typeof e["data-set-address"] == "string" ? e["data-set-address"] : null, r = String(e.identityKey || (t && e.src ? _t({
			shortcodeLower: ht(t),
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
			let n = ev(e.shortcode);
			if (!n || !e.src) return !1;
			let r = e.setAddress ?? null, i = e.identityKey || _t({
				shortcodeLower: ht(n),
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
		return [new jm({
			find: iv,
			handler: ({ state: e, range: t, match: n }) => {
				let r = ov(this.options.getItems(), n);
				if (!r) return null;
				e.tr.replaceWith(t.from, t.to, this.type.create({
					shortcode: ev(r.shortcode),
					identityKey: r.identityKey,
					src: r.src,
					setAddress: r.setAddress
				})).scrollIntoView();
			}
		})];
	},
	addPasteRules() {
		return [new Bm({
			find: (e) => sv(e, this.options.getItems()),
			handler: ({ state: e, range: t, match: n }) => {
				let r = ov(this.options.getItems(), n);
				if (!r) return null;
				e.tr.replaceWith(t.from, t.to, this.type.create({
					shortcode: ev(r.shortcode),
					identityKey: r.identityKey,
					src: r.src,
					setAddress: r.setAddress
				}));
			}
		})];
	},
	addNodeView() {
		return Ag($_);
	}
}), lv = "customEmojiDrag", uv = "application/x-tiptap-node";
function dv(e) {
	let t = e.dataTransfer?.getData(uv);
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
function fv(e, t) {
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
function pv(e, t) {
	return dv(t) ?? fv(e, t);
}
function mv(e, t) {
	let n = (document.elementFromPoint(e, t)?.closest(".drop-zone-indicator[data-drop-pos], .custom-emoji-origin-drop-zone[data-drop-pos]"))?.getAttribute("data-drop-pos");
	if (!n) return null;
	let r = Number.parseInt(n, 10);
	return Number.isFinite(r) ? r : null;
}
function hv(e) {
	let t = document.createElement("span");
	t.className = "drop-zone-indicator custom-emoji-drop-zone", t.setAttribute("data-drop-pos", String(e));
	let n = document.createElement("span");
	return n.className = "drop-zone-bar", t.appendChild(n), t;
}
function gv(e) {
	e.dispatch(e.state.tr.setMeta(lv, {
		isDragging: !1,
		draggedNodePos: null
	}));
}
var _v = Y.create({
	name: "customEmojiDragDrop",
	addProseMirrorPlugins() {
		let e = new R("custom-emoji-drag-drop"), t = new R("custom-emoji-drop-zone-indicator");
		return [new L({
			key: e,
			state: {
				init: () => ({
					isDragging: !1,
					draggedNodePos: null
				}),
				apply: (e, t) => {
					let n = e.getMeta(lv);
					return n ? {
						...t,
						...n
					} : t;
				}
			},
			props: {
				handleDrop: (e, t) => {
					if (e.editable === !1) return t.preventDefault(), !0;
					let n = dv(t);
					if (!n) return !1;
					t.preventDefault();
					let r = mv(t.clientX, t.clientY), i = e.posAtCoords({
						left: t.clientX,
						top: t.clientY
					}), a = r ?? (i ? hg(e.state.doc, i.pos, n.pos) : null);
					return gv(e), typeof a == "number" && gg(e, n, a), !0;
				},
				handleDOMEvents: {
					dragstart: (e, t) => {
						if (e.editable === !1) return t.preventDefault(), !0;
						let n = t, r = pv(e, n);
						return r && (n.dataTransfer?.setData(uv, JSON.stringify({
							type: "customEmoji",
							attrs: r.attrs,
							pos: r.pos
						})), n.dataTransfer && (n.dataTransfer.effectAllowed = "move"), e.dispatch(e.state.tr.setMeta(lv, {
							isDragging: !0,
							draggedNodePos: r.pos
						}))), !1;
					},
					dragover: (e, t) => {
						if (e.editable === !1) return t.preventDefault(), !0;
						let n = t;
						return n.dataTransfer?.types?.includes(uv) && (t.preventDefault(), n.dataTransfer.dropEffect = "move", Ot(n.clientX, n.clientY)), !1;
					},
					dragend: (e) => (e.editable === !1 || gv(e), !1)
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
					if (t.dispatch(t.state.tr.setMeta(lv, {
						isDragging: !1,
						draggedNodePos: null
					})), n?.type !== "customEmoji" || typeof n.pos != "number") return;
					let s = typeof a == "number" && typeof o == "number" ? t.posAtCoords({
						left: a,
						top: o
					}) : null, c = typeof i == "number" ? i : s ? hg(t.state.doc, s.pos, n.pos) : null;
					typeof c == "number" && gg(t, n, c);
				}, o = (e) => {
					if (t.editable === !1) return;
					let { nodePos: n } = e.detail;
					t.dispatch(t.state.tr.setMeta(lv, {
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
					t.dispatch(t.state.tr.setMeta(lv, {
						isDragging: !0,
						draggedNodePos: typeof n == "number" ? n : null
					}));
				}, l = () => {
					t.editable !== !1 && gv(t);
				};
				return window.addEventListener("touch-custom-emoji-drop", a), window.addEventListener("touch-custom-emoji-drag-start", o), window.addEventListener("touch-custom-emoji-drag-move", s), window.addEventListener("custom-emoji-native-drag-start", c), window.addEventListener("custom-emoji-native-drag-end", l), { destroy() {
					r(), window.removeEventListener("touch-custom-emoji-drop", a), window.removeEventListener("touch-custom-emoji-drag-start", o), window.removeEventListener("touch-custom-emoji-drag-move", s), window.removeEventListener("custom-emoji-native-drag-start", c), window.removeEventListener("custom-emoji-native-drag-end", l);
				} };
			}
		}), new L({
			key: t,
			state: {
				init: () => U.empty,
				apply(t, n, r, i) {
					let a = e.getState(i);
					if (!a?.isDragging) return U.empty;
					let o = pg(i.doc, a.draggedNodePos).map((e) => ml.widget(e, () => hv(e), { side: -1 }));
					return U.create(i.doc, o);
				}
			},
			props: { decorations(e) {
				return this.getState(e);
			} }
		})];
	}
}), vv = le("<img class=\"custom-emoji-suggestion-image svelte-7ukt5v\" draggable=\"false\" loading=\"lazy\" decoding=\"async\"/> <span class=\"custom-emoji-suggestion-shortcode svelte-7ukt5v\"> </span>", 1), yv = {
	hash: "svelte-7ukt5v",
	code: ".custom-emoji-suggestion-command {--suggestion-command-item-columns: 34px minmax(0, 1fr);}.custom-emoji-suggestion-image.svelte-7ukt5v {width:32px;height:32px;object-fit:contain;user-select:none;-webkit-user-drag:none;}.custom-emoji-suggestion-shortcode.svelte-7ukt5v {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.95rem;font-weight:600;}"
};
function bv(e, t) {
	r(t, !0), re(e, yv);
	let n = ve(null);
	function i() {
		O(n)?.moveDown?.();
	}
	function o() {
		O(n)?.moveUp?.();
	}
	function l() {
		return O(n)?.confirmSelection?.() ?? !1;
	}
	function u() {
		O(n)?.resetIndex?.();
	}
	var d = {
		moveDown: i,
		moveUp: o,
		confirmSelection: l,
		resetIndex: u
	};
	return T(j_(e, {
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
		children: (e, t = m) => {
			var n = vv(), r = E(n), i = ae(r, 2), a = ce(i);
			w(() => {
				C(r, "src", t().src), C(r, "alt", `:${t().shortcode}:`), c(a, `:${t().shortcode ?? ""}:`);
			}), s(e, n);
		},
		$$slots: { default: !0 }
	}), (e) => x(n, e, !0), () => O(n)), a(d);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/customEmojiSuggestion.ts
var xv = new R("customEmojiSuggestion"), Sv = /:([\p{L}\p{N}_+-]{1,64})$/u, Cv = /^[a-z][a-z0-9+.-]*:\/\/\S*$/i;
function wv(e) {
	let t = Math.max(e.lastIndexOf(" "), e.lastIndexOf("\n"), e.lastIndexOf("	"), e.lastIndexOf("　")), n = e.slice(t + 1);
	return Cv.test(n);
}
function Tv(e) {
	let t = e.$position.nodeBefore?.isText ? e.$position.nodeBefore.text ?? "" : "";
	if (!t) return null;
	let n = Sv.exec(t);
	if (!n || n.index === void 0) return null;
	let r = yt(n[1]);
	if (!r) return null;
	let i = t.slice(0, n.index).at(-1);
	if (i === ":" || i === "/" || wv(t.slice(0, n.index + n[0].length))) return null;
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
var Ev = Y.create({
	name: "customEmojiSuggestion",
	addOptions() {
		return {
			getItems: () => st.items,
			limit: 30,
			onSelectEmoji: void 0
		};
	},
	addProseMirrorPlugins() {
		let e = this.editor;
		return [O_({
			editor: e,
			pluginKey: xv,
			char: ":",
			allowSpaces: !1,
			allowedPrefixes: null,
			findSuggestionMatch: Tv,
			items: ({ query: e }) => vt(this.options.getItems(), e, this.options.limit),
			render: q_({
				component: bv,
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
						shortcode: yt(n.shortcode),
						src: n.src,
						setAddress: n.setAddress
					}
				}).run() && !r.eq(e.state.doc) && this.options.onSelectEmoji?.(n);
			}
		})];
	}
}), Dv = new R("toolbarCaret");
function Ov(e) {
	e.view.dispatch(e.state.tr.setMeta(Dv, !0).setMeta("addToHistory", !1));
}
function kv(e) {
	Dv.getState(e.state) && e.dispatch(e.state.tr.setMeta(Dv, !1).setMeta("addToHistory", !1));
}
var Av = Y.create({
	name: "toolbarCaret",
	addProseMirrorPlugins() {
		return [new L({
			key: Dv,
			state: {
				init: () => !1,
				apply(e, t) {
					let n = e.getMeta(Dv);
					return typeof n == "boolean" ? n : t;
				}
			},
			props: {
				decorations(e) {
					if (!this.getState(e) || !e.selection.empty) return U.empty;
					let t = ml.widget(e.selection.from, () => {
						let e = document.createElement("span");
						return e.className = "toolbar-caret", e.setAttribute("aria-hidden", "true"), e.contentEditable = "false", e;
					}, {
						key: "toolbar-caret",
						side: -1
					});
					return U.create(e.doc, [t]);
				},
				handleDOMEvents: { focus(e) {
					return kv(e), !1;
				} }
			}
		})];
	}
}), jv = /* @__PURE__ */ new WeakSet(), Mv = /* @__PURE__ */ new WeakSet();
function Nv(e) {
	let t = e;
	return jv.add(t), t;
}
function Pv(e) {
	return Array.isArray(e) && jv.has(e);
}
function Fv(e) {
	return e.flatMap((e) => e == null ? [] : Array.isArray(e) && Mv.has(e) && !Pv(e) ? Fv(e) : [e]);
}
function Iv(e, t) {
	if (e === "slot") return 0;
	if (e instanceof Function) {
		let n = e(t);
		return Array.isArray(n) && !Pv(n) && !Mv.has(n) ? Nv(n) : n;
	}
	let { children: n, ...r } = t ?? {};
	if (e === "svg") throw Error("SVG elements are not supported in the JSX syntax, use the array syntax instead");
	if (Array.isArray(n)) {
		if (Pv(n)) return Nv([
			e,
			r,
			n
		]);
		if (n.length === 0) return Nv([e, r]);
		let t = Fv(n);
		return t.length === 0 ? Nv([e, r]) : Nv([
			e,
			r,
			...t
		]);
	}
	return Nv(n == null ? [e, r] : [
		e,
		r,
		n
	]);
}
var Lv = (e, t) => Iv(e, t), Rv = (e, t) => {
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
		let n = i.parent.content, r = new M(n, 0, 0);
		return e.replace(l, i.after(), r), e.setSelection(F.create(e.doc, l + n.size)), e.scrollIntoView(), t(e), !0;
	});
}, zv = /^\s*>\s$/, Bv = hh.create({
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
		return /* @__PURE__ */ Lv("blockquote", {
			...J(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ Lv("slot", {})
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
			Backspace: () => Rv(this.editor, this.type)
		};
	},
	addInputRules() {
		return [fh({
			find: zv,
			type: this.type
		})];
	}
}), Vv = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, Hv = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, Uv = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, Wv = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, Gv = zm.create({
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
		return /* @__PURE__ */ Lv("strong", {
			...J(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ Lv("slot", {})
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
		return [lh({
			find: Vv,
			type: this.type
		}), lh({
			find: Uv,
			type: this.type
		})];
	},
	addPasteRules() {
		return [_h({
			find: Hv,
			type: this.type
		}), _h({
			find: Wv,
			type: this.type
		})];
	}
}), Kv = (e) => {
	let t = /`([^`]+)`(?!`)$/.exec(e);
	return !t || t.index > 0 && e[t.index - 1] === "`" ? null : {
		index: t.index,
		text: t[0],
		replaceWith: t[1]
	};
}, qv = (e) => {
	let t = /`([^`]+)`(?!`)/g, n = [], r;
	for (; (r = t.exec(e)) !== null;) r.index > 0 && e[r.index - 1] === "`" || n.push({
		index: r.index,
		text: r[0],
		replaceWith: r[1]
	});
	return n;
};
function Jv(e) {
	let t = new Set((e.match(/`+/g) || []).map((e) => e.length)), n = 1;
	for (; t.has(n);) n += 1;
	return n;
}
var Yv = zm.create({
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
		let i = typeof (n == null || (r = n.meta) == null ? void 0 : r.markText) == "string" ? n.meta.markText : "", a = "`".repeat(Jv(i)), o = i.startsWith("`") || i.endsWith("`") ? " " : "";
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
		return [lh({
			find: Kv,
			type: this.type
		})];
	},
	addPasteRules() {
		return [_h({
			find: qv,
			type: this.type
		})];
	}
}), Xv = 4, Zv = /^```([a-z]+)?[\s\n]$/, Qv = /^~~~([a-z]+)?[\s\n]$/, $v = hh.create({
	name: "codeBlock",
	addOptions() {
		return {
			languageClassPrefix: "language-",
			exitOnTripleEnter: !0,
			exitOnArrowDown: !0,
			exitOnArrowUp: !0,
			defaultLanguage: null,
			enableTabIndentation: !1,
			tabSize: Xv,
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
				let t = this.options.tabSize ?? Xv, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				if (i.parent.type !== this.type) return !1;
				let o = " ".repeat(t);
				return a ? e.commands.insertContent(o) : e.commands.command(({ tr: e }) => {
					let { from: t, to: i } = r, a = n.doc.textBetween(t, i, "\n", "\n").split("\n").map((e) => o + e).join("\n");
					return e.replaceWith(t, i, n.schema.text(a)), !0;
				});
			},
			"Shift-Tab": ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? Xv, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
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
					return e.delete(p, p + f), r - p <= f && e.setSelection(F.create(e.doc, p)), !0;
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
				return o === void 0 ? !1 : r.nodeAt(o) ? e.commands.command(({ tr: e }) => (e.setSelection(P.near(r.resolve(o))), !0)) : e.commands.exitCode();
			}
		};
	},
	addInputRules() {
		return [dh({
			find: Zv,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		}), dh({
			find: Qv,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		})];
	},
	addProseMirrorPlugins() {
		return [new L({
			key: new R("codeBlockVSCodeHandler"),
			props: { handlePaste: (e, t) => {
				if (!t.clipboardData || this.editor.isActive(this.type.name)) return !1;
				let n = t.clipboardData.getData("text/plain"), r = t.clipboardData.getData("vscode-editor-data"), i = (r ? JSON.parse(r) : void 0)?.mode;
				if (!n || !i) return !1;
				let { tr: a, schema: o } = e.state, s = o.text(n.replace(/\r\n?/g, "\n"));
				return a.replaceSelectionWith(this.type.create({ language: i }, s)), a.selection.$from.parent.type !== this.type && a.setSelection(F.near(a.doc.resolve(Math.max(0, a.selection.from - 2)))), a.setMeta("paste", !0), e.dispatch(a), !0;
			} }
		})];
	}
}), ey = hh.create({
	name: "doc",
	topNode: !0,
	content: "block+",
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n\n") : ""
}), ty = hh.create({
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
}), ny = hh.create({
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
		return this.options.levels.map((e) => dh({
			find: RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),
			type: this.type,
			getAttributes: { level: e }
		}));
	}
}), ry = hh.create({
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
			if (!ym(t, t.schema.nodes[this.name])) return !1;
			let { selection: n } = t, { $to: r } = n, i = e();
			return op(n) ? i.insertContentAt(r.pos, { type: this.name }) : i.insertContent({ type: this.name }), i.command(({ state: e, tr: t, dispatch: n }) => {
				if (n) {
					let { $to: n } = t.selection, r = n.end();
					if (n.nodeAfter) n.nodeAfter.isTextblock ? t.setSelection(F.create(t.doc, n.pos + 1)) : n.nodeAfter.isBlock ? t.setSelection(I.create(t.doc, n.pos)) : t.setSelection(F.create(t.doc, n.pos));
					else {
						let i = (e.schema.nodes[this.options.nextNodeType] || n.parent.type.contentMatch.defaultType)?.create();
						i && (t.insert(r, i), t.setSelection(F.create(t.doc, r + 1)));
					}
					t.scrollIntoView();
				}
				return !0;
			}).run();
		} };
	},
	addInputRules() {
		return [uh({
			find: /^(?:---|—-|___\s|\*\*\*\s)$/,
			type: this.type
		})];
	}
}), iy = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, ay = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, oy = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, sy = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, cy = zm.create({
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
		return [lh({
			find: iy,
			type: this.type
		}), lh({
			find: oy,
			type: this.type
		})];
	},
	addPasteRules() {
		return [_h({
			find: ay,
			type: this.type
		}), _h({
			find: sy,
			type: this.type
		})];
	}
}), ly = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos6kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12b0cam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", uy = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", dy = "numeric", fy = "ascii", py = "alpha", my = "asciinumeric", hy = "alphanumeric", gy = "domain", _y = "emoji", vy = "scheme", yy = "slashscheme", by = "whitespace";
function xy(e, t) {
	return e in t || (t[e] = []), t[e];
}
function Sy(e, t, n) {
	t[dy] && (t[my] = !0, t[hy] = !0), t[fy] && (t[my] = !0, t[py] = !0), t[my] && (t[hy] = !0), t[py] && (t[hy] = !0), t[hy] && (t[gy] = !0), t[_y] && (t[gy] = !0);
	for (let r in t) {
		let t = xy(r, n);
		t.indexOf(e) < 0 && t.push(e);
	}
}
function Cy(e, t) {
	let n = {};
	for (let r in t) t[r].indexOf(e) >= 0 && (n[r] = !0);
	return n;
}
function wy(e = null) {
	this.j = {}, this.jr = [], this.jd = null, this.t = e;
}
wy.groups = {}, wy.prototype = {
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
		r ||= wy.groups;
		let i;
		return t && t.j ? i = t : (i = new wy(t), n && r && Sy(t, n, r)), this.jr.push([e, i]), i;
	},
	ts(e, t, n, r) {
		let i = this, a = e.length;
		if (!a) return i;
		for (let t = 0; t < a - 1; t++) i = i.tt(e[t]);
		return i.tt(e[a - 1], t, n, r);
	},
	tt(e, t, n, r) {
		r ||= wy.groups;
		let i = this;
		if (t && t.j) return i.j[e] = t, t;
		let a = t, o, s = i.go(e);
		return s ? (o = new wy(), Object.assign(o.j, s.j), o.jr.push.apply(o.jr, s.jr), o.jd = s.jd, o.t = s.t) : o = new wy(), a && (r && (o.t && typeof o.t == "string" ? Sy(a, Object.assign(Cy(o.t, r), n), r) : n && Sy(a, n, r)), o.t = a), i.j[e] = o, o;
	}
};
var X = (e, t, n, r, i) => e.ta(t, n, r, i), Z = (e, t, n, r, i) => e.tr(t, n, r, i), Ty = (e, t, n, r, i) => e.ts(t, n, r, i), Q = (e, t, n, r, i) => e.tt(t, n, r, i), Ey = "WORD", Dy = "UWORD", Oy = "ASCIINUMERICAL", ky = "ALPHANUMERICAL", Ay = "LOCALHOST", jy = "TLD", My = "UTLD", Ny = "SCHEME", Py = "SLASH_SCHEME", Fy = "NUM", Iy = "WS", Ly = "NL", Ry = "OPENBRACE", zy = "CLOSEBRACE", By = "OPENBRACKET", Vy = "CLOSEBRACKET", Hy = "OPENPAREN", Uy = "CLOSEPAREN", Wy = "OPENANGLEBRACKET", Gy = "CLOSEANGLEBRACKET", Ky = "FULLWIDTHLEFTPAREN", qy = "FULLWIDTHRIGHTPAREN", Jy = "LEFTCORNERBRACKET", Yy = "RIGHTCORNERBRACKET", Xy = "LEFTWHITECORNERBRACKET", Zy = "RIGHTWHITECORNERBRACKET", Qy = "FULLWIDTHLESSTHAN", $y = "FULLWIDTHGREATERTHAN", eb = "AMPERSAND", tb = "APOSTROPHE", nb = "ASTERISK", rb = "AT", ib = "BACKSLASH", ab = "BACKTICK", ob = "CARET", sb = "COLON", cb = "COMMA", lb = "DOLLAR", ub = "DOT", db = "EQUALS", fb = "EXCLAMATION", pb = "HYPHEN", mb = "PERCENT", hb = "PIPE", gb = "PLUS", _b = "POUND", vb = "QUERY", yb = "QUOTE", bb = "FULLWIDTHMIDDLEDOT", xb = "SEMI", Sb = "SLASH", Cb = "TILDE", wb = "UNDERSCORE", Tb = "EMOJI", Eb = "SYM", Db = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ALPHANUMERICAL: ky,
	AMPERSAND: eb,
	APOSTROPHE: tb,
	ASCIINUMERICAL: Oy,
	ASTERISK: nb,
	AT: rb,
	BACKSLASH: ib,
	BACKTICK: ab,
	CARET: ob,
	CLOSEANGLEBRACKET: Gy,
	CLOSEBRACE: zy,
	CLOSEBRACKET: Vy,
	CLOSEPAREN: Uy,
	COLON: sb,
	COMMA: cb,
	DOLLAR: lb,
	DOT: ub,
	EMOJI: Tb,
	EQUALS: db,
	EXCLAMATION: fb,
	FULLWIDTHGREATERTHAN: $y,
	FULLWIDTHLEFTPAREN: Ky,
	FULLWIDTHLESSTHAN: Qy,
	FULLWIDTHMIDDLEDOT: bb,
	FULLWIDTHRIGHTPAREN: qy,
	HYPHEN: pb,
	LEFTCORNERBRACKET: Jy,
	LEFTWHITECORNERBRACKET: Xy,
	LOCALHOST: Ay,
	NL: Ly,
	NUM: Fy,
	OPENANGLEBRACKET: Wy,
	OPENBRACE: Ry,
	OPENBRACKET: By,
	OPENPAREN: Hy,
	PERCENT: mb,
	PIPE: hb,
	PLUS: gb,
	POUND: _b,
	QUERY: vb,
	QUOTE: yb,
	RIGHTCORNERBRACKET: Yy,
	RIGHTWHITECORNERBRACKET: Zy,
	SCHEME: Ny,
	SEMI: xb,
	SLASH: Sb,
	SLASH_SCHEME: Py,
	SYM: Eb,
	TILDE: Cb,
	TLD: jy,
	UNDERSCORE: wb,
	UTLD: My,
	UWORD: Dy,
	WORD: Ey,
	WS: Iy
}), Ob = /[a-z]/, kb = /[a-z]/i, Ab = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]|\u{FE0F}/u;
try {
	kb = /* @__PURE__ */ RegExp("\\p{L}", "u"), Ab = /* @__PURE__ */ RegExp("\\p{Emoji}", "u");
} catch {}
var jb = /\d/, Mb = /\s/, Nb = "\r", Pb = "\n", Fb = "️", Ib = "‍", Lb = "￼", Rb = null, zb = null;
function Bb(e = []) {
	let t = {};
	wy.groups = t;
	let n = new wy();
	Rb ??= Wb(ly), zb ??= Wb(uy), Q(n, "'", tb), Q(n, "{", Ry), Q(n, "}", zy), Q(n, "[", By), Q(n, "]", Vy), Q(n, "(", Hy), Q(n, ")", Uy), Q(n, "<", Wy), Q(n, ">", Gy), Q(n, "（", Ky), Q(n, "）", qy), Q(n, "「", Jy), Q(n, "」", Yy), Q(n, "『", Xy), Q(n, "』", Zy), Q(n, "＜", Qy), Q(n, "＞", $y), Q(n, "&", eb), Q(n, "*", nb), Q(n, "@", rb), Q(n, "`", ab), Q(n, "^", ob), Q(n, ":", sb), Q(n, ",", cb), Q(n, "$", lb), Q(n, ".", ub), Q(n, "=", db), Q(n, "!", fb), Q(n, "-", pb), Q(n, "%", mb), Q(n, "|", hb), Q(n, "+", gb), Q(n, "#", _b), Q(n, "?", vb), Q(n, "\"", yb), Q(n, "/", Sb), Q(n, ";", xb), Q(n, "~", Cb), Q(n, "_", wb), Q(n, "\\", ib), Q(n, "・", bb);
	let r = Z(n, jb, Fy, { [dy]: !0 });
	Z(r, jb, r);
	let i = Z(r, Ob, Oy, { [my]: !0 }), a = Z(r, kb, ky, { [hy]: !0 }), o = Z(n, Ob, Ey, { [fy]: !0 });
	Z(o, jb, i), Z(o, Ob, o), Z(i, jb, i), Z(i, Ob, i);
	let s = Z(n, kb, Dy, { [py]: !0 });
	Z(s, Ob), Z(s, jb, a), Z(s, kb, s), Z(a, jb, a), Z(a, Ob), Z(a, kb, a);
	let c = Q(n, Pb, Ly, { [by]: !0 }), l = Q(n, Nb, Iy, { [by]: !0 }), u = Z(n, Mb, Iy, { [by]: !0 });
	Q(n, Lb, u), Q(l, Pb, c), Q(l, Lb, u), Z(l, Mb, u), Q(u, Nb), Q(u, Pb), Z(u, Mb, u), Q(u, Lb, u);
	let d = Z(n, Ab, Tb, { [_y]: !0 });
	Q(d, "#"), Z(d, Ab, d), Q(d, Fb, d);
	let f = Q(d, Ib);
	Q(f, "#"), Z(f, Ab, d);
	let p = [[Ob, o], [jb, i]], m = [
		[Ob, null],
		[kb, s],
		[jb, a]
	];
	for (let e = 0; e < Rb.length; e++) Ub(n, Rb[e], jy, Ey, p);
	for (let e = 0; e < zb.length; e++) Ub(n, zb[e], My, Dy, m);
	Sy(jy, {
		tld: !0,
		ascii: !0
	}, t), Sy(My, {
		utld: !0,
		alpha: !0
	}, t), Ub(n, "file", Ny, Ey, p), Ub(n, "mailto", Ny, Ey, p), Ub(n, "http", Py, Ey, p), Ub(n, "https", Py, Ey, p), Ub(n, "ftp", Py, Ey, p), Ub(n, "ftps", Py, Ey, p), Sy(Ny, {
		scheme: !0,
		ascii: !0
	}, t), Sy(Py, {
		slashscheme: !0,
		ascii: !0
	}, t), e = e.sort((e, t) => e[0] > t[0] ? 1 : -1);
	for (let t = 0; t < e.length; t++) {
		let r = e[t][0], i = e[t][1] ? { [vy]: !0 } : { [yy]: !0 };
		r.indexOf("-") >= 0 ? i[gy] = !0 : Ob.test(r) ? jb.test(r) ? i[my] = !0 : i[fy] = !0 : i[dy] = !0, Ty(n, r, r, i);
	}
	return Ty(n, "localhost", Ay, { ascii: !0 }), n.jd = new wy(Eb), {
		start: n,
		tokens: Object.assign({ groups: t }, Db)
	};
}
function Vb(e, t) {
	let n = Hb(t.replace(/[A-Z]/g, (e) => e.toLowerCase())), r = n.length, i = [], a = 0, o = 0;
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
function Hb(e) {
	let t = [], n = e.length, r = 0;
	for (; r < n;) {
		let i = e.charCodeAt(r), a, o = i < 55296 || i > 56319 || r + 1 === n || (a = e.charCodeAt(r + 1)) < 56320 || a > 57343 ? e[r] : e.slice(r, r + 2);
		t.push(o), r += o.length;
	}
	return t;
}
function Ub(e, t, n, r, i) {
	let a, o = t.length;
	for (let n = 0; n < o - 1; n++) {
		let o = t[n];
		e.j[o] ? a = e.j[o] : (a = new wy(r), a.jr = i.slice(), e.j[o] = a), e = a;
	}
	return a = new wy(n), a.jr = i.slice(), e.j[t[o - 1]] = a, a;
}
function Wb(e) {
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
var Gb = {
	defaultProtocol: "http",
	events: null,
	format: qb,
	formatHref: qb,
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
function Kb(e, t = null) {
	let n = Object.assign({}, Gb);
	e && (n = Object.assign(n, e instanceof Kb ? e.o : e));
	let r = n.ignoreTags, i = [];
	for (let e = 0; e < r.length; e++) i.push(r[e].toUpperCase());
	this.o = n, t && (this.defaultRender = t), this.ignoreTags = i, this.ignoreClasses = n.ignoreClasses.slice();
}
Kb.prototype = {
	o: Gb,
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
		return i && (typeof i == "object" ? (i = n.t in i ? i[n.t] : Gb[e], typeof i == "function" && r && (i = i(t, n))) : typeof i == "function" && r && (i = i(t, n.t, n)), i);
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
function qb(e) {
	return e;
}
function Jb(e, t) {
	this.t = "token", this.v = e, this.tk = t;
}
Jb.prototype = {
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
	toObject(e = Gb.defaultProtocol) {
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
function Yb(e, t) {
	class n extends Jb {
		constructor(t, n) {
			super(t, n), this.t = e;
		}
	}
	for (let e in t) n.prototype[e] = t[e];
	return n.t = e, n;
}
var Xb = Yb("email", {
	isLink: !0,
	toHref() {
		return "mailto:" + this.toString();
	}
}), Zb = Yb("text"), Qb = Yb("nl"), $b = Yb("url", {
	isLink: !0,
	toHref(e = Gb.defaultProtocol) {
		return this.hasProtocol() ? this.v : `${e}://${this.v}`;
	},
	hasProtocol() {
		let e = this.tk;
		return e.length >= 2 && e[0].t !== Ay && e[1].t === sb;
	}
}), ex = (e) => new wy(e);
function tx({ groups: e }) {
	let t = e.domain.concat([
		eb,
		nb,
		rb,
		ib,
		ab,
		ob,
		lb,
		db,
		pb,
		Fy,
		mb,
		hb,
		gb,
		_b,
		Sb,
		Eb,
		Cb,
		wb
	]), n = [
		tb,
		sb,
		cb,
		ub,
		fb,
		mb,
		vb,
		yb,
		xb,
		Wy,
		Gy,
		Ry,
		zy,
		Vy,
		By,
		Hy,
		Uy,
		Ky,
		qy,
		Jy,
		Yy,
		Xy,
		Zy,
		Qy,
		$y
	], r = [
		eb,
		tb,
		nb,
		ib,
		ab,
		ob,
		lb,
		db,
		pb,
		Ry,
		zy,
		mb,
		hb,
		gb,
		_b,
		vb,
		Sb,
		Eb,
		Cb,
		wb
	], i = ex(), a = Q(i, Cb);
	X(a, r, a), X(a, e.domain, a);
	let o = ex(), s = ex(), c = ex();
	X(i, e.domain, o), X(i, e.scheme, s), X(i, e.slashscheme, c), X(o, r, a), X(o, e.domain, o);
	let l = Q(o, rb);
	Q(a, rb, l), Q(s, rb, l), Q(c, rb, l);
	let u = Q(a, ub);
	X(u, r, a), X(u, e.domain, a);
	let d = ex();
	X(l, e.domain, d), X(d, e.domain, d);
	let f = Q(d, ub);
	X(f, e.domain, d);
	let p = ex(Xb);
	X(f, e.tld, p), X(f, e.utld, p), Q(l, Ay, p);
	let m = Q(d, pb);
	Q(m, pb, m), X(m, e.domain, d), X(p, e.domain, d), Q(p, ub, f), Q(p, pb, m);
	let h = Q(o, pb), g = Q(o, ub);
	Q(h, pb, h), X(h, e.domain, o), X(g, r, a), X(g, e.domain, o);
	let _ = ex($b);
	X(g, e.tld, _), X(g, e.utld, _), X(_, e.domain, o), X(_, r, a), Q(_, ub, g), Q(_, pb, h), Q(_, rb, l);
	let v = Q(_, sb), y = ex($b);
	X(v, e.numeric, y);
	let b = ex($b), x = ex();
	X(b, t, b), X(b, n, x), X(x, t, b), X(x, n, x), Q(_, Sb, b), Q(y, Sb, b), Q(_, vb, x), Q(_, _b, b), Q(y, vb, x), Q(y, _b, b);
	let S = Q(s, sb), C = Q(Q(Q(c, sb), Sb), Sb);
	X(s, e.domain, o), Q(s, ub, g), Q(s, pb, h), X(c, e.domain, o), Q(c, ub, g), Q(c, pb, h), X(S, e.domain, b), Q(S, Sb, b), Q(S, vb, b), X(C, e.domain, b), X(C, t, b), Q(C, Sb, b);
	let w = [
		[Ry, zy],
		[By, Vy],
		[Hy, Uy],
		[Wy, Gy],
		[Ky, qy],
		[Jy, Yy],
		[Xy, Zy],
		[Qy, $y]
	];
	for (let e = 0; e < w.length; e++) {
		let [r, i] = w[e], a = Q(b, r);
		Q(x, r, a);
		let o = ex($b);
		X(a, t, o);
		let s = ex();
		X(a, n, s), Q(a, i, b), X(o, t, o), X(o, n, s), X(s, t, o), X(s, n, s), Q(o, i, b), Q(s, i, b);
	}
	return Q(i, Ay, _), Q(i, Ly, Qb), {
		start: i,
		tokens: Db
	};
}
function nx(e, t, n) {
	let r = n.length, i = 0, a = [], o = [], s = [];
	for (; i < r;) {
		let c = e, l = null, u = null, d = 0, f = null, p = -1, m = [];
		for (; i < r && !(l = c.go(n[i].t));) o.push(n[i++]);
		for (; i < r && (u = l || c.go(n[i].t));) if (l = null, c = u, i++, d++, c.accepts()) p = 0, f = c, m = [];
		else if (p >= 0 && p++, m.push(c), s[i] && s[i].has(c)) break;
		for (let e = 0, t = i - m.length + 1; e < m.length; e++, t++) (s[t] || (s[t] = /* @__PURE__ */ new Set())).add(m[e]);
		if (p < 0) i -= d, i < r && (o.push(n[i]), i++);
		else {
			o.length > 0 && (a.push(rx(Zb, t, o)), o = []), i -= p, d -= p;
			let e = f.t, r = n.slice(i - d, i);
			a.push(rx(e, t, r));
		}
	}
	return o.length > 0 && a.push(rx(Zb, t, o)), a;
}
function rx(e, t, n) {
	let r = n[0].s, i = n[n.length - 1].e;
	return new e(t.slice(r, i), n);
}
var ix = typeof console < "u" && console && console.warn || (() => {}), ax = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", $ = {
	scanner: null,
	parser: null,
	tokenQueue: [],
	pluginQueue: [],
	customSchemes: [],
	initialized: !1
};
function ox() {
	return wy.groups = {}, $.scanner = null, $.parser = null, $.tokenQueue = [], $.pluginQueue = [], $.customSchemes = [], $.initialized = !1, $;
}
function sx(e, t = !1) {
	if ($.initialized && ix(`linkifyjs: already initialized - will not register custom scheme "${e}" ${ax}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e)) throw Error("linkifyjs: incorrect scheme format.\n1. Must only contain digits, lowercase ASCII letters or \"-\"\n2. Cannot start or end with \"-\"\n3. \"-\" cannot repeat");
	$.customSchemes.push([e, t]);
}
function cx() {
	$.scanner = Bb($.customSchemes);
	for (let e = 0; e < $.tokenQueue.length; e++) $.tokenQueue[e][1]({ scanner: $.scanner });
	$.parser = tx($.scanner.tokens);
	for (let e = 0; e < $.pluginQueue.length; e++) $.pluginQueue[e][1]({
		scanner: $.scanner,
		parser: $.parser
	});
	return $.initialized = !0, $;
}
function lx(e) {
	return $.initialized || cx(), nx($.parser.start, e, Vb($.scanner.start, e));
}
lx.scan = Vb;
function ux(e, t = null, n = null) {
	if (t && typeof t == "object") {
		if (n) throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);
		n = t, t = null;
	}
	let r = new Kb(n), i = lx(e), a = [];
	for (let e = 0; e < i.length; e++) {
		let n = i[e];
		n.isLink && (!t || n.t === t) && r.check(n) && a.push(n.toFormattedObject(r));
	}
	return a;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/extension-link/dist/index.js
var dx = "[\0- \xA0 ᠎ -\u2029 　]", fx = new RegExp(dx), px = RegExp(`${dx}$`), mx = RegExp(`${dx}+$`), hx = new RegExp(dx, "g");
function gx(e, t, n) {
	let r = e.doc.resolve(t.to);
	if (!r.nodeBefore?.isText) return;
	let i = e.doc.textBetween(t.from, t.to, "￼", "￼").match(mx)?.[0];
	if (!i) return;
	let a = t.to - i.length, o = qf(a, t.to, e.doc).filter((e) => e.mark.type === n);
	if (!o.length) return;
	let { nodeAfter: s } = r;
	if (s && o.some((e) => e.mark.isInSet(s.marks))) return;
	let c = e.storedMarks;
	e.removeMark(a, t.to, n), e.setStoredMarks(c), e.selection.empty && e.selection.from === t.to && e.removeStoredMark(n);
}
function _x(e) {
	return e.length === 1 ? e[0].isLink : e.length === 3 && e[1].isLink ? ["()", "[]"].includes(e[0].value + e[2].value) : !1;
}
function vx(e) {
	return new L({
		key: new R("autolink"),
		appendTransaction: (t, n, r) => {
			let i = t.some((e) => e.docChanged) && !n.doc.eq(r.doc), a = t.some((e) => e.getMeta("preventAutolink"));
			if (!i || a) return;
			let { tr: o } = r, s = lf(n.doc, [...t]);
			if (!t.some(Hu)) {
				let t = [];
				s.steps.forEach((e, n) => {
					if (!(e instanceof kr) || !e.slice.size) return;
					let r = s.mapping.slice(n + 1), i = r.map(e.from, 1), a = r.map(e.from + e.slice.size, -1);
					i < a && t.push({
						from: i,
						to: a
					});
				}), t.sort((e, t) => t.to - e.to), t.forEach((t) => gx(o, t, e.type));
			}
			if (Kf(s).forEach(({ newRange: t }) => {
				let n = df(r.doc, t, (e) => e.isTextblock), i, a;
				if (n.length > 1) i = n[0], a = r.doc.textBetween(i.pos, i.pos + i.node.nodeSize, void 0, " ");
				else if (n.length) {
					let e = r.doc.textBetween(t.from, t.to, " ", " ");
					if (!px.test(e)) return;
					i = n[0], a = r.doc.textBetween(i.pos, t.to, void 0, " ");
				}
				if (i && a) {
					let t = a.split(fx).filter(Boolean);
					if (t.length <= 0) return !1;
					let n = t[t.length - 1], s = i.pos + a.lastIndexOf(n);
					if (!n) return !1;
					let c = lx(n).map((t) => t.toObject(e.defaultProtocol));
					if (!_x(c)) return !1;
					c.filter((e) => e.isLink).map((e) => ({
						...e,
						from: s + e.start + 1,
						to: s + e.end + 1
					})).filter((e) => !r.schema.marks.code || !r.doc.rangeHasMark(e.from, e.to, r.schema.marks.code)).filter((t) => e.validate(t.value)).filter((t) => e.shouldAutoLink(t.value)).forEach((t) => {
						qf(t.from, t.to, r.doc).some((t) => t.mark.type === e.type) || o.addMark(t.from, t.to, e.type.create({ href: t.href }));
					});
				}
			}), o.steps.length) return o;
		}
	});
}
function yx(e) {
	return new L({
		key: new R("handleClickLink"),
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
				let n = Uf(t.state, e.type.name), r = i.href ?? n.href, o = i.target ?? n.target;
				r && (window.open(r, o), a = !0);
			}
			return a;
		} }
	});
}
var bx = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/, xx = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;
function Sx(e, t) {
	let n = 0;
	for (let r = t - 1; r >= 0 && e[r] === "\\"; --r) n += 1;
	return n % 2 == 1;
}
function Cx(e, t) {
	let n = 0, r = 0;
	for (; r < t;) {
		if (e[r] !== "`" || n === 0 && Sx(e, r)) {
			r += 1;
			continue;
		}
		let i = 0;
		for (; r < t && e[r] === "`";) i += 1, r += 1;
		n === 0 ? n = i : i === n && (n = 0);
	}
	return n > 0;
}
function wx(e, t, n) {
	let [, r, i] = t;
	return (t.index ? e[t.index - 1] : void 0) === "!" || Sx(e, t.index ?? 0) || Cx(e, t.index ?? 0) ? !1 : !!r.trim() && n(i);
}
function Tx(e) {
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
function Ex(e, t) {
	return e.index < t.index + t.text.length && t.index < e.index + e.text.length;
}
function Dx(e) {
	return {
		href: e.data?.href,
		title: e.data?.title ?? null
	};
}
function Ox(e) {
	let t = lh({
		find: (t) => {
			let n = bx.exec(t);
			return !n || !wx(t, n, e.isAllowedHref) ? null : Tx(n);
		},
		type: e.type,
		getAttributes: Dx
	});
	return new jm({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function kx(e) {
	let t = _h({
		find: (t) => {
			let n = [];
			for (let r of t.matchAll(xx)) wx(t, r, e.isAllowedHref) && n.push(Tx(r));
			let r = (e.findPlainUrls?.call(e, t) ?? []).filter((e) => !n.some((t) => Ex(t, e)));
			return [...n, ...r];
		},
		type: e.type,
		getAttributes: Dx
	});
	return new Bm({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.match.data?.markdown && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function Ax(e) {
	return new L({
		key: new R("handlePasteLink"),
		props: { handlePaste: (t, n, r) => {
			let { shouldAutoLink: i } = e, { state: a } = t, { selection: o } = a, { empty: s } = o;
			if (s) return !1;
			let c = "";
			r.content.forEach((e) => {
				c += e.textContent;
			});
			let l = ux(c, { defaultProtocol: e.defaultProtocol }).find((e) => e.isLink && e.value === c);
			return !c || !l || i !== void 0 && !i(l.value) ? !1 : e.editor.commands.setMark(e.type, { href: l.href });
		} }
	});
}
function jx(e, t) {
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
	}), !e || e.replace(hx, "").match(RegExp(`^(?:(?:${n.map((e) => e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`, "i"));
}
var Mx = zm.create({
	name: "link",
	priority: 1e3,
	keepOnSplit: !1,
	exitable: !0,
	onCreate() {
		this.options.validate && !this.options.shouldAutoLink && (this.options.shouldAutoLink = this.options.validate, console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")), this.options.protocols.forEach((e) => {
			typeof e == "string" ? sx(e) : sx(e.scheme, e.optionalSlashes);
		});
	},
	onDestroy() {
		ox();
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
			isAllowedUri: (e, t) => !!jx(e, t.protocols),
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
					defaultValidate: (e) => !!jx(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : null;
			}
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return this.options.isAllowedUri(e.href, {
			defaultValidate: (e) => !!jx(e, this.options.protocols),
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
					defaultValidate: (e) => !!jx(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? t().setMark(this.name, e).setMeta("preventAutolink", !0).run() : !1;
			},
			toggleLink: (e) => ({ chain: t }) => {
				let { href: n } = e || {};
				return n && !this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!jx(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : t().toggleMark(this.name, e, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run();
			},
			unsetLink: () => ({ chain: e }) => e().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
		};
	},
	addInputRules() {
		return this.options.markdownLinks ? [Ox({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!jx(e, this.options.protocols),
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
				ux(e).filter((e) => e.isLink && this.options.isAllowedUri(e.value, {
					defaultValidate: (e) => !!jx(e, n),
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
		return this.options.markdownLinks ? [kx({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!jx(e, this.options.protocols),
				protocols: this.options.protocols,
				defaultProtocol: this.options.defaultProtocol
			}),
			findPlainUrls: e
		})] : [_h({
			find: e,
			type: this.type,
			getAttributes: (e) => ({ href: e.data?.href })
		})];
	},
	addProseMirrorPlugins() {
		let e = [], { protocols: t, defaultProtocol: n } = this.options;
		return this.options.autolink && e.push(vx({
			type: this.type,
			defaultProtocol: this.options.defaultProtocol,
			validate: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!jx(e, t),
				protocols: t,
				defaultProtocol: n
			}),
			shouldAutoLink: this.options.shouldAutoLink
		})), e.push(yx({
			type: this.type,
			editor: this.editor,
			openOnClick: this.options.openOnClick === "whenNotEditable" || this.options.openOnClick,
			enableClickSelection: this.options.enableClickSelection
		})), this.options.linkOnPaste && e.push(Ax({
			editor: this.editor,
			defaultProtocol: this.options.defaultProtocol,
			type: this.type,
			shouldAutoLink: this.options.shouldAutoLink
		})), e;
	}
}), Nx = Mx, Px = "listItem", Fx = "textStyle", Ix = /^\s*([-+*])\s$/, Lx = hh.create({
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
		return { toggleBulletList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Px, this.editor.getAttributes(Fx)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-8": () => this.editor.commands.toggleBulletList() };
	},
	addInputRules() {
		let e = fh({
			find: Ix,
			type: this.type
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (e = fh({
			find: Ix,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: () => this.editor.getAttributes(Fx),
			editor: this.editor
		})), [e];
	}
}), Rx = (e, t, n) => {
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
}, zx = (e, t, n, r) => {
	let i = Rx(e, n, r);
	if (!i) return !1;
	let { selection: a } = e, { nestedList: o, nestedListPos: s, insertPos: c, items: l } = i, u = e.tr;
	u.delete(s, s + o.nodeSize);
	let d = u.mapping.map(c);
	return u.insert(d, A.from(l)), u.setSelection(a.map(u.doc, u.mapping)), t && t(u), !0;
}, Bx = (e, t, n) => zx(e.state, e.view.dispatch, t, n), Vx = (e, t) => Y.create({
	name: `${e}BranchingDeleteKeymap`,
	priority: 101,
	addKeyboardShortcuts() {
		let n = () => Bx(this.editor, e, t);
		return {
			Delete: n,
			"Mod-Delete": n
		};
	}
}), Hx = [
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
], Ux = "abcdefghijklmnopqrstuvwxyz", Wx = String.raw`\d+|[ivxlcdmIVXLCDM]+|${"[a-zA-Z]{1,2}"}`;
function Gx(e) {
	let t = e, n = "";
	for (let [e, r] of Hx) for (; t >= e;) n += r, t -= e;
	return n;
}
function Kx(e) {
	return Gx(e).toUpperCase();
}
function qx(e) {
	let t = e.toLowerCase(), n = 0, r = 0;
	for (; n < t.length;) {
		let e = !1;
		for (let [i, a] of Hx) if (t.startsWith(a, n)) {
			r += i, n += a.length, e = !0;
			break;
		}
		if (!e) return 0;
	}
	return r;
}
function Jx(e) {
	if (!/^[ivxlcdmIVXLCDM]+$/.test(e)) return !1;
	let t = qx(e);
	return t <= 0 ? !1 : (e === e.toLowerCase() ? Gx(t) : Kx(t)) === e;
}
function Yx(e) {
	let t = e.toLowerCase();
	if (t.length === 1) return t.charCodeAt(0) - 97 + 1;
	if (t.length === 2) {
		let e = t.charCodeAt(0) - 97, n = t.charCodeAt(1) - 97;
		return (e + 1) * 26 + n + 1;
	}
	return 0;
}
function Xx(e) {
	if (e <= 26) return Ux[e - 1];
	let t = Math.floor((e - 1) / 26) - 1, n = (e - 1) % 26;
	return t < 0 ? Ux[n] : Ux[t] + Ux[n];
}
function Zx(e) {
	if (e && !/^\d+$/.test(e)) {
		if (Jx(e)) return e === e.toLowerCase() ? "i" : "I";
		if (/^[a-z]{1,2}$/.test(e)) return "a";
		if (/^[A-Z]{1,2}$/.test(e)) return "A";
	}
}
function Qx(e) {
	if (/^\d+$/.test(e)) return parseInt(e, 10);
	let t = Zx(e);
	if (t === "i" || t === "I") return qx(e);
	if (t === "a" || t === "A") {
		let t = Yx(e);
		return t > 0 ? t : 1;
	}
	let n = parseInt(e, 10);
	return Number.isNaN(n) ? 1 : n;
}
function $x(e, t) {
	if (e === "numeric") return String(t);
	switch (e) {
		case "a": return Xx(t);
		case "A": return Xx(t).toUpperCase();
		case "i": return Gx(t);
		case "I": return Kx(t);
		default: return String(t);
	}
}
function eS(e) {
	if (e.length === 0) return !1;
	let t = Zx(e[0]) ?? "numeric", n = Qx(e[0]);
	if (n < 1) return !1;
	for (let r = 0; r < e.length; r++) {
		let i = $x(t, n + r);
		if (e[r] !== i) return !1;
	}
	return !0;
}
function tS(e) {
	return {
		type: Zx(e),
		start: Qx(e)
	};
}
function nS(e) {
	let { type: t, start: n } = tS(e), r = {};
	return t && (r.type = t), n !== 1 && (r.start = n), r;
}
function rS(e, t, n = ". ") {
	let r = t + 1;
	if (!e || e === "1") return `${r}${n}`;
	switch (e) {
		case "a": return `${Xx(r)}${n}`;
		case "A": return `${Xx(r).toUpperCase()}${n}`;
		case "i": return `${Gx(r)}${n}`;
		case "I": return `${Kx(r)}${n}`;
		default: return `${r}${n}`;
	}
}
function iS(e) {
	let t = e.tokens?.[0];
	return !!(e.text && e.tokens?.length === 1 && t?.type === "list" && t.ordered && t.raw === e.text);
}
function aS(e, t) {
	return t.tokenizeInline ? t.parseInline(t.tokenizeInline(e)) : t.parseInline([{
		type: "text",
		raw: e,
		text: e
	}]);
}
var oS = hh.create({
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
			if (iS(e)) return {
				type: "listItem",
				content: [{
					type: "paragraph",
					content: aS(e.text || "", t)
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
	renderMarkdown: (e, t, n) => Om(e, t, (e) => {
		if (e.parentType === "bulletList") return "- ";
		if (e.parentType === "orderedList") {
			var t, n;
			let r = ((t = e.meta) == null || (t = t.parentAttrs) == null ? void 0 : t.start) || 1;
			return rS((n = e.meta) == null || (n = n.parentAttrs) == null ? void 0 : n.type, r - 1 + (e.index || 0), ". ");
		}
		return "- ";
	}, n, { alignNestedToPrefix: n?.parentType === "orderedList" }),
	addExtensions() {
		return [Vx(this.name, [this.options.bulletListTypeName, this.options.orderedListTypeName])];
	},
	addKeyboardShortcuts() {
		return {
			Enter: () => this.editor.commands.splitListItem(this.name),
			Tab: () => this.editor.commands.sinkListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
	}
}), sS = (e, t) => {
	let { $from: n } = t.selection, r = G(e, t.schema), i = null, a = n.depth, o = n.pos, s = null;
	for (; a > 0 && s === null;) i = n.node(a), i.type === r ? s = a : (--a, --o);
	return s === null ? null : {
		$pos: t.doc.resolve(o),
		depth: s
	};
}, cS = (e, t) => {
	let n = sS(e, t);
	if (!n) return !1;
	let [, r] = Jf(t, e, n.$pos.pos + 4);
	return r;
}, lS = (e, t, n) => {
	let { $anchor: r } = e.selection, i = Math.max(0, r.pos - 2), a = e.doc.resolve(i).node();
	return !(!a || !n.includes(a.type.name));
}, uS = (e, t, n) => {
	if (e.commands.undoInputRule()) return !0;
	if (e.state.selection.from !== e.state.selection.to) return !1;
	if (!Wd(e.state, t) && lS(e.state, t, n)) {
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
	if (!Wd(e.state, t) || !np(e.state)) return !1;
	let { $from: r } = e.state.selection, i = r.depth - 1;
	return r.node(i).type !== e.schema.nodes[t] || r.index(i) !== 0 ? !1 : e.chain().liftListItem(t).run();
}, dS = (e, t) => {
	let n = cS(e, t), r = sS(e, t);
	return !r || !n ? !1 : n > r.depth;
}, fS = (e, t) => {
	let n = cS(e, t), r = sS(e, t);
	return !r || !n ? !1 : n < r.depth;
}, pS = (e, t) => {
	if (!Wd(e.state, t) || !tp(e.state, t)) return !1;
	let { selection: n } = e.state, { $from: r, $to: i } = n;
	return !n.empty && r.sameParent(i) ? !1 : dS(t, e.state) ? e.chain().focus(e.state.selection.from + 4).lift(t).joinBackward().run() : fS(t, e.state) ? e.chain().joinForward().joinBackward().run() : e.commands.joinItemForward();
}, mS = (e, t, n) => {
	let { state: r } = e, { selection: i } = r;
	if (!i.empty) return !1;
	let { $from: a } = i;
	if (a.parentOffset !== 0 || !a.parent.isTextblock || Wd(r, t)) return !1;
	let o = Yf(a);
	if (!o || !n.includes(o.type.name)) return !1;
	let s = o.lastChild;
	if (!s || s.type.name !== t) return !1;
	let c = a.parent;
	if (!s.canReplace(s.childCount, s.childCount, A.from(c))) return !1;
	let l = a.before(), u = a.after(), d = l - 2;
	return e.commands.command(({ tr: e, dispatch: t }) => (t && (e.delete(l, u).insert(d, A.from(c)), e.setSelection(F.create(e.doc, d + 1)), e.scrollIntoView()), !0));
}, hS = Y.create({
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
					e.state.schema.nodes[n] !== void 0 && pS(e, n) && (t = !0);
				}), t;
			},
			"Mod-Delete": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && pS(e, n) && (t = !0);
				}), t;
			},
			Backspace: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && uS(e, n, r) && (t = !0);
				}), t;
			},
			"Mod-Backspace": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && uS(e, n, r) && (t = !0);
				}), t;
			},
			Tab: ({ editor: e }) => {
				for (let { itemName: t, wrapperNames: n } of this.options.listTypes) if (e.state.schema.nodes[t] !== void 0 && mS(e, t, n)) return !0;
				return !1;
			}
		};
	}
}), gS = RegExp(`^(\\s*)(${Wx})([.)])\\s+(.*)$`), _S = /^\s/, vS = {
	heading: /^#{1,6}(?:\s|$)/,
	bulletItem: /^[-+*]\s+/,
	codeFence: /^(?:```|~~~)/,
	blockMath: /^\$\$/,
	thematicBreak: /^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/
};
function yS(e) {
	return gS.test(e.trimStart());
}
function bS(e) {
	let t = e.trimStart();
	return vS.bulletItem.test(t) || yS(t) || vS.heading.test(t) || vS.thematicBreak.test(t) && !t.startsWith("-") || /^>\s?/.test(t) || vS.codeFence.test(t) || vS.blockMath.test(t);
}
function xS(e) {
	return Object.values(vS).some((t) => t.test(e));
}
function SS(e) {
	let t = [], n = [], r = !1;
	return e.forEach((e) => {
		r ? n.push(e) : e.trim() === "" || t.length > 0 && bS(e) ? (r = !0, n.push(e)) : t.push(e);
	}), {
		paragraphLines: t,
		blockLines: n
	};
}
function CS(e) {
	let t = [], n = 0, r = 0;
	for (; n < e.length;) {
		let i = e[n], a = i.match(gS);
		if (!a) break;
		let [, o, s, c, l] = a, u = o.length, d = parseInt(s, 10), f = isNaN(d) ? Zx(s) : void 0, p = isNaN(d) ? Qx(s) : d, m = [l], h = n + 1, g = [i], _ = !1;
		for (; h < e.length;) {
			let t = e[h];
			if (t.match(gS)) break;
			if (t.trim() === "") g.push(t), m.push(""), _ = !0, h += 1;
			else if (t.match(_S)) {
				let e = t.length - t.trimStart().length, n = u + s.length + 1;
				g.push(t), m.push(t.slice(Math.min(e, n))), h += 1;
			} else {
				if (_ || xS(t)) break;
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
var wS = RegExp(`^(${Wx})([.)])\\s+(.+)$`);
function TS(e) {
	let t = e.split("\n").filter((e) => e.trim().length > 0);
	if (t.length === 0) return null;
	let n = [];
	for (let e of t) {
		let t = e.trim().match(wS);
		if (!t) return null;
		n.push({
			marker: t[1],
			content: t[3]
		});
	}
	return eS(n.map((e) => e.marker)) ? {
		type: "orderedList",
		attrs: nS(n[0].marker),
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
function ES(e, t, n) {
	let r = [], i = 0;
	for (; i < e.length;) {
		let a = e[i];
		if (a.indent === t) {
			let { paragraphLines: o, blockLines: s } = SS(a.contentLines), c = o.join("\n").trim(), l = [];
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
				let e = ES(f, Math.min(...f.map((e) => e.indent)), n);
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
function DS(e, t) {
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
var OS = 64;
function kS(e, t) {
	let n = [], r = 0;
	for (; n.length < t;) {
		let t = e.indexOf("\n", r);
		if (t === -1) return n.push(e.slice(r)), n;
		n.push(e.slice(r, t)), r = t + 1;
	}
	return n;
}
function AS(e) {
	let t = e.indexOf("\n"), n = t === -1 ? e : e.slice(0, t);
	if (!gS.test(n)) return [
		[],
		0,
		[]
	];
	let r = OS, i = kS(e, r), a = CS(i);
	for (; a[1] === i.length && i.length === r;) r *= 2, i = kS(e, r), a = CS(i);
	return [
		a[0],
		a[1],
		i
	];
}
var jS = "listItem", MS = "textStyle", NS = /^(\d+)\.\s$/;
function PS(e) {
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
var FS = hh.create({
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
						let e = PS(n);
						if (e) return e;
					}
					let r = e.querySelector("li");
					if (r) {
						let e = r.getAttribute("style");
						if (e) {
							let t = PS(e);
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
		let n = e.start || 1, r = e.typeMarker, i = e.items ? DS(e.items, t) : [], a = {};
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
			let [r, i, a] = AS(e);
			if (r.length === 0) return;
			let o = ES(r, r[0].indent, n);
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
		return { toggleOrderedList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(jS, this.editor.getAttributes(MS)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-7": () => this.editor.commands.toggleOrderedList() };
	},
	addProseMirrorPlugins() {
		return [new L({ props: { handlePaste: (e, t) => {
			if ((t.clipboardData?.getData("text/html"))?.trim()) return !1;
			let n = t.clipboardData?.getData("text/plain");
			if (!n) return !1;
			let r = TS(n);
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
		let e = (e, t) => (!t.attrs.type || t.attrs.type === "1") && t.childCount + t.attrs.start === +e[1], t = fh({
			find: NS,
			type: this.type,
			getAttributes: (e) => ({ start: +e[1] }),
			joinPredicate: e
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (t = fh({
			find: NS,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: (e) => ({
				start: +e[1],
				...this.editor.getAttributes(MS)
			}),
			joinPredicate: e,
			editor: this.editor
		})), [t];
	}
}), IS = /^\s*(\[([( |x])?\])\s$/, LS = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0", RS = (e, t, n) => {
	var r;
	return (n == null || (r = n.checkboxLabel) == null ? void 0 : r.call(n, e, t)) || `Task item checkbox for ${e.textContent || "empty task item"}`;
}, zS = hh.create({
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
	renderMarkdown: (e, t) => Om(e, t, `- [${e.attrs?.checked ? "x" : " "}] `),
	addExtensions() {
		return this.options.nested ? [Vx(this.name, [this.options.taskListTypeName])] : [];
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
			o.style.cssText = LS;
			let l = (e) => {
				let t = RS(e, e.attrs.checked, this.options.a11y);
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
					let t = r.extensionManager.attributes, n = Af(e, t), a = new Set(Object.keys(n)), o = this.options.HTMLAttributes;
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
		return [fh({
			find: IS,
			type: this.type,
			getAttributes: (e) => ({ checked: e[e.length - 1] === "x" })
		})];
	}
}), BS = hh.create({
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
				let t = Tm(e, {
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
			}, i = Tm(e, {
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
		return this.options.bulletList !== !1 && e.push(Lx.configure(this.options.bulletList)), this.options.listItem !== !1 && e.push(oS.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(hS.configure(this.options.listKeymap)), this.options.orderedList !== !1 && e.push(FS.configure(this.options.orderedList)), this.options.taskItem !== !1 && e.push(zS.configure(this.options.taskItem)), this.options.taskList !== !1 && e.push(BS.configure(this.options.taskList)), e;
	}
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/@tiptap/extension-paragraph/dist/index.js
var VS = "&nbsp;", HS = "\xA0", US = hh.create({
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
		return n.length === 1 && n[0].type === "text" && (n[0].raw === VS || n[0].text === VS || n[0].raw === HS || n[0].text === HS) && r.length === 1 && r[0].type === "text" && (r[0].text === VS || r[0].text === HS) ? t.createNode("paragraph", void 0, []) : t.createNode("paragraph", void 0, r);
	},
	renderMarkdown: (e, t, n) => {
		if (!e) return "";
		let r = Array.isArray(e.content) ? e.content : [];
		if (r.length === 0) {
			var i, a;
			let e = Array.isArray(n == null || (i = n.previousNode) == null ? void 0 : i.content) ? n.previousNode.content : [];
			return (n == null || (a = n.previousNode) == null ? void 0 : a.type) === "paragraph" && e.length === 0 ? VS : "";
		}
		return t.renderChildren(r);
	},
	addCommands() {
		return { setParagraph: () => ({ commands: e }) => e.setNode(this.name) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
	}
}), WS = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, GS = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, KS = zm.create({
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
		return [lh({
			find: WS,
			type: this.type
		})];
	},
	addPasteRules() {
		return [_h({
			find: GS,
			type: this.type
		})];
	}
}), qS = hh.create({
	name: "text",
	group: "inline",
	parseMarkdown: (e) => ({
		type: "text",
		text: e.text || ""
	}),
	renderMarkdown: (e) => e.text || ""
}), JS = zm.create({
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
function YS(e = {}) {
	return new L({ view(t) {
		return new XS(t, e);
	} });
}
var XS = class {
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
			let e = ni(this.editorView.state.doc, a, this.editorView.dragging.slice);
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
}, ZS = class e extends P {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : P.near(r);
	}
	content() {
		return M.empty;
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
		return new QS(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !eC(e) || !tC(e)) return !1;
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
					if (a.isAtom && !a.isText && !I.isSelectable(a)) {
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
ZS.prototype.visible = !1, ZS.findFrom = ZS.findGapCursorFrom, P.jsonID("gapcursor", ZS);
var QS = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return ZS.valid(t) ? new ZS(t) : P.near(t);
	}
};
function $S(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function eC(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || $S(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function tC(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || $S(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function nC() {
	return new L({ props: {
		decorations: sC,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && ZS.valid(n) ? new ZS(n) : null;
		},
		handleClick: aC,
		handleKeyDown: rC,
		handleDOMEvents: { beforeinput: oC }
	} });
}
var rC = _u({
	ArrowLeft: iC("horiz", -1),
	ArrowRight: iC("horiz", 1),
	ArrowUp: iC("vert", -1),
	ArrowDown: iC("vert", 1)
});
function iC(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof F) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = ZS.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new ZS(c))), !0) : !1;
	};
}
function aC(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!ZS.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && I.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new ZS(r))), !0);
}
function oC(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof ZS)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = A.empty;
	for (let e = r.length - 1; e >= 0; e--) i = A.from(r[e].createAndFill(null, i));
	let a = e.state.tr.replace(n.pos, n.pos, new M(i, 0, 0));
	return a.setSelection(F.near(a.doc.resolve(n.pos + 1))), e.dispatch(a), !1;
}
function sC(e) {
	if (!(e.selection instanceof ZS)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", U.create(e.doc, [ml.widget(e.selection.head, t, { key: "gapcursor" })]);
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
		return [new L({
			key: new R("characterCount"),
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
var cC = Y.create({
	name: "dropCursor",
	addOptions() {
		return {
			color: "currentColor",
			width: 1,
			class: void 0
		};
	},
	addProseMirrorPlugins() {
		return [YS(this.options)];
	}
}), lC = Y.create({
	name: "focus",
	addOptions() {
		return {
			className: "has-focus",
			mode: "all"
		};
	},
	addProseMirrorPlugins() {
		return [new L({
			key: new R("focus"),
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
					a.push(ml.node(t, t + e.nodeSize, { class: this.options.className }));
				}), U.create(e, a);
			} }
		})];
	}
}), uC = Y.create({
	name: "gapCursor",
	addProseMirrorPlugins() {
		return [nC()];
	},
	extendNodeSchema(e) {
		return { allowGapCursor: q(K(e, "allowGapCursor", {
			name: e.name,
			options: e.options,
			storage: e.storage
		})) ?? null };
	}
}), dC = "placeholder", fC = new R("tiptap__placeholder");
function pC(e) {
	let { editor: t, placeholder: n, dataAttribute: r, pos: i, node: a, isEmptyDoc: o, hasAnchor: s, classes: { emptyNode: c, emptyEditor: l } } = e, u = [c];
	return o && u.push(l), ml.node(i, i + a.nodeSize, {
		class: u.join(" "),
		[r]: typeof n == "function" ? n({
			editor: t,
			node: a,
			pos: i,
			hasAnchor: s
		}) : n
	});
}
function mC(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function hC({ editor: e, options: t, dataAttribute: n, doc: r, selection: i, from: a, to: o }) {
	let { anchor: s } = i, c = [], l = e.isEmpty;
	return r.nodesBetween(a, o, (r, i) => {
		let a = s >= i && s <= i + r.nodeSize, o = !r.isLeaf && ap(r);
		return r.type.isTextblock && (a || !t.showOnlyCurrent) && o && c.push(pC({
			editor: e,
			isEmptyDoc: l,
			dataAttribute: n,
			hasAnchor: a,
			placeholder: t.placeholder,
			classes: {
				emptyEditor: t.emptyEditorClass,
				emptyNode: mC(t.emptyNodeClass, {
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
function gC({ editor: e, options: t, dataAttribute: n, doc: r, selection: i }) {
	if (!e.isEditable && t.showOnlyWhenEditable) return null;
	let { anchor: a } = i, o = [], s = e.isEmpty;
	if (t.showOnlyCurrent && !t.includeChildren) {
		let i = r.resolve(a), c = i.depth > 0 ? i.node(1) : i.nodeAfter, l = i.depth > 0 ? i.before(1) : a;
		if (c && c.type.isTextblock && ap(c)) {
			let r = a >= l && a <= l + c.nodeSize;
			o.push(pC({
				editor: e,
				isEmptyDoc: s,
				dataAttribute: n,
				hasAnchor: r,
				placeholder: t.placeholder,
				classes: {
					emptyEditor: t.emptyEditorClass,
					emptyNode: mC(t.emptyNodeClass, {
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
	} else o.push(...hC({
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
function _C(e, t) {
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
function vC(e, t) {
	return {
		from: Math.max(0, t.from - 1),
		to: Math.min(e.content.size, t.to - 1)
	};
}
function yC(e, t, n) {
	let r = [];
	return e.forEach((e, i) => {
		let a = i, o = a + e.nodeSize, s = a + 1, c = o + 1;
		s < n && c > t && r.push({
			from: a,
			to: o
		});
	}), r;
}
function bC(e) {
	if (e.length === 0) return [];
	let t = [...e].sort((e, t) => e.from - t.from), n = [{ ...t[0] }];
	for (let e = 1; e < t.length; e += 1) {
		let r = n[n.length - 1], i = t[e];
		i.from <= r.to ? r.to = Math.max(r.to, i.to) : n.push({ ...i });
	}
	return n;
}
function xC(e, t) {
	let n = yC(e, t.from, t.to);
	return n.push(vC(e, _C(e, t.from))), t.to > t.from ? n.push(vC(e, _C(e, Math.min(t.to, e.content.size + 1) - 1))) : t.from < e.content.size + 1 && n.push(vC(e, _C(e, Math.min(t.from + 1, e.content.size)))), n;
}
function SC(e, t, n) {
	let r = [];
	if (e.docChanged) {
		let t = Kf(e);
		for (let e of t) r.push(...xC(n.doc, e.newRange));
	}
	return e.selectionSet && (r.push(vC(n.doc, _C(n.doc, e.mapping.map(t.selection.anchor)))), r.push(vC(n.doc, _C(n.doc, n.selection.anchor)))), bC(r);
}
function CC(e, t, n) {
	let r = Math.max(0, Math.min(e, n.content.size));
	return {
		from: r,
		to: Math.max(r, Math.min(t, n.content.size))
	};
}
function wC({ decorations: e, ranges: t, editor: n, options: r, dataAttribute: i, doc: a, selection: o }) {
	let s = e;
	for (let e of t) {
		let { from: t, to: c } = CC(e.from, e.to, a), l = s.find(t, c).filter((e) => e.from >= t && e.to <= c);
		l.length && (s = s.remove(l));
		let u = hC({
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
function TC({ editor: e, options: t, dataAttribute: n }) {
	return {
		init(r, i) {
			return gC({
				editor: e,
				options: t,
				dataAttribute: n,
				doc: i.doc,
				selection: i.selection
			}) ?? U.empty;
		},
		apply(r, i, a, o) {
			return !r.docChanged && !r.selectionSet ? i : wC({
				decorations: i.map(r.mapping, r.doc),
				ranges: SC(r, a, o),
				editor: e,
				options: t,
				dataAttribute: n,
				doc: o.doc,
				selection: o.selection
			});
		}
	};
}
function EC(e) {
	return e.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
function DC({ editor: e, options: t }) {
	let n = t.dataAttribute ? `data-${EC(t.dataAttribute)}` : `data-${dC}`, r = t.showOnlyCurrent && !t.includeChildren;
	return new L({
		key: fC,
		...r ? {} : { state: TC({
			editor: e,
			options: t,
			dataAttribute: n
		}) },
		props: { decorations: r ? ({ doc: r, selection: i }) => gC({
			editor: e,
			options: t,
			dataAttribute: n,
			doc: r,
			selection: i
		}) : (n) => t.showOnlyWhenEditable && !e.isEditable ? U.empty : fC.getState(n) ?? U.empty }
	});
}
var OC = Y.create({
	name: "placeholder",
	addOptions() {
		return {
			emptyEditorClass: "is-editor-empty",
			emptyNodeClass: "is-empty",
			dataAttribute: dC,
			placeholder: "Write something …",
			showOnlyWhenEditable: !0,
			showOnlyCurrent: !0,
			includeChildren: !1
		};
	},
	addProseMirrorPlugins() {
		return [DC({
			editor: this.editor,
			options: this.options
		})];
	}
});
function kC(e, t) {
	return !e.selection.empty && !op(e.selection) && t.isEditable;
}
function AC(e, t) {
	return kC(e, t) && !t.isFocused && !t.view.dragging;
}
function jC() {
	var e;
	(e = window.getSelection()) == null || e.removeAllRanges();
}
function MC(e) {
	e.focus();
}
Y.create({
	name: "selection",
	addOptions() {
		return { className: "selection" };
	},
	addProseMirrorPlugins() {
		let { editor: e, options: t } = this;
		return [new L({
			key: new R("selection"),
			props: {
				decorations(n) {
					return AC(n, e) ? U.create(n.doc, [ml.inline(n.selection.from, n.selection.to, { class: t.className })]) : null;
				},
				handleDOMEvents: {
					blur(t) {
						return kC(t.state, e) && jC(), !1;
					},
					focus(t) {
						return kC(t.state, e) && requestAnimationFrame(() => {
							!e.isDestroyed && t.hasFocus() && MC(t);
						}), !1;
					}
				}
			}
		})];
	}
});
function NC({ types: e, node: t }) {
	return t && Array.isArray(e) && e.includes(t.type) || t?.type === e;
}
var PC = Y.create({
	name: "trailingNode",
	addOptions() {
		return {
			node: void 0,
			notAfter: []
		};
	},
	addProseMirrorPlugins() {
		let e = new R(this.name), t = this.options.node || this.editor.schema.topNodeType.contentMatch.defaultType?.name || "paragraph", n = Object.entries(this.editor.schema.nodes).map(([, e]) => e).filter((e) => (this.options.notAfter || []).concat(t).includes(e.name));
		return [new L({
			key: e,
			appendTransaction: (n, r, i) => {
				let { doc: a, tr: o, schema: s } = i, c = e.getState(i), l = a.content.size, u = s.nodes[t];
				if (!n.some((e) => e.getMeta("skipTrailingNode")) && c) return o.insert(l, u.create());
			},
			state: {
				init: (e, t) => {
					let r = t.tr.doc.lastChild;
					return !NC({
						node: r,
						types: n
					});
				},
				apply: (e, t) => {
					if (!e.docChanged || e.getMeta("__uniqueIDTransaction")) return t;
					let r = e.doc.lastChild;
					return !NC({
						node: r,
						types: n
					});
				}
			}
		})];
	}
}), FC = Y.create({
	name: "undoRedo",
	addOptions() {
		return {
			depth: 100,
			newGroupDelay: 500
		};
	},
	addCommands() {
		return {
			undo: () => ({ state: e, dispatch: t }) => Bu(e, t),
			redo: () => ({ state: e, dispatch: t }) => Vu(e, t)
		};
	},
	addProseMirrorPlugins() {
		return [Ru(this.options)];
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
}), IC = Y.create({
	name: "starterKit",
	addExtensions() {
		let e = [];
		return this.options.bold !== !1 && e.push(Gv.configure(this.options.bold)), this.options.blockquote !== !1 && e.push(Bv.configure(this.options.blockquote)), this.options.bulletList !== !1 && e.push(Lx.configure(this.options.bulletList)), this.options.code !== !1 && e.push(Yv.configure(this.options.code)), this.options.codeBlock !== !1 && e.push($v.configure(this.options.codeBlock)), this.options.document !== !1 && e.push(ey.configure(this.options.document)), this.options.dropcursor !== !1 && e.push(cC.configure(this.options.dropcursor)), this.options.gapcursor !== !1 && e.push(uC.configure(this.options.gapcursor)), this.options.hardBreak !== !1 && e.push(ty.configure(this.options.hardBreak)), this.options.heading !== !1 && e.push(ny.configure(this.options.heading)), this.options.undoRedo !== !1 && e.push(FC.configure(this.options.undoRedo)), this.options.horizontalRule !== !1 && e.push(ry.configure(this.options.horizontalRule)), this.options.italic !== !1 && e.push(cy.configure(this.options.italic)), this.options.listItem !== !1 && e.push(oS.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(hS.configure(this.options?.listKeymap)), this.options.link !== !1 && e.push(Mx.configure(this.options?.link)), this.options.orderedList !== !1 && e.push(FS.configure(this.options.orderedList)), this.options.paragraph !== !1 && e.push(US.configure(this.options.paragraph)), this.options.strike !== !1 && e.push(KS.configure(this.options.strike)), this.options.text !== !1 && e.push(qS.configure(this.options.text)), this.options.underline !== !1 && e.push(JS.configure(this.options?.underline)), this.options.trailingNode !== !1 && e.push(PC.configure(this.options?.trailingNode)), e;
	}
}), LC = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/, RC = hh.create({
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
			let p = new mh({
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
					let t = Af(e, c.extensionManager.attributes.filter((t) => t.type === e.type.name));
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
		return [uh({
			find: LC,
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
function zC({ getButtonElement: e, getPos: t, dragState: n, getIsPlaceholder: r, getNodeAttrs: i, handleInteraction: a }) {
	let o = bt();
	function s() {
		n.isDragging = !0, Tt("start", {}, t), n.preview = kt(n.startTarget, n.startPos.x, n.startPos.y, r());
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
		wt();
		let t = Oe(e);
		l(e.currentTarget, t.x, t.y);
	}
	function d(e) {
		if (e.touches.length !== 1) {
			c();
			return;
		}
		let r = Oe(e);
		!n.isDragging && n.longPressTimeout && Dt(r.x, r.y, n.startPos.x, n.startPos.y, 10) ? c() : n.isDragging && (e.preventDefault(), Ct(n.preview, r.x, r.y), Ot(r.x, r.y), Tt("move", {
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
		let r = Oe(e), o = document.elementFromPoint(r.x, r.y);
		if (o) {
			let e = o.closest(".drop-zone-indicator")?.getAttribute("data-drop-pos"), n = i();
			Tt("end", {
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
		n.isDragging = !1, Et(n.preview), n.preview = null;
	}
	ie(() => {
		let t = e();
		if (o && t) return t.addEventListener("touchstart", u, { passive: !1 }), t.addEventListener("touchmove", d, { passive: !1 }), t.addEventListener("touchend", f, { passive: !1 }), () => {
			t.removeEventListener("touchstart", u), t.removeEventListener("touchmove", d), t.removeEventListener("touchend", f), c(), Et(n.preview), n.preview = null;
		};
	});
	function p() {
		c(), Et(n.preview);
	}
	return { cleanup: p };
}
// D:/ドキュメント/GitHub/ehagaki/src/components/SvelteImageNode.svelte
var BC = le("<img draggable=\"false\"/>"), VC = le("<div class=\"image-node-container svelte-xptkcy\"><button type=\"button\" tabindex=\"0\"><!> <!></button> <!></div>"), HC = {
	hash: "svelte-xptkcy",
	code: "\n    /* ProseMirrorが生成する外側のラッパーも制御 */.node-image {display:block;width:fit-content;max-width:100%;max-height:240px;line-height:0;margin:10px 0;}\n\n    /* NodeViewWrapperが生成するdata-node-view-wrapperを縦並び用に調整 */.node-image[data-node-view-wrapper] {display:block;margin:0;padding:0;}\n\n    /* 画像ノードコンテナ */.image-node-container.svelte-xptkcy {position:relative;display:inline-block;max-width:100%;max-height:240px;\n\n        /* ボタンを画像サイズに完全に合わせる */button.editor-image-button:where(.svelte-xptkcy) {background:none;border:none;padding:0;margin:0;cursor:grab;display:inline;position:relative;touch-action:pan-y; /* 垂直スクロールを許可し、水平ドラッグはJavaScriptで制御 */-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;max-width:100%;max-height:240px;line-height:0;vertical-align:top;pointer-events:auto;outline:none;-webkit-tap-highlight-color:transparent;&:focus {outline:none;}&:active {scale:1;}\n            @media (hover: hover) and (pointer: fine) {&:hover {background:none;}\n            }}}\n\n    /* Focus extensionが付与するクラスで選択状態を表現 */.node-image.is-node-focused .editor-image {outline:2px solid var(--theme, #2196f3);outline-offset:-1px;}\n\n    /* ドラッグ状態での追加スタイル */.editor-image-button[data-dragging=\"true\"].svelte-xptkcy .editor-image:where(.svelte-xptkcy) {opacity:0.3;scale:0.95;transition:all 0.2s ease;}\n\n    /* 画像要素 */img.editor-image.svelte-xptkcy {display:block;max-width:100%;max-height:240px;min-width:100px;min-height:100px;object-fit:cover;width:auto;border:1px solid var(--border);border-radius:6px;cursor:pointer;outline:none;transition:opacity 0.2s ease;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;&.image-loading {opacity:0;transition:opacity 0.3s ease;}&:not(.image-loading) {opacity:1;}}\n\n    /* プレースホルダー状態のボタン */.editor-image-button.is-placeholder.svelte-xptkcy {display:flex;align-items:center;justify-content:center;min-width:100px;min-height:100px;max-width:100%;border:1px solid var(--border);border-radius:6px;background:var(--bg-input);cursor:default;}\n\n    /* 画像読み込み中（プレースホルダー表示中）はレイアウトに影響させない */.editor-image-button.is-placeholder.svelte-xptkcy img.editor-image.image-loading:where(.svelte-xptkcy) {position:absolute;opacity:0;}\n\n    /* タッチデバイス用 */\n    @media (hover: none) {.editor-image-button.svelte-xptkcy {cursor:default;}.editor-image-button.svelte-xptkcy:active {cursor:default;}\n    }\n\n    /* 改善されたドロップゾーンスタイル（シンプルなバーのみ） */.drop-zone-indicator {min-height:0;margin:0;border-radius:3px;opacity:1;position:relative;z-index:1000;cursor:pointer;display:flex;align-items:center;justify-content:center;width:100%;height:fit-content;padding:10px 0;background:none;border:none;box-shadow:none;}.drop-zone-bar {width:90%;max-width:260px;height:6px;border-radius:9999px;background:dodgerblue;margin:0 auto;}.drop-zone-hover .drop-zone-bar {background:var(--yellow);outline:2px solid var(--yellow);}\n\n    /* ドラッグプレビュー用のクラス */.drag-preview {position:fixed;pointer-events:none;z-index:9999;transform-origin:center center;transition:transform 120ms ease,\n            opacity 120ms ease;border-radius:6px;box-shadow:0 4px 16px rgba(0, 0, 0, 0.12);background:white;}"
};
function UC(n, o) {
	r(o, !0), re(n, HC);
	let c = () => de(we, "$_", l), [l, u] = se(), d = nT, p = rT, m = ve(void 0), v = Bg(), y = bt(), b = g(() => At(o.node.attrs)), S = g(() => !O(b) && !!o.node.attrs.src), E = g(() => O(b) || O(S) && !v.isLoaded), D = ve(null), te = g(() => o.node.attrs.alt ? o.node.attrs.alt : c()("imageNode.default_alt")), ne = g(() => O(D)?.displayWidth ?? 240), oe = g(() => O(D)?.displayHeight ?? 160);
	ie(() => {
		let e = o.node.attrs.src;
		if (!e) return;
		let t = Fe.value[e];
		if (t) {
			x(D, t, !0);
			return;
		}
		let n = St(o.node.attrs.dim);
		if (n) {
			let t = jt(n.width, n.height);
			x(D, t, !0), Fe.update((n) => ({
				...n,
				[e]: t
			}));
		}
	});
	function ce(e, t = !1) {
		xt(e, t, d.isDragging, O(b), o.selected, p.justSelected, o.node.attrs.src, O(te), o.node.attrs.id, o.getPos) && !o.selected && (p.justSelectedTimeout && clearTimeout(p.justSelectedTimeout), p.justSelected = !0, p.justSelectedTimeout = setTimeout(() => {
			p.justSelected = !1, p.justSelectedTimeout = null;
		}, 400));
	}
	let { cleanup: le } = zC({
		getButtonElement: () => O(m),
		getPos: () => o.getPos(),
		dragState: d,
		getIsPlaceholder: () => O(b),
		getNodeAttrs: () => o.node.attrs,
		handleInteraction: ce
	});
	function ue(e) {
		ce(e, !1);
	}
	function fe(e, t) {
		if (e === "start") {
			let e = t;
			if (!e?.dataTransfer && !y) return;
			if (y) {
				t?.preventDefault();
				return;
			}
			e?.dataTransfer && (e.dataTransfer.setData("application/x-tiptap-node", JSON.stringify({
				type: "image",
				attrs: o.node.attrs,
				pos: o.getPos()
			})), e.dataTransfer.effectAllowed = "move"), d.isDragging = !0, Tt("start");
		} else d.isDragging = !1, Et(d.preview), Tt("end");
	}
	function he(e) {
		e.preventDefault();
	}
	pe(() => {
		le(), p.justSelectedTimeout && clearTimeout(p.justSelectedTimeout), Object.assign(nT, {
			isDragging: !1,
			longPressTimeout: null,
			startTarget: null,
			preview: null
		}), Object.assign(rT, {
			justSelected: !1,
			justSelectedTimeout: null
		});
	}), Pg(n, {
		children: (n, r) => {
			var a = VC(), l = ee(a);
			let u;
			var p = ee(l), b = (e) => {
				{
					let t = g(() => c()("imageNode.uploading"));
					Te(e, {
						get text() {
							return O(t);
						},
						showLoader: !0
					});
				}
			};
			t(p, (e) => {
				O(E) && e(b);
			});
			var D = ae(p, 2), re = (t) => {
				var n = BC();
				let r;
				w(() => {
					C(n, "src", o.node?.attrs?.src), C(n, "alt", O(te)), r = i(n, 1, "editor-image svelte-xptkcy", null, r, { "image-loading": !v.isLoaded });
				}), e("load", n, function(...e) {
					v.handleLoad?.apply(this, e);
				}), e("error", n, function(...e) {
					v.handleError?.apply(this, e);
				}), h("contextmenu", n, he), me(n), s(t, n);
			};
			t(D, (e) => {
				O(S) && e(re);
			}), f(l), T(l, (e) => x(m, e), () => O(m));
			var ie = ae(l, 2), se = (e) => {
				{
					let t = g(() => c()("imageContextMenu.delete")), n = g(() => c()("imageContextMenu.copyUrl")), r = g(() => c()("imageContextMenu.copySuccess"));
					zg(e, {
						get src() {
							return o.node.attrs.src;
						},
						get onDelete() {
							return o.deleteNode;
						},
						get deleteAriaLabel() {
							return O(t);
						},
						get copyAriaLabel() {
							return O(n);
						},
						get copySuccessMessage() {
							return O(r);
						},
						layout: "editor-image"
					});
				}
			};
			t(ie, (e) => {
				O(E) || e(se);
			}), f(a), w(() => {
				u = i(l, 1, "editor-image-button svelte-xptkcy", null, u, { "is-placeholder": O(E) }), _(l, O(E) ? `width: ${O(ne)}px; aspect-ratio: ${O(ne)} / ${O(oe)};` : void 0), C(l, "data-dragging", d.isDragging), C(l, "aria-label", O(te)), C(l, "draggable", !y);
			}), h("click", l, ue), e("dragstart", l, (e) => fe("start", e)), e("dragend", l, () => fe("end")), e("dragover", l, function(...e) {
				(y ? (e) => e.preventDefault() : void 0)?.apply(this, e);
			}), e("drop", l, function(...e) {
				(y ? (e) => e.preventDefault() : void 0)?.apply(this, e);
			}), s(n, a);
		},
		$$slots: { default: !0 }
	}), a(), u();
}
b(["click", "contextmenu"]);
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/uniqueIdExtension.ts
function WC() {
	if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
	if (globalThis.crypto?.getRandomValues) {
		let e = globalThis.crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
		e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
		let t = [...e].map((e) => e.toString(16).padStart(2, "0"));
		return `${t.slice(0, 4).join("")}-${t.slice(4, 6).join("")}-${t.slice(6, 8).join("")}-${t.slice(8, 10).join("")}-${t.slice(10).join("")}`;
	}
	return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function GC(e, t) {
	if (e !== "all") return e;
	let { nodeExtensions: n } = wf(t);
	return n.map((e) => e.name).filter((e) => e !== "doc" && e !== "text");
}
function KC(e) {
	return e == null || e === "";
}
var qC = Y.create({
	name: "uniqueID",
	priority: 1e4,
	addOptions() {
		return {
			attributeName: "id",
			types: [],
			generateID: () => WC(),
			filterTransaction: null,
			updateDocument: !0
		};
	},
	addGlobalAttributes() {
		return [{
			types: GC(this.options.types, this.extensions),
			attributes: { [this.options.attributeName]: {
				default: null,
				parseHTML: (e) => e.getAttribute(`data-${this.options.attributeName}`),
				renderHTML: (e) => {
					let t = e[this.options.attributeName];
					return KC(t) ? {} : { [`data-${this.options.attributeName}`]: t };
				}
			} }
		}];
	},
	onCreate() {
		if (!this.options.updateDocument) return;
		let { state: e, view: t } = this.editor, n = GC(this.options.types, this.editor.extensionManager.extensions), { attributeName: r, generateID: i } = this.options, a = /* @__PURE__ */ new Set(), o = e.tr;
		uf(e.doc, (e) => n.includes(e.type.name)).forEach(({ node: e, pos: t }) => {
			let n = e.attrs[r];
			if (KC(n) || a.has(n)) {
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
		let e = GC(this.options.types, this.editor.extensionManager.extensions);
		return [new L({
			key: new R("uniqueID"),
			appendTransaction: (t, n, r) => {
				let i = t.some((e) => e.docChanged), a = t.some((e) => e.getMeta("__uniqueIDTransaction")), o = this.options.filterTransaction ? t.some((e) => !this.options.filterTransaction?.(e)) : !1;
				if (!i || a || o || n.doc.eq(r.doc)) return;
				let { attributeName: s, generateID: c } = this.options, l = /* @__PURE__ */ new Set(), u = r.tr;
				if (uf(r.doc, (t) => e.includes(t.type.name)).forEach(({ node: e, pos: t }) => {
					let n = u.doc.nodeAt(t)?.attrs[s];
					if (KC(n) || l.has(n)) {
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
}), JC = new R("editorInputGuard"), YC = Y.create({
	name: "editorInputGuard",
	addOptions: () => ({
		isInputBlocked: () => !1,
		compositionController: void 0,
		isCompositionInputAllowed: () => !1
	}),
	addProseMirrorPlugins() {
		let e = this.options.compositionController;
		return [new L({
			key: JC,
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
						observerState: JC.getState(n) ?? { idsByGeneration: /* @__PURE__ */ new Map() }
					});
					if (r !== "default") return r === "allow";
				}
				return !!(this.options.isCompositionInputAllowed?.() && t.getMeta("composition") !== void 0);
			}
		})];
	}
});
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/imeCompositionKey.ts
function XC(e, t) {
	return e.isComposing || e.keyCode === 229 || !!t?.composing;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/reactionInput.ts
var ZC = new R("reactionInput");
function QC(e) {
	return ZC.getState(e.state) === !0;
}
var $C = Y.create({
	name: "reactionInput",
	addOptions: () => ({
		isActive: () => !1,
		getInputMode: () => "singleValue"
	}),
	addProseMirrorPlugins() {
		let e = null, t;
		return [new L({
			key: ZC,
			state: {
				init: () => !1,
				apply: (e, t) => e.getMeta(ZC)?.composing ?? t
			},
			filterTransaction: (e, t) => !e.docChanged || !this.options.isActive() || e.getMeta(ZC)?.rollback || Hu(e) || ZC.getState(t) ? !0 : Ft(t.doc, e.doc, this.options.getInputMode()),
			view: (n) => {
				let r = n.dom.ownerDocument.defaultView, i = () => {
					this.options.isActive() && (t !== void 0 && r.cancelAnimationFrame(t), e = {
						doc: n.state.doc,
						selection: n.state.selection
					}, n.dispatch(n.state.tr.setMeta(ZC, { composing: !0 }).setMeta("addToHistory", !1)));
				}, a = () => {
					e && (t = r.requestAnimationFrame(() => {
						t = void 0;
						let r = e;
						e = null;
						let i = n.state.tr.setMeta(ZC, {
							composing: !1,
							rollback: !0
						}).setMeta("addToHistory", !1);
						r && this.options.isActive() && !Ft(r.doc, n.state.doc, this.options.getInputMode()) && (i.replaceWith(0, i.doc.content.size, r.doc.content), i.setSelection(P.fromJSON(i.doc, r.selection.toJSON()))), n.dispatch(i);
					}));
				};
				return n.dom.addEventListener("compositionstart", i, !0), n.dom.addEventListener("compositionend", a, !0), { destroy() {
					n.dom.removeEventListener("compositionstart", i, !0), n.dom.removeEventListener("compositionend", a, !0), t !== void 0 && r.cancelAnimationFrame(t), e = null;
				} };
			}
		})];
	}
}), ew = le("<span class=\"profile-mention-avatar svelte-12mq11z\" aria-hidden=\"true\"><!></span> <span class=\"profile-mention-label svelte-12mq11z\"> </span> <small class=\"svelte-12mq11z\"> </small>", 1), tw = {
	hash: "svelte-12mq11z",
	code: ".profile-mention-suggestion {--profile-mention-avatar-size: 32px;--suggestion-command-item-columns: var(--profile-mention-avatar-size) minmax(0, 1fr) auto;}.profile-mention-avatar.svelte-12mq11z {width:var(--profile-mention-avatar-size);height:var(--profile-mention-avatar-size);pointer-events:none;}.profile-mention-avatar.svelte-12mq11z .suggestion-mention-avatar-root {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.profile-mention-avatar.svelte-12mq11z .suggestion-mention-avatar-image {display:block;width:100%;height:100%;object-fit:cover;}.profile-mention-label.svelte-12mq11z {min-width:0;max-width:16rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}small.svelte-12mq11z {opacity:0.7;}"
};
function nw(e, t) {
	r(t, !0), re(e, tw);
	let n = ve(void 0);
	function i() {
		O(n)?.moveDown();
	}
	function o() {
		O(n)?.moveUp();
	}
	function l() {
		return O(n)?.confirmSelection() ?? !1;
	}
	function u() {
		O(n)?.resetIndex();
	}
	var d = {
		moveDown: i,
		moveUp: o,
		confirmSelection: l,
		resetIndex: u
	};
	return T(j_(e, {
		get items() {
			return t.items;
		},
		getKey: (e) => e.pubkey,
		getValue: (e) => e.pubkey,
		get onSelect() {
			return t.onSelect;
		},
		rootClass: "profile-mention-suggestion",
		itemClass: "profile-mention-suggestion-item",
		children: (e, n = m) => {
			let r = g(() => t.readProfile?.(n().pubkey));
			var i = ew(), a = E(i), o = ee(a);
			{
				let e = g(() => O(r)?.displayName), t = g(() => O(r)?.name), i = g(() => O(r)?.picture);
				Ye(o, {
					get pubkeyHex() {
						return n().pubkey;
					},
					get displayName() {
						return O(e);
					},
					get name() {
						return O(t);
					},
					get src() {
						return O(i);
					},
					fallbackAriaLabel: "",
					rootClassName: "suggestion-mention-avatar-root",
					imageClassName: "suggestion-mention-avatar-image"
				});
			}
			f(a);
			var l = ae(a, 2), u = ce(l), d = ae(l, 2), p = ce(d, !0);
			w((e, t) => {
				c(u, `@${e ?? ""}`), c(p, t);
			}, [() => dt(n().label), () => Be(n().pubkey)]), s(e, i);
		},
		$$slots: { default: !0 }
	}), (e) => x(n, e, !0), () => O(n)), a(d);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/ProfileMentionNodeView.svelte
var rw = le("<span class=\"mention-avatar svelte-17wr8uu\" aria-hidden=\"true\"><!></span>"), iw = le("<!><span> </span>", 1), aw = {
	hash: "svelte-17wr8uu",
	code: ".mention-avatar.svelte-17wr8uu {display:inline-block;width:var(--post-editor-line-height, 1.5em);height:var(--post-editor-line-height, 1.5em);margin-inline-end:0.25em;vertical-align:top;pointer-events:none;}.mention-avatar.svelte-17wr8uu .inline-mention-avatar-root {display:block;width:100%;height:100%;overflow:hidden;border-radius:50%;}.mention-avatar.svelte-17wr8uu .inline-mention-avatar-image {display:block;width:100%;height:100%;object-fit:cover;}"
};
function ow(e, n) {
	r(n, !0), re(e, aw);
	let i = g(() => n.extension.options.profileSource), o = g(() => ct(n.node.attrs.uri)), l = g(() => dt(n.node.attrs.label)), u = g(() => O(o) ? O(i)?.readProfile(O(o).pubkey) : null);
	ie(() => {
		if (!O(o) || !O(i)) return;
		let e = O(o), t = O(i).getInlineLoader(), n = new AbortController();
		return S(() => {
			t(e, n.signal).catch(() => void 0);
		}), () => n.abort();
	}), Pg(e, {
		as: "span",
		class: "editor-profile-mention",
		get "data-nostr-mention"() {
			return n.node.attrs.uri;
		},
		contenteditable: "false",
		children: (e, n) => {
			var r = iw(), a = E(r), d = (e) => {
				var t = rw(), n = ee(t);
				{
					let e = g(() => O(u)?.displayName), t = g(() => O(u)?.name), r = g(() => O(u)?.picture);
					Ye(n, {
						get pubkeyHex() {
							return O(o).pubkey;
						},
						get displayName() {
							return O(e);
						},
						get name() {
							return O(t);
						},
						get src() {
							return O(r);
						},
						fallbackAriaLabel: "",
						rootClassName: "inline-mention-avatar-root",
						imageClassName: "inline-mention-avatar-image"
					});
				}
				f(t), s(e, t);
			};
			t(a, (e) => {
				O(o) && O(i) && e(d);
			});
			var p = ae(a), m = ce(p);
			w(() => c(m, `@${O(l) ?? ""}`)), s(e, r);
		},
		$$slots: { default: !0 }
	}), a();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/profileMentionExtension.svelte.ts
var sw = new R("profileMentionSuggestion"), cw = /^[@＠]/u;
function lw({ $position: e }) {
	let t = e.nodeBefore?.text;
	if (!t) return null;
	let n = Math.max(0, t.length - 256);
	for (let r = t.length - 1; r >= n; r--) if (cw.test(t.charAt(r)) && (r === 0 || /[ \t\u3000]/.test(t[r - 1]))) {
		let n = t.slice(r + 1);
		return n.trim() ? {
			range: {
				from: e.pos - t.length + r,
				to: e.pos
			},
			query: n,
			text: t.slice(r)
		} : null;
	}
	return null;
}
function uw(e, t, n = e.state.selection) {
	if (!e.isEditable || !e.schema.nodes.profileMention) return !1;
	let r = e.state.doc.resolve(n.from).nodeBefore, i = e.state.doc.resolve(n.to).nodeAfter, a = r?.type.name === "profileMention" || /\S$/.test(r?.text ?? ""), o = /^\s/.test(i?.text ?? "") ? [] : [{
		type: "text",
		text: " "
	}];
	return e.commands.insertContentAt(n, [
		...a ? [{
			type: "text",
			text: " "
		}] : [],
		{
			type: ft,
			attrs: {
				uri: lt(t),
				label: dt(t.label)
			}
		},
		...o
	]);
}
var dw = hh.create({
	name: ft,
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !1,
	addOptions() {
		return {
			getItems: () => [],
			canSuggest: () => !0
		};
	},
	addAttributes() {
		return {
			uri: {
				default: "",
				rendered: !1
			},
			label: {
				default: "",
				rendered: !1
			}
		};
	},
	parseHTML() {
		return [{
			tag: `span[${mt}]`,
			getAttrs: (e) => {
				let t = ct(e.getAttribute(mt));
				return t ? {
					uri: lt(t),
					label: dt(e.textContent?.replace(/^@/, "") ?? "") || pt(t.pubkey)
				} : !1;
			}
		}];
	},
	renderHTML({ node: e }) {
		return [
			"span",
			{
				[mt]: e.attrs.uri,
				class: "editor-profile-mention"
			},
			`@${dt(e.attrs.label)}`
		];
	},
	renderText({ node: e }) {
		return e.attrs.uri;
	},
	addNodeView() {
		return Ag(ow);
	},
	addProseMirrorPlugins() {
		let e = q_({
			component: nw,
			className: "profile-mention-suggestion-popover",
			getProps: ({ items: e, command: t }) => ({
				items: e,
				onSelect: t,
				readProfile: this.options.profileSource?.readProfile
			})
		});
		return [O_({
			editor: this.editor,
			pluginKey: sw,
			char: "@",
			findSuggestionMatch: lw,
			allow: () => this.options.canSuggest(),
			render: () => {
				let t = e(), n, r = (e) => {
					n?.();
					let r;
					n = fe(() => {
						ie(() => {
							let n = this.options.canSuggest() ? this.options.getItems(e.query) : [];
							r?.length === n.length && n.every((e, t) => {
								let n = r[t];
								return e.pubkey === n.pubkey && e.label === n.label && e.relayHints === n.relayHints;
							}) || (r = n, S(() => t.onUpdate({
								...e,
								items: n
							})));
						});
					});
				};
				return {
					onBeforeStart: r,
					onBeforeUpdate: r,
					onExit: () => {
						n?.(), n = void 0, t.onExit();
					},
					onKeyDown: (e) => !XC(e.event, e.view) && t.onKeyDown(e)
				};
			},
			command: ({ editor: e, range: t, props: n }) => {
				if (!this.options.canSuggest()) return;
				let r = e.state.selection;
				if (!r.empty || r.from !== t.to) return;
				let i = e.state.doc.textBetween(t.from, t.to);
				if (!cw.test(i)) return;
				let a = this.options.getItems(i.slice(1)).find((e) => e.pubkey === n.pubkey);
				a && uw(e, a, t);
			}
		})];
	}
}), fw = /* @__PURE__ */ new Set([
	"image",
	"video",
	"customEmoji"
]), pw = ".node-image.is-node-focused, .node-video.is-node-focused, .custom-emoji-wrapper.is-node-focused", mw = ".custom-emoji-picker", hw = Y.create({
	name: "shiftEnterToParagraph",
	addKeyboardShortcuts() {
		return { "Shift-Enter": () => this.editor.commands.splitBlock() };
	}
}), gw = [{ modifiers: ["ctrl"] }, { modifiers: ["meta"] }];
function _w(e, t) {
	let n = t.includes("ctrlOrMeta");
	return !((n ? e.ctrlKey === e.metaKey : e.ctrlKey !== t.includes("ctrl")) || !n && e.metaKey !== t.includes("meta") || e.altKey !== t.includes("alt") || e.shiftKey !== t.includes("shift"));
}
var vw = Y.create({
	name: "gapCursorFocusReset",
	onSelectionUpdate() {
		let { state: e, view: t } = this.editor, n = e.selection, r = (e) => {
			t.dom.querySelectorAll(pw).forEach((t) => {
				e && t === e || t.classList.remove("is-node-focused");
			});
		};
		if (n instanceof I && fw.has(n.node.type.name)) {
			let e = t.nodeDOM(n.from), i = e?.matches(".node-image, .node-video") ? e : e?.closest(".node-image, .node-video");
			if (i) {
				r(i), i.classList.add("is-node-focused");
				return;
			}
		}
		n instanceof ZS, r();
	},
	onCreate() {
		let e = (e) => {
			let { view: t } = this.editor, n = e.target;
			if (t.dom.contains(n) || n.closest(mw)) return;
			t.dom.querySelectorAll(pw).forEach((e) => {
				e.classList.remove("is-node-focused");
			});
			let { state: r } = t, { selection: i } = r;
			if (i instanceof I && fw.has(i.node.type.name)) {
				let e = r.doc.content.size, n = r.doc.resolve(e), i = r.tr.setSelection(F.near(n)).setMeta("addToHistory", !1);
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
function yw(e) {
	let { placeholderText: t, onSubmitPost: n, onCustomEmojiSelect: r, getCustomEmojiItems: i, enterKeyBehavior: a = "newline", hostOwnedLite: o = !1, submitShortcuts: s, onUpdate: c, onCreate: l, onDestroy: u } = e, d = { text: t }, f = () => e.getReactionInputMode?.() === "uploadedShortcode" ? [] : (i ?? cv.options.getItems)();
	return Tg({
		extensions: [
			...e.isReactionMode ? [$C.configure({
				isActive: e.isReactionMode,
				...e.getReactionInputMode ? { getInputMode: e.getReactionInputMode } : {}
			})] : [],
			...!o && e.isInputBlocked ? [YC.configure({
				isInputBlocked: e.isInputBlocked,
				isCompositionInputAllowed: e.isCompositionInputAllowed,
				compositionController: e.compositionController
			})] : [],
			IC.configure({
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
			Nx.extend({ renderHTML({ mark: e, HTMLAttributes: t }) {
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
			RC.configure({
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
					return Ag(UC);
				}
			}),
			qC.configure({
				types: ["image", "video"],
				attributeName: "id"
			}),
			lC.configure({
				className: "is-node-focused",
				mode: "all"
			}),
			vw,
			hw,
			ng.configure({ isMediaConversionDisabled: e.isReactionMode }),
			J_,
			...e.getProfileMentionItems && !o ? [dw.configure({
				getItems: e.getProfileMentionItems,
				profileSource: e.profileMentionSource,
				canSuggest: () => !e.isReactionMode?.() && !e.isInputBlocked?.()
			})] : [],
			Kg,
			cv.configure({ getItems: f }),
			Ev.configure({
				onSelectEmoji: r,
				getItems: f
			}),
			Av,
			l_,
			lg.configure({
				isMediaConversionDisabled: e.isReactionMode,
				onReactionImageUrls: e.onReactionImageUrls
			}),
			Sg,
			_v,
			Cg,
			f_,
			OC.configure({
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
					if (t.key !== "Enter" && t.key !== "NumpadEnter" || XC(t, e)) return !1;
					let r = (s === void 0 ? gw : s).find((e) => _w(t, e.modifiers));
					return r ? (t.preventDefault(), r.id === void 0 ? n() : n({ shortcutId: r.id }), !0) : t.ctrlKey || t.metaKey || t.altKey || t.shiftKey ? !1 : a === "submit" && (t.preventDefault(), n(), !0);
				}
				return (t.ctrlKey || t.metaKey) && (t.key === "Enter" || t.key === "NumpadEnter") ? !XC(t, e) && (t.preventDefault(), n(), !0) : !1;
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
function bw(e, t) {
	if (!e) return;
	let n = e, r = Array.from(e.view.dom.querySelectorAll("[data-placeholder]")), i = r.some((e) => e.getAttribute("data-placeholder") !== t);
	if (n.__placeholderState?.text === t && !i) return;
	n.__placeholderState && (n.__placeholderState.text = t);
	let a = e.extensionManager.extensions.find((e) => e.name === "placeholder");
	a && a.options && (a.options.placeholder = n.__placeholderState ? () => n.__placeholderState?.text ?? t : t, r.forEach((e) => {
		e.setAttribute("data-placeholder", t);
	}), e.view.dispatch(e.state.tr.setMeta("addToHistory", !1)));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/imageDecode.ts
var xw = 3e3;
function Sw(e, t = xw) {
	return typeof e.decode == "function" ? new Promise((n) => {
		let r = setTimeout(n, t);
		e.decode().catch(() => void 0).then(() => {
			clearTimeout(r), n();
		});
	}) : Promise.resolve();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/tags/imetaTag.ts
async function Cw(e) {
	if (!e.url) throw Error("url is required for imeta tag");
	if (!e.m) throw Error("m (MIME type) is required for imeta tag");
	let t = e.dim;
	if (!t && e.url) try {
		t = await new Promise((t) => {
			let n = new window.Image();
			n.onload = () => {
				t(`${n.naturalWidth}x${n.naturalHeight}`);
			}, n.onerror = () => t(void 0), n.src = e.url;
		});
	} catch {
		t = void 0;
	}
	let n = {
		content: e.content || "",
		url: e.url,
		m: e.m,
		x: e.x || "",
		ox: e.ox && e.uploadProtocol !== "blossom" ? e.ox : "",
		...e.size === void 0 ? {} : { size: String(e.size) },
		...t === void 0 ? {} : { dim: t },
		...e.blurhash === void 0 ? {} : { blurhash: e.blurhash },
		...e.thumb === void 0 ? {} : { thumb: e.thumb },
		...e.image === void 0 ? {} : { image: e.image },
		...e.summary === void 0 ? {} : { summary: e.summary },
		...e.alt === void 0 ? {} : { alt: e.alt },
		...e.fallback === void 0 ? {} : { fallback: e.fallback }
	};
	e.x && (n.x = e.x);
	let r = (await import("./nip94-BbPZGLby.js")).generateEventTemplate(n), i = [`url ${e.url}`];
	for (let e of r.tags) {
		let [t, ...n] = e;
		if (t === "url") continue;
		let r = n.join(" ").trim();
		r && i.push(`${t} ${r}`);
	}
	return ["imeta", ...i];
}
async function ww(e, t = It) {
	try {
		if (t()) return null;
		let n = await new Promise((t, n) => {
			let r = URL.createObjectURL(e), i = new window.Image();
			i.onload = () => {
				URL.revokeObjectURL(r), t(i);
			}, i.onerror = (e) => {
				URL.revokeObjectURL(r), n(e);
			}, i.src = r;
		});
		if (t() || (await Sw(n), t())) return null;
		let r = document.createElement("canvas");
		r.width = Math.min(n.width, 64), r.height = Math.min(n.height, 64);
		let i = r.getContext("2d");
		if (!i) return null;
		i.drawImage(n, 0, 0, r.width, r.height);
		let a = i.getImageData(0, 0, r.width, r.height), { encode: o } = await import("./esm-CrCI9Pgc.js").then((e) => e.t);
		return o(a.data, a.width, a.height, 4, 4);
	} catch {
		return null;
	}
}
async function Tw(e) {
	try {
		return URL.createObjectURL(e);
	} catch {
		return null;
	}
}
async function Ew(e, t) {
	return await ww(e, t);
}
function Dw(e) {
	let t = {};
	return e?.state?.doc && e.state.doc.descendants((e) => {
		e.type?.name === "image" && typeof e.attrs?.src == "string" && typeof e.attrs?.blurhash == "string" && !e.attrs?.isPlaceholder && !e.attrs.src.startsWith("placeholder-") && (t[e.attrs.src] = e.attrs.blurhash);
	}), t;
}
function Ow(e) {
	return kw(e) ?? "image/jpeg";
}
function kw(e) {
	let t = {
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		webp: "image/webp",
		avif: "image/avif",
		bmp: "image/bmp",
		svg: "image/svg+xml"
	}, n = e;
	try {
		n = new URL(e).pathname;
	} catch {
		n = e.split(/[?#]/)[0];
	}
	let r = n.split(".").pop()?.toLowerCase() ?? "";
	return Object.hasOwn(t, r) ? t[r] : void 0;
}
async function Aw(e) {
	try {
		let t = await fetch(e);
		if (!t.ok) return null;
		let n = await t.arrayBuffer(), r = await crypto.subtle.digest("SHA-256", n);
		return Array.from(new Uint8Array(r)).map((e) => e.toString(16).padStart(2, "0")).join("");
	} catch (e) {
		return console.warn("Failed to calculate image hash:", e), null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/uploadResultUtils.ts
function jw(e, t, n) {
	if (e.length === 0) return "";
	if (e.length === 1) {
		let r = e[0].errorCode;
		return r ? n?.(r) || e[0].error || t : e[0].error || t;
	}
	return `${e.length}個のファイルのアップロードに失敗しました`;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/editor/placeholderManager.ts
function Mw(e, t) {
	if (t.placeholderId !== void 0) {
		let n = e.findIndex((e) => e.placeholderId === t.placeholderId);
		return {
			matched: e[n],
			matchedIndex: n
		};
	}
	let n, r = -1;
	return t.sizeInfo?.originalFilename && (r = e.findIndex((e) => e.file.name === t.sizeInfo.originalFilename), r !== -1 && (n = e[r])), !n && e.length > 0 && (n = e[0], r = 0), {
		matched: n,
		matchedIndex: r
	};
}
function Nw(e) {
	return jw(e, "postComponent.upload_failed");
}
function Pw(e, t, n, r) {
	e.update((e) => {
		let i = { ...e };
		return delete i[t], n && r && (i[n] = r), i;
	});
}
function Fw(e, t) {
	return {
		onAborted: e,
		onFailure: e,
		onRemaining: e,
		onSuccess: t
	};
}
function Iw(e, t) {
	Pe.removeItem(e), Pw(t, e);
}
function Lw(e) {
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
function Rw(e) {
	if (typeof e == "number" && Number.isFinite(e) && e > 0) return e;
	if (typeof e == "string") {
		let t = Number(e);
		if (Number.isFinite(t) && t > 0) return t;
	}
}
function zw(e, t, n) {
	if (e.dimensions) return e.dimensions;
	let r = St(t);
	return r ? jt(r.width, r.height) : n.dimensions;
}
function Bw(e, t, n) {
	let { mFromServer: r, altFromServer: i, serverBlurhash: a, oxFromServer: o, xFromServer: s, dimFromServer: c, sizeFromServer: l } = Lw(e.nip94 || {}), u = zw(e, c, t), d = e.hostOwnedMedia === !0, f;
	return d ? f = r ?? t.file.type : t.file.type === "image/avif" && (f = r?.startsWith("image/") ? r : kw(n) ?? "image/avif"), {
		mimeType: f,
		alt: d ? i : void 0,
		serverBlurhash: a,
		oxFromServer: o,
		xFromServer: s,
		blurhash: a ?? t.blurhash,
		ox: e.uploadProtocol === "blossom" ? void 0 : o ?? t.ox,
		dim: c ?? (u ? `${u.width}x${u.height}` : void 0),
		dimensions: u,
		size: Rw(l) ?? e.sizeInfo?.compressedSize,
		uploadProtocol: e.uploadProtocol
	};
}
async function Vw(e, t, n, r, i, a, o, s) {
	return Pw(a, t.placeholderId, n.dimensions ? e : void 0, n.dimensions), Hw(e, t, n.uploadProtocol, n.oxFromServer, n.xFromServer, r, i, o, s);
}
async function Hw(e, t, n, r, i, a, o, s, c) {
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
function Uw(e, t, n, r, i) {
	let a = new r(), o = [];
	return e.forEach((e, r) => {
		let s = e.type.startsWith("video/"), c = a.validateMediaFile(e);
		if (!c.isValid) {
			n(c.errorMessage || "postComponent.upload_failed");
			return;
		}
		let l = `placeholder-${i}-${r}-${je()}`, u = t[r];
		o.push({
			file: e,
			placeholderId: l,
			ox: u?.ox,
			dimensions: u?.dimensions,
			isVideo: s
		});
	}), o;
}
function Ww(e) {
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
			imageMetadata: Bw(t, n, r)
		});
	};
}
async function Gw(e, t, n) {
	let r = [], i = [...t];
	for (let t of e) {
		if (t.aborted) {
			let e = t.placeholderId === void 0 ? 0 : Mw(i, t).matchedIndex, r = e < 0 ? void 0 : i.splice(e, 1)[0];
			r && await n.onAborted(r);
			continue;
		}
		if (t.success && t.url) {
			let { matched: e, matchedIndex: r } = Mw(i, t);
			e && r !== -1 && (i.splice(r, 1), await n.onSuccess(t, e));
			continue;
		}
		r.push(t);
		let e = t.placeholderId === void 0 ? 0 : Mw(i, t).matchedIndex, a = e < 0 ? void 0 : i.splice(e, 1)[0];
		a && await n.onFailure(a);
	}
	for (let e of i) await n.onRemaining(e);
	return {
		failedResults: r,
		errorMessage: Nw(r)
	};
}
async function Kw(e, t, n = !1, r = It) {
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
function qw(e, t, n, r, i, a, o = !1) {
	if (!n) return [];
	let s = n.state, c = s.selection, l = c instanceof I && c.node?.type?.name === "image", u = Date.now();
	o && console.log("[dev] insertPlaceholdersIntoEditor:", {
		fileCount: e.length,
		isImageNodeSelected: l,
		selectionType: c.constructor.name,
		selectionFrom: c.from,
		selectionTo: c.to,
		docSize: s.doc.content.size
	});
	let d = s.doc.childCount === 1 && s.doc.firstChild?.type.name === "paragraph" && s.doc.firstChild.content.size === 0, f = s.tr, p = l ? c.to : c.from, m = Uw(e, t, r, a, u), h = [];
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
async function Jw(e, t, n, r, i, a, o, s = !1) {
	let c = {}, { failedResults: l, errorMessage: u } = await Gw(e, t, Fw(async (e) => {
		bg(e.placeholderId, e.file.type.startsWith("video/"), n, a, s);
	}, Ww({
		onBeforeReplace: ({ url: e, matched: t, isVideo: n }) => {
			s && console.log("[uploadHelper] Replacing placeholder", {
				placeholderId: t.placeholderId,
				url: e,
				isVideo: n
			});
		},
		onVideoSuccess: ({ url: e, matched: t, result: r }) => {
			vg(n, (e) => e.type.name === "video" && e.attrs.src === t.placeholderId, (t, i) => {
				let a = r.hostOwnedMedia === !0 ? Lw(r.nip94 || {}) : null, o = n.state.tr.setNodeMarkup(i, void 0, {
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
			vg(n, (e) => e.type.name === "image" && e.attrs.src === t.placeholderId, (t, r) => {
				let i = {
					...t.attrs,
					src: e,
					isPlaceholder: !1,
					blurhash: l.blurhash
				};
				l.dim && (i.dim = l.dim), l.mimeType && (i.m = l.mimeType), l.alt !== void 0 && (i.alt = l.alt), l.oxFromServer && (i.ox = l.oxFromServer), l.xFromServer && (i.x = l.xFromServer), i.size = l.size ?? null, i.uploadProtocol = l.uploadProtocol ?? null;
				let a = n.state.tr.setNodeMarkup(r, void 0, i);
				n.view.dispatch(a);
			}), l.serverBlurhash && (c[e] = l.serverBlurhash), await Vw(e, t, l, r, i, a, o, s);
		}
	})));
	return {
		failedResults: l,
		errorMessage: u,
		imageServerBlurhashMap: c
	};
}
function Yw(e, t, n, r, i, a = !1) {
	let o = Uw(e, t, n, i, Date.now()), s = [];
	for (let e of o) {
		let { file: t, placeholderId: n, ox: i, dimensions: o, isVideo: c } = e, l = {
			id: n,
			type: c ? "video" : "image",
			src: n,
			isPlaceholder: !0,
			dimensions: o,
			dim: o ? `${o.width}x${o.height}` : void 0
		};
		Pe.addItem(l), !c && o && r.update((e) => ({
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
async function Xw(e, t, n, r, i, a, o, s = !1, c) {
	return Gw(e, t, Fw(async (e) => {
		Iw(e.placeholderId, i);
	}, Ww({
		onVideoSuccess: ({ url: e, matched: t, result: n }) => {
			if (c?.isCurrent && !c.isCurrent()) return;
			let r = n.hostOwnedMedia === !0 ? Lw(n.nip94 || {}) : null;
			Pe.updateItem(t.placeholderId, {
				src: e,
				isPlaceholder: !1,
				mimeType: r?.mFromServer ?? o(e),
				...r?.altFromServer ? { alt: r.altFromServer } : {},
				...r?.serverBlurhash ? { blurhash: r.serverBlurhash } : {},
				...r?.dimFromServer ? { dim: r.dimFromServer } : {},
				...r?.sizeFromServer ? { size: Rw(r.sizeFromServer) } : {},
				...r?.oxFromServer ? { ox: r.oxFromServer } : {},
				...r?.xFromServer ? { x: r.xFromServer } : {},
				...n.hostOwnedMedia === !0 ? { uploadProtocol: n.uploadProtocol } : {}
			});
		},
		onImageSuccess: async ({ url: e, matched: t, imageMetadata: l }) => {
			if (c?.isCurrent && !c.isCurrent()) return;
			let u = l.mimeType ?? (c?.useFileMimeType ? t.file.type : o(e));
			Pe.updateItem(t.placeholderId, {
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
			let d = await Vw(e, t, l, n, r, i, a, s);
			d && (!c?.isCurrent || c.isCurrent()) && Pe.updateItem(t.placeholderId, { x: d }), s && console.log("[gallery] replaced placeholder:", t.placeholderId, "->", e);
		}
	})));
}
function Zw(e, t) {
	for (let n of e) Iw(n.placeholderId, t);
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/editorStore.svelte.ts
var Qw = D({ value: "" }), $w = ve(null), eT = {
	get value() {
		return O($w);
	},
	set: (e) => {
		x($w, e, !0);
	}
}, tT = D({
	isSubmitPending: !1,
	content: "",
	canPost: !1,
	submitIcon: "plane",
	isUploading: !1,
	uploadErrorMessage: "",
	postStatus: {
		sending: !1,
		success: !1,
		error: !1,
		message: ""
	},
	hasImage: !1
}), nT = D({
	isDragging: !1,
	startPos: {
		x: 0,
		y: 0
	},
	longPressTimeout: null,
	startTarget: null,
	preview: null
}), rT = D({
	justSelected: !1,
	justSelectedTimeout: null
}), iT = D({
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
function aT(e, t = !1) {
	tT.content = e, tT.hasImage = t;
}
function oT(e, t, n, r = "plane") {
	tT.submitIcon = r, tT.canPost = n ?? zh(e, t);
}
function sT(e) {
	tT.postStatus = e;
}
function cT() {
	tT.content = "", tT.submitIcon = "plane", tT.canPost = !1, tT.uploadErrorMessage = "", tT.postStatus = {
		sending: !1,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	}, tT.hasImage = !1;
}
function lT() {
	tT.postStatus = {
		sending: !1,
		success: !1,
		error: !1,
		message: "",
		completed: !1
	};
}
function uT(e) {
	Qw.value = e, O($w) && bw(O($w), e);
}
var dT = void 0;
function fT(e) {
	dT = e;
}
function pT(e) {
	e && dT !== e || (dT = void 0);
}
async function mT(e) {
	dT && await dT(e);
}
export { XC as A, zg as B, Dw as C, yw as D, Sw as E, Xg as F, Fh as G, xg as H, Jg as I, P as J, zh as K, Zg as L, Ov as M, G_ as N, uw as O, qg as P, Vg as R, Tw as S, Ow as T, Gh as U, Mg as V, Ph as W, Xw as _, cT as a, Aw as b, mT as c, uT as d, sT as f, Zw as g, Yw as h, Qw as i, JC as j, QC as k, aT as l, qw as m, eT as n, lT as o, Kw as p, I as q, tT as r, fT as s, pT as t, oT as u, Jw as v, Ew as w, Cw as x, jw as y, Bg as z };
