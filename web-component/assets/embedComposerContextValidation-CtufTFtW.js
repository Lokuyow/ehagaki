import { a as e, d as t, f as n, n as r } from "./relayConfigUtils-DD5f1UAM.js";
import { t as i } from "./eventPointerUtils-CB-jfl2O.js";
import { n as a, o } from "./postHistoryEventUtils-CUIBkIiy.js";
import { a as s } from "./profilePictureUrlUtils-B7zGYkzO.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedComposerContextValidation.ts
var c = class extends Error {
	constructor() {
		super("invalid_composer_context"), this.name = "EmbedComposerContextValidationError";
	}
};
function l() {
	throw new c();
}
function u(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function d(e) {
	return /^[0-9a-f]{64}$/.test(e);
}
function f(e) {
	(typeof e != "string" || i(e, { relayValidation: "strict" }) === null) && l();
}
function p(e, t) {
	if (!Object.prototype.hasOwnProperty.call(e, t)) return;
	let n = e[t];
	n != null && (typeof n != "string" || n.trim().length === 0) && l();
}
function m(e) {
	if (e != null) {
		if (u(e) || l(), f(e.reference), e.relays !== void 0) {
			Array.isArray(e.relays) || l();
			for (let t of e.relays) (typeof t != "string" || r.sanitizeExternalRelayUrls([t], { limit: 1 }).length !== 1) && l();
		}
		p(e, "name"), p(e, "about");
	}
}
function h(e) {
	if (u(e) || l(), e.reply !== void 0 && e.reply !== null && f(e.reply), e.quotes !== void 0 && e.quotes !== null) {
		Array.isArray(e.quotes) || l();
		for (let t of e.quotes) f(t);
	}
	return e.content !== void 0 && e.content !== null && typeof e.content != "string" && l(), m(e.channel), e;
}
function g(r, i) {
	if (!u(r)) return {};
	let s = /* @__PURE__ */ new Map();
	for (let e of i) {
		let t = s.get(e.eventId);
		t ? t.push(e) : s.set(e.eventId, [e]);
	}
	let c = {};
	for (let [i, l] of s) try {
		if (!Object.prototype.hasOwnProperty.call(r, i)) continue;
		let s = r[i];
		if (!o(s)) continue;
		let u = a(s);
		if (!t(u) || e(u) !== u.id || !n(u) || u.id !== i || l.some((e) => e.authorPubkey !== null && u.pubkey !== e.authorPubkey)) continue;
		c[i] = a(u);
	} catch {
		continue;
	}
	return c;
}
function _(e) {
	if (!u(e)) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) {
		if (!d(n) || !u(r)) continue;
		let e = typeof r.displayName == "string" && r.displayName.trim() || null, i = typeof r.picture == "string" ? s(r.picture) : null;
		(e || i) && (t[n] = {
			displayName: e,
			picture: i
		});
	}
	return t;
}
export { g as n, h as r, _ as t };
