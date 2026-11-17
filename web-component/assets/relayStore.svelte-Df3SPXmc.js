import { gt as e, mt as t, nt as n, vt as r } from "./index-client-XkLzkVYC.js";
import { n as i } from "./relayConfigUtils-B4Q_AO1M.js";
import { r as a } from "./authStore.svelte-DWJhnXxr.js";
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
var f = null, p = r(t([])), m = r(null), h = r(null), g = r(!1), _ = r(0), v = {
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
		return n(p);
	},
	set: (t) => {
		e(p, t, !0);
	}
}, S = {
	get value() {
		return n(m);
	},
	set: (t) => {
		e(m, t, !0);
	}
}, C = {
	get value() {
		return n(h);
	},
	set: (t) => {
		e(h, t, !0);
	}
}, w = {
	get value() {
		return n(g);
	},
	set: (t) => {
		e(g, t, !0);
	}
}, T = {
	get value() {
		return n(_);
	},
	set: (t) => {
		e(_, t, !0);
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
	}, n(h) !== "host" && (S.set(null), x.set([]), C.set(null));
}
function k(e) {
	D(), s(e), S.set(e), x.set(i.extractWriteRelays(e)), C.set("host");
}
function A() {
	c(), n(h) === "host" && (D(), S.set(null), x.set([]), C.set(null));
}
async function j(e) {
	if (n(h) === "host") return;
	if (!f || !e) {
		O();
		return;
	}
	let t = y(e);
	try {
		let n = await f.loadRelayConfigForUI(e);
		if (!b(t)) return;
		if (!n) {
			S.set(null), x.set([]);
			return;
		}
		S.set(n.relayConfig), x.set(n.writeRelays), C.set("user");
	} catch (e) {
		if (!b(t)) return;
		throw e;
	}
}
async function M(e, t) {
	if (n(h) === "host" || !e || !a.value.isAuthenticated || a.value.pubkey !== e) return;
	let r = y(e);
	try {
		if (!b(r)) return;
		S.set(t), C.set("user");
		let e = i.extractWriteRelays(t);
		x.set(e), b(r) && T.set(n(_) + 1);
	} catch (e) {
		console.error("リレー設定の保存エラー:", e);
	}
}
export { j as a, T as c, E as d, x as f, d as h, w as i, O as l, l as m, A as n, C as o, u as p, D as r, S as s, k as t, M as u };
