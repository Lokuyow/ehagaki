import { I as l, aR as Y, e5 as Rr, aP as I, K as se, aS as X, aT as Ge, aU as qe, aV as We, e6 as Hr, e7 as zr, aE as Or, aF as Zt, aN as Tr, aK as Ur, aG as Nr, aO as Dr, H as Fr, e8 as Ar, ai as Kr, e9 as Wt, a_ as C, L as Vr, Q as Br, ea as Gr, eb as wt, ec as qr, ed as Wr, ee as Jr, ef as Yr, eg as Zr, b6 as q, S as Qr, W as xt, eh as kt, N as R, ei as jt, O as Ae, ej as we, ek as Xr, el as Ke, V as eo, $ as to, em as ro, en as oo, eo as ao, ep as io, eq as so, er as no, es as lo } from "./App-CBRbsegU.js";
import { a9 as co, u as Qt, b7 as Je, b0 as xe, b1 as y, b2 as p, b3 as n, b4 as ke, b5 as d, a as e, b8 as T, n as at, b9 as M, b6 as je, aR as i, ba as w, b as $, aN as Ve, aS as ie, aJ as uo, Z as ve, ap as Jt, aQ as mo, bf as W, bh as vo, bi as Et, bC as Ct, aq as ho, bj as go, bg as $t } from "./entry-wxgtzGEF.js";
import { b as fo } from "./input-BDR009Ra.js";
class Mt {
  /** */
  #e = /* @__PURE__ */ new WeakMap();
  /** @type {ResizeObserver | undefined} */
  #t;
  /** @type {ResizeObserverOptions} */
  #r;
  /** @static */
  static entries = /* @__PURE__ */ new WeakMap();
  /** @param {ResizeObserverOptions} options */
  constructor(t) {
    this.#r = t;
  }
  /**
   * @param {Element} element
   * @param {(entry: ResizeObserverEntry) => any} listener
   */
  observe(t, s) {
    var c = this.#e.get(t) || /* @__PURE__ */ new Set();
    return c.add(s), this.#e.set(t, c), this.#o().observe(t, this.#r), () => {
      var h = this.#e.get(t);
      h.delete(s), h.size === 0 && (this.#e.delete(t), this.#t.unobserve(t));
    };
  }
  #o() {
    return this.#t ?? (this.#t = new ResizeObserver(
      /** @param {any} entries */
      (t) => {
        for (var s of t) {
          Mt.entries.set(s.target, s);
          for (var c of this.#e.get(s.target) || [])
            c(s);
        }
      }
    ));
  }
}
var po = /* @__PURE__ */ new Mt({
  box: "border-box"
});
function Yt(S, t, s) {
  var c = po.observe(S, () => s(S[t]));
  co(() => (Qt(() => s(S[t])), c));
}
var bo = w("<div><!></div>");
function Xt(S, t) {
  const s = Je();
  xe(t, !0);
  let c = l(t, "id", 23, () => Y(s)), h = l(t, "ref", 15, null), g = l(t, "children", 7), f = l(t, "child", 7), v = l(t, "forceMount", 7, !1), _ = We(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "ref",
    "children",
    "child",
    "forceMount"
  ]);
  const x = Rr.create({
    id: I(() => c()),
    ref: I(() => h(), (m) => h(m)),
    forceMount: I(() => v())
  }), b = i(() => qe(x.props, _));
  var P = {
    get id() {
      return c();
    },
    set id(m = Y(s)) {
      c(m), d();
    },
    get ref() {
      return h();
    },
    set ref(m = null) {
      h(m), d();
    },
    get children() {
      return g();
    },
    set children(m) {
      g(m), d();
    },
    get child() {
      return f();
    },
    set child(m) {
      f(m), d();
    },
    get forceMount() {
      return v();
    },
    set forceMount(m = !1) {
      v(m), d();
    }
  }, k = y(), H = p(k);
  {
    var U = (m) => {
      var a = y(), r = p(a);
      {
        var u = (F) => {
          var A = y(), ee = p(A);
          X(ee, f, () => ({ props: e(b) })), n(F, A);
        }, L = (F) => {
          var A = bo();
          Ge(A, () => ({ ...e(b) }));
          var ee = T(A);
          X(ee, () => g() ?? at), M(A), n(F, A);
        };
        se(r, (F) => {
          f() ? F(u) : F(L, -1);
        });
      }
      n(m, a);
    };
    se(H, (m) => {
      x.shouldRender && m(U);
    });
  }
  return n(S, k), ke(P);
}
je(Xt, { id: {}, ref: {}, children: {}, child: {}, forceMount: {} }, [], [], { mode: "open" });
var _o = w("<input/>");
function er(S, t) {
  const s = Je();
  xe(t, !0);
  let c = l(t, "value", 15, ""), h = l(t, "autofocus", 7, !1), g = l(t, "id", 23, () => Y(s)), f = l(t, "ref", 15, null), v = l(t, "child", 7), _ = We(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "value",
    "autofocus",
    "id",
    "ref",
    "child"
  ]);
  const x = Hr.create({
    id: I(() => g()),
    ref: I(() => f(), (a) => f(a)),
    value: I(() => c(), (a) => {
      c(a);
    }),
    autofocus: I(() => h() ?? !1)
  }), b = i(() => qe(_, x.props));
  var P = {
    get value() {
      return c();
    },
    set value(a = "") {
      c(a), d();
    },
    get autofocus() {
      return h();
    },
    set autofocus(a = !1) {
      h(a), d();
    },
    get id() {
      return g();
    },
    set id(a = Y(s)) {
      g(a), d();
    },
    get ref() {
      return f();
    },
    set ref(a = null) {
      f(a), d();
    },
    get child() {
      return v();
    },
    set child(a) {
      v(a), d();
    }
  }, k = y(), H = p(k);
  {
    var U = (a) => {
      var r = y(), u = p(r);
      X(u, v, () => ({ props: e(b) })), n(a, r);
    }, m = (a) => {
      var r = _o();
      Ge(r, () => ({ ...e(b) }), void 0, void 0, void 0, void 0, !0), fo(r, c), n(a, r);
    };
    se(H, (a) => {
      v() ? a(U) : a(m, -1);
    });
  }
  return n(S, k), ke(P);
}
je(er, { value: {}, autofocus: {}, id: {}, ref: {}, child: {} }, [], [], { mode: "open" });
var yo = w("<div><!></div>");
function tr(S, t) {
  const s = Je();
  xe(t, !0);
  let c = l(t, "progress", 7, 0), h = l(t, "id", 23, () => Y(s)), g = l(t, "ref", 15, null), f = l(t, "children", 7), v = l(t, "child", 7), _ = We(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "progress",
    "id",
    "ref",
    "children",
    "child"
  ]);
  const x = zr.create({
    id: I(() => h()),
    ref: I(() => g(), (a) => g(a)),
    progress: I(() => c())
  }), b = i(() => qe(_, x.props));
  var P = {
    get progress() {
      return c();
    },
    set progress(a = 0) {
      c(a), d();
    },
    get id() {
      return h();
    },
    set id(a = Y(s)) {
      h(a), d();
    },
    get ref() {
      return g();
    },
    set ref(a = null) {
      g(a), d();
    },
    get children() {
      return f();
    },
    set children(a) {
      f(a), d();
    },
    get child() {
      return v();
    },
    set child(a) {
      v(a), d();
    }
  }, k = y(), H = p(k);
  {
    var U = (a) => {
      var r = y(), u = p(r);
      X(u, v, () => ({ props: e(b) })), n(a, r);
    }, m = (a) => {
      var r = yo();
      Ge(r, () => ({ ...e(b) }));
      var u = T(r);
      X(u, () => f() ?? at), M(r), n(a, r);
    };
    se(H, (a) => {
      v() ? a(U) : a(m, -1);
    });
  }
  return n(S, k), ke(P);
}
je(tr, { progress: {}, id: {}, ref: {}, children: {}, child: {} }, [], [], { mode: "open" });
const ot = Dr({
  component: "toolbar",
  parts: ["root", "item", "group", "group-item", "link", "button"]
}), rr = new Or("Toolbar.Root");
class It {
  static create(t) {
    return rr.set(new It(t));
  }
  opts;
  rovingFocusGroup;
  attachment;
  constructor(t) {
    this.opts = t, this.attachment = Zt(this.opts.ref), this.rovingFocusGroup = new Tr({
      orientation: this.opts.orientation,
      loop: this.opts.loop,
      rootNode: this.opts.ref,
      candidateAttr: ot.item
    });
  }
  #e = i(() => ({
    id: this.opts.id.current,
    role: "toolbar",
    "data-orientation": this.opts.orientation.current,
    [ot.root]: "",
    ...this.attachment
  }));
  get props() {
    return e(this.#e);
  }
  set props(t) {
    $(this.#e, t);
  }
}
class St {
  static create(t) {
    return new St(t, rr.get());
  }
  opts;
  root;
  attachment;
  constructor(t, s) {
    this.opts = t, this.root = s, this.attachment = Zt(this.opts.ref), Ve(() => {
      $(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
    }), this.onkeydown = this.onkeydown.bind(this);
  }
  onkeydown(t) {
    this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, t);
  }
  #e = ie(0);
  #t = i(() => {
    if (!this.opts.ref.current) return;
    if (this.opts.ref.current.tagName !== "BUTTON") return "button";
  });
  #r = i(() => ({
    id: this.opts.id.current,
    [ot.item]: "",
    [ot.button]: "",
    role: e(this.#t),
    tabindex: e(this.#e),
    "data-disabled": Nr(this.opts.disabled.current),
    "data-orientation": this.root.opts.orientation.current,
    disabled: Ur(this.opts.disabled.current),
    //
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return e(this.#r);
  }
  set props(t) {
    $(this.#r, t);
  }
}
var wo = w("<div><!></div>");
function or(S, t) {
  const s = Je();
  xe(t, !0);
  let c = l(t, "ref", 15, null), h = l(t, "id", 23, () => Y(s)), g = l(t, "orientation", 7, "horizontal"), f = l(t, "loop", 7, !0), v = l(t, "child", 7), _ = l(t, "children", 7), x = We(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "ref",
    "id",
    "orientation",
    "loop",
    "child",
    "children"
  ]);
  const b = It.create({
    id: I(() => h()),
    orientation: I(() => g()),
    loop: I(() => f()),
    ref: I(() => c(), (r) => c(r))
  }), P = i(() => qe(x, b.props));
  var k = {
    get ref() {
      return c();
    },
    set ref(r = null) {
      c(r), d();
    },
    get id() {
      return h();
    },
    set id(r = Y(s)) {
      h(r), d();
    },
    get orientation() {
      return g();
    },
    set orientation(r = "horizontal") {
      g(r), d();
    },
    get loop() {
      return f();
    },
    set loop(r = !0) {
      f(r), d();
    },
    get child() {
      return v();
    },
    set child(r) {
      v(r), d();
    },
    get children() {
      return _();
    },
    set children(r) {
      _(r), d();
    }
  }, H = y(), U = p(H);
  {
    var m = (r) => {
      var u = y(), L = p(u);
      X(L, v, () => ({ props: e(P) })), n(r, u);
    }, a = (r) => {
      var u = wo();
      Ge(u, () => ({ ...e(P) }));
      var L = T(u);
      X(L, () => _() ?? at), M(u), n(r, u);
    };
    se(U, (r) => {
      v() ? r(m) : r(a, -1);
    });
  }
  return n(S, H), ke(k);
}
je(
  or,
  {
    ref: {},
    id: {},
    orientation: {},
    loop: {},
    child: {},
    children: {}
  },
  [],
  [],
  { mode: "open" }
);
var xo = w("<button><!></button>");
function Be(S, t) {
  const s = Je();
  xe(t, !0);
  let c = l(t, "child", 7), h = l(t, "children", 7), g = l(t, "disabled", 7, !1), f = l(t, "type", 7, "button"), v = l(t, "id", 23, () => Y(s)), _ = l(t, "ref", 15, null), x = We(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "disabled",
    "type",
    "id",
    "ref"
  ]);
  const b = St.create({
    id: I(() => v()),
    disabled: I(() => g() ?? !1),
    ref: I(() => _(), (r) => _(r))
  }), P = i(() => qe(x, b.props, { type: f() }));
  var k = {
    get child() {
      return c();
    },
    set child(r) {
      c(r), d();
    },
    get children() {
      return h();
    },
    set children(r) {
      h(r), d();
    },
    get disabled() {
      return g();
    },
    set disabled(r = !1) {
      g(r), d();
    },
    get type() {
      return f();
    },
    set type(r = "button") {
      f(r), d();
    },
    get id() {
      return v();
    },
    set id(r = Y(s)) {
      v(r), d();
    },
    get ref() {
      return _();
    },
    set ref(r = null) {
      _(r), d();
    }
  }, H = y(), U = p(H);
  {
    var m = (r) => {
      var u = y(), L = p(u);
      X(L, c, () => ({ props: e(P) })), n(r, u);
    }, a = (r) => {
      var u = xo();
      Ge(u, () => ({ ...e(P) }));
      var L = T(u);
      X(L, () => h() ?? at), M(u), n(r, u);
    };
    se(U, (r) => {
      c() ? r(m) : r(a, -1);
    });
  }
  return n(S, H), ke(k);
}
je(
  Be,
  {
    child: {},
    children: {},
    disabled: {},
    type: {},
    id: {},
    ref: {}
  },
  [],
  [],
  { mode: "open" }
);
var ko = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), jo = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), Eo = w('<div class="svelte-u7m8y9"><section class="custom-emoji-usage-section svelte-u7m8y9"><div class="custom-emoji-usage-title svelte-u7m8y9"> </div> <div class="custom-emoji-usage-grid svelte-u7m8y9"></div></section> <section class="custom-emoji-usage-section svelte-u7m8y9"><div class="custom-emoji-usage-title svelte-u7m8y9"> </div> <div class="custom-emoji-usage-grid svelte-u7m8y9"></div></section></div>'), Co = w('<div class="svelte-u7m8y9"></div>'), $o = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), Mo = w('<!> <div class="emoji-virtual-list svelte-u7m8y9"><div class="emoji-grid svelte-u7m8y9"></div></div>', 1), Io = w("<!> <!>", 1), So = w('<span class="caret-left-icon svg-icon svelte-u7m8y9"></span>'), Po = w('<span class="caret-right-icon svg-icon svelte-u7m8y9"></span>'), Lo = w('<span class="enter-key-icon svg-icon svelte-u7m8y9"></span>'), Ro = w('<span class="delete-left-icon svg-icon svelte-u7m8y9"></span>'), Ho = w('<div class="arrow-keys svelte-u7m8y9"><!> <!></div> <div class="line-break-delete svelte-u7m8y9"><!> <!></div>', 1), zo = w('<!> <div class="custom-emoji-search-row svelte-u7m8y9"><!> <!></div>', 1), Oo = w('<div class="custom-emoji-picker svelte-u7m8y9"><div class="resize-handle svelte-u7m8y9" role="separator" tabindex="0" aria-orientation="horizontal"></div> <!></div>');
const To = {
  hash: "svelte-u7m8y9",
  code: `.custom-emoji-picker.svelte-u7m8y9 {width:100%;max-width:800px;background:var(--dialog-bg);color:var(--text);overflow:hidden;position:relative;z-index:99;}.resize-handle.svelte-u7m8y9 {width:100%;height:var(--custom-emoji-picker-resize-handle-height);margin-bottom:calc(
            var(--custom-emoji-picker-resize-handle-overlap) * -1
        );cursor:ns-resize;touch-action:none;position:relative;z-index:1;background:transparent;}.resize-handle.svelte-u7m8y9::before {content:"";position:absolute;inset:0 0 auto 0;height:12px;background:var(--bg-buttonbar);}.resize-handle.svelte-u7m8y9::after {content:"";position:absolute;left:50%;top:6px;width:38px;height:4px;border-radius:999px;translate:-50% -50%;background:var(--border);}.custom-emoji-command {display:flex;flex-direction:column;}.custom-emoji-search-row.svelte-u7m8y9 {display:flex;align-items:center;width:100%;min-height:var(--custom-emoji-picker-search-row-height);border-top:1px solid var(--border);background:var(--input-bg, var(--dialog-bg));}.custom-emoji-search {flex:1 1 auto;min-width:0;width:100%;height:var(--custom-emoji-picker-search-row-height);padding:0 8px;border:0;background:transparent;color:var(--text);font-size:1rem;outline:none;}.custom-emoji-editor-toolbar {display:flex;align-items:center;flex:0 0 auto;height:var(--custom-emoji-picker-search-row-height);gap:2px;.arrow-keys.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;}.line-break-delete.svelte-u7m8y9 {display:flex;align-items:center;height:100%;gap:2px;.line-break {width:62px;}.delete {width:62px;}}}.custom-emoji-editor-button {display:flex;align-items:center;justify-content:center;width:50px;height:100%;padding:0;color:var(--text);background-color:var(--btn-bg);touch-action:manipulation;

        @media (hover: hover) and (pointer: fine) {&:hover {background:var(--btn-bg);}
        }}.custom-emoji-editor-button:active {scale:0.94;}.custom-emoji-editor-button .svg-icon {width:34px;height:34px;background-color:var(--svg, currentColor);mask-repeat:no-repeat;mask-position:center;mask-size:contain;}.caret-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f6c6566745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.caret-right-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6172726f775f72696768745f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.delete-left-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6261636b73706163655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.enter-key-icon.svelte-u7m8y9 {mask-image:var(--ehagaki-icon-6b6579626f6172645f72657475726e5f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.custom-emoji-scroll-root,
    .custom-emoji-scroll-viewport {width:100%;}.custom-emoji-scroll-root {overflow:hidden;}.custom-emoji-scroll-viewport {height:100%;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;}.custom-emoji-list {min-height:100%;}.emoji-virtual-list.svelte-u7m8y9 {position:relative;width:100%;}.emoji-grid.svelte-u7m8y9 {position:absolute;inset:4px 4px auto 4px;display:grid;justify-items:center;}.custom-emoji-usage-section.svelte-u7m8y9 {padding:4px;border-bottom:1px solid var(--border);}.custom-emoji-usage-title.svelte-u7m8y9 {padding:0 6px 2px;color:var(--text-muted, var(--text));font-size:0.78rem;font-weight:700;}.custom-emoji-usage-grid.svelte-u7m8y9 {display:grid;grid-auto-rows:40px;justify-items:center;}.emoji-item {display:flex;align-items:center;justify-content:center;width:100%;height:100%;cursor:pointer;outline:none;}.emoji-item[data-highlighted] {background:var(--btn-hover-bg);}

    @media (hover: hover) and (pointer: fine) {.emoji-item:hover {background:var(--btn-hover-bg);}
    }.emoji-image.svelte-u7m8y9 {width:32px;height:32px;object-fit:contain;user-select:none;-webkit-user-drag:none;}.custom-emoji-message {padding:18px 12px;text-align:center;color:var(--text-muted, var(--text));font-size:0.9rem;}.custom-emoji-loading {min-height:96px;.placeholder-text.loading-text {font-size:1rem;}}.scrollbar {display:flex;width:8px;padding:1px;background:transparent;}.scrollbar-thumb {flex:1;border-radius:999px;background:var(--border);}`
};
function Uo(S, t) {
  xe(t, !0), Fr(S, To);
  const s = () => eo(to, "$_", c), [c, h] = Br(), g = 3, f = 8, v = mo();
  let _ = l(t, "rxNostr", 7), x = l(t, "pubkey", 7), b = l(t, "open", 7, !1), P = l(t, "maxHeight", 7, null), k = l(t, "customEmojiUsageItems", 23, () => []), H = l(t, "onSelect", 7), U = l(t, "onMoveCaretLeft", 7), m = l(t, "onMoveCaretRight", 7), a = l(t, "onDeleteBackward", 7), r = l(t, "onInsertLineBreak", 7), u = l(t, "hostCustomEmojiItems", 7), L = ie(""), F = ie(uo(Ar)), A = ie(!1), ee = ie(!1), it = ie(0), Pt = ie(800), te = null, ne = null, st = null, nt = ie(0), Ye, Ze, Lt = !1, Rt, Ht, zt = !1, Ot, Tt;
  const Ut = /* @__PURE__ */ new Set();
  let Nt = i(() => u() ?? wt.items), ar = i(() => u() === void 0 && wt.loading), Qe = i(() => {
    const o = e(L).trim().toLowerCase();
    return o ? e(Nt).filter((z) => z.shortcodeLower.includes(o)) : e(Nt);
  }), Dt = i(() => e(L).trim().length === 0 && k().length > 0), le = i(() => Math.max(1, Math.floor(e(Pt) / we))), Ft = i(() => lo(e(le))), ir = i(() => k().slice(0, e(Ft))), sr = i(() => [...k()].sort(no).slice(0, e(Ft))), lt = i(() => Math.ceil(e(Qe).length / e(le))), he = i(() => Math.max(Ke, e(F))), At = i(() => Math.ceil(e(he) / we) + g * 2), dt = i(() => Math.max(0, Math.min(Math.max(0, e(lt) - e(At)), Math.floor(Math.max(0, e(it) - e(nt)) / we) - g))), nr = i(() => Math.min(e(lt), e(dt) + e(At))), lr = i(() => e(dt) * e(le)), dr = i(() => Math.min(e(Qe).length, e(nr) * e(le))), cr = i(() => e(Qe).slice(e(lr), e(dr))), ur = i(() => e(lt) * we + f), mr = i(() => e(dt) * we), Kt = i(() => Number.isFinite(P()) ? Math.max(Ke, Math.floor(P())) : void 0), ge = i(() => e(Kt) === void 0 ? void 0 : e(Kt)), vr = i(() => `--custom-emoji-picker-resize-handle-height: ${oo}px; --custom-emoji-picker-resize-handle-overlap: ${ao}px; --custom-emoji-picker-search-row-height: ${io}px;`);
  function hr() {
    const o = window.visualViewport?.width ?? window.innerWidth ?? 800;
    $(Pt, Math.min(800, Math.max(1, o)), !0);
  }
  function ct(o) {
    u() === void 0 && (Ut.has(o) || (Ut.add(o), ro([o])));
  }
  function Xe() {
    const o = window.visualViewport?.height ?? 0, z = Gr();
    return Math.max(window.innerHeight || 0, o + z, o, 800);
  }
  function ut() {
    hr();
  }
  function gr() {
    if (typeof window > "u")
      return Ke;
    const o = Xe(), z = Math.floor(o * 0.6);
    return Math.max(Ke, e(ge) === void 0 ? z : e(ge));
  }
  function mt(o) {
    $(F, so(v, o, Xe(), e(ge)), !0);
  }
  function fr(o) {
    if (o.key === "ArrowUp") {
      o.preventDefault(), mt(e(he) + 24);
      return;
    }
    o.key === "ArrowDown" && (o.preventDefault(), mt(e(he) - 24));
  }
  function re() {
    ne !== null && cancelAnimationFrame(ne), ne = requestAnimationFrame(() => {
      ne = null, ut();
    });
  }
  Kr(() => ($(F, Wt(v, Xe(), e(ge)), !0), ut(), window.addEventListener("resize", re), window.visualViewport?.addEventListener("resize", re), window.visualViewport?.addEventListener("scroll", re), () => {
    ne !== null && (cancelAnimationFrame(ne), ne = null), window.removeEventListener("resize", re), window.visualViewport?.removeEventListener("resize", re), window.visualViewport?.removeEventListener("scroll", re);
  })), Ve(() => {
    const o = b(), z = _(), ce = x();
    if (u() !== void 0) {
      Ye = void 0, Ze = void 0, o && re();
      return;
    }
    if (!o) {
      Ye = void 0, Ze = void 0;
      return;
    }
    (z !== Ye || ce !== Ze) && (Ye = z, Ze = ce, Qt(() => wt.load({ rxNostr: z, pubkey: ce }))), re();
  }), Ve(() => {
    const o = b() && (!Lt || _() !== Rt || x() !== Ht);
    if (Lt = b(), Rt = _(), Ht = x(), te !== null && (cancelAnimationFrame(te), te = null), !b() || !o) {
      b() || $(ee, !1);
      return;
    }
    return $(ee, !1), te = requestAnimationFrame(() => {
      te = null, $(ee, !0);
    }), () => {
      te !== null && (cancelAnimationFrame(te), te = null);
    };
  }), Ve(() => {
    const o = b() && (!zt || e(L) !== Ot || x() !== Tt);
    zt = b(), Ot = e(L), Tt = x(), o && ($(it, 0), st?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
  }), Ve(() => {
    e(ge), $(F, Wt(v, Xe(), e(ge)), !0);
  });
  function vt(o) {
    H()?.(o);
  }
  function pr() {
    U()?.();
  }
  function br() {
    m()?.();
  }
  function _r() {
    a()?.();
  }
  function yr() {
    r()?.();
  }
  function wr(o) {
    o.preventDefault(), ut();
    const z = o.clientY, ce = e(he);
    $(A, !0);
    const et = (Ce) => {
      Ce.preventDefault();
      const tt = ce + (z - Ce.clientY);
      mt(tt);
    }, Ee = () => {
      $(A, !1), window.removeEventListener("pointermove", et), window.removeEventListener("pointerup", Ee), window.removeEventListener("pointercancel", Ee);
    };
    window.addEventListener("pointermove", et), window.addEventListener("pointerup", Ee), window.addEventListener("pointercancel", Ee);
  }
  function xr(o) {
    $(it, o.currentTarget.scrollTop, !0);
  }
  var kr = {
    get rxNostr() {
      return _();
    },
    set rxNostr(o) {
      _(o), d();
    },
    get pubkey() {
      return x();
    },
    set pubkey(o) {
      x(o), d();
    },
    get open() {
      return b();
    },
    set open(o = !1) {
      b(o), d();
    },
    get maxHeight() {
      return P();
    },
    set maxHeight(o = null) {
      P(o), d();
    },
    get customEmojiUsageItems() {
      return k();
    },
    set customEmojiUsageItems(o = []) {
      k(o), d();
    },
    get onSelect() {
      return H();
    },
    set onSelect(o) {
      H(o), d();
    },
    get onMoveCaretLeft() {
      return U();
    },
    set onMoveCaretLeft(o) {
      U(o), d();
    },
    get onMoveCaretRight() {
      return m();
    },
    set onMoveCaretRight(o) {
      m(o), d();
    },
    get onDeleteBackward() {
      return a();
    },
    set onDeleteBackward(o) {
      a(o), d();
    },
    get onInsertLineBreak() {
      return r();
    },
    set onInsertLineBreak(o) {
      r(o), d();
    },
    get hostCustomEmojiItems() {
      return u();
    },
    set hostCustomEmojiItems(o) {
      u(o), d();
    }
  }, fe = Oo(), de = T(fe), jr = W(de, 2);
  {
    let o = i(() => s()("customEmoji.search_label"));
    C(jr, () => Xr, (z, ce) => {
      ce(z, {
        class: "custom-emoji-command",
        get label() {
          return e(o);
        },
        shouldFilter: !1,
        loop: !0,
        children: (et, Ee) => {
          var Ce = zo(), tt = p(Ce);
          {
            let $e = i(() => `height: ${e(he)}px;`);
            C(tt, () => qr, (Me, Ie) => {
              Ie(Me, {
                type: "auto",
                class: "custom-emoji-scroll-root",
                get style() {
                  return e($e);
                },
                children: (Se, $r) => {
                  var Pe = Io(), pe = p(Pe);
                  C(pe, () => Wr, (Le, be) => {
                    be(Le, {
                      class: "custom-emoji-scroll-viewport",
                      onscroll: xr,
                      children: (_e, ht) => {
                        var N = y(), K = p(N);
                        C(K, () => Jr, (V, B) => {
                          B(V, {
                            class: "custom-emoji-list",
                            children: (Re, oe) => {
                              var Gt = y(), Mr = p(Gt);
                              {
                                var Ir = (Z) => {
                                  var ae = y(), ye = p(ae);
                                  C(ye, () => tr, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ue, Oe) => {
                                        {
                                          let O = i(() => s()("customEmoji.loading"));
                                          Qr(ue, {
                                            showLoader: !0,
                                            get text() {
                                              return e(O);
                                            },
                                            customClass: "custom-emoji-loading"
                                          });
                                        }
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), n(Z, ae);
                                }, Sr = (Z) => {
                                  var ae = y(), ye = p(ae);
                                  C(ye, () => Xt, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ue, Oe) => {
                                        go();
                                        var O = vo();
                                        ve((j) => Et(O, j), [() => s()("customEmoji.empty")]), n(ue, O);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), n(Z, ae);
                                }, Pr = (Z) => {
                                  var ae = Mo(), ye = p(ae);
                                  {
                                    var He = (O) => {
                                      var j = Eo(), Q = T(j), Te = T(Q), gt = T(Te, !0);
                                      M(Te);
                                      var Ue = W(Te, 2);
                                      xt(Ue, 21, () => e(ir), (G) => G.identityKey, (G, E) => {
                                        var me = y(), Fe = p(me);
                                        {
                                          let ft = i(() => `recent:${e(E).identityKey}`), pt = i(() => [e(E).shortcode]);
                                          C(Fe, () => kt, (bt, _t) => {
                                            _t(bt, {
                                              get value() {
                                                return e(ft);
                                              },
                                              get keywords() {
                                                return e(pt);
                                              },
                                              class: "emoji-item custom-emoji-usage-item",
                                              onSelect: () => vt(e(E)),
                                              get onmousedown() {
                                                return q;
                                              },
                                              get ontouchstart() {
                                                return jt;
                                              },
                                              children: (yt, Lr) => {
                                                var D = ko();
                                                ve(() => {
                                                  R(D, "src", e(E).src), R(D, "alt", `:${e(E).shortcode}:`), R(D, "title", `:${e(E).shortcode}:`);
                                                }), Ct("load", D, () => ct(e(E).src)), $t(D), n(yt, D);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(G, me);
                                      }), M(Ue), M(Q);
                                      var Ne = W(Q, 2), De = T(Ne), qt = T(De, !0);
                                      M(De);
                                      var J = W(De, 2);
                                      xt(J, 21, () => e(sr), (G) => G.identityKey, (G, E) => {
                                        var me = y(), Fe = p(me);
                                        {
                                          let ft = i(() => `frequent:${e(E).identityKey}`), pt = i(() => [e(E).shortcode]);
                                          C(Fe, () => kt, (bt, _t) => {
                                            _t(bt, {
                                              get value() {
                                                return e(ft);
                                              },
                                              get keywords() {
                                                return e(pt);
                                              },
                                              class: "emoji-item custom-emoji-usage-item",
                                              onSelect: () => vt(e(E)),
                                              get onmousedown() {
                                                return q;
                                              },
                                              get ontouchstart() {
                                                return jt;
                                              },
                                              children: (yt, Lr) => {
                                                var D = jo();
                                                ve(() => {
                                                  R(D, "src", e(E).src), R(D, "alt", `:${e(E).shortcode}:`), R(D, "title", `:${e(E).shortcode}:`);
                                                }), Ct("load", D, () => ct(e(E).src)), $t(D), n(yt, D);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(G, me);
                                      }), M(J), M(Ne), M(j), ve(
                                        (G, E, me, Fe) => {
                                          R(Q, "aria-label", G), Et(gt, E), Ae(Ue, `grid-template-columns: repeat(${e(le)}, minmax(0, 1fr));`), R(Ne, "aria-label", me), Et(qt, Fe), Ae(J, `grid-template-columns: repeat(${e(le)}, minmax(0, 1fr));`);
                                        },
                                        [
                                          () => s()("customEmoji.recent"),
                                          () => s()("customEmoji.recent"),
                                          () => s()("customEmoji.frequent"),
                                          () => s()("customEmoji.frequent")
                                        ]
                                      ), Yt(j, "clientHeight", (G) => $(nt, G)), n(O, j);
                                    }, ze = (O) => {
                                      var j = Co();
                                      Yt(j, "clientHeight", (Q) => $(nt, Q)), n(O, j);
                                    };
                                    se(ye, (O) => {
                                      e(Dt) ? O(He) : O(ze, -1);
                                    });
                                  }
                                  var ue = W(ye, 2), Oe = T(ue);
                                  xt(Oe, 21, () => e(cr), (O) => O.identityKey, (O, j) => {
                                    var Q = y(), Te = p(Q);
                                    {
                                      let gt = i(() => [e(j).shortcode]);
                                      C(Te, () => kt, (Ue, Ne) => {
                                        Ne(Ue, {
                                          get value() {
                                            return e(j).identityKey;
                                          },
                                          get keywords() {
                                            return e(gt);
                                          },
                                          class: "emoji-item",
                                          onSelect: () => vt(e(j)),
                                          get onmousedown() {
                                            return q;
                                          },
                                          get ontouchstart() {
                                            return jt;
                                          },
                                          children: (De, qt) => {
                                            var J = $o();
                                            ve(() => {
                                              R(J, "src", e(j).src), R(J, "alt", `:${e(j).shortcode}:`), R(J, "title", `:${e(j).shortcode}:`);
                                            }), Ct("load", J, () => ct(e(j).src)), $t(J), n(De, J);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      });
                                    }
                                    n(O, Q);
                                  }), M(Oe), M(ue), ve(() => {
                                    Ae(ue, `height: ${e(ur)}px;`), Ae(Oe, `transform: translateY(${e(mr)}px); grid-template-columns: repeat(${e(le)}, minmax(0, 1fr)); grid-auto-rows: ${we}px;`);
                                  }), n(Z, ae);
                                };
                                se(Mr, (Z) => {
                                  e(ar) || !e(ee) ? Z(Ir) : e(Qe).length === 0 && !e(Dt) ? Z(Sr, 1) : Z(Pr, -1);
                                });
                              }
                              n(Re, Gt);
                            },
                            $$slots: { default: !0 }
                          });
                        }), n(_e, N);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                  var rt = W(pe, 2);
                  C(rt, () => Yr, (Le, be) => {
                    be(Le, {
                      orientation: "vertical",
                      class: "scrollbar",
                      children: (_e, ht) => {
                        var N = y(), K = p(N);
                        C(K, () => Zr, (V, B) => {
                          B(V, { class: "scrollbar-thumb" });
                        }), n(_e, N);
                      },
                      $$slots: { default: !0 }
                    });
                  }), n(Se, Pe);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var Vt = W(tt, 2), Bt = T(Vt);
          {
            let $e = i(() => s()("customEmoji.search_placeholder"));
            C(Bt, () => er, (Me, Ie) => {
              Ie(Me, {
                class: "custom-emoji-search",
                get placeholder() {
                  return e($e);
                },
                get value() {
                  return e(L);
                },
                set value(Se) {
                  $(L, Se, !0);
                }
              });
            });
          }
          var Cr = W(Bt, 2);
          {
            let $e = i(() => s()("customEmoji.editor_toolbar"));
            C(Cr, () => or, (Me, Ie) => {
              Ie(Me, {
                class: "custom-emoji-editor-toolbar",
                orientation: "horizontal",
                loop: !1,
                get "aria-label"() {
                  return e($e);
                },
                children: (Se, $r) => {
                  var Pe = Ho(), pe = p(Pe), rt = T(pe);
                  {
                    let N = i(() => s()("customEmoji.move_left"));
                    C(rt, () => Be, (K, V) => {
                      V(K, {
                        class: "custom-emoji-editor-button left",
                        get "aria-label"() {
                          return e(N);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: pr,
                        children: (B, Re) => {
                          var oe = So();
                          n(B, oe);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var Le = W(rt, 2);
                  {
                    let N = i(() => s()("customEmoji.move_right"));
                    C(Le, () => Be, (K, V) => {
                      V(K, {
                        class: "custom-emoji-editor-button right",
                        get "aria-label"() {
                          return e(N);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: br,
                        children: (B, Re) => {
                          var oe = Po();
                          n(B, oe);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  M(pe);
                  var be = W(pe, 2), _e = T(be);
                  {
                    let N = i(() => s()("customEmoji.insert_line_break"));
                    C(_e, () => Be, (K, V) => {
                      V(K, {
                        class: "custom-emoji-editor-button line-break",
                        get "aria-label"() {
                          return e(N);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: yr,
                        children: (B, Re) => {
                          var oe = Lo();
                          n(B, oe);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var ht = W(_e, 2);
                  {
                    let N = i(() => s()("customEmoji.delete_backward"));
                    C(ht, () => Be, (K, V) => {
                      V(K, {
                        class: "custom-emoji-editor-button delete",
                        get "aria-label"() {
                          return e(N);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: _r,
                        children: (B, Re) => {
                          var oe = Ro();
                          n(B, oe);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  M(be), n(Se, Pe);
                },
                $$slots: { default: !0 }
              });
            });
          }
          M(Vt), n(et, Ce);
        },
        $$slots: { default: !0 }
      });
    });
  }
  M(fe), Vr(fe, (o) => st = o, () => st), ve(
    (o, z) => {
      R(fe, "data-resizing", e(A)), Ae(fe, e(vr)), R(de, "aria-label", o), R(de, "aria-valuemin", Ke), R(de, "aria-valuenow", e(he)), R(de, "aria-valuemax", z);
    },
    [
      () => s()("customEmoji.resize"),
      () => gr()
    ]
  ), Jt("pointerdown", de, wr), Jt("keydown", de, fr), n(S, fe);
  var Er = ke(kr);
  return h(), Er;
}
ho(["pointerdown", "keydown"]);
je(
  Uo,
  {
    rxNostr: {},
    pubkey: {},
    open: {},
    maxHeight: {},
    customEmojiUsageItems: {},
    onSelect: {},
    onMoveCaretLeft: {},
    onMoveCaretRight: {},
    onDeleteBackward: {},
    onInsertLineBreak: {},
    hostCustomEmojiItems: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  Uo as default
};
