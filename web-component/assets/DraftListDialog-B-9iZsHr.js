import { c0 as Qe, c1 as vt, c2 as pt, c3 as pe, bi as Re, H as ut, I as F, b1 as gt, ai as ht, c4 as mt, aF as ee, K as ue, aH as yt, Q as bt, c5 as xt, b3 as _t, b6 as qt, V as wt, N as Dt, X as Ae, $ as $t, c6 as kt, W as Ee, c7 as St, ba as Ct, M as Pt, c8 as Lt, c9 as Tt } from "./App-C8cvgCUG.js";
import { aP as Ht, b0 as It, aT as de, aK as Nt, aO as At, b as d, b2 as te, bh as Me, Z as y, b3 as i, a as e, bf as x, aS as g, b4 as Et, b5 as V, bi as _, b8 as o, ba as v, ap as Mt, aq as jt, b6 as zt, b9 as r, bj as je } from "./entry-B5mD5NTa.js";
import { D as Qt, a as Rt } from "./DialogWrapper-BFdSo4_O.js";
import { I as Ft } from "./InfoPopoverButton-ClzRco5l.js";
function $e(t) {
  return t ? vt(t).trim() : "";
}
function ke(t) {
  return t.length <= 16 ? t : Re(t, 10, 4);
}
function Vt(t) {
  if (!t)
    return "";
  try {
    const s = Ht.npubEncode(t);
    return Re(s, 12, 4);
  } catch {
    return ke(t);
  }
}
function ze(t) {
  return t.authorDisplayName?.trim() || Vt(t.authorPubkey) || ke(t.eventId);
}
function Bt(t) {
  const s = Qe(t);
  return s.name?.trim() || `ID: ${ke(s.eventId)}`;
}
function Fe(t) {
  return "reply" in t || "quotes" in t;
}
function Gt(t) {
  return t ? Fe(t) ? t.reply ?? null : t.mode === "reply" ? t : null : null;
}
function Ot(t) {
  return t ? Fe(t) ? t.quotes : t.mode === "quote" ? [t] : [] : [];
}
function Wt(t, s, n) {
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
function Kt(t, s, n = document) {
  const D = [];
  if (t.channelData) {
    const b = Qe(t.channelData);
    D.push({
      kind: "channel",
      label: s.channel,
      name: Bt(t.channelData),
      detail: $e(b.about)
    });
  }
  const $ = Gt(t.replyQuoteData);
  $ && D.push({
    kind: "reply",
    label: s.reply,
    name: ze($),
    detail: $e($.referencedEvent?.content)
  }), Ot(t.replyQuoteData).forEach((b) => {
    D.push({
      kind: "quote",
      label: s.quote,
      name: ze(b),
      detail: $e(b.referencedEvent?.content)
    });
  });
  const c = Wt(t, s, n);
  return {
    title: D.length > 0 ? D.map((b) => `${b.label}: ${b.name}`).join(" / ") : c || t.preview,
    bodyPreview: c,
    contexts: D
  };
}
var Ut = v('<div class="save-draft-icon svg-icon svelte-1gnpyqn"></div> <span class="btn-text"> </span>', 1), Xt = v('<div class="xmark-icon svg-icon svelte-1gnpyqn"></div>'), Zt = v('<div class="dialog-footer-actions svelte-1gnpyqn"><!></div> <!>', 1), Jt = v('<div class="trash-icon svg-icon svelte-1gnpyqn"></div> <span class="delete-all-label"> </span>', 1), Yt = v('<div class="load-error svelte-1gnpyqn"><div role="alert"> </div> <!></div>'), ea = v('<div class="empty-message svelte-1gnpyqn"> </div>'), ta = v('<div class="empty-message svelte-1gnpyqn"> </div>'), aa = v('<div class="thumbtack-icon svg-icon svelte-1gnpyqn"></div>'), na = v('<span class="context-detail svelte-1gnpyqn"> </span>'), ra = v('<span><span class="preview-mode-icon svg-icon svelte-1gnpyqn"></span> <span class="context-name svelte-1gnpyqn"> </span> <!></span>'), sa = v('<span class="draft-preview svelte-1gnpyqn"> </span>'), ia = v('<span class="draft-context-list svelte-1gnpyqn"></span> <!>', 1), oa = v('<span class="draft-preview svelte-1gnpyqn"> </span>'), la = v('<div class="trash-icon svg-icon svelte-1gnpyqn"></div>'), da = v('<li class="draft-item svelte-1gnpyqn"><!> <button type="button" class="draft-content svelte-1gnpyqn"><span class="draft-main svelte-1gnpyqn"><!></span> <span class="draft-timestamp svelte-1gnpyqn"> </span></button> <!></li>'), ca = v('<ul class="draft-list svelte-1gnpyqn"></ul>'), fa = v('<div class="dialog-heading-container svelte-1gnpyqn"><div class="dialog-heading-wrapper svelte-1gnpyqn"><h3 class="dialog-heading svelte-1gnpyqn"> </h3> <!></div> <!></div> <div class="draft-list-container svelte-1gnpyqn"><!></div>', 1), va = v("<div> </div>"), pa = v("<!> <!>", 1);
const ua = {
  hash: "svelte-1gnpyqn",
  code: `.draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,
    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.channel-context.svelte-1gnpyqn .context-name:where(.svelte-1gnpyqn) {flex:0 1 auto;min-width:0;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.channel-context.svelte-1gnpyqn .context-detail:where(.svelte-1gnpyqn) {flex:1 1 0;}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function ga(t, s) {
  It(s, !0), ut(t, ua);
  const n = () => wt($t, "$_", D), [D, $] = bt();
  let c = F(s, "show", 15, !1), C = F(s, "onClose", 7), b = F(s, "onApplyDraft", 7), B = F(s, "onSaveDraft", 7), ge = F(s, "subscribeToDraftSaveCompleted", 7), he = F(s, "canSaveDraft", 7), p = F(s, "pubkeyHex", 7, null), G = de(Nt([])), N = de("idle"), L = de("loading"), q = de(void 0), me = de(!1), ae, ne = 0, A = 0, M = !1;
  function Ve() {
    return {
      channel: n()("channelComposer.selected_label") || "チャンネル",
      reply: n()("replyQuote.reply_label") || "リプライ",
      quote: n()("replyQuote.quote_label") || "引用",
      image: n()("draft.media.image") || "[画像]",
      video: n()("draft.media.video") || "[動画]"
    };
  }
  let Be = g(() => Ae.postStatus), Ge = g(() => Ae.isUploading), Se = g(() => e(L) === "ready" && e(q) !== void 0 && e(q) === p()), Ce = g(() => !he() || e(Be).sending || e(Ge) || e(N) !== "idle" || !e(Se)), O = g(() => e(N) !== "idle" || !e(Se));
  function ye() {
    c(!1), C()?.();
  }
  gt(() => c(), ye, !0);
  function Pe() {
    ae !== void 0 && (clearTimeout(ae), ae = void 0);
  }
  function Oe() {
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
    d(L, "loading"), h && (d(G, [], !0), d(q, void 0));
    try {
      const m = await xt({ pubkeyHex: a });
      !M && c() && a === p() && P === ne && (d(G, m, !0), d(q, a, !0), d(L, "ready"));
    } catch (m) {
      !M && c() && a === p() && P === ne && (d(G, [], !0), d(q, void 0), d(L, "failed")), console.error("下書き一覧の読み込みに失敗:", m);
    }
  }
  function We(a) {
    !c() || a.pubkeyHex !== p() || (Oe(), ce(a.pubkeyHex));
  }
  ht(() => ge()(We)), mt(() => {
    M = !0, ne += 1, A += 1, Pe();
  }), At(() => {
    const a = p();
    if (!c()) {
      ne += 1, A += 1, d(G, [], !0), d(q, void 0), d(L, "loading"), d(N, "idle");
      return;
    }
    A += 1, d(N, "idle"), ce(a, !0);
  });
  function Ke(a) {
    e(O) || e(q) !== p() || (b()(a), ye());
  }
  async function Ue() {
    if (e(Ce)) return;
    const a = p(), h = ++A;
    d(N, "saving");
    try {
      await B()();
    } finally {
      !M && h === A && a === p() && d(N, "idle");
    }
  }
  async function be(a) {
    if (e(O) || e(q) === void 0 || e(q) !== p()) return;
    const h = e(q), P = ++A;
    d(N, "mutating-list");
    try {
      if (await a({ pubkeyHex: h }), M || P !== A || h !== p()) return;
      await ce(h);
    } catch (m) {
      console.error("下書き一覧の更新に失敗:", m);
    } finally {
      !M && P === A && h === p() && d(N, "idle");
    }
  }
  async function Xe(a) {
    await be((h) => Tt(a, h));
  }
  async function Ze(a) {
    await be((h) => Lt(a.id, !a.pinned, h));
  }
  async function Je() {
    await be((a) => kt(a));
  }
  function Ye() {
    !c() || e(L) !== "failed" || ce(p(), !0);
  }
  var et = {
    get show() {
      return c();
    },
    set show(a = !1) {
      c(a), V();
    },
    get onClose() {
      return C();
    },
    set onClose(a) {
      C(a), V();
    },
    get onApplyDraft() {
      return b();
    },
    set onApplyDraft(a) {
      b(a), V();
    },
    get onSaveDraft() {
      return B();
    },
    set onSaveDraft(a) {
      B(a), V();
    },
    get subscribeToDraftSaveCompleted() {
      return ge();
    },
    set subscribeToDraftSaveCompleted(a) {
      ge(a), V();
    },
    get canSaveDraft() {
      return he();
    },
    set canSaveDraft(a) {
      he(a), V();
    },
    get pubkeyHex() {
      return p();
    },
    set pubkeyHex(a = null) {
      p(a), V();
    }
  }, Le = pa(), Te = te(Le);
  {
    const a = (m) => {
      var re = Zt(), W = te(re), se = o(W);
      {
        let j = g(() => n()("draft.save") || "下書き保存");
        ee(se, {
          className: "save-draft-button",
          variant: "primary",
          shape: "square",
          contentLayout: "iconText",
          get ariaLabel() {
            return e(j);
          },
          get disabled() {
            return e(Ce);
          },
          onClick: Ue,
          children: (z, K) => {
            var U = Ut(), Q = x(te(U), 2), oe = o(Q, !0);
            r(Q), y((fe) => _(oe, fe), [() => n()("draft.save") || "下書き保存"]), i(z, U);
          },
          $$slots: { default: !0 }
        });
      }
      r(W);
      var ie = x(W, 2);
      {
        const j = (z, K) => {
          let U = () => K?.().props;
          {
            let Q = g(() => n()("global.close") || "閉じる");
            ee(z, qt(U, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(Q);
              },
              children: (oe, fe) => {
                var ve = Xt();
                y((xe) => Dt(ve, "aria-label", xe), [() => n()("global.close") || "閉じる"]), i(oe, ve);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        _t(ie, () => Rt, (z, K) => {
          K(z, { child: j, $$slots: { child: !0 } });
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
        var W = fa(), se = te(W), ie = o(se), j = o(ie), z = o(j, !0);
        r(j);
        var K = x(j, 2);
        {
          let u = g(() => n()("draft.info") || "下書き情報");
          Ft(K, {
            side: "bottom",
            sideOffset: 8,
            get ariaLabel() {
              return e(u);
            },
            children: (f, w) => {
              je();
              var l = Me();
              y((k) => _(l, k), [
                () => n()("draft.info") || "下書きはブラウザに保存されます。ブラウザのデータを削除したり、ログアウトすると下書きは削除されます。"
              ]), i(f, l);
            },
            $$slots: { default: !0 }
          });
        }
        r(ie);
        var U = x(ie, 2);
        {
          let u = g(() => n()("draft.delete_all") || "全て削除");
          ee(U, {
            className: "delete-all-button",
            variant: "default",
            shape: "rounded",
            get ariaLabel() {
              return e(u);
            },
            get disabled() {
              return e(O);
            },
            onClick: Je,
            children: (f, w) => {
              var l = Jt(), k = x(te(l), 2), I = o(k, !0);
              r(k), y((X) => _(I, X), [() => n()("draft.delete_all") || "全て削除"]), i(f, l);
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
            var k = x(w, 2);
            {
              let I = g(() => n()("draft.retry_load") || "再試行");
              ee(k, {
                className: "retry-load-button",
                variant: "secondary",
                shape: "square",
                get ariaLabel() {
                  return e(I);
                },
                onClick: Ye,
                children: (X, Z) => {
                  je();
                  var J = Me();
                  y((_e) => _(J, _e), [() => n()("draft.retry_load") || "再試行"]), i(X, J);
                },
                $$slots: { default: !0 }
              });
            }
            r(f), y((I) => _(l, I), [() => n()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), i(u, f);
          }, ve = (u) => {
            var f = ea(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("loadingPlaceholder.loading") || "読み込み中..."]), i(u, f);
          }, xe = (u) => {
            var f = ta(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("draft.no_drafts") || "下書きがありません"]), i(u, f);
          }, nt = (u) => {
            var f = ca();
            Ee(f, 21, () => e(G), (w) => w.id, (w, l) => {
              const k = g(() => Kt(e(l), Ve(), document));
              var I = da(), X = o(I);
              {
                let S = g(() => `pin-button ${e(l).pinned ? "pinned" : ""}`), T = g(() => e(l).pinned ? n()("draft.unpin") || "ピン留めを解除" : n()("draft.pin") || "ピン留め"), E = g(() => e(l).pinned ? "true" : "false");
                ee(X, {
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
                  onClick: () => void Ze(e(l)),
                  children: (le, Ie) => {
                    var R = aa();
                    i(le, R);
                  },
                  $$slots: { default: !0 }
                });
              }
              var Z = x(X, 2), J = o(Z), _e = o(J);
              {
                var rt = (S) => {
                  var T = ia(), E = te(T);
                  Ee(E, 21, () => e(k).contexts, Ct, (R, H) => {
                    var Y = ra();
                    let Ne;
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
                      Ne = Pt(Y, 1, "draft-context-row svelte-1gnpyqn", null, Ne, {
                        "channel-context": e(H).kind === "channel",
                        "reply-context": e(H).kind === "reply",
                        "quote-context": e(H).kind === "quote"
                      }), _(lt, e(H).name);
                    }), i(R, Y);
                  }), r(E);
                  var le = x(E, 2);
                  {
                    var Ie = (R) => {
                      var H = sa(), Y = o(H, !0);
                      r(H), y(() => _(Y, e(k).bodyPreview)), i(R, H);
                    };
                    ue(le, (R) => {
                      e(k).bodyPreview && R(Ie);
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
              r(J);
              var He = x(J, 2), it = o(He, !0);
              r(He), r(Z);
              var ot = x(Z, 2);
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
                  onClick: () => void Xe(e(l).id),
                  children: (T, E) => {
                    var le = la();
                    i(T, le);
                  },
                  $$slots: { default: !0 }
                });
              }
              r(I), y(
                (S) => {
                  Z.disabled = e(O), _(it, S);
                },
                [() => St(e(l).timestamp)]
              ), Mt("click", Z, () => Ke(e(l))), i(w, I);
            }), r(f), i(u, f);
          };
          ue(oe, (u) => {
            e(L) === "failed" ? u(fe) : e(L) === "loading" || e(q) !== p() ? u(ve, 1) : e(L) === "ready" && e(q) === p() && e(G).length === 0 ? u(xe, 2) : e(L) === "ready" && e(q) === p() && u(nt, 3);
          });
        }
        r(Q), y((u) => _(z, u), [() => n()("draft.title") || "下書き"]), i(m, W);
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
