import { _t as e, ht as t, pt as n, tt as r } from "./index-client-57Odq85c.js";
import { n as i } from "./relayConfigUtils-DD5f1UAM.js";
import { r as a } from "./authStore.svelte-BlvJ-J7q.js";
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
var f = null, p = e(n([])), m = e(null), h = e(null), g = e(!1), _ = e(0), v = {
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
		return r(p);
	},
	set: (e) => {
		t(p, e, !0);
	}
}, S = {
	get value() {
		return r(m);
	},
	set: (e) => {
		t(m, e, !0);
	}
}, C = {
	get value() {
		return r(h);
	},
	set: (e) => {
		t(h, e, !0);
	}
}, w = {
	get value() {
		return r(g);
	},
	set: (e) => {
		t(g, e, !0);
	}
}, T = {
	get value() {
		return r(_);
	},
	set: (e) => {
		t(_, e, !0);
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
	}, r(h) !== "host" && (S.set(null), x.set([]), C.set(null));
}
function k(e) {
	D(), s(e), S.set(e), x.set(i.extractWriteRelays(e)), C.set("host");
}
function A() {
	c(), r(h) === "host" && (D(), S.set(null), x.set([]), C.set(null));
}
async function j(e) {
	if (r(h) === "host") return;
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
	if (r(h) === "host" || !e || !a.value.isAuthenticated || a.value.pubkey !== e) return;
	let n = y(e);
	try {
		if (!b(n)) return;
		S.set(t), C.set("user");
		let e = i.extractWriteRelays(t);
		x.set(e), b(n) && T.set(r(_) + 1);
	} catch (e) {
		console.error("リレー設定の保存エラー:", e);
	}
}
export { j as a, T as c, E as d, x as f, d as h, w as i, O as l, l as m, A as n, C as o, u as p, D as r, S as s, k as t, M as u };
