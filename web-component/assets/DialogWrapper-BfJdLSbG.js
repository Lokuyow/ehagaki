import { I as a, dZ as Pt, aO as I, aR as Z, aP as x, d_ as _t, K as E, aQ as xe, aS as Ue, aT as me, aU as Je, d$ as yt, e0 as Ft, e1 as Lt, b1 as Ee, e2 as Ct, e3 as Ot, e4 as We, H as wt, a_ as ne, b$ as St, e5 as At, e6 as Dt, e7 as Gt, M as jt, aZ as he, S as kt, N as Et } from "./App-BnEIDDep.js";
import { a_ as Pe, a$ as N, b0 as h, b1 as l, b2 as _e, b3 as o, n as re, b4 as ye, b5 as Xe, a as i, b6 as j, b7 as k, aP as m, b8 as C, bd as L, bi as It, bf as qe, Z as be, b as Nt, aQ as Kt, bg as Ie, bh as He } from "./entry-YqIkvCgN.js";
function Ye(K, t) {
  Pe(t, !0);
  let g = a(t, "open", 15, !1), f = a(t, "onOpenChange", 7, x), u = a(t, "onOpenChangeComplete", 7, x), c = a(t, "children", 7);
  Pt.create({
    variant: I(() => "dialog"),
    open: I(() => g(), (s) => {
      g(s), f()(s);
    }),
    onOpenChangeComplete: I(() => u())
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
  }, v = N(), P = h(v);
  return Z(P, () => c() ?? re), l(K, v), _e(p);
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
  const g = Xe();
  Pe(t, !0);
  let f = a(t, "children", 7), u = a(t, "child", 7), c = a(t, "id", 23, () => xe(g)), p = a(t, "ref", 15, null), v = a(t, "disabled", 7, !1), P = Je(t, [
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
    variant: I(() => "close"),
    id: I(() => c()),
    ref: I(() => p(), (n) => p(n)),
    disabled: I(() => !!v())
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
  }, y = N(), b = h(y);
  {
    var w = (n) => {
      var d = N(), A = h(d);
      Z(A, u, () => ({ props: i(O) })), l(n, d);
    }, z = (n) => {
      var d = zt();
      Ue(d, () => ({ ...i(O) }));
      var A = j(d);
      Z(A, () => f() ?? re), k(d), l(n, d);
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
  const g = Xe();
  Pe(t, !0);
  let f = a(t, "id", 23, () => xe(g)), u = a(t, "children", 7), c = a(t, "child", 7), p = a(t, "ref", 15, null), v = a(t, "forceMount", 7, !1), P = a(t, "onCloseAutoFocus", 7, x), s = a(t, "onOpenAutoFocus", 7, x), O = a(t, "onEscapeKeydown", 7, x), _ = a(t, "onInteractOutside", 7, x), y = a(t, "trapFocus", 7, !0), b = a(t, "preventScroll", 7, !0), w = a(t, "restoreScrollDelay", 7, null), z = Je(t, [
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
    id: I(() => f()),
    ref: I(() => p(), (r) => p(r))
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
  }, J = N(), le = h(J);
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
        focusScope: (se, X) => {
          let Y = () => X?.().props;
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
                    children: (fe, Ne) => {
                      var ie = N(), pe = h(ie);
                      {
                        var Fe = (R) => {
                          var B = Rt(), V = h(B);
                          {
                            var Q = (G) => {
                              We(G, {
                                get preventScroll() {
                                  return b();
                                },
                                get restoreScrollDelay() {
                                  return w();
                                }
                              });
                            };
                            E(V, (G) => {
                              n.root.opts.open.current && G(Q);
                            });
                          }
                          var e = L(V, 2);
                          {
                            let G = m(() => ({
                              props: me(i(d), Y()),
                              ...n.snippetProps
                            }));
                            Z(e, c, () => i(G));
                          }
                          l(R, B);
                        }, Le = (R) => {
                          var B = Vt(), V = h(B);
                          We(V, {
                            get preventScroll() {
                              return b();
                            }
                          });
                          var Q = L(V, 2);
                          Ue(Q, (G) => ({ ...G }), [() => me(i(d), Y())]);
                          var e = j(Q);
                          Z(e, () => u() ?? re), k(Q), l(R, B);
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
  return l(K, J), _e(A);
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
var Tt = C('<span class="svg-icon"></span>'), Zt = C('<span class="svg-icon"></span>'), Bt = C('<span class="svg-icon"></span>'), Qt = C('<span class="svg-icon"></span>'), Wt = C('<div class="dialog-pagination svelte-1jiham3"><div class="dialog-page-button-group svelte-1jiham3"><!> <!></div> <div class="dialog-page-center svelte-1jiham3"><div class="dialog-page-indicator svelte-1jiham3"> </div> <!></div> <div class="dialog-page-button-group svelte-1jiham3"><!> <!></div></div>'), qt = C("<div><!></div>"), Ht = C('<!> <!> <div class="dialog-content svelte-1jiham3"><!></div> <!>', 1), Ut = C("<!> <!>", 1);
const Jt = {
  hash: "svelte-1jiham3",
  code: `
    /* ダイアログ共通スタイル */.dialog-overlay {position:fixed;inset:0;background-color:var(--dialog-bg-overlay);z-index:calc(100 + var(--bits-dialog-depth, 0) * 2);}.dialog {position:fixed;top:50%;left:50%;translate:-50% -50%;background:var(--dialog-bg);color:var(--text);width:100%;max-width:600px;display:flex;flex-direction:column;align-items:center;z-index:calc(101 + var(--bits-dialog-depth, 0) * 2);}.dialog-overlay.dialog-container-layout {position:absolute;}.dialog.dialog-container-layout {position:absolute;max-height:100%;}.dialog:focus {outline:none;}.dialog-content.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;width:100%;max-height:85svh;padding:16px;overflow-y:auto;}.dialog.dialog-container-layout .dialog-content.svelte-1jiham3 {max-height:calc(100% - 50px);}.dialog-footer.svelte-1jiham3 {width:100%;box-sizing:content-box;display:flex;flex-direction:column;justify-content:center;align-items:center;}.dialog-pagination.svelte-1jiham3 {display:flex;align-items:stretch;justify-content:space-between;gap:8px;width:100%;padding:6px;border-top:1px solid var(--border-hr);}.dialog-page-button-group.svelte-1jiham3 {display:flex;align-items:stretch;gap:4px;flex:1 0 auto;.dialog-page-icon-button {width:44px;}.dialog-page-button {--icon-size: 32px;min-width:44px;height:auto;min-height:44px;flex:1 0 auto;}}.dialog-page-center.svelte-1jiham3 {display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;flex:1 0 auto;}.dialog-page-indicator.svelte-1jiham3 {min-width:0;color:var(--text-muted);font-size:0.82rem;text-align:center;white-space:nowrap;}.dialog-page-first-button .svg-icon {mask-image:var(--ehagaki-icon-66697273745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-previous-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-next-button .svg-icon {mask-image:var(--ehagaki-icon-6b6579626f6172645f6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-last-button .svg-icon {mask-image:var(--ehagaki-icon-6c6173745f706167655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.dialog-page-loading-placeholder {color:var(--text);column-gap:2px;}.dialog-page-loading-placeholder .placeholder-text {color:inherit;font-size:1rem;}.dialog-page-loading-placeholder .loader-container .square {background-color:currentColor;}

    /* 閉じるボタン付きフッター用スタイル */.dialog-footer.close-button-footer.svelte-1jiham3 {border-top:1px solid var(--border-hr);.modal-close {--btn-bg: var(--dialog-bg);border:none;border-radius:0;width:100%;height:50px;}}.dialog-footer.close-button-footer.has-pagination.svelte-1jiham3 {border-top:none;.modal-close {--icon-size: 20px;border:1px solid var(--btn-border);border-radius:50px;width:100%;min-width:72px;min-height:44px;}}.modal-close:active:not(:disabled) {scale:1;}.visually-hidden {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0;}`
};
function Xt(K, t) {
  Pe(t, !0), wt(K, Jt);
  let g = a(t, "open", 15, !1), f = a(t, "onOpenChange", 7), u = a(t, "onInteractOutside", 7, void 0), c = a(t, "onEscapeKeydown", 7, void 0), p = a(t, "trapFocus", 7, !0), v = a(t, "title", 7), P = a(t, "description", 7), s = a(t, "contentClass", 7, ""), O = a(t, "footerVariant", 7, "default"), _ = a(t, "showPagination", 7, !1), y = a(t, "paginationLabel", 7, ""), b = a(t, "firstPageLabel", 7, ""), w = a(t, "previousPageLabel", 7, ""), z = a(t, "nextPageLabel", 7, ""), n = a(t, "lastPageLabel", 7, ""), d = a(t, "canGoFirst", 7, !1), A = a(t, "canGoPrevious", 7, !1), J = a(t, "canGoNext", 7, !1), le = a(t, "canGoLast", 7, !1), M = a(t, "nextPageLoading", 7, !1), r = a(t, "onFirstPage", 7), ue = a(t, "onPreviousPage", 7), se = a(t, "onNextPage", 7), X = a(t, "onLastPage", 7), Y = a(t, "initialFocus", 7, "default"), D = a(t, "onOpenAutoFocus", 7, void 0), ce = a(t, "children", 7), S = a(t, "footer", 7), ge = Kt(null);
  const fe = It(), Ne = fe.overlayTarget, ie = fe.layoutMode === "container";
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
      return J();
    },
    set canGoNext(e = !1) {
      J(e), o();
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
      return X();
    },
    set onLastPage(e) {
      X(e), o();
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
  }, V = N(), Q = h(V);
  return ne(Q, () => Ye, (e, G) => {
    G(e, {
      onOpenChange: Fe,
      get open() {
        return g();
      },
      set open(Ce) {
        g(Ce);
      },
      children: (Ce, Yt) => {
        var Ke = N(), et = h(Ke);
        ne(et, () => St, (tt, at) => {
          at(tt, {
            get to() {
              return Ne;
            },
            children: (ot, $t) => {
              var ze = Ut(), Me = h(ze);
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
                      Nt(ge, Ae, !0);
                    },
                    children: (Ae, ea) => {
                      var Re = Ht(), Ve = h(Re);
                      ne(Ve, () => Dt, (W, T) => {
                        T(W, {
                          class: "visually-hidden",
                          children: ($, Ge) => {
                            He();
                            var q = qe();
                            be(() => Ie(q, v())), l($, q);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                      var Te = L(Ve, 2);
                      ne(Te, () => Gt, (W, T) => {
                        T(W, {
                          class: "visually-hidden",
                          children: ($, Ge) => {
                            He();
                            var q = qe();
                            be(() => Ie(q, P())), l($, q);
                          },
                          $$slots: { default: !0 }
                        });
                      });
                      var De = L(Te, 2), lt = j(De);
                      Z(lt, () => ce() ?? re), k(De);
                      var st = L(De, 2);
                      {
                        var it = (W) => {
                          var T = qt();
                          let $;
                          var Ge = j(T);
                          {
                            var q = (ee) => {
                              var H = Wt(), de = j(H), Ze = j(de);
                              {
                                var ut = (F) => {
                                  {
                                    let U = m(() => !d());
                                    he(F, {
                                      className: "dialog-page-button dialog-page-icon-button dialog-page-first-button",
                                      variant: "default",
                                      shape: "pill",
                                      contentLayout: "icon",
                                      get disabled() {
                                        return i(U);
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
                                E(Ze, (F) => {
                                  (b() || r()) && F(ut);
                                });
                              }
                              var ct = L(Ze, 2);
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
                                  children: (U, te) => {
                                    var ve = Zt();
                                    l(U, ve);
                                  },
                                  $$slots: { default: !0 }
                                });
                              }
                              k(de);
                              var je = L(de, 2), ke = j(je), gt = j(ke, !0);
                              k(ke);
                              var ft = L(ke, 2);
                              Z(ft, () => S() ?? re), k(je);
                              var Be = L(je, 2), Qe = j(Be);
                              {
                                let F = m(() => `dialog-page-button dialog-page-icon-button dialog-page-next-button ${M() ? "loading" : ""}`), U = m(() => !J() || M());
                                he(Qe, {
                                  get className() {
                                    return i(F);
                                  },
                                  variant: "default",
                                  shape: "pill",
                                  contentLayout: "icon",
                                  get disabled() {
                                    return i(U);
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
                                    var ae = N(), ht = h(ae);
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
                                    let U = m(() => !le() || M());
                                    he(F, {
                                      className: "dialog-page-button dialog-page-icon-button dialog-page-last-button",
                                      variant: "default",
                                      shape: "pill",
                                      contentLayout: "icon",
                                      get disabled() {
                                        return i(U);
                                      },
                                      get ariaLabel() {
                                        return n();
                                      },
                                      get title() {
                                        return n();
                                      },
                                      get onClick() {
                                        return X();
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
                                  (n() || X()) && F(vt);
                                });
                              }
                              k(Be), k(H), be(() => {
                                Et(H, "aria-label", y()), Ie(gt, y());
                              }), l(ee, H);
                            }, dt = (ee) => {
                              var H = N(), de = h(H);
                              Z(de, () => S() ?? re), l(ee, H);
                            };
                            E(Ge, (ee) => {
                              _() ? ee(q) : ee(dt, -1);
                            });
                          }
                          k(T), be(() => $ = jt(T, 1, "dialog-footer svelte-1jiham3", null, $, {
                            "close-button-footer": O() === "close-button",
                            "has-pagination": _()
                          })), l(W, T);
                        };
                        E(st, (W) => {
                          (S() || _()) && W(it);
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
  Xt,
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
  Xt as D,
  Mt as a
};
