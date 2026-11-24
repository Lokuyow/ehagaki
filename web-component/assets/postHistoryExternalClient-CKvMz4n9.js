import { a as e } from "./esm-N9TTQGcl.js";
import { U as t, W as n } from "./appUtils-B3-zUpkb.js";
import { b as r } from "./clipboardUtils-CSGkJuUA.js";
import { r as i } from "./profileMention-C2raJMGE.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryNevent.ts
function a(e, t = []) {
	return r({
		eventId: e.eventId,
		authorPubkey: e.pubkeyHex,
		kind: e.kind,
		acceptedRelays: e.acceptedRelays,
		relayHints: e.relayHints,
		writeRelays: t
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryExternalClient.ts
var o = {
	nostter: "nostter",
	jumble: "Jumble",
	primal: "Primal",
	njump: "njump",
	lumilumi: "Lumilumi",
	custom: ""
};
function s(e) {
	return e.client === "custom" ? n(e.customUrlTemplate) : t[e.client];
}
function c(e, t) {
	if (!t) return null;
	let n = s(e);
	if (!n) return null;
	let r = n.replace("{nevent}", t);
	try {
		return new URL(r).protocol === "https:" ? r : null;
	} catch {
		return null;
	}
}
function l(e, t, n = []) {
	return c(t, a(e, n));
}
function u(t, n) {
	if (n.client === "primal") return `https://primal.net/p/${e.npubEncode(t.pubkey)}`;
	let r = i(t);
	return n.client === "jumble" ? `https://jumble.social/users/${r}` : c(n, n.client === "lumilumi" ? e.npubEncode(t.pubkey) : r) ?? `https://njump.me/${r}`;
}
function d(e, t, n) {
	if (!e) return null;
	switch (t.client) {
		case "nostter": return `https://nostter.app/search?q=${encodeURIComponent(`#${e}`)}`;
		case "jumble": return `https://jumble.social/notes?t=${encodeURIComponent(e.toLowerCase())}`;
		case "lumilumi": return `https://lumilumi.app/search?q=${encodeURIComponent(`t:${e} kind:${n || 1}`)}`;
		case "primal": return `https://primal.net/search/${encodeURIComponent(`#${e}`)}`;
		default: return null;
	}
}
function f(e) {
	if (e.client !== "custom") return o[e.client];
	let t = s(e);
	if (!t) return null;
	try {
		return new URL(t).hostname || null;
	} catch {
		return null;
	}
}
export { a, f as i, l as n, u as r, d as t };
