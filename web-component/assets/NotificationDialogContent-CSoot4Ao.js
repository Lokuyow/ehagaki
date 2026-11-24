import { A as e, B as t, Dt as n, E as r, Et as i, G as a, H as o, K as s, L as c, M as l, Mt as u, Nt as d, Ot as f, St as p, T as m, X as h, Y as g, _t as _, at as v, b as y, bt as b, ct as x, dt as S, f as C, ft as w, ht as T, it as E, j as ee, k as te, lt as D, mt as O, n as ne, o as re, pt as k, q as A, r as ie, rt as j, s as ae, t as oe, ut as se, v as M, wt as N, yt as P, z as ce } from "./index-client-DEFG3Gqk.js";
import { I as le, Z as ue } from "./LoadingPlaceholder-YrD8D_td.js";
import { o as de } from "./ehagakiDb-DuXS0XPm.js";
import { S as fe, m as pe, v as me } from "./postHistoryRepository-Bu2z041i.js";
import { C as he } from "./clipboardUtils-CSGkJuUA.js";
import { r as F, u as ge } from "./postHistoryContextFetchService-DB7akfzB.js";
import { t as _e } from "./Button-Cqrg0_jX.js";
import { f as ve, t as ye, w as be } from "./usePostHistoryEmojiState.svelte-_Y95EyLM.js";
import { t as xe } from "./ProfileAvatar-eo19xgt6.js";
import { _ as Se, f as Ce, h as we } from "./postHistoryLightweightSyncCoordinator-DUlXMAtR.js";
import { c as I, s as L } from "./postReactionUtils-C8gCaYhG.js";
import { t as Te } from "./appAssetUrl-B5sJnZLv.js";
import { t as R } from "./inViewportAction.svelte-7xfM4moj.js";
import { J as Ee, P as z, et as De } from "./App-CW2Ynbk9.js";
import { D as B, T as V, a as Oe, c as ke, g as Ae, h as je, o as Me, p as Ne, u as Pe, y as Fe } from "./postBroadcastService-DaUJZYg6.js";
import { n as Ie } from "./listEdgeObserver-z6l0zYDS.js";
import { a as Le, c as Re, d as ze, n as Be, o as Ve, r as He, s as Ue, t as We } from "./structuralSharing-BQiJgHgr.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useNotificationViewport.svelte.ts
function Ge(e, t) {
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
	return oe(() => s()), {
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
var H = /* @__PURE__ */ new WeakMap();
function Ke(e) {
	let t = e.event;
	if (H.has(t)) return H.get(t);
	let n;
	if (t.kind === 7) n = I(t).reference;
	else {
		let e = pe(t);
		n = e ? {
			...e,
			targetKindHint: t.kind === 6 ? 1 : e.targetKindHint,
			excludedKinds: t.kind === 16 ? [1] : void 0
		} : null;
	}
	return H.set(t, n), n;
}
function U(e, t) {
	return e === t || e.length === t.length && e.every((e, n) => e === t[n]);
}
function qe(e, t) {
	if (!e.length) return t;
	let n = new Map(e.map((e) => [e.id, e])), r = e.length !== t.length, i = t.map((t, i) => {
		let a = n.get(t.id), o = a && a.eventId === t.eventId && a.createdAt === t.createdAt && a.event.id === t.event.id && U(a.relayUrls, t.relayUrls) ? a : t;
		return r ||= o !== e[i], o;
	});
	return r ? i : e;
}
function W(e, t) {
	return e.length === t.length && e.every((e, n) => e === t[n]);
}
function Je(e, t) {
	if (!e.length) return t;
	let n = new Map(e.map((e) => [e.id, e])), r = e.length !== t.length, i = t.map((t, i) => {
		let a = n.get(t.id), o = a && a.record === t.record && a.targetId === t.targetId && W(a.reactions, t.reactions) && W(a.reposts, t.reposts) ? a : t;
		return r ||= o !== e[i], o;
	});
	return r ? i : e;
}
var Ye = /* @__PURE__ */ new WeakMap();
function Xe(e) {
	let t = Ye.get(e);
	if (!t) {
		let n = [...e.reactions, ...e.reposts];
		t = n.length ? n.map((e) => e.eventId) : [e.record.eventId], Ye.set(e, t);
	}
	return t;
}
function G(e) {
	return {
		authors: e.authorHint ? [e.authorHint] : e.authorHints?.length ? e.authorHints : null,
		kind: e.targetKindHint ?? null,
		excludedKinds: e.excludedKinds ?? []
	};
}
function K(e, t) {
	let n = e.authors && t.authors ? e.authors.filter((e) => t.authors.includes(e)) : e.authors ?? t.authors, r = e.kind ?? t.kind, i = [.../* @__PURE__ */ new Set([...e.excludedKinds, ...t.excludedKinds])];
	return n?.length === 0 || e.kind != null && t.kind != null && e.kind !== t.kind || r != null && i.includes(r) ? null : {
		authors: n,
		kind: r,
		excludedKinds: i
	};
}
function Ze(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
	for (let a of e) {
		if (i.has(a.eventId)) continue;
		i.add(a.eventId);
		let e = Ke(a), o = e && t(e.eventId), s = e && o && (!L(e, {
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
		let l = G(e), u = r.get(e.eventId) ?? [], d = u.find((e) => K(e.constraints, l));
		if (!d) {
			c.targetId = e.eventId, n.push(c), r.set(e.eventId, [...u, {
				group: c,
				constraints: l
			}]);
			continue;
		}
		let f = d.group;
		d.constraints = K(d.constraints, l), f.reactions.push(...c.reactions), f.reposts.push(...c.reposts);
		let p = Ke(f.record);
		(p.targetKindHint != null && e.targetKindHint == null || p.targetKindHint == null && e.targetKindHint == null && p.excludedKinds?.length && !e.excludedKinds?.length) && (f.record = a);
	}
	return n;
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useNotificationRendering.svelte.ts
function Qe(e) {
	let t = typeof IntersectionObserver < "u", n = P(10), r = /* @__PURE__ */ new Map(), i = 0, a = [], o = p(() => {
		let o = e(), s = t ? j(n) : o.length;
		o.forEach((e, t) => {
			Xe(e).some((e) => r.has(e)) && (s = Math.max(s, t + 1));
		});
		let c = /* @__PURE__ */ new Set(), l = new Map(a.map((e) => [e.key, e])), u = a.length !== Math.min(s, o.length), d = o.slice(0, s).map((e, t) => {
			let n;
			for (let t of Xe(e)) {
				let e = r.get(t);
				if (e && !c.has(e)) {
					n = e;
					break;
				}
			}
			n ??= `notification-card-${++i}`, c.add(n);
			let o = l.get(n), s = o && o.group === e ? o : {
				group: e,
				key: n
			};
			return u ||= s !== a[t], s;
		});
		return u && (a = d), a;
	});
	se(() => {
		let e = j(o);
		v(() => {
			r = new Map(e.flatMap(({ group: e, key: t }) => Xe(e).map((e) => [e, t])));
		});
	});
	let s = p(() => j(o).length < e().length);
	function c() {
		return j(s) ? (_(n, Math.max(j(n), j(o).length) + 10), !0) : !1;
	}
	function l() {
		_(n, 10), r.clear(), a = [];
	}
	return {
		get cards() {
			return j(o);
		},
		get hasMore() {
			return j(s);
		},
		renderMore: c,
		reset: l
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/useNotificationPostInteractions.svelte.ts
var $e = Symbol("notification-post-interactions");
function et(e, t) {
	let n = !1, r = t;
	t = () => !n && r(), oe(() => {
		n = !0;
	});
	let i = P({}), a = P({}), o = null, s = P(/* @__PURE__ */ new Set()), c = ze(() => e().rxNostr, t, () => `${e().pubkeyHex}:${JSON.stringify(e().relayConfig)}`), l = p(() => [...new Set(Object.values(j(i)).map((e) => `${e.eventId}\n${e.pubkeyHex}`))].sort().join("\n\n"));
	D(() => {
		let e = j(l);
		if (!t() || !e) return;
		let n = v(() => e.split("\n\n").map((e) => {
			let [t, n] = e.split("\n");
			return {
				targetEventId: t,
				targetAuthorPubkey: n
			};
		})), r = !0, i = de(() => F.getDeletedTargets(n)).subscribe((e) => {
			if (r) {
				let t = new Set([...e.values()].flatMap((e) => [...e]));
				(t.size !== j(s).size || [...t].some((e) => !j(s).has(e))) && _(s, t);
			}
		});
		return () => {
			r = !1, i.unsubscribe();
		};
	}), oe(() => c.reset());
	let u = {
		operations: c,
		active: t,
		props: e,
		isDeleted: (e) => j(s).has(e),
		register(e, t) {
			let n = j(i)[e];
			(n?.eventId !== t.eventId || n.pubkeyHex !== t.pubkeyHex) && _(i, {
				...j(i),
				[e]: {
					eventId: t.eventId,
					pubkeyHex: t.pubkeyHex
				}
			});
		},
		unregister(e) {
			if (!(e in j(i))) return;
			let t = { ...j(i) };
			delete t[e], _(i, t);
		},
		deleted(e) {
			_(s, /* @__PURE__ */ new Set([...j(s), e]));
		},
		get previews() {
			return j(a);
		},
		registerPreview(e) {
			let t = j(a)[e.eventId];
			t?.content === e.content && t.emojiUrls.length === e.emojiUrls.length && t.emojiUrls.every((t, n) => t === e.emojiUrls[n]) || _(a, {
				...j(a),
				[e.eventId]: e
			});
		},
		unregisterPreview(e) {
			if (!(e in j(a))) return;
			let t = { ...j(a) };
			delete t[e], _(a, t);
		},
		setPreviewSupport(e) {
			o = e;
		},
		get preview() {
			return o;
		}
	};
	return f($e, u), u;
}
var q = () => N($e), J = A("<div><!></div>"), Y = {
	hash: "svelte-1d4fz9b",
	code: ".notification-post.svelte-1d4fz9b {min-width:0;}.plain.svelte-1d4fz9b .post-history-related-card {--post-history-related-card-bg: var(--dialog-bg);border-inline-start:0;background:transparent;margin-inline-start:0;}.plain.svelte-1d4fz9b .post-history-related-card-body {padding-inline:0;}.plain.svelte-1d4fz9b .post-preview-footer {margin-inline:0;padding-inline-start:0;}"
};
function tt(o, c) {
	let l = g();
	n(c, !0), ee(o, Y);
	let u = () => ae(ue, "$_", f), [f, m] = re(), h = ie(c, "profile", 3, null), y = ie(c, "relayUrls", 19, () => []), b = ie(c, "plain", 3, !1), C = `notification-preview-${l}`, T = q(), E = T.preview, te = p(() => ({
		eventId: C,
		content: c.event.content
	})), O = p(() => me(c.event, y())), ne = p(() => T.isDeleted(c.event.id)), k = p(() => j(ne) ? {
		...j(O),
		deletedAt: 1
	} : j(O)), A = p(() => j(ne) ? ve({
		kind: c.event.kind,
		sourceContent: u()("postHistory.deleted"),
		tags: []
	}) : [
		6,
		7,
		16
	].includes(c.event.kind) ? z(c.event) : ve({
		kind: c.event.kind,
		sourceContent: c.event.content,
		tags: c.event.tags,
		displayContent: Se(c.event)
	})), oe = p(() => j(A).previewContent.segments.flatMap((e) => e.type === "emoji" ? [e.url] : []));
	D(() => {
		let e = {
			eventId: C,
			content: c.event.content,
			emojiUrls: j(oe)
		};
		v(() => T.registerPreview(e));
	}), D(() => () => v(() => T.unregisterPreview(C)));
	let se = P(!1);
	D(() => {
		if (!j(se)) return;
		let e = {
			eventId: c.event.id,
			pubkeyHex: c.event.pubkey
		};
		v(() => T.register(C, e));
	}), D(() => () => v(() => T.unregister(C)));
	let M = p(() => T.props());
	var N = J();
	let ce;
	var le = S(N);
	{
		let e = (e) => {
			{
				let t = p(() => E.shouldCollapsePost(j(te))), n = p(() => E.isPostExpanded(j(te)));
				Me(e, {
					placement: "overlay",
					get visible() {
						return j(t);
					},
					get expanded() {
						return j(n);
					},
					get controls() {
						return C;
					},
					onToggle: () => E.togglePostExpanded(C)
				});
			}
		}, n = (e) => {
			var n = s(), r = w(n), i = (e) => {
				{
					let t = p(() => !j(k).deletedAt && c.event.kind !== 42 ? j(M).onReplyPost : void 0), n = p(() => !j(k).deletedAt && c.event.kind !== 42 ? j(M).onQuotePost : void 0);
					V(e, {
						get post() {
							return j(k);
						},
						get onReplyPost() {
							return j(t);
						},
						get onQuotePost() {
							return j(n);
						},
						get onReactionPost() {
							return j(M).onReactionPost;
						}
					});
				}
			};
			t(r, (e) => {
				j(M).readOnly || e(i);
			}), a(e, n);
		}, r = (e) => {
			Re(e, {
				get post() {
					return j(k);
				},
				get readOnly() {
					return j(M).readOnly;
				},
				get owner() {
					return j(M).pubkeyHex;
				},
				get rxNostr() {
					return j(M).rxNostr;
				},
				get relayConfig() {
					return j(M).relayConfig;
				},
				get operations() {
					return T.operations;
				},
				get active() {
					return T.active;
				},
				get onDeleted() {
					return T.deleted;
				},
				get onRepost() {
					return j(M).onRepostPost;
				},
				get repostPending() {
					return j(M).repostPending;
				}
			});
		}, i = p(() => !E.isPostExpanded(j(te)));
		B(le, {
			get event() {
				return c.event;
			},
			get profile() {
				return h();
			},
			get model() {
				return j(A);
			},
			get onImageOpen() {
				return c.onImageOpen;
			},
			get loadSensitiveBody() {
				return c.loadSensitiveBody;
			},
			get previewCollapseAction() {
				return E.previewRef;
			},
			get previewCollapseEventId() {
				return C;
			},
			get previewContentId() {
				return C;
			},
			get isTextCollapsed() {
				return j(i);
			},
			get emojiLoadStateByUrl() {
				return E.emojiLoadStateByUrl;
			},
			get emojiImageMetaByUrl() {
				return E.emojiImageMetaByUrl;
			},
			textOverlay: e,
			footerActions: n,
			footerMenu: r,
			$$slots: {
				textOverlay: !0,
				footerActions: !0,
				footerMenu: !0
			}
		});
	}
	d(N), e(N, (e, t) => R?.(e, t), () => ({
		enabled: !0,
		once: !0,
		rootMargin: "160px",
		onEnterView: () => {
			_(se, !0);
		}
	})), x(() => ce = r(N, 1, "notification-post svelte-1d4fz9b", null, ce, { plain: b() })), a(o, N), i(), m();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/NotificationDialogContent.svelte
var nt = A("<p> </p>"), rt = A("<span class=\"post-preview-reaction-count\"> </span>"), it = A("<span class=\"notification-repost-name svelte-1rmmgyy\"> </span>"), at = A("<span class=\"notification-kind-icon notification-repost-icon svg-icon svelte-1rmmgyy\" role=\"img\"></span> <!> <div class=\"post-preview-reaction-actors svelte-1rmmgyy\"></div> <!>", 1), ot = A("<div class=\"notification-actor svelte-1rmmgyy\"><!></div>"), st = A("<div class=\"notification-reaction svelte-1rmmgyy\"><!></div>"), ct = A("<div class=\"notification-target-placeholder svelte-1rmmgyy\" aria-hidden=\"true\"></div>"), lt = A("<p role=\"status\"> </p>"), ut = A("<!> <!>", 1), dt = A("<!> <!>  <!>", 1), ft = A("<p role=\"status\" class=\"svelte-1rmmgyy\"> </p>"), pt = A("<p role=\"status\" class=\"svelte-1rmmgyy\"> </p> <!>", 1), mt = A("<div class=\"notification-reply-parent svelte-1rmmgyy\"><!></div>"), ht = A("<div class=\"notification-kind-label svelte-1rmmgyy\"><span class=\"notification-kind-icon notification-mention-icon svg-icon svelte-1rmmgyy\" aria-hidden=\"true\"></span> <span> </span></div>"), gt = A("<div class=\"notification-kind-label svelte-1rmmgyy\"><span class=\"notification-kind-icon notification-quote-icon svg-icon svelte-1rmmgyy\" aria-hidden=\"true\"></span> <span> </span></div>"), _t = A("<span class=\"notification-type svelte-1rmmgyy\"> </span>"), vt = A("<!> <!> <!> <!>", 1), yt = A("<article class=\"notification-entry svelte-1rmmgyy\"><!></article>"), bt = A("<div class=\"notification-render-sentinel svelte-1rmmgyy\" aria-hidden=\"true\"></div>"), xt = A("<div class=\"notification-local-sentinel svelte-1rmmgyy\" aria-hidden=\"true\"></div>"), St = A("<!> <div class=\"notification-list svelte-1rmmgyy\"><!> <!> <!></div> <!>", 1), Ct = {
	hash: "svelte-1rmmgyy",
	code: ".notification-target-placeholder.svelte-1rmmgyy {height:100px;border-radius:4px;background:var(--text);opacity:.05;}.notification-list.svelte-1rmmgyy {width:100%;display:grid;min-width:0;overflow-wrap:anywhere;}.notification-render-sentinel.svelte-1rmmgyy, .notification-local-sentinel.svelte-1rmmgyy {height:1px;}.notification-list.svelte-1rmmgyy .notification-load-more {margin-top:8px;}.notification-entry.svelte-1rmmgyy {display:grid;min-width:0;gap:6px;padding-block:8px;border-bottom:1px solid var(--border-hr);}.notification-entry.svelte-1rmmgyy .notification-post, .notification-entry.svelte-1rmmgyy .post-history-quote-status-card, .notification-target-placeholder.svelte-1rmmgyy {margin-inline-start:16px;}.notification-type.svelte-1rmmgyy {font-size:.85rem;opacity:.8;}.notification-reply-parent.svelte-1rmmgyy {display:grid;gap:6px;min-width:0;margin-inline-start:16px;}.notification-reply-parent.svelte-1rmmgyy p:where(.svelte-1rmmgyy) {margin:0;}.notification-reply-parent.svelte-1rmmgyy .notification-reply-retry {height:36px;justify-self:start;}.notification-reply-parent.svelte-1rmmgyy .notification-post {margin-inline-start:0;}.notification-kind-label.svelte-1rmmgyy {display:inline-flex;justify-self:start;align-items:center;gap:6px;height:34px;box-sizing:border-box;padding:4px 8px;border-radius:18px;background:color-mix(in srgb, var(--btn-bg), transparent 40%);}.notification-entry.svelte-1rmmgyy .post-preview-reaction-chip {height:34px;min-height:34px;box-sizing:border-box;}.notification-repost-chip.svelte-1rmmgyy {max-width:100%;min-width:0;font:inherit;}.notification-reposter.svelte-1rmmgyy {padding:0;min-height:0;border:0;background:transparent;color:inherit;}button.notification-repost-chip.svelte-1rmmgyy > .post-preview-reaction-actors:where(.svelte-1rmmgyy) {flex-shrink:0;}.notification-repost-name.svelte-1rmmgyy {min-width:0;max-inline-size:16ch;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.notification-actor.svelte-1rmmgyy {display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-width:0;}.notification-reaction.svelte-1rmmgyy {display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-width:0;}.notification-actor.svelte-1rmmgyy + .notification-reaction:where(.svelte-1rmmgyy) {margin-top:-2px;}.notification-reaction.svelte-1rmmgyy .post-preview-reactions-panel {padding:0;}.notification-reaction.svelte-1rmmgyy .post-preview-reaction-symbol {--icon-hover-color: rgb(249, 24, 128);--icon-selected-hover-color: rgb(249, 24, 128);}.notification-actor.svelte-1rmmgyy .notification-avatar {display:block;width:100%;height:100%;flex:0 0 auto;border-radius:50%;overflow:hidden;}.notification-actor.svelte-1rmmgyy .notification-avatar-image {display:block;width:100%;height:100%;object-fit:cover;}.notification-kind-icon.svelte-1rmmgyy {--icon-size: 22px;--svg: currentColor;--icon-hover-color: var(--svg);--icon-selected-hover-color: var(--svg);width:22px;height:22px;flex:0 0 22px;}.notification-kind-label.svelte-1rmmgyy .notification-kind-icon:where(.svelte-1rmmgyy) {--icon-size: 26px;--svg: var(--accent-color);width:26px;height:26px;flex-basis:26px;}.notification-repost-icon.svelte-1rmmgyy {--svg: var(--accent-color);mask-image:var(--ehagaki-icon-7265706f73742e737667);}"
};
function wt(e, r) {
	let f = g();
	n(r, !0), ee(e, Ct);
	let A = () => ae(ue, "$_", N), [N, pe] = re(), F = ie(r, "show", 11, !1), ve = ie(r, "readOnly", 3, !1), Se = ie(r, "presentationReady", 3, !1), I = P(null), L = P(T({})), R = Ge(() => j(I), () => F() && j(W) && !j(G)), z = P([]), B = P(100), V = P(!1), Me = P(!1), Re = P(0), ze = P(!1), H = P(!1), U = P(!1), W = P(!1), Ye = P(!1), G = P(!1), K = new le(), $e = P([]), q = P(-1), J = null, Y = P(0), wt = P(0), X = P(!1), Tt = et(() => ({
		show: F(),
		pubkeyHex: r.pubkeyHex,
		rxNostr: r.rxNostr,
		relayConfig: r.relayConfig,
		onClose: r.onClose,
		readOnly: ve(),
		onReplyPost: (e) => hn(e, !1),
		onReactionPost: (e) => hn(e, !0),
		onQuotePost: (e) => {
			let t = r.onQuotePost?.(e) ?? !1;
			return t && Qt(), t;
		},
		onRepostPost: r.onRepostPost,
		repostPending: r.repostPending
	}), () => F() && j(W) && !j(G));
	function Et(e) {
		let t = j(z).find((t) => t.eventId === e);
		if (!t || !r.onOpenTarget) return;
		let n = me(t.event, t.relayUrls);
		Qt() && r.onOpenTarget(n);
	}
	let Dt = (e) => e.map(({ event: e }) => ({
		eventId: e.id,
		authorPubkey: e.pubkey,
		kind: e.kind,
		content: e.content,
		tags: e.tags,
		createdAt: e.created_at
	})), Ot = /* @__PURE__ */ new WeakMap();
	function kt(e) {
		let t = We(Ot.get(e), Pe(Dt(e.reactions), K));
		return Ot.set(e, t), t;
	}
	let At = /* @__PURE__ */ new WeakMap();
	function jt(e) {
		let t = At.get(e);
		return t || (t = Pe(Dt(e.reactions)).groups.flatMap((e) => e.emojiUrl ? [e.emojiUrl] : []), At.set(e, t)), t;
	}
	let Z = be({
		getShow: () => F() && j(W) && !j(G),
		getRxNostr: () => r.rxNostr
	}), Mt = Z.subscribe((e, t) => {
		K.get(e) !== t && K.set(e, t);
	}), Q = Ae(je({
		getShow: () => F() && j(W) && !j(G),
		getOwner: () => r.pubkeyHex,
		getRxNostr: () => r.rxNostr,
		getRelayConfig: () => r.relayConfig,
		profileSyncCoordinator: Z,
		notificationPreviews: !0
	}), () => F() && j(W) && !j(G)), Nt = [], Pt = p(() => Nt = Je(Nt, Ze(j(z), (e) => Q.getTargetSnapshot(e)?.event ?? null))), $ = Qe(() => j(Pt)), Ft = p(() => j(I)?.closest(".dialog-content") ?? null), It = p(() => F() && j(W) && Se() && !j(G) && j(q) < 0), Lt = p(() => j(ze) && j(Re) !== j(B) && !j(X));
	function Rt() {
		return !j(V) || j(X) || j(Re) !== j(B) ? !1 : (_(B, j(B) + 100), !0);
	}
	function zt() {
		j(U) || j(X) ? mn(j(Ye)) : j(V) ? Rt() : mn(!0);
	}
	let Bt = Oe({
		getShow: () => F() && !j(G),
		getPosts: () => Object.values(Tt.previews),
		getContainer: () => j(I)
	}), Vt = p(() => [.../* @__PURE__ */ new Set([...$.cards.flatMap(({ group: e }) => jt(e)), ...Object.values(Tt.previews).flatMap((e) => e.emojiUrls)])].join("\n")), Ht = p(() => j(Vt) ? j(Vt).split("\n") : []), Ut = ye({
		getShow: () => F() && !j(G),
		getEmojiUrls: () => j(Ht),
		onStateChanged: () => Bt.remeasure()
	});
	Tt.setPreviewSupport({
		previewRef: Bt.previewRef,
		isPostExpanded: Bt.isPostExpanded,
		shouldCollapsePost: Bt.shouldCollapsePost,
		togglePostExpanded: Bt.togglePostExpanded,
		get emojiLoadStateByUrl() {
			return Ut.emojiLoadStateByUrl;
		},
		get emojiImageMetaByUrl() {
			return Ut.emojiImageMetaByUrl;
		}
	});
	let Wt = [], Gt = p(() => {
		let e = new Set($.cards.flatMap(({ group: e }) => Xe(e))), t = j(z).filter((t) => e.has(t.eventId));
		return (t.length !== Wt.length || t.some((e, t) => e !== Wt[t])) && (Wt = t), Wt;
	});
	D(() => {
		j(I) && R.observe(j(I));
	}), se(() => {
		j(Pt), j(I), v(() => R.preserve());
	});
	let Kt = /* @__PURE__ */ new WeakMap();
	function qt(e) {
		let t = Kt.get(e);
		return t || (t = me(e.event, e.relayUrls), Kt.set(e, t)), t;
	}
	let Jt = [], Yt = p(() => {
		let e = j(Gt).filter((e) => [
			1,
			42,
			1111
		].includes(e.event.kind)).map(qt);
		return (e.length !== Jt.length || e.some((e, t) => e !== Jt[t])) && (Jt = e), Jt;
	}), Xt = He({
		getShow: () => F() && j(W) && !j(G),
		getPosts: () => j(Yt),
		getRxNostr: () => r.rxNostr,
		getRelayConfig: () => r.relayConfig,
		profileSyncCoordinator: Z,
		relatedTargetResolver: Q
	});
	function Zt() {
		R.reset(), _(G, !0), $.reset(), b(Y), J?.cancel(), J = null, _(H, !1), _(z, []), K.clear(), _($e, []), _(q, -1), gn.clear(), _(L, {}, !0), Q.reset(), Z.reset();
	}
	function Qt() {
		return j(q) >= 0 ? !1 : (Zt(), r.onClose(), !0);
	}
	function $t() {
		return j(q) >= 0;
	}
	let en = !1;
	D(() => {
		if (!j(ze) || en || !F() || j(G)) return;
		let e = r.pubkeyHex;
		E().then(() => {
			!F() || j(G) || r.pubkeyHex !== e || en || (en = !0, r.onInitialReady?.());
		});
	}), D(() => {
		F() && j(W) && !j(G) || v(() => R.reset());
	}), ne(() => {
		let e = () => {
			_(W, document.visibilityState === "visible");
		};
		return e(), document.addEventListener("visibilitychange", e), () => document.removeEventListener("visibilitychange", e);
	}), D(() => {
		let e = r.pubkeyHex, t = j(B);
		if (j(wt), !F() || !e || j(G)) return;
		let n = !0, i = 0, a = () => n && F() && !j(G) && r.pubkeyHex === e && j(B) === t, o = de(() => Ce.list(e, t + 1)).subscribe({
			next: (n) => {
				if (!a()) return;
				let r = ++i, o = () => a() && r === i, s = n.slice(0, t), c = () => {
					o() && (_(X, !1), _(z, qe(j(z), s)), _(V, n.length > t), _(Re, t, !0), _(ze, !0));
				}, l = n.length > t ? R.visibleSourceIds() : [], u = l.length ? new Set(s.map((e) => e.eventId)) : null;
				if (u && !l.every((e) => u.has(e))) {
					let n = j(z).filter((e) => l.includes(e.eventId)).at(-1)?.eventId ?? l.at(-1);
					Ce.requiredLimitForEvent(e, n).then((e) => {
						o() && (e && e > t ? _(B, Math.max(j(B), e), !0) : c());
					}).catch(() => {
						o() && (_(U, !0), c());
					});
				} else c();
			},
			error: () => {
				a() && (_(X, !0), _(U, !0), _(ze, !0));
			}
		});
		return () => {
			n = !1, o.unsubscribe();
		};
	}), D(() => {
		let e = r.pubkeyHex, t = j(Y);
		if (!F() || !j(W) || !Se() || j(X) || j(G) || !e) return;
		let n = !0, i = () => n && F() && j(W) && Se() && !j(G) && j(Y) === t && r.pubkeyHex === e, a = de(() => Ce.unreadEventIds(e)).subscribe({
			next: (t) => {
				t.length && i() && E().then(() => Ce.markRead(e, t, i)).catch(() => {
					i() && _(U, !0);
				});
			},
			error: () => {
				i() && _(U, !0);
			}
		});
		return () => {
			n = !1, a.unsubscribe();
		};
	}), D(() => {
		if (F() && j(W) && !j(G)) for (let e of j(Gt)) Z.ensureProfile(e.event.pubkey, e.relayUrls);
	});
	function tn(e) {
		let t = Ke(e);
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
	let nn = /* @__PURE__ */ new WeakMap();
	function rn(e) {
		if (nn.has(e)) return nn.get(e);
		let t = Fe({
			event: e.event,
			relayUrls: e.relayUrls,
			sources: ["inbound-sync"]
		}), n = Le.buildContext(qt(e), e.eventId, t), r = n ? Le.toDescriptor(n, "notification-reply-parents") : null;
		return nn.set(e, r), r;
	}
	function an(e) {
		if (!F() || j(G)) return;
		let t = rn(e);
		if (!t) return;
		let n = !j(L)[e.eventId];
		_(L, {
			...j(L),
			[e.eventId]: n
		}, !0), n && Q.ensureTarget(t);
	}
	let on = /* @__PURE__ */ new WeakMap();
	function sn(e) {
		if (on.has(e)) return on.get(e);
		let t = tn(e.record), n = t ? {
			...t,
			relayHints: [...new Set([...e.reactions, ...e.reposts].flatMap((e) => tn(e)?.relayHints ?? []))]
		} : null;
		return on.set(e, n), n;
	}
	let cn = /* @__PURE__ */ new WeakMap();
	function ln(e) {
		let t = Ke(e), n = t ? Q.getTargetSnapshot(t.eventId) : null;
		if (!n?.event || !t) return n;
		let r = cn.get(n), i = r?.get(e);
		if (i) return i;
		let a = (e.event.kind === 6 ? n.event.kind === 1 : e.event.kind !== 16 || n.event.kind !== 1) && fe(n.event, t) ? n : {
			...n,
			event: null,
			status: "error"
		};
		return r || (r = /* @__PURE__ */ new WeakMap(), cn.set(n, r)), r.set(e, a), a;
	}
	let un = /* @__PURE__ */ new WeakMap();
	function dn(e) {
		let t = un.get(e);
		return t === void 0 && (t = JSON.stringify(Xe(e)), un.set(e, t)), t;
	}
	let fn = /* @__PURE__ */ new WeakMap();
	function pn(e) {
		let t = fn.get(e);
		return t === void 0 && (t = we(e.event, e.ownerPubkeyHex), fn.set(e, t)), t;
	}
	D(() => {
		if (!F() || !j(W) || j(G)) return;
		j(Gt);
		let e = v(() => $.cards.map((e) => e.group).flatMap((e) => {
			let t = e.record;
			if (![
				6,
				7,
				16
			].includes(t.event.kind)) return [];
			let n = sn(e);
			return n && Q.getTargetSnapshot(n.targetEventId)?.event && ln(t)?.status === "error" ? [] : n ? [n] : [];
		})), t = !0, n = /* @__PURE__ */ new Map();
		for (let t of e) n.set(t.targetEventId, [...n.get(t.targetEventId) ?? [], t]);
		return v(() => {
			Promise.all([...n.values()].map(async (e) => {
				let n = await Q.ensureTarget(e[0]);
				for (let r of e.slice(1)) {
					if (!t || n?.status !== "error" || n.errorCode !== "invalid_event") break;
					n = await Q.retryTarget(r);
				}
			}));
		}), () => {
			t = !1;
		};
	});
	async function mn(e = !1) {
		if (j(X) && (_(X, !1), b(wt)), j(H) || !F() || !j(W) || j(G) || !r.pubkeyHex || !r.rxNostr) return;
		let t = j(Y), n = r.pubkeyHex, i = r.rxNostr, a = ge(r.relayConfig), o = () => F() && j(W) && !j(G) && t === j(Y) && n === r.pubkeyHex && i === r.rxNostr && a === ge(r.relayConfig);
		_(H, !0), _(U, !1), _(Ye, e, !0);
		let s = De(i, {
			ownerPubkeyHex: n,
			relayConfig: r.relayConfig,
			older: e,
			reconcileDirectReplyCandidates: r.reconcileDirectReplyCandidates,
			isActive: o
		});
		J = s;
		try {
			let t = await s.promise;
			if (!o()) return;
			_(U, !!t && t.status !== "success", !0), t?.maybeIncomplete && _(Me, !1), e && (_(Me, !t || t.notificationsExhausted === !0, !0), _(B, j(B) + 100));
		} catch {
			o() && _(U, !0);
		} finally {
			J === s && (J = null, _(H, !1));
		}
	}
	D(() => {
		let e = F(), t = r.pubkeyHex;
		r.rxNostr;
		let n = j(W);
		if (ge(r.relayConfig), e && t && n && !j(G)) return v(() => {
			b(Y), J?.cancel(), J = null, _(H, !1), mn();
		}), () => {
			b(Y), J?.cancel(), J = null, _(H, !1), _(L, {}, !0), Q.reset(), Z.reset();
		};
	});
	async function hn(e, t) {
		let n = j(Y), i = await (t ? r.onReactionPost(e) : r.onReplyPost(e));
		return i && n === j(Y) && !j(G) && Qt(), i;
	}
	let gn = Be();
	function _n(e, t = []) {
		return gn.get(e, {
			ownerPubkey: r.pubkeyHex,
			rxNostr: r.rxNostr,
			relayConfig: r.relayConfig
		}, t);
	}
	function vn(e) {
		_($e, e.mediaList), _(q, e.index, !0);
	}
	oe(() => {
		Zt(), Mt(), Z.dispose();
	});
	var yn = {
		invalidateSession: Zt,
		isFullscreen: $t
	}, bn = St(), xn = w(bn);
	Ne(xn, {
		result: null,
		get saveFailure() {
			return r.repostSaveFailure;
		},
		get pending() {
			return r.repostPending;
		},
		get onRetrySave() {
			return r.onRetryRepostSave;
		}
	});
	var Sn = O(xn, 2), Cn = S(Sn), wn = (e) => {
		var t = nt(), n = k(t, !0);
		x((e) => o(n, e), [() => A()("notifications.empty")]), a(e, t);
	};
	t(Cn, (e) => {
		!j(ze) || j(H) || j(U) || j(X) || j(z).length || e(wn);
	});
	var Tn = O(Cn, 2);
	c(Tn, 17, () => $.cards, (e) => e.key, (e, n) => {
		let r = p(() => j(n).group), i = p(() => j(r).record), g = p(() => pn(j(i)));
		var _ = yt(), v = S(_), b = (e) => {
			let n = p(() => sn(j(r))), f = p(() => ln(j(i)));
			var m = dt(), g = w(m), _ = (e) => {
				var n = ot(), i = S(n);
				l(i, () => j(r).reposts.length === 1 ? "button" : "div", !1, (e, n) => {
					M(e, () => ({
						type: j(r).reposts.length === 1 ? "button" : void 0,
						role: j(r).reposts.length === 1 ? "button" : void 0,
						"data-notification-event": j(r).reposts.length === 1 ? j(r).reposts[0].eventId : void 0,
						class: "notification-repost-chip post-preview-reaction-chip",
						onclick: j(r).reposts.length === 1 ? () => Et(j(r).reposts[0].eventId) : void 0
					}), void 0, void 0, void 0, "svelte-1rmmgyy");
					var i = at(), u = w(i), f = O(u, 2), m = (e) => {
						var t = rt(), n = k(t, !0);
						x(() => o(n, j(r).reposts.length)), a(e, t);
					};
					t(f, (e) => {
						j(r).reposts.length > 1 && e(m);
					});
					var h = O(f, 2);
					c(h, 21, () => j(r).reposts, (e) => e.eventId, (e, t) => {
						let n = p(() => K.get(j(t).event.pubkey)), i = p(() => j(n)?.displayName || j(n)?.name || he(j(t).event.pubkey, 12, 4));
						var o = s(), c = w(o);
						l(c, () => j(r).reposts.length > 1 ? "button" : "span", !1, (e, a) => {
							M(e, () => ({
								type: j(r).reposts.length > 1 ? "button" : void 0,
								role: j(r).reposts.length > 1 ? "button" : void 0,
								"data-notification-event": j(t).eventId,
								class: "notification-reposter post-preview-reaction-actor",
								title: j(i),
								"aria-label": j(i),
								onclick: j(r).reposts.length > 1 ? () => Et(j(t).eventId) : void 0
							}), void 0, void 0, void 0, "svelte-1rmmgyy");
							{
								let e = p(() => j(n)?.displayName), r = p(() => j(n)?.picture);
								xe(a, {
									get pubkeyHex() {
										return j(t).event.pubkey;
									},
									get displayName() {
										return j(e);
									},
									get src() {
										return j(r);
									},
									get alt() {
										return j(i);
									},
									rootClassName: "notification-avatar",
									imageClassName: "notification-avatar-image",
									fallbackDelayMs: 0
								});
							}
						}), a(e, o);
					}), d(h);
					var g = O(h, 2), _ = (e) => {
						let t = p(() => j(r).reposts[0]), n = p(() => K.get(j(t).event.pubkey));
						var i = it(), s = k(i, !0);
						x((e) => {
							y(i, "title", j(n)?.displayName || j(n)?.name), o(s, e);
						}, [() => j(n)?.displayName || j(n)?.name || he(j(t).event.pubkey, 12, 4)]), a(e, i);
					};
					t(g, (e) => {
						j(r).reposts.length === 1 && e(_);
					}), x((e) => y(u, "aria-label", e), [() => A()("notifications.repost")]), a(n, i);
				}), d(n), a(e, n);
			};
			t(g, (e) => {
				j(r).reposts.length && e(_);
			});
			var v = O(g, 2), b = (e) => {
				var t = st(), n = S(t);
				{
					let e = p(() => kt(j(r))), t = p(() => j(r).reactions.length === 1);
					ke(n, {
						get readModel() {
							return j(e);
						},
						onSelectActor: Et,
						get showSingleActorName() {
							return j(t);
						},
						get emojiLoadStateByUrl() {
							return Ut.emojiLoadStateByUrl;
						},
						get emojiImageMetaByUrl() {
							return Ut.emojiImageMetaByUrl;
						}
					});
				}
				d(t), a(e, t);
			};
			t(v, (e) => {
				j(r).reactions.length && e(b);
			});
			var C = O(v, 2), T = (e) => {
				{
					let t = p(() => _n(j(f).event, j(f).relayHints));
					tt(e, {
						plain: !0,
						get relayUrls() {
							return j(f).relayHints;
						},
						get event() {
							return j(f).event;
						},
						get profile() {
							return j(f).profile;
						},
						onImageOpen: vn,
						get loadSensitiveBody() {
							return j(t);
						}
					});
				}
			}, E = (e) => {
				var r = ut(), i = w(r), s = (e) => {
					var t = ct();
					a(e, t);
				}, c = (e) => {
					var t = lt(), n = k(t, !0);
					x((e) => o(n, e), [() => A()("notifications.targetUnavailable")]), a(e, t);
				};
				t(i, (e) => {
					!j(f) || j(f).status === "loading" ? e(s) : e(c, -1);
				});
				var l = O(i, 2), d = (e) => {
					_e(e, {
						variant: "default",
						shape: "pill",
						onClick: () => Q.retryTarget(j(n)),
						children: (e, t) => {
							u();
							var n = h();
							x((e) => o(n, e), [() => A()("notifications.retry")]), a(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				t(l, (e) => {
					j(n) && j(f)?.status !== "loading" && e(d);
				}), a(e, r);
			};
			t(C, (e) => {
				j(f)?.event ? e(T) : e(E, -1);
			}), a(e, m);
		}, C = (e) => {
			var n = vt(), r = w(n), l = (e) => {
				let n = p(() => rn(j(i))), r = p(() => j(n) ? Q.getTargetSnapshot(j(n).targetEventId, j(n)) : null);
				var s = mt(), c = S(s), l = (e) => {
					{
						let t = p(() => _n(j(r).event, j(r).relayHints));
						tt(e, {
							get event() {
								return j(r).event;
							},
							get profile() {
								return j(r).profile;
							},
							get relayUrls() {
								return j(r).relayHints;
							},
							get loadSensitiveBody() {
								return j(t);
							},
							onImageOpen: vn
						});
					}
				}, m = (e) => {
					var t = ft(), n = k(t, !0);
					x((e) => o(n, e), [() => A()("postHistory.replyTargetDeleted")]), a(e, t);
				}, g = (e) => {
					var i = pt(), s = w(i), c = k(s, !0), l = O(s, 2), d = (e) => {
						_e(e, {
							className: "notification-reply-retry",
							variant: "default",
							shape: "pill",
							onClick: () => Q.retryTarget(j(n)),
							children: (e, t) => {
								u();
								var n = h();
								x((e) => o(n, e), [() => A()("postHistory.contextRetry")]), a(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					t(l, (e) => {
						j(n) && e(d);
					}), x((e) => o(c, e), [() => A()(j(r).status === "not-found" ? "postHistory.contextNotFound" : "postHistory.contextFetchFailed")]), a(e, i);
				}, _ = (e) => {
					var t = ft(), n = k(t, !0);
					x((e) => o(n, e), [() => A()("postHistory.contextLoading")]), a(e, t);
				};
				t(c, (e) => {
					j(r)?.status === "resolved" && j(r).event ? e(l) : j(r)?.status === "deleted" ? e(m, 1) : j(r)?.status === "not-found" || j(r)?.status === "error" ? e(g, 2) : e(_, -1);
				}), d(s), x(() => y(s, "id", `${f}-${j(i).eventId}`)), a(e, s);
			};
			t(r, (e) => {
				j(g) === "reply" && j(L)[j(i).eventId] && e(l);
			});
			var _ = O(r, 2), v = (e) => {
				{
					let t = p(() => !!j(L)[j(i).eventId]), n = p(() => `${f}-${j(i).eventId}`);
					Ve(e, {
						get expanded() {
							return j(t);
						},
						get controls() {
							return j(n);
						},
						onClick: () => an(j(i))
					});
				}
			}, b = (e) => {
				var t = ht(), n = S(t);
				let r;
				var i = O(n, 2), s = k(i, !0);
				d(t), x((e, t) => {
					r = m(n, "", r, { "mask-image": e }), o(s, t);
				}, [() => `url("${Te("icons/alternate_email_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => A()("notifications.mention")]), a(e, t);
			}, C = (e) => {
				var t = gt(), n = S(t);
				let r;
				var i = O(n, 2), s = k(i, !0);
				d(t), x((e, t) => {
					r = m(n, "", r, { "mask-image": e }), o(s, t);
				}, [() => `url("${Te("icons/format_quote_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => A()("notifications.quote")]), a(e, t);
			}, T = (e) => {
				var t = _t(), n = k(t, !0);
				x((e) => o(n, e), [() => A()(`notifications.${j(g)}`)]), a(e, t);
			};
			t(_, (e) => {
				j(g) === "reply" ? e(v) : j(g) === "mention" ? e(b, 1) : j(g) === "quote" ? e(C, 2) : e(T, -1);
			});
			var E = O(_, 2);
			{
				let e = p(() => K.get(j(i).event.pubkey)), t = p(() => _n(j(i).event, j(i).relayUrls));
				tt(E, {
					plain: !0,
					get event() {
						return j(i).event;
					},
					get profile() {
						return j(e);
					},
					get relayUrls() {
						return j(i).relayUrls;
					},
					get loadSensitiveBody() {
						return j(t);
					},
					onImageOpen: vn
				});
			}
			var ee = O(E, 2);
			c(ee, 17, () => Xt.getQuotePreviews(qt(j(i))), (e) => e.eventId, (e, n) => {
				var r = s(), i = w(r), o = (e) => {
					{
						let t = p(() => _n(j(n).event, j(n).relayHints));
						tt(e, {
							get relayUrls() {
								return j(n).relayHints;
							},
							get event() {
								return j(n).event;
							},
							get profile() {
								return j(n).profile;
							},
							onImageOpen: vn,
							get loadSensitiveBody() {
								return j(t);
							}
						});
					}
				}, c = (e) => {
					Ue(e, {
						get preview() {
							return j(n);
						},
						onImageOpen: vn,
						onRetry: (e) => Xt.retryQuotePreview(e)
					});
				};
				t(i, (e) => {
					j(n).status === "resolved" ? e(o) : e(c, -1);
				}), a(e, r);
			}), a(e, n);
		};
		t(v, (e) => {
			j(g) === "reaction" || j(g) === "repost" ? e(b) : e(C, -1);
		}), d(_), x((e) => {
			y(_, "data-notification-id", j(r).id), y(_, "data-notification-target", j(r).targetId), y(_, "data-notification-events", e);
		}, [() => dn(j(r))]), a(e, _);
	});
	var En = O(Tn, 2), Dn = (e) => {
		var n = s(), r = w(n), i = (e) => {
			var t = s(), n = w(t);
			ce(n, () => $.cards.length, (e) => {
				var t = bt();
				te(t, () => (e) => Ie(j(Ft), e, () => j(It) && $.renderMore())), a(e, t);
			}), a(e, t);
		};
		t(r, (e) => {
			j(It) && e(i);
		}), a(e, n);
	}, On = (e) => {
		var n = ut(), r = w(n), i = (e) => {
			var t = s(), n = w(t);
			ce(n, () => j(Re), (e) => {
				var t = xt();
				te(t, () => (e) => Ie(j(Ft), e, () => j(It) && !$.hasMore && Rt())), a(e, t);
			}), a(e, t);
		};
		t(r, (e) => {
			j(It) && j(V) && !j(Lt) && !j(X) && e(i);
		});
		var c = O(r, 2), l = (e) => {
			{
				let t = p(() => j(H) || j(Lt));
				_e(e, {
					className: "notification-load-more",
					variant: "default",
					shape: "pill",
					get disabled() {
						return j(t);
					},
					onClick: zt,
					children: (e, t) => {
						u();
						var n = h();
						x((e) => o(n, e), [() => A()("notifications.more")]), a(e, n);
					},
					$$slots: { default: !0 }
				});
			}
		};
		t(c, (e) => {
			(j(U) || j(X) || j(V) || !j(Me)) && e(l);
		}), a(e, n);
	};
	t(En, (e) => {
		$.hasMore ? e(Dn) : e(On, -1);
	}), d(Sn), C(Sn, (e) => _(I, e), () => j(I));
	var kn = O(Sn, 2), An = (e) => {
		Ee(e, {
			show: !0,
			get mediaList() {
				return j($e);
			},
			get currentIndex() {
				return j(q);
			},
			onNavigate: (e) => _(q, e, !0),
			onClose: () => _(q, -1)
		});
	};
	t(kn, (e) => {
		j(q) >= 0 && e(An);
	}), x(() => y(Sn, "aria-busy", j(H))), a(e, bn);
	var jn = i(yn);
	return pe(), jn;
}
export { wt as default };
