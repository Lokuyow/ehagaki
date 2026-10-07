import { c2 as ze, c3 as pt, c4 as ve, b5 as Re, M as vt, N as V, aQ as ut, an as gt, c5 as ht, aK as ee, Q as ue, aM as mt, W as yt, c6 as xt, aS as bt, aV as _t, _ as qt, U as wt, a1 as Ee, $ as Dt, c7 as $t, a0 as Ie, c8 as kt, aZ as St, T as Ct, c9 as Pt, ca as Lt } from "./App-Ck79ufzA.js";
import { aP as Tt, b0 as Ht, aT as de, aK as Nt, aO as At, b as d, b2 as te, bh as Me, Z as y, b3 as i, a as e, bf as b, aS as g, b4 as Et, b5 as B, bi as _, b8 as o, ba as p, ap as It, aq as Mt, b6 as Qt, b9 as r, bj as Qe } from "./entry-CLkZn30j.js";
import { D as jt, a as zt } from "./DialogWrapper-aT5t3sgb.js";
import { I as Rt } from "./InfoPopoverButton-lxbTtB7m.js";
import { s as Vt } from "./domSanitizer-Bzf7Qvaa.js";
function $e(t) {
  return t ? Vt(t).trim() : "";
}
function ke(t) {
  return t.length <= 16 ? t : Re(t, 10, 4);
}
function Bt(t) {
  if (!t)
    return "";
  try {
    const s = Tt.npubEncode(t);
    return Re(s, 12, 4);
  } catch {
    return ke(t);
  }
}
function je(t) {
  return t.authorDisplayName?.trim() || Bt(t.authorPubkey) || ke(t.eventId);
}
function Ft(t) {
  const s = ze(t);
  return s.name?.trim() || `ID: ${ke(s.eventId)}`;
}
function Ve(t) {
  return "reply" in t || "quotes" in t;
}
function Gt(t) {
  return t ? Ve(t) ? t.reply ?? null : t.mode === "reply" ? t : null : null;
}
function Ot(t) {
  return t ? Ve(t) ? t.quotes : t.mode === "quote" ? [t] : [] : [];
}
function Ut(t, s, n) {
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
    return $.length > ve ? `${$.substring(0, ve)}...` : $;
  const x = `${$} ${C}`;
  if (x.length <= ve)
    return x;
  const F = ve - C.length - 4;
  return F > 0 ? `${$.substring(0, F)}... ${C}` : C;
}
function Wt(t, s, n = document) {
  const D = [];
  if (t.channelData) {
    const x = ze(t.channelData);
    D.push({
      kind: "channel",
      label: s.channel,
      name: Ft(t.channelData),
      detail: $e(x.about)
    });
  }
  const $ = Gt(t.replyQuoteData);
  $ && D.push({
    kind: "reply",
    label: s.reply,
    name: je($),
    detail: $e($.referencedEvent?.content)
  }), Ot(t.replyQuoteData).forEach((x) => {
    D.push({
      kind: "quote",
      label: s.quote,
      name: je(x),
      detail: $e(x.referencedEvent?.content)
    });
  });
  const c = Ut(t, s, n);
  return {
    title: D.length > 0 ? D.map((x) => `${x.label}: ${x.name}`).join(" / ") : c || t.preview,
    bodyPreview: c,
    contexts: D
  };
}
var Kt = p('<div class="save-draft-icon svg-icon svelte-1gnpyqn"></div> <span class="btn-text"> </span>', 1), Zt = p('<div class="xmark-icon svg-icon svelte-1gnpyqn"></div>'), Jt = p('<div class="dialog-footer-actions svelte-1gnpyqn"><!></div> <!>', 1), Xt = p('<div class="trash-icon svg-icon svelte-1gnpyqn"></div> <span class="delete-all-label"> </span>', 1), Yt = p('<div class="load-error svelte-1gnpyqn"><div role="alert"> </div> <!></div>'), ea = p('<div class="empty-message svelte-1gnpyqn"> </div>'), ta = p('<div class="empty-message svelte-1gnpyqn"> </div>'), aa = p('<div class="thumbtack-icon svg-icon svelte-1gnpyqn"></div>'), na = p('<span class="context-detail svelte-1gnpyqn"> </span>'), ra = p('<span><span class="preview-mode-icon svg-icon svelte-1gnpyqn"></span> <span class="context-name svelte-1gnpyqn"> </span> <!></span>'), sa = p('<span class="draft-preview svelte-1gnpyqn"> </span>'), ia = p('<span class="draft-context-list svelte-1gnpyqn"></span> <!>', 1), oa = p('<span class="draft-preview svelte-1gnpyqn"> </span>'), la = p('<div class="trash-icon svg-icon svelte-1gnpyqn"></div>'), da = p('<li class="draft-item svelte-1gnpyqn"><!> <button type="button" class="draft-content svelte-1gnpyqn"><span class="draft-main svelte-1gnpyqn"><!></span> <span class="draft-timestamp svelte-1gnpyqn"> </span></button> <!></li>'), ca = p('<ul class="draft-list svelte-1gnpyqn"></ul>'), fa = p('<div class="dialog-heading-container svelte-1gnpyqn"><div class="dialog-heading-wrapper svelte-1gnpyqn"><h3 class="dialog-heading svelte-1gnpyqn"> </h3> <!></div> <!></div> <div class="draft-list-container svelte-1gnpyqn"><!></div>', 1), pa = p("<div> </div>"), va = p("<!> <!>", 1);
const ua = {
  hash: "svelte-1gnpyqn",
  code: `.draft-list-dialog {max-height:calc(100svh - 32px);overflow:hidden;}.draft-list-dialog .dialog-content {padding:0;flex:1 1 auto;min-height:0;overflow:hidden;}.dialog-heading-container.svelte-1gnpyqn {display:flex;justify-content:space-between;align-items:center;margin:0;padding:18px 16px;font-size:1.25rem;font-weight:700;color:var(--text);width:100%;border-bottom:1px solid var(--border-hr);}.dialog-heading-wrapper.svelte-1gnpyqn {display:flex;align-items:center;}.dialog-heading.svelte-1gnpyqn {margin:0;}.draft-list-container.svelte-1gnpyqn {width:100%;flex:1 1 auto;min-height:0;overflow-y:auto;}.dialog-footer-actions.svelte-1gnpyqn {display:flex;flex-direction:column;width:100%;}.save-draft-button {width:100%;height:50px;justify-content:center;}.save-draft-icon.svelte-1gnpyqn {width:24px;height:24px;mask-image:var(--ehagaki-icon-736176655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.empty-message.svelte-1gnpyqn {display:flex;justify-content:center;align-items:center;height:100px;color:var(--text-muted);font-size:1rem;}.load-error.svelte-1gnpyqn {display:grid;justify-items:center;gap:12px;padding:24px 16px;color:var(--text-muted);text-align:center;}.draft-list.svelte-1gnpyqn {list-style:none;margin:0;padding:0;width:100%;}.draft-item.svelte-1gnpyqn {display:flex;align-items:stretch;min-height:50px;border-bottom:1px solid var(--border-hr);&:last-child {border-bottom:none;}.delete-button {width:50px;height:auto;--btn-bg: var(--dialog-bg);.trash-icon:where(.svelte-1gnpyqn) {width:24px;height:24px;}}.pin-button {width:44px;height:auto;--btn-bg: var(--dialog-bg);.thumbtack-icon:where(.svelte-1gnpyqn) {width:20px;height:20px;opacity:0.38;transition:opacity 0.15s ease;}&.pinned .thumbtack-icon {opacity:1;}}button.draft-content:where(.svelte-1gnpyqn) {flex:1;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;--btn-bg: var(--dialog-bg);border:none;cursor:pointer;text-align:start;color:var(--text);font-size:1rem;min-width:0;height:auto;}}.draft-main.svelte-1gnpyqn {flex:1;display:grid;gap:6px;min-width:0;}.draft-preview.svelte-1gnpyqn {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.draft-preview.svelte-1gnpyqn {font-size:1rem;color:var(--text);}.draft-context-list.svelte-1gnpyqn {display:grid;gap:4px;min-width:0;}.draft-context-row.svelte-1gnpyqn {display:flex;align-items:center;gap:6px;min-width:0;color:var(--text-muted);font-size:0.9rem;line-height:1.3;}.preview-mode-icon.svelte-1gnpyqn {width:18px;height:18px;flex-shrink:0;color:inherit;--svg: currentColor;--icon-hover-color: currentColor;--icon-selected-hover-color: currentColor;}.channel-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f72756d5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.reply-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-636861745f627562626c655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.quote-context.svelte-1gnpyqn .preview-mode-icon:where(.svelte-1gnpyqn) {mask-image:var(--ehagaki-icon-666f726d61745f71756f74655f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);}.context-name.svelte-1gnpyqn,
    .context-detail.svelte-1gnpyqn {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.context-name.svelte-1gnpyqn {flex:1 1 auto;min-width:3em;}.channel-context.svelte-1gnpyqn .context-name:where(.svelte-1gnpyqn) {flex:0 1 auto;min-width:0;}.context-detail.svelte-1gnpyqn {flex:0 1 auto;min-width:0;color:var(--text-muted);}.channel-context.svelte-1gnpyqn .context-detail:where(.svelte-1gnpyqn) {flex:1 1 0;}.draft-timestamp.svelte-1gnpyqn {flex-shrink:0;font-size:1rem;font-weight:400;color:var(--text-muted);}.trash-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-64656c6574655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.thumbtack-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-6b6565705f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.xmark-icon.svelte-1gnpyqn {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}`
};
function ga(t, s) {
  Ht(s, !0), vt(t, ua);
  const n = () => qt(Dt, "$_", D), [D, $] = yt();
  let c = V(s, "show", 15, !1), C = V(s, "onClose", 7), x = V(s, "onApplyDraft", 7), F = V(s, "onSaveDraft", 7), ge = V(s, "subscribeToDraftSaveCompleted", 7), he = V(s, "canSaveDraft", 7), v = V(s, "pubkeyHex", 7, null), G = de(Nt([])), A = de("idle"), L = de("loading"), q = de(void 0), me = de(!1), ae, ne = 0, E = 0, M = !1;
  function Be() {
    return {
      channel: n()("channelComposer.selected_label") || "チャンネル",
      reply: n()("replyQuote.reply_label") || "リプライ",
      quote: n()("replyQuote.quote_label") || "引用",
      image: n()("draft.media.image") || "[画像]",
      video: n()("draft.media.video") || "[動画]"
    };
  }
  let Fe = g(() => Ee.postStatus), Ge = g(() => Ee.isUploading), Se = g(() => e(L) === "ready" && e(q) !== void 0 && e(q) === v()), Ce = g(() => !he() || e(Fe).sending || e(Ge) || e(A) !== "idle" || !e(Se)), O = g(() => e(A) !== "idle" || !e(Se));
  function ye() {
    c(!1), C()?.();
  }
  ut(() => c(), ye, !0);
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
    if (!c() || a !== v()) return;
    const P = ++ne;
    d(L, "loading"), h && (d(G, [], !0), d(q, void 0));
    try {
      const m = await xt({ pubkeyHex: a });
      !M && c() && a === v() && P === ne && (d(G, m, !0), d(q, a, !0), d(L, "ready"));
    } catch (m) {
      !M && c() && a === v() && P === ne && (d(G, [], !0), d(q, void 0), d(L, "failed")), console.error("下書き一覧の読み込みに失敗:", m);
    }
  }
  function Ue(a) {
    !c() || a.pubkeyHex !== v() || (Oe(), ce(a.pubkeyHex));
  }
  gt(() => ge()(Ue)), ht(() => {
    M = !0, ne += 1, E += 1, Pe();
  }), At(() => {
    const a = v();
    if (!c()) {
      ne += 1, E += 1, d(G, [], !0), d(q, void 0), d(L, "loading"), d(A, "idle");
      return;
    }
    E += 1, d(A, "idle"), ce(a, !0);
  });
  function We(a) {
    e(O) || e(q) !== v() || (x()(a), ye());
  }
  async function Ke() {
    if (e(Ce)) return;
    const a = v(), h = ++E;
    d(A, "saving");
    try {
      await F()();
    } finally {
      !M && h === E && a === v() && d(A, "idle");
    }
  }
  async function xe(a) {
    if (e(O) || e(q) === void 0 || e(q) !== v()) return;
    const h = e(q), P = ++E;
    d(A, "mutating-list");
    try {
      if (await a({ pubkeyHex: h }), M || P !== E || h !== v()) return;
      await ce(h);
    } catch (m) {
      console.error("下書き一覧の更新に失敗:", m);
    } finally {
      !M && P === E && h === v() && d(A, "idle");
    }
  }
  async function Ze(a) {
    await xe((h) => Lt(a, h));
  }
  async function Je(a) {
    await xe((h) => Pt(a.id, !a.pinned, h));
  }
  async function Xe() {
    await xe((a) => $t(a));
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
      return x();
    },
    set onApplyDraft(a) {
      x(a), B();
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
      var re = Jt(), U = te(re), se = o(U);
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
          onClick: Ke,
          children: (j, W) => {
            var K = Kt(), z = b(te(K), 2), oe = o(z, !0);
            r(z), y((fe) => _(oe, fe), [() => n()("draft.save") || "下書き保存"]), i(j, K);
          },
          $$slots: { default: !0 }
        });
      }
      r(U);
      var ie = b(U, 2);
      {
        const Q = (j, W) => {
          let K = () => W?.().props;
          {
            let z = g(() => n()("global.close") || "閉じる");
            ee(j, _t(K, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(z);
              },
              children: (oe, fe) => {
                var pe = Zt();
                y((be) => wt(pe, "aria-label", be), [() => n()("global.close") || "閉じる"]), i(oe, pe);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        bt(ie, () => zt, (j, W) => {
          W(j, { child: Q, $$slots: { child: !0 } });
        });
      }
      i(m, re);
    };
    let h = g(() => n()("draft.list_title") || "下書き一覧"), P = g(() => n()("draft.list_description") || "保存した下書きを選択して復元");
    jt(Te, {
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
        var U = fa(), se = te(U), ie = o(se), Q = o(ie), j = o(Q, !0);
        r(Q);
        var W = b(Q, 2);
        {
          let u = g(() => n()("draft.info") || "下書き情報");
          Rt(W, {
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
        var K = b(ie, 2);
        {
          let u = g(() => n()("draft.delete_all") || "全て削除");
          ee(K, {
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
              var l = Xt(), k = b(te(l), 2), N = o(k, !0);
              r(k), y((Z) => _(N, Z), [() => n()("draft.delete_all") || "全て削除"]), i(f, l);
            },
            $$slots: { default: !0 }
          });
        }
        r(se);
        var z = b(se, 2), oe = o(z);
        {
          var fe = (u) => {
            var f = Yt(), w = o(f), l = o(w, !0);
            r(w);
            var k = b(w, 2);
            {
              let N = g(() => n()("draft.retry_load") || "再試行");
              ee(k, {
                className: "retry-load-button",
                variant: "secondary",
                shape: "square",
                get ariaLabel() {
                  return e(N);
                },
                onClick: Ye,
                children: (Z, J) => {
                  Qe();
                  var X = Me();
                  y((_e) => _(X, _e), [() => n()("draft.retry_load") || "再試行"]), i(Z, X);
                },
                $$slots: { default: !0 }
              });
            }
            r(f), y((N) => _(l, N), [() => n()("draft.load_failed") || "下書き一覧を読み込めませんでした。"]), i(u, f);
          }, pe = (u) => {
            var f = ea(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("loadingPlaceholder.loading") || "読み込み中..."]), i(u, f);
          }, be = (u) => {
            var f = ta(), w = o(f, !0);
            r(f), y((l) => _(w, l), [() => n()("draft.no_drafts") || "下書きがありません"]), i(u, f);
          }, nt = (u) => {
            var f = ca();
            Ie(f, 21, () => e(G), (w) => w.id, (w, l) => {
              const k = g(() => Wt(e(l), Be(), document));
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
                    return e(O);
                  },
                  onClick: () => void Je(e(l)),
                  children: (le, Ne) => {
                    var R = aa();
                    i(le, R);
                  },
                  $$slots: { default: !0 }
                });
              }
              var J = b(Z, 2), X = o(J), _e = o(X);
              {
                var rt = (S) => {
                  var T = ia(), I = te(T);
                  Ie(I, 21, () => e(k).contexts, St, (R, H) => {
                    var Y = ra();
                    let Ae;
                    var qe = b(o(Y), 2), lt = o(qe, !0);
                    r(qe);
                    var dt = b(qe, 2);
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
                      Ae = Ct(Y, 1, "draft-context-row svelte-1gnpyqn", null, Ae, {
                        "channel-context": e(H).kind === "channel",
                        "reply-context": e(H).kind === "reply",
                        "quote-context": e(H).kind === "quote"
                      }), _(lt, e(H).name);
                    }), i(R, Y);
                  }), r(I);
                  var le = b(I, 2);
                  {
                    var Ne = (R) => {
                      var H = sa(), Y = o(H, !0);
                      r(H), y(() => _(Y, e(k).bodyPreview)), i(R, H);
                    };
                    ue(le, (R) => {
                      e(k).bodyPreview && R(Ne);
                    });
                  }
                  i(S, T);
                }, st = (S) => {
                  var T = oa(), I = o(T, !0);
                  r(T), y(() => _(I, e(k).title)), i(S, T);
                };
                ue(_e, (S) => {
                  e(k).contexts.length > 0 ? S(rt) : S(st, -1);
                });
              }
              r(X);
              var He = b(X, 2), it = o(He, !0);
              r(He), r(J);
              var ot = b(J, 2);
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
                  J.disabled = e(O), _(it, S);
                },
                [() => kt(e(l).timestamp)]
              ), It("click", J, () => We(e(l))), i(w, N);
            }), r(f), i(u, f);
          };
          ue(oe, (u) => {
            e(L) === "failed" ? u(fe) : e(L) === "loading" || e(q) !== v() ? u(pe, 1) : e(L) === "ready" && e(q) === v() && e(G).length === 0 ? u(be, 2) : e(L) === "ready" && e(q) === v() && u(nt, 3);
          });
        }
        r(z), y((u) => _(j, u), [() => n()("draft.title") || "下書き"]), i(m, U);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var tt = b(Te, 2);
  mt(tt, {
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
  return $(), at;
}
Mt(["click"]);
Qt(
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
