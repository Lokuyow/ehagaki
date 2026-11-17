import { gt as e, mt as t, nt as n, vt as r } from "./index-client-XkLzkVYC.js";
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
	!e || !t || !n ? console.warn("setNsecAuth: All parameters are required") : c({
		type: "nsec",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function d(e, t, n) {
	!e || !t || !n ? console.warn("setNip07Auth: All parameters are required") : c({
		type: "nip07",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function f(e, t, n) {
	!e || !t || !n ? console.warn("setNip46Auth: All parameters are required") : c({
		type: "nip46",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function p(e, t, n) {
	!e || !t || !n ? console.warn("setParentClientAuth: All parameters are required") : c({
		type: "parentClient",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function m() {
	c({ isInitialized: !0 });
}
var h = {
	get value() {
		return n(o);
	},
	set: (t) => {
		e(o, t, !0);
	}
}, g = r(t([])), _ = r(t(/* @__PURE__ */ new Map())), v = {
	get value() {
		return n(g);
	},
	set: (t) => {
		e(g, t, !0);
	}
}, y = {
	get value() {
		return n(_);
	},
	set: (t) => {
		e(_, t, !0);
	},
	setProfile: (t, r) => {
		e(_, new Map(n(_)), !0), n(_).set(t, r);
	}
};
export { h as a, f as c, l as i, u as l, y as n, m as o, s as r, d as s, v as t, p as u };
