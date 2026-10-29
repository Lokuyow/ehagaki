import { a as e, d as t, f as n } from "./relayConfigUtils-DD5f1UAM.js";
import { f as r } from "./nip46Service-DWYw1Qh-.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/@rx-nostr/crypto/dist/crypto.js
var i = Object.defineProperty, a = (e, t, n) => t in e ? i(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, o = (e, t, n) => a(e, typeof t == "symbol" ? t : t + "", n);
function s(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in e && e.BYTES_PER_ELEMENT === 1;
}
function c(e, t = "") {
	if (typeof e != "number") {
		let n = t && `"${t}" `;
		throw TypeError(`${n}expected number, got ${typeof e}`);
	}
	if (!Number.isSafeInteger(e) || e < 0) {
		let n = t && `"${t}" `;
		throw RangeError(`${n}expected integer >= 0, got ${e}`);
	}
}
function l(e, t, n = "") {
	let r = s(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`, l = o + "expected Uint8Array" + s + ", got " + c;
		throw r ? RangeError(l) : TypeError(l);
	}
	return e;
}
function u(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function d(e, t) {
	l(e, void 0, "digestInto() output");
	let n = t.outputLen;
	if (e.length < n) throw RangeError("\"digestInto() output\" expected to be of length >=" + n);
}
function f(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function p(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function m(e, t) {
	return e << 32 - t | e >>> t;
}
var h = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", g = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function _(e) {
	if (l(e), h) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += g[e[n]];
	return t;
}
var v = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function y(e) {
	if (e >= v._0 && e <= v._9) return e - v._0;
	if (e >= v.A && e <= v.F) return e - (v.A - 10);
	if (e >= v.a && e <= v.f) return e - (v.a - 10);
}
function b(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	if (h) try {
		return Uint8Array.fromHex(e);
	} catch (e) {
		throw e instanceof SyntaxError ? RangeError(e.message) : e;
	}
	let t = e.length, n = t / 2;
	if (t % 2) throw RangeError("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = y(e.charCodeAt(i)), a = y(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw RangeError("hex string expected, got non-hex character \"" + t + "\" at index " + i);
		}
		r[t] = n * 16 + a;
	}
	return r;
}
function x(...e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		l(r), t += r.length;
	}
	let n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t++) {
		let i = e[t];
		n.set(i, r), r += i.length;
	}
	return n;
}
function S(e, t = {}) {
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.canXOF = r.canXOF, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
function C(e = 32) {
	c(e, "bytesLength");
	let t = typeof globalThis == "object" ? globalThis.crypto : null;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined");
	if (e > 65536) throw RangeError(`"bytesLength" expected <= 65536, got ${e}`);
	return t.getRandomValues(new Uint8Array(e));
}
var ee = (e) => ({ oid: Uint8Array.from([
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
function w(e, t, n) {
	return e & t ^ ~e & n;
}
function T(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var E = class {
	constructor(e, t, n, r) {
		o(this, "blockLen"), o(this, "outputLen"), o(this, "canXOF", !1), o(this, "padOffset"), o(this, "isLE"), o(this, "buffer"), o(this, "view"), o(this, "finished", !1), o(this, "length", 0), o(this, "pos", 0), o(this, "destroyed", !1), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = p(this.buffer);
	}
	update(e) {
		u(this), l(e);
		let { view: t, buffer: n, blockLen: r } = this, i = e.length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o === r) {
				let t = p(e);
				for (; r <= i - a; a += r) this.process(t, a);
			} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		u(this), d(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, f(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let o = p(e), s = this.outputLen;
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
}, D = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), te = /* @__PURE__ */ Uint32Array.from([
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
]), O = /* @__PURE__ */ new Uint32Array(64), ne = class extends E {
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
		for (let n = 0; n < 16; n++, t += 4) O[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = O[e - 15], n = O[e - 2], r = m(t, 7) ^ m(t, 18) ^ t >>> 3, i = m(n, 17) ^ m(n, 19) ^ n >>> 10;
			O[e] = i + O[e - 7] + r + O[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = m(o, 6) ^ m(o, 11) ^ m(o, 25), u = l + t + w(o, s, c) + te[e] + O[e] | 0, d = (m(n, 2) ^ m(n, 13) ^ m(n, 22)) + T(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		f(O);
	}
	destroy() {
		this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), f(this.buffer);
	}
}, re = class extends ne {
	constructor() {
		super(32), o(this, "A", D[0] | 0), o(this, "B", D[1] | 0), o(this, "C", D[2] | 0), o(this, "D", D[3] | 0), o(this, "E", D[4] | 0), o(this, "F", D[5] | 0), o(this, "G", D[6] | 0), o(this, "H", D[7] | 0);
	}
}, ie = /* @__PURE__ */ S(() => new re(), /* @__PURE__ */ ee(1)), k = (e, t, n) => l(e, t, n), ae = c, oe = _, A = (...e) => x(...e), se = (e) => b(e), ce = /* @__PURE__ */ BigInt(0), le = /* @__PURE__ */ BigInt(1);
function ue(e, t = "") {
	if (typeof e != "boolean") {
		let n = t && `"${t}" `;
		throw TypeError(n + "expected boolean, got type=" + typeof e);
	}
	return e;
}
function de(e) {
	if (typeof e == "bigint") {
		if (!M(e)) throw RangeError("positive bigint expected, got " + e);
	} else ae(e);
	return e;
}
function fe(e, t = "") {
	if (typeof e != "number") {
		let n = t && `"${t}" `;
		throw TypeError(n + "expected number, got type=" + typeof e);
	}
	if (!Number.isSafeInteger(e)) {
		let n = t && `"${t}" `;
		throw RangeError(n + "expected safe integer, got " + e);
	}
}
function pe(e) {
	let t = de(e).toString(16);
	return t.length & 1 ? "0" + t : t;
}
function me(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	return e === "" ? ce : BigInt("0x" + e);
}
function j(e) {
	return me(_(e));
}
function he(e) {
	return me(_(ve(l(e)).reverse()));
}
function ge(e, t) {
	if (c(t), t === 0) throw RangeError("zero length");
	e = de(e);
	let n = e.toString(16);
	if (n.length > t * 2) throw RangeError("number too large");
	return b(n.padStart(t * 2, "0"));
}
function _e(e, t) {
	return ge(e, t).reverse();
}
function ve(e) {
	return Uint8Array.from(k(e));
}
function ye(e) {
	if (typeof e != "string") throw TypeError("ascii string expected, got " + typeof e);
	return Uint8Array.from(e, (t, n) => {
		let r = t.charCodeAt(0);
		if (t.length !== 1 || r > 127) throw RangeError(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
		return r;
	});
}
var M = (e) => typeof e == "bigint" && ce <= e;
function be(e, t, n) {
	return M(e) && M(t) && M(n) && t <= e && e < n;
}
function xe(e, t, n, r) {
	if (!be(t, n, r)) throw RangeError("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function Se(e) {
	if (e < ce) throw Error("expected non-negative bigint, got " + e);
	let t = 0;
	for (; e > ce; e >>= le, t += 1);
	return t;
}
var Ce = (e) => (le << BigInt(e)) - le;
function we(e, t = {}, n = {}) {
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
var N = /* @__PURE__ */ BigInt(0), P = /* @__PURE__ */ BigInt(1), F = /* @__PURE__ */ BigInt(2), Te = /* @__PURE__ */ BigInt(3), Ee = /* @__PURE__ */ BigInt(4), De = /* @__PURE__ */ BigInt(5), Oe = /* @__PURE__ */ BigInt(7), ke = /* @__PURE__ */ BigInt(8), Ae = /* @__PURE__ */ BigInt(9), je = /* @__PURE__ */ BigInt(16);
function I(e, t) {
	if (t <= N) throw Error("mod: expected positive modulus, got " + t);
	let n = e % t;
	return n >= N ? n : t + n;
}
function L(e, t, n) {
	if (t < N) throw Error("pow2: expected non-negative exponent, got " + t);
	let r = e;
	for (; t-- > N;) r *= r, r %= n;
	return r;
}
function Me(e, t) {
	if (e === N) throw Error("invert: expected non-zero number");
	if (t <= N) throw Error("invert: expected positive modulus, got " + t);
	let n = I(e, t), r = t, i = N, a = P;
	for (; n !== N;) {
		let e = r / n, t = r - n * e, o = i - a * e;
		r = n, n = t, i = a, a = o;
	}
	if (r !== P) throw Error("invert: does not exist");
	return I(i, t);
}
function Ne(e, t, n) {
	let r = e;
	if (!r.eql(r.sqr(t), n)) throw Error("Cannot find square root");
}
function Pe(e, t) {
	let n = e, r = (n.ORDER + P) / Ee, i = n.pow(t, r);
	return Ne(n, i, t), i;
}
function Fe(e, t) {
	let n = e, r = (n.ORDER - De) / ke, i = n.mul(t, F), a = n.pow(i, r), o = n.mul(t, a), s = n.mul(n.mul(o, F), a), c = n.mul(o, n.sub(s, n.ONE));
	return Ne(n, c, t), c;
}
function Ie(e) {
	let t = R(e), n = Le(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + Oe) / je;
	return (e, t) => {
		let n = e, s = n.pow(t, o), c = n.mul(s, r), l = n.mul(s, i), u = n.mul(s, a), d = n.eql(n.sqr(c), t), f = n.eql(n.sqr(l), t);
		s = n.cmov(s, c, d), c = n.cmov(u, l, f);
		let p = n.eql(n.sqr(c), t), m = n.cmov(s, c, p);
		return Ne(n, m, t), m;
	};
}
function Le(e) {
	if (e < Te) throw Error("sqrt is not defined for small field");
	let t = e - P, n = 0;
	for (; t % F === N;) t /= F, n++;
	let r = F, i = R(e);
	for (; Ue(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return Pe;
	let a = i.pow(r, t), o = (t + P) / F;
	return function(e, r) {
		let i = e;
		if (i.is0(r)) return r;
		if (Ue(i, r) !== 1) throw Error("Cannot find square root");
		let s = n, c = i.mul(i.ONE, a), l = i.pow(r, t), u = i.pow(r, o);
		for (; !i.eql(l, i.ONE);) {
			if (i.is0(l)) return i.ZERO;
			let e = 1, t = i.sqr(l);
			for (; !i.eql(t, i.ONE);) if (e++, t = i.sqr(t), e === s) throw Error("Cannot find square root");
			let n = P << BigInt(s - e - 1), r = i.pow(c, n);
			s = e, c = i.sqr(r), l = i.mul(l, c), u = i.mul(u, r);
		}
		return u;
	};
}
function Re(e) {
	return e % Ee === Te ? Pe : e % ke === De ? Fe : e % je === Ae ? Ie(e) : Le(e);
}
var ze = [
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
function Be(e) {
	if (we(e, ze.reduce((e, t) => (e[t] = "function", e), {
		ORDER: "bigint",
		BYTES: "number",
		BITS: "number"
	})), fe(e.BYTES, "BYTES"), fe(e.BITS, "BITS"), e.BYTES < 1 || e.BITS < 1) throw Error("invalid field: expected BYTES/BITS > 0");
	if (e.ORDER <= P) throw Error("invalid field: expected ORDER > 1, got " + e.ORDER);
	return e;
}
function Ve(e, t, n) {
	let r = e;
	if (n < N) throw Error("invalid exponent, negatives unsupported");
	if (n === N) return r.ONE;
	if (n === P) return t;
	let i = r.ONE, a = t;
	for (; n > N;) n & P && (i = r.mul(i, a)), a = r.sqr(a), n >>= P;
	return i;
}
function He(e, t, n = !1) {
	let r = e, i = Array(t.length).fill(n ? r.ZERO : void 0), a = t.reduce((e, t, n) => r.is0(t) ? e : (i[n] = e, r.mul(e, t)), r.ONE), o = r.inv(a);
	return t.reduceRight((e, t, n) => r.is0(t) ? e : (i[n] = r.mul(e, i[n]), r.mul(e, t)), o), i;
}
function Ue(e, t) {
	let n = e, r = (n.ORDER - P) / F, i = n.pow(t, r), a = n.eql(i, n.ONE), o = n.eql(i, n.ZERO), s = n.eql(i, n.neg(n.ONE));
	if (!a && !o && !s) throw Error("invalid Legendre symbol result");
	return a ? 1 : o ? 0 : -1;
}
function We(e, t) {
	if (t !== void 0 && ae(t), e <= N) throw Error("invalid n length: expected positive n, got " + e);
	if (t !== void 0 && t < 1) throw Error("invalid n length: expected positive bit length, got " + t);
	let n = Se(e);
	if (t !== void 0 && t < n) throw Error(`invalid n length: expected bit length (${n}) >= n.length (${t})`);
	let r = t === void 0 ? n : t;
	return {
		nBitLength: r,
		nByteLength: Math.ceil(r / 8)
	};
}
var Ge = /* @__PURE__ */ new WeakMap(), Ke = class {
	constructor(e, t = {}) {
		if (o(this, "ORDER"), o(this, "BITS"), o(this, "BYTES"), o(this, "isLE"), o(this, "ZERO", N), o(this, "ONE", P), o(this, "_lengths"), o(this, "_mod"), e <= P) throw Error("invalid field: expected ORDER > 1, got " + e);
		let n;
		this.isLE = !1, typeof t == "object" && t && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && Object.defineProperty(this, "sqrt", {
			value: t.sqrt,
			enumerable: !0
		}), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = Object.freeze(t.allowedLengths.slice())), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
		let { nBitLength: r, nByteLength: i } = We(e, n);
		if (i > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = e, this.BITS = r, this.BYTES = i, Object.freeze(this);
	}
	create(e) {
		return I(e, this.ORDER);
	}
	isValid(e) {
		if (typeof e != "bigint") throw TypeError("invalid field element: expected bigint, got " + typeof e);
		return N <= e && e < this.ORDER;
	}
	is0(e) {
		return e === N;
	}
	isValidNot0(e) {
		return !this.is0(e) && this.isValid(e);
	}
	isOdd(e) {
		return (e & P) === P;
	}
	neg(e) {
		return I(-e, this.ORDER);
	}
	eql(e, t) {
		return e === t;
	}
	sqr(e) {
		return I(e * e, this.ORDER);
	}
	add(e, t) {
		return I(e + t, this.ORDER);
	}
	sub(e, t) {
		return I(e - t, this.ORDER);
	}
	mul(e, t) {
		return I(e * t, this.ORDER);
	}
	pow(e, t) {
		return Ve(this, e, t);
	}
	div(e, t) {
		return I(e * Me(t, this.ORDER), this.ORDER);
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
		return Me(e, this.ORDER);
	}
	sqrt(e) {
		let t = Ge.get(this);
		return t || Ge.set(this, t = Re(this.ORDER)), t(this, e);
	}
	toBytes(e) {
		return this.isLE ? _e(e, this.BYTES) : ge(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		k(e);
		let { _lengths: n, BYTES: r, isLE: i, ORDER: a, _mod: o } = this;
		if (n) {
			if (e.length < 1 || !n.includes(e.length) || e.length > r) throw Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
			let t = new Uint8Array(r);
			t.set(e, i ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== r) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
		let s = i ? he(e) : j(e);
		if (o && (s = I(s, a)), !t && !this.isValid(s)) throw Error("invalid field element: outside of range 0..ORDER");
		return s;
	}
	invertBatch(e) {
		return He(this, e);
	}
	cmov(e, t, n) {
		return ue(n, "condition"), n ? t : e;
	}
};
Object.freeze(Ke.prototype);
function R(e, t = {}) {
	return new Ke(e, t);
}
function qe(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	if (e <= P) throw Error("field order must be greater than 1");
	let t = Se(e - P);
	return Math.ceil(t / 8);
}
function Je(e) {
	let t = qe(e);
	return t + Math.ceil(t / 2);
}
function Ye(e, t, n = !1) {
	k(e);
	let r = e.length, i = qe(t), a = Math.max(Je(t), 16);
	if (r < a || r > 1024) throw Error("expected " + a + "-1024 bytes of input, got " + r);
	let o = I(n ? he(e) : j(e), t - P) + P;
	return n ? _e(o, i) : ge(o, i);
}
var z = /* @__PURE__ */ BigInt(0), B = /* @__PURE__ */ BigInt(1);
function V(e, t) {
	let n = t.negate();
	return e ? n : t;
}
function Xe(e, t) {
	let n = He(e.Fp, t.map((e) => e.Z));
	return t.map((t, r) => e.fromAffine(t.toAffine(n[r])));
}
function Ze(e, t) {
	if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function Qe(e, t) {
	Ze(e, t);
	let n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e;
	return {
		windows: n,
		windowSize: r,
		mask: Ce(e),
		maxNumber: i,
		shiftBy: BigInt(e)
	};
}
function $e(e, t, n) {
	let { windowSize: r, mask: i, maxNumber: a, shiftBy: o } = n, s = Number(e & i), c = e >> o;
	s > r && (s -= a, c += B);
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
var et = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ new WeakMap();
function nt(e) {
	return tt.get(e) || 1;
}
function rt(e) {
	if (e !== z) throw Error("invalid wNAF");
}
var it = class {
	constructor(e, t) {
		o(this, "BASE"), o(this, "ZERO"), o(this, "Fn"), o(this, "bits"), this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = t;
	}
	_unsafeLadder(e, t, n = this.ZERO) {
		let r = e;
		for (; t > z;) t & B && (n = n.add(r)), r = r.double(), t >>= B;
		return n;
	}
	precomputeWindow(e, t) {
		let { windows: n, windowSize: r } = Qe(t, this.bits), i = [], a = e, o = a;
		for (let e = 0; e < n; e++) {
			o = a, i.push(o);
			for (let e = 1; e < r; e++) o = o.add(a), i.push(o);
			a = o.double();
		}
		return i;
	}
	wNAF(e, t, n) {
		if (!this.Fn.isValid(n)) throw Error("invalid scalar");
		let r = this.ZERO, i = this.BASE, a = Qe(e, this.bits);
		for (let e = 0; e < a.windows; e++) {
			let { nextN: o, offset: s, isZero: c, isNeg: l, isNegF: u, offsetF: d } = $e(n, e, a);
			n = o, c ? i = i.add(V(u, t[d])) : r = r.add(V(l, t[s]));
		}
		return rt(n), {
			p: r,
			f: i
		};
	}
	wNAFUnsafe(e, t, n, r = this.ZERO) {
		let i = Qe(e, this.bits);
		for (let e = 0; e < i.windows && n !== z; e++) {
			let { nextN: a, offset: o, isZero: s, isNeg: c } = $e(n, e, i);
			if (n = a, !s) {
				let e = t[o];
				r = r.add(c ? e.negate() : e);
			}
		}
		return rt(n), r;
	}
	getPrecomputes(e, t, n) {
		let r = et.get(t);
		return r || (r = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (r = n(r)), et.set(t, r))), r;
	}
	cached(e, t, n) {
		let r = nt(e);
		return this.wNAF(r, this.getPrecomputes(r, e, n), t);
	}
	unsafe(e, t, n, r) {
		let i = nt(e);
		return i === 1 ? this._unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
	}
	createCache(e, t) {
		Ze(t, this.bits), tt.set(e, t), et.delete(e);
	}
	hasCache(e) {
		return nt(e) !== 1;
	}
};
function at(e, t, n, r) {
	let i = t, a = e.ZERO, o = e.ZERO;
	for (; n > z || r > z;) n & B && (a = a.add(i)), r & B && (o = o.add(i)), i = i.double(), n >>= B, r >>= B;
	return {
		p1: a,
		p2: o
	};
}
function ot(e, t, n) {
	if (t) {
		if (t.ORDER !== e) throw Error("Field.ORDER must match order: Fp == p, Fn == n");
		return Be(t), t;
	}
	return R(e, { isLE: n });
}
function st(e, t, n = {}, r) {
	if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw Error(`expected valid ${e} CURVE object`);
	for (let e of [
		"p",
		"n",
		"h"
	]) {
		let n = t[e];
		if (!(typeof n == "bigint" && n > z)) throw Error(`CURVE.${e} must be positive bigint`);
	}
	let i = ot(t.p, n.Fp, r), a = ot(t.n, n.Fn, r);
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
function ct(e, t) {
	return function(n) {
		let r = e(n);
		return {
			secretKey: r,
			publicKey: t(r)
		};
	};
}
var lt = (e, t) => (e + (e >= 0 ? t : -t) / dt) / t;
function ut(e, t, n) {
	xe("scalar", e, U, n);
	let [[r, i], [a, o]] = t, s = lt(o * e, n), c = lt(-i * e, n), l = e - s * r - c * a, u = -s * i - c * o, d = l < U, f = u < U;
	d && (l = -l), f && (u = -u);
	let p = Ce(Math.ceil(Se(n) / 2)) + W;
	if (l < U || l >= p || u < U || u >= p) throw Error("splitScalar (endomorphism): failed for k");
	return {
		k1neg: d,
		k1: l,
		k2neg: f,
		k2: u
	};
}
var H = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = H;
			if (fe(e, "tag"), e < 0 || e > 255) throw new n("tlv.encode: wrong tag");
			if (typeof t != "string") throw TypeError("\"data\" expected string, got type=" + typeof t);
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = pe(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? pe(i.length / 2 | 128) : "";
			return pe(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = H;
			t = k(t, void 0, "DER data");
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
			let { Err: t } = H;
			if (de(e), e < U) throw new t("integer: negative integers are not allowed");
			let n = pe(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = H;
			if (e.length < 1) throw new t("invalid signature integer: empty");
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e.length > 1 && e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return j(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: n, _tlv: r } = H, i = k(e, void 0, "signature"), { v: a, l: o } = r.decode(48, i);
		if (o.length) throw new t("invalid signature: left bytes after parsing");
		let { v: s, l: c } = r.decode(2, a), { v: l, l: u } = r.decode(2, c);
		if (u.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: n.decode(s),
			s: n.decode(l)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = H, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
};
Object.freeze(H._tlv), Object.freeze(H._int), Object.freeze(H);
var U = /* @__PURE__ */ BigInt(0), W = /* @__PURE__ */ BigInt(1), dt = /* @__PURE__ */ BigInt(2), G = /* @__PURE__ */ BigInt(3), ft = /* @__PURE__ */ BigInt(4);
function pt(e, t = {}) {
	let n = st("weierstrass", e, t), r = n.Fp, i = n.Fn, a = n.CURVE, { h: s, n: c } = a;
	we(t, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object"
	});
	let { endo: l, allowInfinityPoint: u } = t;
	if (l && (!r.is0(a.a) || typeof l.beta != "bigint" || !Array.isArray(l.basises))) throw Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	let d = ht(r, i);
	function f() {
		if (!r.isOdd) throw Error("compression is not supported: Field does not have .isOdd()");
	}
	function p(e, t, n) {
		if (u && t.is0()) return Uint8Array.of(0);
		let { x: i, y: a } = t.toAffine(), o = r.toBytes(i);
		return ue(n, "isCompressed"), n ? (f(), A(mt(!r.isOdd(a)), o)) : A(Uint8Array.of(4), o, r.toBytes(a));
	}
	function m(e) {
		k(e, void 0, "Point");
		let { publicKey: t, publicKeyUncompressed: n } = d, i = e.length, a = e[0], o = e.subarray(1);
		if (u && i === 1 && a === 0) return {
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
			f();
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
	let y = r.mul(r.pow(a.a, G), ft), b = r.mul(r.sqr(a.b), BigInt(27));
	if (r.is0(r.add(y, b))) throw Error("bad curve params: a or b");
	function x(e, t, n = !1) {
		if (!r.isValid(t) || n && r.is0(t)) throw Error(`bad point coordinate ${e}`);
		return t;
	}
	function S(e) {
		if (!(e instanceof T)) throw Error("Weierstrass Point expected");
	}
	function C(e) {
		if (!l || !l.basises) throw Error("no endo");
		return ut(e, l.basises, i.ORDER);
	}
	function ee(e, t, n, i, a) {
		return n = new T(r.mul(n.X, e), n.Y, n.Z), t = V(i, t), n = V(a, n), t.add(n);
	}
	let w = class e {
		constructor(e, t, n) {
			o(this, "X"), o(this, "Y"), o(this, "Z"), this.X = x("x", e), this.Y = x("y", t, !0), this.Z = x("z", n), Object.freeze(this);
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
			let n = e.fromAffine(g(k(t, void 0, "point")));
			return n.assertValidity(), n;
		}
		static fromHex(t) {
			return e.fromBytes(se(t));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(e = 8, t = !0) {
			return D.createCache(this, e), t || this.multiply(G), this;
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
			let { a: t, b: n } = a, i = r.mul(n, G), { X: o, Y: s, Z: c } = this, l = r.ZERO, u = r.ZERO, d = r.ZERO, f = r.mul(o, o), p = r.mul(s, s), m = r.mul(c, c), h = r.mul(o, s);
			return h = r.add(h, h), d = r.mul(o, c), d = r.add(d, d), l = r.mul(t, d), u = r.mul(i, m), u = r.add(l, u), l = r.sub(p, u), u = r.add(p, u), u = r.mul(l, u), l = r.mul(h, l), d = r.mul(i, d), m = r.mul(t, m), h = r.sub(f, m), h = r.mul(t, h), h = r.add(h, d), d = r.add(f, f), f = r.add(d, f), f = r.add(f, m), f = r.mul(f, h), u = r.add(u, f), m = r.mul(s, c), m = r.add(m, m), f = r.mul(m, h), l = r.sub(l, f), d = r.mul(m, p), d = r.add(d, d), d = r.add(d, d), new e(l, u, d);
		}
		add(t) {
			S(t);
			let { X: n, Y: i, Z: o } = this, { X: s, Y: c, Z: l } = t, u = r.ZERO, d = r.ZERO, f = r.ZERO, p = a.a, m = r.mul(a.b, G), h = r.mul(n, s), g = r.mul(i, c), _ = r.mul(o, l), v = r.add(n, i), y = r.add(s, c);
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
			let a, o, s = (t) => D.cached(this, t, (t) => Xe(e, t));
			if (r) {
				let { k1neg: e, k1: t, k2neg: i, k2: c } = C(n), { p: l, f: u } = s(t), { p: d, f } = s(c);
				o = u.add(f), a = ee(r.beta, l, d, e, i);
			} else {
				let { p: e, f: t } = s(n);
				a = e, o = t;
			}
			return Xe(e, [a, o])[0];
		}
		multiplyUnsafe(n) {
			let { endo: r } = t, a = this, o = n;
			if (!i.isValid(o)) throw RangeError("invalid scalar: out of range");
			if (o === U || a.is0()) return e.ZERO;
			if (o === W) return a;
			if (D.hasCache(this)) return this.multiply(o);
			if (r) {
				let { k1neg: t, k1: n, k2neg: i, k2: s } = C(o), { p1: c, p2: l } = at(e, a, n, s);
				return ee(r.beta, c, l, t, i);
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
			return s === W ? !0 : n ? n(e, this) : D.unsafe(this, c).is0();
		}
		clearCofactor() {
			let { clearCofactor: n } = t;
			return s === W ? this : n ? n(e, this) : this.multiplyUnsafe(s);
		}
		isSmallOrder() {
			return s === W ? this.is0() : this.clearCofactor().is0();
		}
		toBytes(t = !0) {
			return ue(t, "isCompressed"), this.assertValidity(), h(e, this, t);
		}
		toHex(e = !0) {
			return oe(this.toBytes(e));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	};
	o(w, "BASE", new w(a.Gx, a.Gy, r.ONE)), o(w, "ZERO", new w(r.ZERO, r.ONE, r.ZERO)), o(w, "Fp", r), o(w, "Fn", i);
	let T = w, E = i.BITS, D = new it(T, t.endo ? Math.ceil(E / 2) : E);
	return E >= 8 && T.BASE.precompute(8), Object.freeze(T.prototype), Object.freeze(T), T;
}
function mt(e) {
	return Uint8Array.of(e ? 2 : 3);
}
function ht(e, t) {
	return {
		secretKey: t.BYTES,
		publicKey: 1 + e.BYTES,
		publicKeyUncompressed: 1 + 2 * e.BYTES,
		publicKeyHasPrefix: !0,
		signature: 2 * t.BYTES
	};
}
var K = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, gt = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
}, _t = /* @__PURE__ */ BigInt(0), vt = /* @__PURE__ */ BigInt(2);
function yt(e) {
	let t = K.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = L(L(L(u, n, t) * u % t, n, t) * u % t, vt, t) * l % t, f = L(d, i, t) * d % t, p = L(f, a, t) * f % t, m = L(p, s, t) * p % t, h = L(L(L(L(L(L(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, vt, t);
	if (!q.eql(q.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var q = R(K.p, { sqrt: yt }), J = /* @__PURE__ */ pt(K, {
	Fp: q,
	endo: gt
}), bt = {};
function xt(e, ...t) {
	let n = bt[e];
	if (n === void 0) {
		let t = ie(ye(e));
		n = A(t, t), bt[e] = n;
	}
	return ie(A(n, ...t));
}
var St = (e) => e.toBytes(!0).slice(1), Ct = (e) => e % vt === _t;
function wt(e) {
	let { Fn: t, BASE: n } = J, r = t.fromBytes(e), i = n.multiply(r);
	return {
		scalar: Ct(i.y) ? r : t.neg(r),
		bytes: St(i)
	};
}
function Tt(e) {
	let t = q;
	if (!t.isValidNot0(e)) throw Error("invalid x: Fail if x ≥ p");
	let n = t.create(e * e), r = t.create(n * e + BigInt(7)), i = t.sqrt(r);
	Ct(i) || (i = t.neg(i));
	let a = J.fromAffine({
		x: e,
		y: i
	});
	return a.assertValidity(), a;
}
var Y = j;
function Et(...e) {
	return J.Fn.create(Y(xt("BIP0340/challenge", ...e)));
}
function Dt(e) {
	return wt(e).bytes;
}
function Ot(e, t, n = C(32)) {
	let { Fn: r, BASE: i } = J, a = k(e, void 0, "message"), { bytes: o, scalar: s } = wt(t), c = k(n, 32, "auxRand"), l = xt("BIP0340/nonce", r.toBytes(s ^ Y(xt("BIP0340/aux", c))), o, a), u = r.create(Y(l));
	if (u === 0n) throw Error("sign failed: k is zero");
	let d = i.multiply(u), f = Ct(d.y) ? u : r.neg(u), p = St(d), m = Et(p, o, a), h = /* @__PURE__ */ new Uint8Array(64);
	if (h.set(p, 0), h.set(r.toBytes(r.create(f + m * s)), 32), !kt(h, a, o)) throw Error("sign: Invalid signature produced");
	return h;
}
function kt(e, t, n) {
	let { Fp: r, Fn: i, BASE: a } = J, o = k(e, 64, "signature"), s = k(t, void 0, "message"), c = k(n, 32, "publicKey");
	try {
		let e = Tt(Y(c)), t = Y(o.subarray(0, 32));
		if (!r.isValidNot0(t)) return !1;
		let n = Y(o.subarray(32, 64));
		if (!i.isValidNot0(n)) return !1;
		let l = Et(i.toBytes(t), St(e), s), u = a.multiplyUnsafe(n).add(e.multiplyUnsafe(i.neg(l))), { x: d, y: f } = u.toAffine();
		return !(u.is0() || !Ct(f) || d !== t);
	} catch {
		return !1;
	}
}
var At = /* @__PURE__ */ (() => {
	let e = (e) => (e = e === void 0 ? C(48) : e, Ye(e, K.n));
	return Object.freeze({
		keygen: ct(e, Dt),
		getPublicKey: Dt,
		sign: Ot,
		verify: kt,
		Point: J,
		utils: Object.freeze({
			randomSecretKey: e,
			taggedHash: xt,
			lift_x: Tt,
			pointToBytes: St
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
function jt(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Mt(e, t) {
	return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((e) => typeof e == "string") : t.every((e) => Number.isSafeInteger(e)) : !1;
}
function Nt(e) {
	if (typeof e != "function") throw Error("function expected");
	return !0;
}
function X(e, t) {
	if (typeof t != "string") throw Error(`${e}: string expected`);
	return !0;
}
function Pt(e) {
	if (!Number.isSafeInteger(e)) throw Error(`invalid integer: ${e}`);
}
function Ft(e) {
	if (!Array.isArray(e)) throw Error("array expected");
}
function It(e, t) {
	if (!Mt(!0, t)) throw Error(`${e}: array of strings expected`);
}
function Lt(e, t) {
	if (!Mt(!1, t)) throw Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Rt(...e) {
	let t = (e) => e, n = (e, t) => (n) => e(t(n));
	return {
		encode: e.map((e) => e.encode).reduceRight(n, t),
		decode: e.map((e) => e.decode).reduce(n, t)
	};
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	let t = typeof e == "string" ? e.split("") : e, n = t.length;
	It("alphabet", t);
	let r = new Map(t.map((e, t) => [e, t]));
	return {
		encode: (r) => (Ft(r), r.map((r) => {
			if (!Number.isSafeInteger(r) || r < 0 || r >= n) throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);
			return t[r];
		})),
		decode: (t) => (Ft(t), t.map((t) => {
			X("alphabet.decode", t);
			let n = r.get(t);
			if (n === void 0) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
			return n;
		}))
	};
}
// @__NO_SIDE_EFFECTS__
function Bt(e = "") {
	return X("join", e), {
		encode: (t) => (It("join.decode", t), t.join(e)),
		decode: (t) => (X("join.decode", t), t.split(e))
	};
}
var Vt = (e, t) => t === 0 ? e : Vt(t, e % t), Ht = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - Vt(e, t)), Ut = /* @__PURE__ */ (() => {
	let e = [];
	for (let t = 0; t < 40; t++) e.push(2 ** t);
	return e;
})();
function Wt(e, t, n, r) {
	if (Ft(e), t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (/* @__PURE__ */ Ht(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ Ht(t, n)}`);
	let i = 0, a = 0, o = Ut[t], s = Ut[n] - 1, c = [];
	for (let r of e) {
		if (Pt(r), r >= o) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
		if (i = i << t | r, a + t > 32) throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);
		for (a += t; a >= n; a -= n) c.push((i >> a - n & s) >>> 0);
		let e = Ut[a];
		if (e === void 0) throw Error("invalid carry");
		i &= e - 1;
	}
	if (i = i << n - a & s, !r && a >= t) throw Error("Excess padding");
	if (!r && i > 0) throw Error(`Non-zero padding: ${i}`);
	return r && a > 0 && c.push(i >>> 0), c;
}
// @__NO_SIDE_EFFECTS__
function Gt(e, t = !1) {
	if (Pt(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ Ht(8, e) > 32 || /* @__PURE__ */ Ht(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!jt(n)) throw Error("radix2.encode input should be Uint8Array");
			return Wt(Array.from(n), 8, e, !t);
		},
		decode: (n) => (Lt("radix2.decode", n), Uint8Array.from(Wt(n, e, 8, t)))
	};
}
function Kt(e) {
	return Nt(e), function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
var qt = /* @__PURE__ */ Rt(/* @__PURE__ */ zt("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ Bt("")), Jt = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function Z(e) {
	let t = e >> 25, n = (e & 33554431) << 5;
	for (let e = 0; e < Jt.length; e++) (t >> e & 1) == 1 && (n ^= Jt[e]);
	return n;
}
function Yt(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = Z(i) ^ n >> 5;
	}
	i = Z(i);
	for (let t = 0; t < r; t++) i = Z(i) ^ e.charCodeAt(t) & 31;
	for (let e of t) i = Z(i) ^ e;
	for (let e = 0; e < 6; e++) i = Z(i);
	return i ^= n, qt.encode(Wt([i % Ut[30]], 30, 5, !1));
}
// @__NO_SIDE_EFFECTS__
function Xt(e) {
	let t = e === "bech32" ? 1 : 734539939, n = /* @__PURE__ */ Gt(5), r = n.decode, i = n.encode, a = Kt(r);
	function o(e, n, r = 90) {
		X("bech32.encode prefix", e), jt(n) && (n = Array.from(n)), Lt("bech32.encode", n);
		let i = e.length;
		if (i === 0) throw TypeError(`Invalid prefix length ${i}`);
		let a = i + 7 + n.length;
		if (r !== !1 && a > r) throw TypeError(`Length ${a} exceeds limit ${r}`);
		let o = e.toLowerCase(), s = Yt(o, n, t);
		return `${o}1${qt.encode(n)}${s}`;
	}
	function s(e, n = 90) {
		X("bech32.decode input", e);
		let r = e.length;
		if (r < 8 || n !== !1 && r > n) throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);
		let i = e.toLowerCase();
		if (e !== i && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
		let a = i.lastIndexOf("1");
		if (a === 0 || a === -1) throw Error("Letter \"1\" must be present between prefix and data only");
		let o = i.slice(0, a), s = i.slice(a + 1);
		if (s.length < 6) throw Error("Data must be at least 6 characters long");
		let c = qt.decode(s).slice(0, -6), l = Yt(o, c, t);
		if (!s.endsWith(l)) throw Error(`Invalid checksum in ${e}: expected "${l}"`);
		return {
			prefix: o,
			words: c
		};
	}
	let c = Kt(s);
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
var Zt = /* @__PURE__ */ Xt("bech32"), Qt = new TextEncoder();
function $t(e) {
	return _(ie(Qt.encode(e)));
}
var en = {
	sign: (e, t) => _(At.sign(b(e), b(t))),
	verify: (e, t, n) => At.verify(b(e), b(t), b(n)),
	getPublicKey: (e) => _(At.getPublicKey(b(e)))
};
function tn(e) {
	return en.getPublicKey(e);
}
function nn(e) {
	return $t(JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]));
}
function rn(e, t) {
	return en.sign(e, t);
}
function an(e) {
	try {
		return en.verify(e.sig, nn(e), e.pubkey);
	} catch (e) {
		return console.warn("The following error occurred during verify():", e), !1;
	}
}
function on(e) {
	let { words: t } = Zt.decode(e);
	return _(new Uint8Array(Zt.fromWords(t)));
}
function sn(e, t) {
	let n = e.startsWith("nsec1") ? on(e) : e, r = tn(n);
	return {
		async signEvent(e) {
			let i = {
				...e,
				pubkey: e.pubkey ?? r,
				tags: [...e.tags ?? [], ...t?.tags ?? []],
				created_at: e.created_at ?? Math.floor(Date.now() / 1e3)
			};
			if (cn(i)) return i;
			let a = i.id ?? nn(i), o = i.sig ?? rn(a, n);
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
function cn(e) {
	if (typeof e.id != "string" || typeof e.sig != "string" || typeof e.kind != "number" || typeof e.pubkey != "string" || typeof e.content != "string" || typeof e.created_at != "number" || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] == "object") return !1;
	}
	return !0;
}
var ln = async (e) => an(e), un = class {
	constructor(e) {
		o(this, "timer"), o(this, "fireNext", []), o(this, "takeNext", []), this.timer = setInterval(() => {
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
}, dn = ({ worker: e, fallback: t, tags: n, timeout: r }) => {
	let i = "prepared", a = 1, o = /* @__PURE__ */ new Map(), s = new un(r ?? 1e4), c = t ?? ln, l = (t) => {
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
}, fn = "ehagaki.embed";
function pn(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.namespace === "ehagaki.embed" && t.version === 1 && typeof t.type == "string";
}
var mn = /* @__PURE__ */ new Set([
	"auth.request",
	"auth.error",
	"auth.result",
	"settings.set",
	"settings.applied",
	"settings.error",
	"relays.request",
	"relays.set",
	"relays.applied",
	"relays.error",
	"storage.get",
	"storage.set",
	"storage.remove",
	"storage.result",
	"storage.error",
	"idb.getSnapshot",
	"idb.setSnapshot",
	"idb.result",
	"idb.error",
	"composer.setContext",
	"composer.contextApplied",
	"composer.contextError",
	"rpc.request",
	"rpc.result",
	"rpc.error"
]);
function hn(e) {
	return mn.has(e);
}
function gn(e) {
	return typeof e == "string" && e.trim().length > 0;
}
function _n(e) {
	if (!e) return null;
	let t = new URLSearchParams(e).get("parentOrigin");
	if (!t) return null;
	try {
		return new URL(t).origin;
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/parentClientAuthService.ts
var vn = 1e4, yn = /^[0-9a-f]{64}$/i, bn = /* @__PURE__ */ new Set([
	"signEvent",
	"nip44.encrypt",
	"nip44.decrypt"
]), xn = ["signEvent"];
function Sn(e) {
	return bn.has(e);
}
function Q(e) {
	let t = e?.length ? e : xn;
	return [...new Set(t)].filter(Sn);
}
function Cn(e) {
	return typeof e == "string" && yn.test(e);
}
function wn(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "string");
}
function Tn(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "string" && bn.has(e));
}
function $(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function En(e) {
	if (typeof e != "string" || !e) return !1;
	try {
		return new URL(e).origin === e;
	} catch {
		return !1;
	}
}
function Dn(e) {
	if (!$(e)) return null;
	let t = wn(e.capabilities) ? Q(e.capabilities) : [];
	return e.version !== 1 || !Cn(e.pubkeyHex) || !En(e.parentOrigin) || typeof e.connectedAt != "number" || t.length === 0 || !t.includes("signEvent") ? null : {
		version: 1,
		pubkeyHex: e.pubkeyHex,
		parentOrigin: e.parentOrigin,
		capabilities: t,
		connectedAt: e.connectedAt
	};
}
function On(e) {
	if (e !== void 0 && $(e)) return e.pubkeyHex == null ? null : Cn(e.pubkeyHex) ? e.pubkeyHex : void 0;
}
function kn(e, t) {
	if (!$(e) || !Cn(e.pubkeyHex)) return null;
	let n = e.capabilities;
	if (n !== void 0 && !Tn(n)) return null;
	let r = Q(n);
	return t?.length && r.some((e) => !t.includes(e)) ? null : {
		pubkeyHex: e.pubkeyHex,
		...e.capabilities === void 0 ? {} : { capabilities: r }
	};
}
function An(e, t) {
	if (!$(t) || !("result" in t)) return;
	let n = t.result;
	if (e === "signEvent") return $(n) && typeof n.id == "string" && typeof n.sig == "string" ? n : void 0;
	if (e === "nip44.encrypt" || e === "nip44.decrypt") return typeof n == "string" ? n : void 0;
}
function jn(e) {
	return pn(e);
}
var Mn = class {
	service;
	constructor(e) {
		this.service = e;
	}
	async signEvent(e) {
		return this.service.signEvent({
			kind: e.kind,
			content: e.content,
			tags: e.tags ?? [],
			created_at: e.created_at ?? Math.floor(Date.now() / 1e3),
			...e.pubkey ? { pubkey: e.pubkey } : {}
		});
	}
	async getPublicKey() {
		return this.service.getPublicKey();
	}
}, Nn = class {
	windowObj;
	console;
	trustedParentOrigin = null;
	activeSession = null;
	signerAdapter = null;
	pendingRequests = /* @__PURE__ */ new Map();
	remoteLoginListeners = /* @__PURE__ */ new Set();
	remoteLogoutListeners = /* @__PURE__ */ new Set();
	isListening = !1;
	constructor(e = typeof window < "u" ? window : {}, t = typeof window < "u" ? window.console : {}) {
		this.windowObj = e, this.console = t;
	}
	static loadSession(e, t) {
		try {
			let n = e.getItem(r(t));
			return n ? Dn(JSON.parse(n)) : null;
		} catch {
			return null;
		}
	}
	static saveSession(e, t) {
		e.setItem(r(t.pubkeyHex), JSON.stringify(t));
	}
	static clearSession(e, t) {
		e.removeItem(r(t));
	}
	initialize(e = {}) {
		if (!this.isInIframe()) return !1;
		let t = e.parentOrigin ?? this.resolveParentOrigin(e.locationSearch);
		return t ? (this.trustedParentOrigin = t, this.ensureMessageListener(), !0) : !1;
	}
	isAvailable(e = {}) {
		return this.isInIframe() ? !!(e.parentOrigin ?? this.resolveParentOrigin(e.locationSearch)) : !1;
	}
	announceReady(e = xn) {
		return this.initialize() ? this.postEnvelope("ready", { capabilities: Q(e) }) : !1;
	}
	async connect(e = {}) {
		let t = Q(e.capabilities), n = e.parentOrigin ?? this.resolveParentOrigin(e.locationSearch);
		if (!this.initialize({
			parentOrigin: n ?? void 0,
			locationSearch: e.locationSearch
		})) throw Error("parent_client_not_available");
		this.announceReady(t);
		let r = await this.requestAuth({
			capabilities: t,
			silent: e.silent
		}, e.timeoutMs), i = {
			version: 1,
			parentOrigin: this.trustedParentOrigin,
			pubkeyHex: r.pubkeyHex,
			capabilities: Q(r.capabilities ?? t),
			connectedAt: Date.now()
		};
		return this.activateSession(i), r.pubkeyHex;
	}
	async reconnect(e, t = {}) {
		return this.connect({
			...t,
			parentOrigin: e.parentOrigin,
			capabilities: e.capabilities,
			silent: !0
		});
	}
	async getPublicKey() {
		if (!this.activeSession?.pubkeyHex) throw Error("parent_client_not_authenticated");
		return this.activeSession.pubkeyHex;
	}
	async signEvent(e) {
		return this.assertCapability("signEvent"), this.requestRpc("signEvent", { event: e });
	}
	async nip44Encrypt(e, t) {
		return this.assertCapability("nip44.encrypt"), this.requestRpc("nip44.encrypt", {
			pubkey: e,
			plaintext: t
		});
	}
	async nip44Decrypt(e, t) {
		return this.assertCapability("nip44.decrypt"), this.requestRpc("nip44.decrypt", {
			pubkey: e,
			ciphertext: t
		});
	}
	getSigner() {
		return this.signerAdapter;
	}
	getSessionData() {
		return this.activeSession ? { ...this.activeSession } : null;
	}
	getUserPubkey() {
		return this.activeSession?.pubkeyHex ?? null;
	}
	getTrustedParentOrigin() {
		return this.trustedParentOrigin;
	}
	isConnected() {
		return this.activeSession !== null;
	}
	onRemoteLogin(e) {
		return this.remoteLoginListeners.add(e), () => {
			this.remoteLoginListeners.delete(e);
		};
	}
	onRemoteLogout(e) {
		return this.remoteLogoutListeners.add(e), () => {
			this.remoteLogoutListeners.delete(e);
		};
	}
	disconnect(e = !1) {
		e && this.activeSession && this.postEnvelope("auth.logout", { pubkeyHex: this.activeSession.pubkeyHex }), this.activeSession = null, this.signerAdapter = null, this.rejectPendingRequests("parent_client_disconnected");
	}
	activateSession(e) {
		this.activeSession = e, this.trustedParentOrigin = e.parentOrigin, this.signerAdapter = new Mn(this);
	}
	requestAuth(e, t = vn) {
		return this.enqueueRequest("auth.request", e, t);
	}
	requestRpc(e, t, n = vn) {
		return this.enqueueRequest("rpc.request", {
			method: e,
			params: t
		}, n);
	}
	enqueueRequest(e, t, n) {
		if (!this.trustedParentOrigin) return Promise.reject(/* @__PURE__ */ Error("parent_client_not_available"));
		let r = this.createRequestId();
		return new Promise((i, a) => {
			let o = globalThis.setTimeout(() => {
				this.pendingRequests.delete(r), a(/* @__PURE__ */ Error("parent_client_timeout"));
			}, n);
			this.pendingRequests.set(r, {
				kind: e === "auth.request" ? "auth" : "rpc",
				...e === "auth.request" ? { requestedCapabilities: t.capabilities } : { rpcMethod: t.method },
				resolve: (e) => i(e),
				reject: a,
				timeoutId: o
			}), this.postEnvelope(e, t, r) || (globalThis.clearTimeout(o), this.pendingRequests.delete(r), a(/* @__PURE__ */ Error("parent_client_not_available")));
		});
	}
	handleMessage = (e) => {
		if (!this.windowObj || !jn(e.data) || e.source !== this.windowObj.parent || this.trustedParentOrigin && e.origin !== this.trustedParentOrigin) return;
		let t = e.data, n = t.requestId;
		if (t.type === "auth.login") {
			let e = On(t.payload);
			if (e === void 0) return;
			this.notifyRemoteLogin(e);
			return;
		}
		if (t.type === "auth.logout") {
			let e = On(t.payload);
			if (t.payload !== void 0 && e === void 0) return;
			let n = e ?? this.activeSession?.pubkeyHex ?? null;
			this.disconnect(!1), this.notifyRemoteLogout(n);
			return;
		}
		if (hn(t.type) && !gn(n)) {
			this.console.warn("requestId がない親クライアント応答を無視:", t);
			return;
		}
		if (!n) return;
		let r = this.pendingRequests.get(n);
		if (!r) return;
		let i = t.type === "auth.result" || t.type === "auth.error" ? "auth" : t.type === "rpc.result" || t.type === "rpc.error" ? "rpc" : null;
		if (i && i !== r.kind) globalThis.clearTimeout(r.timeoutId), this.pendingRequests.delete(n), r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
		else if (globalThis.clearTimeout(r.timeoutId), this.pendingRequests.delete(n), t.type === "auth.result") {
			let e = kn(t.payload, r.requestedCapabilities);
			if (!e) {
				r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
				return;
			}
			r.resolve(e);
		} else if (t.type === "auth.error") {
			let e = t.payload;
			r.reject(Error(typeof e?.code == "string" && e.code || typeof e?.message == "string" && e.message || "parent_client_auth_error"));
		} else if (t.type === "rpc.result") {
			let e = An(r.rpcMethod, t.payload);
			if (e === void 0) {
				r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
				return;
			}
			r.resolve(e);
		} else if (t.type === "rpc.error") {
			let e = t.payload;
			r.reject(Error(typeof e?.message == "string" && e.message || typeof e?.code == "string" && e.code || "parent_client_rpc_error"));
		} else r.reject(/* @__PURE__ */ Error("parent_client_invalid_response"));
	};
	postEnvelope(e, t, n) {
		if (!this.windowObj?.parent || !this.trustedParentOrigin || !this.isInIframe()) return !1;
		let r = {
			namespace: fn,
			version: 1,
			type: e,
			...n ? { requestId: n } : {},
			...t === void 0 ? {} : { payload: t }
		};
		try {
			return this.windowObj.parent.postMessage(r, this.trustedParentOrigin), !0;
		} catch (e) {
			return this.console.error("親クライアントへのpostMessage送信に失敗:", e), !1;
		}
	}
	ensureMessageListener() {
		this.isListening ||= (this.windowObj?.addEventListener?.("message", this.handleMessage), !0);
	}
	resolveParentOrigin(e) {
		return this.getParentOriginFromSearch(e);
	}
	getParentOriginFromSearch(e) {
		return _n(e ?? this.windowObj?.location?.search);
	}
	createRequestId() {
		return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `pc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}
	rejectPendingRequests(e) {
		for (let t of this.pendingRequests.values()) globalThis.clearTimeout(t.timeoutId), t.reject(Error(e));
		this.pendingRequests.clear();
	}
	isInIframe() {
		if (!this.windowObj) return !1;
		try {
			return this.windowObj.self !== this.windowObj.top;
		} catch {
			return !0;
		}
	}
	assertCapability(e) {
		if (!this.activeSession) throw Error("parent_client_not_authenticated");
		if (!this.activeSession.capabilities.includes(e)) throw Error("parent_client_capability_not_available");
	}
	notifyRemoteLogout(e) {
		for (let t of this.remoteLogoutListeners) t(e);
	}
	notifyRemoteLogin(e) {
		for (let t of this.remoteLoginListeners) t(e);
	}
}, Pn = new Nn();
// D:/ドキュメント/GitHub/ehagaki/src/lib/postMediaCacheUtils.ts
function Fn(e) {
	let t = String(e ?? "").trim();
	if (!t) return "";
	try {
		let e = new URL(t);
		return e.protocol !== "http:" && e.protocol !== "https:" ? "" : (e.hash = "", e.toString());
	} catch {
		return "";
	}
}
function In(e) {
	let t = String(e ?? "").trim();
	if (!t) return "";
	try {
		let e = new URL(t);
		return e.hash = "", e.toString();
	} catch {
		return t.replace(/#.*$/, "");
	}
}
function Ln(e) {
	let t = e.mimeType?.toLowerCase();
	if (t?.startsWith("image/")) return "image";
	if (t?.startsWith("video/")) return "video";
	if (t?.startsWith("audio/")) return "audio";
	let n = (() => {
		try {
			return new URL(e.url).pathname.toLowerCase();
		} catch {
			return e.url.toLowerCase();
		}
	})();
	return /\.(jpe?g|png|webp|gif|bmp|svg|avif)(?:$|[?#])/i.test(n) ? "image" : /\.(mp4|webm|mov|m4v|ogv)(?:$|[?#])/i.test(n) ? "video" : /\.(mp3|m4a|aac|ogg|oga|wav|flac)(?:$|[?#])/i.test(n) ? "audio" : "unknown";
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sessionLiveness.ts
var Rn = class extends Error {
	constructor() {
		super("Authentication required"), this.name = "Error";
	}
};
function zn(e, t) {
	let n = e.value;
	if (!n.isAuthenticated || n.pubkey !== t) throw new Rn();
}
function Bn(e) {
	let t = e.value.pubkey;
	if (!t) throw new Rn();
	return zn(e, t), t;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/signedEventResultValidator.ts
function Vn(e) {
	if (!Array.isArray(e)) throw Error("Invalid signed event result");
	return e.map((e) => {
		if (!Array.isArray(e) || !e.every((e) => typeof e == "string")) throw Error("Invalid signed event result");
		return [...e];
	});
}
function Hn(e, t) {
	return e.length === t.length && e.every((e, n) => e.length === t[n]?.length && e.every((e, r) => e === t[n][r]));
}
function Un(e) {
	if (!e || typeof e != "object") throw Error("Invalid signed event result");
	let t = e;
	if (typeof t.kind != "number" || typeof t.content != "string" || typeof t.created_at != "number") throw Error("Invalid signed event result");
	return {
		kind: t.kind,
		content: t.content,
		created_at: t.created_at,
		tags: Vn(t.tags)
	};
}
function Wn(e) {
	let t = Un(e);
	return {
		...e,
		...t
	};
}
function Gn(e) {
	return {
		expectedTemplate: Un(e),
		signerTemplate: Wn(e)
	};
}
function Kn(r, i, a) {
	if (!r || typeof r != "object" || !i || typeof i != "object" || typeof a != "string" || !a) throw Error("Invalid signed event result");
	let o = Un(r), s = i, c = Vn(s.tags), l = {
		id: s.id,
		pubkey: s.pubkey,
		created_at: s.created_at,
		kind: s.kind,
		tags: c,
		content: s.content,
		sig: s.sig
	};
	try {
		if (!t(l) || l.id !== e(l) || !n(l) || l.pubkey !== a || l.kind !== o.kind || l.content !== o.content || l.created_at !== o.created_at || !Hn(c, o.tags)) throw Error("Invalid signed event result");
	} catch {
		throw Error("Invalid signed event result");
	}
	return l;
}
export { nn as _, Bn as a, Fn as c, fn as d, hn as f, dn as g, gn as h, zn as i, Nn as l, pn as m, Kn as n, Ln as o, _n as p, Rn as r, In as s, Gn as t, Pn as u, sn as v, ln as y };
