import { B as e, Dt as t, E as n, Et as r, G as i, H as a, K as o, L as s, Mt as c, Nt as l, P as u, Q as d, R as ee, St as f, X as p, Z as m, _t as h, a as g, b as _, ct as v, dt as y, f as te, ft as b, ht as x, j as S, k as ne, lt as re, mt as C, n as w, o as ie, pt as T, q as E, r as D, rt as O, s as ae, t as oe, yt as k, z as se } from "./index-client-DEFG3Gqk.js";
import { Z as ce } from "./LoadingPlaceholder-YrD8D_td.js";
import { C as A, g as j } from "./clipboardUtils-CSGkJuUA.js";
import { n as le, t as M } from "./Button-Cqrg0_jX.js";
import { t as ue } from "./useDialogHistory.svelte-pVteCIez.js";
import { t as de } from "./DialogWrapper-DlNV_DwH.js";
import { t as fe } from "./dialog-close-DFGIFxm7.js";
import { r as pe } from "./editorStore.svelte-Q7oo5cQe.js";
import { B as me, H as he, R as ge, U as _e, V as ve, W as N, z as ye } from "./App-CW2Ynbk9.js";
import { t as P } from "./domSanitizer-B8U0JrXL.js";
import { t as be } from "./InfoPopoverButton-DJx-e6v0.js";
import { n as xe } from "./listEdgeObserver-z6l0zYDS.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/draftDisplayUtils.ts
function F(e) {
	return e ? P(e).trim() : "";
}
function I(e) {
	return e.length <= 16 ? e : A(e, 10, 4);
}
function L(e) {
	return e ? j(e) : "";
}
function R(e) {
	return e.authorDisplayName?.trim() || L(e.authorPubkey) || I(e.eventId);
}
function z(e) {
	let t = N(e);
	return t.name?.trim() || `ID: ${I(t.eventId)}`;
}
function B(e) {
	return "reply" in e || "quotes" in e;
}
function V(e) {
	return e ? B(e) ? e.reply ?? null : e.mode === "reply" ? e : null : null;
}
function H(e) {
	return e ? B(e) ? e.quotes : e.mode === "quote" ? [e] : [] : [];
}
function U(e, t, n) {
	let r = _e(e.content, e.galleryItems, n), i = r.firstLine.trim(), a = [];
	r.hasImage && a.push(t.image), r.hasVideo && a.push(t.video);
	let o = a.join("");
	if (!i) return o;
	if (!o) return i.length > 50 ? `${i.substring(0, 50)}...` : i;
	let s = `${i} ${o}`;
	if (s.length <= 50) return s;
	let c = 50 - o.length - 4;
	return c > 0 ? `${i.substring(0, c)}... ${o}` : o;
}
function Se(e, t, n = document) {
	let r = [];
	if (e.channelData) {
		let n = N(e.channelData);
		r.push({
			kind: "channel",
			label: t.channel,
			name: z(e.channelData),
			detail: F(n.about)
		});
	}
	let i = V(e.replyQuoteData);
	i && r.push({
		kind: "reply",
		label: t.reply,
		name: R(i),
		detail: F(i.referencedEvent?.content)
	}), H(e.replyQuoteData).forEach((e) => {
		r.push({
			kind: "quote",
			label: t.quote,
			name: R(e),
			detail: F(e.referencedEvent?.content)
		});
	});
	let a = U(e, t, n);
	return {
		title: r.length > 0 ? r.map((e) => `${e.label}: ${e.name}`).join(" / ") : a || e.preview,
		bodyPreview: a,
		contexts: r
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DraftListDialog.svelte
var Ce = E("<div class=\"save-draft-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"btn-text\"> </span>", 1), we = E("<div class=\"xmark-icon svg-icon svelte-1gnpyqn\"></div>"), Te = E("<div class=\"dialog-footer-actions svelte-1gnpyqn\"><!></div> <!>", 1), Ee = E("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"delete-all-label\"> </span>", 1), De = E("<div class=\"load-error svelte-1gnpyqn\"><div role=\"alert\"> </div> <!></div>"), Oe = E("<div class=\"empty-message svelte-1gnpyqn\"> </div>"), ke = E("<div class=\"thumbtack-icon svg-icon svelte-1gnpyqn\"></div>"), Ae = E("<span class=\"context-detail svelte-1gnpyqn\"> </span>"), je = E("<span><span class=\"preview-mode-icon svg-icon svelte-1gnpyqn\"></span> <span class=\"context-name svelte-1gnpyqn\"> </span> <!></span>"), Me = E("<span class=\"draft-preview svelte-1gnpyqn\"> </span>"), Ne = E("<span class=\"draft-context-list svelte-1gnpyqn\"></span> <!>", 1), Pe = E("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div>"), Fe = E("<li class=\"draft-item svelte-1gnpyqn\"><!> <button type=\"button\" class=\"draft-content svelte-1gnpyqn\"><span class=\"draft-main svelte-1gnpyqn\"><!></span> <span class=\"draft-timestamp svelte-1gnpyqn\"> </span></button> <!></li>"), Ie = E("<div class=\"draft-list-sentinel svelte-1gnpyqn\" aria-hidden=\"true\"></div>"), Le = E("<ul class=\"draft-list svelte-1gnpyqn\"></ul> <!>", 1), Re = E("<div class=\"dialog-heading-container svelte-1gnpyqn\"><div class=\"dialog-heading-wrapper svelte-1gnpyqn\"><h3 class=\"dialog-heading svelte-1gnpyqn\"> </h3> <!></div> <!></div> <div class=\"draft-list-container svelte-1gnpyqn\"><!></div>", 1), ze = E("<div> </div>"), Be = E("<!> <!>", 1), Ve = {
	hash: "svelte-1gnpyqn",
	code: ".draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.draft-list-sentinel.svelte-1gnpyqn {height:1px;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,\n    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.channel-context.svelte-1gnpyqn .context-name:where(.svelte-1gnpyqn) {flex:0 1 auto;min-width:0;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.channel-context.svelte-1gnpyqn .context-detail:where(.svelte-1gnpyqn) {flex:1 1 0;}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function W(m, E) {
	t(E, !0), S(m, Ve);
	let A = () => ae(ce, "$_", j), [j, _e] = ie(), N = D(E, "show", 15, !1), P = D(E, "pubkeyHex", 3, null), F = typeof IntersectionObserver < "u", I = k(x([])), L = k(20), R = k(null), z = f(() => F ? O(I).slice(0, O(L)) : O(I)), B = k("idle"), V = k("loading"), H = k(void 0), U = k(!1), W, G = 0, K = 0, q = !1;
	function He() {
		return {
			channel: A()("channelComposer.selected_label") || "チャンネル",
			reply: A()("replyQuote.reply_label") || "リプライ",
			quote: A()("replyQuote.quote_label") || "引用",
			image: A()("draft.media.image") || "[画像]",
			video: A()("draft.media.video") || "[動画]"
		};
	}
	let Ue = f(() => pe.postStatus), We = f(() => pe.isUploading), J = f(() => O(V) === "ready" && O(H) !== void 0 && O(H) === P()), Ge = f(() => !E.canSaveDraft || O(Ue).sending || O(We) || O(B) !== "idle" || !O(J)), Y = f(() => O(B) !== "idle" || !O(J));
	function X() {
		N(!1), E.onClose?.();
	}
	ue(() => N(), X, !0);
	function Ke() {
		W !== void 0 && (clearTimeout(W), W = void 0);
	}
	function qe() {
		Ke(), h(U, !0), W = setTimeout(() => {
			q || (h(U, !1), W = void 0);
		}, 2e3);
	}
	async function Z(e, t = !1) {
		if (!N() || e !== P()) return;
		let n = ++G;
		h(V, "loading"), t && (h(I, [], !0), h(H, void 0));
		try {
			let t = await ve({ pubkeyHex: e });
			!q && N() && e === P() && n === G && (h(I, t, !0), h(H, e, !0), h(V, "ready"));
		} catch (t) {
			!q && N() && e === P() && n === G && (h(I, [], !0), h(H, void 0), h(V, "failed")), console.error("下書き一覧の読み込みに失敗:", t);
		}
	}
	function Je(e) {
		N() && e.pubkeyHex === P() && (qe(), Z(e.pubkeyHex));
	}
	w(() => E.subscribeToDraftSaveCompleted(Je)), oe(() => {
		q = !0, G += 1, K += 1, Ke();
	}), re(() => {
		let e = P();
		h(L, 20), N() ? (K += 1, h(B, "idle"), Z(e, !0)) : (G += 1, K += 1, h(I, [], !0), h(H, void 0), h(V, "loading"), h(B, "idle"));
	});
	function Ye(e) {
		O(Y) || O(H) !== P() || (E.onApplyDraft(e), X());
	}
	async function Xe() {
		if (O(Ge)) return;
		let e = P(), t = ++K;
		h(B, "saving");
		try {
			await E.onSaveDraft();
		} finally {
			!q && t === K && e === P() && h(B, "idle");
		}
	}
	async function Q(e) {
		if (O(Y) || O(H) === void 0 || O(H) !== P()) return;
		let t = O(H), n = ++K;
		h(B, "mutating-list");
		try {
			if (await e({ pubkeyHex: t }), q || n !== K || t !== P()) return;
			await Z(t);
		} catch (e) {
			console.error("下書き一覧の更新に失敗:", e);
		} finally {
			!q && n === K && t === P() && h(B, "idle");
		}
	}
	async function Ze(e) {
		await Q((t) => ye(e, t));
	}
	async function Qe(e) {
		await Q((t) => he(e.id, !e.pinned, t));
	}
	async function $e() {
		await Q((e) => ge(e));
	}
	function et() {
		N() && O(V) === "failed" && Z(P(), !0);
	}
	function tt() {
		return !N() || !O(J) || O(L) >= O(I).length ? !1 : (h(L, O(L) + 20), !0);
	}
	var nt = Be(), $ = b(nt);
	{
		let t = (e) => {
			var t = Te(), n = b(t), r = y(n);
			{
				let e = f(() => A()("draft.save") || "下書き保存");
				M(r, {
					className: "save-draft-button",
					variant: "primary",
					shape: "square",
					contentLayout: "iconText",
					get ariaLabel() {
						return O(e);
					},
					get disabled() {
						return O(Ge);
					},
					onClick: Xe,
					children: (e, t) => {
						var n = Ce(), r = C(b(n), 2), o = T(r, !0);
						v((e) => a(o, e), [() => A()("draft.save") || "下書き保存"]), i(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			l(n);
			var o = C(n, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = f(() => A()("global.close") || "閉じる");
						M(e, g(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return O(t);
							},
							children: (e, t) => {
								var n = we();
								v((e) => _(n, "aria-label", e), [() => A()("global.close") || "閉じる"]), i(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				u(o, () => fe, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			i(e, t);
		}, r = f(() => A()("draft.list_title") || "下書き一覧"), m = f(() => A()("draft.list_description") || "保存した下書きを選択して復元");
		de($, {
			onOpenChange: (e) => !e && X(),
			get title() {
				return O(r);
			},
			get description() {
				return O(m);
			},
			contentClass: "draft-list-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return N();
			},
			set open(e) {
				N(e);
			},
			footer: t,
			children: (t, r) => {
				var u = Re(), m = b(u), g = y(m), _ = y(g), x = T(_, !0), S = C(_, 2);
				{
					let e = f(() => A()("draft.info") || "下書き情報");
					be(S, {
						side: "bottom",
						sideOffset: 8,
						get ariaLabel() {
							return O(e);
						},
						children: (e, t) => {
							c();
							var n = p();
							v((e) => a(n, e), [() => A()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"]), i(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				l(g);
				var re = C(g, 2);
				{
					let e = f(() => A()("draft.delete_all") || "全て削除");
					M(re, {
						className: "delete-all-button",
						variant: "default",
						shape: "rounded",
						get ariaLabel() {
							return O(e);
						},
						get disabled() {
							return O(Y);
						},
						onClick: $e,
						children: (e, t) => {
							var n = Ee(), r = C(b(n), 2), o = T(r, !0);
							v((e) => a(o, e), [() => A()("draft.delete_all") || "全て削除"]), i(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				l(m);
				var w = C(m, 2), ie = y(w), E = (e) => {
					var t = De(), n = y(t), r = T(n, !0), o = C(n, 2);
					{
						let e = f(() => A()("draft.retry_load") || "再試行");
						M(o, {
							className: "retry-load-button",
							variant: "secondary",
							shape: "square",
							get ariaLabel() {
								return O(e);
							},
							onClick: et,
							children: (e, t) => {
								c();
								var n = p();
								v((e) => a(n, e), [() => A()("draft.retry_load") || "再試行"]), i(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					l(t), v((e) => a(r, e), [() => A()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), i(e, t);
				}, D = (e) => {
					var t = Oe(), n = T(t, !0);
					v((e) => a(n, e), [() => A()("loadingPlaceholder.loading") || "読み込み中..."]), i(e, t);
				}, ae = (e) => {
					var t = Oe(), n = T(t, !0);
					v((e) => a(n, e), [() => A()("draft.no_drafts") || "下書きがありません"]), i(e, t);
				}, oe = (t) => {
					var r = Le(), c = b(r);
					s(c, 21, () => O(z), (e) => e.id, (t, r) => {
						let o = f(() => Se(O(r), He(), document));
						var c = Fe(), u = y(c);
						{
							let e = f(() => `pin-button ${O(r).pinned ? "pinned" : ""}`), t = f(() => O(r).pinned ? A()("draft.unpin") || "ピン留めを解除" : A()("draft.pin") || "ピン留め"), n = f(() => O(r).pinned ? "true" : "false");
							M(u, {
								get className() {
									return O(e);
								},
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return O(t);
								},
								get "aria-pressed"() {
									return O(n);
								},
								get disabled() {
									return O(Y);
								},
								onClick: () => void Qe(O(r)),
								children: (e, t) => {
									var n = ke();
									i(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						var p = C(u, 2), m = y(p), h = y(m), g = (t) => {
							var r = Ne(), c = b(r);
							s(c, 21, () => O(o).contexts, ee, (t, r) => {
								var o = je();
								let s;
								var c = C(y(o), 2), u = T(c, !0), d = C(c, 2), ee = (e) => {
									var t = Ae(), n = T(t, !0);
									v(() => a(n, O(r).detail)), i(e, t);
								};
								e(d, (e) => {
									O(r).detail && e(ee);
								}), l(o), v(() => {
									s = n(o, 1, "draft-context-row svelte-1gnpyqn", null, s, {
										"channel-context": O(r).kind === "channel",
										"reply-context": O(r).kind === "reply",
										"quote-context": O(r).kind === "quote"
									}), a(u, O(r).name);
								}), i(t, o);
							}), l(c);
							var u = C(c, 2), d = (e) => {
								var t = Me(), n = T(t, !0);
								v(() => a(n, O(o).bodyPreview)), i(e, t);
							};
							e(u, (e) => {
								O(o).bodyPreview && e(d);
							}), i(t, r);
						}, _ = (e) => {
							var t = Me(), n = T(t, !0);
							v(() => a(n, O(o).title)), i(e, t);
						};
						e(h, (e) => {
							O(o).contexts.length > 0 ? e(g) : e(_, -1);
						}), l(m);
						var te = C(m, 2), x = T(te, !0);
						l(p);
						var S = C(p, 2);
						{
							let e = f(() => A()("draft.delete") || "削除");
							M(S, {
								className: "delete-button",
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return O(e);
								},
								get disabled() {
									return O(Y);
								},
								onClick: () => void Ze(O(r).id),
								children: (e, t) => {
									var n = Pe();
									i(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						l(c), v((e) => {
							p.disabled = O(Y), a(x, e);
						}, [() => me(O(r).timestamp)]), d("click", p, () => Ye(O(r))), i(t, c);
					}), l(c);
					var u = C(c, 2), p = (e) => {
						var t = o(), n = b(t);
						se(n, () => O(L), (e) => {
							var t = Ie();
							ne(t, () => (e) => xe(O(R), e, tt)), i(e, t);
						}), i(e, t);
					};
					e(u, (e) => {
						N() && O(z).length < O(I).length && e(p);
					}), i(t, r);
				};
				e(ie, (e) => {
					O(V) === "failed" ? e(E) : O(V) === "loading" || O(H) !== P() ? e(D, 1) : O(V) === "ready" && O(H) === P() && O(I).length === 0 ? e(ae, 2) : O(V) === "ready" && O(H) === P() && e(oe, 3);
				}), l(w), te(w, (e) => h(R, e), () => O(R)), v((e) => a(x, e), [() => A()("draft.title") || "下書き"]), i(t, u);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var rt = C($, 2);
	le(rt, {
		get show() {
			return O(U);
		},
		variant: "top-right",
		children: (e, t) => {
			var n = ze(), r = T(n, !0);
			v((e) => a(r, e), [() => A()("draft.saved") || "下書きを保存しました"]), i(e, n);
		},
		$$slots: { default: !0 }
	}), i(m, nt), r(), _e();
}
m(["click"]);
export { W as default };
