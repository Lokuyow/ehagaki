import { a as e, c as t, d as n, f as r, i, l as a, m as o, n as s, o as c, p as l, r as u, s as d, t as f, u as p } from "./base-CVnVyhoG.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/utils.js
function m(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function h(e) {
	if (typeof e != "boolean") throw Error(`boolean expected, not ${e}`);
}
function g(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error("positive integer expected, got " + e);
}
function _(e, t, n = "") {
	let r = m(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function v(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function ee(e, t) {
	_(e, void 0, "output");
	let n = t.outputLen;
	if (e.length < n) throw Error("digestInto() expects output buffer of length at least " + n);
}
function y(e) {
	return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function b(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
var x = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function S(e, t) {
	return e.buffer === t.buffer && e.byteOffset < t.byteOffset + t.byteLength && t.byteOffset < e.byteOffset + e.byteLength;
}
function C(e, t) {
	if (S(e, t) && e.byteOffset < t.byteOffset) throw Error("complex overlap of input and output is not supported");
}
function w(e, t) {
	if (typeof t != "object" || !t) throw Error("options must be defined");
	return Object.assign(e, t);
}
function T(e, t) {
	if (e.length !== t.length) return !1;
	let n = 0;
	for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
	return n === 0;
}
var E = (e, t) => {
	function n(n, ...r) {
		if (_(n, void 0, "key"), !x) throw Error("Non little-endian hardware is not yet supported");
		if (e.nonceLength !== void 0) {
			let t = r[0];
			_(t, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
		}
		let i = e.tagLength;
		i && r[1] !== void 0 && _(r[1], void 0, "AAD");
		let a = t(n, ...r), o = (e, t) => {
			if (t !== void 0) {
				if (e !== 2) throw Error("cipher output not supported");
				_(t, void 0, "output");
			}
		}, s = !1;
		return {
			encrypt(e, t) {
				if (s) throw Error("cannot encrypt() twice with same key + nonce");
				return s = !0, _(e), o(a.encrypt.length, t), a.encrypt(e, t);
			},
			decrypt(e, t) {
				if (_(e), i && e.length < i) throw Error("\"ciphertext\" expected length bigger than tagLength=" + i);
				return o(a.decrypt.length, t), a.decrypt(e, t);
			}
		};
	}
	return Object.assign(n, e), n;
};
function D(e, t, n = !0) {
	if (t === void 0) return new Uint8Array(e);
	if (t.length !== e) throw Error("\"output\" expected Uint8Array of length " + e + ", got: " + t.length);
	if (n && !O(t)) throw Error("invalid output, must be aligned");
	return t;
}
function O(e) {
	return e.byteOffset % 4 == 0;
}
function k(e) {
	return Uint8Array.from(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/aes.js
var A = 16, j = 283;
function M(e) {
	if (![
		16,
		24,
		32
	].includes(e.length)) throw Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + e.length);
}
function N(e) {
	return e << 1 ^ j & -(e >> 7);
}
function P(e, t) {
	let n = 0;
	for (; t > 0; t >>= 1) n ^= e & -(t & 1), e = N(e);
	return n;
}
var F = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(256);
	for (let t = 0, n = 1; t < 256; t++, n ^= N(n)) e[t] = n;
	let t = /* @__PURE__ */ new Uint8Array(256);
	t[0] = 99;
	for (let n = 0; n < 255; n++) {
		let r = e[255 - n];
		r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
	}
	return b(e), t;
})(), I = /* @__PURE__ */ F.map((e, t) => F.indexOf(t)), L = (e) => e << 24 | e >>> 8, R = (e) => e << 8 | e >>> 24;
function z(e, t) {
	if (e.length !== 256) throw Error("Wrong sbox length");
	let n = (/* @__PURE__ */ new Uint32Array(256)).map((n, r) => t(e[r])), r = n.map(R), i = r.map(R), a = i.map(R), o = /* @__PURE__ */ new Uint32Array(65536), s = /* @__PURE__ */ new Uint32Array(65536), c = /* @__PURE__ */ new Uint16Array(65536);
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
var B = /* @__PURE__ */ z(F, (e) => P(e, 3) << 24 | e << 16 | e << 8 | P(e, 2)), V = /* @__PURE__ */ z(I, (e) => P(e, 11) << 24 | P(e, 13) << 16 | P(e, 9) << 8 | P(e, 14)), te = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(16);
	for (let t = 0, n = 1; t < 16; t++, n = N(n)) e[t] = n;
	return e;
})();
function H(e) {
	_(e);
	let t = e.length;
	M(e);
	let { sbox2: n } = B, r = [];
	O(e) || r.push(e = k(e));
	let i = y(e), a = i.length, o = (e) => W(n, e, e, e, e), s = new Uint32Array(t + 28);
	s.set(i);
	for (let e = a; e < s.length; e++) {
		let t = s[e - 1];
		e % a === 0 ? t = o(L(t)) ^ te[e / a - 1] : a > 6 && e % a === 4 && (t = o(t)), s[e] = s[e - a] ^ t;
	}
	return b(...r), s;
}
function ne(e) {
	let t = H(e), n = t.slice(), r = t.length, { sbox2: i } = B, { T0: a, T1: o, T2: s, T3: c } = V;
	for (let e = 0; e < r; e += 4) for (let i = 0; i < 4; i++) n[e + i] = t[r - e - 4 + i];
	b(t);
	for (let e = 4; e < r - 4; e++) {
		let t = n[e], r = W(i, t, t, t, t);
		n[e] = a[r & 255] ^ o[r >>> 8 & 255] ^ s[r >>> 16 & 255] ^ c[r >>> 24];
	}
	return n;
}
function U(e, t, n, r, i, a) {
	return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | a >>> 24 & 255];
}
function W(e, t, n, r, i) {
	return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function re(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = B, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ U(o, s, t, n, r, i), l = e[c++] ^ U(o, s, n, r, i, t), u = e[c++] ^ U(o, s, r, i, t, n), d = e[c++] ^ U(o, s, i, t, n, r);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ W(a, t, n, r, i),
		s1: e[c++] ^ W(a, n, r, i, t),
		s2: e[c++] ^ W(a, r, i, t, n),
		s3: e[c++] ^ W(a, i, t, n, r)
	};
}
function ie(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = V, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ U(o, s, t, i, r, n), l = e[c++] ^ U(o, s, n, t, i, r), u = e[c++] ^ U(o, s, r, n, t, i), d = e[c++] ^ U(o, s, i, r, n, t);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ W(a, t, i, r, n),
		s1: e[c++] ^ W(a, n, t, i, r),
		s2: e[c++] ^ W(a, r, n, t, i),
		s3: e[c++] ^ W(a, i, r, n, t)
	};
}
function ae(e) {
	if (_(e), e.length % A !== 0) throw Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function oe(e, t, n) {
	_(e);
	let r = e.length, i = r % A;
	if (!t && i !== 0) throw Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	O(e) || (e = k(e));
	let a = y(e);
	if (t) {
		let e = A - i;
		e ||= A, r += e;
	}
	return n = D(r, n), C(e, n), {
		b: a,
		o: y(n),
		out: n
	};
}
function se(e, t) {
	if (!t) return e;
	let n = e.length;
	if (!n) throw Error("aes/pcks5: empty ciphertext not allowed");
	let r = e[n - 1];
	if (r <= 0 || r > 16) throw Error("aes/pcks5: wrong padding");
	let i = e.subarray(0, -r);
	for (let t = 0; t < r; t++) if (e[n - t - 1] !== r) throw Error("aes/pcks5: wrong padding");
	return i;
}
function ce(e) {
	let t = /* @__PURE__ */ new Uint8Array(16), n = y(t);
	t.set(e);
	let r = A - e.length;
	for (let e = A - r; e < A; e++) t[e] = r;
	return n;
}
var le = /* @__PURE__ */ E({
	blockSize: 16,
	nonceLength: 16
}, function(e, t, n = {}) {
	let r = !n.disablePadding;
	return {
		encrypt(n, i) {
			let a = H(e), { b: o, o: s, out: c } = oe(n, r, i), l = t, u = [a];
			O(l) || u.push(l = k(l));
			let d = y(l), f = d[0], p = d[1], m = d[2], h = d[3], g = 0;
			for (; g + 4 <= o.length;) f ^= o[g + 0], p ^= o[g + 1], m ^= o[g + 2], h ^= o[g + 3], {s0: f, s1: p, s2: m, s3: h} = re(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			if (r) {
				let e = ce(n.subarray(g * 4));
				f ^= e[0], p ^= e[1], m ^= e[2], h ^= e[3], {s0: f, s1: p, s2: m, s3: h} = re(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			}
			return b(...u), c;
		},
		decrypt(n, i) {
			ae(n);
			let a = ne(e), o = t, s = [a];
			O(o) || s.push(o = k(o));
			let c = y(o);
			i = D(n.length, i), O(n) || s.push(n = k(n)), C(n, i);
			let l = y(n), u = y(i), d = c[0], f = c[1], p = c[2], m = c[3];
			for (let e = 0; e + 4 <= l.length;) {
				let t = d, n = f, r = p, i = m;
				d = l[e + 0], f = l[e + 1], p = l[e + 2], m = l[e + 3];
				let { s0: o, s1: s, s2: c, s3: h } = ie(a, d, f, p, m);
				u[e++] = o ^ t, u[e++] = s ^ n, u[e++] = c ^ r, u[e++] = h ^ i;
			}
			return b(...s), se(i, r);
		}
	};
}), ue = (e) => Uint8Array.from(e.split(""), (e) => e.charCodeAt(0)), de = ue("expand 16-byte k"), fe = ue("expand 32-byte k"), pe = y(de), me = y(fe);
function G(e, t) {
	return e << t | e >>> 32 - t;
}
function he(e) {
	return e.byteOffset % 4 == 0;
}
var ge = 64, _e = 16, ve = 2 ** 32 - 1, ye = Uint32Array.of();
function be(e, t, n, r, i, a, o, s) {
	let c = i.length, l = new Uint8Array(ge), u = y(l), d = he(i) && he(a), f = d ? y(i) : ye, p = d ? y(a) : ye;
	for (let m = 0; m < c; o++) {
		if (e(t, n, r, u, o, s), o >= ve) throw Error("arx: counter overflow");
		let h = Math.min(ge, c - m);
		if (d && h === ge) {
			let e = m / 4;
			if (m % 4 != 0) throw Error("arx: invalid block position");
			for (let t = 0, n; t < _e; t++) n = e + t, p[n] = f[n] ^ u[t];
			m += ge;
		} else {
			for (let e = 0, t; e < h; e++) t = m + e, a[t] = i[t] ^ l[e];
			m += h;
		}
	}
}
function xe(e, t) {
	let { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: a, rounds: o } = w({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, t);
	if (typeof e != "function") throw Error("core must be a function");
	return g(i), g(o), h(a), h(n), (t, s, c, l, u = 0) => {
		_(t, void 0, "key"), _(s, void 0, "nonce"), _(c, void 0, "data");
		let d = c.length;
		if (l === void 0 && (l = new Uint8Array(d)), _(l, void 0, "output"), g(u), u < 0 || u >= ve) throw Error("arx: counter overflow");
		if (l.length < d) throw Error(`arx: output (${l.length}) is shorter than data (${d})`);
		let f = [], p = t.length, m, h;
		if (p === 32) f.push(m = k(t)), h = me;
		else if (p === 16 && n) m = /* @__PURE__ */ new Uint8Array(32), m.set(t), m.set(t, 16), h = pe, f.push(m);
		else throw _(t, 32, "arx key"), Error("invalid key size");
		he(s) || f.push(s = k(s));
		let v = y(m);
		if (r) {
			if (s.length !== 24) throw Error("arx: extended nonce must be 24 bytes");
			r(h, v, y(s.subarray(0, 16)), v), s = s.subarray(16);
		}
		let ee = 16 - i;
		if (ee !== s.length) throw Error(`arx: nonce must be ${ee} or 16 bytes`);
		if (ee !== 12) {
			let e = /* @__PURE__ */ new Uint8Array(12);
			e.set(s, a ? 0 : 12 - s.length), s = e, f.push(s);
		}
		let x = y(s);
		return be(e, h, v, x, c, l, u, o), b(...f), l;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/_poly1305.js
function K(e, t) {
	return e[t++] & 255 | (e[t++] & 255) << 8;
}
var Se = class {
	blockLen = 16;
	outputLen = 16;
	buffer = /* @__PURE__ */ new Uint8Array(16);
	r = /* @__PURE__ */ new Uint16Array(10);
	h = /* @__PURE__ */ new Uint16Array(10);
	pad = /* @__PURE__ */ new Uint16Array(8);
	pos = 0;
	finished = !1;
	constructor(e) {
		e = k(_(e, 32, "key"));
		let t = K(e, 0), n = K(e, 2), r = K(e, 4), i = K(e, 6), a = K(e, 8), o = K(e, 10), s = K(e, 12), c = K(e, 14);
		this.r[0] = t & 8191, this.r[1] = (t >>> 13 | n << 3) & 8191, this.r[2] = (n >>> 10 | r << 6) & 7939, this.r[3] = (r >>> 7 | i << 9) & 8191, this.r[4] = (i >>> 4 | a << 12) & 255, this.r[5] = a >>> 1 & 8190, this.r[6] = (a >>> 14 | o << 2) & 8191, this.r[7] = (o >>> 11 | s << 5) & 8065, this.r[8] = (s >>> 8 | c << 8) & 8191, this.r[9] = c >>> 5 & 127;
		for (let t = 0; t < 8; t++) this.pad[t] = K(e, 16 + 2 * t);
	}
	process(e, t, n = !1) {
		let r = n ? 0 : 2048, { h: i, r: a } = this, o = a[0], s = a[1], c = a[2], l = a[3], u = a[4], d = a[5], f = a[6], p = a[7], m = a[8], h = a[9], g = K(e, t + 0), _ = K(e, t + 2), v = K(e, t + 4), ee = K(e, t + 6), y = K(e, t + 8), b = K(e, t + 10), x = K(e, t + 12), S = K(e, t + 14), C = i[0] + (g & 8191), w = i[1] + ((g >>> 13 | _ << 3) & 8191), T = i[2] + ((_ >>> 10 | v << 6) & 8191), E = i[3] + ((v >>> 7 | ee << 9) & 8191), D = i[4] + ((ee >>> 4 | y << 12) & 8191), O = i[5] + (y >>> 1 & 8191), k = i[6] + ((y >>> 14 | b << 2) & 8191), A = i[7] + ((b >>> 11 | x << 5) & 8191), j = i[8] + ((x >>> 8 | S << 8) & 8191), M = i[9] + (S >>> 5 | r), N = 0, P = N + C * o + 5 * h * w + 5 * m * T + 5 * p * E + 5 * f * D;
		N = P >>> 13, P &= 8191, P += 5 * d * O + 5 * u * k + 5 * l * A + 5 * c * j + 5 * s * M, N += P >>> 13, P &= 8191;
		let F = N + C * s + w * o + 5 * h * T + 5 * m * E + 5 * p * D;
		N = F >>> 13, F &= 8191, F += 5 * f * O + 5 * d * k + 5 * u * A + 5 * l * j + 5 * c * M, N += F >>> 13, F &= 8191;
		let I = N + C * c + w * s + T * o + 5 * h * E + 5 * m * D;
		N = I >>> 13, I &= 8191, I += 5 * p * O + 5 * f * k + 5 * d * A + 5 * u * j + 5 * l * M, N += I >>> 13, I &= 8191;
		let L = N + C * l + w * c + T * s + E * o + 5 * h * D;
		N = L >>> 13, L &= 8191, L += 5 * m * O + 5 * p * k + 5 * f * A + 5 * d * j + 5 * u * M, N += L >>> 13, L &= 8191;
		let R = N + C * u + w * l + T * c + E * s + D * o;
		N = R >>> 13, R &= 8191, R += 5 * h * O + 5 * m * k + 5 * p * A + 5 * f * j + 5 * d * M, N += R >>> 13, R &= 8191;
		let z = N + C * d + w * u + T * l + E * c + D * s;
		N = z >>> 13, z &= 8191, z += O * o + 5 * h * k + 5 * m * A + 5 * p * j + 5 * f * M, N += z >>> 13, z &= 8191;
		let B = N + C * f + w * d + T * u + E * l + D * c;
		N = B >>> 13, B &= 8191, B += O * s + k * o + 5 * h * A + 5 * m * j + 5 * p * M, N += B >>> 13, B &= 8191;
		let V = N + C * p + w * f + T * d + E * u + D * l;
		N = V >>> 13, V &= 8191, V += O * c + k * s + A * o + 5 * h * j + 5 * m * M, N += V >>> 13, V &= 8191;
		let te = N + C * m + w * p + T * f + E * d + D * u;
		N = te >>> 13, te &= 8191, te += O * l + k * c + A * s + j * o + 5 * h * M, N += te >>> 13, te &= 8191;
		let H = N + C * h + w * m + T * p + E * f + D * d;
		N = H >>> 13, H &= 8191, H += O * u + k * l + A * c + j * s + M * o, N += H >>> 13, H &= 8191, N = (N << 2) + N | 0, N = N + P | 0, P = N & 8191, N >>>= 13, F += N, i[0] = P, i[1] = F, i[2] = I, i[3] = L, i[4] = R, i[5] = z, i[6] = B, i[7] = V, i[8] = te, i[9] = H;
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
		b(n);
	}
	update(e) {
		v(this), _(e), e = k(e);
		let { buffer: t, blockLen: n } = this, r = e.length;
		for (let i = 0; i < r;) {
			let a = Math.min(n - this.pos, r - i);
			if (a === n) for (; n <= r - i; i += n) this.process(e, i);
			else t.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === n && (this.process(t, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		b(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		v(this), ee(e, this), this.finished = !0;
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
function Ce(e) {
	let t = (t, n) => e(n).update(t).digest(), n = e(/* @__PURE__ */ new Uint8Array(32));
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
}
Ce((e) => new Se(e));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/chacha.js
function we(e, t, n, r, i, a = 20) {
	let o = e[0], s = e[1], c = e[2], l = e[3], u = t[0], d = t[1], f = t[2], p = t[3], m = t[4], h = t[5], g = t[6], _ = t[7], v = i, ee = n[0], y = n[1], b = n[2], x = o, S = s, C = c, w = l, T = u, E = d, D = f, O = p, k = m, A = h, j = g, M = _, N = v, P = ee, F = y, I = b;
	for (let e = 0; e < a; e += 2) x = x + T | 0, N = G(N ^ x, 16), k = k + N | 0, T = G(T ^ k, 12), x = x + T | 0, N = G(N ^ x, 8), k = k + N | 0, T = G(T ^ k, 7), S = S + E | 0, P = G(P ^ S, 16), A = A + P | 0, E = G(E ^ A, 12), S = S + E | 0, P = G(P ^ S, 8), A = A + P | 0, E = G(E ^ A, 7), C = C + D | 0, F = G(F ^ C, 16), j = j + F | 0, D = G(D ^ j, 12), C = C + D | 0, F = G(F ^ C, 8), j = j + F | 0, D = G(D ^ j, 7), w = w + O | 0, I = G(I ^ w, 16), M = M + I | 0, O = G(O ^ M, 12), w = w + O | 0, I = G(I ^ w, 8), M = M + I | 0, O = G(O ^ M, 7), x = x + E | 0, I = G(I ^ x, 16), j = j + I | 0, E = G(E ^ j, 12), x = x + E | 0, I = G(I ^ x, 8), j = j + I | 0, E = G(E ^ j, 7), S = S + D | 0, N = G(N ^ S, 16), M = M + N | 0, D = G(D ^ M, 12), S = S + D | 0, N = G(N ^ S, 8), M = M + N | 0, D = G(D ^ M, 7), C = C + O | 0, P = G(P ^ C, 16), k = k + P | 0, O = G(O ^ k, 12), C = C + O | 0, P = G(P ^ C, 8), k = k + P | 0, O = G(O ^ k, 7), w = w + T | 0, F = G(F ^ w, 16), A = A + F | 0, T = G(T ^ A, 12), w = w + T | 0, F = G(F ^ w, 8), A = A + F | 0, T = G(T ^ A, 7);
	let L = 0;
	r[L++] = o + x | 0, r[L++] = s + S | 0, r[L++] = c + C | 0, r[L++] = l + w | 0, r[L++] = u + T | 0, r[L++] = d + E | 0, r[L++] = f + D | 0, r[L++] = p + O | 0, r[L++] = m + k | 0, r[L++] = h + A | 0, r[L++] = g + j | 0, r[L++] = _ + M | 0, r[L++] = v + N | 0, r[L++] = ee + P | 0, r[L++] = y + F | 0, r[L++] = b + I | 0;
}
var Te = /* @__PURE__ */ xe(we, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hkdf.js
function Ee(n, r, i) {
	return t(n), i === void 0 && (i = new Uint8Array(n.outputLen)), e(n, i, r);
}
var De = /* @__PURE__ */ Uint8Array.of(0), Oe = /* @__PURE__ */ Uint8Array.of();
function ke(r, i, o, s = 32) {
	t(r), a(s, "length");
	let c = r.outputLen;
	if (s > 255 * c) throw Error("Length must be <= 255*HashLen");
	let l = Math.ceil(s / c);
	o === void 0 ? o = Oe : d(o, void 0, "info");
	let u = new Uint8Array(l * c), f = e.create(r, i), p = f._cloneInto(), m = new Uint8Array(f.outputLen);
	for (let e = 0; e < l; e++) De[0] = e + 1, p.update(e === 0 ? Oe : m).update(o).update(De).digestInto(m), u.set(m, c * e), f._cloneInto(p);
	return f.destroy(), p.destroy(), n(m, De), u.slice(0, s);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/index.js
var Ae = Object.defineProperty, q = (e, t) => {
	for (var n in t) Ae(e, n, {
		get: t[n],
		enumerable: !0
	});
}, je = {};
q(je, {
	binarySearch: () => Fe,
	bytesToHex: () => p,
	hexToBytes: () => l,
	insertEventIntoAscendingList: () => Pe,
	insertEventIntoDescendingList: () => Ne,
	isHex32: () => X,
	mergeReverseSortedLists: () => Ie,
	normalizeURL: () => Me,
	utf8Decoder: () => J,
	utf8Encoder: () => Y
});
var J = new TextDecoder("utf-8"), Y = new TextEncoder();
function Me(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function Ne(e, t) {
	let [n, r] = Fe(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : e.created_at - t.created_at);
	return r || e.splice(n, 0, t), e;
}
function Pe(e, t) {
	let [n, r] = Fe(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : t.created_at - e.created_at);
	return r || e.splice(n, 0, t), e;
}
function Fe(e, t) {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = t(e[i]);
		if (a === 0) return [i, !0];
		a < 0 ? r = i - 1 : n = i + 1;
	}
	return [n, !1];
}
function Ie(e, t) {
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
function X(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var Le = Symbol("verified"), Re = (e) => e instanceof Object;
function ze(e) {
	if (!Re(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !X(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var Be = class {
	generateSecretKey() {
		return u.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return p(u.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = p(u.getPublicKey(t)), n.id = He(n), n.sig = p(u.sign(l(He(n)), t)), n[Le] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[Le] == "boolean") return e[Le];
		try {
			let t = He(e);
			if (t !== e.id) return e[Le] = !1, !1;
			let n = u.verify(l(e.sig), l(t), l(e.pubkey));
			return e[Le] = n, n;
		} catch {
			return e[Le] = !1, !1;
		}
	}
};
function Ve(e) {
	if (!ze(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function He(e) {
	let t = c(Y.encode(Ve(e)));
	return p(t);
}
var Ue = new Be(), We = Ue.generateSecretKey, Ge = Ue.getPublicKey, Z = Ue.finalizeEvent, Ke = Ue.verifyEvent, qe = {};
q(qe, {
	AIEmbeddings: () => rn,
	AppCurationSet: () => Hr,
	Application: () => Br,
	AuthoredPodcasts: () => ir,
	BadgeAward: () => ct,
	BadgeDefinition: () => Or,
	Bid: () => jt,
	BidConfirmation: () => Mt,
	BlobsAuth: () => vr,
	BlockedRelaysList: () => Bn,
	BlossomServerList: () => $n,
	BookmarkList: () => Ln,
	Bookmarksets: () => Cr,
	Calendar: () => ai,
	CalendarEventRSVP: () => oi,
	CashuMintAnnouncement: () => _i,
	CashuWalletEvent: () => fr,
	CashuWalletHistory: () => gn,
	CashuWalletTokens: () => hn,
	ChannelCreation: () => St,
	ChannelHideMessage: () => Tt,
	ChannelMessage: () => wt,
	ChannelMetadata: () => Ct,
	ChannelMuteUser: () => Et,
	ChatMessage: () => lt,
	Chess: () => Ot,
	ClassifiedListing: () => Jr,
	ClientAuth: () => mr,
	CodeSnippet: () => Ht,
	CoinjoinPool: () => sn,
	Comment: () => Lt,
	CommunitiesList: () => Rn,
	CommunityDefinition: () => pi,
	CommunityPostApproval: () => un,
	ConferenceEvent: () => Gr,
	Contacts: () => rt,
	CreateOrUpdateProduct: () => jr,
	CreateOrUpdateStall: () => Ar,
	CuratedVideoSets: () => Tr,
	Curationsets: () => wr,
	Date: () => ri,
	DecoupledEncryptionKeyDistribution: () => ln,
	DecoupledKeyAnnouncement: () => Xn,
	DecoupledKeyClientAnnouncement: () => cn,
	DirectMessageRelaysList: () => Zn,
	DraftClassifiedListing: () => Yr,
	DraftEvent: () => ei,
	DraftLong: () => Fr,
	Emojisets: () => Ir,
	EncryptedDirectMessage: () => it,
	EventDeletion: () => at,
	FavoriteFollowSets: () => Jn,
	FavoritePodcasts: () => Qn,
	FavoriteRelays: () => Un,
	FedimintAnnouncement: () => vi,
	Feed: () => ni,
	FileMessage: () => ht,
	FileMetadata: () => Ft,
	FileServerPreference: () => er,
	Followsets: () => br,
	ForumThread: () => dt,
	GenericRepost: () => gt,
	Genericlists: () => xr,
	GeocacheListing: () => hi,
	GeocacheLog: () => _n,
	GeocacheLogEntry: () => gi,
	GeocacheProofOfFind: () => vn,
	GiftWrap: () => Pt,
	GitPullRequest: () => Wt,
	GitPullRequestUpdate: () => Gt,
	GoodWikiAuthorList: () => tr,
	GoodWikiRelayList: () => nr,
	GroupMetadata: () => bi,
	HTTPAuth: () => yr,
	Handlerinformation: () => li,
	Handlerrecommendation: () => ci,
	Highlights: () => Nn,
	InteractiveRoom: () => Wr,
	InterestsList: () => Gn,
	Interestsets: () => kr,
	Issue: () => Kt,
	JobFeedback: () => pn,
	JobRequest: () => dn,
	JobResult: () => fn,
	Label: () => tn,
	LegacyNsiteFile: () => di,
	LightningPubRPC: () => pr,
	LinkSet: () => ti,
	LiveChatMessage: () => Vt,
	LiveEvent: () => Ur,
	LongFormArticle: () => Pr,
	MarketplaceUI: () => Mr,
	MediaFollows: () => qn,
	MediaStarterPacks: () => Ei,
	MergeRequests: () => kt,
	Metadata: () => et,
	ModularArticleContent: () => Rr,
	ModularArticleHeader: () => Lr,
	MuteSets: () => Er,
	Mutelist: () => Pn,
	NWCWalletInfo: () => ur,
	NWCWalletRequest: () => hr,
	NWCWalletResponse: () => gr,
	NormalVideo: () => yt,
	NostrConnect: () => _r,
	NsiteNamed: () => mi,
	NsiteRoot: () => dr,
	NutZap: () => kn,
	NutZapInfo: () => Kn,
	OpenTimestamps: () => Nt,
	Patch: () => Ut,
	PeerToPeerOrderEvents: () => yi,
	Photo: () => vt,
	Pinlist: () => Fn,
	PodcastEpisode: () => Dt,
	PodcastMetadata: () => rr,
	Poll: () => It,
	PollResponse: () => At,
	PrivateDirectMessage: () => mt,
	PrivateEventRelayList: () => Wn,
	ProblemTracker: () => Qt,
	ProductSoldAsAuction: () => Nr,
	ProfileBadges: () => Dr,
	ProxyAnnouncement: () => cr,
	PublicChatsList: () => zn,
	PublicMessage: () => xt,
	Reaction: () => st,
	ReactionToWebsite: () => _t,
	RecommendRelay: () => nt,
	Redirects: () => $r,
	RelayDiscovery: () => Vr,
	RelayList: () => In,
	RelayMonitorAnnouncement: () => ar,
	RelayReview: () => si,
	RelayReviews: () => nn,
	Relaysets: () => Sr,
	ReleaseArtifactSets: () => zr,
	Reply: () => qt,
	Report: () => $t,
	Reporting: () => en,
	RepositoryAnnouncement: () => Xr,
	RepositoryState: () => Zr,
	Repost: () => ot,
	ReservedCashuWalletTokens: () => mn,
	RoomPresence: () => or,
	Scroll: () => zt,
	Seal: () => pt,
	SearchRelaysList: () => Vn,
	ShortTextNote: () => tt,
	ShortVideo: () => bt,
	SimpleGroupAdmins: () => xi,
	SimpleGroupCreateGroup: () => Cn,
	SimpleGroupCreateInvite: () => Tn,
	SimpleGroupDeleteEvent: () => Sn,
	SimpleGroupDeleteGroup: () => wn,
	SimpleGroupEditMetadata: () => xn,
	SimpleGroupJoinRequest: () => En,
	SimpleGroupLeaveRequest: () => Dn,
	SimpleGroupList: () => Hn,
	SimpleGroupLiveKitParticipants: () => wi,
	SimpleGroupMembers: () => Si,
	SimpleGroupPutUser: () => yn,
	SimpleGroupRemoveUser: () => bn,
	SimpleGroupReply: () => ft,
	SimpleGroupRoles: () => Ci,
	SimpleGroupThreadedReply: () => ut,
	SlideSet: () => qr,
	SoftwareApplication: () => ui,
	StarterPacks: () => Ti,
	StatusApplied: () => Yt,
	StatusClosed: () => Xt,
	StatusDraft: () => Zt,
	StatusOpen: () => Jt,
	TidalLogin: () => An,
	Time: () => ii,
	Torrent: () => an,
	TorrentComment: () => on,
	TransportMethodAnnouncement: () => lr,
	UserEmojiList: () => Yn,
	UserGraspList: () => sr,
	UserStatuses: () => Kr,
	VideoViewEvent: () => fi,
	Voice: () => Rt,
	VoiceComment: () => Bt,
	WebBookmarks: () => Di,
	WikiArticle: () => Qr,
	Zap: () => Mn,
	ZapGoal: () => On,
	ZapRequest: () => jn,
	classifyKind: () => Qe,
	isAddressableKind: () => Ze,
	isEphemeralKind: () => Xe,
	isKind: () => $e,
	isRegularKind: () => Je,
	isReplaceableKind: () => Ye
});
function Je(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function Ye(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function Xe(e) {
	return 2e4 <= e && e < 3e4;
}
function Ze(e) {
	return 3e4 <= e && e < 4e4;
}
function Qe(e) {
	return Je(e) ? "regular" : Ye(e) ? "replaceable" : Xe(e) ? "ephemeral" : Ze(e) ? "parameterized" : "unknown";
}
function $e(e, t) {
	let n = t instanceof Array ? t : [t];
	return ze(e) && n.includes(e.kind) || !1;
}
var et = 0, tt = 1, nt = 2, rt = 3, it = 4, at = 5, ot = 6, st = 7, ct = 8, lt = 9, ut = 10, dt = 11, ft = 12, pt = 13, mt = 14, ht = 15, gt = 16, _t = 17, vt = 20, yt = 21, bt = 22, xt = 24, St = 40, Ct = 41, wt = 42, Tt = 43, Et = 44, Dt = 54, Ot = 64, kt = 818, At = 1018, jt = 1021, Mt = 1022, Nt = 1040, Pt = 1059, Ft = 1063, It = 1068, Lt = 1111, Rt = 1222, zt = 1227, Bt = 1244, Vt = 1311, Ht = 1337, Ut = 1617, Wt = 1618, Gt = 1619, Kt = 1621, qt = 1622, Jt = 1630, Yt = 1631, Xt = 1632, Zt = 1633, Qt = 1971, $t = 1984, en = 1984, tn = 1985, nn = 1986, rn = 1987, an = 2003, on = 2004, sn = 2022, cn = 4454, ln = 4455, un = 4550, dn = 5999, fn = 6999, pn = 7e3, mn = 7374, hn = 7375, gn = 7376, _n = 7516, vn = 7517, yn = 9e3, bn = 9001, xn = 9002, Sn = 9005, Cn = 9007, wn = 9008, Tn = 9009, En = 9021, Dn = 9022, On = 9041, kn = 9321, An = 9467, jn = 9734, Mn = 9735, Nn = 9802, Pn = 1e4, Fn = 10001, In = 10002, Ln = 10003, Rn = 10004, zn = 10005, Bn = 10006, Vn = 10007, Hn = 10009, Un = 10012, Wn = 10013, Gn = 10015, Kn = 10019, qn = 10020, Jn = 10021, Yn = 10030, Xn = 10044, Zn = 10050, Qn = 10054, $n = 10063, er = 10096, tr = 10101, nr = 10102, rr = 10154, ir = 10164, ar = 10166, or = 10312, sr = 10317, cr = 10377, lr = 11111, ur = 13194, dr = 15128, fr = 17375, pr = 21e3, mr = 22242, hr = 23194, gr = 23195, _r = 24133, vr = 24242, yr = 27235, br = 3e4, xr = 30001, Sr = 30002, Cr = 30003, wr = 30004, Tr = 30005, Er = 30007, Dr = 30008, Or = 30009, kr = 30015, Ar = 30017, jr = 30018, Mr = 30019, Nr = 30020, Pr = 30023, Fr = 30024, Ir = 30030, Lr = 30040, Rr = 30041, zr = 30063, Br = 30078, Vr = 30166, Hr = 30267, Ur = 30311, Wr = 30312, Gr = 30313, Kr = 30315, qr = 30388, Jr = 30402, Yr = 30403, Xr = 30617, Zr = 30618, Qr = 30818, $r = 30819, ei = 31234, ti = 31388, ni = 31890, ri = 31922, ii = 31923, ai = 31924, oi = 31925, si = 31987, ci = 31989, li = 31990, ui = 32267, di = 34128, fi = 34237, pi = 34550, mi = 35128, hi = 37515, gi = 37516, _i = 38172, vi = 38173, yi = 38383, bi = 39e3, xi = 39001, Si = 39002, Ci = 39003, wi = 39004, Ti = 39089, Ei = 39092, Di = 39701;
function Oi(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find(([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1)) return !1;
	}
	return !(e.since && t.created_at < e.since || e.until && t.created_at > e.until);
}
q({}, {
	getHex64: () => ki,
	getInt: () => Ai,
	getSubscriptionId: () => ji,
	matchEventId: () => Mi,
	matchEventKind: () => Pi,
	matchEventPubkey: () => Ni
});
function ki(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function Ai(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function ji(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function Mi(e, t) {
	return t === ki(e, "id");
}
function Ni(e, t) {
	return t === ki(e, "pubkey");
}
function Pi(e, t) {
	return t === Ai(e, "kind");
}
q({}, { makeAuthEvent: () => Fi });
function Fi(e, t) {
	return {
		kind: mr,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
new TextEncoder();
var Ii = {};
q(Ii, {
	BECH32_REGEX: () => zi,
	Bech32MaxSize: () => Ri,
	NostrTypeGuard: () => Li,
	decode: () => Hi,
	decodeNostrURI: () => Vi,
	encodeBytes: () => Ji,
	naddrEncode: () => Zi,
	neventEncode: () => Xi,
	noteEncode: () => Ki,
	nprofileEncode: () => Yi,
	npubEncode: () => Gi,
	nsecEncode: () => Wi
});
var Li = {
	isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
	isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
	isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
	isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
	isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
	isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
	isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Ri = 5e3, zi = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Bi(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function Vi(e) {
	try {
		return e.startsWith("nostr:") && (e = e.substring(6)), Hi(e);
	} catch {
		return {
			type: "invalid",
			data: null
		};
	}
}
function Hi(e) {
	let { prefix: t, words: n } = s.decode(e, Ri), r = new Uint8Array(s.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = Ui(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nprofile");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: p(e[0][0]),
					relays: e[1] ? e[1].map((e) => J.decode(e)) : []
				}
			};
		}
		case "nevent": {
			let e = Ui(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nevent");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			if (e[2] && e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (e[3] && e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "nevent",
				data: {
					id: p(e[0][0]),
					relays: e[1] ? e[1].map((e) => J.decode(e)) : [],
					author: e[2]?.[0] ? p(e[2][0]) : void 0,
					kind: e[3]?.[0] ? parseInt(p(e[3][0]), 16) : void 0
				}
			};
		}
		case "naddr": {
			let e = Ui(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for naddr");
			if (!e[2]?.[0]) throw Error("missing TLV 2 for naddr");
			if (e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (!e[3]?.[0]) throw Error("missing TLV 3 for naddr");
			if (e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: J.decode(e[0][0]),
					pubkey: p(e[2][0]),
					kind: parseInt(p(e[3][0]), 16),
					relays: e[1] ? e[1].map((e) => J.decode(e)) : []
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
function Ui(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		if (n.length < 2) throw Error("not enough data to read TLV");
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		if (n = n.slice(2 + r), i.length < r) throw Error(`not enough data to read on TLV ${e}`);
		t[e] = t[e] || [], t[e].push(i);
	}
	return t;
}
function Wi(e) {
	return Ji("nsec", e);
}
function Gi(e) {
	return Ji("npub", l(e));
}
function Ki(e) {
	return Ji("note", l(e));
}
function qi(e, t) {
	let n = s.toWords(t);
	return s.encode(e, n, Ri);
}
function Ji(e, t) {
	return qi(e, t);
}
function Yi(e) {
	return qi("nprofile", Qi({
		0: [l(e.pubkey)],
		1: (e.relays || []).map((e) => Y.encode(e))
	}));
}
function Xi(e) {
	let t;
	return e.kind !== void 0 && (t = Bi(e.kind)), qi("nevent", Qi({
		0: [l(e.id)],
		1: (e.relays || []).map((e) => Y.encode(e)),
		2: e.author ? [l(e.author)] : [],
		3: t ? [new Uint8Array(t)] : []
	}));
}
function Zi(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	return new DataView(t).setUint32(0, e.kind, !1), qi("naddr", Qi({
		0: [Y.encode(e.identifier)],
		1: (e.relays || []).map((e) => Y.encode(e)),
		2: [l(e.pubkey)],
		3: [new Uint8Array(t)]
	}));
}
function Qi(e) {
	let t = [];
	return Object.entries(e).reverse().forEach(([e, n]) => {
		n.forEach((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		});
	}), r(...t);
}
q({}, {
	decrypt: () => ea,
	encrypt: () => $i
});
function $i(e, t, n) {
	let r = e instanceof Uint8Array ? e : l(e), a = ta(i.getSharedSecret(r, l("02" + t))), s = Uint8Array.from(o(16)), c = Y.encode(n), u = le(a, s).encrypt(c);
	return `${f.encode(new Uint8Array(u))}?iv=${f.encode(new Uint8Array(s.buffer))}`;
}
function ea(e, t, n) {
	let r = e instanceof Uint8Array ? e : l(e), [a, o] = n.split("?iv="), s = ta(i.getSharedSecret(r, l("02" + t))), c = f.decode(o), u = f.decode(a), d = le(s, c).decrypt(u);
	return J.decode(d);
}
function ta(e) {
	return e.slice(1, 33);
}
q({}, {
	NIP05_REGEX: () => na,
	isNip05: () => ra,
	isValid: () => ca,
	queryProfile: () => sa,
	searchDomain: () => oa,
	useFetchImplementation: () => aa
});
var na = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, ra = (e) => na.test(e || ""), ia;
try {
	ia = fetch;
} catch {}
function aa(e) {
	ia = e;
}
async function oa(e, t = "") {
	try {
		let n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await ia(n, { redirect: "manual" });
		if (r.status !== 200) throw Error("Wrong response code");
		return (await r.json()).names;
	} catch {
		return {};
	}
}
async function sa(e) {
	let t = e.match(na);
	if (!t) return null;
	let [, n = "_", r] = t;
	try {
		let e = `https://${r}/.well-known/nostr.json?name=${n}`, t = await ia(e, { redirect: "manual" });
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
async function ca(e, t) {
	let n = await sa(t);
	return n ? n.pubkey === e : !1;
}
q({}, { parse: () => la });
function la(e) {
	let t = {
		reply: void 0,
		root: void 0,
		mentions: [],
		profiles: [],
		quotes: []
	}, n, r;
	for (let i = e.tags.length - 1; i >= 0; i--) {
		let a = e.tags[i];
		if (a[0] === "e" && a[1] && X(a[1])) {
			let [e, i, o, s, c] = a, l = {
				id: i,
				relays: o ? [o] : [],
				author: c && X(c) ? c : void 0
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
			if (a[0] === "q" && a[1] && X(a[1])) {
				let [e, n, r] = a;
				t.quotes.push({
					id: n,
					relays: r ? [r] : []
				});
			}
			a[0] === "p" && a[1] && X(a[1]) && t.profiles.push({
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
q({}, {
	fetchRelayInformation: () => da,
	useFetchImplementation: () => ua
});
function ua(e) {}
async function da(e) {
	return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
q({}, {
	getPow: () => fa,
	minePow: () => ma
});
function fa(e) {
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
function pa(e) {
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
function ma(e, t) {
	let n = 0, r = e, i = [
		"nonce",
		n.toString(),
		t.toString()
	];
	for (r.tags.push(i);;) {
		let e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
		e !== r.created_at && (n = 0, r.created_at = e), i[1] = (++n).toString();
		let a = c(Y.encode(JSON.stringify([
			0,
			r.pubkey,
			r.created_at,
			r.kind,
			r.tags,
			r.content
		])));
		if (pa(a) >= t) {
			r.id = p(a);
			break;
		}
	}
	return r;
}
q({}, {
	unwrapEvent: () => qa,
	unwrapManyEvents: () => Ja,
	wrapEvent: () => Ga,
	wrapManyEvents: () => Ka
}), q({}, {
	createRumor: () => La,
	createSeal: () => Ra,
	createWrap: () => za,
	unwrapEvent: () => Ha,
	unwrapManyEvents: () => Ua,
	wrapEvent: () => Ba,
	wrapManyEvents: () => Va
});
var ha = {};
q(ha, {
	decrypt: () => ka,
	encrypt: () => Oa,
	getConversationKey: () => ya,
	v2: () => Aa
});
var ga = 1, _a = 4294967295, va = 65536;
function ya(e, t) {
	let n = i.getSharedSecret(e, l("02" + t)).subarray(1, 33);
	return Ee(c, n, Y.encode("nip44-v2"));
}
function ba(e, t) {
	let n = ke(c, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function xa(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 2 ** (Math.floor(Math.log2(e - 1)) + 1), n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function Sa(e) {
	if (!Number.isSafeInteger(e) || e < ga || e > 65535) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
	let t = /* @__PURE__ */ new Uint8Array(2);
	return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function Ca(e) {
	if (!Number.isSafeInteger(e) || e < va || e > _a) throw Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
	let t = /* @__PURE__ */ new Uint8Array(4);
	return new DataView(t.buffer).setUint32(0, e, !1), t;
}
function wa(e) {
	let t = Y.encode(e), n = t.length;
	if (n < ga || n > _a) throw Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
	let i = n >= va ? r(new Uint8Array([0, 0]), Ca(n)) : Sa(n), a = new Uint8Array(xa(n) - n);
	return r(i, t, a);
}
function Ta(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = t.getUint16(0), r, i;
	if (n === 0) {
		if (r = t.getUint32(2), r < va) throw Error("invalid padding");
		i = 6;
	} else r = n, i = 2;
	let a = e.subarray(i, i + r);
	if (r < ga || r > _a || a.length !== r || e.length !== i + xa(r)) throw Error("invalid padding");
	return J.decode(a);
}
function Ea(t, n, i) {
	if (i.length !== 32) throw Error("AAD associated data must be 32 bytes");
	let a = r(i, n);
	return e(c, t, a);
}
function Da(e) {
	if (typeof e != "string") throw Error("payload must be a valid string");
	let t = e.length;
	if (t < 132) throw Error("invalid payload length: " + t);
	if (e[0] === "#") throw Error("unknown encryption version");
	let n;
	try {
		n = f.decode(e);
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
function Oa(e, t, n = o(32)) {
	let { chacha_key: i, chacha_nonce: a, hmac_key: s } = ba(t, n), c = Te(i, a, wa(e)), l = Ea(s, c, n);
	return f.encode(r(new Uint8Array([2]), n, c, l));
}
function ka(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = Da(e), { chacha_key: a, chacha_nonce: o, hmac_key: s } = ba(t, n);
	if (!T(Ea(s, r, n), i)) throw Error("invalid MAC");
	return Ta(Te(a, o, r));
}
var Aa = {
	utils: {
		getConversationKey: ya,
		calcPaddedLen: xa,
		pad: wa,
		unpad: Ta
	},
	encrypt: Oa,
	decrypt: ka
}, ja = 172800, Ma = () => Math.round(Date.now() / 1e3), Na = () => Math.round(Ma() - Math.random() * ja), Pa = (e, t) => ya(e, t), Fa = (e, t, n) => Oa(JSON.stringify(e), Pa(t, n)), Ia = (e, t) => JSON.parse(ka(e.content, Pa(t, e.pubkey)));
function La(e, t) {
	let n = {
		created_at: Ma(),
		content: "",
		tags: [],
		...e,
		pubkey: Ge(t)
	};
	return n.id = He(n), n;
}
function Ra(e, t, n) {
	return Z({
		kind: pt,
		content: Fa(e, t, n),
		created_at: Na(),
		tags: []
	}, t);
}
function za(e, t) {
	let n = We();
	return Z({
		kind: Pt,
		content: Fa(e, n, t),
		created_at: Na(),
		tags: [["p", t]]
	}, n);
}
function Ba(e, t, n) {
	return za(Ra(La(e, t), t, n), n);
}
function Va(e, t, n) {
	if (!n || n.length === 0) throw Error("At least one recipient is required.");
	let r = [Ba(e, t, Ge(t))];
	return n.forEach((n) => {
		r.push(Ba(e, t, n));
	}), r;
}
function Ha(e, t) {
	if (e.kind !== Pt) throw Error(`unexpected wrap kind ${e.kind}, expected ${Pt}`);
	let n = Ia(e, t);
	if (n.kind !== pt) throw Error(`unexpected seal kind ${n.kind}, expected ${pt}`);
	if (!Ke(n)) throw Error("seal signature is invalid");
	let r = Ia(n, t);
	if (r.pubkey !== n.pubkey) throw Error(`rumor pubkey ${r.pubkey} does not match seal pubkey ${n.pubkey}`);
	return r;
}
function Ua(e, t) {
	let n = [];
	return e.forEach((e) => {
		try {
			n.push(Ha(e, t));
		} catch {}
	}), n.sort((e, t) => e.created_at - t.created_at), n;
}
function Wa(e, t, n, r) {
	let i = {
		created_at: Math.ceil(Date.now() / 1e3),
		kind: mt,
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
function Ga(e, t, n, r, i) {
	return Ba(Wa(t, n, r, i), e, t.publicKey);
}
function Ka(e, t, n, r, i) {
	if (!t || t.length === 0) throw Error("At least one recipient is required.");
	return [{ publicKey: Ge(e) }, ...t].map((t) => Ga(e, t, n, r, i));
}
var qa = Ha, Ja = Ua;
q({}, {
	finishRepostEvent: () => Ya,
	getRepostedEvent: () => Za,
	getRepostedEventPointer: () => Xa
});
function Ya(e, t, n, r) {
	let i, a = [
		...e.tags ?? [],
		[
			"e",
			t.id,
			n
		],
		["p", t.pubkey]
	];
	return t.kind === tt ? i = ot : (i = gt, a.push(["k", String(t.kind)])), Z({
		kind: i,
		tags: a,
		content: e.content === "" || t.tags?.find((e) => e[0] === "-") ? "" : JSON.stringify(t),
		created_at: e.created_at
	}, r);
}
function Xa(e) {
	if (![ot, gt].includes(e.kind)) return;
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
function Za(e, { skipVerification: t } = {}) {
	let n = Xa(e);
	if (n === void 0 || e.content === "") return;
	let r;
	try {
		r = JSON.parse(e.content);
	} catch {
		return;
	}
	if (r.id === n.id && (t || Ke(r))) return r;
}
q({}, {
	NOSTR_URI_REGEX: () => Qa,
	parse: () => eo,
	test: () => $a
});
var Qa = RegExp(`nostr:(${zi.source})`);
function $a(e) {
	return typeof e == "string" && RegExp(`^${Qa.source}$`).test(e);
}
function eo(e) {
	let t = e.match(RegExp(`^${Qa.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: Hi(t[1])
	};
}
q({}, { parse: () => so });
function to(e) {
	if (e) return /^\d+$/.test(e) ? parseInt(e, 10) : e;
}
function no(e, t) {
	let n = e.indexOf(":"), r = e.indexOf(":", n + 1);
	if (n === -1 || r === -1) return;
	let i = parseInt(e.slice(0, n), 10);
	if (Number.isNaN(i)) return;
	let a = e.slice(n + 1, r);
	if (X(a)) return {
		kind: i,
		pubkey: a,
		identifier: e.slice(r + 1),
		relays: t ? [t] : []
	};
}
function ro(e) {
	switch (e[0]) {
		case "E":
		case "e": return !e[1] || !X(e[1]) ? void 0 : {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && X(e[3]) ? e[3] : void 0
		};
		case "A":
		case "a": return e[1] ? no(e[1], e[2]) : void 0;
		case "I":
		case "i": return e[1] ? {
			value: e[1],
			hint: e[2]
		} : void 0;
	}
}
function io(e) {
	if (e[1]) {
		if (e[1].includes(":")) return no(e[1], e[2]);
		if (X(e[1])) return {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && X(e[3]) ? e[3] : void 0
		};
	}
}
function ao(e) {
	return e.findLast((e) => e.tagName === "A" || e.tagName === "a")?.pointer || e.findLast((e) => e.tagName === "I" || e.tagName === "i")?.pointer || e.findLast((e) => e.tagName === "E" || e.tagName === "e")?.pointer;
}
function oo(e, t) {
	if (!e || !("id" in e) || !e.author) return;
	let n = t.find((t) => t.pubkey === e.author);
	n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
		e.relays.indexOf(t) === -1 && e.relays.push(t);
	}), n.relays = e.relays);
}
function so(e) {
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
		let e = ro(i);
		e && n.push({
			tagName: i[0],
			pointer: e
		});
	} else if ((i[0] === "e" || i[0] === "a" || i[0] === "i") && i[1]) {
		let e = ro(i);
		e && r.push({
			tagName: i[0],
			pointer: e
		});
	} else if (i[0] === "K") t.rootKind = to(i[1]);
	else if (i[0] === "k") t.replyKind = to(i[1]);
	else if (i[0] === "q") {
		let e = io(i);
		e && t.quotes.push(e);
	} else (i[0] === "P" || i[0] === "p") && i[1] && X(i[1]) && t.profiles.push({
		pubkey: i[1],
		relays: i[2] ? [i[2]] : []
	});
	return t.root = ao(n), t.reply = ao(r), oo(t.root, t.profiles), oo(t.reply, t.profiles), t.quotes.forEach((e) => oo(e, t.profiles)), t;
}
q({}, {
	finishReactionEvent: () => co,
	getReactedEventPointer: () => lo
});
function co(e, t, n) {
	let r = t.tags.filter((e) => e.length >= 2 && (e[0] === "e" || e[0] === "p"));
	return Z({
		...e,
		kind: st,
		tags: [
			...e.tags ?? [],
			...r,
			["e", t.id],
			["p", t.pubkey]
		],
		content: e.content ?? "+"
	}, n);
}
function lo(e) {
	if (e.kind !== st) return;
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
q({}, { parse: () => mo });
var uo = /\W/m, fo = /[^\w\/] |[^\w\/]$|$|,| /m, po = 42;
function* mo(e) {
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
			if (o === 0 || e[o - 1].match(uo)) {
				let t = e.slice(o + 1, o + po).match(uo), a = t ? o + 1 + t.index : n;
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
			let t = e.slice(a + 60).match(uo), o = t ? a + 60 + t.index : n;
			try {
				let t, { data: n, type: s } = Hi(e.slice(a + 1, o));
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
			let t = e.slice(a + 4).match(fo), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 5 : 4;
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
			let t = e.slice(a + 4).match(fo), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 3 : 2;
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
q({}, {
	channelCreateEvent: () => ho,
	channelHideMessageEvent: () => vo,
	channelMessageEvent: () => _o,
	channelMetadataEvent: () => go,
	channelMuteUserEvent: () => yo
});
var ho = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Z({
		kind: St,
		tags: [...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, go = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Z({
		kind: Ct,
		tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, _o = (e, t) => {
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
	]), Z({
		kind: wt,
		tags: [...n, ...e.tags ?? []],
		content: e.content,
		created_at: e.created_at
	}, t);
}, vo = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Z({
		kind: Tt,
		tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, yo = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Z({
		kind: Et,
		tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
};
q({}, {
	EMOJI_SHORTCODE_REGEX: () => bo,
	matchAll: () => So,
	regex: () => xo,
	replaceAll: () => Co
});
var bo = /:(\w+):/, xo = () => RegExp(`\\B${bo.source}\\B`, "g");
function* So(e) {
	let t = e.matchAll(xo());
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
function Co(e, t) {
	return e.replaceAll(xo(), (e, n) => t({
		shortcode: e,
		name: n
	}));
}
q({}, {
	useFetchImplementation: () => To,
	validateGithub: () => Eo
});
var wo;
try {
	wo = fetch;
} catch {}
function To(e) {
	wo = e;
}
async function Eo(e, t, n) {
	try {
		return await (await wo(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
q({}, {
	makeNwcRequestEvent: () => Oo,
	parseConnectionString: () => Do
});
function Do(e) {
	let { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, a = r.getAll("relay"), o = r.get("secret");
	if (!i || a.length === 0 || !o) throw Error("invalid connection string");
	return {
		pubkey: i,
		relay: a[0],
		relays: a,
		secret: o
	};
}
async function Oo(e, t, n) {
	let r = $i(t, e, JSON.stringify({
		method: "pay_invoice",
		params: { invoice: n }
	}));
	return Z({
		kind: hr,
		created_at: Math.round(Date.now() / 1e3),
		content: r,
		tags: [["p", e]]
	}, t);
}
q({}, { normalizeIdentifier: () => ko });
function ko(e) {
	return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((e) => /\p{Letter}/u.test(e) || /\p{Number}/u.test(e) ? e : "-").join("");
}
q({}, {
	getSatoshisAmountFromBolt11: () => Io,
	getZapEndpoint: () => Mo,
	makeZapReceipt: () => Fo,
	makeZapRequest: () => No,
	useFetchImplementation: () => jo,
	validateZapRequest: () => Po
});
var Ao;
try {
	Ao = fetch;
} catch {}
function jo(e) {
	Ao = e;
}
async function Mo(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (r) {
			let [e, n] = r.split("@");
			t = new URL(`/.well-known/lnurlp/${e}`, `https://${n}`).toString();
		} else if (n) {
			let { words: e } = s.decode(n, 1e3), r = s.fromWords(e);
			t = J.decode(r);
		} else return null;
		let i = await (await Ao(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function No(e) {
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
		if (t.tags.push(["e", e.event.id]), Ye(e.event.kind)) {
			let n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
			t.tags.push(n);
		} else if (Ze(e.event.kind)) {
			let n = e.event.tags.find(([e, t]) => e === "d" && t);
			if (!n) throw Error("d tag not found or is empty");
			let r = ["a", `${e.event.kind}:${e.event.pubkey}:${n[1]}`];
			t.tags.push(r);
		}
		t.tags.push(["k", e.event.kind.toString()]);
	}
	return t;
}
function Po(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!ze(t)) return "Zap request is not a valid Nostr event.";
	if (!Ke(t)) return "Invalid signature on zap request.";
	let n = t.tags.find(([e, t]) => e === "p" && t);
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!X(n[1])) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find(([e, t]) => e === "e" && t);
	return r && !X(r[1]) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([e, t]) => e === "relays" && t) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Fo({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
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
function Io(e) {
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
q({}, {
	Negentropy: () => Ko,
	NegentropyStorageVector: () => Go,
	NegentropySync: () => Yo
});
var Lo = 97, Ro = 32, zo = 16, Bo = {
	Skip: 0,
	Fingerprint: 1,
	IdList: 2
}, Q = class {
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
		if (e instanceof Q && (e = e.unwrap()), typeof e.length != "number") throw Error("bad length");
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
function Vo(e) {
	let t = 0;
	for (;;) {
		if (e.length === 0) throw Error("parse ends prematurely");
		let n = e.shift();
		if (t = t << 7 | n & 127, !(n & 128)) break;
	}
	return t;
}
function $(e) {
	if (e === 0) return new Q(new Uint8Array([0]));
	let t = [];
	for (; e !== 0;) t.push(e & 127), e >>>= 7;
	t.reverse();
	for (let e = 0; e < t.length - 1; e++) t[e] |= 128;
	return new Q(new Uint8Array(t));
}
function Ho(e) {
	return Uo(e, 1)[0];
}
function Uo(e, t) {
	if (e.length < t) throw Error("parse ends prematurely");
	return e.shiftN(t);
}
var Wo = class {
	buf;
	constructor() {
		this.setToZero();
	}
	setToZero() {
		this.buf = new Uint8Array(Ro);
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
		let t = new Uint8Array(Ro);
		t[0] = 1, this.add(t);
	}
	getFingerprint(e) {
		let t = new Q();
		return t.extend(this.buf), t.extend($(e)), c(t.unwrap()).subarray(0, zo);
	}
}, Go = class {
	items;
	sealed;
	constructor() {
		this.items = [], this.sealed = !1;
	}
	insert(e, t) {
		if (this.sealed) throw Error("already sealed");
		let n = l(t);
		if (n.byteLength !== Ro) throw Error("bad id size for added item");
		this.items.push({
			timestamp: e,
			id: n
		});
	}
	seal() {
		if (this.sealed) throw Error("already sealed");
		this.sealed = !0, this.items.sort(Jo);
		for (let e = 1; e < this.items.length; e++) if (Jo(this.items[e - 1], this.items[e]) === 0) throw Error("duplicate item inserted");
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
		return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (e) => Jo(e, n) < 0);
	}
	fingerprint(e, t) {
		let n = new Wo();
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
}, Ko = class {
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
		let e = new Q();
		return e.extend(new Uint8Array([Lo])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), p(e.unwrap());
	}
	reconcile(e, t, n) {
		let r = new Q(l(e));
		this.lastTimestampIn = this.lastTimestampOut = 0;
		let i = new Q();
		i.extend(new Uint8Array([Lo]));
		let a = Ho(r);
		if (a < 96 || a > 111) throw Error("invalid negentropy protocol version byte");
		if (a !== Lo) throw Error("unsupported negentropy protocol version requested: " + (a - 96));
		let o = this.storage.size(), s = this._bound(0), c = 0, u = !1;
		for (; r.length !== 0;) {
			let e = new Q(), a = () => {
				u && (u = !1, e.extend(this.encodeBound(s)), e.extend($(Bo.Skip)));
			}, l = this.decodeBound(r), d = Vo(r), f = c, m = this.storage.findLowerBound(c, o, l);
			if (d === Bo.Skip) u = !0;
			else if (d === Bo.Fingerprint) qo(Uo(r, zo), this.storage.fingerprint(f, m)) === 0 ? u = !0 : (a(), this.splitRange(f, m, l, e));
			else if (d === Bo.IdList) {
				let e = Vo(r), i = {};
				for (let t = 0; t < e; t++) {
					let e = Uo(r, Ro);
					i[p(e)] = e;
				}
				if (u = !0, this.storage.iterate(f, m, (e) => {
					let n = e.id, r = p(n);
					return i[r] ? delete i[p(n)] : t?.(r), !0;
				}), n) for (let e of Object.values(i)) n(p(e));
			} else throw Error("unexpected mode");
			if (this.exceededFrameSizeLimit(i.length + e.length)) {
				let e = this.storage.fingerprint(m, o);
				i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend($(Bo.Fingerprint)), i.extend(e);
				break;
			}
			i.extend(e), c = m, s = l;
		}
		return i.length === 1 ? null : p(i.unwrap());
	}
	splitRange(e, t, n, r) {
		let i = t - e;
		if (i < 32) r.extend(this.encodeBound(n)), r.extend($(Bo.IdList)), r.extend($(i)), this.storage.iterate(e, t, (e) => (r.extend(e.id), !0));
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
				r.extend(this.encodeBound(l)), r.extend($(Bo.Fingerprint)), r.extend(c);
			}
		}
	}
	exceededFrameSizeLimit(e) {
		return e > this.frameSizeLimit - 200;
	}
	decodeTimestampIn(e) {
		let t = Vo(e);
		return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
	}
	decodeBound(e) {
		let t = this.decodeTimestampIn(e), n = Vo(e);
		if (n > Ro) throw Error("bound key too long");
		return {
			timestamp: t,
			id: Uo(e, n)
		};
	}
	encodeTimestampOut(e) {
		if (e === Number.MAX_VALUE) return this.lastTimestampOut = Number.MAX_VALUE, $(0);
		let t = e;
		return e -= this.lastTimestampOut, this.lastTimestampOut = t, $(e + 1);
	}
	encodeBound(e) {
		let t = new Q();
		return t.extend(this.encodeTimestampOut(e.timestamp)), t.extend($(e.id.length)), t.extend(e.id), t;
	}
	getMinimalBound(e, t) {
		if (t.timestamp !== e.timestamp) return this._bound(t.timestamp);
		{
			let n = 0, r = t.id, i = e.id;
			for (let e = 0; e < Ro && r[e] === i[e]; e++) n++;
			return this._bound(t.timestamp, t.id.subarray(0, n + 1));
		}
	}
};
function qo(e, t) {
	for (let n = 0; n < e.byteLength; n++) {
		if (e[n] < t[n]) return -1;
		if (e[n] > t[n]) return 1;
	}
	return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function Jo(e, t) {
	return e.timestamp === t.timestamp ? qo(e.id, t.id) : e.timestamp - t.timestamp;
}
var Yo = class {
	relay;
	storage;
	neg;
	filter;
	subscription;
	onhave;
	onneed;
	constructor(e, t, n, r = {}) {
		this.relay = e, this.storage = t, this.neg = new Ko(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (e) => {
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
q({}, {
	getToken: () => Zo,
	hashPayload: () => is,
	unpackEventFromToken: () => $o,
	validateEvent: () => os,
	validateEventKind: () => ts,
	validateEventMethodTag: () => rs,
	validateEventPayloadTag: () => as,
	validateEventTimestamp: () => es,
	validateEventUrlTag: () => ns,
	validateToken: () => Qo
});
var Xo = "Nostr ";
async function Zo(e, t, n, r = !1, i) {
	let a = {
		kind: yr,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	i && a.tags.push(["payload", is(i)]);
	let o = await n(a);
	return (r ? Xo : "") + f.encode(Y.encode(JSON.stringify(o)));
}
async function Qo(e, t, n) {
	return await os(await $o(e).catch((e) => {
		throw e;
	}), t, n).catch((e) => {
		throw e;
	});
}
async function $o(e) {
	if (!e) throw Error("Missing token");
	e = e.replace(Xo, "");
	let t = J.decode(f.decode(e));
	if (!t || t.length === 0 || !t.startsWith("{")) throw Error("Invalid token");
	return JSON.parse(t);
}
function es(e) {
	return e.created_at ? Math.abs(Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at) < 60 : !1;
}
function ts(e) {
	return e.kind === yr;
}
function ns(e, t) {
	let n = e.tags.find((e) => e[0] === "u");
	return n ? n.length > 0 && n[1] === t : !1;
}
function rs(e, t) {
	let n = e.tags.find((e) => e[0] === "method");
	return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function is(e) {
	let t = c(Y.encode(JSON.stringify(e)));
	return p(t);
}
function as(e, t) {
	let n = e.tags.find((e) => e[0] === "payload");
	if (!n) return !1;
	let r = is(t);
	return n.length > 0 && n[1] === r;
}
async function os(e, t, n, r) {
	if (!Ke(e)) throw Error("Invalid nostr event, signature invalid");
	if (!ts(e)) throw Error("Invalid nostr event, kind invalid");
	if (!es(e)) throw Error("Invalid nostr event, created_at timestamp invalid");
	if (!ns(e, t)) throw Error("Invalid nostr event, url tag invalid");
	if (!rs(e, n)) throw Error("Invalid nostr event, method tag invalid");
	if (r && typeof r == "object" && Object.keys(r).length > 0 && !as(e, r)) throw Error("Invalid nostr event, payload tag does not match request body hash");
	return !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relayLists.ts
var ss = [
	"wss://purplepag.es/",
	"wss://directory.yabu.me/",
	"wss://indexer.coracle.social/",
	"wss://user.kindpag.es/"
], cs = [
	"wss://nos.lol/",
	"wss://relay.nostr.wirednet.jp/",
	"wss://yabu.me/",
	"wss://x.kojira.io/"
], ls = [
	"wss://relay.damus.io/",
	"wss://relay.nostr.band/",
	"wss://nrelay.c-stellar.net/",
	"wss://nrelay-jp.c-stellar.net/"
], us = /* @__PURE__ */ new Set(["ws:", "wss:"]), ds = new Set(ls), fs = class {
	static parseKind10002Tags(e) {
		let t = {};
		return e.filter((e) => Array.isArray(e) && e.every((e) => typeof e == "string") && (e.length === 2 || e.length === 3) && e[0] === "r").forEach((e) => {
			let n = typeof e[1] == "string" ? ps.normalizeExternalRelayUrl(e[1]) : null;
			if (!n) return;
			let r = !0, i = !0;
			if (e.length === 3) {
				if (e[2] === "read") i = !1;
				else if (e[2] === "write") r = !1;
				else return;
			}
			let a = t[n];
			t[n] = {
				read: (a?.read ?? !1) || r,
				write: (a?.write ?? !1) || i
			};
		}), t;
	}
	static parseKind3Content(e) {
		try {
			let t = JSON.parse(e);
			return t && typeof t == "object" && !Array.isArray(t) ? t : null;
		} catch {
			return null;
		}
	}
	static isValidRelayConfig(e) {
		return e ? Array.isArray(e) ? e.every((e) => typeof e == "string") : typeof e == "object" && e ? Object.entries(e).every(([, e]) => typeof e == "object" && !!e && "read" in e && "write" in e && typeof e.read == "boolean" && typeof e.write == "boolean") : !1 : !1;
	}
}, ps = class {
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
		return t !== null && ds.has(t);
	}
	static normalizeExternalRelayUrlCandidate(e) {
		if (typeof e != "string") return null;
		let t = e.trim();
		if (!t) return null;
		try {
			if (t.includes("://")) {
				let e = new URL(t);
				if (!us.has(e.protocol) || e.username || e.password) return null;
			}
			let e = je.normalizeURL(t), n = new URL(e);
			return !us.has(n.protocol) || !n.hostname || n.username || n.password ? null : e;
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
export { He as a, Oi as c, ze as d, Ke as f, T as g, Te as h, cs as i, Ii as l, Ee as m, ps as n, Ge as o, ke as p, ss as r, qe as s, fs as t, ha as u };
