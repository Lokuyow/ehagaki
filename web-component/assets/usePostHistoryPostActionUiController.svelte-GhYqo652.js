import { B as e, Dt as t, Et as n, F as r, G as i, H as a, K as o, Mt as s, Nt as c, P as l, Pt as u, St as d, X as f, _t as p, a as m, at as h, b as g, ct as _, dt as v, ft as y, ht as b, j as x, lt as S, mt as C, o as w, pt as T, q as E, r as D, rt as O, s as k, t as A, yt as j } from "./index-client-DEFG3Gqk.js";
import { n as M } from "./appRuntimeEnvironment-Bzv9wJOh.js";
import { i as N, n as P } from "./relayConfigUtils-56ujWwKF.js";
import { o as F, u as I } from "./postHistoryEventUtils-iuP8QpIA.js";
import { Z as ee } from "./LoadingPlaceholder-YrD8D_td.js";
import { n as L } from "./ehagakiDb-DuXS0XPm.js";
import { n as R } from "./operation-BO0VLD7w.js";
import { $ as z, Q as B, b as V, h as H, lt as U, m as W, t as G, v as te, x as K, y as ne } from "./postHistoryRepository-Bu2z041i.js";
import { a as re, r as ie } from "./hostRelayRuntime-SryW0auD.js";
import { i as ae } from "./query-CUABraKG.js";
import { r as oe } from "./postHistoryContextFetchService-DB7akfzB.js";
import { r as se, t as q } from "./Button-Cqrg0_jX.js";
import { A as ce, C as le, O as ue, S as de, i as J, j as fe, k as pe, m as me, n as he, v as ge, x as _e } from "./usePostHistoryEmojiState.svelte-_Y95EyLM.js";
import { t as Y } from "./arrayUtils-kRQBpBQw.js";
import { c as ve, o as ye, s as be } from "./postReactionUtils-C8gCaYhG.js";
import { c as xe, v as Se } from "./App-CW2Ynbk9.js";
import { D as Ce, O as we, T as Te, u as Ee } from "./postBroadcastService-DaUJZYg6.js";
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepostPreview.svelte
var De = E("<p> </p>"), Oe = E("<div class=\"repost-target-label svelte-1l68xot\"> </div>"), ke = E("<div class=\"repost-channel-row svelte-1l68xot\"><span> </span> <strong> </strong></div>"), X = E("<!> <!>", 1), Ae = E("<p role=\"status\"> </p> <!>", 1), je = E("<div class=\"post-history-repost svelte-1l68xot\"><div class=\"post-history-repost-label svelte-1l68xot\"><span class=\"post-history-repost-title svelte-1l68xot\"><!> <span class=\"post-history-repost-icon svg-icon svelte-1l68xot\" aria-hidden=\"true\"></span> <span> </span></span> <!></div> <!> <!></div>"), Me = {
	hash: "svelte-1l68xot",
	code: ".post-history-repost.svelte-1l68xot {min-width:0;}.repost-target-label.svelte-1l68xot {padding:4px 6px;color:var(--text-muted);}.repost-channel-row.svelte-1l68xot {display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px;overflow-wrap:anywhere;}.post-history-repost-label.svelte-1l68xot {display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--btn-post-preview-action);}.post-history-repost-title.svelte-1l68xot {display:flex;align-items:center;gap:6px;min-width:0;padding-left:6px;}.post-history-repost-icon.svelte-1l68xot {--icon-size: 22px;--svg: currentColor;mask-image:var(--ehagaki-icon-7265706f73742e737667);}.post-history-repost-label .post-history-menu-trigger {inline-size:28px;block-size:28px;min-inline-size:28px;min-block-size:28px;flex:0 0 28px;padding:0;}"
};
function Ne(l, p) {
	t(p, !0), x(l, Me);
	let m = () => k(ee, "$_", h), [h, b] = w(), S = D(p, "channelText", 3, null), E = D(p, "targetLabel", 3, null), A = D(p, "scrollRoot", 3, null), j = D(p, "emojiLoadStateByUrl", 19, () => ({})), M = D(p, "emojiImageMetaByUrl", 19, () => ({})), N = d(() => p.preview.event ? te(p.preview.event, p.preview.relayHints) : null), P = d(() => p.preview.status === "deleted" ? "repost.targetDeleted" : p.preview.status === "unsupported-target-kind" ? "repost.targetUnsupported" : p.preview.status === "unsupported-reference" ? "repost.referenceUnsupported" : p.preview.status === "invalid-reference" || p.preview.status === "invalid-target" || p.preview.status === "outer-target-kind-mismatch" ? "repost.targetInvalid" : p.preview.status === "loading" ? "repost.targetLoading" : "repost.targetMissing");
	var F = je(), I = v(F), L = v(I), R = v(L);
	r(R, () => p.author ?? u);
	var z = C(R, 4), B = T(z, !0);
	c(L);
	var V = C(L, 2), H = (e) => {
		var t = o(), n = y(t);
		r(n, () => p.menu ?? u, () => p.post, () => `repost-outer:${p.post.eventId}`), i(e, t);
	};
	e(V, (e) => {
		p.post.deletedAt !== void 0 && e(H);
	}), c(I);
	var U = C(I, 2), W = (e) => {
		var t = De(), n = T(t, !0);
		_((e) => a(n, e), [() => m()("postHistory.deleted")]), i(e, t);
	}, G = (t) => {
		var n = X(), l = y(n);
		Ce(l, {
			get event() {
				return p.preview.event;
			},
			get profile() {
				return p.preview.profile;
			},
			get model() {
				return p.model;
			},
			get loadSensitiveBody() {
				return p.loadSensitiveBody;
			},
			get scrollRoot() {
				return A();
			},
			get onImageOpen() {
				return p.onImageOpen;
			},
			get emojiLoadStateByUrl() {
				return j();
			},
			get emojiImageMetaByUrl() {
				return M();
			},
			topActions: (t) => {
				var n = X(), r = y(n), o = (e) => {
					var t = Oe(), n = T(t, !0);
					_(() => a(n, E())), i(e, t);
				};
				e(r, (e) => {
					E() && e(o);
				});
				var s = C(r, 2), l = (e) => {
					var t = ke(), n = v(t), r = T(n, !0), o = C(n, 2), s = T(o, !0);
					c(t), _((e) => {
						a(r, e), a(s, S());
					}, [() => m()("postHistory.channel")]), i(e, t);
				};
				e(s, (e) => {
					S() && e(l);
				}), i(t, n);
			},
			footerActions: (e) => {
				Te(e, {
					get post() {
						return O(N);
					},
					get onReplyPost() {
						return p.onReplyPost;
					},
					get onQuotePost() {
						return p.onQuotePost;
					},
					get onReactionPost() {
						return p.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = o(), n = y(t);
						r(n, () => p.reactionExtras ?? u, () => O(N)), i(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			},
			footerDetails: (e) => {
				var t = o(), n = y(t);
				r(n, () => p.reactionDetails ?? u, () => O(N)), i(e, t);
			},
			footerMenu: (e) => {
				var t = o(), n = y(t);
				r(n, () => p.menu ?? u, () => O(N), () => `repost-target:${p.post.eventId}:${O(N).eventId}`), i(e, t);
			},
			$$slots: {
				topActions: !0,
				footerActions: !0,
				footerDetails: !0,
				footerMenu: !0
			}
		});
		var d = C(l, 2), h = (e) => {
			var t = Ae(), n = y(t), r = T(n, !0), o = C(n, 2);
			q(o, {
				get onClick() {
					return p.onRetry;
				},
				children: (e, t) => {
					s();
					var n = f();
					_((e) => a(n, e), [() => m()("repost.retrySave")]), i(e, n);
				},
				$$slots: { default: !0 }
			}), _((e) => a(r, e), [() => m()("repost.targetSaveFailed")]), i(e, t);
		};
		e(d, (e) => {
			"saveFailed" in p.preview && p.preview.saveFailed && e(h);
		}), i(t, n);
	}, K = (t) => {
		var n = Ae(), r = y(n), o = T(r, !0), c = C(r, 2), l = (e) => {
			q(e, {
				get onClick() {
					return p.onRetry;
				},
				children: (e, t) => {
					s();
					var n = f();
					_((e) => a(n, e), [() => m()("postHistory.contextRetry")]), i(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		e(c, (e) => {
			(p.preview.status === "not-found" || p.preview.status === "error" || p.preview.status === "invalid-target") && e(l);
		}), _((e) => a(o, e), [() => m()(O(P))]), i(t, n);
	};
	e(U, (e) => {
		p.post.deletedAt === void 0 ? p.preview.status === "resolved" && p.preview.event && O(N) ? e(G, 1) : e(K, -1) : e(W);
	});
	var ne = C(U, 2), re = (t) => {
		var n = X(), a = y(n);
		{
			let t = (e) => {
				Te(e, {
					get post() {
						return p.post;
					},
					get onReplyPost() {
						return p.onReplyPost;
					},
					get onQuotePost() {
						return p.onQuotePost;
					},
					get onReactionPost() {
						return p.onReactionPost;
					},
					reactionExtras: (e) => {
						var t = o(), n = y(t);
						r(n, () => p.reactionExtras ?? u, () => p.post), i(e, t);
					},
					$$slots: { reactionExtras: !0 }
				});
			}, n = (t) => {
				var n = o(), a = y(n), s = (e) => {
					var t = o(), n = y(t);
					r(n, () => p.footerMenu, () => p.post), i(e, t);
				}, c = (e) => {
					var t = o(), n = y(t);
					r(n, () => p.menu ?? u, () => p.post, () => `repost-outer:${p.post.eventId}`), i(e, t);
				};
				e(a, (e) => {
					p.footerMenu ? e(s) : e(c, -1);
				}), i(t, n);
			}, s = d(() => ge(p.post.postedAt));
			we(a, {
				get formattedDate() {
					return O(s);
				},
				actions: t,
				trailing: n,
				$$slots: {
					actions: !0,
					trailing: !0
				}
			});
		}
		var s = C(a, 2);
		r(s, () => p.reactionDetails ?? u, () => p.post), i(t, n);
	};
	e(ne, (e) => {
		p.post.deletedAt === void 0 && (p.onReplyPost || p.onQuotePost || p.onReactionPost || p.footerMenu || p.menu) && e(re);
	}), c(F), _((e) => {
		g(F, "data-repost-event-id", p.post.eventId), a(B, e);
	}, [() => m()("repost.entry")]), i(l, F), n(), b();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryChannelDisplay.svelte.ts
function Pe({ getShow: e, getSessionOpen: t = e, getPosts: n, getRxNostr: r, getRelayConfig: i, getIsSearchMode: a }) {
	let o = j(b({})), s = 0, c = [];
	function l() {
		c = [];
	}
	function u() {
		s++, c.forEach((e) => e.release()), l();
	}
	function d() {
		u(), p(o, {}, !0);
	}
	function f(e, t) {
		if (e.kind !== 42) return null;
		if (!e.channelEventId) return t("postHistory.channelUnknown");
		let n = O(o)[e.channelEventId];
		return !n || n.status === "loading" ? t("postHistory.channelLoading") : n.status === "resolved" && n.name ? n.name : t("postHistory.channelUnknown");
	}
	return S(() => {
		t() || h(d);
	}), S(() => {
		if (e()) return () => {
			u();
		};
	}), S(() => {
		if (!e()) {
			u();
			return;
		}
		u();
		let t = n().filter((e) => e.kind === 42);
		if (t.length === 0) return;
		let d = Array.from(new Set(t.map((e) => e.channelEventId).filter((e) => typeof e == "string")));
		if (d.length === 0) return;
		let f = ++s, m = a() ? void 0 : r(), g = d.map((e) => {
			let n = P.sanitizeExternalRelayUrls(t.filter((t) => t.channelEventId === e).flatMap((e) => me(e, null)), { limit: 8 });
			return Se.resolveInternal({
				eventId: e,
				relayHints: n
			}, m, i());
		});
		c = g, p(o, {
			...h(() => O(o)),
			...Object.fromEntries(d.map((e) => [e, {
				status: "loading",
				name: null
			}]))
		}, !0), Promise.all(g.map((e) => e.cacheReady)).then((t) => {
			e() && f === s && p(o, {
				...O(o),
				...Object.fromEntries(t.map((e) => [e.context.eventId, _e(e.cache, !!m)]))
			}, !0);
		}).catch((e) => {
			console.error("チャンネル表示のキャッシュ解決に失敗しました:", e);
		}), Promise.all(g.map((e) => e.refresh)).then((t) => {
			e() && f === s && (l(), p(o, {
				...O(o),
				...Object.fromEntries(t.map((e) => [e.snapshot.context.eventId, {
					status: e.snapshot.context.name ? "resolved" : "failed",
					name: e.snapshot.context.name
				}]))
			}, !0));
		}).catch((e) => {
			f === s && l(), console.error("チャンネル表示のバックグラウンド解決に失敗しました:", e);
		});
	}), A(() => {
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
	let t = await G.getByEventId(e.sourceEventId), n = t && W(t), r = t?.repostTarget ?? (t && n ? await G.findRepostTargetSnapshot(t.pubkeyHex, n.eventId) : void 0), i = n && n.eventId === e.targetEventId && r ? V(r.rawEvent, {
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
	let t = `post-history-repost:${++Fe}`, n = 0, r = j(b({}));
	function i(e) {
		let n = e.deletedAt === void 0 ? W(e) : null;
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
		let i = W(n);
		return {
			...ne(n, i ? e.resolver.getTargetSnapshot(i.eventId) : null),
			saveFailed: O(r)[n.eventId] ?? !1
		};
	}
	async function o(t, a = !1) {
		let o = i(t), s = e.getPubkey(), c = n;
		if (!e.getShow() || !o || !s) return;
		let l = await z(L, s), u = () => n === c && e.getShow() && e.getPubkey() === s && e.getPosts().some((e) => e.eventId === t.eventId && e.deletedAt === void 0);
		if (!u()) return;
		let d = e.resolver.getTargetSnapshot(o.targetEventId), f = a ? await e.resolver.retryTarget(o) : await e.resolver.ensureTarget(o, { force: !!t.repostTarget && d?.status !== "resolved" });
		if (!u() || !f?.event) return;
		let m = W(t), h = m && K(f.event, m);
		if (h) try {
			await G.attachRepostTarget({
				outerEventId: t.eventId,
				target: h.event,
				relayHints: f.relayHints,
				localWriteScope: {
					ownerPubkeyHex: s,
					expectedRevision: l,
					isActive: u
				}
			}), u() && O(r)[t.eventId] && p(r, {
				...O(r),
				[t.eventId]: !1
			}, !0);
		} catch {
			u() && p(r, {
				...O(r),
				[t.eventId]: !0
			}, !0);
		}
	}
	return S(() => {
		let r = e.getPosts(), i = e.getPubkey();
		if (e.getShow() && i) {
			for (let e of r) H(e.kind) && e.deletedAt === void 0 && o(e).catch(() => void 0);
			return () => {
				n++, e.resolver.invalidateScope(t);
			};
		}
	}), A(() => {
		n++, e.resolver.invalidateScope(t);
	}), {
		suspend: () => {
			n++, e.resolver.invalidateScope(t);
		},
		getPreview: a,
		collectLocalDescriptors: (e) => e.flatMap((e) => {
			let t = i(e);
			return t ? [t] : [];
		}),
		retry: (e) => {
			o(e, !O(r)[e.eventId]).catch(() => void 0);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRepliesBadgeButton.svelte
var Re = E("<span class=\"post-preview-replies-badge svelte-11vk23d\" aria-hidden=\"true\"> </span>"), ze = E("<!> <!>", 1), Be = {
	hash: "svelte-11vk23d",
	code: ".post-preview-replies-badge-button {width:36px;min-width:36px;min-height:auto;color:var(--btn-post-preview-action);--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));background-color:var(\n            --post-history-preview-footer-surface,\n            var(--dialog-bg)\n        );}.post-preview-replies-badge.svelte-11vk23d {display:inline-flex;align-items:center;justify-content:center;aspect-ratio:1;width:20px;height:20px;border-radius:999px;background:var(--btn-post-preview-action);color:var(--post-history-preview-footer-surface, var(--dialog-bg));font-size:0.6875rem;font-weight:700;line-height:20px;text-align:center;}\n            .post-preview-replies-badge-button.selected\n                .post-preview-replies-badge\n         {background-color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {\n                .post-preview-replies-badge-button:hover:not(:disabled)\n                    .post-preview-replies-badge\n             {background-color:var(--text);}\n    }"
};
function Ve(e, r) {
	t(r, !0), x(e, Be);
	let c = D(r, "tooltipContent", 19, () => r.ariaLabel), u = D(r, "className", 3, ""), p = M().overlayTarget;
	var h = o(), g = y(h);
	l(g, () => ue, (e, t) => {
		t(e, {
			children: (e, t) => {
				var n = o(), h = y(n);
				l(h, () => fe, (e, t) => {
					t(e, {
						delayDuration: 500,
						children: (e, t) => {
							var n = ze(), h = y(n);
							{
								let e = (e, t) => {
									let n = () => (t?.()).props, o = d(() => {
										let { onclick: e, ...t } = n();
										return {
											tooltipOnclick: e,
											restProps: t
										};
									});
									{
										let t = d(() => `post-preview-replies-badge-button ${u()}`);
										q(e, m({
											type: "button",
											get class() {
												return O(t);
											},
											get ariaLabel() {
												return r.ariaLabel;
											},
											contentLayout: "icon",
											shape: "circle",
											get selected() {
												return r.selected;
											},
											onClick: (e) => {
												r.onClick(), typeof O(o).tooltipOnclick == "function" && O(o).tooltipOnclick(e);
											}
										}, () => O(o).restProps, {
											children: (e, t) => {
												var n = Re(), o = T(n, !0);
												_(() => a(o, r.count)), i(e, n);
											},
											$$slots: { default: !0 }
										}));
									}
								};
								l(h, () => pe, (t, n) => {
									n(t, {
										child: e,
										$$slots: { child: !0 }
									});
								});
							}
							var g = C(h, 2);
							l(g, () => se, (e, t) => {
								t(e, {
									get to() {
										return p;
									},
									children: (e, t) => {
										var n = o(), r = y(n);
										l(r, () => ce, (e, t) => {
											t(e, {
												sideOffset: 8,
												class: "tooltip-content post-preview-tooltip-content",
												children: (e, t) => {
													s();
													var n = f();
													_(() => a(n, c())), i(e, n);
												},
												$$slots: { default: !0 }
											});
										}), i(e, n);
									},
									$$slots: { default: !0 }
								});
							}), i(e, n);
						},
						$$slots: { default: !0 }
					});
				}), i(e, n);
			},
			$$slots: { default: !0 }
		});
	}), i(e, h), n();
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
		this.deletionFetchService = e.deletionFetchService ?? he, this.deletionRequestsRepository = e.deletionRequestsRepository ?? oe, this.childInteractionsRepository = e.childInteractionsRepository ?? ye, this.now = e.now ?? Date.now;
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
		this.directReplySaveService = e.directReplySaveService ?? Ge, this.childInteractionsRepository = e.childInteractionsRepository ?? ye, this.quoteVisibleRangeRepairExecutor = e.quoteVisibleRangeRepairExecutor, this.console = e.console ?? (globalThis.console === void 0 ? {
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
				relayHints: P.sanitizeExternalRelayUrls([...t?.relayHints ?? [], ...e.relayHints])
			});
		}
		let o = Array.from(a.values()).slice(0, 150), s = o.map((e) => e.eventId), c = B(L);
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
		let r = !0, i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = () => r && t.isActive?.() !== !1, s = $e(t.ownerPubkeyHex, t.visiblePosts), c = s.map((e) => e.eventId), l = B(L);
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
			let t = de({
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
			let t = I(e.event).parentId, r = t ? n.get(t) : null;
			return !t || !r || !le({
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
			let t = ve(e.event).reference, r = t ? n.get(t.eventId) : void 0;
			return !t || !r || !be(t, r) || e.event.id === t.eventId ? [] : [{
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
		let { destinationRelayUrls: i, coverageRelayUrls: a } = this.resolveRelayPlan(t, n), o = t.map((e) => e.eventId), s = Qe(), c = `${s}:0`, l = ae(s), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g = 0, _ = !1, v, y, b, x, S, C, w = () => {
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
					} }), v = U(e, l, { on: i.length > 0 ? { relays: i } : { defaultReadRelays: !0 } }).subscribe({
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
		i ? F(i.event, r) ? n && i.relayUrls.add(n) : this.console.warn("post_history_visible_child_interaction_repair_packet_conflict") : e.set(r.id, {
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
		let n = P.sanitizeExternalRelayUrls(typeof e == "string" ? [e] : [], { limit: 1 })[0] ?? null;
		return n && t.includes(n) ? n : null;
	}
	resolveRelayPlan(e, t) {
		let n = this.collectParentRelayHints(e), r = re(n, Ye);
		if (r !== null) return {
			destinationRelayUrls: r,
			coverageRelayUrls: ie()
		};
		let i = t ? P.sanitizeExternalRelayUrls(P.extractReadRelays(t)) : [], a = t ? P.sanitizeExternalRelayUrls(P.extractWriteRelays(t)) : [], o = P.sanitizeExternalRelayUrls(N), s = i.length > 0 ? i : a.length > 0 ? a : o, c = i.length > 0 ? a.filter((e) => !s.includes(e)) : [], l = P.sanitizeExternalRelayUrls(n, { limit: Ye });
		return {
			coverageRelayUrls: s,
			destinationRelayUrls: P.sanitizeExternalRelayUrls([
				...s,
				...c,
				...l
			])
		};
	}
}();
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryRelatedReactions.svelte.ts
function rt(e) {
	let t = j({}), n = j({}), r = j({}), i = j(0), a = 0, o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map(), l = null, u = e.source ?? "related-card-display", d = e.profileSync.subscribe((t, r) => {
		e.getShow() && p(n, {
			...O(n),
			[t]: r
		});
	}), f = () => {
		p(i, O(i) + 1);
	}, m = () => {
		document.visibilityState === "visible" && p(i, O(i) + 1);
	};
	S(() => {
		if (e.getShow() && typeof window < "u") return window.addEventListener("online", f), document.addEventListener("visibilitychange", m), () => {
			window.removeEventListener("online", f), document.removeEventListener("visibilitychange", m);
		};
	}), A(() => {
		a += 1, l?.cancel(), typeof window < "u" && (window.removeEventListener("online", f), document.removeEventListener("visibilitychange", m)), d();
	});
	function h(e) {
		return O(r)[e] ? Ee(O(t)[e] ?? [], O(n)) : null;
	}
	function g(e) {
		return !!O(r)[e];
	}
	S(() => {
		let d = e.getShow(), f = e.getPubkeyHex() ?? "", m = e.getRxNostr(), h = e.getRelayConfig(), g = e.getTargets(), _ = O(i);
		if (!d) {
			a += 1, l?.cancel(), l = null, s.clear(), (e.getSessionOpen ?? e.getShow)() || (o.clear(), c.clear(), p(t, {}), p(r, {}));
			return;
		}
		let v = ++a, y = !0, b = null, x = () => y && v === a && e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === m, S = /* @__PURE__ */ new Map();
		for (let e of g) {
			if (!e.eventId) continue;
			let t = S.get(e.eventId);
			S.set(e.eventId, {
				eventId: e.eventId,
				targetAuthorPubkey: e.targetAuthorPubkey ?? t?.targetAuthorPubkey,
				targetKind: e.targetKind ?? t?.targetKind,
				relayHints: Array.from(/* @__PURE__ */ new Set([...t?.relayHints ?? [], ...e.relayHints])).sort()
			});
		}
		let C = Array.from(S.values()), w = C.map((e) => e.eventId), T = JSON.stringify(Object.entries(h ?? {}).sort(([e], [t]) => e.localeCompare(t))), E = (e) => JSON.stringify([
			e.eventId,
			e.targetAuthorPubkey,
			e.targetKind,
			e.relayHints,
			T
		]), D = (e) => JSON.stringify([E(e), _]), k = new Set(C.map((e) => e.eventId));
		for (let e of c.keys()) k.has(e) || c.delete(e);
		return C.forEach((e) => c.set(e.eventId, D(e))), (async () => {
			let a = await J.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => J.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			let d = {};
			for (let e of w) d[e] = a.filter((t) => t.parentEventId === e);
			p(t, {
				...O(t),
				...d
			}), p(r, {
				...O(r),
				...Object.fromEntries(w.map((e) => [e, !0]))
			});
			for (let t of a) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && p(n, {
					...O(n),
					[t.authorPubkey]: r
				});
			}
			if (!m || w.length === 0 || (await xe({
				source: u,
				parentEventIds: w,
				rxNostr: m,
				relayConfig: h,
				isActive: x
			}), !x())) return;
			let g = await J.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => J.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			for (let e of w) d[e] = g.filter((t) => t.parentEventId === e);
			p(t, {
				...O(t),
				...d
			});
			let _ = C.filter((e) => !o.has(E(e)) && !s.has(e.eventId));
			if (!_.length) return;
			_.forEach((e) => s.add(e.eventId));
			let v = new Map(_.map((e) => [e.eventId, D(e)]));
			b = nt.repairRelatedCardReactions(m, {
				targets: _,
				relayConfig: h,
				isActive: x
			}), l = b;
			let y = await b.promise.catch(() => ({
				status: "partial",
				targetEventIds: _.map((e) => e.eventId)
			}));
			l === b && (l = null), b = null, _.forEach((e) => s.delete(e.eventId));
			let T = e.getShow() && (e.getPubkeyHex() ?? "") === f && e.getRxNostr() === m, k = _.some((e) => {
				let t = c.get(e.eventId);
				return t !== void 0 && (y.status === "cancelled" || t !== v.get(e.eventId));
			});
			if (T && k && p(i, O(i) + 1), !x() || y.status === "cancelled") return;
			if (y.status === "success") {
				let e = new Set(y.targetEventIds);
				_.filter((t) => e.has(t.eventId)).forEach((e) => o.add(E(e)));
			}
			let A = await J.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => J.getReactionRecords(e, S.get(e))))).flat();
			if (!x()) return;
			for (let e of w) d[e] = A.filter((t) => t.parentEventId === e);
			p(t, {
				...O(t),
				...d
			});
			for (let t of A) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && p(n, {
					...O(n),
					[t.authorPubkey]: r
				});
			}
			let j = await xe({
				source: u,
				parentEventIds: w,
				rxNostr: m,
				relayConfig: h,
				isActive: x
			});
			if (x() && j.deletedReactionEventIds.length > 0) {
				let e = await J.getReactionRecordsForParents?.(w, C) ?? (await Promise.all(w.map((e) => J.getReactionRecords(e, S.get(e))))).flat();
				if (!x()) return;
				for (let t of w) d[t] = e.filter((e) => e.parentEventId === t);
				p(t, {
					...O(t),
					...d
				});
			}
		})().catch(() => void 0), () => {
			y = !1, b?.cancel(), l === b && (l = null);
		};
	});
	async function _(i) {
		let o = a, s = e.getPubkeyHex(), c = e.getRxNostr(), l = e.getTargets().filter((e) => i.includes(e.eventId)), u = await Promise.all(l.map((e) => J.getReactionRecords(e.eventId, e)));
		o === a && e.getShow() && e.getPubkeyHex() === s && e.getRxNostr() === c && l.forEach((i, a) => {
			p(t, {
				...O(t),
				[i.eventId]: u[a]
			}), p(r, {
				...O(r),
				[i.eventId]: !0
			});
			for (let t of u[a]) {
				let r = e.profileSync.ensureProfile(t.authorPubkey, t.relayUrls);
				r && p(n, {
					...O(n),
					[t.authorPubkey]: r
				});
			}
		});
	}
	function v() {
		a++, l?.cancel(), l = null, s.clear();
	}
	return {
		getReadModel: h,
		isLoaded: g,
		refreshCachedReactions: _,
		suspend: v
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryPostActionUiController.svelte.ts
function it() {
	let e = j(b({})), t = j(!1), n = j(null);
	function r(t) {
		return O(e)[t] ?? !1;
	}
	function i(t, n) {
		p(e, {
			...O(e),
			[t]: n
		}, !0);
	}
	function a() {
		Object.keys(O(e)).length > 0 && p(e, {}, !0);
	}
	function o(e) {
		p(t, e, !0), e || p(n, null);
	}
	function s(e) {
		a(), p(n, e, !0), p(t, !0);
	}
	function c() {
		o(!1);
	}
	function l() {
		p(n, null);
	}
	function u() {
		p(t, !1), p(n, null);
	}
	function d() {
		p(e, {}, !0), u();
	}
	return {
		get deleteConfirmOpen() {
			return O(t);
		},
		get deleteTargetPost() {
			return O(n);
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
