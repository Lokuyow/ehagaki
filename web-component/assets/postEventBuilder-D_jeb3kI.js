import { n as e } from "./relayConfigUtils-DD5f1UAM.js";
import { at as t, rt as n } from "./appUtils-Bsk0mFqn.js";
import { i as r } from "./rx-nostr-BHeS362x.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/postEventBuilder.ts
function i(e) {
	if (!e.endsWith("\n")) return e;
	let r = [...n, ...t].map((e) => e.replace(".", "\\.")).join("|");
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
	settleTimeouts;
	static DEFAULT_SETTLE_TIMEOUTS = {
		initialMs: 12e3,
		successMs: 1500,
		authMs: 3e4
	};
	constructor(e, n, r = t.DEFAULT_SETTLE_TIMEOUTS) {
		this.rxNostr = e, this.console = n, this.settleTimeouts = r;
	}
	getDefaultWriteRelays() {
		return typeof this.rxNostr.getDefaultRelays == "function" ? e.sanitizeExternalRelayUrls(Object.values(this.rxNostr.getDefaultRelays()).filter((e) => e.write).map((e) => e.url)) : [];
	}
	sendEvent(t, n) {
		let i = l(n);
		if (c(n) && !i.includeDefaultWriteRelays && (i.targetRelays?.length ?? 0) === 0) return Promise.resolve({
			success: !1,
			error: "no_write_relays"
		});
		let a = f(this.rxNostr, i);
		return a.length === 0 && typeof this.rxNostr.getDefaultRelays == "function" ? Promise.resolve({
			success: !1,
			error: "no_write_relays"
		}) : new Promise((n) => {
			let o = !1, s = null, c, l = t.id, u = !1, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = () => {
				try {
					s?.unsubscribe();
				} catch {}
			}, _ = () => {
				c &&= (clearTimeout(c), void 0);
			}, v = (e = !0) => {
				let t = [...d], n = [...f.values()], r = /* @__PURE__ */ new Set([...d, ...f.keys()]), i = e ? a.filter((e) => !r.has(e)) : [], o = t.length > 0, s = i.length > 0 || !o && n.length === 0;
				return {
					success: o,
					...o ? { eventId: l } : { error: s ? "post_timeout" : "post_rejected" },
					acceptedRelays: t,
					...n.length ? { rejectedRelays: n } : {},
					...i.length ? { timedOutRelays: i } : {},
					...m.size ? { authRequiredRelays: [...m] } : {}
				};
			}, y = (e) => {
				_(), c = setTimeout(() => {
					i.waitForAllRelays && h.size > 0 && typeof i.authDeadlineAt == "number" && Date.now() < i.authDeadlineAt ? y(i.authDeadlineAt - Date.now()) : x(v());
				}, e);
			}, b = () => {
				if (!i.waitForAllRelays) return;
				let e = /* @__PURE__ */ new Set([...d, ...f.keys()]);
				h.size === 0 && a.every((t) => e.has(t)) && x(v());
			}, x = (e) => {
				o || (o = !0, _(), g(), i.settleSignal?.removeEventListener("abort", E), n(e));
			}, S = {
				next: (t) => {
					if (o) return;
					this.console.log("リレー送信結果", {
						stage: "publish",
						outcome: t.ok ? "success" : "failure"
					});
					let n = e.normalizeExternalRelayUrl(t.from) ?? t.from;
					if (n && !(a.length > 0 && !a.includes(n))) {
						if (l = ("event" in t && t.event !== null && typeof t.event == "object" && "id" in t.event && typeof t.event.id == "string" ? t.event.id : void 0) || t.eventId || l, !t.done) !t.ok && p(t.notice) === "auth-required" && (m.add(n), h.add(n), u = !1, y(i.waitForAllRelays ? Math.max(1, (i.authDeadlineAt ?? Date.now()) - Date.now()) : this.settleTimeouts.authMs), i.onProgress?.(v(!1)));
						else if (t.ok) d.add(n), f.delete(n), h.delete(n), i.onProgress?.(v(!1)), i.waitForAllRelays ? b() : h.size === 0 && !u && (u = !0, y(this.settleTimeouts.successMs));
						else {
							if (d.has(n)) return;
							h.delete(n), f.set(n, {
								relay: n,
								...t.notice ? { reason: t.notice } : {},
								category: p(t.notice)
							}), i.onProgress?.(v(!1)), i.waitForAllRelays ? b() : d.size > 0 && h.size === 0 && !u && (u = !0, y(this.settleTimeouts.successMs));
						}
					}
				},
				error: () => {
					if (!o) {
						if (this.console.error("送信エラー", {
							stage: "publish",
							reason: "unexpected"
						}), i.waitForAllRelays) {
							let e = v();
							x(e.success ? e : {
								...e,
								error: "post_network_error"
							});
						} else v().success ? u || (u = !0, y(this.settleTimeouts.successMs)) : x({
							success: !1,
							error: "post_network_error"
						});
					}
				},
				complete: () => {
					o || x(v());
				}
			}, C = {
				completeOn: "all-ok",
				signer: i.signer ?? r()
			};
			((i.targetRelays?.length ?? 0) > 0 || i.includeDefaultWriteRelays) && (C.on = {
				...(i.targetRelays?.length ?? 0) > 0 ? { relays: i.targetRelays } : {},
				...i.includeDefaultWriteRelays ? { defaultWriteRelays: !0 } : {}
			});
			let w = Date.now() + this.settleTimeouts.initialMs, T = i.deadlineAt ?? w, E = () => x(v());
			i.settleSignal?.addEventListener("abort", E, { once: !0 }), i.settleSignal?.aborted ? E() : (y(Math.max(1, T - Date.now())), s = this.rxNostr.send(t, C).subscribe(S), o && g());
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
function p(e) {
	let t = typeof e == "string" ? e.split(":", 1)[0].trim().toLowerCase() : "";
	switch (t) {
		case "auth-required":
		case "restricted":
		case "blocked":
		case "rate-limited":
		case "duplicate":
		case "invalid":
		case "pow":
		case "error":
		case "mute":
		case "unsupported": return t;
		default: return "unknown";
	}
}
export { i, s as n, a as r, o as t };
