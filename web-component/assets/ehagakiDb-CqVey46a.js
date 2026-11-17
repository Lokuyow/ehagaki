import { i as e, t } from "./rolldown-runtime-CwxnZyOB.js";
import { d as n, f as r, n as i } from "./relayConfigUtils-B4Q_AO1M.js";
import { n as a, s as o } from "./postHistoryEventUtils-CP25bUau.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/eventStorageModel.ts
var s = [
	"postHistory",
	"postHistoryChildInteractions",
	"sensitivePayloads",
	"postHistoryDeletionRequests",
	"notifications"
];
function c(e, t) {
	return t === "postHistoryDeletionRequests" ? e.deletionEventId : e.eventId ?? e.id;
}
function l(e, t) {
	let { rawEvent: n, event: r, content: i, tags: a, rawEventVerification: o, fetchedRelays: s, relayUrls: c, repostTarget: l, ...u } = e, d = t === "notifications" ? r : n, f = l?.rawEvent, p = t === "postHistory" || t === "sensitivePayloads" ? {
		deletedAt: e.deletedAt,
		deletionEventId: e.deletionEventId
	} : {};
	return {
		metadata: {
			...u,
			...l ? { repostTarget: {
				eventId: f?.id ?? l.eventId,
				relayHints: l.relayHints
			} } : {}
		},
		items: [...d ? [{
			event: d,
			relayUrls: s ?? c ?? [],
			receivedAt: e.receivedAt ?? e.fetchedAt,
			verification: o,
			...p,
			relatedEventIds: f ? [f.id] : []
		}] : [], ...f ? [{
			event: f,
			relayUrls: l.relayHints,
			verification: l.rawEventVerification
		}] : []]
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@rx-nostr/crypto/dist/crypto.js
var u = Object.defineProperty, d = (e, t, n) => t in e ? u(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, f = (e, t, n) => d(e, typeof t == "symbol" ? t : t + "", n);
function p(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in e && e.BYTES_PER_ELEMENT === 1;
}
function m(e, t = "") {
	if (typeof e != "number") {
		let n = t && `"${t}" `;
		throw TypeError(`${n}expected number, got ${typeof e}`);
	}
	if (!Number.isSafeInteger(e) || e < 0) {
		let n = t && `"${t}" `;
		throw RangeError(`${n}expected integer >= 0, got ${e}`);
	}
}
function h(e, t, n = "") {
	let r = p(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`, l = o + "expected Uint8Array" + s + ", got " + c;
		throw r ? RangeError(l) : TypeError(l);
	}
	return e;
}
function g(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function _(e, t) {
	h(e, void 0, "digestInto() output");
	let n = t.outputLen;
	if (e.length < n) throw RangeError("\"digestInto() output\" expected to be of length >=" + n);
}
function v(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function y(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function b(e, t) {
	return e << 32 - t | e >>> t;
}
var x = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", S = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function C(e) {
	if (h(e), x) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += S[e[n]];
	return t;
}
var w = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function T(e) {
	if (e >= w._0 && e <= w._9) return e - w._0;
	if (e >= w.A && e <= w.F) return e - (w.A - 10);
	if (e >= w.a && e <= w.f) return e - (w.a - 10);
}
function E(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	if (x) try {
		return Uint8Array.fromHex(e);
	} catch (e) {
		throw e instanceof SyntaxError ? RangeError(e.message) : e;
	}
	let t = e.length, n = t / 2;
	if (t % 2) throw RangeError("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = T(e.charCodeAt(i)), a = T(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw RangeError("hex string expected, got non-hex character \"" + t + "\" at index " + i);
		}
		r[t] = n * 16 + a;
	}
	return r;
}
function ee(...e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		h(r), t += r.length;
	}
	let n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t++) {
		let i = e[t];
		n.set(i, r), r += i.length;
	}
	return n;
}
function D(e, t = {}) {
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.canXOF = r.canXOF, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
function te(e = 32) {
	m(e, "bytesLength");
	let t = typeof globalThis == "object" ? globalThis.crypto : null;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined");
	if (e > 65536) throw RangeError(`"bytesLength" expected <= 65536, got ${e}`);
	return t.getRandomValues(new Uint8Array(e));
}
var ne = (e) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	e
]) });
function re(e, t, n) {
	return e & t ^ ~e & n;
}
function ie(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var ae = class {
	constructor(e, t, n, r) {
		f(this, "blockLen"), f(this, "outputLen"), f(this, "canXOF", !1), f(this, "padOffset"), f(this, "isLE"), f(this, "buffer"), f(this, "view"), f(this, "finished", !1), f(this, "length", 0), f(this, "pos", 0), f(this, "destroyed", !1), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = y(this.buffer);
	}
	update(e) {
		g(this), h(e);
		let { view: t, buffer: n, blockLen: r } = this, i = e.length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o === r) {
				let t = y(e);
				for (; r <= i - a; a += r) this.process(t, a);
			} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		g(this), _(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, v(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let o = y(e), s = this.outputLen;
		if (s % 4) throw Error("_sha2: outputLen must be aligned to 32bit");
		let c = s / 4, l = this.get();
		if (c > l.length) throw Error("_sha2: outputLen bigger than state");
		for (let e = 0; e < c; e++) o.setUint32(4 * e, l[e], i);
	}
	digest() {
		let { buffer: e, outputLen: t } = this;
		this.digestInto(e);
		let n = e.slice(0, t);
		return this.destroy(), n;
	}
	_cloneInto(e) {
		e ||= new this.constructor(), e.set(...this.get());
		let { blockLen: t, buffer: n, length: r, finished: i, destroyed: a, pos: o } = this;
		return e.destroyed = a, e.finished = i, e.length = r, e.pos = o, r % t && e.buffer.set(n), e;
	}
	clone() {
		return this._cloneInto();
	}
}, O = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), oe = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]), se = /* @__PURE__ */ new Uint32Array(64), k = class extends ae {
	constructor(e) {
		super(64, e, 8, !1);
	}
	get() {
		let { A: e, B: t, C: n, D: r, E: i, F: a, G: o, H: s } = this;
		return [
			e,
			t,
			n,
			r,
			i,
			a,
			o,
			s
		];
	}
	set(e, t, n, r, i, a, o, s) {
		this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = s | 0;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) se[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = se[e - 15], n = se[e - 2], r = b(t, 7) ^ b(t, 18) ^ t >>> 3, i = b(n, 17) ^ b(n, 19) ^ n >>> 10;
			se[e] = i + se[e - 7] + r + se[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = b(o, 6) ^ b(o, 11) ^ b(o, 25), u = l + t + re(o, s, c) + oe[e] + se[e] | 0, d = (b(n, 2) ^ b(n, 13) ^ b(n, 22)) + ie(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		v(se);
	}
	destroy() {
		this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), v(this.buffer);
	}
}, ce = class extends k {
	constructor() {
		super(32), f(this, "A", O[0] | 0), f(this, "B", O[1] | 0), f(this, "C", O[2] | 0), f(this, "D", O[3] | 0), f(this, "E", O[4] | 0), f(this, "F", O[5] | 0), f(this, "G", O[6] | 0), f(this, "H", O[7] | 0);
	}
}, le = /* @__PURE__ */ D(() => new ce(), /* @__PURE__ */ ne(1)), A = (e, t, n) => h(e, t, n), ue = m, de = C, fe = (...e) => ee(...e), pe = (e) => E(e), j = /* @__PURE__ */ BigInt(0), me = /* @__PURE__ */ BigInt(1);
function M(e, t = "") {
	if (typeof e != "boolean") {
		let n = t && `"${t}" `;
		throw TypeError(n + "expected boolean, got type=" + typeof e);
	}
	return e;
}
function he(e) {
	if (typeof e == "bigint") {
		if (!we(e)) throw RangeError("positive bigint expected, got " + e);
	} else ue(e);
	return e;
}
function ge(e, t = "") {
	if (typeof e != "number") {
		let n = t && `"${t}" `;
		throw TypeError(n + "expected number, got type=" + typeof e);
	}
	if (!Number.isSafeInteger(e)) {
		let n = t && `"${t}" `;
		throw RangeError(n + "expected safe integer, got " + e);
	}
}
function N(e) {
	let t = he(e).toString(16);
	return t.length & 1 ? "0" + t : t;
}
function _e(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	return e === "" ? j : BigInt("0x" + e);
}
function ve(e) {
	return _e(C(e));
}
function ye(e) {
	return _e(C(Se(h(e)).reverse()));
}
function be(e, t) {
	if (m(t), t === 0) throw RangeError("zero length");
	e = he(e);
	let n = e.toString(16);
	if (n.length > t * 2) throw RangeError("number too large");
	return E(n.padStart(t * 2, "0"));
}
function xe(e, t) {
	return be(e, t).reverse();
}
function Se(e) {
	return Uint8Array.from(A(e));
}
function Ce(e) {
	if (typeof e != "string") throw TypeError("ascii string expected, got " + typeof e);
	return Uint8Array.from(e, (t, n) => {
		let r = t.charCodeAt(0);
		if (t.length !== 1 || r > 127) throw RangeError(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
		return r;
	});
}
var we = (e) => typeof e == "bigint" && j <= e;
function Te(e, t, n) {
	return we(e) && we(t) && we(n) && t <= e && e < n;
}
function Ee(e, t, n, r) {
	if (!Te(t, n, r)) throw RangeError("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function De(e) {
	if (e < j) throw Error("expected non-negative bigint, got " + e);
	let t = 0;
	for (; e > j; e >>= me, t += 1);
	return t;
}
var Oe = (e) => (me << BigInt(e)) - me;
function ke(e, t = {}, n = {}) {
	if (Object.prototype.toString.call(e) !== "[object Object]") throw TypeError("expected valid options object");
	function r(t, n, r) {
		if (!r && n !== "function" && !Object.hasOwn(e, t)) throw TypeError(`param "${t}" is invalid: expected own property`);
		let i = e[t];
		if (r && i === void 0) return;
		let a = typeof i;
		if (a !== n || i === null) throw TypeError(`param "${t}" is invalid: expected ${n}, got ${a}`);
	}
	let i = (e, t) => Object.entries(e).forEach(([e, n]) => r(e, n, t));
	i(t, !1), i(n, !0);
}
var P = /* @__PURE__ */ BigInt(0), F = /* @__PURE__ */ BigInt(1), Ae = /* @__PURE__ */ BigInt(2), je = /* @__PURE__ */ BigInt(3), Me = /* @__PURE__ */ BigInt(4), Ne = /* @__PURE__ */ BigInt(5), Pe = /* @__PURE__ */ BigInt(7), I = /* @__PURE__ */ BigInt(8), Fe = /* @__PURE__ */ BigInt(9), Ie = /* @__PURE__ */ BigInt(16);
function L(e, t) {
	if (t <= P) throw Error("mod: expected positive modulus, got " + t);
	let n = e % t;
	return n >= P ? n : t + n;
}
function R(e, t, n) {
	if (t < P) throw Error("pow2: expected non-negative exponent, got " + t);
	let r = e;
	for (; t-- > P;) r *= r, r %= n;
	return r;
}
function Le(e, t) {
	if (e === P) throw Error("invert: expected non-zero number");
	if (t <= P) throw Error("invert: expected positive modulus, got " + t);
	let n = L(e, t), r = t, i = P, a = F;
	for (; n !== P;) {
		let e = r / n, t = r - n * e, o = i - a * e;
		r = n, n = t, i = a, a = o;
	}
	if (r !== F) throw Error("invert: does not exist");
	return L(i, t);
}
function Re(e, t, n) {
	let r = e;
	if (!r.eql(r.sqr(t), n)) throw Error("Cannot find square root");
}
function ze(e, t) {
	let n = e, r = (n.ORDER + F) / Me, i = n.pow(t, r);
	return Re(n, i, t), i;
}
function Be(e, t) {
	let n = e, r = (n.ORDER - Ne) / I, i = n.mul(t, Ae), a = n.pow(i, r), o = n.mul(t, a), s = n.mul(n.mul(o, Ae), a), c = n.mul(o, n.sub(s, n.ONE));
	return Re(n, c, t), c;
}
function Ve(e) {
	let t = Xe(e), n = He(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + Pe) / Ie;
	return (e, t) => {
		let n = e, s = n.pow(t, o), c = n.mul(s, r), l = n.mul(s, i), u = n.mul(s, a), d = n.eql(n.sqr(c), t), f = n.eql(n.sqr(l), t);
		s = n.cmov(s, c, d), c = n.cmov(u, l, f);
		let p = n.eql(n.sqr(c), t), m = n.cmov(s, c, p);
		return Re(n, m, t), m;
	};
}
function He(e) {
	if (e < je) throw Error("sqrt is not defined for small field");
	let t = e - F, n = 0;
	for (; t % Ae === P;) t /= Ae, n++;
	let r = Ae, i = Xe(e);
	for (; z(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return ze;
	let a = i.pow(r, t), o = (t + F) / Ae;
	return function(e, r) {
		let i = e;
		if (i.is0(r)) return r;
		if (z(i, r) !== 1) throw Error("Cannot find square root");
		let s = n, c = i.mul(i.ONE, a), l = i.pow(r, t), u = i.pow(r, o);
		for (; !i.eql(l, i.ONE);) {
			if (i.is0(l)) return i.ZERO;
			let e = 1, t = i.sqr(l);
			for (; !i.eql(t, i.ONE);) if (e++, t = i.sqr(t), e === s) throw Error("Cannot find square root");
			let n = F << BigInt(s - e - 1), r = i.pow(c, n);
			s = e, c = i.sqr(r), l = i.mul(l, c), u = i.mul(u, r);
		}
		return u;
	};
}
function Ue(e) {
	return e % Me === je ? ze : e % I === Ne ? Be : e % Ie === Fe ? Ve(e) : He(e);
}
var We = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function Ge(e) {
	if (ke(e, We.reduce((e, t) => (e[t] = "function", e), {
		ORDER: "bigint",
		BYTES: "number",
		BITS: "number"
	})), ge(e.BYTES, "BYTES"), ge(e.BITS, "BITS"), e.BYTES < 1 || e.BITS < 1) throw Error("invalid field: expected BYTES/BITS > 0");
	if (e.ORDER <= F) throw Error("invalid field: expected ORDER > 1, got " + e.ORDER);
	return e;
}
function Ke(e, t, n) {
	let r = e;
	if (n < P) throw Error("invalid exponent, negatives unsupported");
	if (n === P) return r.ONE;
	if (n === F) return t;
	let i = r.ONE, a = t;
	for (; n > P;) n & F && (i = r.mul(i, a)), a = r.sqr(a), n >>= F;
	return i;
}
function qe(e, t, n = !1) {
	let r = e, i = Array(t.length).fill(n ? r.ZERO : void 0), a = t.reduce((e, t, n) => r.is0(t) ? e : (i[n] = e, r.mul(e, t)), r.ONE), o = r.inv(a);
	return t.reduceRight((e, t, n) => r.is0(t) ? e : (i[n] = r.mul(e, i[n]), r.mul(e, t)), o), i;
}
function z(e, t) {
	let n = e, r = (n.ORDER - F) / Ae, i = n.pow(t, r), a = n.eql(i, n.ONE), o = n.eql(i, n.ZERO), s = n.eql(i, n.neg(n.ONE));
	if (!a && !o && !s) throw Error("invalid Legendre symbol result");
	return a ? 1 : o ? 0 : -1;
}
function B(e, t) {
	if (t !== void 0 && ue(t), e <= P) throw Error("invalid n length: expected positive n, got " + e);
	if (t !== void 0 && t < 1) throw Error("invalid n length: expected positive bit length, got " + t);
	let n = De(e);
	if (t !== void 0 && t < n) throw Error(`invalid n length: expected bit length (${n}) >= n.length (${t})`);
	let r = t === void 0 ? n : t;
	return {
		nBitLength: r,
		nByteLength: Math.ceil(r / 8)
	};
}
var Je = /* @__PURE__ */ new WeakMap(), Ye = class {
	constructor(e, t = {}) {
		if (f(this, "ORDER"), f(this, "BITS"), f(this, "BYTES"), f(this, "isLE"), f(this, "ZERO", P), f(this, "ONE", F), f(this, "_lengths"), f(this, "_mod"), e <= F) throw Error("invalid field: expected ORDER > 1, got " + e);
		let n;
		this.isLE = !1, typeof t == "object" && t && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && Object.defineProperty(this, "sqrt", {
			value: t.sqrt,
			enumerable: !0
		}), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = Object.freeze(t.allowedLengths.slice())), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
		let { nBitLength: r, nByteLength: i } = B(e, n);
		if (i > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = e, this.BITS = r, this.BYTES = i, Object.freeze(this);
	}
	create(e) {
		return L(e, this.ORDER);
	}
	isValid(e) {
		if (typeof e != "bigint") throw TypeError("invalid field element: expected bigint, got " + typeof e);
		return P <= e && e < this.ORDER;
	}
	is0(e) {
		return e === P;
	}
	isValidNot0(e) {
		return !this.is0(e) && this.isValid(e);
	}
	isOdd(e) {
		return (e & F) === F;
	}
	neg(e) {
		return L(-e, this.ORDER);
	}
	eql(e, t) {
		return e === t;
	}
	sqr(e) {
		return L(e * e, this.ORDER);
	}
	add(e, t) {
		return L(e + t, this.ORDER);
	}
	sub(e, t) {
		return L(e - t, this.ORDER);
	}
	mul(e, t) {
		return L(e * t, this.ORDER);
	}
	pow(e, t) {
		return Ke(this, e, t);
	}
	div(e, t) {
		return L(e * Le(t, this.ORDER), this.ORDER);
	}
	sqrN(e) {
		return e * e;
	}
	addN(e, t) {
		return e + t;
	}
	subN(e, t) {
		return e - t;
	}
	mulN(e, t) {
		return e * t;
	}
	inv(e) {
		return Le(e, this.ORDER);
	}
	sqrt(e) {
		let t = Je.get(this);
		return t || Je.set(this, t = Ue(this.ORDER)), t(this, e);
	}
	toBytes(e) {
		return this.isLE ? xe(e, this.BYTES) : be(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		A(e);
		let { _lengths: n, BYTES: r, isLE: i, ORDER: a, _mod: o } = this;
		if (n) {
			if (e.length < 1 || !n.includes(e.length) || e.length > r) throw Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
			let t = new Uint8Array(r);
			t.set(e, i ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== r) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
		let s = i ? ye(e) : ve(e);
		if (o && (s = L(s, a)), !t && !this.isValid(s)) throw Error("invalid field element: outside of range 0..ORDER");
		return s;
	}
	invertBatch(e) {
		return qe(this, e);
	}
	cmov(e, t, n) {
		return M(n, "condition"), n ? t : e;
	}
};
Object.freeze(Ye.prototype);
function Xe(e, t = {}) {
	return new Ye(e, t);
}
function Ze(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	if (e <= F) throw Error("field order must be greater than 1");
	let t = De(e - F);
	return Math.ceil(t / 8);
}
function Qe(e) {
	let t = Ze(e);
	return t + Math.ceil(t / 2);
}
function $e(e, t, n = !1) {
	A(e);
	let r = e.length, i = Ze(t), a = Math.max(Qe(t), 16);
	if (r < a || r > 1024) throw Error("expected " + a + "-1024 bytes of input, got " + r);
	let o = L(n ? ye(e) : ve(e), t - F) + F;
	return n ? xe(o, i) : be(o, i);
}
var V = /* @__PURE__ */ BigInt(0), H = /* @__PURE__ */ BigInt(1);
function et(e, t) {
	let n = t.negate();
	return e ? n : t;
}
function tt(e, t) {
	let n = qe(e.Fp, t.map((e) => e.Z));
	return t.map((t, r) => e.fromAffine(t.toAffine(n[r])));
}
function nt(e, t) {
	if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function rt(e, t) {
	nt(e, t);
	let n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e;
	return {
		windows: n,
		windowSize: r,
		mask: Oe(e),
		maxNumber: i,
		shiftBy: BigInt(e)
	};
}
function it(e, t, n) {
	let { windowSize: r, mask: i, maxNumber: a, shiftBy: o } = n, s = Number(e & i), c = e >> o;
	s > r && (s -= a, c += H);
	let l = t * r, u = l + Math.abs(s) - 1, d = s === 0, f = s < 0, p = t % 2 != 0;
	return {
		nextN: c,
		offset: u,
		isZero: d,
		isNeg: f,
		isNegF: p,
		offsetF: l
	};
}
var at = /* @__PURE__ */ new WeakMap(), ot = /* @__PURE__ */ new WeakMap();
function U(e) {
	return ot.get(e) || 1;
}
function st(e) {
	if (e !== V) throw Error("invalid wNAF");
}
var ct = class {
	constructor(e, t) {
		f(this, "BASE"), f(this, "ZERO"), f(this, "Fn"), f(this, "bits"), this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = t;
	}
	_unsafeLadder(e, t, n = this.ZERO) {
		let r = e;
		for (; t > V;) t & H && (n = n.add(r)), r = r.double(), t >>= H;
		return n;
	}
	precomputeWindow(e, t) {
		let { windows: n, windowSize: r } = rt(t, this.bits), i = [], a = e, o = a;
		for (let e = 0; e < n; e++) {
			o = a, i.push(o);
			for (let e = 1; e < r; e++) o = o.add(a), i.push(o);
			a = o.double();
		}
		return i;
	}
	wNAF(e, t, n) {
		if (!this.Fn.isValid(n)) throw Error("invalid scalar");
		let r = this.ZERO, i = this.BASE, a = rt(e, this.bits);
		for (let e = 0; e < a.windows; e++) {
			let { nextN: o, offset: s, isZero: c, isNeg: l, isNegF: u, offsetF: d } = it(n, e, a);
			n = o, c ? i = i.add(et(u, t[d])) : r = r.add(et(l, t[s]));
		}
		return st(n), {
			p: r,
			f: i
		};
	}
	wNAFUnsafe(e, t, n, r = this.ZERO) {
		let i = rt(e, this.bits);
		for (let e = 0; e < i.windows && n !== V; e++) {
			let { nextN: a, offset: o, isZero: s, isNeg: c } = it(n, e, i);
			if (n = a, !s) {
				let e = t[o];
				r = r.add(c ? e.negate() : e);
			}
		}
		return st(n), r;
	}
	getPrecomputes(e, t, n) {
		let r = at.get(t);
		return r || (r = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (r = n(r)), at.set(t, r))), r;
	}
	cached(e, t, n) {
		let r = U(e);
		return this.wNAF(r, this.getPrecomputes(r, e, n), t);
	}
	unsafe(e, t, n, r) {
		let i = U(e);
		return i === 1 ? this._unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
	}
	createCache(e, t) {
		nt(t, this.bits), ot.set(e, t), at.delete(e);
	}
	hasCache(e) {
		return U(e) !== 1;
	}
};
function lt(e, t, n, r) {
	let i = t, a = e.ZERO, o = e.ZERO;
	for (; n > V || r > V;) n & H && (a = a.add(i)), r & H && (o = o.add(i)), i = i.double(), n >>= H, r >>= H;
	return {
		p1: a,
		p2: o
	};
}
function ut(e, t, n) {
	if (t) {
		if (t.ORDER !== e) throw Error("Field.ORDER must match order: Fp == p, Fn == n");
		return Ge(t), t;
	}
	return Xe(e, { isLE: n });
}
function dt(e, t, n = {}, r) {
	if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw Error(`expected valid ${e} CURVE object`);
	for (let e of [
		"p",
		"n",
		"h"
	]) {
		let n = t[e];
		if (!(typeof n == "bigint" && n > V)) throw Error(`CURVE.${e} must be positive bigint`);
	}
	let i = ut(t.p, n.Fp, r), a = ut(t.n, n.Fn, r);
	for (let e of [
		"Gx",
		"Gy",
		"a",
		"b"
	]) if (!i.isValid(t[e])) throw Error(`CURVE.${e} must be valid field element of CURVE.Fp`);
	return t = Object.freeze(Object.assign({}, t)), {
		CURVE: t,
		Fp: i,
		Fn: a
	};
}
function ft(e, t) {
	return function(n) {
		let r = e(n);
		return {
			secretKey: r,
			publicKey: t(r)
		};
	};
}
var pt = (e, t) => (e + (e >= 0 ? t : -t) / gt) / t;
function mt(e, t, n) {
	Ee("scalar", e, ht, n);
	let [[r, i], [a, o]] = t, s = pt(o * e, n), c = pt(-i * e, n), l = e - s * r - c * a, u = -s * i - c * o, d = l < ht, f = u < ht;
	d && (l = -l), f && (u = -u);
	let p = Oe(Math.ceil(De(n) / 2)) + G;
	if (l < ht || l >= p || u < ht || u >= p) throw Error("splitScalar (endomorphism): failed for k");
	return {
		k1neg: d,
		k1: l,
		k2neg: f,
		k2: u
	};
}
var W = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = W;
			if (ge(e, "tag"), e < 0 || e > 255) throw new n("tlv.encode: wrong tag");
			if (typeof t != "string") throw TypeError("\"data\" expected string, got type=" + typeof t);
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = N(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? N(i.length / 2 | 128) : "";
			return N(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = W;
			t = A(t, void 0, "DER data");
			let r = 0;
			if (e < 0 || e > 255) throw new n("tlv.encode: wrong tag");
			if (t.length < 2 || t[r++] !== e) throw new n("tlv.decode: wrong tlv");
			let i = t[r++], a = !!(i & 128), o = 0;
			if (!a) o = i;
			else {
				let e = i & 127;
				if (!e) throw new n("tlv.decode(long): indefinite length not supported");
				if (e > 4) throw new n("tlv.decode(long): byte length is too big");
				let a = t.subarray(r, r + e);
				if (a.length !== e) throw new n("tlv.decode: length bytes not complete");
				if (a[0] === 0) throw new n("tlv.decode(long): zero leftmost byte");
				for (let e of a) o = o << 8 | e;
				if (r += e, o < 128) throw new n("tlv.decode(long): not minimal encoding");
			}
			let s = t.subarray(r, r + o);
			if (s.length !== o) throw new n("tlv.decode: wrong value length");
			return {
				v: s,
				l: t.subarray(r + o)
			};
		}
	},
	_int: {
		encode(e) {
			let { Err: t } = W;
			if (he(e), e < ht) throw new t("integer: negative integers are not allowed");
			let n = N(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = W;
			if (e.length < 1) throw new t("invalid signature integer: empty");
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e.length > 1 && e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return ve(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: n, _tlv: r } = W, i = A(e, void 0, "signature"), { v: a, l: o } = r.decode(48, i);
		if (o.length) throw new t("invalid signature: left bytes after parsing");
		let { v: s, l: c } = r.decode(2, a), { v: l, l: u } = r.decode(2, c);
		if (u.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: n.decode(s),
			s: n.decode(l)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = W, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
};
Object.freeze(W._tlv), Object.freeze(W._int), Object.freeze(W);
var ht = /* @__PURE__ */ BigInt(0), G = /* @__PURE__ */ BigInt(1), gt = /* @__PURE__ */ BigInt(2), _t = /* @__PURE__ */ BigInt(3), vt = /* @__PURE__ */ BigInt(4);
function yt(e, t = {}) {
	let n = dt("weierstrass", e, t), r = n.Fp, i = n.Fn, a = n.CURVE, { h: o, n: s } = a;
	ke(t, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object"
	});
	let { endo: c, allowInfinityPoint: l } = t;
	if (c && (!r.is0(a.a) || typeof c.beta != "bigint" || !Array.isArray(c.basises))) throw Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	let u = xt(r, i);
	function d() {
		if (!r.isOdd) throw Error("compression is not supported: Field does not have .isOdd()");
	}
	function p(e, t, n) {
		if (l && t.is0()) return Uint8Array.of(0);
		let { x: i, y: a } = t.toAffine(), o = r.toBytes(i);
		return M(n, "isCompressed"), n ? (d(), fe(bt(!r.isOdd(a)), o)) : fe(Uint8Array.of(4), o, r.toBytes(a));
	}
	function m(e) {
		A(e, void 0, "Point");
		let { publicKey: t, publicKeyUncompressed: n } = u, i = e.length, a = e[0], o = e.subarray(1);
		if (l && i === 1 && a === 0) return {
			x: r.ZERO,
			y: r.ZERO
		};
		if (i === t && (a === 2 || a === 3)) {
			let e = r.fromBytes(o);
			if (!r.isValid(e)) throw Error("bad point: is not on curve, wrong x");
			let t = _(e), n;
			try {
				n = r.sqrt(t);
			} catch (e) {
				let t = e instanceof Error ? ": " + e.message : "";
				throw Error("bad point: is not on curve, sqrt error" + t);
			}
			d();
			let i = r.isOdd(n);
			return (a & 1) == 1 !== i && (n = r.neg(n)), {
				x: e,
				y: n
			};
		}
		if (i === n && a === 4) {
			let e = r.BYTES, t = r.fromBytes(o.subarray(0, e)), n = r.fromBytes(o.subarray(e, e * 2));
			if (!v(t, n)) throw Error("bad point: is not on curve");
			return {
				x: t,
				y: n
			};
		}
		throw Error(`bad point: got length ${i}, expected compressed=${t} or uncompressed=${n}`);
	}
	let h = t.toBytes === void 0 ? p : t.toBytes, g = t.fromBytes === void 0 ? m : t.fromBytes;
	function _(e) {
		let t = r.sqr(e), n = r.mul(t, e);
		return r.add(r.add(n, r.mul(e, a.a)), a.b);
	}
	function v(e, t) {
		let n = r.sqr(t), i = _(e);
		return r.eql(n, i);
	}
	if (!v(a.Gx, a.Gy)) throw Error("bad curve params: generator point");
	let y = r.mul(r.pow(a.a, _t), vt), b = r.mul(r.sqr(a.b), BigInt(27));
	if (r.is0(r.add(y, b))) throw Error("bad curve params: a or b");
	function x(e, t, n = !1) {
		if (!r.isValid(t) || n && r.is0(t)) throw Error(`bad point coordinate ${e}`);
		return t;
	}
	function S(e) {
		if (!(e instanceof E)) throw Error("Weierstrass Point expected");
	}
	function C(e) {
		if (!c || !c.basises) throw Error("no endo");
		return mt(e, c.basises, i.ORDER);
	}
	function w(e, t, n, i, a) {
		return n = new E(r.mul(n.X, e), n.Y, n.Z), t = et(i, t), n = et(a, n), t.add(n);
	}
	let T = class e {
		constructor(e, t, n) {
			f(this, "X"), f(this, "Y"), f(this, "Z"), this.X = x("x", e), this.Y = x("y", t, !0), this.Z = x("z", n), Object.freeze(this);
		}
		static CURVE() {
			return a;
		}
		static fromAffine(t) {
			let { x: n, y: i } = t || {};
			if (!t || !r.isValid(n) || !r.isValid(i)) throw Error("invalid affine point");
			if (t instanceof e) throw Error("projective point not allowed");
			return r.is0(n) && r.is0(i) ? e.ZERO : new e(n, i, r.ONE);
		}
		static fromBytes(t) {
			let n = e.fromAffine(g(A(t, void 0, "point")));
			return n.assertValidity(), n;
		}
		static fromHex(t) {
			return e.fromBytes(pe(t));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(e = 8, t = !0) {
			return D.createCache(this, e), t || this.multiply(_t), this;
		}
		assertValidity() {
			let e = this;
			if (e.is0()) {
				if (t.allowInfinityPoint && r.is0(e.X) && r.eql(e.Y, r.ONE) && r.is0(e.Z)) return;
				throw Error("bad point: ZERO");
			}
			let { x: n, y: i } = e.toAffine();
			if (!r.isValid(n) || !r.isValid(i)) throw Error("bad point: x or y not field elements");
			if (!v(n, i)) throw Error("bad point: equation left != right");
			if (!e.isTorsionFree()) throw Error("bad point: not in prime-order subgroup");
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (!r.isOdd) throw Error("Field doesn't support isOdd");
			return !r.isOdd(e);
		}
		equals(e) {
			S(e);
			let { X: t, Y: n, Z: i } = this, { X: a, Y: o, Z: s } = e, c = r.eql(r.mul(t, s), r.mul(a, i)), l = r.eql(r.mul(n, s), r.mul(o, i));
			return c && l;
		}
		negate() {
			return new e(this.X, r.neg(this.Y), this.Z);
		}
		double() {
			let { a: t, b: n } = a, i = r.mul(n, _t), { X: o, Y: s, Z: c } = this, l = r.ZERO, u = r.ZERO, d = r.ZERO, f = r.mul(o, o), p = r.mul(s, s), m = r.mul(c, c), h = r.mul(o, s);
			return h = r.add(h, h), d = r.mul(o, c), d = r.add(d, d), l = r.mul(t, d), u = r.mul(i, m), u = r.add(l, u), l = r.sub(p, u), u = r.add(p, u), u = r.mul(l, u), l = r.mul(h, l), d = r.mul(i, d), m = r.mul(t, m), h = r.sub(f, m), h = r.mul(t, h), h = r.add(h, d), d = r.add(f, f), f = r.add(d, f), f = r.add(f, m), f = r.mul(f, h), u = r.add(u, f), m = r.mul(s, c), m = r.add(m, m), f = r.mul(m, h), l = r.sub(l, f), d = r.mul(m, p), d = r.add(d, d), d = r.add(d, d), new e(l, u, d);
		}
		add(t) {
			S(t);
			let { X: n, Y: i, Z: o } = this, { X: s, Y: c, Z: l } = t, u = r.ZERO, d = r.ZERO, f = r.ZERO, p = a.a, m = r.mul(a.b, _t), h = r.mul(n, s), g = r.mul(i, c), _ = r.mul(o, l), v = r.add(n, i), y = r.add(s, c);
			v = r.mul(v, y), y = r.add(h, g), v = r.sub(v, y), y = r.add(n, o);
			let b = r.add(s, l);
			return y = r.mul(y, b), b = r.add(h, _), y = r.sub(y, b), b = r.add(i, o), u = r.add(c, l), b = r.mul(b, u), u = r.add(g, _), b = r.sub(b, u), f = r.mul(p, y), u = r.mul(m, _), f = r.add(u, f), u = r.sub(g, f), f = r.add(g, f), d = r.mul(u, f), g = r.add(h, h), g = r.add(g, h), _ = r.mul(p, _), y = r.mul(m, y), g = r.add(g, _), _ = r.sub(h, _), _ = r.mul(p, _), y = r.add(y, _), h = r.mul(g, y), d = r.add(d, h), h = r.mul(b, y), u = r.mul(v, u), u = r.sub(u, h), h = r.mul(v, g), f = r.mul(b, f), f = r.add(f, h), new e(u, d, f);
		}
		subtract(e) {
			return S(e), this.add(e.negate());
		}
		is0() {
			return this.equals(e.ZERO);
		}
		multiply(n) {
			let { endo: r } = t;
			if (!i.isValidNot0(n)) throw RangeError("invalid scalar: out of range");
			let a, o, s = (t) => D.cached(this, t, (t) => tt(e, t));
			if (r) {
				let { k1neg: e, k1: t, k2neg: i, k2: c } = C(n), { p: l, f: u } = s(t), { p: d, f } = s(c);
				o = u.add(f), a = w(r.beta, l, d, e, i);
			} else {
				let { p: e, f: t } = s(n);
				a = e, o = t;
			}
			return tt(e, [a, o])[0];
		}
		multiplyUnsafe(n) {
			let { endo: r } = t, a = this, o = n;
			if (!i.isValid(o)) throw RangeError("invalid scalar: out of range");
			if (o === ht || a.is0()) return e.ZERO;
			if (o === G) return a;
			if (D.hasCache(this)) return this.multiply(o);
			if (r) {
				let { k1neg: t, k1: n, k2neg: i, k2: s } = C(o), { p1: c, p2: l } = lt(e, a, n, s);
				return w(r.beta, c, l, t, i);
			}
			return D.unsafe(a, o);
		}
		toAffine(e) {
			let t = this, n = e, { X: i, Y: a, Z: o } = t;
			if (r.eql(o, r.ONE)) return {
				x: i,
				y: a
			};
			let s = t.is0();
			n ??= s ? r.ONE : r.inv(o);
			let c = r.mul(i, n), l = r.mul(a, n), u = r.mul(o, n);
			if (s) return {
				x: r.ZERO,
				y: r.ZERO
			};
			if (!r.eql(u, r.ONE)) throw Error("invZ was invalid");
			return {
				x: c,
				y: l
			};
		}
		isTorsionFree() {
			let { isTorsionFree: n } = t;
			return o === G ? !0 : n ? n(e, this) : D.unsafe(this, s).is0();
		}
		clearCofactor() {
			let { clearCofactor: n } = t;
			return o === G ? this : n ? n(e, this) : this.multiplyUnsafe(o);
		}
		isSmallOrder() {
			return o === G ? this.is0() : this.clearCofactor().is0();
		}
		toBytes(t = !0) {
			return M(t, "isCompressed"), this.assertValidity(), h(e, this, t);
		}
		toHex(e = !0) {
			return de(this.toBytes(e));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	};
	f(T, "BASE", new T(a.Gx, a.Gy, r.ONE)), f(T, "ZERO", new T(r.ZERO, r.ONE, r.ZERO)), f(T, "Fp", r), f(T, "Fn", i);
	let E = T, ee = i.BITS, D = new ct(E, t.endo ? Math.ceil(ee / 2) : ee);
	return ee >= 8 && E.BASE.precompute(8), Object.freeze(E.prototype), Object.freeze(E), E;
}
function bt(e) {
	return Uint8Array.of(e ? 2 : 3);
}
function xt(e, t) {
	return {
		secretKey: t.BYTES,
		publicKey: 1 + e.BYTES,
		publicKeyUncompressed: 1 + 2 * e.BYTES,
		publicKeyHasPrefix: !0,
		signature: 2 * t.BYTES
	};
}
var St = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, K = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
}, Ct = /* @__PURE__ */ BigInt(0), wt = /* @__PURE__ */ BigInt(2);
function Tt(e) {
	let t = St.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = R(R(R(u, n, t) * u % t, n, t) * u % t, wt, t) * l % t, f = R(d, i, t) * d % t, p = R(f, a, t) * f % t, m = R(p, s, t) * p % t, h = R(R(R(R(R(R(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, wt, t);
	if (!Et.eql(Et.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var Et = Xe(St.p, { sqrt: Tt }), Dt = /* @__PURE__ */ yt(St, {
	Fp: Et,
	endo: K
}), Ot = {};
function kt(e, ...t) {
	let n = Ot[e];
	if (n === void 0) {
		let t = le(Ce(e));
		n = fe(t, t), Ot[e] = n;
	}
	return le(fe(n, ...t));
}
var At = (e) => e.toBytes(!0).slice(1), jt = (e) => e % wt === Ct;
function Mt(e) {
	let { Fn: t, BASE: n } = Dt, r = t.fromBytes(e), i = n.multiply(r);
	return {
		scalar: jt(i.y) ? r : t.neg(r),
		bytes: At(i)
	};
}
function q(e) {
	let t = Et;
	if (!t.isValidNot0(e)) throw Error("invalid x: Fail if x ≥ p");
	let n = t.create(e * e), r = t.create(n * e + BigInt(7)), i = t.sqrt(r);
	jt(i) || (i = t.neg(i));
	let a = Dt.fromAffine({
		x: e,
		y: i
	});
	return a.assertValidity(), a;
}
var Nt = ve;
function Pt(...e) {
	return Dt.Fn.create(Nt(kt("BIP0340/challenge", ...e)));
}
function Ft(e) {
	return Mt(e).bytes;
}
function J(e, t, n = te(32)) {
	let { Fn: r, BASE: i } = Dt, a = A(e, void 0, "message"), { bytes: o, scalar: s } = Mt(t), c = A(n, 32, "auxRand"), l = kt("BIP0340/nonce", r.toBytes(s ^ Nt(kt("BIP0340/aux", c))), o, a), u = r.create(Nt(l));
	if (u === 0n) throw Error("sign failed: k is zero");
	let d = i.multiply(u), f = jt(d.y) ? u : r.neg(u), p = At(d), m = Pt(p, o, a), h = /* @__PURE__ */ new Uint8Array(64);
	if (h.set(p, 0), h.set(r.toBytes(r.create(f + m * s)), 32), !It(h, a, o)) throw Error("sign: Invalid signature produced");
	return h;
}
function It(e, t, n) {
	let { Fp: r, Fn: i, BASE: a } = Dt, o = A(e, 64, "signature"), s = A(t, void 0, "message"), c = A(n, 32, "publicKey");
	try {
		let e = q(Nt(c)), t = Nt(o.subarray(0, 32));
		if (!r.isValidNot0(t)) return !1;
		let n = Nt(o.subarray(32, 64));
		if (!i.isValidNot0(n)) return !1;
		let l = Pt(i.toBytes(t), At(e), s), u = a.multiplyUnsafe(n).add(e.multiplyUnsafe(i.neg(l))), { x: d, y: f } = u.toAffine();
		return !(u.is0() || !jt(f) || d !== t);
	} catch {
		return !1;
	}
}
var Lt = /* @__PURE__ */ (() => {
	let e = (e) => (e = e === void 0 ? te(48) : e, $e(e, St.n));
	return Object.freeze({
		keygen: ft(e, Ft),
		getPublicKey: Ft,
		sign: J,
		verify: It,
		Point: Dt,
		utils: Object.freeze({
			randomSecretKey: e,
			taggedHash: kt,
			lift_x: q,
			pointToBytes: At
		}),
		lengths: Object.freeze({
			secretKey: 32,
			publicKey: 32,
			publicKeyHasPrefix: !1,
			signature: 64,
			seed: 48
		})
	});
})();
function Rt(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function zt(e, t) {
	return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((e) => typeof e == "string") : t.every((e) => Number.isSafeInteger(e)) : !1;
}
function Bt(e) {
	if (typeof e != "function") throw Error("function expected");
	return !0;
}
function Y(e, t) {
	if (typeof t != "string") throw Error(`${e}: string expected`);
	return !0;
}
function X(e) {
	if (!Number.isSafeInteger(e)) throw Error(`invalid integer: ${e}`);
}
function Vt(e) {
	if (!Array.isArray(e)) throw Error("array expected");
}
function Ht(e, t) {
	if (!zt(!0, t)) throw Error(`${e}: array of strings expected`);
}
function Ut(e, t) {
	if (!zt(!1, t)) throw Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Wt(...e) {
	let t = (e) => e, n = (e, t) => (n) => e(t(n));
	return {
		encode: e.map((e) => e.encode).reduceRight(n, t),
		decode: e.map((e) => e.decode).reduce(n, t)
	};
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	let t = typeof e == "string" ? e.split("") : e, n = t.length;
	Ht("alphabet", t);
	let r = new Map(t.map((e, t) => [e, t]));
	return {
		encode: (r) => (Vt(r), r.map((r) => {
			if (!Number.isSafeInteger(r) || r < 0 || r >= n) throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);
			return t[r];
		})),
		decode: (t) => (Vt(t), t.map((t) => {
			Y("alphabet.decode", t);
			let n = r.get(t);
			if (n === void 0) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
			return n;
		}))
	};
}
// @__NO_SIDE_EFFECTS__
function Kt(e = "") {
	return Y("join", e), {
		encode: (t) => (Ht("join.decode", t), t.join(e)),
		decode: (t) => (Y("join.decode", t), t.split(e))
	};
}
var qt = (e, t) => t === 0 ? e : qt(t, e % t), Jt = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - qt(e, t)), Yt = /* @__PURE__ */ (() => {
	let e = [];
	for (let t = 0; t < 40; t++) e.push(2 ** t);
	return e;
})();
function Xt(e, t, n, r) {
	if (Vt(e), t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (/* @__PURE__ */ Jt(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ Jt(t, n)}`);
	let i = 0, a = 0, o = Yt[t], s = Yt[n] - 1, c = [];
	for (let r of e) {
		if (X(r), r >= o) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
		if (i = i << t | r, a + t > 32) throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);
		for (a += t; a >= n; a -= n) c.push((i >> a - n & s) >>> 0);
		let e = Yt[a];
		if (e === void 0) throw Error("invalid carry");
		i &= e - 1;
	}
	if (i = i << n - a & s, !r && a >= t) throw Error("Excess padding");
	if (!r && i > 0) throw Error(`Non-zero padding: ${i}`);
	return r && a > 0 && c.push(i >>> 0), c;
}
// @__NO_SIDE_EFFECTS__
function Zt(e, t = !1) {
	if (X(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ Jt(8, e) > 32 || /* @__PURE__ */ Jt(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!Rt(n)) throw Error("radix2.encode input should be Uint8Array");
			return Xt(Array.from(n), 8, e, !t);
		},
		decode: (n) => (Ut("radix2.decode", n), Uint8Array.from(Xt(n, e, 8, t)))
	};
}
function Qt(e) {
	return Bt(e), function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
var $t = /* @__PURE__ */ Wt(/* @__PURE__ */ Gt("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ Kt("")), en = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function tn(e) {
	let t = e >> 25, n = (e & 33554431) << 5;
	for (let e = 0; e < en.length; e++) (t >> e & 1) == 1 && (n ^= en[e]);
	return n;
}
function nn(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = tn(i) ^ n >> 5;
	}
	i = tn(i);
	for (let t = 0; t < r; t++) i = tn(i) ^ e.charCodeAt(t) & 31;
	for (let e of t) i = tn(i) ^ e;
	for (let e = 0; e < 6; e++) i = tn(i);
	return i ^= n, $t.encode(Xt([i % Yt[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function rn(e) {
	let t = e === "bech32" ? 1 : 734539939, n = /* @__PURE__ */ Zt(5), r = n.decode, i = n.encode, a = Qt(r);
	function o(e, n, r = 90) {
		Y("bech32.encode prefix", e), Rt(n) && (n = Array.from(n)), Ut("bech32.encode", n);
		let i = e.length;
		if (i === 0) throw TypeError(`Invalid prefix length ${i}`);
		let a = i + 7 + n.length;
		if (r !== !1 && a > r) throw TypeError(`Length ${a} exceeds limit ${r}`);
		let o = e.toLowerCase(), s = nn(o, n, t);
		return `${o}1${$t.encode(n)}${s}`;
	}
	function s(e, n = 90) {
		Y("bech32.decode input", e);
		let r = e.length;
		if (r < 8 || n !== !1 && r > n) throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);
		let i = e.toLowerCase();
		if (e !== i && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
		let a = i.lastIndexOf("1");
		if (a === 0 || a === -1) throw Error("Letter \"1\" must be present between prefix and data only");
		let o = i.slice(0, a), s = i.slice(a + 1);
		if (s.length < 6) throw Error("Data must be at least 6 characters long");
		let c = $t.decode(s).slice(0, -6), l = nn(o, c, t);
		if (!s.endsWith(l)) throw Error(`Invalid checksum in ${e}: expected "${l}"`);
		return {
			prefix: o,
			words: c
		};
	}
	let c = Qt(s);
	function l(e) {
		let { prefix: t, words: n } = s(e, !1);
		return {
			prefix: t,
			words: n,
			bytes: r(n)
		};
	}
	function u(e, t) {
		return o(e, i(t));
	}
	return {
		encode: o,
		decode: s,
		encodeFromBytes: u,
		decodeToBytes: l,
		decodeUnsafe: c,
		fromWords: r,
		fromWordsUnsafe: a,
		toWords: i
	};
}
var an = /* @__PURE__ */ rn("bech32"), on = new TextEncoder();
function sn(e) {
	return C(le(on.encode(e)));
}
var cn = {
	sign: (e, t) => C(Lt.sign(E(e), E(t))),
	verify: (e, t, n) => Lt.verify(E(e), E(t), E(n)),
	getPublicKey: (e) => C(Lt.getPublicKey(E(e)))
};
function ln(e) {
	return cn.getPublicKey(e);
}
function un(e) {
	return sn(JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]));
}
function dn(e, t) {
	return cn.sign(e, t);
}
function fn(e) {
	try {
		return cn.verify(e.sig, un(e), e.pubkey);
	} catch (e) {
		return console.warn("The following error occurred during verify():", e), !1;
	}
}
function pn(e) {
	let { words: t } = an.decode(e);
	return C(new Uint8Array(an.fromWords(t)));
}
function mn(e, t) {
	let n = e.startsWith("nsec1") ? pn(e) : e, r = ln(n);
	return {
		async signEvent(e) {
			let i = {
				...e,
				pubkey: e.pubkey ?? r,
				tags: [...e.tags ?? [], ...t?.tags ?? []],
				created_at: e.created_at ?? Math.floor(Date.now() / 1e3)
			};
			if (hn(i)) return i;
			let a = i.id ?? un(i), o = i.sig ?? dn(a, n);
			return {
				...i,
				id: a,
				sig: o
			};
		},
		async getPublicKey() {
			return r;
		}
	};
}
function hn(e) {
	if (typeof e.id != "string" || typeof e.sig != "string" || typeof e.kind != "number" || typeof e.pubkey != "string" || typeof e.content != "string" || typeof e.created_at != "number" || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] == "object") return !1;
	}
	return !0;
}
var gn = async (e) => fn(e), _n = class {
	constructor(e) {
		f(this, "timer"), f(this, "fireNext", []), f(this, "takeNext", []), this.timer = setInterval(() => {
			for (let e of this.fireNext) e();
			this.fireNext = this.takeNext, this.takeNext = [];
		}, e);
	}
	set(e) {
		this.takeNext.push(e);
	}
	stop() {
		clearInterval(this.timer);
	}
}, vn = ({ worker: e, fallback: t, tags: n, timeout: r }) => {
	let i = "prepared", a = 1, o = /* @__PURE__ */ new Map(), s = new _n(r ?? 1e4), c = t ?? gn, l = (t) => {
		let n = a++, r = new Promise((e, t) => {
			o.set(n, e), s.set(() => {
				o.get(n) && (t(/* @__PURE__ */ Error("Verification request was timed out.")), o.delete(n));
			});
		});
		return e?.postMessage({
			reqId: n,
			event: t
		}), r;
	}, u = (e) => {
		var t;
		if (i === "terminated") return;
		if (e.data === "pong") {
			i = "active";
			return;
		}
		let { reqId: n, ok: r } = e.data;
		(t = o.get(n)) == null || t(r), o.delete(n);
	}, d = () => {
		i !== "terminated" && (i = "error");
	}, f = () => {
		i === "prepared" && (i = "booting", e.addEventListener("message", u), e.addEventListener("error", d), e.addEventListener("messageerror", d), e.postMessage("ping"));
	}, p = (e) => {
		switch (e = {
			...e,
			tags: [...e.tags ?? [], ...n ?? []]
		}, i) {
			case "prepared": throw Error("VerificationServiceClient is not started yet.");
			case "booting":
			case "error": return c(e);
			case "active": return l(e);
			case "terminated": throw Error("VerificationServiceClient is already disposed.");
		}
	}, m = () => {
		i !== "terminated" && (i = "terminated", e.removeEventListener("message", u), e.removeEventListener("error", d), e.removeEventListener("messageerror", d), e.terminate(), s.stop());
	};
	return {
		start: f,
		verifier: p,
		get status() {
			return i;
		},
		dispose: m,
		[Symbol.dispose]: m
	};
}, yn = "eHagakiDB", bn = "[pubkeyHex+postedAt+createdAt+eventId]", xn = [
	"pubkeyHex",
	"postedAt",
	"createdAt",
	"eventId"
];
// D:/ドキュメント/GitHub/ehagaki/src/lib/swIndexedDbSchema.ts
function Z(e, t, n, r = []) {
	if (e.objectStoreNames.contains(t)) return;
	let i = e.createObjectStore(t, { keyPath: n });
	r.forEach((e) => {
		i.createIndex(e.name, e.keyPath);
	});
}
function Sn(e, t = "sharedMedia", n) {
	Z(e, "events", "id"), Z(e, "eventStoreMigration", "id");
	let r = e.objectStoreNames.contains("postHistory");
	if (Z(e, "emojiItems", "id", [
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "identityKey",
			keyPath: "identityKey"
		},
		{
			name: "shortcodeLower",
			keyPath: "shortcodeLower"
		},
		{
			name: "sortIndex",
			keyPath: "sortIndex"
		},
		{
			name: "sourceType",
			keyPath: "sourceType"
		},
		{
			name: "sourceAddress",
			keyPath: "sourceAddress"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "[pubkeyHex+sortIndex]",
			keyPath: ["pubkeyHex", "sortIndex"]
		},
		{
			name: "[pubkeyHex+identityKey]",
			keyPath: ["pubkeyHex", "identityKey"]
		}
	]), Z(e, "emojiCacheMeta", "pubkeyHex", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, "drafts", "id", [
		{
			name: "scopeKey",
			keyPath: "scopeKey"
		},
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "timestamp",
			keyPath: "timestamp"
		},
		{
			name: "[scopeKey+updatedAt]",
			keyPath: ["scopeKey", "updatedAt"]
		}
	]), Z(e, "profiles", "pubkeyHex", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "updatedAtFromEvent",
			keyPath: "updatedAtFromEvent"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, "relayConfigs", "pubkeyHex", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "updatedAtFromEvent",
			keyPath: "updatedAtFromEvent"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, t, "id", [
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, "hashtagHistory", "tagLower", [
		{
			name: "useCount",
			keyPath: "useCount"
		},
		{
			name: "lastUsed",
			keyPath: "lastUsed"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, "customEmojiUsage", "id", [
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "shortcodeLower",
			keyPath: "shortcodeLower"
		},
		{
			name: "src",
			keyPath: "src"
		},
		{
			name: "lastUsedAt",
			keyPath: "lastUsedAt"
		},
		{
			name: "count",
			keyPath: "count"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		},
		{
			name: "[pubkeyHex+lastUsedAt]",
			keyPath: ["pubkeyHex", "lastUsedAt"]
		},
		{
			name: "[pubkeyHex+shortcodeLower+src]",
			keyPath: [
				"pubkeyHex",
				"shortcodeLower",
				"src"
			]
		}
	]), Z(e, "customEmojiImageMeta", "url", [
		{
			name: "width",
			keyPath: "width"
		},
		{
			name: "height",
			keyPath: "height"
		},
		{
			name: "aspectRatio",
			keyPath: "aspectRatio"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "lastAccessedAt",
			keyPath: "lastAccessedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, "uploadDestinations", "id", [
		{
			name: "scopeKey",
			keyPath: "scopeKey"
		},
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "protocol",
			keyPath: "protocol"
		},
		{
			name: "presetId",
			keyPath: "presetId"
		},
		{
			name: "isDefault",
			keyPath: "isDefault"
		},
		{
			name: "enabled",
			keyPath: "enabled"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "[scopeKey+isDefault]",
			keyPath: ["scopeKey", "isDefault"]
		},
		{
			name: "[scopeKey+enabled]",
			keyPath: ["scopeKey", "enabled"]
		}
	]), Z(e, "postHistory", "id", [
		{
			name: "eventId",
			keyPath: "eventId"
		},
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "kind",
			keyPath: "kind"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "postedAt",
			keyPath: "postedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "deletedAt",
			keyPath: "deletedAt"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "lastSeenAt",
			keyPath: "lastSeenAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		},
		{
			name: "[pubkeyHex+postedAt]",
			keyPath: ["pubkeyHex", "postedAt"]
		},
		{
			name: "[pubkeyHex+createdAt]",
			keyPath: ["pubkeyHex", "createdAt"]
		},
		{
			name: bn,
			keyPath: xn
		}
	]), Z(e, "sensitivePayloads", "id", [
		{
			name: "pubkeyHex",
			keyPath: "pubkeyHex"
		},
		{
			name: "structureKind",
			keyPath: "structureKind"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "deletedAt",
			keyPath: "deletedAt"
		}
	]), r && n) {
		let e = n.objectStore("postHistory");
		e.indexNames?.contains("[pubkeyHex+postedAt+createdAt+eventId]") || e.createIndex(bn, xn);
	}
	Z(e, "postHistoryChildInteractions", "id", [
		{
			name: "eventId",
			keyPath: "eventId"
		},
		{
			name: "parentEventId",
			keyPath: "parentEventId"
		},
		{
			name: "rootEventId",
			keyPath: "rootEventId"
		},
		{
			name: "authorPubkey",
			keyPath: "authorPubkey"
		},
		{
			name: "kind",
			keyPath: "kind"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		},
		{
			name: "[parentEventId+createdAt]",
			keyPath: ["parentEventId", "createdAt"]
		}
	]), Z(e, "postHistoryDeletionRequests", "id", [
		{
			name: "targetEventId",
			keyPath: "targetEventId"
		},
		{
			name: "targetAuthorPubkey",
			keyPath: "targetAuthorPubkey"
		},
		{
			name: "deletionEventId",
			keyPath: "deletionEventId"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "[targetAuthorPubkey+targetEventId]",
			keyPath: ["targetAuthorPubkey", "targetEventId"]
		}
	]), Z(e, "postMediaCache", "cacheKey", [
		{
			name: "url",
			keyPath: "url"
		},
		{
			name: "normalizedUrl",
			keyPath: "normalizedUrl"
		},
		{
			name: "size",
			keyPath: "size"
		},
		{
			name: "createdAt",
			keyPath: "createdAt"
		},
		{
			name: "lastAccessedAt",
			keyPath: "lastAccessedAt"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "source",
			keyPath: "source"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, "channelMetadata", "channelEventId", [
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "metadataCreatedAt",
			keyPath: "metadataCreatedAt"
		},
		{
			name: "creatorPubkey",
			keyPath: "creatorPubkey"
		},
		{
			name: "updatedAt",
			keyPath: "updatedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Z(e, "channelImageCacheMeta", "url", [
		{
			name: "responseType",
			keyPath: "responseType"
		},
		{
			name: "fetchedAt",
			keyPath: "fetchedAt"
		},
		{
			name: "lastAttemptAt",
			keyPath: "lastAttemptAt"
		},
		{
			name: "lastAccessedAt",
			keyPath: "lastAccessedAt"
		},
		{
			name: "schemaVersion",
			keyPath: "schemaVersion"
		}
	]), Q(e, "postHistoryExternalCoverage"), Q(e, "postHistoryCitrineRanges"), Q(e, "postHistoryLocalBrowsingRanges"), Q(e, "postHistoryLocalResumeCursor"), Q(e, "postHistoryJumpAnchors", !1), Q(e, "postHistoryAuthoredSyncCursor", !1), Q(e, "postHistoryInboundSyncCursor", !1), Q(e, "postHistoryDirectReplyFetchMeta", !1), Q(e, "postHistoryWriteGeneration", !1), Q(e, "postHistoryChildWriteGeneration", !1), Z(e, "postHistoryReactionDeletionAttempts", "id", [{
		name: "parentEventId",
		keyPath: "parentEventId"
	}, {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]), Z(e, "postHistoryReplyDeletionAttempts", "id", [{
		name: "parentEventId",
		keyPath: "parentEventId"
	}, {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]), Z(e, "notifications", "id", [
		{
			name: "ownerPubkeyHex",
			keyPath: "ownerPubkeyHex"
		},
		{
			name: "[ownerPubkeyHex+createdAt+eventId]",
			keyPath: [
				"ownerPubkeyHex",
				"createdAt",
				"eventId"
			]
		},
		{
			name: "[ownerPubkeyHex+unread]",
			keyPath: ["ownerPubkeyHex", "unread"]
		}
	]), Q(e, "notificationSyncState"), Q(e, "legacyImportState", !1);
}
function Q(e, t, n = !0) {
	Z(e, t, "id", [...n ? [{
		name: "ownerPubkeyHex",
		keyPath: "ownerPubkeyHex"
	}] : [], {
		name: "updatedAt",
		keyPath: "updatedAt"
	}]);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/legacyImportMarkers.ts
var Cn = "migrated.localStorage.drafts.v1", wn = "migrated.localStorage.hashtagHistory.v1", Tn = "migrated.localStorage.uploadEndpoint.v1.", En = "migrated.localStorage.profile.v1.", Dn = "migrated.localStorage.relayConfig.v1.";
function On(e) {
	return `${Tn}${e}`;
}
function kn(e) {
	return `${En}${e}`;
}
function An(e) {
	return `${Dn}${e}`;
}
function jn(e) {
	return e === "migrated.localStorage.drafts.v1" || e === "migrated.localStorage.hashtagHistory.v1" || e.startsWith("migrated.localStorage.uploadEndpoint.v1.");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/ehagakiDbMigration.ts
function Mn(e, t, n, r = []) {
	let i = e.objectStoreNames.contains("meta"), a = n !== 0 && i && !!t;
	if (Sn(e, "sharedMedia", t), !a || !t) return;
	e.deleteObjectStore("meta");
	let o = t.objectStore("legacyImportState"), s = Date.now();
	for (let e of r) o.put({
		id: e.id,
		done: !0,
		updatedAt: typeof e.updatedAt == "number" ? e.updatedAt : s
	});
}
function Nn({ indexedDb: e, version: t, databaseName: n = yn, legacyMarkers: r = [], onBlocked: i, onBlockedResolved: a }) {
	return new Promise((o, s) => {
		let c = t == null ? e.open(n) : e.open(n, t), l = !1;
		c.onupgradeneeded = (e) => {
			Mn(c.result, c.transaction, e.oldVersion, r);
		}, c.onblocked = () => {
			l = !0, i?.();
		}, c.onerror = () => {
			s(c.error ?? /* @__PURE__ */ Error("IndexedDB open failed"));
		}, c.onsuccess = () => {
			l && a?.();
			let e = c.result;
			e.onversionchange = () => e.close(), o(e);
		};
	});
}
async function Pn(e, t = {}) {
	let n = t.databaseName ?? "eHagakiDB", r = await In(e, n);
	if (r !== null && !Fn(r)) return;
	let i = await Ln(e, n, t);
	Fn(i.version) && (await Nn({
		indexedDb: e,
		version: 190,
		databaseName: n,
		legacyMarkers: i.markers,
		onBlocked: t.onBlocked,
		onBlockedResolved: t.onBlockedResolved
	})).close();
}
function Fn(e) {
	if (e >= 200) throw new DOMException("The database is newer than this page.", "VersionError");
	return e < 190;
}
async function In(e, t) {
	if (typeof e.databases != "function") return null;
	try {
		let n = (await e.databases()).find((e) => e.name === t);
		return n && typeof n.version == "number" && n.version > 0 ? n.version : null;
	} catch {
		return null;
	}
}
async function Ln(e, t, n) {
	let r = await Nn({
		indexedDb: e,
		version: null,
		databaseName: t,
		onBlocked: n.onBlocked,
		onBlockedResolved: n.onBlockedResolved
	});
	r.onversionchange = () => {
		r.close();
	};
	try {
		let e = r.version;
		return {
			version: e,
			markers: e >= 190 ? [] : await Rn(r)
		};
	} finally {
		r.close();
	}
}
async function Rn(e) {
	if (!e.objectStoreNames.contains("meta")) return [];
	let t = e.transaction("meta", "readonly").objectStore("meta").getAll(), n = await new Promise((e, n) => {
		t.onsuccess = () => {
			e(Array.isArray(t.result) ? t.result : []);
		}, t.onerror = () => {
			n(t.error ?? /* @__PURE__ */ Error("Failed to read legacy import markers"));
		};
	}), r = Date.now(), i = [];
	for (let e of n) {
		if (!e || typeof e != "object") continue;
		let t = e;
		typeof t.key == "string" && t.value === !0 && jn(t.key) && i.push({
			id: t.key,
			done: !0,
			updatedAt: typeof t.updatedAt == "number" ? t.updatedAt : r
		});
	}
	return i;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/eventStoreMigration.ts
function zn(e) {
	try {
		if (!o(e)) return null;
		let t = a(e);
		return n(t) && un(t) === t.id && r(t) ? { event: t } : null;
	} catch {
		return null;
	}
}
var Bn = "shared-events-v19", Vn = 100, Hn = () => ({
	id: Bn,
	tableIndex: 0,
	lastKey: "",
	done: !1
}), Un = (e) => new Promise((t, n) => {
	e.onsuccess = () => t(e.result), e.onerror = () => n(e.error);
}), Wn = (e) => new Promise((t, n) => {
	e.oncomplete = () => t(), e.onabort = e.onerror = () => n(e.error ?? /* @__PURE__ */ Error("event_store_migration_aborted"));
});
async function Gn(e) {
	for (;;) {
		let t = e.transaction(["eventStoreMigration", ...s], "readonly"), n = await Un(t.objectStore("eventStoreMigration").get(Bn)) ?? Hn();
		if (n.done) return;
		let r = s[n.tableIndex], a = await Un(t.objectStore(r).getAll(n.lastKey ? IDBKeyRange.lowerBound(n.lastKey, !0) : void 0, Vn)), o = a.map((e) => l(e, r)), u = /* @__PURE__ */ new Map();
		for (let e of o.flatMap((e) => e.items)) {
			let t = zn(e.event);
			if (!t) continue;
			let n = u.get(t.event.id), r = e.receivedAt ?? Date.now();
			u.set(t.event.id, {
				id: t.event.id,
				rawEvent: t.event,
				verification: {
					status: "valid",
					ruleVersion: 1
				},
				relayUrls: i.sanitizeExternalRelayUrls([...n?.relayUrls ?? [], ...e.relayUrls ?? []]),
				receivedAt: Math.min(n?.receivedAt ?? r, r),
				lastSeenAt: Math.max(n?.lastSeenAt ?? r, r),
				relatedEventIds: [.../* @__PURE__ */ new Set([
					...n?.relatedEventIds ?? [],
					...e.relatedEventIds ?? [],
					...t.event.tags.flatMap((e) => [
						"e",
						"q",
						"c"
					].includes(e[0]) && /^[0-9a-f]{64}$/.test(e[1] ?? "") ? [e[1]] : [])
				])],
				deletedAt: n?.deletedAt ?? e.deletedAt,
				deletionEventId: n?.deletionEventId ?? e.deletionEventId
			});
		}
		let d = e.transaction([
			"eventStoreMigration",
			"events",
			r
		], "readwrite"), f = Wn(d);
		try {
			let e = d.objectStore("eventStoreMigration"), t = await Un(e.get(Bn)) ?? Hn();
			if (t.tableIndex !== n.tableIndex || t.lastKey !== n.lastKey || t.done) {
				await f;
				continue;
			}
			let l = d.objectStore("events");
			for (let e of u.values()) {
				let t = await Un(l.get(e.id));
				l.put({
					...e,
					...t ? {
						rawEvent: t.rawEvent,
						relayUrls: i.sanitizeExternalRelayUrls([...t.relayUrls, ...e.relayUrls]),
						receivedAt: Math.min(t.receivedAt, e.receivedAt),
						lastSeenAt: Math.max(t.lastSeenAt, e.lastSeenAt),
						relatedEventIds: [.../* @__PURE__ */ new Set([...t.relatedEventIds, ...e.relatedEventIds])],
						deletedAt: t.deletedAt ?? e.deletedAt,
						deletionEventId: t.deletionEventId ?? e.deletionEventId
					} : {}
				});
			}
			for (let e = 0; e < o.length; e++) {
				let t = o[e], n = c(t.metadata, r), i = u.has(n) || n && await Un(l.get(n)), s = {
					...a[e],
					...r === "postHistory" || r === "sensitivePayloads" || r === "postHistoryDeletionRequests" ? { rawEventVerification: {
						status: "invalid",
						ruleVersion: 1
					} } : {}
				};
				d.objectStore(r).put(i ? t.metadata : s);
			}
			let p = a.length < Vn;
			e.put({
				id: Bn,
				tableIndex: n.tableIndex + +!!p,
				lastKey: p ? "" : String(a.at(-1).id),
				done: p && n.tableIndex === s.length - 1
			}), await f;
		} catch (e) {
			try {
				d.abort();
			} catch {}
			throw await f.catch(() => void 0), e;
		}
	}
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/dexie/import-wrapper-prod.mjs
var Kn = /* @__PURE__ */ e((/* @__PURE__ */ t(((e, t, n) => {
	((n, r) => {
		typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self).Dexie = r();
	})(n, function() {
		var e = function(t, n) {
			return (e = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? function(e, t) {
				e.__proto__ = t;
			} : function(e, t) {
				for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
			}))(t, n);
		}, t = function() {
			return (t = Object.assign || function(e) {
				for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
				return e;
			}).apply(this, arguments);
		};
		function n(e, t, n) {
			if (n || arguments.length === 2) for (var r, i = 0, a = t.length; i < a; i++) !r && i in t || ((r ||= Array.prototype.slice.call(t, 0, i))[i] = t[i]);
			return e.concat(r || Array.prototype.slice.call(t));
		}
		var r = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, i = Object.keys, a = Array.isArray;
		function o(e, t) {
			return typeof t == "object" && i(t).forEach(function(n) {
				e[n] = t[n];
			}), e;
		}
		typeof Promise > "u" || r.Promise || (r.Promise = Promise);
		var s = Object.getPrototypeOf, c = {}.hasOwnProperty;
		function l(e, t) {
			return c.call(e, t);
		}
		function u(e, t) {
			typeof t == "function" && (t = t(s(e))), (typeof Reflect > "u" ? i : Reflect.ownKeys)(t).forEach(function(n) {
				f(e, n, t[n]);
			});
		}
		var d = Object.defineProperty;
		function f(e, t, n, r) {
			d(e, t, o(n && l(n, "get") && typeof n.get == "function" ? {
				get: n.get,
				set: n.set,
				configurable: !0
			} : {
				value: n,
				configurable: !0,
				writable: !0
			}, r));
		}
		function p(e) {
			return { from: function(t) {
				return e.prototype = Object.create(t.prototype), f(e.prototype, "constructor", e), { extend: u.bind(null, e.prototype) };
			} };
		}
		var m = Object.getOwnPropertyDescriptor, h = [].slice;
		function g(e, t, n) {
			return h.call(e, t, n);
		}
		function _(e, t) {
			return t(e);
		}
		function v(e) {
			if (!e) throw Error("Assertion Failed");
		}
		function y(e) {
			r.setImmediate ? setImmediate(e) : setTimeout(e, 0);
		}
		function b(e, t) {
			if (typeof t == "string" && l(e, t)) return e[t];
			if (!t) return e;
			if (typeof t != "string") {
				for (var n = [], r = 0, i = t.length; r < i; ++r) {
					var a = b(e, t[r]);
					n.push(a);
				}
				return n;
			}
			var o, s = t.indexOf(".");
			return s === -1 || (o = e[t.substr(0, s)]) == null ? void 0 : b(o, t.substr(s + 1));
		}
		function x(e, t, n) {
			if (e && t !== void 0 && !("isFrozen" in Object && Object.isFrozen(e))) {
				if (typeof t != "string" && "length" in t) {
					v(typeof n != "string" && "length" in n);
					for (var r = 0, i = t.length; r < i; ++r) x(e, t[r], n[r]);
				} else {
					var o = t.indexOf(".");
					if (o !== -1) {
						var s = t.substr(0, o), o = t.substr(o + 1);
						if (o === "") n === void 0 ? a(e) && !isNaN(parseInt(s)) ? e.splice(s, 1) : delete e[s] : e[s] = n;
						else {
							var c = e[s];
							if (!c || !l(e, s)) {
								if (n === void 0) return;
								c = e[s] = {};
							}
							x(c, o, n);
						}
					} else n === void 0 ? a(e) && !isNaN(parseInt(t)) ? e.splice(t, 1) : delete e[t] : e[t] = n;
				}
			}
		}
		function S(e) {
			var t, n = {};
			for (t in e) l(e, t) && (n[t] = e[t]);
			return n;
		}
		var C = [].concat;
		function w(e) {
			return C.apply([], e);
		}
		var T = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(w([
			8,
			16,
			32,
			64
		].map(function(e) {
			return [
				"Int",
				"Uint",
				"Float"
			].map(function(t) {
				return t + e + "Array";
			});
		}))).filter(function(e) {
			return r[e];
		}), E = new Set(T.map(function(e) {
			return r[e];
		})), ee = null;
		function D(e) {
			return ee = /* @__PURE__ */ new WeakMap(), e = function e(t) {
				if (!t || typeof t != "object") return t;
				var n = ee.get(t);
				if (n) return n;
				if (a(t)) {
					n = [], ee.set(t, n);
					for (var r = 0, i = t.length; r < i; ++r) n.push(e(t[r]));
				} else if (E.has(t.constructor)) n = t;
				else {
					var o, c = s(t);
					for (o in n = c === Object.prototype ? {} : Object.create(c), ee.set(t, n), t) l(t, o) && (n[o] = e(t[o]));
				}
				return n;
			}(e), ee = null, e;
		}
		var te = {}.toString;
		function ne(e) {
			return te.call(e).slice(8, -1);
		}
		var re = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", ie = typeof re == "symbol" ? function(e) {
			var t;
			return e != null && (t = e[re]) && t.apply(e);
		} : function() {
			return null;
		};
		function ae(e, t) {
			t = e.indexOf(t), 0 <= t && e.splice(t, 1);
		}
		var O = {};
		function oe(e) {
			var t, n, r, i;
			if (arguments.length === 1) {
				if (a(e)) return e.slice();
				if (this === O && typeof e == "string") return [e];
				if (i = ie(e)) for (n = []; !(r = i.next()).done;) n.push(r.value);
				else {
					if (e == null || typeof (t = e.length) != "number") return [e];
					for (n = Array(t); t--;) n[t] = e[t];
				}
			} else for (t = arguments.length, n = Array(t); t--;) n[t] = arguments[t];
			return n;
		}
		var se = typeof Symbol < "u" ? function(e) {
			return e[Symbol.toStringTag] === "AsyncFunction";
		} : function() {
			return !1;
		}, T = [
			"Unknown",
			"Constraint",
			"Data",
			"TransactionInactive",
			"ReadOnly",
			"Version",
			"NotFound",
			"InvalidState",
			"InvalidAccess",
			"Abort",
			"Timeout",
			"QuotaExceeded",
			"Syntax",
			"DataClone"
		], k = [
			"Modify",
			"Bulk",
			"OpenFailed",
			"VersionChange",
			"Schema",
			"Upgrade",
			"InvalidTable",
			"MissingAPI",
			"NoSuchDatabase",
			"InvalidArgument",
			"SubTransaction",
			"Unsupported",
			"Internal",
			"DatabaseClosed",
			"PrematureCommit",
			"ForeignAwait"
		].concat(T), ce = {
			VersionChanged: "Database version changed by other database connection",
			DatabaseClosed: "Database has been closed",
			Abort: "Transaction aborted",
			TransactionInactive: "Transaction has already completed or failed",
			MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
		};
		function le(e, t) {
			this.name = e, this.message = t;
		}
		function A(e, t) {
			return e + ". Errors: " + Object.keys(t).map(function(e) {
				return t[e].toString();
			}).filter(function(e, t, n) {
				return n.indexOf(e) === t;
			}).join("\n");
		}
		function ue(e, t, n, r) {
			this.failures = t, this.failedKeys = r, this.successCount = n, this.message = A(e, t);
		}
		function de(e, t) {
			this.name = "BulkError", this.failures = Object.keys(t).map(function(e) {
				return t[e];
			}), this.failuresByPos = t, this.message = A(e, this.failures);
		}
		p(le).from(Error).extend({ toString: function() {
			return this.name + ": " + this.message;
		} }), p(ue).from(le), p(de).from(le);
		var fe = k.reduce(function(e, t) {
			return e[t] = t + "Error", e;
		}, {}), pe = le, j = k.reduce(function(e, t) {
			var n = t + "Error";
			function r(e, r) {
				this.name = n, e ? typeof e == "string" ? (this.message = `${e}${r ? "\n " + r : ""}`, this.inner = r || null) : typeof e == "object" && (this.message = `${e.name} ${e.message}`, this.inner = e) : (this.message = ce[t] || n, this.inner = null);
			}
			return p(r).from(pe), e[t] = r, e;
		}, {}), me = (j.Syntax = SyntaxError, j.Type = TypeError, j.Range = RangeError, T.reduce(function(e, t) {
			return e[t + "Error"] = j[t], e;
		}, {}));
		T = k.reduce(function(e, t) {
			return [
				"Syntax",
				"Type",
				"Range"
			].indexOf(t) === -1 && (e[t + "Error"] = j[t]), e;
		}, {});
		function M() {}
		function he(e) {
			return e;
		}
		function ge(e, t) {
			return e == null || e === he ? t : function(n) {
				return t(e(n));
			};
		}
		function N(e, t) {
			return function() {
				e.apply(this, arguments), t.apply(this, arguments);
			};
		}
		function _e(e, t) {
			return e === M ? t : function() {
				var n = e.apply(this, arguments), r = (n !== void 0 && (arguments[0] = n), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return r && (this.onsuccess = this.onsuccess ? N(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? N(i, this.onerror) : i), a === void 0 ? n : a;
			};
		}
		function ve(e, t) {
			return e === M ? t : function() {
				e.apply(this, arguments);
				var n = this.onsuccess, r = this.onerror;
				this.onsuccess = this.onerror = null, t.apply(this, arguments), n && (this.onsuccess = this.onsuccess ? N(n, this.onsuccess) : n), r && (this.onerror = this.onerror ? N(r, this.onerror) : r);
			};
		}
		function ye(e, t) {
			return e === M ? t : function() {
				var n = e.apply(this, arguments), r = (o(arguments[0], n), this.onsuccess), i = this.onerror, a = (this.onsuccess = null, this.onerror = null, t.apply(this, arguments));
				return r && (this.onsuccess = this.onsuccess ? N(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? N(i, this.onerror) : i), n === void 0 ? a === void 0 ? void 0 : a : o(n, a);
			};
		}
		function be(e, t) {
			return e === M ? t : function() {
				return !1 !== t.apply(this, arguments) && e.apply(this, arguments);
			};
		}
		function xe(e, t) {
			return e === M ? t : function() {
				var n = e.apply(this, arguments);
				if (n && typeof n.then == "function") {
					for (var r = this, i = arguments.length, a = Array(i); i--;) a[i] = arguments[i];
					return n.then(function() {
						return t.apply(r, a);
					});
				}
				return t.apply(this, arguments);
			};
		}
		T.ModifyError = ue, T.DexieError = le, T.BulkError = de;
		var Se = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
		function Ce(e) {
			Se = e;
		}
		var we = {}, Te = 100, Ee = typeof Promise > "u" ? [] : (k = Promise.resolve(), typeof crypto < "u" && crypto.subtle ? [
			Ee = crypto.subtle.digest("SHA-512", new Uint8Array([0])),
			s(Ee),
			k
		] : [
			k,
			s(k),
			k
		]), k = Ee[0], De = Ee[1], De = De && De.then, Oe = k && k.constructor, ke = !!Ee[2], P = function(e, t) {
			Fe.push([e, t]), Ae &&= (queueMicrotask(Ue), !1);
		}, F = !0, Ae = !0, je = [], Me = [], Ne = he, Pe = {
			id: "global",
			global: !0,
			ref: 0,
			unhandleds: [],
			onunhandled: M,
			pgp: !1,
			env: {},
			finalize: M
		}, I = Pe, Fe = [], Ie = 0, L = [];
		function R(e) {
			if (typeof this != "object") throw TypeError("Promises must be constructed via new");
			this._listeners = [], this._lib = !1;
			var t = this._PSD = I;
			if (typeof e != "function") {
				if (e !== we) throw TypeError("Not a function");
				this._state = arguments[1], this._value = arguments[2], !1 === this._state && ze(this, this._value);
			} else this._state = null, this._value = null, ++t.ref, function e(t, n) {
				try {
					n(function(n) {
						if (t._state === null) {
							if (n === t) throw TypeError("A promise cannot be resolved with itself.");
							var r = t._lib && We();
							n && typeof n.then == "function" ? e(t, function(e, t) {
								n instanceof R ? n._then(e, t) : n.then(e, t);
							}) : (t._state = !0, t._value = n, Be(t)), r && Ge();
						}
					}, ze.bind(null, t));
				} catch (e) {
					ze(t, e);
				}
			}(this, e);
		}
		var Le = {
			get: function() {
				var e = I, t = Ze;
				function n(n, r) {
					var i = this, a = !e.global && (e !== I || t !== Ze), o = a && !H(), s = new R(function(t, s) {
						Ve(i, new Re(at(n, e, a, o), at(r, e, a, o), t, s, e));
					});
					return this._consoleTask && (s._consoleTask = this._consoleTask), s;
				}
				return n.prototype = we, n;
			},
			set: function(e) {
				f(this, "then", e && e.prototype === we ? Le : {
					get: function() {
						return e;
					},
					set: Le.set
				});
			}
		};
		function Re(e, t, n, r, i) {
			this.onFulfilled = typeof e == "function" ? e : null, this.onRejected = typeof t == "function" ? t : null, this.resolve = n, this.reject = r, this.psd = i;
		}
		function ze(e, t) {
			var n, r;
			Me.push(t), e._state === null && (n = e._lib && We(), t = Ne(t), e._state = !1, e._value = t, r = e, je.some(function(e) {
				return e._value === r._value;
			}) || je.push(r), Be(e), n) && Ge();
		}
		function Be(e) {
			var t = e._listeners;
			e._listeners = [];
			for (var n = 0, r = t.length; n < r; ++n) Ve(e, t[n]);
			var i = e._PSD;
			--i.ref || i.finalize(), Ie === 0 && (++Ie, P(function() {
				--Ie == 0 && Ke();
			}, []));
		}
		function Ve(e, t) {
			if (e._state === null) e._listeners.push(t);
			else {
				var n = e._state ? t.onFulfilled : t.onRejected;
				if (n === null) return (e._state ? t.resolve : t.reject)(e._value);
				++t.psd.ref, ++Ie, P(He, [
					n,
					e,
					t
				]);
			}
		}
		function He(e, t, n) {
			try {
				var r, i = t._value;
				!t._state && Me.length && (Me = []), r = Se && t._consoleTask ? t._consoleTask.run(function() {
					return e(i);
				}) : e(i), t._state || Me.indexOf(i) !== -1 || ((e) => {
					for (var t = je.length; t;) if (je[--t]._value === e._value) return je.splice(t, 1);
				})(t), n.resolve(r);
			} catch (e) {
				n.reject(e);
			} finally {
				--Ie == 0 && Ke(), --n.psd.ref || n.psd.finalize();
			}
		}
		function Ue() {
			it(Pe, function() {
				We() && Ge();
			});
		}
		function We() {
			var e = F;
			return Ae = F = !1, e;
		}
		function Ge() {
			var e, t, n;
			do
				for (; 0 < Fe.length;) for (e = Fe, Fe = [], n = e.length, t = 0; t < n; ++t) {
					var r = e[t];
					r[0].apply(null, r[1]);
				}
			while (0 < Fe.length);
			Ae = F = !0;
		}
		function Ke() {
			for (var e = je, t = (je = [], e.forEach(function(e) {
				e._PSD.onunhandled.call(null, e._value, e);
			}), L.slice(0)), n = t.length; n;) t[--n]();
		}
		function qe(e) {
			return new R(we, !1, e);
		}
		function z(e, t) {
			var n = I;
			return function() {
				var r = We(), i = I;
				try {
					return nt(n, !0), e.apply(this, arguments);
				} catch (e) {
					t && t(e);
				} finally {
					nt(i, !1), r && Ge();
				}
			};
		}
		u(R.prototype, {
			then: Le,
			_then: function(e, t) {
				Ve(this, new Re(null, null, e, t, I));
			},
			catch: function(e) {
				var t, n;
				return arguments.length === 1 ? this.then(null, e) : (t = e, n = arguments[1], typeof t == "function" ? this.then(null, function(e) {
					return (e instanceof t ? n : qe)(e);
				}) : this.then(null, function(e) {
					return (e && e.name === t ? n : qe)(e);
				}));
			},
			finally: function(e) {
				return this.then(function(t) {
					return R.resolve(e()).then(function() {
						return t;
					});
				}, function(t) {
					return R.resolve(e()).then(function() {
						return qe(t);
					});
				});
			},
			timeout: function(e, t) {
				var n = this;
				return e < 1 / 0 ? new R(function(r, i) {
					var a = setTimeout(function() {
						return i(new j.Timeout(t));
					}, e);
					n.then(r, i).finally(clearTimeout.bind(null, a));
				}) : this;
			}
		}), typeof Symbol < "u" && Symbol.toStringTag && f(R.prototype, Symbol.toStringTag, "Dexie.Promise"), Pe.env = rt(), u(R, {
			all: function() {
				var e = oe.apply(null, arguments).map(et);
				return new R(function(t, n) {
					e.length === 0 && t([]);
					var r = e.length;
					e.forEach(function(i, a) {
						return R.resolve(i).then(function(n) {
							e[a] = n, --r || t(e);
						}, n);
					});
				});
			},
			resolve: function(e) {
				return e instanceof R ? e : e && typeof e.then == "function" ? new R(function(t, n) {
					e.then(t, n);
				}) : new R(we, !0, e);
			},
			reject: qe,
			race: function() {
				var e = oe.apply(null, arguments).map(et);
				return new R(function(t, n) {
					e.map(function(e) {
						return R.resolve(e).then(t, n);
					});
				});
			},
			PSD: {
				get: function() {
					return I;
				},
				set: function(e) {
					return I = e;
				}
			},
			totalEchoes: { get: function() {
				return Ze;
			} },
			newPSD: $e,
			usePSD: it,
			scheduler: {
				get: function() {
					return P;
				},
				set: function(e) {
					P = e;
				}
			},
			rejectionMapper: {
				get: function() {
					return Ne;
				},
				set: function(e) {
					Ne = e;
				}
			},
			follow: function(e, t) {
				return new R(function(n, r) {
					return $e(function(t, n) {
						var r = I;
						r.unhandleds = [], r.onunhandled = n, r.finalize = N(function() {
							var e, r = this;
							e = function() {
								r.unhandleds.length === 0 ? t() : n(r.unhandleds[0]);
							}, L.push(function t() {
								e(), L.splice(L.indexOf(t), 1);
							}), ++Ie, P(function() {
								--Ie == 0 && Ke();
							}, []);
						}, r.finalize), e();
					}, t, n, r);
				});
			}
		}), Oe && (Oe.allSettled && f(R, "allSettled", function() {
			var e = oe.apply(null, arguments).map(et);
			return new R(function(t) {
				e.length === 0 && t([]);
				var n = e.length, r = Array(n);
				e.forEach(function(e, i) {
					return R.resolve(e).then(function(e) {
						return r[i] = {
							status: "fulfilled",
							value: e
						};
					}, function(e) {
						return r[i] = {
							status: "rejected",
							reason: e
						};
					}).then(function() {
						return --n || t(r);
					});
				});
			});
		}), Oe.any && typeof AggregateError < "u" && f(R, "any", function() {
			var e = oe.apply(null, arguments).map(et);
			return new R(function(t, n) {
				e.length === 0 && n(/* @__PURE__ */ AggregateError([]));
				var r = e.length, i = Array(r);
				e.forEach(function(e, a) {
					return R.resolve(e).then(function(e) {
						return t(e);
					}, function(e) {
						i[a] = e, --r || n(AggregateError(i));
					});
				});
			});
		}), Oe.withResolvers) && (R.withResolvers = Oe.withResolvers);
		var B = {
			awaits: 0,
			echoes: 0,
			id: 0
		}, Je = 0, Ye = [], Xe = 0, Ze = 0, Qe = 0;
		function $e(e, t, n, r) {
			var i = I, a = Object.create(i), t = (a.parent = i, a.ref = 0, a.global = !1, a.id = ++Qe, Pe.env, a.env = ke ? {
				Promise: R,
				PromiseProp: {
					value: R,
					configurable: !0,
					writable: !0
				},
				all: R.all,
				race: R.race,
				allSettled: R.allSettled,
				any: R.any,
				resolve: R.resolve,
				reject: R.reject
			} : {}, t && o(a, t), ++i.ref, a.finalize = function() {
				--this.parent.ref || this.parent.finalize();
			}, it(a, e, n, r));
			return a.ref === 0 && a.finalize(), t;
		}
		function V() {
			return B.id ||= ++Je, ++B.awaits, B.echoes += Te, B.id;
		}
		function H() {
			return !!B.awaits && (--B.awaits == 0 && (B.id = 0), B.echoes = B.awaits * Te, !0);
		}
		function et(e) {
			return B.echoes && e && e.constructor === Oe ? (V(), e.then(function(e) {
				return H(), e;
			}, function(e) {
				return H(), U(e);
			})) : e;
		}
		function tt() {
			var e = Ye[Ye.length - 1];
			Ye.pop(), nt(e, !1);
		}
		function nt(e, t) {
			var n, i, a = I;
			(t ? !B.echoes || Xe++ && e === I : !Xe || --Xe && e === I) || queueMicrotask(t ? function(e) {
				++Ze, B.echoes && --B.echoes != 0 || (B.echoes = B.awaits = B.id = 0), Ye.push(I), nt(e, !0);
			}.bind(null, e) : tt), e !== I && (I = e, a === Pe && (Pe.env = rt()), ke) && (n = Pe.env.Promise, i = e.env, a.global || e.global) && (Object.defineProperty(r, "Promise", i.PromiseProp), n.all = i.all, n.race = i.race, n.resolve = i.resolve, n.reject = i.reject, i.allSettled && (n.allSettled = i.allSettled), i.any) && (n.any = i.any);
		}
		function rt() {
			var e = r.Promise;
			return ke ? {
				Promise: e,
				PromiseProp: Object.getOwnPropertyDescriptor(r, "Promise"),
				all: e.all,
				race: e.race,
				allSettled: e.allSettled,
				any: e.any,
				resolve: e.resolve,
				reject: e.reject
			} : {};
		}
		function it(e, t, n, r, i) {
			var a = I;
			try {
				return nt(e, !0), t(n, r, i);
			} finally {
				nt(a, !1);
			}
		}
		function at(e, t, n, r) {
			return typeof e == "function" ? function() {
				var i = I;
				n && V(), nt(t, !0);
				try {
					return e.apply(this, arguments);
				} finally {
					nt(i, !1), r && queueMicrotask(H);
				}
			} : e;
		}
		function ot(e) {
			Promise === Oe && B.echoes === 0 ? Xe === 0 ? e() : enqueueNativeMicroTask(e) : setTimeout(e, 0);
		}
		("" + De).indexOf("[native code]") === -1 && (V = H = M);
		var U = R.reject, st = "￿", ct = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", lt = "String expected.", ut = "__dbnames", dt = "readonly", ft = "readwrite";
		function pt(e, t) {
			return e ? t ? function() {
				return e.apply(this, arguments) && t.apply(this, arguments);
			} : e : t;
		}
		var mt = {
			type: 3,
			lower: -1 / 0,
			lowerOpen: !1,
			upper: [[]],
			upperOpen: !1
		};
		function W(e) {
			return typeof e != "string" || /\./.test(e) ? function(e) {
				return e;
			} : function(t) {
				return t[e] === void 0 && e in t && delete (t = D(t))[e], t;
			};
		}
		function ht() {
			throw j.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
		}
		function G(e, t) {
			try {
				var n = gt(e), r = gt(t);
				if (n !== r) return n === "Array" ? 1 : r === "Array" ? -1 : n === "binary" ? 1 : r === "binary" ? -1 : n === "string" ? 1 : r === "string" ? -1 : n === "Date" ? 1 : r === "Date" ? -1 : NaN;
				switch (n) {
					case "number":
					case "Date":
					case "string": return t < e ? 1 : e < t ? -1 : 0;
					case "binary":
						for (var i = _t(e), a = _t(t), o = i.length, s = a.length, c = o < s ? o : s, l = 0; l < c; ++l) if (i[l] !== a[l]) return i[l] < a[l] ? -1 : 1;
						return o === s ? 0 : o < s ? -1 : 1;
					case "Array":
						for (var u = e, d = t, f = u.length, p = d.length, m = f < p ? f : p, h = 0; h < m; ++h) {
							var g = G(u[h], d[h]);
							if (g !== 0) return g;
						}
						return f === p ? 0 : f < p ? -1 : 1;
				}
			} catch {}
			return NaN;
		}
		function gt(e) {
			var t = typeof e;
			return t == "object" && (ArrayBuffer.isView(e) || (t = ne(e)) === "ArrayBuffer") ? "binary" : t;
		}
		function _t(e) {
			return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : new Uint8Array(e);
		}
		function vt(e, t, n) {
			var r = e.schema.yProps;
			return r ? (t && 0 < n.numFailures && (t = t.filter(function(e, t) {
				return !n.failures[t];
			})), Promise.all(r.map(function(n) {
				return n = n.updatesTable, t ? e.db.table(n).where("k").anyOf(t).delete() : e.db.table(n).clear();
			})).then(function() {
				return n;
			})) : n;
		}
		bt.prototype.execute = function(e) {
			var t = this["@@propmod"];
			if (t.add !== void 0) {
				var r = t.add;
				if (a(r)) return n(n([], a(e) ? e : [], !0), r, !0).sort();
				if (typeof r == "number") return (Number(e) || 0) + r;
				if (typeof r == "bigint") try {
					return BigInt(e) + r;
				} catch {
					return BigInt(0) + r;
				}
				throw TypeError(`Invalid term ${r}`);
			}
			if (t.remove !== void 0) {
				var i = t.remove;
				if (a(i)) return a(e) ? e.filter(function(e) {
					return !i.includes(e);
				}).sort() : [];
				if (typeof i == "number") return Number(e) - i;
				if (typeof i == "bigint") try {
					return BigInt(e) - i;
				} catch {
					return BigInt(0) - i;
				}
				throw TypeError(`Invalid subtrahend ${i}`);
			}
			return r = (r = t.replacePrefix)?.[0], r && typeof e == "string" && e.startsWith(r) ? t.replacePrefix[1] + e.substring(r.length) : e;
		};
		var yt = bt;
		function bt(e) {
			this["@@propmod"] = e;
		}
		function xt(e, t) {
			for (var n = i(t), r = n.length, a = !1, o = 0; o < r; ++o) {
				var s = n[o], c = t[s], l = b(e, s);
				c instanceof yt ? (x(e, s, c.execute(l)), a = !0) : l !== c && (x(e, s, c), a = !0);
			}
			return a;
		}
		K.prototype._trans = function(e, t, n) {
			var r = this._tx || I.trans, i = this.name, a = Se && typeof console < "u" && console.createTask && console.createTask(`Dexie: ${e === "readonly" ? "read" : "write"} ${this.name}`);
			function o(e, n, r) {
				if (r.schema[i]) return t(r.idbtrans, r);
				throw new j.NotFound("Table " + i + " not part of transaction");
			}
			var s = We();
			try {
				var c = r && r.db._novip === this.db._novip ? r === I.trans ? r._promise(e, o, n) : $e(function() {
					return r._promise(e, o, n);
				}, {
					trans: r,
					transless: I.transless || I
				}) : function e(t, n, r, i) {
					if (t.idbdb && (t._state.openComplete || I.letThrough || t._vip)) {
						var a = t._createTransaction(n, r, t._dbSchema);
						try {
							a.create(), t._state.PR1398_maxLoop = 3;
						} catch (a) {
							return a.name === fe.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
								return e(t, n, r, i);
							})) : U(a);
						}
						return a._promise(n, function(e, t) {
							return $e(function() {
								return I.trans = a, i(e, t, a);
							});
						}).then(function(e) {
							if (n === "readwrite") try {
								a.idbtrans.commit();
							} catch {}
							return n === "readonly" ? e : a._completion.then(function() {
								return e;
							});
						});
					}
					if (t._state.openComplete) return U(new j.DatabaseClosed(t._state.dbOpenError));
					if (!t._state.isBeingOpened) {
						if (!t._state.autoOpen) return U(new j.DatabaseClosed());
						t.open().catch(M);
					}
					return t._state.dbReadyPromise.then(function() {
						return e(t, n, r, i);
					});
				}(this.db, e, [this.name], o);
				return a && (c._consoleTask = a, c = c.catch(function(e) {
					return console.trace(e), U(e);
				})), c;
			} finally {
				s && Ge();
			}
		}, K.prototype.get = function(e, t) {
			var n = this;
			return e && e.constructor === Object ? this.where(e).first(t) : e == null ? U(new j.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(t) {
				return n.core.get({
					trans: t,
					key: e
				}).then(function(e) {
					return n.hook.reading.fire(e);
				});
			}).then(t);
		}, K.prototype.where = function(e) {
			if (typeof e == "string") return new this.db.WhereClause(this, e);
			if (a(e)) return new this.db.WhereClause(this, `[${e.join("+")}]`);
			var t = i(e);
			if (t.length === 1) return this.where(t[0]).equals(e[t[0]]);
			var n = this.schema.indexes.concat(this.schema.primKey).filter(function(e) {
				if (e.compound && t.every(function(t) {
					return 0 <= e.keyPath.indexOf(t);
				})) {
					for (var n = 0; n < t.length; ++n) if (t.indexOf(e.keyPath[n]) === -1) return !1;
					return !0;
				}
				return !1;
			}).sort(function(e, t) {
				return e.keyPath.length - t.keyPath.length;
			})[0];
			if (n && this.db._maxKey !== st) return s = n.keyPath.slice(0, t.length), this.where(s).equals(s.map(function(t) {
				return e[t];
			}));
			!n && Se && console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit from a compound index [${t.join("+")}]`);
			var r = this.schema.idxByName;
			function o(e, t) {
				return G(e, t) === 0;
			}
			var s = t.reduce(function(t, n) {
				var i = t[0], t = t[1], s = r[n], c = e[n];
				return [i || s, i || !s ? pt(t, s && s.multi ? function(e) {
					return e = b(e, n), a(e) && e.some(function(e) {
						return o(c, e);
					});
				} : function(e) {
					return o(c, b(e, n));
				}) : t];
			}, [null, null]), c = s[0], s = s[1];
			return c ? this.where(c.name).equals(e[c.keyPath]).filter(s) : n ? this.filter(s) : this.where(t).equals("");
		}, K.prototype.filter = function(e) {
			return this.toCollection().and(e);
		}, K.prototype.count = function(e) {
			return this.toCollection().count(e);
		}, K.prototype.offset = function(e) {
			return this.toCollection().offset(e);
		}, K.prototype.limit = function(e) {
			return this.toCollection().limit(e);
		}, K.prototype.each = function(e) {
			return this.toCollection().each(e);
		}, K.prototype.toArray = function(e) {
			return this.toCollection().toArray(e);
		}, K.prototype.toCollection = function() {
			return new this.db.Collection(new this.db.WhereClause(this));
		}, K.prototype.orderBy = function(e) {
			return new this.db.Collection(new this.db.WhereClause(this, a(e) ? `[${e.join("+")}]` : e));
		}, K.prototype.reverse = function() {
			return this.toCollection().reverse();
		}, K.prototype.mapToClass = function(t) {
			for (var n = this.db, r = this.name, i = ((this.schema.mappedClass = t).prototype instanceof ht && (t = ((t) => {
				var i = s, a = t;
				if (typeof a != "function" && a !== null) throw TypeError("Class extends value " + String(a) + " is not a constructor or null");
				function o() {
					this.constructor = i;
				}
				function s() {
					return t !== null && t.apply(this, arguments) || this;
				}
				return e(i, a), i.prototype = a === null ? Object.create(a) : (o.prototype = a.prototype, new o()), Object.defineProperty(s.prototype, "db", {
					get: function() {
						return n;
					},
					enumerable: !1,
					configurable: !0
				}), s.prototype.table = function() {
					return r;
				}, s;
			})(t)), /* @__PURE__ */ new Set()), a = t.prototype; a; a = s(a)) Object.getOwnPropertyNames(a).forEach(function(e) {
				return i.add(e);
			});
			function o(e) {
				if (!e) return e;
				var n, r = Object.create(t.prototype);
				for (n in e) if (!i.has(n)) try {
					r[n] = e[n];
				} catch {}
				return r;
			}
			return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = o, this.hook("reading", o), t;
		}, K.prototype.defineClass = function() {
			return this.mapToClass(function(e) {
				o(this, e);
			});
		}, K.prototype.add = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = W(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "add",
					keys: t == null ? null : [t],
					values: [o]
				});
			}).then(function(e) {
				return e.numFailures ? R.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, K.prototype.upsert = function(e, t) {
			var n = this, r = this.schema.primKey.keyPath;
			return this._trans("readwrite", function(i) {
				return n.core.get({
					trans: i,
					key: e
				}).then(function(a) {
					var o = a ?? {};
					return xt(o, t), r && x(o, r, e), n.core.mutate({
						trans: i,
						type: "put",
						values: [o],
						keys: [e],
						upsert: !0,
						updates: {
							keys: [e],
							changeSpecs: [t]
						}
					}).then(function(e) {
						return e.numFailures ? R.reject(e.failures[0]) : !!a;
					});
				});
			});
		}, K.prototype.update = function(e, t) {
			return typeof e != "object" || a(e) ? this.where(":id").equals(e).modify(t) : (e = b(e, this.schema.primKey.keyPath)) === void 0 ? U(new j.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e).modify(t);
		}, K.prototype.put = function(e, t) {
			var n = this, r = this.schema.primKey, i = r.auto, a = r.keyPath, o = e;
			return a && i && (o = W(a)(e)), this._trans("readwrite", function(e) {
				return n.core.mutate({
					trans: e,
					type: "put",
					values: [o],
					keys: t == null ? null : [t]
				});
			}).then(function(e) {
				return e.numFailures ? R.reject(e.failures[0]) : e.lastResult;
			}).then(function(t) {
				if (a) try {
					x(e, a, t);
				} catch {}
				return t;
			});
		}, K.prototype.delete = function(e) {
			var t = this;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: [e]
				}).then(function(n) {
					return vt(t, [e], n);
				}).then(function(e) {
					return e.numFailures ? R.reject(e.failures[0]) : void 0;
				});
			});
		}, K.prototype.clear = function() {
			var e = this;
			return this._trans("readwrite", function(t) {
				return e.core.mutate({
					trans: t,
					type: "deleteRange",
					range: mt
				}).then(function(t) {
					return vt(e, null, t);
				});
			}).then(function(e) {
				return e.numFailures ? R.reject(e.failures[0]) : void 0;
			});
		}, K.prototype.bulkGet = function(e) {
			var t = this;
			return this._trans("readonly", function(n) {
				return t.core.getMany({
					keys: e,
					trans: n
				}).then(function(e) {
					return e.map(function(e) {
						return t.hook.reading.fire(e);
					});
				});
			});
		}, K.prototype.bulkAdd = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new j.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new j.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(W(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "add",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new de(`${r.name}.bulkAdd(): ${t} of ${s} operations failed`, n);
				});
			});
		}, K.prototype.bulkPut = function(e, t, n) {
			var r = this, i = Array.isArray(t) ? t : void 0, a = (n ||= i ? void 0 : t) ? n.allKeys : void 0;
			return this._trans("readwrite", function(t) {
				var n = r.schema.primKey, o = n.auto, n = n.keyPath;
				if (n && i) throw new j.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
				if (i && i.length !== e.length) throw new j.InvalidArgument("Arguments objects and keys must have the same length");
				var s = e.length, o = n && o ? e.map(W(n)) : e;
				return r.core.mutate({
					trans: t,
					type: "put",
					keys: i,
					values: o,
					wantResults: a
				}).then(function(e) {
					var t = e.numFailures, n = e.failures;
					if (t === 0) return a ? e.results : e.lastResult;
					throw new de(`${r.name}.bulkPut(): ${t} of ${s} operations failed`, n);
				});
			});
		}, K.prototype.bulkUpdate = function(e) {
			var t = this, n = this.core, r = e.map(function(e) {
				return e.key;
			}), i = e.map(function(e) {
				return e.changes;
			}), a = [];
			return this._trans("readwrite", function(o) {
				return n.getMany({
					trans: o,
					keys: r,
					cache: "clone"
				}).then(function(s) {
					var c = [], l = [], u = (e.forEach(function(e, n) {
						var r = e.key, i = e.changes, o = s[n];
						if (o) {
							for (var u = 0, d = Object.keys(i); u < d.length; u++) {
								var f = d[u], p = i[f];
								if (f === t.schema.primKey.keyPath) {
									if (G(p, r) !== 0) throw new j.Constraint("Cannot update primary key in bulkUpdate()");
								} else x(o, f, p);
							}
							a.push(n), c.push(r), l.push(o);
						}
					}), c.length);
					return n.mutate({
						trans: o,
						type: "put",
						keys: c,
						values: l,
						updates: {
							keys: r,
							changeSpecs: i
						}
					}).then(function(e) {
						var n = e.numFailures, r = e.failures;
						if (n === 0) return u;
						for (var i = 0, o = Object.keys(r); i < o.length; i++) {
							var s, c = o[i], l = a[Number(c)];
							l != null && (s = r[c], delete r[c], r[l] = s);
						}
						throw new de(`${t.name}.bulkUpdate(): ${n} of ${u} operations failed`, r);
					});
				});
			});
		}, K.prototype.bulkDelete = function(e) {
			var t = this, n = e.length;
			return this._trans("readwrite", function(n) {
				return t.core.mutate({
					trans: n,
					type: "delete",
					keys: e
				}).then(function(n) {
					return vt(t, e, n);
				});
			}).then(function(e) {
				var r = e.numFailures, i = e.failures;
				if (r === 0) return e.lastResult;
				throw new de(`${t.name}.bulkDelete(): ${r} of ${n} operations failed`, i);
			});
		};
		var St = K;
		function K() {}
		function Ct(e) {
			function t(t, r) {
				if (r) {
					for (var i = arguments.length, a = Array(i - 1); --i;) a[i - 1] = arguments[i];
					return n[t].subscribe.apply(null, a), e;
				}
				if (typeof t == "string") return n[t];
			}
			var n = {};
			t.addEventType = s;
			for (var r = 1, o = arguments.length; r < o; ++r) s(arguments[r]);
			return t;
			function s(e, r, o) {
				var c, l;
				if (typeof e != "object") return r ||= be, l = {
					subscribers: [],
					fire: o ||= M,
					subscribe: function(e) {
						l.subscribers.indexOf(e) === -1 && (l.subscribers.push(e), l.fire = r(l.fire, e));
					},
					unsubscribe: function(e) {
						l.subscribers = l.subscribers.filter(function(t) {
							return t !== e;
						}), l.fire = l.subscribers.reduce(r, o);
					}
				}, n[e] = t[e] = l;
				i(c = e).forEach(function(e) {
					var t = c[e];
					if (a(t)) s(e, c[e][0], c[e][1]);
					else {
						if (t !== "asap") throw new j.InvalidArgument("Invalid event config");
						var n = s(e, he, function() {
							for (var e = arguments.length, t = Array(e); e--;) t[e] = arguments[e];
							n.subscribers.forEach(function(e) {
								y(function() {
									e.apply(null, t);
								});
							});
						});
					}
				});
			}
		}
		function wt(e, t) {
			return p(t).from({ prototype: e }), t;
		}
		function Tt(e, t) {
			return !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter);
		}
		function Et(e, t) {
			e.filter = pt(e.filter, t);
		}
		function Dt(e, t, n) {
			var r = e.replayFilter;
			e.replayFilter = r ? function() {
				return pt(r(), t());
			} : t, e.justLimit = n && !r;
		}
		function Ot(e, t) {
			if (e.isPrimKey) return t.primaryKey;
			var n = t.getIndexByKeyPath(e.index);
			if (n) return n;
			throw new j.Schema("KeyPath " + e.index + " on object store " + t.name + " is not indexed");
		}
		function kt(e, t, n) {
			var r = Ot(e, t.schema);
			return t.openCursor({
				trans: n,
				values: !e.keysOnly,
				reverse: e.dir === "prev",
				unique: !!e.unique,
				query: {
					index: r,
					range: e.range
				}
			});
		}
		function At(e, t, n, r) {
			var i, a, o = e.replayFilter ? pt(e.filter, e.replayFilter()) : e.filter;
			return e.or ? (i = {}, a = function(e, n, r) {
				var a, s;
				o && !o(n, r, function(e) {
					return n.stop(e);
				}, function(e) {
					return n.fail(e);
				}) || ((s = "" + (a = n.primaryKey)) == "[object ArrayBuffer]" && (s = "" + new Uint8Array(a)), l(i, s)) || (i[s] = !0, t(e, n, r));
			}, Promise.all([e.or._iterate(a, n), jt(kt(e, r, n), e.algorithm, a, !e.keysOnly && e.valueMapper)])) : jt(kt(e, r, n), pt(e.algorithm, o), t, !e.keysOnly && e.valueMapper);
		}
		function jt(e, t, n, r) {
			var i = z(r ? function(e, t, i) {
				return n(r(e), t, i);
			} : n);
			return e.then(function(e) {
				if (e) return e.start(function() {
					var n = function() {
						return e.continue();
					};
					t && !t(e, function(e) {
						return n = e;
					}, function(t) {
						e.stop(t), n = M;
					}, function(t) {
						e.fail(t), n = M;
					}) || i(e.value, e, function(e) {
						return n = e;
					}), n();
				});
			});
		}
		q.prototype._read = function(e, t) {
			var n = this._ctx;
			return n.error ? n.table._trans(null, U.bind(null, n.error)) : n.table._trans("readonly", e).then(t);
		}, q.prototype._write = function(e) {
			var t = this._ctx;
			return t.error ? t.table._trans(null, U.bind(null, t.error)) : t.table._trans("readwrite", e, "locked");
		}, q.prototype._addAlgorithm = function(e) {
			var t = this._ctx;
			t.algorithm = pt(t.algorithm, e);
		}, q.prototype._iterate = function(e, t) {
			return At(this._ctx, e, t, this._ctx.table.core);
		}, q.prototype.clone = function(e) {
			var t = Object.create(this.constructor.prototype), n = Object.create(this._ctx);
			return e && o(n, e), t._ctx = n, t;
		}, q.prototype.raw = function() {
			return this._ctx.valueMapper = null, this;
		}, q.prototype.each = function(e) {
			var t = this._ctx;
			return this._read(function(n) {
				return At(t, e, n, t.table.core);
			});
		}, q.prototype.count = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r = t._ctx, i = r.table.core;
				return Tt(r, !0) ? i.count({
					trans: e,
					query: {
						index: Ot(r, i.schema),
						range: r.range
					}
				}).then(function(e) {
					return Math.min(e, r.limit);
				}) : (n = 0, At(r, function() {
					return ++n, !1;
				}, e, i).then(function() {
					return n;
				}));
			}).then(e);
		}, q.prototype.sortBy = function(e, t) {
			var n = e.split(".").reverse(), r = n[0], i = n.length - 1;
			function a(e, t) {
				return t ? a(e[n[t]], t - 1) : e[r];
			}
			var o = this._ctx.dir === "next" ? 1 : -1;
			function s(e, t) {
				return G(a(e, i), a(t, i)) * o;
			}
			return this.toArray(function(e) {
				return e.slice().sort(s);
			}).then(t);
		}, q.prototype.toArray = function(e) {
			var t = this;
			return this._read(function(e) {
				var n, r, i, a = t._ctx;
				return Tt(a, !0) && 0 < a.limit ? (n = a.valueMapper, r = Ot(a, a.table.core.schema), a.table.core.query({
					trans: e,
					limit: a.limit,
					values: !0,
					direction: a.dir === "prev" ? "prev" : void 0,
					query: {
						index: r,
						range: a.range
					}
				}).then(function(e) {
					return e = e.result, n ? e.map(n) : e;
				})) : (i = [], At(a, function(e) {
					return i.push(e);
				}, e, a.table.core).then(function() {
					return i;
				}));
			}, e);
		}, q.prototype.offset = function(e) {
			var t = this._ctx;
			return e <= 0 || (t.offset += e, Tt(t) ? Dt(t, function() {
				var t = e;
				return function(e, n) {
					return t === 0 || (t === 1 ? --t : n(function() {
						e.advance(t), t = 0;
					}), !1);
				};
			}) : Dt(t, function() {
				var t = e;
				return function() {
					return --t < 0;
				};
			})), this;
		}, q.prototype.limit = function(e) {
			return this._ctx.limit = Math.min(this._ctx.limit, e), Dt(this._ctx, function() {
				var t = e;
				return function(e, n, r) {
					return --t <= 0 && n(r), 0 <= t;
				};
			}, !0), this;
		}, q.prototype.until = function(e, t) {
			return Et(this._ctx, function(n, r, i) {
				return !e(n.value) || (r(i), t);
			}), this;
		}, q.prototype.first = function(e) {
			return this.limit(1).toArray(function(e) {
				return e[0];
			}).then(e);
		}, q.prototype.last = function(e) {
			return this.reverse().first(e);
		}, q.prototype.filter = function(e) {
			var t;
			return Et(this._ctx, function(t) {
				return e(t.value);
			}), (t = this._ctx).isMatch = pt(t.isMatch, e), this;
		}, q.prototype.and = function(e) {
			return this.filter(e);
		}, q.prototype.or = function(e) {
			return new this.db.WhereClause(this._ctx.table, e, this);
		}, q.prototype.reverse = function() {
			return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
		}, q.prototype.desc = function() {
			return this.reverse();
		}, q.prototype.eachKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.key, n);
			});
		}, q.prototype.eachUniqueKey = function(e) {
			return this._ctx.unique = "unique", this.eachKey(e);
		}, q.prototype.eachPrimaryKey = function(e) {
			var t = this._ctx;
			return t.keysOnly = !t.isMatch, this.each(function(t, n) {
				e(n.primaryKey, n);
			});
		}, q.prototype.keys = function(e) {
			var t = this._ctx, n = (t.keysOnly = !t.isMatch, []);
			return this.each(function(e, t) {
				n.push(t.key);
			}).then(function() {
				return n;
			}).then(e);
		}, q.prototype.primaryKeys = function(e) {
			var t = this._ctx;
			if (Tt(t, !0) && 0 < t.limit) return this._read(function(e) {
				var n = Ot(t, t.table.core.schema);
				return t.table.core.query({
					trans: e,
					values: !1,
					limit: t.limit,
					direction: t.dir === "prev" ? "prev" : void 0,
					query: {
						index: n,
						range: t.range
					}
				});
			}).then(function(e) {
				return e.result;
			}).then(e);
			t.keysOnly = !t.isMatch;
			var n = [];
			return this.each(function(e, t) {
				n.push(t.primaryKey);
			}).then(function() {
				return n;
			}).then(e);
		}, q.prototype.uniqueKeys = function(e) {
			return this._ctx.unique = "unique", this.keys(e);
		}, q.prototype.firstKey = function(e) {
			return this.limit(1).keys(function(e) {
				return e[0];
			}).then(e);
		}, q.prototype.lastKey = function(e) {
			return this.reverse().firstKey(e);
		}, q.prototype.distinct = function() {
			var e, t = this._ctx, t = t.index && t.table.schema.idxByName[t.index];
			return t && t.multi && (e = {}, Et(this._ctx, function(t) {
				var t = t.primaryKey.toString(), n = l(e, t);
				return e[t] = !0, !n;
			})), this;
		}, q.prototype.modify = function(e) {
			var t = this, n = this._ctx;
			return this._write(function(r) {
				function a(e, t) {
					var n = t.failures;
					p += e - t.numFailures;
					for (var r = 0, a = i(n); r < a.length; r++) {
						var o = a[r];
						f.push(n[o]);
					}
				}
				var o = typeof e == "function" ? e : function(t) {
					return xt(t, e);
				}, s = n.table.core, c = s.schema.primaryKey, l = c.outbound, u = c.extractKey, d = 200, c = t.db._options.modifyChunkSize, f = (c && (d = typeof c == "object" ? c[s.name] || c["*"] || 200 : c), []), p = 0, m = [], h = e === Nt;
				return t.clone().primaryKeys().then(function(t) {
					function i(f) {
						var p = Math.min(d, t.length - f), m = t.slice(f, f + p);
						return (h ? Promise.resolve([]) : s.getMany({
							trans: r,
							keys: m,
							cache: "immutable"
						})).then(function(g) {
							var _ = [], v = [], y = l ? [] : null, b = h ? m : [];
							if (!h) for (var x = 0; x < p; ++x) {
								var S = g[x], C = {
									value: D(S),
									primKey: t[f + x]
								};
								!1 !== o.call(C, C.value, C) && (C.value == null ? b.push(t[f + x]) : l || G(u(S), u(C.value)) === 0 ? (v.push(C.value), l && y.push(t[f + x])) : (b.push(t[f + x]), _.push(C.value)));
							}
							return Promise.resolve(0 < _.length && s.mutate({
								trans: r,
								type: "add",
								values: _
							}).then(function(e) {
								for (var t in e.failures) b.splice(parseInt(t), 1);
								a(_.length, e);
							})).then(function() {
								return (0 < v.length || c && typeof e == "object") && s.mutate({
									trans: r,
									type: "put",
									keys: y,
									values: v,
									criteria: c,
									changeSpec: typeof e != "function" && e,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return a(v.length, e);
								});
							}).then(function() {
								return (0 < b.length || c && h) && s.mutate({
									trans: r,
									type: "delete",
									keys: b,
									criteria: c,
									isAdditionalChunk: 0 < f
								}).then(function(e) {
									return vt(n.table, b, e);
								}).then(function(e) {
									return a(b.length, e);
								});
							}).then(function() {
								return t.length > f + p && i(f + d);
							});
						});
					}
					var c = Tt(n) && n.limit === 1 / 0 && (typeof e != "function" || h) && {
						index: n.index,
						range: n.range
					};
					return i(0).then(function() {
						if (0 < f.length) throw new ue("Error modifying one or more objects", f, p, m);
						return t.length;
					});
				});
			});
		}, q.prototype.delete = function() {
			var e = this._ctx, t = e.range;
			return !Tt(e) || e.table.schema.yProps || !e.isPrimKey && t.type !== 3 ? this.modify(Nt) : this._write(function(n) {
				var r = e.table.core.schema.primaryKey, i = t;
				return e.table.core.count({
					trans: n,
					query: {
						index: r,
						range: i
					}
				}).then(function(t) {
					return e.table.core.mutate({
						trans: n,
						type: "deleteRange",
						range: i
					}).then(function(e) {
						var n = e.failures, e = e.numFailures;
						if (e) throw new ue("Could not delete some values", Object.keys(n).map(function(e) {
							return n[e];
						}), t - e);
						return t - e;
					});
				});
			});
		};
		var Mt = q;
		function q() {}
		var Nt = function(e, t) {
			return t.value = null;
		};
		function Pt(e, t) {
			return e < t ? -1 : e === t ? 0 : 1;
		}
		function Ft(e, t) {
			return t < e ? -1 : e === t ? 0 : 1;
		}
		function J(e, t, n) {
			return e = e instanceof Bt ? new e.Collection(e) : e, e._ctx.error = new (n || TypeError)(t), e;
		}
		function It(e) {
			return new e.Collection(e, function() {
				return zt("");
			}).limit(0);
		}
		function Lt(e, t, n, r) {
			var i, a, o, s, c, l, u, d = n.length;
			if (!n.every(function(e) {
				return typeof e == "string";
			})) return J(e, lt);
			function f(e) {
				i = e === "next" ? function(e) {
					return e.toUpperCase();
				} : function(e) {
					return e.toLowerCase();
				}, a = e === "next" ? function(e) {
					return e.toLowerCase();
				} : function(e) {
					return e.toUpperCase();
				}, o = e === "next" ? Pt : Ft;
				var t = n.map(function(e) {
					return {
						lower: a(e),
						upper: i(e)
					};
				}).sort(function(e, t) {
					return o(e.lower, t.lower);
				});
				s = t.map(function(e) {
					return e.upper;
				}), c = t.map(function(e) {
					return e.lower;
				}), u = (l = e) === "next" ? "" : r;
			}
			f("next");
			var e = new e.Collection(e, function() {
				return Rt(s[0], c[d - 1] + r);
			}), p = (e._ondirectionchange = function(e) {
				f(e);
			}, 0);
			return e._addAlgorithm(function(e, n, r) {
				var i = e.key;
				if (typeof i == "string") {
					var f = a(i);
					if (t(f, c, p)) return !0;
					for (var m = null, h = p; h < d; ++h) {
						var g = ((e, t, n, r, i, a) => {
							for (var o = Math.min(e.length, r.length), s = -1, c = 0; c < o; ++c) {
								var l = t[c];
								if (l !== r[c]) return i(e[c], n[c]) < 0 ? e.substr(0, c) + n[c] + n.substr(c + 1) : i(e[c], r[c]) < 0 ? e.substr(0, c) + r[c] + n.substr(c + 1) : 0 <= s ? e.substr(0, s) + t[s] + n.substr(s + 1) : null;
								i(e[c], l) < 0 && (s = c);
							}
							return o < r.length && a === "next" ? e + n.substr(e.length) : o < e.length && a === "prev" ? e.substr(0, n.length) : s < 0 ? null : e.substr(0, s) + r[s] + n.substr(s + 1);
						})(i, f, s[h], c[h], o, l);
						g === null && m === null ? p = h + 1 : (m === null || 0 < o(m, g)) && (m = g);
					}
					n(m === null ? r : function() {
						e.continue(m + u);
					});
				}
				return !1;
			}), e;
		}
		function Rt(e, t, n, r) {
			return {
				type: 2,
				lower: e,
				upper: t,
				lowerOpen: n,
				upperOpen: r
			};
		}
		function zt(e) {
			return {
				type: 1,
				lower: e,
				upper: e
			};
		}
		Object.defineProperty(Y.prototype, "Collection", {
			get: function() {
				return this._ctx.table.db.Collection;
			},
			enumerable: !1,
			configurable: !0
		}), Y.prototype.between = function(e, t, n, r) {
			n = !1 !== n, r = !0 === r;
			try {
				return 0 < this._cmp(e, t) || this._cmp(e, t) === 0 && (n || r) && (!n || !r) ? It(this) : new this.Collection(this, function() {
					return Rt(e, t, !n, !r);
				});
			} catch {
				return J(this, ct);
			}
		}, Y.prototype.equals = function(e) {
			return e == null ? J(this, ct) : new this.Collection(this, function() {
				return zt(e);
			});
		}, Y.prototype.above = function(e) {
			return e == null ? J(this, ct) : new this.Collection(this, function() {
				return Rt(e, void 0, !0);
			});
		}, Y.prototype.aboveOrEqual = function(e) {
			return e == null ? J(this, ct) : new this.Collection(this, function() {
				return Rt(e, void 0, !1);
			});
		}, Y.prototype.below = function(e) {
			return e == null ? J(this, ct) : new this.Collection(this, function() {
				return Rt(void 0, e, !1, !0);
			});
		}, Y.prototype.belowOrEqual = function(e) {
			return e == null ? J(this, ct) : new this.Collection(this, function() {
				return Rt(void 0, e);
			});
		}, Y.prototype.startsWith = function(e) {
			return typeof e == "string" ? this.between(e, e + st, !0, !0) : J(this, lt);
		}, Y.prototype.startsWithIgnoreCase = function(e) {
			return e === "" ? this.startsWith(e) : Lt(this, function(e, t) {
				return e.indexOf(t[0]) === 0;
			}, [e], st);
		}, Y.prototype.equalsIgnoreCase = function(e) {
			return Lt(this, function(e, t) {
				return e === t[0];
			}, [e], "");
		}, Y.prototype.anyOfIgnoreCase = function() {
			var e = oe.apply(O, arguments);
			return e.length === 0 ? It(this) : Lt(this, function(e, t) {
				return t.indexOf(e) !== -1;
			}, e, "");
		}, Y.prototype.startsWithAnyOfIgnoreCase = function() {
			var e = oe.apply(O, arguments);
			return e.length === 0 ? It(this) : Lt(this, function(e, t) {
				return t.some(function(t) {
					return e.indexOf(t) === 0;
				});
			}, e, st);
		}, Y.prototype.anyOf = function() {
			var e, t, n = this, r = oe.apply(O, arguments), i = this._cmp;
			try {
				r.sort(i);
			} catch {
				return J(this, ct);
			}
			return r.length === 0 ? It(this) : ((e = new this.Collection(this, function() {
				return Rt(r[0], r[r.length - 1]);
			}))._ondirectionchange = function(e) {
				i = e === "next" ? n._ascending : n._descending, r.sort(i);
			}, t = 0, e._addAlgorithm(function(e, n, a) {
				for (var o = e.key; 0 < i(o, r[t]);) if (++t === r.length) return n(a), !1;
				return i(o, r[t]) === 0 || (n(function() {
					e.continue(r[t]);
				}), !1);
			}), e);
		}, Y.prototype.notEqual = function(e) {
			return this.inAnyRange([[-1 / 0, e], [e, this.db._maxKey]], {
				includeLowers: !1,
				includeUppers: !1
			});
		}, Y.prototype.noneOf = function() {
			var e = oe.apply(O, arguments);
			if (e.length === 0) return new this.Collection(this);
			try {
				e.sort(this._ascending);
			} catch {
				return J(this, ct);
			}
			var t = e.reduce(function(e, t) {
				return e ? e.concat([[e[e.length - 1][1], t]]) : [[-1 / 0, t]];
			}, null);
			return t.push([e[e.length - 1], this.db._maxKey]), this.inAnyRange(t, {
				includeLowers: !1,
				includeUppers: !1
			});
		}, Y.prototype.inAnyRange = function(e, t) {
			var n = this, r = this._cmp, i = this._ascending, a = this._descending, o = this._min, s = this._max;
			if (e.length === 0) return It(this);
			if (!e.every(function(e) {
				return e[0] !== void 0 && e[1] !== void 0 && i(e[0], e[1]) <= 0;
			})) return J(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", j.InvalidArgument);
			var c = !t || !1 !== t.includeLowers, l = t && !0 === t.includeUppers, u, d = i;
			function f(e, t) {
				return d(e[0], t[0]);
			}
			try {
				(u = e.reduce(function(e, t) {
					for (var n = 0, i = e.length; n < i; ++n) {
						var a = e[n];
						if (r(t[0], a[1]) < 0 && 0 < r(t[1], a[0])) {
							a[0] = o(a[0], t[0]), a[1] = s(a[1], t[1]);
							break;
						}
					}
					return n === i && e.push(t), e;
				}, [])).sort(f);
			} catch {
				return J(this, ct);
			}
			var p = 0, m = l ? function(e) {
				return 0 < i(e, u[p][1]);
			} : function(e) {
				return 0 <= i(e, u[p][1]);
			}, h = c ? function(e) {
				return 0 < a(e, u[p][0]);
			} : function(e) {
				return 0 <= a(e, u[p][0]);
			}, g = m, t = new this.Collection(this, function() {
				return Rt(u[0][0], u[u.length - 1][1], !c, !l);
			});
			return t._ondirectionchange = function(e) {
				d = e === "next" ? (g = m, i) : (g = h, a), u.sort(f);
			}, t._addAlgorithm(function(e, t, r) {
				for (var a, o = e.key; g(o);) if (++p === u.length) return t(r), !1;
				return !m(a = o) && !h(a) || (n._cmp(o, u[p][1]) === 0 || n._cmp(o, u[p][0]) === 0 || t(function() {
					d === i ? e.continue(u[p][0]) : e.continue(u[p][1]);
				}), !1);
			}), t;
		}, Y.prototype.startsWithAnyOf = function() {
			var e = oe.apply(O, arguments);
			return e.every(function(e) {
				return typeof e == "string";
			}) ? e.length === 0 ? It(this) : this.inAnyRange(e.map(function(e) {
				return [e, e + st];
			})) : J(this, "startsWithAnyOf() only works with strings");
		};
		var Bt = Y;
		function Y() {}
		function X(e) {
			return z(function(t) {
				return Vt(t), e(t.target.error), !1;
			});
		}
		function Vt(e) {
			e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
		}
		var Ht = "storagemutated", Ut = "x-storagemutated-1", Wt = Ct(null, Ht), Gt = (Kt.prototype._lock = function() {
			return v(!I.global), ++this._reculock, this._reculock !== 1 || I.global || (I.lockOwnerFor = this), this;
		}, Kt.prototype._unlock = function() {
			if (v(!I.global), --this._reculock == 0) for (I.global || (I.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked();) {
				var e = this._blockedFuncs.shift();
				try {
					it(e[1], e[0]);
				} catch {}
			}
			return this;
		}, Kt.prototype._locked = function() {
			return this._reculock && I.lockOwnerFor !== this;
		}, Kt.prototype.create = function(e) {
			var t = this;
			if (this.mode) {
				var n = this.db.idbdb, r = this.db._state.dbOpenError;
				if (v(!this.idbtrans), !e && !n) switch (r && r.name) {
					case "DatabaseClosedError": throw new j.DatabaseClosed(r);
					case "MissingAPIError": throw new j.MissingAPI(r.message, r);
					default: throw new j.OpenFailed(r);
				}
				if (!this.active) throw new j.TransactionInactive();
				v(this._completion._state === null), (e = this.idbtrans = e || (this.db.core || n).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = z(function(n) {
					Vt(n), t._reject(e.error);
				}), e.onabort = z(function(n) {
					Vt(n), t.active && t._reject(new j.Abort(e.error)), t.active = !1, t.on("abort").fire(n);
				}), e.oncomplete = z(function() {
					t.active = !1, t._resolve(), "mutatedParts" in e && Wt.storagemutated.fire(e.mutatedParts);
				});
			}
			return this;
		}, Kt.prototype._promise = function(e, t, n) {
			var r, i = this;
			return e === "readwrite" && this.mode !== "readwrite" ? U(new j.ReadOnly("Transaction is readonly")) : this.active ? this._locked() ? new R(function(r, a) {
				i._blockedFuncs.push([function() {
					i._promise(e, t, n).then(r, a);
				}, I]);
			}) : n ? $e(function() {
				var e = new R(function(e, n) {
					i._lock();
					var r = t(e, n, i);
					r && r.then && r.then(e, n);
				});
				return e.finally(function() {
					return i._unlock();
				}), e._lib = !0, e;
			}) : ((r = new R(function(e, n) {
				var r = t(e, n, i);
				r && r.then && r.then(e, n);
			}))._lib = !0, r) : U(new j.TransactionInactive());
		}, Kt.prototype._root = function() {
			return this.parent ? this.parent._root() : this;
		}, Kt.prototype.waitFor = function(e) {
			var t, n = this._root(), r = R.resolve(e), i = (n._waitingFor ? n._waitingFor = n._waitingFor.then(function() {
				return r;
			}) : (n._waitingFor = r, n._waitingQueue = [], t = n.idbtrans.objectStore(n.storeNames[0]), function e() {
				for (++n._spinCount; n._waitingQueue.length;) n._waitingQueue.shift()();
				n._waitingFor && (t.get(-1 / 0).onsuccess = e);
			}()), n._waitingFor);
			return new R(function(e, t) {
				r.then(function(t) {
					return n._waitingQueue.push(z(e.bind(null, t)));
				}, function(e) {
					return n._waitingQueue.push(z(t.bind(null, e)));
				}).finally(function() {
					n._waitingFor === i && (n._waitingFor = null);
				});
			});
		}, Kt.prototype.abort = function() {
			this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new j.Abort()));
		}, Kt.prototype.table = function(e) {
			var t = this._memoizedTables ||= {};
			if (l(t, e)) return t[e];
			var n = this.schema[e];
			if (n) return (n = new this.db.Table(e, n, this)).core = this.db.core.table(e), t[e] = n;
			throw new j.NotFound("Table " + e + " not part of transaction");
		}, Kt);
		function Kt() {}
		function qt(e, t, n, r, i, a, o, s) {
			return {
				name: e,
				keyPath: t,
				unique: n,
				multi: r,
				auto: i,
				compound: a,
				src: (n && !o ? "&" : "") + (r ? "*" : "") + (i ? "++" : "") + Jt(t),
				type: s
			};
		}
		function Jt(e) {
			return typeof e == "string" ? e : e ? "[" + [].join.call(e, "+") + "]" : "";
		}
		function Yt(e, t, n) {
			return {
				name: e,
				primKey: t,
				indexes: n,
				mappedClass: null,
				idxByName: (r = function(e) {
					return [e.name, e];
				}, n.reduce(function(e, t, n) {
					return t = r(t, n), t && (e[t[0]] = t[1]), e;
				}, {}))
			};
			var r;
		}
		var Xt = function(e) {
			try {
				return e.only([[]]), Xt = function() {
					return [[]];
				}, [[]];
			} catch {
				return Xt = function() {
					return st;
				}, st;
			}
		};
		function Zt(e) {
			return e == null ? function() {} : typeof e == "string" ? (t = e).split(".").length === 1 ? function(e) {
				return e[t];
			} : function(e) {
				return b(e, t);
			} : function(t) {
				return b(t, e);
			};
			var t;
		}
		function Qt(e) {
			return [].slice.call(e);
		}
		var $t = 0;
		function en(e) {
			return e == null ? ":id" : typeof e == "string" ? e : `[${e.join("+")}]`;
		}
		function tn(e, t, n) {
			function r(e) {
				if (e.type === 3) return null;
				if (e.type === 4) throw Error("Cannot convert never type to IDBKeyRange");
				var n = e.lower, r = e.upper, i = e.lowerOpen, e = e.upperOpen;
				return n === void 0 ? r === void 0 ? null : t.upperBound(r, !!e) : r === void 0 ? t.lowerBound(n, !!i) : t.bound(n, r, !!i, !!e);
			}
			function i(e) {
				var t, n, i = e.name;
				return {
					name: i,
					schema: e,
					mutate: function(e) {
						var t = e.trans, n = e.type, a = e.keys, o = e.values, s = e.range;
						return new Promise(function(e, c) {
							e = z(e);
							var l = t.objectStore(i), u = l.keyPath == null, d = n === "put" || n === "add";
							if (!d && n !== "delete" && n !== "deleteRange") throw Error("Invalid operation type: " + n);
							var f, p = (a || o || { length: 1 }).length;
							if (a && o && a.length !== o.length) throw Error("Given keys array must have same length as given values array.");
							if (p === 0) return e({
								numFailures: 0,
								failures: {},
								results: [],
								lastResult: void 0
							});
							function m(e) {
								++_, Vt(e);
							}
							var h = [], g = [], _ = 0;
							if (n === "deleteRange") {
								if (s.type === 4) return e({
									numFailures: _,
									failures: g,
									results: [],
									lastResult: void 0
								});
								s.type === 3 ? h.push(f = l.clear()) : h.push(f = l.delete(r(s)));
							} else {
								var u = d ? u ? [o, a] : [o, null] : [a, null], v = u[0], y = u[1];
								if (d) for (var b = 0; b < p; ++b) h.push(f = y && y[b] !== void 0 ? l[n](v[b], y[b]) : l[n](v[b])), f.onerror = m;
								else for (b = 0; b < p; ++b) h.push(f = l[n](v[b])), f.onerror = m;
							}
							function x(t) {
								t = t.target.result, h.forEach(function(e, t) {
									return e.error != null && (g[t] = e.error);
								}), e({
									numFailures: _,
									failures: g,
									results: n === "delete" ? a : h.map(function(e) {
										return e.result;
									}),
									lastResult: t
								});
							}
							f.onerror = function(e) {
								m(e), x(e);
							}, f.onsuccess = x;
						});
					},
					getMany: function(e) {
						var t = e.trans, n = e.keys;
						return new Promise(function(e, r) {
							e = z(e);
							for (var a, o = t.objectStore(i), s = n.length, c = Array(s), l = 0, u = 0, d = function(t) {
								t = t.target, c[t._pos] = t.result, ++u === l && e(c);
							}, f = X(r), p = 0; p < s; ++p) n[p] != null && ((a = o.get(n[p]))._pos = p, a.onsuccess = d, a.onerror = f, ++l);
							l === 0 && e(c);
						});
					},
					get: function(e) {
						var t = e.trans, n = e.key;
						return new Promise(function(e, r) {
							e = z(e);
							var a = t.objectStore(i).get(n);
							a.onsuccess = function(t) {
								return e(t.target.result);
							}, a.onerror = X(r);
						});
					},
					query: (t = c, n = l, function(e) {
						return new Promise(function(a, o) {
							a = z(a);
							var s, c, l, u, d = e.trans, f = e.values, p = e.limit, m = e.query, h = (h = e.direction) ?? "next", g = p === 1 / 0 ? void 0 : p, _ = m.index, m = m.range, d = d.objectStore(i), d = _.isPrimaryKey ? d : d.index(_.name), _ = r(m);
							if (p === 0) return a({ result: [] });
							n ? (m = {
								query: _,
								count: g,
								direction: h
							}, (s = f ? d.getAll(m) : d.getAllKeys(m)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = X(o)) : t && h === "next" ? ((s = f ? d.getAll(_, g) : d.getAllKeys(_, g)).onsuccess = function(e) {
								return a({ result: e.target.result });
							}, s.onerror = X(o)) : (c = 0, l = !f && "openKeyCursor" in d ? d.openKeyCursor(_, h) : d.openCursor(_, h), u = [], l.onsuccess = function() {
								var e = l.result;
								return !e || (u.push(f ? e.value : e.primaryKey), ++c === p) ? a({ result: u }) : void e.continue();
							}, l.onerror = X(o));
						});
					}),
					openCursor: function(e) {
						var t = e.trans, n = e.values, a = e.query, o = e.reverse, s = e.unique;
						return new Promise(function(e, c) {
							e = z(e);
							var l = a.index, u = a.range, d = t.objectStore(i), d = l.isPrimaryKey ? d : d.index(l.name), l = o ? s ? "prevunique" : "prev" : s ? "nextunique" : "next", f = !n && "openKeyCursor" in d ? d.openKeyCursor(r(u), l) : d.openCursor(r(u), l);
							f.onerror = X(c), f.onsuccess = z(function(n) {
								var r, i, a, o, s = f.result;
								s ? (s.___id = ++$t, s.done = !1, r = s.continue.bind(s), i = (i = s.continuePrimaryKey) && i.bind(s), a = s.advance.bind(s), o = function() {
									throw Error("Cursor not stopped");
								}, s.trans = t, s.stop = s.continue = s.continuePrimaryKey = s.advance = function() {
									throw Error("Cursor not started");
								}, s.fail = z(c), s.next = function() {
									var e = this, t = 1;
									return this.start(function() {
										return t-- ? e.continue() : e.stop();
									}).then(function() {
										return e;
									});
								}, s.start = function(e) {
									function t() {
										if (f.result) try {
											e();
										} catch (e) {
											s.fail(e);
										}
										else s.done = !0, s.start = function() {
											throw Error("Cursor behind last entry");
										}, s.stop();
									}
									var n = new Promise(function(e, t) {
										e = z(e), f.onerror = X(t), s.fail = t, s.stop = function(t) {
											s.stop = s.continue = s.continuePrimaryKey = s.advance = o, e(t);
										};
									});
									return f.onsuccess = z(function(e) {
										f.onsuccess = t, t();
									}), s.continue = r, s.continuePrimaryKey = i, s.advance = a, t(), n;
								}, e(s)) : e(null);
							}, c);
						});
					},
					count: function(e) {
						var t = e.query, n = e.trans, a = t.index, o = t.range;
						return new Promise(function(e, t) {
							var s = n.objectStore(i), s = a.isPrimaryKey ? s : s.index(a.name), c = r(o), c = c ? s.count(c) : s.count();
							c.onsuccess = z(function(t) {
								return e(t.target.result);
							}), c.onerror = X(t);
						});
					}
				};
			}
			o = n, s = Qt((n = e).objectStoreNames), u = 0 < s.length ? o.objectStore(s[0]) : {};
			var o, n = {
				schema: {
					name: n.name,
					tables: s.map(function(e) {
						return o.objectStore(e);
					}).map(function(e) {
						var t = e.keyPath, n = e.autoIncrement, r = a(t), i = {}, r = {
							name: e.name,
							primaryKey: {
								name: null,
								isPrimaryKey: !0,
								outbound: t == null,
								compound: r,
								keyPath: t,
								autoIncrement: n,
								unique: !0,
								extractKey: Zt(t)
							},
							indexes: Qt(e.indexNames).map(function(t) {
								return e.index(t);
							}).map(function(e) {
								var t = e.name, n = e.unique, r = e.multiEntry, e = e.keyPath, t = {
									name: t,
									compound: a(e),
									keyPath: e,
									unique: n,
									multiEntry: r,
									extractKey: Zt(e)
								};
								return i[en(e)] = t;
							}),
							getIndexByKeyPath: function(e) {
								return i[en(e)];
							}
						};
						return i[":id"] = r.primaryKey, t != null && (i[en(t)] = r.primaryKey), r;
					})
				},
				hasGetAll: 0 < s.length && "getAll" in u && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604),
				hasIdb3Features: "getAllRecords" in u
			}, s = n.schema, c = n.hasGetAll, l = n.hasIdb3Features, u = s.tables.map(i), d = {};
			return u.forEach(function(e) {
				return d[e.name] = e;
			}), {
				stack: "dbcore",
				transaction: e.transaction.bind(e),
				table: function(e) {
					if (d[e]) return d[e];
					throw Error(`Table '${e}' not found`);
				},
				MIN_KEY: -1 / 0,
				MAX_KEY: Xt(t),
				schema: s
			};
		}
		function nn(e, n, r, i) {
			return r = r.IDBKeyRange, n = tn(n, r, i), { dbcore: e.dbcore.reduce(function(e, n) {
				return n = n.create, t(t({}, e), n(e));
			}, n) };
		}
		function rn(e, t) {
			var n = t.db, n = nn(e._middlewares, n, e._deps, t);
			e.core = n.dbcore, e.tables.forEach(function(t) {
				var n = t.name;
				e.core.schema.tables.some(function(e) {
					return e.name === n;
				}) && (t.core = e.core.table(n), e[n] instanceof e.Table) && (e[n].core = t.core);
			});
		}
		function an(e, t, n, r) {
			n.forEach(function(n) {
				var i = r[n];
				t.forEach(function(t) {
					var r = function e(t, n) {
						return m(t, n) || (t = s(t)) && e(t, n);
					}(t, n);
					(!r || "value" in r && r.value === void 0) && (t === e.Transaction.prototype || t instanceof e.Transaction ? f(t, n, {
						get: function() {
							return this.table(n);
						},
						set: function(e) {
							d(this, n, {
								value: e,
								writable: !0,
								configurable: !0,
								enumerable: !0
							});
						}
					}) : t[n] = new e.Table(n, i));
				});
			});
		}
		function on(e, t) {
			t.forEach(function(t) {
				for (var n in t) t[n] instanceof e.Table && delete t[n];
			});
		}
		function sn(e, t) {
			return e._cfg.version - t._cfg.version;
		}
		function cn(e, t, n, r) {
			var a = e._dbSchema, o = (n.objectStoreNames.contains("$meta") && !a.$meta && (a.$meta = Yt("$meta", gn("")[0], []), e._storeNames.push("$meta")), e._createTransaction("readwrite", e._storeNames, a)), s = (o.create(n), o._completion.catch(r), o._reject.bind(o)), c = I.transless || I;
			$e(function() {
				if (I.trans = o, I.transless = c, t !== 0) return rn(e, n), l = t, ((r = o).storeNames.includes("$meta") ? r.table("$meta").get("version").then(function(e) {
					return e ?? l;
				}) : R.resolve(l)).then(function(t) {
					var r = e, a = t, s = o, c = n, l = [], t = r._versions, u = r._dbSchema = mn(0, r.idbdb, c);
					return (t = t.filter(function(e) {
						return e._cfg.version >= a;
					})).length === 0 ? R.resolve() : (t.forEach(function(e) {
						l.push(function() {
							var t, n, o, l = u, d = e._cfg.dbschema, f = (hn(r, l, c), hn(r, d, c), u = r._dbSchema = d, un(l, d)), p = (f.add.forEach(function(e) {
								dn(c, e[0], e[1].primKey, e[1].indexes);
							}), f.change.forEach(function(e) {
								if (e.recreate) throw new j.Upgrade("Not yet support for changing primary key");
								var t = c.objectStore(e.name);
								e.add.forEach(function(e) {
									return pn(t, e);
								}), e.change.forEach(function(e) {
									t.deleteIndex(e.name), pn(t, e);
								}), e.del.forEach(function(e) {
									return t.deleteIndex(e);
								});
							}), e._cfg.contentUpgrade);
							if (p && e._cfg.version > a) return rn(r, c), s._memoizedTables = {}, t = S(d), f.del.forEach(function(e) {
								t[e] = l[e];
							}), on(r, [r.Transaction.prototype]), an(r, [r.Transaction.prototype], i(t), t), s.schema = t, (n = se(p)) && V(), d = R.follow(function() {
								var e;
								(o = p(s)) && n && (e = H.bind(null, null), o.then(e, e));
							}), o && typeof o.then == "function" ? R.resolve(o) : d.then(function() {
								return o;
							});
						}), l.push(function(t) {
							var n = e._cfg.dbschema, i = t;
							[].slice.call(i.db.objectStoreNames).forEach(function(e) {
								return n[e] == null && i.db.deleteObjectStore(e);
							}), on(r, [r.Transaction.prototype]), an(r, [r.Transaction.prototype], r._storeNames, r._dbSchema), s.schema = r._dbSchema;
						}), l.push(function(t) {
							r.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(r.idbdb.version / 10) === e._cfg.version ? (r.idbdb.deleteObjectStore("$meta"), delete r._dbSchema.$meta, r._storeNames = r._storeNames.filter(function(e) {
								return e !== "$meta";
							})) : t.objectStore("$meta").put(e._cfg.version, "version"));
						});
					}), function e() {
						return l.length ? R.resolve(l.shift()(s.idbtrans)).then(e) : R.resolve();
					}().then(function() {
						fn(u, c);
					}));
				}).catch(s);
				var r, l;
				i(a).forEach(function(e) {
					dn(n, e, a[e].primKey, a[e].indexes);
				}), rn(e, n), R.follow(function() {
					return e.on.populate.fire(o);
				}).catch(s);
			});
		}
		function ln(e, t) {
			fn(e._dbSchema, t), t.db.version % 10 != 0 || t.objectStoreNames.contains("$meta") || t.db.createObjectStore("$meta").add(Math.ceil(t.db.version / 10 - 1), "version");
			var n = mn(0, e.idbdb, t);
			hn(e, e._dbSchema, t);
			for (var r = 0, i = un(n, e._dbSchema).change; r < i.length; r++) {
				var a = ((e) => {
					if (e.change.length || e.recreate) return console.warn(`Unable to patch indexes of table ${e.name} because it has changes on the type of index or primary key.`), { value: void 0 };
					var n = t.objectStore(e.name);
					e.add.forEach(function(t) {
						Se && console.debug(`Dexie upgrade patch: Creating missing index ${e.name}.${t.src}`), pn(n, t);
					});
				})(i[r]);
				if (typeof a == "object") return a.value;
			}
		}
		function un(e, t) {
			var n, r = {
				del: [],
				add: [],
				change: []
			};
			for (n in e) t[n] || r.del.push(n);
			for (n in t) {
				var i = e[n], a = t[n];
				if (i) {
					var o = {
						name: n,
						def: a,
						recreate: !1,
						del: [],
						add: [],
						change: []
					};
					if ("" + (i.primKey.keyPath || "") != "" + (a.primKey.keyPath || "") || i.primKey.auto !== a.primKey.auto) o.recreate = !0, r.change.push(o);
					else {
						var s = i.idxByName, c = a.idxByName, l = void 0;
						for (l in s) c[l] || o.del.push(l);
						for (l in c) {
							var u = s[l], d = c[l];
							u ? u.src !== d.src && o.change.push(d) : o.add.push(d);
						}
						(0 < o.del.length || 0 < o.add.length || 0 < o.change.length) && r.change.push(o);
					}
				} else r.add.push([n, a]);
			}
			return r;
		}
		function dn(e, t, n, r) {
			var i = e.db.createObjectStore(t, n.keyPath ? {
				keyPath: n.keyPath,
				autoIncrement: n.auto
			} : { autoIncrement: n.auto });
			r.forEach(function(e) {
				return pn(i, e);
			});
		}
		function fn(e, t) {
			i(e).forEach(function(n) {
				t.db.objectStoreNames.contains(n) || (Se && console.debug("Dexie: Creating missing table", n), dn(t, n, e[n].primKey, e[n].indexes));
			});
		}
		function pn(e, t) {
			e.createIndex(t.name, t.keyPath, {
				unique: t.unique,
				multiEntry: t.multi
			});
		}
		function mn(e, t, n) {
			var r = {};
			return g(t.objectStoreNames, 0).forEach(function(e) {
				for (var t = n.objectStore(e), i = qt(Jt(c = t.keyPath), c || "", !0, !1, !!t.autoIncrement, c && typeof c != "string", !0), a = [], o = 0; o < t.indexNames.length; ++o) {
					var s = t.index(t.indexNames[o]), c = s.keyPath, s = qt(s.name, c, !!s.unique, !!s.multiEntry, !1, c && typeof c != "string", !1);
					a.push(s);
				}
				r[e] = Yt(e, i, a);
			}), r;
		}
		function hn(e, t, n) {
			for (var i = n.db.objectStoreNames, a = 0; a < i.length; ++a) {
				var o = i[a], s = n.objectStore(o);
				e._hasGetAll = "getAll" in s;
				for (var c = 0; c < s.indexNames.length; ++c) {
					var l, u = s.indexNames[c], d = s.index(u).keyPath, d = typeof d == "string" ? d : "[" + g(d).join("+") + "]";
					t[o] && (l = t[o].idxByName[d]) && (l.name = u, delete t[o].idxByName[d], t[o].idxByName[u] = l);
				}
			}
			typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && r.WorkerGlobalScope && r instanceof r.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e._hasGetAll = !1);
		}
		function gn(e) {
			return e.split(",").map(function(e, t) {
				var n = e.split(":"), r = (r = n[1])?.trim(), n = (e = n[0].trim()).replace(/([&*]|\+\+)/g, ""), i = /^\[/.test(n) ? n.match(/^\[(.*)\]$/)[1].split("+") : n;
				return qt(n, i || null, /\&/.test(e), /\*/.test(e), /\+\+/.test(e), a(i), t === 0, r);
			});
		}
		vn.prototype._createTableSchema = Yt, vn.prototype._parseIndexSyntax = gn, vn.prototype._parseStoresSpec = function(e, t) {
			var n = this;
			i(e).forEach(function(r) {
				if (e[r] !== null) {
					var i = n._parseIndexSyntax(e[r]), a = i.shift();
					if (!a) throw new j.Schema("Invalid schema for table " + r + ": " + e[r]);
					if (a.unique = !0, a.multi) throw new j.Schema("Primary key cannot be multiEntry*");
					i.forEach(function(e) {
						if (e.auto) throw new j.Schema("Only primary key can be marked as autoIncrement (++)");
						if (!e.keyPath) throw new j.Schema("Index must have a name and cannot be an empty string");
					}), a = n._createTableSchema(r, a, i), t[r] = a;
				}
			});
		}, vn.prototype.stores = function(e) {
			var t = this.db, e = (this._cfg.storesSource = this._cfg.storesSource ? o(this._cfg.storesSource, e) : e, t._versions), n = {}, r = {};
			return e.forEach(function(e) {
				o(n, e._cfg.storesSource), r = e._cfg.dbschema = {}, e._parseStoresSpec(n, r);
			}), t._dbSchema = r, on(t, [
				t._allTables,
				t,
				t.Transaction.prototype
			]), an(t, [
				t._allTables,
				t,
				t.Transaction.prototype,
				this._cfg.tables
			], i(r), r), t._storeNames = i(r), this;
		}, vn.prototype.upgrade = function(e) {
			return this._cfg.contentUpgrade = xe(this._cfg.contentUpgrade || M, e), this;
		};
		var _n = vn;
		function vn() {}
		var yn = (() => {
			var e, t, n;
			return typeof FinalizationRegistry < "u" && typeof WeakRef < "u" ? (e = /* @__PURE__ */ new Set(), t = new FinalizationRegistry(function(t) {
				e.delete(t);
			}), {
				toArray: function() {
					return Array.from(e).map(function(e) {
						return e.deref();
					}).filter(function(e) {
						return e !== void 0;
					});
				},
				add: function(n) {
					var r = new WeakRef(n._novip);
					e.add(r), t.register(n._novip, r, r), e.size > n._options.maxConnections && (r = e.values().next().value, e.delete(r), t.unregister(r));
				},
				remove: function(n) {
					if (n) for (var r = e.values(), i = r.next(); !i.done;) {
						var a = i.value;
						if (a.deref() === n._novip) return e.delete(a), void t.unregister(a);
						i = r.next();
					}
				}
			}) : (n = [], {
				toArray: function() {
					return n;
				},
				add: function(e) {
					n.push(e._novip);
				},
				remove: function(e) {
					e && (e = n.indexOf(e._novip)) !== -1 && n.splice(e, 1);
				}
			});
		})();
		function bn(e, t) {
			var n = e._dbNamesDB;
			return n || (n = e._dbNamesDB = new rr(ut, {
				addons: [],
				indexedDB: e,
				IDBKeyRange: t
			})).version(1).stores({ dbnames: "name" }), n.table("dbnames");
		}
		function xn(e) {
			return e && typeof e.databases == "function";
		}
		function Z(e) {
			return $e(function() {
				return I.letThrough = !0, e();
			});
		}
		function Sn(e) {
			return !("from" in e);
		}
		var Q = function(e, t) {
			var n;
			if (!this) return n = new Q(), e && "d" in e && o(n, e), n;
			o(this, arguments.length ? {
				d: 1,
				from: e,
				to: 1 < arguments.length ? t : e
			} : { d: 0 });
		};
		function Cn(e, t, n) {
			var r = G(t, n);
			if (!isNaN(r)) {
				if (0 < r) throw RangeError();
				if (Sn(e)) return o(e, {
					from: t,
					to: n,
					d: 1
				});
				var r = e.l, i = e.r;
				if (G(n, e.from) < 0) return r ? Cn(r, t, n) : e.l = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, Dn(e);
				if (0 < G(t, e.to)) return i ? Cn(i, t, n) : e.r = {
					from: t,
					to: n,
					d: 1,
					l: null,
					r: null
				}, Dn(e);
				G(t, e.from) < 0 && (e.from = t, e.l = null, e.d = i ? i.d + 1 : 1), 0 < G(n, e.to) && (e.to = n, e.r = null, e.d = e.l ? e.l.d + 1 : 1), t = !e.r, r && !e.l && wn(e, r), i && t && wn(e, i);
			}
		}
		function wn(e, t) {
			Sn(t) || function e(t, n) {
				var r = n.from, i = n.l, a = n.r;
				Cn(t, r, n.to), i && e(t, i), a && e(t, a);
			}(e, t);
		}
		function Tn(e, t) {
			var n = En(t), r = n.next();
			if (!r.done) for (var i = r.value, a = En(e), o = a.next(i.from), s = o.value; !r.done && !o.done;) {
				if (G(s.from, i.to) <= 0 && 0 <= G(s.to, i.from)) return !0;
				G(i.from, s.from) < 0 ? i = (r = n.next(s.from)).value : s = (o = a.next(i.from)).value;
			}
			return !1;
		}
		function En(e) {
			var t = Sn(e) ? null : {
				s: 0,
				n: e
			};
			return { next: function(e) {
				for (var n = 0 < arguments.length; t;) switch (t.s) {
					case 0: if (t.s = 1, n) for (; t.n.l && G(e, t.n.from) < 0;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					else for (; t.n.l;) t = {
						up: t,
						n: t.n.l,
						s: 1
					};
					case 1: if (t.s = 2, !n || G(e, t.n.to) <= 0) return {
						value: t.n,
						done: !1
					};
					case 2: if (t.n.r) {
						t.s = 3, t = {
							up: t,
							n: t.n.r,
							s: 0
						};
						continue;
					}
					case 3: t = t.up;
				}
				return { done: !0 };
			} };
		}
		function Dn(e) {
			var n, r, i, a = ((a = e.r)?.d || 0) - ((a = e.l)?.d || 0), a = 1 < a ? "r" : a < -1 ? "l" : "";
			a && (n = a == "r" ? "l" : "r", r = t({}, e), i = e[a], e.from = i.from, e.to = i.to, e[a] = i[a], r[a] = i[n], (e[n] = r).d = On(r)), e.d = On(e);
		}
		function On(e) {
			var t = e.r, e = e.l;
			return (t ? e ? Math.max(t.d, e.d) : t.d : e ? e.d : 0) + 1;
		}
		function kn(e, t) {
			return i(t).forEach(function(n) {
				e[n] ? wn(e[n], t[n]) : e[n] = function e(t) {
					var n, r, i = {};
					for (n in t) l(t, n) && (r = t[n], i[n] = !r || typeof r != "object" || E.has(r.constructor) ? r : e(r));
					return i;
				}(t[n]);
			}), e;
		}
		function An(e, t) {
			return e.all || t.all || Object.keys(e).some(function(n) {
				return t[n] && Tn(t[n], e[n]);
			});
		}
		u(Q.prototype, ((k = {
			add: function(e) {
				return wn(this, e), this;
			},
			addKey: function(e) {
				return Cn(this, e, e), this;
			},
			addKeys: function(e) {
				var t = this;
				return e.forEach(function(e) {
					return Cn(t, e, e);
				}), this;
			},
			hasKey: function(e) {
				var t = En(this).next(e).value;
				return t && G(t.from, e) <= 0 && 0 <= G(t.to, e);
			}
		})[re] = function() {
			return En(this);
		}, k));
		var jn = {}, Mn = {}, Nn = !1;
		function Pn(e) {
			kn(Mn, e), Nn || (Nn = !0, setTimeout(function() {
				Nn = !1, Fn(Mn, !(Mn = {}));
			}, 0));
		}
		function Fn(e, t) {
			t === void 0 && (t = !1);
			var n = /* @__PURE__ */ new Set();
			if (e.all) for (var r = 0, i = Object.values(jn); r < i.length; r++) In(s = i[r], e, n, t);
			else for (var a in e) {
				var o, s, a = /^idb\:\/\/(.*)\/(.*)\//.exec(a);
				a && (o = a[1], a = a[2], s = jn[`idb://${o}/${a}`]) && In(s, e, n, t);
			}
			n.forEach(function(e) {
				return e();
			});
		}
		function In(e, t, n, r) {
			for (var i = [], a = 0, o = Object.entries(e.queries.query); a < o.length; a++) {
				for (var s = o[a], c = s[0], l = [], u = 0, d = s[1]; u < d.length; u++) {
					var f = d[u];
					An(t, f.obsSet) ? f.subscribers.forEach(function(e) {
						return n.add(e);
					}) : r && l.push(f);
				}
				r && i.push([c, l]);
			}
			if (r) for (var p = 0, m = i; p < m.length; p++) {
				var h = m[p], c = h[0], l = h[1];
				e.queries.query[c] = l;
			}
		}
		function Ln(e) {
			var t = e._state, n = e._deps.indexedDB;
			if (t.isBeingOpened || e.idbdb) return t.dbReadyPromise.then(function() {
				return t.dbOpenError ? U(t.dbOpenError) : e;
			});
			t.isBeingOpened = !0, t.dbOpenError = null, t.openComplete = !1;
			var r = t.openCanceller, a = Math.round(10 * e.verno), o = !1;
			function s() {
				if (t.openCanceller !== r) throw new j.DatabaseClosed("db.open() was cancelled");
			}
			function c() {
				return new R(function(r, l) {
					if (s(), !n) throw new j.MissingAPI();
					var u = e.name, p = t.autoSchema || !a ? n.open(u) : n.open(u, a);
					if (!p) throw new j.MissingAPI();
					p.onerror = X(l), p.onblocked = z(e._fireOnBlocked), p.onupgradeneeded = z(function(r) {
						var i;
						d = p.transaction, t.autoSchema && !e._options.allowEmptyDB ? (p.onerror = Vt, d.abort(), p.result.close(), (i = n.deleteDatabase(u)).onsuccess = i.onerror = z(function() {
							l(new j.NoSuchDatabase(`Database ${u} doesnt exist`));
						})) : (d.onerror = X(l), i = r.oldVersion > 2 ** 62 ? 0 : r.oldVersion, f = i < 1, e.idbdb = p.result, o && ln(e, d), cn(e, i / 10, d, l));
					}, l), p.onsuccess = z(function() {
						d = null;
						var n, s, l, m, h, _, v = e.idbdb = p.result, y = g(v.objectStoreNames);
						if (0 < y.length) try {
							var b = v.transaction((h = y).length === 1 ? h[0] : h, "readonly");
							if (t.autoSchema) _ = v, m = b, (l = e).verno = _.version / 10, m = l._dbSchema = mn(0, _, m), l._storeNames = g(_.objectStoreNames, 0), an(l, [l._allTables], i(m), m);
							else if (hn(e, e._dbSchema, b), s = b, ((s = un(mn(0, (n = e).idbdb, s), n._dbSchema)).add.length || s.change.some(function(e) {
								return e.add.length || e.change.length;
							})) && !o) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), v.close(), a = v.version + 1, o = !0, r(c());
							rn(e, b);
						} catch {}
						yn.add(e), v.onversionchange = z(function(n) {
							t.vcFired = !0, e.on("versionchange").fire(n);
						}), v.onclose = z(function() {
							e.close({ disableAutoOpen: !1 });
						}), f && (y = e._deps, h = u, xn(_ = y.indexedDB) || h === ut || bn(_, y.IDBKeyRange).put({ name: h }).catch(M)), r();
					}, l);
				}).catch(function(e) {
					switch (e?.name) {
						case "UnknownError":
							if (0 < t.PR1398_maxLoop) return t.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), c();
							break;
						case "VersionError": if (0 < a) return a = 0, c();
					}
					return R.reject(e);
				});
			}
			var l, u = t.dbReadyResolve, d = null, f = !1;
			return R.race([r, (typeof navigator > "u" ? R.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e) {
				function t() {
					return indexedDB.databases().finally(e);
				}
				l = setInterval(t, 100), t();
			}).finally(function() {
				return clearInterval(l);
			}) : Promise.resolve()).then(c)]).then(function() {
				return s(), t.onReadyBeingFired = [], R.resolve(Z(function() {
					return e.on.ready.fire(e.vip);
				})).then(function n() {
					var r;
					if (0 < t.onReadyBeingFired.length) return r = t.onReadyBeingFired.reduce(xe, M), t.onReadyBeingFired = [], R.resolve(Z(function() {
						return r(e.vip);
					})).then(n);
				});
			}).finally(function() {
				t.openCanceller === r && (t.onReadyBeingFired = null, t.isBeingOpened = !1);
			}).catch(function(n) {
				t.dbOpenError = n;
				try {
					d && d.abort();
				} catch {}
				return r === t.openCanceller && e._close(), U(n);
			}).finally(function() {
				t.openComplete = !0, u();
			}).then(function() {
				var t;
				return f && (t = {}, e.tables.forEach(function(n) {
					n.schema.indexes.forEach(function(r) {
						r.name && (t[`idb://${e.name}/${n.name}/${r.name}`] = new Q(-1 / 0, [[[]]]));
					}), t[`idb://${e.name}/${n.name}/`] = t[`idb://${e.name}/${n.name}/:dels`] = new Q(-1 / 0, [[[]]]);
				}), Wt(Ht).fire(t), Fn(t, !0)), e;
			});
		}
		function Rn(e) {
			function t(t) {
				return e.next(t);
			}
			var n = i(t), r = i(function(t) {
				return e.throw(t);
			});
			function i(e) {
				return function(t) {
					var t = e(t), i = t.value;
					return t.done ? i : i && typeof i.then == "function" ? i.then(n, r) : a(i) ? Promise.all(i).then(n, r) : n(i);
				};
			}
			return i(t)();
		}
		function zn(e, t, n) {
			for (var r = a(e) ? e.slice() : [e], i = 0; i < n; ++i) r.push(t);
			return r;
		}
		var Bn = {
			stack: "dbcore",
			name: "VirtualIndexMiddleware",
			level: 1,
			create: function(e) {
				return t(t({}, e), { table: function(n) {
					var r = e.table(n), n = r.schema, i = Object.create(null), a = [];
					function o(e, n, r) {
						var s = en(e), c = i[s] = i[s] || [], l = e == null ? 0 : typeof e == "string" ? 1 : e.length, u = 0 < n, s = t(t({}, r), {
							name: u ? `${s}(virtual-from:${r.name})` : r.name,
							lowLevelIndex: r,
							isVirtual: u,
							keyTail: n,
							keyLength: l,
							extractKey: Zt(e),
							unique: !u && r.unique
						});
						return c.push(s), s.isPrimaryKey || a.push(s), 1 < l && o(l === 2 ? e[0] : e.slice(0, l - 1), n + 1, r), c.sort(function(e, t) {
							return e.keyTail - t.keyTail;
						}), s;
					}
					var s = o(n.primaryKey.keyPath, 0, n.primaryKey);
					i[":id"] = [s];
					for (var c = 0, l = n.indexes; c < l.length; c++) {
						var u = l[c];
						o(u.keyPath, 0, u);
					}
					function d(n) {
						var r, i = n.query.index;
						return i.isVirtual ? t(t({}, n), { query: {
							index: i.lowLevelIndex,
							range: (r = n.query.range, i = i.keyTail, {
								type: r.type === 1 ? 2 : r.type,
								lower: zn(r.lower, r.lowerOpen ? e.MAX_KEY : e.MIN_KEY, i),
								lowerOpen: !0,
								upper: zn(r.upper, r.upperOpen ? e.MIN_KEY : e.MAX_KEY, i),
								upperOpen: !0
							})
						} }) : n;
					}
					return t(t({}, r), {
						schema: t(t({}, n), {
							primaryKey: s,
							indexes: a,
							getIndexByKeyPath: function(e) {
								return (e = i[en(e)]) && e[0];
							}
						}),
						count: function(e) {
							return r.count(d(e));
						},
						query: function(e) {
							return r.query(d(e));
						},
						openCursor: function(t) {
							var n = t.query.index, i = n.keyTail, a = n.keyLength;
							return n.isVirtual ? r.openCursor(d(t)).then(function(e) {
								return e && o(e);
							}) : r.openCursor(t);
							function o(n) {
								return Object.create(n, {
									continue: { value: function(r) {
										r == null ? t.unique ? n.continue(n.key.slice(0, a).concat(t.reverse ? e.MIN_KEY : e.MAX_KEY, i)) : n.continue() : n.continue(zn(r, t.reverse ? e.MAX_KEY : e.MIN_KEY, i));
									} },
									continuePrimaryKey: { value: function(t, r) {
										n.continuePrimaryKey(zn(t, e.MAX_KEY, i), r);
									} },
									primaryKey: { get: function() {
										return n.primaryKey;
									} },
									key: { get: function() {
										var e = n.key;
										return a === 1 ? e[0] : e.slice(0, a);
									} },
									value: { get: function() {
										return n.value;
									} }
								});
							}
						}
					});
				} });
			}
		};
		function Vn(e, t, n, r) {
			return n ||= {}, r ||= "", i(e).forEach(function(i) {
				var a, o, s;
				l(t, i) ? (a = e[i], o = t[i], typeof a == "object" && typeof o == "object" && a && o ? (s = ne(a)) === ne(o) ? s === "Object" ? Vn(a, o, n, r + i + ".") : a !== o && (n[r + i] = t[i]) : n[r + i] = t[i] : a !== o && (n[r + i] = t[i])) : n[r + i] = void 0;
			}), i(t).forEach(function(i) {
				l(e, i) || (n[r + i] = t[i]);
			}), n;
		}
		function Hn(e, t) {
			return t.type === "delete" ? t.keys : t.keys || t.values.map(e.extractKey);
		}
		var Un = {
			stack: "dbcore",
			name: "HooksMiddleware",
			level: 2,
			create: function(e) {
				return t(t({}, e), { table: function(r) {
					var i = e.table(r), a = i.schema.primaryKey;
					return t(t({}, i), { mutate: function(e) {
						var o = I.trans, s = o.table(r).hook, c = s.deleting, u = s.creating, d = s.updating;
						switch (e.type) {
							case "add":
								if (u.fire === M) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "put":
								if (u.fire === M && d.fire === M) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "delete":
								if (c.fire === M) break;
								return o._promise("readwrite", function() {
									return f(e);
								}, !0);
							case "deleteRange":
								if (c.fire === M) break;
								return o._promise("readwrite", function() {
									return function e(n, r, o) {
										return i.query({
											trans: n,
											values: !1,
											query: {
												index: a,
												range: r
											},
											limit: o
										}).then(function(i) {
											var a = i.result;
											return f({
												type: "delete",
												keys: a,
												trans: n
											}).then(function(i) {
												return 0 < i.numFailures ? Promise.reject(i.failures[0]) : a.length < o ? {
													failures: [],
													numFailures: 0,
													lastResult: void 0
												} : e(n, t(t({}, r), {
													lower: a[a.length - 1],
													lowerOpen: !0
												}), o);
											});
										});
									}(e.trans, e.range, 1e4);
								}, !0);
						}
						return i.mutate(e);
						function f(e) {
							var r, o, s, f = I.trans, p = e.keys || Hn(a, e);
							if (p) return (e = e.type === "add" || e.type === "put" ? t(t({}, e), { keys: p }) : t({}, e)).type !== "delete" && (e.values = n([], e.values, !0)), e.keys && (e.keys = n([], e.keys, !0)), r = i, s = p, ((o = e).type === "add" ? Promise.resolve([]) : r.getMany({
								trans: o.trans,
								keys: s,
								cache: "immutable"
							})).then(function(t) {
								var n = p.map(function(n, r) {
									var i, o, s, p = t[r], m = {
										onerror: null,
										onsuccess: null
									};
									return e.type === "delete" ? c.fire.call(m, n, p, f) : e.type === "add" || p === void 0 ? (i = u.fire.call(m, n, e.values[r], f), n == null && i != null && (e.keys[r] = n = i, a.outbound || x(e.values[r], a.keyPath, n))) : (i = Vn(p, e.values[r]), (o = d.fire.call(m, i, n, p, f)) && (s = e.values[r], Object.keys(o).forEach(function(e) {
										l(s, e) ? s[e] = o[e] : x(s, e, o[e]);
									}))), m;
								});
								return i.mutate(e).then(function(r) {
									for (var i = r.failures, a = r.results, o = r.numFailures, r = r.lastResult, s = 0; s < p.length; ++s) {
										var c = (a || p)[s], l = n[s];
										c == null ? l.onerror && l.onerror(i[s]) : l.onsuccess && l.onsuccess(e.type === "put" && t[s] ? e.values[s] : c);
									}
									return {
										failures: i,
										results: a,
										numFailures: o,
										lastResult: r
									};
								}).catch(function(e) {
									return n.forEach(function(t) {
										return t.onerror && t.onerror(e);
									}), Promise.reject(e);
								});
							});
							throw Error("Keys missing");
						}
					} });
				} });
			}
		};
		function Wn(e, t, n) {
			try {
				if (!t || t.keys.length < e.length) return null;
				for (var r = [], i = 0, a = 0; i < t.keys.length && a < e.length; ++i) G(t.keys[i], e[a]) === 0 && (r.push(n ? D(t.values[i]) : t.values[i]), ++a);
				return r.length === e.length ? r : null;
			} catch {
				return null;
			}
		}
		var Gn = {
			stack: "dbcore",
			level: -1,
			create: function(e) {
				return { table: function(n) {
					var r = e.table(n);
					return t(t({}, r), {
						getMany: function(e) {
							var t;
							return e.cache ? (t = Wn(e.keys, e.trans._cache, e.cache === "clone")) ? R.resolve(t) : r.getMany(e).then(function(t) {
								return e.trans._cache = {
									keys: e.keys,
									values: e.cache === "clone" ? D(t) : t
								}, t;
							}) : r.getMany(e);
						},
						mutate: function(e) {
							return e.type !== "add" && (e.trans._cache = null), r.mutate(e);
						}
					});
				} };
			}
		};
		function Kn(e, t) {
			return e.trans.mode === "readonly" && !!e.subscr && !e.trans.explicit && e.trans.db._options.cache !== "disabled" && !t.schema.primaryKey.outbound;
		}
		function qn(e, t) {
			switch (e) {
				case "query": return t.values && !t.unique;
				case "get":
				case "getMany":
				case "count":
				case "openCursor": return !1;
			}
		}
		var Jn = {
			stack: "dbcore",
			level: 0,
			name: "Observability",
			create: function(e) {
				var n = e.schema.name, r = new Q(e.MIN_KEY, e.MAX_KEY);
				return t(t({}, e), {
					transaction: function(t, n, r) {
						if (I.subscr && n !== "readonly") throw new j.ReadOnly(`Readwrite transaction in liveQuery context. Querier source: ${I.querier}`);
						return e.transaction(t, n, r);
					},
					table: function(o) {
						function s(t) {
							var t = t.query;
							return [t.index, new Q((t = t.range).lower ?? e.MIN_KEY, t.upper ?? e.MAX_KEY)];
						}
						var c = e.table(o), l = c.schema, u = l.primaryKey, d = l.indexes, f = u.extractKey, p = u.outbound, m = u.autoIncrement && d.filter(function(e) {
							return e.compound && e.keyPath.includes(u.keyPath);
						}), h = t(t({}, c), { mutate: function(t) {
							function i(e) {
								return e = `idb://${n}/${o}/${e}`, h[e] || (h[e] = new Q());
							}
							var s, d, f, p = t.trans, h = t.mutatedParts ||= {}, g = i(""), _ = i(":dels"), v = t.type, y = t.type === "deleteRange" ? [t.range] : t.type === "delete" ? [t.keys] : t.values.length < 50 ? [Hn(u, t).filter(function(e) {
								return e;
							}), t.values] : [], b = y[0], y = y[1], x = t.trans._cache;
							return a(b) ? (g.addKeys(b), (v = v === "delete" || b.length === y.length ? Wn(b, x) : null) || _.addKeys(b), (v || y) && (s = i, d = v, f = y, l.indexes.forEach(function(e) {
								var t = s(e.name || "");
								function n(t) {
									return t == null ? null : e.extractKey(t);
								}
								function r(n) {
									e.multiEntry && a(n) ? n.forEach(function(e) {
										return t.addKey(e);
									}) : t.addKey(n);
								}
								(d || f).forEach(function(e, t) {
									var i = d && n(d[t]), t = f && n(f[t]);
									G(i, t) !== 0 && (i != null && r(i), t != null) && r(t);
								});
							}))) : b ? (y = {
								from: (x = b.lower) ?? e.MIN_KEY,
								to: (v = b.upper) ?? e.MAX_KEY
							}, _.add(y), g.add(y)) : (g.add(r), _.add(r), l.indexes.forEach(function(e) {
								return i(e.name).add(r);
							})), c.mutate(t).then(function(e) {
								return !b || t.type !== "add" && t.type !== "put" || (g.addKeys(e.results), m && m.forEach(function(n) {
									for (var r = t.values.map(function(e) {
										return n.extractKey(e);
									}), a = n.keyPath.findIndex(function(e) {
										return e === u.keyPath;
									}), o = 0, s = e.results.length; o < s; ++o) r[o][a] = e.results[o];
									i(n.name).addKeys(r);
								})), p.mutatedParts = kn(p.mutatedParts || {}, h), e;
							});
						} }), g = {
							get: function(e) {
								return [u, new Q(e.key)];
							},
							getMany: function(e) {
								return [u, new Q().addKeys(e.keys)];
							},
							count: s,
							query: s,
							openCursor: s
						};
						return i(g).forEach(function(e) {
							h[e] = function(i) {
								var a = I.subscr, s = !!a, l = Kn(I, c) && qn(e, i) ? i.obsSet = {} : a;
								if (s) {
									var u, a = function(e) {
										return e = `idb://${n}/${o}/${e}`, l[e] || (l[e] = new Q());
									}, d = a(""), m = a(":dels"), s = g[e](i), h = s[0], s = s[1];
									if ((e === "query" && h.isPrimaryKey && !i.values ? m : a(h.name || "")).add(s), !h.isPrimaryKey) {
										if (e !== "count") return u = e === "query" && p && i.values && c.query(t(t({}, i), { values: !1 })), c[e].apply(this, arguments).then(function(t) {
											if (e === "query") {
												if (p && i.values) return u.then(function(e) {
													return e = e.result, d.addKeys(e), t;
												});
												var n = i.values ? t.result.map(f) : t.result;
												(i.values ? d : m).addKeys(n);
											} else {
												var r, a;
												if (e === "openCursor") return a = i.values, (r = t) && Object.create(r, {
													key: { get: function() {
														return m.addKey(r.primaryKey), r.key;
													} },
													primaryKey: { get: function() {
														var e = r.primaryKey;
														return m.addKey(e), e;
													} },
													value: { get: function() {
														return a && d.addKey(r.primaryKey), r.value;
													} }
												});
											}
											return t;
										});
										m.add(r);
									}
								}
								return c[e].apply(this, arguments);
							};
						}), h;
					}
				});
			}
		};
		function Yn(e, n, r) {
			var i;
			return r.numFailures === 0 ? n : n.type === "deleteRange" || (i = n.keys ? n.keys.length : "values" in n && n.values ? n.values.length : 1, r.numFailures === i) ? null : (i = t({}, n), a(i.keys) && (i.keys = i.keys.filter(function(e, t) {
				return !(t in r.failures);
			})), "values" in i && a(i.values) && (i.values = i.values.filter(function(e, t) {
				return !(t in r.failures);
			})), i);
		}
		function Xn(e, t) {
			return n = e, ((r = t).lower === void 0 || (r.lowerOpen ? 0 < G(n, r.lower) : 0 <= G(n, r.lower))) && (n = e, (r = t).upper === void 0 || (r.upperOpen ? G(n, r.upper) < 0 : G(n, r.upper) <= 0));
			var n, r;
		}
		function Zn(e, t, n, r, i, o) {
			var s, c, l, u, d, f, p;
			return !n || n.length === 0 || (s = t.query.index, c = s.multiEntry, l = t.query.range, u = r.schema.primaryKey.extractKey, d = s.extractKey, f = (s.lowLevelIndex || s).extractKey, (r = n.reduce(function(e, n) {
				var r = e, i = [];
				if (n.type === "add" || n.type === "put") for (var o = new Q(), s = n.values.length - 1; 0 <= s; --s) {
					var f, p = n.values[s], m = u(p);
					!o.hasKey(m) && (f = d(p), c && a(f) ? f.some(function(e) {
						return Xn(e, l);
					}) : Xn(f, l)) && (o.addKey(m), i.push(p));
				}
				switch (n.type) {
					case "add":
						var h = new Q().addKeys(t.values ? e.map(function(e) {
							return u(e);
						}) : e), r = e.concat(t.values ? i.filter(function(e) {
							return e = u(e), !h.hasKey(e) && (h.addKey(e), !0);
						}) : i.map(function(e) {
							return u(e);
						}).filter(function(e) {
							return !h.hasKey(e) && (h.addKey(e), !0);
						}));
						break;
					case "put":
						var g = new Q().addKeys(n.values.map(function(e) {
							return u(e);
						}));
						r = e.filter(function(e) {
							return !g.hasKey(t.values ? u(e) : e);
						}).concat(t.values ? i : i.map(function(e) {
							return u(e);
						}));
						break;
					case "delete":
						var _ = new Q().addKeys(n.keys);
						r = e.filter(function(e) {
							return !_.hasKey(t.values ? u(e) : e);
						});
						break;
					case "deleteRange":
						var v = n.range;
						r = e.filter(function(e) {
							return !Xn(u(e), v);
						});
				}
				return r;
			}, e)) === e) ? e : (p = function(e, t) {
				return G(f(e), f(t)) || G(u(e), u(t));
			}, r.sort(t.direction === "prev" || t.direction === "prevunique" ? function(e, t) {
				return p(t, e);
			} : p), t.limit && t.limit < 1 / 0 && (r.length > t.limit ? r.length = t.limit : e.length === t.limit && r.length < t.limit && (i.dirty = !0)), o ? Object.freeze(r) : r);
		}
		function Qn(e, t) {
			return G(e.lower, t.lower) === 0 && G(e.upper, t.upper) === 0 && !!e.lowerOpen == !!t.lowerOpen && !!e.upperOpen == !!t.upperOpen;
		}
		function $n(e, t) {
			return ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : -1;
				if (t === void 0) return 1;
				if ((e = G(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return 1;
					if (r) return -1;
				}
				return e;
			})(e.lower, t.lower, e.lowerOpen, t.lowerOpen) <= 0 && 0 <= ((e, t, n, r) => {
				if (e === void 0) return t === void 0 ? 0 : 1;
				if (t === void 0) return -1;
				if ((e = G(e, t)) === 0) {
					if (n && r) return 0;
					if (n) return -1;
					if (r) return 1;
				}
				return e;
			})(e.upper, t.upper, e.upperOpen, t.upperOpen);
		}
		function er(e, t, n, r) {
			e.subscribers.add(n), r.addEventListener("abort", function() {
				var r, i;
				e.subscribers.delete(n), e.subscribers.size === 0 && (r = e, i = t, setTimeout(function() {
					r.subscribers.size === 0 && ae(i, r);
				}, 3e3));
			});
		}
		var tr = {
			stack: "dbcore",
			level: 0,
			name: "Cache",
			create: function(e) {
				var n = e.schema.name;
				return t(t({}, e), {
					transaction: function(t, r, i) {
						var a, o, s = e.transaction(t, r, i);
						return r === "readwrite" && (i = (a = new AbortController()).signal, s.addEventListener("abort", (o = function(i) {
							return function() {
								if (a.abort(), r === "readwrite") {
									for (var o = /* @__PURE__ */ new Set(), c = 0, l = t; c < l.length; c++) {
										var u = l[c], d = jn[`idb://${n}/${u}`];
										if (d) {
											var f = e.table(u), p = d.optimisticOps.filter(function(e) {
												return e.trans === s;
											});
											if (s._explicit && i && s.mutatedParts) for (var m = 0, h = Object.values(d.queries.query); m < h.length; m++) for (var g = 0, _ = (b = h[m]).slice(); g < _.length; g++) An((x = _[g]).obsSet, s.mutatedParts) && (ae(b, x), x.subscribers.forEach(function(e) {
												return o.add(e);
											}));
											else if (0 < p.length) {
												d.optimisticOps = d.optimisticOps.filter(function(e) {
													return e.trans !== s;
												});
												for (var v = 0, y = Object.values(d.queries.query); v < y.length; v++) for (var b, x, S, C = 0, w = (b = y[v]).slice(); C < w.length; C++) (x = w[C]).res != null && s.mutatedParts && (i && !x.dirty ? (S = Object.isFrozen(x.res), S = Zn(x.res, x.req, p, f, x, S), x.dirty ? (ae(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})) : S !== x.res && (x.res = S, x.promise = R.resolve({ result: S }))) : (x.dirty && ae(b, x), x.subscribers.forEach(function(e) {
													return o.add(e);
												})));
											}
										}
									}
									o.forEach(function(e) {
										return e();
									});
								}
							};
						})(!1), { signal: i }), s.addEventListener("error", o(!1), { signal: i }), s.addEventListener("complete", o(!0), { signal: i })), s;
					},
					table: function(r) {
						var i = e.table(r), a = i.schema.primaryKey;
						return t(t({}, i), {
							mutate: function(e) {
								var o, s = I.trans;
								return !a.outbound && s.db._options.cache !== "disabled" && !s.explicit && s.idbtrans.mode === "readwrite" && (o = jn[`idb://${n}/${r}`]) ? (s = i.mutate(e), e.type !== "add" && e.type !== "put" || !(50 <= e.values.length || Hn(a, e).some(function(e) {
									return e == null;
								})) ? (o.optimisticOps.push(e), e.mutatedParts && Pn(e.mutatedParts), s.then(function(t) {
									0 < t.numFailures && (ae(o.optimisticOps, e), (t = Yn(0, e, t)) && o.optimisticOps.push(t), e.mutatedParts) && Pn(e.mutatedParts);
								}), s.catch(function() {
									ae(o.optimisticOps, e), e.mutatedParts && Pn(e.mutatedParts);
								})) : s.then(function(n) {
									var r = Yn(0, t(t({}, e), { values: e.values.map(function(e, r) {
										var i;
										return n.failures[r] ? e : (x(i = (i = a.keyPath) != null && i.includes(".") ? D(e) : t({}, e), a.keyPath, n.results[r]), i);
									}) }), n);
									o.optimisticOps.push(r), queueMicrotask(function() {
										return e.mutatedParts && Pn(e.mutatedParts);
									});
								}), s) : i.mutate(e);
							},
							query: function(e) {
								var t, a, o, s, c, l, u;
								return Kn(I, i) && qn("query", e) ? (t = (o = I.trans)?.db._options.cache === "immutable", a = (o = I).requery, o = o.signal, l = ((e, t, n, r) => {
									var i = jn[`idb://${e}/${t}`];
									if (!i) return [];
									if (!(e = i.queries[n])) return [
										null,
										!1,
										i,
										null
									];
									var a = e[(r.query ? r.query.index.name : null) || ""];
									if (!a) return [
										null,
										!1,
										i,
										null
									];
									var o = (s = r.direction) ?? "next", s = a.find(function(e) {
										return e.req.limit === r.limit && e.req.values === r.values && (e.req.direction ?? "next") === o && Qn(e.req.query.range, r.query.range);
									});
									return s ? [
										s,
										!0,
										i,
										a
									] : [
										a.find(function(e) {
											return ("limit" in e.req ? e.req.limit : 1 / 0) >= r.limit && (e.req.direction ?? "next") === o && (!r.values || e.req.values) && $n(e.req.query.range, r.query.range);
										}),
										!1,
										i,
										a
									];
								})(n, r, "query", e), u = l[0], s = l[2], c = l[3], u && l[1] ? u.obsSet = e.obsSet : (l = i.query(e).then(function(e) {
									var n = e.result;
									if (u && (u.res = n), t) {
										for (var r = 0, i = n.length; r < i; ++r) Object.freeze(n[r]);
										Object.freeze(n);
									}
									return e;
								}).catch(function(e) {
									return c && u && ae(c, u), Promise.reject(e);
								}), u = {
									obsSet: e.obsSet,
									promise: l,
									subscribers: /* @__PURE__ */ new Set(),
									type: "query",
									req: e,
									dirty: !1
								}, c ? c.push(u) : (c = [u], (s ||= jn[`idb://${n}/${r}`] = {
									queries: {
										query: {},
										count: {}
									},
									objs: /* @__PURE__ */ new Map(),
									optimisticOps: [],
									unsignaledParts: {}
								}).queries.query[e.query.index.name || ""] = c)), er(u, c, a, o), u.promise.then(function(n) {
									return n = Zn(n.result, e, s?.optimisticOps, i, u, t), { result: t ? n : D(n) };
								})) : i.query(e);
							}
						});
					}
				});
			}
		};
		function nr(e, t) {
			return new Proxy(e, { get: function(e, n, r) {
				return n === "db" ? t : Reflect.get(e, n, r);
			} });
		}
		$.prototype.version = function(e) {
			if (isNaN(e) || e < .1) throw new j.Type("Given version is not a positive number");
			if (e = Math.round(10 * e) / 10, this.idbdb || this._state.isBeingOpened) throw new j.Schema("Cannot add version when database is open");
			this.verno = Math.max(this.verno, e);
			var t = this._versions, n = t.filter(function(t) {
				return t._cfg.version === e;
			})[0];
			return n || (n = new this.Version(e), t.push(n), t.sort(sn), n.stores({}), this._state.autoSchema = !1), n;
		}, $.prototype._whenReady = function(e) {
			var t = this;
			return this.idbdb && (this._state.openComplete || I.letThrough || this._vip) ? e() : new R(function(e, n) {
				if (t._state.openComplete) return n(new j.DatabaseClosed(t._state.dbOpenError));
				if (!t._state.isBeingOpened) {
					if (!t._state.autoOpen) return void n(new j.DatabaseClosed());
					t.open().catch(M);
				}
				t._state.dbReadyPromise.then(e, n);
			}).then(e);
		}, $.prototype.use = function(e) {
			var t = e.stack, n = e.create, r = e.level, e = e.name, i = (e && this.unuse({
				stack: t,
				name: e
			}), this._middlewares[t] || (this._middlewares[t] = []));
			return i.push({
				stack: t,
				create: n,
				level: r ?? 10,
				name: e
			}), i.sort(function(e, t) {
				return e.level - t.level;
			}), this;
		}, $.prototype.unuse = function(e) {
			var t = e.stack, n = e.name, r = e.create;
			return t && this._middlewares[t] && (this._middlewares[t] = this._middlewares[t].filter(function(e) {
				return r ? e.create !== r : !!n && e.name !== n;
			})), this;
		}, $.prototype.open = function() {
			var e = this;
			return it(Pe, function() {
				return Ln(e);
			});
		}, $.prototype._close = function() {
			this.on.close.fire(new CustomEvent("close"));
			var e = this._state;
			if (yn.remove(this), this.idbdb) {
				try {
					this.idbdb.close();
				} catch {}
				this.idbdb = null;
			}
			e.isBeingOpened || (e.dbReadyPromise = new R(function(t) {
				e.dbReadyResolve = t;
			}), e.openCanceller = new R(function(t, n) {
				e.cancelOpen = n;
			}));
		}, $.prototype.close = function(e) {
			var e = (e === void 0 ? { disableAutoOpen: !0 } : e).disableAutoOpen, t = this._state;
			e ? (t.isBeingOpened && t.cancelOpen(new j.DatabaseClosed()), this._close(), t.autoOpen = !1, t.dbOpenError = new j.DatabaseClosed()) : (this._close(), t.autoOpen = this._options.autoOpen || t.isBeingOpened, t.openComplete = !1, t.dbOpenError = null);
		}, $.prototype.delete = function(e) {
			var t = this, n = (e === void 0 && (e = { disableAutoOpen: !0 }), 0 < arguments.length && typeof arguments[0] != "object"), r = this._state;
			return new R(function(i, a) {
				function o() {
					t.close(e);
					var n = t._deps.indexedDB.deleteDatabase(t.name);
					n.onsuccess = z(function() {
						var e = t._deps, n = t.name, r;
						xn(r = e.indexedDB) || n === ut || bn(r, e.IDBKeyRange).delete(n).catch(M), i();
					}), n.onerror = X(a), n.onblocked = t._fireOnBlocked;
				}
				if (n) throw new j.InvalidArgument("Invalid closeOptions argument to db.delete()");
				r.isBeingOpened ? r.dbReadyPromise.then(o) : o();
			});
		}, $.prototype.backendDB = function() {
			return this.idbdb;
		}, $.prototype.isOpen = function() {
			return this.idbdb !== null;
		}, $.prototype.hasBeenClosed = function() {
			var e = this._state.dbOpenError;
			return e && e.name === "DatabaseClosed";
		}, $.prototype.hasFailed = function() {
			return this._state.dbOpenError !== null;
		}, $.prototype.dynamicallyOpened = function() {
			return this._state.autoSchema;
		}, Object.defineProperty($.prototype, "tables", {
			get: function() {
				var e = this;
				return i(this._allTables).map(function(t) {
					return e._allTables[t];
				});
			},
			enumerable: !1,
			configurable: !0
		}), $.prototype.transaction = function() {
			var e = function(e, t, n) {
				var r = arguments.length;
				if (r < 2) throw new j.InvalidArgument("Too few arguments");
				for (var i = Array(r - 1); --r;) i[r - 1] = arguments[r];
				return n = i.pop(), [
					e,
					w(i),
					n
				];
			}.apply(this, arguments);
			return this._transaction.apply(this, e);
		}, $.prototype._transaction = function(e, t, n) {
			var r, i, a = this, o = I.trans, s = (o && o.db === this && e.indexOf("!") === -1 || (o = null), e.indexOf("?") !== -1);
			e = e.replace("!", "").replace("?", "");
			try {
				if (i = t.map(function(e) {
					if (e = e instanceof a.Table ? e.name : e, typeof e != "string") throw TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
					return e;
				}), e == "r" || e === dt) r = dt;
				else {
					if (e != "rw" && e != ft) throw new j.InvalidArgument("Invalid transaction mode: " + e);
					r = ft;
				}
				if (o) {
					if (o.mode === dt && r === ft) {
						if (!s) throw new j.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
						o = null;
					}
					o && i.forEach(function(e) {
						if (o && o.storeNames.indexOf(e) === -1) {
							if (!s) throw new j.SubTransaction("Table " + e + " not included in parent transaction.");
							o = null;
						}
					}), s && o && !o.active && (o = null);
				}
			} catch (e) {
				return o ? o._promise(null, function(t, n) {
					n(e);
				}) : U(e);
			}
			var c = function e(t, n, r, i, a) {
				return R.resolve().then(function() {
					var o = I.transless || I, s = t._createTransaction(n, r, t._dbSchema, i), o = (s.explicit = !0, {
						trans: s,
						transless: o
					});
					if (i) s.idbtrans = i.idbtrans;
					else try {
						s.create(), s.idbtrans._explicit = !0, t._state.PR1398_maxLoop = 3;
					} catch (i) {
						return i.name === fe.InvalidState && t.isOpen() && 0 < --t._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), t.close({ disableAutoOpen: !1 }), t.open().then(function() {
							return e(t, n, r, null, a);
						})) : U(i);
					}
					var c, l = se(a), o = (l && V(), R.follow(function() {
						var e;
						(c = a.call(s, s)) && (l ? (e = H.bind(null, null), c.then(e, e)) : typeof c.next == "function" && typeof c.throw == "function" && (c = Rn(c)));
					}, o));
					return (c && typeof c.then == "function" ? R.resolve(c).then(function(e) {
						return s.active ? e : U(new j.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
					}) : o.then(function() {
						return c;
					})).then(function(e) {
						return i && s._resolve(), s._completion.then(function() {
							return e;
						});
					}).catch(function(e) {
						return s._reject(e), U(e);
					});
				});
			}.bind(null, this, r, i, o, n);
			return o ? o._promise(r, c, "lock") : I.trans ? it(I.transless, function() {
				return a._whenReady(c);
			}) : this._whenReady(c);
		}, $.prototype.table = function(e) {
			if (l(this._allTables, e)) return this._allTables[e];
			throw new j.InvalidTable(`Table ${e} does not exist`);
		};
		var rr = $;
		function $(e, n) {
			var r, i, a, o, s, c = this, l = (this._middlewares = {}, this.verno = 0, $.dependencies), l = (this._options = n = t({
				addons: $.addons,
				autoOpen: !0,
				indexedDB: l.indexedDB,
				IDBKeyRange: l.IDBKeyRange,
				cache: "cloned",
				maxConnections: 1e3
			}, n), this._deps = {
				indexedDB: n.indexedDB,
				IDBKeyRange: n.IDBKeyRange
			}, n.addons), u = (this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this, {
				dbOpenError: null,
				isBeingOpened: !1,
				onReadyBeingFired: null,
				openComplete: !1,
				dbReadyResolve: M,
				dbReadyPromise: null,
				cancelOpen: M,
				openCanceller: null,
				autoSchema: !0,
				PR1398_maxLoop: 3,
				autoOpen: n.autoOpen
			}), d = (u.dbReadyPromise = new R(function(e) {
				u.dbReadyResolve = e;
			}), u.openCanceller = new R(function(e, t) {
				u.cancelOpen = t;
			}), this._state = u, this.name = e, this.on = Ct(this, "populate", "blocked", "versionchange", "close", { ready: [xe, M] }), this.once = function(e, t) {
				var n = function() {
					var r = [...arguments];
					c.on(e).unsubscribe(n), t.apply(c, r);
				};
				return c.on(e, n);
			}, this.on.ready.subscribe = _(this.on.ready.subscribe, function(e) {
				return function(t, n) {
					$.vip(function() {
						var r, i = c._state;
						i.openComplete ? (i.dbOpenError || R.resolve().then(t), n && e(t)) : i.onReadyBeingFired ? (i.onReadyBeingFired.push(t), n && e(t)) : (e(t), r = c, n || e(function e() {
							r.on.ready.unsubscribe(t), r.on.ready.unsubscribe(e);
						}));
					});
				};
			}), this.Collection = (r = this, wt(Mt.prototype, function(e, t) {
				this.db = r;
				var n = mt, i = null;
				if (t) try {
					n = t();
				} catch (e) {
					i = e;
				}
				var t = e._ctx, e = t.table, a = e.hook.reading.fire;
				this._ctx = {
					table: e,
					index: t.index,
					isPrimKey: !t.index || e.schema.primKey.keyPath && t.index === e.schema.primKey.name,
					range: n,
					keysOnly: !1,
					dir: "next",
					unique: "",
					algorithm: null,
					filter: null,
					replayFilter: null,
					justLimit: !0,
					isMatch: null,
					offset: 0,
					limit: 1 / 0,
					error: i,
					or: t.or,
					valueMapper: a === he ? null : a
				};
			})), this.Table = (i = this, wt(St.prototype, function(e, t, n) {
				this.db = i, this._tx = n, this.name = e, this.schema = t, this.hook = i._allTables[e] ? i._allTables[e].hook : Ct(null, {
					creating: [_e, M],
					reading: [ge, he],
					updating: [ye, M],
					deleting: [ve, M]
				});
			})), this.Transaction = (a = this, wt(Gt.prototype, function(e, t, n, r, i) {
				var o = this;
				e !== "readonly" && t.forEach(function(e) {
					e = (e = n[e])?.yProps, e && (t = t.concat(e.map(function(e) {
						return e.updatesTable;
					})));
				}), this.db = a, this.mode = e, this.storeNames = t, this.schema = n, this.chromeTransactionDurability = r, this.idbtrans = null, this.on = Ct(this, "complete", "error", "abort"), this.parent = i || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new R(function(e, t) {
					o._resolve = e, o._reject = t;
				}), this._completion.then(function() {
					o.active = !1, o.on.complete.fire();
				}, function(e) {
					var t = o.active;
					return o.active = !1, o.on.error.fire(e), o.parent ? o.parent._reject(e) : t && o.idbtrans && o.idbtrans.abort(), U(e);
				});
			})), this.Version = (o = this, wt(_n.prototype, function(e) {
				this.db = o, this._cfg = {
					version: e,
					storesSource: null,
					dbschema: {},
					tables: {},
					contentUpgrade: null
				};
			})), this.WhereClause = (s = this, wt(Bt.prototype, function(e, t, n) {
				if (this.db = s, this._ctx = {
					table: e,
					index: t === ":id" ? null : t,
					or: n
				}, this._cmp = this._ascending = G, this._descending = function(e, t) {
					return G(t, e);
				}, this._max = function(e, t) {
					return 0 < G(e, t) ? e : t;
				}, this._min = function(e, t) {
					return G(e, t) < 0 ? e : t;
				}, this._IDBKeyRange = s._deps.IDBKeyRange, !this._IDBKeyRange) throw new j.MissingAPI();
			})), this.on("versionchange", function(e) {
				0 < e.newVersion ? console.warn(`Another connection wants to upgrade database '${c.name}'. Closing db now to resume the upgrade.`) : console.warn(`Another connection wants to delete database '${c.name}'. Closing db now to resume the delete request.`), c.close({ disableAutoOpen: !1 });
			}), this.on("blocked", function(e) {
				!e.newVersion || e.newVersion < e.oldVersion ? console.warn(`Dexie.delete('${c.name}') was blocked`) : console.warn(`Upgrade '${c.name}' blocked by other connection holding version ${e.oldVersion / 10}`);
			}), this._maxKey = Xt(n.IDBKeyRange), this._createTransaction = function(e, t, n, r) {
				return new c.Transaction(e, t, n, c._options.chromeTransactionDurability, r);
			}, this._fireOnBlocked = function(e) {
				c.on("blocked").fire(e), yn.toArray().filter(function(e) {
					return e.name === c.name && e !== c && !e._state.vcFired;
				}).map(function(t) {
					return t.on("versionchange").fire(e);
				});
			}, this.use(Gn), this.use(tr), this.use(Jn), this.use(Bn), this.use(Un), new Proxy(this, { get: function(e, t, n) {
				var r;
				return t === "_vip" || (t === "table" ? function(e) {
					return nr(c.table(e), d);
				} : (r = Reflect.get(e, t, n)) instanceof St ? nr(r, d) : t === "tables" ? r.map(function(e) {
					return nr(e, d);
				}) : t === "_createTransaction" ? function() {
					return nr(r.apply(this, arguments), d);
				} : r);
			} }));
			this.vip = d, l.forEach(function(e) {
				return e(c);
			});
		}
		var ir, De = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", ar = (or.prototype.subscribe = function(e, t, n) {
			return this._subscribe(e && typeof e != "function" ? e : {
				next: e,
				error: t,
				complete: n
			});
		}, or.prototype[De] = function() {
			return this;
		}, or);
		function or(e) {
			this._subscribe = e;
		}
		try {
			ir = {
				indexedDB: r.indexedDB || r.mozIndexedDB || r.webkitIndexedDB || r.msIndexedDB,
				IDBKeyRange: r.IDBKeyRange || r.webkitIDBKeyRange
			};
		} catch {
			ir = {
				indexedDB: null,
				IDBKeyRange: null
			};
		}
		function sr(e) {
			var t, n = !1, r = new ar(function(r) {
				var i = se(e), a, o = !1, s = {}, c = {}, l = {
					get closed() {
						return o;
					},
					unsubscribe: function() {
						o || (o = !0, a && a.abort(), u && Wt.storagemutated.unsubscribe(p));
					}
				}, u = (r.start && r.start(l), !1), d = function() {
					return ot(m);
				};
				function f() {
					return An(c, s);
				}
				var p = function(e) {
					kn(s, e), f() && d();
				}, m = function() {
					var l, m, h;
					!o && ir.indexedDB && (s = {}, l = {}, a && a.abort(), a = new AbortController(), h = ((t) => {
						var n = We();
						try {
							i && V();
							var r = $e(e, t);
							return r = i ? r.finally(H) : r;
						} finally {
							n && Ge();
						}
					})(m = {
						subscr: l,
						signal: a.signal,
						requery: d,
						querier: e,
						trans: null
					}), u ||= (Wt.storagemutated.subscribe(p), !0), Promise.resolve(h).then(function(e) {
						n = !0, t = e, o || m.signal.aborted || (f() || (c = l, f()) ? d() : (s = {}, ot(function() {
							return !o && r.next && r.next(e);
						})));
					}, function(e) {
						n = !1, ["DatabaseClosedError", "AbortError"].includes(e?.name) || o || ot(function() {
							o || r.error && r.error(e);
						});
					}));
				};
				return setTimeout(d, 0), l;
			});
			return r.hasValue = function() {
				return n;
			}, r.getValue = function() {
				return t;
			}, r;
		}
		var cr = rr;
		function lr(e) {
			var t = dr;
			try {
				dr = !0, Wt.storagemutated.fire(e), Fn(e, !0);
			} finally {
				dr = t;
			}
		}
		u(cr, t(t({}, T), {
			delete: function(e) {
				return new cr(e, { addons: [] }).delete();
			},
			exists: function(e) {
				return new cr(e, { addons: [] }).open().then(function(e) {
					return e.close(), !0;
				}).catch("NoSuchDatabaseError", function() {
					return !1;
				});
			},
			getDatabaseNames: function(e) {
				try {
					return t = cr.dependencies, n = t.indexedDB, t = t.IDBKeyRange, (xn(n) ? Promise.resolve(n.databases()).then(function(e) {
						return e.map(function(e) {
							return e.name;
						}).filter(function(e) {
							return e !== ut;
						});
					}) : bn(n, t).toCollection().primaryKeys()).then(e);
				} catch {
					return U(new j.MissingAPI());
				}
				var t, n;
			},
			defineClass: function() {
				return function(e) {
					o(this, e);
				};
			},
			ignoreTransaction: function(e) {
				return I.trans ? it(I.transless || Pe, e) : e();
			},
			vip: Z,
			async: function(e) {
				return function() {
					try {
						var t = Rn(e.apply(this, arguments));
						return t && typeof t.then == "function" ? t : R.resolve(t);
					} catch (e) {
						return U(e);
					}
				};
			},
			spawn: function(e, t, n) {
				try {
					var r = Rn(e.apply(n, t || []));
					return r && typeof r.then == "function" ? r : R.resolve(r);
				} catch (e) {
					return U(e);
				}
			},
			currentTransaction: { get: function() {
				return I.trans || null;
			} },
			waitFor: function(e, t) {
				return e = R.resolve(typeof e == "function" ? cr.ignoreTransaction(e) : e).timeout(t || 6e4), I.trans ? I.trans.waitFor(e) : e;
			},
			Promise: R,
			debug: {
				get: function() {
					return Se;
				},
				set: function(e) {
					Ce(e);
				}
			},
			derive: p,
			extend: o,
			props: u,
			override: _,
			Events: Ct,
			on: Wt,
			liveQuery: sr,
			extendObservabilitySet: kn,
			getByKeyPath: b,
			setByKeyPath: x,
			delByKeyPath: function(e, t) {
				typeof t == "string" ? x(e, t, void 0) : "length" in t && [].map.call(t, function(t) {
					x(e, t, void 0);
				});
			},
			shallowClone: S,
			deepClone: D,
			getObjectDiff: Vn,
			cmp: G,
			asap: y,
			minKey: -1 / 0,
			addons: [],
			connections: { get: yn.toArray },
			errnames: fe,
			dependencies: ir,
			cache: jn,
			semVer: "4.4.6",
			version: "4.4.6".split(".").map(function(e) {
				return parseInt(e);
			}).reduce(function(e, t, n) {
				return e + t / 10 ** (2 * n);
			})
		})), cr.maxKey = Xt(cr.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Wt(Ht, function(e) {
			dr ||= (e = new CustomEvent(Ut, { detail: e }), dr = !0, dispatchEvent(e), !1);
		}), addEventListener(Ut, function(e) {
			e = e.detail, dr || lr(e);
		}));
		var ur, dr = !1, fr = function() {};
		return typeof BroadcastChannel < "u" && ((fr = function() {
			(ur = new BroadcastChannel(Ut)).onmessage = function(e) {
				return e.data && lr(e.data);
			};
		})(), typeof ur.unref == "function" && ur.unref(), Wt(Ht, function(e) {
			dr || ur.postMessage(e);
		})), typeof addEventListener < "u" && (addEventListener("pagehide", function(e) {
			if (!rr.disableBfCache && e.persisted) {
				Se && console.debug("Dexie: handling persisted pagehide"), ur?.close();
				for (var t = 0, n = yn.toArray(); t < n.length; t++) n[t].close({ disableAutoOpen: !1 });
			}
		}), addEventListener("pageshow", function(e) {
			!rr.disableBfCache && e.persisted && (Se && console.debug("Dexie: handling persisted pageshow"), fr(), lr({ all: new Q(-1 / 0, [[]]) }));
		})), R.rejectionMapper = function(e, t) {
			return !e || e instanceof le || e instanceof TypeError || e instanceof SyntaxError || !e.name || !me[e.name] ? e : (t = new me[e.name](t || e.message, e), "stack" in e && f(t, "stack", { get: function() {
				return this.inner.stack;
			} }), t);
		}, Ce(Se), t(rr, Object.freeze({
			__proto__: null,
			DEFAULT_MAX_CONNECTIONS: 1e3,
			Dexie: rr,
			Entity: ht,
			PropModification: yt,
			RangeSet: Q,
			add: function(e) {
				return new yt({ add: e });
			},
			cmp: G,
			default: rr,
			liveQuery: sr,
			mergeRanges: wn,
			rangesOverlap: Tn,
			remove: function(e) {
				return new yt({ remove: e });
			},
			replacePrefix: function(e, t) {
				return new yt({ replacePrefix: [e, t] });
			}
		}), { default: rr }), rr;
	});
})))(), 1), qn = Symbol.for("Dexie"), Jn = globalThis[qn] || (globalThis[qn] = Kn.default);
if (Kn.default.semVer !== Jn.semVer) throw Error(`Two different versions of Dexie loaded in the same app: ${Kn.default.semVer} and ${Jn.semVer}`);
var { liveQuery: Yn, mergeRanges: Xn, rangesOverlap: Zn, RangeSet: Qn, cmp: $n, Entity: er, PropModification: tr, replacePrefix: nr, add: rr, remove: $, DexieYProvider: ir } = Jn, ar = null;
function or(e) {
	ar ||= e();
}
function sr() {
	return ar ?? Promise.resolve();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/storage/ehagakiDb.ts
var cr = "latest", lr = /* @__PURE__ */ new Set(), ur = !1;
function dr(e) {
	ur !== e && (ur = e, lr.forEach((t) => t(e)));
}
var fr = class extends Jn {
	opening = null;
	emojiItems;
	emojiCacheMeta;
	drafts;
	profiles;
	relayConfigs;
	sharedMedia;
	hashtagHistory;
	customEmojiUsage;
	customEmojiImageMeta;
	uploadDestinations;
	postHistory;
	sensitivePayloads;
	postHistoryChildInteractions;
	postHistoryDeletionRequests;
	postMediaCache;
	channelMetadata;
	channelImageCacheMeta;
	postHistoryExternalCoverage;
	postHistoryCitrineRanges;
	postHistoryLocalBrowsingRanges;
	postHistoryLocalResumeCursor;
	postHistoryJumpAnchors;
	postHistoryAuthoredSyncCursor;
	postHistoryInboundSyncCursor;
	postHistoryDirectReplyFetchMeta;
	postHistoryWriteGeneration;
	postHistoryChildWriteGeneration;
	postHistoryReactionDeletionAttempts;
	postHistoryReplyDeletionAttempts;
	events;
	eventStoreMigration;
	notifications;
	notificationSyncState;
	legacyImportState;
	constructor(e = yn, { migrateEvents: t = !0 } = {}) {
		super(e), this.on("blocked", () => {
			dr(!0);
		}), this.on("ready", () => dr(!1)), t && this.on("ready", () => Gn(this.backendDB()), !0), this.version(19).stores({
			events: "id",
			eventStoreMigration: "id",
			emojiItems: "id, pubkeyHex, identityKey, shortcodeLower, sortIndex, sourceType, sourceAddress, fetchedAt, updatedAt, [pubkeyHex+sortIndex], [pubkeyHex+identityKey]",
			emojiCacheMeta: "pubkeyHex, fetchedAt, updatedAt, schemaVersion",
			drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
			profiles: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
			relayConfigs: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
			sharedMedia: "id, createdAt, updatedAt, schemaVersion",
			hashtagHistory: "tagLower, useCount, lastUsed, updatedAt, schemaVersion",
			customEmojiUsage: "id, pubkeyHex, shortcodeLower, src, lastUsedAt, count, updatedAt, schemaVersion, [pubkeyHex+lastUsedAt], [pubkeyHex+shortcodeLower+src]",
			customEmojiImageMeta: "url, width, height, aspectRatio, fetchedAt, lastAccessedAt, updatedAt, schemaVersion",
			uploadDestinations: "id, scopeKey, pubkeyHex, protocol, presetId, isDefault, enabled, updatedAt, [scopeKey+isDefault], [scopeKey+enabled]",
			postHistory: `id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt], ${bn}`,
			sensitivePayloads: "id, pubkeyHex, structureKind, createdAt, updatedAt, deletedAt",
			postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
			postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
			postMediaCache: "cacheKey, url, normalizedUrl, size, createdAt, lastAccessedAt, updatedAt, source, schemaVersion",
			channelMetadata: "channelEventId, fetchedAt, metadataCreatedAt, creatorPubkey, updatedAt, schemaVersion",
			channelImageCacheMeta: "url, responseType, fetchedAt, lastAttemptAt, lastAccessedAt, schemaVersion",
			postHistoryExternalCoverage: "id, ownerPubkeyHex, updatedAt",
			postHistoryCitrineRanges: "id, ownerPubkeyHex, updatedAt",
			postHistoryLocalBrowsingRanges: "id, ownerPubkeyHex, updatedAt",
			postHistoryLocalResumeCursor: "id, ownerPubkeyHex, updatedAt",
			postHistoryJumpAnchors: "id, updatedAt",
			postHistoryAuthoredSyncCursor: "id, updatedAt",
			postHistoryInboundSyncCursor: "id, updatedAt",
			postHistoryDirectReplyFetchMeta: "id, updatedAt",
			postHistoryWriteGeneration: "id, updatedAt",
			postHistoryChildWriteGeneration: "id, updatedAt",
			postHistoryReactionDeletionAttempts: "id, parentEventId, updatedAt",
			postHistoryReplyDeletionAttempts: "id, parentEventId, updatedAt",
			notifications: "id, ownerPubkeyHex, [ownerPubkeyHex+createdAt+eventId], [ownerPubkeyHex+unread]",
			notificationSyncState: "id, ownerPubkeyHex, updatedAt",
			legacyImportState: "id, updatedAt"
		});
	}
	open() {
		return this.opening ? this.opening : this.isOpen() ? Jn.Promise.resolve(this) : (this.opening = Jn.Promise.resolve(sr()).then(() => Pn(Jn.dependencies.indexedDB, { databaseName: this.name })).then(() => super.open()).finally(() => {
			this.opening = null;
		}), this.opening);
	}
}, pr = new fr(), mr = new fr(yn, { migrateEvents: !1 });
export { l as C, c as S, vn as _, or as a, gn as b, Yn as c, wn as d, kn as f, bn as g, yn as h, dr as i, Pn as l, On as m, pr as n, Jn as o, An as p, mr as r, $n as s, cr as t, Cn as u, un as v, s as x, mn as y };
