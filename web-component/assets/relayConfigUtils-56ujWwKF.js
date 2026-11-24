new TextDecoder("utf-8"), new TextEncoder();
function e(e) {
	try {
		e.indexOf("://") === -1 && (e = "wss://" + e);
		let t = new URL(e);
		return t.protocol === "http:" ? t.protocol = "ws:" : t.protocol === "https:" && (t.protocol = "wss:"), t.pathname = t.pathname.replace(/\/+/g, "/"), t.pathname.endsWith("/") && (t.pathname = t.pathname.slice(0, -1)), (t.port === "80" && t.protocol === "ws:" || t.port === "443" && t.protocol === "wss:") && (t.port = ""), t.searchParams.sort(), t.hash = "", t.toString();
	} catch {
		throw Error(`Invalid URL: ${e}`);
	}
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relayLists.ts
var t = [
	"wss://purplepag.es/",
	"wss://directory.yabu.me/",
	"wss://indexer.coracle.social/",
	"wss://user.kindpag.es/"
], n = [
	"wss://nos.lol/",
	"wss://relay.nostr.wirednet.jp/",
	"wss://yabu.me/",
	"wss://x.kojira.io/"
], r = [
	"wss://relay.damus.io/",
	"wss://relay.nostr.band/",
	"wss://nrelay.c-stellar.net/",
	"wss://nrelay-jp.c-stellar.net/"
], i = /* @__PURE__ */ new Set(["ws:", "wss:"]), a = new Set(r), o = class {
	static parseKind10002Tags(e) {
		let t = {};
		return e.filter((e) => Array.isArray(e) && e.every((e) => typeof e == "string") && (e.length === 2 || e.length === 3) && e[0] === "r").forEach((e) => {
			let n = typeof e[1] == "string" ? s.normalizeExternalRelayUrl(e[1]) : null;
			if (!n) return;
			let r = !0, i = !0;
			if (e.length === 3) {
				if (e[2] === "read") i = !1;
				else if (e[2] === "write") r = !1;
				else return;
			}
			let a = t[n];
			t[n] = {
				read: (a?.read ?? !1) || r,
				write: (a?.write ?? !1) || i
			};
		}), t;
	}
	static parseKind3Content(e) {
		try {
			let t = JSON.parse(e);
			return t && typeof t == "object" && !Array.isArray(t) ? t : null;
		} catch {
			return null;
		}
	}
	static isValidRelayConfig(e) {
		return e ? Array.isArray(e) ? e.every((e) => typeof e == "string") : typeof e == "object" && e ? Object.entries(e).every(([, e]) => typeof e == "object" && !!e && "read" in e && "write" in e && typeof e.read == "boolean" && typeof e.write == "boolean") : !1 : !1;
	}
}, s = class {
	static EXTERNAL_INPUT_RELAY_LIMIT = 3;
	static normalizeRelayUrl(e) {
		return e.endsWith("/") ? e : e + "/";
	}
	static normalizeExternalRelayUrl(e) {
		let t = this.normalizeExternalRelayUrlCandidate(e);
		return t && !this.isDecommissionedRelayUrl(e) ? t : null;
	}
	static filterDecommissionedRelayConfig(e) {
		return Array.isArray(e) ? e.filter((e) => !this.isDecommissionedRelayUrl(e)) : Object.fromEntries(Object.entries(e).filter(([e]) => !this.isDecommissionedRelayUrl(e)));
	}
	static hasRelayEntries(e) {
		return Array.isArray(e) ? e.length > 0 : Object.keys(e).length > 0;
	}
	static isDecommissionedRelayUrl(e) {
		let t = this.normalizeExternalRelayUrlCandidate(e);
		return t !== null && a.has(t);
	}
	static normalizeExternalRelayUrlCandidate(t) {
		if (typeof t != "string") return null;
		let n = t.trim();
		if (!n) return null;
		try {
			if (n.includes("://")) {
				let e = new URL(n);
				if (!i.has(e.protocol) || e.username || e.password) return null;
			}
			let t = e(n), r = new URL(t);
			return !i.has(r.protocol) || !r.hostname || r.username || r.password ? null : t;
		} catch {
			return null;
		}
	}
	static sanitizeExternalRelayUrls(e, t = {}) {
		if (!e?.length) return [];
		let n = [], r = /* @__PURE__ */ new Set();
		for (let i of e) {
			let e = this.normalizeExternalRelayUrl(i);
			if (e && !r.has(e) && (r.add(e), n.push(e), typeof t.limit == "number" && n.length >= t.limit)) break;
		}
		return n;
	}
	static mergeRelayConfigs(...e) {
		let t = /* @__PURE__ */ new Set();
		return e.forEach((e) => {
			let n = this.filterDecommissionedRelayConfig(e);
			Array.isArray(n) ? n.forEach((e) => t.add(this.normalizeRelayUrl(e))) : typeof n == "object" && Object.keys(n).forEach((e) => {
				t.add(this.normalizeRelayUrl(e));
			});
		}), Array.from(t);
	}
	static extractReadRelays(e) {
		let t = this.filterDecommissionedRelayConfig(e);
		return Array.isArray(t) ? t.map((e) => this.normalizeRelayUrl(e)) : typeof t == "object" ? Object.keys(t).filter((e) => t[e]?.read !== !1).map((e) => this.normalizeRelayUrl(e)) : [];
	}
	static extractWriteRelays(e) {
		let t = this.filterDecommissionedRelayConfig(e);
		return Array.isArray(t) ? t.map((e) => this.normalizeRelayUrl(e)) : typeof t == "object" ? Object.keys(t).filter((e) => t[e]?.write !== !1).map((e) => this.normalizeRelayUrl(e)) : [];
	}
	static extractAllRelays(e) {
		let t = this.filterDecommissionedRelayConfig(e);
		return Array.isArray(t) ? t.map((e) => this.normalizeRelayUrl(e)) : typeof t == "object" ? Object.keys(t).map((e) => this.normalizeRelayUrl(e)) : [];
	}
};
export { n as i, s as n, t as r, o as t };
