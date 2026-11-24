import { n as e } from "./relayConfigUtils-56ujWwKF.js";
import { i as t, m as n, n as r } from "./operation-BO0VLD7w.js";
import { t as i } from "./Subject-CVLJIZWD.js";
import { s as a } from "./query-CUABraKG.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/relay/deliveryProgress.ts
var o = /* @__PURE__ */ new WeakMap(), s = 0;
function c(e) {
	let t = o.get(e);
	return t || o.set(e, t = {
		active: /* @__PURE__ */ new Map(),
		events: new i()
	}), t;
}
function l(e) {
	return new t((t) => {
		let n = c(e);
		for (let e of n.active.values()) t.next({
			type: "progress",
			progress: e
		});
		return n.events.subscribe(t);
	});
}
function u(e) {
	let t = o.get(e);
	t?.active.clear(), t?.events.next({ type: "reset" });
}
function d(t, n, r = !1) {
	let i = c(t), a = ++s, o = !1, l = !1, u = {
		id: a,
		total: e.sanitizeExternalRelayUrls([...n]).length,
		accepted: 0,
		discovering: r,
		state: "sending"
	}, d = () => {
		i.active.set(a, u), i.events.next({
			type: "progress",
			progress: u
		});
	};
	return d(), {
		update(t, n, r = !1, s = !1) {
			if (l || !i.active.has(a)) return;
			let c = new Set(e.sanitizeExternalRelayUrls([...t])), f = e.sanitizeExternalRelayUrls([...n]).filter((e) => c.has(e)).length;
			o = s, (u.total !== c.size || u.accepted !== f || u.discovering !== r) && (u = {
				...u,
				total: c.size,
				accepted: f,
				discovering: r
			}, d());
		},
		finish(e = !1) {
			l || (l = !0, i.active.delete(a) && (u = {
				...u,
				state: e ? "cancelled" : !o && !u.discovering && u.total > 0 && u.accepted === u.total ? "complete" : "incomplete"
			}, i.events.next({
				type: "progress",
				progress: u
			})));
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/relay/publish.ts
var f = /* @__PURE__ */ new WeakMap();
function p(e) {
	u(e);
	for (let t of f.get(e) ?? []) t.finish("cancelled");
}
function m(e, t) {
	let n = f.get(e);
	n || f.set(e, n = /* @__PURE__ */ new Set()), n.add(t), t.add(() => n.delete(t));
}
function h(e) {
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
function g(t, i, o) {
	let s = new n(), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = !1, g = !1, _ = i.id, v = o.operation ? void 0 : d(t, o.targetRelays), y, b, x = {
		acknowledged: new Promise((e) => {
			y = e;
		}),
		settled: new Promise((e) => {
			b = e;
		}),
		cancel: () => C("cancelled")
	}, S = (e, t) => {
		let n = o.targetRelays.filter((e) => !c.has(e) && !l.has(e)), r = c.size > 0;
		return {
			success: r,
			...r ? { eventId: _ } : { error: t === "error" ? "post_network_error" : n.length || !l.size ? "post_timeout" : "post_rejected" },
			acceptedRelays: [...c],
			...!e && (n.length || !o.targetRelays.length) ? { deliveryPending: !0 } : {},
			...l.size ? { rejectedRelays: [...l.values()] } : {},
			...e && n.length && t !== "cancelled" && t !== "error" ? { timedOutRelays: n } : {},
			...u.size ? { authRequiredRelays: [...u] } : {}
		};
	}, C = (e) => {
		if (p) return;
		p = !0, s.unsubscribe();
		let t = S(!0, e);
		v?.update(o.targetRelays, [...c]), v?.finish(e === "cancelled"), o.operation || w.finish(e), g || (g = !0, y(t)), b(t), o.onSettled?.(t);
	}, w = o.operation ?? new r(o.initialMs ?? 12e3, C);
	o.operation || (m(t, w), o.deadlineAt !== void 0 && w.setDeadline(o.deadlineAt)), s.add(w.add(() => C(w.reason ?? "cancelled")));
	let T = () => C("cancelled");
	if (o.settleSignal?.addEventListener("abort", T, { once: !0 }), s.add(() => o.settleSignal?.removeEventListener("abort", T)), o.settleSignal?.aborted || w.reason) return C("cancelled"), x;
	try {
		s.add(t.send(i, {
			signer: o.signer ?? a(),
			completeOn: "all-ok",
			...o.on ? { on: o.on } : {}
		}).subscribe({
			next: (t) => {
				if (p) return;
				let n = e.normalizeExternalRelayUrl(t.from) ?? t.from;
				!n || o.targetRelays.length && !o.targetRelays.includes(n) || (_ = i.id ?? t.eventId ?? _, t.done ? t.ok ? (c.add(n), l.delete(n), f.delete(n)) : c.has(n) || (f.delete(n), l.set(n, {
					relay: n,
					category: h(t.notice),
					...t.notice ? { reason: t.notice } : {}
				})) : !t.ok && h(t.notice) === "auth-required" && (u.add(n), f.add(n), w.setDeadline(o.authDeadlineAt ?? w.startedAt + (o.authMs ?? 3e4))), o.onProgress?.(S(!1)), v?.update(o.targetRelays, [...c]), c.size && !g && !o.waitForAllRelays && (g = !0, o.settleSignal?.removeEventListener("abort", T), y({
					...S(!1),
					deliverySettled: x.settled
				})), o.targetRelays.length && !f.size && o.targetRelays.every((e) => c.has(e) || l.has(e)) && C("complete"));
			},
			error: () => C("error"),
			complete: () => C("complete")
		}));
	} catch {
		C("error");
	}
	return x;
}
export { l as a, d as i, m as n, g as r, p as t };
