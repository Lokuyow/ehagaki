import { n as e } from "./relayConfigUtils-DD5f1UAM.js";
import { n as t, o as n } from "./tslib.es6-j0rGxSfD.js";
import { at as r, rt as i } from "./appUtils-CwuZyofa.js";
import { a, c as o, d as s, g as c, l, r as u, s as d, u as f } from "./query-BRdCuyDl.js";
// D:/ドキュメント/GitHub/ehagaki/node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var p = s(function(e) {
	return function() {
		e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
	};
}), m = function(e) {
	t(r, e);
	function r() {
		var t = e.call(this) || this;
		return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
	}
	return r.prototype.lift = function(e) {
		var t = new h(this, this);
		return t.operator = e, t;
	}, r.prototype._throwIfClosed = function() {
		if (this.closed) throw new p();
	}, r.prototype.next = function(e) {
		var t = this;
		d(function() {
			var r, i;
			if (t._throwIfClosed(), !t.isStopped) {
				t.currentObservers ||= Array.from(t.observers);
				try {
					for (var a = n(t.currentObservers), o = a.next(); !o.done; o = a.next()) o.value.next(e);
				} catch (e) {
					r = { error: e };
				} finally {
					try {
						o && !o.done && (i = a.return) && i.call(a);
					} finally {
						if (r) throw r.error;
					}
				}
			}
		});
	}, r.prototype.error = function(e) {
		var t = this;
		d(function() {
			if (t._throwIfClosed(), !t.isStopped) {
				t.hasError = t.isStopped = !0, t.thrownError = e;
				for (var n = t.observers; n.length;) n.shift().error(e);
			}
		});
	}, r.prototype.complete = function() {
		var e = this;
		d(function() {
			if (e._throwIfClosed(), !e.isStopped) {
				e.isStopped = !0;
				for (var t = e.observers; t.length;) t.shift().complete();
			}
		});
	}, r.prototype.unsubscribe = function() {
		this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
	}, Object.defineProperty(r.prototype, "observed", {
		get: function() {
			return this.observers?.length > 0;
		},
		enumerable: !1,
		configurable: !0
	}), r.prototype._trySubscribe = function(t) {
		return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t);
	}, r.prototype._subscribe = function(e) {
		return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
	}, r.prototype._innerSubscribe = function(e) {
		var t = this, n = this, r = n.hasError, i = n.isStopped, a = n.observers;
		return r || i ? o : (this.currentObservers = null, a.push(e), new l(function() {
			t.currentObservers = null, f(a, e);
		}));
	}, r.prototype._checkFinalizedStatuses = function(e) {
		var t = this, n = t.hasError, r = t.thrownError, i = t.isStopped;
		n ? e.error(r) : i && e.complete();
	}, r.prototype.asObservable = function() {
		var e = new a();
		return e.source = this, e;
	}, r.create = function(e, t) {
		return new h(e, t);
	}, r;
}(a), h = function(e) {
	t(n, e);
	function n(t, n) {
		var r = e.call(this) || this;
		return r.destination = t, r.source = n, r;
	}
	return n.prototype.next = function(e) {
		var t, n;
		(n = (t = this.destination)?.next) == null || n.call(t, e);
	}, n.prototype.error = function(e) {
		var t, n;
		(n = (t = this.destination)?.error) == null || n.call(t, e);
	}, n.prototype.complete = function() {
		var e, t;
		(t = (e = this.destination)?.complete) == null || t.call(e);
	}, n.prototype._subscribe = function(e) {
		return this.source?.subscribe(e) ?? o;
	}, n;
}(m), g = /* @__PURE__ */ new WeakMap(), _ = 0;
function v(e) {
	let t = g.get(e);
	return t || g.set(e, t = {
		active: /* @__PURE__ */ new Map(),
		events: new m()
	}), t;
}
function y(e) {
	return new a((t) => {
		let n = v(e);
		for (let e of n.active.values()) t.next({
			type: "progress",
			progress: e
		});
		return n.events.subscribe(t);
	});
}
function b(e) {
	let t = g.get(e);
	t?.active.clear(), t?.events.next({ type: "reset" });
}
function x(t, n, r = !1) {
	let i = v(t), a = ++_, o = !1, s = !1, c = {
		id: a,
		total: e.sanitizeExternalRelayUrls([...n]).length,
		accepted: 0,
		discovering: r,
		state: "sending"
	}, l = () => {
		i.active.set(a, c), i.events.next({
			type: "progress",
			progress: c
		});
	};
	return l(), {
		update(t, n, r = !1, u = !1) {
			if (s || !i.active.has(a)) return;
			let d = new Set(e.sanitizeExternalRelayUrls([...t])), f = e.sanitizeExternalRelayUrls([...n]).filter((e) => d.has(e)).length;
			o = u, (c.total !== d.size || c.accepted !== f || c.discovering !== r) && (c = {
				...c,
				total: d.size,
				accepted: f,
				discovering: r
			}, l());
		},
		finish(e = !1) {
			s || (s = !0, i.active.delete(a) && (c = {
				...c,
				state: e ? "cancelled" : !o && !c.discovering && c.total > 0 && c.accepted === c.total ? "complete" : "incomplete"
			}, i.events.next({
				type: "progress",
				progress: c
			})));
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relay/publish.ts
var S = /* @__PURE__ */ new WeakMap();
function C(e) {
	b(e);
	for (let t of S.get(e) ?? []) t.finish("cancelled");
}
function w(e, t) {
	let n = S.get(e);
	n || S.set(e, n = /* @__PURE__ */ new Set()), n.add(t), t.add(() => n.delete(t));
}
function T(e) {
	let t = typeof e == "string" ? e.split(":", 1)[0].trim().toLowerCase() : "";
	return [
		"auth-required",
		"restricted",
		"blocked",
		"rate-limited",
		"duplicate",
		"invalid",
		"pow",
		"error",
		"mute",
		"unsupported"
	].includes(t) ? t : "unknown";
}
function E(t, n, r) {
	let i = new l(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), f = !1, p = !1, m = n.id, h = r.operation ? void 0 : x(t, r.targetRelays), g, _, v = {
		acknowledged: new Promise((e) => {
			g = e;
		}),
		settled: new Promise((e) => {
			_ = e;
		}),
		cancel: () => b("cancelled")
	}, y = (e, t) => {
		let n = r.targetRelays.filter((e) => !a.has(e) && !o.has(e)), i = a.size > 0;
		return {
			success: i,
			...i ? { eventId: m } : { error: t === "error" ? "post_network_error" : n.length || !o.size ? "post_timeout" : "post_rejected" },
			acceptedRelays: [...a],
			...!e && (n.length || !r.targetRelays.length) ? { deliveryPending: !0 } : {},
			...o.size ? { rejectedRelays: [...o.values()] } : {},
			...e && n.length && t !== "cancelled" && t !== "error" ? { timedOutRelays: n } : {},
			...s.size ? { authRequiredRelays: [...s] } : {}
		};
	}, b = (e) => {
		if (f) return;
		f = !0, i.unsubscribe();
		let t = y(!0, e);
		h?.update(r.targetRelays, [...a]), h?.finish(e === "cancelled"), r.operation || S.finish(e), p || (p = !0, g(t)), _(t), r.onSettled?.(t);
	}, S = r.operation ?? new u(r.initialMs ?? 12e3, b);
	r.operation || (w(t, S), r.deadlineAt !== void 0 && S.setDeadline(r.deadlineAt)), i.add(S.add(() => b(S.reason ?? "cancelled")));
	let C = () => b("cancelled");
	if (r.settleSignal?.addEventListener("abort", C, { once: !0 }), i.add(() => r.settleSignal?.removeEventListener("abort", C)), r.settleSignal?.aborted || S.reason) return b("cancelled"), v;
	try {
		i.add(t.send(n, {
			signer: r.signer ?? c(),
			completeOn: "all-ok",
			...r.on ? { on: r.on } : {}
		}).subscribe({
			next: (t) => {
				if (f) return;
				let i = e.normalizeExternalRelayUrl(t.from) ?? t.from;
				!i || r.targetRelays.length && !r.targetRelays.includes(i) || (m = n.id ?? t.eventId ?? m, t.done ? t.ok ? (a.add(i), o.delete(i), d.delete(i)) : a.has(i) || (d.delete(i), o.set(i, {
					relay: i,
					category: T(t.notice),
					...t.notice ? { reason: t.notice } : {}
				})) : !t.ok && T(t.notice) === "auth-required" && (s.add(i), d.add(i), S.setDeadline(r.authDeadlineAt ?? S.startedAt + (r.authMs ?? 3e4))), r.onProgress?.(y(!1)), h?.update(r.targetRelays, [...a]), a.size && !p && !r.waitForAllRelays && (p = !0, r.settleSignal?.removeEventListener("abort", C), g({
					...y(!1),
					deliverySettled: v.settled
				})), r.targetRelays.length && !d.size && r.targetRelays.every((e) => a.has(e) || o.has(e)) && b("complete"));
			},
			error: () => b("error"),
			complete: () => b("complete")
		}));
	} catch {
		b("error");
	}
	return v;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postEventBuilder.ts
function D(e) {
	if (!e.endsWith("\n")) return e;
	let t = [...i, ...r].map((e) => e.replace(".", "\\.")).join("|");
	return RegExp(`(https?://[^\\s\\n]+(?:${t}))\\n$`, "i").test(e) ? e.slice(0, -1) : e;
}
var O = class {
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
}, k = class {
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
}, A = class t {
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
		let n = M(t);
		if (j(t) && !n.includeDefaultWriteRelays && (n.targetRelays?.length ?? 0) === 0) return Promise.resolve({
			success: !1,
			error: "no_write_relays"
		});
		let r = F(this.rxNostr, n);
		return r.length === 0 && typeof this.rxNostr.getDefaultRelays == "function" ? Promise.resolve({
			success: !1,
			error: "no_write_relays"
		}) : this.startEvent(e, n, r).acknowledged;
	}
	startEvent(e, t = {}, n = F(this.rxNostr, t)) {
		return E(this.rxNostr, e, {
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
function j(e) {
	return !!e && typeof e == "object" && "targetRelays" in e;
}
function M(t) {
	return N(t) ? {
		...t,
		targetRelays: e.sanitizeExternalRelayUrls(t.targetRelays),
		includeDefaultWriteRelays: t.includeDefaultWriteRelays ?? !0
	} : {
		...P(t) ? { signer: t } : {},
		targetRelays: [],
		includeDefaultWriteRelays: !0
	};
}
function N(e) {
	return typeof e == "object" && !!e && ("signer" in e || "targetRelays" in e || "includeDefaultWriteRelays" in e);
}
function P(e) {
	return typeof e == "object" && !!e && "signEvent" in e && typeof e.signEvent == "function";
}
function F(t, n) {
	let r = n.includeDefaultWriteRelays && typeof t.getDefaultRelays == "function" ? Object.values(t.getDefaultRelays()).filter((e) => e.write).map((e) => e.url) : [];
	return e.sanitizeExternalRelayUrls([...r, ...n.targetRelays ?? []]);
}
export { C as a, x as c, D as i, y as l, A as n, w as o, O as r, E as s, k as t };
