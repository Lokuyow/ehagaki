import { A as e, Et as t, G as n, K as r, Mt as i, N as a, T as o, Tt as s, V as c, W as l, Y as u, ct as d, dt as f, ft as p, gt as m, it as h, jt as g, mt as _, nt as v, o as y, pt as b, r as x, s as S, st as C, t as w, ut as T, vt as E, w as D, xt as O, z as k } from "./index-client-XkLzkVYC.js";
import { n as A } from "./relayConfigUtils-B4Q_AO1M.js";
import { a as j, u as M } from "./postHistoryEventUtils-CP25bUau.js";
import { ht as N, pt as P } from "./LoadingPlaceholder-lit91akO.js";
import { C as ee, c as F } from "./nip65RelayDirectory-DWdjnt74.js";
import { f as I } from "./relayStore.svelte-Df3SPXmc.js";
import { J as te, X as L, c as ne, q as re, s as R, t as z } from "./appUtils-BRia-Jm6.js";
import { n as ie } from "./settingsStore.svelte-Cja5YPJC.js";
import { C as ae, P as B, c as V, i as H, n as oe, t as U } from "./sensitiveContentPayloadReader-CuX74jfk.js";
import { a as W } from "./clipboardUtils-DL4u_EPs.js";
import { a as G, i as K } from "./menu-trigger-TbDvuZD-.js";
import { g as se } from "./postHistoryLightweightSyncCoordinator-CTD1fZM2.js";
import { nt as q, ut as ce } from "./App-D7-eoDXE.js";
import { D as J, f as le, h as ue, i as de, m as fe, n as pe, r as me, s as he, t as Y } from "./postBroadcastService-DgDo3AL_.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostEventOperations.svelte.ts
function X(e, t, n = () => void 0) {
	let r = E(_({})), i = 0, a, o, s;
	d(() => {
		let r = e(), c = t(), l = n();
		(r !== a || c !== o || l !== s) && i++, a = r, o = c, s = l;
	}), w(() => {
		i++;
	});
	async function c(e, n) {
		if (!t() || v(r)[e]) return null;
		let a = i;
		m(r, {
			...v(r),
			[e]: !0
		}, !0);
		try {
			let e = await n();
			return t() && a === i ? e : null;
		} finally {
			m(r, {
				...v(r),
				[e]: !1
			}, !0);
		}
	}
	return {
		isPending: (e) => !!v(r)[e],
		broadcast: (t) => c(`broadcast:${t.eventId}`, () => Y.broadcast({
			post: t,
			rxNostr: e()
		}).catch(() => ({
			success: !1,
			error: "broadcast_failed"
		}))),
		deletePost: (t) => c(`delete:${t.eventId}`, () => de.requestDeletion({
			post: t,
			rxNostr: e()
		}).catch(() => ({
			success: !1,
			error: "deletion_failed"
		}))),
		reset() {
			i++;
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostHistoryCopyNevent.svelte.ts
function ge() {
	let e = 0, t = /* @__PURE__ */ new Set(), n = E(_({})), r = E(!1), i = E(0), a = E(0), o, s = E(void 0);
	function c(e) {
		return L(e, I.value);
	}
	function l() {
		o &&= (clearTimeout(o), void 0), m(r, !1), m(s, void 0);
	}
	function u(e, t) {
		m(s, {
			eventId: e.eventId,
			...z(t.clientX, t.clientY)
		}, !0);
	}
	function d(e, t) {
		if (v(s)?.eventId === e.eventId) return {
			x: v(s).x,
			y: v(s).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return z(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function f(e, t) {
		o && clearTimeout(o), m(i, e, !0), m(a, t, !0), m(r, !0), o = setTimeout(() => {
			m(r, !1), o = void 0;
		}, 1800);
	}
	async function p(r, i) {
		let a = e, o = d(r, i), s = c(r), l = s ? await W(s, "nevent", navigator, window) : !1;
		if (a !== e) return;
		if (l) {
			m(n, {
				...v(n),
				[r.eventId]: void 0
			}, !0), f(o.x, o.y);
			return;
		}
		m(n, {
			...v(n),
			[r.eventId]: "failed"
		}, !0);
		let u = setTimeout(() => {
			t.delete(u), a === e && m(n, {
				...v(n),
				[r.eventId]: void 0
			}, !0);
		}, 1800);
		t.add(u);
	}
	function h() {
		e++, t.forEach(clearTimeout), t.clear(), m(n, {}, !0), l();
	}
	return {
		get copyState() {
			return v(n);
		},
		get showCopyFloatingMessage() {
			return v(r);
		},
		get copyFloatingMessageX() {
			return v(i);
		},
		get copyFloatingMessageY() {
			return v(a);
		},
		captureCopyPointerPosition: u,
		hideCopyFloatingMessage: l,
		handleCopyNevent: p,
		resetState: h
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRecordActionItems.svelte
var _e = r("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), ve = r("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Z = r("<!> <!>", 1), ye = r("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), be = r("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), xe = r("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Se = r("<!> <!> <!> <!>", 1), Ce = {
	hash: "svelte-8tu42h",
	code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function we(r, i) {
	t(i, !0), e(r, Ce);
	let o = () => S(P, "$_", u), [u, d] = y(), m = (e) => {
		var t = n(), r = f(t);
		a(r, () => G, (e, t) => {
			t(e, {
				class: "menu-action-button",
				get onpointerdown() {
					return i.onCopyPointerDown;
				},
				get onSelect() {
					return i.onCopyNevent;
				},
				children: (e, t) => {
					var n = _e(), r = f(n);
					let a;
					var s = b(r, 2), u = p(s, !0);
					C((e, t) => {
						a = D(r, "", a, { "mask-image": e }), c(u, t);
					}, [() => `url("${q("icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => i.copyFailed ? o()("postHistory.copyFailed") : o()("postHistory.copyNevent")]), l(e, n);
				},
				$$slots: { default: !0 }
			});
		}), l(e, t);
	}, h = (e) => {
		var t = Z(), n = f(t), r = (e) => {
			fe(e, {
				get pending() {
					return w();
				},
				get onSelect() {
					return v();
				}
			});
		};
		k(n, (e) => {
			v() && e(r);
		});
		var s = b(n, 2);
		a(s, () => G, (e, t) => {
			t(e, {
				class: "menu-action-button",
				onSelect: () => i.onShowRawJson(),
				children: (e, t) => {
					var n = ve(), r = f(n);
					let i;
					var a = b(r, 2), s = p(a, !0);
					C((e, t) => {
						i = D(r, "", i, { "mask-image": e }), c(s, t);
					}, [() => `url("${q("icons/data_object_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => o()("postHistory.rawJson")]), l(e, n);
				},
				$$slots: { default: !0 }
			});
		}), l(e, t);
	}, g = x(i, "externalClientLabel", 3, void 0), _ = x(i, "onOpenExternalClient", 3, void 0), v = x(i, "onRepost", 3, void 0), w = x(i, "repostPending", 3, !1);
	var T = Se(), E = f(T), O = (e) => {
		var t = Z(), n = f(t);
		a(n, () => G, (e, t) => {
			t(e, {
				class: "menu-action-button",
				get onSelect() {
					return _();
				},
				children: (e, t) => {
					var n = ye(), r = b(f(n), 2), i = p(r, !0);
					C(() => c(i, g())), l(e, n);
				},
				$$slots: { default: !0 }
			});
		});
		var r = b(n, 2);
		a(r, () => K, (e, t) => {
			t(e, { class: "post-history-menu-separator" });
		}), l(e, t);
	};
	k(E, (e) => {
		g() && _() && e(O);
	});
	var A = b(E, 2), j = (e) => {
		var t = Z(), n = f(t);
		h(n);
		var r = b(n, 2);
		m(r), l(e, t);
	}, M = (e) => {
		var t = Z(), n = f(t);
		m(n);
		var r = b(n, 2);
		h(r), l(e, t);
	};
	k(A, (e) => {
		i.order === "raw-json-first" ? e(j) : e(M, -1);
	});
	var N = b(A, 2), ee = (e) => {
		var t = n(), r = f(t);
		a(r, () => G, (e, t) => {
			t(e, {
				class: "menu-action-button",
				get disabled() {
					return i.broadcastSending;
				},
				get onpointerdown() {
					return i.onBroadcastPointerDown;
				},
				get onSelect() {
					return i.onBroadcastPost;
				},
				children: (e, t) => {
					var n = be(), r = f(n);
					let i;
					var a = b(r, 2), s = p(a, !0);
					C((e, t) => {
						i = D(r, "", i, { "mask-image": e }), c(s, t);
					}, [() => `url("${q("icons/cell_tower_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => o()("postHistory.broadcast")]), l(e, n);
				},
				$$slots: { default: !0 }
			});
		}), l(e, t);
	};
	k(N, (e) => {
		i.showBroadcast && e(ee);
	});
	var F = b(N, 2), I = (e) => {
		var t = Z(), r = f(t), s = (e) => {
			var t = n(), r = f(t);
			a(r, () => K, (e, t) => {
				t(e, { class: "post-history-menu-separator" });
			}), l(e, t);
		};
		k(r, (e) => {
			i.showDeleteSeparator && e(s);
		});
		var u = b(r, 2);
		a(u, () => G, (e, t) => {
			t(e, {
				class: "menu-action-button menu-action-button-danger",
				get disabled() {
					return i.deletionSending;
				},
				onSelect: () => i.onOpenDeleteConfirm(),
				children: (e, t) => {
					var n = xe(), r = f(n);
					let a;
					var s = b(r, 2), u = p(s, !0);
					C((e, t) => {
						a = D(r, "", a, { "mask-image": e }), c(u, t);
					}, [() => `url("${q("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => i.deletionSending ? o()("postHistory.deleteSending") : o()("postHistory.delete")]), l(e, n);
				},
				$$slots: { default: !0 }
			});
		}), l(e, t);
	};
	k(F, (e) => {
		i.showDelete && e(I);
	}), l(r, T), s(), d();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostEventMenu.svelte
var Te = r("<!> <!>", 1), Ee = r("<p role=\"status\"> </p>"), De = r("<!> <!> <!> <!> <!>", 1);
function Oe(e, r) {
	t(r, !0);
	let i = () => S(P, "$_", d), o = () => S(N, "$locale", d), [d, h] = y(), _ = x(r, "active", 3, () => !0), T = x(r, "open", 3, !1), D = x(r, "repostPending", 3, !1), A = !1, M = () => !A && _()();
	w(() => {
		A = !0;
	});
	let F = ge(), L = E(!1), R = E(!1), z = E(!1), B = E(""), V = E(!1), H = O(() => ({
		client: ie.externalNostrClient,
		customUrlTemplate: ie.externalNostrClientCustomUrl
	})), U = O(() => te(v(H))), W = O(() => r.operations.isPending(`delete:${r.post.eventId}`));
	async function K() {
		if (r.onRefresh && !v(z)) {
			m(z, !0);
			try {
				await r.onRefresh();
			} finally {
				m(z, !1);
			}
		}
	}
	async function se() {
		let e = await r.operations.broadcast(r.post);
		e && M() && m(B, e.success ? "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0);
	}
	async function q() {
		let e = await r.operations.deletePost(r.post);
		e && M() && (m(B, e.success ? "" : "postHistory.deleteFailed", !0), e.success && (r.onDeleted?.(r.post.eventId, e.deletedAt ?? Date.now(), e.deletionEventId ?? ""), m(R, !1)));
	}
	let J = null, de = () => J ??= ue({
		getShow: () => M(),
		getOwner: () => r.owner,
		getRxNostr: () => r.rxNostr,
		getRelayConfig: () => r.relayConfig
	});
	async function fe() {
		if (r.onRequestRepost) {
			r.onRequestRepost();
			return;
		}
		if (!r.onRepost || D()) return;
		let e = await r.onRepost(r.post, (e, t) => de().prepareRepostTarget({
			targetEventId: e.id,
			authorHint: e.pubkey,
			relayHints: t,
			relationKind: "repost",
			scopeKey: "event-menu"
		}, e));
		M() && m(B, e.success ? "repost.sent" : "repost.failed", !0);
	}
	w(() => {
		F.resetState(), J?.reset();
	});
	var Y = De(), X = f(Y);
	{
		let e = (e) => {
			var t = Te(), o = f(t), s = (e) => {
				var t = n(), r = f(t);
				a(r, () => G, (e, t) => {
					t(e, {
						class: "menu-action-button",
						get disabled() {
							return v(z);
						},
						onSelect: () => void K(),
						children: (e, t) => {
							g();
							var n = u();
							C((e) => c(n, e), [() => i()("postHistory.checkRelatedEvents")]), l(e, n);
						},
						$$slots: { default: !0 }
					});
				}), l(e, t);
			};
			k(o, (e) => {
				r.onRefresh && e(s);
			});
			var d = b(o, 2);
			{
				let e = O(() => F.copyState[r.post.eventId] === "failed"), t = O(() => !!pe(r.post)), n = O(() => r.operations.isPending(`broadcast:${r.post.eventId}`)), a = O(() => me(r.post, r.owner)), o = O(() => v(U) ? i()("postHistory.openInExternalClient", { values: { client: v(U) } }) : i()("postHistory.openInExternalClientFallback")), s = O(() => r.onRepost && !r.post.deletedAt && ee(r.post.kind) && j(r.post.rawEvent, r.post) ? () => void fe() : void 0);
				we(d, {
					order: "standard",
					get copyFailed() {
						return v(e);
					},
					get showBroadcast() {
						return v(t);
					},
					get broadcastSending() {
						return v(n);
					},
					get showDelete() {
						return v(a);
					},
					showDeleteSeparator: !0,
					get deletionSending() {
						return v(W);
					},
					onCopyPointerDown: (e) => {
						m(V, !0), F.captureCopyPointerPosition(r.post, e);
					},
					onCopyNevent: (e) => {
						m(V, !0), F.handleCopyNevent(r.post, e);
					},
					get externalClientLabel() {
						return v(o);
					},
					onOpenExternalClient: () => {
						let e = re(r.post, v(H), I.value);
						e && window.open(e, "_blank", "noopener,noreferrer");
					},
					onShowRawJson: () => m(L, !0),
					get onRepost() {
						return v(s);
					},
					get repostPending() {
						return D();
					},
					onBroadcastPointerDown: () => {},
					onBroadcastPost: () => void se(),
					onOpenDeleteConfirm: () => {
						r.onDelete ? r.onDelete() : m(R, !0);
					}
				});
			}
			l(e, t);
		}, t = O(() => r.triggerLabel ?? i()("common.showActions")), s = O(() => ae(r.post.postedAt, o()));
		le(X, {
			get open() {
				return T();
			},
			get onOpenChange() {
				return r.onOpenChange;
			},
			lazy: !0,
			restoreFocusOnClose: !0,
			get triggerAriaLabel() {
				return v(t);
			},
			get timestamp() {
				return v(s);
			},
			items: e,
			$$slots: { items: !0 }
		});
	}
	var _e = b(X, 2), ve = (e) => {
		he(e, {
			open: !0,
			get rawEvent() {
				return r.post.rawEvent;
			},
			onOpenChange: (e) => m(L, e, !0),
			loadPayloadEvent: (e, t) => oe({
				structure: e,
				signal: t,
				rxNostr: r.rxNostr,
				relayConfig: r.relayConfig,
				relayHints: r.post.relayHints
			})
		});
	};
	k(_e, (e) => {
		v(L) && e(ve);
	});
	var Z = b(_e, 2), ye = (e) => {
		{
			let t = O(() => i()("postHistory.deleteRequestTitle")), n = O(() => i()("postHistory.deleteRequestDescription")), r = O(() => i()("postHistory.deleteConfirm")), a = O(() => i()("postHistory.deleteCancel"));
			ce(e, {
				open: !0,
				onOpenChange: (e) => m(R, e, !0),
				get title() {
					return v(t);
				},
				get description() {
					return v(n);
				},
				get confirmLabel() {
					return v(r);
				},
				get cancelLabel() {
					return v(a);
				},
				get confirmDisabled() {
					return v(W);
				},
				preventCloseWhileConfirming: !0,
				closeOnConfirm: !1,
				onConfirm: q
			});
		}
	};
	k(Z, (e) => {
		v(R) && e(ye);
	});
	var be = b(Z, 2), xe = (e) => {
		var t = Ee(), n = p(t, !0);
		C((e) => c(n, e), [() => i()(v(B))]), l(e, t);
	};
	k(be, (e) => {
		v(B) && e(xe);
	});
	var Se = b(be, 2), Ce = (e) => {
		ne(e, {
			get show() {
				return F.showCopyFloatingMessage;
			},
			get x() {
				return F.copyFloatingMessageX;
			},
			get y() {
				return F.copyFloatingMessageY;
			},
			children: (e, t) => {
				g();
				var n = u();
				C((e) => c(n, e), [() => i()("postHistory.copied")]), l(e, n);
			},
			$$slots: { default: !0 }
		});
	};
	k(Se, (e) => {
		v(V) && e(Ce);
	}), l(e, Y), s(), h();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryQuotePreview.svelte
var ke = r("<article class=\"post-history-quote-status-card svelte-1rnem6w\"><div class=\"post-history-quote-status-body svelte-1rnem6w\"><p> </p> <!></div></article>"), Ae = {
	hash: "svelte-1rnem6w",
	code: ".post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}"
};
function je(r, a) {
	t(a, !0), e(r, Ae);
	let d = () => S(P, "$_", m), [m, h] = y(), _ = x(a, "model", 3, void 0), v = x(a, "loadSensitiveBody", 3, void 0), w = x(a, "emojiLoadStateByUrl", 19, () => ({})), E = x(a, "emojiImageMetaByUrl", 19, () => ({})), D = x(a, "scrollRoot", 3, null), O = x(a, "onImageOpen", 3, void 0), A = x(a, "onRetry", 3, void 0), j = x(a, "footerActions", 3, void 0), M = x(a, "footerDetails", 3, void 0), N = x(a, "footerMenu", 3, void 0);
	function ee() {
		switch (a.preview.status) {
			case "deleted": return d()("postHistory.quoteDeleted");
			case "not-found": return d()("postHistory.quoteNotFound");
			case "error": return d()("postHistory.quoteFetchFailed");
			default: return d()("postHistory.quoteLoading");
		}
	}
	var F = n(), I = f(F), te = (e) => {
		J(e, {
			get event() {
				return a.preview.event;
			},
			get profile() {
				return a.preview.profile;
			},
			get model() {
				return _();
			},
			get loadSensitiveBody() {
				return v();
			},
			get emojiLoadStateByUrl() {
				return w();
			},
			get emojiImageMetaByUrl() {
				return E();
			},
			get scrollRoot() {
				return D();
			},
			get onImageOpen() {
				return O();
			},
			get footerActions() {
				return j();
			},
			get footerDetails() {
				return M();
			},
			get footerMenu() {
				return N();
			}
		});
	}, L = (e) => {
		var t = ke(), n = T(t), r = T(n);
		let s;
		var f = p(r, !0), m = b(r, 2), h = (e) => {
			R(e, {
				type: "button",
				className: "post-history-quote-retry-button",
				onClick: () => A()?.(a.preview.eventId),
				children: (e, t) => {
					g();
					var n = u();
					C((e) => c(n, e), [() => d()("postHistory.contextRetry")]), l(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		k(m, (e) => {
			a.preview.status === "error" && e(h);
		}), i(n), i(t), C((e) => {
			s = o(r, 1, "post-history-quote-status-message svelte-1rnem6w", null, s, { "post-history-quote-status-error": a.preview.status === "error" }), c(f, e);
		}, [() => ee()]), l(e, t);
	};
	k(I, (e) => {
		a.preview.status === "resolved" ? e(te) : e(L, -1);
	}), l(r, F), s(), h();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedTargetDiscoveryAdapter.ts
var Me = 8, Ne = {
	byPostId: {},
	contextsByEventId: {}
};
function Pe(e) {
	return A.sanitizeExternalRelayUrls(e, { limit: Me });
}
function Fe(e) {
	return {
		sourceEventId: e.sourceEventId,
		targetEventId: e.targetEventId,
		relationKind: e.relationKind,
		relayHints: Pe(e.relayHints),
		authorHint: e.authorHint,
		scopeKey: e.scopeKey
	};
}
var Q = {
	buildIndex(e) {
		let t = {}, n = {};
		for (let r of e) {
			let e = se(r);
			if (e.length !== 0) {
				t[r.eventId] = e;
				for (let t of e) {
					let e = n[t.eventId];
					n[t.eventId] = {
						eventId: t.eventId,
						sourceEventId: e?.sourceEventId ?? r.eventId,
						authorHint: e?.authorHint ?? t.authorHint,
						relayHints: Pe([
							...e?.relayHints ?? [],
							...t.relayHint ? [t.relayHint] : [],
							...r.relayHints,
							...r.acceptedRelays,
							...r.fetchedRelays ?? []
						])
					};
				}
			}
		}
		return {
			byPostId: t,
			contextsByEventId: n
		};
	},
	toDescriptor(e, t) {
		return Fe({
			sourceEventId: e.sourceEventId,
			targetEventId: e.eventId,
			relationKind: "quote",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, Ie = {
	getRelayHints(e, t) {
		let n = M(t.event);
		return Pe([
			...n.replyRelayHint ? [n.replyRelayHint] : [],
			...n.rootRelayHint ? [n.rootRelayHint] : [],
			...t.relayUrls,
			...n.relayHints,
			...e.relayHints,
			...e.acceptedRelays,
			...e.fetchedRelays ?? []
		]);
	},
	getAuthorHint(e) {
		let t = M(e.event);
		return t.parentId ? t.parentId === t.replyId ? t.replyAuthorHint : t.parentId === t.rootId ? t.rootAuthorHint : t.replyAuthorHint ?? t.rootAuthorHint : null;
	},
	buildContext(e, t, n) {
		return n.parentEventId ? {
			sourceEventId: t,
			targetEventId: n.parentEventId,
			authorHint: this.getAuthorHint(n),
			relayHints: this.getRelayHints(e, n)
		} : null;
	},
	toDescriptor(e, t) {
		return Fe({
			sourceEventId: e.sourceEventId,
			targetEventId: e.targetEventId,
			relationKind: "reply-parent",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, Le = 0;
function Re(e) {
	switch (e) {
		case void 0: return "idle";
		case "resolved":
		case "not-found":
		case "deleted":
		case "error": return e;
		default: return "loading";
	}
}
function ze(e, t) {
	let n = Re(t?.status);
	switch (n) {
		case "idle": return {
			eventId: e,
			status: n
		};
		case "loading": return {
			eventId: e,
			status: n
		};
		case "resolved": return t?.event ? {
			eventId: e,
			status: n,
			event: t.event,
			profile: t.profile ?? null,
			relayHints: t.relayHints
		} : {
			eventId: e,
			status: "error",
			errorCode: t?.errorCode ?? "fetch_failed"
		};
		case "not-found": return {
			eventId: e,
			status: n
		};
		case "deleted": return {
			eventId: e,
			status: n
		};
		case "error": return {
			eventId: e,
			status: n,
			errorCode: t?.errorCode ?? null
		};
	}
}
function Be({ getShow: e, getPosts: t, getRxNostr: n, getRelayConfig: r, postHistoryRepositoryImpl: i = F, contextFetchService: a = V, deletionRequestsRepositoryImpl: o = B, deletionFetchService: s = H, profileSyncCoordinator: c = void 0, relatedTargetResolver: l = void 0 }) {
	let u = l ?? ue({
		getShow: e,
		getRxNostr: n,
		getRelayConfig: r,
		postHistoryRepositoryImpl: i,
		contextFetchService: a,
		deletionRequestsRepositoryImpl: o,
		deletionFetchService: s,
		profileSyncCoordinator: c
	}), f = !l, p = `post-history-quote-preview:${++Le}`, g = E(0), _ = null, y = Ne, b = 0;
	function x() {
		let n = t();
		return n !== _ && (_ = n, y = Q.buildIndex(n)), e() ? y : Ne;
	}
	function S() {
		f && u.reset();
	}
	function C(e) {
		return v(g), (x().byPostId[e.eventId] ?? []).map((e) => ze(e.eventId, u.getTargetSnapshot(e.eventId, e)));
	}
	function T(t) {
		e() && D(x(), !0, t);
	}
	async function D(t, n = !1, r) {
		let i = b, a = /* @__PURE__ */ new Map();
		for (let [e, n] of Object.entries(t.byPostId)) for (let i of n) {
			if (r && i.eventId !== r) continue;
			let n = t.contextsByEventId[i.eventId], o = Q.toDescriptor({
				...n,
				sourceEventId: e,
				authorHint: i.authorHint
			}, p);
			a.set(i.eventId, [...a.get(i.eventId) ?? [], o]);
		}
		await Promise.all([...a.values()].map(async (t) => {
			for (let r = 0; r < t.length; r++) {
				if (!e() || i !== b) return;
				let a = t[r], o = u.getTargetSnapshot(a.targetEventId), s = await u.ensureTarget(a, { force: r === 0 ? n : o?.status !== "resolved" });
				if (s?.status === "resolved" || s?.status === "deleted" || s?.status !== "not-found" && s?.errorCode !== "invalid_event") return;
			}
		}));
	}
	async function O(t) {
		e() && await D(Q.buildIndex(t), !0);
	}
	return d(() => {
		e() && m(g, u.getScopeRevision(p), !0);
	}), d(() => {
		if (!e()) return;
		n(), r();
		let t = x();
		return b++, h(() => {
			D(t);
		}), () => {
			b++, u.invalidateScope(p);
		};
	}), w(() => {
		b++, u.invalidateScope(p), S();
	}), {
		getQuotePreviews: C,
		retryQuotePreview: T,
		refreshQuotePreviews: O,
		suspend: () => {
			b++, u.invalidateScope(p);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveBodyLoaderCache.ts
function Ve() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t, n, r = []) {
		if (!t) return;
		let i = r.join("\n"), a = e.get(t);
		if (a && a.ownerPubkey === n.ownerPubkey && a.rxNostr === n.rxNostr && a.relayConfig === n.relayConfig && a.relayKey === i) return a.loader;
		let o = U({
			ownerPubkey: n.ownerPubkey,
			structure: t,
			rxNostr: n.rxNostr,
			relayConfig: n.relayConfig,
			...r.length ? { relayHints: [...r] } : {}
		});
		return e.set(t, {
			ownerPubkey: n.ownerPubkey,
			rxNostr: n.rxNostr,
			relayConfig: n.relayConfig,
			relayKey: i,
			loader: o
		}), o;
	}
	function n() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: t,
		clear: n
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/utils/structuralSharing.ts
function He(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function Ue(e, t) {
	let n = e.length === t.length, r = !1, i = t.map((t, i) => {
		let a = $(e[i], t);
		return n &&= a === e[i], r ||= a !== t, a;
	});
	return n ? e : r ? i : t;
}
function We(e, t) {
	let n = Object.keys(t), r = Object.keys(e).length === n.length, i = !1, a = {};
	for (let o of n) {
		let n = $(e[o], t[o]);
		a[o] = n, r &&= n === e[o] && Object.hasOwn(e, o), i ||= n !== t[o];
	}
	return r ? e : i ? a : t;
}
function $(e, t) {
	return Object.is(e, t) ? e : Array.isArray(e) && Array.isArray(t) ? Ue(e, t) : He(e) && He(t) ? We(e, t) : t;
}
function Ge(e, t) {
	return e === void 0 ? t : $(e, t);
}
export { Ie as a, we as c, Q as i, ge as l, Ve as n, je as o, Be as r, Oe as s, Ge as t, X as u };
