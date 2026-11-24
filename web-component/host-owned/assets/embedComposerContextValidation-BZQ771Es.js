import { i as e, t } from "./rolldown-runtime-CwxnZyOB.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/typeGuards.ts
function n(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/nostrHexUtils.ts
var r = /^[0-9a-f]{64}$/i, i = /^[0-9a-f]{64}$/;
function a(e) {
	return typeof e == "string" && r.test(e);
}
function o(e) {
	return typeof e == "string" && i.test(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/utils.js
function s(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function c(e, t = "") {
	if (!Number.isSafeInteger(e) || e < 0) {
		let n = t && `"${t}" `;
		throw Error(`${n}expected integer >= 0, got ${e}`);
	}
}
function l(e, t, n = "") {
	let r = s(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function u(e) {
	if (typeof e != "function" || typeof e.create != "function") throw Error("Hash must wrapped by utils.createHasher");
	c(e.outputLen), c(e.blockLen);
}
function d(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function f(e, t) {
	l(e, void 0, "digestInto() output");
	let n = t.outputLen;
	if (e.length < n) throw Error("\"digestInto() output\" expected to be of length >=" + n);
}
function p(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function m(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function h(e, t) {
	return e << 32 - t | e >>> t;
}
var g = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function v(e) {
	if (l(e), g) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += _[e[n]];
	return t;
}
var y = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function ee(e) {
	if (e >= y._0 && e <= y._9) return e - y._0;
	if (e >= y.A && e <= y.F) return e - (y.A - 10);
	if (e >= y.a && e <= y.f) return e - (y.a - 10);
}
function b(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	if (g) return Uint8Array.fromHex(e);
	let t = e.length, n = t / 2;
	if (t % 2) throw Error("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = ee(e.charCodeAt(i)), a = ee(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw Error("hex string expected, got non-hex character \"" + t + "\" at index " + i);
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
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
function C(e = 32) {
	let t = typeof globalThis == "object" ? globalThis.crypto : null;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined");
	return t.getRandomValues(new Uint8Array(e));
}
var w = (e) => ({ oid: Uint8Array.from([
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
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/_md.js
function T(e, t, n) {
	return e & t ^ ~e & n;
}
function E(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var D = class {
	blockLen;
	outputLen;
	padOffset;
	isLE;
	buffer;
	view;
	finished = !1;
	length = 0;
	pos = 0;
	destroyed = !1;
	constructor(e, t, n, r) {
		this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = m(this.buffer);
	}
	update(e) {
		d(this), l(e);
		let { view: t, buffer: n, blockLen: r } = this, i = e.length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o === r) {
				let t = m(e);
				for (; r <= i - a; a += r) this.process(t, a);
			} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		d(this), f(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, p(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let o = m(e), s = this.outputLen;
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
]), k = /* @__PURE__ */ Uint32Array.from([
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
]), A = /* @__PURE__ */ new Uint32Array(64), j = class extends D {
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
		for (let n = 0; n < 16; n++, t += 4) A[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = A[e - 15], n = A[e - 2], r = h(t, 7) ^ h(t, 18) ^ t >>> 3, i = h(n, 17) ^ h(n, 19) ^ n >>> 10;
			A[e] = i + A[e - 7] + r + A[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = h(o, 6) ^ h(o, 11) ^ h(o, 25), u = l + t + T(o, s, c) + k[e] + A[e] | 0, d = (h(n, 2) ^ h(n, 13) ^ h(n, 22)) + E(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		p(A);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), p(this.buffer);
	}
}, M = class extends j {
	A = O[0] | 0;
	B = O[1] | 0;
	C = O[2] | 0;
	D = O[3] | 0;
	E = O[4] | 0;
	F = O[5] | 0;
	G = O[6] | 0;
	H = O[7] | 0;
	constructor() {
		super(32);
	}
}, N = /* @__PURE__ */ S(() => new M(), /* @__PURE__ */ w(1)), P = /* @__PURE__ */ BigInt(0), F = /* @__PURE__ */ BigInt(1);
function I(e, t = "") {
	if (typeof e != "boolean") {
		let n = t && `"${t}" `;
		throw Error(n + "expected boolean, got type=" + typeof e);
	}
	return e;
}
function L(e) {
	if (typeof e == "bigint") {
		if (!ce(e)) throw Error("positive bigint expected, got " + e);
	} else c(e);
	return e;
}
function te(e) {
	let t = L(e).toString(16);
	return t.length & 1 ? "0" + t : t;
}
function ne(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	return e === "" ? P : BigInt("0x" + e);
}
function R(e) {
	return ne(v(e));
}
function re(e) {
	return ne(v(oe(l(e)).reverse()));
}
function ie(e, t) {
	c(t), e = L(e);
	let n = b(e.toString(16).padStart(t * 2, "0"));
	if (n.length !== t) throw Error("number too large");
	return n;
}
function ae(e, t) {
	return ie(e, t).reverse();
}
function oe(e) {
	return Uint8Array.from(e);
}
function se(e) {
	return Uint8Array.from(e, (t, n) => {
		let r = t.charCodeAt(0);
		if (t.length !== 1 || r > 127) throw Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
		return r;
	});
}
var ce = (e) => typeof e == "bigint" && P <= e;
function le(e, t, n) {
	return ce(e) && ce(t) && ce(n) && t <= e && e < n;
}
function ue(e, t, n, r) {
	if (!le(t, n, r)) throw Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function de(e) {
	let t = 0;
	for (; e > P; e >>= F, t += 1);
	return t;
}
var fe = (e) => (F << BigInt(e)) - F;
function pe(e, t, n) {
	if (c(e, "hashLen"), c(t, "qByteLen"), typeof n != "function") throw Error("hmacFn must be a function");
	let r = (e) => new Uint8Array(e), i = Uint8Array.of(), a = Uint8Array.of(0), o = Uint8Array.of(1), s = r(e), l = r(e), u = 0, d = () => {
		s.fill(1), l.fill(0), u = 0;
	}, f = (...e) => n(l, x(s, ...e)), p = (e = i) => {
		l = f(a, e), s = f(), e.length !== 0 && (l = f(o, e), s = f());
	}, m = () => {
		if (u++ >= 1e3) throw Error("drbg: tried max amount of iterations");
		let e = 0, n = [];
		for (; e < t;) {
			s = f();
			let t = s.slice();
			n.push(t), e += s.length;
		}
		return x(...n);
	};
	return (e, t) => {
		d(), p(e);
		let n;
		for (; !(n = t(m()));) p();
		return d(), n;
	};
}
function me(e, t = {}, n = {}) {
	if (!e || typeof e != "object") throw Error("expected valid options object");
	function r(t, n, r) {
		let i = e[t];
		if (r && i === void 0) return;
		let a = typeof i;
		if (a !== n || i === null) throw Error(`param "${t}" is invalid: expected ${n}, got ${a}`);
	}
	let i = (e, t) => Object.entries(e).forEach(([e, n]) => r(e, n, t));
	i(t, !1), i(n, !0);
}
function he(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		let i = t.get(n);
		if (i !== void 0) return i;
		let a = e(n, ...r);
		return t.set(n, a), a;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/modular.js
var z = /* @__PURE__ */ BigInt(0), B = /* @__PURE__ */ BigInt(1), ge = /* @__PURE__ */ BigInt(2), _e = /* @__PURE__ */ BigInt(3), ve = /* @__PURE__ */ BigInt(4), ye = /* @__PURE__ */ BigInt(5), be = /* @__PURE__ */ BigInt(7), xe = /* @__PURE__ */ BigInt(8), Se = /* @__PURE__ */ BigInt(9), Ce = /* @__PURE__ */ BigInt(16);
function V(e, t) {
	let n = e % t;
	return n >= z ? n : t + n;
}
function H(e, t, n) {
	let r = e;
	for (; t-- > z;) r *= r, r %= n;
	return r;
}
function we(e, t) {
	if (e === z) throw Error("invert: expected non-zero number");
	if (t <= z) throw Error("invert: expected positive modulus, got " + t);
	let n = V(e, t), r = t, i = z, a = B, o = B, s = z;
	for (; n !== z;) {
		let e = r / n, t = r % n, c = i - o * e, l = a - s * e;
		r = n, n = t, i = o, a = s, o = c, s = l;
	}
	if (r !== B) throw Error("invert: does not exist");
	return V(i, t);
}
function Te(e, t, n) {
	if (!e.eql(e.sqr(t), n)) throw Error("Cannot find square root");
}
function Ee(e, t) {
	let n = (e.ORDER + B) / ve, r = e.pow(t, n);
	return Te(e, r, t), r;
}
function De(e, t) {
	let n = (e.ORDER - ye) / xe, r = e.mul(t, ge), i = e.pow(r, n), a = e.mul(t, i), o = e.mul(e.mul(a, ge), i), s = e.mul(a, e.sub(o, e.ONE));
	return Te(e, s, t), s;
}
function Oe(e) {
	let t = Re(e), n = ke(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + be) / Ce;
	return (e, t) => {
		let n = e.pow(t, o), s = e.mul(n, r), c = e.mul(n, i), l = e.mul(n, a), u = e.eql(e.sqr(s), t), d = e.eql(e.sqr(c), t);
		n = e.cmov(n, s, u), s = e.cmov(l, c, d);
		let f = e.eql(e.sqr(s), t), p = e.cmov(n, s, f);
		return Te(e, p, t), p;
	};
}
function ke(e) {
	if (e < _e) throw Error("sqrt is not defined for small field");
	let t = e - B, n = 0;
	for (; t % ge === z;) t /= ge, n++;
	let r = ge, i = Re(e);
	for (; Fe(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return Ee;
	let a = i.pow(r, t), o = (t + B) / ge;
	return function(e, r) {
		if (e.is0(r)) return r;
		if (Fe(e, r) !== 1) throw Error("Cannot find square root");
		let i = n, s = e.mul(e.ONE, a), c = e.pow(r, t), l = e.pow(r, o);
		for (; !e.eql(c, e.ONE);) {
			if (e.is0(c)) return e.ZERO;
			let t = 1, n = e.sqr(c);
			for (; !e.eql(n, e.ONE);) if (t++, n = e.sqr(n), t === i) throw Error("Cannot find square root");
			let r = B << BigInt(i - t - 1), a = e.pow(s, r);
			i = t, s = e.sqr(a), c = e.mul(c, s), l = e.mul(l, a);
		}
		return l;
	};
}
function Ae(e) {
	return e % ve === _e ? Ee : e % xe === ye ? De : e % Ce === Se ? Oe(e) : ke(e);
}
var je = [
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
function Me(e) {
	return me(e, je.reduce((e, t) => (e[t] = "function", e), {
		ORDER: "bigint",
		BYTES: "number",
		BITS: "number"
	})), e;
}
function Ne(e, t, n) {
	if (n < z) throw Error("invalid exponent, negatives unsupported");
	if (n === z) return e.ONE;
	if (n === B) return t;
	let r = e.ONE, i = t;
	for (; n > z;) n & B && (r = e.mul(r, i)), i = e.sqr(i), n >>= B;
	return r;
}
function Pe(e, t, n = !1) {
	let r = Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((t, n, i) => e.is0(n) ? t : (r[i] = t, e.mul(t, n)), e.ONE), a = e.inv(i);
	return t.reduceRight((t, n, i) => e.is0(n) ? t : (r[i] = e.mul(t, r[i]), e.mul(t, n)), a), r;
}
function Fe(e, t) {
	let n = (e.ORDER - B) / ge, r = e.pow(t, n), i = e.eql(r, e.ONE), a = e.eql(r, e.ZERO), o = e.eql(r, e.neg(e.ONE));
	if (!i && !a && !o) throw Error("invalid Legendre symbol result");
	return i ? 1 : a ? 0 : -1;
}
function Ie(e, t) {
	t !== void 0 && c(t);
	let n = t === void 0 ? e.toString(2).length : t;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
var Le = class {
	ORDER;
	BITS;
	BYTES;
	isLE;
	ZERO = z;
	ONE = B;
	_lengths;
	_sqrt;
	_mod;
	constructor(e, t = {}) {
		if (e <= z) throw Error("invalid field: expected ORDER > 0, got " + e);
		let n;
		this.isLE = !1, typeof t == "object" && t && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && (this.sqrt = t.sqrt), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = t.allowedLengths?.slice()), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
		let { nBitLength: r, nByteLength: i } = Ie(e, n);
		if (i > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = e, this.BITS = r, this.BYTES = i, this._sqrt = void 0, Object.preventExtensions(this);
	}
	create(e) {
		return V(e, this.ORDER);
	}
	isValid(e) {
		if (typeof e != "bigint") throw Error("invalid field element: expected bigint, got " + typeof e);
		return z <= e && e < this.ORDER;
	}
	is0(e) {
		return e === z;
	}
	isValidNot0(e) {
		return !this.is0(e) && this.isValid(e);
	}
	isOdd(e) {
		return (e & B) === B;
	}
	neg(e) {
		return V(-e, this.ORDER);
	}
	eql(e, t) {
		return e === t;
	}
	sqr(e) {
		return V(e * e, this.ORDER);
	}
	add(e, t) {
		return V(e + t, this.ORDER);
	}
	sub(e, t) {
		return V(e - t, this.ORDER);
	}
	mul(e, t) {
		return V(e * t, this.ORDER);
	}
	pow(e, t) {
		return Ne(this, e, t);
	}
	div(e, t) {
		return V(e * we(t, this.ORDER), this.ORDER);
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
		return we(e, this.ORDER);
	}
	sqrt(e) {
		return this._sqrt ||= Ae(this.ORDER), this._sqrt(this, e);
	}
	toBytes(e) {
		return this.isLE ? ae(e, this.BYTES) : ie(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		l(e);
		let { _lengths: n, BYTES: r, isLE: i, ORDER: a, _mod: o } = this;
		if (n) {
			if (!n.includes(e.length) || e.length > r) throw Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
			let t = new Uint8Array(r);
			t.set(e, i ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== r) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
		let s = i ? re(e) : R(e);
		if (o && (s = V(s, a)), !t && !this.isValid(s)) throw Error("invalid field element: outside of range 0..ORDER");
		return s;
	}
	invertBatch(e) {
		return Pe(this, e);
	}
	cmov(e, t, n) {
		return n ? t : e;
	}
};
function Re(e, t = {}) {
	return new Le(e, t);
}
function ze(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	let t = e.toString(2).length;
	return Math.ceil(t / 8);
}
function Be(e) {
	let t = ze(e);
	return t + Math.ceil(t / 2);
}
function Ve(e, t, n = !1) {
	l(e);
	let r = e.length, i = ze(t), a = Be(t);
	if (r < 16 || r < a || r > 1024) throw Error("expected " + a + "-1024 bytes of input, got " + r);
	let o = V(n ? re(e) : R(e), t - B) + B;
	return n ? ae(o, i) : ie(o, i);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/curve.js
var He = /* @__PURE__ */ BigInt(0), Ue = /* @__PURE__ */ BigInt(1);
function We(e, t) {
	let n = t.negate();
	return e ? n : t;
}
function Ge(e, t) {
	let n = Pe(e.Fp, t.map((e) => e.Z));
	return t.map((t, r) => e.fromAffine(t.toAffine(n[r])));
}
function Ke(e, t) {
	if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function qe(e, t) {
	Ke(e, t);
	let n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e;
	return {
		windows: n,
		windowSize: r,
		mask: fe(e),
		maxNumber: i,
		shiftBy: BigInt(e)
	};
}
function Je(e, t, n) {
	let { windowSize: r, mask: i, maxNumber: a, shiftBy: o } = n, s = Number(e & i), c = e >> o;
	s > r && (s -= a, c += Ue);
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
var Ye = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ new WeakMap();
function Ze(e) {
	return Xe.get(e) || 1;
}
function Qe(e) {
	if (e !== He) throw Error("invalid wNAF");
}
var $e = class {
	BASE;
	ZERO;
	Fn;
	bits;
	constructor(e, t) {
		this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = t;
	}
	_unsafeLadder(e, t, n = this.ZERO) {
		let r = e;
		for (; t > He;) t & Ue && (n = n.add(r)), r = r.double(), t >>= Ue;
		return n;
	}
	precomputeWindow(e, t) {
		let { windows: n, windowSize: r } = qe(t, this.bits), i = [], a = e, o = a;
		for (let e = 0; e < n; e++) {
			o = a, i.push(o);
			for (let e = 1; e < r; e++) o = o.add(a), i.push(o);
			a = o.double();
		}
		return i;
	}
	wNAF(e, t, n) {
		if (!this.Fn.isValid(n)) throw Error("invalid scalar");
		let r = this.ZERO, i = this.BASE, a = qe(e, this.bits);
		for (let e = 0; e < a.windows; e++) {
			let { nextN: o, offset: s, isZero: c, isNeg: l, isNegF: u, offsetF: d } = Je(n, e, a);
			n = o, c ? i = i.add(We(u, t[d])) : r = r.add(We(l, t[s]));
		}
		return Qe(n), {
			p: r,
			f: i
		};
	}
	wNAFUnsafe(e, t, n, r = this.ZERO) {
		let i = qe(e, this.bits);
		for (let e = 0; e < i.windows && n !== He; e++) {
			let { nextN: a, offset: o, isZero: s, isNeg: c } = Je(n, e, i);
			if (n = a, !s) {
				let e = t[o];
				r = r.add(c ? e.negate() : e);
			}
		}
		return Qe(n), r;
	}
	getPrecomputes(e, t, n) {
		let r = Ye.get(t);
		return r || (r = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (r = n(r)), Ye.set(t, r))), r;
	}
	cached(e, t, n) {
		let r = Ze(e);
		return this.wNAF(r, this.getPrecomputes(r, e, n), t);
	}
	unsafe(e, t, n, r) {
		let i = Ze(e);
		return i === 1 ? this._unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
	}
	createCache(e, t) {
		Ke(t, this.bits), Xe.set(e, t), Ye.delete(e);
	}
	hasCache(e) {
		return Ze(e) !== 1;
	}
};
function et(e, t, n, r) {
	let i = t, a = e.ZERO, o = e.ZERO;
	for (; n > He || r > He;) n & Ue && (a = a.add(i)), r & Ue && (o = o.add(i)), i = i.double(), n >>= Ue, r >>= Ue;
	return {
		p1: a,
		p2: o
	};
}
function tt(e, t, n) {
	if (t) {
		if (t.ORDER !== e) throw Error("Field.ORDER must match order: Fp == p, Fn == n");
		return Me(t), t;
	}
	return Re(e, { isLE: n });
}
function nt(e, t, n = {}, r) {
	if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw Error(`expected valid ${e} CURVE object`);
	for (let e of [
		"p",
		"n",
		"h"
	]) {
		let n = t[e];
		if (!(typeof n == "bigint" && n > He)) throw Error(`CURVE.${e} must be positive bigint`);
	}
	let i = tt(t.p, n.Fp, r), a = tt(t.n, n.Fn, r), o = [
		"Gx",
		"Gy",
		"a",
		e === "weierstrass" ? "b" : "d"
	];
	for (let e of o) if (!i.isValid(t[e])) throw Error(`CURVE.${e} must be valid field element of CURVE.Fp`);
	return t = Object.freeze(Object.assign({}, t)), {
		CURVE: t,
		Fp: i,
		Fn: a
	};
}
function rt(e, t) {
	return function(n) {
		let r = e(n);
		return {
			secretKey: r,
			publicKey: t(r)
		};
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hmac.js
var it = class {
	oHash;
	iHash;
	blockLen;
	outputLen;
	finished = !1;
	destroyed = !1;
	constructor(e, t) {
		if (u(e), l(t, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function") throw Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let n = this.blockLen, r = new Uint8Array(n);
		r.set(t.length > n ? e.create().update(t).digest() : t);
		for (let e = 0; e < r.length; e++) r[e] ^= 54;
		this.iHash.update(r), this.oHash = e.create();
		for (let e = 0; e < r.length; e++) r[e] ^= 106;
		this.oHash.update(r), p(r);
	}
	update(e) {
		return d(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		d(this), l(e, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
	}
	digest() {
		let e = new Uint8Array(this.oHash.outputLen);
		return this.digestInto(e), e;
	}
	_cloneInto(e) {
		e ||= Object.create(Object.getPrototypeOf(this), {});
		let { oHash: t, iHash: n, finished: r, destroyed: i, blockLen: a, outputLen: o } = this;
		return e = e, e.finished = r, e.destroyed = i, e.blockLen = a, e.outputLen = o, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
	}
	clone() {
		return this._cloneInto();
	}
	destroy() {
		this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
	}
}, at = (e, t, n) => new it(e, t).update(n).digest();
at.create = (e, t) => new it(e, t);
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/weierstrass.js
var ot = (e, t) => (e + (e >= 0 ? t : -t) / pt) / t;
function st(e, t, n) {
	let [[r, i], [a, o]] = t, s = ot(o * e, n), c = ot(-i * e, n), l = e - s * r - c * a, u = -s * i - c * o, d = l < dt, f = u < dt;
	d && (l = -l), f && (u = -u);
	let p = fe(Math.ceil(de(n) / 2)) + ft;
	if (l < dt || l >= p || u < dt || u >= p) throw Error("splitScalar (endomorphism): failed, k=" + e);
	return {
		k1neg: d,
		k1: l,
		k2neg: f,
		k2: u
	};
}
function ct(e) {
	if (![
		"compact",
		"recovered",
		"der"
	].includes(e)) throw Error("Signature format must be \"compact\", \"recovered\", or \"der\"");
	return e;
}
function lt(e, t) {
	let n = {};
	for (let r of Object.keys(t)) n[r] = e[r] === void 0 ? t[r] : e[r];
	return I(n.lowS, "lowS"), I(n.prehash, "prehash"), n.format !== void 0 && ct(n.format), n;
}
var ut = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = ut;
			if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = te(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? te(i.length / 2 | 128) : "";
			return te(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = ut, r = 0;
			if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
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
			let { Err: t } = ut;
			if (e < dt) throw new t("integer: negative integers are not allowed");
			let n = te(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = ut;
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return R(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: n, _tlv: r } = ut, i = l(e, void 0, "signature"), { v: a, l: o } = r.decode(48, i);
		if (o.length) throw new t("invalid signature: left bytes after parsing");
		let { v: s, l: c } = r.decode(2, a), { v: u, l: d } = r.decode(2, c);
		if (d.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: n.decode(s),
			s: n.decode(u)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = ut, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
}, dt = BigInt(0), ft = BigInt(1), pt = BigInt(2), mt = BigInt(3), ht = BigInt(4);
function gt(e, t = {}) {
	let n = nt("weierstrass", e, t), { Fp: r, Fn: i } = n, a = n.CURVE, { h: o, n: s } = a;
	me(t, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object"
	});
	let { endo: c } = t;
	if (c && (!r.is0(a.a) || typeof c.beta != "bigint" || !Array.isArray(c.basises))) throw Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	let u = vt(r, i);
	function d() {
		if (!r.isOdd) throw Error("compression is not supported: Field does not have .isOdd()");
	}
	function f(e, t, n) {
		let { x: i, y: a } = t.toAffine(), o = r.toBytes(i);
		return I(n, "isCompressed"), n ? (d(), x(_t(!r.isOdd(a)), o)) : x(Uint8Array.of(4), o, r.toBytes(a));
	}
	function p(e) {
		l(e, void 0, "Point");
		let { publicKey: t, publicKeyUncompressed: n } = u, i = e.length, a = e[0], o = e.subarray(1);
		if (i === t && (a === 2 || a === 3)) {
			let e = r.fromBytes(o);
			if (!r.isValid(e)) throw Error("bad point: is not on curve, wrong x");
			let t = g(e), n;
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
			if (!_(t, n)) throw Error("bad point: is not on curve");
			return {
				x: t,
				y: n
			};
		}
		throw Error(`bad point: got length ${i}, expected compressed=${t} or uncompressed=${n}`);
	}
	let m = t.toBytes || f, h = t.fromBytes || p;
	function g(e) {
		let t = r.sqr(e), n = r.mul(t, e);
		return r.add(r.add(n, r.mul(e, a.a)), a.b);
	}
	function _(e, t) {
		let n = r.sqr(t), i = g(e);
		return r.eql(n, i);
	}
	if (!_(a.Gx, a.Gy)) throw Error("bad curve params: generator point");
	let y = r.mul(r.pow(a.a, mt), ht), ee = r.mul(r.sqr(a.b), BigInt(27));
	if (r.is0(r.add(y, ee))) throw Error("bad curve params: a or b");
	function S(e, t, n = !1) {
		if (!r.isValid(t) || n && r.is0(t)) throw Error(`bad point coordinate ${e}`);
		return t;
	}
	function C(e) {
		if (!(e instanceof O)) throw Error("Weierstrass Point expected");
	}
	function w(e) {
		if (!c || !c.basises) throw Error("no endo");
		return st(e, c.basises, i.ORDER);
	}
	let T = he((e, t) => {
		let { X: n, Y: i, Z: a } = e;
		if (r.eql(a, r.ONE)) return {
			x: n,
			y: i
		};
		let o = e.is0();
		t ??= o ? r.ONE : r.inv(a);
		let s = r.mul(n, t), c = r.mul(i, t), l = r.mul(a, t);
		if (o) return {
			x: r.ZERO,
			y: r.ZERO
		};
		if (!r.eql(l, r.ONE)) throw Error("invZ was invalid");
		return {
			x: s,
			y: c
		};
	}), E = he((e) => {
		if (e.is0()) {
			if (t.allowInfinityPoint && !r.is0(e.Y)) return;
			throw Error("bad point: ZERO");
		}
		let { x: n, y: i } = e.toAffine();
		if (!r.isValid(n) || !r.isValid(i)) throw Error("bad point: x or y not field elements");
		if (!_(n, i)) throw Error("bad point: equation left != right");
		if (!e.isTorsionFree()) throw Error("bad point: not in prime-order subgroup");
		return !0;
	});
	function D(e, t, n, i, a) {
		return n = new O(r.mul(n.X, e), n.Y, n.Z), t = We(i, t), n = We(a, n), t.add(n);
	}
	class O {
		static BASE = new O(a.Gx, a.Gy, r.ONE);
		static ZERO = new O(r.ZERO, r.ONE, r.ZERO);
		static Fp = r;
		static Fn = i;
		X;
		Y;
		Z;
		constructor(e, t, n) {
			this.X = S("x", e), this.Y = S("y", t, !0), this.Z = S("z", n), Object.freeze(this);
		}
		static CURVE() {
			return a;
		}
		static fromAffine(e) {
			let { x: t, y: n } = e || {};
			if (!e || !r.isValid(t) || !r.isValid(n)) throw Error("invalid affine point");
			if (e instanceof O) throw Error("projective point not allowed");
			return r.is0(t) && r.is0(n) ? O.ZERO : new O(t, n, r.ONE);
		}
		static fromBytes(e) {
			let t = O.fromAffine(h(l(e, void 0, "point")));
			return t.assertValidity(), t;
		}
		static fromHex(e) {
			return O.fromBytes(b(e));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(e = 8, t = !0) {
			return A.createCache(this, e), t || this.multiply(mt), this;
		}
		assertValidity() {
			E(this);
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (!r.isOdd) throw Error("Field doesn't support isOdd");
			return !r.isOdd(e);
		}
		equals(e) {
			C(e);
			let { X: t, Y: n, Z: i } = this, { X: a, Y: o, Z: s } = e, c = r.eql(r.mul(t, s), r.mul(a, i)), l = r.eql(r.mul(n, s), r.mul(o, i));
			return c && l;
		}
		negate() {
			return new O(this.X, r.neg(this.Y), this.Z);
		}
		double() {
			let { a: e, b: t } = a, n = r.mul(t, mt), { X: i, Y: o, Z: s } = this, c = r.ZERO, l = r.ZERO, u = r.ZERO, d = r.mul(i, i), f = r.mul(o, o), p = r.mul(s, s), m = r.mul(i, o);
			return m = r.add(m, m), u = r.mul(i, s), u = r.add(u, u), c = r.mul(e, u), l = r.mul(n, p), l = r.add(c, l), c = r.sub(f, l), l = r.add(f, l), l = r.mul(c, l), c = r.mul(m, c), u = r.mul(n, u), p = r.mul(e, p), m = r.sub(d, p), m = r.mul(e, m), m = r.add(m, u), u = r.add(d, d), d = r.add(u, d), d = r.add(d, p), d = r.mul(d, m), l = r.add(l, d), p = r.mul(o, s), p = r.add(p, p), d = r.mul(p, m), c = r.sub(c, d), u = r.mul(p, f), u = r.add(u, u), u = r.add(u, u), new O(c, l, u);
		}
		add(e) {
			C(e);
			let { X: t, Y: n, Z: i } = this, { X: o, Y: s, Z: c } = e, l = r.ZERO, u = r.ZERO, d = r.ZERO, f = a.a, p = r.mul(a.b, mt), m = r.mul(t, o), h = r.mul(n, s), g = r.mul(i, c), _ = r.add(t, n), v = r.add(o, s);
			_ = r.mul(_, v), v = r.add(m, h), _ = r.sub(_, v), v = r.add(t, i);
			let y = r.add(o, c);
			return v = r.mul(v, y), y = r.add(m, g), v = r.sub(v, y), y = r.add(n, i), l = r.add(s, c), y = r.mul(y, l), l = r.add(h, g), y = r.sub(y, l), d = r.mul(f, v), l = r.mul(p, g), d = r.add(l, d), l = r.sub(h, d), d = r.add(h, d), u = r.mul(l, d), h = r.add(m, m), h = r.add(h, m), g = r.mul(f, g), v = r.mul(p, v), h = r.add(h, g), g = r.sub(m, g), g = r.mul(f, g), v = r.add(v, g), m = r.mul(h, v), u = r.add(u, m), m = r.mul(y, v), l = r.mul(_, l), l = r.sub(l, m), m = r.mul(_, h), d = r.mul(y, d), d = r.add(d, m), new O(l, u, d);
		}
		subtract(e) {
			return this.add(e.negate());
		}
		is0() {
			return this.equals(O.ZERO);
		}
		multiply(e) {
			let { endo: n } = t;
			if (!i.isValidNot0(e)) throw Error("invalid scalar: out of range");
			let r, a, o = (e) => A.cached(this, e, (e) => Ge(O, e));
			if (n) {
				let { k1neg: t, k1: i, k2neg: s, k2: c } = w(e), { p: l, f: u } = o(i), { p: d, f } = o(c);
				a = u.add(f), r = D(n.beta, l, d, t, s);
			} else {
				let { p: t, f: n } = o(e);
				r = t, a = n;
			}
			return Ge(O, [r, a])[0];
		}
		multiplyUnsafe(e) {
			let { endo: n } = t, r = this;
			if (!i.isValid(e)) throw Error("invalid scalar: out of range");
			if (e === dt || r.is0()) return O.ZERO;
			if (e === ft) return r;
			if (A.hasCache(this)) return this.multiply(e);
			if (n) {
				let { k1neg: t, k1: i, k2neg: a, k2: o } = w(e), { p1: s, p2: c } = et(O, r, i, o);
				return D(n.beta, s, c, t, a);
			}
			return A.unsafe(r, e);
		}
		toAffine(e) {
			return T(this, e);
		}
		isTorsionFree() {
			let { isTorsionFree: e } = t;
			return o === ft ? !0 : e ? e(O, this) : A.unsafe(this, s).is0();
		}
		clearCofactor() {
			let { clearCofactor: e } = t;
			return o === ft ? this : e ? e(O, this) : this.multiplyUnsafe(o);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(o).is0();
		}
		toBytes(e = !0) {
			return I(e, "isCompressed"), this.assertValidity(), m(O, this, e);
		}
		toHex(e = !0) {
			return v(this.toBytes(e));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	let k = i.BITS, A = new $e(O, t.endo ? Math.ceil(k / 2) : k);
	return O.BASE.precompute(8), O;
}
function _t(e) {
	return Uint8Array.of(e ? 2 : 3);
}
function vt(e, t) {
	return {
		secretKey: t.BYTES,
		publicKey: 1 + e.BYTES,
		publicKeyUncompressed: 1 + 2 * e.BYTES,
		publicKeyHasPrefix: !0,
		signature: 2 * t.BYTES
	};
}
function yt(e, t = {}) {
	let { Fn: n } = e, r = t.randomBytes || C, i = Object.assign(vt(e.Fp, n), { seed: Be(n.ORDER) });
	function a(e) {
		try {
			let t = n.fromBytes(e);
			return n.isValidNot0(t);
		} catch {
			return !1;
		}
	}
	function o(t, n) {
		let { publicKey: r, publicKeyUncompressed: a } = i;
		try {
			let i = t.length;
			return n === !0 && i !== r || n === !1 && i !== a ? !1 : !!e.fromBytes(t);
		} catch {
			return !1;
		}
	}
	function c(e = r(i.seed)) {
		return Ve(l(e, i.seed, "seed"), n.ORDER);
	}
	function u(t, r = !0) {
		return e.BASE.multiply(n.fromBytes(t)).toBytes(r);
	}
	function d(e) {
		let { secretKey: t, publicKey: r, publicKeyUncompressed: a } = i;
		if (!s(e) || "_lengths" in n && n._lengths || t === r) return;
		let o = l(e, void 0, "key").length;
		return o === r || o === a;
	}
	function f(t, r, i = !0) {
		if (d(t) === !0) throw Error("first arg must be private key");
		if (d(r) === !1) throw Error("second arg must be public key");
		let a = n.fromBytes(t);
		return e.fromBytes(r).multiply(a).toBytes(i);
	}
	let p = {
		isValidSecretKey: a,
		isValidPublicKey: o,
		randomSecretKey: c
	}, m = rt(c, u);
	return Object.freeze({
		getPublicKey: u,
		getSharedSecret: f,
		keygen: m,
		Point: e,
		utils: p,
		lengths: i
	});
}
function bt(e, t, n = {}) {
	u(t), me(n, {}, {
		hmac: "function",
		lowS: "boolean",
		randomBytes: "function",
		bits2int: "function",
		bits2int_modN: "function"
	}), n = Object.assign({}, n);
	let r = n.randomBytes || C, i = n.hmac || ((e, n) => at(t, e, n)), { Fp: a, Fn: o } = e, { ORDER: c, BITS: d } = o, { keygen: f, getPublicKey: p, getSharedSecret: m, utils: h, lengths: g } = yt(e, n), _ = {
		prehash: !0,
		lowS: typeof n.lowS != "boolean" || n.lowS,
		format: "compact",
		extraEntropy: !1
	}, y = c * pt < a.ORDER;
	function ee(e) {
		return e > c >> ft;
	}
	function S(e, t) {
		if (!o.isValidNot0(t)) throw Error(`invalid signature ${e}: out of range 1..Point.Fn.ORDER`);
		return t;
	}
	function w() {
		if (y) throw Error("\"recovered\" sig type is not supported for cofactor >2 curves");
	}
	function T(e, t) {
		ct(t);
		let n = g.signature;
		return l(e, t === "compact" ? n : t === "recovered" ? n + 1 : void 0);
	}
	class E {
		r;
		s;
		recovery;
		constructor(e, t, n) {
			if (this.r = S("r", e), this.s = S("s", t), n != null) {
				if (w(), ![
					0,
					1,
					2,
					3
				].includes(n)) throw Error("invalid recovery id");
				this.recovery = n;
			}
			Object.freeze(this);
		}
		static fromBytes(e, t = _.format) {
			T(e, t);
			let n;
			if (t === "der") {
				let { r: t, s: n } = ut.toSig(l(e));
				return new E(t, n);
			}
			t === "recovered" && (n = e[0], t = "compact", e = e.subarray(1));
			let r = g.signature / 2, i = e.subarray(0, r), a = e.subarray(r, r * 2);
			return new E(o.fromBytes(i), o.fromBytes(a), n);
		}
		static fromHex(e, t) {
			return this.fromBytes(b(e), t);
		}
		assertRecovery() {
			let { recovery: e } = this;
			if (e == null) throw Error("invalid recovery id: must be present");
			return e;
		}
		addRecoveryBit(e) {
			return new E(this.r, this.s, e);
		}
		recoverPublicKey(t) {
			let { r: n, s: r } = this, i = this.assertRecovery(), s = i === 2 || i === 3 ? n + c : n;
			if (!a.isValid(s)) throw Error("invalid recovery id: sig.r+curve.n != R.x");
			let u = a.toBytes(s), d = e.fromBytes(x(_t(!(i & 1)), u)), f = o.inv(s), p = O(l(t, void 0, "msgHash")), m = o.create(-p * f), h = o.create(r * f), g = e.BASE.multiplyUnsafe(m).add(d.multiplyUnsafe(h));
			if (g.is0()) throw Error("invalid recovery: point at infinify");
			return g.assertValidity(), g;
		}
		hasHighS() {
			return ee(this.s);
		}
		toBytes(e = _.format) {
			if (ct(e), e === "der") return b(ut.hexFromSig(this));
			let { r: t, s: n } = this, r = o.toBytes(t), i = o.toBytes(n);
			return e === "recovered" ? (w(), x(Uint8Array.of(this.assertRecovery()), r, i)) : x(r, i);
		}
		toHex(e) {
			return v(this.toBytes(e));
		}
	}
	let D = n.bits2int || function(e) {
		if (e.length > 8192) throw Error("input is too large");
		let t = R(e), n = e.length * 8 - d;
		return n > 0 ? t >> BigInt(n) : t;
	}, O = n.bits2int_modN || function(e) {
		return o.create(D(e));
	}, k = fe(d);
	function A(e) {
		return ue("num < 2^" + d, e, dt, k), o.toBytes(e);
	}
	function j(e, n) {
		return l(e, void 0, "message"), n ? l(t(e), void 0, "prehashed message") : e;
	}
	function M(t, n, i) {
		let { lowS: a, prehash: s, extraEntropy: c } = lt(i, _);
		t = j(t, s);
		let u = O(t), d = o.fromBytes(n);
		if (!o.isValidNot0(d)) throw Error("invalid private key");
		let f = [A(d), A(u)];
		if (c != null && c !== !1) {
			let e = c === !0 ? r(g.secretKey) : c;
			f.push(l(e, void 0, "extraEntropy"));
		}
		let p = x(...f), m = u;
		function h(t) {
			let n = D(t);
			if (!o.isValidNot0(n)) return;
			let r = o.inv(n), i = e.BASE.multiply(n).toAffine(), s = o.create(i.x);
			if (s === dt) return;
			let c = o.create(r * o.create(m + s * d));
			if (c === dt) return;
			let l = (i.x === s ? 0 : 2) | Number(i.y & ft), u = c;
			return a && ee(c) && (u = o.neg(c), l ^= 1), new E(s, u, y ? void 0 : l);
		}
		return {
			seed: p,
			k2sig: h
		};
	}
	function N(e, n, r = {}) {
		let { seed: a, k2sig: s } = M(e, n, r);
		return pe(t.outputLen, o.BYTES, i)(a, s).toBytes(r.format);
	}
	function P(t, n, r, i = {}) {
		let { lowS: a, prehash: c, format: u } = lt(i, _);
		if (r = l(r, void 0, "publicKey"), n = j(n, c), !s(t)) {
			let e = t instanceof E ? ", use sig.toBytes()" : "";
			throw Error("verify expects Uint8Array signature" + e);
		}
		T(t, u);
		try {
			let i = E.fromBytes(t, u), s = e.fromBytes(r);
			if (a && i.hasHighS()) return !1;
			let { r: c, s: l } = i, d = O(n), f = o.inv(l), p = o.create(d * f), m = o.create(c * f), h = e.BASE.multiplyUnsafe(p).add(s.multiplyUnsafe(m));
			return !h.is0() && o.create(h.x) === c;
		} catch {
			return !1;
		}
	}
	function F(e, t, n = {}) {
		let { prehash: r } = lt(n, _);
		return t = j(t, r), E.fromBytes(e, "recovered").recoverPublicKey(t).toBytes();
	}
	return Object.freeze({
		keygen: f,
		getPublicKey: p,
		getSharedSecret: m,
		utils: h,
		lengths: g,
		Point: e,
		sign: N,
		verify: P,
		recoverPublicKey: F,
		Signature: E,
		hash: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/secp256k1.js
var xt = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, St = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
}, Ct = /* @__PURE__ */ BigInt(0), wt = /* @__PURE__ */ BigInt(2);
function Tt(e) {
	let t = xt.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = H(H(H(u, n, t) * u % t, n, t) * u % t, wt, t) * l % t, f = H(d, i, t) * d % t, p = H(f, a, t) * f % t, m = H(p, s, t) * p % t, h = H(H(H(H(H(H(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, wt, t);
	if (!Et.eql(Et.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var Et = Re(xt.p, { sqrt: Tt }), Dt = /* @__PURE__ */ gt(xt, {
	Fp: Et,
	endo: St
}), Ot = /* @__PURE__ */ bt(Dt, N), kt = {};
function At(e, ...t) {
	let n = kt[e];
	if (n === void 0) {
		let t = N(se(e));
		n = x(t, t), kt[e] = n;
	}
	return N(x(n, ...t));
}
var jt = (e) => e.toBytes(!0).slice(1), Mt = (e) => e % wt === Ct;
function Nt(e) {
	let { Fn: t, BASE: n } = Dt, r = t.fromBytes(e), i = n.multiply(r);
	return {
		scalar: Mt(i.y) ? r : t.neg(r),
		bytes: jt(i)
	};
}
function Pt(e) {
	let t = Et;
	if (!t.isValidNot0(e)) throw Error("invalid x: Fail if x ≥ p");
	let n = t.create(e * e), r = t.create(n * e + BigInt(7)), i = t.sqrt(r);
	Mt(i) || (i = t.neg(i));
	let a = Dt.fromAffine({
		x: e,
		y: i
	});
	return a.assertValidity(), a;
}
var Ft = R;
function It(...e) {
	return Dt.Fn.create(Ft(At("BIP0340/challenge", ...e)));
}
function Lt(e) {
	return Nt(e).bytes;
}
function Rt(e, t, n = C(32)) {
	let { Fn: r } = Dt, i = l(e, void 0, "message"), { bytes: a, scalar: o } = Nt(t), s = l(n, 32, "auxRand"), { bytes: c, scalar: u } = Nt(At("BIP0340/nonce", r.toBytes(o ^ Ft(At("BIP0340/aux", s))), a, i)), d = It(c, a, i), f = /* @__PURE__ */ new Uint8Array(64);
	if (f.set(c, 0), f.set(r.toBytes(r.create(u + d * o)), 32), !zt(f, i, a)) throw Error("sign: Invalid signature produced");
	return f;
}
function zt(e, t, n) {
	let { Fp: r, Fn: i, BASE: a } = Dt, o = l(e, 64, "signature"), s = l(t, void 0, "message"), c = l(n, 32, "publicKey");
	try {
		let e = Pt(Ft(c)), t = Ft(o.subarray(0, 32));
		if (!r.isValidNot0(t)) return !1;
		let n = Ft(o.subarray(32, 64));
		if (!i.isValidNot0(n)) return !1;
		let l = It(i.toBytes(t), jt(e), s), u = a.multiplyUnsafe(n).add(e.multiplyUnsafe(i.neg(l))), { x: d, y: f } = u.toAffine();
		return !(u.is0() || !Mt(f) || d !== t);
	} catch {
		return !1;
	}
}
var Bt = /* @__PURE__ */ (() => {
	let e = (e = C(48)) => Ve(e, xt.n);
	return {
		keygen: rt(e, Lt),
		getPublicKey: Lt,
		sign: Rt,
		verify: zt,
		Point: Dt,
		utils: {
			randomSecretKey: e,
			taggedHash: At,
			lift_x: Pt,
			pointToBytes: jt
		},
		lengths: {
			secretKey: 32,
			publicKey: 32,
			publicKeyHasPrefix: !1,
			signature: 64,
			seed: 48
		}
	};
})();
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@scure/base/index.js
function Vt(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Ht(e) {
	if (!Vt(e)) throw Error("Uint8Array expected");
}
function Ut(e, t) {
	return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((e) => typeof e == "string") : t.every((e) => Number.isSafeInteger(e)) : !1;
}
function Wt(e) {
	if (typeof e != "function") throw Error("function expected");
	return !0;
}
function Gt(e, t) {
	if (typeof t != "string") throw Error(`${e}: string expected`);
	return !0;
}
function Kt(e) {
	if (!Number.isSafeInteger(e)) throw Error(`invalid integer: ${e}`);
}
function qt(e) {
	if (!Array.isArray(e)) throw Error("array expected");
}
function Jt(e, t) {
	if (!Ut(!0, t)) throw Error(`${e}: array of strings expected`);
}
function Yt(e, t) {
	if (!Ut(!1, t)) throw Error(`${e}: array of numbers expected`);
}
function U(...e) {
	let t = (e) => e, n = (e, t) => (n) => e(t(n));
	return {
		encode: e.map((e) => e.encode).reduceRight(n, t),
		decode: e.map((e) => e.decode).reduce(n, t)
	};
}
function W(e) {
	let t = typeof e == "string" ? e.split("") : e, n = t.length;
	Jt("alphabet", t);
	let r = new Map(t.map((e, t) => [e, t]));
	return {
		encode: (r) => (qt(r), r.map((r) => {
			if (!Number.isSafeInteger(r) || r < 0 || r >= n) throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);
			return t[r];
		})),
		decode: (t) => (qt(t), t.map((t) => {
			Gt("alphabet.decode", t);
			let n = r.get(t);
			if (n === void 0) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
			return n;
		}))
	};
}
function G(e = "") {
	return Gt("join", e), {
		encode: (t) => (Jt("join.decode", t), t.join(e)),
		decode: (t) => (Gt("join.decode", t), t.split(e))
	};
}
function Xt(e, t = "=") {
	return Kt(e), Gt("padding", t), {
		encode(n) {
			for (Jt("padding.encode", n); n.length * e % 8;) n.push(t);
			return n;
		},
		decode(n) {
			Jt("padding.decode", n);
			let r = n.length;
			if (r * e % 8) throw Error("padding: invalid, string should have whole number of bytes");
			for (; r > 0 && n[r - 1] === t; r--) if ((r - 1) * e % 8 == 0) throw Error("padding: invalid, string has too much padding");
			return n.slice(0, r);
		}
	};
}
function Zt(e) {
	return Wt(e), {
		encode: (e) => e,
		decode: (t) => e(t)
	};
}
var Qt = (e, t) => t === 0 ? e : Qt(t, e % t), $t = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - Qt(e, t)), en = /* @__PURE__ */ (() => {
	let e = [];
	for (let t = 0; t < 40; t++) e.push(2 ** t);
	return e;
})();
function tn(e, t, n, r) {
	if (qt(e), t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (/* @__PURE__ */ $t(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ $t(t, n)}`);
	let i = 0, a = 0, o = en[t], s = en[n] - 1, c = [];
	for (let r of e) {
		if (Kt(r), r >= o) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
		if (i = i << t | r, a + t > 32) throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);
		for (a += t; a >= n; a -= n) c.push((i >> a - n & s) >>> 0);
		let e = en[a];
		if (e === void 0) throw Error("invalid carry");
		i &= e - 1;
	}
	if (i = i << n - a & s, !r && a >= t) throw Error("Excess padding");
	if (!r && i > 0) throw Error(`Non-zero padding: ${i}`);
	return r && a > 0 && c.push(i >>> 0), c;
}
function K(e, t = !1) {
	if (Kt(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ $t(8, e) > 32 || /* @__PURE__ */ $t(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!Vt(n)) throw Error("radix2.encode input should be Uint8Array");
			return tn(Array.from(n), 8, e, !t);
		},
		decode: (n) => (Yt("radix2.decode", n), Uint8Array.from(tn(n, e, 8, t)))
	};
}
function nn(e) {
	return Wt(e), function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
U(K(4), W("0123456789ABCDEF"), G("")), U(K(5), W("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), Xt(5), G("")), U(K(5), W("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), G("")), U(K(5), W("0123456789ABCDEFGHIJKLMNOPQRSTUV"), Xt(5), G("")), U(K(5), W("0123456789ABCDEFGHIJKLMNOPQRSTUV"), G("")), U(K(5), W("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), G(""), Zt((e) => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var rn = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", an = (e, t) => {
	Gt("base64", e);
	let n = t ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/, r = t ? "base64url" : "base64";
	if (e.length > 0 && !n.test(e)) throw Error("invalid base64");
	return Uint8Array.fromBase64(e, {
		alphabet: r,
		lastChunkHandling: "strict"
	});
}, on = rn ? {
	encode(e) {
		return Ht(e), e.toBase64();
	},
	decode(e) {
		return an(e, !1);
	}
} : U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), Xt(6), G(""));
U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), G("")), rn || U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), Xt(6), G("")), U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), G(""));
var sn = U(W("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), G("")), cn = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function ln(e) {
	let t = e >> 25, n = (e & 33554431) << 5;
	for (let e = 0; e < cn.length; e++) (t >> e & 1) == 1 && (n ^= cn[e]);
	return n;
}
function un(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = ln(i) ^ n >> 5;
	}
	i = ln(i);
	for (let t = 0; t < r; t++) i = ln(i) ^ e.charCodeAt(t) & 31;
	for (let e of t) i = ln(i) ^ e;
	for (let e = 0; e < 6; e++) i = ln(i);
	return i ^= n, sn.encode(tn([i % en[30]], 30, 5, !1));
}
function dn(e) {
	let t = e === "bech32" ? 1 : 734539939, n = K(5), r = n.decode, i = n.encode, a = nn(r);
	function o(e, n, r = 90) {
		Gt("bech32.encode prefix", e), Vt(n) && (n = Array.from(n)), Yt("bech32.encode", n);
		let i = e.length;
		if (i === 0) throw TypeError(`Invalid prefix length ${i}`);
		let a = i + 7 + n.length;
		if (r !== !1 && a > r) throw TypeError(`Length ${a} exceeds limit ${r}`);
		let o = e.toLowerCase(), s = un(o, n, t);
		return `${o}1${sn.encode(n)}${s}`;
	}
	function s(e, n = 90) {
		Gt("bech32.decode input", e);
		let r = e.length;
		if (r < 8 || n !== !1 && r > n) throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);
		let i = e.toLowerCase();
		if (e !== i && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
		let a = i.lastIndexOf("1");
		if (a === 0 || a === -1) throw Error("Letter \"1\" must be present between prefix and data only");
		let o = i.slice(0, a), s = i.slice(a + 1);
		if (s.length < 6) throw Error("Data must be at least 6 characters long");
		let c = sn.decode(s).slice(0, -6), l = un(o, c, t);
		if (!s.endsWith(l)) throw Error(`Invalid checksum in ${e}: expected "${l}"`);
		return {
			prefix: o,
			words: c
		};
	}
	let c = nn(s);
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
var fn = dn("bech32");
dn("bech32m"), typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function" || U(K(4), W("0123456789abcdef"), G(""), Zt((e) => {
	if (typeof e != "string" || e.length % 2 != 0) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
	return e.toLowerCase();
}));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/utils.js
function pn(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function mn(e) {
	if (typeof e != "boolean") throw Error(`boolean expected, not ${e}`);
}
function hn(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error("positive integer expected, got " + e);
}
function q(e, t, n = "") {
	let r = pn(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function gn(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function _n(e, t) {
	q(e, void 0, "output");
	let n = t.outputLen;
	if (e.length < n) throw Error("digestInto() expects output buffer of length at least " + n);
}
function J(e) {
	return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function vn(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
var yn = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function bn(e, t) {
	return e.buffer === t.buffer && e.byteOffset < t.byteOffset + t.byteLength && t.byteOffset < e.byteOffset + e.byteLength;
}
function xn(e, t) {
	if (bn(e, t) && e.byteOffset < t.byteOffset) throw Error("complex overlap of input and output is not supported");
}
function Sn(e, t) {
	if (typeof t != "object" || !t) throw Error("options must be defined");
	return Object.assign(e, t);
}
function Cn(e, t) {
	if (e.length !== t.length) return !1;
	let n = 0;
	for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
	return n === 0;
}
var wn = (e, t) => {
	function n(n, ...r) {
		if (q(n, void 0, "key"), !yn) throw Error("Non little-endian hardware is not yet supported");
		if (e.nonceLength !== void 0) {
			let t = r[0];
			q(t, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
		}
		let i = e.tagLength;
		i && r[1] !== void 0 && q(r[1], void 0, "AAD");
		let a = t(n, ...r), o = (e, t) => {
			if (t !== void 0) {
				if (e !== 2) throw Error("cipher output not supported");
				q(t, void 0, "output");
			}
		}, s = !1;
		return {
			encrypt(e, t) {
				if (s) throw Error("cannot encrypt() twice with same key + nonce");
				return s = !0, q(e), o(a.encrypt.length, t), a.encrypt(e, t);
			},
			decrypt(e, t) {
				if (q(e), i && e.length < i) throw Error("\"ciphertext\" expected length bigger than tagLength=" + i);
				return o(a.decrypt.length, t), a.decrypt(e, t);
			}
		};
	}
	return Object.assign(n, e), n;
};
function Tn(e, t, n = !0) {
	if (t === void 0) return new Uint8Array(e);
	if (t.length !== e) throw Error("\"output\" expected Uint8Array of length " + e + ", got: " + t.length);
	if (n && !En(t)) throw Error("invalid output, must be aligned");
	return t;
}
function En(e) {
	return e.byteOffset % 4 == 0;
}
function Dn(e) {
	return Uint8Array.from(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/aes.js
var On = 16, kn = 283;
function An(e) {
	if (![
		16,
		24,
		32
	].includes(e.length)) throw Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + e.length);
}
function jn(e) {
	return e << 1 ^ kn & -(e >> 7);
}
function Mn(e, t) {
	let n = 0;
	for (; t > 0; t >>= 1) n ^= e & -(t & 1), e = jn(e);
	return n;
}
var Nn = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(256);
	for (let t = 0, n = 1; t < 256; t++, n ^= jn(n)) e[t] = n;
	let t = /* @__PURE__ */ new Uint8Array(256);
	t[0] = 99;
	for (let n = 0; n < 255; n++) {
		let r = e[255 - n];
		r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
	}
	return vn(e), t;
})(), Pn = /* @__PURE__ */ Nn.map((e, t) => Nn.indexOf(t)), Fn = (e) => e << 24 | e >>> 8, In = (e) => e << 8 | e >>> 24;
function Ln(e, t) {
	if (e.length !== 256) throw Error("Wrong sbox length");
	let n = (/* @__PURE__ */ new Uint32Array(256)).map((n, r) => t(e[r])), r = n.map(In), i = r.map(In), a = i.map(In), o = /* @__PURE__ */ new Uint32Array(65536), s = /* @__PURE__ */ new Uint32Array(65536), c = /* @__PURE__ */ new Uint16Array(65536);
	for (let t = 0; t < 256; t++) for (let l = 0; l < 256; l++) {
		let u = t * 256 + l;
		o[u] = n[t] ^ r[l], s[u] = i[t] ^ a[l], c[u] = e[t] << 8 | e[l];
	}
	return {
		sbox: e,
		sbox2: c,
		T0: n,
		T1: r,
		T2: i,
		T3: a,
		T01: o,
		T23: s
	};
}
var Rn = /* @__PURE__ */ Ln(Nn, (e) => Mn(e, 3) << 24 | e << 16 | e << 8 | Mn(e, 2)), zn = /* @__PURE__ */ Ln(Pn, (e) => Mn(e, 11) << 24 | Mn(e, 13) << 16 | Mn(e, 9) << 8 | Mn(e, 14)), Bn = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(16);
	for (let t = 0, n = 1; t < 16; t++, n = jn(n)) e[t] = n;
	return e;
})();
function Vn(e) {
	q(e);
	let t = e.length;
	An(e);
	let { sbox2: n } = Rn, r = [];
	En(e) || r.push(e = Dn(e));
	let i = J(e), a = i.length, o = (e) => Wn(n, e, e, e, e), s = new Uint32Array(t + 28);
	s.set(i);
	for (let e = a; e < s.length; e++) {
		let t = s[e - 1];
		e % a === 0 ? t = o(Fn(t)) ^ Bn[e / a - 1] : a > 6 && e % a === 4 && (t = o(t)), s[e] = s[e - a] ^ t;
	}
	return vn(...r), s;
}
function Hn(e) {
	let t = Vn(e), n = t.slice(), r = t.length, { sbox2: i } = Rn, { T0: a, T1: o, T2: s, T3: c } = zn;
	for (let e = 0; e < r; e += 4) for (let i = 0; i < 4; i++) n[e + i] = t[r - e - 4 + i];
	vn(t);
	for (let e = 4; e < r - 4; e++) {
		let t = n[e], r = Wn(i, t, t, t, t);
		n[e] = a[r & 255] ^ o[r >>> 8 & 255] ^ s[r >>> 16 & 255] ^ c[r >>> 24];
	}
	return n;
}
function Un(e, t, n, r, i, a) {
	return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | a >>> 24 & 255];
}
function Wn(e, t, n, r, i) {
	return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function Gn(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = Rn, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ Un(o, s, t, n, r, i), l = e[c++] ^ Un(o, s, n, r, i, t), u = e[c++] ^ Un(o, s, r, i, t, n), d = e[c++] ^ Un(o, s, i, t, n, r);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ Wn(a, t, n, r, i),
		s1: e[c++] ^ Wn(a, n, r, i, t),
		s2: e[c++] ^ Wn(a, r, i, t, n),
		s3: e[c++] ^ Wn(a, i, t, n, r)
	};
}
function Kn(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = zn, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ Un(o, s, t, i, r, n), l = e[c++] ^ Un(o, s, n, t, i, r), u = e[c++] ^ Un(o, s, r, n, t, i), d = e[c++] ^ Un(o, s, i, r, n, t);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ Wn(a, t, i, r, n),
		s1: e[c++] ^ Wn(a, n, t, i, r),
		s2: e[c++] ^ Wn(a, r, n, t, i),
		s3: e[c++] ^ Wn(a, i, r, n, t)
	};
}
function qn(e) {
	if (q(e), e.length % On !== 0) throw Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function Jn(e, t, n) {
	q(e);
	let r = e.length, i = r % On;
	if (!t && i !== 0) throw Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	En(e) || (e = Dn(e));
	let a = J(e);
	if (t) {
		let e = On - i;
		e ||= On, r += e;
	}
	return n = Tn(r, n), xn(e, n), {
		b: a,
		o: J(n),
		out: n
	};
}
function Yn(e, t) {
	if (!t) return e;
	let n = e.length;
	if (!n) throw Error("aes/pcks5: empty ciphertext not allowed");
	let r = e[n - 1];
	if (r <= 0 || r > 16) throw Error("aes/pcks5: wrong padding");
	let i = e.subarray(0, -r);
	for (let t = 0; t < r; t++) if (e[n - t - 1] !== r) throw Error("aes/pcks5: wrong padding");
	return i;
}
function Xn(e) {
	let t = /* @__PURE__ */ new Uint8Array(16), n = J(t);
	t.set(e);
	let r = On - e.length;
	for (let e = On - r; e < On; e++) t[e] = r;
	return n;
}
var Zn = /* @__PURE__ */ wn({
	blockSize: 16,
	nonceLength: 16
}, function(e, t, n = {}) {
	let r = !n.disablePadding;
	return {
		encrypt(n, i) {
			let a = Vn(e), { b: o, o: s, out: c } = Jn(n, r, i), l = t, u = [a];
			En(l) || u.push(l = Dn(l));
			let d = J(l), f = d[0], p = d[1], m = d[2], h = d[3], g = 0;
			for (; g + 4 <= o.length;) f ^= o[g + 0], p ^= o[g + 1], m ^= o[g + 2], h ^= o[g + 3], {s0: f, s1: p, s2: m, s3: h} = Gn(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			if (r) {
				let e = Xn(n.subarray(g * 4));
				f ^= e[0], p ^= e[1], m ^= e[2], h ^= e[3], {s0: f, s1: p, s2: m, s3: h} = Gn(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			}
			return vn(...u), c;
		},
		decrypt(n, i) {
			qn(n);
			let a = Hn(e), o = t, s = [a];
			En(o) || s.push(o = Dn(o));
			let c = J(o);
			i = Tn(n.length, i), En(n) || s.push(n = Dn(n)), xn(n, i);
			let l = J(n), u = J(i), d = c[0], f = c[1], p = c[2], m = c[3];
			for (let e = 0; e + 4 <= l.length;) {
				let t = d, n = f, r = p, i = m;
				d = l[e + 0], f = l[e + 1], p = l[e + 2], m = l[e + 3];
				let { s0: o, s1: s, s2: c, s3: h } = Kn(a, d, f, p, m);
				u[e++] = o ^ t, u[e++] = s ^ n, u[e++] = c ^ r, u[e++] = h ^ i;
			}
			return vn(...s), Yn(i, r);
		}
	};
}), Qn = (e) => Uint8Array.from(e.split(""), (e) => e.charCodeAt(0)), $n = Qn("expand 16-byte k"), er = Qn("expand 32-byte k"), tr = J($n), nr = J(er);
function Y(e, t) {
	return e << t | e >>> 32 - t;
}
function rr(e) {
	return e.byteOffset % 4 == 0;
}
var ir = 64, ar = 16, or = 2 ** 32 - 1, sr = Uint32Array.of();
function cr(e, t, n, r, i, a, o, s) {
	let c = i.length, l = new Uint8Array(ir), u = J(l), d = rr(i) && rr(a), f = d ? J(i) : sr, p = d ? J(a) : sr;
	for (let m = 0; m < c; o++) {
		if (e(t, n, r, u, o, s), o >= or) throw Error("arx: counter overflow");
		let h = Math.min(ir, c - m);
		if (d && h === ir) {
			let e = m / 4;
			if (m % 4 != 0) throw Error("arx: invalid block position");
			for (let t = 0, n; t < ar; t++) n = e + t, p[n] = f[n] ^ u[t];
			m += ir;
		} else {
			for (let e = 0, t; e < h; e++) t = m + e, a[t] = i[t] ^ l[e];
			m += h;
		}
	}
}
function lr(e, t) {
	let { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: a, rounds: o } = Sn({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, t);
	if (typeof e != "function") throw Error("core must be a function");
	return hn(i), hn(o), mn(a), mn(n), (t, s, c, l, u = 0) => {
		q(t, void 0, "key"), q(s, void 0, "nonce"), q(c, void 0, "data");
		let d = c.length;
		if (l === void 0 && (l = new Uint8Array(d)), q(l, void 0, "output"), hn(u), u < 0 || u >= or) throw Error("arx: counter overflow");
		if (l.length < d) throw Error(`arx: output (${l.length}) is shorter than data (${d})`);
		let f = [], p = t.length, m, h;
		if (p === 32) f.push(m = Dn(t)), h = nr;
		else if (p === 16 && n) m = /* @__PURE__ */ new Uint8Array(32), m.set(t), m.set(t, 16), h = tr, f.push(m);
		else throw q(t, 32, "arx key"), Error("invalid key size");
		rr(s) || f.push(s = Dn(s));
		let g = J(m);
		if (r) {
			if (s.length !== 24) throw Error("arx: extended nonce must be 24 bytes");
			r(h, g, J(s.subarray(0, 16)), g), s = s.subarray(16);
		}
		let _ = 16 - i;
		if (_ !== s.length) throw Error(`arx: nonce must be ${_} or 16 bytes`);
		if (_ !== 12) {
			let e = /* @__PURE__ */ new Uint8Array(12);
			e.set(s, a ? 0 : 12 - s.length), s = e, f.push(s);
		}
		let v = J(s);
		return cr(e, h, g, v, c, l, u, o), vn(...f), l;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/_poly1305.js
function X(e, t) {
	return e[t++] & 255 | (e[t++] & 255) << 8;
}
var ur = class {
	blockLen = 16;
	outputLen = 16;
	buffer = /* @__PURE__ */ new Uint8Array(16);
	r = /* @__PURE__ */ new Uint16Array(10);
	h = /* @__PURE__ */ new Uint16Array(10);
	pad = /* @__PURE__ */ new Uint16Array(8);
	pos = 0;
	finished = !1;
	constructor(e) {
		e = Dn(q(e, 32, "key"));
		let t = X(e, 0), n = X(e, 2), r = X(e, 4), i = X(e, 6), a = X(e, 8), o = X(e, 10), s = X(e, 12), c = X(e, 14);
		this.r[0] = t & 8191, this.r[1] = (t >>> 13 | n << 3) & 8191, this.r[2] = (n >>> 10 | r << 6) & 7939, this.r[3] = (r >>> 7 | i << 9) & 8191, this.r[4] = (i >>> 4 | a << 12) & 255, this.r[5] = a >>> 1 & 8190, this.r[6] = (a >>> 14 | o << 2) & 8191, this.r[7] = (o >>> 11 | s << 5) & 8065, this.r[8] = (s >>> 8 | c << 8) & 8191, this.r[9] = c >>> 5 & 127;
		for (let t = 0; t < 8; t++) this.pad[t] = X(e, 16 + 2 * t);
	}
	process(e, t, n = !1) {
		let r = n ? 0 : 2048, { h: i, r: a } = this, o = a[0], s = a[1], c = a[2], l = a[3], u = a[4], d = a[5], f = a[6], p = a[7], m = a[8], h = a[9], g = X(e, t + 0), _ = X(e, t + 2), v = X(e, t + 4), y = X(e, t + 6), ee = X(e, t + 8), b = X(e, t + 10), x = X(e, t + 12), S = X(e, t + 14), C = i[0] + (g & 8191), w = i[1] + ((g >>> 13 | _ << 3) & 8191), T = i[2] + ((_ >>> 10 | v << 6) & 8191), E = i[3] + ((v >>> 7 | y << 9) & 8191), D = i[4] + ((y >>> 4 | ee << 12) & 8191), O = i[5] + (ee >>> 1 & 8191), k = i[6] + ((ee >>> 14 | b << 2) & 8191), A = i[7] + ((b >>> 11 | x << 5) & 8191), j = i[8] + ((x >>> 8 | S << 8) & 8191), M = i[9] + (S >>> 5 | r), N = 0, P = N + C * o + 5 * h * w + 5 * m * T + 5 * p * E + 5 * f * D;
		N = P >>> 13, P &= 8191, P += 5 * d * O + 5 * u * k + 5 * l * A + 5 * c * j + 5 * s * M, N += P >>> 13, P &= 8191;
		let F = N + C * s + w * o + 5 * h * T + 5 * m * E + 5 * p * D;
		N = F >>> 13, F &= 8191, F += 5 * f * O + 5 * d * k + 5 * u * A + 5 * l * j + 5 * c * M, N += F >>> 13, F &= 8191;
		let I = N + C * c + w * s + T * o + 5 * h * E + 5 * m * D;
		N = I >>> 13, I &= 8191, I += 5 * p * O + 5 * f * k + 5 * d * A + 5 * u * j + 5 * l * M, N += I >>> 13, I &= 8191;
		let L = N + C * l + w * c + T * s + E * o + 5 * h * D;
		N = L >>> 13, L &= 8191, L += 5 * m * O + 5 * p * k + 5 * f * A + 5 * d * j + 5 * u * M, N += L >>> 13, L &= 8191;
		let te = N + C * u + w * l + T * c + E * s + D * o;
		N = te >>> 13, te &= 8191, te += 5 * h * O + 5 * m * k + 5 * p * A + 5 * f * j + 5 * d * M, N += te >>> 13, te &= 8191;
		let ne = N + C * d + w * u + T * l + E * c + D * s;
		N = ne >>> 13, ne &= 8191, ne += O * o + 5 * h * k + 5 * m * A + 5 * p * j + 5 * f * M, N += ne >>> 13, ne &= 8191;
		let R = N + C * f + w * d + T * u + E * l + D * c;
		N = R >>> 13, R &= 8191, R += O * s + k * o + 5 * h * A + 5 * m * j + 5 * p * M, N += R >>> 13, R &= 8191;
		let re = N + C * p + w * f + T * d + E * u + D * l;
		N = re >>> 13, re &= 8191, re += O * c + k * s + A * o + 5 * h * j + 5 * m * M, N += re >>> 13, re &= 8191;
		let ie = N + C * m + w * p + T * f + E * d + D * u;
		N = ie >>> 13, ie &= 8191, ie += O * l + k * c + A * s + j * o + 5 * h * M, N += ie >>> 13, ie &= 8191;
		let ae = N + C * h + w * m + T * p + E * f + D * d;
		N = ae >>> 13, ae &= 8191, ae += O * u + k * l + A * c + j * s + M * o, N += ae >>> 13, ae &= 8191, N = (N << 2) + N | 0, N = N + P | 0, P = N & 8191, N >>>= 13, F += N, i[0] = P, i[1] = F, i[2] = I, i[3] = L, i[4] = te, i[5] = ne, i[6] = R, i[7] = re, i[8] = ie, i[9] = ae;
	}
	finalize() {
		let { h: e, pad: t } = this, n = /* @__PURE__ */ new Uint16Array(10), r = e[1] >>> 13;
		e[1] &= 8191;
		for (let t = 2; t < 10; t++) e[t] += r, r = e[t] >>> 13, e[t] &= 8191;
		e[0] += r * 5, r = e[0] >>> 13, e[0] &= 8191, e[1] += r, r = e[1] >>> 13, e[1] &= 8191, e[2] += r, n[0] = e[0] + 5, r = n[0] >>> 13, n[0] &= 8191;
		for (let t = 1; t < 10; t++) n[t] = e[t] + r, r = n[t] >>> 13, n[t] &= 8191;
		n[9] -= 8192;
		let i = (r ^ 1) - 1;
		for (let e = 0; e < 10; e++) n[e] &= i;
		i = ~i;
		for (let t = 0; t < 10; t++) e[t] = e[t] & i | n[t];
		e[0] = (e[0] | e[1] << 13) & 65535, e[1] = (e[1] >>> 3 | e[2] << 10) & 65535, e[2] = (e[2] >>> 6 | e[3] << 7) & 65535, e[3] = (e[3] >>> 9 | e[4] << 4) & 65535, e[4] = (e[4] >>> 12 | e[5] << 1 | e[6] << 14) & 65535, e[5] = (e[6] >>> 2 | e[7] << 11) & 65535, e[6] = (e[7] >>> 5 | e[8] << 8) & 65535, e[7] = (e[8] >>> 8 | e[9] << 5) & 65535;
		let a = e[0] + t[0];
		e[0] = a & 65535;
		for (let n = 1; n < 8; n++) a = (e[n] + t[n] | 0) + (a >>> 16) | 0, e[n] = a & 65535;
		vn(n);
	}
	update(e) {
		gn(this), q(e), e = Dn(e);
		let { buffer: t, blockLen: n } = this, r = e.length;
		for (let i = 0; i < r;) {
			let a = Math.min(n - this.pos, r - i);
			if (a === n) for (; n <= r - i; i += n) this.process(e, i);
			else t.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === n && (this.process(t, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		vn(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		gn(this), _n(e, this), this.finished = !0;
		let { buffer: t, h: n } = this, { pos: r } = this;
		if (r) {
			for (t[r++] = 1; r < 16; r++) t[r] = 0;
			this.process(t, 0, !0);
		}
		this.finalize();
		let i = 0;
		for (let t = 0; t < 8; t++) e[i++] = n[t] >>> 0, e[i++] = n[t] >>> 8;
		return e;
	}
	digest() {
		let { buffer: e, outputLen: t } = this;
		this.digestInto(e);
		let n = e.slice(0, t);
		return this.destroy(), n;
	}
};
function dr(e) {
	let t = (t, n) => e(n).update(t).digest(), n = e(/* @__PURE__ */ new Uint8Array(32));
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
}
dr((e) => new ur(e));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/chacha.js
function fr(e, t, n, r, i, a = 20) {
	let o = e[0], s = e[1], c = e[2], l = e[3], u = t[0], d = t[1], f = t[2], p = t[3], m = t[4], h = t[5], g = t[6], _ = t[7], v = i, y = n[0], ee = n[1], b = n[2], x = o, S = s, C = c, w = l, T = u, E = d, D = f, O = p, k = m, A = h, j = g, M = _, N = v, P = y, F = ee, I = b;
	for (let e = 0; e < a; e += 2) x = x + T | 0, N = Y(N ^ x, 16), k = k + N | 0, T = Y(T ^ k, 12), x = x + T | 0, N = Y(N ^ x, 8), k = k + N | 0, T = Y(T ^ k, 7), S = S + E | 0, P = Y(P ^ S, 16), A = A + P | 0, E = Y(E ^ A, 12), S = S + E | 0, P = Y(P ^ S, 8), A = A + P | 0, E = Y(E ^ A, 7), C = C + D | 0, F = Y(F ^ C, 16), j = j + F | 0, D = Y(D ^ j, 12), C = C + D | 0, F = Y(F ^ C, 8), j = j + F | 0, D = Y(D ^ j, 7), w = w + O | 0, I = Y(I ^ w, 16), M = M + I | 0, O = Y(O ^ M, 12), w = w + O | 0, I = Y(I ^ w, 8), M = M + I | 0, O = Y(O ^ M, 7), x = x + E | 0, I = Y(I ^ x, 16), j = j + I | 0, E = Y(E ^ j, 12), x = x + E | 0, I = Y(I ^ x, 8), j = j + I | 0, E = Y(E ^ j, 7), S = S + D | 0, N = Y(N ^ S, 16), M = M + N | 0, D = Y(D ^ M, 12), S = S + D | 0, N = Y(N ^ S, 8), M = M + N | 0, D = Y(D ^ M, 7), C = C + O | 0, P = Y(P ^ C, 16), k = k + P | 0, O = Y(O ^ k, 12), C = C + O | 0, P = Y(P ^ C, 8), k = k + P | 0, O = Y(O ^ k, 7), w = w + T | 0, F = Y(F ^ w, 16), A = A + F | 0, T = Y(T ^ A, 12), w = w + T | 0, F = Y(F ^ w, 8), A = A + F | 0, T = Y(T ^ A, 7);
	let L = 0;
	r[L++] = o + x | 0, r[L++] = s + S | 0, r[L++] = c + C | 0, r[L++] = l + w | 0, r[L++] = u + T | 0, r[L++] = d + E | 0, r[L++] = f + D | 0, r[L++] = p + O | 0, r[L++] = m + k | 0, r[L++] = h + A | 0, r[L++] = g + j | 0, r[L++] = _ + M | 0, r[L++] = v + N | 0, r[L++] = y + P | 0, r[L++] = ee + F | 0, r[L++] = b + I | 0;
}
var pr = /* @__PURE__ */ lr(fr, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hkdf.js
function mr(e, t, n) {
	return u(e), n === void 0 && (n = new Uint8Array(e.outputLen)), at(e, n, t);
}
var hr = /* @__PURE__ */ Uint8Array.of(0), gr = /* @__PURE__ */ Uint8Array.of();
function _r(e, t, n, r = 32) {
	u(e), c(r, "length");
	let i = e.outputLen;
	if (r > 255 * i) throw Error("Length must be <= 255*HashLen");
	let a = Math.ceil(r / i);
	n === void 0 ? n = gr : l(n, void 0, "info");
	let o = new Uint8Array(a * i), s = at.create(e, t), d = s._cloneInto(), f = new Uint8Array(s.outputLen);
	for (let e = 0; e < a; e++) hr[0] = e + 1, d.update(e === 0 ? gr : f).update(n).update(hr).digestInto(f), o.set(f, i * e), s._cloneInto(d);
	return s.destroy(), d.destroy(), p(f, hr), o.slice(0, r);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/index.js
var vr = Object.defineProperty, Z = (e, t) => {
	for (var n in t) vr(e, n, {
		get: t[n],
		enumerable: !0
	});
};
Z({}, {
	binarySearch: () => Cr,
	bytesToHex: () => v,
	hexToBytes: () => b,
	insertEventIntoAscendingList: () => Sr,
	insertEventIntoDescendingList: () => xr,
	isHex32: () => $,
	mergeReverseSortedLists: () => wr,
	normalizeURL: () => br,
	utf8Decoder: () => yr,
	utf8Encoder: () => Q
});
var yr = new TextDecoder("utf-8"), Q = new TextEncoder();
function br(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function xr(e, t) {
	let [n, r] = Cr(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : e.created_at - t.created_at);
	return r || e.splice(n, 0, t), e;
}
function Sr(e, t) {
	let [n, r] = Cr(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : t.created_at - e.created_at);
	return r || e.splice(n, 0, t), e;
}
function Cr(e, t) {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = t(e[i]);
		if (a === 0) return [i, !0];
		a < 0 ? r = i - 1 : n = i + 1;
	}
	return [n, !1];
}
function wr(e, t) {
	let n = Array(e.length + t.length);
	n.length = 0;
	let r = 0, i = 0, a = [];
	for (; r < e.length && i < t.length;) {
		let o;
		if (e[r]?.created_at > t[i]?.created_at ? (o = e[r], r++) : (o = t[i], i++), n.length > 0 && n[n.length - 1].created_at === o.created_at) {
			if (a.includes(o.id)) continue;
		} else a.length = 0;
		n.push(o), a.push(o.id);
	}
	for (; r < e.length;) {
		let t = e[r];
		if (r++, n.length > 0 && n[n.length - 1].created_at === t.created_at) {
			if (a.includes(t.id)) continue;
		} else a.length = 0;
		n.push(t), a.push(t.id);
	}
	for (; i < t.length;) {
		let e = t[i];
		if (i++, n.length > 0 && n[n.length - 1].created_at === e.created_at) {
			if (a.includes(e.id)) continue;
		} else a.length = 0;
		n.push(e), a.push(e.id);
	}
	return n;
}
function $(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var Tr = Symbol("verified"), Er = (e) => e instanceof Object;
function Dr(e) {
	if (!Er(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !$(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var Or = class {
	generateSecretKey() {
		return Bt.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return v(Bt.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = v(Bt.getPublicKey(t)), n.id = Ar(n), n.sig = v(Bt.sign(b(Ar(n)), t)), n[Tr] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[Tr] == "boolean") return e[Tr];
		try {
			let t = Ar(e);
			if (t !== e.id) return e[Tr] = !1, !1;
			let n = Bt.verify(b(e.sig), b(t), b(e.pubkey));
			return e[Tr] = n, n;
		} catch {
			return e[Tr] = !1, !1;
		}
	}
};
function kr(e) {
	if (!Dr(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function Ar(e) {
	return v(N(Q.encode(kr(e))));
}
var jr = new Or(), Mr = jr.generateSecretKey, Nr = jr.getPublicKey, Pr = jr.finalizeEvent, Fr = jr.verifyEvent;
Z({}, {
	AIEmbeddings: () => Gi,
	AppCurationSet: () => Ao,
	Application: () => Oo,
	AuthoredPodcasts: () => Ga,
	BadgeAward: () => Xr,
	BadgeDefinition: () => go,
	Bid: () => yi,
	BidConfirmation: () => bi,
	BlobsAuth: () => ao,
	BlockedRelaysList: () => Da,
	BlossomServerList: () => Ba,
	BookmarkList: () => wa,
	Bookmarksets: () => uo,
	Calendar: () => qo,
	CalendarEventRSVP: () => Jo,
	CashuMintAnnouncement: () => as,
	CashuWalletEvent: () => $a,
	CashuWalletHistory: () => ra,
	CashuWalletTokens: () => na,
	ChannelCreation: () => ui,
	ChannelHideMessage: () => pi,
	ChannelMessage: () => fi,
	ChannelMetadata: () => di,
	ChannelMuteUser: () => mi,
	ChatMessage: () => Zr,
	Chess: () => gi,
	ClassifiedListing: () => Io,
	ClientAuth: () => to,
	CodeSnippet: () => Ai,
	CoinjoinPool: () => Ji,
	Comment: () => Ti,
	CommunitiesList: () => Ta,
	CommunityDefinition: () => ts,
	CommunityPostApproval: () => Zi,
	ConferenceEvent: () => No,
	Contacts: () => Gr,
	CreateOrUpdateProduct: () => yo,
	CreateOrUpdateStall: () => vo,
	CuratedVideoSets: () => po,
	Curationsets: () => fo,
	Date: () => Go,
	DecoupledEncryptionKeyDistribution: () => Xi,
	DecoupledKeyAnnouncement: () => La,
	DecoupledKeyClientAnnouncement: () => Yi,
	DirectMessageRelaysList: () => Ra,
	DraftClassifiedListing: () => Lo,
	DraftEvent: () => Ho,
	DraftLong: () => Co,
	Emojisets: () => wo,
	EncryptedDirectMessage: () => Kr,
	EventDeletion: () => qr,
	FavoriteFollowSets: () => Fa,
	FavoritePodcasts: () => za,
	FavoriteRelays: () => Aa,
	FedimintAnnouncement: () => os,
	Feed: () => Wo,
	FileMessage: () => ri,
	FileMetadata: () => Ci,
	FileServerPreference: () => Va,
	Followsets: () => so,
	ForumThread: () => $r,
	GenericRepost: () => ii,
	Genericlists: () => co,
	GeocacheListing: () => rs,
	GeocacheLog: () => ia,
	GeocacheLogEntry: () => is,
	GeocacheProofOfFind: () => aa,
	GiftWrap: () => Si,
	GitPullRequest: () => Mi,
	GitPullRequestUpdate: () => Ni,
	GoodWikiAuthorList: () => Ha,
	GoodWikiRelayList: () => Ua,
	GroupMetadata: () => cs,
	HTTPAuth: () => oo,
	Handlerinformation: () => Zo,
	Handlerrecommendation: () => Xo,
	Highlights: () => ba,
	InteractiveRoom: () => Mo,
	InterestsList: () => Ma,
	Interestsets: () => _o,
	Issue: () => Pi,
	JobFeedback: () => ea,
	JobRequest: () => Qi,
	JobResult: () => $i,
	Label: () => Ui,
	LegacyNsiteFile: () => $o,
	LightningPubRPC: () => eo,
	LinkSet: () => Uo,
	LiveChatMessage: () => ki,
	LiveEvent: () => jo,
	LongFormArticle: () => So,
	MarketplaceUI: () => bo,
	MediaFollows: () => Pa,
	MediaStarterPacks: () => ms,
	MergeRequests: () => _i,
	Metadata: () => Hr,
	ModularArticleContent: () => Eo,
	ModularArticleHeader: () => To,
	MuteSets: () => mo,
	Mutelist: () => xa,
	NWCWalletInfo: () => Za,
	NWCWalletRequest: () => no,
	NWCWalletResponse: () => ro,
	NormalVideo: () => si,
	NostrConnect: () => io,
	NsiteNamed: () => ns,
	NsiteRoot: () => Qa,
	NutZap: () => ga,
	NutZapInfo: () => Na,
	OpenTimestamps: () => xi,
	Patch: () => ji,
	PeerToPeerOrderEvents: () => ss,
	Photo: () => oi,
	Pinlist: () => Sa,
	PodcastEpisode: () => hi,
	PodcastMetadata: () => Wa,
	Poll: () => wi,
	PollResponse: () => vi,
	PrivateDirectMessage: () => ni,
	PrivateEventRelayList: () => ja,
	ProblemTracker: () => Bi,
	ProductSoldAsAuction: () => xo,
	ProfileBadges: () => ho,
	ProxyAnnouncement: () => Ya,
	PublicChatsList: () => Ea,
	PublicMessage: () => li,
	Reaction: () => Yr,
	ReactionToWebsite: () => ai,
	RecommendRelay: () => Wr,
	Redirects: () => Vo,
	RelayDiscovery: () => ko,
	RelayList: () => Ca,
	RelayMonitorAnnouncement: () => Ka,
	RelayReview: () => Yo,
	RelayReviews: () => Wi,
	Relaysets: () => lo,
	ReleaseArtifactSets: () => Do,
	Reply: () => Fi,
	Report: () => Vi,
	Reporting: () => Hi,
	RepositoryAnnouncement: () => Ro,
	RepositoryState: () => zo,
	Repost: () => Jr,
	ReservedCashuWalletTokens: () => ta,
	RoomPresence: () => qa,
	Scroll: () => Di,
	Seal: () => ti,
	SearchRelaysList: () => Oa,
	ShortTextNote: () => Ur,
	ShortVideo: () => ci,
	SimpleGroupAdmins: () => ls,
	SimpleGroupCreateGroup: () => ua,
	SimpleGroupCreateInvite: () => fa,
	SimpleGroupDeleteEvent: () => la,
	SimpleGroupDeleteGroup: () => da,
	SimpleGroupEditMetadata: () => ca,
	SimpleGroupJoinRequest: () => pa,
	SimpleGroupLeaveRequest: () => ma,
	SimpleGroupList: () => ka,
	SimpleGroupLiveKitParticipants: () => fs,
	SimpleGroupMembers: () => us,
	SimpleGroupPutUser: () => oa,
	SimpleGroupRemoveUser: () => sa,
	SimpleGroupReply: () => ei,
	SimpleGroupRoles: () => ds,
	SimpleGroupThreadedReply: () => Qr,
	SlideSet: () => Fo,
	SoftwareApplication: () => Qo,
	StarterPacks: () => ps,
	StatusApplied: () => Li,
	StatusClosed: () => Ri,
	StatusDraft: () => zi,
	StatusOpen: () => Ii,
	TidalLogin: () => _a,
	Time: () => Ko,
	Torrent: () => Ki,
	TorrentComment: () => qi,
	TransportMethodAnnouncement: () => Xa,
	UserEmojiList: () => Ia,
	UserGraspList: () => Ja,
	UserStatuses: () => Po,
	VideoViewEvent: () => es,
	Voice: () => Ei,
	VoiceComment: () => Oi,
	WebBookmarks: () => hs,
	WikiArticle: () => Bo,
	Zap: () => ya,
	ZapGoal: () => ha,
	ZapRequest: () => va,
	classifyKind: () => Br,
	isAddressableKind: () => zr,
	isEphemeralKind: () => Rr,
	isKind: () => Vr,
	isRegularKind: () => Ir,
	isReplaceableKind: () => Lr
});
function Ir(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function Lr(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function Rr(e) {
	return 2e4 <= e && e < 3e4;
}
function zr(e) {
	return 3e4 <= e && e < 4e4;
}
function Br(e) {
	return Ir(e) ? "regular" : Lr(e) ? "replaceable" : Rr(e) ? "ephemeral" : zr(e) ? "parameterized" : "unknown";
}
function Vr(e, t) {
	let n = t instanceof Array ? t : [t];
	return Dr(e) && n.includes(e.kind) || !1;
}
var Hr = 0, Ur = 1, Wr = 2, Gr = 3, Kr = 4, qr = 5, Jr = 6, Yr = 7, Xr = 8, Zr = 9, Qr = 10, $r = 11, ei = 12, ti = 13, ni = 14, ri = 15, ii = 16, ai = 17, oi = 20, si = 21, ci = 22, li = 24, ui = 40, di = 41, fi = 42, pi = 43, mi = 44, hi = 54, gi = 64, _i = 818, vi = 1018, yi = 1021, bi = 1022, xi = 1040, Si = 1059, Ci = 1063, wi = 1068, Ti = 1111, Ei = 1222, Di = 1227, Oi = 1244, ki = 1311, Ai = 1337, ji = 1617, Mi = 1618, Ni = 1619, Pi = 1621, Fi = 1622, Ii = 1630, Li = 1631, Ri = 1632, zi = 1633, Bi = 1971, Vi = 1984, Hi = 1984, Ui = 1985, Wi = 1986, Gi = 1987, Ki = 2003, qi = 2004, Ji = 2022, Yi = 4454, Xi = 4455, Zi = 4550, Qi = 5999, $i = 6999, ea = 7e3, ta = 7374, na = 7375, ra = 7376, ia = 7516, aa = 7517, oa = 9e3, sa = 9001, ca = 9002, la = 9005, ua = 9007, da = 9008, fa = 9009, pa = 9021, ma = 9022, ha = 9041, ga = 9321, _a = 9467, va = 9734, ya = 9735, ba = 9802, xa = 1e4, Sa = 10001, Ca = 10002, wa = 10003, Ta = 10004, Ea = 10005, Da = 10006, Oa = 10007, ka = 10009, Aa = 10012, ja = 10013, Ma = 10015, Na = 10019, Pa = 10020, Fa = 10021, Ia = 10030, La = 10044, Ra = 10050, za = 10054, Ba = 10063, Va = 10096, Ha = 10101, Ua = 10102, Wa = 10154, Ga = 10164, Ka = 10166, qa = 10312, Ja = 10317, Ya = 10377, Xa = 11111, Za = 13194, Qa = 15128, $a = 17375, eo = 21e3, to = 22242, no = 23194, ro = 23195, io = 24133, ao = 24242, oo = 27235, so = 3e4, co = 30001, lo = 30002, uo = 30003, fo = 30004, po = 30005, mo = 30007, ho = 30008, go = 30009, _o = 30015, vo = 30017, yo = 30018, bo = 30019, xo = 30020, So = 30023, Co = 30024, wo = 30030, To = 30040, Eo = 30041, Do = 30063, Oo = 30078, ko = 30166, Ao = 30267, jo = 30311, Mo = 30312, No = 30313, Po = 30315, Fo = 30388, Io = 30402, Lo = 30403, Ro = 30617, zo = 30618, Bo = 30818, Vo = 30819, Ho = 31234, Uo = 31388, Wo = 31890, Go = 31922, Ko = 31923, qo = 31924, Jo = 31925, Yo = 31987, Xo = 31989, Zo = 31990, Qo = 32267, $o = 34128, es = 34237, ts = 34550, ns = 35128, rs = 37515, is = 37516, as = 38172, os = 38173, ss = 38383, cs = 39e3, ls = 39001, us = 39002, ds = 39003, fs = 39004, ps = 39089, ms = 39092, hs = 39701;
Z({}, {
	getHex64: () => gs,
	getInt: () => _s,
	getSubscriptionId: () => vs,
	matchEventId: () => ys,
	matchEventKind: () => xs,
	matchEventPubkey: () => bs
});
function gs(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function _s(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function vs(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function ys(e, t) {
	return t === gs(e, "id");
}
function bs(e, t) {
	return t === gs(e, "pubkey");
}
function xs(e, t) {
	return t === _s(e, "kind");
}
Z({}, { makeAuthEvent: () => Ss });
function Ss(e, t) {
	return {
		kind: to,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
new TextEncoder();
var Cs = {};
Z(Cs, {
	BECH32_REGEX: () => Es,
	Bech32MaxSize: () => Ts,
	NostrTypeGuard: () => ws,
	decode: () => ks,
	decodeNostrURI: () => Os,
	encodeBytes: () => Fs,
	naddrEncode: () => Rs,
	neventEncode: () => Ls,
	noteEncode: () => Ns,
	nprofileEncode: () => Is,
	npubEncode: () => Ms,
	nsecEncode: () => js
});
var ws = {
	isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
	isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
	isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
	isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
	isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
	isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
	isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Ts = 5e3, Es = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Ds(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function Os(e) {
	try {
		return e.startsWith("nostr:") && (e = e.substring(6)), ks(e);
	} catch {
		return {
			type: "invalid",
			data: null
		};
	}
}
function ks(e) {
	let { prefix: t, words: n } = fn.decode(e, Ts), r = new Uint8Array(fn.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = As(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nprofile");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: v(e[0][0]),
					relays: e[1] ? e[1].map((e) => yr.decode(e)) : []
				}
			};
		}
		case "nevent": {
			let e = As(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nevent");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			if (e[2] && e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (e[3] && e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "nevent",
				data: {
					id: v(e[0][0]),
					relays: e[1] ? e[1].map((e) => yr.decode(e)) : [],
					author: e[2]?.[0] ? v(e[2][0]) : void 0,
					kind: e[3]?.[0] ? parseInt(v(e[3][0]), 16) : void 0
				}
			};
		}
		case "naddr": {
			let e = As(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for naddr");
			if (!e[2]?.[0]) throw Error("missing TLV 2 for naddr");
			if (e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (!e[3]?.[0]) throw Error("missing TLV 3 for naddr");
			if (e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: yr.decode(e[0][0]),
					pubkey: v(e[2][0]),
					kind: parseInt(v(e[3][0]), 16),
					relays: e[1] ? e[1].map((e) => yr.decode(e)) : []
				}
			};
		}
		case "nsec": return {
			type: t,
			data: r
		};
		case "npub":
		case "note": return {
			type: t,
			data: v(r)
		};
		default: throw Error(`unknown prefix ${t}`);
	}
}
function As(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		if (n.length < 2) throw Error("not enough data to read TLV");
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		if (n = n.slice(2 + r), i.length < r) throw Error(`not enough data to read on TLV ${e}`);
		t[e] = t[e] || [], t[e].push(i);
	}
	return t;
}
function js(e) {
	return Fs("nsec", e);
}
function Ms(e) {
	return Fs("npub", b(e));
}
function Ns(e) {
	return Fs("note", b(e));
}
function Ps(e, t) {
	let n = fn.toWords(t);
	return fn.encode(e, n, Ts);
}
function Fs(e, t) {
	return Ps(e, t);
}
function Is(e) {
	return Ps("nprofile", zs({
		0: [b(e.pubkey)],
		1: (e.relays || []).map((e) => Q.encode(e))
	}));
}
function Ls(e) {
	let t;
	return e.kind !== void 0 && (t = Ds(e.kind)), Ps("nevent", zs({
		0: [b(e.id)],
		1: (e.relays || []).map((e) => Q.encode(e)),
		2: e.author ? [b(e.author)] : [],
		3: t ? [new Uint8Array(t)] : []
	}));
}
function Rs(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	return new DataView(t).setUint32(0, e.kind, !1), Ps("naddr", zs({
		0: [Q.encode(e.identifier)],
		1: (e.relays || []).map((e) => Q.encode(e)),
		2: [b(e.pubkey)],
		3: [new Uint8Array(t)]
	}));
}
function zs(e) {
	let t = [];
	return Object.entries(e).reverse().forEach(([e, n]) => {
		n.forEach((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		});
	}), x(...t);
}
Z({}, {
	decrypt: () => Vs,
	encrypt: () => Bs
});
function Bs(e, t, n) {
	let r = e instanceof Uint8Array ? e : b(e), i = Hs(Ot.getSharedSecret(r, b("02" + t))), a = Uint8Array.from(C(16)), o = Q.encode(n), s = Zn(i, a).encrypt(o);
	return `${on.encode(new Uint8Array(s))}?iv=${on.encode(new Uint8Array(a.buffer))}`;
}
function Vs(e, t, n) {
	let r = e instanceof Uint8Array ? e : b(e), [i, a] = n.split("?iv="), o = Hs(Ot.getSharedSecret(r, b("02" + t))), s = on.decode(a), c = on.decode(i), l = Zn(o, s).decrypt(c);
	return yr.decode(l);
}
function Hs(e) {
	return e.slice(1, 33);
}
Z({}, {
	NIP05_REGEX: () => Us,
	isNip05: () => Ws,
	isValid: () => Ys,
	queryProfile: () => Js,
	searchDomain: () => qs,
	useFetchImplementation: () => Ks
});
var Us = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Ws = (e) => Us.test(e || ""), Gs;
try {
	Gs = fetch;
} catch {}
function Ks(e) {
	Gs = e;
}
async function qs(e, t = "") {
	try {
		let n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await Gs(n, { redirect: "manual" });
		if (r.status !== 200) throw Error("Wrong response code");
		return (await r.json()).names;
	} catch {
		return {};
	}
}
async function Js(e) {
	let t = e.match(Us);
	if (!t) return null;
	let [, n = "_", r] = t;
	try {
		let e = `https://${r}/.well-known/nostr.json?name=${n}`, t = await Gs(e, { redirect: "manual" });
		if (t.status !== 200) throw Error("Wrong response code");
		let i = await t.json(), a = i.names[n];
		return a ? {
			pubkey: a,
			relays: i.relays?.[a]
		} : null;
	} catch {
		return null;
	}
}
async function Ys(e, t) {
	let n = await Js(t);
	return n ? n.pubkey === e : !1;
}
Z({}, { parse: () => Xs });
function Xs(e) {
	let t = {
		reply: void 0,
		root: void 0,
		mentions: [],
		profiles: [],
		quotes: []
	}, n, r;
	for (let i = e.tags.length - 1; i >= 0; i--) {
		let a = e.tags[i];
		if (a[0] === "e" && a[1] && $(a[1])) {
			let [e, i, o, s, c] = a, l = {
				id: i,
				relays: o ? [o] : [],
				author: c && $(c) ? c : void 0
			};
			if (s === "root") {
				t.root = l;
				continue;
			}
			if (s === "reply") {
				t.reply = l;
				continue;
			}
			if (s === "mention") {
				t.mentions.push(l);
				continue;
			}
			n ? r = l : n = l, t.mentions.push(l);
		} else {
			if (a[0] === "q" && a[1] && $(a[1])) {
				let [e, n, r] = a;
				t.quotes.push({
					id: n,
					relays: r ? [r] : []
				});
			}
			a[0] === "p" && a[1] && $(a[1]) && t.profiles.push({
				pubkey: a[1],
				relays: a[2] ? [a[2]] : []
			});
		}
	}
	return t.root ||= r || n || t.reply, t.reply ||= n || t.root, [t.reply, t.root].forEach((e) => {
		if (!e) return;
		let n = t.mentions.indexOf(e);
		if (n !== -1 && t.mentions.splice(n, 1), e.author) {
			let n = t.profiles.find((t) => t.pubkey === e.author);
			n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
				e.relays?.indexOf(t) === -1 && e.relays.push(t);
			}), n.relays = e.relays);
		}
	}), t.mentions.forEach((e) => {
		if (e.author) {
			let n = t.profiles.find((t) => t.pubkey === e.author);
			n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
				e.relays.indexOf(t) === -1 && e.relays.push(t);
			}), n.relays = e.relays);
		}
	}), t;
}
Z({}, {
	fetchRelayInformation: () => Qs,
	useFetchImplementation: () => Zs
});
function Zs(e) {}
async function Qs(e) {
	return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
Z({}, {
	getPow: () => $s,
	minePow: () => tc
});
function $s(e) {
	let t = 0;
	for (let n = 0; n < 64; n += 8) {
		let r = parseInt(e.substring(n, n + 8), 16);
		if (r === 0) t += 32;
		else {
			t += Math.clz32(r);
			break;
		}
	}
	return t;
}
function ec(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		if (r === 0) t += 8;
		else {
			t += Math.clz32(r) - 24;
			break;
		}
	}
	return t;
}
function tc(e, t) {
	let n = 0, r = e, i = [
		"nonce",
		n.toString(),
		t.toString()
	];
	for (r.tags.push(i);;) {
		let e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
		e !== r.created_at && (n = 0, r.created_at = e), i[1] = (++n).toString();
		let a = N(Q.encode(JSON.stringify([
			0,
			r.pubkey,
			r.created_at,
			r.kind,
			r.tags,
			r.content
		])));
		if (ec(a) >= t) {
			r.id = v(a);
			break;
		}
	}
	return r;
}
Z({}, {
	unwrapEvent: () => Nc,
	unwrapManyEvents: () => Pc,
	wrapEvent: () => jc,
	wrapManyEvents: () => Mc
}), Z({}, {
	createRumor: () => Cc,
	createSeal: () => wc,
	createWrap: () => Tc,
	unwrapEvent: () => Oc,
	unwrapManyEvents: () => kc,
	wrapEvent: () => Ec,
	wrapManyEvents: () => Dc
}), Z({}, {
	decrypt: () => hc,
	encrypt: () => mc,
	getConversationKey: () => ac,
	v2: () => gc
});
var nc = 1, rc = 4294967295, ic = 65536;
function ac(e, t) {
	return mr(N, Ot.getSharedSecret(e, b("02" + t)).subarray(1, 33), Q.encode("nip44-v2"));
}
function oc(e, t) {
	let n = _r(N, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function sc(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 2 ** (Math.floor(Math.log2(e - 1)) + 1), n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function cc(e) {
	if (!Number.isSafeInteger(e) || e < nc || e > 65535) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
	let t = /* @__PURE__ */ new Uint8Array(2);
	return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function lc(e) {
	if (!Number.isSafeInteger(e) || e < ic || e > rc) throw Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
	let t = /* @__PURE__ */ new Uint8Array(4);
	return new DataView(t.buffer).setUint32(0, e, !1), t;
}
function uc(e) {
	let t = Q.encode(e), n = t.length;
	if (n < nc || n > rc) throw Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
	return x(n >= ic ? x(new Uint8Array([0, 0]), lc(n)) : cc(n), t, new Uint8Array(sc(n) - n));
}
function dc(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = t.getUint16(0), r, i;
	if (n === 0) {
		if (r = t.getUint32(2), r < ic) throw Error("invalid padding");
		i = 6;
	} else r = n, i = 2;
	let a = e.subarray(i, i + r);
	if (r < nc || r > rc || a.length !== r || e.length !== i + sc(r)) throw Error("invalid padding");
	return yr.decode(a);
}
function fc(e, t, n) {
	if (n.length !== 32) throw Error("AAD associated data must be 32 bytes");
	return at(N, e, x(n, t));
}
function pc(e) {
	if (typeof e != "string") throw Error("payload must be a valid string");
	let t = e.length;
	if (t < 132) throw Error("invalid payload length: " + t);
	if (e[0] === "#") throw Error("unknown encryption version");
	let n;
	try {
		n = on.decode(e);
	} catch (e) {
		throw Error("invalid base64: " + e.message);
	}
	let r = n.length;
	if (r < 99) throw Error("invalid data length: " + r);
	let i = n[0];
	if (i !== 2) throw Error("unknown encryption version " + i);
	return {
		nonce: n.subarray(1, 33),
		ciphertext: n.subarray(33, -32),
		mac: n.subarray(-32)
	};
}
function mc(e, t, n = C(32)) {
	let { chacha_key: r, chacha_nonce: i, hmac_key: a } = oc(t, n), o = pr(r, i, uc(e)), s = fc(a, o, n);
	return on.encode(x(new Uint8Array([2]), n, o, s));
}
function hc(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = pc(e), { chacha_key: a, chacha_nonce: o, hmac_key: s } = oc(t, n);
	if (!Cn(fc(s, r, n), i)) throw Error("invalid MAC");
	return dc(pr(a, o, r));
}
var gc = {
	utils: {
		getConversationKey: ac,
		calcPaddedLen: sc,
		pad: uc,
		unpad: dc
	},
	encrypt: mc,
	decrypt: hc
}, _c = 172800, vc = () => Math.round(Date.now() / 1e3), yc = () => Math.round(vc() - Math.random() * _c), bc = (e, t) => ac(e, t), xc = (e, t, n) => mc(JSON.stringify(e), bc(t, n)), Sc = (e, t) => JSON.parse(hc(e.content, bc(t, e.pubkey)));
function Cc(e, t) {
	let n = {
		created_at: vc(),
		content: "",
		tags: [],
		...e,
		pubkey: Nr(t)
	};
	return n.id = Ar(n), n;
}
function wc(e, t, n) {
	return Pr({
		kind: ti,
		content: xc(e, t, n),
		created_at: yc(),
		tags: []
	}, t);
}
function Tc(e, t) {
	let n = Mr();
	return Pr({
		kind: Si,
		content: xc(e, n, t),
		created_at: yc(),
		tags: [["p", t]]
	}, n);
}
function Ec(e, t, n) {
	return Tc(wc(Cc(e, t), t, n), n);
}
function Dc(e, t, n) {
	if (!n || n.length === 0) throw Error("At least one recipient is required.");
	let r = [Ec(e, t, Nr(t))];
	return n.forEach((n) => {
		r.push(Ec(e, t, n));
	}), r;
}
function Oc(e, t) {
	if (e.kind !== Si) throw Error(`unexpected wrap kind ${e.kind}, expected ${Si}`);
	let n = Sc(e, t);
	if (n.kind !== ti) throw Error(`unexpected seal kind ${n.kind}, expected ${ti}`);
	if (!Fr(n)) throw Error("seal signature is invalid");
	let r = Sc(n, t);
	if (r.pubkey !== n.pubkey) throw Error(`rumor pubkey ${r.pubkey} does not match seal pubkey ${n.pubkey}`);
	return r;
}
function kc(e, t) {
	let n = [];
	return e.forEach((e) => {
		try {
			n.push(Oc(e, t));
		} catch {}
	}), n.sort((e, t) => e.created_at - t.created_at), n;
}
function Ac(e, t, n, r) {
	let i = {
		created_at: Math.ceil(Date.now() / 1e3),
		kind: ni,
		tags: [],
		content: t
	};
	return (Array.isArray(e) ? e : [e]).forEach(({ publicKey: e, relayUrl: t }) => {
		i.tags.push(t ? [
			"p",
			e,
			t
		] : ["p", e]);
	}), r && i.tags.push([
		"e",
		r.eventId,
		r.relayUrl || "",
		"reply"
	]), n && i.tags.push(["subject", n]), i;
}
function jc(e, t, n, r, i) {
	return Ec(Ac(t, n, r, i), e, t.publicKey);
}
function Mc(e, t, n, r, i) {
	if (!t || t.length === 0) throw Error("At least one recipient is required.");
	return [{ publicKey: Nr(e) }, ...t].map((t) => jc(e, t, n, r, i));
}
var Nc = Oc, Pc = kc;
Z({}, {
	finishRepostEvent: () => Fc,
	getRepostedEvent: () => Lc,
	getRepostedEventPointer: () => Ic
});
function Fc(e, t, n, r) {
	let i, a = [
		...e.tags ?? [],
		[
			"e",
			t.id,
			n
		],
		["p", t.pubkey]
	];
	return t.kind === Ur ? i = Jr : (i = ii, a.push(["k", String(t.kind)])), Pr({
		kind: i,
		tags: a,
		content: e.content === "" || t.tags?.find((e) => e[0] === "-") ? "" : JSON.stringify(t),
		created_at: e.created_at
	}, r);
}
function Ic(e) {
	if (![Jr, ii].includes(e.kind)) return;
	let t, n;
	for (let r = e.tags.length - 1; r >= 0 && (t === void 0 || n === void 0); r--) {
		let i = e.tags[r];
		i.length >= 2 && (i[0] === "e" && t === void 0 ? t = i : i[0] === "p" && n === void 0 && (n = i));
	}
	if (t !== void 0) return {
		id: t[1],
		relays: [t[2], n?.[2]].filter((e) => typeof e == "string"),
		author: n?.[1]
	};
}
function Lc(e, { skipVerification: t } = {}) {
	let n = Ic(e);
	if (n === void 0 || e.content === "") return;
	let r;
	try {
		r = JSON.parse(e.content);
	} catch {
		return;
	}
	if (r.id === n.id && (t || Fr(r))) return r;
}
Z({}, {
	NOSTR_URI_REGEX: () => Rc,
	parse: () => Bc,
	test: () => zc
});
var Rc = RegExp(`nostr:(${Es.source})`);
function zc(e) {
	return typeof e == "string" && RegExp(`^${Rc.source}$`).test(e);
}
function Bc(e) {
	let t = e.match(RegExp(`^${Rc.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: ks(t[1])
	};
}
Z({}, { parse: () => qc });
function Vc(e) {
	if (e) return /^\d+$/.test(e) ? parseInt(e, 10) : e;
}
function Hc(e, t) {
	let n = e.indexOf(":"), r = e.indexOf(":", n + 1);
	if (n === -1 || r === -1) return;
	let i = parseInt(e.slice(0, n), 10);
	if (Number.isNaN(i)) return;
	let a = e.slice(n + 1, r);
	if ($(a)) return {
		kind: i,
		pubkey: a,
		identifier: e.slice(r + 1),
		relays: t ? [t] : []
	};
}
function Uc(e) {
	switch (e[0]) {
		case "E":
		case "e": return !e[1] || !$(e[1]) ? void 0 : {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && $(e[3]) ? e[3] : void 0
		};
		case "A":
		case "a": return e[1] ? Hc(e[1], e[2]) : void 0;
		case "I":
		case "i": return e[1] ? {
			value: e[1],
			hint: e[2]
		} : void 0;
	}
}
function Wc(e) {
	if (e[1]) {
		if (e[1].includes(":")) return Hc(e[1], e[2]);
		if ($(e[1])) return {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && $(e[3]) ? e[3] : void 0
		};
	}
}
function Gc(e) {
	return e.findLast((e) => e.tagName === "A" || e.tagName === "a")?.pointer || e.findLast((e) => e.tagName === "I" || e.tagName === "i")?.pointer || e.findLast((e) => e.tagName === "E" || e.tagName === "e")?.pointer;
}
function Kc(e, t) {
	if (!e || !("id" in e) || !e.author) return;
	let n = t.find((t) => t.pubkey === e.author);
	n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
		e.relays.indexOf(t) === -1 && e.relays.push(t);
	}), n.relays = e.relays);
}
function qc(e) {
	let t = {
		root: void 0,
		rootKind: void 0,
		reply: void 0,
		replyKind: void 0,
		mentions: [],
		quotes: [],
		profiles: []
	}, n = [], r = [];
	for (let i of e.tags) if ((i[0] === "E" || i[0] === "A" || i[0] === "I") && i[1]) {
		let e = Uc(i);
		e && n.push({
			tagName: i[0],
			pointer: e
		});
	} else if ((i[0] === "e" || i[0] === "a" || i[0] === "i") && i[1]) {
		let e = Uc(i);
		e && r.push({
			tagName: i[0],
			pointer: e
		});
	} else if (i[0] === "K") t.rootKind = Vc(i[1]);
	else if (i[0] === "k") t.replyKind = Vc(i[1]);
	else if (i[0] === "q") {
		let e = Wc(i);
		e && t.quotes.push(e);
	} else (i[0] === "P" || i[0] === "p") && i[1] && $(i[1]) && t.profiles.push({
		pubkey: i[1],
		relays: i[2] ? [i[2]] : []
	});
	return t.root = Gc(n), t.reply = Gc(r), Kc(t.root, t.profiles), Kc(t.reply, t.profiles), t.quotes.forEach((e) => Kc(e, t.profiles)), t;
}
Z({}, {
	finishReactionEvent: () => Jc,
	getReactedEventPointer: () => Yc
});
function Jc(e, t, n) {
	let r = t.tags.filter((e) => e.length >= 2 && (e[0] === "e" || e[0] === "p"));
	return Pr({
		...e,
		kind: Yr,
		tags: [
			...e.tags ?? [],
			...r,
			["e", t.id],
			["p", t.pubkey]
		],
		content: e.content ?? "+"
	}, n);
}
function Yc(e) {
	if (e.kind !== Yr) return;
	let t, n;
	for (let r = e.tags.length - 1; r >= 0 && (t === void 0 || n === void 0); r--) {
		let i = e.tags[r];
		i.length >= 2 && (i[0] === "e" && t === void 0 ? t = i : i[0] === "p" && n === void 0 && (n = i));
	}
	if (t !== void 0 && n !== void 0) return {
		id: t[1],
		relays: [t[2], n[2]].filter((e) => e !== void 0),
		author: n[1]
	};
}
Z({}, { parse: () => $c });
var Xc = /\W/m, Zc = /[^\w\/] |[^\w\/]$|$|,| /m, Qc = 42;
function* $c(e) {
	let t = [];
	if (typeof e != "string") {
		for (let n = 0; n < e.tags.length; n++) {
			let r = e.tags[n];
			r[0] === "emoji" && r.length >= 3 && t.push({
				type: "emoji",
				shortcode: r[1],
				url: r[2]
			});
		}
		e = e.content;
	}
	let n = e.length, r = 0, i = 0;
	mainloop: for (; i < n;) {
		let a = e.indexOf(":", i), o = e.indexOf("#", i);
		if (a === -1 && o === -1) break mainloop;
		if (a === -1 || o >= 0 && o < a) {
			if (o === 0 || e[o - 1].match(Xc)) {
				let t = e.slice(o + 1, o + Qc).match(Xc), a = t ? o + 1 + t.index : n;
				yield {
					type: "text",
					text: e.slice(r, o),
					start: r,
					end: o
				}, yield {
					type: "hashtag",
					value: e.slice(o + 1, a),
					start: o,
					end: a
				}, i = a, r = i;
				continue mainloop;
			}
			i = o + 1;
			continue mainloop;
		}
		if (e.slice(a - 5, a) === "nostr") {
			let t = e.slice(a + 60).match(Xc), o = t ? a + 60 + t.index : n;
			try {
				let t, { data: n, type: s } = ks(e.slice(a + 1, o));
				switch (s) {
					case "npub":
						t = { pubkey: n };
						break;
					case "note":
						t = { id: n };
						break;
					case "nsec":
						i = o + 1;
						continue;
					default: t = n;
				}
				r !== a - 5 && (yield {
					type: "text",
					text: e.slice(r, a - 5),
					start: r,
					end: a - 5
				}), yield {
					type: "reference",
					pointer: t,
					start: a - 5,
					end: o
				}, i = o, r = i;
				continue mainloop;
			} catch {
				i = a + 1;
				continue mainloop;
			}
		}
		if (e.slice(a - 5, a) === "https" || e.slice(a - 4, a) === "http") {
			let t = e.slice(a + 4).match(Zc), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 5 : 4;
			try {
				let t = new URL(e.slice(a - s, o));
				if (t.hostname.indexOf(".") === -1) throw Error("invalid url");
				if (r !== a - s && (yield {
					type: "text",
					text: e.slice(r, a - s),
					start: r,
					end: a - s
				}), /\.(png|jpe?g|gif|webp|heic|svg)$/i.test(t.pathname)) {
					yield {
						type: "image",
						url: t.toString(),
						start: a - s,
						end: o
					}, i = o, r = i;
					continue mainloop;
				}
				if (/\.(mp4|avi|webm|mkv|mov)$/i.test(t.pathname)) {
					yield {
						type: "video",
						url: t.toString(),
						start: a - s,
						end: o
					}, i = o, r = i;
					continue mainloop;
				}
				if (/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(t.pathname)) {
					yield {
						type: "audio",
						url: t.toString(),
						start: a - s,
						end: o
					}, i = o, r = i;
					continue mainloop;
				}
				yield {
					type: "url",
					url: t.toString(),
					start: a - s,
					end: o
				}, i = o, r = i;
				continue mainloop;
			} catch {
				i = o + 1;
				continue mainloop;
			}
		}
		if (e.slice(a - 3, a) === "wss" || e.slice(a - 2, a) === "ws") {
			let t = e.slice(a + 4).match(Zc), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 3 : 2;
			try {
				let t = new URL(e.slice(a - s, o));
				if (t.hostname.indexOf(".") === -1) throw Error("invalid ws url");
				r !== a - s && (yield {
					type: "text",
					text: e.slice(r, a - s),
					start: r,
					end: a - s
				}), yield {
					type: "relay",
					url: t.toString(),
					start: a - s,
					end: o
				}, i = o, r = i;
				continue mainloop;
			} catch {
				i = o + 1;
				continue mainloop;
			}
		}
		for (let n = 0; n < t.length; n++) {
			let o = t[n];
			if (e[a + o.shortcode.length + 1] === ":" && e.slice(a + 1, a + o.shortcode.length + 1) === o.shortcode) {
				r !== a && (yield {
					type: "text",
					text: e.slice(r, a),
					start: r,
					end: a
				}), yield {
					...o,
					start: a,
					end: a + o.shortcode.length + 2
				}, i = a + o.shortcode.length + 2, r = i;
				continue mainloop;
			}
		}
		i = a + 1;
		continue mainloop;
	}
	r !== n && (yield {
		type: "text",
		text: e.slice(r),
		start: r,
		end: n
	});
}
Z({}, {
	channelCreateEvent: () => el,
	channelHideMessageEvent: () => rl,
	channelMessageEvent: () => nl,
	channelMetadataEvent: () => tl,
	channelMuteUserEvent: () => il
});
var el = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Pr({
		kind: ui,
		tags: [...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, tl = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Pr({
		kind: di,
		tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, nl = (e, t) => {
	let n = [[
		"e",
		e.channel_create_event_id,
		e.relay_url,
		"root"
	]];
	return e.reply_to_channel_message_event_id && n.push([
		"e",
		e.reply_to_channel_message_event_id,
		e.relay_url,
		"reply"
	]), Pr({
		kind: fi,
		tags: [...n, ...e.tags ?? []],
		content: e.content,
		created_at: e.created_at
	}, t);
}, rl = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Pr({
		kind: pi,
		tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, il = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Pr({
		kind: mi,
		tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
};
Z({}, {
	EMOJI_SHORTCODE_REGEX: () => al,
	matchAll: () => sl,
	regex: () => ol,
	replaceAll: () => cl
});
var al = /:(\w+):/, ol = () => RegExp(`\\B${al.source}\\B`, "g");
function* sl(e) {
	let t = e.matchAll(ol());
	for (let e of t) try {
		let [t, n] = e;
		yield {
			shortcode: t,
			name: n,
			start: e.index,
			end: e.index + t.length
		};
	} catch {}
}
function cl(e, t) {
	return e.replaceAll(ol(), (e, n) => t({
		shortcode: e,
		name: n
	}));
}
Z({}, {
	useFetchImplementation: () => ul,
	validateGithub: () => dl
});
var ll;
try {
	ll = fetch;
} catch {}
function ul(e) {
	ll = e;
}
async function dl(e, t, n) {
	try {
		return await (await ll(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
Z({}, {
	makeNwcRequestEvent: () => pl,
	parseConnectionString: () => fl
});
function fl(e) {
	let { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, a = r.getAll("relay"), o = r.get("secret");
	if (!i || a.length === 0 || !o) throw Error("invalid connection string");
	return {
		pubkey: i,
		relay: a[0],
		relays: a,
		secret: o
	};
}
async function pl(e, t, n) {
	let r = Bs(t, e, JSON.stringify({
		method: "pay_invoice",
		params: { invoice: n }
	}));
	return Pr({
		kind: no,
		created_at: Math.round(Date.now() / 1e3),
		content: r,
		tags: [["p", e]]
	}, t);
}
Z({}, { normalizeIdentifier: () => ml });
function ml(e) {
	return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((e) => /\p{Letter}/u.test(e) || /\p{Number}/u.test(e) ? e : "-").join("");
}
Z({}, {
	getSatoshisAmountFromBolt11: () => xl,
	getZapEndpoint: () => _l,
	makeZapReceipt: () => bl,
	makeZapRequest: () => vl,
	useFetchImplementation: () => gl,
	validateZapRequest: () => yl
});
var hl;
try {
	hl = fetch;
} catch {}
function gl(e) {
	hl = e;
}
async function _l(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (r) {
			let [e, n] = r.split("@");
			t = new URL(`/.well-known/lnurlp/${e}`, `https://${n}`).toString();
		} else if (n) {
			let { words: e } = fn.decode(n, 1e3), r = fn.fromWords(e);
			t = yr.decode(r);
		} else return null;
		let i = await (await hl(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function vl(e) {
	let t = {
		kind: 9734,
		created_at: Math.round(Date.now() / 1e3),
		content: e.comment || "",
		tags: [
			["p", "pubkey" in e ? e.pubkey : e.event.pubkey],
			["amount", e.amount.toString()],
			["relays", ...e.relays]
		]
	};
	if ("event" in e) {
		if (t.tags.push(["e", e.event.id]), Lr(e.event.kind)) {
			let n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
			t.tags.push(n);
		} else if (zr(e.event.kind)) {
			let n = e.event.tags.find(([e, t]) => e === "d" && t);
			if (!n) throw Error("d tag not found or is empty");
			let r = ["a", `${e.event.kind}:${e.event.pubkey}:${n[1]}`];
			t.tags.push(r);
		}
		t.tags.push(["k", e.event.kind.toString()]);
	}
	return t;
}
function yl(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!Dr(t)) return "Zap request is not a valid Nostr event.";
	if (!Fr(t)) return "Invalid signature on zap request.";
	let n = t.tags.find(([e, t]) => e === "p" && t);
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!$(n[1])) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find(([e, t]) => e === "e" && t);
	return r && !$(r[1]) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([e, t]) => e === "relays" && t) ? null : "Zap request doesn't have a 'relays' tag.";
}
function bl({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
	let i = JSON.parse(e), a = i.tags.filter(([e]) => e === "e" || e === "p" || e === "a"), o = {
		kind: 9735,
		created_at: Math.round(r.getTime() / 1e3),
		content: "",
		tags: [
			...a,
			["P", i.pubkey],
			["bolt11", n],
			["description", e]
		]
	};
	return t && o.tags.push(["preimage", t]), o;
}
function xl(e) {
	if (e.length < 50) return 0;
	e = e.substring(0, 50);
	let t = e.lastIndexOf("1");
	if (t === -1) return 0;
	let n = e.substring(0, t);
	if (!n.startsWith("lnbc")) return 0;
	let r = n.substring(4);
	if (r.length < 1) return 0;
	let i = r[r.length - 1], a = i.charCodeAt(0) - 48, o = a >= 0 && a <= 9, s = r.length - 1;
	if (o && s++, s < 1) return 0;
	let c = parseInt(r.substring(0, s));
	switch (i) {
		case "m": return c * 1e5;
		case "u": return c * 100;
		case "n": return c / 10;
		case "p": return c / 1e4;
		default: return c * 1e8;
	}
}
Z({}, {
	Negentropy: () => Nl,
	NegentropyStorageVector: () => Ml,
	NegentropySync: () => Il
});
var Sl = 97, Cl = 32, wl = 16, Tl = {
	Skip: 0,
	Fingerprint: 1,
	IdList: 2
}, El = class {
	_raw;
	length;
	constructor(e) {
		typeof e == "number" ? (this._raw = new Uint8Array(e), this.length = 0) : e instanceof Uint8Array ? (this._raw = new Uint8Array(e), this.length = e.length) : (this._raw = /* @__PURE__ */ new Uint8Array(512), this.length = 0);
	}
	unwrap() {
		return this._raw.subarray(0, this.length);
	}
	get capacity() {
		return this._raw.byteLength;
	}
	extend(e) {
		if (e instanceof El && (e = e.unwrap()), typeof e.length != "number") throw Error("bad length");
		let t = e.length + this.length;
		if (this.capacity < t) {
			let e = this._raw, n = Math.max(this.capacity * 2, t);
			this._raw = new Uint8Array(n), this._raw.set(e);
		}
		this._raw.set(e, this.length), this.length += e.length;
	}
	shift() {
		let e = this._raw[0];
		return this._raw = this._raw.subarray(1), this.length--, e;
	}
	shiftN(e = 1) {
		let t = this._raw.subarray(0, e);
		return this._raw = this._raw.subarray(e), this.length -= e, t;
	}
};
function Dl(e) {
	let t = 0;
	for (;;) {
		if (e.length === 0) throw Error("parse ends prematurely");
		let n = e.shift();
		if (t = t << 7 | n & 127, !(n & 128)) break;
	}
	return t;
}
function Ol(e) {
	if (e === 0) return new El(new Uint8Array([0]));
	let t = [];
	for (; e !== 0;) t.push(e & 127), e >>>= 7;
	t.reverse();
	for (let e = 0; e < t.length - 1; e++) t[e] |= 128;
	return new El(new Uint8Array(t));
}
function kl(e) {
	return Al(e, 1)[0];
}
function Al(e, t) {
	if (e.length < t) throw Error("parse ends prematurely");
	return e.shiftN(t);
}
var jl = class {
	buf;
	constructor() {
		this.setToZero();
	}
	setToZero() {
		this.buf = new Uint8Array(Cl);
	}
	add(e) {
		let t = 0, n = 0, r = new DataView(this.buf.buffer), i = new DataView(e.buffer);
		for (let e = 0; e < 8; e++) {
			let a = e * 4, o = r.getUint32(a, !0), s = i.getUint32(a, !0), c = o;
			c += t, c += s, c > 4294967295 && (n = 1), r.setUint32(a, c | 0, !0), t = n, n = 0;
		}
	}
	negate() {
		let e = new DataView(this.buf.buffer);
		for (let t = 0; t < 8; t++) {
			let n = t * 4;
			e.setUint32(n, ~e.getUint32(n, !0));
		}
		let t = new Uint8Array(Cl);
		t[0] = 1, this.add(t);
	}
	getFingerprint(e) {
		let t = new El();
		return t.extend(this.buf), t.extend(Ol(e)), N(t.unwrap()).subarray(0, wl);
	}
}, Ml = class {
	items;
	sealed;
	constructor() {
		this.items = [], this.sealed = !1;
	}
	insert(e, t) {
		if (this.sealed) throw Error("already sealed");
		let n = b(t);
		if (n.byteLength !== Cl) throw Error("bad id size for added item");
		this.items.push({
			timestamp: e,
			id: n
		});
	}
	seal() {
		if (this.sealed) throw Error("already sealed");
		this.sealed = !0, this.items.sort(Fl);
		for (let e = 1; e < this.items.length; e++) if (Fl(this.items[e - 1], this.items[e]) === 0) throw Error("duplicate item inserted");
	}
	unseal() {
		this.sealed = !1;
	}
	size() {
		return this._checkSealed(), this.items.length;
	}
	getItem(e) {
		if (this._checkSealed(), e >= this.items.length) throw Error("out of range");
		return this.items[e];
	}
	iterate(e, t, n) {
		this._checkSealed(), this._checkBounds(e, t);
		for (let r = e; r < t && n(this.items[r], r); ++r);
	}
	findLowerBound(e, t, n) {
		return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (e) => Fl(e, n) < 0);
	}
	fingerprint(e, t) {
		let n = new jl();
		return n.setToZero(), this.iterate(e, t, (e) => (n.add(e.id), !0)), n.getFingerprint(t - e);
	}
	_checkSealed() {
		if (!this.sealed) throw Error("not sealed");
	}
	_checkBounds(e, t) {
		if (e > t || t > this.items.length) throw Error("bad range");
	}
	_binarySearch(e, t, n, r) {
		let i = n - t;
		for (; i > 0;) {
			let n = t, a = Math.floor(i / 2);
			n += a, r(e[n]) ? (t = ++n, i -= a + 1) : i = a;
		}
		return t;
	}
}, Nl = class {
	storage;
	frameSizeLimit;
	lastTimestampIn;
	lastTimestampOut;
	constructor(e, t = 6e4) {
		if (t < 4096) throw Error("frameSizeLimit too small");
		this.storage = e, this.frameSizeLimit = t, this.lastTimestampIn = 0, this.lastTimestampOut = 0;
	}
	_bound(e, t) {
		return {
			timestamp: e,
			id: t || /* @__PURE__ */ new Uint8Array()
		};
	}
	initiate() {
		let e = new El();
		return e.extend(new Uint8Array([Sl])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), v(e.unwrap());
	}
	reconcile(e, t, n) {
		let r = new El(b(e));
		this.lastTimestampIn = this.lastTimestampOut = 0;
		let i = new El();
		i.extend(new Uint8Array([Sl]));
		let a = kl(r);
		if (a < 96 || a > 111) throw Error("invalid negentropy protocol version byte");
		if (a !== Sl) throw Error("unsupported negentropy protocol version requested: " + (a - 96));
		let o = this.storage.size(), s = this._bound(0), c = 0, l = !1;
		for (; r.length !== 0;) {
			let e = new El(), a = () => {
				l && (l = !1, e.extend(this.encodeBound(s)), e.extend(Ol(Tl.Skip)));
			}, u = this.decodeBound(r), d = Dl(r), f = c, p = this.storage.findLowerBound(c, o, u);
			if (d === Tl.Skip) l = !0;
			else if (d === Tl.Fingerprint) Pl(Al(r, wl), this.storage.fingerprint(f, p)) === 0 ? l = !0 : (a(), this.splitRange(f, p, u, e));
			else if (d === Tl.IdList) {
				let e = Dl(r), i = {};
				for (let t = 0; t < e; t++) {
					let e = Al(r, Cl);
					i[v(e)] = e;
				}
				if (l = !0, this.storage.iterate(f, p, (e) => {
					let n = e.id, r = v(n);
					return i[r] ? delete i[v(n)] : t?.(r), !0;
				}), n) for (let e of Object.values(i)) n(v(e));
			} else throw Error("unexpected mode");
			if (this.exceededFrameSizeLimit(i.length + e.length)) {
				let e = this.storage.fingerprint(p, o);
				i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(Ol(Tl.Fingerprint)), i.extend(e);
				break;
			}
			i.extend(e), c = p, s = u;
		}
		return i.length === 1 ? null : v(i.unwrap());
	}
	splitRange(e, t, n, r) {
		let i = t - e;
		if (i < 32) r.extend(this.encodeBound(n)), r.extend(Ol(Tl.IdList)), r.extend(Ol(i)), this.storage.iterate(e, t, (e) => (r.extend(e.id), !0));
		else {
			let a = Math.floor(i / 16), o = i % 16, s = e;
			for (let e = 0; e < 16; e++) {
				let i = a + +(e < o), c = this.storage.fingerprint(s, s + i);
				s += i;
				let l;
				if (s === t) l = n;
				else {
					let e, t;
					this.storage.iterate(s - 1, s + 1, (n, r) => (r === s - 1 ? e = n : t = n, !0)), l = this.getMinimalBound(e, t);
				}
				r.extend(this.encodeBound(l)), r.extend(Ol(Tl.Fingerprint)), r.extend(c);
			}
		}
	}
	exceededFrameSizeLimit(e) {
		return e > this.frameSizeLimit - 200;
	}
	decodeTimestampIn(e) {
		let t = Dl(e);
		return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
	}
	decodeBound(e) {
		let t = this.decodeTimestampIn(e), n = Dl(e);
		if (n > Cl) throw Error("bound key too long");
		return {
			timestamp: t,
			id: Al(e, n)
		};
	}
	encodeTimestampOut(e) {
		if (e === Number.MAX_VALUE) return this.lastTimestampOut = Number.MAX_VALUE, Ol(0);
		let t = e;
		return e -= this.lastTimestampOut, this.lastTimestampOut = t, Ol(e + 1);
	}
	encodeBound(e) {
		let t = new El();
		return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(Ol(e.id.length)), t.extend(e.id), t;
	}
	getMinimalBound(e, t) {
		if (t.timestamp !== e.timestamp) return this._bound(t.timestamp);
		{
			let n = 0, r = t.id, i = e.id;
			for (let e = 0; e < Cl && r[e] === i[e]; e++) n++;
			return this._bound(t.timestamp, t.id.subarray(0, n + 1));
		}
	}
};
function Pl(e, t) {
	for (let n = 0; n < e.byteLength; n++) {
		if (e[n] < t[n]) return -1;
		if (e[n] > t[n]) return 1;
	}
	return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function Fl(e, t) {
	return e.timestamp === t.timestamp ? Pl(e.id, t.id) : e.timestamp - t.timestamp;
}
var Il = class {
	relay;
	storage;
	neg;
	filter;
	subscription;
	onhave;
	onneed;
	constructor(e, t, n, r = {}) {
		this.relay = e, this.storage = t, this.neg = new Nl(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (e) => {
			switch (e[0]) {
				case "NEG-MSG":
					e.length < 3 && console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${e}`);
					try {
						let t = this.neg.reconcile(e[2], this.onhave, this.onneed);
						t ? this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${t}"]`) : (this.close(), r.onclose?.());
					} catch (e) {
						console.error("negentropy reconcile error:", e), r?.onclose?.(`reconcile error: ${e}`);
					}
					break;
				case "NEG-CLOSE": {
					let t = e[2];
					console.warn("negentropy error:", t), r.onclose?.(t);
					break;
				}
				case "NEG-ERR": r.onclose?.();
			}
		};
	}
	async start() {
		let e = this.neg.initiate();
		this.relay.send(`["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${e}"]`);
	}
	close() {
		this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`), this.subscription.close();
	}
};
Z({}, {
	getToken: () => Rl,
	hashPayload: () => Gl,
	unpackEventFromToken: () => Bl,
	validateEvent: () => ql,
	validateEventKind: () => Hl,
	validateEventMethodTag: () => Wl,
	validateEventPayloadTag: () => Kl,
	validateEventTimestamp: () => Vl,
	validateEventUrlTag: () => Ul,
	validateToken: () => zl
});
var Ll = "Nostr ";
async function Rl(e, t, n, r = !1, i) {
	let a = {
		kind: oo,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	i && a.tags.push(["payload", Gl(i)]);
	let o = await n(a);
	return (r ? Ll : "") + on.encode(Q.encode(JSON.stringify(o)));
}
async function zl(e, t, n) {
	return await ql(await Bl(e).catch((e) => {
		throw e;
	}), t, n).catch((e) => {
		throw e;
	});
}
async function Bl(e) {
	if (!e) throw Error("Missing token");
	e = e.replace(Ll, "");
	let t = yr.decode(on.decode(e));
	if (!t || t.length === 0 || !t.startsWith("{")) throw Error("Invalid token");
	return JSON.parse(t);
}
function Vl(e) {
	return e.created_at ? Math.abs(Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at) < 60 : !1;
}
function Hl(e) {
	return e.kind === oo;
}
function Ul(e, t) {
	let n = e.tags.find((e) => e[0] === "u");
	return n ? n.length > 0 && n[1] === t : !1;
}
function Wl(e, t) {
	let n = e.tags.find((e) => e[0] === "method");
	return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function Gl(e) {
	return v(N(Q.encode(JSON.stringify(e))));
}
function Kl(e, t) {
	let n = e.tags.find((e) => e[0] === "payload");
	if (!n) return !1;
	let r = Gl(t);
	return n.length > 0 && n[1] === r;
}
async function ql(e, t, n, r) {
	if (!Fr(e)) throw Error("Invalid nostr event, signature invalid");
	if (!Hl(e)) throw Error("Invalid nostr event, kind invalid");
	if (!Vl(e)) throw Error("Invalid nostr event, created_at timestamp invalid");
	if (!Ul(e, t)) throw Error("Invalid nostr event, url tag invalid");
	if (!Wl(e, n)) throw Error("Invalid nostr event, method tag invalid");
	if (r && typeof r == "object" && Object.keys(r).length > 0 && !Kl(e, r)) throw Error("Invalid nostr event, payload tag does not match request body hash");
	return !0;
}
new TextDecoder("utf-8"), new TextEncoder();
function Jl(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relayLists.ts
var Yl = [
	"wss://relay.damus.io/",
	"wss://relay.nostr.band/",
	"wss://nrelay.c-stellar.net/",
	"wss://nrelay-jp.c-stellar.net/"
], Xl = /* @__PURE__ */ new Set(["ws:", "wss:"]), Zl = new Set(Yl), Ql = class {
	static EXTERNAL_INPUT_RELAY_LIMIT = 3;
	static normalizeRelayUrl(e) {
		return e.endsWith("/") ? e : e + "/";
	}
	static normalizeExternalRelayUrl(e) {
		let t = this.normalizeExternalRelayUrlCandidate(e);
		return t && !this.isDecommissionedRelayUrl(e) ? t : null;
	}
	static filterDecommissionedRelayConfig(e) {
		return Array.isArray(e) ? e.filter((e) => !this.isDecommissionedRelayUrl(e)) : Object.fromEntries(Object.entries(e).filter(([e]) => !this.isDecommissionedRelayUrl(e)));
	}
	static hasRelayEntries(e) {
		return Array.isArray(e) ? e.length > 0 : Object.keys(e).length > 0;
	}
	static isDecommissionedRelayUrl(e) {
		let t = this.normalizeExternalRelayUrlCandidate(e);
		return t !== null && Zl.has(t);
	}
	static normalizeExternalRelayUrlCandidate(e) {
		if (typeof e != "string") return null;
		let t = e.trim();
		if (!t) return null;
		try {
			if (t.includes("://")) {
				let e = new URL(t);
				if (!Xl.has(e.protocol) || e.username || e.password) return null;
			}
			let e = Jl(t), n = new URL(e);
			return !Xl.has(n.protocol) || !n.hostname || n.username || n.password ? null : e;
		} catch {
			return null;
		}
	}
	static sanitizeExternalRelayUrls(e, t = {}) {
		if (!e?.length) return [];
		let n = [], r = /* @__PURE__ */ new Set();
		for (let i of e) {
			let e = this.normalizeExternalRelayUrl(i);
			if (e && !r.has(e) && (r.add(e), n.push(e), typeof t.limit == "number" && n.length >= t.limit)) break;
		}
		return n;
	}
	static mergeRelayConfigs(...e) {
		let t = /* @__PURE__ */ new Set();
		return e.forEach((e) => {
			let n = this.filterDecommissionedRelayConfig(e);
			Array.isArray(n) ? n.forEach((e) => t.add(this.normalizeRelayUrl(e))) : typeof n == "object" && Object.keys(n).forEach((e) => {
				t.add(this.normalizeRelayUrl(e));
			});
		}), Array.from(t);
	}
	static extractReadRelays(e) {
		let t = this.filterDecommissionedRelayConfig(e);
		return Array.isArray(t) ? t.map((e) => this.normalizeRelayUrl(e)) : typeof t == "object" ? Object.keys(t).filter((e) => t[e]?.read !== !1).map((e) => this.normalizeRelayUrl(e)) : [];
	}
	static extractWriteRelays(e) {
		let t = this.filterDecommissionedRelayConfig(e);
		return Array.isArray(t) ? t.map((e) => this.normalizeRelayUrl(e)) : typeof t == "object" ? Object.keys(t).filter((e) => t[e]?.write !== !1).map((e) => this.normalizeRelayUrl(e)) : [];
	}
	static extractAllRelays(e) {
		let t = this.filterDecommissionedRelayConfig(e);
		return Array.isArray(t) ? t.map((e) => this.normalizeRelayUrl(e)) : typeof t == "object" ? Object.keys(t).map((e) => this.normalizeRelayUrl(e)) : [];
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/eventPointerUtils.ts
function $l(e) {
	if (typeof e != "string" || !e.trim().includes("://")) return !1;
	try {
		let t = new URL(e.trim());
		return (t.protocol === "ws:" || t.protocol === "wss:") && !t.username && !t.password && Ql.normalizeExternalRelayUrl(e) !== null;
	} catch {
		return !1;
	}
}
function eu(e, t = {}) {
	try {
		let n = Cs.decode(e);
		if (n.type === "nevent") {
			let e = n.data, r = Array.isArray(e.relays) ? e.relays : [];
			return t.relayValidation === "strict" && r.some((e) => !$l(e)) ? null : {
				eventId: e.id,
				relayHints: Ql.sanitizeExternalRelayUrls(r.filter((e) => typeof e == "string"), { limit: Ql.EXTERNAL_INPUT_RELAY_LIMIT }),
				authorPubkey: e.author ?? null
			};
		}
		return n.type === "note" ? {
			eventId: n.data,
			relayHints: [],
			authorPubkey: null
		} : null;
	} catch {
		return null;
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryEventUtils.ts
function tu(e) {
	return e.map((e) => [...e]);
}
function nu(e) {
	return {
		id: e.id,
		pubkey: e.pubkey,
		created_at: e.created_at,
		kind: e.kind,
		tags: tu(e.tags),
		content: e.content,
		sig: e.sig
	};
}
function ru(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/ipaddr.js/lib/ipaddr.js
var iu = /* @__PURE__ */ t(((e, t, n) => {
	(function(e) {
		let n = "(0?\\d+|0x[a-f0-9]+)", r = {
			fourOctet: RegExp(`^${n}\\.${n}\\.${n}\\.${n}$`, "i"),
			threeOctet: RegExp(`^${n}\\.${n}\\.${n}$`, "i"),
			twoOctet: RegExp(`^${n}\\.${n}$`, "i"),
			longValue: RegExp(`^${n}$`, "i")
		}, i = /* @__PURE__ */ RegExp("^0[0-7]+$", "i"), a = /* @__PURE__ */ RegExp("^0x[a-f0-9]+$", "i"), o = "%[0-9a-z]{1,}", s = "(?:[0-9a-f]+::?)+", c = {
			zoneIndex: RegExp(o, "i"),
			native: RegExp(`^(::)?(${s})?([0-9a-f]+)?(::)?(${o})?$`, "i"),
			deprecatedTransitional: RegExp(`^(?:::)(${n}\\.${n}\\.${n}\\.${n}(${o})?)$`, "i"),
			transitional: RegExp(`^((?:${s})|(?:::)(?:${s})?)${n}\\.${n}\\.${n}\\.${n}(${o})?$`, "i")
		};
		function l(e, t) {
			if (e.indexOf("::") !== e.lastIndexOf("::")) return null;
			let n = 0, r = -1, i = (e.match(c.zoneIndex) || [])[0], a, o;
			for (i && (i = i.substring(1), e = e.replace(/%.+$/, "")); (r = e.indexOf(":", r + 1)) >= 0;) n++;
			if (e.substr(0, 2) === "::" && n--, e.substr(-2, 2) === "::" && n--, n >= t) return null;
			for (o = t - n, a = ":"; o--;) a += "0:";
			return e = e.replace("::", a), e[0] === ":" && (e = e.slice(1)), e[e.length - 1] === ":" && (e = e.slice(0, -1)), t = (function() {
				let t = e.split(":"), n = [];
				for (let e = 0; e < t.length; e++) n.push(t[e].length > 4 ? NaN : parseInt(t[e], 16));
				return n;
			})(), {
				parts: t,
				zoneId: i
			};
		}
		function u(e, t, n, r) {
			if (e.length !== t.length) throw Error("ipaddr: cannot match CIDR for objects with different lengths");
			let i = 0, a;
			for (; r > 0;) {
				if (a = n - r, a < 0 && (a = 0), e[i] >> a !== t[i] >> a) return !1;
				r -= n, i += 1;
			}
			return !0;
		}
		function d(e) {
			if (a.test(e)) return parseInt(e, 16);
			if (e[0] === "0" && !isNaN(parseInt(e[1], 10))) {
				if (i.test(e)) return parseInt(e, 8);
				throw Error(`ipaddr: cannot parse ${e} as octal`);
			}
			return parseInt(e, 10);
		}
		function f(e, t) {
			for (; e.length < t;) e = `0${e}`;
			return e;
		}
		let p = {};
		p.IPv4 = (function() {
			function e(e) {
				if (e.length !== 4) throw Error("ipaddr: ipv4 octet count should be 4");
				let t, n;
				for (t = 0; t < e.length; t++) if (n = e[t], !(0 <= n && n <= 255)) throw Error("ipaddr: ipv4 octet should fit in 8 bits");
				this.octets = e;
			}
			return e.prototype.SpecialRanges = {
				unspecified: [[new e([
					0,
					0,
					0,
					0
				]), 8]],
				broadcast: [[new e([
					255,
					255,
					255,
					255
				]), 32]],
				multicast: [[new e([
					224,
					0,
					0,
					0
				]), 4]],
				linkLocal: [[new e([
					169,
					254,
					0,
					0
				]), 16]],
				loopback: [[new e([
					127,
					0,
					0,
					0
				]), 8]],
				carrierGradeNat: [[new e([
					100,
					64,
					0,
					0
				]), 10]],
				private: [
					[new e([
						10,
						0,
						0,
						0
					]), 8],
					[new e([
						172,
						16,
						0,
						0
					]), 12],
					[new e([
						192,
						168,
						0,
						0
					]), 16]
				],
				reserved: [
					[new e([
						192,
						0,
						0,
						0
					]), 24],
					[new e([
						192,
						0,
						2,
						0
					]), 24],
					[new e([
						192,
						88,
						99,
						0
					]), 24],
					[new e([
						198,
						18,
						0,
						0
					]), 15],
					[new e([
						198,
						51,
						100,
						0
					]), 24],
					[new e([
						203,
						0,
						113,
						0
					]), 24],
					[new e([
						240,
						0,
						0,
						0
					]), 4]
				],
				as112: [[new e([
					192,
					175,
					48,
					0
				]), 24], [new e([
					192,
					31,
					196,
					0
				]), 24]],
				amt: [[new e([
					192,
					52,
					193,
					0
				]), 24]]
			}, e.prototype.kind = function() {
				return "ipv4";
			}, e.prototype.match = function(e, t) {
				let n;
				if (t === void 0 && (n = e, e = n[0], t = n[1]), e.kind() !== "ipv4") throw Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
				return u(this.octets, e.octets, 8, t);
			}, e.prototype.prefixLengthFromSubnetMask = function() {
				let e = 0, t = !1, n = {
					0: 8,
					128: 7,
					192: 6,
					224: 5,
					240: 4,
					248: 3,
					252: 2,
					254: 1,
					255: 0
				}, r, i, a;
				for (r = 3; r >= 0; --r) if (i = this.octets[r], i in n) {
					if (a = n[i], t && a !== 0) return null;
					a !== 8 && (t = !0), e += a;
				} else return null;
				return 32 - e;
			}, e.prototype.range = function() {
				return p.subnetMatch(this, this.SpecialRanges);
			}, e.prototype.toByteArray = function() {
				return this.octets.slice(0);
			}, e.prototype.toIPv4MappedAddress = function() {
				return p.IPv6.parse(`::ffff:${this.toString()}`);
			}, e.prototype.toNormalizedString = function() {
				return this.toString();
			}, e.prototype.toString = function() {
				return this.octets.join(".");
			}, e;
		})(), p.IPv4.broadcastAddressFromCIDR = function(e) {
			try {
				let t = this.parseCIDR(e), n = t[0].toByteArray(), r = this.subnetMaskFromPrefixLength(t[1]).toByteArray(), i = [], a = 0;
				for (; a < 4;) i.push(parseInt(n[a], 10) | parseInt(r[a], 10) ^ 255), a++;
				return new this(i);
			} catch (e) {
				throw Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
			}
		}, p.IPv4.isIPv4 = function(e) {
			return this.parser(e) !== null;
		}, p.IPv4.isValid = function(e) {
			try {
				return new this(this.parser(e)), !0;
			} catch {
				return !1;
			}
		}, p.IPv4.isValidCIDR = function(e) {
			try {
				return this.parseCIDR(e), !0;
			} catch {
				return !1;
			}
		}, p.IPv4.isValidFourPartDecimal = function(e) {
			return !!(p.IPv4.isValid(e) && e.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/));
		}, p.IPv4.isValidCIDRFourPartDecimal = function(e) {
			let t = e.match(/^(.+)\/(\d+)$/);
			return !p.IPv4.isValidCIDR(e) || !t ? !1 : p.IPv4.isValidFourPartDecimal(t[1]);
		}, p.IPv4.networkAddressFromCIDR = function(e) {
			let t, n, r, i, a;
			try {
				for (t = this.parseCIDR(e), r = t[0].toByteArray(), a = this.subnetMaskFromPrefixLength(t[1]).toByteArray(), i = [], n = 0; n < 4;) i.push(parseInt(r[n], 10) & parseInt(a[n], 10)), n++;
				return new this(i);
			} catch (e) {
				throw Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
			}
		}, p.IPv4.parse = function(e) {
			let t = this.parser(e);
			if (t === null) throw Error("ipaddr: string is not formatted like an IPv4 Address");
			return new this(t);
		}, p.IPv4.parseCIDR = function(e) {
			let t;
			if (t = e.match(/^(.+)\/(\d+)$/)) {
				let e = parseInt(t[2]);
				if (e >= 0 && e <= 32) {
					let n = [this.parse(t[1]), e];
					return Object.defineProperty(n, "toString", { value: function() {
						return this.join("/");
					} }), n;
				}
			}
			throw Error("ipaddr: string is not formatted like an IPv4 CIDR range");
		}, p.IPv4.parser = function(e) {
			let t, n, i;
			if (t = e.match(r.fourOctet)) return (function() {
				let e = t.slice(1, 6), r = [];
				for (let t = 0; t < e.length; t++) n = e[t], r.push(d(n));
				return r;
			})();
			if (t = e.match(r.longValue)) {
				if (i = d(t[1]), i > 4294967295 || i < 0) throw Error("ipaddr: address outside defined range");
				return (function() {
					let e = [], t = 0;
					for (; t <= 24; t += 8) e.push(i >> t & 255);
					return e;
				})().reverse();
			}
			return (t = e.match(r.twoOctet)) ? (function() {
				let e = t.slice(1, 4), n = [];
				if (i = d(e[1]), i > 16777215 || i < 0) throw Error("ipaddr: address outside defined range");
				return n.push(d(e[0])), n.push(i >> 16 & 255), n.push(i >> 8 & 255), n.push(i & 255), n;
			})() : (t = e.match(r.threeOctet)) ? (function() {
				let e = t.slice(1, 5), n = [];
				if (i = d(e[2]), i > 65535 || i < 0) throw Error("ipaddr: address outside defined range");
				return n.push(d(e[0])), n.push(d(e[1])), n.push(i >> 8 & 255), n.push(i & 255), n;
			})() : null;
		}, p.IPv4.subnetMaskFromPrefixLength = function(e) {
			if (e = parseInt(e), Number.isNaN(e) || e < 0 || e > 32) throw Error("ipaddr: invalid IPv4 prefix length");
			let t = [
				0,
				0,
				0,
				0
			], n = 0, r = Math.floor(e / 8);
			for (; n < r;) t[n] = 255, n++;
			return r < 4 && (t[r] = 2 ** (e % 8) - 1 << 8 - e % 8), new this(t);
		}, p.IPv6 = (function() {
			function e(e, t) {
				let n, r;
				if (e.length === 16) for (this.parts = [], n = 0; n <= 14; n += 2) this.parts.push(e[n] << 8 | e[n + 1]);
				else if (e.length === 8) this.parts = e;
				else throw Error("ipaddr: ipv6 part count should be 8 or 16");
				for (n = 0; n < this.parts.length; n++) if (r = this.parts[n], !(0 <= r && r <= 65535)) throw Error("ipaddr: ipv6 part should fit in 16 bits");
				t && (this.zoneId = t);
			}
			return e.prototype.SpecialRanges = {
				unspecified: [new e([
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 128],
				linkLocal: [new e([
					65152,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 10],
				multicast: [new e([
					65280,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 8],
				loopback: [new e([
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					1
				]), 128],
				uniqueLocal: [new e([
					64512,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 7],
				ipv4Mapped: [new e([
					0,
					0,
					0,
					0,
					0,
					65535,
					0,
					0
				]), 96],
				deprecatedSiteLocal: [new e([
					65216,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 10],
				discard: [new e([
					256,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 64],
				rfc6145: [new e([
					0,
					0,
					0,
					0,
					65535,
					0,
					0,
					0
				]), 96],
				rfc6052: [[new e([
					100,
					65435,
					0,
					0,
					0,
					0,
					0,
					0
				]), 96], [new e([
					100,
					65435,
					1,
					0,
					0,
					0,
					0,
					0
				]), 48]],
				"6to4": [new e([
					8194,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 16],
				teredo: [new e([
					8193,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 32],
				benchmarking: [new e([
					8193,
					2,
					0,
					0,
					0,
					0,
					0,
					0
				]), 48],
				amt: [new e([
					8193,
					3,
					0,
					0,
					0,
					0,
					0,
					0
				]), 32],
				as112v6: [[new e([
					8193,
					4,
					274,
					0,
					0,
					0,
					0,
					0
				]), 48], [new e([
					9760,
					79,
					32768,
					0,
					0,
					0,
					0,
					0
				]), 48]],
				deprecatedOrchid: [new e([
					8193,
					16,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				orchid2: [new e([
					8193,
					32,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				droneRemoteIdProtocolEntityTags: [new e([
					8193,
					48,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				segmentRouting: [new e([
					24320,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 16],
				reserved: [
					[new e([
						8193,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					]), 23],
					[new e([
						8193,
						3512,
						0,
						0,
						0,
						0,
						0,
						0
					]), 32],
					[new e([
						16383,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					]), 20]
				]
			}, e.prototype.isIPv4MappedAddress = function() {
				return this.range() === "ipv4Mapped";
			}, e.prototype.kind = function() {
				return "ipv6";
			}, e.prototype.match = function(e, t) {
				let n;
				if (t === void 0 && (n = e, e = n[0], t = n[1]), e.kind() !== "ipv6") throw Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
				return u(this.parts, e.parts, 16, t);
			}, e.prototype.prefixLengthFromSubnetMask = function() {
				let e = 0, t = !1, n = {
					0: 16,
					32768: 15,
					49152: 14,
					57344: 13,
					61440: 12,
					63488: 11,
					64512: 10,
					65024: 9,
					65280: 8,
					65408: 7,
					65472: 6,
					65504: 5,
					65520: 4,
					65528: 3,
					65532: 2,
					65534: 1,
					65535: 0
				}, r, i;
				for (let a = 7; a >= 0; --a) if (r = this.parts[a], r in n) {
					if (i = n[r], t && i !== 0) return null;
					i !== 16 && (t = !0), e += i;
				} else return null;
				return 128 - e;
			}, e.prototype.range = function() {
				return p.subnetMatch(this, this.SpecialRanges);
			}, e.prototype.toByteArray = function() {
				let e, t = [], n = this.parts;
				for (let r = 0; r < n.length; r++) e = n[r], t.push(e >> 8), t.push(e & 255);
				return t;
			}, e.prototype.toFixedLengthString = function() {
				let e = (function() {
					let e = [];
					for (let t = 0; t < this.parts.length; t++) e.push(f(this.parts[t].toString(16), 4));
					return e;
				}).call(this).join(":"), t = "";
				return this.zoneId && (t = `%${this.zoneId}`), e + t;
			}, e.prototype.toIPv4Address = function() {
				if (!this.isIPv4MappedAddress()) throw Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
				let e = this.parts.slice(-2), t = e[0], n = e[1];
				return new p.IPv4([
					t >> 8,
					t & 255,
					n >> 8,
					n & 255
				]);
			}, e.prototype.toNormalizedString = function() {
				let e = (function() {
					let e = [];
					for (let t = 0; t < this.parts.length; t++) e.push(this.parts[t].toString(16));
					return e;
				}).call(this).join(":"), t = "";
				return this.zoneId && (t = `%${this.zoneId}`), e + t;
			}, e.prototype.toRFC5952String = function() {
				let e = /((^|:)(0(:|$)){2,})/g, t = "";
				this.zoneId && (t = `%${this.zoneId}`);
				let n = this.toNormalizedString(), r = n.slice(0, n.length - t.length), i = 0, a = -1, o = -1, s;
				for (; s = e.exec(r);) {
					let e = (s[0].match(/0/g) || []).length;
					e > o && (o = e, i = s.index, a = s[0].length);
				}
				return a < 0 ? r + t : `${r.substring(0, i)}::${r.substring(i + a)}${t}`;
			}, e.prototype.toString = function() {
				return this.toRFC5952String();
			}, e;
		})(), p.IPv6.broadcastAddressFromCIDR = function(e) {
			try {
				let t = this.parseCIDR(e), n = t[0].toByteArray(), r = this.subnetMaskFromPrefixLength(t[1]).toByteArray(), i = [], a = 0;
				for (; a < 16;) i.push(parseInt(n[a], 10) | parseInt(r[a], 10) ^ 255), a++;
				return new this(i);
			} catch (e) {
				throw Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
			}
		}, p.IPv6.isIPv6 = function(e) {
			return this.parser(e) !== null;
		}, p.IPv6.isValid = function(e) {
			if (typeof e == "string" && e.indexOf(":") === -1) return !1;
			try {
				let t = this.parser(e);
				return new this(t.parts, t.zoneId), !0;
			} catch {
				return !1;
			}
		}, p.IPv6.isValidCIDR = function(e) {
			if (typeof e == "string" && e.indexOf(":") === -1) return !1;
			try {
				return this.parseCIDR(e), !0;
			} catch {
				return !1;
			}
		}, p.IPv6.networkAddressFromCIDR = function(e) {
			let t, n, r, i, a;
			try {
				for (t = this.parseCIDR(e), r = t[0].toByteArray(), a = this.subnetMaskFromPrefixLength(t[1]).toByteArray(), i = [], n = 0; n < 16;) i.push(parseInt(r[n], 10) & parseInt(a[n], 10)), n++;
				return new this(i);
			} catch (e) {
				throw Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
			}
		}, p.IPv6.parse = function(e) {
			let t = this.parser(e);
			if (t === null) throw Error("ipaddr: string is not formatted like an IPv6 Address");
			return new this(t.parts, t.zoneId);
		}, p.IPv6.parseCIDR = function(e) {
			let t, n, r;
			if ((n = e.match(/^(.+)\/(\d+)$/)) && (t = parseInt(n[2]), t >= 0 && t <= 128)) return r = [this.parse(n[1]), t], Object.defineProperty(r, "toString", { value: function() {
				return this.join("/");
			} }), r;
			throw Error("ipaddr: string is not formatted like an IPv6 CIDR range");
		}, p.IPv6.parser = function(e) {
			let t, n, r, i, a, o;
			if (r = e.match(c.deprecatedTransitional)) return this.parser(`::ffff:${r[1]}`);
			if (c.native.test(e)) return l(e, 8);
			if ((r = e.match(c.transitional)) && (o = r[6] || "", t = r[1], r[1].endsWith("::") || (t = t.slice(0, -1)), t = l(t + o, 6), t && t.parts)) {
				for (a = [
					parseInt(r[2]),
					parseInt(r[3]),
					parseInt(r[4]),
					parseInt(r[5])
				], n = 0; n < a.length; n++) if (i = a[n], !(0 <= i && i <= 255)) return null;
				return t.parts.push(a[0] << 8 | a[1]), t.parts.push(a[2] << 8 | a[3]), {
					parts: t.parts,
					zoneId: t.zoneId
				};
			}
			return null;
		}, p.IPv6.subnetMaskFromPrefixLength = function(e) {
			if (e = parseInt(e), Number.isNaN(e) || e < 0 || e > 128) throw Error("ipaddr: invalid IPv6 prefix length");
			let t = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			], n = 0, r = Math.floor(e / 8);
			for (; n < r;) t[n] = 255, n++;
			return r < 16 && (t[r] = 2 ** (e % 8) - 1 << 8 - e % 8), new this(t);
		}, p.fromByteArray = function(e) {
			let t = e.length;
			if (t === 4) return new p.IPv4(e);
			if (t === 16) return new p.IPv6(e);
			throw Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
		}, p.isValid = function(e) {
			return p.IPv6.isValid(e) || p.IPv4.isValid(e);
		}, p.isValidCIDR = function(e) {
			return p.IPv6.isValidCIDR(e) || p.IPv4.isValidCIDR(e);
		}, p.parse = function(e) {
			if (p.IPv6.isValid(e)) return p.IPv6.parse(e);
			if (p.IPv4.isValid(e)) return p.IPv4.parse(e);
			throw Error("ipaddr: the address has neither IPv6 nor IPv4 format");
		}, p.parseCIDR = function(e) {
			try {
				return p.IPv6.parseCIDR(e);
			} catch {
				try {
					return p.IPv4.parseCIDR(e);
				} catch (e) {
					throw Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format", { cause: e });
				}
			}
		}, p.process = function(e) {
			let t = this.parse(e);
			return t.kind() === "ipv6" && t.isIPv4MappedAddress() ? t.toIPv4Address() : t;
		}, p.subnetMatch = function(e, t, n) {
			let r, i, a, o;
			for (i in n ??= "unicast", t) if (Object.prototype.hasOwnProperty.call(t, i)) {
				for (a = t[i], a[0] && !(a[0] instanceof Array) && (a = [a]), r = 0; r < a.length; r++) if (o = a[r], e.kind() === o[0].kind() && e.match.apply(e, o)) return i;
			}
			return n;
		}, t !== void 0 && t.exports ? t.exports = p : e.ipaddr = p;
	})(n);
})), au = /* @__PURE__ */ e(iu(), 1);
function ou(e) {
	let t = e ?? globalThis.location?.origin;
	if (!t) return null;
	try {
		return new URL(t);
	} catch {
		return null;
	}
}
function su(e) {
	return e.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function cu(e) {
	let t = su(e);
	if (!t || !au.isValid(t)) return !1;
	try {
		return au.parse(t).range() !== "unicast";
	} catch {
		return !0;
	}
}
function lu(e) {
	let t = e.trim().toLowerCase();
	return !(!t || t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") || cu(t) || !t.includes("."));
}
function uu(e) {
	let t = e.hostname.trim().toLowerCase();
	return t ? t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") ? !0 : cu(t) : !1;
}
function du(e, t) {
	return !!t && e.origin === t.origin;
}
function fu(e, t = {}) {
	if (typeof e != "string") return null;
	let n = e.trim();
	if (!n) return null;
	let r;
	try {
		r = new URL(n);
	} catch {
		return null;
	}
	if (n.startsWith("//") || r.username || r.password) return null;
	let i = ou(t.currentOrigin), a = du(r, i) && !!i && uu(i);
	if (r.protocol === "http:") {
		if (!a) return null;
	} else if (r.protocol !== "https:") return null;
	return !a && !lu(r.hostname) ? null : (r.hash = "", r.toString());
}
function pu(e, t = {}) {
	if (!e) return !1;
	let n = fu(e, t);
	if (!n) return !1;
	let r = ou(t.currentOrigin);
	if (!r) return !1;
	try {
		return new URL(n).origin === r.origin;
	} catch {
		return !1;
	}
}
function mu(e, t = {}) {
	let n = fu(e, t);
	if (!n) return "";
	let r = new URL(n);
	return r.searchParams.has("profile") || r.searchParams.set("profile", "true"), r.toString();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedComposerContextValidation.ts
var hu = class extends Error {
	constructor() {
		super("invalid_composer_context"), this.name = "EmbedComposerContextValidationError";
	}
};
function gu() {
	throw new hu();
}
function _u(e) {
	return o(e);
}
function vu(e) {
	(typeof e != "string" || eu(e, { relayValidation: "strict" }) === null) && gu();
}
function yu(e, t) {
	if (!Object.prototype.hasOwnProperty.call(e, t)) return;
	let n = e[t];
	n != null && (typeof n != "string" || n.trim().length === 0) && gu();
}
function bu(e) {
	if (e != null) {
		if (n(e) || gu(), vu(e.reference), e.relays !== void 0) {
			Array.isArray(e.relays) || gu();
			for (let t of e.relays) (typeof t != "string" || Ql.sanitizeExternalRelayUrls([t], { limit: 1 }).length !== 1) && gu();
		}
		yu(e, "name"), yu(e, "about");
	}
}
function xu(e) {
	if (n(e) || gu(), e.reply !== void 0 && e.reply !== null && vu(e.reply), e.quotes !== void 0 && e.quotes !== null) {
		Array.isArray(e.quotes) || gu();
		for (let t of e.quotes) vu(t);
	}
	return e.content !== void 0 && e.content !== null && typeof e.content != "string" && gu(), bu(e.channel), e;
}
function Su(e, t) {
	if (!n(e)) return {};
	let r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = r.get(e.eventId);
		t ? t.push(e) : r.set(e.eventId, [e]);
	}
	let i = {};
	for (let [t, n] of r) try {
		if (!Object.prototype.hasOwnProperty.call(e, t)) continue;
		let r = e[t];
		if (!ru(r)) continue;
		let a = nu(r);
		if (!Dr(a) || Ar(a) !== a.id || !Fr(a) || a.id !== t || n.some((e) => e.authorPubkey !== null && a.pubkey !== e.authorPubkey)) continue;
		i[t] = nu(a);
	} catch {
		continue;
	}
	return i;
}
function Cu(e) {
	if (!n(e)) return {};
	let t = {};
	for (let [r, i] of Object.entries(e)) {
		if (!_u(r) || !n(i)) continue;
		let e = typeof i.displayName == "string" && i.displayName.trim() || null, a = typeof i.picture == "string" ? fu(i.picture) : null;
		(e || a) && (t[r] = {
			displayName: e,
			picture: a
		});
	}
	return t;
}
export { n as _, pu as a, nu as c, Ql as d, Cs as f, o as g, a as h, mu as i, ru as l, Fr as m, Su as n, fu as o, Dr as p, xu as r, iu as s, Cu as t, eu as u };
