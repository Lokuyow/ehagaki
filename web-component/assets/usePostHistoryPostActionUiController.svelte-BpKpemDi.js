import { A as e, Et as t, G as n, K as r, Mt as i, N as a, Nt as o, P as s, Tt as c, V as l, W as u, Y as d, a as f, ct as p, dt as m, ft as h, gt as g, it as _, jt as v, mt as y, nt as b, o as x, pt as S, r as C, s as w, st as T, t as E, ut as D, vt as O, xt as k, y as A, z as j } from "./index-client-XkLzkVYC.js";
import { i as ee, n as M, v as N } from "./relayConfigUtils-B4Q_AO1M.js";
import { o as P, u as F } from "./postHistoryEventUtils-CP25bUau.js";
import { pt as te } from "./LoadingPlaceholder-lit91akO.js";
import { n as I } from "./ehagakiDb-DZENFSwt.js";
import { a as L, r as R } from "./query-Bp8561W2.js";
import { D as z, E as B, O as V, S as H, T as ne, a as U, c as W, i as G, it as re, mt as ie, o as ae, rt as oe, x as K } from "./nip65RelayDirectory-DWSms_SU.js";
import { h as se, p as ce } from "./relayStore.svelte-Df3SPXmc.js";
import { l as le, s as q } from "./appUtils-BRia-Jm6.js";
import { A as ue, D as de, E as fe, M as pe, P as me, S as he, T as ge, i as _e, j as ve, k as ye, o as J, v as be } from "./sensitiveContentPayloadReader-CULjfcYs.js";
import { t as Y } from "./arrayUtils-kRQBpBQw.js";
import { l as xe, y as Se } from "./App-B2GhfviI.js";
import { D as Ce, O as we, T as Te, u as Ee } from "./postBroadcastService-BRagkIzb.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepostPreview.svelte
var De = r("<p> </p>"), Oe = r("<div class=\"repost-target-label svelte-1l68xot\"> </div>"), ke = r("<div class=\"repost-channel-row svelte-1l68xot\"><span> </span> <strong> </strong></div>"), X = r("<!> <!>", 1), Ae = r("<p role=\"status\"> </p> <!>", 1), je = r("<div class=\"post-history-repost svelte-1l68xot\"><div class=\"post-history-repost-label svelte-1l68xot\"><span class=\"post-history-repost-title svelte-1l68xot\"><!> <span class=\"post-history-repost-icon svg-icon svelte-1l68xot\" aria-hidden=\"true\"></span> <span> </span></span> <!></div> <!> <!></div>"), Me = {
	hash: "svelte-1l68xot",
	code: ".post-history-repost.svelte-1l68xot {min-width:0;}.repost-target-label.svelte-1l68xot {padding:4px 6px;color:var(--text-muted);}.repost-channel-row.svelte-1l68xot {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.post-history-repost-label.svelte-1l68xot {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.post-history-repost-title.svelte-1l68xot {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.post-history-repost-icon.svelte-1l68xot {--icon-size: 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-7265706f73742e737667);}.post-history-repost-label .post-history-menu-trigger {inline-size:28px;block-size:28px;min-inline-size:28px;min-block-size:28px;flex:0 0 28px;padding:0;}"
};
function Ne(r, a) {
	t(a, !0), e(r, Me);
	let f = () => w(te, "$_", p), [p, g] = x(), _ = C(a, "channelText", 3, null), y = C(a, "targetLabel", 3, null), E = C(a, "scrollRoot", 3, null), O = C(a, "emojiLoadStateByUrl", 19, () => ({})), ee = C(a, "emojiImageMetaByUrl", 19, () => ({})), M = k(() => a.preview.event ? ne(a.preview.event, a.preview.relayHints) : null), N = k(() => a.preview.status === "deleted" ? "repost.targetDeleted" : a.preview.status === "unsupported-target-kind" ? "repost.targetUnsupported" : a.preview.status === "unsupported-reference" ? "repost.referenceUnsupported" : a.preview.status === "invalid-reference" || a.preview.status === "invalid-target" || a.preview.status === "outer-target-kind-mismatch" ? "repost.targetInvalid" : a.preview.status === "loading" ? "repost.targetLoading" : "repost.targetMissing");
	var P = je(), F = D(P), I = D(F), L = D(I);
	s(L, () => a.author ?? o);
	var R = S(L, 4), z = h(R, !0);
	i(I);
	var B = S(I, 2);
	s(B, () => a.menu ?? o, () => a.post, () => `repost-outer:${a.post.eventId}`), i(F);
	var V = S(F, 2), H = (e) => {
		var t = De(), n = h(t, !0);
		T((e) => l(n, e), [() => f()("postHistory.deleted")]), u(e, t);
	}, U = (e) => {
		var t = X(), r = m(t);
		Ce(r, {
			get event() {
				return a.preview.event;
			},
			get profile() {
				return a.preview.profile;
			},
			get model() {
				return a.model;
			},
			get loadSensitiveBody() {
				return a.loadSensitiveBody;
			},
			get scrollRoot() {
				return E();
			},
			get onImageOpen() {
				return a.onImageOpen;
			},
			get emojiLoadStateByUrl() {
				return O();
			},
			get emojiImageMetaByUrl() {
				return ee();
			},
			topActions: (e) => {
				var t = X(), n = m(t), r = (e) => {
					var t = Oe(), n = h(t, !0);
					T(() => l(n, y())), u(e, t);
				};
				j(n, (e) => {
					y() && e(r);
				});
				var a = S(n, 2), o = (e) => {
					var t = ke(), n = D(t), r = h(n, !0), a = S(n, 2), o = h(a, !0);
					i(t), T((e) => {
						l(r, e), l(o, _());
					}, [() => f()("postHistory.channel")]), u(e, t);
				};
				j(a, (e) => {
					_() && e(o);
				}), u(e, t);
			},
			footerActions: (e) => {
				Te(e, {
					get post() {
						return b(M);
					},
					get onReplyPost() {
						return a.onReplyPost;
					},
					get onQuotePost() {
						return a.onQuotePost;
					},
					get onReactionPost() {
						return a.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = n(), r = m(t);
						s(r, () => a.reactionExtras ?? o, () => b(M)), u(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			},
			footerDetails: (e) => {
				var t = n(), r = m(t);
				s(r, () => a.reactionDetails ?? o, () => b(M)), u(e, t);
			},
			footerMenu: (e) => {
				var t = n(), r = m(t);
				s(r, () => a.menu ?? o, () => b(M), () => `repost-target:${a.post.eventId}:${b(M).eventId}`), u(e, t);
			},
			$$slots: {
				topActions: !0,
				footerActions: !0,
				footerDetails: !0,
				footerMenu: !0
			}
		});
		var c = S(r, 2), p = (e) => {
			var t = Ae(), n = m(t), r = h(n, !0), i = S(n, 2);
			q(i, {
				get onClick() {
					return a.onRetry;
				},
				children: (e, t) => {
					v();
					var n = d();
					T((e) => l(n, e), [() => f()("repost.retrySave")]), u(e, n);
				},
				$$slots: { default: !0 }
			}), T((e) => l(r, e), [() => f()("repost.targetSaveFailed")]), u(e, t);
		};
		j(c, (e) => {
			"saveFailed" in a.preview && a.preview.saveFailed && e(p);
		}), u(e, t);
	}, W = (e) => {
		var t = Ae(), n = m(t), r = h(n, !0), i = S(n, 2), o = (e) => {
			q(e, {
				get onClick() {
					return a.onRetry;
				},
				children: (e, t) => {
					v();
					var n = d();
					T((e) => l(n, e), [() => f()("postHistory.contextRetry")]), u(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		j(i, (e) => {
			(a.preview.status === "not-found" || a.preview.status === "error" || a.preview.status === "invalid-target") && e(o);
		}), T((e) => l(r, e), [() => f()(b(N))]), u(e, t);
	};
	j(V, (e) => {
		a.post.deletedAt === void 0 ? a.preview.status === "resolved" && a.preview.event && b(M) ? e(U, 1) : e(W, -1) : e(H);
	});
	var G = S(V, 2), re = (e) => {
		var t = X(), r = m(t);
		{
			let e = (e) => {
				Te(e, {
					get post() {
						return a.post;
					},
					get onReactionPost() {
						return a.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = n(), r = m(t);
						s(r, () => a.reactionExtras ?? o, () => a.post), u(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			}, t = (e) => {
				var t = n(), r = m(t);
				s(r, () => a.footerMenu ?? o, () => a.post), u(e, t);
			}, i = k(() => he(a.post.postedAt));
			we(r, {
				get formattedDate() {
					return b(i);
				},
				actions: e,
				trailing: t,
				$$slots: {
					actions: !0,
					trailing: !0
				}
			});
		}
		var i = S(r, 2);
		s(i, () => a.reactionDetails ?? o, () => a.post), u(e, t);
	};
	j(G, (e) => {
		a.post.deletedAt === void 0 && (a.onReactionPost || a.footerMenu) && e(re);
	}), i(P), T((e) => {
		A(P, "data-repost-event-id", a.post.eventId), l(z, e);
	}, [() => f()("repost.entry")]), u(r, P), c(), g();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryChannelDisplay.svelte.ts
function Pe({ getShow: e, getSessionOpen: t = e, getPosts: n, getRxNostr: r, getRelayConfig: i, getIsSearchMode: a }) {
	let o = O(y({})), s = 0, c = [];
	function l() {
		c = [];
	}
	function u() {
		s++, c.forEach((e) => e.release()), l();
	}
	function d() {
		u(), g(o, {}, !0);
	}
	function f(e, t) {
		if (e.kind !== 42) return null;
		if (!e.channelEventId) return t("postHistory.channelUnknown");
		let n = b(o)[e.channelEventId];
		return !n || n.status === "loading" ? t("postHistory.channelLoading") : n.status === "resolved" && n.name ? n.name : t("postHistory.channelUnknown");
	}
	return p(() => {
		t() || _(d);
	}), p(() => {
		if (e()) return () => {
			u();
		};
	}), p(() => {
		if (!e()) {
			u();
			return;
		}
		u();
		let t = n().filter((e) => e.kind === 42);
		if (t.length === 0) return;
		let d = Array.from(new Set(t.map((e) => e.channelEventId).filter((e) => typeof e == "string")));
		if (d.length === 0) return;
		let f = ++s, p = a() ? void 0 : r(), m = d.map((e) => {
			let n = M.sanitizeExternalRelayUrls(t.filter((t) => t.channelEventId === e).flatMap((e) => be(e, null)), { limit: 8 });
			return Se.resolveInternal({
				eventId: e,
				relayHints: n
			}, p, i());
		});
		c = m, g(o, {
			..._(() => b(o)),
			...Object.fromEntries(d.map((e) => [e, {
				status: "loading",
				name: null
			}]))
		}, !0), Promise.all(m.map((e) => e.cacheReady)).then((t) => {
			e() && f === s && g(o, {
				...b(o),
				...Object.fromEntries(t.map((e) => [e.context.eventId, ge(e.cache, !!p)]))
			}, !0);
		}).catch((e) => {
			console.error("チャンネル表示のキャッシュ解決に失敗しました:", e);
		}), Promise.all(m.map((e) => e.refresh)).then((t) => {
			e() && f === s && (l(), g(o, {
				...b(o),
				...Object.fromEntries(t.map((e) => [e.snapshot.context.eventId, {
					status: e.snapshot.context.name ? "resolved" : "failed",
					name: e.snapshot.context.name
				}]))
			}, !0));
		}).catch((e) => {
			f === s && l(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", e);
		});
	}), E(() => {
		u();
	}), {
		getChannelText: f,
		cancelCurrentChannelResolution: u
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRepostPreviews.svelte.ts
var Fe = 0;
async function Ie(e) {
	if (!e.sourceEventId) return null;
	let t = await W.getByEventId(e.sourceEventId), n = t && K(t), r = t?.repostTarget ?? (t && n ? await W.findRepostTargetSnapshot(t.pubkeyHex, n.eventId) : void 0), i = n && n.eventId === e.targetEventId && r ? z(r.rawEvent, {
		eventId: e.targetEventId,
		authorHint: null,
		relayHints: []
	}) : null;
	return i ? {
		event: i.event,
		relayHints: r.relayHints
	} : null;
}
function Le(e) {
	let t = `post-history-repost:${++Fe}`, n = 0, r = O(y({}));
	function i(e) {
		let n = K(e);
		return n ? {
			targetEventId: n.eventId,
			authorHint: n.authorHint,
			relayHints: n.relayHints,
			relationKind: "repost",
			sourceEventId: e.eventId,
			scopeKey: t
		} : null;
	}
	function a(n) {
		e.resolver.getScopeRevision(t);
		let i = K(n);
		return {
			...B(n, i ? e.resolver.getTargetSnapshot(i.eventId) : null),
			saveFailed: b(r)[n.eventId] ?? !1
		};
	}
	async function o(t, a = !1) {
		let o = i(t), s = e.getPubkey(), c = n;
		if (!e.getShow() || !o || !s) return;
		let l = await re(I, s), u = () => n === c && e.getShow() && e.getPubkey() === s && e.getPosts().some((e) => e.eventId === t.eventId && e.deletedAt === void 0);
		if (!u()) return;
		let d = e.resolver.getTargetSnapshot(o.targetEventId), f = a ? await e.resolver.retryTarget(o) : await e.resolver.ensureTarget(o, { force: !!t.repostTarget && d?.status !== "resolved" });
		if (!u() || !f?.event) return;
		let p = K(t), m = p && V(f.event, p);
		if (m) try {
			await W.attachRepostTarget({
				outerEventId: t.eventId,
				target: m.event,
				relayHints: f.relayHints,
				localWriteScope: {
					ownerPubkeyHex: s,
					expectedRevision: l,
					isActive: u
				}
			}), u() && b(r)[t.eventId] && g(r, {
				...b(r),
				[t.eventId]: !1
			}, !0);
		} catch {
			u() && g(r, {
				...b(r),
				[t.eventId]: !0
			}, !0);
		}
	}
	return p(() => {
		let r = e.getPosts(), i = e.getPubkey();
		if (e.getShow() && i) {
			for (let e of r) H(e.kind) && e.deletedAt === void 0 && o(e).catch(() => void 0);
			return () => {
				n++, e.resolver.invalidateScope(t);
			};
		}
	}), E(() => {
		n++, e.resolver.invalidateScope(t);
	}), {
		suspend: () => {
			n++, e.resolver.invalidateScope(t);
		},
		getPreview: a,
		retry: (e) => {
			o(e, !b(r)[e.eventId]).catch(() => void 0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepliesBadgeButton.svelte
var Re = r("<span class=\"post-preview-replies-badge svelte-11vk23d\" aria-hidden=\"true\"> </span>"), ze = r("<!> <!>", 1), Be = {
	hash: "svelte-11vk23d",
	code: ".post-preview-replies-badge-button {width:36px;min-width:36px;min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-preview-replies-badge.svelte-11vk23d {display:inline-flex;align-items:center;justify-content:center;aspect-ratio:1;width:20px;height:20px;border-radius:999px;background:var(--btn-post-preview-action);color:var(--post-history-preview-footer-surface, var(--dialog-bg));font-size:0.6875rem;font-weight:700;line-height:20px;text-align:center;}\n            .post-preview-replies-badge-button.selected\n                .post-preview-replies-badge\n         {background-color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-preview-replies-badge-button:hover:not(:disabled)\n                    .post-preview-replies-badge\n             {background-color:var(--text);}\n    }"
};
function Ve(r, i) {
	t(i, !0), e(r, Be);
	let o = C(i, "tooltipContent", 19, () => i.ariaLabel), s = C(i, "className", 3, ""), p = N().overlayTarget;
	var g = n(), _ = m(g);
	a(_, () => ye, (e, t) => {
		t(e, {
			children: (e, t) => {
				var r = n(), c = m(r);
				a(c, () => pe, (e, t) => {
					t(e, {
						delayDuration: 500,
						children: (e, t) => {
							var r = ze(), c = m(r);
							{
								let e = (e, t) => {
									let n = () => (t?.()).props, r = k(() => {
										let { onclick: e, ...t } = n();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									{
										let t = k(() => `post-preview-replies-badge-button ${s()}`);
										q(e, f({
											type: "button",
											get class() {
												return b(t);
											},
											get ariaLabel() {
												return i.ariaLabel;
											},
											contentLayout: "icon",
											shape: "circle",
											get selected() {
												return i.selected;
											},
											onClick: (e) => {
												i.onClick(), typeof b(r).tooltipOnclick == "function" && b(r).tooltipOnclick(e);
											}
										}, () => b(r).restProps, {
											children: (e, t) => {
												var n = Re(), r = h(n, !0);
												T(() => l(r, i.count)), u(e, n);
											},
											$$slots: { default: !0 }
										}));
									}
								};
								a(c, () => ue, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var g = S(c, 2);
							a(g, () => le, (e, t) => {
								t(e, {
									get to() {
										return p;
									},
									children: (e, t) => {
										var r = n(), i = m(r);
										a(i, () => ve, (e, t) => {
											t(e, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (e, t) => {
													v();
													var n = d();
													T(() => l(n, o())), u(e, n);
												},
												$$slots: { default: !0 }
											});
										}), u(e, r);
									},
									$$slots: { default: !0 }
								});
							}), u(e, r);
						},
						$$slots: { default: !0 }
					});
				}), u(e, r);
			},
			$$slots: { default: !0 }
		});
	}), u(r, g), c();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryReactionActionButton.svelte
function He(e, t) {
	Ve(e, {
		className: "post-preview-reactions-button",
		get count() {
			return t.count;
		},
		get ariaLabel() {
			return t.ariaLabel;
		},
		get selected() {
			return t.expanded;
		},
		get onClick() {
			return t.onToggle;
		}
	});
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryDirectReplyRepairSaveService.ts
var Z = {
	status: "saved",
	savedParentEventIds: [],
	savedDirectReplyCount: 0,
	deletedEventIds: [],
	deletionConfirmationIncomplete: !1
};
function Ue(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.parentEventId || !n.event?.id || !n.event.pubkey || ![
			1,
			42,
			1111
		].includes(n.event.kind)) continue;
		let e = t.get(n.event.id);
		t.set(n.event.id, {
			parentEventId: n.parentEventId,
			event: n.event,
			relayUrls: Array.from(/* @__PURE__ */ new Set([...e?.relayUrls ?? [], ...n.relayUrls ?? []]))
		});
	}
	return Array.from(t.values());
}
function We(e, t) {
	return e.filter((e) => t.get(e.event.pubkey)?.has(e.event.id)).map((e) => e.event.id);
}
function Q(e) {
	return {
		...e,
		status: "cancelled",
		savedParentEventIds: [],
		savedDirectReplyCount: 0
	};
}
var Ge = new class {
	deletionFetchService;
	deletionRequestsRepository;
	childInteractionsRepository;
	now;
	constructor(e = {}) {
		this.deletionFetchService = e.deletionFetchService ?? _e, this.deletionRequestsRepository = e.deletionRequestsRepository ?? me, this.childInteractionsRepository = e.childInteractionsRepository ?? G, this.now = e.now ?? Date.now;
	}
	saveRepairDirectReplies(e, t) {
		let n = !0, r = null, i = () => n && t.isActive?.() !== !1;
		return {
			promise: (async () => {
				let n = Ue(t.items);
				if (n.length === 0) return Z;
				let a = await this.filterKnownDeletedDirectReplies(n), o = a.deletedEventIds;
				if (!i()) return Q({
					...Z,
					deletedEventIds: o
				});
				let s = a.visibleItems, c = !1;
				if (s.length > 0) {
					r = this.deletionFetchService.fetchDeletionRequests(e, {
						targets: s.map((e) => ({
							event: e.event,
							relayUrls: e.relayUrls
						})),
						relayHints: t.relayHints,
						relayConfig: t.relayConfig
					});
					let n = await r.promise;
					if (r = null, !i() || n.status === "cancelled") return Q({
						...Z,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c || n.status !== "success"
					});
					if (c = n.status !== "success", n.events.length > 0 && await this.deletionRequestsRepository.upsertValidDeletionRequests({
						targetEvents: s.map((e) => e.event),
						deletionEvents: n.events,
						fetchedAt: n.fetchedAt
					}), !i()) return Q({
						...Z,
						deletedEventIds: o,
						deletionConfirmationIncomplete: c
					});
					let a = await this.filterKnownDeletedDirectReplies(s);
					s = a.visibleItems, o = Array.from(/* @__PURE__ */ new Set([...o, ...a.deletedEventIds]));
				}
				if (!i()) return Q({
					...Z,
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				});
				let l = await this.saveVisibleDirectReplies(s, t.fetchedAt ?? this.now(), i, t.expectedChildGeneration);
				return i() ? {
					...l,
					status: "saved",
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				} : Q({
					...l,
					deletedEventIds: o,
					deletionConfirmationIncomplete: c
				});
			})(),
			cancel: () => {
				n = !1, r?.cancel();
			}
		};
	}
	async filterKnownDeletedDirectReplies(e) {
		let t = We(e, await this.deletionRequestsRepository.getDeletedTargets(e.map((e) => ({
			targetAuthorPubkey: e.event.pubkey,
			targetEventId: e.event.id
		}))));
		await this.purgeDeletedReplyCache(t);
		let n = new Set(t);
		return {
			visibleItems: e.filter((e) => !n.has(e.event.id)),
			deletedEventIds: t
		};
	}
	async purgeDeletedReplyCache(e) {
		for (let t of new Set(e)) await this.childInteractionsRepository.deleteChildInteractionByEventId(t);
	}
	async saveVisibleDirectReplies(e, t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = i.get(t.parentEventId) ?? [];
			e.push({
				event: t.event,
				...t.relayUrls ? { relayUrls: t.relayUrls } : {}
			}), i.set(t.parentEventId, e);
		}
		let a = [], o = 0;
		for (let [e, s] of i.entries()) {
			if (!n()) break;
			let i = await this.childInteractionsRepository.upsertChildInteractions({
				parentEventId: e,
				events: s,
				fetchedAt: t,
				expectedChildGeneration: r
			}), c = i.insertedCount + i.updatedCount;
			c > 0 && (a.push(e), o += c);
		}
		return {
			status: "saved",
			savedParentEventIds: a,
			savedDirectReplyCount: o
		};
	}
}(), $ = [
	"reply",
	"reaction",
	"quote"
];
function Ke(e) {
	let t = e ?? $;
	return Array.from(new Set(t.filter((e) => e === "reply" || e === "reaction" || e === "quote")));
}
function qe(e, t) {
	let n = Ke(t.relationKinds);
	return {
		source: e,
		relationKinds: n,
		parentEventIds: Array.from(new Set(t.savedParentEventIds)),
		shouldRefreshQuotePreviews: n.includes("quote") && t.quoteRepairApplied
	};
}
var Je = 6e3, Ye = 8, Xe = $, Ze = {
	status: "success",
	targetParentEventIds: [],
	checkedParentEventIds: [],
	savedParentEventIds: [],
	savedDirectReplyCount: 0,
	attemptedChunkCount: 0,
	saturatedChunkCount: 0,
	incompleteParentEventIds: [],
	deletionConfirmationIncomplete: !1
};
function Qe() {
	let e = Math.random().toString(36).slice(2, 10);
	return `post-history-visible-relation-repair-${Date.now().toString(36)}-${e}`;
}
function $e(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) if ([
		1,
		42,
		1111
	].includes(r.kind) && r.pubkeyHex === e && r.eventId && !n.has(r.eventId) && (n.set(r.eventId, r), n.size >= 150)) break;
	return Array.from(n.values());
}
function et(e, t) {
	return t.includeDirectReplies ? [
		1,
		42,
		1111
	].flatMap((t) => Y(e.filter((e) => e.kind === t), 30).map((e) => ({
		posts: e,
		depth: 0
	}))) : Y(e, 30).map((e) => ({
		posts: e,
		depth: 0
	}));
}
function tt(e) {
	return Array.from(e.values()).map((e) => ({
		event: e.event,
		relayUrls: Array.from(e.relayUrls).sort((e, t) => e.localeCompare(t))
	})).sort((e, t) => e.event.created_at === t.event.created_at ? e.event.id.localeCompare(t.event.id) : t.event.created_at - e.event.created_at);
}
var nt = new class {
	directReplySaveService;
	childInteractionsRepository;
	quoteVisibleRangeRepairExecutor;
	console;
	setTimeoutFn;
	clearTimeoutFn;
	now;
	constructor(e = {}) {
		this.directReplySaveService = e.directReplySaveService ?? Ge, this.childInteractionsRepository = e.childInteractionsRepository ?? G, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (globalThis.console === void 0 ? {
			warn: () => void 0,
			error: () => void 0
		} : globalThis.console), this.setTimeoutFn = e.setTimeoutFn ?? ((e, t) => setTimeout(e, t)), this.clearTimeoutFn = e.clearTimeoutFn ?? ((e) => clearTimeout(e)), this.now = e.now ?? Date.now;
	}
	repairVisibleRangeChildInteractions(e, t) {
		return this.repairVisibleRangeChildInteractionsInternal(e, t, {
			includeDirectReplies: !0,
			includeReactions: !0
		});
	}
	repairRelatedCardReactions(e, t) {
		let n = !0, r = /* @__PURE__ */ new Set(), i = () => n && t.isActive?.() !== !1, a = /* @__PURE__ */ new Map();
		for (let e of t.targets) {
			if (!e.eventId) continue;
			let t = a.get(e.eventId);
			a.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: M.sanitizeExternalRelayUrls([...t?.relayHints ?? [], ...e.relayHints])
			});
		}
		let o = Array.from(a.values()).slice(0, 150), s = o.map((e) => e.eventId), c = oe(I);
		return {
			promise: (async () => {
				if (o.length === 0) return {
					status: "success",
					targetEventIds: s
				};
				let n = !1, a = [];
				for (let e = 0; e < o.length; e += 30) a.push(o.slice(e, e + 30).map((e) => ({
					eventId: e.eventId,
					kind: 1,
					relayHints: e.relayHints,
					reactionTarget: {
						eventId: e.eventId,
						targetAuthorPubkey: e.targetAuthorPubkey,
						targetKind: e.targetKind
					}
				})));
				let l = 0, u = async (a, o) => {
					if (!i()) return;
					let s = this.fetchCandidates(e, a, t.relayConfig, {
						includeDirectReplies: !1,
						includeReactions: !0
					});
					r.add(s);
					let l = await s.promise;
					if (r.delete(s), !i() || l.status === "cancelled") return;
					let d = o === 0 && l.requiresFallback;
					l.status !== "success" && !d && (n = !0);
					let f = this.toReactionItems(a.map((e) => e.reactionTarget ?? { eventId: e.eventId }), l.items);
					if (f.length > 0 && await this.saveReactionInteractions(f, l.fetchedAt, i, await c), l.requiresFallback) {
						if (o === 0) for (let e = 0; e < a.length; e += 10) await u(a.slice(e, e + 10), 1);
						else l.coverageSaturated && (n = !0);
					}
				}, d = async () => {
					for (; i();) {
						let e = a[l++];
						if (!e) return;
						await u(e, 0);
					}
				};
				return await Promise.all(Array.from({ length: Math.min(2, a.length) }, () => d())), {
					status: i() ? n ? "partial" : "success" : "cancelled",
					targetEventIds: s
				};
			})(),
			cancel: () => {
				n = !1, r.forEach((e) => e.cancel());
			}
		};
	}
	repairVisibleRangeRelations(e, t) {
		let n = Ke(t.relationKinds ?? Xe), r = this.repairVisibleRangeChildInteractionsInternal(e, t, {
			includeDirectReplies: n.includes("reply"),
			includeReactions: n.includes("reaction")
		});
		return {
			promise: (async () => {
				let i = await r.promise, a = !1, o = t.quoteVisibleRangeRepairExecutor ?? this.quoteVisibleRangeRepairExecutor;
				return n.includes("quote") && i.status !== "cancelled" && t.isActive?.() !== !1 && o && (await o(e, t), a = !0), {
					...i,
					relationKinds: n,
					quoteRepairApplied: a
				};
			})(),
			cancel: () => r.cancel()
		};
	}
	repairVisibleRangeChildInteractionsInternal(e, t, n) {
		let r = !0, i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = () => r && t.isActive?.() !== !1, s = $e(t.ownerPubkeyHex, t.visiblePosts), c = s.map((e) => e.eventId), l = oe(I);
		return {
			promise: (async () => {
				if (s.length === 0) return {
					...Ze,
					targetParentEventIds: c
				};
				let r = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), d = 0, f = 0, p = 0, m = !1, h = !1, g = async (s) => {
					let c = [], g = 0, _ = Math.min(2, s.length), v = async () => {
						for (; o();) {
							let _ = s[g++];
							if (!_) return;
							f += 1;
							let v = this.fetchCandidates(e, _.posts, t.relayConfig, n);
							i.add(v);
							let y = await v.promise;
							if (i.delete(v), !o() || y.status === "cancelled") return;
							let b = _.depth === 0 && y.requiresFallback;
							y.status !== "success" && !b && (h = !0), y.requiresFallback && (p += 1, _.depth === 0 ? c.push(...Y(_.posts, 10).map((e) => ({
								posts: e,
								depth: 1
							}))) : y.coverageSaturated && (h = !0));
							let x = n.includeDirectReplies ? this.toDirectReplyItems(_.posts, y.items) : [], S = n.includeReactions ? this.toReactionItems(_.posts.map((e) => ({
								eventId: e.eventId,
								targetAuthorPubkey: e.pubkeyHex,
								targetKind: e.kind
							})), y.items) : [], C = y.status === "success" && !y.coverageSaturated && !(_.depth === 0 && y.requiresFallback);
							if (x.length === 0 && S.length === 0) C && _.posts.forEach((e) => u.add(e.eventId));
							else {
								if (x.length > 0) {
									let n = this.directReplySaveService.saveRepairDirectReplies(e, {
										items: x,
										expectedChildGeneration: await l,
										relayHints: [...this.collectParentRelayHints(_.posts), ...y.relayUrls],
										relayConfig: t.relayConfig,
										fetchedAt: y.fetchedAt,
										isActive: o
									});
									a.add(n);
									let i = await n.promise;
									if (a.delete(n), !o() || i.status === "cancelled") return;
									i.savedParentEventIds.forEach((e) => r.add(e)), d += i.savedDirectReplyCount, m ||= i.deletionConfirmationIncomplete;
								}
								if (S.length > 0) {
									let e = await this.saveReactionInteractions(S, y.fetchedAt, o, await l);
									if (!o()) return;
									e.savedParentEventIds.forEach((e) => r.add(e));
								}
								C && _.posts.forEach((e) => u.add(e.eventId));
							}
						}
					};
					return await Promise.all(Array.from({ length: _ }, () => v())), c;
				}, _ = await g(et(s, n));
				if (o() && _.length > 0 && await g(_), !o()) return {
					...Ze,
					status: "cancelled",
					targetParentEventIds: c,
					attemptedChunkCount: f,
					saturatedChunkCount: p,
					deletionConfirmationIncomplete: m
				};
				let v = c.filter((e) => !u.has(e));
				return {
					status: h || v.length > 0 ? "partial" : "success",
					targetParentEventIds: c,
					checkedParentEventIds: Array.from(u),
					savedParentEventIds: Array.from(r),
					savedDirectReplyCount: d,
					attemptedChunkCount: f,
					saturatedChunkCount: p,
					incompleteParentEventIds: v,
					deletionConfirmationIncomplete: m
				};
			})(),
			cancel: () => {
				r = !1, i.forEach((e) => e.cancel()), a.forEach((e) => e.cancel());
			}
		};
	}
	toDirectReplyItems(e, t) {
		let n = new Map(e.flatMap((e) => {
			let t = fe({
				event: {
					id: e.eventId,
					kind: e.kind,
					tags: e.tags,
					created_at: e.createdAt
				},
				relayHints: [
					...e.relayHints,
					...e.acceptedRelays,
					...e.fetchedRelays ?? []
				]
			});
			return t ? [[e.eventId, t]] : [];
		}));
		return t.flatMap((e) => {
			let t = F(e.event).parentId, r = t ? n.get(t) : null;
			return !t || !r || !de({
				child: e.event,
				parent: r
			}).valid ? [] : [{
				parentEventId: t,
				event: e.event,
				relayUrls: e.relayUrls
			}];
		});
	}
	toReactionItems(e, t) {
		let n = new Map(e.map((e) => [e.eventId, e]));
		return t.flatMap((e) => {
			if (e.event.kind !== 7) return [];
			let t = ae(e.event).reference, r = t ? n.get(t.eventId) : void 0;
			return !t || !r || !U(t, r) || e.event.id === t.eventId ? [] : [{
				parentEventId: t.eventId,
				event: e.event,
				relayUrls: e.relayUrls,
				reactionTarget: r
			}];
		});
	}
	async saveReactionInteractions(e, t, n, r) {
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = i.get(t.parentEventId) ?? [];
			e.push({
				event: t.event,
				relayUrls: t.relayUrls
			}), i.set(t.parentEventId, e), t.reactionTarget && a.set(t.parentEventId, t.reactionTarget);
		}
		let o = [];
		for (let [e, s] of i.entries()) {
			if (!n()) break;
			let i = a.get(e), c = await this.childInteractionsRepository.upsertChildInteractions({
				parentEventId: e,
				expectedChildGeneration: r,
				events: s,
				fetchedAt: t,
				...i && (i.targetKind != null || i.targetAuthorPubkey != null) ? { reactionTarget: i } : {}
			});
			c.insertedCount + c.updatedCount > 0 && o.push(e);
		}
		return { savedParentEventIds: o };
	}
	fetchCandidates(e, t, n, r) {
		let { destinationRelayUrls: i, coverageRelayUrls: a } = this.resolveRelayPlan(t, n), o = t.map((e) => e.eventId), s = Qe(), c = `${s}:0`, l = L(s), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = 0, _ = !1, v, y, b, x, S, C, w = () => {
			v?.unsubscribe?.(), v = void 0, y?.unsubscribe?.(), y = void 0, b?.unsubscribe?.(), b = void 0, x?.unsubscribe?.(), x = void 0;
		}, T = (e) => {
			let t = tt(u), n = new Set(Array.from(d.entries()).filter(([, e]) => e >= 250).map(([e]) => e)), r = a.some((e) => n.has(e)), o = a.length > 0 && a.every((e) => f.has(e));
			return {
				status: e === "cancelled" ? "cancelled" : e === "error" ? "error" : o ? "success" : "partial",
				items: t,
				rawCount: g,
				requiresFallback: n.size > 0,
				coverageSaturated: r,
				fetchedAt: this.now(),
				relayUrls: i,
				eoseRelayUrls: Array.from(f).sort(),
				closedRelayUrls: Array.from(p).sort(),
				errorRelayUrls: Array.from(m).sort(),
				downRelayUrls: Array.from(h).sort(),
				perRelayRawCounts: Array.from(d.entries()).map(([e, t]) => ({
					relayUrl: e,
					rawCount: t
				})).sort((e, t) => e.relayUrl.localeCompare(t.relayUrl))
			};
		};
		return {
			promise: new Promise((n) => {
				let a = (e) => {
					_ || (_ = !0, S?.finish(e === "complete" ? "complete" : e), n(T(e)));
				};
				C = a, S = new R(Je, (e) => a(e === "cancelled" ? "cancelled" : e === "timeout" ? "timeout" : "complete"), {
					now: this.now,
					setTimeoutFn: this.setTimeoutFn,
					clearTimeoutFn: this.clearTimeoutFn
				}), S.add(w);
				try {
					if (o.length === 0) {
						a("complete");
						return;
					}
					y = e.createAllMessageObservable?.().subscribe({ next: (e) => {
						this.handleCandidateMessagePacket({
							packet: e,
							targetSubId: c,
							destinationRelayUrls: i,
							eoseRelayUrls: f,
							closedRelayUrls: p,
							perRelayRawCounts: d
						});
					} }), b = e.createAllErrorObservable?.().subscribe({ next: (e) => {
						let t = this.sanitizeCandidateRelayUrl(e.from, i);
						t && m.add(t);
					} }), x = e.createConnectionStateObservable?.().subscribe({ next: (e) => {
						let t = this.sanitizeCandidateRelayUrl(e.from, i);
						t && (e.state === "error" || e.state === "rejected" || e.state === "terminated") && h.add(t);
					} }), v = ie(e, l, { on: i.length > 0 ? { relays: i } : { defaultReadRelays: !0 } }).subscribe({
						next: (e) => {
							g += 1;
							let t = this.sanitizeCandidateRelayUrl(e.from, i);
							this.handleCandidatePacket(u, e, t);
						},
						complete: () => a("complete"),
						error: (e) => {
							this.console.error("post_history_visible_child_interaction_repair_fetch_error", e), a("error");
						}
					});
					let n = r.includeDirectReplies ? t.flatMap((e) => e.kind === 1 ? [1, 1111] : e.kind === 42 ? [42] : e.kind === 1111 ? [1111] : []) : [], s = Array.from(/* @__PURE__ */ new Set([...n, ...r.includeReactions ? [7] : []])).sort((e, t) => e - t);
					l.emit({
						kinds: s,
						"#e": o,
						limit: 250
					}), l.over();
				} catch (e) {
					this.console.error("post_history_visible_child_interaction_repair_request_error", e), a("error");
				}
			}),
			cancel: () => C?.("cancelled")
		};
	}
	handleCandidatePacket(e, t, n) {
		let r = t.event;
		if (!r?.id || ![
			1,
			7,
			42,
			1111
		].includes(r.kind)) return;
		let i = e.get(r.id);
		i ? P(i.event, r) ? n && i.relayUrls.add(n) : this.console.warn("post_history_visible_child_interaction_repair_packet_conflict") : e.set(r.id, {
			event: r,
			relayUrls: new Set(n ? [n] : [])
		});
	}
	collectParentRelayHints(e) {
		return e.flatMap((e) => [
			...e.relayHints ?? [],
			...e.acceptedRelays ?? [],
			...e.fetchedRelays ?? []
		]);
	}
	handleCandidateMessagePacket(e) {
		let t = this.sanitizeCandidateRelayUrl(e.packet.from, e.destinationRelayUrls);
		t && (e.packet.type === "EVENT" && e.packet.subId === e.targetSubId ? e.perRelayRawCounts.set(t, (e.perRelayRawCounts.get(t) ?? 0) + 1) : e.packet.type === "EOSE" && e.packet.subId === e.targetSubId ? e.eoseRelayUrls.add(t) : e.packet.type === "CLOSED" && e.packet.subId === e.targetSubId && e.closedRelayUrls.add(t));
	}
	sanitizeCandidateRelayUrl(e, t) {
		let n = M.sanitizeExternalRelayUrls(typeof e == "string" ? [e] : [], { limit: 1 })[0] ?? null;
		return n && t.includes(n) ? n : null;
	}
	resolveRelayPlan(e, t) {
		let n = this.collectParentRelayHints(e), r = se(n, Ye);
		if (r !== null) return {
			destinationRelayUrls: r,
			coverageRelayUrls: ce()
		};
		let i = t ? M.sanitizeExternalRelayUrls(M.extractReadRelays(t)) : [], a = t ? M.sanitizeExternalRelayUrls(M.extractWriteRelays(t)) : [], o = M.sanitizeExternalRelayUrls(ee), s = i.length > 0 ? i : a.length > 0 ? a : o, c = i.length > 0 ? a.filter((e) => !s.includes(e)) : [], l = M.sanitizeExternalRelayUrls(n, { limit: Ye });
		return {
			coverageRelayUrls: s,
			destinationRelayUrls: M.sanitizeExternalRelayUrls([
				...s,
				...c,
				...l
			])
		};
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRelatedReactions.svelte.ts
function rt(e) {
	let t = O({}), n = O({}), r = O({}), i = O(0), a = 0, o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map(), l = null, u = e.source ?? "related-card-display", d = e.profileSync.subscribe((t, r) => {
		e.getShow() && g(n, {
			...b(n),
			[t]: r
		});
	}), f = () => {
		g(i, b(i) + 1);
	}, m = () => {
		document.visibilityState === "visible" && g(i, b(i) + 1);
	};
	p(() => {
		if (e.getShow() && typeof window < "u") return window.addEventListener("online", f), document.addEventListener("visibilitychange", m), () => {
			window.removeEventListener("online", f), document.removeEventListener("visibilitychange", m);
		};
	}), E(() => {
		a += 1, l?.cancel(), typeof window < "u" && (window.removeEventListener("online", f), document.removeEventListener("visibilitychange", m)), d();
	});
	function h(e) {
		return b(r)[e] ? Ee(b(t)[e] ?? [], b(n)) : null;
	}
	function _(e) {
		return !!b(r)[e];
	}
	p(() => {
		let d = e.getShow(), f = e.getPubkeyHex() ?? "", p = e.getRxNostr(), m = e.getRelayConfig(), h = e.getTargets(), _ = b(i);
		if (!d) {
			a += 1, l?.cancel(), l = null, s.clear(), (e.getSessionOpen ?? e.getShow)() || (o.clear(), c.clear(), g(t, {}), g(r, {}));
			return;
		}
		let v = ++a, y = !0, x = null, S = () => y && v === a && e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, C = /* @__PURE__ */ new Map();
		for (let e of h) {
			if (!e.eventId) continue;
			let t = C.get(e.eventId);
			C.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...t?.relayHints ?? [], ...e.relayHints])).sort()
			});
		}
		let w = Array.from(C.values()), T = w.map((e) => e.eventId), E = JSON.stringify(Object.entries(m ?? {}).sort(([e], [t]) => e.localeCompare(t))), D = (e) => JSON.stringify([
			e.eventId,
			e.targetAuthorPubkey,
			e.targetKind,
			e.relayHints,
			E
		]), O = (e) => JSON.stringify([D(e), _]), k = new Set(w.map((e) => e.eventId));
		for (let e of c.keys()) k.has(e) || c.delete(e);
		return w.forEach((e) => c.set(e.eventId, O(e))), (async () => {
			let a = await J.getReactionRecordsForParents?.(T, w) ?? (await Promise.all(T.map((e) => J.getReactionRecords(e, C.get(e))))).flat();
			if (!S()) return;
			let d = {};
			for (let e of T) d[e] = a.filter((t) => t.parentEventId === e);
			g(t, {
				...b(t),
				...d
			}), g(r, {
				...b(r),
				...Object.fromEntries(T.map((e) => [e, !0]))
			});
			for (let t of a) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && g(n, {
					...b(n),
					[t.authorPubkey]: r
				});
			}
			if (!p || T.length === 0 || (await xe({
				source: u,
				parentEventIds: T,
				rxNostr: p,
				relayConfig: m,
				isActive: S
			}), !S())) return;
			let h = await J.getReactionRecordsForParents?.(T, w) ?? (await Promise.all(T.map((e) => J.getReactionRecords(e, C.get(e))))).flat();
			if (!S()) return;
			for (let e of T) d[e] = h.filter((t) => t.parentEventId === e);
			g(t, {
				...b(t),
				...d
			});
			let _ = w.filter((e) => !o.has(D(e)) && !s.has(e.eventId));
			if (!_.length) return;
			_.forEach((e) => s.add(e.eventId));
			let v = new Map(_.map((e) => [e.eventId, O(e)]));
			x = nt.repairRelatedCardReactions(p, {
				targets: _,
				relayConfig: m,
				isActive: S
			}), l = x;
			let y = await x.promise.catch(() => ({
				status: "partial",
				targetEventIds: _.map((e) => e.eventId)
			}));
			l === x && (l = null), x = null, _.forEach((e) => s.delete(e.eventId));
			let E = e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === p, k = _.some((e) => {
				let t = c.get(e.eventId);
				return t !== void 0 && (y.status === "cancelled" || t !== v.get(e.eventId));
			});
			if (E && k && g(i, b(i) + 1), !S() || y.status === "cancelled") return;
			if (y.status === "success") {
				let e = new Set(y.targetEventIds);
				_.filter((t) => e.has(t.eventId)).forEach((e) => o.add(D(e)));
			}
			let A = await J.getReactionRecordsForParents?.(T, w) ?? (await Promise.all(T.map((e) => J.getReactionRecords(e, C.get(e))))).flat();
			if (!S()) return;
			for (let e of T) d[e] = A.filter((t) => t.parentEventId === e);
			g(t, {
				...b(t),
				...d
			});
			for (let t of A) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && g(n, {
					...b(n),
					[t.authorPubkey]: r
				});
			}
			let j = await xe({
				source: u,
				parentEventIds: T,
				rxNostr: p,
				relayConfig: m,
				isActive: S
			});
			if (S() && j.deletedReactionEventIds.length > 0) {
				let e = await J.getReactionRecordsForParents?.(T, w) ?? (await Promise.all(T.map((e) => J.getReactionRecords(e, C.get(e))))).flat();
				if (!S()) return;
				for (let t of T) d[t] = e.filter((e) => e.parentEventId === t);
				g(t, {
					...b(t),
					...d
				});
			}
		})().catch(() => void 0), () => {
			y = !1, x?.cancel(), l === x && (l = null);
		};
	});
	async function v(i) {
		let o = a, s = e.getPubkeyHex(), c = e.getRxNostr(), l = e.getTargets().filter((e) => i.includes(e.eventId)), u = await Promise.all(l.map((e) => J.getReactionRecords(e.eventId, e)));
		o === a && e.getShow() && e.getPubkeyHex() === s && e.getRxNostr() === c && l.forEach((i, a) => {
			g(t, {
				...b(t),
				[i.eventId]: u[a]
			}), g(r, {
				...b(r),
				[i.eventId]: !0
			});
			for (let t of u[a]) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && g(n, {
					...b(n),
					[t.authorPubkey]: r
				});
			}
		});
	}
	function y() {
		a++, l?.cancel(), l = null, s.clear();
	}
	return {
		getReadModel: h,
		isLoaded: _,
		refreshCachedReactions: v,
		suspend: y
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPostActionUiController.svelte.ts
function it() {
	let e = O(y({})), t = O(!1), n = O(null);
	function r(t) {
		return b(e)[t] ?? !1;
	}
	function i(t, n) {
		g(e, {
			...b(e),
			[t]: n
		}, !0);
	}
	function a() {
		Object.keys(b(e)).length > 0 && g(e, {}, !0);
	}
	function o(e) {
		g(t, e, !0), e || g(n, null);
	}
	function s(e) {
		a(), g(n, e, !0), g(t, !0);
	}
	function c() {
		o(!1);
	}
	function l() {
		g(n, null);
	}
	function u() {
		g(t, !1), g(n, null);
	}
	function d() {
		g(e, {}, !0), u();
	}
	return {
		get deleteConfirmOpen() {
			return b(t);
		},
		get deleteTargetPost() {
			return b(n);
		},
		isPostMenuOpen: r,
		setPostMenuOpen: i,
		closeAllPostItemMenus: a,
		setDeleteConfirmOpen: o,
		openDeleteConfirm: s,
		cancelDeleteConfirm: c,
		clearDeleteTarget: l,
		resetDeleteConfirmation: u,
		reset: d
	};
}
export { qe as a, Ie as c, Ne as d, $ as i, Le as l, rt as n, He as o, nt as r, Ve as s, it as t, Pe as u };
