import { o as e, p as t, r as n, t as r, u as i } from "./base-CVnVyhoG.js";
new TextDecoder("utf-8");
var a = new TextEncoder();
function o(e) {
	if (e.length !== 64) return !1;
	for (let t = 0; t < 64; t++) {
		let n = e.charCodeAt(t);
		if (isNaN(n) || n < 48 || n > 102 || n > 57 && n < 97) return !1;
	}
	return !0;
}
var s = Symbol("verified"), c = (e) => e instanceof Object;
function l(e) {
	if (!c(e) || typeof e.kind != "number" || typeof e.content != "string" || typeof e.created_at != "number" || typeof e.pubkey != "string" || !o(e.pubkey) || !Array.isArray(e.tags)) return !1;
	for (let t = 0; t < e.tags.length; t++) {
		let n = e.tags[t];
		if (!Array.isArray(n)) return !1;
		for (let e = 0; e < n.length; e++) if (typeof n[e] != "string") return !1;
	}
	return !0;
}
var u = class {
	generateSecretKey() {
		return n.utils.randomSecretKey();
	}
	getPublicKey(e) {
		return i(n.getPublicKey(e));
	}
	finalizeEvent(e, r) {
		let a = e;
		return a.pubkey = i(n.getPublicKey(r)), a.id = f(a), a.sig = i(n.sign(t(f(a)), r)), a[s] = !0, a;
	}
	verifyEvent(e) {
		if (typeof e[s] == "boolean") return e[s];
		try {
			let r = f(e);
			if (r !== e.id) return e[s] = !1, !1;
			let i = n.verify(t(e.sig), t(r), t(e.pubkey));
			return e[s] = i, i;
		} catch {
			return e[s] = !1, !1;
		}
	}
};
function d(e) {
	if (!l(e)) throw Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]);
}
function f(t) {
	let n = e(a.encode(d(t)));
	return i(n);
}
var p = new u();
p.generateSecretKey, p.getPublicKey, p.finalizeEvent, p.verifyEvent;
var m = 27235, h = "Nostr ";
async function g(e, t, n, i = !1, o) {
	let s = {
		kind: m,
		tags: [["u", e], ["method", t]],
		created_at: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
		content: ""
	};
	o && s.tags.push(["payload", _(o)]);
	let c = await n(s);
	return (i ? h : "") + r.encode(a.encode(JSON.stringify(c)));
}
function _(t) {
	let n = e(a.encode(JSON.stringify(t)));
	return i(n);
}
export { g as getToken };
