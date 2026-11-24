import { B as e, Dt as t, E as n, Et as r, F as i, G as a, H as o, K as s, Mt as c, Nt as l, P as u, Pt as d, St as f, T as p, X as m, _t as h, at as g, ct as _, dt as v, ft as y, ht as b, j as x, lt as S, mt as C, o as w, pt as T, q as E, r as D, rt as O, s as k, t as A, yt as j } from "./index-client-DEFG3Gqk.js";
import { n as M } from "./relayConfigUtils-56ujWwKF.js";
import { a as N, u as P } from "./postHistoryEventUtils-iuP8QpIA.js";
import { $ as F, Z as I } from "./LoadingPlaceholder-YrD8D_td.js";
import { g as L, t as R } from "./postHistoryRepository-Bu2z041i.js";
import { n as z, v as B } from "./settingsStore.svelte-CAa8Vn5a.js";
import { t as V } from "./appUtils-B3-zUpkb.js";
import { a as H } from "./clipboardUtils-CSGkJuUA.js";
import { r as U, t as W } from "./postHistoryContextFetchService-DB7akfzB.js";
import { n as ee, t as G } from "./Button-Cqrg0_jX.js";
import { n as K, y as te } from "./usePostHistoryEmojiState.svelte-_Y95EyLM.js";
import { a as q, i as J } from "./menu-trigger-DqitoevE.js";
import { g as ne } from "./postHistoryLightweightSyncCoordinator-DUlXMAtR.js";
import { t as Y } from "./appAssetUrl-B5sJnZLv.js";
import { a as re, i as ie, n as ae } from "./postHistoryExternalClient-CKvMz4n9.js";
import { st as oe } from "./App-CW2Ynbk9.js";
import { D as X, f as se, h as ce, i as le, m as ue, n as de, r as fe, s as pe, t as Z } from "./postBroadcastService-DaUJZYg6.js";
import { n as me, t as he } from "./sensitiveContentPayloadReader-DtRJE3_E.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/hooks/usePostEventOperations.svelte.ts
function ge(e, t, n = () => void 0) {
	let r = j(b({})), i = 0, a, o, s;
	S(() => {
		let r = e(), c = t(), l = n();
		(r !== a || c !== o || l !== s) && i++, a = r, o = c, s = l;
	}), A(() => {
		i++;
	});
	async function c(e, n) {
		if (!t() || O(r)[e]) return null;
		let a = i;
		h(r, {
			...O(r),
			[e]: !0
		}, !0);
		try {
			let e = await n();
			return t() && a === i ? e : null;
		} finally {
			h(r, {
				...O(r),
				[e]: !1
			}, !0);
		}
	}
	return {
		isPending: (e) => !!O(r)[e],
		broadcast: (t) => c(`broadcast:${t.eventId}`, () => Z.broadcast({
			post: t,
			rxNostr: e()
		}).catch(() => ({
			success: !1,
			error: "broadcast_failed"
		}))),
		deletePost: (t) => c(`delete:${t.eventId}`, () => le.requestDeletion({
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
function _e() {
	let e = 0, t = /* @__PURE__ */ new Set(), n = j(b({})), r = j(!1), i = j(0), a = j(0), o, s = j(void 0);
	function c(e) {
		return re(e, B.value);
	}
	function l() {
		o &&= (clearTimeout(o), void 0), h(r, !1), h(s, void 0);
	}
	function u(e, t) {
		h(s, {
			eventId: e.eventId,
			...V(t.clientX, t.clientY)
		}, !0);
	}
	function d(e, t) {
		if (O(s)?.eventId === e.eventId) return {
			x: O(s).x,
			y: O(s).y
		};
		let n = t.currentTarget, r = n instanceof HTMLElement ? n.getBoundingClientRect() : null;
		return V(r ? r.left + r.width / 2 : 0, r ? r.bottom + 8 : 0);
	}
	function f(e, t) {
		o && clearTimeout(o), h(i, e, !0), h(a, t, !0), h(r, !0), o = setTimeout(() => {
			h(r, !1), o = void 0;
		}, 1800);
	}
	async function p(r, i) {
		let a = e, o = d(r, i), s = c(r), l = s ? await H(s, "nevent", navigator, window) : !1;
		if (a !== e) return;
		if (l) {
			h(n, {
				...O(n),
				[r.eventId]: void 0
			}, !0), f(o.x, o.y);
			return;
		}
		h(n, {
			...O(n),
			[r.eventId]: "failed"
		}, !0);
		let u = setTimeout(() => {
			t.delete(u), a === e && h(n, {
				...O(n),
				[r.eventId]: void 0
			}, !0);
		}, 1800);
		t.add(u);
	}
	function m() {
		e++, t.forEach(clearTimeout), t.clear(), h(n, {}, !0), l();
	}
	return {
		get copyState() {
			return O(n);
		},
		get showCopyFloatingMessage() {
			return O(r);
		},
		get copyFloatingMessageX() {
			return O(i);
		},
		get copyFloatingMessageY() {
			return O(a);
		},
		captureCopyPointerPosition: u,
		hideCopyFloatingMessage: l,
		handleCopyNevent: p,
		resetState: m
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryRecordActionItems.svelte
var ve = E("<div class=\"copy-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), ye = E("<div class=\"raw-json-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Q = E("<!> <!>", 1), be = E("<div class=\"open-in-new-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), xe = E("<div class=\"broadcast-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Se = E("<div class=\"trash-icon svg-icon\" aria-hidden=\"true\"></div> <span> </span>", 1), Ce = E("<!> <!> <!> <!> <!>", 1), we = {
	hash: "svelte-8tu42h",
	code: ".open-in-new-icon {mask-image:var(--ehagaki-icon-6f70656e5f696e5f6e65775f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function Te(n, c) {
	t(c, !0), x(n, we);
	let l = () => k(I, "$_", f), [f, m] = w(), h = (e) => {
		var t = s(), n = y(t);
		u(n, () => q, (e, t) => {
			t(e, {
				class: "menu-action-button",
				get onpointerdown() {
					return c.onCopyPointerDown;
				},
				get onSelect() {
					return c.onCopyNevent;
				},
				children: (e, t) => {
					var n = ve(), r = y(n);
					let i;
					var s = C(r, 2), u = T(s, !0);
					_((e, t) => {
						i = p(r, "", i, { "mask-image": e }), o(u, t);
					}, [() => `url("${Y("icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => c.copyFailed ? l()("postHistory.copyFailed") : l()("postHistory.copyNevent")]), a(e, n);
				},
				$$slots: { default: !0 }
			});
		}), a(e, t);
	}, g = (t) => {
		var n = Q(), r = y(n), i = (e) => {
			ue(e, {
				get pending() {
					return O();
				},
				get onSelect() {
					return E();
				}
			});
		};
		e(r, (e) => {
			E() && e(i);
		});
		var s = C(r, 2);
		u(s, () => q, (e, t) => {
			t(e, {
				class: "menu-action-button",
				onSelect: () => c.onShowRawJson(),
				children: (e, t) => {
					var n = ye(), r = y(n);
					let i;
					var s = C(r, 2), c = T(s, !0);
					_((e, t) => {
						i = p(r, "", i, { "mask-image": e }), o(c, t);
					}, [() => `url("${Y("icons/data_object_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => l()("postHistory.rawJson")]), a(e, n);
				},
				$$slots: { default: !0 }
			});
		}), a(t, n);
	}, v = D(c, "externalClientLabel", 3, void 0), b = D(c, "onOpenExternalClient", 3, void 0), S = D(c, "afterExternalClient", 3, void 0), E = D(c, "onRepost", 3, void 0), O = D(c, "repostPending", 3, !1);
	var A = Ce(), j = y(A), M = (e) => {
		var t = Q(), n = y(t);
		u(n, () => q, (e, t) => {
			t(e, {
				class: "menu-action-button",
				get onSelect() {
					return b();
				},
				children: (e, t) => {
					var n = be(), r = C(y(n), 2), i = T(r, !0);
					_(() => o(i, v())), a(e, n);
				},
				$$slots: { default: !0 }
			});
		});
		var r = C(n, 2);
		u(r, () => J, (e, t) => {
			t(e, { class: "post-history-menu-separator" });
		}), a(e, t);
	};
	e(j, (e) => {
		v() && b() && e(M);
	});
	var N = C(j, 2);
	i(N, () => S() ?? d);
	var P = C(N, 2), F = (e) => {
		var t = Q(), n = y(t);
		g(n);
		var r = C(n, 2);
		h(r), a(e, t);
	}, L = (e) => {
		var t = Q(), n = y(t);
		h(n);
		var r = C(n, 2);
		g(r), a(e, t);
	};
	e(P, (e) => {
		c.order === "raw-json-first" ? e(F) : e(L, -1);
	});
	var R = C(P, 2), z = (e) => {
		var t = s(), n = y(t);
		u(n, () => q, (e, t) => {
			t(e, {
				class: "menu-action-button",
				get disabled() {
					return c.broadcastSending;
				},
				get onpointerdown() {
					return c.onBroadcastPointerDown;
				},
				get onSelect() {
					return c.onBroadcastPost;
				},
				children: (e, t) => {
					var n = xe(), r = y(n);
					let i;
					var s = C(r, 2), c = T(s, !0);
					_((e, t) => {
						i = p(r, "", i, { "mask-image": e }), o(c, t);
					}, [() => `url("${Y("icons/cell_tower_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => l()("postHistory.broadcast")]), a(e, n);
				},
				$$slots: { default: !0 }
			});
		}), a(e, t);
	};
	e(R, (e) => {
		c.showBroadcast && e(z);
	});
	var B = C(R, 2), V = (t) => {
		var n = Q(), r = y(n), i = (e) => {
			var t = s(), n = y(t);
			u(n, () => J, (e, t) => {
				t(e, { class: "post-history-menu-separator" });
			}), a(e, t);
		};
		e(r, (e) => {
			c.showDeleteSeparator && e(i);
		});
		var d = C(r, 2);
		u(d, () => q, (e, t) => {
			t(e, {
				class: "menu-action-button menu-action-button-danger",
				get disabled() {
					return c.deletionSending;
				},
				onSelect: () => c.onOpenDeleteConfirm(),
				children: (e, t) => {
					var n = Se(), r = y(n);
					let i;
					var s = C(r, 2), u = T(s, !0);
					_((e, t) => {
						i = p(r, "", i, { "mask-image": e }), o(u, t);
					}, [() => `url("${Y("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg")}")`, () => c.deletionSending ? l()("postHistory.deleteSending") : l()("postHistory.delete")]), a(e, n);
				},
				$$slots: { default: !0 }
			});
		}), a(t, n);
	};
	e(B, (e) => {
		c.showDelete && e(V);
	}), a(n, A), r(), m();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostEventMenu.svelte
var Ee = E("<!> <!>", 1), De = E("<p role=\"status\"> </p>"), Oe = E("<!> <!> <!> <!> <!>", 1);
function ke(n, i) {
	t(i, !0);
	let l = () => k(I, "$_", p), d = () => k(F, "$locale", p), [p, g] = w(), v = D(i, "readOnly", 3, !1), b = D(i, "active", 3, () => !0), x = D(i, "open", 3, !1), S = D(i, "repostPending", 3, !1), E = !1, M = () => !E && b()();
	A(() => {
		E = !0;
	});
	let P = _e(), R = j(!1), V = j(!1), H = j(!1), U = j(""), W = j(!1), G = f(() => ({
		client: z.externalNostrClient,
		customUrlTemplate: z.externalNostrClientCustomUrl
	})), K = f(() => ie(O(G))), J = f(() => i.operations.isPending(`delete:${i.post.eventId}`));
	async function ne() {
		if (i.onRefresh && !O(H)) {
			h(H, !0);
			try {
				await i.onRefresh();
			} finally {
				h(H, !1);
			}
		}
	}
	async function Y() {
		let e = await i.operations.broadcast(i.post);
		e && M() && h(U, e.success ? "postHistory.broadcastSent" : "postHistory.broadcastFailed", !0);
	}
	async function re() {
		let e = await i.operations.deletePost(i.post);
		e && M() && (h(U, e.success ? "" : "postHistory.deleteFailed", !0), e.success && (i.onDeleted?.(i.post.eventId, e.deletedAt ?? Date.now(), e.deletionEventId ?? ""), h(V, !1)));
	}
	let X = null, le = () => X ??= ce({
		getShow: () => M(),
		getOwner: () => i.owner,
		getRxNostr: () => i.rxNostr,
		getRelayConfig: () => i.relayConfig
	});
	async function ue() {
		if (i.onRequestRepost) {
			i.onRequestRepost();
			return;
		}
		if (!i.onRepost || S()) return;
		let e = await i.onRepost(i.post, (e, t) => le().prepareRepostTarget({
			targetEventId: e.id,
			authorHint: e.pubkey,
			relayHints: t,
			relationKind: "repost",
			scopeKey: "event-menu"
		}, e));
		M() && h(U, e.success ? "repost.sent" : "repost.failed", !0);
	}
	A(() => {
		P.resetState(), X?.reset();
	});
	var Z = Oe(), he = y(Z);
	{
		let t = (t) => {
			var n = Ee(), r = y(n), d = (e) => {
				var t = s(), n = y(t);
				u(n, () => q, (e, t) => {
					t(e, {
						class: "menu-action-button",
						get disabled() {
							return O(H);
						},
						onSelect: () => void ne(),
						children: (e, t) => {
							c();
							var n = m();
							_((e) => o(n, e), [() => l()("postHistory.checkRelatedEvents")]), a(e, n);
						},
						$$slots: { default: !0 }
					});
				}), a(e, t);
			};
			e(r, (e) => {
				i.onRefresh && e(d);
			});
			var p = C(r, 2);
			{
				let e = f(() => P.copyState[i.post.eventId] === "failed"), t = f(() => !v() && !!de(i.post)), n = f(() => i.operations.isPending(`broadcast:${i.post.eventId}`)), r = f(() => !v() && fe(i.post, i.owner)), a = f(() => O(K) ? l()("postHistory.openInExternalClient", { values: { client: O(K) } }) : l()("postHistory.openInExternalClientFallback")), o = f(() => !v() && i.onRepost && !i.post.deletedAt && L(i.post.kind) && N(i.post.rawEvent, i.post) ? () => void ue() : void 0), s = f(() => i.onBroadcastPointerDown ?? (() => {})), c = f(() => i.onBroadcastPost ?? (() => void Y()));
				Te(p, {
					order: "standard",
					get copyFailed() {
						return O(e);
					},
					get showBroadcast() {
						return O(t);
					},
					get broadcastSending() {
						return O(n);
					},
					get showDelete() {
						return O(r);
					},
					showDeleteSeparator: !0,
					get deletionSending() {
						return O(J);
					},
					onCopyPointerDown: (e) => {
						h(W, !0), P.captureCopyPointerPosition(i.post, e);
					},
					onCopyNevent: (e) => {
						h(W, !0), P.handleCopyNevent(i.post, e);
					},
					get externalClientLabel() {
						return O(a);
					},
					onOpenExternalClient: () => {
						let e = ae(i.post, O(G), B.value);
						e && window.open(e, "_blank", "noopener,noreferrer");
					},
					onShowRawJson: () => h(R, !0),
					get onRepost() {
						return O(o);
					},
					get repostPending() {
						return S();
					},
					get onBroadcastPointerDown() {
						return O(s);
					},
					get onBroadcastPost() {
						return O(c);
					},
					onOpenDeleteConfirm: () => {
						i.onDelete ? i.onDelete() : h(V, !0);
					}
				});
			}
			a(t, n);
		}, n = f(() => i.triggerLabel ?? l()("common.showActions")), r = f(() => te(i.post.postedAt, d()));
		se(he, {
			get open() {
				return x();
			},
			get onOpenChange() {
				return i.onOpenChange;
			},
			lazy: !0,
			restoreFocusOnClose: !0,
			get triggerAriaLabel() {
				return O(n);
			},
			get timestamp() {
				return O(r);
			},
			items: t,
			$$slots: { items: !0 }
		});
	}
	var ge = C(he, 2), ve = (e) => {
		pe(e, {
			open: !0,
			get rawEvent() {
				return i.post.rawEvent;
			},
			onOpenChange: (e) => h(R, e, !0),
			loadPayloadEvent: (e, t) => me({
				structure: e,
				signal: t,
				rxNostr: i.rxNostr,
				relayConfig: i.relayConfig,
				relayHints: i.post.relayHints
			})
		});
	};
	e(ge, (e) => {
		O(R) && e(ve);
	});
	var ye = C(ge, 2), Q = (e) => {
		{
			let t = f(() => l()("postHistory.deleteRequestTitle")), n = f(() => l()("postHistory.deleteRequestDescription")), r = f(() => l()("postHistory.deleteConfirm")), i = f(() => l()("postHistory.deleteCancel"));
			oe(e, {
				open: !0,
				onOpenChange: (e) => h(V, e, !0),
				get title() {
					return O(t);
				},
				get description() {
					return O(n);
				},
				get confirmLabel() {
					return O(r);
				},
				get cancelLabel() {
					return O(i);
				},
				get confirmDisabled() {
					return O(J);
				},
				preventCloseWhileConfirming: !0,
				closeOnConfirm: !1,
				onConfirm: re
			});
		}
	};
	e(ye, (e) => {
		O(V) && e(Q);
	});
	var be = C(ye, 2), xe = (e) => {
		var t = De(), n = T(t, !0);
		_((e) => o(n, e), [() => l()(O(U))]), a(e, t);
	};
	e(be, (e) => {
		O(U) && e(xe);
	});
	var Se = C(be, 2), Ce = (e) => {
		ee(e, {
			get show() {
				return P.showCopyFloatingMessage;
			},
			get x() {
				return P.copyFloatingMessageX;
			},
			get y() {
				return P.copyFloatingMessageY;
			},
			children: (e, t) => {
				c();
				var n = m();
				_((e) => o(n, e), [() => l()("postHistory.copied")]), a(e, n);
			},
			$$slots: { default: !0 }
		});
	};
	e(Se, (e) => {
		O(W) && e(Ce);
	}), a(n, Z), r(), g();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryQuotePreview.svelte
var Ae = E("<article class=\"post-history-quote-status-card svelte-1rnem6w\"><div class=\"post-history-quote-status-body svelte-1rnem6w\"><p> </p> <!></div></article>"), je = {
	hash: "svelte-1rnem6w",
	code: ".post-history-quote-status-card.svelte-1rnem6w {display:grid;border-inline-start:2px solid\n            color-mix(in srgb, var(--theme), transparent 45%);background:color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);color:var(--text);font-size:0.9rem;}.post-history-quote-status-body.svelte-1rnem6w {display:grid;gap:8px;padding:2px 10px 10px;}.post-history-quote-status-message.svelte-1rnem6w {margin:0;color:var(--text-muted);line-height:1.45;}.post-history-quote-status-error.svelte-1rnem6w {color:var(--danger);}.post-history-quote-retry-button {justify-self:start;}"
};
function Me(i, u) {
	t(u, !0), x(i, je);
	let d = () => k(I, "$_", f), [f, p] = w(), h = D(u, "model", 3, void 0), g = D(u, "loadSensitiveBody", 3, void 0), b = D(u, "emojiLoadStateByUrl", 19, () => ({})), S = D(u, "emojiImageMetaByUrl", 19, () => ({})), E = D(u, "scrollRoot", 3, null), O = D(u, "onImageOpen", 3, void 0), A = D(u, "onRetry", 3, void 0), j = D(u, "footerActions", 3, void 0), M = D(u, "footerDetails", 3, void 0), N = D(u, "footerMenu", 3, void 0);
	function P() {
		switch (u.preview.status) {
			case "deleted": return d()("postHistory.quoteDeleted");
			case "not-found": return d()("postHistory.quoteNotFound");
			case "error": return d()("postHistory.quoteFetchFailed");
			default: return d()("postHistory.quoteLoading");
		}
	}
	var F = s(), L = y(F), R = (e) => {
		X(e, {
			get event() {
				return u.preview.event;
			},
			get profile() {
				return u.preview.profile;
			},
			get model() {
				return h();
			},
			get loadSensitiveBody() {
				return g();
			},
			get emojiLoadStateByUrl() {
				return b();
			},
			get emojiImageMetaByUrl() {
				return S();
			},
			get scrollRoot() {
				return E();
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
	}, z = (t) => {
		var r = Ae(), i = v(r), s = v(i);
		let f;
		var p = T(s, !0), h = C(s, 2), g = (e) => {
			G(e, {
				type: "button",
				className: "post-history-quote-retry-button",
				onClick: () => A()?.(u.preview.eventId),
				children: (e, t) => {
					c();
					var n = m();
					_((e) => o(n, e), [() => d()("postHistory.contextRetry")]), a(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		e(h, (e) => {
			u.preview.status === "error" && e(g);
		}), l(i), l(r), _((e) => {
			f = n(s, 1, "post-history-quote-status-message svelte-1rnem6w", null, f, { "post-history-quote-status-error": u.preview.status === "error" }), o(p, e);
		}, [() => P()]), a(t, r);
	};
	e(L, (e) => {
		u.preview.status === "resolved" ? e(R) : e(z, -1);
	}), a(i, F), r(), p();
}
// D:/ドキュメント/GitHub/ehagaki/src/components/PostHistoryThreadToggleButton.svelte
var Ne = E("<span class=\"post-history-thread-toggle-spinner post-history-thread-action-spinner svelte-cenxtw\" aria-hidden=\"true\"></span>"), Pe = E("<span class=\"post-history-thread-toggle-icon-wrapper svelte-cenxtw\" aria-hidden=\"true\"><span></span></span>"), Fe = E("<!> <span class=\"post-history-thread-toggle-label\"> </span>", 1), Ie = {
	hash: "svelte-cenxtw",
	code: "button.post-history-thread-toggle-button {position:relative;justify-self:start;width:auto;padding:0 8px;gap:4px;white-space:nowrap;height:28px;min-height:28px;background:inherit;color:var(--btn-post-preview-action);}.post-history-thread-toggle-button.selected {--btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));color:var(--text-light);}\n\n    @media (hover: hover) and (pointer: fine) {.post-history-thread-toggle-button.selected:hover:not(:disabled) {background-color:light-dark(\n                color-mix(in srgb, var(--dialog-bg), black 20%),\n                color-mix(in srgb, var(--dialog-bg), white 30%)\n            );color:light-dark(\n                color-mix(in srgb, var(--text), black 20%),\n                color-mix(in srgb, var(--text), white 30%)\n            );}\n    }.post-history-thread-toggle-icon-wrapper.svelte-cenxtw {position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;}.post-history-thread-toggle-icon.svelte-cenxtw {--icon-size: 24px;--svg: currentColor;}.post-history-thread-toggle-icon-arrow-top-right.svelte-cenxtw {mask-image:var(--ehagaki-icon-6172726f775f746f705f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-icon-collapse.svelte-cenxtw {--icon-size: 28px;mask-image:var(--ehagaki-icon-636f6c6c617073655f636f6e74656e745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.post-history-thread-toggle-spinner.svelte-cenxtw {width:22px;height:22px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;\n        animation: svelte-cenxtw-post-history-thread-toggle-spinner 0.8s linear infinite;}\n\n    @media (prefers-reduced-motion: reduce) {.post-history-thread-toggle-spinner.svelte-cenxtw {\n            animation: none;}\n    }\n\n    @keyframes svelte-cenxtw-post-history-thread-toggle-spinner {\n        to {\n            rotate: 360deg;\n        }\n    }"
};
function Le(i, s) {
	t(s, !0), x(i, Ie);
	let c = () => k(I, "$_", l), [l, u] = w(), d = D(s, "loading", 3, !1), p = f(() => c()(s.expanded ? "postHistory.hideReplyTarget" : "postHistory.showReplyTarget"));
	{
		let t = f(() => d() ? "post-history-thread-toggle-button is-loading" : "post-history-thread-toggle-button");
		G(i, {
			type: "button",
			get className() {
				return O(t);
			},
			get ariaLabel() {
				return O(p);
			},
			get title() {
				return O(p);
			},
			get "aria-expanded"() {
				return s.expanded;
			},
			get "aria-controls"() {
				return s.controls;
			},
			contentLayout: "iconText",
			shape: "rounded",
			get selected() {
				return s.expanded;
			},
			get disabled() {
				return d();
			},
			get onClick() {
				return s.onClick;
			},
			children: (t, r) => {
				var i = Fe(), l = y(i), u = (e) => {
					var t = Ne();
					a(e, t);
				}, f = (e) => {
					var t = Pe(), r = T(t);
					_(() => n(r, 1, `post-history-thread-toggle-icon ${s.expanded ? "post-history-thread-toggle-icon-collapse" : "post-history-thread-toggle-icon-arrow-top-right"} svg-icon`, "svelte-cenxtw")), a(e, t);
				};
				e(l, (e) => {
					d() ? e(u) : e(f, -1);
				});
				var p = C(l, 2), m = T(p, !0);
				_((e) => o(m, e), [() => c()("postHistory.replyTargetLabel")]), a(t, i);
			},
			$$slots: { default: !0 }
		});
	}
	r(), u();
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/postHistoryRelatedTargetDiscoveryAdapter.ts
var Re = 8, ze = {
	byPostId: {},
	contextsByEventId: {}
};
function Be(e) {
	return M.sanitizeExternalRelayUrls(e, { limit: Re });
}
function Ve(e) {
	return {
		sourceEventId: e.sourceEventId,
		targetEventId: e.targetEventId,
		relationKind: e.relationKind,
		relayHints: Be(e.relayHints),
		authorHint: e.authorHint,
		scopeKey: e.scopeKey
	};
}
var $ = {
	buildIndex(e) {
		let t = {}, n = {};
		for (let r of e) {
			let e = ne(r);
			if (e.length !== 0) {
				t[r.eventId] = e;
				for (let t of e) {
					let e = n[t.eventId];
					n[t.eventId] = {
						eventId: t.eventId,
						sourceEventId: e?.sourceEventId ?? r.eventId,
						authorHint: e?.authorHint ?? t.authorHint,
						relayHints: Be([
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
		return Ve({
			sourceEventId: e.sourceEventId,
			targetEventId: e.eventId,
			relationKind: "quote",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, He = {
	getRelayHints(e, t) {
		let n = P(t.event);
		return Be([
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
		let t = P(e.event);
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
		return Ve({
			sourceEventId: e.sourceEventId,
			targetEventId: e.targetEventId,
			relationKind: "reply-parent",
			relayHints: e.relayHints,
			authorHint: e.authorHint,
			scopeKey: t
		});
	}
}, Ue = 0;
function We(e) {
	switch (e) {
		case void 0: return "idle";
		case "resolved":
		case "not-found":
		case "deleted":
		case "error": return e;
		default: return "loading";
	}
}
function Ge(e, t) {
	let n = We(t?.status);
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
function Ke({ getShow: e, getPosts: t, getRxNostr: n, getRelayConfig: r, postHistoryRepositoryImpl: i = R, contextFetchService: a = W, deletionRequestsRepositoryImpl: o = U, deletionFetchService: s = K, profileSyncCoordinator: c = void 0, relatedTargetResolver: l = void 0 }) {
	let u = l ?? ce({
		getShow: e,
		getRxNostr: n,
		getRelayConfig: r,
		postHistoryRepositoryImpl: i,
		contextFetchService: a,
		deletionRequestsRepositoryImpl: o,
		deletionFetchService: s,
		profileSyncCoordinator: c
	}), d = !l, f = `post-history-quote-preview:${++Ue}`, p = j(0), m = null, _ = ze, v = 0;
	function y() {
		let n = t();
		return n !== m && (m = n, _ = $.buildIndex(n)), e() ? _ : ze;
	}
	function b() {
		d && u.reset();
	}
	function x(e) {
		return O(p), (y().byPostId[e.eventId] ?? []).map((e) => Ge(e.eventId, u.getTargetSnapshot(e.eventId, e)));
	}
	function C(t) {
		e() && T(y(), !0, t);
	}
	function w(e, t) {
		let n = /* @__PURE__ */ new Map();
		for (let [r, i] of Object.entries(e.byPostId)) for (let a of i) {
			if (t && a.eventId !== t) continue;
			let i = e.contextsByEventId[a.eventId], o = $.toDescriptor({
				...i,
				sourceEventId: r,
				authorHint: a.authorHint
			}, f), s = n.get(a.eventId);
			s ? s.push(o) : n.set(a.eventId, [o]);
		}
		return n;
	}
	async function T(t, n = !1, r) {
		let i = v;
		await Promise.all([...w(t, r).values()].map(async (t) => {
			for (let r = 0; r < t.length; r++) {
				if (!e() || i !== v) return;
				let a = t[r], o = u.getTargetSnapshot(a.targetEventId), s = await u.ensureTarget(a, { force: r === 0 ? n : o?.status !== "resolved" });
				if (s?.status === "resolved" || s?.status === "deleted" || s?.status !== "not-found" && s?.errorCode !== "invalid_event") return;
			}
		}));
	}
	async function E(t) {
		e() && await T($.buildIndex(t), !0);
	}
	return S(() => {
		e() && h(p, u.getScopeRevision(f), !0);
	}), S(() => {
		if (!e()) return;
		n(), r();
		let t = y();
		return v++, g(() => {
			T(t);
		}), () => {
			v++, u.invalidateScope(f);
		};
	}), A(() => {
		v++, u.invalidateScope(f), b();
	}), {
		getQuotePreviews: x,
		collectLocalDescriptors: (e) => [...w($.buildIndex(e)).values()].flat(),
		retryQuotePreview: C,
		refreshQuotePreviews: E,
		suspend: () => {
			v++, u.invalidateScope(f);
		}
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/lib/sensitiveBodyLoaderCache.ts
function qe() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t, n, r = []) {
		if (!t) return;
		let i = r.join("\n"), a = e.get(t);
		if (a && a.ownerPubkey === n.ownerPubkey && a.rxNostr === n.rxNostr && a.relayConfig === n.relayConfig && a.relayKey === i) return a.loader;
		let o = he({
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
function Je(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function Ye(e, t) {
	let n = e.length === t.length, r = !1, i = t.map((t, i) => {
		let a = Ze(e[i], t);
		return n &&= a === e[i], r ||= a !== t, a;
	});
	return n ? e : r ? i : t;
}
function Xe(e, t) {
	let n = Object.keys(t), r = Object.keys(e).length === n.length, i = !1, a = {};
	for (let o of n) {
		let n = Ze(e[o], t[o]);
		a[o] = n, r &&= n === e[o] && Object.hasOwn(e, o), i ||= n !== t[o];
	}
	return r ? e : i ? a : t;
}
function Ze(e, t) {
	return Object.is(e, t) ? e : Array.isArray(e) && Array.isArray(t) ? Ye(e, t) : Je(e) && Je(t) ? Xe(e, t) : t;
}
function Qe(e, t) {
	return e === void 0 ? t : Ze(e, t);
}
export { He as a, ke as c, ge as d, $ as i, Te as l, qe as n, Le as o, Ke as r, Me as s, Qe as t, _e as u };
