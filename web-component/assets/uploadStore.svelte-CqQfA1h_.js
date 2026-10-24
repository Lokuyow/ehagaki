import { Ot as e, et as t, ft as n, gt as r, mt as i } from "./index-client-Bdka-Daw.js";
// D:/ドキュメント/GitHub/ehagaki/src/stores/mediaGalleryStore.svelte.ts
var a = r(n([])), o = {
	get items() {
		return t(a);
	},
	addItem: (e) => {
		i(a, [...t(a), e], !0);
	},
	removeItem: (e) => {
		i(a, t(a).filter((t) => t.id !== e), !0);
	},
	updateItem: (e, n) => {
		i(a, t(a).map((t) => t.id === e ? {
			...t,
			...n
		} : t), !0);
	},
	reorderItems: (e, n) => {
		let r = [...t(a)], [o] = r.splice(e, 1);
		r.splice(n, 0, o), i(a, r, !0);
	},
	clearAll: () => {
		i(a, [], !0);
	},
	getItems: () => [...t(a)],
	getContentUrls: () => t(a).filter((e) => !e.isPlaceholder && e.src).map((e) => e.src),
	getImageBlurhashMap: () => {
		let e = {};
		for (let n of t(a)) !n.isPlaceholder && n.src && n.type === "image" && (e[n.src] = {
			m: n.mimeType || "image/jpeg",
			blurhash: n.blurhash,
			ox: n.ox,
			x: n.x,
			dim: n.dim,
			alt: n.alt,
			size: n.size,
			uploadProtocol: n.uploadProtocol
		});
		return e;
	},
	getMediaImetaMap: () => {
		let e = {};
		for (let n of t(a)) !n.isPlaceholder && n.src && n.mimeType && (e[n.src] = {
			m: n.mimeType,
			blurhash: n.blurhash,
			ox: n.ox,
			x: n.x,
			dim: n.dim,
			alt: n.alt,
			size: n.size,
			uploadProtocol: n.uploadProtocol
		});
		return e;
	},
	hasItems: () => t(a).length > 0,
	hasNonPlaceholderItems: () => t(a).some((e) => !e.isPlaceholder),
	removePlaceholders: () => {
		let e = t(a).filter((e) => e.isPlaceholder).map((e) => e.id);
		return e.length > 0 && i(a, t(a).filter((e) => !e.isPlaceholder), !0), e;
	}
}, s = n({
	content: "",
	hashtags: [],
	tags: []
}), ee = s;
function te() {
	return e(s);
}
n({});
var c = n({}), l = {
	get value() {
		return c;
	},
	set: (e) => {
		Object.assign(c, e);
	},
	update: (e) => {
		let t = e(c);
		Object.assign(c, t);
	}
}, u = r(!1), ne = {
	get value() {
		return t(u);
	},
	set: (e) => {
		i(u, e, !0);
	},
	toggle: () => {
		i(u, !t(u));
	},
	reset: () => {
		i(u, !1);
	}
}, d = r(!1), f = r(""), p = {
	get value() {
		return t(d);
	},
	set: (e) => {
		i(d, e, !0);
	},
	toggle: () => {
		i(d, !t(d));
	},
	reset: () => {
		i(d, !1);
	}
}, m = {
	get value() {
		return t(f);
	},
	set: (e) => {
		i(f, e, !0);
	},
	reset: () => {
		i(f, "");
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/fileSizeUtils.ts
function h(e, t) {
	return t ? `${(e / 1048576).toFixed(2)}MB` : `${Math.round(e / 1024)}KB`;
}
function g(e, t) {
	if (e <= 0) return 100;
	let n = t / e * 100;
	return Number(n.toPrecision(2));
}
function _(e, t) {
	let n = e / 1024 >= 1e3;
	return `${h(e, n)} → ${h(t, n)}`;
}
function v(e, t, n, r, i, a) {
	return {
		originalSize: e,
		compressedSize: t,
		wasCompressed: n,
		compressionRatio: g(e, t),
		sizeReduction: _(e, t),
		originalFilename: r,
		compressedFilename: i,
		wasSkipped: a
	};
}
function y(e) {
	return e.wasCompressed || e.originalFilename !== e.compressedFilename || e.originalSize !== e.compressedSize || !!e.wasSkipped;
}
function b(e) {
	if (!e || !y(e)) return null;
	let t = e.originalSize / 1024 >= 1e3;
	return {
		wasCompressed: e.wasCompressed,
		originalSize: h(e.originalSize, t),
		compressedSize: h(e.compressedSize, t),
		compressionRatio: e.compressionRatio,
		originalFilename: e.originalFilename,
		compressedFilename: e.compressedFilename,
		wasSkipped: e.wasSkipped
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/uploadStore.svelte.ts
var x = r(n({
	info: null,
	visible: !1
})), S = {
	get value() {
		return t(x);
	},
	set: (e) => {
		i(x, e, !0);
	}
};
function re(e) {
	e === null ? w() : S.set({
		info: e,
		visible: !0
	});
}
function C(e) {
	re(b(e));
}
function w() {
	S.set({
		info: null,
		visible: !1
	});
}
function T() {
	return {
		total: 0,
		completed: 0,
		failed: 0,
		aborted: 0,
		inProgress: !1
	};
}
var E = null;
function D() {
	E !== null && (clearTimeout(E), E = null);
}
var O = r(n(T())), k = {
	get value() {
		return t(O);
	},
	set: (e) => {
		i(O, e, !0);
	},
	reset: () => {
		D(), i(O, T(), !0), J.set(!1);
	}
};
function A(e) {
	D(), k.set(e), J.set(e.inProgress), !e.inProgress && e.total > 0 && (E = setTimeout(() => {
		k.reset();
	}, 1e3));
}
function j() {
	k.reset();
}
var M = r(null), N = null;
function P() {
	N !== null && (clearTimeout(N), N = null);
}
var F = {
	get value() {
		return t(M);
	},
	set: (e) => {
		i(M, e, !0);
	},
	clear: () => {
		P(), i(M, null);
	}
};
function ie(e, t) {
	P(), F.set(e), e && t && t > 0 && (N = setTimeout(() => {
		F.clear();
	}, t));
}
function I() {
	F.clear();
}
function L(e) {
	e?.imageSizeInfoOnly ? w() : (j(), X.set(0), Q.set(0), w(), I());
}
var R = r(!1), z = {
	get value() {
		return t(R);
	},
	set: (e) => {
		i(R, e, !0);
	},
	reset: () => {
		i(R, !1);
	}
}, B = null;
function V(e) {
	B = e;
}
function H() {
	z.set(!0), B && B.abort?.(), X.set(0);
}
var U = null;
function W(e) {
	U = e;
}
function G() {
	z.set(!0), U && U.abort?.(), Q.set(0);
}
function K() {
	L(), H(), G();
	let e = o.removePlaceholders();
	e.length > 0 && l.update((t) => {
		let n = { ...t };
		for (let t of e) delete n[t];
		return n;
	});
}
var q = r(!1), J = {
	get value() {
		return t(q);
	},
	set: (e) => {
		i(q, e, !0);
	}
}, Y = r(0), X = {
	get value() {
		return t(Y);
	},
	set: (e) => {
		i(Y, e, !0);
	}
}, Z = r(0), Q = {
	get value() {
		return t(Z);
	},
	set: (e) => {
		i(Z, e, !0);
	}
}, $ = r(!1), ae = {
	get value() {
		return t($);
	},
	set: (e) => {
		i($, e, !0);
	}
};
export { o as C, l as S, m as _, ae as a, ee as b, C as c, V as d, F as f, v as g, X as h, S as i, ie as l, k as m, I as n, L as o, z as p, Q as r, W as s, K as t, A as u, p as v, ne as x, te as y };
