import { n as e } from "./rolldown-runtime-CwxnZyOB.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/blurhash/dist/esm/index.js
var t = /* @__PURE__ */ e({
	ValidationError: () => l,
	decode: () => p,
	encode: () => v
}), n = /* @__PURE__ */ "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~".split(""), r = (e) => {
	let t = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = n.indexOf(i);
		t = t * 83 + a;
	}
	return t;
}, i = (e, t) => {
	var r = "";
	for (let i = 1; i <= t; i++) {
		let a = Math.floor(e) / 83 ** (t - i) % 83;
		r += n[Math.floor(a)];
	}
	return r;
}, a = (e) => {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}, o = (e) => {
	let t = Math.max(0, Math.min(1, e));
	return Math.trunc(t <= .0031308 ? t * 12.92 * 255 + .5 : (1.055 * t ** .4166666666666667 - .055) * 255 + .5);
}, s = (e) => e < 0 ? -1 : 1, c = (e, t) => s(e) * Math.abs(e) ** +t, l = class extends Error {
	constructor(e) {
		super(e), this.name = "ValidationError", this.message = e;
	}
}, u = (e) => {
	if (!e || e.length < 6) throw new l("The blurhash string must be at least 6 characters");
	let t = r(e[0]), n = Math.floor(t / 9) + 1, i = t % 9 + 1;
	if (e.length !== 4 + 2 * i * n) throw new l(`blurhash length mismatch: length is ${e.length} but it should be ${4 + 2 * i * n}`);
}, d = (e) => {
	let t = e >> 16, n = e >> 8 & 255, r = e & 255;
	return [
		a(t),
		a(n),
		a(r)
	];
}, f = (e, t) => {
	let n = Math.floor(e / 361), r = Math.floor(e / 19) % 19, i = e % 19;
	return [
		c((n - 9) / 9, 2) * t,
		c((r - 9) / 9, 2) * t,
		c((i - 9) / 9, 2) * t
	];
}, p = (e, t, n, i) => {
	u(e), i |= 1;
	let a = r(e[0]), s = Math.floor(a / 9) + 1, c = a % 9 + 1, l = (r(e[1]) + 1) / 166, p = Array(c * s);
	for (let t = 0; t < p.length; t++) if (t === 0) {
		let n = r(e.substring(2, 6));
		p[t] = d(n);
	} else {
		let n = r(e.substring(4 + t * 2, 6 + t * 2));
		p[t] = f(n, l * i);
	}
	let m = t * 4, h = new Uint8ClampedArray(m * n);
	for (let e = 0; e < n; e++) for (let r = 0; r < t; r++) {
		let i = 0, a = 0, l = 0;
		for (let o = 0; o < s; o++) for (let s = 0; s < c; s++) {
			let u = Math.cos(Math.PI * r * s / t) * Math.cos(Math.PI * e * o / n), d = p[s + o * c];
			i += d[0] * u, a += d[1] * u, l += d[2] * u;
		}
		let u = o(i), d = o(a), f = o(l);
		h[4 * r + 0 + e * m] = u, h[4 * r + 1 + e * m] = d, h[4 * r + 2 + e * m] = f, h[4 * r + 3 + e * m] = 255;
	}
	return h;
}, m = 4, h = (e, t, n, r) => {
	let i = 0, o = 0, s = 0, c = t * m;
	for (let l = 0; l < t; l++) {
		let t = m * l;
		for (let u = 0; u < n; u++) {
			let n = t + u * c, d = r(l, u);
			i += d * a(e[n]), o += d * a(e[n + 1]), s += d * a(e[n + 2]);
		}
	}
	let l = 1 / (t * n);
	return [
		i * l,
		o * l,
		s * l
	];
}, g = (e) => {
	let t = o(e[0]), n = o(e[1]), r = o(e[2]);
	return (t << 16) + (n << 8) + r;
}, _ = (e, t) => {
	let n = Math.floor(Math.max(0, Math.min(18, Math.floor(c(e[0] / t, .5) * 9 + 9.5)))), r = Math.floor(Math.max(0, Math.min(18, Math.floor(c(e[1] / t, .5) * 9 + 9.5)))), i = Math.floor(Math.max(0, Math.min(18, Math.floor(c(e[2] / t, .5) * 9 + 9.5))));
	return n * 19 * 19 + r * 19 + i;
}, v = (e, t, n, r, a) => {
	if (r < 1 || r > 9 || a < 1 || a > 9) throw new l("BlurHash must have between 1 and 9 components");
	if (t * n * 4 !== e.length) throw new l("Width and height must match the pixels array");
	let o = [];
	for (let i = 0; i < a; i++) for (let a = 0; a < r; a++) {
		let r = a == 0 && i == 0 ? 1 : 2, s = h(e, t, n, (e, o) => r * Math.cos(Math.PI * a * e / t) * Math.cos(Math.PI * i * o / n));
		o.push(s);
	}
	let s = o[0], c = o.slice(1), u = "", d = r - 1 + (a - 1) * 9;
	u += i(d, 1);
	let f;
	if (c.length > 0) {
		let e = Math.max(...c.map((e) => Math.max(...e))), t = Math.floor(Math.max(0, Math.min(82, Math.floor(e * 166 - .5))));
		f = (t + 1) / 166, u += i(t, 1);
	} else f = 1, u += i(0, 1);
	return u += i(g(s), 4), c.forEach((e) => {
		u += i(_(e, f), 2);
	}), u;
};
export { p as n, t };
