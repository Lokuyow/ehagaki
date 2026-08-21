import { a8 as l, bc as Z, ew as Rr, ba as I, aa as ie, bd as ee, be as Ge, bf as qe, bg as Je, ex as Hr, ey as zr, a$ as Or, b0 as Yt, b8 as Tr, b5 as Nr, b1 as Fr, b9 as Ur, a7 as Dr, ez as Ar, aG as Vr, eA as qt, bm as M, ab as Br, ac as Kr, eB as yt, eC as Gr, eD as qr, eE as Jr, eF as Wr, eG as Yr, bv as G, eH as Zr, ae as R, af as Ae, eI as Ve, aj as Qr, ak as Xr, eJ as eo, eK as to, eL as ro, eM as oo, ag as ao, al as wt, eN as xt, eO as kt, eP as we, eQ as io, eR as so, eS as no } from "./App-1qWol-Cs.js";
import { a9 as lo, u as Zt, b5 as We, a_ as xe, a$ as y, b0 as p, b1 as n, b2 as ke, b3 as c, a as e, b6 as T, n as rt, b7 as P, b4 as je, aP as i, b8 as w, b as C, aN as Be, aQ as ae, aJ as co, Z as ve, ap as Jt, aO as uo, bd as q, aq as mo, bf as vo, bg as ho, bh as jt, bj as Et, be as $t } from "./entry-De5pG27L.js";
import { b as go } from "./input-C3JkTJyC.js";
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
    var d = this.#e.get(t) || /* @__PURE__ */ new Set();
    return d.add(s), this.#e.set(t, d), this.#o().observe(t, this.#r), () => {
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
          for (var d of this.#e.get(s.target) || [])
            d(s);
        }
      }
    ));
  }
}
var fo = /* @__PURE__ */ new Mt({
  box: "border-box"
});
function Wt(S, t, s) {
  var d = fo.observe(S, () => s(S[t]));
  lo(() => (Zt(() => s(S[t])), d));
}
var po = w("<div><!></div>");
function Qt(S, t) {
  const s = We();
  xe(t, !0);
  let d = l(t, "id", 23, () => Z(s)), h = l(t, "ref", 15, null), g = l(t, "children", 7), f = l(t, "child", 7), v = l(t, "forceMount", 7, !1), _ = Je(t, [
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
    id: I(() => d()),
    ref: I(() => h(), (m) => h(m)),
    forceMount: I(() => v())
  }), b = i(() => qe(x.props, _));
  var L = {
    get id() {
      return d();
    },
    set id(m = Z(s)) {
      d(m), c();
    },
    get ref() {
      return h();
    },
    set ref(m = null) {
      h(m), c();
    },
    get children() {
      return g();
    },
    set children(m) {
      g(m), c();
    },
    get child() {
      return f();
    },
    set child(m) {
      f(m), c();
    },
    get forceMount() {
      return v();
    },
    set forceMount(m = !1) {
      v(m), c();
    }
  }, k = y(), H = p(k);
  {
    var N = (m) => {
      var a = y(), r = p(a);
      {
        var u = (J) => {
          var D = y(), se = p(D);
          ee(se, f, () => ({ props: e(b) })), n(J, D);
        }, O = (J) => {
          var D = po();
          Ge(D, () => ({ ...e(b) }));
          var se = T(D);
          ee(se, () => g() ?? rt), P(D), n(J, D);
        };
        ie(r, (J) => {
          f() ? J(u) : J(O, -1);
        });
      }
      n(m, a);
    };
    ie(H, (m) => {
      x.shouldRender && m(N);
    });
  }
  return n(S, k), ke(L);
}
je(Qt, { id: {}, ref: {}, children: {}, child: {}, forceMount: {} }, [], [], { mode: "open" });
var bo = w("<input/>");
function Xt(S, t) {
  const s = We();
  xe(t, !0);
  let d = l(t, "value", 15, ""), h = l(t, "autofocus", 7, !1), g = l(t, "id", 23, () => Z(s)), f = l(t, "ref", 15, null), v = l(t, "child", 7), _ = Je(t, [
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
    value: I(() => d(), (a) => {
      d(a);
    }),
    autofocus: I(() => h() ?? !1)
  }), b = i(() => qe(_, x.props));
  var L = {
    get value() {
      return d();
    },
    set value(a = "") {
      d(a), c();
    },
    get autofocus() {
      return h();
    },
    set autofocus(a = !1) {
      h(a), c();
    },
    get id() {
      return g();
    },
    set id(a = Z(s)) {
      g(a), c();
    },
    get ref() {
      return f();
    },
    set ref(a = null) {
      f(a), c();
    },
    get child() {
      return v();
    },
    set child(a) {
      v(a), c();
    }
  }, k = y(), H = p(k);
  {
    var N = (a) => {
      var r = y(), u = p(r);
      ee(u, v, () => ({ props: e(b) })), n(a, r);
    }, m = (a) => {
      var r = bo();
      Ge(r, () => ({ ...e(b) }), void 0, void 0, void 0, void 0, !0), go(r, d), n(a, r);
    };
    ie(H, (a) => {
      v() ? a(N) : a(m, -1);
    });
  }
  return n(S, k), ke(L);
}
je(Xt, { value: {}, autofocus: {}, id: {}, ref: {}, child: {} }, [], [], { mode: "open" });
var _o = w("<div><!></div>");
function er(S, t) {
  const s = We();
  xe(t, !0);
  let d = l(t, "progress", 7, 0), h = l(t, "id", 23, () => Z(s)), g = l(t, "ref", 15, null), f = l(t, "children", 7), v = l(t, "child", 7), _ = Je(t, [
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
    progress: I(() => d())
  }), b = i(() => qe(_, x.props));
  var L = {
    get progress() {
      return d();
    },
    set progress(a = 0) {
      d(a), c();
    },
    get id() {
      return h();
    },
    set id(a = Z(s)) {
      h(a), c();
    },
    get ref() {
      return g();
    },
    set ref(a = null) {
      g(a), c();
    },
    get children() {
      return f();
    },
    set children(a) {
      f(a), c();
    },
    get child() {
      return v();
    },
    set child(a) {
      v(a), c();
    }
  }, k = y(), H = p(k);
  {
    var N = (a) => {
      var r = y(), u = p(r);
      ee(u, v, () => ({ props: e(b) })), n(a, r);
    }, m = (a) => {
      var r = _o();
      Ge(r, () => ({ ...e(b) }));
      var u = T(r);
      ee(u, () => f() ?? rt), P(r), n(a, r);
    };
    ie(H, (a) => {
      v() ? a(N) : a(m, -1);
    });
  }
  return n(S, k), ke(L);
}
je(er, { progress: {}, id: {}, ref: {}, children: {}, child: {} }, [], [], { mode: "open" });
const tt = Ur({
  component: "toolbar",
  parts: ["root", "item", "group", "group-item", "link", "button"]
}), tr = new Or("Toolbar.Root");
class Ct {
  static create(t) {
    return tr.set(new Ct(t));
  }
  opts;
  rovingFocusGroup;
  attachment;
  constructor(t) {
    this.opts = t, this.attachment = Yt(this.opts.ref), this.rovingFocusGroup = new Tr({
      orientation: this.opts.orientation,
      loop: this.opts.loop,
      rootNode: this.opts.ref,
      candidateAttr: tt.item
    });
  }
  #e = i(() => ({
    id: this.opts.id.current,
    role: "toolbar",
    "data-orientation": this.opts.orientation.current,
    [tt.root]: "",
    ...this.attachment
  }));
  get props() {
    return e(this.#e);
  }
  set props(t) {
    C(this.#e, t);
  }
}
class Pt {
  static create(t) {
    return new Pt(t, tr.get());
  }
  opts;
  root;
  attachment;
  constructor(t, s) {
    this.opts = t, this.root = s, this.attachment = Yt(this.opts.ref), Be(() => {
      C(this.#e, this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current), !0);
    }), this.onkeydown = this.onkeydown.bind(this);
  }
  onkeydown(t) {
    this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, t);
  }
  #e = ae(0);
  #t = i(() => {
    if (!this.opts.ref.current) return;
    if (this.opts.ref.current.tagName !== "BUTTON") return "button";
  });
  #r = i(() => ({
    id: this.opts.id.current,
    [tt.item]: "",
    [tt.button]: "",
    role: e(this.#t),
    tabindex: e(this.#e),
    "data-disabled": Fr(this.opts.disabled.current),
    "data-orientation": this.root.opts.orientation.current,
    disabled: Nr(this.opts.disabled.current),
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
var yo = w("<div><!></div>");
function rr(S, t) {
  const s = We();
  xe(t, !0);
  let d = l(t, "ref", 15, null), h = l(t, "id", 23, () => Z(s)), g = l(t, "orientation", 7, "horizontal"), f = l(t, "loop", 7, !0), v = l(t, "child", 7), _ = l(t, "children", 7), x = Je(t, [
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
  const b = Ct.create({
    id: I(() => h()),
    orientation: I(() => g()),
    loop: I(() => f()),
    ref: I(() => d(), (r) => d(r))
  }), L = i(() => qe(x, b.props));
  var k = {
    get ref() {
      return d();
    },
    set ref(r = null) {
      d(r), c();
    },
    get id() {
      return h();
    },
    set id(r = Z(s)) {
      h(r), c();
    },
    get orientation() {
      return g();
    },
    set orientation(r = "horizontal") {
      g(r), c();
    },
    get loop() {
      return f();
    },
    set loop(r = !0) {
      f(r), c();
    },
    get child() {
      return v();
    },
    set child(r) {
      v(r), c();
    },
    get children() {
      return _();
    },
    set children(r) {
      _(r), c();
    }
  }, H = y(), N = p(H);
  {
    var m = (r) => {
      var u = y(), O = p(u);
      ee(O, v, () => ({ props: e(L) })), n(r, u);
    }, a = (r) => {
      var u = yo();
      Ge(u, () => ({ ...e(L) }));
      var O = T(u);
      ee(O, () => _() ?? rt), P(u), n(r, u);
    };
    ie(N, (r) => {
      v() ? r(m) : r(a, -1);
    });
  }
  return n(S, H), ke(k);
}
je(
  rr,
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
var wo = w("<button><!></button>");
function Ke(S, t) {
  const s = We();
  xe(t, !0);
  let d = l(t, "child", 7), h = l(t, "children", 7), g = l(t, "disabled", 7, !1), f = l(t, "type", 7, "button"), v = l(t, "id", 23, () => Z(s)), _ = l(t, "ref", 15, null), x = Je(t, [
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
  const b = Pt.create({
    id: I(() => v()),
    disabled: I(() => g() ?? !1),
    ref: I(() => _(), (r) => _(r))
  }), L = i(() => qe(x, b.props, { type: f() }));
  var k = {
    get child() {
      return d();
    },
    set child(r) {
      d(r), c();
    },
    get children() {
      return h();
    },
    set children(r) {
      h(r), c();
    },
    get disabled() {
      return g();
    },
    set disabled(r = !1) {
      g(r), c();
    },
    get type() {
      return f();
    },
    set type(r = "button") {
      f(r), c();
    },
    get id() {
      return v();
    },
    set id(r = Z(s)) {
      v(r), c();
    },
    get ref() {
      return _();
    },
    set ref(r = null) {
      _(r), c();
    }
  }, H = y(), N = p(H);
  {
    var m = (r) => {
      var u = y(), O = p(u);
      ee(O, d, () => ({ props: e(L) })), n(r, u);
    }, a = (r) => {
      var u = wo();
      Ge(u, () => ({ ...e(L) }));
      var O = T(u);
      ee(O, () => h() ?? rt), P(u), n(r, u);
    };
    ie(N, (r) => {
      d() ? r(m) : r(a, -1);
    });
  }
  return n(S, H), ke(k);
}
je(
  Ke,
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
var xo = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), ko = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), jo = w('<div class="svelte-u7m8y9"><section class="custom-emoji-usage-section svelte-u7m8y9"><div class="custom-emoji-usage-title svelte-u7m8y9"> </div> <div class="custom-emoji-usage-grid svelte-u7m8y9"></div></section> <section class="custom-emoji-usage-section svelte-u7m8y9"><div class="custom-emoji-usage-title svelte-u7m8y9"> </div> <div class="custom-emoji-usage-grid svelte-u7m8y9"></div></section></div>'), Eo = w('<div class="svelte-u7m8y9"></div>'), $o = w('<img class="emoji-image svelte-u7m8y9" draggable="false" loading="lazy" decoding="async"/>'), Mo = w('<!> <div class="emoji-virtual-list svelte-u7m8y9"><div class="emoji-grid svelte-u7m8y9"></div></div>', 1), Co = w("<!> <!>", 1), Po = w('<span class="caret-left-icon svg-icon svelte-u7m8y9"></span>'), Io = w('<span class="caret-right-icon svg-icon svelte-u7m8y9"></span>'), So = w('<span class="enter-key-icon svg-icon svelte-u7m8y9"></span>'), Lo = w('<span class="delete-left-icon svg-icon svelte-u7m8y9"></span>'), Ro = w('<div class="arrow-keys svelte-u7m8y9"><!> <!></div> <div class="line-break-delete svelte-u7m8y9"><!> <!></div>', 1), Ho = w('<!> <div class="custom-emoji-search-row svelte-u7m8y9"><!> <!></div>', 1), zo = w('<div class="custom-emoji-picker svelte-u7m8y9"><div class="resize-handle svelte-u7m8y9" role="separator" tabindex="0" aria-orientation="horizontal"></div> <!></div>');
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
function To(S, t) {
  xe(t, !0), Dr(S, Oo);
  const s = () => Qr(Xr, "$_", d), [d, h] = Kr(), g = 3, f = 8, v = uo();
  let _ = l(t, "rxNostr", 7), x = l(t, "pubkey", 7), b = l(t, "open", 7, !1), L = l(t, "maxHeight", 7, null), k = l(t, "customEmojiUsageItems", 23, () => []), H = l(t, "onSelect", 7), N = l(t, "onMoveCaretLeft", 7), m = l(t, "onMoveCaretRight", 7), a = l(t, "onDeleteBackward", 7), r = l(t, "onInsertLineBreak", 7), u = ae(""), O = ae(co(Ar)), J = ae(!1), D = ae(!1), se = ae(0), It = ae(800), te = null, ne = null, ot = null, at = ae(0), it, st, St = !1, Lt, Rt, Ht = !1, zt, Ot;
  const Tt = /* @__PURE__ */ new Set();
  let Nt = i(() => yt.items), or = i(() => yt.loading), Ye = i(() => {
    const o = e(u).trim().toLowerCase();
    return o ? e(Nt).filter((j) => j.shortcodeLower.includes(o)) : e(Nt);
  }), Ft = i(() => e(u).trim().length === 0 && k().length > 0), le = i(() => Math.max(1, Math.floor(e(It) / we))), Ut = i(() => no(e(le))), ar = i(() => k().slice(0, e(Ut))), ir = i(() => [...k()].sort(so).slice(0, e(Ut))), nt = i(() => Math.ceil(e(Ye).length / e(le))), he = i(() => Math.max(Ve, e(O))), Dt = i(() => Math.ceil(e(he) / we) + g * 2), lt = i(() => Math.max(0, Math.min(Math.max(0, e(nt) - e(Dt)), Math.floor(Math.max(0, e(se) - e(at)) / we) - g))), sr = i(() => Math.min(e(nt), e(lt) + e(Dt))), nr = i(() => e(lt) * e(le)), lr = i(() => Math.min(e(Ye).length, e(sr) * e(le))), cr = i(() => e(Ye).slice(e(nr), e(lr))), dr = i(() => e(nt) * we + f), ur = i(() => e(lt) * we), At = i(() => Number.isFinite(L()) ? Math.max(Ve, Math.floor(L())) : void 0), ge = i(() => e(At) === void 0 ? void 0 : e(At)), mr = i(() => `--custom-emoji-picker-resize-handle-height: ${eo}px; --custom-emoji-picker-resize-handle-overlap: ${to}px; --custom-emoji-picker-search-row-height: ${ro}px;`);
  function vr() {
    const o = window.visualViewport?.width ?? window.innerWidth ?? 800;
    C(It, Math.min(800, Math.max(1, o)), !0);
  }
  function ct(o) {
    Tt.has(o) || (Tt.add(o), io([o]));
  }
  function hr(o) {
    if (typeof document > "u") return 0;
    const j = getComputedStyle(document.documentElement).getPropertyValue(o).trim(), W = Number.parseFloat(j);
    return Number.isFinite(W) ? W : 0;
  }
  function Ze() {
    const o = window.visualViewport?.height ?? 0, j = hr("--keyboard-height");
    return Math.max(window.innerHeight || 0, o + j, o, 800);
  }
  function dt() {
    vr();
  }
  function gr() {
    if (typeof window > "u")
      return Ve;
    const o = Ze(), j = Math.floor(o * 0.6);
    return Math.max(Ve, e(ge) === void 0 ? j : e(ge));
  }
  function ut(o) {
    C(O, oo(v, o, Ze(), e(ge)), !0);
  }
  function fr(o) {
    if (o.key === "ArrowUp") {
      o.preventDefault(), ut(e(he) + 24);
      return;
    }
    o.key === "ArrowDown" && (o.preventDefault(), ut(e(he) - 24));
  }
  function ce() {
    ne !== null && cancelAnimationFrame(ne), ne = requestAnimationFrame(() => {
      ne = null, dt();
    });
  }
  Vr(() => (C(O, qt(v, Ze(), e(ge)), !0), dt(), window.addEventListener("resize", ce), window.visualViewport?.addEventListener("resize", ce), window.visualViewport?.addEventListener("scroll", ce), () => {
    ne !== null && (cancelAnimationFrame(ne), ne = null), window.removeEventListener("resize", ce), window.visualViewport?.removeEventListener("resize", ce), window.visualViewport?.removeEventListener("scroll", ce);
  })), Be(() => {
    const o = b(), j = _(), W = x();
    if (!o) {
      it = void 0, st = void 0;
      return;
    }
    (j !== it || W !== st) && (it = j, st = W, Zt(() => yt.load({ rxNostr: j, pubkey: W }))), ce();
  }), Be(() => {
    const o = b() && (!St || _() !== Lt || x() !== Rt);
    if (St = b(), Lt = _(), Rt = x(), te !== null && (cancelAnimationFrame(te), te = null), !b() || !o) {
      b() || C(D, !1);
      return;
    }
    return C(D, !1), te = requestAnimationFrame(() => {
      te = null, C(D, !0);
    }), () => {
      te !== null && (cancelAnimationFrame(te), te = null);
    };
  }), Be(() => {
    const o = b() && (!Ht || e(u) !== zt || x() !== Ot);
    Ht = b(), zt = e(u), Ot = x(), o && (C(se, 0), ot?.querySelector(".custom-emoji-scroll-viewport")?.scrollTo({ top: 0 }));
  }), Be(() => {
    e(ge), C(O, qt(v, Ze(), e(ge)), !0);
  });
  function mt(o) {
    H()?.(o);
  }
  function pr() {
    N()?.();
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
    o.preventDefault(), dt();
    const j = o.clientY, W = e(he);
    C(J, !0);
    const Qe = ($e) => {
      $e.preventDefault();
      const Xe = W + (j - $e.clientY);
      ut(Xe);
    }, Ee = () => {
      C(J, !1), window.removeEventListener("pointermove", Qe), window.removeEventListener("pointerup", Ee), window.removeEventListener("pointercancel", Ee);
    };
    window.addEventListener("pointermove", Qe), window.addEventListener("pointerup", Ee), window.addEventListener("pointercancel", Ee);
  }
  function xr(o) {
    C(se, o.currentTarget.scrollTop, !0);
  }
  var kr = {
    get rxNostr() {
      return _();
    },
    set rxNostr(o) {
      _(o), c();
    },
    get pubkey() {
      return x();
    },
    set pubkey(o) {
      x(o), c();
    },
    get open() {
      return b();
    },
    set open(o = !1) {
      b(o), c();
    },
    get maxHeight() {
      return L();
    },
    set maxHeight(o = null) {
      L(o), c();
    },
    get customEmojiUsageItems() {
      return k();
    },
    set customEmojiUsageItems(o = []) {
      k(o), c();
    },
    get onSelect() {
      return H();
    },
    set onSelect(o) {
      H(o), c();
    },
    get onMoveCaretLeft() {
      return N();
    },
    set onMoveCaretLeft(o) {
      N(o), c();
    },
    get onMoveCaretRight() {
      return m();
    },
    set onMoveCaretRight(o) {
      m(o), c();
    },
    get onDeleteBackward() {
      return a();
    },
    set onDeleteBackward(o) {
      a(o), c();
    },
    get onInsertLineBreak() {
      return r();
    },
    set onInsertLineBreak(o) {
      r(o), c();
    }
  }, fe = zo(), de = T(fe), jr = q(de, 2);
  {
    let o = i(() => s()("customEmoji.search_label"));
    M(jr, () => Zr, (j, W) => {
      W(j, {
        class: "custom-emoji-command",
        get label() {
          return e(o);
        },
        shouldFilter: !1,
        loop: !0,
        children: (Qe, Ee) => {
          var $e = Ho(), Xe = p($e);
          {
            let Me = i(() => `height: ${e(he)}px;`);
            M(Xe, () => Gr, (Ce, Pe) => {
              Pe(Ce, {
                type: "auto",
                class: "custom-emoji-scroll-root",
                get style() {
                  return e(Me);
                },
                children: (Ie, Mr) => {
                  var Se = Co(), pe = p(Se);
                  M(pe, () => qr, (Le, be) => {
                    be(Le, {
                      class: "custom-emoji-scroll-viewport",
                      onscroll: xr,
                      children: (_e, vt) => {
                        var F = y(), A = p(F);
                        M(A, () => Jr, (V, B) => {
                          B(V, {
                            class: "custom-emoji-list",
                            children: (Re, re) => {
                              var Kt = y(), Cr = p(Kt);
                              {
                                var Pr = (Q) => {
                                  var oe = y(), ye = p(oe);
                                  M(ye, () => er, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ue, Oe) => {
                                        {
                                          let z = i(() => s()("customEmoji.loading"));
                                          ao(ue, {
                                            showLoader: !0,
                                            get text() {
                                              return e(z);
                                            },
                                            customClass: "custom-emoji-loading"
                                          });
                                        }
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), n(Q, oe);
                                }, Ir = (Q) => {
                                  var oe = y(), ye = p(oe);
                                  M(ye, () => Qt, (He, ze) => {
                                    ze(He, {
                                      class: "custom-emoji-message",
                                      children: (ue, Oe) => {
                                        vo();
                                        var z = ho();
                                        ve((E) => jt(z, E), [() => s()("customEmoji.empty")]), n(ue, z);
                                      },
                                      $$slots: { default: !0 }
                                    });
                                  }), n(Q, oe);
                                }, Sr = (Q) => {
                                  var oe = Mo(), ye = p(oe);
                                  {
                                    var He = (z) => {
                                      var E = jo(), X = T(E), Te = T(X), ht = T(Te, !0);
                                      P(Te);
                                      var Ne = q(Te, 2);
                                      wt(Ne, 21, () => e(ar), (K) => K.identityKey, (K, $) => {
                                        var me = y(), De = p(me);
                                        {
                                          let gt = i(() => `recent:${e($).identityKey}`), ft = i(() => [e($).shortcode]);
                                          M(De, () => xt, (pt, bt) => {
                                            bt(pt, {
                                              get value() {
                                                return e(gt);
                                              },
                                              get keywords() {
                                                return e(ft);
                                              },
                                              class: "emoji-item custom-emoji-usage-item",
                                              onSelect: () => mt(e($)),
                                              get onmousedown() {
                                                return G;
                                              },
                                              get ontouchstart() {
                                                return kt;
                                              },
                                              children: (_t, Lr) => {
                                                var U = xo();
                                                ve(() => {
                                                  R(U, "src", e($).src), R(U, "alt", `:${e($).shortcode}:`), R(U, "title", `:${e($).shortcode}:`);
                                                }), Et("load", U, () => ct(e($).src)), $t(U), n(_t, U);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(K, me);
                                      }), P(Ne), P(X);
                                      var Fe = q(X, 2), Ue = T(Fe), Gt = T(Ue, !0);
                                      P(Ue);
                                      var Y = q(Ue, 2);
                                      wt(Y, 21, () => e(ir), (K) => K.identityKey, (K, $) => {
                                        var me = y(), De = p(me);
                                        {
                                          let gt = i(() => `frequent:${e($).identityKey}`), ft = i(() => [e($).shortcode]);
                                          M(De, () => xt, (pt, bt) => {
                                            bt(pt, {
                                              get value() {
                                                return e(gt);
                                              },
                                              get keywords() {
                                                return e(ft);
                                              },
                                              class: "emoji-item custom-emoji-usage-item",
                                              onSelect: () => mt(e($)),
                                              get onmousedown() {
                                                return G;
                                              },
                                              get ontouchstart() {
                                                return kt;
                                              },
                                              children: (_t, Lr) => {
                                                var U = ko();
                                                ve(() => {
                                                  R(U, "src", e($).src), R(U, "alt", `:${e($).shortcode}:`), R(U, "title", `:${e($).shortcode}:`);
                                                }), Et("load", U, () => ct(e($).src)), $t(U), n(_t, U);
                                              },
                                              $$slots: { default: !0 }
                                            });
                                          });
                                        }
                                        n(K, me);
                                      }), P(Y), P(Fe), P(E), ve(
                                        (K, $, me, De) => {
                                          R(X, "aria-label", K), jt(ht, $), Ae(Ne, `grid-template-columns: repeat(${e(le)}, minmax(0, 1fr));`), R(Fe, "aria-label", me), jt(Gt, De), Ae(Y, `grid-template-columns: repeat(${e(le)}, minmax(0, 1fr));`);
                                        },
                                        [
                                          () => s()("customEmoji.recent"),
                                          () => s()("customEmoji.recent"),
                                          () => s()("customEmoji.frequent"),
                                          () => s()("customEmoji.frequent")
                                        ]
                                      ), Wt(E, "clientHeight", (K) => C(at, K)), n(z, E);
                                    }, ze = (z) => {
                                      var E = Eo();
                                      Wt(E, "clientHeight", (X) => C(at, X)), n(z, E);
                                    };
                                    ie(ye, (z) => {
                                      e(Ft) ? z(He) : z(ze, -1);
                                    });
                                  }
                                  var ue = q(ye, 2), Oe = T(ue);
                                  wt(Oe, 21, () => e(cr), (z) => z.identityKey, (z, E) => {
                                    var X = y(), Te = p(X);
                                    {
                                      let ht = i(() => [e(E).shortcode]);
                                      M(Te, () => xt, (Ne, Fe) => {
                                        Fe(Ne, {
                                          get value() {
                                            return e(E).identityKey;
                                          },
                                          get keywords() {
                                            return e(ht);
                                          },
                                          class: "emoji-item",
                                          onSelect: () => mt(e(E)),
                                          get onmousedown() {
                                            return G;
                                          },
                                          get ontouchstart() {
                                            return kt;
                                          },
                                          children: (Ue, Gt) => {
                                            var Y = $o();
                                            ve(() => {
                                              R(Y, "src", e(E).src), R(Y, "alt", `:${e(E).shortcode}:`), R(Y, "title", `:${e(E).shortcode}:`);
                                            }), Et("load", Y, () => ct(e(E).src)), $t(Y), n(Ue, Y);
                                          },
                                          $$slots: { default: !0 }
                                        });
                                      });
                                    }
                                    n(z, X);
                                  }), P(Oe), P(ue), ve(() => {
                                    Ae(ue, `height: ${e(dr)}px;`), Ae(Oe, `transform: translateY(${e(ur)}px); grid-template-columns: repeat(${e(le)}, minmax(0, 1fr)); grid-auto-rows: ${we}px;`);
                                  }), n(Q, oe);
                                };
                                ie(Cr, (Q) => {
                                  e(or) || !e(D) ? Q(Pr) : e(Ye).length === 0 && !e(Ft) ? Q(Ir, 1) : Q(Sr, -1);
                                });
                              }
                              n(Re, Kt);
                            },
                            $$slots: { default: !0 }
                          });
                        }), n(_e, F);
                      },
                      $$slots: { default: !0 }
                    });
                  });
                  var et = q(pe, 2);
                  M(et, () => Wr, (Le, be) => {
                    be(Le, {
                      orientation: "vertical",
                      class: "scrollbar",
                      children: (_e, vt) => {
                        var F = y(), A = p(F);
                        M(A, () => Yr, (V, B) => {
                          B(V, { class: "scrollbar-thumb" });
                        }), n(_e, F);
                      },
                      $$slots: { default: !0 }
                    });
                  }), n(Ie, Se);
                },
                $$slots: { default: !0 }
              });
            });
          }
          var Vt = q(Xe, 2), Bt = T(Vt);
          {
            let Me = i(() => s()("customEmoji.search_placeholder"));
            M(Bt, () => Xt, (Ce, Pe) => {
              Pe(Ce, {
                class: "custom-emoji-search",
                get placeholder() {
                  return e(Me);
                },
                get value() {
                  return e(u);
                },
                set value(Ie) {
                  C(u, Ie, !0);
                }
              });
            });
          }
          var $r = q(Bt, 2);
          {
            let Me = i(() => s()("customEmoji.editor_toolbar"));
            M($r, () => rr, (Ce, Pe) => {
              Pe(Ce, {
                class: "custom-emoji-editor-toolbar",
                orientation: "horizontal",
                loop: !1,
                get "aria-label"() {
                  return e(Me);
                },
                children: (Ie, Mr) => {
                  var Se = Ro(), pe = p(Se), et = T(pe);
                  {
                    let F = i(() => s()("customEmoji.move_left"));
                    M(et, () => Ke, (A, V) => {
                      V(A, {
                        class: "custom-emoji-editor-button left",
                        get "aria-label"() {
                          return e(F);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: pr,
                        children: (B, Re) => {
                          var re = Po();
                          n(B, re);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var Le = q(et, 2);
                  {
                    let F = i(() => s()("customEmoji.move_right"));
                    M(Le, () => Ke, (A, V) => {
                      V(A, {
                        class: "custom-emoji-editor-button right",
                        get "aria-label"() {
                          return e(F);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: br,
                        children: (B, Re) => {
                          var re = Io();
                          n(B, re);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  P(pe);
                  var be = q(pe, 2), _e = T(be);
                  {
                    let F = i(() => s()("customEmoji.insert_line_break"));
                    M(_e, () => Ke, (A, V) => {
                      V(A, {
                        class: "custom-emoji-editor-button line-break",
                        get "aria-label"() {
                          return e(F);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: yr,
                        children: (B, Re) => {
                          var re = So();
                          n(B, re);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  var vt = q(_e, 2);
                  {
                    let F = i(() => s()("customEmoji.delete_backward"));
                    M(vt, () => Ke, (A, V) => {
                      V(A, {
                        class: "custom-emoji-editor-button delete",
                        get "aria-label"() {
                          return e(F);
                        },
                        get onmousedown() {
                          return G;
                        },
                        get ontouchstart() {
                          return G;
                        },
                        onclick: _r,
                        children: (B, Re) => {
                          var re = Lo();
                          n(B, re);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                  }
                  P(be), n(Ie, Se);
                },
                $$slots: { default: !0 }
              });
            });
          }
          P(Vt), n(Qe, $e);
        },
        $$slots: { default: !0 }
      });
    });
  }
  P(fe), Br(fe, (o) => ot = o, () => ot), ve(
    (o, j) => {
      R(fe, "data-resizing", e(J)), Ae(fe, e(mr)), R(de, "aria-label", o), R(de, "aria-valuemin", Ve), R(de, "aria-valuenow", e(he)), R(de, "aria-valuemax", j);
    },
    [
      () => s()("customEmoji.resize"),
      () => gr()
    ]
  ), Jt("pointerdown", de, wr), Jt("keydown", de, fr), n(S, fe);
  var Er = ke(kr);
  return h(), Er;
}
mo(["pointerdown", "keydown"]);
je(
  To,
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
    onInsertLineBreak: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  To as default
};
