import { l as e, n as t } from "./relayConfigUtils-DD5f1UAM.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/eventPointerUtils.ts
function n(e) {
	if (typeof e != "string" || !e.trim().includes("://")) return !1;
	try {
		let n = new URL(e.trim());
		return (n.protocol === "ws:" || n.protocol === "wss:") && !n.username && !n.password && t.normalizeExternalRelayUrl(e) !== null;
	} catch {
		return !1;
	}
}
function r(r, i = {}) {
	try {
		let a = e.decode(r);
		if (a.type === "nevent") {
			let e = a.data, r = Array.isArray(e.relays) ? e.relays : [];
			return i.relayValidation === "strict" && r.some((e) => !n(e)) ? null : {
				eventId: e.id,
				relayHints: t.sanitizeExternalRelayUrls(r.filter((e) => typeof e == "string"), { limit: t.EXTERNAL_INPUT_RELAY_LIMIT }),
				authorPubkey: e.author ?? null
			};
		}
		return a.type === "note" ? {
			eventId: a.data,
			relayHints: [],
			authorPubkey: null
		} : null;
	} catch {
		return null;
	}
}
export { r as t };
