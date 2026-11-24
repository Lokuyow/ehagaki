import { t as e } from "./typeGuards-ClT_Na6K.js";
import { c as t, m as n, s as r, t as i } from "./esm-N9TTQGcl.js";
import { n as a } from "./relayConfigUtils-56ujWwKF.js";
import { t as o } from "./eventPointerUtils-Da3hIAIl.js";
import { n as s, s as c } from "./postHistoryEventUtils-iuP8QpIA.js";
import { a as l } from "./profilePictureUrlUtils-B7zGYkzO.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/embedComposerContextValidation.ts
var u = class extends Error {
	constructor() {
		super("invalid_composer_context"), this.name = "EmbedComposerContextValidationError";
	}
};
function d() {
	throw new u();
}
function f(e) {
	return n(e);
}
function p(e) {
	(typeof e != "string" || o(e, { relayValidation: "strict" }) === null) && d();
}
function m(e, t) {
	if (!Object.prototype.hasOwnProperty.call(e, t)) return;
	let n = e[t];
	n != null && (typeof n != "string" || n.trim().length === 0) && d();
}
function h(t) {
	if (t != null) {
		if (e(t) || d(), p(t.reference), t.relays !== void 0) {
			Array.isArray(t.relays) || d();
			for (let e of t.relays) (typeof e != "string" || a.sanitizeExternalRelayUrls([e], { limit: 1 }).length !== 1) && d();
		}
		m(t, "name"), m(t, "about");
	}
}
function g(t) {
	if (e(t) || d(), t.reply !== void 0 && t.reply !== null && p(t.reply), t.quotes !== void 0 && t.quotes !== null) {
		Array.isArray(t.quotes) || d();
		for (let e of t.quotes) p(e);
	}
	return t.content !== void 0 && t.content !== null && typeof t.content != "string" && d(), h(t.channel), t;
}
function _(n, a) {
	if (!e(n)) return {};
	let o = /* @__PURE__ */ new Map();
	for (let e of a) {
		let t = o.get(e.eventId);
		t ? t.push(e) : o.set(e.eventId, [e]);
	}
	let l = {};
	for (let [e, a] of o) try {
		if (!Object.prototype.hasOwnProperty.call(n, e)) continue;
		let o = n[e];
		if (!c(o)) continue;
		let u = s(o);
		if (!r(u) || i(u) !== u.id || !t(u) || u.id !== e || a.some((e) => e.authorPubkey !== null && u.pubkey !== e.authorPubkey)) continue;
		l[e] = s(u);
	} catch {
		continue;
	}
	return l;
}
function v(t) {
	if (!e(t)) return {};
	let n = {};
	for (let [r, i] of Object.entries(t)) {
		if (!f(r) || !e(i)) continue;
		let t = typeof i.displayName == "string" && i.displayName.trim() || null, a = typeof i.picture == "string" ? l(i.picture) : null;
		(t || a) && (n[r] = {
			displayName: t,
			picture: a
		});
	}
	return n;
}
export { _ as n, g as r, v as t };
