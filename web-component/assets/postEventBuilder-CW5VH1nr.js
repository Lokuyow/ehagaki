import { n as e } from "./relayConfigUtils-56ujWwKF.js";
import { G as t, q as n } from "./appUtils-B3-zUpkb.js";
import { r } from "./publish-DOKLxtGg.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postEventBuilder.ts
function i(e) {
	if (!e.endsWith("\n")) return e;
	let r = [...t, ...n].map((e) => e.replace(".", "\\.")).join("|");
	return RegExp(`(https?://[^\\s\\n]+(?:${r}))\\n$`, "i").test(e) ? e.slice(0, -1) : e;
}
var a = class {
	static validatePost(e, t, n) {
		return e.trim() ? n ? t ? { valid: !0 } : {
			valid: !1,
			error: "login_required"
		} : {
			valid: !1,
			error: "nostr_not_ready"
		} : {
			valid: !1,
			error: "empty_content"
		};
	}
}, o = class {
	static async buildEvent(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		let m = [];
		if (u && m.push([
			"e",
			u.eventId,
			u.channelRelays?.[0] || u.relayHints[0] || "",
			"root"
		]), l && m.push(...l), Array.isArray(n) && n.length ? m.push(...n) : Array.isArray(t) && m.push(...t.map((e) => ["t", e.toLowerCase()])), f) {
			if (s) {
				let e = c?.trim() ?? "";
				m.push(e ? ["content-warning", e] : ["content-warning"]);
			}
		} else {
			let e = m.some((e) => e[0] === "t" && e[1] === "nsfw");
			(s || e) && (c && c.trim() ? m.push(["content-warning", c.trim()]) : m.push(["content-warning"]), s && !e && m.push(["t", "nsfw"]));
		}
		if (o) {
			let e = o();
			e && m.push(e);
		}
		if (Array.isArray(d) && d.length && m.push(...d), i && a) {
			for (let [e, t] of Object.entries(i)) if (e && t && t.m) {
				let n = await a({
					url: e,
					...t
				});
				m.push(n);
			}
		}
		let h = {
			kind: p ?? (u ? 42 : 1),
			content: e,
			tags: m,
			created_at: Math.floor(Date.now() / 1e3)
		};
		return r && (h.pubkey = r), h;
	}
}, s = class t {
	rxNostr;
	console;
	timeouts;
	static DEFAULT_SETTLE_TIMEOUTS = {
		initialMs: 12e3,
		authMs: 3e4
	};
	constructor(e, n, r = t.DEFAULT_SETTLE_TIMEOUTS) {
		this.rxNostr = e, this.console = n, this.timeouts = r;
	}
	getDefaultWriteRelays() {
		return typeof this.rxNostr.getDefaultRelays == "function" ? e.sanitizeExternalRelayUrls(Object.values(this.rxNostr.getDefaultRelays()).filter((e) => e.write).map((e) => e.url)) : [];
	}
	sendEvent(e, t) {
		let n = l(t);
		if (c(t) && !n.includeDefaultWriteRelays && (n.targetRelays?.length ?? 0) === 0) return Promise.resolve({
			success: !1,
			error: "no_write_relays"
		});
		let r = f(this.rxNostr, n);
		return r.length === 0 && typeof this.rxNostr.getDefaultRelays == "function" ? Promise.resolve({
			success: !1,
			error: "no_write_relays"
		}) : this.startEvent(e, n, r).acknowledged;
	}
	startEvent(e, t = {}, n = f(this.rxNostr, t)) {
		return r(this.rxNostr, e, {
			...t,
			targetRelays: n,
			onSettled: (e) => {
				e.error === "post_network_error" && this.console.error("送信エラー", {
					stage: "publish",
					reason: "unexpected"
				}), t.onSettled?.(e);
			},
			initialMs: this.timeouts.initialMs,
			authMs: this.timeouts.authMs,
			on: { relays: n }
		});
	}
};
function c(e) {
	return !!e && typeof e == "object" && "targetRelays" in e;
}
function l(t) {
	return u(t) ? {
		...t,
		targetRelays: e.sanitizeExternalRelayUrls(t.targetRelays),
		includeDefaultWriteRelays: t.includeDefaultWriteRelays ?? !0
	} : {
		...d(t) ? { signer: t } : {},
		targetRelays: [],
		includeDefaultWriteRelays: !0
	};
}
function u(e) {
	return typeof e == "object" && !!e && ("signer" in e || "targetRelays" in e || "includeDefaultWriteRelays" in e);
}
function d(e) {
	return typeof e == "object" && !!e && "signEvent" in e && typeof e.signEvent == "function";
}
function f(t, n) {
	let r = n.includeDefaultWriteRelays && typeof t.getDefaultRelays == "function" ? Object.values(t.getDefaultRelays()).filter((e) => e.write).map((e) => e.url) : [];
	return e.sanitizeExternalRelayUrls([...r, ...n.targetRelays ?? []]);
}
export { i, s as n, a as r, o as t };
