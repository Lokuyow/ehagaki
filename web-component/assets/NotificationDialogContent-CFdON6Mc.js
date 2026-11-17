import { A as e, Ct as t, Dt as n, Et as r, G as i, I as a, J as o, K as s, Mt as c, R as l, T as u, Tt as d, V as f, W as p, X as m, Y as ee, Z as h, _ as g, ct as _, dt as v, f as y, ft as b, gt as x, it as S, j as te, jt as C, k as ne, lt as re, mt as ie, n as ae, nt as w, o as oe, pt as T, r as se, rt as E, s as ce, st as D, t as O, ut as k, vt as A, w as le, xt as j, y as M, yt as ue, z as N } from "./index-client-XkLzkVYC.js";
import { $ as de, pt as fe } from "./LoadingPlaceholder-lit91akO.js";
import { c as pe } from "./ehagakiDb-CqVey46a.js";
import { T as me, a as he, k as ge, o as P, x as _e } from "./nip65RelayDirectory-DWdjnt74.js";
import { rt as ve, s as ye } from "./appUtils-BRia-Jm6.js";
import { P as F, V as be, g as I, r as xe } from "./sensitiveContentPayloadReader-CuX74jfk.js";
import { _ as L, f as Se, h as Ce } from "./postHistoryLightweightSyncCoordinator-CTD1fZM2.js";
import { t as R } from "./inViewportAction.svelte-DbEFrrvA.js";
import { F as z, J as we, et as Te, nt as Ee, rt as De } from "./App-D7-eoDXE.js";
import { D as Oe, T as ke, a as Ae, c as je, g as Me, h as Ne, o as B, p as Pe, u as Fe, y as Ie } from "./postBroadcastService-DgDo3AL_.js";
import { a as Le, n as Re, o as ze, r as Be, s as V, t as Ve, u as H } from "./structuralSharing--jDEnYUf.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useNotificationViewport.svelte.ts
function He(e, t) {
	let n = 0, r = 0, i = null, a = null, o = null, s = () => {}, c = () => e()?.closest(".dialog-content") ?? null, l = (e) => JSON.parse(e.dataset.notificationEvents ?? "[]");
	function u() {
		let r = c(), i = e();
		if (!t() || !r || !i) return null;
		if (r.scrollTop <= 1) return {
			atTop: !0,
			revision: n,
			anchors: []
		};
		let a = r.getBoundingClientRect();
		return {
			atTop: r.scrollTop <= 1,
			revision: n,
			anchors: Array.from(i.querySelectorAll(".notification-entry")).filter((e) => {
				let t = e.getBoundingClientRect();
				return t.bottom > a.top + 1 && t.top < a.bottom - 1;
			}).map((e) => ({
				ids: l(e),
				top: e.getBoundingClientRect().top - a.top
			}))
		};
	}
	function d(r) {
		let i = c(), a = e();
		if (!t() || r.revision !== n || !i || !a) return;
		let s = r.atTop ? 0 : i.scrollTop;
		if (!r.atTop) {
			let e = Array.from(a.querySelectorAll(".notification-entry"));
			for (let t of r.anchors) {
				let n = e.find((e) => l(e).some((e) => t.ids.includes(e)));
				if (n) {
					s += n.getBoundingClientRect().top - i.getBoundingClientRect().top - t.top;
					break;
				}
			}
		}
		Math.abs(i.scrollTop - s) > .5 && (i.scrollTop = s), o = i.scrollTop;
	}
	function f() {
		n++, r++, i = null, a = null, o = null;
	}
	function p(e) {
		s();
		let t = c();
		if (!t) return;
		let n = () => f(), r = () => {
			o != null && Math.abs(t.scrollTop - o) <= 1 || f();
		};
		for (let e of [
			"wheel",
			"touchstart",
			"pointerdown",
			"keydown"
		]) t.addEventListener(e, n, { passive: !0 });
		t.addEventListener("scroll", r, { passive: !0 });
		let l = new ResizeObserver(() => {
			a && !i && d(a);
		});
		l.observe(e), s = () => {
			for (let e of [
				"wheel",
				"touchstart",
				"pointerdown",
				"keydown"
			]) t.removeEventListener(e, n);
			t.removeEventListener("scroll", r), l.disconnect(), f();
		};
	}
	return O(() => s()), {
		reset: f,
		observe: p,
		visibleSourceIds: () => {
			let e = i ?? u();
			return e && !e.atTop ? e.anchors.flatMap((e) => e.ids) : [];
		},
		preserve() {
			let e = i ?? u();
			if (!e) return;
			i = e;
			let t = ++r;
			E().then(() => {
				t === r && (i = null, a = e, d(e));
			});
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/notificationGrouping.ts
var U = /* @__PURE__ */ new WeakMap();
function Ue(e) {
	let t = e.event;
	if (U.has(t)) return U.get(t);
	let n;
	if (t.kind === 7) n = P(t).reference;
	else {
		let e = _e(t);
		n = e ? {
			...e,
			targetKindHint: t.kind === 6 ? 1 : e.targetKindHint,
			excludedKinds: t.kind === 16 ? [1] : void 0
		} : null;
	}
	return U.set(t, n), n;
}
function We(e, t) {
	return e === t || e.length === t.length && e.every((e, n) => e === t[n]);
}
function Ge(e, t) {
	if (!e.length) return t;
	let n = new Map(e.map((e) => [e.id, e])), r = e.length !== t.length, i = t.map((t, i) => {
		let a = n.get(t.id), o = a && a.eventId === t.eventId && a.createdAt === t.createdAt && a.event.id === t.event.id && We(a.relayUrls, t.relayUrls) ? a : t;
		return r ||= o !== e[i], o;
	});
	return r ? i : e;
}
function W(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function Ke(e, t) {
	if (!e.length) return t;
	let n = new Map(e.map((e) => [e.id, e])), r = e.length !== t.length, i = t.map((t, i) => {
		let a = n.get(t.id), o = a && a.record === t.record && a.targetId === t.targetId && W(a.reactions, t.reactions) && W(a.reposts, t.reposts) ? a : t;
		return r ||= o !== e[i], o;
	});
	return r ? i : e;
}
var G = /* @__PURE__ */ new WeakMap();
function K(e) {
	let t = G.get(e);
	if (!t) {
		let n = [...e.reactions, ...e.reposts];
		t = n.length ? n.map((e) => e.eventId) : [e.record.eventId], G.set(e, t);
	}
	return t;
}
function qe(e) {
	return {
		authors: e.authorHint ? [e.authorHint] : e.authorHints?.length ? e.authorHints : null,
		kind: e.targetKindHint ?? null,
		excludedKinds: e.excludedKinds ?? []
	};
}
function q(e, t) {
	let n = e.authors && t.authors ? e.authors.filter((e) => t.authors.includes(e)) : e.authors ?? t.authors, r = e.kind ?? t.kind, i = [.../* @__PURE__ */ new Set([...e.excludedKinds, ...t.excludedKinds])];
	return n?.length === 0 || e.kind != null && t.kind != null && e.kind !== t.kind || r != null && i.includes(r) ? null : {
		authors: n,
		kind: r,
		excludedKinds: i
	};
}
function Je(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
	for (let a of e) {
		if (i.has(a.eventId)) continue;
		i.add(a.eventId);
		let e = Ue(a), o = e && t(e.eventId), s = e && o && (!he(e, {
			eventId: o.id,
			targetAuthorPubkey: o.pubkey,
			targetKind: o.kind
		}) || e.authorHints?.length && !e.authorHints.includes(o.pubkey) || e.excludedKinds?.includes(o.kind)), c = {
			id: a.id,
			record: a,
			reactions: a.event.kind === 7 ? [a] : [],
			reposts: [6, 16].includes(a.event.kind) ? [a] : []
		};
		if (!e || s) {
			n.push(c);
			continue;
		}
		let l = qe(e), u = r.get(e.eventId) ?? [], d = u.find((e) => q(e.constraints, l));
		if (!d) {
			c.targetId = e.eventId, n.push(c), r.set(e.eventId, [...u, {
				group: c,
				constraints: l
			}]);
			continue;
		}
		let f = d.group;
		d.constraints = q(d.constraints, l), f.reactions.push(...c.reactions), f.reposts.push(...c.reposts);
		let p = Ue(f.record);
		(p.targetKindHint != null && e.targetKindHint == null || p.targetKindHint == null && e.targetKindHint == null && p.excludedKinds?.length && !e.excludedKinds?.length) && (f.record = a);
	}
	return n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useNotificationRendering.svelte.ts
function Ye(e, t) {
	let n = A(10), r = /* @__PURE__ */ new Map(), i = 0, a = [], o = j(() => {
		let t = e(), o = w(n);
		t.forEach((e, t) => {
			K(e).some((e) => r.has(e)) && (o = Math.max(o, t + 1));
		});
		let s = /* @__PURE__ */ new Set(), c = new Map(a.map((e) => [e.key, e])), l = a.length !== Math.min(o, t.length), u = t.slice(0, o).map((e, t) => {
			let n;
			for (let t of K(e)) {
				let e = r.get(t);
				if (e && !s.has(e)) {
					n = e;
					break;
				}
			}
			n ??= `notification-card-${++i}`, s.add(n);
			let o = c.get(n), u = o && o.group === e ? o : {
				group: e,
				key: n
			};
			return l ||= u !== a[t], u;
		});
		return l && (a = u), a;
	});
	re(() => {
		let e = w(o);
		S(() => {
			r = new Map(e.flatMap(({ group: e, key: t }) => K(e).map((e) => [e, t])));
		});
	});
	let s = j(() => w(o).length < e().length), c = null;
	function l() {
		c?.disconnect(), c = null;
	}
	let u = A(null);
	_(() => {
		let e = w(u), r = t();
		if (l(), !e || !r) return;
		let i = new IntersectionObserver((r) => {
			c === i && w(u) === e && t() && r.some((e) => e.isIntersecting) && x(n, Math.max(w(n), w(o).length) + 10);
		}, {
			root: e.closest(".dialog-content"),
			rootMargin: "0px 0px 600px 0px"
		});
		return c = i, i.observe(e), l;
	});
	function d(e) {
		return x(u, e, !0), { destroy() {
			w(u) === e && x(u, null);
		} };
	}
	function f() {
		l(), x(n, 10), r.clear(), a = [];
	}
	return O(l), {
		get cards() {
			return w(o);
		},
		get hasMore() {
			return w(s);
		},
		sentinel: d,
		reset: f
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/notificationTargetQueue.ts
function Xe(e, t) {
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), a = 0;
	function o() {
		if (t()) for (let [e, i] of n) {
			if (r.size >= 4) break;
			if (r.has(e)) continue;
			r.add(e);
			let s = a;
			(async () => {
				for (; s === a && t() && i.length;) {
					let e = i.shift();
					try {
						let n = await e.run();
						e.finish(s === a && t() ? n : null);
					} catch (t) {
						e.fail(t);
					}
				}
			})().finally(() => {
				if (s === a) {
					for (let e of i) e.finish(null);
					n.delete(e), r.delete(e), o();
				}
			});
		}
	}
	function s(e, r, a = "") {
		if (!t()) return Promise.resolve(null);
		let s = JSON.stringify([e, a]), c = i.get(s);
		if (c) return c.task;
		let l = new Promise((t, i) => {
			let a = n.get(e.targetEventId) ?? [];
			a.push({
				scope: e.scopeKey,
				run: r,
				finish: t,
				fail: i
			}), n.set(e.targetEventId, a), o();
		});
		i.set(s, {
			scope: e.scopeKey,
			task: l
		});
		let u = () => {
			i.get(s)?.task === l && i.delete(s);
		};
		return l.then(u, u), l;
	}
	let c = (t, n) => s(t, () => e.ensureTarget(t, n), JSON.stringify(n));
	return {
		...e,
		ensureTarget: c,
		ensureTargets: (e, t) => Promise.all(e.map((e) => c(e, t))),
		retryTarget: (t, n) => s(t, () => e.retryTarget(t, n), `retry:${JSON.stringify(n)}`),
		prepareRepostTarget: (t, n) => s(t, () => e.prepareRepostTarget(t, n), "prepare"),
		invalidateScope(t) {
			for (let [e, n] of i) n.scope === t && i.delete(e);
			for (let e of n.values()) for (let n = e.length - 1; n >= 0; n--) e[n].scope === t && e.splice(n, 1)[0].finish(null);
			e.invalidateScope(t);
		},
		reset() {
			a++;
			for (let e of n.values()) for (let t of e) t.finish(null);
			n.clear(), r.clear(), i.clear(), e.reset();
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useNotificationPostInteractions.svelte.ts
var J = Symbol("notification-post-interactions");
function Ze(e, t) {
	let r = !1, i = t;
	t = () => !r && i(), O(() => {
		r = !0;
	});
	let a = A({}), o = A({}), s = null, c = A(/* @__PURE__ */ new Set()), l = H(() => e().rxNostr, t, () => `${e().pubkeyHex}:${JSON.stringify(e().relayConfig)}`), u = j(() => [...new Set(Object.values(w(a)).map((e) => `${e.eventId}\n${e.pubkeyHex}`))].sort().join("\n\n"));
	_(() => {
		let e = w(u);
		if (!t() || !e) return;
		let n = S(() => e.split("\n\n").map((e) => {
			let [t, n] = e.split("\n");
			return {
				targetEventId: t,
				targetAuthorPubkey: n
			};
		})), r = !0, i = pe(() => F.getDeletedTargets(n)).subscribe((e) => {
			if (r) {
				let t = new Set([...e.values()].flatMap((e) => [...e]));
				(t.size !== w(c).size || [...t].some((e) => !w(c).has(e))) && x(c, t);
			}
		});
		return () => {
			r = !1, i.unsubscribe();
		};
	}), O(() => l.reset());
	let d = {
		operations: l,
		active: t,
		props: e,
		isDeleted: (e) => w(c).has(e),
		register(e, t) {
			let n = w(a)[e];
			(n?.eventId !== t.eventId || n.pubkeyHex !== t.pubkeyHex) && x(a, {
				...w(a),
				[e]: {
					eventId: t.eventId,
					pubkeyHex: t.pubkeyHex
				}
			});
		},
		unregister(e) {
			if (!(e in w(a))) return;
			let t = { ...w(a) };
			delete t[e], x(a, t);
		},
		deleted(e) {
			x(c, /* @__PURE__ */ new Set([...w(c), e]));
		},
		get previews() {
			return w(o);
		},
		registerPreview(e) {
			let t = w(o)[e.eventId];
			t?.content === e.content && t.emojiUrls.length === e.emojiUrls.length && t.emojiUrls.every((t, n) => t === e.emojiUrls[n]) || x(o, {
				...w(o),
				[e.eventId]: e
			});
		},
		unregisterPreview(e) {
			if (!(e in w(o))) return;
			let t = { ...w(o) };
			delete t[e], x(o, t);
		},
		setPreviewSupport(e) {
			s = e;
		},
		get preview() {
			return s;
		}
	};
	return n(J, d), d;
}
var Y = () => t(J), Qe = s("<div><!></div>"), X = {
	hash: "svelte-1d4fz9b",
	code: ".notification-post.svelte-1d4fz9b {min-width:0;}.plain.svelte-1d4fz9b .post-history-related-card {--post-history-related-card-bg: var(--dialog-bg);border-inline-start:0;background:transparent;margin-inline-start:0;}.plain.svelte-1d4fz9b .post-history-related-card-body {padding-inline:0;}.plain.svelte-1d4fz9b .post-preview-footer {margin-inline:0;padding-inline-start:0;}"
};
function $e(t, n) {
	let i = o();
	r(n, !0), e(t, X);
	let a = () => ce(fe, "$_", s), [s, l] = oe(), f = se(n, "profile", 3, null), m = se(n, "relayUrls", 19, () => []), ee = se(n, "plain", 3, !1), h = `notification-preview-${i}`, g = Y(), v = g.preview, y = j(() => ({
		eventId: h,
		content: n.event.content
	})), b = j(() => me(n.event, m())), te = j(() => g.isDeleted(n.event.id)), C = j(() => w(te) ? {
		...w(b),
		deletedAt: 1
	} : w(b)), re = j(() => w(te) ? I({
		kind: n.event.kind,
		sourceContent: a()("postHistory.deleted"),
		tags: []
	}) : [
		6,
		7,
		16
	].includes(n.event.kind) ? z(n.event) : I({
		kind: n.event.kind,
		sourceContent: n.event.content,
		tags: n.event.tags,
		displayContent: L(n.event)
	})), ie = j(() => w(re).previewContent.segments.flatMap((e) => e.type === "emoji" ? [e.url] : []));
	_(() => {
		let e = {
			eventId: h,
			content: n.event.content,
			emojiUrls: w(ie)
		};
		S(() => g.registerPreview(e));
	}), _(() => () => S(() => g.unregisterPreview(h)));
	let ae = A(!1);
	_(() => {
		if (!w(ae)) return;
		let e = {
			eventId: n.event.id,
			pubkeyHex: n.event.pubkey
		};
		S(() => g.register(h, e));
	}), _(() => () => S(() => g.unregister(h)));
	let T = j(() => g.props());
	var E = Qe();
	let O;
	var le = k(E);
	{
		let e = (e) => {
			{
				let t = j(() => v.shouldCollapsePost(w(y))), n = j(() => v.isPostExpanded(w(y)));
				B(e, {
					placement: "overlay",
					get visible() {
						return w(t);
					},
					get expanded() {
						return w(n);
					},
					get controls() {
						return h;
					},
					onToggle: () => v.togglePostExpanded(h)
				});
			}
		}, t = (e) => {
			{
				let t = j(() => !w(C).deletedAt && n.event.kind !== 42 ? w(T).onReplyPost : void 0), r = j(() => !w(C).deletedAt && n.event.kind !== 42 ? w(T).onQuotePost : void 0);
				ke(e, {
					get post() {
						return w(C);
					},
					get onReplyPost() {
						return w(t);
					},
					get onQuotePost() {
						return w(r);
					},
					get onReactionPost() {
						return w(T).onReactionPost;
					}
				});
			}
		}, r = (e) => {
			V(e, {
				get post() {
					return w(C);
				},
				get owner() {
					return w(T).pubkeyHex;
				},
				get rxNostr() {
					return w(T).rxNostr;
				},
				get relayConfig() {
					return w(T).relayConfig;
				},
				get operations() {
					return g.operations;
				},
				get active() {
					return g.active;
				},
				get onDeleted() {
					return g.deleted;
				},
				get onRepost() {
					return w(T).onRepostPost;
				},
				get repostPending() {
					return w(T).repostPending;
				}
			});
		}, i = j(() => !v.isPostExpanded(w(y)));
		Oe(le, {
			get event() {
				return n.event;
			},
			get profile() {
				return f();
			},
			get model() {
				return w(re);
			},
			get onImageOpen() {
				return n.onImageOpen;
			},
			get loadSensitiveBody() {
				return n.loadSensitiveBody;
			},
			maxVisibleImages: 3,
			get previewCollapseAction() {
				return v.previewRef;
			},
			get previewCollapseEventId() {
				return h;
			},
			get previewContentId() {
				return h;
			},
			get isTextCollapsed() {
				return w(i);
			},
			get emojiLoadStateByUrl() {
				return v.emojiLoadStateByUrl;
			},
			get emojiImageMetaByUrl() {
				return v.emojiImageMetaByUrl;
			},
			textOverlay: e,
			footerActions: t,
			footerMenu: r,
			$$slots: {
				textOverlay: !0,
				footerActions: !0,
				footerMenu: !0
			}
		});
	}
	c(E), ne(E, (e, t) => R?.(e, t), () => ({
		enabled: !0,
		once: !0,
		rootMargin: "160px",
		onEnterView: () => {
			x(ae, !0);
		}
	})), D(() => O = u(E, 1, "notification-post svelte-1d4fz9b", null, O, { plain: ee() })), p(t, E), d(), l();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/NotificationDialogContent.svelte
var et = s("<p> </p>"), tt = s("<span class=\"notification-repost-name svelte-1rmmgyy\"> </span>"), nt = s("<span class=\"notification-kind-icon notification-repost-icon svg-icon svelte-1rmmgyy\" role=\"img\"></span> <div class=\"post-preview-reaction-actors svelte-1rmmgyy\"></div> <!>", 1), rt = s("<div class=\"notification-actor svelte-1rmmgyy\"><!></div>"), it = s("<div class=\"notification-reaction svelte-1rmmgyy\"><!></div>"), at = s("<div class=\"notification-target-placeholder svelte-1rmmgyy\" aria-hidden=\"true\"></div>"), ot = s("<p role=\"status\"> </p>"), st = s("<!> <!>", 1), ct = s("<!> <!>  <!>", 1), lt = s("<p role=\"status\" class=\"svelte-1rmmgyy\"> </p>"), ut = s("<p role=\"status\" class=\"svelte-1rmmgyy\"> </p> <!>", 1), dt = s("<div class=\"notification-reply-parent svelte-1rmmgyy\"><!></div>"), ft = s("<button type=\"button\" class=\"notification-reply-label notification-reply-toggle svelte-1rmmgyy\"><span class=\"notification-kind-icon notification-reply-icon svg-icon svelte-1rmmgyy\" aria-hidden=\"true\"></span> <span> </span></button>"), pt = s("<div class=\"notification-reply-label svelte-1rmmgyy\"><span class=\"notification-kind-icon notification-mention-icon svg-icon svelte-1rmmgyy\" aria-hidden=\"true\"></span> <span> </span></div>"), mt = s("<div class=\"notification-reply-label svelte-1rmmgyy\"><span class=\"notification-kind-icon notification-quote-icon svg-icon svelte-1rmmgyy\" aria-hidden=\"true\"></span> <span> </span></div>"), ht = s("<span class=\"notification-type svelte-1rmmgyy\"> </span>"), gt = s("<!> <!> <!> <!>", 1), _t = s("<article class=\"notification-entry svelte-1rmmgyy\"><!></article>"), vt = s("<div class=\"notification-render-sentinel svelte-1rmmgyy\" aria-hidden=\"true\"></div>"), yt = s("<!> <div class=\"notification-list svelte-1rmmgyy\"><!> <!> <!></div> <!>", 1), bt = {
	hash: "svelte-1rmmgyy",
	code: ".notification-target-placeholder.svelte-1rmmgyy {height:100px;border-radius:4px;background:var(--text);opacity:.05;}.notification-list.svelte-1rmmgyy {width:100%;display:grid;min-width:0;overflow-wrap:anywhere;}.notification-render-sentinel.svelte-1rmmgyy {height:1px;}.notification-list.svelte-1rmmgyy .notification-load-more {margin-top:8px;}.notification-entry.svelte-1rmmgyy {display:grid;min-width:0;gap:6px;padding-block:8px;border-bottom:1px solid var(--border-hr);}.notification-entry.svelte-1rmmgyy .notification-post, .notification-entry.svelte-1rmmgyy .post-history-quote-status-card, .notification-target-placeholder.svelte-1rmmgyy {margin-inline-start:16px;}.notification-type.svelte-1rmmgyy {font-size:.85rem;opacity:.8;}.notification-reply-toggle.svelte-1rmmgyy {font:inherit;color:inherit;border:0;}.notification-reply-parent.svelte-1rmmgyy {display:grid;gap:6px;min-width:0;margin-inline-start:16px;}.notification-reply-parent.svelte-1rmmgyy p:where(.svelte-1rmmgyy) {margin:0;}.notification-reply-parent.svelte-1rmmgyy .notification-reply-retry {height:36px;justify-self:start;}.notification-reply-parent.svelte-1rmmgyy .notification-post {margin-inline-start:0;}.notification-reply-label.svelte-1rmmgyy {display:inline-flex;justify-self:start;align-items:center;gap:6px;height:34px;box-sizing:border-box;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);}.notification-entry.svelte-1rmmgyy .post-preview-reaction-chip {height:34px;min-height:34px;box-sizing:border-box;}.notification-repost-chip.svelte-1rmmgyy {max-width:100%;min-width:0;font:inherit;}.notification-reposter.svelte-1rmmgyy {padding:0;min-height:0;border:0;background:transparent;color:inherit;}button.notification-repost-chip.svelte-1rmmgyy > .post-preview-reaction-actors:where(.svelte-1rmmgyy) {flex-shrink:0;}.notification-repost-name.svelte-1rmmgyy {min-width:0;max-inline-size:16ch;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.notification-actor.svelte-1rmmgyy {display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-width:0;}.notification-reaction.svelte-1rmmgyy {display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-width:0;}.notification-actor.svelte-1rmmgyy + .notification-reaction:where(.svelte-1rmmgyy) {margin-top:-2px;}.notification-reaction.svelte-1rmmgyy .post-preview-reactions-panel {padding:0;}.notification-reaction.svelte-1rmmgyy .post-preview-reaction-symbol {--icon-hover-color: rgb(249, 24, 128);--icon-selected-hover-color: rgb(249, 24, 128);}.notification-actor.svelte-1rmmgyy .notification-avatar {display:block;width:100%;height:100%;flex:0 0 auto;border-radius:50%;overflow:hidden;}.notification-actor.svelte-1rmmgyy .notification-avatar-image {display:block;width:100%;height:100%;object-fit:cover;}.notification-kind-icon.svelte-1rmmgyy {--icon-size: 22px;--svg: currentColor;--icon-hover-color: var(--svg);--icon-selected-hover-color: var(--svg);width:22px;height:22px;flex:0 0 22px;}.notification-reply-label.svelte-1rmmgyy .notification-kind-icon:where(.svelte-1rmmgyy) {--icon-size: 26px;--svg: var(--accent-color);width:26px;height:26px;flex-basis:26px;}.notification-repost-icon.svelte-1rmmgyy {--svg: var(--accent-color);mask-image:var(--ehagaki-icon-7265706f73742e737667);}.notification-reply-icon.svelte-1rmmgyy {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function xt(t, n) {
	let s = o();
	r(n, !0), e(t, bt);
	let u = () => ce(fe, "$_", m), [m, he] = oe(), P = se(n, "show", 11, !1), _e = se(n, "presentationReady", 3, !1), F = A(null), I = A(ie({})), L = He(() => w(F), () => P() && w(U) && !w(W)), R = A([]), z = A(100), Oe = A(!1), ke = A(!1), B = A(!1), V = A(!1), H = A(!1), U = A(!1), We = A(!1), W = A(!1), G = new de(), qe = A([]), q = A(-1), J = null, Y = A(0), Qe = A(0), X = A(!1), xt = Ze(() => ({
		show: P(),
		pubkeyHex: n.pubkeyHex,
		rxNostr: n.rxNostr,
		relayConfig: n.relayConfig,
		onClose: n.onClose,
		onReplyPost: (e) => on(e, !1),
		onReactionPost: (e) => on(e, !0),
		onQuotePost: (e) => {
			let t = n.onQuotePost?.(e) ?? !1;
			return t && Ut(), t;
		},
		onRepostPost: n.onRepostPost,
		repostPending: n.repostPending
	}), () => P() && w(U) && !w(W));
	function St(e) {
		let t = w(R).find((t) => t.eventId === e);
		if (!t || !n.onOpenTarget) return;
		let r = me(t.event, t.relayUrls);
		Ut() && n.onOpenTarget(r);
	}
	let Ct = (e) => e.map(({ event: e }) => ({
		eventId: e.id,
		authorPubkey: e.pubkey,
		kind: e.kind,
		content: e.content,
		tags: e.tags,
		createdAt: e.created_at
	})), wt = /* @__PURE__ */ new WeakMap();
	function Tt(e) {
		let t = Ve(wt.get(e), Fe(Ct(e.reactions), G));
		return wt.set(e, t), t;
	}
	let Et = /* @__PURE__ */ new WeakMap();
	function Dt(e) {
		let t = Et.get(e);
		return t || (t = Fe(Ct(e.reactions)).groups.flatMap((e) => e.emojiUrl ? [e.emojiUrl] : []), Et.set(e, t)), t;
	}
	let Z = Me({
		getShow: () => P() && w(U) && !w(W),
		getRxNostr: () => n.rxNostr
	}), Ot = Z.subscribe((e, t) => {
		G.get(e) !== t && G.set(e, t);
	}), Q = Xe(Ne({
		getShow: () => P() && w(U) && !w(W),
		getOwner: () => n.pubkeyHex,
		getRxNostr: () => n.rxNostr,
		getRelayConfig: () => n.relayConfig,
		profileSyncCoordinator: Z,
		requireFullVerification: !0
	}), () => P() && w(U) && !w(W)), kt = [], At = j(() => kt = Ke(kt, Je(w(R), (e) => Q.getTargetSnapshot(e)?.event ?? null))), $ = Ye(() => w(At), () => P() && w(U) && _e() && !w(W)), jt = Ae({
		getShow: () => P() && !w(W),
		getPosts: () => Object.values(xt.previews),
		getContainer: () => w(F)
	}), Mt = j(() => [.../* @__PURE__ */ new Set([...$.cards.flatMap(({ group: e }) => Dt(e)), ...Object.values(xt.previews).flatMap((e) => e.emojiUrls)])].join("\n")), Nt = j(() => w(Mt) ? w(Mt).split("\n") : []), Pt = xe({
		getShow: () => P() && !w(W),
		getEmojiUrls: () => w(Nt),
		onStateChanged: () => jt.remeasure()
	});
	xt.setPreviewSupport({
		previewRef: jt.previewRef,
		isPostExpanded: jt.isPostExpanded,
		shouldCollapsePost: jt.shouldCollapsePost,
		togglePostExpanded: jt.togglePostExpanded,
		get emojiLoadStateByUrl() {
			return Pt.emojiLoadStateByUrl;
		},
		get emojiImageMetaByUrl() {
			return Pt.emojiImageMetaByUrl;
		}
	});
	let Ft = [], It = j(() => {
		let e = new Set($.cards.flatMap(({ group: e }) => K(e))), t = w(R).filter((t) => e.has(t.eventId));
		return (t.length !== Ft.length || t.some((e, t) => e !== Ft[t])) && (Ft = t), Ft;
	});
	_(() => {
		w(F) && L.observe(w(F));
	}), re(() => {
		w(At), w(F), S(() => L.preserve());
	});
	let Lt = /* @__PURE__ */ new WeakMap();
	function Rt(e) {
		let t = Lt.get(e);
		return t || (t = me(e.event, e.relayUrls), Lt.set(e, t)), t;
	}
	let zt = [], Bt = j(() => {
		let e = w(It).filter((e) => [
			1,
			42,
			1111
		].includes(e.event.kind)).map(Rt);
		return (e.length !== zt.length || e.some((e, t) => e !== zt[t])) && (zt = e), zt;
	}), Vt = Be({
		getShow: () => P() && w(U) && !w(W),
		getPosts: () => w(Bt),
		getRxNostr: () => n.rxNostr,
		getRelayConfig: () => n.relayConfig,
		profileSyncCoordinator: Z,
		relatedTargetResolver: Q
	});
	function Ht() {
		L.reset(), x(W, !0), $.reset(), ue(Y), J?.cancel(), J = null, x(V, !1), x(R, []), G.clear(), x(qe, []), x(q, -1), sn.clear(), x(I, {}, !0), Q.reset(), Z.reset();
	}
	function Ut() {
		return w(q) >= 0 ? !1 : (Ht(), n.onClose(), !0);
	}
	function Wt() {
		return w(q) >= 0;
	}
	let Gt = !1;
	_(() => {
		if (!w(B) || Gt || !P() || w(W)) return;
		let e = n.pubkeyHex;
		E().then(() => {
			!P() || w(W) || n.pubkeyHex !== e || Gt || (Gt = !0, n.onInitialReady?.());
		});
	}), _(() => {
		P() && w(U) && !w(W) || S(() => L.reset());
	}), ae(() => {
		let e = () => {
			x(U, document.visibilityState === "visible");
		};
		return e(), document.addEventListener("visibilitychange", e), () => document.removeEventListener("visibilitychange", e);
	}), _(() => {
		let e = n.pubkeyHex, t = w(z);
		if (w(Qe), !P() || !e || w(W)) return;
		let r = !0, i = 0, a = pe(() => Se.list(e, t + 1)).subscribe({
			next: (n) => {
				if (!r) return;
				let a = ++i, o = () => r && a === i, s = n.slice(0, t), c = () => {
					o() && (x(X, !1), x(R, Ge(w(R), s)), x(Oe, n.length > t), x(B, !0));
				}, l = n.length > t ? L.visibleSourceIds() : [], u = l.length ? new Set(s.map((e) => e.eventId)) : null;
				if (u && !l.every((e) => u.has(e))) {
					let n = w(R).filter((e) => l.includes(e.eventId)).at(-1)?.eventId ?? l.at(-1);
					Se.requiredLimitForEvent(e, n).then((e) => {
						o() && (e && e > t ? x(z, Math.max(w(z), e), !0) : c());
					}).catch(() => {
						o() && (x(H, !0), c());
					});
				} else c();
			},
			error: () => {
				r && (x(X, !0), x(H, !0), x(B, !0));
			}
		});
		return () => {
			r = !1, a.unsubscribe();
		};
	}), _(() => {
		let e = n.pubkeyHex, t = w(Y);
		if (!P() || !w(U) || !_e() || w(X) || w(W) || !e) return;
		let r = !0, i = () => r && P() && w(U) && _e() && !w(W) && w(Y) === t && n.pubkeyHex === e, a = pe(() => Se.unreadEventIds(e)).subscribe({
			next: (t) => {
				t.length && i() && E().then(() => Se.markRead(e, t, i)).catch(() => {
					i() && x(H, !0);
				});
			},
			error: () => {
				i() && x(H, !0);
			}
		});
		return () => {
			r = !1, a.unsubscribe();
		};
	}), _(() => {
		if (P() && w(U) && !w(W)) for (let e of w(It)) Z.ensureProfile(e.event.pubkey, e.relayUrls);
	});
	function Kt(e) {
		let t = Ue(e);
		return t ? {
			targetEventId: t.eventId,
			authorHint: t.authorHint,
			authorHints: t.authorHints,
			targetKindHint: t.targetKindHint,
			excludedKinds: t.excludedKinds,
			relayHints: [...t.relayHints, ...e.relayUrls],
			relationKind: "notification",
			scopeKey: "notifications",
			sourceEventId: e.eventId
		} : null;
	}
	let qt = /* @__PURE__ */ new WeakMap();
	function Jt(e) {
		if (qt.has(e)) return qt.get(e);
		let t = Ie({
			event: e.event,
			relayUrls: e.relayUrls,
			sources: ["inbound-sync"]
		}), n = Le.buildContext(Rt(e), e.eventId, t), r = n ? Le.toDescriptor(n, "notification-reply-parents") : null;
		return qt.set(e, r), r;
	}
	function Yt(e) {
		if (!P() || w(W)) return;
		let t = Jt(e);
		if (!t) return;
		let n = !w(I)[e.eventId];
		x(I, {
			...w(I),
			[e.eventId]: n
		}, !0), n && Q.ensureTarget(t);
	}
	let Xt = /* @__PURE__ */ new WeakMap();
	function Zt(e) {
		if (Xt.has(e)) return Xt.get(e);
		let t = Kt(e.record), n = t ? {
			...t,
			relayHints: [...new Set([...e.reactions, ...e.reposts].flatMap((e) => Kt(e)?.relayHints ?? []))]
		} : null;
		return Xt.set(e, n), n;
	}
	let Qt = /* @__PURE__ */ new WeakMap();
	function $t(e) {
		let t = Ue(e), n = t ? Q.getTargetSnapshot(t.eventId) : null;
		if (!n?.event || !t) return n;
		let r = Qt.get(n), i = r?.get(e);
		if (i) return i;
		let a = (e.event.kind === 6 ? n.event.kind === 1 : e.event.kind !== 16 || n.event.kind !== 1) && ge(n.event, t) ? n : {
			...n,
			event: null,
			status: "error"
		};
		return r || (r = /* @__PURE__ */ new WeakMap(), Qt.set(n, r)), r.set(e, a), a;
	}
	let en = /* @__PURE__ */ new WeakMap();
	function tn(e) {
		let t = en.get(e);
		return t === void 0 && (t = JSON.stringify(K(e)), en.set(e, t)), t;
	}
	let nn = /* @__PURE__ */ new WeakMap();
	function rn(e) {
		let t = nn.get(e.event);
		return t === void 0 && (t = Ce(e.event), nn.set(e.event, t)), t;
	}
	_(() => {
		if (!P() || !w(U) || w(W)) return;
		w(It);
		let e = S(() => $.cards.map((e) => e.group).flatMap((e) => {
			let t = e.record;
			if (![
				6,
				7,
				16
			].includes(t.event.kind)) return [];
			let n = Zt(e);
			return n && Q.getTargetSnapshot(n.targetEventId)?.event && $t(t)?.status === "error" ? [] : n ? [n] : [];
		})), t = !0, n = /* @__PURE__ */ new Map();
		for (let t of e) n.set(t.targetEventId, [...n.get(t.targetEventId) ?? [], t]);
		return Promise.all([...n.values()].map(async (e) => {
			let n = await Q.ensureTarget(e[0]);
			for (let r of e.slice(1)) {
				if (!t || n?.status !== "error" || n.errorCode !== "invalid_event") break;
				n = await Q.retryTarget(r);
			}
		})), () => {
			t = !1;
		};
	});
	async function an(e = !1) {
		if (w(X) && (x(X, !1), ue(Qe)), w(V) || !P() || !w(U) || w(W) || !n.pubkeyHex || !n.rxNostr) return;
		let t = w(Y), r = n.pubkeyHex, i = n.rxNostr, a = be(n.relayConfig), o = () => P() && w(U) && !w(W) && t === w(Y) && r === n.pubkeyHex && i === n.rxNostr && a === be(n.relayConfig);
		x(V, !0), x(H, !1), x(We, e, !0);
		let s = De(i, {
			ownerPubkeyHex: r,
			relayConfig: n.relayConfig,
			older: e,
			reconcileDirectReplyCandidates: n.reconcileDirectReplyCandidates,
			isActive: o
		});
		J = s;
		try {
			let t = await s.promise;
			if (!o()) return;
			x(H, !!t && t.status !== "success", !0), t?.maybeIncomplete && x(ke, !1), e && (x(ke, !t || t.notificationsExhausted === !0, !0), x(z, w(z) + 100));
		} catch {
			o() && x(H, !0);
		} finally {
			J === s && (J = null, x(V, !1));
		}
	}
	_(() => {
		let e = P(), t = n.pubkeyHex;
		n.rxNostr;
		let r = w(U);
		if (be(n.relayConfig), e && t && r && !w(W)) return S(() => {
			ue(Y), J?.cancel(), J = null, x(V, !1), an();
		}), () => {
			ue(Y), J?.cancel(), J = null, x(V, !1), x(I, {}, !0), Q.reset(), Z.reset();
		};
	});
	async function on(e, t) {
		let r = w(Y), i = await (t ? n.onReactionPost(e) : n.onReplyPost(e));
		return i && r === w(Y) && !w(W) && Ut(), i;
	}
	let sn = Re();
	function cn(e, t = []) {
		return sn.get(e, {
			ownerPubkey: n.pubkeyHex,
			rxNostr: n.rxNostr,
			relayConfig: n.relayConfig
		}, t);
	}
	function ln(e) {
		x(qe, e.mediaList), x(q, e.index, !0);
	}
	O(() => {
		Ht(), Ot(), Z.dispose();
	});
	var un = {
		invalidateSession: Ht,
		isFullscreen: Wt
	}, dn = yt(), fn = v(dn);
	Pe(fn, {
		result: null,
		get saveFailure() {
			return n.repostSaveFailure;
		},
		get pending() {
			return n.repostPending;
		},
		get onRetrySave() {
			return n.onRetryRepostSave;
		}
	});
	var pn = T(fn, 2), mn = k(pn), hn = (e) => {
		var t = et(), n = b(t, !0);
		D((e) => f(n, e), [() => u()("notifications.empty")]), p(e, t);
	};
	N(mn, (e) => {
		!w(B) || w(V) || w(H) || w(X) || w(R).length || e(hn);
	});
	var gn = T(mn, 2);
	a(gn, 17, () => $.cards, (e) => e.key, (e, t) => {
		let n = j(() => w(t).group), r = j(() => w(n).record), o = j(() => rn(w(r)));
		var l = _t(), d = k(l), m = (e) => {
			let t = j(() => Zt(w(n))), o = j(() => $t(w(r)));
			var s = ct(), l = v(s), d = (e) => {
				var t = rt(), r = k(t);
				te(r, () => w(n).reposts.length === 1 ? "button" : "div", !1, (e, t) => {
					g(e, () => ({
						type: w(n).reposts.length === 1 ? "button" : void 0,
						role: w(n).reposts.length === 1 ? "button" : void 0,
						"data-notification-event": w(n).reposts.length === 1 ? w(n).reposts[0].eventId : void 0,
						class: "notification-repost-chip post-preview-reaction-chip",
						onclick: w(n).reposts.length === 1 ? () => St(w(n).reposts[0].eventId) : void 0
					}), void 0, void 0, void 0, "svelte-1rmmgyy");
					var r = nt(), o = v(r), s = T(o, 2);
					a(s, 21, () => w(n).reposts, (e) => e.eventId, (e, t) => {
						let r = j(() => G.get(w(t).event.pubkey)), a = j(() => w(r)?.displayName || w(r)?.name || ve(w(t).event.pubkey, 12, 4));
						var o = i(), s = v(o);
						te(s, () => w(n).reposts.length > 1 ? "button" : "span", !1, (e, i) => {
							g(e, () => ({
								type: w(n).reposts.length > 1 ? "button" : void 0,
								role: w(n).reposts.length > 1 ? "button" : void 0,
								"data-notification-event": w(t).eventId,
								class: "notification-reposter post-preview-reaction-actor",
								title: w(a),
								"aria-label": w(a),
								onclick: w(n).reposts.length > 1 ? () => St(w(t).eventId) : void 0
							}), void 0, void 0, void 0, "svelte-1rmmgyy");
							{
								let e = j(() => w(r)?.displayName), n = j(() => w(r)?.picture);
								Te(i, {
									get pubkeyHex() {
										return w(t).event.pubkey;
									},
									get displayName() {
										return w(e);
									},
									get src() {
										return w(n);
									},
									get alt() {
										return w(a);
									},
									rootClassName: "notification-avatar",
									imageClassName: "notification-avatar-image",
									fallbackDelayMs: 0
								});
							}
						}), p(e, o);
					}), c(s);
					var l = T(s, 2), d = (e) => {
						let t = j(() => w(n).reposts[0]), r = j(() => G.get(w(t).event.pubkey));
						var i = tt(), a = b(i, !0);
						D((e) => {
							M(i, "title", w(r)?.displayName || w(r)?.name), f(a, e);
						}, [() => w(r)?.displayName || w(r)?.name || ve(w(t).event.pubkey, 12, 4)]), p(e, i);
					};
					N(l, (e) => {
						w(n).reposts.length === 1 && e(d);
					}), D((e) => M(o, "aria-label", e), [() => u()("notifications.repost")]), p(t, r);
				}), c(t), p(e, t);
			};
			N(l, (e) => {
				w(n).reposts.length && e(d);
			});
			var m = T(l, 2), h = (e) => {
				var t = it(), r = k(t);
				{
					let e = j(() => Tt(w(n))), t = j(() => w(n).reactions.length === 1);
					je(r, {
						get readModel() {
							return w(e);
						},
						onSelectActor: St,
						get showSingleActorName() {
							return w(t);
						},
						get emojiLoadStateByUrl() {
							return Pt.emojiLoadStateByUrl;
						},
						get emojiImageMetaByUrl() {
							return Pt.emojiImageMetaByUrl;
						}
					});
				}
				c(t), p(e, t);
			};
			N(m, (e) => {
				w(n).reactions.length && e(h);
			});
			var _ = T(m, 2), y = (e) => {
				{
					let t = j(() => cn(w(o).event, w(o).relayHints));
					$e(e, {
						plain: !0,
						get relayUrls() {
							return w(o).relayHints;
						},
						get event() {
							return w(o).event;
						},
						get profile() {
							return w(o).profile;
						},
						onImageOpen: ln,
						get loadSensitiveBody() {
							return w(t);
						}
					});
				}
			}, x = (e) => {
				var n = st(), r = v(n), i = (e) => {
					var t = at();
					p(e, t);
				}, a = (e) => {
					var t = ot(), n = b(t, !0);
					D((e) => f(n, e), [() => u()("notifications.targetUnavailable")]), p(e, t);
				};
				N(r, (e) => {
					!w(o) || w(o).status === "loading" ? e(i) : e(a, -1);
				});
				var s = T(r, 2), c = (e) => {
					ye(e, {
						variant: "default",
						shape: "pill",
						onClick: () => Q.retryTarget(w(t)),
						children: (e, t) => {
							C();
							var n = ee();
							D((e) => f(n, e), [() => u()("notifications.retry")]), p(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				N(s, (e) => {
					w(t) && w(o)?.status !== "loading" && e(c);
				}), p(e, n);
			};
			N(_, (e) => {
				w(o)?.event ? e(y) : e(x, -1);
			}), p(e, s);
		}, _ = (e) => {
			var t = gt(), n = v(t), l = (e) => {
				let t = j(() => Jt(w(r))), n = j(() => w(t) ? Q.getTargetSnapshot(w(t).targetEventId, w(t)) : null);
				var i = dt(), a = k(i), o = (e) => {
					{
						let t = j(() => cn(w(n).event, w(n).relayHints));
						$e(e, {
							get event() {
								return w(n).event;
							},
							get profile() {
								return w(n).profile;
							},
							get relayUrls() {
								return w(n).relayHints;
							},
							get loadSensitiveBody() {
								return w(t);
							},
							onImageOpen: ln
						});
					}
				}, l = (e) => {
					var t = lt(), n = b(t, !0);
					D((e) => f(n, e), [() => u()("postHistory.replyTargetDeleted")]), p(e, t);
				}, d = (e) => {
					var r = ut(), i = v(r), a = b(i, !0), o = T(i, 2), s = (e) => {
						ye(e, {
							className: "notification-reply-retry",
							variant: "default",
							shape: "pill",
							onClick: () => Q.retryTarget(w(t)),
							children: (e, t) => {
								C();
								var n = ee();
								D((e) => f(n, e), [() => u()("postHistory.contextRetry")]), p(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					N(o, (e) => {
						w(t) && e(s);
					}), D((e) => f(a, e), [() => u()(w(n).status === "not-found" ? "postHistory.contextNotFound" : "postHistory.contextFetchFailed")]), p(e, r);
				}, m = (e) => {
					var t = lt(), n = b(t, !0);
					D((e) => f(n, e), [() => u()("postHistory.contextLoading")]), p(e, t);
				};
				N(a, (e) => {
					w(n)?.status === "resolved" && w(n).event ? e(o) : w(n)?.status === "deleted" ? e(l, 1) : w(n)?.status === "not-found" || w(n)?.status === "error" ? e(d, 2) : e(m, -1);
				}), c(i), D(() => M(i, "id", `${s}-${w(r).eventId}`)), p(e, i);
			};
			N(n, (e) => {
				w(o) === "reply" && w(I)[w(r).eventId] && e(l);
			});
			var d = T(n, 2), m = (e) => {
				var t = ft(), n = T(k(t), 2), i = b(n, !0);
				c(t), D((e, n, a) => {
					M(t, "aria-expanded", !!w(I)[w(r).eventId]), M(t, "aria-controls", `${s}-${w(r).eventId}`), M(t, "aria-label", e), M(t, "title", n), f(i, a);
				}, [
					() => u()(w(I)[w(r).eventId] ? "postHistory.hideReplyTarget" : "postHistory.showReplyTarget"),
					() => u()(w(I)[w(r).eventId] ? "postHistory.hideReplyTarget" : "postHistory.showReplyTarget"),
					() => u()("notifications.reply")
				]), h("click", t, () => Yt(w(r))), p(e, t);
			}, g = (e) => {
				var t = pt(), n = k(t);
				let r;
				var i = T(n, 2), a = b(i, !0);
				c(t), D((e, t) => {
					r = le(n, "", r, { "mask-image": e }), f(a, t);
				}, [() => `url("${Ee("icons/alternate_email_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => u()("notifications.mention")]), p(e, t);
			}, _ = (e) => {
				var t = mt(), n = k(t);
				let r;
				var i = T(n, 2), a = b(i, !0);
				c(t), D((e, t) => {
					r = le(n, "", r, { "mask-image": e }), f(a, t);
				}, [() => `url("${Ee("icons/format_quote_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => u()("notifications.quote")]), p(e, t);
			}, y = (e) => {
				var t = ht(), n = b(t, !0);
				D((e) => f(n, e), [() => u()(`notifications.${w(o)}`)]), p(e, t);
			};
			N(d, (e) => {
				w(o) === "reply" ? e(m) : w(o) === "mention" ? e(g, 1) : w(o) === "quote" ? e(_, 2) : e(y, -1);
			});
			var x = T(d, 2);
			{
				let e = j(() => G.get(w(r).event.pubkey)), t = j(() => cn(w(r).event, w(r).relayUrls));
				$e(x, {
					plain: !0,
					get event() {
						return w(r).event;
					},
					get profile() {
						return w(e);
					},
					get relayUrls() {
						return w(r).relayUrls;
					},
					get loadSensitiveBody() {
						return w(t);
					},
					onImageOpen: ln
				});
			}
			var S = T(x, 2);
			a(S, 17, () => Vt.getQuotePreviews(Rt(w(r))), (e) => e.eventId, (e, t) => {
				var n = i(), r = v(n), a = (e) => {
					{
						let n = j(() => cn(w(t).event, w(t).relayHints));
						$e(e, {
							get relayUrls() {
								return w(t).relayHints;
							},
							get event() {
								return w(t).event;
							},
							get profile() {
								return w(t).profile;
							},
							onImageOpen: ln,
							get loadSensitiveBody() {
								return w(n);
							}
						});
					}
				}, o = (e) => {
					ze(e, {
						get preview() {
							return w(t);
						},
						onImageOpen: ln,
						onRetry: (e) => Vt.retryQuotePreview(e)
					});
				};
				N(r, (e) => {
					w(t).status === "resolved" ? e(a) : e(o, -1);
				}), p(e, n);
			}), p(e, t);
		};
		N(d, (e) => {
			w(o) === "reaction" || w(o) === "repost" ? e(m) : e(_, -1);
		}), c(l), D((e) => {
			M(l, "data-notification-id", w(n).id), M(l, "data-notification-target", w(n).targetId), M(l, "data-notification-events", e);
		}, [() => tn(w(n))]), p(e, l);
	});
	var _n = T(gn, 2), vn = (e) => {
		var t = i(), n = v(t);
		l(n, () => $.cards.length, (e) => {
			var t = vt();
			ne(t, (e) => $.sentinel?.(e)), p(e, t);
		}), p(e, t);
	}, yn = (e) => {
		ye(e, {
			className: "notification-load-more",
			variant: "default",
			shape: "pill",
			get disabled() {
				return w(V);
			},
			onClick: () => {
				w(H) || w(X) ? an(w(We)) : w(Oe) ? x(z, w(z) + 100) : an(!0);
			},
			children: (e, t) => {
				C();
				var n = ee();
				D((e) => f(n, e), [() => u()("notifications.more")]), p(e, n);
			},
			$$slots: { default: !0 }
		});
	};
	N(_n, (e) => {
		$.hasMore ? e(vn) : (w(H) || w(X) || w(Oe) || !w(ke)) && e(yn, 1);
	}), c(pn), y(pn, (e) => x(F, e), () => w(F));
	var bn = T(pn, 2), xn = (e) => {
		we(e, {
			show: !0,
			get mediaList() {
				return w(qe);
			},
			get currentIndex() {
				return w(q);
			},
			onNavigate: (e) => x(q, e, !0),
			onClose: () => x(q, -1)
		});
	};
	N(bn, (e) => {
		w(q) >= 0 && e(xn);
	}), D(() => M(pn, "aria-busy", w(V))), p(t, dn);
	var Sn = d(un);
	return he(), Sn;
}
m(["click"]);
export { xt as default };
