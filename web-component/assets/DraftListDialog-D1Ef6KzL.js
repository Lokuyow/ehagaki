import { A as e, Et as t, I as n, K as r, L as i, Mt as a, N as o, T as s, Tt as c, V as l, W as u, X as d, Y as f, Z as ee, a as p, ct as m, dt as h, ft as g, gt as _, jt as v, mt as y, n as b, nt as x, o as S, pt as C, r as w, s as T, st as E, t as D, ut as O, vt as k, xt as A, y as te, z as j } from "./index-client-XkLzkVYC.js";
import { pt as ne } from "./LoadingPlaceholder-lit91akO.js";
import { $ as M, c as re, rt as N, s as P } from "./appUtils-BRia-Jm6.js";
import { t as ie } from "./useDialogHistory.svelte-BgJftJRE.js";
import { t as ae } from "./DialogWrapper-DOH4rn3S.js";
import { t as oe } from "./dialog-close-erjPpz45.js";
import { r as F } from "./editorStore.svelte-eXm0Kg6r.js";
import { B as se, G as I, H as ce, U as le, V as ue, W as L, z as de } from "./App-B2GhfviI.js";
import { t as R } from "./domSanitizer-B8U0JrXL.js";
import { t as fe } from "./InfoPopoverButton-6JVVo3_8.js";
// D:/ドキュメント/GitHub/ehagaki/src/lib/draftDisplayUtils.ts
function z(e) {
	return e ? R(e).trim() : "";
}
function B(e) {
	return e.length <= 16 ? e : N(e, 10, 4);
}
function V(e) {
	return e ? M(e) : "";
}
function H(e) {
	return e.authorDisplayName?.trim() || V(e.authorPubkey) || B(e.eventId);
}
function U(e) {
	let t = I(e);
	return t.name?.trim() || `ID: ${B(t.eventId)}`;
}
function W(e) {
	return "reply" in e || "quotes" in e;
}
function G(e) {
	return e ? W(e) ? e.reply ?? null : e.mode === "reply" ? e : null : null;
}
function K(e) {
	return e ? W(e) ? e.quotes : e.mode === "quote" ? [e] : [] : [];
}
function q(e, t, n) {
	let r = L(e.content, e.galleryItems, n), i = r.firstLine.trim(), a = [];
	r.hasImage && a.push(t.image), r.hasVideo && a.push(t.video);
	let o = a.join("");
	if (!i) return o;
	if (!o) return i.length > 50 ? `${i.substring(0, 50)}...` : i;
	let s = `${i} ${o}`;
	if (s.length <= 50) return s;
	let c = 50 - o.length - 4;
	return c > 0 ? `${i.substring(0, c)}... ${o}` : o;
}
function pe(e, t, n = document) {
	let r = [];
	if (e.channelData) {
		let n = I(e.channelData);
		r.push({
			kind: "channel",
			label: t.channel,
			name: U(e.channelData),
			detail: z(n.about)
		});
	}
	let i = G(e.replyQuoteData);
	i && r.push({
		kind: "reply",
		label: t.reply,
		name: H(i),
		detail: z(i.referencedEvent?.content)
	}), K(e.replyQuoteData).forEach((e) => {
		r.push({
			kind: "quote",
			label: t.quote,
			name: H(e),
			detail: z(e.referencedEvent?.content)
		});
	});
	let a = q(e, t, n);
	return {
		title: r.length > 0 ? r.map((e) => `${e.label}: ${e.name}`).join(" / ") : a || e.preview,
		bodyPreview: a,
		contexts: r
	};
}
// D:/ドキュメント/GitHub/ehagaki/src/components/DraftListDialog.svelte
var me = r("<div class=\"save-draft-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"btn-text\"> </span>", 1), he = r("<div class=\"xmark-icon svg-icon svelte-1gnpyqn\"></div>"), ge = r("<div class=\"dialog-footer-actions svelte-1gnpyqn\"><!></div> <!>", 1), _e = r("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div> <span class=\"delete-all-label\"> </span>", 1), ve = r("<div class=\"load-error svelte-1gnpyqn\"><div role=\"alert\"> </div> <!></div>"), J = r("<div class=\"empty-message svelte-1gnpyqn\"> </div>"), ye = r("<div class=\"thumbtack-icon svg-icon svelte-1gnpyqn\"></div>"), be = r("<span class=\"context-detail svelte-1gnpyqn\"> </span>"), xe = r("<span><span class=\"preview-mode-icon svg-icon svelte-1gnpyqn\"></span> <span class=\"context-name svelte-1gnpyqn\"> </span> <!></span>"), Se = r("<span class=\"draft-preview svelte-1gnpyqn\"> </span>"), Ce = r("<span class=\"draft-context-list svelte-1gnpyqn\"></span> <!>", 1), we = r("<div class=\"trash-icon svg-icon svelte-1gnpyqn\"></div>"), Te = r("<li class=\"draft-item svelte-1gnpyqn\"><!> <button type=\"button\" class=\"draft-content svelte-1gnpyqn\"><span class=\"draft-main svelte-1gnpyqn\"><!></span> <span class=\"draft-timestamp svelte-1gnpyqn\"> </span></button> <!></li>"), Ee = r("<ul class=\"draft-list svelte-1gnpyqn\"></ul>"), De = r("<div class=\"dialog-heading-container svelte-1gnpyqn\"><div class=\"dialog-heading-wrapper svelte-1gnpyqn\"><h3 class=\"dialog-heading svelte-1gnpyqn\"> </h3> <!></div> <!></div> <div class=\"draft-list-container svelte-1gnpyqn\"><!></div>", 1), Oe = r("<div> </div>"), ke = r("<!> <!>", 1), Ae = {
	hash: "svelte-1gnpyqn",
	code: ".draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,\n    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.channel-context.svelte-1gnpyqn .context-name:where(.svelte-1gnpyqn) {flex:0 1 auto;min-width:0;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.channel-context.svelte-1gnpyqn .context-detail:where(.svelte-1gnpyqn) {flex:1 1 0;}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}"
};
function je(r, d) {
	t(d, !0), e(r, Ae);
	let M = () => T(ne, "$_", N), [N, I] = S(), L = w(d, "show", 15, !1), R = w(d, "pubkeyHex", 3, null), z = k(y([])), B = k("idle"), V = k("loading"), H = k(void 0), U = k(!1), W, G = 0, K = 0, q = !1;
	function je() {
		return {
			channel: M()("channelComposer.selected_label") || "チャンネル",
			reply: M()("replyQuote.reply_label") || "リプライ",
			quote: M()("replyQuote.quote_label") || "引用",
			image: M()("draft.media.image") || "[画像]",
			video: M()("draft.media.video") || "[動画]"
		};
	}
	let Me = A(() => F.postStatus), Ne = A(() => F.isUploading), Pe = A(() => x(V) === "ready" && x(H) !== void 0 && x(H) === R()), Fe = A(() => !d.canSaveDraft || x(Me).sending || x(Ne) || x(B) !== "idle" || !x(Pe)), Y = A(() => x(B) !== "idle" || !x(Pe));
	function X() {
		L(!1), d.onClose?.();
	}
	ie(() => L(), X, !0);
	function Ie() {
		W !== void 0 && (clearTimeout(W), W = void 0);
	}
	function Le() {
		Ie(), _(U, !0), W = setTimeout(() => {
			q || (_(U, !1), W = void 0);
		}, 2e3);
	}
	async function Z(e, t = !1) {
		if (!L() || e !== R()) return;
		let n = ++G;
		_(V, "loading"), t && (_(z, [], !0), _(H, void 0));
		try {
			let t = await ce({ pubkeyHex: e });
			!q && L() && e === R() && n === G && (_(z, t, !0), _(H, e, !0), _(V, "ready"));
		} catch (t) {
			!q && L() && e === R() && n === G && (_(z, [], !0), _(H, void 0), _(V, "failed")), console.error("下書き一覧の読み込みに失敗:", t);
		}
	}
	function Re(e) {
		L() && e.pubkeyHex === R() && (Le(), Z(e.pubkeyHex));
	}
	b(() => d.subscribeToDraftSaveCompleted(Re)), D(() => {
		q = !0, G += 1, K += 1, Ie();
	}), m(() => {
		let e = R();
		L() ? (K += 1, _(B, "idle"), Z(e, !0)) : (G += 1, K += 1, _(z, [], !0), _(H, void 0), _(V, "loading"), _(B, "idle"));
	});
	function ze(e) {
		x(Y) || x(H) !== R() || (d.onApplyDraft(e), X());
	}
	async function Be() {
		if (x(Fe)) return;
		let e = R(), t = ++K;
		_(B, "saving");
		try {
			await d.onSaveDraft();
		} finally {
			!q && t === K && e === R() && _(B, "idle");
		}
	}
	async function Q(e) {
		if (x(Y) || x(H) === void 0 || x(H) !== R()) return;
		let t = x(H), n = ++K;
		_(B, "mutating-list");
		try {
			if (await e({ pubkeyHex: t }), q || n !== K || t !== R()) return;
			await Z(t);
		} catch (e) {
			console.error("下書き一覧の更新に失敗:", e);
		} finally {
			!q && n === K && t === R() && _(B, "idle");
		}
	}
	async function Ve(e) {
		await Q((t) => se(e, t));
	}
	async function He(e) {
		await Q((t) => le(e.id, !e.pinned, t));
	}
	async function Ue() {
		await Q((e) => de(e));
	}
	function We() {
		L() && x(V) === "failed" && Z(R(), !0);
	}
	var Ge = ke(), $ = h(Ge);
	{
		let e = (e) => {
			var t = ge(), n = h(t), r = O(n);
			{
				let e = A(() => M()("draft.save") || "下書き保存");
				P(r, {
					className: "save-draft-button",
					variant: "primary",
					shape: "square",
					contentLayout: "iconText",
					get ariaLabel() {
						return x(e);
					},
					get disabled() {
						return x(Fe);
					},
					onClick: Be,
					children: (e, t) => {
						var n = me(), r = C(h(n), 2), i = g(r, !0);
						E((e) => l(i, e), [() => M()("draft.save") || "下書き保存"]), u(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			a(n);
			var i = C(n, 2);
			{
				let e = (e, t) => {
					let n = () => (t?.()).props;
					{
						let t = A(() => M()("global.close") || "閉じる");
						P(e, p(n, {
							className: "modal-close",
							shape: "square",
							get ariaLabel() {
								return x(t);
							},
							children: (e, t) => {
								var n = he();
								E((e) => te(n, "aria-label", e), [() => M()("global.close") || "閉じる"]), u(e, n);
							},
							$$slots: { default: !0 }
						}));
					}
				};
				o(i, () => oe, (t, n) => {
					n(t, {
						child: e,
						$$slots: { child: !0 }
					});
				});
			}
			u(e, t);
		}, t = A(() => M()("draft.list_title") || "下書き一覧"), r = A(() => M()("draft.list_description") || "保存した下書きを選択して復元");
		ae($, {
			onOpenChange: (e) => !e && X(),
			get title() {
				return x(t);
			},
			get description() {
				return x(r);
			},
			contentClass: "draft-list-dialog",
			footerVariant: "close-button",
			initialFocus: "content",
			get open() {
				return L();
			},
			set open(e) {
				L(e);
			},
			footer: e,
			children: (e, t) => {
				var r = De(), o = h(r), c = O(o), d = O(c), p = g(d, !0), m = C(d, 2);
				{
					let e = A(() => M()("draft.info") || "下書き情報");
					fe(m, {
						side: "bottom",
						sideOffset: 8,
						get ariaLabel() {
							return x(e);
						},
						children: (e, t) => {
							v();
							var n = f();
							E((e) => l(n, e), [() => M()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"]), u(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				a(c);
				var _ = C(c, 2);
				{
					let e = A(() => M()("draft.delete_all") || "全て削除");
					P(_, {
						className: "delete-all-button",
						variant: "default",
						shape: "rounded",
						get ariaLabel() {
							return x(e);
						},
						get disabled() {
							return x(Y);
						},
						onClick: Ue,
						children: (e, t) => {
							var n = _e(), r = C(h(n), 2), i = g(r, !0);
							E((e) => l(i, e), [() => M()("draft.delete_all") || "全て削除"]), u(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				a(o);
				var y = C(o, 2), b = O(y), S = (e) => {
					var t = ve(), n = O(t), r = g(n, !0), i = C(n, 2);
					{
						let e = A(() => M()("draft.retry_load") || "再試行");
						P(i, {
							className: "retry-load-button",
							variant: "secondary",
							shape: "square",
							get ariaLabel() {
								return x(e);
							},
							onClick: We,
							children: (e, t) => {
								v();
								var n = f();
								E((e) => l(n, e), [() => M()("draft.retry_load") || "再試行"]), u(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					a(t), E((e) => l(r, e), [() => M()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), u(e, t);
				}, w = (e) => {
					var t = J(), n = g(t, !0);
					E((e) => l(n, e), [() => M()("loadingPlaceholder.loading") || "読み込み中..."]), u(e, t);
				}, T = (e) => {
					var t = J(), n = g(t, !0);
					E((e) => l(n, e), [() => M()("draft.no_drafts") || "下書きがありません"]), u(e, t);
				}, D = (e) => {
					var t = Ee();
					n(t, 21, () => x(z), (e) => e.id, (e, t) => {
						let r = A(() => pe(x(t), je(), document));
						var o = Te(), c = O(o);
						{
							let e = A(() => `pin-button ${x(t).pinned ? "pinned" : ""}`), n = A(() => x(t).pinned ? M()("draft.unpin") || "ピン留めを解除" : M()("draft.pin") || "ピン留め"), r = A(() => x(t).pinned ? "true" : "false");
							P(c, {
								get className() {
									return x(e);
								},
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return x(n);
								},
								get "aria-pressed"() {
									return x(r);
								},
								get disabled() {
									return x(Y);
								},
								onClick: () => void He(x(t)),
								children: (e, t) => {
									var n = ye();
									u(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						var d = C(c, 2), f = O(d), p = O(f), m = (e) => {
							var t = Ce(), o = h(t);
							n(o, 21, () => x(r).contexts, i, (e, t) => {
								var n = xe();
								let r;
								var i = C(O(n), 2), o = g(i, !0), c = C(i, 2), d = (e) => {
									var n = be(), r = g(n, !0);
									E(() => l(r, x(t).detail)), u(e, n);
								};
								j(c, (e) => {
									x(t).detail && e(d);
								}), a(n), E(() => {
									r = s(n, 1, "draft-context-row svelte-1gnpyqn", null, r, {
										"channel-context": x(t).kind === "channel",
										"reply-context": x(t).kind === "reply",
										"quote-context": x(t).kind === "quote"
									}), l(o, x(t).name);
								}), u(e, n);
							}), a(o);
							var c = C(o, 2), d = (e) => {
								var t = Se(), n = g(t, !0);
								E(() => l(n, x(r).bodyPreview)), u(e, t);
							};
							j(c, (e) => {
								x(r).bodyPreview && e(d);
							}), u(e, t);
						}, _ = (e) => {
							var t = Se(), n = g(t, !0);
							E(() => l(n, x(r).title)), u(e, t);
						};
						j(p, (e) => {
							x(r).contexts.length > 0 ? e(m) : e(_, -1);
						}), a(f);
						var v = C(f, 2), y = g(v, !0);
						a(d);
						var b = C(d, 2);
						{
							let e = A(() => M()("draft.delete") || "削除");
							P(b, {
								className: "delete-button",
								variant: "default",
								shape: "square",
								get ariaLabel() {
									return x(e);
								},
								get disabled() {
									return x(Y);
								},
								onClick: () => void Ve(x(t).id),
								children: (e, t) => {
									var n = we();
									u(e, n);
								},
								$$slots: { default: !0 }
							});
						}
						a(o), E((e) => {
							d.disabled = x(Y), l(y, e);
						}, [() => ue(x(t).timestamp)]), ee("click", d, () => ze(x(t))), u(e, o);
					}), a(t), u(e, t);
				};
				j(b, (e) => {
					x(V) === "failed" ? e(S) : x(V) === "loading" || x(H) !== R() ? e(w, 1) : x(V) === "ready" && x(H) === R() && x(z).length === 0 ? e(T, 2) : x(V) === "ready" && x(H) === R() && e(D, 3);
				}), a(y), E((e) => l(p, e), [() => M()("draft.title") || "下書き"]), u(e, r);
			},
			$$slots: {
				footer: !0,
				default: !0
			}
		});
	}
	var Ke = C($, 2);
	re(Ke, {
		get show() {
			return x(U);
		},
		variant: "top-right",
		children: (e, t) => {
			var n = Oe(), r = g(n, !0);
			E((e) => l(r, e), [() => M()("draft.saved") || "下書きを保存しました"]), u(e, n);
		},
		$$slots: { default: !0 }
	}), u(r, Ge), c(), I();
}
d(["click"]);
export { je as default };
