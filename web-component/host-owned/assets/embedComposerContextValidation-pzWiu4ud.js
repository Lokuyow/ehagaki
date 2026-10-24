import { i as e, t } from "./rolldown-runtime-CwxnZyOB.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/utils.js
function n(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function r(e, t = "") {
	if (!Number.isSafeInteger(e) || e < 0) {
		let n = t && `"${t}" `;
		throw Error(`${n}expected integer >= 0, got ${e}`);
	}
}
function i(e, t, r = "") {
	let i = n(e), a = e?.length, o = t !== void 0;
	if (!i || o && a !== t) {
		let n = r && `"${r}" `, s = o ? ` of length ${t}` : "", c = i ? `length=${a}` : `type=${typeof e}`;
		throw Error(n + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function a(e) {
	if (typeof e != "function" || typeof e.create != "function") throw Error("Hash must wrapped by utils.createHasher");
	r(e.outputLen), r(e.blockLen);
}
function o(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function s(e, t) {
	i(e, void 0, "digestInto() output");
	let n = t.outputLen;
	if (e.length < n) throw Error("\"digestInto() output\" expected to be of length >=" + n);
}
function c(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function l(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function u(e, t) {
	return e << 32 - t | e >>> t;
}
var d = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", f = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function p(e) {
	if (i(e), d) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += f[e[n]];
	return t;
}
var m = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function h(e) {
	if (e >= m._0 && e <= m._9) return e - m._0;
	if (e >= m.A && e <= m.F) return e - (m.A - 10);
	if (e >= m.a && e <= m.f) return e - (m.a - 10);
}
function g(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	if (d) return Uint8Array.fromHex(e);
	let t = e.length, n = t / 2;
	if (t % 2) throw Error("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = h(e.charCodeAt(i)), a = h(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw Error("hex string expected, got non-hex character \"" + t + "\" at index " + i);
		}
		r[t] = n * 16 + a;
	}
	return r;
}
function _(...e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		i(r), t += r.length;
	}
	let n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t++) {
		let i = e[t];
		n.set(i, r), r += i.length;
	}
	return n;
}
function v(e, t = {}) {
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
function y(e = 32) {
	let t = typeof globalThis == "object" ? globalThis.crypto : null;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined");
	return t.getRandomValues(new Uint8Array(e));
}
var b = (e) => ({ oid: Uint8Array.from([
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
function x(e, t, n) {
	return e & t ^ ~e & n;
}
function S(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var C = class {
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
		this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = l(this.buffer);
	}
	update(e) {
		o(this), i(e);
		let { view: t, buffer: n, blockLen: r } = this, a = e.length;
		for (let i = 0; i < a;) {
			let o = Math.min(r - this.pos, a - i);
			if (o === r) {
				let t = l(e);
				for (; r <= a - i; i += r) this.process(t, i);
			} else n.set(e.subarray(i, i + o), this.pos), this.pos += o, i += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		o(this), s(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, c(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let u = l(e), d = this.outputLen;
		if (d % 4) throw Error("_sha2: outputLen must be aligned to 32bit");
		let f = d / 4, p = this.get();
		if (f > p.length) throw Error("_sha2: outputLen bigger than state");
		for (let e = 0; e < f; e++) u.setUint32(4 * e, p[e], i);
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
}, w = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), T = /* @__PURE__ */ Uint32Array.from([
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
]), E = /* @__PURE__ */ new Uint32Array(64), D = class extends C {
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
		for (let n = 0; n < 16; n++, t += 4) E[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = E[e - 15], n = E[e - 2], r = u(t, 7) ^ u(t, 18) ^ t >>> 3, i = u(n, 17) ^ u(n, 19) ^ n >>> 10;
			E[e] = i + E[e - 7] + r + E[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = u(o, 6) ^ u(o, 11) ^ u(o, 25), d = l + t + x(o, s, c) + T[e] + E[e] | 0, f = (u(n, 2) ^ u(n, 13) ^ u(n, 22)) + S(n, r, i) | 0;
			l = c, c = s, s = o, o = a + d | 0, a = i, i = r, r = n, n = d + f | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		c(E);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), c(this.buffer);
	}
}, O = class extends D {
	A = w[0] | 0;
	B = w[1] | 0;
	C = w[2] | 0;
	D = w[3] | 0;
	E = w[4] | 0;
	F = w[5] | 0;
	G = w[6] | 0;
	H = w[7] | 0;
	constructor() {
		super(32);
	}
}, k = /* @__PURE__ */ v(() => new O(), /* @__PURE__ */ b(1)), A = /* @__PURE__ */ BigInt(0), j = /* @__PURE__ */ BigInt(1);
function M(e, t = "") {
	if (typeof e != "boolean") {
		let n = t && `"${t}" `;
		throw Error(n + "expected boolean, got type=" + typeof e);
	}
	return e;
}
function N(e) {
	if (typeof e == "bigint") {
		if (!re(e)) throw Error("positive bigint expected, got " + e);
	} else r(e);
	return e;
}
function P(e) {
	let t = N(e).toString(16);
	return t.length & 1 ? "0" + t : t;
}
function F(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	return e === "" ? A : BigInt("0x" + e);
}
function I(e) {
	return F(p(e));
}
function L(e) {
	return F(p(te(i(e)).reverse()));
}
function R(e, t) {
	r(t), e = N(e);
	let n = g(e.toString(16).padStart(t * 2, "0"));
	if (n.length !== t) throw Error("number too large");
	return n;
}
function ee(e, t) {
	return R(e, t).reverse();
}
function te(e) {
	return Uint8Array.from(e);
}
function ne(e) {
	return Uint8Array.from(e, (t, n) => {
		let r = t.charCodeAt(0);
		if (t.length !== 1 || r > 127) throw Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
		return r;
	});
}
var re = (e) => typeof e == "bigint" && A <= e;
function ie(e, t, n) {
	return re(e) && re(t) && re(n) && t <= e && e < n;
}
function ae(e, t, n, r) {
	if (!ie(t, n, r)) throw Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function oe(e) {
	let t = 0;
	for (; e > A; e >>= j, t += 1);
	return t;
}
var se = (e) => (j << BigInt(e)) - j;
function ce(e, t, n) {
	if (r(e, "hashLen"), r(t, "qByteLen"), typeof n != "function") throw Error("hmacFn must be a function");
	let i = (e) => new Uint8Array(e), a = Uint8Array.of(), o = Uint8Array.of(0), s = Uint8Array.of(1), c = i(e), l = i(e), u = 0, d = () => {
		c.fill(1), l.fill(0), u = 0;
	}, f = (...e) => n(l, _(c, ...e)), p = (e = a) => {
		l = f(o, e), c = f(), e.length !== 0 && (l = f(s, e), c = f());
	}, m = () => {
		if (u++ >= 1e3) throw Error("drbg: tried max amount of iterations");
		let e = 0, n = [];
		for (; e < t;) {
			c = f();
			let t = c.slice();
			n.push(t), e += c.length;
		}
		return _(...n);
	};
	return (e, t) => {
		d(), p(e);
		let n;
		for (; !(n = t(m()));) p();
		return d(), n;
	};
}
function le(e, t = {}, n = {}) {
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
function ue(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		let i = t.get(n);
		if (i !== void 0) return i;
		let a = e(n, ...r);
		return t.set(n, a), a;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/modular.js
var z = /* @__PURE__ */ BigInt(0), B = /* @__PURE__ */ BigInt(1), de = /* @__PURE__ */ BigInt(2), fe = /* @__PURE__ */ BigInt(3), pe = /* @__PURE__ */ BigInt(4), me = /* @__PURE__ */ BigInt(5), he = /* @__PURE__ */ BigInt(7), ge = /* @__PURE__ */ BigInt(8), _e = /* @__PURE__ */ BigInt(9), ve = /* @__PURE__ */ BigInt(16);
function V(e, t) {
	let n = e % t;
	return n >= z ? n : t + n;
}
function H(e, t, n) {
	let r = e;
	for (; t-- > z;) r *= r, r %= n;
	return r;
}
function ye(e, t) {
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
function be(e, t, n) {
	if (!e.eql(e.sqr(t), n)) throw Error("Cannot find square root");
}
function xe(e, t) {
	let n = (e.ORDER + B) / pe, r = e.pow(t, n);
	return be(e, r, t), r;
}
function Se(e, t) {
	let n = (e.ORDER - me) / ge, r = e.mul(t, de), i = e.pow(r, n), a = e.mul(t, i), o = e.mul(e.mul(a, de), i), s = e.mul(a, e.sub(o, e.ONE));
	return be(e, s, t), s;
}
function Ce(e) {
	let t = Ne(e), n = we(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + he) / ve;
	return (e, t) => {
		let n = e.pow(t, o), s = e.mul(n, r), c = e.mul(n, i), l = e.mul(n, a), u = e.eql(e.sqr(s), t), d = e.eql(e.sqr(c), t);
		n = e.cmov(n, s, u), s = e.cmov(l, c, d);
		let f = e.eql(e.sqr(s), t), p = e.cmov(n, s, f);
		return be(e, p, t), p;
	};
}
function we(e) {
	if (e < fe) throw Error("sqrt is not defined for small field");
	let t = e - B, n = 0;
	for (; t % de === z;) t /= de, n++;
	let r = de, i = Ne(e);
	for (; Ae(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return xe;
	let a = i.pow(r, t), o = (t + B) / de;
	return function(e, r) {
		if (e.is0(r)) return r;
		if (Ae(e, r) !== 1) throw Error("Cannot find square root");
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
function Te(e) {
	return e % pe === fe ? xe : e % ge === me ? Se : e % ve === _e ? Ce(e) : we(e);
}
var Ee = [
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
function De(e) {
	return le(e, Ee.reduce((e, t) => (e[t] = "function", e), {
		ORDER: "bigint",
		BYTES: "number",
		BITS: "number"
	})), e;
}
function Oe(e, t, n) {
	if (n < z) throw Error("invalid exponent, negatives unsupported");
	if (n === z) return e.ONE;
	if (n === B) return t;
	let r = e.ONE, i = t;
	for (; n > z;) n & B && (r = e.mul(r, i)), i = e.sqr(i), n >>= B;
	return r;
}
function ke(e, t, n = !1) {
	let r = Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((t, n, i) => e.is0(n) ? t : (r[i] = t, e.mul(t, n)), e.ONE), a = e.inv(i);
	return t.reduceRight((t, n, i) => e.is0(n) ? t : (r[i] = e.mul(t, r[i]), e.mul(t, n)), a), r;
}
function Ae(e, t) {
	let n = (e.ORDER - B) / de, r = e.pow(t, n), i = e.eql(r, e.ONE), a = e.eql(r, e.ZERO), o = e.eql(r, e.neg(e.ONE));
	if (!i && !a && !o) throw Error("invalid Legendre symbol result");
	return i ? 1 : a ? 0 : -1;
}
function je(e, t) {
	t !== void 0 && r(t);
	let n = t === void 0 ? e.toString(2).length : t;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
var Me = class {
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
		let { nBitLength: r, nByteLength: i } = je(e, n);
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
		return Oe(this, e, t);
	}
	div(e, t) {
		return V(e * ye(t, this.ORDER), this.ORDER);
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
		return ye(e, this.ORDER);
	}
	sqrt(e) {
		return this._sqrt ||= Te(this.ORDER), this._sqrt(this, e);
	}
	toBytes(e) {
		return this.isLE ? ee(e, this.BYTES) : R(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		i(e);
		let { _lengths: n, BYTES: r, isLE: a, ORDER: o, _mod: s } = this;
		if (n) {
			if (!n.includes(e.length) || e.length > r) throw Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
			let t = new Uint8Array(r);
			t.set(e, a ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== r) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
		let c = a ? L(e) : I(e);
		if (s && (c = V(c, o)), !t && !this.isValid(c)) throw Error("invalid field element: outside of range 0..ORDER");
		return c;
	}
	invertBatch(e) {
		return ke(this, e);
	}
	cmov(e, t, n) {
		return n ? t : e;
	}
};
function Ne(e, t = {}) {
	return new Me(e, t);
}
function Pe(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	let t = e.toString(2).length;
	return Math.ceil(t / 8);
}
function Fe(e) {
	let t = Pe(e);
	return t + Math.ceil(t / 2);
}
function Ie(e, t, n = !1) {
	i(e);
	let r = e.length, a = Pe(t), o = Fe(t);
	if (r < 16 || r < o || r > 1024) throw Error("expected " + o + "-1024 bytes of input, got " + r);
	let s = V(n ? L(e) : I(e), t - B) + B;
	return n ? ee(s, a) : R(s, a);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/curve.js
var Le = /* @__PURE__ */ BigInt(0), Re = /* @__PURE__ */ BigInt(1);
function ze(e, t) {
	let n = t.negate();
	return e ? n : t;
}
function Be(e, t) {
	let n = ke(e.Fp, t.map((e) => e.Z));
	return t.map((t, r) => e.fromAffine(t.toAffine(n[r])));
}
function Ve(e, t) {
	if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function He(e, t) {
	Ve(e, t);
	let n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e;
	return {
		windows: n,
		windowSize: r,
		mask: se(e),
		maxNumber: i,
		shiftBy: BigInt(e)
	};
}
function Ue(e, t, n) {
	let { windowSize: r, mask: i, maxNumber: a, shiftBy: o } = n, s = Number(e & i), c = e >> o;
	s > r && (s -= a, c += Re);
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
var We = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap();
function Ke(e) {
	return Ge.get(e) || 1;
}
function qe(e) {
	if (e !== Le) throw Error("invalid wNAF");
}
var Je = class {
	BASE;
	ZERO;
	Fn;
	bits;
	constructor(e, t) {
		this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = t;
	}
	_unsafeLadder(e, t, n = this.ZERO) {
		let r = e;
		for (; t > Le;) t & Re && (n = n.add(r)), r = r.double(), t >>= Re;
		return n;
	}
	precomputeWindow(e, t) {
		let { windows: n, windowSize: r } = He(t, this.bits), i = [], a = e, o = a;
		for (let e = 0; e < n; e++) {
			o = a, i.push(o);
			for (let e = 1; e < r; e++) o = o.add(a), i.push(o);
			a = o.double();
		}
		return i;
	}
	wNAF(e, t, n) {
		if (!this.Fn.isValid(n)) throw Error("invalid scalar");
		let r = this.ZERO, i = this.BASE, a = He(e, this.bits);
		for (let e = 0; e < a.windows; e++) {
			let { nextN: o, offset: s, isZero: c, isNeg: l, isNegF: u, offsetF: d } = Ue(n, e, a);
			n = o, c ? i = i.add(ze(u, t[d])) : r = r.add(ze(l, t[s]));
		}
		return qe(n), {
			p: r,
			f: i
		};
	}
	wNAFUnsafe(e, t, n, r = this.ZERO) {
		let i = He(e, this.bits);
		for (let e = 0; e < i.windows && n !== Le; e++) {
			let { nextN: a, offset: o, isZero: s, isNeg: c } = Ue(n, e, i);
			if (n = a, !s) {
				let e = t[o];
				r = r.add(c ? e.negate() : e);
			}
		}
		return qe(n), r;
	}
	getPrecomputes(e, t, n) {
		let r = We.get(t);
		return r || (r = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (r = n(r)), We.set(t, r))), r;
	}
	cached(e, t, n) {
		let r = Ke(e);
		return this.wNAF(r, this.getPrecomputes(r, e, n), t);
	}
	unsafe(e, t, n, r) {
		let i = Ke(e);
		return i === 1 ? this._unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
	}
	createCache(e, t) {
		Ve(t, this.bits), Ge.set(e, t), We.delete(e);
	}
	hasCache(e) {
		return Ke(e) !== 1;
	}
};
function Ye(e, t, n, r) {
	let i = t, a = e.ZERO, o = e.ZERO;
	for (; n > Le || r > Le;) n & Re && (a = a.add(i)), r & Re && (o = o.add(i)), i = i.double(), n >>= Re, r >>= Re;
	return {
		p1: a,
		p2: o
	};
}
function Xe(e, t, n) {
	if (t) {
		if (t.ORDER !== e) throw Error("Field.ORDER must match order: Fp == p, Fn == n");
		return De(t), t;
	}
	return Ne(e, { isLE: n });
}
function Ze(e, t, n = {}, r) {
	if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw Error(`expected valid ${e} CURVE object`);
	for (let e of [
		"p",
		"n",
		"h"
	]) {
		let n = t[e];
		if (!(typeof n == "bigint" && n > Le)) throw Error(`CURVE.${e} must be positive bigint`);
	}
	let i = Xe(t.p, n.Fp, r), a = Xe(t.n, n.Fn, r), o = [
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
function Qe(e, t) {
	return function(n) {
		let r = e(n);
		return {
			secretKey: r,
			publicKey: t(r)
		};
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hmac.js
var $e = class {
	oHash;
	iHash;
	blockLen;
	outputLen;
	finished = !1;
	destroyed = !1;
	constructor(e, t) {
		if (a(e), i(t, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function") throw Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let n = this.blockLen, r = new Uint8Array(n);
		r.set(t.length > n ? e.create().update(t).digest() : t);
		for (let e = 0; e < r.length; e++) r[e] ^= 54;
		this.iHash.update(r), this.oHash = e.create();
		for (let e = 0; e < r.length; e++) r[e] ^= 106;
		this.oHash.update(r), c(r);
	}
	update(e) {
		return o(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		o(this), i(e, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
}, et = (e, t, n) => new $e(e, t).update(n).digest();
et.create = (e, t) => new $e(e, t);
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/weierstrass.js
var tt = (e, t) => (e + (e >= 0 ? t : -t) / ct) / t;
function nt(e, t, n) {
	let [[r, i], [a, o]] = t, s = tt(o * e, n), c = tt(-i * e, n), l = e - s * r - c * a, u = -s * i - c * o, d = l < ot, f = u < ot;
	d && (l = -l), f && (u = -u);
	let p = se(Math.ceil(oe(n) / 2)) + st;
	if (l < ot || l >= p || u < ot || u >= p) throw Error("splitScalar (endomorphism): failed, k=" + e);
	return {
		k1neg: d,
		k1: l,
		k2neg: f,
		k2: u
	};
}
function rt(e) {
	if (![
		"compact",
		"recovered",
		"der"
	].includes(e)) throw Error("Signature format must be \"compact\", \"recovered\", or \"der\"");
	return e;
}
function it(e, t) {
	let n = {};
	for (let r of Object.keys(t)) n[r] = e[r] === void 0 ? t[r] : e[r];
	return M(n.lowS, "lowS"), M(n.prehash, "prehash"), n.format !== void 0 && rt(n.format), n;
}
var at = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = at;
			if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = P(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? P(i.length / 2 | 128) : "";
			return P(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = at, r = 0;
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
			let { Err: t } = at;
			if (e < ot) throw new t("integer: negative integers are not allowed");
			let n = P(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = at;
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return I(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: n, _tlv: r } = at, a = i(e, void 0, "signature"), { v: o, l: s } = r.decode(48, a);
		if (s.length) throw new t("invalid signature: left bytes after parsing");
		let { v: c, l } = r.decode(2, o), { v: u, l: d } = r.decode(2, l);
		if (d.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: n.decode(c),
			s: n.decode(u)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = at, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
}, ot = BigInt(0), st = BigInt(1), ct = BigInt(2), lt = BigInt(3), ut = BigInt(4);
function dt(e, t = {}) {
	let n = Ze("weierstrass", e, t), { Fp: r, Fn: a } = n, o = n.CURVE, { h: s, n: c } = o;
	le(t, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object"
	});
	let { endo: l } = t;
	if (l && (!r.is0(o.a) || typeof l.beta != "bigint" || !Array.isArray(l.basises))) throw Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	let u = pt(r, a);
	function d() {
		if (!r.isOdd) throw Error("compression is not supported: Field does not have .isOdd()");
	}
	function f(e, t, n) {
		let { x: i, y: a } = t.toAffine(), o = r.toBytes(i);
		return M(n, "isCompressed"), n ? (d(), _(ft(!r.isOdd(a)), o)) : _(Uint8Array.of(4), o, r.toBytes(a));
	}
	function m(e) {
		i(e, void 0, "Point");
		let { publicKey: t, publicKeyUncompressed: n } = u, a = e.length, o = e[0], s = e.subarray(1);
		if (a === t && (o === 2 || o === 3)) {
			let e = r.fromBytes(s);
			if (!r.isValid(e)) throw Error("bad point: is not on curve, wrong x");
			let t = y(e), n;
			try {
				n = r.sqrt(t);
			} catch (e) {
				let t = e instanceof Error ? ": " + e.message : "";
				throw Error("bad point: is not on curve, sqrt error" + t);
			}
			d();
			let i = r.isOdd(n);
			return (o & 1) == 1 !== i && (n = r.neg(n)), {
				x: e,
				y: n
			};
		}
		if (a === n && o === 4) {
			let e = r.BYTES, t = r.fromBytes(s.subarray(0, e)), n = r.fromBytes(s.subarray(e, e * 2));
			if (!b(t, n)) throw Error("bad point: is not on curve");
			return {
				x: t,
				y: n
			};
		}
		throw Error(`bad point: got length ${a}, expected compressed=${t} or uncompressed=${n}`);
	}
	let h = t.toBytes || f, v = t.fromBytes || m;
	function y(e) {
		let t = r.sqr(e), n = r.mul(t, e);
		return r.add(r.add(n, r.mul(e, o.a)), o.b);
	}
	function b(e, t) {
		let n = r.sqr(t), i = y(e);
		return r.eql(n, i);
	}
	if (!b(o.Gx, o.Gy)) throw Error("bad curve params: generator point");
	let x = r.mul(r.pow(o.a, lt), ut), S = r.mul(r.sqr(o.b), BigInt(27));
	if (r.is0(r.add(x, S))) throw Error("bad curve params: a or b");
	function C(e, t, n = !1) {
		if (!r.isValid(t) || n && r.is0(t)) throw Error(`bad point coordinate ${e}`);
		return t;
	}
	function w(e) {
		if (!(e instanceof k)) throw Error("Weierstrass Point expected");
	}
	function T(e) {
		if (!l || !l.basises) throw Error("no endo");
		return nt(e, l.basises, a.ORDER);
	}
	let E = ue((e, t) => {
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
	}), D = ue((e) => {
		if (e.is0()) {
			if (t.allowInfinityPoint && !r.is0(e.Y)) return;
			throw Error("bad point: ZERO");
		}
		let { x: n, y: i } = e.toAffine();
		if (!r.isValid(n) || !r.isValid(i)) throw Error("bad point: x or y not field elements");
		if (!b(n, i)) throw Error("bad point: equation left != right");
		if (!e.isTorsionFree()) throw Error("bad point: not in prime-order subgroup");
		return !0;
	});
	function O(e, t, n, i, a) {
		return n = new k(r.mul(n.X, e), n.Y, n.Z), t = ze(i, t), n = ze(a, n), t.add(n);
	}
	class k {
		static BASE = new k(o.Gx, o.Gy, r.ONE);
		static ZERO = new k(r.ZERO, r.ONE, r.ZERO);
		static Fp = r;
		static Fn = a;
		X;
		Y;
		Z;
		constructor(e, t, n) {
			this.X = C("x", e), this.Y = C("y", t, !0), this.Z = C("z", n), Object.freeze(this);
		}
		static CURVE() {
			return o;
		}
		static fromAffine(e) {
			let { x: t, y: n } = e || {};
			if (!e || !r.isValid(t) || !r.isValid(n)) throw Error("invalid affine point");
			if (e instanceof k) throw Error("projective point not allowed");
			return r.is0(t) && r.is0(n) ? k.ZERO : new k(t, n, r.ONE);
		}
		static fromBytes(e) {
			let t = k.fromAffine(v(i(e, void 0, "point")));
			return t.assertValidity(), t;
		}
		static fromHex(e) {
			return k.fromBytes(g(e));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(e = 8, t = !0) {
			return j.createCache(this, e), t || this.multiply(lt), this;
		}
		assertValidity() {
			D(this);
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (!r.isOdd) throw Error("Field doesn't support isOdd");
			return !r.isOdd(e);
		}
		equals(e) {
			w(e);
			let { X: t, Y: n, Z: i } = this, { X: a, Y: o, Z: s } = e, c = r.eql(r.mul(t, s), r.mul(a, i)), l = r.eql(r.mul(n, s), r.mul(o, i));
			return c && l;
		}
		negate() {
			return new k(this.X, r.neg(this.Y), this.Z);
		}
		double() {
			let { a: e, b: t } = o, n = r.mul(t, lt), { X: i, Y: a, Z: s } = this, c = r.ZERO, l = r.ZERO, u = r.ZERO, d = r.mul(i, i), f = r.mul(a, a), p = r.mul(s, s), m = r.mul(i, a);
			return m = r.add(m, m), u = r.mul(i, s), u = r.add(u, u), c = r.mul(e, u), l = r.mul(n, p), l = r.add(c, l), c = r.sub(f, l), l = r.add(f, l), l = r.mul(c, l), c = r.mul(m, c), u = r.mul(n, u), p = r.mul(e, p), m = r.sub(d, p), m = r.mul(e, m), m = r.add(m, u), u = r.add(d, d), d = r.add(u, d), d = r.add(d, p), d = r.mul(d, m), l = r.add(l, d), p = r.mul(a, s), p = r.add(p, p), d = r.mul(p, m), c = r.sub(c, d), u = r.mul(p, f), u = r.add(u, u), u = r.add(u, u), new k(c, l, u);
		}
		add(e) {
			w(e);
			let { X: t, Y: n, Z: i } = this, { X: a, Y: s, Z: c } = e, l = r.ZERO, u = r.ZERO, d = r.ZERO, f = o.a, p = r.mul(o.b, lt), m = r.mul(t, a), h = r.mul(n, s), g = r.mul(i, c), _ = r.add(t, n), v = r.add(a, s);
			_ = r.mul(_, v), v = r.add(m, h), _ = r.sub(_, v), v = r.add(t, i);
			let y = r.add(a, c);
			return v = r.mul(v, y), y = r.add(m, g), v = r.sub(v, y), y = r.add(n, i), l = r.add(s, c), y = r.mul(y, l), l = r.add(h, g), y = r.sub(y, l), d = r.mul(f, v), l = r.mul(p, g), d = r.add(l, d), l = r.sub(h, d), d = r.add(h, d), u = r.mul(l, d), h = r.add(m, m), h = r.add(h, m), g = r.mul(f, g), v = r.mul(p, v), h = r.add(h, g), g = r.sub(m, g), g = r.mul(f, g), v = r.add(v, g), m = r.mul(h, v), u = r.add(u, m), m = r.mul(y, v), l = r.mul(_, l), l = r.sub(l, m), m = r.mul(_, h), d = r.mul(y, d), d = r.add(d, m), new k(l, u, d);
		}
		subtract(e) {
			return this.add(e.negate());
		}
		is0() {
			return this.equals(k.ZERO);
		}
		multiply(e) {
			let { endo: n } = t;
			if (!a.isValidNot0(e)) throw Error("invalid scalar: out of range");
			let r, i, o = (e) => j.cached(this, e, (e) => Be(k, e));
			if (n) {
				let { k1neg: t, k1: a, k2neg: s, k2: c } = T(e), { p: l, f: u } = o(a), { p: d, f } = o(c);
				i = u.add(f), r = O(n.beta, l, d, t, s);
			} else {
				let { p: t, f: n } = o(e);
				r = t, i = n;
			}
			return Be(k, [r, i])[0];
		}
		multiplyUnsafe(e) {
			let { endo: n } = t, r = this;
			if (!a.isValid(e)) throw Error("invalid scalar: out of range");
			if (e === ot || r.is0()) return k.ZERO;
			if (e === st) return r;
			if (j.hasCache(this)) return this.multiply(e);
			if (n) {
				let { k1neg: t, k1: i, k2neg: a, k2: o } = T(e), { p1: s, p2: c } = Ye(k, r, i, o);
				return O(n.beta, s, c, t, a);
			}
			return j.unsafe(r, e);
		}
		toAffine(e) {
			return E(this, e);
		}
		isTorsionFree() {
			let { isTorsionFree: e } = t;
			return s === st ? !0 : e ? e(k, this) : j.unsafe(this, c).is0();
		}
		clearCofactor() {
			let { clearCofactor: e } = t;
			return s === st ? this : e ? e(k, this) : this.multiplyUnsafe(s);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(s).is0();
		}
		toBytes(e = !0) {
			return M(e, "isCompressed"), this.assertValidity(), h(k, this, e);
		}
		toHex(e = !0) {
			return p(this.toBytes(e));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	let A = a.BITS, j = new Je(k, t.endo ? Math.ceil(A / 2) : A);
	return k.BASE.precompute(8), k;
}
function ft(e) {
	return Uint8Array.of(e ? 2 : 3);
}
function pt(e, t) {
	return {
		secretKey: t.BYTES,
		publicKey: 1 + e.BYTES,
		publicKeyUncompressed: 1 + 2 * e.BYTES,
		publicKeyHasPrefix: !0,
		signature: 2 * t.BYTES
	};
}
function mt(e, t = {}) {
	let { Fn: r } = e, a = t.randomBytes || y, o = Object.assign(pt(e.Fp, r), { seed: Fe(r.ORDER) });
	function s(e) {
		try {
			let t = r.fromBytes(e);
			return r.isValidNot0(t);
		} catch {
			return !1;
		}
	}
	function c(t, n) {
		let { publicKey: r, publicKeyUncompressed: i } = o;
		try {
			let a = t.length;
			return n === !0 && a !== r || n === !1 && a !== i ? !1 : !!e.fromBytes(t);
		} catch {
			return !1;
		}
	}
	function l(e = a(o.seed)) {
		return Ie(i(e, o.seed, "seed"), r.ORDER);
	}
	function u(t, n = !0) {
		return e.BASE.multiply(r.fromBytes(t)).toBytes(n);
	}
	function d(e) {
		let { secretKey: t, publicKey: a, publicKeyUncompressed: s } = o;
		if (!n(e) || "_lengths" in r && r._lengths || t === a) return;
		let c = i(e, void 0, "key").length;
		return c === a || c === s;
	}
	function f(t, n, i = !0) {
		if (d(t) === !0) throw Error("first arg must be private key");
		if (d(n) === !1) throw Error("second arg must be public key");
		let a = r.fromBytes(t);
		return e.fromBytes(n).multiply(a).toBytes(i);
	}
	let p = {
		isValidSecretKey: s,
		isValidPublicKey: c,
		randomSecretKey: l
	}, m = Qe(l, u);
	return Object.freeze({
		getPublicKey: u,
		getSharedSecret: f,
		keygen: m,
		Point: e,
		utils: p,
		lengths: o
	});
}
function ht(e, t, r = {}) {
	a(t), le(r, {}, {
		hmac: "function",
		lowS: "boolean",
		randomBytes: "function",
		bits2int: "function",
		bits2int_modN: "function"
	}), r = Object.assign({}, r);
	let o = r.randomBytes || y, s = r.hmac || ((e, n) => et(t, e, n)), { Fp: c, Fn: l } = e, { ORDER: u, BITS: d } = l, { keygen: f, getPublicKey: m, getSharedSecret: h, utils: v, lengths: b } = mt(e, r), x = {
		prehash: !0,
		lowS: typeof r.lowS != "boolean" || r.lowS,
		format: "compact",
		extraEntropy: !1
	}, S = u * ct < c.ORDER;
	function C(e) {
		return e > u >> st;
	}
	function w(e, t) {
		if (!l.isValidNot0(t)) throw Error(`invalid signature ${e}: out of range 1..Point.Fn.ORDER`);
		return t;
	}
	function T() {
		if (S) throw Error("\"recovered\" sig type is not supported for cofactor >2 curves");
	}
	function E(e, t) {
		rt(t);
		let n = b.signature;
		return i(e, t === "compact" ? n : t === "recovered" ? n + 1 : void 0);
	}
	class D {
		r;
		s;
		recovery;
		constructor(e, t, n) {
			if (this.r = w("r", e), this.s = w("s", t), n != null) {
				if (T(), ![
					0,
					1,
					2,
					3
				].includes(n)) throw Error("invalid recovery id");
				this.recovery = n;
			}
			Object.freeze(this);
		}
		static fromBytes(e, t = x.format) {
			E(e, t);
			let n;
			if (t === "der") {
				let { r: t, s: n } = at.toSig(i(e));
				return new D(t, n);
			}
			t === "recovered" && (n = e[0], t = "compact", e = e.subarray(1));
			let r = b.signature / 2, a = e.subarray(0, r), o = e.subarray(r, r * 2);
			return new D(l.fromBytes(a), l.fromBytes(o), n);
		}
		static fromHex(e, t) {
			return this.fromBytes(g(e), t);
		}
		assertRecovery() {
			let { recovery: e } = this;
			if (e == null) throw Error("invalid recovery id: must be present");
			return e;
		}
		addRecoveryBit(e) {
			return new D(this.r, this.s, e);
		}
		recoverPublicKey(t) {
			let { r: n, s: r } = this, a = this.assertRecovery(), o = a === 2 || a === 3 ? n + u : n;
			if (!c.isValid(o)) throw Error("invalid recovery id: sig.r+curve.n != R.x");
			let s = c.toBytes(o), d = e.fromBytes(_(ft(!(a & 1)), s)), f = l.inv(o), p = k(i(t, void 0, "msgHash")), m = l.create(-p * f), h = l.create(r * f), g = e.BASE.multiplyUnsafe(m).add(d.multiplyUnsafe(h));
			if (g.is0()) throw Error("invalid recovery: point at infinify");
			return g.assertValidity(), g;
		}
		hasHighS() {
			return C(this.s);
		}
		toBytes(e = x.format) {
			if (rt(e), e === "der") return g(at.hexFromSig(this));
			let { r: t, s: n } = this, r = l.toBytes(t), i = l.toBytes(n);
			return e === "recovered" ? (T(), _(Uint8Array.of(this.assertRecovery()), r, i)) : _(r, i);
		}
		toHex(e) {
			return p(this.toBytes(e));
		}
	}
	let O = r.bits2int || function(e) {
		if (e.length > 8192) throw Error("input is too large");
		let t = I(e), n = e.length * 8 - d;
		return n > 0 ? t >> BigInt(n) : t;
	}, k = r.bits2int_modN || function(e) {
		return l.create(O(e));
	}, A = se(d);
	function j(e) {
		return ae("num < 2^" + d, e, ot, A), l.toBytes(e);
	}
	function M(e, n) {
		return i(e, void 0, "message"), n ? i(t(e), void 0, "prehashed message") : e;
	}
	function N(t, n, r) {
		let { lowS: a, prehash: s, extraEntropy: c } = it(r, x);
		t = M(t, s);
		let u = k(t), d = l.fromBytes(n);
		if (!l.isValidNot0(d)) throw Error("invalid private key");
		let f = [j(d), j(u)];
		if (c != null && c !== !1) {
			let e = c === !0 ? o(b.secretKey) : c;
			f.push(i(e, void 0, "extraEntropy"));
		}
		let p = _(...f), m = u;
		function h(t) {
			let n = O(t);
			if (!l.isValidNot0(n)) return;
			let r = l.inv(n), i = e.BASE.multiply(n).toAffine(), o = l.create(i.x);
			if (o === ot) return;
			let s = l.create(r * l.create(m + o * d));
			if (s === ot) return;
			let c = (i.x === o ? 0 : 2) | Number(i.y & st), u = s;
			return a && C(s) && (u = l.neg(s), c ^= 1), new D(o, u, S ? void 0 : c);
		}
		return {
			seed: p,
			k2sig: h
		};
	}
	function P(e, n, r = {}) {
		let { seed: i, k2sig: a } = N(e, n, r);
		return ce(t.outputLen, l.BYTES, s)(i, a).toBytes(r.format);
	}
	function F(t, r, a, o = {}) {
		let { lowS: s, prehash: c, format: u } = it(o, x);
		if (a = i(a, void 0, "publicKey"), r = M(r, c), !n(t)) {
			let e = t instanceof D ? ", use sig.toBytes()" : "";
			throw Error("verify expects Uint8Array signature" + e);
		}
		E(t, u);
		try {
			let n = D.fromBytes(t, u), i = e.fromBytes(a);
			if (s && n.hasHighS()) return !1;
			let { r: o, s: c } = n, d = k(r), f = l.inv(c), p = l.create(d * f), m = l.create(o * f), h = e.BASE.multiplyUnsafe(p).add(i.multiplyUnsafe(m));
			return !h.is0() && l.create(h.x) === o;
		} catch {
			return !1;
		}
	}
	function L(e, t, n = {}) {
		let { prehash: r } = it(n, x);
		return t = M(t, r), D.fromBytes(e, "recovered").recoverPublicKey(t).toBytes();
	}
	return Object.freeze({
		keygen: f,
		getPublicKey: m,
		getSharedSecret: h,
		utils: v,
		lengths: b,
		Point: e,
		sign: P,
		verify: F,
		recoverPublicKey: L,
		Signature: D,
		hash: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/secp256k1.js
var gt = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, _t = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
}, vt = /* @__PURE__ */ BigInt(0), yt = /* @__PURE__ */ BigInt(2);
function bt(e) {
	let t = gt.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = H(H(H(u, n, t) * u % t, n, t) * u % t, yt, t) * l % t, f = H(d, i, t) * d % t, p = H(f, a, t) * f % t, m = H(p, s, t) * p % t, h = H(H(H(H(H(H(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, yt, t);
	if (!xt.eql(xt.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var xt = Ne(gt.p, { sqrt: bt }), St = /* @__PURE__ */ dt(gt, {
	Fp: xt,
	endo: _t
}), Ct = /* @__PURE__ */ ht(St, k), wt = {};
function Tt(e, ...t) {
	let n = wt[e];
	if (n === void 0) {
		let t = k(ne(e));
		n = _(t, t), wt[e] = n;
	}
	return k(_(n, ...t));
}
var Et = (e) => e.toBytes(!0).slice(1), Dt = (e) => e % yt === vt;
function Ot(e) {
	let { Fn: t, BASE: n } = St, r = t.fromBytes(e), i = n.multiply(r);
	return {
		scalar: Dt(i.y) ? r : t.neg(r),
		bytes: Et(i)
	};
}
function kt(e) {
	let t = xt;
	if (!t.isValidNot0(e)) throw Error("invalid x: Fail if x ≥ p");
	let n = t.create(e * e), r = t.create(n * e + BigInt(7)), i = t.sqrt(r);
	Dt(i) || (i = t.neg(i));
	let a = St.fromAffine({
		x: e,
		y: i
	});
	return a.assertValidity(), a;
}
var At = I;
function jt(...e) {
	return St.Fn.create(At(Tt("BIP0340/challenge", ...e)));
}
function Mt(e) {
	return Ot(e).bytes;
}
function Nt(e, t, n = y(32)) {
	let { Fn: r } = St, a = i(e, void 0, "message"), { bytes: o, scalar: s } = Ot(t), c = i(n, 32, "auxRand"), { bytes: l, scalar: u } = Ot(Tt("BIP0340/nonce", r.toBytes(s ^ At(Tt("BIP0340/aux", c))), o, a)), d = jt(l, o, a), f = /* @__PURE__ */ new Uint8Array(64);
	if (f.set(l, 0), f.set(r.toBytes(r.create(u + d * s)), 32), !Pt(f, a, o)) throw Error("sign: Invalid signature produced");
	return f;
}
function Pt(e, t, n) {
	let { Fp: r, Fn: a, BASE: o } = St, s = i(e, 64, "signature"), c = i(t, void 0, "message"), l = i(n, 32, "publicKey");
	try {
		let e = kt(At(l)), t = At(s.subarray(0, 32));
		if (!r.isValidNot0(t)) return !1;
		let n = At(s.subarray(32, 64));
		if (!a.isValidNot0(n)) return !1;
		let i = jt(a.toBytes(t), Et(e), c), u = o.multiplyUnsafe(n).add(e.multiplyUnsafe(a.neg(i))), { x: d, y: f } = u.toAffine();
		return !(u.is0() || !Dt(f) || d !== t);
	} catch {
		return !1;
	}
}
var Ft = /* @__PURE__ */ (() => {
	let e = (e = y(48)) => Ie(e, gt.n);
	return {
		keygen: Qe(e, Mt),
		getPublicKey: Mt,
		sign: Nt,
		verify: Pt,
		Point: St,
		utils: {
			randomSecretKey: e,
			taggedHash: Tt,
			lift_x: kt,
			pointToBytes: Et
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
function It(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Lt(e) {
	if (!It(e)) throw Error("Uint8Array expected");
}
function Rt(e, t) {
	return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((e) => typeof e == "string") : t.every((e) => Number.isSafeInteger(e)) : !1;
}
function zt(e) {
	if (typeof e != "function") throw Error("function expected");
	return !0;
}
function Bt(e, t) {
	if (typeof t != "string") throw Error(`${e}: string expected`);
	return !0;
}
function Vt(e) {
	if (!Number.isSafeInteger(e)) throw Error(`invalid integer: ${e}`);
}
function Ht(e) {
	if (!Array.isArray(e)) throw Error("array expected");
}
function Ut(e, t) {
	if (!Rt(!0, t)) throw Error(`${e}: array of strings expected`);
}
function Wt(e, t) {
	if (!Rt(!1, t)) throw Error(`${e}: array of numbers expected`);
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
	Ut("alphabet", t);
	let r = new Map(t.map((e, t) => [e, t]));
	return {
		encode: (r) => (Ht(r), r.map((r) => {
			if (!Number.isSafeInteger(r) || r < 0 || r >= n) throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);
			return t[r];
		})),
		decode: (t) => (Ht(t), t.map((t) => {
			Bt("alphabet.decode", t);
			let n = r.get(t);
			if (n === void 0) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
			return n;
		}))
	};
}
function G(e = "") {
	return Bt("join", e), {
		encode: (t) => (Ut("join.decode", t), t.join(e)),
		decode: (t) => (Bt("join.decode", t), t.split(e))
	};
}
function Gt(e, t = "=") {
	return Vt(e), Bt("padding", t), {
		encode(n) {
			for (Ut("padding.encode", n); n.length * e % 8;) n.push(t);
			return n;
		},
		decode(n) {
			Ut("padding.decode", n);
			let r = n.length;
			if (r * e % 8) throw Error("padding: invalid, string should have whole number of bytes");
			for (; r > 0 && n[r - 1] === t; r--) if ((r - 1) * e % 8 == 0) throw Error("padding: invalid, string has too much padding");
			return n.slice(0, r);
		}
	};
}
function Kt(e) {
	return zt(e), {
		encode: (e) => e,
		decode: (t) => e(t)
	};
}
var qt = (e, t) => t === 0 ? e : qt(t, e % t), Jt = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - qt(e, t)), Yt = /* @__PURE__ */ (() => {
	let e = [];
	for (let t = 0; t < 40; t++) e.push(2 ** t);
	return e;
})();
function Xt(e, t, n, r) {
	if (Ht(e), t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (/* @__PURE__ */ Jt(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ Jt(t, n)}`);
	let i = 0, a = 0, o = Yt[t], s = Yt[n] - 1, c = [];
	for (let r of e) {
		if (Vt(r), r >= o) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
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
function K(e, t = !1) {
	if (Vt(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ Jt(8, e) > 32 || /* @__PURE__ */ Jt(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!It(n)) throw Error("radix2.encode input should be Uint8Array");
			return Xt(Array.from(n), 8, e, !t);
		},
		decode: (n) => (Wt("radix2.decode", n), Uint8Array.from(Xt(n, e, 8, t)))
	};
}
function Zt(e) {
	return zt(e), function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
U(K(4), W("0123456789ABCDEF"), G("")), U(K(5), W("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), Gt(5), G("")), U(K(5), W("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), G("")), U(K(5), W("0123456789ABCDEFGHIJKLMNOPQRSTUV"), Gt(5), G("")), U(K(5), W("0123456789ABCDEFGHIJKLMNOPQRSTUV"), G("")), U(K(5), W("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), G(""), Kt((e) => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var Qt = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", $t = (e, t) => {
	Bt("base64", e);
	let n = t ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/, r = t ? "base64url" : "base64";
	if (e.length > 0 && !n.test(e)) throw Error("invalid base64");
	return Uint8Array.fromBase64(e, {
		alphabet: r,
		lastChunkHandling: "strict"
	});
}, en = Qt ? {
	encode(e) {
		return Lt(e), e.toBase64();
	},
	decode(e) {
		return $t(e, !1);
	}
} : U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), Gt(6), G(""));
U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), G("")), Qt || U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), Gt(6), G("")), U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), G(""));
var tn = U(W("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), G("")), nn = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function rn(e) {
	let t = e >> 25, n = (e & 33554431) << 5;
	for (let e = 0; e < nn.length; e++) (t >> e & 1) == 1 && (n ^= nn[e]);
	return n;
}
function an(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = rn(i) ^ n >> 5;
	}
	i = rn(i);
	for (let t = 0; t < r; t++) i = rn(i) ^ e.charCodeAt(t) & 31;
	for (let e of t) i = rn(i) ^ e;
	for (let e = 0; e < 6; e++) i = rn(i);
	return i ^= n, tn.encode(Xt([i % Yt[30]], 30, 5, !1));
}
function on(e) {
	let t = e === "bech32" ? 1 : 734539939, n = K(5), r = n.decode, i = n.encode, a = Zt(r);
	function o(e, n, r = 90) {
		Bt("bech32.encode prefix", e), It(n) && (n = Array.from(n)), Wt("bech32.encode", n);
		let i = e.length;
		if (i === 0) throw TypeError(`Invalid prefix length ${i}`);
		let a = i + 7 + n.length;
		if (r !== !1 && a > r) throw TypeError(`Length ${a} exceeds limit ${r}`);
		let o = e.toLowerCase(), s = an(o, n, t);
		return `${o}1${tn.encode(n)}${s}`;
	}
	function s(e, n = 90) {
		Bt("bech32.decode input", e);
		let r = e.length;
		if (r < 8 || n !== !1 && r > n) throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);
		let i = e.toLowerCase();
		if (e !== i && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
		let a = i.lastIndexOf("1");
		if (a === 0 || a === -1) throw Error("Letter \"1\" must be present between prefix and data only");
		let o = i.slice(0, a), s = i.slice(a + 1);
		if (s.length < 6) throw Error("Data must be at least 6 characters long");
		let c = tn.decode(s).slice(0, -6), l = an(o, c, t);
		if (!s.endsWith(l)) throw Error(`Invalid checksum in ${e}: expected "${l}"`);
		return {
			prefix: o,
			words: c
		};
	}
	let c = Zt(s);
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
var sn = on("bech32");
on("bech32m"), typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function" || U(K(4), W("0123456789abcdef"), G(""), Kt((e) => {
	if (typeof e != "string" || e.length % 2 != 0) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
	return e.toLowerCase();
}));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/utils.js
function cn(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function ln(e) {
	if (typeof e != "boolean") throw Error(`boolean expected, not ${e}`);
}
function un(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error("positive integer expected, got " + e);
}
function q(e, t, n = "") {
	let r = cn(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function dn(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function fn(e, t) {
	q(e, void 0, "output");
	let n = t.outputLen;
	if (e.length < n) throw Error("digestInto() expects output buffer of length at least " + n);
}
function J(e) {
	return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function pn(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
var mn = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function hn(e, t) {
	return e.buffer === t.buffer && e.byteOffset < t.byteOffset + t.byteLength && t.byteOffset < e.byteOffset + e.byteLength;
}
function gn(e, t) {
	if (hn(e, t) && e.byteOffset < t.byteOffset) throw Error("complex overlap of input and output is not supported");
}
function _n(e, t) {
	if (typeof t != "object" || !t) throw Error("options must be defined");
	return Object.assign(e, t);
}
function vn(e, t) {
	if (e.length !== t.length) return !1;
	let n = 0;
	for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
	return n === 0;
}
var yn = (e, t) => {
	function n(n, ...r) {
		if (q(n, void 0, "key"), !mn) throw Error("Non little-endian hardware is not yet supported");
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
function bn(e, t, n = !0) {
	if (t === void 0) return new Uint8Array(e);
	if (t.length !== e) throw Error("\"output\" expected Uint8Array of length " + e + ", got: " + t.length);
	if (n && !xn(t)) throw Error("invalid output, must be aligned");
	return t;
}
function xn(e) {
	return e.byteOffset % 4 == 0;
}
function Sn(e) {
	return Uint8Array.from(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/aes.js
var Cn = 16, wn = 283;
function Tn(e) {
	if (![
		16,
		24,
		32
	].includes(e.length)) throw Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + e.length);
}
function En(e) {
	return e << 1 ^ wn & -(e >> 7);
}
function Dn(e, t) {
	let n = 0;
	for (; t > 0; t >>= 1) n ^= e & -(t & 1), e = En(e);
	return n;
}
var On = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(256);
	for (let t = 0, n = 1; t < 256; t++, n ^= En(n)) e[t] = n;
	let t = /* @__PURE__ */ new Uint8Array(256);
	t[0] = 99;
	for (let n = 0; n < 255; n++) {
		let r = e[255 - n];
		r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
	}
	return pn(e), t;
})(), kn = /* @__PURE__ */ On.map((e, t) => On.indexOf(t)), An = (e) => e << 24 | e >>> 8, jn = (e) => e << 8 | e >>> 24;
function Mn(e, t) {
	if (e.length !== 256) throw Error("Wrong sbox length");
	let n = (/* @__PURE__ */ new Uint32Array(256)).map((n, r) => t(e[r])), r = n.map(jn), i = r.map(jn), a = i.map(jn), o = /* @__PURE__ */ new Uint32Array(65536), s = /* @__PURE__ */ new Uint32Array(65536), c = /* @__PURE__ */ new Uint16Array(65536);
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
var Nn = /* @__PURE__ */ Mn(On, (e) => Dn(e, 3) << 24 | e << 16 | e << 8 | Dn(e, 2)), Pn = /* @__PURE__ */ Mn(kn, (e) => Dn(e, 11) << 24 | Dn(e, 13) << 16 | Dn(e, 9) << 8 | Dn(e, 14)), Fn = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(16);
	for (let t = 0, n = 1; t < 16; t++, n = En(n)) e[t] = n;
	return e;
})();
function In(e) {
	q(e);
	let t = e.length;
	Tn(e);
	let { sbox2: n } = Nn, r = [];
	xn(e) || r.push(e = Sn(e));
	let i = J(e), a = i.length, o = (e) => zn(n, e, e, e, e), s = new Uint32Array(t + 28);
	s.set(i);
	for (let e = a; e < s.length; e++) {
		let t = s[e - 1];
		e % a === 0 ? t = o(An(t)) ^ Fn[e / a - 1] : a > 6 && e % a === 4 && (t = o(t)), s[e] = s[e - a] ^ t;
	}
	return pn(...r), s;
}
function Ln(e) {
	let t = In(e), n = t.slice(), r = t.length, { sbox2: i } = Nn, { T0: a, T1: o, T2: s, T3: c } = Pn;
	for (let e = 0; e < r; e += 4) for (let i = 0; i < 4; i++) n[e + i] = t[r - e - 4 + i];
	pn(t);
	for (let e = 4; e < r - 4; e++) {
		let t = n[e], r = zn(i, t, t, t, t);
		n[e] = a[r & 255] ^ o[r >>> 8 & 255] ^ s[r >>> 16 & 255] ^ c[r >>> 24];
	}
	return n;
}
function Rn(e, t, n, r, i, a) {
	return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | a >>> 24 & 255];
}
function zn(e, t, n, r, i) {
	return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function Bn(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = Nn, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ Rn(o, s, t, n, r, i), l = e[c++] ^ Rn(o, s, n, r, i, t), u = e[c++] ^ Rn(o, s, r, i, t, n), d = e[c++] ^ Rn(o, s, i, t, n, r);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ zn(a, t, n, r, i),
		s1: e[c++] ^ zn(a, n, r, i, t),
		s2: e[c++] ^ zn(a, r, i, t, n),
		s3: e[c++] ^ zn(a, i, t, n, r)
	};
}
function Vn(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = Pn, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ Rn(o, s, t, i, r, n), l = e[c++] ^ Rn(o, s, n, t, i, r), u = e[c++] ^ Rn(o, s, r, n, t, i), d = e[c++] ^ Rn(o, s, i, r, n, t);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ zn(a, t, i, r, n),
		s1: e[c++] ^ zn(a, n, t, i, r),
		s2: e[c++] ^ zn(a, r, n, t, i),
		s3: e[c++] ^ zn(a, i, r, n, t)
	};
}
function Hn(e) {
	if (q(e), e.length % Cn !== 0) throw Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function Un(e, t, n) {
	q(e);
	let r = e.length, i = r % Cn;
	if (!t && i !== 0) throw Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	xn(e) || (e = Sn(e));
	let a = J(e);
	if (t) {
		let e = Cn - i;
		e ||= Cn, r += e;
	}
	return n = bn(r, n), gn(e, n), {
		b: a,
		o: J(n),
		out: n
	};
}
function Wn(e, t) {
	if (!t) return e;
	let n = e.length;
	if (!n) throw Error("aes/pcks5: empty ciphertext not allowed");
	let r = e[n - 1];
	if (r <= 0 || r > 16) throw Error("aes/pcks5: wrong padding");
	let i = e.subarray(0, -r);
	for (let t = 0; t < r; t++) if (e[n - t - 1] !== r) throw Error("aes/pcks5: wrong padding");
	return i;
}
function Gn(e) {
	let t = /* @__PURE__ */ new Uint8Array(16), n = J(t);
	t.set(e);
	let r = Cn - e.length;
	for (let e = Cn - r; e < Cn; e++) t[e] = r;
	return n;
}
var Kn = /* @__PURE__ */ yn({
	blockSize: 16,
	nonceLength: 16
}, function(e, t, n = {}) {
	let r = !n.disablePadding;
	return {
		encrypt(n, i) {
			let a = In(e), { b: o, o: s, out: c } = Un(n, r, i), l = t, u = [a];
			xn(l) || u.push(l = Sn(l));
			let d = J(l), f = d[0], p = d[1], m = d[2], h = d[3], g = 0;
			for (; g + 4 <= o.length;) f ^= o[g + 0], p ^= o[g + 1], m ^= o[g + 2], h ^= o[g + 3], {s0: f, s1: p, s2: m, s3: h} = Bn(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			if (r) {
				let e = Gn(n.subarray(g * 4));
				f ^= e[0], p ^= e[1], m ^= e[2], h ^= e[3], {s0: f, s1: p, s2: m, s3: h} = Bn(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			}
			return pn(...u), c;
		},
		decrypt(n, i) {
			Hn(n);
			let a = Ln(e), o = t, s = [a];
			xn(o) || s.push(o = Sn(o));
			let c = J(o);
			i = bn(n.length, i), xn(n) || s.push(n = Sn(n)), gn(n, i);
			let l = J(n), u = J(i), d = c[0], f = c[1], p = c[2], m = c[3];
			for (let e = 0; e + 4 <= l.length;) {
				let t = d, n = f, r = p, i = m;
				d = l[e + 0], f = l[e + 1], p = l[e + 2], m = l[e + 3];
				let { s0: o, s1: s, s2: c, s3: h } = Vn(a, d, f, p, m);
				u[e++] = o ^ t, u[e++] = s ^ n, u[e++] = c ^ r, u[e++] = h ^ i;
			}
			return pn(...s), Wn(i, r);
		}
	};
}), qn = (e) => Uint8Array.from(e.split(""), (e) => e.charCodeAt(0)), Jn = qn("expand 16-byte k"), Yn = qn("expand 32-byte k"), Xn = J(Jn), Zn = J(Yn);
function Y(e, t) {
	return e << t | e >>> 32 - t;
}
function Qn(e) {
	return e.byteOffset % 4 == 0;
}
var $n = 64, er = 16, tr = 2 ** 32 - 1, nr = Uint32Array.of();
function rr(e, t, n, r, i, a, o, s) {
	let c = i.length, l = new Uint8Array($n), u = J(l), d = Qn(i) && Qn(a), f = d ? J(i) : nr, p = d ? J(a) : nr;
	for (let m = 0; m < c; o++) {
		if (e(t, n, r, u, o, s), o >= tr) throw Error("arx: counter overflow");
		let h = Math.min($n, c - m);
		if (d && h === $n) {
			let e = m / 4;
			if (m % 4 != 0) throw Error("arx: invalid block position");
			for (let t = 0, n; t < er; t++) n = e + t, p[n] = f[n] ^ u[t];
			m += $n;
		} else {
			for (let e = 0, t; e < h; e++) t = m + e, a[t] = i[t] ^ l[e];
			m += h;
		}
	}
}
function ir(e, t) {
	let { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: a, rounds: o } = _n({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, t);
	if (typeof e != "function") throw Error("core must be a function");
	return un(i), un(o), ln(a), ln(n), (t, s, c, l, u = 0) => {
		q(t, void 0, "key"), q(s, void 0, "nonce"), q(c, void 0, "data");
		let d = c.length;
		if (l === void 0 && (l = new Uint8Array(d)), q(l, void 0, "output"), un(u), u < 0 || u >= tr) throw Error("arx: counter overflow");
		if (l.length < d) throw Error(`arx: output (${l.length}) is shorter than data (${d})`);
		let f = [], p = t.length, m, h;
		if (p === 32) f.push(m = Sn(t)), h = Zn;
		else if (p === 16 && n) m = /* @__PURE__ */ new Uint8Array(32), m.set(t), m.set(t, 16), h = Xn, f.push(m);
		else throw q(t, 32, "arx key"), Error("invalid key size");
		Qn(s) || f.push(s = Sn(s));
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
		return rr(e, h, g, v, c, l, u, o), pn(...f), l;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/_poly1305.js
function X(e, t) {
	return e[t++] & 255 | (e[t++] & 255) << 8;
}
var ar = class {
	blockLen = 16;
	outputLen = 16;
	buffer = /* @__PURE__ */ new Uint8Array(16);
	r = /* @__PURE__ */ new Uint16Array(10);
	h = /* @__PURE__ */ new Uint16Array(10);
	pad = /* @__PURE__ */ new Uint16Array(8);
	pos = 0;
	finished = !1;
	constructor(e) {
		e = Sn(q(e, 32, "key"));
		let t = X(e, 0), n = X(e, 2), r = X(e, 4), i = X(e, 6), a = X(e, 8), o = X(e, 10), s = X(e, 12), c = X(e, 14);
		this.r[0] = t & 8191, this.r[1] = (t >>> 13 | n << 3) & 8191, this.r[2] = (n >>> 10 | r << 6) & 7939, this.r[3] = (r >>> 7 | i << 9) & 8191, this.r[4] = (i >>> 4 | a << 12) & 255, this.r[5] = a >>> 1 & 8190, this.r[6] = (a >>> 14 | o << 2) & 8191, this.r[7] = (o >>> 11 | s << 5) & 8065, this.r[8] = (s >>> 8 | c << 8) & 8191, this.r[9] = c >>> 5 & 127;
		for (let t = 0; t < 8; t++) this.pad[t] = X(e, 16 + 2 * t);
	}
	process(e, t, n = !1) {
		let r = n ? 0 : 2048, { h: i, r: a } = this, o = a[0], s = a[1], c = a[2], l = a[3], u = a[4], d = a[5], f = a[6], p = a[7], m = a[8], h = a[9], g = X(e, t + 0), _ = X(e, t + 2), v = X(e, t + 4), y = X(e, t + 6), b = X(e, t + 8), x = X(e, t + 10), S = X(e, t + 12), C = X(e, t + 14), w = i[0] + (g & 8191), T = i[1] + ((g >>> 13 | _ << 3) & 8191), E = i[2] + ((_ >>> 10 | v << 6) & 8191), D = i[3] + ((v >>> 7 | y << 9) & 8191), O = i[4] + ((y >>> 4 | b << 12) & 8191), k = i[5] + (b >>> 1 & 8191), A = i[6] + ((b >>> 14 | x << 2) & 8191), j = i[7] + ((x >>> 11 | S << 5) & 8191), M = i[8] + ((S >>> 8 | C << 8) & 8191), N = i[9] + (C >>> 5 | r), P = 0, F = P + w * o + 5 * h * T + 5 * m * E + 5 * p * D + 5 * f * O;
		P = F >>> 13, F &= 8191, F += 5 * d * k + 5 * u * A + 5 * l * j + 5 * c * M + 5 * s * N, P += F >>> 13, F &= 8191;
		let I = P + w * s + T * o + 5 * h * E + 5 * m * D + 5 * p * O;
		P = I >>> 13, I &= 8191, I += 5 * f * k + 5 * d * A + 5 * u * j + 5 * l * M + 5 * c * N, P += I >>> 13, I &= 8191;
		let L = P + w * c + T * s + E * o + 5 * h * D + 5 * m * O;
		P = L >>> 13, L &= 8191, L += 5 * p * k + 5 * f * A + 5 * d * j + 5 * u * M + 5 * l * N, P += L >>> 13, L &= 8191;
		let R = P + w * l + T * c + E * s + D * o + 5 * h * O;
		P = R >>> 13, R &= 8191, R += 5 * m * k + 5 * p * A + 5 * f * j + 5 * d * M + 5 * u * N, P += R >>> 13, R &= 8191;
		let ee = P + w * u + T * l + E * c + D * s + O * o;
		P = ee >>> 13, ee &= 8191, ee += 5 * h * k + 5 * m * A + 5 * p * j + 5 * f * M + 5 * d * N, P += ee >>> 13, ee &= 8191;
		let te = P + w * d + T * u + E * l + D * c + O * s;
		P = te >>> 13, te &= 8191, te += k * o + 5 * h * A + 5 * m * j + 5 * p * M + 5 * f * N, P += te >>> 13, te &= 8191;
		let ne = P + w * f + T * d + E * u + D * l + O * c;
		P = ne >>> 13, ne &= 8191, ne += k * s + A * o + 5 * h * j + 5 * m * M + 5 * p * N, P += ne >>> 13, ne &= 8191;
		let re = P + w * p + T * f + E * d + D * u + O * l;
		P = re >>> 13, re &= 8191, re += k * c + A * s + j * o + 5 * h * M + 5 * m * N, P += re >>> 13, re &= 8191;
		let ie = P + w * m + T * p + E * f + D * d + O * u;
		P = ie >>> 13, ie &= 8191, ie += k * l + A * c + j * s + M * o + 5 * h * N, P += ie >>> 13, ie &= 8191;
		let ae = P + w * h + T * m + E * p + D * f + O * d;
		P = ae >>> 13, ae &= 8191, ae += k * u + A * l + j * c + M * s + N * o, P += ae >>> 13, ae &= 8191, P = (P << 2) + P | 0, P = P + F | 0, F = P & 8191, P >>>= 13, I += P, i[0] = F, i[1] = I, i[2] = L, i[3] = R, i[4] = ee, i[5] = te, i[6] = ne, i[7] = re, i[8] = ie, i[9] = ae;
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
		pn(n);
	}
	update(e) {
		dn(this), q(e), e = Sn(e);
		let { buffer: t, blockLen: n } = this, r = e.length;
		for (let i = 0; i < r;) {
			let a = Math.min(n - this.pos, r - i);
			if (a === n) for (; n <= r - i; i += n) this.process(e, i);
			else t.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === n && (this.process(t, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		pn(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		dn(this), fn(e, this), this.finished = !0;
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
function or(e) {
	let t = (t, n) => e(n).update(t).digest(), n = e(/* @__PURE__ */ new Uint8Array(32));
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
}
or((e) => new ar(e));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/chacha.js
function sr(e, t, n, r, i, a = 20) {
	let o = e[0], s = e[1], c = e[2], l = e[3], u = t[0], d = t[1], f = t[2], p = t[3], m = t[4], h = t[5], g = t[6], _ = t[7], v = i, y = n[0], b = n[1], x = n[2], S = o, C = s, w = c, T = l, E = u, D = d, O = f, k = p, A = m, j = h, M = g, N = _, P = v, F = y, I = b, L = x;
	for (let e = 0; e < a; e += 2) S = S + E | 0, P = Y(P ^ S, 16), A = A + P | 0, E = Y(E ^ A, 12), S = S + E | 0, P = Y(P ^ S, 8), A = A + P | 0, E = Y(E ^ A, 7), C = C + D | 0, F = Y(F ^ C, 16), j = j + F | 0, D = Y(D ^ j, 12), C = C + D | 0, F = Y(F ^ C, 8), j = j + F | 0, D = Y(D ^ j, 7), w = w + O | 0, I = Y(I ^ w, 16), M = M + I | 0, O = Y(O ^ M, 12), w = w + O | 0, I = Y(I ^ w, 8), M = M + I | 0, O = Y(O ^ M, 7), T = T + k | 0, L = Y(L ^ T, 16), N = N + L | 0, k = Y(k ^ N, 12), T = T + k | 0, L = Y(L ^ T, 8), N = N + L | 0, k = Y(k ^ N, 7), S = S + D | 0, L = Y(L ^ S, 16), M = M + L | 0, D = Y(D ^ M, 12), S = S + D | 0, L = Y(L ^ S, 8), M = M + L | 0, D = Y(D ^ M, 7), C = C + O | 0, P = Y(P ^ C, 16), N = N + P | 0, O = Y(O ^ N, 12), C = C + O | 0, P = Y(P ^ C, 8), N = N + P | 0, O = Y(O ^ N, 7), w = w + k | 0, F = Y(F ^ w, 16), A = A + F | 0, k = Y(k ^ A, 12), w = w + k | 0, F = Y(F ^ w, 8), A = A + F | 0, k = Y(k ^ A, 7), T = T + E | 0, I = Y(I ^ T, 16), j = j + I | 0, E = Y(E ^ j, 12), T = T + E | 0, I = Y(I ^ T, 8), j = j + I | 0, E = Y(E ^ j, 7);
	let R = 0;
	r[R++] = o + S | 0, r[R++] = s + C | 0, r[R++] = c + w | 0, r[R++] = l + T | 0, r[R++] = u + E | 0, r[R++] = d + D | 0, r[R++] = f + O | 0, r[R++] = p + k | 0, r[R++] = m + A | 0, r[R++] = h + j | 0, r[R++] = g + M | 0, r[R++] = _ + N | 0, r[R++] = v + P | 0, r[R++] = y + F | 0, r[R++] = b + I | 0, r[R++] = x + L | 0;
}
var cr = /* @__PURE__ */ ir(sr, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hkdf.js
function lr(e, t, n) {
	return a(e), n === void 0 && (n = new Uint8Array(e.outputLen)), et(e, n, t);
}
var ur = /* @__PURE__ */ Uint8Array.of(0), dr = /* @__PURE__ */ Uint8Array.of();
function fr(e, t, n, o = 32) {
	a(e), r(o, "length");
	let s = e.outputLen;
	if (o > 255 * s) throw Error("Length must be <= 255*HashLen");
	let l = Math.ceil(o / s);
	n === void 0 ? n = dr : i(n, void 0, "info");
	let u = new Uint8Array(l * s), d = et.create(e, t), f = d._cloneInto(), p = new Uint8Array(d.outputLen);
	for (let e = 0; e < l; e++) ur[0] = e + 1, f.update(e === 0 ? dr : p).update(n).update(ur).digestInto(p), u.set(p, s * e), d._cloneInto(f);
	return d.destroy(), f.destroy(), c(p, ur), u.slice(0, o);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/index.js
var pr = Object.defineProperty, Z = (e, t) => {
	for (var n in t) pr(e, n, {
		get: t[n],
		enumerable: !0
	});
}, mr = {};
Z(mr, {
	binarySearch: () => yr,
	bytesToHex: () => p,
	hexToBytes: () => g,
	insertEventIntoAscendingList: () => vr,
	insertEventIntoDescendingList: () => _r,
	isHex32: () => $,
	mergeReverseSortedLists: () => br,
	normalizeURL: () => gr,
	utf8Decoder: () => hr,
	utf8Encoder: () => Q
});
var hr = new TextDecoder("utf-8"), Q = new TextEncoder();
function gr(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function _r(e, t) {
	let [n, r] = yr(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : e.created_at - t.created_at);
	return r || e.splice(n, 0, t), e;
}
function vr(e, t) {
	let [n, r] = yr(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : t.created_at - e.created_at);
	return r || e.splice(n, 0, t), e;
}
function yr(e, t) {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = t(e[i]);
		if (a === 0) return [i, !0];
		a < 0 ? r = i - 1 : n = i + 1;
	}
	return [n, !1];
}
function br(e, t) {
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
var xr = Symbol("verified"), Sr = (e) => e instanceof Object;
function Cr(e) {
	if (!Sr(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !$(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var wr = class {
	generateSecretKey() {
		return Ft.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return p(Ft.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = p(Ft.getPublicKey(t)), n.id = Er(n), n.sig = p(Ft.sign(g(Er(n)), t)), n[xr] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[xr] == "boolean") return e[xr];
		try {
			let t = Er(e);
			if (t !== e.id) return e[xr] = !1, !1;
			let n = Ft.verify(g(e.sig), g(t), g(e.pubkey));
			return e[xr] = n, n;
		} catch {
			return e[xr] = !1, !1;
		}
	}
};
function Tr(e) {
	if (!Cr(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function Er(e) {
	return p(k(Q.encode(Tr(e))));
}
var Dr = new wr(), Or = Dr.generateSecretKey, kr = Dr.getPublicKey, Ar = Dr.finalizeEvent, jr = Dr.verifyEvent;
Z({}, {
	AIEmbeddings: () => Vi,
	AppCurationSet: () => Eo,
	Application: () => wo,
	AuthoredPodcasts: () => Va,
	BadgeAward: () => Kr,
	BadgeDefinition: () => fo,
	Bid: () => hi,
	BidConfirmation: () => gi,
	BlobsAuth: () => to,
	BlockedRelaysList: () => Ca,
	BlossomServerList: () => Ia,
	BookmarkList: () => ba,
	Bookmarksets: () => oo,
	Calendar: () => Uo,
	CalendarEventRSVP: () => Wo,
	CashuMintAnnouncement: () => ts,
	CashuWalletEvent: () => Ya,
	CashuWalletHistory: () => $i,
	CashuWalletTokens: () => Qi,
	ChannelCreation: () => oi,
	ChannelHideMessage: () => li,
	ChannelMessage: () => ci,
	ChannelMetadata: () => si,
	ChannelMuteUser: () => ui,
	ChatMessage: () => qr,
	Chess: () => fi,
	ClassifiedListing: () => Mo,
	ClientAuth: () => Za,
	CodeSnippet: () => Ei,
	CoinjoinPool: () => Wi,
	Comment: () => xi,
	CommunitiesList: () => xa,
	CommunityDefinition: () => Zo,
	CommunityPostApproval: () => qi,
	ConferenceEvent: () => ko,
	Contacts: () => Vr,
	CreateOrUpdateProduct: () => ho,
	CreateOrUpdateStall: () => mo,
	CuratedVideoSets: () => co,
	Curationsets: () => so,
	Date: () => Vo,
	DecoupledEncryptionKeyDistribution: () => Ki,
	DecoupledKeyAnnouncement: () => Na,
	DecoupledKeyClientAnnouncement: () => Gi,
	DirectMessageRelaysList: () => Pa,
	DraftClassifiedListing: () => No,
	DraftEvent: () => Ro,
	DraftLong: () => yo,
	Emojisets: () => bo,
	EncryptedDirectMessage: () => Hr,
	EventDeletion: () => Ur,
	FavoriteFollowSets: () => ja,
	FavoritePodcasts: () => Fa,
	FavoriteRelays: () => Ea,
	FedimintAnnouncement: () => ns,
	Feed: () => Bo,
	FileMessage: () => $r,
	FileMetadata: () => yi,
	FileServerPreference: () => La,
	Followsets: () => ro,
	ForumThread: () => Yr,
	GenericRepost: () => ei,
	Genericlists: () => io,
	GeocacheListing: () => $o,
	GeocacheLog: () => ea,
	GeocacheLogEntry: () => es,
	GeocacheProofOfFind: () => ta,
	GiftWrap: () => vi,
	GitPullRequest: () => Oi,
	GitPullRequestUpdate: () => ki,
	GoodWikiAuthorList: () => Ra,
	GoodWikiRelayList: () => za,
	GroupMetadata: () => is,
	HTTPAuth: () => no,
	Handlerinformation: () => qo,
	Handlerrecommendation: () => Ko,
	Highlights: () => ga,
	InteractiveRoom: () => Oo,
	InterestsList: () => Oa,
	Interestsets: () => po,
	Issue: () => Ai,
	JobFeedback: () => Xi,
	JobRequest: () => Ji,
	JobResult: () => Yi,
	Label: () => zi,
	LegacyNsiteFile: () => Yo,
	LightningPubRPC: () => Xa,
	LinkSet: () => zo,
	LiveChatMessage: () => Ti,
	LiveEvent: () => Do,
	LongFormArticle: () => vo,
	MarketplaceUI: () => go,
	MediaFollows: () => Aa,
	MediaStarterPacks: () => us,
	MergeRequests: () => pi,
	Metadata: () => Rr,
	ModularArticleContent: () => So,
	ModularArticleHeader: () => xo,
	MuteSets: () => lo,
	Mutelist: () => _a,
	NWCWalletInfo: () => qa,
	NWCWalletRequest: () => Qa,
	NWCWalletResponse: () => $a,
	NormalVideo: () => ri,
	NostrConnect: () => eo,
	NsiteNamed: () => Qo,
	NsiteRoot: () => Ja,
	NutZap: () => fa,
	NutZapInfo: () => ka,
	OpenTimestamps: () => _i,
	Patch: () => Di,
	PeerToPeerOrderEvents: () => rs,
	Photo: () => ni,
	Pinlist: () => va,
	PodcastEpisode: () => di,
	PodcastMetadata: () => Ba,
	Poll: () => bi,
	PollResponse: () => mi,
	PrivateDirectMessage: () => Qr,
	PrivateEventRelayList: () => Da,
	ProblemTracker: () => Ii,
	ProductSoldAsAuction: () => _o,
	ProfileBadges: () => uo,
	ProxyAnnouncement: () => Ga,
	PublicChatsList: () => Sa,
	PublicMessage: () => ai,
	Reaction: () => Gr,
	ReactionToWebsite: () => ti,
	RecommendRelay: () => Br,
	Redirects: () => Lo,
	RelayDiscovery: () => To,
	RelayList: () => ya,
	RelayMonitorAnnouncement: () => Ha,
	RelayReview: () => Go,
	RelayReviews: () => Bi,
	Relaysets: () => ao,
	ReleaseArtifactSets: () => Co,
	Reply: () => ji,
	Report: () => Li,
	Reporting: () => Ri,
	RepositoryAnnouncement: () => Po,
	RepositoryState: () => Fo,
	Repost: () => Wr,
	ReservedCashuWalletTokens: () => Zi,
	RoomPresence: () => Ua,
	Scroll: () => Ci,
	Seal: () => Zr,
	SearchRelaysList: () => wa,
	ShortTextNote: () => zr,
	ShortVideo: () => ii,
	SimpleGroupAdmins: () => as,
	SimpleGroupCreateGroup: () => oa,
	SimpleGroupCreateInvite: () => ca,
	SimpleGroupDeleteEvent: () => aa,
	SimpleGroupDeleteGroup: () => sa,
	SimpleGroupEditMetadata: () => ia,
	SimpleGroupJoinRequest: () => la,
	SimpleGroupLeaveRequest: () => ua,
	SimpleGroupList: () => Ta,
	SimpleGroupLiveKitParticipants: () => cs,
	SimpleGroupMembers: () => os,
	SimpleGroupPutUser: () => na,
	SimpleGroupRemoveUser: () => ra,
	SimpleGroupReply: () => Xr,
	SimpleGroupRoles: () => ss,
	SimpleGroupThreadedReply: () => Jr,
	SlideSet: () => jo,
	SoftwareApplication: () => Jo,
	StarterPacks: () => ls,
	StatusApplied: () => Ni,
	StatusClosed: () => Pi,
	StatusDraft: () => Fi,
	StatusOpen: () => Mi,
	TidalLogin: () => pa,
	Time: () => Ho,
	Torrent: () => Hi,
	TorrentComment: () => Ui,
	TransportMethodAnnouncement: () => Ka,
	UserEmojiList: () => Ma,
	UserGraspList: () => Wa,
	UserStatuses: () => Ao,
	VideoViewEvent: () => Xo,
	Voice: () => Si,
	VoiceComment: () => wi,
	WebBookmarks: () => ds,
	WikiArticle: () => Io,
	Zap: () => ha,
	ZapGoal: () => da,
	ZapRequest: () => ma,
	classifyKind: () => Ir,
	isAddressableKind: () => Fr,
	isEphemeralKind: () => Pr,
	isKind: () => Lr,
	isRegularKind: () => Mr,
	isReplaceableKind: () => Nr
});
function Mr(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function Nr(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function Pr(e) {
	return 2e4 <= e && e < 3e4;
}
function Fr(e) {
	return 3e4 <= e && e < 4e4;
}
function Ir(e) {
	return Mr(e) ? "regular" : Nr(e) ? "replaceable" : Pr(e) ? "ephemeral" : Fr(e) ? "parameterized" : "unknown";
}
function Lr(e, t) {
	let n = t instanceof Array ? t : [t];
	return Cr(e) && n.includes(e.kind) || !1;
}
var Rr = 0, zr = 1, Br = 2, Vr = 3, Hr = 4, Ur = 5, Wr = 6, Gr = 7, Kr = 8, qr = 9, Jr = 10, Yr = 11, Xr = 12, Zr = 13, Qr = 14, $r = 15, ei = 16, ti = 17, ni = 20, ri = 21, ii = 22, ai = 24, oi = 40, si = 41, ci = 42, li = 43, ui = 44, di = 54, fi = 64, pi = 818, mi = 1018, hi = 1021, gi = 1022, _i = 1040, vi = 1059, yi = 1063, bi = 1068, xi = 1111, Si = 1222, Ci = 1227, wi = 1244, Ti = 1311, Ei = 1337, Di = 1617, Oi = 1618, ki = 1619, Ai = 1621, ji = 1622, Mi = 1630, Ni = 1631, Pi = 1632, Fi = 1633, Ii = 1971, Li = 1984, Ri = 1984, zi = 1985, Bi = 1986, Vi = 1987, Hi = 2003, Ui = 2004, Wi = 2022, Gi = 4454, Ki = 4455, qi = 4550, Ji = 5999, Yi = 6999, Xi = 7e3, Zi = 7374, Qi = 7375, $i = 7376, ea = 7516, ta = 7517, na = 9e3, ra = 9001, ia = 9002, aa = 9005, oa = 9007, sa = 9008, ca = 9009, la = 9021, ua = 9022, da = 9041, fa = 9321, pa = 9467, ma = 9734, ha = 9735, ga = 9802, _a = 1e4, va = 10001, ya = 10002, ba = 10003, xa = 10004, Sa = 10005, Ca = 10006, wa = 10007, Ta = 10009, Ea = 10012, Da = 10013, Oa = 10015, ka = 10019, Aa = 10020, ja = 10021, Ma = 10030, Na = 10044, Pa = 10050, Fa = 10054, Ia = 10063, La = 10096, Ra = 10101, za = 10102, Ba = 10154, Va = 10164, Ha = 10166, Ua = 10312, Wa = 10317, Ga = 10377, Ka = 11111, qa = 13194, Ja = 15128, Ya = 17375, Xa = 21e3, Za = 22242, Qa = 23194, $a = 23195, eo = 24133, to = 24242, no = 27235, ro = 3e4, io = 30001, ao = 30002, oo = 30003, so = 30004, co = 30005, lo = 30007, uo = 30008, fo = 30009, po = 30015, mo = 30017, ho = 30018, go = 30019, _o = 30020, vo = 30023, yo = 30024, bo = 30030, xo = 30040, So = 30041, Co = 30063, wo = 30078, To = 30166, Eo = 30267, Do = 30311, Oo = 30312, ko = 30313, Ao = 30315, jo = 30388, Mo = 30402, No = 30403, Po = 30617, Fo = 30618, Io = 30818, Lo = 30819, Ro = 31234, zo = 31388, Bo = 31890, Vo = 31922, Ho = 31923, Uo = 31924, Wo = 31925, Go = 31987, Ko = 31989, qo = 31990, Jo = 32267, Yo = 34128, Xo = 34237, Zo = 34550, Qo = 35128, $o = 37515, es = 37516, ts = 38172, ns = 38173, rs = 38383, is = 39e3, as = 39001, os = 39002, ss = 39003, cs = 39004, ls = 39089, us = 39092, ds = 39701;
Z({}, {
	getHex64: () => fs,
	getInt: () => ps,
	getSubscriptionId: () => ms,
	matchEventId: () => hs,
	matchEventKind: () => _s,
	matchEventPubkey: () => gs
});
function fs(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function ps(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function ms(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function hs(e, t) {
	return t === fs(e, "id");
}
function gs(e, t) {
	return t === fs(e, "pubkey");
}
function _s(e, t) {
	return t === ps(e, "kind");
}
Z({}, { makeAuthEvent: () => vs });
function vs(e, t) {
	return {
		kind: Za,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
new TextEncoder();
var ys = {};
Z(ys, {
	BECH32_REGEX: () => Ss,
	Bech32MaxSize: () => xs,
	NostrTypeGuard: () => bs,
	decode: () => Ts,
	decodeNostrURI: () => ws,
	encodeBytes: () => js,
	naddrEncode: () => Ps,
	neventEncode: () => Ns,
	noteEncode: () => ks,
	nprofileEncode: () => Ms,
	npubEncode: () => Os,
	nsecEncode: () => Ds
});
var bs = {
	isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
	isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
	isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
	isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
	isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
	isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
	isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, xs = 5e3, Ss = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Cs(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function ws(e) {
	try {
		return e.startsWith("nostr:") && (e = e.substring(6)), Ts(e);
	} catch {
		return {
			type: "invalid",
			data: null
		};
	}
}
function Ts(e) {
	let { prefix: t, words: n } = sn.decode(e, xs), r = new Uint8Array(sn.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = Es(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nprofile");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: p(e[0][0]),
					relays: e[1] ? e[1].map((e) => hr.decode(e)) : []
				}
			};
		}
		case "nevent": {
			let e = Es(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nevent");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			if (e[2] && e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (e[3] && e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "nevent",
				data: {
					id: p(e[0][0]),
					relays: e[1] ? e[1].map((e) => hr.decode(e)) : [],
					author: e[2]?.[0] ? p(e[2][0]) : void 0,
					kind: e[3]?.[0] ? parseInt(p(e[3][0]), 16) : void 0
				}
			};
		}
		case "naddr": {
			let e = Es(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for naddr");
			if (!e[2]?.[0]) throw Error("missing TLV 2 for naddr");
			if (e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (!e[3]?.[0]) throw Error("missing TLV 3 for naddr");
			if (e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: hr.decode(e[0][0]),
					pubkey: p(e[2][0]),
					kind: parseInt(p(e[3][0]), 16),
					relays: e[1] ? e[1].map((e) => hr.decode(e)) : []
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
			data: p(r)
		};
		default: throw Error(`unknown prefix ${t}`);
	}
}
function Es(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		if (n.length < 2) throw Error("not enough data to read TLV");
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		if (n = n.slice(2 + r), i.length < r) throw Error(`not enough data to read on TLV ${e}`);
		t[e] = t[e] || [], t[e].push(i);
	}
	return t;
}
function Ds(e) {
	return js("nsec", e);
}
function Os(e) {
	return js("npub", g(e));
}
function ks(e) {
	return js("note", g(e));
}
function As(e, t) {
	let n = sn.toWords(t);
	return sn.encode(e, n, xs);
}
function js(e, t) {
	return As(e, t);
}
function Ms(e) {
	return As("nprofile", Fs({
		0: [g(e.pubkey)],
		1: (e.relays || []).map((e) => Q.encode(e))
	}));
}
function Ns(e) {
	let t;
	return e.kind !== void 0 && (t = Cs(e.kind)), As("nevent", Fs({
		0: [g(e.id)],
		1: (e.relays || []).map((e) => Q.encode(e)),
		2: e.author ? [g(e.author)] : [],
		3: t ? [new Uint8Array(t)] : []
	}));
}
function Ps(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	return new DataView(t).setUint32(0, e.kind, !1), As("naddr", Fs({
		0: [Q.encode(e.identifier)],
		1: (e.relays || []).map((e) => Q.encode(e)),
		2: [g(e.pubkey)],
		3: [new Uint8Array(t)]
	}));
}
function Fs(e) {
	let t = [];
	return Object.entries(e).reverse().forEach(([e, n]) => {
		n.forEach((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		});
	}), _(...t);
}
Z({}, {
	decrypt: () => Ls,
	encrypt: () => Is
});
function Is(e, t, n) {
	let r = e instanceof Uint8Array ? e : g(e), i = Rs(Ct.getSharedSecret(r, g("02" + t))), a = Uint8Array.from(y(16)), o = Q.encode(n), s = Kn(i, a).encrypt(o);
	return `${en.encode(new Uint8Array(s))}?iv=${en.encode(new Uint8Array(a.buffer))}`;
}
function Ls(e, t, n) {
	let r = e instanceof Uint8Array ? e : g(e), [i, a] = n.split("?iv="), o = Rs(Ct.getSharedSecret(r, g("02" + t))), s = en.decode(a), c = en.decode(i), l = Kn(o, s).decrypt(c);
	return hr.decode(l);
}
function Rs(e) {
	return e.slice(1, 33);
}
Z({}, {
	NIP05_REGEX: () => zs,
	isNip05: () => Bs,
	isValid: () => Gs,
	queryProfile: () => Ws,
	searchDomain: () => Us,
	useFetchImplementation: () => Hs
});
var zs = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Bs = (e) => zs.test(e || ""), Vs;
try {
	Vs = fetch;
} catch {}
function Hs(e) {
	Vs = e;
}
async function Us(e, t = "") {
	try {
		let n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await Vs(n, { redirect: "manual" });
		if (r.status !== 200) throw Error("Wrong response code");
		return (await r.json()).names;
	} catch {
		return {};
	}
}
async function Ws(e) {
	let t = e.match(zs);
	if (!t) return null;
	let [, n = "_", r] = t;
	try {
		let e = `https://${r}/.well-known/nostr.json?name=${n}`, t = await Vs(e, { redirect: "manual" });
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
async function Gs(e, t) {
	let n = await Ws(t);
	return n ? n.pubkey === e : !1;
}
Z({}, { parse: () => Ks });
function Ks(e) {
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
	fetchRelayInformation: () => Js,
	useFetchImplementation: () => qs
});
function qs(e) {}
async function Js(e) {
	return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
Z({}, {
	getPow: () => Ys,
	minePow: () => Zs
});
function Ys(e) {
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
function Xs(e) {
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
function Zs(e, t) {
	let n = 0, r = e, i = [
		"nonce",
		n.toString(),
		t.toString()
	];
	for (r.tags.push(i);;) {
		let e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
		e !== r.created_at && (n = 0, r.created_at = e), i[1] = (++n).toString();
		let a = k(Q.encode(JSON.stringify([
			0,
			r.pubkey,
			r.created_at,
			r.kind,
			r.tags,
			r.content
		])));
		if (Xs(a) >= t) {
			r.id = p(a);
			break;
		}
	}
	return r;
}
Z({}, {
	unwrapEvent: () => kc,
	unwrapManyEvents: () => Ac,
	wrapEvent: () => Dc,
	wrapManyEvents: () => Oc
}), Z({}, {
	createRumor: () => yc,
	createSeal: () => bc,
	createWrap: () => xc,
	unwrapEvent: () => wc,
	unwrapManyEvents: () => Tc,
	wrapEvent: () => Sc,
	wrapManyEvents: () => Cc
}), Z({}, {
	decrypt: () => dc,
	encrypt: () => uc,
	getConversationKey: () => tc,
	v2: () => fc
});
var Qs = 1, $s = 4294967295, ec = 65536;
function tc(e, t) {
	return lr(k, Ct.getSharedSecret(e, g("02" + t)).subarray(1, 33), Q.encode("nip44-v2"));
}
function nc(e, t) {
	let n = fr(k, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function rc(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 2 ** (Math.floor(Math.log2(e - 1)) + 1), n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function ic(e) {
	if (!Number.isSafeInteger(e) || e < Qs || e > 65535) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
	let t = /* @__PURE__ */ new Uint8Array(2);
	return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function ac(e) {
	if (!Number.isSafeInteger(e) || e < ec || e > $s) throw Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
	let t = /* @__PURE__ */ new Uint8Array(4);
	return new DataView(t.buffer).setUint32(0, e, !1), t;
}
function oc(e) {
	let t = Q.encode(e), n = t.length;
	if (n < Qs || n > $s) throw Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
	return _(n >= ec ? _(new Uint8Array([0, 0]), ac(n)) : ic(n), t, new Uint8Array(rc(n) - n));
}
function sc(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = t.getUint16(0), r, i;
	if (n === 0) {
		if (r = t.getUint32(2), r < ec) throw Error("invalid padding");
		i = 6;
	} else r = n, i = 2;
	let a = e.subarray(i, i + r);
	if (r < Qs || r > $s || a.length !== r || e.length !== i + rc(r)) throw Error("invalid padding");
	return hr.decode(a);
}
function cc(e, t, n) {
	if (n.length !== 32) throw Error("AAD associated data must be 32 bytes");
	return et(k, e, _(n, t));
}
function lc(e) {
	if (typeof e != "string") throw Error("payload must be a valid string");
	let t = e.length;
	if (t < 132) throw Error("invalid payload length: " + t);
	if (e[0] === "#") throw Error("unknown encryption version");
	let n;
	try {
		n = en.decode(e);
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
function uc(e, t, n = y(32)) {
	let { chacha_key: r, chacha_nonce: i, hmac_key: a } = nc(t, n), o = cr(r, i, oc(e)), s = cc(a, o, n);
	return en.encode(_(new Uint8Array([2]), n, o, s));
}
function dc(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = lc(e), { chacha_key: a, chacha_nonce: o, hmac_key: s } = nc(t, n);
	if (!vn(cc(s, r, n), i)) throw Error("invalid MAC");
	return sc(cr(a, o, r));
}
var fc = {
	utils: {
		getConversationKey: tc,
		calcPaddedLen: rc,
		pad: oc,
		unpad: sc
	},
	encrypt: uc,
	decrypt: dc
}, pc = 172800, mc = () => Math.round(Date.now() / 1e3), hc = () => Math.round(mc() - Math.random() * pc), gc = (e, t) => tc(e, t), _c = (e, t, n) => uc(JSON.stringify(e), gc(t, n)), vc = (e, t) => JSON.parse(dc(e.content, gc(t, e.pubkey)));
function yc(e, t) {
	let n = {
		created_at: mc(),
		content: "",
		tags: [],
		...e,
		pubkey: kr(t)
	};
	return n.id = Er(n), n;
}
function bc(e, t, n) {
	return Ar({
		kind: Zr,
		content: _c(e, t, n),
		created_at: hc(),
		tags: []
	}, t);
}
function xc(e, t) {
	let n = Or();
	return Ar({
		kind: vi,
		content: _c(e, n, t),
		created_at: hc(),
		tags: [["p", t]]
	}, n);
}
function Sc(e, t, n) {
	return xc(bc(yc(e, t), t, n), n);
}
function Cc(e, t, n) {
	if (!n || n.length === 0) throw Error("At least one recipient is required.");
	let r = [Sc(e, t, kr(t))];
	return n.forEach((n) => {
		r.push(Sc(e, t, n));
	}), r;
}
function wc(e, t) {
	if (e.kind !== vi) throw Error(`unexpected wrap kind ${e.kind}, expected ${vi}`);
	let n = vc(e, t);
	if (n.kind !== Zr) throw Error(`unexpected seal kind ${n.kind}, expected ${Zr}`);
	if (!jr(n)) throw Error("seal signature is invalid");
	let r = vc(n, t);
	if (r.pubkey !== n.pubkey) throw Error(`rumor pubkey ${r.pubkey} does not match seal pubkey ${n.pubkey}`);
	return r;
}
function Tc(e, t) {
	let n = [];
	return e.forEach((e) => {
		try {
			n.push(wc(e, t));
		} catch {}
	}), n.sort((e, t) => e.created_at - t.created_at), n;
}
function Ec(e, t, n, r) {
	let i = {
		created_at: Math.ceil(Date.now() / 1e3),
		kind: Qr,
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
function Dc(e, t, n, r, i) {
	return Sc(Ec(t, n, r, i), e, t.publicKey);
}
function Oc(e, t, n, r, i) {
	if (!t || t.length === 0) throw Error("At least one recipient is required.");
	return [{ publicKey: kr(e) }, ...t].map((t) => Dc(e, t, n, r, i));
}
var kc = wc, Ac = Tc;
Z({}, {
	finishRepostEvent: () => jc,
	getRepostedEvent: () => Nc,
	getRepostedEventPointer: () => Mc
});
function jc(e, t, n, r) {
	let i, a = [
		...e.tags ?? [],
		[
			"e",
			t.id,
			n
		],
		["p", t.pubkey]
	];
	return t.kind === zr ? i = Wr : (i = ei, a.push(["k", String(t.kind)])), Ar({
		kind: i,
		tags: a,
		content: e.content === "" || t.tags?.find((e) => e[0] === "-") ? "" : JSON.stringify(t),
		created_at: e.created_at
	}, r);
}
function Mc(e) {
	if (![Wr, ei].includes(e.kind)) return;
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
function Nc(e, { skipVerification: t } = {}) {
	let n = Mc(e);
	if (n === void 0 || e.content === "") return;
	let r;
	try {
		r = JSON.parse(e.content);
	} catch {
		return;
	}
	if (r.id === n.id && (t || jr(r))) return r;
}
Z({}, {
	NOSTR_URI_REGEX: () => Pc,
	parse: () => Ic,
	test: () => Fc
});
var Pc = RegExp(`nostr:(${Ss.source})`);
function Fc(e) {
	return typeof e == "string" && RegExp(`^${Pc.source}$`).test(e);
}
function Ic(e) {
	let t = e.match(RegExp(`^${Pc.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: Ts(t[1])
	};
}
Z({}, { parse: () => Uc });
function Lc(e) {
	if (e) return /^\d+$/.test(e) ? parseInt(e, 10) : e;
}
function Rc(e, t) {
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
function zc(e) {
	switch (e[0]) {
		case "E":
		case "e": return !e[1] || !$(e[1]) ? void 0 : {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && $(e[3]) ? e[3] : void 0
		};
		case "A":
		case "a": return e[1] ? Rc(e[1], e[2]) : void 0;
		case "I":
		case "i": return e[1] ? {
			value: e[1],
			hint: e[2]
		} : void 0;
	}
}
function Bc(e) {
	if (e[1]) {
		if (e[1].includes(":")) return Rc(e[1], e[2]);
		if ($(e[1])) return {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && $(e[3]) ? e[3] : void 0
		};
	}
}
function Vc(e) {
	return e.findLast((e) => e.tagName === "A" || e.tagName === "a")?.pointer || e.findLast((e) => e.tagName === "I" || e.tagName === "i")?.pointer || e.findLast((e) => e.tagName === "E" || e.tagName === "e")?.pointer;
}
function Hc(e, t) {
	if (!e || !("id" in e) || !e.author) return;
	let n = t.find((t) => t.pubkey === e.author);
	n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
		e.relays.indexOf(t) === -1 && e.relays.push(t);
	}), n.relays = e.relays);
}
function Uc(e) {
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
		let e = zc(i);
		e && n.push({
			tagName: i[0],
			pointer: e
		});
	} else if ((i[0] === "e" || i[0] === "a" || i[0] === "i") && i[1]) {
		let e = zc(i);
		e && r.push({
			tagName: i[0],
			pointer: e
		});
	} else if (i[0] === "K") t.rootKind = Lc(i[1]);
	else if (i[0] === "k") t.replyKind = Lc(i[1]);
	else if (i[0] === "q") {
		let e = Bc(i);
		e && t.quotes.push(e);
	} else (i[0] === "P" || i[0] === "p") && i[1] && $(i[1]) && t.profiles.push({
		pubkey: i[1],
		relays: i[2] ? [i[2]] : []
	});
	return t.root = Vc(n), t.reply = Vc(r), Hc(t.root, t.profiles), Hc(t.reply, t.profiles), t.quotes.forEach((e) => Hc(e, t.profiles)), t;
}
Z({}, {
	finishReactionEvent: () => Wc,
	getReactedEventPointer: () => Gc
});
function Wc(e, t, n) {
	let r = t.tags.filter((e) => e.length >= 2 && (e[0] === "e" || e[0] === "p"));
	return Ar({
		...e,
		kind: Gr,
		tags: [
			...e.tags ?? [],
			...r,
			["e", t.id],
			["p", t.pubkey]
		],
		content: e.content ?? "+"
	}, n);
}
function Gc(e) {
	if (e.kind !== Gr) return;
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
Z({}, { parse: () => Yc });
var Kc = /\W/m, qc = /[^\w\/] |[^\w\/]$|$|,| /m, Jc = 42;
function* Yc(e) {
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
			if (o === 0 || e[o - 1].match(Kc)) {
				let t = e.slice(o + 1, o + Jc).match(Kc), a = t ? o + 1 + t.index : n;
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
			let t = e.slice(a + 60).match(Kc), o = t ? a + 60 + t.index : n;
			try {
				let t, { data: n, type: s } = Ts(e.slice(a + 1, o));
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
			let t = e.slice(a + 4).match(qc), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 5 : 4;
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
			let t = e.slice(a + 4).match(qc), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 3 : 2;
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
	channelCreateEvent: () => Xc,
	channelHideMessageEvent: () => $c,
	channelMessageEvent: () => Qc,
	channelMetadataEvent: () => Zc,
	channelMuteUserEvent: () => el
});
var Xc = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Ar({
		kind: oi,
		tags: [...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, Zc = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Ar({
		kind: si,
		tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, Qc = (e, t) => {
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
	]), Ar({
		kind: ci,
		tags: [...n, ...e.tags ?? []],
		content: e.content,
		created_at: e.created_at
	}, t);
}, $c = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Ar({
		kind: li,
		tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, el = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Ar({
		kind: ui,
		tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
};
Z({}, {
	EMOJI_SHORTCODE_REGEX: () => tl,
	matchAll: () => rl,
	regex: () => nl,
	replaceAll: () => il
});
var tl = /:(\w+):/, nl = () => RegExp(`\\B${tl.source}\\B`, "g");
function* rl(e) {
	let t = e.matchAll(nl());
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
function il(e, t) {
	return e.replaceAll(nl(), (e, n) => t({
		shortcode: e,
		name: n
	}));
}
Z({}, {
	useFetchImplementation: () => ol,
	validateGithub: () => sl
});
var al;
try {
	al = fetch;
} catch {}
function ol(e) {
	al = e;
}
async function sl(e, t, n) {
	try {
		return await (await al(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
Z({}, {
	makeNwcRequestEvent: () => ll,
	parseConnectionString: () => cl
});
function cl(e) {
	let { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, a = r.getAll("relay"), o = r.get("secret");
	if (!i || a.length === 0 || !o) throw Error("invalid connection string");
	return {
		pubkey: i,
		relay: a[0],
		relays: a,
		secret: o
	};
}
async function ll(e, t, n) {
	let r = Is(t, e, JSON.stringify({
		method: "pay_invoice",
		params: { invoice: n }
	}));
	return Ar({
		kind: Qa,
		created_at: Math.round(Date.now() / 1e3),
		content: r,
		tags: [["p", e]]
	}, t);
}
Z({}, { normalizeIdentifier: () => ul });
function ul(e) {
	return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((e) => /\p{Letter}/u.test(e) || /\p{Number}/u.test(e) ? e : "-").join("");
}
Z({}, {
	getSatoshisAmountFromBolt11: () => _l,
	getZapEndpoint: () => pl,
	makeZapReceipt: () => gl,
	makeZapRequest: () => ml,
	useFetchImplementation: () => fl,
	validateZapRequest: () => hl
});
var dl;
try {
	dl = fetch;
} catch {}
function fl(e) {
	dl = e;
}
async function pl(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (r) {
			let [e, n] = r.split("@");
			t = new URL(`/.well-known/lnurlp/${e}`, `https://${n}`).toString();
		} else if (n) {
			let { words: e } = sn.decode(n, 1e3), r = sn.fromWords(e);
			t = hr.decode(r);
		} else return null;
		let i = await (await dl(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function ml(e) {
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
		if (t.tags.push(["e", e.event.id]), Nr(e.event.kind)) {
			let n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
			t.tags.push(n);
		} else if (Fr(e.event.kind)) {
			let n = e.event.tags.find(([e, t]) => e === "d" && t);
			if (!n) throw Error("d tag not found or is empty");
			let r = ["a", `${e.event.kind}:${e.event.pubkey}:${n[1]}`];
			t.tags.push(r);
		}
		t.tags.push(["k", e.event.kind.toString()]);
	}
	return t;
}
function hl(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!Cr(t)) return "Zap request is not a valid Nostr event.";
	if (!jr(t)) return "Invalid signature on zap request.";
	let n = t.tags.find(([e, t]) => e === "p" && t);
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!$(n[1])) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find(([e, t]) => e === "e" && t);
	return r && !$(r[1]) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([e, t]) => e === "relays" && t) ? null : "Zap request doesn't have a 'relays' tag.";
}
function gl({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
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
function _l(e) {
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
	Negentropy: () => kl,
	NegentropyStorageVector: () => Ol,
	NegentropySync: () => Ml
});
var vl = 97, yl = 32, bl = 16, xl = {
	Skip: 0,
	Fingerprint: 1,
	IdList: 2
}, Sl = class {
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
		if (e instanceof Sl && (e = e.unwrap()), typeof e.length != "number") throw Error("bad length");
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
function Cl(e) {
	let t = 0;
	for (;;) {
		if (e.length === 0) throw Error("parse ends prematurely");
		let n = e.shift();
		if (t = t << 7 | n & 127, !(n & 128)) break;
	}
	return t;
}
function wl(e) {
	if (e === 0) return new Sl(new Uint8Array([0]));
	let t = [];
	for (; e !== 0;) t.push(e & 127), e >>>= 7;
	t.reverse();
	for (let e = 0; e < t.length - 1; e++) t[e] |= 128;
	return new Sl(new Uint8Array(t));
}
function Tl(e) {
	return El(e, 1)[0];
}
function El(e, t) {
	if (e.length < t) throw Error("parse ends prematurely");
	return e.shiftN(t);
}
var Dl = class {
	buf;
	constructor() {
		this.setToZero();
	}
	setToZero() {
		this.buf = new Uint8Array(yl);
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
		let t = new Uint8Array(yl);
		t[0] = 1, this.add(t);
	}
	getFingerprint(e) {
		let t = new Sl();
		return t.extend(this.buf), t.extend(wl(e)), k(t.unwrap()).subarray(0, bl);
	}
}, Ol = class {
	items;
	sealed;
	constructor() {
		this.items = [], this.sealed = !1;
	}
	insert(e, t) {
		if (this.sealed) throw Error("already sealed");
		let n = g(t);
		if (n.byteLength !== yl) throw Error("bad id size for added item");
		this.items.push({
			timestamp: e,
			id: n
		});
	}
	seal() {
		if (this.sealed) throw Error("already sealed");
		this.sealed = !0, this.items.sort(jl);
		for (let e = 1; e < this.items.length; e++) if (jl(this.items[e - 1], this.items[e]) === 0) throw Error("duplicate item inserted");
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
		return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (e) => jl(e, n) < 0);
	}
	fingerprint(e, t) {
		let n = new Dl();
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
}, kl = class {
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
		let e = new Sl();
		return e.extend(new Uint8Array([vl])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), p(e.unwrap());
	}
	reconcile(e, t, n) {
		let r = new Sl(g(e));
		this.lastTimestampIn = this.lastTimestampOut = 0;
		let i = new Sl();
		i.extend(new Uint8Array([vl]));
		let a = Tl(r);
		if (a < 96 || a > 111) throw Error("invalid negentropy protocol version byte");
		if (a !== vl) throw Error("unsupported negentropy protocol version requested: " + (a - 96));
		let o = this.storage.size(), s = this._bound(0), c = 0, l = !1;
		for (; r.length !== 0;) {
			let e = new Sl(), a = () => {
				l && (l = !1, e.extend(this.encodeBound(s)), e.extend(wl(xl.Skip)));
			}, u = this.decodeBound(r), d = Cl(r), f = c, m = this.storage.findLowerBound(c, o, u);
			if (d === xl.Skip) l = !0;
			else if (d === xl.Fingerprint) Al(El(r, bl), this.storage.fingerprint(f, m)) === 0 ? l = !0 : (a(), this.splitRange(f, m, u, e));
			else if (d === xl.IdList) {
				let e = Cl(r), i = {};
				for (let t = 0; t < e; t++) {
					let e = El(r, yl);
					i[p(e)] = e;
				}
				if (l = !0, this.storage.iterate(f, m, (e) => {
					let n = e.id, r = p(n);
					return i[r] ? delete i[p(n)] : t?.(r), !0;
				}), n) for (let e of Object.values(i)) n(p(e));
			} else throw Error("unexpected mode");
			if (this.exceededFrameSizeLimit(i.length + e.length)) {
				let e = this.storage.fingerprint(m, o);
				i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(wl(xl.Fingerprint)), i.extend(e);
				break;
			}
			i.extend(e), c = m, s = u;
		}
		return i.length === 1 ? null : p(i.unwrap());
	}
	splitRange(e, t, n, r) {
		let i = t - e;
		if (i < 32) r.extend(this.encodeBound(n)), r.extend(wl(xl.IdList)), r.extend(wl(i)), this.storage.iterate(e, t, (e) => (r.extend(e.id), !0));
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
				r.extend(this.encodeBound(l)), r.extend(wl(xl.Fingerprint)), r.extend(c);
			}
		}
	}
	exceededFrameSizeLimit(e) {
		return e > this.frameSizeLimit - 200;
	}
	decodeTimestampIn(e) {
		let t = Cl(e);
		return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
	}
	decodeBound(e) {
		let t = this.decodeTimestampIn(e), n = Cl(e);
		if (n > yl) throw Error("bound key too long");
		return {
			timestamp: t,
			id: El(e, n)
		};
	}
	encodeTimestampOut(e) {
		if (e === Number.MAX_VALUE) return this.lastTimestampOut = Number.MAX_VALUE, wl(0);
		let t = e;
		return e -= this.lastTimestampOut, this.lastTimestampOut = t, wl(e + 1);
	}
	encodeBound(e) {
		let t = new Sl();
		return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(wl(e.id.length)), t.extend(e.id), t;
	}
	getMinimalBound(e, t) {
		if (t.timestamp !== e.timestamp) return this._bound(t.timestamp);
		{
			let n = 0, r = t.id, i = e.id;
			for (let e = 0; e < yl && r[e] === i[e]; e++) n++;
			return this._bound(t.timestamp, t.id.subarray(0, n + 1));
		}
	}
};
function Al(e, t) {
	for (let n = 0; n < e.byteLength; n++) {
		if (e[n] < t[n]) return -1;
		if (e[n] > t[n]) return 1;
	}
	return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function jl(e, t) {
	return e.timestamp === t.timestamp ? Al(e.id, t.id) : e.timestamp - t.timestamp;
}
var Ml = class {
	relay;
	storage;
	neg;
	filter;
	subscription;
	onhave;
	onneed;
	constructor(e, t, n, r = {}) {
		this.relay = e, this.storage = t, this.neg = new kl(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (e) => {
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
	getToken: () => Pl,
	hashPayload: () => Vl,
	unpackEventFromToken: () => Il,
	validateEvent: () => Ul,
	validateEventKind: () => Rl,
	validateEventMethodTag: () => Bl,
	validateEventPayloadTag: () => Hl,
	validateEventTimestamp: () => Ll,
	validateEventUrlTag: () => zl,
	validateToken: () => Fl
});
var Nl = "Nostr ";
async function Pl(e, t, n, r = !1, i) {
	let a = {
		kind: no,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	i && a.tags.push(["payload", Vl(i)]);
	let o = await n(a);
	return (r ? Nl : "") + en.encode(Q.encode(JSON.stringify(o)));
}
async function Fl(e, t, n) {
	return await Ul(await Il(e).catch((e) => {
		throw e;
	}), t, n).catch((e) => {
		throw e;
	});
}
async function Il(e) {
	if (!e) throw Error("Missing token");
	e = e.replace(Nl, "");
	let t = hr.decode(en.decode(e));
	if (!t || t.length === 0 || !t.startsWith("{")) throw Error("Invalid token");
	return JSON.parse(t);
}
function Ll(e) {
	return e.created_at ? Math.abs(Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at) < 60 : !1;
}
function Rl(e) {
	return e.kind === no;
}
function zl(e, t) {
	let n = e.tags.find((e) => e[0] === "u");
	return n ? n.length > 0 && n[1] === t : !1;
}
function Bl(e, t) {
	let n = e.tags.find((e) => e[0] === "method");
	return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function Vl(e) {
	return p(k(Q.encode(JSON.stringify(e))));
}
function Hl(e, t) {
	let n = e.tags.find((e) => e[0] === "payload");
	if (!n) return !1;
	let r = Vl(t);
	return n.length > 0 && n[1] === r;
}
async function Ul(e, t, n, r) {
	if (!jr(e)) throw Error("Invalid nostr event, signature invalid");
	if (!Rl(e)) throw Error("Invalid nostr event, kind invalid");
	if (!Ll(e)) throw Error("Invalid nostr event, created_at timestamp invalid");
	if (!zl(e, t)) throw Error("Invalid nostr event, url tag invalid");
	if (!Bl(e, n)) throw Error("Invalid nostr event, method tag invalid");
	if (r && typeof r == "object" && Object.keys(r).length > 0 && !Hl(e, r)) throw Error("Invalid nostr event, payload tag does not match request body hash");
	return !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relayLists.ts
var Wl = [
	"wss://relay.damus.io/",
	"wss://relay.nostr.band/",
	"wss://nrelay.c-stellar.net/",
	"wss://nrelay-jp.c-stellar.net/"
], Gl = /* @__PURE__ */ new Set(["ws:", "wss:"]), Kl = new Set(Wl), ql = class {
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
		return t !== null && Kl.has(t);
	}
	static normalizeExternalRelayUrlCandidate(e) {
		if (typeof e != "string") return null;
		let t = e.trim();
		if (!t) return null;
		try {
			if (t.includes("://")) {
				let e = new URL(t);
				if (!Gl.has(e.protocol) || e.username || e.password) return null;
			}
			let e = mr.normalizeURL(t), n = new URL(e);
			return !Gl.has(n.protocol) || !n.hostname || n.username || n.password ? null : e;
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
function Jl(e) {
	if (typeof e != "string" || !e.trim().includes("://")) return !1;
	try {
		let t = new URL(e.trim());
		return (t.protocol === "ws:" || t.protocol === "wss:") && !t.username && !t.password && ql.normalizeExternalRelayUrl(e) !== null;
	} catch {
		return !1;
	}
}
function Yl(e, t = {}) {
	try {
		let n = ys.decode(e);
		if (n.type === "nevent") {
			let e = n.data, r = Array.isArray(e.relays) ? e.relays : [];
			return t.relayValidation === "strict" && r.some((e) => !Jl(e)) ? null : {
				eventId: e.id,
				relayHints: ql.sanitizeExternalRelayUrls(r.filter((e) => typeof e == "string"), { limit: ql.EXTERNAL_INPUT_RELAY_LIMIT }),
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
function Xl(e) {
	return e.map((e) => [...e]);
}
function Zl(e) {
	return {
		id: e.id,
		pubkey: e.pubkey,
		created_at: e.created_at,
		kind: e.kind,
		tags: Xl(e.tags),
		content: e.content,
		sig: e.sig
	};
}
function Ql(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profilePictureUrlUtils.ts
var $l = /* @__PURE__ */ e((/* @__PURE__ */ t(((e, t, n) => {
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
})))(), 1);
function eu(e) {
	let t = e ?? globalThis.location?.origin;
	if (!t) return null;
	try {
		return new URL(t);
	} catch {
		return null;
	}
}
function tu(e) {
	return e.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}
function nu(e) {
	let t = tu(e);
	if (!t || !$l.isValid(t)) return !1;
	try {
		return $l.parse(t).range() !== "unicast";
	} catch {
		return !0;
	}
}
function ru(e) {
	let t = e.trim().toLowerCase();
	return !(!t || t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") || nu(t) || !t.includes("."));
}
function iu(e) {
	let t = e.hostname.trim().toLowerCase();
	return t ? t === "localhost" || t.endsWith(".localhost") || t.endsWith(".local") ? !0 : nu(t) : !1;
}
function au(e, t) {
	return !!t && e.origin === t.origin;
}
function ou(e, t = {}) {
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
	let i = eu(t.currentOrigin), a = au(r, i) && !!i && iu(i);
	if (r.protocol === "http:") {
		if (!a) return null;
	} else if (r.protocol !== "https:") return null;
	return !a && !ru(r.hostname) ? null : (r.hash = "", r.toString());
}
function su(e, t = {}) {
	if (!e) return !1;
	let n = ou(e, t);
	if (!n) return !1;
	let r = eu(t.currentOrigin);
	if (!r) return !1;
	try {
		return new URL(n).origin === r.origin;
	} catch {
		return !1;
	}
}
function cu(e, t = {}) {
	let n = ou(e, t);
	if (!n) return "";
	let r = new URL(n);
	return r.searchParams.has("profile") || r.searchParams.set("profile", "true"), r.toString();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedComposerContextValidation.ts
var lu = class extends Error {
	constructor() {
		super("invalid_composer_context"), this.name = "EmbedComposerContextValidationError";
	}
};
function uu() {
	throw new lu();
}
function du(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function fu(e) {
	return /^[0-9a-f]{64}$/.test(e);
}
function pu(e) {
	(typeof e != "string" || Yl(e, { relayValidation: "strict" }) === null) && uu();
}
function mu(e, t) {
	if (!Object.prototype.hasOwnProperty.call(e, t)) return;
	let n = e[t];
	n != null && (typeof n != "string" || n.trim().length === 0) && uu();
}
function hu(e) {
	if (e != null) {
		if (du(e) || uu(), pu(e.reference), e.relays !== void 0) {
			Array.isArray(e.relays) || uu();
			for (let t of e.relays) (typeof t != "string" || ql.sanitizeExternalRelayUrls([t], { limit: 1 }).length !== 1) && uu();
		}
		mu(e, "name"), mu(e, "about");
	}
}
function gu(e) {
	if (du(e) || uu(), e.reply !== void 0 && e.reply !== null && pu(e.reply), e.quotes !== void 0 && e.quotes !== null) {
		Array.isArray(e.quotes) || uu();
		for (let t of e.quotes) pu(t);
	}
	return e.content !== void 0 && e.content !== null && typeof e.content != "string" && uu(), hu(e.channel), e;
}
function _u(e, t) {
	if (!du(e)) return {};
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = n.get(e.eventId);
		t ? t.push(e) : n.set(e.eventId, [e]);
	}
	let r = {};
	for (let [t, i] of n) try {
		if (!Object.prototype.hasOwnProperty.call(e, t)) continue;
		let n = e[t];
		if (!Ql(n)) continue;
		let a = Zl(n);
		if (!Cr(a) || Er(a) !== a.id || !jr(a) || a.id !== t || i.some((e) => e.authorPubkey !== null && a.pubkey !== e.authorPubkey)) continue;
		r[t] = Zl(a);
	} catch {
		continue;
	}
	return r;
}
function vu(e) {
	if (!du(e)) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) {
		if (!fu(n) || !du(r)) continue;
		let e = typeof r.displayName == "string" && r.displayName.trim() || null, i = typeof r.picture == "string" ? ou(r.picture) : null;
		(e || i) && (t[n] = {
			displayName: e,
			picture: i
		});
	}
	return t;
}
export { su as a, ql as c, cu as i, ys as l, _u as n, ou as o, gu as r, Yl as s, vu as t };
