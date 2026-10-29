import { _t as e, ht as t, pt as n, tt as r } from "./index-client-57Odq85c.js";
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
}, a = e(n({ ...i })), o = { get value() {
	return r(a) || i;
} };
function s(e) {
	let n = {
		...r(a),
		...e
	};
	n.isAuthenticated = n.type !== "none" && n.isValid, n.isExtensionLogin = n.type === "nip07", t(a, n, !0), console.log("[updateAuthState] 認証状態を更新:", {
		type: n.type,
		isAuthenticated: n.isAuthenticated,
		isValid: n.isValid
	});
}
function c(e = !0) {
	t(a, {
		...i,
		isInitialized: e ? r(a).isInitialized : !1
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
var m = e(null), h = {
	get value() {
		return r(m);
	},
	set: (e) => {
		t(m, e, !0);
	}
}, g = e(n([])), _ = e(n(/* @__PURE__ */ new Map())), v = {
	get value() {
		return r(g);
	},
	set: (e) => {
		t(g, e, !0);
	}
}, y = {
	get value() {
		return r(_);
	},
	set: (e) => {
		t(_, e, !0);
	},
	setProfile: (e, n) => {
		t(_, new Map(r(_)), !0), r(_).set(e, n);
	}
};
export { h as a, d as c, c as i, l, y as n, p as o, o as r, u as s, v as t, f as u };
