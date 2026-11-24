import { a as e, c as t, d as n, f as r, i, l as a, m as o, n as s, o as c, p as l, r as u, s as d, t as f, u as p } from "./base-CVnVyhoG.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/nostrHexUtils.ts
var m = /^[0-9a-f]{64}$/i, h = /^[0-9a-f]{64}$/;
function g(e) {
	return typeof e == "string" && m.test(e);
}
function _(e) {
	return typeof e == "string" && h.test(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/utils.js
function ee(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function te(e) {
	if (typeof e != "boolean") throw Error(`boolean expected, not ${e}`);
}
function v(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error("positive integer expected, got " + e);
}
function y(e, t, n = "") {
	let r = ee(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function b(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function x(e, t) {
	y(e, void 0, "output");
	let n = t.outputLen;
	if (e.length < n) throw Error("digestInto() expects output buffer of length at least " + n);
}
function S(e) {
	return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function C(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
var w = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function T(e, t) {
	return e.buffer === t.buffer && e.byteOffset < t.byteOffset + t.byteLength && t.byteOffset < e.byteOffset + e.byteLength;
}
function E(e, t) {
	if (T(e, t) && e.byteOffset < t.byteOffset) throw Error("complex overlap of input and output is not supported");
}
function D(e, t) {
	if (typeof t != "object" || !t) throw Error("options must be defined");
	return Object.assign(e, t);
}
function O(e, t) {
	if (e.length !== t.length) return !1;
	let n = 0;
	for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
	return n === 0;
}
var k = (e, t) => {
	function n(n, ...r) {
		if (y(n, void 0, "key"), !w) throw Error("Non little-endian hardware is not yet supported");
		if (e.nonceLength !== void 0) {
			let t = r[0];
			y(t, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
		}
		let i = e.tagLength;
		i && r[1] !== void 0 && y(r[1], void 0, "AAD");
		let a = t(n, ...r), o = (e, t) => {
			if (t !== void 0) {
				if (e !== 2) throw Error("cipher output not supported");
				y(t, void 0, "output");
			}
		}, s = !1;
		return {
			encrypt(e, t) {
				if (s) throw Error("cannot encrypt() twice with same key + nonce");
				return s = !0, y(e), o(a.encrypt.length, t), a.encrypt(e, t);
			},
			decrypt(e, t) {
				if (y(e), i && e.length < i) throw Error("\"ciphertext\" expected length bigger than tagLength=" + i);
				return o(a.decrypt.length, t), a.decrypt(e, t);
			}
		};
	}
	return Object.assign(n, e), n;
};
function A(e, t, n = !0) {
	if (t === void 0) return new Uint8Array(e);
	if (t.length !== e) throw Error("\"output\" expected Uint8Array of length " + e + ", got: " + t.length);
	if (n && !j(t)) throw Error("invalid output, must be aligned");
	return t;
}
function j(e) {
	return e.byteOffset % 4 == 0;
}
function M(e) {
	return Uint8Array.from(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/aes.js
var N = 16, P = 283;
function F(e) {
	if (![
		16,
		24,
		32
	].includes(e.length)) throw Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + e.length);
}
function I(e) {
	return e << 1 ^ P & -(e >> 7);
}
function L(e, t) {
	let n = 0;
	for (; t > 0; t >>= 1) n ^= e & -(t & 1), e = I(e);
	return n;
}
var R = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(256);
	for (let t = 0, n = 1; t < 256; t++, n ^= I(n)) e[t] = n;
	let t = /* @__PURE__ */ new Uint8Array(256);
	t[0] = 99;
	for (let n = 0; n < 255; n++) {
		let r = e[255 - n];
		r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
	}
	return C(e), t;
})(), z = /* @__PURE__ */ R.map((e, t) => R.indexOf(t)), B = (e) => e << 24 | e >>> 8, V = (e) => e << 8 | e >>> 24;
function H(e, t) {
	if (e.length !== 256) throw Error("Wrong sbox length");
	let n = (/* @__PURE__ */ new Uint32Array(256)).map((n, r) => t(e[r])), r = n.map(V), i = r.map(V), a = i.map(V), o = /* @__PURE__ */ new Uint32Array(65536), s = /* @__PURE__ */ new Uint32Array(65536), c = /* @__PURE__ */ new Uint16Array(65536);
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
var ne = /* @__PURE__ */ H(R, (e) => L(e, 3) << 24 | e << 16 | e << 8 | L(e, 2)), re = /* @__PURE__ */ H(z, (e) => L(e, 11) << 24 | L(e, 13) << 16 | L(e, 9) << 8 | L(e, 14)), ie = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(16);
	for (let t = 0, n = 1; t < 16; t++, n = I(n)) e[t] = n;
	return e;
})();
function ae(e) {
	y(e);
	let t = e.length;
	F(e);
	let { sbox2: n } = ne, r = [];
	j(e) || r.push(e = M(e));
	let i = S(e), a = i.length, o = (e) => W(n, e, e, e, e), s = new Uint32Array(t + 28);
	s.set(i);
	for (let e = a; e < s.length; e++) {
		let t = s[e - 1];
		e % a === 0 ? t = o(B(t)) ^ ie[e / a - 1] : a > 6 && e % a === 4 && (t = o(t)), s[e] = s[e - a] ^ t;
	}
	return C(...r), s;
}
function oe(e) {
	let t = ae(e), n = t.slice(), r = t.length, { sbox2: i } = ne, { T0: a, T1: o, T2: s, T3: c } = re;
	for (let e = 0; e < r; e += 4) for (let i = 0; i < 4; i++) n[e + i] = t[r - e - 4 + i];
	C(t);
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
function se(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = ne, c = 0;
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
function ce(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = re, c = 0;
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
function le(e) {
	if (y(e), e.length % N !== 0) throw Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function ue(e, t, n) {
	y(e);
	let r = e.length, i = r % N;
	if (!t && i !== 0) throw Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	j(e) || (e = M(e));
	let a = S(e);
	if (t) {
		let e = N - i;
		e ||= N, r += e;
	}
	return n = A(r, n), E(e, n), {
		b: a,
		o: S(n),
		out: n
	};
}
function de(e, t) {
	if (!t) return e;
	let n = e.length;
	if (!n) throw Error("aes/pcks5: empty ciphertext not allowed");
	let r = e[n - 1];
	if (r <= 0 || r > 16) throw Error("aes/pcks5: wrong padding");
	let i = e.subarray(0, -r);
	for (let t = 0; t < r; t++) if (e[n - t - 1] !== r) throw Error("aes/pcks5: wrong padding");
	return i;
}
function fe(e) {
	let t = /* @__PURE__ */ new Uint8Array(16), n = S(t);
	t.set(e);
	let r = N - e.length;
	for (let e = N - r; e < N; e++) t[e] = r;
	return n;
}
var pe = /* @__PURE__ */ k({
	blockSize: 16,
	nonceLength: 16
}, function(e, t, n = {}) {
	let r = !n.disablePadding;
	return {
		encrypt(n, i) {
			let a = ae(e), { b: o, o: s, out: c } = ue(n, r, i), l = t, u = [a];
			j(l) || u.push(l = M(l));
			let d = S(l), f = d[0], p = d[1], m = d[2], h = d[3], g = 0;
			for (; g + 4 <= o.length;) f ^= o[g + 0], p ^= o[g + 1], m ^= o[g + 2], h ^= o[g + 3], {s0: f, s1: p, s2: m, s3: h} = se(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			if (r) {
				let e = fe(n.subarray(g * 4));
				f ^= e[0], p ^= e[1], m ^= e[2], h ^= e[3], {s0: f, s1: p, s2: m, s3: h} = se(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			}
			return C(...u), c;
		},
		decrypt(n, i) {
			le(n);
			let a = oe(e), o = t, s = [a];
			j(o) || s.push(o = M(o));
			let c = S(o);
			i = A(n.length, i), j(n) || s.push(n = M(n)), E(n, i);
			let l = S(n), u = S(i), d = c[0], f = c[1], p = c[2], m = c[3];
			for (let e = 0; e + 4 <= l.length;) {
				let t = d, n = f, r = p, i = m;
				d = l[e + 0], f = l[e + 1], p = l[e + 2], m = l[e + 3];
				let { s0: o, s1: s, s2: c, s3: h } = ce(a, d, f, p, m);
				u[e++] = o ^ t, u[e++] = s ^ n, u[e++] = c ^ r, u[e++] = h ^ i;
			}
			return C(...s), de(i, r);
		}
	};
}), me = (e) => Uint8Array.from(e.split(""), (e) => e.charCodeAt(0)), he = me("expand 16-byte k"), ge = me("expand 32-byte k"), _e = S(he), ve = S(ge);
function G(e, t) {
	return e << t | e >>> 32 - t;
}
function ye(e) {
	return e.byteOffset % 4 == 0;
}
var be = 64, xe = 16, Se = 2 ** 32 - 1, Ce = Uint32Array.of();
function we(e, t, n, r, i, a, o, s) {
	let c = i.length, l = new Uint8Array(be), u = S(l), d = ye(i) && ye(a), f = d ? S(i) : Ce, p = d ? S(a) : Ce;
	for (let m = 0; m < c; o++) {
		if (e(t, n, r, u, o, s), o >= Se) throw Error("arx: counter overflow");
		let h = Math.min(be, c - m);
		if (d && h === be) {
			let e = m / 4;
			if (m % 4 != 0) throw Error("arx: invalid block position");
			for (let t = 0, n; t < xe; t++) n = e + t, p[n] = f[n] ^ u[t];
			m += be;
		} else {
			for (let e = 0, t; e < h; e++) t = m + e, a[t] = i[t] ^ l[e];
			m += h;
		}
	}
}
function Te(e, t) {
	let { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: a, rounds: o } = D({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, t);
	if (typeof e != "function") throw Error("core must be a function");
	return v(i), v(o), te(a), te(n), (t, s, c, l, u = 0) => {
		y(t, void 0, "key"), y(s, void 0, "nonce"), y(c, void 0, "data");
		let d = c.length;
		if (l === void 0 && (l = new Uint8Array(d)), y(l, void 0, "output"), v(u), u < 0 || u >= Se) throw Error("arx: counter overflow");
		if (l.length < d) throw Error(`arx: output (${l.length}) is shorter than data (${d})`);
		let f = [], p = t.length, m, h;
		if (p === 32) f.push(m = M(t)), h = ve;
		else if (p === 16 && n) m = /* @__PURE__ */ new Uint8Array(32), m.set(t), m.set(t, 16), h = _e, f.push(m);
		else throw y(t, 32, "arx key"), Error("invalid key size");
		ye(s) || f.push(s = M(s));
		let g = S(m);
		if (r) {
			if (s.length !== 24) throw Error("arx: extended nonce must be 24 bytes");
			r(h, g, S(s.subarray(0, 16)), g), s = s.subarray(16);
		}
		let _ = 16 - i;
		if (_ !== s.length) throw Error(`arx: nonce must be ${_} or 16 bytes`);
		if (_ !== 12) {
			let e = /* @__PURE__ */ new Uint8Array(12);
			e.set(s, a ? 0 : 12 - s.length), s = e, f.push(s);
		}
		let ee = S(s);
		return we(e, h, g, ee, c, l, u, o), C(...f), l;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/_poly1305.js
function K(e, t) {
	return e[t++] & 255 | (e[t++] & 255) << 8;
}
var Ee = class {
	blockLen = 16;
	outputLen = 16;
	buffer = /* @__PURE__ */ new Uint8Array(16);
	r = /* @__PURE__ */ new Uint16Array(10);
	h = /* @__PURE__ */ new Uint16Array(10);
	pad = /* @__PURE__ */ new Uint16Array(8);
	pos = 0;
	finished = !1;
	constructor(e) {
		e = M(y(e, 32, "key"));
		let t = K(e, 0), n = K(e, 2), r = K(e, 4), i = K(e, 6), a = K(e, 8), o = K(e, 10), s = K(e, 12), c = K(e, 14);
		this.r[0] = t & 8191, this.r[1] = (t >>> 13 | n << 3) & 8191, this.r[2] = (n >>> 10 | r << 6) & 7939, this.r[3] = (r >>> 7 | i << 9) & 8191, this.r[4] = (i >>> 4 | a << 12) & 255, this.r[5] = a >>> 1 & 8190, this.r[6] = (a >>> 14 | o << 2) & 8191, this.r[7] = (o >>> 11 | s << 5) & 8065, this.r[8] = (s >>> 8 | c << 8) & 8191, this.r[9] = c >>> 5 & 127;
		for (let t = 0; t < 8; t++) this.pad[t] = K(e, 16 + 2 * t);
	}
	process(e, t, n = !1) {
		let r = n ? 0 : 2048, { h: i, r: a } = this, o = a[0], s = a[1], c = a[2], l = a[3], u = a[4], d = a[5], f = a[6], p = a[7], m = a[8], h = a[9], g = K(e, t + 0), _ = K(e, t + 2), ee = K(e, t + 4), te = K(e, t + 6), v = K(e, t + 8), y = K(e, t + 10), b = K(e, t + 12), x = K(e, t + 14), S = i[0] + (g & 8191), C = i[1] + ((g >>> 13 | _ << 3) & 8191), w = i[2] + ((_ >>> 10 | ee << 6) & 8191), T = i[3] + ((ee >>> 7 | te << 9) & 8191), E = i[4] + ((te >>> 4 | v << 12) & 8191), D = i[5] + (v >>> 1 & 8191), O = i[6] + ((v >>> 14 | y << 2) & 8191), k = i[7] + ((y >>> 11 | b << 5) & 8191), A = i[8] + ((b >>> 8 | x << 8) & 8191), j = i[9] + (x >>> 5 | r), M = 0, N = M + S * o + 5 * h * C + 5 * m * w + 5 * p * T + 5 * f * E;
		M = N >>> 13, N &= 8191, N += 5 * d * D + 5 * u * O + 5 * l * k + 5 * c * A + 5 * s * j, M += N >>> 13, N &= 8191;
		let P = M + S * s + C * o + 5 * h * w + 5 * m * T + 5 * p * E;
		M = P >>> 13, P &= 8191, P += 5 * f * D + 5 * d * O + 5 * u * k + 5 * l * A + 5 * c * j, M += P >>> 13, P &= 8191;
		let F = M + S * c + C * s + w * o + 5 * h * T + 5 * m * E;
		M = F >>> 13, F &= 8191, F += 5 * p * D + 5 * f * O + 5 * d * k + 5 * u * A + 5 * l * j, M += F >>> 13, F &= 8191;
		let I = M + S * l + C * c + w * s + T * o + 5 * h * E;
		M = I >>> 13, I &= 8191, I += 5 * m * D + 5 * p * O + 5 * f * k + 5 * d * A + 5 * u * j, M += I >>> 13, I &= 8191;
		let L = M + S * u + C * l + w * c + T * s + E * o;
		M = L >>> 13, L &= 8191, L += 5 * h * D + 5 * m * O + 5 * p * k + 5 * f * A + 5 * d * j, M += L >>> 13, L &= 8191;
		let R = M + S * d + C * u + w * l + T * c + E * s;
		M = R >>> 13, R &= 8191, R += D * o + 5 * h * O + 5 * m * k + 5 * p * A + 5 * f * j, M += R >>> 13, R &= 8191;
		let z = M + S * f + C * d + w * u + T * l + E * c;
		M = z >>> 13, z &= 8191, z += D * s + O * o + 5 * h * k + 5 * m * A + 5 * p * j, M += z >>> 13, z &= 8191;
		let B = M + S * p + C * f + w * d + T * u + E * l;
		M = B >>> 13, B &= 8191, B += D * c + O * s + k * o + 5 * h * A + 5 * m * j, M += B >>> 13, B &= 8191;
		let V = M + S * m + C * p + w * f + T * d + E * u;
		M = V >>> 13, V &= 8191, V += D * l + O * c + k * s + A * o + 5 * h * j, M += V >>> 13, V &= 8191;
		let H = M + S * h + C * m + w * p + T * f + E * d;
		M = H >>> 13, H &= 8191, H += D * u + O * l + k * c + A * s + j * o, M += H >>> 13, H &= 8191, M = (M << 2) + M | 0, M = M + N | 0, N = M & 8191, M >>>= 13, P += M, i[0] = N, i[1] = P, i[2] = F, i[3] = I, i[4] = L, i[5] = R, i[6] = z, i[7] = B, i[8] = V, i[9] = H;
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
		C(n);
	}
	update(e) {
		b(this), y(e), e = M(e);
		let { buffer: t, blockLen: n } = this, r = e.length;
		for (let i = 0; i < r;) {
			let a = Math.min(n - this.pos, r - i);
			if (a === n) for (; n <= r - i; i += n) this.process(e, i);
			else t.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === n && (this.process(t, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		C(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		b(this), x(e, this), this.finished = !0;
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
function De(e) {
	let t = (t, n) => e(n).update(t).digest(), n = e(/* @__PURE__ */ new Uint8Array(32));
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
}
De((e) => new Ee(e));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/chacha.js
function Oe(e, t, n, r, i, a = 20) {
	let o = e[0], s = e[1], c = e[2], l = e[3], u = t[0], d = t[1], f = t[2], p = t[3], m = t[4], h = t[5], g = t[6], _ = t[7], ee = i, te = n[0], v = n[1], y = n[2], b = o, x = s, S = c, C = l, w = u, T = d, E = f, D = p, O = m, k = h, A = g, j = _, M = ee, N = te, P = v, F = y;
	for (let e = 0; e < a; e += 2) b = b + w | 0, M = G(M ^ b, 16), O = O + M | 0, w = G(w ^ O, 12), b = b + w | 0, M = G(M ^ b, 8), O = O + M | 0, w = G(w ^ O, 7), x = x + T | 0, N = G(N ^ x, 16), k = k + N | 0, T = G(T ^ k, 12), x = x + T | 0, N = G(N ^ x, 8), k = k + N | 0, T = G(T ^ k, 7), S = S + E | 0, P = G(P ^ S, 16), A = A + P | 0, E = G(E ^ A, 12), S = S + E | 0, P = G(P ^ S, 8), A = A + P | 0, E = G(E ^ A, 7), C = C + D | 0, F = G(F ^ C, 16), j = j + F | 0, D = G(D ^ j, 12), C = C + D | 0, F = G(F ^ C, 8), j = j + F | 0, D = G(D ^ j, 7), b = b + T | 0, F = G(F ^ b, 16), A = A + F | 0, T = G(T ^ A, 12), b = b + T | 0, F = G(F ^ b, 8), A = A + F | 0, T = G(T ^ A, 7), x = x + E | 0, M = G(M ^ x, 16), j = j + M | 0, E = G(E ^ j, 12), x = x + E | 0, M = G(M ^ x, 8), j = j + M | 0, E = G(E ^ j, 7), S = S + D | 0, N = G(N ^ S, 16), O = O + N | 0, D = G(D ^ O, 12), S = S + D | 0, N = G(N ^ S, 8), O = O + N | 0, D = G(D ^ O, 7), C = C + w | 0, P = G(P ^ C, 16), k = k + P | 0, w = G(w ^ k, 12), C = C + w | 0, P = G(P ^ C, 8), k = k + P | 0, w = G(w ^ k, 7);
	let I = 0;
	r[I++] = o + b | 0, r[I++] = s + x | 0, r[I++] = c + S | 0, r[I++] = l + C | 0, r[I++] = u + w | 0, r[I++] = d + T | 0, r[I++] = f + E | 0, r[I++] = p + D | 0, r[I++] = m + O | 0, r[I++] = h + k | 0, r[I++] = g + A | 0, r[I++] = _ + j | 0, r[I++] = ee + M | 0, r[I++] = te + N | 0, r[I++] = v + P | 0, r[I++] = y + F | 0;
}
var ke = /* @__PURE__ */ Te(Oe, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hkdf.js
function Ae(n, r, i) {
	return t(n), i === void 0 && (i = new Uint8Array(n.outputLen)), e(n, i, r);
}
var je = /* @__PURE__ */ Uint8Array.of(0), Me = /* @__PURE__ */ Uint8Array.of();
function Ne(r, i, o, s = 32) {
	t(r), a(s, "length");
	let c = r.outputLen;
	if (s > 255 * c) throw Error("Length must be <= 255*HashLen");
	let l = Math.ceil(s / c);
	o === void 0 ? o = Me : d(o, void 0, "info");
	let u = new Uint8Array(l * c), f = e.create(r, i), p = f._cloneInto(), m = new Uint8Array(f.outputLen);
	for (let e = 0; e < l; e++) je[0] = e + 1, p.update(e === 0 ? Me : m).update(o).update(je).digestInto(m), u.set(m, c * e), f._cloneInto(p);
	return f.destroy(), p.destroy(), n(m, je), u.slice(0, s);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/index.js
var Pe = Object.defineProperty, q = (e, t) => {
	for (var n in t) Pe(e, n, {
		get: t[n],
		enumerable: !0
	});
};
q({}, {
	binarySearch: () => Re,
	bytesToHex: () => p,
	hexToBytes: () => l,
	insertEventIntoAscendingList: () => Le,
	insertEventIntoDescendingList: () => Ie,
	isHex32: () => X,
	mergeReverseSortedLists: () => ze,
	normalizeURL: () => Fe,
	utf8Decoder: () => J,
	utf8Encoder: () => Y
});
var J = new TextDecoder("utf-8"), Y = new TextEncoder();
function Fe(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function Ie(e, t) {
	let [n, r] = Re(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : e.created_at - t.created_at);
	return r || e.splice(n, 0, t), e;
}
function Le(e, t) {
	let [n, r] = Re(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : t.created_at - e.created_at);
	return r || e.splice(n, 0, t), e;
}
function Re(e, t) {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = t(e[i]);
		if (a === 0) return [i, !0];
		a < 0 ? r = i - 1 : n = i + 1;
	}
	return [n, !1];
}
function ze(e, t) {
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
var Be = Symbol("verified"), Ve = (e) => e instanceof Object;
function He(e) {
	if (!Ve(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !X(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var Ue = class {
	generateSecretKey() {
		return u.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return p(u.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = p(u.getPublicKey(t)), n.id = Ge(n), n.sig = p(u.sign(l(Ge(n)), t)), n[Be] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[Be] == "boolean") return e[Be];
		try {
			let t = Ge(e);
			if (t !== e.id) return e[Be] = !1, !1;
			let n = u.verify(l(e.sig), l(t), l(e.pubkey));
			return e[Be] = n, n;
		} catch {
			return e[Be] = !1, !1;
		}
	}
};
function We(e) {
	if (!He(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function Ge(e) {
	let t = c(Y.encode(We(e)));
	return p(t);
}
var Ke = new Ue(), qe = Ke.generateSecretKey, Je = Ke.getPublicKey, Z = Ke.finalizeEvent, Ye = Ke.verifyEvent, Xe = {};
q(Xe, {
	AIEmbeddings: () => sn,
	AppCurationSet: () => Gr,
	Application: () => Ur,
	AuthoredPodcasts: () => sr,
	BadgeAward: () => dt,
	BadgeDefinition: () => jr,
	Bid: () => Pt,
	BidConfirmation: () => Ft,
	BlobsAuth: () => xr,
	BlockedRelaysList: () => Un,
	BlossomServerList: () => nr,
	BookmarkList: () => Bn,
	Bookmarksets: () => Er,
	Calendar: () => ci,
	CalendarEventRSVP: () => li,
	CashuMintAnnouncement: () => bi,
	CashuWalletEvent: () => hr,
	CashuWalletHistory: () => yn,
	CashuWalletTokens: () => vn,
	ChannelCreation: () => Tt,
	ChannelHideMessage: () => Ot,
	ChannelMessage: () => Dt,
	ChannelMetadata: () => Et,
	ChannelMuteUser: () => kt,
	ChatMessage: () => ft,
	Chess: () => jt,
	ClassifiedListing: () => Zr,
	ClientAuth: () => _r,
	CodeSnippet: () => Gt,
	CoinjoinPool: () => un,
	Comment: () => Bt,
	CommunitiesList: () => Vn,
	CommunityDefinition: () => gi,
	CommunityPostApproval: () => pn,
	ConferenceEvent: () => Jr,
	Contacts: () => ot,
	CreateOrUpdateProduct: () => Pr,
	CreateOrUpdateStall: () => Nr,
	CuratedVideoSets: () => Or,
	Curationsets: () => Dr,
	Date: () => oi,
	DecoupledEncryptionKeyDistribution: () => fn,
	DecoupledKeyAnnouncement: () => $n,
	DecoupledKeyClientAnnouncement: () => dn,
	DirectMessageRelaysList: () => er,
	DraftClassifiedListing: () => Qr,
	DraftEvent: () => ri,
	DraftLong: () => Rr,
	Emojisets: () => zr,
	EncryptedDirectMessage: () => st,
	EventDeletion: () => ct,
	FavoriteFollowSets: () => Zn,
	FavoritePodcasts: () => tr,
	FavoriteRelays: () => Kn,
	FedimintAnnouncement: () => xi,
	Feed: () => ai,
	FileMessage: () => vt,
	FileMetadata: () => Rt,
	FileServerPreference: () => rr,
	Followsets: () => Cr,
	ForumThread: () => mt,
	GenericRepost: () => yt,
	Genericlists: () => wr,
	GeocacheListing: () => vi,
	GeocacheLog: () => bn,
	GeocacheLogEntry: () => yi,
	GeocacheProofOfFind: () => xn,
	GiftWrap: () => Lt,
	GitPullRequest: () => qt,
	GitPullRequestUpdate: () => Jt,
	GoodWikiAuthorList: () => ir,
	GoodWikiRelayList: () => ar,
	GroupMetadata: () => Ci,
	HTTPAuth: () => Sr,
	Handlerinformation: () => fi,
	Handlerrecommendation: () => di,
	Highlights: () => In,
	InteractiveRoom: () => qr,
	InterestsList: () => Jn,
	Interestsets: () => Mr,
	Issue: () => Yt,
	JobFeedback: () => gn,
	JobRequest: () => mn,
	JobResult: () => hn,
	Label: () => an,
	LegacyNsiteFile: () => mi,
	LightningPubRPC: () => gr,
	LinkSet: () => ii,
	LiveChatMessage: () => Wt,
	LiveEvent: () => Kr,
	LongFormArticle: () => Lr,
	MarketplaceUI: () => Fr,
	MediaFollows: () => Xn,
	MediaStarterPacks: () => ki,
	MergeRequests: () => Mt,
	Metadata: () => rt,
	ModularArticleContent: () => Vr,
	ModularArticleHeader: () => Br,
	MuteSets: () => kr,
	Mutelist: () => Ln,
	NWCWalletInfo: () => pr,
	NWCWalletRequest: () => vr,
	NWCWalletResponse: () => yr,
	NormalVideo: () => St,
	NostrConnect: () => br,
	NsiteNamed: () => _i,
	NsiteRoot: () => mr,
	NutZap: () => Mn,
	NutZapInfo: () => Yn,
	OpenTimestamps: () => It,
	Patch: () => Kt,
	PeerToPeerOrderEvents: () => Si,
	Photo: () => xt,
	Pinlist: () => Rn,
	PodcastEpisode: () => At,
	PodcastMetadata: () => or,
	Poll: () => zt,
	PollResponse: () => Nt,
	PrivateDirectMessage: () => _t,
	PrivateEventRelayList: () => qn,
	ProblemTracker: () => tn,
	ProductSoldAsAuction: () => Ir,
	ProfileBadges: () => Ar,
	ProxyAnnouncement: () => dr,
	PublicChatsList: () => Hn,
	PublicMessage: () => wt,
	Reaction: () => ut,
	ReactionToWebsite: () => bt,
	RecommendRelay: () => at,
	Redirects: () => ni,
	RelayDiscovery: () => Wr,
	RelayList: () => zn,
	RelayMonitorAnnouncement: () => cr,
	RelayReview: () => ui,
	RelayReviews: () => on,
	Relaysets: () => Tr,
	ReleaseArtifactSets: () => Hr,
	Reply: () => Xt,
	Report: () => nn,
	Reporting: () => rn,
	RepositoryAnnouncement: () => $r,
	RepositoryState: () => ei,
	Repost: () => lt,
	ReservedCashuWalletTokens: () => _n,
	RoomPresence: () => lr,
	Scroll: () => Ht,
	Seal: () => gt,
	SearchRelaysList: () => Wn,
	ShortTextNote: () => it,
	ShortVideo: () => Ct,
	SimpleGroupAdmins: () => wi,
	SimpleGroupCreateGroup: () => En,
	SimpleGroupCreateInvite: () => On,
	SimpleGroupDeleteEvent: () => Tn,
	SimpleGroupDeleteGroup: () => Dn,
	SimpleGroupEditMetadata: () => wn,
	SimpleGroupJoinRequest: () => kn,
	SimpleGroupLeaveRequest: () => An,
	SimpleGroupList: () => Gn,
	SimpleGroupLiveKitParticipants: () => Di,
	SimpleGroupMembers: () => Ti,
	SimpleGroupPutUser: () => Sn,
	SimpleGroupRemoveUser: () => Cn,
	SimpleGroupReply: () => ht,
	SimpleGroupRoles: () => Ei,
	SimpleGroupThreadedReply: () => pt,
	SlideSet: () => Xr,
	SoftwareApplication: () => pi,
	StarterPacks: () => Oi,
	StatusApplied: () => Qt,
	StatusClosed: () => $t,
	StatusDraft: () => en,
	StatusOpen: () => Zt,
	TidalLogin: () => Nn,
	Time: () => si,
	Torrent: () => cn,
	TorrentComment: () => ln,
	TransportMethodAnnouncement: () => fr,
	UserEmojiList: () => Qn,
	UserGraspList: () => ur,
	UserStatuses: () => Yr,
	VideoViewEvent: () => hi,
	Voice: () => Vt,
	VoiceComment: () => Ut,
	WebBookmarks: () => Ai,
	WikiArticle: () => ti,
	Zap: () => Fn,
	ZapGoal: () => jn,
	ZapRequest: () => Pn,
	classifyKind: () => tt,
	isAddressableKind: () => et,
	isEphemeralKind: () => $e,
	isKind: () => nt,
	isRegularKind: () => Ze,
	isReplaceableKind: () => Qe
});
function Ze(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function Qe(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function $e(e) {
	return 2e4 <= e && e < 3e4;
}
function et(e) {
	return 3e4 <= e && e < 4e4;
}
function tt(e) {
	return Ze(e) ? "regular" : Qe(e) ? "replaceable" : $e(e) ? "ephemeral" : et(e) ? "parameterized" : "unknown";
}
function nt(e, t) {
	let n = t instanceof Array ? t : [t];
	return He(e) && n.includes(e.kind) || !1;
}
var rt = 0, it = 1, at = 2, ot = 3, st = 4, ct = 5, lt = 6, ut = 7, dt = 8, ft = 9, pt = 10, mt = 11, ht = 12, gt = 13, _t = 14, vt = 15, yt = 16, bt = 17, xt = 20, St = 21, Ct = 22, wt = 24, Tt = 40, Et = 41, Dt = 42, Ot = 43, kt = 44, At = 54, jt = 64, Mt = 818, Nt = 1018, Pt = 1021, Ft = 1022, It = 1040, Lt = 1059, Rt = 1063, zt = 1068, Bt = 1111, Vt = 1222, Ht = 1227, Ut = 1244, Wt = 1311, Gt = 1337, Kt = 1617, qt = 1618, Jt = 1619, Yt = 1621, Xt = 1622, Zt = 1630, Qt = 1631, $t = 1632, en = 1633, tn = 1971, nn = 1984, rn = 1984, an = 1985, on = 1986, sn = 1987, cn = 2003, ln = 2004, un = 2022, dn = 4454, fn = 4455, pn = 4550, mn = 5999, hn = 6999, gn = 7e3, _n = 7374, vn = 7375, yn = 7376, bn = 7516, xn = 7517, Sn = 9e3, Cn = 9001, wn = 9002, Tn = 9005, En = 9007, Dn = 9008, On = 9009, kn = 9021, An = 9022, jn = 9041, Mn = 9321, Nn = 9467, Pn = 9734, Fn = 9735, In = 9802, Ln = 1e4, Rn = 10001, zn = 10002, Bn = 10003, Vn = 10004, Hn = 10005, Un = 10006, Wn = 10007, Gn = 10009, Kn = 10012, qn = 10013, Jn = 10015, Yn = 10019, Xn = 10020, Zn = 10021, Qn = 10030, $n = 10044, er = 10050, tr = 10054, nr = 10063, rr = 10096, ir = 10101, ar = 10102, or = 10154, sr = 10164, cr = 10166, lr = 10312, ur = 10317, dr = 10377, fr = 11111, pr = 13194, mr = 15128, hr = 17375, gr = 21e3, _r = 22242, vr = 23194, yr = 23195, br = 24133, xr = 24242, Sr = 27235, Cr = 3e4, wr = 30001, Tr = 30002, Er = 30003, Dr = 30004, Or = 30005, kr = 30007, Ar = 30008, jr = 30009, Mr = 30015, Nr = 30017, Pr = 30018, Fr = 30019, Ir = 30020, Lr = 30023, Rr = 30024, zr = 30030, Br = 30040, Vr = 30041, Hr = 30063, Ur = 30078, Wr = 30166, Gr = 30267, Kr = 30311, qr = 30312, Jr = 30313, Yr = 30315, Xr = 30388, Zr = 30402, Qr = 30403, $r = 30617, ei = 30618, ti = 30818, ni = 30819, ri = 31234, ii = 31388, ai = 31890, oi = 31922, si = 31923, ci = 31924, li = 31925, ui = 31987, di = 31989, fi = 31990, pi = 32267, mi = 34128, hi = 34237, gi = 34550, _i = 35128, vi = 37515, yi = 37516, bi = 38172, xi = 38173, Si = 38383, Ci = 39e3, wi = 39001, Ti = 39002, Ei = 39003, Di = 39004, Oi = 39089, ki = 39092, Ai = 39701;
function ji(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find(([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1)) return !1;
	}
	return !(e.since && t.created_at < e.since || e.until && t.created_at > e.until);
}
q({}, {
	getHex64: () => Mi,
	getInt: () => Ni,
	getSubscriptionId: () => Pi,
	matchEventId: () => Fi,
	matchEventKind: () => Li,
	matchEventPubkey: () => Ii
});
function Mi(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function Ni(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function Pi(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function Fi(e, t) {
	return t === Mi(e, "id");
}
function Ii(e, t) {
	return t === Mi(e, "pubkey");
}
function Li(e, t) {
	return t === Ni(e, "kind");
}
q({}, { makeAuthEvent: () => Ri });
function Ri(e, t) {
	return {
		kind: _r,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
new TextEncoder();
var zi = {};
q(zi, {
	BECH32_REGEX: () => Hi,
	Bech32MaxSize: () => Vi,
	NostrTypeGuard: () => Bi,
	decode: () => Gi,
	decodeNostrURI: () => Wi,
	encodeBytes: () => Zi,
	naddrEncode: () => ea,
	neventEncode: () => $i,
	noteEncode: () => Yi,
	nprofileEncode: () => Qi,
	npubEncode: () => Ji,
	nsecEncode: () => qi
});
var Bi = {
	isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
	isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
	isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
	isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
	isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
	isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
	isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, Vi = 5e3, Hi = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function Ui(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function Wi(e) {
	try {
		return e.startsWith("nostr:") && (e = e.substring(6)), Gi(e);
	} catch {
		return {
			type: "invalid",
			data: null
		};
	}
}
function Gi(e) {
	let { prefix: t, words: n } = s.decode(e, Vi), r = new Uint8Array(s.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = Ki(r);
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
			let e = Ki(r);
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
			let e = Ki(r);
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
function Ki(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		if (n.length < 2) throw Error("not enough data to read TLV");
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		if (n = n.slice(2 + r), i.length < r) throw Error(`not enough data to read on TLV ${e}`);
		t[e] = t[e] || [], t[e].push(i);
	}
	return t;
}
function qi(e) {
	return Zi("nsec", e);
}
function Ji(e) {
	return Zi("npub", l(e));
}
function Yi(e) {
	return Zi("note", l(e));
}
function Xi(e, t) {
	let n = s.toWords(t);
	return s.encode(e, n, Vi);
}
function Zi(e, t) {
	return Xi(e, t);
}
function Qi(e) {
	return Xi("nprofile", ta({
		0: [l(e.pubkey)],
		1: (e.relays || []).map((e) => Y.encode(e))
	}));
}
function $i(e) {
	let t;
	return e.kind !== void 0 && (t = Ui(e.kind)), Xi("nevent", ta({
		0: [l(e.id)],
		1: (e.relays || []).map((e) => Y.encode(e)),
		2: e.author ? [l(e.author)] : [],
		3: t ? [new Uint8Array(t)] : []
	}));
}
function ea(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	return new DataView(t).setUint32(0, e.kind, !1), Xi("naddr", ta({
		0: [Y.encode(e.identifier)],
		1: (e.relays || []).map((e) => Y.encode(e)),
		2: [l(e.pubkey)],
		3: [new Uint8Array(t)]
	}));
}
function ta(e) {
	let t = [];
	return Object.entries(e).reverse().forEach(([e, n]) => {
		n.forEach((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		});
	}), r(...t);
}
q({}, {
	decrypt: () => ra,
	encrypt: () => na
});
function na(e, t, n) {
	let r = e instanceof Uint8Array ? e : l(e), a = ia(i.getSharedSecret(r, l("02" + t))), s = Uint8Array.from(o(16)), c = Y.encode(n), u = pe(a, s).encrypt(c);
	return `${f.encode(new Uint8Array(u))}?iv=${f.encode(new Uint8Array(s.buffer))}`;
}
function ra(e, t, n) {
	let r = e instanceof Uint8Array ? e : l(e), [a, o] = n.split("?iv="), s = ia(i.getSharedSecret(r, l("02" + t))), c = f.decode(o), u = f.decode(a), d = pe(s, c).decrypt(u);
	return J.decode(d);
}
function ia(e) {
	return e.slice(1, 33);
}
q({}, {
	NIP05_REGEX: () => aa,
	isNip05: () => oa,
	isValid: () => da,
	queryProfile: () => ua,
	searchDomain: () => la,
	useFetchImplementation: () => ca
});
var aa = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, oa = (e) => aa.test(e || ""), sa;
try {
	sa = fetch;
} catch {}
function ca(e) {
	sa = e;
}
async function la(e, t = "") {
	try {
		let n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await sa(n, { redirect: "manual" });
		if (r.status !== 200) throw Error("Wrong response code");
		return (await r.json()).names;
	} catch {
		return {};
	}
}
async function ua(e) {
	let t = e.match(aa);
	if (!t) return null;
	let [, n = "_", r] = t;
	try {
		let e = `https://${r}/.well-known/nostr.json?name=${n}`, t = await sa(e, { redirect: "manual" });
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
async function da(e, t) {
	let n = await ua(t);
	return n ? n.pubkey === e : !1;
}
q({}, { parse: () => fa });
function fa(e) {
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
	fetchRelayInformation: () => ma,
	useFetchImplementation: () => pa
});
function pa(e) {}
async function ma(e) {
	return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
q({}, {
	getPow: () => ha,
	minePow: () => _a
});
function ha(e) {
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
function ga(e) {
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
function _a(e, t) {
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
		if (ga(a) >= t) {
			r.id = p(a);
			break;
		}
	}
	return r;
}
q({}, {
	unwrapEvent: () => Xa,
	unwrapManyEvents: () => Za,
	wrapEvent: () => Ja,
	wrapManyEvents: () => Ya
}), q({}, {
	createRumor: () => Ba,
	createSeal: () => Va,
	createWrap: () => Ha,
	unwrapEvent: () => Ga,
	unwrapManyEvents: () => Ka,
	wrapEvent: () => Ua,
	wrapManyEvents: () => Wa
});
var va = {};
q(va, {
	decrypt: () => Ma,
	encrypt: () => ja,
	getConversationKey: () => Sa,
	v2: () => Na
});
var ya = 1, ba = 4294967295, xa = 65536;
function Sa(e, t) {
	let n = i.getSharedSecret(e, l("02" + t)).subarray(1, 33);
	return Ae(c, n, Y.encode("nip44-v2"));
}
function Ca(e, t) {
	let n = Ne(c, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function wa(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 2 ** (Math.floor(Math.log2(e - 1)) + 1), n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function Ta(e) {
	if (!Number.isSafeInteger(e) || e < ya || e > 65535) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
	let t = /* @__PURE__ */ new Uint8Array(2);
	return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function Ea(e) {
	if (!Number.isSafeInteger(e) || e < xa || e > ba) throw Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
	let t = /* @__PURE__ */ new Uint8Array(4);
	return new DataView(t.buffer).setUint32(0, e, !1), t;
}
function Da(e) {
	let t = Y.encode(e), n = t.length;
	if (n < ya || n > ba) throw Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
	let i = n >= xa ? r(new Uint8Array([0, 0]), Ea(n)) : Ta(n), a = new Uint8Array(wa(n) - n);
	return r(i, t, a);
}
function Oa(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = t.getUint16(0), r, i;
	if (n === 0) {
		if (r = t.getUint32(2), r < xa) throw Error("invalid padding");
		i = 6;
	} else r = n, i = 2;
	let a = e.subarray(i, i + r);
	if (r < ya || r > ba || a.length !== r || e.length !== i + wa(r)) throw Error("invalid padding");
	return J.decode(a);
}
function ka(t, n, i) {
	if (i.length !== 32) throw Error("AAD associated data must be 32 bytes");
	let a = r(i, n);
	return e(c, t, a);
}
function Aa(e) {
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
function ja(e, t, n = o(32)) {
	let { chacha_key: i, chacha_nonce: a, hmac_key: s } = Ca(t, n), c = ke(i, a, Da(e)), l = ka(s, c, n);
	return f.encode(r(new Uint8Array([2]), n, c, l));
}
function Ma(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = Aa(e), { chacha_key: a, chacha_nonce: o, hmac_key: s } = Ca(t, n);
	if (!O(ka(s, r, n), i)) throw Error("invalid MAC");
	return Oa(ke(a, o, r));
}
var Na = {
	utils: {
		getConversationKey: Sa,
		calcPaddedLen: wa,
		pad: Da,
		unpad: Oa
	},
	encrypt: ja,
	decrypt: Ma
}, Pa = 172800, Fa = () => Math.round(Date.now() / 1e3), Ia = () => Math.round(Fa() - Math.random() * Pa), La = (e, t) => Sa(e, t), Ra = (e, t, n) => ja(JSON.stringify(e), La(t, n)), za = (e, t) => JSON.parse(Ma(e.content, La(t, e.pubkey)));
function Ba(e, t) {
	let n = {
		created_at: Fa(),
		content: "",
		tags: [],
		...e,
		pubkey: Je(t)
	};
	return n.id = Ge(n), n;
}
function Va(e, t, n) {
	return Z({
		kind: gt,
		content: Ra(e, t, n),
		created_at: Ia(),
		tags: []
	}, t);
}
function Ha(e, t) {
	let n = qe();
	return Z({
		kind: Lt,
		content: Ra(e, n, t),
		created_at: Ia(),
		tags: [["p", t]]
	}, n);
}
function Ua(e, t, n) {
	return Ha(Va(Ba(e, t), t, n), n);
}
function Wa(e, t, n) {
	if (!n || n.length === 0) throw Error("At least one recipient is required.");
	let r = [Ua(e, t, Je(t))];
	return n.forEach((n) => {
		r.push(Ua(e, t, n));
	}), r;
}
function Ga(e, t) {
	if (e.kind !== Lt) throw Error(`unexpected wrap kind ${e.kind}, expected ${Lt}`);
	let n = za(e, t);
	if (n.kind !== gt) throw Error(`unexpected seal kind ${n.kind}, expected ${gt}`);
	if (!Ye(n)) throw Error("seal signature is invalid");
	let r = za(n, t);
	if (r.pubkey !== n.pubkey) throw Error(`rumor pubkey ${r.pubkey} does not match seal pubkey ${n.pubkey}`);
	return r;
}
function Ka(e, t) {
	let n = [];
	return e.forEach((e) => {
		try {
			n.push(Ga(e, t));
		} catch {}
	}), n.sort((e, t) => e.created_at - t.created_at), n;
}
function qa(e, t, n, r) {
	let i = {
		created_at: Math.ceil(Date.now() / 1e3),
		kind: _t,
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
function Ja(e, t, n, r, i) {
	return Ua(qa(t, n, r, i), e, t.publicKey);
}
function Ya(e, t, n, r, i) {
	if (!t || t.length === 0) throw Error("At least one recipient is required.");
	return [{ publicKey: Je(e) }, ...t].map((t) => Ja(e, t, n, r, i));
}
var Xa = Ga, Za = Ka;
q({}, {
	finishRepostEvent: () => Qa,
	getRepostedEvent: () => eo,
	getRepostedEventPointer: () => $a
});
function Qa(e, t, n, r) {
	let i, a = [
		...e.tags ?? [],
		[
			"e",
			t.id,
			n
		],
		["p", t.pubkey]
	];
	return t.kind === it ? i = lt : (i = yt, a.push(["k", String(t.kind)])), Z({
		kind: i,
		tags: a,
		content: e.content === "" || t.tags?.find((e) => e[0] === "-") ? "" : JSON.stringify(t),
		created_at: e.created_at
	}, r);
}
function $a(e) {
	if (![lt, yt].includes(e.kind)) return;
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
function eo(e, { skipVerification: t } = {}) {
	let n = $a(e);
	if (n === void 0 || e.content === "") return;
	let r;
	try {
		r = JSON.parse(e.content);
	} catch {
		return;
	}
	if (r.id === n.id && (t || Ye(r))) return r;
}
q({}, {
	NOSTR_URI_REGEX: () => to,
	parse: () => ro,
	test: () => no
});
var to = RegExp(`nostr:(${Hi.source})`);
function no(e) {
	return typeof e == "string" && RegExp(`^${to.source}$`).test(e);
}
function ro(e) {
	let t = e.match(RegExp(`^${to.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: Gi(t[1])
	};
}
q({}, { parse: () => uo });
function io(e) {
	if (e) return /^\d+$/.test(e) ? parseInt(e, 10) : e;
}
function ao(e, t) {
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
function oo(e) {
	switch (e[0]) {
		case "E":
		case "e": return !e[1] || !X(e[1]) ? void 0 : {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && X(e[3]) ? e[3] : void 0
		};
		case "A":
		case "a": return e[1] ? ao(e[1], e[2]) : void 0;
		case "I":
		case "i": return e[1] ? {
			value: e[1],
			hint: e[2]
		} : void 0;
	}
}
function so(e) {
	if (e[1]) {
		if (e[1].includes(":")) return ao(e[1], e[2]);
		if (X(e[1])) return {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && X(e[3]) ? e[3] : void 0
		};
	}
}
function co(e) {
	return e.findLast((e) => e.tagName === "A" || e.tagName === "a")?.pointer || e.findLast((e) => e.tagName === "I" || e.tagName === "i")?.pointer || e.findLast((e) => e.tagName === "E" || e.tagName === "e")?.pointer;
}
function lo(e, t) {
	if (!e || !("id" in e) || !e.author) return;
	let n = t.find((t) => t.pubkey === e.author);
	n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
		e.relays.indexOf(t) === -1 && e.relays.push(t);
	}), n.relays = e.relays);
}
function uo(e) {
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
		let e = oo(i);
		e && n.push({
			tagName: i[0],
			pointer: e
		});
	} else if ((i[0] === "e" || i[0] === "a" || i[0] === "i") && i[1]) {
		let e = oo(i);
		e && r.push({
			tagName: i[0],
			pointer: e
		});
	} else if (i[0] === "K") t.rootKind = io(i[1]);
	else if (i[0] === "k") t.replyKind = io(i[1]);
	else if (i[0] === "q") {
		let e = so(i);
		e && t.quotes.push(e);
	} else (i[0] === "P" || i[0] === "p") && i[1] && X(i[1]) && t.profiles.push({
		pubkey: i[1],
		relays: i[2] ? [i[2]] : []
	});
	return t.root = co(n), t.reply = co(r), lo(t.root, t.profiles), lo(t.reply, t.profiles), t.quotes.forEach((e) => lo(e, t.profiles)), t;
}
q({}, {
	finishReactionEvent: () => fo,
	getReactedEventPointer: () => po
});
function fo(e, t, n) {
	let r = t.tags.filter((e) => e.length >= 2 && (e[0] === "e" || e[0] === "p"));
	return Z({
		...e,
		kind: ut,
		tags: [
			...e.tags ?? [],
			...r,
			["e", t.id],
			["p", t.pubkey]
		],
		content: e.content ?? "+"
	}, n);
}
function po(e) {
	if (e.kind !== ut) return;
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
q({}, { parse: () => _o });
var mo = /\W/m, ho = /[^\w\/] |[^\w\/]$|$|,| /m, go = 42;
function* _o(e) {
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
			if (o === 0 || e[o - 1].match(mo)) {
				let t = e.slice(o + 1, o + go).match(mo), a = t ? o + 1 + t.index : n;
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
			let t = e.slice(a + 60).match(mo), o = t ? a + 60 + t.index : n;
			try {
				let t, { data: n, type: s } = Gi(e.slice(a + 1, o));
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
			let t = e.slice(a + 4).match(ho), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 5 : 4;
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
			let t = e.slice(a + 4).match(ho), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 3 : 2;
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
	channelCreateEvent: () => vo,
	channelHideMessageEvent: () => xo,
	channelMessageEvent: () => bo,
	channelMetadataEvent: () => yo,
	channelMuteUserEvent: () => So
});
var vo = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Z({
		kind: Tt,
		tags: [...e.tags ?? []],
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
		tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, bo = (e, t) => {
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
		kind: Dt,
		tags: [...n, ...e.tags ?? []],
		content: e.content,
		created_at: e.created_at
	}, t);
}, xo = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Z({
		kind: Ot,
		tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, So = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return Z({
		kind: kt,
		tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
};
q({}, {
	EMOJI_SHORTCODE_REGEX: () => Co,
	matchAll: () => To,
	regex: () => wo,
	replaceAll: () => Eo
});
var Co = /:(\w+):/, wo = () => RegExp(`\\B${Co.source}\\B`, "g");
function* To(e) {
	let t = e.matchAll(wo());
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
function Eo(e, t) {
	return e.replaceAll(wo(), (e, n) => t({
		shortcode: e,
		name: n
	}));
}
q({}, {
	useFetchImplementation: () => Oo,
	validateGithub: () => ko
});
var Do;
try {
	Do = fetch;
} catch {}
function Oo(e) {
	Do = e;
}
async function ko(e, t, n) {
	try {
		return await (await Do(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
q({}, {
	makeNwcRequestEvent: () => jo,
	parseConnectionString: () => Ao
});
function Ao(e) {
	let { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, a = r.getAll("relay"), o = r.get("secret");
	if (!i || a.length === 0 || !o) throw Error("invalid connection string");
	return {
		pubkey: i,
		relay: a[0],
		relays: a,
		secret: o
	};
}
async function jo(e, t, n) {
	let r = na(t, e, JSON.stringify({
		method: "pay_invoice",
		params: { invoice: n }
	}));
	return Z({
		kind: vr,
		created_at: Math.round(Date.now() / 1e3),
		content: r,
		tags: [["p", e]]
	}, t);
}
q({}, { normalizeIdentifier: () => Mo });
function Mo(e) {
	return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((e) => /\p{Letter}/u.test(e) || /\p{Number}/u.test(e) ? e : "-").join("");
}
q({}, {
	getSatoshisAmountFromBolt11: () => zo,
	getZapEndpoint: () => Fo,
	makeZapReceipt: () => Ro,
	makeZapRequest: () => Io,
	useFetchImplementation: () => Po,
	validateZapRequest: () => Lo
});
var No;
try {
	No = fetch;
} catch {}
function Po(e) {
	No = e;
}
async function Fo(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (r) {
			let [e, n] = r.split("@");
			t = new URL(`/.well-known/lnurlp/${e}`, `https://${n}`).toString();
		} else if (n) {
			let { words: e } = s.decode(n, 1e3), r = s.fromWords(e);
			t = J.decode(r);
		} else return null;
		let i = await (await No(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function Io(e) {
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
		if (t.tags.push(["e", e.event.id]), Qe(e.event.kind)) {
			let n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
			t.tags.push(n);
		} else if (et(e.event.kind)) {
			let n = e.event.tags.find(([e, t]) => e === "d" && t);
			if (!n) throw Error("d tag not found or is empty");
			let r = ["a", `${e.event.kind}:${e.event.pubkey}:${n[1]}`];
			t.tags.push(r);
		}
		t.tags.push(["k", e.event.kind.toString()]);
	}
	return t;
}
function Lo(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!He(t)) return "Zap request is not a valid Nostr event.";
	if (!Ye(t)) return "Invalid signature on zap request.";
	let n = t.tags.find(([e, t]) => e === "p" && t);
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!X(n[1])) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find(([e, t]) => e === "e" && t);
	return r && !X(r[1]) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([e, t]) => e === "relays" && t) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Ro({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
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
function zo(e) {
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
	Negentropy: () => Yo,
	NegentropyStorageVector: () => Jo,
	NegentropySync: () => Qo
});
var Bo = 97, Vo = 32, Ho = 16, Uo = {
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
function Wo(e) {
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
function Go(e) {
	return Ko(e, 1)[0];
}
function Ko(e, t) {
	if (e.length < t) throw Error("parse ends prematurely");
	return e.shiftN(t);
}
var qo = class {
	buf;
	constructor() {
		this.setToZero();
	}
	setToZero() {
		this.buf = new Uint8Array(Vo);
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
		let t = new Uint8Array(Vo);
		t[0] = 1, this.add(t);
	}
	getFingerprint(e) {
		let t = new Q();
		return t.extend(this.buf), t.extend($(e)), c(t.unwrap()).subarray(0, Ho);
	}
}, Jo = class {
	items;
	sealed;
	constructor() {
		this.items = [], this.sealed = !1;
	}
	insert(e, t) {
		if (this.sealed) throw Error("already sealed");
		let n = l(t);
		if (n.byteLength !== Vo) throw Error("bad id size for added item");
		this.items.push({
			timestamp: e,
			id: n
		});
	}
	seal() {
		if (this.sealed) throw Error("already sealed");
		this.sealed = !0, this.items.sort(Zo);
		for (let e = 1; e < this.items.length; e++) if (Zo(this.items[e - 1], this.items[e]) === 0) throw Error("duplicate item inserted");
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
		return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (e) => Zo(e, n) < 0);
	}
	fingerprint(e, t) {
		let n = new qo();
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
}, Yo = class {
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
		return e.extend(new Uint8Array([Bo])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), p(e.unwrap());
	}
	reconcile(e, t, n) {
		let r = new Q(l(e));
		this.lastTimestampIn = this.lastTimestampOut = 0;
		let i = new Q();
		i.extend(new Uint8Array([Bo]));
		let a = Go(r);
		if (a < 96 || a > 111) throw Error("invalid negentropy protocol version byte");
		if (a !== Bo) throw Error("unsupported negentropy protocol version requested: " + (a - 96));
		let o = this.storage.size(), s = this._bound(0), c = 0, u = !1;
		for (; r.length !== 0;) {
			let e = new Q(), a = () => {
				u && (u = !1, e.extend(this.encodeBound(s)), e.extend($(Uo.Skip)));
			}, l = this.decodeBound(r), d = Wo(r), f = c, m = this.storage.findLowerBound(c, o, l);
			if (d === Uo.Skip) u = !0;
			else if (d === Uo.Fingerprint) Xo(Ko(r, Ho), this.storage.fingerprint(f, m)) === 0 ? u = !0 : (a(), this.splitRange(f, m, l, e));
			else if (d === Uo.IdList) {
				let e = Wo(r), i = {};
				for (let t = 0; t < e; t++) {
					let e = Ko(r, Vo);
					i[p(e)] = e;
				}
				if (u = !0, this.storage.iterate(f, m, (e) => {
					let n = e.id, r = p(n);
					return i[r] ? delete i[p(n)] : t?.(r), !0;
				}), n) for (let e of Object.values(i)) n(p(e));
			} else throw Error("unexpected mode");
			if (this.exceededFrameSizeLimit(i.length + e.length)) {
				let e = this.storage.fingerprint(m, o);
				i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend($(Uo.Fingerprint)), i.extend(e);
				break;
			}
			i.extend(e), c = m, s = l;
		}
		return i.length === 1 ? null : p(i.unwrap());
	}
	splitRange(e, t, n, r) {
		let i = t - e;
		if (i < 32) r.extend(this.encodeBound(n)), r.extend($(Uo.IdList)), r.extend($(i)), this.storage.iterate(e, t, (e) => (r.extend(e.id), !0));
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
				r.extend(this.encodeBound(l)), r.extend($(Uo.Fingerprint)), r.extend(c);
			}
		}
	}
	exceededFrameSizeLimit(e) {
		return e > this.frameSizeLimit - 200;
	}
	decodeTimestampIn(e) {
		let t = Wo(e);
		return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
	}
	decodeBound(e) {
		let t = this.decodeTimestampIn(e), n = Wo(e);
		if (n > Vo) throw Error("bound key too long");
		return {
			timestamp: t,
			id: Ko(e, n)
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
			for (let e = 0; e < Vo && r[e] === i[e]; e++) n++;
			return this._bound(t.timestamp, t.id.subarray(0, n + 1));
		}
	}
};
function Xo(e, t) {
	for (let n = 0; n < e.byteLength; n++) {
		if (e[n] < t[n]) return -1;
		if (e[n] > t[n]) return 1;
	}
	return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function Zo(e, t) {
	return e.timestamp === t.timestamp ? Xo(e.id, t.id) : e.timestamp - t.timestamp;
}
var Qo = class {
	relay;
	storage;
	neg;
	filter;
	subscription;
	onhave;
	onneed;
	constructor(e, t, n, r = {}) {
		this.relay = e, this.storage = t, this.neg = new Yo(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (e) => {
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
	getToken: () => es,
	hashPayload: () => ss,
	unpackEventFromToken: () => ns,
	validateEvent: () => ls,
	validateEventKind: () => is,
	validateEventMethodTag: () => os,
	validateEventPayloadTag: () => cs,
	validateEventTimestamp: () => rs,
	validateEventUrlTag: () => as,
	validateToken: () => ts
});
var $o = "Nostr ";
async function es(e, t, n, r = !1, i) {
	let a = {
		kind: Sr,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	i && a.tags.push(["payload", ss(i)]);
	let o = await n(a);
	return (r ? $o : "") + f.encode(Y.encode(JSON.stringify(o)));
}
async function ts(e, t, n) {
	return await ls(await ns(e).catch((e) => {
		throw e;
	}), t, n).catch((e) => {
		throw e;
	});
}
async function ns(e) {
	if (!e) throw Error("Missing token");
	e = e.replace($o, "");
	let t = J.decode(f.decode(e));
	if (!t || t.length === 0 || !t.startsWith("{")) throw Error("Invalid token");
	return JSON.parse(t);
}
function rs(e) {
	return e.created_at ? Math.abs(Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at) < 60 : !1;
}
function is(e) {
	return e.kind === Sr;
}
function as(e, t) {
	let n = e.tags.find((e) => e[0] === "u");
	return n ? n.length > 0 && n[1] === t : !1;
}
function os(e, t) {
	let n = e.tags.find((e) => e[0] === "method");
	return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function ss(e) {
	let t = c(Y.encode(JSON.stringify(e)));
	return p(t);
}
function cs(e, t) {
	let n = e.tags.find((e) => e[0] === "payload");
	if (!n) return !1;
	let r = ss(t);
	return n.length > 0 && n[1] === r;
}
async function ls(e, t, n, r) {
	if (!Ye(e)) throw Error("Invalid nostr event, signature invalid");
	if (!is(e)) throw Error("Invalid nostr event, kind invalid");
	if (!rs(e)) throw Error("Invalid nostr event, created_at timestamp invalid");
	if (!as(e, t)) throw Error("Invalid nostr event, url tag invalid");
	if (!os(e, n)) throw Error("Invalid nostr event, method tag invalid");
	if (r && typeof r == "object" && Object.keys(r).length > 0 && !cs(e, r)) throw Error("Invalid nostr event, payload tag does not match request body hash");
	return !0;
}
export { zi as a, Ye as c, ke as d, O as f, ji as i, Ne as l, _ as m, Je as n, va as o, g as p, Xe as r, He as s, Ge as t, Ae as u };
