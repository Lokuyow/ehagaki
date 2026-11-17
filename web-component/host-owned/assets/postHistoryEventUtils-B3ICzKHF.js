// D:/ドキュメント/GitHub/ehagaki/src/lib/appStorage.ts
var e, t = /* @__PURE__ */ new Map(), n = {
	get length() {
		return t.size;
	},
	clear() {
		t.clear();
	},
	getItem(e) {
		return t.get(e) ?? null;
	},
	key(e) {
		return [...t.keys()][e] ?? null;
	},
	removeItem(e) {
		t.delete(e);
	},
	setItem(e, n) {
		t.set(e, String(n));
	}
};
function r() {
	if (typeof globalThis < "u") {
		let e = globalThis.localStorage;
		if (e) return e;
	}
	return n;
}
function i() {
	return e ?? r();
}
function a(t) {
	e = t;
}
function o(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += 1) {
		let i = e.key(r);
		i?.startsWith(t) && n.push(i.slice(t.length));
	}
	return n;
}
function s(e, t) {
	return {
		get length() {
			return o(e, t).length;
		},
		clear() {
			let n = o(e, t);
			for (let r of n) e.removeItem(`${t}${r}`);
		},
		getItem(n) {
			return e.getItem(`${t}${n}`);
		},
		key(n) {
			return o(e, t)[n] ?? null;
		},
		removeItem(n) {
			e.removeItem(`${t}${n}`);
		},
		setItem(n, r) {
			e.setItem(`${t}${n}`, String(r));
		}
	};
}
function c(e) {
	return s(e, "ehagaki.web-component.v1:");
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/appRuntimeEnvironment.ts
function l() {
	return { style: {
		setProperty: () => void 0,
		removeProperty: () => "",
		getPropertyValue: () => ""
	} };
}
function u() {
	let e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? l(), r = t?.body ?? n;
	return {
		storage: i(),
		window: e,
		document: t,
		domRoot: t,
		styleTarget: n,
		layoutTarget: r,
		overlayTarget: r,
		themeTarget: n,
		layoutMode: "viewport",
		runtimeKind: "standalone",
		appHomeHref: "./",
		assetBase: e?.location?.href ? new URL(".", e.location.href) : void 0,
		serviceWorkerEnabled: !0,
		externalInputEnabled: !0,
		historyEnabled: !0,
		localNsecAuthEnabled: !0,
		autoLoginNip07Enabled: !1
	};
}
var d = u();
function f(e) {
	return d = {
		...d,
		...e
	}, a(d.storage), d;
}
function p() {
	return d;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/utils.js
function m(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function h(e, t = "") {
	if (!Number.isSafeInteger(e) || e < 0) {
		let n = t && `"${t}" `;
		throw Error(`${n}expected integer >= 0, got ${e}`);
	}
}
function g(e, t, n = "") {
	let r = m(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function _(e) {
	if (typeof e != "function" || typeof e.create != "function") throw Error("Hash must wrapped by utils.createHasher");
	h(e.outputLen), h(e.blockLen);
}
function v(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function y(e, t) {
	g(e, void 0, "digestInto() output");
	let n = t.outputLen;
	if (e.length < n) throw Error("\"digestInto() output\" expected to be of length >=" + n);
}
function b(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function x(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function S(e, t) {
	return e << 32 - t | e >>> t;
}
var C = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", w = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function T(e) {
	if (g(e), C) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += w[e[n]];
	return t;
}
var E = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function D(e) {
	if (e >= E._0 && e <= E._9) return e - E._0;
	if (e >= E.A && e <= E.F) return e - (E.A - 10);
	if (e >= E.a && e <= E.f) return e - (E.a - 10);
}
function O(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	if (C) return Uint8Array.fromHex(e);
	let t = e.length, n = t / 2;
	if (t % 2) throw Error("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = D(e.charCodeAt(i)), a = D(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw Error("hex string expected, got non-hex character \"" + t + "\" at index " + i);
		}
		r[t] = n * 16 + a;
	}
	return r;
}
function k(...e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		g(r), t += r.length;
	}
	let n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t++) {
		let i = e[t];
		n.set(i, r), r += i.length;
	}
	return n;
}
function A(e, t = {}) {
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
function j(e = 32) {
	let t = typeof globalThis == "object" ? globalThis.crypto : null;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined");
	return t.getRandomValues(new Uint8Array(e));
}
var M = (e) => ({ oid: Uint8Array.from([
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
function N(e, t, n) {
	return e & t ^ ~e & n;
}
function P(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var F = class {
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
		this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = x(this.buffer);
	}
	update(e) {
		v(this), g(e);
		let { view: t, buffer: n, blockLen: r } = this, i = e.length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o === r) {
				let t = x(e);
				for (; r <= i - a; a += r) this.process(t, a);
			} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		v(this), y(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, b(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let o = x(e), s = this.outputLen;
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
}, I = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), L = /* @__PURE__ */ Uint32Array.from([
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
]), R = /* @__PURE__ */ new Uint32Array(64), ee = class extends F {
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
		for (let n = 0; n < 16; n++, t += 4) R[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = R[e - 15], n = R[e - 2], r = S(t, 7) ^ S(t, 18) ^ t >>> 3, i = S(n, 17) ^ S(n, 19) ^ n >>> 10;
			R[e] = i + R[e - 7] + r + R[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = S(o, 6) ^ S(o, 11) ^ S(o, 25), u = l + t + N(o, s, c) + L[e] + R[e] | 0, d = (S(n, 2) ^ S(n, 13) ^ S(n, 22)) + P(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		b(R);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), b(this.buffer);
	}
}, te = class extends ee {
	A = I[0] | 0;
	B = I[1] | 0;
	C = I[2] | 0;
	D = I[3] | 0;
	E = I[4] | 0;
	F = I[5] | 0;
	G = I[6] | 0;
	H = I[7] | 0;
	constructor() {
		super(32);
	}
}, z = /* @__PURE__ */ A(() => new te(), /* @__PURE__ */ M(1)), ne = /* @__PURE__ */ BigInt(0), re = /* @__PURE__ */ BigInt(1);
function ie(e, t = "") {
	if (typeof e != "boolean") {
		let n = t && `"${t}" `;
		throw Error(n + "expected boolean, got type=" + typeof e);
	}
	return e;
}
function ae(e) {
	if (typeof e == "bigint") {
		if (!me(e)) throw Error("positive bigint expected, got " + e);
	} else h(e);
	return e;
}
function oe(e) {
	let t = ae(e).toString(16);
	return t.length & 1 ? "0" + t : t;
}
function se(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	return e === "" ? ne : BigInt("0x" + e);
}
function ce(e) {
	return se(T(e));
}
function le(e) {
	return se(T(fe(g(e)).reverse()));
}
function ue(e, t) {
	h(t), e = ae(e);
	let n = O(e.toString(16).padStart(t * 2, "0"));
	if (n.length !== t) throw Error("number too large");
	return n;
}
function de(e, t) {
	return ue(e, t).reverse();
}
function fe(e) {
	return Uint8Array.from(e);
}
function pe(e) {
	return Uint8Array.from(e, (t, n) => {
		let r = t.charCodeAt(0);
		if (t.length !== 1 || r > 127) throw Error(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
		return r;
	});
}
var me = (e) => typeof e == "bigint" && ne <= e;
function he(e, t, n) {
	return me(e) && me(t) && me(n) && t <= e && e < n;
}
function ge(e, t, n, r) {
	if (!he(t, n, r)) throw Error("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function _e(e) {
	let t = 0;
	for (; e > ne; e >>= re, t += 1);
	return t;
}
var ve = (e) => (re << BigInt(e)) - re;
function ye(e, t, n) {
	if (h(e, "hashLen"), h(t, "qByteLen"), typeof n != "function") throw Error("hmacFn must be a function");
	let r = (e) => new Uint8Array(e), i = Uint8Array.of(), a = Uint8Array.of(0), o = Uint8Array.of(1), s = r(e), c = r(e), l = 0, u = () => {
		s.fill(1), c.fill(0), l = 0;
	}, d = (...e) => n(c, k(s, ...e)), f = (e = i) => {
		c = d(a, e), s = d(), e.length !== 0 && (c = d(o, e), s = d());
	}, p = () => {
		if (l++ >= 1e3) throw Error("drbg: tried max amount of iterations");
		let e = 0, n = [];
		for (; e < t;) {
			s = d();
			let t = s.slice();
			n.push(t), e += s.length;
		}
		return k(...n);
	};
	return (e, t) => {
		u(), f(e);
		let n;
		for (; !(n = t(p()));) f();
		return u(), n;
	};
}
function be(e, t = {}, n = {}) {
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
function xe(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		let i = t.get(n);
		if (i !== void 0) return i;
		let a = e(n, ...r);
		return t.set(n, a), a;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/modular.js
var B = /* @__PURE__ */ BigInt(0), V = /* @__PURE__ */ BigInt(1), Se = /* @__PURE__ */ BigInt(2), Ce = /* @__PURE__ */ BigInt(3), we = /* @__PURE__ */ BigInt(4), Te = /* @__PURE__ */ BigInt(5), Ee = /* @__PURE__ */ BigInt(7), De = /* @__PURE__ */ BigInt(8), Oe = /* @__PURE__ */ BigInt(9), ke = /* @__PURE__ */ BigInt(16);
function Ae(e, t) {
	let n = e % t;
	return n >= B ? n : t + n;
}
function H(e, t, n) {
	let r = e;
	for (; t-- > B;) r *= r, r %= n;
	return r;
}
function je(e, t) {
	if (e === B) throw Error("invert: expected non-zero number");
	if (t <= B) throw Error("invert: expected positive modulus, got " + t);
	let n = Ae(e, t), r = t, i = B, a = V, o = V, s = B;
	for (; n !== B;) {
		let e = r / n, t = r % n, c = i - o * e, l = a - s * e;
		r = n, n = t, i = o, a = s, o = c, s = l;
	}
	if (r !== V) throw Error("invert: does not exist");
	return Ae(i, t);
}
function Me(e, t, n) {
	if (!e.eql(e.sqr(t), n)) throw Error("Cannot find square root");
}
function Ne(e, t) {
	let n = (e.ORDER + V) / we, r = e.pow(t, n);
	return Me(e, r, t), r;
}
function Pe(e, t) {
	let n = (e.ORDER - Te) / De, r = e.mul(t, Se), i = e.pow(r, n), a = e.mul(t, i), o = e.mul(e.mul(a, Se), i), s = e.mul(a, e.sub(o, e.ONE));
	return Me(e, s, t), s;
}
function Fe(e) {
	let t = Ge(e), n = Ie(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + Ee) / ke;
	return (e, t) => {
		let n = e.pow(t, o), s = e.mul(n, r), c = e.mul(n, i), l = e.mul(n, a), u = e.eql(e.sqr(s), t), d = e.eql(e.sqr(c), t);
		n = e.cmov(n, s, u), s = e.cmov(l, c, d);
		let f = e.eql(e.sqr(s), t), p = e.cmov(n, s, f);
		return Me(e, p, t), p;
	};
}
function Ie(e) {
	if (e < Ce) throw Error("sqrt is not defined for small field");
	let t = e - V, n = 0;
	for (; t % Se === B;) t /= Se, n++;
	let r = Se, i = Ge(e);
	for (; He(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return Ne;
	let a = i.pow(r, t), o = (t + V) / Se;
	return function(e, r) {
		if (e.is0(r)) return r;
		if (He(e, r) !== 1) throw Error("Cannot find square root");
		let i = n, s = e.mul(e.ONE, a), c = e.pow(r, t), l = e.pow(r, o);
		for (; !e.eql(c, e.ONE);) {
			if (e.is0(c)) return e.ZERO;
			let t = 1, n = e.sqr(c);
			for (; !e.eql(n, e.ONE);) if (t++, n = e.sqr(n), t === i) throw Error("Cannot find square root");
			let r = V << BigInt(i - t - 1), a = e.pow(s, r);
			i = t, s = e.sqr(a), c = e.mul(c, s), l = e.mul(l, a);
		}
		return l;
	};
}
function Le(e) {
	return e % we === Ce ? Ne : e % De === Te ? Pe : e % ke === Oe ? Fe(e) : Ie(e);
}
var Re = [
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
function ze(e) {
	return be(e, Re.reduce((e, t) => (e[t] = "function", e), {
		ORDER: "bigint",
		BYTES: "number",
		BITS: "number"
	})), e;
}
function Be(e, t, n) {
	if (n < B) throw Error("invalid exponent, negatives unsupported");
	if (n === B) return e.ONE;
	if (n === V) return t;
	let r = e.ONE, i = t;
	for (; n > B;) n & V && (r = e.mul(r, i)), i = e.sqr(i), n >>= V;
	return r;
}
function Ve(e, t, n = !1) {
	let r = Array(t.length).fill(n ? e.ZERO : void 0), i = t.reduce((t, n, i) => e.is0(n) ? t : (r[i] = t, e.mul(t, n)), e.ONE), a = e.inv(i);
	return t.reduceRight((t, n, i) => e.is0(n) ? t : (r[i] = e.mul(t, r[i]), e.mul(t, n)), a), r;
}
function He(e, t) {
	let n = (e.ORDER - V) / Se, r = e.pow(t, n), i = e.eql(r, e.ONE), a = e.eql(r, e.ZERO), o = e.eql(r, e.neg(e.ONE));
	if (!i && !a && !o) throw Error("invalid Legendre symbol result");
	return i ? 1 : a ? 0 : -1;
}
function Ue(e, t) {
	t !== void 0 && h(t);
	let n = t === void 0 ? e.toString(2).length : t;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
var We = class {
	ORDER;
	BITS;
	BYTES;
	isLE;
	ZERO = B;
	ONE = V;
	_lengths;
	_sqrt;
	_mod;
	constructor(e, t = {}) {
		if (e <= B) throw Error("invalid field: expected ORDER > 0, got " + e);
		let n;
		this.isLE = !1, typeof t == "object" && t && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && (this.sqrt = t.sqrt), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = t.allowedLengths?.slice()), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
		let { nBitLength: r, nByteLength: i } = Ue(e, n);
		if (i > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = e, this.BITS = r, this.BYTES = i, this._sqrt = void 0, Object.preventExtensions(this);
	}
	create(e) {
		return Ae(e, this.ORDER);
	}
	isValid(e) {
		if (typeof e != "bigint") throw Error("invalid field element: expected bigint, got " + typeof e);
		return B <= e && e < this.ORDER;
	}
	is0(e) {
		return e === B;
	}
	isValidNot0(e) {
		return !this.is0(e) && this.isValid(e);
	}
	isOdd(e) {
		return (e & V) === V;
	}
	neg(e) {
		return Ae(-e, this.ORDER);
	}
	eql(e, t) {
		return e === t;
	}
	sqr(e) {
		return Ae(e * e, this.ORDER);
	}
	add(e, t) {
		return Ae(e + t, this.ORDER);
	}
	sub(e, t) {
		return Ae(e - t, this.ORDER);
	}
	mul(e, t) {
		return Ae(e * t, this.ORDER);
	}
	pow(e, t) {
		return Be(this, e, t);
	}
	div(e, t) {
		return Ae(e * je(t, this.ORDER), this.ORDER);
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
		return je(e, this.ORDER);
	}
	sqrt(e) {
		return this._sqrt ||= Le(this.ORDER), this._sqrt(this, e);
	}
	toBytes(e) {
		return this.isLE ? de(e, this.BYTES) : ue(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		g(e);
		let { _lengths: n, BYTES: r, isLE: i, ORDER: a, _mod: o } = this;
		if (n) {
			if (!n.includes(e.length) || e.length > r) throw Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
			let t = new Uint8Array(r);
			t.set(e, i ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== r) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
		let s = i ? le(e) : ce(e);
		if (o && (s = Ae(s, a)), !t && !this.isValid(s)) throw Error("invalid field element: outside of range 0..ORDER");
		return s;
	}
	invertBatch(e) {
		return Ve(this, e);
	}
	cmov(e, t, n) {
		return n ? t : e;
	}
};
function Ge(e, t = {}) {
	return new We(e, t);
}
function Ke(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	let t = e.toString(2).length;
	return Math.ceil(t / 8);
}
function qe(e) {
	let t = Ke(e);
	return t + Math.ceil(t / 2);
}
function Je(e, t, n = !1) {
	g(e);
	let r = e.length, i = Ke(t), a = qe(t);
	if (r < 16 || r < a || r > 1024) throw Error("expected " + a + "-1024 bytes of input, got " + r);
	let o = Ae(n ? le(e) : ce(e), t - V) + V;
	return n ? de(o, i) : ue(o, i);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/curve.js
var Ye = /* @__PURE__ */ BigInt(0), Xe = /* @__PURE__ */ BigInt(1);
function Ze(e, t) {
	let n = t.negate();
	return e ? n : t;
}
function Qe(e, t) {
	let n = Ve(e.Fp, t.map((e) => e.Z));
	return t.map((t, r) => e.fromAffine(t.toAffine(n[r])));
}
function $e(e, t) {
	if (!Number.isSafeInteger(e) || e <= 0 || e > t) throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
}
function et(e, t) {
	$e(e, t);
	let n = Math.ceil(t / e) + 1, r = 2 ** (e - 1), i = 2 ** e;
	return {
		windows: n,
		windowSize: r,
		mask: ve(e),
		maxNumber: i,
		shiftBy: BigInt(e)
	};
}
function tt(e, t, n) {
	let { windowSize: r, mask: i, maxNumber: a, shiftBy: o } = n, s = Number(e & i), c = e >> o;
	s > r && (s -= a, c += Xe);
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
var nt = /* @__PURE__ */ new WeakMap(), rt = /* @__PURE__ */ new WeakMap();
function it(e) {
	return rt.get(e) || 1;
}
function at(e) {
	if (e !== Ye) throw Error("invalid wNAF");
}
var ot = class {
	BASE;
	ZERO;
	Fn;
	bits;
	constructor(e, t) {
		this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = t;
	}
	_unsafeLadder(e, t, n = this.ZERO) {
		let r = e;
		for (; t > Ye;) t & Xe && (n = n.add(r)), r = r.double(), t >>= Xe;
		return n;
	}
	precomputeWindow(e, t) {
		let { windows: n, windowSize: r } = et(t, this.bits), i = [], a = e, o = a;
		for (let e = 0; e < n; e++) {
			o = a, i.push(o);
			for (let e = 1; e < r; e++) o = o.add(a), i.push(o);
			a = o.double();
		}
		return i;
	}
	wNAF(e, t, n) {
		if (!this.Fn.isValid(n)) throw Error("invalid scalar");
		let r = this.ZERO, i = this.BASE, a = et(e, this.bits);
		for (let e = 0; e < a.windows; e++) {
			let { nextN: o, offset: s, isZero: c, isNeg: l, isNegF: u, offsetF: d } = tt(n, e, a);
			n = o, c ? i = i.add(Ze(u, t[d])) : r = r.add(Ze(l, t[s]));
		}
		return at(n), {
			p: r,
			f: i
		};
	}
	wNAFUnsafe(e, t, n, r = this.ZERO) {
		let i = et(e, this.bits);
		for (let e = 0; e < i.windows && n !== Ye; e++) {
			let { nextN: a, offset: o, isZero: s, isNeg: c } = tt(n, e, i);
			if (n = a, !s) {
				let e = t[o];
				r = r.add(c ? e.negate() : e);
			}
		}
		return at(n), r;
	}
	getPrecomputes(e, t, n) {
		let r = nt.get(t);
		return r || (r = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (r = n(r)), nt.set(t, r))), r;
	}
	cached(e, t, n) {
		let r = it(e);
		return this.wNAF(r, this.getPrecomputes(r, e, n), t);
	}
	unsafe(e, t, n, r) {
		let i = it(e);
		return i === 1 ? this._unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
	}
	createCache(e, t) {
		$e(t, this.bits), rt.set(e, t), nt.delete(e);
	}
	hasCache(e) {
		return it(e) !== 1;
	}
};
function st(e, t, n, r) {
	let i = t, a = e.ZERO, o = e.ZERO;
	for (; n > Ye || r > Ye;) n & Xe && (a = a.add(i)), r & Xe && (o = o.add(i)), i = i.double(), n >>= Xe, r >>= Xe;
	return {
		p1: a,
		p2: o
	};
}
function ct(e, t, n) {
	if (t) {
		if (t.ORDER !== e) throw Error("Field.ORDER must match order: Fp == p, Fn == n");
		return ze(t), t;
	}
	return Ge(e, { isLE: n });
}
function lt(e, t, n = {}, r) {
	if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw Error(`expected valid ${e} CURVE object`);
	for (let e of [
		"p",
		"n",
		"h"
	]) {
		let n = t[e];
		if (!(typeof n == "bigint" && n > Ye)) throw Error(`CURVE.${e} must be positive bigint`);
	}
	let i = ct(t.p, n.Fp, r), a = ct(t.n, n.Fn, r), o = [
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
function ut(e, t) {
	return function(n) {
		let r = e(n);
		return {
			secretKey: r,
			publicKey: t(r)
		};
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hmac.js
var dt = class {
	oHash;
	iHash;
	blockLen;
	outputLen;
	finished = !1;
	destroyed = !1;
	constructor(e, t) {
		if (_(e), g(t, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function") throw Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let n = this.blockLen, r = new Uint8Array(n);
		r.set(t.length > n ? e.create().update(t).digest() : t);
		for (let e = 0; e < r.length; e++) r[e] ^= 54;
		this.iHash.update(r), this.oHash = e.create();
		for (let e = 0; e < r.length; e++) r[e] ^= 106;
		this.oHash.update(r), b(r);
	}
	update(e) {
		return v(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		v(this), g(e, this.outputLen, "output"), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
}, ft = (e, t, n) => new dt(e, t).update(n).digest();
ft.create = (e, t) => new dt(e, t);
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/abstract/weierstrass.js
var pt = (e, t) => (e + (e >= 0 ? t : -t) / bt) / t;
function mt(e, t, n) {
	let [[r, i], [a, o]] = t, s = pt(o * e, n), c = pt(-i * e, n), l = e - s * r - c * a, u = -s * i - c * o, d = l < vt, f = u < vt;
	d && (l = -l), f && (u = -u);
	let p = ve(Math.ceil(_e(n) / 2)) + yt;
	if (l < vt || l >= p || u < vt || u >= p) throw Error("splitScalar (endomorphism): failed, k=" + e);
	return {
		k1neg: d,
		k1: l,
		k2neg: f,
		k2: u
	};
}
function ht(e) {
	if (![
		"compact",
		"recovered",
		"der"
	].includes(e)) throw Error("Signature format must be \"compact\", \"recovered\", or \"der\"");
	return e;
}
function gt(e, t) {
	let n = {};
	for (let r of Object.keys(t)) n[r] = e[r] === void 0 ? t[r] : e[r];
	return ie(n.lowS, "lowS"), ie(n.prehash, "prehash"), n.format !== void 0 && ht(n.format), n;
}
var _t = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_tlv: {
		encode: (e, t) => {
			let { Err: n } = _t;
			if (e < 0 || e > 256) throw new n("tlv.encode: wrong tag");
			if (t.length & 1) throw new n("tlv.encode: unpadded data");
			let r = t.length / 2, i = oe(r);
			if (i.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			let a = r > 127 ? oe(i.length / 2 | 128) : "";
			return oe(e) + a + i + t;
		},
		decode(e, t) {
			let { Err: n } = _t, r = 0;
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
			let { Err: t } = _t;
			if (e < vt) throw new t("integer: negative integers are not allowed");
			let n = oe(e);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new t("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(e) {
			let { Err: t } = _t;
			if (e[0] & 128) throw new t("invalid signature integer: negative");
			if (e[0] === 0 && !(e[1] & 128)) throw new t("invalid signature integer: unnecessary leading zero");
			return ce(e);
		}
	},
	toSig(e) {
		let { Err: t, _int: n, _tlv: r } = _t, i = g(e, void 0, "signature"), { v: a, l: o } = r.decode(48, i);
		if (o.length) throw new t("invalid signature: left bytes after parsing");
		let { v: s, l: c } = r.decode(2, a), { v: l, l: u } = r.decode(2, c);
		if (u.length) throw new t("invalid signature: left bytes after parsing");
		return {
			r: n.decode(s),
			s: n.decode(l)
		};
	},
	hexFromSig(e) {
		let { _tlv: t, _int: n } = _t, r = t.encode(2, n.encode(e.r)) + t.encode(2, n.encode(e.s));
		return t.encode(48, r);
	}
}, vt = BigInt(0), yt = BigInt(1), bt = BigInt(2), xt = BigInt(3), St = BigInt(4);
function Ct(e, t = {}) {
	let n = lt("weierstrass", e, t), { Fp: r, Fn: i } = n, a = n.CURVE, { h: o, n: s } = a;
	be(t, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object"
	});
	let { endo: c } = t;
	if (c && (!r.is0(a.a) || typeof c.beta != "bigint" || !Array.isArray(c.basises))) throw Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	let l = Tt(r, i);
	function u() {
		if (!r.isOdd) throw Error("compression is not supported: Field does not have .isOdd()");
	}
	function d(e, t, n) {
		let { x: i, y: a } = t.toAffine(), o = r.toBytes(i);
		return ie(n, "isCompressed"), n ? (u(), k(wt(!r.isOdd(a)), o)) : k(Uint8Array.of(4), o, r.toBytes(a));
	}
	function f(e) {
		g(e, void 0, "Point");
		let { publicKey: t, publicKeyUncompressed: n } = l, i = e.length, a = e[0], o = e.subarray(1);
		if (i === t && (a === 2 || a === 3)) {
			let e = r.fromBytes(o);
			if (!r.isValid(e)) throw Error("bad point: is not on curve, wrong x");
			let t = h(e), n;
			try {
				n = r.sqrt(t);
			} catch (e) {
				let t = e instanceof Error ? ": " + e.message : "";
				throw Error("bad point: is not on curve, sqrt error" + t);
			}
			u();
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
	let p = t.toBytes || d, m = t.fromBytes || f;
	function h(e) {
		let t = r.sqr(e), n = r.mul(t, e);
		return r.add(r.add(n, r.mul(e, a.a)), a.b);
	}
	function _(e, t) {
		let n = r.sqr(t), i = h(e);
		return r.eql(n, i);
	}
	if (!_(a.Gx, a.Gy)) throw Error("bad curve params: generator point");
	let v = r.mul(r.pow(a.a, xt), St), y = r.mul(r.sqr(a.b), BigInt(27));
	if (r.is0(r.add(v, y))) throw Error("bad curve params: a or b");
	function b(e, t, n = !1) {
		if (!r.isValid(t) || n && r.is0(t)) throw Error(`bad point coordinate ${e}`);
		return t;
	}
	function x(e) {
		if (!(e instanceof D)) throw Error("Weierstrass Point expected");
	}
	function S(e) {
		if (!c || !c.basises) throw Error("no endo");
		return mt(e, c.basises, i.ORDER);
	}
	let C = xe((e, t) => {
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
	}), w = xe((e) => {
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
	function E(e, t, n, i, a) {
		return n = new D(r.mul(n.X, e), n.Y, n.Z), t = Ze(i, t), n = Ze(a, n), t.add(n);
	}
	class D {
		static BASE = new D(a.Gx, a.Gy, r.ONE);
		static ZERO = new D(r.ZERO, r.ONE, r.ZERO);
		static Fp = r;
		static Fn = i;
		X;
		Y;
		Z;
		constructor(e, t, n) {
			this.X = b("x", e), this.Y = b("y", t, !0), this.Z = b("z", n), Object.freeze(this);
		}
		static CURVE() {
			return a;
		}
		static fromAffine(e) {
			let { x: t, y: n } = e || {};
			if (!e || !r.isValid(t) || !r.isValid(n)) throw Error("invalid affine point");
			if (e instanceof D) throw Error("projective point not allowed");
			return r.is0(t) && r.is0(n) ? D.ZERO : new D(t, n, r.ONE);
		}
		static fromBytes(e) {
			let t = D.fromAffine(m(g(e, void 0, "point")));
			return t.assertValidity(), t;
		}
		static fromHex(e) {
			return D.fromBytes(O(e));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(e = 8, t = !0) {
			return j.createCache(this, e), t || this.multiply(xt), this;
		}
		assertValidity() {
			w(this);
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (!r.isOdd) throw Error("Field doesn't support isOdd");
			return !r.isOdd(e);
		}
		equals(e) {
			x(e);
			let { X: t, Y: n, Z: i } = this, { X: a, Y: o, Z: s } = e, c = r.eql(r.mul(t, s), r.mul(a, i)), l = r.eql(r.mul(n, s), r.mul(o, i));
			return c && l;
		}
		negate() {
			return new D(this.X, r.neg(this.Y), this.Z);
		}
		double() {
			let { a: e, b: t } = a, n = r.mul(t, xt), { X: i, Y: o, Z: s } = this, c = r.ZERO, l = r.ZERO, u = r.ZERO, d = r.mul(i, i), f = r.mul(o, o), p = r.mul(s, s), m = r.mul(i, o);
			return m = r.add(m, m), u = r.mul(i, s), u = r.add(u, u), c = r.mul(e, u), l = r.mul(n, p), l = r.add(c, l), c = r.sub(f, l), l = r.add(f, l), l = r.mul(c, l), c = r.mul(m, c), u = r.mul(n, u), p = r.mul(e, p), m = r.sub(d, p), m = r.mul(e, m), m = r.add(m, u), u = r.add(d, d), d = r.add(u, d), d = r.add(d, p), d = r.mul(d, m), l = r.add(l, d), p = r.mul(o, s), p = r.add(p, p), d = r.mul(p, m), c = r.sub(c, d), u = r.mul(p, f), u = r.add(u, u), u = r.add(u, u), new D(c, l, u);
		}
		add(e) {
			x(e);
			let { X: t, Y: n, Z: i } = this, { X: o, Y: s, Z: c } = e, l = r.ZERO, u = r.ZERO, d = r.ZERO, f = a.a, p = r.mul(a.b, xt), m = r.mul(t, o), h = r.mul(n, s), g = r.mul(i, c), _ = r.add(t, n), v = r.add(o, s);
			_ = r.mul(_, v), v = r.add(m, h), _ = r.sub(_, v), v = r.add(t, i);
			let y = r.add(o, c);
			return v = r.mul(v, y), y = r.add(m, g), v = r.sub(v, y), y = r.add(n, i), l = r.add(s, c), y = r.mul(y, l), l = r.add(h, g), y = r.sub(y, l), d = r.mul(f, v), l = r.mul(p, g), d = r.add(l, d), l = r.sub(h, d), d = r.add(h, d), u = r.mul(l, d), h = r.add(m, m), h = r.add(h, m), g = r.mul(f, g), v = r.mul(p, v), h = r.add(h, g), g = r.sub(m, g), g = r.mul(f, g), v = r.add(v, g), m = r.mul(h, v), u = r.add(u, m), m = r.mul(y, v), l = r.mul(_, l), l = r.sub(l, m), m = r.mul(_, h), d = r.mul(y, d), d = r.add(d, m), new D(l, u, d);
		}
		subtract(e) {
			return this.add(e.negate());
		}
		is0() {
			return this.equals(D.ZERO);
		}
		multiply(e) {
			let { endo: n } = t;
			if (!i.isValidNot0(e)) throw Error("invalid scalar: out of range");
			let r, a, o = (e) => j.cached(this, e, (e) => Qe(D, e));
			if (n) {
				let { k1neg: t, k1: i, k2neg: s, k2: c } = S(e), { p: l, f: u } = o(i), { p: d, f } = o(c);
				a = u.add(f), r = E(n.beta, l, d, t, s);
			} else {
				let { p: t, f: n } = o(e);
				r = t, a = n;
			}
			return Qe(D, [r, a])[0];
		}
		multiplyUnsafe(e) {
			let { endo: n } = t, r = this;
			if (!i.isValid(e)) throw Error("invalid scalar: out of range");
			if (e === vt || r.is0()) return D.ZERO;
			if (e === yt) return r;
			if (j.hasCache(this)) return this.multiply(e);
			if (n) {
				let { k1neg: t, k1: i, k2neg: a, k2: o } = S(e), { p1: s, p2: c } = st(D, r, i, o);
				return E(n.beta, s, c, t, a);
			}
			return j.unsafe(r, e);
		}
		toAffine(e) {
			return C(this, e);
		}
		isTorsionFree() {
			let { isTorsionFree: e } = t;
			return o === yt ? !0 : e ? e(D, this) : j.unsafe(this, s).is0();
		}
		clearCofactor() {
			let { clearCofactor: e } = t;
			return o === yt ? this : e ? e(D, this) : this.multiplyUnsafe(o);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(o).is0();
		}
		toBytes(e = !0) {
			return ie(e, "isCompressed"), this.assertValidity(), p(D, this, e);
		}
		toHex(e = !0) {
			return T(this.toBytes(e));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	let A = i.BITS, j = new ot(D, t.endo ? Math.ceil(A / 2) : A);
	return D.BASE.precompute(8), D;
}
function wt(e) {
	return Uint8Array.of(e ? 2 : 3);
}
function Tt(e, t) {
	return {
		secretKey: t.BYTES,
		publicKey: 1 + e.BYTES,
		publicKeyUncompressed: 1 + 2 * e.BYTES,
		publicKeyHasPrefix: !0,
		signature: 2 * t.BYTES
	};
}
function Et(e, t = {}) {
	let { Fn: n } = e, r = t.randomBytes || j, i = Object.assign(Tt(e.Fp, n), { seed: qe(n.ORDER) });
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
	function s(e = r(i.seed)) {
		return Je(g(e, i.seed, "seed"), n.ORDER);
	}
	function c(t, r = !0) {
		return e.BASE.multiply(n.fromBytes(t)).toBytes(r);
	}
	function l(e) {
		let { secretKey: t, publicKey: r, publicKeyUncompressed: a } = i;
		if (!m(e) || "_lengths" in n && n._lengths || t === r) return;
		let o = g(e, void 0, "key").length;
		return o === r || o === a;
	}
	function u(t, r, i = !0) {
		if (l(t) === !0) throw Error("first arg must be private key");
		if (l(r) === !1) throw Error("second arg must be public key");
		let a = n.fromBytes(t);
		return e.fromBytes(r).multiply(a).toBytes(i);
	}
	let d = {
		isValidSecretKey: a,
		isValidPublicKey: o,
		randomSecretKey: s
	}, f = ut(s, c);
	return Object.freeze({
		getPublicKey: c,
		getSharedSecret: u,
		keygen: f,
		Point: e,
		utils: d,
		lengths: i
	});
}
function Dt(e, t, n = {}) {
	_(t), be(n, {}, {
		hmac: "function",
		lowS: "boolean",
		randomBytes: "function",
		bits2int: "function",
		bits2int_modN: "function"
	}), n = Object.assign({}, n);
	let r = n.randomBytes || j, i = n.hmac || ((e, n) => ft(t, e, n)), { Fp: a, Fn: o } = e, { ORDER: s, BITS: c } = o, { keygen: l, getPublicKey: u, getSharedSecret: d, utils: f, lengths: p } = Et(e, n), h = {
		prehash: !0,
		lowS: typeof n.lowS != "boolean" || n.lowS,
		format: "compact",
		extraEntropy: !1
	}, v = s * bt < a.ORDER;
	function y(e) {
		return e > s >> yt;
	}
	function b(e, t) {
		if (!o.isValidNot0(t)) throw Error(`invalid signature ${e}: out of range 1..Point.Fn.ORDER`);
		return t;
	}
	function x() {
		if (v) throw Error("\"recovered\" sig type is not supported for cofactor >2 curves");
	}
	function S(e, t) {
		ht(t);
		let n = p.signature;
		return g(e, t === "compact" ? n : t === "recovered" ? n + 1 : void 0);
	}
	class C {
		r;
		s;
		recovery;
		constructor(e, t, n) {
			if (this.r = b("r", e), this.s = b("s", t), n != null) {
				if (x(), ![
					0,
					1,
					2,
					3
				].includes(n)) throw Error("invalid recovery id");
				this.recovery = n;
			}
			Object.freeze(this);
		}
		static fromBytes(e, t = h.format) {
			S(e, t);
			let n;
			if (t === "der") {
				let { r: t, s: n } = _t.toSig(g(e));
				return new C(t, n);
			}
			t === "recovered" && (n = e[0], t = "compact", e = e.subarray(1));
			let r = p.signature / 2, i = e.subarray(0, r), a = e.subarray(r, r * 2);
			return new C(o.fromBytes(i), o.fromBytes(a), n);
		}
		static fromHex(e, t) {
			return this.fromBytes(O(e), t);
		}
		assertRecovery() {
			let { recovery: e } = this;
			if (e == null) throw Error("invalid recovery id: must be present");
			return e;
		}
		addRecoveryBit(e) {
			return new C(this.r, this.s, e);
		}
		recoverPublicKey(t) {
			let { r: n, s: r } = this, i = this.assertRecovery(), c = i === 2 || i === 3 ? n + s : n;
			if (!a.isValid(c)) throw Error("invalid recovery id: sig.r+curve.n != R.x");
			let l = a.toBytes(c), u = e.fromBytes(k(wt(!(i & 1)), l)), d = o.inv(c), f = E(g(t, void 0, "msgHash")), p = o.create(-f * d), m = o.create(r * d), h = e.BASE.multiplyUnsafe(p).add(u.multiplyUnsafe(m));
			if (h.is0()) throw Error("invalid recovery: point at infinify");
			return h.assertValidity(), h;
		}
		hasHighS() {
			return y(this.s);
		}
		toBytes(e = h.format) {
			if (ht(e), e === "der") return O(_t.hexFromSig(this));
			let { r: t, s: n } = this, r = o.toBytes(t), i = o.toBytes(n);
			return e === "recovered" ? (x(), k(Uint8Array.of(this.assertRecovery()), r, i)) : k(r, i);
		}
		toHex(e) {
			return T(this.toBytes(e));
		}
	}
	let w = n.bits2int || function(e) {
		if (e.length > 8192) throw Error("input is too large");
		let t = ce(e), n = e.length * 8 - c;
		return n > 0 ? t >> BigInt(n) : t;
	}, E = n.bits2int_modN || function(e) {
		return o.create(w(e));
	}, D = ve(c);
	function A(e) {
		return ge("num < 2^" + c, e, vt, D), o.toBytes(e);
	}
	function M(e, n) {
		return g(e, void 0, "message"), n ? g(t(e), void 0, "prehashed message") : e;
	}
	function N(t, n, i) {
		let { lowS: a, prehash: s, extraEntropy: c } = gt(i, h);
		t = M(t, s);
		let l = E(t), u = o.fromBytes(n);
		if (!o.isValidNot0(u)) throw Error("invalid private key");
		let d = [A(u), A(l)];
		if (c != null && c !== !1) {
			let e = c === !0 ? r(p.secretKey) : c;
			d.push(g(e, void 0, "extraEntropy"));
		}
		let f = k(...d), m = l;
		function _(t) {
			let n = w(t);
			if (!o.isValidNot0(n)) return;
			let r = o.inv(n), i = e.BASE.multiply(n).toAffine(), s = o.create(i.x);
			if (s === vt) return;
			let c = o.create(r * o.create(m + s * u));
			if (c === vt) return;
			let l = (i.x === s ? 0 : 2) | Number(i.y & yt), d = c;
			return a && y(c) && (d = o.neg(c), l ^= 1), new C(s, d, v ? void 0 : l);
		}
		return {
			seed: f,
			k2sig: _
		};
	}
	function P(e, n, r = {}) {
		let { seed: a, k2sig: s } = N(e, n, r);
		return ye(t.outputLen, o.BYTES, i)(a, s).toBytes(r.format);
	}
	function F(t, n, r, i = {}) {
		let { lowS: a, prehash: s, format: c } = gt(i, h);
		if (r = g(r, void 0, "publicKey"), n = M(n, s), !m(t)) {
			let e = t instanceof C ? ", use sig.toBytes()" : "";
			throw Error("verify expects Uint8Array signature" + e);
		}
		S(t, c);
		try {
			let i = C.fromBytes(t, c), s = e.fromBytes(r);
			if (a && i.hasHighS()) return !1;
			let { r: l, s: u } = i, d = E(n), f = o.inv(u), p = o.create(d * f), m = o.create(l * f), h = e.BASE.multiplyUnsafe(p).add(s.multiplyUnsafe(m));
			return !h.is0() && o.create(h.x) === l;
		} catch {
			return !1;
		}
	}
	function I(e, t, n = {}) {
		let { prehash: r } = gt(n, h);
		return t = M(t, r), C.fromBytes(e, "recovered").recoverPublicKey(t).toBytes();
	}
	return Object.freeze({
		keygen: l,
		getPublicKey: u,
		getSharedSecret: d,
		utils: f,
		lengths: p,
		Point: e,
		sign: P,
		verify: F,
		recoverPublicKey: I,
		Signature: C,
		hash: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/curves/secp256k1.js
var Ot = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, kt = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
}, At = /* @__PURE__ */ BigInt(0), jt = /* @__PURE__ */ BigInt(2);
function Mt(e) {
	let t = Ot.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = H(H(H(u, n, t) * u % t, n, t) * u % t, jt, t) * l % t, f = H(d, i, t) * d % t, p = H(f, a, t) * f % t, m = H(p, s, t) * p % t, h = H(H(H(H(H(H(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, jt, t);
	if (!Nt.eql(Nt.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var Nt = Ge(Ot.p, { sqrt: Mt }), Pt = /* @__PURE__ */ Ct(Ot, {
	Fp: Nt,
	endo: kt
}), Ft = /* @__PURE__ */ Dt(Pt, z), It = {};
function Lt(e, ...t) {
	let n = It[e];
	if (n === void 0) {
		let t = z(pe(e));
		n = k(t, t), It[e] = n;
	}
	return z(k(n, ...t));
}
var Rt = (e) => e.toBytes(!0).slice(1), zt = (e) => e % jt === At;
function Bt(e) {
	let { Fn: t, BASE: n } = Pt, r = t.fromBytes(e), i = n.multiply(r);
	return {
		scalar: zt(i.y) ? r : t.neg(r),
		bytes: Rt(i)
	};
}
function Vt(e) {
	let t = Nt;
	if (!t.isValidNot0(e)) throw Error("invalid x: Fail if x ≥ p");
	let n = t.create(e * e), r = t.create(n * e + BigInt(7)), i = t.sqrt(r);
	zt(i) || (i = t.neg(i));
	let a = Pt.fromAffine({
		x: e,
		y: i
	});
	return a.assertValidity(), a;
}
var Ht = ce;
function Ut(...e) {
	return Pt.Fn.create(Ht(Lt("BIP0340/challenge", ...e)));
}
function Wt(e) {
	return Bt(e).bytes;
}
function Gt(e, t, n = j(32)) {
	let { Fn: r } = Pt, i = g(e, void 0, "message"), { bytes: a, scalar: o } = Bt(t), s = g(n, 32, "auxRand"), { bytes: c, scalar: l } = Bt(Lt("BIP0340/nonce", r.toBytes(o ^ Ht(Lt("BIP0340/aux", s))), a, i)), u = Ut(c, a, i), d = /* @__PURE__ */ new Uint8Array(64);
	if (d.set(c, 0), d.set(r.toBytes(r.create(l + u * o)), 32), !Kt(d, i, a)) throw Error("sign: Invalid signature produced");
	return d;
}
function Kt(e, t, n) {
	let { Fp: r, Fn: i, BASE: a } = Pt, o = g(e, 64, "signature"), s = g(t, void 0, "message"), c = g(n, 32, "publicKey");
	try {
		let e = Vt(Ht(c)), t = Ht(o.subarray(0, 32));
		if (!r.isValidNot0(t)) return !1;
		let n = Ht(o.subarray(32, 64));
		if (!i.isValidNot0(n)) return !1;
		let l = Ut(i.toBytes(t), Rt(e), s), u = a.multiplyUnsafe(n).add(e.multiplyUnsafe(i.neg(l))), { x: d, y: f } = u.toAffine();
		return !(u.is0() || !zt(f) || d !== t);
	} catch {
		return !1;
	}
}
var qt = /* @__PURE__ */ (() => {
	let e = (e = j(48)) => Je(e, Ot.n);
	return {
		keygen: ut(e, Wt),
		getPublicKey: Wt,
		sign: Gt,
		verify: Kt,
		Point: Pt,
		utils: {
			randomSecretKey: e,
			taggedHash: Lt,
			lift_x: Vt,
			pointToBytes: Rt
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
function Jt(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Yt(e) {
	if (!Jt(e)) throw Error("Uint8Array expected");
}
function Xt(e, t) {
	return Array.isArray(t) ? t.length === 0 ? !0 : e ? t.every((e) => typeof e == "string") : t.every((e) => Number.isSafeInteger(e)) : !1;
}
function Zt(e) {
	if (typeof e != "function") throw Error("function expected");
	return !0;
}
function Qt(e, t) {
	if (typeof t != "string") throw Error(`${e}: string expected`);
	return !0;
}
function $t(e) {
	if (!Number.isSafeInteger(e)) throw Error(`invalid integer: ${e}`);
}
function en(e) {
	if (!Array.isArray(e)) throw Error("array expected");
}
function tn(e, t) {
	if (!Xt(!0, t)) throw Error(`${e}: array of strings expected`);
}
function nn(e, t) {
	if (!Xt(!1, t)) throw Error(`${e}: array of numbers expected`);
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
	tn("alphabet", t);
	let r = new Map(t.map((e, t) => [e, t]));
	return {
		encode: (r) => (en(r), r.map((r) => {
			if (!Number.isSafeInteger(r) || r < 0 || r >= n) throw Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${e}`);
			return t[r];
		})),
		decode: (t) => (en(t), t.map((t) => {
			Qt("alphabet.decode", t);
			let n = r.get(t);
			if (n === void 0) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
			return n;
		}))
	};
}
function G(e = "") {
	return Qt("join", e), {
		encode: (t) => (tn("join.decode", t), t.join(e)),
		decode: (t) => (Qt("join.decode", t), t.split(e))
	};
}
function rn(e, t = "=") {
	return $t(e), Qt("padding", t), {
		encode(n) {
			for (tn("padding.encode", n); n.length * e % 8;) n.push(t);
			return n;
		},
		decode(n) {
			tn("padding.decode", n);
			let r = n.length;
			if (r * e % 8) throw Error("padding: invalid, string should have whole number of bytes");
			for (; r > 0 && n[r - 1] === t; r--) if ((r - 1) * e % 8 == 0) throw Error("padding: invalid, string has too much padding");
			return n.slice(0, r);
		}
	};
}
function an(e) {
	return Zt(e), {
		encode: (e) => e,
		decode: (t) => e(t)
	};
}
var on = (e, t) => t === 0 ? e : on(t, e % t), sn = /* @__NO_SIDE_EFFECTS__ */ (e, t) => e + (t - on(e, t)), cn = /* @__PURE__ */ (() => {
	let e = [];
	for (let t = 0; t < 40; t++) e.push(2 ** t);
	return e;
})();
function ln(e, t, n, r) {
	if (en(e), t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (/* @__PURE__ */ sn(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${/* @__PURE__ */ sn(t, n)}`);
	let i = 0, a = 0, o = cn[t], s = cn[n] - 1, c = [];
	for (let r of e) {
		if ($t(r), r >= o) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
		if (i = i << t | r, a + t > 32) throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);
		for (a += t; a >= n; a -= n) c.push((i >> a - n & s) >>> 0);
		let e = cn[a];
		if (e === void 0) throw Error("invalid carry");
		i &= e - 1;
	}
	if (i = i << n - a & s, !r && a >= t) throw Error("Excess padding");
	if (!r && i > 0) throw Error(`Non-zero padding: ${i}`);
	return r && a > 0 && c.push(i >>> 0), c;
}
function K(e, t = !1) {
	if ($t(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ sn(8, e) > 32 || /* @__PURE__ */ sn(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!Jt(n)) throw Error("radix2.encode input should be Uint8Array");
			return ln(Array.from(n), 8, e, !t);
		},
		decode: (n) => (nn("radix2.decode", n), Uint8Array.from(ln(n, e, 8, t)))
	};
}
function un(e) {
	return Zt(e), function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
U(K(4), W("0123456789ABCDEF"), G("")), U(K(5), W("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), rn(5), G("")), U(K(5), W("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), G("")), U(K(5), W("0123456789ABCDEFGHIJKLMNOPQRSTUV"), rn(5), G("")), U(K(5), W("0123456789ABCDEFGHIJKLMNOPQRSTUV"), G("")), U(K(5), W("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), G(""), an((e) => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var dn = typeof Uint8Array.from([]).toBase64 == "function" && typeof Uint8Array.fromBase64 == "function", fn = (e, t) => {
	Qt("base64", e);
	let n = t ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/, r = t ? "base64url" : "base64";
	if (e.length > 0 && !n.test(e)) throw Error("invalid base64");
	return Uint8Array.fromBase64(e, {
		alphabet: r,
		lastChunkHandling: "strict"
	});
}, pn = dn ? {
	encode(e) {
		return Yt(e), e.toBase64();
	},
	decode(e) {
		return fn(e, !1);
	}
} : U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), rn(6), G(""));
U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), G("")), dn || U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), rn(6), G("")), U(K(6), W("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), G(""));
var mn = U(W("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), G("")), hn = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function gn(e) {
	let t = e >> 25, n = (e & 33554431) << 5;
	for (let e = 0; e < hn.length; e++) (t >> e & 1) == 1 && (n ^= hn[e]);
	return n;
}
function _n(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = gn(i) ^ n >> 5;
	}
	i = gn(i);
	for (let t = 0; t < r; t++) i = gn(i) ^ e.charCodeAt(t) & 31;
	for (let e of t) i = gn(i) ^ e;
	for (let e = 0; e < 6; e++) i = gn(i);
	return i ^= n, mn.encode(ln([i % cn[30]], 30, 5, !1));
}
function vn(e) {
	let t = e === "bech32" ? 1 : 734539939, n = K(5), r = n.decode, i = n.encode, a = un(r);
	function o(e, n, r = 90) {
		Qt("bech32.encode prefix", e), Jt(n) && (n = Array.from(n)), nn("bech32.encode", n);
		let i = e.length;
		if (i === 0) throw TypeError(`Invalid prefix length ${i}`);
		let a = i + 7 + n.length;
		if (r !== !1 && a > r) throw TypeError(`Length ${a} exceeds limit ${r}`);
		let o = e.toLowerCase(), s = _n(o, n, t);
		return `${o}1${mn.encode(n)}${s}`;
	}
	function s(e, n = 90) {
		Qt("bech32.decode input", e);
		let r = e.length;
		if (r < 8 || n !== !1 && r > n) throw TypeError(`invalid string length: ${r} (${e}). Expected (8..${n})`);
		let i = e.toLowerCase();
		if (e !== i && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
		let a = i.lastIndexOf("1");
		if (a === 0 || a === -1) throw Error("Letter \"1\" must be present between prefix and data only");
		let o = i.slice(0, a), s = i.slice(a + 1);
		if (s.length < 6) throw Error("Data must be at least 6 characters long");
		let c = mn.decode(s).slice(0, -6), l = _n(o, c, t);
		if (!s.endsWith(l)) throw Error(`Invalid checksum in ${e}: expected "${l}"`);
		return {
			prefix: o,
			words: c
		};
	}
	let c = un(s);
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
var yn = vn("bech32");
vn("bech32m"), typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function" || U(K(4), W("0123456789abcdef"), G(""), an((e) => {
	if (typeof e != "string" || e.length % 2 != 0) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
	return e.toLowerCase();
}));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/utils.js
function bn(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function xn(e) {
	if (typeof e != "boolean") throw Error(`boolean expected, not ${e}`);
}
function Sn(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error("positive integer expected, got " + e);
}
function q(e, t, n = "") {
	let r = bn(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function Cn(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function wn(e, t) {
	q(e, void 0, "output");
	let n = t.outputLen;
	if (e.length < n) throw Error("digestInto() expects output buffer of length at least " + n);
}
function J(e) {
	return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Tn(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
var En = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Dn(e, t) {
	return e.buffer === t.buffer && e.byteOffset < t.byteOffset + t.byteLength && t.byteOffset < e.byteOffset + e.byteLength;
}
function On(e, t) {
	if (Dn(e, t) && e.byteOffset < t.byteOffset) throw Error("complex overlap of input and output is not supported");
}
function kn(e, t) {
	if (typeof t != "object" || !t) throw Error("options must be defined");
	return Object.assign(e, t);
}
function An(e, t) {
	if (e.length !== t.length) return !1;
	let n = 0;
	for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
	return n === 0;
}
var jn = (e, t) => {
	function n(n, ...r) {
		if (q(n, void 0, "key"), !En) throw Error("Non little-endian hardware is not yet supported");
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
function Mn(e, t, n = !0) {
	if (t === void 0) return new Uint8Array(e);
	if (t.length !== e) throw Error("\"output\" expected Uint8Array of length " + e + ", got: " + t.length);
	if (n && !Nn(t)) throw Error("invalid output, must be aligned");
	return t;
}
function Nn(e) {
	return e.byteOffset % 4 == 0;
}
function Pn(e) {
	return Uint8Array.from(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/aes.js
var Fn = 16, In = 283;
function Ln(e) {
	if (![
		16,
		24,
		32
	].includes(e.length)) throw Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + e.length);
}
function Rn(e) {
	return e << 1 ^ In & -(e >> 7);
}
function zn(e, t) {
	let n = 0;
	for (; t > 0; t >>= 1) n ^= e & -(t & 1), e = Rn(e);
	return n;
}
var Bn = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(256);
	for (let t = 0, n = 1; t < 256; t++, n ^= Rn(n)) e[t] = n;
	let t = /* @__PURE__ */ new Uint8Array(256);
	t[0] = 99;
	for (let n = 0; n < 255; n++) {
		let r = e[255 - n];
		r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
	}
	return Tn(e), t;
})(), Vn = /* @__PURE__ */ Bn.map((e, t) => Bn.indexOf(t)), Hn = (e) => e << 24 | e >>> 8, Un = (e) => e << 8 | e >>> 24;
function Wn(e, t) {
	if (e.length !== 256) throw Error("Wrong sbox length");
	let n = (/* @__PURE__ */ new Uint32Array(256)).map((n, r) => t(e[r])), r = n.map(Un), i = r.map(Un), a = i.map(Un), o = /* @__PURE__ */ new Uint32Array(65536), s = /* @__PURE__ */ new Uint32Array(65536), c = /* @__PURE__ */ new Uint16Array(65536);
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
var Gn = /* @__PURE__ */ Wn(Bn, (e) => zn(e, 3) << 24 | e << 16 | e << 8 | zn(e, 2)), Kn = /* @__PURE__ */ Wn(Vn, (e) => zn(e, 11) << 24 | zn(e, 13) << 16 | zn(e, 9) << 8 | zn(e, 14)), qn = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(16);
	for (let t = 0, n = 1; t < 16; t++, n = Rn(n)) e[t] = n;
	return e;
})();
function Jn(e) {
	q(e);
	let t = e.length;
	Ln(e);
	let { sbox2: n } = Gn, r = [];
	Nn(e) || r.push(e = Pn(e));
	let i = J(e), a = i.length, o = (e) => Zn(n, e, e, e, e), s = new Uint32Array(t + 28);
	s.set(i);
	for (let e = a; e < s.length; e++) {
		let t = s[e - 1];
		e % a === 0 ? t = o(Hn(t)) ^ qn[e / a - 1] : a > 6 && e % a === 4 && (t = o(t)), s[e] = s[e - a] ^ t;
	}
	return Tn(...r), s;
}
function Yn(e) {
	let t = Jn(e), n = t.slice(), r = t.length, { sbox2: i } = Gn, { T0: a, T1: o, T2: s, T3: c } = Kn;
	for (let e = 0; e < r; e += 4) for (let i = 0; i < 4; i++) n[e + i] = t[r - e - 4 + i];
	Tn(t);
	for (let e = 4; e < r - 4; e++) {
		let t = n[e], r = Zn(i, t, t, t, t);
		n[e] = a[r & 255] ^ o[r >>> 8 & 255] ^ s[r >>> 16 & 255] ^ c[r >>> 24];
	}
	return n;
}
function Xn(e, t, n, r, i, a) {
	return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | a >>> 24 & 255];
}
function Zn(e, t, n, r, i) {
	return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function Qn(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = Gn, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ Xn(o, s, t, n, r, i), l = e[c++] ^ Xn(o, s, n, r, i, t), u = e[c++] ^ Xn(o, s, r, i, t, n), d = e[c++] ^ Xn(o, s, i, t, n, r);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ Zn(a, t, n, r, i),
		s1: e[c++] ^ Zn(a, n, r, i, t),
		s2: e[c++] ^ Zn(a, r, i, t, n),
		s3: e[c++] ^ Zn(a, i, t, n, r)
	};
}
function $n(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = Kn, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ Xn(o, s, t, i, r, n), l = e[c++] ^ Xn(o, s, n, t, i, r), u = e[c++] ^ Xn(o, s, r, n, t, i), d = e[c++] ^ Xn(o, s, i, r, n, t);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ Zn(a, t, i, r, n),
		s1: e[c++] ^ Zn(a, n, t, i, r),
		s2: e[c++] ^ Zn(a, r, n, t, i),
		s3: e[c++] ^ Zn(a, i, r, n, t)
	};
}
function er(e) {
	if (q(e), e.length % Fn !== 0) throw Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function tr(e, t, n) {
	q(e);
	let r = e.length, i = r % Fn;
	if (!t && i !== 0) throw Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	Nn(e) || (e = Pn(e));
	let a = J(e);
	if (t) {
		let e = Fn - i;
		e ||= Fn, r += e;
	}
	return n = Mn(r, n), On(e, n), {
		b: a,
		o: J(n),
		out: n
	};
}
function nr(e, t) {
	if (!t) return e;
	let n = e.length;
	if (!n) throw Error("aes/pcks5: empty ciphertext not allowed");
	let r = e[n - 1];
	if (r <= 0 || r > 16) throw Error("aes/pcks5: wrong padding");
	let i = e.subarray(0, -r);
	for (let t = 0; t < r; t++) if (e[n - t - 1] !== r) throw Error("aes/pcks5: wrong padding");
	return i;
}
function rr(e) {
	let t = /* @__PURE__ */ new Uint8Array(16), n = J(t);
	t.set(e);
	let r = Fn - e.length;
	for (let e = Fn - r; e < Fn; e++) t[e] = r;
	return n;
}
var ir = /* @__PURE__ */ jn({
	blockSize: 16,
	nonceLength: 16
}, function(e, t, n = {}) {
	let r = !n.disablePadding;
	return {
		encrypt(n, i) {
			let a = Jn(e), { b: o, o: s, out: c } = tr(n, r, i), l = t, u = [a];
			Nn(l) || u.push(l = Pn(l));
			let d = J(l), f = d[0], p = d[1], m = d[2], h = d[3], g = 0;
			for (; g + 4 <= o.length;) f ^= o[g + 0], p ^= o[g + 1], m ^= o[g + 2], h ^= o[g + 3], {s0: f, s1: p, s2: m, s3: h} = Qn(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			if (r) {
				let e = rr(n.subarray(g * 4));
				f ^= e[0], p ^= e[1], m ^= e[2], h ^= e[3], {s0: f, s1: p, s2: m, s3: h} = Qn(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			}
			return Tn(...u), c;
		},
		decrypt(n, i) {
			er(n);
			let a = Yn(e), o = t, s = [a];
			Nn(o) || s.push(o = Pn(o));
			let c = J(o);
			i = Mn(n.length, i), Nn(n) || s.push(n = Pn(n)), On(n, i);
			let l = J(n), u = J(i), d = c[0], f = c[1], p = c[2], m = c[3];
			for (let e = 0; e + 4 <= l.length;) {
				let t = d, n = f, r = p, i = m;
				d = l[e + 0], f = l[e + 1], p = l[e + 2], m = l[e + 3];
				let { s0: o, s1: s, s2: c, s3: h } = $n(a, d, f, p, m);
				u[e++] = o ^ t, u[e++] = s ^ n, u[e++] = c ^ r, u[e++] = h ^ i;
			}
			return Tn(...s), nr(i, r);
		}
	};
}), ar = (e) => Uint8Array.from(e.split(""), (e) => e.charCodeAt(0)), or = ar("expand 16-byte k"), sr = ar("expand 32-byte k"), cr = J(or), lr = J(sr);
function Y(e, t) {
	return e << t | e >>> 32 - t;
}
function ur(e) {
	return e.byteOffset % 4 == 0;
}
var dr = 64, fr = 16, pr = 2 ** 32 - 1, mr = Uint32Array.of();
function hr(e, t, n, r, i, a, o, s) {
	let c = i.length, l = new Uint8Array(dr), u = J(l), d = ur(i) && ur(a), f = d ? J(i) : mr, p = d ? J(a) : mr;
	for (let m = 0; m < c; o++) {
		if (e(t, n, r, u, o, s), o >= pr) throw Error("arx: counter overflow");
		let h = Math.min(dr, c - m);
		if (d && h === dr) {
			let e = m / 4;
			if (m % 4 != 0) throw Error("arx: invalid block position");
			for (let t = 0, n; t < fr; t++) n = e + t, p[n] = f[n] ^ u[t];
			m += dr;
		} else {
			for (let e = 0, t; e < h; e++) t = m + e, a[t] = i[t] ^ l[e];
			m += h;
		}
	}
}
function gr(e, t) {
	let { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: a, rounds: o } = kn({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, t);
	if (typeof e != "function") throw Error("core must be a function");
	return Sn(i), Sn(o), xn(a), xn(n), (t, s, c, l, u = 0) => {
		q(t, void 0, "key"), q(s, void 0, "nonce"), q(c, void 0, "data");
		let d = c.length;
		if (l === void 0 && (l = new Uint8Array(d)), q(l, void 0, "output"), Sn(u), u < 0 || u >= pr) throw Error("arx: counter overflow");
		if (l.length < d) throw Error(`arx: output (${l.length}) is shorter than data (${d})`);
		let f = [], p = t.length, m, h;
		if (p === 32) f.push(m = Pn(t)), h = lr;
		else if (p === 16 && n) m = /* @__PURE__ */ new Uint8Array(32), m.set(t), m.set(t, 16), h = cr, f.push(m);
		else throw q(t, 32, "arx key"), Error("invalid key size");
		ur(s) || f.push(s = Pn(s));
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
		return hr(e, h, g, v, c, l, u, o), Tn(...f), l;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/_poly1305.js
function X(e, t) {
	return e[t++] & 255 | (e[t++] & 255) << 8;
}
var _r = class {
	blockLen = 16;
	outputLen = 16;
	buffer = /* @__PURE__ */ new Uint8Array(16);
	r = /* @__PURE__ */ new Uint16Array(10);
	h = /* @__PURE__ */ new Uint16Array(10);
	pad = /* @__PURE__ */ new Uint16Array(8);
	pos = 0;
	finished = !1;
	constructor(e) {
		e = Pn(q(e, 32, "key"));
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
		let z = P + w * f + T * d + E * u + D * l + O * c;
		P = z >>> 13, z &= 8191, z += k * s + A * o + 5 * h * j + 5 * m * M + 5 * p * N, P += z >>> 13, z &= 8191;
		let ne = P + w * p + T * f + E * d + D * u + O * l;
		P = ne >>> 13, ne &= 8191, ne += k * c + A * s + j * o + 5 * h * M + 5 * m * N, P += ne >>> 13, ne &= 8191;
		let re = P + w * m + T * p + E * f + D * d + O * u;
		P = re >>> 13, re &= 8191, re += k * l + A * c + j * s + M * o + 5 * h * N, P += re >>> 13, re &= 8191;
		let ie = P + w * h + T * m + E * p + D * f + O * d;
		P = ie >>> 13, ie &= 8191, ie += k * u + A * l + j * c + M * s + N * o, P += ie >>> 13, ie &= 8191, P = (P << 2) + P | 0, P = P + F | 0, F = P & 8191, P >>>= 13, I += P, i[0] = F, i[1] = I, i[2] = L, i[3] = R, i[4] = ee, i[5] = te, i[6] = z, i[7] = ne, i[8] = re, i[9] = ie;
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
		Tn(n);
	}
	update(e) {
		Cn(this), q(e), e = Pn(e);
		let { buffer: t, blockLen: n } = this, r = e.length;
		for (let i = 0; i < r;) {
			let a = Math.min(n - this.pos, r - i);
			if (a === n) for (; n <= r - i; i += n) this.process(e, i);
			else t.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === n && (this.process(t, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		Tn(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		Cn(this), wn(e, this), this.finished = !0;
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
function vr(e) {
	let t = (t, n) => e(n).update(t).digest(), n = e(/* @__PURE__ */ new Uint8Array(32));
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
}
vr((e) => new _r(e));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/chacha.js
function yr(e, t, n, r, i, a = 20) {
	let o = e[0], s = e[1], c = e[2], l = e[3], u = t[0], d = t[1], f = t[2], p = t[3], m = t[4], h = t[5], g = t[6], _ = t[7], v = i, y = n[0], b = n[1], x = n[2], S = o, C = s, w = c, T = l, E = u, D = d, O = f, k = p, A = m, j = h, M = g, N = _, P = v, F = y, I = b, L = x;
	for (let e = 0; e < a; e += 2) S = S + E | 0, P = Y(P ^ S, 16), A = A + P | 0, E = Y(E ^ A, 12), S = S + E | 0, P = Y(P ^ S, 8), A = A + P | 0, E = Y(E ^ A, 7), C = C + D | 0, F = Y(F ^ C, 16), j = j + F | 0, D = Y(D ^ j, 12), C = C + D | 0, F = Y(F ^ C, 8), j = j + F | 0, D = Y(D ^ j, 7), w = w + O | 0, I = Y(I ^ w, 16), M = M + I | 0, O = Y(O ^ M, 12), w = w + O | 0, I = Y(I ^ w, 8), M = M + I | 0, O = Y(O ^ M, 7), T = T + k | 0, L = Y(L ^ T, 16), N = N + L | 0, k = Y(k ^ N, 12), T = T + k | 0, L = Y(L ^ T, 8), N = N + L | 0, k = Y(k ^ N, 7), S = S + D | 0, L = Y(L ^ S, 16), M = M + L | 0, D = Y(D ^ M, 12), S = S + D | 0, L = Y(L ^ S, 8), M = M + L | 0, D = Y(D ^ M, 7), C = C + O | 0, P = Y(P ^ C, 16), N = N + P | 0, O = Y(O ^ N, 12), C = C + O | 0, P = Y(P ^ C, 8), N = N + P | 0, O = Y(O ^ N, 7), w = w + k | 0, F = Y(F ^ w, 16), A = A + F | 0, k = Y(k ^ A, 12), w = w + k | 0, F = Y(F ^ w, 8), A = A + F | 0, k = Y(k ^ A, 7), T = T + E | 0, I = Y(I ^ T, 16), j = j + I | 0, E = Y(E ^ j, 12), T = T + E | 0, I = Y(I ^ T, 8), j = j + I | 0, E = Y(E ^ j, 7);
	let R = 0;
	r[R++] = o + S | 0, r[R++] = s + C | 0, r[R++] = c + w | 0, r[R++] = l + T | 0, r[R++] = u + E | 0, r[R++] = d + D | 0, r[R++] = f + O | 0, r[R++] = p + k | 0, r[R++] = m + A | 0, r[R++] = h + j | 0, r[R++] = g + M | 0, r[R++] = _ + N | 0, r[R++] = v + P | 0, r[R++] = y + F | 0, r[R++] = b + I | 0, r[R++] = x + L | 0;
}
var br = /* @__PURE__ */ gr(yr, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hkdf.js
function xr(e, t, n) {
	return _(e), n === void 0 && (n = new Uint8Array(e.outputLen)), ft(e, n, t);
}
var Sr = /* @__PURE__ */ Uint8Array.of(0), Cr = /* @__PURE__ */ Uint8Array.of();
function wr(e, t, n, r = 32) {
	_(e), h(r, "length");
	let i = e.outputLen;
	if (r > 255 * i) throw Error("Length must be <= 255*HashLen");
	let a = Math.ceil(r / i);
	n === void 0 ? n = Cr : g(n, void 0, "info");
	let o = new Uint8Array(a * i), s = ft.create(e, t), c = s._cloneInto(), l = new Uint8Array(s.outputLen);
	for (let e = 0; e < a; e++) Sr[0] = e + 1, c.update(e === 0 ? Cr : l).update(n).update(Sr).digestInto(l), o.set(l, i * e), s._cloneInto(c);
	return s.destroy(), c.destroy(), b(l, Sr), o.slice(0, r);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/index.js
var Tr = Object.defineProperty, Z = (e, t) => {
	for (var n in t) Tr(e, n, {
		get: t[n],
		enumerable: !0
	});
}, Er = {};
Z(Er, {
	binarySearch: () => jr,
	bytesToHex: () => T,
	hexToBytes: () => O,
	insertEventIntoAscendingList: () => Ar,
	insertEventIntoDescendingList: () => kr,
	isHex32: () => $,
	mergeReverseSortedLists: () => Mr,
	normalizeURL: () => Or,
	utf8Decoder: () => Dr,
	utf8Encoder: () => Q
});
var Dr = new TextDecoder("utf-8"), Q = new TextEncoder();
function Or(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function kr(e, t) {
	let [n, r] = jr(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : e.created_at - t.created_at);
	return r || e.splice(n, 0, t), e;
}
function Ar(e, t) {
	let [n, r] = jr(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : t.created_at - e.created_at);
	return r || e.splice(n, 0, t), e;
}
function jr(e, t) {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = t(e[i]);
		if (a === 0) return [i, !0];
		a < 0 ? r = i - 1 : n = i + 1;
	}
	return [n, !1];
}
function Mr(e, t) {
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
var Nr = Symbol("verified"), Pr = (e) => e instanceof Object;
function Fr(e) {
	if (!Pr(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !$(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var Ir = class {
	generateSecretKey() {
		return qt.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return T(qt.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = T(qt.getPublicKey(t)), n.id = Rr(n), n.sig = T(qt.sign(O(Rr(n)), t)), n[Nr] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[Nr] == "boolean") return e[Nr];
		try {
			let t = Rr(e);
			if (t !== e.id) return e[Nr] = !1, !1;
			let n = qt.verify(O(e.sig), O(t), O(e.pubkey));
			return e[Nr] = n, n;
		} catch {
			return e[Nr] = !1, !1;
		}
	}
};
function Lr(e) {
	if (!Fr(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function Rr(e) {
	return T(z(Q.encode(Lr(e))));
}
var zr = new Ir(), Br = zr.generateSecretKey, Vr = zr.getPublicKey, Hr = zr.finalizeEvent, Ur = zr.verifyEvent;
Z({}, {
	AIEmbeddings: () => $i,
	AppCurationSet: () => Ro,
	Application: () => Io,
	AuthoredPodcasts: () => $a,
	BadgeAward: () => ii,
	BadgeDefinition: () => wo,
	Bid: () => Di,
	BidConfirmation: () => Oi,
	BlobsAuth: () => mo,
	BlockedRelaysList: () => Fa,
	BlossomServerList: () => Ja,
	BookmarkList: () => Ma,
	Bookmarksets: () => yo,
	Calendar: () => ts,
	CalendarEventRSVP: () => ns,
	CashuMintAnnouncement: () => ps,
	CashuWalletEvent: () => so,
	CashuWalletHistory: () => da,
	CashuWalletTokens: () => ua,
	ChannelCreation: () => vi,
	ChannelHideMessage: () => xi,
	ChannelMessage: () => bi,
	ChannelMetadata: () => yi,
	ChannelMuteUser: () => Si,
	ChatMessage: () => ai,
	Chess: () => wi,
	ClassifiedListing: () => Wo,
	ClientAuth: () => lo,
	CodeSnippet: () => Ri,
	CoinjoinPool: () => na,
	Comment: () => Ni,
	CommunitiesList: () => Na,
	CommunityDefinition: () => ls,
	CommunityPostApproval: () => aa,
	ConferenceEvent: () => Vo,
	Contacts: () => $r,
	CreateOrUpdateProduct: () => Do,
	CreateOrUpdateStall: () => Eo,
	CuratedVideoSets: () => xo,
	Curationsets: () => bo,
	Date: () => $o,
	DecoupledEncryptionKeyDistribution: () => ia,
	DecoupledKeyAnnouncement: () => Ga,
	DecoupledKeyClientAnnouncement: () => ra,
	DirectMessageRelaysList: () => Ka,
	DraftClassifiedListing: () => Go,
	DraftEvent: () => Xo,
	DraftLong: () => jo,
	Emojisets: () => Mo,
	EncryptedDirectMessage: () => ei,
	EventDeletion: () => ti,
	FavoriteFollowSets: () => Ua,
	FavoritePodcasts: () => qa,
	FavoriteRelays: () => Ra,
	FedimintAnnouncement: () => ms,
	Feed: () => Qo,
	FileMessage: () => di,
	FileMetadata: () => ji,
	FileServerPreference: () => Ya,
	Followsets: () => go,
	ForumThread: () => si,
	GenericRepost: () => fi,
	Genericlists: () => _o,
	GeocacheListing: () => ds,
	GeocacheLog: () => fa,
	GeocacheLogEntry: () => fs,
	GeocacheProofOfFind: () => pa,
	GiftWrap: () => Ai,
	GitPullRequest: () => Bi,
	GitPullRequestUpdate: () => Vi,
	GoodWikiAuthorList: () => Xa,
	GoodWikiRelayList: () => Za,
	GroupMetadata: () => gs,
	HTTPAuth: () => ho,
	Handlerinformation: () => as,
	Handlerrecommendation: () => is,
	Highlights: () => Oa,
	InteractiveRoom: () => Bo,
	InterestsList: () => Ba,
	Interestsets: () => To,
	Issue: () => Hi,
	JobFeedback: () => ca,
	JobRequest: () => oa,
	JobResult: () => sa,
	Label: () => Zi,
	LegacyNsiteFile: () => ss,
	LightningPubRPC: () => co,
	LinkSet: () => Zo,
	LiveChatMessage: () => Li,
	LiveEvent: () => zo,
	LongFormArticle: () => Ao,
	MarketplaceUI: () => Oo,
	MediaFollows: () => Ha,
	MediaStarterPacks: () => Ss,
	MergeRequests: () => Ti,
	Metadata: () => Xr,
	ModularArticleContent: () => Po,
	ModularArticleHeader: () => No,
	MuteSets: () => So,
	Mutelist: () => ka,
	NWCWalletInfo: () => ao,
	NWCWalletRequest: () => uo,
	NWCWalletResponse: () => fo,
	NormalVideo: () => hi,
	NostrConnect: () => po,
	NsiteNamed: () => us,
	NsiteRoot: () => oo,
	NutZap: () => wa,
	NutZapInfo: () => Va,
	OpenTimestamps: () => ki,
	Patch: () => zi,
	PeerToPeerOrderEvents: () => hs,
	Photo: () => mi,
	Pinlist: () => Aa,
	PodcastEpisode: () => Ci,
	PodcastMetadata: () => Qa,
	Poll: () => Mi,
	PollResponse: () => Ei,
	PrivateDirectMessage: () => ui,
	PrivateEventRelayList: () => za,
	ProblemTracker: () => Ji,
	ProductSoldAsAuction: () => ko,
	ProfileBadges: () => Co,
	ProxyAnnouncement: () => ro,
	PublicChatsList: () => Pa,
	PublicMessage: () => _i,
	Reaction: () => ri,
	ReactionToWebsite: () => pi,
	RecommendRelay: () => Qr,
	Redirects: () => Yo,
	RelayDiscovery: () => Lo,
	RelayList: () => ja,
	RelayMonitorAnnouncement: () => eo,
	RelayReview: () => rs,
	RelayReviews: () => Qi,
	Relaysets: () => vo,
	ReleaseArtifactSets: () => Fo,
	Reply: () => Ui,
	Report: () => Yi,
	Reporting: () => Xi,
	RepositoryAnnouncement: () => Ko,
	RepositoryState: () => qo,
	Repost: () => ni,
	ReservedCashuWalletTokens: () => la,
	RoomPresence: () => to,
	Scroll: () => Fi,
	Seal: () => li,
	SearchRelaysList: () => Ia,
	ShortTextNote: () => Zr,
	ShortVideo: () => gi,
	SimpleGroupAdmins: () => _s,
	SimpleGroupCreateGroup: () => va,
	SimpleGroupCreateInvite: () => ba,
	SimpleGroupDeleteEvent: () => _a,
	SimpleGroupDeleteGroup: () => ya,
	SimpleGroupEditMetadata: () => ga,
	SimpleGroupJoinRequest: () => xa,
	SimpleGroupLeaveRequest: () => Sa,
	SimpleGroupList: () => La,
	SimpleGroupLiveKitParticipants: () => bs,
	SimpleGroupMembers: () => vs,
	SimpleGroupPutUser: () => ma,
	SimpleGroupRemoveUser: () => ha,
	SimpleGroupReply: () => ci,
	SimpleGroupRoles: () => ys,
	SimpleGroupThreadedReply: () => oi,
	SlideSet: () => Uo,
	SoftwareApplication: () => os,
	StarterPacks: () => xs,
	StatusApplied: () => Gi,
	StatusClosed: () => Ki,
	StatusDraft: () => qi,
	StatusOpen: () => Wi,
	TidalLogin: () => Ta,
	Time: () => es,
	Torrent: () => ea,
	TorrentComment: () => ta,
	TransportMethodAnnouncement: () => io,
	UserEmojiList: () => Wa,
	UserGraspList: () => no,
	UserStatuses: () => Ho,
	VideoViewEvent: () => cs,
	Voice: () => Pi,
	VoiceComment: () => Ii,
	WebBookmarks: () => Cs,
	WikiArticle: () => Jo,
	Zap: () => Da,
	ZapGoal: () => Ca,
	ZapRequest: () => Ea,
	classifyKind: () => Jr,
	isAddressableKind: () => qr,
	isEphemeralKind: () => Kr,
	isKind: () => Yr,
	isRegularKind: () => Wr,
	isReplaceableKind: () => Gr
});
function Wr(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function Gr(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function Kr(e) {
	return 2e4 <= e && e < 3e4;
}
function qr(e) {
	return 3e4 <= e && e < 4e4;
}
function Jr(e) {
	return Wr(e) ? "regular" : Gr(e) ? "replaceable" : Kr(e) ? "ephemeral" : qr(e) ? "parameterized" : "unknown";
}
function Yr(e, t) {
	let n = t instanceof Array ? t : [t];
	return Fr(e) && n.includes(e.kind) || !1;
}
var Xr = 0, Zr = 1, Qr = 2, $r = 3, ei = 4, ti = 5, ni = 6, ri = 7, ii = 8, ai = 9, oi = 10, si = 11, ci = 12, li = 13, ui = 14, di = 15, fi = 16, pi = 17, mi = 20, hi = 21, gi = 22, _i = 24, vi = 40, yi = 41, bi = 42, xi = 43, Si = 44, Ci = 54, wi = 64, Ti = 818, Ei = 1018, Di = 1021, Oi = 1022, ki = 1040, Ai = 1059, ji = 1063, Mi = 1068, Ni = 1111, Pi = 1222, Fi = 1227, Ii = 1244, Li = 1311, Ri = 1337, zi = 1617, Bi = 1618, Vi = 1619, Hi = 1621, Ui = 1622, Wi = 1630, Gi = 1631, Ki = 1632, qi = 1633, Ji = 1971, Yi = 1984, Xi = 1984, Zi = 1985, Qi = 1986, $i = 1987, ea = 2003, ta = 2004, na = 2022, ra = 4454, ia = 4455, aa = 4550, oa = 5999, sa = 6999, ca = 7e3, la = 7374, ua = 7375, da = 7376, fa = 7516, pa = 7517, ma = 9e3, ha = 9001, ga = 9002, _a = 9005, va = 9007, ya = 9008, ba = 9009, xa = 9021, Sa = 9022, Ca = 9041, wa = 9321, Ta = 9467, Ea = 9734, Da = 9735, Oa = 9802, ka = 1e4, Aa = 10001, ja = 10002, Ma = 10003, Na = 10004, Pa = 10005, Fa = 10006, Ia = 10007, La = 10009, Ra = 10012, za = 10013, Ba = 10015, Va = 10019, Ha = 10020, Ua = 10021, Wa = 10030, Ga = 10044, Ka = 10050, qa = 10054, Ja = 10063, Ya = 10096, Xa = 10101, Za = 10102, Qa = 10154, $a = 10164, eo = 10166, to = 10312, no = 10317, ro = 10377, io = 11111, ao = 13194, oo = 15128, so = 17375, co = 21e3, lo = 22242, uo = 23194, fo = 23195, po = 24133, mo = 24242, ho = 27235, go = 3e4, _o = 30001, vo = 30002, yo = 30003, bo = 30004, xo = 30005, So = 30007, Co = 30008, wo = 30009, To = 30015, Eo = 30017, Do = 30018, Oo = 30019, ko = 30020, Ao = 30023, jo = 30024, Mo = 30030, No = 30040, Po = 30041, Fo = 30063, Io = 30078, Lo = 30166, Ro = 30267, zo = 30311, Bo = 30312, Vo = 30313, Ho = 30315, Uo = 30388, Wo = 30402, Go = 30403, Ko = 30617, qo = 30618, Jo = 30818, Yo = 30819, Xo = 31234, Zo = 31388, Qo = 31890, $o = 31922, es = 31923, ts = 31924, ns = 31925, rs = 31987, is = 31989, as = 31990, os = 32267, ss = 34128, cs = 34237, ls = 34550, us = 35128, ds = 37515, fs = 37516, ps = 38172, ms = 38173, hs = 38383, gs = 39e3, _s = 39001, vs = 39002, ys = 39003, bs = 39004, xs = 39089, Ss = 39092, Cs = 39701;
Z({}, {
	getHex64: () => ws,
	getInt: () => Ts,
	getSubscriptionId: () => Es,
	matchEventId: () => Ds,
	matchEventKind: () => ks,
	matchEventPubkey: () => Os
});
function ws(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function Ts(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function Es(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function Ds(e, t) {
	return t === ws(e, "id");
}
function Os(e, t) {
	return t === ws(e, "pubkey");
}
function ks(e, t) {
	return t === Ts(e, "kind");
}
Z({}, { makeAuthEvent: () => As });
function As(e, t) {
	return {
		kind: lo,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
new TextEncoder();
var js = {};
Z(js, {
	BECH32_REGEX: () => Ps,
	Bech32MaxSize: () => Ns,
	NostrTypeGuard: () => Ms,
	decode: () => Ls,
	decodeNostrURI: () => Is,
	encodeBytes: () => Us,
	naddrEncode: () => Ks,
	neventEncode: () => Gs,
	noteEncode: () => Vs,
	nprofileEncode: () => Ws,
	npubEncode: () => Bs,
	nsecEncode: () => zs
});
var Ms = {
	isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
	isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
	isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
	isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
	isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
	isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
	isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Ns = 5e3, Ps = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Fs(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function Is(e) {
	try {
		return e.startsWith("nostr:") && (e = e.substring(6)), Ls(e);
	} catch {
		return {
			type: "invalid",
			data: null
		};
	}
}
function Ls(e) {
	let { prefix: t, words: n } = yn.decode(e, Ns), r = new Uint8Array(yn.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = Rs(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nprofile");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: T(e[0][0]),
					relays: e[1] ? e[1].map((e) => Dr.decode(e)) : []
				}
			};
		}
		case "nevent": {
			let e = Rs(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nevent");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			if (e[2] && e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (e[3] && e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "nevent",
				data: {
					id: T(e[0][0]),
					relays: e[1] ? e[1].map((e) => Dr.decode(e)) : [],
					author: e[2]?.[0] ? T(e[2][0]) : void 0,
					kind: e[3]?.[0] ? parseInt(T(e[3][0]), 16) : void 0
				}
			};
		}
		case "naddr": {
			let e = Rs(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for naddr");
			if (!e[2]?.[0]) throw Error("missing TLV 2 for naddr");
			if (e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (!e[3]?.[0]) throw Error("missing TLV 3 for naddr");
			if (e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: Dr.decode(e[0][0]),
					pubkey: T(e[2][0]),
					kind: parseInt(T(e[3][0]), 16),
					relays: e[1] ? e[1].map((e) => Dr.decode(e)) : []
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
			data: T(r)
		};
		default: throw Error(`unknown prefix ${t}`);
	}
}
function Rs(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		if (n.length < 2) throw Error("not enough data to read TLV");
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		if (n = n.slice(2 + r), i.length < r) throw Error(`not enough data to read on TLV ${e}`);
		t[e] = t[e] || [], t[e].push(i);
	}
	return t;
}
function zs(e) {
	return Us("nsec", e);
}
function Bs(e) {
	return Us("npub", O(e));
}
function Vs(e) {
	return Us("note", O(e));
}
function Hs(e, t) {
	let n = yn.toWords(t);
	return yn.encode(e, n, Ns);
}
function Us(e, t) {
	return Hs(e, t);
}
function Ws(e) {
	return Hs("nprofile", qs({
		0: [O(e.pubkey)],
		1: (e.relays || []).map((e) => Q.encode(e))
	}));
}
function Gs(e) {
	let t;
	return e.kind !== void 0 && (t = Fs(e.kind)), Hs("nevent", qs({
		0: [O(e.id)],
		1: (e.relays || []).map((e) => Q.encode(e)),
		2: e.author ? [O(e.author)] : [],
		3: t ? [new Uint8Array(t)] : []
	}));
}
function Ks(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	return new DataView(t).setUint32(0, e.kind, !1), Hs("naddr", qs({
		0: [Q.encode(e.identifier)],
		1: (e.relays || []).map((e) => Q.encode(e)),
		2: [O(e.pubkey)],
		3: [new Uint8Array(t)]
	}));
}
function qs(e) {
	let t = [];
	return Object.entries(e).reverse().forEach(([e, n]) => {
		n.forEach((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		});
	}), k(...t);
}
Z({}, {
	decrypt: () => Ys,
	encrypt: () => Js
});
function Js(e, t, n) {
	let r = e instanceof Uint8Array ? e : O(e), i = Xs(Ft.getSharedSecret(r, O("02" + t))), a = Uint8Array.from(j(16)), o = Q.encode(n), s = ir(i, a).encrypt(o);
	return `${pn.encode(new Uint8Array(s))}?iv=${pn.encode(new Uint8Array(a.buffer))}`;
}
function Ys(e, t, n) {
	let r = e instanceof Uint8Array ? e : O(e), [i, a] = n.split("?iv="), o = Xs(Ft.getSharedSecret(r, O("02" + t))), s = pn.decode(a), c = pn.decode(i), l = ir(o, s).decrypt(c);
	return Dr.decode(l);
}
function Xs(e) {
	return e.slice(1, 33);
}
Z({}, {
	NIP05_REGEX: () => Zs,
	isNip05: () => Qs,
	isValid: () => rc,
	queryProfile: () => nc,
	searchDomain: () => tc,
	useFetchImplementation: () => ec
});
var Zs = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Qs = (e) => Zs.test(e || ""), $s;
try {
	$s = fetch;
} catch {}
function ec(e) {
	$s = e;
}
async function tc(e, t = "") {
	try {
		let n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await $s(n, { redirect: "manual" });
		if (r.status !== 200) throw Error("Wrong response code");
		return (await r.json()).names;
	} catch {
		return {};
	}
}
async function nc(e) {
	let t = e.match(Zs);
	if (!t) return null;
	let [, n = "_", r] = t;
	try {
		let e = `https://${r}/.well-known/nostr.json?name=${n}`, t = await $s(e, { redirect: "manual" });
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
async function rc(e, t) {
	let n = await nc(t);
	return n ? n.pubkey === e : !1;
}
Z({}, { parse: () => ic });
function ic(e) {
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
	fetchRelayInformation: () => oc,
	useFetchImplementation: () => ac
});
function ac(e) {}
async function oc(e) {
	return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
Z({}, {
	getPow: () => sc,
	minePow: () => lc
});
function sc(e) {
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
function cc(e) {
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
function lc(e, t) {
	let n = 0, r = e, i = [
		"nonce",
		n.toString(),
		t.toString()
	];
	for (r.tags.push(i);;) {
		let e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
		e !== r.created_at && (n = 0, r.created_at = e), i[1] = (++n).toString();
		let a = z(Q.encode(JSON.stringify([
			0,
			r.pubkey,
			r.created_at,
			r.kind,
			r.tags,
			r.content
		])));
		if (cc(a) >= t) {
			r.id = T(a);
			break;
		}
	}
	return r;
}
Z({}, {
	unwrapEvent: () => Vc,
	unwrapManyEvents: () => Hc,
	wrapEvent: () => zc,
	wrapManyEvents: () => Bc
}), Z({}, {
	createRumor: () => jc,
	createSeal: () => Mc,
	createWrap: () => Nc,
	unwrapEvent: () => Ic,
	unwrapManyEvents: () => Lc,
	wrapEvent: () => Pc,
	wrapManyEvents: () => Fc
}), Z({}, {
	decrypt: () => Cc,
	encrypt: () => Sc,
	getConversationKey: () => pc,
	v2: () => wc
});
var uc = 1, dc = 4294967295, fc = 65536;
function pc(e, t) {
	return xr(z, Ft.getSharedSecret(e, O("02" + t)).subarray(1, 33), Q.encode("nip44-v2"));
}
function mc(e, t) {
	let n = wr(z, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function hc(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 2 ** (Math.floor(Math.log2(e - 1)) + 1), n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function gc(e) {
	if (!Number.isSafeInteger(e) || e < uc || e > 65535) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
	let t = /* @__PURE__ */ new Uint8Array(2);
	return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function _c(e) {
	if (!Number.isSafeInteger(e) || e < fc || e > dc) throw Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
	let t = /* @__PURE__ */ new Uint8Array(4);
	return new DataView(t.buffer).setUint32(0, e, !1), t;
}
function vc(e) {
	let t = Q.encode(e), n = t.length;
	if (n < uc || n > dc) throw Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
	return k(n >= fc ? k(new Uint8Array([0, 0]), _c(n)) : gc(n), t, new Uint8Array(hc(n) - n));
}
function yc(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = t.getUint16(0), r, i;
	if (n === 0) {
		if (r = t.getUint32(2), r < fc) throw Error("invalid padding");
		i = 6;
	} else r = n, i = 2;
	let a = e.subarray(i, i + r);
	if (r < uc || r > dc || a.length !== r || e.length !== i + hc(r)) throw Error("invalid padding");
	return Dr.decode(a);
}
function bc(e, t, n) {
	if (n.length !== 32) throw Error("AAD associated data must be 32 bytes");
	return ft(z, e, k(n, t));
}
function xc(e) {
	if (typeof e != "string") throw Error("payload must be a valid string");
	let t = e.length;
	if (t < 132) throw Error("invalid payload length: " + t);
	if (e[0] === "#") throw Error("unknown encryption version");
	let n;
	try {
		n = pn.decode(e);
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
function Sc(e, t, n = j(32)) {
	let { chacha_key: r, chacha_nonce: i, hmac_key: a } = mc(t, n), o = br(r, i, vc(e)), s = bc(a, o, n);
	return pn.encode(k(new Uint8Array([2]), n, o, s));
}
function Cc(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = xc(e), { chacha_key: a, chacha_nonce: o, hmac_key: s } = mc(t, n);
	if (!An(bc(s, r, n), i)) throw Error("invalid MAC");
	return yc(br(a, o, r));
}
var wc = {
	utils: {
		getConversationKey: pc,
		calcPaddedLen: hc,
		pad: vc,
		unpad: yc
	},
	encrypt: Sc,
	decrypt: Cc
}, Tc = 172800, Ec = () => Math.round(Date.now() / 1e3), Dc = () => Math.round(Ec() - Math.random() * Tc), Oc = (e, t) => pc(e, t), kc = (e, t, n) => Sc(JSON.stringify(e), Oc(t, n)), Ac = (e, t) => JSON.parse(Cc(e.content, Oc(t, e.pubkey)));
function jc(e, t) {
	let n = {
		created_at: Ec(),
		content: "",
		tags: [],
		...e,
		pubkey: Vr(t)
	};
	return n.id = Rr(n), n;
}
function Mc(e, t, n) {
	return Hr({
		kind: li,
		content: kc(e, t, n),
		created_at: Dc(),
		tags: []
	}, t);
}
function Nc(e, t) {
	let n = Br();
	return Hr({
		kind: Ai,
		content: kc(e, n, t),
		created_at: Dc(),
		tags: [["p", t]]
	}, n);
}
function Pc(e, t, n) {
	return Nc(Mc(jc(e, t), t, n), n);
}
function Fc(e, t, n) {
	if (!n || n.length === 0) throw Error("At least one recipient is required.");
	let r = [Pc(e, t, Vr(t))];
	return n.forEach((n) => {
		r.push(Pc(e, t, n));
	}), r;
}
function Ic(e, t) {
	if (e.kind !== Ai) throw Error(`unexpected wrap kind ${e.kind}, expected ${Ai}`);
	let n = Ac(e, t);
	if (n.kind !== li) throw Error(`unexpected seal kind ${n.kind}, expected ${li}`);
	if (!Ur(n)) throw Error("seal signature is invalid");
	let r = Ac(n, t);
	if (r.pubkey !== n.pubkey) throw Error(`rumor pubkey ${r.pubkey} does not match seal pubkey ${n.pubkey}`);
	return r;
}
function Lc(e, t) {
	let n = [];
	return e.forEach((e) => {
		try {
			n.push(Ic(e, t));
		} catch {}
	}), n.sort((e, t) => e.created_at - t.created_at), n;
}
function Rc(e, t, n, r) {
	let i = {
		created_at: Math.ceil(Date.now() / 1e3),
		kind: ui,
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
function zc(e, t, n, r, i) {
	return Pc(Rc(t, n, r, i), e, t.publicKey);
}
function Bc(e, t, n, r, i) {
	if (!t || t.length === 0) throw Error("At least one recipient is required.");
	return [{ publicKey: Vr(e) }, ...t].map((t) => zc(e, t, n, r, i));
}
var Vc = Ic, Hc = Lc;
Z({}, {
	finishRepostEvent: () => Uc,
	getRepostedEvent: () => Gc,
	getRepostedEventPointer: () => Wc
});
function Uc(e, t, n, r) {
	let i, a = [
		...e.tags ?? [],
		[
			"e",
			t.id,
			n
		],
		["p", t.pubkey]
	];
	return t.kind === Zr ? i = ni : (i = fi, a.push(["k", String(t.kind)])), Hr({
		kind: i,
		tags: a,
		content: e.content === "" || t.tags?.find((e) => e[0] === "-") ? "" : JSON.stringify(t),
		created_at: e.created_at
	}, r);
}
function Wc(e) {
	if (![ni, fi].includes(e.kind)) return;
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
function Gc(e, { skipVerification: t } = {}) {
	let n = Wc(e);
	if (n === void 0 || e.content === "") return;
	let r;
	try {
		r = JSON.parse(e.content);
	} catch {
		return;
	}
	if (r.id === n.id && (t || Ur(r))) return r;
}
Z({}, {
	NOSTR_URI_REGEX: () => Kc,
	parse: () => Jc,
	test: () => qc
});
var Kc = RegExp(`nostr:(${Ps.source})`);
function qc(e) {
	return typeof e == "string" && RegExp(`^${Kc.source}$`).test(e);
}
function Jc(e) {
	let t = e.match(RegExp(`^${Kc.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: Ls(t[1])
	};
}
Z({}, { parse: () => tl });
function Yc(e) {
	if (e) return /^\d+$/.test(e) ? parseInt(e, 10) : e;
}
function Xc(e, t) {
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
function Zc(e) {
	switch (e[0]) {
		case "E":
		case "e": return !e[1] || !$(e[1]) ? void 0 : {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && $(e[3]) ? e[3] : void 0
		};
		case "A":
		case "a": return e[1] ? Xc(e[1], e[2]) : void 0;
		case "I":
		case "i": return e[1] ? {
			value: e[1],
			hint: e[2]
		} : void 0;
	}
}
function Qc(e) {
	if (e[1]) {
		if (e[1].includes(":")) return Xc(e[1], e[2]);
		if ($(e[1])) return {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && $(e[3]) ? e[3] : void 0
		};
	}
}
function $c(e) {
	return e.findLast((e) => e.tagName === "A" || e.tagName === "a")?.pointer || e.findLast((e) => e.tagName === "I" || e.tagName === "i")?.pointer || e.findLast((e) => e.tagName === "E" || e.tagName === "e")?.pointer;
}
function el(e, t) {
	if (!e || !("id" in e) || !e.author) return;
	let n = t.find((t) => t.pubkey === e.author);
	n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
		e.relays.indexOf(t) === -1 && e.relays.push(t);
	}), n.relays = e.relays);
}
function tl(e) {
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
		let e = Zc(i);
		e && n.push({
			tagName: i[0],
			pointer: e
		});
	} else if ((i[0] === "e" || i[0] === "a" || i[0] === "i") && i[1]) {
		let e = Zc(i);
		e && r.push({
			tagName: i[0],
			pointer: e
		});
	} else if (i[0] === "K") t.rootKind = Yc(i[1]);
	else if (i[0] === "k") t.replyKind = Yc(i[1]);
	else if (i[0] === "q") {
		let e = Qc(i);
		e && t.quotes.push(e);
	} else (i[0] === "P" || i[0] === "p") && i[1] && $(i[1]) && t.profiles.push({
		pubkey: i[1],
		relays: i[2] ? [i[2]] : []
	});
	return t.root = $c(n), t.reply = $c(r), el(t.root, t.profiles), el(t.reply, t.profiles), t.quotes.forEach((e) => el(e, t.profiles)), t;
}
Z({}, {
	finishReactionEvent: () => nl,
	getReactedEventPointer: () => rl
});
function nl(e, t, n) {
	let r = t.tags.filter((e) => e.length >= 2 && (e[0] === "e" || e[0] === "p"));
	return Hr({
		...e,
		kind: ri,
		tags: [
			...e.tags ?? [],
			...r,
			["e", t.id],
			["p", t.pubkey]
		],
		content: e.content ?? "+"
	}, n);
}
function rl(e) {
	if (e.kind !== ri) return;
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
Z({}, { parse: () => sl });
var il = /\W/m, al = /[^\w\/] |[^\w\/]$|$|,| /m, ol = 42;
function* sl(e) {
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
			if (o === 0 || e[o - 1].match(il)) {
				let t = e.slice(o + 1, o + ol).match(il), a = t ? o + 1 + t.index : n;
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
			let t = e.slice(a + 60).match(il), o = t ? a + 60 + t.index : n;
			try {
				let t, { data: n, type: s } = Ls(e.slice(a + 1, o));
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
			let t = e.slice(a + 4).match(al), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 5 : 4;
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
			let t = e.slice(a + 4).match(al), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 3 : 2;
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
	channelCreateEvent: () => cl,
	channelHideMessageEvent: () => dl,
	channelMessageEvent: () => ul,
	channelMetadataEvent: () => ll,
	channelMuteUserEvent: () => fl
});
var cl = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Hr({
		kind: vi,
		tags: [...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, ll = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Hr({
		kind: yi,
		tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, ul = (e, t) => {
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
	]), Hr({
		kind: bi,
		tags: [...n, ...e.tags ?? []],
		content: e.content,
		created_at: e.created_at
	}, t);
}, dl = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Hr({
		kind: xi,
		tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, fl = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Hr({
		kind: Si,
		tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
};
Z({}, {
	EMOJI_SHORTCODE_REGEX: () => pl,
	matchAll: () => hl,
	regex: () => ml,
	replaceAll: () => gl
});
var pl = /:(\w+):/, ml = () => RegExp(`\\B${pl.source}\\B`, "g");
function* hl(e) {
	let t = e.matchAll(ml());
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
function gl(e, t) {
	return e.replaceAll(ml(), (e, n) => t({
		shortcode: e,
		name: n
	}));
}
Z({}, {
	useFetchImplementation: () => vl,
	validateGithub: () => yl
});
var _l;
try {
	_l = fetch;
} catch {}
function vl(e) {
	_l = e;
}
async function yl(e, t, n) {
	try {
		return await (await _l(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
Z({}, {
	makeNwcRequestEvent: () => xl,
	parseConnectionString: () => bl
});
function bl(e) {
	let { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, a = r.getAll("relay"), o = r.get("secret");
	if (!i || a.length === 0 || !o) throw Error("invalid connection string");
	return {
		pubkey: i,
		relay: a[0],
		relays: a,
		secret: o
	};
}
async function xl(e, t, n) {
	let r = Js(t, e, JSON.stringify({
		method: "pay_invoice",
		params: { invoice: n }
	}));
	return Hr({
		kind: uo,
		created_at: Math.round(Date.now() / 1e3),
		content: r,
		tags: [["p", e]]
	}, t);
}
Z({}, { normalizeIdentifier: () => Sl });
function Sl(e) {
	return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((e) => /\p{Letter}/u.test(e) || /\p{Number}/u.test(e) ? e : "-").join("");
}
Z({}, {
	getSatoshisAmountFromBolt11: () => kl,
	getZapEndpoint: () => Tl,
	makeZapReceipt: () => Ol,
	makeZapRequest: () => El,
	useFetchImplementation: () => wl,
	validateZapRequest: () => Dl
});
var Cl;
try {
	Cl = fetch;
} catch {}
function wl(e) {
	Cl = e;
}
async function Tl(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (r) {
			let [e, n] = r.split("@");
			t = new URL(`/.well-known/lnurlp/${e}`, `https://${n}`).toString();
		} else if (n) {
			let { words: e } = yn.decode(n, 1e3), r = yn.fromWords(e);
			t = Dr.decode(r);
		} else return null;
		let i = await (await Cl(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function El(e) {
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
		if (t.tags.push(["e", e.event.id]), Gr(e.event.kind)) {
			let n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
			t.tags.push(n);
		} else if (qr(e.event.kind)) {
			let n = e.event.tags.find(([e, t]) => e === "d" && t);
			if (!n) throw Error("d tag not found or is empty");
			let r = ["a", `${e.event.kind}:${e.event.pubkey}:${n[1]}`];
			t.tags.push(r);
		}
		t.tags.push(["k", e.event.kind.toString()]);
	}
	return t;
}
function Dl(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!Fr(t)) return "Zap request is not a valid Nostr event.";
	if (!Ur(t)) return "Invalid signature on zap request.";
	let n = t.tags.find(([e, t]) => e === "p" && t);
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!$(n[1])) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find(([e, t]) => e === "e" && t);
	return r && !$(r[1]) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([e, t]) => e === "relays" && t) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Ol({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
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
function kl(e) {
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
	Negentropy: () => Vl,
	NegentropyStorageVector: () => Bl,
	NegentropySync: () => Wl
});
var Al = 97, jl = 32, Ml = 16, Nl = {
	Skip: 0,
	Fingerprint: 1,
	IdList: 2
}, Pl = class {
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
		if (e instanceof Pl && (e = e.unwrap()), typeof e.length != "number") throw Error("bad length");
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
function Fl(e) {
	let t = 0;
	for (;;) {
		if (e.length === 0) throw Error("parse ends prematurely");
		let n = e.shift();
		if (t = t << 7 | n & 127, !(n & 128)) break;
	}
	return t;
}
function Il(e) {
	if (e === 0) return new Pl(new Uint8Array([0]));
	let t = [];
	for (; e !== 0;) t.push(e & 127), e >>>= 7;
	t.reverse();
	for (let e = 0; e < t.length - 1; e++) t[e] |= 128;
	return new Pl(new Uint8Array(t));
}
function Ll(e) {
	return Rl(e, 1)[0];
}
function Rl(e, t) {
	if (e.length < t) throw Error("parse ends prematurely");
	return e.shiftN(t);
}
var zl = class {
	buf;
	constructor() {
		this.setToZero();
	}
	setToZero() {
		this.buf = new Uint8Array(jl);
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
		let t = new Uint8Array(jl);
		t[0] = 1, this.add(t);
	}
	getFingerprint(e) {
		let t = new Pl();
		return t.extend(this.buf), t.extend(Il(e)), z(t.unwrap()).subarray(0, Ml);
	}
}, Bl = class {
	items;
	sealed;
	constructor() {
		this.items = [], this.sealed = !1;
	}
	insert(e, t) {
		if (this.sealed) throw Error("already sealed");
		let n = O(t);
		if (n.byteLength !== jl) throw Error("bad id size for added item");
		this.items.push({
			timestamp: e,
			id: n
		});
	}
	seal() {
		if (this.sealed) throw Error("already sealed");
		this.sealed = !0, this.items.sort(Ul);
		for (let e = 1; e < this.items.length; e++) if (Ul(this.items[e - 1], this.items[e]) === 0) throw Error("duplicate item inserted");
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
		return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (e) => Ul(e, n) < 0);
	}
	fingerprint(e, t) {
		let n = new zl();
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
}, Vl = class {
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
		let e = new Pl();
		return e.extend(new Uint8Array([Al])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), T(e.unwrap());
	}
	reconcile(e, t, n) {
		let r = new Pl(O(e));
		this.lastTimestampIn = this.lastTimestampOut = 0;
		let i = new Pl();
		i.extend(new Uint8Array([Al]));
		let a = Ll(r);
		if (a < 96 || a > 111) throw Error("invalid negentropy protocol version byte");
		if (a !== Al) throw Error("unsupported negentropy protocol version requested: " + (a - 96));
		let o = this.storage.size(), s = this._bound(0), c = 0, l = !1;
		for (; r.length !== 0;) {
			let e = new Pl(), a = () => {
				l && (l = !1, e.extend(this.encodeBound(s)), e.extend(Il(Nl.Skip)));
			}, u = this.decodeBound(r), d = Fl(r), f = c, p = this.storage.findLowerBound(c, o, u);
			if (d === Nl.Skip) l = !0;
			else if (d === Nl.Fingerprint) Hl(Rl(r, Ml), this.storage.fingerprint(f, p)) === 0 ? l = !0 : (a(), this.splitRange(f, p, u, e));
			else if (d === Nl.IdList) {
				let e = Fl(r), i = {};
				for (let t = 0; t < e; t++) {
					let e = Rl(r, jl);
					i[T(e)] = e;
				}
				if (l = !0, this.storage.iterate(f, p, (e) => {
					let n = e.id, r = T(n);
					return i[r] ? delete i[T(n)] : t?.(r), !0;
				}), n) for (let e of Object.values(i)) n(T(e));
			} else throw Error("unexpected mode");
			if (this.exceededFrameSizeLimit(i.length + e.length)) {
				let e = this.storage.fingerprint(p, o);
				i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend(Il(Nl.Fingerprint)), i.extend(e);
				break;
			}
			i.extend(e), c = p, s = u;
		}
		return i.length === 1 ? null : T(i.unwrap());
	}
	splitRange(e, t, n, r) {
		let i = t - e;
		if (i < 32) r.extend(this.encodeBound(n)), r.extend(Il(Nl.IdList)), r.extend(Il(i)), this.storage.iterate(e, t, (e) => (r.extend(e.id), !0));
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
				r.extend(this.encodeBound(l)), r.extend(Il(Nl.Fingerprint)), r.extend(c);
			}
		}
	}
	exceededFrameSizeLimit(e) {
		return e > this.frameSizeLimit - 200;
	}
	decodeTimestampIn(e) {
		let t = Fl(e);
		return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
	}
	decodeBound(e) {
		let t = this.decodeTimestampIn(e), n = Fl(e);
		if (n > jl) throw Error("bound key too long");
		return {
			timestamp: t,
			id: Rl(e, n)
		};
	}
	encodeTimestampOut(e) {
		if (e === Number.MAX_VALUE) return this.lastTimestampOut = Number.MAX_VALUE, Il(0);
		let t = e;
		return e -= this.lastTimestampOut, this.lastTimestampOut = t, Il(e + 1);
	}
	encodeBound(e) {
		let t = new Pl();
		return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend(Il(e.id.length)), t.extend(e.id), t;
	}
	getMinimalBound(e, t) {
		if (t.timestamp !== e.timestamp) return this._bound(t.timestamp);
		{
			let n = 0, r = t.id, i = e.id;
			for (let e = 0; e < jl && r[e] === i[e]; e++) n++;
			return this._bound(t.timestamp, t.id.subarray(0, n + 1));
		}
	}
};
function Hl(e, t) {
	for (let n = 0; n < e.byteLength; n++) {
		if (e[n] < t[n]) return -1;
		if (e[n] > t[n]) return 1;
	}
	return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function Ul(e, t) {
	return e.timestamp === t.timestamp ? Hl(e.id, t.id) : e.timestamp - t.timestamp;
}
var Wl = class {
	relay;
	storage;
	neg;
	filter;
	subscription;
	onhave;
	onneed;
	constructor(e, t, n, r = {}) {
		this.relay = e, this.storage = t, this.neg = new Vl(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (e) => {
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
	getToken: () => Kl,
	hashPayload: () => $l,
	unpackEventFromToken: () => Jl,
	validateEvent: () => tu,
	validateEventKind: () => Xl,
	validateEventMethodTag: () => Ql,
	validateEventPayloadTag: () => eu,
	validateEventTimestamp: () => Yl,
	validateEventUrlTag: () => Zl,
	validateToken: () => ql
});
var Gl = "Nostr ";
async function Kl(e, t, n, r = !1, i) {
	let a = {
		kind: ho,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	i && a.tags.push(["payload", $l(i)]);
	let o = await n(a);
	return (r ? Gl : "") + pn.encode(Q.encode(JSON.stringify(o)));
}
async function ql(e, t, n) {
	return await tu(await Jl(e).catch((e) => {
		throw e;
	}), t, n).catch((e) => {
		throw e;
	});
}
async function Jl(e) {
	if (!e) throw Error("Missing token");
	e = e.replace(Gl, "");
	let t = Dr.decode(pn.decode(e));
	if (!t || t.length === 0 || !t.startsWith("{")) throw Error("Invalid token");
	return JSON.parse(t);
}
function Yl(e) {
	return e.created_at ? Math.abs(Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at) < 60 : !1;
}
function Xl(e) {
	return e.kind === ho;
}
function Zl(e, t) {
	let n = e.tags.find((e) => e[0] === "u");
	return n ? n.length > 0 && n[1] === t : !1;
}
function Ql(e, t) {
	let n = e.tags.find((e) => e[0] === "method");
	return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function $l(e) {
	return T(z(Q.encode(JSON.stringify(e))));
}
function eu(e, t) {
	let n = e.tags.find((e) => e[0] === "payload");
	if (!n) return !1;
	let r = $l(t);
	return n.length > 0 && n[1] === r;
}
async function tu(e, t, n, r) {
	if (!Ur(e)) throw Error("Invalid nostr event, signature invalid");
	if (!Xl(e)) throw Error("Invalid nostr event, kind invalid");
	if (!Yl(e)) throw Error("Invalid nostr event, created_at timestamp invalid");
	if (!Zl(e, t)) throw Error("Invalid nostr event, url tag invalid");
	if (!Ql(e, n)) throw Error("Invalid nostr event, method tag invalid");
	if (r && typeof r == "object" && Object.keys(r).length > 0 && !eu(e, r)) throw Error("Invalid nostr event, payload tag does not match request body hash");
	return !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relayLists.ts
var nu = [
	"wss://relay.damus.io/",
	"wss://relay.nostr.band/",
	"wss://nrelay.c-stellar.net/",
	"wss://nrelay-jp.c-stellar.net/"
], ru = /* @__PURE__ */ new Set(["ws:", "wss:"]), iu = new Set(nu), au = class {
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
		return t !== null && iu.has(t);
	}
	static normalizeExternalRelayUrlCandidate(e) {
		if (typeof e != "string") return null;
		let t = e.trim();
		if (!t) return null;
		try {
			if (t.includes("://")) {
				let e = new URL(t);
				if (!ru.has(e.protocol) || e.username || e.password) return null;
			}
			let e = Er.normalizeURL(t), n = new URL(e);
			return !ru.has(n.protocol) || !n.hostname || n.username || n.password ? null : e;
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
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryEventUtils.ts
function ou(e) {
	return e.map((e) => [...e]);
}
function su(e) {
	return {
		id: e.id,
		pubkey: e.pubkey,
		created_at: e.created_at,
		kind: e.kind,
		tags: ou(e.tags),
		content: e.content,
		sig: e.sig
	};
}
function cu(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.pubkey == "string" && typeof t.kind == "number" && typeof t.content == "string" && typeof t.created_at == "number" && typeof t.sig == "string" && Array.isArray(t.tags) && t.tags.every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
export { js as a, f as c, i as d, Rr as i, p as l, cu as n, Fr as o, au as r, Ur as s, su as t, c as u };
