import { N as l, bj as Y, ek as Rr, bh as I, Q as ie, bk as X, bl as Ge, bm as qe, bn as We, el as Hr, a$ as zr, em as Tr, b6 as Or, b7 as Zt, e8 as Ur, be as Dr, ba as Ar, bf as Fr, M as Nr, en as Kr, an as Br, eo as Wt, aS as $, S as Vr, W as Gr, ep as qr, eq as wt, er as Wr, es as Jr, et as Yr, eu as Zr, ev as Qr, a_ as q, X as Xr, a0 as xt, ew as kt, U as R, ex as jt, V as Ne, ey as we, ez as eo, eA as Ke, _ as to, $ as ro, eB as oo, eC as ao, eD as so, eE as io, eF as no, eG as lo, eH as co } from "./App-Ck79ufzA.js";
import { a9 as uo, u as Qt, b7 as Je, b0 as xe, b1 as y, b2 as p, b3 as n, b4 as ke, b5 as d, a as e, b8 as O, n as at, b9 as M, b6 as je, aS as s, ba as w, b as C, aO as Be, aT as se, aK as mo, Z as ve, ap as Jt, aR as vo, bf as W, bh as ho, bi as Et, bD as $t, aq as go, bj as fo, bg as Ct } from "./entry-CLkZn30j.js";
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
  observe(t, i) {
    var c = this.#e.get(t) || /* @__PURE__ */ new Set();
    return c.add(i), this.#e.set(t, c), this.#o().observe(t, this.#r), () => {
      var h = this.#e.get(t);
      h.delete(i), h.size === 0 && (this.#e.delete(t), this.#t.unobserve(t));
    };
  }
  #o() {
    return this.#t ?? (this.#t = new ResizeObserver(
      /** @param {any} entries */
      (t) => {
        for (var i of t) {
          Mt.entries.set(i.target, i);
          for (var c of this.#e.get(i.target) || [])
            c(i);
        }
      }
    ));
  }
}
var po = /* @__PURE__ */ new Mt({
  box: "border-box"
});
function Yt(S, t, i) {
  var c = po.observe(S, () => i(S[t]));
  uo(() => (Qt(() => i(S[t])), c));
}
var bo = w("<div><!></div>");
function Xt(S, t) {
  const i = Je();
  xe(t, !0);
  let c = l(t, "id", 23, () => Y(i)), h = l(t, "ref", 15, null), g = l(t, "children", 7), f = l(t, "child", 7), v = l(t, "forceMount", 7, !1), _ = We(t, [
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
  }), b = s(() => qe(x.props, _));
  var P = {
    get id() {
      return c();
    },
    set id(m = Y(i)) {
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
          var N = y(), ee = p(N);
          X(ee, f, () => ({ props: e(b) })), n(F, N);
        }, L = (F) => {
          var N = bo();
          Ge(N, () => ({ ...e(b) }));
          var ee = O(N);
          X(ee, () => g() ?? at), M(N), n(F, N);
        };
        ie(r, (F) => {
          f() ? F(u) : F(L, -1);
        });
      }
      n(m, a);
    };
    ie(H, (m) => {
      x.shouldRender && m(U);
    });
  }
  return n(S, k), ke(P);
}
je(Xt, { id: {}, ref: {}, children: {}, child: {}, forceMount: {} }, [], [], { mode: "open" });
var _o = w("<input/>");
function er(S, t) {
  const i = Je();
  xe(t, !0);
  let c = l(t, "value", 15, ""), h = l(t, "autofocus", 7, !1), g = l(t, "id", 23, () => Y(i)), f = l(t, "ref", 15, null), v = l(t, "child", 7), _ = We(t, [
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
  }), b = s(() => qe(_, x.props));
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
    set id(a = Y(i)) {
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
      Ge(r, () => ({ ...e(b) }), void 0, void 0, void 0, void 0, !0), zr(r, c), n(a, r);
    };
    ie(H, (a) => {
      v() ? a(U) : a(m, -1);
    });
  }
  return n(S, k), ke(P);
}
je(er, { value: {}, autofocus: {}, id: {}, ref: {}, child: {} }, [], [], { mode: "open" });
var yo = w("<div><!></div>");
function tr(S, t) {
  const i = Je();
  xe(t, !0);
  let c = l(t, "progress", 7, 0), h = l(t, "id", 23, () => Y(i)), g = l(t, "ref", 15, null), f = l(t, "children", 7), v = l(t, "child", 7), _ = We(t, [
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
  const x = Tr.create({
    id: I(() => h()),
    ref: I(() => g(), (a) => g(a)),
    progress: I(() => c())
  }), b = s(() => qe(_, x.props));
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
    set id(a = Y(i)) {
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
      var u = O(r);
      X(u, () => f() ?? at), M(r), n(a, r);
    };
    ie(H, (a) => {
      v() ? a(U) : a(m, -1);
    });
  }
  return n(S, k), ke(P);
}
je(tr, { progress: {}, id: {}, ref: {}, children: {}, child: {} }, [], [], { mode: "open" });
const ot = Fr({
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
    this.opts = t, this.attachment = Zt(this.opts.ref), this.rovingFocusGroup = new Ur({
      orientation: this.opts.orientation,
      loop: this.opts.loop,
      rootNode: this.opts.ref,
      candidateAttr: ot.item
    });
  }
  #e = s(() => ({
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
    C(this.#e, t);
  }
}
class St {
  static create(t) {
    return new St(t, rr.get());
  }
  opts;
  root;
  attachment;
  constructor(t, i) {
    this.opts = t, this.root = i, this.attachment = Zt(this.opts.ref), Be(() => {
      C(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
    }), this.onkeydown = this.onkeydown.bind(this);
  }
  onkeydown(t) {
    this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, t);
  }
  #e = se(0);
  #t = s(() => {
    if (!this.opts.ref.current) return;
    if (this.opts.ref.current.tagName !== "BUTTON") return "button";
  });
  #r = s(() => ({
    id: this.opts.id.current,
    [ot.item]: "",
    [ot.button]: "",
    role: e(this.#t),
    tabindex: e(this.#e),
    "data-disabled": Ar(this.opts.disabled.current),
    "data-orientation": this.root.opts.orientation.current,
    disabled: Dr(this.opts.disabled.current),
    //
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return e(this.#r);
  }
  set props(t) {
    C(this.#r, t);
  }
}
var wo = w("<div><!></div>");
function or(S, t) {
  const i = Je();
  xe(t, !0);
  let c = l(t, "ref", 15, null), h = l(t, "id", 23, () => Y(i)), g = l(t, "orientation", 7, "horizontal"), f = l(t, "loop", 7, !0), v = l(t, "child", 7), _ = l(t, "children", 7), x = We(t, [
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
  }), P = s(() => qe(x, b.props));
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
    set id(r = Y(i)) {
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
      var L = O(u);
      X(L, () => _() ?? at), M(u), n(r, u);
    };
    ie(U, (r) => {
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
function Ve(S, t) {
  const i = Je();
  xe(t, !0);
  let c = l(t, "child", 7), h = l(t, "children", 7), g = l(t, "disabled", 7, !1), f = l(t, "type", 7, "button"), v = l(t, "id", 23, () => Y(i)), _ = l(t, "ref", 15, null), x = We(t, [
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
  }), P = s(() => qe(x, b.props, { type: f() }));
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
    set id(r = Y(i)) {
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
      var L = O(u);
      X(L, () => h() ?? at), M(u), n(r, u);
    };
    ie(U, (r) => {
      c() ? r(m) : r(a, -1);
    });
  }
  return n(S, H), ke(k);
}
je(
  Ve,
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
var ko = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), jo = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), Eo = w('<div class="svelte-u7m8y9"><section class="custom-emoji-usage-section svelte-u7m8y9"><div class="custom-emoji-usage-title svelte-u7m8y9"> </div> <div class="custom-emoji-usage-grid svelte-u7m8y9"></div></section> <section class="custom-emoji-usage-section svelte-u7m8y9"><div class="custom-emoji-usage-title svelte-u7m8y9"> </div> <div class="custom-emoji-usage-grid svelte-u7m8y9"></div></section></div>'), $o = w('<div class="svelte-u7m8y9"></div>'), Co = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), Mo = w('<!> <div class="emoji-virtual-list svelte-u7m8y9"><div class="emoji-grid svelte-u7m8y9"></div></div>', 1), Io = w("<!> <!>", 1), So = w('<span class="caret-left-icon svg-icon svelte-u7m8y9"></span>'), Po = w('<span class="caret-right-icon svg-icon svelte-u7m8y9"></span>'), Lo = w('<span class="enter-key-icon svg-icon svelte-u7m8y9"></span>'), Ro = w('<span class="delete-left-icon svg-icon svelte-u7m8y9"></span>'), Ho = w('<div class="arrow-keys svelte-u7m8y9"><!> <!></div> <div class="line-break-delete svelte-u7m8y9"><!> <!></div>', 1), zo = w('<!> <div class="custom-emoji-search-row svelte-u7m8y9"><!> <!></div>', 1), To = w('<div class="custom-emoji-picker svelte-u7m8y9"><div class="resize-handle svelte-u7m8y9" role="separator" tabindex="0" aria-orientation="horizontal"></div> <!></div>');
const Oo = {
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
  xe(t, !0), Nr(S, Oo);
  const i = () => to(ro, "$_", c), [c, h] = Gr(), g = 3, f = 8, v = vo();
  let _ = l(t, "rxNostr", 7), x = l(t, "pubkey", 7), b = l(t, "open", 7, !1), P = l(t, "maxHeight", 7, null), k = l(t, "customEmojiUsageItems", 23, () => []), H = l(t, "onSelect", 7), U = l(t, "onMoveCaretLeft", 7), m = l(t, "onMoveCaretRight", 7), a = l(t, "onDeleteBackward", 7), r = l(t, "onInsertLineBreak", 7), u = l(t, "hostCustomEmojiItems", 7), L = se(""), F = se(mo(Kr)), N = se(!1), ee = se(!1), st = se(0), Pt = se(800), te = null, ne = null, it = null, nt = se(0), Ye, Ze, Lt = !1, Rt, Ht, zt = !1, Tt, Ot;
  const Ut = /* @__PURE__ */ new Set();
  let Dt = s(() => u() ?? wt.items), ar = s(() => u() === void 0 && wt.loading), Qe = s(() => {
    const o = e(L).trim().toLowerCase();
    return o ? e(Dt).filter((z) => z.shortcodeLower.includes(o)) : e(Dt);
  }), At = s(() => e(L).trim().length === 0 && k().length > 0), le = s(() => Math.max(1, Math.floor(e(Pt) / we))), Ft = s(() => co(e(le))), sr = s(() => k().slice(0, e(Ft))), ir = s(() => [...k()].sort(lo).slice(0, e(Ft))), lt = s(() => Math.ceil(e(Qe).length / e(le))), he = s(() => Math.max(Ke, e(F))), Nt = s(() => Math.ceil(e(he) / we) + g * 2), dt = s(() => Math.max(0, Math.min(Math.max(0, e(lt) - e(Nt)), Math.floor(Math.max(0, e(st) - e(nt)) / we) - g))), nr = s(() => Math.min(e(lt), e(dt) + e(Nt))), lr = s(() => e(dt) * e(le)), dr = s(() => Math.min(e(Qe).length, e(nr) * e(le))), cr = s(() => e(Qe).slice(e(lr), e(dr))), ur = s(() => e(lt) * we + f), mr = s(() => e(dt) * we), Kt = s(() => Number.isFinite(P()) ? Math.max(Ke, Math.floor(P())) : void 0), ge = s(() => e(Kt) === void 0 ? void 0 : e(Kt)), vr = s(() => `--custom-emoji-picker-resize-handle-height: ${ao}px; --custom-emoji-picker-resize-handle-overlap: ${so}px; --custom-emoji-picker-search-row-height: ${io}px;`);
  function hr() {
    const o = window.visualViewport?.width ?? window.innerWidth ?? 800;
    C(Pt, Math.min(800, Math.max(1, o)), !0);
  }
  function ct(o) {
    u() === void 0 && (Ut.has(o) || (Ut.add(o), oo([o])));
  }
  function Xe() {
    const o = window.visualViewport?.height ?? 0, z = qr();
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
    C(F, no(v, o, Xe(), e(ge)), !0);
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
  Br(() => (C(F, Wt(v, Xe(), e(ge)), !0), ut(), window.addEventListener("resize", re), window.visualViewport?.addEventListener("resize", re), window.visualViewport?.addEventListener("scroll", re), () => {
    ne !== null && (cancelAnimationFrame(ne), ne = null), window.removeEventListener("resize", re), window.visualViewport?.removeEventListener("resize", re), window.visualViewport?.removeEventListener("scroll", re);
  })), Be(() => {
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
  }), Be(() => {
    const o = b() && (!Lt || _() !== Rt || x() !== Ht);
    if (Lt = b(), Rt = _(), Ht = x(), te !== null && (cancelAnimationFrame(te), te = null), !b() || !o) {
      b() || C(ee, !1);
      return;
    }
    return C(ee, !1), te = requestAnimationFrame(() => {
      te = null, C(ee, !0);
    }), () => {
      te !== null && (cancelAnimationFrame(te), te = null);
    };
  }), Be(() => {
    const o = b() && (!zt || e(L) !== Tt || x() !== Ot);
    zt = b(), Tt = e(L), Ot = x(), o && (C(st, 0), it?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
  }), Be(() => {
    e(ge), C(F, Wt(v, Xe(), e(ge)), !0);
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
    C(N, !0);
    const et = ($e) => {
      $e.preventDefault();
      const tt = ce + (z - $e.clientY);
      mt(tt);
    }, Ee = () => {
      C(N, !1), window.removeEventListener("pointermove", et), window.removeEventListener("pointerup", Ee), window.removeEventListener("pointercancel", Ee);
    };
    window.addEventListener("pointermove", et), window.addEventListener("pointerup", Ee), window.addEventListener("pointercancel", Ee);
  }
  function xr(o) {
    C(st, o.currentTarget.scrollTop, !0);
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
  }, fe = To(), de = O(fe), jr = W(de, 2);
  {
    let o = s(() => i()("customEmoji.search_label"));
    $(jr, () => eo, (z, ce) => {
      ce(z, {
        class: "custom-emoji-command",
        get label() {
          return e(o);
        },
        shouldFilter: !1,
        loop: !0,
        children: (et, Ee) => {
          var $e = zo(), tt = p($e);
          {
            let Ce = s(() => `height: ${e(he)}px;`);
            $(tt, () => Wr, (Me, Ie) => {
              Ie(Me, {
                type: "auto",
                class: "custom-emoji-scroll-root",
                get style() {
                  return e(Ce);
                },
                children: (Se, Cr) => {
                  var Pe = Io(), pe = p(Pe);
                  $(pe, () => Jr, (Le, be) => {
                    be(Le, {
                      class: "custom-emoji-scroll-viewport",
                      onscroll: xr,
                      children: (_e, ht) => {
                        var D = y(), K = p(D);
                        $(K, () => Yr, (B, V) => {
                          V(B, {
                            class: "custom-emoji-list",
                            children: (Re, oe) => {
                              var Gt = y(), Mr = p(Gt);
                              {
                                var Ir = (Z) => {
                                  var ae = y(), ye = p(ae);
                                  $(ye, () => tr, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ue, Te) => {
                                        {
                                          let T = s(() => i()("customEmoji.loading"));
                                          Xr(ue, {
                                            showLoader: !0,
                                            get text() {
                                              return e(T);
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
                                  $(ye, () => Xt, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ue, Te) => {
                                        fo();
                                        var T = ho();
                                        ve((j) => Et(T, j), [() => i()("customEmoji.empty")]), n(ue, T);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), n(Z, ae);
                                }, Pr = (Z) => {
                                  var ae = Mo(), ye = p(ae);
                                  {
                                    var He = (T) => {
                                      var j = Eo(), Q = O(j), Oe = O(Q), gt = O(Oe, !0);
                                      M(Oe);
                                      var Ue = W(Oe, 2);
                                      xt(Ue, 21, () => e(sr), (G) => G.identityKey, (G, E) => {
                                        var me = y(), Fe = p(me);
                                        {
                                          let ft = s(() => `recent:${e(E).identityKey}`), pt = s(() => [e(E).shortcode]);
                                          $(Fe, () => kt, (bt, _t) => {
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
                                                var A = ko();
                                                ve(() => {
                                                  R(A, "src", e(E).src), R(A, "alt", `:${e(E).shortcode}:`), R(A, "title", `:${e(E).shortcode}:`);
                                                }), $t("load", A, () => ct(e(E).src)), Ct(A), n(yt, A);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(G, me);
                                      }), M(Ue), M(Q);
                                      var De = W(Q, 2), Ae = O(De), qt = O(Ae, !0);
                                      M(Ae);
                                      var J = W(Ae, 2);
                                      xt(J, 21, () => e(ir), (G) => G.identityKey, (G, E) => {
                                        var me = y(), Fe = p(me);
                                        {
                                          let ft = s(() => `frequent:${e(E).identityKey}`), pt = s(() => [e(E).shortcode]);
                                          $(Fe, () => kt, (bt, _t) => {
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
                                                var A = jo();
                                                ve(() => {
                                                  R(A, "src", e(E).src), R(A, "alt", `:${e(E).shortcode}:`), R(A, "title", `:${e(E).shortcode}:`);
                                                }), $t("load", A, () => ct(e(E).src)), Ct(A), n(yt, A);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(G, me);
                                      }), M(J), M(De), M(j), ve(
                                        (G, E, me, Fe) => {
                                          R(Q, "aria-label", G), Et(gt, E), Ne(Ue, `grid-template-columns: repeat(${e(le)}, minmax(0, 1fr));`), R(De, "aria-label", me), Et(qt, Fe), Ne(J, `grid-template-columns: repeat(${e(le)}, minmax(0, 1fr));`);
                                        },
                                        [
                                          () => i()("customEmoji.recent"),
                                          () => i()("customEmoji.recent"),
                                          () => i()("customEmoji.frequent"),
                                          () => i()("customEmoji.frequent")
                                        ]
                                      ), Yt(j, "clientHeight", (G) => C(nt, G)), n(T, j);
                                    }, ze = (T) => {
                                      var j = $o();
                                      Yt(j, "clientHeight", (Q) => C(nt, Q)), n(T, j);
                                    };
                                    ie(ye, (T) => {
                                      e(At) ? T(He) : T(ze, -1);
                                    });
                                  }
                                  var ue = W(ye, 2), Te = O(ue);
                                  xt(Te, 21, () => e(cr), (T) => T.identityKey, (T, j) => {
                                    var Q = y(), Oe = p(Q);
                                    {
                                      let gt = s(() => [e(j).shortcode]);
                                      $(Oe, () => kt, (Ue, De) => {
                                        De(Ue, {
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
                                          children: (Ae, qt) => {
                                            var J = Co();
                                            ve(() => {
                                              R(J, "src", e(j).src), R(J, "alt", `:${e(j).shortcode}:`), R(J, "title", `:${e(j).shortcode}:`);
                                            }), $t("load", J, () => ct(e(j).src)), Ct(J), n(Ae, J);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      });
                                    }
                                    n(T, Q);
                                  }), M(Te), M(ue), ve(() => {
                                    Ne(ue, `height: ${e(ur)}px;`), Ne(Te, `transform: translateY(${e(mr)}px); grid-template-columns: repeat(${e(le)}, minmax(0, 1fr)); grid-auto-rows: ${we}px;`);
                                  }), n(Z, ae);
                                };
                                ie(Mr, (Z) => {
                                  e(ar) || !e(ee) ? Z(Ir) : e(Qe).length === 0 && !e(At) ? Z(Sr, 1) : Z(Pr, -1);
                                });
                              }
                              n(Re, Gt);
                            },
                            $$slots: { default: !0 }
                          });
                        }), n(_e, D);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                  var rt = W(pe, 2);
                  $(rt, () => Zr, (Le, be) => {
                    be(Le, {
                      orientation: "vertical",
                      class: "scrollbar",
                      children: (_e, ht) => {
                        var D = y(), K = p(D);
                        $(K, () => Qr, (B, V) => {
                          V(B, { class: "scrollbar-thumb" });
                        }), n(_e, D);
                      },
                      $$slots: { default: !0 }
                    });
                  }), n(Se, Pe);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var Bt = W(tt, 2), Vt = O(Bt);
          {
            let Ce = s(() => i()("customEmoji.search_placeholder"));
            $(Vt, () => er, (Me, Ie) => {
              Ie(Me, {
                class: "custom-emoji-search",
                get placeholder() {
                  return e(Ce);
                },
                get value() {
                  return e(L);
                },
                set value(Se) {
                  C(L, Se, !0);
                }
              });
            });
          }
          var $r = W(Vt, 2);
          {
            let Ce = s(() => i()("customEmoji.editor_toolbar"));
            $($r, () => or, (Me, Ie) => {
              Ie(Me, {
                class: "custom-emoji-editor-toolbar",
                orientation: "horizontal",
                loop: !1,
                get "aria-label"() {
                  return e(Ce);
                },
                children: (Se, Cr) => {
                  var Pe = Ho(), pe = p(Pe), rt = O(pe);
                  {
                    let D = s(() => i()("customEmoji.move_left"));
                    $(rt, () => Ve, (K, B) => {
                      B(K, {
                        class: "custom-emoji-editor-button left",
                        get "aria-label"() {
                          return e(D);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: pr,
                        children: (V, Re) => {
                          var oe = So();
                          n(V, oe);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var Le = W(rt, 2);
                  {
                    let D = s(() => i()("customEmoji.move_right"));
                    $(Le, () => Ve, (K, B) => {
                      B(K, {
                        class: "custom-emoji-editor-button right",
                        get "aria-label"() {
                          return e(D);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: br,
                        children: (V, Re) => {
                          var oe = Po();
                          n(V, oe);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  M(pe);
                  var be = W(pe, 2), _e = O(be);
                  {
                    let D = s(() => i()("customEmoji.insert_line_break"));
                    $(_e, () => Ve, (K, B) => {
                      B(K, {
                        class: "custom-emoji-editor-button line-break",
                        get "aria-label"() {
                          return e(D);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: yr,
                        children: (V, Re) => {
                          var oe = Lo();
                          n(V, oe);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var ht = W(_e, 2);
                  {
                    let D = s(() => i()("customEmoji.delete_backward"));
                    $(ht, () => Ve, (K, B) => {
                      B(K, {
                        class: "custom-emoji-editor-button delete",
                        get "aria-label"() {
                          return e(D);
                        },
                        get onmousedown() {
                          return q;
                        },
                        get ontouchstart() {
                          return q;
                        },
                        onclick: _r,
                        children: (V, Re) => {
                          var oe = Ro();
                          n(V, oe);
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
          M(Bt), n(et, $e);
        },
        $$slots: { default: !0 }
      });
    });
  }
  M(fe), Vr(fe, (o) => it = o, () => it), ve(
    (o, z) => {
      R(fe, "data-resizing", e(N)), Ne(fe, e(vr)), R(de, "aria-label", o), R(de, "aria-valuemin", Ke), R(de, "aria-valuenow", e(he)), R(de, "aria-valuemax", z);
    },
    [
      () => i()("customEmoji.resize"),
      () => gr()
    ]
  ), Jt("pointerdown", de, wr), Jt("keydown", de, fr), n(S, fe);
  var Er = ke(kr);
  return h(), Er;
}
go(["pointerdown", "keydown"]);
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
