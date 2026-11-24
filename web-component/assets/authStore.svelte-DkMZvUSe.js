import { _t as e, ht as t, rt as n, yt as r } from "./index-client-DEFG3Gqk.js";
// D:/ドキュメント/GitHub/ehagaki/src/stores/authStore.svelte.ts
var i = {
	type: "none",
	isAuthenticated: !1,
	pubkey: "",
	npub: "",
	nprofile: "",
	isValid: !1,
	isInitialized: !1,
	isExtensionLogin: !1
}, a = r(t({ ...i })), o = r(null), s = { get value() {
	return n(a) || i;
} };
function c(t) {
	let r = {
		...n(a),
		...t
	};
	r.isAuthenticated = r.type !== "none" && r.isValid, r.isExtensionLogin = r.type === "nip07", e(a, r, !0), r.type !== "nsec" && e(o, null), console.log("[updateAuthState] 認証状態を更新:", {
		type: r.type,
		isAuthenticated: r.isAuthenticated,
		isValid: r.isValid
	});
}
function l(t = !0) {
	e(a, {
		...i,
		isInitialized: t ? n(a).isInitialized : !1
	}, !0), e(o, null);
}
function u(e, t, n) {
	c({
		type: "npub",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function d(e, t, n) {
	!e || !t || !n ? console.warn("setNsecAuth: All parameters are required") : c({
		type: "nsec",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function f(e, t, n) {
	!e || !t || !n ? console.warn("setNip07Auth: All parameters are required") : c({
		type: "nip07",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function p(e, t, n) {
	!e || !t || !n ? console.warn("setNip46Auth: All parameters are required") : c({
		type: "nip46",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function m(e, t, n) {
	!e || !t || !n ? console.warn("setParentClientAuth: All parameters are required") : c({
		type: "parentClient",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function h() {
	c({ isInitialized: !0 });
}
var g = {
	get value() {
		return n(o);
	},
	set: (t) => {
		e(o, t, !0);
	}
}, _ = r(t([])), v = r(t(/* @__PURE__ */ new Map())), y = {
	get value() {
		return n(_);
	},
	set: (t) => {
		e(_, t, !0);
	}
}, b = {
	get value() {
		return n(v);
	},
	set: (t) => {
		e(v, t, !0);
	},
	setProfile: (t, r) => {
		e(v, new Map(n(v)), !0), n(v).set(t, r);
	}
};
export { g as a, p as c, u as d, l as i, d as l, b as n, h as o, s as r, f as s, y as t, m as u };
