import { B as e, Dt as t, Et as n, F as r, G as i, K as a, Nt as o, P as s, Pt as c, St as l, Y as u, _t as d, at as f, b as p, ct as m, dt as h, ft as g, ht as _, i as v, j as y, mt as b, q as x, r as S, rt as C, tt as w, ut as T, v as E, yt as D } from "./index-client-DEFG3Gqk.js";
import { a as O } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { a as k, m as A } from "./esm-N9TTQGcl.js";
import { i as ee, r as te } from "./profilePictureUrlUtils-B7zGYkzO.js";
import { E as j, F as M, G as N, N as P, R as F, T as I, b as L, r as R } from "./LoadingPlaceholder-YrD8D_td.js";
import { t as z } from "./graphemeUtils-D37rBdTG.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/avatar/avatar.svelte.js
var B = L({
	component: "avatar",
	parts: [
		"root",
		"image",
		"fallback"
	]
}), V = new M("Avatar.Root"), H = class e {
	static create(t) {
		return V.set(new e(t));
	}
	opts;
	domContext;
	attachment;
	constructor(e) {
		this.opts = e, this.domContext = new j(this.opts.ref), this.loadImage = this.loadImage.bind(this), this.attachment = I(this.opts.ref);
	}
	loadImage(e, t, n) {
		if (this.opts.loadingStatus.current === "loaded") return;
		let r, i = new Image();
		return i.src = e, t !== void 0 && (i.crossOrigin = t), n && (i.referrerPolicy = n), this.opts.loadingStatus.current = "loading", i.onload = () => {
			r = this.domContext.setTimeout(() => {
				this.opts.loadingStatus.current = "loaded";
			}, this.opts.delayMs.current);
		}, i.onerror = () => {
			this.opts.loadingStatus.current = "error";
		}, () => {
			i.onload = null, i.onerror = null, r && this.domContext.clearTimeout(r);
		};
	}
	#e = l(() => ({
		id: this.opts.id.current,
		[B.root]: "",
		"data-status": this.opts.loadingStatus.current,
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		d(this.#e, e);
	}
}, U = class e {
	static create(t) {
		return new e(t, V.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = I(this.opts.ref), P.pre([() => this.opts.src.current, () => this.opts.crossOrigin.current], ([e, t]) => {
			if (!e) this.root.opts.loadingStatus.current = "error";
			else return this.root.loadImage(e, t, this.opts.referrerPolicy.current);
		});
	}
	#e = l(() => ({
		id: this.opts.id.current,
		style: { display: this.root.opts.loadingStatus.current === "loaded" ? "block" : "none" },
		"data-status": this.root.opts.loadingStatus.current,
		[B.image]: "",
		src: this.opts.src.current,
		crossorigin: this.opts.crossOrigin.current,
		referrerpolicy: this.opts.referrerPolicy.current,
		...this.attachment
	}));
	get props() {
		return C(this.#e);
	}
	set props(e) {
		d(this.#e, e);
	}
}, W = class e {
	static create(t) {
		return new e(t, V.get());
	}
	opts;
	root;
	attachment;
	constructor(e, t) {
		this.opts = e, this.root = t, this.attachment = I(this.opts.ref);
	}
	#e = l(() => this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : void 0);
	get style() {
		return C(this.#e);
	}
	set style(e) {
		d(this.#e, e);
	}
	#t = l(() => ({
		style: this.style,
		"data-status": this.root.opts.loadingStatus.current,
		[B.fallback]: "",
		...this.attachment
	}));
	get props() {
		return C(this.#t);
	}
	set props(e) {
		d(this.#t, e);
	}
}, G = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"delayMs",
	"loadingStatus",
	"onLoadingStatusChange",
	"child",
	"children",
	"id",
	"ref"
]), K = x("<div><!></div>");
function ne(s, d) {
	let f = u();
	t(d, !0);
	let p = S(d, "delayMs", 3, 0), m = S(d, "loadingStatus", 15, "loading"), _ = S(d, "id", 19, () => R(f)), y = S(d, "ref", 15, null), b = v(d, G), x = H.create({
		delayMs: N(() => p()),
		loadingStatus: N(() => m(), (e) => {
			m() !== e && (m(e), d.onLoadingStatusChange?.(e));
		}),
		id: N(() => _()),
		ref: N(() => y(), (e) => y(e))
	}), w = l(() => F(b, x.props));
	var T = a(), D = g(T), O = (e) => {
		var t = a(), n = g(t);
		r(n, () => d.child, () => ({ props: C(w) })), i(e, t);
	}, k = (e) => {
		var t = K();
		E(t, () => ({ ...C(w) }));
		var n = h(t);
		r(n, () => d.children ?? c), o(t), i(e, t);
	};
	e(D, (e) => {
		d.child ? e(O) : e(k, -1);
	}), i(s, T), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/avatar/components/avatar-image.svelte
var q = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"src",
	"child",
	"id",
	"ref",
	"crossorigin",
	"referrerpolicy"
]), J = x("<img/>");
function re(o, s) {
	let c = u();
	t(s, !0);
	let d = S(s, "id", 19, () => R(c)), f = S(s, "ref", 15, null), p = S(s, "crossorigin", 3, void 0), m = S(s, "referrerpolicy", 3, void 0), h = v(s, q), _ = U.create({
		src: N(() => s.src),
		id: N(() => d()),
		ref: N(() => f(), (e) => f(e)),
		crossOrigin: N(() => p()),
		referrerPolicy: N(() => m())
	}), y = l(() => F(h, _.props));
	var b = a(), x = g(b), T = (e) => {
		var t = a(), n = g(t);
		r(n, () => s.child, () => ({ props: C(y) })), i(e, t);
	}, D = (e) => {
		var t = J();
		E(t, () => ({
			...C(y),
			src: s.src
		})), w(t), i(e, t);
	};
	e(x, (e) => {
		s.child ? e(T) : e(D, -1);
	}), i(o, b), n();
}
// D:/ドキュメント/GitHub/ehagaki/node_modules/bits-ui/dist/bits/avatar/components/avatar-fallback.svelte
var Y = /* @__PURE__ */ new Set([
	"$$slots",
	"$$events",
	"$$legacy",
	"children",
	"child",
	"id",
	"ref"
]), X = x("<span><!></span>");
function ie(s, d) {
	let f = u();
	t(d, !0);
	let p = S(d, "id", 19, () => R(f)), m = S(d, "ref", 15, null), _ = v(d, Y), y = W.create({
		id: N(() => p()),
		ref: N(() => m(), (e) => m(e))
	}), b = l(() => F(_, y.props));
	var x = a(), w = g(x), T = (e) => {
		var t = a(), n = g(t);
		r(n, () => d.child, () => ({ props: C(b) })), i(e, t);
	}, D = (e) => {
		var t = X();
		E(t, () => ({ ...C(b) }));
		var n = h(t);
		r(n, () => d.children ?? c), o(t), i(e, t);
	};
	e(w, (e) => {
		d.child ? e(T) : e(D, -1);
	}), i(s, x), n();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileFallbackAvatar.ts
var Z = "profile-fallback-avatars-v1", ae = (e) => Array.from(e, (e) => {
	let t = e.codePointAt(0);
	return t >= 55296 && t <= 57343 || t < 32 || t >= 65534 && t <= 65535 ? "�" : e;
}).join("").replace(/[<>&"']/g, (e) => ({
	"<": "&lt;",
	">": "&gt;",
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&apos;"
})[e]);
function Q(e) {
	let t = e.pubkeyHex?.trim().toLowerCase() ?? "", n = A(t), r = e.displayName?.trim() || e.name?.trim() || "", i = z(r) || (n ? k.npubEncode(t).slice(5, 6) : "");
	if (!i) return null;
	let a = n ? `#${t.slice(0, 6)}` : "#808080", o = [
		1,
		3,
		5
	].map((e) => {
		let t = parseInt(a.slice(e, e + 2), 16) / 255;
		return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
	}), s = o[0] * .2126 + o[1] * .7152 + o[2] * .0722, c = (s + .05) / .05 >= 1.05 / (s + .05) ? "#000000" : "#ffffff";
	return {
		pubkey: n ? t : "",
		initial: i,
		background: a,
		foreground: c
	};
}
function $(e) {
	let t = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${e.background}"/><text x="32" y="32" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="36" font-weight="600" fill="${e.foreground}">${ae(e.initial)}</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(t)}`;
}
function oe(e) {
	let t = /* @__PURE__ */ new Map();
	try {
		let n = JSON.parse(e?.getItem("profile-fallback-avatars-v1") ?? "null");
		if (Array.isArray(n)) for (let e of n.slice(-256)) {
			if (!Array.isArray(e) || typeof e[0] != "string") continue;
			let n = e[1];
			if (!n || typeof n.initial != "string" || !n.initial || !/^#[0-9a-f]{6}$/.test(n.background) || !["#000000", "#ffffff"].includes(n.foreground) || typeof n.dataUrl != "string" || n.dataUrl.length > 16384) continue;
			let r = e[0].split(":")[1], i = Q({
				pubkeyHex: r,
				name: n.initial
			});
			i && e[0] === `v1:${i.pubkey}:${i.initial}` && n.background === i.background && n.foreground === i.foreground && n.dataUrl === $(i) && t.set(e[0], n);
		}
	} catch {}
	let n = !1, r = () => {
		n = !1;
		try {
			e?.setItem(Z, JSON.stringify([...t]));
		} catch {}
	}, i = () => {
		e && !n && (n = !0, queueMicrotask(r));
	};
	return { get(e) {
		let n = Q(e);
		if (!n) return null;
		let r = `v1:${n.pubkey}:${n.initial}`, a = t.get(r);
		if (a) return t.delete(r), t.set(r, a), a;
		let { initial: o, background: s, foreground: c } = n, l = {
			initial: o,
			background: s,
			foreground: c,
			dataUrl: $(n)
		};
		return t.set(r, l), t.size > 256 && t.delete(t.keys().next().value), i(), l;
	} };
}
var se = /* @__PURE__ */ new WeakMap(), ce = oe();
function le(e) {
	let t;
	try {
		t = O();
	} catch {
		return ce.get(e);
	}
	let n = se.get(t);
	return n || (n = oe(t), se.set(t, n)), n.get(e);
}
// D:/ドキュメント/GitHub/ehagaki/src/components/ProfileAvatar.svelte
var ue = x("<img class=\"profile-avatar-initial svelte-qnbxxi\" alt=\"\" aria-hidden=\"true\"/>"), de = x("<div class=\"profile-avatar-fallback-icon svg-icon svelte-qnbxxi\" aria-hidden=\"true\"></div>"), fe = x("<!> <!>", 1), pe = {
	hash: "svelte-qnbxxi",
	code: ".profile-avatar-initial.svelte-qnbxxi {display:block;width:100%;height:100%;border-radius:inherit;}.profile-avatar-fallback {display:flex;align-items:center;justify-content:center;width:100%;height:100%;opacity:1;.profile-avatar-fallback-icon.svelte-qnbxxi {mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:100%;height:100%;}}.profile-avatar-fallback[data-status=\"loading\"] {opacity:0;\n        animation: svelte-qnbxxi-profile-avatar-fallback-reveal 0s linear\n            var(--profile-avatar-fallback-delay, 120ms) forwards;}.profile-avatar-fallback[data-status=\"loaded\"] {opacity:0;\n        animation: none;}.profile-avatar-fallback[data-status=\"error\"] {opacity:1;\n        animation: none;}.profile-avatar-fallback[data-loading=\"true\"] {opacity:1;\n        animation: svelte-qnbxxi-profile-avatar-loading-pulse 1.6s ease-in-out infinite;}\n\n    @keyframes svelte-qnbxxi-profile-avatar-loading-pulse {\n        50% {\n            opacity: 0.4;\n        }\n    }\n\n    @media (prefers-reduced-motion: reduce) {.profile-avatar-fallback[data-loading=\"true\"] {\n            animation: none;outline:1px dotted currentColor;outline-offset:-1px;border-radius:50%;}\n    }\n\n    @keyframes svelte-qnbxxi-profile-avatar-fallback-reveal {\n        to {\n            opacity: 1;\n        }\n    }"
};
function me(r, o) {
	t(o, !0), y(r, pe);
	let c = S(o, "pubkeyHex", 3, ""), u = S(o, "displayName", 3, ""), h = S(o, "name", 3, ""), v = S(o, "src", 3, ""), x = S(o, "alt", 3, ""), w = S(o, "rootClassName", 3, ""), E = S(o, "imageClassName", 3, ""), O = S(o, "fallbackClassName", 3, ""), k = S(o, "fallbackAriaLabel", 3, "User"), A = S(o, "fallbackDelayMs", 3, 120), j = S(o, "preferInstantDisplay", 3, !0), M = S(o, "showLoadingIndicator", 3, !1), N = S(o, "pending", 3, !1), P = S(o, "loadingStatus", 3, void 0), F = S(o, "onLoadingStatusChange", 3, void 0), I = S(o, "crossorigin", 3, void 0), L = S(o, "referrerpolicy", 3, void 0), R = S(o, "delayMs", 3, 0), z = l(() => le({
		pubkeyHex: c(),
		displayName: u(),
		name: h()
	})), B = l(() => te(v())), V = l(() => I() ?? (C(B) && ee(C(B)) ? "anonymous" : void 0)), H = l(() => L() ?? (C(B) ? "no-referrer" : void 0)), U = D(_(P() === void 0 ? C(B) ? j() && !M() ? "loaded" : "loading" : "error" : P())), W = l(() => M() && (C(U) === "loading" || N() && !C(B))), G = l(() => (C(U) === "error" || C(W)) && !!k());
	function K(e) {
		C(U) !== e && (d(U, e, !0), F()?.(e));
	}
	function q(e) {
		P() === void 0 ? K(e) : F()?.(e);
	}
	function J() {
		P() === void 0 && K("loaded");
	}
	function Y() {
		P() === void 0 && K("error");
	}
	T(() => {
		let e = C(B) ? P() ?? (j() && !M() ? "loaded" : "loading") : "error";
		f(() => K(e));
	});
	var X = a(), Z = g(X);
	{
		let t = l(() => C(W) ? "true" : void 0);
		s(Z, () => ne, (n, r) => {
			r(n, {
				get class() {
					return w();
				},
				get loadingStatus() {
					return C(U);
				},
				onLoadingStatusChange: q,
				get delayMs() {
					return R();
				},
				get "aria-busy"() {
					return C(t);
				},
				children: (t, n) => {
					var r = fe(), o = g(r), c = (e) => {
						var t = a(), n = g(t);
						{
							let e = l(() => M() ? "eager" : "lazy");
							s(n, () => re, (t, n) => {
								n(t, {
									get src() {
										return C(B);
									},
									get alt() {
										return x();
									},
									get class() {
										return E();
									},
									get loading() {
										return C(e);
									},
									get crossorigin() {
										return C(V);
									},
									get referrerpolicy() {
										return C(H);
									},
									onload: J,
									onerror: Y
								});
							});
						}
						i(e, t);
					};
					e(o, (e) => {
						C(B) && e(c);
					});
					var u = b(o, 2);
					{
						let t = l(() => `profile-avatar-fallback ${O()}`), n = l(() => `--profile-avatar-fallback-delay: ${A()}ms;`), r = l(() => C(G) ? "img" : void 0), o = l(() => C(G) ? k() : void 0), c = l(() => C(G) ? void 0 : "true"), d = l(() => C(W) ? "true" : void 0);
						s(u, () => ie, (s, l) => {
							l(s, {
								get class() {
									return C(t);
								},
								get style() {
									return C(n);
								},
								get role() {
									return C(r);
								},
								get "aria-label"() {
									return C(o);
								},
								get "aria-hidden"() {
									return C(c);
								},
								get "data-loading"() {
									return C(d);
								},
								children: (t, n) => {
									var r = a(), o = g(r), s = (e) => {
										var t = ue();
										m(() => p(t, "src", C(z).dataUrl)), i(e, t);
									}, c = (e) => {
										var t = de();
										i(e, t);
									};
									e(o, (e) => {
										C(z) ? e(s) : e(c, -1);
									}), i(t, r);
								},
								$$slots: { default: !0 }
							});
						});
					}
					i(t, r);
				},
				$$slots: { default: !0 }
			});
		});
	}
	i(r, X), n();
}
export { me as t };
