import { cb as Qe, cc as pt, cd as vt, ce as ve, bA as Re, cf as ut, a7 as gt, a8 as G, bj as ht, aG as mt, cg as yt, bl as ee, aa as ue, aZ as bt, ac as xt, ch as _t, bm as qt, bp as wt, aj as Dt, ae as kt, am as je, ak as $t, ci as St, al as Ee, cj as Ct, bu as Pt, ad as Lt, ck as Tt, cl as At } from "./App-1qWol-Cs.js";
import { a_ as Ht, aQ as de, aJ as Nt, aN as jt, b as d, b0 as te, bg as Ie, Z as y, b1 as i, a as e, bd as x, aP as g, b2 as Et, b3 as B, bh as _, b6 as o, b8 as p, aq as It, b4 as zt, b7 as r, bf as ze, ap as Mt } from "./entry-De5pG27L.js";
import { D as Qt, a as Rt } from "./DialogWrapper-DhZEVMtT.js";
import { I as Gt } from "./InfoPopoverButton-BgGPXuZK.js";
function ke(t) {
  return t ? pt(t).trim() : "";
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
function Ot(t) {
  return t ? Ge(t) ? t.quotes : t.mode === "quote" ? [t] : [] : [];
}
function Ut(t, s, n) {
  const D = vt(
    t.content,
    t.galleryItems,
    n
  ), k = D.firstLine.trim(), c = [];
  D.hasImage && c.push(s.image), D.hasVideo && c.push(s.video);
  const C = c.join("");
  if (!k)
    return C;
  if (!C)
    return k.length > ve ? `${k.substring(0, ve)}...` : k;
  const b = `${k} ${C}`;
  if (b.length <= ve)
    return b;
  const F = ve - C.length - 4;
  return F > 0 ? `${k.substring(0, F)}... ${C}` : C;
}
function Wt(t, s, n = document) {
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
  }), Ot(t.replyQuoteData).forEach((b) => {
    D.push({
      kind: "quote",
      label: s.quote,
      name: Me(b),
      detail: ke(b.referencedEvent?.content)
    });
  });
  const c = Ut(t, s, n);
  return {
    title: D.length > 0 ? D.map((b) => `${b.label}: ${b.name}`).join(" / ") : c || t.preview,
    bodyPreview: c,
    contexts: D
  };
}
var Zt = p('<div class="save-draft-icon svg-icon svelte-1gnpyqn"></div> <span class="btn-text"> </span>', 1), Jt = p('<div class="xmark-icon svg-icon svelte-1gnpyqn"></div>'), Kt = p('<div class="dialog-footer-actions svelte-1gnpyqn"><!></div> <!>', 1), Xt = p('<div class="trash-icon svg-icon svelte-1gnpyqn"></div> <span class="delete-all-label"> </span>', 1), Yt = p('<div class="load-error svelte-1gnpyqn"><div role="alert"> </div> <!></div>'), ea = p('<div class="empty-message svelte-1gnpyqn"> </div>'), ta = p('<div class="empty-message svelte-1gnpyqn"> </div>'), aa = p('<div class="thumbtack-icon svg-icon svelte-1gnpyqn"></div>'), na = p('<span class="context-detail svelte-1gnpyqn"> </span>'), ra = p('<span><span class="preview-mode-icon svg-icon svelte-1gnpyqn"></span> <span class="context-name svelte-1gnpyqn"> </span> <!></span>'), sa = p('<span class="draft-preview svelte-1gnpyqn"> </span>'), ia = p('<span class="draft-context-list svelte-1gnpyqn"></span> <!>', 1), oa = p('<span class="draft-preview svelte-1gnpyqn"> </span>'), la = p('<div class="trash-icon svg-icon svelte-1gnpyqn"></div>'), da = p('<li class="draft-item svelte-1gnpyqn"><!> <button type="button" class="draft-content svelte-1gnpyqn"><span class="draft-main svelte-1gnpyqn"><!></span> <span class="draft-timestamp svelte-1gnpyqn"> </span></button> <!></li>'), ca = p('<ul class="draft-list svelte-1gnpyqn"></ul>'), fa = p('<div class="dialog-heading-container svelte-1gnpyqn"><div class="dialog-heading-wrapper svelte-1gnpyqn"><h3 class="dialog-heading svelte-1gnpyqn"> </h3> <!></div> <!></div> <div class="draft-list-container svelte-1gnpyqn"><!></div>', 1), pa = p("<div> </div>"), va = p("<!> <!>", 1);
const ua = {
  hash: "svelte-1gnpyqn",
  code: `.draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,\r
    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function ga(t, s) {
  Ht(s, !0), gt(t, ua);
  const n = () => Dt($t, "$_", D), [D, k] = xt();
  let c = G(s, "show", 15, !1), C = G(s, "onClose", 7), b = G(s, "onApplyDraft", 7), F = G(s, "onSaveDraft", 7), ge = G(s, "subscribeToDraftSaveCompleted", 7), he = G(s, "canSaveDraft", 7), v = G(s, "pubkeyHex", 7, null), V = de(Nt([])), N = de("idle"), L = de("loading"), q = de(void 0), me = de(!1), ae, ne = 0, j = 0, I = !1;
  function Be() {
    return {
      channel: n()("channelComposer.selected_label") || "チャンネル",
      reply: n()("replyQuote.reply_label") || "リプライ",
      quote: n()("replyQuote.quote_label") || "引用",
      image: n()("draft.media.image") || "[画像]",
      video: n()("draft.media.video") || "[動画]"
    };
  }
  let Fe = g(() => je.postStatus), Ve = g(() => je.isUploading), Se = g(() => e(L) === "ready" && e(q) !== void 0 && e(q) === v()), Ce = g(() => !he() || e(Fe).sending || e(Ve) || e(N) !== "idle" || !e(Se)), O = g(() => e(N) !== "idle" || !e(Se));
  function ye() {
    c(!1), C()?.();
  }
  ht(() => c(), ye, !0);
  function Pe() {
    ae !== void 0 && (clearTimeout(ae), ae = void 0);
  }
  function Oe() {
    Pe(), d(me, !0), ae = setTimeout(
      () => {
        I || (d(me, !1), ae = void 0);
      },
      2e3
    );
  }
  async function ce(a, h = !1) {
    if (!c() || a !== v()) return;
    const P = ++ne;
    d(L, "loading"), h && (d(V, [], !0), d(q, void 0));
    try {
      const m = await _t({ pubkeyHex: a });
      !I && c() && a === v() && P === ne && (d(V, m, !0), d(q, a, !0), d(L, "ready"));
    } catch (m) {
      !I && c() && a === v() && P === ne && (d(V, [], !0), d(q, void 0), d(L, "failed")), console.error("下書き一覧の読み込みに失敗:", m);
    }
  }
  function Ue(a) {
    !c() || a.pubkeyHex !== v() || (Oe(), ce(a.pubkeyHex));
  }
  mt(() => ge()(Ue)), yt(() => {
    I = !0, ne += 1, j += 1, Pe();
  }), jt(() => {
    const a = v();
    if (!c()) {
      ne += 1, j += 1, d(V, [], !0), d(q, void 0), d(L, "loading"), d(N, "idle");
      return;
    }
    j += 1, d(N, "idle"), ce(a, !0);
  });
  function We(a) {
    e(O) || e(q) !== v() || (b()(a), ye());
  }
  async function Ze() {
    if (e(Ce)) return;
    const a = v(), h = ++j;
    d(N, "saving");
    try {
      await F()();
    } finally {
      !I && h === j && a === v() && d(N, "idle");
    }
  }
  async function be(a) {
    if (e(O) || e(q) === void 0 || e(q) !== v()) return;
    const h = e(q), P = ++j;
    d(N, "mutating-list");
    try {
      if (await a({ pubkeyHex: h }), I || P !== j || h !== v()) return;
      await ce(h);
    } catch (m) {
      console.error("下書き一覧の更新に失敗:", m);
    } finally {
      !I && P === j && h === v() && d(N, "idle");
    }
  }
  async function Je(a) {
    await be((h) => At(a, h));
  }
  async function Ke(a) {
    await be((h) => Tt(a.id, !a.pinned, h));
  }
  async function Xe() {
    await be((a) => St(a));
  }
  function Ye() {
    !c() || e(L) !== "failed" || ce(v(), !0);
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
      return v();
    },
    set pubkeyHex(a = null) {
      v(a), B();
    }
  }, Le = va(), Te = te(Le);
  {
    const a = (m) => {
      var re = Kt(), U = te(re), se = o(U);
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
          onClick: Ze,
          children: (M, W) => {
            var Z = Zt(), Q = x(te(Z), 2), oe = o(Q, !0);
            r(Q), y((fe) => _(oe, fe), [() => n()("draft.save") || "下書き保存"]), i(M, Z);
          },
          $$slots: { default: !0 }
        });
      }
      r(U);
      var ie = x(U, 2);
      {
        const z = (M, W) => {
          let Z = () => W?.().props;
          {
            let Q = g(() => n()("global.close") || "閉じる");
            ee(M, wt(Z, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(Q);
              },
              children: (oe, fe) => {
                var pe = Jt();
                y((xe) => kt(pe, "aria-label", xe), [() => n()("global.close") || "閉じる"]), i(oe, pe);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        qt(ie, () => Rt, (M, W) => {
          W(M, { child: z, $$slots: { child: !0 } });
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
        var U = fa(), se = te(U), ie = o(se), z = o(ie), M = o(z, !0);
        r(z);
        var W = x(z, 2);
        {
          let u = g(() => n()("draft.info") || "下書き情報");
          Gt(W, {
            side: "bottom",
            sideOffset: 8,
            get ariaLabel() {
              return e(u);
            },
            children: (f, w) => {
              ze();
              var l = Ie();
              y(($) => _(l, $), [
                () => n()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"
              ]), i(f, l);
            },
            $$slots: { default: !0 }
          });
        }
        r(ie);
        var Z = x(ie, 2);
        {
          let u = g(() => n()("draft.delete_all") || "全て削除");
          ee(Z, {
            className: "delete-all-button",
            variant: "default",
            shape: "rounded",
            get ariaLabel() {
              return e(u);
            },
            get disabled() {
              return e(O);
            },
            onClick: Xe,
            children: (f, w) => {
              var l = Xt(), $ = x(te(l), 2), H = o($, !0);
              r($), y((J) => _(H, J), [() => n()("draft.delete_all") || "全て削除"]), i(f, l);
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
              let H = g(() => n()("draft.retry_load") || "再試行");
              ee($, {
                className: "retry-load-button",
                variant: "secondary",
                shape: "square",
                get ariaLabel() {
                  return e(H);
                },
                onClick: Ye,
                children: (J, K) => {
                  ze();
                  var X = Ie();
                  y((_e) => _(X, _e), [() => n()("draft.retry_load") || "再試行"]), i(J, X);
                },
                $$slots: { default: !0 }
              });
            }
            r(f), y((H) => _(l, H), [() => n()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), i(u, f);
          }, pe = (u) => {
            var f = ea(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("loadingPlaceholder.loading") || "読み込み中..."]), i(u, f);
          }, xe = (u) => {
            var f = ta(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("draft.no_drafts") || "下書きがありません"]), i(u, f);
          }, nt = (u) => {
            var f = ca();
            Ee(f, 21, () => e(V), (w) => w.id, (w, l) => {
              const $ = g(() => Wt(e(l), Be(), document));
              var H = da(), J = o(H);
              {
                let S = g(() => `pin-button ${e(l).pinned ? "pinned" : ""}`), T = g(() => e(l).pinned ? n()("draft.unpin") || "ピン留めを解除" : n()("draft.pin") || "ピン留め"), E = g(() => e(l).pinned ? "true" : "false");
                ee(J, {
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
                    return e(O);
                  },
                  onClick: () => void Ke(e(l)),
                  children: (le, He) => {
                    var R = aa();
                    i(le, R);
                  },
                  $$slots: { default: !0 }
                });
              }
              var K = x(J, 2), X = o(K), _e = o(X);
              {
                var rt = (S) => {
                  var T = ia(), E = te(T);
                  Ee(E, 21, () => e($).contexts, Pt, (R, A) => {
                    var Y = ra();
                    let Ne;
                    var qe = x(o(Y), 2), lt = o(qe, !0);
                    r(qe);
                    var dt = x(qe, 2);
                    {
                      var ct = (we) => {
                        var De = na(), ft = o(De, !0);
                        r(De), y(() => _(ft, e(A).detail)), i(we, De);
                      };
                      ue(dt, (we) => {
                        e(A).detail && we(ct);
                      });
                    }
                    r(Y), y(() => {
                      Ne = Lt(Y, 1, "draft-context-row svelte-1gnpyqn", null, Ne, {
                        "channel-context": e(A).kind === "channel",
                        "reply-context": e(A).kind === "reply",
                        "quote-context": e(A).kind === "quote"
                      }), _(lt, e(A).name);
                    }), i(R, Y);
                  }), r(E);
                  var le = x(E, 2);
                  {
                    var He = (R) => {
                      var A = sa(), Y = o(A, !0);
                      r(A), y(() => _(Y, e($).bodyPreview)), i(R, A);
                    };
                    ue(le, (R) => {
                      e($).bodyPreview && R(He);
                    });
                  }
                  i(S, T);
                }, st = (S) => {
                  var T = oa(), E = o(T, !0);
                  r(T), y(() => _(E, e($).title)), i(S, T);
                };
                ue(_e, (S) => {
                  e($).contexts.length > 0 ? S(rt) : S(st, -1);
                });
              }
              r(X);
              var Ae = x(X, 2), it = o(Ae, !0);
              r(Ae), r(K);
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
                    return e(O);
                  },
                  onClick: () => void Je(e(l).id),
                  children: (T, E) => {
                    var le = la();
                    i(T, le);
                  },
                  $$slots: { default: !0 }
                });
              }
              r(H), y(
                (S) => {
                  K.disabled = e(O), _(it, S);
                },
                [() => Ct(e(l).timestamp)]
              ), Mt("click", K, () => We(e(l))), i(w, H);
            }), r(f), i(u, f);
          };
          ue(oe, (u) => {
            e(L) === "failed" ? u(fe) : e(L) === "loading" || e(q) !== v() ? u(pe, 1) : e(L) === "ready" && e(q) === v() && e(V).length === 0 ? u(xe, 2) : e(L) === "ready" && e(q) === v() && u(nt, 3);
          });
        }
        r(Q), y((u) => _(M, u), [() => n()("draft.title") || "下書き"]), i(m, U);
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
      var P = pa(), m = o(P, !0);
      r(P), y((re) => _(m, re), [() => n()("draft.saved") || "下書きを保存しました"]), i(a, P);
    },
    $$slots: { default: !0 }
  }), i(t, Le);
  var at = Et(et);
  return k(), at;
}
It(["click"]);
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
