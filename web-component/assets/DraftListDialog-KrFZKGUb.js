import { bP as ze, bQ as vt, bR as pt, bS as pe, bc as Re, H as ut, I as V, aY as gt, ai as ht, bT as mt, aA as ee, K as ue, aC as yt, Q as bt, bU as xt, a_ as _t, b1 as qt, V as wt, N as Dt, X as Ie, $ as $t, bV as kt, W as Ee, bW as St, b5 as Ct, M as Pt, bX as Lt, bY as Tt } from "./App-CGgJsLME.js";
import { aO as Ht, b0 as Nt, aS as de, aJ as At, aN as It, b as d, b2 as te, bh as Me, Z as y, b3 as i, a as e, bf as x, aR as g, b4 as Et, b5 as W, bi as _, b8 as o, ba as v, ap as Mt, aq as Qt, b6 as jt, b9 as r, bj as Qe } from "./entry-B5mUKSYb.js";
import { D as zt, a as Rt } from "./DialogWrapper-2ZPf0OiI.js";
import { I as Vt } from "./InfoPopoverButton-BGUySEUm.js";
function $e(t) {
  return t ? vt(t).trim() : "";
}
function ke(t) {
  return t.length <= 16 ? t : Re(t, 10, 4);
}
function Wt(t) {
  if (!t)
    return "";
  try {
    const s = Ht.npubEncode(t);
    return Re(s, 12, 4);
  } catch {
    return ke(t);
  }
}
function je(t) {
  return t.authorDisplayName?.trim() || Wt(t.authorPubkey) || ke(t.eventId);
}
function Bt(t) {
  const s = ze(t);
  return s.name?.trim() || `ID: ${ke(s.eventId)}`;
}
function Ve(t) {
  return "reply" in t || "quotes" in t;
}
function Ft(t) {
  return t ? Ve(t) ? t.reply ?? null : t.mode === "reply" ? t : null : null;
}
function Gt(t) {
  return t ? Ve(t) ? t.quotes : t.mode === "quote" ? [t] : [] : [];
}
function Ot(t, s, n) {
  const D = pt(
    t.content,
    t.galleryItems,
    n
  ), $ = D.firstLine.trim(), c = [];
  D.hasImage && c.push(s.image), D.hasVideo && c.push(s.video);
  const C = c.join("");
  if (!$)
    return C;
  if (!C)
    return $.length > pe ? `${$.substring(0, pe)}...` : $;
  const b = `${$} ${C}`;
  if (b.length <= pe)
    return b;
  const B = pe - C.length - 4;
  return B > 0 ? `${$.substring(0, B)}... ${C}` : C;
}
function Ut(t, s, n = document) {
  const D = [];
  if (t.channelData) {
    const b = ze(t.channelData);
    D.push({
      kind: "channel",
      label: s.channel,
      name: Bt(t.channelData),
      detail: $e(b.about)
    });
  }
  const $ = Ft(t.replyQuoteData);
  $ && D.push({
    kind: "reply",
    label: s.reply,
    name: je($),
    detail: $e($.referencedEvent?.content)
  }), Gt(t.replyQuoteData).forEach((b) => {
    D.push({
      kind: "quote",
      label: s.quote,
      name: je(b),
      detail: $e(b.referencedEvent?.content)
    });
  });
  const c = Ot(t, s, n);
  return {
    title: D.length > 0 ? D.map((b) => `${b.label}: ${b.name}`).join(" / ") : c || t.preview,
    bodyPreview: c,
    contexts: D
  };
}
var Xt = v('<div class="save-draft-icon svg-icon svelte-1gnpyqn"></div> <span class="btn-text"> </span>', 1), Yt = v('<div class="xmark-icon svg-icon svelte-1gnpyqn"></div>'), Jt = v('<div class="dialog-footer-actions svelte-1gnpyqn"><!></div> <!>', 1), Kt = v('<div class="trash-icon svg-icon svelte-1gnpyqn"></div> <span class="delete-all-label"> </span>', 1), Zt = v('<div class="load-error svelte-1gnpyqn"><div role="alert"> </div> <!></div>'), ea = v('<div class="empty-message svelte-1gnpyqn"> </div>'), ta = v('<div class="empty-message svelte-1gnpyqn"> </div>'), aa = v('<div class="thumbtack-icon svg-icon svelte-1gnpyqn"></div>'), na = v('<span class="context-detail svelte-1gnpyqn"> </span>'), ra = v('<span><span class="preview-mode-icon svg-icon svelte-1gnpyqn"></span> <span class="context-name svelte-1gnpyqn"> </span> <!></span>'), sa = v('<span class="draft-preview svelte-1gnpyqn"> </span>'), ia = v('<span class="draft-context-list svelte-1gnpyqn"></span> <!>', 1), oa = v('<span class="draft-preview svelte-1gnpyqn"> </span>'), la = v('<div class="trash-icon svg-icon svelte-1gnpyqn"></div>'), da = v('<li class="draft-item svelte-1gnpyqn"><!> <button type="button" class="draft-content svelte-1gnpyqn"><span class="draft-main svelte-1gnpyqn"><!></span> <span class="draft-timestamp svelte-1gnpyqn"> </span></button> <!></li>'), ca = v('<ul class="draft-list svelte-1gnpyqn"></ul>'), fa = v('<div class="dialog-heading-container svelte-1gnpyqn"><div class="dialog-heading-wrapper svelte-1gnpyqn"><h3 class="dialog-heading svelte-1gnpyqn"> </h3> <!></div> <!></div> <div class="draft-list-container svelte-1gnpyqn"><!></div>', 1), va = v("<div> </div>"), pa = v("<!> <!>", 1);
const ua = {
  hash: "svelte-1gnpyqn",
  code: `.draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,
    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.channel-context.svelte-1gnpyqn .context-name:where(.svelte-1gnpyqn) {flex:0 1 auto;min-width:0;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.channel-context.svelte-1gnpyqn .context-detail:where(.svelte-1gnpyqn) {flex:1 1 0;}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function ga(t, s) {
  Nt(s, !0), ut(t, ua);
  const n = () => wt($t, "$_", D), [D, $] = bt();
  let c = V(s, "show", 15, !1), C = V(s, "onClose", 7), b = V(s, "onApplyDraft", 7), B = V(s, "onSaveDraft", 7), ge = V(s, "subscribeToDraftSaveCompleted", 7), he = V(s, "canSaveDraft", 7), p = V(s, "pubkeyHex", 7, null), F = de(At([])), A = de("idle"), L = de("loading"), q = de(void 0), me = de(!1), ae, ne = 0, I = 0, M = !1;
  function We() {
    return {
      channel: n()("channelComposer.selected_label") || "チャンネル",
      reply: n()("replyQuote.reply_label") || "リプライ",
      quote: n()("replyQuote.quote_label") || "引用",
      image: n()("draft.media.image") || "[画像]",
      video: n()("draft.media.video") || "[動画]"
    };
  }
  let Be = g(() => Ie.postStatus), Fe = g(() => Ie.isUploading), Se = g(() => e(L) === "ready" && e(q) !== void 0 && e(q) === p()), Ce = g(() => !he() || e(Be).sending || e(Fe) || e(A) !== "idle" || !e(Se)), G = g(() => e(A) !== "idle" || !e(Se));
  function ye() {
    c(!1), C()?.();
  }
  gt(() => c(), ye, !0);
  function Pe() {
    ae !== void 0 && (clearTimeout(ae), ae = void 0);
  }
  function Ge() {
    Pe(), d(me, !0), ae = setTimeout(
      () => {
        M || (d(me, !1), ae = void 0);
      },
      2e3
    );
  }
  async function ce(a, h = !1) {
    if (!c() || a !== p()) return;
    const P = ++ne;
    d(L, "loading"), h && (d(F, [], !0), d(q, void 0));
    try {
      const m = await xt({ pubkeyHex: a });
      !M && c() && a === p() && P === ne && (d(F, m, !0), d(q, a, !0), d(L, "ready"));
    } catch (m) {
      !M && c() && a === p() && P === ne && (d(F, [], !0), d(q, void 0), d(L, "failed")), console.error("下書き一覧の読み込みに失敗:", m);
    }
  }
  function Oe(a) {
    !c() || a.pubkeyHex !== p() || (Ge(), ce(a.pubkeyHex));
  }
  ht(() => ge()(Oe)), mt(() => {
    M = !0, ne += 1, I += 1, Pe();
  }), It(() => {
    const a = p();
    if (!c()) {
      ne += 1, I += 1, d(F, [], !0), d(q, void 0), d(L, "loading"), d(A, "idle");
      return;
    }
    I += 1, d(A, "idle"), ce(a, !0);
  });
  function Ue(a) {
    e(G) || e(q) !== p() || (b()(a), ye());
  }
  async function Xe() {
    if (e(Ce)) return;
    const a = p(), h = ++I;
    d(A, "saving");
    try {
      await B()();
    } finally {
      !M && h === I && a === p() && d(A, "idle");
    }
  }
  async function be(a) {
    if (e(G) || e(q) === void 0 || e(q) !== p()) return;
    const h = e(q), P = ++I;
    d(A, "mutating-list");
    try {
      if (await a({ pubkeyHex: h }), M || P !== I || h !== p()) return;
      await ce(h);
    } catch (m) {
      console.error("下書き一覧の更新に失敗:", m);
    } finally {
      !M && P === I && h === p() && d(A, "idle");
    }
  }
  async function Ye(a) {
    await be((h) => Tt(a, h));
  }
  async function Je(a) {
    await be((h) => Lt(a.id, !a.pinned, h));
  }
  async function Ke() {
    await be((a) => kt(a));
  }
  function Ze() {
    !c() || e(L) !== "failed" || ce(p(), !0);
  }
  var et = {
    get show() {
      return c();
    },
    set show(a = !1) {
      c(a), W();
    },
    get onClose() {
      return C();
    },
    set onClose(a) {
      C(a), W();
    },
    get onApplyDraft() {
      return b();
    },
    set onApplyDraft(a) {
      b(a), W();
    },
    get onSaveDraft() {
      return B();
    },
    set onSaveDraft(a) {
      B(a), W();
    },
    get subscribeToDraftSaveCompleted() {
      return ge();
    },
    set subscribeToDraftSaveCompleted(a) {
      ge(a), W();
    },
    get canSaveDraft() {
      return he();
    },
    set canSaveDraft(a) {
      he(a), W();
    },
    get pubkeyHex() {
      return p();
    },
    set pubkeyHex(a = null) {
      p(a), W();
    }
  }, Le = pa(), Te = te(Le);
  {
    const a = (m) => {
      var re = Jt(), O = te(re), se = o(O);
      {
        let Q = g(() => n()("draft.save") || "下書き保存");
        ee(se, {
          className: "save-draft-button",
          variant: "primary",
          shape: "square",
          contentLayout: "iconText",
          get ariaLabel() {
            return e(Q);
          },
          get disabled() {
            return e(Ce);
          },
          onClick: Xe,
          children: (j, U) => {
            var X = Xt(), z = x(te(X), 2), oe = o(z, !0);
            r(z), y((fe) => _(oe, fe), [() => n()("draft.save") || "下書き保存"]), i(j, X);
          },
          $$slots: { default: !0 }
        });
      }
      r(O);
      var ie = x(O, 2);
      {
        const Q = (j, U) => {
          let X = () => U?.().props;
          {
            let z = g(() => n()("global.close") || "閉じる");
            ee(j, qt(X, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(z);
              },
              children: (oe, fe) => {
                var ve = Yt();
                y((xe) => Dt(ve, "aria-label", xe), [() => n()("global.close") || "閉じる"]), i(oe, ve);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        _t(ie, () => Rt, (j, U) => {
          U(j, { child: Q, $$slots: { child: !0 } });
        });
      }
      i(m, re);
    };
    let h = g(() => n()("draft.list_title") || "下書き一覧"), P = g(() => n()("draft.list_description") || "保存した下書きを選択して復元");
    zt(Te, {
      onOpenChange: (m) => !m && ye(),
      get title() {
        return e(h);
      },
      get description() {
        return e(P);
      },
      contentClass: "draft-list-dialog",
      footerVariant: "close-button",
      initialFocus: "content",
      get open() {
        return c();
      },
      set open(m) {
        c(m);
      },
      footer: a,
      children: (m, re) => {
        var O = fa(), se = te(O), ie = o(se), Q = o(ie), j = o(Q, !0);
        r(Q);
        var U = x(Q, 2);
        {
          let u = g(() => n()("draft.info") || "下書き情報");
          Vt(U, {
            side: "bottom",
            sideOffset: 8,
            get ariaLabel() {
              return e(u);
            },
            children: (f, w) => {
              Qe();
              var l = Me();
              y((k) => _(l, k), [
                () => n()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"
              ]), i(f, l);
            },
            $$slots: { default: !0 }
          });
        }
        r(ie);
        var X = x(ie, 2);
        {
          let u = g(() => n()("draft.delete_all") || "全て削除");
          ee(X, {
            className: "delete-all-button",
            variant: "default",
            shape: "rounded",
            get ariaLabel() {
              return e(u);
            },
            get disabled() {
              return e(G);
            },
            onClick: Ke,
            children: (f, w) => {
              var l = Kt(), k = x(te(l), 2), N = o(k, !0);
              r(k), y((Y) => _(N, Y), [() => n()("draft.delete_all") || "全て削除"]), i(f, l);
            },
            $$slots: { default: !0 }
          });
        }
        r(se);
        var z = x(se, 2), oe = o(z);
        {
          var fe = (u) => {
            var f = Zt(), w = o(f), l = o(w, !0);
            r(w);
            var k = x(w, 2);
            {
              let N = g(() => n()("draft.retry_load") || "再試行");
              ee(k, {
                className: "retry-load-button",
                variant: "secondary",
                shape: "square",
                get ariaLabel() {
                  return e(N);
                },
                onClick: Ze,
                children: (Y, J) => {
                  Qe();
                  var K = Me();
                  y((_e) => _(K, _e), [() => n()("draft.retry_load") || "再試行"]), i(Y, K);
                },
                $$slots: { default: !0 }
              });
            }
            r(f), y((N) => _(l, N), [() => n()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), i(u, f);
          }, ve = (u) => {
            var f = ea(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("loadingPlaceholder.loading") || "読み込み中..."]), i(u, f);
          }, xe = (u) => {
            var f = ta(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("draft.no_drafts") || "下書きがありません"]), i(u, f);
          }, nt = (u) => {
            var f = ca();
            Ee(f, 21, () => e(F), (w) => w.id, (w, l) => {
              const k = g(() => Ut(e(l), We(), document));
              var N = da(), Y = o(N);
              {
                let S = g(() => `pin-button ${e(l).pinned ? "pinned" : ""}`), T = g(() => e(l).pinned ? n()("draft.unpin") || "ピン留めを解除" : n()("draft.pin") || "ピン留め"), E = g(() => e(l).pinned ? "true" : "false");
                ee(Y, {
                  get className() {
                    return e(S);
                  },
                  variant: "default",
                  shape: "square",
                  get ariaLabel() {
                    return e(T);
                  },
                  get "aria-pressed"() {
                    return e(E);
                  },
                  get disabled() {
                    return e(G);
                  },
                  onClick: () => void Je(e(l)),
                  children: (le, Ne) => {
                    var R = aa();
                    i(le, R);
                  },
                  $$slots: { default: !0 }
                });
              }
              var J = x(Y, 2), K = o(J), _e = o(K);
              {
                var rt = (S) => {
                  var T = ia(), E = te(T);
                  Ee(E, 21, () => e(k).contexts, Ct, (R, H) => {
                    var Z = ra();
                    let Ae;
                    var qe = x(o(Z), 2), lt = o(qe, !0);
                    r(qe);
                    var dt = x(qe, 2);
                    {
                      var ct = (we) => {
                        var De = na(), ft = o(De, !0);
                        r(De), y(() => _(ft, e(H).detail)), i(we, De);
                      };
                      ue(dt, (we) => {
                        e(H).detail && we(ct);
                      });
                    }
                    r(Z), y(() => {
                      Ae = Pt(Z, 1, "draft-context-row svelte-1gnpyqn", null, Ae, {
                        "channel-context": e(H).kind === "channel",
                        "reply-context": e(H).kind === "reply",
                        "quote-context": e(H).kind === "quote"
                      }), _(lt, e(H).name);
                    }), i(R, Z);
                  }), r(E);
                  var le = x(E, 2);
                  {
                    var Ne = (R) => {
                      var H = sa(), Z = o(H, !0);
                      r(H), y(() => _(Z, e(k).bodyPreview)), i(R, H);
                    };
                    ue(le, (R) => {
                      e(k).bodyPreview && R(Ne);
                    });
                  }
                  i(S, T);
                }, st = (S) => {
                  var T = oa(), E = o(T, !0);
                  r(T), y(() => _(E, e(k).title)), i(S, T);
                };
                ue(_e, (S) => {
                  e(k).contexts.length > 0 ? S(rt) : S(st, -1);
                });
              }
              r(K);
              var He = x(K, 2), it = o(He, !0);
              r(He), r(J);
              var ot = x(J, 2);
              {
                let S = g(() => n()("draft.delete") || "削除");
                ee(ot, {
                  className: "delete-button",
                  variant: "default",
                  shape: "square",
                  get ariaLabel() {
                    return e(S);
                  },
                  get disabled() {
                    return e(G);
                  },
                  onClick: () => void Ye(e(l).id),
                  children: (T, E) => {
                    var le = la();
                    i(T, le);
                  },
                  $$slots: { default: !0 }
                });
              }
              r(N), y(
                (S) => {
                  J.disabled = e(G), _(it, S);
                },
                [() => St(e(l).timestamp)]
              ), Mt("click", J, () => Ue(e(l))), i(w, N);
            }), r(f), i(u, f);
          };
          ue(oe, (u) => {
            e(L) === "failed" ? u(fe) : e(L) === "loading" || e(q) !== p() ? u(ve, 1) : e(L) === "ready" && e(q) === p() && e(F).length === 0 ? u(xe, 2) : e(L) === "ready" && e(q) === p() && u(nt, 3);
          });
        }
        r(z), y((u) => _(j, u), [() => n()("draft.title") || "下書き"]), i(m, O);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var tt = x(Te, 2);
  yt(tt, {
    get show() {
      return e(me);
    },
    variant: "top-right",
    children: (a, h) => {
      var P = va(), m = o(P, !0);
      r(P), y((re) => _(m, re), [() => n()("draft.saved") || "下書きを保存しました"]), i(a, P);
    },
    $$slots: { default: !0 }
  }), i(t, Le);
  var at = Et(et);
  return $(), at;
}
Qt(["click"]);
jt(
  ga,
  {
    show: {},
    onClose: {},
    onApplyDraft: {},
    onSaveDraft: {},
    subscribeToDraftSaveCompleted: {},
    canSaveDraft: {},
    pubkeyHex: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  ga as default
};
