import { At as e, B as t, F as n, G as r, I as i, J as a, M as o, R as s, Tt as c, U as l, X as u, Y as d, _t as f, a as p, bt as m, dt as h, ft as g, ht as _, jt as v, k as y, lt as b, n as x, o as S, ot as C, pt as w, r as T, s as E, st as D, t as O, tt as k, ut as A, v as ee, w as te, wt as ne } from "./index-client-57Odq85c.js";
import { l as j } from "./relayConfigUtils-DD5f1UAM.js";
import { pt as re } from "./LoadingPlaceholder-DK5Hrsgb.js";
import { c as M, l as ie } from "./appUtils-CwuZyofa.js";
import { t as ae } from "./useDialogHistory.svelte-BddVYV4P.js";
import { t as oe } from "./DialogWrapper-CvCDxqOJ.js";
import { t as se } from "./dialog-close-BfZcAfRJ.js";
import { r as N } from "./editorStore.svelte-BWDbxWYk.js";
import { B as ce, G as P, H as le, J as F, U as ue, V as de, W as I, z as fe } from "./App-BWEIk7fu.js";
import { t as L } from "./domSanitizer-B8U0JrXL.js";
import { t as pe } from "./InfoPopoverButton-dKimDdMq.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/draftDisplayUtils.ts
function R(e) {
	return e ? L(e).trim() : "";
}
function z(e) {
	return e.length <= 16 ? e : F(e, 10, 4);
}
function B(e) {
	if (!e) return "";
	try {
		let t = j.npubEncode(e);
		return F(t, 12, 4);
	} catch {
		return z(e);
	}
}
function V(e) {
	return e.authorDisplayName?.trim() || B(e.authorPubkey) || z(e.eventId);
}
function H(e) {
	let t = P(e);
	return t.name?.trim() || `ID: ${z(t.eventId)}`;
}
function U(e) {
	return "reply" in e || "quotes" in e;
}
function W(e) {
	return e ? U(e) ? e.reply ?? null : e.mode === "reply" ? e : null : null;
}
function G(e) {
	return e ? U(e) ? e.quotes : e.mode === "quote" ? [e] : [] : [];
}
function K(e, t, n) {
	let r = I(e.content, e.galleryItems, n), i = r.firstLine.trim(), a = [];
	r.hasImage && a.push(t.image), r.hasVideo && a.push(t.video);
	let o = a.join("");
	if (!i) return o;
	if (!o) return i.length > 50 ? `${i.substring(0, 50)}...` : i;
	let s = `${i} ${o}`;
	if (s.length <= 50) return s;
	let c = 50 - o.length - 4;
	return c > 0 ? `${i.substring(0, c)}... ${o}` : o;
}
function me(e, t, n = document) {
	let r = [];
	if (e.channelData) {
		let n = P(e.channelData);
		r.push({
			kind: "channel",
			label: t.channel,
			name: H(e.channelData),
			detail: R(n.about)
		});
	}
	let i = W(e.replyQuoteData);
	i && r.push({
		kind: "reply",
		label: t.reply,
		name: V(i),
		detail: R(i.referencedEvent?.content)
	}), G(e.replyQuoteData).forEach((e) => {
		r.push({
			kind: "quote",
			label: t.quote,
			name: V(e),
			detail: R(e.referencedEvent?.content)
		});
	});
	let a = K(e, t, n);
	return {
		title: r.length > 0 ? r.map((e) => `${e.label}: ${e.name}`).join(" / ") : a || e.preview,
		bodyPreview: a,
		contexts: r
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DraftListDialog.svelte
var he = r("<div class=\"save-draft-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"btn-text\"> </span>", 1), ge = r("<div class=\"xmark-icon svg-icon svelte-1gnpyqn\"></div>"), _e = r("<div class=\"dialog-footer-actions svelte-1gnpyqn\"><!></div> <!>", 1), ve = r("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"delete-all-label\"> </span>", 1), ye = r("<div class=\"load-error svelte-1gnpyqn\"><div role=\"alert\"> </div> <!></div>"), q = r("<div class=\"empty-message svelte-1gnpyqn\"> </div>"), be = r("<div class=\"thumbtack-icon svg-icon svelte-1gnpyqn\"></div>"), xe = r("<span class=\"context-detail svelte-1gnpyqn\"> </span>"), Se = r("<span><span class=\"preview-mode-icon svg-icon svelte-1gnpyqn\"></span> <span class=\"context-name svelte-1gnpyqn\"> </span> <!></span>"), J = r("<span class=\"draft-preview svelte-1gnpyqn\"> </span>"), Ce = r("<span class=\"draft-context-list svelte-1gnpyqn\"></span> <!>", 1), we = r("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div>"), Te = r("<li class=\"draft-item svelte-1gnpyqn\"><!> <button type=\"button\" class=\"draft-content svelte-1gnpyqn\"><span class=\"draft-main svelte-1gnpyqn\"><!></span> <span class=\"draft-timestamp svelte-1gnpyqn\"> </span></button> <!></li>"), Ee = r("<ul class=\"draft-list svelte-1gnpyqn\"></ul>"), De = r("<div class=\"dialog-heading-container svelte-1gnpyqn\"><div class=\"dialog-heading-wrapper svelte-1gnpyqn\"><h3 class=\"dialog-heading svelte-1gnpyqn\"> </h3> <!></div> <!></div> <div class=\"draft-list-container svelte-1gnpyqn\"><!></div>", 1), Oe = r("<div> </div>"), ke = r("<!> <!>", 1), Ae = {
	hash: "svelte-1gnpyqn",
	code: ".draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,\n    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.channel-context.svelte-1gnpyqn .context-name:where(.svelte-1gnpyqn) {flex:0 1 auto;min-width:0;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.channel-context.svelte-1gnpyqn .context-detail:where(.svelte-1gnpyqn) {flex:1 1 0;}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function je(r, d) {
	c(d, !0), y(r, Ae);
	let j = () => E(re, "$_", P), [P, F] = S(), I = T(d, "show", 15, !1), L = T(d, "pubkeyHex", 3, null), R = f(w([])), z = f("idle"), B = f("loading"), V = f(void 0), H = f(!1), U, W = 0, G = 0, K = !1;
	function je() {
		return {
			channel: j()("channelComposer.selected_label") || "チャンネル",
			reply: j()("replyQuote.reply_label") || "リプライ",
			quote: j()("replyQuote.quote_label") || "引用",
			image: j()("draft.media.image") || "[画像]",
			video: j()("draft.media.video") || "[動画]"
		};
	}
	let Me = m(() => N.postStatus), Ne = m(() => N.isUploading), Pe = m(() => k(B) === "ready" && k(V) !== void 0 && k(V) === L()), Fe = m(() => !d.canSaveDraft || k(Me).sending || k(Ne) || k(z) !== "idle" || !k(Pe)), Y = m(() => k(z) !== "idle" || !k(Pe));
	function X() {
		I(!1), d.onClose?.();
	}
	ae(() => I(), X, !0);
	function Ie() {
		U !== void 0 && (clearTimeout(U), U = void 0);
	}
	function Le() {
		Ie(), _(H, !0), U = setTimeout(() => {
			K || (_(H, !1), U = void 0);
		}, 2e3);
	}
	async function Z(e, t = !1) {
		if (!I() || e !== L()) return;
		let n = ++W;
		_(B, "loading"), t && (_(R, [], !0), _(V, void 0));
		try {
			let t = await le({ pubkeyHex: e });
			!K && I() && e === L() && n === W && (_(R, t, !0), _(V, e, !0), _(B, "ready"));
		} catch (t) {
			!K && I() && e === L() && n === W && (_(R, [], !0), _(V, void 0), _(B, "failed")), console.error("下書き一覧の読み込みに失敗:", t);
		}
	}
	function Re(e) {
		I() && e.pubkeyHex === L() && (Le(), Z(e.pubkeyHex));
	}
	x(() => d.subscribeToDraftSaveCompleted(Re)), O(() => {
		K = !0, W += 1, G += 1, Ie();
	}), D(() => {
		let e = L();
		I() ? (G += 1, _(z, "idle"), Z(e, !0)) : (W += 1, G += 1, _(R, [], !0), _(V, void 0), _(B, "loading"), _(z, "idle"));
	});
	function ze(e) {
		k(Y) || k(V) !== L() || (d.onApplyDraft(e), X());
	}
	async function Be() {
		if (k(Fe)) return;
		let e = L(), t = ++G;
		_(z, "saving");
		try {
			await d.onSaveDraft();
		} finally {
			!K && t === G && e === L() && _(z, "idle");
		}
	}
	async function Q(e) {
		if (k(Y) || k(V) === void 0 || k(V) !== L()) return;
		let t = k(V), n = ++G;
		_(z, "mutating-list");
		try {
			if (await e({ pubkeyHex: t }), K || n !== G || t !== L()) return;
			await Z(t);
		} catch (e) {
			console.error("下書き一覧の更新に失敗:", e);
		} finally {
			!K && n === G && t === L() && _(z, "idle");
		}
	}
	async function Ve(e) {
		await Q((t) => ce(e, t));
	}
	async function He(e) {
		await Q((t) => ue(e.id, !e.pinned, t));
	}
	async function Ue() {
		await Q((e) => fe(e));
	}
	function We() {
		I() && k(B) === "failed" && Z(L(), !0);
	}
	var Ge = ke(), $ = A(Ge);
	{
		let r = (e) => {
			var n = _e(), r = A(n), i = b(r);
			{
				let e = m(() => j()("draft.save") || "下書き保存");
				M(i, {
					className: "save-draft-button",
					variant: "primary",
					shape: "square",
					contentLayout: "iconText",
					get ariaLabel() {
						return k(e);
					},
					get disabled() {
						return k(Fe);
					},
					onClick: Be,
					children: (e, n) => {
						var r = he(), i = g(A(r), 2), a = h(i, !0);
						C((e) => t(a, e), [() => j()("draft.save") || "下書き保存"]), l(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			v(r);
			var a = g(r, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = m(() => j()("global.close") || "閉じる");
						M(e, p(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return k(t);
							},
							children: (e, t) => {
								var n = ge();
								C((e) => ee(n, "aria-label", e), [() => j()("global.close") || "閉じる"]), l(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				o(a, () => se, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			l(e, n);
		}, c = m(() => j()("draft.list_title") || "下書き一覧"), d = m(() => j()("draft.list_description") || "保存した下書きを選択して復元");
		oe($, {
			onOpenChange: (e) => !e && X(),
			get title() {
				return k(c);
			},
			get description() {
				return k(d);
			},
			contentClass: "draft-list-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return I();
			},
			set open(e) {
				I(e);
			},
			footer: r,
			children: (r, o) => {
				var c = De(), d = A(c), f = b(d), p = b(f), _ = h(p, !0), y = g(p, 2);
				{
					let n = m(() => j()("draft.info") || "下書き情報");
					pe(y, {
						side: "bottom",
						sideOffset: 8,
						get ariaLabel() {
							return k(n);
						},
						children: (n, r) => {
							e();
							var i = a();
							C((e) => t(i, e), [() => j()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"]), l(n, i);
						},
						$$slots: { default: !0 }
					});
				}
				v(f);
				var x = g(f, 2);
				{
					let e = m(() => j()("draft.delete_all") || "全て削除");
					M(x, {
						className: "delete-all-button",
						variant: "default",
						shape: "rounded",
						get ariaLabel() {
							return k(e);
						},
						get disabled() {
							return k(Y);
						},
						onClick: Ue,
						children: (e, n) => {
							var r = ve(), i = g(A(r), 2), a = h(i, !0);
							C((e) => t(a, e), [() => j()("draft.delete_all") || "全て削除"]), l(e, r);
						},
						$$slots: { default: !0 }
					});
				}
				v(d);
				var S = g(d, 2), w = b(S), T = (n) => {
					var r = ye(), i = b(r), o = h(i, !0), s = g(i, 2);
					{
						let n = m(() => j()("draft.retry_load") || "再試行");
						M(s, {
							className: "retry-load-button",
							variant: "secondary",
							shape: "square",
							get ariaLabel() {
								return k(n);
							},
							onClick: We,
							children: (n, r) => {
								e();
								var i = a();
								C((e) => t(i, e), [() => j()("draft.retry_load") || "再試行"]), l(n, i);
							},
							$$slots: { default: !0 }
						});
					}
					v(r), C((e) => t(o, e), [() => j()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), l(n, r);
				}, E = (e) => {
					var n = q(), r = h(n, !0);
					C((e) => t(r, e), [() => j()("loadingPlaceholder.loading") || "読み込み中..."]), l(e, n);
				}, D = (e) => {
					var n = q(), r = h(n, !0);
					C((e) => t(r, e), [() => j()("draft.no_drafts") || "下書きがありません"]), l(e, n);
				}, O = (e) => {
					var r = Ee();
					n(r, 21, () => k(R), (e) => e.id, (e, r) => {
						let a = m(() => me(k(r), je(), document));
						var o = Te(), c = b(o);
						{
							let e = m(() => `pin-button ${k(r).pinned ? "pinned" : ""}`), t = m(() => k(r).pinned ? j()("draft.unpin") || "ピン留めを解除" : j()("draft.pin") || "ピン留め"), n = m(() => k(r).pinned ? "true" : "false");
							M(c, {
								get className() {
									return k(e);
								},
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return k(t);
								},
								get "aria-pressed"() {
									return k(n);
								},
								get disabled() {
									return k(Y);
								},
								onClick: () => void He(k(r)),
								children: (e, t) => {
									var n = be();
									l(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						var d = g(c, 2), f = b(d), p = b(f), _ = (e) => {
							var r = Ce(), o = A(r);
							n(o, 21, () => k(a).contexts, i, (e, n) => {
								var r = Se();
								let i;
								var a = g(b(r), 2), o = h(a, !0), c = g(a, 2), u = (e) => {
									var r = xe(), i = h(r, !0);
									C(() => t(i, k(n).detail)), l(e, r);
								};
								s(c, (e) => {
									k(n).detail && e(u);
								}), v(r), C(() => {
									i = te(r, 1, "draft-context-row svelte-1gnpyqn", null, i, {
										"channel-context": k(n).kind === "channel",
										"reply-context": k(n).kind === "reply",
										"quote-context": k(n).kind === "quote"
									}), t(o, k(n).name);
								}), l(e, r);
							}), v(o);
							var c = g(o, 2), u = (e) => {
								var n = J(), r = h(n, !0);
								C(() => t(r, k(a).bodyPreview)), l(e, n);
							};
							s(c, (e) => {
								k(a).bodyPreview && e(u);
							}), l(e, r);
						}, y = (e) => {
							var n = J(), r = h(n, !0);
							C(() => t(r, k(a).title)), l(e, n);
						};
						s(p, (e) => {
							k(a).contexts.length > 0 ? e(_) : e(y, -1);
						}), v(f);
						var x = g(f, 2), S = h(x, !0);
						v(d);
						var w = g(d, 2);
						{
							let e = m(() => j()("draft.delete") || "削除");
							M(w, {
								className: "delete-button",
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return k(e);
								},
								get disabled() {
									return k(Y);
								},
								onClick: () => void Ve(k(r).id),
								children: (e, t) => {
									var n = we();
									l(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						v(o), C((e) => {
							d.disabled = k(Y), t(S, e);
						}, [() => de(k(r).timestamp)]), u("click", d, () => ze(k(r))), l(e, o);
					}), v(r), l(e, r);
				};
				s(w, (e) => {
					k(B) === "failed" ? e(T) : k(B) === "loading" || k(V) !== L() ? e(E, 1) : k(B) === "ready" && k(V) === L() && k(R).length === 0 ? e(D, 2) : k(B) === "ready" && k(V) === L() && e(O, 3);
				}), v(S), C((e) => t(_, e), [() => j()("draft.title") || "下書き"]), l(r, c);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var Ke = g($, 2);
	ie(Ke, {
		get show() {
			return k(H);
		},
		variant: "top-right",
		children: (e, n) => {
			var r = Oe(), i = h(r, !0);
			C((e) => t(i, e), [() => j()("draft.saved") || "下書きを保存しました"]), l(e, r);
		},
		$$slots: { default: !0 }
	}), l(r, Ge), ne(), F();
}
d(["click"]);
export { je as default };
