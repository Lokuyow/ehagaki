import { a as e, c as t, d as n, f as r, i, l as a, m as o, n as s, o as c, p as l, r as u, s as d, t as f, u as p } from "./base-CVnVyhoG.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/appStorage.ts
var m, h = "ehagaki.web-component.v1:", g = /* @__PURE__ */ new Map(), _ = {
	get length() {
		return g.size;
	},
	clear() {
		g.clear();
	},
	getItem(e) {
		return g.get(e) ?? null;
	},
	key(e) {
		return [...g.keys()][e] ?? null;
	},
	removeItem(e) {
		g.delete(e);
	},
	setItem(e, t) {
		g.set(e, String(t));
	}
};
function ee() {
	if (typeof globalThis < "u") {
		let e = globalThis.localStorage;
		if (e) return e;
	}
	return _;
}
function te() {
	return m ?? ee();
}
function ne(e) {
	m = e;
}
function v(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += 1) {
		let i = e.key(r);
		i?.startsWith(t) && n.push(i.slice(t.length));
	}
	return n;
}
function y(e, t) {
	return {
		get length() {
			return v(e, t).length;
		},
		clear() {
			let n = v(e, t);
			for (let r of n) e.removeItem(`${t}${r}`);
		},
		getItem(n) {
			return e.getItem(`${t}${n}`);
		},
		key(n) {
			return v(e, t)[n] ?? null;
		},
		removeItem(n) {
			e.removeItem(`${t}${n}`);
		},
		setItem(n, r) {
			e.setItem(`${t}${n}`, String(r));
		}
	};
}
function b(e) {
	return y(e, h);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/appRuntimeEnvironment.ts
function x() {
	return { style: {
		setProperty: () => void 0,
		removeProperty: () => "",
		getPropertyValue: () => ""
	} };
}
function S() {
	let e = typeof window < "u" ? window : void 0, t = e?.document, n = t?.documentElement ?? x(), r = t?.body ?? n;
	return {
		storage: te(),
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
var C = S();
function w(e) {
	return C = {
		...C,
		...e
	}, ne(C.storage), C;
}
function T() {
	return C;
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/utils.js
function E(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function D(e) {
	if (typeof e != "boolean") throw Error(`boolean expected, not ${e}`);
}
function O(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error("positive integer expected, got " + e);
}
function k(e, t, n = "") {
	let r = E(e), i = e?.length, a = t !== void 0;
	if (!r || a && i !== t) {
		let o = n && `"${n}" `, s = a ? ` of length ${t}` : "", c = r ? `length=${i}` : `type=${typeof e}`;
		throw Error(o + "expected Uint8Array" + s + ", got " + c);
	}
	return e;
}
function A(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function j(e, t) {
	k(e, void 0, "output");
	let n = t.outputLen;
	if (e.length < n) throw Error("digestInto() expects output buffer of length at least " + n);
}
function M(e) {
	return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function N(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
var P = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function F(e, t) {
	return e.buffer === t.buffer && e.byteOffset < t.byteOffset + t.byteLength && t.byteOffset < e.byteOffset + e.byteLength;
}
function I(e, t) {
	if (F(e, t) && e.byteOffset < t.byteOffset) throw Error("complex overlap of input and output is not supported");
}
function L(e, t) {
	if (typeof t != "object" || !t) throw Error("options must be defined");
	return Object.assign(e, t);
}
function R(e, t) {
	if (e.length !== t.length) return !1;
	let n = 0;
	for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
	return n === 0;
}
var re = (e, t) => {
	function n(n, ...r) {
		if (k(n, void 0, "key"), !P) throw Error("Non little-endian hardware is not yet supported");
		if (e.nonceLength !== void 0) {
			let t = r[0];
			k(t, e.varSizeNonce ? void 0 : e.nonceLength, "nonce");
		}
		let i = e.tagLength;
		i && r[1] !== void 0 && k(r[1], void 0, "AAD");
		let a = t(n, ...r), o = (e, t) => {
			if (t !== void 0) {
				if (e !== 2) throw Error("cipher output not supported");
				k(t, void 0, "output");
			}
		}, s = !1;
		return {
			encrypt(e, t) {
				if (s) throw Error("cannot encrypt() twice with same key + nonce");
				return s = !0, k(e), o(a.encrypt.length, t), a.encrypt(e, t);
			},
			decrypt(e, t) {
				if (k(e), i && e.length < i) throw Error("\"ciphertext\" expected length bigger than tagLength=" + i);
				return o(a.decrypt.length, t), a.decrypt(e, t);
			}
		};
	}
	return Object.assign(n, e), n;
};
function z(e, t, n = !0) {
	if (t === void 0) return new Uint8Array(e);
	if (t.length !== e) throw Error("\"output\" expected Uint8Array of length " + e + ", got: " + t.length);
	if (n && !B(t)) throw Error("invalid output, must be aligned");
	return t;
}
function B(e) {
	return e.byteOffset % 4 == 0;
}
function V(e) {
	return Uint8Array.from(e);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/aes.js
var ie = 16, ae = 283;
function oe(e) {
	if (![
		16,
		24,
		32
	].includes(e.length)) throw Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + e.length);
}
function se(e) {
	return e << 1 ^ ae & -(e >> 7);
}
function ce(e, t) {
	let n = 0;
	for (; t > 0; t >>= 1) n ^= e & -(t & 1), e = se(e);
	return n;
}
var le = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(256);
	for (let t = 0, n = 1; t < 256; t++, n ^= se(n)) e[t] = n;
	let t = /* @__PURE__ */ new Uint8Array(256);
	t[0] = 99;
	for (let n = 0; n < 255; n++) {
		let r = e[255 - n];
		r |= r << 8, t[e[n]] = (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99) & 255;
	}
	return N(e), t;
})(), ue = /* @__PURE__ */ le.map((e, t) => le.indexOf(t)), de = (e) => e << 24 | e >>> 8, fe = (e) => e << 8 | e >>> 24;
function pe(e, t) {
	if (e.length !== 256) throw Error("Wrong sbox length");
	let n = (/* @__PURE__ */ new Uint32Array(256)).map((n, r) => t(e[r])), r = n.map(fe), i = r.map(fe), a = i.map(fe), o = /* @__PURE__ */ new Uint32Array(65536), s = /* @__PURE__ */ new Uint32Array(65536), c = /* @__PURE__ */ new Uint16Array(65536);
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
var me = /* @__PURE__ */ pe(le, (e) => ce(e, 3) << 24 | e << 16 | e << 8 | ce(e, 2)), he = /* @__PURE__ */ pe(ue, (e) => ce(e, 11) << 24 | ce(e, 13) << 16 | ce(e, 9) << 8 | ce(e, 14)), ge = /* @__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(16);
	for (let t = 0, n = 1; t < 16; t++, n = se(n)) e[t] = n;
	return e;
})();
function _e(e) {
	k(e);
	let t = e.length;
	oe(e);
	let { sbox2: n } = me, r = [];
	B(e) || r.push(e = V(e));
	let i = M(e), a = i.length, o = (e) => U(n, e, e, e, e), s = new Uint32Array(t + 28);
	s.set(i);
	for (let e = a; e < s.length; e++) {
		let t = s[e - 1];
		e % a === 0 ? t = o(de(t)) ^ ge[e / a - 1] : a > 6 && e % a === 4 && (t = o(t)), s[e] = s[e - a] ^ t;
	}
	return N(...r), s;
}
function ve(e) {
	let t = _e(e), n = t.slice(), r = t.length, { sbox2: i } = me, { T0: a, T1: o, T2: s, T3: c } = he;
	for (let e = 0; e < r; e += 4) for (let i = 0; i < 4; i++) n[e + i] = t[r - e - 4 + i];
	N(t);
	for (let e = 4; e < r - 4; e++) {
		let t = n[e], r = U(i, t, t, t, t);
		n[e] = a[r & 255] ^ o[r >>> 8 & 255] ^ s[r >>> 16 & 255] ^ c[r >>> 24];
	}
	return n;
}
function H(e, t, n, r, i, a) {
	return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | a >>> 24 & 255];
}
function U(e, t, n, r, i) {
	return e[t & 255 | n & 65280] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function ye(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = me, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ H(o, s, t, n, r, i), l = e[c++] ^ H(o, s, n, r, i, t), u = e[c++] ^ H(o, s, r, i, t, n), d = e[c++] ^ H(o, s, i, t, n, r);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ U(a, t, n, r, i),
		s1: e[c++] ^ U(a, n, r, i, t),
		s2: e[c++] ^ U(a, r, i, t, n),
		s3: e[c++] ^ U(a, i, t, n, r)
	};
}
function be(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = he, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ H(o, s, t, i, r, n), l = e[c++] ^ H(o, s, n, t, i, r), u = e[c++] ^ H(o, s, r, n, t, i), d = e[c++] ^ H(o, s, i, r, n, t);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ U(a, t, i, r, n),
		s1: e[c++] ^ U(a, n, t, i, r),
		s2: e[c++] ^ U(a, r, n, t, i),
		s3: e[c++] ^ U(a, i, r, n, t)
	};
}
function xe(e) {
	if (k(e), e.length % ie !== 0) throw Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function Se(e, t, n) {
	k(e);
	let r = e.length, i = r % ie;
	if (!t && i !== 0) throw Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	B(e) || (e = V(e));
	let a = M(e);
	if (t) {
		let e = ie - i;
		e ||= ie, r += e;
	}
	return n = z(r, n), I(e, n), {
		b: a,
		o: M(n),
		out: n
	};
}
function Ce(e, t) {
	if (!t) return e;
	let n = e.length;
	if (!n) throw Error("aes/pcks5: empty ciphertext not allowed");
	let r = e[n - 1];
	if (r <= 0 || r > 16) throw Error("aes/pcks5: wrong padding");
	let i = e.subarray(0, -r);
	for (let t = 0; t < r; t++) if (e[n - t - 1] !== r) throw Error("aes/pcks5: wrong padding");
	return i;
}
function we(e) {
	let t = /* @__PURE__ */ new Uint8Array(16), n = M(t);
	t.set(e);
	let r = ie - e.length;
	for (let e = ie - r; e < ie; e++) t[e] = r;
	return n;
}
var Te = /* @__PURE__ */ re({
	blockSize: 16,
	nonceLength: 16
}, function(e, t, n = {}) {
	let r = !n.disablePadding;
	return {
		encrypt(n, i) {
			let a = _e(e), { b: o, o: s, out: c } = Se(n, r, i), l = t, u = [a];
			B(l) || u.push(l = V(l));
			let d = M(l), f = d[0], p = d[1], m = d[2], h = d[3], g = 0;
			for (; g + 4 <= o.length;) f ^= o[g + 0], p ^= o[g + 1], m ^= o[g + 2], h ^= o[g + 3], {s0: f, s1: p, s2: m, s3: h} = ye(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			if (r) {
				let e = we(n.subarray(g * 4));
				f ^= e[0], p ^= e[1], m ^= e[2], h ^= e[3], {s0: f, s1: p, s2: m, s3: h} = ye(a, f, p, m, h), s[g++] = f, s[g++] = p, s[g++] = m, s[g++] = h;
			}
			return N(...u), c;
		},
		decrypt(n, i) {
			xe(n);
			let a = ve(e), o = t, s = [a];
			B(o) || s.push(o = V(o));
			let c = M(o);
			i = z(n.length, i), B(n) || s.push(n = V(n)), I(n, i);
			let l = M(n), u = M(i), d = c[0], f = c[1], p = c[2], m = c[3];
			for (let e = 0; e + 4 <= l.length;) {
				let t = d, n = f, r = p, i = m;
				d = l[e + 0], f = l[e + 1], p = l[e + 2], m = l[e + 3];
				let { s0: o, s1: s, s2: c, s3: h } = be(a, d, f, p, m);
				u[e++] = o ^ t, u[e++] = s ^ n, u[e++] = c ^ r, u[e++] = h ^ i;
			}
			return N(...s), Ce(i, r);
		}
	};
}), Ee = (e) => Uint8Array.from(e.split(""), (e) => e.charCodeAt(0)), De = Ee("expand 16-byte k"), Oe = Ee("expand 32-byte k"), ke = M(De), Ae = M(Oe);
function W(e, t) {
	return e << t | e >>> 32 - t;
}
function je(e) {
	return e.byteOffset % 4 == 0;
}
var Me = 64, Ne = 16, Pe = 2 ** 32 - 1, Fe = Uint32Array.of();
function Ie(e, t, n, r, i, a, o, s) {
	let c = i.length, l = new Uint8Array(Me), u = M(l), d = je(i) && je(a), f = d ? M(i) : Fe, p = d ? M(a) : Fe;
	for (let m = 0; m < c; o++) {
		if (e(t, n, r, u, o, s), o >= Pe) throw Error("arx: counter overflow");
		let h = Math.min(Me, c - m);
		if (d && h === Me) {
			let e = m / 4;
			if (m % 4 != 0) throw Error("arx: invalid block position");
			for (let t = 0, n; t < Ne; t++) n = e + t, p[n] = f[n] ^ u[t];
			m += Me;
		} else {
			for (let e = 0, t; e < h; e++) t = m + e, a[t] = i[t] ^ l[e];
			m += h;
		}
	}
}
function Le(e, t) {
	let { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: a, rounds: o } = L({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, t);
	if (typeof e != "function") throw Error("core must be a function");
	return O(i), O(o), D(a), D(n), (t, s, c, l, u = 0) => {
		k(t, void 0, "key"), k(s, void 0, "nonce"), k(c, void 0, "data");
		let d = c.length;
		if (l === void 0 && (l = new Uint8Array(d)), k(l, void 0, "output"), O(u), u < 0 || u >= Pe) throw Error("arx: counter overflow");
		if (l.length < d) throw Error(`arx: output (${l.length}) is shorter than data (${d})`);
		let f = [], p = t.length, m, h;
		if (p === 32) f.push(m = V(t)), h = Ae;
		else if (p === 16 && n) m = /* @__PURE__ */ new Uint8Array(32), m.set(t), m.set(t, 16), h = ke, f.push(m);
		else throw k(t, 32, "arx key"), Error("invalid key size");
		je(s) || f.push(s = V(s));
		let g = M(m);
		if (r) {
			if (s.length !== 24) throw Error("arx: extended nonce must be 24 bytes");
			r(h, g, M(s.subarray(0, 16)), g), s = s.subarray(16);
		}
		let _ = 16 - i;
		if (_ !== s.length) throw Error(`arx: nonce must be ${_} or 16 bytes`);
		if (_ !== 12) {
			let e = /* @__PURE__ */ new Uint8Array(12);
			e.set(s, a ? 0 : 12 - s.length), s = e, f.push(s);
		}
		let ee = M(s);
		return Ie(e, h, g, ee, c, l, u, o), N(...f), l;
	};
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/_poly1305.js
function G(e, t) {
	return e[t++] & 255 | (e[t++] & 255) << 8;
}
var Re = class {
	blockLen = 16;
	outputLen = 16;
	buffer = /* @__PURE__ */ new Uint8Array(16);
	r = /* @__PURE__ */ new Uint16Array(10);
	h = /* @__PURE__ */ new Uint16Array(10);
	pad = /* @__PURE__ */ new Uint16Array(8);
	pos = 0;
	finished = !1;
	constructor(e) {
		e = V(k(e, 32, "key"));
		let t = G(e, 0), n = G(e, 2), r = G(e, 4), i = G(e, 6), a = G(e, 8), o = G(e, 10), s = G(e, 12), c = G(e, 14);
		this.r[0] = t & 8191, this.r[1] = (t >>> 13 | n << 3) & 8191, this.r[2] = (n >>> 10 | r << 6) & 7939, this.r[3] = (r >>> 7 | i << 9) & 8191, this.r[4] = (i >>> 4 | a << 12) & 255, this.r[5] = a >>> 1 & 8190, this.r[6] = (a >>> 14 | o << 2) & 8191, this.r[7] = (o >>> 11 | s << 5) & 8065, this.r[8] = (s >>> 8 | c << 8) & 8191, this.r[9] = c >>> 5 & 127;
		for (let t = 0; t < 8; t++) this.pad[t] = G(e, 16 + 2 * t);
	}
	process(e, t, n = !1) {
		let r = n ? 0 : 2048, { h: i, r: a } = this, o = a[0], s = a[1], c = a[2], l = a[3], u = a[4], d = a[5], f = a[6], p = a[7], m = a[8], h = a[9], g = G(e, t + 0), _ = G(e, t + 2), ee = G(e, t + 4), te = G(e, t + 6), ne = G(e, t + 8), v = G(e, t + 10), y = G(e, t + 12), b = G(e, t + 14), x = i[0] + (g & 8191), S = i[1] + ((g >>> 13 | _ << 3) & 8191), C = i[2] + ((_ >>> 10 | ee << 6) & 8191), w = i[3] + ((ee >>> 7 | te << 9) & 8191), T = i[4] + ((te >>> 4 | ne << 12) & 8191), E = i[5] + (ne >>> 1 & 8191), D = i[6] + ((ne >>> 14 | v << 2) & 8191), O = i[7] + ((v >>> 11 | y << 5) & 8191), k = i[8] + ((y >>> 8 | b << 8) & 8191), A = i[9] + (b >>> 5 | r), j = 0, M = j + x * o + 5 * h * S + 5 * m * C + 5 * p * w + 5 * f * T;
		j = M >>> 13, M &= 8191, M += 5 * d * E + 5 * u * D + 5 * l * O + 5 * c * k + 5 * s * A, j += M >>> 13, M &= 8191;
		let N = j + x * s + S * o + 5 * h * C + 5 * m * w + 5 * p * T;
		j = N >>> 13, N &= 8191, N += 5 * f * E + 5 * d * D + 5 * u * O + 5 * l * k + 5 * c * A, j += N >>> 13, N &= 8191;
		let P = j + x * c + S * s + C * o + 5 * h * w + 5 * m * T;
		j = P >>> 13, P &= 8191, P += 5 * p * E + 5 * f * D + 5 * d * O + 5 * u * k + 5 * l * A, j += P >>> 13, P &= 8191;
		let F = j + x * l + S * c + C * s + w * o + 5 * h * T;
		j = F >>> 13, F &= 8191, F += 5 * m * E + 5 * p * D + 5 * f * O + 5 * d * k + 5 * u * A, j += F >>> 13, F &= 8191;
		let I = j + x * u + S * l + C * c + w * s + T * o;
		j = I >>> 13, I &= 8191, I += 5 * h * E + 5 * m * D + 5 * p * O + 5 * f * k + 5 * d * A, j += I >>> 13, I &= 8191;
		let L = j + x * d + S * u + C * l + w * c + T * s;
		j = L >>> 13, L &= 8191, L += E * o + 5 * h * D + 5 * m * O + 5 * p * k + 5 * f * A, j += L >>> 13, L &= 8191;
		let R = j + x * f + S * d + C * u + w * l + T * c;
		j = R >>> 13, R &= 8191, R += E * s + D * o + 5 * h * O + 5 * m * k + 5 * p * A, j += R >>> 13, R &= 8191;
		let re = j + x * p + S * f + C * d + w * u + T * l;
		j = re >>> 13, re &= 8191, re += E * c + D * s + O * o + 5 * h * k + 5 * m * A, j += re >>> 13, re &= 8191;
		let z = j + x * m + S * p + C * f + w * d + T * u;
		j = z >>> 13, z &= 8191, z += E * l + D * c + O * s + k * o + 5 * h * A, j += z >>> 13, z &= 8191;
		let B = j + x * h + S * m + C * p + w * f + T * d;
		j = B >>> 13, B &= 8191, B += E * u + D * l + O * c + k * s + A * o, j += B >>> 13, B &= 8191, j = (j << 2) + j | 0, j = j + M | 0, M = j & 8191, j >>>= 13, N += j, i[0] = M, i[1] = N, i[2] = P, i[3] = F, i[4] = I, i[5] = L, i[6] = R, i[7] = re, i[8] = z, i[9] = B;
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
		N(n);
	}
	update(e) {
		A(this), k(e), e = V(e);
		let { buffer: t, blockLen: n } = this, r = e.length;
		for (let i = 0; i < r;) {
			let a = Math.min(n - this.pos, r - i);
			if (a === n) for (; n <= r - i; i += n) this.process(e, i);
			else t.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === n && (this.process(t, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		N(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		A(this), j(e, this), this.finished = !0;
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
function ze(e) {
	let t = (t, n) => e(n).update(t).digest(), n = e(/* @__PURE__ */ new Uint8Array(32));
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
}
ze((e) => new Re(e));
// D:/ドキュメント/GitHub/ehagaki/node_modules/@noble/ciphers/chacha.js
function Be(e, t, n, r, i, a = 20) {
	let o = e[0], s = e[1], c = e[2], l = e[3], u = t[0], d = t[1], f = t[2], p = t[3], m = t[4], h = t[5], g = t[6], _ = t[7], ee = i, te = n[0], ne = n[1], v = n[2], y = o, b = s, x = c, S = l, C = u, w = d, T = f, E = p, D = m, O = h, k = g, A = _, j = ee, M = te, N = ne, P = v;
	for (let e = 0; e < a; e += 2) y = y + C | 0, j = W(j ^ y, 16), D = D + j | 0, C = W(C ^ D, 12), y = y + C | 0, j = W(j ^ y, 8), D = D + j | 0, C = W(C ^ D, 7), b = b + w | 0, M = W(M ^ b, 16), O = O + M | 0, w = W(w ^ O, 12), b = b + w | 0, M = W(M ^ b, 8), O = O + M | 0, w = W(w ^ O, 7), x = x + T | 0, N = W(N ^ x, 16), k = k + N | 0, T = W(T ^ k, 12), x = x + T | 0, N = W(N ^ x, 8), k = k + N | 0, T = W(T ^ k, 7), S = S + E | 0, P = W(P ^ S, 16), A = A + P | 0, E = W(E ^ A, 12), S = S + E | 0, P = W(P ^ S, 8), A = A + P | 0, E = W(E ^ A, 7), y = y + w | 0, P = W(P ^ y, 16), k = k + P | 0, w = W(w ^ k, 12), y = y + w | 0, P = W(P ^ y, 8), k = k + P | 0, w = W(w ^ k, 7), b = b + T | 0, j = W(j ^ b, 16), A = A + j | 0, T = W(T ^ A, 12), b = b + T | 0, j = W(j ^ b, 8), A = A + j | 0, T = W(T ^ A, 7), x = x + E | 0, M = W(M ^ x, 16), D = D + M | 0, E = W(E ^ D, 12), x = x + E | 0, M = W(M ^ x, 8), D = D + M | 0, E = W(E ^ D, 7), S = S + C | 0, N = W(N ^ S, 16), O = O + N | 0, C = W(C ^ O, 12), S = S + C | 0, N = W(N ^ S, 8), O = O + N | 0, C = W(C ^ O, 7);
	let F = 0;
	r[F++] = o + y | 0, r[F++] = s + b | 0, r[F++] = c + x | 0, r[F++] = l + S | 0, r[F++] = u + C | 0, r[F++] = d + w | 0, r[F++] = f + T | 0, r[F++] = p + E | 0, r[F++] = m + D | 0, r[F++] = h + O | 0, r[F++] = g + k | 0, r[F++] = _ + A | 0, r[F++] = ee + j | 0, r[F++] = te + M | 0, r[F++] = ne + N | 0, r[F++] = v + P | 0;
}
var Ve = /* @__PURE__ */ Le(Be, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
});
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/node_modules/@noble/hashes/hkdf.js
function He(n, r, i) {
	return t(n), i === void 0 && (i = new Uint8Array(n.outputLen)), e(n, i, r);
}
var Ue = /* @__PURE__ */ Uint8Array.of(0), We = /* @__PURE__ */ Uint8Array.of();
function Ge(r, i, o, s = 32) {
	t(r), a(s, "length");
	let c = r.outputLen;
	if (s > 255 * c) throw Error("Length must be <= 255*HashLen");
	let l = Math.ceil(s / c);
	o === void 0 ? o = We : d(o, void 0, "info");
	let u = new Uint8Array(l * c), f = e.create(r, i), p = f._cloneInto(), m = new Uint8Array(f.outputLen);
	for (let e = 0; e < l; e++) Ue[0] = e + 1, p.update(e === 0 ? We : m).update(o).update(Ue).digestInto(m), u.set(m, c * e), f._cloneInto(p);
	return f.destroy(), p.destroy(), n(m, Ue), u.slice(0, s);
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-tools/lib/esm/index.js
var Ke = Object.defineProperty, K = (e, t) => {
	for (var n in t) Ke(e, n, {
		get: t[n],
		enumerable: !0
	});
}, qe = {};
K(qe, {
	binarySearch: () => Ze,
	bytesToHex: () => p,
	hexToBytes: () => l,
	insertEventIntoAscendingList: () => Xe,
	insertEventIntoDescendingList: () => Ye,
	isHex32: () => Y,
	mergeReverseSortedLists: () => Qe,
	normalizeURL: () => Je,
	utf8Decoder: () => q,
	utf8Encoder: () => J
});
var q = new TextDecoder("utf-8"), J = new TextEncoder();
function Je(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
function Ye(e, t) {
	let [n, r] = Ze(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : e.created_at - t.created_at);
	return r || e.splice(n, 0, t), e;
}
function Xe(e, t) {
	let [n, r] = Ze(e, (e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : t.created_at - e.created_at);
	return r || e.splice(n, 0, t), e;
}
function Ze(e, t) {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = t(e[i]);
		if (a === 0) return [i, !0];
		a < 0 ? r = i - 1 : n = i + 1;
	}
	return [n, !1];
}
function Qe(e, t) {
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
function Y(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var $e = Symbol("verified"), et = (e) => e instanceof Object;
function tt(e) {
	if (!et(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !Y(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var nt = class {
	generateSecretKey() {
		return u.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return p(u.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = p(u.getPublicKey(t)), n.id = it(n), n.sig = p(u.sign(l(it(n)), t)), n[$e] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[$e] == "boolean") return e[$e];
		try {
			let t = it(e);
			if (t !== e.id) return e[$e] = !1, !1;
			let n = u.verify(l(e.sig), l(t), l(e.pubkey));
			return e[$e] = n, n;
		} catch {
			return e[$e] = !1, !1;
		}
	}
};
function rt(e) {
	if (!tt(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function it(e) {
	let t = c(J.encode(rt(e)));
	return p(t);
}
var at = new nt(), ot = at.generateSecretKey, st = at.getPublicKey, X = at.finalizeEvent, ct = at.verifyEvent, lt = {};
K(lt, {
	AIEmbeddings: () => bn,
	AppCurationSet: () => ii,
	Application: () => ni,
	AuthoredPodcasts: () => br,
	BadgeAward: () => wt,
	BadgeDefinition: () => Wr,
	Bid: () => qt,
	BidConfirmation: () => Jt,
	BlobsAuth: () => Pr,
	BlockedRelaysList: () => nr,
	BlossomServerList: () => hr,
	BookmarkList: () => $n,
	Bookmarksets: () => zr,
	Calendar: () => xi,
	CalendarEventRSVP: () => Si,
	CashuMintAnnouncement: () => Ni,
	CashuWalletEvent: () => Or,
	CashuWalletHistory: () => Mn,
	CashuWalletTokens: () => jn,
	ChannelCreation: () => Rt,
	ChannelHideMessage: () => Vt,
	ChannelMessage: () => Bt,
	ChannelMetadata: () => zt,
	ChannelMuteUser: () => Ht,
	ChatMessage: () => Tt,
	Chess: () => Wt,
	ClassifiedListing: () => ui,
	ClientAuth: () => Ar,
	CodeSnippet: () => an,
	CoinjoinPool: () => Cn,
	Comment: () => $t,
	CommunitiesList: () => er,
	CommunityDefinition: () => ki,
	CommunityPostApproval: () => En,
	ConferenceEvent: () => si,
	Contacts: () => yt,
	CreateOrUpdateProduct: () => qr,
	CreateOrUpdateStall: () => Kr,
	CuratedVideoSets: () => Vr,
	Curationsets: () => Br,
	Date: () => yi,
	DecoupledEncryptionKeyDistribution: () => Tn,
	DecoupledKeyAnnouncement: () => fr,
	DecoupledKeyClientAnnouncement: () => wn,
	DirectMessageRelaysList: () => pr,
	DraftClassifiedListing: () => di,
	DraftEvent: () => gi,
	DraftLong: () => Zr,
	Emojisets: () => Qr,
	EncryptedDirectMessage: () => bt,
	EventDeletion: () => xt,
	FavoriteFollowSets: () => ur,
	FavoritePodcasts: () => mr,
	FavoriteRelays: () => ar,
	FedimintAnnouncement: () => Pi,
	Feed: () => vi,
	FileMessage: () => jt,
	FileMetadata: () => Zt,
	FileServerPreference: () => gr,
	Followsets: () => Ir,
	ForumThread: () => Dt,
	GenericRepost: () => Mt,
	Genericlists: () => Lr,
	GeocacheListing: () => ji,
	GeocacheLog: () => Nn,
	GeocacheLogEntry: () => Mi,
	GeocacheProofOfFind: () => Pn,
	GiftWrap: () => Xt,
	GitPullRequest: () => sn,
	GitPullRequestUpdate: () => cn,
	GoodWikiAuthorList: () => _r,
	GoodWikiRelayList: () => vr,
	GroupMetadata: () => Ii,
	HTTPAuth: () => Fr,
	Handlerinformation: () => Ti,
	Handlerrecommendation: () => wi,
	Highlights: () => Yn,
	InteractiveRoom: () => oi,
	InterestsList: () => sr,
	Interestsets: () => Gr,
	Issue: () => ln,
	JobFeedback: () => kn,
	JobRequest: () => Dn,
	JobResult: () => On,
	Label: () => vn,
	LegacyNsiteFile: () => Di,
	LightningPubRPC: () => kr,
	LinkSet: () => _i,
	LiveChatMessage: () => rn,
	LiveEvent: () => ai,
	LongFormArticle: () => Xr,
	MarketplaceUI: () => Jr,
	MediaFollows: () => lr,
	MediaStarterPacks: () => Hi,
	MergeRequests: () => Gt,
	Metadata: () => gt,
	ModularArticleContent: () => ei,
	ModularArticleHeader: () => $r,
	MuteSets: () => Hr,
	Mutelist: () => Xn,
	NWCWalletInfo: () => Er,
	NWCWalletRequest: () => jr,
	NWCWalletResponse: () => Mr,
	NormalVideo: () => Ft,
	NostrConnect: () => Nr,
	NsiteNamed: () => Ai,
	NsiteRoot: () => Dr,
	NutZap: () => Gn,
	NutZapInfo: () => cr,
	OpenTimestamps: () => Yt,
	Patch: () => on,
	PeerToPeerOrderEvents: () => Fi,
	Photo: () => Pt,
	Pinlist: () => Zn,
	PodcastEpisode: () => Ut,
	PodcastMetadata: () => yr,
	Poll: () => Qt,
	PollResponse: () => Kt,
	PrivateDirectMessage: () => At,
	PrivateEventRelayList: () => or,
	ProblemTracker: () => hn,
	ProductSoldAsAuction: () => Yr,
	ProfileBadges: () => Ur,
	ProxyAnnouncement: () => wr,
	PublicChatsList: () => tr,
	PublicMessage: () => Lt,
	Reaction: () => Ct,
	ReactionToWebsite: () => Nt,
	RecommendRelay: () => vt,
	Redirects: () => hi,
	RelayDiscovery: () => ri,
	RelayList: () => Qn,
	RelayMonitorAnnouncement: () => xr,
	RelayReview: () => Ci,
	RelayReviews: () => yn,
	Relaysets: () => Rr,
	ReleaseArtifactSets: () => ti,
	Reply: () => un,
	Report: () => gn,
	Reporting: () => _n,
	RepositoryAnnouncement: () => fi,
	RepositoryState: () => pi,
	Repost: () => St,
	ReservedCashuWalletTokens: () => An,
	RoomPresence: () => Sr,
	Scroll: () => tn,
	Seal: () => kt,
	SearchRelaysList: () => rr,
	ShortTextNote: () => _t,
	ShortVideo: () => It,
	SimpleGroupAdmins: () => Li,
	SimpleGroupCreateGroup: () => zn,
	SimpleGroupCreateInvite: () => Vn,
	SimpleGroupDeleteEvent: () => Rn,
	SimpleGroupDeleteGroup: () => Bn,
	SimpleGroupEditMetadata: () => Ln,
	SimpleGroupJoinRequest: () => Hn,
	SimpleGroupLeaveRequest: () => Un,
	SimpleGroupList: () => ir,
	SimpleGroupLiveKitParticipants: () => Bi,
	SimpleGroupMembers: () => Ri,
	SimpleGroupPutUser: () => Fn,
	SimpleGroupRemoveUser: () => In,
	SimpleGroupReply: () => Ot,
	SimpleGroupRoles: () => zi,
	SimpleGroupThreadedReply: () => Et,
	SlideSet: () => li,
	SoftwareApplication: () => Ei,
	StarterPacks: () => Vi,
	StatusApplied: () => fn,
	StatusClosed: () => pn,
	StatusDraft: () => mn,
	StatusOpen: () => dn,
	TidalLogin: () => Kn,
	Time: () => bi,
	Torrent: () => xn,
	TorrentComment: () => Sn,
	TransportMethodAnnouncement: () => Tr,
	UserEmojiList: () => dr,
	UserGraspList: () => Cr,
	UserStatuses: () => ci,
	VideoViewEvent: () => Oi,
	Voice: () => en,
	VoiceComment: () => nn,
	WebBookmarks: () => Ui,
	WikiArticle: () => mi,
	Zap: () => Jn,
	ZapGoal: () => Wn,
	ZapRequest: () => qn,
	classifyKind: () => mt,
	isAddressableKind: () => pt,
	isEphemeralKind: () => ft,
	isKind: () => ht,
	isRegularKind: () => ut,
	isReplaceableKind: () => dt
});
function ut(e) {
	return e < 1e4 && e !== 0 && e !== 3;
}
function dt(e) {
	return e === 0 || e === 3 || 1e4 <= e && e < 2e4;
}
function ft(e) {
	return 2e4 <= e && e < 3e4;
}
function pt(e) {
	return 3e4 <= e && e < 4e4;
}
function mt(e) {
	return ut(e) ? "regular" : dt(e) ? "replaceable" : ft(e) ? "ephemeral" : pt(e) ? "parameterized" : "unknown";
}
function ht(e, t) {
	let n = t instanceof Array ? t : [t];
	return tt(e) && n.includes(e.kind) || !1;
}
var gt = 0, _t = 1, vt = 2, yt = 3, bt = 4, xt = 5, St = 6, Ct = 7, wt = 8, Tt = 9, Et = 10, Dt = 11, Ot = 12, kt = 13, At = 14, jt = 15, Mt = 16, Nt = 17, Pt = 20, Ft = 21, It = 22, Lt = 24, Rt = 40, zt = 41, Bt = 42, Vt = 43, Ht = 44, Ut = 54, Wt = 64, Gt = 818, Kt = 1018, qt = 1021, Jt = 1022, Yt = 1040, Xt = 1059, Zt = 1063, Qt = 1068, $t = 1111, en = 1222, tn = 1227, nn = 1244, rn = 1311, an = 1337, on = 1617, sn = 1618, cn = 1619, ln = 1621, un = 1622, dn = 1630, fn = 1631, pn = 1632, mn = 1633, hn = 1971, gn = 1984, _n = 1984, vn = 1985, yn = 1986, bn = 1987, xn = 2003, Sn = 2004, Cn = 2022, wn = 4454, Tn = 4455, En = 4550, Dn = 5999, On = 6999, kn = 7e3, An = 7374, jn = 7375, Mn = 7376, Nn = 7516, Pn = 7517, Fn = 9e3, In = 9001, Ln = 9002, Rn = 9005, zn = 9007, Bn = 9008, Vn = 9009, Hn = 9021, Un = 9022, Wn = 9041, Gn = 9321, Kn = 9467, qn = 9734, Jn = 9735, Yn = 9802, Xn = 1e4, Zn = 10001, Qn = 10002, $n = 10003, er = 10004, tr = 10005, nr = 10006, rr = 10007, ir = 10009, ar = 10012, or = 10013, sr = 10015, cr = 10019, lr = 10020, ur = 10021, dr = 10030, fr = 10044, pr = 10050, mr = 10054, hr = 10063, gr = 10096, _r = 10101, vr = 10102, yr = 10154, br = 10164, xr = 10166, Sr = 10312, Cr = 10317, wr = 10377, Tr = 11111, Er = 13194, Dr = 15128, Or = 17375, kr = 21e3, Ar = 22242, jr = 23194, Mr = 23195, Nr = 24133, Pr = 24242, Fr = 27235, Ir = 3e4, Lr = 30001, Rr = 30002, zr = 30003, Br = 30004, Vr = 30005, Hr = 30007, Ur = 30008, Wr = 30009, Gr = 30015, Kr = 30017, qr = 30018, Jr = 30019, Yr = 30020, Xr = 30023, Zr = 30024, Qr = 30030, $r = 30040, ei = 30041, ti = 30063, ni = 30078, ri = 30166, ii = 30267, ai = 30311, oi = 30312, si = 30313, ci = 30315, li = 30388, ui = 30402, di = 30403, fi = 30617, pi = 30618, mi = 30818, hi = 30819, gi = 31234, _i = 31388, vi = 31890, yi = 31922, bi = 31923, xi = 31924, Si = 31925, Ci = 31987, wi = 31989, Ti = 31990, Ei = 32267, Di = 34128, Oi = 34237, ki = 34550, Ai = 35128, ji = 37515, Mi = 37516, Ni = 38172, Pi = 38173, Fi = 38383, Ii = 39e3, Li = 39001, Ri = 39002, zi = 39003, Bi = 39004, Vi = 39089, Hi = 39092, Ui = 39701;
function Wi(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find(([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1)) return !1;
	}
	return !(e.since && t.created_at < e.since || e.until && t.created_at > e.until);
}
K({}, {
	getHex64: () => Gi,
	getInt: () => Ki,
	getSubscriptionId: () => qi,
	matchEventId: () => Ji,
	matchEventKind: () => Xi,
	matchEventPubkey: () => Yi
});
function Gi(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function Ki(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function qi(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function Ji(e, t) {
	return t === Gi(e, "id");
}
function Yi(e, t) {
	return t === Gi(e, "pubkey");
}
function Xi(e, t) {
	return t === Ki(e, "kind");
}
K({}, { makeAuthEvent: () => Zi });
function Zi(e, t) {
	return {
		kind: Ar,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
new TextEncoder();
var Qi = {};
K(Qi, {
	BECH32_REGEX: () => ta,
	Bech32MaxSize: () => ea,
	NostrTypeGuard: () => $i,
	decode: () => ia,
	decodeNostrURI: () => ra,
	encodeBytes: () => ua,
	naddrEncode: () => pa,
	neventEncode: () => fa,
	noteEncode: () => ca,
	nprofileEncode: () => da,
	npubEncode: () => sa,
	nsecEncode: () => oa
});
var $i = {
	isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
	isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
	isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
	isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
	isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
	isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
	isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, ea = 5e3, ta = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function na(e) {
	let t = /* @__PURE__ */ new Uint8Array(4);
	return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = e & 255, t;
}
function ra(e) {
	try {
		return e.startsWith("nostr:") && (e = e.substring(6)), ia(e);
	} catch {
		return {
			type: "invalid",
			data: null
		};
	}
}
function ia(e) {
	let { prefix: t, words: n } = s.decode(e, ea), r = new Uint8Array(s.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = aa(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nprofile");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: p(e[0][0]),
					relays: e[1] ? e[1].map((e) => q.decode(e)) : []
				}
			};
		}
		case "nevent": {
			let e = aa(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nevent");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			if (e[2] && e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (e[3] && e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "nevent",
				data: {
					id: p(e[0][0]),
					relays: e[1] ? e[1].map((e) => q.decode(e)) : [],
					author: e[2]?.[0] ? p(e[2][0]) : void 0,
					kind: e[3]?.[0] ? parseInt(p(e[3][0]), 16) : void 0
				}
			};
		}
		case "naddr": {
			let e = aa(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for naddr");
			if (!e[2]?.[0]) throw Error("missing TLV 2 for naddr");
			if (e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (!e[3]?.[0]) throw Error("missing TLV 3 for naddr");
			if (e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: q.decode(e[0][0]),
					pubkey: p(e[2][0]),
					kind: parseInt(p(e[3][0]), 16),
					relays: e[1] ? e[1].map((e) => q.decode(e)) : []
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
function aa(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		if (n.length < 2) throw Error("not enough data to read TLV");
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		if (n = n.slice(2 + r), i.length < r) throw Error(`not enough data to read on TLV ${e}`);
		t[e] = t[e] || [], t[e].push(i);
	}
	return t;
}
function oa(e) {
	return ua("nsec", e);
}
function sa(e) {
	return ua("npub", l(e));
}
function ca(e) {
	return ua("note", l(e));
}
function la(e, t) {
	let n = s.toWords(t);
	return s.encode(e, n, ea);
}
function ua(e, t) {
	return la(e, t);
}
function da(e) {
	return la("nprofile", ma({
		0: [l(e.pubkey)],
		1: (e.relays || []).map((e) => J.encode(e))
	}));
}
function fa(e) {
	let t;
	return e.kind !== void 0 && (t = na(e.kind)), la("nevent", ma({
		0: [l(e.id)],
		1: (e.relays || []).map((e) => J.encode(e)),
		2: e.author ? [l(e.author)] : [],
		3: t ? [new Uint8Array(t)] : []
	}));
}
function pa(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	return new DataView(t).setUint32(0, e.kind, !1), la("naddr", ma({
		0: [J.encode(e.identifier)],
		1: (e.relays || []).map((e) => J.encode(e)),
		2: [l(e.pubkey)],
		3: [new Uint8Array(t)]
	}));
}
function ma(e) {
	let t = [];
	return Object.entries(e).reverse().forEach(([e, n]) => {
		n.forEach((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		});
	}), r(...t);
}
K({}, {
	decrypt: () => ga,
	encrypt: () => ha
});
function ha(e, t, n) {
	let r = e instanceof Uint8Array ? e : l(e), a = _a(i.getSharedSecret(r, l("02" + t))), s = Uint8Array.from(o(16)), c = J.encode(n), u = Te(a, s).encrypt(c);
	return `${f.encode(new Uint8Array(u))}?iv=${f.encode(new Uint8Array(s.buffer))}`;
}
function ga(e, t, n) {
	let r = e instanceof Uint8Array ? e : l(e), [a, o] = n.split("?iv="), s = _a(i.getSharedSecret(r, l("02" + t))), c = f.decode(o), u = f.decode(a), d = Te(s, c).decrypt(u);
	return q.decode(d);
}
function _a(e) {
	return e.slice(1, 33);
}
K({}, {
	NIP05_REGEX: () => va,
	isNip05: () => ya,
	isValid: () => wa,
	queryProfile: () => Ca,
	searchDomain: () => Sa,
	useFetchImplementation: () => xa
});
var va = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, ya = (e) => va.test(e || ""), ba;
try {
	ba = fetch;
} catch {}
function xa(e) {
	ba = e;
}
async function Sa(e, t = "") {
	try {
		let n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await ba(n, { redirect: "manual" });
		if (r.status !== 200) throw Error("Wrong response code");
		return (await r.json()).names;
	} catch {
		return {};
	}
}
async function Ca(e) {
	let t = e.match(va);
	if (!t) return null;
	let [, n = "_", r] = t;
	try {
		let e = `https://${r}/.well-known/nostr.json?name=${n}`, t = await ba(e, { redirect: "manual" });
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
async function wa(e, t) {
	let n = await Ca(t);
	return n ? n.pubkey === e : !1;
}
K({}, { parse: () => Ta });
function Ta(e) {
	let t = {
		reply: void 0,
		root: void 0,
		mentions: [],
		profiles: [],
		quotes: []
	}, n, r;
	for (let i = e.tags.length - 1; i >= 0; i--) {
		let a = e.tags[i];
		if (a[0] === "e" && a[1] && Y(a[1])) {
			let [e, i, o, s, c] = a, l = {
				id: i,
				relays: o ? [o] : [],
				author: c && Y(c) ? c : void 0
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
			if (a[0] === "q" && a[1] && Y(a[1])) {
				let [e, n, r] = a;
				t.quotes.push({
					id: n,
					relays: r ? [r] : []
				});
			}
			a[0] === "p" && a[1] && Y(a[1]) && t.profiles.push({
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
K({}, {
	fetchRelayInformation: () => Da,
	useFetchImplementation: () => Ea
});
function Ea(e) {}
async function Da(e) {
	return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
K({}, {
	getPow: () => Oa,
	minePow: () => Aa
});
function Oa(e) {
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
function ka(e) {
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
function Aa(e, t) {
	let n = 0, r = e, i = [
		"nonce",
		n.toString(),
		t.toString()
	];
	for (r.tags.push(i);;) {
		let e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
		e !== r.created_at && (n = 0, r.created_at = e), i[1] = (++n).toString();
		let a = c(J.encode(JSON.stringify([
			0,
			r.pubkey,
			r.created_at,
			r.kind,
			r.tags,
			r.content
		])));
		if (ka(a) >= t) {
			r.id = p(a);
			break;
		}
	}
	return r;
}
K({}, {
	unwrapEvent: () => lo,
	unwrapManyEvents: () => uo,
	wrapEvent: () => so,
	wrapManyEvents: () => co
}), K({}, {
	createRumor: () => $a,
	createSeal: () => eo,
	createWrap: () => to,
	unwrapEvent: () => io,
	unwrapManyEvents: () => ao,
	wrapEvent: () => no,
	wrapManyEvents: () => ro
});
var ja = {};
K(ja, {
	decrypt: () => Ga,
	encrypt: () => Wa,
	getConversationKey: () => Fa,
	v2: () => Ka
});
var Ma = 1, Na = 4294967295, Pa = 65536;
function Fa(e, t) {
	let n = i.getSharedSecret(e, l("02" + t)).subarray(1, 33);
	return He(c, n, J.encode("nip44-v2"));
}
function Ia(e, t) {
	let n = Ge(c, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function La(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 2 ** (Math.floor(Math.log2(e - 1)) + 1), n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function Ra(e) {
	if (!Number.isSafeInteger(e) || e < Ma || e > 65535) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
	let t = /* @__PURE__ */ new Uint8Array(2);
	return new DataView(t.buffer).setUint16(0, e, !1), t;
}
function za(e) {
	if (!Number.isSafeInteger(e) || e < Pa || e > Na) throw Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
	let t = /* @__PURE__ */ new Uint8Array(4);
	return new DataView(t.buffer).setUint32(0, e, !1), t;
}
function Ba(e) {
	let t = J.encode(e), n = t.length;
	if (n < Ma || n > Na) throw Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
	let i = n >= Pa ? r(new Uint8Array([0, 0]), za(n)) : Ra(n), a = new Uint8Array(La(n) - n);
	return r(i, t, a);
}
function Va(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = t.getUint16(0), r, i;
	if (n === 0) {
		if (r = t.getUint32(2), r < Pa) throw Error("invalid padding");
		i = 6;
	} else r = n, i = 2;
	let a = e.subarray(i, i + r);
	if (r < Ma || r > Na || a.length !== r || e.length !== i + La(r)) throw Error("invalid padding");
	return q.decode(a);
}
function Ha(t, n, i) {
	if (i.length !== 32) throw Error("AAD associated data must be 32 bytes");
	let a = r(i, n);
	return e(c, t, a);
}
function Ua(e) {
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
function Wa(e, t, n = o(32)) {
	let { chacha_key: i, chacha_nonce: a, hmac_key: s } = Ia(t, n), c = Ve(i, a, Ba(e)), l = Ha(s, c, n);
	return f.encode(r(new Uint8Array([2]), n, c, l));
}
function Ga(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = Ua(e), { chacha_key: a, chacha_nonce: o, hmac_key: s } = Ia(t, n);
	if (!R(Ha(s, r, n), i)) throw Error("invalid MAC");
	return Va(Ve(a, o, r));
}
var Ka = {
	utils: {
		getConversationKey: Fa,
		calcPaddedLen: La,
		pad: Ba,
		unpad: Va
	},
	encrypt: Wa,
	decrypt: Ga
}, qa = 172800, Ja = () => Math.round(Date.now() / 1e3), Ya = () => Math.round(Ja() - Math.random() * qa), Xa = (e, t) => Fa(e, t), Za = (e, t, n) => Wa(JSON.stringify(e), Xa(t, n)), Qa = (e, t) => JSON.parse(Ga(e.content, Xa(t, e.pubkey)));
function $a(e, t) {
	let n = {
		created_at: Ja(),
		content: "",
		tags: [],
		...e,
		pubkey: st(t)
	};
	return n.id = it(n), n;
}
function eo(e, t, n) {
	return X({
		kind: kt,
		content: Za(e, t, n),
		created_at: Ya(),
		tags: []
	}, t);
}
function to(e, t) {
	let n = ot();
	return X({
		kind: Xt,
		content: Za(e, n, t),
		created_at: Ya(),
		tags: [["p", t]]
	}, n);
}
function no(e, t, n) {
	return to(eo($a(e, t), t, n), n);
}
function ro(e, t, n) {
	if (!n || n.length === 0) throw Error("At least one recipient is required.");
	let r = [no(e, t, st(t))];
	return n.forEach((n) => {
		r.push(no(e, t, n));
	}), r;
}
function io(e, t) {
	if (e.kind !== Xt) throw Error(`unexpected wrap kind ${e.kind}, expected ${Xt}`);
	let n = Qa(e, t);
	if (n.kind !== kt) throw Error(`unexpected seal kind ${n.kind}, expected ${kt}`);
	if (!ct(n)) throw Error("seal signature is invalid");
	let r = Qa(n, t);
	if (r.pubkey !== n.pubkey) throw Error(`rumor pubkey ${r.pubkey} does not match seal pubkey ${n.pubkey}`);
	return r;
}
function ao(e, t) {
	let n = [];
	return e.forEach((e) => {
		try {
			n.push(io(e, t));
		} catch {}
	}), n.sort((e, t) => e.created_at - t.created_at), n;
}
function oo(e, t, n, r) {
	let i = {
		created_at: Math.ceil(Date.now() / 1e3),
		kind: At,
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
function so(e, t, n, r, i) {
	return no(oo(t, n, r, i), e, t.publicKey);
}
function co(e, t, n, r, i) {
	if (!t || t.length === 0) throw Error("At least one recipient is required.");
	return [{ publicKey: st(e) }, ...t].map((t) => so(e, t, n, r, i));
}
var lo = io, uo = ao;
K({}, {
	finishRepostEvent: () => fo,
	getRepostedEvent: () => mo,
	getRepostedEventPointer: () => po
});
function fo(e, t, n, r) {
	let i, a = [
		...e.tags ?? [],
		[
			"e",
			t.id,
			n
		],
		["p", t.pubkey]
	];
	return t.kind === _t ? i = St : (i = Mt, a.push(["k", String(t.kind)])), X({
		kind: i,
		tags: a,
		content: e.content === "" || t.tags?.find((e) => e[0] === "-") ? "" : JSON.stringify(t),
		created_at: e.created_at
	}, r);
}
function po(e) {
	if (![St, Mt].includes(e.kind)) return;
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
function mo(e, { skipVerification: t } = {}) {
	let n = po(e);
	if (n === void 0 || e.content === "") return;
	let r;
	try {
		r = JSON.parse(e.content);
	} catch {
		return;
	}
	if (r.id === n.id && (t || ct(r))) return r;
}
K({}, {
	NOSTR_URI_REGEX: () => ho,
	parse: () => _o,
	test: () => go
});
var ho = RegExp(`nostr:(${ta.source})`);
function go(e) {
	return typeof e == "string" && RegExp(`^${ho.source}$`).test(e);
}
function _o(e) {
	let t = e.match(RegExp(`^${ho.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: ia(t[1])
	};
}
K({}, { parse: () => wo });
function vo(e) {
	if (e) return /^\d+$/.test(e) ? parseInt(e, 10) : e;
}
function yo(e, t) {
	let n = e.indexOf(":"), r = e.indexOf(":", n + 1);
	if (n === -1 || r === -1) return;
	let i = parseInt(e.slice(0, n), 10);
	if (Number.isNaN(i)) return;
	let a = e.slice(n + 1, r);
	if (Y(a)) return {
		kind: i,
		pubkey: a,
		identifier: e.slice(r + 1),
		relays: t ? [t] : []
	};
}
function bo(e) {
	switch (e[0]) {
		case "E":
		case "e": return !e[1] || !Y(e[1]) ? void 0 : {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && Y(e[3]) ? e[3] : void 0
		};
		case "A":
		case "a": return e[1] ? yo(e[1], e[2]) : void 0;
		case "I":
		case "i": return e[1] ? {
			value: e[1],
			hint: e[2]
		} : void 0;
	}
}
function xo(e) {
	if (e[1]) {
		if (e[1].includes(":")) return yo(e[1], e[2]);
		if (Y(e[1])) return {
			id: e[1],
			relays: e[2] ? [e[2]] : [],
			author: e[3] && Y(e[3]) ? e[3] : void 0
		};
	}
}
function So(e) {
	return e.findLast((e) => e.tagName === "A" || e.tagName === "a")?.pointer || e.findLast((e) => e.tagName === "I" || e.tagName === "i")?.pointer || e.findLast((e) => e.tagName === "E" || e.tagName === "e")?.pointer;
}
function Co(e, t) {
	if (!e || !("id" in e) || !e.author) return;
	let n = t.find((t) => t.pubkey === e.author);
	n && n.relays && (e.relays ||= [], n.relays.forEach((t) => {
		e.relays.indexOf(t) === -1 && e.relays.push(t);
	}), n.relays = e.relays);
}
function wo(e) {
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
		let e = bo(i);
		e && n.push({
			tagName: i[0],
			pointer: e
		});
	} else if ((i[0] === "e" || i[0] === "a" || i[0] === "i") && i[1]) {
		let e = bo(i);
		e && r.push({
			tagName: i[0],
			pointer: e
		});
	} else if (i[0] === "K") t.rootKind = vo(i[1]);
	else if (i[0] === "k") t.replyKind = vo(i[1]);
	else if (i[0] === "q") {
		let e = xo(i);
		e && t.quotes.push(e);
	} else (i[0] === "P" || i[0] === "p") && i[1] && Y(i[1]) && t.profiles.push({
		pubkey: i[1],
		relays: i[2] ? [i[2]] : []
	});
	return t.root = So(n), t.reply = So(r), Co(t.root, t.profiles), Co(t.reply, t.profiles), t.quotes.forEach((e) => Co(e, t.profiles)), t;
}
K({}, {
	finishReactionEvent: () => To,
	getReactedEventPointer: () => Eo
});
function To(e, t, n) {
	let r = t.tags.filter((e) => e.length >= 2 && (e[0] === "e" || e[0] === "p"));
	return X({
		...e,
		kind: Ct,
		tags: [
			...e.tags ?? [],
			...r,
			["e", t.id],
			["p", t.pubkey]
		],
		content: e.content ?? "+"
	}, n);
}
function Eo(e) {
	if (e.kind !== Ct) return;
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
K({}, { parse: () => Ao });
var Do = /\W/m, Oo = /[^\w\/] |[^\w\/]$|$|,| /m, ko = 42;
function* Ao(e) {
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
			if (o === 0 || e[o - 1].match(Do)) {
				let t = e.slice(o + 1, o + ko).match(Do), a = t ? o + 1 + t.index : n;
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
			let t = e.slice(a + 60).match(Do), o = t ? a + 60 + t.index : n;
			try {
				let t, { data: n, type: s } = ia(e.slice(a + 1, o));
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
			let t = e.slice(a + 4).match(Oo), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 5 : 4;
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
			let t = e.slice(a + 4).match(Oo), o = t ? a + 4 + t.index : n, s = e[a - 1] === "s" ? 3 : 2;
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
K({}, {
	channelCreateEvent: () => jo,
	channelHideMessageEvent: () => Po,
	channelMessageEvent: () => No,
	channelMetadataEvent: () => Mo,
	channelMuteUserEvent: () => Fo
});
var jo = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return X({
		kind: Rt,
		tags: [...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, Mo = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return X({
		kind: zt,
		tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, No = (e, t) => {
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
	]), X({
		kind: Bt,
		tags: [...n, ...e.tags ?? []],
		content: e.content,
		created_at: e.created_at
	}, t);
}, Po = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return X({
		kind: Vt,
		tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, Fo = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else if (typeof e.content == "string") n = e.content;
	else return;
	return X({
		kind: Ht,
		tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
};
K({}, {
	EMOJI_SHORTCODE_REGEX: () => Io,
	matchAll: () => Ro,
	regex: () => Lo,
	replaceAll: () => zo
});
var Io = /:(\w+):/, Lo = () => RegExp(`\\B${Io.source}\\B`, "g");
function* Ro(e) {
	let t = e.matchAll(Lo());
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
function zo(e, t) {
	return e.replaceAll(Lo(), (e, n) => t({
		shortcode: e,
		name: n
	}));
}
K({}, {
	useFetchImplementation: () => Vo,
	validateGithub: () => Ho
});
var Bo;
try {
	Bo = fetch;
} catch {}
function Vo(e) {
	Bo = e;
}
async function Ho(e, t, n) {
	try {
		return await (await Bo(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
K({}, {
	makeNwcRequestEvent: () => Wo,
	parseConnectionString: () => Uo
});
function Uo(e) {
	let { host: t, pathname: n, searchParams: r } = new URL(e), i = n || t, a = r.getAll("relay"), o = r.get("secret");
	if (!i || a.length === 0 || !o) throw Error("invalid connection string");
	return {
		pubkey: i,
		relay: a[0],
		relays: a,
		secret: o
	};
}
async function Wo(e, t, n) {
	let r = ha(t, e, JSON.stringify({
		method: "pay_invoice",
		params: { invoice: n }
	}));
	return X({
		kind: jr,
		created_at: Math.round(Date.now() / 1e3),
		content: r,
		tags: [["p", e]]
	}, t);
}
K({}, { normalizeIdentifier: () => Go });
function Go(e) {
	return e = e.trim().toLowerCase(), e = e.normalize("NFKC"), Array.from(e).map((e) => /\p{Letter}/u.test(e) || /\p{Number}/u.test(e) ? e : "-").join("");
}
K({}, {
	getSatoshisAmountFromBolt11: () => Qo,
	getZapEndpoint: () => Jo,
	makeZapReceipt: () => Zo,
	makeZapRequest: () => Yo,
	useFetchImplementation: () => qo,
	validateZapRequest: () => Xo
});
var Ko;
try {
	Ko = fetch;
} catch {}
function qo(e) {
	Ko = e;
}
async function Jo(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (r) {
			let [e, n] = r.split("@");
			t = new URL(`/.well-known/lnurlp/${e}`, `https://${n}`).toString();
		} else if (n) {
			let { words: e } = s.decode(n, 1e3), r = s.fromWords(e);
			t = q.decode(r);
		} else return null;
		let i = await (await Ko(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function Yo(e) {
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
		if (t.tags.push(["e", e.event.id]), dt(e.event.kind)) {
			let n = ["a", `${e.event.kind}:${e.event.pubkey}:`];
			t.tags.push(n);
		} else if (pt(e.event.kind)) {
			let n = e.event.tags.find(([e, t]) => e === "d" && t);
			if (!n) throw Error("d tag not found or is empty");
			let r = ["a", `${e.event.kind}:${e.event.pubkey}:${n[1]}`];
			t.tags.push(r);
		}
		t.tags.push(["k", e.event.kind.toString()]);
	}
	return t;
}
function Xo(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!tt(t)) return "Zap request is not a valid Nostr event.";
	if (!ct(t)) return "Invalid signature on zap request.";
	let n = t.tags.find(([e, t]) => e === "p" && t);
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!Y(n[1])) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find(([e, t]) => e === "e" && t);
	return r && !Y(r[1]) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([e, t]) => e === "relays" && t) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Zo({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
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
function Qo(e) {
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
K({}, {
	Negentropy: () => ss,
	NegentropyStorageVector: () => os,
	NegentropySync: () => us
});
var $o = 97, es = 32, ts = 16, Z = {
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
function ns(e) {
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
function rs(e) {
	return is(e, 1)[0];
}
function is(e, t) {
	if (e.length < t) throw Error("parse ends prematurely");
	return e.shiftN(t);
}
var as = class {
	buf;
	constructor() {
		this.setToZero();
	}
	setToZero() {
		this.buf = new Uint8Array(es);
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
		let t = new Uint8Array(es);
		t[0] = 1, this.add(t);
	}
	getFingerprint(e) {
		let t = new Q();
		return t.extend(this.buf), t.extend($(e)), c(t.unwrap()).subarray(0, ts);
	}
}, os = class {
	items;
	sealed;
	constructor() {
		this.items = [], this.sealed = !1;
	}
	insert(e, t) {
		if (this.sealed) throw Error("already sealed");
		let n = l(t);
		if (n.byteLength !== es) throw Error("bad id size for added item");
		this.items.push({
			timestamp: e,
			id: n
		});
	}
	seal() {
		if (this.sealed) throw Error("already sealed");
		this.sealed = !0, this.items.sort(ls);
		for (let e = 1; e < this.items.length; e++) if (ls(this.items[e - 1], this.items[e]) === 0) throw Error("duplicate item inserted");
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
		return this._checkSealed(), this._checkBounds(e, t), this._binarySearch(this.items, e, t, (e) => ls(e, n) < 0);
	}
	fingerprint(e, t) {
		let n = new as();
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
}, ss = class {
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
		return e.extend(new Uint8Array([$o])), this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), e), p(e.unwrap());
	}
	reconcile(e, t, n) {
		let r = new Q(l(e));
		this.lastTimestampIn = this.lastTimestampOut = 0;
		let i = new Q();
		i.extend(new Uint8Array([$o]));
		let a = rs(r);
		if (a < 96 || a > 111) throw Error("invalid negentropy protocol version byte");
		if (a !== $o) throw Error("unsupported negentropy protocol version requested: " + (a - 96));
		let o = this.storage.size(), s = this._bound(0), c = 0, u = !1;
		for (; r.length !== 0;) {
			let e = new Q(), a = () => {
				u && (u = !1, e.extend(this.encodeBound(s)), e.extend($(Z.Skip)));
			}, l = this.decodeBound(r), d = ns(r), f = c, m = this.storage.findLowerBound(c, o, l);
			if (d === Z.Skip) u = !0;
			else if (d === Z.Fingerprint) cs(is(r, ts), this.storage.fingerprint(f, m)) === 0 ? u = !0 : (a(), this.splitRange(f, m, l, e));
			else if (d === Z.IdList) {
				let e = ns(r), i = {};
				for (let t = 0; t < e; t++) {
					let e = is(r, es);
					i[p(e)] = e;
				}
				if (u = !0, this.storage.iterate(f, m, (e) => {
					let n = e.id, r = p(n);
					return i[r] ? delete i[p(n)] : t?.(r), !0;
				}), n) for (let e of Object.values(i)) n(p(e));
			} else throw Error("unexpected mode");
			if (this.exceededFrameSizeLimit(i.length + e.length)) {
				let e = this.storage.fingerprint(m, o);
				i.extend(this.encodeBound(this._bound(Number.MAX_VALUE))), i.extend($(Z.Fingerprint)), i.extend(e);
				break;
			}
			i.extend(e), c = m, s = l;
		}
		return i.length === 1 ? null : p(i.unwrap());
	}
	splitRange(e, t, n, r) {
		let i = t - e;
		if (i < 32) r.extend(this.encodeBound(n)), r.extend($(Z.IdList)), r.extend($(i)), this.storage.iterate(e, t, (e) => (r.extend(e.id), !0));
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
				r.extend(this.encodeBound(l)), r.extend($(Z.Fingerprint)), r.extend(c);
			}
		}
	}
	exceededFrameSizeLimit(e) {
		return e > this.frameSizeLimit - 200;
	}
	decodeTimestampIn(e) {
		let t = ns(e);
		return t = t === 0 ? Number.MAX_VALUE : t - 1, this.lastTimestampIn === Number.MAX_VALUE || t === Number.MAX_VALUE ? (this.lastTimestampIn = Number.MAX_VALUE, Number.MAX_VALUE) : (t += this.lastTimestampIn, this.lastTimestampIn = t, t);
	}
	decodeBound(e) {
		let t = this.decodeTimestampIn(e), n = ns(e);
		if (n > es) throw Error("bound key too long");
		return {
			timestamp: t,
			id: is(e, n)
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
			for (let e = 0; e < es && r[e] === i[e]; e++) n++;
			return this._bound(t.timestamp, t.id.subarray(0, n + 1));
		}
	}
};
function cs(e, t) {
	for (let n = 0; n < e.byteLength; n++) {
		if (e[n] < t[n]) return -1;
		if (e[n] > t[n]) return 1;
	}
	return e.byteLength > t.byteLength ? 1 : e.byteLength < t.byteLength ? -1 : 0;
}
function ls(e, t) {
	return e.timestamp === t.timestamp ? cs(e.id, t.id) : e.timestamp - t.timestamp;
}
var us = class {
	relay;
	storage;
	neg;
	filter;
	subscription;
	onhave;
	onneed;
	constructor(e, t, n, r = {}) {
		this.relay = e, this.storage = t, this.neg = new ss(t), this.onhave = r.onhave, this.onneed = r.onneed, this.filter = n, this.subscription = this.relay.prepareSubscription([{}], { label: r.label || "negentropy" }), this.subscription.oncustom = (e) => {
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
K({}, {
	getToken: () => fs,
	hashPayload: () => ys,
	unpackEventFromToken: () => ms,
	validateEvent: () => xs,
	validateEventKind: () => gs,
	validateEventMethodTag: () => vs,
	validateEventPayloadTag: () => bs,
	validateEventTimestamp: () => hs,
	validateEventUrlTag: () => _s,
	validateToken: () => ps
});
var ds = "Nostr ";
async function fs(e, t, n, r = !1, i) {
	let a = {
		kind: Fr,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	i && a.tags.push(["payload", ys(i)]);
	let o = await n(a);
	return (r ? ds : "") + f.encode(J.encode(JSON.stringify(o)));
}
async function ps(e, t, n) {
	return await xs(await ms(e).catch((e) => {
		throw e;
	}), t, n).catch((e) => {
		throw e;
	});
}
async function ms(e) {
	if (!e) throw Error("Missing token");
	e = e.replace(ds, "");
	let t = q.decode(f.decode(e));
	if (!t || t.length === 0 || !t.startsWith("{")) throw Error("Invalid token");
	return JSON.parse(t);
}
function hs(e) {
	return e.created_at ? Math.abs(Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at) < 60 : !1;
}
function gs(e) {
	return e.kind === Fr;
}
function _s(e, t) {
	let n = e.tags.find((e) => e[0] === "u");
	return n ? n.length > 0 && n[1] === t : !1;
}
function vs(e, t) {
	let n = e.tags.find((e) => e[0] === "method");
	return n ? n.length > 0 && n[1].toLowerCase() === t.toLowerCase() : !1;
}
function ys(e) {
	let t = c(J.encode(JSON.stringify(e)));
	return p(t);
}
function bs(e, t) {
	let n = e.tags.find((e) => e[0] === "payload");
	if (!n) return !1;
	let r = ys(t);
	return n.length > 0 && n[1] === r;
}
async function xs(e, t, n, r) {
	if (!ct(e)) throw Error("Invalid nostr event, signature invalid");
	if (!gs(e)) throw Error("Invalid nostr event, kind invalid");
	if (!hs(e)) throw Error("Invalid nostr event, created_at timestamp invalid");
	if (!_s(e, t)) throw Error("Invalid nostr event, url tag invalid");
	if (!vs(e, n)) throw Error("Invalid nostr event, method tag invalid");
	if (r && typeof r == "object" && Object.keys(r).length > 0 && !bs(e, r)) throw Error("Invalid nostr event, payload tag does not match request body hash");
	return !0;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relayLists.ts
var Ss = [
	"wss://purplepag.es/",
	"wss://directory.yabu.me/",
	"wss://indexer.coracle.social/",
	"wss://user.kindpag.es/"
], Cs = [
	"wss://nos.lol/",
	"wss://relay.nostr.wirednet.jp/",
	"wss://yabu.me/",
	"wss://x.kojira.io/"
], ws = [
	"wss://relay.damus.io/",
	"wss://relay.nostr.band/",
	"wss://nrelay.c-stellar.net/",
	"wss://nrelay-jp.c-stellar.net/"
], Ts = /* @__PURE__ */ new Set(["ws:", "wss:"]), Es = new Set(ws), Ds = class {
	static parseKind10002Tags(e) {
		let t = {};
		return e.filter((e) => Array.isArray(e) && e.every((e) => typeof e == "string") && (e.length === 2 || e.length === 3) && e[0] === "r").forEach((e) => {
			let n = typeof e[1] == "string" ? Os.normalizeExternalRelayUrl(e[1]) : null;
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
}, Os = class {
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
		return t !== null && Es.has(t);
	}
	static normalizeExternalRelayUrlCandidate(e) {
		if (typeof e != "string") return null;
		let t = e.trim();
		if (!t) return null;
		try {
			if (t.includes("://")) {
				let e = new URL(t);
				if (!Ts.has(e.protocol) || e.username || e.password) return null;
			}
			let e = qe.normalizeURL(t), n = new URL(e);
			return !Ts.has(n.protocol) || !n.hostname || n.username || n.password ? null : e;
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
export { w as _, it as a, b, Wi as c, tt as d, ct as f, R as g, Ve as h, Cs as i, Qi as l, He as m, Os as n, st as o, Ge as p, Ss as r, lt as s, Ds as t, ja as u, T as v, te as x, h as y };
