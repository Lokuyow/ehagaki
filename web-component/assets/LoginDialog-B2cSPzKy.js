import { aX as mr, aY as Nt, aZ as Cn, a_ as Nn, a$ as Cr, b0 as Nr, b1 as kn, b2 as kr, b3 as pn, b4 as wr, b5 as Dr, a8 as d, b6 as J, aa as V, b7 as fn, b8 as Oe, b9 as Ke, ba as kt, bb as wt, bc as Dt, a7 as wn, bd as Pr, ae as Fe, be as Lr, bf as Sr, bg as qr, bh as ve, bi as Be, aW as Tr, ac as Rr, bj as hn, bk as Er, bl as $r, bm as _n, aj as Vr, ak as Ar, bn as Ir, ag as Te, bo as mt, al as Mr, bp as jt, bq as Or, ab as bn, ad as yn, br as Ct, bs as Kr, bt as xn, bu as Ur } from "./App-Cyoa6Q_G.js";
import { aP as l, a as e, b as s, aQ as Q, aN as Re, aJ as Dn, b5 as Pt, a_ as et, a$ as ne, b0 as R, b1 as i, b2 as tt, b3 as c, b4 as nt, b6 as o, n as Lt, b7 as a, b8 as _, Z as D, bd as u, bg as Pe, bh as k, aq as zr, bf as Je, ap as Bt, bj as mn } from "./entry-kEWtxODC.js";
import { b as Hr } from "./input-BJQbH0OM.js";
import { D as Wr, a as jr } from "./DialogWrapper-C1cagKHZ.js";
import { I as Br } from "./InfoPopoverButton-CzQP4pAS.js";
const ct = Dr({
  component: "tabs",
  parts: ["root", "list", "trigger", "content"]
}), St = new mr("Tabs.Root");
class Qt {
  static create(t) {
    return St.set(new Qt(t));
  }
  opts;
  attachment;
  rovingFocusGroup;
  #e = Q(Dn([]));
  get triggerIds() {
    return e(this.#e);
  }
  set triggerIds(t) {
    s(this.#e, t, !0);
  }
  valueToTriggerId = new pn();
  valueToContentId = new pn();
  constructor(t) {
    this.opts = t, this.attachment = Nt(t.ref), this.rovingFocusGroup = new wr({
      candidateAttr: ct.trigger,
      rootNode: this.opts.ref,
      loop: this.opts.loop,
      orientation: this.opts.orientation
    });
  }
  registerTrigger(t, n) {
    return this.triggerIds.push(t), this.valueToTriggerId.set(n, t), () => {
      this.triggerIds = this.triggerIds.filter((x) => x !== t), this.valueToTriggerId.delete(n);
    };
  }
  registerContent(t, n) {
    return this.valueToContentId.set(n, t), () => {
      this.valueToContentId.delete(n);
    };
  }
  setValue(t) {
    this.opts.value.current = t;
  }
  #t = l(() => ({
    id: this.opts.id.current,
    "data-orientation": this.opts.orientation.current,
    [ct.root]: "",
    ...this.attachment
  }));
  get props() {
    return e(this.#t);
  }
  set props(t) {
    s(this.#t, t);
  }
}
class Yt {
  static create(t) {
    return new Yt(t, St.get());
  }
  opts;
  root;
  attachment;
  #e = l(() => this.root.opts.disabled.current);
  constructor(t, n) {
    this.opts = t, this.root = n, this.attachment = Nt(t.ref);
  }
  #t = l(() => ({
    id: this.opts.id.current,
    role: "tablist",
    "aria-orientation": this.root.opts.orientation.current,
    "data-orientation": this.root.opts.orientation.current,
    [ct.list]: "",
    "data-disabled": Cn(e(this.#e)),
    ...this.attachment
  }));
  get props() {
    return e(this.#t);
  }
  set props(t) {
    s(this.#t, t);
  }
}
class Xt {
  static create(t) {
    return new Xt(t, St.get());
  }
  opts;
  root;
  attachment;
  #e = Q(0);
  #t = l(() => this.root.opts.value.current === this.opts.value.current);
  #n = l(() => this.opts.disabled.current || this.root.opts.disabled.current);
  #a = l(() => this.root.valueToContentId.get(this.opts.value.current));
  constructor(t, n) {
    this.opts = t, this.root = n, this.attachment = Nt(t.ref), Nn([() => this.opts.id.current, () => this.opts.value.current], ([x, m]) => this.root.registerTrigger(x, m)), Re(() => {
      this.root.triggerIds.length, e(this.#t) || !this.root.opts.value.current ? s(this.#e, 0) : s(this.#e, -1);
    }), this.onfocus = this.onfocus.bind(this), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
  }
  #r() {
    this.root.opts.value.current !== this.opts.value.current && this.root.setValue(this.opts.value.current);
  }
  onfocus(t) {
    this.root.opts.activationMode.current !== "automatic" || e(this.#n) || this.#r();
  }
  onclick(t) {
    e(this.#n) || this.#r();
  }
  onkeydown(t) {
    if (!e(this.#n)) {
      if (t.key === Cr || t.key === Nr) {
        t.preventDefault(), this.#r();
        return;
      }
      this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, t);
    }
  }
  #i = l(() => ({
    id: this.opts.id.current,
    role: "tab",
    "data-state": Pn(e(this.#t)),
    "data-value": this.opts.value.current,
    "data-orientation": this.root.opts.orientation.current,
    "data-disabled": Cn(e(this.#n)),
    "aria-selected": kr(e(this.#t)),
    "aria-controls": e(this.#a),
    [ct.trigger]: "",
    disabled: kn(e(this.#n)),
    tabindex: e(this.#e),
    //
    onclick: this.onclick,
    onfocus: this.onfocus,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return e(this.#i);
  }
  set props(t) {
    s(this.#i, t);
  }
}
class Zt {
  static create(t) {
    return new Zt(t, St.get());
  }
  opts;
  root;
  attachment;
  #e = l(() => this.root.opts.value.current === this.opts.value.current);
  #t = l(() => this.root.valueToTriggerId.get(this.opts.value.current));
  constructor(t, n) {
    this.opts = t, this.root = n, this.attachment = Nt(t.ref), Nn([() => this.opts.id.current, () => this.opts.value.current], ([x, m]) => this.root.registerContent(x, m));
  }
  #n = l(() => ({
    id: this.opts.id.current,
    role: "tabpanel",
    hidden: kn(!e(this.#e)),
    tabindex: 0,
    "data-value": this.opts.value.current,
    "data-state": Pn(e(this.#e)),
    "aria-labelledby": e(this.#t),
    "data-orientation": this.root.opts.orientation.current,
    [ct.content]: "",
    ...this.attachment
  }));
  get props() {
    return e(this.#n);
  }
  set props(t) {
    s(this.#n, t);
  }
}
function Pn(ee) {
  return ee ? "active" : "inactive";
}
var Fr = _("<div><!></div>");
function Ln(ee, t) {
  const n = Pt();
  et(t, !0);
  let x = d(t, "id", 23, () => Oe(n)), m = d(t, "ref", 15, null), b = d(t, "value", 15, ""), y = d(t, "onValueChange", 7, fn), E = d(t, "orientation", 7, "horizontal"), j = d(t, "loop", 7, !0), M = d(t, "activationMode", 7, "automatic"), Y = d(t, "disabled", 7, !1), C = d(t, "children", 7), L = d(t, "child", 7), ae = Dt(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "id",
    "ref",
    "value",
    "onValueChange",
    "orientation",
    "loop",
    "activationMode",
    "disabled",
    "children",
    "child"
  ]);
  const ue = Qt.create({
    id: J(() => x()),
    value: J(() => b(), (p) => {
      b(p), y()(p);
    }),
    orientation: J(() => E()),
    loop: J(() => j()),
    activationMode: J(() => M()),
    disabled: J(() => Y()),
    ref: J(() => m(), (p) => m(p))
  }), N = l(() => wt(ae, ue.props));
  var f = {
    get id() {
      return x();
    },
    set id(p = Oe(n)) {
      x(p), c();
    },
    get ref() {
      return m();
    },
    set ref(p = null) {
      m(p), c();
    },
    get value() {
      return b();
    },
    set value(p = "") {
      b(p), c();
    },
    get onValueChange() {
      return y();
    },
    set onValueChange(p = fn) {
      y(p), c();
    },
    get orientation() {
      return E();
    },
    set orientation(p = "horizontal") {
      E(p), c();
    },
    get loop() {
      return j();
    },
    set loop(p = !0) {
      j(p), c();
    },
    get activationMode() {
      return M();
    },
    set activationMode(p = "automatic") {
      M(p), c();
    },
    get disabled() {
      return Y();
    },
    set disabled(p = !1) {
      Y(p), c();
    },
    get children() {
      return C();
    },
    set children(p) {
      C(p), c();
    },
    get child() {
      return L();
    },
    set child(p) {
      L(p), c();
    }
  }, $ = ne(), g = R($);
  {
    var re = (p) => {
      var P = ne(), Ee = R(P);
      Ke(Ee, L, () => ({ props: e(N) })), i(p, P);
    }, ye = (p) => {
      var P = Fr();
      kt(P, () => ({ ...e(N) }));
      var Ee = o(P);
      Ke(Ee, () => C() ?? Lt), a(P), i(p, P);
    };
    V(g, (p) => {
      L() ? p(re) : p(ye, -1);
    });
  }
  return i(ee, $), tt(f);
}
nt(
  Ln,
  {
    id: {},
    ref: {},
    value: {},
    onValueChange: {},
    orientation: {},
    loop: {},
    activationMode: {},
    disabled: {},
    children: {},
    child: {}
  },
  [],
  [],
  { mode: "open" }
);
var Gr = _("<div><!></div>");
function Ft(ee, t) {
  const n = Pt();
  et(t, !0);
  let x = d(t, "children", 7), m = d(t, "child", 7), b = d(t, "id", 23, () => Oe(n)), y = d(t, "ref", 15, null), E = d(t, "value", 7), j = Dt(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "children",
    "child",
    "id",
    "ref",
    "value"
  ]);
  const M = Zt.create({
    value: J(() => E()),
    id: J(() => b()),
    ref: J(() => y(), (f) => y(f))
  }), Y = l(() => wt(j, M.props));
  var C = {
    get children() {
      return x();
    },
    set children(f) {
      x(f), c();
    },
    get child() {
      return m();
    },
    set child(f) {
      m(f), c();
    },
    get id() {
      return b();
    },
    set id(f = Oe(n)) {
      b(f), c();
    },
    get ref() {
      return y();
    },
    set ref(f = null) {
      y(f), c();
    },
    get value() {
      return E();
    },
    set value(f) {
      E(f), c();
    }
  }, L = ne(), ae = R(L);
  {
    var ue = (f) => {
      var $ = ne(), g = R($);
      Ke(g, m, () => ({ props: e(Y) })), i(f, $);
    }, N = (f) => {
      var $ = Gr();
      kt($, () => ({ ...e(Y) }));
      var g = o($);
      Ke(g, () => x() ?? Lt), a($), i(f, $);
    };
    V(ae, (f) => {
      m() ? f(ue) : f(N, -1);
    });
  }
  return i(ee, L), tt(C);
}
nt(Ft, { children: {}, child: {}, id: {}, ref: {}, value: {} }, [], [], { mode: "open" });
var Qr = _("<div><!></div>");
function Sn(ee, t) {
  const n = Pt();
  et(t, !0);
  let x = d(t, "child", 7), m = d(t, "children", 7), b = d(t, "id", 23, () => Oe(n)), y = d(t, "ref", 15, null), E = Dt(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "id",
    "ref"
  ]);
  const j = Yt.create({
    id: J(() => b()),
    ref: J(() => y(), (N) => y(N))
  }), M = l(() => wt(E, j.props));
  var Y = {
    get child() {
      return x();
    },
    set child(N) {
      x(N), c();
    },
    get children() {
      return m();
    },
    set children(N) {
      m(N), c();
    },
    get id() {
      return b();
    },
    set id(N = Oe(n)) {
      b(N), c();
    },
    get ref() {
      return y();
    },
    set ref(N = null) {
      y(N), c();
    }
  }, C = ne(), L = R(C);
  {
    var ae = (N) => {
      var f = ne(), $ = R(f);
      Ke($, x, () => ({ props: e(M) })), i(N, f);
    }, ue = (N) => {
      var f = Qr();
      kt(f, () => ({ ...e(M) }));
      var $ = o(f);
      Ke($, () => m() ?? Lt), a(f), i(N, f);
    };
    V(L, (N) => {
      x() ? N(ae) : N(ue, -1);
    });
  }
  return i(ee, C), tt(Y);
}
nt(Sn, { child: {}, children: {}, id: {}, ref: {} }, [], [], { mode: "open" });
var Yr = _("<button><!></button>");
function Gt(ee, t) {
  const n = Pt();
  et(t, !0);
  let x = d(t, "child", 7), m = d(t, "children", 7), b = d(t, "disabled", 7, !1), y = d(t, "id", 23, () => Oe(n)), E = d(t, "type", 7, "button"), j = d(t, "value", 7), M = d(t, "ref", 15, null), Y = Dt(t, [
    "$$slots",
    "$$events",
    "$$legacy",
    "$$host",
    "child",
    "children",
    "disabled",
    "id",
    "type",
    "value",
    "ref"
  ]);
  const C = Xt.create({
    id: J(() => y()),
    disabled: J(() => b() ?? !1),
    value: J(() => j()),
    ref: J(() => M(), (g) => M(g))
  }), L = l(() => wt(Y, C.props, { type: E() }));
  var ae = {
    get child() {
      return x();
    },
    set child(g) {
      x(g), c();
    },
    get children() {
      return m();
    },
    set children(g) {
      m(g), c();
    },
    get disabled() {
      return b();
    },
    set disabled(g = !1) {
      b(g), c();
    },
    get id() {
      return y();
    },
    set id(g = Oe(n)) {
      y(g), c();
    },
    get type() {
      return E();
    },
    set type(g = "button") {
      E(g), c();
    },
    get value() {
      return j();
    },
    set value(g) {
      j(g), c();
    },
    get ref() {
      return M();
    },
    set ref(g = null) {
      M(g), c();
    }
  }, ue = ne(), N = R(ue);
  {
    var f = (g) => {
      var re = ne(), ye = R(re);
      Ke(ye, x, () => ({ props: e(L) })), i(g, re);
    }, $ = (g) => {
      var re = Yr();
      kt(re, () => ({ ...e(L) }));
      var ye = o(re);
      Ke(ye, () => m() ?? Lt), a(re), i(g, re);
    };
    V(N, (g) => {
      x() ? g(f) : g($, -1);
    });
  }
  return i(ee, ue), tt(ae);
}
nt(
  Gt,
  {
    child: {},
    children: {},
    disabled: {},
    id: {},
    type: {},
    value: {},
    ref: {}
  },
  [],
  [],
  { mode: "open" }
);
var Xr = _('<div class="qr-code-svg svelte-1pb586e" role="img"></div>'), Zr = _('<div class="qr-code-placeholder svelte-1pb586e" aria-hidden="true"></div>'), Jr = _('<div class="qr-code-frame"><!></div>');
const ei = {
  hash: "svelte-1pb586e",
  code: ".qr-code-svg.svelte-1pb586e {display:flex;justify-content:center;align-items:center;width:100%;}.qr-code-svg.svelte-1pb586e svg {display:block;width:min(100%, 288px);height:auto;background:#ffffff;}.qr-code-placeholder.svelte-1pb586e {width:min(100%, 288px);aspect-ratio:1;border-radius:12px;background:color-mix(in srgb, var(--text) 6%, #ffffff);}"
};
function qn(ee, t) {
  et(t, !0), wn(ee, ei);
  let n = d(t, "value", 7), x = d(t, "label", 7), m = Q(""), b = 0;
  Re(() => {
    const C = n(), L = ++b;
    s(m, ""), C && Pr(C).then((ae) => {
      L !== b || n() !== C || s(m, ae, !0);
    }).catch(() => {
      L === b && s(m, "");
    });
  });
  var y = {
    get value() {
      return n();
    },
    set value(C) {
      n(C), c();
    },
    get label() {
      return x();
    },
    set label(C) {
      x(C), c();
    }
  }, E = Jr(), j = o(E);
  {
    var M = (C) => {
      var L = Xr();
      Lr(L, () => e(m), !0), a(L), D(() => Fe(L, "aria-label", x())), i(C, L);
    }, Y = (C) => {
      var L = Zr();
      i(C, L);
    };
    V(j, (C) => {
      e(m) ? C(M) : C(Y, -1);
    });
  }
  return a(E), D(() => Fe(E, "data-qr-value", n())), i(ee, E), tt(y);
}
nt(qn, { value: {}, label: {} }, [], [], { mode: "open" });
var ti = _('<div><span style="word-break:break-all"> </span></div>'), ni = _('<div><span style="word-break:break-all"> </span></div>'), ri = _('<div class="toast npub-toast svelte-1vy8d2x"><!> <!></div>'), ii = _('<div class="xmark-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div>'), ai = _('<div class="parent-client-icon svg-icon svelte-1vy8d2x"></div> <span class="btn-text svelte-1vy8d2x"> </span>', 1), oi = _('<div class="parent-client-section svelte-1vy8d2x"><!> <div aria-live="polite"> </div></div> <div class="divider svelte-1vy8d2x"><span class="svelte-1vy8d2x"> </span></div>', 1), si = _('<div class="extension-icon svg-icon svelte-1vy8d2x"></div> <span class="btn-text svelte-1vy8d2x"> </span>', 1), li = _('<div aria-live="polite"> </div>'), di = _('<div class="vault-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div> <span class="btn-text svelte-1vy8d2x"> </span>', 1), ci = _("<!> <!>", 1), vi = _('<div class="nostrconnect-qr-shell svelte-1vy8d2x" data-testid="nostrconnect-qr-code"><!></div>'), ui = _('<div class="nostrconnect-qr-loading svelte-1vy8d2x"><!></div>'), gi = _('<div class="copy-icon svg-icon" aria-hidden="true"></div>'), pi = _('<div class="nostrconnect-relay-popover svelte-1vy8d2x"><div> </div> <div> </div> <div> </div></div>'), fi = _('<div class="close-icon svg-icon" aria-hidden="true"></div>'), hi = _('<div class="nostrconnect-relay-row svelte-1vy8d2x"><input type="url" class="nostrconnect-relay-field svelte-1vy8d2x"/> <!></div>'), _i = _('<div class="section-feedback error svelte-1vy8d2x" aria-live="polite" role="alert"> </div>'), bi = _('<!> <div class="nostrconnect-uri-card svelte-1vy8d2x"><div class="nostrconnect-uri svelte-1vy8d2x" data-testid="nostrconnect-uri"><input type="text" readonly="" spellcheck="false" autocomplete="off" class="svelte-1vy8d2x"/> <!></div></div> <div class="section-feedback info nostrconnect-status svelte-1vy8d2x" role="status"><!></div> <div class="nostrconnect-relay-settings svelte-1vy8d2x"><div class="nostrconnect-relay-settings-header"><div class="nostrconnect-relay-settings-title-row svelte-1vy8d2x"><span class="nostrconnect-relay-settings-title svelte-1vy8d2x"> </span> <!></div></div> <div class="nostrconnect-relay-editor-list svelte-1vy8d2x"></div> <div class="nostrconnect-relay-editor-actions svelte-1vy8d2x"><!> <!> <!></div></div> <!>', 1), yi = _('<div class="clear-input-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div>'), xi = _('<div class="section-feedback error svelte-1vy8d2x" aria-live="polite" role="alert"> </div>'), mi = _('<form novalidate="" class="svelte-1vy8d2x"><div class="bunker-input-row svelte-1vy8d2x"><div class="input-shell svelte-1vy8d2x"><input type="password" placeholder="bunker://..." class="bunker-input u-control svelte-1vy8d2x" required="" autocomplete="off"/> <!></div> <!></div> <!></form>'), Ci = _("<!> <!>", 1), Ni = _('<div class="clear-input-icon svg-icon svelte-1vy8d2x" aria-hidden="true"></div>'), ki = _('<div class="divider svelte-1vy8d2x"><span class="svelte-1vy8d2x"> </span></div> <div class="secret-key-section svelte-1vy8d2x"><div class="secret-heading-row svelte-1vy8d2x"><div class="secret-icon svg-icon svelte-1vy8d2x"></div> <h3 class="svelte-1vy8d2x"> </h3></div> <form novalidate="" class="svelte-1vy8d2x"><div class="secret-input-row svelte-1vy8d2x"><div class="input-shell svelte-1vy8d2x"><input type="password" placeholder="nsec1..." class="secret-input u-control svelte-1vy8d2x" id="secretKey" name="secretKey" autocomplete="current-password" required="" minlength="63" maxlength="63"/> <!></div> <!></div></form></div>', 1), wi = _('<!> <div class="nip07-login-section svelte-1vy8d2x"><!> <!></div> <div class="divider svelte-1vy8d2x"><span class="svelte-1vy8d2x"> </span></div> <div class="remote-signer-section svelte-1vy8d2x"><!> <details class="remote-signer-details svelte-1vy8d2x"><summary class="svelte-1vy8d2x"> </summary> <!></details></div> <!>', 1), Di = _("<div> </div>"), Pi = _("<!> <!> <!>", 1);
const Li = {
  hash: "svelte-1vy8d2x",
  code: `.xmark-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}form.svelte-1vy8d2x {width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;}

    /* トースト用スタイル */.toast.svelte-1vy8d2x {position:fixed;top:0px;left:50%;translate:-50% 0;display:flex;width:100%;max-width:500px;background:var(--dialog-bg);color:var(--text);border-radius:0 0 10px 10px;z-index:101;font-family:monospace;font-size:1rem;line-height:1.2;word-break:break-all;flex-direction:column;align-items:flex-start;gap:6px;padding:8px 14px 14px;margin-bottom:8px;}
    @keyframes svelte-1vy8d2x-toast-fadein {
        from {
            opacity: 0;
            translate: -50% -10px;
        }
        to {
            opacity: 0.98;
            translate: -50% 0;
        }
    }.parent-client-section.svelte-1vy8d2x,
    .nip07-login-section.svelte-1vy8d2x {display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;gap:6px;}.parent-client-feedback.svelte-1vy8d2x,
    .section-feedback.svelte-1vy8d2x {font-size:0.95rem;text-align:center;}.parent-client-feedback.info.svelte-1vy8d2x,
    .section-feedback.info.svelte-1vy8d2x {color:var(--text-light);}.parent-client-feedback.error.svelte-1vy8d2x,
    .section-feedback.error.svelte-1vy8d2x {background:var(--balloon-error-bg, hsl(351, 99%, 96%));border:1px solid var(--balloon-error-border, hsl(351, 99%, 70%));color:var(--balloon-error-color, hsl(351, 99%, 32%));}.parent-client-login-button.primary,
    .nip07-login-button.primary,
    .nostrconnect-open-btn.primary {flex-shrink:0;position:relative;overflow:hidden;.btn-text.svelte-1vy8d2x {font-size:1.125rem;}}.parent-client-login-button.loading,
    .nip07-login-button.loading,
    .nostrconnect-open-btn.loading {cursor:not-allowed;}.svg-icon.parent-client-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6163636f756e745f636972636c655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.svg-icon.extension-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-657874656e73696f6e5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:32px;height:32px;}.remote-signer-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:6px;}.secret-key-section.svelte-1vy8d2x {display:flex;flex-direction:column;width:100%;gap:10px;}.remote-signer-panel {display:flex;flex-direction:column;gap:8px;}.remote-signer-details.svelte-1vy8d2x {width:100%;background:var(--dialog-bg2);border-radius:8px;}.remote-signer-details.svelte-1vy8d2x summary:where(.svelte-1vy8d2x) {padding:12px;cursor:pointer;font-weight:600;}.secret-heading-row.svelte-1vy8d2x {display:flex;gap:6px;justify-content:center;align-items:center;width:100%;}.secret-input-row.svelte-1vy8d2x,
    .bunker-input-row.svelte-1vy8d2x {display:flex;gap:6px;width:100%;flex:none;}.input-shell.svelte-1vy8d2x {position:relative;display:flex;align-items:center;flex:1;min-width:0;}.secret-input.svelte-1vy8d2x,
    .bunker-input.svelte-1vy8d2x {font-family:monospace;font-size:1rem;padding:0.6rem 3.25rem 0.6rem 0.6rem;background-color:var(--btn-bg);border:none;flex:1;min-width:0;}.ehagaki-app-root button.clear-input-btn {position:absolute;inset:50% auto 50% auto;right:2px;transform:translateY(-50%);width:46px;min-width:46px;height:46px;min-height:46px;padding:0;display:inline-flex;align-items:center;justify-content:center;--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);flex:0 0 auto;z-index:1;}.ehagaki-app-root button.clear-input-btn:hover:not(:disabled),
    .ehagaki-app-root button.clear-input-btn:active:not(:disabled),
    .ehagaki-app-root button.clear-input-btn:focus-visible,
    .ehagaki-app-root button.clear-input-btn:disabled {--btn-bg: transparent;background-color:transparent;background-image:none;border:none;color:var(--text-muted);}.ehagaki-app-root button.clear-input-btn:focus-visible {outline:2px solid var(--theme);outline-offset:2px;}.clear-input-icon.svelte-1vy8d2x {width:24px;height:24px;mask-image:var(--ehagaki-icon-636c6f73655f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.secret-heading-row.svelte-1vy8d2x h3:where(.svelte-1vy8d2x) {margin:0;}.remote-signer-tabs {display:flex;flex-direction:column;padding:8px;gap:8px;}.remote-signer-tab-list {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}.remote-signer-tab {background:var(--btn-bg);--btn-bg: var(--btn-bg2);color:var(--text);padding:12px 16px;font-size:0.95rem;font-weight:600;cursor:pointer;&[data-value="qr"] {border-start-start-radius:10px;border-end-start-radius:10px;}&[data-value="bunker"] {border-start-end-radius:10px;border-end-end-radius:10px;}}.nostrconnect-qr-shell.svelte-1vy8d2x,
    .nostrconnect-qr-loading.svelte-1vy8d2x {width:100%;}.nostrconnect-qr-loading.svelte-1vy8d2x {min-height:320px;display:flex;align-items:center;justify-content:center;padding:16px;border-radius:16px;background:var(--btn-bg);border:1px solid var(--border-hr);}.nostrconnect-uri-card.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-uri.svelte-1vy8d2x {display:flex;align-items:center;position:relative;height:40px;padding:0 40px 0 12px;background:var(--btn-bg2);border-radius:12px;font-family:monospace;font-size:0.9rem;}.nostrconnect-uri.svelte-1vy8d2x input:where(.svelte-1vy8d2x) {width:100%;border:none;background:transparent;font-family:inherit;font-size:inherit;outline:none;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}button.nostrconnect-copy-btn.circle.copy {position:absolute;inset:auto 2px 2px auto;width:34px;min-width:34px;height:34px;flex:0 0 34px;z-index:1;}button.nostrconnect-copy-btn .copy-icon {width:18px;height:18px;mask-image:var(--ehagaki-icon-66696c655f636f70795f323464705f3030303030305f46494c4c305f776768743430305f47524144305f6f70737a32342e737667);}.nostrconnect-relay-editor-actions.svelte-1vy8d2x {display:flex;flex-wrap:wrap;gap:6px;}.nostrconnect-relay-settings.svelte-1vy8d2x {display:flex;flex-direction:column;gap:6px;padding:2px 12px 12px;background:var(--dialog-bg3);border-radius:16px;}.nostrconnect-relay-settings-title-row.svelte-1vy8d2x {display:flex;align-items:center;}.nostrconnect-relay-settings-title.svelte-1vy8d2x {font-weight:600;}.nostrconnect-relay-popover.svelte-1vy8d2x {display:flex;flex-direction:column;gap:8px;}.nostrconnect-relay-editor-list.svelte-1vy8d2x {display:flex;flex-direction:column;gap:4px;}.nostrconnect-relay-row.svelte-1vy8d2x {display:flex;align-items:stretch;height:40px;.nostrconnect-remove-relay-btn {width:auto;height:auto;border-radius:0 12px 12px 0;--btn-bg: var(--btn-bg3);opacity:1;aspect-ratio:1;.close-icon {--svg: currentColor;width:24px;height:24px;}}}.nostrconnect-relay-field.svelte-1vy8d2x {flex:1;width:auto;height:auto;padding:0 0.75rem;background:var(--btn-bg3);border:none;border-radius:12px 0 0 12px;font-family:monospace;font-size:0.95rem;}.secret-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-6b65795f766572746963616c5f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:28px;height:28px;flex:0 0 28px;display:inline-block;vertical-align:middle;}.vault-icon.svelte-1vy8d2x {mask-image:var(--ehagaki-icon-736869656c645f6c6f636b65645f323464705f3030303030305f46494c4c315f776768743430305f47524144305f6f70737a32342e737667);width:30px;height:30px;display:inline-block;vertical-align:middle;}

    @media (max-width: 600px) {.bunker-input-row.svelte-1vy8d2x,
        .secret-input-row.svelte-1vy8d2x {flex-direction:column;}
    }.divider.svelte-1vy8d2x {display:flex;align-items:center;text-align:center;margin:16px 0;width:100%;}.divider.svelte-1vy8d2x::before,
    .divider.svelte-1vy8d2x::after {content:"";flex:1;height:1px;background:var(--border-hr);}.divider.svelte-1vy8d2x span:where(.svelte-1vy8d2x) {color:var(--text-light);padding:0 16px;font-size:1rem;}input.u-control, button.u-control {min-height:50px;min-width:60px;width:100%;display:inline-flex;align-items:center;}

    @media (min-width: 601px) {.save-btn.u-control, .bunker-connect-btn.u-control {width:120px;}
    }`
};
function Si(ee, t) {
  et(t, !0), wn(ee, Li);
  const n = () => Vr(Ar, "$_", x), [x, m] = Rr();
  let b = d(t, "show", 15, !1), y = d(t, "secretKey", 15), E = d(t, "onClose", 7), j = d(t, "onSave", 7), M = d(t, "onParentClientLogin", 7), Y = d(t, "onNip07Login", 7), C = d(t, "onNip46Login", 7), L = d(t, "onNostrConnectStart", 7), ae = d(t, "onNostrConnectCancel", 7), ue = d(t, "isParentClientAvailable", 7, !1), N = d(t, "isLoadingParentClient", 7, !1), f = d(t, "isNip07ExtensionAvailable", 7, !1), $ = d(t, "isLoadingNip07", 7, !1), g = d(t, "isLoadingNip46", 7, !1), re = d(t, "isPreparingNip46NostrConnect", 7, !1), ye = d(t, "isWaitingNip46NostrConnect", 7, !1), p = d(t, "isHandshakeStartedNip46NostrConnect", 7, !1), P = d(t, "nip46NostrConnectUri", 7, null), Ee = d(t, "nip46NostrConnectErrorMessage", 7, ""), vt = d(t, "initialNostrConnectRelayCandidates", 23, () => []), ut = d(t, "isAddAccountMode", 7, !1), rt = d(t, "localNsecAuthEnabled", 7, !0);
  function Jt() {
    b(!1), E()?.();
  }
  Sr(() => b(), Jt, !0);
  let en = l(f), Tn = l(ue);
  const gt = new qr();
  let Rn = l(() => gt.isValid), qt = l(() => gt.npub), Tt = l(() => gt.nprofile), tn = l(() => n()("clearInput") === "clearInput" ? "入力内容を消去" : n()("clearInput")), I = Q(null), $e = Q(""), ge = Q("qr"), Rt = Q(!1), pt = Q(null), xe = Q(Dn([""])), B = Q(null), Ge = Q(""), Ue = Q(""), pe = Q(""), ft = Q(!1), ht = Q(!1), Ve = Q(!1), ze, Et = Q(null);
  const En = 1200, $n = 6e3;
  function Qe() {
    ze && (clearTimeout(ze), ze = void 0), s(Et, null), s(ht, !1);
  }
  function me() {
    Qe(), s(Ve, !1);
  }
  function Vn() {
    return vt().length > 0 ? [...vt()] : _n();
  }
  function An() {
    me(), s(xe, hn(Vn()), !0), s(ge, "qr"), s(pt, null);
  }
  Re(() => {
    if (b() && !e(Rt)) {
      s(Rt, !0), y(""), s($e, ""), s(Ge, ""), s(Ue, ""), s(pe, ""), s(ft, !1), An(), queueMicrotask(() => {
        !b() || e(ge) !== "qr" || nn();
      });
      return;
    }
    b() || (s(Rt, !1), me());
  }), Re(() => {
    P(), s(ft, !1), me();
  }), Re(() => {
    if (typeof document > "u")
      return;
    function r() {
      document.visibilityState !== "visible" && Qe();
    }
    return document.addEventListener("visibilitychange", r), () => {
      document.removeEventListener("visibilitychange", r), me();
    };
  });
  let He = l(() => Ir(e(xe))), _t = l(() => e(He).errorKey === null ? e(He).relays.join(`
`) : null), In = l(() => e(ge) === "qr" && e(He).errorKey ? n()(e(He).errorKey) : ""), Ae = l(re), We = l(p), $t = l(() => e(Ae) || ye()), Mn = l(() => e(Ae) || e(He).errorKey !== null || !e(_t) || !!P() && e(_t) === e(pt));
  Re(() => {
    e(We) && (s(Ve, !1), Qe());
  }), Re(() => {
    b(), e(ge), P(), e($t), (!b() || e(ge) !== "qr" || !P() || !e($t)) && me();
  }), Re(() => {
    y() !== void 0 && gt.setNsec(y());
  }), Re(() => {
    y() !== void 0 && e(I) && !y() && e(I).setCustomValidity("");
  });
  function On(r) {
    s($e, r.currentTarget.value, !0), s(pe, ""), e(B) && e(B).setCustomValidity("");
  }
  function Kn() {
    e($e) && (s($e, ""), s(pe, ""), e(B)?.setCustomValidity(""), e(B)?.focus({ preventScroll: !0 }));
  }
  function Un() {
    y() && (y(""), e(I)?.setCustomValidity(""), e(I)?.focus({ preventScroll: !0 }));
  }
  function zn() {
    if (me(), e(I)) {
      const r = e(I).validity, X = e(I).value ?? "";
      if (r.valueMissing) {
        e(I).setCustomValidity(n()("loginDialog.secret_key_required")), e(I).reportValidity();
        return;
      }
      if (!X.startsWith("nsec1")) {
        e(I).setCustomValidity(n()("loginDialog.secret_must_start_nsec1")), e(I).reportValidity();
        return;
      }
      if (X.length !== 63) {
        X.length < 63 ? e(I).setCustomValidity(n()("loginDialog.secret_too_short")) : e(I).setCustomValidity(n()("loginDialog.secret_too_long")), e(I).reportValidity();
        return;
      }
      if (!e(Rn)) {
        e(I).setCustomValidity(n()("loginDialog.invalid_secret")), e(I).reportValidity();
        return;
      }
      e(I).setCustomValidity("");
    }
    j()?.();
  }
  function Hn(r) {
    switch (r) {
      case "nip07_not_available":
        return n()("loginDialog.extension_not_found");
      case "nip07_auth_error":
        return n()("loginDialog.extension_login_failed");
      default:
        return r.startsWith("nip07_") ? n()("loginDialog.extension_login_failed") : r;
    }
  }
  function Wn(r) {
    switch (r) {
      case "Invalid bunker URL":
        return n()("loginDialog.bunker_invalid");
      case "nip46_connection_failed":
        return n()("loginDialog.bunker_connection_failed");
      default:
        return r;
    }
  }
  function jn(r) {
    switch (r) {
      case "At least one public wss relay is required for nostrconnect":
        return n()("loginDialog.nostrconnect_relay_required");
      case "Nostr Connect timed out before the remote signer connected":
        return n()("loginDialog.nostrconnect_timeout");
      case "Timed out waiting for switch_relays response":
      case "Relay connection failed":
      case "Nostr Connect handshake pool is unavailable":
        return n()("loginDialog.nostrconnect_connection_failed");
      case "Timed out waiting for final relay list":
      case "Remote signer did not return final relay list":
      case "Remote signer returned an invalid final relay list":
      case "Remote signer returned an unsupported final relay":
        return n()("loginDialog.nostrconnect_relay_reconciliation_failed");
      case "Remote signer did not return any usable connection relay":
        return n()("loginDialog.nostrconnect_no_usable_final_relay");
      case "Could not connect to the local relay specified by the remote signer":
        return n()("loginDialog.nostrconnect_local_final_relay_unreachable");
      case "Communication could not be verified on the relay selected by the remote signer":
        return n()("loginDialog.nostrconnect_final_relay_verification_failed");
      case "Nostr Connect connection was cancelled":
        return "";
      default:
        return r.startsWith("Relay connection failed:") ? n()("loginDialog.nostrconnect_connection_failed") : r;
    }
  }
  async function Bn() {
    me(), s(Ue, "");
    const r = await Y()?.();
    r && s(Ue, Hn(r), !0);
  }
  function Fn(r) {
    switch (r) {
      case "parent_client_not_available":
        return n()("loginDialog.parent_client_not_available");
      case "parent_client_timeout":
        return n()("loginDialog.parent_client_timeout");
      case "parent_client_auth_rejected":
        return n()("loginDialog.parent_client_auth_rejected");
      case "parent_client_not_logged_in":
        return n()("loginDialog.parent_client_not_logged_in");
      case "parent_client_disconnected":
        return n()("loginDialog.parent_client_disconnected");
      case "parent_client_invalid_response":
        return n()("loginDialog.parent_client_invalid_response");
      case "parent_client_auth_error":
        return n()("loginDialog.parent_client_auth_error");
      default:
        return r.startsWith("parent_client_") ? n()("loginDialog.parent_client_auth_error") : r;
    }
  }
  async function Gn() {
    me(), s(Ge, "");
    const r = await M()?.();
    r && s(Ge, Fn(r), !0);
  }
  async function Qn() {
    if (me(), s(pe, ""), e(B)) {
      const O = e(B).value.trim();
      if (s($e, O, !0), e(B).validity.valueMissing) {
        s(pe, n()("loginDialog.bunker_url_required"), !0), e(B).setCustomValidity(e(pe)), e(B).reportValidity();
        return;
      }
      if (!Ur.test(O)) {
        s(pe, n()("loginDialog.bunker_invalid"), !0), e(B).setCustomValidity(e(pe)), e(B).reportValidity();
        return;
      }
      e(B).setCustomValidity("");
    }
    const r = e($e).trim(), X = await C()?.(r);
    if (X && e(B)) {
      const O = Wn(X);
      s(pe, O, !0), e(B).setCustomValidity(O), e(B).reportValidity();
      return;
    }
    s(pe, "");
  }
  function Yn(r) {
    e(ge) !== r && (s(ge, r, !0), me(), s(pt, null));
  }
  function Xn(r, X) {
    const O = [...e(xe)];
    O[r] = X, s(xe, xn(O), !0);
  }
  function Zn() {
    s(xe, [...e(xe), ""], !0);
  }
  function Jn(r) {
    s(xe, xn(e(xe).filter((X, O) => O !== r)), !0);
  }
  function er() {
    s(xe, hn(_n()), !0);
  }
  async function nn() {
    e(ge) !== "qr" || e(He).errorKey !== null || !e(_t) || (e($t) && ae()?.(), s(pt, e(_t), !0), await L()?.(e(He).relays));
  }
  function tr() {
    if (!P())
      return;
    const r = P();
    Qe(), s(Et, r, !0), s(Ve, !0), Er(r), ze = setTimeout(
      () => {
        if (ze = void 0, typeof document < "u" && document.visibilityState !== "visible") {
          Qe();
          return;
        }
        if (b() && e(ge) === "qr" && (re() || ye()) && !e(We) && P() === r && e(Et) === r) {
          s(ht, !0), ze = setTimeout(
            () => {
              s(ht, !1), ze = void 0;
            },
            $n
          );
          return;
        }
        Qe();
      },
      En
    );
  }
  async function nr() {
    if (!P())
      return !1;
    const r = await Kr(P(), "nostrconnect");
    return s(ft, r, !0), r;
  }
  let rr = l(() => Ee() ? jn(Ee()) : ""), rn = l(() => e(ge) === "qr" ? e(rr) || e(In) : "");
  function ir(r) {
    me(), r.preventDefault(), zn();
  }
  var ar = {
    get show() {
      return b();
    },
    set show(r = !1) {
      b(r), c();
    },
    get secretKey() {
      return y();
    },
    set secretKey(r) {
      y(r), c();
    },
    get onClose() {
      return E();
    },
    set onClose(r) {
      E(r), c();
    },
    get onSave() {
      return j();
    },
    set onSave(r) {
      j(r), c();
    },
    get onParentClientLogin() {
      return M();
    },
    set onParentClientLogin(r) {
      M(r), c();
    },
    get onNip07Login() {
      return Y();
    },
    set onNip07Login(r) {
      Y(r), c();
    },
    get onNip46Login() {
      return C();
    },
    set onNip46Login(r) {
      C(r), c();
    },
    get onNostrConnectStart() {
      return L();
    },
    set onNostrConnectStart(r) {
      L(r), c();
    },
    get onNostrConnectCancel() {
      return ae();
    },
    set onNostrConnectCancel(r) {
      ae(r), c();
    },
    get isParentClientAvailable() {
      return ue();
    },
    set isParentClientAvailable(r = !1) {
      ue(r), c();
    },
    get isLoadingParentClient() {
      return N();
    },
    set isLoadingParentClient(r = !1) {
      N(r), c();
    },
    get isNip07ExtensionAvailable() {
      return f();
    },
    set isNip07ExtensionAvailable(r = !1) {
      f(r), c();
    },
    get isLoadingNip07() {
      return $();
    },
    set isLoadingNip07(r = !1) {
      $(r), c();
    },
    get isLoadingNip46() {
      return g();
    },
    set isLoadingNip46(r = !1) {
      g(r), c();
    },
    get isPreparingNip46NostrConnect() {
      return re();
    },
    set isPreparingNip46NostrConnect(r = !1) {
      re(r), c();
    },
    get isWaitingNip46NostrConnect() {
      return ye();
    },
    set isWaitingNip46NostrConnect(r = !1) {
      ye(r), c();
    },
    get isHandshakeStartedNip46NostrConnect() {
      return p();
    },
    set isHandshakeStartedNip46NostrConnect(r = !1) {
      p(r), c();
    },
    get nip46NostrConnectUri() {
      return P();
    },
    set nip46NostrConnectUri(r = null) {
      P(r), c();
    },
    get nip46NostrConnectErrorMessage() {
      return Ee();
    },
    set nip46NostrConnectErrorMessage(r = "") {
      Ee(r), c();
    },
    get initialNostrConnectRelayCandidates() {
      return vt();
    },
    set initialNostrConnectRelayCandidates(r = []) {
      vt(r), c();
    },
    get isAddAccountMode() {
      return ut();
    },
    set isAddAccountMode(r = !1) {
      ut(r), c();
    },
    get localNsecAuthEnabled() {
      return rt();
    },
    set localNsecAuthEnabled(r = !0) {
      rt(r), c();
    }
  }, an = Pi(), on = R(an);
  {
    var or = (r) => {
      var X = ri(), O = o(X);
      {
        var Ce = (fe) => {
          var oe = ti(), se = o(oe), Ie = o(se, !0);
          a(se), a(oe), D(() => k(Ie, e(qt))), i(fe, oe);
        };
        V(O, (fe) => {
          e(qt) && fe(Ce);
        });
      }
      var je = u(O, 2);
      {
        var Ye = (fe) => {
          var oe = ni(), se = o(oe), Ie = o(se, !0);
          a(se), a(oe), D(() => k(Ie, e(Tt))), i(fe, oe);
        };
        V(je, (fe) => {
          e(Tt) && fe(Ye);
        });
      }
      a(X), i(r, X);
    };
    V(on, (r) => {
      (e(qt) || e(Tt)) && r(or);
    });
  }
  var sn = u(on, 2);
  {
    const r = (Ce) => {
      var je = ne(), Ye = R(je);
      {
        const fe = (oe, se) => {
          let Ie = () => se?.().props;
          {
            let Vt = l(() => n()("global.close"));
            ve(oe, $r(Ie, {
              className: "modal-close",
              shape: "square",
              get ariaLabel() {
                return e(Vt);
              },
              children: (At, bt) => {
                var yt = ii();
                i(At, yt);
              },
              $$slots: { default: !0 }
            }));
          }
        };
        Be(Ye, () => jr, (oe, se) => {
          se(oe, { child: fe, $$slots: { child: !0 } });
        });
      }
      i(Ce, je);
    };
    let X = l(() => ut() ? n()("loginDialog.add_account_title") : rt() ? n()("loginDialog.input_secret") : n()("common.login")), O = l(() => ut() ? n()("loginDialog.add_account_hint") : rt() ? n()("loginDialog.hint_input_secret") : n()("loginDialog.login_methods_hint"));
    Wr(sn, {
      onOpenChange: (Ce) => !Ce && Jt(),
      get title() {
        return e(X);
      },
      get description() {
        return e(O);
      },
      contentClass: "login-dialog",
      footerVariant: "close-button",
      get open() {
        return b();
      },
      set open(Ce) {
        b(Ce);
      },
      footer: r,
      children: (Ce, je) => {
        var Ye = wi(), fe = R(Ye);
        {
          var oe = (K) => {
            var U = oi(), F = R(U), Ne = o(F);
            {
              let A = l(() => N() ? "loading" : "");
              ve(Ne, {
                variant: "primary",
                shape: "square",
                get className() {
                  return `parent-client-login-button u-control ${e(A) ?? ""}`;
                },
                onClick: Gn,
                get disabled() {
                  return N();
                },
                children: (z, q) => {
                  var T = ne(), de = R(T);
                  {
                    var be = (w) => {
                      Te(w, { text: !0, showLoader: !0 });
                    }, Le = (w) => {
                      var H = ai(), W = u(R(H), 2), Z = o(W, !0);
                      a(W), D((ce) => k(Z, ce), [() => n()("loginDialog.login_with_parent_client")]), i(w, H);
                    };
                    V(de, (w) => {
                      N() ? w(be) : w(Le, -1);
                    });
                  }
                  i(z, T);
                },
                $$slots: { default: !0 }
              });
            }
            var le = u(Ne, 2), he = o(le, !0);
            a(le), a(F);
            var _e = u(F, 2), ke = o(_e), ie = o(ke, !0);
            a(ke), a(_e), D(
              (A, z) => {
                yn(le, 1, `parent-client-feedback ${e(Ge) ? "error" : "info"}`, "svelte-1vy8d2x"), Fe(le, "role", e(Ge) ? "alert" : "status"), k(he, A), k(ie, z);
              },
              [
                () => e(Ge) || n()("loginDialog.parent_client_hint"),
                () => n()("common.or")
              ]
            ), i(K, U);
          };
          V(fe, (K) => {
            e(Tn) && K(oe);
          });
        }
        var se = u(fe, 2), Ie = o(se);
        {
          let K = l(() => $() ? "loading" : ""), U = l(() => $() || !e(en));
          ve(Ie, {
            variant: "primary",
            shape: "square",
            get className() {
              return `nip07-login-button u-control ${e(K) ?? ""}`;
            },
            onClick: Bn,
            get disabled() {
              return e(U);
            },
            children: (F, Ne) => {
              var le = ne(), he = R(le);
              {
                var _e = (ie) => {
                  Te(ie, { text: !0, showLoader: !0 });
                }, ke = (ie) => {
                  var A = si(), z = u(R(A), 2), q = o(z, !0);
                  a(z), D((T) => k(q, T), [() => n()("loginDialog.login_with_extension")]), i(ie, A);
                };
                V(he, (ie) => {
                  $() ? ie(_e) : ie(ke, -1);
                });
              }
              i(F, le);
            },
            $$slots: { default: !0 }
          });
        }
        var Vt = u(Ie, 2);
        {
          var At = (K) => {
            var U = li(), F = o(U, !0);
            a(U), D(
              (Ne) => {
                yn(U, 1, `section-feedback ${e(Ue) ? "error" : "info"}`, "svelte-1vy8d2x"), Fe(U, "role", e(Ue) ? "alert" : "status"), k(F, Ne);
              },
              [
                () => e(Ue) || n()("loginDialog.extension_not_found")
              ]
            ), i(K, U);
          };
          V(Vt, (K) => {
            (e(Ue) || !e(en)) && K(At);
          });
        }
        a(se);
        var bt = u(se, 2), yt = o(bt), dr = o(yt, !0);
        a(yt), a(bt);
        var It = u(bt, 2), ln = o(It);
        {
          let K = l(() => e(We) ? n()("loginDialog.nostrconnect_handshake_started") : e(Ve) ? n()("loginDialog.nostrconnect_opening_signer") : n()("loginDialog.nostrconnect_open")), U = l(() => e(Ae) || !P() || e(Ve) || e(We)), F = l(() => e(Ae) && !P() || e(Ve) || e(We) ? "loading" : "");
          ve(ln, {
            type: "button",
            variant: "primary",
            shape: "square",
            get ariaLabel() {
              return e(K);
            },
            onClick: tr,
            get disabled() {
              return e(U);
            },
            get className() {
              return `nostrconnect-open-btn u-control ${e(F) ?? ""}`;
            },
            "data-testid": "nostrconnect-open-button",
            children: (Ne, le) => {
              var he = ne(), _e = R(he);
              {
                var ke = (q) => {
                  {
                    let T = l(() => n()("loginDialog.nostrconnect_preparing"));
                    Te(q, {
                      get text() {
                        return e(T);
                      },
                      showLoader: !0
                    });
                  }
                }, ie = (q) => {
                  {
                    let T = l(() => n()("loginDialog.nostrconnect_handshake_started"));
                    Te(q, {
                      get text() {
                        return e(T);
                      },
                      showLoader: !0
                    });
                  }
                }, A = (q) => {
                  {
                    let T = l(() => n()("loginDialog.nostrconnect_opening_signer"));
                    Te(q, {
                      get text() {
                        return e(T);
                      },
                      showLoader: !0
                    });
                  }
                }, z = (q) => {
                  var T = di(), de = u(R(T), 2), be = o(de, !0);
                  a(de), D((Le) => k(be, Le), [() => n()("loginDialog.remote_signer_title")]), i(q, T);
                };
                V(_e, (q) => {
                  e(Ae) && !P() ? q(ke) : e(We) ? q(ie, 1) : e(Ve) ? q(A, 2) : q(z, -1);
                });
              }
              i(Ne, he);
            },
            $$slots: { default: !0 }
          });
        }
        var dn = u(ln, 2), Mt = o(dn), cr = o(Mt, !0);
        a(Mt);
        var vr = u(Mt, 2);
        Be(vr, () => Ln, (K, U) => {
          U(K, {
            get value() {
              return e(ge);
            },
            onValueChange: (F) => Yn(F),
            class: "remote-signer-tabs",
            children: (F, Ne) => {
              var le = Ci(), he = R(le);
              Be(he, () => Sn, (A, z) => {
                z(A, {
                  class: "remote-signer-tab-list",
                  children: (q, T) => {
                    var de = ci(), be = R(de);
                    Be(be, () => Gt, (w, H) => {
                      H(w, {
                        value: "qr",
                        class: "remote-signer-tab",
                        "data-testid": "nostrconnect-qr-tab",
                        children: (W, Z) => {
                          Je();
                          var ce = Pe();
                          D((Me) => k(ce, Me), [() => n()("loginDialog.nostrconnect_qr_tab")]), i(W, ce);
                        },
                        $$slots: { default: !0 }
                      });
                    });
                    var Le = u(be, 2);
                    Be(Le, () => Gt, (w, H) => {
                      H(w, {
                        value: "bunker",
                        class: "remote-signer-tab",
                        "data-testid": "nostrconnect-bunker-tab",
                        children: (W, Z) => {
                          Je();
                          var ce = Pe();
                          D((Me) => k(ce, Me), [() => n()("loginDialog.nostrconnect_bunker_tab")]), i(W, ce);
                        },
                        $$slots: { default: !0 }
                      });
                    }), i(q, de);
                  },
                  $$slots: { default: !0 }
                });
              });
              var _e = u(he, 2);
              {
                var ke = (A) => {
                  var z = ne(), q = R(z);
                  Be(q, () => Ft, (T, de) => {
                    de(T, {
                      value: "qr",
                      class: "remote-signer-panel nostrconnect-panel",
                      children: (be, Le) => {
                        var w = bi(), H = R(w);
                        {
                          var W = (v) => {
                            var h = vi(), S = o(h);
                            {
                              let G = l(() => n()("loginDialog.nostrconnect_qr_alt"));
                              qn(S, {
                                get value() {
                                  return P();
                                },
                                get label() {
                                  return e(G);
                                }
                              });
                            }
                            a(h), i(v, h);
                          }, Z = (v) => {
                            var h = ui(), S = o(h);
                            Te(S, { text: !0, showLoader: !0 }), a(h), i(v, h);
                          };
                          V(H, (v) => {
                            P() ? v(W) : e(Ae) && v(Z, 1);
                          });
                        }
                        var ce = u(H, 2), Me = o(ce), Xe = o(Me);
                        mt(Xe);
                        var Ot = u(Xe, 2);
                        {
                          let v = l(() => n()("common.copySuccess")), h = l(() => e(Ae) || !P()), S = l(() => e(ft) ? n()("loginDialog.nostrconnect_copied") : n()("loginDialog.nostrconnect_copy"));
                          ve(Ot, {
                            type: "button",
                            variant: "copy",
                            shape: "circle",
                            contentLayout: "icon",
                            onClick: nr,
                            get floatingMessage() {
                              return e(v);
                            },
                            get disabled() {
                              return e(h);
                            },
                            className: "nostrconnect-copy-btn",
                            get ariaLabel() {
                              return e(S);
                            },
                            "data-testid": "nostrconnect-copy-button",
                            children: (G, De) => {
                              var dt = gi();
                              i(G, dt);
                            },
                            $$slots: { default: !0 }
                          });
                        }
                        a(Me), a(ce);
                        var it = u(ce, 2), te = o(it);
                        {
                          var Se = (v) => {
                            var h = Pe();
                            D((S) => k(h, S), [() => n()("loginDialog.nostrconnect_preparing")]), i(v, h);
                          }, at = (v) => {
                            {
                              let h = l(() => n()("loginDialog.nostrconnect_opening_signer"));
                              Te(v, {
                                get text() {
                                  return e(h);
                                },
                                showLoader: !0
                              });
                            }
                          }, Ze = (v) => {
                            {
                              let h = l(() => n()("loginDialog.nostrconnect_handshake_started"));
                              Te(v, {
                                get text() {
                                  return e(h);
                                },
                                showLoader: !0
                              });
                            }
                          }, Kt = (v) => {
                            var h = Pe();
                            D((S) => k(h, S), [() => n()("loginDialog.nostrconnect_waiting")]), i(v, h);
                          }, Ut = (v) => {
                            var h = Pe();
                            D((S) => k(h, S), [() => n()("loginDialog.nostrconnect_idle")]), i(v, h);
                          };
                          V(te, (v) => {
                            e(Ae) ? v(Se) : e(Ve) ? v(at, 1) : e(We) ? v(Ze, 2) : ye() ? v(Kt, 3) : v(Ut, -1);
                          });
                        }
                        a(it);
                        var ot = u(it, 2), we = o(ot), st = o(we), lt = o(st), pr = o(lt, !0);
                        a(lt);
                        var fr = u(lt, 2);
                        {
                          let v = l(() => n()("loginDialog.nostrconnect_relay_settings_description"));
                          Br(fr, {
                            side: "top",
                            sideOffset: 8,
                            get ariaLabel() {
                              return e(v);
                            },
                            children: (h, S) => {
                              var G = pi(), De = o(G), dt = o(De, !0);
                              a(De);
                              var qe = u(De, 2), Ht = o(qe, !0);
                              a(qe);
                              var xt = u(qe, 2), gn = o(xt, !0);
                              a(xt), a(G), D(
                                (Wt, yr, xr) => {
                                  k(dt, Wt), k(Ht, yr), k(gn, xr);
                                },
                                [
                                  () => n()("loginDialog.nostrconnect_relay_hint"),
                                  () => n()("loginDialog.nostrconnect_relay_update_hint"),
                                  () => n()("loginDialog.nostrconnect_relay_switch_hint")
                                ]
                              ), i(h, G);
                            },
                            $$slots: { default: !0 }
                          });
                        }
                        a(st), a(we);
                        var zt = u(we, 2);
                        Mr(zt, 21, () => e(xe), Or, (v, h, S) => {
                          var G = hi(), De = o(G);
                          mt(De);
                          var dt = u(De, 2);
                          {
                            let qe = l(() => n()("loginDialog.nostrconnect_remove_relay")), Ht = l(() => e(xe).length === 1 && !e(h).trim());
                            ve(dt, {
                              type: "button",
                              variant: "close",
                              shape: "rounded",
                              className: "nostrconnect-remove-relay-btn",
                              get ariaLabel() {
                                return e(qe);
                              },
                              onClick: () => Jn(S),
                              get disabled() {
                                return e(Ht);
                              },
                              children: (xt, gn) => {
                                var Wt = fi();
                                i(xt, Wt);
                              },
                              $$slots: { default: !0 }
                            });
                          }
                          a(G), D(
                            (qe) => {
                              jt(De, e(h)), Fe(De, "placeholder", qe);
                            },
                            [() => n()("loginDialog.nostrconnect_relay_placeholder")]
                          ), Bt("input", De, (qe) => Xn(S, qe.currentTarget.value)), i(v, G);
                        }), a(zt);
                        var cn = u(zt, 2), vn = o(cn);
                        ve(vn, {
                          type: "button",
                          variant: "primary",
                          onClick: nn,
                          get disabled() {
                            return e(Mn);
                          },
                          "data-testid": "nostrconnect-regenerate",
                          children: (v, h) => {
                            Je();
                            var S = Pe();
                            D((G) => k(S, G), [() => n()("loginDialog.nostrconnect_generate")]), i(v, S);
                          },
                          $$slots: { default: !0 }
                        });
                        var un = u(vn, 2);
                        ve(un, {
                          type: "button",
                          variant: "secondary",
                          onClick: Zn,
                          children: (v, h) => {
                            Je();
                            var S = Pe();
                            D((G) => k(S, G), [() => n()("loginDialog.nostrconnect_add_relay")]), i(v, S);
                          },
                          $$slots: { default: !0 }
                        });
                        var hr = u(un, 2);
                        ve(hr, {
                          type: "button",
                          variant: "secondary",
                          onClick: er,
                          "data-testid": "nostrconnect-reset-relays",
                          children: (v, h) => {
                            Je();
                            var S = Pe();
                            D((G) => k(S, G), [() => n()("loginDialog.nostrconnect_reset_relays")]), i(v, S);
                          },
                          $$slots: { default: !0 }
                        }), a(cn), a(ot);
                        var _r = u(ot, 2);
                        {
                          var br = (v) => {
                            var h = _i(), S = o(h, !0);
                            a(h), D(() => k(S, e(rn))), i(v, h);
                          };
                          V(_r, (v) => {
                            e(rn) && v(br);
                          });
                        }
                        D(
                          (v) => {
                            jt(Xe, P() || ""), Fe(Xe, "title", P() || ""), k(pr, v);
                          },
                          [() => n()("loginDialog.nostrconnect_edit_relays")]
                        ), i(be, w);
                      },
                      $$slots: { default: !0 }
                    });
                  }), i(A, z);
                }, ie = (A) => {
                  var z = ne(), q = R(z);
                  Be(q, () => Ft, (T, de) => {
                    de(T, {
                      value: "bunker",
                      class: "remote-signer-panel bunker-panel",
                      children: (be, Le) => {
                        var w = mi(), H = o(w), W = o(H), Z = o(W);
                        mt(Z), bn(Z, (te) => s(B, te), () => e(B));
                        var ce = u(Z, 2);
                        {
                          var Me = (te) => {
                            ve(te, {
                              variant: "secondary",
                              type: "button",
                              className: "clear-input-btn",
                              get ariaLabel() {
                                return e(tn);
                              },
                              onClick: Kn,
                              get onmousedown() {
                                return Ct;
                              },
                              get ontouchstart() {
                                return Ct;
                              },
                              get disabled() {
                                return g();
                              },
                              children: (Se, at) => {
                                var Ze = yi();
                                i(Se, Ze);
                              },
                              $$slots: { default: !0 }
                            });
                          };
                          V(ce, (te) => {
                            e($e).length > 0 && te(Me);
                          });
                        }
                        a(W);
                        var Xe = u(W, 2);
                        {
                          let te = l(() => g() ? "loading" : "");
                          ve(Xe, {
                            variant: "primary",
                            shape: "square",
                            type: "submit",
                            get disabled() {
                              return g();
                            },
                            get className() {
                              return `bunker-connect-btn u-control ${e(te) ?? ""}`;
                            },
                            children: (Se, at) => {
                              var Ze = ne(), Kt = R(Ze);
                              {
                                var Ut = (we) => {
                                  Te(we, { showLoader: !0 });
                                }, ot = (we) => {
                                  var st = Pe();
                                  D((lt) => k(st, lt), [() => n()("loginDialog.bunker_connect")]), i(we, st);
                                };
                                V(Kt, (we) => {
                                  g() ? we(Ut) : we(ot, -1);
                                });
                              }
                              i(Se, Ze);
                            },
                            $$slots: { default: !0 }
                          });
                        }
                        a(H);
                        var Ot = u(H, 2);
                        {
                          var it = (te) => {
                            var Se = xi(), at = o(Se, !0);
                            a(Se), D(() => k(at, e(pe))), i(te, Se);
                          };
                          V(Ot, (te) => {
                            e(pe) && te(it);
                          });
                        }
                        a(w), D(() => {
                          jt(Z, e($e)), Z.disabled = g();
                        }), mn("submit", w, (te) => {
                          te.preventDefault(), Qn();
                        }), Bt("input", Z, On), i(be, w);
                      },
                      $$slots: { default: !0 }
                    });
                  }), i(A, z);
                };
                V(_e, (A) => {
                  e(ge) === "qr" ? A(ke) : A(ie, -1);
                });
              }
              i(F, le);
            },
            $$slots: { default: !0 }
          });
        }), a(dn), a(It);
        var ur = u(It, 2);
        {
          var gr = (K) => {
            var U = ki(), F = R(U), Ne = o(F), le = o(Ne, !0);
            a(Ne), a(F);
            var he = u(F, 2), _e = o(he), ke = u(o(_e), 2), ie = o(ke, !0);
            a(ke), a(_e);
            var A = u(_e, 2), z = o(A), q = o(z), T = o(q);
            mt(T), bn(T, (w) => s(I, w), () => e(I));
            var de = u(T, 2);
            {
              var be = (w) => {
                ve(w, {
                  variant: "secondary",
                  type: "button",
                  className: "clear-input-btn",
                  get ariaLabel() {
                    return e(tn);
                  },
                  onClick: Un,
                  get onmousedown() {
                    return Ct;
                  },
                  get ontouchstart() {
                    return Ct;
                  },
                  children: (H, W) => {
                    var Z = Ni();
                    i(H, Z);
                  },
                  $$slots: { default: !0 }
                });
              };
              V(de, (w) => {
                y().length > 0 && w(be);
              });
            }
            a(q);
            var Le = u(q, 2);
            ve(Le, {
              variant: "primary",
              shape: "square",
              type: "submit",
              className: "save-btn u-control",
              children: (w, H) => {
                Je();
                var W = Pe();
                D((Z) => k(W, Z), [() => n()("loginDialog.save")]), i(w, W);
              },
              $$slots: { default: !0 }
            }), a(z), a(A), a(he), D(
              (w, H, W) => {
                k(le, w), k(ie, H), Fe(T, "title", W);
              },
              [
                () => n()("common.or"),
                () => n()("loginDialog.input_secret"),
                () => n()("loginDialog.hint_input_secret")
              ]
            ), mn("submit", A, ir), Bt("input", T, () => e(I)?.setCustomValidity("")), Hr(T, y), i(K, U);
          };
          V(ur, (K) => {
            rt() && K(gr);
          });
        }
        D(
          (K, U) => {
            k(dr, K), k(cr, U);
          },
          [
            () => n()("common.or"),
            () => n()("loginDialog.nostrconnect_input_title")
          ]
        ), i(Ce, Ye);
      },
      $$slots: { footer: !0, default: !0 }
    });
  }
  var sr = u(sn, 2);
  Tr(sr, {
    get show() {
      return e(ht);
    },
    variant: "top-right",
    children: (r, X) => {
      var O = Di(), Ce = o(O, !0);
      a(O), D((je) => k(Ce, je), [() => n()("loginDialog.nostrconnect_direct_open_hint")]), i(r, O);
    },
    $$slots: { default: !0 }
  }), i(ee, an);
  var lr = tt(ar);
  return m(), lr;
}
zr(["input"]);
nt(
  Si,
  {
    show: {},
    secretKey: {},
    onClose: {},
    onSave: {},
    onParentClientLogin: {},
    onNip07Login: {},
    onNip46Login: {},
    onNostrConnectStart: {},
    onNostrConnectCancel: {},
    isParentClientAvailable: {},
    isLoadingParentClient: {},
    isNip07ExtensionAvailable: {},
    isLoadingNip07: {},
    isLoadingNip46: {},
    isPreparingNip46NostrConnect: {},
    isWaitingNip46NostrConnect: {},
    isHandshakeStartedNip46NostrConnect: {},
    nip46NostrConnectUri: {},
    nip46NostrConnectErrorMessage: {},
    initialNostrConnectRelayCandidates: {},
    isAddAccountMode: {},
    localNsecAuthEnabled: {}
  },
  [],
  [],
  { mode: "open" }
);
export {
  Si as default
};
