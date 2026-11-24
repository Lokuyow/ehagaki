import { _t as e, ht as t, jt as n, rt as r, yt as i } from "./index-client-DEFG3Gqk.js";
// D:/ドキュメント/GitHub/ehagaki/src/stores/mediaGalleryStore.svelte.ts
var a = i(t([])), o = {
	get items() {
		return r(a);
	},
	addItem: (t) => {
		e(a, [...r(a), t], !0);
	},
	removeItem: (t) => {
		e(a, r(a).filter((e) => e.id !== t), !0);
	},
	updateItem: (t, n) => {
		e(a, r(a).map((e) => e.id === t ? {
			...e,
			...n
		} : e), !0);
	},
	reorderItems: (t, n) => {
		let i = [...r(a)], [o] = i.splice(t, 1);
		i.splice(n, 0, o), e(a, i, !0);
	},
	clearAll: () => {
		e(a, [], !0);
	},
	getItems: () => [...r(a)],
	getContentUrls: () => r(a).filter((e) => !e.isPlaceholder && e.src).map((e) => e.src),
	getImageBlurhashMap: () => {
		let e = {};
		for (let t of r(a)) !t.isPlaceholder && t.src && t.type === "image" && (e[t.src] = {
			m: t.mimeType || "image/jpeg",
			blurhash: t.blurhash,
			ox: t.ox,
			x: t.x,
			dim: t.dim,
			alt: t.alt,
			size: t.size,
			uploadProtocol: t.uploadProtocol
		});
		return e;
	},
	getMediaImetaMap: () => {
		let e = {};
		for (let t of r(a)) !t.isPlaceholder && t.src && t.mimeType && (e[t.src] = {
			m: t.mimeType,
			blurhash: t.blurhash,
			ox: t.ox,
			x: t.x,
			dim: t.dim,
			alt: t.alt,
			size: t.size,
			uploadProtocol: t.uploadProtocol
		});
		return e;
	},
	hasItems: () => r(a).length > 0,
	hasNonPlaceholderItems: () => r(a).some((e) => !e.isPlaceholder),
	removePlaceholders: () => {
		let t = r(a).filter((e) => e.isPlaceholder).map((e) => e.id);
		return t.length > 0 && e(a, r(a).filter((e) => !e.isPlaceholder), !0), t;
	}
}, s = t({
	content: "",
	hashtags: [],
	tags: []
}), ee = s;
function te() {
	return n(s);
}
var c = t({}), l = {
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
}, u = i(!1), ne = {
	get value() {
		return r(u);
	},
	set: (t) => {
		e(u, t, !0);
	},
	toggle: () => {
		e(u, !r(u));
	},
	reset: () => {
		e(u, !1);
	}
}, d = i(!1), f = i(""), p = {
	get value() {
		return r(d);
	},
	set: (t) => {
		e(d, t, !0);
	},
	toggle: () => {
		e(d, !r(d));
	},
	reset: () => {
		e(d, !1);
	}
}, m = {
	get value() {
		return r(f);
	},
	set: (t) => {
		e(f, t, !0);
	},
	reset: () => {
		e(f, "");
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
var x = i(t({
	info: null,
	visible: !1
})), S = {
	get value() {
		return r(x);
	},
	set: (t) => {
		e(x, t, !0);
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
var O = i(t(T())), k = {
	get value() {
		return r(O);
	},
	set: (t) => {
		e(O, t, !0);
	},
	reset: () => {
		D(), e(O, T(), !0), J.set(!1);
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
var M = i(null), N = null;
function P() {
	N !== null && (clearTimeout(N), N = null);
}
var F = {
	get value() {
		return r(M);
	},
	set: (t) => {
		e(M, t, !0);
	},
	clear: () => {
		P(), e(M, null);
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
var R = i(!1), z = {
	get value() {
		return r(R);
	},
	set: (t) => {
		e(R, t, !0);
	},
	reset: () => {
		e(R, !1);
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
var q = i(!1), J = {
	get value() {
		return r(q);
	},
	set: (t) => {
		e(q, t, !0);
	}
}, Y = i(0), X = {
	get value() {
		return r(Y);
	},
	set: (t) => {
		e(Y, t, !0);
	}
}, Z = i(0), Q = {
	get value() {
		return r(Z);
	},
	set: (t) => {
		e(Z, t, !0);
	}
}, $ = i(!1), ae = {
	get value() {
		return r($);
	},
	set: (t) => {
		e($, t, !0);
	}
};
export { o as C, l as S, m as _, ae as a, ee as b, C as c, V as d, F as f, v as g, X as h, S as i, ie as l, k as m, I as n, L as o, z as p, Q as r, W as s, K as t, A as u, p as v, ne as x, te as y };
