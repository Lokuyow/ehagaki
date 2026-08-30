import { I as l, aQ as Z, e5 as Hr, aO as S, K as ne, aR as ee, aS as qe, aT as Ge, aU as We, e6 as zr, e7 as Or, aD as Tr, aE as Zt, aM as Nr, aJ as Ur, aF as Fr, aN as Dr, H as Ar, e8 as Vr, ai as Kr, e9 as Wt, a_ as $, L as Br, Q as qr, ea as wt, eb as Gr, ec as Wr, ed as Jr, ee as Yr, ef as Zr, b6 as G, S as Qr, W as xt, eg as kt, N as H, eh as jt, O as Ae, ei as we, ej as Xr, ek as Ve, V as eo, $ as to, el as ro, em as oo, en as ao, eo as io, ep as so, eq as no, er as lo } from "./App-UP5voPz2.js";
import { a9 as uo, u as Qt, b7 as Je, b0 as xe, b1 as y, b2 as p, b3 as n, b4 as ke, b5 as d, a as e, b8 as T, n as at, b9 as I, b6 as je, aR as i, ba as w, b as M, aN as Ke, aS as se, aJ as co, Z as ve, ap as Jt, aQ as mo, bf as W, bh as vo, bi as Et, bC as Ct, aq as ho, bj as go, bg as $t } from "./entry-jZ4F5rmU.js";
import { b as fo } from "./input-DDRyAQq_.js";
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
    var u = this.#e.get(t) || /* @__PURE__ */ new Set();
    return u.add(s), this.#e.set(t, u), this.#o().observe(t, this.#r), () => {
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
          for (var u of this.#e.get(s.target) || [])
            u(s);
        }
      }
    ));
  }
}
var po = /* @__PURE__ */ new Mt({
  box: "border-box"
});
function Yt(P, t, s) {
  var u = po.observe(P, () => s(P[t]));
  uo(() => (Qt(() => s(P[t])), u));
}
var bo = w("<div><!></div>");
function Xt(P, t) {
  const s = Je();
  xe(t, !0);
  let u = l(t, "id", 23, () => Z(s)), h = l(t, "ref", 15, null), g = l(t, "children", 7), f = l(t, "child", 7), v = l(t, "forceMount", 7, !1), _ = We(t, [
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
  const x = Hr.create({
    id: S(() => u()),
    ref: S(() => h(), (m) => h(m)),
    forceMount: S(() => v())
  }), b = i(() => Ge(x.props, _));
  var L = {
    get id() {
      return u();
    },
    set id(m = Z(s)) {
      u(m), d();
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
  }, k = y(), z = p(k);
  {
    var N = (m) => {
      var a = y(), o = p(a);
      {
        var c = (D) => {
          var A = y(), te = p(A);
          ee(te, f, () => ({ props: e(b) })), n(D, A);
        }, R = (D) => {
          var A = bo();
          qe(A, () => ({ ...e(b) }));
          var te = T(A);
          ee(te, () => g() ?? at), I(A), n(D, A);
        };
        ne(o, (D) => {
          f() ? D(c) : D(R, -1);
        });
      }
      n(m, a);
    };
    ne(z, (m) => {
      x.shouldRender && m(N);
    });
  }
  return n(P, k), ke(L);
}
je(Xt, { id: {}, ref: {}, children: {}, child: {}, forceMount: {} }, [], [], { mode: "open" });
var _o = w("<input/>");
function er(P, t) {
  const s = Je();
  xe(t, !0);
  let u = l(t, "value", 15, ""), h = l(t, "autofocus", 7, !1), g = l(t, "id", 23, () => Z(s)), f = l(t, "ref", 15, null), v = l(t, "child", 7), _ = We(t, [
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
  const x = zr.create({
    id: S(() => g()),
    ref: S(() => f(), (a) => f(a)),
    value: S(() => u(), (a) => {
      u(a);
    }),
    autofocus: S(() => h() ?? !1)
  }), b = i(() => Ge(_, x.props));
  var L = {
    get value() {
      return u();
    },
    set value(a = "") {
      u(a), d();
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
    set id(a = Z(s)) {
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
  }, k = y(), z = p(k);
  {
    var N = (a) => {
      var o = y(), c = p(o);
      ee(c, v, () => ({ props: e(b) })), n(a, o);
    }, m = (a) => {
      var o = _o();
      qe(o, () => ({ ...e(b) }), void 0, void 0, void 0, void 0, !0), fo(o, u), n(a, o);
    };
    ne(z, (a) => {
      v() ? a(N) : a(m, -1);
    });
  }
  return n(P, k), ke(L);
}
je(er, { value: {}, autofocus: {}, id: {}, ref: {}, child: {} }, [], [], { mode: "open" });
var yo = w("<div><!></div>");
function tr(P, t) {
  const s = Je();
  xe(t, !0);
  let u = l(t, "progress", 7, 0), h = l(t, "id", 23, () => Z(s)), g = l(t, "ref", 15, null), f = l(t, "children", 7), v = l(t, "child", 7), _ = We(t, [
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
  const x = Or.create({
    id: S(() => h()),
    ref: S(() => g(), (a) => g(a)),
    progress: S(() => u())
  }), b = i(() => Ge(_, x.props));
  var L = {
    get progress() {
      return u();
    },
    set progress(a = 0) {
      u(a), d();
    },
    get id() {
      return h();
    },
    set id(a = Z(s)) {
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
  }, k = y(), z = p(k);
  {
    var N = (a) => {
      var o = y(), c = p(o);
      ee(c, v, () => ({ props: e(b) })), n(a, o);
    }, m = (a) => {
      var o = yo();
      qe(o, () => ({ ...e(b) }));
      var c = T(o);
      ee(c, () => f() ?? at), I(o), n(a, o);
    };
    ne(z, (a) => {
      v() ? a(N) : a(m, -1);
    });
  }
  return n(P, k), ke(L);
}
je(tr, { progress: {}, id: {}, ref: {}, children: {}, child: {} }, [], [], { mode: "open" });
const ot = Dr({
  component: "toolbar",
  parts: ["root", "item", "group", "group-item", "link", "button"]
}), rr = new Tr("Toolbar.Root");
class It {
  static create(t) {
    return rr.set(new It(t));
  }
  opts;
  rovingFocusGroup;
  attachment;
  constructor(t) {
    this.opts = t, this.attachment = Zt(this.opts.ref), this.rovingFocusGroup = new Nr({
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
    M(this.#e, t);
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
    this.opts = t, this.root = s, this.attachment = Zt(this.opts.ref), Ke(() => {
      M(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
    }), this.onkeydown = this.onkeydown.bind(this);
  }
  onkeydown(t) {
    this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, t);
  }
  #e = se(0);
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
    "data-disabled": Fr(this.opts.disabled.current),
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
    M(this.#r, t);
  }
}
var wo = w("<div><!></div>");
function or(P, t) {
  const s = Je();
  xe(t, !0);
  let u = l(t, "ref", 15, null), h = l(t, "id", 23, () => Z(s)), g = l(t, "orientation", 7, "horizontal"), f = l(t, "loop", 7, !0), v = l(t, "child", 7), _ = l(t, "children", 7), x = We(t, [
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
    id: S(() => h()),
    orientation: S(() => g()),
    loop: S(() => f()),
    ref: S(() => u(), (o) => u(o))
  }), L = i(() => Ge(x, b.props));
  var k = {
    get ref() {
      return u();
    },
    set ref(o = null) {
      u(o), d();
    },
    get id() {
      return h();
    },
    set id(o = Z(s)) {
      h(o), d();
    },
    get orientation() {
      return g();
    },
    set orientation(o = "horizontal") {
      g(o), d();
    },
    get loop() {
      return f();
    },
    set loop(o = !0) {
      f(o), d();
    },
    get child() {
      return v();
    },
    set child(o) {
      v(o), d();
    },
    get children() {
      return _();
    },
    set children(o) {
      _(o), d();
    }
  }, z = y(), N = p(z);
  {
    var m = (o) => {
      var c = y(), R = p(c);
      ee(R, v, () => ({ props: e(L) })), n(o, c);
    }, a = (o) => {
      var c = wo();
      qe(c, () => ({ ...e(L) }));
      var R = T(c);
      ee(R, () => _() ?? at), I(c), n(o, c);
    };
    ne(N, (o) => {
      v() ? o(m) : o(a, -1);
    });
  }
  return n(P, z), ke(k);
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
function Be(P, t) {
  const s = Je();
  xe(t, !0);
  let u = l(t, "child", 7), h = l(t, "children", 7), g = l(t, "disabled", 7, !1), f = l(t, "type", 7, "button"), v = l(t, "id", 23, () => Z(s)), _ = l(t, "ref", 15, null), x = We(t, [
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
    id: S(() => v()),
    disabled: S(() => g() ?? !1),
    ref: S(() => _(), (o) => _(o))
  }), L = i(() => Ge(x, b.props, { type: f() }));
  var k = {
    get child() {
      return u();
    },
    set child(o) {
      u(o), d();
    },
    get children() {
      return h();
    },
    set children(o) {
      h(o), d();
    },
    get disabled() {
      return g();
    },
    set disabled(o = !1) {
      g(o), d();
    },
    get type() {
      return f();
    },
    set type(o = "button") {
      f(o), d();
    },
    get id() {
      return v();
    },
    set id(o = Z(s)) {
      v(o), d();
    },
    get ref() {
      return _();
    },
    set ref(o = null) {
      _(o), d();
    }
  }, z = y(), N = p(z);
  {
    var m = (o) => {
      var c = y(), R = p(c);
      ee(R, u, () => ({ props: e(L) })), n(o, c);
    }, a = (o) => {
      var c = xo();
      qe(c, () => ({ ...e(L) }));
      var R = T(c);
      ee(R, () => h() ?? at), I(c), n(o, c);
    };
    ne(N, (o) => {
      u() ? o(m) : o(a, -1);
    });
  }
  return n(P, z), ke(k);
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
function No(P, t) {
  xe(t, !0), Ar(P, To);
  const s = () => eo(to, "$_", u), [u, h] = qr(), g = 3, f = 8, v = mo();
  let _ = l(t, "rxNostr", 7), x = l(t, "pubkey", 7), b = l(t, "open", 7, !1), L = l(t, "maxHeight", 7, null), k = l(t, "customEmojiUsageItems", 23, () => []), z = l(t, "onSelect", 7), N = l(t, "onMoveCaretLeft", 7), m = l(t, "onMoveCaretRight", 7), a = l(t, "onDeleteBackward", 7), o = l(t, "onInsertLineBreak", 7), c = l(t, "hostCustomEmojiItems", 7), R = se(""), D = se(co(Vr)), A = se(!1), te = se(!1), it = se(0), Pt = se(800), re = null, le = null, st = null, nt = se(0), Ye, Ze, Lt = !1, Rt, Ht, zt = !1, Ot, Tt;
  const Nt = /* @__PURE__ */ new Set();
  let Ut = i(() => c() ?? wt.items), ar = i(() => c() === void 0 && wt.loading), Qe = i(() => {
    const r = e(R).trim().toLowerCase();
    return r ? e(Ut).filter((j) => j.shortcodeLower.includes(r)) : e(Ut);
  }), Ft = i(() => e(R).trim().length === 0 && k().length > 0), de = i(() => Math.max(1, Math.floor(e(Pt) / we))), Dt = i(() => lo(e(de))), ir = i(() => k().slice(0, e(Dt))), sr = i(() => [...k()].sort(no).slice(0, e(Dt))), lt = i(() => Math.ceil(e(Qe).length / e(de))), he = i(() => Math.max(Ve, e(D))), At = i(() => Math.ceil(e(he) / we) + g * 2), dt = i(() => Math.max(0, Math.min(Math.max(0, e(lt) - e(At)), Math.floor(Math.max(0, e(it) - e(nt)) / we) - g))), nr = i(() => Math.min(e(lt), e(dt) + e(At))), lr = i(() => e(dt) * e(de)), dr = i(() => Math.min(e(Qe).length, e(nr) * e(de))), ur = i(() => e(Qe).slice(e(lr), e(dr))), cr = i(() => e(lt) * we + f), mr = i(() => e(dt) * we), Vt = i(() => Number.isFinite(L()) ? Math.max(Ve, Math.floor(L())) : void 0), ge = i(() => e(Vt) === void 0 ? void 0 : e(Vt)), vr = i(() => `--custom-emoji-picker-resize-handle-height: ${oo}px; --custom-emoji-picker-resize-handle-overlap: ${ao}px; --custom-emoji-picker-search-row-height: ${io}px;`);
  function hr() {
    const r = window.visualViewport?.width ?? window.innerWidth ?? 800;
    M(Pt, Math.min(800, Math.max(1, r)), !0);
  }
  function ut(r) {
    c() === void 0 && (Nt.has(r) || (Nt.add(r), ro([r])));
  }
  function gr(r) {
    if (typeof document > "u") return 0;
    const j = getComputedStyle(document.documentElement).getPropertyValue(r).trim(), J = Number.parseFloat(j);
    return Number.isFinite(J) ? J : 0;
  }
  function Xe() {
    const r = window.visualViewport?.height ?? 0, j = gr("--keyboard-height");
    return Math.max(window.innerHeight || 0, r + j, r, 800);
  }
  function ct() {
    hr();
  }
  function fr() {
    if (typeof window > "u")
      return Ve;
    const r = Xe(), j = Math.floor(r * 0.6);
    return Math.max(Ve, e(ge) === void 0 ? j : e(ge));
  }
  function mt(r) {
    M(D, so(v, r, Xe(), e(ge)), !0);
  }
  function pr(r) {
    if (r.key === "ArrowUp") {
      r.preventDefault(), mt(e(he) + 24);
      return;
    }
    r.key === "ArrowDown" && (r.preventDefault(), mt(e(he) - 24));
  }
  function oe() {
    le !== null && cancelAnimationFrame(le), le = requestAnimationFrame(() => {
      le = null, ct();
    });
  }
  Kr(() => (M(D, Wt(v, Xe(), e(ge)), !0), ct(), window.addEventListener("resize", oe), window.visualViewport?.addEventListener("resize", oe), window.visualViewport?.addEventListener("scroll", oe), () => {
    le !== null && (cancelAnimationFrame(le), le = null), window.removeEventListener("resize", oe), window.visualViewport?.removeEventListener("resize", oe), window.visualViewport?.removeEventListener("scroll", oe);
  })), Ke(() => {
    const r = b(), j = _(), J = x();
    if (c() !== void 0) {
      Ye = void 0, Ze = void 0, r && oe();
      return;
    }
    if (!r) {
      Ye = void 0, Ze = void 0;
      return;
    }
    (j !== Ye || J !== Ze) && (Ye = j, Ze = J, Qt(() => wt.load({ rxNostr: j, pubkey: J }))), oe();
  }), Ke(() => {
    const r = b() && (!Lt || _() !== Rt || x() !== Ht);
    if (Lt = b(), Rt = _(), Ht = x(), re !== null && (cancelAnimationFrame(re), re = null), !b() || !r) {
      b() || M(te, !1);
      return;
    }
    return M(te, !1), re = requestAnimationFrame(() => {
      re = null, M(te, !0);
    }), () => {
      re !== null && (cancelAnimationFrame(re), re = null);
    };
  }), Ke(() => {
    const r = b() && (!zt || e(R) !== Ot || x() !== Tt);
    zt = b(), Ot = e(R), Tt = x(), r && (M(it, 0), st?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
  }), Ke(() => {
    e(ge), M(D, Wt(v, Xe(), e(ge)), !0);
  });
  function vt(r) {
    z()?.(r);
  }
  function br() {
    N()?.();
  }
  function _r() {
    m()?.();
  }
  function yr() {
    a()?.();
  }
  function wr() {
    o()?.();
  }
  function xr(r) {
    r.preventDefault(), ct();
    const j = r.clientY, J = e(he);
    M(A, !0);
    const et = (Ce) => {
      Ce.preventDefault();
      const tt = J + (j - Ce.clientY);
      mt(tt);
    }, Ee = () => {
      M(A, !1), window.removeEventListener("pointermove", et), window.removeEventListener("pointerup", Ee), window.removeEventListener("pointercancel", Ee);
    };
    window.addEventListener("pointermove", et), window.addEventListener("pointerup", Ee), window.addEventListener("pointercancel", Ee);
  }
  function kr(r) {
    M(it, r.currentTarget.scrollTop, !0);
  }
  var jr = {
    get rxNostr() {
      return _();
    },
    set rxNostr(r) {
      _(r), d();
    },
    get pubkey() {
      return x();
    },
    set pubkey(r) {
      x(r), d();
    },
    get open() {
      return b();
    },
    set open(r = !1) {
      b(r), d();
    },
    get maxHeight() {
      return L();
    },
    set maxHeight(r = null) {
      L(r), d();
    },
    get customEmojiUsageItems() {
      return k();
    },
    set customEmojiUsageItems(r = []) {
      k(r), d();
    },
    get onSelect() {
      return z();
    },
    set onSelect(r) {
      z(r), d();
    },
    get onMoveCaretLeft() {
      return N();
    },
    set onMoveCaretLeft(r) {
      N(r), d();
    },
    get onMoveCaretRight() {
      return m();
    },
    set onMoveCaretRight(r) {
      m(r), d();
    },
    get onDeleteBackward() {
      return a();
    },
    set onDeleteBackward(r) {
      a(r), d();
    },
    get onInsertLineBreak() {
      return o();
    },
    set onInsertLineBreak(r) {
      o(r), d();
    },
    get hostCustomEmojiItems() {
      return c();
    },
    set hostCustomEmojiItems(r) {
      c(r), d();
    }
  }, fe = Oo(), ue = T(fe), Er = W(ue, 2);
  {
    let r = i(() => s()("customEmoji.search_label"));
    $(Er, () => Xr, (j, J) => {
      J(j, {
        class: "custom-emoji-command",
        get label() {
          return e(r);
        },
        shouldFilter: !1,
        loop: !0,
        children: (et, Ee) => {
          var Ce = zo(), tt = p(Ce);
          {
            let $e = i(() => `height: ${e(he)}px;`);
            $(tt, () => Gr, (Me, Ie) => {
              Ie(Me, {
                type: "auto",
                class: "custom-emoji-scroll-root",
                get style() {
                  return e($e);
                },
                children: (Se, Mr) => {
                  var Pe = Io(), pe = p(Pe);
                  $(pe, () => Wr, (Le, be) => {
                    be(Le, {
                      class: "custom-emoji-scroll-viewport",
                      onscroll: kr,
                      children: (_e, ht) => {
                        var U = y(), V = p(U);
                        $(V, () => Jr, (K, B) => {
                          B(K, {
                            class: "custom-emoji-list",
                            children: (Re, ae) => {
                              var qt = y(), Ir = p(qt);
                              {
                                var Sr = (Q) => {
                                  var ie = y(), ye = p(ie);
                                  $(ye, () => tr, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ce, Oe) => {
                                        {
                                          let O = i(() => s()("customEmoji.loading"));
                                          Qr(ce, {
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
                                  }), n(Q, ie);
                                }, Pr = (Q) => {
                                  var ie = y(), ye = p(ie);
                                  $(ye, () => Xt, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ce, Oe) => {
                                        go();
                                        var O = vo();
                                        ve((E) => Et(O, E), [() => s()("customEmoji.empty")]), n(ce, O);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), n(Q, ie);
                                }, Lr = (Q) => {
                                  var ie = Mo(), ye = p(ie);
                                  {
                                    var He = (O) => {
                                      var E = Eo(), X = T(E), Te = T(X), gt = T(Te, !0);
                                      I(Te);
                                      var Ne = W(Te, 2);
                                      xt(Ne, 21, () => e(ir), (q) => q.identityKey, (q, C) => {
                                        var me = y(), De = p(me);
                                        {
                                          let ft = i(() => `recent:${e(C).identityKey}`), pt = i(() => [e(C).shortcode]);
                                          $(De, () => kt, (bt, _t) => {
                                            _t(bt, {
                                              get value() {
                                                return e(ft);
                                              },
                                              get keywords() {
                                                return e(pt);
                                              },
                                              class: "emoji-item custom-emoji-usage-item",
                                              onSelect: () => vt(e(C)),
                                              get onmousedown() {
                                                return G;
                                              },
                                              get ontouchstart() {
                                                return jt;
                                              },
                                              children: (yt, Rr) => {
                                                var F = ko();
                                                ve(() => {
                                                  H(F, "src", e(C).src), H(F, "alt", `:${e(C).shortcode}:`), H(F, "title", `:${e(C).shortcode}:`);
                                                }), Ct("load", F, () => ut(e(C).src)), $t(F), n(yt, F);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(q, me);
                                      }), I(Ne), I(X);
                                      var Ue = W(X, 2), Fe = T(Ue), Gt = T(Fe, !0);
                                      I(Fe);
                                      var Y = W(Fe, 2);
                                      xt(Y, 21, () => e(sr), (q) => q.identityKey, (q, C) => {
                                        var me = y(), De = p(me);
                                        {
                                          let ft = i(() => `frequent:${e(C).identityKey}`), pt = i(() => [e(C).shortcode]);
                                          $(De, () => kt, (bt, _t) => {
                                            _t(bt, {
                                              get value() {
                                                return e(ft);
                                              },
                                              get keywords() {
                                                return e(pt);
                                              },
                                              class: "emoji-item custom-emoji-usage-item",
                                              onSelect: () => vt(e(C)),
                                              get onmousedown() {
                                                return G;
                                              },
                                              get ontouchstart() {
                                                return jt;
                                              },
                                              children: (yt, Rr) => {
                                                var F = jo();
                                                ve(() => {
                                                  H(F, "src", e(C).src), H(F, "alt", `:${e(C).shortcode}:`), H(F, "title", `:${e(C).shortcode}:`);
                                                }), Ct("load", F, () => ut(e(C).src)), $t(F), n(yt, F);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(q, me);
                                      }), I(Y), I(Ue), I(E), ve(
                                        (q, C, me, De) => {
                                          H(X, "aria-label", q), Et(gt, C), Ae(Ne, `grid-template-columns: repeat(${e(de)}, minmax(0, 1fr));`), H(Ue, "aria-label", me), Et(Gt, De), Ae(Y, `grid-template-columns: repeat(${e(de)}, minmax(0, 1fr));`);
                                        },
                                        [
                                          () => s()("customEmoji.recent"),
                                          () => s()("customEmoji.recent"),
                                          () => s()("customEmoji.frequent"),
                                          () => s()("customEmoji.frequent")
                                        ]
                                      ), Yt(E, "clientHeight", (q) => M(nt, q)), n(O, E);
                                    }, ze = (O) => {
                                      var E = Co();
                                      Yt(E, "clientHeight", (X) => M(nt, X)), n(O, E);
                                    };
                                    ne(ye, (O) => {
                                      e(Ft) ? O(He) : O(ze, -1);
                                    });
                                  }
                                  var ce = W(ye, 2), Oe = T(ce);
                                  xt(Oe, 21, () => e(ur), (O) => O.identityKey, (O, E) => {
                                    var X = y(), Te = p(X);
                                    {
                                      let gt = i(() => [e(E).shortcode]);
                                      $(Te, () => kt, (Ne, Ue) => {
                                        Ue(Ne, {
                                          get value() {
                                            return e(E).identityKey;
                                          },
                                          get keywords() {
                                            return e(gt);
                                          },
                                          class: "emoji-item",
                                          onSelect: () => vt(e(E)),
                                          get onmousedown() {
                                            return G;
                                          },
                                          get ontouchstart() {
                                            return jt;
                                          },
                                          children: (Fe, Gt) => {
                                            var Y = $o();
                                            ve(() => {
                                              H(Y, "src", e(E).src), H(Y, "alt", `:${e(E).shortcode}:`), H(Y, "title", `:${e(E).shortcode}:`);
                                            }), Ct("load", Y, () => ut(e(E).src)), $t(Y), n(Fe, Y);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      });
                                    }
                                    n(O, X);
                                  }), I(Oe), I(ce), ve(() => {
                                    Ae(ce, `height: ${e(cr)}px;`), Ae(Oe, `transform: translateY(${e(mr)}px); grid-template-columns: repeat(${e(de)}, minmax(0, 1fr)); grid-auto-rows: ${we}px;`);
                                  }), n(Q, ie);
                                };
                                ne(Ir, (Q) => {
                                  e(ar) || !e(te) ? Q(Sr) : e(Qe).length === 0 && !e(Ft) ? Q(Pr, 1) : Q(Lr, -1);
                                });
                              }
                              n(Re, qt);
                            },
                            $$slots: { default: !0 }
                          });
                        }), n(_e, U);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                  var rt = W(pe, 2);
                  $(rt, () => Yr, (Le, be) => {
                    be(Le, {
                      orientation: "vertical",
                      class: "scrollbar",
                      children: (_e, ht) => {
                        var U = y(), V = p(U);
                        $(V, () => Zr, (K, B) => {
                          B(K, { class: "scrollbar-thumb" });
                        }), n(_e, U);
                      },
                      $$slots: { default: !0 }
                    });
                  }), n(Se, Pe);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var Kt = W(tt, 2), Bt = T(Kt);
          {
            let $e = i(() => s()("customEmoji.search_placeholder"));
            $(Bt, () => er, (Me, Ie) => {
              Ie(Me, {
                class: "custom-emoji-search",
                get placeholder() {
                  return e($e);
                },
                get value() {
                  return e(R);
                },
                set value(Se) {
                  M(R, Se, !0);
                }
              });
            });
          }
          var $r = W(Bt, 2);
          {
            let $e = i(() => s()("customEmoji.editor_toolbar"));
            $($r, () => or, (Me, Ie) => {
              Ie(Me, {
                class: "custom-emoji-editor-toolbar",
                orientation: "horizontal",
                loop: !1,
                get "aria-label"() {
                  return e($e);
                },
                children: (Se, Mr) => {
                  var Pe = Ho(), pe = p(Pe), rt = T(pe);
                  {
                    let U = i(() => s()("customEmoji.move_left"));
                    $(rt, () => Be, (V, K) => {
                      K(V, {
                        class: "custom-emoji-editor-button left",
                        get "aria-label"() {
                          return e(U);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: br,
                        children: (B, Re) => {
                          var ae = So();
                          n(B, ae);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var Le = W(rt, 2);
                  {
                    let U = i(() => s()("customEmoji.move_right"));
                    $(Le, () => Be, (V, K) => {
                      K(V, {
                        class: "custom-emoji-editor-button right",
                        get "aria-label"() {
                          return e(U);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: _r,
                        children: (B, Re) => {
                          var ae = Po();
                          n(B, ae);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  I(pe);
                  var be = W(pe, 2), _e = T(be);
                  {
                    let U = i(() => s()("customEmoji.insert_line_break"));
                    $(_e, () => Be, (V, K) => {
                      K(V, {
                        class: "custom-emoji-editor-button line-break",
                        get "aria-label"() {
                          return e(U);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: wr,
                        children: (B, Re) => {
                          var ae = Lo();
                          n(B, ae);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var ht = W(_e, 2);
                  {
                    let U = i(() => s()("customEmoji.delete_backward"));
                    $(ht, () => Be, (V, K) => {
                      K(V, {
                        class: "custom-emoji-editor-button delete",
                        get "aria-label"() {
                          return e(U);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: yr,
                        children: (B, Re) => {
                          var ae = Ro();
                          n(B, ae);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  I(be), n(Se, Pe);
                },
                $$slots: { default: !0 }
              });
            });
          }
          I(Kt), n(et, Ce);
        },
        $$slots: { default: !0 }
      });
    });
  }
  I(fe), Br(fe, (r) => st = r, () => st), ve(
    (r, j) => {
      H(fe, "data-resizing", e(A)), Ae(fe, e(vr)), H(ue, "aria-label", r), H(ue, "aria-valuemin", Ve), H(ue, "aria-valuenow", e(he)), H(ue, "aria-valuemax", j);
    },
    [
      () => s()("customEmoji.resize"),
      () => fr()
    ]
  ), Jt("pointerdown", ue, xr), Jt("keydown", ue, pr), n(P, fe);
  var Cr = ke(jr);
  return h(), Cr;
}
ho(["pointerdown", "keydown"]);
je(
  No,
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
  No as default
};
