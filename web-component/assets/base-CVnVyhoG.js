// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/utils.js
function e(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function t(e, t = "") {
	if (!Number.isSafeInteger(e) || e < 0) {
		let n = t && `"${t}" `;
		throw Error(`${n}expected integer >= 0, got ${e}`);
	}
}
function n(t, n, r = "") {
	let i = e(t), a = t?.length, o = n !== void 0;
	if (!i || o && a !== n) {
		let e = r && `"${r}" `, s = o ? ` of length ${n}` : "", c = i ? `length=${a}` : `type=${typeof t}`;
		throw Error(e + "expected Uint8Array" + s + ", got " + c);
	}
	return t;
}
function r(e) {
	if (typeof e != "function" || typeof e.create != "function") throw Error("Hash must wrapped by utils.createHasher");
	t(e.outputLen), t(e.blockLen);
}
function i(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function a(e, t) {
	n(e, void 0, "digestInto() output");
	let r = t.outputLen;
	if (e.length < r) throw Error("\"digestInto() output\" expected to be of length >=" + r);
}
function o(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function s(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function c(e, t) {
	return e << 32 - t | e >>> t;
}
var l = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", u = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function d(e) {
	if (n(e), l) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += u[e[n]];
	return t;
}
var f = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function p(e) {
	if (e >= f._0 && e <= f._9) return e - f._0;
	if (e >= f.A && e <= f.F) return e - (f.A - 10);
	if (e >= f.a && e <= f.f) return e - (f.a - 10);
}
function m(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	if (l) return Uint8Array.fromHex(e);
	let t = e.length, n = t / 2;
	if (t % 2) throw Error("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = p(e.charCodeAt(i)), a = p(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw Error("hex string expected, got non-hex character \"" + t + "\" at index " + i);
		}
		r[t] = n * 16 + a;
	}
	return r;
}
function h(...e) {
	let t = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n(i), t += i.length;
	}
	let r = new Uint8Array(t);
	for (let t = 0, n = 0; t < e.length; t++) {
		let i = e[t];
		r.set(i, n), n += i.length;
	}
	return r;
}
function g(e, t = {}) {
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
function _(e = 32) {
	let t = typeof globalThis == "object" ? globalThis.crypto : null;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined");
	return t.getRandomValues(new Uint8Array(e));
}
var v = (e) => ({ oid: Uint8Array.from([
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
function y(e, t, n) {
	return e & t ^ ~e & n;
}
function b(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var x = class {
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
		this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = s(this.buffer);
	}
	update(e) {
		i(this), n(e);
		let { view: t, buffer: r, blockLen: a } = this, o = e.length;
		for (let n = 0; n < o;) {
			let i = Math.min(a - this.pos, o - n);
			if (i === a) {
				let t = s(e);
				for (; a <= o - n; n += a) this.process(t, n);
			} else r.set(e.subarray(n, n + i), this.pos), this.pos += i, n += i, this.pos === a && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		i(this), a(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: c } = this, { pos: l } = this;
		t[l++] = 128, o(this.buffer.subarray(l)), this.padOffset > r - l && (this.process(n, 0), l = 0);
		for (let e = l; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), c), this.process(n, 0);
		let u = s(e), d = this.outputLen;
		if (d % 4) throw Error("_sha2: outputLen must be aligned to 32bit");
		let f = d / 4, p = this.get();
		if (f > p.length) throw Error("_sha2: outputLen bigger than state");
		for (let e = 0; e < f; e++) u.setUint32(4 * e, p[e], c);
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
}, S = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), C = /* @__PURE__ */ Uint32Array.from([
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
]), w = /* @__PURE__ */ new Uint32Array(64), T = class extends x {
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
		for (let n = 0; n < 16; n++, t += 4) w[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = w[e - 15], n = w[e - 2], r = c(t, 7) ^ c(t, 18) ^ t >>> 3, i = c(n, 17) ^ c(n, 19) ^ n >>> 10;
			w[e] = i + w[e - 7] + r + w[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: l, H: u } = this;
		for (let e = 0; e < 64; e++) {
			let t = c(o, 6) ^ c(o, 11) ^ c(o, 25), d = u + t + y(o, s, l) + C[e] + w[e] | 0, f = (c(n, 2) ^ c(n, 13) ^ c(n, 22)) + b(n, r, i) | 0;
			u = l, l = s, s = o, o = a + d | 0, a = i, i = r, r = n, n = d + f | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, l = l + this.G | 0, u = u + this.H | 0, this.set(n, r, i, a, o, s, l, u);
	}
	roundClean() {
		o(w);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), o(this.buffer);
	}
}, ee = class extends T {
	A = S[0] | 0;
	B = S[1] | 0;
	C = S[2] | 0;
	D = S[3] | 0;
	E = S[4] | 0;
	F = S[5] | 0;
	G = S[6] | 0;
	H = S[7] | 0;
	constructor() {
		super(32);
	}
}, E = /* @__PURE__ */ g(() => new ee(), /* @__PURE__ */ v(1)), D = /* @__PURE__ */ BigInt(0), O = /* @__PURE__ */ BigInt(1);
function k(e, t = "") {
	if (typeof e != "boolean") {
		let n = t && `"${t}" `;
		throw Error(n + "expected boolean, got type=" + typeof e);
	}
	return e;
}
function A(e) {
	if (typeof e == "bigint") {
		if (!se(e)) throw Error("positive bigint expected, got " + e);
	} else t(e);
	return e;
}
function j(e) {
	let t = A(e).toString(16);
	return t.length & 1 ? "0" + t : t;
}
function te(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	return e === "" ? D : BigInt("0x" + e);
}
function M(e) {
	return te(d(e));
}
function ne(e) {
	return te(d(ae(n(e)).reverse()));
}
function re(e, n) {
	t(n), e = A(e);
	let r = m(e.toString(16).padStart(n * 2, "0"));
	if (r.length !== n) throw Error("number too large");
	return r;
}
function ie(e, t) {
	return re(e, t).reverse();
}
function ae(e) {
	return Uint8Array.from(e);
}
function oe(e) {
	return Uint8Array.from(e, (t, n) => {
		let r = t.charCodeAt(0);
		if (t.length !== 1 || r > 127) throw Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
		return r;
	});
}
var se = (e) => typeof e == "bigint" && D <= e;
function ce(e, t, n) {
	return se(e) && se(t) && se(n) && t <= e && e < n;
}
function le(e, t, n, r) {
	if (!ce(t, n, r)) throw Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function ue(e) {
	let t = 0;
	for (; e > D; e >>= O, t += 1);
	return t;
}
var de = (e) => (O << BigInt(e)) - O;
function fe(e, n, r) {
	if (t(e, "hashLen"), t(n, "qByteLen"), typeof r != "function") throw Error("hmacFn must be a function");
	let i = (e) => new Uint8Array(e), a = Uint8Array.of(), o = Uint8Array.of(0), s = Uint8Array.of(1), c = i(e), l = i(e), u = 0, d = () => {
		c.fill(1), l.fill(0), u = 0;
	}, f = (...e) => r(l, h(c, ...e)), p = (e = a) => {
		l = f(o, e), c = f(), e.length !== 0 && (l = f(s, e), c = f());
	}, m = () => {
		if (u++ >= 1e3) throw Error("drbg: tried max amount of iterations");
		let e = 0, t = [];
		for (; e < n;) {
			c = f();
			let n = c.slice();
			t.push(n), e += c.length;
		}
		return h(...t);
	};
	return (e, t) => {
		d(), p(e);
		let n;
		for (; !(n = t(m()));) p();
		return d(), n;
	};
}
function pe(e, t = {}, n = {}) {
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
function me(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		let i = t.get(n);
		if (i !== void 0) return i;
		let a = e(n, ...r);
		return t.set(n, a), a;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/modular.js
var N = /* @__PURE__ */ BigInt(0), P = /* @__PURE__ */ BigInt(1), F = /* @__PURE__ */ BigInt(2), he = /* @__PURE__ */ BigInt(3), ge = /* @__PURE__ */ BigInt(4), _e = /* @__PURE__ */ BigInt(5), ve = /* @__PURE__ */ BigInt(7), ye = /* @__PURE__ */ BigInt(8), be = /* @__PURE__ */ BigInt(9), xe = /* @__PURE__ */ BigInt(16);
function I(e, t) {
	let n = e % t;
	return n >= N ? n : t + n;
}
function L(e, t, n) {
	let r = e;
	for (; t-- > N;) r *= r, r %= n;
	return r;
}
function Se(e, t) {
	if (e === N) throw Error("invert: expected non-zero number");
	if (t <= N) throw Error("invert: expected positive modulus, got " + t);
	let n = I(e, t), r = t, i = N, a = P, o = P, s = N;
	for (; n !== N;) {
		let e = r / n, t = r % n, c = i - o * e, l = a - s * e;
		r = n, n = t, i = o, a = s, o = c, s = l;
	}
	if (r !== P) throw Error("invert: does not exist");
	return I(i, t);
}
function Ce(e, t, n) {
	if (!e.eql(e.sqr(t), n)) throw Error("Cannot find square root");
}
function we(e, t) {
	let n = (e.ORDER + P) / ge, r = e.pow(t, n);
	return Ce(e, r, t), r;
}
function Te(e, t) {
	let n = (e.ORDER - _e) / ye, r = e.mul(t, F), i = e.pow(r, n), a = e.mul(t, i), o = e.mul(e.mul(a, F), i), s = e.mul(a, e.sub(o, e.ONE));
	return Ce(e, s, t), s;
}
function Ee(e) {
	let t = Ie(e), n = De(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + ve) / xe;
	return (e, t) => {
		let n = e.pow(t, o), s = e.mul(n, r), c = e.mul(n, i), l = e.mul(n, a), u = e.eql(e.sqr(s), t), d = e.eql(e.sqr(c), t);
		n = e.cmov(n, s, u), s = e.cmov(l, c, d);
		let f = e.eql(e.sqr(s), t), p = e.cmov(n, s, f);
		return Ce(e, p, t), p;
	};
}
function De(e) {
	if (e < he) throw Error("sqrt is not defined for small field");
	let t = e - P, n = 0;
	for (; t % F === N;) t /= F, n++;
	let r = F, i = Ie(e);
	for (; Ne(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return we;
	let a = i.pow(r, t), o = (t + P) / F;
	return function(e, r) {
		if (e.is0(r)) return r;
		if (Ne(e, r) !== 1) throw Error("Cannot find square root");
		let i = n, s = e.mul(e.ONE, a), c = e.pow(r, t), l = e.pow(r, o);
		for (; !e.eql(c, e.ONE);) {
			if (e.is0(c)) return e.ZERO;
			let t = 1, n = e.sqr(c);
			for (; !e.eql(n, e.ONE);) if (t++, n = e.sqr(n), t === i) throw Error("Cannot find square root");
			let r = P << BigInt(i - t - 1), a = e.pow(s, r);
			i = t, s = e.sqr(a), c = e.mul(c, s), l = e.mul(l, a);
		}
		return l;
	};
}
function Oe(e) {
	return e % ge === he ? we : e % ye === _e ? Te : e % xe === be ? Ee(e) : De(e);
}
var ke = [
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
function Ae(e) {
	return pe(e, ke.reduce((e, t) => (e[t] = "function", e), {
		ORDER: "bigint",
		BYTES: "number",
		BITS: "number"
	})), e;
}
function je(e, t, n) {
	if (n < N) throw Error("invalid exponent, negatives unsupported");
	if (n === N) return e.ONE;
	if (n === P) return t;
	let r = e.ONE, i = t;
	for (; n > N;) n & P && (r = e.mul(r, i)), i = e.sqr(i), n >>= P;
	return r;
}
function Me(e, t, n = !1) {
	let r = Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((t, n, i) => e.is0(n) ? t : (r[i] = t, e.mul(t, n)), e.ONE), a = e.inv(i);
	return t.reduceRight((t, n, i) => e.is0(n) ? t : (r[i] = e.mul(t, r[i]), e.mul(t, n)), a), r;
}
function Ne(e, t) {
	let n = (e.ORDER - P) / F, r = e.pow(t, n), i = e.eql(r, e.ONE), a = e.eql(r, e.ZERO), o = e.eql(r, e.neg(e.ONE));
	if (!i && !a && !o) throw Error("invalid Legendre symbol result");
	return i ? 1 : a ? 0 : -1;
}
function Pe(e, n) {
	n !== void 0 && t(n);
	let r = n === void 0 ? e.toString(2).length : n;
	return {
		nBitLength: r,
		nByteLength: Math.ceil(r / 8)
	};
}
var Fe = class {
	ORDER;
	BITS;
	BYTES;
	isLE;
	ZERO = N;
	ONE = P;
	_lengths;
	_sqrt;
	_mod;
	constructor(e, t = {}) {
		if (e <= N) throw Error("invalid field: expected ORDER > 0, got " + e);
		let n;
		this.isLE = !1, typeof t == "object" && t && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && (this.sqrt = t.sqrt), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = t.allowedLengths?.slice()), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
		let { nBitLength: r, nByteLength: i } = Pe(e, n);
		if (i > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = e, this.BITS = r, this.BYTES = i, this._sqrt = void 0, Object.preventExtensions(this);
	}
	create(e) {
		return I(e, this.ORDER);
	}
	isValid(e) {
		if (typeof e != "bigint") throw Error("invalid field element: expected bigint, got " + typeof e);
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
		return je(this, e, t);
	}
	div(e, t) {
		return I(e * Se(t, this.ORDER), this.ORDER);
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
		return Se(e, this.ORDER);
	}
	sqrt(e) {
		return this._sqrt ||= Oe(this.ORDER), this._sqrt(this, e);
	}
	toBytes(e) {
		return this.isLE ? ie(e, this.BYTES) : re(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		n(e);
		let { _lengths: r, BYTES: i, isLE: a, ORDER: o, _mod: s } = this;
		if (r) {
			if (!r.includes(e.length) || e.length > i) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
			let t = new Uint8Array(i);
			t.set(e, a ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== i) throw Error("Field.fromBytes: expected " + i + " bytes, got " + e.length);
		let c = a ? ne(e) : M(e);
		if (s && (c = I(c, o)), !t && !this.isValid(c)) throw Error("invalid field element: outside of range 0..ORDER");
		return c;
	}
	invertBatch(e) {
		return Me(this, e);
	}
	cmov(e, t, n) {
		return n ? t : e;
	}
};
function Ie(e, t = {}) {
	return new Fe(e, t);
}
function Le(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	let t = e.toString(2).length;
	return Math.ceil(t / 8);
}
function Re(e) {
	let t = Le(e);
	return t + Math.ceil(t / 2);
}
function ze(e, t, r = !1) {
	n(e);
	let i = e.length, a = Le(t), o = Re(t);
	if (i < 16 || i < o || i > 1024) throw Error("expected " + o + "-1024 bytes of input, got " + i);
	let s = I(r ? ne(e) : M(e), t - P) + P;
	return r ? ie(s, a) : re(s, a);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/curve.js
var R = /* @__PURE__ */ BigInt(0), z = /* @__PURE__ */ BigInt(1);
function B(e, t) {
	let n = t.negate();
	return e ? n : t;
}
function Be(e, t) {
	let n = Me(e.Fp, t.map((e) => e.Z));
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
		mask: de(e),
		maxNumber: i,
		shiftBy: BigInt(e)
	};
}
function Ue(e, t, n) {
	let { windowSize: r, mask: i, maxNumber: a, shiftBy: o } = n, s = Number(e & i), c = e >> o;
	s > r && (s -= a, c += z);
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
	if (e !== R) throw Error("invalid wNAF");
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
		for (; t > R;) t & z && (n = n.add(r)), r = r.double(), t >>= z;
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
			n = o, c ? i = i.add(B(u, t[d])) : r = r.add(B(l, t[s]));
		}
		return qe(n), {
			p: r,
			f: i
		};
	}
	wNAFUnsafe(e, t, n, r = this.ZERO) {
		let i = He(e, this.bits);
		for (let e = 0; e < i.windows && n !== R; e++) {
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
	for (; n > R || r > R;) n & z && (a = a.add(i)), r & z && (o = o.add(i)), i = i.double(), n >>= z, r >>= z;
	return {
		p1: a,
		p2: o
	};
}
function Xe(e, t, n) {
	if (t) {
		if (t.ORDER !== e) throw Error("Field.ORDER must match order: Fp == p, Fn == n");
		return Ae(t), t;
	}
	return Ie(e, { isLE: n });
}
function Ze(e, t, n = {}, r) {
	if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw Error(`expected valid ${e} CURVE object`);
	for (let e of [
		"p",
		"n",
		"h"
	]) {
		let n = t[e];
		if (!(typeof n == "bigint" && n > R)) throw Error(`CURVE.${e} must be positive bigint`);
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
		if (r(e), n(t, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function") throw Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let i = this.blockLen, a = new Uint8Array(i);
		a.set(t.length > i ? e.create().update(t).digest() : t);
		for (let e = 0; e < a.length; e++) a[e] ^= 54;
		this.iHash.update(a), this.oHash = e.create();
		for (let e = 0; e < a.length; e++) a[e] ^= 106;
		this.oHash.update(a), o(a);
	}
	update(e) {
		return i(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		i(this), n(e, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
var tt = (e, t) => (e + (e >= 0 ? t : -t) / at) / t;
function nt(e, t, n) {
	let [[r, i], [a, o]] = t, s = tt(o * e, n), c = tt(-i * e, n), l = e - s * r - c * a, u = -s * i - c * o, d = l < H, f = u < H;
	d && (l = -l), f && (u = -u);
	let p = de(Math.ceil(ue(n) / 2)) + U;
	if (l < H || l >= p || u < H || u >= p) throw Error("splitScalar (endomorphism): failed, k=" + e);
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
	return k(n.lowS, "lowS"), k(n.prehash, "prehash"), n.format !== void 0 && rt(n.format), n;
}
var V = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = V;
			if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = j(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? j(i.length / 2 | 128) : "";
			return j(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = V, r = 0;
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
			let { Err: t } = V;
			if (e < H) throw new t("integer: negative integers are not allowed");
			let n = j(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = V;
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return M(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: r, _tlv: i } = V, a = n(e, void 0, "signature"), { v: o, l: s } = i.decode(48, a);
		if (s.length) throw new t("invalid signature: left bytes after parsing");
		let { v: c, l } = i.decode(2, o), { v: u, l: d } = i.decode(2, l);
		if (d.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: r.decode(c),
			s: r.decode(u)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = V, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
}, H = BigInt(0), U = BigInt(1), at = BigInt(2), W = BigInt(3), ot = BigInt(4);
function st(e, t = {}) {
	let r = Ze("weierstrass", e, t), { Fp: i, Fn: a } = r, o = r.CURVE, { h: s, n: c } = o;
	pe(t, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object"
	});
	let { endo: l } = t;
	if (l && (!i.is0(o.a) || typeof l.beta != "bigint" || !Array.isArray(l.basises))) throw Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	let u = lt(i, a);
	function f() {
		if (!i.isOdd) throw Error("compression is not supported: Field does not have .isOdd()");
	}
	function p(e, t, n) {
		let { x: r, y: a } = t.toAffine(), o = i.toBytes(r);
		return k(n, "isCompressed"), n ? (f(), h(ct(!i.isOdd(a)), o)) : h(Uint8Array.of(4), o, i.toBytes(a));
	}
	function g(e) {
		n(e, void 0, "Point");
		let { publicKey: t, publicKeyUncompressed: r } = u, a = e.length, o = e[0], s = e.subarray(1);
		if (a === t && (o === 2 || o === 3)) {
			let e = i.fromBytes(s);
			if (!i.isValid(e)) throw Error("bad point: is not on curve, wrong x");
			let t = y(e), n;
			try {
				n = i.sqrt(t);
			} catch (e) {
				let t = e instanceof Error ? ": " + e.message : "";
				throw Error("bad point: is not on curve, sqrt error" + t);
			}
			f();
			let r = i.isOdd(n);
			return (o & 1) == 1 !== r && (n = i.neg(n)), {
				x: e,
				y: n
			};
		}
		if (a === r && o === 4) {
			let e = i.BYTES, t = i.fromBytes(s.subarray(0, e)), n = i.fromBytes(s.subarray(e, e * 2));
			if (!b(t, n)) throw Error("bad point: is not on curve");
			return {
				x: t,
				y: n
			};
		}
		throw Error(`bad point: got length ${a}, expected compressed=${t} or uncompressed=${r}`);
	}
	let _ = t.toBytes || p, v = t.fromBytes || g;
	function y(e) {
		let t = i.sqr(e), n = i.mul(t, e);
		return i.add(i.add(n, i.mul(e, o.a)), o.b);
	}
	function b(e, t) {
		let n = i.sqr(t), r = y(e);
		return i.eql(n, r);
	}
	if (!b(o.Gx, o.Gy)) throw Error("bad curve params: generator point");
	let x = i.mul(i.pow(o.a, W), ot), S = i.mul(i.sqr(o.b), BigInt(27));
	if (i.is0(i.add(x, S))) throw Error("bad curve params: a or b");
	function C(e, t, n = !1) {
		if (!i.isValid(t) || n && i.is0(t)) throw Error(`bad point coordinate ${e}`);
		return t;
	}
	function w(e) {
		if (!(e instanceof O)) throw Error("Weierstrass Point expected");
	}
	function T(e) {
		if (!l || !l.basises) throw Error("no endo");
		return nt(e, l.basises, a.ORDER);
	}
	let ee = me((e, t) => {
		let { X: n, Y: r, Z: a } = e;
		if (i.eql(a, i.ONE)) return {
			x: n,
			y: r
		};
		let o = e.is0();
		t ??= o ? i.ONE : i.inv(a);
		let s = i.mul(n, t), c = i.mul(r, t), l = i.mul(a, t);
		if (o) return {
			x: i.ZERO,
			y: i.ZERO
		};
		if (!i.eql(l, i.ONE)) throw Error("invZ was invalid");
		return {
			x: s,
			y: c
		};
	}), E = me((e) => {
		if (e.is0()) {
			if (t.allowInfinityPoint && !i.is0(e.Y)) return;
			throw Error("bad point: ZERO");
		}
		let { x: n, y: r } = e.toAffine();
		if (!i.isValid(n) || !i.isValid(r)) throw Error("bad point: x or y not field elements");
		if (!b(n, r)) throw Error("bad point: equation left != right");
		if (!e.isTorsionFree()) throw Error("bad point: not in prime-order subgroup");
		return !0;
	});
	function D(e, t, n, r, a) {
		return n = new O(i.mul(n.X, e), n.Y, n.Z), t = B(r, t), n = B(a, n), t.add(n);
	}
	class O {
		static BASE = new O(o.Gx, o.Gy, i.ONE);
		static ZERO = new O(i.ZERO, i.ONE, i.ZERO);
		static Fp = i;
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
			if (!e || !i.isValid(t) || !i.isValid(n)) throw Error("invalid affine point");
			if (e instanceof O) throw Error("projective point not allowed");
			return i.is0(t) && i.is0(n) ? O.ZERO : new O(t, n, i.ONE);
		}
		static fromBytes(e) {
			let t = O.fromAffine(v(n(e, void 0, "point")));
			return t.assertValidity(), t;
		}
		static fromHex(e) {
			return O.fromBytes(m(e));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(e = 8, t = !0) {
			return j.createCache(this, e), t || this.multiply(W), this;
		}
		assertValidity() {
			E(this);
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (!i.isOdd) throw Error("Field doesn't support isOdd");
			return !i.isOdd(e);
		}
		equals(e) {
			w(e);
			let { X: t, Y: n, Z: r } = this, { X: a, Y: o, Z: s } = e, c = i.eql(i.mul(t, s), i.mul(a, r)), l = i.eql(i.mul(n, s), i.mul(o, r));
			return c && l;
		}
		negate() {
			return new O(this.X, i.neg(this.Y), this.Z);
		}
		double() {
			let { a: e, b: t } = o, n = i.mul(t, W), { X: r, Y: a, Z: s } = this, c = i.ZERO, l = i.ZERO, u = i.ZERO, d = i.mul(r, r), f = i.mul(a, a), p = i.mul(s, s), m = i.mul(r, a);
			return m = i.add(m, m), u = i.mul(r, s), u = i.add(u, u), c = i.mul(e, u), l = i.mul(n, p), l = i.add(c, l), c = i.sub(f, l), l = i.add(f, l), l = i.mul(c, l), c = i.mul(m, c), u = i.mul(n, u), p = i.mul(e, p), m = i.sub(d, p), m = i.mul(e, m), m = i.add(m, u), u = i.add(d, d), d = i.add(u, d), d = i.add(d, p), d = i.mul(d, m), l = i.add(l, d), p = i.mul(a, s), p = i.add(p, p), d = i.mul(p, m), c = i.sub(c, d), u = i.mul(p, f), u = i.add(u, u), u = i.add(u, u), new O(c, l, u);
		}
		add(e) {
			w(e);
			let { X: t, Y: n, Z: r } = this, { X: a, Y: s, Z: c } = e, l = i.ZERO, u = i.ZERO, d = i.ZERO, f = o.a, p = i.mul(o.b, W), m = i.mul(t, a), h = i.mul(n, s), g = i.mul(r, c), _ = i.add(t, n), v = i.add(a, s);
			_ = i.mul(_, v), v = i.add(m, h), _ = i.sub(_, v), v = i.add(t, r);
			let y = i.add(a, c);
			return v = i.mul(v, y), y = i.add(m, g), v = i.sub(v, y), y = i.add(n, r), l = i.add(s, c), y = i.mul(y, l), l = i.add(h, g), y = i.sub(y, l), d = i.mul(f, v), l = i.mul(p, g), d = i.add(l, d), l = i.sub(h, d), d = i.add(h, d), u = i.mul(l, d), h = i.add(m, m), h = i.add(h, m), g = i.mul(f, g), v = i.mul(p, v), h = i.add(h, g), g = i.sub(m, g), g = i.mul(f, g), v = i.add(v, g), m = i.mul(h, v), u = i.add(u, m), m = i.mul(y, v), l = i.mul(_, l), l = i.sub(l, m), m = i.mul(_, h), d = i.mul(y, d), d = i.add(d, m), new O(l, u, d);
		}
		subtract(e) {
			return this.add(e.negate());
		}
		is0() {
			return this.equals(O.ZERO);
		}
		multiply(e) {
			let { endo: n } = t;
			if (!a.isValidNot0(e)) throw Error("invalid scalar: out of range");
			let r, i, o = (e) => j.cached(this, e, (e) => Be(O, e));
			if (n) {
				let { k1neg: t, k1: a, k2neg: s, k2: c } = T(e), { p: l, f: u } = o(a), { p: d, f } = o(c);
				i = u.add(f), r = D(n.beta, l, d, t, s);
			} else {
				let { p: t, f: n } = o(e);
				r = t, i = n;
			}
			return Be(O, [r, i])[0];
		}
		multiplyUnsafe(e) {
			let { endo: n } = t, r = this;
			if (!a.isValid(e)) throw Error("invalid scalar: out of range");
			if (e === H || r.is0()) return O.ZERO;
			if (e === U) return r;
			if (j.hasCache(this)) return this.multiply(e);
			if (n) {
				let { k1neg: t, k1: i, k2neg: a, k2: o } = T(e), { p1: s, p2: c } = Ye(O, r, i, o);
				return D(n.beta, s, c, t, a);
			}
			return j.unsafe(r, e);
		}
		toAffine(e) {
			return ee(this, e);
		}
		isTorsionFree() {
			let { isTorsionFree: e } = t;
			return s === U ? !0 : e ? e(O, this) : j.unsafe(this, c).is0();
		}
		clearCofactor() {
			let { clearCofactor: e } = t;
			return s === U ? this : e ? e(O, this) : this.multiplyUnsafe(s);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(s).is0();
		}
		toBytes(e = !0) {
			return k(e, "isCompressed"), this.assertValidity(), _(O, this, e);
		}
		toHex(e = !0) {
			return d(this.toBytes(e));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	let A = a.BITS, j = new Je(O, t.endo ? Math.ceil(A / 2) : A);
	return O.BASE.precompute(8), O;
}
function ct(e) {
	return Uint8Array.of(e ? 2 : 3);
}
function lt(e, t) {
	return {
		secretKey: t.BYTES,
		publicKey: 1 + e.BYTES,
		publicKeyUncompressed: 1 + 2 * e.BYTES,
		publicKeyHasPrefix: !0,
		signature: 2 * t.BYTES
	};
}
function ut(t, r = {}) {
	let { Fn: i } = t, a = r.randomBytes || _, o = Object.assign(lt(t.Fp, i), { seed: Re(i.ORDER) });
	function s(e) {
		try {
			let t = i.fromBytes(e);
			return i.isValidNot0(t);
		} catch {
			return !1;
		}
	}
	function c(e, n) {
		let { publicKey: r, publicKeyUncompressed: i } = o;
		try {
			let a = e.length;
			return n === !0 && a !== r || n === !1 && a !== i ? !1 : !!t.fromBytes(e);
		} catch {
			return !1;
		}
	}
	function l(e = a(o.seed)) {
		return ze(n(e, o.seed, "seed"), i.ORDER);
	}
	function u(e, n = !0) {
		return t.BASE.multiply(i.fromBytes(e)).toBytes(n);
	}
	function d(t) {
		let { secretKey: r, publicKey: a, publicKeyUncompressed: s } = o;
		if (!e(t) || "_lengths" in i && i._lengths || r === a) return;
		let c = n(t, void 0, "key").length;
		return c === a || c === s;
	}
	function f(e, n, r = !0) {
		if (d(e) === !0) throw Error("first arg must be private key");
		if (d(n) === !1) throw Error("second arg must be public key");
		let a = i.fromBytes(e);
		return t.fromBytes(n).multiply(a).toBytes(r);
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
		Point: t,
		utils: p,
		lengths: o
	});
}
function dt(t, i, a = {}) {
	r(i), pe(a, {}, {
		hmac: "function",
		lowS: "boolean",
		randomBytes: "function",
		bits2int: "function",
		bits2int_modN: "function"
	}), a = Object.assign({}, a);
	let o = a.randomBytes || _, s = a.hmac || ((e, t) => et(i, e, t)), { Fp: c, Fn: l } = t, { ORDER: u, BITS: f } = l, { keygen: p, getPublicKey: g, getSharedSecret: v, utils: y, lengths: b } = ut(t, a), x = {
		prehash: !0,
		lowS: typeof a.lowS != "boolean" || a.lowS,
		format: "compact",
		extraEntropy: !1
	}, S = u * at < c.ORDER;
	function C(e) {
		return e > u >> U;
	}
	function w(e, t) {
		if (!l.isValidNot0(t)) throw Error(`invalid signature ${e}: out of range 1..Point.Fn.ORDER`);
		return t;
	}
	function T() {
		if (S) throw Error("\"recovered\" sig type is not supported for cofactor >2 curves");
	}
	function ee(e, t) {
		rt(t);
		let r = b.signature;
		return n(e, t === "compact" ? r : t === "recovered" ? r + 1 : void 0);
	}
	class E {
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
			ee(e, t);
			let r;
			if (t === "der") {
				let { r: t, s: r } = V.toSig(n(e));
				return new E(t, r);
			}
			t === "recovered" && (r = e[0], t = "compact", e = e.subarray(1));
			let i = b.signature / 2, a = e.subarray(0, i), o = e.subarray(i, i * 2);
			return new E(l.fromBytes(a), l.fromBytes(o), r);
		}
		static fromHex(e, t) {
			return this.fromBytes(m(e), t);
		}
		assertRecovery() {
			let { recovery: e } = this;
			if (e == null) throw Error("invalid recovery id: must be present");
			return e;
		}
		addRecoveryBit(e) {
			return new E(this.r, this.s, e);
		}
		recoverPublicKey(e) {
			let { r, s: i } = this, a = this.assertRecovery(), o = a === 2 || a === 3 ? r + u : r;
			if (!c.isValid(o)) throw Error("invalid recovery id: sig.r+curve.n != R.x");
			let s = c.toBytes(o), d = t.fromBytes(h(ct(!(a & 1)), s)), f = l.inv(o), p = O(n(e, void 0, "msgHash")), m = l.create(-p * f), g = l.create(i * f), _ = t.BASE.multiplyUnsafe(m).add(d.multiplyUnsafe(g));
			if (_.is0()) throw Error("invalid recovery: point at infinify");
			return _.assertValidity(), _;
		}
		hasHighS() {
			return C(this.s);
		}
		toBytes(e = x.format) {
			if (rt(e), e === "der") return m(V.hexFromSig(this));
			let { r: t, s: n } = this, r = l.toBytes(t), i = l.toBytes(n);
			return e === "recovered" ? (T(), h(Uint8Array.of(this.assertRecovery()), r, i)) : h(r, i);
		}
		toHex(e) {
			return d(this.toBytes(e));
		}
	}
	let D = a.bits2int || function(e) {
		if (e.length > 8192) throw Error("input is too large");
		let t = M(e), n = e.length * 8 - f;
		return n > 0 ? t >> BigInt(n) : t;
	}, O = a.bits2int_modN || function(e) {
		return l.create(D(e));
	}, k = de(f);
	function A(e) {
		return le("num < 2^" + f, e, H, k), l.toBytes(e);
	}
	function j(e, t) {
		return n(e, void 0, "message"), t ? n(i(e), void 0, "prehashed message") : e;
	}
	function te(e, r, i) {
		let { lowS: a, prehash: s, extraEntropy: c } = it(i, x);
		e = j(e, s);
		let u = O(e), d = l.fromBytes(r);
		if (!l.isValidNot0(d)) throw Error("invalid private key");
		let f = [A(d), A(u)];
		if (c != null && c !== !1) {
			let e = c === !0 ? o(b.secretKey) : c;
			f.push(n(e, void 0, "extraEntropy"));
		}
		let p = h(...f), m = u;
		function g(e) {
			let n = D(e);
			if (!l.isValidNot0(n)) return;
			let r = l.inv(n), i = t.BASE.multiply(n).toAffine(), o = l.create(i.x);
			if (o === H) return;
			let s = l.create(r * l.create(m + o * d));
			if (s === H) return;
			let c = (i.x === o ? 0 : 2) | Number(i.y & U), u = s;
			return a && C(s) && (u = l.neg(s), c ^= 1), new E(o, u, S ? void 0 : c);
		}
		return {
			seed: p,
			k2sig: g
		};
	}
	function ne(e, t, n = {}) {
		let { seed: r, k2sig: a } = te(e, t, n);
		return fe(i.outputLen, l.BYTES, s)(r, a).toBytes(n.format);
	}
	function re(r, i, a, o = {}) {
		let { lowS: s, prehash: c, format: u } = it(o, x);
		if (a = n(a, void 0, "publicKey"), i = j(i, c), !e(r)) {
			let e = r instanceof E ? ", use sig.toBytes()" : "";
			throw Error("verify expects Uint8Array signature" + e);
		}
		ee(r, u);
		try {
			let e = E.fromBytes(r, u), n = t.fromBytes(a);
			if (s && e.hasHighS()) return !1;
			let { r: o, s: c } = e, d = O(i), f = l.inv(c), p = l.create(d * f), m = l.create(o * f), h = t.BASE.multiplyUnsafe(p).add(n.multiplyUnsafe(m));
			return !h.is0() && l.create(h.x) === o;
		} catch {
			return !1;
		}
	}
	function ie(e, t, n = {}) {
		let { prehash: r } = it(n, x);
		return t = j(t, r), E.fromBytes(e, "recovered").recoverPublicKey(t).toBytes();
	}
	return Object.freeze({
		keygen: p,
		getPublicKey: g,
		getSharedSecret: v,
		utils: y,
		lengths: b,
		Point: t,
		sign: ne,
		verify: re,
		recoverPublicKey: ie,
		Signature: E,
		hash: i
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/secp256k1.js
var G = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, ft = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
}, pt = /* @__PURE__ */ BigInt(0), mt = /* @__PURE__ */ BigInt(2);
function ht(e) {
	let t = G.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = L(L(L(u, n, t) * u % t, n, t) * u % t, mt, t) * l % t, f = L(d, i, t) * d % t, p = L(f, a, t) * f % t, m = L(p, s, t) * p % t, h = L(L(L(L(L(L(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, mt, t);
	if (!gt.eql(gt.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var gt = Ie(G.p, { sqrt: ht }), K = /* @__PURE__ */ st(G, {
	Fp: gt,
	endo: ft
}), _t = /* @__PURE__ */ dt(K, E), vt = {};
function yt(e, ...t) {
	let n = vt[e];
	if (n === void 0) {
		let t = E(oe(e));
		n = h(t, t), vt[e] = n;
	}
	return E(h(n, ...t));
}
var bt = (e) => e.toBytes(!0).slice(1), xt = (e) => e % mt === pt;
function St(e) {
	let { Fn: t, BASE: n } = K, r = t.fromBytes(e), i = n.multiply(r);
	return {
		scalar: xt(i.y) ? r : t.neg(r),
		bytes: bt(i)
	};
}
function Ct(e) {
	let t = gt;
	if (!t.isValidNot0(e)) throw Error("invalid x: Fail if x ≥ p");
	let n = t.create(e * e), r = t.create(n * e + BigInt(7)), i = t.sqrt(r);
	xt(i) || (i = t.neg(i));
	let a = K.fromAffine({
		x: e,
		y: i
	});
	return a.assertValidity(), a;
}
var q = M;
function wt(...e) {
	return K.Fn.create(q(yt("BIP0340/challenge", ...e)));
}
function Tt(e) {
	return St(e).bytes;
}
function Et(e, t, r = _(32)) {
	let { Fn: i } = K, a = n(e, void 0, "message"), { bytes: o, scalar: s } = St(t), c = n(r, 32, "auxRand"), { bytes: l, scalar: u } = St(yt("BIP0340/nonce", i.toBytes(s ^ q(yt("BIP0340/aux", c))), o, a)), d = wt(l, o, a), f = /* @__PURE__ */ new Uint8Array(64);
	if (f.set(l, 0), f.set(i.toBytes(i.create(u + d * s)), 32), !Dt(f, a, o)) throw Error("sign: Invalid signature produced");
	return f;
}
function Dt(e, t, r) {
	let { Fp: i, Fn: a, BASE: o } = K, s = n(e, 64, "signature"), c = n(t, void 0, "message"), l = n(r, 32, "publicKey");
	try {
		let e = Ct(q(l)), t = q(s.subarray(0, 32));
		if (!i.isValidNot0(t)) return !1;
		let n = q(s.subarray(32, 64));
		if (!a.isValidNot0(n)) return !1;
		let r = wt(a.toBytes(t), bt(e), c), u = o.multiplyUnsafe(n).add(e.multiplyUnsafe(a.neg(r))), { x: d, y: f } = u.toAffine();
		return !(u.is0() || !xt(f) || d !== t);
	} catch {
		return !1;
	}
}
var Ot = /* @__PURE__ */ (() => {
	let e = (e = _(48)) => ze(e, G.n);
	return {
		keygen: Qe(e, Tt),
		getPublicKey: Tt,
		sign: Et,
		verify: Dt,
		Point: K,
		utils: {
			randomSecretKey: e,
			taggedHash: yt,
			lift_x: Ct,
			pointToBytes: bt
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
function kt(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function At(e) {
	if (!kt(e)) throw Error("Uint8Array expected");
}
function jt(e, t) {
	return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((e) => typeof e == "string") : t.every((e) => Number.isSafeInteger(e)) : !1;
}
function Mt(e) {
	if (typeof e != "function") throw Error("function expected");
	return !0;
}
function J(e, t) {
	if (typeof t != "string") throw Error(`${e}: string expected`);
	return !0;
}
function Nt(e) {
	if (!Number.isSafeInteger(e)) throw Error(`invalid integer: ${e}`);
}
function Pt(e) {
	if (!Array.isArray(e)) throw Error("array expected");
}
function Ft(e, t) {
	if (!jt(!0, t)) throw Error(`${e}: array of strings expected`);
}
function It(e, t) {
	if (!jt(!1, t)) throw Error(`${e}: array of numbers expected`);
}
function Y(...e) {
	let t = (e) => e, n = (e, t) => (n) => e(t(n));
	return {
		encode: e.map((e) => e.encode).reduceRight(n, t),
		decode: e.map((e) => e.decode).reduce(n, t)
	};
}
function X(e) {
	let t = typeof e == "string" ? e.split("") : e, n = t.length;
	Ft("alphabet", t);
	let r = new Map(t.map((e, t) => [e, t]));
	return {
		encode: (r) => (Pt(r), r.map((r) => {
			if (!Number.isSafeInteger(r) || r < 0 || r >= n) throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);
			return t[r];
		})),
		decode: (t) => (Pt(t), t.map((t) => {
			J("alphabet.decode", t);
			let n = r.get(t);
			if (n === void 0) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
			return n;
		}))
	};
}
function Z(e = "") {
	return J("join", e), {
		encode: (t) => (Ft("join.decode", t), t.join(e)),
		decode: (t) => (J("join.decode", t), t.split(e))
	};
}
function Lt(e, t = "=") {
	return Nt(e), J("padding", t), {
		encode(n) {
			for (Ft("padding.encode", n); n.length * e % 8;) n.push(t);
			return n;
		},
		decode(n) {
			Ft("padding.decode", n);
			let r = n.length;
			if (r * e % 8) throw Error("padding: invalid, string should have whole number of bytes");
			for (; r > 0 && n[r - 1] === t; r--) if ((r - 1) * e % 8 == 0) throw Error("padding: invalid, string has too much padding");
			return n.slice(0, r);
		}
	};
}
function Rt(e) {
	return Mt(e), {
		encode: (e) => e,
		decode: (t) => e(t)
	};
}
var zt = (e, t) => t === 0 ? e : zt(t, e % t), Bt = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - zt(e, t)), Vt = /* @__PURE__ */ (() => {
	let e = [];
	for (let t = 0; t < 40; t++) e.push(2 ** t);
	return e;
})();
function Ht(e, t, n, r) {
	if (Pt(e), t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (/* @__PURE__ */ Bt(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ Bt(t, n)}`);
	let i = 0, a = 0, o = Vt[t], s = Vt[n] - 1, c = [];
	for (let r of e) {
		if (Nt(r), r >= o) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
		if (i = i << t | r, a + t > 32) throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);
		for (a += t; a >= n; a -= n) c.push((i >> a - n & s) >>> 0);
		let e = Vt[a];
		if (e === void 0) throw Error("invalid carry");
		i &= e - 1;
	}
	if (i = i << n - a & s, !r && a >= t) throw Error("Excess padding");
	if (!r && i > 0) throw Error(`Non-zero padding: ${i}`);
	return r && a > 0 && c.push(i >>> 0), c;
}
function Q(e, t = !1) {
	if (Nt(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ Bt(8, e) > 32 || /* @__PURE__ */ Bt(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!kt(n)) throw Error("radix2.encode input should be Uint8Array");
			return Ht(Array.from(n), 8, e, !t);
		},
		decode: (n) => (It("radix2.decode", n), Uint8Array.from(Ht(n, e, 8, t)))
	};
}
function Ut(e) {
	return Mt(e), function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
Y(Q(4), X("0123456789ABCDEF"), Z("")), Y(Q(5), X("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), Lt(5), Z("")), Y(Q(5), X("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), Z("")), Y(Q(5), X("0123456789ABCDEFGHIJKLMNOPQRSTUV"), Lt(5), Z("")), Y(Q(5), X("0123456789ABCDEFGHIJKLMNOPQRSTUV"), Z("")), Y(Q(5), X("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), Z(""), Rt((e) => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var Wt = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", Gt = (e, t) => {
	J("base64", e);
	let n = t ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/, r = t ? "base64url" : "base64";
	if (e.length > 0 && !n.test(e)) throw Error("invalid base64");
	return Uint8Array.fromBase64(e, {
		alphabet: r,
		lastChunkHandling: "strict"
	});
}, Kt = Wt ? {
	encode(e) {
		return At(e), e.toBase64();
	},
	decode(e) {
		return Gt(e, !1);
	}
} : Y(Q(6), X("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), Lt(6), Z(""));
Y(Q(6), X("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), Z("")), Wt || Y(Q(6), X("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), Lt(6), Z("")), Y(Q(6), X("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), Z(""));
var qt = Y(X("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), Z("")), Jt = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function $(e) {
	let t = e >> 25, n = (e & 33554431) << 5;
	for (let e = 0; e < Jt.length; e++) (t >> e & 1) == 1 && (n ^= Jt[e]);
	return n;
}
function Yt(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = $(i) ^ n >> 5;
	}
	i = $(i);
	for (let t = 0; t < r; t++) i = $(i) ^ e.charCodeAt(t) & 31;
	for (let e of t) i = $(i) ^ e;
	for (let e = 0; e < 6; e++) i = $(i);
	return i ^= n, qt.encode(Ht([i % Vt[30]], 30, 5, !1));
}
function Xt(e) {
	let t = e === "bech32" ? 1 : 734539939, n = Q(5), r = n.decode, i = n.encode, a = Ut(r);
	function o(e, n, r = 90) {
		J("bech32.encode prefix", e), kt(n) && (n = Array.from(n)), It("bech32.encode", n);
		let i = e.length;
		if (i === 0) throw TypeError(`Invalid prefix length ${i}`);
		let a = i + 7 + n.length;
		if (r !== !1 && a > r) throw TypeError(`Length ${a} exceeds limit ${r}`);
		let o = e.toLowerCase(), s = Yt(o, n, t);
		return `${o}1${qt.encode(n)}${s}`;
	}
	function s(e, n = 90) {
		J("bech32.decode input", e);
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
	let c = Ut(s);
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
var Zt = Xt("bech32");
Xt("bech32m"), typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function" || Y(Q(4), X("0123456789abcdef"), Z(""), Rt((e) => {
	if (typeof e != "string" || e.length % 2 != 0) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
	return e.toLowerCase();
}));
export { et as a, r as c, o as d, h as f, _t as i, t as l, _ as m, Zt as n, E as o, m as p, Ot as r, n as s, Kt as t, d as u };
