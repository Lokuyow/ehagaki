import { et as e, ft as t, gt as n, mt as r } from "./index-client-Bdka-Daw.js";
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
}, a = n(t({ ...i })), o = { get value() {
	return e(a) || i;
} };
function s(t) {
	let n = {
		...e(a),
		...t
	};
	n.isAuthenticated = n.type !== "none" && n.isValid, n.isExtensionLogin = n.type === "nip07", r(a, n, !0), console.log("[updateAuthState] 認証状態を更新:", {
		type: n.type,
		isAuthenticated: n.isAuthenticated,
		isValid: n.isValid
	});
}
function c(t = !0) {
	r(a, {
		...i,
		isInitialized: t ? e(a).isInitialized : !1
	}, !0);
}
function l(e, t, n) {
	!e || !t || !n ? console.warn("setNsecAuth: All parameters are required") : s({
		type: "nsec",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function u(e, t, n) {
	!e || !t || !n ? console.warn("setNip07Auth: All parameters are required") : s({
		type: "nip07",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function d(e, t, n) {
	!e || !t || !n ? console.warn("setNip46Auth: All parameters are required") : s({
		type: "nip46",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function f(e, t, n) {
	!e || !t || !n ? console.warn("setParentClientAuth: All parameters are required") : s({
		type: "parentClient",
		pubkey: e,
		npub: t,
		nprofile: n,
		isValid: !0
	});
}
function p() {
	s({ isInitialized: !0 });
}
var m = n(null), h = {
	get value() {
		return e(m);
	},
	set: (e) => {
		r(m, e, !0);
	}
}, g = n(t([])), _ = n(t(/* @__PURE__ */ new Map())), v = {
	get value() {
		return e(g);
	},
	set: (e) => {
		r(g, e, !0);
	}
}, y = {
	get value() {
		return e(_);
	},
	set: (e) => {
		r(_, e, !0);
	},
	setProfile: (t, n) => {
		r(_, new Map(e(_)), !0), e(_).set(t, n);
	}
};
export { h as a, d as c, c as i, l, y as n, p as o, o as r, u as s, v as t, f as u };
