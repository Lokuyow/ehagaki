import { At as e, B as t, Ct as n, F as r, G as i, I as a, J as o, M as s, R as c, U as l, Y as u, a as d, at as f, ct as p, dt as m, et as h, ft as g, gt as _, k as v, kt as y, lt as b, mt as x, n as S, o as C, ot as w, q as T, r as E, s as D, t as ee, ut as O, v as te, w as ne, wt as re, yt as k } from "./index-client-Bdka-Daw.js";
import { l as A } from "./relayConfigUtils-DD5f1UAM.js";
import { pt as ie } from "./LoadingPlaceholder-j1_vRYno.js";
import { c as j, l as ae } from "./appUtils-Bsk0mFqn.js";
import { t as oe } from "./useDialogHistory.svelte-C49eZejL.js";
import { t as se } from "./DialogWrapper-C4-jPsAO.js";
import { t as ce } from "./dialog-close-DgGAhT4f.js";
import { r as M } from "./editorStore.svelte-3FSqdFUX.js";
import { B as le, H as ue, R as de, U as N, V as fe, W as P, q as F, z as pe } from "./App-BVcniO1E.js";
import { t as I } from "./domSanitizer-B8U0JrXL.js";
import { t as me } from "./InfoPopoverButton-CH8LtJ7D.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/draftDisplayUtils.ts
function L(e) {
	return e ? I(e).trim() : "";
}
function R(e) {
	return e.length <= 16 ? e : F(e, 10, 4);
}
function z(e) {
	if (!e) return "";
	try {
		let t = A.npubEncode(e);
		return F(t, 12, 4);
	} catch {
		return R(e);
	}
}
function B(e) {
	return e.authorDisplayName?.trim() || z(e.authorPubkey) || R(e.eventId);
}
function V(e) {
	let t = P(e);
	return t.name?.trim() || `ID: ${R(t.eventId)}`;
}
function H(e) {
	return "reply" in e || "quotes" in e;
}
function U(e) {
	return e ? H(e) ? e.reply ?? null : e.mode === "reply" ? e : null : null;
}
function W(e) {
	return e ? H(e) ? e.quotes : e.mode === "quote" ? [e] : [] : [];
}
function G(e, t, n) {
	let r = N(e.content, e.galleryItems, n), i = r.firstLine.trim(), a = [];
	r.hasImage && a.push(t.image), r.hasVideo && a.push(t.video);
	let o = a.join("");
	if (!i) return o;
	if (!o) return i.length > 50 ? `${i.substring(0, 50)}...` : i;
	let s = `${i} ${o}`;
	if (s.length <= 50) return s;
	let c = 50 - o.length - 4;
	return c > 0 ? `${i.substring(0, c)}... ${o}` : o;
}
function he(e, t, n = document) {
	let r = [];
	if (e.channelData) {
		let n = P(e.channelData);
		r.push({
			kind: "channel",
			label: t.channel,
			name: V(e.channelData),
			detail: L(n.about)
		});
	}
	let i = U(e.replyQuoteData);
	i && r.push({
		kind: "reply",
		label: t.reply,
		name: B(i),
		detail: L(i.referencedEvent?.content)
	}), W(e.replyQuoteData).forEach((e) => {
		r.push({
			kind: "quote",
			label: t.quote,
			name: B(e),
			detail: L(e.referencedEvent?.content)
		});
	});
	let a = G(e, t, n);
	return {
		title: r.length > 0 ? r.map((e) => `${e.label}: ${e.name}`).join(" / ") : a || e.preview,
		bodyPreview: a,
		contexts: r
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DraftListDialog.svelte
var ge = i("<div class=\"save-draft-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"btn-text\"> </span>", 1), _e = i("<div class=\"xmark-icon svg-icon svelte-1gnpyqn\"></div>"), ve = i("<div class=\"dialog-footer-actions svelte-1gnpyqn\"><!></div> <!>", 1), ye = i("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"delete-all-label\"> </span>", 1), be = i("<div class=\"load-error svelte-1gnpyqn\"><div role=\"alert\"> </div> <!></div>"), K = i("<div class=\"empty-message svelte-1gnpyqn\"> </div>"), xe = i("<div class=\"thumbtack-icon svg-icon svelte-1gnpyqn\"></div>"), Se = i("<span class=\"context-detail svelte-1gnpyqn\"> </span>"), Ce = i("<span><span class=\"preview-mode-icon svg-icon svelte-1gnpyqn\"></span> <span class=\"context-name svelte-1gnpyqn\"> </span> <!></span>"), q = i("<span class=\"draft-preview svelte-1gnpyqn\"> </span>"), we = i("<span class=\"draft-context-list svelte-1gnpyqn\"></span> <!>", 1), Te = i("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div>"), Ee = i("<li class=\"draft-item svelte-1gnpyqn\"><!> <button type=\"button\" class=\"draft-content svelte-1gnpyqn\"><span class=\"draft-main svelte-1gnpyqn\"><!></span> <span class=\"draft-timestamp svelte-1gnpyqn\"> </span></button> <!></li>"), De = i("<ul class=\"draft-list svelte-1gnpyqn\"></ul>"), Oe = i("<div class=\"dialog-heading-container svelte-1gnpyqn\"><div class=\"dialog-heading-wrapper svelte-1gnpyqn\"><h3 class=\"dialog-heading svelte-1gnpyqn\"> </h3> <!></div> <!></div> <div class=\"draft-list-container svelte-1gnpyqn\"><!></div>", 1), ke = i("<div> </div>"), Ae = i("<!> <!>", 1), je = {
	hash: "svelte-1gnpyqn",
	code: ".draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,\n    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.channel-context.svelte-1gnpyqn .context-name:where(.svelte-1gnpyqn) {flex:0 1 auto;min-width:0;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.channel-context.svelte-1gnpyqn .context-detail:where(.svelte-1gnpyqn) {flex:1 1 0;}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function J(i, o) {
	re(o, !0), v(i, je);
	let A = () => D(ie, "$_", N), [N, P] = C(), F = E(o, "show", 15, !1), I = E(o, "pubkeyHex", 3, null), L = _(g([])), R = _("idle"), z = _("loading"), B = _(void 0), V = _(!1), H, U = 0, W = 0, G = !1;
	function J() {
		return {
			channel: A()("channelComposer.selected_label") || "チャンネル",
			reply: A()("replyQuote.reply_label") || "リプライ",
			quote: A()("replyQuote.quote_label") || "引用",
			image: A()("draft.media.image") || "[画像]",
			video: A()("draft.media.video") || "[動画]"
		};
	}
	let Me = k(() => M.postStatus), Ne = k(() => M.isUploading), Y = k(() => h(z) === "ready" && h(B) !== void 0 && h(B) === I()), Pe = k(() => !o.canSaveDraft || h(Me).sending || h(Ne) || h(R) !== "idle" || !h(Y)), X = k(() => h(R) !== "idle" || !h(Y));
	function Z() {
		F(!1), o.onClose?.();
	}
	oe(() => F(), Z, !0);
	function Fe() {
		H !== void 0 && (clearTimeout(H), H = void 0);
	}
	function Ie() {
		Fe(), x(V, !0), H = setTimeout(() => {
			G || (x(V, !1), H = void 0);
		}, 2e3);
	}
	async function Q(e, t = !1) {
		if (!F() || e !== I()) return;
		let n = ++U;
		x(z, "loading"), t && (x(L, [], !0), x(B, void 0));
		try {
			let t = await fe({ pubkeyHex: e });
			!G && F() && e === I() && n === U && (x(L, t, !0), x(B, e, !0), x(z, "ready"));
		} catch (t) {
			!G && F() && e === I() && n === U && (x(L, [], !0), x(B, void 0), x(z, "failed")), console.error("下書き一覧の読み込みに失敗:", t);
		}
	}
	function Le(e) {
		F() && e.pubkeyHex === I() && (Ie(), Q(e.pubkeyHex));
	}
	S(() => o.subscribeToDraftSaveCompleted(Le)), ee(() => {
		G = !0, U += 1, W += 1, Fe();
	}), w(() => {
		let e = I();
		F() ? (W += 1, x(R, "idle"), Q(e, !0)) : (U += 1, W += 1, x(L, [], !0), x(B, void 0), x(z, "loading"), x(R, "idle"));
	});
	function Re(e) {
		h(X) || h(B) !== I() || (o.onApplyDraft(e), Z());
	}
	async function ze() {
		if (h(Pe)) return;
		let e = I(), t = ++W;
		x(R, "saving");
		try {
			await o.onSaveDraft();
		} finally {
			!G && t === W && e === I() && x(R, "idle");
		}
	}
	async function $(e) {
		if (h(X) || h(B) === void 0 || h(B) !== I()) return;
		let t = h(B), n = ++W;
		x(R, "mutating-list");
		try {
			if (await e({ pubkeyHex: t }), G || n !== W || t !== I()) return;
			await Q(t);
		} catch (e) {
			console.error("下書き一覧の更新に失敗:", e);
		} finally {
			!G && n === W && t === I() && x(R, "idle");
		}
	}
	async function Be(e) {
		await $((t) => pe(e, t));
	}
	async function Ve(e) {
		await $((t) => ue(e.id, !e.pinned, t));
	}
	async function He() {
		await $((e) => de(e));
	}
	function Ue() {
		F() && h(z) === "failed" && Q(I(), !0);
	}
	var We = Ae(), Ge = b(We);
	{
		let n = (n) => {
			var r = ve(), i = b(r), a = p(i);
			{
				let e = k(() => A()("draft.save") || "下書き保存");
				j(a, {
					className: "save-draft-button",
					variant: "primary",
					shape: "square",
					contentLayout: "iconText",
					get ariaLabel() {
						return h(e);
					},
					get disabled() {
						return h(Pe);
					},
					onClick: ze,
					children: (e, n) => {
						var r = ge(), i = m(b(r), 2), a = O(i, !0);
						f((e) => t(a, e), [() => A()("draft.save") || "下書き保存"]), l(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			e(i);
			var o = m(i, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = k(() => A()("global.close") || "閉じる");
						j(e, d(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return h(t);
							},
							children: (e, t) => {
								var n = _e();
								f((e) => te(n, "aria-label", e), [() => A()("global.close") || "閉じる"]), l(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				s(o, () => ce, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			l(n, r);
		}, i = k(() => A()("draft.list_title") || "下書き一覧"), o = k(() => A()("draft.list_description") || "保存した下書きを選択して復元");
		se(Ge, {
			onOpenChange: (e) => !e && Z(),
			get title() {
				return h(i);
			},
			get description() {
				return h(o);
			},
			contentClass: "draft-list-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return F();
			},
			set open(e) {
				F(e);
			},
			footer: n,
			children: (n, i) => {
				var o = Oe(), s = b(o), d = p(s), g = p(d), _ = O(g, !0), v = m(g, 2);
				{
					let e = k(() => A()("draft.info") || "下書き情報");
					me(v, {
						side: "bottom",
						sideOffset: 8,
						get ariaLabel() {
							return h(e);
						},
						children: (e, n) => {
							y();
							var r = T();
							f((e) => t(r, e), [() => A()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"]), l(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				e(d);
				var x = m(d, 2);
				{
					let e = k(() => A()("draft.delete_all") || "全て削除");
					j(x, {
						className: "delete-all-button",
						variant: "default",
						shape: "rounded",
						get ariaLabel() {
							return h(e);
						},
						get disabled() {
							return h(X);
						},
						onClick: He,
						children: (e, n) => {
							var r = ye(), i = m(b(r), 2), a = O(i, !0);
							f((e) => t(a, e), [() => A()("draft.delete_all") || "全て削除"]), l(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				e(s);
				var S = m(s, 2), C = p(S), w = (n) => {
					var r = be(), i = p(r), a = O(i, !0), o = m(i, 2);
					{
						let e = k(() => A()("draft.retry_load") || "再試行");
						j(o, {
							className: "retry-load-button",
							variant: "secondary",
							shape: "square",
							get ariaLabel() {
								return h(e);
							},
							onClick: Ue,
							children: (e, n) => {
								y();
								var r = T();
								f((e) => t(r, e), [() => A()("draft.retry_load") || "再試行"]), l(e, r);
							},
							$$slots: { default: !0 }
						});
					}
					e(r), f((e) => t(a, e), [() => A()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), l(n, r);
				}, E = (e) => {
					var n = K(), r = O(n, !0);
					f((e) => t(r, e), [() => A()("loadingPlaceholder.loading") || "読み込み中..."]), l(e, n);
				}, D = (e) => {
					var n = K(), r = O(n, !0);
					f((e) => t(r, e), [() => A()("draft.no_drafts") || "下書きがありません"]), l(e, n);
				}, ee = (n) => {
					var i = De();
					r(i, 21, () => h(L), (e) => e.id, (n, i) => {
						let o = k(() => he(h(i), J(), document));
						var s = Ee(), d = p(s);
						{
							let e = k(() => `pin-button ${h(i).pinned ? "pinned" : ""}`), t = k(() => h(i).pinned ? A()("draft.unpin") || "ピン留めを解除" : A()("draft.pin") || "ピン留め"), n = k(() => h(i).pinned ? "true" : "false");
							j(d, {
								get className() {
									return h(e);
								},
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return h(t);
								},
								get "aria-pressed"() {
									return h(n);
								},
								get disabled() {
									return h(X);
								},
								onClick: () => void Ve(h(i)),
								children: (e, t) => {
									var n = xe();
									l(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						var g = m(d, 2), _ = p(g), v = p(_), y = (n) => {
							var i = we(), s = b(i);
							r(s, 21, () => h(o).contexts, a, (n, r) => {
								var i = Ce();
								let a;
								var o = m(p(i), 2), s = O(o, !0), u = m(o, 2), d = (e) => {
									var n = Se(), i = O(n, !0);
									f(() => t(i, h(r).detail)), l(e, n);
								};
								c(u, (e) => {
									h(r).detail && e(d);
								}), e(i), f(() => {
									a = ne(i, 1, "draft-context-row svelte-1gnpyqn", null, a, {
										"channel-context": h(r).kind === "channel",
										"reply-context": h(r).kind === "reply",
										"quote-context": h(r).kind === "quote"
									}), t(s, h(r).name);
								}), l(n, i);
							}), e(s);
							var u = m(s, 2), d = (e) => {
								var n = q(), r = O(n, !0);
								f(() => t(r, h(o).bodyPreview)), l(e, n);
							};
							c(u, (e) => {
								h(o).bodyPreview && e(d);
							}), l(n, i);
						}, x = (e) => {
							var n = q(), r = O(n, !0);
							f(() => t(r, h(o).title)), l(e, n);
						};
						c(v, (e) => {
							h(o).contexts.length > 0 ? e(y) : e(x, -1);
						}), e(_);
						var S = m(_, 2), C = O(S, !0);
						e(g);
						var w = m(g, 2);
						{
							let e = k(() => A()("draft.delete") || "削除");
							j(w, {
								className: "delete-button",
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return h(e);
								},
								get disabled() {
									return h(X);
								},
								onClick: () => void Be(h(i).id),
								children: (e, t) => {
									var n = Te();
									l(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						e(s), f((e) => {
							g.disabled = h(X), t(C, e);
						}, [() => le(h(i).timestamp)]), u("click", g, () => Re(h(i))), l(n, s);
					}), e(i), l(n, i);
				};
				c(C, (e) => {
					h(z) === "failed" ? e(w) : h(z) === "loading" || h(B) !== I() ? e(E, 1) : h(z) === "ready" && h(B) === I() && h(L).length === 0 ? e(D, 2) : h(z) === "ready" && h(B) === I() && e(ee, 3);
				}), e(S), f((e) => t(_, e), [() => A()("draft.title") || "下書き"]), l(n, o);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var Ke = m(Ge, 2);
	ae(Ke, {
		get show() {
			return h(V);
		},
		variant: "top-right",
		children: (e, n) => {
			var r = ke(), i = O(r, !0);
			f((e) => t(i, e), [() => A()("draft.saved") || "下書きを保存しました"]), l(e, r);
		},
		$$slots: { default: !0 }
	}), l(i, We), n(), P();
}
o(["click"]);
export { J as default };
