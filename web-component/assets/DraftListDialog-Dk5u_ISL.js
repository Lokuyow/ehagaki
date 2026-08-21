import { cd as Qe, ce as vt, cf as pt, cg as pe, by as Re, ch as ut, a7 as gt, a8 as G, bf as ht, aG as mt, ci as yt, bh as ee, aa as ue, aW as bt, ac as xt, cj as _t, bi as qt, bl as wt, aj as Dt, ae as kt, am as Ee, ak as $t, ck as St, al as Ie, cl as Ct, bq as Pt, ad as Lt, cm as Tt, cn as Ht } from "./App-qNXS1jWJ.js";
import { a_ as Nt, aQ as de, aJ as At, aN as Et, b as d, b0 as te, bg as je, Z as y, b1 as i, a as e, bd as x, aP as g, b2 as It, b3 as B, bh as _, b6 as o, b8 as v, aq as jt, b4 as zt, b7 as r, bf as ze, ap as Mt } from "./entry-COvMLKyo.js";
import { D as Qt, a as Rt } from "./DialogWrapper-C8w-3LAY.js";
import { I as Gt } from "./InfoPopoverButton-DWwGi-Qi.js";
function ke(t) {
  return t ? vt(t).trim() : "";
}
function $e(t) {
  return t.length <= 16 ? t : Re(t, 10, 4);
}
function Bt(t) {
  if (!t)
    return "";
  try {
    const s = ut.npubEncode(t);
    return Re(s, 12, 4);
  } catch {
    return $e(t);
  }
}
function Me(t) {
  return t.authorDisplayName?.trim() || Bt(t.authorPubkey) || $e(t.eventId);
}
function Ft(t) {
  const s = Qe(t);
  return s.name?.trim() || `ID: ${$e(s.eventId)}`;
}
function Ge(t) {
  return "reply" in t || "quotes" in t;
}
function Vt(t) {
  return t ? Ge(t) ? t.reply ?? null : t.mode === "reply" ? t : null : null;
}
function Wt(t) {
  return t ? Ge(t) ? t.quotes : t.mode === "quote" ? [t] : [] : [];
}
function Ot(t, s, n) {
  const D = pt(
    t.content,
    t.galleryItems,
    n
  ), k = D.firstLine.trim(), c = [];
  D.hasImage && c.push(s.image), D.hasVideo && c.push(s.video);
  const C = c.join("");
  if (!k)
    return C;
  if (!C)
    return k.length > pe ? `${k.substring(0, pe)}...` : k;
  const b = `${k} ${C}`;
  if (b.length <= pe)
    return b;
  const F = pe - C.length - 4;
  return F > 0 ? `${k.substring(0, F)}... ${C}` : C;
}
function Ut(t, s, n = document) {
  const D = [];
  if (t.channelData) {
    const b = Qe(t.channelData);
    D.push({
      kind: "channel",
      label: s.channel,
      name: Ft(t.channelData),
      detail: ke(b.about)
    });
  }
  const k = Vt(t.replyQuoteData);
  k && D.push({
    kind: "reply",
    label: s.reply,
    name: Me(k),
    detail: ke(k.referencedEvent?.content)
  }), Wt(t.replyQuoteData).forEach((b) => {
    D.push({
      kind: "quote",
      label: s.quote,
      name: Me(b),
      detail: ke(b.referencedEvent?.content)
    });
  });
  const c = Ot(t, s, n);
  return {
    title: D.length > 0 ? D.map((b) => `${b.label}: ${b.name}`).join(" / ") : c || t.preview,
    bodyPreview: c,
    contexts: D
  };
}
var Jt = v('<div class="save-draft-icon svg-icon svelte-1gnpyqn"></div> <span class="btn-text"> </span>', 1), Zt = v('<div class="xmark-icon svg-icon svelte-1gnpyqn"></div>'), Kt = v('<div class="dialog-footer-actions svelte-1gnpyqn"><!></div> <!>', 1), Xt = v('<div class="trash-icon svg-icon svelte-1gnpyqn"></div> <span class="delete-all-label"> </span>', 1), Yt = v('<div class="load-error svelte-1gnpyqn"><div role="alert"> </div> <!></div>'), ea = v('<div class="empty-message svelte-1gnpyqn"> </div>'), ta = v('<div class="empty-message svelte-1gnpyqn"> </div>'), aa = v('<div class="thumbtack-icon svg-icon svelte-1gnpyqn"></div>'), na = v('<span class="context-detail svelte-1gnpyqn"> </span>'), ra = v('<span><span class="preview-mode-icon svg-icon svelte-1gnpyqn"></span> <span class="context-name svelte-1gnpyqn"> </span> <!></span>'), sa = v('<span class="draft-preview svelte-1gnpyqn"> </span>'), ia = v('<span class="draft-context-list svelte-1gnpyqn"></span> <!>', 1), oa = v('<span class="draft-preview svelte-1gnpyqn"> </span>'), la = v('<div class="trash-icon svg-icon svelte-1gnpyqn"></div>'), da = v('<li class="draft-item svelte-1gnpyqn"><!> <button type="button" class="draft-content svelte-1gnpyqn"><span class="draft-main svelte-1gnpyqn"><!></span> <span class="draft-timestamp svelte-1gnpyqn"> </span></button> <!></li>'), ca = v('<ul class="draft-list svelte-1gnpyqn"></ul>'), fa = v('<div class="dialog-heading-container svelte-1gnpyqn"><div class="dialog-heading-wrapper svelte-1gnpyqn"><h3 class="dialog-heading svelte-1gnpyqn"> </h3> <!></div> <!></div> <div class="draft-list-container svelte-1gnpyqn"><!></div>', 1), va = v("<div> </div>"), pa = v("<!> <!>", 1);
const ua = {
  hash: "svelte-1gnpyqn",
  code: `.draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,\r
    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function ga(t, s) {
  Nt(s, !0), gt(t, ua);
  const n = () => Dt($t, "$_", D), [D, k] = xt();
  let c = G(s, "show", 15, !1), C = G(s, "onClose", 7), b = G(s, "onApplyDraft", 7), F = G(s, "onSaveDraft", 7), ge = G(s, "subscribeToDraftSaveCompleted", 7), he = G(s, "canSaveDraft", 7), p = G(s, "pubkeyHex", 7, null), V = de(At([])), A = de("idle"), L = de("loading"), q = de(void 0), me = de(!1), ae, ne = 0, E = 0, j = !1;
  function Be() {
    return {
      channel: n()("channelComposer.selected_label") || "チャンネル",
      reply: n()("replyQuote.reply_label") || "リプライ",
      quote: n()("replyQuote.quote_label") || "引用",
      image: n()("draft.media.image") || "[画像]",
      video: n()("draft.media.video") || "[動画]"
    };
  }
  let Fe = g(() => Ee.postStatus), Ve = g(() => Ee.isUploading), Se = g(() => e(L) === "ready" && e(q) !== void 0 && e(q) === p()), Ce = g(() => !he() || e(Fe).sending || e(Ve) || e(A) !== "idle" || !e(Se)), W = g(() => e(A) !== "idle" || !e(Se));
  function ye() {
    c(!1), C()?.();
  }
  ht(() => c(), ye, !0);
  function Pe() {
    ae !== void 0 && (clearTimeout(ae), ae = void 0);
  }
  function We() {
    Pe(), d(me, !0), ae = setTimeout(
      () => {
        j || (d(me, !1), ae = void 0);
      },
      2e3
    );
  }
  async function ce(a, h = !1) {
    if (!c() || a !== p()) return;
    const P = ++ne;
    d(L, "loading"), h && (d(V, [], !0), d(q, void 0));
    try {
      const m = await _t({ pubkeyHex: a });
      !j && c() && a === p() && P === ne && (d(V, m, !0), d(q, a, !0), d(L, "ready"));
    } catch (m) {
      !j && c() && a === p() && P === ne && (d(V, [], !0), d(q, void 0), d(L, "failed")), console.error("下書き一覧の読み込みに失敗:", m);
    }
  }
  function Oe(a) {
    !c() || a.pubkeyHex !== p() || (We(), ce(a.pubkeyHex));
  }
  mt(() => ge()(Oe)), yt(() => {
    j = !0, ne += 1, E += 1, Pe();
  }), Et(() => {
    const a = p();
    if (!c()) {
      ne += 1, E += 1, d(V, [], !0), d(q, void 0), d(L, "loading"), d(A, "idle");
      return;
    }
    E += 1, d(A, "idle"), ce(a, !0);
  });
  function Ue(a) {
    e(W) || e(q) !== p() || (b()(a), ye());
  }
  async function Je() {
    if (e(Ce)) return;
    const a = p(), h = ++E;
    d(A, "saving");
    try {
      await F()();
    } finally {
      !j && h === E && a === p() && d(A, "idle");
    }
  }
  async function be(a) {
    if (e(W) || e(q) === void 0 || e(q) !== p()) return;
    const h = e(q), P = ++E;
    d(A, "mutating-list");
    try {
      if (await a({ pubkeyHex: h }), j || P !== E || h !== p()) return;
      await ce(h);
    } catch (m) {
      console.error("下書き一覧の更新に失敗:", m);
    } finally {
      !j && P === E && h === p() && d(A, "idle");
    }
  }
  async function Ze(a) {
    await be((h) => Ht(a, h));
  }
  async function Ke(a) {
    await be((h) => Tt(a.id, !a.pinned, h));
  }
  async function Xe() {
    await be((a) => St(a));
  }
  function Ye() {
    !c() || e(L) !== "failed" || ce(p(), !0);
  }
  var et = {
    get show() {
      return c();
    },
    set show(a = !1) {
      c(a), B();
    },
    get onClose() {
      return C();
    },
    set onClose(a) {
      C(a), B();
    },
    get onApplyDraft() {
      return b();
    },
    set onApplyDraft(a) {
      b(a), B();
    },
    get onSaveDraft() {
      return F();
    },
    set onSaveDraft(a) {
      F(a), B();
    },
    get subscribeToDraftSaveCompleted() {
      return ge();
    },
    set subscribeToDraftSaveCompleted(a) {
      ge(a), B();
    },
    get canSaveDraft() {
      return he();
    },
    set canSaveDraft(a) {
      he(a), B();
    },
    get pubkeyHex() {
      return p();
    },
    set pubkeyHex(a = null) {
      p(a), B();
    }
  }, Le = pa(), Te = te(Le);
  {
    const a = (m) => {
      var re = Kt(), O = te(re), se = o(O);
      {
        let z = g(() => n()("draft.save") || "下書き保存");
        ee(se, {
          className: "save-draft-button",
          variant: "primary",
          shape: "square",
          contentLayout: "iconText",
          get ariaLabel() {
            return e(z);
          },
          get disabled() {
            return e(Ce);
          },
          onClick: Je,
          children: (M, U) => {
            var J = Jt(), Q = x(te(J), 2), oe = o(Q, !0);
            r(Q), y((fe) => _(oe, fe), [() => n()("draft.save") || "下書き保存"]), i(M, J);
          },
          $$slots: { default: !0 }
        });
      }
      r(O);
      var ie = x(O, 2);
      {
        const z = (M, U) => {
          let J = () => U?.().props;
          {
            let Q = g(() => n()("global.close") || "閉じる");
            ee(M, wt(J, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(Q);
              },
              children: (oe, fe) => {
                var ve = Zt();
                y((xe) => kt(ve, "aria-label", xe), [() => n()("global.close") || "閉じる"]), i(oe, ve);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        qt(ie, () => Rt, (M, U) => {
          U(M, { child: z, $$slots: { child: !0 } });
        });
      }
      i(m, re);
    };
    let h = g(() => n()("draft.list_title") || "下書き一覧"), P = g(() => n()("draft.list_description") || "保存した下書きを選択して復元");
    Qt(Te, {
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
        var O = fa(), se = te(O), ie = o(se), z = o(ie), M = o(z, !0);
        r(z);
        var U = x(z, 2);
        {
          let u = g(() => n()("draft.info") || "下書き情報");
          Gt(U, {
            side: "bottom",
            sideOffset: 8,
            get ariaLabel() {
              return e(u);
            },
            children: (f, w) => {
              ze();
              var l = je();
              y(($) => _(l, $), [
                () => n()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"
              ]), i(f, l);
            },
            $$slots: { default: !0 }
          });
        }
        r(ie);
        var J = x(ie, 2);
        {
          let u = g(() => n()("draft.delete_all") || "全て削除");
          ee(J, {
            className: "delete-all-button",
            variant: "default",
            shape: "rounded",
            get ariaLabel() {
              return e(u);
            },
            get disabled() {
              return e(W);
            },
            onClick: Xe,
            children: (f, w) => {
              var l = Xt(), $ = x(te(l), 2), N = o($, !0);
              r($), y((Z) => _(N, Z), [() => n()("draft.delete_all") || "全て削除"]), i(f, l);
            },
            $$slots: { default: !0 }
          });
        }
        r(se);
        var Q = x(se, 2), oe = o(Q);
        {
          var fe = (u) => {
            var f = Yt(), w = o(f), l = o(w, !0);
            r(w);
            var $ = x(w, 2);
            {
              let N = g(() => n()("draft.retry_load") || "再試行");
              ee($, {
                className: "retry-load-button",
                variant: "secondary",
                shape: "square",
                get ariaLabel() {
                  return e(N);
                },
                onClick: Ye,
                children: (Z, K) => {
                  ze();
                  var X = je();
                  y((_e) => _(X, _e), [() => n()("draft.retry_load") || "再試行"]), i(Z, X);
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
            Ie(f, 21, () => e(V), (w) => w.id, (w, l) => {
              const $ = g(() => Ut(e(l), Be(), document));
              var N = da(), Z = o(N);
              {
                let S = g(() => `pin-button ${e(l).pinned ? "pinned" : ""}`), T = g(() => e(l).pinned ? n()("draft.unpin") || "ピン留めを解除" : n()("draft.pin") || "ピン留め"), I = g(() => e(l).pinned ? "true" : "false");
                ee(Z, {
                  get className() {
                    return e(S);
                  },
                  variant: "default",
                  shape: "square",
                  get ariaLabel() {
                    return e(T);
                  },
                  get "aria-pressed"() {
                    return e(I);
                  },
                  get disabled() {
                    return e(W);
                  },
                  onClick: () => void Ke(e(l)),
                  children: (le, Ne) => {
                    var R = aa();
                    i(le, R);
                  },
                  $$slots: { default: !0 }
                });
              }
              var K = x(Z, 2), X = o(K), _e = o(X);
              {
                var rt = (S) => {
                  var T = ia(), I = te(T);
                  Ie(I, 21, () => e($).contexts, Pt, (R, H) => {
                    var Y = ra();
                    let Ae;
                    var qe = x(o(Y), 2), lt = o(qe, !0);
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
                    r(Y), y(() => {
                      Ae = Lt(Y, 1, "draft-context-row svelte-1gnpyqn", null, Ae, {
                        "channel-context": e(H).kind === "channel",
                        "reply-context": e(H).kind === "reply",
                        "quote-context": e(H).kind === "quote"
                      }), _(lt, e(H).name);
                    }), i(R, Y);
                  }), r(I);
                  var le = x(I, 2);
                  {
                    var Ne = (R) => {
                      var H = sa(), Y = o(H, !0);
                      r(H), y(() => _(Y, e($).bodyPreview)), i(R, H);
                    };
                    ue(le, (R) => {
                      e($).bodyPreview && R(Ne);
                    });
                  }
                  i(S, T);
                }, st = (S) => {
                  var T = oa(), I = o(T, !0);
                  r(T), y(() => _(I, e($).title)), i(S, T);
                };
                ue(_e, (S) => {
                  e($).contexts.length > 0 ? S(rt) : S(st, -1);
                });
              }
              r(X);
              var He = x(X, 2), it = o(He, !0);
              r(He), r(K);
              var ot = x(K, 2);
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
                    return e(W);
                  },
                  onClick: () => void Ze(e(l).id),
                  children: (T, I) => {
                    var le = la();
                    i(T, le);
                  },
                  $$slots: { default: !0 }
                });
              }
              r(N), y(
                (S) => {
                  K.disabled = e(W), _(it, S);
                },
                [() => Ct(e(l).timestamp)]
              ), Mt("click", K, () => Ue(e(l))), i(w, N);
            }), r(f), i(u, f);
          };
          ue(oe, (u) => {
            e(L) === "failed" ? u(fe) : e(L) === "loading" || e(q) !== p() ? u(ve, 1) : e(L) === "ready" && e(q) === p() && e(V).length === 0 ? u(xe, 2) : e(L) === "ready" && e(q) === p() && u(nt, 3);
          });
        }
        r(Q), y((u) => _(M, u), [() => n()("draft.title") || "下書き"]), i(m, O);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var tt = x(Te, 2);
  bt(tt, {
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
  var at = It(et);
  return k(), at;
}
jt(["click"]);
zt(
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
