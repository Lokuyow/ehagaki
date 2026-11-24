import { a as e, m as t } from "./esm-N9TTQGcl.js";
import { n } from "./relayConfigUtils-56ujWwKF.js";
import { g as r } from "./clipboardUtils-CSGkJuUA.js";
import { n as i } from "./httpUrlCandidates-BckQw1dk.js";
import { n as a } from "./graphemeUtils-D37rBdTG.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/profileMention.ts
var o = "profileMention", s = "data-nostr-mention";
function c(n) {
	if (!/^(?:npub|nprofile)1/i.test(n) || n.length > 5e3) return null;
	try {
		let r = e.decode(n);
		if (r.type === "npub" && t(r.data)) return {
			pubkey: r.data,
			relayHints: []
		};
		if (r.type === "nprofile" && t(r.data.pubkey)) return {
			pubkey: r.data.pubkey,
			relayHints: l(r.data.relays)
		};
	} catch {}
	return null;
}
function l(e) {
	return n.sanitizeExternalRelayUrls(e, { limit: n.EXTERNAL_INPUT_RELAY_LIMIT }).filter((e) => /^[\x21-\x7e]{1,255}$/.test(e));
}
function u({ pubkey: t, relayHints: n }) {
	let r = l(n);
	return r.length ? e.nprofileEncode({
		pubkey: t,
		relays: r
	}) : e.npubEncode(t);
}
function d(e) {
	return `nostr:${u(e)}`;
}
function f(e) {
	return typeof e == "string" && /^nostr:/i.test(e) ? c(e.slice(6)) : null;
}
function p(e, t, n) {
	let r = f(e);
	if (!r) return "";
	let i = /\S$/.test(t) ? " " : "", a = /^[a-z0-9_]/i.test(n) ? " " : "";
	return `${i}${d(r)}${a}`;
}
function m(e) {
	let t = [];
	if (!/nostr:(?:npub|nprofile)1/i.test(e)) return t;
	let n = i(e).filter((e) => e.isValidHttpUrl), r = 0;
	for (let i of e.matchAll(/nostr:(?:npub|nprofile)1[a-z0-9]+/gi)) {
		let a = i.index, o = a + i[0].length;
		if (a > 0 && /[a-z0-9_]/i.test(e[a - 1]) || o < e.length && e[o] === "_") continue;
		for (; n[r] && n[r].end <= a;) r++;
		if (n[r] && n[r].start <= a) continue;
		let s = f(i[0]);
		s && t.push({
			...s,
			start: a,
			end: o
		});
	}
	return t;
}
function h(e, t) {
	return m(e.tags.find((e) => e[0] === "content-warning")?.[2] ?? e.content).some((e) => e.pubkey === t);
}
function g(e, t, n) {
	return t?.displayName?.trim() || t?.name?.trim() || n?.trim() || r(e);
}
function _(e) {
	let t = e.trim().replace(/\s+/g, " "), n = "", r = 0;
	for (let { segment: e } of a(t.slice(0, 129))) {
		if (r === 24 || n.length + e.length > 128) return `${n}…`;
		n += e, r++;
	}
	return n;
}
function v(e) {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length <= 320 && /^[a-z0-9._-]+@[^\s@]+$/i.test(t) ? t : null;
}
export { f as a, d as c, p as d, _ as f, h as i, v as l, o as n, c as o, u as r, g as s, s as t, m as u };
