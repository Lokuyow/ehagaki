import { n as e } from "./appRuntimeEnvironment-BvtUCHcA.js";
import { t } from "./rx-nostr-BHeS362x.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/customEmojiCachePersistenceUtils.ts
function n({ record: e, schemaVersion: t, normalizeItem: n, mergeItems: r }) {
	return !e?.meta || e.meta.schemaVersion !== t || !Array.isArray(e.items) ? [] : r([e.items.map((e, t) => n(e, t)).filter((e) => e !== null)]);
}
function r({ items: e, normalizeItem: t, mergeItems: n }) {
	return n([e.map((e, n) => t(e, n)).filter((e) => e !== null)]);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/customEmojiFetchUtils.ts
function i({ listEvent: e, setEvents: t, parseEmojiTags: n, getKind10030EmojiSetAddresses: r, parseEmojiSetAddress: i, mergeCustomEmojiItems: a }) {
	let o = n(e.tags, {
		sourceType: "kind10030",
		sourceAddress: null,
		startSortIndex: 0
	}), s = r(e);
	if (s.length === 0) return a([o]);
	let c = s.map((e) => i(e)).filter((e) => !!e), l = new Set(c.map((e) => e.address)), u = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.tags.find((e) => e[0] === "d")?.[1];
		if (!e.pubkey || !t) continue;
		let n = `30030:${e.pubkey}:${t}`;
		if (!l.has(n)) continue;
		let r = u.get(n);
		(!r || (e.created_at ?? 0) > (r.created_at ?? 0)) && u.set(n, e);
	}
	let d = o.length, f = [o];
	for (let e of s) {
		let t = n(u.get(e)?.tags ?? [], {
			setAddress: e,
			sourceType: "kind30030",
			sourceAddress: e,
			startSortIndex: d
		});
		d += t.length, f.push(t);
	}
	return a(f);
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/customEmojiPickerPersistenceUtils.ts
function a({ value: e, minHeight: t, viewportHeight: n = typeof window < "u" ? window.visualViewport?.height ?? window.innerHeight : 800, maxHeight: r }) {
	let i = Math.floor(n * .6);
	return Math.min(Math.max(t, Number.isFinite(r) ? Math.floor(r) : i), Math.max(t, Math.round(e)));
}
function o({ storage: e, storageKey: t, defaultHeight: n, clampHeight: r }) {
	let i = e.getItem(t), a = i === null ? NaN : Number(i);
	return r(Number.isFinite(a) ? a : n);
}
function s({ storage: e, storageKey: t, value: n, clampHeight: r }) {
	let i = r(n);
	return e.setItem(t, String(i)), i;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/customEmoji.ts
var c = "customEmojiPickerHeight", l = /^:[\p{L}\p{N}_+-]{1,64}:$/u;
function u(e) {
	return String(e ?? "").replace(/^:+|:+$/g, "").trim();
}
function d(e) {
	return u(e).toLowerCase();
}
function f(e) {
	return typeof e == "string" && l.test(e.trim());
}
function p(e) {
	return typeof e == "string" && e.trim() ? e.trim() : null;
}
function m(e) {
	return encodeURIComponent(e);
}
function h(e) {
	return [
		e.shortcodeLower,
		e.src,
		e.setAddress ?? ""
	].map(m).join("|");
}
function g(e, t) {
	return `${m(e)}|${t}`;
}
function _(e) {
	let t = u(e.shortcode), n = d(t);
	if (!t || !n || !x(e.src)) return null;
	let r = p(e.setAddress), i = p(e.sourceAddress), a = e.sourceType ?? "kind10030";
	return {
		identityKey: h({
			shortcodeLower: n,
			src: e.src,
			setAddress: r
		}),
		shortcode: t,
		shortcodeLower: n,
		src: e.src,
		setAddress: r,
		sortIndex: Number.isFinite(e.sortIndex) ? Math.max(0, Math.floor(e.sortIndex)) : 0,
		sourceType: a,
		sourceAddress: i
	};
}
function v(e, t) {
	let n = d(t);
	return n ? e.filter((e) => e.shortcodeLower === n) : [];
}
function y(e, t) {
	let n = v(e, t);
	return n.length === 1 ? n[0] : null;
}
function b(e, t, n = 30) {
	let r = d(t);
	if (!r || n <= 0) return [];
	let i = [], a = [];
	for (let t of e) if (t.shortcodeLower && (t.shortcodeLower.startsWith(r) ? i.push(t) : t.shortcodeLower.includes(r) && a.push(t), i.length >= n)) return i.slice(0, n);
	return [...i, ...a].slice(0, n);
}
function x(e) {
	if (typeof e != "string" || !e) return !1;
	try {
		let t = new URL(e);
		return t.protocol === "http:" || t.protocol === "https:";
	} catch {
		return !1;
	}
}
function S(e) {
	return typeof e == "string" || e === null ? {
		setAddress: e ?? null,
		sourceType: "kind10030",
		sourceAddress: null,
		startSortIndex: 0
	} : {
		setAddress: e?.setAddress ?? null,
		sourceType: e?.sourceType ?? "kind10030",
		sourceAddress: e?.sourceAddress ?? null,
		startSortIndex: e?.startSortIndex ?? 0
	};
}
function C(e, t) {
	let n = S(t), r = [];
	for (let t of e) {
		if (t[0] !== "emoji") continue;
		let e = _({
			shortcode: t[1],
			src: t[2],
			setAddress: n.setAddress ?? t[3] ?? null,
			sortIndex: n.startSortIndex + r.length,
			sourceType: n.sourceType,
			sourceAddress: n.sourceAddress
		});
		e && r.push(e);
	}
	return r;
}
function w(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of C(e)) t.has(n.shortcodeLower) || t.set(n.shortcodeLower, {
		shortcode: n.shortcode,
		shortcodeLower: n.shortcodeLower,
		url: n.src
	});
	return t;
}
function T(e) {
	if (typeof e != "string") return null;
	let [t, n, ...r] = e.split(":"), i = Number(t), a = r.join(":");
	return i !== 30030 || !n || !a ? null : {
		kind: i,
		pubkey: n,
		identifier: a,
		address: e
	};
}
function E(e) {
	if (!e?.tags) return [];
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e.tags) {
		if (r[0] !== "a") continue;
		let e = T(r[1]);
		e && !t.has(e.address) && (t.add(e.address), n.push(e.address));
	}
	return n;
}
function D(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) for (let e of r) {
		let r = O(e, n.length);
		r && !t.has(r.identityKey) && (t.add(r.identityKey), n.push({
			...r,
			sortIndex: n.length
		}));
	}
	return n;
}
function O(e, t = 0) {
	if (!e || typeof e != "object") return null;
	let n = e;
	return _({
		shortcode: n.shortcode,
		src: n.src,
		setAddress: n.setAddress,
		sortIndex: typeof n.sortIndex == "number" ? n.sortIndex : t,
		sourceType: n.sourceType,
		sourceAddress: n.sourceAddress
	});
}
async function k() {
	let { emojisRepository: e } = await import("./emojisRepository-DFkYYVBX.js");
	return e;
}
async function A(e, t) {
	if (!e) return [];
	try {
		return n({
			record: await (t ?? await k()).get(e),
			schemaVersion: 2,
			normalizeItem: O,
			mergeItems: D
		});
	} catch {
		return [];
	}
}
async function j(e, t, n) {
	if (!e) return;
	let i = r({
		items: t,
		normalizeItem: O,
		mergeItems: D
	});
	try {
		await (n ?? await k()).put(e, i);
	} catch {}
}
function M(e) {
	let { rxNostr: n, filter: r, timeoutMs: i = 4e3 } = e;
	return new Promise((e) => {
		let a = t(), o = [], s = !1, c, l, u = () => {
			l && clearTimeout(l), c?.unsubscribe?.(), c = void 0;
		}, d = () => {
			s || (s = !0, u(), e(o));
		};
		try {
			c = n.use(a).subscribe({
				next: (e) => {
					e?.event?.tags && o.push(e.event);
				},
				complete: d,
				error: d
			}), a.emit(r), a.over(), l = setTimeout(d, i);
		} catch {
			d();
		}
	});
}
function N(e) {
	return [...e].sort((e, t) => (t.created_at ?? 0) - (e.created_at ?? 0))[0] ?? null;
}
async function P(e) {
	let t = Math.floor(Date.now() / 1e3), n = N(await M({
		rxNostr: e.rxNostr,
		filter: {
			authors: [e.pubkey],
			kinds: [10030],
			limit: 1,
			until: t
		}
	}));
	if (!n) return [];
	let r = E(n);
	if (r.length === 0) return i({
		listEvent: n,
		setEvents: [],
		parseEmojiTags: C,
		getKind10030EmojiSetAddresses: E,
		parseEmojiSetAddress: T,
		mergeCustomEmojiItems: D
	});
	let a = r.map((e) => T(e)).filter((e) => !!e);
	return i({
		listEvent: n,
		setEvents: await M({
			rxNostr: e.rxNostr,
			filter: {
				kinds: [30030],
				authors: [...new Set(a.map((e) => e.pubkey))],
				"#d": [...new Set(a.map((e) => e.identifier))],
				until: t
			}
		}),
		parseEmojiTags: C,
		getKind10030EmojiSetAddresses: E,
		parseEmojiSetAddress: T,
		mergeCustomEmojiItems: D
	});
}
function F(e, t, n) {
	return o({
		storage: e,
		storageKey: c,
		defaultHeight: 240,
		clampHeight: (e) => I(e, t, n)
	});
}
function I(e, t = typeof window < "u" ? window.visualViewport?.height ?? window.innerHeight : 800, n) {
	return a({
		value: e,
		minHeight: 48,
		viewportHeight: t,
		maxHeight: n
	});
}
function L(e, t, n, r) {
	return s({
		storage: e,
		storageKey: c,
		value: t,
		clampHeight: (e) => I(e, n, r)
	});
}
function R(e, t = 300, n = 24) {
	let r = /* @__PURE__ */ new Set(), i = [];
	for (let n of e) {
		if (i.length >= t) break;
		x(n) && !r.has(n) && (r.add(n), i.push(n));
	}
	let a = [];
	for (let e = 0; e < i.length; e += n) a.push(i.slice(e, e + n));
	return a;
}
function z(e) {
	if (typeof window > "u") {
		setTimeout(e, 0);
		return;
	}
	let t = window.requestIdleCallback;
	typeof t == "function" ? t(e, { timeout: 2e3 }) : setTimeout(e, 0);
}
function B(t) {
	if (!e().serviceWorkerEnabled || typeof navigator > "u" || !navigator.serviceWorker?.controller) return;
	let n = R(t);
	if (!n.length) return;
	let r = 0, i = () => {
		let e = n[r];
		if (e) {
			try {
				navigator.serviceWorker?.controller?.postMessage({
					action: "cacheCustomEmojiImages",
					urls: e
				});
			} catch {}
			r++, r < n.length && z(i);
		}
	};
	z(i);
}
async function V(e, t = {}) {
	if (!x(e)) return { ready: !1 };
	let n = await U(e, t.createImage, t.signal);
	return n.ready && !t.signal?.aborted && H(e, t.cacheAfterLoad), n;
}
function H(e, t) {
	try {
		Promise.resolve((t ?? B)([e])).catch(() => {});
	} catch {}
}
async function U(e, t, n) {
	if (n?.aborted) return { ready: !1 };
	let r = t ?? (typeof Image < "u" ? () => new Image() : void 0);
	return r ? await new Promise((t) => {
		let i = r(), a = !1, o = (e) => {
			a || (a = !0, n?.removeEventListener("abort", s), i.onload = null, i.onerror = null, t(e));
		}, s = () => {
			o({ ready: !1 }), i.src = "";
		};
		n?.addEventListener("abort", s, { once: !0 }), i.decoding = "async", i.onload = () => {
			let e = W(i);
			o(e ? {
				ready: !0,
				...e
			} : { ready: !0 });
		}, i.onerror = () => o({ ready: !1 }), i.src = e;
	}) : { ready: !1 };
}
function W(e) {
	let t = Math.trunc(Number(e.naturalWidth)), n = Math.trunc(Number(e.naturalHeight));
	return !Number.isSafeInteger(t) || !Number.isSafeInteger(n) || t <= 0 || n <= 0 ? null : {
		width: t,
		height: n,
		aspectRatio: t / n
	};
}
export { L as _, P as a, f as c, d, T as f, j as g, F as h, g as i, x as l, A as m, B as n, y as o, V as p, h as r, b as s, w as t, u };
