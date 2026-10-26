import { At as e, B as t, Ct as n, F as r, G as i, I as a, J as o, K as s, M as c, N as l, R as u, S as d, U as f, W as p, X as m, Y as h, _ as g, a as _, at as v, b as y, ct as b, dt as x, et as S, f as C, ft as w, g as T, gt as E, h as D, i as O, jt as k, k as A, kt as j, lt as M, m as N, mt as P, n as F, o as I, ot as L, q as R, r as z, s as ee, t as te, tt as ne, ut as B, v as V, w as re, wt as ie, x as ae, y as oe, yt as H } from "./index-client-Bdka-Daw.js";
import { n as se } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { n as ce } from "./relayConfigUtils-DD5f1UAM.js";
import { B as le, F as ue, I as de, L as fe, M as pe, P as me, Q as he, et as ge, ht as U, j as _e, o as ve, pt as ye, s as be, st as xe, t as Se } from "./LoadingPlaceholder-j1_vRYno.js";
import { r as Ce } from "./authStore.svelte-CoGdd5_Z.js";
import { a as we, i as Te, s as Ee } from "./relayStore.svelte-BIc4bQdy.js";
import { St as De, Tt as Oe, X as ke, a as Ae, c as je, ft as Me, ht as Ne, k as Pe, n as Fe, q as Ie, s as Le, u as Re } from "./appUtils-C7IXsQBk.js";
import { a as ze, c as Be, i as Ve, n as He, o as Ue, r as We, s as Ge, t as Ke, u as qe } from "./swStore.svelte-BkcXmAWP.js";
import { n as W, r as Je } from "./settingsStore.svelte-CSIU6F7z.js";
import { i as Ye } from "./clipboardUtils-CZAthnT_.js";
import { t as Xe } from "./useDialogHistory.svelte-Bf7sbISs.js";
import { a as Ze, i as Qe, n as $e, r as et, t as tt } from "./menu-trigger-DMUMT31S.js";
import { t as nt } from "./hidden-input-tPGwDx5-.js";
import { t as rt } from "./DialogWrapper-B6dIEHnd.js";
import { t as it } from "./dialog-close-BqMvQbkH.js";
import { _ as at, d as ot, h as st, m as ct, t as lt, v as ut, x as dt, y as ft } from "./uploadDestinationResolver-DIhkZLuN.js";
import { i as pt } from "./keyboardFocusUtils-Cil9djR5.js";
import { Q as mt, a as ht, at as gt, dt as _t, i as vt, it as yt, q as bt, rt as xt } from "./App-CPn8s-cx.js";
import { t as St } from "./InfoPopoverButton-htZxnpH-.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/switch/switch.svelte.js
var Ct = ue({
	component: "switch",
	parts: ["root", "thumb"]
}), wt = new he("Switch.Root"), Tt = class e {
	static create(t) {
		return wt.set(new e(t));
	}
	opts;
	attachment;
	constructor(e) {
		this.opts = e, this.attachment = le(e.ref), this.onkeydown = this.onkeydown.bind(this), this.onclick = this.onclick.bind(this);
	}
	#e() {
		this.opts.checked.current = !this.opts.checked.current;
	}
	onkeydown(e) {
		e.key !== "Enter" && e.key !== " " || this.opts.disabled.current || (e.preventDefault(), this.#e());
	}
	onclick(e) {
		this.opts.disabled.current || this.#e();
	}
	#t = H(() => ({
		"data-disabled": _e(this.opts.disabled.current),
		"data-state": fe(this.opts.checked.current),
		"data-required": _e(this.opts.required.current)
	}));
	get sharedProps() {
		return S(this.#t);
	}
	set sharedProps(e) {
		P(this.#t, e);
	}
	#n = H(() => ({ checked: this.opts.checked.current }));
	get snippetProps() {
		return S(this.#n);
	}
	set snippetProps(e) {
		P(this.#n, e);
	}
	#r = H(() => ({
		...this.sharedProps,
		id: this.opts.id.current,
		role: "switch",
		disabled: me(this.opts.disabled.current),
		"aria-checked": de(this.opts.checked.current, !1),
		"aria-required": pe(this.opts.required.current),
		[Ct.root]: "",
		onclick: this.onclick,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return S(this.#r);
	}
	set props(e) {
		P(this.#r, e);
	}
}, Et = class e {
	static create() {
		return new e(wt.get());
	}
	root;
	#e = H(() => this.root.opts.name.current !== void 0);
	get shouldRender() {
		return S(this.#e);
	}
	set shouldRender(e) {
		P(this.#e, e);
	}
	constructor(e) {
		this.root = e;
	}
	#t = H(() => ({
		type: "checkbox",
		name: this.root.opts.name.current,
		value: this.root.opts.value.current,
		checked: this.root.opts.checked.current,
		disabled: this.root.opts.disabled.current,
		required: this.root.opts.required.current
	}));
	get props() {
		return S(this.#t);
	}
	set props(e) {
		P(this.#t, e);
	}
}, Dt = class e {
	static create(t) {
		return new e(t, wt.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = le(e.ref);
	}
	#e = H(() => ({ checked: this.root.opts.checked.current }));
	get snippetProps() {
		return S(this.#e);
	}
	set snippetProps(e) {
		P(this.#e, e);
	}
	#t = H(() => ({
		...this.root.sharedProps,
		id: this.opts.id.current,
		[Ct.thumb]: "",
		...this.attachment
	}));
	get props() {
		return S(this.#t);
	}
	set props(e) {
		P(this.#t, e);
	}
};
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/switch/components/switch-input.svelte
function Ot(e, t) {
	ie(t, !0);
	let r = Et.create();
	var i = p(), a = M(i), o = (e) => {
		nt(e, _(() => r.props));
	};
	u(a, (e) => {
		r.shouldRender && e(o);
	}), f(e, i), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/switch/components/switch.svelte
var kt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"ref",
	"id",
	"disabled",
	"required",
	"checked",
	"value",
	"name",
	"type",
	"onCheckedChange"
]), At = i("<button><!></button>"), jt = i("<!> <!>", 1);
function Mt(t, r) {
	let i = s();
	ie(r, !0);
	let a = z(r, "ref", 15, null), o = z(r, "id", 19, () => ve(i)), c = z(r, "disabled", 3, !1), d = z(r, "required", 3, !1), m = z(r, "checked", 15, !1), h = z(r, "value", 3, "on"), g = z(r, "name", 3, void 0), _ = z(r, "type", 3, "button"), v = z(r, "onCheckedChange", 3, be), y = O(r, kt), C = Tt.create({
		checked: xe(() => m(), (e) => {
			m(e), v()?.(e);
		}),
		disabled: xe(() => c() ?? !1),
		required: xe(() => d()),
		value: xe(() => h()),
		name: xe(() => g()),
		id: xe(() => o()),
		ref: xe(() => a(), (e) => a(e))
	}), w = H(() => ge(y, C.props, { type: _() }));
	var E = jt(), D = M(E), A = (e) => {
		var t = p(), n = M(t);
		{
			let e = H(() => ({
				props: S(w),
				...C.snippetProps
			}));
			l(n, () => r.child, () => S(e));
		}
		f(e, t);
	}, j = (t) => {
		var n = At();
		T(n, () => ({ ...S(w) }));
		var i = b(n);
		l(i, () => r.children ?? k, () => C.snippetProps), e(n), f(t, n);
	};
	u(D, (e) => {
		r.child ? e(A) : e(j, -1);
	}), Ot(x(D, 2), {}), f(t, E), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/switch/components/switch-thumb.svelte
var Nt = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"child",
	"children",
	"ref",
	"id"
]), Pt = i("<span><!></span>");
function Ft(t, r) {
	let i = s();
	ie(r, !0);
	let a = z(r, "ref", 15, null), o = z(r, "id", 19, () => ve(i)), c = O(r, Nt), d = Dt.create({
		id: xe(() => o()),
		ref: xe(() => a(), (e) => a(e))
	}), m = H(() => ge(c, d.props));
	var h = p(), g = M(h), _ = (e) => {
		var t = p(), n = M(t);
		{
			let e = H(() => ({
				props: S(m),
				...d.snippetProps
			}));
			l(n, () => r.child, () => S(e));
		}
		f(e, t);
	}, v = (t) => {
		var n = Pt();
		T(n, () => ({ ...S(m) }));
		var i = b(n);
		l(i, () => r.children ?? k, () => d.snippetProps), e(n), f(t, n);
	};
	u(g, (e) => {
		r.child ? e(_) : e(v, -1);
	}), f(t, h), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-zap-view/dist/nostr-zap-view.esm.js
var It = {
	203: (e, t) => {
		function n(e) {
			if (!Number.isSafeInteger(e)) throw Error(`Wrong integer: ${e}`);
		}
		function r(...e) {
			let t = (e, t) => (n) => e(t(n));
			return {
				encode: Array.from(e).reverse().reduce(((e, n) => e ? t(e, n.encode) : n.encode), void 0),
				decode: e.reduce(((e, n) => e ? t(e, n.decode) : n.decode), void 0)
			};
		}
		function i(e) {
			return {
				encode: (t) => {
					if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw Error("alphabet.encode input should be an array of numbers");
					return t.map(((t) => {
						if (n(t), t < 0 || t >= e.length) throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);
						return e[t];
					}));
				},
				decode: (t) => {
					if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw Error("alphabet.decode input should be array of strings");
					return t.map(((t) => {
						if (typeof t != "string") throw Error(`alphabet.decode: not string element=${t}`);
						let n = e.indexOf(t);
						if (n === -1) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
						return n;
					}));
				}
			};
		}
		function a(e = "") {
			if (typeof e != "string") throw Error("join separator should be string");
			return {
				encode: (t) => {
					if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw Error("join.encode input should be array of strings");
					for (let e of t) if (typeof e != "string") throw Error(`join.encode: non-string input=${e}`);
					return t.join(e);
				},
				decode: (t) => {
					if (typeof t != "string") throw Error("join.decode input should be string");
					return t.split(e);
				}
			};
		}
		function o(e, t = "=") {
			if (n(e), typeof t != "string") throw Error("padding chr should be string");
			return {
				encode(n) {
					if (!Array.isArray(n) || n.length && typeof n[0] != "string") throw Error("padding.encode input should be array of strings");
					for (let e of n) if (typeof e != "string") throw Error(`padding.encode: non-string input=${e}`);
					for (; n.length * e % 8;) n.push(t);
					return n;
				},
				decode(n) {
					if (!Array.isArray(n) || n.length && typeof n[0] != "string") throw Error("padding.encode input should be array of strings");
					for (let e of n) if (typeof e != "string") throw Error(`padding.decode: non-string input=${e}`);
					let r = n.length;
					if (r * e % 8) throw Error("Invalid padding: string should have whole number of bytes");
					for (; r > 0 && n[r - 1] === t; r--) if (!((r - 1) * e % 8)) throw Error("Invalid padding: string has too much padding");
					return n.slice(0, r);
				}
			};
		}
		function s(e) {
			if (typeof e != "function") throw Error("normalize fn should be function");
			return {
				encode: (e) => e,
				decode: (t) => e(t)
			};
		}
		function c(e, t, r) {
			if (t < 2) throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);
			if (r < 2) throw Error(`convertRadix: wrong to=${r}, base cannot be less than 2`);
			if (!Array.isArray(e)) throw Error("convertRadix: data should be array");
			if (!e.length) return [];
			let i = 0, a = [], o = Array.from(e);
			for (o.forEach(((e) => {
				if (n(e), e < 0 || e >= t) throw Error(`Wrong integer: ${e}`);
			}));;) {
				let e = 0, n = !0;
				for (let a = i; a < o.length; a++) {
					let s = o[a], c = t * e + s;
					if (!Number.isSafeInteger(c) || t * e / t !== e || c - s != t * e || (e = c % r, o[a] = Math.floor(c / r), !Number.isSafeInteger(o[a]) || o[a] * r + e !== c)) throw Error("convertRadix: carry overflow");
					n && (o[a] ? n = !1 : i = a);
				}
				if (a.push(e), n) break;
			}
			for (let t = 0; t < e.length - 1 && e[t] === 0; t++) a.push(0);
			return a.reverse();
		}
		Object.defineProperty(t, "__esModule", { value: !0 }), t.bytes = t.stringToBytes = t.str = t.bytesToString = t.hex = t.utf8 = t.bech32m = t.bech32 = t.base58check = t.base58xmr = t.base58xrp = t.base58flickr = t.base58 = t.base64url = t.base64 = t.base32crockford = t.base32hex = t.base32 = t.base16 = t.utils = t.assertNumber = void 0, t.assertNumber = n;
		let l = (e, t) => t ? l(t, e % t) : e, u = (e, t) => e + (t - l(e, t));
		function d(e, t, r, i) {
			if (!Array.isArray(e)) throw Error("convertRadix2: data should be array");
			if (t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
			if (r <= 0 || r > 32) throw Error(`convertRadix2: wrong to=${r}`);
			if (u(t, r) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${u(t, r)}`);
			let a = 0, o = 0, s = 2 ** r - 1, c = [];
			for (let i of e) {
				if (n(i), i >= 2 ** t) throw Error(`convertRadix2: invalid data word=${i} from=${t}`);
				if (a = a << t | i, o + t > 32) throw Error(`convertRadix2: carry overflow pos=${o} from=${t}`);
				for (o += t; o >= r; o -= r) c.push((a >> o - r & s) >>> 0);
				a &= 2 ** o - 1;
			}
			if (a = a << r - o & s, !i && o >= t) throw Error("Excess padding");
			if (!i && a) throw Error(`Non-zero padding: ${a}`);
			return i && o > 0 && c.push(a >>> 0), c;
		}
		function f(e) {
			return n(e), {
				encode: (t) => {
					if (!(t instanceof Uint8Array)) throw Error("radix.encode input should be Uint8Array");
					return c(Array.from(t), 256, e);
				},
				decode: (t) => {
					if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw Error("radix.decode input should be array of strings");
					return Uint8Array.from(c(t, e, 256));
				}
			};
		}
		function p(e, t = !1) {
			if (n(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
			if (u(8, e) > 32 || u(e, 8) > 32) throw Error("radix2: carry overflow");
			return {
				encode: (n) => {
					if (!(n instanceof Uint8Array)) throw Error("radix2.encode input should be Uint8Array");
					return d(Array.from(n), 8, e, !t);
				},
				decode: (n) => {
					if (!Array.isArray(n) || n.length && typeof n[0] != "number") throw Error("radix2.decode input should be array of strings");
					return Uint8Array.from(d(n, e, 8, t));
				}
			};
		}
		function m(e) {
			if (typeof e != "function") throw Error("unsafeWrapper fn should be function");
			return function(...t) {
				try {
					return e.apply(null, t);
				} catch {}
			};
		}
		function h(e, t) {
			if (n(e), typeof t != "function") throw Error("checksum fn should be function");
			return {
				encode(n) {
					if (!(n instanceof Uint8Array)) throw Error("checksum.encode: input should be Uint8Array");
					let r = t(n).slice(0, e), i = new Uint8Array(n.length + e);
					return i.set(n), i.set(r, n.length), i;
				},
				decode(n) {
					if (!(n instanceof Uint8Array)) throw Error("checksum.decode: input should be Uint8Array");
					let r = n.slice(0, -e), i = t(r).slice(0, e), a = n.slice(-e);
					for (let t = 0; t < e; t++) if (i[t] !== a[t]) throw Error("Invalid checksum");
					return r;
				}
			};
		}
		t.utils = {
			alphabet: i,
			chain: r,
			checksum: h,
			radix: f,
			radix2: p,
			join: a,
			padding: o
		}, t.base16 = r(p(4), i("0123456789ABCDEF"), a("")), t.base32 = r(p(5), i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), o(5), a("")), t.base32hex = r(p(5), i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), o(5), a("")), t.base32crockford = r(p(5), i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), a(""), s(((e) => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), t.base64 = r(p(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), o(6), a("")), t.base64url = r(p(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), o(6), a(""));
		let g = (e) => r(f(58), i(e), a(""));
		t.base58 = g("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), t.base58flickr = g("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), t.base58xrp = g("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
		let _ = [
			0,
			2,
			3,
			5,
			6,
			7,
			9,
			10,
			11
		];
		t.base58xmr = {
			encode(e) {
				let n = "";
				for (let r = 0; r < e.length; r += 8) {
					let i = e.subarray(r, r + 8);
					n += t.base58.encode(i).padStart(_[i.length], "1");
				}
				return n;
			},
			decode(e) {
				let n = [];
				for (let r = 0; r < e.length; r += 11) {
					let i = e.slice(r, r + 11), a = _.indexOf(i.length), o = t.base58.decode(i);
					for (let e = 0; e < o.length - a; e++) if (o[e] !== 0) throw Error("base58xmr: wrong padding");
					n = n.concat(Array.from(o.slice(o.length - a)));
				}
				return Uint8Array.from(n);
			}
		}, t.base58check = (e) => r(h(4, ((t) => e(e(t)))), t.base58);
		let v = r(i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), a("")), y = [
			996825010,
			642813549,
			513874426,
			1027748829,
			705979059
		];
		function b(e) {
			let t = e >> 25, n = (33554431 & e) << 5;
			for (let e = 0; e < y.length; e++) (t >> e & 1) == 1 && (n ^= y[e]);
			return n;
		}
		function x(e, t, n = 1) {
			let r = e.length, i = 1;
			for (let t = 0; t < r; t++) {
				let n = e.charCodeAt(t);
				if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
				i = b(i) ^ n >> 5;
			}
			i = b(i);
			for (let t = 0; t < r; t++) i = b(i) ^ 31 & e.charCodeAt(t);
			for (let e of t) i = b(i) ^ e;
			for (let e = 0; e < 6; e++) i = b(i);
			return i ^= n, v.encode(d([i % 2 ** 30], 30, 5, !1));
		}
		function S(e) {
			let t = e === "bech32" ? 1 : 734539939, n = p(5), r = n.decode, i = n.encode, a = m(r);
			function o(e, n = 90) {
				if (typeof e != "string") throw Error("bech32.decode input should be string, not " + typeof e);
				if (e.length < 8 || !1 !== n && e.length > n) throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${n})`);
				let r = e.toLowerCase();
				if (e !== r && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
				let i = (e = r).lastIndexOf("1");
				if (i === 0 || i === -1) throw Error("Letter \"1\" must be present between prefix and data only");
				let a = e.slice(0, i), o = e.slice(i + 1);
				if (o.length < 6) throw Error("Data must be at least 6 characters long");
				let s = v.decode(o).slice(0, -6), c = x(a, s, t);
				if (!o.endsWith(c)) throw Error(`Invalid checksum in ${e}: expected "${c}"`);
				return {
					prefix: a,
					words: s
				};
			}
			return {
				encode: function(e, n, r = 90) {
					if (typeof e != "string") throw Error("bech32.encode prefix should be string, not " + typeof e);
					if (!Array.isArray(n) || n.length && typeof n[0] != "number") throw Error("bech32.encode words should be array of numbers, not " + typeof n);
					let i = e.length + 7 + n.length;
					if (!1 !== r && i > r) throw TypeError(`Length ${i} exceeds limit ${r}`);
					return `${e = e.toLowerCase()}1${v.encode(n)}${x(e, n, t)}`;
				},
				decode: o,
				decodeToBytes: function(e) {
					let { prefix: t, words: n } = o(e, !1);
					return {
						prefix: t,
						words: n,
						bytes: r(n)
					};
				},
				decodeUnsafe: m(o),
				fromWords: r,
				fromWordsUnsafe: a,
				toWords: i
			};
		}
		t.bech32 = S("bech32"), t.bech32m = S("bech32m"), t.utf8 = {
			encode: (e) => new TextDecoder().decode(e),
			decode: (e) => new TextEncoder().encode(e)
		}, t.hex = r(p(4), i("0123456789abcdef"), a(""), s(((e) => {
			if (typeof e != "string" || e.length % 2) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
			return e.toLowerCase();
		})));
		let C = {
			utf8: t.utf8,
			hex: t.hex,
			base16: t.base16,
			base32: t.base32,
			base64: t.base64,
			base64url: t.base64url,
			base58: t.base58,
			base58xmr: t.base58xmr
		}, w = `Invalid encoding type. Available types: ${Object.keys(C).join(", ")}`;
		t.bytesToString = (e, t) => {
			if (typeof e != "string" || !C.hasOwnProperty(e)) throw TypeError(w);
			if (!(t instanceof Uint8Array)) throw TypeError("bytesToString() expects Uint8Array");
			return C[e].encode(t);
		}, t.str = t.bytesToString, t.stringToBytes = (e, t) => {
			if (!C.hasOwnProperty(e)) throw TypeError(w);
			if (typeof t != "string") throw TypeError("stringToBytes() expects string");
			return C[e].decode(t);
		}, t.bytes = t.stringToBytes;
	},
	806: (e, t, n) => {
		n.d(t, { A: () => s });
		var r = n(601), i = n.n(r), a = n(314), o = n.n(a)()(i());
		o.push([
			e.id,
			".zap-sender.with-comment {\n  border-radius: 6px 6px 0 0;\n}\n\n/* Color Classes Generator */\n[class*=\"zap-amount-\"] .zap-sender {\n  border-radius: 6px;\n}\n\n[class*=\"zap-amount-\"] .zap-sender.with-comment {\n  border-radius: 6px 6px 0 0;\n}\n\n[class*=\"zap-amount-\"] .zap-details {\n  padding-top: 8px;\n  padding-bottom: 8px;\n}\n\n/* Amount-based Styles */\n.zap-amount-100 .zap-sender {\n  background-color: var(--zap-100);\n}\n\n.zap-amount-200 .zap-sender {\n  background-color: var(--zap-200);\n}\n\n.zap-amount-500 .zap-sender {\n  background-color: var(--zap-500);\n}\n\n.zap-amount-1k .zap-sender {\n  background-color: var(--zap-1k);\n}\n\n.zap-amount-2k .zap-sender {\n  background-color: var(--zap-2k);\n}\n\n.zap-amount-5k .zap-sender {\n  background-color: var(--zap-5k);\n}\n\n.zap-amount-10k .zap-sender {\n  background-color: var(--zap-10k);\n}\n\n/* Details Background Colors */\n.zap-amount-100 .zap-details {\n  background-color: var(--zap-100-light);\n}\n\n.zap-amount-200 .zap-details {\n  background-color: var(--zap-200-light);\n}\n\n.zap-amount-500 .zap-details {\n  background-color: var(--zap-500-light);\n}\n\n.zap-amount-1k .zap-details {\n  background-color: var(--zap-1k-light);\n}\n\n.zap-amount-2k .zap-details {\n  background-color: var(--zap-2k-light);\n}\n\n.zap-amount-5k .zap-details {\n  background-color: var(--zap-5k-light);\n}\n\n.zap-amount-10k .zap-details {\n  background-color: var(--zap-10k-light);\n}\n\n/* Dark Text Colors */\n.zap-amount-100,\n.zap-amount-2k,\n.zap-amount-5k,\n.zap-amount-10k {\n  .zap-amount {\n    color: var(--text-light);\n  }\n\n  .sender-name {\n    color: var(--text-light-secondary);\n  }\n\n  .sender-pubkey {\n    color: var(--text-light-tertiary);\n  }\n\n  .zap-comment {\n    color: var(--text-light);\n  }\n}\n\n/* Light Text Colors */\n.zap-amount-200,\n.zap-amount-500,\n.zap-amount-1k {\n  .zap-amount {\n    color: var(--text-dark);\n  }\n\n  .sender-name {\n    color: var(--text-dark-secondary);\n  }\n\n  .sender-pubkey {\n    color: var(--text-dark-tertiary);\n  }\n\n  .zap-comment {\n    color: var(--text-dark);\n  }\n}",
			""
		]);
		let s = o;
	},
	540: (e, t, n) => {
		n.r(t), n.d(t, { default: () => l });
		var r = n(601), i = n.n(r), a = n(314), o = n.n(a), s = n(806), c = o()(i());
		c.i(s.A), c.push([
			e.id,
			"/* styles.css */\n\n:host {\n  --main-font: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen,\n    Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif;\n  --main-text: Black;\n  --pubkey-text: #888;\n  --custom-title-text: #555;\n  --stats-item-text: #333;\n  --name-text: #444;\n  --dialog-bg: #ffffff;\n  --zap-stats-bg: #edf2f7;\n  --hover-bg: #edf2f7;\n  --border: #ddd;\n  --skeleton: #fdfdfd;\n  --skeleton2: #e2e5ec;\n  --zap-stats-skeleton-bg: #bbc5cf;\n  --new-mark: #22c55e;\n\n  /* Zap Amount Colors */\n  --zap-100: #1565c0;\n  --zap-200: #00b8d4;\n  --zap-500: #00bfa5;\n  --zap-1k: #ffb300;\n  --zap-2k: #e65100;\n  --zap-5k: #c2185b;\n  --zap-10k: #d00000;\n\n  /* Light Variants */\n  --zap-100-light: #1e88e5;\n  --zap-200-light: #00e5ff;\n  --zap-500-light: #1de9b6;\n  --zap-1k-light: #ffca28;\n  --zap-2k-light: #f57c00;\n  --zap-5k-light: #e91e63;\n  --zap-10k-light: #e62117;\n\n  /* Text Colors */\n  --text-light: #ffffff;\n  --text-light-secondary: rgba(255, 255, 255, 0.9);\n  --text-light-tertiary: rgba(255, 255, 255, 0.5);\n  --text-dark: #000000;\n  --text-dark-secondary: rgba(0, 0, 0, 0.7);\n  --text-dark-tertiary: rgba(0, 0, 0, 0.5);\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbutton {\n  color: var(--main-text);\n  background: none;\n  border: none;\n  cursor: pointer;\n}\n\n.dialog {\n  font-family: var(--main-font);\n  color: var(--main-text);\n  font-size: medium;\n  font-weight: normal;\n  max-height: 700px;\n  height: 100dvh;\n  width: 360px;\n  margin: auto;\n  padding: 0;\n  border: none;\n  border-radius: 10px;\n  background: var(--dialog-bg);\n  display: flex;\n  flex-direction: column;\n}\n\n.close-dialog-button {\n  color: var(--custom-title-text);\n  font-size: 16px;\n  font-weight: 500;\n  position: absolute;\n  right: 0;\n  width: 2.625rem;\n  height: 2.625rem;\n  border: none;\n  border-radius: 50%;\n  background: none;\n  cursor: pointer;\n  padding: 10px;\n  text-align: center;\n}\n\n.close-dialog-button:hover {\n  background-color: var(--hover-bg);\n}\n\n.dialog-title {\n  height: 42px;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  & a {\n    font-size: 0.9rem;\n    font-weight: normal;\n    color: var(--pubkey-text);\n    text-decoration: none;\n    cursor: pointer;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    display: inline-block;\n  }\n\n  & a:hover {\n    text-decoration: underline;\n  }\n}\n\n.dialog-title.custom-title a {\n  color: var(--custom-title-text);\n  font-weight: 600;\n  font-size: 1rem;\n}\n\n.zap-stats {\n  min-height: 80px;\n  padding: 6px 14px;\n  background: var(--zap-stats-bg);\n  border-radius: 6px;\n  display: grid;\n  grid-template-columns: 90px 1fr 40px;\n  grid-template-rows: repeat(3, 1fr);\n  gap: 4px;\n  margin: 0 8px;\n\n  .stats-item {\n    height: 23px;\n    color: var(--stats-item-text);\n    font-size: 0.9rem;\n\n    .number {\n      font-size: 1.1rem;\n      font-weight: 500;\n    }\n\n    .number.skeleton {\n      width: 100%;\n      background: linear-gradient(90deg,\n          var(--skeleton) 0%,\n          var(--zap-stats-skeleton-bg) 50%,\n          var(--skeleton) 100%);\n      background-size: 200% 100%;\n    }\n  }\n}\n\n.stats-item:nth-child(3n + 1) {\n  justify-content: flex-start;\n}\n\n.stats-item:nth-child(3n + 2),\n.stats-item:nth-child(3n + 3) {\n  justify-content: flex-end;\n}\n\n.text-muted {\n  margin-right: 16px;\n  opacity: 0.4;\n}\n\n.dialog-zap-list {\n  list-style-type: none;\n  margin: 10px 0;\n  padding: 0 6px;\n  flex: 1;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scroll-behavior: smooth;\n\n  /* スクロールバーのスタイリング */\n  &::-webkit-scrollbar {\n    width: 6px;\n    height: 6px;\n  }\n\n  &::-webkit-scrollbar-track {\n    background: transparent;\n    border-radius: 3px;\n  }\n\n  &::-webkit-scrollbar-thumb {\n    background: rgba(0, 0, 0, 0.1);\n    border-radius: 3px;\n    transition: background 0.2s;\n  }\n\n  &::-webkit-scrollbar-thumb:hover {\n    background: rgba(0, 0, 0, 0.2);\n  }\n\n  /* Firefox用のスクロールバースタイル */\n  scrollbar-width: thin;\n  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;\n}\n\n.zap-list-item {\n  display: flex;\n  flex-direction: column;\n  border-top: 1px solid var(--border);\n  padding: 4px 0;\n}\n\n.zap-content {\n  display: flex;\n  flex-direction: column;\n}\n\n.reference-container {\n  display: flex;\n  flex-direction: column;\n}\n\n.zap-sender {\n  gap: 12px;\n  height: 46px;\n  justify-content: space-between;\n  padding: 6px;\n}\n\n.sender-icon {\n  flex-shrink: 0;\n\n  & img {\n    width: 100%;\n    height: 100%;\n    border-radius: 4px;\n    object-fit: cover;\n    object-position: center;\n  }\n}\n\n.sender-icon.is-new::before {\n  content: \"\";\n  position: absolute;\n  top: -4px;\n  left: -4px;\n  width: 8px;\n  height: 8px;\n  background-color: var(--new-mark);\n  border: 1px solid #fff;\n  border-radius: 50%;\n  z-index: 1;\n  animation: pulse 2500ms cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n\n@keyframes pulse {\n  50% {\n    opacity: 0.3;\n  }\n}\n\n.sender-info {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: flex-start;\n  overflow: hidden;\n  min-width: 0;\n}\n\n.sender-name {\n  font-size: 0.9375rem;\n  font-weight: bold;\n  color: var(--name-text);\n}\n\n.sender-pubkey {\n  font-size: 0.625rem;\n  color: var(--pubkey-text);\n  margin-top: -1px;\n}\n\n.zap-amount {\n  font-size: 0.8rem;\n  white-space: nowrap;\n  flex-shrink: 0;\n\n  .number {\n    font-size: 1.4rem;\n    font-weight: 500;\n    text-align: right;\n  }\n}\n\n.zap-details {\n  padding: 2px 8px;\n  border-radius: 0 0 6px 6px;\n  margin: 0;\n}\n\n.zap-comment {\n  font-size: 0.9375rem;\n  margin: 0;\n  white-space: pre-wrap;\n  overflow-wrap: break-word;\n  max-width: 100%;\n}\n\n.no-zaps-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n}\n\n.no-zaps-message {\n  text-align: center;\n  color: var(--pubkey-text);\n  font-size: 1.8rem;\n  font-weight: 700;\n}\n\n.zap-reference {\n  padding: 2px 0 2px 12px;\n  margin: 0;\n  font-size: 0.875rem;\n  color: var(--pubkey-text);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.reference-arrow {\n  flex-shrink: 0;\n\n  img {\n    height: 16px;\n    width: auto;\n  }\n}\n\n.reference-text {\n  font-size: 0.75rem;\n  margin: 0 2px;\n  flex-grow: 1;\n}\n\n.reference-link {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 1.5rem;\n  width: 2.6rem;\n  text-decoration: none;\n  border-left: 1px solid var(--border);\n  flex-shrink: 0;\n\n  & img {\n    height: 20px;\n    width: auto;\n  }\n}\n\n.zap-placeholder-name {\n  height: 30px;\n  width: 140px;\n}\n\n.zap-placeholder-name.skeleton {\n  width: 120px;\n  height: 19px;\n  margin: 2px 0;\n}\n\n.skeleton {\n  color: transparent;\n  border-radius: 2px;\n  background: linear-gradient(90deg,\n      var(--skeleton) 0%,\n      var(--skeleton2) 50%,\n      var(--skeleton) 100%);\n  background-size: 200% 100%;\n  animation: loading-animation 3.5s infinite;\n  opacity: 0.7;\n}\n\n@keyframes loading-animation {\n  0% {\n    background-position: 200% 0;\n  }\n\n  100% {\n    background-position: -200% 0;\n  }\n}\n\n/* 共通のテキストオーバーフロー処理 */\n.dialog-title,\n.sender-name,\n.sender-pubkey,\n.reference-text {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* 共通のフレックスボックス設定 */\n.zap-sender,\n.stats-item,\n.zap-details,\n.reference-link,\n.zap-reference {\n  display: flex;\n  align-items: center;\n}\n\n/* 共通のアイコンサイズ */\n.zap-placeholder-icon,\n.sender-icon {\n  width: 32px;\n  height: 32px;\n  border-radius: 4px;\n  position: relative;\n}\n\n.load-more-trigger {\n  height: 40px;\n  margin: 10px 0;\n  padding: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.loading-spinner {\n  width: 24px;\n  height: 24px;\n  border: 3px solid var(--zap-stats-bg);\n  border-top: 3px solid var(--pubkey-text);\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}",
			""
		]);
		let l = c;
	},
	314: (e) => {
		e.exports = function(e) {
			var t = [];
			return t.toString = function() {
				return this.map((function(t) {
					var n = "", r = t[5] !== void 0;
					return t[4] && (n += `@supports (${t[4]}) {`), t[2] && (n += `@media ${t[2]} {`), r && (n += `@layer${t[5].length > 0 ? ` ${t[5]}` : ""} {`), n += e(t), r && (n += "}"), t[2] && (n += "}"), t[4] && (n += "}"), n;
				})).join("");
			}, t.i = function(e, n, r, i, a) {
				typeof e == "string" && (e = [[
					null,
					e,
					void 0
				]]);
				var o = {};
				if (r) for (var s = 0; s < this.length; s++) {
					var c = this[s][0];
					c != null && (o[c] = !0);
				}
				for (var l = 0; l < e.length; l++) {
					var u = [].concat(e[l]);
					r && o[u[0]] || (a !== void 0 && (u[5] === void 0 || (u[1] = `@layer${u[5].length > 0 ? ` ${u[5]}` : ""} {${u[1]}}`), u[5] = a), n && (u[2] && (u[1] = `@media ${u[2]} {${u[1]}}`), u[2] = n), i && (u[4] ? (u[1] = `@supports (${u[4]}) {${u[1]}}`, u[4] = i) : u[4] = `${i}`), t.push(u));
				}
			}, t;
		};
	},
	601: (e) => {
		e.exports = function(e) {
			return e[1];
		};
	},
	705: (e, t, n) => {
		let { bech32: r, hex: i, utf8: a } = n(203), o = {
			bech32: "bc",
			pubKeyHash: 0,
			scriptHash: 5,
			validWitnessVersions: [0]
		}, s = {
			bech32: "tb",
			pubKeyHash: 111,
			scriptHash: 196,
			validWitnessVersions: [0]
		}, c = {
			bech32: "tbs",
			pubKeyHash: 111,
			scriptHash: 196,
			validWitnessVersions: [0]
		}, l = {
			bech32: "bcrt",
			pubKeyHash: 111,
			scriptHash: 196,
			validWitnessVersions: [0]
		}, u = {
			bech32: "sb",
			pubKeyHash: 63,
			scriptHash: 123,
			validWitnessVersions: [0]
		}, d = [
			"option_data_loss_protect",
			"initial_routing_sync",
			"option_upfront_shutdown_script",
			"gossip_queries",
			"var_onion_optin",
			"gossip_queries_ex",
			"option_static_remotekey",
			"payment_secret",
			"basic_mpp",
			"option_support_large_channel"
		], f = {
			m: BigInt(1e3),
			u: BigInt(1e6),
			n: BigInt(1e9),
			p: BigInt(0xe8d4a51000)
		}, p = BigInt("2100000000000000000"), m = BigInt(1e11), h = {
			payment_hash: 1,
			payment_secret: 16,
			description: 13,
			payee: 19,
			description_hash: 23,
			expiry: 6,
			min_final_cltv_expiry: 24,
			fallback_address: 9,
			route_hint: 3,
			feature_bits: 5,
			metadata: 27
		}, g = {};
		for (let e = 0, t = Object.keys(h); e < t.length; e++) {
			let n = t[e], r = h[t[e]].toString();
			g[r] = n;
		}
		let _ = {
			1: (e) => i.encode(r.fromWordsUnsafe(e)),
			16: (e) => i.encode(r.fromWordsUnsafe(e)),
			13: (e) => a.encode(r.fromWordsUnsafe(e)),
			19: (e) => i.encode(r.fromWordsUnsafe(e)),
			23: (e) => i.encode(r.fromWordsUnsafe(e)),
			27: (e) => i.encode(r.fromWordsUnsafe(e)),
			6: y,
			24: y,
			3: function(e) {
				let t = [], n, a, o, s, c, l = r.fromWordsUnsafe(e);
				for (; l.length > 0;) n = i.encode(l.slice(0, 33)), a = i.encode(l.slice(33, 41)), o = parseInt(i.encode(l.slice(41, 45)), 16), s = parseInt(i.encode(l.slice(45, 49)), 16), c = parseInt(i.encode(l.slice(49, 51)), 16), l = l.slice(51), t.push({
					pubkey: n,
					short_channel_id: a,
					fee_base_msat: o,
					fee_proportional_millionths: s,
					cltv_expiry_delta: c
				});
				return t;
			},
			5: function(e) {
				let t = e.slice().reverse().map(((e) => [
					!!(1 & e),
					!!(2 & e),
					!!(4 & e),
					!!(8 & e),
					!!(16 & e)
				])).reduce(((e, t) => e.concat(t)), []);
				for (; t.length < 2 * d.length;) t.push(!1);
				let n = {};
				d.forEach(((e, r) => {
					let i;
					i = t[2 * r] ? "required" : t[2 * r + 1] ? "supported" : "unsupported", n[e] = i;
				}));
				let r = t.slice(2 * d.length);
				return n.extra_bits = {
					start_bit: 2 * d.length,
					bits: r,
					has_required: r.reduce(((e, t, n) => n % 2 == 0 ? e || t : e || !1), !1)
				}, n;
			}
		};
		function v(e) {
			return (t) => ({
				tagCode: parseInt(e),
				words: r.encode("unknown", t, 2 ** 53 - 1)
			});
		}
		function y(e) {
			return e.reverse().reduce(((e, t, n) => e + t * 32 ** n), 0);
		}
		function b(e, t) {
			let n, r;
			if (e.slice(-1).match(/^[munp]$/)) n = e.slice(-1), r = e.slice(0, -1);
			else {
				if (e.slice(-1).match(/^[^munp0-9]$/)) throw Error("Not a valid multiplier for the amount");
				r = e;
			}
			if (!r.match(/^\d+$/)) throw Error("Not a valid human readable amount");
			let i = BigInt(r), a = n ? i * m / f[n] : i * m;
			if (n === "p" && i % BigInt(10) !== BigInt(0) || a > p) throw Error("Amount is outside of valid range");
			return t ? a.toString() : a;
		}
		e.exports = {
			decode: function(e, t) {
				if (typeof e != "string") throw Error("Lightning Payment Request must be string");
				if (e.slice(0, 2).toLowerCase() !== "ln") throw Error("Not a proper lightning payment request");
				let n = [], a = r.decode(e, 2 ** 53 - 1);
				e = e.toLowerCase();
				let d = a.prefix, f = a.words, p = e.slice(d.length + 1), m = f.slice(-104);
				f = f.slice(0, -104);
				let x = d.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);
				if (x && !x[2] && (x = d.match(/^ln(\S+)$/)), !x) throw Error("Not a proper lightning payment request");
				n.push({
					name: "lightning_network",
					letters: "ln"
				});
				let S = x[1], C;
				if (t) {
					if (t.bech32 === void 0 || t.pubKeyHash === void 0 || t.scriptHash === void 0 || !Array.isArray(t.validWitnessVersions)) throw Error("Invalid network");
					C = t;
				} else switch (S) {
					case o.bech32:
						C = o;
						break;
					case s.bech32:
						C = s;
						break;
					case c.bech32:
						C = c;
						break;
					case l.bech32:
						C = l;
						break;
					case u.bech32: C = u;
				}
				if (!C || C.bech32 !== S) throw Error("Unknown coin bech32 prefix");
				n.push({
					name: "coin_network",
					letters: S,
					value: C
				});
				let w = x[2], T;
				w ? (T = b(w + x[3], !0), n.push({
					name: "amount",
					letters: x[2] + x[3],
					value: T
				})) : T = null, n.push({
					name: "separator",
					letters: "1"
				});
				let E = y(f.slice(0, 7)), D, O, k, A;
				for (f = f.slice(7), n.push({
					name: "timestamp",
					letters: p.slice(0, 7),
					value: E
				}), p = p.slice(7); f.length > 0;) {
					let e = f[0].toString();
					D = g[e] || "unknown_tag", O = _[e] || v(e), f = f.slice(1), k = y(f.slice(0, 2)), f = f.slice(2), A = f.slice(0, k), f = f.slice(k), n.push({
						name: D,
						tag: p[0],
						letters: p.slice(0, 3 + k),
						value: O(A)
					}), p = p.slice(3 + k);
				}
				n.push({
					name: "signature",
					letters: p.slice(0, 104),
					value: i.encode(r.fromWordsUnsafe(m))
				}), p = p.slice(104), n.push({
					name: "checksum",
					letters: p
				});
				let j = {
					paymentRequest: e,
					sections: n,
					get expiry() {
						let e = n.find(((e) => e.name === "expiry"));
						if (e) return M("timestamp") + e.value;
					},
					get route_hints() {
						return n.filter(((e) => e.name === "route_hint")).map(((e) => e.value));
					}
				};
				for (let e in h) e !== "route_hint" && Object.defineProperty(j, e, { get: () => M(e) });
				return j;
				function M(e) {
					let t = n.find(((t) => t.name === e));
					return t ? t.value : void 0;
				}
			},
			hrpToMillisat: b
		};
	},
	0: (e, t, n) => {
		var r = n(540);
		r && r.__esModule && (r = r.default), e.exports = typeof r == "string" ? r : r.toString();
	}
}, Lt = {};
function Rt(e) {
	var t = Lt[e];
	if (t !== void 0) return t.exports;
	var n = Lt[e] = {
		id: e,
		exports: {}
	};
	return It[e](n, n.exports, Rt), n.exports;
}
Rt.n = (e) => {
	var t = e && e.__esModule ? () => e.default : () => e;
	return Rt.d(t, { a: t }), t;
}, Rt.d = (e, t) => {
	for (var n in t) Rt.o(t, n) && !Rt.o(e, n) && Object.defineProperty(e, n, {
		enumerable: !0,
		get: t[n]
	});
}, Rt.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Rt.r = (e) => {
	typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
};
var zt = {};
Rt.d(zt, {
	vQ: () => q,
	ZM: () => au,
	yk: () => J,
	h0: () => sd,
	n_: () => hd,
	Xz: () => gd,
	Uv: () => $u,
	fU: () => od,
	Dw: () => ld
});
var Bt = {};
Rt.r(Bt), Rt.d(Bt, {
	OG: () => Cn,
	My: () => mn,
	Ph: () => _n,
	lX: () => vn,
	Id: () => Sn,
	fg: () => En,
	qj: () => xn,
	aT: () => gn,
	lq: () => yn,
	z: () => bn,
	Q5: () => On
});
var Vt = {};
Rt.r(Vt), Rt.d(Vt, {
	Relay: () => Xs,
	SimplePool: () => Qs,
	finalizeEvent: () => Qa,
	fj: () => Fs,
	generateSecretKey: () => Xa,
	getEventHash: () => Ja,
	getFilterLimit: () => Ps,
	getPublicKey: () => Za,
	kinds: () => eo,
	matchFilter: () => js,
	matchFilters: () => Ms,
	mergeFilters: () => Ns,
	nip04: () => gc,
	nip05: () => bc,
	nip10: () => Oc,
	nip11: () => Ac,
	nip13: () => Nc,
	nip18: () => Lc,
	nip19: () => $s,
	nip21: () => Vc,
	nip25: () => Gc,
	nip27: () => Jc,
	nip28: () => Qc,
	nip30: () => il,
	nip39: () => ul,
	nip42: () => Hs,
	nip44: () => pl,
	nip47: () => wl,
	nip57: () => Ol,
	nip59: () => Pl,
	nip98: () => ql,
	parseReferences: () => hc,
	serializeEvent: () => qa,
	sortEvents: () => La,
	utils: () => Ra,
	validateEvent: () => Ia,
	verifiedSymbol: () => Pa,
	verifyEvent: () => $a
});
var Ht = Rt(705);
function Ut(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error(`Wrong positive integer: ${e}`);
}
function Wt(e, ...t) {
	if (!(e instanceof Uint8Array)) throw Error("Expected Uint8Array");
	if (t.length > 0 && !t.includes(e.length)) throw Error(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Gt(e) {
	if (typeof e != "function" || typeof e.create != "function") throw Error("Hash should be wrapped by utils.wrapConstructor");
	Ut(e.outputLen), Ut(e.blockLen);
}
function Kt(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function qt(e, t) {
	Wt(e);
	let n = t.outputLen;
	if (e.length < n) throw Error(`digestInto() expects output buffer of length at least ${n}`);
}
var Jt = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, Yt = (e) => e instanceof Uint8Array, Xt = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Zt = (e, t) => e << 32 - t | e >>> t;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw Error("Non little-endian hardware is not supported");
function Qt(e) {
	if (typeof e == "string" && (e = function(e) {
		if (typeof e != "string") throw Error("utf8ToBytes expected string, got " + typeof e);
		return new Uint8Array(new TextEncoder().encode(e));
	}(e)), !Yt(e)) throw Error("expected Uint8Array, got " + typeof e);
	return e;
}
var $t = class {
	clone() {
		return this._cloneInto();
	}
};
function en(e) {
	let t = (t) => e().update(Qt(t)).digest(), n = e();
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function tn(e = 32) {
	if (Jt && typeof Jt.getRandomValues == "function") return Jt.getRandomValues(new Uint8Array(e));
	throw Error("crypto.getRandomValues must be defined");
}
var nn = class extends $t {
	constructor(e, t, n, r) {
		super(), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xt(this.buffer);
	}
	update(e) {
		Kt(this);
		let { view: t, buffer: n, blockLen: r } = this, i = (e = Qt(e)).length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o !== r) n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
			else {
				let t = Xt(e);
				for (; r <= i - a; a += r) this.process(t, a);
			}
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		Kt(this), qt(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		(function(e, t, n, r) {
			if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
			let i = BigInt(32), a = BigInt(4294967295), o = Number(n >> i & a), s = Number(n & a), c = r ? 4 : 0, l = r ? 0 : 4;
			e.setUint32(t + c, o, r), e.setUint32(t + l, s, r);
		})(n, r - 8, BigInt(8 * this.length), i), this.process(n, 0);
		let o = Xt(e), s = this.outputLen;
		if (s % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
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
		return e.length = r, e.pos = o, e.finished = i, e.destroyed = a, r % t && e.buffer.set(n), e;
	}
}, rn = (e, t, n) => e & t ^ e & n ^ t & n, an = new Uint32Array([
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
]), on = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), sn = /* @__PURE__ */ new Uint32Array(64), cn = class extends nn {
	constructor() {
		super(64, 32, 8, !1), this.A = 0 | on[0], this.B = 0 | on[1], this.C = 0 | on[2], this.D = 0 | on[3], this.E = 0 | on[4], this.F = 0 | on[5], this.G = 0 | on[6], this.H = 0 | on[7];
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
		this.A = 0 | e, this.B = 0 | t, this.C = 0 | n, this.D = 0 | r, this.E = 0 | i, this.F = 0 | a, this.G = 0 | o, this.H = 0 | s;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) sn[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = sn[e - 15], n = sn[e - 2], r = Zt(t, 7) ^ Zt(t, 18) ^ t >>> 3, i = Zt(n, 17) ^ Zt(n, 19) ^ n >>> 10;
			sn[e] = i + sn[e - 7] + r + sn[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = l + (Zt(o, 6) ^ Zt(o, 11) ^ Zt(o, 25)) + ((u = o) & s ^ ~u & c) + an[e] + sn[e] | 0, d = (Zt(n, 2) ^ Zt(n, 13) ^ Zt(n, 22)) + rn(n, r, i) | 0;
			l = c, c = s, s = o, o = a + t | 0, a = i, i = r, r = n, n = t + d | 0;
		}
		var u;
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		sn.fill(0);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
	}
}, ln = en((() => new cn())), un = BigInt(1), dn = BigInt(2), fn = (e) => e instanceof Uint8Array, pn = Array.from({ length: 256 }, ((e, t) => t.toString(16).padStart(2, "0")));
function mn(e) {
	if (!fn(e)) throw Error("Uint8Array expected");
	let t = "";
	for (let n = 0; n < e.length; n++) t += pn[e[n]];
	return t;
}
function hn(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	return BigInt(e === "" ? "0" : `0x${e}`);
}
function gn(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	let t = e.length;
	if (t % 2) throw Error("padded hex string expected, got unpadded hex of length " + t);
	let n = new Uint8Array(t / 2);
	for (let t = 0; t < n.length; t++) {
		let r = 2 * t, i = e.slice(r, r + 2), a = Number.parseInt(i, 16);
		if (Number.isNaN(a) || a < 0) throw Error("Invalid byte sequence");
		n[t] = a;
	}
	return n;
}
function _n(e) {
	return hn(mn(e));
}
function vn(e) {
	if (!fn(e)) throw Error("Uint8Array expected");
	return hn(mn(Uint8Array.from(e).reverse()));
}
function yn(e, t) {
	return gn(e.toString(16).padStart(2 * t, "0"));
}
function bn(e, t) {
	return yn(e, t).reverse();
}
function xn(e, t, n) {
	let r;
	if (typeof t == "string") try {
		r = gn(t);
	} catch (n) {
		throw Error(`${e} must be valid hex string, got "${t}". Cause: ${n}`);
	}
	else {
		if (!fn(t)) throw Error(`${e} must be hex string or Uint8Array`);
		r = Uint8Array.from(t);
	}
	let i = r.length;
	if (typeof n == "number" && i !== n) throw Error(`${e} expected ${n} bytes, got ${i}`);
	return r;
}
function Sn(...e) {
	let t = new Uint8Array(e.reduce(((e, t) => e + t.length), 0)), n = 0;
	return e.forEach(((e) => {
		if (!fn(e)) throw Error("Uint8Array expected");
		t.set(e, n), n += e.length;
	})), t;
}
var Cn = (e) => (dn << BigInt(e - 1)) - un, wn = (e) => new Uint8Array(e), Tn = (e) => Uint8Array.from(e);
function En(e, t, n) {
	if (typeof e != "number" || e < 2) throw Error("hashLen must be a number");
	if (typeof t != "number" || t < 2) throw Error("qByteLen must be a number");
	if (typeof n != "function") throw Error("hmacFn must be a function");
	let r = wn(e), i = wn(e), a = 0, o = () => {
		r.fill(1), i.fill(0), a = 0;
	}, s = (...e) => n(i, r, ...e), c = (e = wn()) => {
		i = s(Tn([0]), e), r = s(), e.length !== 0 && (i = s(Tn([1]), e), r = s());
	}, l = () => {
		if (a++ >= 1e3) throw Error("drbg: tried 1000 values");
		let e = 0, n = [];
		for (; e < t;) {
			r = s();
			let t = r.slice();
			n.push(t), e += r.length;
		}
		return Sn(...n);
	};
	return (e, t) => {
		let n;
		for (o(), c(e); !(n = t(l()));) c();
		return o(), n;
	};
}
var Dn = {
	bigint: (e) => typeof e == "bigint",
	function: (e) => typeof e == "function",
	boolean: (e) => typeof e == "boolean",
	string: (e) => typeof e == "string",
	stringOrUint8Array: (e) => typeof e == "string" || e instanceof Uint8Array,
	isSafeInteger: (e) => Number.isSafeInteger(e),
	array: (e) => Array.isArray(e),
	field: (e, t) => t.Fp.isValid(e),
	hash: (e) => typeof e == "function" && Number.isSafeInteger(e.outputLen)
};
function On(e, t, n = {}) {
	let r = (t, n, r) => {
		let i = Dn[n];
		if (typeof i != "function") throw Error(`Invalid validator "${n}", expected function`);
		let a = e[t];
		if (!(r && a === void 0 || i(a, e))) throw Error(`Invalid param ${String(t)}=${a} (${typeof a}), expected ${n}`);
	};
	for (let [e, n] of Object.entries(t)) r(e, n, !1);
	for (let [e, t] of Object.entries(n)) r(e, t, !0);
	return e;
}
var kn = BigInt(0), An = BigInt(1), jn = BigInt(2), Mn = BigInt(3), Nn = BigInt(4), Pn = BigInt(5), Fn = BigInt(8);
function In(e, t) {
	let n = e % t;
	return n >= kn ? n : t + n;
}
function Ln(e, t, n) {
	if (n <= kn || t < kn) throw Error("Expected power/modulo > 0");
	if (n === An) return kn;
	let r = An;
	for (; t > kn;) t & An && (r = r * e % n), e = e * e % n, t >>= An;
	return r;
}
function Rn(e, t, n) {
	let r = e;
	for (; t-- > kn;) r *= r, r %= n;
	return r;
}
function zn(e, t) {
	if (e === kn || t <= kn) throw Error(`invert: expected positive integers, got n=${e} mod=${t}`);
	let n = In(e, t), r = t, i = kn, a = An, o = An, s = kn;
	for (; n !== kn;) {
		let e = r / n, t = r % n, c = i - o * e, l = a - s * e;
		r = n, n = t, i = o, a = s, o = c, s = l;
	}
	if (r !== An) throw Error("invert: does not exist");
	return In(i, t);
}
function Bn(e) {
	if (e % Nn === Mn) {
		let t = (e + An) / Nn;
		return function(e, n) {
			let r = e.pow(n, t);
			if (!e.eql(e.sqr(r), n)) throw Error("Cannot find square root");
			return r;
		};
	}
	if (e % Fn === Pn) {
		let t = (e - Pn) / Fn;
		return function(e, n) {
			let r = e.mul(n, jn), i = e.pow(r, t), a = e.mul(n, i), o = e.mul(e.mul(a, jn), i), s = e.mul(a, e.sub(o, e.ONE));
			if (!e.eql(e.sqr(s), n)) throw Error("Cannot find square root");
			return s;
		};
	}
	return function(e) {
		let t = (e - An) / jn, n, r, i;
		for (n = e - An, r = 0; n % jn === kn; n /= jn, r++);
		for (i = jn; i < e && Ln(i, t, e) !== e - An; i++);
		if (r === 1) {
			let t = (e + An) / Nn;
			return function(e, n) {
				let r = e.pow(n, t);
				if (!e.eql(e.sqr(r), n)) throw Error("Cannot find square root");
				return r;
			};
		}
		let a = (n + An) / jn;
		return function(e, o) {
			if (e.pow(o, t) === e.neg(e.ONE)) throw Error("Cannot find square root");
			let s = r, c = e.pow(e.mul(e.ONE, i), n), l = e.pow(o, a), u = e.pow(o, n);
			for (; !e.eql(u, e.ONE);) {
				if (e.eql(u, e.ZERO)) return e.ZERO;
				let t = 1;
				for (let n = e.sqr(u); t < s && !e.eql(n, e.ONE); t++) n = e.sqr(n);
				let n = e.pow(c, An << BigInt(s - t - 1));
				c = e.sqr(n), l = e.mul(l, n), u = e.mul(u, c), s = t;
			}
			return l;
		};
	}(e);
}
var Vn = [
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
function Hn(e, t) {
	let n = t === void 0 ? e.toString(2).length : t;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
function Un(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	let t = e.toString(2).length;
	return Math.ceil(t / 8);
}
function Wn(e) {
	let t = Un(e);
	return t + Math.ceil(t / 2);
}
var Gn = class extends $t {
	constructor(e, t) {
		super(), this.finished = !1, this.destroyed = !1, Gt(e);
		let n = Qt(t);
		if (this.iHash = e.create(), typeof this.iHash.update != "function") throw Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let r = this.blockLen, i = new Uint8Array(r);
		i.set(n.length > r ? e.create().update(n).digest() : n);
		for (let e = 0; e < i.length; e++) i[e] ^= 54;
		this.iHash.update(i), this.oHash = e.create();
		for (let e = 0; e < i.length; e++) i[e] ^= 106;
		this.oHash.update(i), i.fill(0);
	}
	update(e) {
		return Kt(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		Kt(this), Wt(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
	}
	digest() {
		let e = new Uint8Array(this.oHash.outputLen);
		return this.digestInto(e), e;
	}
	_cloneInto(e) {
		e ||= Object.create(Object.getPrototypeOf(this), {});
		let { oHash: t, iHash: n, finished: r, destroyed: i, blockLen: a, outputLen: o } = this;
		return e.finished = r, e.destroyed = i, e.blockLen = a, e.outputLen = o, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
	}
	destroy() {
		this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
	}
}, Kn = (e, t, n) => new Gn(e, t).update(n).digest();
Kn.create = (e, t) => new Gn(e, t);
var qn = BigInt(0), Jn = BigInt(1);
function Yn(e) {
	return On(e.Fp, Vn.reduce(((e, t) => (e[t] = "function", e)), {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "isSafeInteger",
		BITS: "isSafeInteger"
	})), On(e, {
		n: "bigint",
		h: "bigint",
		Gx: "field",
		Gy: "field"
	}, {
		nBitLength: "isSafeInteger",
		nByteLength: "isSafeInteger"
	}), Object.freeze({
		...Hn(e.n, e.nBitLength),
		...e,
		p: e.Fp.ORDER
	});
}
var { Ph: Xn, aT: Zn } = Bt, Qn = {
	Err: class extends Error {
		constructor(e = "") {
			super(e);
		}
	},
	_parseInt(e) {
		let { Err: t } = Qn;
		if (e.length < 2 || e[0] !== 2) throw new t("Invalid signature integer tag");
		let n = e[1], r = e.subarray(2, n + 2);
		if (!n || r.length !== n) throw new t("Invalid signature integer: wrong length");
		if (128 & r[0]) throw new t("Invalid signature integer: negative");
		if (r[0] === 0 && !(128 & r[1])) throw new t("Invalid signature integer: unnecessary leading zero");
		return {
			d: Xn(r),
			l: e.subarray(n + 2)
		};
	},
	toSig(e) {
		let { Err: t } = Qn, n = typeof e == "string" ? Zn(e) : e;
		if (!(n instanceof Uint8Array)) throw Error("ui8a expected");
		let r = n.length;
		if (r < 2 || n[0] != 48) throw new t("Invalid signature tag");
		if (n[1] !== r - 2) throw new t("Invalid signature: incorrect length");
		let { d: i, l: a } = Qn._parseInt(n.subarray(2)), { d: o, l: s } = Qn._parseInt(a);
		if (s.length) throw new t("Invalid signature: left bytes after parsing");
		return {
			r: i,
			s: o
		};
	},
	hexFromSig(e) {
		let t = (e) => 8 & Number.parseInt(e[0], 16) ? "00" + e : e, n = (e) => {
			let t = e.toString(16);
			return 1 & t.length ? `0${t}` : t;
		}, r = t(n(e.s)), i = t(n(e.r)), a = r.length / 2, o = i.length / 2, s = n(a), c = n(o);
		return `30${n(o + a + 4)}02${c}${i}02${s}${r}`;
	}
}, $n = BigInt(0), er = BigInt(1), tr = BigInt(3);
function nr(e) {
	let t = function(e) {
		let t = Yn(e);
		On(t, {
			a: "field",
			b: "field"
		}, {
			allowedPrivateKeyLengths: "array",
			wrapPrivateKey: "boolean",
			isTorsionFree: "function",
			clearCofactor: "function",
			allowInfinityPoint: "boolean",
			fromBytes: "function",
			toBytes: "function"
		});
		let { endo: n, Fp: r, a: i } = t;
		if (n) {
			if (!r.eql(i, r.ZERO)) throw Error("Endomorphism can only be defined for Koblitz curves that have a=0");
			if (typeof n != "object" || typeof n.beta != "bigint" || typeof n.splitScalar != "function") throw Error("Expected endomorphism with beta: bigint and splitScalar: function");
		}
		return Object.freeze({ ...t });
	}(e), { Fp: n } = t, r = t.toBytes || ((e, t, r) => {
		let i = t.toAffine();
		return Sn(Uint8Array.from([4]), n.toBytes(i.x), n.toBytes(i.y));
	}), i = t.fromBytes || ((e) => {
		let t = e.subarray(1);
		return {
			x: n.fromBytes(t.subarray(0, n.BYTES)),
			y: n.fromBytes(t.subarray(n.BYTES, 2 * n.BYTES))
		};
	});
	function a(e) {
		let { a: r, b: i } = t, a = n.sqr(e), o = n.mul(a, e);
		return n.add(n.add(o, n.mul(e, r)), i);
	}
	if (!n.eql(n.sqr(t.Gy), a(t.Gx))) throw Error("bad generator point: equation left != right");
	function o(e) {
		return typeof e == "bigint" && $n < e && e < t.n;
	}
	function s(e) {
		if (!o(e)) throw Error("Expected valid bigint: 0 < bigint < curve.n");
	}
	function c(e) {
		let { allowedPrivateKeyLengths: n, nByteLength: r, wrapPrivateKey: i, n: a } = t;
		if (n && typeof e != "bigint") {
			if (e instanceof Uint8Array && (e = mn(e)), typeof e != "string" || !n.includes(e.length)) throw Error("Invalid key");
			e = e.padStart(2 * r, "0");
		}
		let o;
		try {
			o = typeof e == "bigint" ? e : _n(xn("private key", e, r));
		} catch {
			throw Error(`private key must be ${r} bytes, hex or bigint, not ${typeof e}`);
		}
		return i && (o = In(o, a)), s(o), o;
	}
	let l = /* @__PURE__ */ new Map();
	function u(e) {
		if (!(e instanceof d)) throw Error("ProjectivePoint expected");
	}
	class d {
		constructor(e, t, r) {
			if (this.px = e, this.py = t, this.pz = r, e == null || !n.isValid(e)) throw Error("x required");
			if (t == null || !n.isValid(t)) throw Error("y required");
			if (r == null || !n.isValid(r)) throw Error("z required");
		}
		static fromAffine(e) {
			let { x: t, y: r } = e || {};
			if (!e || !n.isValid(t) || !n.isValid(r)) throw Error("invalid affine point");
			if (e instanceof d) throw Error("projective point not allowed");
			let i = (e) => n.eql(e, n.ZERO);
			return i(t) && i(r) ? d.ZERO : new d(t, r, n.ONE);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static normalizeZ(e) {
			let t = n.invertBatch(e.map(((e) => e.pz)));
			return e.map(((e, n) => e.toAffine(t[n]))).map(d.fromAffine);
		}
		static fromHex(e) {
			let t = d.fromAffine(i(xn("pointHex", e)));
			return t.assertValidity(), t;
		}
		static fromPrivateKey(e) {
			return d.BASE.multiply(c(e));
		}
		_setWindowSize(e) {
			this._WINDOW_SIZE = e, l.delete(this);
		}
		assertValidity() {
			if (this.is0()) {
				if (t.allowInfinityPoint && !n.is0(this.py)) return;
				throw Error("bad point: ZERO");
			}
			let { x: e, y: r } = this.toAffine();
			if (!n.isValid(e) || !n.isValid(r)) throw Error("bad point: x or y not FE");
			let i = n.sqr(r), o = a(e);
			if (!n.eql(i, o)) throw Error("bad point: equation left != right");
			if (!this.isTorsionFree()) throw Error("bad point: not in prime-order subgroup");
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (n.isOdd) return !n.isOdd(e);
			throw Error("Field doesn't support isOdd");
		}
		equals(e) {
			u(e);
			let { px: t, py: r, pz: i } = this, { px: a, py: o, pz: s } = e, c = n.eql(n.mul(t, s), n.mul(a, i)), l = n.eql(n.mul(r, s), n.mul(o, i));
			return c && l;
		}
		negate() {
			return new d(this.px, n.neg(this.py), this.pz);
		}
		double() {
			let { a: e, b: r } = t, i = n.mul(r, tr), { px: a, py: o, pz: s } = this, c = n.ZERO, l = n.ZERO, u = n.ZERO, f = n.mul(a, a), p = n.mul(o, o), m = n.mul(s, s), h = n.mul(a, o);
			return h = n.add(h, h), u = n.mul(a, s), u = n.add(u, u), c = n.mul(e, u), l = n.mul(i, m), l = n.add(c, l), c = n.sub(p, l), l = n.add(p, l), l = n.mul(c, l), c = n.mul(h, c), u = n.mul(i, u), m = n.mul(e, m), h = n.sub(f, m), h = n.mul(e, h), h = n.add(h, u), u = n.add(f, f), f = n.add(u, f), f = n.add(f, m), f = n.mul(f, h), l = n.add(l, f), m = n.mul(o, s), m = n.add(m, m), f = n.mul(m, h), c = n.sub(c, f), u = n.mul(m, p), u = n.add(u, u), u = n.add(u, u), new d(c, l, u);
		}
		add(e) {
			u(e);
			let { px: r, py: i, pz: a } = this, { px: o, py: s, pz: c } = e, l = n.ZERO, f = n.ZERO, p = n.ZERO, m = t.a, h = n.mul(t.b, tr), g = n.mul(r, o), _ = n.mul(i, s), v = n.mul(a, c), y = n.add(r, i), b = n.add(o, s);
			y = n.mul(y, b), b = n.add(g, _), y = n.sub(y, b), b = n.add(r, a);
			let x = n.add(o, c);
			return b = n.mul(b, x), x = n.add(g, v), b = n.sub(b, x), x = n.add(i, a), l = n.add(s, c), x = n.mul(x, l), l = n.add(_, v), x = n.sub(x, l), p = n.mul(m, b), l = n.mul(h, v), p = n.add(l, p), l = n.sub(_, p), p = n.add(_, p), f = n.mul(l, p), _ = n.add(g, g), _ = n.add(_, g), v = n.mul(m, v), b = n.mul(h, b), _ = n.add(_, v), v = n.sub(g, v), v = n.mul(m, v), b = n.add(b, v), g = n.mul(_, b), f = n.add(f, g), g = n.mul(x, b), l = n.mul(y, l), l = n.sub(l, g), g = n.mul(y, _), p = n.mul(x, p), p = n.add(p, g), new d(l, f, p);
		}
		subtract(e) {
			return this.add(e.negate());
		}
		is0() {
			return this.equals(d.ZERO);
		}
		wNAF(e) {
			return p.wNAFCached(this, l, e, ((e) => {
				let t = n.invertBatch(e.map(((e) => e.pz)));
				return e.map(((e, n) => e.toAffine(t[n]))).map(d.fromAffine);
			}));
		}
		multiplyUnsafe(e) {
			let r = d.ZERO;
			if (e === $n) return r;
			if (s(e), e === er) return this;
			let { endo: i } = t;
			if (!i) return p.unsafeLadder(this, e);
			let { k1neg: a, k1: o, k2neg: c, k2: l } = i.splitScalar(e), u = r, f = r, m = this;
			for (; o > $n || l > $n;) o & er && (u = u.add(m)), l & er && (f = f.add(m)), m = m.double(), o >>= er, l >>= er;
			return a && (u = u.negate()), c && (f = f.negate()), f = new d(n.mul(f.px, i.beta), f.py, f.pz), u.add(f);
		}
		multiply(e) {
			s(e);
			let r, i, a = e, { endo: o } = t;
			if (o) {
				let { k1neg: e, k1: t, k2neg: s, k2: c } = o.splitScalar(a), { p: l, f: u } = this.wNAF(t), { p: f, f: m } = this.wNAF(c);
				l = p.constTimeNegate(e, l), f = p.constTimeNegate(s, f), f = new d(n.mul(f.px, o.beta), f.py, f.pz), r = l.add(f), i = u.add(m);
			} else {
				let { p: e, f: t } = this.wNAF(a);
				r = e, i = t;
			}
			return d.normalizeZ([r, i])[0];
		}
		multiplyAndAddUnsafe(e, t, n) {
			let r = d.BASE, i = (e, t) => t !== $n && t !== er && e.equals(r) ? e.multiply(t) : e.multiplyUnsafe(t), a = i(this, t).add(i(e, n));
			return a.is0() ? void 0 : a;
		}
		toAffine(e) {
			let { px: t, py: r, pz: i } = this, a = this.is0();
			e ??= a ? n.ONE : n.inv(i);
			let o = n.mul(t, e), s = n.mul(r, e), c = n.mul(i, e);
			if (a) return {
				x: n.ZERO,
				y: n.ZERO
			};
			if (!n.eql(c, n.ONE)) throw Error("invZ was invalid");
			return {
				x: o,
				y: s
			};
		}
		isTorsionFree() {
			let { h: e, isTorsionFree: n } = t;
			if (e === er) return !0;
			if (n) return n(d, this);
			throw Error("isTorsionFree() has not been declared for the elliptic curve");
		}
		clearCofactor() {
			let { h: e, clearCofactor: n } = t;
			return e === er ? this : n ? n(d, this) : this.multiplyUnsafe(t.h);
		}
		toRawBytes(e = !0) {
			return this.assertValidity(), r(d, this, e);
		}
		toHex(e = !0) {
			return mn(this.toRawBytes(e));
		}
	}
	d.BASE = new d(t.Gx, t.Gy, n.ONE), d.ZERO = new d(n.ZERO, n.ONE, n.ZERO);
	let f = t.nBitLength, p = function(e, t) {
		let n = (e, t) => {
			let n = t.negate();
			return e ? n : t;
		}, r = (e) => ({
			windows: Math.ceil(t / e) + 1,
			windowSize: 2 ** (e - 1)
		});
		return {
			constTimeNegate: n,
			unsafeLadder(t, n) {
				let r = e.ZERO, i = t;
				for (; n > qn;) n & Jn && (r = r.add(i)), i = i.double(), n >>= Jn;
				return r;
			},
			precomputeWindow(e, t) {
				let { windows: n, windowSize: i } = r(t), a = [], o = e, s = o;
				for (let e = 0; e < n; e++) {
					s = o, a.push(s);
					for (let e = 1; e < i; e++) s = s.add(o), a.push(s);
					o = s.double();
				}
				return a;
			},
			wNAF(t, i, a) {
				let { windows: o, windowSize: s } = r(t), c = e.ZERO, l = e.BASE, u = BigInt(2 ** t - 1), d = 2 ** t, f = BigInt(t);
				for (let e = 0; e < o; e++) {
					let t = e * s, r = Number(a & u);
					a >>= f, r > s && (r -= d, a += Jn);
					let o = t, p = t + Math.abs(r) - 1, m = e % 2 != 0, h = r < 0;
					r === 0 ? l = l.add(n(m, i[o])) : c = c.add(n(h, i[p]));
				}
				return {
					p: c,
					f: l
				};
			},
			wNAFCached(e, t, n, r) {
				let i = e._WINDOW_SIZE || 1, a = t.get(e);
				return a || (a = this.precomputeWindow(e, i), i !== 1 && t.set(e, r(a))), this.wNAF(i, a, n);
			}
		};
	}(d, t.endo ? Math.ceil(f / 2) : f);
	return {
		CURVE: t,
		ProjectivePoint: d,
		normPrivateKeyToScalar: c,
		weierstrassEquation: a,
		isWithinCurveOrder: o
	};
}
function rr(e) {
	let t = function(e) {
		let t = Yn(e);
		return On(t, {
			hash: "hash",
			hmac: "function",
			randomBytes: "function"
		}, {
			bits2int: "function",
			bits2int_modN: "function",
			lowS: "boolean"
		}), Object.freeze({
			lowS: !0,
			...t
		});
	}(e), { Fp: n, n: r } = t, i = n.BYTES + 1, a = 2 * n.BYTES + 1;
	function o(e) {
		return In(e, r);
	}
	function s(e) {
		return zn(e, r);
	}
	let { ProjectivePoint: c, normPrivateKeyToScalar: l, weierstrassEquation: u, isWithinCurveOrder: d } = nr({
		...t,
		toBytes(e, t, r) {
			let i = t.toAffine(), a = n.toBytes(i.x), o = Sn;
			return r ? o(Uint8Array.from([t.hasEvenY() ? 2 : 3]), a) : o(Uint8Array.from([4]), a, n.toBytes(i.y));
		},
		fromBytes(e) {
			let t = e.length, r = e[0], o = e.subarray(1);
			if (t !== i || r !== 2 && r !== 3) {
				if (t === a && r === 4) return {
					x: n.fromBytes(o.subarray(0, n.BYTES)),
					y: n.fromBytes(o.subarray(n.BYTES, 2 * n.BYTES))
				};
				throw Error(`Point of length ${t} was invalid. Expected ${i} compressed bytes or ${a} uncompressed bytes`);
			}
			{
				let e = _n(o);
				if (!($n < (s = e) && s < n.ORDER)) throw Error("Point is not on curve");
				let t = u(e), i = n.sqrt(t);
				return !(1 & ~r) != ((i & er) === er) && (i = n.neg(i)), {
					x: e,
					y: i
				};
			}
			var s;
		}
	}), f = (e) => mn(yn(e, t.nByteLength));
	function p(e) {
		return e > r >> er;
	}
	let m = (e, t, n) => _n(e.slice(t, n));
	class h {
		constructor(e, t, n) {
			this.r = e, this.s = t, this.recovery = n, this.assertValidity();
		}
		static fromCompact(e) {
			let n = t.nByteLength;
			return e = xn("compactSignature", e, 2 * n), new h(m(e, 0, n), m(e, n, 2 * n));
		}
		static fromDER(e) {
			let { r: t, s: n } = Qn.toSig(xn("DER", e));
			return new h(t, n);
		}
		assertValidity() {
			if (!d(this.r)) throw Error("r must be 0 < r < CURVE.n");
			if (!d(this.s)) throw Error("s must be 0 < s < CURVE.n");
		}
		addRecoveryBit(e) {
			return new h(this.r, this.s, e);
		}
		recoverPublicKey(e) {
			let { r, s: i, recovery: a } = this, l = y(xn("msgHash", e));
			if (a == null || ![
				0,
				1,
				2,
				3
			].includes(a)) throw Error("recovery id invalid");
			let u = a === 2 || a === 3 ? r + t.n : r;
			if (u >= n.ORDER) throw Error("recovery id 2 or 3 invalid");
			let d = 1 & a ? "03" : "02", p = c.fromHex(d + f(u)), m = s(u), h = o(-l * m), g = o(i * m), _ = c.BASE.multiplyAndAddUnsafe(p, h, g);
			if (!_) throw Error("point at infinify");
			return _.assertValidity(), _;
		}
		hasHighS() {
			return p(this.s);
		}
		normalizeS() {
			return this.hasHighS() ? new h(this.r, o(-this.s), this.recovery) : this;
		}
		toDERRawBytes() {
			return gn(this.toDERHex());
		}
		toDERHex() {
			return Qn.hexFromSig({
				r: this.r,
				s: this.s
			});
		}
		toCompactRawBytes() {
			return gn(this.toCompactHex());
		}
		toCompactHex() {
			return f(this.r) + f(this.s);
		}
	}
	let g = {
		isValidPrivateKey(e) {
			try {
				return l(e), !0;
			} catch {
				return !1;
			}
		},
		normPrivateKeyToScalar: l,
		randomPrivateKey: () => {
			let e = Wn(t.n);
			return function(e, t, n = !1) {
				let r = e.length, i = Un(t), a = Wn(t);
				if (r < 16 || r < a || r > 1024) throw Error(`expected ${a}-1024 bytes of input, got ${r}`);
				let o = In(n ? _n(e) : vn(e), t - An) + An;
				return n ? bn(o, i) : yn(o, i);
			}(t.randomBytes(e), t.n);
		},
		precompute: (e = 8, t = c.BASE) => (t._setWindowSize(e), t.multiply(BigInt(3)), t)
	};
	function _(e) {
		let t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
		return t ? r === i || r === a : n ? r === 2 * i || r === 2 * a : e instanceof c;
	}
	let v = t.bits2int || function(e) {
		let n = _n(e), r = 8 * e.length - t.nBitLength;
		return r > 0 ? n >> BigInt(r) : n;
	}, y = t.bits2int_modN || function(e) {
		return o(v(e));
	}, b = Cn(t.nBitLength);
	function x(e) {
		if (typeof e != "bigint") throw Error("bigint expected");
		if (!($n <= e && e < b)) throw Error(`bigint expected < 2^${t.nBitLength}`);
		return yn(e, t.nByteLength);
	}
	function S(e, r, i = C) {
		if (["recovered", "canonical"].some(((e) => e in i))) throw Error("sign() legacy options not supported");
		let { hash: a, randomBytes: u } = t, { lowS: f, prehash: m, extraEntropy: g } = i;
		f ??= !0, e = xn("msgHash", e), m && (e = xn("prehashed msgHash", a(e)));
		let _ = y(e), b = l(r), S = [x(b), x(_)];
		if (g != null) {
			let e = !0 === g ? u(n.BYTES) : g;
			S.push(xn("extraEntropy", e));
		}
		let w = Sn(...S), T = _;
		return {
			seed: w,
			k2sig: function(e) {
				let t = v(e);
				if (!d(t)) return;
				let n = s(t), r = c.BASE.multiply(t).toAffine(), i = o(r.x);
				if (i === $n) return;
				let a = o(n * o(T + i * b));
				if (a === $n) return;
				let l = (r.x === i ? 0 : 2) | Number(r.y & er), u = a;
				return f && p(a) && (u = function(e) {
					return p(e) ? o(-e) : e;
				}(a), l ^= 1), new h(i, u, l);
			}
		};
	}
	let C = {
		lowS: t.lowS,
		prehash: !1
	}, w = {
		lowS: t.lowS,
		prehash: !1
	};
	return c.BASE._setWindowSize(8), {
		CURVE: t,
		getPublicKey: function(e, t = !0) {
			return c.fromPrivateKey(e).toRawBytes(t);
		},
		getSharedSecret: function(e, t, n = !0) {
			if (_(e)) throw Error("first arg must be private key");
			if (!_(t)) throw Error("second arg must be public key");
			return c.fromHex(t).multiply(l(e)).toRawBytes(n);
		},
		sign: function(e, n, r = C) {
			let { seed: i, k2sig: a } = S(e, n, r), o = t;
			return En(o.hash.outputLen, o.nByteLength, o.hmac)(i, a);
		},
		verify: function(e, n, r, i = w) {
			let a = e;
			if (n = xn("msgHash", n), r = xn("publicKey", r), "strict" in i) throw Error("options.strict was renamed to lowS");
			let { lowS: l, prehash: u } = i, d, f;
			try {
				if (typeof a == "string" || a instanceof Uint8Array) try {
					d = h.fromDER(a);
				} catch (e) {
					if (!(e instanceof Qn.Err)) throw e;
					d = h.fromCompact(a);
				}
				else {
					if (typeof a != "object" || typeof a.r != "bigint" || typeof a.s != "bigint") throw Error("PARSE");
					{
						let { r: e, s: t } = a;
						d = new h(e, t);
					}
				}
				f = c.fromHex(r);
			} catch (e) {
				if (e.message === "PARSE") throw Error("signature must be Signature instance, Uint8Array or hex string");
				return !1;
			}
			if (l && d.hasHighS()) return !1;
			u && (n = t.hash(n));
			let { r: p, s: m } = d, g = y(n), _ = s(m), v = o(g * _), b = o(p * _), x = c.BASE.multiplyAndAddUnsafe(f, v, b)?.toAffine();
			return !!x && o(x.x) === p;
		},
		ProjectivePoint: c,
		Signature: h,
		utils: g
	};
}
function ir(e) {
	return {
		hash: e,
		hmac: (t, ...n) => Kn(e, t, function(...e) {
			let t = new Uint8Array(e.reduce(((e, t) => e + t.length), 0)), n = 0;
			return e.forEach(((e) => {
				if (!Yt(e)) throw Error("Uint8Array expected");
				t.set(e, n), n += e.length;
			})), t;
		}(...n)),
		randomBytes: tn
	};
}
var ar = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), or = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), sr = BigInt(1), cr = BigInt(2), lr = (e, t) => (e + t / cr) / t;
function ur(e) {
	let t = ar, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = Rn(Rn(Rn(u, n, t) * u % t, n, t) * u % t, cr, t) * l % t, f = Rn(d, i, t) * d % t, p = Rn(f, a, t) * f % t, m = Rn(p, s, t) * p % t, h = Rn(Rn(Rn(Rn(Rn(Rn(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, cr, t);
	if (!dr.eql(dr.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var dr = function(e, t, n = !1, r = {}) {
	if (e <= kn) throw Error(`Expected Field ORDER > 0, got ${e}`);
	let { nBitLength: i, nByteLength: a } = Hn(e, t);
	if (a > 2048) throw Error("Field lengths over 2048 bytes are not supported");
	let o = Bn(e), s = Object.freeze({
		ORDER: e,
		BITS: i,
		BYTES: a,
		MASK: Cn(i),
		ZERO: kn,
		ONE: An,
		create: (t) => In(t, e),
		isValid: (t) => {
			if (typeof t != "bigint") throw Error("Invalid field element: expected bigint, got " + typeof t);
			return kn <= t && t < e;
		},
		is0: (e) => e === kn,
		isOdd: (e) => (e & An) === An,
		neg: (t) => In(-t, e),
		eql: (e, t) => e === t,
		sqr: (t) => In(t * t, e),
		add: (t, n) => In(t + n, e),
		sub: (t, n) => In(t - n, e),
		mul: (t, n) => In(t * n, e),
		pow: (e, t) => function(e, t, n) {
			if (n < kn) throw Error("Expected power > 0");
			if (n === kn) return e.ONE;
			if (n === An) return t;
			let r = e.ONE, i = t;
			for (; n > kn;) n & An && (r = e.mul(r, i)), i = e.sqr(i), n >>= An;
			return r;
		}(s, e, t),
		div: (t, n) => In(t * zn(n, e), e),
		sqrN: (e) => e * e,
		addN: (e, t) => e + t,
		subN: (e, t) => e - t,
		mulN: (e, t) => e * t,
		inv: (t) => zn(t, e),
		sqrt: r.sqrt || ((e) => o(s, e)),
		invertBatch: (e) => function(e, t) {
			let n = Array(t.length), r = t.reduce(((t, r, i) => e.is0(r) ? t : (n[i] = t, e.mul(t, r))), e.ONE), i = e.inv(r);
			return t.reduceRight(((t, r, i) => e.is0(r) ? t : (n[i] = e.mul(t, n[i]), e.mul(t, r))), i), n;
		}(s, e),
		cmov: (e, t, n) => n ? t : e,
		toBytes: (e) => n ? bn(e, a) : yn(e, a),
		fromBytes: (e) => {
			if (e.length !== a) throw Error(`Fp.fromBytes: expected ${a}, got ${e.length}`);
			return n ? vn(e) : _n(e);
		}
	});
	return Object.freeze(s);
}(ar, void 0, void 0, { sqrt: ur }), fr = function(e, t) {
	let n = (t) => rr({
		...e,
		...ir(t)
	});
	return Object.freeze({
		...n(t),
		create: n
	});
}({
	a: BigInt(0),
	b: BigInt(7),
	Fp: dr,
	n: or,
	Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
	Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
	h: BigInt(1),
	lowS: !0,
	endo: {
		beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
		splitScalar: (e) => {
			let t = or, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -sr * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), a = n, o = BigInt("0x100000000000000000000000000000000"), s = lr(a * e, t), c = lr(-r * e, t), l = In(e - s * n - c * i, t), u = In(-s * r - c * a, t), d = l > o, f = u > o;
			if (d && (l = t - l), f && (u = t - u), l > o || u > o) throw Error("splitScalar: Endomorphism failed, k=" + e);
			return {
				k1neg: d,
				k1: l,
				k2neg: f,
				k2: u
			};
		}
	}
}, ln), pr = BigInt(0), mr = (e) => typeof e == "bigint" && pr < e && e < ar, hr = {};
function gr(e, ...t) {
	let n = hr[e];
	if (n === void 0) {
		let t = ln(Uint8Array.from(e, ((e) => e.charCodeAt(0))));
		n = Sn(t, t), hr[e] = n;
	}
	return ln(Sn(n, ...t));
}
var _r = (e) => e.toRawBytes(!0).slice(1), vr = (e) => yn(e, 32), yr = (e) => In(e, ar), br = (e) => In(e, or), xr = fr.ProjectivePoint;
function Sr(e) {
	let t = fr.utils.normPrivateKeyToScalar(e), n = xr.fromPrivateKey(t);
	return {
		scalar: n.hasEvenY() ? t : br(-t),
		bytes: _r(n)
	};
}
function Cr(e) {
	if (!mr(e)) throw Error("bad x: need 0 < x < p");
	let t = ur(yr(yr(e * e) * e + BigInt(7)));
	t % cr !== pr && (t = yr(-t));
	let n = new xr(e, t, sr);
	return n.assertValidity(), n;
}
function wr(...e) {
	return br(_n(gr("BIP0340/challenge", ...e)));
}
function Tr(e) {
	return Sr(e).bytes;
}
function Er(e, t, n = tn(32)) {
	let r = xn("message", e), { bytes: i, scalar: a } = Sr(t), o = br(_n(gr("BIP0340/nonce", vr(a ^ _n(gr("BIP0340/aux", xn("auxRand", n, 32)))), i, r)));
	if (o === pr) throw Error("sign failed: k is zero");
	let { bytes: s, scalar: c } = Sr(o), l = wr(s, i, r), u = /* @__PURE__ */ new Uint8Array(64);
	if (u.set(s, 0), u.set(vr(br(c + l * a)), 32), !Dr(u, r, i)) throw Error("sign: Invalid signature produced");
	return u;
}
function Dr(e, t, n) {
	let r = xn("signature", e, 64), i = xn("message", t), a = xn("publicKey", n, 32);
	try {
		let e = Cr(_n(a)), t = _n(r.subarray(0, 32));
		if (!mr(t)) return !1;
		let n = _n(r.subarray(32, 64));
		if (!(typeof (l = n) == "bigint" && pr < l && l < or)) return !1;
		let u = wr(vr(t), _r(e), i), d = (o = e, s = n, c = br(-u), xr.BASE.multiplyAndAddUnsafe(o, s, c));
		return !(!d || !d.hasEvenY() || d.toAffine().x !== t);
	} catch {
		return !1;
	}
	var o, s, c, l;
}
var Or = {
	getPublicKey: Tr,
	sign: Er,
	verify: Dr,
	utils: {
		randomPrivateKey: fr.utils.randomPrivateKey,
		lift_x: Cr,
		pointToBytes: _r,
		numberToBytesBE: yn,
		bytesToNumberBE: _n,
		taggedHash: gr,
		mod: In
	}
}, kr = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0, Ar = (e) => e instanceof Uint8Array, jr = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Mr = (e, t) => e << 32 - t | e >>> t;
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw Error("Non little-endian hardware is not supported");
var Nr = Array.from({ length: 256 }, ((e, t) => t.toString(16).padStart(2, "0")));
function Pr(e) {
	if (!Ar(e)) throw Error("Uint8Array expected");
	let t = "";
	for (let n = 0; n < e.length; n++) t += Nr[e[n]];
	return t;
}
function Fr(e) {
	if (typeof e != "string") throw Error("hex string expected, got " + typeof e);
	let t = e.length;
	if (t % 2) throw Error("padded hex string expected, got unpadded hex of length " + t);
	let n = new Uint8Array(t / 2);
	for (let t = 0; t < n.length; t++) {
		let r = 2 * t, i = e.slice(r, r + 2), a = Number.parseInt(i, 16);
		if (Number.isNaN(a) || a < 0) throw Error("Invalid byte sequence");
		n[t] = a;
	}
	return n;
}
function Ir(e) {
	if (typeof e == "string" && (e = function(e) {
		if (typeof e != "string") throw Error("utf8ToBytes expected string, got " + typeof e);
		return new Uint8Array(new TextEncoder().encode(e));
	}(e)), !Ar(e)) throw Error("expected Uint8Array, got " + typeof e);
	return e;
}
function Lr(...e) {
	let t = new Uint8Array(e.reduce(((e, t) => e + t.length), 0)), n = 0;
	return e.forEach(((e) => {
		if (!Ar(e)) throw Error("Uint8Array expected");
		t.set(e, n), n += e.length;
	})), t;
}
var Rr = class {
	clone() {
		return this._cloneInto();
	}
};
function zr(e) {
	let t = (t) => e().update(Ir(t)).digest(), n = e();
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Br(e = 32) {
	if (kr && typeof kr.getRandomValues == "function") return kr.getRandomValues(new Uint8Array(e));
	throw Error("crypto.getRandomValues must be defined");
}
function Vr(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error(`Wrong positive integer: ${e}`);
}
function Hr(e, ...t) {
	if (!(e instanceof Uint8Array)) throw Error("Expected Uint8Array");
	if (t.length > 0 && !t.includes(e.length)) throw Error(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
var Ur = {
	number: Vr,
	bool: function(e) {
		if (typeof e != "boolean") throw Error(`Expected boolean, not ${e}`);
	},
	bytes: Hr,
	hash: function(e) {
		if (typeof e != "function" || typeof e.create != "function") throw Error("Hash should be wrapped by utils.wrapConstructor");
		Vr(e.outputLen), Vr(e.blockLen);
	},
	exists: function(e, t = !0) {
		if (e.destroyed) throw Error("Hash instance has been destroyed");
		if (t && e.finished) throw Error("Hash#digest() has already been called");
	},
	output: function(e, t) {
		Hr(e);
		let n = t.outputLen;
		if (e.length < n) throw Error(`digestInto() expects output buffer of length at least ${n}`);
	}
}, Wr = class extends Rr {
	constructor(e, t, n, r) {
		super(), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jr(this.buffer);
	}
	update(e) {
		Ur.exists(this);
		let { view: t, buffer: n, blockLen: r } = this, i = (e = Ir(e)).length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o !== r) n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
			else {
				let t = jr(e);
				for (; r <= i - a; a += r) this.process(t, a);
			}
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		Ur.exists(this), Ur.output(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		(function(e, t, n, r) {
			if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
			let i = BigInt(32), a = BigInt(4294967295), o = Number(n >> i & a), s = Number(n & a), c = r ? 4 : 0, l = r ? 0 : 4;
			e.setUint32(t + c, o, r), e.setUint32(t + l, s, r);
		})(n, r - 8, BigInt(8 * this.length), i), this.process(n, 0);
		let o = jr(e), s = this.outputLen;
		if (s % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
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
		return e.length = r, e.pos = o, e.finished = i, e.destroyed = a, r % t && e.buffer.set(n), e;
	}
}, Gr = (e, t, n) => e & t ^ e & n ^ t & n, Kr = new Uint32Array([
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
]), qr = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), Jr = /* @__PURE__ */ new Uint32Array(64), Yr = class extends Wr {
	constructor() {
		super(64, 32, 8, !1), this.A = 0 | qr[0], this.B = 0 | qr[1], this.C = 0 | qr[2], this.D = 0 | qr[3], this.E = 0 | qr[4], this.F = 0 | qr[5], this.G = 0 | qr[6], this.H = 0 | qr[7];
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
		this.A = 0 | e, this.B = 0 | t, this.C = 0 | n, this.D = 0 | r, this.E = 0 | i, this.F = 0 | a, this.G = 0 | o, this.H = 0 | s;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) Jr[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = Jr[e - 15], n = Jr[e - 2], r = Mr(t, 7) ^ Mr(t, 18) ^ t >>> 3, i = Mr(n, 17) ^ Mr(n, 19) ^ n >>> 10;
			Jr[e] = i + Jr[e - 7] + r + Jr[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = l + (Mr(o, 6) ^ Mr(o, 11) ^ Mr(o, 25)) + ((u = o) & s ^ ~u & c) + Kr[e] + Jr[e] | 0, d = (Mr(n, 2) ^ Mr(n, 13) ^ Mr(n, 22)) + Gr(n, r, i) | 0;
			l = c, c = s, s = o, o = a + t | 0, a = i, i = r, r = n, n = t + d | 0;
		}
		var u;
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		Jr.fill(0);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
	}
}, Xr = class extends Yr {
	constructor() {
		super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
	}
}, Zr = zr((() => new Yr()));
zr((() => new Xr()));
function Qr(e) {
	if (!Number.isSafeInteger(e)) throw Error(`Wrong integer: ${e}`);
}
function $r(...e) {
	let t = (e, t) => (n) => e(t(n));
	return {
		encode: Array.from(e).reverse().reduce(((e, n) => e ? t(e, n.encode) : n.encode), void 0),
		decode: e.reduce(((e, n) => e ? t(e, n.decode) : n.decode), void 0)
	};
}
function ei(e) {
	return {
		encode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw Error("alphabet.encode input should be an array of numbers");
			return t.map(((t) => {
				if (Qr(t), t < 0 || t >= e.length) throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);
				return e[t];
			}));
		},
		decode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw Error("alphabet.decode input should be array of strings");
			return t.map(((t) => {
				if (typeof t != "string") throw Error(`alphabet.decode: not string element=${t}`);
				let n = e.indexOf(t);
				if (n === -1) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
				return n;
			}));
		}
	};
}
function ti(e = "") {
	if (typeof e != "string") throw Error("join separator should be string");
	return {
		encode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw Error("join.encode input should be array of strings");
			for (let e of t) if (typeof e != "string") throw Error(`join.encode: non-string input=${e}`);
			return t.join(e);
		},
		decode: (t) => {
			if (typeof t != "string") throw Error("join.decode input should be string");
			return t.split(e);
		}
	};
}
function ni(e, t = "=") {
	if (Qr(e), typeof t != "string") throw Error("padding chr should be string");
	return {
		encode(n) {
			if (!Array.isArray(n) || n.length && typeof n[0] != "string") throw Error("padding.encode input should be array of strings");
			for (let e of n) if (typeof e != "string") throw Error(`padding.encode: non-string input=${e}`);
			for (; n.length * e % 8;) n.push(t);
			return n;
		},
		decode(n) {
			if (!Array.isArray(n) || n.length && typeof n[0] != "string") throw Error("padding.encode input should be array of strings");
			for (let e of n) if (typeof e != "string") throw Error(`padding.decode: non-string input=${e}`);
			let r = n.length;
			if (r * e % 8) throw Error("Invalid padding: string should have whole number of bytes");
			for (; r > 0 && n[r - 1] === t; r--) if (!((r - 1) * e % 8)) throw Error("Invalid padding: string has too much padding");
			return n.slice(0, r);
		}
	};
}
function ri(e) {
	if (typeof e != "function") throw Error("normalize fn should be function");
	return {
		encode: (e) => e,
		decode: (t) => e(t)
	};
}
function ii(e, t, n) {
	if (t < 2) throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);
	if (n < 2) throw Error(`convertRadix: wrong to=${n}, base cannot be less than 2`);
	if (!Array.isArray(e)) throw Error("convertRadix: data should be array");
	if (!e.length) return [];
	let r = 0, i = [], a = Array.from(e);
	for (a.forEach(((e) => {
		if (Qr(e), e < 0 || e >= t) throw Error(`Wrong integer: ${e}`);
	}));;) {
		let e = 0, o = !0;
		for (let i = r; i < a.length; i++) {
			let s = a[i], c = t * e + s;
			if (!Number.isSafeInteger(c) || t * e / t !== e || c - s != t * e || (e = c % n, a[i] = Math.floor(c / n), !Number.isSafeInteger(a[i]) || a[i] * n + e !== c)) throw Error("convertRadix: carry overflow");
			o && (a[i] ? o = !1 : r = i);
		}
		if (i.push(e), o) break;
	}
	for (let t = 0; t < e.length - 1 && e[t] === 0; t++) i.push(0);
	return i.reverse();
}
var ai = (e, t) => t ? ai(t, e % t) : e, oi = (e, t) => e + (t - ai(e, t));
function si(e, t, n, r) {
	if (!Array.isArray(e)) throw Error("convertRadix2: data should be array");
	if (t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (oi(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${oi(t, n)}`);
	let i = 0, a = 0, o = 2 ** n - 1, s = [];
	for (let r of e) {
		if (Qr(r), r >= 2 ** t) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
		if (i = i << t | r, a + t > 32) throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);
		for (a += t; a >= n; a -= n) s.push((i >> a - n & o) >>> 0);
		i &= 2 ** a - 1;
	}
	if (i = i << n - a & o, !r && a >= t) throw Error("Excess padding");
	if (!r && i) throw Error(`Non-zero padding: ${i}`);
	return r && a > 0 && s.push(i >>> 0), s;
}
function ci(e) {
	return Qr(e), {
		encode: (t) => {
			if (!(t instanceof Uint8Array)) throw Error("radix.encode input should be Uint8Array");
			return ii(Array.from(t), 256, e);
		},
		decode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw Error("radix.decode input should be array of strings");
			return Uint8Array.from(ii(t, e, 256));
		}
	};
}
function li(e, t = !1) {
	if (Qr(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (oi(8, e) > 32 || oi(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!(n instanceof Uint8Array)) throw Error("radix2.encode input should be Uint8Array");
			return si(Array.from(n), 8, e, !t);
		},
		decode: (n) => {
			if (!Array.isArray(n) || n.length && typeof n[0] != "number") throw Error("radix2.decode input should be array of strings");
			return Uint8Array.from(si(n, e, 8, t));
		}
	};
}
function ui(e) {
	if (typeof e != "function") throw Error("unsafeWrapper fn should be function");
	return function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
$r(li(4), ei("0123456789ABCDEF"), ti("")), $r(li(5), ei("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), ni(5), ti(""));
var di = ($r(li(5), ei("0123456789ABCDEFGHIJKLMNOPQRSTUV"), ni(5), ti("")), $r(li(5), ei("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), ti(""), ri(((e) => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))), $r(li(6), ei("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), ni(6), ti("")));
$r(li(6), ei("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), ni(6), ti(""));
var fi = (e) => $r(ci(58), ei(e), ti(""));
fi("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), fi("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), fi("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
var pi = $r(ei("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), ti("")), mi = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function hi(e) {
	let t = e >> 25, n = (33554431 & e) << 5;
	for (let e = 0; e < mi.length; e++) (t >> e & 1) == 1 && (n ^= mi[e]);
	return n;
}
function gi(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = hi(i) ^ n >> 5;
	}
	i = hi(i);
	for (let t = 0; t < r; t++) i = hi(i) ^ 31 & e.charCodeAt(t);
	for (let e of t) i = hi(i) ^ e;
	for (let e = 0; e < 6; e++) i = hi(i);
	return i ^= n, pi.encode(si([i % 2 ** 30], 30, 5, !1));
}
function _i(e) {
	let t = e === "bech32" ? 1 : 734539939, n = li(5), r = n.decode, i = n.encode, a = ui(r);
	function o(e, n = 90) {
		if (typeof e != "string") throw Error("bech32.decode input should be string, not " + typeof e);
		if (e.length < 8 || !1 !== n && e.length > n) throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${n})`);
		let r = e.toLowerCase();
		if (e !== r && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
		let i = (e = r).lastIndexOf("1");
		if (i === 0 || i === -1) throw Error("Letter \"1\" must be present between prefix and data only");
		let a = e.slice(0, i), o = e.slice(i + 1);
		if (o.length < 6) throw Error("Data must be at least 6 characters long");
		let s = pi.decode(o).slice(0, -6), c = gi(a, s, t);
		if (!o.endsWith(c)) throw Error(`Invalid checksum in ${e}: expected "${c}"`);
		return {
			prefix: a,
			words: s
		};
	}
	return {
		encode: function(e, n, r = 90) {
			if (typeof e != "string") throw Error("bech32.encode prefix should be string, not " + typeof e);
			if (!Array.isArray(n) || n.length && typeof n[0] != "number") throw Error("bech32.encode words should be array of numbers, not " + typeof n);
			let i = e.length + 7 + n.length;
			if (!1 !== r && i > r) throw TypeError(`Length ${i} exceeds limit ${r}`);
			return `${e = e.toLowerCase()}1${pi.encode(n)}${gi(e, n, t)}`;
		},
		decode: o,
		decodeToBytes: function(e) {
			let { prefix: t, words: n } = o(e, !1);
			return {
				prefix: t,
				words: n,
				bytes: r(n)
			};
		},
		decodeUnsafe: ui(o),
		fromWords: r,
		fromWordsUnsafe: a,
		toWords: i
	};
}
var vi = _i("bech32");
_i("bech32m"), $r(li(4), ei("0123456789abcdef"), ti(""), ri(((e) => {
	if (typeof e != "string" || e.length % 2) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
	return e.toLowerCase();
})));
function yi(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error(`positive integer expected, not ${e}`);
}
function bi(e) {
	if (typeof e != "boolean") throw Error(`boolean expected, not ${e}`);
}
function xi(e) {
	return e instanceof Uint8Array || typeof e == "object" && !!e && e.constructor.name === "Uint8Array";
}
function Si(e, ...t) {
	if (!xi(e)) throw Error("Uint8Array expected");
	if (t.length > 0 && !t.includes(e.length)) throw Error(`Uint8Array expected of length ${t}, not of length=${e.length}`);
}
function Ci(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function wi(e, t) {
	Si(e);
	let n = t.outputLen;
	if (e.length < n) throw Error(`digestInto() expects output buffer of length at least ${n}`);
}
var Ti = (e) => new Uint8Array(e.buffer, e.byteOffset, e.byteLength), G = (e) => new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4)), Ei = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength);
if (new Uint8Array(new Uint32Array([287454020]).buffer)[0] !== 68) throw Error("Non little-endian hardware is not supported");
function Di(e) {
	if (typeof e == "string") e = function(e) {
		if (typeof e != "string") throw Error("string expected, got " + typeof e);
		return new Uint8Array(new TextEncoder().encode(e));
	}(e);
	else {
		if (!xi(e)) throw Error("Uint8Array expected, got " + typeof e);
		e = e.slice();
	}
	return e;
}
function Oi(e, t) {
	if (e.length !== t.length) return !1;
	let n = 0;
	for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
	return n === 0;
}
var ki = (e, t) => (Object.assign(t, e), t);
function Ai(e, t, n, r) {
	if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
	let i = BigInt(32), a = BigInt(4294967295), o = Number(n >> i & a), s = Number(n & a), c = r ? 4 : 0, l = r ? 0 : 4;
	e.setUint32(t + c, o, r), e.setUint32(t + l, s, r);
}
var ji = 16, Mi = /* @__PURE__ */ new Uint8Array(16), Ni = G(Mi), Pi = (e) => (e >>> 0 & 255) << 24 | (e >>> 8 & 255) << 16 | (e >>> 16 & 255) << 8 | e >>> 24 & 255, Fi = class {
	constructor(e, t) {
		this.blockLen = ji, this.outputLen = ji, this.s0 = 0, this.s1 = 0, this.s2 = 0, this.s3 = 0, this.finished = !1, Si(e = Di(e), 16);
		let n = Ei(e), r = n.getUint32(0, !1), i = n.getUint32(4, !1), a = n.getUint32(8, !1), o = n.getUint32(12, !1), s = [];
		for (let e = 0; e < 128; e++) s.push({
			s0: Pi(r),
			s1: Pi(i),
			s2: Pi(a),
			s3: Pi(o)
		}), {s0: r, s1: i, s2: a, s3: o} = {
			s3: (u = a) << 31 | (d = o) >>> 1,
			s2: (l = i) << 31 | u >>> 1,
			s1: (c = r) << 31 | l >>> 1,
			s0: c >>> 1 ^ 225 << 24 & -(1 & d)
		};
		var c, l, u, d;
		let f = ((e) => e > 65536 ? 8 : e > 1024 ? 4 : 2)(t || 1024);
		if (![
			1,
			2,
			4,
			8
		].includes(f)) throw Error(`ghash: wrong window size=${f}, should be 2, 4 or 8`);
		this.W = f;
		let p = 128 / f, m = this.windowSize = 2 ** f, h = [];
		for (let e = 0; e < p; e++) for (let t = 0; t < m; t++) {
			let n = 0, r = 0, i = 0, a = 0;
			for (let o = 0; o < f; o++) {
				if (!(t >>> f - o - 1 & 1)) continue;
				let { s0: c, s1: l, s2: u, s3: d } = s[f * e + o];
				n ^= c, r ^= l, i ^= u, a ^= d;
			}
			h.push({
				s0: n,
				s1: r,
				s2: i,
				s3: a
			});
		}
		this.t = h;
	}
	_updateBlock(e, t, n, r) {
		e ^= this.s0, t ^= this.s1, n ^= this.s2, r ^= this.s3;
		let { W: i, t: a, windowSize: o } = this, s = 0, c = 0, l = 0, u = 0, d = (1 << i) - 1, f = 0;
		for (let p of [
			e,
			t,
			n,
			r
		]) for (let e = 0; e < 4; e++) {
			let t = p >>> 8 * e & 255;
			for (let e = 8 / i - 1; e >= 0; e--) {
				let n = t >>> i * e & d, { s0: r, s1: p, s2: m, s3: h } = a[f * o + n];
				s ^= r, c ^= p, l ^= m, u ^= h, f += 1;
			}
		}
		this.s0 = s, this.s1 = c, this.s2 = l, this.s3 = u;
	}
	update(e) {
		e = Di(e), Ci(this);
		let t = G(e), n = Math.floor(e.length / ji), r = e.length % ji;
		for (let e = 0; e < n; e++) this._updateBlock(t[4 * e + 0], t[4 * e + 1], t[4 * e + 2], t[4 * e + 3]);
		return r && (Mi.set(e.subarray(n * ji)), this._updateBlock(Ni[0], Ni[1], Ni[2], Ni[3]), Ni.fill(0)), this;
	}
	destroy() {
		let { t: e } = this;
		for (let t of e) t.s0 = 0, t.s1 = 0, t.s2 = 0, t.s3 = 0;
	}
	digestInto(e) {
		Ci(this), wi(e, this), this.finished = !0;
		let { s0: t, s1: n, s2: r, s3: i } = this, a = G(e);
		return a[0] = t, a[1] = n, a[2] = r, a[3] = i, e;
	}
	digest() {
		let e = new Uint8Array(ji);
		return this.digestInto(e), this.destroy(), e;
	}
}, Ii = class extends Fi {
	constructor(e, t) {
		let n = function(e) {
			e.reverse();
			let t = 1 & e[15], n = 0;
			for (let t = 0; t < e.length; t++) {
				let r = e[t];
				e[t] = r >>> 1 | n, n = (1 & r) << 7;
			}
			return e[0] ^= 225 & -t, e;
		}((e = Di(e)).slice());
		super(n, t), n.fill(0);
	}
	update(e) {
		e = Di(e), Ci(this);
		let t = G(e), n = e.length % ji, r = Math.floor(e.length / ji);
		for (let e = 0; e < r; e++) this._updateBlock(Pi(t[4 * e + 3]), Pi(t[4 * e + 2]), Pi(t[4 * e + 1]), Pi(t[4 * e + 0]));
		return n && (Mi.set(e.subarray(r * ji)), this._updateBlock(Pi(Ni[3]), Pi(Ni[2]), Pi(Ni[1]), Pi(Ni[0])), Ni.fill(0)), this;
	}
	digestInto(e) {
		Ci(this), wi(e, this), this.finished = !0;
		let { s0: t, s1: n, s2: r, s3: i } = this, a = G(e);
		return a[0] = t, a[1] = n, a[2] = r, a[3] = i, e.reverse();
	}
};
function Li(e) {
	let t = (t, n) => e(n, t.length).update(Di(t)).digest(), n = e(/* @__PURE__ */ new Uint8Array(16), 0);
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t, n) => e(t, n), t;
}
var Ri = Li(((e, t) => new Fi(e, t))), zi = Li(((e, t) => new Ii(e, t))), Bi = 16, Vi = new Uint8Array(Bi);
function Hi(e) {
	return e << 1 ^ 283 & -(e >> 7);
}
function Ui(e, t) {
	let n = 0;
	for (; t > 0; t >>= 1) n ^= e & -(1 & t), e = Hi(e);
	return n;
}
var Wi = (() => {
	let e = /* @__PURE__ */ new Uint8Array(256);
	for (let t = 0, n = 1; t < 256; t++, n ^= Hi(n)) e[t] = n;
	let t = /* @__PURE__ */ new Uint8Array(256);
	t[0] = 99;
	for (let n = 0; n < 255; n++) {
		let r = e[255 - n];
		r |= r << 8, t[e[n]] = 255 & (r ^ r >> 4 ^ r >> 5 ^ r >> 6 ^ r >> 7 ^ 99);
	}
	return t;
})(), Gi = Wi.map(((e, t) => Wi.indexOf(t))), Ki = (e) => e << 8 | e >>> 24;
function qi(e, t) {
	if (e.length !== 256) throw Error("Wrong sbox length");
	let n = (/* @__PURE__ */ new Uint32Array(256)).map(((n, r) => t(e[r]))), r = n.map(Ki), i = r.map(Ki), a = i.map(Ki), o = /* @__PURE__ */ new Uint32Array(65536), s = /* @__PURE__ */ new Uint32Array(65536), c = /* @__PURE__ */ new Uint16Array(65536);
	for (let t = 0; t < 256; t++) for (let l = 0; l < 256; l++) {
		let u = 256 * t + l;
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
var Ji = qi(Wi, ((e) => Ui(e, 3) << 24 | e << 16 | e << 8 | Ui(e, 2))), Yi = qi(Gi, ((e) => Ui(e, 11) << 24 | Ui(e, 13) << 16 | Ui(e, 9) << 8 | Ui(e, 14))), Xi = (() => {
	let e = /* @__PURE__ */ new Uint8Array(16);
	for (let t = 0, n = 1; t < 16; t++, n = Hi(n)) e[t] = n;
	return e;
})();
function Zi(e) {
	Si(e);
	let t = e.length;
	if (![
		16,
		24,
		32
	].includes(t)) throw Error(`aes: wrong key size: should be 16, 24 or 32, got: ${t}`);
	let { sbox2: n } = Ji, r = G(e), i = r.length, a = (e) => ea(n, e, e, e, e), o = new Uint32Array(t + 28);
	o.set(r);
	for (let e = i; e < o.length; e++) {
		let t = o[e - 1];
		e % i == 0 ? t = a((s = t) << 24 | s >>> 8) ^ Xi[e / i - 1] : i > 6 && e % i == 4 && (t = a(t)), o[e] = o[e - i] ^ t;
	}
	var s;
	return o;
}
function Qi(e) {
	let t = Zi(e), n = t.slice(), r = t.length, { sbox2: i } = Ji, { T0: a, T1: o, T2: s, T3: c } = Yi;
	for (let e = 0; e < r; e += 4) for (let i = 0; i < 4; i++) n[e + i] = t[r - e - 4 + i];
	t.fill(0);
	for (let e = 4; e < r - 4; e++) {
		let t = n[e], r = ea(i, t, t, t, t);
		n[e] = a[255 & r] ^ o[r >>> 8 & 255] ^ s[r >>> 16 & 255] ^ c[r >>> 24];
	}
	return n;
}
function $i(e, t, n, r, i, a) {
	return e[n << 8 & 65280 | r >>> 8 & 255] ^ t[i >>> 8 & 65280 | a >>> 24 & 255];
}
function ea(e, t, n, r, i) {
	return e[255 & t | 65280 & n] | e[r >>> 16 & 255 | i >>> 16 & 65280] << 16;
}
function ta(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = Ji, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ $i(o, s, t, n, r, i), l = e[c++] ^ $i(o, s, n, r, i, t), u = e[c++] ^ $i(o, s, r, i, t, n), d = e[c++] ^ $i(o, s, i, t, n, r);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ ea(a, t, n, r, i),
		s1: e[c++] ^ ea(a, n, r, i, t),
		s2: e[c++] ^ ea(a, r, i, t, n),
		s3: e[c++] ^ ea(a, i, t, n, r)
	};
}
function na(e, t, n, r, i) {
	let { sbox2: a, T01: o, T23: s } = Yi, c = 0;
	t ^= e[c++], n ^= e[c++], r ^= e[c++], i ^= e[c++];
	let l = e.length / 4 - 2;
	for (let a = 0; a < l; a++) {
		let a = e[c++] ^ $i(o, s, t, i, r, n), l = e[c++] ^ $i(o, s, n, t, i, r), u = e[c++] ^ $i(o, s, r, n, t, i), d = e[c++] ^ $i(o, s, i, r, n, t);
		t = a, n = l, r = u, i = d;
	}
	return {
		s0: e[c++] ^ ea(a, t, i, r, n),
		s1: e[c++] ^ ea(a, n, t, i, r),
		s2: e[c++] ^ ea(a, r, n, t, i),
		s3: e[c++] ^ ea(a, i, r, n, t)
	};
}
function ra(e, t) {
	if (!t) return new Uint8Array(e);
	if (Si(t), t.length < e) throw Error(`aes: wrong destination length, expected at least ${e}, got: ${t.length}`);
	return t;
}
function ia(e, t, n, r) {
	Si(t, Bi), Si(n);
	let i = n.length;
	r = ra(i, r);
	let a = t, o = G(a), { s0: s, s1: c, s2: l, s3: u } = ta(e, o[0], o[1], o[2], o[3]), d = G(n), f = G(r);
	for (let t = 0; t + 4 <= d.length; t += 4) {
		f[t + 0] = d[t + 0] ^ s, f[t + 1] = d[t + 1] ^ c, f[t + 2] = d[t + 2] ^ l, f[t + 3] = d[t + 3] ^ u;
		let n = 1;
		for (let e = a.length - 1; e >= 0; e--) n = n + (255 & a[e]) | 0, a[e] = 255 & n, n >>>= 8;
		({s0: s, s1: c, s2: l, s3: u} = ta(e, o[0], o[1], o[2], o[3]));
	}
	let p = Bi * Math.floor(d.length / 4);
	if (p < i) {
		let e = Ti(new Uint32Array([
			s,
			c,
			l,
			u
		]));
		for (let t = p, a = 0; t < i; t++, a++) r[t] = n[t] ^ e[a];
	}
	return r;
}
function aa(e, t, n, r, i) {
	Si(n, Bi), Si(r), i = ra(r.length, i);
	let a = n, o = G(a), s = Ei(a), c = G(r), l = G(i), u = t ? 0 : 12, d = r.length, f = s.getUint32(u, t), { s0: p, s1: m, s2: h, s3: g } = ta(e, o[0], o[1], o[2], o[3]);
	for (let n = 0; n + 4 <= c.length; n += 4) l[n + 0] = c[n + 0] ^ p, l[n + 1] = c[n + 1] ^ m, l[n + 2] = c[n + 2] ^ h, l[n + 3] = c[n + 3] ^ g, f = f + 1 >>> 0, s.setUint32(u, f, t), {s0: p, s1: m, s2: h, s3: g} = ta(e, o[0], o[1], o[2], o[3]);
	let _ = Bi * Math.floor(c.length / 4);
	if (_ < d) {
		let e = Ti(new Uint32Array([
			p,
			m,
			h,
			g
		]));
		for (let t = _, n = 0; t < d; t++, n++) i[t] = r[t] ^ e[n];
	}
	return i;
}
ki({
	blockSize: 16,
	nonceLength: 16
}, (function(e, t) {
	function n(n, r) {
		let i = Zi(e), a = t.slice(), o = ia(i, a, n, r);
		return i.fill(0), a.fill(0), o;
	}
	return Si(e), Si(t, Bi), {
		encrypt: (e, t) => n(e, t),
		decrypt: (e, t) => n(e, t)
	};
}));
function oa(e) {
	if (Si(e), e.length % Bi != 0) throw Error("aes/(cbc-ecb).decrypt ciphertext should consist of blocks with size 16");
}
function sa(e, t, n) {
	let r = e.length, i = r % Bi;
	if (!t && i !== 0) throw Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	let a = G(e);
	if (t) {
		let e = Bi - i;
		e ||= Bi, r += e;
	}
	let o = ra(r, n);
	return {
		b: a,
		o: G(o),
		out: o
	};
}
function ca(e, t) {
	if (!t) return e;
	let n = e.length;
	if (!n) throw Error("aes/pcks5: empty ciphertext not allowed");
	let r = e[n - 1];
	if (r <= 0 || r > 16) throw Error(`aes/pcks5: wrong padding byte: ${r}`);
	let i = e.subarray(0, -r);
	for (let t = 0; t < r; t++) if (e[n - t - 1] !== r) throw Error("aes/pcks5: wrong padding");
	return i;
}
function la(e) {
	let t = /* @__PURE__ */ new Uint8Array(16), n = G(t);
	t.set(e);
	let r = Bi - e.length;
	for (let e = Bi - r; e < Bi; e++) t[e] = r;
	return n;
}
ki({ blockSize: 16 }, (function(e, t = {}) {
	Si(e);
	let n = !t.disablePadding;
	return {
		encrypt: (t, r) => {
			Si(t);
			let { b: i, o: a, out: o } = sa(t, n, r), s = Zi(e), c = 0;
			for (; c + 4 <= i.length;) {
				let { s0: e, s1: t, s2: n, s3: r } = ta(s, i[c + 0], i[c + 1], i[c + 2], i[c + 3]);
				a[c++] = e, a[c++] = t, a[c++] = n, a[c++] = r;
			}
			if (n) {
				let e = la(t.subarray(4 * c)), { s0: n, s1: r, s2: i, s3: o } = ta(s, e[0], e[1], e[2], e[3]);
				a[c++] = n, a[c++] = r, a[c++] = i, a[c++] = o;
			}
			return s.fill(0), o;
		},
		decrypt: (t, r) => {
			oa(t);
			let i = Qi(e), a = ra(t.length, r), o = G(t), s = G(a);
			for (let e = 0; e + 4 <= o.length;) {
				let { s0: t, s1: n, s2: r, s3: a } = na(i, o[e + 0], o[e + 1], o[e + 2], o[e + 3]);
				s[e++] = t, s[e++] = n, s[e++] = r, s[e++] = a;
			}
			return i.fill(0), ca(a, n);
		}
	};
}));
var ua = ki({
	blockSize: 16,
	nonceLength: 16
}, (function(e, t, n = {}) {
	Si(e), Si(t, 16);
	let r = !n.disablePadding;
	return {
		encrypt: (n, i) => {
			let a = Zi(e), { b: o, o: s, out: c } = sa(n, r, i), l = G(t), u = l[0], d = l[1], f = l[2], p = l[3], m = 0;
			for (; m + 4 <= o.length;) u ^= o[m + 0], d ^= o[m + 1], f ^= o[m + 2], p ^= o[m + 3], {s0: u, s1: d, s2: f, s3: p} = ta(a, u, d, f, p), s[m++] = u, s[m++] = d, s[m++] = f, s[m++] = p;
			if (r) {
				let e = la(n.subarray(4 * m));
				u ^= e[0], d ^= e[1], f ^= e[2], p ^= e[3], {s0: u, s1: d, s2: f, s3: p} = ta(a, u, d, f, p), s[m++] = u, s[m++] = d, s[m++] = f, s[m++] = p;
			}
			return a.fill(0), c;
		},
		decrypt: (n, i) => {
			oa(n);
			let a = Qi(e), o = G(t), s = ra(n.length, i), c = G(n), l = G(s), u = o[0], d = o[1], f = o[2], p = o[3];
			for (let e = 0; e + 4 <= c.length;) {
				let t = u, n = d, r = f, i = p;
				u = c[e + 0], d = c[e + 1], f = c[e + 2], p = c[e + 3];
				let { s0: o, s1: s, s2: m, s3: h } = na(a, u, d, f, p);
				l[e++] = o ^ t, l[e++] = s ^ n, l[e++] = m ^ r, l[e++] = h ^ i;
			}
			return a.fill(0), ca(s, r);
		}
	};
}));
ki({
	blockSize: 16,
	nonceLength: 16
}, (function(e, t) {
	function n(n, r, i) {
		let a = Zi(e), o = n.length;
		i = ra(o, i);
		let s = G(n), c = G(i), l = r ? c : s, u = G(t), d = u[0], f = u[1], p = u[2], m = u[3];
		for (let e = 0; e + 4 <= s.length;) {
			let { s0: t, s1: n, s2: r, s3: i } = ta(a, d, f, p, m);
			c[e + 0] = s[e + 0] ^ t, c[e + 1] = s[e + 1] ^ n, c[e + 2] = s[e + 2] ^ r, c[e + 3] = s[e + 3] ^ i, d = l[e++], f = l[e++], p = l[e++], m = l[e++];
		}
		let h = Bi * Math.floor(s.length / 4);
		if (h < o) {
			({s0: d, s1: f, s2: p, s3: m} = ta(a, d, f, p, m));
			let e = Ti(new Uint32Array([
				d,
				f,
				p,
				m
			]));
			for (let t = h, r = 0; t < o; t++, r++) i[t] = n[t] ^ e[r];
			e.fill(0);
		}
		return a.fill(0), i;
	}
	return Si(e), Si(t, 16), {
		encrypt: (e, t) => n(e, !0, t),
		decrypt: (e, t) => n(e, !1, t)
	};
}));
function da(e, t, n, r, i) {
	let a = e.create(n, r.length + (i?.length || 0));
	i && a.update(i), a.update(r);
	let o = /* @__PURE__ */ new Uint8Array(16), s = Ei(o);
	return i && Ai(s, 0, BigInt(8 * i.length), t), Ai(s, 8, BigInt(8 * r.length), t), a.update(o), a.digest();
}
ki({
	blockSize: 16,
	nonceLength: 12,
	tagLength: 16
}, (function(e, t, n) {
	if (Si(t), t.length === 0) throw Error("aes/gcm: empty nonce");
	function r(e, t, r) {
		let i = da(Ri, !1, e, r, n);
		for (let e = 0; e < t.length; e++) i[e] ^= t[e];
		return i;
	}
	function i() {
		let n = Zi(e), r = Vi.slice(), i = Vi.slice();
		if (aa(n, !1, i, i, r), t.length === 12) i.set(t);
		else {
			let e = Vi.slice();
			Ai(Ei(e), 8, BigInt(8 * t.length), !1), Ri.create(r).update(t).update(e).digestInto(i);
		}
		return {
			xk: n,
			authKey: r,
			counter: i,
			tagMask: aa(n, !1, i, Vi)
		};
	}
	return {
		encrypt: (e) => {
			Si(e);
			let { xk: t, authKey: n, counter: a, tagMask: o } = i(), s = new Uint8Array(e.length + 16);
			aa(t, !1, a, e, s);
			let c = r(n, o, s.subarray(0, s.length - 16));
			return s.set(c, e.length), t.fill(0), s;
		},
		decrypt: (e) => {
			if (Si(e), e.length < 16) throw Error("aes/gcm: ciphertext less than tagLen (16)");
			let { xk: t, authKey: n, counter: a, tagMask: o } = i(), s = e.subarray(0, -16), c = e.subarray(-16);
			if (!Oi(r(n, o, s), c)) throw Error("aes/gcm: invalid ghash tag");
			let l = aa(t, !1, a, s);
			return n.fill(0), o.fill(0), t.fill(0), l;
		}
	};
}));
var fa = (e, t, n) => (r) => {
	if (!Number.isSafeInteger(r) || t > r || r > n) throw Error(`${e}: invalid value=${r}, must be [${t}..${n}]`);
};
ki({
	blockSize: 16,
	nonceLength: 12,
	tagLength: 16
}, (function(e, t, n) {
	let r = fa("AAD", 0, 2 ** 36), i = fa("plaintext", 0, 2 ** 36), a = fa("nonce", 12, 12), o = fa("ciphertext", 16, 2 ** 36 + 16);
	function s() {
		let n = e.length;
		if (n !== 16 && n !== 24 && n !== 32) throw Error(`key length must be 16, 24 or 32 bytes, got: ${n} bytes`);
		let r = Zi(e), i = new Uint8Array(n), a = /* @__PURE__ */ new Uint8Array(16), o = G(t), s = 0, c = o[0], l = o[1], u = o[2], d = 0;
		for (let e of [a, i].map(G)) {
			let t = G(e);
			for (let e = 0; e < t.length; e += 2) {
				let { s0: n, s1: i } = ta(r, s, c, l, u);
				t[e + 0] = n, t[e + 1] = i, s = ++d;
			}
		}
		return r.fill(0), {
			authKey: a,
			encKey: Zi(i)
		};
	}
	function c(e, r, i) {
		let a = da(zi, !0, r, i, n);
		for (let e = 0; e < 12; e++) a[e] ^= t[e];
		a[15] &= 127;
		let o = G(a), s = o[0], c = o[1], l = o[2], u = o[3];
		return {s0: s, s1: c, s2: l, s3: u} = ta(e, s, c, l, u), o[0] = s, o[1] = c, o[2] = l, o[3] = u, a;
	}
	function l(e, t, n) {
		let r = t.slice();
		return r[15] |= 128, aa(e, !0, r, n);
	}
	return Si(t), a(t.length), n && (Si(n), r(n.length)), {
		encrypt: (e) => {
			Si(e), i(e.length);
			let { encKey: t, authKey: n } = s(), r = c(t, n, e), a = new Uint8Array(e.length + 16);
			return a.set(r, e.length), a.set(l(t, r, e)), t.fill(0), n.fill(0), a;
		},
		decrypt: (e) => {
			Si(e), o(e.length);
			let t = e.subarray(-16), { encKey: n, authKey: r } = s(), i = l(n, t, e.subarray(0, -16)), a = c(n, r, i);
			if (n.fill(0), r.fill(0), !Oi(t, a)) throw Error("invalid polyval tag");
			return i;
		}
	};
}));
var pa = (e, t) => 255 & e[t++] | (255 & e[t++]) << 8, ma = class {
	constructor(e) {
		this.blockLen = 16, this.outputLen = 16, this.buffer = /* @__PURE__ */ new Uint8Array(16), this.r = /* @__PURE__ */ new Uint16Array(10), this.h = /* @__PURE__ */ new Uint16Array(10), this.pad = /* @__PURE__ */ new Uint16Array(8), this.pos = 0, this.finished = !1, Si(e = Di(e), 32);
		let t = pa(e, 0), n = pa(e, 2), r = pa(e, 4), i = pa(e, 6), a = pa(e, 8), o = pa(e, 10), s = pa(e, 12), c = pa(e, 14);
		this.r[0] = 8191 & t, this.r[1] = 8191 & (t >>> 13 | n << 3), this.r[2] = 7939 & (n >>> 10 | r << 6), this.r[3] = 8191 & (r >>> 7 | i << 9), this.r[4] = 255 & (i >>> 4 | a << 12), this.r[5] = a >>> 1 & 8190, this.r[6] = 8191 & (a >>> 14 | o << 2), this.r[7] = 8065 & (o >>> 11 | s << 5), this.r[8] = 8191 & (s >>> 8 | c << 8), this.r[9] = c >>> 5 & 127;
		for (let t = 0; t < 8; t++) this.pad[t] = pa(e, 16 + 2 * t);
	}
	process(e, t, n = !1) {
		let r = n ? 0 : 2048, { h: i, r: a } = this, o = a[0], s = a[1], c = a[2], l = a[3], u = a[4], d = a[5], f = a[6], p = a[7], m = a[8], h = a[9], g = pa(e, t + 0), _ = pa(e, t + 2), v = pa(e, t + 4), y = pa(e, t + 6), b = pa(e, t + 8), x = pa(e, t + 10), S = pa(e, t + 12), C = pa(e, t + 14), w = i[0] + (8191 & g), T = i[1] + (8191 & (g >>> 13 | _ << 3)), E = i[2] + (8191 & (_ >>> 10 | v << 6)), D = i[3] + (8191 & (v >>> 7 | y << 9)), O = i[4] + (8191 & (y >>> 4 | b << 12)), k = i[5] + (b >>> 1 & 8191), A = i[6] + (8191 & (b >>> 14 | x << 2)), j = i[7] + (8191 & (x >>> 11 | S << 5)), M = i[8] + (8191 & (S >>> 8 | C << 8)), N = i[9] + (C >>> 5 | r), P = 0, F = P + w * o + 5 * h * T + 5 * m * E + 5 * p * D + 5 * f * O;
		P = F >>> 13, F &= 8191, F += 5 * d * k + 5 * u * A + 5 * l * j + 5 * c * M + 5 * s * N, P += F >>> 13, F &= 8191;
		let I = P + w * s + T * o + 5 * h * E + 5 * m * D + 5 * p * O;
		P = I >>> 13, I &= 8191, I += 5 * f * k + 5 * d * A + 5 * u * j + 5 * l * M + 5 * c * N, P += I >>> 13, I &= 8191;
		let L = P + w * c + T * s + E * o + 5 * h * D + 5 * m * O;
		P = L >>> 13, L &= 8191, L += 5 * p * k + 5 * f * A + 5 * d * j + 5 * u * M + 5 * l * N, P += L >>> 13, L &= 8191;
		let R = P + w * l + T * c + E * s + D * o + 5 * h * O;
		P = R >>> 13, R &= 8191, R += 5 * m * k + 5 * p * A + 5 * f * j + 5 * d * M + 5 * u * N, P += R >>> 13, R &= 8191;
		let z = P + w * u + T * l + E * c + D * s + O * o;
		P = z >>> 13, z &= 8191, z += 5 * h * k + 5 * m * A + 5 * p * j + 5 * f * M + 5 * d * N, P += z >>> 13, z &= 8191;
		let ee = P + w * d + T * u + E * l + D * c + O * s;
		P = ee >>> 13, ee &= 8191, ee += k * o + 5 * h * A + 5 * m * j + 5 * p * M + 5 * f * N, P += ee >>> 13, ee &= 8191;
		let te = P + w * f + T * d + E * u + D * l + O * c;
		P = te >>> 13, te &= 8191, te += k * s + A * o + 5 * h * j + 5 * m * M + 5 * p * N, P += te >>> 13, te &= 8191;
		let ne = P + w * p + T * f + E * d + D * u + O * l;
		P = ne >>> 13, ne &= 8191, ne += k * c + A * s + j * o + 5 * h * M + 5 * m * N, P += ne >>> 13, ne &= 8191;
		let B = P + w * m + T * p + E * f + D * d + O * u;
		P = B >>> 13, B &= 8191, B += k * l + A * c + j * s + M * o + 5 * h * N, P += B >>> 13, B &= 8191;
		let V = P + w * h + T * m + E * p + D * f + O * d;
		P = V >>> 13, V &= 8191, V += k * u + A * l + j * c + M * s + N * o, P += V >>> 13, V &= 8191, P = (P << 2) + P | 0, P = P + F | 0, F = 8191 & P, P >>>= 13, I += P, i[0] = F, i[1] = I, i[2] = L, i[3] = R, i[4] = z, i[5] = ee, i[6] = te, i[7] = ne, i[8] = B, i[9] = V;
	}
	finalize() {
		let { h: e, pad: t } = this, n = /* @__PURE__ */ new Uint16Array(10), r = e[1] >>> 13;
		e[1] &= 8191;
		for (let t = 2; t < 10; t++) e[t] += r, r = e[t] >>> 13, e[t] &= 8191;
		e[0] += 5 * r, r = e[0] >>> 13, e[0] &= 8191, e[1] += r, r = e[1] >>> 13, e[1] &= 8191, e[2] += r, n[0] = e[0] + 5, r = n[0] >>> 13, n[0] &= 8191;
		for (let t = 1; t < 10; t++) n[t] = e[t] + r, r = n[t] >>> 13, n[t] &= 8191;
		n[9] -= 8192;
		let i = (1 ^ r) - 1;
		for (let e = 0; e < 10; e++) n[e] &= i;
		i = ~i;
		for (let t = 0; t < 10; t++) e[t] = e[t] & i | n[t];
		e[0] = 65535 & (e[0] | e[1] << 13), e[1] = 65535 & (e[1] >>> 3 | e[2] << 10), e[2] = 65535 & (e[2] >>> 6 | e[3] << 7), e[3] = 65535 & (e[3] >>> 9 | e[4] << 4), e[4] = 65535 & (e[4] >>> 12 | e[5] << 1 | e[6] << 14), e[5] = 65535 & (e[6] >>> 2 | e[7] << 11), e[6] = 65535 & (e[7] >>> 5 | e[8] << 8), e[7] = 65535 & (e[8] >>> 8 | e[9] << 5);
		let a = e[0] + t[0];
		e[0] = 65535 & a;
		for (let n = 1; n < 8; n++) a = (e[n] + t[n] | 0) + (a >>> 16) | 0, e[n] = 65535 & a;
	}
	update(e) {
		Ci(this);
		let { buffer: t, blockLen: n } = this, r = (e = Di(e)).length;
		for (let i = 0; i < r;) {
			let a = Math.min(n - this.pos, r - i);
			if (a !== n) t.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === n && (this.process(t, 0, !1), this.pos = 0);
			else for (; n <= r - i; i += n) this.process(e, i);
		}
		return this;
	}
	destroy() {
		this.h.fill(0), this.r.fill(0), this.buffer.fill(0), this.pad.fill(0);
	}
	digestInto(e) {
		Ci(this), wi(e, this), this.finished = !0;
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
(function(e) {
	let t = (t, n) => e(n).update(Di(t)).digest(), n = e(/* @__PURE__ */ new Uint8Array(32));
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
})(((e) => new ma(e)));
var ha = (e) => Uint8Array.from(e.split("").map(((e) => e.charCodeAt(0)))), ga = ha("expand 16-byte k"), _a = ha("expand 32-byte k"), va = G(ga), ya = G(_a);
ya.slice();
function K(e, t) {
	return e << t | e >>> 32 - t;
}
function ba(e) {
	return e.byteOffset % 4 == 0;
}
var xa = 2 ** 32 - 1, Sa = /* @__PURE__ */ new Uint32Array();
function Ca(e, t) {
	let { allowShortKeys: n, extendNonceFn: r, counterLength: i, counterRight: a, rounds: o } = function(e, t) {
		if (typeof t != "object" || !t) throw Error("options must be defined");
		return Object.assign(e, t);
	}({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, t);
	if (typeof e != "function") throw Error("core must be a function");
	return yi(i), yi(o), bi(a), bi(n), (t, s, c, l, u = 0) => {
		Si(t), Si(s), Si(c);
		let d = c.length;
		if (l ||= new Uint8Array(d), Si(l), yi(u), u < 0 || u >= xa) throw Error("arx: counter overflow");
		if (l.length < d) throw Error(`arx: output (${l.length}) is shorter than data (${d})`);
		let f = [], p, m, h = t.length;
		if (h === 32) p = t.slice(), f.push(p), m = ya;
		else {
			if (h !== 16 || !n) throw Error(`arx: invalid 32-byte key, got length=${h}`);
			p = /* @__PURE__ */ new Uint8Array(32), p.set(t), p.set(t, 16), m = va, f.push(p);
		}
		ba(s) || (s = s.slice(), f.push(s));
		let g = G(p);
		if (r) {
			if (s.length !== 24) throw Error("arx: extended nonce must be 24 bytes");
			r(m, g, G(s.subarray(0, 16)), g), s = s.subarray(16);
		}
		let _ = 16 - i;
		if (_ !== s.length) throw Error(`arx: nonce must be ${_} or 16 bytes`);
		if (_ !== 12) {
			let e = /* @__PURE__ */ new Uint8Array(12);
			e.set(s, a ? 0 : 12 - s.length), s = e, f.push(s);
		}
		let v = G(s);
		for (function(e, t, n, r, i, a, o, s) {
			let c = i.length, l = /* @__PURE__ */ new Uint8Array(64), u = G(l), d = ba(i) && ba(a), f = d ? G(i) : Sa, p = d ? G(a) : Sa;
			for (let m = 0; m < c; o++) {
				if (e(t, n, r, u, o, s), o >= xa) throw Error("arx: counter overflow");
				let h = Math.min(64, c - m);
				if (d && h === 64) {
					let e = m / 4;
					if (m % 4 != 0) throw Error("arx: invalid block position");
					for (let t, n = 0; n < 16; n++) t = e + n, p[t] = f[t] ^ u[n];
					m += 64;
				} else {
					for (let e, t = 0; t < h; t++) e = m + t, a[e] = i[e] ^ l[t];
					m += h;
				}
			}
		}(e, m, g, v, c, l, u, o); f.length > 0;) f.pop().fill(0);
		return l;
	};
}
function wa(e, t, n, r, i, a = 20) {
	let o = e[0], s = e[1], c = e[2], l = e[3], u = t[0], d = t[1], f = t[2], p = t[3], m = t[4], h = t[5], g = t[6], _ = t[7], v = i, y = n[0], b = n[1], x = n[2], S = o, C = s, w = c, T = l, E = u, D = d, O = f, k = p, A = m, j = h, M = g, N = _, P = v, F = y, I = b, L = x;
	for (let e = 0; e < a; e += 2) S = S + E | 0, P = K(P ^ S, 16), A = A + P | 0, E = K(E ^ A, 12), S = S + E | 0, P = K(P ^ S, 8), A = A + P | 0, E = K(E ^ A, 7), C = C + D | 0, F = K(F ^ C, 16), j = j + F | 0, D = K(D ^ j, 12), C = C + D | 0, F = K(F ^ C, 8), j = j + F | 0, D = K(D ^ j, 7), w = w + O | 0, I = K(I ^ w, 16), M = M + I | 0, O = K(O ^ M, 12), w = w + O | 0, I = K(I ^ w, 8), M = M + I | 0, O = K(O ^ M, 7), T = T + k | 0, L = K(L ^ T, 16), N = N + L | 0, k = K(k ^ N, 12), T = T + k | 0, L = K(L ^ T, 8), N = N + L | 0, k = K(k ^ N, 7), S = S + D | 0, L = K(L ^ S, 16), M = M + L | 0, D = K(D ^ M, 12), S = S + D | 0, L = K(L ^ S, 8), M = M + L | 0, D = K(D ^ M, 7), C = C + O | 0, P = K(P ^ C, 16), N = N + P | 0, O = K(O ^ N, 12), C = C + O | 0, P = K(P ^ C, 8), N = N + P | 0, O = K(O ^ N, 7), w = w + k | 0, F = K(F ^ w, 16), A = A + F | 0, k = K(k ^ A, 12), w = w + k | 0, F = K(F ^ w, 8), A = A + F | 0, k = K(k ^ A, 7), T = T + E | 0, I = K(I ^ T, 16), j = j + I | 0, E = K(E ^ j, 12), T = T + E | 0, I = K(I ^ T, 8), j = j + I | 0, E = K(E ^ j, 7);
	let R = 0;
	r[R++] = o + S | 0, r[R++] = s + C | 0, r[R++] = c + w | 0, r[R++] = l + T | 0, r[R++] = u + E | 0, r[R++] = d + D | 0, r[R++] = f + O | 0, r[R++] = p + k | 0, r[R++] = m + A | 0, r[R++] = h + j | 0, r[R++] = g + M | 0, r[R++] = _ + N | 0, r[R++] = v + P | 0, r[R++] = y + F | 0, r[R++] = b + I | 0, r[R++] = x + L | 0;
}
var Ta = Ca(wa, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
});
Ca(wa, {
	counterRight: !1,
	counterLength: 8,
	extendNonceFn: function(e, t, n, r) {
		let i = e[0], a = e[1], o = e[2], s = e[3], c = t[0], l = t[1], u = t[2], d = t[3], f = t[4], p = t[5], m = t[6], h = t[7], g = n[0], _ = n[1], v = n[2], y = n[3];
		for (let e = 0; e < 20; e += 2) i = i + c | 0, g = K(g ^ i, 16), f = f + g | 0, c = K(c ^ f, 12), i = i + c | 0, g = K(g ^ i, 8), f = f + g | 0, c = K(c ^ f, 7), a = a + l | 0, _ = K(_ ^ a, 16), p = p + _ | 0, l = K(l ^ p, 12), a = a + l | 0, _ = K(_ ^ a, 8), p = p + _ | 0, l = K(l ^ p, 7), o = o + u | 0, v = K(v ^ o, 16), m = m + v | 0, u = K(u ^ m, 12), o = o + u | 0, v = K(v ^ o, 8), m = m + v | 0, u = K(u ^ m, 7), s = s + d | 0, y = K(y ^ s, 16), h = h + y | 0, d = K(d ^ h, 12), s = s + d | 0, y = K(y ^ s, 8), h = h + y | 0, d = K(d ^ h, 7), i = i + l | 0, y = K(y ^ i, 16), m = m + y | 0, l = K(l ^ m, 12), i = i + l | 0, y = K(y ^ i, 8), m = m + y | 0, l = K(l ^ m, 7), a = a + u | 0, g = K(g ^ a, 16), h = h + g | 0, u = K(u ^ h, 12), a = a + u | 0, g = K(g ^ a, 8), h = h + g | 0, u = K(u ^ h, 7), o = o + d | 0, _ = K(_ ^ o, 16), f = f + _ | 0, d = K(d ^ f, 12), o = o + d | 0, _ = K(_ ^ o, 8), f = f + _ | 0, d = K(d ^ f, 7), s = s + c | 0, v = K(v ^ s, 16), p = p + v | 0, c = K(c ^ p, 12), s = s + c | 0, v = K(v ^ s, 8), p = p + v | 0, c = K(c ^ p, 7);
		let b = 0;
		r[b++] = i, r[b++] = a, r[b++] = o, r[b++] = s, r[b++] = g, r[b++] = _, r[b++] = v, r[b++] = y;
	},
	allowShortKeys: !1
});
var Ea = class extends Rr {
	constructor(e, t) {
		super(), this.finished = !1, this.destroyed = !1, Ur.hash(e);
		let n = Ir(t);
		if (this.iHash = e.create(), typeof this.iHash.update != "function") throw Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let r = this.blockLen, i = new Uint8Array(r);
		i.set(n.length > r ? e.create().update(n).digest() : n);
		for (let e = 0; e < i.length; e++) i[e] ^= 54;
		this.iHash.update(i), this.oHash = e.create();
		for (let e = 0; e < i.length; e++) i[e] ^= 106;
		this.oHash.update(i), i.fill(0);
	}
	update(e) {
		return Ur.exists(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		Ur.exists(this), Ur.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
	}
	digest() {
		let e = new Uint8Array(this.oHash.outputLen);
		return this.digestInto(e), e;
	}
	_cloneInto(e) {
		e ||= Object.create(Object.getPrototypeOf(this), {});
		let { oHash: t, iHash: n, finished: r, destroyed: i, blockLen: a, outputLen: o } = this;
		return e.finished = r, e.destroyed = i, e.blockLen = a, e.outputLen = o, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
	}
	destroy() {
		this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
	}
}, Da = (e, t, n) => new Ea(e, t).update(n).digest();
function Oa(e, t, n) {
	return Ur.hash(e), n === void 0 && (n = new Uint8Array(e.outputLen)), Da(e, Ir(n), Ir(t));
}
Da.create = (e, t) => new Ea(e, t);
var ka = new Uint8Array([0]), Aa = /* @__PURE__ */ new Uint8Array();
function ja(e, t, n, r = 32) {
	if (Ur.hash(e), Ur.number(r), r > 255 * e.outputLen) throw Error("Length should be <= 255*HashLen");
	let i = Math.ceil(r / e.outputLen);
	n === void 0 && (n = Aa);
	let a = new Uint8Array(i * e.outputLen), o = Da.create(e, t), s = o._cloneInto(), c = new Uint8Array(o.outputLen);
	for (let t = 0; t < i; t++) ka[0] = t + 1, s.update(t === 0 ? Aa : c).update(n).update(ka).digestInto(c), a.set(c, e.outputLen * t), o._cloneInto(s);
	return o.destroy(), s.destroy(), c.fill(0), ka.fill(0), a.slice(0, r);
}
var Ma = Object.defineProperty, Na = (e, t) => {
	for (var n in t) Ma(e, n, {
		get: t[n],
		enumerable: !0
	});
}, Pa = Symbol("verified"), Fa = (e) => e instanceof Object;
function Ia(e) {
	if (!Fa(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] == "object") return !1;
	}
	return !0;
}
function La(e) {
	return e.sort(((e, t) => e.created_at === t.created_at ? e.id.localeCompare(t.id) : t.created_at - e.created_at));
}
var Ra = {};
Na(Ra, {
	Queue: () => Ka,
	QueueNode: () => Ga,
	binarySearch: () => Wa,
	insertEventIntoAscendingList: () => Ua,
	insertEventIntoDescendingList: () => Ha,
	normalizeURL: () => Va,
	utf8Decoder: () => za,
	utf8Encoder: () => Ba
});
var za = new TextDecoder("utf-8"), Ba = new TextEncoder();
function Va(e) {
	e.indexOf("://") === -1 && (e = "wss://" + e);
	let t = new URL(e);
	return t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
}
function Ha(e, t) {
	let [n, r] = Wa(e, ((e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : e.created_at - t.created_at));
	return r || e.splice(n, 0, t), e;
}
function Ua(e, t) {
	let [n, r] = Wa(e, ((e) => t.id === e.id ? 0 : t.created_at === e.created_at ? -1 : t.created_at - e.created_at));
	return r || e.splice(n, 0, t), e;
}
function Wa(e, t) {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Math.floor((n + r) / 2), a = t(e[i]);
		if (a === 0) return [i, !0];
		a < 0 ? r = i - 1 : n = i + 1;
	}
	return [n, !1];
}
var Ga = class {
	value;
	next = null;
	prev = null;
	constructor(e) {
		this.value = e;
	}
}, Ka = class {
	first;
	last;
	constructor() {
		this.first = null, this.last = null;
	}
	enqueue(e) {
		let t = new Ga(e);
		return this.last ? this.last === this.first ? (this.last = t, this.last.prev = this.first, this.first.next = t) : (t.prev = this.last, this.last.next = t, this.last = t) : (this.first = t, this.last = t), !0;
	}
	dequeue() {
		if (!this.first) return null;
		if (this.first === this.last) {
			let e = this.first;
			return this.first = null, this.last = null, e.value;
		}
		let e = this.first;
		return this.first = e.next, e.value;
	}
};
function qa(e) {
	if (!Ia(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function Ja(e) {
	return Pr(Zr(Ba.encode(qa(e))));
}
var Ya = new class {
	generateSecretKey() {
		return Or.utils.randomPrivateKey();
	}
	getPublicKey(e) {
		return Pr(Or.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = Pr(Or.getPublicKey(t)), n.id = Ja(n), n.sig = Pr(Or.sign(Ja(n), t)), n[Pa] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[Pa] == "boolean") return e[Pa];
		let t = Ja(e);
		if (t !== e.id) return e[Pa] = !1, !1;
		try {
			let n = Or.verify(e.sig, t, e.pubkey);
			return e[Pa] = n, n;
		} catch {
			return e[Pa] = !1, !1;
		}
	}
}(), Xa = Ya.generateSecretKey, Za = Ya.getPublicKey, Qa = Ya.finalizeEvent, $a = Ya.verifyEvent, eo = {};
function to(e) {
	return 1e3 <= e && e < 1e4 || [
		1,
		2,
		4,
		5,
		6,
		7,
		8,
		16,
		40,
		41,
		42,
		43,
		44
	].includes(e);
}
function no(e) {
	return [0, 3].includes(e) || 1e4 <= e && e < 2e4;
}
function ro(e) {
	return 2e4 <= e && e < 3e4;
}
function io(e) {
	return 3e4 <= e && e < 4e4;
}
function ao(e) {
	return to(e) ? "regular" : no(e) ? "replaceable" : ro(e) ? "ephemeral" : io(e) ? "parameterized" : "unknown";
}
function oo(e, t) {
	let n = t instanceof Array ? t : [t];
	return Ia(e) && n.includes(e.kind) || !1;
}
Na(eo, {
	Application: () => ys,
	BadgeAward: () => go,
	BadgeDefinition: () => fs,
	BlockedRelaysList: () => qo,
	BookmarkList: () => Wo,
	Bookmarksets: () => ls,
	Calendar: () => Es,
	CalendarEventRSVP: () => Ds,
	ChannelCreation: () => bo,
	ChannelHideMessage: () => Co,
	ChannelMessage: () => So,
	ChannelMetadata: () => xo,
	ChannelMuteUser: () => wo,
	ClassifiedListing: () => Ss,
	ClientAuth: () => ts,
	CommunitiesList: () => Go,
	CommunityDefinition: () => As,
	CommunityPostApproval: () => No,
	Contacts: () => uo,
	CreateOrUpdateProduct: () => hs,
	CreateOrUpdateStall: () => ms,
	Curationsets: () => us,
	Date: () => ws,
	DirectMessageRelaysList: () => Zo,
	DraftClassifiedListing: () => Cs,
	DraftLong: () => _s,
	Emojisets: () => vs,
	EncryptedDirectMessage: () => fo,
	EventDeletion: () => po,
	FileMetadata: () => Do,
	FileServerPreference: () => Qo,
	Followsets: () => os,
	GenericRepost: () => yo,
	Genericlists: () => ss,
	GiftWrap: () => Eo,
	HTTPAuth: () => as,
	Handlerinformation: () => ks,
	Handlerrecommendation: () => Os,
	Highlights: () => Bo,
	InterestsList: () => Yo,
	Interestsets: () => ps,
	JobFeedback: () => Io,
	JobRequest: () => Po,
	JobResult: () => Fo,
	Label: () => Mo,
	LightningPubRPC: () => es,
	LiveChatMessage: () => Oo,
	LiveEvent: () => bs,
	LongFormArticle: () => gs,
	Metadata: () => so,
	Mutelist: () => Vo,
	NWCWalletInfo: () => $o,
	NWCWalletRequest: () => ns,
	NWCWalletResponse: () => rs,
	NostrConnect: () => is,
	OpenTimestamps: () => To,
	Pinlist: () => Ho,
	PrivateDirectMessage: () => vo,
	ProblemTracker: () => ko,
	ProfileBadges: () => ds,
	PublicChatsList: () => Ko,
	Reaction: () => ho,
	RecommendRelay: () => lo,
	RelayList: () => Uo,
	Relaysets: () => cs,
	Report: () => Ao,
	Reporting: () => jo,
	Repost: () => mo,
	Seal: () => _o,
	SearchRelaysList: () => Jo,
	ShortTextNote: () => co,
	Time: () => Ts,
	UserEmojiList: () => Xo,
	UserStatuses: () => xs,
	Zap: () => zo,
	ZapGoal: () => Lo,
	ZapRequest: () => Ro,
	classifyKind: () => ao,
	isEphemeralKind: () => ro,
	isKind: () => oo,
	isParameterizedReplaceableKind: () => io,
	isRegularKind: () => to,
	isReplaceableKind: () => no
});
var so = 0, co = 1, lo = 2, uo = 3, fo = 4, po = 5, mo = 6, ho = 7, go = 8, _o = 13, vo = 14, yo = 16, bo = 40, xo = 41, So = 42, Co = 43, wo = 44, To = 1040, Eo = 1059, Do = 1063, Oo = 1311, ko = 1971, Ao = 1984, jo = 1984, Mo = 1985, No = 4550, Po = 5999, Fo = 6999, Io = 7e3, Lo = 9041, Ro = 9734, zo = 9735, Bo = 9802, Vo = 1e4, Ho = 10001, Uo = 10002, Wo = 10003, Go = 10004, Ko = 10005, qo = 10006, Jo = 10007, Yo = 10015, Xo = 10030, Zo = 10050, Qo = 10096, $o = 13194, es = 21e3, ts = 22242, ns = 23194, rs = 23195, is = 24133, as = 27235, os = 3e4, ss = 30001, cs = 30002, ls = 30003, us = 30004, ds = 30008, fs = 30009, ps = 30015, ms = 30017, hs = 30018, gs = 30023, _s = 30024, vs = 30030, ys = 30078, bs = 30311, xs = 30315, Ss = 30402, Cs = 30403, ws = 31922, Ts = 31923, Es = 31924, Ds = 31925, Os = 31989, ks = 31990, As = 34550;
function js(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find((([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1))) return !1;
	}
	return !(e.since && t.created_at < e.since) && !(e.until && t.created_at > e.until);
}
function Ms(e, t) {
	for (let n = 0; n < e.length; n++) if (js(e[n], t)) return !0;
	return !1;
}
function Ns(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		Object.entries(r).forEach((([e, n]) => {
			if (e === "kinds" || e === "ids" || e === "authors" || e[0] === "#") {
				t[e] = t[e] || [];
				for (let r = 0; r < n.length; r++) {
					let i = n[r];
					t[e].includes(i) || t[e].push(i);
				}
			}
		})), r.limit && (!t.limit || r.limit > t.limit) && (t.limit = r.limit), r.until && (!t.until || r.until > t.until) && (t.until = r.until), r.since && (!t.since || r.since < t.since) && (t.since = r.since);
	}
	return t;
}
function Ps(e) {
	if (e.ids && !e.ids.length || e.kinds && !e.kinds.length || e.authors && !e.authors.length) return 0;
	for (let [t, n] of Object.entries(e)) if (t[0] === "#" && Array.isArray(n) && !n.length) return 0;
	return Math.min(Math.max(0, e.limit ?? 1 / 0), e.ids?.length ?? 1 / 0, e.authors?.length && e.kinds?.every(((e) => no(e))) ? e.authors.length * e.kinds.length : 1 / 0, e.authors?.length && e.kinds?.every(((e) => io(e))) && e["#d"]?.length ? e.authors.length * e.kinds.length * e["#d"].length : 1 / 0);
}
var Fs = {};
function Is(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function Ls(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function Rs(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function zs(e, t) {
	return t === Is(e, "id");
}
function Bs(e, t) {
	return t === Is(e, "pubkey");
}
function Vs(e, t) {
	return t === Ls(e, "kind");
}
Na(Fs, {
	getHex64: () => Is,
	getInt: () => Ls,
	getSubscriptionId: () => Rs,
	matchEventId: () => zs,
	matchEventKind: () => Vs,
	matchEventPubkey: () => Bs
});
var Hs = {};
function Us(e, t) {
	return {
		kind: ts,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", e], ["challenge", t]],
		content: ""
	};
}
async function Ws() {
	return new Promise(((e) => {
		let t = new MessageChannel(), n = () => {
			t.port1.removeEventListener("message", n), e();
		};
		t.port1.addEventListener("message", n), t.port2.postMessage(0), t.port1.start();
	}));
}
Na(Hs, { makeAuthEvent: () => Us });
var Gs, Ks = (e) => (e[Pa] = !0, !0), qs = class {
	url;
	_connected = !1;
	onclose = null;
	onnotice = (e) => {};
	_onauth = null;
	baseEoseTimeout = 4400;
	connectionTimeout = 4400;
	publishTimeout = 4400;
	openSubs = /* @__PURE__ */ new Map();
	connectionTimeoutHandle;
	connectionPromise;
	openCountRequests = /* @__PURE__ */ new Map();
	openEventPublishes = /* @__PURE__ */ new Map();
	ws;
	incomingMessageQueue = new Ka();
	queueRunning = !1;
	challenge;
	serial = 0;
	verifyEvent;
	_WebSocket;
	constructor(e, t) {
		this.url = Va(e), this.verifyEvent = t.verifyEvent, this._WebSocket = t.websocketImplementation || WebSocket;
	}
	static async connect(e, t) {
		let n = new qs(e, t);
		return await n.connect(), n;
	}
	closeAllSubscriptions(e) {
		for (let [t, n] of this.openSubs) n.close(e);
		this.openSubs.clear();
		for (let [t, n] of this.openEventPublishes) n.reject(Error(e));
		this.openEventPublishes.clear();
		for (let [t, n] of this.openCountRequests) n.reject(Error(e));
		this.openCountRequests.clear();
	}
	get connected() {
		return this._connected;
	}
	async connect() {
		return this.connectionPromise ||= (this.challenge = void 0, new Promise(((e, t) => {
			this.connectionTimeoutHandle = setTimeout((() => {
				t("connection timed out"), this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection timed out");
			}), this.connectionTimeout);
			try {
				this.ws = new this._WebSocket(this.url);
			} catch (e) {
				t(e);
				return;
			}
			this.ws.onopen = () => {
				clearTimeout(this.connectionTimeoutHandle), this._connected = !0, e();
			}, this.ws.onerror = (e) => {
				t(e.message || "websocket error"), this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection errored"));
			}, this.ws.onclose = async () => {
				this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection closed"));
			}, this.ws.onmessage = this._onmessage.bind(this);
		}))), this.connectionPromise;
	}
	async runQueue() {
		for (this.queueRunning = !0; !1 !== this.handleNext();) await Ws();
		this.queueRunning = !1;
	}
	handleNext() {
		let e = this.incomingMessageQueue.dequeue();
		if (!e) return !1;
		let t = Rs(e);
		if (t) {
			let n = this.openSubs.get(t);
			if (!n) return;
			let r = Is(e, "id"), i = n.alreadyHaveEvent?.(r);
			if (n.receivedEvent?.(this, r), i) return;
		}
		try {
			let t = JSON.parse(e);
			switch (t[0]) {
				case "EVENT": {
					let e = this.openSubs.get(t[1]), n = t[2];
					this.verifyEvent(n) && Ms(e.filters, n) && e.onevent(n);
					return;
				}
				case "COUNT": {
					let e = t[1], n = t[2], r = this.openCountRequests.get(e);
					r && (r.resolve(n.count), this.openCountRequests.delete(e));
					return;
				}
				case "EOSE": {
					let e = this.openSubs.get(t[1]);
					if (!e) return;
					e.receivedEose();
					return;
				}
				case "OK": {
					let e = t[1], n = t[2], r = t[3], i = this.openEventPublishes.get(e);
					i && (n ? i.resolve(r) : i.reject(Error(r)), this.openEventPublishes.delete(e));
					return;
				}
				case "CLOSED": {
					let e = t[1], n = this.openSubs.get(e);
					if (!n) return;
					n.closed = !0, n.close(t[2]);
					return;
				}
				case "NOTICE":
					this.onnotice(t[1]);
					return;
				case "AUTH":
					this.challenge = t[1], this._onauth?.(t[1]);
					return;
			}
		} catch {
			return;
		}
	}
	async send(e) {
		if (!this.connectionPromise) throw Error("sending on closed connection");
		this.connectionPromise.then((() => {
			this.ws?.send(e);
		}));
	}
	async auth(e) {
		if (!this.challenge) throw Error("can't perform auth, no challenge was received");
		let t = await e(Us(this.url, this.challenge)), n = new Promise(((e, n) => {
			this.openEventPublishes.set(t.id, {
				resolve: e,
				reject: n
			});
		}));
		return this.send("[\"AUTH\"," + JSON.stringify(t) + "]"), n;
	}
	async publish(e) {
		let t = new Promise(((t, n) => {
			this.openEventPublishes.set(e.id, {
				resolve: t,
				reject: n
			});
		}));
		return this.send("[\"EVENT\"," + JSON.stringify(e) + "]"), setTimeout((() => {
			let t = this.openEventPublishes.get(e.id);
			t && (t.reject(/* @__PURE__ */ Error("publish timed out")), this.openEventPublishes.delete(e.id));
		}), this.publishTimeout), t;
	}
	async count(e, t) {
		this.serial++;
		let n = t?.id || "count:" + this.serial, r = new Promise(((e, t) => {
			this.openCountRequests.set(n, {
				resolve: e,
				reject: t
			});
		}));
		return this.send("[\"COUNT\",\"" + n + "\"," + JSON.stringify(e).substring(1)), r;
	}
	subscribe(e, t) {
		let n = this.prepareSubscription(e, t);
		return n.fire(), n;
	}
	prepareSubscription(e, t) {
		this.serial++;
		let n = t.id || "sub:" + this.serial, r = new Js(this, n, e, t);
		return this.openSubs.set(n, r), r;
	}
	close() {
		this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.ws?.close();
	}
	_onmessage(e) {
		this.incomingMessageQueue.enqueue(e.data), this.queueRunning || this.runQueue();
	}
}, Js = class {
	relay;
	id;
	closed = !1;
	eosed = !1;
	filters;
	alreadyHaveEvent;
	receivedEvent;
	onevent;
	oneose;
	onclose;
	eoseTimeout;
	eoseTimeoutHandle;
	constructor(e, t, n, r) {
		this.relay = e, this.filters = n, this.id = t, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || e.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.onevent = r.onevent || ((e) => {});
	}
	fire() {
		this.relay.send("[\"REQ\",\"" + this.id + "\"," + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
	}
	receivedEose() {
		this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
	}
	close(e = "closed by caller") {
		!this.closed && this.relay.connected && (this.relay.send("[\"CLOSE\"," + JSON.stringify(this.id) + "]"), this.closed = !0), this.relay.openSubs.delete(this.id), this.onclose?.(e);
	}
};
try {
	Gs = WebSocket;
} catch {}
var Ys, Xs = class extends qs {
	constructor(e) {
		super(e, {
			verifyEvent: $a,
			websocketImplementation: Gs
		});
	}
	static async connect(e) {
		let t = new Xs(e);
		return await t.connect(), t;
	}
}, Zs = class {
	relays = /* @__PURE__ */ new Map();
	seenOn = /* @__PURE__ */ new Map();
	trackRelays = !1;
	verifyEvent;
	trustedRelayURLs = /* @__PURE__ */ new Set();
	_WebSocket;
	constructor(e) {
		this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation;
	}
	async ensureRelay(e, t) {
		e = Va(e);
		let n = this.relays.get(e);
		return n || (n = new qs(e, {
			verifyEvent: this.trustedRelayURLs.has(e) ? Ks : this.verifyEvent,
			websocketImplementation: this._WebSocket
		}), t?.connectionTimeout && (n.connectionTimeout = t.connectionTimeout), this.relays.set(e, n)), await n.connect(), n;
	}
	close(e) {
		e.map(Va).forEach(((e) => {
			this.relays.get(e)?.close();
		}));
	}
	subscribeMany(e, t, n) {
		return this.subscribeManyMap(Object.fromEntries(e.map(((e) => [e, t]))), n);
	}
	subscribeManyMap(e, t) {
		this.trackRelays && (t.receivedEvent = (e, t) => {
			let n = this.seenOn.get(t);
			n || (n = /* @__PURE__ */ new Set(), this.seenOn.set(t, n)), n.add(e);
		});
		let n = /* @__PURE__ */ new Set(), r = [], i = Object.keys(e).length, a = [], o = (e) => {
			a[e] = !0, a.filter(((e) => e)).length === i && (t.oneose?.(), o = () => {});
		}, s = [], c = (e, n) => {
			o(e), s[e] = n, s.filter(((e) => e)).length === i && (t.onclose?.(s), c = () => {});
		}, l = (e) => {
			if (t.alreadyHaveEvent?.(e)) return !0;
			let r = n.has(e);
			return n.add(e), r;
		}, u = Promise.all(Object.entries(e).map((async (e, n, i) => {
			if (i.indexOf(e) !== n) return void c(n, "duplicate url");
			let a, [s, u] = e;
			s = Va(s);
			try {
				a = await this.ensureRelay(s, { connectionTimeout: t.maxWait ? Math.max(.8 * t.maxWait, t.maxWait - 1e3) : void 0 });
			} catch (e) {
				c(n, e?.message || String(e));
				return;
			}
			let d = a.subscribe(u, {
				...t,
				oneose: () => o(n),
				onclose: (e) => c(n, e),
				alreadyHaveEvent: l,
				eoseTimeout: t.maxWait
			});
			r.push(d);
		})));
		return { async close() {
			await u, r.forEach(((e) => {
				e.close();
			}));
		} };
	}
	subscribeManyEose(e, t, n) {
		let r = this.subscribeMany(e, t, {
			...n,
			oneose() {
				r.close();
			}
		});
		return r;
	}
	async querySync(e, t, n) {
		return new Promise((async (r) => {
			let i = [];
			this.subscribeManyEose(e, [t], {
				...n,
				onevent(e) {
					i.push(e);
				},
				onclose(e) {
					r(i);
				}
			});
		}));
	}
	async get(e, t, n) {
		t.limit = 1;
		let r = await this.querySync(e, t, n);
		return r.sort(((e, t) => t.created_at - e.created_at)), r[0] || null;
	}
	publish(e, t) {
		return e.map(Va).map((async (e, n, r) => {
			if (r.indexOf(e) !== n) return Promise.reject("duplicate url");
			let i = await this.ensureRelay(e);
			return i.publish(t).then(((e) => {
				if (this.trackRelays) {
					let e = this.seenOn.get(t.id);
					e || (e = /* @__PURE__ */ new Set(), this.seenOn.set(t.id, e)), e.add(i);
				}
				return e;
			}));
		}));
	}
	listConnectionStatus() {
		let e = /* @__PURE__ */ new Map();
		return this.relays.forEach(((t, n) => e.set(n, t.connected))), e;
	}
	destroy() {
		this.relays.forEach(((e) => e.close())), this.relays = /* @__PURE__ */ new Map();
	}
};
try {
	Ys = WebSocket;
} catch {}
var Qs = class extends Zs {
	constructor() {
		super({
			verifyEvent: $a,
			websocketImplementation: Ys
		});
	}
}, $s = {};
Na($s, {
	BECH32_REGEX: () => nc,
	Bech32MaxSize: () => tc,
	NostrTypeGuard: () => ec,
	decode: () => rc,
	encodeBytes: () => lc,
	naddrEncode: () => fc,
	neventEncode: () => dc,
	noteEncode: () => sc,
	nprofileEncode: () => uc,
	npubEncode: () => oc,
	nsecEncode: () => ac
});
var ec = {
	isNProfile: (e) => /^nprofile1[a-z\d]+$/.test(e || ""),
	isNEvent: (e) => /^nevent1[a-z\d]+$/.test(e || ""),
	isNAddr: (e) => /^naddr1[a-z\d]+$/.test(e || ""),
	isNSec: (e) => /^nsec1[a-z\d]{58}$/.test(e || ""),
	isNPub: (e) => /^npub1[a-z\d]{58}$/.test(e || ""),
	isNote: (e) => /^note1[a-z\d]+$/.test(e || ""),
	isNcryptsec: (e) => /^ncryptsec1[a-z\d]+$/.test(e || "")
}, tc = 5e3, nc = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function rc(e) {
	let { prefix: t, words: n } = vi.decode(e, tc), r = new Uint8Array(vi.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = ic(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nprofile");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: Pr(e[0][0]),
					relays: e[1] ? e[1].map(((e) => za.decode(e))) : []
				}
			};
		}
		case "nevent": {
			let e = ic(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nevent");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			if (e[2] && e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (e[3] && e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "nevent",
				data: {
					id: Pr(e[0][0]),
					relays: e[1] ? e[1].map(((e) => za.decode(e))) : [],
					author: e[2]?.[0] ? Pr(e[2][0]) : void 0,
					kind: e[3]?.[0] ? parseInt(Pr(e[3][0]), 16) : void 0
				}
			};
		}
		case "naddr": {
			let e = ic(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for naddr");
			if (!e[2]?.[0]) throw Error("missing TLV 2 for naddr");
			if (e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (!e[3]?.[0]) throw Error("missing TLV 3 for naddr");
			if (e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: za.decode(e[0][0]),
					pubkey: Pr(e[2][0]),
					kind: parseInt(Pr(e[3][0]), 16),
					relays: e[1] ? e[1].map(((e) => za.decode(e))) : []
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
			data: Pr(r)
		};
		default: throw Error(`unknown prefix ${t}`);
	}
}
function ic(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		if (n = n.slice(2 + r), i.length < r) throw Error(`not enough data to read on TLV ${e}`);
		t[e] = t[e] || [], t[e].push(i);
	}
	return t;
}
function ac(e) {
	return lc("nsec", e);
}
function oc(e) {
	return lc("npub", Fr(e));
}
function sc(e) {
	return lc("note", Fr(e));
}
function cc(e, t) {
	let n = vi.toWords(t);
	return vi.encode(e, n, tc);
}
function lc(e, t) {
	return cc(e, t);
}
function uc(e) {
	return cc("nprofile", pc({
		0: [Fr(e.pubkey)],
		1: (e.relays || []).map(((e) => Ba.encode(e)))
	}));
}
function dc(e) {
	let t;
	return e.kind !== void 0 && (t = function(e) {
		let t = /* @__PURE__ */ new Uint8Array(4);
		return t[0] = e >> 24 & 255, t[1] = e >> 16 & 255, t[2] = e >> 8 & 255, t[3] = 255 & e, t;
	}(e.kind)), cc("nevent", pc({
		0: [Fr(e.id)],
		1: (e.relays || []).map(((e) => Ba.encode(e))),
		2: e.author ? [Fr(e.author)] : [],
		3: t ? [new Uint8Array(t)] : []
	}));
}
function fc(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	return new DataView(t).setUint32(0, e.kind, !1), cc("naddr", pc({
		0: [Ba.encode(e.identifier)],
		1: (e.relays || []).map(((e) => Ba.encode(e))),
		2: [Fr(e.pubkey)],
		3: [new Uint8Array(t)]
	}));
}
function pc(e) {
	let t = [];
	return Object.entries(e).reverse().forEach((([e, n]) => {
		n.forEach(((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		}));
	})), Lr(...t);
}
var mc = /\bnostr:((note|npub|naddr|nevent|nprofile)1\w+)\b|#\[(\d+)\]/g;
function hc(e) {
	let t = [];
	for (let n of e.content.matchAll(mc)) if (n[2]) try {
		let { type: e, data: r } = rc(n[1]);
		switch (e) {
			case "npub":
				t.push({
					text: n[0],
					profile: {
						pubkey: r,
						relays: []
					}
				});
				break;
			case "nprofile":
				t.push({
					text: n[0],
					profile: r
				});
				break;
			case "note":
				t.push({
					text: n[0],
					event: {
						id: r,
						relays: []
					}
				});
				break;
			case "nevent":
				t.push({
					text: n[0],
					event: r
				});
				break;
			case "naddr": t.push({
				text: n[0],
				address: r
			});
		}
	} catch {}
	else if (n[3]) {
		let r = parseInt(n[3], 10), i = e.tags[r];
		if (!i) continue;
		switch (i[0]) {
			case "p":
				t.push({
					text: n[0],
					profile: {
						pubkey: i[1],
						relays: i[2] ? [i[2]] : []
					}
				});
				break;
			case "e":
				t.push({
					text: n[0],
					event: {
						id: i[1],
						relays: i[2] ? [i[2]] : []
					}
				});
				break;
			case "a": try {
				let [e, r, a] = i[1].split(":");
				t.push({
					text: n[0],
					address: {
						identifier: a,
						pubkey: r,
						kind: parseInt(e, 10),
						relays: i[2] ? [i[2]] : []
					}
				});
			} catch {}
		}
	}
	return t;
}
var gc = {};
async function _c(e, t, n) {
	let r = e instanceof Uint8Array ? Pr(e) : e, i = yc(fr.getSharedSecret(r, "02" + t)), a = Uint8Array.from(Br(16)), o = Ba.encode(n), s = ua(i, a).encrypt(o);
	return `${di.encode(new Uint8Array(s))}?iv=${di.encode(new Uint8Array(a.buffer))}`;
}
async function vc(e, t, n) {
	let r = e instanceof Uint8Array ? Pr(e) : e, [i, a] = n.split("?iv="), o = yc(fr.getSharedSecret(r, "02" + t)), s = di.decode(a), c = di.decode(i), l = ua(o, s).decrypt(c);
	return za.decode(l);
}
function yc(e) {
	return e.slice(1, 33);
}
Na(gc, {
	decrypt: () => vc,
	encrypt: () => _c
});
var bc = {};
Na(bc, {
	NIP05_REGEX: () => Sc,
	isNip05: () => Cc,
	isValid: () => Dc,
	queryProfile: () => Ec,
	searchDomain: () => Tc,
	useFetchImplementation: () => wc
});
var xc, Sc = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/, Cc = (e) => Sc.test(e || "");
try {
	xc = fetch;
} catch {}
function wc(e) {
	xc = e;
}
async function Tc(e, t = "") {
	try {
		let n = `https://${e}/.well-known/nostr.json?name=${t}`, r = await xc(n, { redirect: "manual" });
		if (r.status !== 200) throw Error("Wrong response code");
		return (await r.json()).names;
	} catch {
		return {};
	}
}
async function Ec(e) {
	let t = e.match(Sc);
	if (!t) return null;
	let [, n = "_", r] = t;
	try {
		let e = `https://${r}/.well-known/nostr.json?name=${n}`, t = await xc(e, { redirect: "manual" });
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
async function Dc(e, t) {
	let n = await Ec(t);
	return !!n && n.pubkey === e;
}
var Oc = {};
function kc(e) {
	let t = {
		reply: void 0,
		root: void 0,
		mentions: [],
		profiles: [],
		quotes: []
	}, n, r;
	for (let i = e.tags.length - 1; i >= 0; i--) {
		let a = e.tags[i];
		if (a[0] === "e" && a[1]) {
			let [e, i, o, s, c] = a, l = {
				id: i,
				relays: o ? [o] : [],
				author: c
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
			if (a[0] === "q" && a[1]) {
				let [e, n, r] = a;
				t.quotes.push({
					id: n,
					relays: r ? [r] : []
				});
			}
			a[0] === "p" && a[1] && t.profiles.push({
				pubkey: a[1],
				relays: a[2] ? [a[2]] : []
			});
		}
	}
	return t.root ||= r || n || t.reply, t.reply ||= n || t.root, [t.reply, t.root].forEach(((e) => {
		if (!e) return;
		let n = t.mentions.indexOf(e);
		if (n !== -1 && t.mentions.splice(n, 1), e.author) {
			let n = t.profiles.find(((t) => t.pubkey === e.author));
			n && n.relays && (e.relays ||= [], n.relays.forEach(((t) => {
				e.relays?.indexOf(t) === -1 && e.relays.push(t);
			})), n.relays = e.relays);
		}
	})), t.mentions.forEach(((e) => {
		if (e.author) {
			let n = t.profiles.find(((t) => t.pubkey === e.author));
			n && n.relays && (e.relays ||= [], n.relays.forEach(((t) => {
				e.relays.indexOf(t) === -1 && e.relays.push(t);
			})), n.relays = e.relays);
		}
	})), t;
}
Na(Oc, { parse: () => kc });
var Ac = {};
Na(Ac, {
	fetchRelayInformation: () => Mc,
	useFetchImplementation: () => jc
});
function jc(e) {}
async function Mc(e) {
	return await (await fetch(e.replace("ws://", "http://").replace("wss://", "https://"), { headers: { Accept: "application/nostr+json" } })).json();
}
var Nc = {};
function Pc(e) {
	let t = 0;
	for (let n = 0; n < 64; n += 8) {
		let r = parseInt(e.substring(n, n + 8), 16);
		if (r !== 0) {
			t += Math.clz32(r);
			break;
		}
		t += 32;
	}
	return t;
}
function Fc(e, t) {
	let n = 0, r = e, i = [
		"nonce",
		n.toString(),
		t.toString()
	];
	for (r.tags.push(i);;) {
		let e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
		if (e !== r.created_at && (n = 0, r.created_at = e), i[1] = (++n).toString(), r.id = Ic(r), Pc(r.id) >= t) break;
	}
	return r;
}
function Ic(e) {
	return Pr(Zr(Ba.encode(JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]))));
}
Na(Nc, {
	fastEventHash: () => Ic,
	getPow: () => Pc,
	minePow: () => Fc
});
var Lc = {};
function Rc(e, t, n, r) {
	return Qa({
		kind: mo,
		tags: [
			...e.tags ?? [],
			[
				"e",
				t.id,
				n
			],
			["p", t.pubkey]
		],
		content: e.content === "" ? "" : JSON.stringify(t),
		created_at: e.created_at
	}, r);
}
function zc(e) {
	if (e.kind !== mo) return;
	let t, n;
	for (let r = e.tags.length - 1; r >= 0 && (t === void 0 || n === void 0); r--) {
		let i = e.tags[r];
		i.length >= 2 && (i[0] === "e" && t === void 0 ? t = i : i[0] === "p" && n === void 0 && (n = i));
	}
	return t === void 0 ? void 0 : {
		id: t[1],
		relays: [t[2], n?.[2]].filter(((e) => typeof e == "string")),
		author: n?.[1]
	};
}
function Bc(e, { skipVerification: t } = {}) {
	let n = zc(e);
	if (n === void 0 || e.content === "") return;
	let r;
	try {
		r = JSON.parse(e.content);
	} catch {
		return;
	}
	return r.id === n.id && (t || $a(r)) ? r : void 0;
}
Na(Lc, {
	finishRepostEvent: () => Rc,
	getRepostedEvent: () => Bc,
	getRepostedEventPointer: () => zc
});
var Vc = {};
Na(Vc, {
	NOSTR_URI_REGEX: () => Hc,
	parse: () => Wc,
	test: () => Uc
});
var Hc = RegExp(`nostr:(${nc.source})`);
function Uc(e) {
	return typeof e == "string" && RegExp(`^${Hc.source}$`).test(e);
}
function Wc(e) {
	let t = e.match(RegExp(`^${Hc.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: rc(t[1])
	};
}
var Gc = {};
function Kc(e, t, n) {
	let r = t.tags.filter(((e) => e.length >= 2 && (e[0] === "e" || e[0] === "p")));
	return Qa({
		...e,
		kind: ho,
		tags: [
			...e.tags ?? [],
			...r,
			["e", t.id],
			["p", t.pubkey]
		],
		content: e.content ?? "+"
	}, n);
}
function qc(e) {
	if (e.kind !== ho) return;
	let t, n;
	for (let r = e.tags.length - 1; r >= 0 && (t === void 0 || n === void 0); r--) {
		let i = e.tags[r];
		i.length >= 2 && (i[0] === "e" && t === void 0 ? t = i : i[0] === "p" && n === void 0 && (n = i));
	}
	return t !== void 0 && n !== void 0 ? {
		id: t[1],
		relays: [t[2], n[2]].filter(((e) => e !== void 0)),
		author: n[1]
	} : void 0;
}
Na(Gc, {
	finishReactionEvent: () => Kc,
	getReactedEventPointer: () => qc
});
var Jc = {};
Na(Jc, {
	matchAll: () => Xc,
	regex: () => Yc,
	replaceAll: () => Zc
});
var Yc = () => RegExp(`\\b${Hc.source}\\b`, "g");
function* Xc(e) {
	let t = e.matchAll(Yc());
	for (let e of t) try {
		let [t, n] = e;
		yield {
			uri: t,
			value: n,
			decoded: rc(n),
			start: e.index,
			end: e.index + t.length
		};
	} catch {}
}
function Zc(e, t) {
	return e.replaceAll(Yc(), ((e, n) => t({
		uri: e,
		value: n,
		decoded: rc(n)
	})));
}
var Qc = {};
Na(Qc, {
	channelCreateEvent: () => $c,
	channelHideMessageEvent: () => nl,
	channelMessageEvent: () => tl,
	channelMetadataEvent: () => el,
	channelMuteUserEvent: () => rl
});
var $c = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else {
		if (typeof e.content != "string") return;
		n = e.content;
	}
	return Qa({
		kind: bo,
		tags: [...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, el = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else {
		if (typeof e.content != "string") return;
		n = e.content;
	}
	return Qa({
		kind: xo,
		tags: [["e", e.channel_create_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, tl = (e, t) => {
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
	]), Qa({
		kind: So,
		tags: [...n, ...e.tags ?? []],
		content: e.content,
		created_at: e.created_at
	}, t);
}, nl = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else {
		if (typeof e.content != "string") return;
		n = e.content;
	}
	return Qa({
		kind: Co,
		tags: [["e", e.channel_message_event_id], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, rl = (e, t) => {
	let n;
	if (typeof e.content == "object") n = JSON.stringify(e.content);
	else {
		if (typeof e.content != "string") return;
		n = e.content;
	}
	return Qa({
		kind: wo,
		tags: [["p", e.pubkey_to_mute], ...e.tags ?? []],
		content: n,
		created_at: e.created_at
	}, t);
}, il = {};
Na(il, {
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
	return e.replaceAll(ol(), ((e, n) => t({
		shortcode: e,
		name: n
	})));
}
var ll, ul = {};
Na(ul, {
	useFetchImplementation: () => dl,
	validateGithub: () => fl
});
try {
	ll = fetch;
} catch {}
function dl(e) {
	ll = e;
}
async function fl(e, t, n) {
	try {
		return await (await ll(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
var pl = {};
Na(pl, {
	decrypt: () => Sl,
	encrypt: () => xl,
	getConversationKey: () => gl,
	v2: () => Cl
});
var ml = 1, hl = 65535;
function gl(e, t) {
	return Oa(Zr, fr.getSharedSecret(e, "02" + t).subarray(1, 33), "nip44-v2");
}
function _l(e, t) {
	let n = ja(Zr, e, t, 76);
	return {
		chacha_key: n.subarray(0, 32),
		chacha_nonce: n.subarray(32, 44),
		hmac_key: n.subarray(44, 76)
	};
}
function vl(e) {
	if (!Number.isSafeInteger(e) || e < 1) throw Error("expected positive integer");
	if (e <= 32) return 32;
	let t = 1 << Math.floor(Math.log2(e - 1)) + 1, n = t <= 256 ? 32 : t / 8;
	return n * (Math.floor((e - 1) / n) + 1);
}
function yl(e) {
	let t = Ba.encode(e), n = t.length;
	return Lr(function(e) {
		if (!Number.isSafeInteger(e) || e < ml || e > hl) throw Error("invalid plaintext size: must be between 1 and 65535 bytes");
		let t = /* @__PURE__ */ new Uint8Array(2);
		return new DataView(t.buffer).setUint16(0, e, !1), t;
	}(n), t, new Uint8Array(vl(n) - n));
}
function bl(e, t, n) {
	if (n.length !== 32) throw Error("AAD associated data must be 32 bytes");
	return Da(Zr, e, Lr(n, t));
}
function xl(e, t, n = Br(32)) {
	let { chacha_key: r, chacha_nonce: i, hmac_key: a } = _l(t, n), o = Ta(r, i, yl(e)), s = bl(a, o, n);
	return di.encode(Lr(new Uint8Array([2]), n, o, s));
}
function Sl(e, t) {
	let { nonce: n, ciphertext: r, mac: i } = function(e) {
		if (typeof e != "string") throw Error("payload must be a valid string");
		let t = e.length;
		if (t < 132 || t > 87472) throw Error("invalid payload length: " + t);
		if (e[0] === "#") throw Error("unknown encryption version");
		let n;
		try {
			n = di.decode(e);
		} catch (e) {
			throw Error("invalid base64: " + e.message);
		}
		let r = n.length;
		if (r < 99 || r > 65603) throw Error("invalid data length: " + r);
		let i = n[0];
		if (i !== 2) throw Error("unknown encryption version " + i);
		return {
			nonce: n.subarray(1, 33),
			ciphertext: n.subarray(33, -32),
			mac: n.subarray(-32)
		};
	}(e), { chacha_key: a, chacha_nonce: o, hmac_key: s } = _l(t, n);
	if (!Oi(bl(s, r, n), i)) throw Error("invalid MAC");
	return function(e) {
		let t = new DataView(e.buffer).getUint16(0), n = e.subarray(2, 2 + t);
		if (t < ml || t > hl || n.length !== t || e.length !== 2 + vl(t)) throw Error("invalid padding");
		return za.decode(n);
	}(Ta(a, o, r));
}
var Cl = {
	utils: {
		getConversationKey: gl,
		calcPaddedLen: vl
	},
	encrypt: xl,
	decrypt: Sl
}, wl = {};
function Tl(e) {
	let { pathname: t, searchParams: n } = new URL(e), r = t, i = n.get("relay"), a = n.get("secret");
	if (!r || !i || !a) throw Error("invalid connection string");
	return {
		pubkey: r,
		relay: i,
		secret: a
	};
}
async function El(e, t, n) {
	let r = await _c(t, e, JSON.stringify({
		method: "pay_invoice",
		params: { invoice: n }
	}));
	return Qa({
		kind: ns,
		created_at: Math.round(Date.now() / 1e3),
		content: r,
		tags: [["p", e]]
	}, t);
}
Na(wl, {
	makeNwcRequestEvent: () => El,
	parseConnectionString: () => Tl
});
var Dl, Ol = {};
Na(Ol, {
	getZapEndpoint: () => Al,
	makeZapReceipt: () => Nl,
	makeZapRequest: () => jl,
	useFetchImplementation: () => kl,
	validateZapRequest: () => Ml
});
try {
	Dl = fetch;
} catch {}
function kl(e) {
	Dl = e;
}
async function Al(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (n) {
			let { words: e } = vi.decode(n, 1e3), r = vi.fromWords(e);
			t = za.decode(r);
		} else {
			if (!r) return null;
			{
				let [e, n] = r.split("@");
				t = new URL(`/.well-known/lnurlp/${e}`, `https://${n}`).toString();
			}
		}
		let i = await (await Dl(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function jl({ profile: e, event: t, amount: n, relays: r, comment: i = "" }) {
	if (!n) throw Error("amount not given");
	if (!e) throw Error("profile not given");
	let a = {
		kind: 9734,
		created_at: Math.round(Date.now() / 1e3),
		content: i,
		tags: [
			["p", e],
			["amount", n.toString()],
			["relays", ...r]
		]
	};
	return t && a.tags.push(["e", t]), a;
}
function Ml(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!Ia(t)) return "Zap request is not a valid Nostr event.";
	if (!$a(t)) return "Invalid signature on zap request.";
	let n = t.tags.find((([e, t]) => e === "p" && t));
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!n[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find((([e, t]) => e === "e" && t));
	return r && !r[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : t.tags.find((([e, t]) => e === "relays" && t)) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Nl({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
	let i = JSON.parse(e), a = i.tags.filter((([e]) => e === "e" || e === "p" || e === "a")), o = {
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
var Pl = {};
Na(Pl, {
	createRumor: () => Bl,
	createSeal: () => Vl,
	createWrap: () => Hl,
	unwrapEvent: () => Gl,
	unwrapManyEvents: () => Kl,
	wrapEvent: () => Ul,
	wrapManyEvents: () => Wl
});
var Fl = () => Math.round(Date.now() / 1e3), Il = () => Math.round(Fl() - 172800 * Math.random()), Ll = (e, t) => gl(e, t), Rl = (e, t, n) => xl(JSON.stringify(e), Ll(t, n)), zl = (e, t) => JSON.parse(Sl(e.content, Ll(t, e.pubkey)));
function Bl(e, t) {
	let n = {
		created_at: Fl(),
		content: "",
		tags: [],
		...e,
		pubkey: Za(t)
	};
	return n.id = Ja(n), n;
}
function Vl(e, t, n) {
	return Qa({
		kind: _o,
		content: Rl(e, t, n),
		created_at: Il(),
		tags: []
	}, t);
}
function Hl(e, t) {
	let n = Xa();
	return Qa({
		kind: Eo,
		content: Rl(e, n, t),
		created_at: Il(),
		tags: [["p", t]]
	}, n);
}
function Ul(e, t, n) {
	return Hl(Vl(Bl(e, t), t, n), n);
}
function Wl(e, t, n) {
	if (!n || n.length === 0) throw Error("At least one recipient is required.");
	let r = [Ul(e, t, Za(t))];
	return n.forEach(((n) => {
		r.push(Ul(e, t, n));
	})), r;
}
function Gl(e, t) {
	return zl(zl(e, t), t);
}
function Kl(e, t) {
	let n = [];
	return e.forEach(((e) => {
		n.push(Gl(e, t));
	})), n.sort(((e, t) => e.created_at - t.created_at)), n;
}
var ql = {};
Na(ql, {
	getToken: () => Yl,
	hashPayload: () => nu,
	unpackEventFromToken: () => Zl,
	validateEvent: () => iu,
	validateEventKind: () => $l,
	validateEventMethodTag: () => tu,
	validateEventPayloadTag: () => ru,
	validateEventTimestamp: () => Ql,
	validateEventUrlTag: () => eu,
	validateToken: () => Xl
});
var Jl = "Nostr ";
async function Yl(e, t, n, r = !1, i) {
	let a = {
		kind: as,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	i && a.tags.push(["payload", nu(i)]);
	let o = await n(a);
	return (r ? Jl : "") + di.encode(Ba.encode(JSON.stringify(o)));
}
async function Xl(e, t, n) {
	return await iu(await Zl(e).catch(((e) => {
		throw e;
	})), t, n).catch(((e) => {
		throw e;
	}));
}
async function Zl(e) {
	if (!e) throw Error("Missing token");
	e = e.replace(Jl, "");
	let t = za.decode(di.decode(e));
	if (!t || t.length === 0 || !t.startsWith("{")) throw Error("Invalid token");
	return JSON.parse(t);
}
function Ql(e) {
	return !!e.created_at && Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) - e.created_at < 60;
}
function $l(e) {
	return e.kind === as;
}
function eu(e, t) {
	let n = e.tags.find(((e) => e[0] === "u"));
	return !!n && n.length > 0 && n[1] === t;
}
function tu(e, t) {
	let n = e.tags.find(((e) => e[0] === "method"));
	return !!n && n.length > 0 && n[1].toLowerCase() === t.toLowerCase();
}
function nu(e) {
	return Pr(Zr(Ba.encode(JSON.stringify(e))));
}
function ru(e, t) {
	let n = e.tags.find(((e) => e[0] === "payload"));
	if (!n) return !1;
	let r = nu(t);
	return n.length > 0 && n[1] === r;
}
async function iu(e, t, n, r) {
	if (!$a(e)) throw Error("Invalid nostr event, signature invalid");
	if (!$l(e)) throw Error("Invalid nostr event, kind invalid");
	if (!Ql(e)) throw Error("Invalid nostr event, created_at timestamp invalid");
	if (!eu(e, t)) throw Error("Invalid nostr event, url tag invalid");
	if (!tu(e, n)) throw Error("Invalid nostr event, method tag invalid");
	if (r && typeof r == "object" && Object.keys(r).length > 0 && !ru(e, r)) throw Error("Invalid nostr event, payload tag does not match request body hash");
	return !0;
}
var q = {
	LIBRARIES: {
		decodeBolt11: Ht.decode,
		NostrTools: Vt
	},
	DEFAULT_OPTIONS: {
		theme: "light",
		colorMode: !0
	},
	BATCH_SIZE: 5,
	REQ_CONFIG: {
		INITIAL_LOAD_COUNT: 15,
		ADDITIONAL_LOAD_COUNT: 20
	},
	LOAD_TIMEOUT: 1e4,
	BUFFER_INTERVAL: 500,
	BUFFER_MIN_INTERVAL: 100,
	INFINITE_SCROLL: {
		ROOT_MARGIN: "400px",
		THRESHOLD: .1,
		DEBOUNCE_TIME: 500,
		RETRY_DELAY: 500
	},
	ZAP_CONFIG: {
		DEFAULT_LIMIT: 1,
		DEFAULT_COLOR_MODE: !0,
		ERRORS: {
			DIALOG_NOT_FOUND: "Zap dialog not found",
			BUTTON_NOT_FOUND: "Fetch button not found",
			DECODE_FAILED: "Failed to decode identifier"
		}
	},
	ZAP_AMOUNT_CONFIG: {
		DEFAULT_COLOR_MODE: !0,
		THRESHOLDS: [
			{
				value: 1e4,
				className: "zap-amount-10k"
			},
			{
				value: 5e3,
				className: "zap-amount-5k"
			},
			{
				value: 2e3,
				className: "zap-amount-2k"
			},
			{
				value: 1e3,
				className: "zap-amount-1k"
			},
			{
				value: 500,
				className: "zap-amount-500"
			},
			{
				value: 200,
				className: "zap-amount-200"
			},
			{
				value: 100,
				className: "zap-amount-100"
			}
		],
		DEFAULT_CLASS: "default-color",
		DISABLED_CLASS: ""
	},
	DIALOG_CONFIG: {
		DEFAULT_TITLE: "To ",
		NO_ZAPS_MESSAGE: "No Zaps yet!<br>Send the first Zap!",
		DEFAULT_NO_ZAPS_DELAY: 1500,
		ZAP_LIST: {
			INITIAL_BATCH: 30,
			REMAINING_BATCH: 30,
			PROFILE_BATCH: 30,
			MIN_HEIGHT: "100px"
		}
	},
	REQUEST_CONFIG: {
		METADATA_TIMEOUT: 2e4,
		REQUEST_TIMEOUT: 2e3,
		CACHE_DURATION: 3e5
	},
	PROFILE_CONFIG: {
		BATCH_SIZE: 20,
		BATCH_DELAY: 100,
		RELAYS: [
			"wss://relay.nostr.band",
			"wss://purplepag.es",
			"wss://relay.damus.io",
			"wss://nostr.wine",
			"wss://directory.yabu.me"
		]
	},
	BATCH_CONFIG: {
		REFERENCE_PROCESSOR: {
			BATCH_SIZE: 20,
			BATCH_DELAY: 100
		},
		SUPPORTED_EVENT_KINDS: [
			1,
			30023,
			30030,
			30009,
			40,
			42,
			31990
		]
	},
	BATCH_PROCESSOR_CONFIG: {
		DEFAULT_BATCH_SIZE: 20,
		DEFAULT_BATCH_DELAY: 100,
		DEFAULT_MAX_CACHE_AGE: 18e5,
		DEFAULT_RELAY_URLS: [],
		TIMEOUT_DURATION: 500
	}
}, au = class e {
	constructor(e, t, n = null) {
		this.identifier = e, this.relayUrls = t, this.isColorModeEnabled = n === null ? q.ZAP_CONFIG.DEFAULT_COLOR_MODE : String(n).toLowerCase() === "true";
	}
	static determineColorMode(e) {
		if (!e || !e.hasAttribute("data-zap-color-mode")) return q.ZAP_CONFIG.DEFAULT_COLOR_MODE;
		let t = e.getAttribute("data-zap-color-mode");
		return t.toLowerCase() !== "true" && t.toLowerCase() !== "false" || t.toLowerCase() === "true";
	}
	static fromButton(t) {
		if (!t) throw Error(q.ZAP_CONFIG.ERRORS.BUTTON_NOT_FOUND);
		let n = e.determineColorMode(t);
		return new e(t.getAttribute("data-nzv-id"), t.getAttribute("data-relay-urls").split(","), n);
	}
}, ou = class {
	constructor(e = 1e3) {
		this.cache = /* @__PURE__ */ new Map(), this.maxSize = e, this.accessOrder = /* @__PURE__ */ new Map();
	}
	set(e, t) {
		if (this.cache.size >= this.maxSize && !this.cache.has(e)) {
			let e = this.accessOrder.keys().next().value;
			this.cache.delete(e), this.accessOrder.delete(e);
		}
		return this.cache.set(e, t), this.accessOrder.delete(e), this.accessOrder.set(e, Date.now()), t;
	}
	get(e) {
		if (!this.cache.has(e)) return;
		let t = this.cache.get(e);
		return this.accessOrder.set(e, Date.now()), t;
	}
	has(e) {
		return this.cache.has(e);
	}
	delete(e) {
		this.cache.delete(e);
	}
	clear() {
		this.cache.clear();
	}
}, su = class extends ou {
	#e = /* @__PURE__ */ new Map();
	setProfile(e, t) {
		if (!e || !t) return;
		let n = this.get(e);
		n && n._eventCreatedAt && t._eventCreatedAt && !(t._eventCreatedAt > n._eventCreatedAt) || (this.set(e, t), this.#t(e, t));
	}
	#t(e, t) {
		this.#e.forEach(((n) => {
			try {
				n(e, t);
			} catch {}
		}));
	}
	subscribe(e) {
		if (typeof e != "function") return null;
		let t = Math.random().toString(36).substr(2, 9);
		return this.#e.set(t, e), () => this.#e.delete(t);
	}
	clearSubscriptions() {
		this.#e.clear();
	}
}, cu = class extends ou {
	#e = /* @__PURE__ */ new Map();
	initializeView(e) {
		this.#e.set(e, {
			isInitialFetchComplete: !1,
			lastEventTime: null,
			isLoading: !1,
			batchProcessing: !1
		});
	}
	getViewState(e) {
		return this.#e.get(e) || this.initializeView(e);
	}
	updateViewState(e, t) {
		let n = this.getViewState(e);
		return this.#e.set(e, {
			...n,
			...t
		}), this.#e.get(e);
	}
	getEvents(e) {
		return this.get(e) || [];
	}
	setEvents(e, t, n = !1) {
		let r = n ? this.getEvents(e) : [], i = new Map(t.map(((e) => [e.id, e]))), a = [...r.filter(((e) => !i.has(e.id))), ...t];
		this.set(e, a);
	}
	addEvent(e, t) {
		if (!t?.id) return !1;
		let n = this.getEvents(e);
		return !this.#t(n, t) && (n.push(t), n.sort(((e, t) => t.created_at - e.created_at)), this.setEvents(e, n, !0), !0);
	}
	#t(e, t) {
		return e.some(((e) => e.id === t.id || e.kind === t.kind && e.pubkey === t.pubkey && e.content === t.content && e.created_at === t.created_at));
	}
}, lu = class extends ou {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	async getOrFetch(e, t) {
		let n = this.get(e);
		if (n) return n;
		let r = this.#e.get(e);
		if (r) return r;
		let i = t().then(((t) => (t && this.set(e, t), this.#e.delete(e), t))).catch(((t) => (this.#e.delete(e), null)));
		return this.#e.set(e, i), i;
	}
	clearPendingFetches() {
		this.#e.clear();
	}
	setComponent(e, t) {
		this.#t.set(e, t);
	}
	getComponent(e) {
		return this.#t.get(e);
	}
	clearComponents() {
		this.#t.clear();
	}
	clear() {
		super.clear(), this.clearPendingFetches(), this.clearComponents();
	}
}, uu = class extends ou {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	setCached(e, t, n) {
		let r = `${e}:${t}`;
		this.set(r, {
			stats: n,
			timestamp: Date.now()
		}), this.updateViewStats(e, n);
	}
	getCached(e, t) {
		let n = `${e}:${t}`;
		return this.get(n);
	}
	updateViewStats(e, t) {
		t && this.#e.set(e, {
			...t,
			lastUpdate: Date.now()
		});
	}
	getViewStats(e) {
		return this.#e.get(e);
	}
	clearViewStats(e) {
		this.#e.delete(e);
	}
	setNoZapsState(e, t) {
		this.#t.set(e, t);
	}
	hasNoZaps(e) {
		return this.#t.get(e) || !1;
	}
	clearNoZapsState(e) {
		this.#t.delete(e);
	}
	clear() {
		super.clear(), this.#e.clear(), this.#t.clear();
	}
}, du = class extends ou {
	hasDecoded(e) {
		return this.has(e);
	}
	setDecoded(e, t) {
		this.set(e, t);
	}
	getDecoded(e) {
		return this.get(e);
	}
}, fu = class extends ou {
	initializeLoadState(e) {
		let t = {
			isInitialFetchComplete: !1,
			lastEventTime: null,
			isLoading: !1,
			currentCount: 0
		};
		return this.set(e, t), t;
	}
	getLoadState(e) {
		return this.has(e) ? this.get(e) : this.initializeLoadState(e);
	}
	updateLoadState(e, t) {
		let n = {
			...this.getLoadState(e),
			...t
		};
		return this.set(e, n), n;
	}
	canLoadMore(e) {
		let t = this.getLoadState(e);
		return t && !t.isLoading && t.lastEventTime;
	}
	updateLoadProgress(e, t) {
		let n = this.getLoadState(e);
		return n.currentCount += t, this.updateLoadState(e, { currentCount: n.currentCount }), n.currentCount;
	}
}, pu = class extends ou {
	setZapInfo(e, t) {
		this.set(e, t);
	}
	getZapInfo(e) {
		return this.get(e);
	}
	clearZapInfo(e) {
		this.delete(e);
	}
}, mu = class extends su {
	setImage(e, t) {
		e && t && this.set(e, {
			image: t,
			timestamp: Date.now()
		});
	}
	getImage(e) {
		return this.get(e)?.image;
	}
	hasImage(e) {
		return this.has(e);
	}
	clearExpired(e = 36e5) {
		let t = Date.now();
		for (let [n, r] of this.cache.entries()) t - r.timestamp > e && this.delete(n);
	}
}, hu = class extends su {
	#e = /* @__PURE__ */ new Map();
	setNip05(e, t) {
		e && this.set(e, {
			value: t,
			timestamp: Date.now(),
			verified: !0
		});
	}
	getNip05(e) {
		return this.get(e)?.value;
	}
	setPendingVerification(e, t) {
		this.#e.set(e, t);
	}
	getPendingVerification(e) {
		return this.#e.get(e);
	}
	deletePendingVerification(e) {
		this.#e.delete(e);
	}
	clearPendingVerifications() {
		this.#e.clear();
	}
	clear() {
		super.clear(), this.clearPendingVerifications();
	}
}, J = new class e {
	static #e = null;
	#t = null;
	#n = {};
	constructor() {
		if (e.#e) return e.#e;
		this.profileCache = new su(), this.zapEventCache = new cu(), this.referenceCache = new lu(), this.statsCache = new uu(), this.decodedCache = new du(), this.loadStateCache = new fu(), this.zapInfoCache = new pu(), this.imageCache = new mu(), this.nip05Cache = new hu(), this.nip05PendingCache = new ou(), this.#n = [
			"zapInfo",
			"uiComponent",
			"decoded",
			"nip05",
			"nip05PendingFetches",
			"zapLoadStates",
			"imageCache",
			"isEventIdentifier"
		].reduce(((e, t) => (e[t] = new ou(), e)), {}), this.viewStats = /* @__PURE__ */ new Map(), this.viewStates = /* @__PURE__ */ new Map(), e.#e = this;
	}
	setProfile(e, t) {
		return this.profileCache.setProfile(e, t);
	}
	getProfile(e) {
		return this.profileCache.get(e);
	}
	subscribeToProfileUpdates(e) {
		return this.profileCache.subscribe(e);
	}
	initializeZapView(e) {
		return this.zapEventCache.initializeView(e);
	}
	getZapEvents(e) {
		return this.zapEventCache.getEvents(e);
	}
	setZapEvents(e, t, n) {
		return this.zapEventCache.setEvents(e, t, n);
	}
	addZapEvent(e, t) {
		return this.zapEventCache.addEvent(e, t);
	}
	getZapViewState(e) {
		return this.zapEventCache.getViewState(e);
	}
	updateZapViewState(e, t) {
		return this.zapEventCache.updateViewState(e, t);
	}
	setReference(e, t) {
		return this.referenceCache.set(e, t);
	}
	getReference(e) {
		return this.referenceCache.get(e);
	}
	getOrFetchReference(e, t) {
		return this.referenceCache.getOrFetch(e, t);
	}
	getReferenceComponent(e) {
		return this.referenceCache.getComponent(e);
	}
	setReferenceComponent(e, t) {
		return this.referenceCache.setComponent(e, t);
	}
	getCachedStats(e, t) {
		return this.statsCache.getCached(e, t);
	}
	updateStatsCache(e, t, n) {
		this.statsCache.setCached(e, t, n), this.statsCache.updateViewStats(e, n);
	}
	getViewStats(e) {
		return this.statsCache.getViewStats(e);
	}
	setNoZapsState(e, t) {
		return this.statsCache.setNoZapsState(e, t);
	}
	hasNoZaps(e) {
		return this.statsCache.hasNoZaps(e);
	}
	async processCachedData(e, t) {
		this.setRelayUrls(t.relayUrls);
		let n = this.getZapEvents(e), r = n.some(((e) => this.getReference(e.id)));
		return {
			stats: (await Promise.all([this.getCachedStats(e, t.identifier)]))[0],
			hasEnoughCachedEvents: n.length >= q.REQ_CONFIG.INITIAL_LOAD_COUNT,
			hasReferences: r
		};
	}
	hasDecoded(e) {
		return this.decodedCache.hasDecoded(e);
	}
	setDecoded(e, t) {
		return this.decodedCache.setDecoded(e, t);
	}
	getDecoded(e) {
		return this.decodedCache.getDecoded(e);
	}
	initializeLoadState(e) {
		return this.loadStateCache.initializeLoadState(e);
	}
	getLoadState(e) {
		return this.loadStateCache.getLoadState(e);
	}
	updateLoadState(e, t) {
		return this.loadStateCache.updateLoadState(e, t);
	}
	canLoadMore(e) {
		return this.loadStateCache.canLoadMore(e);
	}
	updateLoadProgress(e, t) {
		return this.loadStateCache.updateLoadProgress(e, t);
	}
	setZapInfo(e, t) {
		return this.zapInfoCache.setZapInfo(e, t);
	}
	getZapInfo(e) {
		return this.zapInfoCache.getZapInfo(e);
	}
	clearZapInfo(e) {
		return this.zapInfoCache.clearZapInfo(e);
	}
	setImageCache(e, t) {
		return this.imageCache.setImage(e, t);
	}
	getImageCache(e) {
		return this.imageCache.getImage(e);
	}
	hasImageCache(e) {
		return this.imageCache.hasImage(e);
	}
	setNip05(e, t) {
		return this.nip05Cache.setNip05(e, t);
	}
	getNip05(e) {
		return this.nip05Cache.getNip05(e);
	}
	setNip05PendingFetch(e, t) {
		this.nip05Cache.setPendingVerification(e, t);
	}
	getNip05PendingFetch(e) {
		return this.nip05Cache.getPendingVerification(e);
	}
	deleteNip05PendingFetch(e) {
		this.nip05Cache.deletePendingVerification(e);
	}
	getOrCreateViewState(e, t = {}) {
		return this.viewStates.has(e) || this.viewStates.set(e, {
			currentStats: null,
			...t
		}), this.viewStates.get(e);
	}
	getViewState(e) {
		return this.getOrCreateViewState(e);
	}
	updateViewState(e, t) {
		let n = this.getOrCreateViewState(e);
		return this.viewStates.set(e, {
			...n,
			...t
		}), this.viewStates.get(e);
	}
	setCacheItem(e, t, n) {
		let r = this.#n[e];
		return r && t !== void 0 ? r.set(t, n) : null;
	}
	getCacheItem(e, t) {
		let n = this.#n[e];
		return n && t !== void 0 ? n.get(t) : null;
	}
	setRelayUrls(e) {
		this.#t = e;
	}
	getRelayUrls() {
		return this.#t;
	}
	clearAll() {
		this.profileCache.clear(), this.profileCache.clearSubscriptions(), this.zapEventCache.clear(), this.referenceCache.clear(), this.referenceCache.clearPendingFetches(), this.referenceCache.clearComponents(), this.statsCache.clear(), this.decodedCache.clear(), this.loadStateCache.clear(), this.zapInfoCache.clear(), this.imageCache.clear(), this.nip05Cache.clear(), this.nip05Cache.clearPendingVerifications(), Object.values(this.#n).forEach(((e) => e.clear())), this.viewStats.clear(), this.viewStates.clear();
	}
}(), gu = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMDYuMzMgMjA2LjMzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICA8ZGVmcz4KICAgICAgPHN0eWxlPgogICAgICAgICAuY2xzLTEgewogICAgICAgICAgICBmaWxsOiBub25lOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTIgewogICAgICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTMgewogICAgICAgICAgICBmaWxsOiAjNjY2OwogICAgICAgICB9CiAgICAgIDwvc3R5bGU+CiAgIDwvZGVmcz4KICAgPHBhdGggY2xhc3M9ImNscy0yIgogICAgICBkPSJtMjA2LjMzIDEzNC4zOWMwIDIwLjcxIDAgMzEuMDctMy41MyA0Mi4yMi00LjQzIDEyLjE3LTE0LjAyIDIxLjc2LTI2LjE5IDI2LjE5LTExLjE1IDMuNTMtMjEuNSAzLjUzLTQyLjIyIDMuNTNoLTYyLjQ2Yy0yMC43MSAwLTMxLjA2IDAtNDIuMjEtMy41My0xMi4xNy00LjQzLTIxLjc2LTE0LjAyLTI2LjE5LTI2LjE5LTMuNTMtMTEuMTUtMy41My0yMS41LTMuNTMtNDIuMjJ2LTYyLjQ2YzAtMjAuNzEgMC0zMS4wNyAzLjUzLTQyLjIyIDQuNDMtMTIuMTcgMTQuMDItMjEuNzYgMjYuMTktMjYuMTkgMTEuMTUtMy41MiAyMS41LTMuNTIgNDIuMjEtMy41Mmg2Mi40NmMyMC43MSAwIDMxLjA3IDAgNDIuMjIgMy41MiAxMi4xNyA0LjQzIDIxLjc2IDE0LjAyIDI2LjE5IDI2LjE5IDMuNTMgMTEuMTUgMy41MyAyMS41IDMuNTMgNDIuMjJ6IiAvPgogICA8cGF0aCBjbGFzcz0iY2xzLTMiCiAgICAgIGQ9Im0xODUuOTggOTEuMXY4My4yM2MwIDMuMTMtMi41NCA1LjY3LTUuNjcgNS42N2gtNjguMDRjLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNS41YzAuMzEtMTkgMi4zMi0zNy4yIDYuNTQtNDUuNDggMi41My00Ljk4IDYuNy03LjY5IDExLjQ5LTkuMTQgOS4wNS0yLjcyIDI0LjkzLTAuODYgMzEuNjctMS4xOCAwIDAgMjAuMzYgMC44MSAyMC4zNi0xMC43MiAwLTkuMjgtOS4xLTguNTUtOS4xLTguNTUtMTAuMDMgMC4yNi0xNy42Ny0wLjQyLTIyLjYyLTIuMzctOC4yOS0zLjI2LTguNTctOS4yNC04LjYtMTEuMjQtMC40MS0yMy4xLTM0LjQ3LTI1Ljg3LTY0LjQ4LTIwLjE0LTMyLjgxIDYuMjQgMC4zNiA1My4yNyAwLjM2IDExNi4wNXY4LjM4Yy0wLjA2IDMuMDgtMi41NSA1LjU3LTUuNjUgNS41N2gtMzMuNjljLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNDMuOTVjMC0zLjEzIDIuNTQtNS42NyA1LjY3LTUuNjdoMzEuNjdjMy4xMyAwIDUuNjcgMi41NCA1LjY3IDUuNjcgMCA0LjY1IDUuMjMgNy4yNCA5LjAxIDQuNTMgMTEuMzktOC4xNiAyNi4wMS0xMi41MSA0Mi4zNy0xMi41MSAzNi42NSAwIDY0LjM2IDIxLjM2IDY0LjM2IDY4LjY5em0tNjAuODQtMTYuODljMC02LjctNS40My0xMi4xMy0xMi4xMy0xMi4xM3MtMTIuMTMgNS40My0xMi4xMyAxMi4xMyA1LjQzIDEyLjEzIDEyLjEzIDEyLjEzIDEyLjEzLTUuNDMgMTIuMTMtMTIuMTN6IiAvPgo8L3N2Zz4=", _u = (e) => typeof e == "string" && e.length > 0, vu = (e) => {
	try {
		return window.NostrTools.nip19.decode(e);
	} catch {
		return null;
	}
}, yu = (e, t, n) => {
	let r = {
		npub: () => ({
			kinds: [9735],
			"#p": [t]
		}),
		note: () => ({
			kinds: [9735],
			"#e": [t]
		}),
		nprofile: () => ({
			kinds: [9735],
			"#p": [t.pubkey]
		}),
		nevent: () => ({
			kinds: [9735],
			"#e": [t.id]
		}),
		naddr: () => ({
			kinds: [9735],
			"#a": [`${t.kind}:${t.pubkey}:${t.identifier}`]
		})
	}[e];
	if (!r) return null;
	let i = r();
	return i.limit = n ? q.REQ_CONFIG.ADDITIONAL_LOAD_COUNT : q.REQ_CONFIG.INITIAL_LOAD_COUNT, n && (i.until = n), { req: i };
};
function bu(e, t = null) {
	let n = `${e}:${t}`;
	if (J.hasDecoded(n)) return J.getDecoded(n);
	if (!_u(e)) throw Error(q.ZAP_CONFIG.ERRORS.DECODE_FAILED);
	let r = vu(e);
	if (!r) return null;
	let i = yu(r.type, r.data, t);
	return i && J.setDecoded(n, i), i;
}
function xu(e) {
	return e?.display_name || e?.name || "nameless";
}
async function Su(e, t) {
	if (!e || !t) return null;
	try {
		return (await window.NostrTools.nip05.queryProfile(e))?.pubkey === t ? e : null;
	} catch {
		return null;
	}
}
function Cu(e) {
	return new Intl.NumberFormat().format(e);
}
function wu(e) {
	if (!e || typeof e != "string") return "unknown";
	try {
		return `${window.NostrTools.nip19.decode(e).type.toLowerCase()}1${e.slice(5, 11)}...${e.slice(-4)}`;
	} catch {
		return "unknown";
	}
}
function Tu(e) {
	let t = document.createElement("div");
	return t.textContent = e, t.innerHTML;
}
function Eu(e) {
	try {
		return window.NostrTools.nip19.npubEncode(e);
	} catch {
		return null;
	}
}
function Du(e) {
	if (!e || typeof e != "string") return !1;
	let t = `isEventIdentifier:${e}`, n = J.getCacheItem("isEventIdentifier", t);
	if (n !== void 0) return n;
	let r = e.startsWith("note1") || e.startsWith("nevent1") || e.startsWith("naddr1");
	return J.setCacheItem("isEventIdentifier", t, r), r;
}
async function Ou(e) {
	let { pubkey: t, content: n } = function(e) {
		let t = e.tags.find(((e) => e[0] === "description"))?.[1];
		if (!t) return {
			pubkey: null,
			content: ""
		};
		try {
			let e = Au(t), n;
			try {
				n = JSON.parse(e);
			} catch {
				let t = e.match(/"pubkey"\s*:\s*"([^"]+)"|"content"\s*:\s*"([^"]+)"/g);
				if (!t) throw Error("Invalid JSON structure");
				n = {}, t.forEach(((e) => {
					let [t, r] = e.split(":").map(((e) => e.trim().replace(/"/g, "")));
					n[t] = r;
				}));
			}
			let r = null;
			return n.pubkey && (r = typeof n.pubkey == "string" ? n.pubkey : String(n.pubkey)), {
				pubkey: r,
				content: typeof n.content == "string" ? n.content.trim() : ""
			};
		} catch {
			return {
				pubkey: null,
				content: ""
			};
		}
	}(e);
	return {
		pubkey: t,
		content: n,
		satsText: await async function(e) {
			let t = e.tags.find(((e) => e[0].toLowerCase() === "bolt11"))?.[1];
			if (!t) return "Amount: Unknown";
			try {
				let e = window.decodeBolt11(t).sections.find(((e) => e.name === "amount"))?.value;
				return e ? `${Cu(Math.floor(e / 1e3))} sats` : "Amount: Unknown";
			} catch {
				return "Amount: Unknown";
			}
		}(e)
	};
}
function ku(e) {
	try {
		return window.NostrTools.nip19.decode(e);
	} catch {
		return null;
	}
}
function Au(e) {
	return e.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/\\\\/g, "\\").replace(/\\(?!(["\\\/bfnrt]|u[0-9a-fA-F]{4}))/g, "").replace(/\\+(["\\/bfnrt])/g, "\\$1").replace(/\\u(?![0-9a-fA-F]{4})/g, "");
}
var ju = class {
	constructor(e) {
		this.root = e;
	}
	displayStats(e) {
		requestAnimationFrame((() => {
			let t = this.root?.querySelector(".zap-stats");
			if (t) try {
				let n;
				n = e ? e.skeleton ? this.#e() : e.error ? this.createTimeoutStats() : this.createNormalStats(e) : this.createTimeoutStats(), t.innerHTML = n;
			} catch {
				t.innerHTML = this.createTimeoutStats();
			}
		}));
	}
	#e() {
		return "\n      <div class=\"stats-item\">Total Count</div>\n      <div class=\"stats-item\"><span class=\"number skeleton\">...</span></div>\n      <div class=\"stats-item\">times</div>\n      <div class=\"stats-item\">Total Amount</div>\n      <div class=\"stats-item\"><span class=\"number skeleton\">...</span></div>\n      <div class=\"stats-item\">sats</div>\n      <div class=\"stats-item\">Max Amount</div>\n      <div class=\"stats-item\"><span class=\"number skeleton\">...</span></div>\n      <div class=\"stats-item\">sats</div>\n    ";
	}
	createTimeoutStats() {
		return "\n      <div class=\"stats-item\">Total Count</div>\n      <div class=\"stats-item\"><span class=\"number text-muted\">nostr.band</span></div>\n      <div class=\"stats-item\">times</div>\n      <div class=\"stats-item\">Total Amount</div>\n      <div class=\"stats-item\"><span class=\"number text-muted\">Stats</span></div>\n      <div class=\"stats-item\">sats</div>\n      <div class=\"stats-item\">Max Amount</div>\n      <div class=\"stats-item\"><span class=\"number text-muted\">Unavailable</span></div>\n      <div class=\"stats-item\">sats</div>\n    ";
	}
	createNormalStats(e) {
		return `\n      <div class="stats-item">Total Count</div>\n      <div class="stats-item"><span class="number">${Cu(e.count)}</span></div>\n      <div class="stats-item">times</div>\n      <div class="stats-item">Total Amount</div>\n      <div class="stats-item"><span class="number">${Cu(Math.floor(e.msats / 1e3))}</span></div>\n      <div class="stats-item">sats</div>\n      <div class="stats-item">Max Amount</div>\n      <div class="stats-item"><span class="number">${Cu(Math.floor(e.maxMsats / 1e3))}</span></div>\n      <div class="stats-item">sats</div>\n    `;
	}
}, Mu = class {
	constructor(e = {}) {
		this._validateOptions(e), this._initializeProperties(e);
	}
	_validateOptions(e) {
		if (!e.pool?.ensureRelay) throw Error("Invalid pool object: ensureRelay method is required");
	}
	_initializeProperties(e) {
		this.pool = e.pool, this.batchSize = e.batchSize || q.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_SIZE, this.batchDelay = e.batchDelay || q.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_DELAY, this.relayUrls = e.relayUrls || q.BATCH_PROCESSOR_CONFIG.DEFAULT_RELAY_URLS, this.batchQueue = /* @__PURE__ */ new Set(), this.pendingFetches = /* @__PURE__ */ new Map(), this.resolvers = /* @__PURE__ */ new Map(), this.processingItems = /* @__PURE__ */ new Set(), this.batchTimer = null, this.eventCache = /* @__PURE__ */ new Map(), this.maxCacheAge = e.maxCacheAge || q.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE;
	}
	getOrCreateFetchPromise(e) {
		if (this.pendingFetches.has(e)) return this.pendingFetches.get(e);
		let t = new Promise(((t) => {
			this.resolvers.set(e, t);
		}));
		return this.pendingFetches.set(e, t), this.batchQueue.add(e), this._scheduleBatchProcess(), t;
	}
	_scheduleBatchProcess() {
		this.batchTimer ||= setTimeout((() => {
			this.batchTimer = null, this._processBatchQueue();
		}), this.batchDelay);
	}
	async _processBatchQueue() {
		if (this.batchQueue.size === 0) return;
		let e = this._getBatchItems();
		await this._processBatch(e), this.batchQueue.size > 0 && this._scheduleBatchProcess();
	}
	_getBatchItems() {
		let e = Array.from(this.batchQueue).slice(0, this.batchSize);
		return e.forEach(((e) => {
			this.batchQueue.delete(e), this.processingItems.add(e);
		})), e;
	}
	async _processBatch(e) {
		try {
			await this.onBatchProcess(e);
		} catch (t) {
			this._handleBatchError(e, t);
		} finally {
			this._cleanupBatchItems(e);
		}
	}
	_handleBatchError(e, t) {
		e.forEach(((e) => this.resolveItem(e, null)));
	}
	_cleanupBatchItems(e) {
		e.forEach(((e) => {
			this.processingItems.delete(e), this.pendingFetches.delete(e), this.resolvers.delete(e);
		}));
	}
	resolveItem(e, t) {
		let n = this.resolvers.get(e);
		n && (n(t), this.resolvers.delete(e));
	}
	async onBatchProcess(e) {
		throw Error("onBatchProcess must be implemented by derived class");
	}
	onBatchError(e, t) {
		e.forEach(((e) => this.resolveItem(e, null)));
	}
	_cleanup(e, t, n, r) {
		clearTimeout(e), t && t.close(), n.forEach(((e) => {
			!r.has(e) && this.resolvers.has(e) && this.resolveItem(e, null);
		}));
	}
	_getSubscriptionPool() {
		return this.pool;
	}
	async _createSubscriptionPromise(e, t, n, r) {
		if (t?.length) return new Promise(((i) => {
			let a = /* @__PURE__ */ new Set(), o = q.BATCH_PROCESSOR_CONFIG.TIMEOUT_DURATION, s, c, l = !1, u = () => {
				l || (l = !0, s && clearTimeout(s), c && c.close(), e.forEach(((e) => {
					a.has(e) || this.resolveItem(e, null);
				})), i());
			};
			c = this.pool.subscribeMany(t, n, {
				onevent: (t) => {
					try {
						l || (r(t, a), a.size === e.length && u());
					} catch {}
				},
				oneose: () => {
					setTimeout(u, 100);
				},
				onerror: (e) => {}
			}), s = setTimeout((() => {
				l || u();
			}), o);
		}));
		e.forEach(((e) => this.resolveItem(e, null)));
	}
	setRelayUrls(e) {
		this.relayUrls = Array.isArray(e) ? e : [];
	}
	getCachedItem(e) {
		let t = this.eventCache.get(e);
		return this._isValidCache(t) ? t.event : (this.eventCache.delete(e), null);
	}
	_isValidCache(e) {
		return !!e && Date.now() - e.timestamp <= this.maxCacheAge;
	}
	setCachedItem(e, t) {
		this.eventCache.set(e, {
			event: t,
			timestamp: Date.now()
		});
	}
}, Nu = class extends Mu {
	constructor(e = {}) {
		super(e);
	}
	async onBatchProcess(e) {
		if (!e?.length) return;
		let t = [{ ids: e.slice(0, this.batchSize) }];
		await this._createSubscriptionPromise(e, this.relayUrls, t, ((t, n) => {
			if (e.includes(t.id)) {
				let e = this.getCachedItem(t.id);
				(!e || t.created_at > e.created_at) && (this.setCachedItem(t.id, t), this.resolveItem(t.id, t), n.add(t.id));
			}
		}));
	}
}, Pu = class extends Mu {
	constructor(e = {}) {
		super(e);
	}
	_parseAtagValue(e) {
		let t = e.split(":");
		return t.length === 3 ? {
			kind: parseInt(t[0]),
			pubkey: t[1],
			identifier: t[2]
		} : null;
	}
	async onBatchProcess(e) {
		if (!e?.length) return;
		let t = [], n = {
			kinds: [],
			authors: [],
			"#d": []
		};
		if (e.slice(0, this.batchSize).forEach(((e) => {
			let r = this._parseAtagValue(e);
			r ? (n.kinds.push(r.kind), n.authors.push(r.pubkey), n["#d"].push(r.identifier), t.push(e)) : this.resolveItem(e, null);
		})), t.length === 0) return;
		let r = [n];
		await this._createSubscriptionPromise(t, this.relayUrls, r, ((e, n) => {
			let r = t.find(((t) => {
				let n = this._parseAtagValue(t);
				return n && e.kind === n.kind && e.pubkey === n.pubkey && e.tags.some(((e) => e[0] === "d" && e[1] === n.identifier));
			}));
			if (r) {
				let t = this.getCachedItem(r);
				(!t || e.created_at > t.created_at) && (this.setCachedItem(r, e), this.resolveItem(r, e), n.add(r));
			}
		}));
	}
}, Fu = class extends Mu {
	constructor(e = {}) {
		let { simplePool: t, config: n } = e;
		super({
			pool: t,
			batchSize: n.BATCH_SIZE || q.PROFILE_CONFIG.BATCH_SIZE,
			batchDelay: n.BATCH_DELAY || q.PROFILE_CONFIG.BATCH_DELAY,
			relayUrls: n.RELAYS || q.PROFILE_CONFIG.RELAYS,
			maxCacheAge: q.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE
		}), this.config = n;
	}
	async onBatchProcess(e) {
		if (!this.config.RELAYS?.length) throw Error("No relays configured for profile fetch");
		let t = e.filter(((e) => {
			let t = this.getCachedItem(e);
			return !t || (this.resolveItem(e, t), !1);
		}));
		if (t.length === 0) return;
		let n = [{
			kinds: [0],
			authors: t
		}], r = /* @__PURE__ */ new Map(), i = (e, t) => {
			let n = r.get(e.pubkey);
			(!n || e.created_at > n.created_at) && (r.set(e.pubkey, e), this.setCachedItem(e.pubkey, e)), t.add(e.pubkey);
		};
		try {
			await this._createSubscriptionPromise(t, this.config.RELAYS, n, i), t.forEach(((e) => {
				let t = r.get(e);
				this.resolveItem(e, t || null);
			}));
		} catch (t) {
			this.onBatchError(e, t);
		}
	}
}, Iu = Symbol("verified");
function Lu(e) {
	if (!(e instanceof Object) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] == "object") return !1;
	}
	return !0;
}
new TextDecoder("utf-8");
var Ru = new TextEncoder();
function zu(e) {
	e.indexOf("://") === -1 && (e = "wss://" + e);
	let t = new URL(e);
	return t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
}
var Bu = class {
	value;
	next = null;
	prev = null;
	constructor(e) {
		this.value = e;
	}
}, Vu = class {
	first;
	last;
	constructor() {
		this.first = null, this.last = null;
	}
	enqueue(e) {
		let t = new Bu(e);
		return this.last ? this.last === this.first ? (this.last = t, this.last.prev = this.first, this.first.next = t) : (t.prev = this.last, this.last.next = t, this.last = t) : (this.first = t, this.last = t), !0;
	}
	dequeue() {
		if (!this.first) return null;
		if (this.first === this.last) {
			let e = this.first;
			return this.first = null, this.last = null, e.value;
		}
		let e = this.first;
		return this.first = e.next, e.value;
	}
};
function Hu(e) {
	return Pr(Zr(Ru.encode(function(e) {
		if (!Lu(e)) throw Error("can't serialize event with wrong or missing properties");
		return JSON.stringify([
			0,
			e.pubkey,
			e.created_at,
			e.kind,
			e.tags,
			e.content
		]);
	}(e))));
}
var Uu = new class {
	generateSecretKey() {
		return Or.utils.randomPrivateKey();
	}
	getPublicKey(e) {
		return Pr(Or.getPublicKey(e));
	}
	finalizeEvent(e, t) {
		let n = e;
		return n.pubkey = Pr(Or.getPublicKey(t)), n.id = Hu(n), n.sig = Pr(Or.sign(Hu(n), t)), n[Iu] = !0, n;
	}
	verifyEvent(e) {
		if (typeof e[Iu] == "boolean") return e[Iu];
		let t = Hu(e);
		if (t !== e.id) return e[Iu] = !1, !1;
		try {
			let n = Or.verify(e.sig, t, e.pubkey);
			return e[Iu] = n, n;
		} catch {
			return e[Iu] = !1, !1;
		}
	}
}(), Wu = (Uu.generateSecretKey, Uu.getPublicKey, Uu.finalizeEvent, Uu.verifyEvent);
function Gu(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find((([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1))) return !1;
	}
	return !(e.since && t.created_at < e.since) && !(e.until && t.created_at > e.until);
}
async function Ku() {
	return new Promise(((e) => {
		let t = new MessageChannel(), n = () => {
			t.port1.removeEventListener("message", n), e();
		};
		t.port1.addEventListener("message", n), t.port2.postMessage(0), t.port1.start();
	}));
}
var qu, Ju = (e) => (e[Iu] = !0, !0), Yu = class {
	url;
	_connected = !1;
	onclose = null;
	onnotice = (e) => {};
	_onauth = null;
	baseEoseTimeout = 4400;
	connectionTimeout = 4400;
	publishTimeout = 4400;
	openSubs = /* @__PURE__ */ new Map();
	connectionTimeoutHandle;
	connectionPromise;
	openCountRequests = /* @__PURE__ */ new Map();
	openEventPublishes = /* @__PURE__ */ new Map();
	ws;
	incomingMessageQueue = new Vu();
	queueRunning = !1;
	challenge;
	serial = 0;
	verifyEvent;
	_WebSocket;
	constructor(e, t) {
		this.url = zu(e), this.verifyEvent = t.verifyEvent, this._WebSocket = t.websocketImplementation || WebSocket;
	}
	static async connect(e, t) {
		let n = new Yu(e, t);
		return await n.connect(), n;
	}
	closeAllSubscriptions(e) {
		for (let [t, n] of this.openSubs) n.close(e);
		this.openSubs.clear();
		for (let [t, n] of this.openEventPublishes) n.reject(Error(e));
		this.openEventPublishes.clear();
		for (let [t, n] of this.openCountRequests) n.reject(Error(e));
		this.openCountRequests.clear();
	}
	get connected() {
		return this._connected;
	}
	async connect() {
		return this.connectionPromise ||= (this.challenge = void 0, new Promise(((e, t) => {
			this.connectionTimeoutHandle = setTimeout((() => {
				t("connection timed out"), this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection timed out");
			}), this.connectionTimeout);
			try {
				this.ws = new this._WebSocket(this.url);
			} catch (e) {
				t(e);
				return;
			}
			this.ws.onopen = () => {
				clearTimeout(this.connectionTimeoutHandle), this._connected = !0, e();
			}, this.ws.onerror = (e) => {
				t(e.message || "websocket error"), this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection errored"));
			}, this.ws.onclose = async () => {
				this._connected && (this._connected = !1, this.connectionPromise = void 0, this.onclose?.(), this.closeAllSubscriptions("relay connection closed"));
			}, this.ws.onmessage = this._onmessage.bind(this);
		}))), this.connectionPromise;
	}
	async runQueue() {
		for (this.queueRunning = !0; !1 !== this.handleNext();) await Ku();
		this.queueRunning = !1;
	}
	handleNext() {
		let e = this.incomingMessageQueue.dequeue();
		if (!e) return !1;
		let t = function(e) {
			let t = e.slice(0, 22).indexOf("\"EVENT\"");
			if (t === -1) return null;
			let n = e.slice(t + 7 + 1).indexOf("\"");
			if (n === -1) return null;
			let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
			if (i === -1) return null;
			let a = r + 1 + i;
			return e.slice(r + 1, a);
		}(e);
		if (t) {
			let n = this.openSubs.get(t);
			if (!n) return;
			let r = function(e, t) {
				let n = e.indexOf(`"${t}":`) + 5, r = e.slice(n).indexOf("\"") + n + 1;
				return e.slice(r, r + 64);
			}(e, "id"), i = n.alreadyHaveEvent?.(r);
			if (n.receivedEvent?.(this, r), i) return;
		}
		try {
			let t = JSON.parse(e);
			switch (t[0]) {
				case "EVENT": {
					let e = this.openSubs.get(t[1]), n = t[2];
					this.verifyEvent(n) && function(e, t) {
						for (let n = 0; n < e.length; n++) if (Gu(e[n], t)) return !0;
						return !1;
					}(e.filters, n) && e.onevent(n);
					return;
				}
				case "COUNT": {
					let e = t[1], n = t[2], r = this.openCountRequests.get(e);
					r && (r.resolve(n.count), this.openCountRequests.delete(e));
					return;
				}
				case "EOSE": {
					let e = this.openSubs.get(t[1]);
					if (!e) return;
					e.receivedEose();
					return;
				}
				case "OK": {
					let e = t[1], n = t[2], r = t[3], i = this.openEventPublishes.get(e);
					i && (n ? i.resolve(r) : i.reject(Error(r)), this.openEventPublishes.delete(e));
					return;
				}
				case "CLOSED": {
					let e = t[1], n = this.openSubs.get(e);
					if (!n) return;
					n.closed = !0, n.close(t[2]);
					return;
				}
				case "NOTICE":
					this.onnotice(t[1]);
					return;
				case "AUTH":
					this.challenge = t[1], this._onauth?.(t[1]);
					return;
			}
		} catch {
			return;
		}
	}
	async send(e) {
		if (!this.connectionPromise) throw Error("sending on closed connection");
		this.connectionPromise.then((() => {
			this.ws?.send(e);
		}));
	}
	async auth(e) {
		if (!this.challenge) throw Error("can't perform auth, no challenge was received");
		let t = await e(function(e, t) {
			return {
				kind: 22242,
				created_at: Math.floor(Date.now() / 1e3),
				tags: [["relay", e], ["challenge", t]],
				content: ""
			};
		}(this.url, this.challenge)), n = new Promise(((e, n) => {
			this.openEventPublishes.set(t.id, {
				resolve: e,
				reject: n
			});
		}));
		return this.send("[\"AUTH\"," + JSON.stringify(t) + "]"), n;
	}
	async publish(e) {
		let t = new Promise(((t, n) => {
			this.openEventPublishes.set(e.id, {
				resolve: t,
				reject: n
			});
		}));
		return this.send("[\"EVENT\"," + JSON.stringify(e) + "]"), setTimeout((() => {
			let t = this.openEventPublishes.get(e.id);
			t && (t.reject(/* @__PURE__ */ Error("publish timed out")), this.openEventPublishes.delete(e.id));
		}), this.publishTimeout), t;
	}
	async count(e, t) {
		this.serial++;
		let n = t?.id || "count:" + this.serial, r = new Promise(((e, t) => {
			this.openCountRequests.set(n, {
				resolve: e,
				reject: t
			});
		}));
		return this.send("[\"COUNT\",\"" + n + "\"," + JSON.stringify(e).substring(1)), r;
	}
	subscribe(e, t) {
		let n = this.prepareSubscription(e, t);
		return n.fire(), n;
	}
	prepareSubscription(e, t) {
		this.serial++;
		let n = t.id || "sub:" + this.serial, r = new Xu(this, n, e, t);
		return this.openSubs.set(n, r), r;
	}
	close() {
		this.closeAllSubscriptions("relay connection closed by us"), this._connected = !1, this.ws?.close();
	}
	_onmessage(e) {
		this.incomingMessageQueue.enqueue(e.data), this.queueRunning || this.runQueue();
	}
}, Xu = class {
	relay;
	id;
	closed = !1;
	eosed = !1;
	filters;
	alreadyHaveEvent;
	receivedEvent;
	onevent;
	oneose;
	onclose;
	eoseTimeout;
	eoseTimeoutHandle;
	constructor(e, t, n, r) {
		this.relay = e, this.filters = n, this.id = t, this.alreadyHaveEvent = r.alreadyHaveEvent, this.receivedEvent = r.receivedEvent, this.eoseTimeout = r.eoseTimeout || e.baseEoseTimeout, this.oneose = r.oneose, this.onclose = r.onclose, this.onevent = r.onevent || ((e) => {});
	}
	fire() {
		this.relay.send("[\"REQ\",\"" + this.id + "\"," + JSON.stringify(this.filters).substring(1)), this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
	}
	receivedEose() {
		this.eosed || (clearTimeout(this.eoseTimeoutHandle), this.eosed = !0, this.oneose?.());
	}
	close(e = "closed by caller") {
		!this.closed && this.relay.connected && (this.relay.send("[\"CLOSE\"," + JSON.stringify(this.id) + "]"), this.closed = !0), this.relay.openSubs.delete(this.id), this.onclose?.(e);
	}
}, Zu = class {
	relays = /* @__PURE__ */ new Map();
	seenOn = /* @__PURE__ */ new Map();
	trackRelays = !1;
	verifyEvent;
	trustedRelayURLs = /* @__PURE__ */ new Set();
	_WebSocket;
	constructor(e) {
		this.verifyEvent = e.verifyEvent, this._WebSocket = e.websocketImplementation;
	}
	async ensureRelay(e, t) {
		e = zu(e);
		let n = this.relays.get(e);
		return n || (n = new Yu(e, {
			verifyEvent: this.trustedRelayURLs.has(e) ? Ju : this.verifyEvent,
			websocketImplementation: this._WebSocket
		}), t?.connectionTimeout && (n.connectionTimeout = t.connectionTimeout), this.relays.set(e, n)), await n.connect(), n;
	}
	close(e) {
		e.map(zu).forEach(((e) => {
			this.relays.get(e)?.close();
		}));
	}
	subscribeMany(e, t, n) {
		return this.subscribeManyMap(Object.fromEntries(e.map(((e) => [e, t]))), n);
	}
	subscribeManyMap(e, t) {
		this.trackRelays && (t.receivedEvent = (e, t) => {
			let n = this.seenOn.get(t);
			n || (n = /* @__PURE__ */ new Set(), this.seenOn.set(t, n)), n.add(e);
		});
		let n = /* @__PURE__ */ new Set(), r = [], i = Object.keys(e).length, a = [], o = (e) => {
			a[e] = !0, a.filter(((e) => e)).length === i && (t.oneose?.(), o = () => {});
		}, s = [], c = (e, n) => {
			o(e), s[e] = n, s.filter(((e) => e)).length === i && (t.onclose?.(s), c = () => {});
		}, l = (e) => {
			if (t.alreadyHaveEvent?.(e)) return !0;
			let r = n.has(e);
			return n.add(e), r;
		}, u = Promise.all(Object.entries(e).map((async (e, n, i) => {
			if (i.indexOf(e) !== n) return void c(n, "duplicate url");
			let a, [s, u] = e;
			s = zu(s);
			try {
				a = await this.ensureRelay(s, { connectionTimeout: t.maxWait ? Math.max(.8 * t.maxWait, t.maxWait - 1e3) : void 0 });
			} catch (e) {
				c(n, e?.message || String(e));
				return;
			}
			let d = a.subscribe(u, {
				...t,
				oneose: () => o(n),
				onclose: (e) => c(n, e),
				alreadyHaveEvent: l,
				eoseTimeout: t.maxWait
			});
			r.push(d);
		})));
		return { async close() {
			await u, r.forEach(((e) => {
				e.close();
			}));
		} };
	}
	subscribeManyEose(e, t, n) {
		let r = this.subscribeMany(e, t, {
			...n,
			oneose() {
				r.close();
			}
		});
		return r;
	}
	async querySync(e, t, n) {
		return new Promise((async (r) => {
			let i = [];
			this.subscribeManyEose(e, [t], {
				...n,
				onevent(e) {
					i.push(e);
				},
				onclose(e) {
					r(i);
				}
			});
		}));
	}
	async get(e, t, n) {
		t.limit = 1;
		let r = await this.querySync(e, t, n);
		return r.sort(((e, t) => t.created_at - e.created_at)), r[0] || null;
	}
	publish(e, t) {
		return e.map(zu).map((async (e, n, r) => {
			if (r.indexOf(e) !== n) return Promise.reject("duplicate url");
			let i = await this.ensureRelay(e);
			return i.publish(t).then(((e) => {
				if (this.trackRelays) {
					let e = this.seenOn.get(t.id);
					e || (e = /* @__PURE__ */ new Set(), this.seenOn.set(t.id, e)), e.add(i);
				}
				return e;
			}));
		}));
	}
	listConnectionStatus() {
		let e = /* @__PURE__ */ new Map();
		return this.relays.forEach(((t, n) => e.set(n, t.connected))), e;
	}
	destroy() {
		this.relays.forEach(((e) => e.close())), this.relays = /* @__PURE__ */ new Map();
	}
};
try {
	qu = WebSocket;
} catch {}
var Qu = class extends Zu {
	constructor() {
		super({
			verifyEvent: Wu,
			websocketImplementation: qu
		});
	}
}, $u = new class e {
	static instance = null;
	#e;
	#t;
	#n = !0;
	#r;
	constructor() {
		return e.instance ? e.instance : (this.#i(), e.instance = this, this);
	}
	#i() {
		if (this.#e = q.PROFILE_CONFIG, this.#t = new Qu(), !this.#t?.ensureRelay) throw Error("Failed to initialize SimplePool");
		this.#r = new Fu({
			simplePool: this.#t,
			config: {
				...this.#e,
				RELAYS: this.#e.RELAYS || []
			}
		});
	}
	get isInitialized() {
		return this.#n;
	}
	async fetchProfiles(e) {
		if (!Array.isArray(e) || e.length === 0) return [];
		let t = Date.now(), n = Array(e.length), r = e.reduce(((e, r, i) => {
			let a = J.getProfile(r);
			return this.#a(a, t) ? n[i] = a : e.push({
				index: i,
				pubkey: r
			}), e;
		}), []);
		return r.length > 0 && await this.#s(r, n, e), n;
	}
	async processBatchProfiles(e) {
		let t = this.#o(e);
		if (t.length !== 0) try {
			await Promise.all([this.fetchProfiles(t), ...t.map(((e) => this.verifyNip05Async(e)))]);
		} catch {}
	}
	async verifyNip05Async(e) {
		let t = J.getNip05(e);
		if (t !== void 0) return t;
		let n = J.getNip05PendingFetch(e);
		if (n) return n;
		let r = this.#l(e);
		return J.setNip05PendingFetch(e, r), r;
	}
	getNip05(e) {
		return J.getNip05(e);
	}
	clearCache() {
		J.clearAll(), this.#r.clearPendingFetches();
	}
	#a(e, t) {
		return e && e._lastUpdated && t - e._lastUpdated < 18e5;
	}
	#o(e) {
		return [...new Set(e?.map(((e) => e?.pubkey))?.filter(((e) => e && typeof e == "string" && e.length === 64)))];
	}
	async #s(e, t, n) {
		if (!e.length) return;
		let r = Date.now(), i = e.filter((({ pubkey: e }) => e && typeof e == "string" && e.length === 64));
		if (i.length === 0) return;
		let a = await Promise.all(i.map((({ pubkey: e }) => this.#c(e, r))));
		i.forEach((({ index: e }, r) => {
			e >= 0 && e < t.length && (t[e] = a[r], n[e] && J.setProfile(n[e], a[r]));
		}));
	}
	async #c(e, t) {
		if (!e || typeof e != "string" || e.length !== 64) return this.#u();
		try {
			let n = {
				kinds: [0],
				authors: [e],
				limit: 1
			}, r = await this.#r.getOrCreateFetchPromise(e, n);
			if (!r?.content) return this.#u();
			let i;
			try {
				i = JSON.parse(r.content);
			} catch {
				return this.#u();
			}
			return {
				...i,
				name: xu(i) || "nameless",
				_lastUpdated: t,
				_eventCreatedAt: r.created_at
			};
		} catch {
			return this.#u();
		}
	}
	async #l(e) {
		try {
			let [t] = await this.fetchProfiles([e]);
			if (!t?.nip05) return J.setNip05(e, null), null;
			let n = await Promise.race([Su(t.nip05, e), new Promise(((e, t) => setTimeout((() => t(/* @__PURE__ */ Error("NIP-05 timeout"))), 5e3)))]);
			if (!n) return J.setNip05(e, null), null;
			let r = Tu(n.startsWith("_@") ? n.slice(1) : n);
			return J.setNip05(e, r), r;
		} catch {
			return J.setNip05(e, null), null;
		} finally {
			J.deleteNip05PendingFetch(e);
		}
	}
	#u() {
		return {
			name: "anonymous",
			display_name: "anonymous"
		};
	}
}(), ed = class {
	async loadAndUpdate(e, t) {
		if (e) try {
			let n = t.querySelector(".sender-name"), r = t.querySelector(".zap-placeholder-name"), i = t.querySelector(".sender-icon"), a = i?.querySelector(".zap-placeholder-icon"), o = t.querySelector(".sender-pubkey"), s = J.getProfile(e), c = s ? xu(s) || "nameless" : "anonymous", l = s?.picture ? function(e) {
				if (!e || typeof e != "string") return null;
				try {
					let t = new URL(e);
					return ["http:", "https:"].includes(t.protocol) ? t.href : null;
				} catch {
					return null;
				}
			}(s.picture) : null;
			this.#e(r, n, c), this.#n(a, i, l, c), this.#r(o, e);
		} catch {
			this.#i(t);
		}
	}
	#e(e, t, n) {
		e ? e.replaceWith(Object.assign(document.createElement("span"), {
			className: "sender-name",
			textContent: n
		})) : t && (t.textContent = n);
	}
	#t(e, t = "anonymous user's icon") {
		let n = `https://robohash.org/${e}.png?set=set5&bgset=bg2&size=128x128`, r = J.getImageCache(n), i = Object.assign(document.createElement("img"), {
			alt: t,
			loading: "lazy",
			className: "profile-icon"
		});
		if (r) return i.src = n, i;
		let a = new Image();
		return a.onerror = () => {
			i.src = gu, J.setImageCache(n, gu);
		}, a.onload = () => {
			J.setImageCache(n, a);
		}, a.src = n, i.src = n, i;
	}
	#n(e, t, n, r) {
		if (e && t) {
			let i = (n) => {
				e.remove();
				let i = t.querySelector("img"), a = t.querySelector("a");
				i && i.remove(), a && a.remove();
				let o = n === "robohash" ? this.#t(t.closest("[data-pubkey]")?.dataset.pubkey, `${Tu(r)}'s icon`) : Object.assign(document.createElement("img"), {
					src: n,
					alt: `${Tu(r)}'s icon`,
					loading: "lazy",
					className: "profile-icon"
				}), s = t.closest("[data-pubkey]")?.dataset.pubkey;
				if (s) {
					let e = function(e, t = []) {
						try {
							return window.NostrTools.nip19.nprofileEncode({
								pubkey: e,
								relays: t
							});
						} catch {
							return null;
						}
					}(s), n = Object.assign(document.createElement("a"), {
						href: `https://njump.me/${e}`,
						target: "_blank",
						rel: "noopener noreferrer"
					});
					n.appendChild(o), t.appendChild(n);
				} else t.appendChild(o);
			};
			if (n) {
				let e = new Image();
				e.onload = () => {
					J.setImageCache(n, e), i(n);
				}, e.onerror = () => {
					i("robohash");
				}, e.src = n;
			} else i("robohash");
		}
	}
	#r(e, t) {
		if (e && !e.getAttribute("data-nip05-updated")) {
			let n = $u.getNip05(t);
			n ? (e.textContent = n, e.setAttribute("data-nip05-updated", "true")) : $u.verifyNip05Async(t).then(((t) => {
				t && (e.textContent = t, e.setAttribute("data-nip05-updated", "true"));
			}));
		}
	}
	#i(e) {
		let t = e.querySelector(".zap-placeholder-icon");
		if (t) {
			let n = t.parentElement, r = e.closest("[data-pubkey]")?.dataset.pubkey;
			t.remove(), n.appendChild(this.#t(r));
		}
	}
	async updateProfileElement(e, t) {
		if (!e || !t) return;
		let n = e.querySelector(".sender-icon img, .zap-placeholder-icon");
		if (n) {
			if (t.picture) {
				let r = document.createElement("img");
				r.alt = t.name || "Profile Picture", r.width = 32, r.height = 32, r.className = "profile-icon", r.onerror = () => {
					let n = e.getAttribute("data-pubkey");
					if (n) {
						let e = this.#t(n, t.name || "anonymous user");
						r.parentElement && r.parentElement.replaceChild(e, r);
					}
				}, r.src = t.picture, n.parentElement && n.parentElement.replaceChild(r, n);
			} else {
				let r = e.getAttribute("data-pubkey");
				if (r) {
					let e = this.#t(r, t.name || "anonymous user");
					n.parentElement && n.parentElement.replaceChild(e, n);
				}
			}
		}
		let r = e.querySelector(".sender-name, .zap-placeholder-name");
		if (r && (r.textContent = t.display_name || t.name || "anonymous", r.className = "sender-name"), t.nip05) {
			let t = e.getAttribute("data-pubkey");
			if (t) {
				let n = e.querySelector("[data-nip05-target=\"true\"]");
				n && await this.updateNip05Display(t, n);
			}
		}
	}
}, td = class e {
	static #e = {
		1: "content",
		30023: "title",
		30030: "title",
		30009: "name",
		40: "content",
		42: "name",
		31990: "alt"
	};
	static createUIComponents(e, t, n) {
		try {
			let r = this.viewConfigs?.get(t), i = n || r?.identifier, a = Du(i) ? null : this.#o(e);
			return {
				iconComponent: this.#t(),
				nameComponent: this.#c(e),
				pubkeyComponent: this.#l(e, i),
				referenceComponent: this.#u(a)
			};
		} catch {
			return this.#n();
		}
	}
	static #t() {
		return "<div class=\"zap-placeholder-icon skeleton\"></div>";
	}
	static #n() {
		return {
			iconComponent: "<div class=\"zap-placeholder-icon skeleton\"></div>",
			nameComponent: "<div class=\"zap-placeholder-name skeleton\"></div>",
			pubkeyComponent: "",
			referenceComponent: ""
		};
	}
	static createReferenceComponent(e) {
		return this.#u(this.#o({ reference: e }));
	}
	static addReferenceToElement(e, t) {
		if (!this.#r(e, t)) return;
		let n = e.querySelector(".zap-content");
		this.#i(n, t);
	}
	static #r(e, t) {
		return e && t && e.querySelector(".zap-content");
	}
	static #i(e, t) {
		e.querySelectorAll(".zap-reference").forEach(((e) => e.remove()));
		let n = this.createReferenceComponent({ reference: t });
		e.insertAdjacentHTML("beforeend", n);
	}
	static getDialogTemplate() {
		return "\n      <dialog class=\"dialog\">\n        <h2 class=\"dialog-title\"><a href=\"#\" target=\"_blank\"></a></h2>\n        <button class=\"close-dialog-button\">X</button>\n        <div class=\"zap-stats\"></div>\n        <ul class=\"dialog-zap-list\"></ul>\n      </dialog>\n    ";
	}
	static createZapItemHTML(e, t, n, r) {
		try {
			let i = this.createUIComponents(e, n, r);
			return this.#a(e, t, i);
		} catch {
			return "";
		}
	}
	static createNoZapsMessageHTML(e) {
		return `\n      <div class="no-zaps-container">\n        <div class="no-zaps-message">${e}</div>\n      </div>\n    `;
	}
	static #a(e, t, n) {
		let [r, i] = e.satsText.split(" "), a = (o = e.created_at, Math.floor(Date.now() / 1e3) - o < 86400);
		var o;
		return `\n      <div class="zap-content">\n        <div class="zap-sender${e.comment ? " with-comment" : ""}" data-pubkey="${e.pubkey}">\n          <div class="sender-icon${a ? " is-new" : ""}">\n            ${n.iconComponent}\n          </div>\n          <div class="sender-info">\n            ${n.nameComponent}\n            ${n.pubkeyComponent}\n          </div>\n          <div class="zap-amount ${t}"><span class="number">${r}</span> ${i}</div>\n        </div>\n        ${e.comment ? `<div class="zap-details"><span class="zap-comment">${Tu(e.comment)}</span></div>` : ""}\n        ${n.referenceComponent}\n      </div>\n    `;
	}
	static #o(e) {
		if (!e) return null;
		if (this.#s(e)) return e;
		if (e.reference && typeof e.reference == "object") {
			if (e.reference.reference && this.#s(e.reference.reference)) return e.reference.reference;
			if (this.#s(e.reference)) return e.reference;
		}
		return null;
	}
	static #s(e) {
		return e && typeof e == "object" && "id" in e && "tags" in e && Array.isArray(e.tags) && "content" in e && "kind" in e;
	}
	static #c({ senderName: e }) {
		return e ? `<span class="sender-name">${Tu(e)}</span>` : "<div class=\"zap-placeholder-name skeleton\"></div>";
	}
	static #l({ pubkey: e, displayIdentifier: t, reference: n }, r) {
		let i = !Du(r), a = `class="sender-pubkey" data-pubkey="${e}"`;
		return n && i ? `<span ${a}>${t}</span>` : `<span ${a} data-nip05-target="true">${t}</span>`;
	}
	static #u(e) {
		if (!this.#s(e)) return "";
		let t = e.id, n = J.getReferenceComponent(t);
		if (n) return n;
		try {
			let n = this.#d(e), r = this.#p(e), i = this.#m(n, r);
			return J.setReferenceComponent(t, i), i;
		} catch {
			return "";
		}
	}
	static #d(e) {
		if (!e?.tags) return "";
		if (e.kind === 31990) return this.#f(e) || "";
		let t = Array.isArray(e.tags) ? e.tags.find(((e) => Array.isArray(e) && e[0] === "d")) : null;
		return t ? `https://njump.me/${function(e, t, n, r = []) {
			try {
				return window.NostrTools.nip19.naddrEncode({
					kind: e,
					pubkey: t,
					identifier: n,
					relays: r
				});
			} catch {
				return null;
			}
		}(e.kind, e.pubkey, t[1])}` : e.id ? `https://njump.me/${function(e, t, n, r = []) {
			try {
				return window.NostrTools.nip19.neventEncode({
					id: e,
					kind: t,
					pubkey: n,
					relays: r
				});
			} catch {
				return null;
			}
		}(e.id, e.kind, e.pubkey)}` : "";
	}
	static #f(e) {
		let t = e.tags.filter(((e) => e[0] === "r"));
		return (t.find(((e) => !e.includes("source"))) || t[0])?.[1];
	}
	static #p(t) {
		if (!t) return "";
		let n = e.#e[t.kind];
		if (n) {
			let e = t.tags.find(((e) => Array.isArray(e) && e[0] === n));
			if (e && e[1]) return e[1];
		}
		if (t.kind === 40) try {
			return JSON.parse(t.content).name || t.content;
		} catch {}
		return t.content || "";
	}
	static #m(e, t) {
		return `\n      <div class="zap-reference">\n        <div class="reference-arrow">\n          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aCBkPSJtNTYwLTEyMC01Ny01NyAxNDQtMTQzSDIwMHYtNDgwaDgwdjQwMGgzNjdMNTAzLTU0NGw1Ni01NyAyNDEgMjQxLTI0MCAyNDBaIiAvPg0KPC9zdmc+" alt="Reference" width="18" height="18" />\n        </div>\n        <div class="reference-text">${Tu(t)}</div>\n        <a href="${e}" target="_blank" class="reference-link">\n          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNNDQwLTI4MEgyODBxLTgzIDAtMTQxLjUtNTguNVQ4MC00ODBxMC04MyA1OC41LTE0MS41VDI4MC02ODBoMTYwdjgwSDI4MHEtNTAgMC04NSAzNXQtMzUgODVxMCA1MCAzNSA4NXQ4NSAzNWgxNjB2ODBaTTMyMC00NDB2LTgwaDMyMHY4MEgzMjBabTIwMCAxNjB2LTgwaDE2MHE1MCAwIDg1LTM1dDM1LTg1cTAtNTAtMzUtODV0LTg1LTM1SDUyMHYtODBoMTYwcTgzIDAgMTQxLjUgNTguNVQ4ODAtNDgwcTAgODMtNTguNSAxNDEuNVQ2ODAtMjgwSDUyMFoiIC8+DQo8L3N2Zz4=" alt="Quick Reference" width="16" height="16" />\n        </a>\n      </div>\n    `;
	}
	static ZapInfo = class {
		#h;
		constructor(e) {
			this.#h = e;
		}
		static async createFromEvent(t, n = {}) {
			return await new e.ZapInfo(t).extractInfo(n);
		}
		static getAmountColorClass(e, t) {
			return (t === void 0 ? q.ZAP_AMOUNT_CONFIG.DEFAULT_COLOR_MODE : t) ? this.#g(e) : q.ZAP_AMOUNT_CONFIG.DISABLED_CLASS;
		}
		static #g(e) {
			let { THRESHOLDS: t, DEFAULT_CLASS: n } = q.ZAP_AMOUNT_CONFIG;
			return t.find(((t) => e >= t.value))?.className || n;
		}
		async extractInfo(t = {}) {
			let n = this.#h.id, r = J.getZapInfo(n);
			if (r) return r.colorClass = e.ZapInfo.getAmountColorClass(r.satsAmount, t.isColorModeEnabled), r;
			try {
				let { pubkey: r, content: i, satsText: a } = await Ou(this.#h), o = parseInt(a.replace(/,/g, "").split(" ")[0], 10), s = typeof r == "string" ? r : null, c = this.#h.reference || null, l = {
					satsText: a,
					satsAmount: o,
					comment: i || "",
					pubkey: s || "",
					created_at: this.#h.created_at,
					displayIdentifier: s ? wu(Eu(s)) : "anonymous",
					senderName: null,
					senderIcon: null,
					reference: c,
					colorClass: e.ZapInfo.getAmountColorClass(o, t?.isColorModeEnabled)
				};
				return J.setZapInfo(n, l), l;
			} catch {
				let e = {
					satsText: "Amount: Unknown",
					satsAmount: 0,
					comment: "",
					pubkey: "",
					created_at: this.#h.created_at,
					displayIdentifier: "anonymous",
					senderName: "anonymous",
					senderIcon: i,
					reference: null
				};
				return J.setZapInfo(n, e), e;
			}
			var i;
		}
		static async batchExtractInfo(t, n = !0) {
			let r = /* @__PURE__ */ new Map();
			return await Promise.all(t.map((async (t) => {
				let i = await new e.ZapInfo(t).extractInfo({ isColorModeEnabled: n });
				r.set(t.id, i);
			}))), r;
		}
	};
	static viewConfigs = /* @__PURE__ */ new Map();
}, nd = class {
	constructor(e, t) {
		this.viewId = e, this.config = t;
	}
	async createListItem(e) {
		let t = await td.ZapInfo.createFromEvent(e, { isColorModeEnabled: this.config?.isColorModeEnabled }), n = document.createElement("li");
		return n.className = `zap-list-item ${t.colorClass}${t.comment ? " with-comment" : ""}`, n.setAttribute("data-pubkey", t.pubkey), e?.id && n.setAttribute("data-event-id", e.id), n.innerHTML = td.createZapItemHTML(t, t.colorClass, this.viewId), n.setAttribute("data-timestamp", e.created_at.toString()), {
			li: n,
			zapInfo: t
		};
	}
}, rd = class {
	constructor(e, t, n, r) {
		if (!e) throw Error("shadowRoot is required");
		if (!r) throw Error("config is required");
		this.shadowRoot = e, this.profileUI = t, this.viewId = n, this.config = r, this.itemBuilder = new nd(n, this.config), this.profileUpdateUnsubscribe = null, this.#f();
	}
	destroy() {
		this.profileUpdateUnsubscribe &&= (this.profileUpdateUnsubscribe(), null);
		let e = this.#e(".dialog-zap-list");
		e && (e.innerHTML = "");
	}
	#e(e) {
		return this.shadowRoot.querySelector(e);
	}
	getElementByEventId(e) {
		return this.#e(`.zap-list-item[data-event-id="${e}"]`);
	}
	async #t(e) {
		let t = this.#e(".dialog-zap-list");
		if (t) try {
			return this.#r(t), await e(t);
		} catch {
			t.children.length === 0 && this.showNoZapsMessage();
		}
	}
	#n(e, t) {
		let n = e.querySelector(".load-more-trigger");
		n && n.remove(), Array.from(t.children).forEach(((t) => {
			let n = t.getAttribute("data-event-id"), r = parseInt(t.getAttribute("data-timestamp")), i = null, a = Array.from(e.children);
			for (let e = 0; e < a.length; e++) if (r > parseInt(a[e].getAttribute("data-timestamp"))) {
				i = a[e];
				break;
			}
			e.querySelector(`.zap-list-item[data-event-id="${n}"]`) || (i ? e.insertBefore(t, i) : e.appendChild(t));
		})), n && e.appendChild(n);
	}
	#r(e) {
		let t = e.querySelector(".no-zaps-message");
		t && t.remove();
	}
	async #i(e, t) {
		return this.#t((async (n) => {
			let { li: r, zapInfo: i } = await this.itemBuilder.createListItem(e);
			return t(n, r), await this.#h(i.pubkey, r), {
				li: r,
				zapInfo: i
			};
		}));
	}
	async renderZapListFromCache(e) {
		if (!e?.length) return J.setNoZapsState(this.viewId, !1), this.showNoZapsMessage();
		await this.#t((async (t) => {
			let { initialBatch: n, remainingBatch: r } = this.#a(e), { fragment: i, profileUpdates: a } = await this.#o(n);
			this.#n(t, i), r.length > 0 ? this.#s(r, t, a) : await this.#m(a);
		}));
	}
	#a(e) {
		let t = this.#_(e), n = q.DIALOG_CONFIG.ZAP_LIST.INITIAL_BATCH;
		return {
			initialBatch: t.slice(0, n),
			remainingBatch: t.slice(n)
		};
	}
	async #o(e) {
		let t = document.createDocumentFragment(), n = [];
		for (let r of e) {
			let { li: e, zapInfo: i } = await this.itemBuilder.createListItem(r);
			this.#v(r.id, e), t.appendChild(e), i.pubkey && n.push({
				pubkey: i.pubkey,
				element: e
			});
		}
		return {
			fragment: t,
			profileUpdates: n
		};
	}
	#s(e, t, n) {
		if (!e.length) return;
		let r = q.DIALOG_CONFIG.ZAP_LIST.REMAINING_BATCH, i = 0, a = async () => {
			if (i >= e.length) return void await this.#m(n);
			let o = e.slice(i, i + r);
			await this.#c(o, t, n), i += r, setTimeout((() => a()), 0);
		};
		requestIdleCallback((() => a()));
	}
	async #c(e, t, n) {
		let r = document.createDocumentFragment();
		await Promise.all(e.map((async (e) => {
			let { li: t, zapInfo: i } = await this.itemBuilder.createListItem(e);
			this.#v(e.id, t), r.appendChild(t), i.pubkey && n.push({
				pubkey: i.pubkey,
				element: t
			});
		})));
		let i = t.querySelector(".load-more-trigger");
		i && i.remove(), t.appendChild(r), i && t.appendChild(i), await new Promise(((e) => requestAnimationFrame(e)));
	}
	async prependZap(e) {
		return this.#i(e, ((e, t) => e.prepend(t)));
	}
	async appendZap(e) {
		return this.#i(e, ((t, n) => {
			let r = this.#d(t, e.created_at);
			r ? t.insertBefore(n, r) : t.appendChild(n);
		}));
	}
	async replacePlaceholderWithZap(e, t) {
		let n = this.#e(`[data-index="${t}"]`);
		if (this.#y(n)) try {
			let { zapInfo: t } = await this.itemBuilder.createListItem(e);
			this.#b(n, t, e.id), await this.#h(t.pubkey, n);
		} catch {
			n.remove();
		}
	}
	async showNoZapsMessage() {
		let e = this.#e(".dialog-zap-list");
		if (e) {
			if (J.hasNoZaps(this.viewId)) return void this.#u(e);
			await this.#l() || (this.#u(e), J.setNoZapsState(this.viewId, !0));
		}
	}
	async #l() {
		let e = this.config.noZapsDelay || q.DIALOG_CONFIG.DEFAULT_NO_ZAPS_DELAY;
		await new Promise(((t) => setTimeout(t, e)));
		let t = J.getZapEvents(this.viewId);
		return !!t?.length && (await this.renderZapListFromCache(t), !0);
	}
	#u(e) {
		let t = this.config.noZapsMessage || q.DIALOG_CONFIG.NO_ZAPS_MESSAGE;
		e.innerHTML = td.createNoZapsMessageHTML(t), e.style.minHeight = q.DIALOG_CONFIG.ZAP_LIST.MIN_HEIGHT;
	}
	async batchUpdate(e, t = {}) {
		let n = this.#e(".dialog-zap-list");
		if (n) try {
			let r = new Map(Array.from(n.querySelectorAll(".zap-list-item")).map(((e) => [e.getAttribute("data-event-id"), e]))), i = this.#_(e), a = Du(this.config.identifier), o = i.filter(((e) => {
				let t = r.get(e.id);
				return a ? !t : !t || e.reference && !t.querySelector(".zap-reference");
			}));
			if (o.length === 0 && !t.isFullUpdate) return;
			let s = document.createDocumentFragment();
			for (let e of o) {
				let { li: t, zapInfo: n } = await this.itemBuilder.createListItem(e);
				!a && e.reference && this.updateZapReference(e), s.appendChild(t), n.pubkey && await this.#h(n.pubkey, t);
			}
			this.#n(n, s);
		} catch {}
	}
	#d(e, t) {
		return Array.from(e.children).find(((e) => t > parseInt(e.getAttribute("data-timestamp") || "0")));
	}
	updateZapReference(e) {
		if (e?.id && e?.reference) try {
			let t = this.getElementByEventId(e.id);
			if (!t) return;
			td.addReferenceToElement(t, e.reference), J.setReference(e.id, e.reference);
		} catch {}
	}
	#f() {
		this.profileUpdateUnsubscribe = J.subscribeToProfileUpdates(this.#p.bind(this));
	}
	async #p(e, t) {
		let n = this.shadowRoot.querySelectorAll(`[data-pubkey="${e}"]`);
		await Promise.allSettled(Array.from(n).map(((e) => this.profileUI.updateProfileElement(e, t))));
	}
	async #m(e) {
		let t = q.DIALOG_CONFIG.ZAP_LIST.PROFILE_BATCH;
		for (let n = 0; n < e.length; n += t) {
			let r = e.slice(n, n + t);
			await Promise.all(r.map((({ pubkey: e, element: t }) => this.#h(e, t)))), await new Promise(((e) => requestAnimationFrame(e)));
		}
	}
	async #h(e, t) {
		e && await this.#g(e, t);
	}
	async #g(e, t) {
		if (e && t) try {
			await this.profileUI.loadAndUpdate(e, t);
		} catch {}
	}
	#_(e) {
		return [...new Map(e.map(((e) => [e.id, e]))).values()].sort(((e, t) => t.created_at - e.created_at));
	}
	#v(e, t) {
		if (Du(this.config.identifier)) return;
		let n = J.getReference(e);
		n && td.addReferenceToElement(t, n);
	}
	#y(e) {
		return e && e.classList.contains("placeholder");
	}
	#b(e, t, n) {
		let r = this.itemBuilder.getAmountColorClass(t.satsAmount);
		e.className = `zap-list-item ${r}${t.comment ? " with-comment" : ""}`, e.setAttribute("data-pubkey", t.pubkey), e.setAttribute("data-event-id", n), e.innerHTML = td.createZapItemHTML(t, r, this.viewId), e.removeAttribute("data-index");
	}
}, id = Rt(0), ad = Rt.n(id), od = new class {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	constructor() {}
	async getZapStats(e, t) {
		let n = await this.#n(t, e);
		if (n) return n;
		let r = await this.fetchStats(e);
		return r && J.updateStatsCache(t, e, r), r;
	}
	async fetchStats(e) {
		try {
			let t = await this._fetchFromApi(e);
			return this._formatStats(t) || this.createTimeoutError();
		} catch (e) {
			return this.handleFetchError(e);
		}
	}
	createTimeoutError() {
		return {
			error: !0,
			timeout: !0
		};
	}
	handleFetchError(e) {
		return {
			error: !0,
			timeout: e.message === "STATS_TIMEOUT"
		};
	}
	async _fetchFromApi(e) {
		let t = ku(e);
		if (!t) return null;
		let n = `https://api.nostr.band/v0/stats/${t.type === "npub" || t.type === "nprofile" ? "profile" : "event"}/${e}`, r = new AbortController(), i = setTimeout((() => r.abort()), q.REQUEST_CONFIG.REQUEST_TIMEOUT);
		try {
			return await (await fetch(n, { signal: r.signal })).json();
		} catch (e) {
			throw e.name === "AbortError" ? Error("STATS_TIMEOUT") : e;
		} finally {
			clearTimeout(i);
		}
	}
	_formatStats(e) {
		if (!e?.stats) return null;
		let t = Object.values(e.stats)[0];
		return t ? {
			count: parseInt(t.zaps_received?.count || t.zaps?.count || 0, 10),
			msats: parseInt(t.zaps_received?.msats || t.zaps?.msats || 0, 10),
			maxMsats: parseInt(t.zaps_received?.max_msats || t.zaps?.max_msats || 0, 10)
		} : null;
	}
	async initializeStats(e, t, n = !1) {
		if (n && this.displayStats({ skeleton: !0 }, t), this.#t.has(t)) return this.#t.get(t);
		if (ku(e)?.type === "naddr") {
			let e = this.createTimeoutError();
			return this.displayStats(e, t), this.#e.set(t, e), e;
		}
		let r = (async () => {
			try {
				let n = await this.getZapStats(e, t);
				return n && (this.displayStats(n, t), this.#e.set(t, n)), n;
			} catch {
				return null;
			} finally {
				this.#t.delete(t);
			}
		})();
		return this.#t.set(t, r), r;
	}
	async #n(e, t) {
		let n = J.getCachedStats(e, t);
		return n && Date.now() - n.timestamp < q.REQUEST_CONFIG.CACHE_DURATION ? n.stats : null;
	}
	getCurrentStats(e) {
		return this.#e.get(e);
	}
	async handleZapEvent(e, t, n) {
		if (e?.isRealTimeEvent) try {
			let r = e.tags.find(((e) => e[0].toLowerCase() === "bolt11"))?.[1], i = this.extractAmountFromBolt11(r);
			if (i <= 0) return;
			let a = J.getViewStats(t), o = {
				count: a?.count || 0,
				msats: a?.msats || 0,
				maxMsats: a?.maxMsats || 0
			}, s = {
				count: o.count + 1,
				msats: o.msats + i,
				maxMsats: Math.max(o.maxMsats, i)
			};
			J.updateStatsCache(t, n, s), this.#e.set(t, s), await this.displayStats(s, t), e.isStatsCalculated = !0, e.amountMsats = i;
		} catch {}
	}
	extractAmountFromBolt11(e) {
		try {
			let t = window.decodeBolt11(e);
			return parseInt(t.sections.find(((e) => e.name === "amount"))?.value ?? "0", 10);
		} catch {
			return 0;
		}
	}
	async displayStats(e, t) {
		try {
			await fd(e, t);
		} catch {}
	}
}(), sd = new class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	constructor() {
		this.#e = new Qu(), this.#s(), this.#c();
	}
	#s() {
		this.#n = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new Map(), this.#i = /* @__PURE__ */ new Map(), this.#t = !1;
	}
	#c() {
		let e = {
			pool: this.#e,
			batchSize: q.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_SIZE,
			batchDelay: q.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_DELAY
		};
		this.#a = new Nu(e), this.#o = new Pu(e);
	}
	#l(e) {
		this.#n.has(e) || this.#n.set(e, { zap: null }), this.#r.has(e) || this.#r.set(e, { isZapClosed: !1 });
	}
	#u(e, t, n, r) {
		this.#n.get(e).zap = this.#e.subscribeMany(t.relayUrls, [n.req], r);
	}
	#d(e) {
		return e && e.id && Array.isArray(e.tags);
	}
	#f(e, t) {
		return e && this.#i.delete(e), null;
	}
	async connectToRelays(e) {
		this.#t ||= ([this.#a, this.#o].forEach(((t) => t.setRelayUrls(e))), !0);
	}
	subscribeToZaps(e, t, n, r) {
		try {
			this.#p(n), this.#l(e), this.#r.get(e).isZapClosed = !1, this.#u(e, t, n, this.#m(r));
		} catch (e) {
			this.#h("Subscription error", e);
		}
	}
	#p(e) {
		if (!e?.req?.kinds || !Array.isArray(e.req.kinds)) throw Error("Invalid subscription settings");
	}
	async fetchReference(e, t, n) {
		try {
			if (!this.#d(t)) return null;
			let e = t.tags.find(((e) => Array.isArray(e) && e[0] === n));
			if (!e) return null;
			let r = n === "e" ? e[1] : `${e[1]}`, i = J.getReference(r);
			if (i) return i;
			let a = this.#i.get(r);
			if (a) return a;
			let o = n === "e" ? this.#a : this.#o;
			try {
				let e = await o.getOrCreateFetchPromise(r);
				return e && J.setReference(r, e), this.#i.delete(r), e;
			} finally {
				this.#i.delete(r);
			}
		} catch (e) {
			return this.#f(t?.id, e);
		}
	}
	#m(e) {
		let t = Math.floor(Date.now() / 1e3);
		return {
			...e,
			onevent: (n) => {
				n.isRealTimeEvent = n.created_at >= t, e.onevent(n);
			},
			oneose: e.oneose
		};
	}
	#h(e, t) {
		throw t;
	}
	get zapPool() {
		return this.#e;
	}
}(), { zapPool: cd } = sd, ld = new class {
	constructor() {
		this.viewConfigs = /* @__PURE__ */ new Map(), this.configStore = /* @__PURE__ */ new Map(), this.observers = /* @__PURE__ */ new Map(), this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new Map();
	}
	#e;
	#t;
	setZapListUI(e) {
		this.zapListUI = e;
	}
	setViewConfig(e, t) {
		this.viewConfigs.set(e, t), td.viewConfigs.set(e, t), J.initializeZapView(e);
	}
	getViewConfig(e) {
		return this.viewConfigs.get(e);
	}
	async updateEventReference(e, t) {
		try {
			let n = this.getViewConfig(t);
			if (!n?.relayUrls?.length || Du(n?.identifier || "")) return !1;
			let r = await this._fetchEventReference(e, n);
			return !!r && (e.reference = r, !0);
		} catch {
			return !1;
		}
	}
	async _fetchEventReference(e, t) {
		let n = async () => {
			if (!e?.tags || !Array.isArray(e.tags)) return null;
			try {
				if (e.tags.find(((e) => Array.isArray(e) && e[0] === "a"))?.[1]) return await sd.fetchReference(t.relayUrls, e, "a");
				let n = e.tags.find(((e) => Array.isArray(e) && e[0] === "e"));
				return n?.[1] && /^[0-9a-f]{64}$/.test(n[1].toLowerCase()) ? await sd.fetchReference(t.relayUrls, e, "e") : null;
			} catch {
				return null;
			}
		};
		try {
			return await J.getOrFetchReference(e.id, n);
		} catch {
			return null;
		}
	}
	async updateEventReferenceBatch(e, t) {
		let n = this.getViewConfig(t);
		if (!n?.relayUrls?.length || Du(n?.identifier || "")) return;
		let r = e.map(((e) => this.updateEventReference(e, t)));
		await Promise.allSettled(r);
	}
	updateUIReferences(e) {
		this.zapListUI && e.forEach(((e) => {
			e.reference && this.zapListUI.updateZapReference(e);
		}));
	}
	async initializeSubscriptions(e, t) {
		try {
			if (!this._isValidFilter(e)) throw Error("Invalid filter settings");
			let n = bu(e.identifier);
			if (!n) throw Error(q.ZAP_CONFIG.ERRORS.DECODE_FAILED);
			this._initializeLoadState(t), this._showInitialLoadingSpinner(t);
			let { batchEvents: r, lastEventTime: i } = await this._collectInitialEvents(t, e, n);
			r?.length > 0 && this._processBatchEvents(r, t).catch(console.error), await this.finalizeInitialization(t, i);
		} catch (e) {
			throw e;
		}
	}
	_showInitialLoadingSpinner(e) {
		let t = this._getListElement(e);
		if (t) {
			let e = this._createLoadTrigger();
			t.appendChild(e);
		}
	}
	async finalizeInitialization(e, t) {
		let n = J.getZapEvents(e), r = this._getListElement(e), i = J.updateLoadState(e, {
			isInitialFetchComplete: !0,
			lastEventTime: t
		});
		await Promise.all([
			i,
			n.length === 0 ? this.zapListUI?.showNoZapsMessage() : null,
			n.length >= q.REQ_CONFIG.INITIAL_LOAD_COUNT ? this.setupInfiniteScroll(e) : null
		]), r?.querySelector(".load-more-trigger")?.remove();
	}
	_initializeLoadState(e) {
		J.updateLoadState(e, {
			isInitialFetchComplete: !1,
			lastEventTime: null,
			isLoading: !1
		});
	}
	_isValidFilter(e) {
		return e && e.relayUrls && Array.isArray(e.relayUrls) && e.relayUrls.length > 0 && e.identifier;
	}
	setupInfiniteScroll(e) {
		try {
			this._cleanupInfiniteScroll(e);
			let t = this._getListElement(e);
			if (!t) return;
			let n = this._createLoadTrigger();
			t.appendChild(n), this._observeLoadTrigger(n, e, t);
		} catch {}
	}
	_createLoadTrigger() {
		let e = document.createElement("div");
		e.className = "load-more-trigger";
		let t = document.createElement("div");
		return t.className = "loading-spinner", e.appendChild(t), e;
	}
	_observeLoadTrigger(e, t, n) {
		let r = new IntersectionObserver(((e) => this._handleIntersection(e[0], t)), {
			root: n,
			rootMargin: q.INFINITE_SCROLL.ROOT_MARGIN,
			threshold: q.INFINITE_SCROLL.THRESHOLD
		});
		r.observe(e), this.observers.set(t, r);
	}
	async _handleIntersection(e, t) {
		e.isIntersecting && (J.getLoadState(t).isLoading ? setTimeout((() => {
			e.isIntersecting && this._handleIntersection(e, t);
		}), q.INFINITE_SCROLL.RETRY_DELAY) : this.loadMoreZaps(t).then(((e) => {
			e === 0 && this._cleanupInfiniteScroll(t);
		})).catch(((e) => {
			this._cleanupInfiniteScroll(t);
		})));
	}
	_cleanupInfiniteScroll(e) {
		let t = this.observers.get(e);
		t && (t.disconnect(), this._getListElement(e)?.querySelector(".load-more-trigger")?.remove(), this.observers.delete(e));
	}
	_getListElement(e) {
		return document.querySelector(`nzv-dialog[data-view-id="${e}"]`)?.shadowRoot?.querySelector(".dialog-zap-list");
	}
	async loadMoreZaps(e) {
		let t = J.getLoadState(e), n = this.getViewConfig(e);
		if (!this._canLoadMore(t, n)) return 0;
		t.isLoading = !0;
		try {
			let r = await this._executeLoadMore(e, t, n);
			if (r > 0) {
				let t = J.getZapEvents(e).slice(-r);
				await this.updateEventReferenceBatch(t, e), this.updateUIReferences(t);
			}
			return r;
		} finally {
			t.isLoading = !1;
		}
	}
	async _executeLoadMore(e, t, n) {
		let r = bu(n.identifier, t.lastEventTime);
		if (!r) return 0;
		let i = [], a = setTimeout((() => {
			i.length === 0 && this._cleanupInfiniteScroll(e);
		}), q.LOAD_TIMEOUT);
		try {
			return await this._collectEvents(e, n, r, i, q.REQ_CONFIG.ADDITIONAL_LOAD_COUNT, t), i.length > 0 && await this._processBatchEvents(i, e), i.length;
		} catch {
			return 0;
		} finally {
			clearTimeout(a);
		}
	}
	async _collectEvents(e, t, n, r, i, a) {
		return new Promise(((o, s) => {
			let c = setTimeout((() => s(/* @__PURE__ */ Error("Load timeout"))), q.LOAD_TIMEOUT);
			sd.subscribeToZaps(e, t, n, {
				onevent: (e) => {
					e.created_at < a.lastEventTime && (r.push(e), a.lastEventTime = Math.min(a.lastEventTime, e.created_at), r.length >= i && (clearTimeout(c), o()));
				},
				oneose: () => {
					clearTimeout(c), o();
				}
			});
		}));
	}
	async _collectInitialEvents(e, t, n) {
		let r = [], i = null;
		return new Promise(((a) => {
			let o = this._setupBufferInterval(r, e), s = sd.subscribeToZaps(e, t, n, {
				onevent: (t) => {
					let n = this._handleInitialEvent(t, r, i, e);
					n !== null && (i = n);
				},
				oneose: () => {
					clearInterval(o), a({
						batchEvents: [...r],
						lastEventTime: i
					});
				}
			});
			this.#e.set(e, { zap: s });
		}));
	}
	_handleInitialEvent(e, t, n, r) {
		let i = Math.min(n || e.created_at, e.created_at);
		if (J.addZapEvent(r, e)) {
			if (t.push(e), this.updateEventReference(e, r).then(((t) => {
				t && this.zapListUI && e.reference && this.zapListUI.updateZapReference(e);
			})), e.isRealTimeEvent) {
				let t = this.getViewConfig(r);
				od.handleZapEvent(e, r, t?.identifier), this.zapListUI && this.zapListUI.prependZap(e).catch(console.error);
			}
			t.length >= q.BATCH_SIZE && this.zapListUI && this.zapListUI.batchUpdate(J.getZapEvents(r)).catch(console.error);
		}
		return i;
	}
	async _processBatchEvents(e, t) {
		if (e?.length) {
			e.sort(((e, t) => t.created_at - e.created_at)), e.forEach(((e) => J.addZapEvent(t, e)));
			try {
				await Promise.all([$u.processBatchProfiles(e)]);
			} catch {}
			await this._updateUI(e, t);
		}
	}
	async _updateUI(e, t) {
		this.zapListUI && await this.zapListUI.batchUpdate(e, { isFullUpdate: !0 });
	}
	_setupBufferInterval(e, t) {
		let n = 0, r = q.BUFFER_MIN_INTERVAL;
		return setInterval((() => {
			let i = Date.now();
			e.length > 0 && i - n >= r && this.zapListUI && (this.zapListUI.batchUpdate(J.getZapEvents(t), { isBufferUpdate: !0 }).catch(console.error), n = i);
		}), q.BUFFER_INTERVAL);
	}
	_canLoadMore(e, t) {
		return t && !e.isLoading && e.lastEventTime;
	}
	unsubscribe(e) {
		try {
			let t = this.#e.get(e);
			t?.zap && (t.zap(), t.zap = null), this.#t.set(e, { isZapClosed: !0 }), this._cleanupInfiniteScroll(e);
		} catch {}
	}
}(), ud = class extends HTMLElement {
	#e;
	#t;
	constructor() {
		super(), this.attachShadow({ mode: "open" }), this.#e = {
			isInitialized: !1,
			theme: q.DEFAULT_OPTIONS.theme
		}, this.popStateHandler = (e) => {
			e.preventDefault(), this.#s(".dialog")?.open && this.closeDialog();
		};
	}
	async connectedCallback() {
		if (this.viewId = this.getAttribute("data-view-id"), this.viewId) {
			this.#t = this.#n();
			try {
				await this.#t, this.#e.isInitialized = !0;
				let e = ld.getViewConfig(this.viewId);
				if (!e) throw Error("Config is required for initialization");
				if (await this.#r(e), this.getAttribute("data-nzv-id")) {
					let e = await od.getCurrentStats(this.viewId);
					e && this.statsUI.displayStats(e);
				}
				this.#e.isInitialized = !0, this.dispatchEvent(new CustomEvent("dialog-initialized", { detail: { viewId: this.viewId } }));
			} catch {}
		}
	}
	async #n() {
		return new Promise(((e) => {
			let t = document.createElement("template");
			t.innerHTML = td.getDialogTemplate(), this.shadowRoot.appendChild(t.content.cloneNode(!0)), this.#i(), queueMicrotask((() => e()));
		}));
	}
	async #r(e) {
		let t = document.createElement("style");
		t.textContent = ad(), this.shadowRoot.appendChild(t), this.statsUI = new ju(this.shadowRoot), this.profileUI = new ed(), this.zapListUI = new rd(this.shadowRoot, this.profileUI, this.viewId, e), ld.setZapListUI(this.zapListUI);
		let n = J.getZapEvents(this.viewId);
		n?.length ? await this.zapListUI.renderZapListFromCache(n) : this.zapListUI.showNoZapsMessage();
		let r = this.getAttribute("data-nzv-id");
		if (r) {
			let e = await J.getCachedStats(this.viewId, r);
			if (e?.stats) this.statsUI.displayStats(e.stats);
			else {
				let e = await od.getCurrentStats(this.viewId);
				e && this.statsUI.displayStats(e);
			}
		}
	}
	static get observedAttributes() {
		return ["data-theme"];
	}
	#i() {
		let e = this.#s(".dialog");
		this.#s(".close-dialog-button").addEventListener("click", (() => this.closeDialog())), e.addEventListener("click", ((t) => {
			t.target === e && this.closeDialog();
		})), e.addEventListener("cancel", ((e) => {
			e.preventDefault(), this.closeDialog();
		})), document.addEventListener("keydown", ((t) => {
			if (e?.open) {
				if (t.key === "Escape") this.closeDialog();
				else if (t.key === " ") {
					t.preventDefault();
					let e = this.#s(".dialog-zap-list");
					e && (e.scrollTop += .8 * e.clientHeight);
				}
			}
		}));
	}
	attributeChangedCallback(e, t, n) {
		t !== n && e === "data-theme" && this.#a(n);
	}
	#a(e) {
		J.updateThemeState(this.viewId, { theme: e }).isInitialized && this.#o();
	}
	#o() {
		let e = J.getThemeState(this.viewId).theme === "dark" ? "dark-theme" : "light-theme";
		this.shadowRoot.host.classList.add(e);
	}
	async showDialog() {
		await this.#t;
		let e = this.#s(".dialog");
		e && !e.open && this.#e.isInitialized && (window.addEventListener("popstate", this.popStateHandler), e.showModal(), queueMicrotask((() => {
			document.activeElement && document.activeElement.blur();
		})), this.#c());
	}
	closeDialog() {
		let e = this.#s(".dialog");
		e?.open && (this.zapListUI?.destroy(), ld.unsubscribe(this.viewId), e.close(), this.remove(), window.removeEventListener("popstate", this.popStateHandler));
	}
	displayZapStats(e) {
		this.statsUI.displayStats(e);
	}
	#s(e) {
		return this.shadowRoot.querySelector(e);
	}
	#c() {
		let e = this.getAttribute("data-view-id"), t = document.querySelector(`button[data-zap-view-id="${e}"]`);
		if (!t) return;
		let n = this.#s(".dialog-title"), r = this.#s(".dialog-title a");
		if (!r || !n) return;
		let i = t.getAttribute("data-title"), a = t.getAttribute("data-nzv-id");
		r.href = a ? `https://njump.me/${a}` : "#", i?.trim() ? (r.textContent = i, n.classList.add("custom-title")) : (r.textContent = q.DIALOG_CONFIG.DEFAULT_TITLE + wu(a), n.classList.remove("custom-title"));
	}
	getOperations() {
		if (!this.#e.isInitialized) return null;
		let e = {
			closeDialog: () => this.closeDialog(),
			showDialog: () => this.showDialog()
		};
		return this.#e.isInitialized && Object.assign(e, {
			prependZap: (e) => this.zapListUI?.prependZap(e),
			displayZapStats: (e) => this.statsUI?.displayStats(e),
			showNoZapsMessage: () => this.zapListUI?.showNoZapsMessage()
		}), e;
	}
	async waitForInitialization() {
		return this.#t;
	}
};
customElements.define("nzv-dialog", ud);
var dd = {
	create: async (e, t) => {
		if (!e || !t) return Promise.reject(/* @__PURE__ */ Error("Invalid viewId or config"));
		ld.setViewConfig(e, t);
		let n = document.querySelector(`nzv-dialog[data-view-id="${e}"]`);
		if (n) return n;
		let r = document.createElement("nzv-dialog");
		r.setAttribute("data-view-id", e), r.setAttribute("data-config", JSON.stringify(t));
		let i = document.querySelector(`button[data-zap-view-id="${e}"]`);
		return i?.getAttribute("data-nzv-id") && r.setAttribute("data-nzv-id", i.getAttribute("data-nzv-id")), document.body.appendChild(r), await r.waitForInitialization(), r;
	},
	get: (e) => document.querySelector(`nzv-dialog[data-view-id="${e}"]`),
	execute: (e, t, ...n) => {
		let r = dd.get(e)?.getOperations();
		return r ? r[t]?.(...n) ?? null : null;
	}
}, fd = (e, t) => dd.execute(t, "displayZapStats", e);
async function pd(e, t) {
	try {
		let n = au.fromButton(e);
		if (!n) throw Error("Failed to create config from button");
		if (ld.setViewConfig(t, n), !await async function(e) {
			try {
				let t = ld.getViewConfig(e);
				if (!t) throw Error(`View configuration not found for viewId: ${e}`);
				return ld.setViewConfig(e, t), await dd.create(e, t);
			} catch {
				return null;
			}
		}(t)) throw Error(q.ZAP_CONFIG.ERRORS.DIALOG_NOT_FOUND);
		await async function(e) {
			try {
				let t = dd.get(e);
				if (!t) throw Error("Dialog not found");
				await t.waitForInitialization();
				let n = t.getOperations();
				if (!n?.showDialog) throw Error("Basic dialog operations not available");
				n.showDialog();
			} catch {}
		}(t), setTimeout((async () => {
			if (await async function(e, t) {
				let n = J.getZapEvents(e);
				if (n.length > 0) {
					let e = [...new Set(n.map(((e) => e.pubkey)))];
					$u.fetchProfiles(e);
				}
				let { hasEnoughCachedEvents: r } = await J.processCachedData(e, t);
				return r && ld.setupInfiniteScroll(e), r;
			}(t, n), !e.hasAttribute("data-initialized")) {
				let r = e.getAttribute("data-nzv-id");
				await Promise.all([
					sd.connectToRelays(n.relayUrls),
					ld.initializeSubscriptions(n, t),
					r ? od.initializeStats(r, t, !0) : Promise.resolve()
				]), e.setAttribute("data-initialized", "true");
			}
		}), 0);
	} catch {}
}
function md() {
	Object.entries(q.LIBRARIES).forEach((([e, t]) => {
		window[e] = t;
	})), document.querySelectorAll("button[data-nzv-id]").forEach(((e, t) => {
		if (e.hasAttribute("data-zap-view-id")) return;
		let n = `nostr-zap-view-${t}`;
		e.setAttribute("data-zap-view-id", n), e.hasAttribute("data-zap-color-mode") || e.setAttribute("data-zap-color-mode", q.ZAP_CONFIG.DEFAULT_COLOR_MODE), e.addEventListener("click", (() => pd(e, n)));
	}));
}
function hd(e = {}) {
	Object.assign(q, e), typeof window < "u" && md();
}
function gd(e = {}) {
	return hd(e);
}
typeof window < "u" && document.addEventListener("DOMContentLoaded", md), zt.vQ, zt.ZM, zt.yk, zt.h0, zt.n_;
var _d = zt.Xz;
zt.Uv, zt.fU, zt.Dw;
// D:/ドキュメント/GitHub/ehagaki/node_modules/nostr-zap/dist/main.js
var vd = globalThis;
function yd(e) {
	return e && e.__esModule ? e.default : e;
}
var bd = {}, xd = {}, Sd = vd.parcelRequire1faa;
Sd ?? (Sd = function(e) {
	if (e in bd) return bd[e].exports;
	if (e in xd) {
		var t = xd[e];
		delete xd[e];
		var n = {
			id: e,
			exports: {}
		};
		return bd[e] = n, t.call(n.exports, n, n.exports), n.exports;
	}
	var r = /* @__PURE__ */ Error("Cannot find module '" + e + "'");
	throw r.code = "MODULE_NOT_FOUND", r;
}, Sd.register = function(e, t) {
	xd[e] = t;
}, vd.parcelRequire1faa = Sd);
var Cd = Sd.register;
Cd("58QMB", function(e, t) {
	(function() {
		function t(e, t) {
			var n, r = Object.keys(t);
			for (n = 0; n < r.length; n++) e = e.replace(RegExp("\\{" + r[n] + "\\}", "gi"), t[r[n]]);
			return e;
		}
		function n(e) {
			var t, n, r;
			if (!e) throw Error("cannot create a random attribute name for an undefined object");
			t = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", n = "";
			do
				for (n = "", r = 0; r < 12; r++) n += t[Math.floor(Math.random() * t.length)];
			while (e[n]);
			return n;
		}
		function r(e) {
			var t = {
				left: "start",
				right: "end",
				center: "middle",
				start: "start",
				end: "end"
			};
			return t[e] || t.start;
		}
		function i(e) {
			var t = {
				alphabetic: "alphabetic",
				hanging: "hanging",
				top: "text-before-edge",
				bottom: "text-after-edge",
				middle: "central"
			};
			return t[e] || t.alphabetic;
		}
		var a, o, s, c, l = function(e, t) {
			var n, r, i, a = {};
			for (e = e.split(","), t ||= 10, n = 0; n < e.length; n += 2) r = "&" + e[n + 1] + ";", i = parseInt(e[n], t), a[r] = "&#" + i + ";";
			return a["\\xa0"] = "&#160;", a;
		}("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro", 32);
		a = {
			strokeStyle: {
				svgAttr: "stroke",
				canvas: "#000000",
				svg: "none",
				apply: "stroke"
			},
			fillStyle: {
				svgAttr: "fill",
				canvas: "#000000",
				svg: null,
				apply: "fill"
			},
			lineCap: {
				svgAttr: "stroke-linecap",
				canvas: "butt",
				svg: "butt",
				apply: "stroke"
			},
			lineJoin: {
				svgAttr: "stroke-linejoin",
				canvas: "miter",
				svg: "miter",
				apply: "stroke"
			},
			miterLimit: {
				svgAttr: "stroke-miterlimit",
				canvas: 10,
				svg: 4,
				apply: "stroke"
			},
			lineWidth: {
				svgAttr: "stroke-width",
				canvas: 1,
				svg: 1,
				apply: "stroke"
			},
			globalAlpha: {
				svgAttr: "opacity",
				canvas: 1,
				svg: 1,
				apply: "fill stroke"
			},
			font: { canvas: "10px sans-serif" },
			shadowColor: { canvas: "#000000" },
			shadowOffsetX: { canvas: 0 },
			shadowOffsetY: { canvas: 0 },
			shadowBlur: { canvas: 0 },
			textAlign: { canvas: "start" },
			textBaseline: { canvas: "alphabetic" },
			lineDash: {
				svgAttr: "stroke-dasharray",
				canvas: [],
				svg: null,
				apply: "stroke"
			}
		}, s = function(e, t) {
			this.__root = e, this.__ctx = t;
		}, s.prototype.addColorStop = function(e, n) {
			var r, i, a = this.__ctx.__createElement("stop");
			a.setAttribute("offset", e), n.indexOf("rgba") === -1 ? a.setAttribute("stop-color", n) : (r = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, i = r.exec(n), a.setAttribute("stop-color", t("rgb({r},{g},{b})", {
				r: i[1],
				g: i[2],
				b: i[3]
			})), a.setAttribute("stop-opacity", i[4])), this.__root.appendChild(a);
		}, c = function(e, t) {
			this.__root = e, this.__ctx = t;
		}, o = function(e) {
			var t, n = {
				width: 500,
				height: 500,
				veiwBoxWidth: 500,
				veiwBoxHeight: 500,
				enableMirroring: !1
			};
			if (arguments.length > 1 ? (t = n, t.width = arguments[0], t.height = arguments[1], t.veiwBoxWidth = arguments[2], t.veiwBoxHeight = arguments[3]) : t = e || n, !(this instanceof o)) return new o(t);
			this.width = t.width || n.width, this.height = t.height || n.height, this.veiwBoxWidth = t.veiwBoxWidth || this.width, this.veiwBoxHeight = t.veiwBoxHeight || this.height, this.enableMirroring = t.enableMirroring === void 0 ? n.enableMirroring : t.enableMirroring, this.canvas = this, this.__document = t.document || document, t.ctx ? this.__ctx = t.ctx : (this.__canvas = this.__document.createElement("canvas"), this.__ctx = this.__canvas.getContext("2d")), this.__setDefaultStyles(), this.__stack = [this.__getStyleState()], this.__groupStack = [], this.__root = this.__document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.__root.setAttribute("version", 1.1), this.__root.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), this.__root.setAttribute("width", this.width), this.__root.setAttribute("height", this.height), this.__root.setAttribute("viewBox", "0 0 " + this.veiwBoxWidth + " " + this.veiwBoxHeight), this.__ids = {}, this.__defs = this.__document.createElementNS("http://www.w3.org/2000/svg", "defs"), this.__root.appendChild(this.__defs), this.__currentElement = this.__document.createElementNS("http://www.w3.org/2000/svg", "g"), this.__root.appendChild(this.__currentElement);
		}, o.prototype.__createElement = function(e, t, n) {
			t === void 0 && (t = {});
			var r, i, a = this.__document.createElementNS("http://www.w3.org/2000/svg", e), o = Object.keys(t);
			for (n && (a.setAttribute("fill", "none"), a.setAttribute("stroke", "none")), r = 0; r < o.length; r++) i = o[r], a.setAttribute(i, t[i]);
			return a;
		}, o.prototype.__setDefaultStyles = function() {
			var e, t, n = Object.keys(a);
			for (e = 0; e < n.length; e++) t = n[e], this[t] = a[t].canvas;
		}, o.prototype.__applyStyleState = function(e) {
			var t, n, r = Object.keys(e);
			for (t = 0; t < r.length; t++) n = r[t], this[n] = e[n];
		}, o.prototype.__getStyleState = function() {
			var e, t, n = {}, r = Object.keys(a);
			for (e = 0; e < r.length; e++) t = r[e], n[t] = this[t];
			return n;
		}, o.prototype.__applyStyleToCurrentElement = function(e) {
			var n = this.__currentElement, r = this.__currentElementsToStyle;
			r && (n.setAttribute(e, ""), n = r.element, r.children.forEach(function(t) {
				t.setAttribute(e, "");
			}));
			var i, o, l, u, d, f, p = Object.keys(a);
			for (i = 0; i < p.length; i++) if (o = a[p[i]], l = this[p[i]], o.apply) {
				if (l instanceof c) {
					if (l.__ctx) for (; l.__ctx.__defs.childNodes.length;) u = l.__ctx.__defs.childNodes[0].getAttribute("id"), this.__ids[u] = u, this.__defs.appendChild(l.__ctx.__defs.childNodes[0]);
					n.setAttribute(o.apply, t("url(#{id})", { id: l.__root.getAttribute("id") }));
				} else if (l instanceof s) n.setAttribute(o.apply, t("url(#{id})", { id: l.__root.getAttribute("id") }));
				else if (o.apply.indexOf(e) !== -1 && o.svg !== l) {
					if (o.svgAttr !== "stroke" && o.svgAttr !== "fill" || l.indexOf("rgba") === -1) {
						var m = o.svgAttr;
						if (p[i] === "globalAlpha" && (m = e + "-" + o.svgAttr, n.getAttribute(m))) continue;
						n.setAttribute(m, l);
					} else {
						d = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi, f = d.exec(l), n.setAttribute(o.svgAttr, t("rgb({r},{g},{b})", {
							r: f[1],
							g: f[2],
							b: f[3]
						}));
						var h = f[4], g = this.globalAlpha;
						g != null && (h *= g), n.setAttribute(o.svgAttr + "-opacity", h);
					}
				}
			}
		}, o.prototype.__closestGroupOrSvg = function(e) {
			return e ||= this.__currentElement, e.nodeName === "g" || e.nodeName === "svg" ? e : this.__closestGroupOrSvg(e.parentNode);
		}, o.prototype.getSerializedSvg = function(e) {
			var t, n, r, i, a, o, s = new XMLSerializer().serializeToString(this.__root);
			if (o = /xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi, o.test(s) && (s = s.replace("xmlns=\"http://www.w3.org/2000/svg", "xmlns:xlink=\"http://www.w3.org/1999/xlink")), e) for (t = Object.keys(l), n = 0; n < t.length; n++) r = t[n], i = l[r], a = new RegExp(r, "gi"), a.test(s) && (s = s.replace(a, i));
			return s;
		}, o.prototype.getSvg = function() {
			return this.__root;
		}, o.prototype.save = function() {
			var e = this.__createElement("g"), t = this.__closestGroupOrSvg();
			this.__groupStack.push(t), t.appendChild(e), this.__currentElement = e, this.__stack.push(this.__getStyleState());
		}, o.prototype.restore = function() {
			this.__currentElement = this.__groupStack.pop(), this.__currentElementsToStyle = null, this.__currentElement ||= this.__root.childNodes[1];
			var e = this.__stack.pop();
			this.__applyStyleState(e);
		}, o.prototype.__addTransform = function(e) {
			var t = this.__closestGroupOrSvg();
			if (t.childNodes.length > 0) {
				this.__currentElement.nodeName === "path" && (this.__currentElementsToStyle ||= {
					element: t,
					children: []
				}, this.__currentElementsToStyle.children.push(this.__currentElement), this.__applyCurrentDefaultPath());
				var n = this.__createElement("g");
				t.appendChild(n), this.__currentElement = n;
			}
			var r = this.__currentElement.getAttribute("transform");
			r ? r += " " : r = "", r += e, this.__currentElement.setAttribute("transform", r);
		}, o.prototype.scale = function(e, n) {
			n === void 0 && (n = e), this.__addTransform(t("scale({x},{y})", {
				x: e,
				y: n
			}));
		}, o.prototype.rotate = function(e) {
			var n = 180 * e / Math.PI;
			this.__addTransform(t("rotate({angle},{cx},{cy})", {
				angle: n,
				cx: 0,
				cy: 0
			}));
		}, o.prototype.translate = function(e, n) {
			this.__addTransform(t("translate({x},{y})", {
				x: e,
				y: n
			}));
		}, o.prototype.transform = function(e, n, r, i, a, o) {
			this.__addTransform(t("matrix({a},{b},{c},{d},{e},{f})", {
				a: e,
				b: n,
				c: r,
				d: i,
				e: a,
				f: o
			}));
		}, o.prototype.beginPath = function() {
			var e, t;
			this.__currentDefaultPath = "", this.__currentPosition = {}, e = this.__createElement("path", {}, !0), t = this.__closestGroupOrSvg(), t.appendChild(e), this.__currentElement = e;
		}, o.prototype.__applyCurrentDefaultPath = function() {
			var e = this.__currentElement;
			e.nodeName === "path" ? e.setAttribute("d", this.__currentDefaultPath) : console.error("Attempted to apply path command to node", e.nodeName);
		}, o.prototype.__addPathCommand = function(e) {
			this.__currentDefaultPath += " ", this.__currentDefaultPath += e;
		}, o.prototype.moveTo = function(e, n) {
			this.__currentElement.nodeName !== "path" && this.beginPath(), this.__currentPosition = {
				x: e,
				y: n
			}, this.__addPathCommand(t("M {x} {y}", {
				x: e,
				y: n
			}));
		}, o.prototype.closePath = function() {
			this.__currentDefaultPath && this.__addPathCommand("Z");
		}, o.prototype.lineTo = function(e, n) {
			this.__currentPosition = {
				x: e,
				y: n
			}, this.__currentDefaultPath.indexOf("M") > -1 ? this.__addPathCommand(t("L {x} {y}", {
				x: e,
				y: n
			})) : this.__addPathCommand(t("M {x} {y}", {
				x: e,
				y: n
			}));
		}, o.prototype.bezierCurveTo = function(e, n, r, i, a, o) {
			this.__currentPosition = {
				x: a,
				y: o
			}, this.__addPathCommand(t("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}", {
				cp1x: e,
				cp1y: n,
				cp2x: r,
				cp2y: i,
				x: a,
				y: o
			}));
		}, o.prototype.quadraticCurveTo = function(e, n, r, i) {
			this.__currentPosition = {
				x: r,
				y: i
			}, this.__addPathCommand(t("Q {cpx} {cpy} {x} {y}", {
				cpx: e,
				cpy: n,
				x: r,
				y: i
			}));
		};
		var u = function(e) {
			var t = Math.sqrt(e[0] * e[0] + e[1] * e[1]);
			return [e[0] / t, e[1] / t];
		};
		o.prototype.arcTo = function(e, t, n, r, i) {
			var a = this.__currentPosition && this.__currentPosition.x, o = this.__currentPosition && this.__currentPosition.y;
			if (a !== void 0 && o !== void 0) {
				if (i < 0) throw Error("IndexSizeError: The radius provided (" + i + ") is negative.");
				if (a === e && o === t || e === n && t === r || i === 0) return void this.lineTo(e, t);
				var s = u([a - e, o - t]), c = u([n - e, r - t]);
				if (s[0] * c[1] == s[1] * c[0]) return void this.lineTo(e, t);
				var l = s[0] * c[0] + s[1] * c[1], d = Math.acos(Math.abs(l)), f = u([s[0] + c[0], s[1] + c[1]]), p = i / Math.sin(d / 2), m = e + p * f[0], h = t + p * f[1], g = [-s[1], s[0]], _ = [c[1], -c[0]], v = function(e) {
					var t = e[0];
					return e[1] >= 0 ? Math.acos(t) : -Math.acos(t);
				}, y = v(g), b = v(_);
				this.lineTo(m + g[0] * i, h + g[1] * i), this.arc(m, h, i, y, b);
			}
		}, o.prototype.stroke = function() {
			this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "fill stroke markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("stroke");
		}, o.prototype.fill = function() {
			this.__currentElement.nodeName === "path" && this.__currentElement.setAttribute("paint-order", "stroke fill markers"), this.__applyCurrentDefaultPath(), this.__applyStyleToCurrentElement("fill");
		}, o.prototype.rect = function(e, t, n, r) {
			this.__currentElement.nodeName !== "path" && this.beginPath(), this.moveTo(e, t), this.lineTo(e + n, t), this.lineTo(e + n, t + r), this.lineTo(e, t + r), this.lineTo(e, t), this.closePath();
		}, o.prototype.fillRect = function(e, t, n, r) {
			var i = this.__createElement("rect", {
				x: e,
				y: t,
				width: n,
				height: r,
				"shape-rendering": "crispEdges"
			}, !0);
			this.__closestGroupOrSvg().appendChild(i), this.__currentElement = i, this.__applyStyleToCurrentElement("fill");
		}, o.prototype.strokeRect = function(e, t, n, r) {
			var i = this.__createElement("rect", {
				x: e,
				y: t,
				width: n,
				height: r
			}, !0);
			this.__closestGroupOrSvg().appendChild(i), this.__currentElement = i, this.__applyStyleToCurrentElement("stroke");
		}, o.prototype.__clearCanvas = function() {
			for (var e = this.__closestGroupOrSvg().getAttribute("transform"), t = this.__root.childNodes[1], n = t.childNodes, r = n.length - 1; r >= 0; r--) n[r] && t.removeChild(n[r]);
			this.__currentElement = t, this.__groupStack = [], e && this.__addTransform(e);
		}, o.prototype.clearRect = function(e, t, n, r) {
			if (e === 0 && t === 0 && n === this.width && r === this.height) return void this.__clearCanvas();
			var i, a = this.__closestGroupOrSvg();
			i = this.__createElement("rect", {
				x: e,
				y: t,
				width: n,
				height: r,
				fill: "#FFFFFF"
			}, !0), a.appendChild(i);
		}, o.prototype.createLinearGradient = function(e, t, r, i) {
			var a = this.__createElement("linearGradient", {
				id: n(this.__ids),
				x1: e + "px",
				x2: r + "px",
				y1: t + "px",
				y2: i + "px",
				gradientUnits: "userSpaceOnUse"
			}, !1);
			return this.__defs.appendChild(a), new s(a, this);
		}, o.prototype.createRadialGradient = function(e, t, r, i, a, o) {
			var c = this.__createElement("radialGradient", {
				id: n(this.__ids),
				cx: i + "px",
				cy: a + "px",
				r: o + "px",
				fx: e + "px",
				fy: t + "px",
				gradientUnits: "userSpaceOnUse"
			}, !1);
			return this.__defs.appendChild(c), new s(c, this);
		}, o.prototype.__parseFont = function() {
			var e = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z0-9]+?)\s*$/i.exec(this.font), t = {
				style: e[1] || "normal",
				size: e[4] || "10px",
				family: e[6] || "sans-serif",
				weight: e[3] || "normal",
				decoration: e[2] || "normal",
				href: null
			};
			return this.__fontUnderline === "underline" && (t.decoration = "underline"), this.__fontHref && (t.href = this.__fontHref), t;
		}, o.prototype.__wrapTextLink = function(e, t) {
			if (e.href) {
				var n = this.__createElement("a");
				return n.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e.href), n.appendChild(t), n;
			}
			return t;
		}, o.prototype.__applyText = function(e, t, n, a) {
			var o = this.__parseFont(), s = this.__closestGroupOrSvg(), c = this.__createElement("text", {
				"font-family": o.family,
				"font-size": o.size,
				"font-style": o.style,
				"font-weight": o.weight,
				"text-decoration": o.decoration,
				x: t,
				y: n,
				"text-anchor": r(this.textAlign),
				"dominant-baseline": i(this.textBaseline)
			}, !0);
			c.appendChild(this.__document.createTextNode(e)), this.__currentElement = c, this.__applyStyleToCurrentElement(a), s.appendChild(this.__wrapTextLink(o, c));
		}, o.prototype.fillText = function(e, t, n) {
			this.__applyText(e, t, n, "fill");
		}, o.prototype.strokeText = function(e, t, n) {
			this.__applyText(e, t, n, "stroke");
		}, o.prototype.measureText = function(e) {
			return this.__ctx.font = this.font, this.__ctx.measureText(e);
		}, o.prototype.arc = function(e, n, r, i, a, o) {
			if (i !== a) {
				i %= 2 * Math.PI, a %= 2 * Math.PI, i === a && (a = (a + 2 * Math.PI - .001 * (o ? -1 : 1)) % (2 * Math.PI));
				var s = e + r * Math.cos(a), c = n + r * Math.sin(a), l = e + r * Math.cos(i), u = n + r * Math.sin(i), d = +!o, f = 0, p = a - i;
				p < 0 && (p += 2 * Math.PI), f = o ? p > Math.PI ? 0 : 1 : +(p > Math.PI), this.lineTo(l, u), this.__addPathCommand(t("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}", {
					rx: r,
					ry: r,
					xAxisRotation: 0,
					largeArcFlag: f,
					sweepFlag: d,
					endX: s,
					endY: c
				})), this.__currentPosition = {
					x: s,
					y: c
				};
			}
		}, o.prototype.clip = function() {
			var e = this.__closestGroupOrSvg(), r = this.__createElement("clipPath"), i = n(this.__ids), a = this.__createElement("g");
			this.__applyCurrentDefaultPath(), e.removeChild(this.__currentElement), r.setAttribute("id", i), r.appendChild(this.__currentElement), this.__defs.appendChild(r), e.setAttribute("clip-path", t("url(#{id})", { id: i })), e.appendChild(a), this.__currentElement = a;
		}, o.prototype.drawImage = function() {
			var e, t, n, r, i, a, s, c, l, u, d, f, p, m, h = Array.prototype.slice.call(arguments), g = h[0], _ = 0, v = 0;
			if (h.length === 3) e = h[1], t = h[2], i = g.width, a = g.height, n = i, r = a;
			else if (h.length === 5) e = h[1], t = h[2], n = h[3], r = h[4], i = g.width, a = g.height;
			else {
				if (h.length !== 9) throw Error("Invalid number of arguments passed to drawImage: " + arguments.length);
				_ = h[1], v = h[2], i = h[3], a = h[4], e = h[5], t = h[6], n = h[7], r = h[8];
			}
			s = this.__closestGroupOrSvg(), this.__currentElement;
			var y = "translate(" + e + ", " + t + ")";
			if (g instanceof o) {
				if (c = g.getSvg().cloneNode(!0), c.childNodes && c.childNodes.length > 1) {
					for (l = c.childNodes[0]; l.childNodes.length;) m = l.childNodes[0].getAttribute("id"), this.__ids[m] = m, this.__defs.appendChild(l.childNodes[0]);
					if (u = c.childNodes[1]) {
						var b, x = u.getAttribute("transform");
						b = x ? x + " " + y : y, u.setAttribute("transform", b), s.appendChild(u);
					}
				}
			} else g.nodeName !== "CANVAS" && g.nodeName !== "IMG" || (d = this.__createElement("image"), d.setAttribute("width", n), d.setAttribute("height", r), d.setAttribute("preserveAspectRatio", "none"), d.setAttribute("opacity", this.globalAlpha), (_ || v || i !== g.width || a !== g.height) && (f = this.__document.createElement("canvas"), f.width = n, f.height = r, p = f.getContext("2d"), p.drawImage(g, _, v, i, a, 0, 0, n, r), g = f), d.setAttribute("transform", y), d.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", g.nodeName === "CANVAS" ? g.toDataURL() : g.originalSrc), s.appendChild(d));
		}, o.prototype.createPattern = function(e, t) {
			var r, i = this.__document.createElementNS("http://www.w3.org/2000/svg", "pattern"), a = n(this.__ids);
			return i.setAttribute("id", a), i.setAttribute("width", e.width), i.setAttribute("height", e.height), e.nodeName === "CANVAS" || e.nodeName === "IMG" ? (r = this.__document.createElementNS("http://www.w3.org/2000/svg", "image"), r.setAttribute("width", e.width), r.setAttribute("height", e.height), r.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e.nodeName === "CANVAS" ? e.toDataURL() : e.getAttribute("src")), i.appendChild(r), this.__defs.appendChild(i)) : e instanceof o && (i.appendChild(e.__root.childNodes[1]), this.__defs.appendChild(i)), new c(i, this);
		}, o.prototype.setLineDash = function(e) {
			this.lineDash = e && e.length > 0 ? e.join(",") : null;
		}, o.prototype.drawFocusRing = function() {}, o.prototype.createImageData = function() {}, o.prototype.getImageData = function() {}, o.prototype.putImageData = function() {}, o.prototype.globalCompositeOperation = function() {}, o.prototype.setTransform = function() {}, typeof window == "object" && (window.C2S = o), typeof e.exports == "object" && (e.exports = o);
	})(), (function() {
		function n(e, t, n) {
			if (this.mode = v.MODE_8BIT_BYTE, this.data = e, this.parsedData = [], t) {
				for (var r = 0, i = this.data.length; r < i; r++) {
					var a = [];
					a[0] = this.data.charCodeAt(r), this.parsedData.push(a);
				}
				this.parsedData = Array.prototype.concat.apply([], this.parsedData);
			} else this.parsedData = function(e) {
				for (var t = [], n = 0; n < e.length; n++) {
					var r = e.charCodeAt(n);
					r < 128 ? t.push(r) : r < 2048 ? t.push(192 | r >> 6, 128 | 63 & r) : r < 55296 || r >= 57344 ? t.push(224 | r >> 12, 128 | r >> 6 & 63, 128 | 63 & r) : (n++, r = 65536 + ((1023 & r) << 10 | 1023 & e.charCodeAt(n)), t.push(240 | r >> 18, 128 | r >> 12 & 63, 128 | r >> 6 & 63, 128 | 63 & r));
				}
				return t;
			}(e);
			this.parsedData = Array.prototype.concat.apply([], this.parsedData), n || this.parsedData.length == this.data.length || (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239));
		}
		function r(e, t) {
			this.typeNumber = e, this.errorCorrectLevel = t, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = [];
		}
		function i(e, t) {
			if (e.length == u) throw Error(e.length + "/" + t);
			for (var n = 0; n < e.length && e[n] == 0;) n++;
			this.num = Array(e.length - n + t);
			for (var r = 0; r < e.length - n; r++) this.num[r] = e[r + n];
		}
		function a(e, t) {
			this.totalCount = e, this.dataCount = t;
		}
		function o() {
			this.buffer = [], this.length = 0;
		}
		function s() {
			var e = !1, t = navigator.userAgent;
			if (/android/i.test(t)) {
				e = !0;
				var n = t.toString().match(/android ([0-9]\.[0-9])/i);
				n && n[1] && (e = parseFloat(n[1]));
			}
			return e;
		}
		function c(e, t) {
			for (var n = t.correctLevel, r = 1, i = l(e), a = 0, o = w.length; a < o; a++) {
				var s = 0;
				switch (n) {
					case y.L:
						s = w[a][0];
						break;
					case y.M:
						s = w[a][1];
						break;
					case y.Q:
						s = w[a][2];
						break;
					case y.H: s = w[a][3];
				}
				if (i <= s) break;
				r++;
			}
			if (r > w.length) throw Error("Too long data. the CorrectLevel." + [
				"M",
				"L",
				"H",
				"Q"
			][n] + " limit length is " + s);
			return t.version != 0 && (r <= t.version ? (r = t.version, t.runVersion = r) : (console.warn("QR Code version " + t.version + " too small, run version use " + r), t.runVersion = r)), r;
		}
		function l(e) {
			return encodeURI(e).toString().replace(/\%[0-9a-fA-F]{2}/g, "a").length;
		}
		var u, d, f = typeof vd == "object" && vd && vd.Object === Object && vd, p = typeof self == "object" && self && self.Object === Object && self, m = f || p || Function("return this")(), h = t && !t.nodeType && t, g = h && e && !e.nodeType && e, _ = m.QRCode;
		n.prototype = {
			getLength: function(e) {
				return this.parsedData.length;
			},
			write: function(e) {
				for (var t = 0, n = this.parsedData.length; t < n; t++) e.put(this.parsedData[t], 8);
			}
		}, r.prototype = {
			addData: function(e, t, r) {
				var i = new n(e, t, r);
				this.dataList.push(i), this.dataCache = null;
			},
			isDark: function(e, t) {
				if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t) throw Error(e + "," + t);
				return this.modules[e][t][0];
			},
			getEye: function(e, t) {
				if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t) throw Error(e + "," + t);
				var n = this.modules[e][t];
				if (n[1]) {
					var r = "P" + n[1] + "_" + n[2];
					return n[2] == "A" && (r = "A" + n[1]), {
						isDark: n[0],
						type: r
					};
				}
				return null;
			},
			getModuleCount: function() {
				return this.moduleCount;
			},
			make: function() {
				this.makeImpl(!1, this.getBestMaskPattern());
			},
			makeImpl: function(e, t) {
				this.moduleCount = 4 * this.typeNumber + 17, this.modules = Array(this.moduleCount);
				for (var n = 0; n < this.moduleCount; n++) {
					this.modules[n] = Array(this.moduleCount);
					for (var i = 0; i < this.moduleCount; i++) this.modules[n][i] = [];
				}
				this.setupPositionProbePattern(0, 0, "TL"), this.setupPositionProbePattern(this.moduleCount - 7, 0, "BL"), this.setupPositionProbePattern(0, this.moduleCount - 7, "TR"), this.setupPositionAdjustPattern("A"), this.setupTimingPattern(), this.setupTypeInfo(e, t), this.typeNumber >= 7 && this.setupTypeNumber(e), this.dataCache ??= r.createData(this.typeNumber, this.errorCorrectLevel, this.dataList), this.mapData(this.dataCache, t);
			},
			setupPositionProbePattern: function(e, t, n) {
				for (var r = -1; r <= 7; r++) if (!(e + r <= -1 || this.moduleCount <= e + r)) for (var i = -1; i <= 7; i++) t + i <= -1 || this.moduleCount <= t + i || (0 <= r && r <= 6 && (i == 0 || i == 6) || 0 <= i && i <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= i && i <= 4 ? (this.modules[e + r][t + i][0] = !0, this.modules[e + r][t + i][2] = n, this.modules[e + r][t + i][1] = r == -0 || i == -0 || r == 6 || i == 6 ? "O" : "I") : this.modules[e + r][t + i][0] = !1);
			},
			getBestMaskPattern: function() {
				for (var e = 0, t = 0, n = 0; n < 8; n++) {
					this.makeImpl(!0, n);
					var r = x.getLostPoint(this);
					(n == 0 || e > r) && (e = r, t = n);
				}
				return t;
			},
			createMovieClip: function(e, t, n) {
				var r = e.createEmptyMovieClip(t, n);
				this.make();
				for (var i = 0; i < this.modules.length; i++) for (var a = 1 * i, o = 0; o < this.modules[i].length; o++) {
					var s = 1 * o;
					this.modules[i][o][0] && (r.beginFill(0, 100), r.moveTo(s, a), r.lineTo(s + 1, a), r.lineTo(s + 1, a + 1), r.lineTo(s, a + 1), r.endFill());
				}
				return r;
			},
			setupTimingPattern: function() {
				for (var e = 8; e < this.moduleCount - 8; e++) this.modules[e][6][0] ?? (this.modules[e][6][0] = e % 2 == 0);
				for (var t = 8; t < this.moduleCount - 8; t++) this.modules[6][t][0] ?? (this.modules[6][t][0] = t % 2 == 0);
			},
			setupPositionAdjustPattern: function(e) {
				for (var t = x.getPatternPosition(this.typeNumber), n = 0; n < t.length; n++) for (var r = 0; r < t.length; r++) {
					var i = t[n], a = t[r];
					if (this.modules[i][a][0] == null) for (var o = -2; o <= 2; o++) for (var s = -2; s <= 2; s++) o == -2 || o == 2 || s == -2 || s == 2 || o == 0 && s == 0 ? (this.modules[i + o][a + s][0] = !0, this.modules[i + o][a + s][2] = e, this.modules[i + o][a + s][1] = o == -2 || s == -2 || o == 2 || s == 2 ? "O" : "I") : this.modules[i + o][a + s][0] = !1;
				}
			},
			setupTypeNumber: function(e) {
				for (var t = x.getBCHTypeNumber(this.typeNumber), n = 0; n < 18; n++) {
					var r = !e && (t >> n & 1) == 1;
					this.modules[Math.floor(n / 3)][n % 3 + this.moduleCount - 8 - 3][0] = r;
				}
				for (var n = 0; n < 18; n++) {
					var r = !e && (t >> n & 1) == 1;
					this.modules[n % 3 + this.moduleCount - 8 - 3][Math.floor(n / 3)][0] = r;
				}
			},
			setupTypeInfo: function(e, t) {
				for (var n = this.errorCorrectLevel << 3 | t, r = x.getBCHTypeInfo(n), i = 0; i < 15; i++) {
					var a = !e && (r >> i & 1) == 1;
					i < 6 ? this.modules[i][8][0] = a : i < 8 ? this.modules[i + 1][8][0] = a : this.modules[this.moduleCount - 15 + i][8][0] = a;
				}
				for (var i = 0; i < 15; i++) {
					var a = !e && (r >> i & 1) == 1;
					i < 8 ? this.modules[8][this.moduleCount - i - 1][0] = a : i < 9 ? this.modules[8][15 - i - 1 + 1][0] = a : this.modules[8][15 - i - 1][0] = a;
				}
				this.modules[this.moduleCount - 8][8][0] = !e;
			},
			mapData: function(e, t) {
				for (var n = -1, r = this.moduleCount - 1, i = 7, a = 0, o = this.moduleCount - 1; o > 0; o -= 2) for (o == 6 && o--;;) {
					for (var s = 0; s < 2; s++) if (this.modules[r][o - s][0] == null) {
						var c = !1;
						a < e.length && (c = (e[a] >>> i & 1) == 1), x.getMask(t, r, o - s) && (c = !c), this.modules[r][o - s][0] = c, i--, i == -1 && (a++, i = 7);
					}
					if ((r += n) < 0 || this.moduleCount <= r) {
						r -= n, n = -n;
						break;
					}
				}
			}
		}, r.PAD0 = 236, r.PAD1 = 17, r.createData = function(e, t, n) {
			for (var i = a.getRSBlocks(e, t), s = new o(), c = 0; c < n.length; c++) {
				var l = n[c];
				s.put(l.mode, 4), s.put(l.getLength(), x.getLengthInBits(l.mode, e)), l.write(s);
			}
			for (var u = 0, c = 0; c < i.length; c++) u += i[c].dataCount;
			if (s.getLengthInBits() > 8 * u) throw Error("code length overflow. (" + s.getLengthInBits() + ">" + 8 * u + ")");
			for (s.getLengthInBits() + 4 <= 8 * u && s.put(0, 4); s.getLengthInBits() % 8 != 0;) s.putBit(!1);
			for (; !(s.getLengthInBits() >= 8 * u || (s.put(r.PAD0, 8), s.getLengthInBits() >= 8 * u));) s.put(r.PAD1, 8);
			return r.createBytes(s, i);
		}, r.createBytes = function(e, t) {
			for (var n = 0, r = 0, a = 0, o = Array(t.length), s = Array(t.length), c = 0; c < t.length; c++) {
				var l = t[c].dataCount, u = t[c].totalCount - l;
				r = Math.max(r, l), a = Math.max(a, u), o[c] = Array(l);
				for (var d = 0; d < o[c].length; d++) o[c][d] = 255 & e.buffer[d + n];
				n += l;
				var f = x.getErrorCorrectPolynomial(u), p = new i(o[c], f.getLength() - 1).mod(f);
				s[c] = Array(f.getLength() - 1);
				for (var d = 0; d < s[c].length; d++) {
					var m = d + p.getLength() - s[c].length;
					s[c][d] = m >= 0 ? p.get(m) : 0;
				}
			}
			for (var h = 0, d = 0; d < t.length; d++) h += t[d].totalCount;
			for (var g = Array(h), _ = 0, d = 0; d < r; d++) for (var c = 0; c < t.length; c++) d < o[c].length && (g[_++] = o[c][d]);
			for (var d = 0; d < a; d++) for (var c = 0; c < t.length; c++) d < s[c].length && (g[_++] = s[c][d]);
			return g;
		};
		for (var v = {
			MODE_NUMBER: 1,
			MODE_ALPHA_NUM: 2,
			MODE_8BIT_BYTE: 4,
			MODE_KANJI: 8
		}, y = {
			L: 1,
			M: 0,
			Q: 3,
			H: 2
		}, b = {
			PATTERN000: 0,
			PATTERN001: 1,
			PATTERN010: 2,
			PATTERN011: 3,
			PATTERN100: 4,
			PATTERN101: 5,
			PATTERN110: 6,
			PATTERN111: 7
		}, x = {
			PATTERN_POSITION_TABLE: [
				[],
				[6, 18],
				[6, 22],
				[6, 26],
				[6, 30],
				[6, 34],
				[
					6,
					22,
					38
				],
				[
					6,
					24,
					42
				],
				[
					6,
					26,
					46
				],
				[
					6,
					28,
					50
				],
				[
					6,
					30,
					54
				],
				[
					6,
					32,
					58
				],
				[
					6,
					34,
					62
				],
				[
					6,
					26,
					46,
					66
				],
				[
					6,
					26,
					48,
					70
				],
				[
					6,
					26,
					50,
					74
				],
				[
					6,
					30,
					54,
					78
				],
				[
					6,
					30,
					56,
					82
				],
				[
					6,
					30,
					58,
					86
				],
				[
					6,
					34,
					62,
					90
				],
				[
					6,
					28,
					50,
					72,
					94
				],
				[
					6,
					26,
					50,
					74,
					98
				],
				[
					6,
					30,
					54,
					78,
					102
				],
				[
					6,
					28,
					54,
					80,
					106
				],
				[
					6,
					32,
					58,
					84,
					110
				],
				[
					6,
					30,
					58,
					86,
					114
				],
				[
					6,
					34,
					62,
					90,
					118
				],
				[
					6,
					26,
					50,
					74,
					98,
					122
				],
				[
					6,
					30,
					54,
					78,
					102,
					126
				],
				[
					6,
					26,
					52,
					78,
					104,
					130
				],
				[
					6,
					30,
					56,
					82,
					108,
					134
				],
				[
					6,
					34,
					60,
					86,
					112,
					138
				],
				[
					6,
					30,
					58,
					86,
					114,
					142
				],
				[
					6,
					34,
					62,
					90,
					118,
					146
				],
				[
					6,
					30,
					54,
					78,
					102,
					126,
					150
				],
				[
					6,
					24,
					50,
					76,
					102,
					128,
					154
				],
				[
					6,
					28,
					54,
					80,
					106,
					132,
					158
				],
				[
					6,
					32,
					58,
					84,
					110,
					136,
					162
				],
				[
					6,
					26,
					54,
					82,
					110,
					138,
					166
				],
				[
					6,
					30,
					58,
					86,
					114,
					142,
					170
				]
			],
			G15: 1335,
			G18: 7973,
			G15_MASK: 21522,
			getBCHTypeInfo: function(e) {
				for (var t = e << 10; x.getBCHDigit(t) - x.getBCHDigit(x.G15) >= 0;) t ^= x.G15 << x.getBCHDigit(t) - x.getBCHDigit(x.G15);
				return (e << 10 | t) ^ x.G15_MASK;
			},
			getBCHTypeNumber: function(e) {
				for (var t = e << 12; x.getBCHDigit(t) - x.getBCHDigit(x.G18) >= 0;) t ^= x.G18 << x.getBCHDigit(t) - x.getBCHDigit(x.G18);
				return e << 12 | t;
			},
			getBCHDigit: function(e) {
				for (var t = 0; e != 0;) t++, e >>>= 1;
				return t;
			},
			getPatternPosition: function(e) {
				return x.PATTERN_POSITION_TABLE[e - 1];
			},
			getMask: function(e, t, n) {
				switch (e) {
					case b.PATTERN000: return (t + n) % 2 == 0;
					case b.PATTERN001: return t % 2 == 0;
					case b.PATTERN010: return n % 3 == 0;
					case b.PATTERN011: return (t + n) % 3 == 0;
					case b.PATTERN100: return (Math.floor(t / 2) + Math.floor(n / 3)) % 2 == 0;
					case b.PATTERN101: return t * n % 2 + t * n % 3 == 0;
					case b.PATTERN110: return (t * n % 2 + t * n % 3) % 2 == 0;
					case b.PATTERN111: return (t * n % 3 + (t + n) % 2) % 2 == 0;
					default: throw Error("bad maskPattern:" + e);
				}
			},
			getErrorCorrectPolynomial: function(e) {
				for (var t = new i([1], 0), n = 0; n < e; n++) t = t.multiply(new i([1, S.gexp(n)], 0));
				return t;
			},
			getLengthInBits: function(e, t) {
				if (1 <= t && t < 10) switch (e) {
					case v.MODE_NUMBER: return 10;
					case v.MODE_ALPHA_NUM: return 9;
					case v.MODE_8BIT_BYTE:
					case v.MODE_KANJI: return 8;
					default: throw Error("mode:" + e);
				}
				else if (t < 27) switch (e) {
					case v.MODE_NUMBER: return 12;
					case v.MODE_ALPHA_NUM: return 11;
					case v.MODE_8BIT_BYTE: return 16;
					case v.MODE_KANJI: return 10;
					default: throw Error("mode:" + e);
				}
				else {
					if (!(t < 41)) throw Error("type:" + t);
					switch (e) {
						case v.MODE_NUMBER: return 14;
						case v.MODE_ALPHA_NUM: return 13;
						case v.MODE_8BIT_BYTE: return 16;
						case v.MODE_KANJI: return 12;
						default: throw Error("mode:" + e);
					}
				}
			},
			getLostPoint: function(e) {
				for (var t = e.getModuleCount(), n = 0, r = 0; r < t; r++) for (var i = 0; i < t; i++) {
					for (var a = 0, o = e.isDark(r, i), s = -1; s <= 1; s++) if (!(r + s < 0 || t <= r + s)) for (var c = -1; c <= 1; c++) i + c < 0 || t <= i + c || s == 0 && c == 0 || o == e.isDark(r + s, i + c) && a++;
					a > 5 && (n += 3 + a - 5);
				}
				for (var r = 0; r < t - 1; r++) for (var i = 0; i < t - 1; i++) {
					var l = 0;
					e.isDark(r, i) && l++, e.isDark(r + 1, i) && l++, e.isDark(r, i + 1) && l++, e.isDark(r + 1, i + 1) && l++, l != 0 && l != 4 || (n += 3);
				}
				for (var r = 0; r < t; r++) for (var i = 0; i < t - 6; i++) e.isDark(r, i) && !e.isDark(r, i + 1) && e.isDark(r, i + 2) && e.isDark(r, i + 3) && e.isDark(r, i + 4) && !e.isDark(r, i + 5) && e.isDark(r, i + 6) && (n += 40);
				for (var i = 0; i < t; i++) for (var r = 0; r < t - 6; r++) e.isDark(r, i) && !e.isDark(r + 1, i) && e.isDark(r + 2, i) && e.isDark(r + 3, i) && e.isDark(r + 4, i) && !e.isDark(r + 5, i) && e.isDark(r + 6, i) && (n += 40);
				for (var u = 0, i = 0; i < t; i++) for (var r = 0; r < t; r++) e.isDark(r, i) && u++;
				return n += Math.abs(100 * u / t / t - 50) / 5 * 10;
			}
		}, S = {
			glog: function(e) {
				if (e < 1) throw Error("glog(" + e + ")");
				return S.LOG_TABLE[e];
			},
			gexp: function(e) {
				for (; e < 0;) e += 255;
				for (; e >= 256;) e -= 255;
				return S.EXP_TABLE[e];
			},
			EXP_TABLE: Array(256),
			LOG_TABLE: Array(256)
		}, C = 0; C < 8; C++) S.EXP_TABLE[C] = 1 << C;
		for (var C = 8; C < 256; C++) S.EXP_TABLE[C] = S.EXP_TABLE[C - 4] ^ S.EXP_TABLE[C - 5] ^ S.EXP_TABLE[C - 6] ^ S.EXP_TABLE[C - 8];
		for (var C = 0; C < 255; C++) S.LOG_TABLE[S.EXP_TABLE[C]] = C;
		i.prototype = {
			get: function(e) {
				return this.num[e];
			},
			getLength: function() {
				return this.num.length;
			},
			multiply: function(e) {
				for (var t = Array(this.getLength() + e.getLength() - 1), n = 0; n < this.getLength(); n++) for (var r = 0; r < e.getLength(); r++) t[n + r] ^= S.gexp(S.glog(this.get(n)) + S.glog(e.get(r)));
				return new i(t, 0);
			},
			mod: function(e) {
				if (this.getLength() - e.getLength() < 0) return this;
				for (var t = S.glog(this.get(0)) - S.glog(e.get(0)), n = Array(this.getLength()), r = 0; r < this.getLength(); r++) n[r] = this.get(r);
				for (var r = 0; r < e.getLength(); r++) n[r] ^= S.gexp(S.glog(e.get(r)) + t);
				return new i(n, 0).mod(e);
			}
		}, a.RS_BLOCK_TABLE = [
			[
				1,
				26,
				19
			],
			[
				1,
				26,
				16
			],
			[
				1,
				26,
				13
			],
			[
				1,
				26,
				9
			],
			[
				1,
				44,
				34
			],
			[
				1,
				44,
				28
			],
			[
				1,
				44,
				22
			],
			[
				1,
				44,
				16
			],
			[
				1,
				70,
				55
			],
			[
				1,
				70,
				44
			],
			[
				2,
				35,
				17
			],
			[
				2,
				35,
				13
			],
			[
				1,
				100,
				80
			],
			[
				2,
				50,
				32
			],
			[
				2,
				50,
				24
			],
			[
				4,
				25,
				9
			],
			[
				1,
				134,
				108
			],
			[
				2,
				67,
				43
			],
			[
				2,
				33,
				15,
				2,
				34,
				16
			],
			[
				2,
				33,
				11,
				2,
				34,
				12
			],
			[
				2,
				86,
				68
			],
			[
				4,
				43,
				27
			],
			[
				4,
				43,
				19
			],
			[
				4,
				43,
				15
			],
			[
				2,
				98,
				78
			],
			[
				4,
				49,
				31
			],
			[
				2,
				32,
				14,
				4,
				33,
				15
			],
			[
				4,
				39,
				13,
				1,
				40,
				14
			],
			[
				2,
				121,
				97
			],
			[
				2,
				60,
				38,
				2,
				61,
				39
			],
			[
				4,
				40,
				18,
				2,
				41,
				19
			],
			[
				4,
				40,
				14,
				2,
				41,
				15
			],
			[
				2,
				146,
				116
			],
			[
				3,
				58,
				36,
				2,
				59,
				37
			],
			[
				4,
				36,
				16,
				4,
				37,
				17
			],
			[
				4,
				36,
				12,
				4,
				37,
				13
			],
			[
				2,
				86,
				68,
				2,
				87,
				69
			],
			[
				4,
				69,
				43,
				1,
				70,
				44
			],
			[
				6,
				43,
				19,
				2,
				44,
				20
			],
			[
				6,
				43,
				15,
				2,
				44,
				16
			],
			[
				4,
				101,
				81
			],
			[
				1,
				80,
				50,
				4,
				81,
				51
			],
			[
				4,
				50,
				22,
				4,
				51,
				23
			],
			[
				3,
				36,
				12,
				8,
				37,
				13
			],
			[
				2,
				116,
				92,
				2,
				117,
				93
			],
			[
				6,
				58,
				36,
				2,
				59,
				37
			],
			[
				4,
				46,
				20,
				6,
				47,
				21
			],
			[
				7,
				42,
				14,
				4,
				43,
				15
			],
			[
				4,
				133,
				107
			],
			[
				8,
				59,
				37,
				1,
				60,
				38
			],
			[
				8,
				44,
				20,
				4,
				45,
				21
			],
			[
				12,
				33,
				11,
				4,
				34,
				12
			],
			[
				3,
				145,
				115,
				1,
				146,
				116
			],
			[
				4,
				64,
				40,
				5,
				65,
				41
			],
			[
				11,
				36,
				16,
				5,
				37,
				17
			],
			[
				11,
				36,
				12,
				5,
				37,
				13
			],
			[
				5,
				109,
				87,
				1,
				110,
				88
			],
			[
				5,
				65,
				41,
				5,
				66,
				42
			],
			[
				5,
				54,
				24,
				7,
				55,
				25
			],
			[
				11,
				36,
				12,
				7,
				37,
				13
			],
			[
				5,
				122,
				98,
				1,
				123,
				99
			],
			[
				7,
				73,
				45,
				3,
				74,
				46
			],
			[
				15,
				43,
				19,
				2,
				44,
				20
			],
			[
				3,
				45,
				15,
				13,
				46,
				16
			],
			[
				1,
				135,
				107,
				5,
				136,
				108
			],
			[
				10,
				74,
				46,
				1,
				75,
				47
			],
			[
				1,
				50,
				22,
				15,
				51,
				23
			],
			[
				2,
				42,
				14,
				17,
				43,
				15
			],
			[
				5,
				150,
				120,
				1,
				151,
				121
			],
			[
				9,
				69,
				43,
				4,
				70,
				44
			],
			[
				17,
				50,
				22,
				1,
				51,
				23
			],
			[
				2,
				42,
				14,
				19,
				43,
				15
			],
			[
				3,
				141,
				113,
				4,
				142,
				114
			],
			[
				3,
				70,
				44,
				11,
				71,
				45
			],
			[
				17,
				47,
				21,
				4,
				48,
				22
			],
			[
				9,
				39,
				13,
				16,
				40,
				14
			],
			[
				3,
				135,
				107,
				5,
				136,
				108
			],
			[
				3,
				67,
				41,
				13,
				68,
				42
			],
			[
				15,
				54,
				24,
				5,
				55,
				25
			],
			[
				15,
				43,
				15,
				10,
				44,
				16
			],
			[
				4,
				144,
				116,
				4,
				145,
				117
			],
			[
				17,
				68,
				42
			],
			[
				17,
				50,
				22,
				6,
				51,
				23
			],
			[
				19,
				46,
				16,
				6,
				47,
				17
			],
			[
				2,
				139,
				111,
				7,
				140,
				112
			],
			[
				17,
				74,
				46
			],
			[
				7,
				54,
				24,
				16,
				55,
				25
			],
			[
				34,
				37,
				13
			],
			[
				4,
				151,
				121,
				5,
				152,
				122
			],
			[
				4,
				75,
				47,
				14,
				76,
				48
			],
			[
				11,
				54,
				24,
				14,
				55,
				25
			],
			[
				16,
				45,
				15,
				14,
				46,
				16
			],
			[
				6,
				147,
				117,
				4,
				148,
				118
			],
			[
				6,
				73,
				45,
				14,
				74,
				46
			],
			[
				11,
				54,
				24,
				16,
				55,
				25
			],
			[
				30,
				46,
				16,
				2,
				47,
				17
			],
			[
				8,
				132,
				106,
				4,
				133,
				107
			],
			[
				8,
				75,
				47,
				13,
				76,
				48
			],
			[
				7,
				54,
				24,
				22,
				55,
				25
			],
			[
				22,
				45,
				15,
				13,
				46,
				16
			],
			[
				10,
				142,
				114,
				2,
				143,
				115
			],
			[
				19,
				74,
				46,
				4,
				75,
				47
			],
			[
				28,
				50,
				22,
				6,
				51,
				23
			],
			[
				33,
				46,
				16,
				4,
				47,
				17
			],
			[
				8,
				152,
				122,
				4,
				153,
				123
			],
			[
				22,
				73,
				45,
				3,
				74,
				46
			],
			[
				8,
				53,
				23,
				26,
				54,
				24
			],
			[
				12,
				45,
				15,
				28,
				46,
				16
			],
			[
				3,
				147,
				117,
				10,
				148,
				118
			],
			[
				3,
				73,
				45,
				23,
				74,
				46
			],
			[
				4,
				54,
				24,
				31,
				55,
				25
			],
			[
				11,
				45,
				15,
				31,
				46,
				16
			],
			[
				7,
				146,
				116,
				7,
				147,
				117
			],
			[
				21,
				73,
				45,
				7,
				74,
				46
			],
			[
				1,
				53,
				23,
				37,
				54,
				24
			],
			[
				19,
				45,
				15,
				26,
				46,
				16
			],
			[
				5,
				145,
				115,
				10,
				146,
				116
			],
			[
				19,
				75,
				47,
				10,
				76,
				48
			],
			[
				15,
				54,
				24,
				25,
				55,
				25
			],
			[
				23,
				45,
				15,
				25,
				46,
				16
			],
			[
				13,
				145,
				115,
				3,
				146,
				116
			],
			[
				2,
				74,
				46,
				29,
				75,
				47
			],
			[
				42,
				54,
				24,
				1,
				55,
				25
			],
			[
				23,
				45,
				15,
				28,
				46,
				16
			],
			[
				17,
				145,
				115
			],
			[
				10,
				74,
				46,
				23,
				75,
				47
			],
			[
				10,
				54,
				24,
				35,
				55,
				25
			],
			[
				19,
				45,
				15,
				35,
				46,
				16
			],
			[
				17,
				145,
				115,
				1,
				146,
				116
			],
			[
				14,
				74,
				46,
				21,
				75,
				47
			],
			[
				29,
				54,
				24,
				19,
				55,
				25
			],
			[
				11,
				45,
				15,
				46,
				46,
				16
			],
			[
				13,
				145,
				115,
				6,
				146,
				116
			],
			[
				14,
				74,
				46,
				23,
				75,
				47
			],
			[
				44,
				54,
				24,
				7,
				55,
				25
			],
			[
				59,
				46,
				16,
				1,
				47,
				17
			],
			[
				12,
				151,
				121,
				7,
				152,
				122
			],
			[
				12,
				75,
				47,
				26,
				76,
				48
			],
			[
				39,
				54,
				24,
				14,
				55,
				25
			],
			[
				22,
				45,
				15,
				41,
				46,
				16
			],
			[
				6,
				151,
				121,
				14,
				152,
				122
			],
			[
				6,
				75,
				47,
				34,
				76,
				48
			],
			[
				46,
				54,
				24,
				10,
				55,
				25
			],
			[
				2,
				45,
				15,
				64,
				46,
				16
			],
			[
				17,
				152,
				122,
				4,
				153,
				123
			],
			[
				29,
				74,
				46,
				14,
				75,
				47
			],
			[
				49,
				54,
				24,
				10,
				55,
				25
			],
			[
				24,
				45,
				15,
				46,
				46,
				16
			],
			[
				4,
				152,
				122,
				18,
				153,
				123
			],
			[
				13,
				74,
				46,
				32,
				75,
				47
			],
			[
				48,
				54,
				24,
				14,
				55,
				25
			],
			[
				42,
				45,
				15,
				32,
				46,
				16
			],
			[
				20,
				147,
				117,
				4,
				148,
				118
			],
			[
				40,
				75,
				47,
				7,
				76,
				48
			],
			[
				43,
				54,
				24,
				22,
				55,
				25
			],
			[
				10,
				45,
				15,
				67,
				46,
				16
			],
			[
				19,
				148,
				118,
				6,
				149,
				119
			],
			[
				18,
				75,
				47,
				31,
				76,
				48
			],
			[
				34,
				54,
				24,
				34,
				55,
				25
			],
			[
				20,
				45,
				15,
				61,
				46,
				16
			]
		], a.getRSBlocks = function(e, t) {
			var n = a.getRsBlockTable(e, t);
			if (n == u) throw Error("bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t);
			for (var r = n.length / 3, i = [], o = 0; o < r; o++) for (var s = n[3 * o + 0], c = n[3 * o + 1], l = n[3 * o + 2], d = 0; d < s; d++) i.push(new a(c, l));
			return i;
		}, a.getRsBlockTable = function(e, t) {
			switch (t) {
				case y.L: return a.RS_BLOCK_TABLE[4 * (e - 1) + 0];
				case y.M: return a.RS_BLOCK_TABLE[4 * (e - 1) + 1];
				case y.Q: return a.RS_BLOCK_TABLE[4 * (e - 1) + 2];
				case y.H: return a.RS_BLOCK_TABLE[4 * (e - 1) + 3];
				default: return u;
			}
		}, o.prototype = {
			get: function(e) {
				var t = Math.floor(e / 8);
				return (this.buffer[t] >>> 7 - e % 8 & 1) == 1;
			},
			put: function(e, t) {
				for (var n = 0; n < t; n++) this.putBit((e >>> t - n - 1 & 1) == 1);
			},
			getLengthInBits: function() {
				return this.length;
			},
			putBit: function(e) {
				var t = Math.floor(this.length / 8);
				this.buffer.length <= t && this.buffer.push(0), e && (this.buffer[t] |= 128 >>> this.length % 8), this.length++;
			}
		};
		var w = [
			[
				17,
				14,
				11,
				7
			],
			[
				32,
				26,
				20,
				14
			],
			[
				53,
				42,
				32,
				24
			],
			[
				78,
				62,
				46,
				34
			],
			[
				106,
				84,
				60,
				44
			],
			[
				134,
				106,
				74,
				58
			],
			[
				154,
				122,
				86,
				64
			],
			[
				192,
				152,
				108,
				84
			],
			[
				230,
				180,
				130,
				98
			],
			[
				271,
				213,
				151,
				119
			],
			[
				321,
				251,
				177,
				137
			],
			[
				367,
				287,
				203,
				155
			],
			[
				425,
				331,
				241,
				177
			],
			[
				458,
				362,
				258,
				194
			],
			[
				520,
				412,
				292,
				220
			],
			[
				586,
				450,
				322,
				250
			],
			[
				644,
				504,
				364,
				280
			],
			[
				718,
				560,
				394,
				310
			],
			[
				792,
				624,
				442,
				338
			],
			[
				858,
				666,
				482,
				382
			],
			[
				929,
				711,
				509,
				403
			],
			[
				1003,
				779,
				565,
				439
			],
			[
				1091,
				857,
				611,
				461
			],
			[
				1171,
				911,
				661,
				511
			],
			[
				1273,
				997,
				715,
				535
			],
			[
				1367,
				1059,
				751,
				593
			],
			[
				1465,
				1125,
				805,
				625
			],
			[
				1528,
				1190,
				868,
				658
			],
			[
				1628,
				1264,
				908,
				698
			],
			[
				1732,
				1370,
				982,
				742
			],
			[
				1840,
				1452,
				1030,
				790
			],
			[
				1952,
				1538,
				1112,
				842
			],
			[
				2068,
				1628,
				1168,
				898
			],
			[
				2188,
				1722,
				1228,
				958
			],
			[
				2303,
				1809,
				1283,
				983
			],
			[
				2431,
				1911,
				1351,
				1051
			],
			[
				2563,
				1989,
				1423,
				1093
			],
			[
				2699,
				2099,
				1499,
				1139
			],
			[
				2809,
				2213,
				1579,
				1219
			],
			[
				2953,
				2331,
				1663,
				1273
			]
		], T = function() {
			return typeof CanvasRenderingContext2D < "u";
		}() ? function() {
			function e() {
				if (this._htOption.drawer == "svg") {
					var e = this._oContext.getSerializedSvg(!0);
					this.dataURL = e, this._el.innerHTML = e;
				} else {
					(function(e, t, n, r) {
						var i = document.createElement("canvas");
						i.width = n, i.height = r, i.getContext("2d").drawImage(e, 0, 0, n, r), e.width = n, e.height = r, t.drawImage(i, 0, 0);
					})(this._elCanvas, this._oContext, this._htOption.width + 2 * this._htOption.quietZone, this._htOption.height + this._htOption.titleHeight + 2 * this._htOption.quietZone);
					try {
						var t = this._elCanvas.toDataURL("image/png");
						this.dataURL = t;
					} catch (e) {
						console.error(e);
					}
				}
				this._htOption.onRenderingEnd && (this.dataURL || console.error("Can not get base64 data, please check: 1. Published the page and image to the server 2. The image request support CORS 3. Configured `crossOrigin:'anonymous'` option"), this._htOption.onRenderingEnd(this._htOption, this.dataURL));
			}
			function t(e, t) {
				var n = this;
				if (n._fFail = t, n._fSuccess = e, n._bSupportDataURI === null) {
					var r = document.createElement("img"), i = function() {
						n._bSupportDataURI = !1, n._fFail && n._fFail.call(n);
					};
					r.onabort = i, r.onerror = i, r.onload = function() {
						n._bSupportDataURI = !0, n._fSuccess && n._fSuccess.call(n);
					}, r.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
				} else !0 === n._bSupportDataURI && n._fSuccess ? n._fSuccess.call(n) : !1 === n._bSupportDataURI && n._fFail && n._fFail.call(n);
			}
			if (m._android && m._android <= 2.1) {
				var n = 1 / window.devicePixelRatio, r = CanvasRenderingContext2D.prototype.drawImage;
				CanvasRenderingContext2D.prototype.drawImage = function(e, t, i, a, o, s, c, l, u) {
					if ("nodeName" in e && /img/i.test(e.nodeName)) for (var d = arguments.length - 1; d >= 1; d--) arguments[d] = arguments[d] * n;
					else l === void 0 && (arguments[1] *= n, arguments[2] *= n, arguments[3] *= n, arguments[4] *= n);
					r.apply(this, arguments);
				};
			}
			var i = function(e, t) {
				this._bIsPainted = !1, this._android = s(), this._el = e, this._htOption = t, this._htOption.drawer == "svg" ? (this._oContext = {}, this._elCanvas = {}) : (this._elCanvas = document.createElement("canvas"), this._el.appendChild(this._elCanvas), this._oContext = this._elCanvas.getContext("2d")), this._bSupportDataURI = null, this.dataURL = null;
			};
			return i.prototype.draw = function(e) {
				function t() {
					r.quietZone > 0 && r.quietZoneColor && (l.lineWidth = 0, l.fillStyle = r.quietZoneColor, l.fillRect(0, 0, u._elCanvas.width, r.quietZone), l.fillRect(0, r.quietZone, r.quietZone, u._elCanvas.height - 2 * r.quietZone), l.fillRect(u._elCanvas.width - r.quietZone, r.quietZone, r.quietZone, u._elCanvas.height - 2 * r.quietZone), l.fillRect(0, u._elCanvas.height - r.quietZone, u._elCanvas.width, r.quietZone));
				}
				function n(e) {
					function n(e) {
						var n = Math.round(r.width / 3.5), i = Math.round(r.height / 3.5);
						n !== i && (n = i), r.logoMaxWidth ? n = Math.round(r.logoMaxWidth) : r.logoWidth && (n = Math.round(r.logoWidth)), r.logoMaxHeight ? i = Math.round(r.logoMaxHeight) : r.logoHeight && (i = Math.round(r.logoHeight));
						var a, o;
						e.naturalWidth === void 0 ? (a = e.width, o = e.height) : (a = e.naturalWidth, o = e.naturalHeight), (r.logoMaxWidth || r.logoMaxHeight) && (r.logoMaxWidth && a <= n && (n = a), r.logoMaxHeight && o <= i && (i = o), a <= n && o <= i && (n = a, i = o));
						var s = (r.realWidth - n) / 2, c = (r.calculatedQRHeight - i) / 2 + r.titleHeight + r.quietZone, u = Math.min(n / a, i / o), d = a * u, f = o * u;
						(r.logoMaxWidth || r.logoMaxHeight) && (n = d, i = f, s = (r.realWidth - n) / 2, c = (r.realHeight - i) / 2), r.logoBackgroundTransparent || (l.fillStyle = r.logoBackgroundColor, l.fillRect(s, c, n, i));
						var p = l.imageSmoothingQuality, m = l.imageSmoothingEnabled;
						l.imageSmoothingEnabled = !0, l.imageSmoothingQuality = "high", l.drawImage(e, s + (n - d) / 2, c + (i - f) / 2, d, f), l.imageSmoothingEnabled = m, l.imageSmoothingQuality = p, t(), v._bIsPainted = !0, v.makeImage();
					}
					r.onRenderingStart && r.onRenderingStart(r);
					for (var s = 0; s < i; s++) for (var c = 0; c < i; c++) {
						var u = c * a + r.quietZone, d = s * o + r.quietZone, f = e.isDark(s, c), p = e.getEye(s, c), m = r.dotScale;
						l.lineWidth = 0;
						var h, g;
						p ? (h = r[p.type] || r[p.type.substring(0, 2)] || r.colorDark, g = r.colorLight) : r.backgroundImage ? (g = "rgba(0,0,0,0)", s == 6 ? r.autoColor ? (h = r.timing_H || r.timing || r.autoColorDark, g = r.autoColorLight) : h = r.timing_H || r.timing || r.colorDark : c == 6 ? r.autoColor ? (h = r.timing_V || r.timing || r.autoColorDark, g = r.autoColorLight) : h = r.timing_V || r.timing || r.colorDark : r.autoColor ? (h = r.autoColorDark, g = r.autoColorLight) : h = r.colorDark) : (h = s == 6 ? r.timing_H || r.timing || r.colorDark : c == 6 && (r.timing_V || r.timing) || r.colorDark, g = r.colorLight), l.strokeStyle = f ? h : g, l.fillStyle = f ? h : g, p ? (m = p.type == "AO" ? r.dotScaleAO : p.type == "AI" ? r.dotScaleAI : 1, r.backgroundImage && r.autoColor ? (h = (p.type == "AO" ? r.AI : r.AO) || r.autoColorDark, g = r.autoColorLight) : h = (p.type == "AO" ? r.AI : r.AO) || h, f = p.isDark, l.fillRect(Math.ceil(u + a * (1 - m) / 2), Math.ceil(r.titleHeight + d + o * (1 - m) / 2), Math.ceil(a * m), Math.ceil(o * m))) : s == 6 ? (m = r.dotScaleTiming_H, l.fillRect(Math.ceil(u + a * (1 - m) / 2), Math.ceil(r.titleHeight + d + o * (1 - m) / 2), Math.ceil(a * m), Math.ceil(o * m))) : c == 6 ? (m = r.dotScaleTiming_V, l.fillRect(Math.ceil(u + a * (1 - m) / 2), Math.ceil(r.titleHeight + d + o * (1 - m) / 2), Math.ceil(a * m), Math.ceil(o * m))) : (r.backgroundImage, l.fillRect(Math.ceil(u + a * (1 - m) / 2), Math.ceil(r.titleHeight + d + o * (1 - m) / 2), Math.ceil(a * m), Math.ceil(o * m))), r.dotScale == 1 || p || (l.strokeStyle = r.colorLight);
					}
					if (r.title && (l.fillStyle = r.titleBackgroundColor, l.fillRect(r.quietZone, r.quietZone, r.calculatedQRWidth, r.titleHeight), l.font = r.titleFont, l.fillStyle = r.titleColor, l.textAlign = "center", l.fillText(r.title, this._elCanvas.width / 2, +r.quietZone + r.titleTop)), r.subTitle && (l.font = r.subTitleFont, l.fillStyle = r.subTitleColor, l.fillText(r.subTitle, this._elCanvas.width / 2, +r.quietZone + r.subTitleTop)), r.logo) {
						var _ = new Image(), v = this;
						_.onload = function() {
							n(_);
						}, _.onerror = function(e) {
							console.error(e);
						}, r.crossOrigin != null && (_.crossOrigin = r.crossOrigin), _.originalSrc = r.logo, _.src = r.logo;
					} else t(), this._bIsPainted = !0, this.makeImage();
				}
				var r = this._htOption, i = e.getModuleCount(), a = r.width / i, o = r.height / i;
				a <= 1 && (a = 1), o <= 1 && (o = 1), a = Math.round(a), o = Math.round(o);
				var s = a * i, c = o * i;
				r.heightWithTitle = c + r.titleHeight, r.realHeight = r.heightWithTitle + 2 * r.quietZone, r.realWidth = s + 2 * r.quietZone, r.calculatedQRWidth = s, r.calculatedQRHeight = c, this._elCanvas.width = r.realWidth, this._elCanvas.height = r.realHeight, r.drawer != "canvas" && (this._oContext = new C2S(r.width + 2 * this._htOption.quietZone, r.height + r.titleHeight + 2 * this._htOption.quietZone, r.realWidth, r.realHeight)), this.clear();
				var l = this._oContext;
				l.lineWidth = 0, l.fillStyle = r.colorLight, l.fillRect(0, 0, this._elCanvas.width, this._elCanvas.height), l.clearRect(r.quietZone, r.quietZone, r.calculatedQRWidth, r.titleHeight);
				var u = this;
				if (r.backgroundImage) {
					var d = new Image();
					d.onload = function() {
						l.globalAlpha = 1, l.globalAlpha = r.backgroundImageAlpha;
						var t = l.imageSmoothingQuality, i = l.imageSmoothingEnabled;
						l.imageSmoothingEnabled = !0, l.imageSmoothingQuality = "high", (r.title || r.subTitle) && r.titleHeight ? l.drawImage(d, r.quietZone, r.quietZone + r.titleHeight, r.width, r.height) : l.drawImage(d, 0, 0, r.realWidth, r.realHeight), l.imageSmoothingEnabled = i, l.imageSmoothingQuality = t, l.globalAlpha = 1, n.call(u, e);
					}, r.crossOrigin != null && (d.crossOrigin = r.crossOrigin), d.originalSrc = r.backgroundImage, d.src = r.backgroundImage;
				} else n.call(u, e);
			}, i.prototype.makeImage = function() {
				this._bIsPainted && t.call(this, e);
			}, i.prototype.isPainted = function() {
				return this._bIsPainted;
			}, i.prototype.clear = function() {
				this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1;
			}, i.prototype.remove = function() {
				this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1, this._el.innerHTML = "";
			}, i.prototype.round = function(e) {
				return e && Math.floor(1e3 * e) / 1e3;
			}, i;
		}() : function() {
			var e = function(e, t) {
				this._el = e, this._htOption = t;
			};
			return e.prototype.draw = function(e) {
				var t = this._htOption, n = this._el, r = e.getModuleCount(), i = t.width / r, a = t.height / r;
				i <= 1 && (i = 1), a <= 1 && (a = 1);
				var o = i * r;
				t.heightWithTitle = a * r + t.titleHeight, t.realHeight = t.heightWithTitle + 2 * t.quietZone, t.realWidth = o + 2 * t.quietZone;
				var s = [], c = "", l = Math.round(i * t.dotScale), u = Math.round(a * t.dotScale);
				l < 4 && (l = 4, u = 4);
				var d = t.colorDark, f = t.colorLight;
				if (t.backgroundImage) {
					t.autoColor ? (t.colorDark = "rgba(0, 0, 0, .6);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#99000000', EndColorStr='#99000000');", t.colorLight = "rgba(255, 255, 255, .7);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#B2FFFFFF', EndColorStr='#B2FFFFFF');") : t.colorLight = "rgba(0,0,0,0)";
					var p = "<div style=\"display:inline-block; z-index:-10;position:absolute;\"><img src=\"" + t.backgroundImage + "\" width=\"" + (t.width + 2 * t.quietZone) + "\" height=\"" + t.realHeight + "\" style=\"opacity:" + t.backgroundImageAlpha + ";filter:alpha(opacity=" + 100 * t.backgroundImageAlpha + "); \"/></div>";
					s.push(p);
				}
				if (t.quietZone && (c = "display:inline-block; width:" + (t.width + 2 * t.quietZone) + "px; height:" + (t.width + 2 * t.quietZone) + "px;background:" + t.quietZoneColor + "; text-align:center;"), s.push("<div style=\"font-size:0;" + c + "\">"), s.push("<table  style=\"font-size:0;border:0;border-collapse:collapse; margin-top:" + t.quietZone + "px;\" border=\"0\" cellspacing=\"0\" cellspadding=\"0\" align=\"center\" valign=\"middle\">"), s.push("<tr height=\"" + t.titleHeight + "\" align=\"center\"><td style=\"border:0;border-collapse:collapse;margin:0;padding:0\" colspan=\"" + r + "\">"), t.title) {
					var m = t.titleColor, h = t.titleFont;
					s.push("<div style=\"width:100%;margin-top:" + t.titleTop + "px;color:" + m + ";font:" + h + ";background:" + t.titleBackgroundColor + "\">" + t.title + "</div>");
				}
				t.subTitle && s.push("<div style=\"width:100%;margin-top:" + (t.subTitleTop - t.titleTop) + "px;color:" + t.subTitleColor + "; font:" + t.subTitleFont + "\">" + t.subTitle + "</div>"), s.push("</td></tr>");
				for (var g = 0; g < r; g++) {
					s.push("<tr style=\"border:0; padding:0; margin:0;\" height=\"7\">");
					for (var _ = 0; _ < r; _++) {
						var v = e.isDark(g, _), y = e.getEye(g, _);
						if (y) {
							v = y.isDark;
							var b = y.type, x = t[b] || t[b.substring(0, 2)] || d;
							s.push("<td style=\"border:0;border-collapse:collapse;padding:0;margin:0;width:" + i + "px;height:" + a + "px;\"><span style=\"width:" + i + "px;height:" + a + "px;background-color:" + (v ? x : f) + ";display:inline-block\"></span></td>");
						} else {
							var S = t.colorDark;
							g == 6 ? (S = t.timing_H || t.timing || d, s.push("<td style=\"border:0;border-collapse:collapse;padding:0;margin:0;width:" + i + "px;height:" + a + "px;background-color:" + (v ? S : f) + ";\"></td>")) : _ == 6 ? (S = t.timing_V || t.timing || d, s.push("<td style=\"border:0;border-collapse:collapse;padding:0;margin:0;width:" + i + "px;height:" + a + "px;background-color:" + (v ? S : f) + ";\"></td>")) : s.push("<td style=\"border:0;border-collapse:collapse;padding:0;margin:0;width:" + i + "px;height:" + a + "px;\"><div style=\"display:inline-block;width:" + l + "px;height:" + u + "px;background-color:" + (v ? S : t.colorLight) + ";\"></div></td>");
						}
					}
					s.push("</tr>");
				}
				if (s.push("</table>"), s.push("</div>"), t.logo) {
					var C = new Image();
					t.crossOrigin != null && (C.crossOrigin = t.crossOrigin), C.src = t.logo;
					var w = t.width / 3.5, T = t.height / 3.5;
					w != T && (w = T), t.logoWidth && (w = t.logoWidth), t.logoHeight && (T = t.logoHeight);
					var E = "position:relative; z-index:1;display:table-cell;top:-" + (t.height / 2 + T / 2 + t.quietZone) + "px;text-align:center; width:" + w + "px; height:" + T + "px;line-height:" + w + "px; vertical-align: middle;";
					t.logoBackgroundTransparent || (E += "background:" + t.logoBackgroundColor), s.push("<div style=\"" + E + "\"><img  src=\"" + t.logo + "\"  style=\"max-width: " + w + "px; max-height: " + T + "px;\" /> <div style=\" display: none; width:1px;margin-left: -1px;\"></div></div>");
				}
				t.onRenderingStart && t.onRenderingStart(t), n.innerHTML = s.join("");
				var D = n.childNodes[0], O = (t.width - D.offsetWidth) / 2, k = (t.heightWithTitle - D.offsetHeight) / 2;
				O > 0 && k > 0 && (D.style.margin = k + "px " + O + "px"), this._htOption.onRenderingEnd && this._htOption.onRenderingEnd(this._htOption, null);
			}, e.prototype.clear = function() {
				this._el.innerHTML = "";
			}, e;
		}();
		d = function(e, t) {
			if (this._htOption = {
				width: 256,
				height: 256,
				typeNumber: 4,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: y.H,
				dotScale: 1,
				dotScaleTiming: 1,
				dotScaleTiming_H: u,
				dotScaleTiming_V: u,
				dotScaleA: 1,
				dotScaleAO: u,
				dotScaleAI: u,
				quietZone: 0,
				quietZoneColor: "rgba(0,0,0,0)",
				title: "",
				titleFont: "normal normal bold 16px Arial",
				titleColor: "#000000",
				titleBackgroundColor: "#ffffff",
				titleHeight: 0,
				titleTop: 30,
				subTitle: "",
				subTitleFont: "normal normal normal 14px Arial",
				subTitleColor: "#4F4F4F",
				subTitleTop: 60,
				logo: u,
				logoWidth: u,
				logoHeight: u,
				logoMaxWidth: u,
				logoMaxHeight: u,
				logoBackgroundColor: "#ffffff",
				logoBackgroundTransparent: !1,
				PO: u,
				PI: u,
				PO_TL: u,
				PI_TL: u,
				PO_TR: u,
				PI_TR: u,
				PO_BL: u,
				PI_BL: u,
				AO: u,
				AI: u,
				timing: u,
				timing_H: u,
				timing_V: u,
				backgroundImage: u,
				backgroundImageAlpha: 1,
				autoColor: !1,
				autoColorDark: "rgba(0, 0, 0, .6)",
				autoColorLight: "rgba(255, 255, 255, .7)",
				onRenderingStart: u,
				onRenderingEnd: u,
				version: 0,
				tooltip: !1,
				binary: !1,
				drawer: "canvas",
				crossOrigin: null,
				utf8WithoutBOM: !0
			}, typeof t == "string" && (t = { text: t }), t) for (var n in t) this._htOption[n] = t[n];
			this._htOption.title || this._htOption.subTitle || (this._htOption.titleHeight = 0), (this._htOption.version < 0 || this._htOption.version > 40) && (console.warn("QR Code version '" + this._htOption.version + "' is invalidate, reset to 0"), this._htOption.version = 0), (this._htOption.dotScale < 0 || this._htOption.dotScale > 1) && (console.warn(this._htOption.dotScale + " , is invalidate, dotScale must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScale = 1), (this._htOption.dotScaleTiming < 0 || this._htOption.dotScaleTiming > 1) && (console.warn(this._htOption.dotScaleTiming + " , is invalidate, dotScaleTiming must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming = 1), this._htOption.dotScaleTiming_H ? (this._htOption.dotScaleTiming_H < 0 || this._htOption.dotScaleTiming_H > 1) && (console.warn(this._htOption.dotScaleTiming_H + " , is invalidate, dotScaleTiming_H must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_H = 1) : this._htOption.dotScaleTiming_H = this._htOption.dotScaleTiming, this._htOption.dotScaleTiming_V ? (this._htOption.dotScaleTiming_V < 0 || this._htOption.dotScaleTiming_V > 1) && (console.warn(this._htOption.dotScaleTiming_V + " , is invalidate, dotScaleTiming_V must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleTiming_V = 1) : this._htOption.dotScaleTiming_V = this._htOption.dotScaleTiming, (this._htOption.dotScaleA < 0 || this._htOption.dotScaleA > 1) && (console.warn(this._htOption.dotScaleA + " , is invalidate, dotScaleA must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleA = 1), this._htOption.dotScaleAO ? (this._htOption.dotScaleAO < 0 || this._htOption.dotScaleAO > 1) && (console.warn(this._htOption.dotScaleAO + " , is invalidate, dotScaleAO must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAO = 1) : this._htOption.dotScaleAO = this._htOption.dotScaleA, this._htOption.dotScaleAI ? (this._htOption.dotScaleAI < 0 || this._htOption.dotScaleAI > 1) && (console.warn(this._htOption.dotScaleAI + " , is invalidate, dotScaleAI must greater than 0, less than or equal to 1, now reset to 1. "), this._htOption.dotScaleAI = 1) : this._htOption.dotScaleAI = this._htOption.dotScaleA, (this._htOption.backgroundImageAlpha < 0 || this._htOption.backgroundImageAlpha > 1) && (console.warn(this._htOption.backgroundImageAlpha + " , is invalidate, backgroundImageAlpha must between 0 and 1, now reset to 1. "), this._htOption.backgroundImageAlpha = 1), this._htOption.quietZone || (this._htOption.quietZone = 0), this._htOption.titleHeight || (this._htOption.titleHeight = 0), this._htOption.width = Math.round(this._htOption.width), this._htOption.height = Math.round(this._htOption.height), this._htOption.quietZone = Math.round(this._htOption.quietZone), this._htOption.titleHeight = Math.round(this._htOption.titleHeight), typeof e == "string" && (e = document.getElementById(e)), (!this._htOption.drawer || this._htOption.drawer != "svg" && this._htOption.drawer != "canvas") && (this._htOption.drawer = "canvas"), this._android = s(), this._el = e, this._oQRCode = null, this._htOption._element = e;
			var r = {};
			for (var n in this._htOption) r[n] = this._htOption[n];
			this._oDrawing = new T(this._el, r), this._htOption.text && this.makeCode(this._htOption.text);
		}, d.prototype.makeCode = function(e) {
			this._oQRCode = new r(c(e, this._htOption), this._htOption.correctLevel), this._oQRCode.addData(e, this._htOption.binary, this._htOption.utf8WithoutBOM), this._oQRCode.make(), this._htOption.tooltip && (this._el.title = e), this._oDrawing.draw(this._oQRCode);
		}, d.prototype.makeImage = function() {
			typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3) && this._oDrawing.makeImage();
		}, d.prototype.clear = function() {
			this._oDrawing.remove();
		}, d.prototype.resize = function(e, t) {
			this._oDrawing._htOption.width = e, this._oDrawing._htOption.height = t, this._oDrawing.draw(this._oQRCode);
		}, d.prototype.download = function(e) {
			var t = this._oDrawing.dataURL, n = document.createElement("a");
			if (this._htOption.drawer == "svg") {
				e += ".svg";
				var r = new Blob([t], { type: "text/plain" });
				if (navigator.msSaveBlob) navigator.msSaveBlob(r, e);
				else {
					n.download = e;
					var i = new FileReader();
					i.onload = function() {
						n.href = i.result, n.click();
					}, i.readAsDataURL(r);
				}
			} else if (e += ".png", navigator.msSaveBlob) {
				var a = function(e) {
					var t = atob(e.split(",")[1]), n = e.split(",")[0].split(":")[1].split(";")[0], r = new ArrayBuffer(t.length), i = new Uint8Array(r);
					for (C = 0; C < t.length; C++) i[C] = t.charCodeAt(C);
					return new Blob([r], { type: n });
				}(t);
				navigator.msSaveBlob(a, e);
			} else n.download = e, n.href = t, n.click();
		}, d.prototype.noConflict = function() {
			return m.QRCode === this && (m.QRCode = _), d;
		}, d.CorrectLevel = y, typeof define == "function" && (define.amd || define.cmd) ? define([], function() {
			return d;
		}) : g ? ((g.exports = d).QRCode = d, h.QRCode = d) : m.QRCode = d;
	}).call(this);
});
var wd = Sd("58QMB"), Td = {}, Y = BigInt(0), Ed = BigInt(1), Dd = BigInt(2), Od = BigInt(3), kd = BigInt(8), Ad = Object.freeze({
	a: Y,
	b: BigInt(7),
	P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: Ed,
	Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
	Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), jd = (e, t) => (e + t / Dd) / t, Md = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	splitScalar(e) {
		let { n: t } = Ad, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ed * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), a = n, o = BigInt("0x100000000000000000000000000000000"), s = jd(a * e, t), c = jd(-r * e, t), l = X(e - s * n - c * i, t), u = X(-s * r - c * a, t), d = l > o, f = u > o;
		if (d && (l = t - l), f && (u = t - u), l > o || u > o) throw Error("splitScalarEndo: Endomorphism failed, k=" + e);
		return {
			k1neg: d,
			k1: l,
			k2neg: f,
			k2: u
		};
	}
}, Nd = 32, Pd = 32, Fd = 32, Id = 33, Ld = 65;
function Rd(e) {
	let { a: t, b: n } = Ad;
	return X(X(X(e * e) * e) + t * e + n);
}
var zd = Ad.a === Y, Bd = class extends Error {
	constructor(e) {
		super(e);
	}
};
function Vd(e) {
	if (!(e instanceof Hd)) throw TypeError("JacobianPoint expected");
}
var Hd = class e {
	constructor(e, t, n) {
		this.x = e, this.y = t, this.z = n;
	}
	static fromAffine(t) {
		if (!(t instanceof Gd)) throw TypeError("JacobianPoint#fromAffine: expected Point");
		return t.equals(Gd.ZERO) ? e.ZERO : new e(t.x, t.y, Ed);
	}
	static toAffineBatch(e) {
		let t = ff(e.map((e) => e.z));
		return e.map((e, n) => e.toAffine(t[n]));
	}
	static normalizeZ(t) {
		return e.toAffineBatch(t).map(e.fromAffine);
	}
	equals(e) {
		Vd(e);
		let { x: t, y: n, z: r } = this, { x: i, y: a, z: o } = e, s = X(r * r), c = X(o * o), l = X(t * c), u = X(i * s), d = X(X(n * o) * c), f = X(X(a * r) * s);
		return l === u && d === f;
	}
	negate() {
		return new e(this.x, X(-this.y), this.z);
	}
	double() {
		let { x: t, y: n, z: r } = this, i = X(t * t), a = X(n * n), o = X(a * a), s = t + a, c = X(Dd * (X(s * s) - i - o)), l = X(Od * i), u = X(X(l * l) - Dd * c), d = X(l * (c - u) - kd * o), f = X(Dd * n * r);
		return new e(u, d, f);
	}
	add(t) {
		Vd(t);
		let { x: n, y: r, z: i } = this, { x: a, y: o, z: s } = t;
		if (a === Y || o === Y) return this;
		if (n === Y || r === Y) return t;
		let c = X(i * i), l = X(s * s), u = X(n * l), d = X(a * c), f = X(X(r * s) * l), p = X(X(o * i) * c), m = X(d - u), h = X(p - f);
		if (m === Y) return h === Y ? this.double() : e.ZERO;
		let g = X(m * m), _ = X(m * g), v = X(u * g), y = X(h * h - _ - Dd * v), b = X(h * (v - y) - f * _), x = X(i * s * m);
		return new e(y, b, x);
	}
	subtract(e) {
		return this.add(e.negate());
	}
	multiplyUnsafe(t) {
		let n = e.ZERO;
		if (typeof t == "bigint" && t === Y) return n;
		let r = cf(t);
		if (r === Ed) return this;
		if (!zd) {
			let e = n, t = this;
			for (; r > Y;) r & Ed && (e = e.add(t)), t = t.double(), r >>= Ed;
			return e;
		}
		let { k1neg: i, k1: a, k2neg: o, k2: s } = Md.splitScalar(r), c = n, l = n, u = this;
		for (; a > Y || s > Y;) a & Ed && (c = c.add(u)), s & Ed && (l = l.add(u)), u = u.double(), a >>= Ed, s >>= Ed;
		return i && (c = c.negate()), o && (l = l.negate()), l = new e(X(l.x * Md.beta), l.y, l.z), c.add(l);
	}
	precomputeWindow(e) {
		let t = zd ? 128 / e + 1 : 256 / e + 1, n = [], r = this, i = r;
		for (let a = 0; a < t; a++) {
			i = r, n.push(i);
			for (let t = 1; t < 2 ** (e - 1); t++) i = i.add(r), n.push(i);
			r = i.double();
		}
		return n;
	}
	wNAF(t, n) {
		!n && this.equals(e.BASE) && (n = Gd.BASE);
		let r = n && n._WINDOW_SIZE || 1;
		if (256 % r) throw Error("Point#wNAF: Invalid precomputation window, must be power of 2");
		let i = n && Wd.get(n);
		i || (i = this.precomputeWindow(r), n && r !== 1 && (i = e.normalizeZ(i), Wd.set(n, i)));
		let a = e.ZERO, o = e.BASE, s = 1 + (zd ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), u = 2 ** r, d = BigInt(r);
		for (let e = 0; e < s; e++) {
			let n = e * c, r = Number(t & l);
			t >>= d, r > c && (r -= u, t += Ed);
			let s = n, f = n + Math.abs(r) - 1, p = e % 2 != 0, m = r < 0;
			r === 0 ? o = o.add(Ud(p, i[s])) : a = a.add(Ud(m, i[f]));
		}
		return {
			p: a,
			f: o
		};
	}
	multiply(t, n) {
		let r = cf(t), i, a;
		if (zd) {
			let { k1neg: t, k1: o, k2neg: s, k2: c } = Md.splitScalar(r), { p: l, f: u } = this.wNAF(o, n), { p: d, f } = this.wNAF(c, n);
			l = Ud(t, l), d = Ud(s, d), d = new e(X(d.x * Md.beta), d.y, d.z), i = l.add(d), a = u.add(f);
		} else {
			let { p: e, f: t } = this.wNAF(r, n);
			i = e, a = t;
		}
		return e.normalizeZ([i, a])[0];
	}
	toAffine(t) {
		let { x: n, y: r, z: i } = this, a = this.equals(e.ZERO);
		t ??= a ? kd : df(i);
		let o = t, s = X(o * o), c = X(s * o), l = X(n * s), u = X(r * c), d = X(i * o);
		if (a) return Gd.ZERO;
		if (d !== Ed) throw Error("invZ was invalid");
		return new Gd(l, u);
	}
};
Hd.BASE = new Hd(Ad.Gx, Ad.Gy, Ed), Hd.ZERO = new Hd(Y, Ed, Y);
function Ud(e, t) {
	let n = t.negate();
	return e ? n : t;
}
var Wd = /* @__PURE__ */ new WeakMap(), Gd = class e {
	constructor(e, t) {
		this.x = e, this.y = t;
	}
	_setWindowSize(e) {
		this._WINDOW_SIZE = e, Wd.delete(this);
	}
	hasEvenY() {
		return this.y % Dd === Y;
	}
	static fromCompressedHex(t) {
		let n = t.length === 32, r = of(n ? t : t.subarray(1));
		if (!yf(r)) throw Error("Point is not on curve");
		let i = uf(Rd(r)), a = (i & Ed) === Ed;
		n ? a && (i = X(-i)) : (t[0] & 1) == 1 !== a && (i = X(-i));
		let o = new e(r, i);
		return o.assertValidity(), o;
	}
	static fromUncompressedHex(t) {
		let n = of(t.subarray(1, 33)), r = of(t.subarray(33, 65)), i = new e(n, r);
		return i.assertValidity(), i;
	}
	static fromHex(e) {
		let t = sf(e), n = t.length, r = t[0];
		if (n === Nd || n === Id && (r === 2 || r === 3)) return this.fromCompressedHex(t);
		if (n === Ld && r === 4) return this.fromUncompressedHex(t);
		throw Error(`Point.fromHex: received invalid point. Expected 32-${Id} compressed bytes or ${Ld} uncompressed bytes, not ${n}`);
	}
	static fromPrivateKey(t) {
		return e.BASE.multiply(xf(t));
	}
	static fromSignature(t, n, r) {
		let { r: i, s: a } = Cf(n);
		if (![
			0,
			1,
			2,
			3
		].includes(r)) throw Error("Cannot recover: invalid recovery bit");
		let o = mf(sf(t)), { n: s } = Ad, c = r === 2 || r === 3 ? i + s : i, l = df(c, s), u = X(-o * l, s), d = X(a * l, s), f = r & 1 ? "03" : "02", p = e.fromHex(f + ef(c)), m = e.BASE.multiplyAndAddUnsafe(p, u, d);
		if (!m) throw Error("Cannot recover signature: point at infinify");
		return m.assertValidity(), m;
	}
	toRawBytes(e = !1) {
		return af(this.toHex(e));
	}
	toHex(e = !1) {
		let t = ef(this.x);
		return e ? `${this.hasEvenY() ? "02" : "03"}${t}` : `04${t}${ef(this.y)}`;
	}
	toHexX() {
		return this.toHex(!0).slice(2);
	}
	toRawX() {
		return this.toRawBytes(!0).slice(1);
	}
	assertValidity() {
		let { x: e, y: t } = this;
		if (!yf(e) || !yf(t) || X(X(t * t) - Rd(e)) !== Y) throw Error("Point is not on elliptic curve");
	}
	equals(e) {
		return this.x === e.x && this.y === e.y;
	}
	negate() {
		return new e(this.x, X(-this.y));
	}
	double() {
		return Hd.fromAffine(this).double().toAffine();
	}
	add(e) {
		return Hd.fromAffine(this).add(Hd.fromAffine(e)).toAffine();
	}
	subtract(e) {
		return this.add(e.negate());
	}
	multiply(e) {
		return Hd.fromAffine(this).multiply(e, this).toAffine();
	}
	multiplyAndAddUnsafe(t, n, r) {
		let i = Hd.fromAffine(this), a = n === Y || n === Ed || this !== e.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Hd.fromAffine(t).multiplyUnsafe(r), s = a.add(o);
		return s.equals(Hd.ZERO) ? void 0 : s.toAffine();
	}
};
Gd.BASE = new Gd(Ad.Gx, Ad.Gy), Gd.ZERO = new Gd(Y, Y);
function Kd(e) {
	return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function qd(e) {
	if (e.length < 2 || e[0] !== 2) throw Error(`Invalid signature integer tag: ${Qd(e)}`);
	let t = e[1], n = e.subarray(2, t + 2);
	if (!t || n.length !== t) throw Error("Invalid signature integer: wrong length");
	if (n[0] === 0 && n[1] <= 127) throw Error("Invalid signature integer: trailing length");
	return {
		data: of(n),
		left: e.subarray(t + 2)
	};
}
function Jd(e) {
	if (e.length < 2 || e[0] != 48) throw Error(`Invalid signature tag: ${Qd(e)}`);
	if (e[1] !== e.length - 2) throw Error("Invalid signature: incorrect length");
	let { data: t, left: n } = qd(e.subarray(2)), { data: r, left: i } = qd(n);
	if (i.length) throw Error(`Invalid signature: left bytes after parsing: ${Qd(i)}`);
	return {
		r: t,
		s: r
	};
}
var Yd = class e {
	constructor(e, t) {
		this.r = e, this.s = t, this.assertValidity();
	}
	static fromCompact(t) {
		let n = t instanceof Uint8Array, r = "Signature.fromCompact";
		if (typeof t != "string" && !n) throw TypeError(`${r}: Expected string or Uint8Array`);
		let i = n ? Qd(t) : t;
		if (i.length !== 128) throw Error(`${r}: Expected 64-byte hex`);
		return new e(rf(i.slice(0, 64)), rf(i.slice(64, 128)));
	}
	static fromDER(t) {
		let n = t instanceof Uint8Array;
		if (typeof t != "string" && !n) throw TypeError("Signature.fromDER: Expected string or Uint8Array");
		let { r, s: i } = Jd(n ? t : af(t));
		return new e(r, i);
	}
	static fromHex(e) {
		return this.fromDER(e);
	}
	assertValidity() {
		let { r: e, s: t } = this;
		if (!vf(e)) throw Error("Invalid Signature: r must be 0 < r < n");
		if (!vf(t)) throw Error("Invalid Signature: s must be 0 < s < n");
	}
	hasHighS() {
		let e = Ad.n >> Ed;
		return this.s > e;
	}
	normalizeS() {
		return this.hasHighS() ? new e(this.r, X(-this.s, Ad.n)) : this;
	}
	toDERRawBytes() {
		return af(this.toDERHex());
	}
	toDERHex() {
		let e = Kd(nf(this.s)), t = Kd(nf(this.r)), n = e.length / 2, r = t.length / 2, i = nf(n), a = nf(r);
		return `30${nf(r + n + 4)}02${a}${t}02${i}${e}`;
	}
	toRawBytes() {
		return this.toDERRawBytes();
	}
	toHex() {
		return this.toDERHex();
	}
	toCompactRawBytes() {
		return af(this.toCompactHex());
	}
	toCompactHex() {
		return ef(this.r) + ef(this.s);
	}
};
function Xd(...e) {
	if (!e.every((e) => e instanceof Uint8Array)) throw Error("Uint8Array list expected");
	if (e.length === 1) return e[0];
	let t = e.reduce((e, t) => e + t.length, 0), n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t++) {
		let i = e[t];
		n.set(i, r), r += i.length;
	}
	return n;
}
var Zd = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Qd(e) {
	if (!(e instanceof Uint8Array)) throw Error("Expected Uint8Array");
	let t = "";
	for (let n = 0; n < e.length; n++) t += Zd[e[n]];
	return t;
}
var $d = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ef(e) {
	if (typeof e != "bigint") throw Error("Expected bigint");
	if (!(Y <= e && e < $d)) throw Error("Expected number 0 <= n < 2^256");
	return e.toString(16).padStart(64, "0");
}
function tf(e) {
	let t = af(ef(e));
	if (t.length !== 32) throw Error("Error: expected 32 bytes");
	return t;
}
function nf(e) {
	let t = e.toString(16);
	return t.length & 1 ? `0${t}` : t;
}
function rf(e) {
	if (typeof e != "string") throw TypeError("hexToNumber: expected string, got " + typeof e);
	return BigInt(`0x${e}`);
}
function af(e) {
	if (typeof e != "string") throw TypeError("hexToBytes: expected string, got " + typeof e);
	if (e.length % 2) throw Error("hexToBytes: received invalid unpadded hex" + e.length);
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < t.length; n++) {
		let r = n * 2, i = e.slice(r, r + 2), a = Number.parseInt(i, 16);
		if (Number.isNaN(a) || a < 0) throw Error("Invalid byte sequence");
		t[n] = a;
	}
	return t;
}
function of(e) {
	return rf(Qd(e));
}
function sf(e) {
	return e instanceof Uint8Array ? Uint8Array.from(e) : af(e);
}
function cf(e) {
	if (typeof e == "number" && Number.isSafeInteger(e) && e > 0) return BigInt(e);
	if (typeof e == "bigint" && vf(e)) return e;
	throw TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function X(e, t = Ad.P) {
	let n = e % t;
	return n >= Y ? n : t + n;
}
function lf(e, t) {
	let { P: n } = Ad, r = e;
	for (; t-- > Y;) r *= r, r %= n;
	return r;
}
function uf(e) {
	let { P: t } = Ad, n = BigInt(6), r = BigInt(11), i = BigInt(22), a = BigInt(23), o = BigInt(44), s = BigInt(88), c = e * e * e % t, l = c * c * e % t, u = lf(lf(lf(l, Od) * l % t, Od) * l % t, Dd) * c % t, d = lf(u, r) * u % t, f = lf(d, i) * d % t, p = lf(f, o) * f % t, m = lf(lf(lf(lf(lf(lf(p, s) * p % t, o) * f % t, Od) * l % t, a) * d % t, n) * c % t, Dd);
	if (m * m % t !== e) throw Error("Cannot find square root");
	return m;
}
function df(e, t = Ad.P) {
	if (e === Y || t <= Y) throw Error(`invert: expected positive integers, got n=${e} mod=${t}`);
	let n = X(e, t), r = t, i = Y, a = Ed, o = Ed, s = Y;
	for (; n !== Y;) {
		let e = r / n, t = r % n, c = i - o * e, l = a - s * e;
		r = n, n = t, i = o, a = s, o = c, s = l;
	}
	if (r !== Ed) throw Error("invert: does not exist");
	return X(i, t);
}
function ff(e, t = Ad.P) {
	let n = Array(e.length), r = df(e.reduce((e, r, i) => r === Y ? e : (n[i] = e, X(e * r, t)), Ed), t);
	return e.reduceRight((e, r, i) => r === Y ? e : (n[i] = X(e * n[i], t), X(e * r, t)), r), n;
}
function pf(e) {
	let t = e.length * 8 - 256, n = of(e);
	return t > 0 ? n >> BigInt(t) : n;
}
function mf(e, t = !1) {
	let n = pf(e);
	if (t) return n;
	let { n: r } = Ad;
	return n >= r ? n - r : n;
}
var hf, gf, _f = class {
	constructor(e, t) {
		if (this.hashLen = e, this.qByteLen = t, typeof e != "number" || e < 2) throw Error("hashLen must be a number");
		if (typeof t != "number" || t < 2) throw Error("qByteLen must be a number");
		this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
	}
	hmac(...e) {
		return Z.hmacSha256(this.k, ...e);
	}
	hmacSync(...e) {
		return gf(this.k, ...e);
	}
	checkSync() {
		if (typeof gf != "function") throw new Bd("hmacSha256Sync needs to be set");
	}
	incr() {
		if (this.counter >= 1e3) throw Error("Tried 1,000 k values for sign(), all were invalid");
		this.counter += 1;
	}
	async reseed(e = /* @__PURE__ */ new Uint8Array()) {
		this.k = await this.hmac(this.v, Uint8Array.from([0]), e), this.v = await this.hmac(this.v), e.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), e), this.v = await this.hmac(this.v));
	}
	reseedSync(e = /* @__PURE__ */ new Uint8Array()) {
		this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), e), this.v = this.hmacSync(this.v), e.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), e), this.v = this.hmacSync(this.v));
	}
	async generate() {
		this.incr();
		let e = 0, t = [];
		for (; e < this.qByteLen;) {
			this.v = await this.hmac(this.v);
			let n = this.v.slice();
			t.push(n), e += this.v.length;
		}
		return Xd(...t);
	}
	generateSync() {
		this.checkSync(), this.incr();
		let e = 0, t = [];
		for (; e < this.qByteLen;) {
			this.v = this.hmacSync(this.v);
			let n = this.v.slice();
			t.push(n), e += this.v.length;
		}
		return Xd(...t);
	}
};
function vf(e) {
	return Y < e && e < Ad.n;
}
function yf(e) {
	return Y < e && e < Ad.P;
}
function bf(e, t, n, r = !0) {
	let { n: i } = Ad, a = mf(e, !0);
	if (!vf(a)) return;
	let o = df(a, i), s = Gd.BASE.multiply(a), c = X(s.x, i);
	if (c === Y) return;
	let l = X(o * X(t + n * c, i), i);
	if (l === Y) return;
	let u = new Yd(c, l), d = (s.x === u.r ? 0 : 2) | Number(s.y & Ed);
	return r && u.hasHighS() && (u = u.normalizeS(), d ^= 1), {
		sig: u,
		recovery: d
	};
}
function xf(e) {
	let t;
	if (typeof e == "bigint") t = e;
	else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0) t = BigInt(e);
	else if (typeof e == "string") {
		if (e.length !== 64) throw Error("Expected 32 bytes of private key");
		t = rf(e);
	} else if (e instanceof Uint8Array) {
		if (e.length !== Pd) throw Error("Expected 32 bytes of private key");
		t = of(e);
	} else throw TypeError("Expected valid private key");
	if (!vf(t)) throw Error("Expected private key: 0 < key < n");
	return t;
}
function Sf(e) {
	return e instanceof Gd ? (e.assertValidity(), e) : Gd.fromHex(e);
}
function Cf(e) {
	if (e instanceof Yd) return e.assertValidity(), e;
	try {
		return Yd.fromDER(e);
	} catch {
		return Yd.fromCompact(e);
	}
}
function wf(e, t = !1) {
	return Gd.fromPrivateKey(e).toRawBytes(t);
}
function Tf(e) {
	let t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
	return t ? r === Id || r === Ld : n ? r === 66 || r === 130 : e instanceof Gd;
}
function Ef(e, t, n = !1) {
	if (Tf(e)) throw TypeError("getSharedSecret: first arg must be private key");
	if (!Tf(t)) throw TypeError("getSharedSecret: second arg must be public key");
	let r = Sf(t);
	return r.assertValidity(), r.multiply(xf(e)).toRawBytes(n);
}
function Df(e) {
	return of(e.length > Nd ? e.slice(0, Nd) : e);
}
function Of(e) {
	let t = Df(e), n = X(t, Ad.n);
	return kf(n < Y ? t : n);
}
function kf(e) {
	return tf(e);
}
function Af(e, t, n) {
	if (e == null) throw Error(`sign: expected valid message hash, not "${e}"`);
	let r = sf(e), i = xf(t), a = [kf(i), Of(r)];
	if (n != null) {
		n === !0 && (n = Z.randomBytes(Nd));
		let e = sf(n);
		if (e.length !== Nd) throw Error(`sign: Expected ${Nd} bytes of extra data`);
		a.push(e);
	}
	return {
		seed: Xd(...a),
		m: Df(r),
		d: i
	};
}
function jf(e, t) {
	let { sig: n, recovery: r } = e, { der: i, recovered: a } = Object.assign({
		canonical: !0,
		der: !0
	}, t), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
	return a ? [o, r] : o;
}
function Mf(e, t, n = {}) {
	let { seed: r, m: i, d: a } = Af(e, t, n.extraEntropy), o = new _f(Fd, Pd);
	o.reseedSync(r);
	let s;
	for (; !(s = bf(o.generateSync(), i, a, n.canonical));) o.reseedSync();
	return jf(s, n);
}
var Nf = { strict: !0 };
function Pf(e, t, n, r = Nf) {
	let i;
	try {
		i = Cf(e), t = sf(t);
	} catch {
		return !1;
	}
	let { r: a, s: o } = i;
	if (r.strict && i.hasHighS()) return !1;
	let s = mf(t), c;
	try {
		c = Sf(n);
	} catch {
		return !1;
	}
	let { n: l } = Ad, u = df(o, l), d = X(s * u, l), f = X(a * u, l), p = Gd.BASE.multiplyAndAddUnsafe(c, d, f);
	return p ? X(p.x, l) === a : !1;
}
function Ff(e) {
	return X(of(e), Ad.n);
}
var If = class e {
	constructor(e, t) {
		this.r = e, this.s = t, this.assertValidity();
	}
	static fromHex(t) {
		let n = sf(t);
		if (n.length !== 64) throw TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
		let r = of(n.subarray(0, 32)), i = of(n.subarray(32, 64));
		return new e(r, i);
	}
	assertValidity() {
		let { r: e, s: t } = this;
		if (!yf(e) || !vf(t)) throw Error("Invalid signature");
	}
	toHex() {
		return ef(this.r) + ef(this.s);
	}
	toRawBytes() {
		return af(this.toHex());
	}
};
function Lf(e) {
	return Gd.fromPrivateKey(e).toRawX();
}
var Rf = class {
	constructor(e, t, n = Z.randomBytes()) {
		if (e == null) throw TypeError(`sign: Expected valid message, not "${e}"`);
		this.m = sf(e);
		let { x: r, scalar: i } = this.getScalar(xf(t));
		if (this.px = r, this.d = i, this.rand = sf(n), this.rand.length !== 32) throw TypeError("sign: Expected 32 bytes of aux randomness");
	}
	getScalar(e) {
		let t = Gd.fromPrivateKey(e);
		return {
			point: t,
			scalar: t.hasEvenY() ? e : Ad.n - e,
			x: t.toRawX()
		};
	}
	initNonce(e, t) {
		return tf(e ^ of(t));
	}
	finalizeNonce(e) {
		let t = X(of(e), Ad.n);
		if (t === Y) throw Error("sign: Creation of signature failed. k is zero");
		let { point: n, x: r, scalar: i } = this.getScalar(t);
		return {
			R: n,
			rx: r,
			k: i
		};
	}
	finalizeSig(e, t, n, r) {
		return new If(e.x, X(t + n * r, Ad.n)).toRawBytes();
	}
	error() {
		throw Error("sign: Invalid signature produced");
	}
	async calc() {
		let { m: e, d: t, px: n, rand: r } = this, i = Z.taggedHash, a = this.initNonce(t, await i(qf.aux, r)), { R: o, rx: s, k: c } = this.finalizeNonce(await i(qf.nonce, a, n, e)), l = Ff(await i(qf.challenge, s, n, e)), u = this.finalizeSig(o, c, l, t);
		return await Uf(u, e, n) || this.error(), u;
	}
	calcSync() {
		let { m: e, d: t, px: n, rand: r } = this, i = Z.taggedHashSync, a = this.initNonce(t, i(qf.aux, r)), { R: o, rx: s, k: c } = this.finalizeNonce(i(qf.nonce, a, n, e)), l = Ff(i(qf.challenge, s, n, e)), u = this.finalizeSig(o, c, l, t);
		return Wf(u, e, n) || this.error(), u;
	}
};
async function zf(e, t, n) {
	return new Rf(e, t, n).calc();
}
function Bf(e, t, n) {
	return new Rf(e, t, n).calcSync();
}
function Vf(e, t, n) {
	let r = e instanceof If, i = r ? e : If.fromHex(e);
	return r && i.assertValidity(), {
		...i,
		m: sf(t),
		P: Sf(n)
	};
}
function Hf(e, t, n, r) {
	let i = Gd.BASE.multiplyAndAddUnsafe(t, xf(n), X(-r, Ad.n));
	return !(!i || !i.hasEvenY() || i.x !== e);
}
async function Uf(e, t, n) {
	try {
		let { r, s: i, m: a, P: o } = Vf(e, t, n);
		return Hf(r, o, i, Ff(await Z.taggedHash(qf.challenge, tf(r), o.toRawX(), a)));
	} catch {
		return !1;
	}
}
function Wf(e, t, n) {
	try {
		let { r, s: i, m: a, P: o } = Vf(e, t, n);
		return Hf(r, o, i, Ff(Z.taggedHashSync(qf.challenge, tf(r), o.toRawX(), a)));
	} catch (e) {
		if (e instanceof Bd) throw e;
		return !1;
	}
}
var Gf = {
	Signature: If,
	getPublicKey: Lf,
	sign: zf,
	verify: Uf,
	signSync: Bf,
	verifySync: Wf
};
Gd.BASE._setWindowSize(8);
var Kf = {
	node: Td,
	web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, qf = {
	challenge: "BIP0340/challenge",
	aux: "BIP0340/aux",
	nonce: "BIP0340/nonce"
}, Jf = {}, Z = {
	bytesToHex: Qd,
	hexToBytes: af,
	concatBytes: Xd,
	mod: X,
	invert: df,
	isValidPrivateKey(e) {
		try {
			return xf(e), !0;
		} catch {
			return !1;
		}
	},
	_bigintTo32Bytes: tf,
	_normalizePrivateKey: xf,
	hashToPrivateKey: (e) => {
		if (e = sf(e), e.length < 40 || e.length > 1024) throw Error("Expected valid bytes of private key as per FIPS 186");
		return tf(X(of(e), Ad.n - Ed) + Ed);
	},
	randomBytes: (e = 32) => {
		if (Kf.web) return Kf.web.getRandomValues(new Uint8Array(e));
		if (Kf.node) {
			let { randomBytes: t } = Kf.node;
			return Uint8Array.from(t(e));
		}
		throw Error("The environment doesn't have randomBytes function");
	},
	randomPrivateKey: () => Z.hashToPrivateKey(Z.randomBytes(40)),
	precompute(e = 8, t = Gd.BASE) {
		let n = t === Gd.BASE ? t : new Gd(t.x, t.y);
		return n._setWindowSize(e), n.multiply(Od), n;
	},
	sha256: async (...e) => {
		if (Kf.web) {
			let t = await Kf.web.subtle.digest("SHA-256", Xd(...e));
			return new Uint8Array(t);
		}
		if (Kf.node) {
			let { createHash: t } = Kf.node, n = t("sha256");
			return e.forEach((e) => n.update(e)), Uint8Array.from(n.digest());
		}
		throw Error("The environment doesn't have sha256 function");
	},
	hmacSha256: async (e, ...t) => {
		if (Kf.web) {
			let n = await Kf.web.subtle.importKey("raw", e, {
				name: "HMAC",
				hash: { name: "SHA-256" }
			}, !1, ["sign"]), r = Xd(...t), i = await Kf.web.subtle.sign("HMAC", n, r);
			return new Uint8Array(i);
		}
		if (Kf.node) {
			let { createHmac: n } = Kf.node, r = n("sha256", e);
			return t.forEach((e) => r.update(e)), Uint8Array.from(r.digest());
		}
		throw Error("The environment doesn't have hmac-sha256 function");
	},
	sha256Sync: void 0,
	hmacSha256Sync: void 0,
	taggedHash: async (e, ...t) => {
		let n = Jf[e];
		if (n === void 0) {
			let t = await Z.sha256(Uint8Array.from(e, (e) => e.charCodeAt(0)));
			n = Xd(t, t), Jf[e] = n;
		}
		return Z.sha256(n, ...t);
	},
	taggedHashSync: (e, ...t) => {
		if (typeof hf != "function") throw new Bd("sha256Sync is undefined, you need to set it");
		let n = Jf[e];
		if (n === void 0) {
			let t = hf(Uint8Array.from(e, (e) => e.charCodeAt(0)));
			n = Xd(t, t), Jf[e] = n;
		}
		return hf(n, ...t);
	},
	_JacobianPoint: Hd
};
Object.defineProperties(Z, {
	sha256Sync: {
		configurable: !1,
		get() {
			return hf;
		},
		set(e) {
			hf ||= e;
		}
	},
	hmacSha256Sync: {
		configurable: !1,
		get() {
			return gf;
		},
		set(e) {
			gf ||= e;
		}
	}
});
var Yf = {};
Object.defineProperty(Yf, "__esModule", { value: !0 }), Yf.sha224 = Yf.sha256 = void 0;
var Xf = {};
Object.defineProperty(Xf, "__esModule", { value: !0 }), Xf.SHA2 = void 0;
var Zf = {};
Object.defineProperty(Zf, "__esModule", { value: !0 }), Zf.output = Zf.exists = Zf.hash = Zf.bytes = Zf.bool = Zf.number = void 0;
function Qf(e) {
	if (!Number.isSafeInteger(e) || e < 0) throw Error(`Wrong positive integer: ${e}`);
}
Zf.number = Qf;
function $f(e) {
	if (typeof e != "boolean") throw Error(`Expected boolean, not ${e}`);
}
Zf.bool = $f;
function ep(e, ...t) {
	if (!(e instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
	if (t.length > 0 && !t.includes(e.length)) throw TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
Zf.bytes = ep;
function tp(e) {
	if (typeof e != "function" || typeof e.create != "function") throw Error("Hash should be wrapped by utils.wrapConstructor");
	Qf(e.outputLen), Qf(e.blockLen);
}
Zf.hash = tp;
function np(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
Zf.exists = np;
function rp(e, t) {
	ep(e);
	let n = t.outputLen;
	if (e.length < n) throw Error(`digestInto() expects output buffer of length at least ${n}`);
}
Zf.output = rp, Zf.default = {
	number: Qf,
	bool: $f,
	bytes: ep,
	hash: tp,
	exists: np,
	output: rp
};
var Q = {};
Object.defineProperty(Q, "__esModule", { value: !0 }), Q.randomBytes = Q.wrapConstructorWithOpts = Q.wrapConstructor = Q.checkOpts = Q.Hash = Q.concatBytes = Q.toBytes = Q.utf8ToBytes = Q.asyncLoop = Q.nextTick = Q.hexToBytes = Q.bytesToHex = Q.isLE = Q.rotr = Q.createView = Q.u32 = Q.u8 = void 0;
var ip = {};
if (Object.defineProperty(ip, "__esModule", { value: !0 }), ip.crypto = void 0, ip.crypto = {
	node: void 0,
	web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Q.u8 = (e) => new Uint8Array(e.buffer, e.byteOffset, e.byteLength), Q.u32 = (e) => new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4)), Q.createView = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Q.rotr = (e, t) => e << 32 - t | e >>> t, Q.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, !Q.isLE) throw Error("Non little-endian hardware is not supported");
var ap = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function op(e) {
	if (!(e instanceof Uint8Array)) throw Error("Uint8Array expected");
	let t = "";
	for (let n = 0; n < e.length; n++) t += ap[e[n]];
	return t;
}
Q.bytesToHex = op;
function sp(e) {
	if (typeof e != "string") throw TypeError("hexToBytes: expected string, got " + typeof e);
	if (e.length % 2) throw Error("hexToBytes: received invalid unpadded hex");
	let t = new Uint8Array(e.length / 2);
	for (let n = 0; n < t.length; n++) {
		let r = n * 2, i = e.slice(r, r + 2), a = Number.parseInt(i, 16);
		if (Number.isNaN(a) || a < 0) throw Error("Invalid byte sequence");
		t[n] = a;
	}
	return t;
}
Q.hexToBytes = sp, Q.nextTick = async () => {};
async function cp(e, t, n) {
	let r = Date.now();
	for (let i = 0; i < e; i++) {
		n(i);
		let e = Date.now() - r;
		e >= 0 && e < t || (await (0, Q.nextTick)(), r += e);
	}
}
Q.asyncLoop = cp;
function lp(e) {
	if (typeof e != "string") throw TypeError(`utf8ToBytes expected string, got ${typeof e}`);
	return new TextEncoder().encode(e);
}
Q.utf8ToBytes = lp;
function up(e) {
	if (typeof e == "string" && (e = lp(e)), !(e instanceof Uint8Array)) throw TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
	return e;
}
Q.toBytes = up;
function dp(...e) {
	if (!e.every((e) => e instanceof Uint8Array)) throw Error("Uint8Array list expected");
	if (e.length === 1) return e[0];
	let t = e.reduce((e, t) => e + t.length, 0), n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t++) {
		let i = e[t];
		n.set(i, r), r += i.length;
	}
	return n;
}
Q.concatBytes = dp, Q.Hash = class {
	clone() {
		return this._cloneInto();
	}
};
var fp = (e) => Object.prototype.toString.call(e) === "[object Object]" && e.constructor === Object;
function pp(e, t) {
	if (t !== void 0 && (typeof t != "object" || !fp(t))) throw TypeError("Options should be object or undefined");
	return Object.assign(e, t);
}
Q.checkOpts = pp;
function mp(e) {
	let t = (t) => e().update(up(t)).digest(), n = e();
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
Q.wrapConstructor = mp;
function hp(e) {
	let t = (t, n) => e(n).update(up(t)).digest(), n = e({});
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (t) => e(t), t;
}
Q.wrapConstructorWithOpts = hp;
function gp(e = 32) {
	if (ip.crypto.web) return ip.crypto.web.getRandomValues(new Uint8Array(e));
	if (ip.crypto.node) return new Uint8Array(ip.crypto.node.randomBytes(e).buffer);
	throw Error("The environment doesn't have randomBytes function");
}
Q.randomBytes = gp;
function _p(e, t, n, r) {
	if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
	let i = BigInt(32), a = BigInt(4294967295), o = Number(n >> i & a), s = Number(n & a), c = r ? 4 : 0, l = r ? 0 : 4;
	e.setUint32(t + c, o, r), e.setUint32(t + l, s, r);
}
Xf.SHA2 = class extends Q.Hash {
	constructor(e, t, n, r) {
		super(), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = (0, Q.createView)(this.buffer);
	}
	update(e) {
		Zf.default.exists(this);
		let { view: t, buffer: n, blockLen: r } = this;
		e = (0, Q.toBytes)(e);
		let i = e.length;
		for (let a = 0; a < i;) {
			let o = Math.min(r - this.pos, i - a);
			if (o === r) {
				let t = (0, Q.createView)(e);
				for (; r <= i - a; a += r) this.process(t, a);
			} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		Zf.default.exists(this), Zf.default.output(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > r - a && (this.process(n, 0), a = 0);
		for (let e = a; e < r; e++) t[e] = 0;
		_p(n, r - 8, BigInt(this.length * 8), i), this.process(n, 0);
		let o = (0, Q.createView)(e), s = this.outputLen;
		if (s % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
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
		return e.length = r, e.pos = o, e.finished = i, e.destroyed = a, r % t && e.buffer.set(n), e;
	}
};
var vp = (e, t, n) => e & t ^ ~e & n, yp = (e, t, n) => e & t ^ e & n ^ t & n, bp = new Uint32Array([
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
]), xp = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), Sp = /* @__PURE__ */ new Uint32Array(64), Cp = class extends Xf.SHA2 {
	constructor() {
		super(64, 32, 8, !1), this.A = xp[0] | 0, this.B = xp[1] | 0, this.C = xp[2] | 0, this.D = xp[3] | 0, this.E = xp[4] | 0, this.F = xp[5] | 0, this.G = xp[6] | 0, this.H = xp[7] | 0;
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
		for (let n = 0; n < 16; n++, t += 4) Sp[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = Sp[e - 15], n = Sp[e - 2], r = (0, Q.rotr)(t, 7) ^ (0, Q.rotr)(t, 18) ^ t >>> 3, i = (0, Q.rotr)(n, 17) ^ (0, Q.rotr)(n, 19) ^ n >>> 10;
			Sp[e] = i + Sp[e - 7] + r + Sp[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = (0, Q.rotr)(o, 6) ^ (0, Q.rotr)(o, 11) ^ (0, Q.rotr)(o, 25), u = l + t + vp(o, s, c) + bp[e] + Sp[e] | 0, d = ((0, Q.rotr)(n, 2) ^ (0, Q.rotr)(n, 13) ^ (0, Q.rotr)(n, 22)) + yp(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		Sp.fill(0);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
	}
}, wp = class extends Cp {
	constructor() {
		super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
	}
};
Yf.sha256 = (0, Q.wrapConstructor)(() => new Cp()), Yf.sha224 = (0, Q.wrapConstructor)(() => new wp());
function Tp(e) {
	if (!Number.isSafeInteger(e)) throw Error(`Wrong integer: ${e}`);
}
function Ep(...e) {
	let t = (e, t) => (n) => e(t(n));
	return {
		encode: Array.from(e).reverse().reduce((e, n) => e ? t(e, n.encode) : n.encode, void 0),
		decode: e.reduce((e, n) => e ? t(e, n.decode) : n.decode, void 0)
	};
}
function Dp(e) {
	return {
		encode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw Error("alphabet.encode input should be an array of numbers");
			return t.map((t) => {
				if (Tp(t), t < 0 || t >= e.length) throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);
				return e[t];
			});
		},
		decode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw Error("alphabet.decode input should be array of strings");
			return t.map((t) => {
				if (typeof t != "string") throw Error(`alphabet.decode: not string element=${t}`);
				let n = e.indexOf(t);
				if (n === -1) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
				return n;
			});
		}
	};
}
function Op(e = "") {
	if (typeof e != "string") throw Error("join separator should be string");
	return {
		encode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "string") throw Error("join.encode input should be array of strings");
			for (let e of t) if (typeof e != "string") throw Error(`join.encode: non-string input=${e}`);
			return t.join(e);
		},
		decode: (t) => {
			if (typeof t != "string") throw Error("join.decode input should be string");
			return t.split(e);
		}
	};
}
function kp(e, t = "=") {
	if (Tp(e), typeof t != "string") throw Error("padding chr should be string");
	return {
		encode(n) {
			if (!Array.isArray(n) || n.length && typeof n[0] != "string") throw Error("padding.encode input should be array of strings");
			for (let e of n) if (typeof e != "string") throw Error(`padding.encode: non-string input=${e}`);
			for (; n.length * e % 8;) n.push(t);
			return n;
		},
		decode(n) {
			if (!Array.isArray(n) || n.length && typeof n[0] != "string") throw Error("padding.encode input should be array of strings");
			for (let e of n) if (typeof e != "string") throw Error(`padding.decode: non-string input=${e}`);
			let r = n.length;
			if (r * e % 8) throw Error("Invalid padding: string should have whole number of bytes");
			for (; r > 0 && n[r - 1] === t; r--) if (!((r - 1) * e % 8)) throw Error("Invalid padding: string has too much padding");
			return n.slice(0, r);
		}
	};
}
function Ap(e) {
	if (typeof e != "function") throw Error("normalize fn should be function");
	return {
		encode: (e) => e,
		decode: (t) => e(t)
	};
}
function jp(e, t, n) {
	if (t < 2) throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);
	if (n < 2) throw Error(`convertRadix: wrong to=${n}, base cannot be less than 2`);
	if (!Array.isArray(e)) throw Error("convertRadix: data should be array");
	if (!e.length) return [];
	let r = 0, i = [], a = Array.from(e);
	for (a.forEach((e) => {
		if (Tp(e), e < 0 || e >= t) throw Error(`Wrong integer: ${e}`);
	});;) {
		let e = 0, o = !0;
		for (let i = r; i < a.length; i++) {
			let s = a[i], c = t * e + s;
			if (!Number.isSafeInteger(c) || t * e / t !== e || c - s !== t * e || (e = c % n, a[i] = Math.floor(c / n), !Number.isSafeInteger(a[i]) || a[i] * n + e !== c)) throw Error("convertRadix: carry overflow");
			if (o) a[i] ? o = !1 : r = i;
			else continue;
		}
		if (i.push(e), o) break;
	}
	for (let t = 0; t < e.length - 1 && e[t] === 0; t++) i.push(0);
	return i.reverse();
}
var Mp = (e, t) => t ? Mp(t, e % t) : e, Np = (e, t) => e + (t - Mp(e, t));
function Pp(e, t, n, r) {
	if (!Array.isArray(e)) throw Error("convertRadix2: data should be array");
	if (t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
	if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
	if (Np(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${Np(t, n)}`);
	let i = 0, a = 0, o = 2 ** n - 1, s = [];
	for (let r of e) {
		if (Tp(r), r >= 2 ** t) throw Error(`convertRadix2: invalid data word=${r} from=${t}`);
		if (i = i << t | r, a + t > 32) throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);
		for (a += t; a >= n; a -= n) s.push((i >> a - n & o) >>> 0);
		i &= 2 ** a - 1;
	}
	if (i = i << n - a & o, !r && a >= t) throw Error("Excess padding");
	if (!r && i) throw Error(`Non-zero padding: ${i}`);
	return r && a > 0 && s.push(i >>> 0), s;
}
function Fp(e) {
	return Tp(e), {
		encode: (t) => {
			if (!(t instanceof Uint8Array)) throw Error("radix.encode input should be Uint8Array");
			return jp(Array.from(t), 256, e);
		},
		decode: (t) => {
			if (!Array.isArray(t) || t.length && typeof t[0] != "number") throw Error("radix.decode input should be array of strings");
			return Uint8Array.from(jp(t, e, 256));
		}
	};
}
function Ip(e, t = !1) {
	if (Tp(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
	if (Np(8, e) > 32 || Np(e, 8) > 32) throw Error("radix2: carry overflow");
	return {
		encode: (n) => {
			if (!(n instanceof Uint8Array)) throw Error("radix2.encode input should be Uint8Array");
			return Pp(Array.from(n), 8, e, !t);
		},
		decode: (n) => {
			if (!Array.isArray(n) || n.length && typeof n[0] != "number") throw Error("radix2.decode input should be array of strings");
			return Uint8Array.from(Pp(n, e, 8, t));
		}
	};
}
function Lp(e) {
	if (typeof e != "function") throw Error("unsafeWrapper fn should be function");
	return function(...t) {
		try {
			return e.apply(null, t);
		} catch {}
	};
}
function Rp(e, t) {
	if (Tp(e), typeof t != "function") throw Error("checksum fn should be function");
	return {
		encode(n) {
			if (!(n instanceof Uint8Array)) throw Error("checksum.encode: input should be Uint8Array");
			let r = t(n).slice(0, e), i = new Uint8Array(n.length + e);
			return i.set(n), i.set(r, n.length), i;
		},
		decode(n) {
			if (!(n instanceof Uint8Array)) throw Error("checksum.decode: input should be Uint8Array");
			let r = n.slice(0, -e), i = t(r).slice(0, e), a = n.slice(-e);
			for (let t = 0; t < e; t++) if (i[t] !== a[t]) throw Error("Invalid checksum");
			return r;
		}
	};
}
var zp = {
	alphabet: Dp,
	chain: Ep,
	checksum: Rp,
	radix: Fp,
	radix2: Ip,
	join: Op,
	padding: kp
}, Bp = Ep(Ip(4), Dp("0123456789ABCDEF"), Op("")), Vp = Ep(Ip(5), Dp("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), kp(5), Op(""));
Ep(Ip(5), Dp("0123456789ABCDEFGHIJKLMNOPQRSTUV"), kp(5), Op("")), Ep(Ip(5), Dp("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), Op(""), Ap((e) => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var Hp = Ep(Ip(6), Dp("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), kp(6), Op("")), Up = Ep(Ip(6), Dp("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), kp(6), Op("")), Wp = (e) => Ep(Fp(58), Dp(e), Op("")), Gp = Wp("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
Wp("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), Wp("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
var Kp = [
	0,
	2,
	3,
	5,
	6,
	7,
	9,
	10,
	11
], qp = {
	encode(e) {
		let t = "";
		for (let n = 0; n < e.length; n += 8) {
			let r = e.subarray(n, n + 8);
			t += Gp.encode(r).padStart(Kp[r.length], "1");
		}
		return t;
	},
	decode(e) {
		let t = [];
		for (let n = 0; n < e.length; n += 11) {
			let r = e.slice(n, n + 11), i = Kp.indexOf(r.length), a = Gp.decode(r);
			for (let e = 0; e < a.length - i; e++) if (a[e] !== 0) throw Error("base58xmr: wrong padding");
			t = t.concat(Array.from(a.slice(a.length - i)));
		}
		return Uint8Array.from(t);
	}
}, Jp = (e) => Ep(Rp(4, (t) => e(e(t))), Gp), Yp = Ep(Dp("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), Op("")), Xp = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function Zp(e) {
	let t = e >> 25, n = (e & 33554431) << 5;
	for (let e = 0; e < Xp.length; e++) (t >> e & 1) == 1 && (n ^= Xp[e]);
	return n;
}
function Qp(e, t, n = 1) {
	let r = e.length, i = 1;
	for (let t = 0; t < r; t++) {
		let n = e.charCodeAt(t);
		if (n < 33 || n > 126) throw Error(`Invalid prefix (${e})`);
		i = Zp(i) ^ n >> 5;
	}
	i = Zp(i);
	for (let t = 0; t < r; t++) i = Zp(i) ^ e.charCodeAt(t) & 31;
	for (let e of t) i = Zp(i) ^ e;
	for (let e = 0; e < 6; e++) i = Zp(i);
	return i ^= n, Yp.encode(Pp([i % 2 ** 30], 30, 5, !1));
}
function $p(e) {
	let t = e === "bech32" ? 1 : 734539939, n = Ip(5), r = n.decode, i = n.encode, a = Lp(r);
	function o(e, n, r = 90) {
		if (typeof e != "string") throw Error(`bech32.encode prefix should be string, not ${typeof e}`);
		if (!Array.isArray(n) || n.length && typeof n[0] != "number") throw Error(`bech32.encode words should be array of numbers, not ${typeof n}`);
		let i = e.length + 7 + n.length;
		if (r !== !1 && i > r) throw TypeError(`Length ${i} exceeds limit ${r}`);
		return e = e.toLowerCase(), `${e}1${Yp.encode(n)}${Qp(e, n, t)}`;
	}
	function s(e, n = 90) {
		if (typeof e != "string") throw Error(`bech32.decode input should be string, not ${typeof e}`);
		if (e.length < 8 || n !== !1 && e.length > n) throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${n})`);
		let r = e.toLowerCase();
		if (e !== r && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
		e = r;
		let i = e.lastIndexOf("1");
		if (i === 0 || i === -1) throw Error("Letter \"1\" must be present between prefix and data only");
		let a = e.slice(0, i), o = e.slice(i + 1);
		if (o.length < 6) throw Error("Data must be at least 6 characters long");
		let s = Yp.decode(o).slice(0, -6), c = Qp(a, s, t);
		if (!o.endsWith(c)) throw Error(`Invalid checksum in ${e}: expected "${c}"`);
		return {
			prefix: a,
			words: s
		};
	}
	let c = Lp(s);
	function l(e) {
		let { prefix: t, words: n } = s(e, !1);
		return {
			prefix: t,
			words: n,
			bytes: r(n)
		};
	}
	return {
		encode: o,
		decode: s,
		decodeToBytes: l,
		decodeUnsafe: c,
		fromWords: r,
		fromWordsUnsafe: a,
		toWords: i
	};
}
var em = $p("bech32");
$p("bech32m");
var tm = {
	utf8: {
		encode: (e) => new TextDecoder().decode(e),
		decode: (e) => new TextEncoder().encode(e)
	},
	hex: Ep(Ip(4), Dp("0123456789abcdef"), Op(""), Ap((e) => {
		if (typeof e != "string" || e.length % 2) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
		return e.toLowerCase();
	})),
	base16: Bp,
	base32: Vp,
	base64: Hp,
	base64url: Up,
	base58: Gp,
	base58xmr: qp
};
`${Object.keys(tm).join(", ")}`;
var nm = {};
Object.defineProperty(nm, "__esModule", { value: !0 }), nm.wordlist = void 0, nm.wordlist = "abandon\nability\nable\nabout\nabove\nabsent\nabsorb\nabstract\nabsurd\nabuse\naccess\naccident\naccount\naccuse\nachieve\nacid\nacoustic\nacquire\nacross\nact\naction\nactor\nactress\nactual\nadapt\nadd\naddict\naddress\nadjust\nadmit\nadult\nadvance\nadvice\naerobic\naffair\nafford\nafraid\nagain\nage\nagent\nagree\nahead\naim\nair\nairport\naisle\nalarm\nalbum\nalcohol\nalert\nalien\nall\nalley\nallow\nalmost\nalone\nalpha\nalready\nalso\nalter\nalways\namateur\namazing\namong\namount\namused\nanalyst\nanchor\nancient\nanger\nangle\nangry\nanimal\nankle\nannounce\nannual\nanother\nanswer\nantenna\nantique\nanxiety\nany\napart\napology\nappear\napple\napprove\napril\narch\narctic\narea\narena\nargue\narm\narmed\narmor\narmy\naround\narrange\narrest\narrive\narrow\nart\nartefact\nartist\nartwork\nask\naspect\nassault\nasset\nassist\nassume\nasthma\nathlete\natom\nattack\nattend\nattitude\nattract\nauction\naudit\naugust\naunt\nauthor\nauto\nautumn\naverage\navocado\navoid\nawake\naware\naway\nawesome\nawful\nawkward\naxis\nbaby\nbachelor\nbacon\nbadge\nbag\nbalance\nbalcony\nball\nbamboo\nbanana\nbanner\nbar\nbarely\nbargain\nbarrel\nbase\nbasic\nbasket\nbattle\nbeach\nbean\nbeauty\nbecause\nbecome\nbeef\nbefore\nbegin\nbehave\nbehind\nbelieve\nbelow\nbelt\nbench\nbenefit\nbest\nbetray\nbetter\nbetween\nbeyond\nbicycle\nbid\nbike\nbind\nbiology\nbird\nbirth\nbitter\nblack\nblade\nblame\nblanket\nblast\nbleak\nbless\nblind\nblood\nblossom\nblouse\nblue\nblur\nblush\nboard\nboat\nbody\nboil\nbomb\nbone\nbonus\nbook\nboost\nborder\nboring\nborrow\nboss\nbottom\nbounce\nbox\nboy\nbracket\nbrain\nbrand\nbrass\nbrave\nbread\nbreeze\nbrick\nbridge\nbrief\nbright\nbring\nbrisk\nbroccoli\nbroken\nbronze\nbroom\nbrother\nbrown\nbrush\nbubble\nbuddy\nbudget\nbuffalo\nbuild\nbulb\nbulk\nbullet\nbundle\nbunker\nburden\nburger\nburst\nbus\nbusiness\nbusy\nbutter\nbuyer\nbuzz\ncabbage\ncabin\ncable\ncactus\ncage\ncake\ncall\ncalm\ncamera\ncamp\ncan\ncanal\ncancel\ncandy\ncannon\ncanoe\ncanvas\ncanyon\ncapable\ncapital\ncaptain\ncar\ncarbon\ncard\ncargo\ncarpet\ncarry\ncart\ncase\ncash\ncasino\ncastle\ncasual\ncat\ncatalog\ncatch\ncategory\ncattle\ncaught\ncause\ncaution\ncave\nceiling\ncelery\ncement\ncensus\ncentury\ncereal\ncertain\nchair\nchalk\nchampion\nchange\nchaos\nchapter\ncharge\nchase\nchat\ncheap\ncheck\ncheese\nchef\ncherry\nchest\nchicken\nchief\nchild\nchimney\nchoice\nchoose\nchronic\nchuckle\nchunk\nchurn\ncigar\ncinnamon\ncircle\ncitizen\ncity\ncivil\nclaim\nclap\nclarify\nclaw\nclay\nclean\nclerk\nclever\nclick\nclient\ncliff\nclimb\nclinic\nclip\nclock\nclog\nclose\ncloth\ncloud\nclown\nclub\nclump\ncluster\nclutch\ncoach\ncoast\ncoconut\ncode\ncoffee\ncoil\ncoin\ncollect\ncolor\ncolumn\ncombine\ncome\ncomfort\ncomic\ncommon\ncompany\nconcert\nconduct\nconfirm\ncongress\nconnect\nconsider\ncontrol\nconvince\ncook\ncool\ncopper\ncopy\ncoral\ncore\ncorn\ncorrect\ncost\ncotton\ncouch\ncountry\ncouple\ncourse\ncousin\ncover\ncoyote\ncrack\ncradle\ncraft\ncram\ncrane\ncrash\ncrater\ncrawl\ncrazy\ncream\ncredit\ncreek\ncrew\ncricket\ncrime\ncrisp\ncritic\ncrop\ncross\ncrouch\ncrowd\ncrucial\ncruel\ncruise\ncrumble\ncrunch\ncrush\ncry\ncrystal\ncube\nculture\ncup\ncupboard\ncurious\ncurrent\ncurtain\ncurve\ncushion\ncustom\ncute\ncycle\ndad\ndamage\ndamp\ndance\ndanger\ndaring\ndash\ndaughter\ndawn\nday\ndeal\ndebate\ndebris\ndecade\ndecember\ndecide\ndecline\ndecorate\ndecrease\ndeer\ndefense\ndefine\ndefy\ndegree\ndelay\ndeliver\ndemand\ndemise\ndenial\ndentist\ndeny\ndepart\ndepend\ndeposit\ndepth\ndeputy\nderive\ndescribe\ndesert\ndesign\ndesk\ndespair\ndestroy\ndetail\ndetect\ndevelop\ndevice\ndevote\ndiagram\ndial\ndiamond\ndiary\ndice\ndiesel\ndiet\ndiffer\ndigital\ndignity\ndilemma\ndinner\ndinosaur\ndirect\ndirt\ndisagree\ndiscover\ndisease\ndish\ndismiss\ndisorder\ndisplay\ndistance\ndivert\ndivide\ndivorce\ndizzy\ndoctor\ndocument\ndog\ndoll\ndolphin\ndomain\ndonate\ndonkey\ndonor\ndoor\ndose\ndouble\ndove\ndraft\ndragon\ndrama\ndrastic\ndraw\ndream\ndress\ndrift\ndrill\ndrink\ndrip\ndrive\ndrop\ndrum\ndry\nduck\ndumb\ndune\nduring\ndust\ndutch\nduty\ndwarf\ndynamic\neager\neagle\nearly\nearn\nearth\neasily\neast\neasy\necho\necology\neconomy\nedge\nedit\neducate\neffort\negg\neight\neither\nelbow\nelder\nelectric\nelegant\nelement\nelephant\nelevator\nelite\nelse\nembark\nembody\nembrace\nemerge\nemotion\nemploy\nempower\nempty\nenable\nenact\nend\nendless\nendorse\nenemy\nenergy\nenforce\nengage\nengine\nenhance\nenjoy\nenlist\nenough\nenrich\nenroll\nensure\nenter\nentire\nentry\nenvelope\nepisode\nequal\nequip\nera\nerase\nerode\nerosion\nerror\nerupt\nescape\nessay\nessence\nestate\neternal\nethics\nevidence\nevil\nevoke\nevolve\nexact\nexample\nexcess\nexchange\nexcite\nexclude\nexcuse\nexecute\nexercise\nexhaust\nexhibit\nexile\nexist\nexit\nexotic\nexpand\nexpect\nexpire\nexplain\nexpose\nexpress\nextend\nextra\neye\neyebrow\nfabric\nface\nfaculty\nfade\nfaint\nfaith\nfall\nfalse\nfame\nfamily\nfamous\nfan\nfancy\nfantasy\nfarm\nfashion\nfat\nfatal\nfather\nfatigue\nfault\nfavorite\nfeature\nfebruary\nfederal\nfee\nfeed\nfeel\nfemale\nfence\nfestival\nfetch\nfever\nfew\nfiber\nfiction\nfield\nfigure\nfile\nfilm\nfilter\nfinal\nfind\nfine\nfinger\nfinish\nfire\nfirm\nfirst\nfiscal\nfish\nfit\nfitness\nfix\nflag\nflame\nflash\nflat\nflavor\nflee\nflight\nflip\nfloat\nflock\nfloor\nflower\nfluid\nflush\nfly\nfoam\nfocus\nfog\nfoil\nfold\nfollow\nfood\nfoot\nforce\nforest\nforget\nfork\nfortune\nforum\nforward\nfossil\nfoster\nfound\nfox\nfragile\nframe\nfrequent\nfresh\nfriend\nfringe\nfrog\nfront\nfrost\nfrown\nfrozen\nfruit\nfuel\nfun\nfunny\nfurnace\nfury\nfuture\ngadget\ngain\ngalaxy\ngallery\ngame\ngap\ngarage\ngarbage\ngarden\ngarlic\ngarment\ngas\ngasp\ngate\ngather\ngauge\ngaze\ngeneral\ngenius\ngenre\ngentle\ngenuine\ngesture\nghost\ngiant\ngift\ngiggle\nginger\ngiraffe\ngirl\ngive\nglad\nglance\nglare\nglass\nglide\nglimpse\nglobe\ngloom\nglory\nglove\nglow\nglue\ngoat\ngoddess\ngold\ngood\ngoose\ngorilla\ngospel\ngossip\ngovern\ngown\ngrab\ngrace\ngrain\ngrant\ngrape\ngrass\ngravity\ngreat\ngreen\ngrid\ngrief\ngrit\ngrocery\ngroup\ngrow\ngrunt\nguard\nguess\nguide\nguilt\nguitar\ngun\ngym\nhabit\nhair\nhalf\nhammer\nhamster\nhand\nhappy\nharbor\nhard\nharsh\nharvest\nhat\nhave\nhawk\nhazard\nhead\nhealth\nheart\nheavy\nhedgehog\nheight\nhello\nhelmet\nhelp\nhen\nhero\nhidden\nhigh\nhill\nhint\nhip\nhire\nhistory\nhobby\nhockey\nhold\nhole\nholiday\nhollow\nhome\nhoney\nhood\nhope\nhorn\nhorror\nhorse\nhospital\nhost\nhotel\nhour\nhover\nhub\nhuge\nhuman\nhumble\nhumor\nhundred\nhungry\nhunt\nhurdle\nhurry\nhurt\nhusband\nhybrid\nice\nicon\nidea\nidentify\nidle\nignore\nill\nillegal\nillness\nimage\nimitate\nimmense\nimmune\nimpact\nimpose\nimprove\nimpulse\ninch\ninclude\nincome\nincrease\nindex\nindicate\nindoor\nindustry\ninfant\ninflict\ninform\ninhale\ninherit\ninitial\ninject\ninjury\ninmate\ninner\ninnocent\ninput\ninquiry\ninsane\ninsect\ninside\ninspire\ninstall\nintact\ninterest\ninto\ninvest\ninvite\ninvolve\niron\nisland\nisolate\nissue\nitem\nivory\njacket\njaguar\njar\njazz\njealous\njeans\njelly\njewel\njob\njoin\njoke\njourney\njoy\njudge\njuice\njump\njungle\njunior\njunk\njust\nkangaroo\nkeen\nkeep\nketchup\nkey\nkick\nkid\nkidney\nkind\nkingdom\nkiss\nkit\nkitchen\nkite\nkitten\nkiwi\nknee\nknife\nknock\nknow\nlab\nlabel\nlabor\nladder\nlady\nlake\nlamp\nlanguage\nlaptop\nlarge\nlater\nlatin\nlaugh\nlaundry\nlava\nlaw\nlawn\nlawsuit\nlayer\nlazy\nleader\nleaf\nlearn\nleave\nlecture\nleft\nleg\nlegal\nlegend\nleisure\nlemon\nlend\nlength\nlens\nleopard\nlesson\nletter\nlevel\nliar\nliberty\nlibrary\nlicense\nlife\nlift\nlight\nlike\nlimb\nlimit\nlink\nlion\nliquid\nlist\nlittle\nlive\nlizard\nload\nloan\nlobster\nlocal\nlock\nlogic\nlonely\nlong\nloop\nlottery\nloud\nlounge\nlove\nloyal\nlucky\nluggage\nlumber\nlunar\nlunch\nluxury\nlyrics\nmachine\nmad\nmagic\nmagnet\nmaid\nmail\nmain\nmajor\nmake\nmammal\nman\nmanage\nmandate\nmango\nmansion\nmanual\nmaple\nmarble\nmarch\nmargin\nmarine\nmarket\nmarriage\nmask\nmass\nmaster\nmatch\nmaterial\nmath\nmatrix\nmatter\nmaximum\nmaze\nmeadow\nmean\nmeasure\nmeat\nmechanic\nmedal\nmedia\nmelody\nmelt\nmember\nmemory\nmention\nmenu\nmercy\nmerge\nmerit\nmerry\nmesh\nmessage\nmetal\nmethod\nmiddle\nmidnight\nmilk\nmillion\nmimic\nmind\nminimum\nminor\nminute\nmiracle\nmirror\nmisery\nmiss\nmistake\nmix\nmixed\nmixture\nmobile\nmodel\nmodify\nmom\nmoment\nmonitor\nmonkey\nmonster\nmonth\nmoon\nmoral\nmore\nmorning\nmosquito\nmother\nmotion\nmotor\nmountain\nmouse\nmove\nmovie\nmuch\nmuffin\nmule\nmultiply\nmuscle\nmuseum\nmushroom\nmusic\nmust\nmutual\nmyself\nmystery\nmyth\nnaive\nname\nnapkin\nnarrow\nnasty\nnation\nnature\nnear\nneck\nneed\nnegative\nneglect\nneither\nnephew\nnerve\nnest\nnet\nnetwork\nneutral\nnever\nnews\nnext\nnice\nnight\nnoble\nnoise\nnominee\nnoodle\nnormal\nnorth\nnose\nnotable\nnote\nnothing\nnotice\nnovel\nnow\nnuclear\nnumber\nnurse\nnut\noak\nobey\nobject\noblige\nobscure\nobserve\nobtain\nobvious\noccur\nocean\noctober\nodor\noff\noffer\noffice\noften\noil\nokay\nold\nolive\nolympic\nomit\nonce\none\nonion\nonline\nonly\nopen\nopera\nopinion\noppose\noption\norange\norbit\norchard\norder\nordinary\norgan\norient\noriginal\norphan\nostrich\nother\noutdoor\nouter\noutput\noutside\noval\noven\nover\nown\nowner\noxygen\noyster\nozone\npact\npaddle\npage\npair\npalace\npalm\npanda\npanel\npanic\npanther\npaper\nparade\nparent\npark\nparrot\nparty\npass\npatch\npath\npatient\npatrol\npattern\npause\npave\npayment\npeace\npeanut\npear\npeasant\npelican\npen\npenalty\npencil\npeople\npepper\nperfect\npermit\nperson\npet\nphone\nphoto\nphrase\nphysical\npiano\npicnic\npicture\npiece\npig\npigeon\npill\npilot\npink\npioneer\npipe\npistol\npitch\npizza\nplace\nplanet\nplastic\nplate\nplay\nplease\npledge\npluck\nplug\nplunge\npoem\npoet\npoint\npolar\npole\npolice\npond\npony\npool\npopular\nportion\nposition\npossible\npost\npotato\npottery\npoverty\npowder\npower\npractice\npraise\npredict\nprefer\nprepare\npresent\npretty\nprevent\nprice\npride\nprimary\nprint\npriority\nprison\nprivate\nprize\nproblem\nprocess\nproduce\nprofit\nprogram\nproject\npromote\nproof\nproperty\nprosper\nprotect\nproud\nprovide\npublic\npudding\npull\npulp\npulse\npumpkin\npunch\npupil\npuppy\npurchase\npurity\npurpose\npurse\npush\nput\npuzzle\npyramid\nquality\nquantum\nquarter\nquestion\nquick\nquit\nquiz\nquote\nrabbit\nraccoon\nrace\nrack\nradar\nradio\nrail\nrain\nraise\nrally\nramp\nranch\nrandom\nrange\nrapid\nrare\nrate\nrather\nraven\nraw\nrazor\nready\nreal\nreason\nrebel\nrebuild\nrecall\nreceive\nrecipe\nrecord\nrecycle\nreduce\nreflect\nreform\nrefuse\nregion\nregret\nregular\nreject\nrelax\nrelease\nrelief\nrely\nremain\nremember\nremind\nremove\nrender\nrenew\nrent\nreopen\nrepair\nrepeat\nreplace\nreport\nrequire\nrescue\nresemble\nresist\nresource\nresponse\nresult\nretire\nretreat\nreturn\nreunion\nreveal\nreview\nreward\nrhythm\nrib\nribbon\nrice\nrich\nride\nridge\nrifle\nright\nrigid\nring\nriot\nripple\nrisk\nritual\nrival\nriver\nroad\nroast\nrobot\nrobust\nrocket\nromance\nroof\nrookie\nroom\nrose\nrotate\nrough\nround\nroute\nroyal\nrubber\nrude\nrug\nrule\nrun\nrunway\nrural\nsad\nsaddle\nsadness\nsafe\nsail\nsalad\nsalmon\nsalon\nsalt\nsalute\nsame\nsample\nsand\nsatisfy\nsatoshi\nsauce\nsausage\nsave\nsay\nscale\nscan\nscare\nscatter\nscene\nscheme\nschool\nscience\nscissors\nscorpion\nscout\nscrap\nscreen\nscript\nscrub\nsea\nsearch\nseason\nseat\nsecond\nsecret\nsection\nsecurity\nseed\nseek\nsegment\nselect\nsell\nseminar\nsenior\nsense\nsentence\nseries\nservice\nsession\nsettle\nsetup\nseven\nshadow\nshaft\nshallow\nshare\nshed\nshell\nsheriff\nshield\nshift\nshine\nship\nshiver\nshock\nshoe\nshoot\nshop\nshort\nshoulder\nshove\nshrimp\nshrug\nshuffle\nshy\nsibling\nsick\nside\nsiege\nsight\nsign\nsilent\nsilk\nsilly\nsilver\nsimilar\nsimple\nsince\nsing\nsiren\nsister\nsituate\nsix\nsize\nskate\nsketch\nski\nskill\nskin\nskirt\nskull\nslab\nslam\nsleep\nslender\nslice\nslide\nslight\nslim\nslogan\nslot\nslow\nslush\nsmall\nsmart\nsmile\nsmoke\nsmooth\nsnack\nsnake\nsnap\nsniff\nsnow\nsoap\nsoccer\nsocial\nsock\nsoda\nsoft\nsolar\nsoldier\nsolid\nsolution\nsolve\nsomeone\nsong\nsoon\nsorry\nsort\nsoul\nsound\nsoup\nsource\nsouth\nspace\nspare\nspatial\nspawn\nspeak\nspecial\nspeed\nspell\nspend\nsphere\nspice\nspider\nspike\nspin\nspirit\nsplit\nspoil\nsponsor\nspoon\nsport\nspot\nspray\nspread\nspring\nspy\nsquare\nsqueeze\nsquirrel\nstable\nstadium\nstaff\nstage\nstairs\nstamp\nstand\nstart\nstate\nstay\nsteak\nsteel\nstem\nstep\nstereo\nstick\nstill\nsting\nstock\nstomach\nstone\nstool\nstory\nstove\nstrategy\nstreet\nstrike\nstrong\nstruggle\nstudent\nstuff\nstumble\nstyle\nsubject\nsubmit\nsubway\nsuccess\nsuch\nsudden\nsuffer\nsugar\nsuggest\nsuit\nsummer\nsun\nsunny\nsunset\nsuper\nsupply\nsupreme\nsure\nsurface\nsurge\nsurprise\nsurround\nsurvey\nsuspect\nsustain\nswallow\nswamp\nswap\nswarm\nswear\nsweet\nswift\nswim\nswing\nswitch\nsword\nsymbol\nsymptom\nsyrup\nsystem\ntable\ntackle\ntag\ntail\ntalent\ntalk\ntank\ntape\ntarget\ntask\ntaste\ntattoo\ntaxi\nteach\nteam\ntell\nten\ntenant\ntennis\ntent\nterm\ntest\ntext\nthank\nthat\ntheme\nthen\ntheory\nthere\nthey\nthing\nthis\nthought\nthree\nthrive\nthrow\nthumb\nthunder\nticket\ntide\ntiger\ntilt\ntimber\ntime\ntiny\ntip\ntired\ntissue\ntitle\ntoast\ntobacco\ntoday\ntoddler\ntoe\ntogether\ntoilet\ntoken\ntomato\ntomorrow\ntone\ntongue\ntonight\ntool\ntooth\ntop\ntopic\ntopple\ntorch\ntornado\ntortoise\ntoss\ntotal\ntourist\ntoward\ntower\ntown\ntoy\ntrack\ntrade\ntraffic\ntragic\ntrain\ntransfer\ntrap\ntrash\ntravel\ntray\ntreat\ntree\ntrend\ntrial\ntribe\ntrick\ntrigger\ntrim\ntrip\ntrophy\ntrouble\ntruck\ntrue\ntruly\ntrumpet\ntrust\ntruth\ntry\ntube\ntuition\ntumble\ntuna\ntunnel\nturkey\nturn\nturtle\ntwelve\ntwenty\ntwice\ntwin\ntwist\ntwo\ntype\ntypical\nugly\numbrella\nunable\nunaware\nuncle\nuncover\nunder\nundo\nunfair\nunfold\nunhappy\nuniform\nunique\nunit\nuniverse\nunknown\nunlock\nuntil\nunusual\nunveil\nupdate\nupgrade\nuphold\nupon\nupper\nupset\nurban\nurge\nusage\nuse\nused\nuseful\nuseless\nusual\nutility\nvacant\nvacuum\nvague\nvalid\nvalley\nvalve\nvan\nvanish\nvapor\nvarious\nvast\nvault\nvehicle\nvelvet\nvendor\nventure\nvenue\nverb\nverify\nversion\nvery\nvessel\nveteran\nviable\nvibrant\nvicious\nvictory\nvideo\nview\nvillage\nvintage\nviolin\nvirtual\nvirus\nvisa\nvisit\nvisual\nvital\nvivid\nvocal\nvoice\nvoid\nvolcano\nvolume\nvote\nvoyage\nwage\nwagon\nwait\nwalk\nwall\nwalnut\nwant\nwarfare\nwarm\nwarrior\nwash\nwasp\nwaste\nwater\nwave\nway\nwealth\nweapon\nwear\nweasel\nweather\nweb\nwedding\nweekend\nweird\nwelcome\nwest\nwet\nwhale\nwhat\nwheat\nwheel\nwhen\nwhere\nwhip\nwhisper\nwide\nwidth\nwife\nwild\nwill\nwin\nwindow\nwine\nwing\nwink\nwinner\nwinter\nwire\nwisdom\nwise\nwish\nwitness\nwolf\nwoman\nwonder\nwood\nwool\nword\nwork\nworld\nworry\nworth\nwrap\nwreck\nwrestle\nwrist\nwrite\nwrong\nyard\nyear\nyellow\nyou\nyoung\nyouth\nzebra\nzero\nzone\nzoo".split("\n");
var rm = {};
Object.defineProperty(rm, "__esModule", { value: !0 }), rm.mnemonicToSeedSync = rm.mnemonicToSeed = rm.validateMnemonic = rm.entropyToMnemonic = rm.mnemonicToEntropy = rm.generateMnemonic = void 0;
var im = {};
Object.defineProperty(im, "__esModule", { value: !0 }), im.pbkdf2Async = im.pbkdf2 = void 0;
var am = {};
Object.defineProperty(am, "__esModule", { value: !0 }), am.hmac = void 0;
var om = class extends Q.Hash {
	constructor(e, t) {
		super(), this.finished = !1, this.destroyed = !1, Zf.default.hash(e);
		let n = (0, Q.toBytes)(t);
		if (this.iHash = e.create(), typeof this.iHash.update != "function") throw TypeError("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		let r = this.blockLen, i = new Uint8Array(r);
		i.set(n.length > r ? e.create().update(n).digest() : n);
		for (let e = 0; e < i.length; e++) i[e] ^= 54;
		this.iHash.update(i), this.oHash = e.create();
		for (let e = 0; e < i.length; e++) i[e] ^= 106;
		this.oHash.update(i), i.fill(0);
	}
	update(e) {
		return Zf.default.exists(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		Zf.default.exists(this), Zf.default.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
	}
	digest() {
		let e = new Uint8Array(this.oHash.outputLen);
		return this.digestInto(e), e;
	}
	_cloneInto(e) {
		e ||= Object.create(Object.getPrototypeOf(this), {});
		let { oHash: t, iHash: n, finished: r, destroyed: i, blockLen: a, outputLen: o } = this;
		return e.finished = r, e.destroyed = i, e.blockLen = a, e.outputLen = o, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
	}
	destroy() {
		this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
	}
};
am.hmac = (e, t, n) => new om(e, t).update(n).digest(), am.hmac.create = (e, t) => new om(e, t);
function sm(e, t, n, r) {
	Zf.default.hash(e);
	let { c: i, dkLen: a, asyncTick: o } = (0, Q.checkOpts)({
		dkLen: 32,
		asyncTick: 10
	}, r);
	if (Zf.default.number(i), Zf.default.number(a), Zf.default.number(o), i < 1) throw Error("PBKDF2: iterations (c) should be >= 1");
	let s = (0, Q.toBytes)(t), c = (0, Q.toBytes)(n), l = new Uint8Array(a), u = am.hmac.create(e, s);
	return {
		c: i,
		dkLen: a,
		asyncTick: o,
		DK: l,
		PRF: u,
		PRFSalt: u._cloneInto().update(c)
	};
}
function cm(e, t, n, r, i) {
	return e.destroy(), t.destroy(), r && r.destroy(), i.fill(0), n;
}
function lm(e, t, n, r) {
	let { c: i, dkLen: a, DK: o, PRF: s, PRFSalt: c } = sm(e, t, n, r), l, u = /* @__PURE__ */ new Uint8Array(4), d = (0, Q.createView)(u), f = new Uint8Array(s.outputLen);
	for (let e = 1, t = 0; t < a; e++, t += s.outputLen) {
		let n = o.subarray(t, t + s.outputLen);
		d.setInt32(0, e, !1), (l = c._cloneInto(l)).update(u).digestInto(f), n.set(f.subarray(0, n.length));
		for (let e = 1; e < i; e++) {
			s._cloneInto(l).update(f).digestInto(f);
			for (let e = 0; e < n.length; e++) n[e] ^= f[e];
		}
	}
	return cm(s, c, o, l, f);
}
im.pbkdf2 = lm;
async function um(e, t, n, r) {
	let { c: i, dkLen: a, asyncTick: o, DK: s, PRF: c, PRFSalt: l } = sm(e, t, n, r), u, d = /* @__PURE__ */ new Uint8Array(4), f = (0, Q.createView)(d), p = new Uint8Array(c.outputLen);
	for (let e = 1, t = 0; t < a; e++, t += c.outputLen) {
		let n = s.subarray(t, t + c.outputLen);
		f.setInt32(0, e, !1), (u = l._cloneInto(u)).update(d).digestInto(p), n.set(p.subarray(0, n.length)), await (0, Q.asyncLoop)(i - 1, o, (e) => {
			c._cloneInto(u).update(p).digestInto(p);
			for (let e = 0; e < n.length; e++) n[e] ^= p[e];
		});
	}
	return cm(c, l, s, u, p);
}
im.pbkdf2Async = um;
var dm = {};
Object.defineProperty(dm, "__esModule", { value: !0 }), dm.sha384 = dm.sha512_256 = dm.sha512_224 = dm.sha512 = dm.SHA512 = void 0;
var $ = {};
Object.defineProperty($, "__esModule", { value: !0 }), $.add = $.toBig = $.split = $.fromBig = void 0;
var fm = BigInt(2 ** 32 - 1), pm = BigInt(32);
function mm(e, t = !1) {
	return t ? {
		h: Number(e & fm),
		l: Number(e >> pm & fm)
	} : {
		h: Number(e >> pm & fm) | 0,
		l: Number(e & fm) | 0
	};
}
$.fromBig = mm;
function hm(e, t = !1) {
	let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
	for (let i = 0; i < e.length; i++) {
		let { h: a, l: o } = mm(e[i], t);
		[n[i], r[i]] = [a, o];
	}
	return [n, r];
}
$.split = hm, $.toBig = (e, t) => BigInt(e >>> 0) << pm | BigInt(t >>> 0);
var gm = (e, t, n) => e >>> n, _m = (e, t, n) => e << 32 - n | t >>> n, vm = (e, t, n) => e >>> n | t << 32 - n, ym = (e, t, n) => e << 32 - n | t >>> n, bm = (e, t, n) => e << 64 - n | t >>> n - 32, xm = (e, t, n) => e >>> n - 32 | t << 64 - n, Sm = (e, t) => t, Cm = (e, t) => e, wm = (e, t, n) => e << n | t >>> 32 - n, Tm = (e, t, n) => t << n | e >>> 32 - n, Em = (e, t, n) => t << n - 32 | e >>> 64 - n, Dm = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Om(e, t, n, r) {
	let i = (t >>> 0) + (r >>> 0);
	return {
		h: e + n + (i / 2 ** 32 | 0) | 0,
		l: i | 0
	};
}
$.add = Om, $.default = {
	fromBig: mm,
	split: hm,
	toBig: $.toBig,
	shrSH: gm,
	shrSL: _m,
	rotrSH: vm,
	rotrSL: ym,
	rotrBH: bm,
	rotrBL: xm,
	rotr32H: Sm,
	rotr32L: Cm,
	rotlSH: wm,
	rotlSL: Tm,
	rotlBH: Em,
	rotlBL: Dm,
	add: Om,
	add3L: (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0),
	add3H: (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0,
	add4L: (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0),
	add4H: (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0,
	add5H: (e, t, n, r, i, a) => t + n + r + i + a + (e / 2 ** 32 | 0) | 0,
	add5L: (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0)
};
var [km, Am] = $.default.split((/* @__PURE__ */ "0x428a2f98d728ae22.0x7137449123ef65cd.0xb5c0fbcfec4d3b2f.0xe9b5dba58189dbbc.0x3956c25bf348b538.0x59f111f1b605d019.0x923f82a4af194f9b.0xab1c5ed5da6d8118.0xd807aa98a3030242.0x12835b0145706fbe.0x243185be4ee4b28c.0x550c7dc3d5ffb4e2.0x72be5d74f27b896f.0x80deb1fe3b1696b1.0x9bdc06a725c71235.0xc19bf174cf692694.0xe49b69c19ef14ad2.0xefbe4786384f25e3.0x0fc19dc68b8cd5b5.0x240ca1cc77ac9c65.0x2de92c6f592b0275.0x4a7484aa6ea6e483.0x5cb0a9dcbd41fbd4.0x76f988da831153b5.0x983e5152ee66dfab.0xa831c66d2db43210.0xb00327c898fb213f.0xbf597fc7beef0ee4.0xc6e00bf33da88fc2.0xd5a79147930aa725.0x06ca6351e003826f.0x142929670a0e6e70.0x27b70a8546d22ffc.0x2e1b21385c26c926.0x4d2c6dfc5ac42aed.0x53380d139d95b3df.0x650a73548baf63de.0x766a0abb3c77b2a8.0x81c2c92e47edaee6.0x92722c851482353b.0xa2bfe8a14cf10364.0xa81a664bbc423001.0xc24b8b70d0f89791.0xc76c51a30654be30.0xd192e819d6ef5218.0xd69906245565a910.0xf40e35855771202a.0x106aa07032bbd1b8.0x19a4c116b8d2d0c8.0x1e376c085141ab53.0x2748774cdf8eeb99.0x34b0bcb5e19b48a8.0x391c0cb3c5c95a63.0x4ed8aa4ae3418acb.0x5b9cca4f7763e373.0x682e6ff3d6b2b8a3.0x748f82ee5defb2fc.0x78a5636f43172f60.0x84c87814a1f0ab72.0x8cc702081a6439ec.0x90befffa23631e28.0xa4506cebde82bde9.0xbef9a3f7b2c67915.0xc67178f2e372532b.0xca273eceea26619c.0xd186b8c721c0c207.0xeada7dd6cde0eb1e.0xf57d4f7fee6ed178.0x06f067aa72176fba.0x0a637dc5a2c898a6.0x113f9804bef90dae.0x1b710b35131c471b.0x28db77f523047d84.0x32caab7b40c72493.0x3c9ebe0a15c9bebc.0x431d67c49c100d4c.0x4cc5d4becb3e42b6.0x597f299cfc657e2a.0x5fcb6fab3ad6faec.0x6c44198c4a475817".split(".")).map((e) => BigInt(e))), jm = /* @__PURE__ */ new Uint32Array(80), Mm = /* @__PURE__ */ new Uint32Array(80), Nm = class extends Xf.SHA2 {
	constructor() {
		super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
	}
	get() {
		let { Ah: e, Al: t, Bh: n, Bl: r, Ch: i, Cl: a, Dh: o, Dl: s, Eh: c, El: l, Fh: u, Fl: d, Gh: f, Gl: p, Hh: m, Hl: h } = this;
		return [
			e,
			t,
			n,
			r,
			i,
			a,
			o,
			s,
			c,
			l,
			u,
			d,
			f,
			p,
			m,
			h
		];
	}
	set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
		this.Ah = e | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = r | 0, this.Ch = i | 0, this.Cl = a | 0, this.Dh = o | 0, this.Dl = s | 0, this.Eh = c | 0, this.El = l | 0, this.Fh = u | 0, this.Fl = d | 0, this.Gh = f | 0, this.Gl = p | 0, this.Hh = m | 0, this.Hl = h | 0;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) jm[n] = e.getUint32(t), Mm[n] = e.getUint32(t += 4);
		for (let e = 16; e < 80; e++) {
			let t = jm[e - 15] | 0, n = Mm[e - 15] | 0, r = $.default.rotrSH(t, n, 1) ^ $.default.rotrSH(t, n, 8) ^ $.default.shrSH(t, n, 7), i = $.default.rotrSL(t, n, 1) ^ $.default.rotrSL(t, n, 8) ^ $.default.shrSL(t, n, 7), a = jm[e - 2] | 0, o = Mm[e - 2] | 0, s = $.default.rotrSH(a, o, 19) ^ $.default.rotrBH(a, o, 61) ^ $.default.shrSH(a, o, 6), c = $.default.rotrSL(a, o, 19) ^ $.default.rotrBL(a, o, 61) ^ $.default.shrSL(a, o, 6), l = $.default.add4L(i, c, Mm[e - 7], Mm[e - 16]), u = $.default.add4H(l, r, s, jm[e - 7], jm[e - 16]);
			jm[e] = u | 0, Mm[e] = l | 0;
		}
		let { Ah: n, Al: r, Bh: i, Bl: a, Ch: o, Cl: s, Dh: c, Dl: l, Eh: u, El: d, Fh: f, Fl: p, Gh: m, Gl: h, Hh: g, Hl: _ } = this;
		for (let e = 0; e < 80; e++) {
			let t = $.default.rotrSH(u, d, 14) ^ $.default.rotrSH(u, d, 18) ^ $.default.rotrBH(u, d, 41), v = $.default.rotrSL(u, d, 14) ^ $.default.rotrSL(u, d, 18) ^ $.default.rotrBL(u, d, 41), y = u & f ^ ~u & m, b = d & p ^ ~d & h, x = $.default.add5L(_, v, b, Am[e], Mm[e]), S = $.default.add5H(x, g, t, y, km[e], jm[e]), C = x | 0, w = $.default.rotrSH(n, r, 28) ^ $.default.rotrBH(n, r, 34) ^ $.default.rotrBH(n, r, 39), T = $.default.rotrSL(n, r, 28) ^ $.default.rotrBL(n, r, 34) ^ $.default.rotrBL(n, r, 39), E = n & i ^ n & o ^ i & o, D = r & a ^ r & s ^ a & s;
			g = m | 0, _ = h | 0, m = f | 0, h = p | 0, f = u | 0, p = d | 0, {h: u, l: d} = $.default.add(c | 0, l | 0, S | 0, C | 0), c = o | 0, l = s | 0, o = i | 0, s = a | 0, i = n | 0, a = r | 0;
			let O = $.default.add3L(C, T, D);
			n = $.default.add3H(O, S, w, E), r = O | 0;
		}
		({h: n, l: r} = $.default.add(this.Ah | 0, this.Al | 0, n | 0, r | 0)), {h: i, l: a} = $.default.add(this.Bh | 0, this.Bl | 0, i | 0, a | 0), {h: o, l: s} = $.default.add(this.Ch | 0, this.Cl | 0, o | 0, s | 0), {h: c, l: l} = $.default.add(this.Dh | 0, this.Dl | 0, c | 0, l | 0), {h: u, l: d} = $.default.add(this.Eh | 0, this.El | 0, u | 0, d | 0), {h: f, l: p} = $.default.add(this.Fh | 0, this.Fl | 0, f | 0, p | 0), {h: m, l: h} = $.default.add(this.Gh | 0, this.Gl | 0, m | 0, h | 0), {h: g, l: _} = $.default.add(this.Hh | 0, this.Hl | 0, g | 0, _ | 0), this.set(n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _);
	}
	roundClean() {
		jm.fill(0), Mm.fill(0);
	}
	destroy() {
		this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
dm.SHA512 = Nm;
var Pm = class extends Nm {
	constructor() {
		super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
	}
}, Fm = class extends Nm {
	constructor() {
		super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
	}
}, Im = class extends Nm {
	constructor() {
		super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
	}
};
dm.sha512 = (0, Q.wrapConstructor)(() => new Nm()), dm.sha512_224 = (0, Q.wrapConstructor)(() => new Pm()), dm.sha512_256 = (0, Q.wrapConstructor)(() => new Fm()), dm.sha384 = (0, Q.wrapConstructor)(() => new Im());
var Lm = (e) => e[0] === "あいこくしん";
function Rm(e) {
	if (typeof e != "string") throw TypeError(`Invalid mnemonic type: ${typeof e}`);
	return e.normalize("NFKD");
}
function zm(e) {
	let t = Rm(e), n = t.split(" ");
	if (![
		12,
		15,
		18,
		21,
		24
	].includes(n.length)) throw Error("Invalid mnemonic");
	return {
		nfkd: t,
		words: n
	};
}
function Bm(e) {
	Zf.default.bytes(e, 16, 20, 24, 28, 32);
}
function Vm(e, t = 128) {
	if (Zf.default.number(t), t % 32 != 0 || t > 256) throw TypeError("Invalid entropy");
	return Gm((0, Q.randomBytes)(t / 8), e);
}
rm.generateMnemonic = Vm;
var Hm = (e) => {
	let t = 8 - e.length / 4;
	return new Uint8Array([(0, Yf.sha256)(e)[0] >> t << t]);
};
function Um(e) {
	if (!Array.isArray(e) || e.length !== 2048 || typeof e[0] != "string") throw Error("Worlist: expected array of 2048 strings");
	return e.forEach((e) => {
		if (typeof e != "string") throw Error(`Wordlist: non-string element: ${e}`);
	}), zp.chain(zp.checksum(1, Hm), zp.radix2(11, !0), zp.alphabet(e));
}
function Wm(e, t) {
	let { words: n } = zm(e), r = Um(t).decode(n);
	return Bm(r), r;
}
rm.mnemonicToEntropy = Wm;
function Gm(e, t) {
	return Bm(e), Um(t).encode(e).join(Lm(t) ? "　" : " ");
}
rm.entropyToMnemonic = Gm;
function Km(e, t) {
	try {
		Wm(e, t);
	} catch {
		return !1;
	}
	return !0;
}
rm.validateMnemonic = Km;
var qm = (e) => Rm(`mnemonic${e}`);
function Jm(e, t = "") {
	return (0, im.pbkdf2Async)(dm.sha512, zm(e).nfkd, qm(t), {
		c: 2048,
		dkLen: 64
	});
}
rm.mnemonicToSeed = Jm;
function Ym(e, t = "") {
	return (0, im.pbkdf2)(dm.sha512, zm(e).nfkd, qm(t), {
		c: 2048,
		dkLen: 64
	});
}
rm.mnemonicToSeedSync = Ym;
var Xm = {};
Object.defineProperty(Xm, "__esModule", { value: !0 }), Xm.ripemd160 = Xm.RIPEMD160 = void 0;
var Zm = new Uint8Array([
	7,
	4,
	13,
	1,
	10,
	6,
	15,
	3,
	12,
	0,
	9,
	5,
	2,
	14,
	11,
	8
]), Qm = Uint8Array.from({ length: 16 }, (e, t) => t), $m = Qm.map((e) => (9 * e + 5) % 16), eh = [Qm], th = [$m];
for (let e = 0; e < 4; e++) for (let t of [eh, th]) t.push(t[e].map((e) => Zm[e]));
var nh = [
	[
		11,
		14,
		15,
		12,
		5,
		8,
		7,
		9,
		11,
		13,
		14,
		15,
		6,
		7,
		9,
		8
	],
	[
		12,
		13,
		11,
		15,
		6,
		9,
		9,
		7,
		12,
		15,
		11,
		13,
		7,
		8,
		7,
		7
	],
	[
		13,
		15,
		14,
		11,
		7,
		7,
		6,
		8,
		13,
		14,
		13,
		12,
		5,
		5,
		6,
		9
	],
	[
		14,
		11,
		12,
		14,
		8,
		6,
		5,
		5,
		15,
		12,
		15,
		14,
		9,
		9,
		8,
		6
	],
	[
		15,
		12,
		13,
		13,
		9,
		5,
		8,
		6,
		14,
		11,
		12,
		11,
		8,
		6,
		5,
		5
	]
].map((e) => new Uint8Array(e)), rh = eh.map((e, t) => e.map((e) => nh[t][e])), ih = th.map((e, t) => e.map((e) => nh[t][e])), ah = new Uint32Array([
	0,
	1518500249,
	1859775393,
	2400959708,
	2840853838
]), oh = new Uint32Array([
	1352829926,
	1548603684,
	1836072691,
	2053994217,
	0
]), sh = (e, t) => e << t | e >>> 32 - t;
function ch(e, t, n, r) {
	return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
var lh = /* @__PURE__ */ new Uint32Array(16), uh = class extends Xf.SHA2 {
	constructor() {
		super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
	}
	get() {
		let { h0: e, h1: t, h2: n, h3: r, h4: i } = this;
		return [
			e,
			t,
			n,
			r,
			i
		];
	}
	set(e, t, n, r, i) {
		this.h0 = e | 0, this.h1 = t | 0, this.h2 = n | 0, this.h3 = r | 0, this.h4 = i | 0;
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) lh[n] = e.getUint32(t, !0);
		let n = this.h0 | 0, r = n, i = this.h1 | 0, a = i, o = this.h2 | 0, s = o, c = this.h3 | 0, l = c, u = this.h4 | 0, d = u;
		for (let e = 0; e < 5; e++) {
			let t = 4 - e, f = ah[e], p = oh[e], m = eh[e], h = th[e], g = rh[e], _ = ih[e];
			for (let t = 0; t < 16; t++) {
				let r = sh(n + ch(e, i, o, c) + lh[m[t]] + f, g[t]) + u | 0;
				n = u, u = c, c = sh(o, 10) | 0, o = i, i = r;
			}
			for (let e = 0; e < 16; e++) {
				let n = sh(r + ch(t, a, s, l) + lh[h[e]] + p, _[e]) + d | 0;
				r = d, d = l, l = sh(s, 10) | 0, s = a, a = n;
			}
		}
		this.set(this.h1 + o + l | 0, this.h2 + c + d | 0, this.h3 + u + r | 0, this.h4 + n + a | 0, this.h0 + i + s | 0);
	}
	roundClean() {
		lh.fill(0);
	}
	destroy() {
		this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
	}
};
Xm.RIPEMD160 = uh, Xm.ripemd160 = (0, Q.wrapConstructor)(() => new uh()), Z.hmacSha256Sync = (e, ...t) => (0, am.hmac)(Yf.sha256, e, Z.concatBytes(...t));
var dh = Jp(Yf.sha256);
function fh(e) {
	return BigInt(`0x${(0, Q.bytesToHex)(e)}`);
}
function ph(e) {
	return (0, Q.hexToBytes)(e.toString(16).padStart(64, "0"));
}
var mh = (0, Q.utf8ToBytes)("Bitcoin seed"), hh = {
	private: 76066276,
	public: 76067358
}, gh = 2147483648, _h = (e) => (0, Xm.ripemd160)((0, Yf.sha256)(e)), vh = (e) => (0, Q.createView)(e).getUint32(0, !1), yh = (e) => {
	if (!Number.isSafeInteger(e) || e < 0 || e > 2 ** 32 - 1) throw Error(`Invalid number=${e}. Should be from 0 to 2 ** 32 - 1`);
	let t = /* @__PURE__ */ new Uint8Array(4);
	return (0, Q.createView)(t).setUint32(0, e, !1), t;
}, bh = class e {
	constructor(e) {
		if (this.depth = 0, this.index = 0, this.chainCode = null, this.parentFingerprint = 0, !e || typeof e != "object") throw Error("HDKey.constructor must not be called directly");
		if (this.versions = e.versions || hh, this.depth = e.depth || 0, this.chainCode = e.chainCode, this.index = e.index || 0, this.parentFingerprint = e.parentFingerprint || 0, !this.depth && (this.parentFingerprint || this.index)) throw Error("HDKey: zero depth with non-zero index/parent fingerprint");
		if (e.publicKey && e.privateKey) throw Error("HDKey: publicKey and privateKey at same time.");
		if (e.privateKey) {
			if (!Z.isValidPrivateKey(e.privateKey)) throw Error("Invalid private key");
			this.privKey = typeof e.privateKey == "bigint" ? e.privateKey : fh(e.privateKey), this.privKeyBytes = ph(this.privKey), this.pubKey = wf(e.privateKey, !0);
		} else if (e.publicKey) this.pubKey = Gd.fromHex(e.publicKey).toRawBytes(!0);
		else throw Error("HDKey: no public or private key provided");
		this.pubHash = _h(this.pubKey);
	}
	get fingerprint() {
		if (!this.pubHash) throw Error("No publicKey set!");
		return vh(this.pubHash);
	}
	get identifier() {
		return this.pubHash;
	}
	get pubKeyHash() {
		return this.pubHash;
	}
	get privateKey() {
		return this.privKeyBytes || null;
	}
	get publicKey() {
		return this.pubKey || null;
	}
	get privateExtendedKey() {
		let e = this.privateKey;
		if (!e) throw Error("No private key");
		return dh.encode(this.serialize(this.versions.private, (0, Q.concatBytes)(new Uint8Array([0]), e)));
	}
	get publicExtendedKey() {
		if (!this.pubKey) throw Error("No public key");
		return dh.encode(this.serialize(this.versions.public, this.pubKey));
	}
	static fromMasterSeed(t, n = hh) {
		if ((0, Zf.bytes)(t), 8 * t.length < 128 || 8 * t.length > 512) throw Error(`HDKey: wrong seed length=${t.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
		let r = (0, am.hmac)(dm.sha512, mh, t);
		return new e({
			versions: n,
			chainCode: r.slice(32),
			privateKey: r.slice(0, 32)
		});
	}
	static fromExtendedKey(t, n = hh) {
		let r = dh.decode(t), i = (0, Q.createView)(r), a = i.getUint32(0, !1), o = {
			versions: n,
			depth: r[4],
			parentFingerprint: i.getUint32(5, !1),
			index: i.getUint32(9, !1),
			chainCode: r.slice(13, 45)
		}, s = r.slice(45), c = s[0] === 0;
		if (a !== n[c ? "private" : "public"]) throw Error("Version mismatch");
		return c ? new e({
			...o,
			privateKey: s.slice(1)
		}) : new e({
			...o,
			publicKey: s
		});
	}
	static fromJSON(t) {
		return e.fromExtendedKey(t.xpriv);
	}
	derive(e) {
		if (!/^[mM]'?/.test(e)) throw Error("Path must start with \"m\" or \"M\"");
		if (/^[mM]'?$/.test(e)) return this;
		let t = e.replace(/^[mM]'?\//, "").split("/"), n = this;
		for (let e of t) {
			let t = /^(\d+)('?)$/.exec(e);
			if (!t || t.length !== 3) throw Error(`Invalid child index: ${e}`);
			let r = +t[1];
			if (!Number.isSafeInteger(r) || r >= gh) throw Error("Invalid index");
			t[2] === "'" && (r += gh), n = n.deriveChild(r);
		}
		return n;
	}
	deriveChild(t) {
		if (!this.pubKey || !this.chainCode) throw Error("No publicKey or chainCode set");
		let n = yh(t);
		if (t >= gh) {
			let e = this.privateKey;
			if (!e) throw Error("Could not derive hardened child key");
			n = (0, Q.concatBytes)(new Uint8Array([0]), e, n);
		} else n = (0, Q.concatBytes)(this.pubKey, n);
		let r = (0, am.hmac)(dm.sha512, this.chainCode, n), i = fh(r.slice(0, 32)), a = r.slice(32);
		if (!Z.isValidPrivateKey(i)) throw Error("Tweak bigger than curve order");
		let o = {
			versions: this.versions,
			chainCode: a,
			depth: this.depth + 1,
			parentFingerprint: this.fingerprint,
			index: t
		};
		try {
			if (this.privateKey) {
				let e = Z.mod(this.privKey + i, Ad.n);
				if (!Z.isValidPrivateKey(e)) throw Error("The tweak was out of range or the resulted private key is invalid");
				o.privateKey = e;
			} else {
				let e = Gd.fromHex(this.pubKey).add(Gd.fromPrivateKey(i));
				if (e.equals(Gd.ZERO)) throw Error("The tweak was equal to negative P, which made the result key invalid");
				o.publicKey = e.toRawBytes(!0);
			}
			return new e(o);
		} catch {
			return this.deriveChild(t + 1);
		}
	}
	sign(e) {
		if (!this.privateKey) throw Error("No privateKey set!");
		return (0, Zf.bytes)(e, 32), Mf(e, this.privKey, {
			canonical: !0,
			der: !1
		});
	}
	verify(e, t) {
		if ((0, Zf.bytes)(e, 32), (0, Zf.bytes)(t, 64), !this.publicKey) throw Error("No publicKey set!");
		let n;
		try {
			n = Yd.fromCompact(t);
		} catch {
			return !1;
		}
		return Pf(n, e, this.publicKey);
	}
	wipePrivateData() {
		return this.privKey = void 0, this.privKeyBytes &&= (this.privKeyBytes.fill(0), void 0), this;
	}
	toJSON() {
		return {
			xpriv: this.privateExtendedKey,
			xpub: this.publicExtendedKey
		};
	}
	serialize(e, t) {
		if (!this.chainCode) throw Error("No chainCode set");
		return (0, Zf.bytes)(t, 33), (0, Q.concatBytes)(yh(e), new Uint8Array([this.depth]), yh(this.parentFingerprint), yh(this.index), this.chainCode, t);
	}
}, xh = Object.defineProperty, Sh = (e, t) => {
	for (var n in t) xh(e, n, {
		get: t[n],
		enumerable: !0
	});
};
function Ch() {
	return Z.bytesToHex(Z.randomPrivateKey());
}
function wh(e) {
	return Z.bytesToHex(Gf.getPublicKey(e));
}
Sh({}, {
	insertEventIntoAscendingList: () => kh,
	insertEventIntoDescendingList: () => Oh,
	normalizeURL: () => Dh,
	utf8Decoder: () => Th,
	utf8Encoder: () => Eh
});
var Th = new TextDecoder("utf-8"), Eh = new TextEncoder();
function Dh(e) {
	let t = new URL(e);
	return t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
}
function Oh(e, t) {
	let n = 0, r = e.length - 1, i, a = n;
	if (r < 0) a = 0;
	else if (t.created_at < e[r].created_at) a = r + 1;
	else if (t.created_at >= e[n].created_at) a = n;
	else for (;;) {
		if (r <= n + 1) {
			a = r;
			break;
		}
		if (i = Math.floor(n + (r - n) / 2), e[i].created_at > t.created_at) n = i;
		else if (e[i].created_at < t.created_at) r = i;
		else {
			a = i;
			break;
		}
	}
	return e[a]?.id === t.id ? e : [
		...e.slice(0, a),
		t,
		...e.slice(a)
	];
}
function kh(e, t) {
	let n = 0, r = e.length - 1, i, a = n;
	if (r < 0) a = 0;
	else if (t.created_at > e[r].created_at) a = r + 1;
	else if (t.created_at <= e[n].created_at) a = n;
	else for (;;) {
		if (r <= n + 1) {
			a = r;
			break;
		}
		if (i = Math.floor(n + (r - n) / 2), e[i].created_at < t.created_at) n = i;
		else if (e[i].created_at > t.created_at) r = i;
		else {
			a = i;
			break;
		}
	}
	return e[a]?.id === t.id ? e : [
		...e.slice(0, a),
		t,
		...e.slice(a)
	];
}
function Ah(e, t) {
	let n = e;
	return n.pubkey = wh(t), n.id = Mh(n), n.sig = Ih(n, t), n;
}
function jh(e) {
	if (!Ph(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function Mh(e) {
	let t = (0, Yf.sha256)(Eh.encode(jh(e)));
	return Z.bytesToHex(t);
}
var Nh = (e) => e instanceof Object;
function Ph(e) {
	if (!Nh(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !e.pubkey.match(/^[a-f0-9]{64}$/) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] == "object") return !1;
	}
	return !0;
}
function Fh(e) {
	return Gf.verifySync(e.sig, Mh(e), e.pubkey);
}
function Ih(e, t) {
	return Z.bytesToHex(Gf.signSync(Mh(e), t));
}
function Lh(e, t) {
	if (e.ids && e.ids.indexOf(t.id) === -1 && !e.ids.some((e) => t.id.startsWith(e)) || e.kinds && e.kinds.indexOf(t.kind) === -1 || e.authors && e.authors.indexOf(t.pubkey) === -1 && !e.authors.some((e) => t.pubkey.startsWith(e))) return !1;
	for (let n in e) if (n[0] === "#") {
		let r = e[`#${n.slice(1)}`];
		if (r && !t.tags.find(([e, t]) => e === n.slice(1) && r.indexOf(t) !== -1)) return !1;
	}
	return !(e.since && t.created_at < e.since || e.until && t.created_at >= e.until);
}
function Rh(e, t) {
	for (let n = 0; n < e.length; n++) if (Lh(e[n], t)) return !0;
	return !1;
}
Sh({}, {
	getHex64: () => zh,
	getInt: () => Bh,
	getSubscriptionId: () => Vh,
	matchEventId: () => Hh,
	matchEventKind: () => Wh,
	matchEventPubkey: () => Uh
});
function zh(e, t) {
	let n = t.length + 3, r = e.indexOf(`"${t}":`) + n, i = e.slice(r).indexOf("\"") + r + 1;
	return e.slice(i, i + 64);
}
function Bh(e, t) {
	let n = t.length, r = e.indexOf(`"${t}":`) + n + 3, i = e.slice(r), a = Math.min(i.indexOf(","), i.indexOf("}"));
	return parseInt(i.slice(0, a), 10);
}
function Vh(e) {
	let t = e.slice(0, 22).indexOf("\"EVENT\"");
	if (t === -1) return null;
	let n = e.slice(t + 7 + 1).indexOf("\"");
	if (n === -1) return null;
	let r = t + 7 + 1 + n, i = e.slice(r + 1, 80).indexOf("\"");
	if (i === -1) return null;
	let a = r + 1 + i;
	return e.slice(r + 1, a);
}
function Hh(e, t) {
	return t === zh(e, "id");
}
function Uh(e, t) {
	return t === zh(e, "pubkey");
}
function Wh(e, t) {
	return t === Bh(e, "kind");
}
var Gh = () => ({
	connect: [],
	disconnect: [],
	error: [],
	notice: [],
	auth: []
});
function Kh(e, t = {}) {
	let { listTimeout: n = 3e3, getTimeout: r = 3e3, countTimeout: i = 3e3 } = t;
	var a, o = {}, s = Gh(), c = {}, l = {}, u;
	async function d() {
		return u || (u = new Promise((t, n) => {
			try {
				a = new WebSocket(e);
			} catch (e) {
				n(e);
			}
			a.onopen = () => {
				s.connect.forEach((e) => e()), t();
			}, a.onerror = () => {
				u = void 0, s.error.forEach((e) => e()), n();
			}, a.onclose = async () => {
				u = void 0, s.disconnect.forEach((e) => e());
			};
			let r = [], i;
			a.onmessage = (e) => {
				r.push(e.data), i ||= setInterval(d, 0);
			};
			function d() {
				if (r.length === 0) {
					clearInterval(i), i = null;
					return;
				}
				var t = r.shift();
				if (!t) return;
				let n = Vh(t);
				if (n) {
					let r = o[n];
					if (r && r.alreadyHaveEvent && r.alreadyHaveEvent(zh(t, "id"), e)) return;
				}
				try {
					let e = JSON.parse(t);
					switch (e[0]) {
						case "EVENT": {
							let t = e[1], n = e[2];
							Ph(n) && o[t] && (o[t].skipVerification || Fh(n)) && Rh(o[t].filters, n) && (o[t], (c[t]?.event || []).forEach((e) => e(n)));
							return;
						}
						case "COUNT":
							let t = e[1], n = e[2];
							o[t] && (c[t]?.count || []).forEach((e) => e(n));
							return;
						case "EOSE": {
							let t = e[1];
							t in c && (c[t].eose.forEach((e) => e()), c[t].eose = []);
							return;
						}
						case "OK": {
							let t = e[1], n = e[2], r = e[3] || "";
							t in l && (n ? l[t].ok.forEach((e) => e()) : l[t].failed.forEach((e) => e(r)), l[t].ok = [], l[t].failed = []);
							return;
						}
						case "NOTICE":
							let r = e[1];
							s.notice.forEach((e) => e(r));
							return;
						case "AUTH": {
							let t = e[1];
							s.auth?.forEach((e) => e(t));
							return;
						}
					}
				} catch {
					return;
				}
			}
		}), u);
	}
	function f() {
		return a?.readyState === 1;
	}
	async function p() {
		f() || await d();
	}
	async function m(e) {
		let t = JSON.stringify(e);
		if (!(!f() && (await new Promise((e) => setTimeout(e, 1e3)), !f()))) try {
			a.send(t);
		} catch (e) {
			console.log(e);
		}
	}
	let h = (e, { verb: t = "REQ", skipVerification: n = !1, alreadyHaveEvent: r = null, id: i = Math.random().toString().slice(2) } = {}) => {
		let a = i;
		return o[a] = {
			id: a,
			filters: e,
			skipVerification: n,
			alreadyHaveEvent: r
		}, m([
			t,
			a,
			...e
		]), {
			sub: (t, i = {}) => h(t || e, {
				skipVerification: i.skipVerification || n,
				alreadyHaveEvent: i.alreadyHaveEvent || r,
				id: a
			}),
			unsub: () => {
				delete o[a], delete c[a], m(["CLOSE", a]);
			},
			on: (e, t) => {
				c[a] = c[a] || {
					event: [],
					count: [],
					eose: []
				}, c[a][e].push(t);
			},
			off: (e, t) => {
				let n = c[a], r = n[e].indexOf(t);
				r >= 0 && n[e].splice(r, 1);
			}
		};
	};
	function g(e, t) {
		if (!e.id) throw Error(`event ${e} has no id`);
		let n = e.id;
		return m([t, e]), {
			on: (e, t) => {
				l[n] = l[n] || {
					ok: [],
					failed: []
				}, l[n][e].push(t);
			},
			off: (e, t) => {
				let r = l[n];
				if (!r) return;
				let i = r[e].indexOf(t);
				i >= 0 && r[e].splice(i, 1);
			}
		};
	}
	return {
		url: e,
		sub: h,
		on: (e, t) => {
			s[e].push(t), e === "connect" && a?.readyState === 1 && t();
		},
		off: (e, t) => {
			let n = s[e].indexOf(t);
			n !== -1 && s[e].splice(n, 1);
		},
		list: (e, t) => new Promise((r) => {
			let i = h(e, t), a = [], o = setTimeout(() => {
				i.unsub(), r(a);
			}, n);
			i.on("eose", () => {
				i.unsub(), clearTimeout(o), r(a);
			}), i.on("event", (e) => {
				a.push(e);
			});
		}),
		get: (e, t) => new Promise((n) => {
			let i = h([e], t), a = setTimeout(() => {
				i.unsub(), n(null);
			}, r);
			i.on("event", (e) => {
				i.unsub(), clearTimeout(a), n(e);
			});
		}),
		count: (e) => new Promise((t) => {
			let n = h(e, {
				...h,
				verb: "COUNT"
			}), r = setTimeout(() => {
				n.unsub(), t(null);
			}, i);
			n.on("count", (e) => {
				n.unsub(), clearTimeout(r), t(e);
			});
		}),
		publish(e) {
			return g(e, "EVENT");
		},
		auth(e) {
			return g(e, "AUTH");
		},
		connect: p,
		close() {
			s = Gh(), c = {}, l = {}, a.readyState === WebSocket.OPEN && a?.close();
		},
		get status() {
			return a?.readyState ?? 3;
		}
	};
}
var qh = class {
	_conn;
	_seenOn = {};
	eoseSubTimeout;
	getTimeout;
	constructor(e = {}) {
		this._conn = {}, this.eoseSubTimeout = e.eoseSubTimeout || 3400, this.getTimeout = e.getTimeout || 3400;
	}
	close(e) {
		e.forEach((e) => {
			let t = this._conn[Dh(e)];
			t && t.close();
		});
	}
	async ensureRelay(e) {
		let t = Dh(e);
		this._conn[t] || (this._conn[t] = Kh(t, {
			getTimeout: this.getTimeout * .9,
			listTimeout: this.getTimeout * .9
		}));
		let n = this._conn[t];
		return await n.connect(), n;
	}
	sub(e, t, n) {
		let r = /* @__PURE__ */ new Set(), i = { ...n || {} };
		i.alreadyHaveEvent = (e, t) => {
			if (n?.alreadyHaveEvent?.(e, t)) return !0;
			let i = this._seenOn[e] || /* @__PURE__ */ new Set();
			return i.add(t), this._seenOn[e] = i, r.has(e);
		};
		let a = [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = e.length, l = !1, u = setTimeout(() => {
			l = !0;
			for (let e of s.values()) e();
		}, this.eoseSubTimeout);
		e.forEach(async (e) => {
			let n;
			try {
				n = await this.ensureRelay(e);
			} catch {
				f();
				return;
			}
			if (!n) return;
			let d = n.sub(t, i);
			d.on("event", (e) => {
				r.add(e.id);
				for (let t of o.values()) t(e);
			}), d.on("eose", () => {
				l || f();
			}), a.push(d);
			function f() {
				if (c--, c === 0) {
					clearTimeout(u);
					for (let e of s.values()) e();
				}
			}
		});
		let d = {
			sub(e, t) {
				return a.forEach((n) => n.sub(e, t)), d;
			},
			unsub() {
				a.forEach((e) => e.unsub());
			},
			on(e, t) {
				e === "event" ? o.add(t) : e === "eose" && s.add(t);
			},
			off(e, t) {
				e === "event" ? o.delete(t) : e === "eose" && s.delete(t);
			}
		};
		return d;
	}
	get(e, t, n) {
		return new Promise((r) => {
			let i = this.sub(e, [t], n), a = setTimeout(() => {
				i.unsub(), r(null);
			}, this.getTimeout);
			i.on("event", (e) => {
				r(e), clearTimeout(a), i.unsub();
			});
		});
	}
	list(e, t, n) {
		return new Promise((r) => {
			let i = [], a = this.sub(e, t, n);
			a.on("event", (e) => {
				i.push(e);
			}), a.on("eose", () => {
				a.unsub(), r(i);
			});
		});
	}
	publish(e, t) {
		let n = e.map(async (e) => {
			let n;
			try {
				return n = await this.ensureRelay(e), n.publish(t);
			} catch {
				return {
					on() {},
					off() {}
				};
			}
		}), r = /* @__PURE__ */ new Map();
		return {
			on(t, i) {
				e.forEach(async (e, a) => {
					let o = await n[a], s = () => i(e);
					r.set(i, s), o.on(t, s);
				});
			},
			off(t, i) {
				e.forEach(async (e, a) => {
					let o = r.get(i);
					o && (await n[a]).off(t, o);
				});
			}
		};
	}
	seenOn(e) {
		return Array.from(this._seenOn[e]?.values?.() || []);
	}
}, Jh = {};
Sh(Jh, {
	decode: () => Xh,
	naddrEncode: () => ig,
	neventEncode: () => rg,
	noteEncode: () => eg,
	nprofileEncode: () => ng,
	npubEncode: () => $h,
	nrelayEncode: () => ag,
	nsecEncode: () => Qh
});
var Yh = 5e3;
function Xh(e) {
	let { prefix: t, words: n } = em.decode(e, Yh), r = new Uint8Array(em.fromWords(n));
	switch (t) {
		case "nprofile": {
			let e = Zh(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nprofile");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: Z.bytesToHex(e[0][0]),
					relays: e[1] ? e[1].map((e) => Th.decode(e)) : []
				}
			};
		}
		case "nevent": {
			let e = Zh(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nevent");
			if (e[0][0].length !== 32) throw Error("TLV 0 should be 32 bytes");
			if (e[2] && e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			return {
				type: "nevent",
				data: {
					id: Z.bytesToHex(e[0][0]),
					relays: e[1] ? e[1].map((e) => Th.decode(e)) : [],
					author: e[2]?.[0] ? Z.bytesToHex(e[2][0]) : void 0
				}
			};
		}
		case "naddr": {
			let e = Zh(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for naddr");
			if (!e[2]?.[0]) throw Error("missing TLV 2 for naddr");
			if (e[2][0].length !== 32) throw Error("TLV 2 should be 32 bytes");
			if (!e[3]?.[0]) throw Error("missing TLV 3 for naddr");
			if (e[3][0].length !== 4) throw Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: Th.decode(e[0][0]),
					pubkey: Z.bytesToHex(e[2][0]),
					kind: parseInt(Z.bytesToHex(e[3][0]), 16),
					relays: e[1] ? e[1].map((e) => Th.decode(e)) : []
				}
			};
		}
		case "nrelay": {
			let e = Zh(r);
			if (!e[0]?.[0]) throw Error("missing TLV 0 for nrelay");
			return {
				type: "nrelay",
				data: Th.decode(e[0][0])
			};
		}
		case "nsec":
		case "npub":
		case "note": return {
			type: t,
			data: Z.bytesToHex(r)
		};
		default: throw Error(`unknown prefix ${t}`);
	}
}
function Zh(e) {
	let t = {}, n = e;
	for (; n.length > 0;) {
		let e = n[0], r = n[1], i = n.slice(2, 2 + r);
		n = n.slice(2 + r), !(i.length < r) && (t[e] = t[e] || [], t[e].push(i));
	}
	return t;
}
function Qh(e) {
	return tg("nsec", e);
}
function $h(e) {
	return tg("npub", e);
}
function eg(e) {
	return tg("note", e);
}
function tg(e, t) {
	let n = Z.hexToBytes(t), r = em.toWords(n);
	return em.encode(e, r, Yh);
}
function ng(e) {
	let t = og({
		0: [Z.hexToBytes(e.pubkey)],
		1: (e.relays || []).map((e) => Eh.encode(e))
	}), n = em.toWords(t);
	return em.encode("nprofile", n, Yh);
}
function rg(e) {
	let t = og({
		0: [Z.hexToBytes(e.id)],
		1: (e.relays || []).map((e) => Eh.encode(e)),
		2: e.author ? [Z.hexToBytes(e.author)] : []
	}), n = em.toWords(t);
	return em.encode("nevent", n, Yh);
}
function ig(e) {
	let t = /* @__PURE__ */ new ArrayBuffer(4);
	new DataView(t).setUint32(0, e.kind, !1);
	let n = og({
		0: [Eh.encode(e.identifier)],
		1: (e.relays || []).map((e) => Eh.encode(e)),
		2: [Z.hexToBytes(e.pubkey)],
		3: [new Uint8Array(t)]
	}), r = em.toWords(n);
	return em.encode("naddr", r, Yh);
}
function ag(e) {
	let t = og({ 0: [Eh.encode(e)] }), n = em.toWords(t);
	return em.encode("nrelay", n, Yh);
}
function og(e) {
	let t = [];
	return Object.entries(e).forEach(([e, n]) => {
		n.forEach((n) => {
			let r = new Uint8Array(n.length + 2);
			r.set([parseInt(e)], 0), r.set([n.length], 1), r.set(n, 2), t.push(r);
		});
	}), Z.concatBytes(...t);
}
Sh({}, {
	decrypt: () => cg,
	encrypt: () => sg
});
async function sg(e, t, n) {
	let r = lg(Ef(e, "02" + t)), i = Uint8Array.from((0, Q.randomBytes)(16)), a = Eh.encode(n), o = await crypto.subtle.importKey("raw", r, { name: "AES-CBC" }, !1, ["encrypt"]), s = await crypto.subtle.encrypt({
		name: "AES-CBC",
		iv: i
	}, o, a);
	return `${Hp.encode(new Uint8Array(s))}?iv=${Hp.encode(new Uint8Array(i.buffer))}`;
}
async function cg(e, t, n) {
	let [r, i] = n.split("?iv="), a = lg(Ef(e, "02" + t)), o = await crypto.subtle.importKey("raw", a, { name: "AES-CBC" }, !1, ["decrypt"]), s = Hp.decode(r), c = Hp.decode(i), l = await crypto.subtle.decrypt({
		name: "AES-CBC",
		iv: c
	}, o, s);
	return Th.decode(l);
}
function lg(e) {
	return e.slice(1, 33);
}
Sh({}, {
	queryProfile: () => pg,
	searchDomain: () => fg,
	useFetchImplementation: () => dg
});
var ug;
try {
	ug = fetch;
} catch {}
function dg(e) {
	ug = e;
}
async function fg(e, t = "") {
	try {
		return (await (await ug(`https://${e}/.well-known/nostr.json?name=${t}`)).json()).names;
	} catch {
		return {};
	}
}
async function pg(e) {
	let [t, n] = e.split("@");
	if (n || (n = t, t = "_"), !t.match(/^[A-Za-z0-9-_.]+$/) || !n.includes(".")) return null;
	let r;
	try {
		r = await (await ug(`https://${n}/.well-known/nostr.json?name=${t}`)).json();
	} catch {
		return null;
	}
	if (!r?.names?.[t]) return null;
	let i = r.names[t];
	return {
		pubkey: i,
		relays: r.relays?.[i] || []
	};
}
Sh({}, {
	generateSeedWords: () => hg,
	privateKeyFromSeedWords: () => mg,
	validateWords: () => gg
});
function mg(e, t) {
	let n = bh.fromMasterSeed((0, rm.mnemonicToSeedSync)(e, t)).derive("m/44'/1237'/0'/0/0").privateKey;
	if (!n) throw Error("could not derive private key");
	return Z.bytesToHex(n);
}
function hg() {
	return (0, rm.generateMnemonic)(nm.wordlist);
}
function gg(e) {
	return (0, rm.validateMnemonic)(e, nm.wordlist);
}
Sh({}, { parse: () => _g });
function _g(e) {
	let t = {
		reply: void 0,
		root: void 0,
		mentions: [],
		profiles: []
	}, n = [];
	for (let r of e.tags) r[0] === "e" && r[1] && n.push(r), r[0] === "p" && r[1] && t.profiles.push({
		pubkey: r[1],
		relays: r[2] ? [r[2]] : []
	});
	for (let e = 0; e < n.length; e++) {
		let [r, i, a, o] = n[e], s = {
			id: i,
			relays: a ? [a] : []
		}, c = e === 0, l = e === n.length - 1;
		o === "root" ? t.root = s : o === "reply" ? t.reply = s : o === "mention" ? t.mentions.push(s) : c ? t.root = s : l ? t.reply = s : t.mentions.push(s);
	}
	return t;
}
Sh({}, { getPow: () => vg });
function vg(e) {
	return yg(Z.hexToBytes(e));
}
function yg(e) {
	let t, n, r;
	for (n = 0, t = 0; n < e.length && (r = bg(e[n]), t += r, r === 8); n++);
	return t;
}
function bg(e) {
	let t = 0;
	if (e === 0) return 8;
	for (; e >>= 1;) t++;
	return 7 - t;
}
Sh({}, {
	BECH32_REGEX: () => xg,
	NOSTR_URI_REGEX: () => Sg,
	parse: () => wg,
	test: () => Cg
});
var xg = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/, Sg = RegExp(`nostr:(${xg.source})`);
function Cg(e) {
	return typeof e == "string" && RegExp(`^${Sg.source}$`).test(e);
}
function wg(e) {
	let t = e.match(RegExp(`^${Sg.source}$`));
	if (!t) throw Error(`Invalid Nostr URI: ${e}`);
	return {
		uri: t[0],
		value: t[1],
		decoded: Xh(t[1])
	};
}
Sh({}, {
	createDelegation: () => Tg,
	getDelegator: () => Eg
});
function Tg(e, t) {
	let n = [];
	(t.kind || -1) >= 0 && n.push(`kind=${t.kind}`), t.until && n.push(`created_at<${t.until}`), t.since && n.push(`created_at>${t.since}`);
	let r = n.join("&");
	if (r === "") throw Error("refusing to create a delegation without any conditions");
	let i = (0, Yf.sha256)(Eh.encode(`nostr:delegation:${t.pubkey}:${r}`)), a = Z.bytesToHex(Gf.signSync(i, e));
	return {
		from: wh(e),
		to: t.pubkey,
		cond: r,
		sig: a
	};
}
function Eg(e) {
	let t = e.tags.find((e) => e[0] === "delegation" && e.length >= 4);
	if (!t) return null;
	let n = t[1], r = t[2], i = t[3], a = r.split("&");
	for (let t = 0; t < a.length; t++) {
		let [n, r, i] = a[t].split(/\b/);
		if ((n !== "kind" || r !== "=" || e.kind !== parseInt(i)) && !(n === "created_at" && r === "<" && e.created_at < parseInt(i)) && !(n === "created_at" && r === ">" && e.created_at > parseInt(i))) return null;
	}
	let o = (0, Yf.sha256)(Eh.encode(`nostr:delegation:${e.pubkey}:${r}`));
	return Gf.verifySync(i, o, n) ? n : null;
}
Sh({}, {
	matchAll: () => Og,
	regex: () => Dg,
	replaceAll: () => kg
});
var Dg = () => RegExp(`\\b${Sg.source}\\b`, "g");
function* Og(e) {
	let t = e.matchAll(Dg());
	for (let e of t) {
		let [t, n] = e;
		yield {
			uri: t,
			value: n,
			decoded: Xh(n),
			start: e.index,
			end: e.index + t.length
		};
	}
}
function kg(e, t) {
	return e.replaceAll(Dg(), (e, n) => t({
		uri: e,
		value: n,
		decoded: Xh(n)
	}));
}
Sh({}, {
	useFetchImplementation: () => jg,
	validateGithub: () => Mg
});
var Ag;
try {
	Ag = fetch;
} catch {}
function jg(e) {
	Ag = e;
}
async function Mg(e, t, n) {
	try {
		return await (await Ag(`https://gist.github.com/${t}/${n}/raw`)).text() === `Verifying that I control the following Nostr public key: ${e}`;
	} catch {
		return !1;
	}
}
Sh({}, { authenticate: () => Ng });
var Ng = async ({ challenge: e, relay: t, sign: n }) => {
	let r = {
		kind: 22242,
		created_at: Math.floor(Date.now() / 1e3),
		tags: [["relay", t.url], ["challenge", e]],
		content: ""
	}, i = t.auth(await n(r));
	return new Promise((e, t) => {
		i.on("ok", function t() {
			i.off("ok", t), e();
		}), i.on("failed", function e(n) {
			i.off("failed", e), t(n);
		});
	});
}, Pg = {};
Sh(Pg, {
	getZapEndpoint: () => Lg,
	makeZapReceipt: () => Bg,
	makeZapRequest: () => Rg,
	useFetchImplementation: () => Ig,
	validateZapRequest: () => zg
});
var Fg;
try {
	Fg = fetch;
} catch {}
function Ig(e) {
	Fg = e;
}
async function Lg(e) {
	try {
		let t = "", { lud06: n, lud16: r } = JSON.parse(e.content);
		if (n) {
			let { words: e } = em.decode(n, 1e3), r = em.fromWords(e);
			t = Th.decode(r);
		} else if (r) {
			let [e, n] = r.split("@");
			t = `https://${n}/.well-known/lnurlp/${e}`;
		} else return null;
		let i = await (await Fg(t)).json();
		if (i.allowsNostr && i.nostrPubkey) return i.callback;
	} catch {}
	return null;
}
function Rg({ profile: e, event: t, amount: n, relays: r, comment: i = "" }) {
	if (!n) throw Error("amount not given");
	if (!e) throw Error("profile not given");
	let a = {
		kind: 9734,
		created_at: Math.round(Date.now() / 1e3),
		content: i,
		tags: [
			["p", e],
			["amount", n.toString()],
			["relays", ...r]
		]
	};
	return t && a.tags.push(["e", t]), a;
}
function zg(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return "Invalid zap request JSON.";
	}
	if (!Ph(t)) return "Zap request is not a valid Nostr event.";
	if (!Fh(t)) return "Invalid signature on zap request.";
	let n = t.tags.find(([e, t]) => e === "p" && t);
	if (!n) return "Zap request doesn't have a 'p' tag.";
	if (!n[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
	let r = t.tags.find(([e, t]) => e === "e" && t);
	return r && !r[1].match(/^[a-f0-9]{64}$/) ? "Zap request 'e' tag is not valid hex." : t.tags.find(([e, t]) => e === "relays" && t) ? null : "Zap request doesn't have a 'relays' tag.";
}
function Bg({ zapRequest: e, preimage: t, bolt11: n, paidAt: r }) {
	let i = JSON.parse(e).tags.filter(([e]) => e === "e" || e === "p" || e === "a"), a = {
		kind: 9735,
		created_at: Math.round(r.getTime() / 1e3),
		content: "",
		tags: [
			...i,
			["bolt11", n],
			["description", e]
		]
	};
	return t && a.tags.push(["preimage", t]), a;
}
Z.hmacSha256Sync = (e, ...t) => (0, am.hmac)(Yf.sha256, e, Z.concatBytes(...t)), Z.sha256Sync = (...e) => (0, Yf.sha256)(Z.concatBytes(...e));
var Vg = (e) => Jh.decode(e).data, Hg = (e) => Jh.decode(e).data, Ug = {}, Wg = async (e) => {
	if (Ug[e]) return Ug[e];
	let t = new qh(), n = [
		"wss://relay.ditto.pub",
		"wss://purplepag.es",
		"wss://relay.damus.io",
		"wss://nostr.wine"
	];
	try {
		return await t.get(n, {
			authors: [e],
			kinds: [0]
		});
	} catch {
		throw Error("failed to fetch user profile :(");
	} finally {
		t.close(n);
	}
}, Gg = (e) => JSON.parse(e.content), Kg = async (e) => {
	let t = await Pg.getZapEndpoint(e);
	if (!t) throw Error("failed to retrieve zap endpoint :(");
	return t;
}, qg = async (e, t) => {
	let n = Xg() && !t;
	if (n) try {
		return {
			signedEvent: await window.nostr.signEvent(e),
			signedAnonymously: !1,
			usedAnonymousFallback: !1
		};
	} catch {}
	return e.tags.some((e) => e[0] === "anon") || e.tags.push(["anon"]), {
		signedEvent: Ah(e, Ch()),
		signedAnonymously: !0,
		usedAnonymousFallback: n
	};
}, Jg = async ({ profile: e, nip19Target: t, amount: n, relays: r, comment: i, anon: a }) => {
	let o = Pg.makeZapRequest({
		profile: e,
		event: t && t.startsWith("note") ? Hg(t) : void 0,
		amount: n,
		relays: r,
		comment: i
	}), s = t && t.startsWith("naddr") ? Hg(t) : void 0;
	if (s) {
		let e = s.relays ? s.relays.reduce((e, t) => `${t},${e}`, "") : "";
		o.tags.push([
			"a",
			`${s.kind}:${s.pubkey}:${s.identifier}`,
			e
		]);
	}
	return (!Xg() || a) && o.tags.push(["anon"]), qg(o, a);
}, Yg = async ({ zapEndpoint: e, amount: t, comment: n, authorId: r, nip19Target: i, normalizedRelays: a, anon: o }) => {
	let { signedEvent: s, signedAnonymously: c, usedAnonymousFallback: l } = await Jg({
		profile: r,
		nip19Target: i,
		amount: t,
		relays: a,
		comment: n,
		anon: o
	}), u = `${e}?amount=${t}&nostr=${encodeURIComponent(JSON.stringify(s))}`;
	n && (u = `${u}&comment=${encodeURIComponent(n)}`);
	let { pr: d, reason: f, status: p } = await (await fetch(u)).json();
	if (d) return {
		invoice: d,
		signedAnonymously: c,
		usedAnonymousFallback: l
	};
	throw Error(p === "ERROR" ? f ?? "Unable to fetch invoice" : "Unable to fetch invoice");
}, Xg = () => window !== void 0 && window.nostr !== void 0, Zg = ({ relays: e, invoice: t, onSuccess: n, recipientPubkey: r }) => {
	let i = new qh(), a = Array.from(/* @__PURE__ */ new Set([...e, "wss://relay.ditto.pub"])), o = Math.round(Date.now() / 1e3), s = !1, c = null, l = null, u = () => {
		s || (s = !0, l &&= (clearInterval(l), null), c &&= (c.unsub(), null), i.close(a));
	}, d = {
		kinds: [9735],
		since: o
	};
	r && (d["#p"] = [r]);
	let f = () => {
		s || (c &&= (c.unsub(), null), c = i.sub(a, [d]), c.on("event", (e) => {
			s || e.tags.find((e) => e[0] === "bolt11" && e[1] === t) && (n(), u());
		}));
	};
	return f(), l = setInterval(f, 5e3), u;
}, Qg = "nostrZap.", $g = "lightningUri", e_ = () => typeof localStorage < "u", t_ = (e) => {
	if (e_()) return localStorage.getItem(`${Qg}${e}`);
}, n_ = (e, t) => {
	e_() && localStorage.setItem(`${Qg}${e}`, t);
}, r_ = () => t_($g), i_ = (e) => n_($g, e), a_ = null, o_ = (e) => String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"), s_ = (e) => {
	try {
		let { protocol: t } = new URL(e);
		return t === "https:" || t === "http:";
	} catch {
		return !1;
	}
}, c_ = (e, t) => {
	if (e?.lud16 && typeof e.lud16 == "string") return e.lud16;
	try {
		return new URL(t).host;
	} catch {
		return t;
	}
}, l_ = (e) => {
	if (typeof e != "string") return null;
	let t = e.trim();
	return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(t) ? t : null;
}, u_ = (e) => {
	e = e.replace(/^#/, ""), e.length === 3 && (e = e.split("").map((e) => e + e).join(""));
	let t = parseInt(e, 16);
	return {
		r: t >> 16 & 255,
		g: t >> 8 & 255,
		b: t & 255
	};
}, d_ = ({ r: e, g: t, b: n }) => (e * 299 + t * 587 + n * 114) / 1e3, f_ = (e) => d_(u_(e)) < 128 ? "#fff" : "#000", p_ = (e) => {
	let t = document.createElement("dialog");
	return t.classList.add("nostr-zap-dialog"), t.innerHTML = e, t.addEventListener("click", function({ clientX: e, clientY: n }) {
		let { left: r, right: i, top: a, bottom: o } = t.getBoundingClientRect();
		(e !== 0 || n !== 0) && (e < r || e > i || n < a || n > o) && t.close();
	}), S_(), a_.appendChild(t), t;
}, m_ = (e = !1) => `<p class="zap-anon-notice">Extension signing was declined or failed. This zap ${e ? "was" : "will be"} sent anonymously.</p>`, h_ = () => {
	let e = p_(`
    <button class="close-button">X</button>
    ${m_(!0)}
    <button class="cta-button">OK</button>
  `);
	return e.addEventListener("close", function() {
		e.remove();
	}), e.querySelector(".close-button").addEventListener("click", function() {
		e.close();
	}), e.querySelector(".cta-button").addEventListener("click", function() {
		e.close();
	}), e;
}, g_ = ({ dialogHeader: e, invoice: t, relays: n, buttonColor: r, usedAnonymousFallback: i, recipientPubkey: a }) => {
	let o = r_(), s = l_(r), c = p_(`
        <button class="close-button">X</button>
        ${e}
        ${i ? m_() : ""}
        <div class="qrcode">
          <div class="overlay">copied invoice to clipboard</div>
        </div>
        <p>click QR code to copy invoice</p>
        <select name="lightning-wallet">
          ${[
		{
			label: "Default Wallet",
			value: "lightning:"
		},
		{
			label: "Strike",
			value: "strike:lightning:"
		},
		{
			label: "Cash App",
			value: "https://cash.app/launch/lightning/"
		},
		{
			label: "Muun",
			value: "muun:"
		},
		{
			label: "Blue Wallet",
			value: "bluewallet:lightning:"
		},
		{
			label: "Wallet of Satoshi",
			value: "walletofsatoshi:lightning:"
		},
		{
			label: "Zebedee",
			value: "zebedee:lightning:"
		},
		{
			label: "Zeus LN",
			value: "zeusln:lightning:"
		},
		{
			label: "Phoenix",
			value: "phoenix://"
		},
		{
			label: "Breez",
			value: "breez:"
		},
		{
			label: "Bitcoin Beach",
			value: "bitcoinbeach://"
		},
		{
			label: "Blixt",
			value: "blixtwallet:lightning:"
		},
		{
			label: "River",
			value: "river://"
		}
	].map(({ label: e, value: t }) => `<option value="${t}" ${o === t ? "selected" : ""}>${e}</option>`).join("")}
        </select>
        <button class="cta-button"
          ${s ? `style="background-color: ${s}; color: ${f_(s)}"` : ""} 
        >Open Wallet</button>
      `), l = c.querySelector(".qrcode"), u = c.querySelector("select[name=\"lightning-wallet\"]"), d = c.querySelector(".cta-button"), f = l.querySelector(".overlay"), p = Zg({
		relays: n,
		invoice: t,
		recipientPubkey: a,
		onSuccess: () => {
			c.close();
		}
	});
	return new (/*@__PURE__*/ yd(wd))(l, {
		text: t,
		quietZone: 10
	}), l.addEventListener("click", function() {
		navigator.clipboard.writeText(t), f.classList.add("show"), setTimeout(() => f.classList.remove("show"), 2e3);
	}), d.addEventListener("click", function() {
		i_(u.value), window.location.href = `${u.value}${t}`;
	}), c.addEventListener("close", function() {
		p(), c.remove();
	}), c.querySelector(".close-button").addEventListener("click", function() {
		c.close();
	}), c;
}, __ = async ({ npub: e, nip19Target: t, relays: n, buttonColor: r, anon: i }) => {
	let a = (e) => `${e.substring(0, 12)}...${e.substring(e.length - 12)}`, o = n ? n.split(",") : [
		"wss://relay.ditto.pub",
		"wss://relay.damus.io",
		"wss://nos.lol"
	], s = Vg(e), c = Wg(s), l = c.then(Kg), u = l_(r), d = "https://pbs.twimg.com/profile_images/1604195803748306944/LxHDoJ7P_400x400.jpg", f = async () => {
		let [n, r] = await Promise.all([c, l]), i = Gg(n), { picture: o, display_name: s, name: u } = i, f = o && s_(o) ? o : d;
		return `
      <h2>${o_(s || u || "")}</h2>
        <img
          src="${o_(f)}"
          width="80"
          height="80"
          alt="nostr user avatar"
        />
      <p class="zap-destination">${o_(c_(i, r))}</p>
      <p>${o_(a(t || e))}</p>
    `;
	}, p = p_(`
      <button class="close-button">X</button>
      <div class="dialog-header-container">
        <h2 class="skeleton-placeholder"></h2>
          <img
            src="${d}"
            width="80"
            height="80"
            alt="placeholder avatar"
          />
        <p class="skeleton-placeholder"></p>
      </div>
      <div class="preset-zap-options-container">
        <button data-value="21">21 \u{26A1}\u{FE0F}</button>
        <button data-value="69">69 \u{26A1}\u{FE0F}</button>
        <button data-value="420">420 \u{26A1}\u{FE0F}</button>
        <button data-value="1337">1337 \u{26A1}\u{FE0F}</button>
        <button data-value="5000">5k \u{26A1}\u{FE0F}</button>
        <button data-value="10000">10k \u{26A1}\u{FE0F}</button>
        <button data-value="21000">21k \u{26A1}\u{FE0F}</button>
        <button data-value="1000000">1M \u{26A1}\u{FE0F}</button>
      </div>
      <form>
        <input name="amount" type="number" placeholder="amount in sats" required />
        <input name="comment" placeholder="optional comment" />
        <button class="cta-button" 
          ${u ? `style="background-color: ${u}; color: ${f_(u)}"` : ""} 
          type="submit" disabled>Zap</button>
      </form>
    `), m = p.querySelector(".preset-zap-options-container"), h = p.querySelector("form"), g = p.querySelector("input[name=\"amount\"]"), _ = p.querySelector("input[name=\"comment\"]"), v = p.querySelector("button[type=\"submit\"]"), y = p.querySelector(".dialog-header-container"), b = (t) => {
		p.close(), v_(t, e).showModal();
	};
	f().then((e) => {
		y.innerHTML = e, v.disabled = !1;
	}).catch(b);
	let x = () => {
		v.disabled = !0, v.innerHTML = "<div class=\"spinner\">Loading</div>";
	}, S = () => {
		v.disabled = !1, v.innerHTML = "Zap";
	}, C = (e) => {
		g.value = e;
	};
	return p.addEventListener("close", function() {
		S(), h.reset();
	}), p.querySelector(".close-button").addEventListener("click", function() {
		p.close();
	}), m.addEventListener("click", function(e) {
		e.target.matches("button") && (C(e.target.getAttribute("data-value")), g.focus());
	}), h.addEventListener("submit", async function(e) {
		e.preventDefault(), x();
		let n = Number(g.value) * 1e3, r = _.value;
		try {
			let { invoice: e, usedAnonymousFallback: a } = await Yg({
				zapEndpoint: await l,
				amount: n,
				comment: r,
				authorId: s,
				nip19Target: t,
				normalizedRelays: o,
				anon: i
			}), c = async () => {
				let t = g_({
					dialogHeader: await f(),
					invoice: e,
					relays: o,
					buttonColor: u,
					usedAnonymousFallback: a,
					recipientPubkey: s
				}), n = t.querySelector(".cta-button");
				p.close(), t.showModal(), n.focus();
			};
			if (window.webln) try {
				if (await window.webln.enable(), await window.webln.sendPayment(e), p.close(), a) {
					let e = h_();
					e.showModal(), e.querySelector(".cta-button").focus();
				}
			} catch {
				c();
			}
			else c();
		} catch (e) {
			b(e);
		}
	}), p;
}, v_ = (e, t) => {
	let n = p_(`
    <button class="close-button">X</button>
    <p class="error-message">${o_(e instanceof Error ? e.message : String(e ?? "Something went wrong"))}</p>
    <a href="https://nosta.me/${encodeURIComponent(String(t ?? ""))}" target="_blank" rel="noopener noreferrer">
      <button class="cta-button">View Nostr Profile</button>
    </a>
  `);
	return n.addEventListener("close", function() {
		n.remove();
	}), n.querySelector(".close-button").addEventListener("click", function() {
		n.close();
	}), n;
}, y_ = async ({ npub: e, noteId: t, naddr: n, relays: r, cachedAmountDialog: i, buttonColor: a, anon: o }) => {
	let s = i;
	try {
		return s ||= await __({
			npub: e,
			nip19Target: n || t,
			relays: r,
			buttonColor: a,
			anon: o
		}), s.showModal(), window.matchMedia("(max-height: 932px)").matches || s.querySelector("input[name=\"amount\"]").focus(), s;
	} catch (t) {
		s && s.close(), v_(t, e).showModal();
	}
}, b_ = (e) => {
	let t = null, n = null;
	e.addEventListener("click", async function() {
		let r = e.getAttribute("data-npub"), i = e.getAttribute("data-note-id"), a = e.getAttribute("data-naddr"), o = e.getAttribute("data-relays"), s = e.getAttribute("data-button-color"), c = e.getAttribute("data-anon") === "true";
		n && (n.npub !== r || n.noteId !== i || n.naddr !== a || n.relays !== o || n.buttonColor !== s || n.anon !== c) && (t = null), n = {
			npub: r,
			noteId: i,
			naddr: a,
			relays: o,
			buttonColor: s,
			anon: c
		}, t = await y_({
			npub: r,
			noteId: i,
			naddr: a,
			relays: o,
			cachedAmountDialog: t,
			buttonColor: s,
			anon: c
		});
	});
}, x_ = (e) => {
	document.querySelectorAll(e || "[data-npub]").forEach(b_);
}, S_ = () => {
	if (a_) return;
	let e = document.createElement("style");
	e.innerHTML = "\n      .nostr-zap-dialog {\n        width: 424px;\n        min-width: 376px;\n        margin: auto;\n        box-sizing: content-box;\n        border: none;\n        border-radius: 10px;\n        padding: 36px;\n        text-align: center;\n        font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto,\n          Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif;\n        background-color: white;\n      }\n      .nostr-zap-dialog[open],\n      .nostr-zap-dialog form {\n        display: block;\n        max-width: fit-content;\n      }\n      .nostr-zap-dialog form {\n        padding: 0;\n        width: 100%;\n      }\n      .nostr-zap-dialog img {\n        display: inline;\n        border-radius: 50%;\n      }\n      .nostr-zap-dialog h2 {\n        font-size: 1.5em;\n        font-weight: bold;\n        color: black;\n      }\n      .nostr-zap-dialog p {\n        font-size: 1em;\n        font-weight: normal;\n        color: black;\n      }\n      .nostr-zap-dialog h2,\n      .nostr-zap-dialog p,\n      .nostr-zap-dialog .skeleton-placeholder {\n        margin: 4px;\n        word-wrap: break-word;\n      }\n      .nostr-zap-dialog button {\n        background-color: inherit;\n        padding: 12px 0;\n        border-radius: 5px;\n        border: none;\n        font-size: 16px;\n        cursor: pointer;\n        border: 1px solid rgb(226, 232, 240);\n        width: 100px;\n        max-width: 100px;\n        max-height: 52px;\n        white-space: nowrap;\n        color: black;\n        box-sizing: border-box;\n      }\n      .nostr-zap-dialog button:hover {\n        background-color: #edf2f7;\n      }\n      .nostr-zap-dialog button:disabled {\n        opacity: 0.5;\n        cursor: not-allowed;\n      }\n      .nostr-zap-dialog .cta-button {\n        background-color: #7f00ff;\n        color: #fff;\n        width: 100%;\n        max-width: 100%;\n        margin-top: 16px;\n      }\n      .nostr-zap-dialog .cta-button:hover {\n        background-color: indigo;\n      }\n      .nostr-zap-dialog .close-button {\n        background-color: inherit;\n        color: black;\n        border-radius: 50%;\n        width: 42px;\n        height: 42px;\n        position: absolute;\n        top: 8px;\n        right: 8px;\n        padding: 12px;\n        border: none;\n      }\n      .nostr-zap-dialog .preset-zap-options-container {\n        display: flex;\n        flex-wrap: wrap;\n        justify-content: space-between;\n        margin: 24px 0 8px 0;\n        height: 120px;\n      }\n      .nostr-zap-dialog input {\n        padding: 12px;\n        border-radius: 5px;\n        border: none;\n        font-size: 16px;\n        width: 100%;\n        max-width: 100%;\n        background-color: #f7fafc;\n        color: #1a202c;\n        box-shadow: none;\n        box-sizing: border-box;\n        margin-bottom: 16px;\n        border: 1px solid lightgray;\n      }\n      .nostr-zap-dialog .spinner {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n      }\n      .nostr-zap-dialog .spinner:after {\n        content: \" \";\n        display: block;\n        width: 12px;\n        height: 12px;\n        border-radius: 50%;\n        border: 4px solid #fff;\n        border-color: #fff transparent #fff transparent;\n        animation: nostr-zap-dialog-spinner 1.2s linear infinite;\n        margin-left: 8px;\n      }\n      .nostr-zap-dialog .error-message {\n        text-align: left;\n        color: red;\n        margin-top: 8px;\n      }\n      .nostr-zap-dialog .zap-destination {\n        font-size: 0.875em;\n        color: #4a5568;\n        margin: 4px;\n        word-break: break-word;\n      }\n      .nostr-zap-dialog .zap-anon-notice {\n        font-size: 0.875em;\n        color: #744210;\n        margin: 8px 0 0 0;\n        word-break: break-word;\n      }\n      .nostr-zap-dialog .qrcode {\n        position: relative;\n        display: inline-block;\n        margin-top: 24px;\n      }\n      .nostr-zap-dialog .qrcode .overlay {\n        position: absolute;\n        color: white;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background-color: rgba(127, 17, 224, 0.8);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        opacity: 0;\n      }\n      .nostr-zap-dialog .qrcode .overlay.show {\n        opacity: 1;\n      }\n      @keyframes nostr-zap-dialog-spinner {\n        0% {\n          transform: rotate(0deg);\n        }\n        100% {\n          transform: rotate(360deg);\n        }\n      }\n      @keyframes nostr-zap-dialog-skeleton-pulse {\n        0% {\n          opacity: 0.6;\n        }\n        50% {\n          opacity: 0.8;\n        }\n        100% {\n          opacity: 0.6;\n        }\n      }\n      .nostr-zap-dialog .skeleton-placeholder {\n        animation-name: nostr-zap-dialog-skeleton-pulse;\n        animation-duration: 1.5s;\n        animation-iteration-count: infinite;\n        animation-timing-function: ease-in-out;\n        background-color: #e8e8e8;\n        border-radius: 4px;\n        margin: 4px auto;\n      }\n      .nostr-zap-dialog p.skeleton-placeholder {\n        height: 20px;\n        width: 200px;\n      }\n      .nostr-zap-dialog h2.skeleton-placeholder {\n        height: 28px;\n        width: 300px;\n      }\n      .nostr-zap-dialog select[name=\"lightning-wallet\"] {\n        appearance: none;\n        background-color: white;\n        background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"%232D3748\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z\" /></svg>');\n        background-repeat: no-repeat;\n        background-position: right 0.7rem center;\n        background-size: 16px;\n        border: 1px solid #CBD5E0;\n        padding: 0.5rem 1rem;\n        font-size: 1rem;\n        border-radius: 0.25rem;\n        width: 100%;\n        margin-top: 24px;\n        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n        cursor: pointer;\n      }\n      .nostr-zap-dialog select[name=\"lightning-wallet\"]:focus {\n        outline: none;\n        border-color: #4FD1C5;\n        box-shadow: 0 0 0 2px #4FD1C5;\n      }\n      @media only screen and (max-width: 480px) {\n        .nostr-zap-dialog {\n          padding: 18px;\n        }\n\n        .nostr-zap-dialog button {\n          width: 92px;\n          max-width: 92px;\n        }\n      }\n      @media only screen and (max-width: 413px) {\n        .nostr-zap-dialog {\n          min-width: 324px;\n        }\n        .nostr-zap-dialog button {\n          width: 78px;\n          max-width: 78px;\n        }\n      }\n  ";
	let t = document.createElement("div");
	document.body.appendChild(t), a_ = t.attachShadow({ mode: "closed" }), a_.appendChild(e);
}, C_ = () => {
	S_(), x_();
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", C_) : C_(), window.nostrZap = {
	init: y_,
	initTarget: b_,
	initTargets: x_
};
// D:/ドキュメント/GitHub/ehagaki/src/components/settings/SettingsRelaySection.svelte
var w_ = i("<div class=\"rotate-right-icon svg-icon svelte-1x7qm6n\"></div> <span class=\"btn-text\"> </span>", 1), T_ = i("<span class=\"host-relay-note svelte-1x7qm6n\"> </span>"), E_ = i("<span class=\"relay-check-icon svg-icon svelte-1x7qm6n\" aria-hidden=\"true\"></span>"), D_ = i("<div class=\"relay-copy-icon svg-icon svelte-1x7qm6n\" aria-hidden=\"true\"></div>"), O_ = i("<li class=\"svelte-1x7qm6n\"><span class=\"relay-url svelte-1x7qm6n\"> </span> <span><!></span> <span><!></span> <div class=\"relay-copy-cell svelte-1x7qm6n\"><!></div></li>"), k_ = i("<div class=\"relay-list-header svelte-1x7qm6n\" aria-hidden=\"true\"><span> </span> <span> </span> <span> </span> <span class=\"relay-copy-column\" aria-hidden=\"true\"></span></div> <ul class=\"svelte-1x7qm6n\"></ul>", 1), A_ = i("<span style=\"color: #888;\"> </span>"), j_ = i("<div class=\"setting-section svelte-1x7qm6n\"><div class=\"setting-row\"><div class=\"setting-label-with-icon svelte-1x7qm6n\"><span class=\"setting-menu-icon setting-menu-mask-icon relay-refresh-setting-icon svelte-1x7qm6n\" aria-hidden=\"true\"></span> <span class=\"setting-label\"> </span></div> <div class=\"setting-control\"><!></div></div> <div class=\"setting-info svelte-1x7qm6n\"><!> <div class=\"relay-list svelte-1x7qm6n\"><!></div></div></div>"), M_ = {
	hash: "svelte-1x7qm6n",
	code: ".setting-section.svelte-1x7qm6n {gap:20px;}.setting-label-with-icon.svelte-1x7qm6n {flex:1 1 auto;}.relay-refresh-setting-icon.svelte-1x7qm6n {mask-image:var(--ehagaki-icon-73796e635f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.setting-info.svelte-1x7qm6n {margin-inline-start:10px;}.host-relay-note.svelte-1x7qm6n {display:block;margin:0 10px 4px;color:var(--text-light);font-size:0.8125rem;}.rotate-right-icon.svelte-1x7qm6n {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.relay-list.svelte-1x7qm6n {margin-inline-start:10px;.relay-list-header:where(.svelte-1x7qm6n),\n        li:where(.svelte-1x7qm6n) {display:grid;grid-template-columns:minmax(0, 1fr) 48px 52px 44px;align-items:stretch;column-gap:8px;}.relay-list-header:where(.svelte-1x7qm6n) {align-items:center;margin-top:0;padding-bottom:4px;border-bottom:1px solid var(--border-hr);color:var(--text-light);font-size:0.8125rem;font-weight:600;}ul:where(.svelte-1x7qm6n) {margin:0;padding-inline-start:0;font-size:0.9375rem;list-style:none;}li:where(.svelte-1x7qm6n) {color:var(--text-light);padding:0;border-bottom:1px solid var(--border-hr);}li:where(.svelte-1x7qm6n) > :where(.svelte-1x7qm6n):not(.relay-copy-cell) {padding-block:6px;}li:where(.svelte-1x7qm6n):last-child {border-bottom:none;}.relay-url:where(.svelte-1x7qm6n),\n        .relay-capability:where(.svelte-1x7qm6n) {align-self:center;}.relay-url:where(.svelte-1x7qm6n) {min-width:0;overflow-wrap:anywhere;}.relay-copy-cell:where(.svelte-1x7qm6n) {display:flex;align-items:stretch;justify-content:flex-end;min-width:0;min-height:44px;}button.relay-copy-btn {width:44px;min-width:44px;height:100%;min-height:44px;padding:0;border:none;border-radius:0;opacity:1;backdrop-filter:none;--btn-bg: var(--dialog-bg);background-color:transparent;background-image:none;}\n\n        @media (hover: hover) and (pointer: fine) {button.relay-copy-btn:hover:not(:disabled) {background-color:var(--button-hover-bg);color:var(--button-hover-color);}button.relay-copy-btn:hover:not(:disabled) .relay-copy-icon {background-color:var(--icon-hover-color);}\n        }.relay-copy-icon:where(.svelte-1x7qm6n) {width:20px;height:20px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.relay-capability:where(.svelte-1x7qm6n) {color:var(--text-light);font-weight:700;text-align:center;}.relay-capability.enabled:where(.svelte-1x7qm6n) {color:var(--theme);}.relay-check-icon:where(.svelte-1x7qm6n) {display:inline-block;width:20px;height:20px;vertical-align:middle;mask-image:var(--ehagaki-icon-636865636b5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}}"
};
function N_(i, a) {
	ie(a, !0), A(i, M_);
	let o = () => ee(ye, "$_", s), [s, c] = I(), l = z(a, "hostRelayConfigActive", 3, !1);
	function d(e) {
		return e ? Array.isArray(e) ? e.map((e) => ({
			url: ce.normalizeRelayUrl(e),
			read: !0,
			write: !0
		})) : Object.entries(e).map(([e, t]) => ({
			url: ce.normalizeRelayUrl(e),
			read: t.read,
			write: t.write
		})) : [];
	}
	let p = H(() => d(a.relayConfig));
	async function m(e, t) {
		return t.stopPropagation(), Ye(e, "URL", navigator, window);
	}
	var h = j_(), g = b(h), _ = b(g), y = x(b(_), 2), C = B(y, !0);
	e(_);
	var w = x(_, 2), T = b(w);
	{
		let e = H(() => l() ? o()("settingsDialog.refresh_profile") || "プロフィール再取得" : o()("settingsDialog.refresh_relays_and_profile") || "再取得");
		je(T, {
			variant: "default",
			shape: "rounded",
			contentLayout: "iconText",
			className: "refresh-relays-profile-btn",
			onClick: () => a.onRefreshRelaysAndProfile?.(),
			get ariaLabel() {
				return S(e);
			},
			children: (e, n) => {
				var r = w_(), i = M(r), a = x(i, 2), s = B(a, !0);
				v((e, n) => {
					V(i, "aria-label", e), t(s, n);
				}, [() => l() ? o()("settingsDialog.refresh_profile") || "プロフィール再取得" : o()("settingsDialog.refresh") || "更新", () => l() ? o()("settingsDialog.refresh_profile") || "プロフィール再取得" : o()("settingsDialog.refresh") || "更新"]), f(e, r);
			},
			$$slots: { default: !0 }
		});
	}
	e(w), e(g);
	var E = x(g, 2), D = b(E), O = (e) => {
		var n = T_(), r = B(n, !0);
		v((e) => t(r, e), [() => o()("settingsDialog.host_relay_config") || "ホストから一時的に指定されています"]), f(e, n);
	};
	u(D, (e) => {
		l() && e(O);
	});
	var k = x(D, 2), N = b(k), P = (n) => {
		var i = k_(), a = M(i), s = b(a), c = B(s, !0), l = x(s, 2), d = B(l, !0), h = x(l, 2), g = B(h, !0);
		j(2), e(a);
		var _ = x(a, 2);
		r(_, 21, () => S(p), (e) => e.url, (n, r) => {
			var i = O_(), a = b(i), s = B(a, !0), c = x(a, 2);
			let l;
			var d = b(c), p = (e) => {
				var t = E_();
				f(e, t);
			}, h = (e) => {
				var t = R("–");
				f(e, t);
			};
			u(d, (e) => {
				S(r).read ? e(p) : e(h, -1);
			}), e(c);
			var g = x(c, 2);
			let _;
			var y = b(g), C = (e) => {
				var t = E_();
				f(e, t);
			}, w = (e) => {
				var t = R("–");
				f(e, t);
			};
			u(y, (e) => {
				S(r).write ? e(C) : e(w, -1);
			}), e(g);
			var T = x(g, 2), E = b(T);
			{
				let e = H(() => `${o()("settingsDialog.copy_relay_url") || "リレーURLをコピー"}: ${S(r).url}`), t = H(() => o()("common.copySuccess"));
				je(E, {
					shape: "square",
					variant: "default",
					className: "relay-copy-btn",
					get ariaLabel() {
						return S(e);
					},
					onClick: (e) => m(S(r).url, e),
					get floatingMessage() {
						return S(t);
					},
					children: (e, t) => {
						var n = D_();
						f(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			e(T), e(i), v((e, n) => {
				t(s, S(r).url), l = re(c, 1, "relay-capability svelte-1x7qm6n", null, l, { enabled: S(r).read }), V(c, "aria-label", e), _ = re(g, 1, "relay-capability svelte-1x7qm6n", null, _, { enabled: S(r).write }), V(g, "aria-label", n);
			}, [() => S(r).read ? o()("settingsDialog.relay_read_enabled") || "Read enabled" : o()("settingsDialog.relay_read_disabled") || "Read disabled", () => S(r).write ? o()("settingsDialog.relay_write_enabled") || "Write enabled" : o()("settingsDialog.relay_write_disabled") || "Write disabled"]), f(n, i);
		}), e(_), v((e, n, r) => {
			t(c, e), t(d, n), t(g, r);
		}, [
			() => o()("settingsDialog.relay") || "リレー",
			() => o()("settingsDialog.relay_read") || "Read",
			() => o()("settingsDialog.relay_write") || "Write"
		]), f(n, i);
	}, F = (e) => {
		var n = A_(), r = B(n, !0);
		v((e) => t(r, e), [() => o()("settingsDialog.no_relay_info") || "リレー情報なし"]), f(e, n);
	};
	u(N, (e) => {
		S(p).length > 0 ? e(P) : e(F, -1);
	}), e(k), e(E), e(h), v((e) => t(C, e), [() => l() ? o()("settingsDialog.refresh_profile") || "プロフィール再取得" : o()("settingsDialog.refresh_relays_and_profile") || "リレーリスト・プロフィール再取得"]), f(i, h), n(), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/settings/SettingsLocalRelaySection.svelte
var P_ = i("<div class=\"local-relay-url-clear-icon svg-icon svelte-zqf0o\" aria-hidden=\"true\"></div>"), F_ = i("<div class=\"setting-section\"><div class=\"setting-row local-relay-row svelte-zqf0o\"><div class=\"setting-label-with-icon local-relay-label-group svelte-zqf0o\"><span class=\"setting-menu-icon setting-menu-mask-icon local-relay-setting-icon svelte-zqf0o\" aria-hidden=\"true\"></span> <label id=\"local-relay-url-label\" class=\"setting-label local-relay-label svelte-zqf0o\" for=\"local-relay-url\"> </label></div> <div class=\"setting-control local-relay-control svelte-zqf0o\"><div class=\"local-relay-url-input-shell svelte-zqf0o\"><input id=\"local-relay-url\" class=\"local-relay-url-input svelte-zqf0o\" type=\"url\" placeholder=\"ws://127.0.0.1:4869/\" aria-describedby=\"local-relay-error\"/> <!></div> <span id=\"local-relay-error\" class=\"svelte-zqf0o\"><!></span> <div class=\"actions svelte-zqf0o\"><!> <!></div></div></div></div>"), I_ = {
	hash: "svelte-zqf0o",
	code: ".local-relay-row.svelte-zqf0o {align-items:flex-start;gap:12px;}.local-relay-label-group.svelte-zqf0o {flex:1 1 auto;min-width:0;align-items:flex-start;padding-block-start:10px;}.local-relay-setting-icon.svelte-zqf0o {mask-image:var(--ehagaki-icon-646576696365735f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.local-relay-label.svelte-zqf0o {flex:1 1 auto;min-width:0;margin-block:0;align-items:flex-start;}.local-relay-control.svelte-zqf0o {flex:0 1 260px;min-width:0;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:4px;margin-block:0;}.local-relay-url-input-shell.svelte-zqf0o {position:relative;display:flex;align-items:center;min-width:0;width:100%;}.local-relay-url-input.svelte-zqf0o {box-sizing:border-box;flex:1 1 auto;width:100%;min-width:0;min-height:44px;padding:8px 47px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.local-relay-url-input[aria-invalid=\"true\"].svelte-zqf0o {border-color:var(--danger);}.ehagaki-app-root button.local-relay-url-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.local-relay-url-clear-button:hover:not(:disabled),\n    .ehagaki-app-root button.local-relay-url-clear-button:active:not(:disabled),\n    .ehagaki-app-root button.local-relay-url-clear-button:focus-visible,\n    .ehagaki-app-root button.local-relay-url-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.local-relay-url-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.local-relay-url-clear-icon.svelte-zqf0o {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}#local-relay-error.svelte-zqf0o {color:var(--danger);font-size:0.875rem;line-height:1.4;}.actions.svelte-zqf0o {display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:flex-end;}"
};
function L_(r, i) {
	ie(i, !0), A(r, I_);
	let a = () => ee(ye, "$_", o), [o, s] = I(), c = E(w(W.localRelayUrl ?? "")), l = E(null), d = E(null);
	function p(e) {
		if (e.trim() && !Oe(e)) P(l, "invalid");
		else try {
			W.setLocalRelayUrl(e), P(c, W.localRelayUrl ?? "", !0), P(l, null);
		} catch {
			P(l, "storage");
		}
	}
	function m() {
		P(c, ""), P(l, null), setTimeout(() => {
			S(d)?.focus({ preventScroll: !0 });
		}, 0);
	}
	var _ = F_(), y = b(_), T = b(y), O = x(b(T), 2), k = B(O, !0);
	e(T);
	var M = x(T, 2), N = b(M), F = b(N);
	g(F), V(F, "spellcheck", !1), C(F, (e) => P(d, e), () => S(d));
	var L = x(F, 2), z = (e) => {
		{
			let t = H(() => a()("clearInput") || "入力内容を消去");
			je(e, {
				type: "button",
				className: "local-relay-url-clear-button",
				variant: "default",
				shape: "square",
				contentLayout: "icon",
				get ariaLabel() {
					return S(t);
				},
				onClick: m,
				get onmousedown() {
					return pt;
				},
				get ontouchstart() {
					return pt;
				},
				children: (e, t) => {
					var n = P_();
					f(e, n);
				},
				$$slots: { default: !0 }
			});
		}
	};
	u(L, (e) => {
		S(c).length > 0 && e(z);
	}), e(N);
	var te = x(N, 2), ne = b(te), re = (e) => {
		var n = R();
		v((e) => t(n, e), [() => a()(`settingsDialog.local_relay_${S(l)}_error`)]), f(e, n);
	};
	u(ne, (e) => {
		S(l) && e(re);
	}), e(te);
	var ae = x(te, 2), oe = b(ae);
	je(oe, {
		variant: "default",
		shape: "rounded",
		onClick: () => p(S(c)),
		children: (e, n) => {
			j();
			var r = R();
			v((e) => t(r, e), [() => a()("settingsDialog.local_relay_save")]), f(e, r);
		},
		$$slots: { default: !0 }
	});
	var se = x(oe, 2);
	je(se, {
		variant: "default",
		shape: "rounded",
		onClick: () => p(""),
		children: (e, n) => {
			j();
			var r = R();
			v((e) => t(r, e), [() => a()("settingsDialog.local_relay_clear")]), f(e, r);
		},
		$$slots: { default: !0 }
	}), e(ae), e(M), e(y), e(_), v((e) => {
		t(k, e), V(F, "aria-invalid", S(l) === "invalid" ? "true" : void 0), V(te, "role", S(l) ? "alert" : void 0);
	}, [() => a()("settingsDialog.local_relay_url")]), h("input", F, () => {
		P(l, null);
	}), D(F, () => S(c), (e) => P(c, e)), f(r, _), n(), s();
}
o(["input"]);
// D:/ドキュメント/GitHub/ehagaki/src/components/settings/SettingsCompressionSection.svelte
var R_ = i("<table class=\"popover-table svelte-7juqqk\"><thead class=\"svelte-7juqqk\"><tr class=\"svelte-7juqqk\"><th class=\"svelte-7juqqk\"> </th><th class=\"svelte-7juqqk\"> </th><th class=\"svelte-7juqqk\"> </th></tr></thead><tbody class=\"svelte-7juqqk\"><tr class=\"svelte-7juqqk\"><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td></tr><tr class=\"svelte-7juqqk\"><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td></tr><tr class=\"svelte-7juqqk\"><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td></tr></tbody></table> <p class=\"popover-note svelte-7juqqk\"> </p>", 1), z_ = i("<div class=\"radio-pair svelte-7juqqk\"></div>"), B_ = i("<table class=\"popover-table svelte-7juqqk\"><thead class=\"svelte-7juqqk\"><tr class=\"svelte-7juqqk\"><th class=\"svelte-7juqqk\"> </th><th class=\"svelte-7juqqk\"> </th></tr></thead><tbody class=\"svelte-7juqqk\"><tr class=\"svelte-7juqqk\"><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td></tr><tr class=\"svelte-7juqqk\"><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td></tr><tr class=\"svelte-7juqqk\"><td class=\"svelte-7juqqk\"> </td><td class=\"svelte-7juqqk\"> </td></tr></tbody></table>"), V_ = i("<div class=\"setting-section svelte-7juqqk\"><div class=\"setting-row compression-setting-row svelte-7juqqk\"><div class=\"setting-label-wrapper svelte-7juqqk\"><div class=\"setting-label-with-icon svelte-7juqqk\"><span class=\"setting-menu-icon setting-menu-mask-icon image-quality-icon svelte-7juqqk\" aria-hidden=\"true\"></span> <span class=\"setting-label\"> </span></div> <!></div> <!></div></div> <div class=\"setting-section svelte-7juqqk\"><div class=\"setting-row compression-setting-row svelte-7juqqk\"><div class=\"setting-label-wrapper svelte-7juqqk\"><div class=\"setting-label-with-icon svelte-7juqqk\"><span class=\"setting-menu-icon setting-menu-mask-icon video-quality-icon svelte-7juqqk\" aria-hidden=\"true\"></span> <span class=\"setting-label\"> </span></div> <!></div> <!></div></div>", 1), H_ = {
	hash: "svelte-7juqqk",
	code: ".setting-label-wrapper.svelte-7juqqk {display:flex;align-items:center;gap:4px;flex-wrap:wrap;flex:1 1 auto;min-width:0;}.setting-label-with-icon.svelte-7juqqk {flex:0 1 auto;max-width:calc(100% - 48px);}.image-quality-icon.svelte-7juqqk {mask-image:var(--ehagaki-icon-696d6167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.video-quality-icon.svelte-7juqqk {mask-image:var(--ehagaki-icon-6d6f7669655f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}\n\n    @media (max-width: 430px) {.compression-setting-row.svelte-7juqqk {flex-direction:column;align-items:stretch;gap:8px;}.compression-setting-row > .setting-control.radio-group {width:100%;justify-content:flex-end;margin-block:0;}\n    }.popover-table {border-collapse:collapse;font-size:1rem;th.svelte-7juqqk,\n        td.svelte-7juqqk {padding:4px 8px;text-align:start;}th.svelte-7juqqk {font-weight:600;border-bottom:1px solid var(--border);}td.svelte-7juqqk {font-weight:normal;}}.popover-note.svelte-7juqqk {max-width:320px;margin:8px 0 0;color:var(--text-secondary);font-size:0.875rem;line-height:1.5;}.radio-group {display:flex;gap:4px;flex-wrap:wrap;button {font-size:0.875rem;padding:10px;min-height:50px;min-width:44px;font-weight:normal;}}.radio-pair.svelte-7juqqk {display:flex;gap:4px;}"
};
function U_(i, o) {
	ie(o, !0), A(i, H_);
	let s = () => ee(ye, "$_", l), [l, u] = I();
	var d = V_(), m = M(d), h = b(m), g = b(h), _ = b(g), y = x(b(_), 2), C = B(y, !0);
	e(_);
	var w = x(_, 2);
	{
		let n = H(() => s()("settingsDialog.image_compression_settings_description"));
		St(w, {
			side: "top",
			get ariaLabel() {
				return S(n);
			},
			children: (n, r) => {
				var i = R_(), a = M(i), o = b(a), c = b(o), l = b(c), u = B(l, !0), d = x(l), p = B(d, !0), m = x(d), h = B(m, !0);
				e(c), e(o);
				var g = x(o), _ = b(g), y = b(_), S = B(y, !0), C = x(y), w = B(C), T = x(C), E = B(T);
				e(_);
				var D = x(_), O = b(D), k = B(O, !0), A = x(O), j = B(A), N = x(A), P = B(N);
				e(D);
				var F = x(D), I = b(F), L = B(I, !0), R = x(I), z = B(R), ee = x(R), te = B(ee);
				e(F), e(g), e(a);
				var ne = x(a, 2), V = B(ne, !0);
				v((e, n, r, i, a, o, s, c, l, d) => {
					t(u, e), t(p, n), t(h, r), t(S, i), t(w, `${Me.high.maxWidthOrHeight ?? ""}px`), t(E, `${a ?? ""}%`), t(k, o), t(j, `${Me.medium.maxWidthOrHeight ?? ""}px`), t(P, `${s ?? ""}%`), t(L, c), t(z, `${Me.low.maxWidthOrHeight ?? ""}px`), t(te, `${l ?? ""}%`), t(V, d);
				}, [
					() => s()("settingsDialog.info_header_setting"),
					() => s()("settingsDialog.info_header_pixels"),
					() => s()("settingsDialog.info_header_quality"),
					() => s()("settingsDialog.quality_high"),
					() => Math.round(Me.high.initialQuality * 100),
					() => s()("settingsDialog.quality_medium"),
					() => Math.round(Me.medium.initialQuality * 100),
					() => s()("settingsDialog.quality_low"),
					() => Math.round(Me.low.initialQuality * 100),
					() => s()("settingsDialog.image_short_edge_protection_note", { values: {
						aspectRatio: Ne.aspectRatioThreshold,
						pixels: Ne.minShortEdge,
						megapixels: Ne.maxMegapixels
					} })
				]), f(n, i);
			},
			$$slots: { default: !0 }
		});
	}
	e(g);
	var T = x(g, 2);
	{
		let n = H(() => s()("settingsDialog.image_quality_setting"));
		c(T, () => _t, (i, s) => {
			s(i, {
				class: "setting-control radio-group",
				name: "compression",
				orientation: "horizontal",
				get value() {
					return o.selectedCompression;
				},
				get "aria-label"() {
					return S(n);
				},
				get onValueChange() {
					return o.onCompressionChange;
				},
				children: (n, i) => {
					var s = p(), c = M(s);
					r(c, 17, () => o.compressionPairs, a, (n, i) => {
						var o = z_();
						r(o, 21, () => S(i), a, (e, n) => {
							yt(e, {
								get value() {
									return S(n).value;
								},
								variant: "default",
								shape: "rounded",
								get ariaLabel() {
									return S(n).label;
								},
								children: (e, r) => {
									j();
									var i = R();
									v(() => t(i, S(n).label)), f(e, i);
								},
								$$slots: { default: !0 }
							});
						}), e(o), f(n, o);
					}), f(n, s);
				},
				$$slots: { default: !0 }
			});
		});
	}
	e(h), e(m);
	var E = x(m, 2), D = b(E), O = b(D), k = b(O), N = x(b(k), 2), P = B(N, !0);
	e(k);
	var F = x(k, 2);
	{
		let n = H(() => s()("settingsDialog.video_compression_settings_description"));
		St(F, {
			side: "top",
			get ariaLabel() {
				return S(n);
			},
			children: (n, r) => {
				var i = B_(), a = b(i), o = b(a), c = b(o), l = B(c, !0), u = x(c), d = B(u, !0);
				e(o), e(a);
				var p = x(a), m = b(p), h = b(m), g = B(h, !0), _ = x(h), y = B(_);
				e(m);
				var S = x(m), C = b(S), w = B(C, !0), T = x(C), E = B(T);
				e(S);
				var D = x(S), O = b(D), k = B(O, !0), A = x(O), j = B(A);
				e(D), e(p), e(i), v((e, n, r, i, a) => {
					t(l, e), t(d, n), t(g, r), t(y, `${qe.high.maxSize ?? ""}px`), t(w, i), t(E, `${qe.medium.maxSize ?? ""}px`), t(k, a), t(j, `${qe.low.maxSize ?? ""}px`);
				}, [
					() => s()("settingsDialog.info_header_setting"),
					() => s()("settingsDialog.info_header_pixels"),
					() => s()("settingsDialog.quality_high"),
					() => s()("settingsDialog.quality_medium"),
					() => s()("settingsDialog.quality_low")
				]), f(n, i);
			},
			$$slots: { default: !0 }
		});
	}
	e(O);
	var L = x(O, 2);
	{
		let n = H(() => s()("settingsDialog.video_quality_setting"));
		c(L, () => _t, (i, s) => {
			s(i, {
				class: "setting-control radio-group",
				name: "videoCompression",
				orientation: "horizontal",
				get value() {
					return o.selectedVideoCompression;
				},
				get "aria-label"() {
					return S(n);
				},
				get onValueChange() {
					return o.onVideoCompressionChange;
				},
				children: (n, i) => {
					var s = p(), c = M(s);
					r(c, 17, () => o.videoCompressionPairs, a, (n, i) => {
						var o = z_();
						r(o, 21, () => S(i), a, (e, n) => {
							yt(e, {
								get value() {
									return S(n).value;
								},
								variant: "default",
								shape: "rounded",
								get ariaLabel() {
									return S(n).label;
								},
								children: (e, r) => {
									j();
									var i = R();
									v(() => t(i, S(n).label)), f(e, i);
								},
								$$slots: { default: !0 }
							});
						}), e(o), f(n, o);
					}), f(n, s);
				},
				$$slots: { default: !0 }
			});
		});
	}
	e(D), e(E), v((e, n) => {
		t(C, e), t(P, n);
	}, [() => s()("settingsDialog.image_quality_setting"), () => s()("settingsDialog.video_quality_setting")]), f(i, d), n(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/settings/SettingsUploadDestinationSection.svelte
var W_ = i("<option> </option>"), G_ = i("<div class=\"url-clear-input-icon svg-icon svelte-odrb59\" aria-hidden=\"true\"></div>"), K_ = i("<span class=\"form-error svelte-odrb59\" role=\"alert\"> </span>"), q_ = i("<label class=\"svelte-odrb59\"><span> </span> <select class=\"svelte-odrb59\"><option>Blossom</option><option>NIP-96 legacy</option><option>Custom HTTP</option></select></label> <div class=\"url-field svelte-odrb59\"><label for=\"upload-destination-url-input\" class=\"svelte-odrb59\"><span>URL</span></label> <div class=\"url-input-shell svelte-odrb59\"><input id=\"upload-destination-url-input\" class=\"upload-destination-url-input svelte-odrb59\" inputmode=\"url\"/> <!></div> <!></div>", 1), J_ = i("<div class=\"destination-form svelte-odrb59\"><label class=\"svelte-odrb59\"><span> </span> <select class=\"svelte-odrb59\"><optgroup label=\"Blossom\"></optgroup><optgroup label=\"NIP-96\"></optgroup><option>custom</option></select></label> <!> <div class=\"checkbox-group svelte-odrb59\"><label class=\"checkbox-row svelte-odrb59\"><input type=\"checkbox\" class=\"svelte-odrb59\"/> <span> </span></label> <label class=\"checkbox-row svelte-odrb59\"><input type=\"checkbox\" class=\"svelte-odrb59\"/> <span> </span></label></div> <div class=\"form-actions svelte-odrb59\"><!> <!></div></div>"), Y_ = i("<span class=\"btn-text\"> </span>"), X_ = i("<div class=\"blossom-test-popover svelte-odrb59\"><p class=\"svelte-odrb59\"> </p> <p class=\"svelte-odrb59\"> </p></div>"), Z_ = i("<span class=\"badge default-badge svelte-odrb59\"> </span>"), Q_ = i("<span class=\"badge muted svelte-odrb59\"> </span>"), $_ = i("<button type=\"button\" class=\"mime-toggle svelte-odrb59\"> </button>"), ev = i("<span class=\"more-icon svg-icon svelte-odrb59\" aria-hidden=\"true\"></span>"), tv = i("<!> <!> <!> <!> <!> <!>", 1), nv = i("<!> <!>", 1), rv = i("<span class=\"test-result-detail svelte-odrb59\"> </span>"), iv = i("<span> </span> <!>", 1), av = i("<div role=\"status\" aria-live=\"polite\"><!></div>"), ov = i("<div class=\"destination-row svelte-odrb59\" role=\"listitem\"><div class=\"destination-main svelte-odrb59\"><div class=\"destination-content svelte-odrb59\"><div class=\"destination-title svelte-odrb59\"><span class=\"destination-name svelte-odrb59\"> </span> <!> <!></div> <div class=\"destination-meta svelte-odrb59\"> </div> <div class=\"destination-meta mime-meta svelte-odrb59\"><span> </span> <!></div></div> <div class=\"destination-actions svelte-odrb59\"><!> <!></div></div> <!> <!></div>"), sv = i("<div class=\"bud03-popover svelte-odrb59\"><p class=\"svelte-odrb59\"> </p> <p class=\"svelte-odrb59\"> </p> <p class=\"svelte-odrb59\"> </p> <p class=\"svelte-odrb59\"> </p></div>"), cv = i("<p> <!></p>"), lv = i("<div class=\"test-result svelte-odrb59\" role=\"status\" aria-live=\"polite\"><p> </p> <!></div>"), uv = i("<section class=\"relay-sync-section svelte-odrb59\"><div class=\"relay-sync-toolbar svelte-odrb59\"><div class=\"section-heading svelte-odrb59\"><h3 class=\"svelte-odrb59\"> </h3></div> <div class=\"panel-actions svelte-odrb59\"><!> <!></div> <!></div> <!></section>"), dv = i("<div class=\"upload-panel svelte-odrb59\"><div class=\"list-heading svelte-odrb59\"><div class=\"section-heading svelte-odrb59\"><h3 class=\"svelte-odrb59\"> </h3> <!></div> <!></div> <!> <div class=\"destination-list svelte-odrb59\" role=\"list\"></div> <!></div>"), fv = i("<div class=\"setting-section upload-destination-section svelte-odrb59\"><div class=\"setting-row\"><div class=\"setting-label-group svelte-odrb59\"><div class=\"setting-label-with-icon\"><span class=\"setting-menu-icon setting-menu-mask-icon upload-destination-setting-icon svelte-odrb59\" aria-hidden=\"true\"></span> <span class=\"upload-destination-label-copy svelte-odrb59\"><span class=\"setting-label\"> </span> <span class=\"upload-summary svelte-odrb59\"> </span></span></div></div> <div class=\"setting-control svelte-odrb59\"><!></div></div> <!></div>"), pv = {
	hash: "svelte-odrb59",
	code: ".upload-destination-section.svelte-odrb59 {display:flex;flex-direction:column;gap:12px;}.upload-destination-setting-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-636c6f75645f75706c6f61645f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.upload-destination-label-copy.svelte-odrb59 {display:flex;flex-direction:column;min-width:0;}.setting-label-group.svelte-odrb59 {min-width:0;}.setting-control.svelte-odrb59 {flex-shrink:0;}.upload-summary.svelte-odrb59 {overflow-wrap:anywhere;}.upload-destination-manage-btn {white-space:nowrap;}.upload-summary.svelte-odrb59,\n    .destination-meta.svelte-odrb59 {color:var(--text-light);font-size:0.875rem;}.mime-meta.svelte-odrb59 {display:flex;align-items:baseline;flex-wrap:wrap;gap:6px;overflow-wrap:anywhere;}.mime-toggle.svelte-odrb59 {min-inline-size:0;min-block-size:0;height:auto;border:none;background:transparent;color:var(--link);cursor:pointer;font:inherit;padding:0;text-decoration:underline;}.upload-panel.svelte-odrb59 {display:flex;flex-direction:column;gap:12px;}.list-heading.svelte-odrb59 {display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0;}.section-heading.svelte-odrb59 {display:flex;align-items:center;gap:2px;min-width:0;}h3.svelte-odrb59 {margin:0;font-size:0.95rem;font-weight:600;min-width:0;}.destination-list.svelte-odrb59 {min-width:0;}.destination-row.svelte-odrb59 {padding:10px 0;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:6px;}.destination-row.svelte-odrb59:first-child {padding-top:0;}.destination-row.svelte-odrb59:last-child {border-bottom:0;padding-bottom:0;}.destination-form.svelte-odrb59 {border:1px solid var(--border);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px;min-width:0;}.destination-title.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-weight:600;}.destination-name.svelte-odrb59 {overflow-wrap:anywhere;min-width:0;}.destination-main.svelte-odrb59 {display:flex;align-items:center;justify-content:space-between;gap:6px 12px;flex-wrap:wrap;}.destination-content.svelte-odrb59 {min-width:0;display:flex;flex:1 1 200px;flex-direction:column;gap:2px;overflow-wrap:anywhere;}.destination-menu-trigger {display:inline-flex;justify-content:center;align-items:center;min-width:44px;min-height:44px;padding:0;border-radius:6px;color:var(--text);background:transparent;}.more-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-6d6f72655f766572745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:24px;height:24px;}.destination-menu-content {box-sizing:border-box;max-width:min(240px, var(--bits-dropdown-menu-content-available-width));max-height:var(--bits-dropdown-menu-content-available-height);overflow:auto;padding:4px;border:1px solid var(--border);border-radius:8px;background:var(--dialog-bg);color:var(--text);box-shadow:0 6px 20px rgb(0 0 0 / 18%);z-index:100002;}.destination-menu-item {display:flex;align-items:center;min-height:44px;padding:8px 12px;box-sizing:border-box;border-radius:4px;overflow-wrap:anywhere;cursor:pointer;}.destination-menu-item[data-highlighted]:not([data-disabled]) {background:var(--btn-hover-bg);}.destination-menu-item[data-disabled] {opacity:0.5;cursor:default;}.destination-menu-separator {height:1px;background:var(--border);margin:4px;}.relay-sync-section.svelte-odrb59 {border-top:1px solid var(--border);padding-top:12px;display:flex;flex-direction:column;gap:8px;min-width:0;}.relay-sync-toolbar.svelte-odrb59 {display:flex;align-items:center;gap:10px;min-width:0;white-space:nowrap;}.relay-sync-toolbar.svelte-odrb59 .panel-actions:where(.svelte-odrb59) {flex-wrap:nowrap;gap:4px;}.badge.svelte-odrb59 {border:1px solid var(--border);border-radius:999px;padding:2px 7px;font-size:0.75rem;font-weight:400;}.badge.default-badge.svelte-odrb59 {background-color:var(--theme);border-color:var(--theme);color:white;font-weight:500;}.badge.muted.svelte-odrb59 {opacity:0.6;}.destination-actions.svelte-odrb59,\n    .form-actions.svelte-odrb59,\n    .panel-actions.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:6px;}.destination-actions.svelte-odrb59 {justify-content:flex-end;margin-inline-start:auto;}.test-result.svelte-odrb59 {overflow-wrap:anywhere;font-size:0.875rem;color:var(--text-light);}.test-result-detail.svelte-odrb59 {display:block;}.test-result.error.svelte-odrb59 {color:var(--danger);}.form-error.svelte-odrb59 {color:var(--danger);font-size:0.875rem;}.bud03-popover.svelte-odrb59 {display:flex;flex-direction:column;gap:8px;font-size:0.875rem;line-height:1.5;}.bud03-popover.svelte-odrb59 p:where(.svelte-odrb59) {margin:0;}.blossom-test-popover.svelte-odrb59 {display:flex;flex-direction:column;gap:8px;font-size:0.875rem;line-height:1.5;}.blossom-test-popover.svelte-odrb59 p:where(.svelte-odrb59) {margin:0;}label.svelte-odrb59 {display:flex;flex-direction:column;gap:4px;font-size:0.875rem;}.url-field.svelte-odrb59 {display:flex;flex-direction:column;gap:4px;font-size:0.875rem;}.url-input-shell.svelte-odrb59 {position:relative;display:flex;align-items:center;min-width:0;}.upload-destination-url-input.svelte-odrb59 {flex:1 1 auto;min-width:0;min-height:46px;padding:8px 47px 8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;outline:none;}.upload-destination-url-input.svelte-odrb59:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}.ehagaki-app-root button.upload-destination-url-clear-button {position:absolute;inset-block:50%;inset-inline-end:2px;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;padding:0;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);z-index:1;}.ehagaki-app-root button.upload-destination-url-clear-button:hover:not(:disabled),\n    .ehagaki-app-root button.upload-destination-url-clear-button:active:not(:disabled),\n    .ehagaki-app-root button.upload-destination-url-clear-button:focus-visible,\n    .ehagaki-app-root button.upload-destination-url-clear-button:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.upload-destination-url-clear-button:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.upload-destination-url-clear-button .svg-icon {--svg: currentColor;width:24px;height:24px;}.url-clear-input-icon.svelte-odrb59 {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.checkbox-group.svelte-odrb59 {display:flex;align-items:center;flex-wrap:wrap;gap:16px;}.checkbox-row.svelte-odrb59 {flex-direction:row;align-items:center;gap:8px;min-height:32px;}.checkbox-row.svelte-odrb59 input[type=\"checkbox\"]:where(.svelte-odrb59) {width:24px;height:24px;min-height:24px;margin:0;padding:0;accent-color:var(--theme);}input.svelte-odrb59,\n    select.svelte-odrb59 {width:100%;min-height:42px;padding:8px 10px;border:1px solid var(--border);border-radius:4px;background:var(--bg-input);color:var(--text);font:inherit;font-size:1rem;}input.svelte-odrb59:focus-visible {outline:2px solid var(--theme);outline-offset:-1px;}select.svelte-odrb59:focus-visible {outline:2px solid currentColor;outline-offset:-1px;}"
};
function mv(i, o) {
	let l = s();
	ie(o, !0), A(i, pv);
	let m = () => ee(ye, "$_", _), [_, T] = I(), O = (n) => {
		var i = J_(), o = b(i), s = b(o), c = B(s, !0), l = x(s, 2), p = b(l);
		r(p, 21, () => ke, a, (e, n) => {
			var r = W_(), i = B(r, !0), a = {};
			v(() => {
				t(i, S(n).name), a !== (a = S(n).id) && (r.value = (r.__value = a) ?? "");
			}), f(e, r);
		}), e(p);
		var _ = x(p);
		r(_, 21, () => Ae, a, (e, n) => {
			var r = W_(), i = B(r, !0), a = {};
			v(() => {
				t(i, S(n).name), a !== (a = S(n).id) && (r.value = (r.__value = a) ?? "");
			}), f(e, r);
		}), e(_);
		var w = x(_);
		w.value = w.__value = "custom", e(l), C(l, (e) => P(ce, e), () => S(ce));
		var T;
		ae(l), e(o);
		var E = x(o, 2), O = (n) => {
			var r = q_(), i = M(r), a = b(i), o = B(a, !0), s = x(a, 2), c = b(s);
			c.value = c.__value = "blossom";
			var l = x(c);
			l.value = l.__value = "nip96";
			var d = x(l);
			d.value = d.__value = "custom-http", e(s), ae(s), e(i);
			var p = x(i, 2), _ = x(b(p), 2), w = b(_);
			g(w), C(w, (e) => P(ge, e), () => S(ge));
			var T = x(w, 2), E = (e) => {
				{
					let t = H(() => m()("clearInput") || "入力内容を消去");
					je(e, {
						type: "button",
						className: "upload-destination-url-clear-button",
						variant: "default",
						shape: "square",
						contentLayout: "icon",
						get ariaLabel() {
							return S(t);
						},
						onClick: We,
						get onmousedown() {
							return pt;
						},
						get ontouchstart() {
							return pt;
						},
						children: (e, t) => {
							var n = G_();
							f(e, n);
						},
						$$slots: { default: !0 }
					});
				}
			}, O = H(() => S(U).serverUrl.trim().length > 0);
			u(T, (e) => {
				S(O) && e(E);
			}), e(_);
			var k = x(_, 2), A = (e) => {
				var n = K_(), r = B(n, !0);
				v(() => t(r, S(ve))), f(e, n);
			};
			u(k, (e) => {
				S(ve) && e(A);
			}), e(p), v((e) => t(o, e), [() => m()("settingsDialog.uploadDestinationProtocol") || "Protocol"]), h("change", s, () => P(ve, null)), y(s, () => S(U).protocol, (e) => S(U).protocol = e), h("input", w, () => P(ve, null)), D(w, () => S(U).serverUrl, (e) => S(U).serverUrl = e), f(n, r);
		};
		u(E, (e) => {
			S(U).presetId === "custom" && e(O);
		});
		var k = x(E, 2), A = b(k), F = b(A);
		g(F);
		var I = x(F, 2), L = B(I, !0);
		e(A);
		var z = x(A, 2), ee = b(z);
		g(ee);
		var te = x(ee, 2), ne = B(te, !0);
		e(z), e(k);
		var V = x(k, 2), re = b(V);
		{
			let e = H(() => !S(U).serverUrl.trim());
			je(re, {
				variant: "primary",
				shape: "rounded",
				onClick: Ge,
				get disabled() {
					return S(e);
				},
				children: (e, n) => {
					j();
					var r = R();
					v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationSave") || "保存"]), f(e, r);
				},
				$$slots: { default: !0 }
			});
		}
		var ie = x(re, 2);
		je(ie, {
			variant: "default",
			shape: "rounded",
			onClick: Le,
			children: (e, n) => {
				j();
				var r = R();
				v((e) => t(r, e), [() => m()("postComponent.cancel") || "キャンセル"]), f(e, r);
			},
			$$slots: { default: !0 }
		}), e(V), e(i), v((e, n, r) => {
			t(c, e), T !== (T = S(U).presetId) && (l.value = (l.__value = T) ?? "", d(l, T)), t(L, n), t(ne, r);
		}, [
			() => m()("settingsDialog.uploadDestinationPreset") || "プリセット",
			() => m()("settingsDialog.uploadDestinationEnabled") || "有効",
			() => m()("settingsDialog.uploadDestinationDefault") || "使用先にする"
		]), h("change", l, (e) => Ue(e.currentTarget.value)), N(F, () => S(U).enabled, (e) => S(U).enabled = e), N(ee, () => S(U).isDefault, (e) => S(U).isDefault = e), f(n, i);
	}, k = z(o, "rxNostr", 3, null), te = se().overlayTarget, oe = E(void 0), ce = E(void 0), le = null, ue = E(null), de = st.find((e) => e.id === "blossom-band"), fe = {
		id: "",
		protocol: de.protocol,
		serverUrl: de.serverUrl,
		presetId: de.id,
		enabled: !0,
		isDefault: !0
	}, pe = E(!1), me = E(!1), he = E(null), ge = E(null), U = E(w({ ...fe })), _e = E(null), ve = E(null), be = E(w({})), xe = H(() => vt.value), Se = E(null), we = H(() => Ce.value.isAuthenticated && Ce.value.pubkey || null), Te = H(() => !!(k() && S(we))), Ee = new Map(st.map((e) => [e.id, e])), De = [
		"blossom-band",
		"cdn-nostrcheck-me",
		"nostr-download",
		"blossom-primal-net",
		"files-sovbit-host"
	], Oe = [
		"nostr-build",
		"nostrcheck-me",
		"share-yabu-me",
		"nostpic-com"
	], ke = De.map((e) => Ee.get(e)), Ae = Oe.map((e) => Ee.get(e));
	F(() => {
		P(Se, S(we), !0), vt.load(S(Se));
	}), L(() => {
		S(Se) !== S(we) && (P(Se, S(we), !0), P(_e, null), P(ue, null), vt.load(S(Se)));
	});
	function Me(e) {
		if (!e) return m()("settingsDialog.uploadDestinationUnknown") || "未確認";
		let t = [
			"B",
			"KB",
			"MB",
			"GB"
		], n = e, r = 0;
		for (; n >= 1024 && r < t.length - 1;) n /= 1024, r += 1;
		return `${n.toFixed(n >= 10 || r === 0 ? 0 : 1)} ${t[r]}`;
	}
	function Ne(e) {
		let t = e.capabilities.supportedMimeTypes;
		return t.length ? S(be)[e.id] || t.length <= 3 ? t.join(", ") : `${t.slice(0, 3).join(", ")} +${t.length - 3}` : m()("settingsDialog.uploadDestinationMimeUnknown");
	}
	function Pe(e) {
		return e.capabilities.supportedMimeTypes.length > 3;
	}
	function Fe(e) {
		P(be, {
			...S(be),
			[e]: !S(be)[e]
		}, !0);
	}
	function Ie() {
		P(U, { ...fe }, !0), P(ve, null), P(me, !0), P(he, null), P(pe, !0), ne().then(() => S(ce)?.focus());
	}
	function Le() {
		let e = S(he);
		P(me, !1), P(he, null), P(ve, null), ne().then(() => ze(e));
	}
	function ze(e) {
		(Array.from(S(oe)?.querySelectorAll("[data-destination-id]") ?? []).find((t) => t.dataset.destinationId === e)?.querySelector("[data-destination-menu]") ?? S(oe)?.querySelector(".destination-add-button"))?.focus({ preventScroll: !0 });
	}
	function Be(e) {
		let t = le;
		le = null, t && (e.preventDefault(), t === "form" && ne().then(() => S(ce)?.focus()));
	}
	async function Ve(e, t) {
		le = "handled", await vt.move(e.id, t, S(we)), await ne(), ze(e.id);
	}
	function He(e) {
		S(he) === e.id ? Le() : (P(U, {
			id: e.id,
			protocol: e.protocol,
			serverUrl: e.serverUrl,
			presetId: e.presetId ?? "custom",
			enabled: e.enabled,
			isDefault: e.isDefault
		}, !0), P(ve, null), P(me, !0), P(he, e.id, !0), P(pe, !0));
	}
	function Ue(e) {
		if (S(U).presetId = e, P(ve, null), e === "custom") {
			S(U).serverUrl = "";
			return;
		}
		let t = st.find((t) => t.id === e);
		t && (S(U).protocol = t.protocol, S(U).serverUrl = t.serverUrl);
	}
	function We() {
		S(U).serverUrl = "", S(U).presetId = "custom", P(ve, null), setTimeout(() => {
			S(ge)?.focus({ preventScroll: !0 });
		}, 0);
	}
	async function Ge() {
		let e = Date.now(), t = st.find((e) => e.id === S(U).presetId), n = S(xe).destinations.find((e) => e.id === S(U).id), r = S(U).serverUrl || t?.serverUrl || "", i = S(U).protocol, a = dt(r);
		if (i === "nip96") try {
			a = ot(r).url;
		} catch {
			P(ve, m()("settingsDialog.uploadDestinationInvalidNip96Url") || "有効な絶対 HTTP(S) URL を入力してください", !0);
			return;
		}
		P(ve, null);
		let o = ut({
			protocol: i,
			presetId: S(U).presetId,
			serverUrl: a
		}), s = i === "nip96" ? o?.resolvedUploadUrl ?? null : null, c = ft({
			serverUrl: a,
			resolvedUploadUrl: s,
			fallbackName: t?.name ?? n?.name ?? "Custom NIP-96",
			protocol: i,
			presetId: S(U).presetId
		}), l = t && !n ? {
			...at({
				preset: t,
				pubkeyHex: S(we),
				isDefault: S(U).isDefault || S(xe).destinations.length === 0,
				now: e
			}),
			name: c,
			serverUrl: a,
			enabled: S(U).enabled
		} : n ?? at({
			preset: t ?? {
				id: "custom",
				name: c,
				protocol: S(U).protocol,
				serverUrl: S(U).serverUrl,
				capabilities: ct
			},
			pubkeyHex: S(we),
			isDefault: S(U).isDefault || S(xe).destinations.length === 0,
			now: e
		}), u = !1;
		if (n?.protocol === "nip96" && i === "nip96") try {
			u = ot(n.serverUrl).url === a;
		} catch {}
		let d = u && n ? lt(n, { pubkeyHex: S(we) }).resolvedUploadUrl : void 0, { resolvedUploadUrl: f, nip96ServerUrl: p, nip96UrlMode: h, ...g } = l, _ = {
			...g,
			...n ? {} : { sortIndex: S(xe).destinations.reduce((e, t) => Math.min(e, t.sortIndex ?? t.createdAt), e) - 1 },
			name: c,
			protocol: i,
			serverUrl: a,
			presetId: S(U).presetId,
			enabled: S(U).enabled,
			isDefault: S(U).isDefault,
			updatedAt: e,
			...u && n ? {
				...d ? { resolvedUploadUrl: d } : {},
				...n.nip96ServerUrl ? { nip96ServerUrl: n.nip96ServerUrl } : {},
				...n.nip96UrlMode ? { nip96UrlMode: n.nip96UrlMode } : {}
			} : s ? {
				resolvedUploadUrl: s,
				nip96ServerUrl: o?.nip96ServerUrl,
				nip96UrlMode: "direct"
			} : {}
		}, v = S(he);
		await vt.save(_), P(me, !1), P(he, null), await ne(), ze(v);
	}
	async function Ke(e) {
		P(_e, e.id, !0);
		let t = S(Se);
		try {
			await vt.test(e);
		} finally {
			S(Se) === t && S(_e) === e.id && P(_e, null);
		}
	}
	async function qe(e) {
		le = "handled";
		let t = S(xe).destinations.findIndex((t) => t.id === e.id), n = S(xe).destinations[t + 1]?.id ?? S(xe).destinations[t - 1]?.id ?? null;
		S(he) === e.id && (P(me, !1), P(he, null)), await vt.delete(e.id, S(we)), await ne(), ze(n);
	}
	async function W() {
		k() && S(we) && await vt.fetchFromRelays(k(), S(we));
	}
	async function Je() {
		k() && S(we) && await vt.publishToRelays(k(), S(we));
	}
	var Ye = fv(), Xe = b(Ye), nt = b(Xe), rt = b(nt), it = x(b(rt), 2), mt = b(it), gt = B(mt, !0), _t = x(mt, 2), yt = B(_t, !0);
	e(it), e(rt), e(nt);
	var bt = x(nt, 2), xt = b(bt);
	je(xt, {
		variant: "default",
		shape: "rounded",
		contentLayout: "text",
		className: "upload-destination-manage-btn",
		get "aria-expanded"() {
			return S(pe);
		},
		get "aria-controls"() {
			return l;
		},
		onClick: () => P(pe, !S(pe)),
		children: (e, n) => {
			var r = Y_(), i = B(r, !0);
			v((e) => t(i, e), [() => S(pe) ? m()("settingsDialog.uploadDestinationClose") || "閉じる" : m()("settingsDialog.uploadDestinationManage") || "管理"]), f(e, r);
		},
		$$slots: { default: !0 }
	}), e(bt), e(Xe);
	var Ct = x(Xe, 2), wt = (n) => {
		var i = dv(), o = b(i), s = b(o), d = b(s), g = B(d, !0), _ = x(d, 2), y = (n) => {
			{
				let r = H(() => m()("settingsDialog.uploadDestinationBlossomTestInfoLabel") || "Blossom 接続テストの説明");
				St(n, {
					side: "top",
					sideOffset: 4,
					get ariaLabel() {
						return S(r);
					},
					children: (n, r) => {
						var i = X_(), a = b(i), o = B(a, !0), s = x(a, 2), c = B(s, !0);
						e(i), v((e, n) => {
							t(o, e), t(c, n);
						}, [() => m()("settingsDialog.uploadDestinationBlossomTestInfoNoUpload") || "Blossomの接続テストでは実際のファイルをアップロードせず、HEAD /upload でアップロード可否を確認します。", () => m()("settingsDialog.uploadDestinationBlossomTestInfoAuthorization") || "Blossom の仕様上、確認に必要な署名で upload 権限が要求される場合があります。"]), f(n, i);
					},
					$$slots: { default: !0 }
				});
			}
		}, w = H(() => S(xe).destinations.some((e) => e.protocol === "blossom"));
		u(_, (e) => {
			S(w) && e(y);
		}), e(s);
		var T = x(s, 2), E = (e) => {
			je(e, {
				variant: "default",
				shape: "rounded",
				className: "destination-add-button",
				onClick: Ie,
				children: (e, n) => {
					j();
					var r = R();
					v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationAdd")]), f(e, r);
				},
				$$slots: { default: !0 }
			});
		};
		u(T, (e) => {
			S(me) || e(E);
		}), e(o);
		var D = x(o, 2), k = (e) => {
			O(e);
		};
		u(D, (e) => {
			S(me) && !S(he) && e(k);
		});
		var A = x(D, 2);
		r(A, 23, () => S(xe).destinations, (e) => e.id, (n, r, i) => {
			var a = ov(), o = b(a), s = b(o), d = b(s), g = b(d), _ = B(g, !0), y = x(g, 2), C = (e) => {
				var n = Z_(), r = B(n, !0);
				v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationInUse")]), f(e, n);
			};
			u(y, (e) => {
				S(r).isDefault && e(C);
			});
			var w = x(y, 2), T = (e) => {
				var n = Q_(), r = B(n, !0);
				v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationDisabled")]), f(e, n);
			};
			u(w, (e) => {
				S(r).enabled || e(T);
			}), e(d);
			var E = x(d, 2), D = B(E), k = x(E, 2), A = b(k), N = B(A, !0), F = x(A, 2), I = (e) => {
				var n = $_(), i = B(n, !0);
				v((e, a) => {
					V(n, "aria-expanded", e), V(n, "aria-controls", l + "-mime-" + S(r).id), t(i, a);
				}, [() => !!S(be)[S(r).id], () => m()(S(be)[S(r).id] ? "settingsDialog.uploadDestinationMimeCollapse" : "settingsDialog.uploadDestinationMimeExpand")]), h("click", n, () => Fe(S(r).id)), f(e, n);
			}, L = H(() => Pe(S(r)));
			u(F, (e) => {
				S(L) && e(I);
			}), e(k), e(s);
			var z = x(s, 2), ee = b(z);
			{
				let e = H(() => S(_e) === S(r).id);
				je(ee, {
					variant: "default",
					shape: "rounded",
					onClick: () => Ke(S(r)),
					get disabled() {
						return S(e);
					},
					children: (e, n) => {
						j();
						var i = R();
						v((e) => t(i, e), [() => m()(S(_e) === S(r).id ? "settingsDialog.uploadDestinationTesting" : "settingsDialog.uploadDestinationTest")]), f(e, i);
					},
					$$slots: { default: !0 }
				});
			}
			var ne = x(ee, 2);
			{
				let e = H(() => S(ue) === S(r).id);
				c(ne, () => et, (n, a) => {
					a(n, {
						get open() {
							return S(e);
						},
						onOpenChange: (e) => P(ue, e ? S(r).id : null, !0),
						children: (e, n) => {
							var a = nv(), o = M(a);
							{
								let e = H(() => m()("settingsDialog.uploadDestinationActions", { values: { name: S(r).name } }));
								c(o, () => tt, (t, n) => {
									n(t, {
										class: "destination-menu-trigger",
										"data-destination-menu": !0,
										get "aria-label"() {
											return S(e);
										},
										children: (e, t) => {
											var n = ev();
											f(e, n);
										},
										$$slots: { default: !0 }
									});
								});
							}
							var s = x(o, 2);
							c(s, () => Re, (e, n) => {
								n(e, {
									get to() {
										return te;
									},
									children: (e, n) => {
										var a = p(), o = M(a);
										c(o, () => $e, (e, n) => {
											n(e, {
												class: "destination-menu-content",
												align: "end",
												sideOffset: 4,
												preventScroll: !1,
												onCloseAutoFocus: Be,
												children: (e, n) => {
													var a = tv(), o = M(a);
													c(o, () => Ze, (e, n) => {
														n(e, {
															class: "destination-menu-item",
															get disabled() {
																return S(r).isDefault;
															},
															onSelect: () => void vt.setDefault(S(r).id, S(we)),
															children: (e, n) => {
																j();
																var r = R();
																v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationSetDefault")]), f(e, r);
															},
															$$slots: { default: !0 }
														});
													});
													var s = x(o, 2);
													c(s, () => Ze, (e, n) => {
														n(e, {
															class: "destination-menu-item",
															onSelect: () => {
																He(S(r)), S(me) && (le = "form");
															},
															children: (e, n) => {
																j();
																var r = R();
																v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationEdit")]), f(e, r);
															},
															$$slots: { default: !0 }
														});
													});
													var l = x(s, 2);
													{
														let e = H(() => S(i) === 0);
														c(l, () => Ze, (n, i) => {
															i(n, {
																class: "destination-menu-item",
																get disabled() {
																	return S(e);
																},
																onSelect: () => void Ve(S(r), "up"),
																children: (e, n) => {
																	j();
																	var r = R();
																	v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationMoveUp")]), f(e, r);
																},
																$$slots: { default: !0 }
															});
														});
													}
													var u = x(l, 2);
													{
														let e = H(() => S(i) === S(xe).destinations.length - 1);
														c(u, () => Ze, (n, i) => {
															i(n, {
																class: "destination-menu-item",
																get disabled() {
																	return S(e);
																},
																onSelect: () => void Ve(S(r), "down"),
																children: (e, n) => {
																	j();
																	var r = R();
																	v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationMoveDown")]), f(e, r);
																},
																$$slots: { default: !0 }
															});
														});
													}
													var d = x(u, 2);
													c(d, () => Qe, (e, t) => {
														t(e, { class: "destination-menu-separator" });
													});
													var p = x(d, 2);
													{
														let e = H(() => S(xe).destinations.length <= 1);
														c(p, () => Ze, (n, i) => {
															i(n, {
																class: "destination-menu-item",
																get disabled() {
																	return S(e);
																},
																onSelect: () => void qe(S(r)),
																children: (e, n) => {
																	j();
																	var r = R();
																	v((e) => t(r, e), [() => m()("settingsDialog.uploadDestinationDelete")]), f(e, r);
																},
																$$slots: { default: !0 }
															});
														});
													}
													f(e, a);
												},
												$$slots: { default: !0 }
											});
										}), f(e, a);
									},
									$$slots: { default: !0 }
								});
							}), f(e, a);
						},
						$$slots: { default: !0 }
					});
				});
			}
			e(z), e(o);
			var ie = x(o, 2), ae = (n) => {
				let i = H(() => S(xe).testResults[S(r).id]);
				var a = av();
				let o;
				var s = b(a), c = (e) => {
					var n = R();
					v((e) => t(n, e), [() => m()("settingsDialog.uploadDestinationTesting")]), f(e, n);
				}, l = (e) => {
					var n = iv(), r = M(n), a = B(r, !0), o = x(r, 2), s = (e) => {
						var n = rv(), r = B(n, !0);
						v(() => t(r, S(i).message)), f(e, n);
					};
					u(o, (e) => {
						S(i).message && e(s);
					}), v((e) => t(a, e), [() => m()(S(i).success ? "settingsDialog.uploadDestinationTestSuccess" : "settingsDialog.uploadDestinationTestFailure")]), f(e, n);
				};
				u(s, (e) => {
					S(_e) === S(r).id ? e(c) : S(i) && e(l, 1);
				}), e(a), v(() => o = re(a, 1, "test-result svelte-odrb59", null, o, { error: S(_e) !== S(r).id && !S(i)?.success })), f(n, a);
			};
			u(ie, (e) => {
				(S(_e) === S(r).id || S(xe).testResults[S(r).id]) && e(ae);
			});
			var oe = x(ie, 2), se = (e) => {
				O(e);
			};
			u(oe, (e) => {
				S(me) && S(he) === S(r).id && e(se);
			}), e(a), v((e, n) => {
				V(a, "data-destination-id", S(r).id), t(_, S(r).name), t(D, `${S(r).protocol === "blossom" ? "Blossom" : S(r).protocol === "nip96" ? "NIP-96" : "Custom HTTP"}
                                    · ${e ?? ""}`), V(A, "id", l + "-mime-" + S(r).id), t(N, n);
			}, [() => S(r).capabilities.maxUploadSize ? m()("settingsDialog.uploadDestinationMaxSize", { values: { size: Me(S(r).capabilities.maxUploadSize) } }) : Me(null), () => Ne(S(r))]), f(n, a);
		}), e(A);
		var N = x(A, 2), F = (n) => {
			var i = uv(), o = b(i), s = b(o), c = b(s), d = B(c, !0);
			e(s);
			var p = x(s, 2), h = b(p);
			{
				let e = H(() => !S(Te) || S(xe).relayFetching || S(xe).relayPublishing);
				je(h, {
					variant: "default",
					shape: "rounded",
					onClick: W,
					get disabled() {
						return S(e);
					},
					children: (e, n) => {
						j();
						var r = R();
						v((e) => t(r, e), [() => S(xe).relayFetching ? m()("settingsDialog.uploadDestinationRelayFetching") || "取得中" : m()("settingsDialog.uploadDestinationRelayFetch") || "取得"]), f(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			var g = x(h, 2);
			{
				let e = H(() => !S(Te) || S(xe).relayFetching || S(xe).relayPublishing || !S(xe).destinations.some((e) => (e.protocol === "blossom" || e.protocol === "nip96") && e.enabled));
				je(g, {
					variant: "default",
					shape: "rounded",
					onClick: Je,
					get disabled() {
						return S(e);
					},
					children: (e, n) => {
						j();
						var r = R();
						v((e) => t(r, e), [() => S(xe).relayPublishing ? m()("settingsDialog.uploadDestinationRelayPublishing") || "送信中" : m()("settingsDialog.uploadDestinationRelayPublish") || "送信"]), f(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			e(p);
			var _ = x(p, 2);
			{
				let n = H(() => m()("settingsDialog.uploadDestinationRelayInfoLabel") || "リレー同期の説明");
				St(_, {
					side: "top",
					get ariaLabel() {
						return S(n);
					},
					children: (n, r) => {
						var i = sv(), a = b(i), o = B(a, !0), s = x(a, 2), c = B(s, !0), l = x(s, 2), u = B(l, !0), d = x(l, 2), p = B(d, !0);
						e(i), v((e, n, r, i) => {
							t(o, e), t(c, n), t(u, r), t(p, i);
						}, [
							() => m()("settingsDialog.uploadDestinationRelayDescription"),
							() => m()("settingsDialog.uploadDestinationRelayInfoScope") || "Blossom は kind 10063、NIP-96 は kind 10096 として同期します。Custom HTTP は対象外です。",
							() => m()("settingsDialog.uploadDestinationRelayInfoOrder") || "送信時は各プロトコルの有効なアップロード先を一覧の順番で保存します。",
							() => m()("settingsDialog.uploadDestinationRelayInfoFetch") || "取得に成功したプロトコルだけを取得結果で置き換えます。"
						]), f(n, i);
					},
					$$slots: { default: !0 }
				});
			}
			e(o);
			var y = x(o, 2), C = (n) => {
				var i = lv(), o = b(i), s = B(o, !0), c = x(o, 2);
				r(c, 16, () => ["blossom", "nip96"], a, (n, r) => {
					let i = H(() => S(xe).relaySyncResults[r]);
					var a = cv(), o = b(a), s = x(o), c = (e) => {
						var n = R();
						v((e) => t(n, `— ${e ?? ""}`), [() => m()("settingsDialog.uploadDestinationRelayReason." + S(i).reason)]), f(e, n);
					};
					u(s, (e) => {
						S(i).reason && e(c);
					}), e(a), v((e) => t(o, `${r === "blossom" ? "Blossom" : "NIP-96"}: ${e ?? ""}`), [() => m()("settingsDialog.uploadDestinationRelayOutcome." + S(i).status)]), f(n, a);
				}), e(i), v((e) => t(s, e), [() => m()("settingsDialog.uploadDestinationRelaySummary." + ht(S(xe).relaySyncResults))]), f(n, i);
			};
			u(y, (e) => {
				S(xe).relaySyncResults && e(C);
			}), e(i), v((e) => {
				V(i, "aria-labelledby", l + "-relay-heading"), V(c, "id", l + "-relay-heading"), t(d, e);
			}, [() => m()("settingsDialog.uploadDestinationRelayTitle")]), f(n, i);
		};
		u(N, (e) => {
			S(me) || e(F);
		}), e(i), C(i, (e) => P(oe, e), () => S(oe)), v((e, n) => {
			V(i, "id", l), t(g, e), V(A, "aria-label", n);
		}, [() => m()("settingsDialog.uploadDestinationServers"), () => m()("settingsDialog.uploadDestinationServers")]), f(n, i);
	};
	u(Ct, (e) => {
		S(pe) && e(wt);
	}), e(Ye), v((e, n) => {
		t(gt, e), t(yt, n);
	}, [() => m()("settingsDialog.upload_destination") || "アップロード先", () => S(xe).defaultDestination?.name || m()("settingsDialog.uploadDestinationNone") || "未設定"]), f(i, Ye), n(), T();
}
o([
	"change",
	"input",
	"click"
]);
// D:/ドキュメント/GitHub/ehagaki/src/components/SettingsDialog.svelte
var hv = i("<div class=\"xmark-icon svg-icon svelte-1ud3sov\" aria-hidden=\"true\"></div>"), gv = i("<div class=\"help-icon svg-icon svelte-1ud3sov\" aria-hidden=\"true\"></div>"), _v = i("<div class=\"settings-header svelte-1ud3sov\"><div class=\"first-row svelte-1ud3sov\"><div class=\"site-title svelte-1ud3sov\"><span class=\"site-name svelte-1ud3sov\">eHagaki</span> <span class=\"cache-version svelte-1ud3sov\"> </span></div> <!></div></div>"), vv = i("<span class=\"settings-back-icon svg-icon svelte-1ud3sov\" aria-hidden=\"true\"></span>"), yv = i("<div class=\"settings-category-back svelte-1ud3sov\"><!> <h2 class=\"settings-category-title svelte-1ud3sov\"> </h2></div>"), bv = i("<div class=\"rotate-right-icon svg-icon svelte-1ud3sov\" aria-hidden=\"true\"></div> <span class=\"btn-text svelte-1ud3sov\"> </span>", 1), xv = i("<div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row sw-update-row svelte-1ud3sov\"><div class=\"setting-control svelte-1ud3sov\"><!></div></div></div>"), Sv = i("<div class=\"language-setting-icon setting-menu-icon setting-menu-mask-icon svg-icon svelte-1ud3sov\" aria-hidden=\"true\"></div> <span class=\"btn-text svelte-1ud3sov\"> </span>", 1), Cv = i("<span class=\"settings-category-label svelte-1ud3sov\"> </span> <span class=\"settings-category-chevron svg-icon svelte-1ud3sov\" aria-hidden=\"true\"></span>", 1), wv = i("<!> <div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row language-setting-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-label svelte-1ud3sov\"> </span></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div> <nav class=\"settings-category-list svelte-1ud3sov\"></nav>", 1), Tv = i("<!> <!>", 1), Ev = i("<!> <!> <!>", 1), Dv = i("<span class=\"form-error svelte-1ud3sov\" role=\"alert\"> </span>"), Ov = i("<div class=\"setting-section color-settings-section svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon color-settings-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <div class=\"color-settings-content svelte-1ud3sov\"><div class=\"color-settings-heading-row svelte-1ud3sov\"><div class=\"setting-label-with-icon color-settings-heading svelte-1ud3sov\"><span class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div> <div class=\"color-setting-row svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><label class=\"setting-label svelte-1ud3sov\" for=\"accent-color-input\"> </label> <span class=\"setting-description svelte-1ud3sov\"> </span></div> <div class=\"color-setting-controls svelte-1ud3sov\"><input type=\"color\" class=\"svelte-1ud3sov\"/> <input id=\"accent-color-input\" class=\"color-hex-input svelte-1ud3sov\" type=\"text\" inputmode=\"text\" autocomplete=\"off\"/></div></div> <!> <div class=\"color-setting-row svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><label class=\"setting-label svelte-1ud3sov\" for=\"base-color-input\"> </label> <span class=\"setting-description svelte-1ud3sov\"> </span></div> <div class=\"color-setting-controls svelte-1ud3sov\"><input type=\"color\" class=\"svelte-1ud3sov\"/> <input id=\"base-color-input\" class=\"color-hex-input svelte-1ud3sov\" type=\"text\" inputmode=\"text\" autocomplete=\"off\" placeholder=\"#RRGGBB\"/></div></div> <!></div></div>"), kv = i("<div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon theme-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"theme-mode-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div></div> <!>", 1), Av = i("<div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon media-placement-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"media-free-placement-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div>"), jv = i("<div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon client-tag-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"client-tag-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div> <div class=\"notification-group svelte-1ud3sov\"><div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row setting-row-with-note svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><div class=\"setting-label-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon quote-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"quote-notification-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div> <div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row setting-row-with-note svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><div class=\"setting-label-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon reply-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"reply-notification-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div></div> <div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><div class=\"setting-label-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon fail-closed-content-warning-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"fail-closed-content-warning-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div>", 1), Mv = i("<option class=\"svelte-1ud3sov\"> </option>"), Nv = i("<label class=\"footer-shortcut-slot svelte-1ud3sov\"><span class=\"svelte-1ud3sov\"> </span> <select class=\"footer-shortcut-select svelte-1ud3sov\"><option class=\"svelte-1ud3sov\"> </option><!></select></label>"), Pv = i("<div class=\"setting-section footer-shortcut-settings svelte-1ud3sov\"><div class=\"setting-label-with-icon footer-shortcuts-setting-heading svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon footer-shortcuts-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span class=\"setting-label svelte-1ud3sov\"> </span></div> <div class=\"footer-shortcut-slots svelte-1ud3sov\"></div></div> <div class=\"hide-mascot-flavor-group svelte-1ud3sov\"><div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row setting-row-with-note svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><div class=\"setting-label-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><img class=\"setting-menu-icon mascot-setting-icon svelte-1ud3sov\" alt=\"\" aria-hidden=\"true\"/> <span id=\"hide-mascot-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div> <div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row setting-row-with-note svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><div class=\"setting-label-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon flavor-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"hide-flavor-text-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div></div> <div class=\"setting-control svelte-1ud3sov\"><!></div></div></div></div>", 1), Fv = i("<div class=\"external-nostr-client-custom-url svelte-1ud3sov\"><label for=\"external-nostr-client-custom-url-input\" class=\"setting-label svelte-1ud3sov\"> </label> <span id=\"external-nostr-client-custom-url-description\" class=\"setting-description svelte-1ud3sov\"> </span> <input id=\"external-nostr-client-custom-url-input\" type=\"url\" inputmode=\"url\" aria-describedby=\"external-nostr-client-custom-url-description\" class=\"svelte-1ud3sov\"/> <!></div>"), Iv = i("<!> <!> <div class=\"setting-section svelte-1ud3sov\"><div class=\"setting-row setting-row-with-note svelte-1ud3sov\"><div class=\"setting-label-group svelte-1ud3sov\"><div class=\"setting-label-row svelte-1ud3sov\"><div class=\"setting-label-with-icon svelte-1ud3sov\"><span class=\"setting-menu-icon setting-menu-mask-icon external-nostr-client-setting-icon svelte-1ud3sov\" aria-hidden=\"true\"></span> <span id=\"external-nostr-client-label\" class=\"setting-label svelte-1ud3sov\"> </span></div> <!></div></div> <select class=\"setting-control external-nostr-client-select svelte-1ud3sov\" id=\"external-nostr-client-select\" aria-labelledby=\"external-nostr-client-label\"></select></div> <!></div>", 1), Lv = i("<div class=\"github-icon svg-icon svelte-1ud3sov\" aria-hidden=\"true\"></div>"), Rv = i("<div class=\"setting-section settings-about svelte-1ud3sov\"><div class=\"setting-row svelte-1ud3sov\"><span class=\"setting-label svelte-1ud3sov\"> </span> <div class=\"setting-control svelte-1ud3sov\"><a class=\"settings-about-author-link svelte-1ud3sov\" href=\"https://lokuyow.github.io/\" target=\"_blank\" rel=\"noopener noreferrer\"> </a></div></div> <div class=\"setting-row svelte-1ud3sov\"><span class=\"setting-label svelte-1ud3sov\"> </span> <div class=\"setting-control svelte-1ud3sov\"><!></div></div> <div class=\"setting-row svelte-1ud3sov\"><span class=\"setting-label svelte-1ud3sov\"> </span> <div class=\"setting-control svelte-1ud3sov\"><div class=\"zap-view-btn-group svelte-1ud3sov\"><button class=\"zap-btn svelte-1ud3sov\" data-npub=\"npub1a3pvwe2p3v7mnjz6hle63r628wl9w567aw7u23fzqs062v5vqcqqu3sgh3\" data-note-id=\"naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30\" data-relays=\"wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me\">Support</button> <span class=\"divider svelte-1ud3sov\"></span> <button class=\"view-btn svelte-1ud3sov\" data-title=\"Thanks for the Support!\" data-nzv-id=\"naddr1qqxnzde4xsunzwpnxymrgwpsqgswcsk8v4qck0deepdtluag3a9rh0jh2d0wh0w9g53qg8a9x2xqvqqrqsqqql8kt67m30\" data-zap-color-mode=\"true\" data-relay-urls=\"wss://nos.lol,wss://nostr.bitcoiner.social,wss://relay.nostr.wirednet.jp,wss://yabu.me\">View</button></div></div></div></div>"), zv = i("<!> <div class=\"modal-body svelte-1ud3sov\"><!> <!> <!> <!> <!> <!> <!> <!></div>", 1), Bv = {
	hash: "svelte-1ud3sov",
	code: ".settings-dialog :where(button:not(.bui-switch)) {min-inline-size:44px;min-block-size:44px;}\n\n    /* SettingsDialog固有: paddingなしのdialog-content */.settings-dialog .dialog-content {padding:0;}.settings-dialog .setting-label {font-weight:normal;}.xmark-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.settings-header.svelte-1ud3sov {display:flex;flex-direction:column;align-items:center;justify-content:space-between;font-weight:bold;font-size:1.3rem;width:100%;padding:8px 12px;gap:2px;border-bottom:1px solid var(--border-hr);}.first-row.svelte-1ud3sov {display:flex;align-items:center;justify-content:space-between;width:100%;gap:10px;}.site-title.svelte-1ud3sov {display:flex;align-items:baseline;gap:8px;.site-name:where(.svelte-1ud3sov) {font-size:1.5rem;font-weight:bold;letter-spacing:0.5px;}.cache-version:where(.svelte-1ud3sov) {font-size:1rem;color:var(--text-light);}}.github-link-btn.circle,\n    .help-btn.circle {width:44px;height:44px;min-width:44px;min-height:44px;--btn-bg: var(--dialog-bg);}.github-link-btn.circle {.github-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6769746875622d6d61726b2e737667);width:26px;height:26px;}}.help-btn.circle {.help-icon {mask-image:var(--ehagaki-icon-68656c705f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;}}.zap-view-btn-group.svelte-1ud3sov {display:inline-flex;height:44px;min-height:44px;.zap-btn:where(.svelte-1ud3sov),\n        .view-btn:where(.svelte-1ud3sov) {min-width:70px;min-height:44px;height:44px;background:var(--btn-bg);}.zap-btn:where(.svelte-1ud3sov) {border-radius:6px 0 0 6px;border-right-color:transparent;padding:0 10px 0 13px;}.divider:where(.svelte-1ud3sov) {width:1px;background-color:var(--border);}.view-btn:where(.svelte-1ud3sov) {border-radius:0 6px 6px 0;border-left-color:transparent;padding:0 14px 0 12px;}}.language-setting-row.svelte-1ud3sov .setting-label-with-icon:where(.svelte-1ud3sov) {padding-inline-start:12px;}.settings-category-list.svelte-1ud3sov {display:flex;flex-direction:column;gap:0;}.settings-dialog button.settings-category-button {width:100%;justify-content:space-between;gap:12px;min-height:50px;height:50px;padding-inline:12px;border-radius:0;border:none;font-weight:normal;--btn-bg: var(--dialog-bg);background-color:transparent;background-image:none;}\n\n    @media (hover: hover) and (pointer: fine) {.settings-dialog button.settings-category-button:hover:not(:disabled) {background-color:var(--button-hover-bg);color:var(--button-hover-color);}\n                .settings-dialog\n                    button.settings-category-button:hover:not(:disabled)\n                    .settings-category-chevron\n             {color:inherit;background-color:currentColor;}\n    }.settings-category-label.svelte-1ud3sov {min-width:0;text-align:start;font-weight:normal;}.settings-category-chevron.svelte-1ud3sov,\n    .settings-back-icon.svelte-1ud3sov {width:24px;height:24px;flex:0 0 24px;background-color:currentColor;}.settings-category-chevron.svelte-1ud3sov {color:var(--text-muted);--svg: var(--text-muted);mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.settings-back-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6172726f775f6261636b5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.ehagaki-app-root .settings-dialog button.settings-back-button {position:relative;display:inline-flex;width:50px;height:50px;min-width:50px;min-height:50px;flex:0 0 50px;justify-content:flex-start;align-items:center;padding:0;border:none;border-radius:0;--btn-bg: transparent;background-color:transparent;background-image:none;}.settings-category-back button.settings-back-button .settings-back-icon.svelte-1ud3sov {position:absolute;inset-inline-start:0;top:50%;transform:translateY(-50%);width:24px;height:24px;inline-size:24px;block-size:24px;margin:0;flex:none;}.ehagaki-app-root .settings-dialog button.settings-back-button:hover:not(:disabled),\n    .ehagaki-app-root .settings-dialog button.settings-back-button:active:not(:disabled),\n    .ehagaki-app-root .settings-dialog button.settings-back-button:focus-visible {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;}.settings-category-back.svelte-1ud3sov {display:flex;align-items:center;min-width:0;min-height:50px;}.settings-category-title.svelte-1ud3sov {margin:0;min-width:0;font-size:1.125rem;font-weight:600;line-height:1.3;}.settings-about-author-link.svelte-1ud3sov {font-size:1rem;color:var(--text-light);text-decoration:underline;}.modal-body.svelte-1ud3sov {padding:16px;display:flex;flex-direction:column;gap:30px;width:100%;overflow-y:auto;}.footer-shortcut-slots.svelte-1ud3sov {display:flex;flex-direction:column;gap:12px;padding-inline-start:calc(24px + var(--setting-label-icon-gap));}.footer-shortcut-slot.svelte-1ud3sov {display:flex;align-items:center;justify-content:space-between;gap:12px;}.footer-shortcut-select.svelte-1ud3sov {flex:0 1 260px;min-width:0;min-height:44px;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);}.setting-label-with-icon.svelte-1ud3sov {flex:1 1 auto;}.language-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-7472616e736c6174655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.theme-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636f6e74726173745f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.media-placement-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6f70656e5f776974685f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.color-settings-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636f6c6f72735f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.external-nostr-client-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.footer-shortcuts-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-766572746963616c5f616c69676e5f626f74746f6d5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.mascot-setting-icon.svelte-1ud3sov {filter:grayscale(1);object-fit:contain;}.flavor-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636861745f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.quote-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.reply-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.client-tag-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-6c6162656c5f323464705f4533453345335f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.fail-closed-content-warning-setting-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-7669736962696c6974795f6f66665f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.setting-row-with-note.svelte-1ud3sov {align-items:flex-start;}.setting-label-group.svelte-1ud3sov,\n    .hide-mascot-flavor-group.svelte-1ud3sov,\n    .notification-group.svelte-1ud3sov {display:flex;flex-direction:column;}.setting-label-group.svelte-1ud3sov {gap:4px;min-width:0;margin-block:auto;}.external-nostr-client-select.svelte-1ud3sov {min-width:160px;min-height:44px;padding:8px 32px 8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.external-nostr-client-custom-url.svelte-1ud3sov {display:flex;flex-direction:column;gap:6px;margin-top:12px;}.external-nostr-client-custom-url.svelte-1ud3sov input:where(.svelte-1ud3sov) {width:100%;min-height:44px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.external-nostr-client-custom-url.svelte-1ud3sov input[aria-invalid=\"true\"]:where(.svelte-1ud3sov) {border-color:var(--danger);}.setting-description.svelte-1ud3sov {color:var(--text-muted);font-size:0.875rem;line-height:1.4;}.form-error.svelte-1ud3sov {color:var(--danger);font-size:0.875rem;line-height:1.4;}.setting-label-row.svelte-1ud3sov {display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;}.setting-label-row.svelte-1ud3sov .setting-label-with-icon:where(.svelte-1ud3sov) {flex:0 1 auto;max-width:calc(100% - 50px);}.rotate-right-icon.svelte-1ud3sov {mask-image:var(--ehagaki-icon-726566726573685f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.bui-switch {position:relative;display:inline-block;width:90px;height:44px;--btn-bg: var(--toggle-bg);background-color:var(--btn-bg);opacity:0.2;border-radius:50px;border:none;padding:0;cursor:pointer;transition:opacity 0.2s;flex-shrink:0;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {opacity:0.15;background:var(--btn-bg);transition:none;}\n        }}button.bui-switch[data-state=\"checked\"] {opacity:1;\n\n        @media (hover: hover) and (pointer: fine) {&:hover:not(:disabled) {opacity:0.9;}\n        }}.bui-switch[data-disabled] {cursor:not-allowed;opacity:0.5;}.bui-switch-thumb {position:absolute;display:block;height:38px;width:38px;left:3px;bottom:3px;background-color:var(--toggle-circle);translate:0 0;transition:translate 0.2s cubic-bezier(0, 1, 0.5, 1);border-radius:50%;}.bui-switch[data-state=\"checked\"] .bui-switch-thumb {translate:46px 0;}\n\n    @media (prefers-reduced-motion: reduce) {.bui-switch {transition:none;}.bui-switch-thumb {transition:none;}\n    }.sw-update-btn.primary {height:54px;width:auto;padding:12px 10px 12px 8px;flex-shrink:0;}.sw-update-row.svelte-1ud3sov {justify-content:flex-end;}.sw-update-btn:disabled {opacity:0.6;}.theme-mode-group {display:flex;gap:4px;flex-wrap:nowrap;button {min-width:74px;min-height:50px;padding:8px 10px;font-size:0.875rem;font-weight:normal;}}.color-settings-section.svelte-1ud3sov {gap:10px;}.color-settings-section.svelte-1ud3sov {display:grid;grid-template-columns:24px minmax(0, 1fr);column-gap:16px;align-items:start;}.color-settings-content.svelte-1ud3sov {display:flex;flex-direction:column;gap:10px;min-width:0;}.color-settings-heading-row.svelte-1ud3sov {display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;}.color-settings-heading.svelte-1ud3sov {min-height:24px;flex:1 1 auto;min-width:0;}.color-setting-row.svelte-1ud3sov,\n    .color-setting-controls.svelte-1ud3sov {display:flex;gap:10px;}.color-setting-row.svelte-1ud3sov {align-items:center;justify-content:space-between;}.color-setting-controls.svelte-1ud3sov {align-items:center;flex-shrink:0;}.color-setting-controls.svelte-1ud3sov input[type=\"color\"]:where(.svelte-1ud3sov) {width:44px;height:44px;padding:2px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);cursor:pointer;}.color-hex-input.svelte-1ud3sov {width:104px;min-height:44px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--dialog-bg);color:var(--text);font:inherit;}.color-hex-input[aria-invalid=\"true\"].svelte-1ud3sov {border-color:var(--danger);}.reset-theme-colors-btn.rounded {flex-shrink:0;min-height:44px;}\n\n    @media (max-width: 430px) {.color-setting-row.svelte-1ud3sov {align-items:flex-start;flex-direction:column;}.color-setting-controls.svelte-1ud3sov {align-self:flex-end;}\n    }.footer-shortcut-settings.svelte-1ud3sov {gap:10px;}"
};
function Vv(i, a) {
	ie(a, !0), A(i, Bv);
	let o = () => ee(ye, "$_", T), s = () => ee(ze, "$swUpdateStatus", T), l = () => ee(Ke, "$dbUpgradeBlocked", T), y = () => ee(U, "$locale", T), C = () => ee(Ve, "$swNeedRefresh", T), [T, D] = I(), O = z(a, "show", 15, !1), k = z(a, "onRefreshRelaysAndProfile", 3, () => {}), N = z(a, "hostRelayConfigActive", 3, !1), re = z(a, "onOpenWelcomeDialog", 3, void 0), ce = z(a, "rxNostr", 3, null), le = [
		{
			id: "display",
			labelKey: "settingsDialog.category_display"
		},
		{
			id: "post",
			labelKey: "settingsDialog.category_post"
		},
		{
			id: "media",
			labelKey: "settingsDialog.category_media"
		},
		{
			id: "nostr",
			labelKey: "settingsDialog.category_nostr"
		},
		{
			id: "about",
			labelKey: "settingsDialog.category_about"
		}
	], ue = E(null), de = H(() => le.find((e) => e.id === S(ue))?.labelKey ?? ""), fe = null;
	function pe() {
		return se().historyEnabled;
	}
	function me(e) {
		if (P(ue, e, !0), !pe() || fe !== null) return;
		let t = Ae();
		history.pushState({ settingsCategoryDepth: t }, "", window.location.href), fe = t;
	}
	function he() {
		if (S(ue) === null) return;
		let e = fe !== null;
		fe = null, P(ue, null), e && history.back();
	}
	function ge() {
		O() && fe !== null && history.state?.settingsCategoryDepth !== fe && (fe = null, P(ue, null));
	}
	function _e() {
		let e = fe !== null;
		e && (fe = null, P(ue, null)), O(!1), a.onClose?.(), e && pe() && history.go(-2);
	}
	Xe(() => O(), _e, !0), F(() => {
		window.addEventListener("popstate", ge);
	}), te(() => {
		window.removeEventListener("popstate", ge), fe !== null && pe() && (fe = null, history.go(-2));
	});
	let ve = H(() => De(o())), be = H(() => De(o())), xe = H(() => Fe(S(ve), 2)), Oe = H(() => Fe(S(be), 2)), Me = E(w(W.clientTagEnabled)), Ne = E(w(W.externalNostrClient)), Re = E(w(W.externalNostrClientCustomUrl)), qe = E(null), Ye = E(w(W.quoteNotificationEnabled)), Ze = E(w(W.replyNotificationEnabled)), Qe = "#1dbf73", $e = E(w(bt.accentColor ?? Qe)), et = E(w(bt.baseColor ?? "")), tt = E(null), nt = E(null), at = H(() => !W.showMascot || !W.showFlavorText), ot = H(() => Ue.value), st = H(() => Ee.value), ct = H(() => Te.value), lt = H(() => s() === "installing"), ut = H(l), dt = H(() => Be.required), ft = H(() => S(dt) || s() === "ready" && !S(ut));
	function pt() {
		S(dt) ? Ge() : Le(We, (e) => Te.set(e));
	}
	F(() => {
		W.reload(), P(Me, W.clientTagEnabled, !0), P(Ne, W.externalNostrClient, !0), P(Re, W.externalNostrClientCustomUrl, !0), P(Ye, W.quoteNotificationEnabled, !0), P(Ze, W.replyNotificationEnabled, !0), bt.reload(), P($e, bt.accentColor ?? Qe, !0), P(et, bt.baseColor ?? "", !0), He(), !N() && Ce.value?.pubkey && Ce.value?.isAuthenticated && we(Ce.value.pubkey);
	}), L(() => {
		P(Me, W.clientTagEnabled, !0);
	}), L(() => {
		S(Ne) !== W.externalNostrClient && (W.externalNostrClient = S(Ne));
	}), L(() => {
		if (S(Re) !== W.externalNostrClientCustomUrl) {
			let e = ke(S(Re));
			e && (W.externalNostrClientCustomUrl = e);
		}
	}), L(() => {
		P(Ye, W.quoteNotificationEnabled, !0);
	}), L(() => {
		P(Ze, W.replyNotificationEnabled, !0);
	}), L(() => {
		S(Me) !== W.clientTagEnabled && (W.clientTagEnabled = S(Me));
	}), L(() => {
		S(Ze) !== W.replyNotificationEnabled && (W.replyNotificationEnabled = S(Ze));
	}), L(() => {
		S(Ye) !== W.quoteNotificationEnabled && (W.quoteNotificationEnabled = S(Ye));
	}), L(() => {
		O() ? Ce.value?.pubkey && Ce.value?.isAuthenticated && we(Ce.value.pubkey) : (fe = null, P(ue, null));
	}), L(() => {
		O() && S(ue) === "about" && (async () => {
			await ne(), _d(), window.nostrZap?.initTargets();
		})();
	});
	function ht() {
		W.locale = y() === "ja" ? "en" : "ja";
	}
	function vt(e, t) {
		let n = t.currentTarget.value;
		mt.set({
			...mt.value,
			[e]: n || null
		});
	}
	function Ct(e) {
		P(Re, e, !0);
		let t = ke(e);
		P(qe, t ? null : o()("settingsDialog.external_nostr_client_invalid_url"), !0), t && (W.externalNostrClientCustomUrl = t);
	}
	function wt(e, t) {
		P(e === "accent" ? $e : et, t, !0);
		let n = Pe(t);
		n && (e === "accent" ? (P($e, bt.setAccentColor(n) ?? t, !0), P(tt, null)) : (P(et, bt.setBaseColor(n) ?? t, !0), P(nt, null)));
	}
	function Tt(e) {
		let t = S(e === "accent" ? $e : et), n = e === "accent" ? bt.accentColor : bt.baseColor, r = e === "base" && !t && !n || Pe(t) ? null : o()("settingsDialog.invalid_hex_color");
		P(e === "accent" ? tt : nt, r, !0);
	}
	function Et(e, t) {
		let n = Pe(t);
		n && (e === "accent" ? (P($e, bt.setAccentColor(n) ?? n, !0), P(tt, null)) : (P(et, bt.setBaseColor(n) ?? n, !0), P(nt, null)));
	}
	function Dt() {
		bt.reset(), P($e, Qe), P(et, ""), P(tt, null), P(nt, null);
	}
	{
		let n = (e) => {
			var t = p(), n = M(t);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = H(() => o()("global.close"));
						je(e, _(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return S(t);
							},
							children: (e, t) => {
								var n = hv();
								f(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				c(n, () => it, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			f(e, t);
		}, a = H(() => o()("settings") || "設定"), s = H(() => o()("settingsDialog.image_quality_setting"));
		rt(i, {
			onOpenChange: (e) => !e && _e(),
			get title() {
				return S(a);
			},
			get description() {
				return S(s);
			},
			contentClass: "settings-dialog",
			footerVariant: "close-button",
			get open() {
				return O();
			},
			set open(e) {
				O(e);
			},
			footer: n,
			children: (n, i) => {
				var a = zv(), s = M(a), l = (n) => {
					var r = _v(), i = b(r), a = b(i), o = x(b(a), 2), s = B(o, !0);
					e(a);
					var c = x(a, 2);
					je(c, {
						shape: "circle",
						variant: "default",
						className: "help-btn",
						onClick: () => {
							_e(), re()?.();
						},
						ariaLabel: "Help",
						children: (e, t) => {
							var n = gv();
							f(e, n);
						},
						$$slots: { default: !0 }
					}), e(i), e(r), v(() => t(s, S(ot) ? `v${S(ot)}` : "")), f(n, r);
				};
				u(s, (e) => {
					S(ue) === null && e(l);
				});
				var _ = x(s, 2), y = b(_), w = (n) => {
					var r = yv(), i = b(r);
					{
						let e = H(() => o()("settingsDialog.back"));
						je(i, {
							variant: "default",
							shape: "square",
							contentLayout: "icon",
							className: "settings-back-button",
							get ariaLabel() {
								return S(e);
							},
							onClick: he,
							children: (e, t) => {
								var n = vv();
								f(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					var a = x(i, 2), s = B(a, !0);
					e(r), v((e) => t(s, e), [() => o()(S(de))]), f(n, r);
				};
				u(y, (e) => {
					S(ue) && e(w);
				});
				var T = x(y, 2), E = (n) => {
					var i = wv(), a = M(i), s = (n) => {
						var r = xv(), i = b(r), a = b(i), s = b(a);
						{
							let e = H(() => S(ct) || S(lt) && !S(dt) ? "loading" : ""), n = H(() => S(ct) || !S(ft)), r = H(() => S(dt) ? o()("staleAsset.reload") : o()("settingsDialog.update_app") || "アプリを更新");
							je(s, {
								variant: "primary",
								shape: "rounded",
								contentLayout: "iconText",
								get className() {
									return `sw-update-btn ${S(e) ?? ""}`;
								},
								onClick: pt,
								get disabled() {
									return S(n);
								},
								get ariaLabel() {
									return S(r);
								},
								children: (e, n) => {
									var r = p(), i = M(r), a = (e) => {
										{
											let t = H(() => S(lt) ? o()("settingsDialog.sw_update_installing_short") || "インストール中..." : o()("settingsDialog.updating") || "更新中...");
											Se(e, {
												showLoader: !0,
												loaderSize: 32,
												get text() {
													return S(t);
												}
											});
										}
									}, s = (e) => {
										var n = bv(), r = x(M(n), 2), i = B(r, !0);
										v((e) => t(i, e), [() => S(dt) ? o()("staleAsset.reload") : o()("settingsDialog.update_app") || "更新"]), f(e, n);
									};
									u(i, (e) => {
										S(ct) || S(lt) && !S(dt) ? e(a) : e(s, -1);
									}), f(e, r);
								},
								$$slots: { default: !0 }
							});
						}
						e(a), e(i), e(r), f(n, r);
					};
					u(a, (e) => {
						(C() || S(dt)) && e(s);
					});
					var c = x(a, 2), l = b(c), d = b(l), m = b(d), h = B(m, !0);
					e(d);
					var g = x(d, 2), _ = b(g);
					je(_, {
						variant: "default",
						shape: "rounded",
						contentLayout: "iconText",
						className: "lang-btn",
						onClick: ht,
						children: (e, n) => {
							var r = Sv(), i = x(M(r), 2), a = B(i, !0);
							v((e) => t(a, e), [() => o()("settingsDialog.change") || "変更"]), f(e, r);
						},
						$$slots: { default: !0 }
					}), e(g), e(l), e(c);
					var y = x(c, 2);
					r(y, 21, () => le, (e) => e.id, (e, n) => {
						je(e, {
							variant: "default",
							shape: "square",
							className: "settings-category-button",
							onClick: () => me(S(n).id),
							children: (e, r) => {
								var i = Cv(), a = M(i), s = B(a, !0);
								j(2), v((e) => t(s, e), [() => o()(S(n).labelKey)]), f(e, i);
							},
							$$slots: { default: !0 }
						});
					}), e(y), v((e, n) => {
						t(h, e), V(y, "aria-label", n);
					}, [() => o()("settingsDialog.language_setting_label"), () => o()("settings") || "設定"]), f(n, i);
				};
				u(T, (e) => {
					S(ue) === null && e(E);
				});
				var D = x(T, 2), O = (e) => {
					var t = Tv(), n = M(t);
					U_(n, {
						get compressionPairs() {
							return S(xe);
						},
						get selectedCompression() {
							return W.imageQualityLevel;
						},
						onCompressionChange: (e) => W.imageQualityLevel = e,
						get videoCompressionPairs() {
							return S(Oe);
						},
						get selectedVideoCompression() {
							return W.videoQualityLevel;
						},
						onVideoCompressionChange: (e) => W.videoQualityLevel = e
					}), mv(x(n, 2), { get rxNostr() {
						return ce();
					} }), f(e, t);
				};
				u(D, (e) => {
					S(ue) === "media" && e(O);
				});
				var A = x(D, 2), F = (n) => {
					var r = kv(), i = M(r), a = b(i), s = b(a), l = x(b(s), 2), d = B(l, !0);
					e(s);
					var p = x(s, 2);
					c(p, () => _t, (e, n) => {
						n(e, {
							class: "setting-control theme-mode-group",
							name: "themeMode",
							orientation: "horizontal",
							get value() {
								return Je.value;
							},
							"aria-labelledby": "theme-mode-label",
							onValueChange: (e) => Je.set(e),
							children: (e, n) => {
								var r = Ev(), i = M(r);
								{
									let e = H(() => o()("settingsDialog.theme_system") || "システム");
									yt(i, {
										value: "system",
										variant: "default",
										shape: "rounded",
										get ariaLabel() {
											return S(e);
										},
										children: (e, n) => {
											j();
											var r = R();
											v((e) => t(r, e), [() => o()("settingsDialog.theme_system") || "システム"]), f(e, r);
										},
										$$slots: { default: !0 }
									});
								}
								var a = x(i, 2);
								{
									let e = H(() => o()("settingsDialog.theme_light") || "ライト");
									yt(a, {
										value: "light",
										variant: "default",
										shape: "rounded",
										get ariaLabel() {
											return S(e);
										},
										children: (e, n) => {
											j();
											var r = R();
											v((e) => t(r, e), [() => o()("settingsDialog.theme_light") || "ライト"]), f(e, r);
										},
										$$slots: { default: !0 }
									});
								}
								var s = x(a, 2);
								{
									let e = H(() => o()("settingsDialog.theme_dark") || "ダーク");
									yt(s, {
										value: "dark",
										variant: "default",
										shape: "rounded",
										get ariaLabel() {
											return S(e);
										},
										children: (e, n) => {
											j();
											var r = R();
											v((e) => t(r, e), [() => o()("settingsDialog.theme_dark") || "ダーク"]), f(e, r);
										},
										$$slots: { default: !0 }
									});
								}
								f(e, r);
							},
							$$slots: { default: !0 }
						});
					}), e(a), e(i);
					var _ = x(i, 2), y = (n) => {
						var r = Ov(), i = x(b(r), 2), a = b(i), s = b(a), c = b(s), l = B(c, !0);
						e(s);
						var d = x(s, 2);
						je(d, {
							variant: "default",
							shape: "rounded",
							className: "reset-theme-colors-btn",
							onClick: Dt,
							children: (e, n) => {
								j();
								var r = R();
								v((e) => t(r, e), [() => o()("settingsDialog.reset_colors")]), f(e, r);
							},
							$$slots: { default: !0 }
						}), e(a);
						var p = x(a, 2), _ = b(p), y = b(_), C = B(y, !0), w = x(y, 2), T = B(w, !0);
						e(_);
						var E = x(_, 2), D = b(E);
						g(D);
						var O = x(D, 2);
						g(O), e(E), e(p);
						var k = x(p, 2), A = (e) => {
							var n = Dv(), r = B(n, !0);
							v(() => t(r, S(tt))), f(e, n);
						};
						u(k, (e) => {
							S(tt) && e(A);
						});
						var M = x(k, 2), N = b(M), P = b(N), F = B(P, !0), I = x(P, 2), L = B(I, !0);
						e(N);
						var z = x(N, 2), ee = b(z);
						g(ee);
						var te = x(ee, 2);
						g(te), e(z), e(M);
						var ne = x(M, 2), re = (e) => {
							var n = Dv(), r = B(n, !0);
							v(() => t(r, S(nt))), f(e, n);
						};
						u(ne, (e) => {
							S(nt) && e(re);
						}), e(i), e(r), v((e, n, r, i, a, o, s, c, u, d, f) => {
							t(l, e), t(C, n), t(T, r), V(D, "aria-label", i), oe(D, a), V(O, "aria-label", o), oe(O, S($e)), V(O, "aria-invalid", S(tt) ? "true" : "false"), t(F, s), t(L, c), V(ee, "aria-label", u), oe(ee, d), V(te, "aria-label", f), oe(te, S(et)), V(te, "aria-invalid", S(nt) ? "true" : "false");
						}, [
							() => o()("settingsDialog.color"),
							() => o()("settingsDialog.accent_color"),
							() => o()("settingsDialog.accent_color_description"),
							() => o()("settingsDialog.accent_color_picker"),
							() => Pe(bt.accentColor) ?? Qe,
							() => o()("settingsDialog.accent_color_hex"),
							() => o()("settingsDialog.base_color"),
							() => o()("settingsDialog.base_color_description"),
							() => o()("settingsDialog.base_color_picker"),
							() => Pe(bt.baseColor) ?? "#808080",
							() => o()("settingsDialog.base_color_hex")
						]), h("input", D, (e) => Et("accent", e.currentTarget.value)), h("input", O, (e) => wt("accent", e.currentTarget.value)), m("blur", O, () => Tt("accent")), h("input", ee, (e) => Et("base", e.currentTarget.value)), h("input", te, (e) => wt("base", e.currentTarget.value)), m("blur", te, () => Tt("base")), f(n, r);
					};
					u(_, (e) => {
						bt.isAvailable && e(y);
					}), v((e) => t(d, e), [() => o()("settingsDialog.theme_mode") || "カラーテーマ"]), f(n, r);
				};
				u(A, (e) => {
					S(ue) === "display" && e(F);
				});
				var I = x(A, 2), L = (n) => {
					var r = Av(), i = b(r), a = b(i), s = x(b(a), 2), l = B(s, !0);
					e(a);
					var u = x(a, 2), d = b(u);
					c(d, () => Mt, (e, t) => {
						t(e, {
							class: "bui-switch",
							"aria-labelledby": "media-free-placement-label",
							get checked() {
								return W.mediaFreePlacement;
							},
							set checked(e) {
								W.mediaFreePlacement = e;
							},
							children: (e, t) => {
								var n = p(), r = M(n);
								c(r, () => Ft, (e, t) => {
									t(e, { class: "bui-switch-thumb" });
								}), f(e, n);
							},
							$$slots: { default: !0 }
						});
					}), e(u), e(i), e(r), v((e) => t(l, e), [() => o()("settingsDialog.media_bottom_mode") || "メディア自由配置モード"]), f(n, r);
				};
				u(I, (e) => {
					S(ue) === "media" && e(L);
				});
				var z = x(I, 2), ee = (n) => {
					var r = jv(), i = M(r), a = b(i), s = b(a), l = x(b(s), 2), u = B(l, !0);
					e(s);
					var d = x(s, 2), m = b(d);
					c(m, () => Mt, (e, t) => {
						t(e, {
							class: "bui-switch",
							"aria-labelledby": "client-tag-label",
							get checked() {
								return S(Me);
							},
							set checked(e) {
								P(Me, e, !0);
							},
							children: (e, t) => {
								var n = p(), r = M(n);
								c(r, () => Ft, (e, t) => {
									t(e, { class: "bui-switch-thumb" });
								}), f(e, n);
							},
							$$slots: { default: !0 }
						});
					}), e(d), e(a), e(i);
					var h = x(i, 2), g = b(h), _ = b(g), y = b(_), C = b(y), w = b(C), T = x(b(w), 2), E = B(T, !0);
					e(w);
					var D = x(w, 2);
					{
						let e = H(() => o()("settingsDialog.quote_notification_description"));
						St(D, {
							side: "top",
							sideOffset: 8,
							get ariaLabel() {
								return S(e);
							},
							children: (e, n) => {
								j();
								var r = R();
								v((e) => t(r, e), [() => o()("settingsDialog.quote_notification_note") || "引用投稿時、引用元の投稿者への通知をデフォルトで有効にします"]), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(C), e(y);
					var O = x(y, 2), k = b(O);
					c(k, () => Mt, (e, t) => {
						t(e, {
							class: "bui-switch",
							"aria-labelledby": "quote-notification-label",
							get checked() {
								return S(Ye);
							},
							set checked(e) {
								P(Ye, e, !0);
							},
							children: (e, t) => {
								var n = p(), r = M(n);
								c(r, () => Ft, (e, t) => {
									t(e, { class: "bui-switch-thumb" });
								}), f(e, n);
							},
							$$slots: { default: !0 }
						});
					}), e(O), e(_), e(g);
					var A = x(g, 2), N = b(A), F = b(N), I = b(F), L = b(I), z = x(b(L), 2), ee = B(z, !0);
					e(L);
					var te = x(L, 2);
					{
						let e = H(() => o()("settingsDialog.reply_notification_description"));
						St(te, {
							side: "top",
							sideOffset: 8,
							get ariaLabel() {
								return S(e);
							},
							children: (e, n) => {
								j();
								var r = R();
								v((e) => t(r, e), [() => o()("settingsDialog.reply_notification_note") || "リプライ時にリプライツリー内のほかの参加者をデフォルトで通知対象に含めます"]), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(I), e(F);
					var ne = x(F, 2), V = b(ne);
					c(V, () => Mt, (e, t) => {
						t(e, {
							class: "bui-switch",
							"aria-labelledby": "reply-notification-label",
							get checked() {
								return S(Ze);
							},
							set checked(e) {
								P(Ze, e, !0);
							},
							children: (e, t) => {
								var n = p(), r = M(n);
								c(r, () => Ft, (e, t) => {
									t(e, { class: "bui-switch-thumb" });
								}), f(e, n);
							},
							$$slots: { default: !0 }
						});
					}), e(ne), e(N), e(A), e(h);
					var re = x(h, 2), ie = b(re), ae = b(ie), oe = b(ae), se = b(oe), ce = x(b(se), 2), le = B(ce, !0);
					e(se);
					var ue = x(se, 2);
					{
						let e = H(() => o()("settingsDialog.fail_closed_content_warning_info_label"));
						St(ue, {
							side: "top",
							sideOffset: 8,
							get ariaLabel() {
								return S(e);
							},
							children: (e, n) => {
								j();
								var r = R();
								v((e) => t(r, e), [() => o()("settingsDialog.fail_closed_content_warning_info")]), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(oe), e(ae);
					var de = x(ae, 2), fe = b(de);
					c(fe, () => Mt, (e, t) => {
						t(e, {
							class: "bui-switch",
							get checked() {
								return W.failClosedContentWarning;
							},
							onCheckedChange: (e) => W.failClosedContentWarning = e,
							"aria-labelledby": "fail-closed-content-warning-label",
							children: (e, t) => {
								var n = p(), r = M(n);
								c(r, () => Ft, (e, t) => {
									t(e, { class: "bui-switch-thumb" });
								}), f(e, n);
							},
							$$slots: { default: !0 }
						});
					}), e(de), e(ie), e(re), v((e, n, r, i) => {
						t(u, e), t(E, n), t(ee, r), t(le, i);
					}, [
						() => o()("settingsDialog.client_tag_label") || "投稿詳細にクライアント名をつける（Client tag）",
						() => o()("settingsDialog.quote_notification_label") || "引用元の投稿者に通知",
						() => o()("settingsDialog.reply_notification_label") || "返信先以外にも通知",
						() => o()("settingsDialog.fail_closed_content_warning_label")
					]), f(n, r);
				};
				u(z, (e) => {
					S(ue) === "post" && e(ee);
				});
				var te = x(z, 2), ne = (n) => {
					var i = Pv(), a = M(i), s = b(a), l = x(b(s), 2), m = B(l, !0);
					e(s);
					var g = x(s, 2);
					r(g, 20, () => ["left", "right"], (e) => e, (n, i) => {
						let a = H(() => i);
						var s = Nv(), c = b(s), l = B(c, !0), u = x(c, 2), p = b(u), m = B(p, !0);
						p.value = p.__value = "";
						var g = x(p);
						r(g, 17, () => xt, (e) => e.id, (e, n) => {
							var r = Mv(), i = B(r, !0), s = {};
							v((e) => {
								r.disabled = S(n).id === mt.value[S(a) === "left" ? "right" : "left"], t(i, e), s !== (s = S(n).id) && (r.value = (r.__value = s) ?? "");
							}, [() => o()(S(n).labelKey)]), f(e, r);
						}), e(u);
						var _;
						ae(u), e(s), v((e, n) => {
							V(s, "for", `footer-shortcut-${S(a)}`), t(l, e), V(u, "id", `footer-shortcut-${S(a)}`), t(m, n), _ !== (_ = mt.value[S(a)] ?? "") && (u.value = (u.__value = _) ?? "", d(u, _));
						}, [() => o()(`settingsDialog.footer_shortcuts_${S(a)}`), () => o()("settingsDialog.footer_shortcuts_none")]), h("change", u, (e) => vt(S(a), e)), f(n, s);
					}), e(g), e(a);
					var _ = x(a, 2), y = b(_), C = b(y), w = b(C), T = b(w), E = b(T), D = b(E), O = x(D, 2), k = B(O, !0);
					e(E);
					var A = x(E, 2);
					{
						let e = H(() => o()("settingsDialog.hide_mascot_description"));
						St(A, {
							side: "top",
							sideOffset: 8,
							get ariaLabel() {
								return S(e);
							},
							children: (e, n) => {
								j();
								var r = R();
								v((e) => t(r, e), [() => o()("settingsDialog.hide_mascot_note") || "オンにすると左上のマスコットを隠し、フレーバーテキストもあわせて非表示にします。"]), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(T), e(w);
					var N = x(w, 2), P = b(N);
					{
						let e = H(() => !W.showMascot);
						c(P, () => Mt, (t, n) => {
							n(t, {
								class: "bui-switch",
								get checked() {
									return S(e);
								},
								onCheckedChange: (e) => W.showMascot = !e,
								"aria-labelledby": "hide-mascot-label",
								children: (e, t) => {
									var n = p(), r = M(n);
									c(r, () => Ft, (e, t) => {
										t(e, { class: "bui-switch-thumb" });
									}), f(e, n);
								},
								$$slots: { default: !0 }
							});
						});
					}
					e(N), e(C), e(y);
					var F = x(y, 2), I = b(F), L = b(I), z = b(L), ee = b(z), te = x(b(ee), 2), ne = B(te, !0);
					e(ee);
					var re = x(ee, 2);
					{
						let e = H(() => o()("settingsDialog.hide_flavor_text_description"));
						St(re, {
							side: "top",
							sideOffset: 8,
							get ariaLabel() {
								return S(e);
							},
							children: (e, n) => {
								j();
								var r = R();
								v((e) => t(r, e), [() => W.showMascot ? o()("settingsDialog.hide_flavor_text_note") || "オンにすると info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります。" : o()("settingsDialog.hide_flavor_text_note_included") || "マスコットを非表示にしている間は、この設定も自動でオンになります。"]), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(z), e(L);
					var ie = x(L, 2), oe = b(ie), se = (e) => {
						var t = p(), n = M(t);
						c(n, () => Mt, (e, t) => {
							t(e, {
								class: "bui-switch",
								get checked() {
									return S(at);
								},
								disabled: !0,
								"aria-labelledby": "hide-flavor-text-label",
								children: (e, t) => {
									var n = p(), r = M(n);
									c(r, () => Ft, (e, t) => {
										t(e, { class: "bui-switch-thumb" });
									}), f(e, n);
								},
								$$slots: { default: !0 }
							});
						}), f(e, t);
					}, ce = (e) => {
						var t = p(), n = M(t);
						c(n, () => Mt, (e, t) => {
							t(e, {
								class: "bui-switch",
								get checked() {
									return S(at);
								},
								onCheckedChange: (e) => W.showFlavorText = !e,
								"aria-labelledby": "hide-flavor-text-label",
								children: (e, t) => {
									var n = p(), r = M(n);
									c(r, () => Ft, (e, t) => {
										t(e, { class: "bui-switch-thumb" });
									}), f(e, n);
								},
								$$slots: { default: !0 }
							});
						}), f(e, t);
					};
					u(oe, (e) => {
						W.showMascot ? e(ce, -1) : e(se);
					}), e(ie), e(I), e(F), e(_), v((e, n, r, i) => {
						t(m, e), V(D, "src", n), t(k, r), t(ne, i);
					}, [
						() => o()("settingsDialog.footer_shortcuts"),
						() => gt("ehagaki_icon.svg"),
						() => o()("settingsDialog.hide_mascot_label") || "きってんを非表示",
						() => o()("settingsDialog.hide_flavor_text_label") || "フレーバーテキストを非表示"
					]), f(n, i);
				};
				u(te, (e) => {
					S(ue) === "display" && e(ne);
				});
				var ie = x(te, 2), fe = (n) => {
					var i = Iv(), a = M(i);
					N_(a, {
						get relayConfig() {
							return S(st);
						},
						get onRefreshRelaysAndProfile() {
							return k();
						},
						get hostRelayConfigActive() {
							return N();
						}
					});
					var s = x(a, 2), c = (e) => {
						L_(e, {});
					}, l = H(() => se().runtimeKind === "standalone");
					u(s, (e) => {
						S(l) && e(c);
					});
					var p = x(s, 2), m = b(p), _ = b(m), y = b(_), C = b(y), w = x(b(C), 2), T = B(w, !0);
					e(C);
					var E = x(C, 2);
					{
						let e = H(() => o()("settingsDialog.external_nostr_client_description"));
						St(E, {
							get ariaLabel() {
								return S(e);
							},
							children: (e, n) => {
								j();
								var r = R();
								v((e) => t(r, e), [() => o()("settingsDialog.external_nostr_client_description")]), f(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(y), e(_);
					var D = x(_, 2);
					r(D, 20, () => Ie, (e) => e, (e, n) => {
						var r = Mv(), i = B(r, !0), a = {};
						v((e) => {
							t(i, e), a !== (a = n) && (r.value = (r.__value = a) ?? "");
						}, [() => n === "custom" ? o()("settingsDialog.external_nostr_client_custom") : n === "nostter" ? "nostter" : n === "njump" ? "njump" : n[0].toUpperCase() + n.slice(1)]), f(e, r);
					}), e(D);
					var O;
					ae(D), e(m);
					var A = x(m, 2), F = (n) => {
						var r = Fv(), i = b(r), a = B(i, !0), s = x(i, 2), c = B(s, !0), l = x(s, 2);
						g(l);
						var d = x(l, 2), p = (e) => {
							var n = Dv(), r = B(n, !0);
							v(() => t(r, S(qe))), f(e, n);
						};
						u(d, (e) => {
							S(qe) && e(p);
						}), e(r), v((e, n) => {
							t(a, e), t(c, n), oe(l, S(Re)), V(l, "aria-invalid", S(qe) ? "true" : "false");
						}, [() => o()("settingsDialog.external_nostr_client_custom_url"), () => o()("settingsDialog.external_nostr_client_custom_url_description")]), h("input", l, (e) => Ct(e.currentTarget.value)), f(n, r);
					};
					u(A, (e) => {
						S(Ne) === "custom" && e(F);
					}), e(p), v((e) => {
						t(T, e), O !== (O = S(Ne)) && (D.value = (D.__value = O) ?? "", d(D, O));
					}, [() => o()("settingsDialog.external_nostr_client")]), h("change", D, (e) => {
						P(Ne, e.currentTarget.value, !0), P(qe, null);
					}), f(n, i);
				}, pe = (n) => {
					var r = Rv(), i = b(r), a = b(i), s = B(a, !0), c = x(a, 2), l = b(c), u = B(l, !0);
					e(c), e(i);
					var d = x(i, 2), p = b(d), m = B(p, !0), h = x(p, 2), g = b(h);
					je(g, {
						shape: "circle",
						variant: "default",
						className: "github-link-btn",
						onClick: () => window.open("https://github.com/Lokuyow/ehagaki", "_blank", "noopener"),
						ariaLabel: "GitHub Repository",
						children: (e, t) => {
							var n = Lv();
							f(e, n);
						},
						$$slots: { default: !0 }
					}), e(h), e(d);
					var _ = x(d, 2), y = b(_), S = B(y, !0);
					j(2), e(_), e(r), v((e, n, r, i) => {
						t(s, e), t(u, n), t(m, r), t(S, i);
					}, [
						() => o()("settingsDialog.about_author_label"),
						() => o()("settingsDialog.author_name"),
						() => o()("settingsDialog.about_source_code_label"),
						() => o()("settingsDialog.about_bitcoin_tip_label")
					]), f(n, r);
				};
				u(ie, (e) => {
					S(ue) === "nostr" ? e(fe) : S(ue) === "about" && e(pe, 1);
				}), e(_), f(n, a);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	n(), D();
}
o(["input", "change"]);
export { Vv as default };
