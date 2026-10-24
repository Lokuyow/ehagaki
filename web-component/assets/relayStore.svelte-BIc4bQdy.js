import { et as e, ft as t, gt as n, mt as r } from "./index-client-Bdka-Daw.js";
import { n as i } from "./relayConfigUtils-DD5f1UAM.js";
import { r as a } from "./authStore.svelte-CoGdd5_Z.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hostRelayRuntime.ts
var o = null;
function s(e) {
	o = e;
}
function c() {
	o = null;
}
function l() {
	return o !== null;
}
function u() {
	return o ? i.sanitizeExternalRelayUrls(i.extractReadRelays(o)) : [];
}
function d(e, t) {
	if (!l()) return null;
	let n = i.sanitizeExternalRelayUrls(e, { limit: t });
	return i.sanitizeExternalRelayUrls([...u(), ...n]);
}
// D:/ドキュメント/GitHub/ehagaki/src/stores/relayStore.svelte.ts
var f = null, p = n(t([])), m = n(null), h = n(null), g = n(!1), _ = n(0), v = {
	pubkeyHex: null,
	generation: 0
};
function y(e) {
	return v = {
		pubkeyHex: e,
		generation: v.generation + 1
	}, v;
}
function b(e) {
	return v.pubkeyHex === e.pubkeyHex && v.generation === e.generation && a.value.isAuthenticated && a.value.pubkey === e.pubkeyHex;
}
var x = {
	get value() {
		return e(p);
	},
	set: (e) => {
		r(p, e, !0);
	}
}, S = {
	get value() {
		return e(m);
	},
	set: (e) => {
		r(m, e, !0);
	}
}, C = {
	get value() {
		return e(h);
	},
	set: (e) => {
		r(h, e, !0);
	}
}, w = {
	get value() {
		return e(g);
	},
	set: (e) => {
		r(g, e, !0);
	}
}, T = {
	get value() {
		return e(_);
	},
	set: (e) => {
		r(_, e, !0);
	}
};
function E(e) {
	f = e;
}
function D() {
	v = {
		...v,
		generation: v.generation + 1
	};
}
function O() {
	D(), v = {
		pubkeyHex: null,
		generation: v.generation
	}, e(h) !== "host" && (S.set(null), x.set([]), C.set(null));
}
function k(e) {
	D(), s(e), S.set(e), x.set(i.extractWriteRelays(e)), C.set("host");
}
function A() {
	c(), e(h) === "host" && (D(), S.set(null), x.set([]), C.set(null));
}
async function j(t) {
	if (e(h) === "host") return;
	if (!f || !t) {
		O();
		return;
	}
	let n = y(t);
	try {
		let e = await f.loadRelayConfigForUI(t);
		if (!b(n)) return;
		if (!e) {
			S.set(null), x.set([]);
			return;
		}
		S.set(e.relayConfig), x.set(e.writeRelays), C.set("user");
	} catch (e) {
		if (!b(n)) return;
		throw e;
	}
}
async function M(t, n) {
	if (e(h) === "host" || !t || !a.value.isAuthenticated || a.value.pubkey !== t) return;
	let r = y(t);
	try {
		if (!b(r)) return;
		S.set(n), C.set("user");
		let t = i.extractWriteRelays(n);
		x.set(t), b(r) && T.set(e(_) + 1);
	} catch (e) {
		console.error("リレー設定の保存エラー:", e);
	}
}
export { j as a, T as c, E as d, x as f, d as h, w as i, O as l, l as m, A as n, C as o, u as p, D as r, S as s, k as t, M as u };
