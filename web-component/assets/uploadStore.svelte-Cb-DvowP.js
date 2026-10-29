import { _t as e, ht as t, kt as n, pt as r, tt as i } from "./index-client-57Odq85c.js";
// D:/ドキュメント/GitHub/ehagaki/src/stores/mediaGalleryStore.svelte.ts
var a = e(r([])), o = {
	get items() {
		return i(a);
	},
	addItem: (e) => {
		t(a, [...i(a), e], !0);
	},
	removeItem: (e) => {
		t(a, i(a).filter((t) => t.id !== e), !0);
	},
	updateItem: (e, n) => {
		t(a, i(a).map((t) => t.id === e ? {
			...t,
			...n
		} : t), !0);
	},
	reorderItems: (e, n) => {
		let r = [...i(a)], [o] = r.splice(e, 1);
		r.splice(n, 0, o), t(a, r, !0);
	},
	clearAll: () => {
		t(a, [], !0);
	},
	getItems: () => [...i(a)],
	getContentUrls: () => i(a).filter((e) => !e.isPlaceholder && e.src).map((e) => e.src),
	getImageBlurhashMap: () => {
		let e = {};
		for (let t of i(a)) !t.isPlaceholder && t.src && t.type === "image" && (e[t.src] = {
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
		for (let t of i(a)) !t.isPlaceholder && t.src && t.mimeType && (e[t.src] = {
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
	hasItems: () => i(a).length > 0,
	hasNonPlaceholderItems: () => i(a).some((e) => !e.isPlaceholder),
	removePlaceholders: () => {
		let e = i(a).filter((e) => e.isPlaceholder).map((e) => e.id);
		return e.length > 0 && t(a, i(a).filter((e) => !e.isPlaceholder), !0), e;
	}
}, s = r({
	content: "",
	hashtags: [],
	tags: []
}), ee = s;
function te() {
	return n(s);
}
r({});
var c = r({}), l = {
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
}, u = e(!1), ne = {
	get value() {
		return i(u);
	},
	set: (e) => {
		t(u, e, !0);
	},
	toggle: () => {
		t(u, !i(u));
	},
	reset: () => {
		t(u, !1);
	}
}, d = e(!1), f = e(""), p = {
	get value() {
		return i(d);
	},
	set: (e) => {
		t(d, e, !0);
	},
	toggle: () => {
		t(d, !i(d));
	},
	reset: () => {
		t(d, !1);
	}
}, m = {
	get value() {
		return i(f);
	},
	set: (e) => {
		t(f, e, !0);
	},
	reset: () => {
		t(f, "");
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
var x = e(r({
	info: null,
	visible: !1
})), S = {
	get value() {
		return i(x);
	},
	set: (e) => {
		t(x, e, !0);
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
var O = e(r(T())), k = {
	get value() {
		return i(O);
	},
	set: (e) => {
		t(O, e, !0);
	},
	reset: () => {
		D(), t(O, T(), !0), J.set(!1);
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
var M = e(null), N = null;
function P() {
	N !== null && (clearTimeout(N), N = null);
}
var F = {
	get value() {
		return i(M);
	},
	set: (e) => {
		t(M, e, !0);
	},
	clear: () => {
		P(), t(M, null);
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
var R = e(!1), z = {
	get value() {
		return i(R);
	},
	set: (e) => {
		t(R, e, !0);
	},
	reset: () => {
		t(R, !1);
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
var q = e(!1), J = {
	get value() {
		return i(q);
	},
	set: (e) => {
		t(q, e, !0);
	}
}, Y = e(0), X = {
	get value() {
		return i(Y);
	},
	set: (e) => {
		t(Y, e, !0);
	}
}, Z = e(0), Q = {
	get value() {
		return i(Z);
	},
	set: (e) => {
		t(Z, e, !0);
	}
}, $ = e(!1), ae = {
	get value() {
		return i($);
	},
	set: (e) => {
		t($, e, !0);
	}
};
export { o as C, l as S, m as _, ae as a, ee as b, C as c, V as d, F as f, v as g, X as h, S as i, ie as l, k as m, I as n, L as o, z as p, Q as r, W as s, K as t, A as u, p as v, ne as x, te as y };
