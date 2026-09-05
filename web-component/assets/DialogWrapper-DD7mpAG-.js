import { I as a, dN as Pt, aP as N, aS as W, aQ as x, dO as _t, K as E, aR as xe, aT as Xe, aU as me, aV as Ze, dP as yt, dQ as Ft, dR as Lt, b1 as Ee, dS as Ct, dT as Ot, dU as Ue, H as wt, a_ as ne, b_ as St, dV as At, dW as Dt, dX as jt, M as Gt, aA as he, S as kt, N as Et } from "./App-CT56EfFO.js";
import { b0 as Pe, b1 as I, b2 as h, b3 as l, b4 as _e, b5 as o, n as re, b6 as ye, b7 as Je, a as i, b8 as G, b9 as k, aR as m, ba as C, bf as L, bl as Nt, bh as qe, Z as be, b as It, aS as Kt, bi as Ne, bj as He } from "./entry-BmNX31GD.js";
function Ye(K, t) {
  Pe(t, !0);
  let g = a(t, "open", 15, !1), f = a(t, "onOpenChange", 7, x), u = a(t, "onOpenChangeComplete", 7, x), c = a(t, "children", 7);
  Pt.create({
    variant: N(() => "dialog"),
    open: N(() => g(), (s) => {
      g(s), f()(s);
    }),
    onOpenChangeComplete: N(() => u())
  });
  var p = {
    get open() {
      return g();
    },
    set open(s = !1) {
      g(s), o();
    },
    get onOpenChange() {
      return f();
    },
    set onOpenChange(s = x) {
      f(s), o();
    },
    get onOpenChangeComplete() {
      return u();
    },
    set onOpenChangeComplete(s = x) {
      u(s), o();
    },
    get children() {
      return c();
    },
    set children(s) {
      c(s), o();
    }
  }, v = I(), P = h(v);
  return W(P, () => c() ?? re), l(K, v), _e(p);
}
ye(
  Ye,
  {
    open: {},
    onOpenChange: {},
    onOpenChangeComplete: {},
    children: {}
  },
  [],
  [],
  { mode: "open" }
);
var zt = C("<button><!></button>");
function Mt(K, t) {
  const g = Je();
  Pe(t, !0);
  let f = a(t, "children", 7), u = a(t, "child", 7), c = a(t, "id", 23, () => xe(g)), p = a(t, "ref", 15, null), v = a(t, "disabled", 7, !1), P = Ze(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref",
    "disabled"
  ]);
  const s = _t.create({
    variant: N(() => "close"),
    id: N(() => c()),
    ref: N(() => p(), (n) => p(n)),
    disabled: N(() => !!v())
  }), O = m(() => me(P, s.props));
  var _ = {
    get children() {
      return f();
    },
    set children(n) {
      f(n), o();
    },
    get child() {
      return u();
    },
    set child(n) {
      u(n), o();
    },
    get id() {
      return c();
    },
    set id(n = xe(g)) {
      c(n), o();
    },
    get ref() {
      return p();
    },
    set ref(n = null) {
      p(n), o();
    },
    get disabled() {
      return v();
    },
    set disabled(n = !1) {
      v(n), o();
    }
  }, y = I(), b = h(y);
  {
    var w = (n) => {
      var d = I(), A = h(d);
      W(A, u, () => ({ props: i(O) })), l(n, d);
    }, z = (n) => {
      var d = zt();
      Xe(d, () => ({ ...i(O) }));
      var A = G(d);
      W(A, () => f() ?? re), k(d), l(n, d);
    };
    E(b, (n) => {
      u() ? n(w) : n(z, -1);
    });
  }
  return l(K, y), _e(_);
}
ye(Mt, { children: {}, child: {}, id: {}, ref: {}, disabled: {} }, [], [], { mode: "open" });
var Rt = C("<!> <!>", 1), Vt = C("<!> <div><!></div>", 1);
function $e(K, t) {
  const g = Je();
  Pe(t, !0);
  let f = a(t, "id", 23, () => xe(g)), u = a(t, "children", 7), c = a(t, "child", 7), p = a(t, "ref", 15, null), v = a(t, "forceMount", 7, !1), P = a(t, "onCloseAutoFocus", 7, x), s = a(t, "onOpenAutoFocus", 7, x), O = a(t, "onEscapeKeydown", 7, x), _ = a(t, "onInteractOutside", 7, x), y = a(t, "trapFocus", 7, !0), b = a(t, "preventScroll", 7, !0), w = a(t, "restoreScrollDelay", 7, null), z = Ze(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "children",
    "child",
    "ref",
    "forceMount",
    "onCloseAutoFocus",
    "onOpenAutoFocus",
    "onEscapeKeydown",
    "onInteractOutside",
    "trapFocus",
    "preventScroll",
    "restoreScrollDelay"
  ]);
  const n = yt.create({
    id: N(() => f()),
    ref: N(() => p(), (r) => p(r))
  }), d = m(() => me(z, n.props));
  var A = {
    get id() {
      return f();
    },
    set id(r = xe(g)) {
      f(r), o();
    },
    get children() {
      return u();
    },
    set children(r) {
      u(r), o();
    },
    get child() {
      return c();
    },
    set child(r) {
      c(r), o();
    },
    get ref() {
      return p();
    },
    set ref(r = null) {
      p(r), o();
    },
    get forceMount() {
      return v();
    },
    set forceMount(r = !1) {
      v(r), o();
    },
    get onCloseAutoFocus() {
      return P();
    },
    set onCloseAutoFocus(r = x) {
      P(r), o();
    },
    get onOpenAutoFocus() {
      return s();
    },
    set onOpenAutoFocus(r = x) {
      s(r), o();
    },
    get onEscapeKeydown() {
      return O();
    },
    set onEscapeKeydown(r = x) {
      O(r), o();
    },
    get onInteractOutside() {
      return _();
    },
    set onInteractOutside(r = x) {
      _(r), o();
    },
    get trapFocus() {
      return y();
    },
    set trapFocus(r = !0) {
      y(r), o();
    },
    get preventScroll() {
      return b();
    },
    set preventScroll(r = !0) {
      b(r), o();
    },
    get restoreScrollDelay() {
      return w();
    },
    set restoreScrollDelay(r = null) {
      w(r), o();
    }
  }, Z = I(), le = h(Z);
  {
    var M = (r) => {
      Ft(r, {
        get ref() {
          return n.opts.ref;
        },
        loop: !0,
        get trapFocus() {
          return y();
        },
        get enabled() {
          return n.root.opts.open.current;
        },
        get onOpenAutoFocus() {
          return s();
        },
        get onCloseAutoFocus() {
          return P();
        },
        focusScope: (se, J) => {
          let Y = () => J?.().props;
          Lt(se, Ee(() => i(d), {
            get enabled() {
              return n.root.opts.open.current;
            },
            get ref() {
              return n.opts.ref;
            },
            onEscapeKeydown: (D) => {
              O()(D), !D.defaultPrevented && n.root.handleClose();
            },
            children: (D, ce) => {
              Ct(D, Ee(() => i(d), {
                get ref() {
                  return n.opts.ref;
                },
                get enabled() {
                  return n.root.opts.open.current;
                },
                onInteractOutside: (S) => {
                  _()(S), !S.defaultPrevented && n.root.handleClose();
                },
                children: (S, ge) => {
                  Ot(S, Ee(() => i(d), {
                    get ref() {
                      return n.opts.ref;
                    },
                    get enabled() {
                      return n.root.opts.open.current;
                    },
                    children: (fe, Ie) => {
                      var ie = I(), pe = h(ie);
                      {
                        var Fe = (R) => {
                          var B = Rt(), V = h(B);
                          {
                            var Q = (j) => {
                              Ue(j, {
                                get preventScroll() {
                                  return b();
                                },
                                get restoreScrollDelay() {
                                  return w();
                                }
                              });
                            };
                            E(V, (j) => {
                              n.root.opts.open.current && j(Q);
                            });
                          }
                          var e = L(V, 2);
                          {
                            let j = m(() => ({
                              props: me(i(d), Y()),
                              ...n.snippetProps
                            }));
                            W(e, c, () => i(j));
                          }
                          l(R, B);
                        }, Le = (R) => {
                          var B = Vt(), V = h(B);
                          Ue(V, {
                            get preventScroll() {
                              return b();
                            }
                          });
                          var Q = L(V, 2);
                          Xe(Q, (j) => ({ ...j }), [() => me(i(d), Y())]);
                          var e = G(Q);
                          W(e, () => u() ?? re), k(Q), l(R, B);
                        };
                        E(pe, (R) => {
                          c() ? R(Fe) : R(Le, -1);
                        });
                      }
                      l(fe, ie);
                    },
                    $$slots: { default: !0 }
                  }));
                },
                $$slots: { default: !0 }
              }));
            },
            $$slots: { default: !0 }
          }));
        },
        $$slots: { focusScope: !0 }
      });
    };
    E(le, (r) => {
      (n.shouldRender || v()) && r(M);
    });
  }
  return l(K, Z), _e(A);
}
ye(
  $e,
  {
    id: {},
    children: {},
    child: {},
    ref: {},
    forceMount: {},
    onCloseAutoFocus: {},
    onOpenAutoFocus: {},
    onEscapeKeydown: {},
    onInteractOutside: {},
    trapFocus: {},
    preventScroll: {},
    restoreScrollDelay: {}
  },
  [],
  [],
  { mode: "open" }
);
var Tt = C('<span class="svg-icon"></span>'), Wt = C('<span class="svg-icon"></span>'), Bt = C('<span class="svg-icon"></span>'), Qt = C('<span class="svg-icon"></span>'), Ut = C('<div class="dialog-pagination svelte-1jiham3"><div class="dialog-page-button-group svelte-1jiham3"><!> <!></div> <div class="dialog-page-center svelte-1jiham3"><div class="dialog-page-indicator svelte-1jiham3"> </div> <!></div> <div class="dialog-page-button-group svelte-1jiham3"><!> <!></div></div>'), qt = C("<div><!></div>"), Ht = C('<!> <!> <div class="dialog-content svelte-1jiham3"><!></div> <!>', 1), Xt = C("<!> <!>", 1);
const Zt = {
  hash: "svelte-1jiham3",
  code: `
    /* ダイアログ共通スタイル */.dialog-overlay {position:fixed;inset:0;background-color:var(--dialog-bg-overlay);z-index:calc(100 + var(--bits-dialog-depth, 0) * 2);}.dialog {position:fixed;top:50%;left:50%;translate:-50% -50%;background:var(--dialog-bg);color:var(--text);width:100%;max-width:600px;display:flex;flex-direction:column;align-items:center;z-index:calc(101 + var(--bits-dialog-depth, 0) * 2);}.dialog-overlay.dialog-container-layout {position:absolute;}.dialog.dialog-container-layout {position:absolute;max-height:100%;}.dialog:focus {outline:none;}.dialog-content.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;width:100%;max-height:85svh;padding:16px;overflow-y:auto;}.dialog.dialog-container-layout .dialog-content.svelte-1jiham3 {max-height:calc(100% - 50px);}.dialog-footer.svelte-1jiham3 {width:100%;box-sizing:content-box;display:flex;flex-direction:column;justify-content:center;align-items:center;}.dialog-pagination.svelte-1jiham3 {display:flex;align-items:stretch;justify-content:space-between;gap:8px;width:100%;padding:6px;border-top:1px solid var(--border-hr);}.dialog-page-button-group.svelte-1jiham3 {display:flex;align-items:stretch;gap:4px;flex:1 0 auto;.dialog-page-icon-button {width:44px;}.dialog-page-button {--icon-size: 32px;min-width:44px;height:auto;min-height:44px;flex:1 0 auto;}}.dialog-page-center.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;flex:1 0 auto;}.dialog-page-indicator.svelte-1jiham3 {min-width:0;color:var(--text-muted);font-size:0.82rem;text-align:center;white-space:nowrap;}.dialog-page-first-button .svg-icon {mask-image:var(--ehagaki-icon-66697273745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-previous-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-next-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-last-button .svg-icon {mask-image:var(--ehagaki-icon-6c6173745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-loading-placeholder {color:var(--text);column-gap:2px;}.dialog-page-loading-placeholder .placeholder-text {color:inherit;font-size:1rem;}.dialog-page-loading-placeholder .loader-container .square {background-color:currentColor;}

    /* 閉じるボタン付きフッター用スタイル */.dialog-footer.close-button-footer.svelte-1jiham3 {border-top:1px solid var(--border-hr);.modal-close {--btn-bg: var(--dialog-bg);border:none;border-radius:0;width:100%;height:50px;}}.dialog-footer.close-button-footer.has-pagination.svelte-1jiham3 {border-top:none;.modal-close {--icon-size: 20px;border:1px solid var(--btn-border);border-radius:50px;width:100%;min-width:72px;min-height:44px;}}.modal-close:active:not(:disabled) {scale:1;}.visually-hidden {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;}`
};
function Jt(K, t) {
  Pe(t, !0), wt(K, Zt);
  let g = a(t, "open", 15, !1), f = a(t, "onOpenChange", 7), u = a(t, "onInteractOutside", 7, void 0), c = a(t, "onEscapeKeydown", 7, void 0), p = a(t, "trapFocus", 7, !0), v = a(t, "title", 7), P = a(t, "description", 7), s = a(t, "contentClass", 7, ""), O = a(t, "footerVariant", 7, "default"), _ = a(t, "showPagination", 7, !1), y = a(t, "paginationLabel", 7, ""), b = a(t, "firstPageLabel", 7, ""), w = a(t, "previousPageLabel", 7, ""), z = a(t, "nextPageLabel", 7, ""), n = a(t, "lastPageLabel", 7, ""), d = a(t, "canGoFirst", 7, !1), A = a(t, "canGoPrevious", 7, !1), Z = a(t, "canGoNext", 7, !1), le = a(t, "canGoLast", 7, !1), M = a(t, "nextPageLoading", 7, !1), r = a(t, "onFirstPage", 7), ue = a(t, "onPreviousPage", 7), se = a(t, "onNextPage", 7), J = a(t, "onLastPage", 7), Y = a(t, "initialFocus", 7, "default"), D = a(t, "onOpenAutoFocus", 7, void 0), ce = a(t, "children", 7), S = a(t, "footer", 7), ge = Kt(null);
  const fe = Nt(), Ie = fe.overlayTarget, ie = fe.layoutMode === "container";
  let pe = m(() => Y() === "content");
  function Fe(e) {
    e || f()?.(!1);
  }
  function Le(e) {
    if (D()) {
      D()(e);
      return;
    }
    i(pe) && (e.preventDefault(), i(ge)?.focus({ preventScroll: !0 }));
  }
  function R(e) {
    e.preventDefault();
  }
  var B = {
    get open() {
      return g();
    },
    set open(e = !1) {
      g(e), o();
    },
    get onOpenChange() {
      return f();
    },
    set onOpenChange(e) {
      f(e), o();
    },
    get onInteractOutside() {
      return u();
    },
    set onInteractOutside(e = void 0) {
      u(e), o();
    },
    get onEscapeKeydown() {
      return c();
    },
    set onEscapeKeydown(e = void 0) {
      c(e), o();
    },
    get trapFocus() {
      return p();
    },
    set trapFocus(e = !0) {
      p(e), o();
    },
    get title() {
      return v();
    },
    set title(e) {
      v(e), o();
    },
    get description() {
      return P();
    },
    set description(e) {
      P(e), o();
    },
    get contentClass() {
      return s();
    },
    set contentClass(e = "") {
      s(e), o();
    },
    get footerVariant() {
      return O();
    },
    set footerVariant(e = "default") {
      O(e), o();
    },
    get showPagination() {
      return _();
    },
    set showPagination(e = !1) {
      _(e), o();
    },
    get paginationLabel() {
      return y();
    },
    set paginationLabel(e = "") {
      y(e), o();
    },
    get firstPageLabel() {
      return b();
    },
    set firstPageLabel(e = "") {
      b(e), o();
    },
    get previousPageLabel() {
      return w();
    },
    set previousPageLabel(e = "") {
      w(e), o();
    },
    get nextPageLabel() {
      return z();
    },
    set nextPageLabel(e = "") {
      z(e), o();
    },
    get lastPageLabel() {
      return n();
    },
    set lastPageLabel(e = "") {
      n(e), o();
    },
    get canGoFirst() {
      return d();
    },
    set canGoFirst(e = !1) {
      d(e), o();
    },
    get canGoPrevious() {
      return A();
    },
    set canGoPrevious(e = !1) {
      A(e), o();
    },
    get canGoNext() {
      return Z();
    },
    set canGoNext(e = !1) {
      Z(e), o();
    },
    get canGoLast() {
      return le();
    },
    set canGoLast(e = !1) {
      le(e), o();
    },
    get nextPageLoading() {
      return M();
    },
    set nextPageLoading(e = !1) {
      M(e), o();
    },
    get onFirstPage() {
      return r();
    },
    set onFirstPage(e) {
      r(e), o();
    },
    get onPreviousPage() {
      return ue();
    },
    set onPreviousPage(e) {
      ue(e), o();
    },
    get onNextPage() {
      return se();
    },
    set onNextPage(e) {
      se(e), o();
    },
    get onLastPage() {
      return J();
    },
    set onLastPage(e) {
      J(e), o();
    },
    get initialFocus() {
      return Y();
    },
    set initialFocus(e = "default") {
      Y(e), o();
    },
    get onOpenAutoFocus() {
      return D();
    },
    set onOpenAutoFocus(e = void 0) {
      D(e), o();
    },
    get children() {
      return ce();
    },
    set children(e) {
      ce(e), o();
    },
    get footer() {
      return S();
    },
    set footer(e) {
      S(e), o();
    }
  }, V = I(), Q = h(V);
  return ne(Q, () => Ye, (e, j) => {
    j(e, {
      onOpenChange: Fe,
      get open() {
        return g();
      },
      set open(Ce) {
        g(Ce);
      },
      children: (Ce, Yt) => {
        var Ke = I(), et = h(Ke);
        ne(et, () => St, (tt, at) => {
          at(tt, {
            get to() {
              return Ie;
            },
            children: (ot, $t) => {
              var ze = Xt(), Me = h(ze);
              {
                let Oe = m(() => `dialog-overlay ${ie ? "dialog-container-layout" : ""}`);
                ne(Me, () => At, (we, Se) => {
                  Se(we, {
                    get class() {
                      return i(Oe);
                    }
                  });
                });
              }
              var nt = L(Me, 2);
              {
                let Oe = m(() => `dialog ${s()} ${ie ? "dialog-container-layout" : ""}`), we = m(() => i(pe) ? -1 : void 0);
                ne(nt, () => $e, (Se, rt) => {
                  rt(Se, {
                    get class() {
                      return i(Oe);
                    },
                    get tabindex() {
                      return i(we);
                    },
                    get trapFocus() {
                      return p();
                    },
                    preventScroll: !1,
                    get onInteractOutside() {
                      return u();
                    },
                    get onEscapeKeydown() {
                      return c();
                    },
                    onOpenAutoFocus: Le,
                    onCloseAutoFocus: R,
                    get ref() {
                      return i(ge);
                    },
                    set ref(Ae) {
                      It(ge, Ae, !0);
                    },
                    children: (Ae, ea) => {
                      var Re = Ht(), Ve = h(Re);
                      ne(Ve, () => Dt, (U, T) => {
                        T(U, {
                          class: "visually-hidden",
                          children: ($, je) => {
                            He();
                            var q = qe();
                            be(() => Ne(q, v())), l($, q);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                      var Te = L(Ve, 2);
                      ne(Te, () => jt, (U, T) => {
                        T(U, {
                          class: "visually-hidden",
                          children: ($, je) => {
                            He();
                            var q = qe();
                            be(() => Ne(q, P())), l($, q);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                      var De = L(Te, 2), lt = G(De);
                      W(lt, () => ce() ?? re), k(De);
                      var st = L(De, 2);
                      {
                        var it = (U) => {
                          var T = qt();
                          let $;
                          var je = G(T);
                          {
                            var q = (ee) => {
                              var H = Ut(), de = G(H), We = G(de);
                              {
                                var ut = (F) => {
                                  {
                                    let X = m(() => !d());
                                    he(F, {
                                      className: "dialog-page-button dialog-page-icon-button dialog-page-first-button",
                                      variant: "default",
                                      shape: "pill",
                                      contentLayout: "icon",
                                      get disabled() {
                                        return i(X);
                                      },
                                      get ariaLabel() {
                                        return b();
                                      },
                                      get title() {
                                        return b();
                                      },
                                      get onClick() {
                                        return r();
                                      },
                                      children: (te, ve) => {
                                        var ae = Tt();
                                        l(te, ae);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }
                                };
                                E(We, (F) => {
                                  (b() || r()) && F(ut);
                                });
                              }
                              var ct = L(We, 2);
                              {
                                let F = m(() => !A());
                                he(ct, {
                                  className: "dialog-page-button dialog-page-icon-button dialog-page-previous-button",
                                  variant: "default",
                                  shape: "pill",
                                  contentLayout: "icon",
                                  get disabled() {
                                    return i(F);
                                  },
                                  get ariaLabel() {
                                    return w();
                                  },
                                  get title() {
                                    return w();
                                  },
                                  get onClick() {
                                    return ue();
                                  },
                                  children: (X, te) => {
                                    var ve = Wt();
                                    l(X, ve);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }
                              k(de);
                              var Ge = L(de, 2), ke = G(Ge), gt = G(ke, !0);
                              k(ke);
                              var ft = L(ke, 2);
                              W(ft, () => S() ?? re), k(Ge);
                              var Be = L(Ge, 2), Qe = G(Be);
                              {
                                let F = m(() => `dialog-page-button dialog-page-icon-button dialog-page-next-button ${M() ? "loading" : ""}`), X = m(() => !Z() || M());
                                he(Qe, {
                                  get className() {
                                    return i(F);
                                  },
                                  variant: "default",
                                  shape: "pill",
                                  contentLayout: "icon",
                                  get disabled() {
                                    return i(X);
                                  },
                                  get ariaLabel() {
                                    return z();
                                  },
                                  get title() {
                                    return z();
                                  },
                                  get onClick() {
                                    return se();
                                  },
                                  children: (te, ve) => {
                                    var ae = I(), ht = h(ae);
                                    {
                                      var bt = (oe) => {
                                        kt(oe, {
                                          showLoader: !0,
                                          loaderSize: 30,
                                          state: "loading",
                                          customClass: "dialog-page-loading-placeholder"
                                        });
                                      }, mt = (oe) => {
                                        var xt = Bt();
                                        l(oe, xt);
                                      };
                                      E(ht, (oe) => {
                                        M() ? oe(bt) : oe(mt, -1);
                                      });
                                    }
                                    l(te, ae);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }
                              var pt = L(Qe, 2);
                              {
                                var vt = (F) => {
                                  {
                                    let X = m(() => !le() || M());
                                    he(F, {
                                      className: "dialog-page-button dialog-page-icon-button dialog-page-last-button",
                                      variant: "default",
                                      shape: "pill",
                                      contentLayout: "icon",
                                      get disabled() {
                                        return i(X);
                                      },
                                      get ariaLabel() {
                                        return n();
                                      },
                                      get title() {
                                        return n();
                                      },
                                      get onClick() {
                                        return J();
                                      },
                                      children: (te, ve) => {
                                        var ae = Qt();
                                        l(te, ae);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }
                                };
                                E(pt, (F) => {
                                  (n() || J()) && F(vt);
                                });
                              }
                              k(Be), k(H), be(() => {
                                Et(H, "aria-label", y()), Ne(gt, y());
                              }), l(ee, H);
                            }, dt = (ee) => {
                              var H = I(), de = h(H);
                              W(de, () => S() ?? re), l(ee, H);
                            };
                            E(je, (ee) => {
                              _() ? ee(q) : ee(dt, -1);
                            });
                          }
                          k(T), be(() => $ = Gt(T, 1, "dialog-footer svelte-1jiham3", null, $, {
                            "close-button-footer": O() === "close-button",
                            "has-pagination": _()
                          })), l(U, T);
                        };
                        E(st, (U) => {
                          (S() || _()) && U(it);
                        });
                      }
                      l(Ae, Re);
                    },
                    $$slots: { default: !0 }
                  });
                });
              }
              l(ot, ze);
            },
            $$slots: { default: !0 }
          });
        }), l(Ce, Ke);
      },
      $$slots: { default: !0 }
    });
  }), l(K, V), _e(B);
}
ye(
  Jt,
  {
    open: {},
    onOpenChange: {},
    onInteractOutside: {},
    onEscapeKeydown: {},
    trapFocus: {},
    title: {},
    description: {},
    contentClass: {},
    footerVariant: {},
    showPagination: {},
    paginationLabel: {},
    firstPageLabel: {},
    previousPageLabel: {},
    nextPageLabel: {},
    lastPageLabel: {},
    canGoFirst: {},
    canGoPrevious: {},
    canGoNext: {},
    canGoLast: {},
    nextPageLoading: {},
    onFirstPage: {},
    onPreviousPage: {},
    onNextPage: {},
    onLastPage: {},
    initialFocus: {},
    onOpenAutoFocus: {},
    children: {},
    footer: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  Jt as D,
  Mt as a
};
