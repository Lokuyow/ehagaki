import { _t as e, ht as t, tt as n } from "./index-client-57Odq85c.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/videoCompression/videoCompressionConfig.ts
function r(e) {
	return !("skip" in e);
}
var i = 204800, a = {
	none: { skip: !0 },
	high: {
		maxSize: 1280,
		qualityPreset: "high"
	},
	medium: {
		maxSize: 640,
		audioSampleRate: 44100,
		qualityPreset: "medium"
	},
	low: {
		maxSize: 320,
		audioSampleRate: 44100,
		audioChannels: 1,
		qualityPreset: "low"
	}
};
// D:/ドキュメント/GitHub/ehagaki/src/lib/swUpdateDetectionUtils.ts
function o(e, t = () => {}) {
	let n = !1, r = !1;
	return {
		markAccepted() {
			n = !0;
		},
		handleControlChange() {
			return r ? "ignored" : (r = !0, n ? (n = !1, e(), "reloaded") : (t(), "stale"));
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/staleAssetReloadStore.svelte.ts
var s = e(!1), c = e(0), l = {
	get required() {
		return n(s);
	},
	get promptRevision() {
		return n(c);
	}
};
function u() {
	return !n(s) && (t(s, !0), !0);
}
function d() {
	return t(c, n(c) + 1), n(c);
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/swStore.svelte.ts
var f = /* @__PURE__ */ new Set(), p = "idle", m = /* @__PURE__ */ new Set(), h = !1, g = /* @__PURE__ */ new Set(), _ = o(() => window.location.reload(), () => {
	u() && d();
});
function v(e) {
	(p !== "ready" || e !== "installing") && p !== e && (p = e, f.forEach((t) => t(e)), x());
}
function y(e) {
	h !== e && (h = e, m.forEach((t) => t(e)), x());
}
function b() {
	return p !== "idle" || h;
}
function x() {
	let e = b();
	g.forEach((t) => t(e));
}
var S = {
	subscribe(e) {
		return e(p), f.add(e), () => f.delete(e);
	},
	set: v
}, C = {
	subscribe(e) {
		return e(b()), g.add(e), () => g.delete(e);
	},
	set(e) {
		v(e ? "ready" : "idle");
	}
}, w = {
	subscribe(e) {
		return e(h), m.add(e), () => m.delete(e);
	},
	set: y
}, T = () => void 0;
function E(e) {
	return T(e);
}
var D = e(null), O = {
	get value() {
		return n(D);
	},
	set: (e) => {
		t(D, e, !0);
	}
};
function k() {
	return l.required ? (d(), Promise.resolve()) : (_.markAccepted(), E(!0));
}
function A() {
	return Promise.resolve(null);
}
export { S as a, l as c, r as d, C as i, i as l, A as n, O as o, k as r, d as s, w as t, a as u };
